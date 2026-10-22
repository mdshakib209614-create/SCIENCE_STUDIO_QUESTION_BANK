import React from 'react';
import { 
  Menu, 
  LogOut, 
  Sparkles,
  UserCheck,
  Atom
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleMobileMenu 
}) => {
  const { logout, currentUser, setActiveTab, userProfile, institution } = useApp();

  // Founder / Director Sakib Ahmed
  const adminDisplayName = userProfile?.name || 'Sakib Ahmed';

  return (
    <header className="bg-gradient-to-r from-[#05110c] via-[#0d261b] to-[#05110c] border-b-[3px] border-[#d4af37] shadow-[0_12px_36px_rgba(0,0,0,0.65),0_0_20px_rgba(212,175,55,0.22)] sticky top-0 z-30 shrink-0 print:hidden no-print select-none transition-all">
      {/* Thick / Tall Header Container */}
      <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 min-h-[96px] sm:min-h-[110px] md:min-h-[120px] lg:min-h-[128px] flex items-center justify-between gap-4 md:gap-6">
        
        {/* Left Section: Mobile Menu Button & Prominent Large "SCIENCE STUDIO" + Official Logo */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 min-w-0">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-[#eae8d9] border border-white/20 transition cursor-pointer shrink-0 shadow-md"
            aria-label="Open Menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-[#f7e4a1]" />
          </button>

          {/* Official Logo at Full Header Level */}
          <div className="w-13 h-13 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 p-1 sm:p-1.5 flex items-center justify-center shrink-0 border-2 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.4)] overflow-hidden">
            {institution?.logoUrl ? (
              <img 
                src={institution.logoUrl} 
                alt="Institution Logo" 
                className="w-full h-full object-contain filter drop-shadow-md" 
              />
            ) : (
              <Atom className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#f7e4a1]" />
            )}
          </div>

          <div className="flex flex-col justify-center min-w-0">
            {/* Main Title: Stylish modern English SCIENCE STUDIO as requested */}
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[54px] 2xl:text-[60px] font-black tracking-wider uppercase font-sans leading-none bg-gradient-to-r from-white via-amber-200 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] select-none">
                SCIENCE STUDIO
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-extrabold uppercase tracking-widest bg-amber-400/20 border border-amber-300/40 text-amber-200 shadow-xs">
                PRO
              </span>
            </div>
            <span className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-widest uppercase text-emerald-300/80 font-sans mt-1 hidden xs:block">
              ACADEMIC MANAGEMENT & EXAM SYSTEM
            </span>
          </div>
        </div>

        {/* 
          Right Section: 
          [Round Non-Clickable Profile Avatar] -> [Logout Icon]
        */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 shrink-0">

          {/* Completely Circular Profile Avatar Badge (Click Disabled / Non-clickable) */}
          <div
            title={adminDisplayName}
            className="relative rounded-full ring-2 sm:ring-[3px] ring-[#d4af37] p-0.5 shadow-[0_0_16px_rgba(212,175,55,0.45)] bg-[#07130e] shrink-0 pointer-events-none select-none cursor-default"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-[#0a1f16] flex items-center justify-center">
              <img 
                src={userProfile?.avatarUrl || "/src/assets/images/admin_avatar_1791955080118.jpg"} 
                alt={adminDisplayName}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[#d4af37]" />
            </div>
            {/* Active online status indicator */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-400 border-2 border-[#07130e] rounded-full shadow-[0_0_8px_#10b981]"></span>
          </div>

          {/* Logout Icon Action */}
          <button
            onClick={logout}
            title="Logout"
            className="p-2.5 sm:p-3 md:px-3.5 md:py-3 rounded-2xl bg-gradient-to-br from-rose-950/70 via-rose-900/50 to-red-950/80 hover:from-rose-900 hover:to-red-800 text-rose-200 hover:text-white border-2 border-rose-500/50 hover:border-rose-400 shadow-[0_4px_16px_rgba(225,29,72,0.35)] transition-all duration-200 cursor-pointer flex items-center gap-2 group shrink-0 active:scale-95"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-rose-300 group-hover:text-white transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden xl:inline text-xs sm:text-sm font-bold text-rose-100 group-hover:text-white uppercase font-sans">
              Logout
            </span>
          </button>

        </div>
      </div>
    </header>
  );
};
