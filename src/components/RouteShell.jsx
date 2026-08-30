import { navigate } from "../lib/router.js";
import { Toast } from "../components/ui.jsx";

/**
 * Layout wrapper cho các user-facing screens.
 * - Nút "← Về trang chủ" ở trên cùng
 * - Toast notification
 */
export default function RouteShell({ children, toast, showBack = true, fullHeight = false }) {
  return (
    <>
      <div className={`${fullHeight ? "h-screen" : "min-h-screen"} bg-paper flex flex-col ${fullHeight ? "overflow-hidden" : ""}`}>
        {showBack && (
          <div className="flex items-center px-5 md:px-8 py-4 shrink-0">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-[#8A7C63] hover:text-ink"
            >
              ← Về trang chủ
            </button>
          </div>
        )}
        <div className={`${fullHeight ? "h-0 flex-1 min-h-0" : "flex-1"} flex flex-col`}>
          {children}
        </div>
      </div>
      <Toast toast={toast} />
    </>
  );
}
