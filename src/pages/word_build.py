from docx import Document
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

def set_font(run, size=13, bold=False):
    run.font.name = 'Times New Roman'
    run.font.size = Pt(size)
    run.bold = bold
    run._element.rPr.rFonts.set(qn('w:eastAsia'), 'Times New Roman')

def add_page_break(doc):
    doc.add_page_break()

def add_heading_text(doc, text, level=1):
    p = doc.add_paragraph()
    run = p.add_run(text)
    if level == 1:
        set_font(run, size=16, bold=True)
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    elif level == 2:
        set_font(run, size=14, bold=True)
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    elif level == 3:
        set_font(run, size=13, bold=True)
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    return p

def add_paragraph_text(doc, text, first_line_indent=True):
    p = doc.add_paragraph()
    run = p.add_run(text)
    set_font(run, size=13)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if first_line_indent:
        p.paragraph_format.first_line_indent = Cm(1.27)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.5
    return p

doc = Document()

# ================= TRANG BÌA (TỪ FILE 2) =================
# Thêm khung viền cho trang bìa
section = doc.sections[0]
pBdr = OxmlElement('w:pBdr')
section._sectPr.append(pBdr) # (Đây là cách đơn giản, để tạo khung viền kép đẹp nhất bạn nên tự kẻ trong Word sau khi tạo)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("ĐẠI HỌC ĐÀ NẴNG\nTRƯỜNG ĐẠI HỌC SƯ PHẠM\n---o0o---")
set_font(run, size=14, bold=True)

doc.add_paragraph() # Dòng trống

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("HỒ SƠ THỰC TẬP")
set_font(run, size=24, bold=True)

doc.add_paragraph() # Dòng trống chờ chèn ảnh Logo

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("[Chèn Logo Trường ĐH Sư Phạm - ĐH Đà Nẵng vào đây]")
set_font(run, size=12)

doc.add_paragraph() # Dòng trống

# Thông tin giáo sinh
info_lines = [
    ("Giáo sinh", "PHAN THỊ Ý NHỊ"),
    ("Ngành đào tạo", "GIÁO DỤC TIỂU HỌC"),
    ("Khóa", "2022"),
    ("Giáo viên hướng dẫn:", "TRẦN THỊ HIỀN"),
    ("", "ĐẶNG THỊ TỐ NỮ")
]

for label, value in info_lines:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(f"{label}\t: {value}" if label else f"\t  {value}")
    set_font(run, size=14, bold=True)

doc.add_paragraph()
doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("Hồ sơ bao gồm:\n1. Kế hoạch bài dạy\n2. Kế hoạch chủ nhiệm\n3. Phiếu dự giờ giảng dạy")
set_font(run, size=14, bold=True)

doc.add_paragraph()
doc.add_paragraph()
doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("Đà Nẵng, tháng 10 năm 2026")
set_font(run, size=14, bold=True)

add_page_break(doc)

# ================= TRANG 2: MỤC LỤC =================
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("MỤC LỤC")
set_font(run, size=16, bold=True)

# Thêm field tự động tạo mục lục
paragraph = doc.add_paragraph()
run = paragraph.add_run()
fldChar = OxmlElement('w:fldChar')
fldChar.set(qn('w:fldCharType'), 'begin')
instrText = OxmlElement('w:instrText')
instrText.set(qn('xml:space'), 'preserve')
instrText.text = 'TOC \\o "1-3" \\h \\z \\u'
fldChar2 = OxmlElement('w:fldChar')
fldChar2.set(qn('w:fldCharType'), 'separate')
fldChar3 = OxmlElement('w:fldChar')
fldChar3.set(qn('w:fldCharType'), 'end')
run._r.append(fldChar)
run._r.append(instrText)
run._r.append(fldChar2)
run._r.append(fldChar3)

add_page_break(doc)

# ================= NỘI DUNG FILE 1 =================
add_heading_text(doc, "LỜI CẢM ƠN", 1)
add_paragraph_text(doc, "Trong quá trình thực hiện bài tiểu luận với đề tài “Phân tích đặc điểm, điểm mạnh – điểm yếu và bài học kinh nghiệm từ quốc tế đối với Việt Nam; mục tiêu và ý nghĩa của giáo dục STEM đối với học sinh tiểu học”, em đã có cơ hội hệ thống lại những kiến thức về giáo dục STEM, đồng thời tìm hiểu sâu hơn về ý nghĩa của cách tiếp cận này đối với việc dạy học ở cấp tiểu học.")
add_paragraph_text(doc, "Em xin gửi lời cảm ơn đến quý thầy cô đã cung cấp kiến thức và định hướng học tập trong quá trình học phần. Những nội dung được tiếp thu là cơ sở để em tìm hiểu vấn đề, xây dựng lập luận và liên hệ với thực tiễn giáo dục tiểu học.")
add_paragraph_text(doc, "Em cũng xin cảm ơn tác giả tài liệu “Thiết kế chủ đề giáo dục STEM ở trường tiểu học” cùng các tác giả, cơ quan có tài liệu được sử dụng trong quá trình nghiên cứu. Các tài liệu này giúp em có thêm căn cứ để hiểu rõ hơn về khái niệm, mục tiêu, vai trò và cách tổ chức giáo dục STEM.")
add_paragraph_text(doc, "Do kiến thức và kinh nghiệm nghiên cứu của bản thân còn hạn chế, bài tiểu luận khó tránh khỏi những thiếu sót. Em mong nhận được ý kiến góp ý của quý thầy cô để có thể hoàn thiện nhận thức và nâng cao khả năng nghiên cứu trong thời gian tới.")
add_paragraph_text(doc, "Em xin chân thành cảm ơn!")
add_page_break(doc)

add_heading_text(doc, "DANH MỤC CHỮ VIẾT TẮT", 1)
# Bảng viết tắt
table = doc.add_table(rows=5, cols=2)
table.style = 'Table Grid'
headers = ["Chữ viết tắt", "Nội dung"]
for i, header in enumerate(headers):
    cell = table.cell(0, i)
    cell.text = header
    cell.paragraphs[0].runs[0].bold = True
data = [
    ("STEM", "Science – Technology – Engineering – Mathematics (Khoa học – Công nghệ – Kĩ thuật – Toán học)"),
    ("HS", "Học sinh"),
    ("GV", "Giáo viên"),
    ("GDPT", "Giáo dục phổ thông")
]
for row_idx, (col1, col2) in enumerate(data, start=1):
    table.cell(row_idx, 0).text = col1
    table.cell(row_idx, 1).text = col2
add_page_break(doc)

add_heading_text(doc, "PHẦN MỞ ĐẦU", 1)
add_heading_text(doc, "1. Lý do chọn đề tài", 2)
add_paragraph_text(doc, "Những thay đổi nhanh chóng của khoa học, công nghệ và đời sống xã hội đặt ra yêu cầu mới đối với giáo dục. Nhà trường không chỉ giúp học sinh ghi nhớ kiến thức mà còn cần tạo điều kiện để các em biết sử dụng kiến thức đó trong những tình huống cụ thể, biết trao đổi với người khác, tìm cách giải quyết vấn đề và điều chỉnh cách làm khi kết quả chưa phù hợp. Yêu cầu này đặc biệt có ý nghĩa ở cấp tiểu học, bởi đây là giai đoạn học sinh hình thành những nền tảng đầu tiên về cách học, cách suy nghĩ và thái độ đối với việc khám phá thế giới.")
add_paragraph_text(doc, "Giáo dục STEM là một hướng tiếp cận có thể góp phần đáp ứng yêu cầu trên. STEM kết nối Khoa học, Công nghệ, Kĩ thuật và Toán học trong những nhiệm vụ có ý nghĩa thực tiễn. Thay vì chỉ tiếp nhận kiến thức qua lời giảng, học sinh được quan sát, đặt câu hỏi, đề xuất ý tưởng, lựa chọn vật liệu, thực hành, thử nghiệm và chia sẻ kết quả. Qua quá trình đó, kiến thức trong các môn học có cơ hội được sử dụng một cách tự nhiên và có mục đích.")
add_paragraph_text(doc, "Tài liệu “Thiết kế chủ đề giáo dục STEM ở trường tiểu học” trình bày kinh nghiệm triển khai STEM tại một số quốc gia như Hoa Kỳ, Pháp và Anh; đồng thời làm rõ mục tiêu, vai trò và các hình thức tổ chức STEM ở Việt Nam. Những nội dung này gợi ra hai vấn đề cần xem xét: Việt Nam có thể học hỏi điều gì từ kinh nghiệm quốc tế và giáo dục STEM đem lại ý nghĩa như thế nào đối với học sinh tiểu học. Vì vậy, em chọn đề tài này để phân tích cơ sở lý luận, đối chiếu kinh nghiệm quốc tế và làm rõ giá trị của giáo dục STEM trong quá trình phát triển phẩm chất, năng lực học sinh.")

