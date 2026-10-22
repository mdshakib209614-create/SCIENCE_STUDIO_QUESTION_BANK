import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Save, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Filter, 
  TrendingUp,
  GraduationCap,
  PlusCircle,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  Copy,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Student, StudentResult, SubjectMarks, GradeType } from '../types';
import { toBengaliNumber, calculateGrade, getOrdinalBengali } from '../utils/bengaliUtils';
import { ResultSheetA4 } from './result/ResultSheetA4';
import { MarksEntryModal } from './result/MarksEntryModal';

export const ResultView: React.FC = () => {
  const { students, results, saveResult, institution } = useApp();

  // Filters & State
  const [selectedTerm, setSelectedTerm] = useState('১ম প্রান্তিক মূল্যায়ন');
  const [selectedClass, setSelectedClass] = useState('১ম শ্রেণি');
  const [activeTabMode, setActiveTabMode] = useState<'entry' | 'reportCard' | 'batchPrint'>('entry');
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<string>('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStudent, setModalStudent] = useState<Student | null>(null);

  const [saveAlert, setSaveAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const classesList = [
    'প্লে',
    'নার্সারি',
    '১ম শ্রেণি', 
    '২য় শ্রেণি', 
    '৩য় শ্রেণি', 
    '৪র্থ শ্রেণি', 
    '৫ম শ্রেণি',
    '৬ষ্ঠ শ্রেণি',
    '৭ম শ্রেণি',
    '৮ম শ্রেণি',
    '৯ম শ্রেণি',
    '১০ম শ্রেণি'
  ];

  const termsList = [
    '১ম প্রান্তিক মূল্যায়ন', 
    '২য় প্রান্তিক মূল্যায়ন', 
    '৩য় প্রান্তিক মূল্যায়ন', 
    'অর্ধবার্ষিক মূল্যায়ন পরীক্ষা',
    'বার্ষিক মূল্যায়ন পরীক্ষা',
    'মডেল টেস্ট পরীক্ষা'
  ];

  const defaultSubjects = ['বাংলা', 'ইংরেজি', 'গণিত', 'বিজ্ঞান', 'ধর্ম ও নৈতিক শিক্ষা'];

  // Filter students for current class
  const classStudents = useMemo(() => {
    return students.filter(s => s.class === selectedClass);
  }, [students, selectedClass]);

  // Set default student if none selected
  const activeStudentId = selectedStudentForCard || classStudents[0]?.id || students[0]?.id || '';

  // Get or compute result for a student
  const getStudentResult = (studentId: string): StudentResult => {
    const existing = results.find(
      r => r.studentId === studentId && r.term === selectedTerm
    );
    if (existing) return existing;

    const student = students.find(s => s.id === studentId);
    const initialMarks: SubjectMarks[] = defaultSubjects.map(sub => {
      const cont = 27;
      const summ = 63;
      const total = cont + summ;
      const { grade, gpa } = calculateGrade(total);
      return {
        subjectName: sub,
        fullMarks: 100,
        continuous: cont,
        summative: summ,
        total,
        highestMarks: 95,
        grade,
        gpa
      };
    });

    const grandTotal = initialMarks.reduce((sum, s) => sum + s.total, 0);
    const avg = grandTotal / initialMarks.length;
    const { grade: overallGrade, gpa: overallGpa } = calculateGrade(avg);

    return {
      studentId,
      studentName: student?.nameBn || 'শিক্ষার্থী',
      roll: student?.roll || '০০১',
      class: student?.class || selectedClass,
      section: student?.section || 'ক',
      term: selectedTerm,
      academicYear: '২০২৬',
      attendanceDays: 72,
      totalWorkingDays: 75,
      subjectMarks: initialMarks,
      grandTotal,
      totalFullMarks: initialMarks.length * 100,
      percentage: Number(((grandTotal / (initialMarks.length * 100)) * 100).toFixed(1)),
      overallGrade,
      overallGpa,
      position: '১ম স্থান',
      teacherRemarks: 'অত্যন্ত মনোযোগী ও চমৎকার শিখন অগ্রগতি প্রদর্শন করেছে।',
      passed: true
    };
  };

  // Rank students based on grand total
  const rankedResults = useMemo(() => {
    const list = classStudents.map(st => getStudentResult(st.id));
    list.sort((a, b) => b.grandTotal - a.grandTotal);
    
    return list.map((res, idx) => ({
      ...res,
      position: getOrdinalBengali(idx + 1)
    }));
  }, [classStudents, results, selectedTerm]);

  // Handle in-table quick edit
  const handleContinuousChange = (studentId: string, subIdx: number, val: number) => {
    const current = getStudentResult(studentId);
    const updatedSubjects = [...current.subjectMarks];
    const item = { ...updatedSubjects[subIdx] };
    item.continuous = Math.min(30, Math.max(0, isNaN(val) ? 0 : val));
    item.total = item.continuous + item.summative;
    const { grade, gpa } = calculateGrade(item.total, item.fullMarks || 100);
    item.grade = grade;
    item.gpa = gpa;
    updatedSubjects[subIdx] = item;

    const grandTotal = updatedSubjects.reduce((acc, curr) => acc + curr.total, 0);
    const totalFullMarks = updatedSubjects.reduce((acc, curr) => acc + (curr.fullMarks || 100), 0);
    const avgScore = totalFullMarks > 0 ? (grandTotal / totalFullMarks) * 100 : 0;
    const { grade: overallGrade, gpa: overallGpa } = calculateGrade(avgScore);

    saveResult({
      ...current,
      subjectMarks: updatedSubjects,
      grandTotal,
      totalFullMarks,
      percentage: Number(avgScore.toFixed(1)),
      overallGrade,
      overallGpa
    });
  };

  const handleSummativeChange = (studentId: string, subIdx: number, val: number) => {
    const current = getStudentResult(studentId);
    const updatedSubjects = [...current.subjectMarks];
    const item = { ...updatedSubjects[subIdx] };
    item.summative = Math.min(70, Math.max(0, isNaN(val) ? 0 : val));
    item.total = item.continuous + item.summative;
    const { grade, gpa } = calculateGrade(item.total, item.fullMarks || 100);
    item.grade = grade;
    item.gpa = gpa;
    updatedSubjects[subIdx] = item;

    const grandTotal = updatedSubjects.reduce((acc, curr) => acc + curr.total, 0);
    const totalFullMarks = updatedSubjects.reduce((acc, curr) => acc + (curr.fullMarks || 100), 0);
    const avgScore = totalFullMarks > 0 ? (grandTotal / totalFullMarks) * 100 : 0;
    const { grade: overallGrade, gpa: overallGpa } = calculateGrade(avgScore);

    saveResult({
      ...current,
      subjectMarks: updatedSubjects,
      grandTotal,
      totalFullMarks,
      percentage: Number(avgScore.toFixed(1)),
      overallGrade,
      overallGpa
    });
  };

  const handleOpenModalForStudent = (st: Student) => {
    setModalStudent(st);
    setIsModalOpen(true);
  };

  const handleModalSave = (res: StudentResult) => {
    saveResult(res);
    setAlertMessage(`শিক্ষার্থী ${res.studentName}-এর পরীক্ষার নম্বর সংরক্ষিত হয়েছে!`);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  const handleCreateSheetFromModal = (res: StudentResult) => {
    saveResult(res);
    setSelectedStudentForCard(res.studentId);
    setActiveTabMode('reportCard');
  };

  const handleQuickCreateSheet = (studentId: string) => {
    setSelectedStudentForCard(studentId);
    setActiveTabMode('reportCard');
  };

  const handlePrint = () => {
    window.print();
  };

  const activeStudent = students.find(s => s.id === activeStudentId) || students[0];
  const activeResult = activeStudent ? (rankedResults.find(r => r.studentId === activeStudent.id) || getStudentResult(activeStudent.id)) : null;

  const currentStudentIndex = classStudents.findIndex(s => s.id === activeStudentId);
  const handlePrevStudent = () => {
    if (currentStudentIndex > 0) {
      setSelectedStudentForCard(classStudents[currentStudentIndex - 1].id);
    }
  };
  const handleNextStudent = () => {
    if (currentStudentIndex < classStudents.length - 1) {
      setSelectedStudentForCard(classStudents[currentStudentIndex + 1].id);
    }
  };

  const totalStudentsInClass = classStudents.length;
  const passedStudentsCount = rankedResults.filter(r => r.overallGrade !== 'F').length;
  const passRate = totalStudentsInClass > 0 
    ? Math.round((passedStudentsCount / totalStudentsInClass) * 100) 
    : 100;
  const highestMarksInClass = rankedResults.length > 0 ? rankedResults[0].grandTotal : 0;
  const aPlusCount = rankedResults.filter(r => r.overallGrade === 'A+').length;

  return (
    <div className="space-y-6 text-[#1f332c] font-['Hind_Siliguri',sans-serif]">
      {/* Top Filter & Navigation Bar */}
      <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#c0dfe1] shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4 no-print">
        {/* Left Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div>
            <span className="text-xs font-semibold text-[#53685e] block mb-1">মূল্যায়ন সেশন / পরীক্ষা:</span>
            <select
              value={selectedTerm}
              onChange={e => setSelectedTerm(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold border border-[#c0dfe1] rounded-xl bg-[#ffffff] text-[#1f332c] focus:ring-1 focus:ring-[#749fa0] outline-none"
            >
              {termsList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-xs font-semibold text-[#53685e] block mb-1">শ্রেণি নির্বাচন:</span>
            <select
              value={selectedClass}
              onChange={e => {
                setSelectedClass(e.target.value);
                const first = students.find(s => s.class === e.target.value);
                if (first) setSelectedStudentForCard(first.id);
              }}
              className="px-3 py-1.5 text-xs font-bold border border-[#c0dfe1] rounded-xl bg-[#ffffff] text-[#1f332c] focus:ring-1 focus:ring-[#749fa0] outline-none"
            >
              {classesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-xs font-semibold text-[#53685e] block mb-1">শিক্ষাবর্ষ:</span>
            <span className="inline-block px-3 py-1.5 text-xs font-bold border border-[#c0dfe1] rounded-xl bg-[#eae8d9]/60 text-[#1f332c]">
              ২০২৬ খ্রি.
            </span>
          </div>
        </div>

        {/* Right Navigation & Mode Toggles */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          {classStudents.length > 0 && (
            <button
              onClick={() => handleOpenModalForStudent(classStudents[0])}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#78988b] hover:bg-[#658276] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>নম্বর এন্ট্রি ফরম</span>
            </button>
          )}

          {/* Mode 1: Entry Tab */}
          <button
            onClick={() => setActiveTabMode('entry')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTabMode === 'entry'
                ? 'bg-[#78988b] text-white shadow-xs'
                : 'bg-[#ffffff] text-[#53685e] hover:bg-[#b1c0a1]/20 border border-[#c0dfe1]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>নম্বর শিট ও এন্ট্রি</span>
          </button>

          {/* Mode 2: Create Result Sheet (A4) */}
          <button
            onClick={() => {
              if (classStudents.length > 0 && !selectedStudentForCard) {
                setSelectedStudentForCard(classStudents[0].id);
              }
              setActiveTabMode('reportCard');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
              activeTabMode === 'reportCard'
                ? 'bg-[#749fa0] text-white ring-2 ring-[#c0dfe1]'
                : 'bg-[#b1c0a1]/30 text-[#1f332c] hover:bg-[#b1c0a1]/50 border border-[#b1c0a1]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>📄 ক্রিয়েট রেজাল্ট শিট (A4)</span>
          </button>

          {/* Mode 3: Batch Print All A4 */}
          <button
            onClick={() => setActiveTabMode('batchPrint')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTabMode === 'batchPrint'
                ? 'bg-[#78988b] text-white shadow-xs'
                : 'bg-[#ffffff] text-[#53685e] hover:bg-[#b1c0a1]/20 border border-[#c0dfe1]'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>সকল রেজাল্ট প্রিন্ট (A4)</span>
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {saveAlert && (
        <div className="p-3 bg-[#b1c0a1]/30 border border-[#b1c0a1] text-[#1f332c] rounded-xl text-xs font-bold flex items-center gap-2 no-print shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#78988b] shrink-0" />
          <span>{alertMessage || 'নম্বর ও মূল্যায়ন ফলাফল সফলভাবে সংরক্ষিত হয়েছে!'}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 no-print">
        <div className="bg-[#ffffff] p-3.5 rounded-2xl border border-[#c0dfe1] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#53685e] block">মোট পরীক্ষার্থী</span>
            <strong className="text-xl font-black text-[#1f332c] font-mono">
              {toBengaliNumber(totalStudentsInClass)} জন
            </strong>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#b1c0a1]/30 text-[#78988b] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#ffffff] p-3.5 rounded-2xl border border-[#c0dfe1] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#53685e] block">সর্বোচ্চ নম্বর</span>
            <strong className="text-xl font-black text-[#78988b] font-mono">
              {toBengaliNumber(highestMarksInClass)}
            </strong>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#b1c0a1]/30 text-[#78988b] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#ffffff] p-3.5 rounded-2xl border border-[#c0dfe1] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#53685e] block">A+ অর্জনকারী</span>
            <strong className="text-xl font-black text-[#749fa0] font-mono">
              {toBengaliNumber(aPlusCount)} জন
            </strong>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#c0dfe1]/40 text-[#749fa0] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#ffffff] p-3.5 rounded-2xl border border-[#c0dfe1] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#53685e] block">পাসের হার</span>
            <strong className="text-xl font-black text-[#78988b] font-mono">
              {toBengaliNumber(passRate)}%
            </strong>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#b1c0a1]/30 text-[#78988b] flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* MODE 1: MARKS ENTRY & TABULATION SHEET */}
      {activeTabMode === 'entry' && (
        <div className="bg-[#ffffff] rounded-2xl border border-[#c0dfe1] shadow-xs overflow-hidden p-5">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-[#c0dfe1] gap-2">
            <div>
              <h3 className="text-base font-bold text-[#1f332c] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#78988b]" />
                <span>{institution.nameBn} — বিষয়ভিত্তিক নম্বর এন্ট্রি ও মূল্যায়ন</span>
              </h3>
              <p className="text-xs text-[#53685e] mt-0.5">
                {selectedTerm} ({selectedClass}) • শিক্ষাবর্ষ: ২০২৬ খ্রি. | টেবিলের ঘরে সরাসরি নম্বর টাইপ করুন বা এন্ট্রি ফরম বোতামে ক্লিক করুন।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAlertMessage('সকল নম্বর সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে!');
                  setSaveAlert(true);
                  setTimeout(() => setSaveAlert(false), 3000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#78988b] hover:bg-[#658276] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>সব সেভ করুন</span>
              </button>
            </div>
          </div>

          {/* Grading Note */}
          <div className="bg-[#eae8d9]/50 border border-[#c0dfe1] p-2.5 rounded-xl text-[11px] text-[#1f332c] mb-4 flex items-center justify-between">
            <div>
              <strong>মূল্যায়ন নির্দেশিকা:</strong> প্রতিটি বিষয়ে ধারাবাহিক (৩০) + সামষ্টিক (৭০) = মোট ১০০ নম্বর। প্রাপ্ত মোট নম্বর অনুযায়ী গ্রেড ও জিপিএ স্বয়ংক্রিয়ভাবে ক্যালকুলেট হয়।
            </div>
            <span className="font-bold text-[#1f332c] bg-[#b1c0a1]/40 border border-[#b1c0a1] px-2 py-0.5 rounded-md text-[10px]">
              অটো-র‍্যাঙ্ক সক্রিয়
            </span>
          </div>

          {/* Students Marksheet Table */}
          {classStudents.length === 0 ? (
            <div className="text-center py-12 text-[#53685e]">
              <Users className="w-10 h-10 mx-auto text-[#78988b]/40 mb-2" />
              <p className="font-bold text-sm text-[#1f332c]">এই শ্রেণিতে কোনো শিক্ষার্থী নেই।</p>
              <p className="text-xs text-[#53685e] mt-1">
                শিক্ষার্থী ব্যবস্থাপনা সেকশন থেকে নতুন শিক্ষার্থী ভর্তি করুন।
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#c0dfe1] rounded-xl shadow-2xs">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-[#78988b] text-white font-bold text-[11px]">
                    <th rowSpan={2} className="p-2 border border-[#688579] w-10">ক্র.</th>
                    <th rowSpan={2} className="p-2 border border-[#688579] text-left min-w-[140px]">শিক্ষার্থীর নাম ও রোল</th>
                    <th rowSpan={2} className="p-2 border border-[#688579] w-14">শাখা</th>

                    {defaultSubjects.map(sub => (
                      <th key={sub} colSpan={3} className="p-1.5 border border-[#688579] font-bold">
                        {sub} (১০০)
                      </th>
                    ))}

                    <th rowSpan={2} className="p-2 border border-[#688579] bg-[#688579] text-white w-16">মোট</th>
                    <th rowSpan={2} className="p-2 border border-[#688579] bg-[#688579] text-white w-14">গ্রেড</th>
                    <th rowSpan={2} className="p-2 border border-[#688579] bg-[#688579] text-white w-14">জিপিএ</th>
                    <th rowSpan={2} className="p-2 border border-[#688579] bg-[#688579] text-white w-16">মেধা স্থান</th>
                    <th rowSpan={2} className="p-2 border border-[#688579] min-w-[160px] no-print">রেজাল্ট শিট অ্যাকশন</th>
                  </tr>
                  <tr className="bg-[#658276] text-white/90 text-[10px] font-medium">
                    {defaultSubjects.map(sub => (
                      <React.Fragment key={`${sub}-sub`}>
                        <th className="p-1 border border-[#587267]">ধা (৩০)</th>
                        <th className="p-1 border border-[#587267]">সা (৭০)</th>
                        <th className="p-1 border border-[#587267] font-bold text-white bg-[#587267]">মোট</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c0dfe1] text-xs">
                  {classStudents.map((st, idx) => {
                    const res = rankedResults.find(r => r.studentId === st.id) || getStudentResult(st.id);
                    return (
                      <tr key={st.id} className="hover:bg-[#eae8d9]/30 transition">
                        <td className="p-2 border-r border-[#c0dfe1] font-mono text-[#53685e]">
                          {toBengaliNumber(idx + 1)}
                        </td>
                        <td className="p-2 border-r border-[#c0dfe1] text-left">
                          <div className="font-bold text-[#1f332c]">{st.nameBn}</div>
                          <div className="text-[10px] text-[#53685e] font-mono">
                            রোল: <strong className="text-[#78988b] font-bold">{st.roll}</strong>
                          </div>
                        </td>
                        <td className="p-2 border-r border-[#c0dfe1] font-medium text-[#1f332c]">
                          {st.section}
                        </td>

                        {/* Subject Marks Columns */}
                        {res.subjectMarks.slice(0, defaultSubjects.length).map((sm, sIdx) => (
                          <React.Fragment key={sm.subjectName}>
                            <td className="p-1 border-r border-[#c0dfe1] font-mono">
                              <input
                                type="number"
                                min={0}
                                max={30}
                                value={sm.continuous}
                                onChange={e => handleContinuousChange(st.id, sIdx, Number(e.target.value))}
                                className="w-11 text-center py-1 bg-white border border-[#c0dfe1] rounded font-semibold text-[#1f332c] focus:ring-1 focus:ring-[#749fa0] outline-none"
                              />
                            </td>
                            <td className="p-1 border-r border-[#c0dfe1] font-mono">
                              <input
                                type="number"
                                min={0}
                                max={70}
                                value={sm.summative}
                                onChange={e => handleSummativeChange(st.id, sIdx, Number(e.target.value))}
                                className="w-11 text-center py-1 bg-white border border-[#c0dfe1] rounded font-semibold text-[#1f332c] focus:ring-1 focus:ring-[#749fa0] outline-none"
                              />
                            </td>
                            <td className="p-1 border-r border-[#c0dfe1] font-mono font-black text-[#1f332c] bg-[#eae8d9]/30">
                              {toBengaliNumber(sm.total)}
                            </td>
                          </React.Fragment>
                        ))}

                        {/* Summary Columns */}
                        <td className="p-2 border-r border-[#c0dfe1] font-mono font-black text-[#78988b] bg-[#b1c0a1]/20">
                          {toBengaliNumber(res.grandTotal)}
                        </td>
                        <td className="p-2 border-r border-[#c0dfe1] font-bold font-mono">
                          <span className={
                            res.overallGrade === 'A+' ? 'text-[#78988b]' :
                            res.overallGrade === 'A' || res.overallGrade === 'A-' ? 'text-[#749fa0]' :
                            res.overallGrade === 'F' ? 'text-rose-700' : 'text-amber-800'
                          }>
                            {res.overallGrade}
                          </span>
                        </td>
                        <td className="p-2 border-r border-[#c0dfe1] font-bold font-mono text-[#1f332c]">
                          {toBengaliNumber(res.overallGpa.toFixed(2))}
                        </td>
                        <td className="p-2 border-r border-[#c0dfe1] font-bold text-[#1f332c] bg-[#b1c0a1]/20">
                          {res.position}
                        </td>

                        {/* Action Column */}
                        <td className="p-2 no-print">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenModalForStudent(st)}
                              className="px-2 py-1.5 bg-[#eae8d9]/60 hover:bg-[#b1c0a1]/30 text-[#1f332c] border border-[#c0dfe1] rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                              title="নম্বর এন্ট্রি ফরম খুলুন"
                            >
                              <Edit3 className="w-3 h-3 text-[#78988b]" />
                              <span>এন্ট্রি ফরম</span>
                            </button>

                            <button
                              onClick={() => handleQuickCreateSheet(st.id)}
                              className="px-2.5 py-1.5 bg-[#749fa0] hover:bg-[#5f8788] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                              title="রেজাল্ট শিট তৈরি ও প্রিন্ট করুন"
                            >
                              <Award className="w-3 h-3" />
                              <span>📄 ক্রিয়েট শিট</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: INDIVIDUAL A4 RESULT SHEET PRINT PREVIEW */}
      {activeTabMode === 'reportCard' && activeStudent && activeResult && (
        <div className="space-y-4">
          <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#c0dfe1] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 no-print">
            {/* Student Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#53685e]">শিক্ষার্থী নির্বাচন:</span>
              <select
                value={activeStudentId}
                onChange={e => setSelectedStudentForCard(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold border border-[#c0dfe1] rounded-xl bg-[#ffffff] text-[#1f332c] focus:ring-1 focus:ring-[#749fa0] outline-none"
              >
                {classStudents.map(s => (
                  <option key={s.id} value={s.id}>
                    রোল {s.roll} — {s.nameBn}
                  </option>
                ))}
              </select>

              {/* Prev / Next buttons */}
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={handlePrevStudent}
                  disabled={currentStudentIndex <= 0}
                  className="p-1.5 bg-[#eae8d9]/60 hover:bg-[#b1c0a1]/30 border border-[#c0dfe1] disabled:opacity-40 rounded-lg text-[#1f332c] transition cursor-pointer"
                  title="পূর্বের শিক্ষার্থী"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-[#53685e] px-1">
                  {toBengaliNumber(currentStudentIndex + 1)} / {toBengaliNumber(classStudents.length)}
                </span>
                <button
                  onClick={handleNextStudent}
                  disabled={currentStudentIndex >= classStudents.length - 1}
                  className="p-1.5 bg-[#eae8d9]/60 hover:bg-[#b1c0a1]/30 border border-[#c0dfe1] disabled:opacity-40 rounded-lg text-[#1f332c] transition cursor-pointer"
                  title="পরবর্তী শিক্ষার্থী"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => handleOpenModalForStudent(activeStudent)}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#eae8d9]/60 hover:bg-[#b1c0a1]/30 border border-[#c0dfe1] text-[#1f332c] rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#78988b]" />
                <span>নম্বর সম্পাদন</span>
              </button>

              <button
                onClick={() => setActiveTabMode('entry')}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#eae8d9]/60 hover:bg-[#b1c0a1]/30 border border-[#c0dfe1] text-[#53685e] rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#78988b]" />
                <span>নম্বর তালিকায় ফিরে যান</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2 bg-[#78988b] hover:bg-[#658276] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>🖨️ এ ফোর (A4) পেজে প্রিন্ট করুন</span>
              </button>
            </div>
          </div>

          {/* Paper Canvas Backdrop on Screen */}
          <div className="bg-[#eae8d9]/80 p-4 md:p-8 rounded-3xl overflow-x-auto flex justify-center border border-[#c0dfe1] shadow-inner">
            <ResultSheetA4
              institution={institution}
              student={activeStudent}
              result={activeResult}
            />
          </div>
        </div>
      )}

      {/* MODE 3: BATCH PRINT ALL A4 RESULT SHEETS */}
      {activeTabMode === 'batchPrint' && (
        <div className="space-y-4">
          <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#c0dfe1] shadow-xs flex items-center justify-between no-print">
            <div>
              <h4 className="text-sm font-bold text-[#1f332c]">
                {selectedClass}-এর সকল শিক্ষার্থীর রেজাল্ট শিট (A4 ব্যাচ প্রিন্ট)
              </h4>
              <p className="text-xs text-[#53685e]">
                মোট {toBengaliNumber(classStudents.length)} জন শিক্ষার্থীর A4 রেজাল্ট শিট ক্রমানুসারে তৈরি করা হয়েছে।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTabMode('entry')}
                className="px-3 py-2 bg-[#eae8d9]/60 hover:bg-[#b1c0a1]/30 border border-[#c0dfe1] text-[#1f332c] rounded-xl text-xs font-bold transition cursor-pointer"
              >
                বাতিল
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2 bg-[#78988b] hover:bg-[#658276] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>🖨️ সবগুলো একসাথে প্রিন্ট করুন</span>
              </button>
            </div>
          </div>

          {/* Render All A4 Pages */}
          <div className="space-y-8 print:space-y-0">
            {classStudents.map(st => {
              const res = rankedResults.find(r => r.studentId === st.id) || getStudentResult(st.id);
              return (
                <div key={st.id} className="bg-[#eae8d9]/80 p-4 md:p-6 rounded-3xl overflow-x-auto flex justify-center print:bg-white print:p-0">
                  <ResultSheetA4
                    institution={institution}
                    student={st}
                    result={res}
                    isBatch={true}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Marks Entry Modal */}
      {modalStudent && (
        <MarksEntryModal
          isOpen={isModalOpen}
          student={modalStudent}
          initialResult={getStudentResult(modalStudent.id)}
          term={selectedTerm}
          academicYear="২০২৬"
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalSave}
          onCreateResultSheet={handleCreateSheetFromModal}
        />
      )}
    </div>
  );
};
