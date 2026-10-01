# Yêu cầu: Tích hợp 16 mini-game "Học Mà Chơi" vào hệ thống backend có sẵn

> Đưa nguyên file này cho AI (Claude, ChatGPT, Cursor...) kèm 3 file HTML game.
> Điền các mục `<<...>>` ở phần 1 trước khi giao.

---

## 0. Vai trò & cách làm việc

Bạn là kỹ sư full-stack. Nhiệm vụ: nối 16 mini-game giáo dục (3 file HTML, JavaScript thuần) vào **hệ thống backend đã có của tôi** để lưu tiến độ người chơi (XP, cấp độ, huy hiệu, kỷ lục, lịch sử ván chơi) và có bảng xếp hạng vào api đi , hiện đang có nhiều api liên quan đến games và template , hãy cấu hình lại để chuẩn cấu trúc để về sau dễ tối ưu cho tôi , tối ưu lại toàn bộ để api linh hoạt nhất có thể.

Quy tắc:
- Nếu thiếu thông tin ở phần 1, **hỏi tối đa 3 câu** rồi làm. Không đoán bừa tên bảng/cột.
- Thay đổi code game ở mức **nhỏ nhất có thể**. Không viết lại game, không đổi luật chơi, không đổi giao diện.
- Giao từng bước theo mục 8, mỗi bước chạy được độc lập.
- Mọi chữ hiển thị cho người dùng bằng **tiếng Việt**.

---

## 1. Thông tin hệ thống của tôi (điền trước khi giao)

| Mục | Giá trị |
|---|---|
| Base URL API | `<<https://api.example.com>>` |
| Cách xác thực | `<<Bearer JWT / Cookie session / API key>>` |
| Cách lấy token ở phía web | `<<biến toàn cục / localStorage / cookie httpOnly>>` |
| Ngôn ngữ & framework backend | `<<Node/Express, Laravel, Django, Spring...>>` |
| Cơ sở dữ liệu | `<<PostgreSQL, MySQL, MongoDB...>>` |
| Đã có bảng người dùng chưa? | `<<tên bảng + khóa chính>>` |
| Đối tượng người dùng | Học sinh, có thể dưới 16 tuổi |
| Web chạy trên domain | `<<https://hoc.example.com>>` (để cấu hình CORS) |

Nếu backend đã có sẵn endpoint tương tự, **ưu tiên dùng lại** và chỉ nói rõ phần cần thêm.

---

## 2. Hiện trạng code game (đọc kỹ trước khi sửa)

Ba file, mỗi file là một trang độc lập, JavaScript thuần, không framework, không build:

| File | Game (id dùng khi gọi API) |
|---|---|
| `hoc-ma-choi.html` | `math`, `memory`, `scramble`, `quiz`, `snake` |
| `hoc-ma-choi-pro.html` | `ship`, `word`, `cannon`, `race`, `sudoku` |
| `hoc-ma-choi-lab.html` | `flap`, `g2048`, `chem`, `clock`, `pattern`, `simon` |

Điểm quan trọng trong code:
- Trạng thái người chơi nằm trong một object toàn cục **chỉ ở bộ nhớ**, mất khi tải lại trang:
  ```js
  const S={xp:0,games:0,best:{},flags:{},played:new Set(),unlocked:new Set()};
  ```
- **Điểm tích hợp duy nhất:** hàm `finish({id,score,xp,lines,replay})` được gọi khi một ván kết thúc. Hàm này cộng XP, cập nhật kỷ lục, kiểm tra huy hiệu, hiện hộp kết quả. **Mọi lời gọi API gửi kết quả nên đặt trong hàm này.**
- Cấp độ tính ở client: `level = floor(xp / 120) + 1`.
- Huy hiệu được mở dựa trên `S.flags` (cờ do từng game đặt) và `S.games`, `S.played.size`, `lvl()`.
- Hàm `renderHub()` vẽ sảnh, `renderMe()` vẽ thanh XP/cấp. Cần gọi lại sau khi tải dữ liệu từ server.
- 3 file lặp lại cùng một khối tiện ích (`$`, `rnd`, `shuffle`, `S`, `sfx`, `T`, `finish`...). Nên **tách thành `game-core.js` dùng chung** (xem bước 1 mục 8).
- Trong môi trường demo, game không dùng `localStorage`. Khi chạy trên domain thật, được phép dùng (cho hàng đợi offline).

---

## 3. Bảng game: điểm hợp lệ & công thức XP

