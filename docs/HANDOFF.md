# Meow Mode — 인수인계서

이 문서를 처음 보는 Claude(또는 사람)가 **이거 하나만 읽고도 실수 없이** 작업을 이어갈 수 있게 작성됨.

**마지막 업데이트**: 2026-05-30. 브랜치 `claude/cat-house-interactions-pFJxU`, 버전 0.1.2 (빌드 트리거 대기 중).

---

## 0. TL;DR — 5분에 파악하기

| 항목 | 값 |
|---|---|
| 프로젝트 | Meow Mode — macOS 데스크탑 펫 (발그림 고양이) |
| 사용자 | wony / GitHub `Celeste232` / 이메일 victoriayoon22@gmail.com |
| 본 레포 | `https://github.com/Celeste232/main` |
| 작업 브랜치 | `claude/cat-house-interactions-pFJxU` ← 여기에만 푸시. main 금지 |
| 에셋 레포 | `https://github.com/Celeste232/meow-mode-assets` (사용자 직접 관리) |
| 현재 릴리즈 | **v0.1.1 공개됨**. v0.1.2는 푸시됐고 빌드 트리거만 남음 |
| 가격 | $3.49 USD, 평생 무료 업데이트 |
| 작가명 | Celine Lee |
| SNS 핸들 | @meowmode_app (계정 생성 전) |
| 판매 채널 결정 | **옵션 B**: 깃허브 비공개로 + Gumroad 단독 |
| 기술 스택 | Electron 33 + React 18 + TypeScript 5 + Vite 6 + zustand + electron-store |
| 노드 버전 | 22 (CI 기준) |
| productName | `Meow Mode` (공백 있음 → 설치 시 `Meow Mode.app`) |
| appId | `com.celinelee.meowmode` |

---

## 1. 사용자 컨텍스트 (절대 까먹지 말 것)

### 말투
- **한국어 반말**. 영어는 가급적 쓰지 마. 코드/UI 텍스트만 영어 OK
- 답변은 **짧게**. 5줄 넘으면 거의 다 길어. 구체적인 step만 나열
- "야" 로 시작하는 거 = 호칭. 화난 거 아님
- "ㅋㅋ" / "ㅎㅎ" 자연스럽게 씀. 답변할 때 가끔 받아쳐도 됨

### 기술 수준
- **터미널 싫어함**. 모든 작업은 더블클릭 가능한 `.command` 파일로 자동화하거나, 깃허브 웹 UI 클릭 안내로 풀어야 함
- 코드 못 읽음. "여기 이거 고치면 돼" 같은 설명 무의미. **그냥 고치고 결과 알려줘**
- 깃허브 UI는 친숙. Run workflow 같은 건 클릭 가능. CLI(`git push`, `gh`)는 못 함
- **레포 자동 푸시 권한 있음**. 깃에 푸시할 때 사용자에게 묻지 말고 그냥 push 해. Stop hook이 미커밋 변경사항 있으면 강제로 알려줌

### 의사 결정 패턴
- **빠르게 결정함**. "둘 중 뭐 할까요?" 보단 "A 추천. 이걸로 가요?" 식이 잘 맞음
- 디테일 의사결정(폰트, 정확한 색, 픽셀 위치)은 사용자에게 묻기보다 **그냥 결정하고 결과 보여주기**. 별로면 사용자가 "별로야" 라고 함
- 사용자가 "오케" / "오케이" / "고고" 하면 진행하라는 뜻
- **사용자가 코드 도구를 들고 다른 Claude도 가끔 부른다**. 컨텍스트 충돌 가능 → 작업 시작 전 `git log`로 외부 커밋 확인

### 자주 쓰는 표현
- "병맛" — 어정쩡하게 웃긴 거. 의도하지 않게 웃긴 결과물을 좋아함. **이게 이 앱의 핵심 정체성**
- "발그림" — 발로 그린 듯한 어설픈 그림체. **앱의 메인 셀링 포인트**
- "식빵 굽기" = loaf 자세, "퍼져있기" = sprawl, "지맘대로" = 패턴 없는 자유로운 행동

---

## 2. 레포 구조

