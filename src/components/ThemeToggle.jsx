export default function ThemeToggle({ theme, onToggle }) {
  return (
    <label className="toggle-row theme-toggle">
      <span aria-hidden="true">☀️</span>
      <span className="toggle-track">
        <input
          type="checkbox"
          className="toggle-input"
          checked={theme === 'light'}
          onChange={(e) => onToggle(e.target.checked ? 'light' : 'dark')}
          aria-label="Toggle light and dark theme"
        />
        <span className="toggle-thumb" />
      </span>
      <span aria-hidden="true">🌙</span>
    </label>
  );
}
