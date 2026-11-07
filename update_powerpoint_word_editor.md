# FEATURE: CODE-BASED DOCUMENT & PRESENTATION STUDIO
# TẠO POWERPOINT VÀ WORD BẰNG CODE TRỰC TIẾP

## 1. Mục tiêu

Hãy xây dựng một trang mới trong website học tập `educational-games`, cho phép giáo viên tạo, chỉnh sửa và xuất tài liệu học tập dưới dạng:

- PowerPoint (`.pptx`)
- Word (`.docx`)

Tên feature đề xuất:

**EduPlay Code Studio**

Đây là công cụ cho phép người dùng chỉnh sửa nội dung tài liệu bằng code và xem kết quả trực quan ngay trên giao diện.

Điểm quan trọng:

Người dùng không chỉ nhập nội dung vào form thông thường.

Người dùng sẽ:

1. Chọn PowerPoint hoặc Word.
2. Nhập nội dung ban đầu hoặc lấy nội dung từ bài học.
3. Hệ thống tự tạo code tương ứng.
4. Hiển thị code trong trình soạn thảo.
5. Người dùng sửa code theo ý muốn.
6. Paste code mới vào editor.
7. Hệ thống render lại tài liệu theo code mới.
8. Người dùng xem trước.
9. Xuất file PowerPoint hoặc Word thực tế.

Ví dụ:

Ban đầu hệ thống tạo PowerPoint gồm 5 slide.

Người dùng sửa code để:

- Thêm slide.
- Xóa slide.
- Đổi tiêu đề.
- Đổi nội dung.
- Đổi màu nền.
- Thay đổi bố cục.
- Thêm câu hỏi.
- Thêm hình ảnh.
- Thêm biểu đồ nếu hỗ trợ.

Sau khi sửa code và nhấn Apply, giao diện PowerPoint phải thay đổi theo nội dung code mới.

Tương tự đối với Word.

---

# 2. Giao diện tổng thể

Xây dựng một trang riêng trong website.

Không đặt feature này trực tiếp bên trong editor thiệp cưới.

Tận dụng hệ thống layout, sidebar, header và style hiện có của website học tập.

## 2.1. Bố cục

Giao diện chia thành 3 khu vực chính:

```text
+------------------------------------------------------------------+
| EduPlay Code Studio | Tên tài liệu | Save | Preview | Export      |
+------------------------------------------------------------------+
|                                                                  |
|  CODE EDITOR                 | DOCUMENT PREVIEW                   |
|                              |                                    |
|  1  const slides = [         |  +----------------------------+    |
|  2    {                      |  |                            |    |
|  3      title: "Bài học",    |  |       Slide 1               |    |
|  4      content: [...]       |  |                            |    |
|  5    }                      |  |                            |    |
|  6  ];                       |  +----------------------------+    |
|                              |                                    |
|  [Apply Code]                |  [Previous] [Next]                 |
|                              |                                    |
+------------------------------------------------------------------+
| Status: Code valid | 5 slides | PPTX Ready                        |
+------------------------------------------------------------------+
```

Trên desktop:

- Code editor bên trái.
- Preview bên phải.
- Có thể điều chỉnh chiều rộng hai khu vực.
- Có thể chuyển sang chế độ chỉ code hoặc chỉ preview.

Trên mobile:

- Cho phép chuyển qua lại giữa tab Code và Preview.
- Không ép hai khu vực nằm cạnh nhau.
- Code editor phải sử dụng được trên màn hình nhỏ.

---

# 3. Chọn loại tài liệu

Khi truy cập trang, hiển thị lựa chọn:

- PowerPoint.
- Word.

Có thể dùng segmented control hoặc tab.

Ví dụ:

```text
+------------------------------------+
|       Chọn loại tài liệu           |
|                                    |
|  [ PowerPoint ]   [ Word ]          |
|                                    |
|  Tạo mới hoặc nhập nội dung         |
+------------------------------------+
```

Mỗi loại tài liệu có:

