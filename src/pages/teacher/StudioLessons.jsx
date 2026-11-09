import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, Copy, Link2, Pencil, Trash2 } from "lucide-react";
import { navigate } from "../../lib/router.js";
import { lessonService } from "../../services/lessonService.js";
import { matchesQuery } from "../../lib/searchText.js";
import { useConfirm } from "../../hooks/useConfirm.js";
import {
  ConfirmModal, FormModal, GridCard, IconButton, ManagementHeader, ManagementTable,
} from "../../components/ui";
import LessonProgressModal from "./studio/LessonProgressModal.jsx";
import "./studio/studio.css";

// StudioLessons — danh sách bài học của giáo viên tại /dashboard/studio,
// dùng đúng kit lưới dùng chung (ManagementTable + GridCard + usePagedList
// bên trong ManagementTable) như các trang quản lý khác. Tạo mới xong vào
// thẳng editor; nhân bản ghép từ GET (bản đầy đủ) + POST tạo mới vì API
// không có endpoint clone riêng.

const CREATE_FIELDS = [
  { name: "title", label: "Tên bài học", placeholder: "VD: Bảng nhân 4 — Toán lớp 3" },
  { name: "subject", label: "Môn học", placeholder: "VD: Toán" },
  {
    name: "grade", label: "Lớp", type: "select",
    options: [
      { value: "", label: "Chưa phân lớp" },
      ...[1, 2, 3, 4, 5].map((g) => ({ value: String(g), label: `Lớp ${g}` })),
    ],
  },
];

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

function StatusBadge({ status }) {
  return status === "published"
    ? <span className="edu-grid-badge edu-grid-badge--mint">Đã xuất bản</span>
    : <span className="edu-grid-badge edu-grid-badge--gold">Nháp</span>;
}

