// ---------------------------------------------------------
// data.js — subjects, learning content, and the farm layout
// ---------------------------------------------------------

const SUBJECTS = [
  { code: "vi", name: "Tiếng Việt", icon: "📖" },
  { code: "math", name: "Toán học", icon: "➗" },
  { code: "geo", name: "Địa lý", icon: "🌍" },
  { code: "en", name: "Tiếng Anh", icon: "🇬🇧" },
];

// Every crop plot on the map has a fixed id. Each subject supplies one
// "question card" per id, so switching subject just swaps which set
// of cards the same 8 plots point to.
const CROP_IDS = ["carrot", "corn", "tomato", "pumpkin", "cabbage", "wheat", "apple", "egg"];

const CONTENT = {
  en: [
    { id: "carrot", emoji: "🥕", prompt: "carrot", pron: "/ˈkær.ət/", answer: "cà rốt",
      example: { main: "I grow carrots in the garden.", sub: "Tôi trồng cà rốt trong vườn." } },
    { id: "corn", emoji: "🌽", prompt: "corn", pron: "/kɔːrn/", answer: "bắp ngô",
      example: { main: "Corn turns golden in autumn.", sub: "Bắp ngô chín vàng vào mùa thu." } },
    { id: "tomato", emoji: "🍅", prompt: "tomato", pron: "/təˈmeɪ.toʊ/", answer: "cà chua",
      example: { main: "The salad needs a few ripe tomatoes.", sub: "Salad cần vài quả cà chua chín." } },
    { id: "pumpkin", emoji: "🎃", prompt: "pumpkin", pron: "/ˈpʌmp.kɪn/", answer: "bí ngô",
      example: { main: "We carved a pumpkin for the festival.", sub: "Chúng tôi khắc bí ngô vào lễ hội." } },
    { id: "cabbage", emoji: "🥬", prompt: "cabbage", pron: "/ˈkæb.ɪdʒ/", answer: "bắp cải",
      example: { main: "Cabbage is great for soup.", sub: "Bắp cải rất tốt cho món canh." } },
    { id: "wheat", emoji: "🌾", prompt: "wheat", pron: "/wiːt/", answer: "lúa mì",
      example: { main: "The wheat field stretches to the horizon.", sub: "Cánh đồng lúa mì trải dài đến chân trời." } },
    { id: "apple", emoji: "🍎", prompt: "apple", pron: "/ˈæp.əl/", answer: "táo",
      example: { main: "The apple tree in the yard is full of fruit.", sub: "Cây táo trong sân trổ đầy trái." } },
    { id: "egg", emoji: "🥚", prompt: "egg", pron: "/eɡ/", answer: "trứng",
      example: { main: "The hen lays an egg every morning.", sub: "Gà mái đẻ trứng mỗi sáng." } },
  ],

  vi: [
    { id: "carrot", emoji: "🥕", prompt: "Mùa màng", answer: "Vụ thu hoạch nông sản trong năm",
      example: { main: "Mùa màng năm nay bội thu.", sub: "" } },
    { id: "corn", emoji: "🌽", prompt: "Bội thu", answer: "Thu hoạch được nhiều hơn bình thường",
      example: { main: "Nhờ chăm bón tốt, lúa bội thu.", sub: "" } },
    { id: "tomato", emoji: "🍅", prompt: "Cần cù", answer: "Chăm chỉ, siêng năng làm việc",
      example: { main: "Người nông dân cần cù từ sáng đến tối.", sub: "" } },
    { id: "pumpkin", emoji: "🎃", prompt: "Ruộng đồng", answer: "Khu vực trồng trọt rộng lớn",
      example: { main: "Ruộng đồng trải dài tít tắp.", sub: "" } },
    { id: "cabbage", emoji: "🥬", prompt: "Gieo trồng", answer: "Trồng cây, gieo hạt xuống đất",
      example: { main: "Nông dân gieo trồng vào đầu mùa mưa.", sub: "" } },
    { id: "wheat", emoji: "🌾", prompt: "Thu hoạch", answer: "Hái, gặt nông sản khi đã chín",
      example: { main: "Chúng tôi thu hoạch cà chua vào buổi sáng.", sub: "" } },
    { id: "apple", emoji: "🍎", prompt: "Vun trồng", answer: "Chăm sóc, bồi đắp cho cây lớn lên",
      example: { main: "Cô ấy vun trồng luống rau mỗi ngày.", sub: "" } },
    { id: "egg", emoji: "🥚", prompt: "Trù phú", answer: "Giàu có, màu mỡ (đất đai)",
      example: { main: "Vùng đất này rất trù phú.", sub: "" } },
  ],

  math: [
    { id: "carrot", emoji: "🥕", prompt: "12 + 8 = ?", answer: "20",
      example: { main: "Cộng 12 và 8 được 20.", sub: "" } },
    { id: "corn", emoji: "🌽", prompt: "9 × 3 = ?", answer: "27",
      example: { main: "9 lấy 3 lần bằng 27.", sub: "" } },
    { id: "tomato", emoji: "🍅", prompt: "45 − 17 = ?", answer: "28",
      example: { main: "45 bớt đi 17 còn 28.", sub: "" } },
    { id: "pumpkin", emoji: "🎃", prompt: "100 ÷ 4 = ?", answer: "25",
      example: { main: "Chia 100 thành 4 phần bằng nhau, mỗi phần 25.", sub: "" } },
    { id: "cabbage", emoji: "🥬", prompt: "7² = ?", answer: "49",
      example: { main: "7² nghĩa là 7 × 7 = 49.", sub: "" } },
    { id: "wheat", emoji: "🌾", prompt: "3 + 5 × 2 = ?", answer: "13",
      example: { main: "Nhân trước, cộng sau: 5×2=10, rồi 3+10=13.", sub: "" } },
    { id: "apple", emoji: "🍎", prompt: "1/2 + 1/4 = ?", answer: "3/4",
      example: { main: "Quy đồng mẫu số: 2/4 + 1/4 = 3/4.", sub: "" } },
    { id: "egg", emoji: "🥚", prompt: "15% của 200 = ?", answer: "30",
      example: { main: "15% × 200 = 0.15 × 200 = 30.", sub: "" } },
  ],

  geo: [
    { id: "carrot", emoji: "🥕", prompt: "Thủ đô của Việt Nam là gì?", answer: "Hà Nội",
      example: { main: "Hà Nội nằm ở miền Bắc Việt Nam.", sub: "" } },
    { id: "corn", emoji: "🌽", prompt: "Ngọn núi cao nhất thế giới?", answer: "Everest",
      example: { main: "Everest cao khoảng 8.849m, nằm ở dãy Himalaya.", sub: "" } },
    { id: "tomato", emoji: "🍅", prompt: "Con sông dài nhất thế giới?", answer: "Sông Nile",
      example: { main: "Sông Nile chảy qua nhiều nước ở châu Phi.", sub: "" } },
    { id: "pumpkin", emoji: "🎃", prompt: "Đại dương lớn nhất thế giới?", answer: "Thái Bình Dương",
      example: { main: "Thái Bình Dương lớn hơn tổng diện tích các đại dương khác.", sub: "" } },
    { id: "cabbage", emoji: "🥬", prompt: "Sa mạc nóng lớn nhất thế giới?", answer: "Sahara",
      example: { main: "Sahara nằm ở Bắc Phi.", sub: "" } },
    { id: "wheat", emoji: "🌾", prompt: "Trái Đất có bao nhiêu châu lục?", answer: "7 châu lục",
      example: { main: "Á, Âu, Phi, Bắc Mỹ, Nam Mỹ, Úc, Nam Cực.", sub: "" } },
    { id: "apple", emoji: "🍎", prompt: "Quốc gia có diện tích lớn nhất thế giới?", answer: "Nga",
      example: { main: "Nga trải dài qua cả châu Á và châu Âu.", sub: "" } },
    { id: "egg", emoji: "🥚", prompt: "Quốc gia nhỏ nhất thế giới?", answer: "Vatican",
      example: { main: "Vatican nằm trọn trong thành phố Rome, Ý.", sub: "" } },
  ],
};