```
/home/user/main/                      ← 본 작업 디렉토리 (Linux 환경)
├── electron/                         메인 프로세스 (Node)
│   ├── main.ts                       BrowserWindow, 트레이, IPC, 윈도우 레이어
│   ├── preload.mjs.ts                contextBridge로 window.api 노출
│   ├── store.ts                      electron-store 래퍼 + Settings 타입
│   ├── i18n.ts                       트레이 메뉴 한/영/일/중
│   └── tsconfig.json
├── src/
│   ├── components/
│   │   ├── Cat/
│   │   │   ├── Cat.tsx               드래그 + 스피치버블 + 스프라이트 렌더
│   │   │   ├── CatSvg.tsx            손코딩 SVG (액션별 컴포넌트 ~25개)
│   │   │   ├── catAssets.ts          ★ 외부 SVG 12개 매핑 (NEW)
│   │   │   └── catFrames.ts          PNG 프레임 시트 슬라이스 (사용 안 함)
│   │   ├── House/                    HouseSvg.tsx, House.tsx (드래그)
│   │   ├── Bowl/                     FoodBowl.tsx, WaterBowl.tsx
│   │   └── Settings/                 SettingsMenu.tsx (윷놀이판 UI)
│   ├── hooks/
│   │   ├── useCatBehavior.ts         ★ 상태머신 + 새로 추가된 playMeow
│   │   ├── useDraggable.ts           e.currentTarget 사용 (e.target 금지)
│   │   └── useHoverPassthrough.ts    ★ click-through 토글 (mousedown/focus 추가됨)
│   ├── i18n/strings.ts               UI 텍스트 + 말풍선 문구 ko/en/ja/zh
│   ├── state/useAppStore.ts          zustand store + CatAction 유니온 타입
│   └── App.tsx
├── public/sprites/svg/               ★ 외부 SVG 12개 (NEW)
│   └── 01_tail_wag.svg ~ 12_love.svg
├── build/                            아이콘 에셋 (전부 git tracked)
│   ├── icon.png                      1024×1024 (실제 cat-icon.png 리사이즈)
│   ├── icon.icns                     mac용 multi-size icns
│   ├── icon-source.svg               (구버전, 더 이상 안 씀)
│   ├── tray-icon.png
│   └── tray-icon-paused.png
├── docs/
│   ├── HANDOFF.md                    ★ 지금 보고 있는 이 문서
│   ├── manual-ko.md                  한국어 사용자 매뉴얼 (12섹션)
│   ├── sales-copy.md                 한/영/일/중 판매 카피
│   ├── social-copy.md                트위터/인스타/Discord 카피
│   ├── SALES_CHECKLIST.md            ★ 사용자용 판매 등록 step-by-step
│   ├── SKIN_PACKS.md                 향후 스킨팩 시스템 설계 (미구현)
│   └── cat-svg-blueprint.json        SVG 청사진 (참고용)
├── .github/workflows/release.yml     ★ macos-14 빌드 + draft release
├── update-and-install.command        ★ 사용자가 더블클릭하는 업데이트 스크립트
├── scripts/make-demo.sh              데모 GIF 녹화 스크립트 (사용자 실행)
├── package.json                      productName "Meow Mode", appId 등
└── package-lock.json                 ← 버전 bump 때마다 같이 업데이트 필수
```

---

## 3. 핵심 코드 흐름

### 3.1 윈도우 / 입력
- `electron/main.ts`: 투명 BrowserWindow, 가장 왼쪽 디스플레이에 full screen, `setIgnoreMouseEvents(true, { forward: true })`로 기본 click-through.
- 렌더러의 `useHoverPassthrough` 훅이 `mousemove` + `mousedown` + window `focus` 들으면서 `.interactive` 요소 위에 있으면 IPC `window:set-ignore-mouse`로 click-through 끔. **mousedown/focus 추가는 최근 픽스. 다른 앱 갔다 와서 마우스가 버튼 위에 정지해 있어도 클릭 통하게 함.**
- 메인 프로세스도 `mainWindow.on('focus')` / `on('show')` 에서 setIgnoreMouseEvents 재적용 (macOS Electron 버그 대응).
- 디버깅 시 click-through 끄려면 `CAT_HOUSE_DEBUG_NO_PASSTHROUGH=1` 환경변수 (Xvfb + xdotool 테스트용).