Server **phải tự tính XP** từ `score` (và `details` nếu cần), **không tin XP do client gửi**. Công thức dưới đây trùng với client để hai bên khớp nhau.

| id | Tên | Điểm tối đa hợp lệ (`maxScore`) | XP |
|---|---|---|---|
| `math` | Đua Toán | 2000 | `round(score/8) + (right>0 ? 5 : 0)` |
| `memory` | Lật Thẻ Anh–Việt | 300 | `round(score/5) + 10` |
| `scramble` | Xếp Chữ | 120 | `round(score/3) + solved` |
| `quiz` | Đố Vui Khoa Học | 300 | `round(score/4)` |
| `snake` | Rắn Săn Đáp Án | 1500 | `round(score/6)` |
| `ship` | Phi Thuyền Phá Thiên Thạch | 3000 | `round(score/6)` |
| `word` | Đoán Từ | 300 | `round(score/3) + solved*3` |
| `cannon` | Pháo Thủ Vật Lý | 250 | `round(score/3) + 5` |
| `race` | Đua Xe Gõ Chữ | 800 | `round(score/4)` |
| `sudoku` | Sudoku Mini 6×6 | 450 | `round(score/4) + 10` |
| `flap` | Chim Bay Qua Cổng | 3000 | `round(score/6)` |
| `g2048` | 2048 Lũy Thừa | 100000 | `min(80, round(score/25)) + round(log2(maxTile))*2` |
| `clock` | Đồng Hồ Thời Gian | 350 | `round(score/4)` |
| `pattern` | Thám Tử Quy Luật | 400 | `round(score/4)` |
| `simon` | Nhớ Dãy Màu | 5000 | `round(score/4) + rounds` |

Ghi chú: điểm tối đa là **trần chống gian lận** (nới thoáng hơn mức đạt được thực tế một chút), không phải điểm lý thuyết chính xác. Hãy để các hằng số này trong **một file cấu hình** (`games.config`) để chỉnh dễ.

Cấp độ: `level = floor(totalXp / 120) + 1`. Server trả về `level` luôn để client không phải tính.

### Trường `details` gợi ý cho từng game (tùy chọn nhưng nên gửi)

Dùng để kiểm tra chéo và thống kê. Client thu thập sẵn ở hầu hết game, chỉ cần truyền vào `finish`.

| id | `details` |
|---|---|
| `math` | `{ level, right, total, maxCombo }` |
| `memory` | `{ moves, secs }` |
| `scramble` | `{ solved }` |
| `quiz` | `{ right }` |
| `snake` | `{ correct, length }` |
| `ship` | `{ mode, solved, bestCombo }` |
| `word` | `{ solved }` |
| `cannon` | `{ planet, hits }` |
| `race` | `{ rank, wpm, accuracy }` |
| `sudoku` | `{ secs, mistakes, hints }` |
| `flap` | `{ gates, bestCombo }` |
| `g2048` | `{ maxTile }` |
| `clock` | `{ right }` |
| `pattern` | `{ right }` |
| `simon` | `{ rounds }` |

---

## 4. Huy hiệu (server là nguồn sự thật)

Server lưu danh sách huy hiệu đã mở của từng người. Client chỉ hiển thị và hiện thông báo khi server báo có huy hiệu mới.

| id | Tên | Điều kiện |
|---|---|---|
| `first` | Khởi động | Hoàn thành ≥ 1 ván |
| `all` | Thử đủ game | Đã chơi tất cả game của bộ đó (5/5, 5/5, 6/6) |
| `ace` | Xạ thủ 10 liên tiếp | `ship`: chuỗi đúng ≥ 10 |
| `wordle` | Đoán trong 3 lượt | `word`: đoán đúng trong ≤ 3 lượt |
| `sniper` | Bắn trúng phát đầu | `cannon`: trúng ngay phát đầu |
| `racer` | Về nhất đường đua | `race`: hạng 1 |
| `sudoku` | Sudoku không sai | `sudoku`: 0 lỗi, 0 gợi ý |
| `flap` | Chim bay 10 cổng | `flap`: qua ≥ 10 cổng đúng |
| `t256` | Đạt ô 256 | `g2048`: `maxTile ≥ 256` |
| `chem` | Nhà hóa học | `chem`: 8/8 chất, 0 lần sai |
| `clock` | Xem giờ 10/10 | `clock`: đúng 10/10 |
| `pat` | Thám tử quy luật | `pattern`: đúng 10/10 |
| `simon` | Nhớ 8 vòng | `simon`: `rounds ≥ 8` |
| `lv3` | Đạt cấp 3 | `level ≥ 3` |

