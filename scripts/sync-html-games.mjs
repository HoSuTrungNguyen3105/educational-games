/**
 * sync-html-games.mjs — đẩy các file HTML game trong repo lên API (templates + games).
 *
 *   node scripts/sync-html-games.mjs
 *   node scripts/sync-html-games.mjs --api http://localhost:5000/api --user admin --pass admin123
 *   node scripts/sync-html-games.mjs --dry-run
 *
 * - Template đã tồn tại (khớp tên) → cập nhật htmlTemplate + metadata, tăng version.
 * - Template chưa có → tạo mới (status published).
 * - Game đã tồn tại (cùng template + cùng tên) → bỏ qua, không tạo trùng.
 * - Game mới → tạo kèm `config` mặc định lấy từ registry src/games/config.js.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { processGameHtml } from "../src/game-html/injectTaskBridge.js";
import { injectApiBridge } from "../src/lib/apiBridge.js";
import { SCHEMA_VERSION, defaultValuesFor } from "../src/games/gameConfigSchema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// ── Manifest: các game HTML trong src/games ──────────────────────
// gameMode: "quiz"   → dùng câu hỏi trong collection `questions` (mặc định)
//           "custom" → game tự sinh nội dung từ JSON `config`, KHÔNG dùng câu hỏi
const MANIFEST = [
  {
    file: "hocmachoi-bridge.html",
    name: "Học Mà Chơi",
    aliases: ["học mà chơi", "hoc ma choi", "hocmachoi", "hoc-ma-choi", "game1"],
    configKey: "hocmachoi",
    gameMode: "custom",
    description: "5 mini-game: Đua Toán, Lật Thẻ, Xếp Chữ, Đố Vui, Chọn Nhanh.",
    icon: "🎪",
    ring: "#F4B942",
    category: "adventure",
  },
  {
    file: "timed-games/Ballon.html",
    name: "Bóng Bay Vui",
    aliases: ["bóng bay vui", "ballon", "bongbay"],
    configKey: "bongbay",
    description: "Chạm bong bóng đúng: số, đếm, chữ cái, màu sắc.",
    icon: "🎈",
    ring: "#F4B942",
    category: "reflex",
  },
  {
    file: "timed-games/ChooseRight.html",
    name: "Bé Chọn Đúng",
    aliases: ["bé chọn đúng", "be chon dung", "chooseright", "bechon"],
    configKey: "bechon",
    description: "Game cực dễ cho bé nhỏ: con vật, trái cây, đếm, màu sắc.",
    icon: "🐻",
    ring: "#6C3BF5",
    category: "quiz",
  },
  {
    file: "timed-games/RushFox.html",
    name: "Word Rush",
    aliases: ["word rush", "wordrush", "rushfox"],
    configKey: "wordrush",
    description: "Chạy đua từ vựng tiếng Anh theo chủ đề.",
    icon: "🦊",
    ring: "#1B998B",
    category: "language",
  },
  {
    file: "timed-games/LuckyWheel.html",
    name: "happywheel",
    aliases: ["happywheel", "happy wheel", "lucky wheel", "vòng quay"],
    configKey: null,
    description: "Vòng quay may mắn — quay và làm theo lượt chơi.",
    icon: "🎡",
    ring: "#E4572E",
    category: "quiz",
  },
  {
    file: "timed-games/MemoryMatch.html",
    name: "memory",
    aliases: ["memory", "memory match", "ghi nhớ"],
    configKey: null,
    description: "Lật hình tìm cặp giống nhau, rèn trí nhớ.",
    icon: "🧠",
    ring: "#A855F7",
    category: "memory",
  },
  {
    file: "timed-games/NinjaDash.html",
    name: "ninja run",
    aliases: ["ninja run", "ninjadash", "ninja dash", "ninja"],
    configKey: null,
    description: "Nhảy né vật cản theo nhịp điệu.",
    icon: "🥷",
    ring: "#1D2E4A",
    category: "reflex",
  },
  {
    file: "timed-games/WhackAMole.html",
    name: "whack a mole",
    aliases: ["whack a mole", "whackamole", "đập chuột"],
    configKey: null,
    description: "Đập chuột nhanh và chính xác.",
    icon: "🔨",
    ring: "#22C55E",
    category: "reflex",
  },
  {
    file: "plantvsanimal.html",
    name: "Vườn Thủ Hộ",
    aliases: ["Vườn Thủ Hộ", "Vuon Thu Ho", "plantvsanimal", "plant and animal", "PlantVsAnimal"],
    configKey: "plantvsanimal",
    description: "Trồng cây, thu nắng, đuổi sâu bọ. Chỉnh quái, cây và các màn chơi.",
    icon: "🌻",
    ring: "#1B998B",
    category: "strategy",
  },
];

// ── Args ──────────────────────────────────────────────────────────
function argOf(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const API = (argOf("--api", process.env.SYNC_API_BASE || "https://educational-games-lp4z.onrender.com/api")).replace(/\/+$/, "");
const USER = argOf("--user", process.env.SYNC_API_USER || "admin");
const PASS = argOf("--pass", process.env.SYNC_API_PASS || "admin123");
const DRY = process.argv.includes("--dry-run");

const norm = (v) =>
  String(v ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]+/g, "")
    .trim();

async function call(method, url, body, token) {
  const res = await fetch(`${API}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* not json */ }
  if (!res.ok || (json && json.status === false)) {
    throw new Error(`${method} ${url} → ${res.status} ${json?.msg || text.slice(0, 120)}`);
  }
  return json?.data ?? json;
}

