# Canvas Refactor – Mobile Responsive & Area Game UI

## 1. Mục tiêu bổ sung

Tập trung xử lý **responsive mobile** cho Canvas và đặc biệt là phần **hiển thị trò chơi trong mục Area**.

Hiện tại mobile UI chưa được tối ưu, trong đó khu vực Area đang có vấn đề về:

* Kích thước game không phù hợp với màn hình mobile.
* Layout chưa tự co giãn theo viewport.
* Game có thể bị tràn ngang hoặc bị cắt nội dung.
* Khoảng cách giữa các element chưa phù hợp với mobile.
* Header / toolbar / action của Area chiếm quá nhiều diện tích.
* Canvas game chưa có cơ chế fit theo kích thước màn hình.
* Khi thay đổi orientation hoặc resize màn hình, game chưa cập nhật layout ổn định.
* Trải nghiệm scroll / touch trên mobile chưa tốt.

---

# 2. Mobile Responsive Requirements

Canvas cần support tối thiểu:

```text
Mobile Portrait
Mobile Landscape
Tablet Portrait
Tablet Landscape
Desktop
```

Không được thiết kế mobile bằng cách chỉ scale toàn bộ desktop UI xuống.

Cần có responsive layout riêng cho mobile.

---

# 3. Area Game UI

Phần **Area** cần được ưu tiên refactor vì đây là khu vực đang hiển thị game.

Layout mobile đề xuất:

```text
┌──────────────────────────┐
│ Area Header              │
├──────────────────────────┤
│                          │
│                          │
│       GAME AREA          │
│                          │
│                          │
├──────────────────────────┤
│ Game Actions             │
└──────────────────────────┘
```

Game phải sử dụng phần diện tích khả dụng tối đa nhưng vẫn đảm bảo:

* Không overflow ngang.
* Không bị crop ngoài ý muốn.
* Không phá vỡ aspect ratio.
* Không che UI quan trọng.
* Không gây horizontal scroll cho toàn page.

---

# 4. Game Sizing

Không hard-code kích thước game theo desktop.

Không nên:

```css
.game {
  width: 1200px;
  height: 700px;
}
```

Nên sử dụng responsive sizing:

```css
.game {
  width: 100%;
  max-width: 100%;
}
```

Nếu game có aspect ratio cố định:

```css
.game-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
}
```

Game renderer phải tự calculate kích thước dựa trên container thực tế.

---

# 5. Canvas / Game Scaling

Cần phân biệt:

```text
CSS Size
```

và

```text
Internal Rendering Resolution
```

Ví dụ:

```text
Mobile container
     ↓
320 × 180 CSS pixels
     ↓
Canvas internal resolution
     ↓
640 × 360 / DPR-aware
```

Canvas cần hỗ trợ device pixel ratio để tránh hình ảnh bị blur trên màn hình mobile.

Ví dụ:

```ts
const dpr = window.devicePixelRatio || 1;

canvas.width = width * dpr;
canvas.height = height * dpr;

canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
```

Rendering context cần scale theo DPR tương ứng.

---

# 6. Resize Handling

Khi mobile thay đổi:

* Orientation.
* Browser toolbar.
* Viewport height.
* Split screen.
* Resize window.

Game phải recalculate lại kích thước.

Nên ưu tiên:

```ts
ResizeObserver
```

thay vì chỉ dựa vào:

```ts
window.resize
```

Flow:

```text
Container Resize
      ↓
ResizeObserver
      ↓
Calculate Game Size
      ↓
Update Canvas
      ↓
Re-render
```

---

# 7. Mobile Height

Không nên phụ thuộc hoàn toàn vào:

```css
height: 100vh;
```

Trên mobile browser, `100vh` có thể gây sai lệch do browser UI.

Ưu tiên sử dụng viewport units phù hợp:

```css
min-height: 100dvh;
```

hoặc:

```css
height: 100dvh;
```

tùy layout.

Cần đảm bảo Area không bị che bởi browser UI.

---

# 8. Safe Area

Đối với mobile có notch / dynamic island, cần support:

```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

Đặc biệt với:

* Fixed toolbar.
* Bottom action bar.
* Fullscreen game.
* Bottom sheet.

---

# 9. Mobile Area Layout

Desktop:

```text
┌─────────────┬────────────────────────┬─────────────┐
│ Sidebar     │        Game Area       │ Properties  │
│             │                        │             │
└─────────────┴────────────────────────┴─────────────┘
```

Mobile:

```text
┌───────────────────────────────┐
│ Header                        │
├───────────────────────────────┤
│                               │
│          GAME AREA            │
│                               │
├───────────────────────────────┤
│ Actions                       │
└───────────────────────────────┘
```

Các sidebar desktop không nên tiếp tục chiếm width trên mobile.

Chuyển thành:

```text
Drawer
Bottom Sheet
Overlay
Floating Panel
```

---

# 10. Mobile Toolbar

Toolbar desktop có thể có nhiều action:

```text
Undo
Redo
Zoom
Grid
Settings
Share
Export
...
```

Không nên hiển thị toàn bộ trên mobile.

Ưu tiên:

```text
Primary Actions
```

và gom action phụ vào:

```text
More
```

Ví dụ:

```text
┌───────────────────────────────┐
│ ← Area     Undo  Redo    ⋮   │
└───────────────────────────────┘
```

---

# 11. Touch Interaction

Canvas Area phải ưu tiên touch interaction.

Cần support:

```text
Tap
Double Tap
Long Press
Drag
Pinch Zoom
Two-finger Pan
```

Không nên phụ thuộc hoàn toàn vào:

```text
mouseenter
mouseleave
hover
right-click
```

Mobile không có hover interaction như desktop.

---

# 12. Pointer Events

Nên chuẩn hóa interaction bằng:

```ts
Pointer Events
```

thay vì duy trì logic riêng:

```ts
mousedown
mousemove
mouseup

