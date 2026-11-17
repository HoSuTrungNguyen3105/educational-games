import { useMemo, useState } from "react";
import {
  AlarmClockCheck, Bell, BellRing, Dices, HandHeart, Music, Sparkles, Star, Timer, Trophy, Users,
} from "lucide-react";
import { Select } from "../../../components/ui";
import { ClassPicker, InitialAvatar, StudentName } from "./shared.jsx";
import { makePairs } from "./groupUtils.js";
import { playTeacherSound } from "./sounds.js";
import {
  CHALLENGES, CHALLENGE_LEVELS, CHALLENGE_LEVEL_LABEL, CHALLENGE_SUBJECTS, CHALLENGE_SUBJECT_LABEL,
} from "./challenges.js";

/**
 * RoutinesTab — tab "Nề nếp" của trang Công cụ lớp học (ảnh mẫu 4).
 *
 * Ba khối:
 *  - Ghép cặp đôi (Think-Pair-Share): xáo trộn TOÀN BỘ học sinh của lớp
 *    đang chọn rồi ghép 2 em/cặp (lẻ thì cặp cuối 3 em). Tab này dùng
 *    toàn bộ roster — KHÔNG dùng trạng thái "không tham gia" (excluded)
 *    của tab Chia nhóm, vì nề nếp lớp áp dụng cho cả lớp.
 *  - Âm thanh Sư phạm & Tập trung: 6 âm thanh tổng hợp bằng Web Audio
 *    API (sounds.js) — không file, không thư viện.
 *  - Ngân hàng Thử thách Sư phạm: 35 thẻ viết cho tiểu học (challenges.js),
 *    lọc theo môn / mức rồi bốc ngẫu nhiên trong phạm vi đang lọc.
 *
 * Kết quả ghép cặp và thẻ đang bốc là trạng thái của phiên làm việc
 * (không lưu bền) — đổi lớp thì làm mới.
 */

const SOUND_BUTTONS = [
  { kind: "focus-bell", label: "Chuông định tâm", desc: "Lắng đọng, tập trung", icon: Bell, classes: "bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100" },
  { kind: "fanfare", label: "Kèn chiến thắng", desc: "Khen thưởng xuất sắc", icon: Trophy, classes: "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100" },
  { kind: "attention", label: "Tín hiệu chú ý", desc: "Thu hút cả lớp", icon: BellRing, classes: "bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100" },
  { kind: "thinking-knock", label: "Gõ nhịp suy nghĩ", desc: "Định hình thời gian", icon: Timer, classes: "bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100" },
  { kind: "end-bell", label: "Chuông kết thúc", desc: "Báo hết giờ", icon: AlarmClockCheck, classes: "bg-violet-50 border-violet-200 text-violet-800 hover:bg-violet-100" },
  { kind: "point-ting", label: "Ting ting điểm", desc: "Khích lệ tức thì", icon: Star, classes: "bg-lime-50 border-lime-200 text-lime-800 hover:bg-lime-100" },
];

const LEVEL_BADGE = {
  easy: "bg-emerald-100 text-emerald-700 border-emerald-300",
  medium: "bg-amber-100 text-amber-700 border-amber-300",
  hard: "bg-rose-100 text-rose-700 border-rose-300",
};

