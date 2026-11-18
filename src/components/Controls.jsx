import { Search, X } from 'lucide-react';
import { CATEGORIES, SORT_OPTIONS } from '../utils/constants';

/**
 * Qidiruv, kategoriya filtri va saralash boshqaruvlari.
 */
export function Controls({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  resultCount,
}) {
  return (
    <div className="controls">
      <div className="controls__search">
        <Search size={16} aria-hidden="true" className="controls__search-icon" />
        <input
          type="search"
          className="input input--search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={'Nom yoki izoh bo‘yicha qidirish'}
          aria-label="Sanalar ichidan qidirish"
        />
        {search ? (
          <button
            type="button"
            className="controls__clear"
            onClick={() => onSearchChange('')}
            aria-label="Qidiruvni tozalash"
          >
            <X size={14} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="controls__filters" role="group" aria-label="Kategoriya filtri">
        <button
          type="button"
          className={`pill${category === 'all' ? ' is-active' : ''}`}
          onClick={() => onCategoryChange('all')}
          aria-pressed={category === 'all'}
        >
          Barchasi
        </button>
        {CATEGORIES.map((item) => {
          const Icon = item.icon;
          const active = category === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`pill${active ? ' is-active' : ''}`}
              onClick={() => onCategoryChange(item.id)}
              aria-pressed={active}
            >
              <Icon size={14} aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="controls__sort">
        <label className="sr-only" htmlFor="sort-select">
          Saralash
        </label>
        <select
          id="sort-select"
          className="input input--select"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="controls__count">{resultCount} ta sana</span>
      </div>
    </div>
  );
}
