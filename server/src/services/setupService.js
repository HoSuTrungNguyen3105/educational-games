import fs from "node:fs/promises";
import path from "node:path";
import { getCollection } from "../db.js";
import { ObjectId } from "mongodb";
import * as storage from "./templateStorageService.js";

// Schema mới — chỉ các trường này được trả về cho frontend.
// htmlUrl = link file HTML trên Supabase Storage · thumbnail = link ảnh đại diện.
// Trường `icon` (emoji) đã bị loại bỏ hoàn toàn theo spec — không còn trong
// response, không nhận trong request, đã $unset trong dữ liệu cũ.
const TEMPLATE_FIELDS = [
  "name", "description", "type", "category", "ring",
  "htmlUrl", "thumbnail", "fileName", "version", "status", "playMode", "createdAt", "updatedAt",
];

// Chuẩn hóa về schema mới: bỏ trường cũ (id/slug/categoryLabel/icon/htmlTemplate)
function serialize(doc) {
  if (!doc) return doc;
  const out = { _id: doc._id.toString() };
  for (const key of TEMPLATE_FIELDS) {
    let value = doc[key];
    if (value === undefined) value = "";
    out[key] = value;
  }
  if (!out.type) out.type = "play-to-learn";
  if (!out.status) out.status = "draft";
  if (!out.playMode) out.playMode = "solo";
  out.version = Number(out.version) || 1;
  return out;
}

export async function listTemplates() {
  const docs = await getCollection("templates").find({}).sort({ name: 1 }).toArray();
  return docs.map(serialize);
}

export async function getTemplate(id) {
  try {
    const doc = await getCollection("templates").findOne({ _id: new ObjectId(id) });
    return serialize(doc);
  } catch {
    return null;
  }
}

export async function getTemplateBySlug(slug) {
  const doc = await getCollection("templates").findOne({ slug });
  return serialize(doc);
}

/**
 * Tạo template: thông tin + HTML (+ thumbnail base64) trong CÙNG 1 request.
 * Backend upload HTML lên Supabase `templates/<uuid>.html`, ảnh lên
 * `thumbnails/<uuid>.<ext>`, MongoDB chỉ nhận URL. Lỗi DB sau khi upload
 * → xóa file vừa upload (rollback), không để file rác.
 */
export async function createTemplate(data) {
  const now = new Date().toISOString();
  // Chấp nhận cả tên trường cũ (htmlTemplate) để client cũ không vỡ.
  const html = String(data.htmlUrl ?? data.htmlTemplate ?? "");
  const thumb = String(data.thumbnail ?? "");
  storage.validateHtml(html); // kiểu + dung lượng HTML — chặn trước khi ghi DB

  const doc = {
    name: data.name || "Template mới",
    description: data.description || "",
    type: data.type || "play-to-learn",
    category: data.category || "quiz",
    ring: data.ring || "#1D2E4A",
    htmlUrl: "",
    thumbnail: "",
    fileName: "",
    version: 1,
    status: ["published", "draft", "inactive"].includes(data.status) ? data.status : "draft",
    playMode: ["solo", "classroom"].includes(data.playMode) ? data.playMode : "solo",
    createdAt: now,
    updatedAt: now,
  };
  const result = await getCollection("templates").insertOne(doc);
  const id = result.insertedId.toString();

  const uploaded = []; // { kind: "html"|"thumb", url } — danh sách để rollback
  try {
    const set = {};
    if (html.trim()) {
      const saved = await storage.storeHtmlTemplate(id, html);
      uploaded.push({ kind: "html", url: saved.url });
      set.htmlUrl = saved.url;
      set.fileName = saved.fileName;
      doc.htmlUrl = saved.url;
      doc.fileName = saved.fileName;
    }
    if (thumb.trim()) {
      const saved = await storage.storeThumbnail(thumb);
      if (!saved.kept) uploaded.push({ kind: "thumb", url: saved.url });
      set.thumbnail = saved.url;
      doc.thumbnail = saved.url;
    }
    if (Object.keys(set).length) {
      await getCollection("templates").updateOne({ _id: result.insertedId }, { $set: set });
    }
  } catch (e) {
    // Rollback: dọn file vừa upload + bản ghi vừa chèn
    for (const f of uploaded) {
      const del = f.kind === "thumb" ? storage.deleteThumbnailByUrl(f.url) : storage.deleteHtmlByUrl(f.url);
      await del.catch(() => {});
    }
    await getCollection("templates").deleteOne({ _id: result.insertedId }).catch(() => {});
    throw e;
  }

  return { _id: id, ...doc };
}

