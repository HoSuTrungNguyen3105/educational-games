import { Router } from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendError, sendCreated } from "../utils/response.js";
import { getCollection } from "../db.js";
import { renderItemHtml, renderAvatarFull, shade, capPath, girlLongHair, starShape, heartShape, bodyBase, drawFace, hairMarkup, shirtMarkup, pantsMarkup, shoesMarkup, hatMarkup, glassesMarkup, accessoryMarkup } from "../lib/avatarRenderer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const router = Router();

const ITEMS = "avatarItems";
const USERS = "users";
const TEMPLATE = "avatarTemplate";

const CATEGORIES = [
  { id: "body", label: "Body" },
  { id: "skin", label: "Da" }, { id: "face", label: "Mặt" },
  { id: "hair", label: "Tóc" }, { id: "shirt", label: "Áo" }, { id: "pants", label: "Quần" },
  { id: "shoes", label: "Giày" }, { id: "hat", label: "Mũ" }, { id: "glasses", label: "Kính" },
  { id: "accessory", label: "Phụ kiện" },
];

const LAYER_ORDER = ["body", "skin", "face", "hair", "shirt", "pants", "shoes", "hat", "glasses", "accessory"];

const DEFAULT_LOADOUT = {
  body: "body_boy_01", skin: "skin_01", face: "face_01", hair: "hair_boy_01", shirt: "shirt_boy_01",
  pants: "pants_boy_01", shoes: "shoes_boy_01", hat: null, glasses: null, accessory: null,
};

const DEFAULT_TEMPLATE = {
  body:    { x: 0, y: 0, width: 512, height: 700, zIndex: 0 },
  skin:    { x: 0, y: 0, width: 512, height: 700, zIndex: 1 },
  face:    { x: 0, y: 0, width: 512, height: 700, zIndex: 2 },
  hair:    { x: 0, y: 0, width: 512, height: 700, zIndex: 3 },
  shirt:   { x: 0, y: 0, width: 512, height: 700, zIndex: 4 },
  pants:   { x: 0, y: 0, width: 512, height: 700, zIndex: 5 },
  shoes:   { x: 0, y: 0, width: 512, height: 700, zIndex: 6 },
  hat:     { x: 0, y: 0, width: 512, height: 700, zIndex: 7 },
  glasses: { x: 0, y: 0, width: 512, height: 700, zIndex: 8 },
  accessory: { x: 0, y: 0, width: 512, height: 700, zIndex: 9 },
};

// ─── SEED DATA FROM avatar.html ─────────────────────────────────