touchstart
touchmove
touchend
```

Ví dụ:

```ts
onPointerDown
onPointerMove
onPointerUp
```

Điều này giúp dùng chung logic cho:

```text
Mouse
Touch
Pen
```

---

# 13. Pinch Zoom

Nếu Area Game hỗ trợ zoom, mobile cần hỗ trợ pinch gesture.

Flow:

```text
Touch 1
   +
Touch 2
   ↓
Distance Changed
   ↓
Calculate Scale
   ↓
Update Viewport Zoom
```

Không được để browser page zoom xảy ra thay vì Canvas zoom nếu product yêu cầu custom zoom.

---

# 14. Page Scroll vs Canvas Interaction

Cần tránh conflict giữa:

```text
Page Scroll
```

và:

```text
Canvas Pan
```

Ví dụ:

```text
Single finger
→ page scroll

Two fingers
→ canvas pan
```

hoặc behavior cụ thể theo UX của sản phẩm.

Không được disable toàn bộ page scrolling bằng:

```css
touch-action: none;
```

trên toàn bộ page nếu không thực sự cần.

Chỉ áp dụng trên vùng interaction cần thiết.

---

# 15. Area Overflow

Đây là điểm cần xử lý kỹ.

Không để:

```css
width: 100vw;
```

kết hợp với padding / sidebar làm overflow.

Cần kiểm tra:

```text
width
min-width
max-width
padding
margin
gap
position
transform
```

đặc biệt với nested flex/grid.

Ưu tiên:

```css
min-width: 0;
```

cho flex/grid child cần shrink.

---

# 16. Game Container

Nên có structure rõ ràng:

```tsx
<Area>
  <AreaHeader />

  <GameViewport>
    <GameContainer>
      <GameCanvas />
    </GameContainer>
  </GameViewport>

  <AreaActions />
</Area>
```

Trong đó:

### `Area`

Quản lý layout.

### `GameViewport`

Quản lý:

* Available space.
* Overflow.
* Pan / zoom boundary.

### `GameContainer`

Quản lý kích thước thực tế của game.

### `GameCanvas`

Chỉ chịu trách nhiệm render game.

---

# 17. Responsive Breakpoints

Không nên dựa hoàn toàn vào một breakpoint duy nhất.

Cần kiểm tra tối thiểu:

```text
< 480px
480px – 767px
768px – 1023px
1024px+
```

Đặc biệt test:

```text
360 × 800
375 × 812
390 × 844
412 × 915
```

và mobile landscape.

---

# 18. Orientation

Khi đổi:

```text
Portrait
→ Landscape
```

Area phải:

1. Detect kích thước mới.
2. Recalculate game viewport.
3. Recalculate canvas resolution.
4. Preserve game state.
5. Preserve selected object nếu phù hợp.
6. Không reset game ngoài ý muốn.

---

# 19. Responsive UI Rules

### Không dùng

```css
width: 500px;
margin-left: 200px;
```

cho layout chính.

### Hạn chế

```css
position: absolute;
```

để bố trí UI responsive.

### Ưu tiên

```text
Flex
Grid
Container Queries
Percentage
minmax()
clamp()
aspect-ratio()
```

---

# 20. Container Query

Nếu Area được sử dụng trong nhiều layout khác nhau, nên cân nhắc Container Query thay vì chỉ dựa vào viewport.

Ví dụ:

```css
.area {
  container-type: inline-size;
}

