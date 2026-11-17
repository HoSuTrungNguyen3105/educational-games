import { useMemo, useState } from "react";
import { Check, Eraser, Pin, Shuffle, Users } from "lucide-react";
import { ConfirmModal, SearchInput, Select, ToggleSwitch } from "../../../components/ui";
import { useConfirm } from "../../../hooks/useConfirm.js";
import { useClassGroups, MAX_GROUPS, MIN_GROUPS } from "../../../hooks/useClassGroups.js";
import { ClassPicker, GenderBadge, InitialAvatar, RoleBadge, StudentName } from "./shared.jsx";
import { ROLES, groupColor } from "./shared.js";

/**
 * GroupsTab — tab "Chia nhóm" của trang Công cụ lớp học (ảnh mẫu 3).
 *
 * Trên: hàng thẻ nhóm (sĩ số, cơ cấu nam/nữ, thành viên + badge vai trò).
 * Dưới: bảng toàn bộ học sinh để tinh chỉnh tay — bật/tắt tham gia, gán
 * vai trò bằng vòng tròn (mỗi nhóm ≤1 người/vai trò, mỗi bạn ≤1 vai trò),
 * đổi nhóm, ghim nhóm cho các lượt chia ngẫu nhiên sau.
 *
 * Tab này KHÔNG đặt RosterPanel: bảng toàn bộ học sinh ở đây đã bao đủ
 * thông tin; danh sách lớp vẫn là roster dùng chung của trang (nạp/sửa ở
 * tab Gọi tên). Trạng thái nhóm lưu theo từng lớp qua useClassGroups.
 */

const FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "male", label: "Nam" },
  { key: "female", label: "Nữ" },
  { key: "star", label: "Đặc biệt" },
  { key: "unassigned", label: "Chưa có nhóm" },
];

const cellSelectClass = "w-full rounded-lg border border-ink/15 bg-paper px-2 py-1.5 text-xs font-body outline-none";

