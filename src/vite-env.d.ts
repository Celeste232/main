/// <reference types="vite/client" />

// Injected by vite `define` — true in the Fox Mode build (VITE_FOX=1), false in
// the cat app. Lets the renderer force the fox skin + swap cat wording for fox.
declare const __IS_FOX__: boolean;