add_heading_text(doc, "2. Mục đích nghiên cứu", 2)
add_paragraph_text(doc, "Bài tiểu luận nhằm làm rõ một số đặc điểm trong cách tiếp cận giáo dục STEM ở Hoa Kỳ, Pháp và Anh; phân tích những điểm mạnh được thể hiện trong tài liệu, nhận diện các thách thức cần lưu ý khi triển khai và rút ra bài học phù hợp với điều kiện Việt Nam. Bài viết đồng thời hệ thống hóa mục tiêu và ý nghĩa của giáo dục STEM đối với học sinh tiểu học, đặc biệt ở phương diện phát triển năng lực, phẩm chất và khả năng vận dụng kiến thức vào thực tiễn.")

add_heading_text(doc, "3. Đối tượng và phạm vi nghiên cứu", 2)
add_paragraph_text(doc, "Đối tượng nghiên cứu là giáo dục STEM ở cấp tiểu học. Phạm vi phân tích tập trung vào những nội dung về giáo dục STEM trên thế giới và ở Việt Nam được trình bày trong tài liệu “Thiết kế chủ đề giáo dục STEM ở trường tiểu học”, nhất là kinh nghiệm tại Hoa Kỳ, Pháp, Anh; mục tiêu và vai trò của STEM đối với học sinh tiểu học. Các nhận định về điểm yếu hoặc thách thức được trình bày thận trọng, phân biệt giữa thông tin có trong tài liệu và phân tích của người viết.")

add_heading_text(doc, "4. Phương pháp nghiên cứu", 2)
add_paragraph_text(doc, "Bài viết sử dụng phương pháp phân tích và tổng hợp tài liệu để xác định các luận điểm chính; phương pháp so sánh để đối chiếu những đặc điểm được nêu ở ba quốc gia; phương pháp khái quát hóa để rút ra bài học tham khảo cho Việt Nam; đồng thời sử dụng liên hệ thực tiễn thông qua ví dụ về chủ đề “Dụng cụ gấp áo” ở tiểu học.")

add_heading_text(doc, "5. Bố cục bài tiểu luận", 2)
add_paragraph_text(doc, "Ngoài phần mở đầu, kết luận và tài liệu tham khảo, nội dung chính gồm ba chương. Chương 1 trình bày cơ sở lý luận về giáo dục STEM ở tiểu học. Chương 2 phân tích kinh nghiệm quốc tế, điểm mạnh, những thách thức cần lưu ý và bài học đối với Việt Nam. Chương 3 tập trung làm rõ mục tiêu và ý nghĩa của giáo dục STEM đối với học sinh tiểu học.")

add_page_break(doc)

# CHƯƠNG 1
add_heading_text(doc, "CHƯƠNG 1. CƠ SỞ LÝ LUẬN VỀ GIÁO DỤC STEM Ở TIỂU HỌC", 1)
add_heading_text(doc, "1.1. Khái niệm giáo dục STEM", 2)
add_paragraph_text(doc, "STEM là thuật ngữ được ghép từ chữ cái đầu của bốn từ tiếng Anh: Science (Khoa học), Technology (Công nghệ), Engineering (Kĩ thuật) và Mathematics (Toán học). Trong giáo dục, STEM thường được hiểu là cách tiếp cận dạy học tích hợp, trong đó học sinh huy động kiến thức và kĩ năng thuộc các lĩnh vực này để tìm hiểu hoặc giải quyết một vấn đề thực tiễn. Điểm quan trọng không nằm ở việc đưa tên của bốn lĩnh vực vào cùng một bài học, mà ở chỗ học sinh có cơ hội sử dụng kiến thức liên quan để hoàn thành một nhiệm vụ có ý nghĩa.")
add_paragraph_text(doc, "Theo tài liệu được sử dụng, giáo dục STEM không nhất thiết là một môn học riêng biệt trong chương trình phổ thông, cũng không nên đồng nhất với một phương pháp dạy học đơn lẻ. STEM có thể được lồng ghép trong dạy học các môn học, hoạt động trải nghiệm, câu lạc bộ hoặc hoạt động nghiên cứu khoa học, kĩ thuật ở mức độ phù hợp. Hình thức triển khai có thể khác nhau giữa các quốc gia và nhà trường, nhưng điểm chung là tăng cơ hội để học sinh vận dụng kiến thức, khám phá và giải quyết vấn đề.")
add_paragraph_text(doc, "Ở cấp tiểu học, hoạt động STEM cần được thiết kế vừa sức, gắn với những điều học sinh có thể quan sát và trải nghiệm. Các nhiệm vụ không nhất thiết phải sử dụng thiết bị phức tạp. Một sản phẩm đơn giản làm từ bìa, giấy, que gỗ hoặc vật liệu tái sử dụng vẫn có thể trở thành hoạt động STEM nếu học sinh phải vận dụng kiến thức, lựa chọn cách làm, thử nghiệm và giải thích kết quả.")

add_heading_text(doc, "1.2. Những đặc điểm cơ bản của giáo dục STEM ở tiểu học", 2)
add_heading_text(doc, "1.2.1. Tích hợp kiến thức và kĩ năng của nhiều lĩnh vực", 3)
add_paragraph_text(doc, "Một đặc điểm nổi bật của STEM là tạo mối liên hệ giữa các môn học. Trong một nhiệm vụ thiết kế sản phẩm, học sinh có thể cần dùng Toán để đo và tính toán, kiến thức Khoa học để giải thích hiện tượng, hiểu biết Công nghệ để lựa chọn vật liệu hoặc dụng cụ, và quy trình Kĩ thuật để thiết kế, lắp ráp, thử nghiệm sản phẩm. Việc tích hợp phải xuất phát từ vấn đề cần giải quyết, không nên gượng ép đưa quá nhiều kiến thức vào một hoạt động.")
add_heading_text(doc, "1.2.2. Gắn học tập với thực tiễn", 3)
add_paragraph_text(doc, "Các chủ đề STEM thường bắt đầu từ tình huống gần gũi với cuộc sống ở gia đình, trường học hoặc cộng đồng. Khi thấy kiến thức có thể giúp giải quyết một việc cụ thể, học sinh dễ nhận ra ý nghĩa của điều mình học. Tình huống thực tiễn cũng tạo ra nhu cầu đặt câu hỏi, tìm thông tin và lựa chọn cách làm, thay vì chỉ chờ giáo viên cung cấp đáp án.")
add_heading_text(doc, "1.2.3. Đề cao thực hành, trải nghiệm và quá trình thiết kế", 3)
add_paragraph_text(doc, "Trong hoạt động STEM, học sinh có thể quan sát, tìm hiểu kiến thức nền, đề xuất giải pháp, thiết kế, chế tạo, thử nghiệm, trao đổi và điều chỉnh sản phẩm. Sản phẩm đầu tiên không nhất thiết phải hoàn hảo. Điều đáng chú ý là học sinh biết xem xét kết quả, tìm nguyên nhân khi sản phẩm chưa đáp ứng yêu cầu và thử cách cải tiến. Giáo viên cần dành thời gian cho quá trình này, thay vì chỉ chú trọng hình thức của sản phẩm cuối cùng.")
add_heading_text(doc, "1.2.4. Phát huy tính chủ động và hợp tác của học sinh", 3)
add_paragraph_text(doc, "Học sinh được khuyến khích nêu ý tưởng, đặt câu hỏi, giải thích lựa chọn và tham gia quyết định trong nhóm. Các em có thể đảm nhận những nhiệm vụ khác nhau như đo đạc, ghi chép, lắp ráp, kiểm tra hoặc trình bày kết quả. Khi làm việc cùng nhau, học sinh học cách lắng nghe, phân công, thống nhất phương án và chịu trách nhiệm với phần việc được giao.")
add_heading_text(doc, "1.2.5. Phù hợp với lứa tuổi và sự khác biệt giữa học sinh", 3)
add_paragraph_text(doc, "Học sinh tiểu học có sự khác nhau về khả năng, sở thích, nhịp độ học tập và kinh nghiệm sống. Vì vậy, giáo viên cần lựa chọn nhiệm vụ vừa sức, có hướng dẫn rõ ràng và cho phép nhiều cách giải quyết. Tài liệu nhấn mạnh khả năng phân hóa trong giáo dục STEM: học sinh có thể đóng góp theo thể mạnh riêng, lựa chọn cách thể hiện sản phẩm và được hỗ trợ dựa trên mức độ tiến bộ của bản thân.")