// ------------------------------------------------------------------
// Farm layout — a fixed "blueprint" of buildings/crops/trees placed
// on a reference grid. rebuildLayout() centers this blueprint inside
// a grid sized to fill the current screen, so the farm always spans
// the full viewport, however big or small.
// ------------------------------------------------------------------

const TILE_SIZE = 48;
const BASE_COLS = 14;
const BASE_ROWS = 10;

const BLUEPRINT = {
  cropPlots: [
    { x: 3, y: 3, id: "carrot", emoji: "🥕" }, { x: 4, y: 3, id: "corn", emoji: "🌽" },
    { x: 5, y: 3, id: "tomato", emoji: "🍅" }, { x: 3, y: 4, id: "pumpkin", emoji: "🎃" },
    { x: 4, y: 4, id: "cabbage", emoji: "🥬" }, { x: 5, y: 4, id: "wheat", emoji: "🌾" },
    { x: 9, y: 6, id: "apple", emoji: "🍎" }, { x: 10, y: 7, id: "egg", emoji: "🥚" },
  ],
  trees: [
    { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 6 }, { x: 1, y: 7 },
    { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 8, y: 8 }, { x: 11, y: 8 },
  ],
  barn: { x: 1, y: 2, w: 3, h: 2 },
  coop: { x: 10, y: 1, w: 2, h: 1 },
  animals: [
    { x: 6, y: 8, emoji: "🐑" }, { x: 9, y: 2, emoji: "🐔" }, { x: 2, y: 8, emoji: "🐓" },
  ],
  pathRow: 5,   // horizontal path runs through this row (blueprint space)
  pathCol: 7,   // vertical path runs through this column (blueprint space)
  playerStart: { x: 6, y: 6 },
};

