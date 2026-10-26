import { IconCheck, IconClose } from '../ui/index.js';
/**
 * AttendanceCalendar.jsx - Component hiển thị lịch chấm công
 *
 * Chức năng:
 * - Hiển thị lịch theo tháng
 * - Hiển thị trạng thái chấm công (đi học, nghỉ, muộn)
 * - Cho phép click để chấm công (nếu có quyền)
 */

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export function AttendanceCalendar({
  year,
  month,
  attendanceData = [],
  onDateClick,
  canCheckIn = false,
}) {
  const [currentYear, setCurrentYear] = useState(year || new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(month || new Date().getMonth() + 1);

  // Tạo dữ liệu map từ date -> status
  const attendanceMap = useMemo(() => {
    const map = {};
    attendanceData.forEach((record) => {
      if (record.date) {
        map[record.date] = record.status;
      }
    });
    return map;
  }, [attendanceData]);

  // Lấy số ngày trong tháng
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Lấy ngày đầu tiên của tháng (0 = Sunday, 1 = Monday, ...)
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();

  // Tên ngày trong tuần
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Tên tháng
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ];

  // Xử lý tháng trước
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Xử lý tháng sau
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Lấy trạng thái của một ngày
  const getStatus = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendanceMap[dateStr] || null;
  };

  // Lấy màu theo trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'absent':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'late':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-50 text-gray-400 border-gray-200';
    }
  };

  // Lấy icon theo trạng thái
  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <IconCheck className="w-4 h-4" />;
      case 'absent':
        return <IconClose className="w-4 h-4" />;
      case 'late':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Xử lý click vào ngày
  const handleDateClick = (day) => {
    if (!canCheckIn) return;

    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const currentStatus = getStatus(day);

    // Toggle giữa present và absent
    const newStatus = currentStatus === 'present' ? 'absent' : 'present';

    if (onDateClick) {
      onDateClick(dateStr, newStatus);
    }
  };

  // Tính thống kê
  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const status = getStatus(day);
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'late') late++;
    }

    return { present, absent, late, total: present + absent + late };
  }, [attendanceMap, daysInMonth, currentYear, currentMonth]);

  return (
    <div className="w-full">
      {/* Header với navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-display text-lg font-bold text-ink">
          {monthNames[currentMonth - 1]} {currentYear}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 rounded-lg bg-green-50 border border-green-200">
          <div className="text-2xl font-bold text-green-700">{stats.present}</div>
          <div className="text-xs text-green-600">Đi học</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-red-50 border border-red-200">
          <div className="text-2xl font-bold text-red-700">{stats.absent}</div>
          <div className="text-xs text-red-600">Nghỉ</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-yellow-50 border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-700">{stats.late}</div>
          <div className="text-xs text-yellow-600">Muộn</div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-ink/60 py-2">
            {day}
          </div>
        ))}

        {/* Empty cells for days before first day of month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const status = getStatus(day);
          const statusColor = getStatusColor(status);
          const statusIcon = getStatusIcon(status);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={!canCheckIn}
              className={`
                aspect-square rounded-lg border flex flex-col items-center justify-center
                transition hover:scale-105 active:scale-95
                ${statusColor}
                ${canCheckIn ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              <span className="text-sm font-bold">{day}</span>
              {statusIcon}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-100 border border-green-300" />
          <span className="text-ink/60">Đi học</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-300" />
          <span className="text-ink/60">Nghỉ</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300" />
          <span className="text-ink/60">Muộn</span>
        </div>
      </div>
    </div>
  );
}
