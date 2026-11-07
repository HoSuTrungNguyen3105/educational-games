// services/lessonService.js
//
// Bài học EduPlay AI Studio (Đợt 1 — tầng dữ liệu + API, chưa có giao diện).
// Model TRANG/PHẦN TỬ dạng JSON mới (quyết định đã duyệt — KHÔNG port mô
// hình HTML-thiệp của editor thiệp cưới): mỗi bài học có nhiều trang, mỗi
// trang có nhiều phần tử tự do trên một canvas logic. Model này là điều
// kiện để: (a) câu hỏi chấm được phía server mà không lộ đáp án, (b) AI
// sinh dữ liệu có cấu trúc và validate được (xem báo cáo khảo sát GĐ0).
//
// Bảo mật đáp án (§20 đặc tả): `correctAnswer` của phần tử question CHỈ
// tồn tại ở document server + DTO chủ sở hữu. Mọi đường đọc phía học sinh
// đi qua `stripAnswers()` — lọc đệ quy khoá `correctAnswer` ở MỌI cấp lồng
// nhau của pages/elements/props.
//
// Phân quyền sở hữu: chỉ giáo viên tạo bài (ownerId) mới sửa/xoá/publish
// được bài của mình; admin là ngoại lệ (bám mẫu assignments/pages:
// authenticate + requireRoles ở route, kiểm tra owner tại service).
import { getCollection } from "../db.js";
import * as gameService from "./gameService.js";
import { isAnswerCorrect, DEFAULT_POINTS } from "../lib/gradeAnswer.js";

export const LESSONS_COLLECTION = "lessons";
export const LESSON_PROGRESS_COLLECTION = "lessonProgress";

const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

// ── Hệ toạ độ canvas + giới hạn ─────────────────────────────────────────
// Canvas logic CỐ ĐỊNH 1280×720 (tỉ lệ 16:9). Client Studio (đợt 2) vẽ
// theo đúng hệ này rồi scale theo khung hiển thị thật. Mọi phần tử phải
// nằm TRỌN trong canvas: 0 ≤ x, 0 ≤ y, w > 0, h > 0, x + w ≤ 1280,
// y + h ≤ 720. z (zIndex) tuỳ chọn, nguyên ≥ 0.
export const CANVAS = { width: 1280, height: 720 };
export const MAX_PAGES = 50;                 // tối đa 50 trang / bài
export const MAX_ELEMENTS_PER_PAGE = 100;    // tối đa 100 phần tử / trang
// Trần kích thước JSON của toàn bộ pages[]: 2MB (dưới trần body 10mb của
// app và cùng tinh thần htmlMaxMb=4MB dành cho HTML của config).
export const MAX_PAGES_JSON_BYTES = 2 * 1024 * 1024;
export const MAX_OPTIONS_PER_QUESTION = 10;

export const ELEMENT_TYPES = ["title", "text", "note", "image", "question", "game"];
export const QUESTION_TYPES = ["single", "fill"];
const TEXT_ALIGNS = ["left", "center", "right"];
const GRADES = [1, 2, 3, 4, 5];

function fail(status, message, extra) {
  const e = new Error(message);
  e.status = status;
  if (extra) Object.assign(e, extra);
  return e;
}

/** "" / null / số ngoài 1–5 → null (chưa phân lớp) — bám normGrade của questionBankService. */
function normGrade(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return GRADES.includes(n) ? n : null;
}

function normText(v, max) {
  return String(v ?? "").slice(0, max);
}

function normObjectives(v) {
  if (Array.isArray(v)) return v.map((s) => String(s ?? "")).join("\n").slice(0, 2000);
  return normText(v, 2000);
}

// ── Chuẩn hoá + validate cấu trúc (dùng cho CẢ tạo mới lẫn cập nhật) ────
// Nguyên tắc: draft được phép THIẾU nội dung (chưa có đáp án, chưa chọn
// game...) nhưng không được phép SAI CẤU TRÚC — type lạ, qtype lạ, hình
// học ngoài biên, trùng id đều bị từ chối ngay khi lưu. Tính đầy đủ của
// câu hỏi/game chỉ bắt buộc tại publish (xem collectPublishErrors).

function normalizeOption(raw, qLabel) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw fail(400, `${qLabel}: đáp án phải là một đối tượng { id, content }`);
  }
  return {
    id: String(raw.id || "").trim() || uid("opt"),
    content: normText(raw.content, 500),
  };
}

