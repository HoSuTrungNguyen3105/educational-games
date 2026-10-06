# PWA UPDATE & CACHE POLICY

## 1. Mục đích

Tài liệu này quy định cách cấu hình và xử lý PWA trong Edu Game để đảm bảo:

* Sau mỗi lần build/deploy, người dùng nhận được phiên bản frontend mới.
* Service Worker tự động cập nhật.
* Cache cũ được dọn dẹp.
* Không để PWA giữ phiên bản JavaScript/CSS cũ quá lâu.
* Không cache cứng các HTML Game/Template được cập nhật động từ server.
* Không yêu cầu người dùng tự xoá cache trình duyệt sau mỗi lần deploy.
* Không làm ảnh hưởng đến cấu trúc Database hiện tại.

---

# 2. Nguyên nhân PWA không cập nhật

Khi frontend được build phiên bản mới, Service Worker của PWA có thể vẫn đang quản lý cache của phiên bản trước.

Ví dụ:

```text
Version 1
    ↓
Build
    ↓
Service Worker cache JS/CSS/HTML
    ↓
Deploy Version 2
    ↓
Browser vẫn có Service Worker Version 1
    ↓
Application có thể tiếp tục sử dụng cache cũ
```

Vì vậy:

> Build thành công không đồng nghĩa với việc Service Worker lập tức chuyển sang phiên bản mới.

---

# 3. Quy tắc bắt buộc

## 3.1. Service Worker phải tự động update

Nếu sử dụng `vite-plugin-pwa`, phải ưu tiên:

```js
VitePWA({
  registerType: "autoUpdate",
});
```

Không sử dụng cơ chế yêu cầu người dùng tự bấm nút Update nếu không thực sự cần thiết.

---

# 4. Cấu hình Vite PWA

Ví dụ:

```js
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",

      workbox: {
        cleanupOutdatedCaches: true,
      },

      manifest: {
        name: "Edu Game",
        short_name: "Edu Game",
        start_url: "/",
        display: "standalone",
      },
    }),
  ],
});
```

## Các cấu hình quan trọng

### `registerType`

```js
registerType: "autoUpdate"
```

Cho phép Service Worker tự động kiểm tra và cập nhật phiên bản mới.

### `cleanupOutdatedCaches`

```js
workbox: {
  cleanupOutdatedCaches: true,
}
```

Cho phép Workbox dọn dẹp các cache cũ không còn sử dụng.

---

# 5. Đăng ký Service Worker

Frontend nên đăng ký Service Worker bằng cơ chế hỗ trợ update.

Ví dụ:

```js
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  immediate: true,

  onNeedRefresh() {
    updateSW(true);
  },

  onOfflineReady() {
    console.log("PWA is ready for offline use");
  },
});
```

Trong đó:

```js
updateSW(true);
```

cho phép kích hoạt phiên bản Service Worker mới và reload ứng dụng khi cần.

---

# 6. Không cache cứng HTML Game

Đây là phần rất quan trọng đối với kiến trúc Edu Game.

Hệ thống có các HTML Game/Template được lưu và cập nhật động.

Ví dụ:

```text
templates/
    break-of-dawn.html
    lucky-wheel.html
    math-adventure.html
```

Hoặc URL từ API:

```text
https://api.hiweb.vn/templates/break-of-dawn.html
```

Các file này có thể được Admin chỉnh sửa mà **không cần build lại frontend**.

Do đó:

> Không được cache HTML Game theo kiểu Cache First quá lâu.

---

# 7. Phân loại tài nguyên cần cache

## 7.1. Frontend assets

Các file build của Vite có thể cache:

```text
/assets/*.js
/assets/*.css
/assets/*.png
/assets/*.svg
/assets/*.webp
/assets/*.woff
/assets/*.woff2
```

Vite thường tạo filename có hash:

```text
index-B7x91K.js
index-A82mQ2.css
```

Khi code thay đổi:

```text
index-B7x91K.js
```

có thể trở thành:

```text
index-X92kLm.js
```

Do đó browser có thể nhận diện asset mới.

---

# 8. Không cache cứng API

Các API như:

```text
/api/auth
/api/games
/api/templates
/api/questions
/api/users
/api/profile
```

không nên bị PWA cache cứng.

Dữ liệu API phải ưu tiên lấy từ server.

Ví dụ:

```text
Browser
   ↓
API request
   ↓
Backend
   ↓
Database
```

Không nên:

```text
Browser
   ↓
PWA Cache
   ↓
Dữ liệu API cũ
```

---

# 9. HTML Template động

Kiến trúc mong muốn:

```text
Frontend
   ↓
GET template/game
   ↓
Backend / Storage
   ↓
HTML mới nhất
```

Ví dụ:

```text
https://api.hiweb.vn/templates/break-of-dawn.html
```

Admin sửa HTML:

```text
Version 1
    ↓
Admin update
    ↓
Version 2
```

Người dùng phải nhận:

```text
Version 2
```

mà không cần:

```text
npm run build
```

và không cần deploy lại frontend.

---

# 10. Nếu HTML Game được lấy từ API

Có thể sử dụng chiến lược:

```text
Network First
```

thay vì:

```text
Cache First
```

Ưu tiên:

```text
Network
   ↓
Nếu thành công → HTML mới
   ↓
Nếu offline → dùng cache cũ
```

Mục tiêu:

* Online → luôn ưu tiên nội dung mới.
* Offline → vẫn có thể sử dụng nội dung đã cache nếu cần.

---

# 11. GitHub Pages

Nếu Edu Game được deploy bằng GitHub Pages:

```text
https://hosutrunguyen3105.github.io/educational-games/
```

