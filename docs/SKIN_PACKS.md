# 스킨팩 (Skin Packs)

판매용 DLC 컨셉. 기본 앱은 무료 + 추가 스킨팩을 따로 판매.

## 무료 스킨 (앱에 내장)

| ID | 이름 | 비고 |
|---|---|---|
| `default-png` | 기본 PNG | 사용자가 처음 받은 시트로 만든 frame 모음 (있을 때만 활성) |
| `svg-doodle` | 병맛 낙서 | SVG 코드로 그려진 발그림. 영원히 보존됨 |

## 유료 스킨 컨셉 (아직 미구현)

각 스킨팩은 zip 또는 폴더로 배포. 사용자는:
1. 구매 → `.catpack` 파일 다운로드
2. 앱에서 "스킨팩 추가" 버튼 클릭 → 파일 선택
3. 자동으로 `~/Library/Application Support/MeowMode/skin-packs/<id>/` 에 풀림
4. 설정 → 스킨 드롭다운에 추가됨

## `.catpack` 포맷 (계획)

```
my-skin/
├── manifest.json
└── frames/
    ├── idle/{1..3}.png
    ├── walking/{1..4}.png
    ├── sitting/{1..2}.png
    ├── sleeping/{1..3}.png
    └── ... 모든 액션 폴더
```

### `manifest.json`

```json
{
  "id": "tabby-cat",
  "name": "치즈 태비",
  "version": "1.0.0",
  "author": "Celeste232",
  "description": "오렌지 태비 고양이 스킨",
  "price": "$2.99",
  "previewImage": "preview.png",
  "license": "personal",
  "actions": ["idle", "walking", "sitting", ...]
}
```

## 판매 채널 후보

- **Gumroad** — 가장 빠름, 수수료 ~10%, 별도 사이트 필요 없음
- **Itch.io** — 인디게임/도구 친화적, 수수료 사용자가 정함
- **GitHub Sponsors** — 후원형 (티어별로 스킨 제공)
- **Patreon** — 월 구독형으로 매달 새 스킨

## 구현 단계 (TODO)

1. `src/skinPacks/registry.ts` — 내장 스킨 + 설치된 스킨 통합 레지스트리
2. `src/skinPacks/installer.ts` — `.catpack` 압축 풀기 + manifest 검증
3. Cat.tsx — 현재 `catSkin === 'svg-doodle'` 분기를 `loadSkinPack(id)` 호출로 교체
4. 설정 UI — 설치된 스킨 리스트, 추가 버튼, 미리보기 썸네일
5. (선택) 라이선스 키 확인 — 구매 인증 (Gumroad license API)

## 현재 코드와의 통합 지점

- `src/state/useAppStore.ts` 의 `Settings.catSkin` 타입을 `'svg-doodle' | string` 로 확장
- `src/components/Cat/catFrames.ts` 의 `getFrames(action)` 가 활성 스킨팩 경로를 받게 수정
- electron main에서 `protocol.registerFileProtocol('catpack', ...)` 로 외부 디렉토리의 PNG를 안전하게 로드
