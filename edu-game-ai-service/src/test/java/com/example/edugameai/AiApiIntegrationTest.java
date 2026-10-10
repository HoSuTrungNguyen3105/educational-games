package com.example.edugameai;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.startsWith;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Optional;

import com.example.edugameai.client.AiChatGateway;
import com.example.edugameai.client.CoreBackendClient;
import com.example.edugameai.dto.core.CoreUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Kiểm tra ở mức HTTP: envelope response, xác thực và phân quyền.
 *
 * <p>Chạy với rate limit tắt và không nạp file {@code .env} để test không phụ thuộc
 * môi trường của máy đang chạy.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "edu.ai.env-file=-",
        "edu.ai.rate-limit.enabled=false",
        "edu.core.enabled=true"
})
class AiApiIntegrationTest {

    private static final String VALID_TOKEN = "token-hoc-sinh-hop-le";
    private static final String TEACHER_TOKEN = "token-giao-vien-hop-le";
    private static final String BAD_TOKEN = "token-hong-hop-le";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CoreBackendClient coreBackendClient;

    @MockitoBean
    private AiChatGateway aiChatGateway;

    @BeforeEach
    void setUp() {
        when(coreBackendClient.authenticate(any(String.class))).thenReturn(Optional.empty());
        when(coreBackendClient.authenticate(startsWith("token-hoc-sinh")))
                .thenReturn(Optional.of(new CoreUser("u1", "binh", "Bình", "student")));
        when(coreBackendClient.authenticate(startsWith("token-giao-vien")))
                .thenReturn(Optional.of(new CoreUser("t1", "lan", "Cô Lan", "teacher")));
        when(coreBackendClient.listResults()).thenReturn(List.of());
        when(coreBackendClient.gameIndex()).thenReturn(java.util.Map.of());

        when(aiChatGateway.complete(any(AiChatGateway.AiMessage.class), any())).thenReturn("Câu trả lời từ AI.");
        when(aiChatGateway.completeJson(any(AiChatGateway.AiMessage.class), any()))
                .thenReturn("{\"questions\":[{\"content\":\"Câu?\",\"options\":[\"a\",\"b\",\"c\",\"d\"],"
                        + "\"correctAnswer\":\"a\"}]}");
        when(aiChatGateway.health()).thenReturn(AiChatGateway.HealthStatus.ok("Ollama sẵn sàng"));
    }

