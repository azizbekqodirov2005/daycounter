import { useCallback, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Controls } from './components/Controls';
import { CountdownCard } from './components/CountdownCard';
import { EmptyState } from './components/EmptyState';
import { EventModal } from './components/EventModal';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer } from './components/Toast';
import { useTicker } from './hooks/useCountdown';
import { useEvents } from './hooks/useEvents';
import { useTheme } from './hooks/useTheme';
import { useToast } from './hooks/useToast';

export default function App() {
  const now = useTicker(1000);
  const { theme, toggleTheme } = useTheme();
  const { toasts, showToast, dismissToast } = useToast();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('soonest');

  const [editorState, setEditorState] = useState(null); // null | { event }
  const [pendingDelete, setPendingDelete] = useState(null);

  const { events, visibleEvents, nextEvent, stats, addEvent, updateEvent, deleteEvent } =
    useEvents({ now, search, category, sortBy });

  const openCreate = useCallback(() => setEditorState({ event: null }), []);
  const openEdit = useCallback((event) => setEditorState({ event }), []);
  const closeEditor = useCallback(() => setEditorState(null), []);

  const handleSubmit = useCallback(
    (data) => {
      if (editorState?.event) {
        updateEvent(editorState.event.id, data);
        showToast(`"${data.name}" yangilandi.`);
      } else {
        addEvent(data);
        showToast(`"${data.name}" qo‘shildi.`);
      }
      setEditorState(null);
    },
    [editorState, updateEvent, addEvent, showToast],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!pendingDelete) return;
    deleteEvent(pendingDelete.id);
    showToast(`"${pendingDelete.name}" o‘chirildi.`, 'error');
    setPendingDelete(null);
  }, [pendingDelete, deleteEvent, showToast]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setCategory('all');
  }, []);

  const hasEvents = events.length > 0;
  const isFiltered = hasEvents && visibleEvents.length === 0;

  return (
    <div className="app">
      <a className="skip-link" href="#dates">
        Asosiy kontentga o&lsquo;tish
      </a>

      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onAddEvent={openCreate}
        eventCount={events.length}
      />

      <main>
        <Hero event={nextEvent} now={now} stats={stats} onAddEvent={openCreate} />

        <section className="section" id="dates" aria-labelledby="dates-title">
          <div className="container">
            <div className="section__head">
              <h2 className="section__title" id="dates-title">
                Barcha sanalar
              </h2>
              <p className="section__subtitle">
                Sanalarni tahrirlang, o&lsquo;chiring yoki kategoriya
                bo&lsquo;yicha filtrlang.
              </p>
            </div>

            {hasEvents ? (
              <Controls
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={setCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
                resultCount={visibleEvents.length}
              />
            ) : null}

            {visibleEvents.length > 0 ? (
              <div className="grid">
                {visibleEvents.map((event) => (
                  <CountdownCard
                    key={event.id}
                    event={event}
                    now={now}
                    onEdit={openEdit}
                    onDelete={setPendingDelete}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                variant={isFiltered ? 'filtered' : 'empty'}
                onAddEvent={openCreate}
                onResetFilters={resetFilters}
              />
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <span>DayCounter</span>
          <span>
            Ma&lsquo;lumotlar faqat shu brauzerda, LocalStorage&lsquo;da saqlanadi.
          </span>
        </div>
      </footer>

      {editorState ? (
        <EventModal
          event={editorState.event}
          onClose={closeEditor}
          onSubmit={handleSubmit}
        />
      ) : null}

      {pendingDelete ? (
        <ConfirmModal
          title={'Sanani o‘chirish'}
          message={`"${pendingDelete.name}" sanasi butunlay o‘chiriladi. Bu amalni qaytarib bo‘lmaydi.`}
          onConfirm={handleConfirmDelete}
          onClose={() => setPendingDelete(null)}
        />
      ) : null}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
