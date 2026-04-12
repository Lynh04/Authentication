import fs from 'fs';
import path from 'path';

const envPath = 'd:/Authentication/Backend/.env';
const jsonPath = 'd:/Authentication/Backend/auth-login-firebase.json';

const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const envContent = `PORT=3001
MONGO_URI=mongodb+srv://thuylinhnguyen201004:9mSWPRpW2coO4Eug@cluster0.hdtvvb7.mongodb.net
JWT_SECRET=IS6zFBCaiqkorGpqsFq0cMW0AUewjp2aoDQVZOa8OF75I04u6HQoAQiMdF43fouu
JWT_EXPIRE=30d
FIREBASE_PROJECT_ID=${json.project_id}
FIREBASE_CLIENT_EMAIL=${json.client_email}
FIREBASE_PRIVATE_KEY="${json.private_key.replace(/\n/g, '\\n')}"
`;

fs.writeFileSync(envPath, envContent);
console.log('.env updated successfully');
