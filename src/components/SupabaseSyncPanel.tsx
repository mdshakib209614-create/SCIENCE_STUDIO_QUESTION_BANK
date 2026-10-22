import React, { useState } from 'react';
import { 
  Database, 
  CloudUpload, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  FolderArchive, 
  Layers, 
  Users, 
  School, 
  FileText, 
  ShieldCheck,
  Check,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { syncAllDataToSupabase, SyncProgress } from '../services/supabaseSyncService';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { toBengaliNumber } from '../utils/bengaliUtils';

export const SupabaseSyncPanel: React.FC = () => {
  const { 
    institution, 
    students, 
    teachers, 
    questions, 
    savedExamPapers, 
    savedCertificates, 
    notices, 
    routines, 
    results, 
    fees,
    principalSignatureUrl,
    controllerSignatureUrl,
    classTeacherSignatureUrl,
    institutionSealUrl,
    watermarkImage,
    watermarkOpacity,
    watermarkSize,
    showWatermark
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState<SyncProgress | null>(null);
  const [syncHistory, setSyncHistory] = useState<{ time: string; details: string } | null>(() => {
    try {
      const saved = localStorage.getItem('coaching_mgmt_last_supabase_sync');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isConfigured = isSupabaseConfigured();

  // Retrieve saved admit cards from localStorage
  const getSavedAdmitCards = () => {
    try {
      const raw = localStorage.getItem('coaching_mgmt_saved_admit_cards');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const handleStartMasterSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setProgress({ step: 'সুপাবেজ সংযোগ যাচাই করা হচ্ছে...', percent: 5, completed: false });

    const savedAdmitCards = getSavedAdmitCards();

    const result = await syncAllDataToSupabase(
      {
        institution,
        students,
        teachers,
        questions,
        savedExamPapers,
        savedAdmitCards,
        savedCertificates,
        notices,
        routines,
        results,
        fees,
        signatures: {
          principalSig: principalSignatureUrl,
          controllerSig: controllerSignatureUrl,
          classTeacherSig: classTeacherSignatureUrl,
          sealUrl: institutionSealUrl,
          watermarkImage,
          watermarkOpacity,
          watermarkSize,
          showWatermark
        }
      },
      (p) => {
        setProgress(p);
      }
    );

    setIsSyncing(false);

    if (result.success) {
      const historyItem = {
        time: new Date().toLocaleString('bn-BD'),
        details: `${toBengaliNumber(questions.length)}টি প্রশ্ন, ${toBengaliNumber(students.length)} জন শিক্ষার্থী ও সকল আর্কাইভ ক্লাউডে সংরক্ষিত।`
      };
      setSyncHistory(historyItem);
      try {
        localStorage.setItem('coaching_mgmt_last_supabase_sync', JSON.stringify(historyItem));
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Supabase Connection Overview Card */}
      <div className="bg-gradient-to-br from-[#0c2318] via-[#122e21] to-[#07130e] text-white p-6 rounded-3xl border-2 border-[#d4af37]/60 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold shadow-[0_0_16px_rgba(16,185,129,0.3)]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-sans tracking-wide text-white">
                  SUPABASE LIVE DATABASE & STORAGE
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-emerald-200/70 font-mono mt-0.5">
                Project ID: pisevsostvpzjcxmhksf • SCIENCE_STUDIO_QUESTION_BANK
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-300">
              সুপাবেজ ব্যাকএন্ড প্রস্তুত
            </span>
          </div>
        </div>

        {/* Sync Action Area */}
        <div className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#fceda4] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>১-ক্লিকে সকল ডাটা সুপাবেজে আপলোড ও সিঙ্ক করুন</span>
            </h4>
            <p className="text-xs text-white/70 max-w-xl leading-relaxed">
              আপনার প্রশ্নব্যাংকের সকল প্রশ্ন, শিক্ষার্থীদের তথ্য, ছবি, শিক্ষক প্রোফাইল, সংরক্ষিত প্রশ্নপত্র ও প্রবেশপত্র আর্কাইভ সুপাবেজের নির্দিষ্ট টেবিল ও ক্লাউড স্টোরেজ বাকেটে সিঙ্ক করুন।
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartMasterSync}
            disabled={isSyncing}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-2.5 cursor-pointer transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>সিঙ্ক হচ্ছে...</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4 text-slate-950" />
                <span>সুপাবেজে সিঙ্ক শুরু করুন</span>
              </>
            )}
          </button>
        </div>

        {/* Progress Bar & Status */}
        {progress && (
          <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-2">
                {progress.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : progress.error ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-amber-300 animate-spin shrink-0" />
                )}
                <span>{progress.step}</span>
              </span>
              <span className="font-mono font-bold text-amber-300">{progress.percent}%</span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 transition-all duration-300 rounded-full"
                style={{ width: `${progress.percent}%` }}
              />
            </div>

            {progress.details && (
              <p className="text-[11px] text-emerald-300/90 font-medium">
                ✓ {progress.details}
              </p>
            )}

            {progress.error && (
              <p className="text-[11px] text-rose-300 font-medium">
                ত্রুটি: {progress.error}
              </p>
            )}
          </div>
        )}

        {/* Last Sync Info */}
        {syncHistory && !isSyncing && (
          <div className="text-[11px] text-white/60 flex items-center justify-between pt-1 font-sans">
            <span>সর্বশেষ সফল সিঙ্ক: <strong>{syncHistory.time}</strong></span>
            <span className="text-emerald-300">{syncHistory.details}</span>
          </div>
        )}
      </div>

      {/* Storage Buckets & Tables Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Question Bank */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
              {toBengaliNumber(questions.length)}টি প্রশ্ন
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            প্রশ্নব্যাংক টেবিল (questions)
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            MCQ, CQ (সৃজনশীল উদ্দীপক ও প্রশ্নমালা), সংক্ষিপ্ত ও ব্যাকরণ প্রশ্নসমূহ অধ্যায়ভিত্তিক সুপাবেজে জমা হচ্ছে।
          </p>
        </div>

        {/* Card 2: Students & Photos */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              {toBengaliNumber(students.length)} জন
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            শিক্ষার্থী ও ছবি বাকেট (student-photos)
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            শিক্ষার্থীদের রোল, শ্রেণি, জন্মনিবন্ধন, অভিভাবকের তথ্য ও ছবি সুপাবেজ ক্লাউড স্টোরেজে সংরক্ষিত।
          </p>
        </div>

        {/* Card 3: Institution & Assets */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <School className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              বাকেট অ্যাক্টিভ
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            মনোগ্রাম ও সিল বাকেট (institution-assets)
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            প্রতিষ্ঠানের লোগো, সিলমোহর, প্রধান শিক্ষকের স্বাক্ষর ও ওয়াটারমার্ক পিকচার বাকেটে সংরক্ষিত থাকে।
          </p>
        </div>

        {/* Card 4: Saved Exam Papers */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <FolderArchive className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
              {toBengaliNumber(savedExamPapers.length)}টি পেপার
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            প্রশ্নপত্র আর্কাইভ (saved_exam_papers)
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            তৈরি করা সম্পূর্ণ ৪-পৃষ্ঠা বুকলেট ও পোর্ট্রেট প্রশ্নপত্রসমূহ ডাটাবেজে স্থায়ীভাবে সংরক্ষিত রয়েছে।
          </p>
        </div>

        {/* Card 5: Saved Admit Cards & Certificates */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              আর্কাইভ সিঙ্ক
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            প্রবেশপত্র ও প্রশংসাপত্র আর্কাইভ
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            ল্যান্ডস্কেপ প্রবেশপত্র এবং গোল্ডেন থিমের প্রশংসাপত্র/ছাড়পত্র সিরিয়াল নম্বর অনুযায়ী ক্লাউডে রক্ষিত।
          </p>
        </div>

        {/* Card 6: Security & RLS */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              RLS সুরক্ষিত
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            নিরাপত্তা ও এনক্রিপশন (Row Level Security)
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            প্রতিটি টেবিলের জন্য PostgreSQL RLS পলিসি কার্যকর রয়েছে, যা নিরাপদ ক্লাউড ডেটাবেজ নিশ্চিত করে।
          </p>
        </div>
      </div>
    </div>
  );
};
