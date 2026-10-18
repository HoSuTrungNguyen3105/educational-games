import "./config.js";

const GLOBAL = typeof window !== "undefined" ? window : globalThis;

export const SCHEMA_VERSION = GLOBAL.EG_CONFIG_SCHEMA_VERSION || 2;

const DEFS = Array.isArray(GLOBAL.EG_GAMES) ? GLOBAL.EG_GAMES : [];

const clone = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));

export function listGameDefs() {
  return DEFS.map((def) => ({ ...def }));
}

export function getGameDef(key) {
  if (!key) return null;
  return DEFS.find((def) => def.key === key) || null;
}

function defaultsOfList(list) {
  if (list.kind === "grouped") {
    const out = {};
    (list.groups || []).forEach((g) => { out[g.key] = clone(list.rows?.[g.key] || []); });
    return out;
  }
  if (list.kind === "entities") return clone(list.rows || {});
  return clone(list.rows || []);
}

export function defaultValuesFor(key) {
  const def = getGameDef(key);
  if (!def) return {};
  const out = {};
  (def.settings || []).forEach((s) => { out[s.key] = s.default; });
  (def.lists || []).forEach((l) => { out[l.key] = defaultsOfList(l); });
  return out;
}

export function cloneValues(values) {
  return clone(values) || {};
}

const isHexColor = (v) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(v).trim());

function clampNumber(value, def, fallback) {
  const n = typeof value === "number" ? value : parseFloat(value);
  if (!Number.isFinite(n)) return fallback;
  let v = n;
  if (typeof def.min === "number") v = Math.max(def.min, v);
  if (typeof def.max === "number") v = Math.min(def.max, v);
  return v;
}

function normalizeItem(item, list) {
  if (list.itemType === "string") {
    return typeof item === "string" ? item.trim() : String(item ?? "").trim();
  }
  const out = {};
  (list.fields || []).forEach((f) => {
    const src = item && typeof item === "object" ? item : {};
    const raw = src[f.key] === undefined ? f.default : src[f.key];
    let v;
    if (f.type === "color") {
      v = isHexColor(raw) ? String(raw).trim() : "";
    } else if (f.type === "number") {
      const n = typeof raw === "number" ? raw : parseFloat(raw);
      v = Number.isFinite(n) ? n : "";
    } else if (f.type === "toggle") {
      v = raw === true || raw === "true" || raw === 1;
    } else if (f.type === "select") {
      const allowed = (f.options || []).map((o) => o.value);
      v = allowed.includes(raw) ? raw : (allowed[0] ?? "");
    } else {
      v = String(raw ?? "").trim();
    }
    // Trường tuỳ chọn không nhập gì thì không ghi vào JSON (giữ config gọn)
    if (f.optional === true && (v === "" || v === false)) return;
    out[f.key] = v;
  });
  return out;
}

function isBlankItem(item, list) {
  if (list.itemType === "string") return !String(item ?? "").trim();
  return (list.fields || []).every((f) => {
    const v = item?.[f.key];
    return v === undefined || v === null || String(v).trim() === "";
  });
}

function normalizeRows(rows, list) {
  const arr = Array.isArray(rows) ? rows : [];
  const out = arr
    .filter((item) => {
      if (item === null || item === undefined) return false;
      if (list.itemType === "string") return true;
      return typeof item === "object" && !Array.isArray(item);
    })
    .map((item) => normalizeItem(item, list));
  if (typeof list.max === "number" && out.length > list.max) return out.slice(0, list.max);
  return out;
}

function normalizeSetting(value, def) {
  if (def.type === "select") {
    const allowed = (def.options || []).map((o) => o.value);
    return allowed.includes(value) ? value : def.default;
  }
  if (def.type === "toggle") {
    return typeof value === "boolean" ? value : !!def.default;
  }
  if (def.type === "text") {
    const v = value == null ? "" : String(value);
    return v.trim() === "" ? def.default : v;
  }
  return clampNumber(value, def, def.default);
}

const ID_RE = /^[a-zA-Z0-9_-]{1,24}$/;

// Bảng dữ liệu theo id: { "worm": { hp, speed, ... } } — id là khoá, HTML tự gắn icon
function normalizeEntities(value, list) {
  const src = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const base = list.rows && typeof list.rows === "object" ? list.rows : {};
  const out = {};
  Object.keys(src).forEach((id) => {
    const key = String(id).trim();
    if (!ID_RE.test(key)) return;
    // Giữ các trường đã có sẵn của id đó, trường thiếu mới lấy từ dữ liệu mẫu
    out[key] = normalizeItem(Object.assign({}, base[key] || {}, src[key] || {}), list);
  });
  return out;
}