export default function RoutinesTab({ roster }) {
  const { activeClass } = roster;
  const students = useMemo(() => activeClass?.students ?? [], [activeClass]);

  const [pairs, setPairs] = useState(null); // null = chưa ghép
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [card, setCard] = useState(null);

  // Đổi lớp → làm mới kết quả ghép cặp (tránh hiện cặp của lớp khác).
  const classId = activeClass?.id;
  const [lastClassId, setLastClassId] = useState(classId);
  if (classId !== lastClassId) {
    setLastClassId(classId);
    setPairs(null);
  }

  const pool = useMemo(
    () => CHALLENGES.filter(
      (c) => (subjectFilter === "all" || c.subject === subjectFilter)
        && (levelFilter === "all" || c.level === levelFilter),
    ),
    [subjectFilter, levelFilter],
  );

  const drawCard = () => {
    if (!pool.length) return;
    // Bốc lại mà còn lựa chọn khác thì tránh lặp đúng thẻ đang hiện.
    const candidates = pool.length > 1 && card ? pool.filter((c) => c.id !== card.id) : pool;
    setCard(candidates[Math.floor(Math.random() * candidates.length)]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="font-display font-bold text-lg text-ink flex items-center gap-2">
          <HandHeart className="w-5 h-5 text-rose-500" />
          Nề nếp &amp; Hoạt động lớp
        </h2>
        <ClassPicker roster={roster} className="ml-auto" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 items-start">
        {/* ── Cột trái: ghép cặp + ngân hàng thử thách ─────────────── */}
        <div className="flex flex-col gap-4 min-w-0">
          <section className="bg-white rounded-3xl border border-ink/10 shadow-sm p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <h3 className="font-display font-bold text-ink flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  Ghép cặp đôi (Think-Pair-Share)
                </h3>
                <p className="text-sm text-ink/55 mt-0.5">Tự động bắt cặp 2 bạn để thảo luận nhanh.</p>
              </div>
              <button type="button" onClick={() => setPairs(makePairs(students))} disabled={students.length < 2}
                className="ml-auto font-display font-semibold rounded-xl px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] transition disabled:opacity-40">
                Ghép cặp ngay
              </button>
            </div>

            {students.length === 0 ? (
              <p className="text-sm text-ink/45">Lớp chưa có học sinh nào — nạp danh sách ở tab “Gọi tên” trước.</p>
            ) : pairs === null ? (
              <p className="text-sm text-ink/45 italic">Bấm “Ghép cặp ngay” để tự động tạo danh sách cặp đôi ngẫu nhiên.</p>
            ) : (
              <>
                <div className="grid gap-2 sm:grid-cols-2">
                  {pairs.map((group, i) => (
                    <div key={i} className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-3 py-2.5">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 mb-1.5">
                        {group.length === 3 ? `Nhóm ${i + 1} (3 bạn)` : `Cặp ${i + 1}`}
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {group.map((s) => (
                          <span key={s.id} className="flex items-center gap-2 min-w-0">
                            <InitialAvatar name={s.name} size={24} />
                            <StudentName student={s} className="text-sm font-semibold text-ink" />
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ink/45">Chưa ưng ý? Bấm “Ghép cặp ngay” lần nữa để ghép lại từ đầu.</p>
              </>
            )}
          </section>

          <section className="bg-white rounded-3xl border border-ink/10 shadow-sm p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <h3 className="font-display font-bold text-ink flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Ngân hàng Thử thách Sư phạm
                </h3>
                <p className="text-sm text-ink/55 mt-0.5">{CHALLENGES.length} thẻ thử thách cho học sinh tiểu học.</p>
              </div>
              <button type="button" onClick={drawCard} disabled={pool.length === 0}
                className="ml-auto inline-flex items-center gap-1.5 font-display font-semibold rounded-xl px-4 py-2.5 bg-ink text-paper hover:bg-ink2 active:scale-[0.98] transition disabled:opacity-40">
                <Dices className="w-4 h-4" /> Bốc ngẫu nhiên
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="block text-xs font-semibold text-ink/55 mb-1">Môn học</span>
                <Select
                  value={subjectFilter}
                  onChange={(v) => { setSubjectFilter(v); }}
                  options={[
                    { value: "all", label: "Tất cả các môn" },
                    ...CHALLENGE_SUBJECTS.map((s) => ({ value: s.id, label: s.label })),
                  ]}
                />
              </div>
              <div>
                <span className="block text-xs font-semibold text-ink/55 mb-1">Mức độ</span>
                <Select
                  value={levelFilter}
                  onChange={(v) => { setLevelFilter(v); }}
                  options={[
                    { value: "all", label: "Tất cả các mức" },
                    ...CHALLENGE_LEVELS.map((l) => ({ value: l.id, label: l.label })),
                  ]}
                />
              </div>
            </div>

            {pool.length === 0 ? (
              <p className="text-sm text-ink/45">Không có thẻ nào phù hợp với bộ lọc hiện tại — hãy nới lỏng môn hoặc mức độ.</p>
            ) : card && pool.some((c) => c.id === card.id) ? (
              <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-4">
                <p className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
                    {CHALLENGE_SUBJECT_LABEL[card.subject]}
                  </span>
                  <span className={`text-[10px] font-bold rounded-full border px-2 py-0.5 ${LEVEL_BADGE[card.level]}`}>
                    {CHALLENGE_LEVEL_LABEL[card.level]}
                  </span>
                </p>
                <p className="font-display font-semibold text-base leading-relaxed text-ink">{card.text}</p>
              </div>
            ) : (
              <p className="text-sm text-ink/45 italic">
                Đang có {pool.length} thẻ trong phạm vi lọc — bấm “Bốc ngẫu nhiên” để rút một thẻ cho cả lớp.
              </p>
            )}
          </section>
        </div>

        {/* ── Cột phải: âm thanh sư phạm ────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-ink/10 shadow-sm p-4 sm:p-5 flex flex-col gap-3 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <h3 className="font-display font-bold text-ink flex items-center gap-2">
                <Music className="w-5 h-5 text-violet-500" />
                Âm thanh Sư phạm &amp; Tập trung
              </h3>
              <p className="text-sm text-ink/55 mt-0.5">
                Các tín hiệu âm thanh chuẩn sư phạm giúp thu hút chú ý tức thì và điều hoà nề nếp lớp.
              </p>
            </div>
            <span className="ml-auto text-[11px] font-bold rounded-full border border-ink/15 bg-paper2/70 text-ink/55 px-2.5 py-1">
              Web Audio API
            </span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {SOUND_BUTTONS.map(({ kind, label, desc, icon: Icon, classes }) => (
              <button
                key={kind}
                type="button"
                onClick={() => playTeacherSound(kind)}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-3 py-4 text-center active:scale-[0.98] transition ${classes}`}
              >
                <Icon className="w-6 h-6" />
                <span className="font-display font-bold text-sm">{label}</span>
                <span className="text-xs opacity-70">{desc}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-ink/45">
            Âm thanh được tổng hợp trực tiếp bằng Web Audio API — không cần file nhạc, phát ngay cả khi không có mạng.
          </p>
        </section>
      </div>
    </div>
  );
}
