// ===== ACTIVITIES: bài học, bài thi, căng tin, cửa hàng, thể dục, thu hoa =====

function quiz(type, opts = {}) {
    const T = ST();
    if (!canStartLesson(type, opts)) return;
    
    if (S.en < T.energyPerLesson) {
        toast("⚡ Hết năng lượng! Ra Căng tin ăn nhé");
        return;
    }
    
    S.en -= T.energyPerLesson;
    let n = 0, ok = 0;
    const d = DATA.subjects[type], N = T.questionsPerLesson;

    function nx() {
        if (n >= N) {
            const c = ok * T.coinsPerCorrect, x = ok * T.xpPerCorrect;
            gain(c, x);
            const bonus = scoreBonus(ok, N, "lesson:" + type);
            modal(`
                <h2>${d.title}</h2>
                <div class="q">Đúng ${ok}/${N} câu 🎯</div>
                <p>+${c} 🪙 &nbsp; +${x} XP</p>
                ${bonus ? `<p style="color:#0a7d3c;font-weight:800">${bonus}</p>` : ""}
                <button class="btn" id="a1">Học tiếp</button> 
                <button class="btn" id="a2" style="background:#ddd;box-shadow:0 3px 0 #aaa">Xong</button>
            `);
            $("a1").onclick = () => { close_(); quiz(type, { force: true }) };
            $("a2").onclick = close_;
            return;
        }

        const q = mk(type);
        modal(`
            <h2>${d.title} (${n + 1}/${N})</h2>
            <div class="q">${q.q}</div>
            <div class="opts">
                ${q.o.map((o, i) => `<button class="opt" data-i="${i}">${o}</button>`).join("")}
            </div>
        `);

        document.querySelectorAll(".opt").forEach(b => b.onclick = () => {
            const i = +b.dataset.i;
            document.querySelectorAll(".opt").forEach(x => x.onclick = null);
            
            if (i == q.a) {
                b.classList.add("ok");
                ok++;
                prog(type);
            } else {
                b.classList.add("no");
                document.querySelectorAll(".opt")[q.a].classList.add("ok");
            }
            
            if (q.x) {
                $("box").insertAdjacentHTML("beforeend", `<p>💡 ${q.x}</p>`);
            }
            
            n++;
            setTimeout(nx, q.x ? 2200 : 900);
        });
    }
    nx();
}

/* Thư viện tầng 2: đứng gần Thủ thư là mở truyện đọc (2 câu văn) */
function readBook() {
    const T = ST();
    if (S.en < T.energyPerLesson) {
        toast("⚡ Hết năng lượng! Xuống Căng tin ăn nhé");
        return;
    }

    S.en -= T.energyPerLesson;
    let n = 0, ok = 0;
    const N = 2;

    function nx() {
        if (n >= N) {
            const c = ok * 3, x = ok * 4;
            gain(c, x);
            prog("read");
            const bonus = scoreBonus(ok, N, "read");
            modal(`
                <h2>📚 Đọc sách vui vẻ</h2>
                <div class="q">Đúng ${ok}/${N} câu 🎯</div>
                <p>+${c} 🪙 &nbsp; +${x} XP — Đọc sách mỗi ngày nhé!</p>
                ${bonus ? `<p style="color:#0a7d3c;font-weight:800">${bonus}</p>` : ""}
                <button class="btn" id="b3" style="background:#ddd;box-shadow:0 3px 0 #aaa">Đóng</button>
            `);
            $("b3").onclick = close_;
            return;
        }

        const q = mk("van");
        modal(`
            <h2>📖 Đọc hiểu (${n + 1}/${N})</h2>
            <div class="q">${q.q}</div>
            <div class="opts">
                ${q.o.map((o, i) => `<button class="opt" data-i="${i}">${o}</button>`).join("")}
            </div>
        `);

        document.querySelectorAll(".opt").forEach(b => b.onclick = () => {
            const i = +b.dataset.i;
            document.querySelectorAll(".opt").forEach(x => x.onclick = null);

            if (i == q.a) { b.classList.add("ok"); ok++; }
            else { b.classList.add("no"); document.querySelectorAll(".opt")[q.a].classList.add("ok"); }

            if (q.x) $("box").insertAdjacentHTML("beforeend", `<p>💡 ${q.x}</p>`);

            n++;
            setTimeout(nx, q.x ? 2200 : 900);
        });
    }
    nx();
}

