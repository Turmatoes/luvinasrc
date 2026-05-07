# Chi tiết Luồng Nghiệp vụ: Thêm mới nhân viên (Add Employee)

Tài liệu này mô tả chi tiết cách thức dữ liệu di chuyển từ Frontend (FE) qua Backend (BE) và lưu trữ vào Database (DB).

---

## 🟢 1. Giai đoạn tại Frontend (FE)

### Bước 1: Khởi đầu (ADM002)
- **Component**: `SearchForm.tsx`
- **Hành động**: Người dùng nhấn nút **新規追加 (Thêm mới)**.
- **Xử lý**: Hàm `onClick` gọi `router.push('/employees/adm004')` để chuyển hướng sang màn hình nhập liệu với form rỗng.

### Bước 2: Nhập liệu và Xác thực 2 lớp (ADM004)
- **Hook**: `useAdm004.ts`
- **Hành động**: Người dùng nhấn nút **確認 (Xác nhận)**.
- **Trình tự xử lý Tuần tự (Sequential Logic)**:

1.  **Lớp 1 - Client Validation (Zod)**:
    -   Ngay khi ấn nút, `react-hook-form` sử dụng `zodResolver` để kiểm tra các ràng buộc tĩnh (VD: không để trống, định dạng Email, mật khẩu khớp nhau).
    -   Nếu lỗi: Dừng lại và hiển thị lỗi ngay dưới field (không gọi xuống Backend).

2.  **Lớp 2 - Server Validation (API Handshake)**:
    -   Nếu Zod OK, hàm `onSubmit` gọi API `POST /employees/validate` (Hàm `employeeApi.validateEmployee`).
    -   **Tại Backend (`EmployeeValidate.java`)**: 
        -   Kiểm tra logic nghiệp vụ phức tạp: Trùng Login ID (`ER003`), Phòng ban/Chứng chỉ không tồn tại trong DB (`ER004`), Ngày kết thúc chứng chỉ phải sau ngày bắt đầu (`ER012`).
        -   **Kết quả trả về**: 
            -   **Nếu Lỗi**: Trả về `ErrorResponse` dạng `{ "code": "ERxxx", "params": ["Tên trường", "Giá trị"] }`.
            -   **Nếu Thành công**: Trả về `{ "code": "000" }`.

3.  **Xử lý kết quả tại Frontend**:
    -   **Nếu Backend báo lỗi**: Hàm `onSubmit` nhận response, dùng `getMessage(code, params)` để lấy nội dung lỗi tiếng Nhật và gọi `setError` để gán lỗi vào đúng vị trí field trên UI.
    -   **Nếu Backend báo OK (code 000)**:
        -   **Lưu Session**: Dữ liệu được đưa vào `sessionStorage` qua hàm `setEmployeeToSession`.
        -   **Điều hướng**: Gọi `router.push('/employees/adm005')` để chuyển sang màn hình xác nhận.

### Bước 3: Đăng ký chính thức (ADM005)
- **Hook**: `useAdm005.ts`
- **Hành động**: Người dùng nhấn nút **OK (Đăng ký)**.
- **Trình tự xử lý Tuần tự (Sequential Logic)**:

1.  **FE - Gọi API Lưu trữ**:
    -   Hàm `handleOK` lấy dữ liệu `formData` (đã được khôi phục từ `sessionStorage`).
    -   Gọi API `POST /employees` (Hàm `employeeApi.addEmployee`).

2.  **BE - Xử lý tại Controller & Service**:
    -   **Controller**: Tiếp nhận request và gọi Service.
    -   **Service (`EmployeeServiceImpl`)**: 
        -   Mở một **@Transactional**: Đảm bảo tất cả các lệnh SQL phải thành công cùng nhau, nếu một lệnh lỗi thì toàn bộ sẽ bị hủy (Rollback).
        -   Lưu thông tin vào bảng `employees`.
        -   Lưu thông tin chứng chỉ vào bảng `employees_certifications` (nếu có).
        -   Trả về mã thành công `MSG001` (hoặc lỗi hệ thống `ER015` nếu có sự cố DB).

3.  **FE - Xử lý Phản hồi**:
    -   **Nếu Thành công**: 
        -   Gọi `clearSessionData` để dọn dẹp bộ nhớ tạm.
        -   Điều hướng sang `router.push('/employees/adm006?type=add')`.
    -   **Nếu Thất bại**: Gọi `redirectToSystemError` để hiển thị trang lỗi hệ thống.

---

## 🔵 2. Giai đoạn tại Backend (BE)

### Bước 4: Tiếp nhận Request (Controller)
- **Class**: `EmployeeController.java`
- **Hàm**: `addEmployee(@RequestBody EmployeeRequest request)`
- **Xử lý**: Tiếp nhận Object `EmployeeRequest` chứa toàn bộ thông tin từ FE. Gọi `employeeValidate.validateEmployee` một lần nữa để đảm bảo an toàn dữ liệu.

### Bước 5: Xử lý Nghiệp vụ (Service)
- **Class**: `EmployeeServiceImpl.java`
- **Hàm**: `addEmployee(EmployeeRequest employeeRequest)`
- **Xử lý (Bọc trong @Transactional)**:
    1.  **Mapping**: Khởi tạo Object `Employee`, copy dữ liệu từ `employeeRequest` sang, mã hóa mật khẩu bằng `passwordEncoder`.
    2.  **Save Employee**: Gọi `employeeRepository.save(employee)` để lưu thông tin cơ bản.
    3.  **Mapping Certification**: Nếu có chứng chỉ, khởi tạo Object `EmployeeCertification`, liên kết với `Employee` vừa tạo.
    4.  **Save Certification**: Gọi `employeeCertificationRepository.save(employeeCertification)`.
    5.  **Error Handling**: Nếu có bất kỳ lỗi nào (DB down, lỗi parse...), hệ thống sẽ tự động **Rollback** và trả về mã lỗi `ER015`.

---

## 🟡 3. Giai đoạn tại Database (DB)

### Bước 6: Lưu trữ vĩnh viễn
- **Bảng `employees`**: Lưu thông tin cá nhân, login ID, mật khẩu đã mã hóa và ID phòng ban.
- **Bảng `employees_certifications`**: Lưu mối quan hệ giữa nhân viên và chứng chỉ (ID nhân viên, ID chứng chỉ, ngày cấp, ngày hết hạn, điểm số).

---

## 📊 Sơ đồ Luồng Tổng hợp (Best Case Scenario)



---
*Tài liệu được phân tích và tổng hợp bởi Ame - 07/05/2026.*
