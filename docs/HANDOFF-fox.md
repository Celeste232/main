# 인수인계서 / Handoff — Meow Mode + Fox Mode (2026-06-14)

> 이 세션이 길어져서 다음 세션(또는 다른 도구)이 이어받도록 현재 상태를 정리한 문서.

## 한 줄 요약
**Meow Mode(고양이)** = 판매중인 macOS 데스크탑 펫. **Fox Mode(여우)** = 같은 repo에서 별도 빌드하는 신규 별개 제품. 지금 **활성 블로커: Fox Mode v1.0.4가 맥에서 "손상되어 휴지통으로" 뜨며 안 열림** (Gatekeeper/서명 문제).

## 저장소 / 브랜치
- repo: `Celeste232/main` (private)
- **dev (빌드 대상)**: `claude/cat-house-interactions-pFJxU` ← 모든 코드 + 워크플로가 항상 이 브랜치 HEAD를 체크아웃해 빌드
- `claude/sweet-heisenberg-JhBcl` : 작업 브랜치, dev와 동일하게 유지
- `main` : 워크플로 파일 보유 (release.yml=Meow, release-fox.yml=Fox)

## 두 제품 구조 (한 코드베이스, 별도 빌드)
- **Meow Mode**: 손코딩 SVG 고양이(`src/components/Cat/CatSvg.tsx`). 버전=`package.json`(현 0.2.10). 빌드=`npm run build` / 워크플로 `release.yml` / 태그 `v*`. published: v0.2.9.
- **Fox Mode**: `여우_01.png` 시트에서 잘라낸 PNG 스킨. 빌드=`npm run build:fox` (`electron-builder-fox.json`: appId `com.celinelee.foxmode`, productName "Fox Mode", 버전=`extraMetadata.version` 현 1.0.4, output `release-fox/`). 워크플로 `release-fox.yml` / 태그 `fox-v*`. published: fox-v1.0.1(구버그). v1.0.2~1.0.4는 코드 커밋됨(빌드는 사용자가 워크플로 돌려야 생성).

## 빌드 분기 메커니즘
- `VITE_FOX=1 vite build` → `vite.config.ts`의 `define: { __IS_FOX__ }` 로 주입
- `__IS_FOX__` 면: ① `Cat.tsx`가 PNG 여우 강제 + 좌우반전 보정(여우 그림이 기본 왼쪽 봄) ② `src/i18n/strings.ts`의 `foxify()`가 UI 글자 여우化(먀우 모드→Fox Mode, 고양이→여우, 4개국어)
- 트레이(main 프로세스)는 `electron/i18n.ts`에서 `app.getName()`에 "fox" 포함 여부로 여우化

## 여우 에셋 파이프라인
- `scripts/slice-fox.mjs`: `src/assets/reference/여우_01.png`(불투명 흰배경) → 패널 그리드(3열×4행, 패널 512×256)에서 슬라이스 → `src/assets/cat/<action>/<n>.png`
- **흰배경 제거 = flood-fill** (`removeBackground`): 테두리에서 흰색 따라 들어가며 투명화, 여우 흰털은 윤곽선에 막혀 보존. → 흰배경 시트 `여우_02~06`도 같은 방식으로 추가 가능(미래 동작).
- 액션: walking/zoomies/sitting/sleeping/tail-wag/jumping/curious/roll + 별칭(idle=sitting 등). 앉기 3번(뒷모습)은 드롭.
- 매핑 스펙: `docs/fox-actions.md`

## 🔴 활성 블로커: Fox Mode "손상되어 휴지통으로" (안 열림)
- 증상: fox-v1.0.4 dmg 더블클릭 시 "손상되어 휴지통으로 이동". Meow Mode는 "그래도 열기"(소프트 프롬프트)로 열렸는데 Fox는 더 강하게 막힘.
- **원인 후보**: Fox 빌드의 ad-hoc 서명(`build/afterPack.cjs`)이 Meow와 다르게 깨짐. `--config electron-builder-fox.json` 빌드에서 afterPack이 실행/검증됐는지 확인 필요.
- **진단 절차**: fox-v1.0.4 빌드 로그(Actions→Release Fox→해당 run→Build Fox Mode 스텝)에서 `[afterPack] ad-hoc signing` / `ad-hoc signature verified ✓` 출력 확인. Meow의 Release 빌드 로그와 비교. 차이 있으면 거기.
- **즉시 우회(사용자 맥)**: `xattr -dr com.apple.quarantine "/Applications/Fox Mode.app"; open "/Applications/Fox Mode.app"` (격리 제거 → 서명 상관없이 무조건 열림).
- **영구 해결**: Apple 공증(notarization, Apple Developer $99/년). 그러면 사용자·구매자 모두 더블클릭으로 그냥 열림. 빌드에 공증 단계 추가 필요(Apple ID/앱암호/팀ID 시크릿).

