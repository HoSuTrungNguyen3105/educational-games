import { StampToken } from '../../components/ui.jsx'

export default function Field({ label, children, hint }) {
  return (
    <label className="block mb-5">
      <span className="block text-sm font-semibold text-ink mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-[#B7A987] mt-1">{hint}</span>}
    </label>
  );
}

export { StampToken };