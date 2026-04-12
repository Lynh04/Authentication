import express from 'express';
import { register, login, getMe, googleLoginController, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes (Ai cũng gọi được)
router.post('/register', register);
router.post('/login', login);

// Private Routes (Phải có Token mới gọi được)
// Dùng middleware protect chèn vào giữa
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

router.post('/google-login', googleLoginController);

export default router;