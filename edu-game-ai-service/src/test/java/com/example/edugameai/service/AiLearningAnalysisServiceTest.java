package com.example.edugameai.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.util.List;
import java.util.Map;

import com.example.edugameai.TestFixtures;
import com.example.edugameai.client.CoreBackendClient;
import com.example.edugameai.client.StubAiChatGateway;
import com.example.edugameai.config.CoreApiProperties;
import com.example.edugameai.dto.analysis.AiLearningAnalysisRequest;
import com.example.edugameai.dto.analysis.AiLearningAnalysisResponse;
import com.example.edugameai.dto.core.CoreGame;
import com.example.edugameai.dto.core.CoreResult;
import com.example.edugameai.exception.AiErrors;
import com.example.edugameai.security.AuthenticatedUser;
import com.example.edugameai.service.support.AiPromptFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class AiLearningAnalysisServiceTest {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private static final AuthenticatedUser STUDENT =
            new AuthenticatedUser("u1", "binh", "Bình", "student", true);
    private static final AuthenticatedUser OTHER_STUDENT =
            new AuthenticatedUser("u2", "lan", "Lan", "student", true);
    private static final AuthenticatedUser TEACHER =
            new AuthenticatedUser("t1", "lan", "Cô Lan", "teacher", true);

    private final LearningMetricsCalculator calculator = new LearningMetricsCalculator();
    private CoreBackendClient coreBackendClient;
    private StubAiChatGateway gateway;

    @BeforeEach
    void setUp() {
        coreBackendClient = Mockito.mock(CoreBackendClient.class);
        when(coreBackendClient.properties())
                .thenReturn(new CoreApiProperties("http://localhost:5000/api",
                        Duration.ofSeconds(5), Duration.ofSeconds(20), true, 20));
        when(coreBackendClient.gameIndex()).thenReturn(Map.<String, CoreGame>of());
        gateway = new StubAiChatGateway().responding("""
                {"summary":"Tổng kết.","strengths":["Đạt 80% ở Phân số."],
                 "areasToImprove":["Quy đồng mẫu số còn yếu."],
                 "recommendations":["Luyện 10 câu về quy đồng mẫu số."],
                 "encouragement":"Cố lên!"}""");
    }

    private AiLearningAnalysisService service() {
        var props = TestFixtures.aiPropertiesPermissive();
        return new AiLearningAnalysisService(coreBackendClient, gateway, new AiPromptFactory(props),
                calculator, new AiRateLimiter(props), props, MAPPER);
    }

    private static CoreResult graded(String userId, int correct, int total, String createdAt) {
        return new CoreResult("r-" + createdAt, userId, "g1", 100.0, correct, total,
                total > 0 ? Math.round(correct * 100f / total) : 0, 30, 20.0, true, createdAt);
    }

    @Test
    @DisplayName("học sinh chỉ xem được phân tích của chính mình")
    void studentCannotAnalyzeAnotherStudent() {
        when(coreBackendClient.listResults()).thenReturn(List.of());

        AiErrors.Forbidden error = assertThrows(AiErrors.Forbidden.class,
                () -> service().analyze(
                        new AiLearningAnalysisRequest("u2", null, null, null), STUDENT, "1.1.1.1"));

        assertTrue(error.getMessage().contains("không có quyền"));
        // Phải chặn TRƯỚC khi đọc dữ liệu học sinh khác.
        verify(coreBackendClient, never()).listResults();
    }

    @Test
    @DisplayName("giáo viên được xem phân tích của học sinh khác")
    void teacherCanAnalyzeAnotherStudent() {
        when(coreBackendClient.listResults()).thenReturn(List.of(
                graded("u2", 4, 5, "2026-01-01T10:00:00Z"),
                graded("u2", 5, 5, "2026-01-02T10:00:00Z")));

        AiLearningAnalysisResponse response = service().analyze(
                new AiLearningAnalysisRequest("u2", null, null, null), TEACHER, "1.1.1.1");

        assertEquals(2, response.metrics().totalPlays());
        assertEquals(9, response.metrics().totalCorrectAnswers());
    }

    @Test
    @DisplayName("chỉ lấy kết quả của đúng người được xem, không lẫn dữ liệu người khác")
    void neverMixesOtherStudentsData() {
        when(coreBackendClient.listResults()).thenReturn(List.of(
                graded("u1", 5, 5, "2026-01-01T10:00:00Z"),
                graded("u2", 0, 5, "2026-01-02T10:00:00Z")));

        AiLearningAnalysisResponse response = service().analyze(
                new AiLearningAnalysisRequest(null, null, null, null), STUDENT, "1.1.1.1");

        assertEquals(1, response.metrics().totalPlays(), "Phải bỏ qua kết quả của học sinh khác");
        assertEquals(100, response.metrics().accuracy());
    }

    @Test
    @DisplayName("bỏ qua lượt chơi do client tự ghi điểm, không phải server chấm")
    void skipsUnverifiedResults() {
        CoreResult forged = new CoreResult("r-fake", "u1", "g1", 99999.0, 10, 10, 100, 5, 9999.0,
                false, "2026-01-01T10:00:00Z");
        when(coreBackendClient.listResults()).thenReturn(List.of(forged));

        AiLearningAnalysisResponse response = service().analyze(
                new AiLearningAnalysisRequest(null, null, null, null), STUDENT, "1.1.1.1");

        assertEquals(0, response.metrics().totalPlays());
    }

    @Test
    @DisplayName("khách chưa đăng nhập bị từ chối")
    void anonymousIsRejected() {
        assertThrows(AiErrors.Unauthenticated.class, () -> service().analyze(
                new AiLearningAnalysisRequest(null, null, null, null),
                AuthenticatedUser.anonymous(), "1.1.1.1"));
    }

    @Test
    @DisplayName("số liệu trong prompt chỉ là tổng hợp, không có tên hay id học sinh")
    void promptCarriesNoStudentIdentity() {
        when(coreBackendClient.listResults()).thenReturn(List.of(
                graded("u1", 4, 5, "2026-01-01T10:00:00Z"),
                graded("u1", 4, 5, "2026-01-02T10:00:00Z")));

        service().analyze(new AiLearningAnalysisRequest(null, null, null, null), STUDENT, "1.1.1.1");

        String prompt = gateway.prompts().get(0);
        assertFalse(prompt.contains("u1"), "Không được đưa id học sinh vào prompt");
        assertFalse(prompt.contains("Bình"), "Không được đưa tên học sinh vào prompt");
        assertFalse(prompt.toLowerCase().contains("api_key"));
        assertTrue(prompt.contains("Tỷ lệ đúng"), "Phải gửi số liệu đã tính cho LLM diễn giải");
    }

    @Test
    @DisplayName("AI lỗi hạ tầng thì vẫn trả kết quả nhờ phần tổng hợp bằng quy tắc của Java")
    void fallsBackWhenAiUnavailable() {
        gateway.failingWith(StubAiChatGateway.unavailable());
        when(coreBackendClient.listResults()).thenReturn(List.of(
                graded("u1", 2, 5, "2026-01-01T10:00:00Z"),
                graded("u1", 3, 5, "2026-01-02T10:00:00Z")));

        AiLearningAnalysisResponse response = service().analyze(
                new AiLearningAnalysisRequest(null, null, null, null), STUDENT, "1.1.1.1");

        // Metrics vẫn đúng vì do Java tính, phần diễn giải sinh bằng quy tắc.
        assertEquals(2, response.metrics().totalPlays());
        assertEquals(50, response.metrics().accuracy());
        assertTrue(response.summary().contains("lượt chơi"));
        assertFalse(response.recommendations().isEmpty());
    }

    @Test
    @DisplayName("AI trả JSON hỏng thì vẫn trả kết quả, không sập 500")
    void survivesMalformedModelOutput() {
        gateway.responding("tôi không biết trả lời");
        when(coreBackendClient.listResults()).thenReturn(List.of(
                graded("u1", 4, 5, "2026-01-01T10:00:00Z"),
                graded("u1", 4, 5, "2026-01-02T10:00:00Z")));

        AiLearningAnalysisResponse response = service().analyze(
                new AiLearningAnalysisRequest(null, null, null, null), STUDENT, "1.1.1.1");

        assertEquals(2, response.metrics().totalPlays());
        assertTrue(response.summary().contains("lượt chơi"));
    }

    @Test
    @DisplayName("không đủ dữ liệu thì báo rõ và không kết luận mạnh/yếu")
    void insufficientDataIsReported() {
        when(coreBackendClient.listResults()).thenReturn(List.of(graded("u1", 1, 2, "2026-01-01T10:00:00Z")));

        AiLearningAnalysisResponse response = service().analyze(
                new AiLearningAnalysisRequest(null, null, null, null), STUDENT, "1.1.1.1");

        assertFalse(response.dataSufficient());
        assertTrue(response.disclaimer().contains("chưa") || response.disclaimer().contains("ít"));
    }

    @Test
    @DisplayName("khoảng ngày sai định dạng bị từ chối trước khi đọc dữ liệu")
    void rejectsInvalidPeriod() {
        AiErrors.InvalidRequest error = assertThrows(AiErrors.InvalidRequest.class,
                () -> service().analyze(new AiLearningAnalysisRequest(null, "01-01-2026", null, null),
                        STUDENT, "1.1.1.1"));

        assertTrue(error.getMessage().contains("yyyy-MM-dd"));
    }

    @Test
    @DisplayName("lọc theo gameId khi client yêu cầu")
    void filtersByGameId() {
        CoreResult other = new CoreResult("r", "u1", "g2", 50.0, 1, 5, 20, 30, 10.0, true,
                "2026-01-02T10:00:00Z");
        when(coreBackendClient.listResults()).thenReturn(List.of(graded("u1", 5, 5, "2026-01-01T10:00:00Z"), other));

        AiLearningAnalysisResponse response = service().analyze(
                new AiLearningAnalysisRequest(null, null, null, "g1"), STUDENT, "1.1.1.1");

        assertEquals(1, response.metrics().totalPlays());
        assertEquals(5, response.metrics().totalQuestionsOffered());
    }

    @Test
    @DisplayName("học sinh gửi studentId của chính mình thì vẫn được xem")
    void studentCanRequestOwnDataById() {
        when(coreBackendClient.listResults()).thenReturn(List.of(graded("u1", 5, 5, "2026-01-01T10:00:00Z")));

        AiLearningAnalysisResponse response = service().analyze(
                new AiLearningAnalysisRequest("u1", null, null, null), STUDENT, "1.1.1.1");

        assertEquals(1, response.metrics().totalPlays());
    }

    @Test
    @DisplayName("không gọi được backend chính thì báo lỗi rõ ràng")
    void surfacesCoreBackendFailure() {
        when(coreBackendClient.listResults())
                .thenThrow(new AiErrors.CoreBackendUnavailable("Không kết nối được hệ thống dữ liệu."));

        assertThrows(AiErrors.CoreBackendUnavailable.class, () -> service().analyze(
                new AiLearningAnalysisRequest(null, null, null, null), STUDENT, "1.1.1.1"));

        verify(coreBackendClient).listResults();
    }

    @Test
    @DisplayName("không sinh prompt khi không có lượt chơi nào")
    void skipsLlmWhenNoData() {
        when(coreBackendClient.listResults()).thenReturn(List.of());

        AiLearningAnalysisResponse response = service().analyze(
                new AiLearningAnalysisRequest(null, null, null, null), STUDENT, "1.1.1.1");

        assertEquals(0, gateway.callCount());
        assertEquals(0, response.metrics().totalPlays());
        assertEquals("Chưa có dữ liệu lượt chơi để đánh giá.", response.summary());
    }
}