add_heading_text(doc, "1.3. Các hình thức tổ chức giáo dục STEM ở tiểu học", 2)
add_paragraph_text(doc, "Tài liệu phân biệt ba hình thức chính: bài học STEM, hoạt động trải nghiệm STEM và hoạt động nghiên cứu khoa học, kĩ thuật. Bài học STEM được tổ chức trong quá trình dạy học môn học, dưới sự hướng dẫn của giáo viên, nhằm giúp học sinh vận dụng kiến thức để giải quyết vấn đề thực tiễn. Hoạt động trải nghiệm STEM có thể được thực hiện qua câu lạc bộ hoặc các hoạt động trải nghiệm, tạo cơ hội khám phá ứng dụng khoa học và công nghệ. Hoạt động nghiên cứu khoa học, kĩ thuật ở cấp tiểu học cần ở mức khởi đầu, khuyến khích học sinh quan sát, nêu câu hỏi, hình thành giả thuyết đơn giản, thực hiện khảo sát hoặc thí nghiệm và trình bày kết quả.")
add_paragraph_text(doc, "Ba hình thức này có thể hỗ trợ lẫn nhau nhưng không hoàn toàn giống nhau về mục tiêu và cách tổ chức. Khi lựa chọn hình thức, nhà trường cần căn cứ vào mục tiêu giáo dục, thời lượng, điều kiện tổ chức và nhu cầu của học sinh. Điều cốt yếu là bảo đảm hoạt động có mục đích học tập rõ ràng, an toàn và phù hợp với lứa tuổi.")

add_heading_text(doc, "1.4. Tiêu kết chương 1", 2)
add_paragraph_text(doc, "Giáo dục STEM ở tiểu học là cách tiếp cận tích hợp, tạo điều kiện để học sinh sử dụng kiến thức và kĩ năng trong những tình huống thực tiễn. Đặc điểm của STEM thể hiện ở sự kết nối giữa các lĩnh vực, việc học thông qua trải nghiệm, thiết kế và thử nghiệm, cũng như vai trò chủ động của học sinh. Những đặc điểm này là cơ sở để xem xét kinh nghiệm quốc tế và phân tích mục tiêu, ý nghĩa của STEM đối với học sinh tiểu học.")

add_page_break(doc)

# CHƯƠNG 2
add_heading_text(doc, "CHƯƠNG 2. KINH NGHIỆM GIÁO DỤC STEM QUỐC TẾ VÀ BÀI HỌC ĐỐI VỚI VIỆT NAM", 1)
add_heading_text(doc, "2.1. Khái quát kinh nghiệm quốc tế theo tài liệu", 2)
add_paragraph_text(doc, "Tài liệu “Thiết kế chủ đề giáo dục STEM ở trường tiểu học” cho thấy nhiều quốc gia quan tâm đến việc tăng hứng thú và năng lực khoa học của học sinh. Tuy cách tổ chức khác nhau, các ví dụ được nêu đều cho thấy giáo dục STEM không chỉ là vấn đề lựa chọn nội dung bài học, mà còn liên quan đến định hướng chương trình, năng lực giáo viên, hoạt động trải nghiệm và điều kiện hỗ trợ dạy học. Trong phạm vi tài liệu, Hoa Kỳ, Pháp và Anh là ba trường hợp tiêu biểu để xem xét.")

add_heading_text(doc, "2.2. Đặc điểm giáo dục STEM tại Hoa Kỳ", 2)
add_paragraph_text(doc, "Theo tài liệu, giáo dục STEM ở Hoa Kỳ không phải là một vấn đề hoàn toàn mới, nhưng nhận được sự quan tâm lớn ở cấp quốc gia thông qua các quy định và định hướng chính sách. Ba nội dung được nhấn mạnh gồm xây dựng chương trình STEM trong hệ thống giáo dục 12 năm một cách nghiêm túc; cải thiện việc dạy và học STEM trên phạm vi toàn quốc; và hỗ trợ những mô hình phù hợp nhằm bảo đảm học sinh có các kĩ năng STEM khi hoàn thành chương trình học. Tài liệu cũng đề cập chiến lược nâng cao yêu cầu về Toán học và Khoa học đối với học sinh tốt nghiệp.")
add_paragraph_text(doc, "Điểm đáng chú ý trong cách tiếp cận được mô tả là tính hệ thống. STEM không chỉ được xem như một hoạt động riêng lẻ do từng giáo viên tự tổ chức, mà gắn với mục tiêu rộng hơn của chương trình giáo dục. Việc hướng đến tất cả học sinh cũng cho thấy STEM không nên chỉ dành cho nhóm học sinh có thành tích cao hoặc sẵn có hứng thú với khoa học. Khi vận dụng kinh nghiệm này, Việt Nam có thể chú ý hơn đến tính liên tục của hoạt động STEM trong chương trình và cơ hội tham gia của nhiều nhóm học sinh.")
add_paragraph_text(doc, "Tuy nhiên, phần tài liệu được sử dụng không cung cấp số liệu để đánh giá mức độ thành công của từng chính sách tại Hoa Kỳ, cũng không phân tích đầy đủ những khó khăn mà các trường gặp phải. Vì vậy, có thể nhận diện định hướng và điểm nổi bật nêu trên, nhưng chưa đủ căn cứ để kết luận rằng mọi trường học tại Hoa Kỳ đều triển khai STEM đồng đều hoặc đạt hiệu quả như nhau.")

add_heading_text(doc, "2.3. Đặc điểm giáo dục STEM tại Pháp", 2)
add_paragraph_text(doc, "Tài liệu nêu rằng giáo dục STEM ở Pháp được đề cập ở nhiều cấp học. Trong giai đoạn chính của bậc tiểu học, học sinh học Toán, Khoa học tự nhiên và Công nghệ; bên cạnh đó, các em tham gia hoạt động trải nghiệm nhằm tăng sự quan tâm đến Khoa học và Công nghệ, đồng thời phát triển tư duy phê phán.")
add_paragraph_text(doc, "Điểm đáng lưu ý là sự kết hợp giữa kiến thức môn học và hoạt động trải nghiệm. Ở lứa tuổi tiểu học, học sinh thường dễ tiếp cận các khái niệm khi được quan sát hiện tượng, thực hiện thao tác hoặc giải thích điều mình nhìn thấy. Hoạt động trải nghiệm còn tạo cơ hội để các em kiểm tra suy nghĩ ban đầu và xem xét bằng chứng trước khi đưa ra kết luận. Đây là hướng tham khảo phù hợp với yêu cầu dạy học phát triển năng lực.")
add_paragraph_text(doc, "Dù vậy, tài liệu không đưa ra số liệu cụ thể về kết quả học tập, mức đầu tư hoặc sự khác biệt giữa các địa phương ở Pháp. Do đó, việc đánh giá ưu điểm của mô hình cần giới hạn ở những đặc điểm đã được mô tả, không suy rộng thành kết luận về toàn bộ hệ thống giáo dục.")

