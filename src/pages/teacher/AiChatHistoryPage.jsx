// pages/teacher/AiChatHistoryPage.jsx
//
// Trang "Lịch sử hỏi AI" — CHỈ admin: xem MỌI lượt hỏi–đáp AI của mọi
// người dùng (server ghi ngầm sau mỗi lượt chat thành công, xem
// aiChatLogService phía Backend). Lọc theo từ khoá trong câu hỏi, username,
// vai trò, loại lượt và khoảng ngày; bấm vào một dòng để xem toàn văn câu
// hỏi + câu trả lời + nguồn bài học. Nút "Xóa theo bộ lọc" dọn lịch sử
// đúng phạm vi đang lọc (server bắt buộc có điều kiện ngày hoặc userId và
// ghi audit cho mỗi lần xóa).
//
// Bố cục + phân trang theo mẫu mục Nhật ký trong AdminSettings (bộ UI dùng
// chung: Input/Select/GhostButton/PrimaryButton/ConfirmModal/EmptyState).

import { useCallback, useEffect, useState } from "react";
import { History, RefreshCw, Search, Trash2 } from "lucide-react";
import {
  ConfirmModal, EmptyState, GhostButton, Input, Loader, Modal, PrimaryButton, Select,
} from "../../components/ui";
import AiMarkdown from "../../components/ai/AiMarkdown.jsx";
import { deleteChatLogs, listChatLogs } from "../../services/aiApi.js";
import { getRoleLabel } from "../../config/roles.js";

const PAGE_SIZE = 20;

const ROLE_OPTIONS = [
  { value: "", label: "Mọi vai trò" },
  { value: "student", label: "Học sinh" },
  { value: "teacher", label: "Giáo viên" },
  { value: "admin", label: "Quản trị" },
];
const KIND_OPTIONS = [
  { value: "", label: "Mọi loại lượt" },
  { value: "chat", label: "Chat thường" },
  { value: "admin_query", label: "Tra cứu quản trị" },
];

/** ISO → "HH:mm DD/MM/YYYY" (giờ máy người xem). */
function fmtTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())} ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function roleLabel(role) {
  return role ? getRoleLabel(role) : "—";
}

