import Phaser from 'phaser';

// ── Isometric helpers ──
const TILE_W = 64;
const TILE_H = 32;
const WORLD_COLS = 60;
const WORLD_ROWS = 60;
const ORIGIN_X = 0;
const ORIGIN_Y = 0;

function isoToScreen(gx, gy) {
  return {
    x: (gx - gy) * (TILE_W / 2) + ORIGIN_X,
    y: (gx + gy) * (TILE_H / 2) + ORIGIN_Y,
  };
}

function screenToIso(sx, sy) {
  const ax = sx - ORIGIN_X;
  const ay = sy - ORIGIN_Y;
  return {
    gx: (ax / (TILE_W / 2) + ay / (TILE_H / 2)) / 2,
    gy: (ay / (TILE_H / 2) - ax / (TILE_W / 2)) / 2,
  };
}

// Seeded random for deterministic map
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Farm positions (matching original) ──
const FARM_POS = [
  { gx: -5, gy: 8, cols: 4, rows: 3 },
  { gx: 2, gy: 12, cols: 3, rows: 3 },
];

const BUILDING_POS = {
  blacksmith: { gx: 5, gy: 2 },
  market: { gx: 6, gy: 8 },
};

const NPC_DATA = [
  { gx: 4.5, gy: 0.5, emoji: '👨‍🔧', name: 'Thợ rèn', color: 0x7c3aed },
  { gx: 5.5, gy: 6.5, emoji: '🧑‍🌾', name: 'Thương nhân', color: 0x16a34a },
];

// ── Generate all textures procedurally ──
function generateTextures(scene) {
  // Grass tile
  createIsoTile(scene, 'tile_grass', TILE_W, TILE_H, 0x7ec850, 0x6ab840);
  createIsoTile(scene, 'tile_grass2', TILE_W, TILE_H, 0x72c048, 0x62b03c);
  createIsoTile(scene, 'tile_dirt', TILE_W, TILE_H, 0x8b6c42, 0x7a5c32);
  createIsoTile(scene, 'tile_path', TILE_W, TILE_H, 0xc4a265, 0xb49255);
  createIsoTile(scene, 'tile_water', TILE_W, TILE_H, 0x5b9bd5, 0x4b8bc5);
  createIsoTile(scene, 'tile_water2', TILE_W, TILE_H, 0x4b8bc5, 0x3b7bb5);
  createIsoTile(scene, 'tile_stone', TILE_W, TILE_H, 0xa0a8b4, 0x90989f);
  createIsoTile(scene, 'tile_farm_dirt', TILE_W, TILE_H, 0x6a4a2a, 0x5a3e22);

  // Farm cell (plowed)
  createIsoTile(scene, 'farm_cell', TILE_W - 4, TILE_H - 2, 0x5a3e1e, 0x4a3018);
  createIsoTile(scene, 'farm_cell_empty', TILE_W - 4, TILE_H - 2, 0x6a4a2a, 0x5a3e22);

  // Player character (isometric person)
  generatePlayerTexture(scene, 'player_idle', 0x4a90d9);
  generatePlayerTexture(scene, 'player_walk', 0x3a80c9);

  // Buildings
  generateHouse(scene);
  generateBlacksmith(scene);
  generateMarket(scene);

  // Trees
  generateTreePine(scene);
  generateTreeDeciduous(scene);

  // Bush
  generateBush(scene);

  // Rocks
  generateRock(scene);

  // Fence segment
  generateFence(scene);

  // Hay bale
  generateHay(scene);

  // Log
  generateLog(scene);

  // Sign post
  generateSignPost(scene);

  // Water lily
  generateWaterLily(scene);

  // NPC
  generateNPC(scene, 'npc_blacksmith', 0x7c3aed);
  generateNPC(scene, 'npc_merchant', 0x16a34a);

  // Crops (various stages)
  generateCropSeed(scene);
  generateCropGrowing(scene);
  generateCropBloom(scene);
  generateCropFruitTree(scene);

  // Sparkle
  generateSparkle(scene);

  // Empty farm indicator
  createCircleTexture(scene, 'farm_empty_indicator', 12, 0x3a2a10, 0.3);

  // Click highlight
  createCircleTexture(scene, 'click_highlight', 20, 0xffffff, 0.25);
}

function createIsoTile(scene, key, w, h, colorTop, colorSide) {
  const g = scene.add.graphics();
  // Top face (isometric diamond)
  g.fillStyle(colorTop, 1);
  g.beginPath();
  g.moveTo(w / 2, 0);
  g.lineTo(w, h / 2);
  g.lineTo(w / 2, h);
  g.lineTo(0, h / 2);
  g.closePath();
  g.fillPath();
  // Subtle edge (darken the color manually)
  const darkenAmount = 0.8;
  const r2 = ((colorTop >> 16) & 0xff) * darkenAmount;
  const g2 = ((colorTop >> 8) & 0xff) * darkenAmount;
  const b2 = (colorTop & 0xff) * darkenAmount;
  const darkColor = (Math.floor(r2) << 16) | (Math.floor(g2) << 8) | Math.floor(b2);
  g.lineStyle(1, darkColor, 0.3);
  g.beginPath();
  g.moveTo(w / 2, 0);
  g.lineTo(w, h / 2);
  g.lineTo(w / 2, h);
  g.lineTo(0, h / 2);
  g.closePath();
  g.strokePath();
  g.generateTexture(key, w, h);
  g.destroy();
}

function createCircleTexture(scene, key, r, color, alpha) {
  const g = scene.make.graphics({ add: false });
  g.fillStyle(color, alpha);
  g.fillCircle(r, r, r);
  g.generateTexture(key, r * 2, r * 2);
  g.destroy();
}

function generatePlayerTexture(scene, key, bodyColor) {
  const w = 48, h = 64;
  const g = scene.add.graphics();

  // Shadow
  g.fillStyle(0x000000, 0.2);
  g.fillEllipse(w / 2, h - 4, 22, 8);

  // Legs
  g.fillStyle(0x5a3e22);
  g.fillRoundedRect(w / 2 - 8, h - 22, 6, 16, 2);
  g.fillRoundedRect(w / 2 + 2, h - 22, 6, 16, 2);

  // Body (tunic)
  g.fillStyle(bodyColor);
  g.fillRoundedRect(w / 2 - 10, h - 38, 20, 18, 4);

  // Belt
  g.fillStyle(0x8a6a3f);
  g.fillRect(w / 2 - 10, h - 24, 20, 3);

  // Arms
  g.fillStyle(bodyColor);
  g.fillRoundedRect(w / 2 - 14, h - 36, 5, 14, 2);
  g.fillRoundedRect(w / 2 + 9, h - 36, 5, 14, 2);

  // Head
  g.fillStyle(0xf5c5a0);
  g.fillCircle(w / 2, h - 44, 9);

  // Hair
  g.fillStyle(0x5a3020);
  g.fillEllipse(w / 2, h - 48, 14, 8);

  // Eyes
  g.fillStyle(0x333333);
  g.fillCircle(w / 2 - 3, h - 44, 1.5);
  g.fillCircle(w / 2 + 3, h - 44, 1.5);

  g.generateTexture(key, w, h);
  g.destroy();
}

