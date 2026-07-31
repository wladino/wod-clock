import { useState } from 'react';
import useWorkoutRunner from '../lib/useWorkoutRunner';
import { loadSettings, saveSettings } from '../lib/storage';
import SetupField from '../components/SetupField';
import WorkoutScreens from '../components/WorkoutScreens';

const MODE = 'tabata';
const DEFAULTS = { rounds: 8, work: 20, rest: 10 };

export default function Tabata() {
  const [settings, setSettings] = useState({ ...DEFAULTS, ...loadSettings(MODE) });
  const [errors, setErrors] = useState({});
  const w = useWorkoutRunner();

  function updateField(key, n) {
    setSettings((s) => ({ ...s, [key]: n }));
  }

  // work -> rest (if any) -> next round -> ... -> finish after the last round
  function sequence(r, phase) {
    const dur = phase === 'work' ? settings.work : settings.rest;
    w.runPhase(r, phase, dur, () => {
      if (phase === 'work' && settings.rest > 0) {
        sequence(r, 'rest');
      } else {
        const next = r + 1;
        if (next > settings.rounds) w.finish();
        else sequence(next, 'work');
      }
    });
  }

  function handleStart() {
    const nextErrors = {};
    ['rounds', 'work', 'rest'].forEach((key) => {
      if (settings[key] === '') nextErrors[key] = true;
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    saveSettings(MODE, settings);
    w.start(() => sequence(1, 'work'));
  }

  return (
    <WorkoutScreens
      label="TABATA"
      runner={w}
      showRound
      showPhase
      setup={
        <>
          <div className="setup-fields">
            <SetupField pre="FOR" unit="ROUNDS" min={1} value={settings.rounds} invalid={errors.rounds} onChange={(n) => updateField('rounds', n)} />
            <SetupField pre="WORK" unit="SECONDS" min={1} value={settings.work} invalid={errors.work} onChange={(n) => updateField('work', n)} />
            <SetupField pre="REST" unit="SECONDS" min={0} value={settings.rest} invalid={errors.rest} onChange={(n) => updateField('rest', n)} />
          </div>
          <button className="start-btn" onClick={handleStart}>START</button>
        </>
      }
    />
  );
}
