# Meow Mode — 수정 기록 (코드 포함)

버그 수정이 들어갈 때마다 여기에 기록. 위가 최신.
형식: 증상 → 원인 → 수정 코드 → 바뀐 파일.

---

## v0.2.10 — 메뉴/설정 패널 클릭이 뒤에 있는 앱으로 새는 버그 (2026-06-12 설치 확인)

### 증상
- 설정 메뉴나 닫기(X) 버튼을 누르면 기능이 작동 안 함
- 클릭이 먀우모드 창을 통과해서 뒤에 있는 다른 앱/창이 눌림
- 종료 같은 "한 번만 닿으면 되는" 버튼만 되는 것처럼 보였음

### 원인
`electron/main.ts`의 윈도우 `focus` 핸들러가 포커스를 얻을 때마다 **무조건** 클릭통과를 다시 켰음 (`setIgnoreMouseEvents(true)`).

다른 앱을 쓰다가 먀우모드 버튼을 클릭하면:
1. 그 클릭으로 먀우모드 창이 포커스를 얻음
2. focus 핸들러가 **클릭 도중에** 클릭통과를 다시 켬
3. pointerup이 뒤에 있는 앱으로 샘 → 토글은 안 먹히고 뒤 창이 눌림

### 수정 코드 (`electron/main.ts`, 커밋 `dbb0c77`)

핵심 1 — 렌더러의 최근 패스스루 결정을 변수로 기억:

```ts
// The renderer's most recent passthrough decision. focus/visibility changes
// re-assert THIS, instead of hard-coding click-through back on — forcing it on
// used to clobber an in-progress click on the settings panel, so the click
// leaked through to whatever app was behind us.
let mouseIgnored = true;

function setMouseIgnored(ignore: boolean) {
  mouseIgnored = ignore;
  if (!mainWindow) return;
  if (ignore) mainWindow.setIgnoreMouseEvents(true, { forward: true });
  else mainWindow.setIgnoreMouseEvents(false);
}
```

핵심 2 — focus/show는 "기억해둔 상태"를 재적용 (켜기를 강제하지 않음), blur만 강제로 패스스루:

```ts
mainWindow.on('focus', () => {
  if (process.env.CAT_HOUSE_DEBUG_NO_PASSTHROUGH === '1') return;
  setMouseIgnored(mouseIgnored);   // ← 이전: setIgnoreMouseEvents(true) 강제
});
mainWindow.on('show', () => {
  if (process.env.CAT_HOUSE_DEBUG_NO_PASSTHROUGH === '1') return;
  setMouseIgnored(mouseIgnored);   // ← 동일
});
// 포커스가 떠날 때만 패스스루 강제 — 커서가 갇히는 상태 방지
mainWindow.on('blur', () => {
  if (process.env.CAT_HOUSE_DEBUG_NO_PASSTHROUGH === '1') return;
  setMouseIgnored(true);
});
```

핵심 3 — 첫 클릭이 "창 활성화"로만 먹히지 않게:

```ts
new BrowserWindow({
  // ...
  // Deliver the first click to content even when we aren't the key window,
  // so clicking the cat / house / settings works on the first try instead of
  // the click only activating the window.
  acceptFirstMouse: true,
  // ...
});
```

핵심 4 — IPC 핸들러도 같은 함수로 통일:

```ts
ipcMain.on('window:set-ignore-mouse', (_e, ignore: boolean) => {
  if (!mainWindow) return;
  if (process.env.CAT_HOUSE_DEBUG_NO_PASSTHROUGH === '1') return;
  setMouseIgnored(ignore);   // ← 이전: if/else로 직접 setIgnoreMouseEvents
});
```

### 바뀐 파일
- `electron/main.ts` (+31 / −17)
- `package.json`, `package-lock.json` (0.2.9 → 0.2.10 범프)

### 배경 — v0.2.9에서 클릭통과 체계가 바뀌었음
- `d68ef8f` fix: reliable click-through via OS cursor polling
- `c9ce349` fix: main-process cursor clock drives click-through

렌더러 mousemove 대신 **메인 프로세스가 OS 커서 위치를 폴링**해서 클릭통과를 결정하는 구조로 변경. 이 구조 자체는 유지되고, 0.2.10은 focus 핸들러가 그 결정을 덮어쓰던 것만 고침.

### 검증
- 2026-06-12 로컬 Mac에서 0.2.10 빌드 → /Applications 설치 → 실행 확인
- `npx tsc -b --noEmit` 통과
