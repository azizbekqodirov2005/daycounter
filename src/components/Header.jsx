import { CalendarClock, Moon, Plus, Sun } from 'lucide-react';

export function Header({ theme, onToggleTheme, onAddEvent, eventCount }) {
  const isDark = theme === 'dark';

  return (
    <header className="header">
      <div className="container header__inner">
        <a className="logo" href="#dates">
          <span className="logo__mark" aria-hidden="true">
            <CalendarClock size={18} />
          </span>
          <span className="logo__text">
            Day<span>Counter</span>
          </span>
        </a>

        <nav className="header__nav" aria-label="Asosiy navigatsiya">
          <a className="header__link" href="#dates">
            Barcha sanalar
            <span className="header__badge">{eventCount}</span>
          </a>
        </nav>

        <div className="header__actions">
          <button
            type="button"
            className="icon-button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Light rejimga o‘tish' : 'Dark rejimga o‘tish'}
            title={isDark ? 'Light rejim' : 'Dark rejim'}
          >
            {isDark ? (
              <Sun size={18} aria-hidden="true" />
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className="button button--primary"
            onClick={onAddEvent}
            aria-label={'Yangi sana qo‘shish'}
          >
            <Plus size={18} aria-hidden="true" />
            <span className="header__cta-full" aria-hidden="true">
              Yangi sana qo&lsquo;shish
            </span>
            <span className="header__cta-short" aria-hidden="true">
              Qo&lsquo;shish
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
