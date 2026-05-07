import { create } from 'zustand';
import type { Settings } from '../../electron/store';

export type CatAction =
  | 'idle'
  | 'walking'
  | 'sitting'
  | 'sleeping'
  | 'grooming'
  | 'stretching'
  | 'yawning'
  | 'tail-wag'
  | 'jumping'
  | 'curious'
  | 'eating'
  | 'drinking'
  | 'play-cursor'
  | 'in-house'
  | 'startled';

export interface CatState {
  action: CatAction;
  x: number;
  y: number;
  facing: 'left' | 'right';
  message: string | null;
}

interface AppState {
  settings: Settings | null;
  cat: CatState;
  housePos: { x: number; y: number };
  bowlsVisible: boolean;
  settingsOpen: boolean;
  setSettings: (s: Settings) => void;
  patchSettings: (p: Partial<Settings>) => Promise<void>;
  setCat: (patch: Partial<CatState>) => void;
  setHousePos: (pos: { x: number; y: number }) => void;
  toggleSettings: () => void;
  setSettingsOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  settings: null,
  cat: {
    action: 'idle',
    x: 400,
    y: 500,
    facing: 'right',
    message: null,
  },
  housePos: { x: 200, y: 400 },
  bowlsVisible: true,
  settingsOpen: false,

  setSettings: (s) => set({ settings: s, housePos: s.housePosition }),

  patchSettings: async (p) => {
    const next = await window.api.setSettings(p);
    set({ settings: next });
    if (p.housePosition) set({ housePos: p.housePosition });
  },

  setCat: (patch) => set({ cat: { ...get().cat, ...patch } }),

  setHousePos: (pos) => {
    set({ housePos: pos });
    void window.api.setSettings({ housePosition: pos });
  },

  toggleSettings: () => set({ settingsOpen: !get().settingsOpen }),
  setSettingsOpen: (open) => set({ settingsOpen: open }),
}));
