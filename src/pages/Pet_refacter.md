# Tái cấu trúc hệ thống Pet, SVG trang phục và Avatar Profile trong Edu Game

## 1. Mục tiêu

Tái cấu trúc hệ thống pet trong dự án Edu Game bằng React và SVG, hỗ trợ:

- Hiển thị pet mặc định như chó, mèo.
- Tạo sẵn các mẫu trang phục và linh kiện SVG ở frontend.
- Ghép các linh kiện SVG lên pet để tạo thành nhiều diện mạo khác nhau.
- Lưu dữ liệu pet, trạng thái trang bị và vật phẩm của người chơi thông qua API backend hiện có.
- Đồng bộ pet và trang phục với avatar ở trang Profile cá nhân.
- Cho phép thay đổi trang phục mà không cần tạo hoặc lưu một file SVG hoàn chỉnh mới trên backend.

**Nguyên tắc quan trọng:** Frontend quản lý asset SVG và cách render giao diện; backend quản lý dữ liệu pet, quyền sở hữu vật phẩm và trạng thái trang bị của người chơi.

## 2. Phạm vi thực hiện

Kiểm tra cấu trúc dự án hiện tại trước khi sửa. Tái cấu trúc các phần liên quan đến:

1. Pet và giao diện pet mặc định.
2. Các mẫu SVG trang phục, phụ kiện và linh kiện.
3. Component ghép SVG thành pet hoàn chỉnh.
4. API service quản lý dữ liệu pet và trang bị.
5. Kho đồ và giao diện thay trang phục.
6. Avatar pet tại trang Profile cá nhân.
7. Các component hoặc màn hình khác đang sử dụng chung avatar pet.

Không tự ý viết lại toàn bộ dự án hoặc thay đổi các chức năng không liên quan.

## 3. Phân chia trách nhiệm frontend và backend

### 3.1. Frontend React

Frontend chịu trách nhiệm:

- Lưu và quản lý SVG pet mặc định.
- Lưu các mẫu SVG trang phục và linh kiện.
- Định nghĩa danh sách vật phẩm hợp lệ, ID, loại trang bị và đường dẫn asset.
- Render pet bằng cách ghép các SVG theo từng lớp.
- Hiển thị bản xem trước khi người chơi thử trang phục.
- Hiển thị trang phục đang mặc dựa trên dữ liệu API.
- Tái sử dụng component pet ở trang chủ, Kho đồ và Profile.
- Hiển thị trạng thái tải dữ liệu, lỗi API và trạng thái lưu trang phục.

Không lưu nội dung SVG vào database chỉ để thể hiện một tổ hợp trang phục.

### 3.2. Backend/API

Backend chịu trách nhiệm:

- Lưu thông tin pet của từng người chơi.
- Lưu loài, màu sắc, cấp độ, EXP, tâm trạng và các chỉ số liên quan.
- Lưu ID các trang phục người chơi đang mặc.
- Lưu danh sách vật phẩm người chơi sở hữu hoặc tham chiếu đến hệ thống kho đồ hiện có.
- Xác thực quyền sở hữu vật phẩm trước khi cho phép trang bị.
- Lưu thay đổi trang phục và trả về dữ liệu pet mới nhất.
- Đồng bộ dữ liệu giữa các màn hình và các lần đăng nhập.

Không tải file SVG lên backend. Không lưu file SVG, HTML hoặc dữ liệu hình ảnh nhị phân vào database cho chức năng này.

## 4. Cấu trúc thư mục frontend đề xuất

Điều chỉnh theo cấu trúc thực tế của dự án; không tạo thư mục trùng nếu đã có component hoặc asset tương đương.

