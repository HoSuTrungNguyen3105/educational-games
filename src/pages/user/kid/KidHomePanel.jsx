// PANEL "HÔM NAY" — nội dung đầu tiên và là mặc định của trang Bé.
//
// Đúng các mục ở Giai đoạn 1 trong c_t_t_nh_n_ng_h_th_ng_eduplay.md:
//  • Lời chào linh vật theo tên + lớp, nút 🔊 đọc to (TTS) cho bé lớp 1–2
//    chưa đọc thạo — dùng chung lib/speech.js.
//  • "Nhiệm vụ hôm nay": lấy NHIỆM VỤ THẬT từ API (/tasks/me?scope=DAILY)
//    thay vì mảng cứng như bản trước; hiện tiến độ + nút nhận thưởng.
//  • Lối tắt một chạm tới Góc học tập / Khu vườn / Kho báu / Bảng vàng.
import { useCallback, useEffect, useState } from "react";
import { ChevronRight, PartyPopper, RefreshCw, Volume2 } from "lucide-react";
import { navigate } from "../../../lib/router.js";
import { speak } from "../../../lib/speech.js";
import { taskService } from "../../../services/taskService.js";
import TaskIcon from "../../../components/tasks/TaskIcon.jsx";
import TaskProgress from "../../../components/tasks/TaskProgress.jsx";
import { SHORTCUTS } from "./kidNav.js";

const MAX_TASKS = 4; // Bé không đọc nổi danh sách dài — 4 thẻ là vừa đủ.

