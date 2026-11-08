import { FileText, Presentation } from "lucide-react";
import "./templateLibrary.css";

// TemplateThumbnail — hình thu nhỏ của từng mẫu, dựng bằng CSS theo đúng
// bảng màu/bố cục của mẫu. Không dùng ảnh stock giống nhau cho mọi mẫu.
function Lines({ count = 3, widths = ["92%", "84%", "74%"], className = "" }) {
  return (
    <span className={`tpl-mini-lines ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="tpl-mini-line" style={{ width: widths[i % widths.length] }} />
      ))}
    </span>
  );
}

function WordThumb({ t }) {
  const a = t.theme.accent;
  const b = t.theme.accent2;
  const soft = t.theme.soft;
  const layout = t.thumb.layout;
  const style = { "--mini-a": a, "--mini-b": b, "--mini-soft": soft, "--mini-line": t.theme.line };

  const body = (() => {
    switch (layout) {
      case "worksheet":
        return (
          <>
            <span className="tpl-mini-pill" style={{ background: soft, color: a }}>Phiếu học tập · Tuần 5</span>
            <span className="tpl-mini-heading center" style={{ color: a }}>{t.name}</span>
            <span className="tpl-mini-dash-row"><i /><i /></span>
            <Lines count={2} widths={["100%", "72%"]} />
            <span className="tpl-mini-blanks"><i /><i /><i /></span>
            <span className="tpl-mini-star">★</span>
          </>
        );
      case "exam":
        return (
          <>
            <span className="tpl-mini-toprow"><i>TRƯỜNG THCS</i><i>Mã đề 01</i></span>
            <span className="tpl-mini-heading center" style={{ color: a }}>{t.name}</span>
            <span className="tpl-mini-double-rule" />
            <span className="tpl-mini-table">
              <i /><i /><i /><i />
            </span>
            <Lines count={4} widths={["96%", "90%", "84%", "66%"]} />
          </>
        );
      case "study":
        return (
          <>
            <span className="tpl-mini-rail" style={{ background: a }} />
            <span className="tpl-mini-heading" style={{ color: a }}>{t.name}</span>
            <span className="tpl-mini-numbered"><i>1</i><Lines count={2} widths={["88%", "66%"]} /></span>
            <span className="tpl-mini-numbered"><i>2</i><Lines count={2} widths={["92%", "70%"]} /></span>
            <span className="tpl-mini-numbered"><i>3</i><Lines count={1} widths={["78%"]} /></span>
          </>
        );
      case "homework":
        return (
          <>
            <span className="tpl-mini-pill" style={{ background: soft, color: a }}>Homework · Week 8</span>
            <span className="tpl-mini-heading" style={{ color: a }}>{t.name}</span>
            <span className="tpl-mini-check"><i>✓</i><span /></span>
            <span className="tpl-mini-check"><i>✓</i><span /></span>
            <span className="tpl-mini-check"><i>✓</i><span /></span>
            <span className="tpl-mini-check muted"><i>☐</i><span /></span>
            <span className="tpl-mini-note" style={{ borderColor: b }}>Hạn nộp: 14/11</span>
          </>
        );
      case "group":
        return (
          <>
            <span className="tpl-mini-heading" style={{ color: a }}>{t.name}</span>
            <span className="tpl-mini-cards">
              <i style={{ background: soft, borderColor: a }} />
              <i style={{ background: soft, borderColor: b }} />
            </span>
            <span className="tpl-mini-table compact">
              <i /><i /><i /><i /><i /><i />
            </span>
            <Lines count={2} widths={["92%", "70%"]} />
          </>
        );
      case "manual":
        return (
          <>
            <span className="tpl-mini-toprow"><i>PHÒNG THÍ NGHIỆM</i><i>Bài 4</i></span>
            <span className="tpl-mini-heading" style={{ color: a }}>{t.name}</span>
            <span className="tpl-mini-step"><i style={{ background: a }}>1</i><span /></span>
            <span className="tpl-mini-step"><i style={{ background: a }}>2</i><span /></span>
            <span className="tpl-mini-step"><i style={{ background: a }}>3</i><span /></span>
            <span className="tpl-mini-step"><i style={{ background: a }}>4</i><span /></span>
          </>
        );
      case "report":
        return (
          <>
            <span className="tpl-mini-band" style={{ background: a }} />
            <span className="tpl-mini-heading" style={{ color: a }}>{t.name}</span>
            <span className="tpl-mini-stats">
              <i style={{ color: a }}>8,6<small>Toán</small></i>
              <i style={{ color: b }}>9,0<small>Tin học</small></i>
              <i style={{ color: t.theme.muted }}>Tốt<small>Xếp loại</small></i>
            </span>
            <span className="tpl-mini-table"><i /><i /><i /><i /><i /><i /></span>
          </>
        );
      case "editorial":
        return (
          <>
            <span className="tpl-mini-editorial-image" style={{ background: `linear-gradient(135deg, ${soft}, ${t.theme.line})` }}>
              <i style={{ background: a }} />
              <i style={{ background: b }} />
              <i style={{ background: "rgba(255,255,255,.8)" }} />
            </span>
            <span className="tpl-mini-heading serif" style={{ color: a }}>{t.name}</span>
            <Lines count={3} widths={["100%", "94%", "80%"]} />
            <span className="tpl-mini-caption">Hình 1. Minh họa bài đọc</span>
          </>
        );
      case "project":
        return (
          <>
            <span className="tpl-mini-heading" style={{ color: a }}>{t.name}</span>
            <span className="tpl-mini-timeline">
              <i style={{ background: a }} /><span style={{ background: soft }}>Tuần 1</span>
              <i style={{ background: b }} /><span style={{ background: soft }}>Tuần 2</span>
              <i style={{ background: a }} /><span style={{ background: soft }}>Tuần 3</span>
              <i style={{ background: b }} /><span style={{ background: soft }}>Tuần 4</span>
            </span>
            <span className="tpl-mini-table compact"><i /><i /><i /><i /></span>
          </>
        );
      default: // classic
        return (
          <>
            <span className="tpl-mini-toprow"><i>TRƯỜNG THCS</i><i>Năm học 2026–2027</i></span>
            <span className="tpl-mini-heading serif" style={{ color: a }}>{t.name}</span>
            <span className="tpl-mini-rule" style={{ background: a }} />
            <span className="tpl-mini-info-table">
              <i /><i /><i /><i />
            </span>
            <span className="tpl-mini-section" style={{ background: a }}>I. MỤC TIÊU BÀI HỌC</span>
            <Lines count={3} widths={["96%", "88%", "70%"]} />
            <span className="tpl-mini-section light" style={{ color: a, borderColor: t.theme.line }}>II. TIẾN TRÌNH DẠY HỌC</span>
            <span className="tpl-mini-table"><i /><i /><i /><i /><i /><i /></span>
          </>
        );
    }
  })();

  return (
    <div className={`tpl-thumb tpl-thumb-word tpl-thumb-${layout}`} style={style}>
      <div className="tpl-thumb-paper">
        <span className="tpl-thumb-page-badge"><FileText className="w-3 h-3" /> {t.pageCount} trang</span>
        {body}
      </div>
    </div>
  );
}

function PptThumb({ t }) {
  const a = t.theme.accent;
  const b = t.theme.accent2;
  const soft = t.theme.soft;
  const hero = t.theme.heroBg;
  const layout = t.thumb.layout;
  const style = { "--mini-a": a, "--mini-b": b, "--mini-soft": soft, "--mini-hero": hero };

  const body = (() => {
    switch (layout) {
      case "science":
        return (
          <>
            <span className="tpl-mini-slide tpl-mini-slide-hero" style={{ background: hero }}>
              <span className="tpl-mini-ring" style={{ borderColor: a }} />
              <span className="tpl-mini-slide-kicker" style={{ color: t.theme.heroText }}>KHOA HỌC · KHÁM PHÁ</span>
              <span className="tpl-mini-slide-title" style={{ color: t.theme.heroText }}>{t.name}</span>
              <span className="tpl-mini-slide-sub" style={{ color: t.theme.heroText }}>Sơ đồ · Thí nghiệm · Vận dụng</span>
              <span className="tpl-mini-molecule" style={{ background: b }} />
            </span>
            <span className="tpl-mini-filmstrip">
              <i style={{ background: soft }} /><i style={{ background: soft }} /><i style={{ background: soft }} />
            </span>
          </>
        );
      case "minimal":
        return (
          <>
            <span className="tpl-mini-slide tpl-mini-slide-minimal" style={{ background: "#fff", borderColor: t.theme.line }}>
              <span className="tpl-mini-slide-number">01</span>
              <span className="tpl-mini-slide-kicker" style={{ color: t.theme.muted }}>NGỮ VĂN 10 · BÀI 4</span>
              <span className="tpl-mini-slide-title serif" style={{ color: t.theme.ink }}>{t.name}</span>
              <span className="tpl-mini-minimal-rule" style={{ background: t.theme.ink }} />
              <span className="tpl-mini-slide-sub" style={{ color: t.theme.muted }}>Đọc hiểu · Phân tích · Thảo luận</span>
              <span className="tpl-mini-minimal-square" />
            </span>
            <span className="tpl-mini-filmstrip">
              <i style={{ background: "#f8fafc" }} /><i style={{ background: "#f1f5f9" }} /><i style={{ background: "#e2e8f0" }} />
            </span>
          </>
        );
      case "kids":
        return (
          <>
            <span className="tpl-mini-slide tpl-mini-slide-hero" style={{ background: hero }}>
              <span className="tpl-mini-confetti" />
              <span className="tpl-mini-slide-kicker" style={{ color: t.theme.heroText }}>TIẾNG VIỆT · LỚP 2</span>
              <span className="tpl-mini-slide-title" style={{ color: t.theme.heroText }}>{t.name}</span>
              <span className="tpl-mini-slide-sub" style={{ color: t.theme.heroText }}>Học vui · Nhớ lâu · Sáng tạo</span>
              <span className="tpl-mini-kid-cards">
                <i style={{ background: soft }} /><i style={{ background: "#fef3c7" }} /><i style={{ background: "#ffe4e6" }} />
              </span>
            </span>
            <span className="tpl-mini-filmstrip">
              <i style={{ background: "#fff7ed" }} /><i style={{ background: "#ffedd5" }} /><i style={{ background: "#fef3c7" }} />
            </span>
          </>
        );
      case "history":
        return (
          <>
            <span className="tpl-mini-slide tpl-mini-slide-history" style={{ background: soft }}>
              <span className="tpl-mini-paper-lines" />
              <span className="tpl-mini-seal" style={{ borderColor: a, color: a }}>1954</span>
              <span className="tpl-mini-slide-kicker" style={{ color: a }}>LỊCH SỬ 9 · CHIẾN DỊCH</span>
              <span className="tpl-mini-slide-title serif" style={{ color: t.theme.ink }}>{t.name}</span>
              <span className="tpl-mini-map-line" style={{ borderColor: b }} />
              <span className="tpl-mini-slide-sub" style={{ color: t.theme.muted }}>13/3 – 7/5/1954</span>
            </span>
            <span className="tpl-mini-filmstrip">
              <i style={{ background: "#f5efe2" }} /><i style={{ background: "#e7d7b8" }} /><i style={{ background: "#f5efe2" }} />
            </span>
          </>
        );
      case "math":
        return (
          <>
            <span className="tpl-mini-slide tpl-mini-slide-math" style={{ background: "#fff" }}>
              <span className="tpl-mini-grid" />
              <span className="tpl-mini-slide-kicker" style={{ color: a }}>TOÁN HỌC TRỰC QUAN</span>
              <span className="tpl-mini-slide-title" style={{ color: t.theme.ink }}>{t.name}</span>
              <span className="tpl-mini-formula" style={{ color: a }}>(a + b)² = a² + 2ab + b²</span>
              <span className="tpl-mini-squares">
                <i style={{ background: soft }} /><i style={{ background: "#fde68a" }} /><i style={{ background: "#fca5a5" }} />
              </span>
            </span>
            <span className="tpl-mini-filmstrip">
              <i style={{ background: "#eef2ff" }} /><i style={{ background: "#e0e7ff" }} /><i style={{ background: "#c7d2fe" }} />
            </span>
          </>
        );
      case "language":
        return (
          <>
            <span className="tpl-mini-slide tpl-mini-slide-language" style={{ background: soft }}>
              <span className="tpl-mini-bubble left" style={{ background: a }} />
              <span className="tpl-mini-bubble right" style={{ background: "#fff", borderColor: b }} />
              <span className="tpl-mini-slide-kicker" style={{ color: a }}>ENGLISH 8 · UNIT 5</span>
              <span className="tpl-mini-slide-title" style={{ color: t.theme.ink }}>{t.name}</span>
              <span className="tpl-mini-slide-sub" style={{ color: t.theme.muted }}>Have / has + V3 · Experiences</span>
            </span>
            <span className="tpl-mini-filmstrip">
              <i style={{ background: "#f5f3ff" }} /><i style={{ background: "#ede9fe" }} /><i style={{ background: "#e0f2fe" }} />
            </span>
          </>
        );
      case "infographic":
        return (
          <>
            <span className="tpl-mini-slide tpl-mini-slide-info" style={{ background: "#fff" }}>
              <span className="tpl-mini-slide-kicker" style={{ color: a }}>EDUCATIONAL INFOGRAPHIC</span>
              <span className="tpl-mini-slide-title" style={{ color: t.theme.ink }}>{t.name}</span>
              <span className="tpl-mini-info-bars">
                <i style={{ background: a, height: "34%" }} /><i style={{ background: b, height: "54%" }} /><i style={{ background: a, height: "74%" }} /><i style={{ background: b, height: "94%" }} />
              </span>
              <span className="tpl-mini-donut" style={{ borderColor: a, borderRightColor: b }}>71%</span>
              <span className="tpl-mini-info-labels"><i /><i /><i /></span>
            </span>
            <span className="tpl-mini-filmstrip">
              <i style={{ background: "#f0fdfa" }} /><i style={{ background: "#ccfbf1" }} /><i style={{ background: "#99f6e4" }} />
            </span>
          </>
        );
      case "corporate":
        return (
          <>
            <span className="tpl-mini-slide tpl-mini-slide-corporate" style={{ background: "#fff" }}>
              <span className="tpl-mini-corp-bar" style={{ background: a }} />
              <span className="tpl-mini-glyph-grid" />
              <span className="tpl-mini-slide-kicker" style={{ color: a }}>BÁO CÁO CHUYÊN ĐỀ · 2026</span>
              <span className="tpl-mini-slide-title serif" style={{ color: t.theme.ink }}>{t.name}</span>
              <span className="tpl-mini-corp-chart">
                <i style={{ background: "#bfdbfe", height: "36%" }} /><i style={{ background: "#93c5fd", height: "56%" }} /><i style={{ background: "#60a5fa", height: "76%" }} /><i style={{ background: a, height: "94%" }} />
              </span>
              <span className="tpl-mini-corp-stat" style={{ color: a }}>86%<small>giáo viên dùng học liệu số</small></span>
            </span>
            <span className="tpl-mini-filmstrip">
              <i style={{ background: "#eff6ff" }} /><i style={{ background: "#dbeafe" }} /><i style={{ background: "#bfdbfe" }} />
            </span>
          </>
        );
      case "story":
        return (
          <>
            <span className="tpl-mini-slide tpl-mini-slide-story" style={{ background: soft }}>
              <span className="tpl-mini-sun" style={{ background: b }} />
              <span className="tpl-mini-tree" style={{ background: a }} />
              <span className="tpl-mini-slide-kicker" style={{ color: a }}>STORYTELLING · ĐẠO ĐỨC 5</span>
              <span className="tpl-mini-slide-title" style={{ color: t.theme.ink }}>{t.name}</span>
              <span className="tpl-mini-story-card" style={{ borderColor: b }}>“Trung thực bắt đầu từ việc nhỏ nhất.”</span>
            </span>
            <span className="tpl-mini-filmstrip">
              <i style={{ background: "#fffbeb" }} /><i style={{ background: "#fef3c7" }} /><i style={{ background: "#fde68a" }} />
            </span>
          </>
        );
      default: // modern / primary
        return (
          <>
            <span className="tpl-mini-slide tpl-mini-slide-hero" style={{ background: hero }}>
              <span className="tpl-mini-slide-circle one" style={{ background: a }} />
              <span className="tpl-mini-slide-circle two" style={{ background: b }} />
              <span className="tpl-mini-slide-kicker" style={{ color: t.theme.heroText }}>EDUPLAY · BÀI GIẢNG</span>
              <span className="tpl-mini-slide-title" style={{ color: t.theme.heroText }}>{t.name}</span>
              <span className="tpl-mini-slide-sub" style={{ color: t.theme.heroText }}>Mục tiêu · Ví dụ · Luyện tập</span>
              <span className="tpl-mini-slide-cards">
                <i style={{ background: soft }} /><i style={{ background: "#fef3c7" }} /><i style={{ background: "#dbeafe" }} />
              </span>
            </span>
            <span className="tpl-mini-filmstrip">
              <i style={{ background: "#eff6ff" }} /><i style={{ background: "#dbeafe" }} /><i style={{ background: "#bfdbfe" }} />
            </span>
          </>
        );
    }
  })();

  return (
    <div className={`tpl-thumb tpl-thumb-ppt tpl-thumb-${layout}`} style={style}>
      <span className="tpl-thumb-slide-badge"><Presentation className="w-3 h-3" /> {t.slideCount} slide · 16:9</span>
      {body}
    </div>
  );
}

export default function TemplateThumbnail({ template }) {
  return template?.kind === "powerpoint"
    ? <PptThumb t={template} />
    : <WordThumb t={template} />;
}
