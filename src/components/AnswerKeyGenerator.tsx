import React, { useState } from 'react';
import { Printer, Download, CheckCircle2, BookOpen, Layers, Award, FileText, Check, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuestionItem, MCQQuestion, CQQuestion, ShortQuestion } from '../types';
import { toBengaliNumber } from '../utils/bengaliUtils';
import { exportElementsToPDF } from '../utils/pdfExport';

interface AnswerKeyGeneratorProps {
  academyName?: string;
  examTitle?: string;
  subject?: string;
  subjectCode?: string;
  className?: string;
  sectionKQuestions: QuestionItem[];
  sectionKhQuestions: QuestionItem[];
  sectionGQuestions: QuestionItem[];
  onBackToBuilder?: () => void;
}

export const AnswerKeyGenerator: React.FC<AnswerKeyGeneratorProps> = ({
  academyName,
  examTitle,
  subject,
  subjectCode,
  className,
  sectionKQuestions,
  sectionKhQuestions,
  sectionGQuestions,
  onBackToBuilder
}) => {
  const { institution } = useApp();

  const [activeSet, setActiveSet] = useState<'ক' | 'খ' | 'গ' | 'ঘ'>('ক');
  const [showDetailedExplanations, setShowDetailedExplanations] = useState<boolean>(true);
  const [showCQGuidelines, setShowCQGuidelines] = useState<boolean>(true);
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
      const fileName = `Answer_Key_${subject || 'Exam'}_Set_${activeSet}.pdf`;
      const success = await exportElementsToPDF(['printable-answer-key'], {
        fileName,
        orientation: 'portrait'
      });
      if (success) {
        showToast('✅ পূর্ণাঙ্গ উত্তরমালা ও সমাধান গাইড রঙিন PDF হিসেবে ডাউনলোড হয়েছে!');
      } else {
        window.print();
      }
    } catch (err) {
      console.error('Answer Key PDF export error:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const mcqQuestions = sectionKQuestions.filter(q => q.type === 'mcq') as MCQQuestion[];
  const optionLettersBn = ['ক', 'খ', 'গ', 'ঘ'];
  const optionLettersEn = ['A', 'B', 'C', 'D'];

  // Calculate shuffled answer offsets for sets ক, খ, গ, ঘ
  const getAnswerForSet = (index: number, set: 'ক' | 'খ' | 'গ' | 'ঘ'): { letter: string; text: string } => {
    const q = mcqQuestions[index];
    if (!q) return { letter: '-', text: '' };
    
    const correctIdx = q.correctOption ?? 0;
    // Set offset shifts question index deterministically
    const shift = set === 'ক' ? 0 : set === 'খ' ? 1 : set === 'গ' ? 2 : 3;
    const shiftedCorrect = (correctIdx + shift) % 4;
    
    return {
      letter: optionLettersBn[shiftedCorrect] || 'ক',
      text: q.options?.[correctIdx] || ''
    };
  };

  return (
    <div className="space-y-6 font-['Hind_Siliguri',sans-serif]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5 no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#c0dfe1] p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 no-print text-[#1f332c]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-300">
              eProshnobank & ProshnoLab স্পেশাল
            </span>
            <span className="text-xs text-slate-500 font-bold">শিক্ষক ও মূল্যায়নকারী সহায়িকা</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            উত্তরমালা ও শিক্ষক সমাধান গাইড (Teacher's Solution Sheet)
          </h2>
          <p className="text-xs text-slate-600">
            সেটভিত্তিক (ক, খ, গ, ঘ) বহুনির্বাচনী উত্তর সারণি, জ্ঞান-অনুধাবন ও সৃজনশীল প্রশ্নের পূর্ণাঙ্গ সমাধান।
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
            title="উত্তরমালা ও সমাধান গাইড পিডিএফ ডাউনলোড করুন"
          >
            <Download className="w-4 h-4 text-blue-100" />
            <span>{isExporting ? 'প্রস্তুত হচ্ছে...' : 'উত্তরমালা PDF ডাউনলোড'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>উত্তরমালা প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* Settings Toolbar */}
      <div className="bg-slate-50/90 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4 no-print text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Active Set Selector */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">সক্রিয় সেট নির্বাচন:</span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300">
              {(['ক', 'খ', 'গ', 'ঘ'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setActiveSet(s)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    activeSet === s
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  সেট {s}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-300">
              <input
                type="checkbox"
                checked={showDetailedExplanations}
                onChange={e => setShowDetailedExplanations(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>ব্যাখ্যামূলক উত্তর অন্তর্ভুক্ত রাখুন</span>
            </label>

            <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-300">
              <input
                type="checkbox"
                checked={showCQGuidelines}
                onChange={e => setShowCQGuidelines(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>সৃজনশীল ও সংক্ষিপ্ত প্রশ্নের সমাধান</span>
            </label>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AUTHENTIC PRINTABLE ANSWER KEY SHEET (A4 PORTRAIT)                        */}
      {/* 0.5-inch margin print enforcement                                         */}
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
            #printable-answer-key {
              margin: 0 auto !important;
              width: 100% !important;
              max-width: 100% !important;
              border: 2px solid #0f172a !important;
              box-shadow: none !important;
              background-color: #ffffff !important;
              page-break-after: always !important;
            }
          }
        `}</style>

        <div
          id="printable-answer-key"
          className="w-full max-w-[210mm] bg-white text-slate-900 p-6 sm:p-8 rounded-none border-2 border-slate-900 shadow-md box-border select-none"
          style={{ minHeight: '280mm' }}
        >
          {/* Header */}
          <div className="text-center space-y-1 pb-3 border-b-2 border-slate-900 mb-4">
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-wide font-sans">
              {academyName || institution.nameBn || 'সায়েন্স স্টুডিও একাডেমি'}
            </h1>
            <p className="text-xs text-slate-600 font-semibold">
              {examTitle || 'বার্ষিক মূল্যায়ন ও মডেল টেস্ট পরীক্ষা - ২০২৬'}
            </p>
            <div className="flex items-center justify-center gap-3 text-xs font-bold text-slate-800 pt-1">
              <span>বিষয়: <strong>{subject || 'পদার্থবিজ্ঞান'}</strong></span>
              <span>বিষয় কোড: <strong className="font-mono">{subjectCode || '১৭৪'}</strong></span>
              <span>শ্রেণি: <strong>{className || '১০ম শ্রেণি'}</strong></span>
            </div>

            {/* Answer Key Badge */}
            <div className="mt-2 inline-flex items-center gap-2 px-6 py-1 bg-teal-50 border-2 border-teal-700 rounded-full text-teal-950 font-black text-xs uppercase tracking-wider">
              <span>★ শিক্ষক সহায়িকা ও পূর্ণাঙ্গ উত্তরমালা (ANSWER KEY GUIDE) ★</span>
              <span className="bg-teal-700 text-white px-2 py-0.5 rounded-full text-[10px]">সেট: {activeSet}</span>
            </div>
          </div>

          {/* Quick MCQ Answer Grid (eProshnobank / ProshnoLab signature feature) */}
          {mcqQuestions.length > 0 && (
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>বহুনির্বাচনী প্রশ্নসমূহের কুইক উত্তর সারণি (MCQ Quick Answer Matrix)</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">মোট MCQ: {toBengaliNumber(mcqQuestions.length)}টি</span>
              </div>

              {/* 4-Set Comparison Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse border border-slate-400">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-slate-900">
                      <th className="py-1.5 px-2 border border-slate-400">প্রশ্ন নং</th>
                      <th className={`py-1.5 px-2 border border-slate-400 ${activeSet === 'ক' ? 'bg-teal-100 text-teal-950 font-black' : ''}`}>সেট ক</th>
                      <th className={`py-1.5 px-2 border border-slate-400 ${activeSet === 'খ' ? 'bg-teal-100 text-teal-950 font-black' : ''}`}>সেট খ</th>
                      <th className={`py-1.5 px-2 border border-slate-400 ${activeSet === 'গ' ? 'bg-teal-100 text-teal-950 font-black' : ''}`}>সেট গ</th>
                      <th className={`py-1.5 px-2 border border-slate-400 ${activeSet === 'ঘ' ? 'bg-teal-100 text-teal-950 font-black' : ''}`}>সেট ঘ</th>
                      <th className="py-1.5 px-3 border border-slate-400 text-left">সঠিক উত্তর পাঠ (Answer Text)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mcqQuestions.map((q, idx) => {
                      const ansK = getAnswerForSet(idx, 'ক');
                      const ansKh = getAnswerForSet(idx, 'খ');
                      const ansG = getAnswerForSet(idx, 'গ');
                      const ansGh = getAnswerForSet(idx, 'ঘ');

                      return (
                        <tr key={q.id || idx} className="hover:bg-slate-50">
                          <td className="py-1.5 px-2 border border-slate-300 font-bold font-mono text-[11px]">
                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </td>
                          <td className={`py-1.5 px-2 border border-slate-300 font-black ${activeSet === 'ক' ? 'bg-teal-50 text-teal-900 font-extrabold' : ''}`}>
                            ({ansK.letter})
                          </td>
                          <td className={`py-1.5 px-2 border border-slate-300 font-black ${activeSet === 'খ' ? 'bg-teal-50 text-teal-900 font-extrabold' : ''}`}>
                            ({ansKh.letter})
                          </td>
                          <td className={`py-1.5 px-2 border border-slate-300 font-black ${activeSet === 'গ' ? 'bg-teal-50 text-teal-900 font-extrabold' : ''}`}>
                            ({ansG.letter})
                          </td>
                          <td className={`py-1.5 px-2 border border-slate-300 font-black ${activeSet === 'ঘ' ? 'bg-teal-50 text-teal-900 font-extrabold' : ''}`}>
                            ({ansGh.letter})
                          </td>
                          <td className="py-1.5 px-3 border border-slate-300 text-left font-medium text-slate-800">
                            {ansK.text}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Detailed MCQ Explanations (If Enabled) */}
          {showDetailedExplanations && mcqQuestions.some(q => q.explanation) && (
            <div className="mb-6 space-y-3">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5 border-b border-slate-300 pb-1">
                <HelpCircle className="w-4 h-4 text-teal-700" />
                <span>বহুনির্বাচনী প্রশ্নের বিস্তারিত ব্যাখ্যা ও সমাধান (Explanations & Logic)</span>
              </h3>
              <div className="space-y-2 text-xs">
                {mcqQuestions.map((q, idx) => q.explanation ? (
                  <div key={q.id || idx} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70">
                    <div className="flex items-start gap-2">
                      <span className="font-mono font-bold text-teal-800 shrink-0">প্রশ্ন {idx + 1}:</span>
                      <div>
                        <p className="font-bold text-slate-900">{q.question}</p>
                        <p className="text-slate-700 mt-1 bg-white p-2 rounded border border-slate-200">
                          <strong className="text-teal-900">ব্যাখ্যা: </strong>
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null)}
              </div>
            </div>
          )}

          {/* CQ (Creative Questions) Model Answers & Rubric */}
          {showCQGuidelines && sectionGQuestions.length > 0 && (
            <div className="mb-6 space-y-3">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5 border-b border-slate-300 pb-1">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>সৃজনশীল প্রশ্নের মূল্যায়ন নির্দেশিকা ও মান বণ্টন (CQ Marking Rubric)</span>
              </h3>
              <div className="space-y-4 text-xs">
                {sectionGQuestions.map((q, idx) => {
                  const cq = q as CQQuestion;
                  return (
                    <div key={cq.id || idx} className="p-3 border border-slate-300 rounded-lg bg-slate-50/50 space-y-2">
                      <div className="font-bold text-slate-950 flex items-center justify-between border-b border-slate-200 pb-1">
                        <span>সৃজনশীল প্রশ্ন নং {toBengaliNumber(idx + 1)} [পূর্ণমান: ১০]</span>
                        <span className="text-[11px] text-slate-600 font-mono font-normal">অধ্যায়: {cq.chapter}</span>
                      </div>
                      {cq.stimulus && (
                        <p className="text-slate-700 italic bg-white p-2 rounded border border-slate-200">
                          <strong>উদ্দীপক: </strong>{cq.stimulus}
                        </p>
                      )}
                      <div className="space-y-1.5 pl-2">
                        {cq.subQuestions?.map(sub => (
                          <div key={sub.label} className="grid grid-cols-12 gap-2 text-xs py-1 border-b border-dotted border-slate-200">
                            <div className="col-span-9">
                              <strong>({sub.label}) </strong>
                              <span>{sub.question}</span>
                            </div>
                            <div className="col-span-3 text-right font-mono font-bold text-emerald-800">
                              [মান: {toBengaliNumber(sub.marks)}]
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Short Questions Model Answers */}
          {showCQGuidelines && sectionKhQuestions.length > 0 && (
            <div className="mb-6 space-y-3">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5 border-b border-slate-300 pb-1">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>সংক্ষিপ্ত প্রশ্নাবলীর উত্তর সংকেত (Short Questions Key)</span>
              </h3>
              <div className="space-y-2 text-xs">
                {sectionKhQuestions.map((q, idx) => {
                  const sq = q as ShortQuestion;
                  return (
                    <div key={sq.id || idx} className="p-2.5 border border-slate-200 rounded-lg bg-slate-50/60">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <strong className="text-slate-950">{toBengaliNumber(idx + 1)}. {sq.question}</strong>
                          {sq.answer && (
                            <p className="text-slate-700 mt-1 bg-white p-2 rounded border border-slate-200">
                              <strong className="text-emerald-900">মডেল উত্তর: </strong>{sq.answer}
                            </p>
                          )}
                        </div>
                        <span className="font-mono font-bold text-slate-700 shrink-0">[মান: {toBengaliNumber(sq.marks || 2)}]</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer & Signature */}
          <div className="pt-6 border-t-2 border-slate-900 flex items-center justify-between text-xs font-bold text-slate-900">
            <div className="text-center">
              <div className="w-36 border-t border-slate-900 pt-1">
                বিষয় শিক্ষক
              </div>
              <span className="text-[10px] text-slate-500 font-normal">Subject Teacher</span>
            </div>

            <div className="text-center text-[10px] text-slate-500 font-mono">
              EPROSHNOBANK & PROSHNOLAB INTEGRATED SOLUTION ENGINE
            </div>

            <div className="text-center">
              <div className="w-36 border-t border-slate-900 pt-1">
                প্রধান পরীক্ষক / মডারেটর
              </div>
              <span className="text-[10px] text-slate-500 font-normal">Head Examiner & Moderator</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
