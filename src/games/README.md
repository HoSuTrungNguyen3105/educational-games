# src/games — Tra cứu nhanh

```
src/games/
├── _shared/      Framework dùng chung (KHÔNG phải game)
├── _tools/       Công cụ quản trị (KHÔNG chơi được)
├── offline/      35 game sinh tự động + bộ sinh (KHÔNG sửa tay)
├── <chủ đề>/     Game, mỗi game một thư mục riêng
```

## Quy tắc

1. **Mỗi game một thư mục riêng**, tên thư mục là `kebab-case` không dấu, file HTML `PascalCase.html`.
2. **Game mới** → tạo `<chủ đề>/<ten-game>/<TenGame>.html`, xong thêm một dòng vào bảng bên dưới.
3. **Game HTML tự chứa** (không dùng React) là dạng phổ biến nhất: 1 file `.html` duy nhất, giao tiếp với app qua `postMessage`.
4. Không đặt file `.html` trực tiếp ở gốc `src/games/`.

## Các thư mục đặc biệt

| Thư mục | Vai trò |
|---|---|
| `_shared/` | `HtmlGameLoader`, `GamePlayRouter`, `GameHud`, `config.js` (registry cấu hình game), các script `inject*.js`. Thêm game React thì import từ đây. |
| `_shared/lib/` | Dữ liệu SVG dùng chung cho game tạo avatar (dress-up). |
| `_tools/admin.html` | Trang quản trị game, mở trực tiếp bằng file://. |
| `_tools/samples/index.html` | Game mẫu tối giản nhất, dùng làm khuôn khi viết game mới. |
| `_tools/design/` | Bản dự Phaser (game "Bounce"), **đang dang dở** — import `../../utils/` bị gãy. |
| `offline/` | 35 game `.html` được **sinh tự động**. Đừng sửa tay — sửa ở `offline/games-src/` rồi chạy `npm run games:build`. |

## Bộ sinh game offline

| Thư mục | Nội dung |
|---|---|
| `offline/games-src/<id>.js` | Mã nguồn từng game (đây mới là nơi sửa). |
| `offline/lib/` | `shell.html` + `core.js`/`single.js`/`api.js`/`mcengine.js` dùng chung. |
| `offline/<id>.html` | **Kết quả sinh ra** — Vite tự quét bằng `import.meta.glob` trong `OfflineGamePage.jsx`. |

```bash
npm run games:build    # offline/lib + offline/games-src  ->  offline/*.html
npm run games:sync     # cập nhật manifest từ các file .html có sẵn
npm run games:test     # kiểm tra manifest khớp với file trên đĩa
```

> Thêm game offline: tạo `offline/games-src/<id>.js` theo khuôn `anagram.js`, thêm entry vào
> `offline/games-src/manifest.js`, rồi chạy `npm run games:build`.

## Danh mục game

