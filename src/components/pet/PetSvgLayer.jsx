// components/pet/PetSvgLayer.jsx
//
// Vẽ MỘT lớp SVG của pet (một file asset, hoặc một group có id bên trong file).
//
// Vì sao dùng `dangerouslySetInnerHTML`:
//   asset nạp bằng `?raw` là chuỗi. Nhúng thẳng vào DOM giữ nguyên <defs>,
//   <linearGradient> và viewBox — nếu tạo <img src="data:..."> thì không ghép
//   được nhiều lớp chồng lên nhau và không kế thừa được CSS variable cho màu.
//
// An toàn: toàn bộ nội dung đến từ file `.svg` trong chính repo (import tĩnh),
// không phải chuỗi từ API/server. Không có <script>, không tham chiếu ngoài.

import { useMemo } from "react";

/**
 * @param {string} asset     nội dung file .svg (đã nạp ?raw và ĐÃ thay màu token)
 * @param {number} zIndex    thứ tự vẽ
 * @param {string} label     nhãn a11y, chỉ dùng cho lớp chính
 */
export default function PetSvgLayer({ asset, zIndex = 0, label }) {
  const style = useMemo(() => ({ position: "absolute", inset: 0, zIndex }), [zIndex]);

  if (!asset) return null;

  // Bỏ width/height cứng để lớp co giãn theo khung bọc; giữ nguyên viewBox.
  const html = asset
    .replace(/\swidth="[^"]*"/, "")
    .replace(/\sheight="[^"]*"/, "")
    .replace(/<svg /, '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" ');

  return (
    <span
      className="pointer-events-none absolute inset-0 block"
      style={style}
      role={label ? "img" : "presentation"}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}