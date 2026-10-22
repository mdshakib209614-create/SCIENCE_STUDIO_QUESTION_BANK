import React, { useState } from 'react';
import { Printer, Download, CheckCircle2, RotateCcw, Sliders, Layers, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toBengaliNumber } from '../utils/bengaliUtils';
import { exportElementsToPDF } from '../utils/pdfExport';

interface OmrSheetGeneratorProps {
  academyName?: string;
  examTitle?: string;
  subject?: string;
  subjectCode?: string;
  className?: string;
  initialQuestionCount?: number;
  initialSet?: 'ক' | 'খ' | 'গ' | 'ঘ';
  onBackToBuilder?: () => void;
}

export const OmrSheetGenerator: React.FC<OmrSheetGeneratorProps> = ({
  academyName,
  examTitle,
  subject,
  subjectCode,
  className,
  initialQuestionCount = 30,
  initialSet = 'ক',
  onBackToBuilder
}) => {
  const { institution } = useApp();

  const [questionCount, setQuestionCount] = useState<number>(initialQuestionCount);
  const [selectedSet, setSelectedSet] = useState<'ক' | 'খ' | 'গ' | 'ঘ'>(initialSet);
  const [bubbleLanguage, setBubbleLanguage] = useState<'bn' | 'en'>('bn');
  const [showRollBubbles, setShowRollBubbles] = useState<boolean>(true);
  const [showRegBubbles, setShowRegBubbles] = useState<boolean>(true);
  const [showSubjectCodeBubbles, setShowSubjectCodeBubbles] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      const fileName = `OMR_Sheet_${subject || 'Exam'}_${questionCount}Q_Set_${selectedSet}.pdf`;
      const success = await exportElementsToPDF(['printable-omr-sheet'], {
        fileName,
        orientation: 'portrait'
      });
      if (success) {
        showToast('✅ ওএমআর শিট সফলভাবে রঙিন ও স্পষ্ট PDF হিসেবে ডাউনলোড হয়েছে!');
      } else {
        window.print();
      }
    } catch (err) {
      console.error('OMR PDF export error:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  // Divide questions into columns (e.g. 25 per column)
  const columnsCount = questionCount > 50 ? 4 : questionCount > 25 ? 3 : 2;
  const perCol = Math.ceil(questionCount / columnsCount);

  const optionLabels = bubbleLanguage === 'bn' ? ['ক', 'খ', 'গ', 'ঘ'] : ['A', 'B', 'C', 'D'];
  const setLabels: ('ক' | 'খ' | 'গ' | 'ঘ')[] = ['ক', 'খ', 'গ', 'ঘ'];

  return (
    <div className="space-y-6 font-['Hind_Siliguri',sans-serif]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5 no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Control Bar (eProshnobank & ProshnoLab standard) */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#c0dfe1] p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 no-print text-[#1f332c]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              eProshnobank & ProshnoLab স্ট্যান্ডার্ড
            </span>
            <span className="text-xs text-slate-500 font-bold">A4 সাইজ রেডি</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            স্বয়ংক্রিয় ওএমআর শিট জেনারেটর (OMR Answer Sheet)
          </h2>
          <p className="text-xs text-slate-600">
            রোল, রেজিস্ট্রেশন, বিষয় কোড, সেট কোড ও বৃত্ত ভরাট গ্রিড সহ প্রিন্ট-রেডি ফরম্যাট।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          {onBackToBuilder && (
            <button
              onClick={onBackToBuilder}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              ← প্রশ্নপত্রে ফিরে যান
            </button>
          )}

          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            title="ওএমআর শিটের পিডিএফ ডাউনলোড করুন"
          >
            <Download className="w-4 h-4 text-blue-100" />
            <span>{isExporting ? 'প্রস্তুত হচ্ছে...' : 'ওএমআর PDF ডাউনলোড'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>ওএমআর শিট প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* Configuration Toolbar */}
      <div className="bg-slate-50/90 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4 no-print text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm pb-2 border-b border-slate-200">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span>ওএমআর শিট কাস্টমাইজেশন অপশন</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* Question Count */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">মোট প্রশ্ন সংখ্যা:</label>
            <select
              value={questionCount}
              onChange={e => setQuestionCount(Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-900 outline-none"
            >
              <option value={20}>২০ টি প্রশ্ন</option>
              <option value={25}>২৫ টি প্রশ্ন</option>
              <option value={30}>৩০ টি প্রশ্ন (বোর্ড মান)</option>
              <option value={40}>৪০ টি প্রশ্ন</option>
              <option value={50}>৫০ টি প্রশ্ন</option>
              <option value={100}>১০০ টি প্রশ্ন (মডেল টেস্ট)</option>
            </select>
          </div>

          {/* Question Set Code */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">প্রশ্ন সেট কোড:</label>
            <div className="grid grid-cols-4 gap-1">
              {setLabels.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSet(s)}
                  className={`py-2 rounded-lg font-bold text-center border transition cursor-pointer ${
                    selectedSet === s
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Bubble Letters: Bangla vs English */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">অপশন ভাষা:</label>
            <select
              value={bubbleLanguage}
              onChange={e => setBubbleLanguage(e.target.value as 'bn' | 'en')}
              className="w-full p-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-900 outline-none"
            >
              <option value="bn">ক, খ, গ, ঘ (বাংলা)</option>
              <option value="en">A, B, C, D (English)</option>
            </select>
          </div>

          {/* Toggle Roll Bubbles */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">রোল নম্বর বৃত্ত:</label>
            <button
              type="button"
              onClick={() => setShowRollBubbles(!showRollBubbles)}
              className={`w-full py-2 rounded-xl font-bold border transition cursor-pointer ${
                showRollBubbles
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-500 border-slate-300'
              }`}
            >
              {showRollBubbles ? 'সক্রিয় আছে ✓' : 'লুকানো'}
            </button>
          </div>

          {/* Toggle Reg Bubbles */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">রেজিস্ট্রেশন বৃত্ত:</label>
            <button
              type="button"
              onClick={() => setShowRegBubbles(!showRegBubbles)}
              className={`w-full py-2 rounded-xl font-bold border transition cursor-pointer ${
                showRegBubbles
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-500 border-slate-300'
              }`}
            >
              {showRegBubbles ? 'সক্রিয় আছে ✓' : 'লুকানো'}
            </button>
          </div>

          {/* Toggle Subject Code Bubbles */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">বিষয় কোড বৃত্ত:</label>
            <button
              type="button"
              onClick={() => setShowSubjectCodeBubbles(!showSubjectCodeBubbles)}
              className={`w-full py-2 rounded-xl font-bold border transition cursor-pointer ${
                showSubjectCodeBubbles
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-500 border-slate-300'
              }`}
            >
              {showSubjectCodeBubbles ? 'সক্রিয় আছে ✓' : 'লুকানো'}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AUTHENTIC PRINTABLE OMR SHEET CONTAINER (A4 PORTRAIT)                     */}
      {/* Guaranteed 0.5-inch page margin on print with solid inner border          */}
      {/* ========================================================================= */}
      <div className="flex justify-center overflow-x-auto p-1">
        <style>{`
          @media print {
            @page {
              size: A4 portrait !important;
              margin: 0.5in !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #printable-omr-sheet {
              margin: 0 auto !important;
              width: 100% !important;
              max-width: 100% !important;
              border: 2px solid #0f172a !important;
              box-shadow: none !important;
              background-color: #ffffff !important;
              page-break-inside: avoid !important;
              page-break-after: always !important;
            }
          }
        `}</style>

        <div
          id="printable-omr-sheet"
          className="w-full max-w-[210mm] bg-white text-slate-900 p-5 sm:p-7 md:p-8 rounded-none border-2 border-slate-900 shadow-md box-border select-none"
          style={{ minHeight: '280mm' }}
        >
          {/* Top Bar with Registration Marks (Official OMR alignment corners) */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-slate-900 mb-3">
            <div className="w-4 h-4 bg-slate-900"></div>
            <div className="text-center">
              <span className="text-[10px] font-mono tracking-widest font-black uppercase text-slate-700">
                OFFICIAL OMR EVALUATION SHEET • SCIENCE STUDIO
              </span>
            </div>
            <div className="w-4 h-4 bg-slate-900"></div>
          </div>

          {/* Institution & Exam Header */}
          <div className="text-center space-y-1 mb-4 pb-3 border-b border-slate-400">
            <h1 className="text-lg sm:text-2xl font-black text-slate-950 tracking-wide font-sans">
              {academyName || institution.nameBn || 'সায়েন্স স্টুডিও একাডেমি'}
            </h1>
            <p className="text-xs text-slate-700 font-semibold font-sans">
              {examTitle || 'বার্ষিক মূল্যায়ন ও মডেল টেস্ট পরীক্ষা - ২০২৬'}
            </p>
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-800 pt-0.5">
              <span>বিষয়: <strong>{subject || 'সাধারণ বিজ্ঞান'}</strong></span>
              <span>বিষয় কোড: <strong className="font-mono">{subjectCode || '১৭৪'}</strong></span>
              <span>শ্রেণি: <strong>{className || '১০ম শ্রেণি'}</strong></span>
            </div>
          </div>

          {/* Candidate Details & Set Code Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
            {/* Student Name and info */}
            <div className="md:col-span-2 border border-slate-400 p-3 rounded-lg bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 shrink-0">শিক্ষার্থীর নাম:</span>
                <div className="flex-1 border-b border-dotted border-slate-600 h-4"></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">শ্রেণি:</span>
                  <div className="flex-1 border-b border-dotted border-slate-600 h-4"></div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">শাখা:</span>
                  <div className="flex-1 border-b border-dotted border-slate-600 h-4"></div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">তারিখ:</span>
                  <div className="flex-1 border-b border-dotted border-slate-600 h-4"></div>
                </div>
              </div>
            </div>

            {/* Set Code Bubble Box (Large & Prominent) */}
            <div className="border-2 border-slate-900 p-2.5 rounded-lg bg-amber-50/40 text-center">
              <span className="text-[11px] font-black uppercase tracking-wider block text-slate-900 pb-1 border-b border-slate-300">
                প্রশ্ন সেট কোড (SET CODE)
              </span>
              <div className="flex items-center justify-center gap-3 pt-2">
                {setLabels.map(s => (
                  <div key={s} className="flex flex-col items-center gap-1">
                    <span className="text-xs font-black">{s}</span>
                    <div 
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-black ${
                        selectedSet === s 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                          : 'border-slate-800 text-slate-800 bg-white'
                      }`}
                    >
                      {selectedSet === s ? '✓' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Roll, Reg & Subject Code Matrix Grid */}
          {(showRollBubbles || showRegBubbles || showSubjectCodeBubbles) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-3 border border-slate-400 rounded-lg bg-slate-50/70">
              {/* Roll Number Grid */}
              {showRollBubbles && (
                <div className="border border-slate-400 p-2 rounded bg-white text-center">
                  <span className="text-[11px] font-black text-slate-900 block pb-1">রোল নম্বর (ROLL NO)</span>
                  <div className="flex justify-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="w-5 h-6 border-2 border-slate-800 rounded text-center text-xs font-bold leading-6"></div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5, 6].map(col => (
                      <div key={col} className="flex flex-col gap-0.5">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                          <div 
                            key={num} 
                            className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-800 font-mono hover:bg-slate-200"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Registration Number Grid */}
              {showRegBubbles && (
                <div className="border border-slate-400 p-2 rounded bg-white text-center">
                  <span className="text-[11px] font-black text-slate-900 block pb-1">রেজিস্ট্রেশন নং (REG NO)</span>
                  <div className="flex justify-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <div key={i} className="w-4 h-6 border-2 border-slate-800 rounded text-center text-xs font-bold leading-6"></div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(col => (
                      <div key={col} className="flex flex-col gap-0.5">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                          <div 
                            key={num} 
                            className="w-3.5 h-3.5 rounded-full border border-slate-700 flex items-center justify-center text-[8.5px] font-bold text-slate-800 font-mono"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subject Code Grid */}
              {showSubjectCodeBubbles && (
                <div className="border border-slate-400 p-2 rounded bg-white text-center">
                  <span className="text-[11px] font-black text-slate-900 block pb-1">বিষয় কোড (SUB CODE)</span>
                  <div className="flex justify-center gap-1 mb-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-5 h-6 border-2 border-slate-800 rounded text-center text-xs font-bold leading-6"></div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-1 pt-1">
                    {[1, 2, 3].map(col => (
                      <div key={col} className="flex flex-col gap-0.5">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                          <div 
                            key={num} 
                            className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-800 font-mono"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions Box (Official Board instructions with visual guide) */}
          <div className="bg-amber-50/70 border border-amber-300 p-2.5 rounded-lg mb-4 text-[10.5px] text-slate-800 leading-snug">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong className="text-amber-950 font-bold block mb-0.5">উত্তরপত্র পূরণের গুরুত্বপূর্ণ নির্দেশাবলী:</strong>
                <p>১. শুধুমাত্র কালো কালির বলপয়েন্ট কলম দিয়ে সংশ্লিষ্ট বৃত্ত সম্পূর্ণ ভরাট করতে হবে।</p>
                <p>২. বৃত্তের বাইরে দাগ দেওয়া, কাটাকাটি করা, ফ্লুইড বা ইরেজার ব্যবহার সম্পূর্ণ নিষিদ্ধ।</p>
              </div>
              <div className="flex items-center gap-3 shrink-0 bg-white px-3 py-1.5 rounded-md border border-amber-300">
                <div className="text-center">
                  <span className="block text-[9px] text-emerald-800 font-bold">সঠিক পদ্ধতি</span>
                  <div className="w-4 h-4 rounded-full bg-slate-950 mx-auto mt-0.5"></div>
                </div>
                <div className="text-center">
                  <span className="block text-[9px] text-rose-800 font-bold">ভুল পদ্ধতি</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-4 h-4 rounded-full border border-slate-800 text-[10px] leading-4 text-center font-bold">✓</span>
                    <span className="w-4 h-4 rounded-full border border-slate-800 text-[10px] leading-4 text-center font-bold">✗</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MAIN OMR QUESTION ANSWER BUBBLES GRID                                     */}
          {/* ========================================================================= */}
          <div className="border-2 border-slate-900 rounded-xl p-3 bg-white mb-5">
            <div className="text-center font-bold text-xs uppercase tracking-wider pb-2 mb-2 border-b border-slate-300 text-slate-900">
              বহুনির্বাচনী উত্তরপত্র (MCQ ANSWER MATRIX) — মোট প্রশ্ন: {toBengaliNumber(questionCount)} টি
            </div>

            <div className={`grid grid-cols-${columnsCount} gap-3 sm:gap-4 divide-x divide-slate-300`}>
              {Array.from({ length: columnsCount }).map((_, colIdx) => {
                const start = colIdx * perCol + 1;
                const end = Math.min((colIdx + 1) * perCol, questionCount);
                if (start > questionCount) return null;

                const qList = [];
                for (let i = start; i <= end; i++) {
                  qList.push(i);
                }

                return (
                  <div key={colIdx} className={`${colIdx > 0 ? 'pl-3 sm:pl-4' : ''} space-y-1.5`}>
                    {qList.map(qNum => (
                      <div key={qNum} className="flex items-center justify-between text-xs py-0.5">
                        <span className="font-mono font-bold text-[11px] w-6 text-slate-950">
                          {qNum < 10 ? `0${qNum}` : qNum}.
                        </span>
                        <div className="flex items-center gap-1.5">
                          {optionLabels.map((opt, optIdx) => (
                            <div 
                              key={optIdx} 
                              className="w-5 h-5 rounded-full border border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-900 font-sans cursor-pointer hover:bg-slate-200"
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Signatures & Barcode */}
          <div className="pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-900">
            <div className="text-center">
              <div className="w-36 sm:w-44 border-t-2 border-slate-900 pt-1 text-slate-900">
                পরীক্ষার্থীর পূর্ণ স্বাক্ষর
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Candidate Signature</span>
            </div>

            {/* OMR Barcode Symbol */}
            <div className="text-center font-mono">
              <div className="tracking-widest text-xs font-black py-0.5 px-3 border border-slate-400 bg-slate-50 inline-block">
                ||| | |||| | ||| |||| | ||| {selectedSet}
              </div>
              <span className="text-[9px] text-slate-500 block mt-0.5">OMR-SERIES-2026-{selectedSet}</span>
            </div>

            <div className="text-center">
              <div className="w-36 sm:w-44 border-t-2 border-slate-900 pt-1 text-slate-900">
                কক্ষ পরিদর্শকের স্বাক্ষর ও তারিখ
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Invigilator Signature & Date</span>
            </div>
          </div>

          {/* Bottom Alignment Corners */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-300 text-[9px] text-slate-500">
            <div className="w-4 h-4 bg-slate-900"></div>
            <span>SCIENCE STUDIO OMR PRINT ENGINE • EPROSHNOBANK & PROSHNOLAB STANDARD COMPLIANT</span>
            <div className="w-4 h-4 bg-slate-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