function generateHouse(scene) {
  const w = 128, h = 128;
  const g = scene.add.graphics();

  // Shadow
  g.fillStyle(0x000000, 0.15);
  g.fillEllipse(w / 2, h - 10, 90, 30);

  // Stone foundation (isometric base)
  g.fillStyle(0x8a8a8a);
  g.beginPath();
  g.moveTo(w / 2, h - 70);
  g.lineTo(w - 12, h - 42);
  g.lineTo(w / 2, h - 14);
  g.lineTo(12, h - 42);
  g.closePath();
  g.fillPath();

  // Front wall
  g.fillStyle(0xe8d5b8);
  g.beginPath();
  g.moveTo(w / 2, h - 70);
  g.lineTo(w / 2 + 48, h - 42);
  g.lineTo(w / 2 + 48, h - 20);
  g.lineTo(w / 2, h - 2);
  g.closePath();
  g.fillPath();

  // Right wall
  g.fillStyle(0xd4c0a0);
  g.beginPath();
  g.moveTo(w / 2, h - 70);
  g.lineTo(w / 2 - 48, h - 42);
  g.lineTo(w / 2 - 48, h - 20);
  g.lineTo(w / 2, h - 2);
  g.closePath();
  g.fillPath();

  // Roof (right side)
  g.fillStyle(0xc45a3a);
  g.beginPath();
  g.moveTo(w / 2, h - 85);
  g.lineTo(w / 2 + 52, h - 52);
  g.lineTo(w / 2 + 52, h - 42);
  g.lineTo(w / 2, h - 70);
  g.closePath();
  g.fillPath();

  // Roof (left side)
  g.fillStyle(0xb04a2a);
  g.beginPath();
  g.moveTo(w / 2, h - 85);
  g.lineTo(w / 2 - 52, h - 52);
  g.lineTo(w / 2 - 52, h - 42);
  g.lineTo(w / 2, h - 70);
  g.closePath();
  g.fillPath();

  // Door
  g.fillStyle(0x6a4a2a);
  g.fillRoundedRect(w / 2 - 8, h - 26, 16, 20, 3);

  // Door handle
  g.fillStyle(0xd4a030);
  g.fillCircle(w / 2 + 4, h - 16, 2);

  // Windows
  g.fillStyle(0xa0d4ff);
  g.fillRect(w / 2 + 18, h - 38, 12, 10);
  g.fillRect(w / 2 - 30, h - 38, 12, 10);

  // Window frames
  g.lineStyle(1.5, 0x6a4a2a);
  g.strokeRect(w / 2 + 18, h - 38, 12, 10);
  g.strokeRect(w / 2 - 30, h - 38, 12, 10);

  // Chimney
  g.fillStyle(0x8a6a4a);
  g.fillRect(w / 2 + 20, h - 90, 10, 20);
  g.fillStyle(0x9a7a5a);
  g.fillRect(w / 2 + 18, h - 92, 14, 4);

  g.generateTexture('building_house', w, h);
  g.destroy();
}

function generateBlacksmith(scene) {
  const w = 112, h = 112;
  const g = scene.add.graphics();

  // Shadow
  g.fillStyle(0x000000, 0.15);
  g.fillEllipse(w / 2, h - 8, 80, 26);

  // Base/walls
  g.fillStyle(0x8b4513);
  g.beginPath();
  g.moveTo(w / 2, h - 60);
  g.lineTo(w - 14, h - 38);
  g.lineTo(w / 2, h - 16);
  g.lineTo(14, h - 38);
  g.closePath();
  g.fillPath();

  // Front wall
  g.fillStyle(0xa0622a);
  g.beginPath();
  g.moveTo(w / 2, h - 60);
  g.lineTo(w / 2 + 40, h - 38);
  g.lineTo(w / 2 + 40, h - 22);
  g.lineTo(w / 2, h - 4);
  g.closePath();
  g.fillPath();

  // Left wall
  g.fillStyle(0x8a5220);
  g.beginPath();
  g.moveTo(w / 2, h - 60);
  g.lineTo(w / 2 - 40, h - 38);
  g.lineTo(w / 2 - 40, h - 22);
  g.lineTo(w / 2, h - 4);
  g.closePath();
  g.fillPath();

  // Roof
  g.fillStyle(0x555555);
  g.beginPath();
  g.moveTo(w / 2, h - 72);
  g.lineTo(w / 2 + 44, h - 44);
  g.lineTo(w / 2 + 44, h - 36);
  g.lineTo(w / 2, h - 60);
  g.closePath();
  g.fillPath();

  g.fillStyle(0x444444);
  g.beginPath();
  g.moveTo(w / 2, h - 72);
  g.lineTo(w / 2 - 44, h - 44);
  g.lineTo(w / 2 - 44, h - 36);
  g.lineTo(w / 2, h - 60);
  g.closePath();
  g.fillPath();

  // Furnace glow
  g.fillStyle(0xff6600, 0.7);
  g.fillCircle(w / 2 - 18, h - 30, 8);
  g.fillStyle(0xffaa00, 0.5);
  g.fillCircle(w / 2 - 18, h - 30, 5);

  // Door
  g.fillStyle(0x3a2a1a);
  g.fillRoundedRect(w / 2 - 6, h - 22, 14, 18, 3);

  // Anvil
  g.fillStyle(0x444444);
  g.fillRect(w / 2 + 14, h - 24, 14, 6);
  g.fillRect(w / 2 + 18, h - 30, 6, 8);

  g.generateTexture('building_blacksmith', w, h);
  g.destroy();
}

