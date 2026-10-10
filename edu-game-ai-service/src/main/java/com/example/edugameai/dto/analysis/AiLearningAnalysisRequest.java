package com.example.edugameai.dto.analysis;

import java.time.LocalDate;

import jakarta.validation.constraints.Pattern;

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
        return from == null || from.isBlank() ? null : LocalDate.parse(from);
    }

    public LocalDate toDate() {
        return to == null || to.isBlank() ? null : LocalDate.parse(to);
    }
}