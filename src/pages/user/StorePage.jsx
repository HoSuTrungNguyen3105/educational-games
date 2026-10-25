import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Coins, Star, Repeat, Trophy } from "lucide-react";
import { walletService } from "../../services/api.js";
import { PrimaryButton, GhostButton, Loader, ErrorState } from "../../components/ui";

const FALLBACK_RATE = 20000;
const nf = new Intl.NumberFormat("vi-VN");
const fmt = (n) => nf.format(Math.max(0, Math.round(Number(n) || 0)));

/**
 * Cửa hàng — đổi qua lại giữa coin và sao, rồi đổi sao lấy thành tựu.
 * Tỷ giá + catalog lấy từ server (GET /auth/me/wallet) nên trang này không
 * tự hardcoded giá nào cả.
 */
export default function StorePage({ userAuth, onBack, showToast }) {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);
  const [direction, setDirection] = useState("coinToStar");
  const [amountText, setAmountText] = useState("");
  const [busy, setBusy] = useState(false);
  const [redeemingId, setRedeemingId] = useState(null);

  const load = useCallback(() => {
    setWallet(null);
    setError(null);
    walletService.get()
      .then(setWallet)
      .catch((e) => setError(e?.message || "Không tải được ví"));
  }, []);

  useEffect(() => { load(); }, [load]);

  const coins = wallet?.coins || 0;
  const stars = wallet?.stars || 0;
  const rate = wallet?.rate?.starToCoin || FALLBACK_RATE;
  const shop = wallet?.shop || [];
  const owned = useMemo(() => new Set((wallet?.achievements || []).map((a) => a.id)), [wallet]);

  const toStar = direction === "coinToStar";
  const balance = toStar ? coins : stars;
  // Ô nhập bỏ trống = đổi toàn bộ số đang có.
  const amount = amountText.trim() === "" ? balance : Math.floor(Number(amountText) || 0);

  const preview = useMemo(() => {
    if (amount <= 0) return { gained: 0, kept: 0, hint: "Nhập số cần đổi" };
    if (amount > balance) return { gained: 0, kept: 0, hint: `Bạn chỉ đang có ${fmt(toStar ? coins : stars)} ${toStar ? "coin" : "sao"}` };
    if (toStar) {
      const gained = Math.floor(amount / rate);
      const kept = amount % rate;
      return gained === 0
        ? { gained: 0, kept: amount, hint: `Cần tối thiểu ${fmt(rate)} coin để đổi được 1 sao` }
        : { gained, kept, hint: `Coin lẻ giữ lại: ${fmt(kept)}` };
    }
    return { gained: amount * rate, kept: 0, hint: "Toàn bộ sao sẽ thành coin" };
  }, [amount, balance, coins, stars, rate, toStar]);

  const canExchange = !busy && preview.gained > 0;

  const applyBalances = (res) => {
    setWallet((w) => (w ? { ...w, coins: res?.coins ?? w.coins, stars: res?.stars ?? w.stars } : w));
  };

  const runExchange = async () => {
    if (!canExchange) return;
    setBusy(true);
    try {
      // Gửi số cụ thể (không bỏ trống) để kết quả khớp đúng với gì người dùng thấy.
      const res = await walletService.exchange(direction, amount);
      applyBalances(res);
      setAmountText("");
      showToast?.(
        toStar ? `Đổi được ${fmt(res.gained)} sao` : `Đổi được ${fmt(res.gained)} coin`,
        "success"
      );
    } catch (e) {
      showToast?.(e?.message || "Đổi thất bại", "error");
    } finally {
      setBusy(false);
    }
  };

  const runRedeem = async (item) => {
    if (busy || owned.has(item.id)) return;
    setRedeemingId(item.id);
    try {
      const res = await walletService.redeem(item.id);
      applyBalances(res);
      setWallet((w) => (w ? { ...w, achievements: [...(w.achievements || []), { id: item.id, at: new Date().toISOString() }] } : w));
      showToast?.(`Đã đổi thành tựu ${item.title}`, "success");
    } catch (e) {
      showToast?.(e?.message || "Đổi thành tựu thất bại", "error");
    } finally {
      setRedeemingId(null);
    }
  };

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center">
          <Star className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-stone-500 mb-5">Bạn cần đăng nhập để đổi coin và sao</p>
          <GhostButton onClick={onBack}>← Về trang chủ</GhostButton>
        </div>
      </div>
    );
  }

  const quickAmounts = toStar ? [rate, rate * 5, rate * 10] : [1, 5, 10];

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10 w-full">
      <button
        onClick={onBack}
        className="text-sm text-stone-500 hover:text-ink transition inline-flex items-center gap-2 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Về trang chủ
      </button>

      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-ink flex items-center gap-2">
          <Star className="w-7 h-7 text-amber-500" /> Cửa hàng sao
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Đổi coin ⇄ sao và đổi sao lấy thành tựu. 1 sao = {fmt(rate)} coin.
        </p>
      </div>

      {wallet === null ? (
        error ? (
          <ErrorState title="Không tải được ví" subtitle={error} onRetry={load} />
        ) : (
          <div className="flex justify-center py-10"><Loader label="Đang mở ví..." /></div>
        )
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="space-y-6">
            {/* Số dư */}
            <div className="bg-white border border-ink/10 rounded-lg divide-y divide-ink/5">
              <div className="flex items-center gap-3 px-4 py-3">
                <Coins className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-sm text-stone-500 flex-1">Coin</span>
                <span className="font-display text-lg text-ink tabular-nums">{fmt(coins)}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Star className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-sm text-stone-500 flex-1">Sao</span>
                <span className="font-display text-lg text-ink tabular-nums">{fmt(stars)}</span>
              </div>
            </div>

            {/* Đổi tiền tệ */}
            <section className="bg-white border border-ink/10 rounded-lg p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <Repeat className="w-4 h-4 text-stone-500" />
                <h2 className="font-display text-lg text-ink">Đổi coin ⇄ sao</h2>
              </div>

              <div className="flex gap-2 mb-4">
                {[
                  { key: "coinToStar", label: "Coin → Sao" },
                  { key: "starToCoin", label: "Sao → Coin" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => { setDirection(opt.key); setAmountText(""); }}
                    className={`flex-1 h-9 rounded-md text-sm font-bold border transition ${
                      direction === opt.key
                        ? "bg-ink text-white border-ink"
                        : "bg-white text-stone-600 border-ink/15 hover:border-ink/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <label className="block text-xs font-bold text-stone-500 mb-1.5">
                Số {toStar ? "coin" : "sao"} muốn đổi
              </label>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={amountText}
                onChange={(e) => setAmountText(e.target.value)}
                placeholder={`Bỏ trống = đổi hết ${fmt(balance)}`}
                className="w-full px-3 py-2.5 rounded-md border border-ink/15 text-ink tabular-nums focus:border-ink/40 focus:outline-none"
              />

              <div className="flex flex-wrap gap-2 mt-2.5">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    disabled={q > balance}
                    onClick={() => setAmountText(String(q))}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                      q > balance
                        ? "bg-stone-50 text-stone-300 cursor-not-allowed"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {fmt(q)}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={balance <= 0}
                  onClick={() => setAmountText(String(balance))}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                    balance <= 0
                      ? "bg-stone-50 text-stone-300 cursor-not-allowed"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  Tất cả
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 px-3.5 py-3 rounded-md bg-stone-50">
                <span className="text-sm text-stone-500">Bạn nhận về</span>
                <span className="font-display text-xl text-ink tabular-nums">
                  {fmt(preview.gained)} {toStar ? "sao" : "coin"}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1.5">{preview.hint}</p>

              <PrimaryButton onClick={runExchange} disabled={!canExchange} className="w-full mt-4">
                {busy ? "Đang đổi..." : `Đổi ${fmt(amount)} ${toStar ? "coin" : "sao"}`}
              </PrimaryButton>
            </section>

            {/* Đổi thành tựu */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-stone-500" />
                <h2 className="font-display text-lg text-ink">Thành tựu đổi bằng sao</h2>
              </div>
              {shop.length === 0 ? (
                <p className="text-sm text-stone-500 bg-white border border-ink/10 rounded-lg px-4 py-6 text-center">
                  Chưa có thành tựu nào để đổi.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {shop.map((item) => {
                    const isOwned = owned.has(item.id);
                    const affordable = stars >= item.stars;
                    return (
                      <div
                        key={item.id}
                        className={`bg-white border rounded-lg p-4 flex items-start gap-3 ${
                          isOwned ? "border-emerald-300" : "border-ink/10"
                        }`}
                      >
                        <span className="w-11 h-11 shrink-0 rounded-md bg-stone-100 flex items-center justify-center text-2xl">
                          {item.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-ink text-sm">{item.title}</p>
                          <p className="text-[11px] text-stone-500 mt-0.5">{item.desc}</p>
                          <div className="flex items-center justify-between gap-2 mt-3">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700">
                              <Star className="w-3.5 h-3.5" /> {fmt(item.stars)}
                            </span>
                            {isOwned ? (
                              <span className="text-[11px] font-bold text-emerald-700">✓ Đã sở hữu</span>
                            ) : (
                              <button
                                type="button"
                                disabled={!affordable || redeemingId !== null}
                                onClick={() => runRedeem(item)}
                                className={`h-8 px-3 rounded-md text-xs font-bold transition ${
                                  affordable && redeemingId === null
                                    ? "bg-ink text-white hover:bg-ink/85"
                                    : "bg-stone-100 text-stone-400 cursor-not-allowed"
                                }`}
                              >
                                {redeemingId === item.id ? "Đang đổi..." : affordable ? "Đổi sao" : "Chưa đủ sao"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="text-[11px] text-stone-400 mt-3">
                Sao đổi thành tựu sẽ mất vĩnh viễn — nếu muốn dùng coin, hãy đổi ngược lại sao thành coin ở trên.
              </p>
            </section>
          </div>

          {/* Cột phụ: mẹo tỷ giá */}
          <aside className="hidden lg:block bg-white border border-ink/10 rounded-lg p-4">
            <h3 className="font-display text-sm text-ink mb-3">Tỷ giá</h3>
            <div className="space-y-2 text-sm text-stone-600">
              <div className="flex items-center justify-between py-1.5 border-b border-ink/5">
                <span>1 sao</span>
                <span className="font-bold text-ink tabular-nums">{fmt(rate)} coin</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-ink/5">
                <span>5 sao</span>
                <span className="font-bold text-ink tabular-nums">{fmt(rate * 5)} coin</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span>Số dư của bạn</span>
                <span className="font-bold text-ink tabular-nums">
                  ≈ {fmt(stars + coins / rate)} sao
                </span>
              </div>
            </div>
            <p className="text-[11px] text-stone-400 mt-3 leading-relaxed">
              Coin lẻ dưới {fmt(rate)} sẽ được giữ lại khi đổi sang sao, không bị mất.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