function generateMarket(scene) {
  const w = 112, h = 112;
  const g = scene.add.graphics();

  // Shadow
  g.fillStyle(0x000000, 0.15);
  g.fillEllipse(w / 2, h - 8, 80, 26);

  // Counter
  g.fillStyle(0x8b6c42);
  g.beginPath();
  g.moveTo(w / 2, h - 40);
  g.lineTo(w - 18, h - 24);
  g.lineTo(w / 2, h - 8);
  g.lineTo(18, h - 24);
  g.closePath();
  g.fillPath();

  // Counter top
  g.fillStyle(0xa07848);
  g.beginPath();
  g.moveTo(w / 2, h - 42);
  g.lineTo(w - 16, h - 26);
  g.lineTo(w / 2, h - 10);
  g.lineTo(16, h - 26);
  g.closePath();
  g.fillPath();

  // Awning poles
  g.fillStyle(0x8a6a3f);
  g.fillRect(w / 2 - 36, h - 65, 3, 40);
  g.fillRect(w / 2 + 33, h - 65, 3, 40);

  // Awning (striped)
  for (let i = 0; i < 7; i++) {
    g.fillStyle(i % 2 === 0 ? 0xe85050 : 0xffffff);
    g.beginPath();
    g.moveTo(w / 2 - 38 + i * 11, h - 65);
    g.lineTo(w / 2 - 28 + i * 11, h - 65);
    g.lineTo(w / 2 - 28 + i * 11 + 3, h - 48);
    g.lineTo(w / 2 - 38 + i * 11 + 3, h - 48);
    g.closePath();
    g.fillPath();
  }

  // Scalloped edge
  for (let i = 0; i < 7; i++) {
    g.fillStyle(i % 2 === 0 ? 0xffffff : 0xe85050);
    g.fillCircle(w / 2 - 35 + i * 11, h - 48, 4);
  }

  // Produce baskets
  g.fillStyle(0xc48a30);
  g.fillRoundedRect(w / 2 - 20, h - 28, 12, 8, 2);
  g.fillRoundedRect(w / 2 + 8, h - 28, 12, 8, 2);

  // Produce
  g.fillStyle(0xff4444);
  g.fillCircle(w / 2 - 14, h - 30, 4);
  g.fillStyle(0x44aa44);
  g.fillCircle(w / 2 + 14, h - 30, 4);

  g.generateTexture('building_market', w, h);
  g.destroy();
}

function generateTreePine(scene) {
  const w = 48, h = 80;
  const g = scene.add.graphics();

  // Shadow
  g.fillStyle(0x000000, 0.15);
  g.fillEllipse(w / 2, h - 4, 30, 10);

  // Trunk
  g.fillStyle(0x6a4a28);
  g.fillRect(w / 2 - 4, h - 28, 8, 24);

  // Foliage layers (cone-like)
  g.fillStyle(0x2d8a3e);
  g.fillTriangle(w / 2, h - 70, w / 2 - 18, h - 28, w / 2 + 18, h - 28);
  g.fillStyle(0x38a048);
  g.fillTriangle(w / 2, h - 60, w / 2 - 15, h - 22, w / 2 + 15, h - 22);
  g.fillStyle(0x45b855);
  g.fillTriangle(w / 2, h - 50, w / 2 - 12, h - 16, w / 2 + 12, h - 16);

  g.generateTexture('tree_pine', w, h);
  g.destroy();
}

function generateTreeDeciduous(scene) {
  const w = 56, h = 72;
  const g = scene.add.graphics();

  // Shadow
  g.fillStyle(0x000000, 0.15);
  g.fillEllipse(w / 2, h - 4, 36, 12);

  // Trunk
  g.fillStyle(0x7a5a32);
  g.fillRect(w / 2 - 4, h - 28, 8, 24);
  // Root flare
  g.fillStyle(0x6a4a28);
  g.fillEllipse(w / 2, h - 6, 12, 5);

  // Canopy (overlapping circles for a fluffy look)
  g.fillStyle(0x3aaa4a);
  g.fillCircle(w / 2, h - 42, 20);
  g.fillStyle(0x45bb55);
  g.fillCircle(w / 2 - 10, h - 36, 14);
  g.fillCircle(w / 2 + 10, h - 36, 14);
  g.fillStyle(0x50cc60);
  g.fillCircle(w / 2, h - 50, 12);

  g.generateTexture('tree_deciduous', w, h);
  g.destroy();
}

function generateBush(scene) {
  const w = 36, h = 28;
  const g = scene.add.graphics();

  g.fillStyle(0x000000, 0.1);
  g.fillEllipse(w / 2, h - 2, 24, 6);

  g.fillStyle(0x3a8a30);
  g.fillCircle(w / 2, h - 14, 12);
  g.fillStyle(0x48a838);
  g.fillCircle(w / 2 - 6, h - 12, 8);
  g.fillCircle(w / 2 + 6, h - 12, 8);

  // Small flowers
  g.fillStyle(0xff8888);
  g.fillCircle(w / 2 - 4, h - 18, 2);
  g.fillStyle(0xffff88);
  g.fillCircle(w / 2 + 5, h - 16, 2);

  g.generateTexture('bush', w, h);
  g.destroy();
}

function generateRock(scene) {
  const w = 32, h = 24;
  const g = scene.add.graphics();

  g.fillStyle(0x000000, 0.12);
  g.fillEllipse(w / 2, h - 3, 22, 7);

  g.fillStyle(0x8a8a8a);
  g.fillEllipse(w / 2, h - 10, 20, 12);
  g.fillStyle(0x9a9a9a);
  g.fillEllipse(w / 2 - 2, h - 12, 14, 8);

  g.generateTexture('rock', w, h);
  g.destroy();
}

function generateFence(scene) {
  const w = 48, h = 24;
  const g = scene.add.graphics();

  // Posts
  g.fillStyle(0x8a6a3f);
  g.fillRect(4, 4, 3, 16);
  g.fillRect(w - 7, 4, 3, 16);

  // Rails
  g.fillStyle(0xa07848);
  g.fillRect(4, 8, w - 8, 2.5);
  g.fillRect(4, 14, w - 8, 2.5);

  g.generateTexture('fence', w, h);
  g.destroy();
}

function generateHay(scene) {
  const w = 40, h = 32;
  const g = scene.add.graphics();

  g.fillStyle(0x000000, 0.1);
  g.fillEllipse(w / 2, h - 3, 30, 8);

  g.fillStyle(0xe8c850);
  g.fillRoundedRect(4, 6, w - 8, h - 12, 4);

  // Straps
  g.fillStyle(0xa88040);
  g.fillRect(4, 12, w - 8, 2);
  g.fillRect(4, 18, w - 8, 2);

  g.generateTexture('hay', w, h);
  g.destroy();
}

function generateLog(scene) {
  const w = 40, h = 20;
  const g = scene.add.graphics();

  g.fillStyle(0x000000, 0.1);
  g.fillEllipse(w / 2, h - 2, 30, 6);

  g.fillStyle(0x6a4a28);
  g.fillRoundedRect(2, 4, w - 4, 12, 6);

  // Wood ring on end
  g.fillStyle(0xc09a6a);
  g.fillCircle(w - 4, 10, 4);

  g.generateTexture('log', w, h);
  g.destroy();
}

