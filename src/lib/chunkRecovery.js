// Khôi phục khi chunk lazy tải lỗi — cơ chế DÙNG CHUNG một chỗ cho toàn app.
//
// Vì sao cần: mọi trang của app đều nạp qua React.lazy (App.jsx,
// TeacherApp.jsx…). Khi người dùng đang mở bản cũ mà server đã có bản
// deploy mới (GitHub Pages + service worker precache), file chunk cũ có
// thể 404, hoặc mạng chập chờn làm dynamic import thất bại. Trước đây
// KHÔNG có error boundary nào bắt lỗi này → React gỡ toàn bộ cây →
// TRANG TRẮNG hoàn toàn, chuyển route cũng không cứu được, chỉ còn cách
// tải lại thủ công (tái hiện 3 lần ở đợt kiểm production 2026-11-22:
// English B1, TeacherApp/dashboard, Document Studio).
//
// Cơ chế ở đây:
//   1. AppErrorBoundary (src/components/AppErrorBoundary.jsx) bắt lỗi ở
//      tầng app/route. Lỗi được nhận diện là lỗi nạp chunk → TỰ tải lại
//      trang ĐÚNG 1 LẦN để lấy bản mới nhất; trong lúc chờ tải lại hiện
//      màn hình "đang tải lại" thân thiện thay vì trắng.
//   2. Chống vòng lặp: dấu thời gian lần tự tải lại gần nhất lưu ở
//      sessionStorage; nếu chunk VẪN lỗi trong cửa sổ RELOAD_WINDOW_MS
//      sau lần tự tải lại, không tải lại nữa — boundary hiện màn hình
//      lỗi + nút "Tải lại trang" để người dùng bấm tay.
//   3. Sự kiện `vite:preloadError` (Vite phát ra từ helper preload khi
//      một dependency của dynamic import tải lỗi) được bắt ở main.jsx
//      qua installPreloadErrorHandler() và đi chung đường khôi phục này.
//   Lỗi runtime thường (không phải lỗi nạp chunk) KHÔNG tự tải lại —
//   boundary chỉ hiện màn hình lỗi, tránh reload lặp che lỗi thật.
//
// Khác với appUpdate.js (chủ động phát hiện bản mới qua version.json rồi
// dọn cache + reload): cơ chế này là lưới đỡ PHẢN ỨNG khi chunk đã lỗi
// thật — hai cơ chế bổ sung nhau, dùng khoá sessionStorage riêng.

const RELOAD_MARK_KEY = "eduplay_chunk_reload_at";
// Cửa sổ chống lặp: chunk lỗi lại trong vòng 30s sau lần tự tải lại gần
// nhất thì coi như tải lại không cứu được → hiện màn hình lỗi.
const RELOAD_WINDOW_MS = 30 * 1000;
// Sau khi app chạy ổn định chừng này mà không sập, xoá dấu tải lại để
// một lần deploy mới sau đó (cách xa) vẫn được tự khôi phục 1 lần nữa.
const CLEAR_MARK_AFTER_MS = 15 * 1000;

const CHUNK_ERROR_PATTERNS = [
  /failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /importing a module script failed/i,
  /unable to preload css/i,
  /loading chunk [\w-]+ failed/i,
  /chunkloaderror/i,
];

/** Lỗi này có phải lỗi nạp chunk/module động không? */
export function isChunkLoadError(error) {
  if (!error) return false;
  if (error.name === "ChunkLoadError") return true;
  const message = String(error.message || error);
  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

function readReloadMark() {
  try {
    const raw = sessionStorage.getItem(RELOAD_MARK_KEY);
    const at = raw ? Number(raw) : 0;
    return Number.isFinite(at) ? at : 0;
  } catch {
    return 0;
  }
}

function writeReloadMark(at) {
  try {
    sessionStorage.setItem(RELOAD_MARK_KEY, String(at));
  } catch {
    /* sessionStorage không khả dụng — vẫn tải lại lần này, boundary
     * phía sau sẽ hiện màn hình lỗi nếu chunk tiếp tục hỏng. */
  }
}

/** Xoá dấu tự tải lại (nút bấm tay và dọn dấu sau khi app chạy ổn định). */
export function clearChunkReloadMark() {
  try {
    sessionStorage.removeItem(RELOAD_MARK_KEY);
  } catch {
    /* bỏ qua */
  }
}

/**
 * Thử tự khôi phục bằng cách tải lại trang. Trả về true nếu ĐÃ kích
 * hoạt tải lại (caller nên hiện màn hình chờ, không hiện màn hình lỗi),
 * false nếu vừa mới tự tải lại trong cửa sổ chống lặp (caller hiện màn
 * hình lỗi + nút bấm tay).
 */
export function attemptChunkRecovery() {
  const now = Date.now();
  if (now - readReloadMark() < RELOAD_WINDOW_MS) return false;
  writeReloadMark(now);
  window.location.reload();
  return true;
}

let clearTimer = null;

/**
 * App chạy ổn định sau CLEAR_MARK_AFTER_MS thì xoá dấu — gọi một lần
 * khi app mount xong. Cửa sổ chống lặp vốn chỉ 30s nên dấu cũ không
 * chặn được lần khôi phục cách xa; timer này dọn dấu sớm cho sạch và
 * để lần tự khôi phục kế tiếp (nếu có) luôn được tính từ đầu.
 */
export function scheduleChunkReloadMarkCleanup() {
  if (clearTimer) return;
  clearTimer = setTimeout(() => {
    clearTimer = null;
    clearChunkReloadMark();
  }, CLEAR_MARK_AFTER_MS);
}

let preloadHandlerInstalled = false;

/**
 * Bắt sự kiện `vite:preloadError` do Vite phát khi preload của dynamic
 * import thất bại. Cùng đường khôi phục như boundary: còn lượt tự tải
 * lại thì preventDefault (tránh Vite ném lỗi ra ngoài) + tải lại; hết
 * lượt thì KHÔNG preventDefault để lỗi ném tiếp vào React.lazy →
 * AppErrorBoundary hiện màn hình lỗi.
 */
export function installPreloadErrorHandler() {
  if (preloadHandlerInstalled || typeof window === "undefined") return;
  preloadHandlerInstalled = true;
  window.addEventListener("vite:preloadError", (event) => {
    if (attemptChunkRecovery()) {
      event.preventDefault();
    }
  });
}
