import Modal from "../overlay/Modal.jsx";
import Field from "./Field.jsx";
import FormField from "./FormField.jsx";
import GhostButton from "../buttons/GhostButton.jsx";
import PrimaryButton from "../buttons/PrimaryButton.jsx";

export function FormModal({ open, title, fields, values, onChange, onSubmit, onClose, error, saving, editId, savingLabel, wide, extraButtons }) {
  if (!open) return null;
  return (
    <Modal onClose={onClose} wide={wide}>
      <h3 className="font-display text-lg text-ink mb-3">{editId ? "✏️ Sửa " + title : "➕ Thêm " + title}</h3>
      <form onSubmit={e => { e.preventDefault(); onSubmit(); }}>
        <div className={`grid gap-x-4 gap-y-2 ${wide ? "sm:grid-cols-2" : ""}`}>
          {fields.map(f => (
            <Field key={f.name} label={f.label} className={f.full ? "sm:col-span-2" : ""}>
              <FormField field={f} value={values[f.name]} onChange={onChange} />
            </Field>
          ))}
        </div>
        {error && <p className="text-ticket text-sm mt-2">{error}</p>}
        <div className="mt-3 flex items-center gap-2 justify-end">
          {extraButtons}
          <GhostButton onClick={onClose} type="button">Hủy</GhostButton>
          <PrimaryButton type="submit" disabled={saving}>{saving ? (savingLabel || "Đang lưu...") : editId ? "Cập nhật" : "Thêm mới"}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
