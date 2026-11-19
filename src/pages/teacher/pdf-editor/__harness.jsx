/* TẠM — harness kiểm thử runtime cho PdfEditorPage (không dùng trong app).
 * Xoá file này cùng pdf-test.html sau khi nghiệm thu. */
import { createRoot } from "react-dom/client";
import "../../../index.css";
import "../../../styles/admin.css";
import PdfEditorPage from "./PdfEditorPage.jsx";

function showToast(message, type = "info") {
  console.log("[toast]", type, message);
  const el = document.createElement("div");
  el.textContent = `${type}: ${message}`;
  el.style.cssText =
    "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;" +
    "background:#1d2327;color:#fff;padding:8px 16px;border-radius:6px;font:14px/1.4 sans-serif";
  document.body.appendChild(el);
  window.setTimeout(() => el.remove(), 3500);
}

createRoot(document.getElementById("root")).render(
  <div className="edu-admin" style={{ maxWidth: 1440, margin: "0 auto", padding: 16 }}>
    <PdfEditorPage showToast={showToast} />
  </div>,
);