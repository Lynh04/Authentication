import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { apiFetch } from '@/lib/api';

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
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
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      // Automatically logic after successful register. Maybe redirect to login
      navigate('/login');
    } catch (err) {
      setError(err.message);
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
          <h1 className="text-4xl font-bold text-[#F4EDFF] mb-2 font-display">Create Account</h1>
          <p className="text-[#8B80A5] text-[15px]">Join the exclusive Aura Auth ecosystem</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">{error}</div>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-[#8B80A5] uppercase tracking-wider">Full Name</Label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 h-5 w-5 text-[#6D638C]" />
              <Input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Sterling" 
                required
                className="pl-12 bg-[#211B3D] border-transparent focus-visible:ring-1 focus-visible:ring-[#AD7BFF] text-[#E0E0E0] h-12 rounded-xl text-[15px] placeholder:text-[#524A70] shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-[#8B80A5] uppercase tracking-wider">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-[#6D638C]" />
              <Input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@aura-auth.io" 
                required
                className="pl-12 bg-[#211B3D] border-transparent focus-visible:ring-1 focus-visible:ring-[#AD7BFF] text-[#E0E0E0] h-12 rounded-xl text-[15px] placeholder:text-[#524A70] shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-[#8B80A5] uppercase tracking-wider">Secure Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-[#6D638C]" />
              <Input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••" 
                required
                minLength={6}
                className="pl-12 bg-[#211B3D] border-transparent focus-visible:ring-1 focus-visible:ring-[#AD7BFF] text-[#E0E0E0] h-12 rounded-xl text-[15px] placeholder:text-[#524A70] shadow-inner font-mono tracking-widest pt-3"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-[#D0A4FF] to-[#9955FF] hover:from-[#DFBEFF] hover:to-[#A76AFF] text-white h-[52px] rounded-xl text-[16px] font-medium transition-all shadow-[0_4px_14px_0_rgba(153,85,255,0.39)] disabled:opacity-50">
              {loading ? 'Processing...' : 'Register'}
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-[14px] text-[#A297BE]">
          Already have an account? <Link to="/login" className="text-[#E0C8FF] font-medium hover:text-white transition-colors">Login now</Link>
        </p>
      </div>
    </div>
  );
}
