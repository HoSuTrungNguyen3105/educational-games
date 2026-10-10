package com.example.edugameai.exception;

import org.springframework.http.HttpStatus;

/**
 * Lỗi nghiệp vụ của AI Service. Mọi lỗi đều mang thông điệp ĐÃ AN TOÀN để trả ra ngoài —
 * không bao giờ chứa stack trace, tên biến bí mật hay nội dung nội bộ.
 */
public class AiException extends RuntimeException {

    private final HttpStatus status;

    public AiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public AiException(HttpStatus status, String message, Throwable cause) {
        super(message, cause);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}