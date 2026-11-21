/**
 * characterBodies.js — catalog nhân vật chibi giả lập 3D (đặc tả
 * `h_ng_d_n_tri_n_khai_ho_t_nh_nh_n_v_t_gi_l_p_3d_rive_spine.md`).
 *
 * MỖI entry ánh xạ 1-1 tới một body THẬT của hệ avatar đang chạy
 * (EG_DRESSUP — `src/games/_shared/lib/dressUpAvatarData.js`): `id` chính là
 * mã body trong bộ đồ đã lưu của học sinh (`users.avatar.body`), `name` và
 * `compatibleSlots` lấy đúng từ registry body đó, nên chọn/lưu ở catalog
 * này khớp tuyệt đối với modal tuỳ chỉnh và 2 game tiệm thời trang.
 *
 * TRẠNG THÁI RIVE (trung thực): repo CHƯA có file `.riv` nào — chưa ai vẽ
 * animation bằng Rive Editor. `riveFile` khai sẵn đường dẫn quy ước
 * `public/animations/characters/<id>.riv`; CharacterStage tự dò file:
 * có file thì chạy Rive (state machine `MainStateMachine`, inputs
 * mood/turnX/triggerCelebrate), chưa có thì chạy fallback. Muốn kích hoạt
 * Rive cho một body: chỉ cần thả đúng file .riv vào đường dẫn đó, KHÔNG
 * sửa code. `fallbackImg` là artwork SVG thật của body (vẽ bằng chính
 * dữ liệu EG_DRESSUP, sinh bởi `node scripts/export-character-bodies.mjs` —
 * script đó cũng kiểm tra catalog không trôi khỏi dữ liệu body thật).
 *
 * Nhóm: human = người/nghề nghiệp/cổ tích (27), creature = sinh vật/
 * quái vật dễ thương (11), mech = cơ khí (2). Tổng 40 body.
 */

