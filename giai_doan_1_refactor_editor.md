Giai đoạn 1 — Word Editor

Giữ nguyên kiến trúc hiện tại: giáo viên soạn mã JSON (Normal) hoặc HTML (Beautiful) trong CodeMirror, preview A4 và file DOCX đều đi qua model trung gian. Không viết lại editor, không đổi PowerPoint, không thêm tính năng giai đoạn 2–4 (AI, mẫu thông minh, lịch sử phiên bản, PDF).

flowchart LR
  toolbar[Thanh công cụ Word]
  source[CodeMirror JSON hoặc HTML]
  model[model.js]
  preview[WordPreview A4]
  docx[wordExporter]
  toolbar --> source
  source --> model
  model --> preview
  model --> docx

Những gì đã có, không làm lại





Định dạng chữ: đậm/nghiêng/gạch, màu, font, cỡ, căn lề, danh sách, xóa một phần định dạng — FormatToolbar.jsx và textFormat.js.



Tìm trong mã nguồn (Ctrl+F) và undo trong CodeMirror — chưa có nút Hoàn tác/Làm lại.



Tự động lưu 2,5 giây, cảnh báo rời trang, nhãn “Đã lưu tự động” trên topbar — DocumentStudioEditor.jsx.



Xuất DOCX A4, lề 1440 twips (1 inch), font mặc định Arial 12pt — wordExporter.js.



Preview một trang giấy dài, font Arial, giãn dòng 1.65, lề in 18mm — modelRender.js.

1. Cấu hình trang và chữ mặc định

Thêm field tùy chọn page trên JSON Word. Tài liệu cũ không có field này giữ nguyên giao diện và file DOCX như hiện tại.

Giá trị chuẩn (nút “Đặt theo chuẩn hành chính”):





A4 dọc, lề 2 cm bốn phía



Times New Roman, 13 pt, màu đen, căn đều



Giãn dòng 1.15, khoảng cách sau đoạn 6 pt

Lưu theo tài liệu trong source (JSON page, hoặc khối <style id="docstudio-page"> khi đang ở Beautiful) để mở lại và xuất DOCX đúng. Nút “Lưu làm mặc định của tôi” ghi cấu hình vào localStorage (docstudio.wordPageDefaults). Nút “Áp dụng mặc định của tôi” ghi cấu hình đó vào tài liệu đang mở.

Mẫu thư viện có theme vẫn giữ màu và font riêng của mẫu. page chỉ áp font/cỡ/căn/giãn dòng khi tài liệu không có theme. Lề trang luôn lấy từ page nếu có.

Chỗ cần sửa: schemas.js (validate page, bỏ qua nếu thiếu), model.js (giữ page qua JSON ↔ model), modelRender.js (CSS lề, font, line-height, margin đoạn), wordExporter.js (page size, margin twips = cm × 567, default run 13 pt, spacing after 120 twips, justify). Parser HTML đọc style docstudio-page nếu có — htmlParser.js.

UI nằm trong tab Cài đặt, chỉ khi docType === "word": khổ giấy, hướng, 4 lề, font, cỡ, màu, căn, giãn dòng, khoảng sau đoạn. PowerPoint giữ nguyên tỷ lệ slide.

2. Thanh công cụ Word

Mở rộng FormatToolbar.jsx, mọi nút có title tiếng Việt. Chỉ hiện khi docType === "word".





Hoàn tác / Làm lại: gọi history CodeMirror (mục 3).



Tìm và thay thế: mở hộp mục 4.



Kiểu tiêu đề H1/H2/H3: op mới heading trong applyBlockFormat (đoạn ↔ tiêu đề, đổi level). Beautiful: bọc hoặc đổi thẻ quanh vùng chọn nếu vùng chọn nằm trọn trong một thẻ khối; nếu không, báo giáo viên chọn cả đoạn.



Giãn dòng (1 / 1.15 / 1.5 / 2) và khoảng sau đoạn (0 / 6 / 12 pt) ghi lên khối đang chọn (lineHeight, spacingAfter). Preview và DOCX đọc hai field này.



Màu chữ, màu nền, xóa định dạng: giữ nút hiện có, bổ sung tooltip còn thiếu.



