// ---------------------------------------------------------
// vocab.js — flashcard popup + progress persistence
// ---------------------------------------------------------

const AppState = {
  subject: null,      // e.g. "en", "vi", "math", "geo"
  progress: {},        // { "subject:id": { seen: number, known: boolean } }
  coins: 0,
  energy: 5,

  load() {
    try {
      const raw = localStorage.getItem("farmProgress");
      if (raw) this.progress = JSON.parse(raw);
      const coinsRaw = localStorage.getItem("farmCoins");
      if (coinsRaw) this.coins = parseInt(coinsRaw, 10) || 0;
    } catch (e) { /* ignore */ }
  },

  save() {
    try {
      localStorage.setItem("farmProgress", JSON.stringify(this.progress));
      localStorage.setItem("farmCoins", String(this.coins));
    } catch (e) { /* ignore */ }
  },

  ensure(key) {
    if (!this.progress[key]) this.progress[key] = { seen: 0, known: false };
    return this.progress[key];
  },

  markSeen(id) {
    const key = `${this.subject}:${id}`;
    const p = this.ensure(key);
    p.seen = Math.min(3, p.seen + 1);
    this.save();
  },

  markKnown(id) {
    const key = `${this.subject}:${id}`;
    const p = this.ensure(key);
    p.known = true;
    p.seen = 3;
    this.coins += 10;
    this.save();
  },

  progressPct(id) {
    const key = `${this.subject}:${id}`;
    const p = this.progress[key];
    if (!p) return 0;
    if (p.known) return 100;
    return Math.round((p.seen / 3) * 100);
  },
};

let vocabCardOpen = false;

function openContentCard(itemId) {
  const item = CONTENT[AppState.subject].find(it => it.id === itemId);
  if (!item) return;

  vocabCardOpen = true;
  const modal = document.getElementById("vocab-modal");
  const inner = document.getElementById("vocab-card-inner");

  const pronLine = item.pron ? `<span class="vocab-pron">${item.pron}</span>` : "";
  const subLine = item.example.sub ? `<div class="ex-vi">${item.example.sub}</div>` : "";

  inner.innerHTML = `
    <button class="vocab-close" id="vocab-close-btn">✕</button>
    <div class="vocab-emoji-badge">${item.emoji}</div>
    <div class="vocab-word-row">
      <span class="vocab-word">${item.prompt}</span>
      ${pronLine}
    </div>
    <div class="vocab-vi">${item.answer}</div>
    <div class="vocab-example">
      <div class="ex-target">${item.example.main}</div>
      ${subLine}
    </div>
    <div class="vocab-btn-row">
      <button class="vocab-btn again" id="vocab-again-btn">Học lại sau</button>
      <button class="vocab-btn known" id="vocab-known-btn">Đã thuộc +10🌾</button>
    </div>
  `;

  modal.classList.remove("hidden");
  AppState.markSeen(itemId);
  updateHUD();
  renderVocabList();

  document.getElementById("vocab-close-btn").onclick = closeVocabCard;
  document.getElementById("vocab-again-btn").onclick = closeVocabCard;
  document.getElementById("vocab-known-btn").onclick = () => {
    AppState.markKnown(itemId);
    updateHUD();
    renderVocabList();
    showToast(`Tuyệt vời! +10🌾 cho "${item.prompt}"`);
    closeVocabCard();
  };
}

function closeVocabCard() {
  vocabCardOpen = false;
  document.getElementById("vocab-modal").classList.add("hidden");
}

function renderVocabList() {
  const list = document.getElementById("vocab-list");
  if (!AppState.subject) { list.innerHTML = ""; return; }
  const items = CONTENT[AppState.subject];
  list.innerHTML = items.map(item => {
    const pct = AppState.progressPct(item.id);
    const key = `${AppState.subject}:${item.id}`;
    const seen = (AppState.progress[key] && (AppState.progress[key].seen > 0 || AppState.progress[key].known));
    return `
      <div class="vocab-row">
        <span class="emoji">${item.emoji}</span>
        <div class="vocab-row-text">
          <div class="word"><span>${item.prompt}</span><span class="vi">${item.answer}</span></div>
          <div class="progress-track">
            <div class="progress-fill ${seen ? "" : "new"}" style="width:${pct}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}
