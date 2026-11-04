// services/systemService.js
//
// Số liệu thật cho trang Cài đặt quản trị: tình trạng hệ thống, thống kê lưu trữ,
// và quét link HTML/thumbnail của template.
//
// Bảo mật: mọi hàm ở đây CHỈ trả về trạng thái + số đếm. Không URL kết nối có
// credential, không secret key, không danh sách biến môi trường. Secret của
// Supabase chỉ được dùng bên trong supabaseStorageService (phía server).

import { getDb, getCollection } from "../db.js";
import { config } from "../config.js";
import * as supabase from "./supabaseStorageService.js";
import { activeProvider, providerLabel } from "./templateStorageService.js";
import { isDiskHtmlRef } from "./htmlFileStorageService.js";
import { get as getConfigValue } from "./systemConfigService.js";
import { aiBackendHealth } from "./aiBackendService.js";

const PROBE_TIMEOUT_MS = 8_000;
/** Kết quả kiểm tra trạng thái giữ trong bao lâu để không dồn tải (ms). */
const STATUS_CACHE_MS = 10_000;
/** Hai lần quét liên tiếp phải cách nhau tối thiểu (chống spam nút "Quét toàn bộ"). */
export const SCAN_COOLDOWN_MS = 20_000;
const SCAN_CONCURRENCY = 6;
const SCAN_MAX = 500;

const now = () => new Date().toISOString();
const ms = (t) => Math.round(performance.now() - t);

