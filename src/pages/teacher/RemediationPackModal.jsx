// pages/teacher/RemediationPackModal.jsx
//
// Hộp xác nhận "Tạo gói ôn tập 1 chạm" (Đợt 2 — Gói can thiệp) mở từ
// trang Bản đồ nhiệt điểm mù. Trước khi tạo, modal gọi
// GET /api/remediation/preview để giáo viên thấy TRƯỚC: chủ đề, nhóm học
// sinh đã chọn, và có bao nhiêu câu CƠ BẢN cùng chủ đề trong ngân hàng sẽ
// được trích vào gói. Chủ đề không có câu cơ bản nào → cảnh báo rõ và
// KHOÁ nút tạo (server cũng từ chối — không tạo gói rỗng).
// Tạo thành công → onCreated(result) để trang cha báo toast + hiện link
// mở bài; lỗi tạo → hiện ngay trong modal, không đóng modal.

import { useEffect, useState } from "react";
import { AlertTriangle, PackagePlus } from "lucide-react";
import { Loader, Modal } from "../../components/ui";
import { remediationService } from "../../services/api.js";

export default function RemediationPackModal({ classId, topic, students, onClose, onCreated }) {
  const [preview, setPreview] = useState(null);
  const [previewError, setPreviewError] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    let cancelled = false;
    remediationService
      .preview(classId, topic)
      .then((d) => { if (!cancelled) setPreview(d); })
      .catch((e) => { if (!cancelled) setPreviewError(e?.message || "Không tải được số câu hỏi của chủ đề."); });
    return () => { cancelled = true; };
  }, [classId, topic]);

  const noQuestions = !!preview && preview.willUse === 0;

  const create = async () => {
    setCreating(true);
    setCreateError("");
    try {
      const result = await remediationService.createPack({
        classId,
        topic,
        studentIds: students.map((s) => s.id),
      });
      onCreated(result);
    } catch (e) {
      setCreateError(e?.message || "Không tạo được gói ôn tập.");
      setCreating(false);
    }
  };

  return (
    <Modal onClose={creating ? undefined : onClose} dismissible={!creating}>
      <div className="flex flex-col gap-4">
        <h2 className="font-display font-bold text-xl text-ink flex items-center gap-2">
          <span className="w-9 h-9 grid place-items-center rounded-xl bg-rose-600 text-white">
            <PackagePlus className="w-5 h-5" />
          </span>
          Tạo gói ôn tập 1 chạm
        </h2>

        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex gap-2">
            <dt className="text-ink-soft shrink-0">Chủ đề:</dt>
            <dd className="font-semibold text-ink">{topic}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-soft shrink-0">Học sinh ({students.length}):</dt>
            <dd className="text-ink">{students.map((s) => s.name).join(", ")}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-soft shrink-0">Câu hỏi:</dt>
            <dd className="text-ink">
              {previewError ? (
                <span className="text-rose-700">{previewError}</span>
              ) : !preview ? (
                "Đang đếm câu cơ bản cùng chủ đề…"
              ) : preview.totalFound === 0 ? (
                "Không tìm thấy câu cơ bản nào"
              ) : (
                <>
                  Sẽ trích <strong>{preview.willUse}</strong> câu cơ bản cùng chủ đề
                  {preview.totalFound > preview.willUse
                    ? ` (ngân hàng có ${preview.totalFound} câu, gói lấy tối đa ${preview.willUse})`
                    : ""}
                </>
              )}
            </dd>
          </div>
        </dl>

        {preview && preview.questions.length > 0 && (
          <ul className="flex flex-col gap-1 rounded-xl border border-line bg-panel px-3 py-2 text-sm text-ink-soft max-h-40 overflow-y-auto">
            {preview.questions.map((q) => (
              <li key={q.id} className="truncate">• {q.content || "(không có nội dung)"}</li>
            ))}
          </ul>
        )}

        {noQuestions && (
          <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            Ngân hàng chưa có câu hỏi cơ bản (độ khó dễ) nào cho chủ đề này nên chưa tạo được gói.
            Hãy thêm câu hỏi cơ bản cho chủ đề này trong Ngân hàng câu hỏi rồi thử lại.
          </p>
        )}

        <p className="text-sm text-ink-soft">
          Gói sẽ được giao đích danh cho nhóm học sinh trên (làm lại tự do, không hạn nộp),
          kèm thông báo ngay và nhắc ôn lại sau 3 ngày và 7 ngày.
        </p>

        {createError && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{createError}</p>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-slate-50 disabled:opacity-50"
            onClick={onClose}
            disabled={creating}
          >
            Huỷ
          </button>
          <button
            type="button"
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 inline-flex items-center gap-2"
            onClick={create}
            disabled={creating || !preview || noQuestions}
          >
            {creating ? <Loader /> : null}
            {creating ? "Đang tạo gói…" : "Tạo gói ôn tập"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
