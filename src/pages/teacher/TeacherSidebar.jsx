import { useState } from 'react'
import { navigate } from '../../lib/router.js'
import { hasPermission } from '../../config/roles.js'
import {
  LayoutDashboard,
  Library,
  Users,
  Coins,
  ClipboardList,
Palette,
  SlidersHorizontal,
  Tag,
  BookOpen,
  HelpCircle,
  Database,
  Plus,
  Home,
  LogOut,
  X,
  MessageCircle,
  User,
  GraduationCap,
  FileText,
  Shirt,
  Scissors,
  Move,
  Image,
  Bell,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const MENU = [
  { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/admin", permission: null },
  { id: "admin-library", label: "Trò chơi", icon: Library, route: "/admin/library", permission: "games.manage" },
  { id: "admin-users", label: "Người dùng", icon: Users, route: "/admin/users", permission: "users.view" },
  { id: "admin-roles", label: "Phân quyền", icon: ShieldCheck, route: "/admin/roles", permission: "users.view" },
  { id: "admin-coins", label: "Coin & Progress", icon: Coins, route: "/admin/coins", permission: "coins.manage" },
  { id: "admin-daily-tasks", label: "Nhiệm vụ ngày", icon: ClipboardList, route: "/admin/daily-tasks", permission: "daily-tasks.manage" },
{ id: "admin-templates", label: "Templates", icon: Palette, route: "/admin/templates", permission: "templates.manage" },
  { id: "admin-game-config", label: "Cấu hình game", icon: SlidersHorizontal, route: "/admin/game-config", permission: "games.manage" },
  { id: "admin-categories", label: "Categories", icon: Tag, route: "/admin/categories", permission: "categories.manage" },
  { id: "admin-subjects", label: "Môn học", icon: BookOpen, route: "/admin/subjects", permission: "subjects.manage" },
  { id: "admin-questions", label: "Câu hỏi", icon: HelpCircle, route: "/admin/questions", permission: "questions.manage" },
  { id: "admin-question-bank", label: "Ngân hàng câu hỏi", icon: Database, route: "/admin/question-bank", permission: "questions.manage" },
  { id: "admin-chat", label: "Tin nhắn", icon: MessageCircle, route: "/admin/chat", permission: "chat" },
  { id: "admin-classes", label: "Lớp học", icon: GraduationCap, route: "/admin/classes", permission: null },
  { id: "admin-assignments", label: "Bài tập", icon: FileText, route: "/admin/assignments", permission: null },
  { id: "admin-reminders", label: "Nhắc nhở", icon: Bell, route: "/admin/reminders", permission: null },
  { id: "admin-ai-analysis", label: "Phân tích AI", icon: Sparkles, route: "/admin/ai-analysis", permission: "reports.view" },
  { id: "admin-avatar-items", label: "Avatar Items", icon: Shirt, route: "/admin/avatar-items", permission: null },
  { id: "admin-avatar-template", label: "Avatar Template", icon: Move, route: "/admin/avatar-template", permission: null },
  { id: "admin-body-custom", label: "Body Custom", icon: Move, route: "/admin/body-custom", permission: null },
  { id: "admin-plant-types", label: "Loại cây (Garden)", icon: Move, route: "/admin/plant-types", permission: null },
  { id: "admin-images", label: "Thư viện ảnh", icon: Image, route: "/admin/images", permission: null },
  { id: "admin-upload-items", label: "Trích xuất Items", icon: Scissors, route: "/admin/upload-items", permission: null },
];

const BOTTOM_MENU = [
  { id: "admin-create", label: "Tạo trò chơi", icon: Plus, route: "/admin/create", permission: "games.manage" },
  { id: "home", label: "Về trang chủ", icon: Home, route: "/", permission: null },
];

const MOBILE_MAIN = [
  { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/admin", permission: null },
  { id: "admin-library", label: "Trò chơi", icon: Library, route: "/admin/library", permission: "games.manage" },
  { id: "admin-create", label: "Tạo", icon: Plus, route: "/admin/create", permission: "games.manage" },
  { id: "home", label: "Trang chủ", icon: Home, route: "/", permission: null },
  // { id: "admin-templates", label: "Templates", icon: Palette, route: "/admin/templates", permission: "templates.manage" },
];

const MOBILE_MORE = [
  { id: "admin-users", label: "Người dùng", icon: Users, route: "/admin/users", permission: "users.view" },
  { id: "admin-roles", label: "Phân quyền", icon: ShieldCheck, route: "/admin/roles", permission: "users.view" },
  { id: "admin-coins", label: "Coins", icon: Coins, route: "/admin/coins", permission: "coins.manage" },
  { id: "admin-daily-tasks", label: "Nhiệm vụ", icon: ClipboardList, route: "/admin/daily-tasks", permission: "daily-tasks.manage" },
  { id: "admin-categories", label: "Categories", icon: Tag, route: "/admin/categories", permission: "categories.manage" },
  { id: "admin-subjects", label: "Môn học", icon: BookOpen, route: "/admin/subjects", permission: "subjects.manage" },
  { id: "admin-questions", label: "Câu hỏi", icon: HelpCircle, route: "/admin/questions", permission: "questions.manage" },
  { id: "admin-question-bank", label: "Ngân hàng câu hỏi", icon: Database, route: "/admin/question-bank", permission: "questions.manage" },
  { id: "admin-chat", label: "Tin nhắn", icon: MessageCircle, route: "/admin/chat", permission: "chat" },
  { id: "admin-classes", label: "Lớp học", icon: GraduationCap, route: "/admin/classes", permission: null },
  { id: "admin-assignments", label: "Bài tập", icon: FileText, route: "/admin/assignments", permission: null },
  { id: "admin-reminders", label: "Nhắc nhở", icon: Bell, route: "/admin/reminders", permission: null },
  { id: "admin-ai-analysis", label: "Phân tích AI", icon: Sparkles, route: "/admin/ai-analysis", permission: "reports.view" },
  { id: "admin-avatar-items", label: "Avatar Items", icon: Shirt, route: "/admin/avatar-items", permission: null },
  { id: "admin-avatar-template", label: "Avatar Template", icon: Move, route: "/admin/avatar-template", permission: null },
  { id: "admin-images", label: "Thư viện ảnh", icon: Image, route: "/admin/images", permission: null },
  { id: "admin-upload-items", label: "Trích xuất", icon: Scissors, route: "/admin/upload-items", permission: null },
];

export default function TeacherSidebar({ screen, user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const role = user?.role;
  const canSee = (item) => !item.permission || hasPermission(role, item.permission);

  const visibleMenu = MENU.filter(canSee);
  const visibleBottom = BOTTOM_MENU.filter(canSee);
  const visibleMobileMain = MOBILE_MAIN.filter(canSee);
  const visibleMobileMore = MOBILE_MORE.filter(canSee);

  const activeId = visibleMenu.some(t => t.id === screen) ? screen : "admin-library";

  const renderNav = (isMobile) => (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-3 pb-2">
        <img
          src={`${import.meta.env.BASE_URL}eduplay-admin-logo2.png`}
          alt="EduPlay Admin"
          className="w-4/5 mx-auto h-auto object-contain"
          draggable={false}
        />
      </div>
      <nav className="flex-1 px-3 py-2 space-y-1">
        {visibleMenu.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => { navigate(t.route); if (isMobile) setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body transition
                ${activeId === t.id ? "bg-gold/20 text-gold font-semibold" : "text-paper/70 hover:bg-white/5 hover:text-paper"}`}>
              <Icon className="w-5 h-5" />
              {t.label}
            </button>
          );
        })}
      </nav>
      <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-3">
        {visibleBottom.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => { navigate(t.route); if (isMobile) setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body text-paper/70 hover:bg-white/5 hover:text-paper transition">
              <Icon className="w-5 h-5" />
              {t.label}
            </button>
          );
        })}
        {user && (
          <div className="mt-2 pt-3 border-t border-white/10">
            <button onClick={() => { navigate("/admin/profile"); if (isMobile) setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body text-paper/70 hover:bg-white/5 hover:text-paper transition">
              <User className="w-5 h-5" />
              Hồ sơ
            </button>
            <button onClick={() => { onLogout?.(); if (isMobile) setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body text-red-400 hover:bg-red-500/10 transition">
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />
          <aside className="fixed top-0 left-0 w-60 h-full bg-ink z-50 shadow-2xl overflow-y-auto transition-transform duration-300 sm:hidden pwa-safe-top pwa-safe-top-h">
            <div className="flex items-center justify-between px-5 pt-5 pb-2">
              <span className="font-display text-paper text-base">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-paper/60 hover:text-paper">
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderNav(true)}
          </aside>
        </>
      )}

      <aside className="hidden sm:flex flex-col w-[240px] min-h-screen bg-ink text-paper flex-shrink-0 overflow-y-auto sticky top-0 h-screen">
        {renderNav(false)}
      </aside>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-ink border-t border-white/10" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex items-center justify-around h-16 px-2">
          {visibleMobileMain.map((t) => {
            // Nút giữa là "+". Dò vào id chứ không dựa vào thứ tự index:
            // nếu giáo viên thiếu quyền games.manage thì mảng bị lọc ngắn lại,
            // index===2 sẽ trỏ nhầm sang "Trang chủ" và nó mọc thành nút +.
            if (t.id === "admin-create") {
              return (
                <div key="center-group" className="relative flex items-center justify-center">
                  <button onClick={() => setMoreOpen(v => !v)} aria-label="Mở bảng quản lý"
                    className={`w-14 h-14 -mt-5 rounded-full flex items-center justify-center text-2xl shadow-lg transition
                      ${moreOpen ? "bg-ticket text-white rotate-45" : "bg-ink text-paper"}`}>
                    <Plus className="w-7 h-7" />
                  </button>
                </div>
              );
            }
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => navigate(t.route)}
                className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-xl transition
                  ${activeId === t.id ? "text-gold" : "text-paper/60"}`}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-body leading-tight">{t.label}</span>
              </button>
            );
          })}
          {user && (
            <button onClick={onLogout}
              className="flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-xl transition text-red-400">
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] font-body leading-tight">Thoát</span>
            </button>
          )}
        </div>
      </nav>

      {/*
        Bấm "+" mở panel FULL TRÀNG ngay, không phải bottom-sheet nhỏ.
        Đặt ngoài <nav> và z-index cao hơn để phủ kín thanh điều hướng.
        Lưới nhiều cột + ô nhỏ để thấy hết mục mà không phải cuộn nhiều.
      */}
      {moreOpen && (
        <div
          className="sm:hidden fixed inset-0 z-[60] bg-paper flex flex-col anim-pop"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <header className="shrink-0 flex items-center gap-3 px-4 h-14 bg-ink text-paper">
            <button onClick={() => setMoreOpen(false)} aria-label="Đóng"
              className="w-9 h-9 rounded-full grid place-items-center bg-white/10 hover:bg-white/20 transition">
              <X className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-bold leading-tight">Quản lý</p>
              <p className="text-[10px] text-paper/60 leading-tight">
                {visibleMobileMore.length} mục
              </p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto overscroll-contain p-3">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {visibleMobileMore.map(m => {
                const Icon = m.icon;
                return (
                  <button key={m.id} onClick={() => { navigate(m.route); setMoreOpen(false); }}
                    className={`flex flex-col items-center justify-center gap-1 p-2 min-h-[74px] rounded-xl border transition active:scale-95
                      ${activeId === m.id
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-ink/10 bg-paper2 text-ink hover:border-ink/25"}`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-body font-medium leading-tight text-center line-clamp-2">{m.label}</span>
                  </button>
                );
              })}
              <button onClick={() => { onLogout?.(); setMoreOpen(false); }}
                className="flex flex-col items-center justify-center gap-1 p-2 min-h-[74px] rounded-xl border border-red-200 bg-red-50 text-red-500 active:scale-95 transition">
                <LogOut className="w-5 h-5" />
                <span className="text-[10px] font-body font-medium leading-tight text-center line-clamp-2">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
