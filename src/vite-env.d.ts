/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to '1' in the Fox Mode build so the app always renders the fox. */
  readonly VITE_FOX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
