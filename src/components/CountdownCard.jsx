import { Clock, Pencil, Repeat, Trash2 } from 'lucide-react';
import { CountdownDisplay } from './CountdownDisplay';
import { useCountdown } from '../hooks/useCountdown';
import { getCategory, getColorValue } from '../utils/constants';
import { STATUS, formatDateUz, formatTimeUz } from '../utils/dateUtils';

const STATUS_MODIFIER = {
  [STATUS.upcoming]: 'upcoming',
  [STATUS.today]: 'today',
  [STATUS.past]: 'past',
};

export function CountdownCard({ event, now, onEdit, onDelete }) {
  const state = useCountdown(event, now);
  const category = getCategory(event.category);
  const CategoryIcon = category.icon;
  const accent = getColorValue(event.color);

  return (
    <article
      className={`card card--${STATUS_MODIFIER[state.status]}`}
      style={{ '--accent': accent }}
    >
      <div className="card__head">
        <span className="chip chip--accent">
          <CategoryIcon size={14} aria-hidden="true" />
          {category.label}
        </span>

        <div className="card__actions">
          {event.recurring ? (
            <span className="chip chip--ghost" title="Har yili takrorlanadi">
              <Repeat size={14} aria-hidden="true" />
              <span className="sr-only">Har yili takrorlanadi</span>
            </span>
          ) : null}
          <button
            type="button"
            className="icon-button icon-button--sm"
            onClick={() => onEdit(event)}
            aria-label={`${event.name} sanasini tahrirlash`}
          >
            <Pencil size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button icon-button--sm icon-button--danger"
            onClick={() => onDelete(event)}
            aria-label={`${event.name} sanasini o‘chirish`}
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <h3 className="card__name">{event.name}</h3>

      <p className={`card__status card__status--${STATUS_MODIFIER[state.status]}`}>
        {state.status === STATUS.upcoming
          ? `${state.dayDiff.toLocaleString('uz-UZ')} kun qoldi`
          : state.label}
      </p>

      {state.status === STATUS.upcoming ? (
        <CountdownDisplay
          breakdown={state.breakdown}
          size="compact"
          units={['hours', 'minutes']}
        />
      ) : null}

      {state.status === STATUS.past ? (
        <p className="card__muted">
          {Math.abs(state.dayDiff).toLocaleString('uz-UZ')} kun oldin
        </p>
      ) : null}

      {event.note ? <p className="card__note">{event.note}</p> : null}

      <footer className="card__footer">
        <Clock size={14} aria-hidden="true" />
        <span>
          {formatDateUz(state.target, { withWeekday: false })}
          {event.time ? ` · ${formatTimeUz(state.target)}` : ''}
        </span>
      </footer>
    </article>
  );
}