```text
src/
├── assets/
│   └── pets/
│       ├── base/
│       │   ├── dog/
│       │   │   └── cream/
│       │   │       ├── body.svg
│       │   │       ├── eyes.svg
│       │   │       ├── ears.svg
│       │   │       └── face.svg
│       │   └── cat/
│       │       └── orange/
│       │           ├── body.svg
│       │           ├── eyes.svg
│       │           ├── ears.svg
│       │           └── face.svg
│       │
│       └── outfits/
│           ├── hats/
│           │   ├── crown.svg
│           │   └── wizard-hat.svg
│           ├── glasses/
│           │   └── round-glasses.svg
│           ├── shirts/
│           │   └── student-shirt.svg
│           ├── scarves/
│           │   └── red-scarf.svg
│           ├── bows/
│           │   └── pink-bow.svg
│           ├── capes/
│           │   └── hero-cape.svg
│           └── backpacks/
│               └── adventure-backpack.svg
│
├── components/
│   └── pet/
│       ├── PetAvatar.jsx
│       ├── PetRenderer.jsx
│       ├── PetSvgLayer.jsx
│       └── PetPreview.jsx
│
├── data/
│   └── petAssets.js
│
├── services/
│   └── petService.js
│
└── pages/
    ├── inventory/
    └── profile/
```

Đây là cấu trúc định hướng. Có thể đổi tên hoặc vị trí để phù hợp với quy ước đang dùng trong dự án.

## 5. Tạo sẵn pet SVG mặc định

Tạo các file SVG mẫu thực tế, không chỉ tạo component rỗng hoặc placeholder.

Yêu cầu tối thiểu:

- Một pet chó màu kem.
- Một pet mèo màu cam.
- Hình dáng thân thiện, phù hợp trò chơi giáo dục.
- Có thể nhận biết rõ mắt, tai, thân và khuôn mặt.
- Thiết kế theo cùng hệ tọa độ SVG, ví dụ `viewBox="0 0 512 512"`.
- Các lớp trang phục có cùng kích thước canvas và được căn chỉnh với pet tương ứng.
- Nền trong suốt, không nhúng nền trắng vào SVG.
- Có thể đổi màu hoặc thay đổi linh kiện mà không phải tạo lại toàn bộ pet.
- Không dùng ảnh chụp hoặc hình ảnh nền cố định để giả lập trang phục có thể thay đổi.

Nếu cần tách SVG thành nhiều lớp, phải bảo đảm khi ghép lại không bị lệch vị trí hoặc xuất hiện khe hở không mong muốn.

## 6. Tạo sẵn các mẫu trang phục và linh kiện

Tạo tối thiểu các asset SVG mẫu sau:

| Nhóm | ID mẫu | Tên hiển thị |
|---|---|---|
| Mũ | `hat_crown_01` | Vương miện |
| Mũ | `hat_wizard_01` | Mũ phù thủy |
| Kính | `glasses_round_01` | Kính tròn |
| Áo | `shirt_student_01` | Áo học sinh |
| Khăn | `scarf_red_01` | Khăn quàng đỏ |
| Nơ | `bow_pink_01` | Nơ hồng |
| Áo choàng | `cape_hero_01` | Áo choàng anh hùng |
| Ba lô | `backpack_adventure_01` | Ba lô phiêu lưu |

Các linh kiện phải có hình SVG thật và được thiết kế để hiển thị trên pet, không chỉ là biểu tượng đại diện trong danh mục.

Cần kiểm tra vị trí và thứ tự render cho từng nhóm:

- Ba lô và áo choàng nằm phía sau thân khi phù hợp.
- Áo được đặt đúng trên thân.
- Kính nằm đúng vị trí mắt.
- Mũ nằm trên đầu.
- Khăn và nơ không che khuất khuôn mặt.
- Thứ tự lớp có thể cấu hình thay vì viết rải rác trong nhiều component.

Nếu một asset không phù hợp với một loài pet, phải khai báo loài được hỗ trợ hoặc có asset riêng; không mặc định mọi phụ kiện đều tương thích với chó và mèo.

## 7. Khai báo asset ở frontend

Tạo một registry tập trung để ánh xạ ID vật phẩm với asset SVG, loại trang bị và loài pet tương thích.

Ví dụ định hướng:

```jsx
// src/data/petAssets.js

import crownSvg from "../assets/pets/outfits/hats/crown.svg";
import roundGlassesSvg from "../assets/pets/outfits/glasses/round-glasses.svg";
import studentShirtSvg from "../assets/pets/outfits/shirts/student-shirt.svg";

export const PET_OUTFIT_ASSETS = {
  hat_crown_01: {
    id: "hat_crown_01",
    category: "hat",
    name: "Vương miện",
    asset: crownSvg,
    compatibleSpecies: ["dog", "cat"],
    zIndex: 50,
  },

  glasses_round_01: {
    id: "glasses_round_01",
    category: "glasses",
    name: "Kính tròn",
    asset: roundGlassesSvg,
    compatibleSpecies: ["dog", "cat"],
    zIndex: 60,
  },

  shirt_student_01: {
    id: "shirt_student_01",
    category: "shirt",
    name: "Áo học sinh",
    asset: studentShirtSvg,
    compatibleSpecies: ["dog", "cat"],
    zIndex: 30,
  },
};
```

Đây chỉ là ví dụ về cách tổ chức. Khi triển khai, phải bổ sung đầy đủ các asset đã tạo, xử lý thứ tự lớp hợp lý và bảo đảm đường dẫn import đúng.

Nếu dự án dùng cách phục vụ SVG khác, có thể dùng URL asset thay cho import; chọn một cách nhất quán.

Không lấy URL hoặc đường dẫn SVG tùy ý từ API để tải nội dung không kiểm soát. ID từ backend phải được ánh xạ đến asset hợp lệ trong registry frontend.

## 8. Cấu trúc dữ liệu pet trên API

Giữ nguyên cấu trúc API và các trường pet hiện có nếu chúng đang được sử dụng. Không tự ý phá vỡ tương thích với dữ liệu cũ.

Ví dụ cấu trúc dữ liệu pet:

```json
{
  "status": true,
  "code": 200,
  "msg": "success",
  "data": {
    "id": "upet-ar5r3bn",
    "species": "dog",
    "name": "Bồng",
    "color": "cream",
    "outfits": {
      "hat": "hat_crown_01",
      "glasses": "glasses_round_01",
      "shirt": "shirt_student_01",
      "scarf": null,
      "bow": null,
      "cape": null,
      "backpack": "backpack_adventure_01"
    },
    "level": 1,
    "exp": 0,
    "expNeeded": 200,
    "mood": "happy",
    "bonded": 10,
    "totalCorrect": 0,
    "totalWrong": 0,
    "createdAt": "2026-10-04T04:07:53.336Z",
    "updatedAt": "2026-10-06T05:54:11.746Z"
  }
}
```

Đây là ví dụ minh họa, không phải yêu cầu thay toàn bộ dữ liệu hiện tại bằng JSON này.

Quy ước:

- `species`: loài pet.
- `color`: mã màu hoặc mã biến thể đã được frontend hỗ trợ.
- `outfits`: ID trang phục đang mặc theo từng vị trí.
- `null`: vị trí chưa mặc trang phục.
- Các trường EXP, cấp độ và thống kê tiếp tục do backend quản lý.

Không lưu đường dẫn SVG hoặc nội dung SVG trong `outfits`.

Nếu backend hiện đã có model, endpoint hoặc trường dữ liệu tương đương, hãy tái sử dụng thay vì tạo API hoặc schema trùng lặp.

## 9. Tái cấu trúc component render pet

### `PetRenderer.jsx`

Component chịu trách nhiệm:

- Nhận dữ liệu pet từ props.
- Xác định asset pet cơ bản theo `species` và `color`.
- Đọc ID trang phục trong `outfits`.
- Tra cứu asset tương ứng từ `petAssets.js`.
- Render các lớp theo thứ tự đã định nghĩa.
- Bỏ qua vị trí có giá trị `null`.
- Bỏ qua hoặc xử lý an toàn ID không tồn tại trong registry.
- Không gọi API trực tiếp trong component render.

### `PetAvatar.jsx`

Component dùng để hiển thị pet ở kích thước nhỏ:

