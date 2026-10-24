// services/petService.js
//
// Lớp giao diện nghiệp vụ cho hệ thống thú cưng.
//
// VÌ SAO KHÔNG TỰ GỌI `fetch`:
//   `lib/petApi.js` đã là store + HTTP client duy nhất cho pet (có cache
//   localStorage, fallback khi offline, tự đọc token từ userAuth store). Tạo
//   thêm một lớp fetch thứ hai sẽ phải nhân bản token, xử lý lỗi và envelope
//   response — đúng thứ đề bài cấm. Service này chỉ gom các thao tác cấp cao,
//   mọi request vẫn đi qua petApi.
//
// API backend đang dùng (xem server/src/routes/pet.js):
//   GET  /api/pet            → pet (cấp/EXP/tâm tính/tên) + `look` DressUp
//   PUT  /api/pet            → đổi tên (loài/màu/trang phục legacy: vẫn nhận
//                              nhưng không màn hình nào vẽ nữa)
//   POST /api/pet/exp        → cộng EXP
//   PUT  /api/auth/me { pet } → lưu bộ đồ DressUp đang hiển thị (saveLook)
//
// DIỆN MẠO CHỈ CÓ MỘT NGUỒN: `pet.look` (bộ đồ DressUp trong hồ sơ), cùng nguồn
// với trang Profile và game "Tiệm thay đồ thú cưng". Kho đồ legacy theo 7 ô của
// `userPets` (hat/scarf/glasses/shirt/bow/cape/backpack, id kiểu `hat_crown_01`)
// đã gỡ khỏi app: hai hệ không trùng id nào nên để nó sống là có một chỗ sửa mà
// không nơi nào hiển thị. Hình vẽ của hệ legacy vẫn còn cho trang quản lý danh
// mục (`PetCatalogManagement`).

import {
  usePet, getPet, getCatalog, loadPet, updateLook, saveLook, petLook,
  unlockedFor, catalogView, randomPetTip, moodLabel, subscribePet,
} from "../lib/petApi.js";

/* ── Hook ─────────────────────────────────────────────────────────────────── */

export { usePet };

/** Nạp pet (kèm diện mạo từ hồ sơ). Gọi một lần khi vào màn hình. */
export { loadPet, petLook };

/**
 * Mặc một bộ đồ DressUp: { animal, shirt, glasses, hat, neck }.
 * Trả { ok, error?, pet, local? } để UI biết báo gì — `local: true` nghĩa là
 * chỉ lưu được trên máy (offline / chưa đăng nhập).
 */
export async function wear(value) {
  return saveLook(value);
}

/* ── Kênh đọc ngoài React ─────────────────────────────────────────────────── */

// Dùng lại đúng kênh của store, không tạo kênh thứ hai.
export {
  subscribePet, getPet, getCatalog, updateLook, unlockedFor,
  catalogView, randomPetTip, moodLabel,
};
