// remediationService.js — Gói can thiệp 1 chạm (1-Click Remediation Pack,
// Đợt 2 của capnhattinhnang.md), nối tiếp Bản đồ nhiệt điểm mù (Đợt 1).
//
// Giáo viên đang xem bản đồ nhiệt chọn một NHÓM học sinh (thường là nhóm
// đỏ/vàng của một chủ đề) → gói ôn tập được tạo TỰ ĐỘNG bằng cơ chế thật:
//   1. Trích câu hỏi CÙNG CHỦ ĐỀ ở mức CƠ BẢN từ ngân hàng câu hỏi:
//      độ khó `difficulty === "easy"` và thuộc chủ đề theo ĐÚNG luật sinh
//      khoá chủ đề của heatmapService — câu thuộc chủ đề T khi
//      `category === T`, hoặc (không có category và nhãn môn của `subject`
//      === T). Chủ đề không có câu cơ bản → TỪ CHỐI rõ ràng (400), không
//      tạo gói rỗng, không lấy câu chủ đề khác lấp chỗ.
//   2. Tạo MỘT bài tập qua createAssignment dùng chung, giao ĐÍCH DANH cho
//      đúng nhóm học sinh đã chọn (field `targetStudentIds` — cơ chế đích
//      danh của assignmentService; bài thường không có field này vẫn là
//      bài cả lớp). Bài ôn tập: tối đa 10 câu, làm lại tự do
//      (maxAttempts = 0), không deadline.
//   3. Thông báo ngay cho từng học sinh (notificationService, mẫu
//      "ASSIGNMENT" như route tạo bài tập) + lập lịch NHẮC LẶP LẠI CÁCH
//      QUÃNG (spaced repetition): 2 nhắc/học sinh lúc +3 ngày và +7 ngày,
//      09:00 giờ địa phương, qua reminderService — scheduler nền trong
//      app.js (processDueReminders) sẽ bắn push khi tới giờ.
// Phạm vi lớp giống hệt heatmap: admin xem/tạo cho mọi lớp; giáo viên chỉ
// thao tác trên lớp mình phụ trách (teacher_classes); học sinh bị chặn ở
// route (requireRoles) lẫn permission middleware.
import { getCollection } from "../db.js";
import { getClassStudents, isClassTeacher } from "./classService.js";
import { subjectLabelOf } from "./heatmapService.js";
import { createAssignment } from "./assignmentService.js";
import { createNotification } from "./notificationService.js";
import { createReminder } from "./reminderService.js";
import { httpError } from "../utils/httpError.js";

/** Số câu tối đa trong một gói — bài luyện ngắn 5–10 phút. */
export const MAX_PACK_QUESTIONS = 10;
/** Các mốc nhắc lặp lại cách quãng (ngày), tính từ lúc tạo gói. */
export const REMIND_OFFSET_DAYS = [3, 7];
/** Giờ bắn nhắc (giờ địa phương của server). */
export const REMIND_HOUR = 9;

/** Phạm vi lớp — cùng luật với heatmapService.getClassHeatmap. */
async function assertClassScope({ classId, requester }) {
  const cls = await getCollection("classes").findOne({ id: classId });
  if (!cls) throw httpError("Không tìm thấy lớp học", 404);
  const role = requester?.role;
  const requesterId = requester?.sub || requester?.id;
  if (role !== "admin") {
    if (role !== "teacher" || !requesterId || !(await isClassTeacher(requesterId, classId))) {
      throw httpError("Bạn không phụ trách lớp này", 403);
    }
  }
  return { cls, requesterId };
}

/**
 * Câu ngân hàng có thuộc chủ đề T không — ĐÚNG luật sinh khoá chủ đề của
 * bản đồ nhiệt (heatmapService.topicLabelForQuestion): category của câu
 * ngân hàng là nhãn chủ đề ưu tiên cao nhất; không có category thì dùng
 * nhãn môn của subject.
 */
export function questionBelongsToTopic(q, topic) {
  const cat = String(q?.category || "").trim();
  if (cat) return cat === topic;
  return subjectLabelOf(q?.subject) === topic;
}

/** Mọi câu CƠ BẢN (difficulty "easy") thuộc chủ đề, theo đúng luật trên. */
export async function findTopicEasyQuestions(topic) {
  const t = String(topic || "").trim();
  if (!t) return [];
  // Truy vấn thu hẹp trước (category đúng chủ đề, hoặc category trống để
  // xét theo nhãn môn) rồi lọc lại bằng hàm thuần cho khớp 100% luật.
  const candidates = await getCollection("question_banks")
    .find({
      difficulty: "easy",
      $or: [{ category: t }, { category: "" }, { category: null }, { category: { $exists: false } }],
    })
    .toArray();
  return candidates.filter((q) => questionBelongsToTopic(q, t));
}

/** Mốc nhắc: +days ngày kể từ `from`, đặt giờ về REMIND_HOUR:00 địa phương. */
export function remindDatePlusDays(days, from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  d.setHours(REMIND_HOUR, 0, 0, 0);
  return d;
}

