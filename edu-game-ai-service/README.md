# Edu Game AI Service

Java Spring Boot service chuyên AI cho Edu Game: **chatbot hỗ trợ học tập**, **sinh câu hỏi
trắc nghiệm**, **phân tích kết quả học tập**.

## 1. Ranh giới trách nhiệm

```text
React Edu Game
   ├──> Backend Node (Render)  ──> MongoDB     ← user / game / question / coin (KHÔNG đổi)
   └──> AI Service (8081)       ──> Ollama/LLM  ← chỉ sinh nội dung + diễn giải
                    │
                    └──> đọc dữ liệu qua API của backend Node (không có DB riêng)
```

**AI Service không có database riêng.** Nó xác thực token và đọc kết quả học tập bằng cách
gọi API sẵn có của backend Node. Nhờ vậy không phải nhân bản schema, không phải sửa API cũ,
và nguồn sự thật vẫn là một chỗ duy nhất.

## 2. Nguyên tắc bất di bất dịch

| Nguyên tắc | Thực hiện ở đâu |
|---|---|
| Java/database là nguồn sự thật, LLM chỉ diễn giải | `LearningMetricsCalculator` tính mọi chỉ số; prompt chỉ nhận số tổng hợp |
| AI không tự sửa điểm / không ghi database | Không service nào có `MongoTemplate`/repository; quiz chỉ trả bản nháp |
| Không tin `studentId` từ client | `AiLearningAnalysisService.resolveTargetUser` chốt lại từ token |
| Output của LLM là dữ liệu không tin cậy | `AiQuizGenerationService.validate` + `fromModel` cắt ngắn mọi trường |
| Không log/đưa `OLLAMA_KEY` ra ngoài | Chỉ đọc trong `OllamaChatGateway`, `AiStatusController` chỉ trả cờ `hasApiKey` |

## 3. Cấu trúc

```text
src/main/java/com/example/edugameai/
├── config/
│   ├── AiProperties.java                    @ConfigurationProperties("edu.ai")
│   ├── CoreApiProperties.java               trỏ tới backend Node
│   ├── RestClientConfig.java                2 RestClient với timeout riêng
│   └── DotEnvEnvironmentPostProcessor.java  nạp .env (ưu tiên thấp hơn OS env)
├── client/
│   ├── AiChatGateway.java                   interface — đổi provider chỉ ở đây
│   ├── OllamaChatGateway.java               gọi /api/chat, gắn Bearer key nếu có
│   └── CoreBackendClient.java               xác thực + đọc /results, /games
├── security/
│   ├── AuthenticatedUser.java
│   ├── CurrentUserArgumentResolver.java     xác thực qua GET /api/auth/me
│   └── AiWebConfig.java                     argument resolver + CORS
├── dto/  ApiResponse, chat/, quiz/, analysis/, core/
├── exception/  AiErrors + GlobalExceptionHandler (envelope {status,code,msg,data})
└── service/   AiChatService, AiQuizGenerationService, AiLearningAnalysisService,
               LearningMetricsCalculator, AiRateLimiter, support/{AiPromptFactory,
               JsonPayloads, Ids}
```

## 4. Vì sao KHÔNG dùng `spring-ai-starter-model-ollama`

Integration Ollama của Spring AI **không gửi header `Authorization`**. Trong khi đó
`OLLAMA_KEY` là bắt buộc với Ollama Cloud / gateway từ xa. Nếu dùng Spring AI thì key trong
`.env` sẽ không bao giờ được dùng.

Vì vậy `OllamaChatGateway` tự dựng HTTP client bằng `RestClient` của `spring-web` (đã có sẵn,
không thêm thư viện), kiểm soát đầy đủ: header xác thực, timeout, ánh xạ lỗi, không log secret.

Bạn vẫn đổi provider được: `AiChatGateway` là interface, chỉ cần thêm implementation khác.

> Lưu ý: `spring-ai-bom` vẫn được khai báo trong `pom.xml` nên khi cần chuyển sang Spring AI chỉ
> cần thêm dependency, không phải tra lại version.

## 5. Chạy local

```bash
# 1. Ollama
ollama serve
ollama pull qwen3:8b

# 2. Backend Node (đang ở thư mục gốc)
npm run dev:api            # http://localhost:5000/api

# 3. AI Service
cd edu-game-ai-service
cp .env.example .env       # sửa OLLAMA_MODEL / OLLAMA_KEY nếu cần
./mvnw.cmd spring-boot:run # http://localhost:8081

# 4. Frontend (thư mục gốc)
npm run dev                # http://localhost:5173
```