export const CHARACTER_BODIES = [
  {
    id: "body_01", name: "Bé trai", group: "human",
    riveFile: "/animations/characters/body_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_girl_01", name: "Bé gái", group: "human",
    riveFile: "/animations/characters/body_girl_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_girl_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_rider_01", name: "Kamen Rider", group: "human",
    riveFile: "/animations/characters/body_rider_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_rider_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_superman_01", name: "Superman", group: "human",
    riveFile: "/animations/characters/body_superman_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_superman_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_kaiju_01", name: "Kaiju", group: "creature",
    riveFile: "/animations/characters/body_kaiju_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_kaiju_01.svg",
    supportsTurn: true,
    compatibleSlots: ["glasses", "hat", "acc"],
  },
  {
    id: "body_ghost_01", name: "Bóng ma", group: "creature",
    riveFile: "/animations/characters/body_ghost_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_ghost_01.svg",
    supportsTurn: true,
    compatibleSlots: ["hat", "acc"],
  },
  {
    id: "body_popstar_01", name: "Ngôi sao nhạc pop", group: "human",
    riveFile: "/animations/characters/body_popstar_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_popstar_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "glasses", "hat", "acc"],
  },
  {
    id: "body_dragon_01", name: "Rồng xanh", group: "creature",
    riveFile: "/animations/characters/body_dragon_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_dragon_01.svg",
    supportsTurn: true,
    compatibleSlots: [],
  },
  {
    id: "body_astronaut_01", name: "Phi hành gia", group: "human",
    riveFile: "/animations/characters/body_astronaut_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_astronaut_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_ninja_01", name: "Ninja", group: "human",
    riveFile: "/animations/characters/body_ninja_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_ninja_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_robot_01", name: "Robot thân thiện", group: "mech",
    riveFile: "/animations/characters/body_robot_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_robot_01.svg",
    supportsTurn: true,
    compatibleSlots: ["glasses", "hat", "acc"],
  },
  {
    id: "body_pirate_01", name: "Cướp biển", group: "human",
    riveFile: "/animations/characters/body_pirate_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_pirate_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_vampire_01", name: "Ma cà rồng", group: "human",
    riveFile: "/animations/characters/body_vampire_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_vampire_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_doctor_01", name: "Bác sĩ", group: "human",
    riveFile: "/animations/characters/body_doctor_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_doctor_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_firefighter_01", name: "Lính cứu hỏa", group: "human",
    riveFile: "/animations/characters/body_firefighter_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_firefighter_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_teacher_01", name: "Giáo viên", group: "human",
    riveFile: "/animations/characters/body_teacher_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_teacher_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_police_01", name: "Cảnh sát", group: "human",
    riveFile: "/animations/characters/body_police_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_police_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_chef_01", name: "Đầu bếp", group: "human",
    riveFile: "/animations/characters/body_chef_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_chef_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_pilot_01", name: "Phi công", group: "human",
    riveFile: "/animations/characters/body_pilot_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_pilot_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_prince_01", name: "Hoàng tử", group: "human",
    riveFile: "/animations/characters/body_prince_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_prince_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_princess_01", name: "Công chúa", group: "human",
    riveFile: "/animations/characters/body_princess_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_princess_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_knight_01", name: "Hiệp sĩ", group: "human",
    riveFile: "/animations/characters/body_knight_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_knight_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_witch_01", name: "Phù thủy", group: "human",
    riveFile: "/animations/characters/body_witch_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_witch_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_fairy_01", name: "Tiên", group: "human",
    riveFile: "/animations/characters/body_fairy_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_fairy_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_skeleton_01", name: "Bộ xương", group: "creature",
    riveFile: "/animations/characters/body_skeleton_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_skeleton_01.svg",
    supportsTurn: true,
    compatibleSlots: ["hair", "hairColor", "glasses", "hat", "acc", "shirt", "dress", "pants", "shoes"],
  },
  {
    id: "body_snowman_01", name: "Người tuyết", group: "creature",
    riveFile: "/animations/characters/body_snowman_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_snowman_01.svg",
    supportsTurn: true,
    compatibleSlots: ["glasses", "hat", "acc"],
  },
  {
    id: "body_santa_01", name: "Ông già Noel", group: "human",
    riveFile: "/animations/characters/body_santa_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_santa_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_ghost_halloween_01", name: "Ma Halloween", group: "creature",
    riveFile: "/animations/characters/body_ghost_halloween_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_ghost_halloween_01.svg",
    supportsTurn: true,
    compatibleSlots: ["glasses", "hat", "acc"],
  },
  {
    id: "body_mermaid_01", name: "Nàng tiên cá", group: "creature",
    riveFile: "/animations/characters/body_mermaid_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_mermaid_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "glasses", "hat", "acc"],
  },
  {
    id: "body_werewolf_01", name: "Người sói", group: "creature",
    riveFile: "/animations/characters/body_werewolf_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_werewolf_01.svg",
    supportsTurn: true,
    compatibleSlots: ["hair", "hairColor", "glasses", "hat", "acc", "shirt", "dress", "pants", "shoes"],
  },
  {
    id: "body_elf_01", name: "Tiên rừng", group: "human",
    riveFile: "/animations/characters/body_elf_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_elf_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_genie_01", name: "Thần đèn", group: "creature",
    riveFile: "/animations/characters/body_genie_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_genie_01.svg",
    supportsTurn: true,
    compatibleSlots: ["face", "hair", "hairColor", "glasses", "hat", "acc"],
  },
  {
    id: "body_dino_01", name: "Khủng long", group: "creature",
    riveFile: "/animations/characters/body_dino_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_dino_01.svg",
    supportsTurn: true,
    compatibleSlots: ["glasses", "hat", "acc"],
  },
  {
    id: "body_alien_01", name: "Người ngoài hành tinh", group: "creature",
    riveFile: "/animations/characters/body_alien_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_alien_01.svg",
    supportsTurn: true,
    compatibleSlots: ["glasses", "hat", "acc"],
  },
  {
    id: "body_cyborg_01", name: "Cyborg", group: "mech",
    riveFile: "/animations/characters/body_cyborg_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_cyborg_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_samurai_01", name: "Samurai", group: "human",
    riveFile: "/animations/characters/body_samurai_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_samurai_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_cowboy_01", name: "Cao bồi", group: "human",
    riveFile: "/animations/characters/body_cowboy_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_cowboy_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_artist_01", name: "Họa sĩ", group: "human",
    riveFile: "/animations/characters/body_artist_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_artist_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_scientist_01", name: "Nhà khoa học", group: "human",
    riveFile: "/animations/characters/body_scientist_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_scientist_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
  {
    id: "body_ballerina_01", name: "Vũ công ballet", group: "human",
    riveFile: "/animations/characters/body_ballerina_01.riv",
    artboard: "CharacterArtboard", stateMachine: "MainStateMachine",
    fallbackImg: "/avatars/bodies/body_ballerina_01.svg",
    supportsTurn: true,
    compatibleSlots: ["skin", "face", "hair", "hairColor", "shirt", "dress", "pants", "shoes", "glasses", "hat", "acc"],
  },
];

const BY_ID = new Map(CHARACTER_BODIES.map((b) => [b.id, b]));

/** Tra cứu một body theo id (mã body trong bộ đồ đã lưu). */
export function getCharacterBody(id) {
  return BY_ID.get(id) || null;
}

/**
 * Ghép đường dẫn public (riveFile/fallbackImg khai dạng tuyệt đối `/...`)
 * với BASE_URL của bản build — app deploy dưới subpath nên không dùng
 * thẳng đường dẫn gốc được.
 */
export function characterPublicUrl(path) {
  if (!path) return path;
  const base = import.meta.env.BASE_URL || "/";
  return path.startsWith("/") ? base + path.slice(1) : path;
}

/** Body mặc định: đúng body mở màn hiện tại của hệ avatar (bé trai). */
export const DEFAULT_CHARACTER_BODY_ID = "body_01";
