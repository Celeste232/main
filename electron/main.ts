import { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage } from 'electron';
import type { NativeImage } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { settingsStore, DEFAULT_SETTINGS, type Settings } from './store.js';
import { getTrayStrings } from './i18n.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

const ICON_DIR = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'build')
  : path.join(process.resourcesPath, 'build');
const APP_ICON = path.join(ICON_DIR, process.platform === 'win32' ? 'icon.ico' : 'icon.png');
const TRAY_ICON = path.join(ICON_DIR, 'tray-icon.png');
const TRAY_ICON_PAUSED = path.join(ICON_DIR, 'tray-icon-paused.png');

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function getLeftmostDisplay() {
  const displays = screen.getAllDisplays();
  return displays.reduce((leftmost, d) =>
    d.bounds.x < leftmost.bounds.x ? d : leftmost,
  displays[0]);
}

function applyWindowLayer(layer: Settings['windowLayer']) {
  if (!mainWindow) return;
  switch (layer) {
    case 'front':
      mainWindow.setAlwaysOnTop(true, 'screen-saver');
      break;
    case 'normal':
      mainWindow.setAlwaysOnTop(false);
      break;
    case 'back':
      mainWindow.setAlwaysOnTop(false);
      mainWindow.blur();
      if (process.platform === 'darwin') {
        mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false });
      }
      break;
  }
}

function applyPaused(paused: boolean) {
  if (!mainWindow) return;
  if (paused) {
    mainWindow.hide();
  } else {
    mainWindow.show();
  }
  refreshTray();
}

function createWindow() {
  const display = getLeftmostDisplay();
  const settings = settingsStore.get();

  mainWindow = new BrowserWindow({
    x: display.bounds.x,
    y: display.bounds.y,
    width: display.bounds.width,
    height: display.bounds.height,
    icon: APP_ICON,
    frame: false,
    transparent: true,
    alwaysOnTop: settings.windowLayer === 'front',
    skipTaskbar: true,
    resizable: false,
    movable: false,
    focusable: true,
    hasShadow: false,
    fullscreenable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setIgnoreMouseEvents(true, { forward: true });
  applyWindowLayer(settings.windowLayer);

  if (process.env.CAT_HOUSE_DEBUG_NO_PASSTHROUGH === '1') {
    mainWindow.setIgnoreMouseEvents(false);
  }

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    if (!settingsStore.get().paused) mainWindow?.show();
  });

  // macOS sometimes drops the click-through forwarding when the window
  // loses and regains focus. Re-apply on every focus to be safe.
  mainWindow.on('focus', () => {
    if (process.env.CAT_HOUSE_DEBUG_NO_PASSTHROUGH === '1') return;
    mainWindow?.setIgnoreMouseEvents(true, { forward: true });
  });
  mainWindow.on('show', () => {
    if (process.env.CAT_HOUSE_DEBUG_NO_PASSTHROUGH === '1') return;
    mainWindow?.setIgnoreMouseEvents(true, { forward: true });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function loadTrayIcon(paused: boolean): NativeImage {
  const file = paused ? TRAY_ICON_PAUSED : TRAY_ICON;
  let icon = nativeImage.createFromPath(file);
  if (icon.isEmpty()) icon = nativeImage.createFromPath(TRAY_ICON);
  if (icon.isEmpty()) return nativeImage.createEmpty();
  if (process.platform === 'darwin') icon = icon.resize({ width: 16, height: 16 });
  return icon;
}

function refreshTray() {
  if (!tray) return;
  const settings = settingsStore.get();
  const t = getTrayStrings(settings.language);
  tray.setImage(loadTrayIcon(settings.paused));
  tray.setToolTip(settings.paused ? t.tooltipPaused : t.tooltip);

  const checked = (value: string, current: string) => value === current;
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: settings.paused ? t.unpause : t.pause,
      click: () => {
        const next = !settingsStore.get().paused;
        settingsStore.update({ paused: next });
        applyPaused(next);
      },
    },
    {
      label: t.findCat,
      enabled: !settings.paused,
      click: () => {
        if (!mainWindow) return;
        if (settingsStore.get().windowLayer === 'back') {
          mainWindow.setAlwaysOnTop(true, 'screen-saver');
          mainWindow.show();
          mainWindow.focus();
          setTimeout(() => {
            if (!mainWindow) return;
            applyWindowLayer(settingsStore.get().windowLayer);
          }, 2500);
        }
        mainWindow.webContents.send('cat:find');
      },
    },
    { type: 'separator' },
    {
      label: t.layer,
      submenu: [
        {
          label: t.layerFront,
          type: 'radio',
          checked: checked('front', settings.windowLayer),
          click: () => updateLayer('front'),
        },
        {
          label: t.layerNormal,
          type: 'radio',
          checked: checked('normal', settings.windowLayer),
          click: () => updateLayer('normal'),
        },
        {
          label: t.layerBack,
          type: 'radio',
          checked: checked('back', settings.windowLayer),
          click: () => updateLayer('back'),
        },
      ],
    },
    { type: 'separator' },
    { label: t.quit, click: () => app.quit() },
  ]));
}