add_heading_text(doc, "2.4. Đặc điểm giáo dục STEM tại Anh", 2)
add_paragraph_text(doc, "Theo tài liệu, giáo dục STEM ở Anh được phát triển thành chương trình hành động hướng đến việc tạo nguồn nhân lực nghiên cứu khoa học chất lượng cao. Bốn nội dung chính được nêu gồm tuyển dụng giáo viên giảng dạy STEM; bồi dưỡng, nâng cao trình độ giáo viên; cải tiến và làm phong phú chương trình trong và ngoài lớp; phát triển cơ sở vật chất hỗ trợ dạy học.")
add_paragraph_text(doc, "Một điểm cần lưu ý trong cách tổ chức tại Anh là quan niệm về dạy học tích hợp. Tài liệu giải thích rằng tích hợp không có nghĩa một giáo viên phải dạy nhiều môn cùng lúc. Thay vào đó, giáo viên thuộc các môn khác nhau có thể phối hợp xây dựng bài học để học sinh vận dụng kiến thức và kĩ năng từ nhiều lĩnh vực nhằm giải quyết một vấn đề. Cách hiểu này giúp tránh việc tích hợp chỉ dừng ở hình thức hoặc tạo gánh nặng không cần thiết cho một giáo viên.")
add_paragraph_text(doc, "Trường hợp Anh cho thấy giáo dục STEM cần sự chuẩn bị đồng bộ: giáo viên có năng lực, chương trình có nội dung phù hợp và nhà trường có điều kiện tổ chức. Nếu chỉ yêu cầu giáo viên triển khai hoạt động STEM mà không có thời gian phối hợp, cơ hội bồi dưỡng hoặc nguồn lực cần thiết, mục tiêu tích hợp sẽ khó đạt được đầy đủ.")

add_heading_text(doc, "2.5. Điểm mạnh thể hiện qua các kinh nghiệm quốc tế", 2)
add_heading_text(doc, "2.5.1. Có định hướng ở cấp hệ thống", 3)
add_paragraph_text(doc, "Ví dụ Hoa Kỳ và Anh trong tài liệu cho thấy STEM được đặt trong những định hướng và chương trình có phạm vi rộng. Điều này có ý nghĩa vì hoạt động STEM đòi hỏi sự nhất quán giữa mục tiêu, nội dung dạy học, năng lực giáo viên và điều kiện tổ chức. Khi có định hướng chung, nhà trường có cơ sở xây dựng kế hoạch dài hạn thay vì tổ chức các hoạt động rời rạc theo từng đợt.")
add_heading_text(doc, "2.5.2. Gắn kiến thức với trải nghiệm và ứng dụng", 3)
add_paragraph_text(doc, "Trường hợp Pháp nhấn mạnh hoạt động trải nghiệm bên cạnh việc học Toán, Khoa học tự nhiên và Công nghệ. Đây là điểm mạnh đáng tham khảo ở cấp tiểu học, vì trải nghiệm tạo cơ hội để học sinh quan sát, thử nghiệm và trao đổi về hiện tượng thực tế. Học sinh không chỉ trả lời câu hỏi theo mẫu mà còn có thể tự nhận ra điều cần tìm hiểu và giải thích kết quả bằng ngôn ngữ của mình.")
add_heading_text(doc, "2.5.3. Chú trọng giáo viên và sự phối hợp liên môn", 3)
add_paragraph_text(doc, "Kinh nghiệm Anh nhắn mạnh việc tuyển dụng, bồi dưỡng giáo viên và phối hợp giữa các môn học. Đây là điều kiện quan trọng để STEM được triển khai đúng bản chất. Giáo viên cần hiểu mục tiêu của chủ đề, biết chọn kiến thức cốt lõi và tổ chức cho học sinh vận dụng kiến thức đó. Sự phối hợp giữa giáo viên giúp việc tích hợp có cơ sở chuyên môn, tránh tình trạng đưa nhiều nội dung vào bài học nhưng không liên kết với vấn đề cần giải quyết.")
add_heading_text(doc, "2.5.4. Quan tâm đến điều kiện học tập và cơ hội tham gia", 3)
add_paragraph_text(doc, "Tài liệu đề cập việc phát triển cơ sở vật chất tại Anh và định hướng ở Hoa Kỳ nhằm bảo đảm học sinh có những kĩ năng STEM cần thiết. Những điểm này gợi ý rằng hoạt động STEM cần được xem là một phần của quá trình giáo dục, không nên phụ thuộc hoàn toàn vào khả năng tự xoay xở của từng giáo viên. Đồng thời, mục tiêu hướng tới mọi học sinh đặt ra yêu cầu thiết kế nhiệm vụ phù hợp với những khả năng khác nhau.")

add_heading_text(doc, "2.6. Điểm yếu và những thách thức cần lưu ý", 2)
add_paragraph_text(doc, "Tài liệu chính trình bày các định hướng và đặc điểm của giáo dục STEM tại Hoa Kỳ, Pháp và Anh, nhưng không cung cấp một bảng đánh giá trực tiếp về điểm yếu của từng quốc gia. Vì vậy, không thể khẳng định dựa trên tài liệu này rằng một quốc gia cụ thể có hạn chế nào đó ở quy mô toàn hệ thống. Tuy nhiên, từ những điều kiện được tài liệu nhấn mạnh, có thể nhận diện một số thách thức cần xem xét khi tổ chức giáo dục STEM nói chung.")
add_heading_text(doc, "2.6.1. Yêu cầu về năng lực và thời gian của giáo viên", 3)
add_paragraph_text(doc, "STEM đòi hỏi giáo viên lựa chọn kiến thức từ các lĩnh vực liên quan, xác định vấn đề phù hợp, chuẩn bị vật liệu, thiết kế nhiệm vụ và đánh giá cả quá trình thực hiện. Nếu giáo viên chưa được bồi dưỡng đầy đủ hoặc thiếu thời gian phối hợp, hoạt động dễ bị thu hẹp thành việc làm sản phẩm mà chưa làm rõ kiến thức cần học. Đây là thách thức có thể dự liệu từ yêu cầu về tuyển dụng, bồi dưỡng và hợp tác giáo viên được tài liệu nhấn mạnh; không phải kết luận riêng về một quốc gia.")
add_heading_text(doc, "2.6.2. Sự khác biệt về nguồn lực", 3)
add_paragraph_text(doc, "Các hoạt động STEM có thể cần vật liệu, không gian, dụng cụ và thời gian để thử nghiệm. Điều kiện giữa các trường có thể khác nhau, vì vậy việc lựa chọn chủ đề không thể tách rời nguồn lực thực tế. Nếu hoạt động phụ thuộc vào thiết bị đất tiền hoặc sự hỗ trợ lớn từ gia đình, cơ hội tham gia của học sinh có thể không đồng đều. Tài liệu cũng gợi ý nên sử dụng vật liệu dễ gia công, dễ tiếp cận và có chi phí tối thiểu để nhiều học sinh có thể thực hiện.")
add_heading_text(doc, "2.6.3. Khó khăn trong đánh giá kết quả", 3)
add_paragraph_text(doc, "Sản phẩm đẹp chưa chắc thể hiện đầy đủ quá trình học tập. Trong STEM, giáo viên cần quan sát cách học sinh nêu ý tưởng, vận dụng kiến thức, hợp tác, thử nghiệm và điều chỉnh. Nếu chỉ chấm điểm sản phẩm cuối cùng, những đóng góp của từng học sinh hoặc những tiến bộ trong quá trình thực hiện có thể bị bỏ qua. Vì vậy, cần có tiêu chí đánh giá rõ ràng và phù hợp với mục tiêu của từng chủ đề.")
add_heading_text(doc, "2.6.4. Nguy cơ triển khai hình thức", 3)
add_paragraph_text(doc, "Khi STEM được hiểu đơn giản là hoạt động lắp ráp hoặc trang trí sản phẩm, mối liên hệ giữa kiến thức và vấn đề thực tiễn có thể trở nên mờ nhạt. Một hoạt động chỉ thực sự có ý nghĩa STEM khi học sinh cần huy động kiến thức, đưa ra lựa chọn và xem xét kết quả. Do đó, giáo viên cần bắt đầu từ mục tiêu học tập và vấn đề cần giải quyết, sau đó mới quyết định sản phẩm hoặc vật liệu.")

