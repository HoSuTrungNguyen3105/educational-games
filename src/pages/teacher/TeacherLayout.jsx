import { IconBack, IconUser as UIIconUser, IconLogout as UILogout } from '../../components/ui/index.js'
import { ArrowRight, House } from 'lucide-react'
import TeacherSidebar from './TeacherSidebar.jsx'
import { navigate } from '../../lib/router.js'

/**
 * TeacherLayout — khung quản trị kiểu WordPress:
 *   ┌──────────────────────────────────────────────────────────┐
 *   │  Admin bar tối, trải hết chiều ngang (không logo)        │
 *   ├────────────┬─────────────────────────────────────────────┤
 *   │  Sidebar   │  Nội dung nền xám, panel trắng              │
 *   │  tối       │                                             │
 *   └────────────┴─────────────────────────────────────────────┘
 * Mobile giữ thanh điều hướng dưới của TeacherSidebar.
 */
export default function TeacherLayout({ screen, user, onLogout, children }) {
  return (
    <div className="edu-admin min-h-screen flex flex-col">
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
          <button onClick={() => navigate('/admin/profile')} title="Hồ sơ" className="edu-bar-btn">
            <UIIconUser />
            <span className="hidden md:inline">Hồ sơ</span>
          </button>
          <span className="hidden lg:inline text-[#a7aaad] px-1">|</span>
          <span className="hidden lg:inline edu-bar-user">
            Xin chào, <b>{user?.name || 'bạn'}</b>
          </span>
          <button onClick={onLogout} title="Đăng xuất" className="edu-bar-btn">
            <UILogout />
            <span className="hidden md:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      <div className="edu-admin-body">
        <TeacherSidebar screen={screen} user={user} onLogout={onLogout} />
        <main className="edu-admin-content">{children}</main>
      </div>
    </div>
  )
}