Huy hiệu **đánh giá ở server** dựa trên `details` của ván vừa gửi + dữ liệu lịch sử. Không nhận cờ huy hiệu từ client.

---

## 5. Hợp đồng API cần có

Đường dẫn dưới đây là **gợi ý**, hãy điều chỉnh cho khớp quy ước backend của tôi. Mọi response dạng JSON, lỗi theo chuẩn HTTP + `{ "error": "mã_lỗi", "message": "..." }`.

### 5.1 Lấy hồ sơ khi mở web
`GET /api/me`
```json
{
  "name": "Minh An",
  "xp": 340,
  "level": 3,
  "gamesPlayed": 12,
  "played": ["math", "quiz", "snake"],
  "best": { "math": 420, "quiz": 210 },
  "badges": ["first", "lv3"]
}
```

### 5.2 Bắt đầu ván (chống gian lận)
`POST /api/sessions`  body `{ "game": "math" }`
```json
{ "sessionId": "b7c1...", "startedAt": "2026-10-01T08:00:00Z" }
```
Server lưu `sessionId`, `userId`, `game`, `startedAt`, trạng thái `open`.

### 5.3 Gửi kết quả khi kết thúc ván
`POST /api/results`
```json
{
  "sessionId": "b7c1...",
  "game": "math",
  "score": 380,
  "details": { "level": 1, "right": 31, "total": 34, "maxCombo": 14 }
}
```
Response:
```json
{
  "xpGained": 53,
  "totalXp": 393,
  "level": 4,
  "leveledUp": true,
  "isBest": true,
  "best": 380,
  "newBadges": [{ "id": "lv3", "name": "Đạt cấp 3", "icon": "⭐" }]
}
```
Yêu cầu: **idempotent** theo `sessionId` (gửi lại cùng session trả về cùng kết quả, không cộng XP hai lần).

### 5.4 Bảng xếp hạng
`GET /api/leaderboard/:game?scope=all|week&limit=20`
```json
[{ "rank": 1, "name": "Minh An", "best": 420 }]
```
Có thêm `GET /api/leaderboard/xp` (xếp theo tổng XP).

### 5.5 Lịch sử gần đây (tùy chọn)
`GET /api/results?limit=20`

---

## 6. Quy tắc phía server (bắt buộc)

1. **Xác thực mọi endpoint**. Người dùng chỉ ghi dữ liệu của chính mình.
2. **Kiểm tra đầu vào**: `game` thuộc danh sách; `score` là số nguyên, `0 ≤ score ≤ maxScore[game]`; `details` đúng kiểu.
3. **Tự tính XP** theo bảng mục 3, bỏ qua mọi trường `xp` client gửi lên.
4. **Chống gian lận theo thời gian**: so `now - startedAt` với thời lượng tối thiểu hợp lý của từng game (ví dụ `math` ≥ 20 giây nếu `score` > 100; `race` ≥ 10 giây; `sudoku` ≥ 15 giây). Vi phạm thì từ chối hoặc đánh dấu `suspicious` và không đưa lên bảng xếp hạng.
5. **Mỗi `sessionId` chỉ dùng một lần**, và phải thuộc đúng user + đúng game.
6. **Giới hạn tần suất**: ví dụ tối đa 60 ván/giờ/user.
7. **Giao dịch (transaction)** khi ghi kết quả + cộng XP + mở huy hiệu để không lệch số.
8. **CORS** chỉ cho phép domain web của tôi.
9. Ghi log các ván bị từ chối để rà soát.

---

## 7. Yêu cầu phía client (sửa tối thiểu)

1. **Tách `game-core.js`** chứa phần dùng chung: tiện ích, `sfx`, `T`, `S`, `BADGES`, `finish`, `renderHub`... Ba trang HTML chỉ còn khai báo `GAMES` và hàm game của mình.
2. Thêm module `api.js`:
   - `loadProfile()` → gọi `/api/me`, nạp vào `S` (xp, best, played, badges) rồi gọi `renderMe()` + `renderHub()`.
   - `startSession(game)` → gọi khi `openGame(id)`; lưu `sessionId` hiện tại.
   - `submitResult({game,score,details})` → gọi trong `finish()`.