function normalizeProps(type, rawProps, elLabel) {
  const props = rawProps && typeof rawProps === "object" && !Array.isArray(rawProps) ? rawProps : {};

  if (type === "title" || type === "text" || type === "note") {
    const out = { text: normText(props.text, 5000) };
    if (props.fontSize !== undefined && props.fontSize !== null) {
      const fs = Number(props.fontSize);
      if (!Number.isFinite(fs) || fs < 8 || fs > 120) {
        throw fail(400, `${elLabel}: fontSize phải là số trong khoảng 8–120`);
      }
      out.fontSize = fs;
    }
    if (props.color !== undefined && props.color !== null && props.color !== "") {
      out.color = normText(props.color, 32);
    }
    if (TEXT_ALIGNS.includes(props.align)) out.align = props.align;
    return out;
  }

  if (type === "image") {
    // imageUrl lấy từ Thư viện ảnh hiện có (images API) — chỉ lưu link.
    return {
      imageUrl: normText(props.imageUrl, 2048),
      ...(props.alt !== undefined ? { alt: normText(props.alt, 300) } : {}),
    };
  }

  if (type === "question") {
    const qtype = props.qtype === undefined || props.qtype === null || props.qtype === ""
      ? "single"
      : String(props.qtype);
    if (!QUESTION_TYPES.includes(qtype)) {
      throw fail(400, `${elLabel}: qtype chỉ nhận "single" hoặc "fill" (nhận "${qtype}")`);
    }
    const out = { prompt: normText(props.prompt, 2000), qtype };
    if (qtype === "single") {
      const rawOptions = Array.isArray(props.options) ? props.options : [];
      if (rawOptions.length > MAX_OPTIONS_PER_QUESTION) {
        throw fail(400, `${elLabel}: tối đa ${MAX_OPTIONS_PER_QUESTION} đáp án cho một câu hỏi`);
      }
      out.options = rawOptions.map((o) => normalizeOption(o, elLabel));
      const optIds = out.options.map((o) => o.id);
      if (new Set(optIds).size !== optIds.length) {
        throw fail(400, `${elLabel}: id đáp án bị trùng trong cùng câu hỏi`);
      }
    } else {
      out.options = []; // câu điền từ không dùng options (chấm chuỗi ở gradeAnswer)
    }
    // correctAnswer: "single" → id của một option; "fill" → chuỗi đáp án.
    // Khớp đúng ngữ nghĩa ngân hàng câu hỏi + gradeAnswer.js để player đợt
    // sau chấm lại bằng chính helper sẵn có.
    out.correctAnswer = normText(props.correctAnswer, 500);
    if (props.explanation !== undefined) out.explanation = normText(props.explanation, 2000);
    if (props.points !== undefined && props.points !== null) {
      const pts = Number(props.points);
      if (!Number.isFinite(pts) || pts < 0) throw fail(400, `${elLabel}: points phải là số ≥ 0`);
      out.points = pts;
    }
    if (props.feedbackCorrect !== undefined) out.feedbackCorrect = normText(props.feedbackCorrect, 500);
    if (props.feedbackWrong !== undefined) out.feedbackWrong = normText(props.feedbackWrong, 500);
    if (props.sourceQuestionId !== undefined && props.sourceQuestionId !== null && props.sourceQuestionId !== "") {
      out.sourceQuestionId = normText(props.sourceQuestionId, 64);
    }
    return out;
  }

  // type === "game": CHỈ giữ tham chiếu gameId (game online trong collection
  // `games`) — không chép HTML/config vào bài học. Runtime thuộc đợt 3.
  return { gameId: normText(props.gameId, 64).trim() };
}

