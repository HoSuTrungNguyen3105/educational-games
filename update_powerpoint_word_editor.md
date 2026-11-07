# Xây dựng trang Teacher Document Studio – Soạn Word và PowerPoint cho giáo viên

## 1. Mục tiêu

Xây dựng một trang dành riêng cho giáo viên tạo tài liệu phục vụ giảng dạy học sinh.

Trang hỗ trợ hai loại tài liệu:

- Word (.docx): Giáo án, tài liệu học tập, phiếu bài tập, đề kiểm tra, tài liệu hướng dẫn.
- PowerPoint (.pptx): Slide bài giảng, bài thuyết trình, bài ôn tập và tổng kết kiến thức.

**Không liên quan đến game, hệ thống trò chơi hay hoạt động tương tác trong game.**

Điểm đặc biệt của trang là giáo viên có thể chỉnh sửa mã nguồn tài liệu và xem trước kết quả ngay trên giao diện.

## 2. Hai chế độ chỉnh sửa

### Chế độ A – HTML/CSS Editor

Cho phép giáo viên chỉnh sửa trực tiếp mã HTML/CSS để thiết kế nội dung và bố cục tài liệu.

Yêu cầu:

- Trình chỉnh sửa có syntax highlighting.
- Có số dòng.
- Hỗ trợ copy, paste, undo, redo.
- Có nút Format Code.
- Có nút Apply Changes để cập nhật preview.
- Có thông báo lỗi khi HTML/CSS không hợp lệ.
- Không làm mất nội dung đang chỉnh sửa khi xảy ra lỗi.
- Preview cập nhật theo mã nguồn mới nhất.
- Hỗ trợ template HTML/CSS mẫu cho Word và PowerPoint.

Ví dụ mã HTML:

```html
<section class="lesson-slide">
  <h1>Bài 1: Phép cộng trong phạm vi 100</h1>

  <p class="lesson-description">
    Học sinh hiểu và thực hiện được phép cộng
    hai số có hai chữ số.
  </p>

  <ul>
    <li>Nhận biết các thành phần của phép cộng.</li>
    <li>Thực hiện phép cộng có nhớ.</li>
    <li>Giải bài toán thực tế.</li>
  </ul>
</section>
```

CSS:

```css
.lesson-slide {
  font-family: Arial, sans-serif;
  padding: 32px;
  color: #1f2937;
}

.lesson-slide h1 {
  color: #2563eb;
  font-size: 28px;
}

.lesson-description {
  font-size: 18px;
  line-height: 1.6;
}
```

### Chế độ B – JSON Editor

Cho phép giáo viên chỉnh sửa nội dung tài liệu bằng JSON có cấu trúc.

JSON cần được thiết kế theo từng loại tài liệu.

Ví dụ JSON cho PowerPoint:

```json
{
  "type": "presentation",
  "title": "Bài 1: Phép cộng trong phạm vi 100",
  "subject": "Toán",
  "grade": 2,
  "slides": [
    {
      "type": "title",
      "title": "Phép cộng trong phạm vi 100",
      "subtitle": "Toán lớp 2"
    },
    {
      "type": "content",
      "title": "Mục tiêu bài học",
      "content": [
        "Nhận biết các thành phần của phép cộng.",
        "Thực hiện phép cộng có nhớ.",
        "Giải bài toán thực tế."
      ]
    },
    {
      "type": "content",
      "title": "Ví dụ",
      "content": [
        "35 + 27 = ?",
        "35 + 20 = 55",
        "55 + 7 = 62"
      ]
    }
  ]
}
```

Yêu cầu:

- Kiểm tra JSON syntax.
- Validate dữ liệu theo schema.
- Có thông báo lỗi cụ thể.
- Có nút Format JSON.
- Có nút Apply Changes.
- Preview cập nhật khi JSON hợp lệ.
- Giữ lại preview gần nhất nếu JSON mới bị lỗi.
- Có thể tạo JSON mẫu cho Word và PowerPoint.

## 3. Giao diện Teacher Document Studio

Thiết kế giao diện hiện đại, dễ sử dụng, phù hợp với giáo viên.