### 3.2 고양이 렌더 우선순위 (Cat.tsx)
```
1. settings.catSkin === 'svg-doodle' 이고 catAssets.ts에 매핑된 action 이면
   → /sprites/svg/NN_xxx.svg 외부 SVG 로드 (자체 @keyframes 애니메이션)
2. catSkin이 'png' 이면 → catFrames.ts의 PNG 시트
3. 폴백 → CatSvg.tsx의 손코딩 SVG (액션별 함수)
```

**중요**: catAssets.ts에 매핑된 12개 액션은 외부 SVG로 자동 애니메이션. 매핑 안 된 액션(meow, sneeze, slip, dangle, climb, superman, pounce, roll, shake, grooming, stretching, yawning, caught, in-house, startled, held)은 CatSvg.tsx 사용.

### 3.3 행동 상태 머신 (useCatBehavior.ts)
- `ACTIVITY_BIAS`: calm/normal/energetic 별 가중치 액션 풀
- `ACTION_DURATIONS`: 액션별 [min, max] ms
- 매 cycle: 다음 액션 pick → 같은 액션 반복 회피 → walking이면 wander target 설정
- **slip → dangle → climb** 시퀀스: windowLayer=front + walking 중에만 무작위 발동 (창 가장자리에서 미끄러지는 페이크)
- 배고픔/목마름 nag (showSpeechBubble 켜져있을 때만)
- **Random chatter**: 28초마다 22% 확률 (최근 18s→28s, 35%→22%로 줄임 — 사용자가 빈도 더 낮춰달라고 함)
- **playMeow()**: 새로 추가. Web Audio API로 합성한 meow 소리. 액션이 `meow`로 바뀔 때 재생. 사운드 파일 없음. 볼륨은 settings.volume(0~1) 따라감

### 3.4 IPC 채널 (electron/main.ts → preload → window.api)
| 채널 | 방향 | 용도 |
|---|---|---|
| `settings:get` | invoke | electron-store 값 읽기 |
| `settings:set` | invoke | 부분 업데이트, 변경 후 적용 |
| `settings:reset` | invoke | 기본값 복귀 |
| `window:set-ignore-mouse` | send | click-through 토글 |
| `display:get-bounds` | invoke | 가장 왼쪽 디스플레이 좌표 |
| `cursor:get` | invoke | OS 커서 위치 (Look-at-cursor용) |
| `cat:find` | send→broadcast | 트레이 "고양이 찾기" |

---

## 4. 빌드 / 배포

### 4.1 사용자 PC 업데이트 (Mac)
**더블클릭만** — `update-and-install.command`
- git pull → npm install → npm run build → 기존 .app trash → dmg mount → /Applications에 복사
- 아이콘 캐시 강제 비우기: touch + chflags 토글 + /Applications → /tmp 이동 후 복귀 + killall Dock/Finder. **4단 콤보로도 안 되면 macOS 버그 → 로그아웃/로그인 필요**

### 4.2 GitHub 릴리즈 (판매용 dmg 생성)
`.github/workflows/release.yml` 가 macos-14 runner에서 빌드.

**트리거 두 가지**:
1. **태그 푸시** (`v*` 패턴) — 자동
2. **수동 dispatch** — github.com/Celeste232/main/actions/workflows/release.yml → Run workflow → ref/version 입력

**수동 dispatch가 권장**. 이유:
- 태그 푸시는 로컬 git의 사용자 인증 문제로 자주 실패함 (이 환경에서 `git push origin v*` → 403)
- workflow_dispatch는 깃허브 UI만으로 가능

**현재 셋업**:
- `permissions: contents: write`
- `softprops/action-gh-release@v2` 사용
- `env: GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` 필수 (없으면 업로드 실패 — v0.1.0 빌드가 이것 때문에 실패했었음)
- `CSC_IDENTITY_AUTO_DISCOVERY: 'false'` — 코드사이닝 안 함
- `draft: true` — 자동 publish 안 됨. 사용자가 Releases 페이지 가서 Publish release 클릭해야 함

