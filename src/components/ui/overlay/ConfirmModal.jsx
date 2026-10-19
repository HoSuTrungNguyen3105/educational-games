import { Modal } from "./Modal.jsx";
import { GhostButton } from "../buttons/GhostButton.jsx";

export function ConfirmModal({ open, title, message, onConfirm, onClose, confirmLabel = "Xóa", danger = true }) {
  if (!open) return null;
  return (
    <Modal onClose={onClose}>
      <h3 className="font-display text-lg text-ink mb-1">{title}</h3>
      <p className="text-sm text-[#8A7C63] mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <GhostButton onClick={onClose}>Hủy</GhostButton>
        <button onClick={onConfirm}
          className={`font-display font-semibold rounded-2xl px-5 py-3 active:scale-[0.98] transition shadow-[0_3px_0_rgba(0,0,0,0.18)] ${danger ? "bg-ticket text-white hover:bg-ticket/90" : "bg-ink text-paper hover:bg-ink2"
            }`}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