phải cấu hình đúng `base`.

Ví dụ:

```js
export default defineConfig({
  base: "/educational-games/",

  plugins: [
    VitePWA({
      registerType: "autoUpdate",

      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
```

`base` phải đúng với đường dẫn repository GitHub Pages.

---

# 12. Quy trình Build & Deploy

Mỗi lần cập nhật frontend:

```bash
npm run build
```

Sau đó deploy thư mục:

```text
dist/
```

Không được tự ý xoá:

```text
manifest.webmanifest
sw.js
workbox-*.js
```

nếu PWA đang sử dụng chúng.

---

# 13. Sau khi deploy phiên bản mới

Browser sẽ thực hiện:

```text
Load website
     ↓
Check Service Worker
     ↓
Phát hiện Service Worker mới
     ↓
Install
     ↓
Activate
     ↓
Cleanup cache cũ
     ↓
Load frontend mới
```

Mục tiêu cuối cùng:

```text
User
 ↓
Website
 ↓
Service Worker mới
 ↓
Frontend mới
```

---

# 14. Trường hợp người dùng vẫn thấy phiên bản cũ

Kiểm tra Chrome:

```text
F12
↓
Application
↓
Service Workers
```

Kiểm tra:

```text
Status: activated
```

và kiểm tra Service Worker có phiên bản mới hay không.

Có thể dùng:

```text
Update
```

để kiểm tra cập nhật.

---

# 15. Xoá cache để debug

Chỉ dùng bước này trong quá trình debug.

Chrome:

```text
F12
↓
Application
↓
Storage
↓
Clear site data
```

Hoặc:

```text
Application
↓
Service Workers
↓
Unregister
```

Sau đó reload trang.

> Đây là phương án debug, không phải cách xử lý chính thức cho người dùng.

Hệ thống production phải tự động cập nhật Service Worker.

---

# 16. Không sử dụng version thủ công để phá cache

Không nên liên tục sửa:

```text
?v=1
?v=2
?v=3
```

cho toàn bộ frontend chỉ để ép browser cập nhật.

Vite đã hỗ trợ hash filename:

```text
index-abc123.js
```

nên nên tận dụng cơ chế này.

---

# 17. Không dùng Cache First cho toàn bộ website

Không được cấu hình kiểu:

```text
Cache Everything
```

cho toàn bộ:

```text
/
*.html
/api/*
```

vì có thể dẫn đến:

```text
Frontend cũ
API cũ
Game HTML cũ
Template cũ
```

---

# 18. Kiến trúc cache đề xuất

```text
                    ┌─────────────────────┐
                    │      Edu Game       │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Frontend Assets       API         HTML Game/Template
              │                │                │
              ▼                ▼                ▼
        Cache có hash       Network First    Network First
              │                │                │
              ▼                ▼                ▼
        JS / CSS / Img      Backend          Storage/API
```

---

# 19. Nguyên tắc cập nhật

## Frontend

```text
Code thay đổi
    ↓
npm run build
    ↓
Vite tạo asset hash mới
    ↓
Deploy
    ↓
Service Worker update
    ↓
User nhận frontend mới
```

## Game HTML

```text
Admin chỉnh sửa
    ↓
Upload HTML mới
    ↓
Storage/API cập nhật
    ↓
User mở game
    ↓
Network lấy HTML mới
```

Không cần build frontend.

---

# 20. Không thay đổi Database

Việc sửa cấu hình PWA:

* Không thay đổi database.
* Không thay đổi collection `games`.
* Không thay đổi collection `templates`.
* Không thay đổi cấu trúc trả về questions.
* Không thay đổi API contract hiện tại.

PWA chỉ chịu trách nhiệm:

```text
Caching
Service Worker
Offline support
Frontend update
Asset management
```

---

# 21. Checklist trước khi deploy

```text
[ ] npm run build chạy thành công
[ ] dist/ được tạo đầy đủ
[ ] manifest được tạo
[ ] Service Worker được tạo
[ ] registerType = autoUpdate
[ ] cleanupOutdatedCaches = true
[ ] Không cache cứng API
[ ] Không cache cứng HTML Game động
[ ] GitHub Pages base đúng nếu sử dụng
[ ] Deploy toàn bộ dist/
```

---

# 22. Checklist khi phát hiện web không cập nhật

```text
[ ] Kiểm tra Service Worker
[ ] Kiểm tra Application → Service Workers
[ ] Kiểm tra cache
[ ] Kiểm tra Network
[ ] Kiểm tra file JS/CSS có hash mới
[ ] Kiểm tra deploy có thực sự chứa build mới
[ ] Kiểm tra base của Vite
[ ] Kiểm tra HTML Game có đang bị Cache First hay không
```

---

# 23. Mục tiêu cuối cùng

Hệ thống PWA của Edu Game phải hoạt động theo nguyên tắc:

```text
             ┌──────────────┐
             │  New Deploy  │
             └──────┬───────┘
                    ↓
             New Service Worker
                    ↓
             Cleanup Old Cache
                    ↓
              New Frontend
                    ↓
             ┌──────────────┐
             │    User      │
             └──────────────┘
```

Trong khi đó Game/Template động:

```text
Admin Update
     ↓
Backend / Storage
     ↓
HTML mới
     ↓
User mở Game
     ↓
Network lấy HTML mới
```

### Quy tắc quan trọng nhất

> **Frontend build mới phải tự động cập nhật PWA.**

> **HTML Game/Template động phải ưu tiên dữ liệu mới từ server và không được bị cache cứng.**

> **Không yêu cầu người dùng tự xoá cache sau mỗi lần deploy.**
