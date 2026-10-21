import { useEffect, useMemo, useRef } from "react";
import { navigate } from "../lib/router.js";
import schoolMissionHtml from "../games/school_mission/School_mission.html?raw";
import { SCHOOL_MISSION_CONFIG } from "../games/school_mission/config.js";

/**
 * Game nhập vai trường học — tải School_mission.html và tiêm config
 * từ src/games/school_mission/config.js (thời khóa biểu, giờ học thực).
 */
export default function SchoolMissionPage() {
  const iframeRef = useRef(null);

  const html = useMemo(() => {
    const payload = `window.__SCHOOL_CONFIG__=${JSON.stringify(SCHOOL_MISSION_CONFIG)};`;
    if (schoolMissionHtml.includes("/*__SCHOOL_CONFIG__*/")) {
      return schoolMissionHtml.replace("/*__SCHOOL_CONFIG__*/", payload);
    }
    return schoolMissionHtml.replace("<script>\nconst cv=", `<script>\n${payload}\nconst cv=`);
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type === "quit") navigate("/");
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

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
