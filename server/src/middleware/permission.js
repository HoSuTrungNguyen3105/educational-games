/**
 * permission.js — bước lọc THỨ HAI sau bước đăng nhập/role.
 *
 * Luồng một request nay đi qua:
 *   1. `authenticate` + `requireRoles` (giữ nguyên như cũ, ở từng route)
 *   2. middleware này: role của token có quyền tương ứng trong `permissions`
 *      (đúng mảng mà GET /api/auth/me trả về) hay không → không có là 403.
 *
 * Quy tắc:
 *  · Đường dẫn khớp rule ĐẦU TIÊN trong danh sách dưới đây.
 *  · `feature` + method → quyền tự suy ra: GET=`.view`, POST/PUT/PATCH=`.edit`,
 *    DELETE=`.delete` (khớp ma trận ở trang Phân quyền).
 *  · `perms` = danh sách quyền thay thế, chỉ cần CÓ MỘT quyền trong danh sách.
 *  · `perms: []` = không đòi quyền (API công khai: login, health…).
 *  · Không có token hợp lệ → middleware đi qua, để route tự quyết (API công khai
 *    cho phép ẩn danh vẫn chạy đúng như trước, API cần đăng nhập vẫn 401 như cũ).
 *  · Đường dẫn không khớp rule nào đòi quyền cơ bản `profile` — nghĩa là mọi tài
 *    khoản đăng nhập đều phải mang ít nhất quyền hồ sơ của mình.
 */
import { verifyToken } from "../services/authService.js";
import { getRolePermissionsCached } from "../services/permissionService.js";
import { FEATURES } from "../../../src/config/roles.js";
import { sendError } from "../utils/response.js";

const PLAY = "games.play";
const PROFILE = "profile";
const ACTION = { GET: "view", HEAD: "view", OPTIONS: "view", POST: "edit", PUT: "edit", PATCH: "edit", DELETE: "delete" };

/** "games.delete" → "Trò chơi · xóa" để câu lỗi 403 dễ hiểu với người dùng. */
const LABELS = (() => {
  const m = {};
  const act = { view: "xem", edit: "sửa", delete: "xóa" };
  for (const f of FEATURES) for (const [a, perm] of Object.entries(f.permissions)) m[perm] = `${f.label} · ${act[a]}`;
  return m;
})();
const label = (perm) => LABELS[perm] || perm;