Kiểm tra nhanh:

```bash
curl http://localhost:8081/api/ai/health
```

## 6. Biến môi trường

Xem `edu-game-ai-service/.env.example` (đã chú thích đầy đủ). Tóm tắt:

| Biến | Bắt buộc | Mặc định | Ý nghĩa |
|---|---|---|---|
| `OLLAMA_BASE_URL` | có | `http://localhost:11434` | endpoint Ollama |
| `OLLAMA_MODEL` | có | `qwen3:8b` | tên model phải có sẵn ở endpoint |
| `OLLAMA_KEY` | tùy | *(rỗng)* | để trống = không xác thực (Ollama local) |
| `CORE_API_BASE` | có | `http://localhost:5000/api` | gốc API backend Node |
| `EDU_AI_AUTH_REQUIRED` | nên | `true` | `false` **chỉ** để test local |
| `EDU_AI_ALLOWED_ORIGINS` | khi deploy | localhost | origin React được gọi |
| `EDU_AI_ENV_FILE` | không | `.env` | đặt `-` để tắt nạp file |

**Cấp quyền ưu tiên:** biến môi trường hệ thống > `application.yml` > file `.env` > default.
Nguồn `.env` luôn được `addLast()` nên không bao giờ ghi đè biến thật.

## 7. API

Tất cả dùng envelope `{ "status": true, "code": 200, "msg": "success", "data": {...} }` —
giống hệt `server/src/utils/response.js`.

### `GET /api/ai/health` — không cần token

Kiểm tra Ollama + model. Không bao giờ trả key (chỉ trả cờ `hasApiKey`).

### `POST /api/ai/chat` — cần token

```json
// request
{
  "message": "Giải thích cách quy đồng hai phân số",
  "subject": "Toán",
  "topic": "Phân số",
  "conversationId": "c-123",
  "history": [{ "role": "user", "content": "Phân số là gì?" }]
}
```

```json
// response 200
{
  "status": true, "code": 200, "msg": "success",
  "data": { "answer": "Để quy đồng …", "conversationId": "c-123", "truncated": false }
}
```

> `conversationId` chỉ là nhãn nhóm hội thoại do client quản lý. AI Service **không lưu hội
> thoại** và **không dùng `conversationId` để cấp quyền đọc bất kỳ dữ liệu nào**.
> `history` luôn được coi là dữ liệu không đáng tin cậy.

### `POST /api/ai/quizzes/generate` — cần token, chỉ giáo viên/admin

```json
// request — `quantity` vẫn được chấp nhận như bí danh của `count`
{ "subject": "Toán", "grade": 5, "topic": "Phân số", "difficulty": "medium", "count": 5 }
```

```json
// response 200 — đúng schema `questions` của backend chính
{
  "status": true, "code": 200, "msg": "success",
  "data": {
    "questions": [{
      "id": "question-a1b2c3d",
      "content": "Phân số nào bằng 1/2?",
      "inputMode": "choice",
      "options": [
        { "id": "answer-x1", "content": "2/4" },
        { "id": "answer-x2", "content": "3/4" },
        { "id": "answer-x3", "content": "1/3" },
        { "id": "answer-x4", "content": "4/5" }
      ],
      "correctAnswer": "answer-x1",
      "timeLimit": 20,
      "points": 100,
      "explanation": "2/4 rút gọn thành 1/2."
    }],
    "requested": 5, "generated": 5, "skipped": 0, "needsManualAnswer": 0,
    "warnings": ["Đây là bản nháp — hãy xem lại và chỉnh sửa trước khi lưu vào trò chơi."]
  }
}
```

Quy tắc kiểm tra sau khi AI trả về:

- câu thiếu nội dung / thiếu phương án / phương án trùng nhau → **loại**, đếm vào `skipped`
- không khớp được `correctAnswer` → giữ câu, để `correctAnswer: null` để giáo viên chọn tay,
  đếm vào `needsManualAnswer`. **Không bao giờ đoán bừa.**
- `points`/`timeLimit` được kẹp về khoảng hợp lệ; id do **Java** sinh, không tin id của LLM

**Kết quả luôn là bản nháp.** Endpoint này không ghi gì xuống database. Việc lưu đi qua API
câu hỏi sẵn có (`PUT /api/questions/game/:gameId`) sau khi giáo viên xem và sửa — vì API đó
thay thế toàn bộ câu hỏi của game nên tuyệt đối không tự động gọi.

### `POST /api/ai/generate-question` — endpoint cũ, giữ nguyên hợp đồng

