// src/games/src/quiz.js — Đố Vui Khoa Học (Khoa học)
// Sinh tự động từ game1.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game1.html.

    const QUIZ = [
      { q: 'Hành tinh nào gần Mặt Trời nhất?', o: ['Sao Thủy', 'Sao Kim', 'Trái Đất', 'Sao Hỏa'], e: 'Sao Thủy cách Mặt Trời trung bình khoảng 58 triệu km.' },
      { q: 'Nước tinh khiết sôi ở bao nhiêu độ C (ở mực nước biển)?', o: ['100°C', '90°C', '80°C', '120°C'], e: 'Ở áp suất khí quyển bình thường, nước sôi ở 100°C.' },
      { q: 'Cơ quan nào bơm máu đi khắp cơ thể?', o: ['Tim', 'Phổi', 'Gan', 'Thận'], e: 'Tim co bóp liên tục để đẩy máu đến mọi bộ phận.' },
      { q: 'Khí nào cây xanh hấp thụ để quang hợp?', o: ['Khí cacbonic (CO₂)', 'Khí oxi (O₂)', 'Khí nitơ (N₂)', 'Khí hiđro (H₂)'], e: 'Cây dùng CO₂, nước và ánh sáng để tạo chất dinh dưỡng và thải ra oxi.' },
      { q: 'Đại dương nào lớn nhất thế giới?', o: ['Thái Bình Dương', 'Đại Tây Dương', 'Ấn Độ Dương', 'Bắc Băng Dương'], e: 'Thái Bình Dương chiếm khoảng một phần ba diện tích bề mặt Trái Đất.' },
      { q: 'Trái Đất quay quanh Mặt Trời một vòng mất khoảng bao lâu?', o: ['1 năm', '1 tháng', '1 tuần', '1 ngày'], e: 'Một vòng quanh Mặt Trời khoảng 365 ngày, tức là một năm.' },
      { q: 'Động vật nào sau đây là động vật có vú sống dưới nước?', o: ['Cá voi', 'Cá mập', 'Cá ngừ', 'Cá chép'], e: 'Cá voi thở bằng phổi và nuôi con bằng sữa nên là động vật có vú.' },
      { q: 'Đỉnh núi nào cao nhất Việt Nam?', o: ['Fansipan', 'Bà Nà', 'Tam Đảo', 'Yên Tử'], e: 'Fansipan cao khoảng 3.143 m, được gọi là "nóc nhà Đông Dương".' },
      { q: 'Kim loại nào ở thể lỏng ở nhiệt độ phòng?', o: ['Thủy ngân', 'Sắt', 'Đồng', 'Nhôm'], e: 'Thủy ngân nóng chảy ở khoảng -39°C nên luôn lỏng ở nhiệt độ thường.' },
      { q: 'Di sản thiên nhiên thế giới nào nằm ở tỉnh Quảng Ninh?', o: ['Vịnh Hạ Long', 'Phong Nha - Kẻ Bàng', 'Vịnh Nha Trang', 'Đảo Phú Quốc'], e: 'Vịnh Hạ Long nổi tiếng với hàng nghìn đảo đá vôi.' },
      { q: 'Số nguyên tố nhỏ nhất là số nào?', o: ['2', '1', '3', '0'], e: 'Số nguyên tố có đúng hai ước là 1 và chính nó. Số 2 là số nguyên tố nhỏ nhất và cũng là số nguyên tố chẵn duy nhất.' },
      { q: 'Ánh sáng hay âm thanh truyền nhanh hơn?', o: ['Ánh sáng', 'Âm thanh', 'Bằng nhau', 'Tùy ngày'], e: 'Vì vậy ta thấy tia chớp trước rồi mới nghe tiếng sấm.' },
      { q: 'Bộ phận nào của cây hút nước và muối khoáng từ đất?', o: ['Rễ', 'Lá', 'Thân', 'Hoa'], e: 'Rễ có nhiều lông hút giúp cây hút nước và muối khoáng.' },
      { q: 'Công thức hóa học của nước là gì?', o: ['H₂O', 'CO₂', 'O₂', 'NaCl'], e: 'Mỗi phân tử nước gồm 2 nguyên tử hiđro và 1 nguyên tử oxi.' },
      { q: 'Hành tinh nào được gọi là "hành tinh đỏ"?', o: ['Sao Hỏa', 'Sao Mộc', 'Sao Thổ', 'Sao Thiên Vương'], e: 'Bề mặt Sao Hỏa chứa nhiều oxit sắt nên có màu đỏ gỉ.' },
      { q: 'Ai là tác giả của Truyện Kiều?', o: ['Nguyễn Du', 'Nguyễn Trãi', 'Hồ Xuân Hương', 'Nguyễn Đình Chiểu'], e: 'Nguyễn Du (1765-1820) là đại thi hào của dân tộc.' },
      { q: 'Xương nào dài nhất trong cơ thể người?', o: ['Xương đùi', 'Xương sườn', 'Xương cánh tay', 'Xương sống'], e: 'Xương đùi vừa dài vừa chắc, chịu sức nặng của cả cơ thể.' },
      { q: 'Loài chim nào không biết bay và sống ở vùng cực Nam?', o: ['Chim cánh cụt', 'Đà điểu', 'Chim én', 'Chim bồ câu'], e: 'Chim cánh cụt dùng đôi cánh như mái chèo để bơi rất giỏi.' },
      { q: 'Tổng ba góc trong một tam giác bằng bao nhiêu độ?', o: ['180°', '90°', '360°', '270°'], e: 'Với mọi tam giác, tổng ba góc luôn bằng 180°.' },
      { q: 'Cầu vồng thường được nói là có mấy màu?', o: ['7 màu', '5 màu', '6 màu', '9 màu'], e: 'Đỏ, cam, vàng, lục, lam, chàm, tím.' },
      { q: 'Đơn vị đo lực trong hệ SI là gì?', o: ['Niutơn (N)', 'Kilôgam (kg)', 'Mét (m)', 'Giây (s)'], e: 'Đơn vị được đặt theo tên nhà khoa học Isaac Newton.' },
      { q: 'Mặt Trăng là gì của Trái Đất?', o: ['Vệ tinh tự nhiên', 'Một ngôi sao', 'Một hành tinh', 'Một sao chổi'], e: 'Mặt Trăng quay quanh Trái Đất và phản chiếu ánh sáng Mặt Trời.' }
    ];

    /* ============ GAME 1: ĐUA TOÁN ============ */

    function quizGame(root) {
      const qs = shuffle(QUIZ).slice(0, 10).map(q => ({ ...q, opts: shuffle(q.o.map((t, k) => ({ t, c: k === 0 }))) }));
      let i = 0, score = 0, right = 0, streak = 0, fifty = true, time = 15, done = false;
      function show() {
        const q = qs[i]; done = false; time = 15;
        root.innerHTML = `<div class="hud"><span>Câu <b>${i + 1}/10</b></span><span>⭐ <b>${score}</b></span><span>🔥 ${streak}</span></div>
      <div class="timebar"><i id="tb"></i></div>
      <div class="qbox txt">${q.q}</div>
      <div class="opts one" id="o">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${o.t}</button>`).join('')}</div>
      <div class="row" id="ll"><button class="btn alt" data-ll="1" ${fifty ? '' : 'disabled'}>✂️ 50:50</button></div>
      <div id="ex"></div>`;
      }
      function answer(k) {
        if (done) return; done = true;
        const q = qs[i], btns = [...root.querySelectorAll('.opt')];
        btns.forEach(b => b.classList.remove('gone'));
        const ci = q.opts.findIndex(o => o.c);
        btns[ci].classList.add('ok');
        if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }
        else { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }
        $('#ll').innerHTML = `<button class="btn" data-next="1">${i < 9 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>`;
        $('#ex').innerHTML = `<div class="explain">💡 ${k === -1 ? 'Hết giờ! ' : ''}${q.e}</div>`;
      }
      root.onclick = e => {
        const o = e.target.closest('.opt'), l = e.target.closest('[data-ll]'), n = e.target.closest('[data-next]');
        if (o) answer(+o.dataset.k);
        else if (l && fifty && !done) {
          fifty = false; const q = qs[i];
          const wrong = shuffle(q.opts.map((x, k) => k).filter(k => !q.opts[k].c)).slice(0, 2);
          const btns = [...root.querySelectorAll('.opt')]; wrong.forEach(k => btns[k].classList.add('gone'));
          l.disabled = true;
        } else if (n) {
          i++;
          if (i < 10) show();
          else {
            if (right === 10) S.flags.perfect = true;
            T.clear();
            finish({
              id: 'quiz', score, xp: Math.round(score / 4),
              lines: [`Đúng ${right}/10 câu`],
              replay: quizGame,
              details: { right }
            });
          }
        }
      };
      T.int(() => {
        if (done) return;
        time -= .1; const tb = $('#tb'); if (tb) tb.style.width = Math.max(0, time / 15 * 100) + '%';
        if (time <= 0) answer(-1);
      }, 100);
      show();
    }

    /* ============ GAME 5: RẮN SĂN ĐÁP ÁN ============ */
startSingleGame({
  id: 'quiz',
  name: 'Đố Vui Khoa Học',
  icon: '🔬',
  storageKey: 'offline_quiz',
  mount: quizGame,
  badges: [
      { id: 'perfect', n: 'Trả lời 10/10', i: '🎯', ok: () => !!S.flags.perfect },
  ],
});