/**
 * Cập nhật template.
 * - Có HTML mới (khác link đang lưu) → upload file mới, đổi htmlUrl.
 * - Có thumbnail mới (data-URL base64) → upload ảnh mới, đổi thumbnail.
 * - Không gửi / gửi lại y nguyên link → giữ file cũ, không tạo file thừa.
 * - File cũ CHỈ bị xóa sau khi upload + MongoDB thành công, và chỉ khi
 *   không còn bản ghi nào khác dùng chung link.
 */
export async function updateTemplate(id, data) {
  const { _id, icon, htmlTemplate, ...rest } = data; // icon: loại hẳn khỏi $set
  rest.updatedAt = new Date().toISOString();
  if (rest.version !== undefined) rest.version = Number(rest.version);

  const coll = getCollection("templates");
  const oid = new ObjectId(id);
  const current = await coll.findOne({ _id: oid });
  if (!current) throw new Error("Không tìm thấy template");

  // Cho phép client cũ gửi `htmlTemplate` thay `htmlUrl`
  const hasHtml = Object.prototype.hasOwnProperty.call(data, "htmlUrl")
    || Object.prototype.hasOwnProperty.call(data, "htmlTemplate");
  const hasThumb = Object.prototype.hasOwnProperty.call(data, "thumbnail");
  const incomingHtml = rest.htmlUrl ?? htmlTemplate;
  const incomingThumb = data.thumbnail;

  let freshHtml = null; // { url } vừa upload — rollback nếu DB lỗi
  let freshThumb = null;
  let oldHtmlRef = "";
  let oldThumbRef = "";

  if (hasHtml) {
    delete rest.htmlUrl;
    oldHtmlRef = String(current.htmlUrl || "").trim();
    const v = String(incomingHtml ?? "").trim();
    if (v && v === oldHtmlRef) {
      // gửi lại đúng link → giữ nguyên file + URL, không upload lại
    } else if (!v) {
      rest.htmlUrl = "";
      rest.fileName = "";
    } else if (storage.isHtmlRef(v)) {
      rest.htmlUrl = v; // client gửi sẵn link/đường dẫn tĩnh → ghi trực tiếp
    } else {
      freshHtml = await storage.storeHtmlTemplate(id, v); // validate + upload Supabase
      rest.htmlUrl = freshHtml.url;
      rest.fileName = freshHtml.fileName;
    }
  }

  if (hasThumb) {
    oldThumbRef = String(current.thumbnail || "").trim();
    const v = String(incomingThumb ?? "").trim();
    if (v && v === oldThumbRef) {
      // không đổi ảnh → giữ link cũ
    } else if (!v) {
      rest.thumbnail = "";
    } else {
      freshThumb = await storage.storeThumbnail(v); // data-URL → Supabase thumbnails/
      rest.thumbnail = freshThumb.url;
      if (freshThumb.kept) freshThumb = null;        // link có sẵn → không có file mới để rollback/dọn
    }
  }

  let updated;
  try {
    updated = await coll.findOneAndUpdate({ _id: oid }, { $set: rest }, { returnDocument: "after" });
  } catch (e) {
    await rollbackFresh(freshHtml, freshThumb);
    throw e; // dữ liệu + file cũ vẫn nguyên vẹn
  }
  if (!updated) {
    await rollbackFresh(freshHtml, freshThumb);
    throw new Error("Không tìm thấy template");
  }

  // DB thành công → dọn file cũ (khi link thật sự đổi và không còn ai dùng chung)
  if (hasHtml && oldHtmlRef && oldHtmlRef !== String(updated.htmlUrl || "").trim()) {
    const stillUsed = await coll.countDocuments({ htmlUrl: oldHtmlRef, _id: { $ne: oid } });
    if (stillUsed === 0) await storage.deleteHtmlByUrl(oldHtmlRef).catch(() => {});
  }
  if (hasThumb && oldThumbRef && oldThumbRef !== String(updated.thumbnail || "").trim()) {
    const stillUsed = await coll.countDocuments({ thumbnail: oldThumbRef, _id: { $ne: oid } });
    if (stillUsed === 0) await storage.deleteThumbnailByUrl(oldThumbRef).catch(() => {});
  }
  return serialize(updated);
}