/* Gửi kết quả bài thi lên trang cha (trang cha gọi API /users/me/exam-results) */
function reportExam(e, pc, pass, ok, qs, startedAt) {
    try {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: "school-exam-result",
                data: {
                    examId: e.id,
                    examTitle: e.title,
                    subject: e.subject,
                    score: pc,
                    passed: pass,
                    correct: ok,
                    total: qs.length,
                    durationSec: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
                    takenAt: new Date().toISOString(),
                },
            }, "*");
        }
    } catch (err) { /* iframe bị chặn — kết quả vẫn còn trong S.exam khi sync */ }
}

function runExam(e, opts = {}) {
    if (!canStartExam(e, opts)) return;
    const T = ST();

    if (S.en < T.energyPerExam) {
        toast("⚡ Cần " + T.energyPerExam + " năng lượng để thi!");
        return;
    }

    S.en -= T.energyPerExam;
    const qs = sh(e.questions).map(shq), pp = e.passPercent || 60;
    const startedAt = Date.now();
    let n = 0, ok = 0, tm;

    function end() {
        clearInterval(tm);
        const pc = Math.round(ok / qs.length * 100), pass = pc >= pp;
        const r = S.exam[e.id] || { best: 0, pass: false };
        let msg = "";

        if (pass && !r.pass) {
            const w = e.reward || {};
            S.gems += w.gems || 0;
            gain(w.coins || 0, w.xp || 0);
            msg = `🎁 Thưởng lần đầu đạt: +${w.coins || 0}🪙 +${w.gems || 0}💎 +${w.xp || 0}XP`;
        }

        // Điểm cao (≥80%) → coin thật vào ví; cộng luôn tiến độ nhiệm vụ thi cử.
        const bonus = scoreBonus(ok, qs.length, "exam:" + e.id);
        if (pc >= 80) prog("exam");

        r.best = Math.max(r.best, pc);
        r.pass = r.pass || pass;
        S.exam[e.id] = r;
        save();
        reportExam(e, pc, pass, ok, qs, startedAt);

        modal(`
            <h2>${e.title}</h2>
            <div class="q">${ok}/${qs.length} câu • ${pc}% ${pass ? "🎉 ĐẠT" : "😢 Chưa đạt"}</div>
            <p>${msg || (pass ? "" : "Cần đạt " + pp + "% — cố lên!")}</p>
            ${bonus ? `<p style="color:#0a7d3c;font-weight:800">${bonus}</p>` : ""}
            <button class="btn" id="b3" style="background:#ddd;box-shadow:0 3px 0 #aaa">Đóng</button>
        `);

        $("b3").onclick = close_;
    }

    function nx() {
        clearInterval(tm);
        if (n >= qs.length) {
            end();
            return;
        }

        const q = qs[n];
        let t = e.time || 0, lock = 0;

        modal(`
            <h2>📝 ${e.title} (${n + 1}/${qs.length})</h2>
            ${t ? `<div id="tm" style="font-weight:800">⏱ ${t}s</div>` : ""}
            <div class="q">${q.q}</div>
            <div class="opts">
                ${q.o.map((o, i) => `<button class="opt" data-i="${i}">${o}</button>`).join("")}
            </div>
        `);

        const fin = (b) => {
            if (lock) return;
            lock = 1;
            clearInterval(tm);
            document.querySelectorAll(".opt")[q.a].classList.add("ok");
            
            if (b) {
                if (+b.dataset.i == q.a) ok++;
                else b.classList.add("no");
            }
            
            if (q.x) {
                $("box").insertAdjacentHTML("beforeend", `<p>💡 ${q.x}</p>`);
            }
            
            n++;
            setTimeout(nx, q.x ? 2000 : 800);
        };

        document.querySelectorAll(".opt").forEach(b => b.onclick = () => fin(b));

        if (t) {
            tm = setInterval(() => {
                t--;
                const el = $("tm");
                if (el) el.textContent = "⏱ " + t + "s";
                if (t <= 0) fin(null);
            }, 1000);
        }
    }
    nx();
}

