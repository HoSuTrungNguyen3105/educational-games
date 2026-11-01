// Ảnh đại diện template — thay hoàn toàn cho icon/emoji (theo spec Supabase).
// - Có `thumbnail` (URL ảnh trên Supabase Storage) → hiển thị ảnh, cắt tròn.
// - Không có ảnh → placeholder trung tính bằng CSS (chữ cái đầu của tên,
//   nền + viền giống hệt stamp-token cũ) — KHÔNG dùng emoji, KHÔNG tạo ảnh giả.
// Layout/giữ nguyên kích thước: passed-in size dùng cho cả 2 trạng thái.
export function TemplateThumb({ thumbnail, name = "", ring = "#F4B942", size = 56, className = "", imgAlt }) {
  const initial = String(name || "").trim().charAt(0).toUpperCase();
  const style = { "--ring": ring, width: size, height: size };

  if (thumbnail) {
    return (
      <div className={`stamp-token overflow-hidden ${className}`} style={style}>
        <img
          src={thumbnail}
          alt={imgAlt ?? (name || "Ảnh đại diện")}
          loading="lazy"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    );
  }
  return (
    <div className={`stamp-token ${className}`} style={style}>
      <span
        aria-hidden="true"
        style={{ fontSize: Math.round(size * 0.42), color: ring, fontWeight: 700, lineHeight: 1 }}
      >
        {initial || "\u00A0"}
      </span>
    </div>
  );
}
