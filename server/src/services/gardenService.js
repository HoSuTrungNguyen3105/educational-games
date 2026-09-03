import { getCollection } from "../db.js";
import { addCoins } from "./authService.js";

const GARDEN_SIZE = 12;

async function getPlantTypeMap() {
  const col = getCollection("plantTypes");
  const types = await col.find({}).toArray();
  const map = {};
  for (const t of types) map[t.id] = t;
  return map;
}

function calcProgress(plant, plantType) {
  const elapsed = Date.now() - new Date(plant.plantedAt).getTime();
  const growthTime = plantType?.growthTime || 300000;
  return Math.min(100, Math.round((elapsed / growthTime) * 100));
}

function ensureSlots(garden) {
  if (!garden.slots) garden.slots = [];
  while (garden.slots.length < GARDEN_SIZE) {
    garden.slots.push({ index: garden.slots.length, plant: null });
  }
}

export async function getGarden(userId) {
  const col = getCollection("gardens");
  let garden = await col.findOne({ userId });
  if (!garden) {
    garden = { userId, slots: [], createdAt: new Date().toISOString() };
    ensureSlots(garden);
    await col.insertOne(garden);
  }
  ensureSlots(garden);

  const typeMap = await getPlantTypeMap();

  const slots = garden.slots.map(slot => {
    if (!slot.plant) return { index: slot.index, plant: null };
    const pt = typeMap[slot.plant.plantType];
    const progress = calcProgress(slot.plant, pt);
    return {
      index: slot.index,
      plant: {
        id: slot.plant.id,
        plantType: slot.plant.plantType,
        plantedAt: slot.plant.plantedAt,
        waterCount: slot.plant.waterCount || 0,
        progress,
        isReady: progress >= 100,
      },
    };
  });

  return { slots };
}

export async function plantTree(userId, slotIndex, plantType) {
  const typeMap = await getPlantTypeMap();
  const type = typeMap[plantType];
  if (!type) throw new Error("Loại hạt giống không hợp lệ");
  if (slotIndex < 0 || slotIndex >= GARDEN_SIZE) throw new Error("Vị trí không hợp lệ");

  const userCol = getCollection("users");
  const user = await userCol.findOne({ id: userId });
  if (!user) throw new Error("Không tìm thấy người dùng");
  if ((user.coins || 0) < type.seedPrice) throw new Error("Không đủ xu để mua hạt giống");

  const col = getCollection("gardens");
  let garden = await col.findOne({ userId });
  if (!garden) {
    garden = { userId, slots: [], createdAt: new Date().toISOString() };
    ensureSlots(garden);
    await col.insertOne(garden);
  }
  ensureSlots(garden);

  const slot = garden.slots[slotIndex];
  if (!slot) throw new Error("Vị trí không tồn tại");
  if (slot.plant) throw new Error("Vị trí này đã có cây");

  await addCoins(userId, -type.seedPrice);

  const plantId = `plant_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const plant = {
    id: plantId,
    plantType,
    plantedAt: new Date().toISOString(),
    waterCount: 0,
  };

  garden.slots[slotIndex].plant = plant;
  await col.updateOne({ userId }, { $set: { slots: garden.slots } });

  return {
    success: true,
    plant: { ...plant, progress: 0, isReady: false },
  };
}

export async function harvestTree(userId, slotIndex) {
  if (slotIndex < 0 || slotIndex >= GARDEN_SIZE) throw new Error("Vị trí không hợp lệ");

  const col = getCollection("gardens");
  const garden = await col.findOne({ userId });
  if (!garden) throw new Error("Không tìm thấy khu vườn");

  const slot = garden.slots[slotIndex];
  if (!slot || !slot.plant) throw new Error("Không có cây ở vị trí này");

  const typeMap = await getPlantTypeMap();
  const type = typeMap[slot.plant.plantType];
  if (!type) throw new Error("Loại cây không hợp lệ");

  const progress = calcProgress(slot.plant, type);
  if (progress < 100) throw new Error("Cây chưa trưởng thành");

  const coinReward = type.harvestCoin;
  await addCoins(userId, coinReward);

  const harvestedType = slot.plant.plantType;
  garden.slots[slotIndex].plant = null;
  await col.updateOne({ userId }, { $set: { slots: garden.slots } });

  return { success: true, coinReward, plantType: harvestedType };
}

export async function removeTree(userId, slotIndex) {
  if (slotIndex < 0 || slotIndex >= GARDEN_SIZE) throw new Error("Vị trí không hợp lệ");

  const col = getCollection("gardens");
  const garden = await col.findOne({ userId });
  if (!garden) throw new Error("Không tìm thấy khu vườn");

  const slot = garden.slots[slotIndex];
  if (!slot || !slot.plant) throw new Error("Không có cây ở vị trí này");

  garden.slots[slotIndex].plant = null;
  await col.updateOne({ userId }, { $set: { slots: garden.slots } });

  return { success: true };
}

export async function waterTree(userId, slotIndex) {
  if (slotIndex < 0 || slotIndex >= GARDEN_SIZE) throw new Error("Vị trí không hợp lệ");

  const col = getCollection("gardens");
  const garden = await col.findOne({ userId });
  if (!garden) throw new Error("Không tìm thấy khu vườn");

  const slot = garden.slots[slotIndex];
  if (!slot || !slot.plant) throw new Error("Không có cây ở vị trí này");

  const typeMap = await getPlantTypeMap();
  const type = typeMap[slot.plant.plantType];
  if (!type) throw new Error("Loại cây không hợp lệ");

  const progress = calcProgress(slot.plant, type);
  if (progress >= 100) throw new Error("Cây đã trưởng thành, hãy thu hoạch");

  const bonusTime = (type.growthTime || 300000) * 0.1;
  const currentElapsed = Date.now() - new Date(slot.plant.plantedAt).getTime();
  const newPlantedAt = new Date(Date.now() - currentElapsed - bonusTime).toISOString();

  slot.plant.plantedAt = newPlantedAt;
  slot.plant.waterCount = (slot.plant.waterCount || 0) + 1;

  await col.updateOne({ userId }, { $set: { slots: garden.slots } });

  const newProgress = calcProgress(slot.plant, type);

  return {
    success: true,
    progress: newProgress,
    waterCount: slot.plant.waterCount,
  };
}
