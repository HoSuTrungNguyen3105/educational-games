# QUESTION IMPORT — WORD & EXCEL

## 1. Mục tiêu

Xây dựng tính năng cho phép giáo viên import hàng loạt câu hỏi trò chơi từ file Excel (.xlsx, .xls) và Word (.docx). 

Ở file "F:\Clone\edu_game\educational-games\src\pages\teacher\CreateGameFlow.jsx"

Hệ thống phải hỗ trợ:

- Import Excel
- Import Word
- Parse dữ liệu
- Normalize dữ liệu về cùng một format
- Validate dữ liệu
- Preview trước khi lưu
- Cho phép giáo viên chỉnh sửa câu hỏi lỗi
- Xác nhận import
- Gửi dữ liệu JSON đã chuẩn hóa lên Backend
- Lưu vào Question Bank

Không import trực tiếp vào database ngay khi upload file.

---

## 2. FLOW TỔNG QUÁT

Teacher
→ Click "Import câu hỏi"
→ Chọn Word hoặc Excel
→ Upload file
→ Kiểm tra file
→ Parse file
→ Normalize dữ liệu
→ Validate dữ liệu
→ Hiển thị Preview
→ Giáo viên kiểm tra
→ Nếu có lỗi → chỉnh sửa
→ Validate lại
→ Confirm Import
→ Frontend gửi JSON lên Backend
→ Backend validate lần cuối
→ Backend lưu Question Bank
→ Trả kết quả
→ Frontend cập nhật danh sách câu hỏi

```text
┌──────────────────────┐
│  Import câu hỏi      │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Chọn Word / Excel    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Upload File          │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Validate File        │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Parse File           │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Normalize Data       │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Validate Questions   │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Preview              │
└──────────┬───────────┘
           ↓
      Có lỗi không?
       /        \
     Có          Không
     ↓             ↓
  Edit          Confirm
     ↓             ↓
Validate lại    JSON
                   ↓
              Backend
                   ↓
             Save Database
                   ↓
             Question Bank
```

---

## 3. UI IMPORT

Trong Question Bank thêm:

```text
[+ Thêm câu hỏi] [Import câu hỏi]
```

Click `Import câu hỏi` mở modal:

```text
┌──────────────────────────────────────────────┐
│ Import câu hỏi                               │
├──────────────────────────────────────────────┤
│                                              │
│ Chọn định dạng                               │
│                                              │
│ [ Excel ]              [ Word ]              │
│                                              │
│ ┌────────────────────────────────────────┐   │
│ │                                        │   │
│ │       Kéo file vào đây                 │   │
│ │              hoặc                     │   │
│ │          [Chọn file]                   │   │
│ │                                        │   │
│ │       .xlsx .xls .docx                │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ [Tải file Excel mẫu]                         │
│ [Tải file Word mẫu]                          │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 4. EXCEL FORMAT

Excel là format ưu tiên.

File Excel mẫu:

| question | answer_a | answer_b | answer_c | answer_d | correct_answer | time | score | image | category | difficulty | explanation |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Thủ đô Việt Nam là gì? | Hà Nội | Huế | Đà Nẵng | TP.HCM | A | 30 | 100 | | Địa lý | easy | Hà Nội là thủ đô Việt Nam |
| 1 + 1 bằng bao nhiêu? | 1 | 2 | 3 | 4 | B | 20 | 100 | | Toán | easy | Kết quả là 2 |

### Required fields

```text
question
answer_a
answer_b
correct_answer
```

### Optional fields

```text
answer_c
answer_d
time
score
image
category
difficulty
explanation
```

---

## 5. EXCEL JSON SAU KHI PARSE

Excel row:

```json
{
  "question": "Thủ đô Việt Nam là gì?",
  "answer_a": "Hà Nội",
  "answer_b": "Huế",
  "answer_c": "Đà Nẵng",
  "answer_d": "TP.HCM",
  "correct_answer": "A",
  "time": 30,
  "score": 100,
  "image": "",
  "category": "Địa lý",
  "difficulty": "easy",
  "explanation": "Hà Nội là thủ đô Việt Nam."
}
```

Không đưa raw Excel row trực tiếp vào UI hoặc Backend.

Phải normalize thành structure chuẩn.

---

## 6. WORD FORMAT

Word `.docx` phải sử dụng format thống nhất.

Ví dụ:

```text
Câu 1: Thủ đô Việt Nam là gì?

