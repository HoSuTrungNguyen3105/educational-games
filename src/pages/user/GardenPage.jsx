import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Sprout, Droplets, Scissors, Trash2, ShoppingBag, Coins, X, Timer, Sparkles } from 'lucide-react';
import { gardenService, API_BASE } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import { AvatarPreviewSmall } from '../../components/avatar/AvatarPreview.jsx';

const RARITY_COLORS = {
  common: 'bg-gray-100 text-gray-600',
  rare: 'bg-blue-100 text-blue-600',
  epic: 'bg-purple-100 text-purple-600',
  legendary: 'bg-amber-100 text-amber-600',
};

function formatTime(ms) {
  if (ms <= 0) return 'Sẵn sàng!';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function PlantSlot({ slot, index, onSelect, onPlant, onHarvest, onWater, onRemove, treeTypes }) {
  const tree = slot.tree;
  if (!tree) {
    return (
      <button
        onClick={() => onSelect(index)}
        className="aspect-square rounded-2xl border-2 border-dashed border-ink/15 bg-white/50 hover:bg-white hover:border-gold/40 transition-all duration-200 flex flex-col items-center justify-center gap-1 group"
      >
        <Sprout className="w-6 h-6 text-ink/20 group-hover:text-gold transition-colors" />
        <span className="text-[9px] font-mono text-ink/25 group-hover:text-ink/40">Trồng</span>
      </button>
    );
  }

  const type = treeTypes.find(t => t.id === tree.treeType);
  const progress = tree.progress || 0;
  const isReady = tree.isReady;

  return (
    <div className={`aspect-square rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-0.5 relative overflow-hidden
      ${isReady ? 'border-green-300 bg-green-50 shadow-md shadow-green-100' : 'border-ink/10 bg-white'}`}>
      {isReady && <div className="absolute inset-0 bg-green-400/5 animate-pulse" />}

      <span className="text-2xl relative z-10">{tree.stageIcon}</span>

      {!isReady && (
        <>
          <div className="w-10 h-1 bg-ink/10 rounded-full overflow-hidden mt-1">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[8px] font-mono text-ink/40">{progress}%</span>
        </>
      )}

      <div className="flex gap-1 mt-1 relative z-10">
        {!isReady && (
          <button
            onClick={(e) => { e.stopPropagation(); onWater(index); }}
            className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors"
            title="Tưới nước (+10%)"
          >
            <Droplets className="w-3 h-3" />
          </button>
        )}
        {isReady && (
          <button
            onClick={(e) => { e.stopPropagation(); onHarvest(index); }}
            className="p-1 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
            title="Thu hoạch"
          >
            <Scissors className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(index); }}
          className="p-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 transition-colors"
          title="Xóa cây"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function SeedShop({ treeTypes, userCoins, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden anim-pop shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold" />
            <h3 className="font-display text-lg text-ink">Cửa hàng hạt giống</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink/5 transition">
            <X className="w-5 h-5 text-ink/50" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-5 py-2 bg-gold/5 border-b border-gold/10 shrink-0">
          <Coins className="w-4 h-4 text-gold" />
          <span className="text-sm font-bold text-gold">{userCoins?.toLocaleString()} Coin</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {treeTypes.map(type => {
            const canBuy = (userCoins || 0) >= type.seedPrice;
            return (
              <button
                key={type.id}
                onClick={() => canBuy && onSelect(type.id)}
                disabled={!canBuy}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left
                  ${canBuy ? 'border-ink/10 bg-white hover:border-gold/40 hover:shadow-md cursor-pointer' : 'border-ink/5 bg-ink/[0.02] opacity-50 cursor-not-allowed'}`}
              >
                <span className="text-3xl">{type.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm text-ink">{type.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${RARITY_COLORS[type.rarity]}`}>
                      {type.rarity}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-ink/40">
                    <span className="flex items-center gap-1">
                      <Timer className="w-3 h-3" /> {formatTime(type.growthTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Coins className="w-3 h-3" /> +{type.harvestCoin}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-sm font-bold text-gold">
                    <Coins className="w-3.5 h-3.5" /> {type.seedPrice}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HarvestModal({ treeType, onConfirm, onClose }) {
  if (!treeType) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-xs text-center anim-pop shadow-2xl">
        <span className="text-5xl block mb-3">{treeType.icon}</span>
        <h3 className="font-display text-lg text-ink mb-1">Thu hoạch thành công!</h3>
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gold mb-4">
          <Coins className="w-6 h-6" /> +{treeType.harvestCoin}
        </div>
        <button onClick={onConfirm} className="w-full py-2.5 bg-gold text-white rounded-xl font-semibold hover:bg-gold/80 transition">
          Tuyệt vời!
        </button>
      </div>
    </div>
  );
}

export default function GardenPage({ userAuth, onBack }) {
  const [garden, setGarden] = useState(null);
  const [treeTypes, setTreeTypes] = useState([]);
  const [userCoins, setUserCoins] = useState(0);
  const [error, setError] = useState(null);
  const [showShop, setShowShop] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [harvestResult, setHarvestResult] = useState(null);
  const [watering, setWatering] = useState(null);
  const [tick, setTick] = useState(0);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [gardenRes, typesRes] = await Promise.all([
        gardenService.get(),
        gardenService.getTreeTypes(),
      ]);
      if (gardenRes?.status) setGarden(gardenRes.data);
      if (typesRes?.status) setTreeTypes(typesRes.data.types);

      const auth = JSON.parse(localStorage.getItem('edu_games_auth') || '{}');
      if (auth?.token) {
        const r = await fetch(`${API_BASE}/auth/me/coins`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        }).then(r => r.json());
        if (r?.status) setUserCoins(r.data.coins || 0);
      }
    } catch (e) {
      setError(e.message || 'Lỗi tải khu vườn');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const handleSlotSelect = (index) => {
    setSelectedSlot(index);
    setShowShop(true);
  };

  const handlePlant = async (treeType) => {
    if (selectedSlot === null) return;
    try {
      const res = await gardenService.plant(selectedSlot, treeType);
      if (res?.status) {
        setShowShop(false);
        setSelectedSlot(null);
        load();
      }
    } catch (e) {
      alert(e.message || 'Lỗi trồng cây');
    }
  };

  const handleHarvest = async (index) => {
    try {
      const res = await gardenService.harvest(index);
      if (res?.status) {
        const type = treeTypes.find(t => t.id === res.data.treeType);
        setHarvestResult(type);
        load();
      }
    } catch (e) {
      alert(e.message || 'Lỗi thu hoạch');
    }
  };

  const handleWater = async (index) => {
    if (watering) return;
    setWatering(index);
    try {
      await gardenService.water(index);
      load();
    } catch (e) {
      alert(e.message || 'Lỗi tưới nước');
    }
    setWatering(null);
  };

  const handleRemove = async (index) => {
    if (!confirm('Bạn muốn xóa cây này?')) return;
    try {
      await gardenService.remove(index);
      load();
    } catch (e) {
      alert(e.message || 'Lỗi xóa cây');
    }
  };

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-5xl block mb-3">🌱</span>
          <h2 className="font-display text-lg text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-ink/50 mb-4">Bạn cần đăng nhập để xem khu vườn</p>
          <button onClick={onBack} className="px-5 py-2 bg-gold text-white rounded-xl text-sm font-semibold">Về trang chủ</button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <button onClick={load} className="px-5 py-2 bg-gold text-white rounded-xl text-sm font-semibold">Thử lại</button>
        </div>
      </div>
    );
  }

  const slots = garden?.slots || [];

  return (
    <div className="flex-1 px-4 py-4 max-w-4xl mx-auto w-full space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-ink/50 hover:text-ink transition">
          <ArrowLeft className="w-4 h-4" /> Trang chủ
        </button>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-bold">
            <Coins className="w-4 h-4" /> {userCoins.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-20 rounded-xl overflow-hidden bg-gold/10 border-2 border-gold/20 shrink-0 flex items-center justify-center">
          {userAuth?.user?.avatar ? (
            <AvatarPreviewSmall avatar={userAuth.user.avatar} className="w-full h-full object-contain" />
          ) : (
            <span className="text-2xl">🧑‍🌾</span>
          )}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-lg text-ink">Khu vườn của tôi</h1>
          <p className="text-xs text-ink/40 mt-0.5">
            {slots.filter(s => s.tree).length}/{slots.length} ô đã trồng • 
            {slots.filter(s => s.tree?.isReady).length} cây sẵn sàng thu hoạch
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>

        {slots.length === 0 && !error ? (
          <div className="text-center py-10 text-ink/40 animate-pulse">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {slots.map((slot, i) => (
              <PlantSlot
                key={i}
                slot={slot}
                index={i}
                treeTypes={treeTypes}
                onSelect={handleSlotSelect}
                onPlant={handlePlant}
                onHarvest={handleHarvest}
                onWater={handleWater}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-ink/30 font-mono">
          <Sparkles className="w-3 h-3" />
          <span>Trả lời đúng câu hỏi để nhận nước tưới cây</span>
        </div>
      </div>

      {showShop && (
        <SeedShop
          treeTypes={treeTypes}
          userCoins={userCoins}
          onSelect={handlePlant}
          onClose={() => { setShowShop(false); setSelectedSlot(null); }}
        />
      )}

      {harvestResult && (
        <HarvestModal
          treeType={harvestResult}
          onConfirm={() => setHarvestResult(null)}
          onClose={() => setHarvestResult(null)}
        />
      )}
    </div>
  );
}
