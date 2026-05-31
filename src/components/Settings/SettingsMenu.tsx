import { useAppStore } from '../../state/useAppStore';
import { useT } from '../../i18n/strings';
import { playMeow } from '../../hooks/useCatBehavior';
import type { Settings } from '../../../electron/store';

interface SettingsMenuProps {
  x: number;
  y: number;
}

// Future paid skin packs land here. For now only the default doodle exists.
const PURCHASED_SKINS: { value: Settings['catSkin']; label: string }[] = [];

export function SettingsMenu({ x, y }: SettingsMenuProps) {
  const settings = useAppStore((s) => s.settings);
  const patch = useAppStore((s) => s.patchSettings);
  const setOpen = useAppStore((s) => s.setSettingsOpen);
  const catActions = useAppStore((s) => s.catActions);
  const cat = useAppStore((s) => s.cat);
  const t = useT();

  if (!settings) return null;

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  const ACTIVITY_LEVELS: { value: Settings['activityLevel']; label: string }[] = [
    { value: 'calm', label: t.activityCalm },
    { value: 'normal', label: t.activityNormal },
    { value: 'energetic', label: t.activityEnergetic },
  ];

  const ROAM_AREAS: { value: Settings['roamArea']; label: string }[] = [
    { value: 'near-house', label: t.areaNearHouse },
    { value: 'edges', label: t.areaEdges },
    { value: 'full', label: t.areaFull },
  ];

  const LAYERS: { value: Settings['windowLayer']; label: string }[] = [
    { value: 'front', label: t.layerFront },
    { value: 'normal', label: t.layerNormal },
    { value: 'back', label: t.layerBack },
  ];

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

      <h2>{t.title}</h2>

      <div className="settings-row">
        <label>{t.name}</label>
        <input
          className="doodle-input"
          type="text"
          value={settings.catName}
          onChange={(e) => void patch({ catName: e.target.value })}
          onPointerDown={stop}
        />
      </div>

      <div className="settings-row">
        <label>{t.skin}</label>
        <button
          className={`doodle-dropdown${PURCHASED_SKINS.length === 0 ? ' empty' : ''}`}
          onPointerUp={(e) => {
            stop(e);
            // Future: open a menu of PURCHASED_SKINS
          }}
          disabled={PURCHASED_SKINS.length === 0}
        >
          {t.skinDefault}
        </button>
      </div>

      <div className="settings-row">
        <label>{t.activity}</label>
        <Track
          options={ACTIVITY_LEVELS}
          current={settings.activityLevel}
          onChange={(v) => void patch({ activityLevel: v })}
        />
      </div>

      <div className="settings-row">
        <label>{t.area}</label>
        <Track
          options={ROAM_AREAS}
          current={settings.roamArea}
          onChange={(v) => void patch({ roamArea: v })}
        />
      </div>

      <div className="settings-row">
        <label>{t.speechBubble}</label>
        <div className="doodle-toggle">
          <button
            className={settings.showSpeechBubble ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ showSpeechBubble: true }); }}
          >{t.on}</button>
          <button
            className={!settings.showSpeechBubble ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ showSpeechBubble: false }); }}
          >{t.off}</button>
        </div>
      </div>

      <div className="settings-row">
        <label>{t.hideCat}</label>
        <div className="doodle-toggle">
          <button
            className={!settings.hideCat ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ hideCat: false }); }}
          >{t.show}</button>
          <button
            className={settings.hideCat ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ hideCat: true }); }}
          >{t.hide}</button>
        </div>
      </div>

      <div className="settings-actions">
        <button onPointerUp={(e) => { stop(e); catActions?.findCat(); }}>{t.findCat}</button>
        <button onPointerUp={(e) => { stop(e); catActions?.callToHouse(); }}>{t.callHome}</button>
      </div>
      <div className="settings-actions">
        {cat.locked === 'in-house' ? (
          <button onPointerUp={(e) => { stop(e); catActions?.releaseFromHouse(); }}>{t.releaseFromHouse}</button>
        ) : (
          <button onPointerUp={(e) => { stop(e); catActions?.putInHouse(); }}>{t.putInHouse}</button>
        )}
      </div>

      <h3>{t.program}</h3>

      <div className="settings-row">
        <label>{t.windowLayer}</label>
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
          {settings.paused ? t.unpause : t.pause}
        </button>
      </div>

      <div className="settings-row">
        <label>{t.autoStart}</label>
        <div className="doodle-toggle">
          <button
            className={!settings.launchAtStartup ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ launchAtStartup: false }); }}
          >{t.offShort}</button>
          <button
            className={settings.launchAtStartup ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ launchAtStartup: true }); }}
          >{t.onShort}</button>
        </div>
      </div>

      <div className="settings-row">
        <label>{t.language}</label>
        <div className="doodle-pills">
          <button
            className={settings.language === 'ko' ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ language: 'ko' }); }}
          >한국어</button>
          <button
            className={settings.language === 'en' ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ language: 'en' }); }}
          >EN</button>
          <button
            className={settings.language === 'ja' ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ language: 'ja' }); }}
          >日本</button>
          <button
            className={settings.language === 'zh' ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ language: 'zh' }); }}
          >中文</button>
        </div>
      </div>

      <div className="settings-row">
        <label>{t.sound}</label>
        <div className="doodle-pills">
          <button
            className={!settings.soundEnabled ? 'active' : ''}
            onPointerUp={(e) => { stop(e); void patch({ soundEnabled: false }); }}
          >{t.soundOff}</button>
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              className={settings.soundEnabled && (settings.soundType ?? 1) === n ? 'active' : ''}
              onPointerUp={(e) => {
                stop(e);
                // Pick this meow and play a preview so the difference is audible.
                void patch({ soundEnabled: true, soundType: n });
                playMeow(settings.volume ?? 0.5, n);
              }}
            >{t[`soundType${n}` as const]}</button>
          ))}
        </div>
      </div>

      <h3>{t.data}</h3>
      <div className="settings-row">
        <label>{t.affinity}</label>
        <span style={{ flex: 1 }}>{settings.affinity}</span>
      </div>
      <div className="settings-actions">
        <button onPointerUp={(e) => {
          stop(e);
          void window.api.resetSettings().then((s) => useAppStore.getState().setSettings(s));
        }}>{t.reset}</button>
        <button onPointerUp={(e) => { stop(e); window.api.hide(); }}>{t.hideWindow}</button>
        <button onPointerUp={(e) => { stop(e); window.api.quit(); }}>{t.quit}</button>
      </div>
    </div>
  );
}
