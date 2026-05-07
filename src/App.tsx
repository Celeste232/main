import { useEffect, useState } from 'react';
import { useAppStore } from './state/useAppStore';
import { useHoverPassthrough } from './hooks/useHoverPassthrough';
import { useCatBehavior } from './hooks/useCatBehavior';
import { Cat } from './components/Cat/Cat';
import { House } from './components/House/House';
import { FoodBowl } from './components/Bowls/FoodBowl';
import { WaterBowl } from './components/Bowls/WaterBowl';
import { SettingsMenu } from './components/Settings/SettingsMenu';

export function App() {
  useHoverPassthrough();

  const settings = useAppStore((s) => s.settings);
  const setSettings = useAppStore((s) => s.setSettings);
  const housePos = useAppStore((s) => s.housePos);
  const cat = useAppStore((s) => s.cat);
  const setCat = useAppStore((s) => s.setCat);
  const settingsOpen = useAppStore((s) => s.settingsOpen);

  const [bounds, setBounds] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    void window.api.getSettings().then(setSettings);
    void window.api.getDisplayBounds().then((b) => setBounds({ width: b.width, height: b.height }));
  }, [setSettings]);

  const { callToHouse, startle } = useCatBehavior(bounds);

  const isResting = cat.action === 'sleeping' || cat.action === 'in-house';
  const isNearHouse = Math.hypot(cat.x - housePos.x, cat.y - housePos.y) < 80;

  const onHouseDragStart = () => {
    // Sleeping cat moves with the house — handled in onHouseDragStep.
    if (isResting) return;
    if (isNearHouse) {
      setCat({ x: housePos.x + 120, y: housePos.y + 40 });
    }
    startle();
  };

  const onHouseDragStep = (delta: { dx: number; dy: number }) => {
    if (isResting && isNearHouse) {
      const c = useAppStore.getState().cat;
      setCat({ x: c.x + delta.dx, y: c.y + delta.dy });
    }
  };

  if (!settings) return null;

  // Bowls sit to the right of the house.
  const foodBowlPos = { x: housePos.x + 130, y: housePos.y + 70 };
  const waterBowlPos = { x: housePos.x + 195, y: housePos.y + 70 };

  return (
    <div className="stage">
      <House onCall={callToHouse} onDragStart={onHouseDragStart} onDragStep={onHouseDragStep} />
      <FoodBowl x={foodBowlPos.x} y={foodBowlPos.y} />
      <WaterBowl x={waterBowlPos.x} y={waterBowlPos.y} />
      <Cat />
      {settingsOpen && (
        <SettingsMenu x={housePos.x + 120} y={Math.max(housePos.y - 20, 20)} />
      )}
    </div>
  );
}
