import { CalendarPlus, Repeat } from 'lucide-react';
import { CountdownDisplay } from './CountdownDisplay';
import { useCountdown } from '../hooks/useCountdown';
import { getCategory, getColorValue } from '../utils/constants';
import { STATUS, formatDateUz, formatTimeUz } from '../utils/dateUtils';

function HeroStats({ stats }) {
  return (
    <dl className="hero__stats">
      <div className="hero__stat">
        <dt>Jami</dt>
        <dd>{stats.total}</dd>
      </div>
      <div className="hero__stat">
        <dt>Kelayotgan</dt>
        <dd>{stats.upcoming}</dd>
      </div>
      <div className="hero__stat">
        <dt>Bugun</dt>
        <dd>{stats.today}</dd>
      </div>
      <div className="hero__stat">
        <dt>O&lsquo;tgan</dt>
        <dd>{stats.past}</dd>
      </div>
    </dl>
  );
}

export function Hero({ event, now, stats, onAddEvent }) {
  const state = useCountdown(event ?? { date: '' }, now);

  if (!event) {
    const hasOnlyPast = stats.total > 0;

    return (
      <section className="hero">
        <div className="container hero__inner hero__inner--single">
          <div className="hero__intro">
            <h1 className="hero__title">
              Muhim kunlargacha qancha vaqt qoldi?
            </h1>
            <p className="hero__subtitle">
              {hasOnlyPast
                ? "Hozircha kelayotgan sana yo‘q — barcha sanalaringiz o‘tib ketgan. Yangi sana qo‘shing va countdown qaytadan boshlanadi."
                : "Tug‘ilgan kun, imtihon, to‘y yoki sayohat — barcha muhim sanalaringizni bir joyda kuzating va qolgan vaqtni soniyagacha aniqlikda ko‘ring."}
            </p>
            {hasOnlyPast ? <HeroStats stats={stats} /> : null}
            <button
              type="button"
              className="button button--primary button--lg"
              onClick={onAddEvent}
            >
              <CalendarPlus size={18} aria-hidden="true" />
              <span>
                {hasOnlyPast
                  ? "Yangi sana qo‘shish"
                  : "Birinchi sanani qo‘shish"}
              </span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  const category = getCategory(event.category);
  const CategoryIcon = category.icon;
  const accent = getColorValue(event.color);

  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__intro">
          <h1 className="hero__title">Muhim kunlargacha qancha vaqt qoldi?</h1>
          <p className="hero__subtitle">
            Quyida eng yaqin kelayotgan sana ko&lsquo;rsatilgan. Countdown
            har soniyada avtomatik yangilanadi.
          </p>
          <HeroStats stats={stats} />
        </div>

        <article
          className="hero__card"
          style={{ '--accent': accent }}
          aria-label={`Eng yaqin sana: ${event.name}`}
        >
          <div className="hero__card-top">
            <span className="chip chip--accent">
              <CategoryIcon size={14} aria-hidden="true" />
              {category.label}
            </span>
            {event.recurring ? (
              <span className="chip">
                <Repeat size={14} aria-hidden="true" />
                Har yili
              </span>
            ) : null}
          </div>

          <h2 className="hero__event-name">{event.name}</h2>
          <p className="hero__event-date">
            {formatDateUz(state.target)}
            {event.time ? ` · ${formatTimeUz(state.target)}` : ''}
          </p>

          {state.status === STATUS.today ? (
            <p className="hero__today">{'Bugun! \u{1F389}'}</p>
          ) : (
            <CountdownDisplay breakdown={state.breakdown} size="large" />
          )}

          {event.note ? <p className="hero__note">{event.note}</p> : null}
        </article>
      </div>
    </section>
  );
}
