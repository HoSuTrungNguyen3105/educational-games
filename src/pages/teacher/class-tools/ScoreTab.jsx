import { useMemo, useState } from "react";
import { Pencil, Plus, Printer, RotateCcw, Trophy, X } from "lucide-react";
import { ConfirmModal, GhostButton, Input, Modal, SearchInput } from "../../../components/ui";
import { useConfirm } from "../../../hooks/useConfirm.js";
import { useClassTeams } from "../../../hooks/useClassTeams.js";
import { ClassPicker, GenderBadge, InitialAvatar, StudentName } from "./shared.jsx";
import { LEVELS, TEAM_COLOR_BY_ID, levelForPoints } from "./shared.js";
import PrintSheet from "./PrintSheet.jsx";

/**
 * ScoreTab — tab "Bảng điểm" của trang Công cụ lớp học (ảnh mẫu 5).
 *
 * Hai sub-tab:
 *  - "Điểm các Đội": thẻ đội thi đua theo LỚP đang chọn (+1/+5/−1, thêm /
 *    xoá / đổi tên đội, đặt lại điểm 0) — dữ liệu qua useClassTeams, lưu
 *    cùng object localStorage của roster.
 *  - "Bảng vàng Cá nhân": học sinh xếp hạng theo điểm roster (điểm thi
 *    đua tại lớp của đợt 1), Level theo mốc công khai, cộng/trừ nhanh
 *    ngay tại bảng.
 * "Xuất PDF" ở cả hai sub-tab = in trình duyệt qua PrintSheet (chọn
 * "Lưu thành PDF" trong hộp thoại in) — không thêm thư viện PDF.
 */

const MEDAL_BG = { 1: "#F4B942", 2: "#B8C0CC", 3: "#D08A4E" };

