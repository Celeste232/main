# 철저한 인수인계서 / Full Handoff — Meow Mode + Fox Mode

> 작성: 2026-06-15. 이 문서 하나로 다른 에이전트(Claude/GPT/사람)가 차갑게 받아도 이어갈 수 있게 작성.
> 대화 맥락 없이 이 문서 + repo만으로 작업 가능하도록 함.

---

## 0. 지금 가장 급한 것 (TL;DR)
**활성 블로커: Fox Mode dmg가 맥에서 "손상되어 휴지통으로 이동"으로 안 열림.**
- **빌드 버그 아님** — 빌드 로그 확인 결과 ad-hoc 서명 정상(`codesign --verify` 통과: "valid on disk / satisfies its Designated Requirement"). Meow Mode와 동일한 서명 방식.
- 원인: macOS Gatekeeper가 **ad-hoc 서명 + 다운로드(quarantine)** 앱을 막는 표준 동작. Meow dmg도 같은 macOS에서 새로 받으면 동일하게 막힘.
- **임시 우회(사용자 맥에서)**: `xattr -dr com.apple.quarantine "/Applications/Fox Mode.app"; open "/Applications/Fox Mode.app"` → 무조건 열림. 또는 시스템 설정 → 개인정보 보호 및 보안 → "그래도 열기".
- **영구 해결(사용자+구매자 모두 깔끔하게) = Apple 공증(notarization).** 이게 다음 작업자가 해야 할 핵심. → §6 참조. **사용자 Apple Developer 계정($99/년) 필요.**

사용자는 매우 지쳐있고 빠른 해결을 원함. "다른 애한테 시키겠다"고 함.

---

## 1. 제품 개요
- **Meow Mode**: 손코딩 SVG 고양이 데스크탑 펫 (macOS). 이미 Gumroad 판매중. $2.99.
- **Fox Mode**: 여우 데스크탑 펫. Meow와 **별개 제품**, 같은 repo에서 별도 빌드. 신규.
- 둘 다 Electron 투명 오버레이 위를 돌아다니는 데스크탑 펫. 집·밥그릇·물그릇, 30+ 행동, 한/영/일/중 4개국어, 메뉴바 트레이.
- 판매: 사용자가 dmg를 직접 다운로드 → Gumroad에 업로드(수동). private repo라 무료 유출 없음.

## 2. 저장소 / 브랜치
- repo: **`Celeste232/main`** (private)
- **`claude/cat-house-interactions-pFJxU`** = dev = **빌드 대상**. 모든 코드 + 워크플로가 항상 이 브랜치 HEAD를 체크아웃해 빌드. ← 작업은 여기에.
- `claude/sweet-heisenberg-JhBcl` = 보조 작업 브랜치, dev와 동일하게 유지해옴.
- `main` = 워크플로 파일 보유(release.yml, release-fox.yml) + 옛 코드. 배포 기본 브랜치.
- ⚠️ 사용자 로컬 클론이 한 번 꼬였던 적 있음(엉뚱한 e107222 갈래). 원격 dev는 깨끗. 로컬에서 dev로 force-push 금지. 새로 clone 권장.

