import { useState } from 'react';
import useWorkoutRunner from '../lib/useWorkoutRunner';
import { loadSettings, saveSettings } from '../lib/storage';
import SetupField from '../components/SetupField';
import WorkoutScreens from '../components/WorkoutScreens';

const MODE = 'amrap';
const DEFAULTS = { minutes: 15 };

export default function Amrap() {
  const [settings, setSettings] = useState({ ...DEFAULTS, ...loadSettings(MODE) });
  const w = useWorkoutRunner();

  function updateField(val) {
    const n = Math.max(1, parseInt(val, 10) || 0);
    setSettings((s) => ({ ...s, minutes: n }));
  }

  function handleStart() {
    saveSettings(MODE, settings);
    // counts down from the minute cap to 0; no round counter — you track rounds yourself
    w.start(() => w.runSingle(settings.minutes * 60, 'down', () => w.finish()));
  }

  return (
    <WorkoutScreens
      label="AMRAP"
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
