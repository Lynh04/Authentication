import admin from "firebase-admin";
import dotenv from 'dotenv';
dotenv.config();

// Khởi tạo Firebase Admin bằng các biến môi trường
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '')
  .replace(/\\n/g, '\n') // Chuyển đổi ký tự \n thoát thành dấu xuống dòng thật
  .trim();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  }),
});

export default admin;