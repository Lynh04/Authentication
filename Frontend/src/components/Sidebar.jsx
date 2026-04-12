import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { UserPlus, LogIn, BadgeCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { apiFetch } from '@/lib/api';

export function Sidebar() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const data = await apiFetch('/auth/me');
        setUser(data.data);
      } catch (err) {
        console.error("Failed to fetch user in sidebar", err);
      }
    };

    fetchUser();
  }, [location.pathname]); // Re-fetch or verify on route change if needed

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "flex items-center gap-4 px-4 py-3.5 text-white bg-[#423164] rounded-2xl transition-colors shadow-lg"
      : "flex items-center gap-4 px-4 py-3.5 text-[#8A7EA6] hover:text-white hover:bg-white/5 rounded-2xl transition-colors";
  };

  const getIconClass = (path) => {
    return location.pathname === path ? "text-white" : "opacity-80";
  };

  return (
    <div className="w-[280px] h-screen bg-[#1F1B3E] text-white flex flex-col justify-between py-8 px-4 font-sans border-r border-[#3B3264]/50">
      <div>
        <div className="mb-12 px-4">
          <h1 className="text-3xl font-bold mb-1">Aura Auth</h1>
          <p className="text-xs text-[#8A7EA6] font-bold tracking-[0.2em] uppercase">Premium Identity</p>
        </div>

        <nav className="space-y-2">
          <Link to="/register" className={getLinkClass('/register')}>
            <UserPlus size={22} className={getIconClass('/register')} />
            <span className="font-medium text-[16px]">Registration</span>
          </Link>
          
          <Link to="/login" className={getLinkClass('/login')}>
            <LogIn size={22} className={getIconClass('/login')} />
            <span className="font-medium text-[16px]">Login</span>
          </Link>

          <Link to="/profile" className={getLinkClass('/profile')}>
            <BadgeCheck size={22} className={getIconClass('/profile')} />
            <span className="font-medium text-[16px]">Profile</span>
          </Link>
        </nav>
      </div>

      <div className="bg-[#2A234E] rounded-[20px] p-4 flex items-center gap-4 mx-2">
        <Avatar className="h-10 w-10 border border-white/10">
          <AvatarImage src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=200&auto=format&fit=crop" className="object-cover" />
          <AvatarFallback>{user ? user.name?.substring(0,2).toUpperCase() : 'GU'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-[15px] font-bold text-white leading-tight truncate w-[140px]">{user ? user.name : 'Guest'}</span>
          <span className="text-[13px] text-[#8A7EA6] font-medium capitalize">{user ? user.role : 'Unauthenticated'}</span>
        </div>
      </div>
    </div>
  );
}
