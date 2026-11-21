/**
 * DressUpCustomizer.jsx — modal tùy chỉnh avatar + thú cưng ngay trong profile.
 *
 * Dùng chung data với 2 game "Tiệm thời trang cho Bé" / "Tiệm thay đồ thú cưng"
 * (EG_DRESSUP, nạp qua `src/lib/dressUpAvatar.js`) nên bộ đồ chọn ở đây và trong
 * game là một.
 *
 * Lưu: ghi localStorage (để mở app không cần mạng vẫn thấy đúng) rồi PUT
 * `/api/auth/me` với `{ avatar }` hoặc `{ pet }`.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getDressUp, sanitizeFor, renderDressUpSvg,
  itemLabel, outfitKey, ensureDressUpCss, kidDefaultOutfit,
} from "../../lib/dressUpAvatar.js";
import { PrimaryButton, GhostButton } from "../ui";
import { Ban, Check, Dices, Rotate3d, RotateCcw, Save, X } from "lucide-react";
import CharacterStage from "../character/CharacterStage.jsx";
import MovableSvgAvatar from "./MovableSvgAvatar.jsx";

const SCOPES = {
  avatar: {
    title: "Tùy chỉnh Avatar",
    defaultState: () => kidDefaultOutfit(),
    sanitize: (v) => sanitizeFor("avatar", v),
    tabs: (st) => getDressUp().kidTabs(st),
    cfg: (k, st) => getDressUp().kidTabCfg(k, st),
  },
  pet: {
    title: "Tùy chỉnh Thú cưng",
    defaultState: () => getDressUp().pet.defaults,
    sanitize: (v) => sanitizeFor("pet", v),
    tabs: () => [{ k: "animal", l: "Loài" }, ...getDressUp().pet.tabs],
    // `pet.opts[k]` là { map, ids, colors?, vb } → chuẩn hoá về cùng shape với
    // `kidTabCfg()` để phần render dùng chung một nhánh.
    cfg: (k) => {
      if (k === "animal") {
        const api = getDressUp();
        return {
          kind: "svg",
          ids: Object.keys(api.pet.animals),
          vb: "0 0 200 200",
          nullable: false,
          pv: (id) => api.pet.preview({ animal: id }),
        };
      }
      const o = getDressUp().pet.opts[k];
      return {
        kind: o.colors ? "dot" : "svg",
        ids: o.ids,
        vb: o.vb,
        nullable: true,
        dot: (id) => (id === "stripe" ? "linear-gradient(#5aa9e6 50%,#fff 50%)" : o.map[id]),
        pv: (id) => o.map[id] || "",
      };
    },
  },
};

/* Các lớp tạo nên "nhân vật": thân + da + mặt + tóc (hoặc loài thú cưng).
 * 🎲 Ngẫu nhiên không đụng tới — bé trai ra bé trai, bé gái ra bé gái, đã chọn
 * mèo thì vẫn là mèo — chỉ thay áo/váy/quần/giày/kính/mũ/phụ kiện. */
const IDENTITY_FIELDS = {
  avatar: ["body", "skin", "face", "hair", "hairColor"],
  pet: ["animal"],
};