# Bảng so sánh (giản lược text)
add_heading_text(doc, "2.7. So sánh kinh nghiệm Hoa Kỳ, Pháp và Anh", 2)
add_paragraph_text(doc, "Bảng so sánh dưới đây chỉ tổng hợp những đặc điểm được tài liệu đề cập, không phải bảng xếp hạng hiệu quả giáo dục giữa các quốc gia. Tài liệu chưa cung cấp dữ liệu định lượng để xác định quốc gia nào đạt kết quả cao hơn hoặc có ít hạn chế hơn.")
# (Có thể thêm bảng Table ở đây nếu muốn, nhưng để code gọn tôi xin phép tóm tắt)
add_paragraph_text(doc, "- Hoa Kỳ: Quan tâm ở cấp quốc gia; chú trọng chương trình STEM, cải thiện dạy học và bảo đảm học sinh có kĩ năng STEM. -> Định hướng hệ thống và mục tiêu hướng đến nhiều học sinh. Lưu ý: Cần có kế hoạch dài hạn, đồng thời xem xét điều kiện thực tế của từng trường.")
add_paragraph_text(doc, "- Pháp: STEM xuất hiện ở nhiều cấp học; học sinh tiểu học học Toán, Khoa học tự nhiên, Công nghệ và tham gia trải nghiệm. -> Kết hợp kiến thức môn học với trải nghiệm và phát triển tư duy phê phán. Lưu ý: Chọn hoạt động vừa sức, gắn với hiện tượng gần gũi và mục tiêu bài học.")
add_paragraph_text(doc, "- Anh: Chú trọng tuyển dụng, bồi dưỡng giáo viên, phối hợp liên môn, cải tiến chương trình và phát triển cơ sở vật chất. -> Nhấn mạnh vai trò giáo viên, phối hợp chuyên môn và điều kiện triển khai. Lưu ý: Bố trí thời gian phối hợp, bồi dưỡng và nguồn lực phù hợp.")

add_heading_text(doc, "2.8. Bối cảnh và định hướng giáo dục STEM ở Việt Nam", 2)
add_paragraph_text(doc, "Tài liệu đặt giáo dục STEM ở Việt Nam trong bối cảnh công nghiệp hóa, hiện đại hóa, hội nhập quốc tế và tác động của Cách mạng công nghiệp lần thứ tư. Sự phát triển của công nghệ làm thay đổi đời sống và hoạt động sản xuất, đồng thời đặt ra yêu cầu chuẩn bị cho người học những năng lực có thể sử dụng trong các tình huống mới. Vì thế, đổi mới giáo dục không chỉ là thay đổi nội dung kiến thức mà còn cần thay đổi cách tổ chức dạy học và đánh giá.")
add_paragraph_text(doc, "Tài liệu liên hệ giáo dục STEM với định hướng đổi mới căn bản, toàn diện giáo dục, chuyển từ việc chủ yếu cung cấp kiến thức sang chú trọng hình thành phẩm chất, năng lực, phát huy tính tích cực, chủ động và sáng tạo của học sinh. Trong bối cảnh Chương trình giáo dục phổ thông 2018, STEM có thể hỗ trợ việc kết nối các môn học và tạo cơ hội vận dụng kiến thức trong những vấn đề thực tiễn.")
add_paragraph_text(doc, "Ở tiểu học, tài liệu đề cập bài học STEM trong chương trình, hoạt động trải nghiệm STEM và hoạt động nghiên cứu khoa học, kĩ thuật ở mức độ phù hợp. Vật liệu dễ tìm, dễ gia công, chi phí thấp và có thể tái sử dụng được khuyến khích để bảo đảm học sinh có cơ hội tham gia. Việc phối hợp với gia đình, tổ chức giáo dục, cơ sở giáo dục nghề nghiệp cũng được xem là nguồn hỗ trợ cần thiết.")

add_heading_text(doc, "2.9. Bài học kinh nghiệm đối với Việt Nam", 2)
add_heading_text(doc, "2.9.1. Triển khai STEM gắn với mục tiêu chương trình", 3)
add_paragraph_text(doc, "Bài học đầu tiên là cần xác định rõ học sinh sẽ học được gì từ mỗi chủ đề. Không nên tổ chức STEM chỉ vì muốn có sản phẩm trưng bày hoặc một hoạt động mới lạ. Chủ đề cần gắn với yêu cầu cần đạt của chương trình, lựa chọn một số kiến thức trọng tâm và xây dựng nhiệm vụ giúp học sinh vận dụng kiến thức đó. Cách làm này giúp giáo viên giữ được trọng tâm học tập và tránh tình trạng hoạt động thực hành tách rời nội dung môn học.")
add_heading_text(doc, "2.9.2. Bồi dưỡng giáo viên và tăng cường phối hợp", 3)
add_paragraph_text(doc, "Kinh nghiệm được mô tả ở Anh cho thấy giáo viên giữ vai trò then chốt trong việc triển khai STEM. Việt Nam cần tạo điều kiện để giáo viên hiểu bản chất của STEM, thực hành thiết kế chủ đề và chia sẻ kinh nghiệm tổ chức lớp học. Ở những chủ đề có nhiều lĩnh vực liên quan, giáo viên có thể cùng trao đổi để xác định kiến thức phù hợp, phân công phần việc và thống nhất cách đánh giá. Điều này không có nghĩa mọi bài học đều cần một nhóm giáo viên đông người; mức độ phối hợp cần tương xứng với yêu cầu của chủ đề.")
add_heading_text(doc, "2.9.3. Lựa chọn vấn đề gần gũi, sử dụng vật liệu dễ tiếp cận", 3)
add_paragraph_text(doc, "Với học sinh tiểu học, những vấn đề từ gia đình, lớp học, sân trường hoặc môi trường xung quanh thường dễ tạo hứng thú. Giáo viên có thể chọn các nhiệm vụ như thiết kế dụng cụ sắp xếp đồ dùng, tạo mô hình che mưa cho vật nhỏ hoặc làm dụng cụ gắp áo. Vật liệu không nhất thiết phải đắt tiền; bìa, giấy, que gỗ, dây và vật liệu tái sử dụng có thể phù hợp nếu an toàn. Cần cân nhắc trước về độ bền, kích thước, khả năng thao tác và cách thu dọn sau hoạt động.")
add_heading_text(doc, "2.9.4. Đánh giá quá trình, không chỉ đánh giá sản phẩm", 3)
add_paragraph_text(doc, "Giáo viên nên quan sát cách học sinh xác định vấn đề, đưa ra ý tưởng, sử dụng kiến thức, phối hợp với bạn, thử nghiệm và điều chỉnh. Sản phẩm cuối cùng là một minh chứng, nhưng không phải minh chứng duy nhất. Có thể kết hợp phiếu quan sát, câu hỏi phản hồi, phần trình bày của nhóm và tự đánh giá của học sinh. Tiêu chí cần được thông báo rõ để học sinh hiểu điều gì được coi trọng.")
add_heading_text(doc, "2.9.5. Bảo đảm cơ hội tham gia cho mọi học sinh", 3)
add_paragraph_text(doc, "Không nên thiết kế hoạt động theo cách chỉ một vài học sinh khéo tay hoặc có nhiều điều kiện ở nhà mới có thể hoàn thành. Giáo viên cần phân chia nhiệm vụ để mỗi em có việc cụ thể, đồng thời cho phép nhiều cách tạo ra sản phẩm đáp ứng cùng yêu cầu. Nếu cần vật liệu, nên ưu tiên phương án nhà trường có thể chuẩn bị hoặc sử dụng vật liệu phổ biến, tránh đặt gánh nặng chi phí lên gia đình.")
add_heading_text(doc, "2.9.6. Kết nối nhà trường với gia đình và cộng đồng", 3)
add_paragraph_text(doc, "Hoạt động STEM có thể được mở rộng thông qua câu lạc bộ, ngày hội, tham quan hoặc sự hỗ trợ của các tổ chức phù hợp. Tuy nhiên, sự kết nối cần phục vụ mục tiêu học tập chứ không chỉ nhằm tổ chức sự kiện. Nhà trường cần xác định rõ nhiệm vụ, yêu cầu an toàn, vai trò của người hỗ trợ và cách học sinh phản ánh điều đã học sau hoạt động.")
add_heading_text(doc, "2.9.7. Điều chỉnh theo điều kiện địa phương", 3)
add_paragraph_text(doc, "Kinh nghiệm quốc tế nên được xem là nguồn tham khảo, không phải khuôn mẫu áp dụng nguyên trạng. Mỗi trường có điều kiện cơ sở vật chất, thời lượng, đội ngũ và đặc điểm học sinh khác nhau. Vì vậy, có thể bắt đầu từ những chủ đề nhỏ, dễ tổ chức, rút kinh nghiệm sau mỗi lần thực hiện rồi mở rộng dần. Cách triển khai từng bước giúp giáo viên và học sinh làm quen với quy trình STEM mà không tạo áp lực vượt quá khả năng.")

