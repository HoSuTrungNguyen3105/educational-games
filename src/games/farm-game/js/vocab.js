// ---------------------------------------------------------
// vocab.js — plant-by-quiz popup + progress persistence
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

// Opens the plant/harvest flow for a plot. If the crop is already known
// it's a quick review card; otherwise the player must answer a multiple
// choice question correctly before the crop is actually planted.
function openContentCard(itemId) {
  const item = CONTENT[AppState.subject].find(it => it.id === itemId);
  if (!item) return;

  const key = `${AppState.subject}:${itemId}`;
  const already = AppState.progress[key] && AppState.progress[key].known;

  vocabCardOpen = true;
  AppState.markSeen(itemId);
  updateHUD();

  if (already) {
    renderReviewCard(item);
  } else {
    renderQuizCard(item);
  }
}

function closeVocabCard() {
  vocabCardOpen = false;
  document.getElementById("vocab-modal").classList.add("hidden");
}

// ---------- quiz (plant gate) ----------

function renderQuizCard(item) {
  const modal = document.getElementById("vocab-modal");
  const inner = document.getElementById("vocab-card-inner");
  const options = buildQuizOptions(AppState.subject, item);
  const pronLine = item.pron ? `<span class="vocab-pron">${item.pron}</span>` : "";
  const longText = options.some(o => o.length > 14);

  inner.innerHTML = `
    <button class="vocab-close" id="vocab-close-btn">✕</button>
    <div class="quiz-tag">🌱 Trả lời đúng để gieo trồng</div>
    <div class="vocab-emoji-badge">${item.emoji}</div>
    <div class="vocab-word-row">
      <span class="vocab-word">${item.prompt}</span>
      ${pronLine}
    </div>
    <div class="quiz-options ${longText ? "stacked" : ""}" id="quiz-options"></div>
    <div class="quiz-feedback" id="quiz-feedback"></div>
  `;

  const optWrap = document.getElementById("quiz-options");
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "quiz-opt";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleQuizAnswer(item, opt, btn));
    optWrap.appendChild(btn);
  });

  modal.classList.remove("hidden");
  document.getElementById("vocab-close-btn").onclick = closeVocabCard;
}

function handleQuizAnswer(item, chosen, btn) {
  const feedback = document.getElementById("quiz-feedback");
  const isCorrect = chosen === item.answer;
  const allBtns = document.querySelectorAll("#quiz-options .quiz-opt");

  if (isCorrect) {
    allBtns.forEach(b => { b.disabled = true; if (b !== btn) b.classList.add("dim"); });
    btn.classList.add("correct");
    feedback.className = "quiz-feedback good";
    feedback.textContent = "Chính xác! Hạt giống đang được gieo xuống… 🌱";

    setTimeout(() => {
      AppState.markKnown(item.id);
      updateHUD();
      renderVocabList();
      renderPlantedCard(item);
    }, 650);
  } else {
    btn.disabled = true;
    btn.classList.add("wrong");
    feedback.className = "quiz-feedback bad";
    feedback.textContent = "Chưa đúng, thử lại nhé!";
    const card = document.getElementById("vocab-card-inner");
    card.classList.remove("shake");
    void card.offsetWidth; // restart animation
    card.classList.add("shake");
  }
}

// success screen shown right after a correct answer plants the crop
function renderPlantedCard(item) {
  const modal = document.getElementById("vocab-modal");
  const inner = document.getElementById("vocab-card-inner");
  const subLine = item.example.sub ? `<div class="ex-vi">${item.example.sub}</div>` : "";

  inner.innerHTML = `
    <button class="vocab-close" id="vocab-close-btn">✕</button>
    <div class="quiz-tag success">🌾 Đã trồng thành công!</div>
    <div class="vocab-emoji-badge">${item.emoji}</div>
    <div class="vocab-word-row">
      <span class="vocab-word">${item.prompt}</span>
    </div>
    <div class="vocab-vi">${item.answer}</div>
    <div class="vocab-example">
      <div class="ex-target">${item.example.main}</div>
      ${subLine}
    </div>
    <div class="vocab-btn-row">
      <button class="vocab-btn known" id="vocab-done-btn">Tuyệt vời! +10🌾</button>
    </div>
  `;
  modal.classList.remove("hidden");
  document.getElementById("vocab-close-btn").onclick = closeVocabCard;
  document.getElementById("vocab-done-btn").onclick = () => {
    showToast(`Đã gieo trồng "${item.prompt}"! +10🌾`);
    closeVocabCard();
  };
}

// ---------- review (already planted) ----------

function renderReviewCard(item) {
  const modal = document.getElementById("vocab-modal");
  const inner = document.getElementById("vocab-card-inner");
  const pronLine = item.pron ? `<span class="vocab-pron">${item.pron}</span>` : "";
  const subLine = item.example.sub ? `<div class="ex-vi">${item.example.sub}</div>` : "";

  inner.innerHTML = `
    <button class="vocab-close" id="vocab-close-btn">✕</button>
    <div class="quiz-tag success">✨ Đã trồng — ôn lại nào</div>
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
      <button class="vocab-btn known" id="vocab-close2-btn">Đóng lại</button>
    </div>
  `;
  modal.classList.remove("hidden");
  document.getElementById("vocab-close-btn").onclick = closeVocabCard;
  document.getElementById("vocab-close2-btn").onclick = closeVocabCard;
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
