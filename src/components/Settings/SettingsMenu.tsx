import { useAppStore } from '../../state/useAppStore';

interface SettingsMenuProps {
  x: number;
  y: number;
}

export function SettingsMenu({ x, y }: SettingsMenuProps) {
  const settings = useAppStore((s) => s.settings);
  const patch = useAppStore((s) => s.patchSettings);
  const setOpen = useAppStore((s) => s.setSettingsOpen);
  const catActions = useAppStore((s) => s.catActions);
  const cat = useAppStore((s) => s.cat);

  if (!settings) return null;

  return (
    <div
      className="settings-panel interactive"
      style={{ left: x, top: y }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button className="settings-close" onClick={() => setOpen(false)}>×</button>

      <h3>고양이</h3>
      <div className="settings-row">
        <label>이름</label>
        <input
          type="text"
          value={settings.catName}
          onChange={(e) => void patch({ catName: e.target.value })}
        />
      </div>
      <div className="settings-row">
        <label>스킨</label>
        <select
          value={settings.catSkin}
          onChange={(e) => void patch({ catSkin: e.target.value as typeof settings.catSkin })}
        >
          <option value="png">PNG (있으면)</option>
          <option value="svg-doodle">병맛 낙서</option>
        </select>
      </div>
      <div className="settings-row">
        <label>활동량</label>
        <select
          value={settings.activityLevel}
          onChange={(e) => void patch({ activityLevel: e.target.value as typeof settings.activityLevel })}
        >
          <option value="calm">조용함</option>
          <option value="normal">보통</option>
          <option value="energetic">활발함</option>
        </select>
      </div>
      <div className="settings-row">
        <label>돌아다닐 영역</label>
        <select
          value={settings.roamArea}
          onChange={(e) => void patch({ roamArea: e.target.value as typeof settings.roamArea })}
        >
          <option value="full">전체 화면</option>
          <option value="near-house">집 근처만</option>
          <option value="at-house">집에만 있기</option>
        </select>
      </div>
      <div className="settings-row">
        <label>말풍선</label>
        <input
          type="checkbox"
          checked={settings.showSpeechBubble}
          onChange={(e) => void patch({ showSpeechBubble: e.target.checked })}
        />
      </div>
      <div className="settings-row">
        <label>고양이 숨기기</label>
        <input
          type="checkbox"
          checked={settings.hideCat}
          onChange={(e) => void patch({ hideCat: e.target.checked })}
        />
      </div>
      <div className="settings-actions">
        <button onClick={() => catActions?.findCat()}>고양이 찾기</button>
        <button onClick={() => catActions?.callToHouse()}>집으로 부르기</button>
      </div>
      <div className="settings-actions">
        {cat.locked === 'in-house' ? (
          <button onClick={() => catActions?.releaseFromHouse()}>집에서 꺼내기</button>
        ) : (
          <button onClick={() => catActions?.putInHouse()}>집에 넣기</button>
        )}
      </div>

      <h3>프로그램</h3>
      <div className="settings-row">
        <label>화면 위치</label>
        <select
          value={settings.windowLayer}
          onChange={(e) => void patch({ windowLayer: e.target.value as typeof settings.windowLayer })}
        >
          <option value="front">맨 앞 (항상 위)</option>
          <option value="normal">보통</option>
          <option value="back">맨 뒤 (작업할 때)</option>
        </select>
      </div>
      <div className="settings-actions">
        <button onClick={() => void patch({ paused: !settings.paused })}>
          {settings.paused ? '다시 켜기' : '잠깐 끄기'}
        </button>
      </div>
      <div className="settings-row">
        <label>시작 시 자동 실행</label>
        <input
          type="checkbox"
          checked={settings.launchAtStartup}
          onChange={(e) => void patch({ launchAtStartup: e.target.checked })}
        />
      </div>
      <div className="settings-row">
        <label>사운드</label>
        <input
          type="checkbox"
          checked={settings.soundEnabled}
          onChange={(e) => void patch({ soundEnabled: e.target.checked })}
        />
      </div>
      <div className="settings-row">
        <label>볼륨</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={settings.volume}
          onChange={(e) => void patch({ volume: Number(e.target.value) })}
        />
      </div>

      <h3>데이터</h3>
      <div className="settings-row">
        <label>친밀도</label>
        <span>{settings.affinity}</span>
      </div>
      <div className="settings-actions">
        <button onClick={() => void window.api.resetSettings().then((s) => useAppStore.getState().setSettings(s))}>
          초기화
        </button>
        <button onClick={() => window.api.hide()}>숨기기</button>
        <button onClick={() => window.api.quit()}>종료</button>
      </div>
    </div>
  );
}
