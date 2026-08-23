import { useState } from 'react'

export function StampToken({ icon, ring = "#F4B942", size = 56, fontSize = 24, className = "" }) {
  return (
    <div className={`stamp-token ${className}`} style={{ "--ring": ring, width: size, height: size, fontSize: fontSize }}>
      <span>{icon}</span>
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    published: { label: "Đã xuất bản", cls: "bg-teal/15 text-teal border-teal/30" },
    draft: { label: "Bản nháp", cls: "bg-gold/15 text-[#8a6a10] border-gold/40" },
  };
  const s = map[status] || map.draft;
  return <span className={`badge-status text-[11px] uppercase px-2.5 py-1 rounded-full border ${s.cls}`}>{s.label}</span>;
}

export function PrimaryButton({ children, onClick, className = "", disabled, type = "button" }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`font-display font-semibold rounded-2xl px-5 py-3 bg-ink text-paper hover:bg-ink2 active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_3px_0_rgba(0,0,0,0.18)] ${className}`}>
      {children}
    </button>
  );
}
export function GhostButton({ children, onClick, className = "", disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`font-display font-semibold rounded-2xl px-5 py-3 border-2 border-ink/20 text-ink hover:bg-ink/5 active:scale-[0.98] transition disabled:opacity-40 ${className}`}>
      {children}
    </button>
  );
}
export function IconButton({ children, onClick, title, className = "" }) {
  return (
    <button onClick={onClick} title={title}
      className={`w-9 h-9 rounded-full flex items-center justify-center border border-ink/15 text-ink hover:bg-ink/5 transition ${className}`}>
      {children}
    </button>
  );
}