function generateSignPost(scene) {
  const w = 32, h = 40;
  const g = scene.add.graphics();

  // Post
  g.fillStyle(0x5a3a18);
  g.fillRect(w / 2 - 2, 12, 4, 26);

  // Board
  g.fillStyle(0xd4a030);
  g.fillRoundedRect(w / 2 - 12, 4, 24, 12, 2);

  // Arrow
  g.fillStyle(0xd4a030);
  g.fillTriangle(w - 4, 10, w - 10, 6, w - 10, 14);

  g.generateTexture('signpost', w, h);
  g.destroy();
}

function generateWaterLily(scene) {
  const w = 24, h = 16;
  const g = scene.add.graphics();

  g.fillStyle(0x3a8a20);
  g.fillEllipse(w / 2, h / 2 + 2, 14, 8);

  // Flower
  g.fillStyle(0xffaacc);
  g.fillCircle(w / 2 + 2, h / 2 - 1, 4);
  g.fillStyle(0xff88aa);
  g.fillCircle(w / 2 + 2, h / 2 - 1, 2);

  g.generateTexture('waterlily', w, h);
  g.destroy();
}

function generateNPC(scene, key, color) {
  const w = 40, h = 56;
  const g = scene.add.graphics();

  // Shadow
  g.fillStyle(0x000000, 0.2);
  g.fillEllipse(w / 2, h - 4, 20, 8);

  // Body
  g.fillStyle(color);
  g.fillRoundedRect(w / 2 - 10, h - 32, 20, 16, 4);

  // Head
  g.fillStyle(0xf5c5a0);
  g.fillCircle(w / 2, h - 38, 8);

  // Hat
  g.fillStyle(color);
  g.fillEllipse(w / 2, h - 44, 16, 6);

  g.generateTexture(key, w, h);
  g.destroy();
}

function generateCropSeed(scene) {
  const w = 20, h = 20;
  const g = scene.add.graphics();

  // Small sprout
  g.fillStyle(0x6aaa30);
  g.fillRect(w / 2 - 1, h / 2 - 6, 2, 8);

  // Two tiny leaves
  g.fillStyle(0x80cc40);
  g.fillEllipse(w / 2 - 4, h / 2 - 4, 6, 3);
  g.fillEllipse(w / 2 + 4, h / 2 - 4, 6, 3);

  g.generateTexture('crop_seed', w, h);
  g.destroy();
}

function generateCropGrowing(scene) {
  const w = 24, h = 28;
  const g = scene.add.graphics();

  // Stem
  g.fillStyle(0x5a9a28);
  g.fillRect(w / 2 - 1, h / 2 - 8, 3, 14);

  // Leaves
  g.fillStyle(0x6abb38);
  g.fillEllipse(w / 2 - 6, h / 2 - 4, 8, 4);
  g.fillEllipse(w / 2 + 6, h / 2 - 4, 8, 4);
  g.fillStyle(0x55aa2a);
  g.fillEllipse(w / 2 - 4, h / 2 - 10, 7, 3);
  g.fillEllipse(w / 2 + 4, h / 2 - 10, 7, 3);

  // Bud
  g.fillStyle(0xaadd44);
  g.fillCircle(w / 2, h / 2 - 12, 3);

  g.generateTexture('crop_growing', w, h);
  g.destroy();
}

function generateCropBloom(scene) {
  const w = 32, h = 36;
  const g = scene.add.graphics();

  // Stem
  g.fillStyle(0x5a8a28);
  g.fillRect(w / 2 - 1.5, h / 2 - 4, 3, 16);

  // Leaves
  g.fillStyle(0x6aaa30);
  g.fillEllipse(w / 2 - 7, h / 2 + 2, 10, 5);
  g.fillEllipse(w / 2 + 7, h / 2 + 2, 10, 5);

  // Flower body (pumpkin-like)
  g.fillStyle(0xe87030);
  g.fillCircle(w / 2 - 4, h / 2 - 8, 6);
  g.fillCircle(w / 2 + 4, h / 2 - 8, 6);
  g.fillStyle(0xd05c20);
  g.fillCircle(w / 2, h / 2 - 10, 7);

  // Sparkle
  g.fillStyle(0xffe082);
  g.fillCircle(w / 2, h / 2 - 16, 2);

  g.generateTexture('crop_bloom', w, h);
  g.destroy();
}

function generateCropFruitTree(scene) {
  const w = 36, h = 44;
  const g = scene.add.graphics();

  // Trunk
  g.fillStyle(0x6a4a28);
  g.fillRect(w / 2 - 3, h / 2, 6, 16);

  // Canopy
  g.fillStyle(0x4a8a28);
  g.fillCircle(w / 2, h / 2 - 4, 14);

  // Fruits
  g.fillStyle(0xff4444);
  g.fillCircle(w / 2 - 6, h / 2 - 2, 3);
  g.fillCircle(w / 2 + 6, h / 2 - 6, 3);
  g.fillCircle(w / 2, h / 2 - 10, 3);

  // Sparkle
  g.fillStyle(0xffe082);
  g.fillCircle(w / 2, h / 2 - 18, 2);

  g.generateTexture('crop_fruittree', w, h);
  g.destroy();
}

function generateSparkle(scene) {
  const w = 12, h = 12;
  const g = scene.add.graphics();

  g.fillStyle(0xffe082);
  // Draw a star shape manually
  const cx = w / 2, cy = h / 2, outerR = 5, innerR = 2, points = 4;
  g.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    if (i === 0) g.moveTo(px, py);
    else g.lineTo(px, py);
  }
  g.closePath();
  g.fillPath();

  g.generateTexture('sparkle', w, h);
  g.destroy();
}

// ── Map layout data ──
// 0=grass, 1=path, 2=water, 3=stone, 4=farm_dirt
function generateMapData() {
  const rng = seededRandom(42);
  const map = [];

  for (let gy = 0; gy < WORLD_ROWS; gy++) {
    map[gy] = [];
    for (let gx = 0; gx < WORLD_COLS; gx++) {
      const cx = gx - WORLD_COLS / 2;
      const cy = gy - WORLD_ROWS / 2;
      const dist = Math.hypot(cx, cy);

      // Default grass
      let tile = 0;

      // Water zones
      if ((cx > 18 && cy < -10 && dist < 22) ||
          (cx < -20 && cy > 10 && dist < 18) ||
          (cx > 15 && cy > 15 && dist < 20)) {
        tile = 2;
      }
      // Main path
      else if ((Math.abs(cx) < 1.5 && cy > -15 && cy < 18) ||
               (Math.abs(cy) < 1.5 && cx > -10 && cx < 12) ||
               (Math.abs(cx - 3) < 1 && cy > 4 && cy < 14)) {
        tile = 1;
      }
      // Farm dirt areas
      else if (isInFarmArea(cx, cy)) {
        tile = 4;
      }
      // Stone areas near buildings
      else if (dist < 4 && cx > 2 && cy > -2 && cy < 4) {
        tile = 3;
      }
      // Random stone patches
      else if (rng() < 0.01 && dist > 8) {
        tile = 3;
      }

      map[gy][gx] = tile;
    }
  }
  return map;
}

