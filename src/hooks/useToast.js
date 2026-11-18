import { useCallback, useEffect, useRef, useState } from 'react';

const TOAST_DURATION = 3200;

/**
 * Oddiy toast navbati: xabar qo'shiladi va belgilangan vaqtdan keyin
 * avtomatik yopiladi.
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismissToast = useCallback((id) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));

    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message, variant = 'success') => {
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `toast-${Date.now()}-${Math.random()}`;

      setToasts((previous) => [...previous, { id, message, variant }]);

      const timer = setTimeout(() => dismissToast(id), TOAST_DURATION);
      timersRef.current.set(id, timer);
    },
    [dismissToast],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return { toasts, showToast, dismissToast };
}
