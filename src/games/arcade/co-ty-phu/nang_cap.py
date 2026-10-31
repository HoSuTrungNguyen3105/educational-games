#!/usr/bin/env python3
"""Cách dùng: python nang_cap.py file_goc.html  ->  tạo file_goc_nangcap.html"""
import re, sys

src = sys.argv[1]
html = open(src, encoding='utf-8').read()

def rep(pattern, new, regex=False, count=1):
    global html
    if regex:
        html, n = re.subn(pattern, lambda m: new, html, count=count, flags=re.S)
    else:
        n = html.count(pattern)
        html = html.replace(pattern, new, count)
    assert n >= 1, 'Không tìm thấy đoạn cần sửa: ' + pattern[:60]

CSS = r'''
        /* ===== NÂNG CẤP: thử thách học đường ===== */
        .wheel-display { font-size:22px; font-weight:800; text-align:center; padding:24px 12px; border-radius:16px; background:linear-gradient(135deg,#fef3cd,#f4b942); margin:12px 0; min-height:90px; display:flex; align-items:center; justify-content:center; }
        .wheel-display.spin { animation: diceSpin 0.4s linear infinite; }
        .box-row { display:flex; gap:12px; justify-content:center; margin:12px 0; }
        .box-btn { font-size:48px; padding:14px 20px; border-radius:16px; background:#fff3cd; border:2px solid var(--gold); }
        .box-btn:hover { transform:scale(1.12) rotate(-4deg); }
        .dare-card { font-size:18px; font-weight:700; text-align:center; background:#fff8e1; border:2px dashed var(--gold); border-radius:14px; padding:16px; }
'''
rep('        /* Responsive */', CSS + '\n        /* Responsive */')

# Bảng cờ: 2 ô Cơ Hội (thứ 2 và thứ 3) thành ô Thử Thách
cnt = {'n': 0}
def swap(m):
    cnt['n'] += 1
    return "E('Thử Thách','Vòng quay & thử thách!')," if cnt['n'] in (2, 3) else m.group(0)
html = re.sub(r"\{ name:'Cơ Hội', type:'CHANCE' \},", swap, html, count=3)

# Thẻ sự kiện mới + kho thử thách
NEW_CARDS = r'''eventCards: [
                    { text:'🎭 Thử thách học đường: làm xong nhận $100, từ chối trả $80.', effect:{ type:'dare', reward:100, fine:80 } },
                    { text:'🎭 Thử thách KHÓ: hoàn thành nhận $200, từ chối mất $150.', effect:{ type:'dare', reward:200, fine:150 } },
                    { text:'🎡 Vòng quay định mệnh! Quay để biết số phận.', effect:{ type:'wheel' } },
                    { text:'⚔️ Đấu tay đôi! Chọn đối thủ, tung xúc xắc, ai thấp điểm hơn nộp $80.', effect:{ type:'duel', stake:80 } },
                    { text:'🎁 Ba chiếc hộp bí ẩn đang chờ bạn chọn...', effect:{ type:'luckyBoxes' } },
                    { text:'🤲 Chia sẻ yêu thương: người giàu nhất tặng người nghèo nhất $100.', effect:{ type:'richToPoor', amount:100 } },
                    { text:'🏛️ Thuế tài sản: nộp $30 cho mỗi mảnh đất bạn sở hữu.', effect:{ type:'propertyTax', per:30 } },
                    { text:'🔀 Hoán đổi vị trí với một người chơi ngẫu nhiên!', effect:{ type:'swapPos' } },
'''
rep('eventCards: [', NEW_CARDS)

