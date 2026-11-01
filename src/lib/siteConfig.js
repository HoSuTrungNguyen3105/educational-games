import { systemService } from "../services/api.js";

/**
 * siteConfig — bộ nhớ đệm cấu hình công khai của hệ thống (tên trang, logo,
 * favicon, banner bảo trì) do admin cài ở trang Cài đặt.
 *
 * Lý do đặt ở module riêng thay vì prop drilling: các thành phần hiển thị
 * thương hiệu (HomeScreen, TeacherLayout, banner trong App) nằm ở nhiều tầng
 * khác nhau. Module này tải MỘT lần lúc mở app, trang Cài đặt gọi
 * loadSiteConfig({force:true}) sau khi lưu để đổi ngay lập tức.
 *
 * Endpoint /api/public-config là endpoint công khai, server đã lọc — chỉ trả
 * tên trang, link logo/favicon và nội dung bảo trì, không chứa khoá bí mật.
 */

/** Cấu hình đang dùng — trùng với mặc định của server để app hiển thị y như cũ. */
const FALLBACK = {
  site: { name: "", logoUrl: "", faviconUrl: "" },
  maintenance: { enabled: false, message: "", until: "" },
};

let state = FALLBACK;
const listeners = new Set();
let inflight = null;

/** Tên trang gốc trong index.html — giữ lại để phục hồi khi admin xoá cấu hình. */
const DEFAULT_TITLE = typeof document !== "undefined" ? document.title : "";

function normalize(cfg) {
  if (!cfg || typeof cfg !== "object") return FALLBACK;
  const site = cfg.site || {};
  const mt = cfg.maintenance || {};
  return {
    site: {
      // "" = admin chưa đặt → mọi chỗ hiển thị tên trang tự fallback về chữ
      // đang có trong mã nguồn (title index.html, "Lớp Học Vui" ở trang chủ).
      name: String(site.name || "").trim(),
      logoUrl: String(site.logoUrl || "").trim(),
      faviconUrl: String(site.faviconUrl || "").trim(),
    },
    maintenance: {
      enabled: mt.enabled === true,
      message: String(mt.message || ""),
      until: String(mt.until || ""),
    },
  };
}

/**
 * Áp thương hiệu động: tiêu đề tab + favicon.
 * Favicon cấu hình được thêm thành <link id="site-favicon"> đứng sau các link
 * trong index.html (trình duyệt lấy link cuối), nên khi cấu hình trống app vẫn
 * dùng đúng icon cũ — không cần sửa file build.
 */
function applyBranding({ site }) {
  if (typeof document === "undefined") return;
  if (site.name) document.title = site.name;
  else if (DEFAULT_TITLE) document.title = DEFAULT_TITLE;

  document.getElementById("site-favicon")?.remove();
  document.getElementById("site-touch-icon")?.remove();
  if (!site.faviconUrl) return;
  const icon = document.createElement("link");
  icon.id = "site-favicon";
  icon.rel = "icon";
  icon.href = site.faviconUrl;
  document.head.appendChild(icon);
  const touch = document.createElement("link");
  touch.id = "site-touch-icon";
  touch.rel = "apple-touch-icon";
  touch.href = site.faviconUrl;
  document.head.appendChild(touch);
}

function emit() {
  for (const fn of listeners) fn(state);
}

export function getSiteConfig() {
  return state;
}

export function subscribeSiteConfig(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Tải cấu hình công khai. Không ném lỗi ra ngoài: API chưa sẵn sàng (offline,
 * server cũ chưa có route) thì app vẫn chạy với giao diện mặc định.
 */
export function loadSiteConfig({ force = false } = {}) {
  if (inflight && !force) return inflight;
  inflight = systemService
    .publicConfig()
    .then((cfg) => {
      inflight = null;
      state = normalize(cfg);
      applyBranding(state);
      emit();
      return state;
    })
    .catch(() => {
      inflight = null;
      return state;
    });
  return inflight;
}