    @Test
    @DisplayName("thiếu token thì trả 401 theo đúng envelope của hệ thống")
    void missingTokenIsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/ai/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"Xin chào\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(false))
                .andExpect(jsonPath("$.code").value(401))
                .andExpect(jsonPath("$.data").doesNotExist())
                .andExpect(jsonPath("$.msg").isNotEmpty());
    }

    @Test
    @DisplayName("token không hợp lệ thì trả 401, không lộ lý do cụ thể")
    void invalidTokenIsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/ai/chat")
                        .header("Authorization", "Bearer " + BAD_TOKEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"Xin chào\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(false))
                .andExpect(jsonPath("$.code").value(401));
    }

    @Test
    @DisplayName("token hợp lệ thì trả 200 kèm envelope và data đúng cấu trúc")
    void validTokenGetsAnswer() throws Exception {
        mockMvc.perform(post("/api/ai/chat")
                        .header("Authorization", "Bearer " + VALID_TOKEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"Quy đồng 1/2 và 1/3 thế nào?\","
                                + "\"subject\":\"Toán\",\"conversationId\":\"c1\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(true))
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.msg").value("success"))
                .andExpect(jsonPath("$.data.answer").isNotEmpty())
                .andExpect(jsonPath("$.data.conversationId").value("c1"));
    }

    @Test
    @DisplayName("thiếu message bị chặn bằng validation 400 trước khi gọi model")
    void blankMessageIsBadRequest() throws Exception {
        mockMvc.perform(post("/api/ai/chat")
                        .header("Authorization", "Bearer " + VALID_TOKEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(false))
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.msg").isNotEmpty());
    }

    @Test
    @DisplayName("học sinh không sinh được câu hỏi — 403")
    void studentCannotGenerateQuestions() throws Exception {
        mockMvc.perform(post("/api/ai/quizzes/generate")
                        .header("Authorization", "Bearer " + VALID_TOKEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"subject\":\"Toán\",\"grade\":5,\"topic\":\"Phân số\","
                                + "\"difficulty\":\"medium\",\"count\":3}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(false))
                .andExpect(jsonPath("$.code").value(403));
    }

    @Test
    @DisplayName("giáo viên sinh được câu hỏi theo đúng schema của hệ thống")
    void teacherCanGenerateQuestions() throws Exception {
        mockMvc.perform(post("/api/ai/quizzes/generate")
                        .header("Authorization", "Bearer " + TEACHER_TOKEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"subject\":\"Toán\",\"grade\":5,\"topic\":\"Phân số\","
                                + "\"difficulty\":\"medium\",\"count\":3}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(true))
                .andExpect(jsonPath("$.data.questions[0].id").isNotEmpty())
                .andExpect(jsonPath("$.data.questions[0].options[0].id").isNotEmpty())
                .andExpect(jsonPath("$.data.questions[0].timeLimit").isNumber())
                .andExpect(jsonPath("$.data.questions[0].points").isNumber());
    }

    @Test
    @DisplayName("quantity (tên cũ) vẫn được chấp nhận để không phá client cũ")
    void legacyQuantityFieldStillWorks() throws Exception {
        mockMvc.perform(post("/api/ai/quizzes/generate")
                        .header("Authorization", "Bearer " + TEACHER_TOKEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"subject\":\"Toán\",\"grade\":5,\"topic\":\"Phân số\","
                                + "\"difficulty\":\"medium\",\"quantity\":3}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.requested").value(3));
    }

    @Test
    @DisplayName("endpoint cũ vẫn trả đúng shape: options là mảng chuỗi")
    void legacyEndpointKeepsItsShape() throws Exception {
        mockMvc.perform(post("/api/ai/generate-question")
                        .header("Authorization", "Bearer " + TEACHER_TOKEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"subject\":\"Toán\",\"grade\":5,\"topic\":\"Phân số\","
                                + "\"difficulty\":\"medium\",\"quantity\":2}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(true))
                .andExpect(jsonPath("$.data.questions[0].content").isNotEmpty())
                .andExpect(jsonPath("$.data.questions[0].options[0]").isString())
                .andExpect(jsonPath("$.data.questions[0].correctAnswer").isNotEmpty())
                .andExpect(jsonPath("$.data.questions[0].points").isNumber());
    }

    @Test
    @DisplayName("học sinh không xem được phân tích của người khác — 403")
    void studentCannotAnalyzeOtherStudent() throws Exception {
        mockMvc.perform(post("/api/ai/learning-analysis")
                        .header("Authorization", "Bearer " + VALID_TOKEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"studentId\":\"u-khac\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(403));
    }

    @Test
    @DisplayName("phân tích của chính mình trả 200 kèm metrics do Java tính")
    void studentCanAnalyzeOwnData() throws Exception {
        mockMvc.perform(post("/api/ai/learning-analysis")
                        .header("Authorization", "Bearer " + VALID_TOKEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(true))
                .andExpect(jsonPath("$.data.metrics.totalPlays").value(0))
                .andExpect(jsonPath("$.data.dataSufficient").value(false))
                .andExpect(jsonPath("$.data.summary").isNotEmpty());
    }

    @Test
    @DisplayName("health không cần token và không bao giờ lộ API key")
    void healthIsPublicAndLeaksNothing() throws Exception {
        mockMvc.perform(get("/api/ai/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(true))
                .andExpect(jsonPath("$.data.status").value(true))
                .andExpect(jsonPath("$.data.hasApiKey").exists())
                .andExpect(jsonPath("$.data.apiKey").doesNotExist())
                .andExpect(jsonPath("$.data.api-key").doesNotExist());
    }

    @Test
    @DisplayName("endpoint lạ trả 404 theo envelope, không phải lỗi HTML mặc định")
    void unknownEndpointReturnsEnvelope() throws Exception {
        mockMvc.perform(post("/api/ai/khong-ton-tai")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(false))
                .andExpect(jsonPath("$.code").value(404));
    }

    @Test
    @DisplayName("body không phải JSON trả 400 thay vì 500")
    void malformedBodyIsBadRequest() throws Exception {
        mockMvc.perform(post("/api/ai/chat")
                        .header("Authorization", "Bearer " + VALID_TOKEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{không phải json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(false))
                .andExpect(jsonPath("$.code").value(400));
    }
}