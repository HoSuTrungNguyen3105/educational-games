// EnglishB1Shell.jsx — khung chung cho MỌI trang trong phân hệ English B1:
// thanh đầu (về trang chủ + tiêu đề), tab điều hướng 9 mục, khu nội dung.
// App.jsx bọc RouteShell (showBack=false) nên ở đây tự có nút "Về trang chủ".
import { navigate } from "../../lib/router.js";
import {
  LayoutDashboard, BookOpen, SpellCheck, Headphones, Newspaper,
  PenLine, Mic, ClipboardCheck, BarChart3, ArrowLeft, Flame,
} from "lucide-react";

const TABS = [
  { key: "dashboard", label: "Tổng quan", icon: LayoutDashboard, path: "/english-b1" },
  { key: "vocabulary", label: "Từ vựng", icon: BookOpen, path: "/english-b1/vocabulary" },
  { key: "grammar", label: "Ngữ pháp", icon: SpellCheck, path: "/english-b1/grammar" },
  { key: "listening", label: "Listening", icon: Headphones, path: "/english-b1/listening" },
  { key: "reading", label: "Reading", icon: Newspaper, path: "/english-b1/reading" },
  { key: "writing", label: "Writing", icon: PenLine, path: "/english-b1/writing" },
  { key: "speaking", label: "Speaking", icon: Mic, path: "/english-b1/speaking" },
  { key: "exams", label: "Luyện đề", icon: ClipboardCheck, path: "/english-b1/exams" },
  { key: "progress", label: "Tiến độ", icon: BarChart3, path: "/english-b1/progress" },
];

/**
 * @param {object} props
 * @param {string} props.active   key tab đang mở (xem TABS)
 * @param {string} [props.title]      tiêu đề trang (mặc định = label tab)
 * @param {string} [props.subtitle]   mô tả nhỏ dưới tiêu đề
 * @param {object} [props.userAuth]   { user } — hiển thị tên người học (nếu đăng nhập)
 * @param {import("react").ReactNode} [props.actions] nút phía phải tiêu đề
 * @param {number} [props.streak]     số ngày học liên tục (hiển thị lửa)
 */
export default function EnglishB1Shell({
  active, title, subtitle, userAuth, actions, streak, children,
}) {
  const current = TABS.find((t) => t.key === active) || TABS[0];
  const heading = title || current.label;
  const userName = userAuth?.user?.displayName || userAuth?.user?.name || userAuth?.user?.username;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-paper text-ink">
      {/* ── Thanh đầu ── */}
      <header className="shrink-0 border-b border-ink/10 bg-paper/95 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-3 pb-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="shrink-0 inline-flex items-center gap-1.5 text-sm text-[#8A7C63] hover:text-ink transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Về trang chủ</span>
            </button>

            <div className="min-w-0 flex-1 flex items-baseline gap-2.5 flex-wrap">
              <span className="font-display text-xs font-bold tracking-widest uppercase text-teal">
                English&nbsp;B1
              </span>
              <h1 className="font-display text-base sm:text-lg text-ink truncate">{heading}</h1>
              {subtitle && (
                <p className="text-xs text-[#8A7C63] font-body w-full sm:w-auto truncate">{subtitle}</p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {Number.isFinite(streak) && streak > 0 && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gold/15 text-[11px] font-mono font-semibold text-ink"
                  title="Số ngày học liên tục"
                >
                  <Flame className="w-3.5 h-3.5 text-ticket" />
                  {streak}
                </span>
              )}
              {userName && (
                <span className="hidden sm:inline-block max-w-[140px] truncate text-xs font-body text-[#8A7C63]">
                  {userName}
                </span>
              )}
              {actions}
            </div>
          </div>

          {/* ── Tab điều hướng (cuộn ngang trên mobile) ── */}
          <nav className="-mx-4 md:mx-0 mt-2 overflow-x-auto no-scrollbar" aria-label="Điều hướng English B1">
            <ul className="flex items-center gap-1 px-4 md:px-0 min-w-max">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.key === active;
                return (
                  <li key={tab.key}>
                    <button
                      type="button"
                      onClick={() => navigate(tab.path)}
                      aria-current={isActive ? "page" : undefined}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-body whitespace-nowrap transition ${
                        isActive
                          ? "bg-ink text-paper font-semibold"
                          : "text-[#8A7C63] hover:text-ink hover:bg-ink/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {/* ── Nội dung ── */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-6 pb-24 lg:pb-10">
        {children}
      </main>
    </div>
  );
}

/** Danh sách tab — trang khác có thể dùng để tự tính "tab kế tiếp". */
export const B1_TABS = TABS;