function normalizeElement(raw, pageLabel) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw fail(400, `${pageLabel}: mỗi phần tử phải là một đối tượng`);
  }
  const id = String(raw.id || "").trim() || uid("el");
  const elLabel = `${pageLabel}, phần tử ${id}`;
  const type = String(raw.type || "");
  if (!ELEMENT_TYPES.includes(type)) {
    throw fail(400, `${elLabel}: type "${type || "(trống)"}" không hợp lệ — chỉ nhận ${ELEMENT_TYPES.join(", ")}`);
  }
  const x = Number(raw.x), y = Number(raw.y), w = Number(raw.w), h = Number(raw.h);
  if (![x, y, w, h].every(Number.isFinite)) {
    throw fail(400, `${elLabel}: x, y, w, h phải là số`);
  }
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > CANVAS.width || y + h > CANVAS.height) {
    throw fail(400, `${elLabel}: hình học ngoài biên canvas ${CANVAS.width}×${CANVAS.height} (x=${x}, y=${y}, w=${w}, h=${h})`);
  }
  const el = { id, type, x, y, w, h };
  if (raw.z !== undefined && raw.z !== null) {
    const z = Number(raw.z);
    if (!Number.isInteger(z) || z < 0) throw fail(400, `${elLabel}: z phải là số nguyên ≥ 0`);
    el.z = z;
  }
  el.props = normalizeProps(type, raw.props, elLabel);
  return el;
}

function normalizePages(rawPages) {
  if (rawPages === undefined || rawPages === null) return [];
  if (!Array.isArray(rawPages)) throw fail(400, "pages phải là một mảng");
  if (rawPages.length > MAX_PAGES) {
    throw fail(400, `Bài học tối đa ${MAX_PAGES} trang (nhận ${rawPages.length})`);
  }
  const pageIds = new Set();
  const elementIds = new Set();
  const pages = rawPages.map((rawPage, pi) => {
    if (!rawPage || typeof rawPage !== "object" || Array.isArray(rawPage)) {
      throw fail(400, `Trang ${pi + 1}: trang phải là một đối tượng`);
    }
    const id = String(rawPage.id || "").trim() || uid("page");
    if (pageIds.has(id)) throw fail(400, `Trùng id trang "${id}" trong cùng bài học`);
    pageIds.add(id);
    const rawElements = rawPage.elements === undefined || rawPage.elements === null ? [] : rawPage.elements;
    if (!Array.isArray(rawElements)) throw fail(400, `Trang ${pi + 1} (${id}): elements phải là một mảng`);
    if (rawElements.length > MAX_ELEMENTS_PER_PAGE) {
      throw fail(400, `Trang ${pi + 1} (${id}): tối đa ${MAX_ELEMENTS_PER_PAGE} phần tử mỗi trang (nhận ${rawElements.length})`);
    }
    const elements = rawElements.map((el) => normalizeElement(el, `Trang ${pi + 1} (${id})`));
    for (const el of elements) {
      if (elementIds.has(el.id)) {
        throw fail(400, `Trùng id phần tử "${el.id}" trong cùng bài học`);
      }
      elementIds.add(el.id);
    }
    return { id, title: normText(rawPage.title, 200), elements };
  });
  const bytes = Buffer.byteLength(JSON.stringify(pages), "utf8");
  if (bytes > MAX_PAGES_JSON_BYTES) {
    throw fail(400, `Nội dung bài học quá lớn (${Math.round(bytes / 1024)}KB > ${MAX_PAGES_JSON_BYTES / 1024 / 1024}MB)`);
  }
  return pages;
}

/** Dựng các trường metadata đã chuẩn hoá từ dữ liệu client (không gồm pages). */
function normalizeMeta(data = {}) {
  return {
    title: normText(data.title, 200).trim(),
    subject: normText(data.subject, 100).trim(),
    grade: normGrade(data.grade),
    description: normText(data.description, 2000),
    objectives: normObjectives(data.objectives),
  };
}

// ── Tra cứu game (cho phần tử game) ──────────────────────────────────────
// Hệ thống tra được ở phía server là collection `games` (game online) qua
// chính gameService.get — id lạ/không phải ObjectId hợp lệ → null.
async function gameExists(gameId) {
  if (!gameId) return false;
  const g = await gameService.get(gameId);
  return Boolean(g);
}

async function assertSavedGamesExist(pages) {
  const ids = new Set();
  for (const page of pages) {
    for (const el of page.elements) {
      if (el.type === "game" && el.props.gameId) ids.add(el.props.gameId);
    }
  }
  for (const gameId of ids) {
    if (!(await gameExists(gameId))) {
      throw fail(400, `Phần tử game trỏ tới game không tồn tại: ${gameId}`);
    }
  }
}

// ── Serialize ────────────────────────────────────────────────────────────
function serialize(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest;
}

