import { ClipboardList, Gamepad2, House, LayoutGrid, MessageCircle } from "lucide-react";
import { IconUser } from "./ui";
import { navigate } from "../lib/router.js";

/* ════════════════════════════════════════════════════════════════════
   THANH ĐIỀU HƯỚNG DƯỚI CÙNG (mobile, chỉ hiện dưới breakpoint lg) —
   component DÙNG CHUNG cho trang chủ và trang Danh mục (/categories).
   Trước 2026-11-09 thanh này chỉ sống bên trong HomeScreen nên sang
   trang Danh mục là mất hẳn đường điều hướng; nay tách ra đây (cùng
   đợt với src/components/GqGameCard.jsx) để hai trang dùng đúng một
   bản — cấm copy markup sang trang khác.

   - Mục dạng "path": điều hướng thẳng (Trang chủ, Danh mục, Nhiệm vụ
     → /daily-tasks, Tin nhắn → /chat, Cá nhân → /profile).
   - Mục "Game" là dạng "scroll": trên trang chủ nó cuộn tới section
     game NGAY tại chỗ (HomeScreen truyền onItemClick riêng nên hành vi
     cũ giữ nguyên 100%). Từ trang khác, hành vi mặc định ở đây là ghi
     "ý định cuộn" vào sessionStorage rồi về trang chủ — HomeScreen đọc
     ý định này lúc dựng trang và cuộn tới đúng section (xem
     HOME_SCROLL_INTENT_KEY bên dưới).
   - Huy hiệu tin nhắn chưa đọc lấy từ hook dùng chung useChatUnread;
     trang chủ truyền số của chính nó (vẫn là cùng hook đó).
   ════════════════════════════════════════════════════════════════════ */

export const BOTTOM_NAV_ITEMS = (userAuth) => [
  { key: "home", icon: House, label: "Trang chủ", type: "path", path: "/", show: true },
  { key: "categories", icon: LayoutGrid, label: "Danh mục", type: "path", path: "/categories", show: true },
  { key: "games", icon: Gamepad2, label: "Game", type: "scroll", target: "games-section", show: true },
  { key: "tasks", icon: ClipboardList, label: "Nhiệm vụ", type: "path", path: "/daily-tasks", show: !!userAuth?.user },
  { key: "chat", icon: MessageCircle, label: "Tin nhắn", type: "path", path: "/chat", show: !!userAuth?.user },
  { key: "profile", icon: IconUser, label: "Cá nhân", type: "path", path: "/profile", show: !!userAuth?.user },
];

/* ─── Ý định cuộn sau điều hướng ─────────────────────────────────────
   sessionStorage (chỉ sống trong tab hiện tại) — cùng cách HomeScreen
   đang ghi nhớ vị trí cuộn (SCROLL_MEMO_KEY). */
export const HOME_SCROLL_INTENT_KEY = "gq:home:scroll-intent";

export function setHomeScrollIntent(target) {
  try { sessionStorage.setItem(HOME_SCROLL_INTENT_KEY, String(target)); } catch { /* private mode… — chỉ là tiện ích */ }
}

export function peekHomeScrollIntent() {
  try { return sessionStorage.getItem(HOME_SCROLL_INTENT_KEY); } catch { return null; }
}

export function takeHomeScrollIntent() {
  const target = peekHomeScrollIntent();
  if (target) {
    try { sessionStorage.removeItem(HOME_SCROLL_INTENT_KEY); } catch { /* ignore */ }
  }
  return target;
}

/**
 * BottomNav — props:
 * - userAuth: phiên đăng nhập (quyết định mục nào hiện, như bản gốc).
 * - activeKey: key của mục đang ở trạng thái active ("home" | "categories" | …).
 * - chatUnread: số tin chưa đọc cho huy hiệu mục Tin nhắn (mặc định 0).
 * - onItemClick(item): xử lý bấm riêng (trang chủ truyền handleNavClick
 *   sẵn có của nó). Không truyền thì dùng hành vi mặc định: path →
 *   navigate; scroll → ghi ý định cuộn rồi về trang chủ.
 */
export default function BottomNav({ userAuth, activeKey, chatUnread = 0, onItemClick }) {
  const handleClick = (item) => {
    if (onItemClick) return onItemClick(item);
    if (item.type === "scroll") {
      setHomeScrollIntent(item.target);
      return navigate("/");
    }
    if (item.path) return navigate(item.path);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-2px_14px_rgba(29,43,82,.1)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Điều hướng chính"
    >
      <div className="flex justify-around items-center gap-1 px-2 h-[68px]">
        {BOTTOM_NAV_ITEMS(userAuth).filter((i) => i.show).map((item) => {
          const Icon = item.icon;
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              onClick={() => handleClick(item)}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-1 min-w-0 flex-col items-center gap-1 px-1 py-2.5 rounded-2xl transition-colors"
              style={{
                color: isActive ? "#ef7d18" : "#7d89ab",
                background: isActive ? "rgba(247, 171, 46, 0.14)" : "transparent",
              }}
            >
              <span className="relative">
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.6 : 2} />
                {item.key === "chat" && chatUnread > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {chatUnread > 99 ? "99+" : chatUnread}
                  </span>
                )}
              </span>
              <span className="max-w-full truncate text-[10px] font-extrabold leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
