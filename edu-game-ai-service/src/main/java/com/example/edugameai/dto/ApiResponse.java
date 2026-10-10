package com.example.edugameai.dto;

/**
 * Envelope response — BẢN SAO NGUYÊN VĂN của backend chính
 * ({@code server/src/utils/response.js}) để frontend chỉ cần một quy ước duy nhất.
 *
 * <pre>
 * { "status": true, "code": 200, "msg": "success", "data": { ... } }
 * </pre>
 *
 * Thứ tự field được giữ nguyên để JSON nhìn giống backend Node.
 */
public record ApiResponse<T>(boolean status, int code, String msg, T data) {

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, 200, "success", data);
    }

    public static <T> ApiResponse<T> ok(T data, String msg) {
        return new ApiResponse<>(true, 200, msg, data);
    }

    public static <T> ApiResponse<T> error(int code, String msg) {
        return new ApiResponse<>(false, code, msg, null);
    }
}