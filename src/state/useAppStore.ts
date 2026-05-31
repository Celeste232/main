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
  | 'startled'
  | 'loaf'
  | 'sprawl'
  | 'held'
  | 'happy'
  | 'meow'
  | 'flop'
  | 'sparkle'
  | 'caught'
  | 'sneeze'
  | 'pounce'
  | 'roll'
  | 'shake'
  | 'slip'
  | 'superman'
  | 'dangle'
  | 'climb'
  | 'box'
  | 'zoomies'
  | 'headbonk'
  | 'peek'
  | 'napping'
  | 'knead'
  | 'sulk';

export interface CatState {
  action: CatAction;
  x: number;
  y: number;
  facing: 'left' | 'right';
  message: string | null;
  /** When non-null, the behavior scheduler must not change action. */
  locked: 'in-house' | 'held' | null;
}

export interface CatActionHandles {
  callToHouse: () => void;
  putInHouse: () => void;
  releaseFromHouse: () => void;
  findCat: () => void;
}

interface AppState {
  settings: Settings | null;
  cat: CatState;
  housePos: { x: number; y: number };
  bowlsVisible: boolean;
  settingsOpen: boolean;
  catActions: CatActionHandles | null;
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
    x: 520,
    y: 480,
    facing: 'left',
    message: null,
    locked: null,
  },
  housePos: { x: 200, y: 400 },
  bowlsVisible: true,
  settingsOpen: false,
  catActions: null,

  setSettings: (s) => set({ settings: s, housePos: s.housePosition }),

  patchSettings: async (p) => {
    // Optimistic update so clicks feel instant (no IPC round-trip wait).
    const current = get().settings;
    if (current) set({ settings: { ...current, ...p } });
    if (p.housePosition) set({ housePos: p.housePosition });
    const next = await window.api.setSettings(p);
    set({ settings: next });
  },

  setCat: (patch) => set({ cat: { ...get().cat, ...patch } }),

  setHousePos: (pos) => {
    set({ housePos: pos });
    void window.api.setSettings({ housePosition: pos });
  },

  toggleSettings: () => set({ settingsOpen: !get().settingsOpen }),
  setSettingsOpen: (open) => set({ settingsOpen: open }),
}));