// Khối JSON tự do (màn chơi/timeline) — giữ nguyên cấu trúc, chỉ chuẩn hoá kiểu
function normalizeJson(value, list) {
  if (list.requiredType === "array") return Array.isArray(value) ? clone(value) : clone(list.rows);
  if (Array.isArray(value)) return clone(list.rows);
  if (value && typeof value === "object") return clone(value);
  return clone(list.rows);
}

export function normalizeValues(key, values) {
  const def = getGameDef(key);
  if (!def) return {};
  const src = values && typeof values === "object" ? values : {};
  const out = {};

  (def.settings || []).forEach((s) => {
    out[s.key] = src[s.key] === undefined || src[s.key] === null ? s.default : normalizeSetting(src[s.key], s);
  });

  (def.lists || []).forEach((list) => {
    if (list.kind === "grouped") {
      if (src[list.key] === undefined || src[list.key] === null) { out[list.key] = defaultsOfList(list); return; }
      const raw = typeof src[list.key] === "object" && !Array.isArray(src[list.key]) ? src[list.key] : {};
      const grouped = {};
      (list.groups || []).forEach((g) => {
        grouped[g.key] = raw[g.key] === undefined || raw[g.key] === null ? clone(list.rows?.[g.key] || []) : normalizeRows(raw[g.key], list);
      });
      out[list.key] = grouped;
      return;
    }
    if (list.kind === "entities") {
      out[list.key] = src[list.key] === undefined || src[list.key] === null ? defaultsOfList(list) : normalizeEntities(src[list.key], list);
      return;
    }
    if (list.kind === "json") {
      out[list.key] = src[list.key] === undefined || src[list.key] === null ? defaultsOfList(list) : normalizeJson(src[list.key], list);
      return;
    }
    if (list.kind === "enum") {
      const arr = Array.isArray(src[list.key]) ? src[list.key] : [];
      const allowed = (list.options || []).map((o) => o.value);
      const seen = new Set();
      const picked = [];
      arr.forEach((v) => {
        if (allowed.includes(v) && !seen.has(v)) { seen.add(v); picked.push(v); }
      });
      out[list.key] = picked;
      return;
    }
    out[list.key] = src[list.key] === undefined || src[list.key] === null ? defaultsOfList(list) : normalizeRows(src[list.key], list);
  });

  return out;
}

export function validateValues(key, values) {
  const def = getGameDef(key);
  if (!def) return [{ level: "error", path: "", message: `Không tìm thấy cấu hình của game "${key}"` }];
  const issues = [];
  const name = def.name || key;

  (def.settings || []).forEach((s) => {
    const v = values?.[s.key];
    if (typeof s.min === "number" && typeof v === "number" && v < s.min) {
      issues.push({ level: "error", path: s.key, message: `${name}: “${s.label}” phải ≥ ${s.min}` });
    }
    if (typeof s.max === "number" && typeof v === "number" && v > s.max) {
      issues.push({ level: "error", path: s.key, message: `${name}: “${s.label}” phải ≤ ${s.max}` });
    }
  });

  const checkList = (list, rows, label) => {
    const arr = Array.isArray(rows) ? rows : [];
    if (typeof list.min === "number" && arr.length < list.min) {
      issues.push({ level: "error", path: list.key, message: `${name}: ${label} cần ít nhất ${list.min} mục (đang có ${arr.length})` });
    }
    arr.forEach((item, i) => {
      if (isBlankItem(item, list)) {
        issues.push({ level: "warn", path: `${list.key}.${i}`, message: `${name}: ${label} — dòng ${i + 1} đang trống` });
        return;
      }
      if (list.itemType === "object") {
        (list.fields || []).forEach((f) => {
          const v = item?.[f.key];
          const empty = v === undefined || v === null || String(v).trim() === "";
          if (!empty) return;
          const isOptional = f.optional === true;
          issues.push({
            level: isOptional ? "warn" : "error",
            path: `${list.key}.${i}.${f.key}`,
            message: `${name}: ${label} — dòng ${i + 1} thiếu “${f.label || f.placeholder || f.key}”`,
          });
        });
      }
    });
  };

  (def.lists || []).forEach((list) => {
    if (list.kind === "grouped") {
      const grouped = values?.[list.key] || {};
      (list.groups || []).forEach((g) => {
        checkList({ ...list, min: g.min ?? list.min }, grouped[g.key], g.title || list.title);
      });
      return;
    }

    if (list.kind === "entities") {
      const table = values?.[list.key] || {};
      const ids = Object.keys(table);
      const label = list.title;
      if (typeof list.min === "number" && ids.length < list.min) {
        issues.push({ level: "error", path: list.key, message: `${name}: ${label} cần ít nhất ${list.min} mục (đang có ${ids.length})` });
      }
      ids.forEach((id) => {
        const item = table[id];
        (list.fields || []).forEach((f) => {
          const v = item?.[f.key];
          const empty = v === undefined || v === null || String(v).trim() === "";
          if (!empty) {
            if (f.min !== undefined && Number(v) < f.min) {
              issues.push({ level: "error", path: `${list.key}.${id}.${f.key}`, message: `${name}: ${label} — “${id}” có ${f.label || f.key} < ${f.min}` });
            }
            return;
          }
          if (f.optional === true) return;
          issues.push({
            level: "error",
            path: `${list.key}.${id}.${f.key}`,
            message: `${name}: ${label} — “${id}” thiếu “${f.label || f.key}”`,
          });
        });
      });
      return;
    }

    if (list.kind === "json") {
      const value = values?.[list.key];
      const isArray = Array.isArray(value);
      if (list.requiredType === "array" && !isArray) {
        issues.push({ level: "error", path: list.key, message: `${name}: ${list.title} phải là một danh sách (mảng JSON)` });
        return;
      }
      if (list.requiredType === "array" && isArray && list.min && value.length < list.min) {
        issues.push({ level: "error", path: list.key, message: `${name}: ${list.title} cần ít nhất ${list.min} mục (đang có ${value.length})` });
      }
      return;
    }

    checkList(list, values?.[list.key], list.title);
  });

  return issues;
}

