import { CalendarPlus, Search } from 'lucide-react';

/**
 * Ikki holat uchun bo'sh ekran:
 * - umuman sana yo'q;
 * - filter/qidiruv natija bermadi.
 */
export function EmptyState({ variant = 'empty', onAddEvent, onResetFilters }) {
  const isFiltered = variant === 'filtered';

  return (
    <div className="empty">
      <span className="empty__icon" aria-hidden="true">
        {isFiltered ? <Search size={24} /> : <CalendarPlus size={24} />}
      </span>

      <h3 className="empty__title">
        {isFiltered ? 'Hech narsa topilmadi' : "Hali sana qo‘shilmagan"}
      </h3>

      <p className="empty__text">
        {isFiltered
          ? "Qidiruv so‘zi yoki filtrni o‘zgartirib ko‘ring."
          : "Birinchi muhim sanangizni qo‘shing — countdown shu zahoti ishga tushadi."}
      </p>

      {isFiltered ? (
        <button type="button" className="button button--ghost" onClick={onResetFilters}>
          Filtrlarni tozalash
        </button>
      ) : (
        <button type="button" className="button button--primary" onClick={onAddEvent}>
          <CalendarPlus size={18} aria-hidden="true" />
          <span>Yangi sana qo&lsquo;shish</span>
        </button>
      )}
    </div>
  );
}