export default function GroupsTab({ roster, showToast }) {
  const { activeClass } = roster;
  const students = useMemo(() => activeClass?.students ?? [], [activeClass]);
  const groupsApi = useClassGroups(roster);
  const { groups } = groupsApi;
  const { askConfirm, confirmProps } = useConfirm();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Đổi lớp → xoá tìm kiếm/lọc (pattern chỉnh state trong render như đợt 1).
  const classId = activeClass?.id;
  const [lastClassId, setLastClassId] = useState(classId);
  if (classId !== lastClassId) {
    setLastClassId(classId);
    setQuery("");
    setFilter("all");
  }

  const { groupCount, assignments, roles, pinned, excluded } = groups;
  const participating = useMemo(() => students.filter((s) => !excluded[s.id]), [students, excluded]);
  const membersByGroup = useMemo(
    () => Array.from({ length: groupCount }, (_, gi) => students.filter((s) => assignments[s.id] === gi)),
    [students, assignments, groupCount],
  );
  const roleSummary = useMemo(
    () => ROLES.map((r) => ({
      ...r,
      count: membersByGroup.filter((members) => members.some((s) => roles[s.id] === r.id)).length,
    })),
    [membersByGroup, roles],
  );
  const hasAnyRole = Object.keys(roles).length > 0;

  const visibleStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students
      .map((s, idx) => ({ s, idx }))
      .filter(({ s }) => {
        if (filter === "male" && s.gender !== "male") return false;
        if (filter === "female" && s.gender !== "female") return false;
        if (filter === "star" && !s.star) return false;
        if (filter === "unassigned" && assignments[s.id] !== undefined) return false;
        if (q && !s.name.toLowerCase().includes(q)) return false;
        return true;
      });
  }, [students, query, filter, assignments]);

  const groupOptions = [
    { value: "", label: "—" },
    ...Array.from({ length: groupCount }, (_, gi) => ({ value: String(gi), label: `Nhóm ${gi + 1}` })),
  ];
  const pinOptions = [
    { value: "", label: "Không ghim" },
    ...Array.from({ length: groupCount }, (_, gi) => ({ value: String(gi), label: `Nhóm ${gi + 1}` })),
  ];

  const handleRandomize = () => {
    groupsApi.randomizeGroups();
    showToast?.(`Đã chia ${participating.length} học sinh vào ${groupCount} nhóm`);
  };

  const handleAssignRoles = () => {
    groupsApi.assignRoles();
    showToast?.("Đã giao vai trò ngẫu nhiên cho các nhóm");
  };

  const handleClearRoles = () => {
    askConfirm({
      title: "Bỏ hết vai trò",
      message: "Xoá vai trò của toàn bộ học sinh trong lớp này?",
      confirmLabel: "Bỏ hết",
      onConfirm: () => { groupsApi.clearRoles(); showToast?.("Đã xoá mọi vai trò"); },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="bg-white rounded-3xl border border-ink/10 shadow-sm p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-center gap-x-4 gap-y-3 flex-wrap">
          <ClassPicker roster={roster} />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink/60">Số nhóm:</span>
            <div className="w-24">
              <Select
                value={String(groupCount)}
                onChange={(v) => groupsApi.setGroupCount(Number(v))}
                options={Array.from({ length: MAX_GROUPS - MIN_GROUPS + 1 }, (_, i) => ({
                  value: String(MIN_GROUPS + i),
                  label: `${MIN_GROUPS + i} nhóm`,
                }))}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            <button type="button" onClick={handleRandomize} disabled={participating.length === 0}
              className="inline-flex items-center gap-1.5 font-display font-semibold text-sm rounded-2xl px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] transition disabled:opacity-40 shadow-[0_3px_0_rgba(0,0,0,0.18)]">
              <Shuffle className="w-4 h-4" /> Chia nhóm ngẫu nhiên
            </button>
            <button type="button" onClick={handleAssignRoles} disabled={participating.length === 0}
              className="inline-flex items-center gap-1.5 font-display font-semibold text-sm rounded-2xl px-4 py-2.5 bg-white text-ink border border-ink/20 hover:bg-ink/5 active:scale-[0.98] transition disabled:opacity-40">
              <Users className="w-4 h-4" /> Giao vai trò ngẫu nhiên
            </button>
            <button type="button" onClick={handleClearRoles} disabled={!hasAnyRole}
              className="inline-flex items-center gap-1.5 font-display font-semibold text-sm rounded-2xl px-4 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 active:scale-[0.98] transition disabled:opacity-40">
              <Eraser className="w-4 h-4" /> Bỏ hết vai trò
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="font-semibold text-ink/50 mr-1">Vai trò đã giao:</span>
          {roleSummary.map((r) => (
            <span key={r.id} className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper2 px-2.5 py-1 font-semibold text-ink/70">
              <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
              {r.label} {r.count}/{groupCount}
            </span>
          ))}
        </div>

        {students.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/20 bg-paper2/60 px-4 py-10 text-center">
            <p className="font-display font-bold text-ink">Lớp chưa có học sinh nào</p>
            <p className="text-sm text-ink/55 mt-1">Nạp danh sách lớp ở tab “Gọi tên” (panel Danh sách lớp) rồi quay lại đây để chia nhóm.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {membersByGroup.map((members, gi) => {
              const color = groupColor(gi);
              const male = members.filter((s) => s.gender === "male").length;
              const female = members.filter((s) => s.gender === "female").length;
              return (
                <article key={gi} className="rounded-2xl border-2 overflow-hidden flex flex-col" style={{ borderColor: color.border, background: "#fff" }}>
                  <header className="px-3 py-2.5 flex items-center gap-2" style={{ background: color.bg }}>
                    <span className="w-7 h-7 grid place-items-center rounded-full text-white font-display font-bold text-sm shrink-0" style={{ background: color.border }}>
                      {gi + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-display font-bold text-ink leading-tight">Nhóm {gi + 1}</p>
                      <p className="text-[11px] font-semibold" style={{ color: color.deep }}>
                        {members.length} bạn{members.length ? ` • ${male} nam • ${female} nữ` : ""}
                      </p>
                    </div>
                  </header>
                  {members.length === 0 ? (
                    <p className="px-3 py-3 text-xs text-ink/40">Chưa có thành viên</p>
                  ) : (
                    <ul className="px-2 py-2 flex flex-col gap-1">
                      {members.map((s) => (
                        <li key={s.id} className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-ink/[0.03]">
                          <InitialAvatar name={s.name} size={28} />
                          <StudentName student={s} className="flex-1 text-[13px] font-semibold text-ink" />
                          <RoleBadge roleId={roles[s.id]} />
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {students.length > 0 && (
        <section className="bg-white rounded-3xl border border-ink/10 shadow-sm p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-display font-bold text-ink">
              Danh sách toàn bộ học sinh {participating.length}/{students.length}
            </h3>
            <div className="w-56 max-w-full">
              <SearchInput value={query} onChange={setQuery} placeholder="Tìm tên học sinh…" />
            </div>
            <div className="inline-flex rounded-full bg-ink/5 p-1 ml-auto">
              {FILTERS.map((f) => (
                <button key={f.key} type="button" onClick={() => setFilter(f.key)}
                  className={`text-xs font-display font-semibold rounded-full px-3 py-1.5 transition ${filter === f.key ? "bg-white text-ink shadow-sm" : "text-ink/50 hover:text-ink"}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-ink/50 leading-relaxed">
            Bấm vào vòng tròn để giao vai trò — mỗi bạn chỉ giữ một vai trò, mỗi nhóm tối đa một người cho mỗi vai trò
            (giao trùng thì bạn giữ trước sẽ nhường). Bấm lại vào vai trò đang giữ để bỏ.
            Chọn nhóm ở cột Ghim <Pin className="inline w-3 h-3 -mt-0.5" /> để các lượt chia ngẫu nhiên sau luôn giữ bạn đó ở nhóm đã ghim.
          </p>

          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full min-w-[1060px] text-sm border-collapse">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-ink/45 border-b border-ink/10">
                  <th className="py-2 pr-2 font-semibold">Tham gia</th>
                  <th className="py-2 pr-2 font-semibold w-10">STT</th>
                  <th className="py-2 pr-2 font-semibold">Họ và tên</th>
                  <th className="py-2 pr-2 font-semibold">Giới</th>
                  {ROLES.map((r) => (
                    <th key={r.id} className="py-2 px-1 font-semibold text-center w-[74px]">
                      <span className="inline-flex items-center gap-1 normal-case tracking-normal text-[11px]" style={{ color: r.color }}>
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                        {r.label}
                      </span>
                    </th>
                  ))}
                  <th className="py-2 px-2 font-semibold text-center w-14">Điểm</th>
                  <th className="py-2 px-1 font-semibold w-[104px]">Nhóm</th>
                  <th className="py-2 pl-1 font-semibold w-[128px]">Ghim</th>
                </tr>
              </thead>
              <tbody>
                {visibleStudents.map(({ s, idx }) => {
                  const gi = assignments[s.id];
                  const isOut = Boolean(excluded[s.id]);
                  return (
                    <tr key={s.id} className={`border-b border-ink/5 ${isOut ? "opacity-45" : ""}`}>
                      <td className="py-1.5 pr-2">
                        <ToggleSwitch checked={!isOut} onChange={(v) => groupsApi.setExcluded(s.id, !v)} />
                      </td>
                      <td className="py-1.5 pr-2 text-ink/45 font-semibold text-xs">{idx + 1}</td>
                      <td className="py-1.5 pr-2">
                        <span className="flex items-center gap-2 min-w-0">
                          <InitialAvatar name={s.name} size={26} />
                          <StudentName student={s} className="font-semibold text-ink text-[13px]" />
                        </span>
                      </td>
                      <td className="py-1.5 pr-2"><GenderBadge gender={s.gender} /></td>
                      {ROLES.map((r) => {
                        const held = roles[s.id] === r.id;
                        return (
                          <td key={r.id} className="py-1.5 px-1 text-center">
                            <button type="button" disabled={gi === undefined}
                              onClick={() => groupsApi.toggleRole(s.id, r.id)}
                              title={gi === undefined ? "Bạn này chưa có nhóm" : held ? `Bỏ vai trò ${r.label}` : `Giao vai trò ${r.label}`}
                              className="w-7 h-7 rounded-full inline-grid place-items-center border-2 transition active:scale-90 disabled:opacity-30"
                              style={held
                                ? { background: r.color, borderColor: r.color }
                                : { borderColor: `${r.color}59`, background: "transparent" }}>
                              {held && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                            </button>
                          </td>
                        );
                      })}
                      <td className="py-1.5 px-2 text-center font-bold text-ink">{s.points}</td>
                      <td className="py-1.5 px-1">
                        <Select className={cellSelectClass} value={gi === undefined ? "" : String(gi)}
                          onChange={(v) => groupsApi.moveStudent(s.id, v === "" ? null : Number(v))}
                          options={groupOptions} disabled={isOut} />
                      </td>
                      <td className="py-1.5 pl-1">
                        <Select className={cellSelectClass} value={pinned[s.id] === undefined ? "" : String(pinned[s.id])}
                          onChange={(v) => groupsApi.setPinned(s.id, v === "" ? null : Number(v))}
                          options={pinOptions} disabled={isOut} />
                      </td>
                    </tr>
                  );
                })}
                {visibleStudents.length === 0 && (
                  <tr>
                    <td colSpan={6 + ROLES.length} className="py-8 text-center text-sm text-ink/45">
                      Không có học sinh nào khớp bộ lọc / từ khoá tìm kiếm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
