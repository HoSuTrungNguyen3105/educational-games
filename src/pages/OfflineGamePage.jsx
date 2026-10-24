import { useEffect, useMemo, useRef, useState } from "react";
import { navigate } from "../lib/router.js";
import { findOfflineGame, makeFallbackMeta, resolveOfflineId } from "../games/offline/games-src/manifest.js";
import { useGameVersion } from "../hooks/useGameVersion.js";
import { gameCache } from "../lib/gameCache.js";
import { addCoins, loadWallet, readWallet, subscribeWallet } from "../lib/coinWallet.js";
import { startGameSync, endGameSync } from "../lib/offlineGameSync.js";
import { gameDataService } from "../services/gameDataService.js";
import { Loader } from "../components/ui";
import TOKENS_CSS from "../games/offline/lib/tokens.css?raw";

/**
 * MỖI GAME = MỘT FILE HTML trong src/games/offline/.
 *
 * Dùng `import.meta.glob` để Vite tự quét toàn bộ folder lúc build.
 * Nhờ vậy chỉ cần COPY FILE .html vào src/games/offline/ là chơi được,
 * KHÔNG phải khai báo import/key/route thủ công như trước.
 *
 * ⚠ Phải dùng `query: '?raw'` chứ KHÔNG viết `*.html?raw` trong pattern —
 *   Vite KHÔNG xử lý query string nằm trong glob, nên pattern đó khớp 0 file
 *   và mọi game sẽ biến mất trong bundle mà build vẫn báo thành công.
 *
 * Bổ sung: `npm run games:sync` sẽ bổ sung metadata (tên/emoji/màu) vào manifest
 * để game mới hiện đẹp trên trang chủ.
 */
const OFFLINE_HTML = import.meta.glob("../games/offline/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
});

/** id = tên file bỏ đuôi .html, ví dụ "night-strike.html" → "night-strike" */
const HTML_BY_ID = Object.fromEntries(
  Object.entries(OFFLINE_HTML).map(([path, mod]) => [
    path.split("/").pop().replace(/\.html$/, ""),
    typeof mod === "string" ? mod : mod.default,
  ])
);

/**
 * Nạp bộ UI dùng chung (lib/tokens.css) vào mọi game — kể cả game viết tay.
 *
 * Tiêm ở ĐẦU <head>, trước <style> của game: game giữ được theme riêng (nếu có
 * tự khai báo --ink/--paper…) nhưng vẫn dùng được biến mới (--card, --gq-*) và
 * có cùng hình dạng nút về / HUD / panel với các game khác.
 *
 * Game chạy trong app (iframe) thì React đã vẽ sẵn nút "← Trang chủ" ở góc
 * trên trái — đúng chỗ game tự đặt nút về của nó nên 2 nút đè lên nhau.
 * Cắm class "gq-embedded" vào <html> của game để:
 *   - ẩn nút về của game (injected `#homeBackBtn`, `.bar > .back` của shell)
 *   - đẩy nội dung sảnh shell (`#app`) xuống dưới nút của app
 *   - nút "chơi lại" dạng `.sq#back` (cargo) dời xuống dưới nút của app
 * Mở file .html trực tiếp (không có iframe) thì không có class → game giữ
 * nguyên nút riêng của nó.
 */
const EMBEDDED_SNIPPET = `<style>html.gq-embedded #homeBackBtn,html.gq-embedded .bar>.back{display:none!important}html.gq-embedded #app{padding-top:56px!important}html.gq-embedded .sq#back{top:64px!important}</style><script>try{if(window.parent&&window.parent!==window)document.documentElement.classList.add("gq-embedded")}catch(e){}</script>`;

/**
 * Cầu "ghi tiến độ NGAY" từ app xuống game.
 *
 * Game giữ trạng thái đang chơi trong biến JS và chỉ ghi localStorage khi có
 * mốc (thắng/thua/tick). App là SPA: bấm "← Trang chủ" chỉ đổi route rồi phá
 * iframe, nên `pagehide`/`visibilitychange` của game KHÔNG chạy → ván dở bay
 * sạch, mở lại mất nhiệm vụ đã làm.
 *
 * Vì vậy trước khi rời trang, app postMessage `{type:"gq:flush"}`; game nào
 * đăng ký `window.__gqFlush = fn` hoặc `addEventListener("gq:flush", fn)` sẽ
 * ghi checkpoint ngay, app chờ game xác nhận (tối đa 250ms) mới navigate.
 * Game không đăng ký vẫn an toàn: snapshot localStorage hiện có vẫn được sync.
 */
const FLUSH_BRIDGE = `<script>(function(){window.addEventListener("message",function(ev){var d=ev.data;if(!d||d.type!=="gq:flush")return;try{if(typeof window.__gqFlush==="function")window.__gqFlush();}catch(e){}try{window.dispatchEvent(new CustomEvent("gq:flush"));}catch(e){}try{document.dispatchEvent(new CustomEvent("gq:flush"));}catch(e){}try{ev.source&&ev.source.postMessage({type:"gq:flushed"},"*");}catch(e){}});})();</script>`;

