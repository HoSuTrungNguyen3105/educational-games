import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowBigUp, Footprints } from "lucide-react";
import "../../styles/svgAvatarMotion.css";

/* =====================================================================
 * MovableSvgAvatar — wrapper dùng chung cho avatar SVG ghép lớp:
 * cho nhân vật ĐI LẠI trong khung chứa + NHẢY, đồ đang mặc không lệch
 * vì chuyển động chỉ áp lên nhóm khớp (.av-joint, svgAvatarMotion.css).
 *
 * - posX: vị trí ngang, kẹp trong biên an toàn ±bounds (mặc định theo
 *   bề rộng khung chứa trừ lề 24px mỗi bên, đo bằng ResizeObserver).
 * - facing: 1 / -1 — lật bằng scaleX trên lớp figure.
 * - Điều khiển: nút Trái/Phải/Nhảy/Tự đi dạo + phím ArrowLeft /
 *   ArrowRight / Space CHỈ khi wrapper đang được focus (tabIndex=0) —
 *   không cướp phím cuộn trang khi bé đang ở chỗ khác trên /profile.
 * - Bóng đổ dưới chân: dịch theo posX, thu nhỏ + mờ đi khi nhảy.
 * - jumpSignal: số tăng dần từ bên ngoài (chọn đồ mới / ngẫu nhiên /
 *   lưu thành công) → nhân vật nhảy chúc mừng một lần.
 * ===================================================================== */

const STEP = 26;
const WALK_MS = 560;
const JUMP_MS = 700;
const STROLL_MS = 620;

