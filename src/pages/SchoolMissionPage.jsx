import { useEffect, useMemo, useRef, useState } from "react";
import { navigate } from "../lib/router.js";
import { useUserAuthStore } from "../stores/userAuth.store.js";
import { authService, gameProgressService } from "../services/api.js";
import { renderDressUpSvg, resolveOutfit } from "../lib/dressUpAvatar.js";
import {
  flushSchoolMissionSave,
  queueSchoolMissionSave,
  startSchoolMissionSync,
} from "../lib/schoolMissionSync.js";
import schoolMissionHtml from "../games/school_mission/School_mission.html?raw";
import { SCHOOL_MISSION_CONFIG } from "../games/school_mission/config.js";

const GAME_ID = "school-mission";
const AVATAR_VIEWBOX = "0 0 512 700";

/** Thứ tự nạp script y hệt School_mission.html (file sau dùng biến file trước). */
const SCRIPT_ORDER = [
  "js/core.js",
  "data/questions.js",
  "data/schedule.js",
  "js/schedule.js",
  "js/state.js",
  "js/config.js",
  "js/data.js",
  "js/questions.js",
  "js/ui.js",
  "js/activities.js",
  "js/settings.js",
  "js/world.js",
  "js/input.js",
  "js/characters.js",
  "js/avatar.js",
  "js/sync.js",
  "js/scenes.js",
  "js/render.js",
  "js/main.js",
];

/**
 * SrcDoc không tải được `<script src="js/...">` tương đối (URL gốc là
 * about:srcdoc). Vì vậy nạp sẵn nội dung file bằng `?raw` rồi nhúng thẳng vào
 * HTML — game chạy được cả trong app lẫn khi build tĩnh.
 */
const SCHOOL_JS = import.meta.glob("../games/school_mission/**/*.js", {
  query: "?raw",
  import: "default",
  eager: true,
});
const SCHOOL_CSS = import.meta.glob("../games/school_mission/css/*.css", {
  query: "?raw",
  import: "default",
  eager: true,
});

function relativeSources(files, rootMarker) {
  const marker = `/${rootMarker}/`;
  return Object.fromEntries(
    Object.entries(files).map(([filePath, source]) => {
      const normalized = filePath.replace(/\\/g, "/");
      const at = normalized.lastIndexOf(marker);
      const rel = at >= 0 ? normalized.slice(at + marker.length) : normalized.split("/").pop();
      return [rel, typeof source === "string" ? source : source?.default || ""];
    })
  );
}

const JS_BY_REL = relativeSources(SCHOOL_JS, "school_mission");
const CSS_BY_REL = relativeSources(SCHOOL_CSS, "school_mission");

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** JSON an toàn để nhúng trong thẻ <script>. */
function safeJson(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function withTimeout(promise, ms) {
  let timer = null;
  return Promise.race([
    Promise.resolve(promise).finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("timeout")), ms);
    }),
  ]);
}

function avatarFromProfile(profile) {
  try {
    const outfit = resolveOutfit(profile?.avatar, profile?.pet);
    const svg = renderDressUpSvg("avatar", outfit.avatar.value);
    if (!svg) return { avatarSvg: "", avatarViewBox: AVATAR_VIEWBOX };
    const viewBox = svg.match(/viewBox="([^"]+)"/i)?.[1] || AVATAR_VIEWBOX;
    const inner = svg.replace(/^<svg[^>]*>/i, "").replace(/<\/svg>\s*$/i, "");
    return { avatarSvg: inner, avatarViewBox: viewBox };
  } catch {
    return { avatarSvg: "", avatarViewBox: AVATAR_VIEWBOX };
  }
}

/**
 * Game nhập vai trường học — tải School_mission.html, nhúng script/CSS, tiêm
 * config + avatar trong hồ sơ + tiến độ đã lưu trên API.
 *
 * Game gửi `{ type: "school-save", data }` mỗi khi state đổi. Trang này ghi
 * vào hàng đợi (localStorage) rồi gửi API; mất mạng thì giữ lại và tự gửi khi
 * có wifi trở lại.
 */
export default function SchoolMissionPage() {
  const iframeRef = useRef(null);
  const { user, token } = useUserAuthStore();
  const [boot, setBoot] = useState(null);

  const playerName = user?.name || user?.fullName || user?.username || "Bạn";

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const online = typeof navigator === "undefined" || navigator.onLine !== false;
      let profile = null;
      let savedState = null;

      if (token && online) {
        const [meResult, progressResult] = await Promise.allSettled([
          withTimeout(authService.me(), 2500),
          withTimeout(gameProgressService.getGame(GAME_ID), 2500),
        ]);
        if (meResult.status === "fulfilled") profile = meResult.value;
        if (progressResult.status === "fulfilled") {
          savedState = progressResult.value?.gameState || null;
        }
      }

      if (cancelled) return;
      setBoot({
        ...avatarFromProfile(profile),
        savedState,
        playerName,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [token, playerName]);

  useEffect(() => {
    if (!token) return undefined;
    return startSchoolMissionSync();
  }, [token]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const msg = event.data;
      if (!msg || typeof msg !== "object") return;

      if (msg.type === "quit") {
        navigate("/");
      } else if (msg.type === "school-save") {
        if (token) queueSchoolMissionSave(msg.data);
      } else if (msg.type === "school-ready") {
        if (token) flushSchoolMissionSave();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [token]);

  const html = useMemo(() => {
    if (!boot) return "";

    let out = schoolMissionHtml;
    const css = CSS_BY_REL["css/style.css"] || "";
    if (css) {
      out = out.replace(
        /<link[^>]*href=["']css\/style\.css["'][^>]*>/i,
        () => `<style>\n${css}\n</style>`
      );
    }

    const initTag = `<script>window.__SCHOOL_INIT__=${safeJson(boot)};</script>`;
    out = out.replace(
      /<script\s+src=["']js\/core\.js["']\s*><\/script>/i,
      (tag) => `${initTag}\n${tag}`
    );

    for (const rel of SCRIPT_ORDER) {
      const source = JS_BY_REL[rel];
      if (!source) continue;

      // Config của app phải nạp SAU data/schedule.js (file đó cũng gán
      // window.__SCHOOL_CONFIG__) nhưng TRƯỚC js/schedule.js.
      const configTag = rel === "js/schedule.js"
        ? `<script>window.__SCHOOL_CONFIG__=${safeJson(SCHOOL_MISSION_CONFIG)};</script>\n`
        : "";

      const pattern = new RegExp(
        `<script\\s+src=["']${escapeRegExp(rel)}["']\\s*><\\/script>`,
        "i"
      );
      out = out.replace(
        pattern,
        () => `${configTag}<script>\n${source}\n</script>`
      );
    }

    return out;
  }, [boot]);

  if (!html) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-[#7ccf6b]">
        <p className="rounded-full bg-white/90 px-5 py-2 text-sm font-extrabold text-slate-700 shadow">
          Đang tải Trường Vui Vẻ...
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#7ccf6b]">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-3 left-3 z-20 rounded-full bg-white/90 px-3 py-1.5 text-sm font-extrabold text-slate-700 shadow hover:bg-white"
        aria-label="Về trang chủ"
      >
        ← Trang chủ
      </button>
      <iframe
        ref={iframeRef}
        title="Trường Vui Vẻ"
        srcDoc={html}
        sandbox="allow-scripts allow-same-origin"
        className="h-full w-full border-0"
      />
    </div>
  );
}
