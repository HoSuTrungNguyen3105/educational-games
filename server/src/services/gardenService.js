import { getCollection } from "../db.js";
import { addCoins } from "./authService.js";

const TREE_TYPES = [
  { id: "sunflower", name: "Hoa hướng dương", icon: "🌻", growthTime: 5 * 60 * 1000, harvestCoin: 20, seedPrice: 5, rarity: "common", stages: ["🌱", "🌿", "🌻"] },
  { id: "apple", name: "Cây táo", icon: "🍎", growthTime: 30 * 60 * 1000, harvestCoin: 50, seedPrice: 15, rarity: "common", stages: ["🌱", "🌿", "🌳", "🍎"] },
  { id: "cherry", name: "Cây anh đào", icon: "🌸", growthTime: 2 * 60 * 60 * 1000, harvestCoin: 120, seedPrice: 40, rarity: "rare", stages: ["🌱", "🌿", "🌸"] },
  { id: "oak", name: "Cây cổ thụ", icon: "🌳", growthTime: 12 * 60 * 60 * 1000, harvestCoin: 500, seedPrice: 150, rarity: "epic", stages: ["🌱", "🌿", "🌳"] },
  { id: "magic", name: "Cây thần kỳ", icon: "🌈", growthTime: 24 * 60 * 60 * 1000, harvestCoin: 1000, seedPrice: 400, rarity: "legendary", stages: ["🌱", "🌿", "✨", "🌈"] },
];

const GARDEN_SIZE = 12;

function getTreeType(treeId) {
  return TREE_TYPES.find(t => t.id === treeId);
}

function calcStage(tree) {
  const type = getTreeType(tree.treeType);
  if (!type) return 0;
  const elapsed = Date.now() - new Date(tree.plantedAt).getTime();
  const progress = Math.min(1, elapsed / type.growthTime);
  const stageCount = type.stages.length;
  if (progress >= 1) return stageCount - 1;
  return Math.floor(progress * (stageCount - 1));
}

function calcProgress(tree) {
  const type = getTreeType(tree.treeType);
  if (!type) return 0;
  const elapsed = Date.now() - new Date(tree.plantedAt).getTime();
  return Math.min(100, Math.round((elapsed / type.growthTime) * 100));
}

export function getTreeTypes() {
  return TREE_TYPES.map(t => ({
    id: t.id, name: t.name, icon: t.icon, growthTime: t.growthTime,
    harvestCoin: t.harvestCoin, seedPrice: t.seedPrice, rarity: t.rarity,
    stages: t.stages,
  }));
}

export async function getGarden(userId) {
  const col = getCollection("gardens");
  let garden = await col.findOne({ userId });
  if (!garden) {
    garden = { userId, slots: [], coins: 0, createdAt: new Date().toISOString() };
    for (let i = 0; i < GARDEN_SIZE; i++) {
      garden.slots.push({ index: i, tree: null });
    }
    await col.insertOne(garden);
  }
  if (!garden.slots || garden.slots.length < GARDEN_SIZE) {
    while (garden.slots.length < GARDEN_SIZE) {
      garden.slots.push({ index: garden.slots.length, tree: null });
    }
    await col.updateOne({ userId }, { $set: { slots: garden.slots } });
  }
  const enrichedSlots = garden.slots.map(slot => {
    if (!slot.tree) return slot;
    const type = getTreeType(slot.tree.treeType);
    const stage = calcStage(slot.tree);
    const progress = calcProgress(slot.tree);
    const isReady = progress >= 100;
    return {
      ...slot,
      tree: {
        ...slot.tree,
        stage,
        stageIcon: type ? type.stages[stage] : "🌱",
        progress,
        isReady,
        treeName: type ? type.name : "",
        harvestCoin: type ? type.harvestCoin : 0,
      },
    };
  });
  return { slots: enrichedSlots };
}

