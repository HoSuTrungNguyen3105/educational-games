import { IconBack } from '../../components/ui/index.js';
import { ArrowRight } from 'lucide-react'
import TeacherSidebar, { findPageTitle } from './TeacherSidebar.jsx'
import { navigate } from '../../lib/router.js'
import { House } from 'lucide-react'
import { IconUser as UIIconUser, IconLogout as UILogout } from '../../components/ui/index.js'

/**
 * TeacherLayout — layout admin kiểu app workspace:
 *   ┌──────────────┬───────────────────────────────┐
 *   │  Sidebar     │  Topbar (back/forward + tiêu đề)│
 *   │  (nhóm mục)  ├───────────────────────────────┤
 *   │  + user card │  MainContent                  │
 *   └──────────────┴───────────────────────────────┘
 */
export default function TeacherLayout({ screen, user, onLogout, children }) {
  const title = findPageTitle(screen);

  return (
    <div className="flex min-h-screen bg-paper">
      <TeacherSidebar screen={screen} user={user} onLogout={onLogout} />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-14 shrink-0 flex items-center gap-1.5 px-2 sm:px-5 bg-[#F4EEE1]/90 backdrop-blur border-b border-ink/10">
          <button onClick={() => history.back()} title="Quay lại"
            className="w-9 h-9 grid place-items-center rounded-xl text-ink/60 hover:bg-ink/10 hover:text-ink transition">
            <IconBack className="w-[18px] h-[18px]" />
          </button>
          <button onClick={() => history.forward()} title="Tiến"
            className="w-9 h-9 grid place-items-center rounded-xl text-ink/60 hover:bg-ink/10 hover:text-ink transition">
            <ArrowRight className="w-[18px] h-[18px]" />
          </button>
          <h1 className="font-display text-base sm:text-lg text-ink ml-1.5 truncate">{title}</h1>
          <span className="ml-auto hidden md:block text-[10px] font-mono uppercase tracking-[0.14em] text-[#A79A80]">EduPlay Admin</span>
          <div className="flex items-center gap-2.5 ml-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-sm text-ink/70 hover:text-ink transition">
              {/* className="flex items-center gap-1.5 text-sm text-ink/70 hover:text-ink transition"> */}
              <House className="w-[16px] h-[16px]" />
              Về trang chủ
            </button>
            <button onClick={() => navigate('/admin/profile')}
              className="flex items-center gap-1.5 text-sm text-ink/70 hover:text-ink transition">
              <UIIconUser className="w-[16px] h-[16px]" />
              Hồ sơ
            </button>
            <button onClick={onLogout}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition">
              <UILogout className="w-[16px] h-[16px]" />
              Đăng xuất
            </button>
          </div>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-5 py-4 pb-24 sm:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
