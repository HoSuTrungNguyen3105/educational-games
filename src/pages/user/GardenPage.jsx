import { useCallback, useEffect, useState } from "react";
import { Sprout, Droplets, Coins, RefreshCw, Trash2, Wheat, X } from "lucide-react";
import { gardenService, walletService } from "../../services/api.js";
import { Loader, PrimaryButton, ConfirmModal } from "../../components/ui";
import { useConfirm } from "../../hooks/useConfirm.js";

// Thời gian lớn của cây (ms) → chữ thân thiện cho bé: "5 phút", "1 giờ 30 phút".
function formatGrowth(ms) {
  const min = Math.round((Number(ms) || 0) / 60000);
  if (min < 1) return "dưới 1 phút";
  if (min < 60) return `${min} phút`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} giờ ${m} phút` : `${h} giờ`;
}

export default function GardenPage({ userAuth, onBack }) {
  const [garden, setGarden] = useState(null);
  const [plantTypes, setPlantTypes] = useState([]);
  const [coins, setCoins] = useState(0);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [plantingSlot, setPlantingSlot] = useState(null);
  const [toast, setToast] = useState(null);
  const { askConfirm, confirmProps } = useConfirm();

  const load = useCallback(async () => {
    try {
      const [g, typesRes, wallet] = await Promise.all([
        gardenService.get(),
        gardenService.getPlantTypes().catch(() => null),
        walletService.get().catch(() => null),
      ]);
      setGarden(g || { slots: [], inventory: {}, waterDrops: 0 });
      const list = typesRes?.types || (Array.isArray(typesRes) ? typesRes : []);
      setPlantTypes(list);
      if (wallet) setCoins(wallet.coins || 0);
      setError(null);
    } catch (e) {
      setError(e?.message || "Không tải được khu vườn");
      setGarden((prev) => prev ?? { slots: [], inventory: {}, waterDrops: 0 });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center anim-pop">
          <div className="mb-4 flex justify-center text-emerald-500"><Sprout className="w-14 h-14" /></div>
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để xem khu vườn của mình</p>
          <PrimaryButton onClick={onBack}>← Về trang chủ</PrimaryButton>
        </div>
      </div>
    );
  }

  const typeById = Object.fromEntries(plantTypes.map((t) => [t.id, t]));
  const slots = garden?.slots || [];
  const waterDrops = garden?.waterDrops ?? 0;
  const readyCount = slots.filter((s) => s.plant?.isReady).length;

  const runAction = async (fn, successMsg) => {
    if (busy) return;
    setBusy(true);
    setToast(null);
    try {
      const res = await fn();
      if (successMsg) {
        setToast({ type: "success", msg: typeof successMsg === "function" ? successMsg(res) : successMsg });
      }
      await load();
    } catch (e) {
      setToast({ type: "error", msg: e?.message || "Có lỗi xảy ra, thử lại sau nhé" });
    } finally {
      setBusy(false);
    }
  };

  const handlePlant = (type) =>
    runAction(
      () => gardenService.plant(plantingSlot, type.id),
      `Đã trồng ${type.name}!`,
    ).then(() => setPlantingSlot(null));

  const handleWater = (slot) =>
    runAction(() => gardenService.water(slot.index), "Đã tưới nước cho cây!");

  const handleHarvest = (slot) =>
    runAction(
      () => gardenService.harvest(slot.index),
      (res) => `Thu hoạch thành công! +${res?.coinReward ?? 0} xu`,
    );

  const handleRemove = (slot) => {
    const type = typeById[slot.plant?.plantType];
    askConfirm({
      title: "Nhổ bỏ cây",
      message: `Nhổ bỏ cây "${type?.name || "này"}" ở ô ${slot.index + 1}? Cây sẽ mất và không được hoàn xu.`,
      confirmLabel: "Nhổ bỏ",
      onConfirm: () => runAction(() => gardenService.remove(slot.index), "Đã nhổ bỏ cây."),
    });
  };

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10 w-full">
      <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink transition inline-flex items-center gap-1 mb-6">
        ← Về trang chủ
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl sm:text-3xl text-ink">
            <Sprout className="w-7 h-7 text-emerald-500" /> Khu vườn
          </h1>
          <p className="text-sm text-[#8A7C63] mt-1">Trồng cây, tưới nước và thu hoạch xu thưởng!</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-700 text-sm font-bold px-3 py-1.5 rounded-full">
            <Droplets className="w-4 h-4" /> {waterDrops} giọt nước
          </span>
          <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-bold px-3 py-1.5 rounded-full">
            <Coins className="w-4 h-4" /> {coins.toLocaleString()} xu
          </span>
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 bg-white border border-ink/10 text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-paper2 transition"
            title="Tải lại tiến độ cây"
          >
            <RefreshCw className="w-4 h-4" /> Làm mới
          </button>
        </div>
      </div>

      {toast && (
        <div
          className={`mb-4 px-4 py-3 rounded-2xl text-sm font-semibold text-center anim-pop ${
            toast.type === "success"
              ? "bg-teal/10 text-teal border border-teal/20"
              : "bg-ticket/10 text-ticket border border-ticket/20"
          }`}
          onClick={() => setToast(null)}
        >
          {toast.msg}
        </div>
      )}

      {error && (
        <div className="mb-4 px-4 py-3 rounded-2xl text-sm font-semibold text-center bg-ticket/10 text-ticket border border-ticket/20">
          {error}
        </div>
      )}

      {readyCount > 0 && (
        <p className="mb-4 text-sm font-semibold text-emerald-600">
          🌾 Có {readyCount} cây đã trưởng thành — bấm "Thu hoạch" để nhận xu nhé!
        </p>
      )}

      {/* Bảng chọn hạt giống khi bấm vào ô trống */}
      {plantingSlot !== null && (
        <div className="note-card p-4 sm:p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-base text-ink">Chọn hạt giống cho ô {plantingSlot + 1}</h3>
            <button onClick={() => setPlantingSlot(null)} className="text-slate-400 hover:text-ink" aria-label="Đóng">
              <X className="w-5 h-5" />
            </button>
          </div>
          {plantTypes.length === 0 ? (
            <p className="text-sm text-[#8A7C63]">Chưa có loại cây nào để trồng. Thầy cô thêm loại cây ở trang quản trị nhé!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {plantTypes.map((t) => {
                const afford = coins >= (t.seedPrice || 0);
                return (
                  <button
                    key={t.id}
                    disabled={busy || !afford}
                    onClick={() => handlePlant(t)}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-3xl" aria-hidden="true">{t.icon || "🌱"}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-bold text-ink truncate">{t.name}</span>
                      <span className="block text-xs text-[#8A7C63]">
                        Lớn trong {formatGrowth(t.growthTime)} · Thu hoạch +{t.harvestCoin ?? 0} xu
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600">
                      <Coins className="w-4 h-4" /> {t.seedPrice ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {plantTypes.length > 0 && (
            <p className="text-xs text-[#8A7C63] mt-3">Xu của bé: {coins.toLocaleString()} — hạt giống đắt hơn số xu hiện có sẽ bị mờ, chưa mua được.</p>
          )}
        </div>
      )}

      {/* Lưới ô đất */}
      {garden === null ? (
        <Loader label="Đang tải khu vườn..." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {slots.map((slot) => {
            if (!slot.plant) {
              return (
                <div
                  key={slot.index}
                  className="rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 p-4 flex flex-col items-center justify-center text-center min-h-[168px]"
                >
                  <Sprout className="w-8 h-8 text-emerald-300 mb-2" />
                  <p className="text-sm font-semibold text-[#8A7C63] mb-3">Ô đất trống {slot.index + 1}</p>
                  <button
                    onClick={() => setPlantingSlot(slot.index)}
                    disabled={busy}
                    className="rounded-full bg-emerald-500 text-white text-xs font-bold px-4 py-2 hover:bg-emerald-600 transition disabled:opacity-50"
                  >
                    Trồng cây
                  </button>
                </div>
              );
            }
            const type = typeById[slot.plant.plantType];
            const progress = Math.max(0, Math.min(100, slot.plant.progress ?? 0));
            return (
              <div key={slot.index} className="note-card p-4 flex flex-col min-h-[168px]">
                <div className="flex items-start justify-between">
                  <span className="text-4xl" aria-hidden="true">{type?.icon || "🌱"}</span>
                  {slot.plant.isReady ? (
                    <span className="text-[10px] font-extrabold uppercase bg-emerald-500 text-white px-2 py-0.5 rounded-full">Thu hoạch được!</span>
                  ) : (
                    <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Đang lớn</span>
                  )}
                </div>
                <p className="font-bold text-ink mt-2 truncate">{type?.name || slot.plant.plantType}</p>
                <div className="h-2.5 bg-ink/5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${slot.plant.isReady ? "bg-emerald-500" : "bg-gradient-to-r from-lime-400 to-emerald-400"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[11px] font-semibold text-[#8A7C63] mt-1">
                  {progress}% · Đã tưới {slot.plant.waterCount ?? 0} lần
                  {type ? ` · Thu hoạch +${type.harvestCoin ?? 0} xu` : ""}
                </p>
                <div className="flex items-center gap-1.5 mt-auto pt-3">
                  {slot.plant.isReady ? (
                    <button
                      onClick={() => handleHarvest(slot)}
                      disabled={busy}
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-full bg-emerald-500 text-white text-xs font-bold px-3 py-2 hover:bg-emerald-600 transition disabled:opacity-50"
                    >
                      <Wheat className="w-3.5 h-3.5" /> Thu hoạch
                    </button>
                  ) : (
                    <button
                      onClick={() => handleWater(slot)}
                      disabled={busy || waterDrops <= 0}
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-full bg-sky-500 text-white text-xs font-bold px-3 py-2 hover:bg-sky-600 transition disabled:opacity-50"
                      title={waterDrops <= 0 ? "Hết giọt nước — chờ hồi lại nhé" : "Tưới nước cho cây"}
                    >
                      <Droplets className="w-3.5 h-3.5" /> Tưới nước
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(slot)}
                    disabled={busy}
                    className="inline-flex items-center justify-center rounded-full bg-white border border-rose-200 text-rose-500 px-2.5 py-2 hover:bg-rose-50 transition disabled:opacity-50"
                    title="Nhổ bỏ cây"
                    aria-label={`Nhổ bỏ cây ở ô ${slot.index + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-xs text-[#8A7C63]">
          Cây lớn dần theo thời gian. Giọt nước tự hồi lại sau mỗi 5 phút (tối đa 50 giọt).
        </p>
      </div>

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