## ⚠️ 어시스턴트 환경 제약 (반드시 인지)
- **클라우드 리눅스 컨테이너** — 사용자 맥 접근 불가(`/Users`, `/Volumes` 안 보임). 앱 실행·Gatekeeper 통과·맥 터미널은 **사용자가** 해야 함.
- **GitHub Actions 트리거 불가** (403 "Resource not accessible by integration" — actions:write 없음). **태그 push도 403**. → 빌드/태그는 **사용자 또는 브라우저 클로드**가 GitHub UI / 인증된 git으로.
- 가능: 코드 편집, repo 브랜치 push, 컨테이너 내 typecheck/vite build/슬라이스 검증, GitHub MCP로 릴리스·PR·파일·워크플로 run **조회**.

## 빌드 트리거 방법 (사용자/브라우저 클로드)
- Fox: https://github.com/Celeste232/main/actions/workflows/release-fox.yml → **Run workflow**. 매 실행이 **현재 dev 코드**로 새 `fox-v<version>` 빌드 (버전=electron-builder-fox.json). 브랜치 아무거나 OK(항상 dev 빌드).
- Meow: Actions → "Release" → Run workflow (버전=package.json).
- 태그 방식도 가능: `git push origin <tag>` (fox-v*, v*) — 사용자 인증 git에서.

## 남은 할 일
1. 🔴 **Fox "손상됨" 서명 해결** (위 진단) — 또는 공증 세팅.
2. **여우 집/그릇**: 사용자 맥 `/Users/wony/Desktop/V-Main/판매앱 프로그램 만들기`에 이미지 있음, repo 미반영. push되면 `House/Bowls`(현재 SVG)를 여우 그림으로 교체(flood-fill 재활용) → v1.1.
3. **여우 추가 동작**(밥/물/하품 등): `여우_02~06` 흰배경 시트 슬라이스(flood-fill) 추가.
4. **판매자료**: Meow=`docs/`(sales-copy.md, meow-mode-guide.html, gumroad-snippets.md). Fox=`docs/fox/`(sales-copy.md, guide.html, gumroad-snippets.md). 영/일/중 도입부 flavor에 고양이끼 약간 남음(다듬기 선택).
5. PR #1(cat release.yml→main) 열려있음. 깨진 draft 릴리스(v0.2.3/0.2.4) 정리 선택.
6. Gumroad: Meow Mode + Fox Mode **별도 상품**. private repo라 무료유출 없음, 사용자가 dmg 받아 업로드. 첫 실행 안내(우클릭→열기/그래도 열기) 상품페이지 필수.

## 핵심 파일
- `electron/main.ts` (투명창/트레이/클릭통과 — focus 핸들러가 mouseIgnored 재적용), `electron/i18n.ts` (트레이 i18n+여우化), `electron/store.ts`
- `src/components/Cat/Cat.tsx` (스프라이트 렌더 + `__IS_FOX__` + 좌우반전), `CatSvg.tsx`, `catFrames.ts`(PNG glob)
- `src/i18n/strings.ts` (UI i18n + `foxify`), `src/components/Settings/SettingsMenu.tsx`
- `scripts/slice-fox.mjs` (슬라이스+배경제거), `vite.config.ts` (`__IS_FOX__` define)
- `electron-builder-fox.json`, `.github/workflows/release-fox.yml`, `build/afterPack.cjs` (ad-hoc 서명), `build/icon-fox.png` (투명 여우 아이콘)
- `docs/fox-actions.md` (매핑 스펙), `docs/HANDOFF.md` (초기 고양이 핸드오프)

## 최근 커밋 흐름 (dev)
... → 여우 스킨 추가 → Fox Mode 별개앱 분리 → fox 1.0.1 → 1.0.2(플래그/i18n) → 1.0.3(좌우반전/투명아이콘/뒷모습프레임제거) → 1.0.4(흰배경 flood-fill 제거) → (이 핸드오프)
