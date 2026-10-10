package com.example.edugameai.service.support;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Bóc JSON ra khỏi phần trả lời của LLM.
 *
 * <p>Model ngôn ngữ thường bọc JSON trong markdown fence (```json … ```), thêm lời dẫn
 * trước/sau, hoặc sinh dấu ```` ``` ```` thừa. Hàm này chỉ tìm phần JSON hợp lệ nhất —
 * BƯỚC TIẾP THEO vẫn phải validate nghiêm ngặt, tuyệt đối không tin nội dung.
 */
public final class JsonPayloads {

    private static final char[] OPENERS = {'{', '['};

    private JsonPayloads() {
    }

    /**
     * @return {@link JsonNode} đã parse, hoặc {@code null} nếu không tìm thấy JSON hợp lệ
     */
    public static JsonNode extract(ObjectMapper mapper, String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String text = stripFences(raw);

        JsonNode direct = tryParse(mapper, text);
        if (direct != null) {
            return direct;
        }

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c != '{' && c != '[') {
                continue;
            }
            int end = findMatching(text, i);
            if (end > i) {
                JsonNode node = tryParse(mapper, text.substring(i, end + 1));
                if (node != null) {
                    return node;
                }
            }
        }
        return null;
    }

    private static JsonNode tryParse(ObjectMapper mapper, String text) {
        try {
            JsonNode node = mapper.readTree(text);
            return node == null || node.isMissingNode() ? null : node;
        } catch (Exception e) {
            return null;
        }
    }

    /** Tìm dấu đóng tương ứng, bỏ qua dấu `` và `` bên trong chuỗi. */
    private static int findMatching(String text, int start) {
        char open = text.charAt(start);
        char close = open == '{' ? '}' : ']';
        int depth = 0;
        boolean inString = false;
        boolean escaped = false;

        for (int i = start; i < text.length(); i++) {
            char c = text.charAt(i);
            if (inString) {
                if (escaped) {
                    escaped = false;
                } else if (c == '\\') {
                    escaped = true;
                } else if (c == '"') {
                    inString = false;
                }
                continue;
            }
            if (c == '"') {
                inString = true;
            } else if (c == open) {
                depth++;
            } else if (c == close) {
                depth--;
                if (depth == 0) {
                    return i;
                }
            }
        }
        return -1;
    }

    /** Bỏ fence ```` ```json ```` nếu có. */
    private static String stripFences(String raw) {
        String text = raw.strip();
        if (!text.startsWith("```")) {
            return text;
        }
        int firstNewline = text.indexOf('\n');
        if (firstNewline < 0) {
            return text;
        }
        String withoutOpen = text.substring(firstNewline + 1);
        int lastFence = withoutOpen.lastIndexOf("```");
        return (lastFence >= 0 ? withoutOpen.substring(0, lastFence) : withoutOpen).strip();
    }

    /** Đọc chuỗi từ node, trả về {@code null} nếu thiếu hoặc không phải chuỗi. */
    public static String text(JsonNode node, String field) {
        if (node == null) {
            return null;
        }
        JsonNode v = node.get(field);
        return asText(v);
    }

    /** Đọc một node bất kỳ thành chuỗi (dùng cho mảng phương án dạng {@code ["a","b"]}). */
    public static String asText(JsonNode value) {
        if (value == null || value.isNull() || !value.isValueNode()) {
            return null;
        }
        String s = value.asText("");
        return s.isBlank() ? null : s;
    }

    /** Đọc số nguyên, chấp nhận cả JSON number lẫn chuỗi số. */
    public static Integer integer(JsonNode node, String field) {
        if (node == null) {
            return null;
        }
        JsonNode v = node.get(field);
        if (v == null || v.isNull()) {
            return null;
        }
        if (v.isNumber()) {
            return v.asInt();
        }
        if (v.isTextual()) {
            try {
                return Integer.valueOf(v.asText().strip());
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }
}