add_heading_text(doc, "2.10. Tiêu kết chương 2", 2)
add_paragraph_text(doc, "Các ví dụ về Hoa Kỳ, Pháp và Anh trong tài liệu cho thấy giáo dục STEM có thể được phát triển thông qua định hướng chương trình, hoạt động trải nghiệm, bồi dưỡng giáo viên, phối hợp liên môn và đầu tư điều kiện dạy học. Tài liệu chưa đưa ra đánh giá trực tiếp, có hệ thống về điểm yếu của từng quốc gia, nên bài viết chỉ xác định những thách thức chung cần lưu ý thay vì đưa ra kết luận thiếu căn cứ. Đối với Việt Nam, bài học quan trọng là triển khai STEM phải gắn với mục tiêu chương trình, phù hợp điều kiện thực tế, coi trọng vai trò giáo viên và bảo đảm học sinh được tham gia vào quá trình tìm tòi, thử nghiệm và điều chỉnh.")

add_page_break(doc)

# CHƯƠNG 3
add_heading_text(doc, "CHƯƠNG 3. MỤC TIÊU VÀ Ý NGHĨA CỦA GIÁO DỤC STEM ĐỐI VỚI HỌC SINH TIỂU HỌC", 1)
add_heading_text(doc, "3.1. Mục tiêu của giáo dục STEM ở tiểu học", 2)
add_paragraph_text(doc, "Theo tài liệu “Thiết kế chủ đề giáo dục STEM ở trường tiểu học”, mục tiêu của giáo dục STEM ở giai đoạn giáo dục cơ bản, đặc biệt ở cấp tiểu học, là tạo cơ hội để học sinh tích hợp kiến thức và kĩ năng từ các môn học liên quan. Ở lớp 1 đến lớp 3, nội dung Tự nhiên và Xã hội có thể kết nối với Toán, Mĩ thuật, Tin học và Công nghệ; ở lớp 4 và lớp 5, môn Khoa học có thể tham gia vào sự kết nối đó. Học sinh vận dụng kiến thức đã học để giải quyết vấn đề thực tiễn được đặt ra trong chủ đề.")
add_paragraph_text(doc, "Mục tiêu này không yêu cầu học sinh tiểu học phải tạo ra phát minh phức tạp hay có kiến thức chuyên sâu như người lớn. Điều quan trọng là các em được làm quen với cách học có tìm tòi: nhận ra vấn đề, đặt câu hỏi, đề xuất cách giải quyết, thực hiện nhiệm vụ, xem xét kết quả và trình bày điều mình đã khám phá. Qua đó, học sinh có thêm trải nghiệm về cuộc sống và hiểu biết ban đầu về một số nghề nghiệp liên quan đến STEM.")

add_heading_text(doc, "3.2. Phát triển năng lực chung", 2)
add_heading_text(doc, "3.2.1. Năng lực tự chủ và tự học", 3)
add_paragraph_text(doc, "Trong hoạt động STEM, học sinh có cơ hội tự đọc hướng dẫn, quan sát vật liệu, tìm thông tin cần thiết và thực hiện một phần nhiệm vụ theo kế hoạch. Khi gặp khó khăn, các em được khuyến khích xem lại yêu cầu, hỏi đúng vấn đề hoặc thử một cách làm khác. Những trải nghiệm này giúp học sinh từng bước hình thành thói quen chủ động trong học tập, biết nhận ra điều mình chưa hiểu và tìm cách khắc phục với sự hỗ trợ phù hợp của giáo viên.")
add_heading_text(doc, "3.2.2. Năng lực giao tiếp và hợp tác", 3)
add_paragraph_text(doc, "Nhiều nhiệm vụ STEM được tổ chức theo nhóm. Học sinh cần trao đổi ý tưởng, giải thích lựa chọn, phân công công việc và cùng kiểm tra kết quả. Khi trình bày sản phẩm, các em luyện cách diễn đạt có trình tự, lắng nghe câu hỏi và phản hồi ý kiến của bạn. Việc hợp tác có ý nghĩa nhất khi mỗi học sinh đều có nhiệm vụ cụ thể, thay vì một em làm toàn bộ còn các em khác chỉ đứng xem.")
add_heading_text(doc, "3.2.3. Năng lực giải quyết vấn đề và sáng tạo", 3)
add_paragraph_text(doc, "STEM tạo cơ hội để học sinh đi từ một tình huống có vấn đề đến giải pháp có thể thử nghiệm. Trong quá trình đó, các em cần xác định yêu cầu, cân nhắc vật liệu, dự kiến cách thực hiện và đánh giá xem sản phẩm có đáp ứng yêu cầu hay không. Một giải pháp chưa thành công không nhất thiết là thất bại hoàn toàn; nếu học sinh biết dựa vào kết quả để điều chỉnh, các em đang học cách giải quyết vấn đề bằng suy nghĩ có căn cứ.")

