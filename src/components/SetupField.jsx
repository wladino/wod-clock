import { useEffect, useState } from 'react';

// Keeps its own draft text while focused so the field can sit empty
// mid-edit (e.g. clearing "10" to type "50") instead of snapping to
// a value on every keystroke. On blur, a non-empty value is clamped
// to [min, max]; an empty value is left empty — the parent decides
// whether that's an error (typically only when START is pressed).
export default function SetupField({ pre, unit, value, min, max, invalid, onChange }) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  function commit(raw) {
    if (raw === '') {
      setText('');
      onChange('');
      return;
    }
    let n = parseInt(raw, 10);
    if (Number.isNaN(n)) n = min;
    n = Math.max(min, n);
    if (max !== undefined) n = Math.min(max, n);
    setText(String(n));
    onChange(n);
  }

  return (
    <div className="field-row">
      <span>{pre}</span>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        className={invalid ? 'invalid' : undefined}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
      />
      <span className="unit">{unit}</span>
    </div>
  );
}