# Authentication API Documentation

Đây là tài liệu hướng dẫn về cấu trúc và cách tích hợp (integrate) các tính năng API hiện có trong dự án Backend. 

## Cấu Hình Base
- **Base URL**: `http://localhost:3001/api/auth`
- **Response Format chuẩn (JSON)**:
  Tất cả API đều sẽ trả về định dạng bọc ngoài (wrapper) như sau:
  ```json
  {
    "success": true,   // true nếu thành công, false nếu có lỗi
    "message": "...",  // Thông báo trả về
    "data": { ... }    // (Tùy chọn) Chứa dữ liệu nội dung khi xử lý thành công
  }
  ```

---

## Danh Sách Các API (Endpoints)

### 1. Đăng Ký Tài Khoản Mới (Local Register)
Tạo một tài khoản người dùng mới kèm mật khẩu được mã hóa an toàn.

- **Endpoint**: `POST /register`
- **Bảo mật**: Public
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "yourpassword"
  }
  ```
- **Xử lý Thành công (201)**: `data` là nguyên một Object chứa thông tin người dùng vừa được tạo.

### 2. Đăng Nhập Hệ Thống (Local Login)
Xác thực tài khoản và cấp JWT (JSON Web Token) dùng để duy trì đăng nhập.

- **Endpoint**: `POST /login`
- **Bảo mật**: Public
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "yourpassword"
  }
  ```
- **Xử lý Thành công (200)**: `data` sẽ chứa `token` xác thực và object `user` (id, email, name, role). Bạn cần đưa `token` này vào `localStorage` của Frontend để sử dụng ở các API khác.

### 3. Đăng Nhập Bằng Google (Firebase OAuth) 🌟 MỚI
Xác thực bằng dịch vụ Firebase. Nếu hệ thống chưa từng có người dùng này thì sẽ tự động tạo tài khoản (Tự động cấp random password để bảo mật nếu sau này họ muốn đổi), nếu đã có sẽ cập nhật liên kết.

- **Endpoint**: `POST /google-login`
- **Bảo mật**: Public
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "token": "<FIREBASE_ID_TOKEN_TỪ_FRONTEND>"
  }
  ```
- **Xử lý Thành công (200)**: 
  - `data.accessToken` sẽ chứa token được Firebase khởi tạo giúp đăng nhập.
  - Tự động Cài cắm Cookie HTTP-Only bảo vệ chuỗi Refresh Token vào trình duyệt.
  - `data.user` là chi tiết thông tin như `avatar`, `name`, `email`.

### 4. Lấy Thông Tin Cá Nhân (Get Current Profile)
Lấy thông tin của chính tài khoản đang đăng nhập trong máy. (Đã qua lớp kiểm duyệt Token bảo mật - Middleware `protect`).

- **Endpoint**: `GET /me`
- **Bảo mật**: Private (Bắt buộc phải có Authorization header)
- **Headers**: 
  ```http
  Authorization: Bearer <TOKEN_NHẬN_ĐƯỢC_TỪ_LOGIN>
  ```
- **Mô tả**: Nếu Token không hợp pháp hoặc bị hết hạn, API sẽ từ chối truy cập và trả về Status HTTP 401. Đảm bảo Frontend sẽ Clear cache và đẩy người dùng ra trang Đăng nhập để họ đăng nhập lại.
- **Xử lý Thành công (200)**: `data` sẽ chứa toàn bộ Profile thực tế lấy ngay từ Database (name, email, role, avatar, _id, createdAt...).

---

## Hướng Dẫn Frontend Tích Hợp
Trên Frontend, chỉ cần sử dụng file tiện ích có đường dẫn `src/lib/api.js` (nếu đã cấu hình) để thực hiện kết nối:

```javascript
import { apiFetch } from '@/lib/api';

// Gọi API dễ dàng như sau:
const response = await apiFetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email: "test@gmail.com", password: "hehe" })
});

// Không cần tự lo Token vì apiFetch mặc định xử lý nối chuỗi Bearer ở các API Private!
// Token nằm gọn ở:  response.data.token (Đối với Local Login) hoặc response.data.accessToken (OAuth)
```
