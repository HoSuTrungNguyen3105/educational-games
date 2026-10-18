/**
 * Mascot.jsx — mặt Gạo, nhân vật hướng dẫn của web.
 *
 * Vẽ bằng SVG nên không phụ thuộc file ảnh, đổi kích thước thoải mái.
 */

export default function Mascot({ size = 96, className = "", style }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label="Nhân vật Gạo"
      className={className}
      style={{ flexShrink: 0, filter: "drop-shadow(0 3px 6px rgba(0,0,0,.14))", ...style }}
    >
      {/* tai */}
      <ellipse cx="22" cy="52" rx="11" ry="14" fill="#fff" />
      <ellipse cx="98" cy="52" rx="11" ry="14" fill="#fff" />
      {/* mặt */}
      <circle cx="60" cy="60" r="46" fill="#fff" stroke="#E6D9C4" strokeWidth="2" />
      {/* mắt */}
      <ellipse cx="45" cy="50" rx="13" ry="16" fill="#1c2333" />
      <ellipse cx="75" cy="50" rx="13" ry="16" fill="#1c2333" />
      <circle cx="49" cy="45" r="5" fill="#fff" />
      <circle cx="79" cy="45" r="5" fill="#fff" />
      {/* má */}
      <ellipse cx="30" cy="68" rx="9" ry="5.5" fill="#ff8fb3" opacity=".65" />
      <ellipse cx="90" cy="68" rx="9" ry="5.5" fill="#ff8fb3" opacity=".65" />
      {/* miệng cười */}
      <path d="M44 72 Q60 92 76 72 Z" fill="#e8443c" />
      <path d="M52 74 Q60 84 68 74 Z" fill="#ff8a8a" />
    </svg>
  );
}