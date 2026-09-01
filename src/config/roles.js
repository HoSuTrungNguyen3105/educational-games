export const ROLES = {
  admin: {
    label: "Quản trị",
    dashboardAccess: true,
    permissions: [
      "games.manage",
      "questions.manage",
      "users.view",
      "users.manage",
      "coins.manage",
      "daily-tasks.manage",
      "categories.manage",
      "subjects.manage",
      "templates.manage",
      "setup.manage",
      "chat",
      "profile",
      "friends",
      "games.play",
      "coins.view",
      "daily-tasks",
    ],
  },
  teacher: {
    label: "Giáo viên",
    dashboardAccess: true,
    permissions: [
      "games.manage",
      "questions.manage",
      "users.view",
      "coins.manage",
      "daily-tasks.manage",
      "categories.manage",
      "subjects.manage",
      "templates.manage",
      "chat",
      "profile",
      "friends",
      "games.play",
      "coins.view",
      "daily-tasks",
    ],
  },
  student: {
    label: "Học sinh",
    dashboardAccess: false,
    permissions: [
      "games.play",
      "chat",
      "profile",
      "friends",
      "coins.view",
      "daily-tasks",
    ],
  },
};

export function hasPermission(role, permission) {
  const r = ROLES[role];
  if (!r) return false;
  if (r.permissions.includes("*")) return true;
  return r.permissions.includes(permission);
}

export function canAccessDashboard(role) {
  return ROLES[role]?.dashboardAccess ?? false;
}

export function getRoleLabel(role) {
  return ROLES[role]?.label ?? role;
}
