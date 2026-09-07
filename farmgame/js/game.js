// ---------------------------------------------------------
// game.js — bootstraps a full-screen canvas, input, and the render loop
// ---------------------------------------------------------

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

function sizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const cssW = window.innerWidth;
  const cssH = window.innerHeight;

  // columns needed to cover the viewport width at native tile size,
  // never fewer than the farm blueprint requires
  const cols = Math.max(BASE_COLS, Math.ceil(cssW / TILE_SIZE));
  // uniform scale so the world's width exactly fills the viewport
  // (this is <1 only on screens narrower than the farm itself, e.g. phones)
  const scale = Math.min(1, cssW / (cols * TILE_SIZE));
  const effectiveTile = TILE_SIZE * scale;
  const rows = Math.max(BASE_ROWS, Math.ceil(cssH / effectiveTile));

  rebuildLayout(cols, rows);
  Player.recenter();

  const worldW = cols * TILE_SIZE;
  const worldH = rows * TILE_SIZE;

  canvas.width = Math.round(worldW * dpr);
  canvas.height = Math.round(worldH * dpr);
  canvas.style.width = `${worldW * scale}px`;
  canvas.style.height = `${worldH * scale}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const keysDown = new Set();
let lastMoveKeyTime = 0;
const MOVE_REPEAT_MS = 140;

function handleKeydown(e) {
  const key = e.key.toLowerCase();

  if (vocabCardOpen) {
    if (key === "escape") closeVocabCard();
    return;
  }

  if (key === "escape") {
    document.getElementById("book-panel").classList.add("hidden");
    return;
  }

  if (key === "e" || key === " ") {
    e.preventDefault();
    tryInteract();
    return;
  }

  keysDown.add(key);
}

function handleKeyup(e) {
  keysDown.delete(e.key.toLowerCase());
}

function readMovementIntent() {
  if (keysDown.has("arrowup") || keysDown.has("w")) return { dx: 0, dy: -1 };
  if (keysDown.has("arrowdown") || keysDown.has("s")) return { dx: 0, dy: 1 };
  if (keysDown.has("arrowleft") || keysDown.has("a")) return { dx: -1, dy: 0 };
  if (keysDown.has("arrowright") || keysDown.has("d")) return { dx: 1, dy: 0 };
  return null;
}

function tryInteract() {
  if (!AppState.subject) return;
  const target = Player.facingTile();
  const plot = isCropPlot(target.x, target.y);
  if (plot) openContentCard(plot.vocabId);
}

function setupTouchControls() {
  let touchStartX = 0, touchStartY = 0, touchActive = false;

  canvas.addEventListener("touchstart", e => {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchActive = true;
  }, { passive: true });

  canvas.addEventListener("touchend", e => {
    if (!touchActive) return;
    touchActive = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      tryInteract();
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) {
      Player.tryMove(dx > 0 ? 1 : -1, 0);
    } else {
      Player.tryMove(0, dy > 0 ? 1 : -1);
    }
  }, { passive: true });
}

function loop(now) {
  if (!vocabCardOpen && AppState.subject) {
    const intent = readMovementIntent();
    if (intent && now - lastMoveKeyTime > MOVE_REPEAT_MS) {
      Player.tryMove(intent.dx, intent.dy);
      lastMoveKeyTime = now;
    }
  }

  Player.update(now);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap(ctx, AppState.progress, AppState.subject, now);
  Player.draw(ctx, now);

  const facing = Player.facingTile();
  const facingPlot = isCropPlot(facing.x, facing.y);
  let hintState = null;
  if (facingPlot && !vocabCardOpen && AppState.subject) {
    const key = `${AppState.subject}:${facingPlot.vocabId}`;
    const known = AppState.progress[key] && AppState.progress[key].known;
    hintState = known ? "review" : "plant";
  }
  updateInteractHint(hintState);

  requestAnimationFrame(loop);
}

let resizeTimer = null;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(sizeCanvas, 120);
}

function init() {
  AppState.load();
  buildSubjectModal();
  initUIHandlers();
  setupTouchControls();
  sizeCanvas();

  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("keyup", handleKeyup);

  updateHUD();
  requestAnimationFrame(loop);
}

init();
