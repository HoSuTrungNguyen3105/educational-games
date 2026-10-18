import { useState } from 'react';

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