function injectGameUi(html) {
  const tokens = `<style id="gq-tokens">${TOKENS_CSS}</style>`;
  const bridge = `${EMBEDDED_SNIPPET}${FLUSH_BRIDGE}`;
  const withTokens = /<head[^>]*>/i.test(html)
    ? html.replace(/<head[^>]*>/i, (m) => `${m}${tokens}`)
    : `${tokens}${html}`;
  return /<\/body>/i.test(withTokens)
    ? withTokens.replace(/<\/body>/i, () => `${bridge}</body>`)
    : withTokens + bridge;
}


/** Trang chơi 1 game offline — dùng chung cho mọi game trong thư mục offline. */
export default function OfflineGamePage({ gameId: rawGameId }) {
  const iframeRef = useRef(null);
  // id cũ (Excel, GenshinUIReplica, COIPhongLinh…) → id hiện tại của file HTML.
  const gameId = resolveOfflineId(rawGameId);
  const isSchoolMissionRedirect =
    gameId === "School_mission" || gameId === "school-mission";

  // Link cũ /offline/School_mission → chuyển sang game nhập vai
  useEffect(() => {
    if (isSchoolMissionRedirect) navigate("/school-mission");
  }, [isSchoolMissionRedirect]);

  const html = isSchoolMissionRedirect ? null : HTML_BY_ID[gameId];
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  // undefined = chưa đọc xong IndexedDB; số = version đang cache cho game này
  const [cachedVersion, setCachedVersion] = useState(undefined);
  const [offlineInfo, setOfflineInfo] = useState(null);
  const [syncedFor, setSyncedFor] = useState(null);
  const gameDataRef = useRef(null);
  const pushDataRef = useRef(null);

  /** Gửi số xu hiện có vào game (chỉ dùng iframeRef nên an toàn khi gọi sớm). */
  const postWallet = (wallet) => {
    const win = iframeRef.current?.contentWindow;
    if (win) win.postMessage({ type: "gq:wallet", ...wallet, online: navigator.onLine }, "*");
  };

  // Manifest giữ tên/emoji/màu đẹp. Nếu game mới chưa có trong manifest thì
  // tự dựng metadata từ <title> trong file để vẫn chơi được ngay.
  const meta = useMemo(() => {
    if (!html) return null;
    return findOfflineGame(gameId) || makeFallbackMeta(gameId, html);
  }, [gameId, html]);

  // Sync save với API phải XONG trước khi iframe chạy — game đọc localStorage
  // ngay lúc boot, khôi phục trễ thì tiến độ server ghi đè mất lượt chơi local.
  useEffect(() => {
    if (!html) return undefined;
    let cancelled = false;
    startGameSync(gameId, meta?.name).finally(() => {
      if (!cancelled) setSyncedFor(gameId);
    });
    return () => {
      cancelled = true;
      endGameSync();
    };
  }, [gameId, html, meta?.name]);

  // Chỉ render iframe khi save của game này đã được sync xong trước mắt.
  const saveReady = syncedFor === gameId;

  // So sánh version server với bản đang cache (không phải meta tĩnh) để
  // banner "Có phiên bản mới" chỉ hiện đúng khi thật sự có bản chưa tải.
  const { hasUpdate, checkForUpdate, markAsUpdated } = useGameVersion(
    meta?.playMode === "offline" && cachedVersion !== undefined ? gameId : null,
    cachedVersion || 0
  );

  // GĐ3: làm ấm cache IndexedDB — mở game khi online thì tải bản mới nhất về
  // lưu sẵn; mất mạng thì chơi tiếp bằng bản đã lưu và báo cho người chơi biết.
  useEffect(() => {
    if (!html) return;
    let cancelled = false;

    const pushDataToFrame = () => {
      const win = iframeRef.current?.contentWindow;
      if (win && gameDataRef.current) {
        win.postMessage({ type: "gq:gameData", ...gameDataRef.current }, "*");
      }
    };
    pushDataRef.current = pushDataToFrame;

    (async () => {
      const record = await gameCache.getRecord(gameId).catch(() => null);
      if (cancelled) return;
      setCachedVersion(record?.version || 0);
      if (record) {
        gameDataRef.current = { data: record.data, version: record.version };
        pushDataToFrame();
        if (!navigator.onLine) {
          setOfflineInfo({ version: record.version, cachedAt: record.cachedAt });
        }
      }

      if (!navigator.onLine) return;
      try {
        const [data, versionInfo] = await Promise.all([
          gameDataService.getData(gameId),
          gameDataService.getVersion(gameId),
        ]);
        if (cancelled) return;
        if (data) {
          const v = versionInfo?.version || 0;
          await gameCache.save(gameId, data, v).catch(() => {});
          gameDataRef.current = { data, version: v };
          pushDataToFrame();
          setCachedVersion(v);
          setOfflineInfo(null);
        }
      } catch {
        // API lỗi nhưng vẫn còn cache cũ → chơi tiếp, không cần báo lỗi
      }
    })();

    return () => {
      cancelled = true;
      pushDataRef.current = null;
    };
  }, [gameId, html]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type === "quit") navigate("/");
      // Túi tiền = xu tài khoản: game chỉ báo CHÊNH LỆCH, host mới là nơi
      // lưu localStorage và gọi API (xem src/lib/coinWallet.js).
      if (event.data?.type === "gq:walletGet") {
        postWallet(readWallet());
        loadWallet().then(postWallet);
      }
      if (event.data?.type === "gq:walletDelta") {
        postWallet(addCoins(Number(event.data.data?.amount) || 0));
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Mở trang là lấy xu từ API (có mạng) hoặc từ localStorage (mất mạng), rồi
  // đẩy vào iframe. Mỗi lần ví đổi (đổi vì chơi, vì sync API, vì có mạng lại)
  // thì game nhận số mới — game không tự gọi API nên không lo token/spam request.
  useEffect(() => {
    let cancelled = false;
    const refresh = () => loadWallet().then((w) => { if (!cancelled) postWallet(w); });
    const pushCache = () => postWallet(readWallet());
    refresh();
    const off = subscribeWallet(pushCache);
    window.addEventListener("online", refresh);
    window.addEventListener("offline", pushCache);
    return () => {
      cancelled = true;
      off();
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", pushCache);
    };
  }, []);

  // Hiển thị thông báo cập nhật khi có phiên bản mới
  useEffect(() => {
    if (hasUpdate && meta?.playMode === 'offline') {
      setShowUpdateNotification(true);
    }
  }, [hasUpdate, meta]);

  // Xử lý cập nhật game
  const handleUpdateGame = async () => {
    if (!meta || meta.playMode !== 'offline') return;

    try {
      // Tải bản mới nhất về cache rồi mới reload để lần mở sau chơi bản mới
      const [data, versionInfo] = await Promise.all([
        gameDataService.getData(gameId),
        gameDataService.getVersion(gameId),
      ]);
      if (data) {
        await gameCache.save(gameId, data, versionInfo?.version || 0).catch(() => {});
      }
    } catch (error) {
      console.error('Lỗi cập nhật game:', error);
    }
    markAsUpdated();
    setShowUpdateNotification(false);
    window.location.reload();
  };

  if (isSchoolMissionRedirect) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-paper">
        <Loader label="Đang mở Trường Vui Vẻ..." />
      </div>
    );
  }

  if (!html) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-paper">
        <div className="text-center max-w-md px-5">
          <div className="text-5xl">🤔</div>
          <p className="mt-3 font-display text-lg font-bold text-ink">Không tìm thấy game</p>
          <p className="mt-1 text-sm text-ink/60">id: {String(gameId || "(rỗng)")}</p>
          <p className="mt-3 text-xs text-ink/45">
            Kiểm tra file <code className="rounded bg-black/5 px-1.5 py-0.5">
              src/games/offline/{String(gameId)}.html
            </code>{" "}
            có tồn tại không. Nếu vừa thêm file, hãy tải lại trang (F5).
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-full border-2 border-ink/10 bg-paper2 px-4 py-2 text-sm font-extrabold text-ink/70 shadow-sm hover:bg-ink/5"
          >
            ← Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-paper">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-3 left-3 z-20 rounded-full border-2 border-ink bg-paper2 px-3 py-1.5 text-sm font-extrabold text-ink shadow hover:bg-white"
        aria-label="Về trang chủ"
      >
        ← Trang chủ
      </button>
      {saveReady ? (
        <iframe
          ref={iframeRef}
          title={meta.name}
          srcDoc={injectGameUi(html)}
          onLoad={() => { pushDataRef.current?.(); postWallet(readWallet()); }}
          sandbox="allow-scripts allow-same-origin"
          className="h-full w-full border-0"
        />
      ) : (
        <div className="fixed inset-0 grid place-items-center bg-paper">
          <Loader label="Đang tải dữ liệu đã lưu..." />
        </div>
      )}

      {/* Đang chơi offline bằng dữ liệu đã cache */}
      {offlineInfo && (
        <div className="fixed bottom-3 left-3 z-20 rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-white shadow-lg">
          📴 Ngoại tuyến — đang dùng dữ liệu đã lưu (bản v{offlineInfo.version})
        </div>
      )}

      {/* Thông báo cập nhật phiên bản mới */}
      {showUpdateNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="rounded-xl border-2 border-teal bg-paper2 p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎮</div>
              <div className="flex-1">
                <h3 className="font-display text-sm font-bold text-ink">Có phiên bản mới!</h3>
                <p className="mt-1 text-xs text-ink/60">
                  Game "{meta.name}" đã có phiên bản mới. Cập nhật để trải nghiệm tốt hơn.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={handleUpdateGame}
                    className="flex-1 rounded-lg bg-teal px-3 py-2 text-xs font-bold text-white hover:bg-teal/90"
                  >
                    Cập nhật ngay
                  </button>
                  <button
                    onClick={() => setShowUpdateNotification(false)}
                    className="flex-1 rounded-lg border-2 border-ink/10 bg-white px-3 py-2 text-xs font-bold text-ink/70 hover:bg-ink/5"
                  >
                    Để sau
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}