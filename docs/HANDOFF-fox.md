# 철저한 인수인계서 / Full Handoff — Meow Mode + Fox Mode

> 작성: 2026-06-15. 이 문서 하나로 다른 에이전트(Claude/GPT/사람)가 차갑게 받아도 이어갈 수 있게 작성.
> 대화 맥락 없이 이 문서 + repo만으로 작업 가능하도록 함.

---

## 0. 지금 가장 급한 것 (TL;DR)
**결정(소유자, 2026-06-19): Fox Mode는 Meow Mode와 똑같이 "비공증 ad-hoc 배포"로 간다. Apple 공증($99) 안 함.**
- Fox는 ad-hoc 서명(`build/afterPack.cjs`)된 dmg/zip으로 배포 → 구매자는 **우클릭 → 열기** 또는 **시스템 설정 → 개인정보 보호 및 보안 → "그래도 열기"**로 실행. (Meow가 늘 열리던 방식과 동일.)
- 우회 안내 문서 포함: `docs/fox/guide.html`, `docs/fox/gumroad-snippets.md`, Release 본문.
- ⚠️ 한때 시도했던 공증 패치(afterSign 훅 / 시크릿 5개 / CI throw)는 **전부 되돌림**(2026-06-19, 커밋 참조). Release Fox는 이제 **시크릿 없이도 성공**하고, `notarize.cjs`는 더 이상 throw 안 함. → §6.
- v1.0.4 "손상됨/확인 불가" 원인 분석 = §6. 요약: Meow와 패키징 차이는 아이콘 포맷(.png vs .icns)뿐이고 그건 Gatekeeper 원인이 아님 → 둘 다 동일한 ad-hoc+quarantine 게이트에 걸림. "확인 불가"는 우회로 열림(정상). 진짜 "손상됨"은 보통 zip 재압축으로 서명이 깨진 경우 → **dmg를 마운트해 Applications로 드래그**하면 해결.

사용자는 매우 지쳐있고 빠른 해결을 원함. 지시는 짧고 정확하게.

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

## 6. Fox "손상됨/확인 불가" — 원인 분석 & 비공증 배포 (현 방침)
**방침(소유자 결정, 2026-06-19): 공증 안 함. Meow와 동일한 비공증 ad-hoc 배포 + 우회 안내.** Apple Developer($99)·시크릿 불필요.

### Meow vs Fox 패키징 비교 (v1.0.4 기준)
`package.json`의 `build`(Meow) ↔ `electron-builder-fox.json`(Fox)를 직접 비교:
- **공통**: 동일한 `build/afterPack.cjs`로 ad-hoc 서명(`codesign --force --deep --sign -`), `mac.identity:null`, dmg+zip(arm64+x64), category, publish 설정.
- **차이**: ① `mac.icon` = Fox `.png` vs Meow `.icns` — electron-builder가 mac 러너에서 png→icns 변환하므로 번들엔 둘 다 정상 `Contents/Resources/icon.icns`가 들어감. **Gatekeeper/서명 원인 아님.** ② appId/productName/output/version — 무관. ③ extraResources에 아이콘·트레이 png 복사 — 둘 다 동일하게 ad-hoc 서명에 봉인됨.
- **결론**: Fox를 Meow보다 "손상됨"에 더 취약하게 만드는 패키징 차이는 **없음**. 둘 다 ad-hoc+quarantine이라 똑같은 Gatekeeper 게이트에 걸린다.

### "확인 불가"(soft) vs "손상됨"(hard) 구분
- **"확인할 수 없는 개발자"(soft)** = 정상적인 비공증 동작. **우클릭 → 열기** 또는 **그래도 열기**로 열림. Meow가 늘 열리던 그 방식. Fox도 동일.
- **"손상되어 휴지통으로"(hard)** = quarantine된 앱의 서명이 strict 검증에 실패할 때. 보통 설정 차이가 아니라 **전송 중 서명 깨짐**(zip을 브라우저/파인더/클라우드가 재압축, 또는 dmg 대신 zip 다운로드)이 원인. → **dmg를 마운트해서 Applications로 드래그**하면 해결.

### 사용자 맥에서 확정 진단(원하면)
```
spctl -a -vv "/Applications/Fox Mode.app"
codesign --verify --deep --strict --verbose=4 "/Applications/Fox Mode.app"
```
- `source=Unnotarized Developer ID` / `rejected` → soft. 우클릭→열기로 열림(정상).
- `a sealed resource is missing or invalid` / `not signed at all` → 서명 깨짐(전송 문제). 새 dmg 재설치.
- 그래도 막히면 즉시 우회: `xattr -dr com.apple.quarantine "/Applications/Fox Mode.app"; open "/Applications/Fox Mode.app"`

### 코드 상태 (공증 패치 되돌림, 2026-06-19)
- `electron-builder-fox.json` — `afterSign` **제거**, `mac`에서 hardenedRuntime/gatekeeperAssess/entitlements/entitlementsInherit **제거**, **`identity:null` 복구**. = Meow와 동일한 ad-hoc 설정.
- `build/notarize.cjs` — **더 이상 throw 안 함**(시크릿 없으면 warn+skip). 설정에서 afterSign을 안 걸므로 평소엔 실행조차 안 됨. 미래에 공증할 때만 opt-in용으로 남겨둠.
- `build/afterPack.cjs` — ad-hoc 서명(변경 없음, Meow와 공유). CSC_LINK 없으면(=평소) 항상 ad-hoc 서명.
- `.github/workflows/release-fox.yml` — Apple 시크릿 env **제거 → 시크릿 없이 빌드 성공**. 빌드 후 "Inspect signature (diagnostic)" 스텝은 빌드를 실패시키지 않고 서명만 점검(서명이 깨진 빌드를 출하 전에 잡기 위함).
- `build/entitlements.mac.plist` — 안 쓰지만 남겨둠(미래 공증용).

### (선택) 미래에 정말 공증하려면
Apple Developer 가입 후 시크릿 5개(`APPLE_ID`/`APPLE_APP_SPECIFIC_PASSWORD`/`APPLE_TEAM_ID`/`CSC_LINK`/`CSC_KEY_PASSWORD`) 등록 + `electron-builder-fox.json`에 `afterSign:"build/notarize.cjs"`와 hardened runtime/entitlements 재추가하면 됨. 하지만 **현 방침은 비공증**이므로 불필요.

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
- v1.0.5: **공증 패치 되돌림** → Meow와 동일한 비공증 ad-hoc 배포로 확정 + 우회 안내(§6) (현재)

## 11. 남은 할 일
1. ✅ **비공증 ad-hoc 배포로 확정**(§6). 추가 작업 없음 — Release Fox로 fox-v1.0.5 빌드 후 dmg를 Gumroad 업로드. (공증은 선택, 현재 안 함.)
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
