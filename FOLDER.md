# Cấu trúc Thư mục Dự án (Project Folder Structure)

Tài liệu này liệt kê và giải thích tác dụng của từng thư mục trong dự án **Luvina SRC** (Fullstack Spring Boot & Next.js).

---

## ⚙️ Backend (Spring Boot)
Thư mục gốc: `/Backend`

| Thư mục | Tác dụng |
| :--- | :--- |
| `src/main/java/com/luvina/la/config` | Chứa các lớp cấu hình hệ thống (CORS, Security, Web Configuration). |
| `src/main/java/com/luvina/la/config/jwt` | Cấu hình bảo mật bằng JSON Web Token (Filter, Provider, Entry Point). |
| `src/main/java/com/luvina/la/controller` | Nơi định nghĩa các API Endpoints, tiếp nhận request từ Frontend. |
| `src/main/java/com/luvina/la/dto` | Chứa các Data Transfer Objects dùng chung để chuyển đổi dữ liệu giữa các lớp. |
| `src/main/java/com/luvina/la/entity` | Định nghĩa các thực thể (Entities) tương ứng với các bảng trong Database (JPA). |
| `src/main/java/com/luvina/la/mapper` | Chứa các lớp hoặc logic để chuyển đổi qua lại giữa Entity và DTO. |
| `src/main/java/com/luvina/la/payload` | Chứa các DTO chuyên biệt cho Request và Response của các API cụ thể (ví dụ: LoginRequest, EmployeeResponse). |
| `src/main/java/com/luvina/la/repository` | Lớp truy xuất dữ liệu (Data Access Layer), sử dụng Spring Data JPA để tương tác với DB. |
| `src/main/java/com/luvina/la/service` | Định nghĩa các Interface chứa logic nghiệp vụ (Business Logic). |
| `src/main/java/com/luvina/la/service/impl` | Triển khai (Implementation) các logic nghiệp vụ đã định nghĩa trong Service. |
| `src/main/java/com/luvina/la/validate` | Chứa logic kiểm tra tính hợp lệ của dữ liệu (Validation) trước khi xử lý nghiệp vụ. |
| `src/main/resources` | Chứa file cấu hình (`application.yaml`), file thông báo lỗi (`messages.properties`) và cấu hình log. |

---

## 🌐 Frontend (Next.js)
Thư mục gốc: `/Frontend`

| Thư mục | Tác dụng |
| :--- | :--- |
| `app/` | Thư mục chính của Next.js (App Router), định nghĩa các Routes và Layouts. |
| `app/(auth)` | Chứa các trang liên quan đến xác thực (Login, Logout) không yêu cầu đăng nhập. |
| `app/(protected)` | Chứa các trang yêu cầu người dùng phải đăng nhập mới có quyền truy cập (Employee List, Detail, Form). |
| `components/` | Chứa các React Components dùng chung (Button, Input, Table, Layout components). |
| `hooks/` | Chứa các Custom Hooks xử lý logic state và API cho từng màn hình (ví dụ: `useAdm002`, `useAdm004`). |
| `lib/api` | Định nghĩa các hàm gọi API sử dụng Axios để tương tác với Backend. |
| `lib/constants` | Lưu trữ các hằng số, mã lỗi, và cấu hình tĩnh của hệ thống. |
| `lib/utils` | Các hàm tiện ích dùng chung (Format ngày tháng, xử lý chuỗi, Error Helper). |
| `lib/validation` | Định nghĩa Schema validation cho các form (thường dùng Zod). |
| `types/` | Định nghĩa các TypeScript Interfaces và Types cho toàn bộ ứng dụng. |
| `public/` | Lưu trữ các tài nguyên tĩnh như ảnh, icons, fonts. |

---

## 📂 Các thư mục khác

- **Design Flow**: Chứa các ảnh thiết kế, sơ đồ logic hoặc luồng hoạt động của dự án.
- **MockHTML**: Chứa các file HTML/CSS tĩnh dùng để tham khảo giao diện trước khi code React.
- **SRC**: Chứa các tài liệu hướng dẫn và quy chuẩn chung của Agent AI (Ame).

---
*Tài liệu này được cập nhật tự động bởi Ame vào ngày 07/05/2026.*