/** `m` = method (bỏ trống = mọi method). */
const RULES = [
  // ── API công khai: không đòi quyền ────────────────────────────────────
  { re: /^\/health$/, perms: [] },
  { re: /^\/auth\/(login|register|refresh|logout)$/, perms: [] },
  { re: /^\/ai\/health$/, perms: [] },
  { re: /^\/avatar\/categories$/, perms: [] },

  // ── Tài khoản của chính mình ─────────────────────────────────────────
  { re: /^\/auth\/me/, perms: [PROFILE] },                 // /me, /me/wallet, /me/xp, change-password
  { re: /^\/users\/me$/, perms: [PROFILE] },
  { re: /^\/users\/me\/games/, perms: [PLAY, "games.view"] },   // tiến độ game của bản thân
  { re: /^\/users\/me\/exam-results/, perms: [PLAY, "assignments.view"] },
  { re: /^\/users\/game-progress/, feature: "coins" },     // admin xem/sửa JSON save của user
  { re: /^\/users\/exam-results/, feature: "reports" },    // admin xem điểm thi
  { re: /^\/users\/search/, feature: "users" },
  { re: /^\/users(\/|$)/, feature: "users" },

  // ── Trò chơi ─────────────────────────────────────────────────────────
  { m: "POST", re: /^\/games\/answer$/, perms: [PLAY] },                 // học sinh bấm đáp án
  { re: /^\/games\/code\//, perms: [PLAY, "games.view"] },
  { re: /^\/games\/[^/]+\/(data|version)$/, perms: [PLAY, "games.view"] },
  { re: /^\/games\/[^/]+\/config$/, m: "GET", perms: [PLAY, "game_config.view"] },
  { re: /^\/games\/[^/]+\/players$/, perms: ["reports.view", "games.view"] },
  { re: /^\/games(\/|$)/, feature: "games" },
  { re: /^\/game-configs\/[^/]+$/, m: "GET", perms: [PLAY, "game_config.view"] }, // game tự nạp cấu hình
  { re: /^\/game-configs/, feature: "game_config" },

  // ── Nội dung: câu hỏi / ngân hàng / môn / danh mục / template ────────
  { m: "POST", re: /^\/questions\/explain-context$/, perms: [PLAY, PROFILE] },
  { re: /^\/questions/, m: "GET", perms: [PLAY, "questions.view"] },
  { re: /^\/questions/, feature: "questions" },
  { re: /^\/question-banks/, m: "GET", perms: [PLAY, "question_bank.view"] },
  { re: /^\/question-banks/, feature: "question_bank" },
  { re: /^\/subjects/, m: "GET", perms: [PLAY, "subjects.view"] },
  { re: /^\/subjects/, feature: "subjects" },
  { re: /^\/categories/, m: "GET", perms: [PLAY, "categories.view"] },
  { re: /^\/categories/, feature: "categories" },
  { re: /^\/templates/, m: "GET", perms: [PLAY, PROFILE, "templates.view"] }, // phòng thi mở bằng link
  { re: /^\/templates/, feature: "templates" },

  // ── Kết quả / lượt chơi / phiên chơi (dữ liệu của người chơi) ────────
  { re: /^\/results/, m: "GET", perms: ["reports.view", PLAY] },
  { re: /^\/results/, perms: [PLAY, "reports.edit"] },
  { re: /^\/game-attempts/, perms: [PLAY] },
  { re: /^\/game-plays/, perms: [PLAY, "coins.edit"] },
  { re: /^\/game-events/, perms: [PLAY] },
  { re: /^\/game-sessions/, perms: [PLAY] },
  { re: /^\/game-invites/, perms: [PLAY] },
  { m: "DELETE", re: /^\/mini\/users\//, feature: "games" },
  { re: /^\/mini\//, perms: [PLAY, "reports.view"] },

  // ── Lớp học / bài tập ────────────────────────────────────────────────
  { m: "POST", re: /^\/classes\/join$/, perms: [PROFILE] },              // học sinh nhập mã lớp
  { re: /^\/classes/, m: "GET", perms: ["classes.view", PROFILE] },
  { re: /^\/classes/, feature: "classes" },
  { re: /^\/assignments\/resolve\//, perms: [] },                        // link phòng thi (ẩn danh)
  { re: /^\/assignments\/[^/]+\/public$/, perms: [] },
  { re: /^\/assignments\/(my-completed|)$/, m: "GET", perms: [PROFILE, "assignments.view"] },
  { m: "POST", re: /^\/assignments\/[^/]+\/(start|submit)$/, perms: [PLAY, "assignments.edit"] },
  { m: "POST", re: /^\/assignments\/join$/, perms: [PROFILE] },
  { re: /^\/assignments\/[^/]+\/(stats|submissions)$/, perms: ["assignments.view", "reports.view"] },
  { re: /^\/assignments/, m: "GET", perms: [PROFILE, "assignments.view"] },
  { re: /^\/assignments/, feature: "assignments" },

  // ── Nhiệm vụ ngày / nhắc nhở / thông báo / chat ──────────────────────
  { re: /^\/daily-tasks\/admin\//, feature: "daily_tasks" },
  { re: /^\/daily-tasks/, perms: ["daily-tasks", "daily_tasks.view"] },
  { re: /^\/tasks\/admin\//, feature: "daily_tasks" },
  { re: /^\/tasks/, perms: ["daily-tasks", "daily_tasks.view"] },
  { re: /^\/reminders\/due$/, perms: [PROFILE] },                        // endpoint polling của app
  { re: /^\/reminders/, perms: [PROFILE, "reminders.view"] },
  { re: /^\/notifications/, perms: [PROFILE] },

  // ── Vườn / thú cưng / avatar / ảnh ───────────────────────────────────
  { re: /^\/garden/, perms: [PLAY] },
  { re: /^\/plant-types/, m: "GET", perms: [PLAY, "plant_types.view"] },
  { re: /^\/plant-types/, feature: "plant_types" },
  { re: /^\/pet\/admin/, feature: "pet_catalog" },
  { re: /^\/pet/, perms: [PLAY] },
  { re: /^\/avatar\/admin\//, feature: "avatar_items" },
  { m: "PUT", re: /^\/avatar\/template$/, feature: "avatar_templates" },
  { re: /^\/avatar\/(inventory|buy|save)$/, perms: [PROFILE] },
  { re: /^\/avatar\//, m: "GET", perms: [PROFILE, "avatar_items.view", PLAY] },
  { re: /^\/images/, m: "GET", perms: ["images.view", PLAY] },
  { re: /^\/images/, feature: "images" },

  // ── Phân quyền / thống kê / AI / seed ────────────────────────────────
  { re: /^\/permissions\/roles/, feature: "roles" },
  { re: /^\/permissions/, perms: ["roles.view"] },
  { re: /^\/stats/, feature: "reports" },
  { re: /^\/players/, perms: ["reports.view", "games.view"] },
  { re: /^\/chat/, perms: ["chat", "chat.view"] },                  // quyền cơ bản `chat`
  { re: /^\/conversations/, perms: ["chat", "chat.view"] },
  // setupRouter mount ở "/api" (không có prefix /setup) nên các đường dẫn của nó
  // (/templates, /categories, /subjects, /players, /games/:id/players) đã được
  // các rule tương ứng phía trên che phủ — không cần rule riêng.
  { m: "POST", re: /^\/ai\/(generate-question|quizzes\/generate)$/, perms: ["questions.edit"] },
  { re: /^\/ai\//, perms: [PLAY, PROFILE] },
  { re: /^\/seed$/, perms: ["settings.edit"] },
];

function needFor(method, path) {
  for (const r of RULES) {
    if (r.m && r.m !== method) continue;
    if (!r.re.test(path)) continue;
    if (r.perms) return r.perms;
    if (r.feature) return [`${r.feature}.${ACTION[method] || "view"}`, ...(r.also || [])];
  }
  return null; // không khớp rule nào → quyền cơ bản
}

/** Middleware toàn cục, mount trước các router trong app.js. */
export async function permissionFilter(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  // Không token (hoặc token sai) → tầng này không nói gì; `authenticate` của route
  // sẽ quyết định 401, còn API công khai cho phép ẩn danh vẫn chạy như trước.
  if (!token) return next();
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return next();
  }

  const path = (req.path || "").replace(/^\/api/, "");
  const need = needFor(req.method, path) || [PROFILE];
  if (!need.length) return next();                       // rule `perms: []` = API công khai
  const granted = await getRolePermissionsCached(payload.role).catch(() => []);
  if (need.some((p) => granted.includes(p))) return next();

  return sendError(
    res,
    `Bạn không có quyền: ${need.map(label).join(" hoặc ")} (${need.join(" / ")}) — vai trò ${payload.role}`,
    403,
  );
}
