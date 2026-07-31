import { useState } from 'react';
import useWorkoutRunner from '../lib/useWorkoutRunner';
import { loadSettings, saveSettings } from '../lib/storage';
import SetupField from '../components/SetupField';
import WorkoutScreens from '../components/WorkoutScreens';

const MODE = 'fortime';
const DEFAULTS = { minutes: 10 };

export default function ForTime() {
  const [settings, setSettings] = useState({ ...DEFAULTS, ...loadSettings(MODE) });
  const w = useWorkoutRunner();

  function updateField(val) {
    const n = Math.max(1, parseInt(val, 10) || 0);
    setSettings((s) => ({ ...s, minutes: n }));
  }

  function handleStart() {
    saveSettings(MODE, settings);
    // counts up from 0:00; auto-completes when elapsed hits the minute cap
    w.start(() => w.runSingle(settings.minutes * 60, 'up', () => w.finish()));
  }

  return (
    <WorkoutScreens
      label="FOR TIME"
      runner={w}
      setup={
        <>
          <div className="setup-fields">
            <SetupField pre="FOR" unit="MINUTES" min={1} value={settings.minutes} onChange={updateField} />
          </div>
          <button className="start-btn" onClick={handleStart}>START</button>
        </>
      }
    />
  );
}
