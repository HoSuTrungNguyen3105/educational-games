// src/games/src/riddle.js — Đố Vui Nhanh (Kiến thức)
// Sinh tự động từ game4.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game4.html.

    const RIDDLES = [
      ['Con gì có cổ dài nhất?', ['Hươu cao cổ', 'Cổ voi', 'Rắn', 'Cò'], 'Hươu cao cổ', 'Cổ hươu cao cổ dài hơn cả chiếc xe!'],
      ['1 + 1 bằng mấy?', ['1', '2', '3', '11'], '2', 'Hai.'],
      ['Sông nào dài nhất thế giới?', ['Amazon', 'Sông Nile', 'Sông Đà', 'Sông Hồng'], 'Amazon', 'Amazon dài hơn Nile.'],
      ['Mặt trời mọc từ hướng nào?', ['Đông', 'Tây', 'Bắc', 'Nam'], 'Đông', 'Mặt trời mọc ở hướng Đông.'],
      ['Tháng nào có ít ngày nhất?', ['Tháng 2', 'Tháng 1', 'Tháng 4', 'Tháng 6'], 'Tháng 2', 'Tháng 2 thường có 28 ngày.'],
      ['Cành cây nào to nhất?', ['Rễ', 'Cành', 'Lá', 'Hạt'], 'Rễ', 'Rễ cây to bằng thân hoặc hơn.'],
      ['Vịt con kêu gì?', ['Vít', 'Bíp', 'Kẹt', 'Héc'], 'Vít', 'Tiếng vịt con là “vít”.'],
      ['Hành tinh nào gần Mặt Trời nhất?', ['Trái Đất', 'Sao Thiên Vương', 'Sao Thủy', 'Sao Sao'], 'Sao Thủy', 'Sao Thủy là hành tinh gần Mặt Trời nhất.'],
      ['Cá sống ở đâu?', ['Dưới nước', 'Trên cây', 'Trên trời', 'Trong đất'], 'Dưới nước', 'Cá sống dưới nước.'],
      ['Ba số 2 cộng 2 số 2 bằng mấy?', ['4', '6', '8', '22'], '8', '2+2+2+2 = 8.'],
      ['Hình vuông có mấy cạnh?', ['3', '4', '5', '6'], '4', 'Hình vuông có 4 cạnh.'],
      ['Bạn nào giỏ toán nhất?', ['Tim', 'Cẩn', 'Lan', 'Mỹ'], 'Mỹ', 'Chơi cùng “Mỹ” ở trường học Việt Nam.'],
    ];

MC_MAKERS.riddle = function riddle(level) {
        const [q, opts, ans, exp] = pickOne(RIDDLES);
        return {
          html: `<div style="font-size:11px;opacity:.7">ĐỐ VUI NHANH</div>
                 <div style="font-size:22px;margin-top:8px">${q}</div>`,
          opts: [...opts], ans, exp,
        };
      },
startMcGame('riddle', {
  name: 'Đố Vui Nhanh',
  icon: '💡',
  badges: [

  ],
});
