// ---------------------------------------------------------
// ui.js — HUD, modals, panels, toasts
// ---------------------------------------------------------

let selectedSubjectCode = null;
let toastTimer = null;

function updateHUD() {
  document.getElementById("coin-count").textContent = AppState.coins;
  document.getElementById("energy-count").textContent = AppState.energy;
  const subj = SUBJECTS.find(s => s.code === AppState.subject);
  document.getElementById("subject-icon").textContent = subj ? subj.icon : "📚";
  document.getElementById("hud-subject-name").textContent = subj ? subj.name : "";
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 2200);
}

function buildSubjectModal() {
  const grid = document.getElementById("subject-grid");
  grid.innerHTML = SUBJECTS.map(s => `
    <button class="lang-option" data-code="${s.code}">
      <span class="flag">${s.icon}</span> ${s.name}
    </button>
  `).join("");

  grid.querySelectorAll(".lang-option").forEach(btn => {
    btn.addEventListener("click", () => {
      grid.querySelectorAll(".lang-option").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSubjectCode = btn.dataset.code;
      document.getElementById("btn-start").disabled = false;
    });
  });

  document.getElementById("btn-start").addEventListener("click", () => {
    if (!selectedSubjectCode) return;
    AppState.subject = selectedSubjectCode;
    document.getElementById("subject-modal").classList.add("hidden");
    updateHUD();
    renderVocabList();
  });
}

function openSubjectModalForSwitch() {
  document.getElementById("subject-modal").classList.remove("hidden");
}

function initUIHandlers() {
  document.getElementById("btn-book").addEventListener("click", () => {
    document.getElementById("book-panel").classList.remove("hidden");
    renderVocabList();
  });
  document.getElementById("btn-close-book").addEventListener("click", () => {
    document.getElementById("book-panel").classList.add("hidden");
  });
  document.getElementById("btn-lang").addEventListener("click", () => {
    selectedSubjectCode = AppState.subject;
    const grid = document.getElementById("subject-grid");
    grid.querySelectorAll(".lang-option").forEach(b => {
      b.classList.toggle("selected", b.dataset.code === selectedSubjectCode);
    });
    document.getElementById("btn-start").disabled = false;
    openSubjectModalForSwitch();
  });
}

function updateInteractHint(state) {
  const hint = document.getElementById("hint-bubble");
  hint.classList.toggle("hidden", !state);
  if (!state) return;
  hint.innerHTML = state === "plant"
    ? 'Nhấn <b>E</b> để trả lời & gieo trồng 🌱'
    : 'Nhấn <b>E</b> để ôn lại ✨';
}
