// Short WebAudio beeps for the alert window — no audio asset needed.
// iOS Safari only allows audio to start from inside a user-gesture call
// stack, so unlock() must run synchronously from a click handler (the
// START button) before any later beep() calls from timer callbacks.
let ctx;

function getContext() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

export function unlockAudio() {
  const c = getContext();
  if (c.state === 'suspended') c.resume();
}

export function beep(long = false) {
  const c = getContext();
  const osc = c.createOscillator();
  const gain = c.createGain();
  const duration = long ? 0.35 : 0.12;

  osc.type = 'sine';
  osc.frequency.value = long ? 660 : 880;
  gain.gain.setValueAtTime(0.0001, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.3, c.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);

  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration + 0.02);
}