// mutable, screen-sized layout — populated by rebuildLayout()
let MAP_COLS = BASE_COLS;
let MAP_ROWS = BASE_ROWS;
let CROP_PLOTS = [];
let TREES = [];
let BARN = { x: 0, y: 0, w: 0, h: 0 };
let COOP = { x: 0, y: 0, w: 0, h: 0 };
let ANIMALS = [];
let PATH_TILES = new Set();
let PLAYER_START = { x: 0, y: 0 };
let LAYOUT_OFFSET = { x: 0, y: 0 };

function tileVariant(x, y) {
  return (x * 7 + y * 13) % 5 === 0 ? 1 : 0;
}

// Recompute the map so it always fills `viewportCols` x `viewportRows`
// tiles (at least the blueprint's own size), keeping the farm centered.
function rebuildLayout(viewportCols, viewportRows) {
  MAP_COLS = Math.max(BASE_COLS, viewportCols);
  MAP_ROWS = Math.max(BASE_ROWS, viewportRows);

  const offX = Math.floor((MAP_COLS - BASE_COLS) / 2);
  const offY = Math.floor((MAP_ROWS - BASE_ROWS) / 2);
  LAYOUT_OFFSET = { x: offX, y: offY };

  CROP_PLOTS = BLUEPRINT.cropPlots.map(p => ({ x: p.x + offX, y: p.y + offY, vocabId: p.id, emoji: p.emoji }));
  TREES = BLUEPRINT.trees.map(t => ({ x: t.x + offX, y: t.y + offY }));
  BARN = { x: BLUEPRINT.barn.x + offX, y: BLUEPRINT.barn.y + offY, w: BLUEPRINT.barn.w, h: BLUEPRINT.barn.h };
  COOP = { x: BLUEPRINT.coop.x + offX, y: BLUEPRINT.coop.y + offY, w: BLUEPRINT.coop.w, h: BLUEPRINT.coop.h };
  ANIMALS = BLUEPRINT.animals.map(a => ({ x: a.x + offX, y: a.y + offY, emoji: a.emoji }));
  PLAYER_START = { x: BLUEPRINT.playerStart.x + offX, y: BLUEPRINT.playerStart.y + offY };

  const pathRow = BLUEPRINT.pathRow + offY;
  const pathCol = BLUEPRINT.pathCol + offX;
  const set = new Set();
  for (let x = 0; x < MAP_COLS; x++) set.add(`${x},${pathRow}`);
  for (let y = 0; y < MAP_ROWS; y++) set.add(`${pathCol},${y}`);
  PATH_TILES = set;
}

// initial default before the canvas is sized
rebuildLayout(BASE_COLS, BASE_ROWS);
