// lib/single.js — điểm vào cho file HTML chỉ chứa MỘT game.
//
// File HTML sinh ra gọi startSingleGame({ id, name, icon, storageKey, mount, badges }).
// Khác với initCore() của core.js (bộ dùng cho trang có sảnh chọn nhiều game),
// ở đây không có sảnh: game chạy thẳng, nút "Về sảnh" đưa người chơi ra danh sách.

/** Thông báo cho React (HtmlGameLoader) rằng người chơi bấm nút thoát. */
function quitToList() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "quit", data: {} }, "*");
    }
  } catch (e) { /* ignore */ }
  // Đứng riêng (mở file trực tiếp) → quay về trang chủ ứng dụng
  if (!window.parent || window.parent === window) {
    try { window.location.href = "/"; } catch (e) { /* ignore */ }
  }
}

/**
 * core.js gọi renderHub() khi người chơi bấm "Về sảnh" ở màn kết quả.
 * Ở chế độ 1-game không có sảnh nên chỉ cần ra khỏi game.
 */
function renderHub() { quitToList(); }

/**
 * Khởi động một game độc lập.
 * @param {object} cfg
 * @param {string} cfg.id           định danh game
 * @param {string} cfg.name        tên hiển thị
 * @param {string} cfg.icon        emoji
 * @param {string} cfg.storageKey  khoá localStorage lưu XP / điểm tốt nhất
 * @param {Function} cfg.mount     hàm nhận `root` để dựng game
 * @param {Array}   cfg.badges     huy hiệu
 */
function startSingleGame(cfg) {
  const id = cfg.id;
  const mount = cfg.mount;
  if (typeof mount !== "function") {
    console.error(`[single] game "${id}" không có hàm mount`);
    return;
  }

  // Nạp tiến độ trước khi dựng — game có thể đọc S.* ngay trong mount()
  _storageKey = cfg.storageKey || `offline_${id}`;
  BADGES = cfg.badges || [];
  _GAMES = [{ id, name: cfg.name, icon: cfg.icon, fn: mount }];
  _hubTitle = cfg.name;
  _hubDesc = "";
  _loadState();

  _bindSoundBtn();
  // Đánh dấu chế độ 1-game để CSS ẩn thanh header của sảnh (xem shell.html).
  // Không có dòng này thì header "Góc Giải Trí" vẫn chiếm chỗ ở trên và
  // người chơi phải cuộn xuống mới thấy game.
  document.body.classList.add("single");

  renderMe();
  checkBadges();

  // Dựng game
  const hub = $("#hub");
  const gameEl = $("#game");
  if (hub) hub.hidden = true;
  if (gameEl) gameEl.hidden = false;
  const title = $("#gt");
  if (title) title.textContent = cfg.name;
  const back = $("#back");
  if (back) back.onclick = quitToList;

  cleanup();
  mount($("#stage"));
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }

  // Báo về React: game đã sẵn sàng nhận init (coins, XP server, v.v.)
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "ready", data: { game: id } }, "*");
    }
  } catch (e) { /* ignore */ }
}

/** Lưu tiến độ ngay khi đóng tab (bổ sung cho lần ghi trong game). */
window.addEventListener("beforeunload", () => { if (typeof _saveState === "function") _saveState(); });
window.addEventListener("pagehide", () => { if (typeof _saveState === "function") _saveState(); });

/** Tiện ích kiểm tra tiến độ trong console: HP.info() / SAVE.info() */
if (typeof window !== "undefined") {
  window.SINGLE = { info() { console.log("[progress]", _storageKey, JSON.parse(localStorage.getItem(_storageKey) || "null")); } };
}