export default function StudioLessons({ showToast }) {
  const [lessons, setLessons] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "", grade: "" });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [progressLesson, setProgressLesson] = useState(null);
  const { askConfirm, confirmProps } = useConfirm();

  // Link học sinh vào thẳng bài (#/lessons/:id) — chỉ có ý nghĩa khi bài
  // đã xuất bản (học sinh phải đăng nhập, xem LessonListPage/LessonPlayPage).
  const copyLink = async (item) => {
    const url = `${window.location.origin}${window.location.pathname}#/lessons/${item.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast?.("Đã sao chép link bài học — gửi link này cho học sinh", "success");
    } catch {
      showToast?.(`Link bài học: ${url}`, "success");
    }
  };

  const load = useCallback(async () => {
    try {
      const res = await lessonService.listMine({ perPage: 100 });
      setLessons(res?.data || []);
      setError("");
    } catch (e) {
      setError(e?.message || "Không tải được danh sách bài học");
    }
  }, []);

  // Nạp dữ liệu khi mở trang — pattern chuẩn của khu dashboard (như
  // ImageLibrary/useCrudList); rule set-state-in-effect của bộ lint hiện
  // tại bắt cả pattern này ở code cũ nên tắt riêng cho dòng này.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!lessons) return lessons;
    return lessons.filter((l) =>
      (statusFilter === "all" || l.status === statusFilter) &&
      matchesQuery(query, l.title, l.subject));
  }, [lessons, query, statusFilter]);

  const submitCreate = async () => {
    if (!form.title.trim()) { setCreateError("Vui lòng nhập tên bài học"); return; }
    setCreating(true);
    setCreateError("");
    try {
      const lesson = await lessonService.create({
        title: form.title.trim(),
        subject: form.subject.trim(),
        grade: form.grade === "" ? null : Number(form.grade),
        pages: [{ id: `page-${Math.random().toString(36).slice(2, 9)}`, title: "Trang 1", elements: [] }],
      });
      setCreateOpen(false);
      setForm({ title: "", subject: "", grade: "" });
      showToast?.("Đã tạo bài học", "success");
      navigate(`/dashboard/studio/${lesson.id}`);
    } catch (e) {
      setCreateError(e?.message || "Tạo bài học thất bại");
    } finally { setCreating(false); }
  };

  const duplicate = async (item) => {
    setBusyId(item.id);
    try {
      const full = await lessonService.get(item.id);
      const created = await lessonService.create({
        title: `${full.title || "Bài học"} (bản sao)`.slice(0, 200),
        subject: full.subject || "",
        grade: full.grade ?? null,
        description: full.description || "",
        objectives: full.objectives || "",
        pages: full.pages || [],
      });
      showToast?.("Đã nhân bản bài học", "success");
      await load();
      return created;
    } catch (e) {
      showToast?.(e?.message || "Nhân bản thất bại", "error");
    } finally { setBusyId(null); }
  };

  const askRemove = (item) => {
    askConfirm({
      title: "Xoá bài học",
      message: `Xoá bài học "${item.title || "(chưa có tên)"}"? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        try {
          await lessonService.remove(item.id);
          showToast?.("Đã xoá bài học", "success");
          load();
        } catch (e) {
          showToast?.(e?.message || "Xoá thất bại", "error");
        }
      },
    });
  };

  return (
    <div>
      <ManagementHeader title="AI Studio" subtitle="Soạn bài học tương tác: trang, câu hỏi và game — xuất bản cho học sinh học ngay trong EduPlay">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="note-card px-3 py-2 text-sm border-ink/10 bg-paper2">
          <option value="all">Tất cả trạng thái</option>
          <option value="draft">Bản nháp</option>
          <option value="published">Đã xuất bản</option>
        </select>
      </ManagementHeader>

      <ManagementTable
        viewKey="studio-lessons"
        data={lessons ? filtered : lessons}
        error={error && !lessons ? error : null}
        onRetry={load}
        emptyLabel={query || statusFilter !== "all"
          ? "Không có bài học nào khớp bộ lọc."
          : "Chưa có bài học nào — bấm “Bài học mới” để soạn bài đầu tiên."}
        onCreate={() => { setCreateError(""); setCreateOpen(true); }}
        addLabel="Bài học mới"
        search={{ value: query, onChange: setQuery, placeholder: "Tìm bài học, môn học…" }}
        headers={["Tên bài học", "Môn", "Lớp", "Trạng thái", "Trang", "Cập nhật", ""]}
        renderGridCard={(lesson) => (
          <GridCard
            key={lesson.id}
            title={lesson.title || "(Chưa có tên)"}
            badge={lesson.status === "published"
              ? { label: "Đã xuất bản", tone: "mint" }
              : { label: "Nháp", tone: "gold" }}
            mono={lesson.subject || undefined}
            description={lesson.description || undefined}
            media={lesson.coverImage
              ? <img src={lesson.coverImage} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0 border border-ink/10" />
              : undefined}
            extra={lesson.status === "published" ? (
              <button type="button" onClick={() => copyLink(lesson)}
                className="mt-1 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#2F6FED] hover:underline">
                <Link2 className="w-3.5 h-3.5" /> Sao chép link cho học sinh
              </button>
            ) : undefined}
            meta={`${lesson.pageCount} trang · ${lesson.elementCount} phần tử · Cập nhật ${fmtDate(lesson.updatedAt)}`}
            footerActions={[
              { label: "Soạn bài", icon: <Pencil />, onClick: () => navigate(`/dashboard/studio/${lesson.id}`), tone: "blue" },
              { label: "Tiến độ", icon: <BarChart3 />, onClick: () => setProgressLesson(lesson), tone: "muted" },
              { label: busyId === lesson.id ? "Đang sao…" : "Nhân bản", icon: <Copy />, onClick: () => duplicate(lesson), tone: "muted" },
              { label: "Xoá", icon: <Trash2 />, onClick: () => askRemove(lesson), tone: "red" },
            ]}
          />
        )}
        renderRow={(lesson) => (
          <tr key={lesson.id} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3 font-body font-semibold text-ink">{lesson.title || "(Chưa có tên)"}</td>
            <td className="px-5 py-3 font-body text-ink">{lesson.subject || "—"}</td>
            <td className="px-5 py-3 font-body text-ink">{lesson.grade ? `Lớp ${lesson.grade}` : "—"}</td>
            <td className="px-5 py-3"><StatusBadge status={lesson.status} /></td>
            <td className="px-5 py-3 font-body text-ink">{lesson.pageCount}</td>
            <td className="px-5 py-3 font-body text-ink">{fmtDate(lesson.updatedAt)}</td>
            <td className="px-5 py-3">
              <div className="flex items-center justify-end gap-2">
                <IconButton title="Soạn bài" onClick={() => navigate(`/dashboard/studio/${lesson.id}`)}><Pencil /></IconButton>
                <IconButton title="Tiến độ học sinh" onClick={() => setProgressLesson(lesson)}><BarChart3 /></IconButton>
                {lesson.status === "published" && (
                  <IconButton title="Sao chép link cho học sinh" onClick={() => copyLink(lesson)}><Link2 /></IconButton>
                )}
                <IconButton title="Nhân bản" onClick={() => duplicate(lesson)}><Copy /></IconButton>
                <IconButton title="Xoá" tone="danger" onClick={() => askRemove(lesson)}><Trash2 /></IconButton>
              </div>
            </td>
          </tr>
        )}
      />

      <FormModal
        open={createOpen}
        title="bài học"
        fields={CREATE_FIELDS}
        values={form}
        onChange={(name, value) => setForm((f) => ({ ...f, [name]: value }))}
        onSubmit={submitCreate}
        onClose={() => setCreateOpen(false)}
        error={createError}
        saving={creating}
      />

      {progressLesson && (
        <LessonProgressModal lesson={progressLesson} onClose={() => setProgressLesson(null)} />
      )}

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
