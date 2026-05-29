import { useAppStore } from '../../state/useAppStore';
import type { Settings } from '../../../electron/store';

interface SettingsMenuProps {
  x: number;
  y: number;
}

const ACTIVITY_LEVELS: { value: Settings['activityLevel']; label: string }[] = [
  { value: 'calm', label: '조용' },
  { value: 'normal', label: '보통' },
  { value: 'energetic', label: '활발' },
];

const ROAM_AREAS: { value: Settings['roamArea']; label: string }[] = [
  { value: 'at-house', label: '집안' },
  { value: 'near-house', label: '집근처' },
  { value: 'edges', label: '가장자리' },
  { value: 'full', label: '전체' },
];

const LAYERS: { value: Settings['windowLayer']; label: string }[] = [
  { value: 'front', label: '맨앞' },
  { value: 'normal', label: '중간' },
  { value: 'back', label: '맨뒤' },
];

const SKINS: { value: Settings['catSkin']; label: string }[] = [
  { value: 'svg-doodle', label: '발그림 (기본)' },
  { value: 'png', label: 'PNG' },
];

export function SettingsMenu({ x, y }: SettingsMenuProps) {
  const settings = useAppStore((s) => s.settings);
  const patch = useAppStore((s) => s.patchSettings);
  const setOpen = useAppStore((s) => s.setSettingsOpen);
  const catActions = useAppStore((s) => s.catActions);
  const cat = useAppStore((s) => s.cat);

  if (!settings) return null;

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  const Track = <T extends string>(props: {
    options: { value: T; label: string }[];
    current: T;
    onChange: (v: T) => void;
  }) => (
    <div className="doodle-track">
      <span className="line" />
      {props.options.map((opt) => (
        <button
          key={opt.value}
          className={`stop${opt.value === props.current ? ' active' : ''}`}
          onPointerUp={(e) => {
            stop(e);
            props.onChange(opt.value);
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  return (
    <div
      className="settings-panel interactive"
      style={{ left: x, top: y }}
      onPointerDown={stop}
    >
      <button className="settings-close" onPointerUp={(e) => { stop(e); setOpen(false); }}>×</button>

      <h2>반려 냥이 키우기</h2>

      <div className="settings-row">
        <label>이름</label>
        <input
          className="doodle-input"
          type="text"
          value={settings.catName}
          onChange={(e) => void patch({ catName: e.target.value })}
          onPointerDown={stop}
        />
      </div>

      <div className="settings-row">
        <label>스킨</label>
        <div className="doodle-pills">
          {SKINS.map((s) => (
            <button
              key={s.value}
              className={settings.catSkin === s.value ? 'active' : ''}
              onPointerUp={(e) => { stop(e); void patch({ catSkin: s.value }); }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-row">
        <label>활동량</label>
        <Track
          options={ACTIVITY_LEVELS}
          current={settings.activityLevel}
          onChange={(v) => void patch({ activityLevel: v })}
        />
      </div>

      <div className="settings-row">
        <label>활동영역</label>
        <Track
          options={ROAM_AREAS}
          current={settings.roamArea}
          onChange={(v) => void patch({ roamArea: v })}
        />
      </div>

      <div className="settings-row">
        <label>말풍선</label>
        <div className="doodle-toggle">
          <button
            className={settings.showSpeechBubble ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ showSpeechBubble: true }); }}
          >있기</button>
          <button
            className={!settings.showSpeechBubble ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ showSpeechBubble: false }); }}
          >없기</button>
        </div>
      </div>

      <div className="settings-row">
        <label>고양이 숨기기</label>
        <div className="doodle-toggle">
          <button
            className={!settings.hideCat ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ hideCat: false }); }}
          >보임</button>
          <button
            className={settings.hideCat ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ hideCat: true }); }}
          >숨김</button>
        </div>
      </div>

      <div className="settings-actions">
        <button onPointerUp={(e) => { stop(e); catActions?.findCat(); }}>고양이 찾기</button>
        <button onPointerUp={(e) => { stop(e); catActions?.callToHouse(); }}>집으로 부르기</button>
      </div>
      <div className="settings-actions">
        {cat.locked === 'in-house' ? (
          <button onPointerUp={(e) => { stop(e); catActions?.releaseFromHouse(); }}>집에서 꺼내기</button>
        ) : (
          <button onPointerUp={(e) => { stop(e); catActions?.putInHouse(); }}>집에 넣기</button>
        )}
      </div>

      <h3>프로그램</h3>

      <div className="settings-row">
        <label>화면 위치</label>
        <div className="doodle-pills">
          {LAYERS.map((l) => (
            <button
              key={l.value}
              className={settings.windowLayer === l.value ? 'active' : ''}
              onPointerUp={(e) => { stop(e); void patch({ windowLayer: l.value }); }}
            >{l.label}</button>
          ))}
        </div>
      </div>

      <div className="settings-actions">
        <button
          className={settings.paused ? 'primary' : ''}
          onPointerUp={(e) => { stop(e); void patch({ paused: !settings.paused }); }}
        >
          {settings.paused ? '다시 켜기' : '잠깐 끄기'}
        </button>
      </div>

      <div className="settings-row">
        <label>자동 실행</label>
        <div className="doodle-toggle">
          <button
            className={!settings.launchAtStartup ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ launchAtStartup: false }); }}
          >끔</button>
          <button
            className={settings.launchAtStartup ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ launchAtStartup: true }); }}
          >켬</button>
        </div>
      </div>

      <div className="settings-row">
        <label>사운드</label>
        <div className="doodle-toggle">
          <button
            className={!settings.soundEnabled ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ soundEnabled: false }); }}
          >끔</button>
          <button
            className={settings.soundEnabled ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ soundEnabled: true }); }}
          >켬</button>
        </div>
      </div>

      <div className="settings-row">
        <label>볼륨</label>
        <div className="doodle-slider">
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={(e) => void patch({ volume: Number(e.target.value) })}
            onPointerDown={stop}
          />
        </div>
      </div>

      <h3>데이터</h3>
      <div className="settings-row">
        <label>친밀도</label>
        <span style={{ flex: 1 }}>{settings.affinity}</span>
      </div>
      <div className="settings-actions">
        <button onPointerUp={(e) => {
          stop(e);
          void window.api.resetSettings().then((s) => useAppStore.getState().setSettings(s));
        }}>초기화</button>
        <button onPointerUp={(e) => { stop(e); window.api.hide(); }}>숨기기</button>
        <button onPointerUp={(e) => { stop(e); window.api.quit(); }}>종료</button>
      </div>
    </div>
  );
}