## 3. 기술 스택 / 핵심 파일
Electron 33 + React 18 + TypeScript + Vite 6 + electron-builder 25 (vite-plugin-electron).
- `electron/main.ts` — 투명 풀스크린 창(가장 왼쪽 디스플레이), 트레이, **클릭-통과**(setIgnoreMouseEvents + 60fps 커서 샘플링; focus/show/blur에서 `mouseIgnored` 상태 재적용 — 이전에 focus 핸들러가 무조건 통과ON으로 만들어 설정창 클릭이 뒤로 새던 버그 수정함).
- `electron/i18n.ts` — 트레이 문구 i18n + **fox 여우化**(app.getName()에 "fox" 포함 시).
- `electron/store.ts` — electron-store 설정(catSkin 등). 기본 catSkin='svg-doodle'.
- `electron/preload.ts` — IPC 브리지(window.api).
- `src/components/Cat/Cat.tsx` — 스프라이트 렌더. `__IS_FOX__`면 PNG 여우 + **좌우반전 보정**(여우 그림이 기본 왼쪽 보므로). png 프레임 없으면 idle 프레임으로 폴백(고양이 SVG로 안 감).
- `src/components/Cat/CatSvg.tsx` — 손코딩 고양이 SVG(1024줄). `src/components/Cat/catFrames.ts` — PNG 프레임 글롭/사양.
- `src/i18n/strings.ts` — UI 문구 i18n(ko/en/ja/zh) + `foxify()`(=__IS_FOX__면 고양이단어→여우단어 치환).
- `src/components/Settings/SettingsMenu.tsx` — 설정 패널.
- `scripts/slice-fox.mjs` — 여우 시트 슬라이스 + **배경제거(flood-fill)**.
- `vite.config.ts` — `define: { __IS_FOX__: JSON.stringify(process.env.VITE_FOX === '1') }`.
- `electron-builder-fox.json` — Fox 빌드 설정(appId com.celinelee.foxmode, productName "Fox Mode", extraMetadata.version, output release-fox/, afterPack, mac identity:null).
- `.github/workflows/release.yml`(Meow), `.github/workflows/release-fox.yml`(Fox).
- `build/afterPack.cjs` — **ad-hoc 서명**(`codesign --force --deep --sign -`) + verify. mac/win/linux 중 darwin만.
- `build/icon-fox.png` — 투명 여우 아이콘. `docs/fox-actions.md` — 여우 동작 매핑 스펙.

## 4. 두 제품 분기 메커니즘
- 빌드 시 `VITE_FOX=1` → vite `define`이 `__IS_FOX__=true` 주입.
- `__IS_FOX__`면: ① Cat.tsx가 PNG 여우 강제 + 좌우반전 ② strings.ts `foxify`가 UI 문구 여우化(먀우 모드→Fox Mode, 고양이→여우, 4개국어).
- 트레이(main 프로세스)는 `app.getName()`("Fox Mode" 포함) 기준으로 여우化.
- 고양이 앱은 `__IS_FOX__=false` → 전혀 영향 없음(검증함: 고양이 빌드엔 foxify 코드가 DCE로 빠짐).

## 5. 여우 에셋 파이프라인
- 원본: `src/assets/reference/여우_01~06.png` (사용자가 ChatGPT로 생성, 흰 배경 불투명). `여우_01`만 슬라이스에 씀(현재).
- `scripts/slice-fox.mjs`: `여우_01`을 패널 그리드(3열×4행, 패널 512×256, 제목/번호 band 위쪽 80px 스킵)에서 고정박스로 잘라 `src/assets/cat/<action>/<n>.png` 생성.
- **배경제거 = flood-fill**(`removeBackground`): 테두리에서 흰색(rgb≥228)/투명 따라 들어가며 alpha 0. 여우 흰 털은 검은 윤곽선에 막혀 보존. (검증: 배경 alpha=0, 여우 픽셀 유지.) → **흰배경 시트 `여우_02~06`도 이 방식으로 추가 가능**(미래 동작).
- 액션 매핑(`docs/fox-actions.md`): walking/zoomies/sitting/sleeping/tail-wag/jumping/curious/roll + 별칭(idle=sitting, napping/loaf/sprawl/curl/flop=sleeping, pounce=zoomies, happy=tail-wag). 앉기 3번(뒷모습)은 드롭.
- 재슬라이스: `node scripts/slice-fox.mjs`.

