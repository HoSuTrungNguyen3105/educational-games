package com.example.edugameai.service.support;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class JsonPayloadsTest {

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    @DisplayName("parse JSON thuần")
    void parsesPlainJson() {
        JsonNode node = JsonPayloads.extract(mapper, "{\"a\":1}");
        assertEquals(1, node.get("a").asInt());
    }

    @Test
    @DisplayName("bóc JSON ra khỏi markdown fence")
    void stripsMarkdownFence() {
        String raw = "```json\n{\"questions\":[{\"content\":\"x\"}]}\n```";
        JsonNode node = JsonPayloads.extract(mapper, raw);

        assertNotNull(node);
        assertEquals(1, node.get("questions").size());
    }

    @Test
    @DisplayName("bỏ lời dẫn trước và sau JSON")
    void skipsSurroundingProse() {
        String raw = "Đây là kết quả:\n{\"a\":2}\nHết.";
        assertEquals(2, JsonPayloads.extract(mapper, raw).get("a").asInt());
    }

    @Test
    @DisplayName("không vỡ với dấu ngoặc nằm trong chuỗi")
    void handlesBracesInsideStrings() {
        String raw = "{\"content\":\"Biểu thức {x + y} bằng bao nhiêu?\",\"n\":3}";
        JsonNode node = JsonPayloads.extract(mapper, raw);

        assertNotNull(node);
        assertEquals(3, node.get("n").asInt());
        assertTrueContainsBraces(node.get("content").asText());
    }

    @Test
    @DisplayName("không vỡ với dấu nháy đã escape trong chuỗi")
    void handlesEscapedQuotes() {
        String raw = "{\"content\":\"Gọi \\\"x\\\" bằng gì?\",\"n\":1}";
        JsonNode node = JsonPayloads.extract(mapper, raw);

        assertNotNull(node);
        assertEquals(1, node.get("n").asInt());
    }

    @Test
    @DisplayName("bỏ qua JSON hỏng rồi thử đoạn sau")
    void skipsMalformedPrefix() {
        String raw = "{không hợp lệ} {\"a\":7}";
        JsonNode node = JsonPayloads.extract(mapper, raw);

        assertNotNull(node);
        assertEquals(7, node.get("a").asInt());
    }

    @Test
    @DisplayName("trả null khi hoàn toàn không có JSON")
    void returnsNullWhenNoJson() {
        assertNull(JsonPayloads.extract(mapper, "xin chào, tôi không có JSON nào"));
        assertNull(JsonPayloads.extract(mapper, ""));
        assertNull(JsonPayloads.extract(mapper, null));
    }

    @Test
    @DisplayName("đọc field số dù là số hay chuỗi")
    void readsNumericFieldsLeniently() {
        JsonNode node = JsonPayloads.extract(mapper, "{\"a\":5,\"b\":\"7\",\"c\":\"x\"}");

        assertEquals(5, JsonPayloads.integer(node, "a"));
        assertEquals(7, JsonPayloads.integer(node, "b"));
        assertNull(JsonPayloads.integer(node, "c"));
        assertNull(JsonPayloads.integer(node, "missing"));
    }

    @Test
    @DisplayName("đọc mảng phương án dạng chuỗi thuần")
    void readsPlainStringArray() {
        JsonNode node = JsonPayloads.extract(mapper, "{\"options\":[\"a\",\"b\"]}");

        assertEquals("a", JsonPayloads.asText(node.get("options").get(0)));
        assertEquals("b", JsonPayloads.asText(node.get("options").get(1)));
    }

    private void assertTrueContainsBraces(String text) {
        assertEquals("Biểu thức {x + y} bằng bao nhiêu?", text);
    }
}