import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { runPhaseTimer, alertPulse } from './timer';
import { unlockAudio } from './sound';

// Shared plumbing for every clock page: pre-start countdown, wake lock,
// the running clock/round state, and cleanup when the page unmounts
// (i.e. the user navigates to another route). Each mode's own sequencing
// rules (work/rest order, count up vs down) live in the page component —
// that's the part that's actually different between TABATA/EMOM/FOR TIME/AMRAP.
export default function useWorkoutRunner() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState('setup'); // setup | countdown | running | completed
  const [countdownN, setCountdownN] = useState(10);
  const [alert, setAlert] = useState(false);
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState('work');
  const [clockDisplay, setClockDisplay] = useState(0);

  const stopRef = useRef(null);
  const wakeLockRef = useRef(null);

  useEffect(() => {
    return () => {
      stop();
      releaseWakeLock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stop() {
    if (stopRef.current) {
      stopRef.current();
      stopRef.current = null;
    }
  }

  function requestWakeLock() {
    if ('wakeLock' in navigator) {
      navigator.wakeLock
        .request('screen')
        .then((lock) => {
          wakeLockRef.current = lock;
        })
        .catch(() => {});
    }
  }

  function releaseWakeLock() {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
  }

  // 10s pre-start countdown (last 3s in red + vibrate + flicker), then onGo() runs the mode's sequence
  function start(onGo) {
    unlockAudio();
    requestWakeLock();
    setScreen('countdown');
    setCountdownN(10);
    stop();
    stopRef.current = runPhaseTimer(10, 'down', (n, a) => {
      setCountdownN(n);
      setAlert(a);
    }, onGo);
  }

  // one round+phase segment (TABATA/EMOM); call again from onDone for the next segment
  function runPhase(r, ph, durationSec, onDone) {
    setRound(r);
    setPhase(ph);
    setScreen('running');
    setAlert(false);
    stop();
    stopRef.current = runPhaseTimer(durationSec, 'down', (n, a) => {
      setClockDisplay(n);
      setAlert(a);
    }, onDone);
  }

  // a single clock with no round/phase (FOR TIME counts up, AMRAP counts down)
  function runSingle(durationSec, direction, onDone) {
    setScreen('running');
    setAlert(false);
    stop();
    stopRef.current = runPhaseTimer(durationSec, direction, (n, a) => {
      setClockDisplay(n);
      setAlert(a);
    }, onDone);
  }

  function finish() {
    stop();
    releaseWakeLock();
    alertPulse(true);
    setScreen('completed');
  }

  function resetToSetup() {
    stop();
    releaseWakeLock();
    setScreen('setup');
  }

  function goHome() {
    stop();
    releaseWakeLock();
    navigate('/');
  }

  return {
    screen, countdownN, alert, round, phase, clockDisplay,
    start, runPhase, runSingle, finish, resetToSetup, goHome,
  };
}
