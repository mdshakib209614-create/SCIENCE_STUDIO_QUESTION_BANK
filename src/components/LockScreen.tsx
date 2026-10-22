import React, { useState } from 'react';
import { 
  User, 
  KeyRound, 
  LogIn, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Atom
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import scienceStudioBannerImg from '../assets/images/science_studio_login_banner_1791956839878.jpg';

export const LockScreen: React.FC = () => {
  const { isLocked, login } = useApp();
  const [userId, setUserId] = useState('admin');
  const [inputPass, setInputPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPass, setShowPass] = useState(false);

  if (!isLocked) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setErrorMsg('Please enter your User ID');
      return;
    }
    if (!inputPass.trim()) {
      setErrorMsg('Please enter your Password');
      return;
    }

    const success = login(userId.trim(), inputPass.trim());
    if (!success) {
      setErrorMsg('ভুল ইউজার আইডি বা পাসওয়ার্ড! সঠিক তথ্য দিন।');
      setTimeout(() => setErrorMsg(''), 4500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center lg:justify-start p-4 sm:p-6 lg:pl-16 xl:pl-28 font-['Hind_Siliguri',sans-serif] overflow-y-auto min-h-screen">
      {/* 
        Background Banner:
        High-resolution professional classroom & study scene on right, spacious soft focus on left
      */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-1000"
        style={{ 
          backgroundImage: `url(${scienceStudioBannerImg})`,
          backgroundPosition: 'center right',
          backgroundSize: 'cover'
        }}
      />
      
      {/* Subtle overlay for optimal glassmorphism contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/15 pointer-events-none" />

      {/* 
        Transparent Login Box:
        Strictly adhering to user requirements:
        - Box is transparent with background banner (backdrop-blur, subtle border)
        - Top: Logo
        - Below logo: SCIENCE STUDIO in English
        - Only User ID and Password fields
        - Unnecessary elements completely removed
      */}
      <div className="relative z-10 w-full max-w-sm bg-black/30 sm:bg-black/35 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-7 sm:p-9 text-white transition-all my-auto">
        
        {/* Top Logo */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#78988b] to-[#749fa0] text-white flex items-center justify-center shadow-lg shadow-[#749fa0]/30 border border-white/25 mb-3.5 transform transition-transform hover:scale-105">
            <Atom className="w-9 h-9 animate-spin-slow text-white" />
          </div>
          
          {/* Brand Name in English */}
          <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase font-sans drop-shadow-sm">
            SCIENCE STUDIO
          </h1>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-400/40 text-red-200 rounded-xl text-xs flex items-center gap-2 backdrop-blur-sm animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-300" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Clean Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* User ID Field */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-white/90">
              User ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/60">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="login-username-input"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder="Enter User ID"
                className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-[#c0dfe1] rounded-xl text-white placeholder-white/45 outline-none transition backdrop-blur-xs"
                autoFocus
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-white/90">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/60">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                id="login-password-input"
                value={inputPass}
                onChange={e => setInputPass(e.target.value)}
                placeholder="Enter Password"
                className="w-full pl-10 pr-10 py-2.5 text-xs font-mono bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-[#c0dfe1] rounded-xl text-white placeholder-white/45 outline-none transition tracking-wide backdrop-blur-xs"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white cursor-pointer transition"
                tabIndex={-1}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Login Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="btn-login-submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-[#78988b] to-[#749fa0] hover:from-[#6a877b] hover:to-[#638c8d] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#78988b]/30 transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/20 active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
