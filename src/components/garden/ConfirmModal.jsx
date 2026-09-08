import { Modal } from '../ui.jsx';

export function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <Modal onClose={onCancel} contentClassName="max-w-sm text-center">
      <h3 className="font-display text-lg text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink/60 mb-5">{message}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border-2 border-ink/15 text-ink/60 font-semibold text-sm hover:bg-ink/5 transition"
        >
          Hủy
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm hover:from-red-600 hover:to-red-700 transition shadow-md"
        >
          Xác nhận
        </button>
      </div>
    </Modal>
  );
}
