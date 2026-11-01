// SupportRequestWidget.jsx — nút "Hỗ trợ" nổi ở trang chủ + modal gửi ticket.
//
// Nút nằm ngay trên nút AI Bạn Học (AiChatWidget) cùng cột phải:
//   mobile   : bottom-[150px] (nút AI ở bottom-24 = 96px, cao 48px)
//   desktop  : lg:bottom-[84px] (nút AI ở lg:bottom-6 = 24px, cao 48px)
// Chưa đăng nhập → bấm nút mở hộp đăng nhập thay vì form gửi ticket (API đòi
// token để ghi người gửi). Modal đồng bộ lên URL ?m=supportRequest qua
// useModalParam — dán link / reload thì form tự mở lại.
import { useEffect, useState } from "react";
import { supportService } from "../../services/api.js";
import { useModalParam } from "../../hooks/useModalParam.js";
import { GhostButton, IconClose, Modal, PrimaryButton, Select } from "../ui";
import { LifeBuoy } from "lucide-react";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Thấp" },
  { value: "medium", label: "Trung bình" },
  { value: "high", label: "Cao" },
];

const EMPTY_FORM = { title: "", content: "", priority: "medium" };

export default function SupportRequestWidget({ userAuth, onRequireLogin }) {
  const modalParam = useModalParam();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(null); // ticket đã gửi thành công để hiện mã

  const openModal = () => {
    if (!userAuth?.user) { onRequireLogin?.(); return; }
    setForm({ ...EMPTY_FORM });
    setError("");
    setDone(null);
    setOpen(true);
    modalParam.open("supportRequest");
  };

  const closeModal = () => {
    setOpen(false);
    modalParam.close("supportRequest");
  };

  // Vào thẳng link có ?m=supportRequest → tự mở (chỉ khi đã đăng nhập).
  // setTimeout(...,0): không setState đồng bộ trong thân effect (convention repo).
  useEffect(() => {
    const t = setTimeout(() => {
      if (modalParam.modal === "supportRequest" && userAuth?.user && !open) {
        setError("");
        setDone(null);
        setOpen(true);
      }
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalParam.modal, userAuth?.user]);

  // Back của trình duyệt làm mất params → đóng modal.
  useEffect(() => {
    const t = setTimeout(() => {
      if (modalParam.modal !== "supportRequest" && open) setOpen(false);
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalParam.modal]);

  const submit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError("Vui lòng nhập tiêu đề và mô tả vấn đề");
      return;
    }
    setSending(true);
    setError("");
    try {
      const ticket = await supportService.create(form);
      setDone(ticket);
    } catch (e) {
      setError(e.message || "Không gửi được yêu cầu, thử lại sau nhé");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={openModal}
          title="Gửi yêu cầu hỗ trợ"
          aria-label="Gửi yêu cầu hỗ trợ"
          className="fixed bottom-[150px] right-4 lg:bottom-[84px] lg:right-6 z-40 w-12 h-12 rounded-full
                     bg-teal text-paper shadow-xl flex items-center justify-center
                     hover:bg-teal/90 active:scale-95 transition"
        >
          <LifeBuoy className="w-5 h-5" />
        </button>
      )}

      {open && (
        <Modal onClose={closeModal}>
          {done ? (
            <div className="text-center py-2">
              <span className="mx-auto w-12 h-12 rounded-full bg-teal/10 text-teal flex items-center justify-center">
                <LifeBuoy className="w-6 h-6" />
              </span>
              <h3 className="font-display text-lg text-ink mt-3">Đã gửi yêu cầu hỗ trợ</h3>
              <p className="text-sm font-body text-[#8A7C63] mt-1">
                Mã ticket của bạn: <span className="font-mono text-ink">{done.code}</span>.{" "}
                {done.assigneeType === "teacher"
                  ? <>Yêu cầu đã được gửi cho giáo viên phụ trách lớp của bạn (<span className="text-ink">{done.assigneeName || done.assigneeUsername}</span>).</>
                  : "Đội ngũ quản trị sẽ phản hồi sớm nhất."}
              </p>
              <div className="flex justify-center mt-4">
                <PrimaryButton onClick={closeModal}>Đóng</PrimaryButton>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg text-ink">Gửi yêu cầu hỗ trợ</h3>
                  <p className="text-xs text-[#8A7C63] font-body mt-0.5">
                    Mô tả vấn đề bạn gặp, quản trị viên sẽ trả lời qua thông báo trong app.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  title="Đóng"
                  className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-ink/45 hover:text-ticket hover:bg-ticket/10 transition"
                >
                  <IconClose className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); submit(); }}
                className="space-y-3 mt-4"
              >
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#8A7C63]">Tiêu đề</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="VD: Không vào được game Săn Trái Cây"
                    autoComplete="off"
                    maxLength={200}
                    className="w-full note-card px-4 py-2.5 mt-0.5 border-ink/10 focus:border-ticket rounded-2xl text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#8A7C63]">Mô tả vấn đề</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    rows={4}
                    maxLength={4000}
                    placeholder="Bạn gặp lỗi ở đâu, thao tác thế nào thì gặp?"
                    className="w-full note-card px-4 py-2.5 mt-0.5 border-ink/10 focus:border-ticket rounded-2xl text-sm outline-none resize-y"
                  />
                </div>
                <Select
                  label="Mức độ khẩn cấp"
                  value={form.priority}
                  onChange={(v) => setForm((f) => ({ ...f, priority: v }))}
                  options={PRIORITY_OPTIONS}
                />
                {error && <p className="text-ticket text-sm">{error}</p>}
                <div className="flex justify-end gap-2 pt-1">
                  <GhostButton type="button" onClick={closeModal}>Hủy</GhostButton>
                  <PrimaryButton type="submit" disabled={sending}>
                    {sending ? "Đang gửi..." : "Gửi yêu cầu"}
                  </PrimaryButton>
                </div>
              </form>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
