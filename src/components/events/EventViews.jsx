// components/events/EventViews.jsx
//
// Mảnh giao diện DÙNG CHUNG cho Sự kiện theo mùa phía học sinh (trang
// #/events và khối sự kiện trên trang chủ): danh sách cột mốc kèm thanh
// tiến độ và bảng xếp hạng rút gọn. Helper/hook nằm ở eventHelpers.js.
// Mọi số liệu do server tính từ lịch sử ván chơi thật (eventService) —
// component chỉ hiển thị, không tự tính, không có số mẫu.

import { CheckCircle2, Sprout } from "lucide-react";
import { rewardLabel } from "./eventHelpers.js";

const QUEST_TYPE_SUFFIX = { plays: "ván", topic_plays: "ván", xp: "XP" };

export function QuestProgressList({ quests, plantTypes, compact = false }) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {(quests || []).map((q) => {
        const pct = q.target > 0 ? Math.min(100, Math.round((q.progress / q.target) * 100)) : 0;
        return (
          <div key={q.id} className="rounded-xl bg-white/70 border border-amber-100 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-ink text-sm flex items-center gap-1.5">
                {q.granted ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : null}
                {q.title}
              </span>
              <span className="text-xs font-mono text-slate-500 shrink-0">
                {q.progress}/{q.target} {QUEST_TYPE_SUFFIX[q.type] || ""}
              </span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${q.completed ? "bg-emerald-400" : "bg-amber-400"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              {q.reward?.kind === "seed" ? <Sprout className="w-3.5 h-3.5 text-emerald-500" /> : null}
              {q.granted
                ? `Đã mở khoá: ${rewardLabel(q.reward, plantTypes)}`
                : `Phần thưởng: ${rewardLabel(q.reward, plantTypes)}`}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function LeaderboardList({ rows, myRank, myUserId }) {
  const list = rows || [];
  if (!list.length) {
    return <p className="text-sm text-slate-500">Chưa có bạn nào có hoạt động trong sự kiện này — bé hãy là người đầu tiên nhé!</p>;
  }
  const inTop = myRank && list.some((r) => r.userId === myRank.userId);
  return (
    <div>
      <ol className="space-y-1">
        {list.map((r) => (
          <li
            key={r.userId}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm ${r.userId === myUserId ? "bg-amber-100 font-bold text-ink" : "bg-white/60 text-slate-600"}`}
          >
            <span className="w-7 font-bold text-ink">#{r.rank}</span>
            <span className="flex-1 truncate">{r.name}</span>
            <span className="text-xs">{r.questsCompleted} cột mốc</span>
            <span className="text-xs font-mono">{r.xp} XP</span>
          </li>
        ))}
      </ol>
      {myRank && !inTop && (
        <p className="mt-2 text-sm text-ink">
          Hạng của bé: <b>#{myRank.rank}</b> — {myRank.questsCompleted} cột mốc · {myRank.xp} XP
        </p>
      )}
    </div>
  );
}