- Code editor riêng.
- Preview riêng.
- Schema riêng.
- Logic export riêng.

Không dùng chung một schema không phù hợp cho cả hai loại.

---

# 4. POWERPOINT CODE EDITOR

## 4.1. Ngôn ngữ code

Sử dụng JavaScript làm ngôn ngữ mô tả nội dung PowerPoint.

Ví dụ:

```js
const presentation = {
  title: "Bảng nhân 4",
  theme: {
    primary: "#4F46E5",
    background: "#FFFFFF",
    fontFamily: "Arial"
  },
  slides: [
    {
      type: "title",
      title: "Bảng nhân 4",
      subtitle: "Toán học lớp 3"
    },
    {
      type: "content",
      title: "Kiến thức",
      content: [
        "4 × 1 = 4",
        "4 × 2 = 8",
        "4 × 3 = 12"
      ]
    },
    {
      type: "quiz",
      title: "Luyện tập",
      question: "4 × 5 = ?",
      options: ["15", "20", "25", "30"],
      answer: 1
    }
  ]
};
```

Đây là cấu trúc dữ liệu minh họa.

Hãy thiết kế schema thực tế phù hợp với hệ thống export.

Không bắt buộc sử dụng chính xác schema ví dụ nếu có phương án tốt hơn.

## 4.2. Các loại slide

Hỗ trợ tối thiểu:

- `title`: Slide tiêu đề.
- `content`: Slide nội dung.
- `image`: Slide hình ảnh.
- `quiz`: Slide câu hỏi.
- `summary`: Slide tổng kết.

Có thể mở rộng:

- `two-column`
- `comparison`
- `quote`
- `chart`
- `game`

Chỉ triển khai những loại có renderer và export tương ứng.

## 4.3. Thuộc tính slide

Mỗi slide có thể cấu hình:

- Tiêu đề.
- Nội dung.
- Màu nền.
- Hình ảnh.
- Bố cục.
- Font chữ.
- Kích thước chữ.
- Căn lề.
- Khoảng cách.
- Các thành phần con.

Không bắt buộc tất cả thuộc tính phải xuất hiện trên mọi loại slide.

## 4.4. Chỉnh sửa code

Code editor cần hỗ trợ:

- Syntax highlighting.
- Line numbers.
- Auto indentation.
- Code formatting.
- Copy.
- Paste.
- Select all.
- Undo/Redo.
- Hiển thị lỗi syntax.
- Hiển thị lỗi schema.
- Nút Apply Code.
- Nút Reset Code.

Ưu tiên sử dụng Monaco Editor nếu phù hợp với source hiện tại.

Nếu Monaco gây xung đột hoặc tăng bundle quá lớn, hãy cân nhắc CodeMirror.

Không tự xây dựng một code editor bằng textarea nếu có thể sử dụng thư viện phù hợp.

---

# 5. POWERPOINT PREVIEW

## 5.1. Mục tiêu

Preview phải hiển thị PowerPoint theo nội dung code đang được áp dụng.

Ví dụ:

Code:

```js
{
  type: "title",
  title: "Bài học mới",
  subtitle: "Toán học lớp 3"
}
```

Preview:

```text
+------------------------------------+
|                                    |
|                                    |
|          BÀI HỌC MỚI               |
|                                    |
|          Toán học lớp 3            |
|                                    |
|                                    |
+------------------------------------+
```

## 5.2. Các thao tác

Preview cần có:

- Previous slide.
- Next slide.
- Chọn slide.
- Hiển thị số slide.
- Zoom.
- Fullscreen.
- Chế độ trình chiếu nếu phù hợp.

Khi người dùng sửa code và nhấn Apply:

- Parse code.
- Validate dữ liệu.
- Cập nhật preview.
- Cập nhật số lượng slide.
- Giữ nguyên code người dùng đã sửa.

## 5.3. Xử lý lỗi

Nếu code sai:

- Không crash trang.
- Không làm mất code.
- Không thay thế preview hợp lệ bằng dữ liệu lỗi.
- Hiển thị lỗi cụ thể.
- Cho phép sửa code và Apply lại.

Ví dụ:

```text
Syntax Error

Unexpected token '}'

Line: 24

Please fix the code and try again.
```

Nếu code hợp lệ nhưng schema sai:

```text
Validation Error

Slide 2 is missing the required title field.
```

---

# 6. WORD CODE EDITOR

Word sử dụng một schema khác PowerPoint.

Không dùng cấu trúc slide cho Word.

## 6.1. Ví dụ code Word

```js
const document = {
  title: "Bài học Toán lớp 3",
  page: {
    size: "A4",
    orientation: "portrait",
    margin: {
      top: 2,
      bottom: 2,
      left: 2.5,
      right: 2.5
    }
  },
  content: [
    {
      type: "heading",
      level: 1,
      text: "Bảng nhân 4"
    },
    {
      type: "paragraph",
      text: "Hôm nay chúng ta học bảng nhân 4."
    },
    {
      type: "heading",
      level: 2,
      text: "Kiến thức"
    },
    {
      type: "list",
      items: [
        "4 × 1 = 4",
        "4 × 2 = 8",
        "4 × 3 = 12"
      ]
    },
    {
      type: "question",
      question: "4 × 5 = ?",
      options: [
        "15",
        "20",
        "25",
        "30"
      ]
    }
  ]
};
```

## 6.2. Các loại nội dung Word

Hỗ trợ tối thiểu:

- `heading`
- `paragraph`
- `list`
- `numbered-list`
- `image`
- `table`
- `question`
- `page-break`
- `quote`

Có thể mở rộng:

- `code`
- `formula`
- `chart`
- `callout`

Chỉ triển khai khi renderer và export thực tế hỗ trợ.

## 6.3. Thuộc tính Word

Cho phép cấu hình:

- Khổ giấy.
- Hướng giấy.
- Lề trang.
- Font chữ.
- Cỡ chữ.
- Màu chữ.
- Tiêu đề.
- Heading.
- Paragraph.
- Danh sách.
- Bảng.
- Hình ảnh.
- Ngắt trang.

## 6.4. Word Preview

Preview phải mô phỏng tài liệu Word theo trang giấy.

Ví dụ:

```text
+-----------------------------------+
|                                   |
|       BÀI HỌC TOÁN LỚP 3          |
|                                   |
|       Bảng nhân 4                 |
|                                   |
|       Hôm nay chúng ta học...     |
|                                   |
|       KIẾN THỨC                   |
|                                   |
|       4 × 1 = 4                   |
|       4 × 2 = 8                   |
|       4 × 3 = 12                  |
|                                   |
+-----------------------------------+
```

Yêu cầu:

- Có kích thước trang A4.
- Có lề trang.
- Có nhiều trang.
- Có page navigation.
- Có zoom.
- Có chế độ fullscreen.

Nếu nội dung dài:

- Tự chia trang theo bố cục.
- Không để nội dung tràn khỏi trang.
- Không cắt chữ.
- Không tạo khoảng trắng quá lớn.

---

# 7. CƠ CHẾ CODE → PREVIEW

Đây là phần quan trọng nhất.

Không chỉ hiển thị code cho người dùng.

Phải có cơ chế thực sự chuyển đổi code thành dữ liệu tài liệu.

Luồng:

```text
User Code
    |
    v
Parse Code
    |
    v
Validate Schema
    |
    v
Normalize Document Data
    |
    v
Render Preview
    |
    v
Export PPTX / DOCX
```

## 7.1. Không dùng eval trực tiếp

Không sử dụng:

```js
eval(userCode);
```

Không sử dụng:

```js
new Function(userCode);
```

Không thực thi code người dùng một cách tùy ý trong môi trường ứng dụng.

## 7.2. Phương án đề xuất

Sử dụng một schema JSON/JavaScript declarative.

