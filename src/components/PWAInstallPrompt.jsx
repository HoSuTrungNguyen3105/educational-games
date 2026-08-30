import { useState, useEffect } from "react";

function getIsInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
}

function getWasDismissed() {
  return localStorage.getItem("pwa-install-dismissed") === "1";
}

function setDismissed() {
  localStorage.setItem("pwa-install-dismissed", "1");
}

function clearDismissed() {
  localStorage.removeItem("pwa-install-dismissed");
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    if (getIsInstalled()) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!getWasDismissed()) setShowInstall(true);
    };

    const installedHandler = () => {
      setShowInstall(false);
      setDeferredPrompt(null);
      clearDismissed();
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    // Fallback: nếu beforeinstallprompt không fire trong 3s → hiện prompt bằng manual mode
    const fallbackTimer = setTimeout(() => {
      if (!getIsInstalled() && !getWasDismissed() && !deferredPrompt) {
        setShowInstall(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback: hướng dẫn user manually install
      alert("Vui lòng sử dụng menu trình duyệt → 'Thêm vào màn hình chính' để cài đặt ứng dụng.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstall(false);
      clearDismissed();
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstall(false);
    setDismissed();
  };

  if (getIsInstalled() || !showInstall) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 animate-slide-up"
      style={{
        background: "var(--card, #fff)",
        border: "1px solid var(--line, #e5e7eb)",
        borderRadius: "1rem",
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        padding: "16px 20px",
      }}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl shrink-0">📱</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-sm font-bold text-ink mb-0.5">Cài đặt ứng dụng</h3>
          <p className="text-xs mb-3" style={{ color: "var(--muted, #8A7C63)" }}>
            Thêm EduGames vào màn hình chính để truy cập nhanh hơn!
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, var(--accent, #6C3BF5), var(--purple, #8b5cf6))" }}
            >
              Cài đặt
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold transition hover:opacity-70"
              style={{ color: "var(--muted, #8A7C63)" }}
            >
              Để sau
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-lg shrink-0 leading-none opacity-40 hover:opacity-100 transition"
          style={{ color: "var(--ink, #1D2E4A)" }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
