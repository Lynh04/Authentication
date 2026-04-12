import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { apiFetch } from '@/lib/api';

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      // Save token (apiFetch automatically throws if !ok, and resolves with parsed JSON)
      localStorage.setItem('token', data.data.token);

      // Redirect to profile
      navigate('/profile');
      // window.location.reload(); // Quick way to force context to update if needed
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // 1. Authenticate with Firebase
      const result = await signInWithPopup(auth, googleProvider);

      // 2. Get the Firebase ID token
      const idToken = await result.user.getIdToken();

      // 3. Send to backend
      const data = await apiFetch('/auth/google-login', {
        method: 'POST',
        body: JSON.stringify({ token: idToken })
      });

      // Save the returned access token
      localStorage.setItem('token', data.data.accessToken);

      // Redirect to profile
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Google Login Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#1F1B3E] flex items-center justify-center p-4 font-sans w-full">
      <div className="bg-[#2A234E] rounded-[24px] p-10 w-full max-w-[420px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
        {/* Subtle top glare/gradient effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#AD7BFF] to-transparent opacity-60"></div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#F4EDFF] mb-2 font-display">Welcome Back</h1>
          <p className="text-[#8B80A5] text-[15px]">Enter your details to access your portal</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">{error}</div>}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-[#8B80A5] uppercase tracking-wider">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-[#6D638C]" />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                required
                className="pl-12 bg-[#211B3D] border-transparent focus-visible:ring-1 focus-visible:ring-[#AD7BFF] text-[#E0E0E0] h-12 rounded-xl text-[15px] placeholder:text-[#524A70] shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center">
              <Label className="text-[11px] font-bold text-[#8B80A5] uppercase tracking-wider">Password</Label>
              <a href="#" className="text-[13px] text-[#C498FF] hover:text-[#E2D2FE] transition-colors">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-[#6D638C]" />
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="pl-12 bg-[#211B3D] border-transparent focus-visible:ring-1 focus-visible:ring-[#AD7BFF] text-[#E0E0E0] h-12 rounded-xl text-[15px] placeholder:text-[#524A70] shadow-inner font-mono tracking-widest pt-3"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-3 pb-3">
            <Checkbox id="keep-signed-in" className="border-[#6D638C] bg-transparent data-[state=checked]:bg-[#B282FF] data-[state=checked]:border-[#B282FF] rounded h-[18px] w-[18px]" />
            <label htmlFor="keep-signed-in" className="text-[14px] text-[#CDC5DC] leading-none cursor-pointer select-none">
              Keep me signed in
            </label>
          </div>

          <Button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-[#D0A4FF] to-[#9955FF] hover:from-[#DFBEFF] hover:to-[#A76AFF] text-white h-[52px] rounded-xl text-[16px] font-medium transition-all shadow-[0_4px_14px_0_rgba(153,85,255,0.39)] disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'} <ArrowRight className="ml-2 h-[18px] w-[18px]" />
          </Button>
        </form>

        <div className="mt-8 mb-6 relative flex items-center justify-center">
          <div className="absolute w-full h-[1px] bg-[#3B3264]"></div>
          <span className="relative px-4 text-[11px] text-[#6D638C] font-semibold uppercase tracking-wider bg-[#2A234E] z-10">Or connect with</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button disabled={loading} type="button" onClick={handleGoogleLogin} variant="outline" className="bg-[#211B3D] border-transparent hover:bg-[#342A5C] text-[#CDC5DC] h-12 rounded-xl font-medium shadow-sm transition-colors border border-white/[0.02]">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-[18px] w-[18px] mr-2" />
            Google
          </Button>
          <Button variant="outline" className="bg-[#211B3D] border-transparent hover:bg-[#342A5C] text-[#CDC5DC] h-12 rounded-xl font-medium shadow-sm transition-colors border border-white/[0.02]">
            <svg className="h-[20px] w-[20px] mr-2 fill-current" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.43.916 3.98.967 1.611.043 2.65-1.42 3.64-2.875 1.144-1.68 1.615-3.31 1.638-3.398-.035-.015-3.176-1.217-3.21-4.823-.03-3.021 2.47-4.475 2.585-4.542-1.4-2.05-3.565-2.29-4.32-2.336-1.69-.115-3.32 1.057-4.108 1.057-.803 0-2.137-1.026-3.567-.991zm1.5-3.39c.813-.984 1.36-2.36 1.21-3.726-1.164.047-2.607.776-3.447 1.76-.67.77-1.268 2.152-1.082 3.486 1.303.11 2.62-.647 3.32-1.52z" /></svg>
            Apple
          </Button>
        </div>

        <p className="mt-8 text-center text-[14px] text-[#A297BE]">
          Don't have an account? <Link to="/register" className="text-[#E0C8FF] font-medium hover:text-white transition-colors">Register</Link>
        </p>
      </div>
    </div>
  );
}
