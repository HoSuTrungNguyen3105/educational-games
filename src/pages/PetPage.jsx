import { useEffect, useState } from "react";
import { navigate } from "../lib/router.js";
import PetSvg from "../components/PetSvg.jsx";
import MascotDog, { MASCOT_PALETTE } from "../components/MascotDog.jsx";
import {
  usePet, getCatalog, loadPet, updateLook, resetPet,
  unlockedFor, randomPetTip, moodLabel, OUTFIT_SLOTS,
} from "../lib/petApi.js";

/** Nhãn tiếng Việt cho từng ô trang phục. */
const SLOT_LABELS = {
  hat: "Mũ", scarf: "Khăn quàng", glasses: "Kính",
  shirt: "Áo", bow: "Cà vút", cape: "Áo choàng", backpack: "Ba lô",
};

/** Emoji đại diện cho từng ô. */
const SLOT_EMOJI = {
  hat: "🎩", scarf: "🧣", glasses: "🕶️", shirt: "👕", bow: "🎀", cape: "🧥", backpack: "🎒",
};

export default function PetPage() {
  const pet = usePet();
  const [tab, setTab] = useState("species");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [nameDraft, setNameDraft] = useState(pet.name || "");

  useEffect(() => {
    loadPet();
  }, []);

  // Đồng bộ ô nhập tên theo pet từ store, nhưng không phá chữ đang gõ.
  // Làm lúc render thay vì trong effect (React khuyến nghị cho state chỉnh theo props).
  const [lastName, setLastName] = useState(pet.name || "");
  if (pet.name && pet.name !== lastName) {
    setLastName(pet.name);
    setNameDraft(pet.name);
  }

  const catalog = getCatalog();
  const { species, colors, outfits } = unlockedFor(pet);

  const totalOutfits = catalog.outfits?.length ?? 0;

  async function save(patch, successMsg) {
    setBusy(true);
    setMsg(null);
    const res = await updateLook(patch);
    setBusy(false);
    if (res.ok) {
      setMsg({ type: "ok", text: successMsg });
    } else {
      setMsg({ type: "err", text: res.error || "Không lưu được" });
    }
    return res.ok;
  }

  async function saveName() {
    const n = nameDraft.trim();
    if (!n || n === pet.name) return;
    await save({ name: n }, `Đặt tên "${n}" xong!`);
  }

  return (
    <div className="min-h-full bg-paper pb-24">
      {/* đầu trang */}
      <header className="sticky top-0 z-20 flex items-center gap-3 bg-paper/95 backdrop-blur px-4 py-3 shadow-[0_2px_10px_rgba(15,60,120,.06)]">
        <button
          onClick={() => navigate("/")}
          className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-600 shadow-sm hover:bg-slate-100"
          aria-label="Về trang chủ"
        >
          ←
        </button>
        <h1 className="font-display text-lg font-extrabold text-ink">Thú cưng của tôi</h1>
      </header>

      <div className="mx-auto w-full max-w-3xl px-4">
        {/* thẻ xem trước */}
        <section className="mt-3 rounded-3xl bg-white p-4 shadow-[0_6px_18px_rgba(15,60,120,.08)]">
          <div className="flex items-center gap-4">
            <div
              className="relative grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-orange-50"
              style={{ width: 104, height: 104, boxShadow: "0 0 0 3px #FFD257, 0 4px 10px rgba(0,0,0,.12)" }}
            >
              <PetSvg
                size={82}
                bounce
                species={pet.species}
                color={pet.color}
                outfits={pet.outfits}
                mood={pet.mood}
                ariaLabel={`${pet.name} loài ${pet.species}`}
              />
              <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-amber-300 bg-white px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-amber-600 shadow-sm">
                Lv {pet.level}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-display text-xl font-extrabold text-ink">{pet.name}</p>
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10.5px] font-bold text-amber-700">
                  {moodLabel(pet.mood)} {getCatalog().moods?.[pet.mood]?.emoji || "💛"}
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

        {/* tên */}
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

        {/* tab */}
        <nav className="mt-4 flex gap-2">
          {[
            ["species", "Loài"],
            ["color", "Màu"],
            ["outfits", "Trang phục"],
          ].map(([k, label]) => (
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
        </nav>

        {/* nội dung tab */}
        <section className="mt-3 rounded-3xl bg-white p-4 shadow-[0_6px_18px_rgba(15,60,120,.08)]">
          {tab === "species" && (
            <>
              <p className="text-xs text-slate-500">
                Chọn loài bạn muốn nuôi. Loài có hình vẽ đầy đủ mới bấm chọn được.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(catalog.species || []).map((s) => {
                  const unlocked = species.some((x) => x.id === s.id);
                  // Chỉ loài đã có SVG mới dùng được; loài khác khoá nút.
                  const hasArt = s.art === "svg";
                  const on = pet.species === s.id;
                  const disabled = !hasArt || !unlocked || busy;
                  const reason = !hasArt
                    ? "Chưa có hình"
                    : `Mở ở cấp ${s.minLevel}`;
                  return (
                    <button
                      key={s.id}
                      disabled={disabled}
                      onClick={() => save({ species: s.id }, `Đã chọn ${s.name}!`)}
                      title={hasArt ? s.name : `${s.name} — ${reason.toLowerCase()}`}
                      className={`relative rounded-2xl border-2 p-2 text-left transition disabled:cursor-not-allowed ${
                        on
                          ? "border-amber-400 bg-amber-50"
                          : "border-slate-100 bg-white hover:border-amber-200 disabled:opacity-50"
                      }`}
                    >
                      <div className="flex h-[62px] items-center justify-center">
                        {hasArt ? (
                          <MascotDog
                            size={54}
                            color={on ? pet.color : (MASCOT_PALETTE[s.defaultColor] ? s.defaultColor : "cream")}
                            ariaLabel={s.name}
                          />
                        ) : (
                          <span className="text-[34px] leading-none grayscale" aria-hidden="true">{s.emoji}</span>
                        )}
                      </div>
                      <p className="mt-1 font-display text-[13px] font-extrabold text-ink">{s.name}</p>
                      <p className="text-[10.5px] leading-tight text-slate-400">{s.trait}</p>

                      {!hasArt && (
                        <span className="absolute inset-x-1.5 bottom-1 rounded-full bg-slate-100 py-0.5 text-[9.5px] font-bold text-slate-500">
                          Chưa có hình
                        </span>
                      )}
                      {hasArt && !unlocked && (
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
                {(colors || []).map((c) => {
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

          {tab === "outfits" && (
            <>
              <p className="text-xs text-slate-500">
                Mặc đồ cho bé. Mỗi loại có nhiều màu — bấm lần nữa để đổi màu.
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Đã mở {outfits.length}/{totalOutfits} món.
              </p>

              {OUTFIT_SLOTS.map((slot) => {
                const items = (catalog.outfits || []).filter((o) => o.slot === slot);
                const openItems = outfits.filter((o) => o.slot === slot);
                const current = pet.outfits?.[slot] || null;
                return (
                  <div key={slot} className="mt-3 border-t border-slate-100 pt-3 first:border-0 first:pt-0">
                    <p className="text-[12px] font-extrabold text-slate-600">{SLOT_LABELS[slot]}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {/* cởi đồ ở ô này */}
                      <button
                        disabled={busy || !current}
                        onClick={() => save({ outfits: { [slot]: null } }, `Đã cởi ${SLOT_LABELS[slot].toLowerCase()}.`)}
                        className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 transition hover:border-slate-300 disabled:opacity-35"
                        title={`Không mặc ${SLOT_LABELS[slot].toLowerCase()}`}
                      >
                        ∅
                      </button>

                      {items.map((o) => {
                        const open = openItems.some((x) => x.id === o.id);
                        const on = current?.id === o.id;
                        const palette = o.colors?.length ? o.colors : ["#CBD5E1"];
                        // Màu đang hiển thị: món này có nhiều màu và đang mặc → lấy màu đã chọn
                        const shown = on && current?.color ? current.color : palette[0];
                        const swatches = palette.length > 1 && on ? (
                          <span className="absolute -bottom-1 -right-1 flex gap-0.5">
                            {palette.map((cc) => (
                              <span
                                key={cc}
                                className={`h-2 w-2 rounded-full ring-1 ${current.color === cc ? "ring-amber-500" : "ring-white"}`}
                                style={{ background: cc }}
                              />
                            ))}
                          </span>
                        ) : null;

                        return (
                          <button
                            key={o.id}
                            disabled={!open || busy}
                            onClick={() => {
                              if (!open) return;
                              // Đang mặc món này → bấm tiếp sẽ chuyển màu; bấm lần cuối thì cởi
                              if (!on) {
                                save({ outfits: { [slot]: { id: o.id, color: palette[0] } } }, `Đã mặc ${o.name}!`);
                              } else if (palette.length > 1) {
                                const i = palette.indexOf(current.color);
                                const next = palette[(i + 1) % palette.length];
                                if (i === palette.length - 1) {
                                  save({ outfits: { [slot]: null } }, `Đã cởi ${o.name}.`);
                                } else {
                                  save({ outfits: { [slot]: { id: o.id, color: next } } }, `Đổi màu ${o.name}.`);
                                }
                              } else {
                                save({ outfits: { [slot]: null } }, `Đã cởi ${o.name}.`);
                              }
                            }}
                            title={`${o.name}${open ? (palette.length > 1 ? " — bấm để đổi màu" : "") : ` — mở ở cấp ${o.minLevel}`}`}
                            className={`relative grid h-12 w-12 place-items-center rounded-2xl text-xl transition disabled:cursor-not-allowed disabled:opacity-45 ${
                              on ? "border-2 border-amber-400 bg-amber-50 shadow-md" : "border-2 border-white hover:scale-105"
                            }`}
                            style={{ boxShadow: `inset 0 -13px 0 -2px ${shown}` }}
                          >
                            {SLOT_EMOJI[slot]}
                            {swatches}
                            {!open && <span className="absolute -right-1 -top-1 text-[10px]">🔒</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </section>

        {/* thông báo + reset */}
        {msg && (
          <div
            className={`mt-3 rounded-2xl px-4 py-2.5 text-sm font-bold ${
              msg.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
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
          {userOffline && " Đang offline nên thay đổi chỉ lưu trên máy này."}
        </p>
      </div>
    </div>
  );
}

// Bật cảnh báo khi đang offline (không chặn gì)
const userOffline = typeof navigator !== "undefined" && navigator.onLine === false;
