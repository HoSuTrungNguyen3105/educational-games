import { Pencil, Trash2 } from "lucide-react";

const BADGE_TONES = ["mint", "gray", "gold", "red", "blue"];
const FOOT_TONES = ["blue", "red", "muted"];

/**
 * GridCard — thẻ lưới dùng chung cho các trang quản lý trong khu dashboard,
 * theo anatomy chuẩn: badge trạng thái góc phải · tiêu đề · dòng phụ mono ·
 * mô tả (tối đa 2 dòng) · dòng meta · chân thẻ chia nút đều nhau.
 *
 * <GridCard
 *   title="Thiệp cưới"
 *   badge={{ label: "Hoạt động", tone: "mint" }}
 *   mono="thiep-cuoi"
 *   description="Thiệp cưới của tôi"
 *   meta="Thứ tự: 0"
 *   onEdit={...} onRemove={...}
 * />
 *
 * - `media`: node hiển thị trước tiêu đề (ảnh thumb, avatar…) — tùy chọn.
 * - `extra`: node tự do trong thân thẻ (chip phụ, nút copy…) — tùy chọn.
 * - Chân thẻ mặc định là Sửa/Xoá khi truyền `onEdit`/`onRemove`;
 *   muốn chân thẻ khác (vd Lớp học: "Xem học sinh" + "Xoá") thì truyền
 *   `footerActions={[{ label, icon, onClick, tone }]}`.
 * - Style nằm ở `.edu-grid-card*` trong src/styles/admin.css (cây .edu-admin).
 */
export function GridCard({
  title, badge, mono, description, meta, media, extra,
  onEdit, onRemove, editLabel = "Sửa", removeLabel = "Xoá",
  footerActions,
}) {
  const badgeTone = badge && BADGE_TONES.includes(badge.tone) ? badge.tone : "mint";

  let actions = footerActions;
  if (!actions) {
    actions = [];
    if (onEdit) actions.push({ label: editLabel, icon: <Pencil />, onClick: onEdit, tone: "blue" });
    if (onRemove) actions.push({ label: removeLabel, icon: <Trash2 />, onClick: onRemove, tone: "red" });
  }

  return (
    <div className="edu-grid-card">
      <div className="edu-grid-card-body">
        <div className="edu-grid-card-top">
          {media}
          <h3 className="edu-grid-card-title">{title}</h3>
          {badge && <span className={`edu-grid-badge edu-grid-badge--${badgeTone}`}>{badge.label}</span>}
        </div>
        {mono && <p className="edu-grid-card-mono">{mono}</p>}
        {description && <p className="edu-grid-card-desc">{description}</p>}
        {extra}
        {meta && <p className="edu-grid-card-meta">{meta}</p>}
      </div>
      {actions.length > 0 && (
        <div className="edu-grid-card-foot">
          {actions.map((a, i) => (
            <button
              key={i}
              type="button"
              onClick={a.onClick}
              className={`edu-grid-foot--${FOOT_TONES.includes(a.tone) ? a.tone : "muted"}`}
            >
              {a.icon}
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
