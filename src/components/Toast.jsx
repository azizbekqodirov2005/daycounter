import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
};

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.variant] ?? CheckCircle2;

        return (
          <div className={`toast toast--${toast.variant}`} key={toast.id}>
            <Icon size={18} aria-hidden="true" className="toast__icon" />
            <p className="toast__message">{toast.message}</p>
            <button
              type="button"
              className="toast__close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Xabarni yopish"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
