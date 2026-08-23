# Refactor Dashboard giáo viên — Sidebar trái

## Mục tiêu

Giữ **nguyên giao diện, màu sắc, font, style và chức năng hiện tại**.

Chỉ thay đổi layout:

**Từ navbar ngang → sidebar trái.**

---

## Layout mới

```text
┌──────────────────┬──────────────────────────────────────┐
│ 🏫 Lớp Học Vui   │                                      │
│                  │  Nội dung trang hiện tại             │
│ 🏠 Dashboard     │                                      │
│ 📚 Thư viện      │                                      │
│ 👥 Người dùng    │                                      │
│ 🧩 Templates     │                                      │
│                  │                                      │
│ 🎮 Tạo trò chơi  │                                      │
│                  │                                      │
│ 🏠 Về trang chủ  │                                      │
└──────────────────┴──────────────────────────────────────┘
```

## Sidebar

* Đưa toàn bộ menu hiện tại từ navbar sang sidebar trái.
* Giữ nguyên text, icon và màu sắc hiện tại.
* Menu đang active vẫn dùng style màu vàng hiện tại.
* Logo **Lớp Học Vui** đặt ở đầu sidebar.
* Sidebar rộng khoảng `240px - 260px`.
* Sidebar cao `100vh`.
* Có border-radius/style giống giao diện hiện tại.

## Content

Giữ nguyên toàn bộ giao diện các page hiện tại.

Chỉ thay đổi:

```text
Navbar phía trên
        ↓
Sidebar bên trái
```

Ví dụ trang Templates vẫn giữ:

```text
Quản lý template trò chơi
Templates

┌─────────────────────────────────────────────┐
│ + Tạo template mới                          │
│                                             │
│ Form template hiện tại                      │
│                                             │
└─────────────────────────────────────────────┘
```

Không thay đổi:

* API
* Database
* Business logic
* Form
* Component nghiệp vụ
* Nội dung page
* Màu sắc
* Font
* Style hiện tại

## Component

Tạo layout dùng chung:

```text
TeacherLayout
├── TeacherSidebar
└── MainContent
```

Sidebar dùng chung cho tất cả trang `/admin/*`.

## Responsive

Desktop: sidebar trái cố định.

Mobile: sidebar chuyển thành drawer mở bằng nút `☰`.

## Yêu cầu quan trọng

**Không redesign lại dashboard.**

**Chỉ lấy đúng giao diện hiện tại và chuyển navbar ngang thành sidebar trái.**
