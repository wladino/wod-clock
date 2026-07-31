import { useState } from 'react';
import useWorkoutRunner from '../lib/useWorkoutRunner';
import { loadSettings, saveSettings } from '../lib/storage';
import SetupField from '../components/SetupField';
import WorkoutScreens from '../components/WorkoutScreens';

const MODE = 'emom';
const DEFAULTS = { every_min: 1, every_sec: 0, rounds: 10, rest: 0 };

export default function Emom() {
  const [settings, setSettings] = useState({ ...DEFAULTS, ...loadSettings(MODE) });
  const [errors, setErrors] = useState({});
  const w = useWorkoutRunner();

  function updateField(key, n) {
    setSettings((s) => ({ ...s, [key]: n }));
  }

  // the interval ("every" min:sec) is split into work + rest, so each round
  // always lands exactly on the next interval boundary
  function sequence(r, phase) {
    const everySec = settings.every_min * 60 + settings.every_sec;
    const workSec = Math.max(everySec - settings.rest, 0);
    const dur = phase === 'work' ? workSec : settings.rest;
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
    ['every_min', 'every_sec', 'rounds', 'rest'].forEach((key) => {
      if (settings[key] === '') nextErrors[key] = true;
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    saveSettings(MODE, settings);
    w.start(() => sequence(1, 'work'));
  }

  return (
    <WorkoutScreens
      label="EMOM"
      runner={w}
      showRound
      showPhase
      setup={
        <>
          <div className="setup-fields">
            <SetupField pre="EVERY" unit="MINUTES" min={0} value={settings.every_min} invalid={errors.every_min} onChange={(n) => updateField('every_min', n)} />
            <SetupField pre="AND" unit="SECONDS" min={0} max={59} value={settings.every_sec} invalid={errors.every_sec} onChange={(n) => updateField('every_sec', n)} />
            <SetupField pre="FOR" unit="ROUNDS" min={1} value={settings.rounds} invalid={errors.rounds} onChange={(n) => updateField('rounds', n)} />
            <SetupField pre="REST" unit="SECONDS" min={0} value={settings.rest} invalid={errors.rest} onChange={(n) => updateField('rest', n)} />
          </div>
          <button className="start-btn" onClick={handleStart}>START</button>
        </>
      }
    />
  );
}
