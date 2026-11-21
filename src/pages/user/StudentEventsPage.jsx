// pages/user/StudentEventsPage.jsx
//
// Sự kiện theo mùa phía HỌC SINH:
//  · #/events — các sự kiện đang chạy thuộc phạm vi của bé (toàn trường
//    hoặc đúng khối lớp của bé), kèm tiến độ từng cột mốc của bé và
//    bảng xếp hạng rút gọn. Không có sự kiện phù hợp → trang báo rõ
//    "chưa có sự kiện" (không dữ liệu mẫu, không khối rỗng khó hiểu).
//  · #/events/:eventId — chi tiết một sự kiện: tiến độ đầy đủ + bảng
//    xếp hạng đầy đủ + hạng của bé.
// Mọi số liệu do server tính từ lịch sử ván chơi THẬT trong cửa sổ sự
// kiện; đạt cột mốc thì server trao thưởng ngay khi bé mở trang (huy
// hiệu / hạt giống cây) — trang chỉ hiển thị trạng thái server trả.

import { useEffect, useState } from "react";
import { CalendarRange, PartyPopper, Trophy } from "lucide-react";
import { Loader } from "../../components/ui";
import { navigate } from "../../lib/router.js";
import { eventService } from "../../services/api.js";
import { LeaderboardList, QuestProgressList } from "../../components/events/EventViews.jsx";
import { timeLeftText, usePlantTypes } from "../../components/events/eventHelpers.js";

function EventBlock({ view, plantTypes, myUserId, detail = false }) {
  return (
    <section className="rounded-3xl border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white p-4 md:p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-xl md:text-2xl text-ink flex items-center gap-2">
            <PartyPopper className="w-6 h-6 text-amber-500" /> {view.name}
          </h2>
          {view.description && <p className="text-sm text-slate-500 mt-1">{view.description}</p>}
          <p className="text-xs font-semibold text-amber-600 mt-1">
            {view.status === "finalized" ? "Sự kiện đã tổng kết" : timeLeftText(view.endsAt)}
            {view.scope?.type === "grades" ? ` · Dành cho khối ${(view.scope.grades || []).join(", ")}` : " · Toàn trường"}
          </p>
        </div>
        {!detail && (
          <button
            type="button"
            onClick={() => navigate(`/events/${view.id}`)}
            className="px-3 py-1.5 rounded-xl bg-amber-400 text-white text-sm font-bold shadow hover:bg-amber-500"
          >
            Xem chi tiết
          </button>
        )}
      </div>

      {(view.newlyGranted || []).length > 0 && (
        <p className="mt-3 rounded-xl bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-2">
          🎉 Bé vừa mở khoá {(view.newlyGranted || []).length} phần thưởng mới trong sự kiện này!
        </p>
      )}

      <div className="mt-3">
        <QuestProgressList quests={view.quests} plantTypes={plantTypes} />
      </div>

      <div className="mt-4">
        <h3 className="font-bold text-ink flex items-center gap-1.5 mb-2">
          <Trophy className="w-4 h-4 text-amber-500" /> Bảng xếp hạng sự kiện
        </h3>
        <LeaderboardList rows={view.leaderboard} myRank={view.myRank} myUserId={myUserId} />
      </div>
    </section>
  );
}

export default function StudentEventsPage({ userAuth, eventId, onUserLogin }) {
  const [views, setViews] = useState(null);
  const [error, setError] = useState("");
  const plantTypes = usePlantTypes();
  const myUserId = userAuth?.user?.id;

  useEffect(() => {
    if (!userAuth) return undefined;
    let cancelled = false;
    (async () => {
      try {
        if (eventId) {
          const v = await eventService.detail(eventId);
          if (!cancelled) setViews(v ? [v] : []);
        } else {
          const list = await eventService.active();
          if (!cancelled) setViews(Array.isArray(list) ? list : []);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Không tải được sự kiện");
      }
    })();
    return () => { cancelled = true; };
  }, [userAuth, eventId]);

  if (!userAuth) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <CalendarRange className="w-10 h-10 text-amber-400 mx-auto" />
        <h1 className="font-display text-2xl text-ink mt-3">Sự kiện theo mùa</h1>
        <p className="text-slate-500 mt-2">Bé cần đăng nhập để xem các sự kiện đang diễn ra và tiến độ của mình.</p>
        {onUserLogin && (
          <button type="button" onClick={onUserLogin} className="mt-4 px-5 py-2.5 rounded-xl bg-amber-400 text-white font-bold shadow hover:bg-amber-500">
            Đăng nhập
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <h1 className="font-display text-2xl md:text-3xl text-ink flex items-center gap-2">
        <CalendarRange className="w-7 h-7 text-amber-500" /> Sự kiện theo mùa
      </h1>
      {error ? (
        <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 text-sm">{error}</div>
      ) : views === null ? (
        <div className="flex justify-center py-16"><Loader /></div>
      ) : views.length === 0 ? (
        <div className="mt-4 rounded-3xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-8 text-center text-slate-500">
          Hiện chưa có sự kiện nào đang diễn ra dành cho bé. Khi thầy cô mở sự kiện mới, bé quay lại đây nhé!
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {views.map((v) => (
            <EventBlock key={v.id} view={v} plantTypes={plantTypes} myUserId={myUserId} detail={!!eventId} />
          ))}
        </div>
      )}
    </div>
  );
}