A. Hà Nội
B. Huế
C. Đà Nẵng
D. TP.HCM

Đáp án: A
Thời gian: 30
Điểm: 100
Chủ đề: Địa lý
Độ khó: easy
Giải thích: Hà Nội là thủ đô Việt Nam.
```

Câu tiếp theo:

```text
Câu 2: 1 + 1 bằng bao nhiêu?

A. 1
B. 2
C. 3
D. 4

Đáp án: B
Thời gian: 20
Điểm: 100
Chủ đề: Toán
Độ khó: easy
Giải thích: Kết quả là 2.
```

---

## 7. WORD PARSER

Parser phải nhận diện:

```text
Câu 1:
Câu 2:
Câu 3:
```

Đáp án:

```text
A. ...
B. ...
C. ...
D. ...
```

Có thể hỗ trợ thêm:

```text
A) ...
B) ...
C) ...
D) ...
```

hoặc:

```text
A - ...
B - ...
C - ...
D - ...
```

Đáp án đúng có thể hỗ trợ:

```text
Đáp án: A
Đáp án đúng: A
Answer: A
Correct Answer: A
```

Các format trên đều phải normalize thành:

```json
{
  "correctAnswer": "A"
}
```

---

## 8. WORD JSON SAU KHI PARSE

Ví dụ Word:

```text
Câu 1: 1 + 1 bằng bao nhiêu?

A. 1
B. 2
C. 3
D. 4

Đáp án: B
Thời gian: 20
Điểm: 100
```

Sau khi parse:

```json
{
  "question": "1 + 1 bằng bao nhiêu?",
  "answers": [
    {
      "key": "A",
      "content": "1"
    },
    {
      "key": "B",
      "content": "2"
    },
    {
      "key": "C",
      "content": "3"
    },
    {
      "key": "D",
      "content": "4"
    }
  ],
  "correctAnswer": "B",
  "time": 20,
  "score": 100
}
```

---

## 9. NORMALIZED QUESTION JSON

Dù nguồn là Word hay Excel thì sau khi parse đều phải chuyển về cùng một structure:

```json
{
  "id": null,
  "questionType": "multiple_choice",
  "question": "Thủ đô Việt Nam là gì?",
  "answers": [
    {
      "key": "A",
      "content": "Hà Nội"
    },
    {
      "key": "B",
      "content": "Huế"
    },
    {
      "key": "C",
      "content": "Đà Nẵng"
    },
    {
      "key": "D",
      "content": "TP.HCM"
    }
  ],
  "correctAnswer": "A",
  "time": 30,
  "score": 100,
  "image": null,
  "category": "Địa lý",
  "difficulty": "easy",
  "explanation": "Hà Nội là thủ đô Việt Nam.",
  "status": "valid",
  "errors": []
}
```

---

## 10. TYPESCRIPT INTERFACE

Tạo type dùng chung:

```ts
export interface ImportedQuestion {
  id?: string | null;

  questionType?: "multiple_choice";

  question: string;

  answers: {
    key: "A" | "B" | "C" | "D";
    content: string;
  }[];

  correctAnswer: "A" | "B" | "C" | "D";

  time?: number | null;

  score?: number | null;

  image?: string | null;

  category?: string | null;

  difficulty?: string | null;

  explanation?: string | null;

  status: "valid" | "invalid";

