// src/lib/api.js
// Nơi cấu hình API tổng quát để tái sử dụng ở mọi component

// Sử dụng chung 1 domain gốc thay vì khai báo '/api/...', nếu có đổi cổng chỉ cần đổi ở đây
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Hàm gọi API tổng quát (tự động đính kèm Token nếu có)
 * @param {string} endpoint - Đường dẫn con (Ví dụ: '/auth/login', '/auth/me')
 * @param {object} options - Các cấu hình thêm (method, body, v.v)
 * @returns {Promise<any>} - Dữ liệu JSON Object trả về
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Có lỗi xảy ra khi gọi API');
  }

  return data;
};
