export const TYPE_LABELS = { "play-to-learn": "Học mà chơi", "play-to-win": "Chơi để thắng" };
export const STATUS_LABELS = { published: "Đã xuất bản", draft: "Bản nháp" };

export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hôm nay";
  if (days === 1) return "hôm qua";
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
}