const CUSTOM_BODY_DRAGON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="700" viewBox="0 0 512 700" fill="none">
  <defs>
    <linearGradient id="skin" x1="100" y1="80" x2="420" y2="620">
      <stop offset="0" stop-color="#A8EC55"/><stop offset="0.35" stop-color="#78D63F"/><stop offset="0.7" stop-color="#4DB83A"/><stop offset="1" stop-color="#268633"/>
    </linearGradient>
    <linearGradient id="skinDark" x1="100" y1="300" x2="420" y2="600">
      <stop offset="0" stop-color="#55B83B"/><stop offset="1" stop-color="#247630"/>
    </linearGradient>
    <radialGradient id="belly" cx="40%" cy="30%" r="70%">
      <stop offset="0" stop-color="#D0F77B"/><stop offset="0.55" stop-color="#A4E653"/><stop offset="1" stop-color="#62B93B"/>
    </radialGradient>
    <linearGradient id="horn" x1="150" y1="40" x2="200" y2="180">
      <stop offset="0" stop-color="#58A93B"/><stop offset="0.5" stop-color="#286B2E"/><stop offset="1" stop-color="#164824"/>
    </linearGradient>
    <radialGradient id="eyeWhite">
      <stop offset="0" stop-color="#FFFFFF"/><stop offset="0.8" stop-color="#F5FAF2"/><stop offset="1" stop-color="#D7E7D4"/>
    </radialGradient>
    <linearGradient id="mouth" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#24272A"/><stop offset="1" stop-color="#07090B"/>
    </linearGradient>
    <filter id="blurShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="9"/>
    </filter>
    <filter id="dropShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#174D24" flood-opacity="0.22"/>
    </filter>
  </defs>
  <ellipse cx="256" cy="665" rx="175" ry="22" fill="#4B553F" opacity="0.14" filter="url(#blurShadow)"/>
  <ellipse cx="256" cy="660" rx="145" ry="14" fill="#4B553F" opacity="0.10"/>
  <g filter="url(#dropShadow)">
    <path d="M185 470 C181 455 191 444 207 444 L236 444 C252 444 261 455 261 471 L261 604 C261 620 252 631 235 631 L207 631 C190 631 181 619 181 604 Z" fill="url(#skin)" stroke="#237832" stroke-width="5"/>
    <path d="M251 471 C251 455 260 444 276 444 L305 444 C321 444 331 455 327 471 L331 604 C331 619 322 631 305 631 L277 631 C260 631 251 620 251 604 Z" fill="url(#skin)" stroke="#237832" stroke-width="5"/>
    <path d="M202 480 L202 585" stroke="#D0FA83" stroke-width="12" stroke-linecap="round" opacity="0.25"/>
    <path d="M274 480 L274 575" stroke="#D0FA83" stroke-width="11" stroke-linecap="round" opacity="0.20"/>
    <path d="M178 596 C190 584 228 584 248 597 C263 607 267 626 254 638 C241 650 198 651 181 639 C168 630 167 608 178 596 Z" fill="url(#skinDark)" stroke="#23682D" stroke-width="5"/>
    <path d="M258 597 C278 584 316 584 333 597 C345 608 344 630 331 639 C314 651 271 650 258 638 C245 626 247 607 258 597 Z" fill="url(#skinDark)" stroke="#23682D" stroke-width="5"/>
    <ellipse cx="204" cy="607" rx="18" ry="7" fill="#D1F981" opacity="0.5" transform="rotate(-8 204 607)"/>
    <ellipse cx="289" cy="607" rx="18" ry="7" fill="#D1F981" opacity="0.45" transform="rotate(-8 289 607)"/>
    <path d="M154 280 C154 250 178 231 207 231 L305 231 C334 231 358 250 358 280 L358 403 C358 465 319 511 256 525 C193 511 154 465 154 403 Z" fill="url(#skin)" stroke="#237832" stroke-width="6"/>
    <path d="M160 383 C172 455 205 496 256 517 C307 496 340 455 352 383 C345 465 315 510 256 528 C197 510 167 465 160 383 Z" fill="#216D2D" opacity="0.16"/>
    <ellipse cx="256" cy="378" rx="69" ry="101" fill="url(#belly)" opacity="0.96"/>
    <ellipse cx="230" cy="337" rx="28" ry="43" fill="#E1FF99" opacity="0.24" transform="rotate(-12 230 337)"/>
    <circle cx="190" cy="292" r="13" fill="#399A38" opacity="0.55"/>
    <circle cx="207" cy="321" r="7" fill="#399A38" opacity="0.45"/>
    <circle cx="322" cy="303" r="13" fill="#398E35" opacity="0.5"/>
    <circle cx="330" cy="338" r="7" fill="#398E35" opacity="0.45"/>
    <circle cx="313" cy="431" r="9" fill="#398E35" opacity="0.4"/>
    <circle cx="194" cy="440" r="8" fill="#398E35" opacity="0.4"/>
    <path d="M169 272 C147 267 132 281 129 304 L113 446 C111 464 122 477 140 479 C158 481 171 468 173 450 L187 310 C190 290 185 276 169 272 Z" fill="url(#skin)" stroke="#237832" stroke-width="5"/>
    <path d="M343 272 C365 267 380 281 383 304 L399 446 C401 464 390 477 372 479 C354 481 341 468 339 450 L325 310 C322 290 327 276 343 272 Z" fill="url(#skin)" stroke="#237832" stroke-width="5"/>
    <path d="M151 301 L139 429" stroke="#D1FA83" stroke-width="11" stroke-linecap="round" opacity="0.25"/>
    <path d="M361 301 L373 429" stroke="#D1FA83" stroke-width="11" stroke-linecap="round" opacity="0.22"/>
    <circle cx="135" cy="461" r="29" fill="url(#skin)" stroke="#237832" stroke-width="5"/>
    <circle cx="377" cy="461" r="29" fill="url(#skin)" stroke="#237832" stroke-width="5"/>
    <path d="M115 464 L105 437 Q119 442 127 463 Z" fill="#276E2F" stroke="#174D24" stroke-width="2"/>
    <path d="M130 468 L129 436 Q143 445 143 467 Z" fill="#276E2F" stroke="#174D24" stroke-width="2"/>
    <path d="M144 464 L158 439 Q160 454 151 469 Z" fill="#276E2F" stroke="#174D24" stroke-width="2"/>
    <path d="M397 464 L407 437 Q393 442 385 463 Z" fill="#276E2F" stroke="#174D24" stroke-width="2"/>
    <path d="M382 468 L383 436 Q369 445 369 467 Z" fill="#276E2F" stroke="#174D24" stroke-width="2"/>
    <path d="M368 464 L354 439 Q352 454 361 469 Z" fill="#276E2F" stroke="#174D24" stroke-width="2"/>
    <rect x="221" y="213" width="70" height="66" rx="23" fill="url(#skinDark)" stroke="#237832" stroke-width="5"/>
    <path d="M230 238 Q256 257 282 238" stroke="#A8EB63" stroke-width="7" stroke-linecap="round" opacity="0.25"/>
    <circle cx="256" cy="145" r="119" fill="url(#skin)" stroke="#237832" stroke-width="6"/>
    <path d="M141 160 C150 229 193 260 256 264 C319 260 362 229 371 160 C363 227 319 267 256 269 C193 267 149 227 141 160 Z" fill="#216C2D" opacity="0.16"/>
    <ellipse cx="202" cy="92" rx="51" ry="27" fill="#E2FF9B" opacity="0.30" transform="rotate(-18 202 92)"/>
    <ellipse cx="170" cy="122" rx="12" ry="7" fill="#FFFFFF" opacity="0.30" transform="rotate(-20 170 122)"/>
    <circle cx="316" cy="83" r="15" fill="#3A9A36" opacity="0.55"/>
    <circle cx="338" cy="108" r="8" fill="#3A9A36" opacity="0.45"/>
    <circle cx="157" cy="155" r="9" fill="#3A9636" opacity="0.42"/>
    <circle cx="350" cy="174" r="10" fill="#398F36" opacity="0.42"/>
    <path d="M166 66 C139 48 123 25 119 8 C117 0 125 2 130 8 L194 67 Z" fill="url(#horn)" stroke="#174A25" stroke-width="6" stroke-linejoin="round"/>
    <path d="M346 66 C373 48 389 25 393 8 C395 0 387 2 382 8 L318 67 Z" fill="url(#horn)" stroke="#174A25" stroke-width="6" stroke-linejoin="round"/>
    <path d="M130 17 L165 54" stroke="#94E75C" stroke-width="9" stroke-linecap="round" opacity="0.55"/>
    <path d="M382 17 L347 54" stroke="#94E75C" stroke-width="9" stroke-linecap="round" opacity="0.5"/>
    <path d="M128 34 Q151 39 173 51" stroke="#174526" stroke-width="5" opacity="0.65"/>
    <path d="M384 34 Q361 39 339 51" stroke="#174526" stroke-width="5" opacity="0.65"/>
    <path d="M177 111 Q207 89 234 108" stroke="#286B30" stroke-width="11" stroke-linecap="round"/>
    <path d="M278 108 Q305 89 335 111" stroke="#286B30" stroke-width="11" stroke-linecap="round"/>
    <ellipse cx="207" cy="137" rx="35" ry="42" fill="url(#eyeWhite)" stroke="#277133" stroke-width="4"/>
    <ellipse cx="305" cy="137" rx="35" ry="42" fill="url(#eyeWhite)" stroke="#277133" stroke-width="4"/>
    <circle cx="212" cy="143" r="19" fill="#10181A"/>
    <circle cx="310" cy="143" r="19" fill="#10181A"/>
    <circle cx="212" cy="143" r="13" fill="#174B39"/>
    <circle cx="310" cy="143" r="13" fill="#174B39"/>
    <circle cx="219" cy="136" r="7" fill="white"/>
    <circle cx="317" cy="136" r="7" fill="white"/>
    <circle cx="207" cy="150" r="3" fill="white" opacity="0.7"/>
    <circle cx="305" cy="150" r="3" fill="white" opacity="0.7"/>
    <ellipse cx="163" cy="184" rx="25" ry="13" fill="#FF9696" opacity="0.55"/>
    <ellipse cx="349" cy="184" rx="25" ry="13" fill="#FF9696" opacity="0.55"/>
    <ellipse cx="157" cy="180" rx="7" ry="4" fill="#FFFFFF" opacity="0.55"/>
    <ellipse cx="343" cy="180" rx="7" ry="4" fill="#FFFFFF" opacity="0.55"/>
    <path d="M181 184 Q256 246 331 184 Q326 245 256 249 Q186 245 181 184 Z" fill="url(#mouth)" stroke="#101416" stroke-width="4"/>
    <path d="M184 187 Q256 238 328 187" stroke="#080A0B" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M217 211 L229 235 L241 211 Z" fill="#FFFFFF" stroke="#DDE8DD" stroke-width="2"/>
    <path d="M271 211 L283 235 L295 211 Z" fill="#FFFFFF" stroke="#DDE8DD" stroke-width="2"/>
    <ellipse cx="176" cy="88" rx="12" ry="6" fill="white" opacity="0.22" transform="rotate(-25 176 88)"/>
    <circle cx="126" cy="453" r="5" fill="white" opacity="0.25"/>
    <circle cx="386" cy="453" r="5" fill="white" opacity="0.22"/>
  </g>
