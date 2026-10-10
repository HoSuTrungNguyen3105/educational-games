package com.example.edugameai.dto.analysis;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

import com.example.edugameai.dto.core.CoreGame;
import com.example.edugameai.dto.core.CoreResult;
import com.example.edugameai.exception.AiErrors;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Yêu cầu phân tích kết quả học tập.
 *
 * <p>Kiến trúc đích: Backend chính đã xác thực người dùng, đã lấy và đã lọc dữ liệu học tập
 * trong phạm vi quyền, rồi truyền xuống {@link #results()} + {@link #games()}. AI Service
 * vì vậy KHÔNG gọi ngược lại {@code /results} và {@code /games} — không còn request vòng
 * giữa hai backend.
 *
 * <p>Nếu {@code results} không có mặt (chế độ legacy, chạy thử trực tiếp), AI Service tự
 * đọc dữ liệu qua {@code CoreBackendClient} như trước.
 *
 * <p>Không có trường nào cho phép client tự khai báo điểm số: mọi chỉ số đều do Java tính
 * từ dữ liệu truyền vào. {@code studentId} là TUỲ CHỌN và KHÔNG ĐƯỢC TIN — service vẫn
 * kiểm tra lại theo vai trò của người gọi.
 *
 * @param results  lượt chơi đã được Backend chính lọc theo người dùng/ngày/game (tuỳ chọn)
 * @param games    danh sách game dùng để đổi {@code gameId} thành tên/môn/chủ đề (tuỳ chọn)
 */
public record AiLearningAnalysisRequest(

        @Size(max = 64, message = "studentId không được dài quá 64 ký tự")
        String studentId,

        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "from phải có định dạng yyyy-MM-dd")
        String from,

        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "to phải có định dạng yyyy-MM-dd")
        String to,

        @Size(max = 64, message = "gameId không được dài quá 64 ký tự")
        String gameId,

        @Valid
        @Size(max = 2000, message = "results chỉ nhận tối đa 2000 lượt chơi")
        List<CoreResult> results,

        @Valid
        @Size(max = 2000, message = "games chỉ nhận tối đa 2000 game")
        List<CoreGame> games) {

    /** Backend chính đã truyền dữ liệu xuống → không cần gọi vòng lại. */
    public boolean hasInlineData() {
        return results != null;
    }

    /**
     * Rút gọn: chỉ có bộ lọc, chưa có dữ liệu truyền vào (chế độ legacy).
     * JSON contract không đổi — hai trường mới là tuỳ chọn và mặc định là {@code null}.
     */
    public AiLearningAnalysisRequest(String studentId, String from, String to, String gameId) {
        this(studentId, from, to, gameId, null, null);
    }

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