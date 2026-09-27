import { useState } from "react";
import { Star, LogOut, ChevronUp, ChevronDown, Gamepad2 } from "lucide-react";
import { PetSvg, PetBubble } from "../components/PetAvatar.jsx";
import { getLevelProgress } from "../lib/utils.js";

/**
 * GameHud — lớp giao diện nổi phủ lên game iframe,
 * cùng phong cách với trang chủ: thanh stats (coin / Lv / tim) + pet phản ứng.
 * Tự thu gọn được để không che gameplay.
 */
export default function GameHud({ coins = 0, hearts = 100, gameName = "Trò chơi", petMessage, onQuit }) {
  const [open, setOpen] = useState(true);
  const lv = getLevelProgress(coins);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-2.5 pt-2.5 flex items-start justify-between gap-2">
      {/* Bên trái: tên game + nút thoát */}
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          onClick={onQuit}
          className="flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full pl-2 pr-3 py-1.5 shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-600 hover:text-rose-500 transition active:scale-95"
          title="Thoát game"
        >
          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white flex items-center justify-center">
            <LogOut className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11px] font-extrabold max-w-[120px] truncate">Thoát</span>
        </button>
        <span className="hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full px-3 py-1.5 shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-600">
          <Gamepad2 className="w-4 h-4 text-sky-500" />
          <span className="text-[11px] font-extrabold max-w-[160px] truncate">{gameName}</span>
        </span>
      </div>

      {/* Bên phải: stats */}
      <div className="pointer-events-auto flex flex-col items-end gap-2">
        <div className={`flex items-center gap-1.5 transition-all ${open ? "" : "opacity-0 scale-95 pointer-events-none"}`}>
          <StatChip>
            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-sm">
              <Star className="w-3 h-3" fill="currentColor" />
            </span>
            <span className="font-extrabold text-slate-700 text-xs">{(coins || 0).toLocaleString()}</span>
          </StatChip>

          <StatChip wide>
            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 text-white flex items-center justify-center shadow-sm">
              <Star className="w-3 h-3" fill="currentColor" />
            </span>
            <span className="font-extrabold text-slate-700 text-xs whitespace-nowrap">Lv {lv.level}</span>
            <span className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <span className="block h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500" style={{ width: `${lv.percent ?? 0}%` }} />
            </span>
          </StatChip>

          <StatChip>
            <span className="text-xs leading-none">❤️</span>
            <span className="font-extrabold text-slate-700 text-xs">{hearts}</span>
          </StatChip>

          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-full bg-white/95 backdrop-blur shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-400 hover:text-slate-600 flex items-center justify-center"
            aria-label="Ẩn thanh trạng thái"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="w-7 h-7 rounded-full bg-white/95 backdrop-blur shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-400 hover:text-slate-600 flex items-center justify-center"
            aria-label="Hiện thanh trạng thái"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}

        {/* Pet phản ứng */}
        <div className="pointer-events-auto flex items-end gap-2">
          <PetBubble message={petMessage} compact className="mb-6" />
          <div className="w-14 h-14 rounded-full bg-white shadow-[0_6px_16px_rgba(15,60,120,.16)] flex items-center justify-center ring-2 ring-amber-300 shrink-0">
            <PetSvg size={42} bounce />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatChip({ children, wide = false }) {
  return (
    <span className={`flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full px-2.5 py-1.5 shadow-[0_6px_16px_rgba(15,60,120,.16)] ${wide ? "" : ""}`}>
      {children}
    </span>
  );
}
