import Store from 'electron-store';

export interface Settings {
  catName: string;
  catSkin: 'png' | 'svg-doodle';
  activityLevel: 'calm' | 'normal' | 'energetic';
  showSpeechBubble: boolean;
  launchAtStartup: boolean;
  alwaysOnTop: boolean;
  soundEnabled: boolean;
  volume: number;
  hideCat: boolean;
  roamArea: 'full' | 'near-house' | 'at-house';
  focusMode: boolean;
  /** front = always on top, back = pushed behind, normal = standard stacking. */
  windowLayer: 'front' | 'normal' | 'back';
  /** Hide the whole window. Tray icon stays visible to bring it back. */
  paused: boolean;
  housePosition: { x: number; y: number };
  foodLevel: number;
  waterLevel: number;
  affinity: number;
}

export const DEFAULT_SETTINGS: Settings = {
  catName: '나비',
  catSkin: 'png',
  activityLevel: 'normal',
  showSpeechBubble: true,
  launchAtStartup: false,
  alwaysOnTop: true,
  soundEnabled: true,
  volume: 0.5,
  hideCat: false,
  roamArea: 'full',
  focusMode: false,
  windowLayer: 'front',
  paused: false,
  housePosition: { x: 200, y: 400 },
  foodLevel: 1,
  waterLevel: 1,
  affinity: 0,
};

const store = new Store<Settings>({
  name: 'cat-house-settings',
  defaults: DEFAULT_SETTINGS,
});

export const settingsStore = {
  get(): Settings {
    return { ...DEFAULT_SETTINGS, ...(store as unknown as { store: Settings }).store };
  },
  set(value: Settings) {
    (store as unknown as { store: Settings }).store = value;
  },
  update(partial: Partial<Settings>): Settings {
    const next = { ...this.get(), ...partial };
    this.set(next);
    return next;
  },
};
