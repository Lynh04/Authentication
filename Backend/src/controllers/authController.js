import * as authService from '../services/authService.js';
import { success, error } from '../utils/response.js';

export const register = async (req, res) => {
    try {
        const newUser = await authService.registerUser(req.body);
        return success(res, 'Đăng ký thành công', newUser, 201);
    } catch (err) {
        return error(res, 'Lỗi hệ thống', 500, err.message);
    }
};

export const login = async (req, res) => {
    try {
        const data = await authService.loginUser(req.body);
        return success(res, 'Đăng nhập thành công', data);
    } catch (err) {
        return error(res, 'Lỗi hệ thống', 500, err.message);
    }
};

// Hàm này cần đăng nhập mới gọi được
export const getMe = (req, res) => {
    // req.user đã có sẵn nhờ middleware 'protect'
    return success(res, 'Lấy thông tin thành công', req.user);
};