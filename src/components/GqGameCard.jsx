/** Ô game DÙNG CHUNG cho trang chủ lẫn trang Danh mục: vòng tròn ảnh/icon,
 *  badge Học/Chơi/Mới, tên + pill tuổi. Style nằm ở home-gq.css (.gq-card). */
export default function GqGameCard({ icon, name, tint, badge, age, note, thumb, play }) {
  return (
    <button
      onClick={play}
      aria-label={`Chơi ${name}`}
      title={name}
      className="gq-card"
    >
      {badge && (
        <span className={`gq-card__badge gq-card__badge--${badge === "Mới" ? "new" : badge === "Học" ? "learn" : "play"}`}>
          {badge}
        </span>
      )}
      <span
        className="gq-card__ring"
        style={{ backgroundColor: tint }}
        aria-hidden="true"
      >
        {thumb ? <img src={thumb} alt="" loading="lazy" /> : (icon || String(name || " ").trim().charAt(0).toUpperCase())}
      </span>
      <span className="gq-card__name">{name}</span>
      {age && <span className="gq-card__age">{age}</span>}
      {note && <span className="gq-card__note">{note}</span>}
    </button>
  );
}