/**
 * Xem trước gói: đếm + liệt kê các câu cơ bản cùng chủ đề sẽ được trích.
 * Giáo viên thấy TRƯỚC khi tạo — kể cả 0 câu (để biết vì sao không tạo được).
 */
export async function getRemediationPreview({ classId, topic, requester }) {
  await assertClassScope({ classId, requester });
  const t = String(topic || "").trim();
  if (!t) throw httpError("Thiếu chủ đề (topic)", 400);
  const found = await findTopicEasyQuestions(t);
  const picked = found.slice(0, MAX_PACK_QUESTIONS);
  return {
    topic: t,
    totalFound: found.length,
    willUse: picked.length,
    questions: picked.map((q) => ({ id: q.id, content: String(q.content || "").slice(0, 160) })),
  };
}

/**
 * Tạo gói can thiệp 1 chạm cho một nhóm học sinh của lớp ở một chủ đề.
 * Học sinh ngoài roster lớp bị loại và báo lại qua `skippedStudentIds`.
 * Lỗi ở bước thông báo/nhắc của TỪNG học sinh không huỷ cả gói: gói vẫn
 * được tạo, response kèm `warnings` + số đếm thật đã gửi/tạo được — không
 * lặng lẽ nuốt lỗi.
 */
export async function createRemediationPack({ classId, topic, studentIds, requester }) {
  const { requesterId } = await assertClassScope({ classId, requester });
  const t = String(topic || "").trim();
  if (!t) throw httpError("Thiếu chủ đề (topic)", 400);

  const requested = [...new Set((Array.isArray(studentIds) ? studentIds : []).filter(Boolean))];
  if (!requested.length) throw httpError("Chưa chọn học sinh nào cho gói ôn tập", 400);

  const roster = await getClassStudents(classId);
  const rosterIds = new Set(roster.map((s) => s.id));
  const validIds = requested.filter((id) => rosterIds.has(id));
  const skippedStudentIds = requested.filter((id) => !rosterIds.has(id));
  if (!validIds.length) {
    throw httpError("Không có học sinh nào đã chọn thuộc lớp này", 400);
  }

  const found = await findTopicEasyQuestions(t);
  if (!found.length) {
    throw httpError(
      `Chưa có câu hỏi cơ bản (độ khó dễ) nào cho chủ đề "${t}" trong ngân hàng — không tạo gói rỗng`,
      400,
    );
  }
  const picked = found.slice(0, MAX_PACK_QUESTIONS);

  const assignment = await createAssignment({
    teacherId: requesterId,
    title: `Ôn tập bổ trợ: ${t}`,
    description: `Gói ôn tập tự động từ Bản đồ nhiệt điểm mù cho chủ đề "${t}".`,
    classId,
    questionIds: picked.map((q) => q.id),
    maxAttempts: 0, // ôn tập = làm lại tự do
    deadline: null,
    targetStudentIds: validIds,
    source: "remediation",
    topicKey: t,
  });

  const warnings = [];

  // Thông báo ngay cho từng học sinh được giao (mẫu route assignments).
  const teacher = await getCollection("users").findOne({ id: requesterId });
  let notificationsSent = 0;
  for (const studentId of validIds) {
    try {
      const notif = await createNotification({
        toUserId: studentId,
        fromUserId: requesterId,
        fromUsername: teacher?.username || "",
        fromName: teacher?.name || "",
        type: "ASSIGNMENT",
        title: "📝 Bài ôn tập bổ trợ mới",
        message: `Bạn có bài ôn tập bổ trợ chủ đề "${t}": ${assignment.title}`,
        link: `educational-games/#/assignment/${assignment.code}`,
        data: { assignmentId: assignment.id, code: assignment.code },
      });
      if (notif) notificationsSent += 1;
    } catch (e) {
      warnings.push(`Chưa gửi được thông báo cho học sinh ${studentId}: ${e.message}`);
    }
  }

  // Nhắc lặp lại cách quãng +3/+7 ngày lúc 09:00 cho từng học sinh.
  const remindDates = REMIND_OFFSET_DAYS.map((d) => remindDatePlusDays(d).toISOString());
  let remindersCreated = 0;
  for (const studentId of validIds) {
    for (const remindAt of remindDates) {
      try {
        await createReminder({
          userId: studentId,
          title: `Ôn tập lại: ${t}`,
          message: `Đã tới lúc ôn lại bài "${assignment.title}" để nhớ lâu hơn.`,
          remindAt,
          type: "REMEDIATION",
          relatedId: assignment.id,
        });
        remindersCreated += 1;
      } catch (e) {
        warnings.push(`Chưa tạo được nhắc ${remindAt} cho học sinh ${studentId}: ${e.message}`);
      }
    }
  }

  return {
    assignmentId: assignment.id,
    code: assignment.code,
    questionCount: picked.length,
    studentCount: validIds.length,
    skippedStudentIds,
    notificationsSent,
    remindersCreated,
    remindersPerStudent: REMIND_OFFSET_DAYS.length,
    remindDates,
    warnings,
  };
}