export function hasBlockingIssue(issues) {
  return (issues || []).some((i) => i.level === "error");
}

function normalizeName(v) {
  return String(v)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

export function matchGameDef({ game, template, includeGameName = true } = {}) {
  const candidates = [];
  const push = (v) => {
    if (typeof v === "string" && v.trim()) candidates.push(normalizeName(v));
  };
  push(template?.name);
  push(template?.slug);
  if (includeGameName) {
    push(game?.templateName);
    push(game?.gameType);
    push(game?.name);
  }

  if (!candidates.length) return null;
  for (const def of DEFS) {
    for (const alias of def.templateNames || []) {
      if (candidates.includes(normalizeName(alias))) return def;
    }
  }
  for (const def of DEFS) {
    for (const alias of def.templateNames || []) {
      const a = normalizeName(alias);
      if (a && candidates.some((c) => c.includes(a) || a.includes(c))) return def;
    }
  }
  return null;
}

// Khi CHƠI game: chỉ dùng config khi game khai báo key, hoặc template của nó
// khớp đúng một game trong registry. Không đoán theo tên game để tránh gán nhầm
// config của game khác cho game cũ vốn đã chạy đúng.
export function resolveGameKey({ game, template } = {}) {
  const fromConfig = game?.config?.key;
  if (typeof fromConfig === "string" && getGameDef(fromConfig)) return fromConfig;
  const def = matchGameDef({ game, template, includeGameName: false });
  return def ? def.key : null;
}

// Khi giáo viên mở trang cấu hình: gợi ý thêm theo tên game (có người xác nhận).
export function suggestGameKey({ game, template } = {}) {
  return resolveGameKey({ game, template }) || matchGameDef({ game, template })?.key || null;
}

export function readGameConfig(config) {
  if (!config || typeof config !== "object") return { key: null, schemaVersion: SCHEMA_VERSION, values: {} };
  if (config.values && typeof config.values === "object") {
    return {
      key: typeof config.key === "string" ? config.key : null,
      schemaVersion: Number(config.schemaVersion) || SCHEMA_VERSION,
      values: config.values,
    };
  }
  return { key: typeof config.key === "string" ? config.key : null, schemaVersion: SCHEMA_VERSION, values: config };
}

export function buildConfigPayload(key, values) {
  return { key, schemaVersion: SCHEMA_VERSION, values: normalizeValues(key, values) };
}

export function buildWindowConfig(key, values, aliasKeys = []) {
  const normalized = normalizeValues(key, values);
  const payload = {};
  payload[key] = normalized;
  (aliasKeys || []).forEach((alias) => {
    if (alias && alias !== key) payload[alias] = normalized;
  });
  return payload;
}