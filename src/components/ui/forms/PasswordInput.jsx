import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function PasswordInput({ value, onChange, fieldClass = "w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket", className = "", ...rest }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <input type={visible ? "text" : "password"} value={value} onChange={onChange} className={`${fieldClass} pr-11`} {...rest} />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink transition cursor-pointer"
        title={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