DARES = r'''dares: [
                    { cat:'🎤 Ca sĩ', text:'Hát một câu bài hát yêu thích của bạn.' },
                    { cat:'🎤 Ca sĩ', text:'Rap giới thiệu bản thân trong 10 giây.' },
                    { cat:'🎤 Ca sĩ', text:'Đọc một đoạn thơ bằng giọng MC thời sự.' },
                    { cat:'🐒 Diễn viên', text:'Bắt chước một con vật, cả lớp đoán tên.' },
                    { cat:'🐒 Diễn viên', text:'Diễn tả một nghề nghiệp bằng cử chỉ (không nói), cả lớp đoán.' },
                    { cat:'🐒 Diễn viên', text:'Đi như người máy 5 bước rồi tạo dáng 5 giây.' },
                    { cat:'🧠 Trí tuệ', text:'Đọc nhanh 3 lần: "Nồi đồng nấu ốc, nồi đất nấu ếch".' },
                    { cat:'🧠 Trí tuệ', text:'Kể tên 5 tỉnh thành Việt Nam trong 10 giây.' },
                    { cat:'🧠 Trí tuệ', text:'Đọc bảng cửu chương 7 trong 15 giây.' },
                    { cat:'🧠 Trí tuệ', text:'Nói 5 từ bắt đầu bằng chữ "T" trong 8 giây.' },
                    { cat:'🧠 Trí tuệ', text:'Đố cả lớp một câu đố vui, lớp trả lời đúng thì bạn hát 1 câu.' },
                    { cat:'🇬🇧 Tiếng Anh', text:'Nói 5 từ tiếng Anh về đồ dùng học tập.' },
                    { cat:'🇬🇧 Tiếng Anh', text:'Giới thiệu bản thân bằng tiếng Anh 3 câu.' },
                    { cat:'🇬🇧 Tiếng Anh', text:'Đếm từ 1 đến 20 bằng tiếng Anh thật nhanh.' },
                    { cat:'🤝 Tử tế', text:'Khen một bạn trong lớp một câu chân thành.' },
                    { cat:'🤝 Tử tế', text:'Cảm ơn một người vì một việc cụ thể họ đã làm cho bạn.' },
                    { cat:'🤝 Tử tế', text:'Kể một việc tốt bạn đã làm trong tuần này.' },
                    { cat:'🤝 Tử tế', text:'Chia sẻ một mẹo học bài hiệu quả cho cả lớp.' },
                    { cat:'🤪 Vui nhộn', text:'Làm mặt hài 5 giây mà không được cười.' },
                    { cat:'🤪 Vui nhộn', text:'Nói "Tôi là nhà vô địch!" bằng 3 giọng khác nhau.' },
                    { cat:'🤪 Vui nhộn', text:'Kể một chuyện cười. Cả lớp không cười thì bạn thắng!' },
                    { cat:'🤪 Vui nhộn', text:'Đứng một chân giữ thăng bằng 10 giây.' },
                    { cat:'👥 Cả lớp', text:'Cả lớp cùng vỗ tay theo nhịp bạn đưa ra.' },
                    { cat:'👥 Cả lớp', text:'Chọn một bạn thi oẳn tù tì, bạn thua thì hát 1 câu.' },
                ],
                bonusRewards: ['''
rep('bonusRewards: [', DARES)

# applyCardEffect: chuyển thẻ đặc biệt sang openSpecial
rep("case 'challenge': return { handled: false, challenge:",
    "case 'dare': case 'wheel': case 'duel': case 'luckyBoxes': case 'richToPoor': case 'propertyTax': case 'swapPos': return { handled:false, special:effect };\n                    case 'challenge': return { handled: false, challenge:")
rep('if (result.challenge) {', 'if (result.special) { openSpecial(m.pl, result.special, m.wasDouble); } else if (result.challenge) {')

# Sửa lỗi: "mất lượt" trước đây làm người KẾ TIẾP bị mất lượt
rep(r"function endTurn\(\) \{\s*if \(gameState.phase === 'finished'\) return;",
    "function endTurn() {\n                if (gameState.phase === 'finished') return;\n                { const prev = gameState.players[gameState.currentPlayerIndex]; if (gameState.skipNextTurn && prev) { prev.skip = true; gameState.skipNextTurn = false; } }", regex=True)
rep(r"if \(gameState\.skipNextTurn\) \{\s*gameState\.skipNextTurn = false;", "if (pl.skip) { pl.skip = false;", regex=True)
# Sửa lỗi: nút "Đã xử lý xong" khi nợ không chạy tiếp
rep(r"closeModal\(\);\s*const cb = uiState\.modal && uiState\.modal\.onOk;",
    "const cb = uiState.modal && uiState.modal.onOk; closeModal();", regex=True)

# Nút làm thử thách để ra tù
rep('Trả $${activeTheme.jailFine} ra tù</button>',
    'Trả $${activeTheme.jailFine} ra tù</button>\n              <button class="btn btn-primary" style="font-size:11px;padding:6px 10px;" onclick="window.__jailDare()">🎤 Làm thử thách ra tù</button>')

