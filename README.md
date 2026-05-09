# Cat House

데스크탑 위에서 돌아다니는 고양이 펫 + 집 + 밥/물그릇.

## 처음 한 번만

```bash
git clone https://github.com/Celeste232/main.git cat-house
cd cat-house
npm install
```

## 그냥 띄워보기

```bash
npm run dev
```

## 설치파일 만들기 (PC 앱)

```bash
npm run build
```

`release/` 폴더에:

- macOS: `CatHouse-x.x.x.dmg` (Apple Silicon + Intel 둘 다) — 더블클릭해서 Applications에 드래그
- Windows: `CatHouse Setup x.x.x.exe`
- Linux: `CatHouse-x.x.x.AppImage`

> **macOS에서만 dmg 빌드 가능**. Linux/Windows에선 zip이나 AppImage만 만들어짐. 본인 OS에서 빌드해야 함.
>
> 코드 사이닝 안 해놨음 → macOS 첫 실행 시 "확인되지 않은 개발자" 경고. 우클릭 → 열기 → 열기 한 번만 하면 그 뒤로 그냥 더블클릭으로 됨.

## 진짜 캐릭터 그림 적용하기

기본은 SVG로 그린 병맛 낙서 고양이가 떠요. 진짜 그림(PNG 시트)로 바꾸려면:

1. **개별 프레임 PNG가 있으면**: `src/assets/cat/<action>/<n>.png`로 바로 넣기. 앱이 자동 인식.
2. **시트 PNG가 있으면**: `src/assets/reference/`에 시트 넣고 `layout.json`에 좌표 적은 뒤
   ```bash
   npm run slice
   ```
   자세한 건 [src/assets/reference/README.md](src/assets/reference/README.md).

설정 메뉴의 "스킨" 드롭다운에서 PNG / 병맛 낙서 토글 가능 — 병맛 모드는 영구 보존.

## 폴더 구조

```
electron/                  메인 프로세스 (윈도우, IPC, electron-store)
src/
  App.tsx                  스테이지 조립
  components/              집/고양이/그릇/설정 메뉴
  hooks/                   행동 상태머신, 드래그, 호버 패스스루
  state/useAppStore.ts     zustand 글로벌 상태
  assets/
    cat/<action>/          PNG 프레임 드롭 위치
    reference/             원본 시트 + 슬라이싱 layout.json
docs/
  cat-svg-blueprint.json   병맛 SVG 명세서
scripts/
  slice-frames.mjs         시트 → 프레임 슬라이서 (sharp)
```

## 주요 인터랙션

- **집 본체 클릭** → 고양이 부르기
- **집 드래그** → 위치 이동 (자고 있을 땐 고양이도 함께)
- **지붕 톱니** → 설정 메뉴
- **고양이 직접 드래그** → 들어 올림 (`held`), 놓으면 놀람
- **마우스가 가까이** → 고양이가 쳐다봄
- **밥/물그릇 클릭** → 채우기
- **설정**: 영역 (전체/집 근처), 활동량, 집중 모드(뒤로 보내기), 집에 넣기, …
