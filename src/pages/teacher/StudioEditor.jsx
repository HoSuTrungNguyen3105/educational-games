import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, CircleAlert, CircleCheck, Eye, Globe, LayoutList, Plus, Redo2, Save,
  SlidersHorizontal, Sparkles, Undo2, Undo, X,
} from "lucide-react";
import { navigate } from "../../lib/router.js";
import { gameService } from "../../services/api.js";
import { setupService } from "../../services/setupService.js";
import { useLessonEditor } from "../../hooks/useLessonEditor.js";
import { useConfirm } from "../../hooks/useConfirm.js";
import { ConfirmModal, ErrorState, Loader, Modal } from "../../components/ui";
import LessonCanvas from "../../components/studio/LessonCanvas.jsx";
import LessonPlayer from "../../components/studio/LessonPlayer.jsx";
import { isLessonAnswerCorrect } from "../../components/studio/lessonAnswer.js";
import EditorLibrary from "./studio/EditorLibrary.jsx";
import PropsPanel from "./studio/PropsPanel.jsx";
import PageStrip from "./studio/PageStrip.jsx";
import ImagePickerModal from "./studio/ImagePicker.jsx";
import "./studio/studio.css";

// StudioEditor — trang soạn bài học của EduPlay AI Studio
// (/dashboard/studio/:lessonId, trong TeacherLayout như mọi trang quản
// trị khác — xem ghi chú layout ở báo cáo đợt 2).
// Bố cục bám Phần B đặc tả: header (§5.1) · rail + thư viện trái
// (§5.2/5.3) · canvas giữa (§5.4) · panel thuộc tính phải (§5.5) ·
// dải trang dưới (§5.6) · thanh trạng thái (§5.7).
// TeacherLayout chưa render <Toast> nên MỌI phản hồi (lưu/xuất bản)
// đều hiển thị ngay trong header/thanh trạng thái của trang này,
// không phụ thuộc toast toàn cục.

const TYPE_LABELS = {
  title: "Tiêu đề", text: "Đoạn văn", note: "Ghi chú",
  image: "Hình ảnh", question: "Câu hỏi", game: "Trò chơi",
};

