import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

const getSystemTheme = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

/**
 * Light / dark rejim. Birinchi tashrifda tizim sozlamasi olinadi,
 * keyin foydalanuvchi tanlovi LocalStorage'da saqlanadi.
 */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.theme, null);
  const activeTheme = theme ?? getSystemTheme();

  useEffect(() => {
    document.documentElement.dataset.theme = activeTheme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', activeTheme === 'dark' ? '#0b0b0f' : '#ffffff');
    }
  }, [activeTheme]);

  const toggleTheme = useCallback(() => {
    setTheme((previous) =>
      (previous ?? getSystemTheme()) === 'dark' ? 'light' : 'dark',
    );
  }, [setTheme]);

  return { theme: activeTheme, toggleTheme };
}
