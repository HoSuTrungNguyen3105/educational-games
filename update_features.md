# FEATURE SPECIFICATION: ENGLISH B1 LEARNING & EXAM PREPARATION

## 1. TỔNG QUAN

Xây dựng một phân hệ mới có tên:

**English B1 – Học tiếng Anh và luyện thi**

Mục tiêu là giúp người học:
- Học tiếng Anh theo trình độ B1.
- Ôn tập từ vựng và ngữ pháp.
- Luyện đầy đủ 4 kỹ năng: Listening, Speaking, Reading, Writing.
- Làm bài tập theo từng chủ đề.
- Luyện đề thi B1 theo cấu trúc bài thi.
- Thi thử có giới hạn thời gian.
- Xem kết quả, đáp án và giải thích chi tiết.
- Theo dõi quá trình học tập và mức độ tiến bộ.

Đối tượng sử dụng: Học sinh, sinh viên và người học có nhu cầu ôn thi chứng chỉ tiếng Anh B1.

## 2. NGUYÊN TẮC PHÁT TRIỂN

- Tích hợp vào hệ thống EduPlay hiện tại.
- Không phá vỡ các chức năng đang hoạt động.
- Giữ nguyên hệ thống đăng nhập, tài khoản và giao diện chung.
- Thiết kế Responsive cho máy tính, máy tính bảng và điện thoại.
- Tái sử dụng các component hiện có nếu phù hợp.
- Nếu chưa có Backend, sử dụng dữ liệu JSON mẫu và LocalStorage.
- Tổ chức code theo module, tránh viết toàn bộ chức năng trong một component.
- Giao diện thân thiện, hiện đại, dễ sử dụng.

## 3. THIẾT KẾ GIAO DIỆN CHÍNH

Tạo một mục mới trên thanh điều hướng:

**English B1**

Trang chủ gồm các khu vực:

### 3.1. Dashboard học tập

Hiển thị:
- Cấp độ hiện tại: B1.
- Tổng số bài đã học.
- Tổng số câu hỏi đã luyện.
- Điểm trung bình.
- Số ngày học liên tục.
- Tiến độ hoàn thành khóa học.
- Kỹ năng đang mạnh nhất.
- Kỹ năng cần cải thiện.

Các thẻ chức năng:
1. Học từ vựng.
2. Học ngữ pháp.
3. Luyện Listening.
4. Luyện Speaking.
5. Luyện Reading.
6. Luyện Writing.
7. Luyện đề B1.
8. Thi thử B1.

Có khu vực hiển thị:
- Tiếp tục bài học gần nhất.
- Bài học được đề xuất.
- Lịch sử luyện tập.
- Mục tiêu học tập trong ngày.

## 4. MODULE TỪ VỰNG (VOCABULARY)

### 4.1. Phân chia chủ đề

Xây dựng kho từ vựng B1 theo chủ đề:

- Education – Giáo dục.
- Environment – Môi trường.
- Health – Sức khỏe.
- Technology – Công nghệ.
- Travel – Du lịch.
- Food and Drink – Đồ ăn và thức uống.
- Family – Gia đình.
- Work and Career – Công việc và nghề nghiệp.
- Society – Xã hội.
- Entertainment – Giải trí.
- Culture – Văn hóa.
- Transportation – Giao thông.
- Shopping – Mua sắm.
- Communication – Giao tiếp.
- Daily Life – Cuộc sống hằng ngày.

### 4.2. Nội dung mỗi từ vựng

Mỗi từ cần có:

- Từ tiếng Anh.
- Phiên âm IPA.
- Nghĩa tiếng Việt.
- Loại từ.
- Ví dụ tiếng Anh.
- Dịch nghĩa ví dụ.
- Từ đồng nghĩa.
- Từ trái nghĩa (nếu có).
- Audio phát âm (nếu có nguồn âm thanh).

### 4.3. Chế độ học

- Flashcard.
- Lật thẻ ghi nhớ.
- Chọn nghĩa đúng.
- Điền từ còn thiếu.
- Ghép từ với nghĩa.
- Nghe và chọn từ.
- Ôn tập từ đã học.
- Đánh dấu từ khó.

### 4.4. Hệ thống ghi nhớ

Phân loại từ vựng:
- Chưa học.
- Đang học.
- Đã nhớ.
- Cần ôn tập.

Tích hợp phương pháp Spaced Repetition để tự động đề xuất từ cần ôn lại.

## 5. MODULE NGỮ PHÁP (GRAMMAR)

