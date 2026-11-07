import { useRef } from "react";
import SandboxFrame from "./SandboxFrame.jsx";
import { buildWordPreviewSrcDoc } from "../../../lib/documents/modelRender.js";
import { fitScale, useContainerWidth } from "./useContainerWidth.js";

// WordPreview — xem trước tài liệu Word trên trang giấy A4 (794px ≈
// 210mm, lề 72px) nền trắng đặt trên nền xám của app. Nguồn preview là
// DUY NHẤT một đường (đúng thiết kế đợt 1): HTML của giáo viên (chế độ
// HTML) hoặc HTML render từ blocks (chế độ JSON) — cả hai đều đặt vào
// iframe sandbox qua buildWordPreviewSrcDoc, không render trực tiếp
// vào DOM của app.
// Đợt 2: TỰ VỪA KHUNG — trang A4 794px rộng hơn khung xem trước khi
// cửa sổ hẹp/chia đôi lệch → trước đây phải cuộn ngang. Nay đo bề rộng
// khung và tự thu nhỏ vừa khung; zoom +/- của giáo viên nhân thêm trên
// mức tự vừa đó (cùng cơ chế với PowerPointPreview).
const PAGE_W = 794;

export default function WordPreview({ bodyHtml, cssText = "", zoom = 1 }) {
  const srcDoc = buildWordPreviewSrcDoc({ bodyHtml: bodyHtml || "", cssText });
  const boxRef = useRef(null);
  const boxWidth = useContainerWidth(boxRef);
  const effectiveZoom = zoom * fitScale(boxWidth, PAGE_W);
  return (
    <div ref={boxRef} className="h-full overflow-auto bg-[#cfc9bb] p-4">
      <SandboxFrame srcDoc={srcDoc} width={PAGE_W} minHeight={1123} zoom={effectiveZoom} />
    </div>
  );
}