export default function KidHomePanel({ vm, kid, onClaimed }) {
  const { user, coins, stars, lv } = vm;
  const className = vm.className || (kid?.grade ? `Lớp ${kid.grade}` : "");

  // ── Nhiệm vụ hôm nay (API thật) ──
  const [tasks, setTasks] = useState(null); // null = chưa tải, [] = không có
  const [taskError, setTaskError] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [notice, setNotice] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      const res = await taskService.getTasks("DAILY");
      setTasks(Array.isArray(res?.tasks) ? res.tasks : []);
      setTaskError(null);
    } catch (e) {
      // Giữ nguyên trạng thái cũ; chỉ hiện lỗi khi CHƯA có dữ liệu nào.
      setTasks((prev) => prev ?? []);
      setTaskError(e?.message || "Không tải được nhiệm vụ");
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const handleClaim = useCallback(async (taskId) => {
    if (claiming) return;
    setClaiming(true);
    setNotice(null);
    try {
      const res = await taskService.claimReward(taskId);
      setNotice({ type: "success", text: `Giỏi lắm! Bé nhận ${res?.rewardCoin || 0} xu 🎉` });
      await loadTasks();
      onClaimed?.(); // sidebar/greeting cập nhật số xu ngay
    } catch (e) {
      setNotice({ type: "error", text: e?.message || "Chưa nhận được thưởng, bé thử lại nhé" });
    } finally {
      setClaiming(false);
      setTimeout(() => setNotice(null), 4000);
    }
  }, [claiming, loadTasks, onClaimed]);

  const greeting = `Chào ${user.name || "bé"}${className ? `, ${className}` : ""}! Hôm nay bé học gì nào?`;

  const pending = (tasks || []).filter((t) => t.completed && !t.claimed).length;

  return (
    <div className="flex flex-col gap-4">
      {/* ── Lời chào linh vật + đọc to ── */}
      <section
        className="relative overflow-hidden rounded-3xl p-5 shadow-lg text-white"
        style={{ background: "linear-gradient(135deg, #38bdf8 0%, #34d399 55%, #fbbf24 100%)" }}
      >
        <div className="absolute -right-6 -top-8 text-[110px] leading-none opacity-20 select-none" aria-hidden>
          {kid?.gender === "female" ? "🦋" : "🦉"}
        </div>
        <div className="relative flex flex-wrap items-start gap-3">
          <span className="text-5xl drop-shadow" aria-hidden>{kid?.gender === "female" ? "🦋" : "🦉"}</span>
          <div className="flex-1 min-w-[200px]">
            <h1 className="font-display text-2xl leading-tight drop-shadow-sm">
              Chào {user.name || "bé"}!
            </h1>
            <p className="text-sm text-white/90 mt-0.5">
              {className}
              {kid?.age ? ` • ${kid.age} tuổi` : ""} • Level {lv.level}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-sm font-bold">
              <span className="rounded-full bg-white/25 px-3 py-1 backdrop-blur">🪙 {coins.toLocaleString()} xu</span>
              <span className="rounded-full bg-white/25 px-3 py-1 backdrop-blur">⭐ {stars.toLocaleString()} sao</span>
            </div>
          </div>
          <button
            onClick={() => speak(greeting)}
            className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-extrabold text-sky-700 shadow active:scale-95 transition"
          >
            <Volume2 className="w-4 h-4" /> Đọc to
          </button>
        </div>
      </section>

      {/* ── Nhiệm vụ hôm nay ── */}
      <section
        className="rounded-3xl p-4 shadow-lg"
        style={{ background: "var(--card)", border: "1px solid var(--line)" }}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
            <PartyPopper className="w-5 h-5" />
          </span>
          <h2 className="flex-1 font-display text-lg text-ink">Nhiệm vụ hôm nay</h2>
          {pending > 0 && (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-extrabold text-amber-600">
              {pending} phần thưởng chờ nhận
            </span>
          )}
          <button
            onClick={() => speak("Đây là nhiệm vụ hôm nay của bé. Hoàn thành để nhận xu nhé!")}
            aria-label="Đọc to tiêu đề nhiệm vụ"
            className="grid h-9 w-9 place-items-center rounded-xl bg-sky-100 text-sky-600 active:scale-95 transition"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {tasks === null ? (
          <p className="py-6 text-center text-sm text-ink/40 animate-pulse">Đang tải nhiệm vụ…</p>
        ) : taskError && tasks.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-red-500 mb-3">{taskError}</p>
            <button
              onClick={loadTasks}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-sm font-bold text-white active:scale-95"
            >
              <RefreshCw className="w-4 h-4" /> Thử lại
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink/50">
            Hôm nay bé không có nhiệm vụ nào — đi chơi thôi! 🎈
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {tasks.slice(0, MAX_TASKS).map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                claiming={claiming}
                onSpeak={() => speak(`${t.name}. ${t.description || ""}`)}
                onClaim={() => handleClaim(t.id)}
              />
            ))}
          </ul>
        )}

        {notice && (
          <p
            className={`mt-3 rounded-xl px-3 py-2 text-center text-sm font-bold ${
              notice.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
            }`}
          >
            {notice.text}
          </p>
        )}

        {(tasks?.length || 0) > MAX_TASKS && (
          <button
            onClick={() => navigate("/daily-tasks")}
            className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-xl py-2 text-sm font-bold text-sky-600 hover:bg-sky-50 transition"
          >
            Xem tất cả nhiệm vụ <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </section>

      {/* ── Lối tắt một chạm ── */}
      <section>
        <h2 className="mb-2 px-1 font-display text-lg text-ink">Khám phá nhanh</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {SHORTCUTS.map(({ key, icon, label, path, tint }) => (
            <button
              key={key}
              onClick={() => navigate(path)}
              className="group flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3 shadow active:scale-95 transition"
              style={{ border: "1px solid var(--line)" }}
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-2xl text-white shadow group-hover:scale-105 transition ${tint}`}
                aria-hidden
              >
                {icon}
              </span>
              <span className="text-[11px] font-extrabold text-ink text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Một thẻ nhiệm vụ: icon màu, tên, thanh tiến độ, thưởng và nút lớn. */
function TaskCard({ task, claiming, onSpeak, onClaim }) {
  const isDone = task.completed && !task.claimed;
  return (
    <li
      className="flex items-center gap-3 rounded-2xl p-3"
      style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow">
        <TaskIcon code={task.code} type={task.type} className="w-6 h-6" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-bold text-ink">{task.name}</p>
          <button
            onClick={onSpeak}
            aria-label={`Đọc to: ${task.name}`}
            className="shrink-0 text-sky-500 active:scale-90 transition"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
        {task.description && (
          <p className="truncate text-[11px] text-ink/50">{task.description}</p>
        )}
        <TaskProgress
          progress={task.progress}
          target={task.target}
          completed={task.completed}
          claimed={task.claimed}
        />
      </div>

      <div className="flex shrink-0 flex-col items-center gap-1">
        <span className="text-xs font-extrabold text-amber-600">+{task.rewardCoin} 🪙</span>
        {task.claimed ? (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
            Đã nhận
          </span>
        ) : isDone ? (
          <button
            onClick={onClaim}
            disabled={claiming}
            className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3.5 py-1.5 text-xs font-extrabold text-white shadow active:scale-95 disabled:opacity-50"
          >
            {claiming ? "…" : "Nhận"}
          </button>
        ) : (
          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-bold text-sky-600">
            Đang làm
          </span>
        )}
      </div>
    </li>
  );
}