export function Loader({ label = "Đang tải..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-ink/70">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-ink/10"></div>
        <div className="absolute inset-0 rounded-full border-4 border-ticket border-t-transparent animate-spin"></div>
      </div>
      <p className="font-body text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ icon = "🎟️", title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-3">
      <div className="text-5xl float-slow">{icon}</div>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      {subtitle && <p className="text-sm text-[#8A7C63] max-w-sm">{subtitle}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Đã có lỗi xảy ra", subtitle, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-3">
      <div className="text-5xl">🎪</div>
      <h3 className="font-display text-lg text-ticket">{title}</h3>
      {subtitle && <p className="text-sm text-[#8A7C63] max-w-sm">{subtitle}</p>}
      {onRetry && <PrimaryButton onClick={onRetry}>Thử lại</PrimaryButton>}
    </div>
  );
}

export function Toast({ toast }) {
  if (!toast) return null;
  const cls = toast.type === "error" ? "bg-ticket text-white" : toast.type === "success" ? "bg-teal text-white" : "bg-ink text-paper";
  return <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-lg font-body text-sm anim-pop ${cls}`}>{toast.message}</div>;
}

export function TicketStub({ icon, code, notchBg = "#FFF6E7" }) {
  return (
    <div className="ticket-stub" style={{ "--notch-bg": notchBg }}>
      <div className="ticket-stub-tab">{icon}</div>
      <div className="ticket-stub-body flex items-center justify-center">
        <span className="font-mono text-2xl sm:text-3xl tracking-[0.3em] text-ink font-bold">{code}</span>
      </div>
    </div>
  );
}

export function Modal({ children, onClose, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4 bg-ink/40 backdrop-blur-sm" onClick={onClose}>
      <div className={`note-card w-full p-4 sm:p-6 anim-pop max-h-[90vh] overflow-y-auto ${wide ? "max-w-[95vw]" : "max-w-md"}`} onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

export function PasswordInput({ value, onChange, fieldClass = "w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket", className = "", ...rest }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <input type={visible ? "text" : "password"} value={value} onChange={onChange} className={`${fieldClass} pr-11`} {...rest} />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-lg leading-none opacity-60 hover:opacity-100 transition cursor-pointer"
        title={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      >
        {visible ? "🙈" : "👁️"}
      </button>
    </div>
  );
}

export function Field({ label, hint, children, className = "" }) {
  return (
    <div className={className}>
      <label className="text-[11px] font-mono uppercase text-[#8A7C63] leading-tight">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-[#B7A987] mt-0.5">{hint}</p>}
    </div>
  );
}

export function ManagementHeader({ subtitle, title }) {
  return (
    <div>
      <p className="text-[#8A7C63] text-sm font-mono">{subtitle}</p>
      <h1 className="font-display text-3xl text-ink">{title}</h1>
    </div>
  );
}

export function ConfirmModal({ open, title, message, onConfirm, onClose, confirmLabel = "Xóa", danger = true }) {
  if (!open) return null;
  return (
    <Modal onClose={onClose}>
      <h3 className="font-display text-lg text-ink mb-1">{title}</h3>
      <p className="text-sm text-[#8A7C63] mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <GhostButton onClick={onClose}>Hủy</GhostButton>
        <button onClick={onConfirm}
          className={`font-display font-semibold rounded-2xl px-5 py-3 active:scale-[0.98] transition shadow-[0_3px_0_rgba(0,0,0,0.18)] ${
            danger ? "bg-ticket text-white hover:bg-ticket/90" : "bg-ink text-paper hover:bg-ink2"
          }`}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

function FormField({ field, value, onChange }) {
  const base = "w-full note-card px-3 py-2 mt-0.5 border-ink/10 focus:border-ticket text-sm";
  const disabled = field.disabled;
  if (field.type === "select") {
    return (
      <select value={value || ""} onChange={e => onChange(field.name, e.target.value)}
        disabled={disabled}
        className={`${base} bg-paper2 ${disabled ? "opacity-50" : ""}`}>
        {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  }
  if (field.type === "color") {
    return (
      <div className="flex items-center gap-2 mt-0.5">
        <input type="color" value={value || "#000000"} onChange={e => onChange(field.name, e.target.value)}
          disabled={disabled} className="w-8 h-8 rounded-lg border border-ink/10 cursor-pointer" />
        <input value={value || ""} onChange={e => onChange(field.name, e.target.value)}
          disabled={disabled} className={`${base} ${disabled ? "opacity-50" : ""}`} autoComplete="off" />
      </div>
    );
  }
  if (field.type === "textarea") {
    return (
      <textarea value={value || ""} onChange={e => onChange(field.name, e.target.value)}
        disabled={disabled} placeholder={field.placeholder || ""}
        className={`${base} min-h-[90px] ${disabled ? "opacity-50" : ""}`} />
    );
  }
  if (field.type === "password") {
    return <PasswordInput value={value || ""} onChange={e => onChange(field.name, e.target.value)} fieldClass={base} />;
  }
  return (
    <input type={field.type || "text"} value={value || ""} onChange={e => onChange(field.name, e.target.value)}
      disabled={disabled} placeholder={field.placeholder || ""} autoComplete="off"
      className={`${base} ${disabled ? "opacity-50" : ""}`} />
  );
}

export function FormModal({ open, title, fields, values, onChange, onSubmit, onClose, error, saving, editId, savingLabel, wide }) {
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
          <GhostButton onClick={onClose} type="button">Hủy</GhostButton>
          <PrimaryButton type="submit" disabled={saving}>{saving ? (savingLabel || "Đang lưu...") : editId ? "Cập nhật" : "Thêm mới"}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

export function ManagementTable({ title, count, data, error, onRetry, emptyLabel, headers, renderRow, onRemoveAll, removeAllLabel, onCreate, createLabel }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg text-ink">{title}{count !== undefined ? ` (${count})` : ""}</h2>
        <div className="flex items-center gap-3">
          {onRemoveAll && <button onClick={onRemoveAll} className="text-xs text-ticket/70 hover:text-ticket">{removeAllLabel || "Xóa tất cả"}</button>}
          {onCreate && <PrimaryButton onClick={onCreate} className="text-xs px-3 py-1.5">{createLabel || "+ Thêm mới"}</PrimaryButton>}
        </div>
      </div>
      {error && !data && <ErrorState subtitle={error} onRetry={onRetry} />}
      {!error && !data && <Loader label="Đang tải..." />}
      {!error && data && (
        <div className="note-card overflow-x-auto">
          {data.length === 0 ? (
            <p className="p-6 text-sm text-[#8A7C63] text-center">{emptyLabel || "Chưa có dữ liệu."}</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-[#8A7C63] font-mono text-xs uppercase border-b border-ink/10">
                  {headers.map((h, i) => <th key={i} className="px-5 py-3">{h}</th>)}
                </tr>
              </thead>
              <tbody>{data.map(renderRow)}</tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}