## 6. 🔴 핵심 작업: Fox "손상됨" → Apple 공증(notarization)
ad-hoc 서명은 macOS에서 한계(다운로드 시 "손상됨"/"확인 불가"). **유일한 진짜 해결 = Developer ID 서명 + 공증.** Meow에도 동일 적용 필요.
필요한 것(사용자가 제공):
1. **Apple Developer Program** 가입($99/년).
2. **Developer ID Application 인증서**(.p12) → GitHub Secret `CSC_LINK`(base64) + `CSC_KEY_PASSWORD`.
3. 공증 크레덴셜 → Secret `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID`.

**✅ 공증 패치 = 코드 구현 완료 (2026-06-15, Fox 한정).** 남은 건 시크릿뿐.
구현된 것:
- `build/entitlements.mac.plist` (hardened runtime entitlements)
- `build/notarize.cjs` (afterSign 훅, @electron/notarize. CI에서 시크릿 없으면 throw, 로컬은 skip)
- `build/afterPack.cjs` — `CSC_LINK` 있으면 ad-hoc 건너뜀(=실인증서 서명 경로), 없으면 ad-hoc 로컬 폴백
- `electron-builder-fox.json` — `afterSign` 추가, `mac`에 `hardenedRuntime/gatekeeperAssess:false/entitlements/entitlementsInherit` 추가, **`identity:null` 제거**, version 1.0.5
- `.github/workflows/release-fox.yml` — 빌드 env에 5개 시크릿 주입 + 빌드 후 codesign/spctl/stapler 검증 스텝
- `package.json` — `@electron/notarize` devDep 추가

**남은 것(워니만 가능): GitHub repo Secrets 5개 등록**
`Settings → Secrets and variables → Actions → New repository secret`:
- `APPLE_ID` (Apple 계정 이메일)
- `APPLE_APP_SPECIFIC_PASSWORD` (appleid.apple.com → 앱 암호 생성)
- `APPLE_TEAM_ID` (developer.apple.com → Membership → Team ID)
- `CSC_LINK` (Developer ID Application 인증서 .p12 를 base64로: `base64 -i cert.p12 | pbcopy`)
- `CSC_KEY_PASSWORD` (그 .p12 비밀번호)

그 후: Release Fox 실행 → **fox-v1.0.5**가 서명+공증되어 더블클릭으로 깔끔히 열림. 검증 스텝 로그에서 `spctl: accepted` / `stapler validate: worked` 확인.
⚠️ **시크릿 없이 Release Fox 돌리면 빌드 실패함(의도된 동작)** — 시크릿 등록 전엔 fox-v1.0.4(ad-hoc, 우회 필요)로 테스트.
Meow Mode도 동일 처리 필요(package.json build + release.yml) — 아직 안 함.

## 7. ⚠️ 어시스턴트(에이전트) 환경 제약 — 반드시 인지
- **클라우드 리눅스 컨테이너**. 사용자 맥 접근 불가(`/Users`,`/Volumes` 안 보임). → 앱 실행·Gatekeeper 통과·맥 터미널은 **사용자만** 가능.
- **GitHub Actions 트리거 불가**(403 "Resource not accessible by integration" = actions:write 없음). **태그 push/삭제도 403**. → 빌드·태그는 **사용자 또는 "브라우저 클로드"(GitHub 웹 UI 조종 에이전트)**가 수행.
- 가능: 코드 편집, repo **브랜치** push(git), 컨테이너 내 `npm run typecheck`/`vite build`/슬라이스 검증, GitHub MCP로 릴리스·PR·워크플로 run·로그 **조회**, create_or_update_file로 파일 커밋.

## 8. 빌드 & 릴리스 방법 (사용자/브라우저 클로드가 실행)
- **Fox**: https://github.com/Celeste232/main/actions/workflows/release-fox.yml → "Run workflow". **매 실행이 현재 dev 코드로** 새 `fox-v<version>` 빌드(버전=electron-builder-fox.json의 extraMetadata.version). 브랜치 아무거나 OK(항상 dev 빌드). 또는 `git push origin fox-v<x>` 태그.
- **Meow**: Actions → "Release" → Run workflow(버전=package.json) 또는 `v*` 태그.
- 빌드 후 dmg는 Releases 페이지에 첨부됨 → 사용자가 받아 Gumroad 업로드.

