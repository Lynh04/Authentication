import React, { useState, useEffect } from 'react';
import { Copy, Shield, LogOut, CheckCircle2, MapPin, CalendarDays, MonitorSmartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { apiFetch } from '@/lib/api';

export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Instead of forcing out, just fallback
          setUser({ name: 'Guest User', email: 'guest@example.com', role: 'guest' });
          setLoading(false);
          return;
        }

        const data = await apiFetch('/auth/me');

        setUser(data.data);
        setEditFormData({ name: data.data.name, email: data.data.email });
      } catch (err) {
        setError(err.message);
        // Fallback info instead of kicking user out for layout preview
        setUser({ name: 'Guest User', email: 'guest@example.com', role: 'guest' });
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const data = await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(editFormData),
      });
      setUser(data.data);
      setIsEditModalOpen(false);
      // Optional: success message
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#1F1B3E] flex items-center justify-center w-full"><div className="text-white">Loading...</div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#1F1B3E] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden w-full">
      {/* Background large text watermark */}
      <div className="absolute -left-10 -bottom-10 opacity-[0.03] pointer-events-none select-none">
        <h1 className="text-[250px] font-black text-white leading-none tracking-tighter">TH</h1>
      </div>

      <div className="text-center mb-10 z-10">
        <h1 className="text-4xl font-bold text-[#F4EDFF] mb-2 font-display">User Profile</h1>
        <p className="text-[#8B80A5] text-[15px]">Manage your premium identity and account security settings.</p>
      </div>

      <div className="bg-[#2A234E]/90 backdrop-blur-xl rounded-[24px] p-8 w-full max-w-[700px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative z-10 border border-white/[0.05]">

        <div className="flex items-center gap-6 mb-10">
          <div className="relative">
            <Avatar className="h-[110px] w-[110px] border-[3px] border-[#3B2C5C] shadow-lg">
              {/* <AvatarImage src={user.avatar ? user.avatar : "https://tse1.mm.bing.net/th/id/OIP.-ZqsoSSdtfK3CaCZy17bnwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3"} className="object-cover" /> */}
              {/* nếu user.avatar không có => dùng link image https://tse1.mm.bing.net/th/id/OIP.-ZqsoSSdtfK3CaCZy17bnwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3 */}
              <AvatarImage src={user.avatar ? user.avatar : "https://tse1.mm.bing.net/th/id/OIP.-ZqsoSSdtfK3CaCZy17bnwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3"} className="object-cover" />
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-[#A66CFF] rounded-full p-1 border-[3px] border-[#2A234E]">
              <CheckCircle2 className="h-[14px] w-[14px] text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-[#F4EDFF]">{user.name}</h2>
              <Badge className="bg-[#423164] hover:bg-[#423164] text-[#C498FF] text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border-none shadow-none">
                {user.role === 'admin' ? 'Administrator' : 'Premium User'}
              </Badge>
            </div>
            <p className="text-[#CDC5DC] text-[15px] mb-3">Product Designer & Digital Architect</p>
            <div className="flex items-center gap-5 text-[13px] text-[#8B80A5] font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-[14px] w-[14px]" /> San Francisco, CA
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-[14px] w-[14px]" /> Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '2024'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#211B3D] rounded-xl p-5 border border-white/[0.02]">
            <p className="text-[10px] font-bold text-[#6D638C] uppercase tracking-wider mb-1.5">Email Address</p>
            <div className="flex justify-between items-center text-[#E0E0E0]">
              <span className="font-medium text-[15px] truncate max-w-[200px]">{user.email}</span>
              <Copy className="h-4 w-4 cursor-pointer text-[#8B80A5] hover:text-white transition-colors" />
            </div>
          </div>

          <div className="bg-[#211B3D] rounded-xl p-5 border border-white/[0.02]">
            <p className="text-[10px] font-bold text-[#6D638C] uppercase tracking-wider mb-1.5">Account Role</p>
            <div className="flex items-center gap-2.5 text-[#E0E0E0]">
              <Shield className="h-[18px] w-[18px] text-[#A66CFF]" />
              <span className="font-medium text-[15px] capitalize">{user.role}</span>
            </div>
          </div>

          <div className="bg-[#211B3D] rounded-xl p-5 border border-white/[0.02]">
            <p className="text-[10px] font-bold text-[#6D638C] uppercase tracking-wider mb-1.5">Two-Factor Auth</p>
            <div className="flex items-center gap-2.5 text-[#E0E0E0]">
              <div className="h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="font-medium text-[15px]">Active</span>
            </div>
          </div>

          <div className="bg-[#211B3D] rounded-xl p-5 border border-white/[0.02]">
            <p className="text-[10px] font-bold text-[#6D638C] uppercase tracking-wider mb-1.5">Last Session</p>
            <div className="flex items-center gap-2.5 text-[#E0E0E0]">
              <span className="font-medium text-[15px]">2 hours ago • Chrome/macOS</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#D0A4FF] to-[#9955FF] hover:from-[#DFBEFF] hover:to-[#A76AFF] text-white h-11 px-8 rounded-xl font-medium transition-all shadow-[0_4px_14px_0_rgba(153,85,255,0.39)]">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#2A234E] border border-white/[0.1] text-[#F4EDFF] rounded-3xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-[#8B80A5]">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="bg-[#211B3D] border-transparent text-[#E0E0E0] h-12 rounded-xl"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="text-[#8B80A5]">Email Address</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="bg-[#211B3D] border-transparent text-[#E0E0E0] h-12 rounded-xl"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
                    className="border-[#423164] bg-transparent text-[#CDC5DC] hover:bg-[#342A5C] rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateLoading}
                    className="bg-gradient-to-r from-[#D0A4FF] to-[#9955FF] hover:from-[#DFBEFF] hover:to-[#A76AFF] text-white rounded-xl"
                  >
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Button onClick={handleLogout} variant="outline" className="border-[#423164] bg-transparent text-[#CDC5DC] hover:bg-[#342A5C] hover:text-white h-11 px-6 rounded-xl font-medium flex items-center gap-2 transition-colors">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
