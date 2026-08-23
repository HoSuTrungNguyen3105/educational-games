import { useState } from 'react'
import { navigate } from '../../lib/router.js'
import TeacherLayout from './TeacherLayout.jsx'
import TeacherDashboard from './TeacherDashboard.jsx'
import GameLibrary from './GameLibrary.jsx'
import CreateGameFlow from './CreateGameFlow.jsx'
import TeacherResults from './TeacherResults.jsx'
import UserManagement from './UserManagement.jsx'
import TemplateManagement from './TemplateManagement.jsx'
import GameBuilder from '../../components/gameBuilder/GameBuilder.jsx'

export default function TeacherApp({ user, route, showToast }) {
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
    <TeacherLayout screen={page}>
      {page === "admin-dashboard" && <TeacherDashboard key={refreshFlag} user={user} onOpenLibrary={goLibrary} onCreate={goCreate} onEdit={(id) => navigate(`/admin/edit/${id}`)} onResults={(id) => navigate(`/admin/results/${id}`)} onDesign={(id) => navigate(`/admin/builder/${id}`)} showToast={showToast} />}
      {page === "admin-library" && <GameLibrary key={refreshFlag} onCreate={goCreate} onEdit={(id) => navigate(`/admin/edit/${id}`)} onResults={(id) => navigate(`/admin/results/${id}`)} onDesign={(id) => navigate(`/admin/builder/${id}`)} onOpenBuilder={() => navigate("/admin/builder")} showToast={showToast} onChanged={bump} />}
      {page === "admin-create" && <CreateGameFlow gameId={null} showToast={showToast} onDone={() => { bump(); goLibrary(); }} onCancel={goLibrary} />}
      {page === "admin-edit" && <CreateGameFlow key={route.params.gameId} gameId={route.params.gameId} showToast={showToast} onDone={() => { bump(); goLibrary(); }} onCancel={goLibrary} />}
      {page === "admin-results" && <TeacherResults gameId={route.params.gameId} onBack={goLibrary} />}
      {page === "admin-users" && <UserManagement user={user} showToast={showToast} />}
      {page === "admin-templates" && <TemplateManagement user={user} showToast={showToast} />}
    </TeacherLayout>
  );
}