| Chủ đề | Thư mục game | File | Tên hiển thị |
|---|---|---|---|
| 3d | — (file viết tay) | `vung-dat-gio.html` | Vùng Đất Gió |
| 3d | — (file viết tay) | `coi-phong-linh.html` | 🗡️ Cõi Phong Linh |
| 3d | `labyrinth/` | `Labyrinth.html` | 🌀 Labyrinth - Cực Khó |
| 3d | `pixel-party-catcher/` | `PixelPartyCatcher.html` | 🎂 Pixel Party Catcher |
| 3d | `pixel-platform-jump/` | `PixelPlatformJump.html` | 🎮 Pixel Platform Jump |
| 3d | `pixel-quest/` | `PixelQuest.html` | 🎮 Pixel Quest |
| 3d | `temple-run-2d/` | `TempleRun2D.html` | 🏃 Temple Run - Góc nhìn thứ nhất 2D |
| 3d | `xo/` | `XO.html` | XO - Bàn cờ vô hạn |
| adventure | `dem-hoi-trang-ram/` | `DemHoiTrangRam.html` | Đêm Hội Trăng Rằm |
| adventure | `ham-nguc-bi-an/` | `HamNgucBiAn.html` | Hầm Ngục Bí Ẩn |
| adventure | `number-ninja/` | `NumberNinja.html` | Number Ninja — Chém Số Bay |
| adventure | `phieu-luu-hoc-gioi/` | `PhieuLuuHocGioi.html` | Phiêu Lưu Học Giỏi |
| adventure | `quiz-battle/` | `QuizBattle.html` | Quiz Battle — Trả lời để chiến đấu |
| arcade | `block-master/` | `BlockMaster.html` | Block Master |
| arcade | `bong-vong/` | `BongVong.html` | Bóng Vọng |
| arcade | `co-ty-phu/` | `CoTyPhu.html` | Cờ Tỷ Phú - Game Engine |
| arcade | `duong-dua-oc-sen/` | `DuongDuaOcSen.html` | Đường Đua Ốc Sên |
| arcade | `duong-dua-sau/` | `DuongDuaSau.html` | Đường Đua Sâu |
| arcade | `lang-nho-battle-royale/` | `LangNhoBattleRoyale.html` | Làng Nhỏ: Sinh Tồn · Battle Royale |
| arcade | `tic-tac-toe/` | `TicTacToe.html` | Tic-Tac-Toe |
| arcade | `vuot-pho/` | `VuotPho.html` | Vượt Phố |
| coop | `math-coop/` | `MathCoop.html` | Giải Toán Cùng Nhau — Co-op Math |
| coop | `memory-team/` | `MemoryTeam.html` | Memory Team — Co-op Memorization |
| coop | `noi-tu-coop/` | `NoiTuCoop.html` | Nối Từ Co-op — Thách Thức Từ Vựng |
| coop | `quiz-coop/` | `QuizCoop.html` | Quiz Co-op — Trả Lời Cùng Nhau |
| dress-up | `tiem-thay-do-thu-cung/` | `TiemThayDoThuCung.html` | Tiệm thay đồ thú cưng |
| dress-up | `tiem-thoi-trang-cho-be/` | `TiemThoiTrangChoBe.html` | Tiệm thời trang cho Bé |
| farm | `dreamdale/` | `Dreamdale.html` | Dreamdale |
| farm | `nong-trai-hoc-tap/` | `NongTraiHocTap.html` | Nông Trại Học Tập |
| math | `find-number/` | `FindNumber.html` | Find The Number - 100 Màn |
| math | `hoc-ma-choi/` | `HocMaChoi.html` | Học Mà Chơi — Bản Bridge |
| math | `math-adventure/` | `MathAdventure.html` | Math Adventure – Phiêu lưu Toán học |
| math | `math-maze/` | `MathMaze.html` | EduPlay - Math Maze |
| math | `maths-racing/` | `MathsRacing.html` | Maths Racing – Đua Toán Học |
| math | `merge-blast/` | `MergeBlast.html` | Merge & Blast |
| math | `xep-khoi-mau/` | `XepKhoiMau.html` | Xếp Khối Màu |
| parkour | `parkour-tri-thuc/` | `ParkourTriThuc.html` | Parkour Tri Thức |
| parkour | `parkour-tri-thuc-3d/` | `ParkourTriThuc3D.html` | Parkour Tri Thức 3D |
| parkour | `parkour-tri-thuc-3d-a/` | `ParkourTriThuc3D-A.html` | Parkour Tri Thức 3D |
| parkour | `parkour-tri-thuc-3d-b/` | `ParkourTriThuc3D-B.html` | Parkour Tri Thức 3D |
| parkour | `phi-thuyen-tri-thuc/` | `PhiThuyenTriThuc.html` | Phi Thuyền Tri Thức |
| reflex | `be-chon-dung/` | `BeChonDung.html` | Bé Chọn Đúng — Game cực dễ cho bé |
| reflex | `bong-bay-vui/` | `BongBayVui.html` | Bóng Bay Vui — Game dễ chơi cho bé |
| reflex | `dap-chuot-nhanh-tay/` | `DapChuotNhanhTay.html` | Đập Chuột Nhanh Tay |
| reflex | `lap-the-tri-nho/` | `LapTheTriNho.html` | Lật Thẻ Trí Nhớ |
| reflex | `ninja-vuot-chuong-ngai/` | `NinjaVuotChuongNgai.html` | Ninja Vượt Chướng Ngại |
| reflex | `reflex-games/` | `ReflexGames.html` | ⚡ Reflex Games — Bộ sưu tập phản xạ |
| reflex | `vong-quay-may-man/` | `VongQuayMayMan.html` | Vòng Quay May Mắn |
| reflex | `word-runner/` | `WordRunner.html` | Word Runner — Temple Parkour |
| reflex | `word-rush/` | `WordRush.html` | Word Rush — Chạy đua từ vựng tiếng Anh |
| word | `lang-nho-cua-toi/` | `LangNhoCuaToi.html` | Làng Nhỏ Của Tôi · Phiên bản Hiện Đại |
| word | `lang-nho-cua-toi-fps/` | `LangNhoCuaToiFPS.html` | Làng Nhỏ Của Tôi · FPS Di Động |

### Lưu ý

- `parkour/parkour-tri-thuc-3d/`, `-3d-a/`, `-3d-b/` là **3 bản gần như trùng nhau** cùng tên
  "Parkour Tri Thức 3D", cùng bắt nguồn từ các file đặt tạm `oke.html`/`sdsd.html`/`parkour.html`.
  Nên gộp còn 1 và xoá 2 bản dư.
- `farm/nong-trai-hoc-tap/` đang hỏng: HTML trỏ `./public/farmgame/` không tồn tại.