@container (max-width: 600px) {
  .area-toolbar {
    ...
  }
}
```

Điều này giúp Area responsive dựa trên **kích thước container thực tế**, không phụ thuộc hoàn toàn vào viewport.

---

# 21. Typography Mobile

Text trong Area cần responsive.

Không hard-code quá nhiều font size.

Có thể dùng:

```css
font-size: clamp(14px, 2vw, 18px);
```

Nhưng cần tránh text quá nhỏ.

Các button/action trên mobile cần đủ vùng touch.

Target tương tác nên đủ lớn để thao tác bằng ngón tay.

---

# 22. Bottom Action Bar

Nếu Area có nhiều action, mobile nên ưu tiên bottom action bar:

```text
┌───────────────────────────────┐
│                               │
│           GAME                │
│                               │
│                               │
├───────────────────────────────┤
│  Play  Edit  Zoom  More      │
└───────────────────────────────┘
```

Bottom bar cần:

* Fixed/sticky đúng context.
* Support safe area.
* Không che game.
* Có background rõ ràng.
* Có trạng thái active rõ ràng.

---

# 23. Performance Mobile

Mobile có tài nguyên thấp hơn desktop nên cần đặc biệt chú ý:

* Không rerender Canvas liên tục.
* Không tạo object mới không cần thiết trong render.
* Không attach event listener nhiều lần.
* Không update React state ở mỗi pointer move nếu không cần.
* Dùng `requestAnimationFrame` cho animation / interaction.
* Cleanup toàn bộ listener / observer khi unmount.

---

# 24. Mobile Performance Checklist

```text
[ ] Canvas không re-render toàn bộ khi pointer move
[ ] ResizeObserver được cleanup
[ ] Pointer listener được cleanup
[ ] requestAnimationFrame được cancel khi unmount
[ ] Không có memory leak
[ ] Không có layout thrashing
[ ] Không đọc/ghi layout liên tục trong cùng frame
[ ] Không tạo unnecessary DOM node
[ ] Không load asset kích thước quá lớn trên mobile
```

---

# 25. Area Game Loading

Mobile cần loading state phù hợp.

Ví dụ:

```text
┌──────────────────────────┐
│                          │
│        Loading...        │
│                          │
└──────────────────────────┘
```

Không được để container game có kích thước:

```text
0 × 0
```

trong lúc loading nếu điều đó gây layout jump.

Nên reserve đúng aspect ratio của game.

---

# 26. Empty / Error State

Area cần responsive cho:

```text
Empty Game
Game Load Error
Game Not Available
Offline
Permission Error
```

UI cần nằm trong viewport game và không làm vỡ layout.

---

# 27. Acceptance Criteria – Mobile

Phần Area được xem là đạt khi:

* Game hiển thị đúng trên mobile portrait.
* Game hiển thị đúng trên mobile landscape.
* Không có horizontal scrollbar ngoài ý muốn.
* Không bị crop game ngoài chủ đích.
* Không làm vỡ aspect ratio.
* Game tự resize khi viewport thay đổi.
* Toolbar không chiếm quá nhiều diện tích.
* Sidebar desktop không làm mất không gian game.
* Touch interaction hoạt động ổn định.
* Không xảy ra conflict giữa page scroll và Canvas interaction.
* Pinch zoom hoạt động đúng nếu feature yêu cầu.
* Safe area được xử lý.
* Không che action bởi notch/browser UI.
* Không có layout jump đáng kể.
* Không có performance degradation rõ rệt trên mobile.

---

# 28. Testing Matrix

Cần test Area trên tối thiểu:

| Device / Viewport | Portrait | Landscape |
| ----------------- | -------: | --------: |
| 360 × 800         |        ✓ |         ✓ |
| 375 × 812         |        ✓ |         ✓ |
| 390 × 844         |        ✓ |         ✓ |
| 412 × 915         |        ✓ |         ✓ |
| 768 × 1024        |        ✓ |         ✓ |
| 1024 × 768        |        - |         ✓ |

Ngoài kích thước, cần test:

```text
Touch
Scroll
Pinch
Rotate
Resize
Open / Close Sidebar
Open / Close Menu
Game Loading
Game Error
Long Content
Large Canvas
Multiple Objects
```

---

# 29. Implementation Priority

Ưu tiên implementation theo thứ tự:

```text
P0
├── Area Game responsive layout
├── Game sizing / aspect ratio
├── Mobile overflow fix
├── Canvas resize
└── Mobile toolbar

P1
├── Touch interaction
├── Scroll / pan behavior
├── Sidebar → Drawer
├── Bottom action bar
└── Safe area

P2
├── Pinch zoom
├── Container query
├── Mobile performance optimization
└── Advanced responsive states
```

---

# 30. Kết quả mong muốn

Sau refactor:

```text
Desktop
┌──────────┬──────────────────────────┬──────────┐
│ Sidebar  │        Game Area         │ Panel    │
└──────────┴──────────────────────────┴──────────┘


Mobile
┌───────────────────────────────┐
│ Area Header                   │
├───────────────────────────────┤
│                               │
│                               │
│          GAME                 │
│                               │
│                               │
├───────────────────────────────┤
│ Actions                       │
└───────────────────────────────┘
```

Mục tiêu chính là **Area phải ưu tiên Game**, tự động sử dụng phần không gian còn lại trên mobile, giữ đúng tỷ lệ và không bị desktop layout ảnh hưởng.

Mobile không nên được xem là phiên bản thu nhỏ của desktop mà cần được thiết kế như **một responsive layout riêng**, trong khi vẫn dùng chung Canvas logic và renderer ở phía FE.
