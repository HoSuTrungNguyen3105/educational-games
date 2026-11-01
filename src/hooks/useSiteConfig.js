import { useEffect, useSyncExternalStore } from "react";
import { getSiteConfig, loadSiteConfig, subscribeSiteConfig } from "../lib/siteConfig.js";

/**
 * useSiteConfig — tên trang / logo / favicon / trạng thái bảo trì mà admin cài
 * ở trang Cài đặt. Trả về bản đang cache, đồng thời khởi tải lần đầu nếu app
 * chưa gọi loadSiteConfig() (App.jsx đã gọi lúc mở).
 */
export function useSiteConfig() {
  // useSyncExternalStore tự re-render khi lib/siteConfig phát hành bản mới.
  const cfg = useSyncExternalStore(subscribeSiteConfig, getSiteConfig, getSiteConfig);
  useEffect(() => { loadSiteConfig(); }, []);
  return cfg;
}