## 9. 현재 상태 (빌드/릴리스)
- Meow Mode: **v0.2.9 published**. v0.2.10(클릭-통과 수정) 코드만 있고 빌드 안 함.
- Fox Mode: **fox-v1.0.1**(초기, 버그) + **fox-v1.0.4**(아래 수정 다 포함) published. fox-v1.0.0 태그는 꼬여서 삭제함.
- 최신 dev HEAD: 이 핸드오프 커밋(직전 = `32cc68f` 부근, 이 파일 추가분).

## 10. 여우 작업 변경 이력 (changelog)
- 여우 PNG 스킨 추가 → Fox Mode 별개앱 분리(electron-builder-fox.json, release-fox.yml, build:fox, __IS_FOX__)
- fox-v1.0.1: 첫 빌드(버그: 고양이단어 UI, 뒤로걷기, 흰배경, 크림아이콘)
- v1.0.2: __IS_FOX__ define로 여우 강제 확정 + i18n 여우化(설정패널+트레이)
- v1.0.3: 좌우반전(뒤로걷기) 수정 + 투명 아이콘 + 앉기 뒷모습 프레임 제거
- v1.0.4: **흰배경 flood-fill 제거**(진짜 투명) ← 사용자가 받은 최신
- (현재) Fox "손상됨"으로 안 열림 = Gatekeeper/공증 이슈(빌드는 정상).

## 11. 남은 할 일
1. 🔴 **공증 세팅**(§6) — 또는 ad-hoc 유지 + 우회 안내.
2. **여우 집/그릇**: 사용자 맥 `/Users/wony/Desktop/V-Main/판매앱 프로그램 만들기`에 이미지 있음, repo 미반영. push되면 `House`(HouseSvg)·`FoodBowl`/`WaterBowl`(SVG)를 여우 그림 PNG로 교체(flood-fill 재활용) → v1.1.
3. **여우 추가 동작**(밥/물/하품/굴파기 등): `여우_02~06` 흰배경 시트 슬라이스(flood-fill) 추가 + `docs/fox-actions.md` 매핑대로.
4. 판매자료 영/일/중 도입부에 고양이끼 약간 남음(다듬기 선택).
5. PR #1(cat release.yml→main) 열려있음. 깨진 draft 릴리스(v0.2.3/0.2.4) 정리 선택.

## 12. 문서 위치 (전부 docs/)
- 사용설명서: `docs/meow-mode-guide.html`(Meow 4개국어), `docs/manual-ko.md`, `docs/fox/guide.html`(Fox 4개국어)
- 설계도/구조: **`docs/cat-svg-blueprint.json`**(고양이 SVG 설계), **`docs/fox-actions.md`**(여우 동작 매핑), `docs/HANDOFF.md`(초기), 이 파일
- 판매: `README.{md,ko,ja,zh}.md`, `docs/sales-copy.md`, `docs/gumroad-snippets.md`, `docs/SALES_CHECKLIST.md`, `docs/short-description.md`, `docs/itch-description.md`, `docs/social-copy.md`, `docs/fox/sales-copy.md`, `docs/fox/gumroad-snippets.md`
- 여우 원본 시트: `src/assets/reference/여우_01~06.png`

## 13. 사용자 협업 방식 / 톤
- 빌드/맥/git 조작은 "브라우저 클로드"(웹 UI 조종)에 위임하거나 본인이 터미널로 직접.
- 한국어로 소통. 빠른 실행을 원하고, 막히면 매우 답답해함. 지시는 **짧고 정확하게, 실행 가능한 한 가지 행동**으로.
- 맥: Mac mini (woniui-Macmini-2), macOS Sequoia 계열로 추정(Gatekeeper 빡셈).
