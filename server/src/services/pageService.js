// services/pageService.js
//
// Trang HTML tĩnh (vd trang chúc mừng sinh nhật) — bám ĐÚNG cơ chế của
// template game (setupService + templateStorageService):
//   • Nội dung HTML KHÔNG nằm trong Mongo: HTML được upload thành FILE lên
//     storage (Supabase → R2 → Firebase → đĩa server/uploads/html) qua
//     `templateStorageService.storeHtmlTemplate`, Mongo chỉ lưu `htmlUrl`
//     (link file) + `fileName` trong collection `pages`, một doc cho mỗi slug.
//   • Đọc công khai theo slug; ghi chỉ giáo viên/admin (route chặn) — giống
//     hệt phân quyền của /templates.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getCollection } from "../db.js";
import * as storage from "./templateStorageService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PAGES_COLLECTION = "pages";

/** Trang sinh nhật: slug cố định + file nguồn Nguyên đã upload ở public/. */
export const BIRTHDAY_PAGE = {
  slug: "chuc-mung-sinh-nhat",
  title: "Chúc mừng sinh nhật",
  sourceFile: "chucmungsinhnhat.html",
};

const PAGE_FIELDS = ["slug", "title", "htmlUrl", "fileName", "status", "createdAt", "updatedAt"];

function serialize(doc) {
  if (!doc) return null;
  const out = { _id: doc._id.toString() };
  for (const key of PAGE_FIELDS) out[key] = doc[key] ?? "";
  if (!out.status) out.status = "published";
  return out;
}

export async function getPageBySlug(slug) {
  const key = String(slug || "").trim();
  if (!key) return null;
  let doc = await getCollection(PAGES_COLLECTION).findOne({ slug: key });
  if (!doc && key === BIRTHDAY_PAGE.slug) {
    // Chưa có doc (server mới deploy / DB mới) → seed từ file public/ rồi đọc lại.
    await ensureBirthdayPage();
    doc = await getCollection(PAGES_COLLECTION).findOne({ slug: key });
  }
  return serialize(doc);
}

/**
 * Đọc nội dung file HTML nguồn của trang sinh nhật.
 * File nằm ở `public/` tại gốc repo (Nguyên upload lên GitHub), tính theo vị
 * trí module này: server/src/services → ../../../public/<file>.
 * Không thấy file → null (seed tạo doc rỗng, admin nạp nội dung qua PUT sau).
 */
async function readBirthdaySeedHtml() {
  const filePath = path.resolve(__dirname, "../../../public", BIRTHDAY_PAGE.sourceFile);
  try {
    const html = await fs.readFile(filePath, "utf-8");
    return html.trim() ? html : null;
  } catch {
    return null;
  }
}

let seedInFlight = null;

/**
 * Seed trang sinh nhật — idempotent, an toàn khi gọi nhiều lần/chồng nhau:
 * đã có doc thì giữ nguyên; chưa có thì tạo doc rồi upload HTML nguồn lên
 * storage (chỉ lưu htmlUrl vào Mongo, như createTemplate). Upload lỗi →
 * giữ doc với htmlUrl rỗng + log cảnh báo, không mất dữ liệu, PUT sau sửa được.
 */
export function ensureBirthdayPage() {
  if (!seedInFlight) {
    seedInFlight = seedBirthdayPage().finally(() => { seedInFlight = null; });
  }
  return seedInFlight;
}

async function seedBirthdayPage() {
  const coll = getCollection(PAGES_COLLECTION);
  const existing = await coll.findOne({ slug: BIRTHDAY_PAGE.slug });
  if (existing) return serialize(existing);

  const now = new Date().toISOString();
  const doc = {
    slug: BIRTHDAY_PAGE.slug,
    title: BIRTHDAY_PAGE.title,
    htmlUrl: "",
    fileName: "",
    status: "published",
    createdAt: now,
    updatedAt: now,
  };
  let insertedId;
  try {
    const result = await coll.insertOne(doc);
    insertedId = result.insertedId;
  } catch (e) {
    if (e.code === 11000) { // slug unique — tiến trình khác vừa seed xong
      return serialize(await coll.findOne({ slug: BIRTHDAY_PAGE.slug }));
    }
    throw e;
  }

  const html = await readBirthdaySeedHtml();
  if (!html) {
    console.warn(`[pages] Không tìm thấy public/${BIRTHDAY_PAGE.sourceFile} — tạo trang "${BIRTHDAY_PAGE.slug}" chưa có nội dung, nạp qua PUT /api/pages/${BIRTHDAY_PAGE.slug} sau.`);
    return serialize({ _id: insertedId, ...doc });
  }
  try {
    const saved = await storage.storeHtmlTemplate(insertedId.toString(), html);
    await coll.updateOne(
      { _id: insertedId },
      { $set: { htmlUrl: saved.url, fileName: saved.fileName, updatedAt: new Date().toISOString() } },
    );
    doc.htmlUrl = saved.url;
    doc.fileName = saved.fileName;
  } catch (e) {
    console.warn(`[pages] Seed trang sinh nhật: upload HTML lỗi (${e.message}) — giữ doc chưa có nội dung.`);
  }
  return serialize({ _id: insertedId, ...doc });
}

