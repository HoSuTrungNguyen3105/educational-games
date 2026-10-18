// pages/PetPage.jsx
//
// Trang "Thú cưng của tôi": chọn LOÀI, MÀU, và đổi trang phục.
//
// Toàn bộ hình ảnh đi qua components/pet/PetRenderer.jsx — không có logic vẽ
// riêng trong file này. Ô trang phục đổi trên trang này được chuyển sang
// Kho trang phục (`/pet-wardrobe`) để có chỗ xem trước trước khi lưu.

import { useEffect, useState } from "react";
import { navigate } from "../lib/router.js";
import PetAvatar from "../components/pet/PetAvatar.jsx";
import PetRenderer from "../components/pet/PetRenderer.jsx";
import {
  usePet, loadPet, updateLook, resetPet,
  catalogView, randomPetTip, moodLabel,
} from "../services/petService.js";
import { getPetBase } from "../data/petAssets.js";

/** Loài có bộ SVG thật trong data/petAssets.js. */
const hasArt = (s) => !!getPetBase(s.id);

export default function PetPage() {
  const pet = usePet();
  const [tab, setTab] = useState("species");
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

  const { species, colors } = catalogView();
  const openIds = catalogView().openSpeciesIds;

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
  const wearing = Object.values(pet.outfits || {}).filter(Boolean).length;

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
              ariaLabel={`${pet.name} loài ${pet.species}`}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-display text-xl font-extrabold text-ink">{pet.name}</p>
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10.5px] font-bold text-amber-700">
                  {moodLabel(pet.mood)} {catalogView().moods?.[pet.mood]?.emoji || "💛"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                Cấp {pet.level} · Gắn kết {pet.bonded}% · Đúng {pet.totalCorrect || 0} / Sai {pet.totalWrong || 0}
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

        {/* Tab */}
        <nav className="mt-4 flex gap-2">
          {[["species", "Loài"], ["color", "Màu"]].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex-1 rounded-2xl py-2 text-sm font-extrabold transition ${
                tab === k ? "bg-amber-400 text-amber-950 shadow-sm" : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => navigate("/pet-wardrobe")}
            className="flex-1 rounded-2xl py-2 text-sm font-extrabold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
          >
            👕 Kho trang phục ({wearing})
          </button>
        </nav>

        {/* Nội dung tab */}
        <section className="mt-3 rounded-3xl bg-white p-4 shadow-[0_6px_18px_rgba(15,60,120,.08)]">
          {tab === "species" && (
            <>
              <p className="text-xs text-slate-500">
                Chọn loài bạn muốn nuôi. Loài có hình vẽ đầy đủ mới bấm chọn được.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {species.map((s) => {
                  const unlocked = openIds.has(s.id);
                  const art = hasArt(s);
                  const on = pet.species === s.id;
                  const disabled = !art || !unlocked || busy;
                  return (
                    <button
                      key={s.id}
                      disabled={disabled}
                      onClick={() => save({ species: s.id }, `Đã chọn ${s.name}!`)}
                      title={art ? s.name : `${s.name} — chưa có hình vẽ`}
                      className={`relative rounded-2xl border-2 p-2 text-left transition disabled:cursor-not-allowed ${
                        on ? "border-amber-400 bg-amber-50" : "border-slate-100 bg-white hover:border-amber-200 disabled:opacity-50"
                      }`}
                    >
                      <div className="flex h-[62px] items-center justify-center">
                        {art ? (
                          <PetRenderer
                            species={s.id}
                            color={on ? pet.color : (s.defaultColor || "cream")}
                            size={54}
                            ariaLabel={s.name}
                          />
                        ) : (
                          <span className="text-[34px] leading-none grayscale" aria-hidden="true">{s.emoji}</span>
                        )}
                      </div>
                      <p className="mt-1 font-display text-[13px] font-extrabold text-ink">{s.name}</p>
                      <p className="text-[10.5px] leading-tight text-slate-400">{s.trait}</p>

                      {!art && (
                        <span className="absolute inset-x-1.5 bottom-1 rounded-full bg-slate-100 py-0.5 text-[9.5px] font-bold text-slate-500">
                          Chưa có hình
                        </span>
                      )}
                      {art && !unlocked && (
                        <span className="absolute right-2 top-2 rounded-full bg-slate-200 px-1.5 py-0.5 text-[9.5px] font-bold text-slate-500">
                          🔒 Cấp {s.minLevel}
                        </span>
                      )}
                      {on && <span className="absolute left-2 top-2 text-sm">✅</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {tab === "color" && (
            <>
              <p className="text-xs text-slate-500">Đổi màu lông cho bé. Màu áp dụng cho mọi loài.</p>
              <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
                {colors.map((c) => {
                  const on = pet.color === c.id;
                  return (
                    <button
                      key={c.id}
                      disabled={busy}
                      onClick={() => save({ color: c.id }, `Đã đổi sang màu ${c.name}!`)}
                      title={c.name}
                      className={`aspect-square rounded-2xl border-4 transition disabled:opacity-50 ${
                        on ? "border-amber-400 shadow-md" : "border-white hover:scale-105"
                      }`}
                      style={{ background: c.body || c }}
                    />
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* Thông báo + reset */}
        {msg && (
          <div className={`mt-3 rounded-2xl px-4 py-2.5 text-sm font-bold ${
            msg.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}>
            {msg.text}
          </div>
        )}

        <button
          onClick={async () => { await resetPet(); setMsg({ type: "ok", text: "Đã đưa bé về mặc định." }); }}
          disabled={busy}
          className="mt-4 w-full rounded-2xl bg-white py-2.5 text-sm font-extrabold text-slate-500 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          Đặt lại diện mạo
        </button>

        <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400">
          Thú cưng được lưu trên máy chủ nên đổi thiết bị vẫn giữ nguyên.
          {offline && " Đang offline nên thay đổi chỉ lưu trên máy này."}
        </p>
      </div>
    </div>
  );
}