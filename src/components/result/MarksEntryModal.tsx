import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  FileText, 
  Plus, 
  Trash2, 
  Award, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Calculator,
  User
} from 'lucide-react';
import { Student, StudentResult, SubjectMarks, GradeType } from '../../types';
import { toBengaliNumber, calculateGrade } from '../../utils/bengaliUtils';

interface MarksEntryModalProps {
  student: Student;
  initialResult: StudentResult;
  term: string;
  academicYear: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (result: StudentResult) => void;
  onCreateResultSheet: (result: StudentResult) => void;
}

export const MarksEntryModal: React.FC<MarksEntryModalProps> = ({
  student,
  initialResult,
  term,
  academicYear,
  isOpen,
  onClose,
  onSave,
  onCreateResultSheet,
}) => {
  const [subjects, setSubjects] = useState<SubjectMarks[]>(initialResult.subjectMarks);
  const [attendanceDays, setAttendanceDays] = useState<number>(initialResult.attendanceDays || 72);
  const [totalWorkingDays, setTotalWorkingDays] = useState<number>(initialResult.totalWorkingDays || 75);
  const [teacherRemarks, setTeacherRemarks] = useState<string>(
    initialResult.teacherRemarks || 'অত্যন্ত মনোযোগী এবং চমৎকার শিখন অগ্রগতি প্রদর্শন করেছে।'
  );
  const [position, setPosition] = useState<string>(initialResult.position || '১ম স্থান');

  const [newSubjectName, setNewSubjectName] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);

  useEffect(() => {
    setSubjects(initialResult.subjectMarks);
    setAttendanceDays(initialResult.attendanceDays || 72);
    setTotalWorkingDays(initialResult.totalWorkingDays || 75);
    setTeacherRemarks(initialResult.teacherRemarks || 'অত্যন্ত মনোযোগী এবং চমৎকার শিখন অগ্রগতি প্রদর্শন করেছে।');
    setPosition(initialResult.position || '১ম স্থান');
  }, [initialResult]);

  if (!isOpen) return null;

  // Handle changes to continuous or summative marks
  const handleMarkChange = (index: number, field: 'continuous' | 'summative', value: number) => {
    const updated = [...subjects];
    const item = { ...updated[index] };
    const num = Math.max(0, isNaN(value) ? 0 : value);

    if (field === 'continuous') {
      item.continuous = Math.min(item.fullMarks === 50 ? 20 : 30, num);
    } else {
      item.summative = Math.min(item.fullMarks === 50 ? 30 : 70, num);
    }

    item.total = item.continuous + item.summative;
    const { grade, gpa } = calculateGrade(item.total, item.fullMarks || 100);
    item.grade = grade;
    item.gpa = gpa;
    updated[index] = item;
    setSubjects(updated);
  };

  // Direct total change (for simple 100-mark entry)
  const handleDirectTotalChange = (index: number, val: number) => {
    const updated = [...subjects];
    const item = { ...updated[index] };
    const full = item.fullMarks || 100;
    const clamped = Math.min(full, Math.max(0, isNaN(val) ? 0 : val));
    item.total = clamped;
    item.continuous = Math.round((clamped * 30) / 100);
    item.summative = clamped - item.continuous;
    const { grade, gpa } = calculateGrade(item.total, full);
    item.grade = grade;
    item.gpa = gpa;
    updated[index] = item;
    setSubjects(updated);
  };

  // Add new subject
  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    const newSub: SubjectMarks = {
      subjectName: newSubjectName.trim(),
      fullMarks: 100,
      continuous: 25,
      summative: 60,
      total: 85,
      highestMarks: 95,
      grade: 'A+',
      gpa: 5.0
    };
    setSubjects([...subjects, newSub]);
    setNewSubjectName('');
    setShowAddSubject(false);
  };

  // Delete a subject
  const handleDeleteSubject = (index: number) => {
    if (subjects.length <= 1) {
      alert('কমপক্ষে একটি বিষয় রাখা আবশ্যক!');
      return;
    }
    setSubjects(subjects.filter((_, idx) => idx !== index));
  };

  // Computed summary
  const grandTotal = subjects.reduce((sum, s) => sum + s.total, 0);
  const totalFullMarks = subjects.reduce((sum, s) => sum + (s.fullMarks || 100), 0);
  const percentage = totalFullMarks > 0 ? (grandTotal / totalFullMarks) * 100 : 0;
  const avgMarks = subjects.length > 0 ? grandTotal / subjects.length : 0;
  const { grade: overallGrade, gpa: overallGpa } = calculateGrade(avgMarks);

  const buildResultData = (): StudentResult => {
    return {
      ...initialResult,
      studentId: student.id,
      studentName: student.nameBn,
      roll: student.roll,
      class: student.class,
      section: student.section,
      term,
      academicYear,
      attendanceDays,
      totalWorkingDays,
      subjectMarks: subjects,
      grandTotal,
      totalFullMarks,
      percentage: Number(percentage.toFixed(1)),
      overallGrade,
      overallGpa,
      position,
      teacherRemarks,
      passed: overallGrade !== 'F',
    };
  };

  const handleSaveOnly = () => {
    const data = buildResultData();
    onSave(data);
    onClose();
  };

  const handleSaveAndCreateSheet = () => {
    const data = buildResultData();
    onSave(data);
    onCreateResultSheet(data);
    onClose();
  };

  const remarkPresets = [
    'অত্যন্ত মনোযোগী এবং চমৎকার শিখন অগ্রগতি প্রদর্শন করেছে।',
    'চমৎকার ফলাফল অর্জন করেছে। গণিত ও বিজ্ঞানে বিশেষ দক্ষতা আছে।',
    'ভালো ফলাফল করেছে। নিয়মিত পাঠাভ্যাস বজায় রাখলে আরও উন্নতি হবে।',
    'সন্তোষজনক শিখন অগ্রগতি। পরীক্ষায় আরও মনোযোগী হওয়া আবশ্যক।',
    'নিয়মিত ক্লাসে উপস্থিতি এবং হাতের লেখায় আরও যত্নশীল হওয়া প্রয়োজন।'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#1f332c]/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto font-['Hind_Siliguri',sans-serif]">
      <div className="bg-[#ffffff] rounded-3xl w-full max-w-3xl shadow-2xl border border-[#c0dfe1] overflow-hidden my-auto max-h-[95vh] flex flex-col text-[#1f332c]">
        {/* Modal Header */}
        <div className="bg-[#78988b] text-white p-5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold">
                পরীক্ষার নম্বর এন্ট্রি ও মূল্যায়ন
              </h3>
              <p className="text-xs text-[#eae8d9]">
                শিক্ষার্থী: <strong className="text-white font-bold">{student.nameBn}</strong> (রোল: {student.roll}, শ্রেণি: {student.class})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Top Session Info Pill */}
          <div className="bg-[#eae8d9]/50 border border-[#c0dfe1] p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#78988b]" />
              <span className="font-semibold text-[#53685e]">মূল্যায়ন সেশন:</span>
              <span className="font-bold text-[#1f332c] bg-white px-2.5 py-1 rounded-lg border border-[#c0dfe1]">
                {term} ({academicYear})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#53685e]">মেধা স্থান:</span>
              <input
                type="text"
                value={position}
                onChange={e => setPosition(e.target.value)}
                placeholder="১ম স্থান"
                className="w-24 px-2 py-1 bg-white border border-[#c0dfe1] rounded-lg text-center font-bold text-[#78988b] outline-none"
              />
            </div>
          </div>

          {/* Subjects & Marks Table */}
          <div className="border border-[#c0dfe1] rounded-2xl overflow-hidden shadow-2xs">
            <div className="bg-[#eae8d9]/40 p-3 border-b border-[#c0dfe1] flex items-center justify-between">
              <div className="font-bold text-[#1f332c] flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#78988b]" />
                <span>বিষয়ভিত্তিক নম্বর প্রদান (ধারাবাহিক ৩০ + সামষ্টিক ৭০ = ১০০):</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSubject(true)}
                className="flex items-center gap-1 text-[11px] font-bold text-[#1f332c] hover:bg-[#b1c0a1]/40 bg-[#b1c0a1]/25 border border-[#b1c0a1] px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#78988b]" />
                <span>নতুন বিষয় যোগ করুন</span>
              </button>
            </div>

            {/* Add Subject Input Box */}
            {showAddSubject && (
              <div className="p-3 bg-[#eae8d9]/60 border-b border-[#c0dfe1] flex items-center gap-2">
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={e => setNewSubjectName(e.target.value)}
                  placeholder="বিষয়ের নাম (যেমন: তথ্য ও যোগাযোগ প্রযুক্তি / কৃষি শিক্ষা)"
                  className="flex-1 p-2 bg-white border border-[#c0dfe1] rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#749fa0]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="px-3 py-2 bg-[#78988b] hover:bg-[#658276] text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
                >
                  যোগ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSubject(false)}
                  className="px-3 py-2 bg-[#eae8d9] hover:bg-[#b1c0a1]/40 text-[#53685e] font-semibold rounded-xl text-xs cursor-pointer"
                >
                  বাতিল
                </button>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-[#78988b] text-white text-[11px] font-semibold">
                    <th className="p-2.5 text-left pl-3">বিষয়ের নাম</th>
                    <th className="p-2.5 w-24">ধারাবাহিক (৩০)</th>
                    <th className="p-2.5 w-24">সামষ্টিক (৭০)</th>
                    <th className="p-2.5 w-24 bg-[#658276] text-white font-bold">মোট (১০০)</th>
                    <th className="p-2.5 w-16">গ্রেড</th>
                    <th className="p-2.5 w-16">পয়েন্ট</th>
                    <th className="p-2.5 w-10">মুছুন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c0dfe1] text-xs">
                  {subjects.map((sub, idx) => (
                    <tr key={sub.subjectName} className="hover:bg-[#eae8d9]/30 transition">
                      <td className="p-2.5 text-left pl-3 font-bold text-[#1f332c]">
                        {sub.subjectName}
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          max={30}
                          value={sub.continuous}
                          onChange={e => handleMarkChange(idx, 'continuous', parseInt(e.target.value, 10))}
                          className="w-16 text-center py-1 bg-white border border-[#c0dfe1] rounded-lg font-mono font-bold text-[#1f332c] focus:ring-1 focus:ring-[#749fa0] outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          max={70}
                          value={sub.summative}
                          onChange={e => handleMarkChange(idx, 'summative', parseInt(e.target.value, 10))}
                          className="w-16 text-center py-1 bg-white border border-[#c0dfe1] rounded-lg font-mono font-bold text-[#1f332c] focus:ring-1 focus:ring-[#749fa0] outline-none"
                        />
                      </td>
                      <td className="p-2 bg-[#b1c0a1]/20">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={sub.total}
                          onChange={e => handleDirectTotalChange(idx, parseInt(e.target.value, 10))}
                          className="w-16 text-center py-1 bg-white border-2 border-[#78988b] rounded-lg font-mono font-extrabold text-[#1f332c] focus:ring-1 focus:ring-[#749fa0] outline-none"
                        />
                      </td>
                      <td className="p-2 font-mono font-bold">
                        <span className={
                          sub.grade === 'A+' ? 'text-[#78988b] bg-[#b1c0a1]/30 px-2 py-0.5 rounded' :
                          sub.grade === 'A' || sub.grade === 'A-' ? 'text-[#749fa0] bg-[#c0dfe1]/40 px-2 py-0.5 rounded' :
                          sub.grade === 'F' ? 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded' : 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded'
                        }>
                          {sub.grade}
                        </span>
                      </td>
                      <td className="p-2 font-mono font-bold text-[#1f332c]">
                        {toBengaliNumber(sub.gpa.toFixed(2))}
                      </td>
                      <td className="p-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(idx)}
                          className="p-1 text-[#53685e] hover:text-rose-600 rounded transition cursor-pointer"
                          title="বিষয়টি সরান"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Calculated Stats Banner */}
          <div className="p-3 bg-[#b1c0a1]/20 border border-[#b1c0a1] rounded-2xl grid grid-cols-4 gap-2 text-center">
            <div>
              <span className="text-[10px] text-[#53685e] font-semibold block">মোট প্রাপ্ত নম্বর</span>
              <strong className="text-base font-extrabold text-[#78988b] font-mono">
                {toBengaliNumber(grandTotal)}
              </strong>
              <span className="text-[10px] text-[#53685e] font-mono">/{toBengaliNumber(totalFullMarks)}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#53685e] font-semibold block">শতকরা হার</span>
              <strong className="text-base font-extrabold text-[#1f332c] font-mono">
                {toBengaliNumber(percentage.toFixed(1))}%
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-[#53685e] font-semibold block">সামগ্রিক গ্রেড</span>
              <strong className="text-base font-extrabold text-[#78988b]">
                {overallGrade}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-[#53685e] font-semibold block">গড় জিপিএ (GPA)</span>
              <strong className="text-base font-extrabold text-[#749fa0] font-mono">
                {toBengaliNumber(overallGpa.toFixed(2))}
              </strong>
            </div>
          </div>

          {/* Attendance and Working Days */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#53685e] font-semibold mb-1">
                উপস্থিতির দিন সংখ্যা:
              </label>
              <input
                type="number"
                value={attendanceDays}
                onChange={e => setAttendanceDays(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full p-2.5 bg-white border border-[#c0dfe1] rounded-xl font-mono text-center font-bold text-[#1f332c] outline-none"
              />
            </div>
            <div>
              <label className="block text-[#53685e] font-semibold mb-1">
                মোট কর্মদিবস:
              </label>
              <input
                type="number"
                value={totalWorkingDays}
                onChange={e => setTotalWorkingDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full p-2.5 bg-white border border-[#c0dfe1] rounded-xl font-mono text-center font-bold text-[#1f332c] outline-none"
              />
            </div>
          </div>

          {/* Teacher Remarks with Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[#53685e] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#78988b]" />
                <span>শ্রেণি শিক্ষকের মন্তব্য ও অগ্রগতি পর্যালোচনা:</span>
              </label>
            </div>
            <textarea
              rows={2}
              value={teacherRemarks}
              onChange={e => setTeacherRemarks(e.target.value)}
              className="w-full p-3 bg-white border border-[#c0dfe1] rounded-xl text-[#1f332c] outline-none focus:ring-1 focus:ring-[#749fa0]"
              placeholder="শিক্ষার্থীর শিখন অগ্রগতি সম্পর্কে মন্তব্য লিখুন..."
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] text-[#53685e] font-semibold self-center">প্রিসেট:</span>
              {remarkPresets.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTeacherRemarks(preset)}
                  className="text-[10px] bg-[#eae8d9]/70 hover:bg-[#b1c0a1]/30 border border-[#c0dfe1] text-[#1f332c] px-2 py-1 rounded-lg truncate max-w-xs transition cursor-pointer"
                  title={preset}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer: Action Buttons */}
        <div className="bg-[#eae8d9]/50 p-4 border-t border-[#c0dfe1] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-[#53685e] hover:bg-[#b1c0a1]/30 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            বাতিল
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSaveOnly}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#78988b] hover:bg-[#658276] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>নম্বর সংরক্ষণ করুন</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndCreateSheet}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-[#749fa0] hover:bg-[#5f8788] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>📄 ক্রিয়েট রেজাল্ট শিট (A4)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
