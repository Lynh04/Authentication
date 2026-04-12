import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    googleId: { type: String, default: null },
    avatar: { type: String, default: 'https://tse1.mm.bing.net/th/id/OIP.-ZqsoSSdtfK3CaCZy17bnwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3' },
    authType: { type: String, enum: ['local', 'google'], default: 'local' }
}, { timestamps: true });

// 🔒 Middleware: Tự động mã hóa password trước khi lưu
userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 Method: Tự so sánh password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};



export default mongoose.model('User', userSchema);