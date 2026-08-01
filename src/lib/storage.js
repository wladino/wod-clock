const KEY = (mode) => `wodclock:${mode}`;

export function loadSettings(mode) {
  try {
    return JSON.parse(localStorage.getItem(KEY(mode))) || {};
  } catch {
    return {};
  }
}

export function saveSettings(mode, settings) {
  localStorage.setItem(KEY(mode), JSON.stringify(settings));
}

const SOUND_KEY = 'wodclock:sound-enabled';

export function loadSoundEnabled() {
  return localStorage.getItem(SOUND_KEY) === '1';
}

export function saveSoundEnabled(enabled) {
  localStorage.setItem(SOUND_KEY, enabled ? '1' : '0');
}
