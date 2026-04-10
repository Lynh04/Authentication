import jwt from 'jsonwebtoken';
import { error } from '../utils/response.js';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
    let token;

    // 1. Kiểm tra xem header có gửi Token không
    // Format chuẩn: "Bearer eyJhbGciOiJIUzI1..."
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy chuỗi token phía sau chữ "Bearer "
            token = req.headers.authorization.split(' ')[1];

            // 2. Giải mã Token (Verify)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Tìm user tương ứng với token đó và gắn vào req.user
            // req.user sẽ được dùng ở các Controller phía sau
            req.user = await User.findById(decoded.id).select('-password'); // Bỏ qua field password

            next(); // Cho phép đi tiếp
        } catch (err) {
            return error(res, 'Token không hợp lệ hoặc đã hết hạn', 401, 'TOKEN_INVALID');
        }
    }

    if (!token) {
        return error(res, 'Bạn chưa đăng nhập', 401, 'NOT_AUTHORIZED');
    }
};