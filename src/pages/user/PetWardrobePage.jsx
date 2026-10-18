// pages/user/PetWardrobePage.jsx
//
// KHO ĐỒ TRANG PHỤC THÚ CƯNG — mặc / tháo / xem trước.
//
// Luồng (mục 13 của đề bài):
//   1. tải pet + catalog từ API
//   2. chọn món  → CHỈ xem trước bằng state tạm, chưa ghi gì
//   3. bấm Mặc   → gọi PUT /api/pet
//   4. server từ chối (chưa đủ cấp / sai dữ liệu) → báo lỗi + khôi phục
//      diện mạo đang lưu, KHÔNG để UI lệch với server
//
// Mọi thao tác đi qua petService → petApi (một HTTP client duy nhất).

import { useEffect, useMemo, useState } from "react";
import { navigate } from "../../lib/router.js";
import { Loader } from "../../components/ui.jsx";
import PetPreview from "../../components/pet/PetPreview.jsx";
import { useOutfitDraft } from "../../lib/useOutfitDraft.js";
import PetRenderer from "../../components/pet/PetRenderer.jsx";
import {
  usePet, loadPet, wardrobeBySlot, equip, unequip, unequipAll,
} from "../../services/petService.js";

/** Chọn màu tiếp theo trong bảng màu của món (bấm lại lần nữa để đổi màu). */
function nextColor(colors, current) {
  if (!colors || colors.length < 2) return null;
  const i = colors.indexOf(current);
  return i === colors.length - 1 ? null : colors[i + 1];
}

