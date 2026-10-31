// ===== GARDEN: Vườn trường — đồng bộ toàn bộ logic từ GardenPage.jsx =====
// Bao gồm: Trồng cây, Tưới nước, Bón phân, Thu hoạch (cộng coin vào gq_coin_wallet_v1),
// Cửa hàng hạt giống, Kho đồ vật phẩm, và Giải toán nhận nước.

(function () {
  /* ============================================================
     CẤU HÌNH CÂY TRỒNG & VẬT PHẨM (Khớp 100% GardenPage.jsx)
  ============================================================ */
  const PLANT_CONFIG = {
    sunflower: {
      name: "Hoa hướng dương",
      kind: "bloom",
      stageCount: 3,
      growthTime: 5 * 60 * 1000, // 5 phút
      harvestCoin: 20,
      seedPrice: 5,
      rarity: "common",
      icon: "🌻",
      desc: "Hoa rực rỡ dưới nắng ấm",
      stages: ["🌱", "🌿", "🌻"]
    },
    apple: {
      name: "Cây táo",
      kind: "fruitTree",
      stageCount: 4,
      growthTime: 30 * 60 * 1000, // 30 phút
      harvestCoin: 50,
      seedPrice: 15,
      rarity: "common",
      icon: "🍎",
      desc: "Quả táo ngọt mọng nước",
      stages: ["🌱", "🌿", "🌳", "🍎"]
    },
    cherry: {
      name: "Cây anh đào",
      kind: "bloom",
      stageCount: 3,
      growthTime: 2 * 60 * 60 * 1000, // 2 giờ
      harvestCoin: 120,
      seedPrice: 40,
      rarity: "rare",
      icon: "🌸",
      desc: "Cánh hoa hồng phấn dịu dàng",
      stages: ["🌱", "🌿", "🌸"]
    },
    oak: {
      name: "Cây cổ thụ",
      kind: "fruitTree",
      stageCount: 3,
      growthTime: 12 * 60 * 60 * 1000, // 12 giờ
      harvestCoin: 500,
      seedPrice: 150,
      rarity: "epic",
      icon: "🌳",
      desc: "Cổ thụ che bóng mát sân trường",
      stages: ["🌱", "🌿", "🌳"]
    },
    magic: {
      name: "Cây thần kỳ",
      kind: "aura",
      stageCount: 4,
      growthTime: 24 * 60 * 60 * 1000, // 24 giờ
      harvestCoin: 1000,
      seedPrice: 400,
      rarity: "legendary",
      icon: "✨",
      desc: "Cây phép thuật phát sáng lung linh",
      stages: ["🌱", "🌿", "🔮", "✨"]
    }
  };

  const RARITY_BADGE = {
    common: { bg: "#EEF0EC", text: "#556050", label: "Thường" },
    rare: { bg: "#E4EEFA", text: "#2A6496", label: "Hiếm" },
    epic: { bg: "#F0E6FA", text: "#7A3DA8", label: "Sử thi" },
    legendary: { bg: "#FCEFD6", text: "#B87010", label: "Huyền thoại" }
  };

  const ITEM_CONFIG = {
    basic_fertilizer: { name: "Phân bón thường", type: "consumable", price: 20, boost: 15, desc: "Thúc cây lớn nhanh +15%", icon: "🌱" },
    premium_fertilizer: { name: "Phân bón cao cấp", type: "consumable", price: 55, boost: 40, desc: "Thúc cây lớn nhanh +40%", icon: "🌟" },
    miracle_fertilizer: { name: "Phân bón thần kỳ", type: "consumable", price: 150, boost: 100, desc: "Cây chín ngay lập tức!", icon: "✨" },
    golden_can: { name: "Bình tưới vàng", type: "upgrade", price: 300, boost: 20, desc: "Tưới nước tăng +20% vĩnh viễn", icon: "🪙" }
  };

  const MATH_QUESTIONS = [
    { q: "12 + 8 = ?", o: ["18", "20", "22", "19"], a: 1 },
    { q: "15 - 7 = ?", o: ["9", "8", "7", "6"], a: 1 },
    { q: "6 × 7 = ?", o: ["42", "48", "36", "44"], a: 0 },
    { q: "56 ÷ 8 = ?", o: ["6", "8", "7", "9"], a: 2 },
    { q: "25 + 37 = ?", o: ["60", "62", "58", "64"], a: 1 },
    { q: "81 ÷ 9 = ?", o: ["8", "9", "7", "10"], a: 1 },
    { q: "14 × 3 = ?", o: ["40", "42", "38", "44"], a: 1 },
    { q: "100 - 45 = ?", o: ["50", "55", "60", "45"], a: 1 },
    { q: "9 × 9 = ?", o: ["81", "72", "90", "89"], a: 0 },
    { q: "72 ÷ 6 = ?", o: ["11", "13", "12", "14"], a: 2 }
  ];

  const WATER_MAX = 50;
  const WATER_REGEN_MS = 5 * 60 * 1000;
  const TOTAL_SLOTS = 6;

  /* ============================================================
     LƯU TRỮ VÀ TÍNH TOÁN TIẾN ĐỘ THỜI GIAN THỰC
  ============================================================ */
  function loadGardenSlots() {
    try {
      const raw = localStorage.getItem("school_garden_slots_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === TOTAL_SLOTS) return parsed;
      }
    } catch (e) {}
    const init = [];
    for (let i = 0; i < TOTAL_SLOTS; i++) {
      init.push({ index: i, plant: null });
    }
    return init;
  }

  function saveGardenSlots(slots) {
    try {
      localStorage.setItem("school_garden_slots_v1", JSON.stringify(slots));
    } catch (e) {}
  }

  function loadGardenInventory() {
    try {
      const raw = localStorage.getItem("school_garden_inv_v1");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { basic_fertilizer: 1, premium_fertilizer: 0, miracle_fertilizer: 0, golden_can: 0 };
  }

  function saveGardenInventory(inv) {
    try {
      localStorage.setItem("school_garden_inv_v1", JSON.stringify(inv));
    } catch (e) {}
  }

  function loadWaterDrops() {
    try {
      const r = localStorage.getItem("school_garden_water_v1");
      return r !== null ? Math.min(WATER_MAX, Math.max(0, Number(r) || 0)) : 10;
    } catch (e) {
      return 10;
    }
  }

  function saveWaterDrops(n) {
    try {
      localStorage.setItem("school_garden_water_v1", String(Math.min(WATER_MAX, Math.max(0, n))));
    } catch (e) {}
  }

  function checkWaterRegen() {
    try {
      const last = Number(localStorage.getItem("school_garden_last_water_regen")) || Date.now();
      const now = Date.now();
      const elapsed = now - last;
      if (elapsed >= WATER_REGEN_MS) {
        const added = Math.floor(elapsed / WATER_REGEN_MS);
        if (added > 0) {
          const current = loadWaterDrops();
          const next = Math.min(WATER_MAX, current + added);
          saveWaterDrops(next);
          localStorage.setItem("school_garden_last_water_regen", String(now - (elapsed % WATER_REGEN_MS)));
        }
      }
    } catch (e) {}
  }

  function formatTime(ms) {
    if (ms <= 0) return "Sẵn sàng!";
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m`;
    return `${m}p ${s < 10 ? "0" : ""}${s}s`;
  }

  function getPlantStatus(slot) {
    if (!slot || !slot.plant) return { progress: 0, remainingMs: 0, isReady: false, stageIdx: 0, cfg: null };
    const cfg = PLANT_CONFIG[slot.plant.plantType];
    if (!cfg) return { progress: slot.plant.progress || 0, remainingMs: 0, isReady: true, stageIdx: 0, cfg: null };

    if (slot.plant.isReady || (slot.plant.progress || 0) >= 100) {
      return { progress: 100, remainingMs: 0, isReady: true, stageIdx: cfg.stageCount - 1, cfg };
    }

    const baseProgress = slot.plant.progress || 0;
    const elapsed = Date.now() - (slot.plant.updatedAt || slot.plant.plantedAt || Date.now());
    const growth = (elapsed / cfg.growthTime) * 100;
    const progress = Math.min(100, baseProgress + growth);
    const isReady = progress >= 100;
    const remainingMs = Math.max(0, cfg.growthTime * (1 - progress / 100));

    // Tính stage icon
    const stageIdx = Math.min(cfg.stageCount - 1, Math.floor((progress / 100) * cfg.stageCount));
    return { progress, remainingMs, isReady, stageIdx, cfg };
  }

  /* ============================================================
     STYLE CSS CHO VƯỜN TRƯỜNG
  ============================================================ */
  function injectGardenStyle() {
    if (document.getElementById("garden-custom-css")) return;
    const style = document.createElement("style");
    style.id = "garden-custom-css";
    style.textContent = `
      .gdn-wrap {
        display: flex;
        flex-direction: column;
        gap: 12px;
        text-align: left;
        max-width: 580px;
        margin: 0 auto;
        color: #2c3e50;
      }
      .gdn-hud {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
        border: 2px solid #81c784;
        border-radius: 16px;
        padding: 8px 14px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.06);
      }
      .gdn-hud-stats {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .gdn-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: #fff;
        border: 1.5px solid #a5d6a7;
        padding: 4px 10px;
        border-radius: 12px;
        font-weight: 800;
        font-size: 13.5px;
        color: #2e7d32;
      }
      .gdn-btn-sm {
        background: #4caf50;
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 4px 8px;
        font-weight: 700;
        font-size: 11.5px;
        cursor: pointer;
        box-shadow: 0 2px 0 #2e7d32;
        transition: transform .1s;
      }
      .gdn-btn-sm:active {
        transform: translateY(2px);
        box-shadow: none;
      }
      .gdn-actions {
        display: flex;
        gap: 8px;
      }
      .gdn-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 10px;
      }
      .gdn-plot {
        background: #fffdf5;
        border: 2px solid #bcaaa4;
        border-radius: 16px;
        padding: 10px;
        text-align: center;
        position: relative;
        box-shadow: 0 4px 0 #a1887f;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 140px;
        transition: transform .15s, border-color .15s;
      }
      .gdn-plot.empty {
        background: #fbf7ee;
        border-style: dashed;
        cursor: pointer;
      }
      .gdn-plot.empty:hover {
        background: #f1f8e9;
        border-color: #4caf50;
        transform: translateY(-2px);
      }
      .gdn-plot.ready {
        border-color: #ffd54f;
        background: linear-gradient(180deg, #fffde7, #fff9c4);
        box-shadow: 0 4px 0 #fbc02d, 0 0 14px rgba(255, 213, 79, 0.4);
        animation: gdnPulse 1.8s infinite;
      }
      @keyframes gdnPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      .gdn-plant-icon {
        font-size: 38px;
        line-height: 1;
        margin: 4px 0;
        user-select: none;
      }
      .gdn-plant-name {
        font-weight: 800;
        font-size: 13px;
        color: #37474f;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .gdn-pbar {
        height: 6px;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
        margin: 6px 0 4px;
      }
      .gdn-pbar-fill {
        height: 100%;
        background: linear-gradient(90deg, #81c784, #4caf50);
        transition: width .3s;
      }
      .gdn-pbar-ready {
        background: linear-gradient(90deg, #ffca28, #ffa000);
      }
      .gdn-time {
        font-size: 11px;
        font-weight: 700;
        color: #78909c;
      }
      .gdn-btn-row {
        display: flex;
        gap: 5px;
        margin-top: 6px;
      }
      .gdn-btn-action {
        flex: 1;
        border: none;
        border-radius: 10px;
        padding: 5px 4px;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
        transition: transform .1s;
      }
      .gdn-btn-water {
        background: #42a5f5;
        color: #fff;
        box-shadow: 0 2px 0 #1e88e5;
      }
      .gdn-btn-fert {
        background: #66bb6a;
        color: #fff;
        box-shadow: 0 2px 0 #43a047;
      }
      .gdn-btn-harvest {
        background: #ffa726;
        color: #fff;
        box-shadow: 0 2px 0 #fb8c00;
        width: 100%;
        font-size: 12.5px;
        padding: 7px;
      }
      .gdn-btn-remove {
        background: #ef5350;
        color: #fff;
        box-shadow: 0 2px 0 #e53935;
        width: 24px;
        padding: 0;
        flex: none;
      }
      .gdn-btn-action:active {
        transform: translateY(2px);
        box-shadow: none;
      }
      .gdn-modal-sub {
        background: #fff;
        border: 2px solid #81c784;
        border-radius: 18px;
        padding: 14px;
        margin-top: 8px;
      }
      .gdn-item-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #f9fbe7;
        border: 1.5px solid #dce775;
        border-radius: 12px;
        padding: 8px 10px;
        margin-bottom: 8px;
        gap: 10px;
      }
      .gdn-tag {
        font-size: 10px;
        border-radius: 4px;
        padding: 1px 5px;
        font-weight: 700;
      }
    `;
    document.head.appendChild(style);
  }

  /* ============================================================
     QUẢN LÝ TRẠNG THÁI GIAO DIỆN VƯỜN TRƯỜNG
  ============================================================ */
  let activeView = "main"; // "main" | "shop" | "inv" | "quiz"
  let gardenSlots = loadGardenSlots();
  let gardenInv = loadGardenInventory();
  let selectedSlotIndex = null;
  let gardenTimer = null;
  let currentQuiz = null;

  function refreshData() {
    checkWaterRegen();
    gardenSlots = loadGardenSlots();
    gardenInv = loadGardenInventory();
  }

  // Cập nhật hiển thị số coin trên giao diện nếu modal vườn đang mở
  window.updateGardenWalletHUD = function () {
    const el = document.getElementById("gdn-coin-val");
    if (el) el.textContent = S.coins.toLocaleString();
  };

  /* ============================================================
     HÀNH ĐỘNG: TRỒNG, TƯỚI, BÓN PHÂN, THU HOẠCH, NHỔ BỎ
  ============================================================ */
  function doPlantSeed(slotIdx, plantType) {
    const cfg = PLANT_CONFIG[plantType];
    if (!cfg) return;

    if (S.coins < cfg.seedPrice) {
      toast("🪙 Không đủ coin để mua hạt giống!");
      return;
    }

    // Trừ coin ví
    S.coins -= cfg.seedPrice;
    save(); // Lưu vào gq_coin_wallet_v1

    const now = Date.now();
    gardenSlots[slotIdx].plant = {
      plantType,
      progress: 0,
      plantedAt: now,
      updatedAt: now,
      isReady: false
    };
    saveGardenSlots(gardenSlots);

    toast(`🌱 Đã gieo ${cfg.name}! (-${cfg.seedPrice} 🪙)`);
    activeView = "main";
    renderGardenModal();
  }

  function doWaterPlant(slotIdx) {
    const water = loadWaterDrops();
    if (water <= 0) {
      toast("💧 Hết nước! Hãy giải đố toán học để nhận nước nhé!");
      activeView = "quiz";
      renderGardenModal();
      return;
    }

    const slot = gardenSlots[slotIdx];
    if (!slot || !slot.plant) return;

    const st = getPlantStatus(slot);
    if (st.isReady) {
      toast("🎉 Cây đã chín! Hãy thu hoạch đi nào!");
      return;
    }

    // Tiêu 1 giọt nước
    saveWaterDrops(water - 1);

    // Tính lượng boost: nếu có bình tưới vàng => +20%, bình thường => +10%
    const boost = (gardenInv.golden_can || 0) > 0 ? 20 : 10;
    const nextProgress = Math.min(100, st.progress + boost);

    slot.plant.progress = nextProgress;
    slot.plant.updatedAt = Date.now();
    slot.plant.isReady = nextProgress >= 100;
    saveGardenSlots(gardenSlots);

    pop(`+${boost}% 💧`);
    toast(`💧 Đã tưới nước! (+${boost}% lớn nhanh)`);
    renderGardenModal();
  }

  function doFertilizerPlant(slotIdx, itemId) {
    const item = ITEM_CONFIG[itemId];
    if (!item) return;

    const count = gardenInv[itemId] || 0;
    if (count <= 0) {
      toast("🎒 Hết phân bón này rồi! Vào kho đồ mua thêm nhé!");
      return;
    }

    const slot = gardenSlots[slotIdx];
    if (!slot || !slot.plant) return;

    const st = getPlantStatus(slot);
    if (st.isReady) {
      toast("🎉 Cây đã chín rồi!");
      return;
    }

    gardenInv[itemId] = count - 1;
    saveGardenInventory(gardenInv);

    const boost = item.boost;
    const nextProgress = Math.min(100, st.progress + boost);
    slot.plant.progress = nextProgress;
    slot.plant.updatedAt = Date.now();
    slot.plant.isReady = nextProgress >= 100;
    saveGardenSlots(gardenSlots);

    pop(`+${boost}% 🌱`);
    toast(`✨ Bón ${item.name}! Cây tăng +${boost}%!`);
    renderGardenModal();
  }

  function doHarvestPlant(slotIdx) {
    const slot = gardenSlots[slotIdx];
    if (!slot || !slot.plant) return;

    const st = getPlantStatus(slot);
    if (!st.isReady) {
      toast("⏳ Cây chưa chín, hãy tưới nước thêm nhé!");
      return;
    }

    const reward = st.cfg ? st.cfg.harvestCoin : 20;

    // Cộng coin vào ví
    S.coins += reward;
    S.xp += 15;
    save(); // Lưu ngay vào gq_coin_wallet_v1

    // Làm sạch ô đất
    slot.plant = null;
    saveGardenSlots(gardenSlots);

    pop(`+${reward}🪙 +15XP`);
    toast(`🎉 Thu hoạch ${st.cfg.name}! Nhận +${reward} 🪙 và +15 XP!`);
    renderGardenModal();
  }

  function doRemovePlant(slotIdx) {
    if (!confirm("Bạn có chắc muốn nhổ bỏ cây này để lấy lại đất trồng không?")) return;
    const slot = gardenSlots[slotIdx];
    if (slot) {
      slot.plant = null;
      saveGardenSlots(gardenSlots);
      toast("Đã dọn sạch ô đất!");
      renderGardenModal();
    }
  }

  function doBuyItem(itemId) {
    const item = ITEM_CONFIG[itemId];
    if (!item) return;

    if (item.type === "upgrade" && (gardenInv[itemId] || 0) > 0) {
      toast("Bạn đã sở hữu nâng cấp này rồi!");
      return;
    }

    if (S.coins < item.price) {
      toast("🪙 Không đủ coin để mua vật phẩm này!");
      return;
    }

    S.coins -= item.price;
    save();

    gardenInv[itemId] = (gardenInv[itemId] || 0) + 1;
    saveGardenInventory(gardenInv);

    toast(`✅ Đã mua ${item.name}! (-${item.price} 🪙)`);
    renderGardenModal();
  }

  function pickRandomQuiz() {
    currentQuiz = MATH_QUESTIONS[Math.floor(Math.random() * MATH_QUESTIONS.length)];
  }

  function answerQuiz(idx) {
    if (!currentQuiz) return;
    if (idx === currentQuiz.a) {
      const current = loadWaterDrops();
      saveWaterDrops(current + 1);
      pop("+1 💧");
      toast("✅ Chính xác! Bạn nhận được +1 giọt nước 💧!");
      pickRandomQuiz();
      renderGardenModal();
    } else {
      toast("❌ Chưa đúng rồi! Thử lại câu khác nhé!");
      pickRandomQuiz();
      renderGardenModal();
    }
  }

  /* ============================================================
     RENDER GIAO DIỆN MODAL VƯỜN TRƯỜNG
  ============================================================ */
  function renderGardenModal() {
    injectGardenStyle();
    refreshData();

    const water = loadWaterDrops();
    const plantedCount = gardenSlots.filter(s => s.plant).length;

    let html = `
      <div class="gdn-wrap">
        <!-- HEADER HUD -->
        <div class="gdn-hud">
          <div class="gdn-hud-stats">
            <span style="font-size:22px;">🌸</span>
            <div>
              <div style="font-weight:900;font-size:16px;color:#1b5e20;">VƯỜN TRƯỜNG VUI VẺ</div>
              <div style="font-size:11.5px;color:#455a64;">Trồng cây, thu hoạch & nhận coin tài khoản!</div>
            </div>
          </div>
          <div class="gdn-actions">
            <button class="gdn-btn-sm" style="background:#f57c00;" onclick="window.petGarden()">🐾 Thú cưng</button>
            <button class="gdn-btn-sm" style="background:#546e7a;" onclick="window.closeGardenModal()">✕ Đóng</button>
          </div>
        </div>

        <!-- THANH CHỈ SỐ -->
        <div style="display:flex;justify-content:space-between;align-items:center;background:#fff;padding:8px 12px;border-radius:14px;border:1.5px solid #cfd8dc;">
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <span class="gdn-badge">🪙 <b id="gdn-coin-val">${S.coins.toLocaleString()}</b> Coin</span>
            <span class="gdn-badge">💧 <b>${water}</b>/${WATER_MAX}</span>
            <button class="gdn-btn-sm" style="background:#29b6f6;" onclick="window.setGardenView('quiz')">➕ Nhận nước</button>
            <span class="gdn-badge" style="color:#5d4037;">🌱 <b>${plantedCount}</b>/${TOTAL_SLOTS} ô</span>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="gdn-btn-sm" style="background:#8bc34a;" onclick="window.setGardenView('shop')">🌾 Mua hạt</button>
            <button class="gdn-btn-sm" style="background:#ab47bc;" onclick="window.setGardenView('inv')">🎒 Kho đồ</button>
          </div>
        </div>
    `;

    // VIEW: CỬA HÀNG HẠT GIỐNG
    if (activeView === "shop") {
      html += `
        <div class="gdn-modal-sub">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <b style="font-size:15px;color:#2e7d32;">🌾 CỬA HÀNG HẠT GIỐNG</b>
            <button class="gdn-btn-sm" style="background:#78909c;" onclick="window.setGardenView('main')">← Về vườn</button>
          </div>
          <p style="font-size:12px;color:#607d8b;margin:0 0 10px;">Chọn hạt giống để gieo vào ${selectedSlotIndex !== null ? `ô đất số ${selectedSlotIndex + 1}` : "ô đất trống"}:</p>
          <div style="display:flex;flex-direction:column;gap:8px;">
      `;

      Object.entries(PLANT_CONFIG).forEach(([type, c]) => {
        const canAfford = S.coins >= c.seedPrice;
        const badge = RARITY_BADGE[c.rarity] || RARITY_BADGE.common;
        html += `
          <div class="gdn-item-card" style="opacity:${canAfford ? '1' : '0.6'};">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:28px;">${c.icon}</span>
              <div>
                <div style="font-weight:800;font-size:13.5px;">${c.name} <span class="gdn-tag" style="background:${badge.bg};color:${badge.text}">${badge.label}</span></div>
                <div style="font-size:11px;color:#546e7a;">⏰ ${formatTime(c.growthTime)} · Thu hoạch: <b>+${c.harvestCoin} 🪙</b></div>
              </div>
            </div>
            <button class="gdn-btn-sm" style="background:${canAfford ? '#43a047' : '#9e9e9e'};padding:6px 12px;font-size:12px;"
              ${canAfford ? `onclick="window.plantSeedTarget('${type}')"` : 'disabled'}>
              🌾 ${c.seedPrice} 🪙
            </button>
          </div>
        `;
      });

      html += `</div></div>`;
    }
    // VIEW: KHO ĐỒ / BÓN PHÂN
    else if (activeView === "inv") {
      html += `
        <div class="gdn-modal-sub">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <b style="font-size:15px;color:#6a1b9a;">🎒 KHO ĐỒ & PHÂN BÓN</b>
            <button class="gdn-btn-sm" style="background:#78909c;" onclick="window.setGardenView('main')">← Về vườn</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
      `;

      Object.entries(ITEM_CONFIG).forEach(([itemId, item]) => {
        const count = gardenInv[itemId] || 0;
        const isUpgrade = item.type === "upgrade";
        const canBuy = !isUpgrade && S.coins >= item.price;
        const canBuyUpgrade = isUpgrade && count === 0 && S.coins >= item.price;

        html += `
          <div class="gdn-item-card">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:26px;">${item.icon}</span>
              <div>
                <div style="font-weight:800;font-size:13.5px;">${item.name} ${!isUpgrade ? `<span style="color:#2e7d32;">(x${count})</span>` : ""}</div>
                <div style="font-size:11px;color:#546e7a;">${item.desc}</div>
              </div>
            </div>
            <div>
              ${isUpgrade
                ? count > 0
                  ? `<span class="gdn-tag" style="background:#c8e6c9;color:#2e7d32;font-size:12px;">Đã sở hữu ✅</span>`
                  : `<button class="gdn-btn-sm" style="background:#e91e63;" ${canBuyUpgrade ? `onclick="window.buyGardenItem('${itemId}')"` : "disabled"}>Mua ${item.price} 🪙</button>`
                : `<button class="gdn-btn-sm" style="background:#8e24aa;" ${canBuy ? `onclick="window.buyGardenItem('${itemId}')"` : "disabled"}>Mua ${item.price} 🪙</button>`
              }
            </div>
          </div>
        `;
      });

      html += `</div></div>`;
    }
    // VIEW: GIẢI TOÁN NHẬN NƯỚC (QUIZ)
    else if (activeView === "quiz") {
      if (!currentQuiz) pickRandomQuiz();
      html += `
        <div class="gdn-modal-sub" style="text-align:center;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <b style="font-size:15px;color:#0288d1;">💧 GIẢI TOÁN NHẬN NƯỚC TƯỚI CÂY</b>
            <button class="gdn-btn-sm" style="background:#78909c;" onclick="window.setGardenView('main')">← Về vườn</button>
          </div>
          <p style="font-size:12px;color:#546e7a;margin:0 0 10px;">Trả lời đúng nhận ngay +1 giọt nước 💧 tưới cây!</p>
          <div style="background:#e1f5fe;border:2px solid #81d4fa;border-radius:14px;padding:14px;margin-bottom:12px;">
            <span style="font-size:24px;font-weight:900;color:#01579b;">${currentQuiz.q}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      `;

      currentQuiz.o.forEach((opt, idx) => {
        html += `
          <button class="gdn-btn-sm" style="background:#0288d1;font-size:16px;padding:10px;border-radius:12px;" onclick="window.answerWaterQuiz(${idx})">
            ${opt}
          </button>
        `;
      });

      html += `</div></div>`;
    }
    // VIEW: LƯỚI Ô ĐẤT VƯỜN TRƯỜNG CHÍNH
    else {
      html += `<div class="gdn-grid">`;

      gardenSlots.forEach(slot => {
        const st = getPlantStatus(slot);

        if (!slot.plant) {
          // Ô ĐẤT TRỐNG
          html += `
            <div class="gdn-plot empty" onclick="window.openSeedShopForPlot(${slot.index})">
              <span style="font-size:11px;font-weight:700;color:#8d6e63;">Ô số ${slot.index + 1}</span>
              <div class="gdn-plant-icon" style="opacity:0.4;">🌱</div>
              <div style="font-size:12.5px;font-weight:800;color:#5d4037;">Đất trống</div>
              <button class="gdn-btn-sm" style="background:#689f38;margin-top:6px;">🌾 Gieo hạt</button>
            </div>
          `;
        } else if (st.isReady) {
          // CÂY ĐÃ CHÍN SẴN SÀNG THU HOẠCH
          html += `
            <div class="gdn-plot ready">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:10px;font-weight:800;color:#f57f17;">Ô ${slot.index + 1}</span>
                <span class="gdn-tag" style="background:#fff9c4;color:#f57f17;">Chín rộ! ✨</span>
              </div>
              <div class="gdn-plant-icon">${st.cfg.icon}</div>
              <div class="gdn-plant-name">${st.cfg.name}</div>
              <div class="gdn-pbar">
                <div class="gdn-pbar-fill gdn-pbar-ready" style="width:100%;"></div>
              </div>
              <button class="gdn-btn-action gdn-btn-harvest" onclick="window.harvestGardenPlot(${slot.index})">
                🎉 Thu hoạch (+${st.cfg.harvestCoin}🪙)
              </button>
            </div>
          `;
        } else {
          // CÂY ĐANG LỚN
          const stageIcon = st.cfg.stages[st.stageIdx] || "🌿";
          const hasFert = (gardenInv.basic_fertilizer || 0) > 0 || (gardenInv.premium_fertilizer || 0) > 0 || (gardenInv.miracle_fertilizer || 0) > 0;

          html += `
            <div class="gdn-plot">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:10px;font-weight:700;color:#78909c;">Ô ${slot.index + 1}</span>
                <button class="gdn-btn-action gdn-btn-remove" title="Nhổ bỏ" onclick="window.removeGardenPlot(${slot.index})">🗑️</button>
              </div>
              <div class="gdn-plant-icon">${stageIcon}</div>
              <div class="gdn-plant-name">${st.cfg.name}</div>
              <div class="gdn-pbar">
                <div class="gdn-pbar-fill" style="width:${Math.round(st.progress)}%;"></div>
              </div>
              <div class="gdn-time">⏳ ${formatTime(st.remainingMs)} (${Math.round(st.progress)}%)</div>
              <div class="gdn-btn-row">
                <button class="gdn-btn-action gdn-btn-water" onclick="window.waterGardenPlot(${slot.index})">
                  💧 Tưới
                </button>
                <button class="gdn-btn-action gdn-btn-fert" onclick="window.openFertilizerSelect(${slot.index})">
                  ${hasFert ? "🌱 Bón" : "🛒 Mua"}
                </button>
              </div>
            </div>
          `;
        }
      });

      html += `</div>`;
    }

    html += `</div>`;

    // Đưa vào #box và mở #modal
    modal(html);
  }

  /* ============================================================
     CỬA SỔ CHỌN PHÂN BÓN CHO Ô ĐẤT
  ============================================================ */
  function openFertilizerSelect(slotIdx) {
    const ferts = ["basic_fertilizer", "premium_fertilizer", "miracle_fertilizer"];
    const owned = ferts.filter(id => (gardenInv[id] || 0) > 0);

    if (owned.length === 0) {
      activeView = "inv";
      renderGardenModal();
      toast("🎒 Bạn chưa có phân bón! Hãy mua ở kho đồ nhé!");
      return;
    }

    let menu = `
      <div style="text-align:center;padding:6px;">
        <h3 style="margin:0 0 10px;color:#2e7d32;">🌱 Chọn phân bón cho ô số ${slotIdx + 1}</h3>
        <div style="display:flex;flex-direction:column;gap:8px;">
    `;

    owned.forEach(id => {
      const item = ITEM_CONFIG[id];
      const count = gardenInv[id] || 0;
      menu += `
        <button class="gdn-btn-sm" style="background:#43a047;padding:10px;font-size:13px;display:flex;justify-content:space-between;align-items:center;"
          onclick="window.applyFertilizerToSlot(${slotIdx}, '${id}')">
          <span>${item.icon} ${item.name} (${item.desc})</span>
          <b>x${count}</b>
        </button>
      `;
    });

    menu += `
        </div>
        <button class="gdn-btn-sm" style="background:#78909c;margin-top:12px;width:100%;" onclick="window.renderGardenModal()">← Quay lại</button>
      </div>
    `;

    modal(menu);
  }

  /* ============================================================
     GẮN CÁC HÀM XỬ LÝ TOÀN CỤC CHO SỰ KIỆN HTML
  ============================================================ */
  window.setGardenView = function (v) {
    activeView = v;
    renderGardenModal();
  };

  window.openSeedShopForPlot = function (slotIdx) {
    selectedSlotIndex = slotIdx;
    activeView = "shop";
    renderGardenModal();
  };

  window.plantSeedTarget = function (plantType) {
    if (selectedSlotIndex === null) {
      const emptySlot = gardenSlots.find(s => !s.plant);
      if (emptySlot) selectedSlotIndex = emptySlot.index;
      else {
        toast("Vườn đã hết ô đất trống!");
        return;
      }
    }
    doPlantSeed(selectedSlotIndex, plantType);
  };

  window.waterGardenPlot = function (slotIdx) {
    doWaterPlant(slotIdx);
  };

  window.harvestGardenPlot = function (slotIdx) {
    doHarvestPlant(slotIdx);
  };

  window.removeGardenPlot = function (slotIdx) {
    doRemovePlant(slotIdx);
  };

  window.openFertilizerSelect = openFertilizerSelect;

  window.applyFertilizerToSlot = function (slotIdx, itemId) {
    doFertilizerPlant(slotIdx, itemId);
  };

  window.buyGardenItem = function (itemId) {
    doBuyItem(itemId);
  };

  window.answerWaterQuiz = function (idx) {
    answerQuiz(idx);
  };

  window.renderGardenModal = renderGardenModal;

  // Cho hệ thống Thú cưng 2.0 (nạp sau) dùng lại CSS + dừng timer của vườn
  window.__injectGardenStyle = injectGardenStyle;
  window.__gardenMathQuestions = MATH_QUESTIONS;
  window.__gardenStopTimer = function () {
    if (gardenTimer) {
      clearInterval(gardenTimer);
      gardenTimer = null;
    }
  };

  window.closeGardenModal = function () {
    if (gardenTimer) {
      clearInterval(gardenTimer);
      gardenTimer = null;
    }
    activeView = "main";
    selectedSlotIndex = null;
    close_();
  };

  /* ============================================================
     HÀM garden() CHÍNH: GHI ĐÈ HÀM garden() CỦA activities.js
     KHI BÉ BƯỚC VÀO KHU VỰC VƯỜN TRƯỜNG
  ============================================================ */
  window.garden = function () {
    // Mở vườn trường
    activeView = "main";
    selectedSlotIndex = null;
    renderGardenModal();

    // Chạy timer tự động cập nhật thời gian đếm ngược trực tiếp mỗi 1 giây
    if (gardenTimer) clearInterval(gardenTimer);
    gardenTimer = setInterval(() => {
      if (open_ && activeView === "main") {
        renderGardenModal();
      }
    }, 1000);
  };

  /* ============================================================
     HỆ THỐNG VƯỜN THÚ CƯNG (PET CARE & NURTURE)
     Đồng bộ trực tiếp với GardenPage.jsx, HomeScreen và PetPage.jsx
  ============================================================ */
  const PET_DEFAULT = {
    species: "dog",
    name: "Bồng",
    color: "cream",
    level: 1,
    exp: 0,
    expNeeded: 200,
    mood: "happy",
    bonded: 10,
    totalCorrect: 0,
    totalWrong: 0
  };

  const PET_MOODS = {
    happy: { label: "Đang vui", emoji: "💛" },
    excited: { label: "Rất hào hứng", emoji: "🎉" },
    hungry: { label: "Đói rồi", emoji: "🍽️" },
    sleepy: { label: "Muốn ngủ", emoji: "😴" },
    sad: { label: "Buồn", emoji: "💙" }
  };

  const PET_TIPS = [
    "Cùng nhau khám phá thế giới tri thức nhé! 🐾",
    "Trả lời đúng đi, tôi hâm mộ bạn lắm! ✨",
    "Mỗi câu hỏi đúng là một bông hoa mới nở trong vườn~ 🌸",
    "Bạn học chăm chỉ quá đi, tớ rất vui! 🌟",
    "Nghỉ ngơi xíu cùng tớ rồi học tiếp nha! 🐾"
  ];

  function getPetStorageKey() {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("edu_pet_v2.u")) return k;
    }
    return "edu_pet_v2";
  }

  function loadPetData() {
    try {
      const key = getPetStorageKey();
      const raw = localStorage.getItem(key) || localStorage.getItem("edu_pet_v2");
      if (raw) {
        const p = JSON.parse(raw);
        return Object.assign({}, PET_DEFAULT, p);
      }
    } catch (e) {}
    return Object.assign({}, PET_DEFAULT);
  }

  function savePetData(pet) {
    try {
      const key = getPetStorageKey();
      localStorage.setItem(key, JSON.stringify(pet));
      localStorage.setItem("edu_pet_v2", JSON.stringify(pet));
    } catch (e) {}
  }

  function checkPetLevelUp(pet) {
    let leveled = false;
    while (pet.exp >= (pet.expNeeded || 200) && pet.level < 99) {
      pet.exp -= pet.expNeeded;
      pet.level += 1;
      pet.expNeeded = Math.round(200 * Math.pow(1.18, pet.level - 1));
      pet.mood = "excited";
      leveled = true;
    }
    if (leveled) {
      const reward = pet.level * 30;
      S.coins += reward;
      save();
      pop(`🎉 CẤP ${pet.level}! +${reward}🪙`);
      toast(`🎉 ${pet.name} đã lên CẤP ${pet.level}! Thưởng +${reward} 🪙 vào ví!`);
    }
    return leveled;
  }

  function renderPetModal() {
    injectGardenStyle();
    const pet = loadPetData();
    const moodInfo = PET_MOODS[pet.mood] || PET_MOODS.happy;
    const petTip = PET_TIPS[Math.floor(Math.random() * PET_TIPS.length)];
    const expPercent = Math.min(100, Math.round(((pet.exp || 0) / (pet.expNeeded || 200)) * 100));

    const speciesEmoji = {
      dog: "🐶", cat: "🐱", bird: "🐦", fish: "🐟", monkey: "🐵"
    }[pet.species] || "🐶";

    let html = `
      <div class="gdn-wrap">
        <!-- HEADER HUD -->
        <div class="gdn-hud" style="background:linear-gradient(135deg, #fff3e0, #ffe082);border-color:#ffb300;">
          <div class="gdn-hud-stats">
            <span style="font-size:24px;">🐾</span>
            <div>
              <div style="font-weight:900;font-size:16px;color:#e65100;">VƯỜN THÚ CƯNG CỦA BÉ</div>
              <div style="font-size:11.5px;color:#6d4c41;">Chăm sóc, vui chơi & cùng bạn thú cưng lớn lên!</div>
            </div>
          </div>
          <div class="gdn-actions">
            <button class="gdn-btn-sm" style="background:#43a047;" onclick="window.garden()">🌸 Vườn hoa</button>
            <button class="gdn-btn-sm" style="background:#546e7a;" onclick="close_()">✕ Đóng</button>
          </div>
        </div>

        <!-- THẺ THÔNG TIN THÚ CƯNG -->
        <div style="background:#fff;border:2px solid #ffcc80;border-radius:18px;padding:16px;box-shadow:0 6px 16px rgba(0,0,0,0.06);text-align:center;">
          <!-- HÌNH THÚ CƯNG & BONG BÓNG THOẠI -->
          <div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:12px;">
            <div style="width:84px;height:84px;border-radius:50%;background:#fff8e1;border:3px solid #ffb300;display:flex;align-items:center;justify-content:center;font-size:46px;box-shadow:0 4px 10px rgba(255,179,0,0.25);animation:gdnPulse 2s infinite;">
              ${speciesEmoji}
            </div>
            <div style="background:#f5f5f5;border:1.5px solid #e0e0e0;border-radius:14px;padding:10px 14px;text-align:left;position:relative;max-width:240px;">
              <div style="font-size:10px;font-weight:800;color:#ff8f00;margin-bottom:2px;">💬 ${pet.name} nhắn nhủ:</div>
              <div style="font-size:12px;color:#37474f;line-height:1.35;font-weight:600;">"${petTip}"</div>
            </div>
          </div>

          <!-- TÊN, CẤP, TÂM TÍNH -->
          <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:4px;">
            <span style="font-weight:900;font-size:18px;color:#bf360c;">${pet.name}</span>
            <button class="gdn-btn-sm" style="background:#ffb74d;padding:2px 8px;font-size:11px;" onclick="window.renamePetPrompt()">✏️ Đổi tên</button>
            <span class="gdn-tag" style="background:#fff3e0;color:#e65100;border:1px solid #ffb74d;font-size:11px;">
              ${moodInfo.label} ${moodInfo.emoji}
            </span>
          </div>

          <div style="font-size:12px;color:#78909c;font-weight:700;margin-bottom:10px;">
            Cấp độ <b>${pet.level}</b> · Thân thiết: <b>❤️ ${pet.bonded}%</b> · Ví: <b>🪙 ${S.coins.toLocaleString()}</b>
          </div>

          <!-- THANH KINH NGHIỆM EXP -->
          <div style="background:#f5f5f5;border-radius:12px;padding:8px 12px;border:1px solid #eee;margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:#546e7a;margin-bottom:4px;">
              <span>Kinh nghiệm (EXP)</span>
              <span>${pet.exp} / ${pet.expNeeded} EXP (${expPercent}%)</span>
            </div>
            <div class="gdn-pbar" style="height:8px;margin:0;">
              <div class="gdn-pbar-fill" style="width:${expPercent}%;background:linear-gradient(90deg, #ffb300, #ff8f00);"></div>
            </div>
          </div>

          <!-- 4 HÀNH ĐỘNG CHĂM SÓC -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <button class="gdn-btn-action" style="background:#ff7043;color:#fff;padding:12px 10px;font-size:13px;border-radius:14px;box-shadow:0 3px 0 #d84315;"
              onclick="window.petActionFeed()">
              <div style="font-size:22px;margin-bottom:2px;">🍖</div>
              <b>Cho ăn ngon</b>
              <div style="font-size:10px;opacity:0.9;">-5 🪙 · +20 EXP</div>
            </button>

            <button class="gdn-btn-action" style="background:#42a5f5;color:#fff;padding:12px 10px;font-size:13px;border-radius:14px;box-shadow:0 3px 0 #1565c0;"
              onclick="window.petActionPlay()">
              <div style="font-size:22px;margin-bottom:2px;">🎾</div>
              <b>Chơi đùa</b>
              <div style="font-size:10px;opacity:0.9;">-10 ⚡ · +25 EXP · +5% ❤️</div>
            </button>

            <button class="gdn-btn-action" style="background:#26a69a;color:#fff;padding:12px 10px;font-size:13px;border-radius:14px;box-shadow:0 3px 0 #00695c;"
              onclick="window.petActionWash()">
              <div style="font-size:22px;margin-bottom:2px;">🛁</div>
              <b>Tắm rửa & Vuốt</b>
              <div style="font-size:10px;opacity:0.9;">Miễn phí · +15 EXP</div>
            </button>

            <button class="gdn-btn-action" style="background:#ab47bc;color:#fff;padding:12px 10px;font-size:13px;border-radius:14px;box-shadow:0 3px 0 #6a1b9a;"
              onclick="window.petActionRest()">
              <div style="font-size:22px;margin-bottom:2px;">💤</div>
              <b>Nghỉ ngơi</b>
              <div style="font-size:10px;opacity:0.9;">⚡ Hồi phục +25 năng lượng</div>
            </button>
          </div>
        </div>
      </div>
    `;

    modal(html);
  }

  window.petActionFeed = function () {
    if (S.coins < 5) {
      toast("🪙 Cần ít nhất 5 coin để mua thức ăn cho bé!");
      return;
    }
    S.coins -= 5;
    save();

    const pet = loadPetData();
    pet.exp = (pet.exp || 0) + 20;
    pet.mood = "excited";
    pet.bonded = Math.min(100, (pet.bonded || 10) + 3);
    checkPetLevelUp(pet);
    savePetData(pet);

    pop("+20 EXP 🍖");
    toast(`🍖 Đã cho ${pet.name} ăn ngon lành! (-5 🪙, +20 EXP)`);
    renderPetModal();
  };

  window.petActionPlay = function () {
    if (S.en < 10) {
      toast("⚡ Bạn đã hết năng lượng! Hãy nghỉ ngơi hoặc ăn uống tại Căng tin!");
      return;
    }
    S.en -= 10;

    const pet = loadPetData();
    pet.exp = (pet.exp || 0) + 25;
    pet.bonded = Math.min(100, (pet.bonded || 10) + 5);
    pet.mood = "happy";
    checkPetLevelUp(pet);
    savePetData(pet);

    pop("+25 EXP 🎾");
    toast(`🎾 Bạn đã cùng ${pet.name} chơi bóng thật vui vẻ! (+25 EXP, Thân thiết +5%)`);
    renderPetModal();
  };

  window.petActionWash = function () {
    const pet = loadPetData();
    pet.exp = (pet.exp || 0) + 15;
    pet.mood = "excited";
    checkPetLevelUp(pet);
    savePetData(pet);

    pop("+15 EXP 🛁");
    toast(`🛁 ${pet.name} đã được tắm rửa sạch sẽ, thơm tho! (+15 EXP)`);
    renderPetModal();
  };

  window.petActionRest = function () {
    S.en = Math.min(100, S.en + 25);
    const pet = loadPetData();
    pet.mood = "happy";
    savePetData(pet);

    pop("+25 ⚡");
    toast(`💤 Cả bạn và ${pet.name} đã ngủ một giấc thật ngon! (⚡ +25 Năng lượng)`);
    renderPetModal();
  };

  window.renamePetPrompt = function () {
    const pet = loadPetData();
    const newName = prompt(`Nhập tên mới cho ${pet.name}:`, pet.name);
    if (newName && newName.trim() && newName.trim() !== pet.name) {
      pet.name = newName.trim();
      savePetData(pet);
      toast(`Đã đổi tên thú cưng thành "${pet.name}"!`);
      renderPetModal();
    }
  };

  window.petGarden = function () {
    if (gardenTimer) {
      clearInterval(gardenTimer);
      gardenTimer = null;
    }
    renderPetModal();
  };

  console.log("✔ Đã nạp thành công hệ thống Vườn trường và Vườn thú cưng vào School Mission!");
})();

/* ============================================================
   THÚ CƯNG 2.0 — cấp độ, kỹ năng, phụ kiện, thành tựu
   Toàn bộ trạng thái nằm trong S.pet nên được lưu localStorage
   VÀ đồng bộ lên backend qua school-save (gameState.pet).
============================================================ */
(function () {
  const FOODS = PET_FOODS;
  const MOODS = {
    happy:   { label: "Đang vui",      emoji: "💛" },
    excited: { label: "Rất hào hứng",  emoji: "🎉" },
    hungry:  { label: "Đói bụng",      emoji: "🍽️" },
    sleepy:  { label: "Buồn ngủ",      emoji: "😴" },
    sad:     { label: "Hơi buồn",      emoji: "💙" }
  };
  const ACCESSORIES = {
    bow:     { name: "Nơ hồng",    icon: "🎀", price: 60,  bond: 5,  desc: "Dễ thương hết nấc" },
    glasses: { name: "Kính mát",   icon: "🕶️", price: 90,  bond: 6,  desc: "Ngầu đét" },
    scarf:   { name: "Khăn quàng", icon: "🧣", price: 80,  bond: 6,  desc: "Ấm áp mùa đông" },
    crown:   { name: "Vương miện", icon: "👑", price: 180, bond: 10, desc: "Thú cưng hoàng gia" }
  };
  const MILESTONES = [
    { lv: 1,  icon: "🍖", name: "Cho ăn" },
    { lv: 2,  icon: "🎾", name: "Chơi đùa" },
    { lv: 3,  icon: "🛁", name: "Tắm rửa" },
    { lv: 4,  icon: "📚", name: "Dạy học" },
    { lv: 5,  icon: "🎀", name: "Phụ kiện" },
    { lv: 7,  icon: "✨", name: "Tiến hóa" },
    { lv: 10, icon: "🌟", name: "Kỹ năng học tập" },
    { lv: 15, icon: "🏅", name: "Danh hiệu" },
    { lv: 20, icon: "👑", name: "Thần thú" }
  ];
  const ACHIEVEMENTS = [
    { id: "feed10", icon: "🍖", name: "Đầu bếp nhí",           desc: "Cho thú cưng ăn 10 lần",   reward: 60,  check: p => (p.totalFeeds || 0) >= 10 },
    { id: "play10", icon: "🎾", name: "Bạn chơi thân",         desc: "Chơi đùa 10 lần",          reward: 60,  check: p => (p.totalPlays || 0) >= 10 },
    { id: "wash10", icon: "🛁", name: "Thú cưng thơm tho",     desc: "Tắm rửa 10 lần",           reward: 50,  check: p => (p.totalWashes || 0) >= 10 },
    { id: "bond100",icon: "❤️", name: "Đôi bạn thân",          desc: "Thân thiết đạt 100%",      reward: 150, check: p => (p.bonded || 0) >= 100 },
    { id: "lv5",    icon: "🌟", name: "Lớn nhanh như thổi",    desc: "Thú cưng đạt cấp 5",       reward: 100, check: p => (p.level || 1) >= 5 },
    { id: "lv10",   icon: "🏆", name: "Người bạn tri kỷ",      desc: "Thú cưng đạt cấp 10",      reward: 200, check: p => (p.level || 1) >= 10 },
    { id: "lv20",   icon: "👑", name: "Thần thú huyền thoại",  desc: "Thú cưng đạt cấp 20",      reward: 500, check: p => (p.level || 1) >= 20 }
  ];

  let migrated = false;
  let currentTeach = null;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function speciesInfo(pet) { return PET_SPECIES[pet.species] || PET_SPECIES.dog; }
  function accessoryInfo(pet) { return pet.equipped ? ACCESSORIES[pet.equipped] : null; }

  function petStage(pet) {
    const lv = pet.level || 1;
    if (lv >= 20) return { name: "Thần thú",       icon: "👑", color: "#ffd54f" };
    if (lv >= 15) return { name: "Anh hùng",       icon: "🏅", color: "#ffb300" };
    if (lv >= 10) return { name: "Chiến binh",     icon: "🌟", color: "#7cb342" };
    if (lv >= 5)  return { name: "Bạn nhỏ",        icon: "🌿", color: "#4fc3f7" };
    return { name: "Bé cưng", icon: "🌱", color: "#aed581" };
  }

  function petTitle(pet) {
    const lv = pet.level || 1;
    if (lv >= 20) return "Thần thú huyền thoại";
    if (lv >= 15) return "Anh hùng sân trường";
    if (lv >= 10) return "Chiến binh tri thức";
    if (lv >= 5)  return "Người bạn nhỏ";
    return "Bé cưng tập sự";
  }

  function needExp(pet) {
    return Math.max(50, Number(pet.expNeeded) || Math.round(200 * Math.pow(1.18, (pet.level || 1) - 1)));
  }

  function updateMood(pet) {
    if ((pet.hunger ?? 80) < 30) pet.mood = "hungry";
    else if ((pet.energy ?? 80) < 25) pet.mood = "sleepy";
    else if ((pet.happy ?? 80) < 40) pet.mood = "sad";
    else if ((pet.happy ?? 80) > 85 && (pet.bonded || 0) > 60) pet.mood = "excited";
    else pet.mood = "happy";
  }

  function decayPet(pet) {
    const now = Date.now();
    const last = Number(pet.lastCareAt) || now;
    const steps = Math.min(48, Math.floor((now - last) / (10 * 60 * 1000)));
    if (steps > 0) {
      pet.hunger = clamp((pet.hunger ?? 80) - steps * 2, 5, 100);
      pet.happy  = clamp((pet.happy  ?? 80) - steps * 1.5, 5, 100);
      pet.clean  = clamp((pet.clean  ?? 80) - steps * 1.2, 5, 100);
      pet.energy = clamp((pet.energy ?? 80) - steps * 1.5, 5, 100);
      pet.lastCareAt = now;
    }
    updateMood(pet);
  }

  function ensurePet() {
    if (!S.pet || typeof S.pet !== "object") S.pet = defaultPetState();
    const base = defaultPetState();
    S.pet = Object.assign({}, base, S.pet);
    S.pet.food = Object.assign({}, base.food, S.pet.food || {});
    S.pet.claimed = Object.assign({}, S.pet.claimed || {});
    if (!Array.isArray(S.pet.ownedAccessories)) S.pet.ownedAccessories = [];
    if (typeof S.pet.equipped !== "string") S.pet.equipped = "";

    // Lần đầu mở: nhập tiến độ thú cưng cũ (localStorage edu_pet_v2)
    if (!migrated) {
      migrated = true;
      try {
        let raw = localStorage.getItem("edu_pet_v2");
        for (let i = 0; i < localStorage.length && !raw; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith("edu_pet_v2.u")) raw = localStorage.getItem(k);
        }
        if (raw) {
          const old = JSON.parse(raw);
          const fresh = (S.pet.level || 1) <= 1 && (S.pet.exp || 0) === 0 && (S.pet.totalFeeds || 0) === 0;
          if (fresh && old && (Number(old.level) > 1 || Number(old.exp) > 0 || Number(old.bonded) > 10)) {
            ["species", "name", "color", "level", "exp", "expNeeded", "mood", "bonded", "totalCorrect", "totalWrong"].forEach(k => {
              if (old[k] != null) S.pet[k] = old[k];
            });
            S.pet.level = clamp(Number(S.pet.level) || 1, 1, 99);
            S.pet.expNeeded = Number(S.pet.expNeeded) || Math.round(200 * Math.pow(1.18, S.pet.level - 1));
          }
        }
      } catch (e) { /* localStorage bị chặn */ }
    }

    decayPet(S.pet);
    return S.pet;
  }

  function savePet(pet) {
    S.pet = pet;
    save(); // localStorage "tvv" + postMessage school-save → backend (gameState.pet)
    try { localStorage.setItem("edu_pet_v2", JSON.stringify(pet)); } catch (e) {}
    updateHud();
  }

  function updateHud() {
    const el = document.getElementById("petHud");
    if (!el) return;
    const pet = S.pet;
    if (!pet) { el.textContent = "🐾 Thú cưng"; return; }
    const sp = speciesInfo(pet);
    const txt = `${sp.icon} ${pet.name} · Lv ${pet.level}`;
    if (el.textContent !== txt) el.textContent = txt;
  }
  window.updatePetHud = updateHud;

  function levelUp(pet) {
    let leveled = 0;
    while (pet.exp >= needExp(pet) && pet.level < 99) {
      pet.exp -= needExp(pet);
      pet.level += 1;
      pet.expNeeded = Math.round(200 * Math.pow(1.18, pet.level - 1));
      leveled++;
    }
    if (leveled) {
      pet.mood = "excited";
      const reward = pet.level * 30 + leveled * 10;
      S.coins += reward;
      if (pet.level % 5 === 0) S.gems += 1;
      const unlocked = MILESTONES.filter(m => m.lv === pet.level);
      pop(`🎉 CẤP ${pet.level}! +${reward}🪙`);
      toast(`🎉 ${pet.name} lên CẤP ${pet.level}! +${reward}🪙${pet.level % 5 === 0 ? " +1💎" : ""}${unlocked.length ? " · Mở: " + unlocked.map(m => m.name).join(", ") : ""}`);
    }
    return leveled;
  }

  function requireLevel(pet, lv, name) {
    if ((pet.level || 1) < lv) {
      toast(`🔒 ${name} mở ở cấp ${lv} — ${pet.name} còn ${lv - (pet.level || 1)} cấp nữa!`);
      return false;
    }
    return true;
  }

  /* Học bài / làm bài thi cũng cho thú cưng EXP (gọi từ ui.js gain()) */
  window.schoolPetGainExp = function (n) {
    n = Math.max(0, Math.round(Number(n) || 0));
    if (!n) return;
    const pet = ensurePet();
    pet.exp += n;
    levelUp(pet);
    savePet(pet);
  };

  /* ── CSS riêng cho thú cưng ── */
  function injectPetStyle() {
    if (document.getElementById("pet-custom-css")) return;
    const style = document.createElement("style");
    style.id = "pet-custom-css";
    style.textContent = `
      .pet-wrap { max-width: 620px; }
      .pet-hud { background: linear-gradient(135deg, #fff8e1, #ffe0b2) !important; border-color: #ffb74d !important; }
      .pet-title { font-weight: 900; font-size: 16px; color: #e65100; }
      .pet-sub { font-size: 11.5px; color: #6d4c41; }
      .pet-hero { display: flex; gap: 14px; align-items: center; background: linear-gradient(135deg, #fffdf7, #fff3e0); border: 2px solid #ffcc80; border-radius: 20px; padding: 14px; box-shadow: 0 6px 18px rgba(255,152,0,.12); }
      .pet-avatar { position: relative; width: 96px; height: 96px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fff, #ffe0b2); border: 4px solid #ffb300; display: grid; place-items: center; font-size: 52px; flex: none; box-shadow: 0 6px 14px rgba(255,179,0,.35); animation: petFloat 2.6s ease-in-out infinite; }
      @keyframes petFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      .pet-acc { position: absolute; right: -6px; bottom: -4px; font-size: 26px; filter: drop-shadow(0 2px 2px rgba(0,0,0,.2)); }
      .pet-hero-info { flex: 1; min-width: 0; }
      .pet-name-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
      .pet-name { font-weight: 900; font-size: 19px; color: #bf360c; }
      .pet-stage { font-size: 10.5px; font-weight: 800; padding: 2px 8px; border-radius: 999px; background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; }
      .pet-meta { font-size: 11.5px; color: #78909c; font-weight: 700; margin: 3px 0 6px; }
      .pet-expbar { height: 10px; background: #f1e4d0; border-radius: 999px; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,.08); }
      .pet-expbar i { display: block; height: 100%; background: linear-gradient(90deg, #ffb300, #ff7043); border-radius: 999px; transition: width .4s; }
      .pet-exp-line { display: flex; justify-content: space-between; font-size: 10.5px; font-weight: 800; color: #8d6e63; margin-bottom: 3px; gap: 8px; }
      .pet-stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
      .pet-stat { background: #fff; border: 1.5px solid #ffe0b2; border-radius: 14px; padding: 8px 10px; }
      .pet-stat-top { display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; color: #6d4c41; margin-bottom: 4px; }
      .pet-statbar { height: 7px; border-radius: 999px; background: #f5f5f5; overflow: hidden; }
      .pet-statbar i { display: block; height: 100%; border-radius: 999px; transition: width .3s; }
      .pet-section { background: #fff; border: 2px solid #ffe0b2; border-radius: 18px; padding: 12px; }
      .pet-section-title { font-weight: 900; font-size: 13px; color: #e65100; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
      .pet-section-title small { font-size: 10.5px; font-weight: 700; color: #8d6e63; }
      .pet-food-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
      .pet-food { display: flex; align-items: center; gap: 8px; border: 1.5px solid #ffcc80; background: #fffdf5; border-radius: 14px; padding: 8px; cursor: pointer; text-align: left; transition: transform .12s, box-shadow .12s; }
      .pet-food:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(255,152,0,.18); }
      .pet-food .ico { font-size: 24px; }
      .pet-food b { display: block; font-size: 12px; color: #4e342e; }
      .pet-food small { font-size: 10px; color: #8d6e63; font-weight: 700; }
      .pet-food .cnt { margin-left: auto; font-size: 11px; font-weight: 900; color: #e65100; background: #fff3e0; border-radius: 999px; padding: 2px 7px; white-space: nowrap; }
      .pet-action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      .pet-act { border: none; border-radius: 14px; padding: 10px; color: #fff; font-weight: 800; font-size: 12.5px; cursor: pointer; text-align: center; transition: transform .12s; }
      .pet-act:active { transform: translateY(2px); }
      .pet-act.locked { filter: grayscale(.5); opacity: .72; }
      .pet-act small { display: block; font-size: 10px; font-weight: 700; opacity: .9; margin-top: 2px; }
      .pet-acc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
      .pet-acc-item { display: flex; align-items: center; gap: 8px; border: 1.5px solid #e1bee7; background: #faf5ff; border-radius: 14px; padding: 8px; cursor: pointer; text-align: left; }
      .pet-acc-item.owned { background: #f1f8e9; border-color: #a5d6a7; }
      .pet-acc-item.equipped { outline: 2px solid #7cb342; }
      .pet-acc-item b { display: block; font-size: 12px; color: #4e342e; }
      .pet-acc-item small { display: block; font-size: 10px; color: #8d6e63; font-weight: 700; }
      .pet-ach { display: flex; align-items: center; gap: 8px; border-bottom: 1px dashed #ffe0b2; padding: 7px 0; }
      .pet-ach:last-child { border-bottom: none; }
      .pet-ach .ach-ico { font-size: 22px; }
      .pet-ach .ach-body { flex: 1; min-width: 0; text-align: left; }
      .pet-ach b { font-size: 12px; color: #4e342e; }
      .pet-ach small { display: block; font-size: 10.5px; color: #8d6e63; }
      .pet-chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
      .pet-chip { font-size: 10.5px; font-weight: 800; padding: 4px 9px; border-radius: 999px; background: #f5f5f5; color: #9e9e9e; border: 1px solid #e0e0e0; }
      .pet-chip.on { background: #e8f5e9; color: #2e7d32; border-color: #a5d6a7; }
      .pet-note { font-size: 10.5px; color: #8d6e63; font-weight: 700; margin-top: 8px; line-height: 1.4; }
      .pet-sync { font-size: 10.5px; font-weight: 800; color: #1565c0; background: #e3f2fd; border: 1.5px solid #90caf9; border-radius: 12px; padding: 7px 10px; text-align: center; }
      .pet-quiz { background: #e3f2fd; border: 2px solid #90caf9; border-radius: 16px; padding: 16px; font-size: 22px; font-weight: 900; color: #0d47a1; text-align: center; margin: 8px 0 12px; }
      .pet-quiz-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      .pet-quiz-opts button { border: none; border-radius: 12px; padding: 12px; background: #1e88e5; color: #fff; font-weight: 900; font-size: 16px; cursor: pointer; }
      .pet-quiz-opts button:active { transform: translateY(2px); }
      @media (max-width: 520px) {
        .pet-stats-grid, .pet-food-grid, .pet-acc-grid, .pet-action-grid, .pet-quiz-opts { grid-template-columns: 1fr 1fr; }
        .pet-hero { flex-direction: column; text-align: center; }
        .pet-name-row { justify-content: center; }
      }
    `;
    document.head.appendChild(style);
  }

  function statBar(icon, label, val, color) {
    const v = clamp(Math.round(val), 0, 100);
    return `<div class="pet-stat">
      <div class="pet-stat-top"><span>${icon} ${label}</span><b>${v}%</b></div>
      <div class="pet-statbar"><i style="width:${v}%;background:${color}"></i></div>
    </div>`;
  }

  function renderPetModal() {
    if (window.__injectGardenStyle) window.__injectGardenStyle();
    injectPetStyle();

    const pet = ensurePet();
    const sp = speciesInfo(pet);
    const acc = accessoryInfo(pet);
    const stage = petStage(pet);
    const mood = MOODS[pet.mood] || MOODS.happy;
    const need = needExp(pet);
    const pct = Math.min(100, Math.round(((pet.exp || 0) / need) * 100));
    const level = pet.level || 1;

    const foods = Object.entries(FOODS).map(([id, f]) => {
      const count = (pet.food && pet.food[id]) || 0;
      return `<button class="pet-food" onclick="window.petActionFeed('${id}')" title="Cho ăn ${f.name}">
        <span class="ico">${f.icon}</span>
        <span style="flex:1;min-width:0"><b>${f.name}</b><small>+${f.exp} EXP · +${f.hunger} 🍖</small></span>
        <span class="cnt">${count > 0 ? "x" + count : f.price + "🪙"}</span>
      </button>`;
    }).join("");

    const accessories = Object.entries(ACCESSORIES).map(([id, a]) => {
      const owned = pet.ownedAccessories.includes(id);
      const equipped = pet.equipped === id;
      return `<button class="pet-acc-item ${owned ? "owned" : ""} ${equipped ? "equipped" : ""}" onclick="window.petToggleAccessory('${id}')">
        <span style="font-size:24px">${a.icon}</span>
        <span style="flex:1;min-width:0"><b>${a.name}</b><small>${owned ? (equipped ? "Đang đeo · bấm để bỏ" : "Đã sở hữu · bấm để đeo") : a.price + " 🪙 · " + a.desc}</small></span>
        ${equipped ? "✅" : ""}
      </button>`;
    }).join("");

    const achievements = ACHIEVEMENTS.map(a => {
      const done = a.check(pet);
      const claimed = !!pet.claimed[a.id];
      return `<div class="pet-ach">
        <span class="ach-ico">${a.icon}</span>
        <div class="ach-body"><b>${a.name}</b><small>${a.desc} · thưởng ${a.reward}🪙</small></div>
        ${claimed
          ? `<span class="gdn-tag" style="background:#c8e6c9;color:#2e7d32">Đã nhận ✅</span>`
          : done
            ? `<button class="gdn-btn-sm" style="background:#43a047" onclick="window.petClaimAchievement('${a.id}')">Nhận ${a.reward}🪙</button>`
            : `<span class="gdn-tag" style="background:#eceff1;color:#90a4ae">Chưa đạt</span>`}
      </div>`;
    }).join("");

    const milestones = MILESTONES.map(m => {
      const on = level >= m.lv;
      return `<span class="pet-chip ${on ? "on" : ""}">${on ? m.icon : "🔒"} ${m.name} · Lv ${m.lv}</span>`;
    }).join("");

    const lockIcon = (lv) => level >= lv ? "" : "🔒 ";

    const html = `
      <div class="gdn-wrap pet-wrap">
        <div class="gdn-hud pet-hud">
          <div class="gdn-hud-stats">
            <span style="font-size:26px;">🐾</span>
            <div>
              <div class="pet-title">VƯỜN THÚ CƯNG CỦA BÉ</div>
              <div class="pet-sub">Chăm sóc · dạy học · tiến hóa cùng bé</div>
            </div>
          </div>
          <div class="gdn-actions">
            <button class="gdn-btn-sm" style="background:#43a047;" onclick="window.garden()">🌸 Vườn hoa</button>
            <button class="gdn-btn-sm" style="background:#546e7a;" onclick="close_()">✕ Đóng</button>
          </div>
        </div>

        <div class="pet-hero">
          <div class="pet-avatar">${sp.icon}${acc ? `<span class="pet-acc">${acc.icon}</span>` : ""}</div>
          <div class="pet-hero-info">
            <div class="pet-name-row">
              <span class="pet-name">${pet.name}</span>
              <button class="gdn-btn-sm" style="background:#ffb74d;padding:2px 8px;font-size:11px;" onclick="window.renamePetPrompt()">✏️ Đổi tên</button>
              <span class="pet-stage">${stage.icon} ${stage.name}</span>
            </div>
            <div class="pet-meta">Cấp <b>${level}</b> · ${petTitle(pet)} · ${mood.label} ${mood.emoji} · ❤️ ${pet.bonded}%</div>
            <div class="pet-exp-line"><span>EXP ${pet.exp} / ${need}</span><span>${Math.max(0, need - pet.exp)} EXP nữa lên cấp ${level + 1}</span></div>
            <div class="pet-expbar"><i style="width:${pct}%"></i></div>
          </div>
        </div>

        <div class="pet-stats-grid">
          ${statBar("🍖", "Độ no", pet.hunger, "linear-gradient(90deg,#ff8a65,#ff5722)")}
          ${statBar("😊", "Vui vẻ", pet.happy, "linear-gradient(90deg,#ffd54f,#ffb300)")}
          ${statBar("🫧", "Sạch sẽ", pet.clean, "linear-gradient(90deg,#81d4fa,#0288d1)")}
          ${statBar("⚡", "Năng lượng", pet.energy, "linear-gradient(90deg,#aed581,#43a047)")}
        </div>

        <div class="pet-section">
          <div class="pet-section-title"><span>🍖 Cho ăn</span><small>Bấm món để cho ăn · hết thì mua ngay</small></div>
          <div class="pet-food-grid">${foods}</div>
          <div class="pet-note">💡 Có thể mua thức ăn rẻ hơn ở 🍔 Nhà ăn. Học bài và làm bài thi cũng giúp ${pet.name} nhận EXP!</div>
        </div>

        <div class="pet-section">
          <div class="pet-section-title"><span>🎮 Chăm sóc &amp; dạy học</span><small>Mở thêm khi lên cấp</small></div>
          <div class="pet-action-grid">
            <button class="pet-act" style="background:#42a5f5;box-shadow:0 3px 0 #1565c0" onclick="window.petActionPlay()">🎾 Chơi đùa<small>-10⚡ · +25 EXP · +5% ❤️</small></button>
            <button class="pet-act ${level < 3 ? "locked" : ""}" style="background:#26a69a;box-shadow:0 3px 0 #00695c" onclick="window.petActionWash()">${lockIcon(3)}🛁 Tắm rửa<small>+15 EXP · +30% 🫧</small></button>
            <button class="pet-act ${level < 4 ? "locked" : ""}" style="background:#7e57c2;box-shadow:0 3px 0 #4527a0" onclick="window.petActionTeach()">${lockIcon(4)}📚 Dạy học<small>Trả lời đúng +40 EXP</small></button>
            <button class="pet-act" style="background:#ab47bc;box-shadow:0 3px 0 #6a1b9a" onclick="window.petActionRest()">💤 Nghỉ ngơi<small>+25⚡ cho bé · +30⚡ thú cưng</small></button>
          </div>
        </div>

        <div class="pet-section">
          <div class="pet-section-title"><span>🎀 Phụ kiện</span><small>${level < 5 ? `🔒 Mở ở cấp 5` : "Bấm để mua / đeo"}</small></div>
          <div class="pet-acc-grid">${accessories}</div>
        </div>

        <div class="pet-section">
          <div class="pet-section-title"><span>🏅 Thành tựu</span><small>Nhận thưởng coin</small></div>
          ${achievements}
        </div>

        <div class="pet-section">
          <div class="pet-section-title"><span>🔓 Mốc tính năng</span><small>Cấp ${level} / 20</small></div>
          <div class="pet-chip-row">${milestones}</div>
        </div>

        <div class="pet-sync">☁️ Cấp ${level} · ${pet.exp} EXP của ${pet.name} được lưu vào tài khoản (backend) mỗi khi thay đổi.</div>
      </div>
    `;

    modal(html);
  }

  /* ── Hành động chăm sóc ── */
  window.petActionFeed = function (foodId) {
    const pet = ensurePet();
    let id = foodId;
    if (!id) id = Object.keys(FOODS).find(k => (pet.food[k] || 0) > 0) || "bone";
    const f = FOODS[id];
    if (!f) return;

    const count = pet.food[id] || 0;
    if (count <= 0) {
      if (S.coins < f.price) {
        toast(`🪙 Cần ${f.price} coin để mua ${f.name}!`);
        return;
      }
      S.coins -= f.price;
      toast(`🛒 Đã mua ${f.icon} ${f.name} (-${f.price}🪙)`);
    } else {
      pet.food[id] = count - 1;
    }

    pet.exp = (pet.exp || 0) + f.exp;
    pet.hunger = clamp((pet.hunger ?? 80) + f.hunger, 0, 100);
    pet.happy = clamp((pet.happy ?? 80) + 6, 0, 100);
    pet.energy = clamp((pet.energy ?? 80) + (f.energy || 0), 0, 100);
    pet.bonded = clamp((pet.bonded || 0) + f.bond, 0, 100);
    pet.totalFeeds = (pet.totalFeeds || 0) + 1;
    pet.lastCareAt = Date.now();
    pet.mood = "excited";

    levelUp(pet);
    savePet(pet);
    if (typeof prog === "function") prog("pet");
    pop(`+${f.exp} EXP ${f.icon}`);
    toast(`${f.icon} ${pet.name} ăn ${f.name} ngon lành! +${f.exp} EXP, +${f.bond}% ❤️`);
    renderPetModal();
  };

  window.petActionPlay = function () {
    const pet = ensurePet();
    if (!requireLevel(pet, 2, "Chơi đùa")) return;
    if (S.en < 10) {
      toast("⚡ Bạn đã hết năng lượng! Hãy nghỉ ngơi hoặc ăn uống tại Nhà ăn!");
      return;
    }
    S.en -= 10;
    const exp = 25 + Math.floor((pet.level || 1) * 1.5);
    pet.exp = (pet.exp || 0) + exp;
    pet.happy = clamp((pet.happy ?? 80) + 15, 0, 100);
    pet.energy = clamp((pet.energy ?? 80) - 10, 0, 100);
    pet.bonded = clamp((pet.bonded || 0) + 5, 0, 100);
    pet.totalPlays = (pet.totalPlays || 0) + 1;
    pet.lastCareAt = Date.now();
    pet.mood = "happy";
    levelUp(pet);
    savePet(pet);
    if (typeof prog === "function") prog("pet");
    pop(`+${exp} EXP 🎾`);
    toast(`🎾 Bạn cùng ${pet.name} chơi bóng thật vui! (+${exp} EXP, +5% ❤️)`);
    renderPetModal();
  };

  window.petActionWash = function () {
    const pet = ensurePet();
    if (!requireLevel(pet, 3, "Tắm rửa")) return;
    pet.exp = (pet.exp || 0) + 15;
    pet.clean = clamp((pet.clean ?? 80) + 35, 0, 100);
    pet.happy = clamp((pet.happy ?? 80) + 8, 0, 100);
    pet.totalWashes = (pet.totalWashes || 0) + 1;
    pet.lastCareAt = Date.now();
    pet.mood = "excited";
    levelUp(pet);
    savePet(pet);
    if (typeof prog === "function") prog("pet");
    pop("+15 EXP 🛁");
    toast(`🛁 ${pet.name} đã được tắm rửa sạch sẽ, thơm tho! (+15 EXP)`);
    renderPetModal();
  };

  window.petActionRest = function () {
    S.en = Math.min(100, S.en + 25);
    const pet = ensurePet();
    pet.exp = (pet.exp || 0) + 8;
    pet.energy = clamp((pet.energy ?? 80) + 30, 0, 100);
    pet.happy = clamp((pet.happy ?? 80) + 3, 0, 100);
    pet.lastCareAt = Date.now();
    levelUp(pet);
    savePet(pet);
    pop("+25 ⚡");
    toast(`💤 Cả bạn và ${pet.name} đã nghỉ ngơi thật ngon! (+25⚡, +8 EXP)`);
    renderPetModal();
  };

  window.petActionTeach = function () {
    const pet = ensurePet();
    if (!requireLevel(pet, 4, "Dạy học")) return;
    const bank = window.__gardenMathQuestions || [
      { q: "12 + 8 = ?", o: ["18", "20", "22", "19"], a: 1 },
      { q: "6 × 7 = ?", o: ["42", "48", "36", "44"], a: 0 },
      { q: "56 ÷ 8 = ?", o: ["6", "8", "7", "9"], a: 2 }
    ];
    const q = bank[Math.floor(Math.random() * bank.length)];
    currentTeach = q;
    modal(`
      <div class="gdn-wrap pet-wrap">
        <div class="gdn-hud pet-hud">
          <div class="gdn-hud-stats">
            <span style="font-size:24px;">📚</span>
            <div><div class="pet-title">DẠY ${pet.name.toUpperCase()} HỌC</div><div class="pet-sub">Trả lời đúng để bé nhận +40 EXP</div></div>
          </div>
          <button class="gdn-btn-sm" style="background:#546e7a;" onclick="window.petGarden()">← Quay lại</button>
        </div>
        <div class="pet-quiz">${q.q}</div>
        <div class="pet-quiz-opts">
          ${q.o.map((o, i) => `<button onclick="window.petTeachAnswer(${i})">${o}</button>`).join("")}
        </div>
      </div>
    `);
  };

  window.petTeachAnswer = function (i) {
    const pet = ensurePet();
    const q = currentTeach;
    if (!q) return;
    if (i === q.a) {
      pet.exp = (pet.exp || 0) + 40;
      pet.bonded = clamp((pet.bonded || 0) + 4, 0, 100);
      pet.happy = clamp((pet.happy ?? 80) + 10, 0, 100);
      pet.mood = "excited";
      levelUp(pet);
      savePet(pet);
      pop("+40 EXP 📚");
      toast(`📚 ${pet.name} hiểu bài rồi! +40 EXP, +4% ❤️`);
    } else {
      pet.exp = (pet.exp || 0) + 10;
      savePet(pet);
      toast(`💡 Chưa đúng, nhưng ${pet.name} vẫn học được +10 EXP!`);
    }
    setTimeout(renderPetModal, 700);
  };

  window.petToggleAccessory = function (id) {
    const pet = ensurePet();
    if (!requireLevel(pet, 5, "Phụ kiện")) return;
    const a = ACCESSORIES[id];
    if (!a) return;

    if (pet.ownedAccessories.includes(id)) {
      pet.equipped = pet.equipped === id ? "" : id;
      savePet(pet);
      renderPetModal();
      return;
    }
    if (S.coins < a.price) {
      toast(`🪙 Cần ${a.price} coin để mua ${a.name}!`);
      return;
    }
    S.coins -= a.price;
    pet.ownedAccessories.push(id);
    pet.equipped = id;
    pet.bonded = clamp((pet.bonded || 0) + a.bond, 0, 100);
    savePet(pet);
    toast(`🎀 Đã mua và đeo ${a.icon} ${a.name} cho ${pet.name}!`);
    renderPetModal();
  };

  window.petClaimAchievement = function (id) {
    const pet = ensurePet();
    const a = ACHIEVEMENTS.find(x => x.id === id);
    if (!a || pet.claimed[id] || !a.check(pet)) return;
    pet.claimed[id] = true;
    S.coins += a.reward;
    savePet(pet);
    pop(`+${a.reward}🪙`);
    toast(`🏅 Thành tựu "${a.name}"! +${a.reward}🪙`);
    renderPetModal();
  };

  window.renamePetPrompt = function () {
    const pet = ensurePet();
    const newName = prompt(`Nhập tên mới cho ${pet.name}:`, pet.name);
    if (newName && newName.trim() && newName.trim() !== pet.name) {
      pet.name = newName.trim().slice(0, 16);
      savePet(pet);
      toast(`Đã đổi tên thú cưng thành "${pet.name}"!`);
      renderPetModal();
    }
  };

  window.petGarden = function () {
    if (window.__gardenStopTimer) window.__gardenStopTimer();
    renderPetModal();
  };

  updateHud();
})();
