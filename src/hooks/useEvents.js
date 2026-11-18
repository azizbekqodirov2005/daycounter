import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_CATEGORY, DEFAULT_COLOR, STORAGE_KEYS } from '../utils/constants';
import { STATUS, getEventStatus } from '../utils/dateUtils';

const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `event-${Date.now()}-${Math.random().toString(16).slice(2)}`;

/** LocalStorage'dan kelgan ma'lumotni xavfsiz ko'rinishga keltiradi. */
const normalizeEvent = (event) => ({
  id: typeof event?.id === 'string' ? event.id : createId(),
  name: typeof event?.name === 'string' ? event.name : '',
  category: typeof event?.category === 'string' ? event.category : DEFAULT_CATEGORY,
  date: typeof event?.date === 'string' ? event.date : '',
  time: typeof event?.time === 'string' ? event.time : '',
  note: typeof event?.note === 'string' ? event.note : '',
  color: typeof event?.color === 'string' ? event.color : DEFAULT_COLOR,
  recurring: Boolean(event?.recurring),
  createdAt: typeof event?.createdAt === 'number' ? event.createdAt : Date.now(),
});

/** Status bo'yicha tartib: bugun → kelayotgan → o'tgan. */
const STATUS_ORDER = {
  [STATUS.today]: 0,
  [STATUS.upcoming]: 1,
  [STATUS.past]: 2,
};

const sortEvents = (items, sortBy, now) => {
  const withStatus = items.map((event) => ({
    event,
    state: getEventStatus(event, now),
  }));

  const byProximity = (a, b, direction) => {
    const groupDiff = STATUS_ORDER[a.state.status] - STATUS_ORDER[b.state.status];
    if (groupDiff !== 0) return groupDiff;

    if (a.state.status === STATUS.past) {
      // O'tgan sanalar: eng yaqinda o'tgani birinchi.
      return b.state.dayDiff - a.state.dayDiff;
    }

    return direction * (a.state.dayDiff - b.state.dayDiff);
  };

  const sorted = [...withStatus];

  switch (sortBy) {
    case 'farthest':
      sorted.sort((a, b) => byProximity(a, b, -1));
      break;
    case 'name':
      sorted.sort((a, b) =>
        a.event.name.localeCompare(b.event.name, 'uz', { sensitivity: 'base' }),
      );
      break;
    case 'created':
      sorted.sort((a, b) => b.event.createdAt - a.event.createdAt);
      break;
    case 'soonest':
    default:
      sorted.sort((a, b) => byProximity(a, b, 1));
      break;
  }

  return sorted.map((item) => item.event);
};

/**
 * Tadbirlar bilan ishlovchi biznes-logika: CRUD, filter, qidiruv, saralash.
 * UI komponentlari faqat natijani ko'rsatadi.
 */
export function useEvents({ now, search, category, sortBy }) {
  const [rawEvents, setRawEvents] = useLocalStorage(STORAGE_KEYS.events, []);

  const events = useMemo(() => {
    if (!Array.isArray(rawEvents)) return [];
    return rawEvents.map(normalizeEvent).filter((event) => event.date);
  }, [rawEvents]);

  const addEvent = useCallback(
    (data) => {
      const event = normalizeEvent({ ...data, id: createId(), createdAt: Date.now() });
      setRawEvents((previous) => [...(Array.isArray(previous) ? previous : []), event]);
      return event;
    },
    [setRawEvents],
  );

  const updateEvent = useCallback(
    (id, data) => {
      setRawEvents((previous) =>
        (Array.isArray(previous) ? previous : []).map((event) =>
          event.id === id ? normalizeEvent({ ...event, ...data, id }) : event,
        ),
      );
    },
    [setRawEvents],
  );

  const deleteEvent = useCallback(
    (id) => {
      setRawEvents((previous) =>
        (Array.isArray(previous) ? previous : []).filter((event) => event.id !== id),
      );
    },
    [setRawEvents],
  );

  const sortedEvents = useMemo(
    () => sortEvents(events, sortBy, now),
    // `now` har soniyada yangilanadi, lekin saralash kunlar farqiga tayanadi —
    // qiymat o'zgarmasa React qayta render qilmaydi.
    [events, sortBy, now],
  );

  const visibleEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sortedEvents.filter((event) => {
      const matchesCategory = category === 'all' || event.category === category;
      if (!matchesCategory) return false;
      if (!query) return true;

      return (
        event.name.toLowerCase().includes(query) ||
        event.note.toLowerCase().includes(query)
      );
    });
  }, [sortedEvents, search, category]);

  // Eng yaqin sana har doim yaqinlik bo'yicha aniqlanadi — foydalanuvchi
  // tanlagan saralash tartibiga bog'liq emas.
  const nextEvent = useMemo(() => {
    let best = null;
    let bestDiff = Infinity;

    events.forEach((event) => {
      const { status, target } = getEventStatus(event, now);
      if (status === STATUS.past || !target) return;

      // Bir kundagi tadbirlar vaqti bo'yicha solishtiriladi.
      if (target.getTime() < bestDiff) {
        best = event;
        bestDiff = target.getTime();
      }
    });

    return best;
  }, [events, now]);

  const stats = useMemo(() => {
    let upcoming = 0;
    let today = 0;
    let past = 0;

    events.forEach((event) => {
      const { status } = getEventStatus(event, now);
      if (status === STATUS.today) today += 1;
      else if (status === STATUS.upcoming) upcoming += 1;
      else past += 1;
    });

    return { total: events.length, upcoming, today, past };
  }, [events, now]);

  return {
    events,
    visibleEvents,
    nextEvent,
    stats,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
