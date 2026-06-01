# 판매 체크리스트 — Meow Mode

너가 직접 해야 할 것들 순서대로. **체크하면서 진행해.**

---

## 1단계 — 판매용 dmg 빌드 (Actions, 약 2~3분)

🔗 https://github.com/Celeste232/main/actions/workflows/release.yml

→ **Run workflow** 클릭 → **"Use workflow from"에서 `claude/cat-house-interactions-pFJxU` 선택** → Run.
(⚠️ main을 고르면 옛 워크플로가 돌아 옛 버전이 빌드됨. PR #1을 머지하면 그 뒤로는 아무 브랜치나 OK.)
워크플로가 항상 최신 개발 브랜치를 빌드하고, 버전은 `package.json`에서 자동으로 읽어 태그를 붙여.

약 2~3분 후 https://github.com/Celeste232/main/releases 에 최신 버전(예: **v0.2.9**) 릴리즈가 생김.

→ 그 페이지에서 dmg 두 개 다운로드:
- `Meow Mode-<버전>-arm64.dmg` (Apple Silicon)
- `Meow Mode-<버전>.dmg` (Intel — suffix 없음)

이 두 파일이 **판매 파일**이야.

---

## 3단계 — Gumroad 등록 (15분)

가장 추천. 무료 + 0% 거래 수수료 (5% 판매 수수료만).

1. https://gumroad.com 가입 (Google 계정으로 가입 가능)
2. 상단 **Products** → **New product**
3. 폼 채우기:
   - **Type**: Digital product
   - **Name**: `Meow Mode`
   - **Price**: `2.99 USD`
4. **Content** 탭 → 두 dmg + 가이드 업로드 (`Meow Mode-<버전>-arm64.dmg`, `Meow Mode-<버전>.dmg`, `meow-mode-guide.html`)
5. **Description** 탭 → `docs/sales-copy.md` 의 영문 또는 한국어 긴 글 복붙
6. **Cover image**: `build/icon.png` 업로드 (또는 프리뷰 영상 썸네일)
7. **Settings**:
   - URL: `meowmode` (사용자 본인 이름 + 슬러그)
   - Tags: `mac, desktop pet, doodle, indie, cute, productivity`
8. 위에서 **Publish** 버튼

→ 결과 URL: `https://[너id].gumroad.com/l/meowmode`

---

## 4단계 — Itch.io 등록 (선택, 10분)

게임/인디 커뮤니티 도달용. 한 군데만 할 거면 Gumroad가 낫고, 둘 다 하는 게 더 좋아.

1. https://itch.io 가입
2. 상단 → **Upload new project**
3. 폼:
   - **Title**: `Meow Mode`
   - **Project URL**: `meow-mode`
   - **Classification**: Other → **Other (creative tool)**
   - **Pricing**: Paid, Minimum price `$2.99`
4. **Uploads**: dmg 두 개 업로드 (각 파일에 "macOS" 플랫폼 태그)
5. **Details/cover/screenshots**: `docs/sales-copy.md` 영문 긴 글, cover는 icon.png
6. **Genre**: Visual novel ❌ → **Simulation** 또는 **Other**
7. **Tags**: `cute, pet, desktop, mac, indie, cats, doodle, pixel`
8. **Visibility & access** → **Public** → **Save & view**

---

## 5단계 — 트위터/X 첫 트윗 (5분)

🔗 https://twitter.com 가서 @meowmode_app 만들어. (가능하면 같은 이름 인스타도 같이)

첫 트윗 — `docs/social-copy.md` 의 "트위터 / X 첫 트윗 (한국어)" 그대로 복붙. GIF 첨부.

GIF 없으면? → 맥에서:
```
cd ~/cat-house
brew install ffmpeg     # 없으면 한 번만
./scripts/make-demo.sh
```
→ `demo/meow-mode-demo.gif` 가 생기면 트윗에 첨부.

---

## 끝나면 알려줘

Gumroad URL이랑 트윗 링크 보내주면 내가 메뉴얼/SNS 후속 글 마무리할게.