export async function plantTree(userId, slotIndex, treeType) {
  const type = getTreeType(treeType);
  if (!type) throw new Error("Loại cây không hợp lệ");
  if (slotIndex < 0 || slotIndex >= GARDEN_SIZE) throw new Error("Vị trí không hợp lệ");

  const userCol = getCollection("users");
  const user = await userCol.findOne({ id: userId });
  if (!user) throw new Error("Không tìm thấy người dùng");
  if ((user.coins || 0) < type.seedPrice) throw new Error("Không đủ xu để mua hạt giống");

  const col = getCollection("gardens");
  let garden = await col.findOne({ userId });
  if (!garden) {
    garden = { userId, slots: [], coins: 0, createdAt: new Date().toISOString() };
    for (let i = 0; i < GARDEN_SIZE; i++) {
      garden.slots.push({ index: i, tree: null });
    }
    await col.insertOne(garden);
  }

  const slot = garden.slots[slotIndex];
  if (!slot) throw new Error("Vị trí không tồn tại");
  if (slot.tree) throw new Error("Vị trí này đã có cây");

  await addCoins(userId, -type.seedPrice);

  const newTree = {
    treeType,
    plantedAt: new Date().toISOString(),
    waterCount: 0,
  };

  garden.slots[slotIndex].tree = newTree;
  await col.updateOne({ userId }, { $set: { slots: garden.slots } });

  return { success: true, tree: { ...newTree, stage: 0, stageIcon: type.stages[0], progress: 0, isReady: false } };
}

export async function harvestTree(userId, slotIndex) {
  if (slotIndex < 0 || slotIndex >= GARDEN_SIZE) throw new Error("Vị trí không hợp lệ");

  const col = getCollection("gardens");
  const garden = await col.findOne({ userId });
  if (!garden) throw new Error("Không tìm thấy khu vườn");

  const slot = garden.slots[slotIndex];
  if (!slot || !slot.tree) throw new Error("Không có cây ở vị trí này");

  const type = getTreeType(slot.tree.treeType);
  if (!type) throw new Error("Loại cây không hợp lệ");

  const progress = calcProgress(slot.tree);
  if (progress < 100) throw new Error("Cây chưa trưởng thành");

  const coinReward = type.harvestCoin;
  await addCoins(userId, coinReward);

  garden.slots[slotIndex].tree = null;
  await col.updateOne({ userId }, { $set: { slots: garden.slots } });

  return { success: true, coinReward, treeType: slot.tree.treeType };
}

export async function removeTree(userId, slotIndex) {
  if (slotIndex < 0 || slotIndex >= GARDEN_SIZE) throw new Error("Vị trí không hợp lệ");

  const col = getCollection("gardens");
  const garden = await col.findOne({ userId });
  if (!garden) throw new Error("Không tìm thấy khu vườn");

  const slot = garden.slots[slotIndex];
  if (!slot || !slot.tree) throw new Error("Không có cây ở vị trí này");

  garden.slots[slotIndex].tree = null;
  await col.updateOne({ userId }, { $set: { slots: garden.slots } });

  return { success: true };
}

export async function waterTree(userId, slotIndex) {
  if (slotIndex < 0 || slotIndex >= GARDEN_SIZE) throw new Error("Vị trí không hợp lệ");

  const col = getCollection("gardens");
  const garden = await col.findOne({ userId });
  if (!garden) throw new Error("Không tìm thấy khu vườn");

  const slot = garden.slots[slotIndex];
  if (!slot || !slot.tree) throw new Error("Không có cây ở vị trí này");

  const type = getTreeType(slot.tree.treeType);
  if (!type) throw new Error("Loại cây không hợp lệ");

  const progress = calcProgress(slot.tree);
  if (progress >= 100) throw new Error("Cây đã trưởng thành, hãy thu hoạch");

  const bonusTime = type.growthTime * 0.1;
  const currentElapsed = Date.now() - new Date(slot.tree.plantedAt).getTime();
  const newPlantedAt = new Date(Date.now() - currentElapsed - bonusTime).toISOString();

  slot.tree.plantedAt = newPlantedAt;
  slot.tree.waterCount = (slot.tree.waterCount || 0) + 1;

  await col.updateOne({ userId }, { $set: { slots: garden.slots } });

  const newProgress = calcProgress(slot.tree);
  const newStage = calcStage(slot.tree);

  return {
    success: true,
    progress: newProgress,
    stage: newStage,
    stageIcon: type.stages[newStage],
    waterCount: slot.tree.waterCount,
  };
}
