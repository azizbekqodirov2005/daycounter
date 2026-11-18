const UNITS = [
  { key: 'days', label: 'Kun' },
  { key: 'hours', label: 'Soat' },
  { key: 'minutes', label: 'Daqiqa' },
  { key: 'seconds', label: 'Soniya' },
];

const pad = (value) => String(value).padStart(2, '0');

/**
 * Kun / soat / daqiqa / soniya bloklari.
 * `size="large"` — hero uchun, `size="compact"` — kartalar uchun.
 */
export function CountdownDisplay({ breakdown, size = 'large', units }) {
  const visibleUnits = units
    ? UNITS.filter((unit) => units.includes(unit.key))
    : UNITS;

  const srText = visibleUnits
    .map((unit) => `${breakdown[unit.key]} ${unit.label.toLowerCase()}`)
    .join(', ');

  return (
    <div
      className={`countdown countdown--${size}`}
      role="timer"
      aria-live="off"
    >
      <span className="sr-only">{srText}</span>
      {visibleUnits.map((unit, index) => (
        <div className="countdown__unit" key={unit.key}>
          <div className="countdown__value" aria-hidden="true">
            {unit.key === 'days'
              ? breakdown.days.toLocaleString('uz-UZ')
              : pad(breakdown[unit.key])}
          </div>
          <div className="countdown__label" aria-hidden="true">
            {unit.label}
          </div>
          {index < visibleUnits.length - 1 ? (
            <span className="countdown__separator" aria-hidden="true">
              :
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
