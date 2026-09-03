import { getCollection } from "../db.js";

const DEFAULT_PLANT_TYPES = [
  { id: "sunflower", name: "Hoa hướng dương", icon: "sunflower", stages: 3, growthTime: 300000, harvestCoin: 20, seedPrice: 5, rarity: "common", palette: { stem: "#5B8C3A", leaf: "#7CB342", leafDark: "#4C7A2A", accent: "#F4B93E", accentLight: "#FFE08A", accentDark: "#C97F17" } },
  { id: "rose", name: "Hoa hồng", icon: "rose", stages: 3, growthTime: 600000, harvestCoin: 30, seedPrice: 10, rarity: "common", palette: { stem: "#4E7D3B", leaf: "#6FA84D", leafDark: "#3E6630", accent: "#E0486B", accentLight: "#F4A0B4", accentDark: "#A8254A" } },
  { id: "cactus", name: "Xương rồng", icon: "cactus", stages: 3, growthTime: 1200000, harvestCoin: 35, seedPrice: 12, rarity: "common", palette: { stem: "#3E8E5B", leaf: "#57A873", leafDark: "#2C6B41", accent: "#E792B5", accentLight: "#FBD3E4", accentDark: "#B85685" } },
  { id: "apple", name: "Cây táo", icon: "apple", stages: 4, growthTime: 1800000, harvestCoin: 50, seedPrice: 15, rarity: "common", palette: { stem: "#7A5230", leaf: "#4E8B3C", leafDark: "#356428", accent: "#D6483C", accentLight: "#F0847A", accentDark: "#A32A20" } },
  { id: "bamboo", name: "Cây tre", icon: "bamboo", stages: 3, growthTime: 3600000, harvestCoin: 80, seedPrice: 25, rarity: "rare", palette: { stem: "#6FAE4A", leaf: "#8FCB5C", leafDark: "#4E8536", accent: "#8FCB5C", accentLight: "#C6E8A0", accentDark: "#3F6B2A" } },
  { id: "cherry", name: "Cây anh đào", icon: "cherry", stages: 3, growthTime: 7200000, harvestCoin: 120, seedPrice: 40, rarity: "rare", palette: { stem: "#6B4A34", leaf: "#7CB342", leafDark: "#578A2E", accent: "#F3A6C6", accentLight: "#FFE1EE", accentDark: "#D4679A" } },
  { id: "watermelon", name: "Dưa hấu", icon: "watermelon", stages: 3, growthTime: 10800000, harvestCoin: 150, seedPrice: 45, rarity: "rare", palette: { stem: "#4C8A3C", leaf: "#5FA347", leafDark: "#3B7030", accent: "#3E9B4F", accentLight: "#DDF3D8", accentDark: "#1F5C2A", flesh: "#E9556B" } },
  { id: "coconut", name: "Cây dừa", icon: "coconut", stages: 4, growthTime: 28800000, harvestCoin: 350, seedPrice: 100, rarity: "epic", palette: { stem: "#8A6B3F", leaf: "#4E9B4C", leafDark: "#31753A", accent: "#8B6A46", accentLight: "#C7A876", accentDark: "#5C4326" } },
  { id: "oak", name: "Cây cổ thụ", icon: "oak", stages: 3, growthTime: 43200000, harvestCoin: 500, seedPrice: 150, rarity: "epic", palette: { stem: "#6E4E30", leaf: "#3E6B32", leafDark: "#2A4E24", accent: "#3E6B32", accentLight: "#5C8B4C", accentDark: "#20381C" } },
  { id: "magic", name: "Cây thần kỳ", icon: "magic", stages: 4, growthTime: 86400000, harvestCoin: 1000, seedPrice: 400, rarity: "legendary", palette: { stem: "#8A5CC4", leaf: "#B27FE0", leafDark: "#6B3FA0", accent: "#7FD8E8", accentLight: "#F4A6E0", accentDark: "#5C3FA0" } },
  { id: "golden", name: "Cây vàng", icon: "golden", stages: 4, growthTime: 172800000, harvestCoin: 2500, seedPrice: 800, rarity: "legendary", palette: { stem: "#B8862F", leaf: "#E0B24A", leafDark: "#8C641F", accent: "#FFD866", accentLight: "#FFF1C2", accentDark: "#A8760F" } },
];

export async function initPlantTypes() {
  const col = getCollection("plantTypes");
  const count = await col.countDocuments();
  if (count === 0) {
    await col.insertMany(DEFAULT_PLANT_TYPES);
    console.log(`[plantTypes] Seeded ${DEFAULT_PLANT_TYPES.length} default types`);
  }
}

export async function getAllPlantTypes() {
  const col = getCollection("plantTypes");
  return col.find({}).sort({ seedPrice: 1 }).toArray();
}

export async function getPlantType(id) {
  const col = getCollection("plantTypes");
  return col.findOne({ id });
}

export async function createPlantType(data) {
  const col = getCollection("plantTypes");
  const existing = await col.findOne({ id: data.id });
  if (existing) throw new Error("ID đã tồn tại");
  await col.insertOne(data);
  return data;
}

export async function updatePlantType(id, data) {
  const col = getCollection("plantTypes");
  const { _id, ...updateData } = data;
  const result = await col.findOneAndUpdate({ id }, { $set: updateData }, { returnDocument: "after" });
  if (!result) throw new Error("Không tìm thấy loại cây");
  return result;
}

export async function deletePlantType(id) {
  const col = getCollection("plantTypes");
  const result = await col.deleteOne({ id });
  if (result.deletedCount === 0) throw new Error("Không tìm thấy loại cây");
  return { success: true };
}
