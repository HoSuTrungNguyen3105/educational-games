/**
 * attendanceService.js - Service quản lý chấm công
 *
 * Chức năng:
 * - Chấm công đi học
 * - Lấy lịch sử chấm công
 * - Lấy thống kê chấm công theo tháng
 */

import { apiFetch } from './api.js';

export const attendanceService = {
  /**
   * Chấm công đi học cho một học sinh
   * @param {string} studentId - ID của học sinh
   * @param {string} date - Ngày chấm công (YYYY-MM-DD)
   * @param {string} status - Trạng thái ('present' | 'absent' | 'late')
   * @param {Object} notes - Ghi chú (optional)
   * @returns {Promise<Object>}
   */
  async checkIn(studentId, date, status, notes = {}) {
    return apiFetch('/attendance/checkin', {
      method: 'POST',
      body: { studentId, date, status, notes },
    });
  },

  /**
   * Lấy lịch sử chấm công của một học sinh
   * @param {string} studentId - ID của học sinh
   * @param {Object} options - Tùy chọn lọc
   * @param {string} options.month - Tháng (YYYY-MM)
   * @param {string} options.year - Năm (YYYY)
   * @returns {Promise<Array>}
   */
  async getStudentHistory(studentId, options = {}) {
    const params = new URLSearchParams();
    if (options.month) params.set('month', options.month);
    if (options.year) params.set('year', options.year);
    const qs = params.toString();
    return apiFetch(`/attendance/student/${encodeURIComponent(studentId)}${qs ? `?${qs}` : ''}`) || [];
  },

  /**
   * Lấy lịch sử chấm công của toàn bộ lớp
   * @param {string} classId - ID của lớp
   * @param {Object} options - Tùy chọn lọc
   * @param {string} options.month - Tháng (YYYY-MM)
   * @param {string} options.year - Năm (YYYY)
   * @returns {Promise<Array>}
   */
  async getClassHistory(classId, options = {}) {
    const params = new URLSearchParams();
    if (options.month) params.set('month', options.month);
    if (options.year) params.set('year', options.year);
    const qs = params.toString();
    return apiFetch(`/attendance/class/${encodeURIComponent(classId)}${qs ? `?${qs}` : ''}`) || [];
  },

  /**
   * Lấy thống kê chấm công theo tháng
   * @param {string} studentId - ID của học sinh
   * @param {string} month - Tháng (YYYY-MM)
   * @returns {Promise<Object>}
   */
  async getMonthlyStats(studentId, month) {
    return apiFetch(`/attendance/stats/${encodeURIComponent(studentId)}/${encodeURIComponent(month)}`);
  },

  /**
   * Xóa bản ghi chấm công (chỉ admin/teacher)
   * @param {string} attendanceId - ID của bản ghi
   * @returns {Promise<Object>}
   */
  async deleteRecord(attendanceId) {
    return apiFetch(`/attendance/${encodeURIComponent(attendanceId)}`, {
      method: 'DELETE',
    });
  },

  /**
   * Cập nhật bản ghi chấm công (chỉ admin/teacher)
   * @param {string} attendanceId - ID của bản ghi
   * @param {Object} data - Dữ liệu cập nhật
   * @returns {Promise<Object>}
   */
  async updateRecord(attendanceId, data) {
    return apiFetch(`/attendance/${encodeURIComponent(attendanceId)}`, {
      method: 'PATCH',
      body: data,
    });
  },
};