export default function ScoreTab({ roster, showToast }) {
  const { activeClass } = roster;
  const students = useMemo(() => activeClass?.students ?? [], [activeClass]);
  const teamsApi = useClassTeams(roster);
  const { teams } = teamsApi;
  const { askConfirm, confirmProps } = useConfirm();
  const [sub, setSub] = useState("teams"); // "teams" | "honor"
  const [renameModal, setRenameModal] = useState(null); // { id, name }
  const [query, setQuery] = useState("");
  const [printJob, setPrintJob] = useState(null);

  const classId = activeClass?.id;
  const [lastClassId, setLastClassId] = useState(classId);
  if (classId !== lastClassId) {
    setLastClassId(classId);
    setQuery("");
    setPrintJob(null);
  }

  // Bảng vàng: xếp điểm giảm dần; bằng điểm thì giữ thứ tự danh sách lớp.
  const honorRows = useMemo(
    () => students
      .map((s, idx) => ({ student: s, idx }))
      .sort((a, b) => b.student.points - a.student.points || a.idx - b.idx)
      .map((row, i) => ({ ...row, rank: i + 1 })),
    [students],
  );
  const visibleHonorRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? honorRows.filter(({ student }) => student.name.toLowerCase().includes(q)) : honorRows;
  }, [honorRows, query]);

  const submitRename = () => {
    if (!renameModal) return;
    teamsApi.renameTeam(renameModal.id, renameModal.name);
    showToast?.("Đã đổi tên đội");
    setRenameModal(null);
  };

  const handleResetTeams = () => {
    askConfirm({
      title: "Đặt lại điểm đội",
      message: "Đưa điểm của TẤT CẢ đội thi đua trong lớp này về 0?",
      confirmLabel: "Đặt lại",
      danger: false,
      onConfirm: () => { teamsApi.resetTeamPoints(); showToast?.("Đã đặt lại điểm của mọi đội về 0"); },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="bg-white rounded-3xl border border-ink/10 shadow-sm p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="font-display font-bold text-lg text-ink flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Bảng điểm &amp; Vinh danh thành tích
          </h2>
          <ClassPicker roster={roster} className="ml-auto" />
        </div>

        <div className="inline-flex self-start rounded-xl bg-ink/5 p-1">
          {[
            { key: "teams", label: "Điểm các Đội" },
            { key: "honor", label: "Bảng vàng Cá nhân" },
          ].map((t) => (
            <button key={t.key} type="button" onClick={() => setSub(t.key)}
              className={`text-sm font-display font-semibold rounded-lg px-4 py-2 transition ${sub === t.key ? "bg-emerald-600 text-white shadow-sm" : "text-ink/55 hover:text-ink"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {sub === "teams" ? (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-ink/60">Danh sách các đội thi đua</p>
              <div className="flex items-center gap-2 flex-wrap ml-auto">
                <button type="button" onClick={() => { teamsApi.addTeam(); showToast?.("Đã thêm đội mới"); }}
                  className="inline-flex items-center gap-1 text-xs font-display font-semibold rounded-xl px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] transition">
                  <Plus className="w-3.5 h-3.5" /> Thêm Đội
                </button>
                <button type="button" onClick={() => setPrintJob({ kind: "teams", teams })} disabled={teams.length === 0}
                  className="inline-flex items-center gap-1 text-xs font-display font-semibold rounded-xl px-3 py-2 bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98] transition disabled:opacity-40">
                  <Printer className="w-3.5 h-3.5" /> Xuất PDF Đội
                </button>
                <button type="button" onClick={handleResetTeams} disabled={teams.length === 0}
                  className="inline-flex items-center gap-1 text-xs font-display font-semibold rounded-xl px-3 py-2 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 active:scale-[0.98] transition disabled:opacity-40">
                  <RotateCcw className="w-3.5 h-3.5" /> Đặt lại điểm 0
                </button>
              </div>
            </div>

            {teams.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink/20 bg-paper2/60 px-4 py-10 text-center">
                <p className="font-display font-bold text-ink">Chưa có đội thi đua nào</p>
                <p className="text-sm text-ink/55 mt-1">Bấm “Thêm Đội” để tạo đội đầu tiên cho lớp này.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {teams.map((t) => {
                  const color = TEAM_COLOR_BY_ID[t.colorId];
                  return (
                    <article key={t.id} className="relative rounded-2xl border-2 px-4 pt-4 pb-4 text-center"
                      style={{ borderColor: color.border, background: color.bg }}>
                      <button type="button" title="Xoá đội"
                        onClick={() => askConfirm({
                          title: "Xoá đội",
                          message: `Xoá đội "${t.name}" khỏi bảng điểm của lớp này?`,
                          confirmLabel: "Xoá đội",
                          onConfirm: () => { teamsApi.removeTeam(t.id); showToast?.(`Đã xoá đội "${t.name}"`); },
                        })}
                        className="absolute top-2 right-2 w-6 h-6 grid place-items-center rounded-full text-ink/35 hover:text-rose-600 hover:bg-white/70 transition">
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-center justify-center gap-1.5 px-5">
                        <p className="font-display font-bold truncate" style={{ color: color.deep }}>{t.name}</p>
                        <button type="button" title="Đổi tên đội"
                          onClick={() => setRenameModal({ id: t.id, name: t.name })}
                          className="shrink-0 w-6 h-6 grid place-items-center rounded-full text-ink/40 hover:text-ink hover:bg-white/70 transition">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-display font-extrabold text-6xl leading-none my-3" style={{ color: color.deep }}>
                        {t.points}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button type="button" onClick={() => teamsApi.adjustTeamPoints(t.id, 1)}
                          className="text-sm font-bold rounded-xl px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition">+1</button>
                        <button type="button" onClick={() => teamsApi.adjustTeamPoints(t.id, 5)}
                          className="text-sm font-bold rounded-xl px-4 py-2 bg-amber-400 text-amber-950 hover:bg-amber-500 active:scale-95 transition">+5</button>
                        <button type="button" onClick={() => teamsApi.adjustTeamPoints(t.id, -1)}
                          className="text-sm font-bold rounded-xl px-4 py-2 bg-white/80 text-ink border border-ink/20 hover:bg-white active:scale-95 transition">−1</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm text-ink/60">
                Cấp độ theo điểm:{" "}
                {LEVELS.map((l, i) => (
                  <span key={l.lv} className="font-semibold text-ink/75">
                    {i > 0 && " • "}{l.label}: {l.range} điểm
                  </span>
                ))}
              </p>
              <div className="flex items-center gap-2 ml-auto">
                <div className="w-52 max-w-full">
                  <SearchInput value={query} onChange={setQuery} placeholder="Tìm tên học sinh…" />
                </div>
                <button type="button" onClick={() => setPrintJob({ kind: "honor", rows: honorRows })} disabled={students.length === 0}
                  className="inline-flex items-center gap-1 text-xs font-display font-semibold rounded-xl px-3 py-2 bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98] transition disabled:opacity-40">
                  <Printer className="w-3.5 h-3.5" /> Xuất PDF
                </button>
              </div>
            </div>

            {students.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink/20 bg-paper2/60 px-4 py-10 text-center">
                <p className="font-display font-bold text-ink">Lớp chưa có học sinh nào</p>
                <p className="text-sm text-ink/55 mt-1">Nạp danh sách lớp ở tab “Gọi tên” — điểm cộng ở đó sẽ hiện trên bảng vàng này.</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-1 px-1">
                <table className="w-full min-w-[640px] text-sm border-collapse">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-ink/45 border-b border-ink/10">
                      <th className="py-2 pr-2 font-semibold w-16 text-center">Hạng</th>
                      <th className="py-2 pr-2 font-semibold">Học sinh</th>
                      <th className="py-2 pr-2 font-semibold">Giới</th>
                      <th className="py-2 pr-2 font-semibold w-24">Cấp độ</th>
                      <th className="py-2 pr-2 font-semibold w-20 text-center">Điểm</th>
                      <th className="py-2 font-semibold w-28 text-center">Cộng / trừ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleHonorRows.map(({ student: s, rank }) => {
                      const level = levelForPoints(s.points);
                      return (
                        <tr key={s.id} className={`border-b border-ink/5 ${rank <= 3 ? "bg-amber-50/50" : ""}`}>
                          <td className="py-2 pr-2 text-center">
                            {MEDAL_BG[rank] ? (
                              <span className="inline-grid place-items-center w-8 h-8 rounded-full text-white font-display font-extrabold text-sm shadow-sm"
                                style={{ background: MEDAL_BG[rank] }}>
                                {rank}
                              </span>
                            ) : (
                              <span className="font-bold text-ink/50">{rank}</span>
                            )}
                          </td>
                          <td className="py-2 pr-2">
                            <span className="flex items-center gap-2 min-w-0">
                              <InitialAvatar name={s.name} size={28} />
                              <StudentName student={s} className="font-semibold text-ink" />
                            </span>
                          </td>
                          <td className="py-2 pr-2"><GenderBadge gender={s.gender} /></td>
                          <td className="py-2 pr-2">
                            <span className={`text-[11px] font-bold rounded-full border px-2 py-0.5 ${level.badge}`}>{level.label}</span>
                          </td>
                          <td className="py-2 pr-2 text-center font-display font-extrabold text-base text-ink">{s.points}</td>
                          <td className="py-2 text-center">
                            <span className="inline-flex items-center gap-1.5">
                              <button type="button" onClick={() => roster.adjustPoints(s.id, 1)}
                                className="text-xs font-bold rounded-lg px-2 py-1 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition">+1</button>
                              <button type="button" onClick={() => roster.adjustPoints(s.id, -1)}
                                className="text-xs font-bold rounded-lg px-2 py-1 bg-white text-ink border border-ink/20 hover:bg-ink/5 active:scale-95 transition">−1</button>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {visibleHonorRows.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-sm text-ink/45">
                          Không có học sinh nào khớp từ khoá tìm kiếm.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>

      {renameModal && (
        <Modal onClose={() => setRenameModal(null)}>
          <h3 className="font-display text-lg text-ink mb-3">Đổi tên đội</h3>
          <Input
            label="Tên đội"
            placeholder="Ví dụ: Đội Sao Vàng…"
            value={renameModal.name}
            onChange={(v) => setRenameModal((m) => ({ ...m, name: v }))}
            maxLength={40}
          />
          <div className="flex justify-end gap-2 mt-4">
            <GhostButton onClick={() => setRenameModal(null)}>Hủy</GhostButton>
            <button type="button" onClick={submitRename}
              className="font-display font-semibold rounded-2xl px-5 py-3 bg-ink text-paper hover:bg-ink2 active:scale-[0.98] transition shadow-[0_3px_0_rgba(0,0,0,0.18)]">
              Lưu tên
            </button>
          </div>
        </Modal>
      )}

      <PrintSheet job={printJob} className={activeClass?.name} onDone={() => setPrintJob(null)} />
      <ConfirmModal {...confirmProps} />
    </div>
  );
}
