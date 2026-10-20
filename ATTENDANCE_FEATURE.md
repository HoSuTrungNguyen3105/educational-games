# Tính năng Chấm công (Attendance)

## Tổng quan

Tính năng chấm công cho phép giáo viên chấm công đi học/nghỉ cho học sinh, và hiển thị lịch sử chấm công theo tháng. Tính năng chỉ hiển thị cho người dùng có quyền `attendance.view` và cho phép chấm công với quyền `attendance.checkin`.

## Các thành phần

### 1. Cấu hình quyền (`src/config/roles.js`)

Đã thêm các quyền mới:
- `attendance.view`: Xem lịch sử chấm công (mọi role đều có)
- `attendance.checkin`: Chấm công đi học (chỉ teacher và admin)

```javascript
// Quyền mặc định cho mọi role
export const BASE_PERMISSIONS = ["chat", "profile", "friends", "coins.view", "daily-tasks", "attendance.view"];

// Teacher có thêm quyền chấm công
teacher: {
  permissions: [
    // ... các quyền khác
    "attendance.view",
    "attendance.checkin",
  ],
}
```

### 2. Service (`src/services/attendanceService.js`)

Module gọi API cho chấm công:

```javascript
import { attendanceService } from './services/attendanceService.js';

// Chấm công cho học sinh
await attendanceService.checkIn(studentId, '2026-10-20', 'present');

// Lấy lịch sử chấm công của học sinh
const history = await attendanceService.getStudentHistory(studentId, {
  month: '2026-10',
  year: '2026'
});

// Lấy lịch sử chấm công của cả lớp
const classHistory = await attendanceService.getClassHistory(classId, {
  month: '2026-10',
  year: '2026'
});

// Lấy thống kê theo tháng
const stats = await attendanceService.getMonthlyStats(studentId, '2026-10');
```

### 3. Component Calendar (`src/components/attendance/AttendanceCalendar.jsx`)

Component hiển thị lịch chấm công:

```javascript
import { AttendanceCalendar } from './components/attendance/AttendanceCalendar.jsx';

<AttendanceCalendar
  year={2026}
  month={10}
  attendanceData={attendanceData}
  onDateClick={(date, status) => handleDateClick(date, status)}
  canCheckIn={hasPermission(user.role, 'attendance.checkin')}
/>
```

**Props:**
- `year`: Năm (number)
- `month`: Tháng (1-12)
- `attendanceData`: Mảng dữ liệu chấm công `[{ date: '2026-10-20', status: 'present' }]`
- `onDateClick`: Callback khi click vào ngày (chỉ khi `canCheckIn=true`)
- `canCheckIn`: Cho phép chấm công hay không

**Trạng thái:**
- `present`: Đi học (màu xanh lá)
- `absent`: Nghỉ (màu đỏ)
- `late`: Muộn (màu vàng)

### 4. Trang Chấm công (`src/pages/AttendancePage.jsx`)

Trang chính cho chấm công:

```javascript
// Route: /attendance
import AttendancePage from './pages/AttendancePage.jsx';

<AttendancePage userAuth={userAuth} studentId={studentId} />
```

**Tính năng:**
- Hiển thị lịch theo tháng
- Cho phép điều hướng tháng trước/sau
- Hiển thị thống kê (số ngày đi học, nghỉ, muộn)
- Cho phép chấm công nếu có quyền
- Tự động reload sau khi chấm công

### 5. Tích hợp vào ProfileScreen

Đã thêm nút "Chấm công" vào trang cá nhân:

```javascript
// Chỉ hiện khi có quyền attendance.view
{hasPermission(user.role, 'attendance.view') && (
  <button onClick={() => navigate('/attendance')}>
    Chấm công
  </button>
)}
```

## Backend API cần thiết

Để tính năng hoạt động, backend cần implement các endpoint sau:

```
POST   /api/attendance/checkin              - Chấm công
GET    /api/attendance/student/:id         - Lấy lịch sử học sinh
GET    /api/attendance/class/:id           - Lấy lịch sử lớp
GET    /api/attendance/stats/:id/:month    - Lấy thống kê tháng
DELETE /api/attendance/:id                 - Xóa bản ghi (admin/teacher)
PATCH  /api/attendance/:id                 - Cập nhật bản ghi (admin/teacher)
```

### Request/Response examples

#### POST /api/attendance/checkin

**Request:**
```json
{
  "studentId": "student123",
  "date": "2026-10-20",
  "status": "present",
  "notes": {}
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "_id": "att123",
    "studentId": "student123",
    "date": "2026-10-20",
    "status": "present",
    "checkedBy": "teacher123",
    "checkedAt": "2026-10-20T08:00:00Z"
  }
}
```

