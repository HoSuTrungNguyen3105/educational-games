# Edu Game — AI Integration Architecture

## 1. Mục tiêu

Tích hợp AI vào hệ thống Edu Game hiện tại theo hướng:

- Giữ nguyên frontend React/JavaScript hiện tại.
- Giữ nguyên backend hiện tại và các nghiệp vụ đang chạy ổn định.
- Xây dựng **Java Spring Boot AI Service riêng** để xử lý các chức năng AI.
- Hai backend chạy song song, không rewrite backend hiện tại sang Java.
- AI là một service hỗ trợ sản phẩm, không thay thế các nghiệp vụ backend thông thường.

Mục tiêu cuối cùng:

```text
React Edu Game
      │
      ├──────────────► Existing Backend
      │                 Game / User / Template / Question / Coin...
      │
      └──────────────► Java AI Service
                         Spring Boot
                              │
                           Spring AI
                              │
                     ┌────────┴────────┐
                     │                 │
                    RAG               LLM
                     │          Ollama / Cloud API
                     │
               PostgreSQL
               + pgvector
```

---

## 2. Nguyên tắc kiến trúc

### 2.1 Không thay thế hệ thống hiện tại

Không chuyển Edu Game hiện tại từ JavaScript/Node.js sang Java chỉ để tích hợp AI.

Backend hiện tại tiếp tục chịu trách nhiệm:

- Authentication / User
- Game
- Template
- Question
- Coin / Reward
- Progress
- Game session
- Các API nghiệp vụ hiện tại

### 2.2 Java Backend chỉ phụ trách AI

Java Spring Boot AI Service chịu trách nhiệm:

- Generate content
- Generate questions
- Explain answers
- Analyze learning results
- RAG
- AI recommendations
- AI-generated missions / NPC / game content

Không đưa các nghiệp vụ CRUD thông thường sang Java nếu không cần thiết.

### 2.3 Không để React gọi trực tiếp LLM

Không làm:

```text
React → OpenAI/Gemini/Claude
```

Phải làm:

```text
React
  ↓
Java AI Service
  ↓
Spring AI
  ↓
LLM
```

API key, prompt, validation, rate limit và logic AI phải nằm phía backend.

---

# 3. Hai Backend chạy song song

## Existing Backend

Backend hiện tại tiếp tục quản lý:

```text
User
Auth
Game
Template
Question
Coin
Reward
Progress
Game Session
...
```

## Java AI Service

Có thể đặt project riêng:

```text
edu-game-ai-service/
```

Cấu trúc đề xuất:

```text
edu-game-ai-service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com.example.edugameai/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── dto/
│   │   │       ├── config/
│   │   │       ├── rag/
│   │   │       ├── client/
│   │   │       └── exception/
│   │   └── resources/
│   │       └── application.yml
│   └── test/
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# 4. AI Functions

## 4.1 AI Generate Question

Đây là chức năng ưu tiên số 1.

Giáo viên nhập:

```json
{
  "subject": "Toán",
  "grade": 5,
  "topic": "Phân số",
  "difficulty": "medium",
  "quantity": 10
}
```

Java AI Service:

```text
Request
  ↓
Validate
  ↓
Build Prompt
  ↓
RAG nếu có tài liệu
  ↓
LLM
  ↓
Structured JSON
  ↓
Validate Question DTO
  ↓
Response
```

AI phải trả về cấu trúc phù hợp với hệ thống hiện tại.

Ví dụ:

```json
{
  "questions": [
    {
      "content": "Phân số nào bằng 1/2?",
      "options": [
        "2/4",
        "3/4",
        "1/3",
        "4/5"
      ],
      "correctAnswer": "2/4",
      "points": 10
    }
  ]
}
```

### Quan trọng

Không tự ý thay đổi cấu trúc Question API hiện tại.

AI Service phải map output AI về DTO tương thích với hệ thống hiện tại.

---

# 5. AI Explain Answer

Khi học sinh trả lời sai:

```text
Student Answer
      ↓
Java AI Service
      ↓
LLM
      ↓
Explanation
```

Ví dụ:

```text
Đáp án của bạn: 3/4
Đáp án đúng: 2/4

