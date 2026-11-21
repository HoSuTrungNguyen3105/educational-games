/**
 * CharacterStage.jsx — sân khấu nhân vật chibi giả lập 3D dùng chung.
 *
 * Props (theo đặc tả Rive/Spine):
 *   bodyId        — mã body trong catalog `characterBodies.js` (= mã body
 *                   trong bộ đồ đã lưu của học sinh).
 *   mood          — 'idle' | 'wave' | 'happy' | 'encourage'.
 *   turnX         — -1..1, độ xoay phối cảnh giả 3D trái/phải.
 *   celebrateKey  — đổi giá trị = nhân vật nhảy ăn mừng một nhịp.
 *   accessories   — phần còn lại của bộ đồ đang mặc (skin/face/hair/… —
 *                   mọi trường của outfit trừ `body`), để fallback vẽ
 *                   đúng nhân vật + phụ kiện như modal tuỳ chỉnh.
 *   className     — lớp CSS thêm cho khung ngoài (cha quyết định cỡ).
 *
 * HAI ĐƯỜNG RENDER:
 *   1. Rive — nếu file `.riv` của body tồn tại thật trong
 *      `public/animations/characters/` (dò bằng HEAD request, cache kết
 *      quả): nạp lười `CharacterRivePlayer` (@rive-app/react-canvas) và
 *      đồng bộ mood/turnX/triggerCelebrate vào `MainStateMachine`.
 *   2. Fallback (đường chạy thật hiện nay — repo chưa có file .riv nào):
 *      vẽ artwork SVG ghép lớp của hệ avatar (renderDressUpSvg — đúng
 *      cách modal tuỳ chỉnh đang vẽ, gồm phụ kiện đang mặc) bọc trong
 *      animation CSS giả lập 3D theo mood + bóng đổ co giãn. Nếu cả dữ
 *      liệu SVG cũng không vẽ được thì dùng `fallbackImg` của catalog.
 *
 * Fallback hiện ngay từ khung hình đầu (không chờ dò .riv) để mở trang
 * không bao giờ thấy khung trống; dò xong có .riv mới chuyển đường.
 */
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import {
  getCharacterBody,
  characterPublicUrl,
  DEFAULT_CHARACTER_BODY_ID,
} from "../../config/characterBodies.js";
import { renderDressUpSvg, ensureDressUpCss } from "../../lib/dressUpAvatar.js";
import "./character-stage.css";

const CharacterRivePlayer = lazy(() => import("./CharacterRivePlayer.jsx"));

const RIVE_PROBE_TIMEOUT_MS = 2500;
/* Cache kết quả dò .riv theo bodyId — nhiều sân khấu cùng body không dò lại. */
const riveProbeCache = new Map();

function probeRiveFile(url) {
  if (riveProbeCache.has(url)) return riveProbeCache.get(url);
  const promise = (async () => {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), RIVE_PROBE_TIMEOUT_MS);
      const res = await fetch(url, { method: "HEAD", signal: ctrl.signal });
      clearTimeout(timer);
      const type = res.headers.get("content-type") || "";
      // Máy chủ tĩnh trả 200 + text/html cho path không tồn tại (SPA
      // fallback) nên phải loại trừ cả trường hợp đó mới tính là có file.
      return res.ok && !type.includes("text/html");
    } catch {
      return false;
    }
  })();
  riveProbeCache.set(url, promise);
  return promise;
}

export default function CharacterStage({
  bodyId,
  mood = "idle",
  turnX = 0,
  celebrateKey = 0,
  accessories = {},
  className = "",
  label,
}) {
  const body = getCharacterBody(bodyId) || getCharacterBody(DEFAULT_CHARACTER_BODY_ID);

  /* ── Đường Rive: chỉ bật khi dò thấy file thật. Kết quả dò gắn với
   * đúng bodyId đã dò — đổi body thì tự rơi về fallback trong lúc dò
   * body mới, không cần reset state đồng bộ trong effect. ── */
  const [riveProbe, setRiveProbe] = useState({ id: null, ready: false });
  useEffect(() => {
    let cancelled = false;
    if (body?.riveFile) {
      probeRiveFile(characterPublicUrl(body.riveFile)).then((ok) => {
        if (!cancelled) setRiveProbe({ id: body.id, ready: !!ok });
      });
    }
    return () => { cancelled = true; };
  }, [body]);
  const riveReady = riveProbe.id === body.id && riveProbe.ready;

  /* ── Fallback: artwork ghép lớp theo bộ đồ đang mặc ── */
  const outfitState = useMemo(
    () => ({ ...(accessories || {}), body: body.id }),
    [accessories, body]
  );
  const svg = useMemo(() => {
    try {
      return renderDressUpSvg("avatar", outfitState);
    } catch {
      return "";
    }
  }, [outfitState]);
  useEffect(() => { ensureDressUpCss(); }, []);

  /* ── Ăn mừng một nhịp khi celebrateKey đổi (bỏ qua lần mount đầu) ── */
  const [celebrating, setCelebrating] = useState(false);
  const prevKey = useRef(celebrateKey);
  const celebTimer = useRef(null);
  useEffect(() => {
    if (prevKey.current === celebrateKey) return;
    prevKey.current = celebrateKey;
    setCelebrating(true);
    clearTimeout(celebTimer.current);
    celebTimer.current = setTimeout(() => setCelebrating(false), 1450);
    return () => clearTimeout(celebTimer.current);
  }, [celebrateKey]);

  const clampedTurn = Math.max(-1, Math.min(1, Number(turnX) || 0));

  const fallbackFigure = (
    <>
      <div className="cs__shadow" aria-hidden="true" />
      <div
        className="cs__turn"
        style={{ transform: `perspective(700px) rotateY(${clampedTurn * 16}deg)` }}
      >
        <div className="cs__anim">
          {svg ? (
            <div
              className="cs__fig eg-du"
              role="img"
              aria-label={label || body.name}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ) : (
            <div className="cs__fig" role="img" aria-label={label || body.name}>
              <img src={characterPublicUrl(body.fallbackImg)} alt={body.name} draggable={false} />
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div
      className={`character-stage cs--mood-${mood}${celebrating ? " cs--celebrating" : ""} ${className}`}
      data-body={body.id}
      data-mood={mood}
      data-rive={riveReady ? "on" : "off"}
    >
      {riveReady ? (
        <Suspense fallback={fallbackFigure}>
          <CharacterRivePlayer
            body={body}
            mood={mood}
            turnX={clampedTurn}
            celebrateKey={celebrateKey}
            onError={() => setRiveProbe({ id: body.id, ready: false })}
          />
        </Suspense>
      ) : (
        fallbackFigure
      )}
    </div>
  );
}
