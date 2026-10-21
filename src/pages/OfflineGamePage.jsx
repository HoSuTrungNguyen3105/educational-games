import { useEffect, useMemo, useRef, useState } from "react";
import { navigate } from "../lib/router.js";
import { findOfflineGame, makeFallbackMeta } from "../games/offline/games-src/manifest.js";
import { useGameVersion } from "../hooks/useGameVersion.js";
import { Loader } from "../components/ui";

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
  const isSchoolMissionRedirect =
    gameId === "School_mission" || gameId === "school-mission";

  // Link cũ /offline/School_mission → chuyển sang game nhập vai
  useEffect(() => {
    if (isSchoolMissionRedirect) navigate("/school-mission");
  }, [isSchoolMissionRedirect]);

  const html = isSchoolMissionRedirect ? null : HTML_BY_ID[gameId];
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  // Manifest giữ tên/emoji/màu đẹp. Nếu game mới chưa có trong manifest thì
  // tự dựng metadata từ <title> trong file để vẫn chơi được ngay.
  const meta = useMemo(() => {
    if (!html) return null;
    return findOfflineGame(gameId) || makeFallbackMeta(gameId, html);
  }, [gameId, html]);

  // Kiểm tra phiên bản game nếu có playMode trong meta
  const { hasUpdate, checkForUpdate, markAsUpdated } = useGameVersion(
    meta?.playMode === 'offline' ? gameId : null,
    meta?.version || 1
  );

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type === "quit") navigate("/");
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Hiển thị thông báo cập nhật khi có phiên bản mới
  useEffect(() => {
    if (hasUpdate && meta?.playMode === 'offline') {
      setShowUpdateNotification(true);
    }
  }, [hasUpdate, meta]);

  // Xử lý cập nhật game
  const handleUpdateGame = async () => {
    if (!meta || meta.playMode !== 'offline') return;

    try {
      // Reload trang để tải lại game từ API (không dùng cache)
      // Trong thực tế, backend cần có endpoint để tải data mới
      // Ở đây chúng ta chỉ reload trang đơn giản
      markAsUpdated();
      setShowUpdateNotification(false);
      window.location.reload();
    } catch (error) {
      console.error('Lỗi cập nhật game:', error);
    }
  };

  if (isSchoolMissionRedirect) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-paper">
        <Loader label="Đang mở Trường Vui Vẻ..." />
      </div>
    );
  }

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
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-3 left-3 z-20 rounded-full bg-white/90 px-3 py-1.5 text-sm font-extrabold text-slate-700 shadow hover:bg-white"
        aria-label="Về trang chủ"
      >
        ← Trang chủ
      </button>
      <iframe
        ref={iframeRef}
        title={meta.name}
        srcDoc={html}
        sandbox="allow-scripts allow-same-origin"
        className="h-full w-full border-0"
      />

      {/* Thông báo cập nhật phiên bản mới */}
      {showUpdateNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-blue-500">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎮</div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-gray-900">Có phiên bản mới!</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Game "{meta.name}" đã có phiên bản mới. Cập nhật để trải nghiệm tốt hơn.
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleUpdateGame}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2 px-3 rounded"
                  >
                    Cập nhật ngay
                  </button>
                  <button
                    onClick={() => setShowUpdateNotification(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold py-2 px-3 rounded"
                  >
                    Để sau
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}