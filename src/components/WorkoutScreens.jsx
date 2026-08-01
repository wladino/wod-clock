import { useState } from 'react';
import Screen from './Screen';
import { formatClock } from '../lib/timer';
import { loadSoundEnabled, saveSoundEnabled } from '../lib/storage';

// Renders whichever of the four states (setup/countdown/running/completed) the
// mode's useWorkoutRunner is currently in. `setup` is the only mode-specific
// markup passed in — everything else (countdown digits, clock, round/phase,
// completed message, footer links, sound toggle) is identical across all
// four clocks.
export default function WorkoutScreens({ label, runner, setup, showRound = false, showPhase = false }) {
  const { screen, countdownN, alert, round, phase, clockDisplay, goHome, resetToSetup } = runner;
  const [soundEnabled, setSoundEnabled] = useState(loadSoundEnabled());

  function toggleSound(e) {
    const enabled = e.target.checked;
    setSoundEnabled(enabled);
    saveSoundEnabled(enabled);
  }

  if (screen === 'setup') {
    return (
      <Screen header={label} footer={<button className="link" onClick={goHome}>BACK</button>}>
        {setup}
        <label className="toggle-row">
          <input type="checkbox" className="toggle-input" checked={soundEnabled} onChange={toggleSound} />
          <span className="toggle-track"><span className="toggle-thumb" /></span>
          Sound notification
        </label>
      </Screen>
    );
  }

  if (screen === 'countdown') {
    return (
      <Screen header={label} footer={null}>
        <div className={`countdown-num${alert ? ' alert' : ''}`}>{countdownN}</div>
      </Screen>
    );
  }

  const runningFooter = (
    <>
      <button className="link" onClick={goHome}>BACK</button>
      <button className="link" onClick={resetToSetup}>RESET</button>
    </>
  );

  if (screen === 'running') {
    return (
      <Screen header={label} footer={runningFooter}>
        {showRound && <div className={`round${phase === 'rest' ? ' resting' : ''}`}>R{round}</div>}
        {showPhase && <div className="phase-label">{phase.toUpperCase()}</div>}
        <div className={`clock${alert ? ' alert' : ''}`}>{formatClock(clockDisplay)}</div>
      </Screen>
    );
  }

  return (
    <Screen header={label} footer={runningFooter}>
      <div className="completed">WORKOUT<br />COMPLETED</div>
    </Screen>
  );
}
