// components/pet/PetPreview.jsx
//
// XEM TRƯỚC trang phục — component THUẦN HIỂN THỊ.
//
// Trước đây component này tự giữ một bản nháp riêng (`draft`) và tự gọi API.
// Trang kho đồ (`PetWardrobePage`) cũng giữ nháp riêng qua `useOutfitDraft` rồi
// truyền `onSave` xuống — hai nguồn sự thật cùng lúc nên bản nháp của trang
// không bao giờ hiện lên, và nút "Lưu" luôn ở trạng thái disabled.
//
// Nay chỉ còn MỘT nơi giữ nháp: trang kho đồ. Component này nhận
// `outfits` đã bao gồm cả phần đang thử và chỉ vẽ ra.
//
// Nguyên tắc giữ nguyên (mục 9 + 13 của đề bài):
//   • Trạng thái xem trước KHÔNG phải dữ liệu chính thức.
//   • Chỉ gọi API khi người chơi bấm "Lưu" (trang kho đồ lo phần này).
//   • API lỗi → trang kho đồ bỏ nháp, UI quay về đúng dữ liệu đang lưu.

import { useMemo } from "react";
import { usePet } from "../../services/petService.js";
import PetRenderer from "./PetRenderer.jsx";
import { getOutfitAsset } from "../../data/petAssets.js";

/**
 * @param {object}  props
 * @param {object}  [props.outfits]     bộ trang phục cần hiển thị (gồm cả bản thử)
 * @param {number}  [props.size]
 * @param {boolean} [props.showName]    hiện tên các món đang mặc bên dưới
 */
export default function PetPreview({
  outfits,
  size = 180,
  className = "",
  showName = true,
}) {
  const pet = usePet();
  const shownOutfits = useMemo(
    () => outfits ?? pet?.outfits ?? {},
    [outfits, pet?.outfits],
  );

  // Danh sách món đang mặc — hiện tên để người chơi biết mình đang thử gì.
  const trying = useMemo(
    () =>
      Object.entries(shownOutfits || {})
        .map(([slot, raw]) => {
          const id = typeof raw === "string" ? raw : raw?.id;
          if (!id) return null;
          const asset = getOutfitAsset(id);
          return asset ? { slot, id, name: asset.name } : null;
        })
        .filter(Boolean),
    [shownOutfits],
  );

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className="relative grid place-items-center rounded-full bg-gradient-to-br from-amber-50 to-orange-100"
        style={{ width: size, height: size, boxShadow: "0 0 0 4px #FFD257, 0 8px 20px rgba(0,0,0,.12)" }}
      >
        <PetRenderer
          species={pet?.species}
          color={pet?.color}
          outfits={shownOutfits}
          mood={pet?.mood}
          size={Math.round(size * 0.82)}
          ariaLabel={`Xem trước ${pet?.name || "thú cưng"}`}
        />
      </div>

      {showName && trying.length > 0 && (
        <p className="max-w-[240px] text-center text-[11px] font-semibold text-slate-500">
          {trying.map((t) => t.name).join(" · ")}
        </p>
      )}
    </div>
  );
}
