// supportService.js — ticket hỗ trợ người dùng (collection `support_tickets`).
//
// Học sinh/giáo viên gửi yêu cầu từ trang chủ (nút "Hỗ trợ"), admin quản lý ở
// /admin/support. Không dùng JSON Schema ở db.js — dữ liệu đơn giản, mọi field
// đều được whitelist trong createTicket/updateTicket bên dưới.
import { getCollection } from "../db.js";

const COLLECTION = "support_tickets";

export const TICKET_PRIORITIES = ["low", "medium", "high"];
export const TICKET_STATUSES = ["open", "processing", "pending", "done", "closed"];

const uid = () => `spk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Mã hiển thị dạng HC-00001 — đếm số ticket hiện có (đủ dùng với lưu lượng nhỏ). */
async function nextCode() {
  const count = await getCollection(COLLECTION).countDocuments({});
  return `HC-${String(count + 1).padStart(5, "0")}`;
}

/**
 * Xác định ticket nên về tay ai:
 *  · Người gửi thuộc một lớp có giáo viên phụ trách (teacher_classes)
 *    → gán cho giáo viên đó (ưu tiên người được gán gần nhất).
 *  · Không có lớp / lớp chưa có GV → về admin tổng.
 */
async function resolveAssignee(user) {
  try {
    const sender = await getCollection("users").findOne(
      { id: user?.sub },
      { projection: { classId: 1, role: 1 } }
    );
    if (sender?.classId) {
      const mappings = await getCollection("teacher_classes")
        .find({ classId: sender.classId })
        .sort({ createdAt: -1 })
        .toArray();
      for (const m of mappings) {
        const teacher = await getCollection("users").findOne(
          { id: m.teacherId },
          { projection: { id: 1, username: 1, name: 1 } }
        );
        if (teacher) {
          return { type: "teacher", id: teacher.id, username: teacher.username || "", name: teacher.name || "", classId: sender.classId };
        }
      }
    }
  } catch {
    /* DB lỗi → mặc định về admin tổng, không chặn việc gửi ticket */
  }
  return { type: "admin", id: null, username: "", name: "", classId: null };
}

export async function createTicket({ title, content, priority, user }) {
  const now = new Date().toISOString();
  const assignee = await resolveAssignee(user);
  const doc = {
    id: uid(),
    code: await nextCode(),
    title: String(title || "").trim().slice(0, 200),
    content: String(content || "").trim().slice(0, 4000),
    priority: TICKET_PRIORITIES.includes(priority) ? priority : "medium",
    status: "open",
    reply: "",
    userId: user?.sub || null,
    username: user?.username || "",
    userRole: user?.role || "",
    // Người nhận: giáo viên chủ nhiệm lớp người gửi, hoặc admin tổng nếu không có lớp.
    assigneeType: assignee.type,
    assigneeId: assignee.id,
    assigneeUsername: assignee.username,
    assigneeName: assignee.name,
    classId: assignee.classId,
    createdAt: now,
    updatedAt: now,
  };
  await getCollection(COLLECTION).insertOne(doc);
  return doc;
}

export async function listTickets() {
  return getCollection(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

export async function listMyTickets(userId) {
  return getCollection(COLLECTION)
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}

/** Chỉ các ticket được gán cho giáo viên này — giáo viên KHÔNG xem được ticket khác. */
export async function listAssignedTickets(teacherId) {
  return getCollection(COLLECTION)
    .find({ assigneeId: teacherId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getTicket(id) {
  return getCollection(COLLECTION).findOne({ id });
}

/** Admin sửa trạng thái / ưu tiên / câu trả lời. Chỉ nhận các field whitelist. */
export async function updateTicket(id, patch = {}) {
  const updates = { updatedAt: new Date().toISOString() };
  if (patch.title != null) updates.title = String(patch.title).trim().slice(0, 200);
  if (patch.content != null) updates.content = String(patch.content).trim().slice(0, 4000);
  if (patch.reply != null) updates.reply = String(patch.reply).trim().slice(0, 4000);
  if (patch.priority != null) {
    if (!TICKET_PRIORITIES.includes(patch.priority)) throw new Error(`priority phải là một trong: ${TICKET_PRIORITIES.join(", ")}`);
    updates.priority = patch.priority;
  }
  if (patch.status != null) {
    if (!TICKET_STATUSES.includes(patch.status)) throw new Error(`status phải là một trong: ${TICKET_STATUSES.join(", ")}`);
    updates.status = patch.status;
  }
  const col = getCollection(COLLECTION);
  const existing = await col.findOne({ id });
  if (!existing) throw new Error("Không tìm thấy ticket");
  await col.updateOne({ id }, { $set: updates });
  return col.findOne({ id });
}

export async function deleteTicket(id) {
  const res = await getCollection(COLLECTION).deleteOne({ id });
  if (!res.deletedCount) throw new Error("Không tìm thấy ticket");
  return { ok: true, id };
}
