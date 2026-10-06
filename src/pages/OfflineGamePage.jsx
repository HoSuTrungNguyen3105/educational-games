import { useEffect, useMemo, useRef } from "react";
import { navigate } from "../lib/router.js";
import { findOfflineGame, makeFallbackMeta } from "../games/src/manifest.js";

/**
 * MỖI GAME = MỘT FILE HTML trong src/games/offline/.
 *
 * Dùng `import.meta.glob` để Vite tự quét toàn bộ folder lúc build.
 * Nhờ vậy chỉ cần COPY FILE .html vào src/games/offline/ là chơi được,
 * KHÔNG phải khai báo import/key/route thủ công như trước.
 *
 * ⚠ Phải dùng `query: '?raw'` chứ KHÔNG viết `*.html?raw` trong pattern —
 *   Vite KHÔNG xử lý query string nằm trong glob, nên pattern đó khớp 0 file
 *   và mọi game sẽ biến mất trong bundle mà build vẫn báo thành công.
 *
 * Bổ sung: `npm run games:sync` sẽ bổ sung metadata (tên/emoji/màu) vào manifest
 * để game mới hiện đẹp trên trang chủ.
 */
const OFFLINE_HTML = import.meta.glob("../games/offline/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
});

/** id = tên file bỏ đuôi .html, ví dụ "night-strike.html" → "night-strike" */
const HTML_BY_ID = Object.fromEntries(
  Object.entries(OFFLINE_HTML).map(([path, mod]) => [
    path.split("/").pop().replace(/\.html$/, ""),
    typeof mod === "string" ? mod : mod.default,
  ])
);

/** Trang chơi 1 game offline — dùng chung cho mọi game trong thư mục offline. */
export default function OfflineGamePage({ gameId }) {
  const iframeRef = useRef(null);
  const html = HTML_BY_ID[gameId];

  // Manifest giữ tên/emoji/màu đẹp. Nếu game mới chưa có trong manifest thì
  // tự dựng metadata từ <title> trong file để vẫn chơi được ngay.
  const meta = useMemo(() => {
    if (!html) return null;
    return findOfflineGame(gameId) || makeFallbackMeta(gameId, html);
  }, [gameId, html]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type === "quit") navigate("/");
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!html) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-paper">
        <div className="text-center max-w-md px-5">
          <div className="text-5xl">🤔</div>
          <p className="mt-3 font-display text-lg font-bold text-ink">Không tìm thấy game</p>
          <p className="mt-1 text-sm text-slate-500">id: {String(gameId || "(rỗng)")}</p>
          <p className="mt-3 text-xs text-slate-400">
            Kiểm tra file <code className="bg-black/5 px-1.5 py-0.5 rounded">
              src/games/offline/{String(gameId)}.html
            </code>{" "}
            có tồn tại không. Nếu vừa thêm file, hãy tải lại trang (F5).
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-full bg-slate-100 px-4 py-2 text-sm font-extrabold text-slate-600 shadow-sm hover:bg-slate-200"
          >
            ← Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0c2a30]">
      <iframe
        ref={iframeRef}
        title={meta.name}
        srcDoc={html}
        sandbox="allow-scripts allow-same-origin"
        className="h-full w-full border-0"
      />
    </div>
  );
}