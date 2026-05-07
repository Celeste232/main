import { useAppStore } from '../../state/useAppStore';

interface SettingsMenuProps {
  x: number;
  y: number;
}

export function SettingsMenu({ x, y }: SettingsMenuProps) {
  const settings = useAppStore((s) => s.settings);
  const patch = useAppStore((s) => s.patchSettings);
  const setOpen = useAppStore((s) => s.setSettingsOpen);

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

      <h3>프로그램</h3>
      <div className="settings-row">
        <label>시작 시 자동 실행</label>
        <input
          type="checkbox"
          checked={settings.launchAtStartup}
          onChange={(e) => void patch({ launchAtStartup: e.target.checked })}
        />
      </div>
      <div className="settings-row">
        <label>항상 위에 표시</label>
        <input
          type="checkbox"
          checked={settings.alwaysOnTop}
          onChange={(e) => void patch({ alwaysOnTop: e.target.checked })}
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
