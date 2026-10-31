import { useEffect, useMemo, useRef, useState } from "react";
import { navigate } from "../lib/router.js";
import { useUserAuthStore } from "../stores/userAuth.store.js";
import { gameProgressService, examResultService } from "../services/api.js";
import {
  flushSchoolMissionSave,
  queueSchoolMissionSave,
  startSchoolMissionSync,
} from "../lib/schoolMissionSync.js";
import { grantSchoolCoinReward } from "../lib/schoolMissionRewards.js";
import { addCoins, readWallet } from "../lib/coinWallet.js";
import schoolMissionHtml from "../games/school_mission/School_mission.html?raw";
import { SCHOOL_MISSION_CONFIG } from "../games/school_mission/config.js";

const GAME_ID = "school-mission";

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
  "js/garden.js",
  "js/settings.js",
  "js/world.js",
  "js/input.js",
  "js/characters.js",
  "js/sync.js",
  "js/scenes.js",
  "js/world3d.js",
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

/**
 * Game nhập vai trường học — tải School_mission.html, nhúng script/CSS, tiêm
 * config + tên tài khoản + tiến độ đã lưu trên API.
 *
 * Nhân vật của bé là tạo hình của chính game (màu áo + mũ mua trong Cửa hàng),
 * không dùng avatar SVG trong hồ sơ nữa.
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
      let savedState = null;

      if (token && online) {
        try {
          const progress = await withTimeout(gameProgressService.getGame(GAME_ID), 2500);
          savedState = progress?.gameState || null;
        } catch {
          /* chưa đăng nhập tiến độ / mất mạng — chơi từ bản localStorage */
        }
      }

      if (cancelled) return;
      setBoot({ savedState, playerName });
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
      } else if (msg.type === "school-exam-result") {
        // Làm xong bài thi → lưu kết quả lên API (bỏ qua khi chưa đăng nhập/mất mạng)
        if (token && msg.data) {
          examResultService.create({ gameId: GAME_ID, ...msg.data }).catch(() => {});
        }
      } else if (msg.type === "school-coin") {
        // Xong nhiệm vụ / làm bài điểm cao → coin thật vào ví, có trần mỗi ngày.
        // Kết quả gửi lại để game báo đúng cho bé (chưa đăng nhập, hết lượt…).
        grantSchoolCoinReward(msg.data?.amount, msg.data?.reason).then((result) => {
          iframeRef.current?.contentWindow?.postMessage({ type: "school-coin-result", data: result }, "*");
        });
      } else if (msg.type === "gq:walletDelta") {
        // Thu hoạch cây / mua đồ trong game thay đổi ví coin -> đồng bộ lên API
        const delta = Number(msg.data?.amount) || 0;
        if (delta !== 0) {
          addCoins(delta);
        }
      } else if (msg.type === "gq:walletGet") {
        const w = readWallet();
        iframeRef.current?.contentWindow?.postMessage({ type: "gq:wallet", coins: w.coins }, "*");
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