3. Sửa `finish()`:
   - Vẫn hiện hộp kết quả ngay (không chờ mạng) bằng số liệu tạm tính ở client.
   - Khi server trả về, **cập nhật lại** XP/cấp/huy hiệu theo số liệu server và hiện toast huy hiệu mới.
   - Truyền thêm `details` từ từng game (mục 3). Hiện tại nhiều game đã có sẵn biến tương ứng, chỉ cần đưa vào lời gọi `finish`.
4. **Hàng đợi offline**: nếu gửi lỗi mạng, lưu kết quả vào `localStorage` (khóa `pendingResults`), thử gửi lại khi có mạng / lần mở web sau. Nếu `sessionId` đã hết hạn, gửi dưới dạng "không xếp hạng".
5. **Màn hình bảng xếp hạng**: thêm nút 🏆 ở sảnh, hiện top 20 theo từng game và theo tổng XP. Đặt đúng phong cách giao diện hiện có (dùng biến CSS sẵn).
6. Trạng thái tải/lỗi rõ ràng bằng tiếng Việt: "Đang tải hồ sơ...", "Không kết nối được, kết quả sẽ được gửi lại sau".
7. Không để lộ token trong URL hay log.

---

## 8. Thứ tự thực hiện (giao từng bước, chạy được ở mỗi bước)

1. **Tái cấu trúc**: tách `game-core.js`, ba trang vẫn chạy y như cũ.
2. **Backend**: tạo bảng/migration (`game_results`, `game_sessions`, cột/bảng `user_progress`, `user_badges`) + file `games.config` với bảng mục 3.
3. **Backend**: các endpoint 5.1–5.3 kèm kiểm tra mục 6 và test.
4. **Client**: `api.js`, nối `loadProfile`, `startSession`, `submitResult` vào `finish()`.
5. **Backend + client**: bảng xếp hạng (5.4) và màn hình hiển thị.
6. **Hàng đợi offline** và xử lý lỗi.
7. Rà soát bảo mật, quyền riêng tư (mục 9), viết tài liệu ngắn.

Sau mỗi bước, tóm tắt: đã đổi file nào, cách chạy thử, điều gì chưa làm.

---

## 9. Quyền riêng tư (học sinh)

- Chỉ lưu **dữ liệu tối thiểu**: mã người dùng, biệt danh hiển thị, XP, điểm, huy hiệu, thời gian.
- Bảng xếp hạng chỉ hiện **biệt danh**, không hiện họ tên thật, email, lớp, trường.
- Cho phép người dùng/phụ huynh yêu cầu **xóa dữ liệu**; viết sẵn endpoint hoặc script xóa.
- Không đưa công cụ theo dõi, quảng cáo của bên thứ ba vào trang game.
- Nếu triển khai tại Việt Nam, tham khảo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân và cân nhắc cơ chế đồng ý của phụ huynh cho người dưới 16 tuổi.

---

## 10. Tiêu chí nghiệm thu

- [ ] Mở web: XP, cấp, kỷ lục, huy hiệu của người chơi hiện đúng theo dữ liệu server.
- [ ] Chơi xong một ván bất kỳ trong 16 game: dữ liệu được lưu, tải lại trang vẫn còn.
- [ ] Gửi lại cùng `sessionId` hai lần: XP chỉ cộng một lần.
- [ ] Gửi `score` vượt trần hoặc `xp` giả: server từ chối / bỏ qua, XP không đổi.
- [ ] Gửi kết quả quá nhanh (vi phạm thời lượng tối thiểu): không lên bảng xếp hạng.
- [ ] Tắt mạng, chơi một ván, bật lại mạng: kết quả được gửi bù, không mất, không trùng.
- [ ] Huy hiệu mới hiện toast đúng một lần, sau đó hiện ở danh sách huy hiệu.
- [ ] Bảng xếp hạng từng game và tổng XP hiển thị đúng, chỉ có biệt danh.
- [ ] Giao diện, luật chơi, âm thanh của 16 game không thay đổi so với bản gốc.
- [ ] Có test cho: kiểm tra đầu vào, tính XP từng game, idempotency, mở huy hiệu.

---

## 11. Đầu ra mong muốn

- Code backend (migration, endpoint, test) theo đúng framework tôi dùng.
- 3 file HTML đã sửa + `game-core.js` + `api.js`.
- Một file `README` ngắn: cách cấu hình `BASE_URL`, token, CORS, cách thêm game mới (thêm vào `games.config` + `GAMES` + `BADGES`).