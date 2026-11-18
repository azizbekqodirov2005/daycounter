import { useCallback, useEffect, useRef, useState } from 'react';

const isBrowser = typeof window !== 'undefined';

const readValue = (key, fallback) => {
  if (!isBrowser) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    // Buzilgan yoki eski formatdagi ma'lumot — standart qiymatga qaytamiz.
    return fallback;
  }
};

/**
 * LocalStorage bilan sinxronlanadigan state.
 * `useState` bilan bir xil API: [value, setValue].
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue));
  const keyRef = useRef(key);

  useEffect(() => {
    keyRef.current = key;
  }, [key]);

  useEffect(() => {
    if (!isBrowser) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Xotira to'lgan yoki yozishga ruxsat yo'q — ilova ishlashda davom etadi.
    }
  }, [key, value]);

  // Boshqa tab'da o'zgarsa, joriy tab ham yangilanadi.
  useEffect(() => {
    if (!isBrowser) return undefined;

    const handleStorage = (event) => {
      if (event.key !== keyRef.current) return;
      setValue(readValue(keyRef.current, initialValue));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
    // initialValue faqat birinchi o'qishda kerak, shuning uchun qayta ulanmaydi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useCallback((next) => {
    setValue((previous) =>
      typeof next === 'function' ? next(previous) : next,
    );
  }, []);

  return [value, update];
}
