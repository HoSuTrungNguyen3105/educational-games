import SandboxFrame from "./SandboxFrame.jsx";
import { buildWordPreviewSrcDoc } from "../../../lib/documents/modelRender.js";

// WordPreview — xem trước tài liệu Word trên trang giấy A4 (794px ≈
// 210mm, lề 72px) nền trắng đặt trên nền xám của app. Nguồn preview là
// DUY NHẤT một đường (đúng thiết kế đợt 1): HTML của giáo viên (chế độ
// HTML) hoặc HTML render từ blocks (chế độ JSON) — cả hai đều đặt vào
// iframe sandbox qua buildWordPreviewSrcDoc, không render trực tiếp
// vào DOM của app.
export default function WordPreview({ bodyHtml, cssText = "", zoom = 1 }) {
  const srcDoc = buildWordPreviewSrcDoc({ bodyHtml: bodyHtml || "", cssText });
  return (
    <div className="h-full overflow-auto bg-[#cfc9bb] p-4">
      <SandboxFrame srcDoc={srcDoc} width={794} minHeight={1123} zoom={zoom} />
    </div>
  );
}