Xây dựng chương trình ngữ pháp phù hợp trình độ B1.

### 5.1. Các chuyên đề

1. Present Simple.
2. Present Continuous.
3. Present Perfect.
4. Past Simple.
5. Past Continuous.
6. Past Perfect (kiến thức mở rộng).
7. Future Simple.
8. Be going to.
9. Modal Verbs.
10. Passive Voice.
11. Conditional Sentences (Type 0, 1, 2).
12. Reported Speech.
13. Relative Clauses.
14. Comparisons.
15. Gerunds and Infinitives.
16. Articles.
17. Prepositions.
18. Conjunctions.
19. Quantifiers.
20. Question Tags.

### 5.2. Nội dung bài học

Mỗi chuyên đề gồm:
- Tên chủ điểm.
- Giải thích bằng tiếng Việt.
- Công thức.
- Cách sử dụng.
- Ví dụ tiếng Anh.
- Dịch nghĩa.
- Các lỗi thường gặp.
- Bài tập thực hành.

### 5.3. Dạng bài tập

- Multiple Choice.
- Fill in the Blanks.
- Error Correction.
- Sentence Transformation.
- Sentence Ordering.
- Word Formation.

Sau khi trả lời, hiển thị:
- Đáp án đúng.
- Giải thích tại sao đúng.
- Giải thích tại sao các đáp án khác sai.
- Kiến thức cần ghi nhớ.

## 6. MODULE LISTENING

### 6.1. Phân loại bài nghe

- Daily Conversations.
- School and Education.
- Travel and Transportation.
- Shopping.
- Health.
- Work and Career.
- Announcements.
- Interviews.
- Short Talks.

### 6.2. Giao diện luyện nghe

Mỗi bài nghe gồm:
- Tên bài.
- Trình độ.
- Thời lượng.
- Audio Player.
- Nút phát và tạm dừng.
- Điều chỉnh âm lượng.
- Điều chỉnh tốc độ phát.
- Nội dung câu hỏi.

### 6.3. Dạng bài tập

- Nghe và chọn đáp án.
- Nghe và điền từ.
- Nghe và xác định True/False.
- Nghe và ghép thông tin.
- Nghe đoạn hội thoại và trả lời câu hỏi.

### 6.4. Chế độ luyện tập

**Practice Mode:**
- Có thể nghe lại nhiều lần.
- Không giới hạn thời gian.
- Xem đáp án sau khi hoàn thành.

**Exam Mode:**
- Giới hạn thời gian.
- Không hiển thị đáp án trong khi làm.
- Chỉ hiển thị kết quả khi nộp bài.

Lưu ý: Không sử dụng audio giả hoặc đường dẫn âm thanh không tồn tại. Nếu chưa có audio thật, hiển thị trạng thái nội dung chưa được cung cấp.

## 7. MODULE READING

### 7.1. Các chủ đề đọc hiểu

- Education.
- Environment.
- Technology.
- Health.
- Travel.
- Culture.
- Society.
- Work.
- Daily Life.

### 7.2. Dạng bài tập

1. Multiple Choice.
2. True / False / Not Given.
3. Matching Headings.
4. Matching Information.
5. Gap Filling.
6. Reading Comprehension.
7. Vocabulary in Context.

### 7.3. Giao diện

- Hiển thị đoạn văn bên trái.
- Hiển thị câu hỏi bên phải.
- Đánh dấu từ hoặc câu trong đoạn văn.
- Cho phép cuộn độc lập.
- Hiển thị số câu đã hoàn thành.
- Có đồng hồ đếm ngược trong Exam Mode.

Sau khi nộp bài:
- Hiển thị điểm.
- Hiển thị đáp án.
- Giải thích dựa trên nội dung đoạn văn.
- Chỉ ra vị trí thông tin trong bài đọc.

## 8. MODULE WRITING

Xây dựng khu vực luyện viết tiếng Anh B1.

### 8.1. Các dạng bài

- Email Writing.
- Informal Letter.
- Formal Letter.
- Opinion Paragraph.
- Short Essay.
- Giving Advice.
- Describing Experiences.

### 8.2. Chế độ luyện viết

Người học có thể:
- Xem đề bài.
- Đọc yêu cầu.
- Xem số từ tối thiểu và tối đa.
- Viết trực tiếp trên hệ thống.
- Lưu bài nháp.
- Nộp bài để nhận đánh giá.

### 8.3. Hệ thống đánh giá

Đánh giá theo các tiêu chí:
- Task Achievement.
- Organization.
- Vocabulary.
- Grammar.
- Spelling and Punctuation.

