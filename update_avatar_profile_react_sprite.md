Upload ảnh tổng
       ↓
Tự động nhận diện các vùng riêng biệt
       ↓
Tách thành từng ảnh PNG
       ↓
Hiển thị danh sách Preview
       ↓
Anh nhập tên cho từng ảnh
       ↓
Chọn Category cho từng ảnh
       ↓
Nhập giá Coin
       ↓
Chọn món mặc định nếu cần
       ↓
Bấm "Lưu tất cả"
       ↓
Upload từng PNG lên API/Storage
       ↓
Lưu thông tin Item vào API

Ví dụ:

┌──────────────────────────────────────────────┐
│ Avatar Item Extractor                        │
├──────────────────────────────────────────────┤
│                                              │
│ [ Upload ảnh tổng ]                          │
│                                              │
│ Đã nhận diện: 12 item                        │
│                                              │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │            │ │            │ │            │ │
│ │  Preview   │ │  Preview   │ │  Preview   │ │
│ │    01      │ │    02      │ │    03      │ │
│ │            │ │            │ │            │ │
│ └────────────┘ └────────────┘ └────────────┘ │
│                                              │
│ Tên: [ Tóc nam đen       ]                   │
│ Category: [ Tóc ▼ ]                          │
│ Giá: [ 100 ] Coin                            │
│                                              │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │  Preview   │ │  Preview   │ │  Preview   │ │
│ │    04      │ │    05      │ │    06      │ │
│ └────────────┘ └────────────┘ └────────────┘ │
│                                              │
│ ...                                          │
│                                              │
│                  [ Lưu tất cả ]              │
└──────────────────────────────────────────────┘
Quan trọng

Mỗi preview phải là ảnh đã được tách riêng, ví dụ:

Ảnh tổng
   ↓
┌─────┐ ┌─────┐ ┌─────┐
│ 01  │ │ 02  │ │ 03  │
└─────┘ └─────┘ └─────┘
   ↓      ↓      ↓
PNG      PNG    PNG

Sau đó anh chỉ việc nhập:

01 → Tóc nam 01 → hair → 100 Coin
02 → Tóc nam 02 → hair → 100 Coin
03 → Tóc nam 03 → hair → 150 Coin

Khi bấm Lưu tất cả, hệ thống sẽ upload từng PNG và tạo Item tương ứng.

Tôi khuyên không tự đặt tên bằng AI ngay từ đầu. Để anh tự nhập tên sẽ chính xác hơn, còn hệ thống chỉ tự đánh số Item 01, Item 02,... để anh dễ quản lý.