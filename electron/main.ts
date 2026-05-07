import { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { settingsStore, DEFAULT_SETTINGS, type Settings } from './store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

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
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setToolTip('Cat House');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Show Cat', click: () => mainWindow?.show() },
    { label: 'Hide Cat', click: () => mainWindow?.hide() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]));
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
}

app.whenReady().then(() => {
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