- Hỗ trợ các kích thước như `sm`, `md`, `lg` hoặc prop `size`.
- Giữ đúng tỉ lệ hình.
- Hiển thị đầy đủ diện mạo pet và trang phục đang mặc.
- Có thể tái sử dụng ở Profile, danh sách người chơi, bảng xếp hạng hoặc các vị trí khác.

### `PetPreview.jsx`

Component dùng trong Kho đồ:

- Hiển thị pet hiện tại.
- Cho phép xem trước trang phục đang chọn.
- Có thể dùng trạng thái tạm ở frontend để thử nhiều món đồ.
- Chỉ lưu backend khi người chơi xác nhận trang bị.
- Nếu lưu thất bại, thông báo lỗi và khôi phục trạng thái đã lưu.

Không nhân bản logic ghép SVG trong từng trang.

## 10. Tái cấu trúc API service

Kiểm tra API hiện tại và tích hợp thông qua `petService.js` hoặc service tương đương đang có.

Các thao tác cần hỗ trợ theo API thực tế:

- Lấy dữ liệu pet hiện tại.
- Lấy danh sách vật phẩm người chơi sở hữu.
- Cập nhật trang phục đang mặc.
- Tháo trang phục khỏi một vị trí.
- Đồng bộ lại dữ liệu pet sau khi cập nhật.

Không tự bịa endpoint mới trước khi kiểm tra backend. Nếu thiếu API cần thiết, hãy ghi rõ endpoint hiện có, endpoint còn thiếu và đề xuất hợp đồng request/response để bổ sung.

Frontend phải sử dụng API client chung của dự án nếu đã có, bao gồm xử lý token, lỗi xác thực và định dạng response. Không tạo một cơ chế gọi API độc lập làm trùng logic hiện tại.

## 11. Tích hợp Kho đồ và chức năng thay trang phục

Kho đồ cần:

- Hiển thị các vật phẩm người chơi sở hữu.
- Chia danh mục theo loại trang bị.
- Hiển thị hình minh họa của vật phẩm.
- Hiển thị trạng thái đang mặc.
- Cho phép thử trang phục trên pet.
- Có thao tác Mặc và Tháo đồ.
- Cập nhật giao diện ngay sau khi API lưu thành công.
- Không cho trang bị vật phẩm người chơi chưa sở hữu.
- Kiểm tra tính tương thích giữa vật phẩm và loài pet.

Asset minh họa của vật phẩm phải dùng từ registry frontend. API chỉ cung cấp dữ liệu vật phẩm, ID, trạng thái sở hữu và các thông tin nghiệp vụ cần thiết.

Nếu dự án đã có hệ thống xu và cửa hàng, tích hợp theo logic hiện tại. Không tự ý thay đổi cách tính xu, mua hàng hoặc phần thưởng.

## 12. Tích hợp avatar tại Profile cá nhân

Đây là yêu cầu bắt buộc, không chỉ làm giao diện pet trong Kho đồ.

Kiểm tra trang Profile cá nhân và xác định component đang hiển thị avatar người dùng.

Nếu người dùng đã chọn pet làm avatar:

- Hiển thị pet bằng `PetAvatar`.
- Lấy dữ liệu pet và `outfits` từ API.
- Hiển thị đúng trang phục đã lưu.
- Khi người dùng đổi trang phục ở Kho đồ, avatar Profile phải phản ánh diện mạo mới sau khi dữ liệu được đồng bộ.
- Khi mở lại Profile hoặc tải lại trang, phải khôi phục đúng diện mạo từ dữ liệu API.

Nếu Profile hiện đang dùng avatar ảnh thông thường, giữ nguyên cơ chế avatar hiện tại và tích hợp pet như một lựa chọn bổ sung, trừ khi sản phẩm đã có yêu cầu thay thế hoàn toàn avatar.

Không tạo riêng một bộ SVG hoặc một component ghép trang phục khác cho Profile.

Nếu có nhiều lựa chọn avatar, cần phân biệt avatar pet đang dùng và pet người chơi sở hữu. Không tự động thay đổi avatar người dùng chỉ vì dữ liệu pet được cập nhật, trừ khi đó là hành vi hiện tại của sản phẩm.