/** fetch có timeout + tự huỷ, trả {ok, status, error}. */
async function probeUrl(url, timeoutMs = PROBE_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  const t = performance.now();
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: "follow" });
    // Đọc tối đa 1 KB để chắc chắn thân trả về thật (HEAD một số CDN không hỗ trợ).
    const chunk = res.body ? await res.body.getReader().read() : { done: true };
    const bytes = chunk?.value?.byteLength || 0;
    return { ok: res.ok, status: res.status, bytes, latencyMs: ms(t), error: res.ok ? null : `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, status: 0, bytes: 0, latencyMs: ms(t), error: e.name === "AbortError" ? "Hết thời gian chờ" : e.message };
  } finally {
    clearTimeout(timer);
  }
}

/** Chạy n tác vụ đồng thời trên một danh sách, giữ nguyên thứ tự kết quả. */
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return out;
}

// ── A. Tình trạng hệ thống ────────────────────────────────────────────────

let statusCache = null;
let statusCacheAt = 0;
let lastCheckedAt = null;

/**
 * Kiểm tra toàn bộ thành phần: API, MongoDB, Supabase Storage, khả năng tải HTML, Trợ lý AI.
 * @param {boolean} force  bỏ qua cache (nút "Kiểm tra ngay")
 */
export async function getSystemStatus({ force = false } = {}) {
  if (!force && statusCache && Date.now() - statusCacheAt < STATUS_CACHE_MS) return statusCache;

  const started = performance.now();

  // ── MongoDB ──
  let mongo = { state: "ok", label: "Đã kết nối", latencyMs: 0, dbName: config.dbName, collections: 0, error: null };
  try {
    const t = performance.now();
    await getDb().command({ ping: 1 });
    // nameOnly: chỉ lấy tên collection — không tải metadata của từng collection.
    const names = await getDb().listCollections({}, { nameOnly: true }).toArray();
    mongo = { ...mongo, latencyMs: ms(t), collections: names.length };
  } catch (e) {
    mongo = { ...mongo, state: "error", label: "Mất kết nối", error: e.message };
  }

  // ── Supabase Storage ──
  const configured = supabase.isSupabaseConfigured();
  let storage = {
    state: configured ? "ok" : "off",
    label: configured ? "Hoạt động" : "Chưa cấu hình",
    provider: activeProvider(),
    providerLabel: providerLabel(),
    bucket: config.supabase.bucket,
    host: configured ? String(config.supabase.url).replace(/^https?:\/\//, "") : "",
    latencyMs: 0,
    error: null,
  };
  if (configured) {
    const t = performance.now();
    try {
      const objs = await supabase.listObjects("templates", 1000);
      storage = { ...storage, latencyMs: ms(t), objects: objs.length };
    } catch (e) {
      storage = { ...storage, state: "error", label: "Lỗi kết nối", latencyMs: ms(t), error: e.message };
    }
  }

  // ── Tải thử một file HTML game thật ──
  let html = { state: "unknown", label: "Chưa kiểm tra", latencyMs: 0, error: null, checked: 0 };
  try {
    const sample = await getCollection("templates")
      .find({ htmlUrl: { $exists: true, $ne: "" } })
      .project({ _id: 0, name: 1, htmlUrl: 1 })
      .limit(3)
      .toArray();
    if (!sample.length) {
      html = { ...html, state: "warn", label: "Chưa có template nào có HTML", error: null };
    } else {
      const results = await Promise.all(sample.map((s) => probeUrl(s.htmlUrl)));
      const good = results.filter((r) => r.ok && r.bytes > 0);
      const slowest = Math.max(...results.map((r) => r.latencyMs));
      html = {
        state: good.length === results.length ? "ok" : good.length ? "warn" : "error",
        label: good.length === results.length ? "Tải được bình thường" : good.length ? "Một số file lỗi" : "Không tải được",
        latencyMs: slowest,
        checked: results.length,
        error: results.find((r) => !r.ok || !r.bytes)?.error || null,
      };
    }
  } catch (e) {
    html = { ...html, state: "error", label: "Không kiểm tra được", error: e.message };
  }

  const api = {
    state: mongo.state === "ok" ? "ok" : "warn",
    label: "Đang hoạt động",
    uptimeSec: Math.round(process.uptime()),
    nodeVersion: process.version,
    env: process.env.NODE_ENV || "development",
  };

  // ── Trợ lý AI ──
  // Chỉ hỏi AI Service qua aiBackendService (địa chỉ nội bộ, service token không lộ ra
  // frontend). KHÔNG gọi thẳng Ollama: trình duyệt và trang này không cần biết Ollama
  // chạy ở đâu. Quan trọng hơn: công tắc còn TẮT thì KHÔNG gọi sang AI Service kể cả
  // /health — trang trạng thái phải tuyệt đối không chạm tới model trên máy chưa sẵn sàng.
  let ai = {
    state: "off",
    label: "Đang cấu hình",
    enabled: false,
    checked: false,
    model: null,
    provider: null,
    detail: "AI chưa bật trong Cấu hình hệ thống — chưa kiểm tra máy chủ AI.",
    latencyMs: 0,
    error: null,
  };
  try {
    ai.enabled = (await getConfigValue("ai.enabled")) === true;
    if (!ai.enabled) {
      // Đường này không phát sinh request nào tới AI Service.
      ai = { ...ai, state: "off", label: "Đang cấu hình" };
    } else {
      const t = performance.now();
      const h = await aiBackendHealth();  // không ném lỗi, đã có timeout 2.5s
      const serviceReady = h?.status === true;
      ai = {
        enabled: true,
        checked: true,
        model: h?.model ?? null,
        provider: h?.provider ?? null,
        latencyMs: ms(t),
        state: serviceReady ? "ok" : h?.configured ? "error" : "warn",
        label: serviceReady
          ? "Sẵn sàng"
          : h?.configured
            ? "Không gọi được AI Service"
            : "Chưa cấu hình service token",
        detail: h?.detail || "",
        error: serviceReady ? null : h?.detail || "AI Service không phản hồi.",
      };
    }
  } catch (e) {
    // Probe không được phép làm hỏng cả trang trạng thái.
    ai = { ...ai, state: "error", label: "Không kiểm tra được", error: e.message };
  }

  lastCheckedAt = now();
  statusCache = {
    checkedAt: lastCheckedAt,
    totalMs: ms(started),
    services: { api, mongo, storage, html, ai },
  };
  statusCacheAt = Date.now();
  return statusCache;
}

export function lastStatusCheck() {
  return { checkedAt: lastCheckedAt, cacheMs: STATUS_CACHE_MS };
}

// ── B. Thống kê lưu trữ game ──────────────────────────────────────────────

/**
 * Đếm từ MongoDB thật + dung lượng thật từ Supabase (metadata.size của từng
 * object). Không có Supabase → `size` để null, frontend hiển thị "—" chứ không
 * đoán số.
 */
export async function getStorageStats() {
  const coll = getCollection("templates");
  const [total, withHtml, withThumb, games, users] = await Promise.all([
    coll.countDocuments(),
    coll.countDocuments({ htmlUrl: { $exists: true, $type: "string", $ne: "" } }),
    coll.countDocuments({ thumbnail: { $exists: true, $type: "string", $ne: "" } }),
    getCollection("games").countDocuments().catch(() => 0),
    getCollection("users").countDocuments().catch(() => 0),
  ]);

  // Phân loại link theo nơi lưu — chỉ nhìn tiền tố URL, không đụng tới credential.
  const rows = await coll.find({}, { projection: { htmlUrl: 1, thumbnail: 1 } }).toArray();
  let htmlSupabase = 0, htmlDisk = 0, htmlOther = 0;
  let thumbSupabase = 0, thumbOther = 0;
  for (const r of rows) {
    const h = String(r.htmlUrl || "");
    if (h) {
      if (supabase.pathFromPublicUrl(h) !== null) htmlSupabase++;
      else if (isDiskHtmlRef(h)) htmlDisk++;
      else htmlOther++;
    }
    const t = String(r.thumbnail || "");
    if (t) {
      if (supabase.pathFromPublicUrl(t) !== null) thumbSupabase++;
      else thumbOther++;
    }
  }

  const out = {
    checkedAt: now(),
    provider: activeProvider(),
    providerLabel: providerLabel(),
    bucket: config.supabase.bucket,
    connected: supabase.isSupabaseConfigured(),
    templates: {
      total,
      withHtml,
      missingHtml: Math.max(0, total - withHtml),
      withThumbnail: withThumb,
      missingThumbnail: Math.max(0, total - withThumb),
      htmlOn: { supabase: htmlSupabase, disk: htmlDisk, other: htmlOther },
      thumbnailOn: { supabase: thumbSupabase, other: thumbOther },
    },
    games,
    users,
    storage: { size: null, fileCount: null, source: null, folders: [], error: null },
  };

  if (supabase.isSupabaseConfigured()) {
    try {
      const folders = [];
      let totalBytes = 0, totalFiles = 0;
      for (const prefix of ["templates", "thumbnails"]) {
        const objs = await supabase.listObjects(prefix, 1000);
        const bytes = objs.reduce((a, o) => a + (Number(o.metadata?.size) || 0), 0);
        folders.push({ prefix, files: objs.length, bytes });
        totalBytes += bytes;
        totalFiles += objs.length;
      }
      out.storage = { size: totalBytes, fileCount: totalFiles, source: "supabase", folders, error: null };
    } catch (e) {
      out.storage.error = e.message;
    }
  } else {
    out.storage.error = "Chưa cấu hình Supabase Storage";
  }

  return out;
}

// ── C. Quét URL HTML / thumbnail ──────────────────────────────────────────

let scanRunning = false;
let lastScanAt = 0;
let lastScanResult = null;

/**
 * Kiểm link HTML + thumbnail của từng template. CHỈ ĐỌC — không xoá file, không
 * sửa DB. Kết quả trả về theo trang để không nổ payload khi số lượng lớn.
 *
 * @param {{page?:number, perPage?:number, force?:boolean}} q
 */
export async function scanTemplates({ page = 1, perPage = 50, force = false } = {}) {
  if (scanRunning) {
    const err = new Error("Đang có một lượt quét chạy, vui lòng chờ");
    err.code = "scan_running";
    throw err;
  }
  if (!force && lastScanResult && Date.now() - lastScanAt < SCAN_COOLDOWN_MS) {
    // Trong thời gian chờ: phát lại kết quả cũ, đánh dấu là từ bộ nhớ đệm.
    return { ...lastScanResult, cached: true, cooldownMs: SCAN_COOLDOWN_MS - (Date.now() - lastScanAt) };
  }

  scanRunning = true;
  try {
    const p = Math.max(1, Number(page) || 1);
    const size = Math.min(SCAN_MAX, Math.max(5, Number(perPage) || 50));
    const filter = { name: { $exists: true } };
    const coll = getCollection("templates");
    const total = await coll.countDocuments(filter);
    const docs = await coll
      .find(filter, { projection: { name: 1, htmlUrl: 1, thumbnail: 1, status: 1, type: 1 } })
      .sort({ name: 1 })
      .skip((p - 1) * size)
      .limit(size)
      .toArray();

    const items = await mapLimit(docs, SCAN_CONCURRENCY, async (d) => {
      const htmlUrl = String(d.htmlUrl || "").trim();
      const thumb = String(d.thumbnail || "").trim();
      const row = {
        id: String(d._id),
        name: d.name || "(không tên)",
        status: d.status || "",
        htmlUrl,
        thumbnail: thumb,
        html: { state: "ok", label: "OK", httpStatus: 0, bytes: 0, latencyMs: 0, reason: "" },
        thumb: { state: "none", label: "Không có ảnh", httpStatus: 0, latencyMs: 0, reason: "" },
      };

      if (!htmlUrl) {
        row.html = { ...row.html, state: "missing", label: "Thiếu HTML", reason: "htmlUrl rỗng trong MongoDB" };
      } else if (!/^https?:\/\//i.test(htmlUrl)) {
        // Link tương đối /uploads/… — chỉ hợp lệ khi server đang chạy file trên đĩa.
        row.html = { ...row.html, state: "relative", label: "Link tương đối", reason: `Cần ghép gốc API: ${htmlUrl}` };
      } else {
        const r = await probeUrl(htmlUrl);
        row.html = {
          state: r.ok && r.bytes > 0 ? "ok" : r.status === 404 ? "not_found" : r.status ? "http_error" : "unreachable",
          label: r.ok && r.bytes > 0 ? "OK" : r.status === 404 ? "Không tồn tại" : r.status ? `Lỗi HTTP ${r.status}` : "Không truy cập được",
          httpStatus: r.status,
          bytes: r.bytes,
          latencyMs: r.latencyMs,
          reason: r.error || "",
        };
      }

      if (!thumb) {
        row.thumb = { ...row.thumb, reason: "Chưa tải ảnh đại diện" };
      } else if (!/^https?:\/\//i.test(thumb)) {
        row.thumb = { ...row.thumb, state: "relative", label: "Link tương đối", reason: thumb };
      } else {
        const r = await probeUrl(thumb, 6_000);
        row.thumb = {
          state: r.ok && r.bytes > 0 ? "ok" : r.status === 404 ? "not_found" : r.status ? "http_error" : "unreachable",
          label: r.ok && r.bytes > 0 ? "OK" : r.status === 404 ? "Không tồn tại" : r.status ? `Lỗi HTTP ${r.status}` : "Không truy cập được",
          httpStatus: r.status,
          latencyMs: r.latencyMs,
          reason: r.error || "",
        };
      }

      return row;
    });

    const summary = items.reduce(
      (a, it) => {
        a[it.html.state] = (a[it.html.state] || 0) + 1;
        if (it.thumb.state !== "ok" && it.thumb.state !== "none") a.thumbBad = (a.thumbBad || 0) + 1;
        if (it.thumb.state === "none") a.noThumb = (a.noThumb || 0) + 1;
        return a;
      },
      { ok: 0, missing: 0, not_found: 0, http_error: 0, unreachable: 0, relative: 0 },
    );

    lastScanResult = {
      scannedAt: now(),
      cached: false,
      page: p,
      perPage: size,
      total,
      totalPages: Math.ceil(total / size) || 1,
      checked: items.length,
      summary,
      items,
    };
    lastScanAt = Date.now();
    return lastScanResult;
  } finally {
    scanRunning = false;
  }
}

export function lastScan() {
  return lastScanResult ? { ...lastScanResult, cached: true } : null;
}
