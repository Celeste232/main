import Store from 'electron-store';

export interface Settings {
  catName: string;
  catSkin: 'png' | 'svg-doodle';
  language: 'ko' | 'en' | 'ja' | 'zh';
  activityLevel: 'calm' | 'normal' | 'energetic';
  showSpeechBubble: boolean;
  launchAtStartup: boolean;
  alwaysOnTop: boolean;
  soundEnabled: boolean;
  /** Which synthesized meow to play: 1 = 기본, 2 = 아기, 3 = 굵은. */
  soundType: 1 | 2 | 3;
  volume: number;
  hideCat: boolean;
  roamArea: 'at-house' | 'near-house' | 'edges' | 'full';
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
  catSkin: 'svg-doodle',
  language: 'ko',
  activityLevel: 'normal',
  showSpeechBubble: true,
  launchAtStartup: false,
  alwaysOnTop: true,
  soundEnabled: true,
  soundType: 1,
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
  name: 'meow-mode-settings',
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
