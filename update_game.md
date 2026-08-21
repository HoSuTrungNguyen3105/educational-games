# PLAY_TO_WIN_GAMES.md

# Yêu cầu phát triển các game Play-to-Win

Tôi muốn phát triển thêm các game **giải trí / Play-to-Win** vào project game hiện tại.

Các game này **không phải game bài học**.

Mục tiêu chính:

- Chơi giải trí.
- Có gameplay thực sự.
- Có điểm số.
- Có thắng/thua hoặc game over tùy loại game.
- Có thể chơi lại.
- Có combo nếu phù hợp.
- Có difficulty nếu phù hợp.
- Có animation và feedback rõ ràng.
- Giao diện đẹp, vui nhộn.
- Hoạt động tốt trên desktop và mobile.
- Không phá vỡ các game và chức năng hiện tại.
1. Block Master - Super Puzzle
Mô tả

Game xếp block dạng puzzle.

Người chơi được cung cấp các block có hình dạng khác nhau và phải đặt chúng vào một bảng.

Mục tiêu là:

Đặt block
↓
Lấp đầy hàng/cột
↓
Xóa hàng/cột
↓
Nhận điểm
↓
Tạo combo
↓
Tiếp tục chơi

Game phải tạo cảm giác giống một puzzle arcade giải trí, dễ hiểu nhưng càng chơi càng khó.

Gameplay

Tạo một grid:

8 x 8

hoặc:

10 x 10

Ở phía dưới có 3 block để người chơi lựa chọn.

Ví dụ:

┌────────────────────────────┐
│                            │
│       GAME BOARD           │
│                            │
│                            │
│                            │
└────────────────────────────┘


   ┌───┐    ┌───┐    ┌───┐
   │ ■ │    │ ■■│    │ ■ │
   │ ■ │    │ ■ │    │■■■│
   │■■■│         │    │ ■ │
   └───┘    └───┘    └───┘

Người chơi có thể:

Drag & Drop block.
Click chọn block rồi click vào vị trí.
Touch drag trên mobile.
Block Shapes

Tạo nhiều hình dạng:

■


■■


■■■


■■■■


■
■
■


■■
■■


■
■■
 ■


■■■
 ■


■
■■
■

Không cần quá nhiều loại block ở level đầu.

Difficulty tăng dần bằng cách đưa vào các block phức tạp hơn.

Clear Line

Khi một hàng hoặc cột được lấp đầy:

████████

thì hàng đó biến mất.

Ví dụ:

████████

↓

........

Người chơi nhận điểm.

Nếu cùng lúc xóa nhiều line:

2 Lines
3 Lines
4 Lines

thì được bonus.

Combo

Nếu người chơi liên tục xóa line:

Combo x2
Combo x3
Combo x4

Score tăng theo combo.

Có animation:

+100
COMBO x3
Game Over

Game Over khi không còn vị trí hợp lệ để đặt bất kỳ block nào.

Hiển thị:

GAME OVER


Score: 2450
Best: 5820


[ CHƠI LẠI ]
[ VỀ TRANG GAME ]
Tính năng
Score.
Best Score.
Combo.
Restart.
Pause.
Game Over.
Sound.
Animation.
Drag & Drop.
Touch support.
Responsive.

Lưu Best Score bằng localStorage nếu project chưa có hệ thống score chung.

2. Find The Number
Mô tả

Game reaction / observation.

Người chơi phải tìm một con số được yêu cầu trong một bảng chứa rất nhiều số.

Ví dụ:

TÌM SỐ 27


┌────┬────┬────┬────┬────┐
│ 12 │  8 │ 31 │ 19 │  4 │
├────┼────┼────┼────┼────┤
│ 22 │ 15 │ 27 │  9 │ 33 │
├────┼────┼────┼────┼────┤
│  6  │ 18 │ 42 │ 11 │ 25 │
└────┴────┴────┴────┴────┘

Người chơi phải click:

27

càng nhanh càng tốt.

Gameplay

Mỗi round:

Generate numbers
↓
Chọn target
↓
Hiển thị target
↓
Player click số
↓
Kiểm tra
↓
Đúng → score + combo
↓
Round mới

Không được để gameplay quá chậm.

Mỗi round phải chuyển sang round mới gần như ngay lập tức.

Correct

Nếu chọn đúng:

✓ CORRECT
+100

Sau đó tạo round mới.

Có thể tăng combo:

Combo x2
Combo x3
Combo x4
Wrong

Nếu chọn sai:

✕ WRONG

Có thể:

Trừ điểm.
Reset combo.
Trừ thời gian.

Không nên làm penalty quá nặng.

Timer

Có timer:

30

Khi timer về 0:

GAME OVER

Có thể cộng thêm vài giây khi người chơi trả lời đúng.