MODALS = r'''if (m.type === 'info') {
                    return `<div class="modal-overlay"><div class="modal" style="text-align:center;">
                      <div class="challenge-emoji">${m.emoji || 'ℹ️'}</div>
                      <h2 style="justify-content:center">${m.title}</h2>
                      <div class="modal-body">${m.text}</div>
                      <div class="modal-actions" style="justify-content:center"><button class="btn btn-primary" onclick="window.__infoOk()">TIẾP TỤC</button></div>
                    </div></div>`;
                }
                if (m.type === 'dare') {
                    const d = m.dare, e = m.eff || {};
                    const reward = e.reward || 0, fine = e.fine || 0;
                    return `<div class="modal-overlay"><div class="modal">
                      <h2>🎭 Thử thách học đường</h2>
                      <div class="modal-sub">${d.cat}${e.jail ? ' — hoàn thành để ra tù!' : ''}</div>
                      <div class="dare-card">${d.text}</div>
                      <div class="modal-sub" style="text-align:center;margin-top:10px;">👏 Cả lớp chứng kiến rồi bấm công nhận nhé!</div>
                      <div class="modal-actions" style="justify-content:center;">
                        <button class="btn btn-teal" onclick="window.__dareDone()">✅ Xong rồi${reward ? ' (+$' + reward + ')' : ''}</button>
                        <button class="btn btn-secondary" onclick="window.__dareSkip()">🙅 Bỏ qua${fine ? ' (-$' + fine + ')' : ''}</button>
                        ${m.rerolled ? '' : '<button class="btn btn-primary" onclick="window.__dareReroll()">🔄 Đổi thử thách (miễn phí 1 lần)</button>'}
                      </div>
                    </div></div>`;
                }
                if (m.type === 'wheel') {
                    const r = m.result;
                    return `<div class="modal-overlay"><div class="modal" style="text-align:center;">
                      <h2 style="justify-content:center">🎡 Vòng quay định mệnh</h2>
                      <div class="wheel-display ${m.spinning ? 'spin' : ''}" id="wheelLabel">${r ? r.e + ' ' + r.t : (m.spinning ? '🎡 ...' : '❓ Bấm quay để biết số phận!')}</div>
                      <div class="modal-actions" style="justify-content:center;">
                        ${r ? '<button class="btn btn-primary" onclick="window.__wheelOk()">TIẾP TỤC</button>' : `<button class="btn btn-primary" ${m.spinning ? 'disabled' : ''} onclick="window.__spin()">🎡 QUAY!</button>`}
                      </div>
                    </div></div>`;
                }
                if (m.type === 'duel') {
                    const others = gameState.players.filter(p => p.id !== m.pl.id && !p.isBankrupt);
                    if (m.result) {
                        return `<div class="modal-overlay"><div class="modal" style="text-align:center;"><h2 style="justify-content:center">⚔️ Kết quả</h2>
                          <div class="modal-body">${m.result}</div>
                          <div class="modal-actions" style="justify-content:center;"><button class="btn btn-primary" onclick="window.__duelOk()">TIẾP TỤC</button></div></div></div>`;
                    }
                    return `<div class="modal-overlay"><div class="modal"><h2>⚔️ Đấu tay đôi</h2>
                      <div class="modal-body">Chọn đối thủ. Cả hai tung xúc xắc, ai thấp hơn nộp <b>$${m.eff.stake || 80}</b> cho người thắng!</div>
                      <div class="modal-actions" style="flex-direction:column;gap:6px;">
                        ${others.map(o => `<button class="btn btn-secondary" onclick="window.__duelPick(${o.id})">${o.avatar} ${o.name}</button>`).join('')}
                      </div></div></div>`;
                }
                if (m.type === 'boxes') {
                    return `<div class="modal-overlay"><div class="modal" style="text-align:center;"><h2 style="justify-content:center">🎁 Chọn một chiếc hộp</h2>
                      <div class="modal-body">Bên trong có thể là kho báu... hoặc một điều bất ngờ!</div>
                      <div class="box-row">${[0, 1, 2].map(i => `<button class="box-btn" onclick="window.__pickBox(${i})">🎁</button>`).join('')}</div></div></div>`;
                }
                if (m.type === 'win') {'''
rep("if (m.type === 'win') {", MODALS)