### Thanh công cụ phía trên

Bao gồm:

- Tên tài liệu.
- Chọn loại tài liệu: Word / PowerPoint.
- Chọn chế độ: HTML/CSS / JSON.
- Nút Preview.
- Nút Save.
- Nút Export Word hoặc Export PowerPoint.

### Khu vực chỉnh sửa

Chia thành hai khu vực:

**Bên trái – Code Editor**

- Hiển thị mã nguồn tài liệu.
- Có thể chỉnh sửa trực tiếp.
- Có thể paste mã nguồn từ bên ngoài.
- Có syntax highlighting.
- Có nút Format Code.
- Có nút Apply Changes.

**Bên phải – Live Preview**

- Hiển thị tài liệu sau khi render.
- Preview phải phản ánh chính xác nội dung mã nguồn hợp lệ.
- Có thể zoom in/out.
- Có thể chuyển sang chế độ toàn màn hình.
- Với PowerPoint, preview theo từng slide.
- Với Word, preview theo trang giấy.

Có thể cho phép kéo thanh phân chia giữa editor và preview để thay đổi kích thước hai khu vực.

## 4. Preview PowerPoint

Khi chọn PowerPoint:

- Hiển thị slide hiện tại.
- Có danh sách thumbnail các slide.
- Cho phép chuyển slide trước/sau.
- Có thể chọn slide trực tiếp từ danh sách.
- Preview theo tỷ lệ 16:9 hoặc 4:3.
- Có thể thêm, xóa, sắp xếp slide.
- Có thể chỉnh sửa mã nguồn của toàn bộ bài thuyết trình.
- Khi mã nguồn thay đổi và hợp lệ, nội dung preview cập nhật.

Các loại slide cơ bản:

- Title Slide.
- Content Slide.
- Image Slide.
- Two-column Slide.
- Table Slide.
- Summary Slide.

## 5. Preview Word

Khi chọn Word:

- Hiển thị tài liệu theo khổ giấy A4.
- Có lề trang.
- Có thể xem nhiều trang.
- Hỗ trợ heading, paragraph, list, table, image.
- Hiển thị phân trang hợp lý.
- Cho phép zoom.
- Preview phản ánh nội dung HTML/CSS hoặc JSON mới nhất.

Các loại nội dung cơ bản:

- Tiêu đề tài liệu.
- Tiêu đề chương/mục.
- Đoạn văn.
- Danh sách có thứ tự.
- Danh sách không thứ tự.
- Bảng biểu.
- Hình ảnh.
- Header và Footer.

## 6. Xuất file Word và PowerPoint

### Xuất Word

Tạo file `.docx` thực sự, có thể mở và chỉnh sửa bằng Microsoft Word.

Yêu cầu:

- Giữ lại nội dung.
- Giữ lại tiêu đề, đoạn văn, danh sách và bảng biểu.
- Giữ lại hình ảnh nếu có.
- Cố gắng giữ lại bố cục, font chữ, màu sắc và khoảng cách.
- Không chỉ đổi đuôi HTML hoặc JSON thành `.docx`.
- Không xuất tài liệu dưới dạng một ảnh duy nhất.

### Xuất PowerPoint

Tạo file `.pptx` thực sự, có thể mở và chỉnh sửa bằng Microsoft PowerPoint.

Yêu cầu:

- Mỗi slide được xuất thành một slide PowerPoint.
- Nội dung text phải có thể chỉnh sửa.
- Hình ảnh phải được giữ lại.
- Bố cục phải tương đồng với preview.
- Hỗ trợ các loại slide đã định nghĩa.
- Không chỉ đổi đuôi HTML hoặc JSON thành `.pptx`.
- Không xuất toàn bộ slide thành ảnh duy nhất.

## 7. Xử lý HTML/CSS khi xuất

HTML/CSS có khả năng thiết kế rất linh hoạt, nhưng không phải mọi thuộc tính CSS đều có thể chuyển chính xác thành Word hoặc PowerPoint.

Vì vậy:

- Xây dựng bộ chuyển đổi HTML/CSS sang cấu trúc tài liệu.
- Hỗ trợ các thành phần phổ biến: heading, paragraph, list, table, image, background, font, color, spacing.
- Với CSS không hỗ trợ, hiển thị cảnh báo.
- Không âm thầm bỏ qua các nội dung quan trọng.
- Không chạy JavaScript tùy ý trong mã nguồn của giáo viên.
- Preview HTML phải được sandbox an toàn.

Đối với PowerPoint, cần chuyển HTML thành cấu trúc slide có các thành phần text, image, shape và table phù hợp.

## 8. Kiến trúc đề xuất

Tách riêng các phần:

```text
TeacherDocumentStudio/
├── components/
│   ├── DocumentToolbar
│   ├── CodeEditor
│   ├── LivePreview
│   ├── WordPreview
│   ├── PowerPointPreview
│   ├── SlideThumbnailList
│   └── ExportActions
├── editors/
│   ├── HtmlCssEditor
│   └── JsonEditor
├── parsers/
│   ├── htmlParser
│   └── jsonParser
├── renderers/
│   ├── WordRenderer
│   └── PowerPointRenderer
├── exporters/
│   ├── WordExporter
│   └── PowerPointExporter
└── schemas/
    ├── wordSchema
    └── presentationSchema
```

Có thể điều chỉnh cấu trúc theo kiến trúc hiện tại của dự án.

Không tạo thêm các file hoặc service trùng lặp nếu dự án đã có chức năng tương tự.

## 9. Công nghệ đề xuất

Tùy thuộc vào công nghệ đang có trong dự án:

- Code Editor: Monaco Editor hoặc CodeMirror.
- Word Export: `docx` hoặc thư viện tương đương.
- PowerPoint Export: `pptxgenjs` hoặc thư viện tương đương.
- HTML Preview: iframe sandbox.
- JSON Validation: JSON Schema hoặc cơ chế validate phù hợp.

Trước khi cài thư viện mới, kiểm tra package hiện tại để tránh xung đột dependency.

## 10. Lưu tài liệu

Mỗi tài liệu cần lưu được:

- Tên tài liệu.
- Loại tài liệu: Word hoặc PowerPoint.
- Chế độ chỉnh sửa: HTML/CSS hoặc JSON.
- Mã nguồn hiện tại.
- Thời gian tạo.
- Thời gian cập nhật.
- Giáo viên sở hữu tài liệu.

Khi mở lại tài liệu, hệ thống phải khôi phục đúng mã nguồn và preview tương ứng.

## 11. Yêu cầu quan trọng

- Không liên quan đến game.
- Không xây dựng hệ thống trò chơi.
- Không xây dựng tính năng tương tác dành cho học sinh trong game.
- Đây là công cụ giáo viên tạo tài liệu để giảng bài.
- Ưu tiên tái sử dụng cấu trúc và thư viện hiện có.
- Không phá vỡ các chức năng đang hoạt động.
- Không sử dụng `eval()` hoặc `new Function()` để chạy mã nguồn giáo viên.
- Không làm mất nội dung khi parse hoặc export gặp lỗi.
- Không xuất file giả bằng cách đổi đuôi.
- Giao diện phải responsive.
- Code phải dễ bảo trì và có thể mở rộng.

## 12. Tiêu chí hoàn thành

1. Giáo viên có thể tạo tài liệu Word.
2. Giáo viên có thể tạo tài liệu PowerPoint.
3. Có thể chuyển giữa chế độ HTML/CSS và JSON.
4. Có thể chỉnh sửa mã nguồn trực tiếp.
5. Có thể paste mã nguồn mới.
6. Preview cập nhật theo mã nguồn hợp lệ.
7. Có thông báo lỗi khi mã nguồn không hợp lệ.
8. Có thể lưu và mở lại tài liệu.
9. Có thể tải file `.docx` thực sự.
10. Có thể tải file `.pptx` thực sự.
11. File xuất có nội dung chỉnh sửa được trong Word/PowerPoint.
12. Không ảnh hưởng đến các chức năng hiện có của dự án.
