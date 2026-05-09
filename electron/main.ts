import { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { settingsStore, DEFAULT_SETTINGS, type Settings } from './store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

// Icons live in build/ at the repo root. In dev they're at APP_ROOT/build,
// in a packaged app they're bundled inside the app resources.
const ICON_DIR = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'build')
  : path.join(process.resourcesPath, 'build');
const APP_ICON = path.join(ICON_DIR, process.platform === 'win32' ? 'icon.ico' : 'icon.png');
const TRAY_ICON = path.join(ICON_DIR, 'tray-icon.png');

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function getLeftmostDisplay() {
  const displays = screen.getAllDisplays();
  return displays.reduce((leftmost, d) =>
    d.bounds.x < leftmost.bounds.x ? d : leftmost,
  displays[0]);
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
    alwaysOnTop: settings.alwaysOnTop,
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
  if (settings.alwaysOnTop) {
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
  }

  // For local Xvfb testing: skip click-through if env var is set.
  if (process.env.CAT_HOUSE_DEBUG_NO_PASSTHROUGH === '1') {
    mainWindow.setIgnoreMouseEvents(false);
  }

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  let icon = nativeImage.createFromPath(TRAY_ICON);
  if (icon.isEmpty()) {
    icon = nativeImage.createEmpty();
  } else if (process.platform === 'darwin') {
    // 16px is the standard menu-bar size on macOS.
    icon = icon.resize({ width: 16, height: 16 });
  }
  tray = new Tray(icon);
  tray.setToolTip('Cat House');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Show Cat', click: () => mainWindow?.show() },
    { label: 'Hide Cat', click: () => mainWindow?.hide() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]));
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
    if ('alwaysOnTop' in partial && mainWindow) {
      mainWindow.setAlwaysOnTop(next.alwaysOnTop, next.alwaysOnTop ? 'screen-saver' : 'normal');
    }
    return next;
  });

  ipcMain.handle('settings:reset', () => {
    settingsStore.set(DEFAULT_SETTINGS);
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

  ipcMain.on('window:focus-mode', (_e, enabled: boolean) => {
    if (!mainWindow) return;
    if (enabled) {
      mainWindow.setAlwaysOnTop(false);
      mainWindow.blur();
      if (process.platform === 'darwin') {
        mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false });
      }
    } else {
      const aot = settingsStore.get().alwaysOnTop;
      mainWindow.setAlwaysOnTop(aot, aot ? 'screen-saver' : 'normal');
    }
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