Ví dụ:

Correct
+2 seconds
Difficulty
Easy
Ít số.
Grid nhỏ.
Số lớn.
Timer dài.
Normal
Grid lớn hơn.
Nhiều số.
Timer trung bình.
Hard
Grid lớn.
Rất nhiều số.
Số gần giống nhau.
Timer ngắn.
Target khó tìm hơn.
Score

Ví dụ:

Correct: +100
Fast answer: +bonus
Combo: multiplier

Hiển thị:

Score: 1250
Best: 4820
Combo: x4
Time: 18
Tính năng
Timer.
Score.
Best Score.
Combo.
Difficulty.
Restart.
Pause.
Game Over.
Sound.
Correct/wrong animation.
Responsive.
3. Merge and Blast
Mô tả

Game puzzle giải trí kết hợp:

Merge
+
Blast
+
Combo
+
Score

Game này không được biến thành 2048.

Project đã có 2048 nên gameplay của Merge and Blast phải khác rõ ràng.

Không sử dụng cơ chế:

Swipe toàn board

giống 2048.

Không copy logic 2048.

Gameplay

Tạo một grid chứa các ô có giá trị.

Ví dụ:

┌────┬────┬────┬────┐
│  2 │  4 │  4 │  8 │
├────┼────┼────┼────┤
│  4 │  4 │  8 │  8 │
├────┼────┼────┼────┤
│  8 │ 16 │  8 │  4 │
├────┼────┼────┼────┤
│  4 │  8 │  4 │  4 │
└────┴────┴────┴────┘

Người chơi click vào một nhóm ô phù hợp.

Group

Các ô giống nhau nằm cạnh nhau có thể tạo thành group.

Ví dụ:

16 16
16

Player click group.

Group sẽ:

Blast
↓
Xóa
↓
Merge/Create new tile
↓
Score
Merge

Ví dụ:

16 + 16 = 32

hoặc nếu game logic sử dụng group:

16 + 16 + 16

có thể tạo giá trị mới tùy thiết kế.

Điểm quan trọng là gameplay phải tập trung vào:

Chọn group
↓
Blast
↓
Merge

thay vì gameplay 2048.

Combo

Nếu người chơi tạo được nhiều chain:

Blast
↓
Merge
↓
New group
↓
Blast

thì tạo:

COMBO x2
COMBO x3
COMBO x4

Có bonus score.

Power-up

Có thể thêm:

💣 Bomb
↔ Horizontal Blast
↕ Vertical Blast
🔀 Shuffle
❄ Freeze

Ví dụ:

Bomb

Xóa một vùng nhỏ.

Horizontal Blast

Xóa một hàng.

Vertical Blast

Xóa một cột.

Shuffle

Xáo trộn board.

Game Over

Game Over khi:

Không còn group hợp lệ

hoặc board đạt giới hạn tùy thiết kế.

Hiển thị:

GAME OVER


Score: 4200
Best: 8900


[ CHƠI LẠI ]
Tính năng
Score.
Best Score.
Combo.
Power-up.
Restart.
Pause.
Game Over.
Sound.
Particle/animation.
Responsive.
Touch support.
4. Tic-Tac-Toe
Mô tả

Game X/O 3x3.

Mục tiêu là tạo được 3 quân liên tiếp.

Có 2 chế độ chính:

Player vs AI
Player vs Player

Nếu hệ thống multiplayer hiện tại hỗ trợ tốt thì có thể mở rộng Online PvP sau.

Không cần triển khai Online PvP nếu backend chưa sẵn sàng.

Player vs Player

Hai người chơi trên cùng thiết bị.

Player X
Player O

Hiển thị lượt:

Lượt của X

Player click ô.

Sau đó:

Lượt của O
Player vs AI

Có difficulty:

Easy
Medium
Hard
Easy

AI chọn nước đi ngẫu nhiên.

Medium

AI:

Ưu tiên nước thắng.
Chặn nước thắng của player.
Ưu tiên center.
Ưu tiên corner.
Hard

Có thể sử dụng Minimax.

Mục tiêu là AI chơi tốt và gần như không mắc sai lầm.

Win Condition

Ví dụ:

X X X

hoặc:

X
X
X

hoặc diagonal:

X
  X
    X

→ X thắng.

Tương tự với O.

Draw

Nếu board đầy:

X O X
X O O
O X X

và không có winner:

DRAW
Score / Stats

Có thể lưu:

Wins
Losses
Draws

Ví dụ:

Player


Wins: 12
Losses: 5
Draws: 3

Nếu chơi AI.

Tính năng
Player vs AI.
Player vs Player.
AI difficulty.
Win animation.
Draw animation.
Restart.
New Game.
Score/Stats.
Sound.
Responsive.
5. Maths Racing
Mô tả