add_heading_text(doc, "3.3. Phát triển năng lực đặc thù", 2)
add_heading_text(doc, "3.3.1. Năng lực toán học", 3)
add_paragraph_text(doc, "Các hoạt động STEM tạo cơ hội để học sinh sử dụng Toán trong những việc cụ thể như đếm, đo độ dài, so sánh kích thước, tính toán đơn giản, nhận dạng hình và ghi lại dữ liệu. Khi đo một tấm bìa để làm sản phẩm, học sinh nhận ra rằng kết quả đo có ảnh hưởng đến việc các bộ phận có khớp với nhau hay không. Kiến thức toán học nhờ đó được sử dụng như công cụ để giải quyết nhiệm vụ, thay vì chỉ xuất hiện trong bài tập trên giấy.")
add_heading_text(doc, "3.3.2. Năng lực khoa học", 3)
add_paragraph_text(doc, "Học sinh được quan sát hiện tượng tự nhiên hoặc kết quả của một thử nghiệm, mô tả điều nhìn thấy, đặt câu hỏi và so sánh kết quả giữa các lần thực hiện. Ở cấp tiểu học, yêu cầu cần phù hợp lứa tuổi; các em chưa cần thực hiện nghiên cứu phức tạp nhưng có thể học cách dựa vào bằng chứng để giải thích một hiện tượng đơn giản. Giáo viên cần khuyến khích học sinh phân biệt điều mình quan sát được với điều mình dự đoán.")
add_heading_text(doc, "3.3.3. Năng lực công nghệ và tin học", 3)
add_paragraph_text(doc, "Khi lựa chọn vật liệu, dụng cụ hoặc cách sử dụng thiết bị, học sinh bước đầu hiểu rằng công nghệ gắn với việc đáp ứng nhu cầu của con người. Ở mức phù hợp với lớp học, các em có thể làm quen với việc sử dụng công cụ an toàn, tìm kiếm thông tin dưới sự hướng dẫn và trình bày kết quả bằng phương tiện số khi có điều kiện. Tài liệu cũng đề cập việc học sinh từ lớp 3 trở đi bước đầu hình thành tư duy giải quyết vấn đề có sự hỗ trợ của máy tính.")
add_heading_text(doc, "3.3.4. Năng lực thẩm mĩ và ngôn ngữ", 3)
add_paragraph_text(doc, "Một sản phẩm STEM có thể cần lựa chọn màu sắc, bổ cục, hình dáng và cách trình bày phù hợp. Những thao tác này tạo cơ hội vận dụng năng lực thẩm mĩ. Bên cạnh đó, học sinh phải đọc yêu cầu, trao đổi với bạn, ghi chép và thuyết trình. Tài liệu nhấn mạnh rằng ngôn ngữ có vai trò quan trọng trong hoạt động STEM, dù Tiếng Việt không phải là một trong bốn thành tố của STEM. Hoạt động STEM vì vậy cũng tạo cơ hội để học sinh luyện diễn đạt, trình bày thông tin và giải thích ý tưởng.")

add_heading_text(doc, "3.4. Góp phần hình thành phẩm chất", 2)
add_paragraph_text(doc, "Giáo dục STEM tạo ra những tình huống cụ thể để học sinh thể hiện trách nhiệm với phần việc của mình và hỗ trợ các thành viên khác hoàn thành nhiệm vụ chung. Khi phải thực hiện nhiều bước, các em có cơ hội rèn tính chăm chỉ và kiên trì. Khi ghi lại kết quả thử nghiệm, học sinh cần trung thực với những gì đã xảy ra, kể cả khi sản phẩm không hoạt động như dự kiến. Khi làm việc nhóm, các em học cách tôn trọng ý kiến khác biệt và chia sẻ dụng cụ, vật liệu.")
add_paragraph_text(doc, "Những phẩm chất này không tự hình thành chỉ vì học sinh được tham gia một hoạt động chế tạo sản phẩm. Giáo viên cần tạo tình huống phù hợp, nêu yêu cầu rõ ràng, quan sát hành vi và trao đổi với học sinh sau hoạt động. Chẳng hạn, nếu một nhóm gặp lỗi khi thử nghiệm, giáo viên có thể hỏi nhóm đã quan sát được điều gì và cần điều chỉnh ra sao, thay vì chỉ tìm người chịu lỗi. Cách phản hồi này giúp học sinh coi trọng sự trung thực và nỗ lực cải tiến.")

add_heading_text(doc, "3.5. Nâng cao hứng thú học tập và bước đầu định hướng nghề nghiệp", 2)
add_paragraph_text(doc, "Một ý nghĩa được tài liệu nhấn mạnh là giáo dục STEM góp phần tăng hứng thú học tập đối với các môn học thuộc lĩnh vực STEM. Khi học sinh thấy kiến thức có thể giúp tạo ra một vật dụng, giải thích hiện tượng hoặc giải quyết một khó khăn gần gũi, các em có thêm lý do để tìm hiểu. Hoạt động trải nghiệm còn giúp học sinh nhận biết rằng khoa học và công nghệ không chỉ có trong sách vở mà hiện diện trong đời sống hằng ngày.")
add_paragraph_text(doc, "Ở cấp tiểu học, định hướng nghề nghiệp cần được hiểu là bước đầu làm quen với thế giới nghề nghiệp, không phải yêu cầu học sinh phải lựa chọn nghề từ sớm. Qua hoạt động thiết kế, xây dựng, đo đạc hoặc quan sát hiện tượng, học sinh có thể nhận biết sơ bộ công việc của người làm khoa học, kĩ thuật, công nghệ và những lĩnh vực liên quan. Trải nghiệm như vậy giúp các em mở rộng hiểu biết và nhận ra sở thích của bản thân.")

add_heading_text(doc, "3.6. Tạo cơ hội phát triển theo năng lực và sở thích cá nhân", 2)
add_paragraph_text(doc, "Tài liệu đề cập mối liên hệ giữa giáo dục STEM và dạy học phân hóa. Vì mỗi học sinh có khả năng, sở thích và nhịp độ học tập khác nhau, giáo viên cần thiết kế nhiệm vụ có nhiều cách thực hiện hoặc nhiều hình thức trình bày. Trong cùng một nhóm, có học sinh mạnh về đo đạc, có em khéo tay, có em diễn đạt tốt hoặc có khả năng nêu ý tưởng. Nếu được phân công hợp lý, mỗi em đều có thể đóng góp vào kết quả chung.")
add_paragraph_text(doc, "Cách tổ chức này giúp giáo viên tránh đánh giá học sinh chỉ qua độ đẹp của sản phẩm. Một học sinh có thể đóng góp quan trọng bằng việc phát hiện sai số đo, ghi lại kết quả thử nghiệm hoặc giải thích vì sao cần thay đổi thiết kế. Việc nhìn nhận nhiều dạng đóng góp giúp hoạt động STEM có tính bao quát hơn và tạo cơ hội để học sinh tiến bộ từ điểm xuất phát của mình.")

add_heading_text(doc, "3.7. Minh họa qua chủ đề “Dụng cụ gấp áo”", 2)
add_paragraph_text(doc, "Chủ đề “Dụng cụ gấp áo” có thể được sử dụng để minh họa cách giáo dục STEM kết nối kiến thức với một nhu cầu quen thuộc. Nhiệm vụ đặt ra là thiết kế một dụng cụ đơn giản giúp gấp áo thuận tiện và tương đối đồng đều. Học sinh có thể quan sát cách gấp áo bằng tay, thảo luận về những khó khăn thường gặp và đề xuất hình dạng của dụng cụ.")
add_paragraph_text(doc, "Về Toán học, học sinh nhận dạng hình vuông, hình chữ nhật, đo độ dài và xem xét kích thước của các phần bìa. Về Công nghệ và Kĩ thuật, các em lựa chọn vật liệu phù hợp, phác thảo thiết kế, cắt hoặc ghép các phần theo hướng dẫn an toàn, sau đó thử dùng dụng cụ để gấp áo. Về Mĩ thuật, học sinh có thể sắp xếp bổ cục, lựa chọn màu sắc hoặc trình bày sản phẩm. Trong quá trình làm việc, các em cần phân công nhiệm vụ, ghi lại kết quả và giải thích điều gì cần thay đổi khi áo chưa được gấp đều.")
add_paragraph_text(doc, "Giá trị học tập không chỉ nằm ở việc hoàn thành dụng cụ. Nếu các phần bìa quá nhỏ hoặc không gặp được như dự kiến, học sinh có thể đo lại, xem xét vị trí ghép và thử điều chỉnh. Giáo viên có thể yêu cầu các nhóm trình bày cách thiết kế, điều các em đã thử và lý do chọn phương án cuối cùng. Qua đó, học sinh vận dụng kiến thức Toán, thực hành thao tác kĩ thuật, trao đổi trong nhóm và rèn tính kiên trì.")
add_paragraph_text(doc, "Ví dụ này cũng cho thấy cần cân đối yêu cầu với lứa tuổi và điều kiện lớp học. Giáo viên phải chuẩn bị vật liệu an toàn, hướng dẫn việc sử dụng kéo hoặc dụng cụ cắt, đồng thời cho phép các nhóm tạo sản phẩm khác nhau nếu vẫn đáp ứng yêu cầu. Không nên đánh giá chỉ dựa vào việc sản phẩm có giống một mẫu có sẵn hay không; cần quan tâm đến cách học sinh giải thích và cải tiến sản phẩm.")