/* ═══ NHÀ ĂN: món cho bé + thức ăn cho thú cưng ═══ */
const CANTEEN_FOODS = [
    { id: "banhmi", n: "Bánh mì", icon: "🥪", price: 10, en: 30, xp: 2, desc: "Nhanh gọn, đủ chất" },
    { id: "comhop", n: "Cơm hộp", icon: "🍱", price: 25, en: 100, xp: 6, desc: "No căng bụng luôn" },
    { id: "sua", n: "Sữa tươi", icon: "🥛", price: 15, en: 45, xp: 4, desc: "Cao lớn khỏe mạnh" },
    { id: "traicay", n: "Trái cây", icon: "🍎", price: 20, en: 60, xp: 8, desc: "Vitamin đầy đủ" },
    { id: "kem", n: "Kem mát lạnh", icon: "🍦", price: 12, en: 20, xp: 3, desc: "Món tráng miệng" }
];

function buyCanteenFood(id) {
    const f = CANTEEN_FOODS.find(x => x.id === id);
    if (!f) return;
    if (S.coins < f.price) {
        toast("🪙 Không đủ xu! Hãy học bài để kiếm thêm nhé!");
        return;
    }
    S.coins -= f.price;
    S.en = Math.min(100, S.en + f.en);
    gain(0, f.xp);
    save();
    toast(`${f.icon} Đã thưởng thức ${f.n}: +${f.en}⚡ +${f.xp}XP`);
    canteen();
}

function buyPetFood(id) {
    const f = PET_FOODS[id];
    if (!f) return;
    if (S.coins < f.price) {
        toast(`🪙 Cần ${f.price} coin để mua ${f.name} cho thú cưng!`);
        return;
    }
    S.coins -= f.price;
    if (!S.pet || typeof S.pet !== "object") S.pet = defaultPetState();
    if (!S.pet.food) S.pet.food = { bone: 0, fish: 0, seed: 0, cake: 0 };
    S.pet.food[id] = (S.pet.food[id] || 0) + 1;
    save();
    toast(`🛒 Đã mua ${f.icon} ${f.name} cho thú cưng! Vào 🐾 Vườn thú cưng để cho ăn nhé.`);
    canteen();
}

function canteen() {
    const pet = S.pet || defaultPetState();
    const foodCards = CANTEEN_FOODS.map(f => `
        <button class="canteen-card" onclick="buyCanteenFood('${f.id}')">
            <span class="canteen-card-icon">${f.icon}</span>
            <span class="canteen-card-body">
                <b>${f.n}</b>
                <small>${f.desc}</small>
                <em>+${f.en}⚡ · +${f.xp}XP</em>
            </span>
            <span class="canteen-price">${f.price} 🪙</span>
        </button>`).join("");

    const petCards = Object.entries(PET_FOODS).map(([id, f]) => {
        const count = (pet.food && pet.food[id]) || 0;
        return `
        <button class="canteen-card pet" onclick="buyPetFood('${id}')">
            <span class="canteen-card-icon">${f.icon}</span>
            <span class="canteen-card-body">
                <b>${f.name}</b>
                <small>${f.desc} · +${f.exp} EXP</small>
                <em>Đang có: ${count}</em>
            </span>
            <span class="canteen-price">${f.price} 🪙</span>
        </button>`;
    }).join("");

    modal(`
        <div class="canteen-wrap">
            <div class="canteen-hero">
                <div class="canteen-hero-icon">🍔</div>
                <div style="flex:1;min-width:0">
                    <div class="canteen-title">NHÀ ĂN VUI VẺ</div>
                    <div class="canteen-sub">Ăn no để học giỏi · mua đồ ăn cho thú cưng</div>
                </div>
                <div class="canteen-wallet">🪙 ${S.coins.toLocaleString()}<br><small>⚡ ${Math.floor(S.en)}/100</small></div>
            </div>

            <div class="canteen-section-title">🍽️ Món cho bé</div>
            <div class="canteen-grid">${foodCards}</div>

            <div class="canteen-section-title">🐾 Đồ ăn cho ${pet.name} <small style="font-weight:700;color:#8d6e63">(Lv ${pet.level})</small></div>
            <div class="canteen-grid">${petCards}</div>

            <div class="canteen-note">💡 Mua thức ăn cho thú cưng rồi mở 🐾 Vườn thú cưng để cho bé ăn — bé sẽ lên cấp và mở thêm nhiều tính năng!</div>

            <div style="text-align:center;margin-top:12px">
                <button class="btn" id="b3" style="background:#cfd8dc;color:#37474f;box-shadow:0 3px 0 #90a4ae">Đóng</button>
            </div>
        </div>
    `);

    $("b3").onclick = close_;
}