Game racing / endless runner.

Đây là game giải trí, không phải game học tập.

Math chỉ được sử dụng như một mechanic trong gameplay.

Không biến game thành:

Question
↓
Answer
↓
Question
↓
Answer

như một quiz thông thường.

Cảm giác chính phải là:

🏃 Racing
+
⚡ Speed
+
🧱 Obstacles
+
💰 Coins
+
🎯 Reaction
+
🧮 Math Challenge
Gameplay

Nhân vật tự động chạy.

Người chơi điều khiển:

Left.
Right.
Jump.
Dodge.

Có thể dùng:

Keyboard

trên desktop.

Mobile:

Touch controls
Màn hình

Ví dụ:

┌─────────────────────────────────┐
│ Score: 1200       Speed: 8      │
│ Coins: 15         Level: 3      │
│                                 │
│             🏃                  │
│                  ███            │
│                         █       │
│       █                         │
│                                 │
└─────────────────────────────────┘
Obstacles

Có nhiều loại:

Box
Wall
Hole
Barrier
Moving Platform
Trap

Người chơi phải né.

Nếu va chạm:

Lose HP

hoặc:

Slow down

Không nhất thiết Game Over ngay lập tức.

Coins

Trong đường chạy có coin:

🪙

Thu thập coin:

+10

Coin có thể dùng cho:

Score.
Combo.
Power-up.

Nếu project sau này có shop thì có thể mở rộng.

Math Challenge

Trong lúc chạy thỉnh thoảng xuất hiện một challenge.

Ví dụ:

2 + 3 = ?


[ 4 ] [ 5 ] [ 6 ]

Hoặc:

6 × 4 = ?


[ 20 ] [ 24 ] [ 28 ]

Người chơi chọn nhanh đáp án.

Correct

Nếu đúng:

✓
+ Score
+ Combo
+ Speed

Có thể tạo:

SPEED BOOST

hoặc:

x2 SCORE
Wrong

Nếu sai:

✕
Combo reset
Speed giảm

Không nên làm game dừng hoàn toàn.

Nhân vật vẫn nên tiếp tục chạy để giữ cảm giác racing.

Power-ups

Có thể thêm:

⚡ Speed Boost
🛡 Shield
🧲 Coin Magnet
×2 Score
🐢 Slow Motion
Speed Boost

Tăng tốc trong vài giây.

Shield

Cho phép va chạm một lần mà không mất HP.

Coin Magnet

Tự hút coin gần player.

Double Score

Nhân đôi score trong thời gian ngắn.

Slow Motion

Giảm tốc obstacle.

Level

Level tăng dần:

Level 1
↓
Level 2
↓
Level 3
↓
Level 4
...

Mỗi level:

Speed ↑
Obstacle ↑
Obstacle frequency ↑
Math challenge frequency ↑
Game Over

Game Over khi:

HP = 0

hoặc player gặp điều kiện thất bại của level.

Hiển thị:

GAME OVER


Score: 4200
Coins: 85
Best: 9500


Distance: 1280m


[ CHƠI LẠI ]
[ VỀ TRANG GAME ]
Tính năng
Endless racing.
Character movement.
Obstacles.
Collision.
Coins.
Math challenges.
Power-ups.
Level.
Speed.
Score.
Best Score.
Combo.
Game Over.
Restart.
Pause.
Sound.
Animation.
Responsive.
Keyboard.
Touch.
Hệ thống UI dùng chung

Các game nên sử dụng UI thống nhất với project hiện tại.

Không tạo một design system mới nếu project đã có sẵn.

Start Screen

Mỗi game có:

Tên game


Mô tả ngắn


[ CHƠI NGAY ]


[ HƯỚNG DẪN ]


[ QUAY LẠI ]
Pause Screen

Trong lúc chơi:

⏸

Click:

PAUSED


[ TIẾP TỤC ]
[ CHƠI LẠI ]
[ THOÁT ]
Game Over Screen
GAME OVER


Score: 1250
Best: 3400


[ CHƠI LẠI ]
[ VỀ TRANG GAME ]
Score

Game nào có score thì sử dụng:

score
bestScore
combo

Best Score có thể lưu:

localStorage

nếu backend chưa có leaderboard.

Sound

Nếu project đã có sound system thì tận dụng.

Không tạo audio system thứ hai.

Các event:

click
correct
wrong
merge
blast
combo
coin
jump
powerup
win
game-over

Có thể có:

Sound On / Off
Animation

Tạo animation vừa phải:

Button hover
Block placement
Line clear
Score popup
Combo
Merge
Blast
Correct
Wrong
Coin
Jump
Power-up
Game Over

Không sử dụng animation quá nặng gây lag.

Responsive

Tất cả game phải chạy tốt trên:

