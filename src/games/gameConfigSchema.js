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
    const raw = item && typeof item === "object" ? item[f.key] : "";
    let v = raw == null ? "" : raw;
    if (f.type === "color") {
      v = isHexColor(v) ? String(v).trim() : "";
    } else if (f.type === "number") {
      const n = typeof v === "number" ? v : parseFloat(v);
      v = Number.isFinite(n) ? n : "";
    } else {
      v = String(v).trim();
    }
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
  if (def.type === "text") {
    const v = value == null ? "" : String(value);
    return v.trim() === "" ? def.default : v;
  }
  return clampNumber(value, def, def.default);
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

export function matchGameDef({ game, template } = {}) {
  const candidates = [];
  const push = (v) => {
    if (typeof v === "string" && v.trim()) candidates.push(normalizeName(v));
  };
  push(template?.name);
  push(template?.slug);
  push(game?.templateName);
  push(game?.gameType);
  push(game?.name);

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

export function resolveGameKey({ game, template } = {}) {
  const fromConfig = game?.config?.key;
  if (typeof fromConfig === "string" && getGameDef(fromConfig)) return fromConfig;
  const def = matchGameDef({ game, template });
  return def ? def.key : null;
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