function shop() {
    const it = (a, t) => a.map(([v, c]) => {
        const own = S.own.includes(v), eq = (t == "h" ? S.hat : S.col) == v;
        return `
            <span class="item ${own ? "own" : ""} ${eq ? "eq" : ""}" data-t="${t}" data-v="${v}" data-c="${c}">
                ${t == "h" ? (v || "❌") : `<span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:${v};vertical-align:middle"></span>`} 
                ${own ? "" : c + "🪙"}
            </span>
        `;
    }).join("");

    modal(`
        <h2>🛍️ Cửa hàng</h2>
        <p>🪙 ${S.coins}</p>
        <b>Phụ kiện</b><br>${it(hatShop, "h")}<br>
        <b>Màu áo</b><br>${it(colShop, "c")}<br>
        <button class="btn" id="b3">Đóng</button>
    `);

    document.querySelectorAll(".item").forEach(e => e.onclick = () => {
        const v = e.dataset.v, c = +e.dataset.c;
        if (!S.own.includes(v)) {
            if (S.coins < c) {
                toast("Không đủ xu!");
                return;
            }
            S.coins -= c;
            S.own.push(v);
        }
        e.dataset.t == "h" ? S.hat = v : S.col = v;
        save();
        shop();
    });
    $("b3").onclick = close_;
}

function gym() {
    let t = 0, go_ = 0, tm;
    
    modal(`
        <h2>🏃 Chạy bộ thể dục</h2>
        <p>Bấm thật nhanh trong 10 giây!</p>
        <div class="q" id="cnt">0</div>
        <button class="btn" id="run" style="font-size:24px;padding:18px 40px">CHẠY!</button>
    `);

    $("run").onclick = () => {
        if (!go_) {
            go_ = 1;
            let l = 10;
            tm = setInterval(() => {
                l--;
                if (l <= 0) {
                    clearInterval(tm);
                    const c = Math.floor(t / 2), x = Math.floor(t / 3);
                    gain(c, x);
                    modal(`
                        <h2>Hoàn thành! 🏅</h2>
                        <div class="q">${t} bước</div>
                        <p>+${c} 🪙 +${x} XP</p>
                        <button class="btn" id="b3">Đóng</button>
                    `);
                    $("b3").onclick = close_;
                }
            }, 1000);
        }
        t++;
        $("cnt").textContent = t;
    };
}

function garden() {
    if (flowers.length) {
        toast("Đang thu hoa rồi!");
        return;
    }
    if (S.en < 10) {
        toast("⚡ Hết năng lượng!");
        return;
    }
    
    S.en -= 10;
    const p = P[2];
    flowers = [];
    
    for (let i = 0; i < 8; i++) {
        flowers.push({
            x: p.x + 30 + Math.random() * (p.w - 60),
            y: p.y + 40 + Math.random() * (p.h - 70)
        });
    }
    ftime = 30;
    toast("🌸 Thu 8 bông hoa trong 30 giây!");
}