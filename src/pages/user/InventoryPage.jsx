import { useEffect, useState, useCallback } from "react";
import { Coins } from "lucide-react";
import { gardenService, coinService } from "../../services/api.js";
import { navigate } from "../../lib/router.js";
import { PrimaryButton, Loader } from "../../components/ui.jsx";

/* Metadata vật phẩm — đồng bộ với ITEM_CONFIG trong GardenPage */
const ITEM_CONFIG = {
  basic_fertilizer:   { name: "Phân bón thường",    desc: "Thúc cây +15%.", icon: "🌱" },
  premium_fertilizer: { name: "Phân bón cao cấp",   desc: "Thúc cây +40%.", icon: "🌟" },
  miracle_fertilizer: { name: "Phân bón thần kỳ",   desc: "Chín ngay.",     icon: "✨" },
  golden_can:         { name: "Bình tưới vàng",     desc: "Tưới +20%.",     icon: "🪙" },
  magic_lens:         { name: "Kính lúp phép thuật", desc: "Hiện timer.",   icon: "🔍" },
};

export default function InventoryPage({ userAuth, onBack }) {
  const [inventory, setInventory] = useState(null);
  const [coins, setCoins] = useState(0);
  const [usingId, setUsingId] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    try {
      const [invRes, coinData] = await Promise.all([
        gardenService.getInventory(),
        coinService.get(),
      ]);
      // API có thể trả { inventory: {...} } hoặc trực tiếp {...}
      const inv = invRes?.inventory || invRes || {};
      setInventory(inv);
      setCoins(coinData?.coins || 0);
    } catch {
      setInventory({});
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUse = async (itemId) => {
    if (usingId) return;
    setUsingId(itemId);
    setToast(null);
    try {
      const res = await gardenService.useItem(itemId);
      const inv = res?.inventory;
      if (inv) setInventory(inv);
      else setInventory((p) => ({ ...p, [itemId]: Math.max(0, (p[itemId] || 0) - 1) }));
      setToast({ type: "success", msg: `Đã dùng ${ITEM_CONFIG[itemId]?.name || itemId}!` });
    } catch (e) {
      setToast({ type: "error", msg: e?.message || "Không thể dùng vật phẩm" });
    } finally {
      setUsingId(null);
    }
  };

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center anim-pop">
          <div className="text-6xl mb-4">🎒</div>
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để xem kho đồ</p>
          <PrimaryButton onClick={onBack}>← Về trang chủ</PrimaryButton>
        </div>
      </div>
    );
  }

  const owned = Object.entries(ITEM_CONFIG).filter(([id]) => (inventory?.[id] || 0) > 0);

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10 max-w-4xl mx-auto w-full">
      <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink transition inline-flex items-center gap-1 mb-6">
        ← Về trang chủ
      </button>

      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink">🎒 Kho đồ</h1>
          <p className="text-sm text-[#8A7C63] mt-1">Vật phẩm bạn đang sở hữu — dùng trong Khu vườn</p>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-white border border-slate-100 rounded-full px-3 py-1.5 shadow-sm text-sm font-extrabold text-slate-600 shrink-0">
          <Coins className="w-4 h-4 text-amber-500" /> {coins.toLocaleString()}
        </div>
      </div>

      {toast && (
        <div className={`mb-4 text-sm font-bold px-4 py-2.5 rounded-2xl ${toast.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
          {toast.msg}
        </div>
      )}

      {inventory === null ? (
        <div className="flex justify-center py-10"><Loader label="Đang tải kho đồ..." /></div>
      ) : owned.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="font-display text-lg text-ink mb-2">Kho đồ trống</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Ghé Cửa hàng trong Khu vườn để mua vật phẩm nhé!</p>
          <PrimaryButton onClick={() => navigate("/garden")}>🌱 Tới Khu vườn</PrimaryButton>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {owned.map(([id, meta]) => {
            const qty = inventory[id] || 0;
            const busy = usingId === id;
            return (
              <div key={id} className="nb-card p-4 flex flex-col items-center text-center">
                <div className="text-4xl mb-2">{meta.icon}</div>
                <p className="font-bold text-ink text-sm">{meta.name}</p>
                <p className="text-[11px] text-[#8A7C63] mt-0.5 mb-2">{meta.desc}</p>
                <span className="text-[11px] font-extrabold text-slate-500 bg-slate-100 rounded-full px-2.5 py-0.5 mb-3">x{qty}</span>
                <button
                  onClick={() => handleUse(id)}
                  disabled={busy}
                  className="text-xs font-extrabold text-white bg-gradient-to-r from-emerald-400 to-green-600 rounded-full px-4 py-2 shadow hover:from-emerald-500 hover:to-green-700 transition active:scale-95 disabled:opacity-50"
                >
                  {busy ? "Đang dùng..." : "Dùng"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
