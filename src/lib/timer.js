import { loadSoundEnabled } from './storage';
import { beep } from './sound';

// One small rAF-driven timer, reused by the pre-start countdown and every
// mode's work/rest/count-up/count-down clock. Driven off elapsed wall-clock
// time (not tick counting) so it can't drift over a long AMRAP/FOR TIME.
export function runPhaseTimer(durationSec, direction, onTick, onDone) {
  const startTs = performance.now();
  let lastShown = null;
  let raf;

  function frame(now) {
    const elapsed = (now - startTs) / 1000;
    if (elapsed >= durationSec) {
      onDone();
      return;
    }
    const remaining = durationSec - elapsed;
    const display = direction === 'down' ? Math.ceil(remaining) : Math.floor(elapsed);
    if (display !== lastShown) {
      lastShown = display;
      const secsToBoundary = Math.ceil(remaining);
      const isAlert = secsToBoundary > 0 && secsToBoundary <= 3;
      onTick(display, isAlert);
      if (isAlert) alertPulse(false);
    }
    raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

// Vibration + light/dark flicker — the phone-friendly alert that never
// touches audio, so it can't interrupt Spotify/music playing in the background.
export function alertPulse(isCompletion) {
  if (navigator.vibrate) navigator.vibrate(isCompletion ? [200, 80, 200, 80, 200] : 150);
  if (loadSoundEnabled()) beep(isCompletion);
  document.body.classList.add('flip');
  setTimeout(() => document.body.classList.remove('flip'), isCompletion ? 200 : 120);
}

export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
}