JS = r'''
            // =========================
            // NÂNG CẤP: THỬ THÁCH HỌC ĐƯỜNG
            // =========================
            function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
            function shuffle(a) { return a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]); }
            function afterSpecial(pl, wd) { checkBankruptcyNeeded(pl, () => finishResolution(pl, wd)); }
            function infoModal(title, text, emoji, onOk) { openModal({ type: 'info', title, text, emoji, onOk }); }
            function aliveOthers(pl) { return gameState.players.filter(p => p.id !== pl.id && !p.isBankrupt); }

            const WHEEL = [
                { e: '💰', t: 'Trúng lớn! +$200', run: p => changeMoney(p, 200) },
                { e: '💸', t: 'Mất $120', run: p => changeMoney(p, -120) },
                { e: '⏭️', t: 'Mất lượt kế tiếp', run: p => { gameState.skipNextTurn = true; } },
                { e: '🎲', t: 'Được thêm một lượt!', run: p => { gameState.extraTurn = true; } },
                { e: '🚔', t: 'Vào tù!', run: p => sendToJail(p) },
                { e: '🎫', t: 'Nhận thẻ Ra Tù Miễn Phí', run: p => { p.getOutOfJailCards++; } },
                { e: '🤝', t: 'Chia $40 cho mỗi bạn', run: p => aliveOthers(p).forEach(o => { o.money += 40; p.money -= 40; }) },
                { e: '🎊', t: 'Mỗi bạn tặng bạn $30', run: p => aliveOthers(p).forEach(o => { o.money -= 30; p.money += 30; }) },
                { e: '🎭', t: 'Làm một thử thách học đường', dare: true },
                { e: '🔄', t: 'Đổi chỗ với người chơi ngẫu nhiên', run: p => { const o = rnd(aliveOthers(p)); if (o) { const t = p.position; p.position = o.position; o.position = t; addLog(`🔄 ${p.name} đổi chỗ với ${o.name}!`); } } },
                { e: '📚', t: 'Được +30 XP chăm học', run: p => addXP(p, 30) },
            ];

            function openSpecial(pl, eff, wd) {
                const others = aliveOthers(pl);
                switch (eff.type) {
                    case 'dare': {
                        const list = activeTheme.dares || [];
                        if (!list.length) { afterSpecial(pl, wd); return; }
                        openModal({ type: 'dare', pl, wasDouble: wd, eff, dare: rnd(list), rerolled: false });
                        break;
                    }
                    case 'wheel': openModal({ type: 'wheel', pl, wasDouble: wd, spinning: false, result: null }); break;
                    case 'duel':
                        if (!others.length) { afterSpecial(pl, wd); return; }
                        openModal({ type: 'duel', pl, wasDouble: wd, eff, result: null });
                        break;
                    case 'luckyBoxes':
                        openModal({ type: 'boxes', pl, wasDouble: wd, outcomes: shuffle([
                            { a: 200, e: '💎', t: 'Kho báu!' }, { a: -100, e: '🕷️', t: 'Hộp đầy nhện!' }, { a: 50, e: '🍬', t: 'Kẹo ngọt' } ]) });
                        break;
                    case 'richToPoor': {
                        const alive = gameState.players.filter(p => !p.isBankrupt).sort((a, b) => b.money - a.money);
                        const rich = alive[0], poor = alive[alive.length - 1];
                        if (!rich || rich === poor) { afterSpecial(pl, wd); return; }
                        const amt = Math.max(0, Math.min(eff.amount || 100, rich.money));
                        rich.money -= amt; poor.money += amt;
                        addLog(`🤲 ${rich.name} tặng ${poor.name} $${amt}.`);
                        infoModal('Chia sẻ yêu thương', `${rich.name} (giàu nhất) tặng ${poor.name} (ít tiền nhất) <b>$${amt}</b>. Cả lớp vỗ tay nào! 👏`, '🤲', () => afterSpecial(pl, wd));
                        break;
                    }
                    case 'propertyTax': {
                        const amt = pl.properties.length * (eff.per || 30);
                        if (!amt) { infoModal('Thuế tài sản', 'Bạn chưa có đất nên được miễn thuế! 🎉', '🏛️', () => afterSpecial(pl, wd)); break; }
                        changeMoney(pl, -amt);
                        addLog(`🏛️ ${pl.name} nộp thuế tài sản $${amt}.`);
                        infoModal('Thuế tài sản', `Bạn có ${pl.properties.length} mảnh đất, nộp <b>$${amt}</b>.`, '🏛️', () => afterSpecial(pl, wd));
                        break;
                    }
                    case 'swapPos': {
                        const o = rnd(others);
                        if (!o) { afterSpecial(pl, wd); return; }
                        const t = pl.position; pl.position = o.position; o.position = t;
                        addLog(`🔀 ${pl.name} hoán đổi vị trí với ${o.name}.`);
                        infoModal('Hoán đổi vị trí', `${pl.name} và ${o.name} đã đổi chỗ cho nhau!`, '🔀', () => afterSpecial(pl, wd));
                        break;
                    }
                    default: afterSpecial(pl, wd);
                }
            }

            window.__infoOk = function () { const m = uiState.modal; closeModal(); if (m && m.onOk) m.onOk(); };
            window.__dareReroll = function () { const m = uiState.modal; m.dare = rnd(activeTheme.dares); m.rerolled = true; render(); };
            window.__dareDone = function () {
                const m = uiState.modal, pl = m.pl, e = m.eff || {};
                closeModal(); addXP(pl, 15);
                if (e.jail) { pl.isInJail = false; pl.jailTurns = 0; addLog(`🎤 ${pl.name} hoàn thành thử thách và được ra tù!`); render(); return; }
                const r = e.reward || 0; if (r) changeMoney(pl, r);
                addLog(`🎭 ${pl.name} hoàn thành thử thách${r ? ' +$' + r : ''}!`);
                finishResolution(pl, m.wasDouble);
            };
            window.__dareSkip = function () {
                const m = uiState.modal, pl = m.pl, e = m.eff || {};
                closeModal();
                if (e.jail) { addLog(`🙅 ${pl.name} bỏ qua thử thách, vẫn ở trong tù.`); render(); return; }
                const f = e.fine || 0; if (f) changeMoney(pl, -f);
                addLog(`🙅 ${pl.name} từ chối thử thách${f ? ' -$' + f : ''}.`);
                afterSpecial(pl, m.wasDouble);
            };
            window.__jailDare = function () {
                const pl = currentPlayer();
                if (gameState.phase !== 'rolling' || !pl.isInJail || !(activeTheme.dares || []).length) return;
                openModal({ type: 'dare', pl, wasDouble: false, eff: { jail: true }, dare: rnd(activeTheme.dares), rerolled: false });
            };
            window.__spin = function () {
                const m = uiState.modal; if (!m || m.spinning || m.result) return;
                m.spinning = true; render();
                let n = 0;
                const iv = setInterval(() => {
                    const o = rnd(WHEEL), el = document.getElementById('wheelLabel');
                    if (el) el.textContent = o.e + ' ' + o.t;
                    if (++n >= 18) {
                        clearInterval(iv);
                        m.result = rnd(WHEEL); m.spinning = false;
                        if (m.result.run) m.result.run(m.pl);
                        addLog(`🎡 ${m.pl.name} quay trúng: ${m.result.t}`);
                        render();
                    }
                }, 110);
            };
            window.__wheelOk = function () {
                const m = uiState.modal, pl = m.pl;
                closeModal();
                if (m.result.dare) openSpecial(pl, { type: 'dare', reward: 80, fine: 100 }, m.wasDouble);
                else afterSpecial(pl, m.wasDouble);
            };
            window.__duelPick = function (id) {
                const m = uiState.modal, pl = m.pl, o = gameState.players.find(p => p.id === id);
                let a, b;
                do { a = 1 + Math.floor(Math.random() * 6); b = 1 + Math.floor(Math.random() * 6); } while (a === b);
                const win = a > b ? pl : o, lose = a > b ? o : pl;
                const pay = Math.max(0, Math.min(m.eff.stake || 80, lose.money));
                lose.money -= pay; win.money += pay;
                m.result = `🎲 ${pl.name}: <b>${a}</b> &nbsp;—&nbsp; ${o.name}: <b>${b}</b><br>🏆 ${win.name} thắng! ${lose.name} nộp $${pay}.`;
                addLog(`⚔️ ${pl.name} đấu ${o.name}: ${a}-${b}. ${win.name} thắng $${pay}.`);
                render();
            };
            window.__duelOk = function () { const m = uiState.modal; closeModal(); afterSpecial(m.pl, m.wasDouble); };
            window.__pickBox = function (i) {
                const m = uiState.modal, pl = m.pl, o = m.outcomes[i];
                closeModal(); changeMoney(pl, o.a);
                addLog(`🎁 ${pl.name} mở hộp: ${o.t} (${o.a >= 0 ? '+' : ''}$${o.a})`);
                infoModal(o.t, `Bạn mở hộp số ${i + 1}: <b>${o.a >= 0 ? '+' : ''}$${o.a}</b>`, o.e, () => afterSpecial(pl, m.wasDouble));
            };

            // Signal ready to parent'''
rep('\n            // Signal ready to parent', JS)

out = src.replace('.html', '') + '_nangcap.html'
open(out, 'w', encoding='utf-8').write(html)
print('Xong ->', out)