add_heading_text(doc, "3.8. Điều kiện để giáo dục STEM phát huy ý nghĩa", 2)
add_paragraph_text(doc, "Để giáo dục STEM thực sự hỗ trợ học sinh phát triển, trước hết giáo viên cần xác định mục tiêu học tập cụ thể và chọn vấn đề phù hợp với chương trình. Chủ đề nên có yêu cầu vừa sức, cho phép học sinh sử dụng kiến thức đã học và có thời gian để thử nghiệm. Nếu nhiệm vụ quá khó hoặc quá rộng, học sinh dễ phụ thuộc vào người lớn; nếu quá đơn giản, hoạt động có thể không tạo ra nhu cầu suy nghĩ.")
add_paragraph_text(doc, "Thứ hai, điều kiện vật liệu và thiết bị cần phù hợp với nguồn lực của nhà trường. Vật liệu phổ biến, dễ gia công và có thể tái sử dụng thường là lựa chọn thiết thực. Thứ ba, giáo viên cần tổ chức phân công nhiệm vụ để mỗi học sinh có cơ hội tham gia, đồng thời bảo đảm an toàn trong mọi thao tác. Thứ tư, việc đánh giá nên kết hợp quan sát quá trình, trao đổi, sản phẩm và phần tự nhận xét của học sinh.")
add_paragraph_text(doc, "Cuối cùng, nhà trường cần tạo điều kiện cho giáo viên trao đổi kinh nghiệm và phối hợp với gia đình, cộng đồng khi phù hợp. Sự hỗ trợ bên ngoài có thể làm phong phú trải nghiệm nhưng không nên thay thế vai trò thiết kế và hướng dẫn của giáo viên. Khi các điều kiện trên được quan tâm, hoạt động STEM mới có thể trở thành cơ hội học tập có ý nghĩa cho học sinh tiểu học.")

add_heading_text(doc, "3.9. Tiêu kết chương 3", 2)
add_paragraph_text(doc, "Giáo dục STEM ở tiểu học hướng tới việc tạo cơ hội cho học sinh tích hợp kiến thức và kĩ năng để giải quyết vấn đề thực tiễn. Qua hoạt động STEM, học sinh có thể phát triển các năng lực chung, năng lực đặc thù, phẩm chất, hứng thú học tập và hiểu biết ban đầu về nghề nghiệp. Những kết quả này phụ thuộc vào cách thiết kế nhiệm vụ, vai trò hướng dẫn của giáo viên, điều kiện tổ chức và việc đánh giá quá trình học tập, chứ không tự xuất hiện chỉ từ việc tạo ra một sản phẩm.")

add_page_break(doc)

# KẾT LUẬN
add_heading_text(doc, "KẾT LUẬN", 1)
add_paragraph_text(doc, "Qua việc tìm hiểu tài liệu “Thiết kế chủ đề giáo dục STEM ở trường tiểu học”, có thể thấy giáo dục STEM là một cách tiếp cận dạy học tích hợp, tạo điều kiện để học sinh huy động kiến thức Khoa học, Công nghệ, Kĩ thuật và Toán học vào việc giải quyết những vấn đề thực tiễn. Ở cấp tiểu học, cách tiếp cận này cần được tổ chức phù hợp với lứa tuổi, gắn với trải nghiệm gần gũi và dành chỗ cho học sinh quan sát, thử nghiệm, trao đổi, điều chỉnh và trình bày kết quả.")
add_paragraph_text(doc, "Kinh nghiệm được tài liệu mô tả tại Hoa Kỳ, Pháp và Anh cho thấy những hướng triển khai đáng tham khảo. Hoa Kỳ nhấn mạnh định hướng chương trình và mục tiêu phát triển kĩ năng STEM cho học sinh; Pháp chú trọng kết hợp kiến thức môn học với hoạt động trải nghiệm; Anh quan tâm đến giáo viên, phối hợp liên môn, chương trình và cơ sở vật chất. Mỗi kinh nghiệm gợi ra một khía cạnh cần quan tâm khi phát triển STEM tại Việt Nam. Tuy nhiên, tài liệu không cung cấp đánh giá đầy đủ về điểm yếu của từng quốc gia, vì vậy không nên đưa ra kết luận so sánh vượt quá những thông tin hiện có.")
add_paragraph_text(doc, "Đối với Việt Nam, việc vận dụng kinh nghiệm quốc tế cần gắn với mục tiêu của Chương trình giáo dục phổ thông 2018 và điều kiện cụ thể của từng nhà trường. Giáo viên cần được bồi dưỡng, có cơ hội phối hợp chuyên môn và được hỗ trợ về thời gian, vật liệu cũng như cách đánh giá. Chủ đề nên gần gũi, an toàn, có chi phí phù hợp và tạo cơ hội tham gia cho tất cả học sinh. Đánh giá cần coi trọng quá trình suy nghĩ, hợp tác và cải tiến bên cạnh sản phẩm cuối cùng.")
add_paragraph_text(doc, "Về mục tiêu và ý nghĩa, giáo dục STEM góp phần phát triển năng lực tự chủ và tự học, giao tiếp và hợp tác, giải quyết vấn đề và sáng tạo; đồng thời tạo cơ hội phát triển năng lực toán học, khoa học, công nghệ, tin học, thẩm mĩ và ngôn ngữ. Các hoạt động còn giúp học sinh rèn luyện trách nhiệm, chăm chỉ, trung thực và kiên trì, tăng hứng thú học tập, bước đầu hiểu biết về nghề nghiệp liên quan đến STEM. Ví dụ “Dụng cụ gấp áo” cho thấy một vấn đề quen thuộc có thể trở thành cơ hội để học sinh kết nối kiến thức, thực hành và cùng nhau tìm giải pháp.")
add_paragraph_text(doc, "Nhìn chung, giáo dục STEM có ý nghĩa khi quá trình học tập được thiết kế có mục đích và học sinh thực sự tham gia vào việc tìm hiểu, lựa chọn, thử nghiệm và giải thích. Vì vậy, điều cần quan tâm không chỉ là số lượng hoạt động STEM được tổ chức, mà là chất lượng trải nghiệm học tập và sự tiến bộ của từng học sinh.")

add_page_break(doc)

# TÀI LIỆU THAM KHẢO
add_heading_text(doc, "TÀI LIỆU THAM KHẢO", 1)
add_paragraph_text(doc, "1. Kiều Mạnh Hùng. (2025). Thiết kế chủ đề giáo dục STEM ở trường tiểu học [Bài giảng chuyên đề nghiên cứu]. Đà Nẵng.", first_line_indent=False)
add_paragraph_text(doc, "2. Thủ tướng Chính phủ. (2017). Chỉ thị số 16/CT-TTg ngày 04 tháng 5 năm 2017 về việc tăng cường năng lực tiếp cận cuộc Cách mạng công nghiệp lần thứ tư.", first_line_indent=False)
add_paragraph_text(doc, "3. Bộ Giáo dục và Đào tạo. (2018). Chương trình giáo dục phổ thông ban hành kèm theo Thông tư số 32/2018/TT-BGDĐT ngày 26 tháng 12 năm 2018.", first_line_indent=False)

# Lưu file
doc.save('Tieu_luan_STEM_Hoan_chinh.docx')
print("Đã tạo xong file Word: Tieu_luan_STEM_Hoan_chinh.docx")