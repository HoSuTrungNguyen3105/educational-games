import { useState } from "react";
import { getLevelProgress } from "../../../lib/utils.js";
import { TYPE_LABELS, STATUS_LABELS, timeAgo } from "./utils.js";
import InfoRow from "./InfoRow.jsx";

export default function GameCard({ game }) {
  const [expanded, setExpanded] = useState(true);
  const lv = getLevelProgress(game.experience || 0);
  const progressPct = Math.min(100, game.progress || 0);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group"
      style={{ background: "var(--card)", border: "1px solid var(--line)" }}
    >
      {/* Color bar */}
      <div className="h-1.5 transition-all duration-300 group-hover:h-2" style={{ background: "linear-gradient(90deg, var(--accent), var(--purple, #8b5cf6))" }} />

      <div className="p-4 sm:p-5">
        {/* Top row: name + level */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base sm:text-lg text-ink truncate">{game.name}</h3>
            {game.description && (
              <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--muted)" }}>{game.description}</p>
            )}
          </div>
          <div className="shrink-0 text-center px-3 py-1.5 rounded-xl" style={{ background: "var(--bg)" }}>
            <div className="text-lg leading-none font-bold">{lv.level}</div>
            <div className="text-[9px] font-mono uppercase" style={{ color: "var(--muted)" }}>Lv</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {game.subject && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "var(--accent-bg, #dbeafe)", color: "var(--accent, #2563eb)" }}>
              📚 {game.subject}
            </span>
          )}
          {game.topic && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "#f0fdf4", color: "#16a34a" }}>
              🏷️ {game.topic}
            </span>
          )}
          {game.type && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "#fef3c7", color: "#d97706" }}>
              🎯 {TYPE_LABELS[game.type] || game.type}
            </span>
          )}
          {game.language && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "#f3e8ff", color: "#9333ea" }}>
              🌐 {game.language.toUpperCase()}
            </span>
          )}
        </div>

        {/* XP progress */}
        <div className="mb-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono" style={{ color: "var(--muted)" }}>Kinh nghiệm</span>
            <span className="text-[10px] font-mono font-semibold" style={{ color: "var(--accent)" }}>{lv.current}/{lv.next} XP</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: lv.percent + "%", background: "linear-gradient(90deg, var(--accent), var(--purple, #8b5cf6))" }}
            />
          </div>
        </div>

        {/* Completion progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono" style={{ color: "var(--muted)" }}>Tiến độ</span>
            <span className="text-[10px] font-mono font-semibold" style={{ color: progressPct >= 100 ? "#16a34a" : "var(--accent)" }}>{progressPct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: progressPct + "%",
                background: progressPct >= 100
                  ? "linear-gradient(90deg, #22c55e, #16a34a)"
                  : "linear-gradient(90deg, var(--accent), var(--purple, #8b5cf6))",
              }}
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <QuickStat value={game.gamesPlayed || 0} label="Lượt chơi" />
          <QuickStat value={game.experience || 0} label="XP" />
          <QuickStat value={game.questsCompleted || 0} label="Nhiệm vụ" />
        </div>

        {/* Expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-[11px] font-semibold py-1.5 rounded-xl transition-colors"
          style={{ color: "var(--accent)", background: expanded ? "var(--accent-bg, #dbeafe)" : "transparent" }}
        >
          {expanded ? "▲ Ẩn bớt" : "▼ Chi tiết game"}
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-3 space-y-2.5" style={{ borderTop: "1px solid var(--line)" }}>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <InfoRow label="Mã game" value={game.code} />
              <InfoRow label="Trạng thái" value={STATUS_LABELS[game.status] || game.status} />
              <InfoRow label="Số câu hỏi" value={game.questionsCount} />
              <InfoRow label="Người chơi" value={game.playersCount} />
              <InfoRow label="Lần chơi cuối" value={timeAgo(game.lastPlayedAt)} />
              <InfoRow label="Ngày tạo" value={game.createdAt ? new Date(game.createdAt).toLocaleDateString("vi-VN") : null} />
            </div>
            <InventorySection inventory={game.inventory} />
            <LoadoutSection loadout={game.loadout} />
          </div>
        )}
      </div>
    </div>
  );
}

function QuickStat({ value, label }) {
  return (
    <div className="text-center py-2 rounded-xl" style={{ background: "var(--bg)" }}>
      <div className="text-sm font-bold text-ink">{value}</div>
      <div className="text-[9px] font-mono" style={{ color: "var(--muted)" }}>{label}</div>
    </div>
  );
}

function InventorySection({ inventory }) {
  if (!inventory || inventory.length === 0) return null;
  return (
    <div>
      <div className="text-[10px] font-semibold mb-1" style={{ color: "var(--muted)" }}>Vật phẩm:</div>
      <div className="flex flex-wrap gap-1">
        {inventory.map((item, i) => (
          <span key={i} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: "var(--bg)", color: "var(--ink)" }}>
            {item.name || item.itemId} {item.quantity > 1 ? `x${item.quantity}` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

function LoadoutSection({ loadout }) {
  if (!loadout) return null;
  const hasEquipped = loadout.equippedWeapon || loadout.equippedOutfit || loadout.equippedHair;
  const hasPotions = loadout.potions && Object.values(loadout.potions).some(v => v > 0);
  const hasOwned = loadout.ownedWeapons?.length > 0 || loadout.ownedOutfits?.length > 0 || loadout.ownedHairs?.length > 0;

  if (!hasEquipped && !hasPotions && !hasOwned) return null;

  return (
    <div>
      <div className="text-[10px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>Trang bị hiện tại:</div>

      {hasEquipped && (
        <div className="grid grid-cols-2 gap-1.5 text-[11px] mb-2">
          {loadout.equippedWeapon && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: "var(--bg)" }}>
              <span>⚔️</span>
              <span className="font-semibold text-ink truncate">{loadout.equippedWeapon}</span>
            </div>
          )}
          {loadout.equippedOutfit && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: "var(--bg)" }}>
              <span>🧥</span>
              <span className="font-semibold text-ink truncate">{loadout.equippedOutfit}</span>
            </div>
          )}
          {loadout.equippedHair && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: "var(--bg)" }}>
              <span>💇</span>
              <span className="font-semibold text-ink truncate">{loadout.equippedHair}</span>
            </div>
          )}
        </div>
      )}

      {hasPotions && (
        <div className="mb-2">
          <div className="text-[9px] font-mono mb-1" style={{ color: "var(--muted)" }}>Thuốc:</div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(loadout.potions).map(([k, v]) => v > 0 && (
              <span key={k} className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "#fef3c7", color: "#92400e" }}>
                {k === "heal_small" ? "🧪 Nhỏ" : k === "heal_medium" ? "🧪 Vừa" : k === "heal_large" ? "🧪 Lớn" : k} ×{v}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasOwned && (
        <div>
          <div className="text-[9px] font-mono mb-1" style={{ color: "var(--muted)" }}>Đã sở hữu:</div>
          <div className="flex flex-wrap gap-1">
            {loadout.ownedWeapons?.map((id, i) => (
              <span key={`w${i}`} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: "#dbeafe", color: "#1e40af" }}>⚔️ {id}</span>
            ))}
            {loadout.ownedOutfits?.map((id, i) => (
              <span key={`o${i}`} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: "#fce7f3", color: "#9d174d" }}>🧥 {id}</span>
            ))}
            {loadout.ownedHairs?.map((id, i) => (
              <span key={`h${i}`} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: "#f3e8ff", color: "#6b21a8" }}>💇 {id}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
