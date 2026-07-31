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
