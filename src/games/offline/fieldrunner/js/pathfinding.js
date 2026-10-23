/* =====================================================
   pathfinding.js · tìm đường & kiểm tra đặt tháp
   ===================================================== */

/** BFS lan từ cổng ra, trả về mảng khoảng cách của từng ô */
function bfs(blk) {
  const d = new Array(COLS * ROWS).fill(Infinity);
  const q = [GOALC + GR * COLS];
  d[q[0]] = 0;

  for (let i = 0; i < q.length; i++) {
    const cur = q[i];
    const c = cur % COLS;
    const r = (cur / COLS) | 0;

    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nc = c + dc;
      const nr = r + dr;

      if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS || blk[nc][nr]) continue;

      const k = nc + nr * COLS;
      if (d[k] !== Infinity) continue;

      d[k] = d[cur] + 1;
      q.push(k);
    }
  }
  return d;
}

/** Lưu bản đồ khoảng cách và dựng lại đường đi để vẽ */
function setDist(d) {
  dist = d;
  pathPts = [[0, SR * CS + CS / 2]];

  let c = 0;
  let r = SR;
  let guard = 0;

  while (!(c === GOALC && r === GR) && guard++ < 400) {
    pathPts.push([c * CS + CS / 2, r * CS + CS / 2]);

    let best = null;
    let bd = dist[c + r * COLS];

    for (const [dc, dr] of [[1, 0], [0, 1], [0, -1], [-1, 0]]) {
      const nc = c + dc;
      const nr = r + dr;

      if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS) continue;

      const dd = dist[nc + nr * COLS];
      if (dd < bd) {
        bd = dd;
        best = [nc, nr];
      }
    }

    if (!best) break;
    [c, r] = best;
  }

  pathPts.push(
    [GOALC * CS + CS / 2, GR * CS + CS / 2],
    [CW, GR * CS + CS / 2]
  );
}

/** Kiểm tra có đặt được tháp ở ô (c,r) không. Trả về null nếu được, hoặc lý do. */
function canPlace(c, r) {
  if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return 'Ngoài bản đồ';
  if (blocked[c][r]) return 'Ô đã có tháp';
  if ((c === 0 && r === SR) || (c === GOALC && r === GR)) return 'Không thể xây ở cổng';

  blocked[c][r] = true;
  const d = bfs(blocked);

  let ok = d[0 + SR * COLS] !== Infinity;
  let why = 'Không được chặn kín đường đi';

  if (ok) {
    for (const e of enemies) {
      if (e.def.air) continue;

      const [ec, er] = cellOf(e.x, e.y);

      const onCell = ec === c && er === r;
      const headingThere = e.tx !== undefined && cellOf(e.tx, e.ty).join() === c + ',' + r;

      if (e.x >= 0 && (onCell || headingThere)) {
        ok = false;
        why = 'Có kẻ địch ở ô này';
        break;
      }

      if (e.x >= 0 && d[ec + er * COLS] === Infinity) {
        ok = false;
        why = 'Sẽ nhốt kẻ địch';
        break;
      }
    }
  }

  blocked[c][r] = false;
  return ok ? null : why;
}