**산출물**:
- `Meow Mode-0.1.X-arm64.dmg` (Apple Silicon)
- `Meow Mode-0.1.X-x64.dmg` (Intel)
- `.zip` 동일 두 개
- `.blockmap` / `latest-mac.yml`

### 4.3 버전 bump 절차
```
1. package.json version 필드 수정 (예: "0.1.2" → "0.1.3")
2. npm install --package-lock-only  ← 안 하면 npm ci에서 실패함
3. git add package.json package-lock.json
4. git commit
5. git push
6. 깃허브에서 Run workflow (version 입력)
```

**시행착오**: package-lock.json 미동기화로 `npm ci` 실패 → v0.1.1 빌드 두 번 돌렸음. 항상 step 2 잊지 마.

---

## 5. 판매 전략 (사용자 결정 = 옵션 B)

> 사용자 인용: "B 할게!"
> - 깃허브 Releases 비공개 (또는 draft 유지)
> - Gumroad에만 dmg 업로드 → $3.49 정가
> - Itch.io는 보너스

### 사용자가 직접 할 일 (docs/SALES_CHECKLIST.md 참고)
1. update-and-install.command로 자기 PC 최신화
2. 깃허브 Actions에서 v0.1.X 빌드 트리거 → dmg 다운로드
3. Gumroad 가입 → New product → dmg 업로드 → 카피 복붙 (docs/sales-copy.md)
4. (선택) Itch.io 동일하게
5. 트위터 @meowmode_app 만들고 첫 트윗

### 옵션 B 운영에 필요한 후속 작업
- [ ] 깃허브 레포를 private로 전환 또는 Releases를 unlisted로 처리
- [ ] README에서 "다운로드" 섹션 제거 (Gumroad 링크만 남기기)
- [ ] 사용자가 Gumroad URL 보내주면 그걸 README에 박기

---

## 6. 알려진 이슈 / 디자인 결정

### 이미 fix된 것 (절대 다시 풀지 마)
| 이슈 | 원인 | 해결 |
|---|---|---|
| 그릇 클릭 안 채워짐 | 고양이가 위에 있으면 클릭 흡수 | Cat onPointerUp에서 임시 `pointer-events:none` 후 elementFromPoint → 합성 click dispatch |
| 집 드래그 안 됨 | `setPointerCapture(e.target)` — SVG 자식이 캡처 잃음 | `e.currentTarget` 사용 |
| 말풍선 거꾸로 나옴 | `.cat` 전체에 scaleX(-1) 걸려 텍스트도 뒤집힘 | sprite만 내부 div에 transform, 말풍선은 외부 div |
| 걷는 고양이 뒤로 감 | 측면 포즈 SVG가 머리 왼쪽 → facing 로직과 반대 | `<g transform="translate(W 0) scale(-1 1)">`로 미러 |
| 다른 앱 갔다 와서 버튼 죽음 | useHoverPassthrough가 mousemove만 들음 | mousedown + window focus 추가 |
| 아이콘 캐시 안 비워짐 | macOS Dock/Finder가 끈질김 | touch + chflags + mv-out-and-back + killall 4단 콤보 |
| v0.1.0 빌드 실패 | GH_TOKEN 환경변수 없어서 release 업로드 거부 | release step env에 GITHUB_TOKEN 명시 |
| 말풍선 너무 자주 | 18s/0.35 → 평균 51s | 28s/0.22 → 평균 127s |

### 의도된 디자인 (변경 요청 들어와도 한 번 확인하고 진행)
- **발그림 SVG가 메인 정체성**. PNG 스프라이트는 폴백. settings.catSkin 기본값 = `'svg-doodle'`
- **말풍선에 박스 없음** — 텍스트 + 하얀 halo만. 사용자 명시적 선호
- **소리는 합성음**. 실제 고양이 wav 없음. 사용자가 안 들어봤다며 추가 요청한 거고, 합성음 결과 아직 피드백 안 받음
- **사이닝 없음** — 사용자가 $99/년 안 내겠다고 함. 매뉴얼에 "우클릭 → 열기" 안내
- **풀스크린 게임 위에는 안 뜸** — windowLayer=front여도 macOS 풀스크린은 의도적으로 양보
- **활동영역에서 "집안"은 없앴음** — putInHouse 메뉴가 있으니까 중복

