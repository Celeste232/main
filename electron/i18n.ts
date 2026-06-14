import { app } from 'electron';
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
    tooltip: 'Meow Mode',
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
    tooltip: 'Meow Mode',
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
    tooltip: 'Meow Mode',
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
    tooltip: 'Meow Mode',
    tooltipPaused: '猫咪暂停中',
  },
};

// The Fox Mode app bundle is named "Fox Mode" — swap cat wording for fox in the
// tray when that's the build we're running.
const FOX_WORDS: Record<Settings['language'], [string | RegExp, string][]> = {
  ko: [[/고양이/g, '여우'], ['Meow Mode', 'Fox Mode']],
  en: [['Meow Mode', 'Fox Mode'], [/\bcat\b/gi, 'fox']],
  ja: [['Meow Mode', 'Fox Mode'], [/ねこ/g, 'きつね'], [/猫/g, '狐']],
  zh: [['Meow Mode', 'Fox Mode'], [/猫咪/g, '狐狸'], [/猫/g, '狐']],
};

export function getTrayStrings(language: Settings['language']) {
  const base = TRAY_STRINGS[language] ?? TRAY_STRINGS.ko;
  if (!app.getName().toLowerCase().includes('fox')) return base;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(base)) {
    let str = v;
    for (const [from, to] of FOX_WORDS[language] ?? FOX_WORDS.ko) {
      str = typeof from === 'string' ? str.split(from).join(to) : str.replace(from, to);
    }
    out[k] = str;
  }
  return out as typeof base;
}
