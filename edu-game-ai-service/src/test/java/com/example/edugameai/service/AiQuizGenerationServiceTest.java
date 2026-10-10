package com.example.edugameai.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import com.example.edugameai.TestFixtures;
import com.example.edugameai.client.StubAiChatGateway;
import com.example.edugameai.config.AiProperties;
import com.example.edugameai.dto.quiz.AiQuizGenerateRequest;
import com.example.edugameai.dto.quiz.AiQuizGenerateResponse;
import com.example.edugameai.exception.AiErrors;
import com.example.edugameai.security.AuthenticatedUser;
import com.example.edugameai.service.support.AiPromptFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class AiQuizGenerationServiceTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private AiProperties properties;
    private StubAiChatGateway gateway;

    private static final AuthenticatedUser TEACHER =
            new AuthenticatedUser("u1", "giaovien", "Cô Lan", "teacher", true);
    private static final AuthenticatedUser STUDENT =
            new AuthenticatedUser("u2", "hocsinh", "Bình", "student", true);

    @BeforeEach
    void setUp() {
        properties = TestFixtures.aiPropertiesPermissive();
        gateway = new StubAiChatGateway();
    }

    private AiQuizGenerationService service() {
        return new AiQuizGenerationService(gateway, new AiPromptFactory(properties), new AiRateLimiter(properties),
                properties, objectMapper);
    }

    private static AiQuizGenerateRequest request(int count) {
        return new AiQuizGenerateRequest("Toán", 5, "Phân số", "medium", count, null, null);
    }

    @Test
    @DisplayName("sinh câu hỏi hợp lệ và map sang đúng schema của hệ thống")
    void generatesValidQuestions() {
        gateway.responding("""
                {"questions":[
                  {"content":"Phân số nào bằng 1/2?","options":["2/4","3/4","1/3","4/5"],
                   "correctAnswer":"2/4","explanation":"2/4 rút gọn thành 1/2."}
                ]}""");

        AiQuizGenerateResponse response = service().generate(request(1), TEACHER, "1.1.1.1");

        assertEquals(1, response.generated());
        assertEquals(0, response.skipped());
        assertEquals(0, response.needsManualAnswer());

        var q = response.questions().get(0);
        assertNotNull(q.id());
        assertTrue(q.id().startsWith("question-"));
        assertEquals("choice", q.inputMode());
        assertEquals(4, q.options().size());
        assertEquals(100, q.points());
        assertEquals(20, q.timeLimit());

        // correctAnswer phải là ID của option đúng, khớp cách backend chấm điểm.
        String correctId = q.correctAnswer();
        assertNotNull(correctId);
        assertEquals("2/4", q.options().stream()
                .filter(o -> o.id().equals(correctId))
                .findFirst()
                .orElseThrow()
                .content());
    }

    @Test
    @DisplayName("loại câu thiếu nội dung, thiếu phương án hoặc phương án trùng nhau")
    void dropsStructurallyBrokenQuestions() {
        gateway.responding("""
                {"questions":[
                  {"content":"","options":["a","b","c","d"],"correctAnswer":"a"},
                  {"content":"Hợp lệ?","options":["a","b"],"correctAnswer":"a"},
                  {"content":"Trùng?","options":["A","a","b","c"],"correctAnswer":"a"},
                  {"content":"Câu đúng chuẩn?","options":["một","hai","ba","bốn"],"correctAnswer":"hai"}
                ]}""");

        AiQuizGenerateResponse response = service().generate(request(4), TEACHER, "1.1.1.1");

        assertEquals(3, response.skipped());
        assertEquals(1, response.generated());
        assertEquals("Câu đúng chuẩn?", response.questions().get(0).content());
    }

    @Test
    @DisplayName("không xác định được đáp án đúng thì để null, tuyệt đối không đoán bừa")
    void leavesCorrectAnswerNullWhenUnresolvable() {
        gateway.responding("""
                {"questions":[
                  {"content":"Câu hỏi?","options":["1","2","3","4"],"correctAnswer":"5"},
                  {"content":"Thiếu đáp án?","options":["1","2","3","4"]}
                ]}""");

        AiQuizGenerateResponse response = service().generate(request(2), TEACHER, "1.1.1.1");

        assertEquals(2, response.generated());
        assertEquals(2, response.needsManualAnswer());
        assertNull(response.questions().get(0).correctAnswer());
        assertNull(response.questions().get(1).correctAnswer());
    }

    @Test
    @DisplayName("khớp đáp án không phân biệt hoa thường và khoảng trắng thừa")
    void resolvesAnswerIgnoringCaseAndWhitespace() {
        gateway.responding("""
                {"questions":[
                  {"content":"Câu hỏi?","options":["Một","Hai","Ba","Bốn"],"correctAnswer":"  một "}
                ]}""");

        AiQuizGenerateResponse response = service().generate(request(1), TEACHER, "1.1.1.1");

        assertEquals(0, response.needsManualAnswer());
        assertNotNull(response.questions().get(0).correctAnswer());
    }

    @Test
    @DisplayName("bóc được JSON bị bọc trong markdown fence")
    void handlesMarkdownFencedJson() {
        gateway.responding("Đây là câu trả lời:\n```json\n{\"questions\":[{\"content\":\"Câu?\","
                + "\"options\":[\"a\",\"b\",\"c\",\"d\"],\"correctAnswer\":\"a\"}]}\n```\nHết.");

        AiQuizGenerateResponse response = service().generate(request(1), TEACHER, "1.1.1.1");

        assertEquals(1, response.generated());
        assertEquals("Câu?", response.questions().get(0).content());
    }

    @Test
    @DisplayName("chấp nhận mảng JSON thuần, không bọc trong object")
    void acceptsBareArray() {
        gateway.responding("""
                [{"content":"Câu?","options":["a","b","c","d"],"correctAnswer":"a"}]""");

        assertEquals(1, service().generate(request(1), TEACHER, "1.1.1.1").generated());
    }

    @Test
    @DisplayName("JSON hỏng thì thử lại đúng số lần cho phép rồi mới báo lỗi")
    void retriesThenFails() {
        gateway.responding(i -> i == 0 ? "không phải json" : "vẫn không phải json");

        assertThrows(AiErrors.InvalidModelResponse.class,
                () -> service().generate(request(1), TEACHER, "1.1.1.1"));

        // 1 lần đầu + số lần retry cấu hình (1)
        assertEquals(2, gateway.callCount());
    }

    @Test
    @DisplayName("JSON hỏng lần đầu thì lần sau hỏng lại nhưng vẫn ra kết quả")
    void recoversAfterRetry() {
        gateway.responding(i -> i == 0
                ? "lỡn"
                : "{\"questions\":[{\"content\":\"Câu?\",\"options\":[\"a\",\"b\",\"c\",\"d\"],\"correctAnswer\":\"a\"}]}");

        AiQuizGenerateResponse response = service().generate(request(1), TEACHER, "1.1.1.1");

        assertEquals(1, response.generated());
        assertEquals(2, gateway.callCount());
    }

    @Test
    @DisplayName("từ chối số câu vượt giới hạn trước khi gọi LLM")
    void rejectsCountOverLimit() {
        AiErrors.InvalidRequest error = assertThrows(AiErrors.InvalidRequest.class,
                () -> service().generate(request(21), TEACHER, "1.1.1.1"));

        assertTrue(error.getMessage().contains("20"));
        assertEquals(0, gateway.callCount(), "Phải chặn trước khi gọi model");
    }

    @Test
    @DisplayName("học sinh không được sinh câu hỏi khi bật yêu cầu giáo viên")
    void studentsCannotGenerateQuestions() {
        AiProperties staffOnly = TestFixtures.aiProperties();
        AiQuizGenerationService service = new AiQuizGenerationService(gateway,
                new AiPromptFactory(staffOnly), new AiRateLimiter(staffOnly), staffOnly, objectMapper);

        assertThrows(AiErrors.Forbidden.class, () -> service.generate(request(1), STUDENT, "1.1.1.1"));
        assertEquals(0, gateway.callCount());
    }

    @Test
    @DisplayName("không sinh được câu nào hợp lệ thì báo lỗi rõ ràng thay vì trả danh sách rỗng")
    void failsWhenNothingValid() {
        gateway.responding("{\"questions\":[{\"content\":\"\",\"options\":[],\"correctAnswer\":\"x\"}]}");

        AiErrors.InvalidModelResponse error = assertThrows(AiErrors.InvalidModelResponse.class,
                () -> service().generate(request(1), TEACHER, "1.1.1.1"));

        assertTrue(error.getMessage().contains("đúng cấu trúc"));
    }

    @Test
    @DisplayName("lỗi hạ tầng được nâng thành lỗi có kiểu, không lộ chi tiết kỹ thuật")
    void propagatesProviderFailure() {
        gateway.failingWith(StubAiChatGateway.unavailable());

        AiErrors.ProviderUnavailable error = assertThrows(AiErrors.ProviderUnavailable.class,
                () -> service().generate(request(1), TEACHER, "1.1.1.1"));

        assertEquals(503, error.getStatus().value());
    }

    @Test
    @DisplayName("câu hỏi luôn kèm cảnh báo 'bản nháp' để không ai tưởng đã lưu vào DB")
    void alwaysWarnsThatResultIsDraft() {
        gateway.responding("{\"questions\":[{\"content\":\"Câu?\",\"options\":[\"a\",\"b\",\"c\",\"d\"],\"correctAnswer\":\"a\"}]}");

        AiQuizGenerateResponse response = service().generate(request(1), TEACHER, "1.1.1.1");

        assertFalse(response.warnings().isEmpty());
        assertTrue(response.warnings().stream().anyMatch(w -> w.contains("bản nháp")));
    }

    @Test
    @DisplayName("prompt không chứa id hay thông tin bí mật của người dùng")
    void promptCarriesNoSecrets() {
        gateway.responding("{\"questions\":[{\"content\":\"Câu?\",\"options\":[\"a\",\"b\",\"c\",\"d\"],\"correctAnswer\":\"a\"}]}");

        service().generate(request(1), TEACHER, "1.1.1.1");

        String prompt = gateway.prompts().get(0);
        assertFalse(prompt.contains("u1"), "Không được đưa id người dùng vào prompt");
        assertFalse(prompt.toLowerCase().contains("api_key"));
        assertFalse(prompt.toLowerCase().contains("bearer "));
        assertTrue(List.of(gateway.lastSystemPrompt().content()).stream().allMatch(s -> s.contains("JSON")));
    }
}