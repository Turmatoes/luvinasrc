# Quy tắc Phát triển Frontend

Tài liệu này tổng hợp các quy tắc phát triển Frontend nhằm thống nhất cách tổ chức mã nguồn, tái sử dụng thành phần và tối ưu hiệu năng trong dự án.

## 1. Kiến trúc Layout rõ ràng

- Phải phân tách rõ các thành phần như `Header`, `Home`, `Footer`.
- Sử dụng `layout.tsx` theo App Router hoặc layout pattern để định nghĩa cấu trúc chung cho toàn bộ ứng dụng.
- Tách riêng `Header`, `Footer` và `Main Content` thành các file riêng biệt.
- Tuyệt đối không hardcode layout bên trong từng trang `page` cụ thể.

## 2. Component Header và Footer có khả năng tái sử dụng

- Tạo các component `Header` và `Footer` trong thư mục `/components`.
- Import các component này vào `layout.tsx` để sử dụng chung cho toàn bộ ứng dụng.
- Không duplicate UI logic giữa các trang khác nhau.
- Đảm bảo giao diện hiển thị tốt trên nhiều thiết bị và giữ được tính nhất quán.

## 3. Tận dụng hệ sinh thái React và Next.js

### Tính năng có sẵn

- Ưu tiên sử dụng `next/image` để tối ưu dung lượng và hiển thị ảnh.
- Ưu tiên sử dụng `next/link` để điều hướng hiệu quả.
- Ưu tiên sử dụng `next/font` để tối ưu hóa font chữ.
- Áp dụng `Server Components` và `Client Components` một cách hợp lý theo đúng nhu cầu xử lý.

### Thư viện phổ biến

- UI: ưu tiên sử dụng các thư viện phổ biến như `MUI`, `Ant Design`, `Tailwind CSS`.
- Data fetching: có thể sử dụng `React Query` hoặc `SWR` khi phù hợp.

## 4. Sử dụng Hooks và Reusable Logic

- Tách các logic phức tạp ra thành custom hooks như `useAuth`, `useFetch`...
- Không viết các đoạn xử lý quá lớn trực tiếp trong component.
- Tránh lặp lại logic xử lý giữa nhiều component.

## 5. Tách UI và Logic theo hướng Clean Code

- Phần JSX giao diện phải nằm trong file component `.tsx`.
- Các logic xử lý API, transform dữ liệu phải được tách riêng vào các thư mục như `/services`, `/hooks`, `/utils`.
- Component chỉ nên chịu trách nhiệm chính về render giao diện và tương tác người dùng.

## 6. Data Modeling với TypeScript

- Phải tạo `type` hoặc `interface` cho tất cả dữ liệu sử dụng trong ứng dụng.
- Tuyệt đối không sử dụng kiểu `any`.
- Tách các model vào thư mục `/types` hoặc `/models`.
- Tái sử dụng các type chung giữa API và UI khi có thể.

## 7. Validation và Service Layer

- Luôn validate dữ liệu trước khi gọi API.
- Ưu tiên sử dụng các công cụ như `zod`, `react-hook-form` để validate input.
- Tạo lớp `Service` hoặc service layer chuyên biệt để gọi API.
- Không gọi API trực tiếp bên trong component.
- Tổ chức các API trong `/lib/api/...` hoặc phân chia theo từng domain nghiệp vụ.

## 8. Quản lý State hợp lý

- Sử dụng local state như `useState` cho các trạng thái UI nhỏ và cục bộ.
- Sử dụng global state như `Context API`, `Zustand`, `Redux` cho dữ liệu dùng chung toàn ứng dụng.
- Không lạm dụng global state quá mức cần thiết.
- Tránh truyền prop qua quá nhiều tầng gây ra prop drilling sâu.

## 9. Data Fetching đúng chuẩn Next.js

- Ưu tiên sử dụng `Server Components` để fetch dữ liệu trực tiếp khi phù hợp.
- Không fetch dư thừa các dữ liệu không cần thiết.
- Lựa chọn chiến lược fetch dữ liệu phải phù hợp với mục tiêu hiệu năng và trải nghiệm người dùng.

## 10. Nguyên tắc áp dụng

- Tuân thủ tách biệt rõ giữa layout, UI component, hooks, services và types.
- Ưu tiên khả năng tái sử dụng, dễ bảo trì và dễ mở rộng.
- Mọi thay đổi liên quan đến Frontend trong dự án cần đối chiếu với tài liệu này trước khi triển khai.
