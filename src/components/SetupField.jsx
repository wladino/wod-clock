export default function SetupField({ pre, unit, value, min, max, onChange }) {
  return (
    <div className="field-row">
      <span>{pre}</span>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="unit">{unit}</span>
    </div>
  );
}