/** DTO danh sách (giáo viên + học sinh): metadata tối thiểu, không kèm pages. */
function serializeMeta(doc) {
  if (!doc) return null;
  return {
    id: doc.id,
    title: doc.title || "",
    subject: doc.subject || "",
    grade: doc.grade ?? null,
    description: doc.description || "",
    objectives: doc.objectives || "",
    ownerId: doc.ownerId,
    status: doc.status,
    pageCount: Array.isArray(doc.pages) ? doc.pages.length : 0,
    elementCount: Array.isArray(doc.pages)
      ? doc.pages.reduce((n, p) => n + (Array.isArray(p.elements) ? p.elements.length : 0), 0)
      : 0,
    publishedAt: doc.publishedAt ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

/**
 * Lọc đệ quy: bỏ khoá `correctAnswer` ở MỌI cấp (pages → elements → props
 * và bất kỳ cấu trúc lồng nào khác). Dùng cho mọi DTO phía học sinh.
 */
export function stripAnswers(value) {
  if (Array.isArray(value)) return value.map(stripAnswers);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === "correctAnswer") continue;
      out[k] = stripAnswers(v);
    }
    return out;
  }
  return value;
}

// ── Quyền sở hữu ─────────────────────────────────────────────────────────
async function loadOwnedLesson(id, actor) {
  const doc = await getCollection(LESSONS_COLLECTION).findOne({ id: String(id || "") });
  if (!doc) throw fail(404, "Không tìm thấy bài học");
  if (doc.ownerId !== actor?.id && actor?.role !== "admin") {
    throw fail(403, "Chỉ chủ sở hữu mới thao tác được bài học này");
  }
  return doc;
}