AI giải thích:
2/4 có thể rút gọn thành 1/2 vì cả tử và mẫu
đều chia cho 2.
```

AI chỉ giải thích.

Không để AI quyết định điểm số hoặc trạng thái game.

---

# 6. AI Analyze Learning Result

Backend hiện tại tính toán dữ liệu:

```text
correct = 8
wrong = 4
accuracy = 66.7%
```

Sau đó gửi dữ liệu phù hợp cho AI:

```text
Java AI Service
      ↓
LLM
      ↓
Learning Analysis
```

AI có thể trả:

```json
{
  "summary": "Học sinh đang khá tốt phần phân số.",
  "weakTopics": [
    "Quy đồng mẫu số"
  ],
  "recommendations": [
    "Luyện thêm 10 câu về quy đồng mẫu số."
  ]
}
```

Không để AI tự tính điểm.

---

# 7. RAG

RAG dùng khi AI cần dựa trên nội dung bài học thực tế.

Flow:

```text
Learning Material
      ↓
Chunk
      ↓
Embedding
      ↓
Vector Database
      ↓
Similarity Search
      ↓
Relevant Context
      ↓
LLM
      ↓
Answer / Question
```

Đề xuất ban đầu:

```text
PostgreSQL
+
pgvector
```

Không cần triển khai vector database phức tạp ngay từ đầu.

---

# 8. AI Generate Game Content

Sau khi các chức năng chính ổn định, có thể mở rộng:

### Generate Mission

```text
"Tạo nhiệm vụ Toán lớp 5 về phân số"
```

AI trả:

```json
{
  "title": "Kho Báu Phân Số",
  "description": "Hoàn thành 10 câu hỏi về phân số.",
  "requiredQuestions": 10,
  "reward": 100
}
```

### Generate NPC Dialogue

AI tạo hội thoại phù hợp với chủ đề game.

### Generate Quest

AI tạo nhiệm vụ học tập theo lesson/topic.

Không cho AI trực tiếp ghi dữ liệu quan trọng vào database nếu chưa qua validation.

---

# 9. AI Provider

## Giai đoạn phát triển

Ưu tiên:

```text
Ollama
```

Chạy LLM local để:

- Học
- Test
- Phát triển
- Không cần API key
- Không phát sinh chi phí API

Kiến trúc phải thiết kế để sau này có thể thay provider.

Ví dụ:

```text
Spring AI
   │
   ├── Ollama
   ├── OpenAI
   ├── Gemini
   └── Provider khác
```

Không hard-code logic nghiệp vụ vào một provider duy nhất.

---

# 10. Chi phí

## Development

Có thể bắt đầu gần như 0đ:

```text
Java                 → miễn phí
Spring Boot          → miễn phí
Spring AI            → miễn phí
Ollama               → miễn phí
PostgreSQL           → miễn phí
pgvector             → miễn phí
Docker               → có thể dùng miễn phí
```

Cloud LLM API chỉ cần khi muốn:

- Model mạnh hơn
- Deploy production
- So sánh nhiều provider
- Xử lý lượng request lớn

Không cần mua API ngay khi bắt đầu.

---

# 11. API Design

Java AI Service đề xuất:

```text
POST /api/ai/generate-question
POST /api/ai/explain-answer
POST /api/ai/analyze-result
POST /api/ai/chat
POST /api/ai/rag/query
POST /api/ai/generate-mission
POST /api/ai/generate-quest
```

Các endpoint phải:

- Validate request
- Có exception handling
- Có timeout
- Có logging
- Có rate limit nếu cần
- Không trả raw response không kiểm soát từ LLM

---

# 12. Communication giữa hai Backend

Có thể dùng:

```text
React
 ↓
Existing Backend
```

và:

```text
React
 ↓
Java AI Service
```

Trong các trường hợp Java cần dữ liệu nghiệp vụ:

```text
Java AI Service
      ↓
Existing Backend API
      ↓
Game / Question / Lesson Data
```

Không nên cho hai backend cùng sở hữu một nghiệp vụ.

Ví dụ:

```text
Existing Backend → User
Existing Backend → Game
Existing Backend → Question

