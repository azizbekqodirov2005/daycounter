import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export function ConfirmModal({
  title = 'Tasdiqlang',
  message,
  confirmLabel = "O‘chirish",
  cancelLabel = 'Bekor qilish',
  onConfirm,
  onClose,
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="confirm">
        <span className="confirm__icon" aria-hidden="true">
          <AlertTriangle size={20} />
        </span>
        <p className="confirm__message">{message}</p>
      </div>

      <div className="modal__footer">
        <button type="button" className="button button--ghost" onClick={onClose}>
          {cancelLabel}
        </button>
        <button type="button" className="button button--danger" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
