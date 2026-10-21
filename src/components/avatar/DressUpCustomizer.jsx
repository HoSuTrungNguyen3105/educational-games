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

import { useEffect, useMemo, useState } from "react";
import {
  getDressUp, sanitizeFor, renderDressUpSvg,
  itemLabel, outfitKey, ensureDressUpCss,
} from "../../lib/dressUpAvatar.js";
import { PrimaryButton, GhostButton } from "../ui";

const SCOPES = {
  avatar: {
    title: "Tùy chỉnh Avatar",
    defaultState: () => getDressUp().kid.defaults,
    sanitize: (v) => sanitizeFor("avatar", v),
    tabs: (st) => getDressUp().kidTabs(st),
    cfg: (k, st) => getDressUp().kidTabCfg(k, st),
  },
  pet: {
    title: "Tùy chỉnh Thú cưng",
    defaultState: () => getDressUp().pet.defaults,
    sanitize: (v) => sanitizeFor("pet", v),
    tabs: () => [{ k: "animal", l: "🐾 Loài" }, ...getDressUp().pet.tabs],
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
    setDraft(cfg.sanitize({ ...draft, [field]: id || null }));
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
      setMessage({ ok: true, text: "✔ Đã lưu vào hồ sơ" });
      setTimeout(onClose, 650);
    } catch {
      setSaving(false);
      setMessage({ ok: false, text: "⚠ Đã lưu trên máy, chưa lên được hồ sơ" });
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
          <button onClick={onClose} aria-label="Đóng" className="text-ink/40 hover:text-ink text-2xl leading-none px-1">✕</button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col md:flex-row">
          {/* sân khấu — SVG có viewBox nên tự giữ tỉ lệ và canh giữa khung */}
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
              <div className="grid grid-cols-4 min-[420px]:grid-cols-5 lg:grid-cols-6 gap-2">
                {activeCfg?.nullable && (
                  <button
                    onClick={() => pick(null)}
                    aria-pressed={!draft[field]}
                    className="aspect-square rounded-xl border-2 flex items-center justify-center text-xl transition"
                    style={{
                      background: "var(--stage)",
                      borderColor: !draft[field] ? "var(--accent)" : "var(--line)",
                    }}
                    title="Không dùng"
                  >
                    🚫
                  </button>
                )}
                {ids.map((id) => {
                  const selected = draft[field] === id;
                  return (
                    <button
                      key={String(id)}
                      onClick={() => pick(id)}
                      aria-pressed={selected}
                      title={itemLabel(kind, field, id)}
                      className="aspect-square rounded-xl border-2 flex items-center justify-center overflow-hidden transition"
                      style={{
                        background: "var(--stage)",
                        borderColor: selected ? "var(--accent)" : "var(--line)",
                        boxShadow: selected ? "0 0 0 2px var(--accent)" : "none",
                      }}
                    >
                      {activeCfg.kind === "dot" ? (
                        <span className="w-[58%] aspect-square rounded-full border border-black/10" style={{ background: activeCfg.dot(id) }} />
                      ) : (
                        <svg viewBox={activeCfg.vb} width="100%" height="100%">
                          <g dangerouslySetInnerHTML={{ __html: activeCfg.pv(id) }} />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
              {activeCfg?.kind !== "dot" && (
                <p className="mt-3 text-center text-xs text-ink/50">
                  {field ? itemLabel(kind, field, draft[field]) : ""}
                </p>
              )}
            </div>

            {/* chân */}
            <div className="px-4 py-3 shrink-0 space-y-2" style={{ background: "var(--card)", borderTop: "1px solid var(--line)" }}>
              {message && (
                <p className={`text-center text-xs font-semibold ${message.ok ? "text-green-600" : "text-red-500"}`}>{message.text}</p>
              )}
              <div className="flex gap-2">
                <GhostButton onClick={randomize} className="flex-1">🎲 Ngẫu nhiên</GhostButton>
                <GhostButton onClick={reset} className="flex-1">↺ Mặc lại</GhostButton>
              </div>
              <PrimaryButton onClick={save} disabled={saving} className="w-full justify-center">
                {saving ? "Đang lưu..." : "💾 Lưu vào hồ sơ"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}