  errors: {
    field: string;
    message: string;
  }[];
}
```

---

## 11. VALIDATION FLOW

Sau khi parse phải validate từng câu.

Kiểm tra:

```text
1. Question có rỗng không?
2. Có ít nhất 2 đáp án không?
3. Các đáp án có bị rỗng không?
4. correctAnswer có tồn tại không?
5. correctAnswer có nằm trong A/B/C/D không?
6. time nếu có phải là số > 0
7. score nếu có phải là số hợp lệ
```

Ví dụ lỗi:

```json
{
  "row": 5,
  "status": "invalid",
  "errors": [
    {
      "field": "question",
      "message": "Nội dung câu hỏi không được để trống"
    }
  ]
}
```

---

## 12. IMPORT RESULT

Sau khi parse và validate:

```json
{
  "fileName": "questions.xlsx",
  "fileType": "xlsx",
  "total": 20,
  "valid": 18,
  "invalid": 2,
  "questions": [],
  "errors": [
    {
      "row": 5,
      "field": "correct_answer",
      "message": "Đáp án đúng không tồn tại"
    },
    {
      "row": 9,
      "field": "question",
      "message": "Nội dung câu hỏi không được để trống"
    }
  ]
}
```

UI hiển thị:

```text
✓ 18 câu hợp lệ
✕ 2 câu lỗi
```

---

## 13. PREVIEW

Sau khi parse phải hiển thị Preview:

```text
┌────┬──────────────────────────┬───────┬──────┬──────────┐
│ #  │ Câu hỏi                  │ Đúng  │ Time │ Status   │
├────┼──────────────────────────┼───────┼──────┼──────────┤
│ 1  │ Thủ đô Việt Nam...?      │ A     │ 30s  │ ✓ Hợp lệ │
│ 2  │ 1 + 1 bằng...?            │ B     │ 20s  │ ✓ Hợp lệ │
│ 3  │                          │       │      │ ✕ Lỗi    │
└────┴──────────────────────────┴───────┴──────┴──────────┘
```

Click vào câu hỏi có thể mở form chỉnh sửa.

---

## 14. EDIT QUESTION

Giáo viên có thể chỉnh sửa trước khi Import:

```text
question
answer A
answer B
answer C
answer D
correctAnswer
time
score
image
category
difficulty
explanation
```

Sau khi chỉnh sửa phải validate lại.

Chỉ cho phép Confirm Import khi tất cả câu được chọn để import đều hợp lệ.

---

## 15. ZUSTAND STORE

Sử dụng Zustand để quản lý trạng thái Import.

```text
questionImportStore
├── file
├── fileType
├── questions
├── errors
├── isParsing
├── isValid
├── selectedQuestion
├── setFile
├── setQuestions
├── updateQuestion
├── removeQuestion
├── clearImport
└── validate
```

Ví dụ:

```ts
interface QuestionImportState {
  file: File | null;

  fileType: "xlsx" | "xls" | "docx" | null;

  questions: ImportedQuestion[];

  errors: {
    row: number;
    field: string;
    message: string;
  }[];

  isParsing: boolean;

  isValid: boolean;

  selectedQuestion: number | null;

  setFile: (file: File | null) => void;

  setQuestions: (questions: ImportedQuestion[]) => void;

  updateQuestion: (
    index: number,
    question: Partial<ImportedQuestion>
  ) => void;

  removeQuestion: (index: number) => void;

  clearImport: () => void;

  validate: () => void;
}
```

---

## 16. PARSER ARCHITECTURE

Không viết parser trực tiếp trong React component.

Tạo:

```text
src/
└── services/
    └── question-import/
        ├── excel.parser.ts
        ├── word.parser.ts
        ├── question.normalizer.ts
        └── question.validator.ts
```

Flow:

```text
Excel
 ↓
excel.parser.ts
 ↓
question.normalizer.ts
 ↓
question.validator.ts
 ↓
ImportedQuestion[]

Word
 ↓
word.parser.ts
 ↓
question.normalizer.ts
 ↓
question.validator.ts
 ↓
