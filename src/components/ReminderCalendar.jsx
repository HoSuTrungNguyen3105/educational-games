import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VI_MONTHS, VI_WEEKDAYS, localDateKey } from "../lib/reminderUtils.js";

/**
 * ReminderCalendar — lịch tháng hiển thị các ngày có nhắc nhở.
 * Props:
 *   reminders: mảng reminder (có remindAt ISO)
 *   selectedDate: key "YYYY-MM-DD" đang chọn (giờ địa phương)
 *   onSelectDate(key)
 */
export default function ReminderCalendar({ reminders = [], selectedDate, onSelectDate }) {
  const now = new Date();
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });

  // Nhóm reminder theo ngày (giờ địa phương)
  const byDate = useMemo(() => {
    const map = {};
    for (const r of reminders) {
      if (r.triggered) continue;
      const key = localDateKey(r.remindAt);
      if (!key) continue;
      if (!map[key]) map[key] = [];
      map[key].push(r);
    }
    return map;
  }, [reminders]);

  const days = useMemo(() => {
    const { y, m } = view;
    const first = new Date(y, m, 1);
    const lead = (first.getDay() + 6) % 7; // Thứ 2 = 0
    const count = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push(null);
    for (let d = 1; d <= count; d++) cells.push(d);
    return cells;
  }, [view]);

  const shiftMonth = (dir) => {
    setView((v) => {
      const nd = new Date(v.y, v.m + dir, 1);
      return { y: nd.getFullYear(), m: nd.getMonth() };
    });
  };

  const pad = (n) => String(n).padStart(2, "0");
  const todayKey = localDateKey(now);

  return (
    <div className="bg-white rounded-2xl border border-ink/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => shiftMonth(-1)} className="p-1.5 rounded-lg hover:bg-ink/5 transition">
          <ChevronLeft className="w-4 h-4 text-ink/60" />
        </button>
        <p className="font-display font-bold text-ink">
          {VI_MONTHS[view.m]} {view.y}
        </p>
        <button type="button" onClick={() => shiftMonth(1)} className="p-1.5 rounded-lg hover:bg-ink/5 transition">
          <ChevronRight className="w-4 h-4 text-ink/60" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {VI_WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-[10px] font-bold text-ink/40 py-1">{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          if (!d) return <div key={i} />;
          const key = `${view.y}-${pad(view.m + 1)}-${pad(d)}`;
          const items = byDate[key] || [];
          const has = items.length > 0;
          const isSel = selectedDate === key;
          const isToday = todayKey === key;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectDate(key)}
              className={`relative aspect-square rounded-xl text-xs font-semibold transition flex flex-col items-center justify-center ${
                isSel ? "bg-gold text-white shadow-md shadow-gold/30"
                : isToday ? "bg-gold/15 text-gold border border-gold/40"
                : "text-ink/70 hover:bg-ink/5"
              }`}
            >
              {d}
              {has && (
                <span className={`absolute bottom-1 flex gap-0.5`}>
                  {items.slice(0, 3).map((_, j) => (
                    <span key={j} className={`w-1 h-1 rounded-full ${isSel ? "bg-white" : "bg-gold"}`} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-ink/10 text-[11px] text-ink/50">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gold inline-block" /> Có nhắc nhở
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gold/30 border border-gold/50 inline-block" /> Hôm nay
        </span>
      </div>
    </div>
  );
}