async function rollbackFresh(freshHtml, freshThumb) {
  if (freshHtml) await storage.deleteHtmlByUrl(freshHtml.url).catch(() => {});
  if (freshThumb) await storage.deleteThumbnailByUrl(freshThumb.url).catch(() => {});
}

export async function removeTemplate(id) {
  const oid = new ObjectId(id);
  const coll = getCollection("templates");
  const doc = await coll.findOne({ _id: oid });
  if (!doc) throw new Error("Không tìm thấy template");

  const gamesUsing = await getCollection("games").countDocuments({ templateId: oid });
  if (gamesUsing > 0) {
    // Game vẫn cần chơi → giữ nguyên file HTML + thumbnail, chỉ chuyển template sang inactive
    await coll.updateOne({ _id: oid }, { $set: { status: "inactive" } });
    return { deactivated: true, gamesCount: gamesUsing };
  }

  const result = await coll.deleteOne({ _id: oid });
  if (result.deletedCount === 0) throw new Error("Không tìm thấy template");

  // Xóa cả 2 file — nhưng bỏ qua nếu còn bản ghi khác dùng chung link (chống xóa nhầm)
  await deleteSharedFile(coll, "htmlUrl", doc.htmlUrl);
  await deleteSharedFile(coll, "thumbnail", doc.thumbnail);
  return { deleted: true };
}