Code editor cho phép người dùng chỉnh sửa dữ liệu tài liệu.

Có thể hỗ trợ code dạng:

```js
const presentation = {
  title: "Bài học",
  slides: []
};
```

Sau đó sử dụng parser phù hợp để đọc cấu trúc.

Ưu tiên:

- Acorn.
- Babel Parser.
- Hoặc parser phù hợp với syntax được hỗ trợ.

Chỉ cho phép một tập syntax được xác định rõ.

Không cần hỗ trợ JavaScript tùy ý như:

- Function.
- Import.
- Export.
- Fetch.
- DOM access.
- Node.js APIs.
- Browser APIs.
- Arbitrary expressions.

Nếu cần xử lý biểu thức phức tạp, hãy cân nhắc thiết kế một DSL riêng.

## 7.3. Validation

Validate:

- Loại tài liệu.
- Schema.
- Các trường bắt buộc.
- Loại phần tử.
- Kích thước dữ liệu.
- URL hình ảnh.
- Nội dung câu hỏi.
- Các giá trị màu.
- Kích thước trang.
- Các tham chiếu tài nguyên.

Nếu code không hợp lệ:

- Giữ lại code.
- Giữ lại preview trước đó.
- Hiển thị lỗi.

---

# 8. EXPORT POWERPOINT

## 8.1. Kết quả

Khi người dùng nhấn:

`Export PowerPoint`

Hệ thống phải tạo file `.pptx` thực tế.

Không chỉ tải HTML.

Không chỉ đổi đuôi file.

Không tạo một file JSON rồi đổi tên thành `.pptx`.

## 8.2. Thư viện

Ưu tiên khảo sát và sử dụng:

- PptxGenJS nếu phù hợp với môi trường frontend/backend.
- Hoặc thư viện tạo PowerPoint thực tế tương thích với project.

Không tự viết định dạng PPTX từ đầu.

## 8.3. Nội dung export

Phải tương ứng với preview:

- Số lượng slide.
- Nội dung.
- Tiêu đề.
- Hình ảnh.
- Bố cục.
- Màu nền.
- Font.
- Câu hỏi.
- Danh sách.

Nếu một thành phần chưa thể export đúng:

- Báo rõ giới hạn.
- Không âm thầm bỏ qua.
- Không báo thành công nếu file thiếu nội dung quan trọng.

## 8.4. Yêu cầu

- File mở được bằng Microsoft PowerPoint.
- File có thể chỉnh sửa trong PowerPoint.
- Không xuất thành ảnh toàn bộ slide.
- Text phải là text.
- Hình ảnh phải là image object.
- Các thành phần phải tương ứng với nội dung code.

---

# 9. EXPORT WORD

## 9.1. Kết quả

Khi người dùng nhấn:

`Export Word`

Hệ thống phải tạo file `.docx` thực tế.

Không chỉ tải HTML.

Không đổi đuôi file.

Không tạo file giả.

## 9.2. Thư viện

Ưu tiên khảo sát:

- `docx` (docx.js).
- Hoặc thư viện tạo DOCX phù hợp với project.

Nếu cần xử lý backend, hãy kiểm tra môi trường hiện tại.

Không tự thêm backend mới nếu frontend có thể thực hiện an toàn và phù hợp.

## 9.3. Nội dung export

Phải tương ứng với preview:

- Heading.
- Paragraph.
- Danh sách.
- Bảng.
- Hình ảnh.
- Page break.
- Câu hỏi.
- Font.
- Lề trang.
- Khổ giấy.

## 9.4. Yêu cầu

- File mở được bằng Microsoft Word.
- Nội dung có thể chỉnh sửa.
- Không xuất thành ảnh toàn bộ tài liệu.
- Text phải là text.
- Bảng phải là bảng.
- Heading phải có cấu trúc phù hợp.
- Không mất nội dung khi xuất.

---

# 10. LẤY NỘI DUNG TỪ WEBSITE HỌC TẬP

