# Dreamdale (React)

Bản clone giao diện game Dreamdale viết bằng React (JSX) + Vite, gồm:

- **Khu vực bản đồ / bờ sông** (`src/components/Riverbank.jsx`) — sông, cầu gỗ, bụi cây ven bờ.
- **Lò rèn kiếm** (`src/components/Blacksmith.jsx`) — đi tới gần và bấm vào để mở bảng rèn kiếm, tốn gỗ + đá để nâng cấp kiếm.
- **Khu đổi đồ** (`src/components/ExchangeShop.jsx`) — đổi đá lấy xu theo tỉ lệ 2 đá = 1 xu, có thanh trượt chọn số lượng hoặc nút "Đổi tất cả".
- **Nhân vật di chuyển** (`src/components/Character.jsx`) điều khiển bằng WASD / phím mũi tên.
- **Thanh tài nguyên & UI trên cùng** (`src/components/TopBar.jsx`).

## Cấu trúc thư mục

```
dreamdale-react/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx        # state game (tài nguyên, cấp kiếm, di chuyển, va chạm gần nhà)
    ├── App.css         # toàn bộ style
    └── components/
        ├── TopBar.jsx
        ├── GameWorld.jsx
        ├── Character.jsx
        ├── Riverbank.jsx
        ├── Blacksmith.jsx
        └── ExchangeShop.jsx
```

## Cách chạy

Cần Node.js đã cài sẵn máy bạn, sau đó:

```bash
cd dreamdale-react
npm install
npm run dev
```

Mở trình duyệt ở địa chỉ mà Vite in ra (thường là `http://localhost:5173`).

## Cách chơi

- Di chuyển nhân vật bằng **W A S D** hoặc **phím mũi tên**.
- Đi tới gần **lò rèn kiếm** (nhà mái tím có lò lửa) rồi bấm vào nhà để mở bảng rèn, tốn gỗ + đá để nâng cấp kiếm lên 1 cấp.
- Đi tới gần **khu đổi đồ** (nhà có biển 🪨➡️🪙) rồi bấm vào để đổi đá lấy xu.
- Tài nguyên (gỗ / đá / xu) và cấp độ kiếm hiển thị ở thanh trên cùng và góc dưới trái.

## Build production

```bash
npm run build
npm run preview
```