</svg>`;

function buildSeedItems() {
  const raw = [
    // BODY
    { id: "body_boy_01", category: "body", name: "Body bé trai", price: 0, default: true, gender: "boy", params: { type: "boy" } },
    { id: "body_girl_01", category: "body", name: "Body bé gái", price: 0, default: true, gender: "girl", params: { type: "girl" } },
    { id: "body_custom_01", category: "body", name: "Rồng xanh", price: 200, default: false, params: { type: "custom" }, _customHtml: CUSTOM_BODY_DRAGON_SVG },

    // SKIN
    { id: "skin_01", category: "skin", name: "Trắng hồng", price: 0, default: true, params: { hex: "#FFDFC4" } },
    { id: "skin_02", category: "skin", name: "Vàng sáng", price: 50, default: false, params: { hex: "#F0C299" } },
    { id: "skin_03", category: "skin", name: "Rám nắng", price: 50, default: false, params: { hex: "#D9A066" } },
    { id: "skin_04", category: "skin", name: "Nâu đồng", price: 50, default: false, params: { hex: "#A9714F" } },
    { id: "skin_05", category: "skin", name: "Nâu sẫm", price: 50, default: false, params: { hex: "#6B4226" } },

    // FACE
    { id: "face_01", category: "face", name: "Hiền dịu", price: 0, default: true, params: { style: "gentle", emoji: "🙂" } },
    { id: "face_02", category: "face", name: "Vui tươi", price: 0, default: false, params: { style: "happy", emoji: "😄" } },
    { id: "face_03", category: "face", name: "Tinh nghịch", price: 0, default: false, params: { style: "wink", emoji: "😉" } },
    { id: "face_04", category: "face", name: "Cười to", price: 0, default: false, params: { style: "laughing", emoji: "😆" } },
    { id: "face_05", category: "face", name: "Cá tính", price: 0, default: false, params: { style: "fierce", emoji: "😠" } },

    // HAIR BOY
    { id: "hair_boy_01", category: "hair", name: "Bờm gai nâu", price: 0, default: true, gender: "boy", params: { style: "spiky", color: "#6B4226" } },
    { id: "hair_boy_02", category: "hair", name: "Bờm gai đen", price: 80, default: false, gender: "boy", params: { style: "spiky", color: "#241F1C" } },
    { id: "hair_boy_03", category: "hair", name: "Tóc rối navy", price: 80, default: false, gender: "boy", params: { style: "messy", color: "#2A3A6B" } },
    { id: "hair_boy_04", category: "hair", name: "Tóc rối bạc", price: 100, default: false, gender: "boy", params: { style: "messy", color: "#D8D8D8" } },
    { id: "hair_boy_05", category: "hair", name: "Bờm gai đỏ", price: 80, default: false, gender: "boy", params: { style: "wild", color: "#C0392B" } },
    { id: "hair_boy_06", category: "hair", name: "Chải lệch hạt dẻ", price: 80, default: false, gender: "boy", params: { style: "side", color: "#4A2E1E" } },
    { id: "hair_boy_07", category: "hair", name: "Chải lệch vàng", price: 80, default: false, gender: "boy", params: { style: "side", color: "#E8B94B" } },
    { id: "hair_boy_08", category: "hair", name: "Bờm gai lục", price: 100, default: false, gender: "boy", params: { style: "wild", color: "#2F8F5B" } },
    { id: "hair_boy_09", category: "hair", name: "Tóc rối tím", price: 100, default: false, gender: "boy", params: { style: "messy", color: "#7B4FA0" } },
    { id: "hair_boy_10", category: "hair", name: "Bờm gai ngọc lam", price: 120, default: false, gender: "boy", params: { style: "spiky", color: "#2F9E9E" } },

    // HAIR GIRL
    { id: "hair_girl_01", category: "hair", name: "Tóc dài nâu", price: 0, default: true, gender: "girl", params: { style: "long", color: "#6B4226" } },
    { id: "hair_girl_02", category: "hair", name: "Hai bím nâu", price: 80, default: false, gender: "girl", params: { style: "twin", color: "#6B4226" } },
    { id: "hair_girl_03", category: "hair", name: "Tóc xoăn hồng", price: 100, default: false, gender: "girl", params: { style: "wavy", color: "#F2A6C6" } },
    { id: "hair_girl_04", category: "hair", name: "Tóc dài vàng", price: 80, default: false, gender: "girl", params: { style: "long", color: "#E8B94B" } },
    { id: "hair_girl_05", category: "hair", name: "Tóc dài đen", price: 80, default: false, gender: "girl", params: { style: "long", color: "#241F1C" } },
    { id: "hair_girl_06", category: "hair", name: "Tóc xoăn navy", price: 100, default: false, gender: "girl", params: { style: "wavy", color: "#2A3A6B" } },
    { id: "hair_girl_07", category: "hair", name: "Tóc xoăn tím", price: 120, default: false, gender: "girl", params: { style: "wavy", color: "#7B4FA0" } },
    { id: "hair_girl_08", category: "hair", name: "Tóc tết hạt dẻ", price: 100, default: false, gender: "girl", params: { style: "braid", color: "#4A2E1E" } },
    { id: "hair_girl_09", category: "hair", name: "Tóc dài nâu nhạt", price: 80, default: false, gender: "girl", params: { style: "long", color: "#8A5A34" } },
    { id: "hair_girl_10", category: "hair", name: "Hai bím đen", price: 80, default: false, gender: "girl", params: { style: "twin", color: "#241F1C" } },

    // SHIRT BOY
    { id: "shirt_boy_01", category: "shirt", name: "Áo phông trắng", price: 0, default: true, gender: "boy", params: { style: "tee", color: "#F5F5F5" } },
    { id: "shirt_boy_02", category: "shirt", name: "Áo hoodie đen", price: 120, default: false, gender: "boy", params: { style: "hoodie", color: "#241F1C" } },
    { id: "shirt_boy_03", category: "shirt", name: "Áo hoodie đỏ", price: 120, default: false, gender: "boy", params: { style: "hoodie", color: "#C0392B" } },
    { id: "shirt_boy_04", category: "shirt", name: "Áo khoác xanh", price: 150, default: false, gender: "boy", params: { style: "jacket", color: "#3FB6E8" } },
    { id: "shirt_boy_05", category: "shirt", name: "Áo khoác đen", price: 150, default: false, gender: "boy", params: { style: "jacket", color: "#241F1C" } },
    { id: "shirt_boy_06", category: "shirt", name: "Áo hoodie vàng", price: 120, default: false, gender: "boy", params: { style: "hoodie", color: "#F2B705" } },
    { id: "shirt_boy_07", category: "shirt", name: "Áo hoodie lục", price: 120, default: false, gender: "boy", params: { style: "hoodie", color: "#2F8F5B" } },
    { id: "shirt_boy_08", category: "shirt", name: "Áo polo trắng", price: 100, default: false, gender: "boy", params: { style: "polo", color: "#F5F5F5" } },
    { id: "shirt_boy_09", category: "shirt", name: "Áo phông đen", price: 0, default: false, gender: "boy", params: { style: "tee", color: "#241F1C" } },
    { id: "shirt_boy_10", category: "shirt", name: "Áo hoodie trắng", price: 120, default: false, gender: "boy", params: { style: "hoodie", color: "#F5F5F5" } },

    // SHIRT GIRL
    { id: "shirt_girl_01", category: "shirt", name: "Áo phông nơ trắng", price: 0, default: true, gender: "girl", params: { style: "tee", color: "#F5F5F5" } },
    { id: "shirt_girl_02", category: "shirt", name: "Áo len hồng", price: 120, default: false, gender: "girl", params: { style: "sweater", color: "#F2A6C6" } },
    { id: "shirt_girl_03", category: "shirt", name: "Áo len xanh nơ", price: 120, default: false, gender: "girl", params: { style: "sweater", color: "#8FD3F4" } },
    { id: "shirt_girl_04", category: "shirt", name: "Áo hoodie đen", price: 120, default: false, gender: "girl", params: { style: "hoodie", color: "#241F1C" } },
    { id: "shirt_girl_05", category: "shirt", name: "Áo phông tim", price: 80, default: false, gender: "girl", params: { style: "tee", color: "#FDFDFD" } },
    { id: "shirt_girl_06", category: "shirt", name: "Áo cardigan vàng", price: 150, default: false, gender: "girl", params: { style: "cardigan", color: "#F2B705" } },
    { id: "shirt_girl_07", category: "shirt", name: "Áo khoác đen phối", price: 150, default: false, gender: "girl", params: { style: "jacket", color: "#241F1C" } },
    { id: "shirt_girl_08", category: "shirt", name: "Áo hoodie hồng", price: 120, default: false, gender: "girl", params: { style: "hoodie", color: "#F2A6C6" } },
    { id: "shirt_girl_09", category: "shirt", name: "Áo thủy thủ trắng", price: 100, default: false, gender: "girl", params: { style: "sailor", color: "#F5F5F5" } },
    { id: "shirt_girl_10", category: "shirt", name: "Áo thủy thủ navy", price: 100, default: false, gender: "girl", params: { style: "sailor", color: "#2A3A6B" } },

    // PANTS BOY
    { id: "pants_boy_01", category: "pants", name: "Quần short đen", price: 0, default: true, gender: "boy", params: { style: "shorts", color: "#241F1C" } },
    { id: "pants_boy_02", category: "pants", name: "Quần short xanh", price: 60, default: false, gender: "boy", params: { style: "shorts", color: "#3FB6E8" } },
    { id: "pants_boy_03", category: "pants", name: "Quần cargo be", price: 100, default: false, gender: "boy", params: { style: "cargo", color: "#D2B48C" } },
    { id: "pants_boy_04", category: "pants", name: "Quần short xám", price: 60, default: false, gender: "boy", params: { style: "shorts", color: "#9AA0A6" } },
    { id: "pants_boy_05", category: "pants", name: "Quần jean xanh", price: 100, default: false, gender: "boy", params: { style: "jeans", color: "#3B5EA6" } },
    { id: "pants_boy_06", category: "pants", name: "Quần jogger đen", price: 120, default: false, gender: "boy", params: { style: "joggers", color: "#241F1C" } },
    { id: "pants_boy_07", category: "pants", name: "Quần cargo olive", price: 100, default: false, gender: "boy", params: { style: "cargo", color: "#6E7B3B" } },
    { id: "pants_boy_08", category: "pants", name: "Quần kaki", price: 80, default: false, gender: "boy", params: { style: "jeans", color: "#C8B27A" } },
    { id: "pants_boy_09", category: "pants", name: "Quần jean đen", price: 100, default: false, gender: "boy", params: { style: "jeans", color: "#2B2B2B" } },
    { id: "pants_boy_10", category: "pants", name: "Quần short kem", price: 60, default: false, gender: "boy", params: { style: "shorts", color: "#E8DCC4" } },

    // PANTS GIRL
    { id: "pants_girl_01", category: "pants", name: "Váy xếp ly đen", price: 0, default: true, gender: "girl", params: { style: "skirt", color: "#241F1C" } },
    { id: "pants_girl_02", category: "pants", name: "Váy xếp ly trắng", price: 80, default: false, gender: "girl", params: { style: "skirt", color: "#F5F5F5" } },
    { id: "pants_girl_03", category: "pants", name: "Váy caro hồng", price: 100, default: false, gender: "girl", params: { style: "skirt", color: "#F2A6C6" } },
    { id: "pants_girl_04", category: "pants", name: "Quần short đen", price: 60, default: false, gender: "girl", params: { style: "shorts", color: "#241F1C" } },
    { id: "pants_girl_05", category: "pants", name: "Váy navy", price: 100, default: false, gender: "girl", params: { style: "skirt", color: "#2A3A6B" } },
    { id: "pants_girl_06", category: "pants", name: "Quần short hồng", price: 60, default: false, gender: "girl", params: { style: "shorts", color: "#F2A6C6" } },
    { id: "pants_girl_07", category: "pants", name: "Quần jean xanh nhạt", price: 100, default: false, gender: "girl", params: { style: "jeans", color: "#8FB8E6" } },
    { id: "pants_girl_08", category: "pants", name: "Quần cargo hồng", price: 100, default: false, gender: "girl", params: { style: "cargo", color: "#E6A5C0" } },
    { id: "pants_girl_09", category: "pants", name: "Quần jean đen", price: 100, default: false, gender: "girl", params: { style: "jeans", color: "#2B2B2B" } },
    { id: "pants_girl_10", category: "pants", name: "Váy xếp ly xanh", price: 100, default: false, gender: "girl", params: { style: "skirt", color: "#3B5EA6" } },

    // SHOES BOY
    { id: "shoes_boy_01", category: "shoes", name: "Giày thể thao xanh", price: 0, default: true, gender: "boy", params: { style: "sneaker", color: "#3B5EA6" } },
    { id: "shoes_boy_02", category: "shoes", name: "Giày thể thao đỏ", price: 80, default: false, gender: "boy", params: { style: "sneaker", color: "#C0392B" } },
    { id: "shoes_boy_03", category: "shoes", name: "Giày thể thao trắng", price: 80, default: false, gender: "boy", params: { style: "sneaker", color: "#F5F5F5" } },
    { id: "shoes_boy_04", category: "shoes", name: "Bốt đen", price: 120, default: false, gender: "boy", params: { style: "boots", color: "#241F1C" } },
    { id: "shoes_boy_05", category: "shoes", name: "Giày thể thao vàng", price: 80, default: false, gender: "boy", params: { style: "sneaker", color: "#F2B705" } },
    { id: "shoes_boy_06", category: "shoes", name: "Giày thể thao lục", price: 80, default: false, gender: "boy", params: { style: "sneaker", color: "#2F8F5B" } },
    { id: "shoes_boy_07", category: "shoes", name: "Bốt nâu", price: 120, default: false, gender: "boy", params: { style: "boots", color: "#8A5A34" } },
    { id: "shoes_boy_08", category: "shoes", name: "Giày đỏ đen", price: 100, default: false, gender: "boy", params: { style: "sneaker", color: "#8E2A2A" } },
    { id: "shoes_boy_09", category: "shoes", name: "Bốt đen cao", price: 140, default: false, gender: "boy", params: { style: "boots", color: "#3A3A3A" } },
    { id: "shoes_boy_10", category: "shoes", name: "Bốt trắng", price: 120, default: false, gender: "boy", params: { style: "boots", color: "#F0F0F0" } },

    // SHOES GIRL
    { id: "shoes_girl_01", category: "shoes", name: "Giày thể thao hồng", price: 0, default: true, gender: "girl", params: { style: "sneaker", color: "#F2A6C6" } },
    { id: "shoes_girl_02", category: "shoes", name: "Giày thể thao trắng", price: 80, default: false, gender: "girl", params: { style: "sneaker", color: "#F5F5F5" } },
    { id: "shoes_girl_03", category: "shoes", name: "Bốt đen", price: 120, default: false, gender: "girl", params: { style: "boots", color: "#241F1C" } },
    { id: "shoes_girl_04", category: "shoes", name: "Bốt hồng", price: 120, default: false, gender: "girl", params: { style: "boots", color: "#E6A5C0" } },
    { id: "shoes_girl_05", category: "shoes", name: "Giày thể thao xanh", price: 80, default: false, gender: "girl", params: { style: "sneaker", color: "#8FD3F4" } },
    { id: "shoes_girl_06", category: "shoes", name: "Bốt trắng", price: 120, default: false, gender: "girl", params: { style: "boots", color: "#F0F0F0" } },
    { id: "shoes_girl_07", category: "shoes", name: "Bốt hồng phấn", price: 140, default: false, gender: "girl", params: { style: "boots", color: "#F6C6DA" } },
    { id: "shoes_girl_08", category: "shoes", name: "Giày thể thao đen", price: 80, default: false, gender: "girl", params: { style: "sneaker", color: "#2B2B2B" } },
    { id: "shoes_girl_09", category: "shoes", name: "Bốt navy", price: 120, default: false, gender: "girl", params: { style: "boots", color: "#2A3A6B" } },
    { id: "shoes_girl_10", category: "shoes", name: "Giày thể thao vàng", price: 80, default: false, gender: "girl", params: { style: "sneaker", color: "#F2B705" } },

    // HAT
    { id: "hat_01", category: "hat", name: "Không đội mũ", price: 0, default: true, params: { style: "none" } },
    { id: "hat_02", category: "hat", name: "Mũ lưỡi trai xanh", price: 100, default: false, params: { style: "cap", color: "#3FB6E8" } },
    { id: "hat_03", category: "hat", name: "Mũ lưỡi trai đen", price: 100, default: false, params: { style: "cap", color: "#241F1C" } },
    { id: "hat_04", category: "hat", name: "Mũ lưỡi trai đỏ", price: 100, default: false, params: { style: "cap", color: "#C0392B" } },
    { id: "hat_05", category: "hat", name: "Mũ len đen", price: 80, default: false, params: { style: "beanie", color: "#241F1C" } },
    { id: "hat_06", category: "hat", name: "Mũ bucket vàng", price: 120, default: false, params: { style: "bucket", color: "#F2B705" } },
    { id: "hat_07", category: "hat", name: "Mũ bucket lục", price: 120, default: false, params: { style: "bucket", color: "#2F8F5B" } },
    { id: "hat_08", category: "hat", name: "Mũ nồi cao", price: 150, default: false, params: { style: "tophat", color: "#241F1C" } },
    { id: "hat_09", category: "hat", name: "Mũ rơm", price: 100, default: false, params: { style: "sunhat", color: "#E8B94B" } },

    // GLASSES
    { id: "glasses_01", category: "glasses", name: "Không đeo kính", price: 0, default: true, params: { style: "none" } },
    { id: "glasses_02", category: "glasses", name: "Kính tròn đen", price: 80, default: false, params: { style: "round", color: "#241F1C" } },
    { id: "glasses_03", category: "glasses", name: "Kính tròn vàng", price: 80, default: false, params: { style: "round", color: "#C99A2E" } },
    { id: "glasses_04", category: "glasses", name: "Kính trái tim", price: 120, default: false, params: { style: "heart", color: "#FF5DA2" } },
    { id: "glasses_05", category: "glasses", name: "Kính râm vuông", price: 100, default: false, params: { style: "sun", color: "#1C1C1C" } },
    { id: "glasses_06", category: "glasses", name: "Kính mắt mèo hồng", price: 120, default: false, params: { style: "cat", color: "#FF5DA2" } },
    { id: "glasses_07", category: "glasses", name: "Kính mắt mèo đen", price: 120, default: false, params: { style: "cat", color: "#241F1C" } },
    { id: "glasses_08", category: "glasses", name: "Kính ngôi sao", price: 150, default: false, params: { style: "star", color: "#F2B705" } },

    // ACCESSORY
    { id: "accessory_01", category: "accessory", name: "Không có", price: 0, default: true, params: { style: "none" } },
    { id: "accessory_02", category: "accessory", name: "Tai nghe xanh", price: 150, default: false, params: { style: "headphones", color: "#3FB6E8" } },
    { id: "accessory_03", category: "accessory", name: "Tai nghe hồng", price: 150, default: false, params: { style: "headphones", color: "#FF5DA2" } },
    { id: "accessory_04", category: "accessory", name: "Khăn quàng đỏ", price: 80, default: false, params: { style: "scarf", color: "#C0392B" } },
    { id: "accessory_05", category: "accessory", name: "Khăn quàng trắng", price: 80, default: false, params: { style: "scarf", color: "#F5F5F5" } },
    { id: "accessory_06", category: "accessory", name: "Khẩu trang đen", price: 60, default: false, params: { style: "mask", color: "#241F1C" } },
    { id: "accessory_07", category: "accessory", name: "Balo xanh", price: 200, default: false, params: { style: "backpack", color: "#3FB6E8" } },
    { id: "accessory_08", category: "accessory", name: "Balo hồng", price: 200, default: false, params: { style: "backpack", color: "#FF5DA2" } },
    { id: "accessory_09", category: "accessory", name: "Tai mèo đen", price: 120, default: false, params: { style: "ears", color: "#241F1C" } },
    { id: "accessory_10", category: "accessory", name: "Cánh thiên thần", price: 300, default: false, params: { style: "wings", color: "#FFFFFF" } },
    { id: "accessory_11", category: "accessory", name: "Cánh dơi đen", price: 300, default: false, params: { style: "wings", color: "#241F1C" } },
  ];

  // Pre-render html for each item using server-side renderer
  return raw.map(item => {
    const { _customHtml, ...rest } = item;
    return {
      ...rest,
      html: _customHtml || renderItemHtml(item.category, item.params || {}),
    };
  });
}

async function ensureSeeded(force = false) {
  if (force) {
    await getCollection(ITEMS).deleteMany({});
  }
  const count = await getCollection(ITEMS).countDocuments();
  if (count === 0) {
    const items = buildSeedItems();
    if (items.length > 0) {
      await getCollection(ITEMS).insertMany(items.map(i => ({ ...i })));
    }
  } else {
    // Add body items if missing (migration for existing DBs)
    const bodyCount = await getCollection(ITEMS).countDocuments({ category: "body" });
    if (bodyCount === 0) {
      const bodyItems = buildSeedItems().filter(i => i.category === "body");
      if (bodyItems.length > 0) {
        await getCollection(ITEMS).insertMany(bodyItems.map(i => ({ ...i })));
      }
    }
  }
}

async function ensureTemplate() {
  const existing = await getCollection(TEMPLATE).findOne({ _id: "default" });
  if (!existing) {
    await getCollection(TEMPLATE).insertOne({ _id: "default", categories: DEFAULT_TEMPLATE });
  }
}

// ─── PUBLIC ──────────────────────────────────────────────────────

router.get("/categories", (_req, res) => {
  sendSuccess(res, { categories: CATEGORIES, layerOrder: LAYER_ORDER });
});

router.get("/items", async (req, res, next) => {
  try {
    await ensureSeeded();
    await ensureTemplate();
    let items = await getCollection(ITEMS).find({}).sort({ category: 1, price: 1 }).toArray();
    const q = (req.query.query || "").trim().toLowerCase();
    if (q) {
      items = items.filter(it =>
        (it.name || "").toLowerCase().includes(q) ||
        (it.id || "").toLowerCase().includes(q) ||
        (it.category || "").toLowerCase().includes(q)
      );
    }
    const tmpl = await getCollection(TEMPLATE).findOne({ _id: "default" });
    sendSuccess(res, {
      items,
      categories: CATEGORIES,
      layerOrder: LAYER_ORDER,
      template: tmpl?.categories || DEFAULT_TEMPLATE,
    });
  } catch (e) { next(e); }
});

router.get("/template", async (_req, res, next) => {
  try {
    await ensureTemplate();
    const tmpl = await getCollection(TEMPLATE).findOne({ _id: "default" });
    sendSuccess(res, { template: tmpl?.categories || DEFAULT_TEMPLATE });
  } catch (e) { next(e); }
});

router.get("/body", async (req, res, next) => {
  try {
    await ensureSeeded();
    const { gender, type } = req.query || {};
    const query = { category: "body" };
    if (gender) query.gender = gender;
    if (type) query["params.type"] = type;
    const items = await getCollection(ITEMS).find(query).sort({ price: 1 }).toArray();
    sendSuccess(res, { items });
  } catch (e) { next(e); }
});

router.put("/template", authenticate, async (req, res, next) => {
  try {
    const { categories } = req.body || {};
    if (!categories || typeof categories !== "object") return sendError(res, "Thiếu categories", 400);
    await getCollection(TEMPLATE).updateOne(
      { _id: "default" },
      { $set: { categories } },
      { upsert: true }
    );
    sendSuccess(res, { template: categories });
  } catch (e) { next(e); }
});

router.get("/inventory", authenticate, async (req, res, next) => {
  try {
    const user = await getCollection(USERS).findOne({ id: req.user.sub });
    if (!user) return sendError(res, "Không tìm thấy người dùng", 404);
    sendSuccess(res, { inventory: user.inventory || [] });
  } catch (e) { next(e); }
});

router.get("/loadout", authenticate, async (req, res, next) => {
  try {
    const user = await getCollection(USERS).findOne({ id: req.user.sub });
    if (!user) return sendError(res, "Không tìm thấy người dùng", 404);
    sendSuccess(res, { loadout: user.avatarLoadout || DEFAULT_LOADOUT });
  } catch (e) { next(e); }
});

router.post("/buy", authenticate, async (req, res, next) => {
  try {
    const { itemId } = req.body || {};
    if (!itemId) return sendError(res, "Thiếu itemId", 400);
    await ensureSeeded();
    const item = await getCollection(ITEMS).findOne({ id: itemId });
    if (!item) return sendError(res, "Item không tồn tại", 404);
    const user = await getCollection(USERS).findOne({ id: req.user.sub });
    if (!user) return sendError(res, "Không tìm thấy người dùng", 404);
    if (item.price === 0 || item.default) {
      return sendSuccess(res, { owned: true, inventory: user.inventory || [], coins: user.coins || 0 });
    }
    if ((user.inventory || []).includes(itemId)) {
      return sendSuccess(res, { owned: true, inventory: user.inventory, coins: user.coins || 0 });
    }
    const coins = user.coins || 0;
    if (coins < item.price) return sendError(res, `Không đủ coin. Cần ${item.price}, bạn có ${coins}`, 400);
    const newCoins = coins - item.price;
    const newInventory = [...(user.inventory || []), itemId];
    await getCollection(USERS).updateOne({ id: req.user.sub }, { $set: { coins: newCoins, inventory: newInventory } });
    sendSuccess(res, { owned: true, inventory: newInventory, coins: newCoins });
  } catch (e) { next(e); }
});

router.post("/save", authenticate, async (req, res, next) => {
  try {
    const { loadout } = req.body || {};
    if (!loadout || typeof loadout !== "object") return sendError(res, "Thiếu loadout", 400);
    await ensureSeeded();
    const user = await getCollection(USERS).findOne({ id: req.user.sub });
    if (!user) return sendError(res, "Không tìm thấy người dùng", 404);
    const inventory = user.inventory || [];
    for (const [layer, itemId] of Object.entries(loadout)) {
      if (itemId === null) continue;
      if (!LAYER_ORDER.includes(layer)) return sendError(res, `Layer không hợp lệ: ${layer}`, 400);
      const item = await getCollection(ITEMS).findOne({ id: itemId });
      if (!item) return sendError(res, `Item không tồn tại: ${itemId}`, 400);
      if (item.category !== layer) return sendError(res, `Item ${itemId} không thuộc layer ${layer}`, 400);
      if (item.price > 0 && !item.default && !inventory.includes(itemId)) {
        return sendError(res, `Bạn chưa sở hữu item: ${item.name}`, 400);
      }
    }
    await getCollection(USERS).updateOne({ id: req.user.sub }, { $set: { avatarLoadout: loadout } });
    sendSuccess(res, { loadout });
  } catch (e) { next(e); }
});

// ─── ADMIN ITEMS CRUD ────────────────────────────────────────────

const uid = () => `av-${Math.random().toString(36).slice(2, 9)}`;

router.post("/admin/items", authenticate, async (req, res, next) => {
  try {
    const { category, name, params, price, default: isDefault, gender, html } = req.body || {};
    if (!category || !name) return sendError(res, "Thiếu category hoặc name", 400);
    if (!CATEGORIES.find(c => c.id === category)) return sendError(res, "Category không hợp lệ", 400);
    const p = params || {};
    const item = {
      id: uid(), category, name: String(name).trim(),
      html: (html !== undefined && html !== null) ? String(html) : renderItemHtml(category, p),
      params: p, price: Math.max(0, Number(price) || 0), default: !!isDefault,
      ...(gender ? { gender } : {}),
    };
    await getCollection(ITEMS).insertOne(item);
    sendCreated(res, item);
  } catch (e) { next(e); }
});

router.put("/admin/items/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await getCollection(ITEMS).findOne({ id });
    if (!existing) return sendError(res, "Item không tồn tại", 404);
    const { category, name, params, price, default: isDefault, gender, html } = req.body || {};
    const updates = {};
    if (category !== undefined) { if (!CATEGORIES.find(c => c.id === category)) return sendError(res, "Category không hợp lệ", 400); updates.category = category; }
    if (name !== undefined) updates.name = String(name).trim();
    if (params !== undefined) updates.params = params;
    if (price !== undefined) updates.price = Math.max(0, Number(price) || 0);
    if (isDefault !== undefined) updates.default = !!isDefault;
    if (gender !== undefined) updates.gender = gender;
    if (html !== undefined && html !== null) {
      updates.html = String(html);
    } else {
      const cat = updates.category || existing.category;
      const p = updates.params || existing.params || {};
      updates.html = renderItemHtml(cat, p);
    }
    if (Object.keys(updates).length === 0) return sendError(res, "Không có gì để cập nhật", 400);
    await getCollection(ITEMS).updateOne({ id }, { $set: updates });
    const updated = await getCollection(ITEMS).findOne({ id });
    sendSuccess(res, updated);
  } catch (e) { next(e); }
});

router.post("/admin/items/batch", authenticate, async (req, res, next) => {
  try {
    const { items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) return sendError(res, "Thiếu items array", 400);
    if (items.length > 100) return sendError(res, "Tối đa 100 item mỗi lần", 400);
    const created = [];
    for (const it of items) {
      const { category, name, params, price, default: isDefault, gender } = it || {};
      if (!category || !name) return sendError(res, "Thiếu category hoặc name", 400);
      if (!CATEGORIES.find(c => c.id === category)) return sendError(res, `Category không hợp lệ: ${category}`, 400);
      const p = params || {};
      const item = {
        id: uid(), category, name: String(name).trim(),
        html: renderItemHtml(category, p),
        params: p, price: Math.max(0, Number(price) || 0), default: !!isDefault,
        ...(gender ? { gender } : {}),
      };
      await getCollection(ITEMS).insertOne(item);
      created.push(item);
    }
    sendCreated(res, { items: created, count: created.length });
  } catch (e) { next(e); }
});

router.delete("/admin/items/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await getCollection(ITEMS).findOne({ id });
    if (!existing) return sendError(res, "Item không tồn tại", 404);
    if (existing.default) return sendError(res, "Không thể xóa item mặc định", 400);
    await getCollection(ITEMS).deleteOne({ id });
    sendSuccess(res, { deleted: id });
  } catch (e) { next(e); }
});

// ─── ADMIN: RESET ITEMS ──────────────────────────────────────────

router.post("/admin/reset-items", authenticate, async (_req, res, next) => {
  try {
    await ensureSeeded(true);
    sendSuccess(res, { message: "Đã xóa tất cả items và seed lại từ đầu" });
  } catch (e) { next(e); }
});

router.delete("/admin/items", authenticate, async (_req, res, next) => {
  try {
    const result = await getCollection(ITEMS).deleteMany({});
    sendSuccess(res, { message: "Đã xóa toàn bộ items", deletedCount: result.deletedCount });
  } catch (e) { next(e); }
});

// ─── ADMIN: BODY CRUD ────────────────────────────────────────────

router.post("/admin/body", authenticate, async (req, res, next) => {
  try {
    const { name, type, price, default: isDefault, gender, html } = req.body || {};
    if (!name) return sendError(res, "Thiếu tên body", 400);
    const item = {
      id: uid(), category: "body", name: String(name).trim(),
      params: { type: String(type || "custom").trim() },
      html: html ? String(html) : renderItemHtml("body", {}),
      price: Math.max(0, Number(price) || 0), default: !!isDefault,
      ...(gender ? { gender } : {}),
    };
    await getCollection(ITEMS).insertOne(item);
    sendCreated(res, item);
  } catch (e) { next(e); }
});

router.put("/admin/body/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await getCollection(ITEMS).findOne({ id });
    if (!existing) return sendError(res, "Body không tồn tại", 404);
    const { name, type, price, default: isDefault, gender, html } = req.body || {};
    const updates = {};
    if (name !== undefined) updates.name = String(name).trim();
    if (type !== undefined) updates.params = { ...(existing.params || {}), type: String(type).trim() };
    if (price !== undefined) updates.price = Math.max(0, Number(price) || 0);
    if (isDefault !== undefined) updates.default = !!isDefault;
    if (gender !== undefined) updates.gender = gender;
    if (html !== undefined && html !== null) updates.html = String(html);
    if (Object.keys(updates).length === 0) return sendError(res, "Không có gì để cập nhật", 400);
    await getCollection(ITEMS).updateOne({ id }, { $set: updates });
    const updated = await getCollection(ITEMS).findOne({ id });
    sendSuccess(res, updated);
  } catch (e) { next(e); }
});

router.delete("/admin/body/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await getCollection(ITEMS).findOne({ id });
    if (!existing) return sendError(res, "Body không tồn tại", 404);
    if (existing.default) return sendError(res, "Không thể xóa body mặc định", 400);
    await getCollection(ITEMS).deleteOne({ id });
    sendSuccess(res, { deleted: id });
  } catch (e) { next(e); }
});

export default router;
