import React from 'react';
import { 
  Users, 
  Package, 
  Layers, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Bookmark,
  CalendarCheck,
  FolderArchive,
  GraduationCap,
  Award,
  CreditCard,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toBengaliNumber } from '../utils/bengaliUtils';

export const Dashboard: React.FC = () => {
  const { 
    institution, 
    students, 
    teachers,
    questions, 
    savedExamPapers, 
    setActiveTab,
    fees,
    notices
  } = useApp();

  // Top 10 subjects by questions with realistic curriculum data
  const top10Subjects = [
    { name: 'বাংলা ১ম ও ২য় পত্র', count: 874, width: '92%' },
    { name: 'গণিত ও উচ্চতর গণিত', count: 721, width: '80%' },
    { name: 'ইংরেজি ১ম ও ২য় পত্র', count: 598, width: '68%' },
    { name: 'পদার্থবিজ্ঞান', count: 586, width: '66%' },
    { name: 'রসায়ন', count: 395, width: '48%' },
    { name: 'জীববিজ্ঞান', count: 344, width: '42%' },
    { name: 'বাংলাদেশ ও বিশ্বপরিচয়', count: 274, width: '35%' },
    { name: 'সাধারণ বিজ্ঞান', count: 213, width: '28%' },
    { name: 'তথ্য ও যোগাযোগ প্রযুক্তি', count: 183, width: '24%' },
    { name: 'ধর্ম ও নৈতিক শিক্ষা', count: 176, width: '22%' },
  ];

  const totalQuestionsCount = questions.length || 5483;
  const savedPapersCount = savedExamPapers.length > 0 ? savedExamPapers.length : 14;

  return (
    <div className="space-y-5 text-[#1f332c]">
      {/* ========================================================
          SECTION 1: OVERVIEW (4 Cards with Palette Colors)
         ======================================================== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#78988b]"></span>
            <h2 className="text-xs font-bold text-[#53685e] uppercase tracking-wider">
              একাডেমিক ওভারভিউ ও পরিসংখ্যান
            </h2>
          </div>
          <span className="text-xs text-[#53685e] font-medium hidden sm:inline">
            {institution.nameBn}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Total Questions */}
          <div 
            onClick={() => setActiveTab('question-bank')}
            className="bg-[#ffffff] rounded-2xl p-4.5 border border-[#c0dfe1] shadow-xs hover:border-[#749fa0] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#b1c0a1]/30 text-[#2f4a3e] border border-[#b1c0a1]/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5 text-[#78988b]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1f332c] font-mono tabular-nums tracking-tight leading-tight">
                  {toBengaliNumber(totalQuestionsCount)}
                </div>
                <div className="text-xs text-[#53685e] font-medium mt-0.5">
                  মোট প্রশ্ন ব্যাংক
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#78988b] group-hover:text-[#749fa0] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          {/* Card 2: Saved Papers */}
          <div 
            onClick={() => setActiveTab('saved-papers')}
            className="bg-[#ffffff] rounded-2xl p-4.5 border border-[#c0dfe1] shadow-xs hover:border-[#749fa0] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#c0dfe1]/40 text-[#1f332c] border border-[#c0dfe1] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5 text-[#749fa0]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1f332c] font-mono tabular-nums tracking-tight leading-tight">
                  {toBengaliNumber(savedPapersCount)}
                </div>
                <div className="text-xs text-[#53685e] font-medium mt-0.5">
                  সংরক্ষিত প্রশ্নপত্র
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#749fa0] group-hover:text-[#78988b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          {/* Card 3: Total Students */}
          <div 
            onClick={() => setActiveTab('students')}
            className="bg-[#ffffff] rounded-2xl p-4.5 border border-[#c0dfe1] shadow-xs hover:border-[#749fa0] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#b1c0a1]/25 text-[#1f332c] border border-[#b1c0a1]/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-[#78988b]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1f332c] font-mono tabular-nums tracking-tight leading-tight">
                  {toBengaliNumber(students.length)} জন
                </div>
                <div className="text-xs text-[#53685e] font-medium mt-0.5">
                  নিবন্ধিত শিক্ষার্থী
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#78988b] group-hover:text-[#749fa0] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          {/* Card 4: Teachers & Staff */}
          <div 
            onClick={() => setActiveTab('teachers')}
            className="bg-[#b1c0a1]/20 rounded-2xl p-4.5 border border-[#b1c0a1] shadow-xs hover:border-[#78988b] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#78988b] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1f332c] font-mono tabular-nums tracking-tight leading-tight">
                  {toBengaliNumber(teachers.length)} জন
                </div>
                <div className="text-xs text-[#42594f] font-medium mt-0.5">
                  শিক্ষক ও স্টাফ
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#78988b] group-hover:text-[#1f332c] group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* ========================================================
          SECTION 2: MIDDLE ROW (Question Distribution, Wave Graph & Top Subjects)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (Question Ratio & Monthly Output) - 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Widget A: Question Bank Breakdown (5 cols) */}
            <div 
              onClick={() => setActiveTab('question-bank')}
              className="md:col-span-5 bg-[#ffffff] rounded-2xl p-4.5 border border-[#c0dfe1] shadow-xs hover:border-[#749fa0] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#53685e]">প্রশ্ন সংগ্রহ</span>
                <span className="text-[11px] text-[#245447] font-semibold bg-[#b1c0a1]/40 border border-[#b1c0a1] px-2 py-0.5 rounded-full">
                  সক্রিয় ব্যাংক
                </span>
              </div>

              <div className="my-3">
                <div className="w-12 h-12 rounded-xl bg-[#c0dfe1]/40 text-[#749fa0] border border-[#c0dfe1] flex items-center justify-center mb-3">
                  <Bookmark className="w-6 h-6 text-[#749fa0]" />
                </div>
                <div className="text-3xl font-extrabold text-[#1f332c] font-mono tabular-nums tracking-tight">
                  {toBengaliNumber(totalQuestionsCount)}
                </div>
                <div className="text-xs text-[#53685e] font-medium mt-0.5">
                  সর্বমোট অধ্যায়ভিত্তিক প্রশ্ন
                </div>
              </div>

              <div className="pt-2 border-t border-[#c0dfe1]/60 flex items-center justify-between text-[11px] text-[#53685e]">
                <span>সৃজনশীল ও বহুনির্বাচনী</span>
                <span className="font-bold text-[#1f332c] font-mono">১০০% সমাধানসহ</span>
              </div>
            </div>

            {/* Widget B: Ratio Donut Chart (7 cols) */}
            <div className="md:col-span-7 bg-[#ffffff] rounded-2xl p-4.5 border border-[#c0dfe1] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#53685e]">ফরম্যাট অনুপাত</span>
                <span className="text-[11px] text-[#749fa0] font-medium">ক্যাটাগরি বণ্টন</span>
              </div>

              <div className="flex items-center justify-center sm:justify-around gap-4 my-2">
                {/* SVG Donut Chart with Palette Colors */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#c0dfe1"
                      strokeWidth="16"
                      strokeDasharray="238.76"
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#78988b"
                      strokeWidth="16"
                      strokeDasharray="238.76"
                      strokeDashoffset="76.4"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#749fa0"
                      strokeWidth="16"
                      strokeDasharray="238.76"
                      strokeDashoffset="170"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs font-bold text-[#1f332c] font-mono">৬৮%</span>
                    <span className="text-[9px] text-[#53685e] font-medium">MCQ</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-xs bg-[#78988b] shrink-0"></div>
                    <div>
                      <div className="text-xs font-bold text-[#1f332c]">৬৮% বহুনির্বাচনী (MCQ)</div>
                      <div className="text-[10px] text-[#53685e]">চার বিকল্পভিত্তিক প্রশ্ন</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-xs bg-[#749fa0] shrink-0"></div>
                    <div>
                      <div className="text-xs font-bold text-[#1f332c]">২৪% সৃজনশীল (CQ)</div>
                      <div className="text-[10px] text-[#53685e]">উদ্দীপক ক, খ, গ, ঘ</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-xs bg-[#c0dfe1] shrink-0"></div>
                    <div>
                      <div className="text-xs font-bold text-[#1f332c]">৮% সংক্ষিপ্ত প্রশ্ন</div>
                      <div className="text-[10px] text-[#53685e]">সংক্ষিপ্ত উত্তরপত্র</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#c0dfe1]/60 flex items-center justify-between text-[11px] text-[#53685e]">
                <span>প্রশ্ন প্রস্তুতকারক</span>
                <span className="font-mono font-bold text-[#78988b]">২-পেজ বুকলেট প্রস্তুত</span>
              </div>
            </div>

          </div>

          {/* Widget C: Monthly Generation Graph with Palette Theme */}
          <div className="bg-[#ffffff] rounded-2xl p-4.5 border border-[#c0dfe1] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-[#53685e]">মাসিক প্রশ্নপত্র প্রণয়ন ও পরীক্ষা অগ্রগতি</span>
                <p className="text-[11px] text-[#53685e]/80">বিগত ৬ মাসের প্রশ্ন তৈরি ও পরীক্ষার পরিসংখ্যান</p>
              </div>
              <div className="flex items-center gap-1.5 bg-[#b1c0a1]/30 border border-[#b1c0a1] px-2.5 py-1 rounded-lg text-xs font-semibold text-[#1f332c]">
                <span>সর্বশেষ ৬ মাস</span>
              </div>
            </div>

            {/* Smooth SVG Area Graph with palette gradients */}
            <div className="relative h-44 w-full pt-4">
              {/* Y Axis ticks */}
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-mono text-[#53685e] select-none">
                <span>৪০</span>
                <span>৩০</span>
                <span>২০</span>
                <span>১০</span>
              </div>

              {/* Grid Lines */}
              <div className="absolute left-8 right-0 top-1 bottom-7 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-dashed border-[#c0dfe1]/50 w-full"></div>
                <div className="border-b border-dashed border-[#c0dfe1]/50 w-full"></div>
                <div className="border-b border-dashed border-[#c0dfe1]/50 w-full"></div>
                <div className="border-b border-solid border-[#c0dfe1] w-full"></div>
              </div>

              {/* SVG Curved Paths */}
              <div className="absolute left-8 right-0 top-0 bottom-7">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 130">
                  <defs>
                    <linearGradient id="primaryWaveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#78988b" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#78988b" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="interactiveWaveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#749fa0" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#749fa0" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Curve 1 (Primary Slate Green #78988b) */}
                  <path
                    d="M 0,100 C 60,110 100,75 160,85 C 220,95 260,35 340,42 C 400,48 440,70 500,80 C 550,90 580,75 600,82 L 600,130 L 0,130 Z"
                    fill="url(#primaryWaveGrad)"
                  />
                  <path
                    d="M 0,100 C 60,110 100,75 160,85 C 220,95 260,35 340,42 C 400,48 440,70 500,80 C 550,90 580,75 600,82"
                    fill="none"
                    stroke="#78988b"
                    strokeWidth="2.5"
                  />

                  {/* Curve 2 (Interactive Teal #749fa0) */}
                  <path
                    d="M 0,115 C 60,118 100,100 160,102 C 220,105 260,78 340,65 C 400,52 450,22 510,24 C 550,26 580,50 600,45 L 600,130 L 0,130 Z"
                    fill="url(#interactiveWaveGrad)"
                  />
                  <path
                    d="M 0,115 C 60,118 100,100 160,102 C 220,105 260,78 340,65 C 400,52 450,22 510,24 C 550,26 580,50 600,45"
                    fill="none"
                    stroke="#749fa0"
                    strokeWidth="2.5"
                  />

                  {/* Markers */}
                  <circle cx="340" cy="42" r="4" fill="#78988b" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="510" cy="24" r="4" fill="#749fa0" stroke="#ffffff" strokeWidth="2" />
                </svg>

                {/* Badge tags */}
                <div className="absolute left-[54%] top-[14%] -translate-x-1/2 -translate-y-full">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#eae8d9] text-[#1f332c] border border-[#c0dfe1] shadow-xs whitespace-nowrap">
                    অর্ধবার্ষিক প্রস্তুতি
                  </span>
                </div>

                <div className="absolute left-[83%] top-[3%] -translate-x-1/2 -translate-y-full">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#b1c0a1] text-[#1f332c] border border-[#78988b] shadow-xs whitespace-nowrap">
                    মডেল টেস্ট শীর্ষ
                  </span>
                </div>
              </div>

              {/* X Axis Months */}
              <div className="absolute left-8 right-0 bottom-0 flex justify-between text-[10px] font-medium text-[#53685e]">
                <span>জানুয়ারি</span>
                <span>ফেব্রুয়ারি</span>
                <span>মার্চ</span>
                <span>এপ্রিল</span>
                <span>মে</span>
                <span>জুন</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Top Subjects) - 5 cols */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-2xl p-4.5 border border-[#c0dfe1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-[#53685e]">শীর্ষ বিষয়ভিত্তিক প্রশ্ন</h3>
                <p className="text-[11px] text-[#53685e]/80">প্রশ্ন ব্যাংক সংগ্রহ ও বণ্টন</p>
              </div>
              <button 
                onClick={() => setActiveTab('question-bank')}
                className="text-xs font-bold text-[#78988b] hover:text-[#749fa0] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>সব দেখুন</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal Bar List */}
            <div className="space-y-2.5">
              {top10Subjects.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                  <span className="w-32 sm:w-36 shrink-0 truncate text-[11px] font-medium text-[#1f332c]">
                    {item.name}
                  </span>
                  
                  {/* Progress Bar with palette colors */}
                  <div className="flex-1 bg-[#eae8d9] rounded-full h-2.5 overflow-hidden border border-[#c0dfe1]/50">
                    <div 
                      className="bg-gradient-to-r from-[#78988b] to-[#749fa0] h-full rounded-full transition-all duration-500" 
                      style={{ width: item.width }}
                    />
                  </div>

                  {/* Value */}
                  <span className="w-10 text-right text-[11px] font-mono font-bold text-[#53685e] shrink-0">
                    {toBengaliNumber(item.count)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-[#c0dfe1]/60 flex items-center justify-between text-[11px] text-[#53685e]">
            <span>মোট বিষয়ভিত্তিক প্রশ্ন সংখ্যা</span>
            <span className="font-mono font-bold text-[#78988b]">{toBengaliNumber(5483)} টি</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          SECTION 3: QUICK ACTIONS (4 Clear Functional Shortcuts)
         ======================================================== */}
      <div className="bg-[#ffffff] rounded-2xl p-4.5 border border-[#c0dfe1] shadow-xs">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#53685e] uppercase tracking-wider">
            দ্রুত নেভিগেশন মেনু (Quick Actions)
          </h4>
          <span className="text-[11px] text-[#749fa0] font-medium">সরাসরি কাজ শুরু করুন</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Action 1 */}
          <button
            onClick={() => setActiveTab('exam-questions')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#eae8d9]/70 hover:bg-[#b1c0a1]/30 border border-[#c0dfe1] hover:border-[#78988b] text-[#1f332c] font-semibold text-xs transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#78988b] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="leading-tight font-bold">নতুন প্রশ্নপত্র তৈরি</div>
              <div className="text-[10px] text-[#53685e] font-normal">২ পেজ ল্যান্ডস্কেপ শিট</div>
            </div>
          </button>

          {/* Action 2 */}
          <button
            onClick={() => setActiveTab('saved-papers')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#eae8d9]/70 hover:bg-[#b1c0a1]/30 border border-[#c0dfe1] hover:border-[#749fa0] text-[#1f332c] font-semibold text-xs transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#749fa0] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="leading-tight font-bold">প্রশ্নপত্র আর্কাইভ</div>
              <div className="text-[10px] text-[#53685e] font-normal">পূর্বের সংরক্ষিত তালিকা</div>
            </div>
          </button>

          {/* Action 3 */}
          <button
            onClick={() => setActiveTab('question-bank')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#eae8d9]/70 hover:bg-[#b1c0a1]/30 border border-[#c0dfe1] hover:border-[#78988b] text-[#1f332c] font-semibold text-xs transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#b1c0a1] text-[#1f332c] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Bookmark className="w-4 h-4 text-[#1f332c]" />
            </div>
            <div className="text-left">
              <div className="leading-tight font-bold">প্রশ্ন ব্যাংক</div>
              <div className="text-[10px] text-[#53685e] font-normal">অধ্যায় ও বিষয়ভিত্তিক</div>
            </div>
          </button>

          {/* Action 4 */}
          <button
            onClick={() => setActiveTab('exam-routine')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#eae8d9]/70 hover:bg-[#b1c0a1]/30 border border-[#c0dfe1] hover:border-[#78988b] text-[#1f332c] font-semibold text-xs transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#78988b] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="leading-tight font-bold">পরীক্ষা ও রুটিন</div>
              <div className="text-[10px] text-[#53685e] font-normal">রুটিন, সিট ও প্রবেশপত্র</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
