# Tài liệu Hệ thống Xác thực (Authentication System)

Dựa trên cấu trúc Backend hiện tại (`User Model`, `authController` và `authRoutes`), dưới đây là thiết kế chi tiết về Sitemap, Các trường dữ liệu và User Flow dành cho Frontend giao tiếp với Backend này.

## 1. Danh sách màn hình (Sitemap)
Hệ thống xác thực cơ bản cần 3 màn hình chính:
- **Màn hình Đăng ký (Register Screen)**: Cho phép người dùng mới tạo tài khoản.
- **Màn hình Đăng nhập (Login Screen)**: Cho phép người dùng đã có tài khoản truy cập vào hệ thống.
- **Màn hình Hồ sơ / Trang chủ (Profile / Home Screen)**: Màn hình sau khi đăng nhập thành công, hiển thị thông tin cá nhân.

---

## 2. Các trường dữ liệu hiển thị (Data fields)

### A. Màn hình Đăng ký
Người dùng cần nhập các thông tin sau:
- `Họ và tên (Name)`: Text input (Bắt buộc).
- `Email`: Email input (Bắt buộc, duy nhất).
- `Mật khẩu (Password)`: Password input (Bắt buộc, tối thiểu 6 ký tự).
- *Thành phần phụ*: Nút "Đăng ký" và Liên kết chuyển sang màn hình Đăng nhập (VD: "Bạn đã có tài khoản? Đăng nhập ngay").

### B. Màn hình Đăng nhập
- `Email`: Email input (Bắt buộc).
- `Mật khẩu (Password)`: Password input (Bắt buộc).
- *Thành phần phụ*: Nút "Đăng nhập" và Liên kết chuyển sang màn hình Đăng ký.

### C. Màn hình Hồ sơ / Trang chủ (Route bảo mật)
Dữ liệu lấy từ API `GET /me` bằng Token bảo mật:
- `Họ và tên (Name)`: Hiển thị văn bản.
- `Email`: Hiển thị văn bản.
- `Vai trò (Role)`: Hiển thị tùy chọn (user hoặc admin).
- *Thành phần phụ*: Nút "Đăng xuất" để xóa phiên đăng nhập.

---

## 3. Luồng người dùng (User Flow)

### Luồng 1: Đăng ký tài khoản mới
1. Người dùng truy cập **Màn hình Đăng ký**.
2. Điền đầy đủ thông tin: Tên, Email, Mật khẩu và nhấn "Đăng ký".
3. Frontend gửi request `POST /register` xuống phần Backend.
4. Backend lưu user mới, mã hóa mật khẩu ở database và trả về kết quả thành công.
5. Frontend hiển thị thông báo thành công và chuyển hướng người dùng sang **Màn hình Đăng nhập**.

### Luồng 2: Đăng nhập hệ thống
1. Người dùng truy cập **Màn hình Đăng nhập**.
2. Nhập Email và Mật khẩu, sau đó nhấn "Đăng nhập".
3. Frontend gửi request `POST /login`.
4. Backend kiểm tra tính hợp lệ và trả về dữ liệu (bao gồm Token xác thực).
5. Frontend lưu Token (ví dụ: vào `localStorage` hoặc thẻ `Cookie`) và chuyển hướng sang **Màn hình Hồ sơ / Trang chủ**.

### Luồng 3: Xem thông tin và Đăng xuất
1. Khi vào **Màn hình Hồ sơ**, Frontend tự động đính kèm Token bảo mật vào Request Headers và gọi API `GET /me`.
2. Backend kiểm tra Token hợp lệ và trả về thông tin user.
3. Frontend nhận dữ liệu và hiển thị Tên, Email, Vai trò lên màn hình.
4. Khi người dùng bấm nút **Đăng xuất**, Frontend sẽ tự động xóa Token đã lưu và chuyển hướng về lại **Màn hình Đăng nhập**. Lúc này, các route bảo mật trên Frontend cũng sẽ khóa lại không cho truy cập.
