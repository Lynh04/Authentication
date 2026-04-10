import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Hàm phụ trợ: Tạo Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// 1. Đăng ký
export const registerUser = async ({ email, password, name }) => {
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('EMAIL_EXIST');
    }

    // Model sẽ tự động hash password nhờ pre('save')
    const newUser = await User.create({ email, password, name });

    return newUser;
};

// 2. Đăng nhập
export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });

    // Kiểm tra email
    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    // Kiểm tra password (dùng hàm method của Model)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('INVALID_CREDENTIALS');
    }

    // Tạo Token
    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    };
};