// ── API giáo viên ────────────────────────────────────────────────────────
export async function createLesson(ownerId, data = {}) {
  const meta = normalizeMeta(data);
  const pages = normalizePages(data.pages);
  await assertSavedGamesExist(pages);
  const now = new Date().toISOString();
  const doc = {
    id: uid("lesson"),
    ownerId,
    ...meta,
    status: "draft",
    pages,
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  await getCollection(LESSONS_COLLECTION).insertOne(doc);
  return serialize(doc);
}

function searchFilter(search) {
  const s = String(search || "").trim();
  if (!s) return null;
  const rx = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  return { $or: [{ title: rx }, { subject: rx }] };
}

export async function listMyLessons(ownerId, { search, status, page = 1, perPage = 20 } = {}) {
  const coll = getCollection(LESSONS_COLLECTION);
  const filter = { ownerId };
  if (status === "draft" || status === "published") filter.status = status;
  const sf = searchFilter(search);
  if (sf) Object.assign(filter, sf);
  const p = Math.max(1, Number(page) || 1);
  const pp = Math.min(100, Math.max(1, Number(perPage) || 20));
  const total = await coll.countDocuments(filter);
  const docs = await coll.find(filter)
    .sort({ updatedAt: -1 })
    .skip((p - 1) * pp)
    .limit(pp)
    .toArray();
  return { items: docs.map(serializeMeta), total };
}

/** Bản đầy đủ cho chủ sở hữu/admin — GỒM correctAnswer (chỉ vai này được thấy). */
export async function getLessonForOwner(id, actor) {
  return serialize(await loadOwnedLesson(id, actor));
}

/**
 * Cập nhật: metadata (nếu gửi) + toàn bộ pages (nếu gửi). Giữ nguyên
 * status/publishedAt — sửa bài đang published thì nội dung mới áp dụng
 * ngay cho học sinh (giống cách games xử lý), Studio đợt 2 sẽ cảnh báo.
 */
export async function updateLesson(id, actor, data = {}) {
  const coll = getCollection(LESSONS_COLLECTION);
  const current = await loadOwnedLesson(id, actor);
  const set = { updatedAt: new Date().toISOString() };
  if (data.title !== undefined || data.subject !== undefined || data.grade !== undefined
    || data.description !== undefined || data.objectives !== undefined) {
    Object.assign(set, normalizeMeta({ ...current, ...data }));
  }
  if (data.pages !== undefined) {
    set.pages = normalizePages(data.pages);
    await assertSavedGamesExist(set.pages);
  }
  const updated = await coll.findOneAndUpdate(
    { id: current.id }, { $set: set }, { returnDocument: "after" },
  );
  return serialize(updated);
}

export async function deleteLesson(id, actor) {
  const current = await loadOwnedLesson(id, actor);
  await getCollection(LESSONS_COLLECTION).deleteOne({ id: current.id });
  return { id: current.id };
}

// ── Publish / unpublish (§15 đặc tả: validate trước, không publish dở) ──
export async function collectPublishErrors(doc) {
  const errors = [];
  if (!String(doc.title || "").trim()) {
    errors.push({ field: "title", message: "Bài học chưa có tiêu đề" });
  }
  const pages = Array.isArray(doc.pages) ? doc.pages : [];
  if (pages.length === 0) {
    errors.push({ field: "pages", message: "Bài học chưa có trang nào" });
  }
  const gameIds = new Set();
  pages.forEach((page, pi) => {
    (page.elements || []).forEach((el, ei) => {
      const at = { pageId: page.id, pageIndex: pi, elementId: el.id, elementIndex: ei };
      if (el.type === "question") {
        const q = el.props || {};
        if (!String(q.prompt || "").trim()) {
          errors.push({ ...at, field: "prompt", message: "Câu hỏi chưa có nội dung" });
        }
        if (q.qtype === "single") {
          const opts = Array.isArray(q.options) ? q.options : [];
          if (opts.length < 2) {
            errors.push({ ...at, field: "options", message: "Câu trắc nghiệm cần ít nhất 2 đáp án" });
          } else if (!q.correctAnswer || !opts.some((o) => o.id === q.correctAnswer)) {
            errors.push({ ...at, field: "correctAnswer", message: "Chưa chọn đáp án đúng trong danh sách đáp án" });
          }
        } else if (q.qtype === "fill") {
          if (!String(q.correctAnswer || "").trim()) {
            errors.push({ ...at, field: "correctAnswer", message: "Câu điền từ chưa có đáp án" });
          }
        }
      } else if (el.type === "game") {
        if (!el.props?.gameId) {
          errors.push({ ...at, field: "gameId", message: "Phần tử game chưa chọn game" });
        } else {
          gameIds.add(el.props.gameId);
        }
      }
    });
  });
  for (const gameId of gameIds) {
    if (!(await gameExists(gameId))) {
      errors.push({ field: "gameId", gameId, message: `Game không còn tồn tại: ${gameId}` });
    }
  }
  return errors;
}

export async function publishLesson(id, actor) {
  const coll = getCollection(LESSONS_COLLECTION);
  const current = await loadOwnedLesson(id, actor);
  const errors = await collectPublishErrors(current);
  if (errors.length > 0) {
    throw fail(400, "Bài học chưa đủ điều kiện xuất bản", { errors });
  }
  const now = new Date().toISOString();
  const updated = await coll.findOneAndUpdate(
    { id: current.id },
    { $set: { status: "published", publishedAt: now, updatedAt: now } },
    { returnDocument: "after" },
  );
  return serialize(updated);
}

export async function unpublishLesson(id, actor) {
  const coll = getCollection(LESSONS_COLLECTION);
  const current = await loadOwnedLesson(id, actor);
  const updated = await coll.findOneAndUpdate(
    { id: current.id },
    // publishedAt giữ lại như dấu mốc lần xuất bản gần nhất; status mới là
    // nguồn sự thật cho việc học sinh có đọc được hay không.
    { $set: { status: "draft", updatedAt: new Date().toISOString() } },
    { returnDocument: "after" },
  );
  return serialize(updated);
}

// ── API học sinh (mọi role đã đăng nhập đọc được) ────────────────────────
export async function listPublishedLessons({ search, subject, grade, page = 1, perPage = 20 } = {}) {
  const coll = getCollection(LESSONS_COLLECTION);
  const filter = { status: "published" };
  if (subject) filter.subject = subject;
  const g = normGrade(grade);
  if (grade !== undefined && grade !== null && grade !== "" && g !== null) filter.grade = g;
  const sf = searchFilter(search);
  if (sf) Object.assign(filter, sf);
  const p = Math.max(1, Number(page) || 1);
  const pp = Math.min(100, Math.max(1, Number(perPage) || 20));
  const total = await coll.countDocuments(filter);
  const docs = await coll.find(filter)
    .sort({ publishedAt: -1, updatedAt: -1 })
    .skip((p - 1) * pp)
    .limit(pp)
    .toArray();
  return { items: docs.map(serializeMeta), total };
}

/**
 * Chi tiết bài đã published cho học sinh — DTO đã lọc sạch correctAnswer.
 * Đợt 3 siết thêm: `explanation` + `feedbackCorrect`/`feedbackWrong` của
 * phần tử question CŨNG không đi theo DTO này — chúng chỉ được endpoint
 * chấm bài (checkLessonAnswer) trả về sau khi học sinh trả lời (và
 * explanation chỉ khi trả lời ĐÚNG), để đáp án/giải thích không lộ qua
 * dữ liệu trang trước thời điểm chấm (§20 đặc tả). Bản giáo viên không
 * qua hàm này nên không bị ảnh hưởng.
 */
export async function getPublishedLessonForStudent(id) {
  const doc = await getCollection(LESSONS_COLLECTION).findOne({ id: String(id || "") });
  if (!doc || doc.status !== "published") return null;
  const dto = stripAnswers(serialize(doc));
  for (const page of dto.pages || []) {
    for (const el of page.elements || []) {
      if (el.type === "question" && el.props) {
        delete el.props.explanation;
        delete el.props.feedbackCorrect;
        delete el.props.feedbackWrong;
      }
    }
  }
  return dto;
}

// ── Đợt 3: chấm bài phía server + tiến độ học sinh ──────────────────────
// Học sinh KHÔNG tự chấm ở client (DTO đã lọc đáp án). Mọi lượt trả lời
// đi qua checkLessonAnswer: chấm bằng gradeAnswer.js trên bản đầy đủ
// phía server, ghi tiến độ vào collection `lessonProgress`.
// KHÔNG cộng xu/sao ở đây — hệ thưởng riêng chưa được duyệt.

/** Mọi phần tử question của bài (phẳng hoá qua các trang), kèm pageId. */
function questionElementsOf(doc) {
  const out = [];
  for (const page of Array.isArray(doc?.pages) ? doc.pages : []) {
    for (const el of page.elements || []) {
      if (el.type === "question") out.push({ pageId: page.id, element: el });
    }
  }
  return out;
}

async function loadPublishedLesson(id) {
  const doc = await getCollection(LESSONS_COLLECTION).findOne({ id: String(id || "") });
  if (!doc || doc.status !== "published") throw fail(404, "Không tìm thấy bài học");
  return doc;
}

function serializeProgress(doc, lessonDoc) {
  const questions = lessonDoc ? questionElementsOf(lessonDoc) : [];
  const correctIds = Array.isArray(doc?.correctElementIds) ? doc.correctElementIds : [];
  return {
    lessonId: lessonDoc?.id ?? doc?.lessonId ?? null,
    correctElementIds: correctIds,
    attempts: Number(doc?.attempts) || 0,
    totalQuestions: questions.length,
    correctCount: questions.length
      ? questions.filter((q) => correctIds.includes(q.element.id)).length
      : correctIds.length,
    completed: Boolean(doc?.completedAt),
    completedAt: doc?.completedAt ?? null,
    updatedAt: doc?.updatedAt ?? null,
  };
}

/** Tiến độ rỗng (học sinh chưa học bài này) — vẫn kèm tổng số câu hỏi. */
function emptyProgress(lessonDoc) {
  return serializeProgress(null, lessonDoc);
}

async function findProgress(userId, lessonId) {
  return getCollection(LESSON_PROGRESS_COLLECTION).findOne({ userId, lessonId });
}

/** Đặt completedAt nếu đủ điều kiện: MỌI question đã đúng ít nhất 1 lần. */
function completionPatch(doc, progress) {
  if (progress.completedAt) return {};
  const questions = questionElementsOf(doc);
  if (questions.length === 0) return {}; // bài không có câu hỏi → qua completeLesson
  const correct = new Set(progress.correctElementIds || []);
  return questions.every((q) => correct.has(q.element.id))
    ? { completedAt: new Date().toISOString() }
    : {};
}

/** Tiến độ của chính học sinh cho một bài đã published (404 nếu bài không published). */
export async function getProgressForStudent(userId, lessonId) {
  const lesson = await loadPublishedLesson(lessonId);
  const progress = await findProgress(userId, lesson.id);
  return progress ? serializeProgress(progress, lesson) : emptyProgress(lesson);
}

/** Toàn bộ tiến độ của học sinh (cho danh sách bài học gắn badge trạng thái). */
export async function listProgressForStudent(userId) {
  const docs = await getCollection(LESSON_PROGRESS_COLLECTION)
    .find({ userId }).sort({ updatedAt: -1 }).toArray();
  if (docs.length === 0) return [];
  const lessons = await getCollection(LESSONS_COLLECTION)
    .find({ id: { $in: docs.map((d) => d.lessonId) } }).toArray();
  const byId = new Map(lessons.map((l) => [l.id, l]));
  return docs.map((d) => serializeProgress(d, byId.get(d.lessonId) || null));
}

/**
 * Chấm MỘT câu trả lời (endpoint check). Trả về kết quả + tiến độ mới.
 * explanation CHỈ kèm khi trả lời đúng — sai thì giải thích vẫn là bí mật.
 */
export async function checkLessonAnswer(userId, lessonId, elementId, answer) {
  const lesson = await loadPublishedLesson(lessonId);
  const hit = questionElementsOf(lesson).find((q) => q.element.id === String(elementId || ""));
  if (!hit) {
    // Phân biệt "không có phần tử này" với "phần tử không phải câu hỏi"
    // để client báo lỗi rõ ràng.
    const anyEl = (lesson.pages || []).some((p) => (p.elements || []).some((el) => el.id === String(elementId || "")));
    throw fail(400, anyEl
      ? "Phần tử này không phải câu hỏi nên không chấm được"
      : "Không tìm thấy phần tử câu hỏi trong bài học");
  }
  const el = hit.element;
  const props = el.props || {};
  // Đưa props của phần tử question về đúng hình gradeAnswer.js hiểu:
  // single → multiple_choice (so id phương án), fill → fill-in (so chuỗi).
  const question = {
    questionType: props.qtype === "fill" ? "fill-in" : "multiple_choice",
    correctAnswer: props.correctAnswer,
    options: props.options || [],
  };
  const correct = isAnswerCorrect(question, answer);
  const points = Number.isFinite(Number(props.points)) ? Number(props.points) : DEFAULT_POINTS;
  const earned = correct ? points : 0;

  const coll = getCollection(LESSON_PROGRESS_COLLECTION);
  const now = new Date().toISOString();
  let progress = await findProgress(userId, lesson.id);
  if (!progress) {
    progress = {
      id: uid("lprog"), userId, lessonId: lesson.id,
      correctElementIds: [], attempts: 0, completedAt: null,
      createdAt: now, updatedAt: now,
    };
    await coll.insertOne(progress);
  }
  const set = { attempts: (Number(progress.attempts) || 0) + 1, updatedAt: now };
  if (correct && !progress.correctElementIds.includes(el.id)) {
    set.correctElementIds = [...progress.correctElementIds, el.id];
  }
  Object.assign(set, completionPatch(lesson, { ...progress, ...set }));
  const updated = await coll.findOneAndUpdate(
    { userId, lessonId: lesson.id }, { $set: set }, { returnDocument: "after" },
  );

  const result = {
    correct,
    points: earned,
    feedback: correct ? (props.feedbackCorrect || "") : (props.feedbackWrong || ""),
    progress: serializeProgress(updated, lesson),
  };
  if (correct) result.explanation = props.explanation || "";
  return result;
}

/**
 * Ghi nhận hoàn thành bài KHÔNG có câu hỏi (player gọi khi học sinh mở
 * tới trang cuối). Bài CÓ câu hỏi: chỉ hoàn thành khi mọi câu đã đúng —
 * endpoint này khi đó chỉ trả lại tiến độ hiện tại, không tự đặt
 * completedAt (nguồn sự thật là checkLessonAnswer).
 */
export async function completeLesson(userId, lessonId) {
  const lesson = await loadPublishedLesson(lessonId);
  const coll = getCollection(LESSON_PROGRESS_COLLECTION);
  const now = new Date().toISOString();
  let progress = await findProgress(userId, lesson.id);
  if (!progress) {
    progress = {
      id: uid("lprog"), userId, lessonId: lesson.id,
      correctElementIds: [], attempts: 0, completedAt: null,
      createdAt: now, updatedAt: now,
    };
    await coll.insertOne(progress);
  }
  const set = { updatedAt: now };
  if (!progress.completedAt) {
    if (questionElementsOf(lesson).length === 0) set.completedAt = now;
    else Object.assign(set, completionPatch(lesson, progress));
  }
  const updated = await coll.findOneAndUpdate(
    { userId, lessonId: lesson.id }, { $set: set }, { returnDocument: "after" },
  );
  return serializeProgress(updated, lesson);
}
