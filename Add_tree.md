# 🌱 Hệ thống Trồng Cây – Đổi Xu

## 🎯 Mục tiêu

Tạo một khu vườn cá nhân để học sinh vừa chơi vừa có động lực học tập , sử dụng React và làm ở hệ thống trang web , ko làm thành html game riêng lẻ , hãy làm cho nó tối ưu nhất có thể , và có thể làm cho nhân vật trong game avatar nó tương tác với khu vườn , ví dụ . Khi nhân vật đi đến cây táo thì nhân vật sẽ dừng lại và thực hiện hành động tưới cây , hoặc khi nhân vật nhấp chuột vào  tưới cây thì nhân vật sẽ thực hiện hành động tưới cây , và có thể tương tác với các vật phẩm trong khu vườn.

Cơ chế chính:

**📚 Học → 🌱 Chăm cây → 🌳 Phát triển → 🍎 Thu hoạch → 🪙 Nhận xu → 🎨 Trang trí**

---

## 🌱 1. Trồng cây

Học sinh có thể mua hoặc nhận **hạt giống**.

Mỗi loại cây có:

* Tên
* Hình ảnh
* Thời gian phát triển
* Giá hạt giống
* Số xu nhận khi thu hoạch
* Độ hiếm
* Điều kiện mở khóa

Ví dụ:

| Cây                | Thời gian | Xu thu hoạch | Độ hiếm   |
| ------------------ | --------: | -----------: | --------- |
| 🌻 Hoa hướng dương |    5 phút |           20 | Thường    |
| 🍎 Cây táo         |   30 phút |           50 | Thường    |
| 🌸 Cây anh đào     |     2 giờ |          120 | Hiếm      |
| 🌳 Cây cổ thụ      |    12 giờ |          500 | Epic      |
| 🌈 Cây thần kỳ     |    24 giờ |        1.000 | Legendary |

---

## 💧 2. Chăm sóc cây bằng hoạt động học tập

Không cho cây chỉ tự động phát triển.

Học sinh cần hoàn thành hoạt động học để chăm sóc cây:

* Trả lời đúng câu hỏi → 💧 Nhận nước
* Hoàn thành bài học → ☀️ Nhận ánh sáng
* Hoàn thành nhiệm vụ → 🌱 Tăng tiến độ cây
* Streak học tập → ⭐ Bonus phát triển
* Hoàn thành nhiệm vụ khó → 🎁 Có cơ hội nhận hạt giống hiếm

Ví dụ:

```text
🌱 Cây đang phát triển: 40%

Trả lời đúng 5 câu hỏi
        ↓
      +20%
        ↓
🌿 Cây phát triển: 60%
```

---

## 🌳 3. Các giai đoạn phát triển

Mỗi cây có nhiều trạng thái:

```text
🌱 Hạt giống
   ↓
🌿 Cây non
   ↓
🌳 Cây trưởng thành
   ↓
🍎 Có thể thu hoạch
```

Có thể sử dụng animation chuyển đổi giữa các trạng thái.

---

## 🪙 4. Thu hoạch

Khi cây trưởng thành, học sinh có thể thu hoạch.

Ví dụ:

```text
🍎 Cây táo đã trưởng thành!

[ THU HOẠCH ]

        ↓

+50 🪙 Xu
+10 ⭐ XP
```

Sau khi thu hoạch:

* Cây được reset về trạng thái hạt giống hoặc biến mất.
* Học sinh có thể trồng cây mới.
* Có xác suất nhận thêm vật phẩm bonus.

---

## 🏡 5. Khu vườn cá nhân

Mỗi học sinh có một khu vườn riêng.

Có thể đặt:

* 🌳 Cây
* 🌻 Hoa
* 🪨 Đá
* 🪵 Hàng rào
* 🏡 Nhà
* 💧 Hồ nước
* 🐶 Pet
* 🎀 Đồ trang trí

Ví dụ:

```text
╭────────────────────────────╮
│        🌳 VƯỜN CỦA TÔI     │
│                            │
│   🌻        🌳       🍎    │
│                            │
│       🌸          🌱       │
│                            │
│   🪨      🏡       🪨      │
│                            │
│ 🪙 2,450        ⭐ Lv.12   │
╰────────────────────────────╯
```

---

## 🛒 6. Cửa hàng

Xu dùng để mua:

### 🌱 Hạt giống

* Cây thường
* Cây hiếm
* Cây Epic
* Cây Legendary

### 🎨 Đồ trang trí

* Hàng rào
* Đá
* Hồ nước
* Đèn
* Nhà
* Cổng
* Background

### 🐾 Pet

Pet chỉ mang tính trang trí hoặc bonus nhỏ, không được tạo lợi thế quá lớn.

---

## 🏆 7. Cây hiếm và phần thưởng

Không nên để tất cả cây đều mua bằng xu.

Một số cây phải nhận thông qua:

* Achievement
* Streak
* Nhiệm vụ đặc biệt
* Event
* Thành tích học tập
* Boss/mini-game
* Sự kiện theo mùa

Ví dụ:

```text
🔥 Học 7 ngày liên tiếp
        ↓
🎁 Nhận: 🌸 Cây Anh Đào
```

---

## 📚 8. Liên kết với hệ thống học tập

Cây phải liên kết trực tiếp với hệ thống học.

Ví dụ:

```text
Hoàn thành 5 câu Toán
        ↓
       💧
     Tưới cây

Hoàn thành bài Tiếng Anh
        ↓
       ☀️
   Tăng tốc phát triển

Hoàn thành Daily Quest
        ↓
       ⭐
    Bonus XP
```

Mục tiêu là khiến học sinh cảm thấy:

> **Muốn cây phát triển → phải học.**

---

## 🔄 9. Vòng lặp gameplay

```text
        📚 HỌC
          ↓
      ✅ Hoàn thành
          ↓
      💧 Chăm cây
          ↓
       🌱 Cây lớn
          ↓
      🍎 Thu hoạch
          ↓
       🪙 Nhận xu
          ↓
   🛒 Mua hạt giống
          ↓
    🎨 Trang trí vườn
          ↓
        🌱 Trồng
          ↓
       📚 HỌC TIẾP
```

---

## ⚠️ 10. Quy tắc cân bằng

### Không được:

* Cho cây tự động sinh xu vô hạn.
* Cho học sinh farm xu mà không cần học.
* Cho vật phẩm trả phí/đắt tiền ảnh hưởng quá mạnh đến kết quả học.
* Biến hệ thống thành game idle thuần túy.

### Nên:

* Phần thưởng chính đến từ hoạt động học.
* Xu chủ yếu dùng cho cosmetic.
* Cây hiếm đến từ thành tích.
* Có daily quest.
* Có streak.
* Có event theo mùa.
* Có nhiều loại cây để sưu tầm.

---

## 🎮 11. Có thể mở rộng sau này

### 🌦️ Thời tiết

* ☀️ Nắng
* 🌧️ Mưa
* ❄️ Tuyết
* 🌈 Cầu vồng

### 🎃 Event

* Halloween
* Christmas
* Tết
* Summer Event
* Back to School

### 🏆 Leaderboard

Xếp hạng theo:

* Số cây đã trồng
* Cây hiếm sở hữu
* Thành tích học tập
* XP
* Streak

### 👥 Khu vườn bạn bè

Cho phép học sinh:

* Thăm vườn bạn
* Tặng hạt giống
* Tặng nước
* Xem bộ sưu tập
* Cùng hoàn thành event

---

# ⭐ Ưu tiên triển khai

### Phase 1

* [ ] Khu vườn
* [ ] Trồng cây
* [ ] Timer phát triển
* [ ] Các giai đoạn cây
* [ ] Thu hoạch
* [ ] Xu

### Phase 2

* [ ] Cửa hàng
* [ ] Nhiều loại cây
* [ ] Inventory
* [ ] Đồ trang trí
* [ ] Daily Quest

### Phase 3

* [ ] Achievement
* [ ] Streak
* [ ] Cây hiếm
* [ ] Event
* [ ] Pet
* [ ] Leaderboard

### Phase 4

* [ ] Thăm vườn bạn bè
* [ ] Tặng vật phẩm
* [ ] Co-op Event
* [ ] Seasonal Garden

---

## 💡 Nguyên tắc cốt lõi

**Đừng làm "game trồng cây có thêm bài học".**

Hãy làm:

> **"Hệ thống học tập được biến thành một game trồng cây."**

Mọi phần thưởng và tiến trình trong khu vườn đều nên được thúc đẩy bởi **việc học của học sinh**.
