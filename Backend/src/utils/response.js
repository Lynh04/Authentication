// src/utils/response.js

// Dùng khi xử lý thành công (Mặc định status 200)
export const success = (res, message, data = null) => {
    return res.status(200).json({
        success: true,
        message,
        data,
    });
};

// Dùng khi có lỗi (Mặc định status 400 - Bad Request)
export const error = (res, message, status = 400, errorCode = null) => {
    return res.status(status).json({
        success: false,
        message,
        errorCode,
    });
};