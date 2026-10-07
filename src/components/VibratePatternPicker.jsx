import { VIBRATE_PATTERNS, playVibration } from "../lib/reminderUtils.js";

/**
 * VibratePatternPicker — chọn nhịp rung cho nhắc nhở.
 * Props: value (chuỗi pattern), onChange(value), enabled (bật/tắt rung)
 */
export default function VibratePatternPicker({ value = "", onChange, enabled = true }) {
  if (!enabled) return null;

  const testPattern = () => {
    playVibration(value, true);
  };

  return (
    <div className="pt-2 space-y-2">
      <label className="block text-sm font-medium text-ink">Nhịp rung</label>
      <div className="flex flex-wrap gap-1.5">
        {VIBRATE_PATTERNS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => onChange(p.value)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
              value === p.value
                ? "bg-gold text-white border-gold"
                : "bg-white text-gray-600 border-gray-200 hover:border-gold/50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="200,100,200,100,200"
          className="flex-1 px-3 py-1.5 border border-ink/10 rounded-xl text-xs font-mono focus:border-gold outline-none"
        />
        <button
          type="button"
          onClick={testPattern}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium text-gray-600 transition"
        >
          📳 Test
        </button>
      </div>
      <p className="text-[10px] text-gray-400">
        Nhập nhịp rung: <code>rung,nghỉ,rung,nghỉ...</code> (ms). Chọn "Vô hạn" để rung liên tục 30s.
      </p>
    </div>
  );
}
