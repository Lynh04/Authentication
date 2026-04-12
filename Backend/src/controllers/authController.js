import * as authService from '../services/authService.js';
import { success, error } from '../utils/response.js';
import User from "../models/userModel.js";
import admin from "../config/firebase.js";

import jwt from 'jsonwebtoken';

const generateToken = async (userId) => {
    // Generate compatible access token
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
    // For refresh token, just as a placeholder since model expects it. Best practice is longer expiry
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '365d',
    });
    return { accessToken, refreshToken };
};

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
};

export const googleLoginController = async (req, res) => {
    try {
        const { token: idToken } = req.body;

        // Token bắt buộc
        if (!idToken) {
            return error(res, "Token is required", 400, "TOKEN_REQUIRED");
        }

        // Kiểm tra format JWT (phải có 3 phần)
        const tokenParts = idToken.split(".");
        if (tokenParts.length !== 3) {
            return error(
                res,
                "Invalid token format. Firebase ID token must have 3 parts.",
                400,
                "INVALID_TOKEN_FORMAT",
            );
        }

        // Xác thực token Firebase
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        // Tìm user theo email
        let user = await User.findOne({ email });

        if (user) {
            // Nếu user có rồi → bổ sung thông tin Google nếu thiếu
            if (!user.googleId) {
                user.googleId = uid;
                user.avatar = picture || user.avatar;
                user.authType = "google";
                await user.save();
            }
        } else {
            // Nếu chưa có → tạo mới
            const randomPassword = Math.random().toString(36).slice(-8);

            user = await User.create({
                googleId: uid,
                email,
                name,
                avatar: picture,
                authType: "google",
                password: randomPassword,
            });
        }

        // Tạo token đăng nhập
        const tokens = await generateToken(user._id);

        // Lưu refresh token
        await User.findByIdAndUpdate(user._id, {
            refreshToken: tokens.refreshToken,
        });

        // Set cookie
        res.cookie("refreshToken", tokens.refreshToken, cookieOptions);

        // Response
        return success(res, "Đăng nhập thành công", {
            accessToken: tokens.accessToken,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
            },
        });
    } catch (error) {
        console.log("🚀 ~ googleLoginController ~ error:", error);

        // Lỗi token Không hợp lệ
        if (error.code === "auth/argument-error") {
            return error(
                res,
                "Invalid Firebase ID token format",
                400,
                "INVALID_TOKEN_FORMAT",
            );
        }

        // Token hết hạn
        if (error.code === "auth/id-token-expired") {
            return error(res, "Firebase ID token has expired", 401, "TOKEN_EXPIRED");
        }

        // Lỗi chung
        return error(res, "Authentication failed", 401, "AUTH_FAILED");
    }
};

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
        console.log(err);
        return error(res, 'Lỗi hệ thống', 500, err.message);
    }
};

// Hàm này cần đăng nhập mới gọi được
export const getMe = (req, res) => {
    // req.user đã có sẵn nhờ middleware 'protect'
    return success(res, 'Lấy thông tin thành công', req.user);
};

// Cập nhật thông tin profile
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            // Nếu có password mới thì mới đổi
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            return success(res, 'Cập nhật thông tin thành công', {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar
            });
        } else {
            return error(res, 'Không tìm thấy người dùng', 404, 'USER_NOT_FOUND');
        }
    } catch (err) {
        return error(res, 'Lỗi hệ thống', 500, err.message);
    }
};