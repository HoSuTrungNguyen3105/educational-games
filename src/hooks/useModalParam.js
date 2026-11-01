// useModalParam.js — đồng bộ trạng thái modal lên URL (hash query).
//
// Mỗi lần mở modal, URL mang params giống trang HiWeb:
//   #/admin/roles?m=rolePerms&role=teacher   → modal "Xem quyền hạn" của vai trò teacher
//   #/admin/support?m=supportDetail&tid=spk-… → modal chi tiết ticket
// Khi đóng modal (hoặc bấm nút Back của trình duyệt) params bị xoá khỏi URL,
// và nếu tải trang / dán link có sẵn params thì modal tương ứng tự mở lại.
//
// Cách dùng tối thiểu trong một trang:
//   const modal = useModalParam();
//   mở :  modal.open("roleCreate")            / modal.open("rolePerms", { role: key })
//   đóng:  modal.close("roleCreate")           (bỏ trống tên = xoá mọi modal param)
//   đọc :  modal.modal === "rolePerms", modal.params.get("role")
// Muốn modal tự mở khi vào thẳng link, so sánh modal.modal trong useEffect
// khởi tạo của trang (xem RoleManagement.jsx làm mẫu).

import { useCallback, useEffect, useMemo, useState } from "react";

/** Phần query sau dấu "?" của hash hiện tại ("" nếu không có). */
function readHashQuery() {
  const hash = window.location.hash || "";
  const qi = hash.indexOf("?");
  return qi === -1 ? "" : hash.slice(qi + 1);
}

/** Đường dẫn hash không kèm query, luôn bắt đầu bằng "#/". */
function hashPath() {
  const hash = (window.location.hash || "").replace(/^#/, "") || "/";
  return `#${hash.split("?")[0].split("#")[0]}`;
}

export function useModalParam() {
  const [search, setSearch] = useState(readHashQuery);

  useEffect(() => {
    const onHashChange = () => setSearch(readHashQuery());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const params = useMemo(() => new URLSearchParams(search), [search]);
  const modal = params.get("m") || "";

  const open = useCallback((name, extra = {}) => {
    const q = new URLSearchParams({ m: name });
    for (const [key, value] of Object.entries(extra)) {
      if (value != null && value !== "") q.set(key, String(value));
    }
    // Gán trực tiếp (không dùng navigate()) để không bị cuộn lên đầu trang.
    // Hash không đổi → không phát sinh hashchange thừa.
    const target = `${hashPath()}?${q.toString()}`;
    if (window.location.hash !== target) window.location.hash = target;
  }, []);

  /** Đóng modal: chỉ xoá params khi modal đang ghi trong URL đúng là `name`. */
  const close = useCallback((name) => {
    const current = new URLSearchParams(readHashQuery());
    if (name && current.get("m") !== name) return;
    const target = hashPath();
    if (window.location.hash !== target) window.location.hash = target;
  }, []);

  return { modal, params, open, close };
}