Chèn (menu): bảng 3×3, ảnh (mở tab Hình ảnh), chữ ký (khối căn phải: chức danh + dòng ký + họ tên), ngày (đoạn ngày hiện tại theo vi-VN), ngắt trang (khối pageBreak → hr.page-break và PageBreak trong DOCX), số trang (footer DOCX dùng field PAGE; preview hiện dòng chân “Số trang” vì preview vẫn là một tờ dài, chưa chia nhiều trang A4 — ghi rõ trên tooltip, không giả là đã đánh số từng tờ).

Khối mới pageBreak và signature được thêm vào WORD_BLOCK_TYPES. Model cũ không có các khối này nên tài liệu cũ không đổi. Nhánh default của model không được nuốt mất hai loại này.

3. Undo / Redo

Trong CodeEditor.jsx, lộ undo(), redo(), canUndo(), canRedo() qua ref, dùng undo/redo của @codemirror/commands. Nút trên thanh Word disabled khi không còn mốc. Phím Ctrl+Z / Ctrl+Y giữ như CodeMirror. Mọi chèn và định dạng đã đi qua dispatch nên nằm trong cùng một lịch sử.

4. Tìm kiếm và thay thế





Chế độ Normal: hộp thoại tìm/thay trên nội dung, không đụng cú pháp JSON. Quét text của đoạn/tiêu đề, items của danh sách, ô rows của bảng. Thay một chỗ hoặc thay tất cả, rồi ghi lại JSON và giữ undo.



Chế độ Beautiful: nút mở panel tìm/thay sẵn có của CodeMirror (openSearchPanel), vì giáo viên đang sửa mã HTML.

File mới src/lib/documents/wordFindReplace.js.

5. Nâng cấp bảng (không gồm AI)

File mới src/lib/documents/tableOps.js, thao tác trên khối table đang chọn ở chế độ Normal:





Thêm/xóa hàng, thêm/xóa cột



Sắp xếp một cột tăng/giảm (hàng đầu là tiêu đề, không sort)



Đánh số cột STT



Tổng và trung bình một cột số, thêm một hàng kết quả



Tìm trong bảng (lọc highlight hàng khớp trong preview bằng class, không xóa dữ liệu)



Nhân bản bảng



Chia đều bề rộng cột (colWidths), xuất DOCX theo phần trăm



Lưu mẫu bảng cá nhân vào localStorage và chèn lại từ tab Thành phần

Preview bọc hàng đầu trong <thead> để in lặp tiêu đề (CSS thead đã có). DOCX đặt tableHeader cho hàng đầu.

Ở Beautiful, các nút thống kê/sắp xếp disabled, tooltip nói “Dùng ở chế độ Normal”. Chèn bảng HTML đơn giản vẫn hoạt động.

6. Tự động lưu

Giữ API documentService.update và debounce 2,5 giây. Chỉ làm rõ trạng thái trên topbar Word: Đang lưu / Đã lưu (kèm giờ) / Có thay đổi chưa lưu / Không lưu được — đang có gần đủ ở DocumentStudioEditor.jsx khoảng dòng 1440. Thêm trạng thái “Đang lưu…” khi saving. Không lưu đè khi mã nguồn lỗi (giữ quy tắc appliedStale).

Ngoài phạm vi lần này

AI Document Assistant, Smart Layout nhiều trang, kiểm tra chất lượng, biến {{school_name}}, thư viện mẫu mới, so sánh phiên bản, nhập Excel/PDF, xuất PDF. Preview vẫn một tờ dài; ngắt trang có hiệu lực khi in và trong DOCX.

Kiểm tra





Tài liệu Word JSON cũ không có page mở ra, preview và DOCX không đổi font/lề.



Đặt chuẩn hành chính → preview Times New Roman 13 pt, lề 2 cm; xuất DOCX mở lại đúng lề và cỡ chữ.



Hoàn tác/làm lại sau khi đổi tiêu đề, chèn bảng, thay chữ.



Tìm/thay không làm hỏng JSON.



Sort, tổng, STT, nhân bản bảng, lưu mẫu cá nhân, tải lại tài liệu vẫn còn bảng.



Mở một bài PowerPoint: rail, preview slide, xuất PPTX không đổi.