## 13. Đồng bộ dữ liệu

Luồng thay đổi trang phục:

1. Frontend tải dữ liệu pet từ API.
2. `PetRenderer` hiển thị pet mặc định và các trang phục đã lưu.
3. Người chơi chọn một món đồ trong Kho đồ.
4. Frontend xem trước bằng trạng thái tạm.
5. Người chơi bấm Mặc.
6. Frontend gọi API cập nhật ID trang phục.
7. Backend xác thực quyền sở hữu và tính tương thích.
8. Nếu thành công, frontend cập nhật dữ liệu pet dùng chung.
9. Pet tại Kho đồ và avatar Profile hiển thị cùng diện mạo.
10. Khi tải lại trang, frontend lấy dữ liệu mới nhất từ API và render lại.

Không coi trạng thái xem trước chưa lưu là dữ liệu chính thức.

## 14. Yêu cầu chất lượng và kiểm thử

- Các file SVG phải có nội dung thực tế và hiển thị được.
- Các lớp trang phục phải khớp với pet mặc định.
- Không bị lệch tọa độ khi thay đổi kích thước.
- Không render trang phục sai vị trí.
- Không lỗi khi `outfits` thiếu trường hoặc có giá trị `null`.
- Không crash khi API trả về ID trang phục không tồn tại trong registry.
- Không hiển thị vật phẩm chưa sở hữu như đã được trang bị.
- Sau khi lưu thành công, Kho đồ và Profile phải đồng bộ.
- Sau khi tải lại trang, trang phục đã lưu phải được khôi phục.
- API lỗi phải có thông báo và không làm mất trạng thái trang phục đã lưu trước đó.
- Kiểm tra pet chó, pet mèo và các vật phẩm tương thích.
- Không làm hỏng avatar thông thường của người dùng.
- Không thay đổi các chức năng khác không liên quan.

## 15. Giới hạn thay đổi

- Không lưu file SVG hoặc nội dung hình ảnh trang phục ở backend.
- Không lưu toàn bộ SVG đã ghép thành pet trong database.
- Không chuyển dữ liệu pet hoặc trang phục đang mặc sang `localStorage` làm nguồn dữ liệu chính.
- Không thay đổi schema database hiện có nếu không thực sự cần thiết.
- Không tạo API trùng với API pet hoặc kho đồ đang tồn tại.
- Không thay đổi logic đăng nhập, phân quyền, xu, EXP, nhiệm vụ hoặc các game khác.
- Không sử dụng TypeScript nếu dự án Edu Game đang dùng JavaScript/JSX.
- Không chỉ viết tài liệu hoặc tạo component placeholder; cần triển khai code và các file SVG mẫu thực tế.

## 16. Kết quả cần bàn giao

Sau khi hoàn thành:

1. Các file SVG pet mặc định cho chó và mèo.
2. Các file SVG trang phục và linh kiện mẫu.
3. Registry asset frontend ánh xạ ID sang SVG.
4. Component render pet theo nhiều lớp.
5. API service tích hợp dữ liệu pet.
6. Giao diện xem trước, mặc và tháo trang phục trong Kho đồ.
7. Avatar Profile dùng chung hệ thống render pet.
8. Dữ liệu trang phục được lưu và khôi phục qua API.
9. Kiểm thử các trường hợp chính và xử lý lỗi.
10. Báo cáo các file đã thêm/sửa, endpoint đã sử dụng và các phần backend còn thiếu nếu có.

**Ưu tiên triển khai theo thứ tự:** kiểm tra code hiện tại → tạo SVG mẫu → xây dựng component render chung → tích hợp API pet → hoàn thiện Kho đồ → tích hợp Profile → kiểm thử đồng bộ.

Không chỉ dừng ở việc đề xuất cấu trúc; hãy thực hiện tái cấu trúc trực tiếp trên code hiện tại, tận dụng tối đa những gì đã có và tránh viết lại các chức năng không liên quan.
