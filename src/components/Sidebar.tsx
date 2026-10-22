import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  Award, 
  FileText, 
  CreditCard, 
  Bell, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Package, 
  X, 
  FilePlus2, 
  FolderArchive,
  Atom 
} from 'lucide-react';
import { useApp, NavSection } from '../context/AppContext';
import { toBengaliNumber } from '../utils/bengaliUtils';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { 
    activeTab, 
    setActiveTab, 
    institution, 
    students, 
    teachers, 
    questions, 
    savedExamPapers 
  } = useApp();

  const handleNavClick = (tab: NavSection) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-[#1c2d26]/80 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 
        Fixed Stationary Sidebar (Deep Forest Slate Green harmonized with #78988b & #b1c0a1) 
      */}
      <aside 
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-68 md:w-72 lg:w-72 bg-[#1c2d26] text-[#eae8d9] flex flex-col justify-between border-r border-[#2d443a] shrink-0 print:hidden select-none transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } no-print`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto scrollbar-thin">
          {/* Sidebar Top: Enlarged Logo & Prominent SCIENCE STUDIO aligned to Header Level */}
          <div className="px-4 py-3 sm:py-4 min-h-[96px] sm:min-h-[110px] md:min-h-[120px] lg:min-h-[128px] flex items-center justify-between border-b-[3px] border-[#d4af37] bg-gradient-to-r from-[#05110c] via-[#0d261b] to-[#05110c] shadow-md">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              {/* Enlarged Institution / Science Studio Logo */}
              <div className="w-13 h-13 sm:w-15 sm:h-15 md:w-16 md:h-16 rounded-2xl bg-white/10 p-1.5 flex items-center justify-center shrink-0 border-2 border-[#d4af37] shadow-[0_0_16px_rgba(212,175,55,0.35)] overflow-hidden">
                {institution.logoUrl ? (
                  <img 
                    src={institution.logoUrl} 
                    alt="Logo" 
                    className="w-full h-full object-contain filter drop-shadow-sm" 
                  />
                ) : (
                  <Atom className="w-8 h-8 sm:w-10 sm:h-10 text-[#f7e4a1]" />
                )}
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-base sm:text-lg md:text-xl font-black font-sans text-white tracking-wider uppercase leading-tight bg-gradient-to-r from-white via-amber-200 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] select-none">
                    SCIENCE STUDIO
                  </h2>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-400/20 border border-amber-300/40 text-amber-200 shrink-0">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-emerald-300/80 font-semibold tracking-wide truncate block mt-0.5">
                  {institution.nameBn || 'একাডেমিক ও এক্সাম সিস্টেম'}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 rounded-xl text-[#c0dfe1] hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5 text-amber-200" />
            </button>
          </div>

          {/* Navigation Items (All Options with Palette Colors) */}
          <nav className="p-3 space-y-1 text-xs">
            {/* 1. ড্যাশবোর্ড */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#eae8d9] text-[#1c2d26] font-bold shadow-xs'
                  : 'text-[#c0dfe1] hover:text-white hover:bg-[#78988b]/25'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-[#78988b]' : 'text-[#b1c0a1]'}`} />
              <span className="text-sm">ড্যাশবোর্ড</span>
            </button>

            {/* 2. প্রতিষ্ঠান পরিচিতি */}
            <button
              onClick={() => handleNavClick('institution')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'institution'
                  ? 'bg-[#eae8d9] text-[#1c2d26] font-bold shadow-xs'
                  : 'text-[#c0dfe1] hover:text-white hover:bg-[#78988b]/25'
              }`}
            >
              <School className={`w-4 h-4 ${activeTab === 'institution' ? 'text-[#78988b]' : 'text-[#b1c0a1]'}`} />
              <span className="text-sm">প্রতিষ্ঠান পরিচিতি</span>
            </button>

            {/* ----------------------------------------------------
                প্রশ্নপত্র বিভাগ
               ---------------------------------------------------- */}
            <div className="pt-2.5 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b1c0a1]">
                প্রশ্নপত্র ব্যবস্থাপনা
              </span>
            </div>

            {/* 3. নতুন প্রশ্নপত্র তৈরি */}
            <button
              onClick={() => handleNavClick('exam-questions')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'exam-questions' || activeTab === 'add-question'
                  ? 'bg-[#eae8d9] text-[#1c2d26] font-bold shadow-xs'
                  : 'text-[#c0dfe1] hover:text-white hover:bg-[#78988b]/25'
              }`}
            >
              <div className="flex items-center gap-3">
                <FilePlus2 className={`w-4 h-4 ${activeTab === 'exam-questions' || activeTab === 'add-question' ? 'text-[#78988b]' : 'text-[#b1c0a1]'}`} />
                <span className="text-sm">নতুন প্রশ্নপত্র তৈরি</span>
              </div>
              <span className="text-[10px] bg-[#749fa0] text-white px-1.5 py-0.5 rounded font-mono font-medium">
                ২ পেজ
              </span>
            </button>

            {/* 4. প্রশ্নপত্র আর্কাইভ */}
            <button
              onClick={() => handleNavClick('saved-papers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'saved-papers'
                  ? 'bg-[#eae8d9] text-[#1c2d26] font-bold shadow-xs'
                  : 'text-[#c0dfe1] hover:text-white hover:bg-[#78988b]/25'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderArchive className={`w-4 h-4 ${activeTab === 'saved-papers' ? 'text-[#78988b]' : 'text-[#b1c0a1]'}`} />
                <span className="text-sm">প্রশ্নপত্র আর্কাইভ</span>
              </div>
              <span className="text-[10px] font-mono text-[#c0dfe1] bg-[#2d443a] px-1.5 py-0.5 rounded border border-[#78988b]/40">
                {savedExamPapers.length}
              </span>
            </button>

            {/* 5. প্রশ্ন ব্যাংক */}
            <button
              onClick={() => handleNavClick('question-bank')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'question-bank'
                  ? 'bg-[#eae8d9] text-[#1c2d26] font-bold shadow-xs'
                  : 'text-[#c0dfe1] hover:text-white hover:bg-[#78988b]/25'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className={`w-4 h-4 ${activeTab === 'question-bank' ? 'text-[#78988b]' : 'text-[#b1c0a1]'}`} />
                <span className="text-sm">প্রশ্ন ব্যাংক</span>
              </div>
              <span className="text-[10px] font-mono text-[#b1c0a1]">
                {toBengaliNumber(questions.length || 5483)}
              </span>
            </button>

            {/* ----------------------------------------------------
                পরীক্ষা ও একাডেমিক
               ---------------------------------------------------- */}
            <div className="pt-2.5 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b1c0a1]">
                পরীক্ষা ও একাডেমিক
              </span>
            </div>

            {/* 6. পরীক্ষা ও রুটিন (সরাসরি বাটন - ভেতর আকর্ষণীয় ব্যাজে সাব-অপশনগুলো থাকবে) */}
            <button
              onClick={() => handleNavClick('exam-routine')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'exam-routine' || activeTab === 'admit-card' || activeTab === 'seat-plan'
                  ? 'bg-[#eae8d9] text-[#1c2d26] font-bold shadow-xs'
                  : 'text-[#c0dfe1] hover:text-white hover:bg-[#78988b]/25'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarCheck className={`w-4 h-4 ${activeTab === 'exam-routine' || activeTab === 'admit-card' || activeTab === 'seat-plan' ? 'text-[#78988b]' : 'text-[#b1c0a1]'}`} />
                <span className="text-sm">পরীক্ষা ও রুটিন</span>
              </div>
              <span className="text-[10px] font-bold bg-[#78988b]/30 text-[#eae8d9] px-2 py-0.5 rounded-full">
                ৩টি মডিউল
              </span>
            </button>

            {/* 7. শিক্ষার্থী তালিকা */}
            <button
              onClick={() => handleNavClick('students')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-[#eae8d9] text-[#1c2d26] font-bold shadow-xs'
                  : 'text-[#c0dfe1] hover:text-white hover:bg-[#78988b]/25'
              }`}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className={`w-4 h-4 ${activeTab === 'students' ? 'text-[#78988b]' : 'text-[#b1c0a1]'}`} />
                <span className="text-sm">শিক্ষার্থী তালিকা</span>
              </div>
              <span className="text-[10px] font-mono text-[#b1c0a1]">
                {toBengaliNumber(students.length)}
              </span>
            </button>

            {/* 8. শিক্ষক ও স্টাফ */}
            <button
              onClick={() => handleNavClick('teachers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'teachers'
                  ? 'bg-[#eae8d9] text-[#1c2d26] font-bold shadow-xs'
                  : 'text-[#c0dfe1] hover:text-white hover:bg-[#78988b]/25'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`w-4 h-4 ${activeTab === 'teachers' ? 'text-[#78988b]' : 'text-[#b1c0a1]'}`} />
                <span className="text-sm">শিক্ষক ও স্টাফ</span>
              </div>
              <span className="text-[10px] font-mono text-[#b1c0a1]">
                {toBengaliNumber(teachers.length)}
              </span>
            </button>

            {/* 9. ফলাফল ও মার্কশীট */}
            <button
              onClick={() => handleNavClick('results')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-[#eae8d9] text-[#1c2d26] font-bold shadow-xs'
                  : 'text-[#c0dfe1] hover:text-white hover:bg-[#78988b]/25'
              }`}
            >
              <Award className={`w-4 h-4 ${activeTab === 'results' ? 'text-[#78988b]' : 'text-[#b1c0a1]'}`} />
              <span className="text-sm">ফলাফল ও মার্কশীট</span>
            </button>

            {/* 10. প্রশংসাপত্র ও সার্টিফিকেট */}
            <button
              onClick={() => handleNavClick('certificates')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'certificates'
                  ? 'bg-[#eae8d9] text-[#1c2d26] font-bold shadow-xs'
                  : 'text-[#c0dfe1] hover:text-white hover:bg-[#78988b]/25'
              }`}
            >
              <FileText className={`w-4 h-4 ${activeTab === 'certificates' ? 'text-[#78988b]' : 'text-[#b1c0a1]'}`} />
              <span className="text-sm">প্রশংসাপত্র ও সনদ</span>
            </button>

            {/* 11. ফি ও হিসাব */}
            <button
              onClick={() => handleNavClick('fees')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'fees'
                  ? 'bg-[#eae8d9] text-[#1c2d26] font-bold shadow-xs'
                  : 'text-[#c0dfe1] hover:text-white hover:bg-[#78988b]/25'
              }`}
            >
              <CreditCard className={`w-4 h-4 ${activeTab === 'fees' ? 'text-[#78988b]' : 'text-[#b1c0a1]'}`} />
              <span className="text-sm">ফি ও হিসাব</span>
            </button>


            {/* 13. সেটিংস */}
            <button
              onClick={() => handleNavClick('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#eae8d9] text-[#1c2d26] font-bold shadow-xs'
                  : 'text-[#c0dfe1] hover:text-white hover:bg-[#78988b]/25'
              }`}
            >
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-[#78988b]' : 'text-[#b1c0a1]'}`} />
              <span className="text-sm">সিস্টেম সেটিংস</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};