function isInFarmArea(cx, cy) {
  for (const fp of FARM_POS) {
    const halfW = fp.cols / 2 + 0.5;
    const halfH = fp.rows / 2 + 0.5;
    if (cx >= fp.gx - halfW && cx <= fp.gx + halfW &&
        cy >= fp.gy - halfH && cy <= fp.gy + halfH) {
      return true;
    }
  }
  return false;
}

// Decoration positions
const DECORATIONS = [];
function generateDecorations() {
  const rng = seededRandom(123);
  DECORATIONS.length = 0;

  // Trees
  const treePositions = [
    { gx: -8, gy: -6, type: 'pine' },
    { gx: -10, gy: -3, type: 'deciduous' },
    { gx: -6, gy: 2, type: 'pine' },
    { gx: 10, gy: -8, type: 'deciduous' },
    { gx: 12, gy: -4, type: 'pine' },
    { gx: 11, gy: 2, type: 'deciduous' },
    { gx: -11, gy: 6, type: 'pine' },
    { gx: -9, gy: 10, type: 'deciduous' },
    { gx: 13, gy: 8, type: 'pine' },
    { gx: 14, gy: 12, type: 'deciduous' },
    { gx: -12, gy: 14, type: 'deciduous' },
    { gx: 9, gy: 17, type: 'pine' },
    { gx: -5, gy: -12, type: 'pine' },
    { gx: 6, gy: -14, type: 'deciduous' },
    { gx: -14, gy: -8, type: 'pine' },
    { gx: 16, gy: 0, type: 'deciduous' },
    { gx: -16, gy: 4, type: 'pine' },
    { gx: 0, gy: -16, type: 'deciduous' },
  ];
  treePositions.forEach(t => {
    DECORATIONS.push({ ...t, kind: 'tree' });
  });

  // Bushes
  const bushPositions = [
    { gx: -5, gy: -4 }, { gx: 8, gy: -6 }, { gx: -8, gy: 11 },
    { gx: 12, gy: 10 }, { gx: 2, gy: -7 }, { gx: -2, gy: 16 },
    { gx: -14, gy: 0 }, { gx: 15, gy: 6 },
  ];
  bushPositions.forEach(b => {
    DECORATIONS.push({ ...b, kind: 'bush' });
  });

  // Rocks
  const rockPositions = [
    { gx: -6, gy: 4 }, { gx: 7, gy: -2 }, { gx: -3, gy: 13 },
    { gx: 12, gy: 15 }, { gx: -12, gy: -2 }, { gx: -10, gy: 8 },
    { gx: 10, gy: 10 },
  ];
  rockPositions.forEach(r => {
    DECORATIONS.push({ ...r, kind: 'rock' });
  });

  // Fences
  DECORATIONS.push({ gx: 0, gy: -5, kind: 'fence', length: 6 });
  DECORATIONS.push({ gx: -3, gy: -2, kind: 'fence', length: 6, vertical: true });

  // Logs
  DECORATIONS.push({ gx: -8, gy: 2, kind: 'log' });
  DECORATIONS.push({ gx: -8.2, gy: 2.3, kind: 'log' });

  // Hay
  DECORATIONS.push({ gx: 8, gy: 14, kind: 'hay' });
  DECORATIONS.push({ gx: 8.5, gy: 13, kind: 'hay' });

  // Sign posts
  DECORATIONS.push({ gx: 2, gy: 5, kind: 'signpost' });
  DECORATIONS.push({ gx: -4, gy: 4, kind: 'signpost' });

  // Water lilies
  DECORATIONS.push({ gx: 20, gy: -12, kind: 'waterlily' });
  DECORATIONS.push({ gx: 22, gy: -11, kind: 'waterlily' });
  DECORATIONS.push({ gx: -22, gy: 12, kind: 'waterlily' });
}