Desktop
Laptop
Tablet
Mobile

Desktop:

Mouse
Keyboard

Mobile:

Touch
Tap
Swipe nếu cần

Không để horizontal overflow.

Kiến trúc code

Không viết tất cả game vào một component.

Nếu project hiện tại chưa có cấu trúc game riêng, có thể tổ chức:

src/
└── games/
    │
    ├── block-master/
    │   ├── BlockMaster.jsx
    │   ├── blockMaster.logic.js
    │   └── blockMaster.constants.js
    │
    ├── find-number/
    │   ├── FindNumber.jsx
    │   └── findNumber.logic.js
    │
    ├── merge-blast/
    │   ├── MergeBlast.jsx
    │   └── mergeBlast.logic.js
    │
    ├── tic-tac-toe/
    │   ├── TicTacToe.jsx
    │   └── ticTacToe.logic.js
    │
    └── maths-racing/
        ├── MathsRacing.jsx
        └── mathsRacing.logic.js

Tuy nhiên:

Trước tiên phải kiểm tra cấu trúc project hiện tại.

Nếu đã có:

games/
game registry
game service
game loader

thì sử dụng lại.

Không tạo hệ thống thứ hai.

Game Type

Tất cả 5 game này phải có:

type: "play-to-win"

Ví dụ:

{
  id: "block-master",
  name: "Block Master - Super Puzzle",
  type: "play-to-win"
}
{
  id: "find-number",
  name: "Find The Number",
  type: "play-to-win"
}
{
  id: "merge-blast",
  name: "Merge and Blast",
  type: "play-to-win"
}
{
  id: "tic-tac-toe",
  name: "Tic-Tac-Toe",
  type: "play-to-win"
}
{
  id: "maths-racing",
  name: "Maths Racing",
  type: "play-to-win"
}
Tích hợp vào project

Flow hiện tại:

Home
 ↓
Game Card
 ↓
Select Game
 ↓
/play/:gameId
 ↓
StudentApp
 ↓
Game Loader
 ↓
Game Component

Phải tận dụng flow hiện tại.

Không tạo router riêng.

Không tạo hệ thống login riêng.

Không tạo game launcher riêng.

Trước khi code

AI phải kiểm tra:

App.jsx
StudentApp
Game registry
gameService
Router
Game loader
Các game hiện tại
UI components
Sound system
Score system

Sau đó mới bắt đầu implement.

Không phá chức năng hiện tại

Không được tự ý xóa hoặc sửa:

Login
Register
Chat
Profile
Find Friends
Teacher/Admin
Student
Game hiện tại
2048 hiện tại
Socket
Router

trừ khi thực sự cần thiết để tích hợp.

Nếu cần thay đổi kiến trúc:

Giữ backward compatibility.
Không phá API hiện tại.
Không duplicate listener.
Không tạo memory leak.
Không làm Mockup

Đây là yêu cầu rất quan trọng.

Không được chỉ tạo giao diện:

Card
Button
Image
Title

mà không có gameplay.

Mỗi game phải có logic thực sự.

Ví dụ:

State
Input
Gameplay
Score
Timer nếu cần
Win/Lose
Restart
Difficulty nếu cần
Thứ tự triển khai

Làm theo thứ tự:

Phase 1
1. Block Master
2. Find The Number
3. Merge and Blast
Phase 2
4. Tic-Tac-Toe
Phase 3
5. Maths Racing

Maths Racing phức tạp nhất nên làm sau.

Kiểm tra sau mỗi game

Sau khi hoàn thành từng game:

✓ Route hoạt động
✓ Game chơi được
✓ Gameplay hoạt động
✓ Restart hoạt động
✓ Pause hoạt động nếu có
✓ Score hoạt động
✓ Game Over hoạt động
✓ Responsive
✓ Không duplicate event listener
✓ Không memory leak
✓ Không phá game cũ
Final Requirements

Hãy triển khai đúng 5 game:

🎮 PLAY-TO-WIN


1. Block Master - Super Puzzle
2. Find The Number
3. Merge and Blast
4. Tic-Tac-Toe
5. Maths Racing

Không triển khai:

❌ Sudoku
❌ Cờ Tướng
❌ Number Match
❌ 2048 mới

Project đã có 2048 nên phải giữ nguyên 2048 hiện tại và không tạo bản duplicate.

Tất cả 5 game mới đều phải:

type = "play-to-win"

Mục tiêu là tạo một nhóm game giải trí thực sự, có gameplay hoàn chỉnh, vui, mượt, responsive và có thể mở rộng sau này sang:

Leaderboard
Ranking
Achievement
PvP
Online Multiplayer
Matchmaking
Tournament

nhưng không cần triển khai các hệ thống trên nếu backend hiện tại chưa hỗ trợ.