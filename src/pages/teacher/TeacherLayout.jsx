import TeacherSidebar from './TeacherSidebar.jsx'

/**
 * TeacherLayout — layout chung cho tất cả trang /admin/*.
 *
 *  ┌──────────────┬───────────────────────────────┐
 *  │  Sidebar     │  MainContent                  │
 *  │  240px       │  flex-1                       │
 *  └──────────────┴───────────────────────────────┘
 */
export default function TeacherLayout({ screen, children }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <TeacherSidebar screen={screen} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 md:px-2 py-2">
        {children}
      </main>
    </div>
  );
}
