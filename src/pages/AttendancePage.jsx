import { IconBack, IconCalendar, Loader } from '../components/ui/index.js';
/**
 * AttendancePage.jsx - Trang chấm công
 *
 * Chức năng:
 * - Hiển thị lịch chấm công của học sinh
 * - Cho phép giáo viên chấm công
 * - Hiển thị thống kê chấm công
 */

import { useState, useEffect } from 'react';
import { navigate } from '../lib/router.js';
import { UserCheck, CircleAlert } from 'lucide-react';
import { AttendanceCalendar } from '../components/attendance/AttendanceCalendar.jsx';
import { attendanceService } from '../services/attendanceService.js';
import { hasPermission } from '../config/roles.js';

export default function AttendancePage({ userAuth, studentId = null }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(studentId);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [updating, setUpdating] = useState(false);

  // Kiểm tra quyền chấm công
  const canCheckIn = userAuth?.user?.role && hasPermission(userAuth.user.role, 'attendance.checkin');

  useEffect(() => {
    loadAttendanceData();
  }, [selectedStudent, currentMonth, currentYear]);

  async function loadAttendanceData() {
    setLoading(true);
    setError(null);

    try {
      const targetStudentId = selectedStudent || userAuth?.user?._id;

      if (!targetStudentId) {
        throw new Error('Không tìm thấy học sinh');
      }

      const data = await attendanceService.getStudentHistory(targetStudentId, {
        month: `${currentYear}-${String(currentMonth).padStart(2, '0')}`,
        year: currentYear,
      });

      setAttendanceData(data || []);
    } catch (err) {
      console.error('Lỗi tải dữ liệu chấm công:', err);
      setError(err.message || 'Không thể tải dữ liệu chấm công');
    } finally {
      setLoading(false);
    }
  }

  async function handleDateClick(date, status) {
    if (!canCheckIn) return;

    const targetStudentId = selectedStudent || userAuth?.user?._id;

    setUpdating(true);
    try {
      await attendanceService.checkIn(targetStudentId, date, status);

      // Reload data
      await loadAttendanceData();
    } catch (err) {
      console.error('Lỗi chấm công:', err);
      alert('Không thể chấm công: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setUpdating(false);
    }
  }

  function handleMonthChange(month, year) {
    setCurrentMonth(month);
    setCurrentYear(year);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <Loader label="Đang tải dữ liệu chấm công..." />
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 py-4 w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-1 text-sm text-ink/50 hover:text-ink transition"
        >
          <IconBack className="w-4 h-4" /> Về trang cá nhân
        </button>
        <div className="flex items-center gap-2">
          <IconCalendar className="w-4 h-4 text-gold" />
          <span className="font-display text-sm text-ink">Chấm công</span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-2xl p-4 bg-red-50 border border-red-200 flex items-start gap-3">
          <CircleAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">Lỗi</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="w-4 h-4 text-gold" />
          <span className="font-display text-sm text-ink">
            {selectedStudent ? 'Chấm công học sinh' : 'Lịch sử chấm công'}
          </span>
        </div>

        {canCheckIn && (
          <p className="text-xs text-ink/60 mb-4">
            Nhấn vào ngày để chấm công (đi học/nghỉ). Chỉ giáo viên có quyền chấm công.
          </p>
        )}

        <AttendanceCalendar
          year={currentYear}
          month={currentMonth}
          attendanceData={attendanceData}
          onDateClick={handleDateClick}
          canCheckIn={canCheckIn}
        />

        {updating && (
          <div className="mt-4 text-center text-xs text-ink/60 animate-pulse">
            Đang cập nhật...
          </div>
        )}
      </div>

      {/* Thống kê tổng */}
      <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
        <h4 className="font-display text-sm text-ink mb-3">Thống kê tháng này</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 rounded-xl bg-green-50 border border-green-200">
            <div className="text-2xl font-bold text-green-700">
              {attendanceData.filter((r) => r.status === 'present').length}
            </div>
            <div className="text-xs text-green-600">Ngày đi học</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-red-50 border border-red-200">
            <div className="text-2xl font-bold text-red-700">
              {attendanceData.filter((r) => r.status === 'absent').length}
            </div>
            <div className="text-xs text-red-600">Ngày nghỉ</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-yellow-50 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-700">
              {attendanceData.filter((r) => r.status === 'late').length}
            </div>
            <div className="text-xs text-yellow-600">Ngày muộn</div>
          </div>
        </div>
      </div>
    </div>
  );
}
