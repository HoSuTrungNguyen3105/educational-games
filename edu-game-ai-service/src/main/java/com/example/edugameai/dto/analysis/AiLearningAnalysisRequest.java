package com.example.edugameai.dto.analysis;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

import com.example.edugameai.exception.AiErrors;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Yêu cầu phân tích kết quả học tập.
 *
 * <p>Request chỉ nhận BỘ LỌC. Không có trường nào cho phép client tự khai báo điểm số:
 * mọi chỉ số đều do Java tính từ dữ liệu thật của backend chính.
 *
 * <p>{@code studentId} là TUỲ CHỌN và KHÔNG ĐƯỢC TIN: học sinh chỉ xem được chính mình,
 * giáo viên/admin mới được xem người khác — việc này kiểm tra ở service, không kiểm tra
 * ở controller.
 */
public record AiLearningAnalysisRequest(

        @Size(max = 64, message = "studentId không được dài quá 64 ký tự")
        String studentId,

        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "from phải có định dạng yyyy-MM-dd")
        String from,

        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "to phải có định dạng yyyy-MM-dd")
        String to,

        @Size(max = 64, message = "gameId không được dài quá 64 ký tự")
        String gameId) {

    public LocalDate fromDate() {
        return parseDate(from, "from");
    }

    public LocalDate toDate() {
        return parseDate(to, "to");
    }

    /**
     * Chuyển chuỗi ngày thành {@link LocalDate}. Ném lỗi nghiệp vụ thay vì
     * {@code DateTimeParseException} để không bao giờ rơi vào nhánh lỗi 500.
     */
    private static LocalDate parseDate(String value, String field) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(value.strip());
        } catch (DateTimeParseException e) {
            throw new AiErrors.InvalidRequest(field + " phải có định dạng yyyy-MM-dd.");
        }
    }
}