ImportedQuestion[]
```

---

## 17. LIBRARIES

Excel sử dụng:

```bash
npm install xlsx
```

Word sử dụng:

```bash
npm install mammoth
```

Không thêm thư viện khác nếu không cần thiết.

---

## 18. EXCEL PARSER

Tạo function:

```ts
parseExcel(file: File): Promise<ImportedQuestion[]>
```

Parser phải:

```text
Read File
→ Read Workbook
→ Read Sheet
→ Read Rows
→ Map Columns
→ Normalize
→ Return ImportedQuestion[]
```

Không trả raw Excel data cho component.

---

## 19. WORD PARSER

Tạo function:

```ts
parseWord(file: File): Promise<ImportedQuestion[]>
```

Parser phải:

```text
Read .docx
→ Extract Text
→ Detect Questions
→ Detect Answers
→ Detect Correct Answer
→ Detect Time
→ Detect Score
→ Detect Metadata
→ Normalize
→ Return ImportedQuestion[]
```

---

## 20. BACKEND FLOW

Frontend không gửi file trực tiếp để lưu database.

Frontend:

```text
File
→ Parse
→ Validate
→ Preview
→ Confirm
→ JSON
```

Sau đó:

```text
Frontend
→ POST API
→ Backend
→ Validate JSON
→ Save Database
→ Return Result
```

Ví dụ request:

```json
{
  "questions": [
    {
      "questionType": "multiple_choice",
      "question": "1 + 1 bằng bao nhiêu?",
      "answers": [
        {
          "key": "A",
          "content": "1"
        },
        {
          "key": "B",
          "content": "2"
        },
        {
          "key": "C",
          "content": "3"
        },
        {
          "key": "D",
          "content": "4"
        }
      ],
      "correctAnswer": "B",
      "time": 20,
      "score": 100,
      "category": "Toán",
      "difficulty": "easy"
    }
  ]
}
```

Backend phải validate lại dữ liệu trước khi lưu.

---

## 21. DATABASE RESULT

Sau khi import thành công:

```json
{
  "resultCode": "00",
  "resultMessage": "Import câu hỏi thành công",
  "data": {
    "total": 20,
    "success": 18,
    "failed": 2
  }
}
```

Nếu có lỗi thì trả về danh sách lỗi tương ứng để frontend hiển thị.

---

## 22. FILE VALIDATION

Chỉ cho phép:

```text
.xlsx
.xls
.docx
```

Giới hạn dung lượng:

```text
10MB
```

Nếu sai:

```text
File không được hỗ trợ.
Vui lòng chọn .xlsx, .xls hoặc .docx
```

Nếu file quá lớn:

```text
File vượt quá dung lượng cho phép.
Dung lượng tối đa: 10MB
```

---

## 23. SECURITY

Không thực thi nội dung lấy từ Word hoặc Excel.

Không render HTML/script trực tiếp từ file.

Không tin dữ liệu từ frontend.

Frontend validation chỉ để hỗ trợ UX.

Backend bắt buộc validate lại trước khi lưu.

Nếu Word parser trả HTML thì phải sanitize trước khi render.

---

## 24. DOWNLOAD FILE MẪU

Phải có:

```text
[Tải Excel mẫu]
[Tải Word mẫu]
```

Excel mẫu phải đúng format mà `excel.parser.ts` hỗ trợ.

Word mẫu phải đúng format mà `word.parser.ts` hỗ trợ.

Mục tiêu:

```text
Teacher
→ Download Template
→ Điền câu hỏi
→ Upload
→ Preview
→ Import
```

---

## 25. FLOW HOÀN CHỈNH

```text
                    TEACHER
                       │
                       ▼
              [Import câu hỏi]
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
          EXCEL                 WORD
        .xlsx/.xls             .docx
             │                   │
             ▼                   ▼
      Excel Parser          Word Parser
             │                   │
             └─────────┬─────────┘
                       ▼
                  NORMALIZE
                       │
                       ▼
                   VALIDATE
                       │
              ┌────────┴────────┐
              │                 │
             Lỗi             Hợp lệ
              │                 │
              ▼                 │
         Edit Question           │
              │                 │
              └───────┐         │
                      ▼         ▼
                    Validate
                       │
                       ▼
                    PREVIEW
                       │
                       ▼
                 [Confirm Import]
                       │
                       ▼
                     JSON
                       │
                       ▼
                   BACKEND
                       │
                       ▼
              Backend Validation
                       │
                       ▼
                 Save Database
                       │
                       ▼
                QUESTION BANK
                       │
                       ▼
                Import Complete
```

---

## 26. QUY TẮC QUAN TRỌNG

1. Chỉ triển khai tính năng Import Word và Excel.
2. Word và Excel phải được normalize về cùng một `ImportedQuestion`.
3. Không lưu raw data của Excel/Word vào database.
4. Không import ngay sau khi upload.
5. Luôn phải có Parse → Validate → Preview → Confirm.
6. Giáo viên phải có thể sửa câu hỏi trước khi import.
7. Chỉ câu hỏi hợp lệ mới được import.
8. Backend phải validate lại dữ liệu.
9. Parser phải nằm riêng trong service, không viết trực tiếp trong React component.
10. Zustand chỉ quản lý state của quá trình import.
11. Excel sử dụng `xlsx`.
12. Word sử dụng `mammoth`.
13. Có file Excel mẫu và Word mẫu để giáo viên tải xuống.
14. Giữ code có khả năng mở rộng sau này nhưng hiện tại chỉ triển khai Word và Excel.