async function main() {
  console.log(`API  : ${API}`);
  console.log(`User : ${USER}${DRY ? "  (DRY-RUN — không ghi gì)" : ""}\n`);

  const auth = await call("POST", "/auth/login", { username: USER, password: PASS });
  const token = auth?.token;
  if (!token) throw new Error("Đăng nhập thất bại: không nhận được token");
  console.log("✓ Đăng nhập thành công\n");

  const templates = await call("GET", "/templates");
  const games = await call("GET", "/games");
  console.log(`Hiện có: ${templates.length} template, ${games.length} game\n`);

  const rows = [];

  for (const item of MANIFEST) {
    const htmlPath = path.join(root, "src", "games", item.file);
    let raw;
    try {
      raw = readFileSync(htmlPath, "utf8");
    } catch {
      console.error(`✕ ${item.name}: không đọc được ${item.file}`);
      continue;
    }
    // Inject bridge giống hệt trang quản lý template (task bridge + api bridge)
    const html = processGameHtml(injectApiBridge(raw));

    const keys = [item.name, ...(item.aliases || [])].map(norm).filter(Boolean);
    const existing = templates.find((t) => keys.includes(norm(t.name)));
    const payload = {
      name: item.name,
      description: item.description,
      type: "play-to-learn",
      category: item.category,
      icon: item.icon,
      ring: item.ring,
      playMode: "solo",
      status: existing?.status || "published",
      htmlTemplate: html,
    };

    let template;
    let tplAction;
    if (existing) {
      payload.version = Number(existing.version || 1) + 1;
      template = DRY ? { ...existing, ...payload } : await call("PUT", `/templates/${existing._id}`, payload, token);
      tplAction = `cập nhật (v${payload.version})`;
    } else {
      payload.version = 1;
      template = DRY ? { _id: "(new)", ...payload } : await call("POST", "/templates", payload, token);
      tplAction = "tạo mới";
    }

    // Game: bỏ qua nếu đã có game cùng template + cùng tên
    const sameName = games.find((g) => g.templateId === template._id && norm(g.name) === norm(item.name));
    const anyGameForTemplate = games.find((g) => g.templateId === template._id);
    const configPayload = item.configKey
      ? { key: item.configKey, schemaVersion: SCHEMA_VERSION, values: defaultValuesFor(item.configKey) }
      : null;
    let gameAction;
    if (sameName) {
      gameAction = "đã có game";
      if (configPayload && norm(sameName.config?.key) !== norm(item.configKey)) {
        if (!DRY) await call("PUT", `/games/${sameName._id}/config`, { config: configPayload }, token);
        gameAction += ` · gắn config "${item.configKey}"`;
      }
    } else if (anyGameForTemplate) {
      gameAction = `bỏ qua (template đã có game "${anyGameForTemplate.name}")`;
    } else {
      const gamePayload = {
        name: item.name,
        description: item.description,
        subject: "",
        topic: "",
        language: "vi",
        templateId: template._id,
        type: "play-to-learn",
        status: "published",
        playMode: "solo",
        gameMode: item.gameMode || "quiz",
        questionsCount: 0,
        config: configPayload || {},
      };
      if (!DRY) await call("POST", "/games", gamePayload, token);
      gameAction = DRY ? "sẽ tạo game" : "tạo game";
    }

    rows.push({ game: item.name, template: tplAction, gameAction, htmlKB: (html.length / 1024).toFixed(1), mode: item.gameMode || "quiz", config: item.configKey || "—" });
  }

  console.table(rows);
  console.log(DRY ? "\nDRY-RUN: chưa ghi gì lên API." : "\nXong. Mở #/admin/game-config để chỉnh cấu hình từng game.");
  console.log('Game "custom" nhận JSON config, không dùng câu hỏi trong DB.');
}

main().catch((e) => {
  console.error("\n✕ Lỗi:", e.message);
  process.exit(1);
});