EduPlay Code Studio cần có khả năng lấy dữ liệu từ các nguồn hiện có.

Ví dụ:

- Bài học đã tạo.
- Bài học AI.
- Câu hỏi.
- Game HTML.
- Nội dung bài giảng.

Có thể có nút:

`Import from Lesson`

Luồng:

1. Chọn bài học.
2. Chọn nội dung muốn đưa vào tài liệu.
3. Chọn PowerPoint hoặc Word.
4. Chuyển dữ liệu sang schema tương ứng.
5. Tạo code ban đầu.
6. Render preview.
7. Cho phép sửa code.
8. Export.

Không tự lấy toàn bộ HTML của game rồi đưa vào PowerPoint.

Game HTML có thể được tham chiếu hoặc chuyển thành nội dung mô tả, hình ảnh preview, câu hỏi và hướng dẫn tùy khả năng thực tế.

---

# 11. GIAO DIỆN CHI TIẾT

## Header

- Logo EduPlay.
- Tên tài liệu.
- Loại tài liệu.
- Trạng thái.
- Import.
- Save.
- Preview.
- Export.

## Code Editor

- Monaco Editor hoặc CodeMirror.
- Line number.
- Syntax highlighting.
- Format.
- Copy.
- Paste.
- Apply.
- Reset.
- Error panel.

## Preview

- Render tài liệu.
- Zoom.
- Navigation.
- Fullscreen.
- Page/slide counter.

## Status Bar

Hiển thị:

- Code valid/invalid.
- Số slide hoặc số trang.
- Trạng thái export.
- Lỗi parser.
- Lỗi validation.

---

# 12. LƯU CODE VÀ TÀI LIỆU

Nếu website có hệ thống lưu bài học:

- Tận dụng API hiện có.
- Không tạo database riêng không cần thiết.

Có thể lưu:

- Tên tài liệu.
- Loại tài liệu.
- Source code.
- Document schema.
- Thời gian cập nhật.
- User ID.
- Trạng thái.

Khi mở lại tài liệu:

- Code được khôi phục.
- Preview được render lại.
- Người dùng tiếp tục chỉnh sửa.

Nếu chưa có API lưu tài liệu:

- Báo rõ.
- Không tự tạo dữ liệu giả.
- Có thể triển khai local draft nếu phù hợp.
- Không coi local draft là dữ liệu đã lưu trên server.

---

# 13. XỬ LÝ LỖI

Các trường hợp cần xử lý:

### Code sai syntax

Không render code mới.

Giữ code để người dùng sửa.

### Code sai schema

Hiển thị lỗi cụ thể.

Ví dụ:

```text
Slide 3:
The "title" field must be a string.
```

### Export lỗi

- Hiển thị lỗi.
- Không tạo file giả.
- Không xóa code.
- Cho phép thử lại.

### AI tạo code lỗi

- Không thực thi.
- Validate.
- Hiển thị lỗi.
- Cho phép AI tạo lại.
- Cho phép chỉnh sửa thủ công.

### Code quá lớn

Giới hạn kích thước đầu vào phù hợp.

Không để người dùng paste dữ liệu quá lớn gây treo trình duyệt.

---

# 14. AI CODE GENERATOR — TÍCH HỢP AI

Nếu website đã có AI service, hãy tích hợp.

AI có thể:

- Tạo PowerPoint từ prompt.
- Tạo Word từ prompt.
- Tạo code ban đầu.
- Chỉnh sửa code theo yêu cầu.
- Tạo thêm slide.
- Viết lại nội dung.
- Thay đổi theme.
- Tạo câu hỏi.
- Tạo tài liệu từ bài học hiện có.

Ví dụ:

```text
Tạo PowerPoint 10 slide về vòng tuần hoàn của nước.

Đối tượng: Học sinh lớp 5.

Phong cách: Minh họa khoa học, dễ hiểu.

Yêu cầu:
- Có slide giới thiệu.
- Có giải thích từng giai đoạn.
- Có hình ảnh minh họa.
- Có câu hỏi luyện tập.
- Có slide tổng kết.
```

