// useHashParam.js — đồng bộ MỘT giá trị trạng thái với query trong hash.
//
// Router tự chế của app bỏ qua query khi match route, nên các trang tự đọc
// query sau dấu "?" của hash (mẫu: ?tab= của AvatarManagement, ?m= của
// useModalParam). Hook này gói đúng vòng đó cho một param có danh sách giá
// trị hợp lệ:
//
//   const [panel, setPanel] = useHashParam("panel", PANEL_IDS, "home");
//
// - Khởi tạo + hashchange (back/forward, dán link, route khác trỏ vào kèm
//   query): đọc từ URL; giá trị lạ/không hợp lệ → rơi về `fallback`.
// - setValue: cập nhật state + viết lại URL bằng history.replaceState —
//   KHÔNG phát hashchange (tránh useRoute cuộn lên đầu trang), KHÔNG thêm
//   mục history cho mỗi lần đổi, và GIỮ NGUYÊN các param khác đang có
//   trên hash (vd ?m= của modal).
import { useCallback, useEffect, useState } from "react";

function readHashQuery() {
  const hash = window.location.hash || "";
  const qi = hash.indexOf("?");
  return qi === -1 ? "" : hash.slice(qi + 1);
}

function hashPath() {
  const hash = (window.location.hash || "").replace(/^#/, "") || "/";
  return `#${hash.split("?")[0].split("#")[0]}`;
}

export function useHashParam(name, validValues, fallback) {
  // Nối danh sách hợp lệ thành một khoá ổn định để callback đọc URL không
  // phải tạo lại mỗi render dù caller truyền mảng mới.
  const validKey = validValues.join("|");

  const read = useCallback(() => {
    const v = new URLSearchParams(readHashQuery()).get(name);
    return v && validKey.split("|").includes(v) ? v : fallback;
  }, [name, fallback, validKey]);

  const [value, setValueState] = useState(read);

  useEffect(() => {
    const sync = () => setValueState(read());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [read]);

  const setValue = useCallback((next) => {
    setValueState(next);
    const q = new URLSearchParams(readHashQuery());
    q.set(name, String(next));
    const target = `${hashPath()}?${q.toString()}`;
    if (window.location.hash !== target) {
      window.history.replaceState(null, "", target);
    }
  }, [name]);

  return [value, setValue];
}

export default useHashParam;
