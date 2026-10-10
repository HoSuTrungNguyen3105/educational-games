(function () {
  if (!window.PARKOUR_S) window.PARKOUR_S = { sfx: true, voice: true };
  if (!window.PARKOUR_GAME) return;
  window.PARKOUR_S = window.PARKOUR_GAME.S;
  var boot = function () {
    try {
      window.PARKOUR_GAME.init();
    } catch (e) {
      console.error("[parkour-tri-thuc] init failed", e);
    }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();