const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function DressUpCustomizer({ kind = "avatar", initial, onClose, onSave }) {
  const cfg = SCOPES[kind];
  const [draft, setDraft] = useState(() => cfg.sanitize(initial) || cfg.defaultState());
  const [tab, setTab] = useState(() => {
    const list = cfg.tabs(cfg.sanitize(initial) || cfg.defaultState());
    return list[0]?.k;
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  /* ── Sân khấu nhân vật (chỉ avatar): mở modal thì vẫy chào rồi về
   * idle; chọn Thân mới thì nhảy ăn mừng một nhịp; xoay giả 3D bằng
   * nút xoay hoặc kéo ngang trên nhân vật (nhả ra là tự về chính diện). ── */
  const [stageMood, setStageMood] = useState("wave");
  const [turnX, setTurnX] = useState(0);
  const [celebrateKey, setCelebrateKey] = useState(0);
  /* Nhảy nhẹ mỗi lần chọn đồ / tung ngẫu nhiên / lưu xong — MovableSvgAvatar
   * nhận tín hiệu này (chỉ nhánh avatar). */
  const [jumpKey, setJumpKey] = useState(0);
  const dragRef = useRef(null);
  useEffect(() => {
    if (kind !== "avatar") return undefined;
    const t = setTimeout(() => setStageMood("idle"), 1900);
    return () => clearTimeout(t);
  }, [kind]);

  function stagePointerDown(e) {
    dragRef.current = { x: e.clientX, turn: turnX };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function stagePointerMove(e) {
    const d = dragRef.current;
    if (!d) return;
    const next = Math.max(-1, Math.min(1, d.turn + (e.clientX - d.x) / 130));
    setTurnX(next);
  }
  function stagePointerUp() {
    dragRef.current = null;
    setTurnX(0);
  }

  /* Modal vẽ SVG trực tiếp (không qua DressUpAvatar) → tự nạp CSS .eg-du svg. */
  useEffect(() => {
    ensureDressUpCss();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const tabs = useMemo(() => cfg.tabs(draft), [cfg, draft]);
  // Tab đang chọn có thể biến mất (đổi sang rồng, mặc váy…) → rơi về tab đầu.
  const activeTab = tabs.find((t) => t.k === tab) || tabs[0];
  const field = activeTab?.k;
  const activeCfg = field ? cfg.cfg(field, draft) : null;

  function pick(id) {
    if (!field) return;
    /* Chọn Thân = chọn trai/gái → kèm "diện" chuẩn của thân đó (tóc + áo quần),
     * giống nút preset bên admin; các lớp khác vẫn giữ đồ bé đang mặc. */
    if (kind === "avatar" && field === "body") {
      setDraft(getDressUp().applyBody(draft, id));
      setCelebrateKey((k) => k + 1);
      return;
    }
    setDraft(cfg.sanitize({ ...draft, [field]: id || null }));
    if (kind === "avatar") setJumpKey((k) => k + 1);
  }

  function randomize() {
    const keep = IDENTITY_FIELDS[kind];
    const next = { ...draft };
    for (const t of cfg.tabs(draft)) {
      if (keep.includes(t.k)) continue;
      const c = cfg.cfg(t.k, draft);
      next[t.k] = pickOne(c.nullable ? [null, ...c.ids] : c.ids);
    }
    setDraft(cfg.sanitize(next));
    if (kind === "avatar") setJumpKey((k) => k + 1);
  }

  function reset() {
    setDraft(cfg.sanitize(cfg.defaultState()));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      // 1) ghi cache máy trước → mở app khi offline vẫn thấy bộ đồ mới
      try {
        localStorage.setItem(
          outfitKey(kind),
          JSON.stringify({ v: 1, value: draft, updatedAt: new Date().toISOString() })
        );
      } catch { /* localStorage bị chặn */ }
      // 2) đẩy lên hồ sơ
      await onSave(kind, draft);
      setSaving(false);
      if (kind === "avatar") setJumpKey((k) => k + 1);
      setMessage({ ok: true, text: "Đã lưu vào hồ sơ" });
      setTimeout(onClose, 650);
    } catch {
      setSaving(false);
      setMessage({ ok: false, text: "Đã lưu trên máy, chưa lên được hồ sơ" });
    }
  }

  const ids = activeCfg?.ids || [];
  const svg = useMemo(() => renderDressUpSvg(kind, draft), [kind, draft]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "var(--stage)", paddingTop: "var(--sat)", paddingBottom: "var(--sab)" }}
    >
      <div
        className="w-full flex-1 min-h-0 flex flex-col overflow-hidden"
        style={{ border: "1px solid var(--line)" }}
      >
        {/* đầu */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ background: "var(--card)", borderBottom: "1px solid var(--line)" }}>
          <h3 className="font-display text-base font-bold text-ink">{cfg.title}</h3>
          <button onClick={onClose} aria-label="Đóng" className="text-ink/40 hover:text-ink px-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col md:flex-row">
          {/* sân khấu — avatar dùng CharacterStage (nhân vật giả 3D: vẫy
              chào khi mở, nhảy khi đổi Thân, xoay bằng nút/kéo ngang);
              thú cưng giữ cách vẽ SVG trực tiếp như cũ. */}
          {kind === "avatar" ? (
            <div
              className="relative shrink-0 h-[30vh] sm:h-[36vh] md:h-auto md:w-[44%] md:max-w-md p-3 md:p-5 md:border-r md:border-black/10 select-none"
              style={{ background: "var(--bg)", borderBottom: "1px solid var(--line)", touchAction: "pan-y" }}
              onPointerDown={stagePointerDown}
              onPointerMove={stagePointerMove}
              onPointerUp={stagePointerUp}
              onPointerCancel={stagePointerUp}
            >
              {/* MovableSvgAvatar (#SVG-2D): nhân vật đi lại/nhảy ngay
                  trên sân khấu này; CharacterStage vẫn giữ nguyên wave
                  khi mở, celebrate khi đổi Thân và xoay kéo/nút. Cụm nút
                  di chuyển nằm góc phải dưới, nút xoay #160 ở góc trái. */}
              <MovableSvgAvatar className="du-stage-movable h-full w-full" jumpSignal={jumpKey}>
                <CharacterStage
                  bodyId={draft.body}
                  accessories={draft}
                  mood={stageMood}
                  turnX={turnX}
                  celebrateKey={celebrateKey}
                  label={cfg.title}
                />
              </MovableSvgAvatar>
              <button
                type="button"
                onClick={() => setTurnX((t) => (t === 0 ? 0.85 : 0))}
                aria-label="Xoay nhân vật"
                aria-pressed={turnX !== 0}
                title="Xoay nhân vật (hoặc kéo ngang trên nhân vật)"
                className="absolute left-3 bottom-3 w-11 h-11 rounded-2xl grid place-items-center text-white shadow-lg transition active:scale-95"
                style={{ background: "rgba(29,43,82,0.85)" }}
              >
                <Rotate3d className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div
              className="shrink-0 h-[30vh] sm:h-[36vh] md:h-auto md:w-[44%] md:max-w-md flex items-center justify-center p-3 md:p-5 md:border-r md:border-black/10"
              style={{ background: "var(--bg)", borderBottom: "1px solid var(--line)" }}
            >
              <div
                className="eg-du w-full h-full"
                role="img"
                aria-label={cfg.title}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </div>
          )}

          <div className="flex-1 min-h-0 flex flex-col">
            {/* tab */}
            <div className="flex gap-1.5 px-3 py-2 overflow-x-auto shrink-0" style={{ background: "var(--card)", borderBottom: "1px solid var(--line)" }}>
              {tabs.map((t) => (
                <button
                  key={t.k}
                  onClick={() => setTab(t.k)}
                  className={`flex-none rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                    t.k === activeTab?.k ? "text-white" : "text-ink/60 hover:text-ink"
                  }`}
                  style={t.k === activeTab?.k ? { background: "var(--accent)" } : { background: "var(--bg)" }}
                >
                  {t.l}
                </button>
              ))}
            </div>

            {/* lựa chọn */}
            <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3" style={{ background: "var(--card)" }}>
              <div className="grid grid-cols-3 min-[420px]:grid-cols-4 lg:grid-cols-5 gap-2">
                {activeCfg?.nullable && (
                  <button
                    onClick={() => pick(null)}
                    aria-pressed={!draft[field]}
                    className="du-card"
                    style={{
                      background: "var(--stage)",
                      borderColor: !draft[field] ? "var(--accent)" : "var(--line)",
                      boxShadow: !draft[field] ? "0 0 0 2px var(--accent)" : "0 1px 2px rgba(30,20,10,.08)",
                    }}
                    title="Không dùng"
                  >
                    <span className="du-card__pv">
                      <Ban className="w-6 h-6 text-ink/35" />
                    </span>
                    <span className="du-card__name">Không dùng</span>
                    {!draft[field] && (
                      <span className="du-card__badge"><Check className="w-3 h-3" /></span>
                    )}
                  </button>
                )}
                {ids.map((id) => {
                  const selected = draft[field] === id;
                  const name = activeCfg.label ? activeCfg.label(id) : itemLabel(kind, field, id);
                  return (
                    <button
                      key={String(id)}
                      onClick={() => pick(id)}
                      aria-pressed={selected}
                      title={name}
                      className="du-card"
                      style={{
                        background: "var(--stage)",
                        borderColor: selected ? "var(--accent)" : "var(--line)",
                        boxShadow: selected ? "0 0 0 2px var(--accent)" : "0 1px 2px rgba(30,20,10,.08)",
                      }}
                    >
                      <span className="du-card__pv">
                        {activeCfg.kind === "dot" ? (
                          <span className="w-[52%] aspect-square rounded-full border border-black/10" style={{ background: activeCfg.dot(id) }} />
                        ) : (
                          <svg viewBox={activeCfg.vbFor ? activeCfg.vbFor(id) : activeCfg.vb} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                            <g dangerouslySetInnerHTML={{ __html: activeCfg.pv(id) }} />
                          </svg>
                        )}
                      </span>
                      <span className="du-card__name">{name}</span>
                      {selected && (
                        <span className="du-card__badge"><Check className="w-3 h-3" /></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* chân */}
            <div className="px-4 py-3 shrink-0 space-y-2" style={{ background: "var(--card)", borderTop: "1px solid var(--line)" }}>
              {message && (
                <p className={`text-center text-xs font-semibold ${message.ok ? "text-green-600" : "text-red-500"}`}>{message.text}</p>
              )}
              <div className="flex gap-2">
                <GhostButton onClick={randomize} className="flex-1 inline-flex items-center justify-center gap-1.5"><Dices className="w-4 h-4" /> Ngẫu nhiên</GhostButton>
                <GhostButton onClick={reset} className="flex-1 inline-flex items-center justify-center gap-1.5"><RotateCcw className="w-4 h-4" /> Mặc lại</GhostButton>
              </div>
              <PrimaryButton onClick={save} disabled={saving} className="w-full justify-center inline-flex items-center gap-1.5">
                {saving ? "Đang lưu..." : <><Save className="w-4 h-4" /> Lưu vào hồ sơ</>}
              </PrimaryButton>
              <style>{`
                .du-card {
                  position: relative;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 2px;
                  padding: 6px 4px 5px;
                  border: 2px solid var(--line);
                  border-radius: 16px;
                  cursor: pointer;
                  transition: transform 130ms ease, box-shadow 130ms ease, border-color 130ms ease;
                }
                .du-card:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(30,20,10,.14) !important; }
                .du-card__pv {
                  width: 100%;
                  aspect-ratio: 1 / 1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;
                  border-radius: 10px;
                  pointer-events: none;
                }
                .du-card__name {
                  font-size: 11px;
                  font-weight: 600;
                  line-height: 1.15;
                  text-align: center;
                  color: var(--ink, #333);
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  pointer-events: none;
                }
                .du-card__badge {
                  position: absolute;
                  top: -7px;
                  right: -7px;
                  width: 20px;
                  height: 20px;
                  border-radius: 999px;
                  display: grid;
                  place-items: center;
                  background: var(--accent);
                  color: #fff;
                  box-shadow: 0 2px 6px rgba(30,20,10,.25);
                  pointer-events: none;
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}