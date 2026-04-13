# Quy tắc Phát triển Backend

Tài liệu này tổng hợp các quy tắc phát triển Backend nhằm thống nhất quy trình code trong toàn bộ dự án.

## 1. File Controller

- Tên class phải có hậu tố là `Controller`.
- Controller phải được đặt trong package riêng biệt.
- Các message cấu hình và mô tả lỗi động phải được đặt trong file `.properties`.
- Không được truy cập trực tiếp vào lớp `Repository`.
- Tuyệt đối không trả về cho FrontEnd các đoạn mã HTML.
- Controller chỉ được gọi lớp `Service` thông qua `Interface`.
- Phải sử dụng đúng và phù hợp các phương thức HTTP như `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`...

## 2. File Logic (Service)

- Tên class phải có hậu tố là `Service`.
- Tất cả xử lý nghiệp vụ và chức năng phải được viết tại tầng `Service`.
- Các message cấu hình và mô tả lỗi động phải được đặt trong file `.properties`.
- Các hằng số và chuỗi dùng chung phải được tập trung trong một file khai báo hằng số chung.
- `Service` chỉ được gọi `Repository` thông qua `Interface`.

## 3. File Repository

- `Repository` phải triển khai `JpaRepository` hoặc `CrudRepository`.
- Khi cần mở rộng chức năng cơ bản, phải customize Repository bằng cách tạo `Custom Repository` và `CustomImpl`.
- Các xử lý join phức tạp giữa nhiều bảng phải được viết trong `Repository Custom`.
- `Repository` không được phép truy cập `Controller`.
- `Repository` không được phép truy cập `Service`.
- Trường hợp câu lệnh SQL quá phức tạp thì ưu tiên sử dụng SQL Native.

## 4. Entity và DTO

### Entity

- Dùng để giao tiếp trực tiếp với các bảng dữ liệu trong `Repository`.

### DTO

- Sử dụng cho các mục đích như mapping dữ liệu, nhận request từ client và trả response.

### Cấu trúc

- Chỉ chứa các phương thức getter và setter cho các thuộc tính.
- Khuyến khích sử dụng thư viện Lombok để tối giản mã nguồn.

## 5. SQL Native

- Khi sử dụng subquery phải hạn chế tối đa lượng dữ liệu trả về trong câu lệnh con.
- Khi sử dụng `LEFT JOIN` hoặc `RIGHT JOIN`, ưu tiên lấy bảng có ít dữ liệu để join với bảng có nhiều dữ liệu hơn.
- Các câu lệnh SQL tương tự nhau phải được viết thống nhất về cách xuống dòng, canh lề và định dạng để tăng khả năng cache của Database.
- Các điều kiện `LIKE` hoặc `OR` phải được đặt ở cuối, sau khi đã thu hẹp phạm vi dữ liệu bằng `AND`, `EXISTS`, `IN`...
- Chỉ `SELECT` những trường cần thiết.
- Tuyệt đối không sử dụng `SELECT *`.

## 6. Nguyên tắc áp dụng

- Tuân thủ đúng phân tầng: `Controller -> Service -> Repository`.
- Tách biệt rõ `Entity` và `DTO`, không sử dụng lẫn mục đích.
- Ưu tiên tính dễ bảo trì, dễ mở rộng và khả năng tối ưu truy vấn.
- Mọi thay đổi liên quan đến Backend trong dự án cần đối chiếu với tài liệu này trước khi triển khai.
