import { useState, useMemo, useRef, useEffect } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import { VI_MONTHS, VI_WEEKDAYS, formatDate, formatTime } from "../lib/reminderUtils.js";

const pad = (n) => String(n).padStart(2, "0");

/**
 * Parse giá trị datetime-local "2026-10-07T09:00" thành {y,m,d,hh,mm} (giờ địa phương).
 */
function parseValue(value) {
  const now = new Date();
  if (!value) {
    return { y: now.getFullYear(), m: now.getMonth(), d: now.getDate(), hh: now.getHours(), mm: now.getMinutes() };
  }
  const [datePart, timePart = "00:00"] = value.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  return { y, m: m - 1, d, hh: hh || 0, mm: mm || 0 };
}

function toValue({ y, m, d, hh, mm }) {
  return `${y}-${pad(m + 1)}-${pad(d)}T${pad(hh)}:${pad(mm)}`;
}

/**
 * DateTimePicker — bộ chọn ngày giờ đẹp kiểu app nhắc nhở chuẩn.
 * Hiện calendar tháng + chọn giờ/phút + phím tắt nhanh.
 *
 * Props: value (chuỗi "YYYY-MM-DDTHH:mm" giờ địa phương), onChange(value), placeholder
 */
export default function DateTimePicker({ value, onChange, placeholder = "Chọn ngày giờ" }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const p = parseValue(value);
    return { y: p.y, m: p.m };
  });
  const [sel, setSel] = useState(() => parseValue(value));
  const panelRef = useRef(null);

  // Đồng bộ khi value từ ngoài thay đổi (vd khi mở form sửa)
  useEffect(() => {
    if (value) {
      const p = parseValue(value);
      setSel(p);
      setView({ y: p.y, m: p.m });
    }
  }, [value, open]);

  // Đóng khi bấm ra ngoài
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open ]);

  const days = useMemo(() => {
    const { y, m } = view;
    const first = new Date(y, m, 1);
    // Thứ 2 = 0 ... Chủ nhật = 6
    const lead = (first.getDay() + 6) % 7;
    const count = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push(null);
    for (let d = 1; d <= count; d++) cells.push(d);
    return cells;
  }, [view]);

  const today = new Date();
  const isToday = (d) => d && view.y === today.getFullYear() && view.m === today.getMonth() && d === today.getDate();
  const isSelected = (d) => d && sel.y === view.y && sel.m === view.m && sel.d === d;

  const pickDay = (d) => {
    if (!d) return;
    setSel((s) => ({ ...s, y: view.y, m: view.m, d }));
  };

  const shiftMonth = (dir) => {
    setView((v) => {
      const nd = new Date(v.y, v.m + dir, 1);
      return { y: nd.getFullYear(), m: nd.getMonth() };
    });
  };

  const applyQuick = (fn) => {
    const n = new Date();
    const t = fn(n);
    const p = { y: t.getFullYear(), m: t.getMonth(), d: t.getDate(), hh: t.getHours(), mm: t.getMinutes() };
    setSel(p);
    setView({ y: p.y, m: p.m });
  };

  const confirm = () => {
    onChange(toValue(sel));
    setOpen(false);
  };

  const display = value ? `${formatDate(value + ":00")} · ${formatTime(value + ":00")}` : "";

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 border border-ink/10 rounded-xl text-sm bg-white hover:border-gold/60 transition text-left"
      >
        <CalendarDays className="w-4 h-4 text-gold flex-shrink-0" />
        <span className={display ? "text-ink font-medium" : "text-gray-400"}>{display || placeholder}</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[300px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-ink/10 p-4 anim-pop">
          {/* Header tháng */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={() => shiftMonth(-1)} className="p-1.5 rounded-lg hover:bg-ink/5 transition">
              <ChevronLeft className="w-4 h-4 text-ink/60" />
            </button>
            <p className="font-display font-bold text-ink text-sm">
              {VI_MONTHS[view.m]} {view.y}
            </p>
            <button type="button" onClick={() => shiftMonth(1)} className="p-1.5 rounded-lg hover:bg-ink/5 transition">
              <ChevronRight className="w-4 h-4 text-ink/60" />
            </button>
          </div>

          {/* Lưới ngày */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {VI_WEEKDAYS.map((w) => (
              <div key={w} className="text-center text-[10px] font-bold text-ink/40 py-1">{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => (
              <button
                key={i}
                type="button"
                disabled={!d}
                onClick={() => pickDay(d)}
                className={`aspect-square rounded-xl text-xs font-semibold transition flex items-center justify-center ${
                  !d ? "invisible"
                  : isSelected(d) ? "bg-gold text-white shadow-md shadow-gold/30"
                  : isToday(d) ? "bg-gold/15 text-gold border border-gold/40"
                  : "text-ink/70 hover:bg-ink/5"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Chọn giờ */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-ink/10">
            <Clock className="w-4 h-4 text-gold flex-shrink-0" />
            <div className="flex items-center gap-1 flex-1">
              <select
                value={pad(sel.hh)}
                onChange={(e) => setSel((s) => ({ ...s, hh: parseInt(e.target.value, 10) }))}
                className="flex-1 px-2 py-1.5 border border-ink/10 rounded-lg text-sm font-bold text-ink bg-white focus:border-gold outline-none text-center"
              >
                {Array.from({ length: 24 }, (_, h) => (
                  <option key={h} value={pad(h)}>{pad(h)}</option>
                ))}
              </select>
              <span className="font-bold text-ink/40">:</span>
              <select
                value={pad(sel.mm)}
                onChange={(e) => setSel((s) => ({ ...s, mm: parseInt(e.target.value, 10) }))}
                className="flex-1 px-2 py-1.5 border border-ink/10 rounded-lg text-sm font-bold text-ink bg-white focus:border-gold outline-none text-center"
              >
                {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
                  <option key={m} value={pad(m)}>{pad(m)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Phím tắt */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {[
              { label: "Bây giờ", fn: (n) => n },
              { label: "+1 giờ", fn: (n) => new Date(n.getTime() + 3600000) },
              { label: "Ngày mai 8:00", fn: (n) => { const t = new Date(n); t.setDate(t.getDate() + 1); t.setHours(8, 0, 0, 0); return t; } },
              { label: "Tối nay 20:00", fn: (n) => { const t = new Date(n); t.setHours(20, 0, 0, 0); return t; } },
            ].map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => applyQuick(q.fn)}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-ink/5 text-ink/60 hover:bg-gold/15 hover:text-gold transition"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-ink/5 transition"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={confirm}
              className="flex-1 py-2 rounded-xl text-sm font-bold bg-gold text-white hover:bg-gold/90 transition shadow-md shadow-gold/20"
            >
              Xong
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
