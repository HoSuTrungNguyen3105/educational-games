// components/pet/PetAvatar.jsx
//
// Avatar pet ở kích thước nhỏ — dùng chung cho trang chủ, Profile, bảng xếp
// hạng, HUD game… Không nơi nào tự vẽ lại pet.
//
// VẼ BẰNG `look` (bộ đồ DressUp trong hồ sơ) qua `DressUpAvatar` — cùng nguồn
// SVG với trang Profile và game "Tiệm thay đồ thú cưng". Trước đây component này
// ghép lớp theo `species`/`color`/`outfits` của `userPets` (hệ cũ, id trang phục
// không trùng hệ mới) nên sửa pet ở Profile xong ra home vẫn thấy con thú mặc
// định. Bỏ trống `look` → DressUpAvatar tự về bộ mặc định của EG_DRESSUP, giống
// hệt cách trang Profile hiện.
//
// Cấp / EXP / tâm tính vẫn lấy từ store pet (`lib/petApi.js`), chỉ diện mạo là
// đổi nguồn.

import { useEffect } from "react";
import { usePet, loadPet } from "../../lib/petApi.js";
import DressUpAvatar from "../avatar/DressUpAvatar.jsx";

/** Kích thước có sẵn → px. Vẫn nhận `size` số bất kỳ. */
const SIZES = { xs: 32, sm: 48, md: 72, lg: 104, xl: 140 };

export default function PetAvatar({
  size = "md",
  className = "",
  ring = true,
  bounce = false,
  ariaLabel,
}) {
  const pet = usePet();

  // Nạp 1 lần: nơi gọi chỉ hiện avatar, không chịu trách nhiệm tải dữ liệu.
  useEffect(() => { loadPet(); }, []);

  const px = typeof size === "number" ? size : (SIZES[size] ?? SIZES.md);

  const body = (
    <DressUpAvatar
      kind="pet"
      state={pet?.look}
      size={px}
      className={bounce ? "float-slow" : ""}
      label={ariaLabel || pet?.name || "Thú cưng"}
    />
  );

  if (!ring) return body;

  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-orange-50 ${className}`}
      style={{ width: px, height: px, boxShadow: "0 0 0 3px #FFD257, 0 4px 10px rgba(0,0,0,.12)" }}
    >
      {body}
      {pet?.level != null && (
        <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-amber-300 bg-white px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-amber-600 shadow-sm">
          Lv {pet.level}
        </span>
      )}
    </span>
  );
}

export { SIZES as PET_AVATAR_SIZES };
