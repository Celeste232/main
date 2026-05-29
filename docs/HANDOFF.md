# Meow Mode — 인수인계서 (로컬 Claude용)

이 문서는 클라우드에서 작업하던 Claude가 본인 Mac에서 돌아가는 로컬 Claude에게 프로젝트를 넘기는 인수인계서. 처음 보는 사람도 이거 하나만 읽으면 바로 이어갈 수 있게 작성됨.

마지막 업데이트: 판매 준비 시작 시점 (브랜치 `claude/meow-mode-interactions-pFJxU`)

---

## ⚡ 최근 변경 (이전 인수인계 이후 추가됨)

- 그릇 클릭이 안 채워지던 버그 fix — 고양이 위에 그릇이 있을 때 클릭 흡수되던 문제 (Cat.tsx에서 클릭은 forward, 드래그만 capture)
- `windowLayer` 설정 추가 (`front` / `normal` / `back`) — `alwaysOnTop`, `focusMode` 둘 다 deprecated. windowLayer로 통합
- `paused` 설정 추가 — 잠깐 끄기. 윈도우 hide. 트레이 아이콘은 유지
- 트레이 메뉴 개편: 잠깐 끄기/다시 켜기 + 화면 위치 라디오 (맨 앞/보통/맨 뒤) + 종료. 좌클릭으로 pause 토글
- `build/tray-icon-paused.png` — Pause 상태에서 보여지는 'z' 마크 트레이 아이콘
- 새 액션 5개: `happy`, `meow`, `flop`, `sparkle`, `caught`. ACTIVITY_BIAS 가중치 다 들어감. 먹기 끝나면 `happy` 자세로 잠깐 전환
- 라이선스(MIT) + `LICENSE` 파일 + `package.json` 메타데이터 정돈 (`author`, `homepage`, `repository`, `bugs`, electron-builder `publish: github`)
- `docs/SKIN_PACKS.md` — 추가 판매용 스킨팩 시스템 설계도 (구현은 미정)