export default function MovableSvgAvatar({
  children,
  bounds,
  jumpSignal = 0,
  className = "",
  controlsLabel = "Điều khiển nhân vật",
}) {
  const rootRef = useRef(null);
  const [measuredLimit, setMeasuredLimit] = useState(90);
  const limit = bounds ?? measuredLimit;
  const [posX, setPosX] = useState(0);
  const [facing, setFacing] = useState(1);
  const [motion, setMotion] = useState("idle"); // idle | walk | jump
  const [strolling, setStrolling] = useState(false);
  const motionTimer = useRef(null);
  const strollDir = useRef(1);
  const posRef = useRef(0);
  const facingRef = useRef(1);
  const strollingRef = useRef(false);
  const lastJumpSignal = useRef(jumpSignal);

  /* Biên an toàn: đo khung chứa, chừa lề để nhân vật không tràn ra ngoài. */
  useEffect(() => {
    if (bounds != null) return undefined;
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const measure = () => {
      const w = el.clientWidth || 0;
      setMeasuredLimit(Math.max(30, Math.floor(w / 2 - 90)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [bounds]);

  const clamp = useCallback(
    (x) => Math.max(-limit, Math.min(limit, x)),
    [limit]
  );

  const flashMotion = useCallback((next, ms) => {
    setMotion(next);
    if (motionTimer.current) window.clearTimeout(motionTimer.current);
    /* Hết nhịp thì về trạng thái TRƯỚC đó: đang tự đi dạo thì về walk,
     * đứng yên thì về idle. */
    motionTimer.current = window.setTimeout(
      () => setMotion(strollingRef.current ? "walk" : "idle"),
      ms
    );
  }, []);

  const applyPos = useCallback(
    (x) => {
      const next = clamp(x);
      posRef.current = next;
      setPosX(next);
      return next;
    },
    [clamp]
  );

  const step = useCallback(
    (dir) => {
      setStrolling(false);
      if (facingRef.current !== dir) {
        facingRef.current = dir;
        setFacing(dir);
      }
      applyPos(posRef.current + dir * STEP);
      flashMotion("walk", WALK_MS);
    },
    [applyPos, flashMotion]
  );

  const jump = useCallback(() => {
    flashMotion("jump", JUMP_MS);
  }, [flashMotion]);

  /* Tín hiệu nhảy từ bên ngoài (chọn đồ / lưu) — bỏ qua lần mount đầu. */
  useEffect(() => {
    if (jumpSignal === lastJumpSignal.current) return;
    lastJumpSignal.current = jumpSignal;
    jump();
  }, [jumpSignal, jump]);

  /* Tự đi dạo: bước qua lại trong biên, tới biên thì quay đầu. */
  useEffect(() => {
    strollingRef.current = strolling;
    if (!strolling) return undefined;
    const id = window.setInterval(() => {
      let dir = strollDir.current;
      const next = posRef.current + dir * STEP;
      if (next > limit || next < -limit) {
        dir = -dir;
        strollDir.current = dir;
      }
      if (facingRef.current !== dir) {
        facingRef.current = dir;
        setFacing(dir);
      }
      applyPos(posRef.current + dir * STEP);
      setMotion("walk");
    }, STROLL_MS);
    return () => window.clearInterval(id);
  }, [strolling, limit, applyPos]);

  useEffect(
    () => () => {
      if (motionTimer.current) window.clearTimeout(motionTimer.current);
    },
    []
  );

  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      jump();
    }
  };

  const stopStageEvent = (event) => event.stopPropagation();

  return (
    <div
      ref={rootRef}
      className={`mav relative outline-none ${className}`}
      tabIndex={0}
      role="application"
      aria-label={`${controlsLabel}. Dùng phím mũi tên trái phải để đi, phím cách để nhảy.`}
      onKeyDown={onKeyDown}
      data-motion={motion}
      data-pos-x={posX}
      data-facing={facing}
    >
      <div
        className="mav__figure will-change-transform"
        style={{
          transform: `translateX(${posX}px) scaleX(${facing})`,
          transition: "transform 240ms ease",
        }}
      >
        <div className={`av-state-${motion}`}>{children}</div>
      </div>
      <div
        className="mav__shadow pointer-events-none"
        aria-hidden="true"
        style={{
          transform: `translateX(calc(-50% + ${posX}px)) scale(${
            motion === "jump" ? 0.58 : 1
          })`,
          opacity: motion === "jump" ? 0.45 : 1,
        }}
      />
      <div
        className="mav__controls"
        onPointerDown={stopStageEvent}
        onClick={stopStageEvent}
      >
        <button type="button" className="mav__btn" onClick={() => step(-1)} aria-label="Đi sang trái">
          <ArrowLeft size={15} />
          <span>Trái</span>
        </button>
        <button type="button" className="mav__btn" onClick={() => step(1)} aria-label="Đi sang phải">
          <ArrowRight size={15} />
          <span>Phải</span>
        </button>
        <button type="button" className="mav__btn" onClick={jump} aria-label="Nhảy lên">
          <ArrowBigUp size={15} />
          <span>Nhảy</span>
        </button>
        <button
          type="button"
          className={`mav__btn${strolling ? " mav__btn--on" : ""}`}
          onClick={() => setStrolling((v) => !v)}
          aria-pressed={strolling}
          aria-label="Tự đi dạo"
        >
          <Footprints size={15} />
          <span>{strolling ? "Dừng dạo" : "Tự đi dạo"}</span>
        </button>
      </div>
      <style>{`
        .mav__shadow {
          position: absolute;
          left: 50%;
          bottom: 34px;
          width: 46%;
          max-width: 190px;
          height: 16px;
          border-radius: 999px;
          background: radial-gradient(ellipse at center, rgba(30, 20, 10, 0.28), rgba(30, 20, 10, 0) 70%);
          transition: transform 240ms ease, opacity 200ms ease;
          z-index: 0;
        }
        /* Chuỗi chiều cao PHẢI liền mạch từ .mav xuống nhân vật:
         * CharacterStage (.character-stage) dùng height:100% và mọi con
         * của nó đều position:absolute — thiếu height ở .mav__figure /
         * lớp .av-state-* là sân khấu sập về 0px, nhân vật biến mất dù
         * nút điều khiển (absolute) vẫn hiện. Trang chủ không dính vì
         * .gq-hero__char có height cố định và CharacterStage là con trực
         * tiếp, không qua hai lớp bọc này. */
        .mav { height: 100%; }
        .mav__figure { position: relative; z-index: 1; height: 100%; }
        .mav__figure > div { height: 100%; }
        .mav__controls {
          position: absolute;
          right: 6px;
          bottom: 6px;
          z-index: 5;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 4px;
          max-width: 78%;
        }
        .mav__btn {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid rgba(60, 42, 20, 0.18);
          background: rgba(255, 255, 255, 0.88);
          color: #4a3826;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(60, 42, 20, 0.15);
          transition: transform 120ms ease, background 120ms ease;
        }
        .mav__btn:hover { transform: translateY(-1px); background: #ffffff; }
        .mav__btn--on { background: #ffe1ee; border-color: #f07ca8; color: #a1134f; }
        .mav:focus-visible { box-shadow: inset 0 0 0 2px rgba(240, 124, 168, 0.55); border-radius: 18px; }
      `}</style>
    </div>
  );
}
