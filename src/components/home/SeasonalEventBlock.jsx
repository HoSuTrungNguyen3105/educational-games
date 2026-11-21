// components/home/SeasonalEventBlock.jsx
//
// Khối "Sự kiện theo mùa" trên trang chủ học sinh: CHỈ render khi server
// trả về ít nhất một sự kiện đang chạy thuộc phạm vi của bé (toàn trường
// hoặc đúng khối lớp) — không có sự kiện thì không hiện gì cả (không
// khung rỗng, không dữ liệu mẫu). Tiến độ do server tính từ lịch sử ván
// chơi thật; bấm vào mở trang #/events xem chi tiết + xếp hạng đầy đủ.

import { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";
import { navigate } from "../../lib/router.js";
import { eventService } from "../../services/api.js";
import { QuestProgressList } from "../events/EventViews.jsx";
import { timeLeftText, usePlantTypes } from "../events/eventHelpers.js";

export default function SeasonalEventBlock({ userAuth, className = "" }) {
  const [views, setViews] = useState([]);
  const plantTypes = usePlantTypes();
  const isStudent = userAuth?.user?.role === "student";

  useEffect(() => {
    if (!isStudent) return undefined;
    let cancelled = false;
    eventService
      .active()
      .then((list) => { if (!cancelled) setViews(Array.isArray(list) ? list : []); })
      .catch(() => { if (!cancelled) setViews([]); });
    return () => { cancelled = true; };
  }, [isStudent]);

  if (!isStudent || views.length === 0) return null;

  return (
    <>
      {views.map((v) => (
        <section key={v.id} className={`gq-sect ${className}`}>
          <div className="rounded-3xl border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white p-4 md:p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="font-display text-xl md:text-2xl text-ink flex items-center gap-2">
                  <PartyPopper className="w-6 h-6 text-amber-500" /> {v.name}
                </h2>
                <p className="text-xs font-semibold text-amber-600 mt-1">{timeLeftText(v.endsAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/events/${v.id}`)}
                className="px-3 py-1.5 rounded-xl bg-amber-400 text-white text-sm font-bold shadow hover:bg-amber-500"
              >
                Xem sự kiện
              </button>
            </div>
            {(v.newlyGranted || []).length > 0 && (
              <p className="mt-3 rounded-xl bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-2">
                🎉 Bé vừa mở khoá {(v.newlyGranted || []).length} phần thưởng mới!
              </p>
            )}
            <div className="mt-3">
              <QuestProgressList quests={v.quests} plantTypes={plantTypes} compact />
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