export default function AiChatHistoryPage({ showToast }) {
  const [q, setQ] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [kind, setKind] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Bộ lọc ĐÃ ÁP DỤNG (chỉ đổi khi bấm Tìm/Làm mới) — nút xóa dùng đúng bộ
  // này để phạm vi xóa khớp những gì đang hiển thị.
  const [applied, setApplied] = useState({ q: "", username: "", role: "", kind: "", from: "", to: "" });

  const load = useCallback(async (targetPage, filters) => {
    setLoading(true);
    setError(null);
    try {
      const r = await listChatLogs({ ...filters, page: targetPage, limit: PAGE_SIZE });
      setData(r);
      setPage(r.page || targetPage);
    } catch (e) {
      setError(e?.message || "Không đọc được lịch sử hỏi AI.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Nạp trang đầu khi mở — load() tự setState bất đồng bộ sau await.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(1, applied); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyFilters = () => {
    const f = {
      q: q.trim(), username: username.trim(), role, kind,
      from, to,
    };
    setApplied(f);
    load(1, f);
  };

  const canDelete = Boolean(applied.from || applied.to);
  const deleteHint = canDelete
    ? `Xóa toàn bộ lịch sử khớp bộ lọc hiện tại${applied.from ? ` từ ${applied.from}` : ""}${applied.to ? ` đến ${applied.to}` : ""}.`
    : "Chọn ít nhất Từ ngày hoặc Đến ngày trong bộ lọc rồi bấm Tìm để bật nút xóa (tránh xóa nhầm toàn bộ).";

  async function doDelete() {
    setDeleting(true);
    try {
      const r = await deleteChatLogs(applied);
      setConfirmDelete(false);
      setSelected(null);
      showToast?.(`Đã xóa ${r.deleted} bản ghi lịch sử hỏi AI`);
      await load(1, applied);
    } catch (e) {
      setConfirmDelete(false);
      showToast?.(e?.message || "Không xóa được lịch sử hỏi AI", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-24">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-ink flex items-center gap-2">
          <History className="w-6 h-6 text-teal" />
          Lịch sử hỏi AI
        </h1>
        <p className="text-sm text-[#8A7C63] mt-1">
          Mọi lượt hỏi Trợ lý AI của mọi người dùng, mới nhất trước. Chỉ quản trị viên xem được trang này.
        </p>
      </div>

      <section className="note-card p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="font-display text-base text-ink">Bộ lọc</h2>
          <div className="flex gap-2 shrink-0">
            <GhostButton onClick={() => load(1, applied)} disabled={loading} className="!px-3 !py-1.5 text-xs rounded-lg">
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />Làm mới
            </GhostButton>
            <button
              onClick={() => canDelete && setConfirmDelete(true)}
              disabled={!canDelete || deleting}
              title={deleteHint}
              className="font-display font-semibold rounded-lg px-3 py-1.5 text-xs bg-ticket text-white hover:bg-ticket/90 disabled:opacity-40 disabled:cursor-not-allowed transition inline-flex items-center"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />Xóa theo bộ lọc
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <Input value={q} onChange={setQ} placeholder="Từ khoá trong câu hỏi…" />
          <Input value={username} onChange={setUsername} placeholder="Tên đăng nhập…" />
          <Select value={role} onChange={setRole} options={ROLE_OPTIONS} />
          <Select value={kind} onChange={setKind} options={KIND_OPTIONS} />
          <Input type="date" value={from} onChange={setFrom} />
          <Input type="date" value={to} onChange={setTo} />
          <PrimaryButton onClick={applyFilters} disabled={loading} className="!px-4 !py-2 text-sm rounded-lg">
            <Search className="w-4 h-4 mr-1.5" />Tìm
          </PrimaryButton>
        </div>
        <p className="text-[11px] text-[#8A7C63] mt-2">{deleteHint}</p>

        {error && (
          <div className="mt-3 rounded-xl bg-ticket/10 border border-ticket/20 px-3 py-2">
            <p className="text-xs text-ticket break-words">{error}</p>
          </div>
        )}

        <div className="mt-4">
          {loading && !data ? (
            <div className="py-8 flex items-center justify-center"><Loader label="Đang đọc lịch sử…" /></div>
          ) : !data?.items?.length ? (
            <EmptyState
              icon={<History />}
              title="Chưa có lượt hỏi nào phù hợp"
              subtitle="Lịch sử được ghi sau mỗi lượt chat AI thành công. Đổi bộ lọc hoặc bấm Làm mới."
            />
          ) : (
            <>
              <ul className="divide-y divide-ink/10">
                {data.items.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(r)}
                      className="w-full text-left py-2.5 flex items-start gap-3 min-h-[44px] hover:bg-paper2/60 rounded-lg px-2 -mx-2 transition"
                    >
                      <span
                        className={`mt-0.5 shrink-0 text-[11px] font-display font-semibold rounded-full px-2 py-0.5 ${
                          r.kind === "admin_query" ? "bg-gold/25 text-ink" : "bg-teal/15 text-ink"
                        }`}
                      >
                        {r.kind === "admin_query" ? "Tra cứu quản trị" : "Chat thường"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-ink truncate">{r.question}</span>
                        <span className="block text-[11px] text-[#8A7C63] truncate">
                          {r.username || r.userId} · {roleLabel(r.role)}
                          {r.grade ? ` · Lớp ${r.grade}` : ""}
                        </span>
                      </span>
                      <span className="text-[11px] text-[#B7A987] shrink-0 font-mono">{fmtTime(r.createdAt)}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between gap-3 mt-3 text-xs">
                <span className="text-[#8A7C63]">
                  {data.total} bản ghi · trang {data.page}/{data.totalPages}
                </span>
                <div className="flex gap-2">
                  <GhostButton disabled={page <= 1 || loading} onClick={() => load(page - 1, applied)}
                    className="!px-3 !py-1.5 text-xs rounded-lg">Trước</GhostButton>
                  <GhostButton disabled={page >= (data.totalPages || 1) || loading} onClick={() => load(page + 1, applied)}
                    className="!px-3 !py-1.5 text-xs rounded-lg">Sau</GhostButton>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="max-h-[75vh] overflow-y-auto overscroll-contain pr-1">
            <h3 className="font-display text-lg text-ink mb-1">Chi tiết lượt hỏi</h3>
            <p className="text-[11px] text-[#8A7C63] mb-3">
              {selected.username || selected.userId} · {roleLabel(selected.role)}
              {selected.grade ? ` · Lớp ${selected.grade}` : ""} · {fmtTime(selected.createdAt)} ·{" "}
              {selected.kind === "admin_query" ? "Tra cứu quản trị" : "Chat thường"}
              {selected.queryType ? ` (${selected.queryType})` : ""}
            </p>
            <p className="text-[11px] font-mono uppercase text-[#8A7C63] mb-1">Câu hỏi</p>
            <div className="rounded-xl bg-paper2 border border-ink/10 px-3 py-2 text-sm text-ink whitespace-pre-wrap break-words mb-3">
              {selected.question}
            </div>
            <p className="text-[11px] font-mono uppercase text-[#8A7C63] mb-1">Câu trả lời của AI</p>
            <div className="rounded-xl bg-paper2 border border-ink/10 px-3 py-2 text-sm text-ink break-words">
              <AiMarkdown>{selected.answer}</AiMarkdown>
            </div>
            {selected.sources?.length > 0 && (
              <p className="text-[11px] text-[#8A7C63] mt-3">
                Nguồn bài học: {selected.sources.join(" · ")}
              </p>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <GhostButton onClick={() => setSelected(null)}>Đóng</GhostButton>
          </div>
        </Modal>
      )}

      <ConfirmModal
        open={confirmDelete}
        title="Xóa lịch sử hỏi AI theo bộ lọc?"
        message={`${deleteHint} Thao tác này không khôi phục được và sẽ được ghi vào nhật ký quản trị.`}
        confirmLabel={deleting ? "Đang xóa…" : "Xóa lịch sử"}
        danger
        onConfirm={doDelete}
        onClose={() => !deleting && setConfirmDelete(false)}
      />
    </div>
  );
}
