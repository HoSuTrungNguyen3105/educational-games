import { useEffect, useRef } from "react";
import SandboxFrame from "./SandboxFrame.jsx";
import { buildWordPreviewSrcDoc } from "../../../lib/documents/modelRender.js";
import { fitScale, useContainerWidth } from "./useContainerWidth.js";
import { useFrameReveal } from "./frameReveal.js";

// WordPreview — xem trước tài liệu Word trên trang giấy A4 (794px ≈
// 210mm, lề 72px) nền trắng đặt trên nền xám của app. Nguồn preview là
// DUY NHẤT một đường (đúng thiết kế đợt 1): HTML của giáo viên (chế độ
// Beautiful) hoặc HTML render từ blocks (chế độ Normal) — cả hai đều
// đặt vào iframe sandbox qua buildWordPreviewSrcDoc, không render trực
// tiếp vào DOM của app.
// Đợt 2: TỰ VỪA KHUNG — trang A4 794px rộng hơn khung xem trước khi
// cửa sổ hẹp/chia đôi lệch → trước đây phải cuộn ngang. Nay đo bề rộng
// khung và tự thu nhỏ vừa khung; zoom +/- của giáo viên nhân thêm trên
// mức tự vừa đó (cùng cơ chế với PowerPointPreview).
// Đợt 3 (REFACTOR_EDITOR §3): MỘT THANH CUỘN DUY NHẤT — div gốc ở đây
// KHÔNG còn tự cuộn (trước là overflow-auto lồng trong pane); vùng cuộn
// duy nhất là .docstudio-preview-body ở cấp pane xem trước, các trang
// A4 nối tiếp cuộn liền mạch như trình xem Word/PDF, iframe cũng không
// tự cuộn (SandboxFrame scrolling="no" + tự giãn đủ chiều cao).
const PAGE_W = 794;

export default function WordPreview({ bodyHtml, cssText = "", zoom = 1, reveal = null }) {
  const srcDoc = buildWordPreviewSrcDoc({ bodyHtml: bodyHtml || "", cssText });
  const boxRef = useRef(null);
  const frameRef = useRef(null);
  // Phần tử cuộn thật là .docstudio-preview-body — phần tử cha trực tiếp
  // của div gốc này (editor render WordPreview ngay trong đó). Reveal
  // (bấm dòng mã → nhảy tới đoạn) cuộn phần tử đó thay vì div gốc.
  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current = boxRef.current?.parentElement ?? null;
  }, []);
  const boxWidth = useContainerWidth(boxRef);
  const effectiveZoom = zoom * fitScale(boxWidth, PAGE_W, 24);
  useFrameReveal(scrollRef, frameRef, reveal);
  return (
    <div ref={boxRef} className="min-h-full w-full bg-[#cfc9bb] p-3">
      <SandboxFrame ref={frameRef} srcDoc={srcDoc} width={PAGE_W} minHeight={1123} zoom={effectiveZoom} />
    </div>
  );
}