Java AI Service → AI generation
Java AI Service → RAG
Java AI Service → AI analysis
```

---

# 13. Database Ownership

Nếu sử dụng cùng PostgreSQL:

- Không tự ý thay đổi cấu trúc database hiện tại.
- Không tự ý đổi cấu trúc `games`, `templates`, `questions` đang được hệ thống sử dụng.
- Java AI Service chỉ thêm bảng/collection cần thiết cho AI khi thực sự cần.

Ví dụ AI-specific data:

```text
ai_documents
ai_document_chunks
ai_embeddings
ai_prompt_logs
ai_generation_logs
```

Nếu cần lưu vector:

```text
PostgreSQL + pgvector
```

Việc thêm bảng AI không được phá vỡ database hiện tại.

---

# 14. Security

Không commit:

```text
OPENAI_API_KEY
GEMINI_API_KEY
DB_PASSWORD
JWT_SECRET
```

Sử dụng:

```text
.env
```

và commit:

```text
.env.example
```

React không được chứa secret key của LLM provider.

---

# 15. Validation và AI Safety

AI output phải được validate trước khi sử dụng.

Ví dụ:

```text
LLM
 ↓
JSON parsing
 ↓
DTO validation
 ↓
Business validation
 ↓
Save / Return
```

Không tin tưởng hoàn toàn output của LLM.

Đặc biệt với Question:

- Phải có content
- Phải có options
- Phải có correctAnswer
- correctAnswer phải tồn tại trong options
- points phải hợp lệ
- Không được lưu dữ liệu lỗi vào database

---

# 16. Roadmap

## Phase 1 — Java Foundation

```text
Java 17/21
Spring Boot
Maven
REST API
DTO
Validation
Exception Handling
```

## Phase 2 — AI cơ bản

```text
Spring AI
Ollama
LLM
Prompt
Structured Output
```

Làm:

```text
POST /api/ai/generate-question
```

## Phase 3 — Tích hợp Edu Game

```text
React
 ↓
Java AI Service
 ↓
Generate Question
 ↓
Existing Backend
 ↓
Save Question
```

## Phase 4 — RAG

```text
PostgreSQL
pgvector
Embeddings
Document Chunking
Similarity Search
RAG
```

## Phase 5 — AI Learning Features

```text
Explain Answer
Analyze Result
Recommend Practice
Generate Mission
Generate Quest
NPC Dialogue
```

## Phase 6 — Production

```text
Docker
Redis
Logging
Monitoring
Rate Limit
CI/CD
Cloud Deployment
```

---

# 17. GitHub Portfolio

Project nên public nếu không chứa secret hoặc dữ liệu riêng.

README phải có:

- Project overview
- Architecture diagram
- Tech stack
- Features
- API documentation
- RAG flow
- Local setup
- Ollama setup
- Docker setup
- Screenshots/demo
- Example request/response
- Roadmap

Commit nên có ý nghĩa:

```text
feat: initialize Spring Boot AI service
feat: integrate Ollama with Spring AI
feat: add AI question generation
feat: add structured question validation
feat: connect AI service with existing backend
feat: implement RAG
feat: add AI answer explanation
feat: add learning result analysis
feat: dockerize AI service
docs: update architecture documentation
```

---

# 18. Nguyên tắc quan trọng nhất

Không làm AI để "có AI".

AI phải giải quyết vấn đề thực tế:

```text
Generate
Explain
Analyze
Recommend
Retrieve
Create Content
```

Backend thông thường vẫn chịu trách nhiệm:

```text
Auth
CRUD
Game Logic
Score
Coin
Reward
Permission
Validation
Transaction
```

Kiến trúc cuối cùng:

```text
                         ┌──────────────────────┐
                         │    React Edu Game    │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
                    ▼                                ▼
          ┌──────────────────┐            ┌──────────────────┐
          │ Existing Backend │            │ Java AI Service  │
          │                  │            │                  │
          │ Game             │            │ Spring Boot      │
          │ User             │            │ Spring AI        │
          │ Question         │            │ RAG              │
          │ Template         │            │ AI Analysis      │
          │ Coin             │            │ AI Generation    │
          └────────┬─────────┘            └────────┬─────────┘
                   │                               │
                   │                               ▼
                   │                         ┌───────────┐
                   │                         │   LLM     │
                   │                         │  Ollama   │
                   │                         └───────────┘
                   │                               │
                   │                               ▼
                   │                         ┌───────────┐
                   │                         │ PostgreSQL│
                   │                         │ + pgvector│
                   │                         └───────────┘
                   │
                   └─────────────── Existing Data
```

**Mục tiêu:** biến Edu Game hiện tại thành một hệ thống có **Java/Spring Boot AI Service thực tế**, đồng thời giữ nguyên các backend và data structure hiện có.
