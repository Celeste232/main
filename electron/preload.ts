import { contextBridge, ipcRenderer } from 'electron';
import type { Settings } from './store.js';

const api = {
  getSettings: (): Promise<Settings> => ipcRenderer.invoke('settings:get'),
  setSettings: (partial: Partial<Settings>): Promise<Settings> =>
    ipcRenderer.invoke('settings:set', partial),
  resetSettings: (): Promise<Settings> => ipcRenderer.invoke('settings:reset'),
  setIgnoreMouse: (ignore: boolean) =>
    ipcRenderer.send('window:set-ignore-mouse', ignore),
  getDisplayBounds: (): Promise<{ x: number; y: number; width: number; height: number }> =>
    ipcRenderer.invoke('display:get-bounds'),
  getCursorPos: (): Promise<{ x: number; y: number }> =>
    ipcRenderer.invoke('cursor:get'),
  quit: () => ipcRenderer.send('app:quit'),
  hide: () => ipcRenderer.send('window:hide'),
  show: () => ipcRenderer.send('window:show'),
  flashToFront: () => ipcRenderer.send('window:flash-to-front'),
  onFindCat: (cb: () => void): (() => void) => {
    const handler = () => cb();
    ipcRenderer.on('cat:find', handler);
    return () => {
      ipcRenderer.removeListener('cat:find', handler);
    };
  },
};

contextBridge.exposeInMainWorld('api', api);

export type Api = typeof api;