// ── Main Scene ──
export default class DreamDaleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DreamDaleScene' });
    this.playerGx = 0;
    this.playerGy = 6;
    this.facing = 1;
    this.walking = false;
    this.paused = false;
    this.moveDir = { x: 0, z: 0 };
    this.keys = {};
    this.farmCrops = [{}, {}];
    this.floatingTexts = [];
    this.gameWidth = 800;
    this.gameHeight = 600;
    this.walkTime = 0;

    // Callbacks to React
    this.onFarmCellClick = null;
    this.onNearBuilding = null;
    this.onNearFarm = null;
    this.onMovementChange = null;
    this.playerSpeed = 0.08;
  }

  init(data) {
    this.gameWidth = data.width || 800;
    this.gameHeight = data.height || 600;
    this.onFarmCellClick = data.onFarmCellClick || null;
    this.onNearBuilding = data.onNearBuilding || null;
    this.onNearFarm = data.onNearFarm || null;
    this.onMovementChange = data.onMovementChange || null;
    this.externalState = data.externalState || null;
  }

  create() {
    generateTextures(this);
    generateDecorations();

    // Sky background
    this.cameras.main.setBackgroundColor('#87CEEB');

    // Create tile layers
    this.groundLayer = this.add.group();
    this.decorLayer = this.add.group();
    this.buildingLayer = this.add.group();
    this.entityLayer = this.add.group();
    this.uiLayer = this.add.group();

    // Render ground tiles
    this.renderGround();

    // Render decorations
    this.renderDecorations();

    // Render buildings
    this.renderBuildings();

    // Render farm plots
    this.farmSprites = [];
    this.renderFarmPlots();

    // Render NPCs
    this.renderNPCs();

    // Create player
    this.createPlayer();

    // Setup camera
    this.cameras.main.setBounds(-2000, -2000, 4000, 4000);
    this.updateCameraPosition();

    // Setup keyboard
    this.setupKeyboard();

    // Setup pointer (touch/mouse) for clicking on world objects
    this.setupPointer();

    // Floating text container
    this.floatingTextGroup = this.add.group();

    // Depth sorting - sort all entities by their Y position each frame
    this.events.on('update', this.gameUpdate, this);
  }

  renderGround() {
    const mapData = generateMapData();

    for (let gy = 0; gy < WORLD_ROWS; gy++) {
      for (let gx = 0; gx < WORLD_COLS; gx++) {
        const tileType = mapData[gy]?.[gx] ?? 0;
        let key;
        switch (tileType) {
          case 1: key = 'tile_path'; break;
          case 2: key = 'tile_water'; break;
          case 3: key = 'tile_stone'; break;
          case 4: key = 'tile_farm_dirt'; break;
          default: key = (gx + gy) % 2 === 0 ? 'tile_grass' : 'tile_grass2'; break;
        }

        // Convert local grid coords to world coords (centered) for consistency
        const worldX = gx - WORLD_COLS / 2;
        const worldY = gy - WORLD_ROWS / 2;
        const screen = isoToScreen(worldX, worldY);
        const sprite = this.add.image(screen.x, screen.y, key);
        sprite.setOrigin(0.5, 0.5);
        sprite.setDepth(worldX + worldY);
        this.groundLayer.add(sprite);

        // Add water animation (slight shimmer)
        if (tileType === 2) {
          sprite.setAlpha(0.85 + Math.random() * 0.15);
        }

        // Add grass tufts on grass tiles
        if (tileType === 0 && Math.random() < 0.08) {
          const tuft = this.add.graphics();
          const color = Math.random() > 0.5 ? 0x5aaa30 : 0x4a9a28;
          tuft.fillStyle(color, 0.6);
          tuft.fillEllipse(0, 0, 3 + Math.random() * 4, 2 + Math.random() * 3);
          tuft.setPosition(screen.x + (Math.random() - 0.5) * 20, screen.y + (Math.random() - 0.5) * 8);
          tuft.setDepth(worldX + worldY + 0.1);
          this.groundLayer.add(tuft);
        }

        // Add small flowers on some grass tiles
        if (tileType === 0 && Math.random() < 0.03) {
          const flowerColors = [0xff8888, 0xffff88, 0xff88ff, 0x88aaff];
          const fg = this.add.graphics();
          fg.fillStyle(flowerColors[Math.floor(Math.random() * flowerColors.length)], 0.8);
          fg.fillCircle(0, 0, 2);
          fg.setPosition(screen.x + (Math.random() - 0.5) * 20, screen.y + (Math.random() - 0.5) * 8);
          fg.setDepth(worldX + worldY + 0.1);
          this.groundLayer.add(fg);
        }
      }
    }
  }

  renderDecorations() {
    DECORATIONS.forEach(d => {
      const screen = isoToScreen(d.gx, d.gy);

      if (d.kind === 'tree') {
        const key = d.type === 'pine' ? 'tree_pine' : 'tree_deciduous';
        const sprite = this.add.image(screen.x, screen.y, key);
        sprite.setOrigin(0.5, 0.95);
        sprite.setDepth(d.gx + d.gy - 0.5);
        this.decorLayer.add(sprite);
      }
      else if (d.kind === 'bush') {
        const sprite = this.add.image(screen.x, screen.y, 'bush');
        sprite.setOrigin(0.5, 0.9);
        sprite.setDepth(d.gx + d.gy - 0.3);
        this.decorLayer.add(sprite);
      }
      else if (d.kind === 'rock') {
        const sprite = this.add.image(screen.x, screen.y, 'rock');
        sprite.setOrigin(0.5, 0.85);
        sprite.setDepth(d.gx + d.gy - 0.2);
        this.decorLayer.add(sprite);
      }
      else if (d.kind === 'fence') {
        const count = Math.floor(d.length / 1.2);
        for (let i = 0; i < count; i++) {
          let fx = d.gx, fy = d.gy;
          if (d.vertical) {
            fy += i * 1.2 - count * 0.6;
          } else {
            fx += i * 1.2 - count * 0.6;
          }
          const fScreen = isoToScreen(fx, fy);
          const sprite = this.add.image(fScreen.x, fScreen.y, 'fence');
          sprite.setOrigin(0.5, 0.8);
          sprite.setDepth(fx + fy - 0.1);
          if (d.vertical) sprite.setAngle(90);
          this.decorLayer.add(sprite);
        }
      }
      else if (d.kind === 'log') {
        const sprite = this.add.image(screen.x, screen.y, 'log');
        sprite.setOrigin(0.5, 0.8);
        sprite.setDepth(d.gx + d.gy - 0.1);
        sprite.setAngle(Math.random() * 30 - 15);
        this.decorLayer.add(sprite);
      }
      else if (d.kind === 'hay') {
        const sprite = this.add.image(screen.x, screen.y, 'hay');
        sprite.setOrigin(0.5, 0.85);
        sprite.setDepth(d.gx + d.gy - 0.1);
        this.decorLayer.add(sprite);
      }
      else if (d.kind === 'signpost') {
        const sprite = this.add.image(screen.x, screen.y, 'signpost');
        sprite.setOrigin(0.5, 0.95);
        sprite.setDepth(d.gx + d.gy - 0.1);
        this.decorLayer.add(sprite);
      }
      else if (d.kind === 'waterlily') {
        const sprite = this.add.image(screen.x, screen.y, 'waterlily');
        sprite.setOrigin(0.5, 0.5);
        sprite.setDepth(d.gx + d.gy);
        this.decorLayer.add(sprite);
        // Gentle bobbing
        this.tweens.add({
          targets: sprite,
          y: screen.y + 2,
          duration: 2000 + Math.random() * 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
    });
  }

  renderBuildings() {
    // House
    const houseScreen = isoToScreen(0, -2);
    const house = this.add.image(houseScreen.x, houseScreen.y, 'building_house');
    house.setOrigin(0.5, 0.85);
    house.setDepth(0 + -2 - 0.5);
    house.setInteractive({ useHandCursor: true });
    house.on('pointerdown', () => {
      // House interaction - could open info modal
    });
    this.buildingLayer.add(house);

    // Blacksmith
    const bsScreen = isoToScreen(BUILDING_POS.blacksmith.gx, BUILDING_POS.blacksmith.gy);
    const blacksmith = this.add.image(bsScreen.x, bsScreen.y, 'building_blacksmith');
    blacksmith.setOrigin(0.5, 0.85);
    blacksmith.setDepth(BUILDING_POS.blacksmith.gx + BUILDING_POS.blacksmith.gy - 0.5);
    blacksmith.setInteractive({ useHandCursor: true });
    blacksmith.on('pointerdown', () => {
      if (this.onNearBuilding) this.onNearBuilding('blacksmith');
    });
    this.buildingLayer.add(blacksmith);

    // Market
    const mktScreen = isoToScreen(BUILDING_POS.market.gx, BUILDING_POS.market.gy);
    const market = this.add.image(mktScreen.x, mktScreen.y, 'building_market');
    market.setOrigin(0.5, 0.85);
    market.setDepth(BUILDING_POS.market.gx + BUILDING_POS.market.gy - 0.5);
    market.setInteractive({ useHandCursor: true });
    market.on('pointerdown', () => {
      if (this.onNearBuilding) this.onNearBuilding('market');
    });
    this.buildingLayer.add(market);
  }

  renderFarmPlots() {
    FARM_POS.forEach((fp, plotIdx) => {
      const farmGroup = this.add.group();
      const cells = [];

      // Cell bounding box in grid coords
      const minGx = fp.gx - (fp.cols - 1) / 2 - 0.6;
      const maxGx = fp.gx + (fp.cols - 1) / 2 + 0.6;
      const minGy = fp.gy - (fp.rows - 1) / 2 - 0.6;
      const maxGy = fp.gy + (fp.rows - 1) / 2 + 0.6;

      // Farm plot base: iso diamond through the 4 grid corners (darker dirt)
      const cTL = isoToScreen(minGx, minGy);
      const cTR = isoToScreen(maxGx, minGy);
      const cBR = isoToScreen(maxGx, maxGy);
      const cBL = isoToScreen(minGx, maxGy);

      const baseG = this.add.graphics();
      baseG.fillStyle(0x4e3418, 1);
      baseG.fillPoints([cTL, cTR, cBR, cBL], true);
      baseG.setDepth(fp.gx + fp.gy - 0.8);
      this.decorLayer.add(baseG);

      // Lighter inner dirt
      const iTL = isoToScreen(minGx + 0.25, minGy + 0.25);
      const iTR = isoToScreen(maxGx - 0.25, minGy + 0.25);
      const iBR = isoToScreen(maxGx - 0.25, maxGy - 0.25);
      const iBL = isoToScreen(minGx + 0.25, maxGy - 0.25);
      const innerG = this.add.graphics();
      innerG.fillStyle(0x5a3e20, 1);
      innerG.fillPoints([iTL, iTR, iBR, iBL], true);
      innerG.setDepth(fp.gx + fp.gy - 0.75);
      this.decorLayer.add(innerG);

      // Farm fence around the border (perimeter posts)
      const step = 0.9;
      const fenceScreen = isoToScreen(fp.gx, fp.gy);
      const posts = [];
      for (let fx = minGx; fx <= maxGx; fx += step) {
        posts.push(isoToScreen(fx, minGy), isoToScreen(fx, maxGy));
      }
      for (let fy = minGy; fy <= maxGy; fy += step) {
        posts.push(isoToScreen(minGx, fy), isoToScreen(maxGx, fy));
      }
      posts.forEach(p => {
        const post = this.add.image(p.x, p.y, 'fence');
        post.setOrigin(0.5, 0.9);
        post.setDepth(fp.gx + fp.gy - 0.7);
        post.setScale(0.7);
        this.decorLayer.add(post);
      });

      // Cells
      for (let r = 0; r < fp.rows; r++) {
        for (let c = 0; c < fp.cols; c++) {
          const cellGx = fp.gx + (c - (fp.cols - 1) / 2) * 1.0;
          const cellGy = fp.gy + (r - (fp.rows - 1) / 2) * 1.0;
          const cellScreen = isoToScreen(cellGx, cellGy);

          // Cell background
          const cellBg = this.add.image(cellScreen.x, cellScreen.y, 'farm_cell');
          cellBg.setOrigin(0.5, 0.5);
          cellBg.setDepth(cellGx + cellGy - 0.6);
          cellBg.setInteractive({ useHandCursor: true });
          this.decorLayer.add(cellBg);

          const cellData = {
            plotIdx, row: r, col: c, gx: cellGx, gy: cellGy,
            bg: cellBg, cropSprite: null, key: `${r}-${c}`
          };

          cellBg.on('pointerdown', () => {
            const crop = this.farmCrops[plotIdx]?.[cellData.key] || null;
            if (this.onFarmCellClick) {
              this.onFarmCellClick(plotIdx, { row: r, col: c, existing: crop });
            }
          });

          cells.push(cellData);
        }
      }

      this.farmSprites.push({ fp, cells, farmGroup });
    });
  }

  renderNPCs() {
    this.npcSprites = [];
    NPC_DATA.forEach(npc => {
      const screen = isoToScreen(npc.gx, npc.gy);
      const sprite = this.add.image(screen.x, screen.y, `npc_${npc.name === 'Thợ rèn' ? 'blacksmith' : 'merchant'}`);
      sprite.setOrigin(0.5, 0.9);
      sprite.setDepth(npc.gx + npc.gy - 0.3);
      sprite.setInteractive({ useHandCursor: true });

      // Name label
      const label = this.add.text(screen.x, screen.y - 32, npc.name, {
        fontSize: '10px', fontFamily: 'Arial', color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.5)', padding: { x: 4, y: 2 },
      });
      label.setOrigin(0.5, 1);
      label.setDepth(npc.gx + npc.gy - 0.2);

      // Bobbing animation
      this.tweens.add({
        targets: [sprite, label],
        y: `+=${3}`,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      sprite.on('pointerdown', () => {
        // NPC interaction
      });

      this.entityLayer.add(sprite);
      this.entityLayer.add(label);
      this.npcSprites.push({ sprite, label, data: npc });
    });
  }

  createPlayer() {
    const screen = isoToScreen(this.playerGx, this.playerGy);
    this.playerSprite = this.add.image(screen.x, screen.y, 'player_idle');
    this.playerSprite.setOrigin(0.5, 0.95);
    this.playerSprite.setDepth(this.playerGx + this.playerGy);

    // Player name label
    this.playerLabel = this.add.text(screen.x, screen.y - 36, '', {
      fontSize: '10px', fontFamily: 'Arial', color: '#ffffff',
      backgroundColor: 'rgba(74,144,217,0.7)', padding: { x: 4, y: 2 },
    });
    this.playerLabel.setOrigin(0.5, 1);
    this.playerLabel.setDepth(this.playerGx + this.playerGy + 0.1);

    this.entityLayer.add(this.playerSprite);
    this.entityLayer.add(this.playerLabel);
  }

  setPlayerName(name) {
    if (this.playerLabel) {
      this.playerLabel.setText(name);
    }
  }

  setupKeyboard() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  setupPointer() {
    // Zoom with scroll wheel (desktop) - camera stays centered on player
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      const cam = this.cameras.main;
      const newZoom = Phaser.Math.Clamp(cam.zoom - deltaY * 0.001, 0.4, 1.8);
      cam.setZoom(newZoom);
    });
  }

  setMoveDirection(dir) {
    this.moveDir = { x: dir.x || 0, z: dir.z || 0 };
  }

  setPaused(paused) {
    this.paused = paused;
    if (paused) {
      this.moveDir = { x: 0, z: 0 };
      this.playerSprite.setTexture('player_idle');
    }
  }

  setFarmCrops(crops) {
    this.farmCrops = crops;
    this.updateFarmDisplay();
  }

  updateFarmDisplay() {
    this.farmSprites.forEach((farm, plotIdx) => {
      const crops = this.farmCrops[plotIdx] || {};
      farm.cells.forEach(cell => {
        const cropData = crops[cell.key];

        // Determine which texture this cell should show
        let texKey = null;
        if (cropData) {
          switch (cropData.stage) {
            case 'seed': texKey = 'crop_seed'; break;
            case 'growing': texKey = 'crop_growing'; break;
            case 'grown':
              texKey = cropData.config?.kind === 'fruitTree' ? 'crop_fruittree' : 'crop_bloom';
              break;
            default: texKey = 'crop_seed'; break;
          }
        }

        // Only rebuild when visual state actually changed
        if (cell.lastTexKey !== texKey) {
          if (cell.cropSprite) {
            if (cell.cropSprite._sparkle) {
              cell.cropSprite._sparkle.destroy();
              cell.cropSprite._sparkle = null;
            }
            cell.cropSprite.destroy();
            cell.cropSprite = null;
          }
          cell.lastTexKey = texKey;

          if (cropData) {
            const cropSprite = this.add.image(cell.bg.x, cell.bg.y - 8, texKey);
            cropSprite.setOrigin(0.5, 0.9);
            cropSprite.setDepth(cell.gx + cell.gy - 0.4);
            cell.cropSprite = cropSprite;
            this.entityLayer.add(cropSprite);

            // Ready sparkle for grown crops
            if (cropData.stage === 'grown') {
              const sparkle = this.add.image(cell.bg.x + 8, cell.bg.y - 18, 'sparkle');
              sparkle.setOrigin(0.5, 0.5);
              sparkle.setDepth(cell.gx + cell.gy - 0.3);
              this.tweens.add({
                targets: sparkle,
                alpha: { from: 1, to: 0.3 },
                scale: { from: 1, to: 0.5 },
                duration: 600,
                yoyo: true,
                repeat: -1,
              });
              cell.cropSprite._sparkle = sparkle;
            }
          }
        }

        // Update cell background (only matters when planted/empty changes)
        const bgKey = cropData ? 'farm_cell' : 'farm_cell_empty';
        if (cell.bg.texture.key !== bgKey) {
          cell.bg.setTexture(bgKey);
        }
      });
    });
  }

  addFloatingText(text, color = '#ffffff') {
    const screen = isoToScreen(this.playerGx, this.playerGy);
    const txt = this.add.text(screen.x, screen.y - 50, text, {
      fontSize: '16px',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      color: color,
      stroke: '#000000',
      strokeThickness: 3,
    });
    txt.setOrigin(0.5, 1);
    txt.setDepth(9999);

    this.tweens.add({
      targets: txt,
      y: txt.y - 50,
      alpha: 0,
      scale: 1.2,
      duration: 1200,
      ease: 'Power2',
      onComplete: () => txt.destroy(),
    });
  }

  updateCameraPosition() {
    const screen = isoToScreen(this.playerGx, this.playerGy);
    this.cameras.main.centerOn(screen.x, screen.y - 20);
  }

  gameUpdate(time, delta) {
    // Handle movement
    let dx = 0, dz = 0;

    if (!this.paused) {
      if (this.cursors.left.isDown || this.wasd.left.isDown) dx -= 1;
      if (this.cursors.right.isDown || this.wasd.right.isDown) dx += 1;
      if (this.cursors.up.isDown || this.wasd.up.isDown) dz -= 1;
      if (this.cursors.down.isDown || this.wasd.down.isDown) dz += 1;

      // Override with external touch direction
      if (this.moveDir.x !== 0 || this.moveDir.z !== 0) {
        dx = this.moveDir.x;
        dz = this.moveDir.z;
      }
    }

    const mag = Math.hypot(dx, dz);
    const moving = mag > 0.05 && !this.paused;

    if (moving) {
      if (mag > 1) { dx /= mag; dz /= mag; }

      this.playerGx += dx * this.playerSpeed;
      this.playerGy += dz * this.playerSpeed;

      // Clamp to world bounds (in iso coords)
      const maxBound = WORLD_COLS / 2 - 2;
      this.playerGx = Phaser.Math.Clamp(this.playerGx, -maxBound, maxBound);
      this.playerGy = Phaser.Math.Clamp(this.playerGy, -maxBound, maxBound);

      this.walking = true;
      if (dx > 0.1) this.facing = -1;
      else if (dx < -0.1) this.facing = 1;

      // Simple walk animation (texture change + subtle bobbing)
      this.walkTime += delta * 0.01;
      this.playerSprite.setTexture('player_walk');
      const bob = Math.abs(Math.sin(this.walkTime)) * 0.12;
      this.playerSprite.setScale(1, 1 + bob);
      this.playerSprite.setFlipX(this.facing < 0);
    } else {
      this.walking = false;
      this.playerSprite.setTexture('player_idle');
      this.playerSprite.setScale(1, 1);
    }

    // Update player screen position
    const screen = isoToScreen(this.playerGx, this.playerGy);
    this.playerSprite.setPosition(screen.x, screen.y);
    this.playerSprite.setDepth(this.playerGx + this.playerGy);
    this.playerLabel.setPosition(screen.x, screen.y - 36);
    this.playerLabel.setDepth(this.playerGx + this.playerGy + 0.1);

    // Camera follow
    this.updateCameraPosition();

    // Check proximity to buildings/farms (throttled to avoid spamming React state)
    if (!this._lastProximityCheck || time - this._lastProximityCheck > 150) {
      this.checkProximity();
      this._lastProximityCheck = time;
    }

    // Sort entities by depth
    this.entityLayer.depthSort();
  }

  checkProximity() {
    const NEAR_DIST = 2.5;
    const FARM_NEAR = 2.0;

    const nearBlacksmith = Math.hypot(
      this.playerGx - BUILDING_POS.blacksmith.gx,
      this.playerGy - BUILDING_POS.blacksmith.gy
    ) < NEAR_DIST;

    const nearMarket = Math.hypot(
      this.playerGx - BUILDING_POS.market.gx,
      this.playerGy - BUILDING_POS.market.gy
    ) < NEAR_DIST;

    let nearFarmIdx = -1;
    FARM_POS.forEach((fp, idx) => {
      if (Math.hypot(this.playerGx - fp.gx, this.playerGy - fp.gy) < FARM_NEAR) {
        nearFarmIdx = idx;
      }
    });

    if (this.onMovementChange) {
      this.onMovementChange({
        walking: this.walking,
        facing: this.facing,
        nearBlacksmith,
        nearMarket,
        nearFarmIdx,
      });
    }
  }
}

export { FARM_POS, BUILDING_POS, isoToScreen, screenToIso };