export default function StudioEditor({ lessonId, showToast }) {
  const ed = useLessonEditor(lessonId);
  const { askConfirm, confirmProps } = useConfirm();

  const [games, setGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [gamesError, setGamesError] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [picker, setPicker] = useState({ open: false, targetId: null });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mobileSheet, setMobileSheet] = useState(null); // "pages" | "add" | "props"
  const [publishing, setPublishing] = useState(false);
  const [publishErrors, setPublishErrors] = useState(null);
  const [notice, setNotice] = useState(null); // { tone: "success"|"error", text }
  const [hideRestored, setHideRestored] = useState(false);

  const edRef = useRef(null);
  useEffect(() => { edRef.current = ed; });
  const bypassRef = useRef(false);

  useEffect(() => {
    let alive = true;
    gameService.list({})
      .then((list) => { if (alive) { setGames(Array.isArray(list) ? list : []); setGamesLoading(false); } })
      .catch((e) => { if (alive) { setGamesError(e?.message || "Không tải được danh sách game"); setGamesLoading(false); } });
    setupService.listSubjects()
      .then((list) => { if (alive) setSubjects(Array.isArray(list) ? list : []); })
      .catch(() => { /* môn học chỉ là gợi ý — lỗi thì bỏ qua */ });
    return () => { alive = false; };
  }, []);

  const gameById = useMemo(() => {
    const map = {};
    for (const g of games) map[g._id] = g;
    return map;
  }, [games]);

  useEffect(() => {
    if (!notice || notice.tone !== "success") return;
    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  // ── Rời trang khi chưa lưu (§5.1): chặn ở cả 3 đường — đóng/refresh
  // tab (beforeunload), đổi hash trong app (hashchange, kèm khôi phục
  // vị trí + hộp xác nhận), và nút Quay lại của editor. Bản nháp chưa
  // lưu còn được hook giữ ở sessionStorage nên kể cả khi trình duyệt
  // đã kịp tháo trang, quay lại editor là khôi phục được.
  useEffect(() => {
    if (!ed.dirty) return undefined;
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [ed.dirty]);

  const leaveGuard = useCallback((targetHash) => {
    askConfirm({
      title: "Bài học chưa lưu xong",
      message: "Bấm “Lưu & rời đi” để lưu bản mới nhất trước. Nếu lưu thất bại, bản nháp vẫn được giữ trong trình duyệt này và tự khôi phục khi bạn quay lại.",
      confirmLabel: "Lưu & rời đi",
      danger: false,
      onConfirm: async () => {
        await edRef.current?.save();
        bypassRef.current = true;
        window.location.hash = targetHash;
      },
    });
  }, [askConfirm]);

  useEffect(() => {
    const onHash = () => {
      if (bypassRef.current) { bypassRef.current = false; return; }
      if (!edRef.current?.dirty) return;
      const h = window.location.hash;
      if (!h.startsWith(`#/dashboard/studio/${lessonId}`)) {
        window.location.hash = `#/dashboard/studio/${lessonId}`;
        leaveGuard(h);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [lessonId, leaveGuard]);

  const goBack = () => {
    if (!ed.dirty) { navigate("/dashboard/studio"); return; }
    leaveGuard("#/dashboard/studio");
  };

  // Undo/redo bằng phím (bỏ qua khi đang gõ trong ô nhập).
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t && (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable)) return;
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();
      if (key === "z" && !e.shiftKey) { e.preventDefault(); edRef.current?.undo(); }
      else if ((key === "z" && e.shiftKey) || key === "y") { e.preventDefault(); edRef.current?.redo(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Thao tác ─────────────────────────────────────────────────────────
  const addImageWithPicker = useCallback(() => {
    const id = ed.addElement("image");
    if (id) setPicker({ open: true, targetId: id });
  }, [ed]);

  const handlePublish = async () => {
    setPublishing(true);
    setNotice(null);
    const res = await ed.publish();
    setPublishing(false);
    if (res.ok) {
      setNotice({ tone: "success", text: "Đã xuất bản — học sinh đã xem được bài học này." });
      showToast?.("Đã xuất bản bài học", "success");
    } else if (res.errors?.length) {
      setPublishErrors(res.errors);
    } else {
      setNotice({ tone: "error", text: res.message || "Xuất bản thất bại" });
    }
  };

  const handleUnpublish = async () => {
    setPublishing(true);
    const res = await ed.unpublish();
    setPublishing(false);
    if (res.ok) setNotice({ tone: "success", text: "Đã gỡ xuất bản — học sinh không còn thấy bài học." });
    else setNotice({ tone: "error", text: res.message || "Gỡ xuất bản thất bại" });
  };

  const gotoPublishError = (err) => {
    if (err.pageId) ed.selectPage(err.pageId);
    if (err.elementId) ed.selectElement(err.elementId);
    else ed.selectElement(null);
    setPublishErrors(null);
  };

  if (ed.loading) {
    return <div className="p-12 flex items-center justify-center"><Loader label="Đang tải bài học..." /></div>;
  }
  if (ed.loadError || !ed.doc) {
    return <ErrorState subtitle={ed.loadError || "Không tải được bài học"} onRetry={() => window.location.reload()} />;
  }

  const saveLabel = ed.saveState === "saving" ? "Đang lưu…"
    : ed.saveState === "error" ? "Chưa lưu được"
    : ed.saveState === "dirty" ? "Chưa lưu"
    : `Đã lưu${ed.lastSavedAt ? ` lúc ${ed.lastSavedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}` : ""}`;
  const pageElements = ed.currentPage?.elements.length || 0;

  return (
    <div className="studio-editor">
      {/* ── Header (§5.1) ─────────────────────────────────────────── */}
      <header className="studio-header shrink-0 flex items-center gap-2 px-3 min-h-[52px] py-1.5 border-b border-[#E7D9BE] bg-white flex-wrap">
        <button type="button" onClick={goBack}
          className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-[10px] text-[13px] font-semibold text-ink hover:bg-[#F4F8FF]">
          <ArrowLeft className="w-4 h-4" /> Danh sách
        </button>
        <span className="studio-header-brand hidden xl:inline-flex items-center gap-1.5 font-display font-bold text-ink">
          <Sparkles className="w-4.5 h-4.5" style={{ color: "#8B5CF6" }} /> AI Studio
        </span>
        <input
          value={ed.doc.title}
          onChange={(e) => ed.setMeta({ title: e.target.value }, true)}
          onBlur={() => ed.endTransient()}
          placeholder="Tên bài học…"
          className="flex-1 min-w-[160px] max-w-[420px] font-display font-bold text-[15px] text-ink bg-transparent border-b border-transparent hover:border-[#E7D9BE] focus:border-[#2F6FED] outline-none px-1 py-1"
        />
        <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-bold text-white ${ed.status === "published" ? "" : ""}`}
          style={{ background: ed.status === "published" ? "#1B998B" : "#8A7C63" }}>
          {ed.status === "published" ? "Đã xuất bản" : "Nháp"}
        </span>
        <span className="text-[12px] font-medium"
          style={{ color: ed.saveState === "error" ? "#D64545" : ed.saveState === "dirty" || ed.saveState === "saving" ? "#B45309" : "#1B998B" }}>
          {saveLabel}
        </span>
        <div className="flex items-center gap-1 ml-auto">
          <button type="button" title="Hoàn tác (Ctrl+Z)" disabled={!ed.canUndo} onClick={ed.undo}
            className="studio-header-undo w-9 h-9 grid place-items-center rounded-[10px] border border-[#E7D9BE] bg-white text-ink disabled:opacity-35 hover:bg-[#F4F8FF]">
            <Undo2 className="w-4 h-4" />
          </button>
          <button type="button" title="Làm lại (Ctrl+Shift+Z)" disabled={!ed.canRedo} onClick={ed.redo}
            className="studio-header-redo w-9 h-9 grid place-items-center rounded-[10px] border border-[#E7D9BE] bg-white text-ink disabled:opacity-35 hover:bg-[#F4F8FF]">
            <Redo2 className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => ed.save()} disabled={!ed.dirty || ed.saving}
            className="studio-header-save inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] border border-[#E7D9BE] bg-white text-[13px] font-semibold text-ink disabled:opacity-40 hover:bg-[#F4F8FF]">
            <Save className="w-4 h-4" /> Lưu nháp
          </button>
          <button type="button" onClick={() => setPreviewOpen(true)}
            className="studio-header-preview inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[13px] font-semibold text-white"
            style={{ background: "#8B5CF6" }}>
            <Eye className="w-4 h-4" /> Xem trước
          </button>
          {ed.status === "published" ? (
            <button type="button" onClick={handleUnpublish} disabled={publishing}
              className="studio-header-publish inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] border border-[#E7D9BE] bg-white text-[13px] font-semibold text-[#B45309] disabled:opacity-40">
              <Undo className="w-4 h-4" /> Gỡ xuất bản
            </button>
          ) : (
            <button type="button" onClick={handlePublish} disabled={publishing}
              className="studio-header-publish inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[13px] font-semibold text-white disabled:opacity-50"
              style={{ background: "#1B998B" }}>
              <Globe className="w-4 h-4" /> {publishing ? "Đang xử lý…" : "Xuất bản"}
            </button>
          )}
        </div>
      </header>

      {/* ── Thông báo trong trang (thay toast toàn cục) ───────────── */}
      {(notice || (ed.restoredDraft && !hideRestored) || ed.saveError) && (
        <div className="shrink-0 px-3 pt-2 space-y-1.5">
          {notice && (
            <div className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] font-medium"
              style={{
                background: notice.tone === "success" ? "#DBF1EE" : "#FDECEC",
                color: notice.tone === "success" ? "#0C5B52" : "#7A1F1F",
              }}>
              {notice.tone === "success" ? <CircleCheck className="w-4 h-4 shrink-0" /> : <CircleAlert className="w-4 h-4 shrink-0" />}
              <span className="flex-1">{notice.text}</span>
              <button type="button" onClick={() => setNotice(null)} className="font-bold px-1">×</button>
            </div>
          )}
          {ed.saveError && (
            <div className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] font-medium" style={{ background: "#FDECEC", color: "#7A1F1F" }}>
              <CircleAlert className="w-4 h-4 shrink-0" />
              <span className="flex-1">Lưu thất bại: {ed.saveError}</span>
              <button type="button" onClick={() => ed.save()} className="font-bold underline">Thử lưu lại</button>
            </div>
          )}
          {ed.restoredDraft && !hideRestored && (
            <div className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] font-medium" style={{ background: "#FFF3C4", color: "#5B4A12" }}>
              <CircleAlert className="w-4 h-4 shrink-0" />
              <span className="flex-1">Đã khôi phục bản chưa lưu từ lần soạn trước trong trình duyệt này.</span>
              <button type="button" onClick={() => setHideRestored(true)} className="font-bold px-1">×</button>
            </div>
          )}
        </div>
      )}

      {/* ── Thân editor: thư viện | canvas | thuộc tính ───────────── */}
      <div className="studio-body flex flex-1 min-h-0">
        <EditorLibrary
          ed={ed}
          games={games} gamesLoading={gamesLoading} gamesError={gamesError}
          onAddImage={addImageWithPicker}
          onPickImageUrl={(url) => ed.addElement("image", { imageUrl: url })}
          onPickBackground={() => setPicker({ open: true, targetId: "__background__" })}
          showToast={showToast}
        />
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="studio-canvas-scroll">
            <div className="studio-canvas-frame" style={{ maxWidth: 1120, margin: "0 auto" }}>
              <LessonCanvas
                page={ed.currentPage}
                gameById={gameById}
                showAnswer
                mode="edit"
                selectedId={ed.selectedId}
                onSelect={ed.selectElement}
                onGeoStart={ed.beginTransient}
                onGeoChange={(id, geo) => ed.patchElement(id, geo, true)}
                onGeoEnd={ed.endTransient}
              />
            </div>
          </div>
          {/* Thanh trạng thái (§5.7) */}
          <div className="studio-statusbar shrink-0 flex items-center gap-3 px-3 h-8 border-t border-[#E7D9BE] bg-white text-[12px] text-[#8A7C63] font-medium overflow-hidden whitespace-nowrap">
            <span>Canvas 1280 × 720</span>
            <span>Trang {(ed.pages.findIndex((p) => p.id === ed.currentPage?.id) + 1) || 1}/{ed.pages.length}</span>
            <span>{pageElements} phần tử ở trang này</span>
            <span className="truncate">
              {ed.selectedElement ? `Đang chọn: ${TYPE_LABELS[ed.selectedElement.type] || ed.selectedElement.type}` : "Chưa chọn phần tử"}
            </span>
            <span className="ml-auto">{saveLabel}</span>
          </div>
        </div>
        <PropsPanel
          ed={ed}
          games={games} gameById={gameById} subjects={subjects}
          onPickImage={(elId) => setPicker({ open: true, targetId: elId })}
          onPickCover={() => setPicker({ open: true, targetId: "__cover__" })}
        />
      </div>

      {/* ── Dải trang (§5.6) ──────────────────────────────────────── */}
      <PageStrip ed={ed} gameById={gameById} />

      {/* ── Điều hướng mobile: Trang / Thêm / Sửa / Xem / Lưu ─────── */}
      <nav className="studio-mobile-nav" aria-label="Thao tác soạn bài">
        <button type="button" className={mobileSheet === "pages" ? "is-active" : ""}
          onClick={() => setMobileSheet("pages")}>
          <LayoutList /> <span>Trang</span>
        </button>
        <button type="button" className={mobileSheet === "add" ? "is-active" : ""}
          onClick={() => setMobileSheet("add")}>
          <Plus /> <span>Thêm</span>
        </button>
        <button type="button" className={mobileSheet === "props" ? "is-active" : ""}
          onClick={() => setMobileSheet("props")}>
          <SlidersHorizontal /> <span>Sửa</span>
        </button>
        <button type="button" onClick={() => setPreviewOpen(true)}>
          <Eye /> <span>Xem</span>
        </button>
        <button type="button" onClick={() => ed.save()} disabled={!ed.dirty || ed.saving}>
          <Save /> <span>{ed.saving ? "Đang lưu" : "Lưu"}</span>
        </button>
      </nav>

      {mobileSheet && (
        <div className="studio-mobile-sheet-wrap">
          <button type="button" className="studio-mobile-sheet-backdrop"
            onClick={() => setMobileSheet(null)} aria-label="Đóng bảng" />
          <section className="studio-mobile-sheet" role="dialog" aria-modal="true"
            aria-label={mobileSheet === "pages" ? "Danh sách trang" : mobileSheet === "add" ? "Thêm nội dung" : "Thuộc tính"}>
            <header className="studio-mobile-sheet-head">
              <strong>
                {mobileSheet === "pages" ? "Trang học" : mobileSheet === "add" ? "Thêm nội dung" : "Thuộc tính & thông tin"}
              </strong>
              <button type="button" onClick={() => setMobileSheet(null)} aria-label="Đóng">
                <X />
              </button>
            </header>
            <div className="studio-mobile-sheet-body">
              {mobileSheet === "pages" && <PageStrip ed={ed} gameById={gameById} />}
              {mobileSheet === "add" && (
                <EditorLibrary
                  ed={ed}
                  games={games} gamesLoading={gamesLoading} gamesError={gamesError}
                  onAddImage={addImageWithPicker}
                  onPickImageUrl={(url) => ed.addElement("image", { imageUrl: url })}
                  onPickBackground={() => setPicker({ open: true, targetId: "__background__" })}
                  showToast={showToast}
                />
              )}
              {mobileSheet === "props" && (
                <PropsPanel
                  ed={ed}
                  games={games} gameById={gameById} subjects={subjects}
                  onPickImage={(elId) => setPicker({ open: true, targetId: elId })}
                  onPickCover={() => setPicker({ open: true, targetId: "__cover__" })}
                />
              )}
            </div>
          </section>
        </div>
      )}

      {/* ── Chọn ảnh ──────────────────────────────────────────────── */}
      <ImagePickerModal
        open={picker.open}
        onClose={() => setPicker({ open: false, targetId: null })}
        onPick={(url) => {
          // targetId "__cover__" = ảnh bìa của bài (meta); "__background__"
          // = ảnh nền của trang đang chọn — cùng một modal thư viện ảnh
          // dùng chung cho phần tử image, ảnh bìa lẫn nền trang.
          if (picker.targetId === "__cover__") ed.setMeta({ coverImage: url });
          else if (picker.targetId === "__background__") {
            if (ed.currentPage) ed.setPageBackground(ed.currentPage.id, { type: "image", value: url });
          }
          else if (picker.targetId) ed.patchElementProps(picker.targetId, { imageUrl: url });
        }}
      />

      {/* ── Lỗi xuất bản (§15): bấm vào lỗi → nhảy tới phần tử ────── */}
      {publishErrors && (
        <Modal onClose={() => setPublishErrors(null)} wide>
          <h3 className="font-display text-lg text-ink mb-1">Chưa thể xuất bản</h3>
          <p className="text-sm text-[#8A7C63] mb-3">
            Còn {publishErrors.length} vấn đề cần sửa. Bấm vào từng dòng để nhảy tới đúng trang và phần tử.
          </p>
          <div className="space-y-1.5 max-h-[50vh] overflow-auto">
            {publishErrors.map((err, i) => (
              <button key={i} type="button" onClick={() => gotoPublishError(err)}
                className="w-full text-left px-3 py-2.5 rounded-[10px] border border-[#F2C1C1] bg-[#FFF7F7] hover:bg-[#FDECEC] transition">
                <span className="block text-[13px] font-semibold text-[#7A1F1F]">
                  {typeof err.pageIndex === "number" ? `Trang ${err.pageIndex + 1}` : "Thông tin bài học"}
                  {err.field ? ` · ${err.field}` : ""}
                </span>
                <span className="block text-[13.5px] text-ink">{err.message}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={() => setPublishErrors(null)}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-ink text-paper">Đã hiểu</button>
          </div>
        </Modal>
      )}

      {/* ── Xem trước như học sinh (§14) ──────────────────────────── */}
      {previewOpen && (
        <LessonPlayer
          lesson={{ ...ed.doc, status: ed.status }}
          gameById={gameById}
          preview
          checkAnswer={(el, value) => isLessonAnswerCorrect(el, value)}
          onPlayGame={(gameId) => window.open(`#/play/${gameId}`, "_blank")}
          onExit={() => setPreviewOpen(false)}
        />
      )}

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
