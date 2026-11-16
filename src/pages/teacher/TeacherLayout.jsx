import { IconBack, IconUser as UIIconUser, IconLogout as UILogout, ThemeToggle } from '../../components/ui/index.js'
import { ArrowRight, House } from 'lucide-react'
import DashboardSidebar from './DashboardSidebar.jsx'
import { navigate } from '../../lib/router.js'
import { useAdminAppearance } from '../../lib/hooks.js'

/**
 * TeacherLayout — khung quản trị kiểu WordPress:
 *   ┌──────────────────────────────────────────────────────────┐
 *   │  Admin bar tối, trải hết chiều ngang (không logo)        │
 *   ├────────────┬─────────────────────────────────────────────┤
 *   │  Sidebar   │  Nội dung nền xám, panel trắng              │
 *   │  tối       │                                             │
 *   └────────────┴─────────────────────────────────────────────┘
 * Mobile giữ thanh điều hướng dưới của DashboardSidebar.
 */
export default function TeacherLayout({ screen, user, onLogout, children }) {
  // Màu header/sidebar/body do admin đặt ở Cài đặt → Giao diện (system_config
  // nhóm appearance, áp cho mọi tài khoản). Chỉ gắn biến nào CÓ giá trị —
  // biến trống giữ màu mặc định của admin.css / chế độ Sáng–Tối hiện tại.
  const appearance = useAdminAppearance()
  const appearanceStyle = {}
  if (appearance.headerColor) appearanceStyle['--edu-bar-bg'] = appearance.headerColor
  if (appearance.sidebarColor) appearanceStyle['--edu-sidebar'] = appearance.sidebarColor
  if (appearance.bodyColor) appearanceStyle['--edu-bg'] = appearance.bodyColor

  return (
    <div className="edu-admin min-h-screen flex flex-col" style={appearanceStyle}>
      <header className="edu-admin-bar">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold whitespace-nowrap">EduPlay</span>
          <span className="hidden sm:inline text-[#a7aaad] text-xs">Quản trị</span>
        </div>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1 min-w-0">
          <button onClick={() => history.back()} title="Quay lại" className="edu-bar-btn hidden sm:inline-flex">
            <IconBack />
          </button>
          <button onClick={() => history.forward()} title="Tiến" className="edu-bar-btn hidden sm:inline-flex">
            <ArrowRight />
          </button>
          <button onClick={() => navigate('/')} title="Về trang chủ" className="edu-bar-btn">
            <House />
            <span className="hidden md:inline">Về trang chủ</span>
          </button>
          <button onClick={() => navigate('/dashboard/profile')} title="Hồ sơ" className="edu-bar-btn">
            <UIIconUser />
            <span className="hidden md:inline">Hồ sơ</span>
          </button>
          <span className="hidden lg:inline text-[#a7aaad] px-1">|</span>
          <span className="hidden lg:inline edu-bar-user">
            Xin chào, <b>{user?.name || 'bạn'}</b>
          </span>
          <ThemeToggle className="edu-bar-btn" />
          <button onClick={onLogout} title="Đăng xuất" className="edu-bar-btn">
            <UILogout />
            <span className="hidden md:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      <div className="edu-admin-body">
        <DashboardSidebar screen={screen} user={user} onLogout={onLogout} />
        <main className="edu-admin-content">{children}</main>
      </div>
    </div>
  )
}