export default function PetWardrobePage() {
  const pet = usePet();
  const { draft, setSlot, clear } = useOutfitDraft();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => { loadPet().finally(() => setReady(true)); }, []);

  const groups = useMemo(() => wardrobeBySlot(pet), [pet]);
  const visible = filter === "all" ? groups : groups.filter((g) => g.slot === filter);
  const wornCount = Object.values(pet?.outfits || {}).filter(Boolean).length;

  async function run(action, okMsg) {
    if (busy) return false;
    setBusy(true);
    setMsg(null);
    const res = await action();
    setBusy(false);
    if (res.ok) {
      clear();                       // lưu xong → bỏ nháp, dùng dữ liệu thật
      setMsg({ type: "ok", text: okMsg });
      return true;
    }
    // Server từ chối: bỏ nháp để UI khớp lại với dữ liệu đang lưu.
    clear();
    setMsg({ type: "err", text: res.error || "Không lưu được. Đã trả về trang phục cũ." });
    return false;
  }

  // Bấm món trong lưới → thử trước, không gọi API.
  function handlePick(item) {
    if (!item.owned || !item.compatible) return;
    const current = pet?.outfits?.[item.slot];
    const currentId = current?.id;
    const currentColor = current?.color;

    if (currentId !== item.id) {
      setSlot(item.slot, { id: item.id, color: item.colors?.[0] || item.equippedColor || null });
      return;
    }
    // Đang mặc món này: bấm tiếp đổi màu; hết màu thì tháo.
    const nc = nextColor(item.colors, currentColor);
    if (nc) setSlot(item.slot, { id: item.id, color: nc });
    else setSlot(item.slot, null);
  }

  if (!ready) {
    return (
      <div className="grid min-h-full place-items-center bg-paper">
        <Loader label="Đang tải tủ đồ thú cưng..." />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-paper pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 bg-paper/95 px-4 py-3 backdrop-blur shadow-[0_2px_10px_rgba(15,60,120,.06)]">
        <button
          onClick={() => navigate("/pet")}
          className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-600 shadow-sm hover:bg-slate-100"
          aria-label="Về trang thú cưng"
        >
          ←
        </button>
        <div className="min-w-0">
          <h1 className="font-display text-lg font-extrabold text-ink">Kho trang phục</h1>
          <p className="text-[11px] text-slate-500">
            Đang mặc {wornCount}/{groups.reduce((a, g) => a + g.items.length, 0) === 0 ? 7 : 7} ô
          </p>
        </div>
        <button
          onClick={() => run(unequipAll, "Đã cởi hết trang phục.")}
          disabled={busy || wornCount === 0}
          className="ml-auto shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-slate-500 shadow-sm hover:bg-slate-50 disabled:opacity-45"
        >
          Cởi hết
        </button>
      </header>

      <div className="mx-auto grid w-full gap-4 px-4 sm:px-6 md:grid-cols-[280px_1fr]">
        {/* ── Cột xem trước ── */}
        <aside className="md:sticky md:top-20 md:self-start">
          <div className="mt-3 rounded-3xl bg-white p-4 text-center shadow-[0_6px_18px_rgba(15,60,120,.08)]">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              {draft ? "Đang thử" : "Đang mặc"}
            </p>
            {/* Bản nháp nằm ở trang này (useOutfitDraft) và được truyền thẳng
                xuống PetPreview — trước đây PetPreview tự giữ nháp riêng nên
                người chơi chọn đồ xong không thấy thay đổi gì. */}
            <PetPreview size={190} outfits={draft ?? pet?.outfits} />

            {msg && (
              <p className={`mt-3 rounded-2xl px-3 py-2 text-[12px] font-bold ${
                msg.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}>
                {msg.text}
              </p>
            )}

            <div className="mt-3 flex justify-center gap-2">
              <button
                onClick={clear}
                disabled={!draft || busy}
                className="rounded-full bg-white px-4 py-2 text-xs font-extrabold text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:opacity-45"
              >
                Bỏ thử
              </button>
              <button
                onClick={() => run(() => equip(null, draft), "Đã lưu trang phục!")}
                disabled={!draft || busy}
                className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2 text-xs font-extrabold text-amber-950 shadow-sm transition hover:from-amber-300 hover:to-yellow-400 disabled:opacity-45"
              >
                {busy ? "Đang lưu…" : "Lưu trang phục"}
              </button>
            </div>

            {draft && (
              <p className="mt-2 text-[11px] font-bold text-slate-400 underline" onClick={clear}>
                Giữ nguyên đồ đang mặc
              </p>
            )}
          </div>
        </aside>

        {/* ── Lưới trang phục ── */}
        <div className="pb-6">
          {/* Lọc theo ô */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-3 py-1.5 text-[12px] font-extrabold transition ${
                filter === "all" ? "bg-amber-400 text-amber-950" : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              Tất cả
            </button>
            {groups.map((g) => (
              <button
                key={g.slot}
                onClick={() => setFilter(g.slot)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-extrabold transition ${
                  filter === g.slot ? "bg-amber-400 text-amber-950" : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {g.emoji} {g.label}
              </button>
            ))}
          </div>

          {visible.map((group) => (
            <section key={group.slot} className="mt-4 rounded-3xl bg-white p-4 shadow-[0_6px_18px_rgba(15,60,120,.08)]">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-display text-sm font-extrabold text-ink">
                  {group.emoji} {group.label}
                </h2>
                <span className="text-[11px] text-slate-400">{group.hint}</span>
              </div>

              {/* Nút cởi riêng cho ô này */}
              <button
                onClick={() => run(() => unequip(group.slot), `Đã cởi ${group.label.toLowerCase()}.`)}
                disabled={busy || !pet?.outfits?.[group.slot]}
                className="mt-2 w-full rounded-2xl border-2 border-dashed border-slate-200 py-1.5 text-[11.5px] font-bold text-slate-400 transition hover:border-slate-300 disabled:opacity-40"
              >
                ∅ Không mặc {group.label.toLowerCase()}
              </button>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {group.items.map((item) => {
                  const locked = !item.owned;
                  const wrongPet = !item.compatible;
                  const disabled = locked || wrongPet || busy;
                  const previewing = draft?.[item.slot]?.id === item.id;
                  const equipped = item.equipped && !previewing;
                  const shownColor =
                    previewing ? draft[item.slot]?.color
                    : equipped ? item.equippedColor
                    : item.colors?.[0];

                  return (
                    <button
                      key={item.id}
                      disabled={disabled}
                      onClick={() => handlePick(item)}
                      title={
                        wrongPet ? "Không hợp với loài pet của bạn"
                        : locked ? `Mở ở cấp ${item.minLevel}`
                        : equipped ? "Đang mặc — bấm để đổi màu hoặc tháo"
                        : "Bấm để thử"
                      }
                      className={`relative flex flex-col items-center gap-1 rounded-2xl border-2 p-2 text-center transition ${
                        previewing || equipped
                          ? "border-amber-400 bg-amber-50 shadow-md"
                          : "border-slate-100 bg-white hover:border-amber-200"
                      } disabled:cursor-not-allowed disabled:opacity-45`}
                    >
                      {/* Vẽ món đồ thật bằng chính SVG sẽ mặc lên pet.
                          Không dùng emoji đại diện — phải thấy đúng hình. */}
                      <span className="relative grid h-[72px] w-full place-items-center overflow-hidden rounded-xl bg-slate-50">
                        {item.asset ? (
                          <PetRenderer
                            species={pet?.species}
                            color={pet?.color}
                            outfits={{ [item.slot]: { id: item.id, color: shownColor } }}
                            size={72}
                            className="scale-[1.45]"
                            showEmojiFallback={false}
                          />
                        ) : (
                          <span className="text-3xl">{group.emoji}</span>
                        )}
                        {locked && <span className="absolute inset-0 grid place-items-center bg-white/70 text-lg">🔒</span>}
                      </span>

                      <span className="text-[11.5px] font-extrabold leading-tight text-ink">{item.name}</span>

                      {item.colors?.length > 1 && (
                        <span className="flex gap-1">
                          {item.colors.map((c) => (
                            <span
                              key={c}
                              className={`h-2.5 w-2.5 rounded-full ring-2 ${
                                shownColor === c ? "ring-amber-500" : "ring-slate-200"
                              }`}
                              style={{ background: c }}
                            />
                          ))}
                        </span>
                      )}

                      {(equipped || previewing) && (
                        <span className="absolute right-1.5 top-1.5 text-[11px]">
                          {previewing ? "👁" : "✅"}
                        </span>
                      )}
                      {wrongPet && <span className="absolute left-1.5 top-1.5 text-[11px]">🚫</span>}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}

          {visible.length === 0 && (
            <p className="mt-6 text-center text-sm text-slate-400">
              Chưa có trang phục nào cho nhóm này.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}