AI tạo code ban đầu.

Người dùng có thể sửa code trực tiếp.

Nếu AI chỉnh sửa code:

- Hiển thị code mới.
- Không tự động ghi đè code hiện tại.
- Cho phép xem trước thay đổi.
- Có nút Apply.
- Có thể hoàn tác.

Không bắt buộc phải tích hợp AI ngay nếu backend hiện tại chưa sẵn sàng.

Trang Code Studio vẫn phải hoạt động với code thủ công.

---

# 15. KIỂM THỬ

## PowerPoint

- Tạo PowerPoint mới.
- Code ban đầu hiển thị.
- Sửa tiêu đề.
- Sửa nội dung.
- Thêm slide.
- Xóa slide.
- Apply.
- Preview thay đổi.
- Export PPTX.
- Mở file bằng PowerPoint.
- Kiểm tra text có thể chỉnh sửa.

## Word

- Tạo Word mới.
- Code ban đầu hiển thị.
- Sửa heading.
- Sửa paragraph.
- Thêm bảng.
- Thêm danh sách.
- Apply.
- Preview thay đổi.
- Export DOCX.
- Mở file bằng Word.
- Kiểm tra nội dung có thể chỉnh sửa.

## Lỗi

- Syntax error.
- Schema error.
- Export error.
- Code quá lớn.
- AI trả về dữ liệu sai.
- Không có kết nối backend.

## Responsive

- Desktop.
- Tablet.
- Mobile.

---

# 16. TIÊU CHÍ NGHIỆM THU

Feature chỉ được coi là hoàn thành khi:

1. Có trang Code Studio riêng.
2. Có tab PowerPoint.
3. Có tab Word.
4. Có code ban đầu.
5. Code có thể chỉnh sửa.
6. Người dùng có thể paste code mới.
7. Có nút Apply.
8. Code hợp lệ sẽ cập nhật preview.
9. Code lỗi không làm mất dữ liệu.
10. PowerPoint export ra `.pptx` thực tế.
11. Word export ra `.docx` thực tế.
12. File mở được bằng phần mềm tương ứng.
13. Nội dung file tương ứng với preview.
14. Có xử lý lỗi.
15. Không dùng eval hoặc Function để thực thi code tùy ý.
16. Không dùng dữ liệu giả để mô phỏng export.
17. Có thể lấy nội dung từ bài học hiện có nếu API hỗ trợ.

---

# 17. PROMPT THỰC HIỆN

Hãy khảo sát source hiện tại của website `educational-games` và triển khai feature EduPlay Code Studio theo tài liệu này.

Tôi muốn một trang riêng cho phép người dùng:

- Tạo PowerPoint bằng code.
- Tạo Word bằng code.
- Chỉnh sửa code trực tiếp.
- Paste code mới.
- Nhấn Apply.
- Xem preview thay đổi theo code.
- Export file thực tế.

Hãy ưu tiên tính khả thi và khả năng tái sử dụng codebase hiện tại.

Trước khi triển khai:

1. Kiểm tra frontend.
2. Kiểm tra backend.
3. Kiểm tra hệ thống bài học.
4. Kiểm tra AI service.
5. Kiểm tra thư viện đang sử dụng.
6. Đề xuất kiến trúc phù hợp.

Sau đó thực hiện MVP.

Không chỉ tạo UI.

Không tạo nút giả.

Không dùng eval.

Không đổi đuôi file để giả lập PPTX/DOCX.

Không tự tạo API không cần thiết.

Không phá vỡ các tính năng hiện tại.

Sau khi hoàn thành, hãy báo cáo:

- Các file đã sửa.
- Các file đã thêm.
- Các thư viện được sử dụng.
- Cách hoạt động của code parser.
- Cách render preview.
- Cách export PowerPoint.
- Cách export Word.
- Những giới hạn còn lại.
- Cách kiểm thử thực tế.