async function deleteSharedFile(coll, field, ref) {
  const v = String(ref || "").trim();
  if (!v) return;
  if (field === "htmlUrl" && !storage.isHtmlRef(v)) return;              // link động mới là file của mình
  if (field === "thumbnail" && !/^https?:\/\//i.test(v)) return;
  const stillUsed = await coll.countDocuments({ [field]: v });
  if (stillUsed > 0) return;
  const del = field === "thumbnail" ? storage.deleteThumbnailByUrl(v) : storage.deleteHtmlByUrl(v);
  await del.catch(() => {});
}

// Xóa TẤT CẢ templates + file HTML + thumbnail tương ứng
export async function removeAllTemplates() {
  const coll = getCollection("templates");
  const docs = await coll.find({}).toArray();
  for (const d of docs) {
    const html = String(d.htmlUrl || d.htmlTemplate || "").trim();
    if (html && storage.isHtmlRef(html)) await storage.deleteHtmlByUrl(html).catch(() => {});
    const thumb = String(d.thumbnail || "").trim();
    if (thumb && /^https?:\/\//i.test(thumb)) await storage.deleteThumbnailByUrl(thumb).catch(() => {});
  }
  const count = docs.length;
  await coll.deleteMany({});
  return { deleted: count };
}

/**
 * Migration an toàn, idempotent — chạy lúc server khởi động (sau initDatabase)
 * và sau POST /api/seed. KHÔNG xóa dữ liệu cũ, KHÔNG đổi _id:
 *   1. `htmlTemplate` → `htmlUrl` (đổi tên trường trong Mongo).
 *   2. $unset `icon` (emoji đã bị loại bỏ khỏi schema).
 *   3. htmlUrl còn là HTML thô          → upload Supabase `templates/`, thay bằng link.
 *   4. htmlUrl còn trỏ file đĩa /uploads/html (migration đợt trước)
 *      mà file vẫn còn trên máy          → đọc lên, đẩy vào Supabase, thay link.
 * Bước upload lỗi → giữ nguyên giá trị cũ + log cảnh báo (không mất dữ liệu).
 */
export async function migrateTemplatesToSupabase() {
  const coll = getCollection("templates");
  const stats = { renamed: 0, iconRemoved: 0, uploaded: 0, fromDisk: 0, missing: 0, failed: 0 };

  const renamed = await coll.updateMany(
    { htmlTemplate: { $exists: true } },
    [{ $set: { htmlUrl: { $ifNull: ["$htmlUrl", "$htmlTemplate"] } } }, { $unset: "htmlTemplate" }]
  );
  stats.renamed = renamed.modifiedCount;

  const iconCleared = await coll.updateMany({ icon: { $exists: true } }, { $unset: { icon: "" } });
  stats.iconRemoved = iconCleared.modifiedCount;

  const docs = await coll.find({}).toArray();
  for (const d of docs) {
    const v = String(d.htmlUrl || "").trim();
    if (!v) continue;
    try {
      if (!storage.isHtmlRef(v)) {
        // HTML thô còn sót → upload Supabase
        const saved = await storage.storeHtmlTemplate(d._id.toString(), v);
        await coll.updateOne({ _id: d._id }, { $set: { htmlUrl: saved.url, fileName: saved.fileName } });
        stats.uploaded++;
      } else if (v.startsWith("/uploads/html/") || v.includes("/uploads/html/")) {
        // trỏ file đĩa của đợt migration trước → đẩy sang Supabase nếu file còn trên máy
        const fileName = v.split("/").pop();
        const filePath = path.resolve(process.cwd(), "uploads/html", fileName);
        let html;
        try {
          html = await fs.readFile(filePath, "utf-8");
        } catch {
          stats.missing++; // bản fallback trên đĩa nhưng file đã mất (Render ephemeral) — không còn nguồn để upload
          continue;
        }
        const saved = await storage.storeHtmlTemplate(d._id.toString(), html);
        await coll.updateOne({ _id: d._id }, { $set: { htmlUrl: saved.url, fileName: saved.fileName } });
        stats.fromDisk++;
        // Xóa bản fallback trên đĩa: máy dev chỉ upload MỘT lần, lần khởi động
        // sau không còn file để đọc → không tạo object trùng trên bucket.
        await fs.unlink(filePath).catch(() => {});
      }
    } catch (e) {
      stats.failed++;
      console.warn(`[migrate] template "${d.name}" (${d._id}): ${e.message} — giữ nguyên dữ liệu cũ, chưa mất gì`);
    }
  }
  if (stats.renamed || stats.iconRemoved || stats.uploaded || stats.fromDisk || stats.missing || stats.failed) {
    console.log(`[migrate] templates → Supabase: rename ${stats.renamed}, bỏ icon ${stats.iconRemoved}, ` +
      `upload ${stats.uploaded}, từ đĩa ${stats.fromDisk}, mất file ${stats.missing}, lỗi ${stats.failed}`);
  }
  return stats;
}

export async function listCategories() {
  const docs = await getCollection("categories").find({}).sort({ id: 1 }).toArray();
  return docs.map(({ _id, ...rest }) => rest);
}

export async function createCategory(data) {
  const coll = getCollection("categories");
  const id = data.id || `cat_${Date.now()}`;
  const label = data.label || "";
  const existing = await coll.findOne({ id });
  if (existing) throw new Error("Category ID đã tồn tại");
  await coll.insertOne({ id, label });
  return { id, label };
}

export async function updateCategory(id, data) {
  const coll = getCollection("categories");
  const result = await coll.findOneAndUpdate(
    { id },
    { $set: { label: data.label || "" } },
    { returnDocument: "after" }
  );
  if (!result) throw new Error("Không tìm thấy category");
  const { _id, ...rest } = result;
  return rest;
}

export async function removeCategory(id) {
  const result = await getCollection("categories").deleteOne({ id });
  if (result.deletedCount === 0) throw new Error("Không tìm thấy category");
  return { deleted: true };
}

export async function removeAllCategories() {
  const coll = getCollection("categories");
  const count = await coll.countDocuments();
  await coll.deleteMany({});
  return { deleted: count };
}

export async function listPlayers() {
  const docs = await getCollection("players").find({}).toArray();
  return docs.map(({ _id, ...rest }) => rest);
}

export async function listSubjects() {
  const docs = await getCollection("subjects").find({}).sort({ name: 1 }).toArray();
  return docs.map(d => ({ _id: d._id.toString(), name: d.name }));
}

export async function addSubject(name) {
  const coll = getCollection("subjects");
  const existing = await coll.findOne({ name });
  if (existing) throw new Error("Môn học đã tồn tại");
  await coll.insertOne({ name });
  return listSubjects();
}

export async function removeSubject(name) {
  const coll = getCollection("subjects");
  const result = await coll.deleteOne({ name });
  if (result.deletedCount === 0) throw new Error("Không tìm thấy môn học");
  return listSubjects();
}

export async function updateSubject(oldName, newName) {
  const coll = getCollection("subjects");
  const existing = await coll.findOne({ name: oldName });
  if (!existing) throw new Error("Không tìm thấy môn học");
  if (oldName !== newName) {
    const dup = await coll.findOne({ name: newName });
    if (dup) throw new Error("Môn học mới đã tồn tại");
  }
  await coll.updateOne({ _id: existing._id }, { $set: { name: newName } });
  return listSubjects();
}
