// scratch/ssr-entry.jsx — cầu nối cho `vite build --ssr` để kiểm tra trang
// Cài đặt có crash ngay lần render đầu không (thiếu import, sai tên biến, truy
// cập object chưa load…). Chạy:
//   npx vite build --ssr scratch/ssr-entry.jsx --outDir scratch/ssr-out --emptyOutDir
//   node scratch/admin-settings-render.mjs   (cwd = gốc repo)

import { renderToString } from "react-dom/server";
import AdminSettings from "../src/pages/teacher/AdminSettings.jsx";

export function render(props) {
  return renderToString(<AdminSettings {...props} />);
}