#### GET /api/attendance/student/:id?month=2026-10

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "_id": "att1",
      "studentId": "student123",
      "date": "2026-10-01",
      "status": "present",
      "checkedBy": "teacher123",
      "checkedAt": "2026-10-01T08:00:00Z"
    },
    {
      "_id": "att2",
      "studentId": "student123",
      "date": "2026-10-02",
      "status": "absent",
      "checkedBy": "teacher123",
      "checkedAt": "2026-10-02T08:00:00Z"
    }
  ]
}
```

## Cách sử dụng

### Cho giáo viên (có quyền chấm công)

1. Vào trang cá nhân
2. Click vào nút "Chấm công"
3. Xem lịch hiện tại
4. Click vào ngày để chấm công (toggle giữa đi học/nghỉ)
5. Xem thống kê ngay trên calendar

### Cho học sinh (chỉ xem)

1. Vào trang cá nhân
2. Click vào nút "Chấm công"
3. Xem lịch sử chấm công của mình
4. Không thể chỉnh sửa (không có quyền)

## Database Schema đề xuất

```javascript
// Collection: attendance
{
  _id: ObjectId,
  studentId: ObjectId,     // Reference to User
  classId: ObjectId,       // Reference to Class (optional)
  date: Date,              // YYYY-MM-DD
  status: String,          // 'present' | 'absent' | 'late'
  notes: Object,           // Additional notes
  checkedBy: ObjectId,     // Reference to User (teacher/admin)
  checkedAt: Date,         // Timestamp
  updatedAt: Date
}

// Indexes
db.attendance.createIndex({ studentId: 1, date: 1 }, { unique: true });
db.attendance.createIndex({ classId: 1, date: 1 });
db.attendance.createIndex({ date: 1 });
```

## Security considerations

1. **Chỉ teacher/admin có quyền chấm công**
   - Backend phải kiểm tra `attendance.checkin` permission
   - Frontend chỉ hiển thị UI khi có quyền

2. **Không cho phép học sinh chấm công cho người khác**
   - Backend phải validate `studentId` match với current user hoặc user có quyền

3. **Idempotency**
   - Nếu đã chấm công cho ngày đó, update thay vì tạo mới
   - Sử dụng unique index trên `{ studentId, date }`

4. **Audit trail**
   - Lưu `checkedBy` và `checkedAt` cho mọi bản ghi
   - Log mọi action chấm công

## Testing

### Test frontend

```javascript
// Test quyền
const canView = hasPermission('teacher', 'attendance.view'); // true
const canCheckIn = hasPermission('teacher', 'attendance.checkin'); // true
const canCheckInStudent = hasPermission('student', 'attendance.checkin'); // false

// Test calendar render
<AttendanceCalendar
  year={2026}
  month={10}
  attendanceData={[
    { date: '2026-10-01', status: 'present' },
    { date: '2026-10-02', status: 'absent' }
  ]}
  canCheckIn={true}
/>
```

### Test API (sau khi backend implement)

```bash
# Chấm công
curl -X POST http://localhost:5000/api/attendance/checkin \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"student123","date":"2026-10-20","status":"present"}'

# Lấy lịch sử
curl http://localhost:5000/api/attendance/student/student123?month=2026-10 \
  -H "Authorization: Bearer TOKEN"
```

## Future improvements

1. **Chấm công theo nhóm**: Cho phép chấm công nhiều học sinh cùng lúc
2. **Export/Import**: Xuất lịch sang Excel/CSV
3. **Nhắc nhở**: Tự động nhắc giáo viên chấm công
4. **Báo cáo**: Báo cáo tỉ lệ đi học theo tháng/năm
5. **QR Code**: Học sinh quét QR để tự chấm công
6. **Geo-fencing**: Chỉ chấm công khi ở trong phạm vi trường

## Troubleshooting

### Nút chấm công không hiện

- Kiểm tra user có quyền `attendance.view` không
- Xem console log để debug
- Kiểm tra `roles.js` đã được cập nhật chưa

### Không thể chấm công

- Kiểm tra user có quyền `attendance.checkin` không
- Backend phải implement endpoint `/api/attendance/checkin`
- Kiểm tra token authentication

### Lịch không load dữ liệu

- Kiểm tra endpoint `/api/attendance/student/:id`
- Kiểm tra studentId có đúng không
- Xem network tab trong DevTools

## Liên kết

- Document kiến trúc game: `GAME_ARCHITECTURE.md`
- Config roles: `src/config/roles.js`
- API docs: Backend API documentation
