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
  },
  ja: {
    pause: 'ちょっと止める',
    unpause: 'もう一度つける',
    findCat: 'ねこをさがす',
    layer: '画面位置',
    layerFront: '最前',
    layerNormal: 'ふつう',
    layerBack: '最背',
    quit: '終了',
    tooltip: 'Cat House',
    tooltipPaused: 'ねこ停止中',
  },
  zh: {
    pause: '暂停',
    unpause: '继续',
    findCat: '找猫咪',
    layer: '窗口层',
    layerFront: '最前',
    layerNormal: '中间',
    layerBack: '最后',
    quit: '退出',
    tooltip: 'Cat House',
    tooltipPaused: '猫咪暂停中',
  },
};

export function getTrayStrings(language: Settings['language']) {
  return TRAY_STRINGS[language] ?? TRAY_STRINGS.ko;
}
