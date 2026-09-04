import { useState, lazy, Suspense } from 'react'
import { navigate } from '../../lib/router.js'
import TeacherLayout from './TeacherLayout.jsx'
import { Loader } from '../../components/ui.jsx'

// Lazy-loaded teacher subpages & tools
const TeacherDashboard = lazy(() => import('./TeacherDashboard.jsx'));
const CreateGameFlow = lazy(() => import('./CreateGameFlow.jsx'));
const TeacherResults = lazy(() => import('./TeacherResults.jsx'));
const UserManagement = lazy(() => import('./UserManagement.jsx'));
const TemplateManagement = lazy(() => import('./TemplateManagement.jsx'));
const TemplateFormPage = lazy(() => import('./TemplateFormPage.jsx'));
const CategoryManagement = lazy(() => import('./CategoryManagement.jsx'));
const SubjectManagement = lazy(() => import('./SubjectManagement.jsx'));
const QuestionManagement = lazy(() => import('./QuestionManagement.jsx'));
const GameBuilder = lazy(() => import('../../components/gameBuilder/GameBuilder.jsx'));
const GameLibraryManagement = lazy(() => import('./GameLibraryManagement.jsx'));
const CoinManagement = lazy(() => import('./CoinManagement.jsx'));
const DailyTaskManagement = lazy(() => import('./DailyTaskManagement.jsx'));
const TeacherChat = lazy(() => import('./TeacherChat.jsx'));
const TeacherProfile = lazy(() => import('./TeacherProfile.jsx'));
const ClassManagement = lazy(() => import('./ClassManagement.jsx'));
const ClassStudents = lazy(() => import('./ClassStudents.jsx'));
const AssignmentCreate = lazy(() => import('./AssignmentCreate.jsx'));
const AssignmentEdit = lazy(() => import('./AssignmentEdit.jsx'));
const AssignmentDetail = lazy(() => import('./AssignmentDetail.jsx'));
const AssignmentList = lazy(() => import('./AssignmentList.jsx'));
const AvatarItemManagement = lazy(() => import('./AvatarItemManagement.jsx'));
const AvatarTemplateEditor = lazy(() => import('./AvatarTemplateEditor.jsx'));
const UploadItems = lazy(() => import('./UploadItems.jsx'));
const PlantTypeManagement = lazy(() => import('./PlantTypeManagement.jsx'));
const BodyCustomImport = lazy(() => import('./BodyCustomImport.jsx'));

export default function TeacherApp({ user, route, onLogout, showToast }) {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const bump = () => setRefreshFlag(f => f + 1);

  const goCreate = () => navigate("/admin/create");
  const goLibrary = () => navigate("/admin/library");

  if (route.name === "admin-builder") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-paper flex items-center justify-center"><Loader label="Đang mở Game Builder..." /></div>}>
        <GameBuilder
          gameId={route.params.gameId}
          showToast={showToast}
          onDone={() => { bump(); goLibrary(); }}
          onCancel={goLibrary}
        />
      </Suspense>
    );
  }

  const page = route.name;

  return (
    <TeacherLayout screen={page} user={user} onLogout={onLogout}>
      <Suspense fallback={<div className="p-12 flex items-center justify-center"><Loader label="Đang tải dữ liệu..." /></div>}>
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
        {page === "admin-classes" && <ClassManagement />}
        {page === "admin-class-students" && <ClassStudents classId={route.params?.classId} />}
        {page === "admin-assignments" && <AssignmentList />}
        {page === "admin-assignment-new" && <AssignmentCreate />}
        {page === "admin-assignment-edit" && <AssignmentEdit assignmentId={route.params?.assignmentId} />}
        {page === "admin-assignment-detail" && <AssignmentDetail assignmentId={route.params?.assignmentId} />}
        {page === "admin-avatar-items" && <AvatarItemManagement showToast={showToast} />}
        {page === "admin-avatar-template" && <AvatarTemplateEditor showToast={showToast} />}
        {page === "admin-plant-types" && <PlantTypeManagement showToast={showToast} />}
        {page === "admin-body-custom" && <BodyCustomImport showToast={showToast} />}
        {page === "admin-upload-items" && <UploadItems showToast={showToast} />}
      </Suspense>
    </TeacherLayout>
  );
}