### 알려진 미해결 (낮은 우선순위)
- [ ] 데모 GIF 아직 안 만듦. 사용자가 `brew install ffmpeg` 하고 `./scripts/make-demo.sh` 돌려야 함
- [ ] 영/일/중 사용자 매뉴얼 번역 미작성 (한국어만 있음)
- [ ] SKIN_PACKS.md 설계만 있고 구현 안 됨
- [ ] 합성 meow 소리 사용자 피드백 미수령 — 별로면 PCM 샘플 임베드 검토

---

## 7. 자주 만지는 파일 빨리 찾기

| 하고 싶은 것 | 파일 |
|---|---|
| 새 액션 추가 | `src/state/useAppStore.ts` (타입) + `src/hooks/useCatBehavior.ts` (durations, bias) + `src/components/Cat/CatSvg.tsx` (그림) |
| 새 액션을 외부 SVG로 연결 | `src/components/Cat/catAssets.ts` (매핑 추가) + `public/sprites/svg/NN_xxx.svg` |
| 말풍선 문구 수정 | `src/i18n/strings.ts` (4언어 다 추가) |
| 트레이 메뉴 텍스트 | `electron/i18n.ts` |
| 설정 패널 UI | `src/components/Settings/SettingsMenu.tsx` + `src/index.css` (doodle-* 클래스) |
| 빌드 워크플로 | `.github/workflows/release.yml` |
| 아이콘 교체 | `build/icon.png` + `build/icon.icns` (둘 다 같이) |
| 트레이 아이콘 | `build/tray-icon.png` + `build/tray-icon-paused.png` |

### 아이콘 재생성 절차 (PNG 1024×1024 → icns)
```bash
mkdir -p /tmp/icns_work
node -e "
const sharp = require('sharp');
const sizes = [16,32,64,128,256,512,1024];
(async () => {
  await sharp('SOURCE.png').resize(1024,1024).png().toFile('build/icon.png');
  for (const s of sizes) {
    await sharp('SOURCE.png').resize(s,s).png().toFile('/tmp/icns_work/icon_'+s+'.png');
  }
})();
"
cd /tmp/icns_work
png2icns icon.icns icon_16.png icon_32.png icon_64.png icon_128.png icon_256.png icon_512.png icon_1024.png
cp icon.icns /home/user/main/build/icon.icns
```
sharp는 repo node_modules에 있음. png2icns는 시스템 도구.

---

## 8. 환경 / 도구 제약

### 이 작업 환경 (Linux container)
- `git push`는 가능하지만 **태그 푸시는 403** (인증 한계). 그래서 workflow_dispatch 셋업해둠
- 깃 remote: `http://local_proxy@127.0.0.1:PORT/git/Celeste232/main`
- GitHub MCP 사용 가능 (`mcp__github__*`) — 단 `Celeste232/main` 레포만 접근 가능. **`Celeste232/meow-mode-assets`는 MCP로 접근 불가, raw.githubusercontent.com curl로 받아야 함**
- Mac 빌드는 못 함 (Linux 환경). dmg는 GitHub Actions(macos-14)에서만 생김
- 사용자 Mac에 직접 접근 불가. 모든 사용자 측 작업은 `.command` 파일이나 클릭 안내로 풀어야 함
- MCP 서버가 자주 disconnect/reconnect 함. `<system-reminder>` 무시하고 진행. 필요한 도구는 ToolSearch로 다시 로드

### 사용자 측 도구 가정
- Mac (M-series로 추정. Intel 사용자는 본인 외에 없을 듯)
- Finder + TextEdit 사용 가능
- 다른 Claude 인스턴스를 데스크탑 앱에서 띄워서 병렬로 부탁하기도 함. 다른 Claude가 푸시한 커밋이 있을 수 있으니 `git log`로 외부 변경 확인

---