**사용자 컨텍스트 업데이트**:
- 사용자가 **GitHub에 올려서 판매할 계획**. 발그림 SVG 컨셉을 메인 셀링 포인트로 봄
- 다음 우선순위:
  1. (실행 중) 발그림 다양성 늘리기 ← 진행 중. 5개 추가됨, 더 필요할 수 있음
  2. 스킨팩 시스템 실제 구현 (지금은 docs/SKIN_PACKS.md 로 설계만)
  3. 메타/마케팅 자료 (#4 — 다 만들고 나서)
  4. 캐릭터 시트 통합 (사용자가 시트 PNG 푸시하면 슬라이서 돌리기)

---

---

## 0. 빨리 파악해야 할 것

- **프로젝트**: 데스크탑 위에 떠있는 투명 오버레이 윈도우에 고양이 펫 + 집 + 밥/물그릇이 떠있는 macOS 앱 (Electron + React + TypeScript)
- **사용자**: "wony" / GitHub `Celeste232`. Mac mini (M-series 추정). **한국어 반말** 사용. 직설적·짧은 메시지 선호. 농담 섞임. ㅋㅋ 같은 문구 자연스럽게 사용함
- **저장소**: `https://github.com/Celeste232/main` 의 `claude/meow-mode-interactions-pFJxU` 브랜치만 사용. main에는 절대 직접 푸시 금지
- **사용자가 터미널 싫어함**: 가능한 모든 작업을 더블클릭 가능한 `.command` 파일로 자동화. 새 기능 추가하면 빌드 흐름이 깨지지 않게 신경 써야 함
- **사용자 의사 결정 패턴**: 빠르게 결정함. "둘 중 뭐 할까요?"보단 "A 추천하는데 ~한 트레이드오프 있음. 이걸로 가요?" 식이 잘 맞음

---

## 1. 사용자 컨텍스트 & 말투

### 사용자가 자주 쓰는 표현
- "야" — 호칭. 화난 거 아님, 그냥 시작 단어
- "병맛" — 어정쩡하게 웃긴 것. 의도치 않게 웃긴 결과물을 좋아함
- "식빵 굽기" — 고양이가 발 접고 앉은 자세 (loaf)
- "퍼져있기" — 누워서 늘어진 자세 (sprawl)
- "지맘대로" — 패턴 없는 자유로운 행동

### 사용자 톤에 맞춰 응답하기
- **답은 짧게.** 헤더, 표, 긴 설명 X. 한 두 문장으로 끝낼 것
- **이모지 X.** 사용자가 명시적으로 요청 안 하면 쓰지 마
- **반말로.** "~할게요", "~됐어요" 정도 톤. 너무 어색한 존댓말은 안 맞음
- **에러나 한계 솔직하게.** "이건 못함" 하고 대안 제시. 변명·둘러대기 싫어함
- **결과물 먼저, 설명은 나중.** 길게 설명하다 결과 보여주면 짜증냄

### 절대 하지 말 것
- 병맛 SVG 고양이를 "더 예쁘게" 다시 그리거나 삭제하기 → 보존이 의도됨 (`docs/cat-svg-blueprint.json`에 명세 박혀있음)
- main 브랜치에 푸시
- 사용자가 명시적으로 시키지 않은 큰 리팩터링
- 간단한 작업도 거대한 todo로 부풀리기

---

## 2. 현재 상태 (작동/미작동/대기)

### ✅ 작동하는 것

| 기능 | 어디서 |
|---|---|
| 투명 오버레이 윈도우 (왼쪽 메인 모니터 자동 선택) | `electron/main.ts` |
| 집 드래그 = 위치 이동 / 단순 클릭 = 고양이 부르기 | `src/components/House/House.tsx` |
| 지붕 톱니 = 설정 메뉴 | 같은 파일 |
| 밥/물그릇 클릭 = 채우기 | `src/components/Bowls/` |
| 그릇이 비면 0레벨 → 가득 1레벨 시각화 | `BowlSvg.tsx` |
| 고양이 행동 상태머신 (15+ 액션) | `src/hooks/useCatBehavior.ts` |
| 활동량 (조용함/보통/활발함) 가중치 | 같은 파일의 `ACTIVITY_BIAS` |
| 같은 행동 연속 안 뽑음 (`lastAction.current`) | 같은 파일 |
| 식빵 굽기 + 퍼져있기 자세 추가 + 긴 휴식 시간 | 같은 파일 + `CatSvg.tsx` |
| 돌아다닐 영역 설정 (전체 / 집 근처 350px) | 같은 파일의 `pickWanderTarget` |
| 집중 모드 (Cmd 윈도우 뒤로 보내기 + alwaysOnTop 해제) | `electron/main.ts` IPC `window:focus-mode` |
| 집에 넣기 / 집에서 꺼내기 (cat.locked) | `useCatBehavior.ts` |
| 마우스 가까이 오면 고양이가 쳐다봄 (200px 안), 80px 안에 오래면 호기심 자세 | 같은 파일 |
| 고양이 직접 드래그 (held 자세) | `src/components/Cat/Cat.tsx` |
| 자거나 집안에 있을 때만 집 따라 이동 | `src/App.tsx` `onHouseDragStep` |
| 호버 패스스루 (마우스가 인터랙티브 위에만 클릭 활성화) | `src/hooks/useHoverPassthrough.ts` |
| 위치/설정/친밀도 영속화 | `electron/store.ts` (electron-store) |
| Oneko 픽셀 고양이 아이콘 (앱/Dock/트레이) | `build/icon.icns` + main.ts |
| `npm run slice` — 시트 PNG → 액션별 프레임 분배 | `scripts/slice-frames.mjs` (sharp) |
| 더블클릭 빌드+설치 스크립트 | `update-and-install.command` |
| `catSkin` 토글 — PNG 우선 / 병맛 SVG 강제 | 설정 메뉴 |

### ⚠️ 알려진 한계

- **클라우드 환경 한계로 검증 못한 것들** — 이 항목들은 사용자 Mac에서 실제로 안 되면 우선순위:
  - 진짜 macOS dmg 빌드 (Linux에선 dmg-license 못 깔아서 zip만 검증됨, dmg 자체는 macOS에선 정상 작동해야 함)
  - macOS의 `app.dock.setIcon()` 실제 표시 여부
  - 트레이 아이콘 메뉴바 표시 (linux Xvfb엔 트레이 없음)
  - 마우스로 진짜 드래그 (xdotool 환경에서 클릭통과 토글 타이밍 문제로 검증 어려움. 코드는 맞음)
- **Xvfb 환경 한정 시각 잔상**: 화면 우측에 흐릿한 그림자 보임. 실제 Mac엔 안 나타남 (컴포지터 문제)
- **사이닝 안 함**: macOS 첫 실행 시 "확인되지 않은 개발자" 경고 → 우클릭 → 열기 한 번만

### ⏳ 대기 중인 작업 (사용자가 원함)

1. **캐릭터 시트 PNG 통합** — 가장 큰 미완료. 사용자가 ChatGPT로 만든 시트들을 갖고 있음 (대화창에 처음에 붙여줬지만 클라우드 환경엔 파일로 들어오지 않음). 사용자가 시트 PNG들을 `src/assets/reference/` 에 넣어야 진행 가능. 넣은 뒤:
   - `src/assets/reference/layout.json` 작성 (좌표) — `layout.example.json` 참고
   - `npm run slice` 실행 → `src/assets/cat/<액션>/<n>.png` 자동 생성
   - 앱 자동 인식 (PNG가 있으면 SVG보다 우선)

   **로컬 Claude는 본인 파일시스템 접근 가능하니까, 사용자 Downloads/Desktop에 시트가 있으면 본인이 슬라이서 돌려서 적용 가능.** Claude가 시트의 그리드 분석해서 layout.json까지 자동 작성하면 사용자 노력 ↓

2. **Mac Dock 아이콘 검증** — 패키징된 .app 실행 시 Dock에 Oneko 아이콘 제대로 뜨는지

3. **첫 실행 시 macOS 경고 우회** — 현재 `update-and-install.command` 가 `xattr -dr com.apple.quarantine` 으로 quarantine 플래그는 제거함. 그래도 첫 실행 시 우클릭 필요할 수 있음

4. **소소한 UX 개선 후보 (사용자가 명시 요청한 건 아니지만 자연스러운 다음 스텝)**:
   - 친밀도 시각화 (지금은 숫자만)
   - 집 클릭(부르기) 했을 때 진행 표시
   - 사운드 (config는 있는데 실제 재생 코드 없음)

---

## 3. 아키텍처

### 파일 트리 (핵심만)

```
electron/
  main.ts                 메인 프로세스. 윈도우 생성, IPC 등록, 트레이, Dock 아이콘.
                          왼쪽 메인 모니터 자동 선택 (`getLeftmostDisplay()`).
                          CAT_HOUSE_DEBUG_NO_PASSTHROUGH=1 환경변수로 클릭통과 비활성화 (Xvfb 테스트용)
  preload.ts              window.api 브리지 — IPC 호출 래퍼들
  store.ts                electron-store 래퍼. Settings 타입 정의

src/
  main.tsx                React 진입점
  App.tsx                 스테이지 조립. 집/그릇/고양이/설정 마운트.
                          onHouseDragStart / onHouseDragStep — 드래그 시 고양이 반응 결정
  index.css               전역 스타일. .stage는 pointer-events: none, .interactive만 auto
  global.d.ts             window.api 타입

  state/useAppStore.ts    zustand 글로벌 상태:
                          - settings (영속화됨, electron-store에 저장)
                          - cat (action, x/y, facing, message, locked)
                          - housePos
                          - settingsOpen
                          - catActions (Cat 핸들 — putInHouse 등)

  hooks/
    useDraggable.ts       범용 드래그 훅. setPointerCapture를 e.currentTarget에 거는 게 중요
                          (e.target은 SVG 자식이라 capture 끊김)
    useHoverPassthrough.ts mousemove 마다 elementFromPoint로 .interactive 검사 →
                          window.api.setIgnoreMouse(true/false) IPC
    useCatBehavior.ts     고양이 행동 상태머신 (가장 큰 훅).
                          - 행동 스케줄러 (lastAction 기억해서 같은 거 연속 안 뽑음)
                          - 걷기 (target 향해 이동, dx>=0 → facing='right')
                          - 먹기/마시기 (밥/물 그릇 위치까지 걸은 뒤 600ms마다 -0.05)
                          - 마우스 추적 (play-cursor 액션, IPC로 cursor 위치 폴링)
                          - 마우스 쳐다보기 (sitting/idle/loaf 등 정적 액션 중 200px 이내면 facing 변경)
                          - callToHouse / putInHouse / releaseFromHouse 핸들 export

  components/
    Cat/Cat.tsx           cat 스프라이트 + 드래그 핸들러 (held 자세로 전환)
    Cat/CatSvg.tsx        15+ 액션의 SVG 포즈. 측면 포즈는 mirror group으로 default-facing-right 보장
    Cat/catFrames.ts      FRAME_SPECS 테이블 + import.meta.glob로 PNG 자동 로드
    House/House.tsx       드래그 = 이동, 단순 클릭 = 부르기, 지붕 톱니 = 설정
    House/HouseSvg.tsx    SVG 집
    Bowls/FoodBowl.tsx    클릭 = 채우기. level state는 settings.foodLevel
    Bowls/WaterBowl.tsx   동일 패턴
    Bowls/BowlSvg.tsx     level에 따라 음식 알 개수 / 물 높이 변경
    Settings/SettingsMenu.tsx  드롭다운/체크박스 UI

build/
  icon.icns               macOS 앱 아이콘 (Oneko 픽셀 고양이)
  icon.png                Win/Linux + 런타임 BrowserWindow 아이콘 (512px)
  tray-icon.png           트레이용 (32px → main.ts에서 16px로 다운사이즈)

docs/
  cat-svg-blueprint.json  병맛 SVG 명세서. 보존용
  HANDOFF.md              이 문서

scripts/
  slice-frames.mjs        sharp 기반 시트 슬라이서

update-and-install.command  Mac에서 더블클릭으로 git pull + build + 설치 + 실행
```

### IPC 채널 (`electron/main.ts` ↔ `electron/preload.ts`)

| Channel | 방향 | 용도 |
|---|---|---|
| `settings:get` / `set` / `reset` | invoke | 설정 CRUD |
| `window:set-ignore-mouse` | send | 호버 패스스루 토글 |
| `display:get-bounds` | invoke | 왼쪽 모니터 bounds |
| `cursor:get` | invoke | 전역 커서 좌표 (왼쪽 모니터 기준) |
| `app:quit` / `window:hide` / `window:show` | send | 트레이 메뉴용 |
| `window:focus-mode` | send | 집중 모드 (alwaysOnTop 해제 + blur) |

### 주요 설계 결정 (이유 같이)

- **투명 클릭통과 윈도우** + 호버 시에만 활성화. 데스크탑 다른 앱 사용 방해 X
- **왼쪽 모니터 자동 선택**: 사용자가 멀티모니터에서 메인이 왼쪽이라고 명시
- **electron-store**: 설정 영속화. zustand는 휘발성, store만 영속
- **cat.locked**: in-house나 held 상태일 때 행동 스케줄러가 액션 변경 금지
- **mirror group으로 측면 SVG 처리**: 원래 그림이 head-on-left였는데 facing logic이 head-on-right 가정 → mirror로 통일. 고치다가 cat 뒤로 걷는 버그 났던 흔적
- **PNG 우선, SVG fallback, 병맛 모드 강제 토글**: import.meta.glob로 PNG 자동 감지, 없으면 SVG. 사용자가 명시적으로 병맛 모드 키면 PNG 무시
- **드래그 = e.currentTarget capture**: e.target은 SVG path/circle 같은 자식이라 capture가 흔들림. 항상 wrapper div에 capture

---

## 4. 빌드 / 실행 흐름

### 개발 (dev 서버 + Electron)
```bash
npm install        # 처음 한 번만
npm run dev        # Vite + Electron 동시 시작
```

Vite HMR이 React 컴포넌트 변경 즉시 반영. Electron 메인 프로세스 변경은 재시작 필요.

### 빌드 (.dmg / .app)
```bash
npm run build      # tsc → vite build → electron-builder
```

`release/` 안에:
- `MeowMode-x.x.x-arm64.dmg` (Apple Silicon)
- `MeowMode-x.x.x-x64.dmg` (Intel)
- `MeowMode-x.x.x-arm64-mac.zip` / `-mac.zip`

`build/icon.icns` 가 macOS 앱 번들 아이콘으로 자동 들어감 (electron-builder convention).
`extraResources` 가 build/icon.png + tray-icon.png 를 `process.resourcesPath/build/` 로 복사.

### 더블클릭 워크플로
사용자는 터미널 거의 안 켜려 함. `~/meow-mode/update-and-install.command` 더블클릭 → git pull → npm install → npm run build → 기존 MeowMode 종료/제거 → 새 dmg 마운트 → /Applications에 복사 → quarantine 제거 → 실행.

스크립트 내용 자체가 진단용이기도 함 — 에러 시 Terminal 창 열린 채 멈추므로 사용자가 어디서 실패했는지 보고 가능.

### Xvfb 디버깅 (로컬에선 불필요, 클라우드 환경에서 사용했던 트릭)
```bash
DISPLAY=:99 CAT_HOUSE_DEBUG_NO_PASSTHROUGH=1 npm run dev
```
환경변수가 클릭통과를 끄므로 xdotool로 자동화 테스트 가능. 본인 Mac에선 안 써도 됨.

---

## 5. 작업 진행 시 체크리스트

### 코드 변경 후 항상
1. `npm run typecheck` — TS 에러 없는지
2. `npx vite build` — 렌더러 + Electron main 번들 빌드 통과
3. (변경이 UI라면) `npm run dev` 로 시각 확인

### 새 액션 추가 시
1. `src/state/useAppStore.ts` 의 `CatAction` 타입에 추가
2. `src/components/Cat/catFrames.ts` 의 `FRAME_SPECS` 에 frame count + intervalMs
3. `src/components/Cat/CatSvg.tsx` 의 메인 함수 분기 + 새 포즈 컴포넌트 작성
4. `src/hooks/useCatBehavior.ts` 의 `ACTION_DURATIONS` + `ACTIVITY_BIAS` 가중치
5. `docs/cat-svg-blueprint.json` 에 명세 추가 (보존용)

### 새 설정 추가 시
1. `electron/store.ts` 의 `Settings` 인터페이스 + `DEFAULT_SETTINGS`
2. (필요시) IPC 핸들러 `electron/main.ts`
3. `src/components/Settings/SettingsMenu.tsx` 에 UI

### 커밋 컨벤션
- 1줄 요약 (명령형, 짧게) + 빈 줄 + 본문 (왜 + 무엇)
- 본문에 검증 결과 한 줄 ("Verified under Xvfb that...")
- 영어로 작성 (이건 깃 히스토리는 영어로 통일됨)
- 사용자에게 보고할 때만 한국어

### 푸시
브랜치 `claude/meow-mode-interactions-pFJxU` 만 사용. PR 생성/머지는 사용자 명시 지시 시에만.

---

## 6. 로컬 Claude만 할 수 있는 것

클라우드 Claude가 못 했던 것 → 본인은 가능:
- 사용자 Mac의 `~/Downloads`, `~/Desktop` 등에서 캐릭터 시트 PNG **직접 읽기**
- 시트 그리드 분석해서 `layout.json` 좌표 자동 추출
- `npm run slice` 직접 실행해서 결과 즉시 확인
- `npm run build` 로 진짜 dmg 만들고 설치 결과 검증
- `osascript` 로 macOS UI 제어 (앱 종료/실행 등)
- `defaults read` / `defaults write` 로 macOS 설정 확인
- macOS 알림 발송 (`osascript -e 'display notification ...'`)
- 사용자가 화면에서 보는 거 캡처해서 같이 보기 (`screencapture`)
- 빌드 결과물의 실제 동작 확인 (Meow Mode 실행 → 스크린샷 → 검증)

→ **시트 통합 작업 우선순위 높음.** 사용자 자료 어디 있는지 물어보고, 자동으로 처리.

---

## 7. 환경 정보

- Node 22.x
- Electron 33.4.x
- Vite 6.x
- React 18.3.x
- TypeScript 5.7
- electron-builder 25.x
- electron-store 10.x
- zustand 5.x
- sharp 0.34.x

처음 풀하면 `npm install` 한 번 필요 (deprecated 경고 12개 + low/high 취약점은 모두 transitive deps라 무시).

---

## 8. 최근 커밋 흐름 (역순)

```
2b0ecc5  Fix house/cat drag — capture pointer on the wrapper, not the SVG child
a4532ec  Add update-and-install.command for double-click rebuild + reinstall
9148417  Stop dragging the cat along with a nearby house
1176783  Use Oneko pixel-cat icon for app, dock, and tray
4f4bebf  Add reference-sheet slicer + multi-arch Mac packaging
ebaa9b3  Add roam area, loaf/sprawl, focus mode, in-house lock, cursor look-at, drag
6d504f1  Preserve doodle SVG cat behind a skin toggle + add JSON blueprint
c1d54cd  Fix side-profile cats walking backward
942c719  Position cat next to bowls instead of on top
08065c5  Add per-frame SVG animation for every cat action
b0dd99e  Add SVG visuals and richer cat behaviors
1a11f4d  Scaffold Electron + React + TS desktop cat pet
```

---

## 9. 사용자에게 받을 즉시 물어볼 것

새 세션 시작하면 이 순서로 확인:
1. 현재 앱 상태 — 잘 떠있나? 마지막 빌드 버전이 뭐고 어떤 게 안 되는지?
2. 캐릭터 시트 어디에 있나? (Downloads? Desktop?) — 있으면 즉시 슬라이서로 처리
3. 다음 우선순위가 뭐인지

위 세 개만 빨리 확정하고 작업 들어가면 됨.

---

끝. 행운을.