function updateLayer(layer: Settings['windowLayer']) {
  settingsStore.update({ windowLayer: layer });
  applyWindowLayer(layer);
  refreshTray();
}

function createTray() {
  tray = new Tray(loadTrayIcon(settingsStore.get().paused));
  // Left-click toggles pause on macOS/linux; on win32 left-click shows menu by default.
  tray.on('click', () => {
    const next = !settingsStore.get().paused;
    settingsStore.update({ paused: next });
    applyPaused(next);
  });
  refreshTray();
}

function setDockIcon() {
  if (process.platform === 'darwin' && app.dock) {
    const dockIcon = nativeImage.createFromPath(path.join(ICON_DIR, 'icon.png'));
    if (!dockIcon.isEmpty()) app.dock.setIcon(dockIcon);
  }
}

function registerIpc() {
  ipcMain.handle('settings:get', () => settingsStore.get());

  ipcMain.handle('settings:set', (_e, partial: Partial<Settings>) => {
    const next = settingsStore.update(partial);
    if ('windowLayer' in partial) applyWindowLayer(next.windowLayer);
    if ('paused' in partial) applyPaused(next.paused);
    refreshTray();
    return next;
  });

  ipcMain.handle('settings:reset', () => {
    settingsStore.set(DEFAULT_SETTINGS);
    applyWindowLayer(DEFAULT_SETTINGS.windowLayer);
    applyPaused(DEFAULT_SETTINGS.paused);
    refreshTray();
    return DEFAULT_SETTINGS;
  });

  ipcMain.on('window:set-ignore-mouse', (_e, ignore: boolean) => {
    if (!mainWindow) return;
    if (process.env.CAT_HOUSE_DEBUG_NO_PASSTHROUGH === '1') return;
    if (ignore) {
      mainWindow.setIgnoreMouseEvents(true, { forward: true });
    } else {
      mainWindow.setIgnoreMouseEvents(false);
    }
  });

  ipcMain.handle('display:get-bounds', () => {
    const display = getLeftmostDisplay();
    return display.bounds;
  });

  ipcMain.handle('cursor:get', () => {
    const display = getLeftmostDisplay();
    const p = screen.getCursorScreenPoint();
    return { x: p.x - display.bounds.x, y: p.y - display.bounds.y };
  });

  ipcMain.on('app:quit', () => app.quit());
  ipcMain.on('window:hide', () => mainWindow?.hide());
  ipcMain.on('window:show', () => mainWindow?.show());

  // Briefly bring the window to the front so the user can spot the cat,
  // then restore the previous layer.
  ipcMain.on('window:flash-to-front', () => {
    if (!mainWindow) return;
    const layer = settingsStore.get().windowLayer;
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    mainWindow.show();
    mainWindow.focus();
    setTimeout(() => {
      if (!mainWindow) return;
      applyWindowLayer(layer);
    }, 2500);
  });
}

app.whenReady().then(() => {
  setDockIcon();
  registerIpc();
  createTray();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

if (process.platform === 'win32') {
  app.setLoginItemSettings({
    openAtLogin: settingsStore.get().launchAtStartup,
  });
}
