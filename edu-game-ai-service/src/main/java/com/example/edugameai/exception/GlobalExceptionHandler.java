package com.example.edugameai.exception;

import com.example.edugameai.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

/**
 * Chuẩn hoá mọi lỗi về đúng envelope mà backend chính tại đang dùng:
 * {@code {status, code, msg, data}} (xem {@code server/src/utils/response.js}).
 *
 * <p>Không bao giờ trả stack trace, tên biến môi trường hay giá trị bí mật ra frontend.
 * Chi tiết kỹ thuật chỉ nằm trong log phía server.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(AiException.class)
    public ResponseEntity<ApiResponse<Object>> handleAi(AiException ex, HttpServletRequest req) {
        HttpStatus status = ex.getStatus();
        if (status.is5xxServerError()) {
            log.warn("[{} {}] AI error: {}", req.getMethod(), req.getRequestURI(), ex.getMessage(), ex);
        } else {
            log.info("[{} {}] {} - {}", req.getMethod(), req.getRequestURI(), status.value(), ex.getMessage());
        }
        return ResponseEntity.status(status).body(ApiResponse.error(status.value(), ex.getMessage()));
    }

    /** Bean Validation trên {@code @Valid @RequestBody}. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .orElse("Dữ liệu gửi lên không hợp lệ.");
        return ResponseEntity.badRequest().body(ApiResponse.error(400, msg));
    }

    @ExceptionHandler({ HttpMessageNotReadableException.class,
            MissingServletRequestParameterException.class,
            MethodArgumentTypeMismatchException.class })
    public ResponseEntity<ApiResponse<Object>> handleBadRequestBody(Exception ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error(400, "Body hoặc tham số gửi lên không hợp lệ."));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Object>> handleMethod(HttpRequestMethodNotSupportedException ex) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(ApiResponse.error(405, "Phương thức " + ex.getMethod() + " không được hỗ trợ."));
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(NoHandlerFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(404, "Không tìm thấy endpoint: " + ex.getRequestURL()));
    }

    /** Chặn chốn: không để lỗi lạ lọt ra message kèm chi tiết nội bộ. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleUnexpected(Exception ex, HttpServletRequest req) {
        log.error("[{} {}] Lỗi không lường trước", req.getMethod(), req.getRequestURI(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "AI Service gặp lỗi nội bộ. Vui lòng thử lại sau."));
    }
}