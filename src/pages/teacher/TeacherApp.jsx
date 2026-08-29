import { useState } from 'react'
import { navigate } from '../../lib/router.js'
import TeacherLayout from './TeacherLayout.jsx'
import TeacherDashboard from './TeacherDashboard.jsx'
import CreateGameFlow from './CreateGameFlow.jsx'
import TeacherResults from './TeacherResults.jsx'
import UserManagement from './UserManagement.jsx'
import TemplateManagement from './TemplateManagement.jsx'
import TemplateFormPage from './TemplateFormPage.jsx'
import CategoryManagement from './CategoryManagement.jsx'
import SubjectManagement from './SubjectManagement.jsx'
import QuestionManagement from './QuestionManagement.jsx'
import GameBuilder from '../../components/gameBuilder/GameBuilder.jsx'
import GameLibraryManagement from './GameLibraryManagement.jsx'
import CoinManagement from './CoinManagement.jsx'
import DailyTaskManagement from './DailyTaskManagement.jsx'
import TeacherChat from './TeacherChat.jsx'
import TeacherProfile from './TeacherProfile.jsx'

export default function TeacherApp({ user, route, onLogout, showToast }) {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const bump = () => setRefreshFlag(f => f + 1);

  const goCreate = () => navigate("/admin/create");
  const goLibrary = () => navigate("/admin/library");

  if (route.name === "admin-builder") {
    return (
      <GameBuilder
        gameId={route.params.gameId}
        showToast={showToast}
        onDone={() => { bump(); goLibrary(); }}
        onCancel={goLibrary}
      />
    );
  }

  const page = route.name;

  return (
    <TeacherLayout screen={page} user={user} onLogout={onLogout}>
      {page === "admin-dashboard" && <TeacherDashboard key={refreshFlag} user={user} onLogout={onLogout} onOpenLibrary={goLibrary} onCreate={goCreate} onEdit={(id) => navigate(`/admin/edit/${id}`)} onResults={(id) => navigate(`/admin/results/${id}`)} onDesign={(id) => navigate(`/admin/builder/${id}`)} showToast={showToast} />}
      {page === "admin-library" && <GameLibraryManagement key={refreshFlag} onCreate={goCreate} onEdit={(id) => navigate(`/admin/edit/${id}`)} onResults={(id) => navigate(`/admin/results/${id}`)} onDesign={(id) => navigate(`/admin/builder/${id}`)} onOpenBuilder={() => navigate("/admin/builder")} showToast={showToast} onChanged={bump} />}
      {page === "admin-create" && <CreateGameFlow gameId={null} showToast={showToast} onDone={() => { bump(); goLibrary(); }} onCancel={goLibrary} />}
      {page === "admin-edit" && <CreateGameFlow key={route.params.gameId} gameId={route.params.gameId} showToast={showToast} onDone={() => { bump(); goLibrary(); }} onCancel={goLibrary} />}
      {page === "admin-results" && <TeacherResults gameId={route.params.gameId} onBack={goLibrary} />}
      {page === "admin-users" && <UserManagement user={user} showToast={showToast} />}
      {page === "admin-coins" && <CoinManagement showToast={showToast} />}
      {page === "admin-daily-tasks" && <DailyTaskManagement showToast={showToast} />}
      {page === "admin-templates" && <TemplateManagement showToast={showToast} />}
      {page === "admin-template-new" && <TemplateFormPage showToast={showToast} />}
      {page === "admin-template-edit" && <TemplateFormPage key={route.params.templateId} showToast={showToast} route={route} />}
      {page === "admin-categories" && <CategoryManagement showToast={showToast} />}
      {page === "admin-subjects" && <SubjectManagement showToast={showToast} />}
      {page === "admin-questions" && <QuestionManagement showToast={showToast} />}
      {page === "admin-chat" && <TeacherChat user={user} showToast={showToast} />}
      {page === "admin-profile" && <TeacherProfile user={user} onLogout={onLogout} showToast={showToast} />}
    </TeacherLayout>
  );
}