Hiển thị:
- Điểm từng tiêu chí.
- Tổng điểm.
- Lỗi sai cụ thể.
- Gợi ý sửa câu.
- Từ vựng nên sử dụng.
- Bài viết tham khảo.

Lưu ý:
Nếu chưa tích hợp AI Backend, sử dụng bài mẫu và bộ quy tắc kiểm tra cơ bản. Không giả lập việc AI đã chấm bài thực tế.

## 9. MODULE SPEAKING

### 9.1. Các chủ đề luyện nói

- Introducing Yourself.
- Family.
- Hobbies.
- Education.
- Daily Routine.
- Travel.
- Food.
- Environment.
- Technology.
- Future Plans.

### 9.2. Các phần luyện tập

**Part 1 – Personal Information**
- Giới thiệu bản thân.
- Gia đình.
- Công việc.
- Sở thích.
- Cuộc sống hằng ngày.

**Part 2 – Topic Discussion**
- Trình bày về một chủ đề.
- Đưa ra ý kiến.
- Giải thích lý do.
- Đưa ví dụ thực tế.

**Part 3 – Discussion**
- Trả lời câu hỏi mở rộng.
- So sánh các lựa chọn.
- Đưa ra quan điểm cá nhân.

### 9.3. Chức năng

- Hiển thị câu hỏi.
- Ghi âm bằng microphone.
- Phát lại bản ghi.
- Lưu câu trả lời.
- Hiển thị câu trả lời mẫu.
- Gợi ý từ vựng và cấu trúc câu.
- Tích hợp AI đánh giá phát âm nếu Backend hỗ trợ.

Nếu chưa có dịch vụ nhận diện giọng nói, cần hiển thị rõ chức năng chưa khả dụng thay vì tạo kết quả giả.

## 10. MODULE LUYỆN ĐỀ THI B1

Đây là chức năng trọng tâm.

Tạo thư viện đề thi B1 với nhiều bộ đề khác nhau.

### 10.1. Danh sách đề thi

Mỗi đề gồm:
- Mã đề.
- Tên đề.
- Cấp độ.
- Số lượng câu hỏi.
- Thời gian làm bài.
- Độ khó.
- Trạng thái hoàn thành.
- Điểm cao nhất.

Phân loại:
- Đề cơ bản.
- Đề trung bình.
- Đề nâng cao.
- Đề tổng hợp.
- Đề thi thử.

### 10.2. Cấu trúc bài thi

Hỗ trợ cấu hình nhiều dạng đề B1.

Cấu trúc tham khảo theo dạng bài thi VSTEP bậc 3:

| Kỹ năng | Nội dung |
|---|---|
| Listening | Nghe hiểu |
| Reading | Đọc hiểu |
| Writing | Viết |
| Speaking | Nói |

Không cố định cấu trúc cho mọi chứng chỉ B1. Cho phép cấu hình riêng theo đơn vị tổ chức hoặc định dạng đề thi.

### 10.3. Giao diện làm bài

Thiết kế giống giao diện thi thật:

- Thanh thời gian đếm ngược.
- Số câu hỏi.
- Khu vực nội dung câu hỏi.
- Khu vực chọn đáp án.
- Nút câu trước.
- Nút câu tiếp theo.
- Đánh dấu câu hỏi cần xem lại.
- Hiển thị tiến độ hoàn thành.
- Nút nộp bài.

Khi người học muốn thoát:
- Cảnh báo bài thi chưa hoàn thành.
- Cho phép tiếp tục làm bài.
- Không tự ý xóa kết quả đã lưu.

### 10.4. Sau khi nộp bài

Hiển thị trang kết quả:

- Tổng điểm.
- Số câu đúng.
- Số câu sai.
- Số câu chưa trả lời.
- Thời gian hoàn thành.
- Điểm từng kỹ năng.
- Đánh giá mức độ hoàn thành.

Có chức năng xem lại bài:
- Đáp án người học đã chọn.
- Đáp án chính xác.
- Giải thích chi tiết.
- Kiến thức liên quan.
- Đề xuất nội dung cần ôn tập.

## 11. MODULE THI THỬ (MOCK EXAM)

Tạo chế độ thi thử mô phỏng kỳ thi thật.

Yêu cầu:

- Chọn đề thi.
- Bắt đầu thi.
- Có đồng hồ đếm ngược.
- Tự động lưu câu trả lời.
- Không hiển thị đáp án trong khi thi.
- Có thể chuyển qua lại giữa các câu.
- Có thể đánh dấu câu chưa chắc chắn.
- Tự động nộp bài khi hết thời gian.
- Hiển thị kết quả sau khi nộp.

