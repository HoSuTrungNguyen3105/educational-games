/* =====================================================
   waves.js · tạo đợt địch, bắt đầu đợt
   ===================================================== */

/** Kẻ địch không bao giờ trở thành tinh anh (đã đủ mạnh rồi) */
const NO_ELITE = ['boss', 'titan', 'dragon', 'golem', 'mini'];

/** Dựng danh sách kẻ địch của đợt n */
function makeWave(n) {
  const q = [];

  // Máu tăng theo đợt; từ đợt HARD_WAVE tăng thêm một nấc nữa
  const hpM = (1 + 0.17 * (n - 1) + 0.004 * n * n) * D.hp * lateHpMul(n);

  const add = (t, k, gap) => {
    k = Math.max(0, Math.floor(k));
    for (let i = 0; i < k; i++) {
      q.push({ t, hpM, gap, wave: n });
    }
  };

  /* ----- Kẻ địch quen thuộc ----- */
  add('grunt', Math.min(5 + n * 2, 38), 0.7);

  if (n >= 3) add('runner', Math.min(n * 1.3, 26), 0.45);
  if (n >= 5) add('tank', (n - 3) / 2, 1.4);
  if (n >= 4 && n % 3 === 1) add('plane', 3 + n / 3, 0.8);
  if (n >= 6) add('armored', (n - 4) / 2, 1.2);
  if (n >= 7 && n % 2 === 1) add('bat', 3 + n / 3, 0.35);
  if (n >= 8) add('shielded', (n - 6) / 2, 1.3);
  if (n >= 9) add('ninja', (n - 7) / 2.2, 0.8);
  if (n >= 10 && n % 4 === 2) add('bomber', 1 + n / 6, 1.2);
  if (n >= 11) add('healer', 1 + (n - 10) / 4, 2.0);
  if (n >= 12) add('knight', (n - 9) / 3, 1.5);
  if (n >= 13 && n % 3 === 1) add('splitter', 2 + (n - 12) / 3, 1.5);
  if (n >= 14) add('wizard', 1 + (n - 14) / 4, 1.8);
  if (n >= 15) add('berserk', (n - 13) / 2, 1.2);
  if (n >= 16) add('summoner', 1 + (n - 16) / 5, 2.2);
  if (n >= 18) add('ghost', 1 + (n - 17) / 3, 1.0);
  if (n >= 19 && n % 3 === 1) add('golem', 1 + (n - 19) / 6, 3);
  if (n >= 15 && n % 10 === 5) add('dragon', 1 + Math.floor(n / 20), 4);

  /* ----- MỚI: kẻ địch hạng nặng từ đợt 12 trở đi ----- */
  if (n >= 12) add('juggernaut', 1 + (n - 12) / 3, 2.6);
  if (n >= 15 && n % 2 === 0) add('phoenix', 1 + (n - 15) / 5, 1.6);
  if (n >= 17) add('warlock', 1 + (n - 17) / 4, 2.2);
  if (n >= 22) add('reaper', 1 + (n - 22) / 3, 0.9);

  /* ----- Trùm ----- */
  if (n % 10 === 0 && n !== TOTAL) {
    add('boss', 1 + (n >= 20 ? 1 : 0) + (n >= 30 ? 1 : 0), 3);
  }

  /* ----- Đợt cuối ----- */
  if (n === TOTAL) {
    add('titan', 1, 3);
    add('boss', 2, 3);
    add('dragon', 1, 4);
  }

  /* ----- Biến một phần thành tinh anh (từ đợt HARD_WAVE) ----- */
  const chance = eliteChance(n);
  if (chance > 0) {
    for (const s of q) {
      if (!NO_ELITE.includes(s.t) && Math.random() < chance) {
        s.elite = true;
      }
    }
  }

  /* ----- Xáo trộn nhẹ thứ tự xuất hiện ----- */
  for (let i = q.length - 1; i > 0; i--) {
    if (Math.random() < 0.4) {
      const j = Math.max(0, i - Math.floor(Math.random() * 6));
      [q[i], q[j]] = [q[j], q[i]];
    }
  }

  return q;
}

/** Bắt đầu đợt kế tiếp */
function startWave() {
  if (waveActive || over || wave >= TOTAL || !started) return;

  wave++;
  waveActive = true;
  spawnQ = makeWave(wave);
  spawnT = 0;
  waveSpawn = spawnQ.length;
  waveDone = 0;

  $('go').disabled = true;
  updUI();
  showPreview();

  if (wave === HARD_WAVE) {
    showMsg('⚠️ Tinh anh xuất hiện! Kẻ địch mạnh hơn hẳn!');
  } else {
    showMsg('🌊 Đợt ' + wave + ' bắt đầu!');
  }
}
