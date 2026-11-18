import { useEffect, useMemo, useState } from 'react';
import { getEventStatus } from '../utils/dateUtils';

/**
 * Har soniyada yangilanadigan joriy vaqt.
 * Interval soniyaning boshiga moslanadi, shuning uchun raqamlar "sakrab"
 * ketmaydi. Bitta ticker butun ilova uchun yetarli — natija prop orqali
 * komponentlarga uzatiladi.
 */
export function useTicker(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let intervalId;

    const delay = intervalMs - (Date.now() % intervalMs);
    const timeoutId = setTimeout(() => {
      setNow(new Date());
      intervalId = setInterval(() => setNow(new Date()), intervalMs);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalMs]);

  // Tab fonga o'tib qaytganda vaqtni darhol tiklaymiz.
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) setNow(new Date());
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return now;
}

/**
 * Bitta tadbirning countdown holati: maqsad sanasi, status, qolgan vaqt.
 */
export function useCountdown(event, now) {
  return useMemo(() => getEventStatus(event, now), [event, now]);
}
