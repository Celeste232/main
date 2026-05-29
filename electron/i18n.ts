import type { Settings } from './store.js';

const TRAY_STRINGS = {
  ko: {
    pause: '잠깐 끄기',
    unpause: '다시 켜기',
    findCat: '고양이 찾기',
    layer: '화면 위치',
    layerFront: '맨 앞',
    layerNormal: '보통',
    layerBack: '맨 뒤',
    quit: '종료',
    tooltip: 'Cat House',
    tooltipPaused: '고양이 멈춤 (잠시 꺼둠)',
    showCat: 'Show Cat',
    hideCat: 'Hide Cat',
  },
  en: {
    pause: 'Pause',
    unpause: 'Resume',
    findCat: 'Find cat',
    layer: 'Layer',
    layerFront: 'Front',
    layerNormal: 'Normal',
    layerBack: 'Back',
    quit: 'Quit',
    tooltip: 'Cat House',
    tooltipPaused: 'Cat paused',
    showCat: 'Show cat',
    hideCat: 'Hide cat',
  },
} as const;

export function getTrayStrings(language: Settings['language']) {
  return TRAY_STRINGS[language] ?? TRAY_STRINGS.ko;
}