Sau khi thi xong, tạo báo cáo:

| Kỹ năng | Điểm | Đánh giá |
|---|---|---|
| Listening | ... | ... |
| Reading | ... | ... |
| Writing | ... | ... |
| Speaking | ... | ... |

Nếu thiếu dữ liệu chấm Writing hoặc Speaking, phải ghi rõ chưa được đánh giá thay vì tự tạo điểm.

## 12. MODULE THEO DÕI TIẾN ĐỘ

Tạo trang thống kê học tập.

Thông tin:
- Tổng thời gian học.
- Số bài đã hoàn thành.
- Số đề đã làm.
- Điểm trung bình.
- Điểm cao nhất.
- Tỷ lệ trả lời đúng.
- Tiến độ từ vựng.
- Tiến độ ngữ pháp.
- Biểu đồ điểm theo thời gian.

### Phân tích điểm yếu

Ví dụ:

- Listening: 65% – Cần cải thiện.
- Reading: 80% – Khá tốt.
- Grammar: 72% – Cần ôn thêm.
- Vocabulary: 90% – Tốt.

Tự động đề xuất bài học tiếp theo dựa trên kết quả luyện tập.

## 13. HỆ THỐNG CÂU HỎI VÀ DỮ LIỆU

Thiết kế dữ liệu JSON có cấu trúc rõ ràng.

Ví dụ:

```json
{
  "id": "B1_GRAMMAR_001",
  "title": "Present Perfect",
  "category": "grammar",
  "level": "B1",
  "difficulty": "medium",
  "content": {
    "explanation": "Thì hiện tại hoàn thành...",
    "formula": "S + have/has + V3/ed",
    "examples": [
      {
        "english": "I have lived here for five years.",
        "vietnamese": "Tôi đã sống ở đây được 5 năm."
      }
    ]
  },
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "She _____ finished her homework.",
      "options": [
        "have",
        "has",
        "having",
        "had"
      ],
      "correctAnswer": 1,
      "explanation": "Chủ ngữ She đi với has."
    }
  ]
}
```

Tách dữ liệu thành các nhóm:

```text
english-b1/
├── vocabulary/
│   ├── education.json
│   ├── environment.json
│   ├── health.json
│   └── technology.json
│
├── grammar/
│   ├── tenses.json
│   ├── passive-voice.json
│   └── conditionals.json
│
├── listening/
│   └── listening-lessons.json
│
├── reading/
│   └── reading-lessons.json
│
├── writing/
│   └── writing-topics.json
│
├── speaking/
│   └── speaking-topics.json
│
└── exams/
    ├── exam-001.json
    ├── exam-002.json
    └── exam-003.json
```

## 14. THIẾT KẾ UI/UX

Phong cách:

- Hiện đại.
- Chuyên nghiệp.
- Dễ sử dụng.
- Tập trung vào trải nghiệm học tập.
- Không quá trẻ con.
- Phù hợp với sinh viên và người ôn thi chứng chỉ.

Yêu cầu:
- Dashboard trực quan.
- Card bài học rõ ràng.
- Progress Bar.
- Badge trình độ.
- Biểu đồ thống kê.
- Đồng hồ thi.
- Giao diện làm bài không gây mất tập trung.
- Có Dark Mode nếu hệ thống hiện tại hỗ trợ.
- Tối ưu hiển thị trên điện thoại.

## 15. YÊU CẦU KỸ THUẬT

- React + Vite.
- Sử dụng các thư viện đang có trong dự án nếu phù hợp.
- Không cài thêm thư viện không cần thiết.
- Không tạo Backend mới nếu chưa được yêu cầu.
- Có thể dùng LocalStorage để lưu tiến độ học tập.
- Tách riêng Logic, Components, Data và Utils.
- Có khả năng mở rộng để kết nối Backend/API sau này.

Các module cần được thiết kế độc lập:

```text
EnglishB1/
├── pages/
│   ├── EnglishB1Dashboard.jsx
│   ├── VocabularyPage.jsx
│   ├── GrammarPage.jsx
│   ├── ListeningPage.jsx
│   ├── ReadingPage.jsx
│   ├── WritingPage.jsx
│   ├── SpeakingPage.jsx
│   ├── ExamListPage.jsx
│   ├── ExamTakingPage.jsx
│   ├── ExamResultPage.jsx
│   └── ProgressPage.jsx
│
├── components/
│   ├── VocabularyCard.jsx
│   ├── Flashcard.jsx
│   ├── GrammarLesson.jsx
│   ├── AudioPlayer.jsx
│   ├── ReadingPassage.jsx
│   ├── QuestionCard.jsx
│   ├── ExamTimer.jsx
│   ├── ExamNavigation.jsx
│   └── ProgressChart.jsx
│
├── data/
│   ├── vocabulary/
│   ├── grammar/
│   ├── listening/
│   ├── reading/
│   ├── writing/
│   ├── speaking/
│   └── exams/
│
├── services/
│   ├── englishB1Service.js
│   ├── vocabularyService.js
│   ├── examService.js
│   └── progressService.js
│
└── utils/
    ├── scoringUtils.js
    ├── examTimerUtils.js
    └── learningUtils.js
```

Đây là cấu trúc đề xuất. Cần kiểm tra cấu trúc thực tế của dự án trước khi triển khai, không tạo trùng lặp hoặc phá vỡ kiến trúc hiện tại.

## 16. DỮ LIỆU MẪU VÀ CHẤT LƯỢNG NỘI DUNG

Yêu cầu quan trọng:

Không tạo một giao diện chỉ có các nút bấm nhưng không có nội dung học.

Cần xây dựng dữ liệu thực tế:

- Tối thiểu 100 từ vựng B1 có ví dụ.
- Tối thiểu 15 chuyên đề ngữ pháp.
- Tối thiểu 10 bài Reading.
- Tối thiểu 10 bài Listening nếu có audio thực.
- Tối thiểu 20 chủ đề Speaking.
- Tối thiểu 15 chủ đề Writing.
- Tối thiểu 5 đề thi tổng hợp.

Các câu hỏi phải:
- Đúng ngữ pháp.
- Có đáp án chính xác.
- Có giải thích bằng tiếng Việt.
- Phù hợp trình độ B1.
- Không lặp lại câu hỏi một cách máy móc.
- Không sử dụng dữ liệu giả để tạo cảm giác đã có chức năng hoàn chỉnh.

Nếu nội dung chưa được cung cấp, cần ghi trạng thái rõ ràng để bổ sung sau.

## 17. TIÊU CHÍ NGHIỆM THU

Chức năng được xem là hoàn thành khi:

1. Người học truy cập được English B1 từ hệ thống.
2. Có thể học từ vựng và lưu tiến độ.
3. Có thể học ngữ pháp và làm bài tập.
4. Có thể luyện Listening và Reading.
5. Có thể luyện Writing và Speaking.
6. Có danh sách đề thi.
7. Có thể làm bài thi với đồng hồ.
8. Có thể nộp bài và xem kết quả.
9. Có thể xem lại đáp án và lời giải.
10. Có thống kê tiến độ học tập.
11. Dữ liệu không bị mất khi tải lại trang.
12. Giao diện hoạt động tốt trên desktop và mobile.
13. Không ảnh hưởng đến những chức năng EduPlay đang có.

## 18. ĐỊNH HƯỚNG TRIỂN KHAI

Triển khai theo từng giai đoạn:

**Giai đoạn 1:**
- Dashboard English B1.
- Vocabulary.
- Grammar.
- Reading.

**Giai đoạn 2:**
- Listening.
- Writing.
- Speaking.

**Giai đoạn 3:**
- Thư viện đề thi.
- Exam Mode.
- Mock Exam.
- Chấm điểm và xem đáp án.

**Giai đoạn 4:**
- Thống kê tiến độ.
- Gợi ý ôn tập thông minh.
- Tối ưu trải nghiệm người dùng.

Ưu tiên hoàn thiện từng chức năng với dữ liệu thật và luồng sử dụng hoàn chỉnh trước khi chuyển sang giai đoạn tiếp theo.

---

# YÊU CẦU CUỐI CÙNG

Trước khi lập trình:
1. Đọc cấu trúc dự án EduPlay hiện tại.
2. Kiểm tra hệ thống Router và các component đang sử dụng.
3. Kiểm tra cách lưu dữ liệu và quản lý tài khoản.
4. Đề xuất vị trí tích hợp English B1 phù hợp.

Sau đó triển khai trực tiếp vào dự án.

Không viết lại toàn bộ ứng dụng. Không xóa hoặc thay đổi chức năng cũ. Không tạo giao diện demo rỗng. Mọi nút bấm phải có chức năng tương ứng.

Ưu tiên trải nghiệm học thật, ôn tập thật và luyện thi có kết quả rõ ràng.