## 9. 다음에 할 일 (우선순위 순)

1. **v0.1.2 빌드 트리거** — 사용자가 Run workflow 클릭하기 기다리는 중. 클릭 후 ~15분
2. **사용자가 Gumroad에 dmg 올리기** — docs/SALES_CHECKLIST.md 따라가기. 막히면 도와줘
3. **Gumroad URL 받으면 README에 추가** — 그 후 깃허브 Releases 페이지 unlist 처리 검토
4. **합성 meow 소리 피드백 확인** — 별로다 하면 실제 고양이 PCM 샘플로 교체 (사용자가 줄 듯)
5. **데모 GIF 녹화 도움** — 사용자가 brew install ffmpeg 안 했을 수도. 막히면 단계별 안내
6. **영/일/중 사용자 매뉴얼** — 한국어 매뉴얼 docs/manual-ko.md 보고 번역
7. **SKIN_PACKS.md 실제 구현** — 향후 추가 매출원

---

## 10. 자주 묻는 실수 (이런 거 하지 마)

- ❌ main 브랜치에 직접 푸시
- ❌ `--no-verify` / `--amend` / `--force` 같은 git 위험 옵션 (사용자가 직접 시키지 않는 한)
- ❌ `package.json` version 올리고 `package-lock.json` 안 올림 → CI npm ci 실패
- ❌ HouseSvg 같은 SVG 컴포넌트에서 `setPointerCapture(e.target)` — 자식 element라 캡처 잃음. **반드시 `e.currentTarget`**
- ❌ Cat 컴포넌트 wrapper에 transform 걸기 — 말풍선이 같이 뒤집힘. sprite만 내부 div에 걸어야 함
- ❌ 사용자한테 터미널 명령어 시키기 — 거의 다 거부함. .command 스크립트로 풀어
- ❌ "이거 어떻게 할까요?" 미세 의사결정 질문 — 그냥 정하고 결과 보여줘
- ❌ 합성음 변경 시 AudioContext close 잊기 → 메모리 누수. `osc.onended = () => ctx.close()` 패턴 유지
- ❌ 이미지 파일을 그냥 Read tool로 읽고 "본 척" — 이미지는 *실제로* multimodal로 보임. SVG 다시 그릴 때는 보이는 대로 정확히 묘사 후 그리기
- ❌ 사용자가 "어디 폴더에 다 있어" 라고 하면 Mac 로컬 경로 — 접근 불가. 깃에 푸시해달라거나 직접 복붙해달라고 부탁

---

## 11. 자주 쓰는 명령 한 줄 모음

```bash
# 타입체크
npx tsc -b --noEmit

# 프로덕션 빌드 (Linux에서도 vite 부분만은 됨)
npx vite build

# 헤드리스 시각 확인 (Xvfb)
Xvfb :99 -screen 0 1920x1080x24 &
DISPLAY=:99 CAT_HOUSE_DEBUG_NO_PASSTHROUGH=1 npm run dev &
import -window root /tmp/screenshot.png

# 외부 SVG 가져오기 (메인 레포)
curl -L -o public/sprites/svg/X.svg \
  https://raw.githubusercontent.com/Celeste232/meow-mode-assets/main/meow_transparent_animated_svg/NN_xxx_transparent.svg

# git 푸시 (브랜치만, 태그는 워크플로 dispatch로)
git push -u origin claude/cat-house-interactions-pFJxU
```

---

## 12. 사용자가 다른 Claude한테 부탁한 흔적

사용자는 가끔 다른 Claude(데스크탑 앱)한테 별도 작업 시킴.
지금까지 알려진 외부 변경:
- `Celeste232/meow-mode-assets` 레포 생성 + 폴더 정리 + 12개 SVG/PNG 업로드 — 다른 Claude가 함
- 깃허브 워크플로의 `GH_TOKEN` 환경변수 추가 commit — 다른 Claude(Codex)가 했었음. 지금은 우리 코드에도 들어있음

작업 시작 전 `git log --oneline -20` 으로 외부 commit 확인하는 습관 들여.

---

이 문서를 업데이트할 때마다 맨 위 "마지막 업데이트" 줄 갱신.
