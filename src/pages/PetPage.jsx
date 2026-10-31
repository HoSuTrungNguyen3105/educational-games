// pages/PetPage.jsx
//
// Trang "Thú cưng của tôi": xem cấp / EXP / tâm tính, đổi tên và mở bộ tuỳ chỉnh
// diện mạo.
//
// Diện mạo hiển thị = `pet.look` (bộ đồ DressUp trong hồ sơ), vẽ qua
// `components/pet/PetAvatar.jsx` → `DressUpAvatar`. Cùng một nguồn với trang
// Profile và game "Tiệm thay đồ thú cưng", nên sửa ở đâu thì home, HUD game và
// bảng xếp hạng đều hiện giống nhau. Chỉnh thì mở `DressUpCustomizer` ở
// `/pet-wardrobe` — không còn bộ chọn loài/màu legacy (id trang phục hệ cũ
// không trùng hệ mới nên để hai nơi cùng sửa là lại sinh ra hai con pet).

import { useEffect, useMemo, useState } from "react";
import { Shirt } from "lucide-react";
import { navigate } from "../lib/router.js";
import PetAvatar from "../components/pet/PetAvatar.jsx";
import {
  usePet, loadPet, updateLook, catalogView, randomPetTip, moodLabel,
} from "../services/petService.js";
import { outfitName, describeOutfit } from "../lib/dressUpAvatar.js";

export default function PetPage() {
  const pet = usePet();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [nameDraft, setNameDraft] = useState(pet.name || "");

  useEffect(() => { loadPet(); }, []);

  // Đồng bộ ô nhập tên theo pet từ store, nhưng không phá chữ đang gõ.
  const [lastName, setLastName] = useState(pet.name || "");
  if (pet.name && pet.name !== lastName) {
    setLastName(pet.name);
    setNameDraft(pet.name);
  }

  const wearing = useMemo(() => describeOutfit("pet", pet.look), [pet.look]);
  const animalName = useMemo(() => outfitName("pet", pet.look) || "Thú cưng", [pet.look]);

  async function save(patch, successMsg) {
    setBusy(true);
    setMsg(null);
    const res = await updateLook(patch);
    setBusy(false);
    setMsg(res.ok ? { type: "ok", text: successMsg } : { type: "err", text: res.error || "Không lưu được" });
    return res.ok;
  }

  async function saveName() {
    const n = nameDraft.trim();
    if (!n || n === pet.name) return;
    await save({ name: n }, `Đặt tên "${n}" xong!`);
  }

  const offline = typeof navigator !== "undefined" && navigator.onLine === false;

  return (
    <div className="min-h-full bg-paper pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 bg-paper/95 px-4 py-3 backdrop-blur shadow-[0_2px_10px_rgba(15,60,120,.06)]">
        <button
          onClick={() => navigate("/")}
          className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-600 shadow-sm hover:bg-slate-100"
          aria-label="Về trang chủ"
        >
          ←
        </button>
        <h1 className="font-display text-lg font-extrabold text-ink">Thú cưng của tôi</h1>
      </header>

      <div className="mx-auto w-full px-4 sm:px-6">
        {/* Thẻ xem trước */}
        <section className="mt-3 rounded-3xl bg-white p-4 shadow-[0_6px_18px_rgba(15,60,120,.08)]">
          <div className="flex items-center gap-4">
            <PetAvatar
              size={104}
              bounce
              ariaLabel={`${pet.name} — ${animalName}`}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-display text-xl font-extrabold text-ink">{pet.name}</p>
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10.5px] font-bold text-amber-700">
                  {moodLabel(pet.mood)} {catalogView().moods?.[pet.mood]?.emoji || "💛"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                {animalName} · Cấp {pet.level} · Gắn kết {pet.bonded}% · Đúng {pet.totalCorrect || 0} / Sai {pet.totalWrong || 0}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 transition-all"
                    style={{ width: `${Math.min(100, Math.round((pet.exp / (pet.expNeeded || 1)) * 100))}%` }}
                  />
                </div>
                <span className="shrink-0 text-[11px] font-bold text-slate-500">
                  {pet.exp}/{pet.expNeeded} EXP
                </span>
              </div>
            </div>
          </div>

          <p className="mt-3 rounded-2xl bg-amber-50 px-3 py-2 text-[12.5px] italic text-amber-800">
            “{randomPetTip()}”
          </p>
        </section>

        {/* Diện mạo */}
        <section className="mt-3 rounded-3xl bg-white p-4 shadow-[0_6px_18px_rgba(15,60,120,.08)]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-display text-sm font-extrabold text-ink">Diện mạo</h2>
              <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">
                {wearing.length ? `Đang mặc: ${wearing.join(" · ")}` : "Chưa mặc gì — vào tiệm thay đồ để chọn áo, mũ, kính, nơ cho bé."}
              </p>
            </div>
            <button
              onClick={() => navigate("/pet-wardrobe")}
              className="shrink-0 rounded-2xl bg-emerald-500 px-3.5 py-2 text-[13px] font-extrabold text-white shadow-sm hover:bg-emerald-400"
            >
              <Shirt className="w-3.5 h-3.5" /> Thay đồ
            </button>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
            Bộ đồ lưu vào hồ sơ nên vào trang Profile hay mở game “Tiệm thay đồ thú cưng” trên máy khác cũng thấy đúng con thú này.
          </p>
        </section>

        {/* Tên */}
        <section className="mt-3 rounded-3xl bg-white p-4 shadow-[0_6px_18px_rgba(15,60,120,.08)]">
          <h2 className="font-display text-sm font-extrabold text-ink">Tên của bé</h2>
          <div className="mt-2 flex gap-2">
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value.slice(0, 24))}
              onKeyDown={(e) => { if (e.key === "Enter") saveName(); }}
              placeholder="Nhập tên (tối đa 24 ký tự)"
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
            <button
              onClick={saveName}
              disabled={busy || !nameDraft.trim() || nameDraft.trim() === pet.name}
              className="shrink-0 rounded-2xl bg-amber-400 px-4 py-2 text-sm font-extrabold text-amber-950 shadow-sm hover:bg-amber-300 disabled:opacity-40"
            >
              Lưu
            </button>
          </div>
        </section>

        {/* Thông báo */}
        {msg && (
          <div className={`mt-3 rounded-2xl px-4 py-2.5 text-sm font-bold ${
            msg.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}>
            {msg.text}
          </div>
        )}

        <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400">
          Cấp, EXP và tên lưu trên máy chủ nên đổi thiết bị vẫn giữ nguyên.
          {offline && " Đang offline nên thay đổi chỉ lưu trên máy này."}
        </p>
      </div>
    </div>
  );
}