/**
 * Tạo mới (nếu slug chưa có) hoặc cập nhật một trang — phần xử lý HTML bám
 * đúng `updateTemplate` của setupService:
 *   • gửi lại đúng link đang lưu → giữ nguyên file, không upload lại
 *   • gửi link/đường dẫn sẵn (isHtmlRef) → ghi trực tiếp
 *   • gửi HTML thô → validate + upload file mới qua templateStorageService
 *   • gửi rỗng → xoá nội dung (htmlUrl = "")
 * File cũ chỉ bị xoá SAU khi DB cập nhật thành công và không còn trang nào
 * khác dùng chung link.
 */
export async function updatePage(slug, data = {}) {
  const key = String(slug || "").trim();
  if (!key) throw new Error("Thiếu slug của trang");
  const coll = getCollection(PAGES_COLLECTION);
  const now = new Date().toISOString();

  let current = await coll.findOne({ slug: key });
  if (!current) {
    const doc = {
      slug: key,
      title: String(data.title || key),
      htmlUrl: "",
      fileName: "",
      status: "published",
      createdAt: now,
      updatedAt: now,
    };
    try {
      const result = await coll.insertOne(doc);
      current = { _id: result.insertedId, ...doc };
    } catch (e) {
      if (e.code !== 11000) throw e;
      current = await coll.findOne({ slug: key }); // tiến trình khác vừa tạo
    }
  }

  const set = { updatedAt: new Date().toISOString() };
  if (data.title !== undefined) set.title = String(data.title || current.title || key);

  const hasHtml = Object.prototype.hasOwnProperty.call(data, "html")
    || Object.prototype.hasOwnProperty.call(data, "htmlUrl");
  const incoming = data.html ?? data.htmlUrl;
  let freshHtml = null;
  const oldHtmlRef = String(current.htmlUrl || "").trim();

  if (hasHtml) {
    const v = String(incoming ?? "").trim();
    if (v && v === oldHtmlRef) {
      // gửi lại đúng link → giữ nguyên
    } else if (!v) {
      set.htmlUrl = "";
      set.fileName = "";
    } else if (storage.isHtmlRef(v)) {
      set.htmlUrl = v;      // link/đường dẫn có sẵn → ghi trực tiếp
      set.fileName = "";    // không phải file do storage của mình sinh ra
    } else {
      freshHtml = await storage.storeHtmlTemplate(current._id.toString(), v);
      set.htmlUrl = freshHtml.url;
      set.fileName = freshHtml.fileName;
    }
  }

  let updated;
  try {
    updated = await coll.findOneAndUpdate({ _id: current._id }, { $set: set }, { returnDocument: "after" });
  } catch (e) {
    if (freshHtml) await storage.deleteHtmlByUrl(freshHtml.url).catch(() => {});
    throw e;
  }
  if (!updated) {
    if (freshHtml) await storage.deleteHtmlByUrl(freshHtml.url).catch(() => {});
    throw new Error("Không tìm thấy trang");
  }

  // DB xong → dọn file cũ nếu link thật sự đổi và không trang nào dùng chung.
  const newRef = String(updated.htmlUrl || "").trim();
  if (hasHtml && oldHtmlRef && oldHtmlRef !== newRef) {
    const stillUsed = await coll.countDocuments({ htmlUrl: oldHtmlRef, _id: { $ne: current._id } });
    if (stillUsed === 0) await storage.deleteHtmlByUrl(oldHtmlRef).catch(() => {});
  }
  return serialize(updated);
}
