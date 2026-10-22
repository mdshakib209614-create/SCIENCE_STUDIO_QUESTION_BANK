import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Printer, 
  Trash2, 
  Edit, 
  IdCard, 
  Eye, 
  X, 
  Check, 
  Download,
  School,
  QrCode
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import { toBengaliNumber } from '../utils/bengaliUtils';

export const StudentsView: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent, institution } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('সকল শ্রেণি');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Print view state
  const [printableAdmissionStudent, setPrintableAdmissionStudent] = useState<Student | null>(null);
  const [printableIdCardStudent, setPrintableIdCardStudent] = useState<Student | null>(null);
  const [isBulkIdCardModalOpen, setIsBulkIdCardModalOpen] = useState(false);

  // Form state
  const initialFormState: Omit<Student, 'id'> = {
    roll: '',
    nameBn: '',
    nameEn: '',
    class: '১ম শ্রেণি',
    section: 'ক',
    shift: 'সকাল',
    gender: 'ছেলে',
    fatherName: '',
    motherName: '',
    phone: '',
    birthDate: '২০১৮-০১-০১',
    birthDateWords: '',
    nidOrBirthReg: '',
    bloodGroup: 'A+',
    address: 'কলাবাড়িয়া, সেনবাগ, নোয়াখালী',
    village: 'কলাবাড়িয়া',
    postOffice: 'লুধুয়া',
    upazila: 'সেনবাগ',
    district: 'নোয়াখালী',
    admissionDate: '২০২৬-০১-১৫',
    status: 'সক্রিয়',
    monthlyFee: 1200,
    feeStatus: 'পরিশোধিত',
  };

  const [formData, setFormData] = useState<Omit<Student, 'id'>>(initialFormState);

  // Classes list
  const classesList = ['সকল শ্রেণি', '১ম শ্রেণি', '২য় শ্রেণি', '৩য় শ্রেণি', '৪র্থ শ্রেণি', '৫ম শ্রেণি', '৬ষ্ঠ শ্রেণি', '৭ম শ্রেণি', '৮ম শ্রেণি', '৯ম শ্রেণি', '১০ম শ্রেণি'];

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll.includes(searchQuery) ||
      s.phone.includes(searchQuery) ||
      s.nidOrBirthReg.includes(searchQuery);

    const matchesClass = selectedClass === 'সকল শ্রেণি' || s.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleOpenAddModal = () => {
    const nextRollNum = students.length + 1;
    const formattedRoll = nextRollNum.toString().padStart(3, '0');
    setFormData({
      ...initialFormState,
      roll: toBengaliNumber(formattedRoll),
    });
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData(student);
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      addStudent(formData);
    }
    setIsAddModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-[#1f332c]">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#ffffff] p-5 rounded-2xl border border-[#c0dfe1] shadow-xs no-print">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#b1c0a1]/30 border border-[#b1c0a1] flex items-center justify-center text-[#78988b] shrink-0 shadow-2xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1f332c]">
                শিক্ষার্থী তালিকা ও ভর্তি ব্যবস্থাপনা
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#b1c0a1]/30 border border-[#b1c0a1] text-[#1f332c] font-bold">
                মোট: {toBengaliNumber(students.length)} জন
              </span>
            </div>
            <p className="text-xs text-[#53685e] mt-0.5">
              শিক্ষার্থী প্রোফাইল এডিট, নতুন ভর্তি ফরম এবং আইডি কার্ড প্রিন্ট
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 bg-[#78988b] hover:bg-[#658276] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ নতুন শিক্ষার্থী</span>
          </button>

          <button
            onClick={() => {
              if (filteredStudents.length > 0) {
                setPrintableAdmissionStudent(filteredStudents[0]);
              }
            }}
            className="flex items-center gap-1.5 bg-[#749fa0] hover:bg-[#5f8788] text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ভর্তি ফরম PDF</span>
          </button>

          <button
            onClick={() => setIsBulkIdCardModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#b1c0a1] hover:bg-[#9eb08d] text-[#1f332c] px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer border border-[#78988b]/30"
          >
            <IdCard className="w-3.5 h-3.5 text-[#1f332c]" />
            <span>ID Card - (সকল)</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#ffffff] p-4 rounded-2xl border border-[#c0dfe1] shadow-xs no-print">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#78988b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="নাম/রোল/মোবাইল নং খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#c0dfe1] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#749fa0] bg-[#ffffff] text-[#1f332c]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#53685e] font-medium shrink-0">শ্রেণি ফিল্টার:</span>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] focus:outline-none focus:ring-1 focus:ring-[#749fa0] font-medium text-[#1f332c]"
          >
            {classesList.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 no-print">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full bg-[#ffffff] p-8 text-center rounded-2xl border border-[#c0dfe1] text-[#53685e]">
            <GraduationCap className="w-10 h-10 mx-auto text-[#78988b] mb-2" />
            <p className="text-sm font-semibold text-[#1f332c]">কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি</p>
            <p className="text-xs text-[#53685e] mt-1">অনুসন্ধানের কিওয়ার্ড পরিবর্তন করে চেষ্টা করুন</p>
          </div>
        ) : (
          filteredStudents.map(student => (
            <div 
              key={student.id}
              className="bg-[#ffffff] rounded-2xl border border-[#c0dfe1] shadow-xs hover:border-[#749fa0] hover:shadow-md transition p-4 flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                {/* Photo Placeholder */}
                <div className="w-16 h-20 rounded-xl bg-[#eae8d9]/70 border border-[#c0dfe1] flex flex-col items-center justify-center text-[#53685e] shrink-0 text-[11px] font-semibold overflow-hidden">
                  {student.photoUrl ? (
                    <img src={student.photoUrl} alt={student.nameBn} className="w-full h-full object-cover" />
                  ) : (
                    <span>ছবি</span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-0.5 min-w-0 flex-1 text-xs">
                  <h3 className="font-bold text-[#1f332c] truncate text-sm">
                    {student.nameBn} ({student.roll})
                  </h3>
                  <p className="text-[#53685e] font-medium">
                    রোল: {student.roll} | {student.class} | {student.gender}
                  </p>
                  <p className="text-[#53685e] truncate">
                    পিতা: {student.fatherName} | রক্ত: <span className="font-semibold text-rose-700">{student.bloodGroup}</span>
                  </p>
                  <p className="text-[#53685e] text-[11px]">
                    জন্ম: {student.birthDate} | NID: <span className="font-mono">{student.nidOrBirthReg}</span>
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#b1c0a1]/30 text-[#1f332c] font-semibold border border-[#b1c0a1]">
                      ফি: ৳{toBengaliNumber(student.monthlyFee)} ({student.feeStatus})
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-4 pt-3 border-t border-[#c0dfe1]/50 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(student)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#eae8d9]/70 hover:bg-[#b1c0a1]/30 text-[#1f332c] text-xs font-medium border border-[#c0dfe1] transition cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-[#78988b]" />
                  <span>এডিট</span>
                </button>

                <button
                  onClick={() => setPrintableAdmissionStudent(student)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#c0dfe1]/30 hover:bg-[#c0dfe1]/50 text-[#1f332c] text-xs font-medium border border-[#c0dfe1] transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#749fa0]" />
                  <span>ভর্তি ফরম</span>
                </button>

                <button
                  onClick={() => setPrintableIdCardStudent(student)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#b1c0a1]/30 hover:bg-[#b1c0a1]/50 text-[#1f332c] text-xs font-medium border border-[#b1c0a1] transition cursor-pointer"
                >
                  <IdCard className="w-3.5 h-3.5 text-[#78988b]" />
                  <span>ID Card</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`আপনি কি সত্যিই ${student.nameBn}-কে ডিলিট করতে চান?`)) {
                      deleteStudent(student.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL 1: Add/Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1c2d26]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-[#ffffff] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 border border-[#c0dfe1]">
            <div className="bg-[#78988b] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#eae8d9]" />
                <span>{editingStudent ? 'শিক্ষার্থীর তথ্য সম্পাদন (Edit)' : 'নতুন শিক্ষার্থী ভর্তি ফরম'}</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded-lg cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto bg-[#ffffff]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                    শিক্ষার্থীর নাম (বাংলায়) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameBn}
                    onChange={e => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:ring-1 focus:ring-[#749fa0] bg-[#ffffff] outline-none"
                    placeholder="যেমন: মোঃ আরিফ হোসেন"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                    Student Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:ring-1 focus:ring-[#749fa0] bg-[#ffffff] outline-none"
                    placeholder="e.g. Md. Arif Hossain"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                    শ্রেণি / ব্যাচ *
                  </label>
                  <select
                    value={formData.class}
                    onChange={e => setFormData({ ...formData, class: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:ring-1 focus:ring-[#749fa0] bg-[#ffffff] outline-none"
                  >
                    {classesList.filter(c => c !== 'সকল শ্রেণি').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                    রোল নং *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.roll}
                    onChange={e => setFormData({ ...formData, roll: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:ring-1 focus:ring-[#749fa0] bg-[#ffffff] font-mono outline-none"
                    placeholder="০০১"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                    শাখা / শিফট
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.section}
                      onChange={e => setFormData({ ...formData, section: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg bg-[#ffffff] outline-none"
                      placeholder="শাখা: ক"
                    />
                    <select
                      value={formData.shift}
                      onChange={e => setFormData({ ...formData, shift: e.target.value as 'সকাল' | 'দিবা' })}
                      className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg bg-[#ffffff] outline-none"
                    >
                      <option value="সকাল">সকাল</option>
                      <option value="দিবা">দিবা</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                    লিঙ্গ
                  </label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as 'ছেলে' | 'মেয়ে' })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg bg-[#ffffff] outline-none"
                  >
                    <option value="ছেলে">ছেলে</option>
                    <option value="মেয়ে">মেয়ে</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                    পিতার নাম
                  </label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg bg-[#ffffff] outline-none"
                    placeholder="পিতার নাম"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                    মাতার নাম
                  </label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg bg-[#ffffff] outline-none"
                    placeholder="মাতার নাম"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                    অভিভাবকের মোবাইল নং
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg font-mono bg-[#ffffff] outline-none"
                    placeholder="০১৮..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                    জন্ম তারিখ
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg bg-[#ffffff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                    জন্ম নিবন্ধন / NID নং
                  </label>
                  <input
                    type="text"
                    value={formData.nidOrBirthReg}
                    onChange={e => setFormData({ ...formData, nidOrBirthReg: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg font-mono bg-[#ffffff] outline-none"
                    placeholder="১৭ ডিজিটের জন্ম নিবন্ধন নং"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                    রক্তের গ্রুপ
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg bg-[#ffffff] outline-none"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                    মাসিক বেতন (ফি)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={e => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg font-mono bg-[#ffffff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                    ফি স্ট্যাটাস
                  </label>
                  <select
                    value={formData.feeStatus}
                    onChange={e => setFormData({ ...formData, feeStatus: e.target.value as 'পরিশোধিত' | 'বকেয়া' })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg bg-[#ffffff] outline-none"
                  >
                    <option value="পরিশোধিত">পরিশোধিত</option>
                    <option value="বকেয়া">বকেয়া</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#c0dfe1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#53685e] hover:bg-[#eae8d9] rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-[#78988b] hover:bg-[#658276] text-white rounded-xl shadow-xs cursor-pointer"
                >
                  {editingStudent ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Printable Admission Form */}
      {printableAdmissionStudent && (
        <div className="fixed inset-0 z-50 bg-[#1c2d26]/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl p-6 my-8">
            <div className="flex items-center justify-between border-b border-[#c0dfe1] pb-3 mb-4 no-print">
              <h3 className="text-sm font-bold text-[#1f332c]">
                ভর্তি ফরম প্রিভিউ ও প্রিন্ট (Admission Form)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#78988b] hover:bg-[#658276] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => setPrintableAdmissionStudent(null)}
                  className="p-1.5 text-[#53685e] hover:text-[#1f332c] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* A4 Printable Admission Sheet */}
            <div className="a4-preview-page p-8 font-['Hind_Siliguri',sans-serif] text-slate-900 border border-slate-300">
              <div className="text-center border-b-2 border-slate-800 pb-3 mb-4">
                <h1 className="text-xl font-bold text-slate-900">{institution.nameBn}</h1>
                <p className="text-xs text-slate-600">{institution.nameEn}</p>
                <p className="text-[11px] text-slate-500">
                  {institution.village}, {institution.upazila}, {institution.district} | ফোন: {institution.phone}
                </p>
                <div className="mt-2 inline-block bg-slate-900 text-white text-xs font-bold px-4 py-1 rounded">
                  শিক্ষার্থী ভর্তি আবেদন ফরম
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>শিক্ষার্থীর নাম:</strong> {printableAdmissionStudent.nameBn}</p>
                  <p><strong>English Name:</strong> {printableAdmissionStudent.nameEn}</p>
                  <p><strong>শ্রেণি:</strong> {printableAdmissionStudent.class}</p>
                  <p><strong>রোল নং:</strong> {printableAdmissionStudent.roll}</p>
                  <p><strong>পিতার নাম:</strong> {printableAdmissionStudent.fatherName}</p>
                  <p><strong>মাতার নাম:</strong> {printableAdmissionStudent.motherName}</p>
                  <p><strong>মোবাইল নং:</strong> {printableAdmissionStudent.phone}</p>
                  <p><strong>জন্ম তারিখ:</strong> {printableAdmissionStudent.birthDate}</p>
                  <p><strong>রক্তের গ্রুপ:</strong> {printableAdmissionStudent.bloodGroup}</p>
                  <p><strong>জন্ম নিবন্ধন নং:</strong> {printableAdmissionStudent.nidOrBirthReg}</p>
                </div>

                <div className="mt-8 pt-12 flex justify-between text-xs text-center">
                  <div>
                    <div className="w-40 border-t border-slate-800 mx-auto pt-1">
                      অভিভাবকের স্বাক্ষর
                    </div>
                  </div>
                  <div>
                    <div className="w-40 border-t border-slate-800 mx-auto pt-1">
                      {institution.headmasterTitle}র স্বাক্ষর
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Printable Student ID Card (Single or Bulk) */}
      {(printableIdCardStudent || isBulkIdCardModalOpen) && (
        <div className="fixed inset-0 z-50 bg-[#1c2d26]/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl p-6 border border-[#c0dfe1]">
            <div className="flex items-center justify-between border-b border-[#c0dfe1] pb-3 mb-4 no-print">
              <h3 className="text-sm font-bold text-[#1f332c]">
                {isBulkIdCardModalOpen ? 'সকল শিক্ষার্থীর আইডি কার্ড শিট (ID Card Sheet)' : 'শিক্ষার্থী আইডি কার্ড প্রিভিউ ও প্রিন্ট'}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#78988b] hover:bg-[#658276] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => {
                    setPrintableIdCardStudent(null);
                    setIsBulkIdCardModalOpen(false);
                  }}
                  className="p-1.5 text-[#53685e] hover:text-[#1f332c] rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-['Hind_Siliguri',sans-serif]">
              {(isBulkIdCardModalOpen ? filteredStudents : [printableIdCardStudent!]).map(st => (
                <div 
                  key={st.id}
                  className="w-full max-w-[280px] mx-auto border-2 border-[#78988b] rounded-2xl overflow-hidden shadow-md bg-white text-slate-900 flex flex-col justify-between"
                >
                  {/* Top Header styled with palette */}
                  <div className="bg-gradient-to-r from-[#78988b] to-[#749fa0] text-white text-center py-2 px-2">
                    <h4 className="text-[11px] font-bold leading-tight">{institution.nameBn}</h4>
                    <p className="text-[9px] text-[#eae8d9] leading-tight mt-0.5">{institution.nameEn}</p>
                    <span className="inline-block bg-white/20 text-white text-[9px] font-semibold px-2 py-0.2 rounded mt-1">
                      স্টুডেন্ট আইডি কার্ড (২০২৬)
                    </span>
                  </div>

                  {/* Photo & Main Details */}
                  <div className="p-3 text-center flex-1 flex flex-col items-center">
                    <div className="w-18 h-20 rounded-xl border-2 border-[#78988b] bg-[#eae8d9]/50 flex items-center justify-center text-[#53685e] text-[10px] font-bold mb-2 shadow-xs">
                      {st.photoUrl ? (
                        <img src={st.photoUrl} alt={st.nameBn} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span>ছবি</span>
                      )}
                    </div>

                    <h5 className="font-bold text-xs text-slate-900 leading-tight">{st.nameBn}</h5>
                    <p className="text-[10px] text-slate-500 font-medium">{st.nameEn}</p>

                    <div className="mt-2 w-full text-left space-y-0.5 text-[10px] bg-[#eae8d9]/40 p-2 rounded-lg border border-[#c0dfe1]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">শ্রেণি:</span>
                        <span className="font-bold text-slate-800">{st.class}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">রোল নং:</span>
                        <span className="font-mono font-bold text-slate-800">{st.roll}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">শাখা:</span>
                        <span className="font-bold text-slate-800">{st.section}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">রক্তের গ্রুপ:</span>
                        <span className="font-bold text-rose-600">{st.bloodGroup}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">মোবাইল:</span>
                        <span className="font-mono text-slate-700">{st.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="px-3 pb-2 pt-1 border-t border-[#c0dfe1] flex items-center justify-between text-[8px] text-slate-600">
                    <div className="text-center">
                      <div className="w-14 border-t border-slate-400 mt-3 pt-0.5">শিক্ষার্থীর স্বাক্ষর</div>
                    </div>
                    <div className="text-center">
                      <div className="w-14 border-t border-slate-400 mt-3 pt-0.5">প্রধান শিক্ষক</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