Cùng chức năng nhưng trả shape cũ: `options` là mảng chuỗi, `correctAnswer` là **nội dung**
đáp án. Nay đã đi qua pipeline kiểm tra mới. Response được bọc trong envelope (client đã cập
nhật để bóc).

### `POST /api/ai/learning-analysis` — cần token

```json
// request — chỉ nhận BỘ LỌC, không có trường nào khai báo điểm số
{ "studentId": "user-002", "from": "2026-01-01", "to": "2026-03-31", "gameId": null }
```

```json
// response 200
{
  "status": true, "code": 200, "msg": "success",
  "data": {
    "metrics": {
      "totalPlays": 8, "totalQuestionsOffered": 60, "totalCorrectAnswers": 44,
      "accuracy": 73, "averagePlayAccuracy": 74,
      "averageScore": 620.0, "totalXp": 310, "averageCompletionTimeSeconds": 42.5,
      "topics": [{
        "gameId": "…", "gameName": "Đua Toán", "subject": "Toán", "topic": "Phân số",
        "plays": 5, "questionsOffered": 40, "correctAnswers": 26, "accuracy": 65
      }],
      "trend": { "direction": "improving", "accuracyDelta": 8,
                 "firstHalfAccuracy": 69, "secondHalfAccuracy": 77 },
      "periodFrom": "2026-01-01", "periodTo": "2026-03-30"
    },
    "summary": "…", "strengths": ["…"], "areasToImprove": ["…"],
    "recommendations": ["…"], "encouragement": "…",
    "dataSufficient": true,
    "disclaimer": "Số liệu do hệ thống tự tính; phần nhận xét do AI diễn giải …"
  }
}
```

**Phân quyền:** học sinh chỉ xem được chính mình (`studentId` khác → 403, kể cả khi sửa request
trong DevTools). Giáo viên/admin xem được người khác. Chỉ lượt chơi `verified: true` mới được tính.

**Về công thức:** bản ghi `results` lưu `totalQuestions` = *tổng số câu của game* (xem
`server/src/lib/gradeAnswer.js`), **không** phải số câu đã trả lời, và biến `answered` không
được lưu. Vì vậy:
- `accuracy` = `totalCorrectAnswers / totalQuestionsOffered` — chính xác, kiểm chứng lại được
- `averagePlayAccuracy` = trung bình `accuracy` mà backend đã lưu sẵn cho từng lượt

Không có chỉ số nào được suy diễn từ dữ liệu không tồn tại.

## 8. Xử lý lỗi

| HTTP | Nguyên nhân |
|---|---|
| 400 | request không hợp lệ (validation, quá giới hạn, sai định dạng ngày) |
| 401 | thiếu token / token hết hạn |
| 403 | không đủ quyền (học sinh sinh câu hỏi, xem phân tích người khác) |
| 429 | vượt giới hạn tần suất |
| 502 | AI trả JSON không hợp lệ sau khi đã thử lại |
| 503 | Ollama không truy cập được / timeout / backend Node không kết nối được |

Thân thiện với người dùng, chi tiết kỹ thuật trong log, không bao giờ trả stack trace.

## 9. Giới hạn đã biết

- **Model quyết định chất lượng.** Model nhỏ (< 4B) thường sinh câu hỏi lỗi nhiều → `skipped`
  cao. Nên dùng model 7B+ nếu có thể.
- **Chậm.** Model local sinh 5 câu có thể mất 30–90 giây → `OLLAMA_READ_TIMEOUT` mặc định 120s.
- **Chưa lưu hội thoại chat.** Không tạo bảng mới (theo yêu cầu không đổi schema). Client phải
  tự giữ và gửi `history`.
- **Chưa có RAG.** Chatbot chỉ dùng kiến thức chung của model, chưa tra cứu giáo trình riêng.
- **Rate limit in-memory.** Đủ cho một instance; nhiều instance thì chuyển sang Redis.
- **`GET /api/results` của backend Node hiện chưa có xác thực.** AI Service chỉ dùng nó phía
  server và tự lọc theo người dùng đã xác thực, nhưng nên gắn `authenticate` cho endpoint đó ở
  backend chính (ngoài phạm vi thay đổi lần này).

## 10. Kiểm thử

```bash
cd edu-game-ai-service
./mvnw.cmd clean test
```

80 test, bao gồm unit test cho bộ tính chỉ số, validator câu hỏi, bóc JSON, `.env` loader và
integration test kiểm tra envelope + xác thực + phân quyền ở mức HTTP.