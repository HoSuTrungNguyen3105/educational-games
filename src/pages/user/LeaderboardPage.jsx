import { useEffect, useState, useCallback } from "react";
import { Trophy, Coins } from "lucide-react";
import { userService } from "../../services/api.js";
import { getLevelProgress, getLevelTitle } from "../../lib/utils.js";
import { PrimaryButton, Loader, ErrorState, EmptyState } from "../../components/ui.jsx";

const TOP_N = 50;
const RANK_MEDAL = ["🥇", "🥈", "🥉"];

function displayName(u) {
  return u?.name || u?.username || u?.displayName || "Người chơi";
}

export default function LeaderboardPage({ userAuth, onBack }) {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const list = await userService.list();
      const arr = Array.isArray(list) ? list : list?.users || list?.data || [];
      arr.sort((a, b) => (Number(b?.coins) || 0) - (Number(a?.coins) || 0));
      setUsers(arr.slice(0, TOP_N));
    } catch (e) {
      setError(e?.message || "Không tải được bảng xếp hạng");
      setUsers([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center anim-pop">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để xem bảng xếp hạng</p>
          <PrimaryButton onClick={onBack}>← Về trang chủ</PrimaryButton>
        </div>
      </div>
    );
  }

  const myId = userAuth.user?.id ?? userAuth.user?._id;
  const myUsername = userAuth.user?.username;
  const isMe = (u) =>
    (myId != null && String(u?.id ?? u?._id ?? "") === String(myId)) ||
    (myUsername && u?.username === myUsername);

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10 max-w-3xl mx-auto w-full">
      <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink transition inline-flex items-center gap-1 mb-6">
        ← Về trang chủ
      </button>

      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-ink flex items-center gap-2">
          <Trophy className="w-7 h-7 text-amber-500" /> Bảng xếp hạng
        </h1>
        <p className="text-sm text-[#8A7C63] mt-1">Top {TOP_N} người chơi nhiều xu nhất</p>
      </div>

      {users === null ? (
        <div className="flex justify-center py-10"><Loader label="Đang tải bảng xếp hạng..." /></div>
      ) : error ? (
        <ErrorState title="Không tải được bảng xếp hạng" subtitle={error} onRetry={load} />
      ) : users.length === 0 ? (
        <EmptyState icon="🏆" title="Chưa có dữ liệu" subtitle="Hãy là người đầu tiên lên bảng xếp hạng!" />
      ) : (
        <div className="nb-card overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {users.map((u, i) => {
              const rank = i + 1;
              const me = isMe(u);
              const lv = getLevelProgress(u?.coins || 0);
              return (
                <li
                  key={u?.id ?? u?._id ?? u?.username ?? rank}
                  className={`flex items-center gap-3 px-4 py-3 ${me ? "bg-emerald-50" : ""}`}
                >
                  <span className="w-8 shrink-0 text-center text-lg font-extrabold text-slate-500">
                    {RANK_MEDAL[rank - 1] || rank}
                  </span>
                  <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-white flex items-center justify-center font-extrabold">
                    {displayName(u).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-ink text-sm truncate flex items-center gap-2">
                      {displayName(u)}
                      {me && (
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5 whitespace-nowrap">
                          Bạn
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-[#8A7C63]">
                      Lv.{lv.level} · {getLevelTitle(lv.level)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-extrabold text-amber-600 whitespace-nowrap">
                    <Coins className="w-4 h-4" /> {(Number(u?.coins) || 0).toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
