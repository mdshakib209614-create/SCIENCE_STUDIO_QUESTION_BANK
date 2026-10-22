import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  CalendarCheck, 
  Plus, 
  Trash2, 
  Printer, 
  Clock, 
  Grid, 
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  School,
  IdCard,
  QrCode,
  Upload,
  FileSignature,
  Sliders,
  Download,
  User,
  Image as ImageIcon,
  FolderArchive,
  PlusCircle,
  Search,
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RoutineItem } from '../types';
import { toBengaliNumber } from '../utils/bengaliUtils';
import { exportElementsToPDF } from '../utils/pdfExport';

export interface SavedAdmitCard {
  id: string;
  studentId?: string;
  studentNameBn: string;
  studentNameEn: string;
  fatherName: string;
  motherName: string;
  studentClass: string;
  section: string;
  roll: string;
  regNo: string;
  group: string;
  examCenter: string;
  photoUrl?: string;
  examTerm: string;
  createdAt: string;
}

interface ExamViewProps {
  initialSubTab?: 'routine' | 'admit' | 'seat';
}

export const ExamView: React.FC<ExamViewProps> = ({ initialSubTab = 'routine' }) => {
  const { 
    routines, 
    addRoutine, 
    deleteRoutine, 
    students, 
    institution, 
    examPlanIntent,
    principalSignatureUrl,
    setPrincipalSignatureUrl
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'routine' | 'admit' | 'seat'>(initialSubTab);
  const [selectedClass, setSelectedClass] = useState('১০ম শ্রেণি');
  const [selectedTerm, setSelectedTerm] = useState('৩য় প্রান্তিক মূল্যায়ন ২০২৬');
  const [includeRoutineInAdmit, setIncludeRoutineInAdmit] = useState(true);
  const [admitLanguage, setAdmitLanguage] = useState<'bn' | 'en'>('bn');
  const [notification, setNotification] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Admit Card Mode: 'batch' (All students of class) vs 'single_custom' (Specific student or custom data)
  const [admitMode, setAdmitMode] = useState<'batch' | 'single_custom'>('batch');
  const [admitOrientation, setAdmitOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [classTeacherSignatureUrl, setClassTeacherSignatureUrl] = useState<string>('');
  const sigInputRef = useRef<HTMLInputElement>(null);
  const classTeacherSigInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Class list derived from students
  const classList = useMemo(() => {
    const list = Array.from(new Set(students.map(s => s.class))).filter(Boolean);
    return list.length > 0 ? list : ['১০ম শ্রেণি', '৯ম শ্রেণি', '৮ম শ্রেণি', '৭ম শ্রেণি', '৬ষ্ঠ শ্রেণি'];
  }, [students]);

  // Students belonging strictly to selected class
  const classStudents = useMemo(() => {
    return students.filter(s => s.class === selectedClass);
  }, [students, selectedClass]);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(classStudents[0]?.id || students[0]?.id || '');

  // Form Fields for Single / Custom Admit Card
  const currentSelectedStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || classStudents[0] || students[0];
  }, [students, selectedStudentId, classStudents]);

  const [customStudentNameBn, setCustomStudentNameBn] = useState<string>(currentSelectedStudent?.nameBn || 'আরিফ হোসেন');
  const [customStudentNameEn, setCustomStudentNameEn] = useState<string>(currentSelectedStudent?.nameEn || 'Arif Hossain');
  const [customFatherName, setCustomFatherName] = useState<string>(currentSelectedStudent?.fatherName || 'মোঃ জামাল উদ্দিন');
  const [customMotherName, setCustomMotherName] = useState<string>(currentSelectedStudent?.motherName || 'মোসাম্মৎ ফাতেমা বেগম');
  const [customClass, setCustomClass] = useState<string>(currentSelectedStudent?.class || selectedClass);
  const [customSection, setCustomSection] = useState<string>(currentSelectedStudent?.section || 'ক');
  const [customRoll, setCustomRoll] = useState<string>(currentSelectedStudent?.roll || '০১');
  const [customRegNo, setCustomRegNo] = useState<string>(currentSelectedStudent?.nidOrBirthReg || '২৩১৪০৮৯৭২১');
  const [customGroup, setCustomGroup] = useState<string>('বিজ্ঞান (Science)');
  const [customExamCenter, setCustomExamCenter] = useState<string>('প্রধান ক্যাম্পাস, কেন্দ্র-০১');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>(currentSelectedStudent?.photoUrl || '');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Sync fields when student is chosen from dropdown
  const handleSelectStudent = (stId: string) => {
    setSelectedStudentId(stId);
    const st = students.find(s => s.id === stId);
    if (st) {
      setCustomStudentNameBn(st.nameBn);
      setCustomStudentNameEn(st.nameEn || st.nameBn);
      setCustomFatherName(st.fatherName || '');
      setCustomMotherName(st.motherName || '');
      setCustomClass(st.class || selectedClass);
      setCustomSection(st.section || 'ক');
      setCustomRoll(st.roll || '০১');
      if (st.nidOrBirthReg) setCustomRegNo(st.nidOrBirthReg);
      if (st.photoUrl) setCustomPhotoUrl(st.photoUrl);
      showToast(`👤 ${st.nameBn}-এর তথ্য প্রবেশপত্রে লোড হয়েছে!`);
    }
  };

  // Handle class change
  const handleClassChange = (newCls: string) => {
    setSelectedClass(newCls);
    setCustomClass(newCls);
    const inCls = students.filter(s => s.class === newCls);
    if (inCls.length > 0) {
      handleSelectStudent(inCls[0].id);
    }
  };

  // Upload Principal Signature
  const handlePrincipalSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        if (res) {
          setPrincipalSignatureUrl(res);
          showToast('✅ অধ্যক্ষ / প্রধান শিক্ষকের স্বাক্ষর আপলোড হয়েছে এবং সকল প্রবেশপত্রে যুক্ত হয়েছে!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Class Teacher Signature (As requested: শ্রেনী শিক্ষকের সাক্ষর ব্লাঙ্ক ও সাক্সর এড করার অপশন)
  const handleClassTeacherSigUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        if (res) {
          setClassTeacherSignatureUrl(res);
          showToast('✅ শ্রেণি শিক্ষকের স্বাক্ষর সফলভাবে যুক্ত হয়েছে!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Custom Student Photo
  const handleStudentPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        if (res) {
          setCustomPhotoUrl(res);
          showToast('📷 শিক্ষার্থীর ছবি সফলভাবে যুক্ত হয়েছে!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Colorful Landscape PDF Download Handler
  const handleDownloadAdmitPDF = async () => {
    setIsExportingPdf(true);
    try {
      const safeName = `Admit_Card_Landscape_${selectedClass.replace(/\s+/g, '_')}_${Date.now()}`;
      
      // Select all individual admit card sheets to export each as its own Landscape A4 page
      const cardNodes = document.querySelectorAll('.admit-card-sheet');
      const elementIds = Array.from(cardNodes).map((node, idx) => {
        if (!node.id) {
          node.id = `admit-card-sheet-${idx}`;
        }
        return node.id;
      });

      const targets = elementIds.length > 0 ? elementIds : ['admit-cards-container'];
      const success = await exportElementsToPDF(targets, {
        fileName: `${safeName}.pdf`,
        orientation: 'landscape'
      });
      if (success) {
        showToast('✅ প্রবেশপত্রসমূহ ল্যান্ডস্কেপ (Landscape) পেজ সেটাপে রঙিন পিডিএফ হিসেবে ডাউনলোড হয়েছে!');
      } else {
        window.print();
      }
    } catch (err) {
      console.error('Admit PDF export error:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // State for Saved Admit Cards Archive
  const [admitActiveTab, setAdmitActiveTab] = useState<'create' | 'archive'>('create');
  const [editingAdmitCardId, setEditingAdmitCardId] = useState<string | null>(null);
  const [archiveSearch, setArchiveSearch] = useState<string>('');
  const [archiveClassFilter, setArchiveClassFilter] = useState<string>('all');
  const [savedAdmitCards, setSavedAdmitCards] = useState<SavedAdmitCard[]>(() => {
    try {
      const saved = localStorage.getItem('coaching_mgmt_saved_admit_cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('coaching_mgmt_saved_admit_cards', JSON.stringify(savedAdmitCards));
    } catch (e) {
      console.warn('LocalStorage error (saved_admit_cards):', e);
    }
  }, [savedAdmitCards]);

  const handleCreateAdmitCard = () => {
    const cardData: SavedAdmitCard = {
      id: editingAdmitCardId || `admit-${Date.now()}`,
      studentId: selectedStudentId || undefined,
      studentNameBn: customStudentNameBn.trim() || 'শিক্ষার্থী',
      studentNameEn: customStudentNameEn.trim() || 'Student',
      fatherName: customFatherName.trim() || '',
      motherName: customMotherName.trim() || '',
      studentClass: customClass || selectedClass,
      section: customSection || 'ক',
      roll: customRoll || '০১',
      regNo: customRegNo || '',
      group: customGroup || 'সাধারণ',
      examCenter: customExamCenter || 'প্রধান ক্যাম্পাস, কেন্দ্র-০১',
      photoUrl: customPhotoUrl || undefined,
      examTerm: selectedTerm,
      createdAt: new Date().toLocaleDateString('bn-BD')
    };

    if (editingAdmitCardId) {
      setSavedAdmitCards(prev => prev.map(c => c.id === editingAdmitCardId ? cardData : c));
      setEditingAdmitCardId(null);
      showToast(`✅ ${cardData.studentNameBn}-এর এডমিট কার্ড সফলভাবে আপডেট করা হয়েছে!`);
    } else {
      setSavedAdmitCards(prev => [cardData, ...prev]);
      showToast(`🎉 ${cardData.studentNameBn}-এর নতুন এডমিট কার্ড সফলভাবে তৈরি ও আর্কাইভে সেভ হয়েছে!`);
    }
  };

  const handleEditSavedAdmit = (card: SavedAdmitCard) => {
    setEditingAdmitCardId(card.id);
    setCustomStudentNameBn(card.studentNameBn);
    setCustomStudentNameEn(card.studentNameEn);
    setCustomFatherName(card.fatherName);
    setCustomMotherName(card.motherName);
    setCustomClass(card.studentClass);
    setCustomSection(card.section);
    setCustomRoll(card.roll);
    setCustomRegNo(card.regNo);
    setCustomGroup(card.group);
    setCustomExamCenter(card.examCenter);
    if (card.photoUrl) setCustomPhotoUrl(card.photoUrl);
    setSelectedClass(card.studentClass);
    setSelectedTerm(card.examTerm);
    setAdmitMode('single_custom');
    setAdmitActiveTab('create');
    showToast(`✏️ "${card.studentNameBn}"-এর তথ্য এডিটের জন্য প্রস্তুত!`);
  };

  const handleDeleteSavedAdmit = (id: string, name: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে "${name}"-এর সংরক্ষিত এডমিট কার্ডটি মুছে ফেলতে চান?`)) {
      setSavedAdmitCards(prev => prev.filter(c => c.id !== id));
      showToast(`🗑️ "${name}"-এর এডমিট কার্ডটি মুছে ফেলা হয়েছে।`);
    }
  };

  const filteredSavedAdmitCards = useMemo(() => {
    return savedAdmitCards.filter(card => {
      const matchesSearch = 
        !archiveSearch ||
        card.studentNameBn.toLowerCase().includes(archiveSearch.toLowerCase()) ||
        card.studentNameEn.toLowerCase().includes(archiveSearch.toLowerCase()) ||
        card.roll.includes(archiveSearch) ||
        card.regNo.includes(archiveSearch);
      
      const matchesClass = archiveClassFilter === 'all' || card.studentClass === archiveClassFilter;
      return matchesSearch && matchesClass;
    });
  }, [savedAdmitCards, archiveSearch, archiveClassFilter]);

  // Listen to examPlanIntent from sidebar tree
  React.useEffect(() => {
    if (!examPlanIntent) return;
    if (examPlanIntent.subTab) {
      setActiveSubTab(examPlanIntent.subTab);
    }
    if (examPlanIntent.targetClass) {
      setSelectedClass(examPlanIntent.targetClass);
    }
    if (examPlanIntent.action === 'print_routine' || examPlanIntent.action === 'print_admit' || examPlanIntent.action === 'print_seat') {
      setTimeout(() => {
        window.print();
      }, 350);
    }
  }, [examPlanIntent]);

  // Form for adding routine row
  const [newDate, setNewDate] = useState('২০২৬-০৯-২০');
  const [newDay, setNewDay] = useState('রবিবার');
  const [newSubject, setNewSubject] = useState('বাংলা');
  const [newTime, setNewTime] = useState('১০:০০ - ১২:০০');
  const [newShift, setNewShift] = useState<'সকাল' | 'বিকাল'>('সকাল');
  const [newRoom, setNewRoom] = useState('১০১');

  const daysList = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const subjectsList = ['বাংলা', 'ইংরেজি', 'গণিত', 'প্রাথমিক বিজ্ঞান', 'ধর্ম ও নৈতিক শিক্ষা', 'বাংলাদেশ ও বিশ্বপরিচয়', 'আইসিটি', 'পদার্থবিজ্ঞান', 'রসায়ন', 'উচ্চতর গণিত', 'জীববিজ্ঞান'];
  const classesList = ['১ম শ্রেণি', '২য় শ্রেণি', '৩য় শ্রেণি', '৪র্থ শ্রেণি', '৫ম শ্রেণি', '৬ষ্ঠ শ্রেণি', '৭ম শ্রেণি', '৮ম শ্রেণি', '৯ম শ্রেণি', '১০ম শ্রেণি'];
  const termsList = ['১ম প্রান্তিক মূল্যায়ন ২০২৬', '২য় প্রান্তিক মূল্যায়ন ২০২৬', '৩য় প্রান্তিক মূল্যায়ন ২০২৬', 'বার্ষিক পরীক্ষা ২০২৬', 'মডেল টেস্ট'];

  const handleAddRoutineItem = (e: React.FormEvent) => {
    e.preventDefault();
    addRoutine({
      date: newDate,
      day: newDay,
      subject: newSubject,
      time: newTime,
      shift: newShift,
      roomNo: newRoom,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-[#1f332c]">
      {/* Sub Tabs Navigation */}
      <div className="flex flex-col sm:flex-row items-center gap-2 bg-[#ffffff] p-2 rounded-2xl border border-[#c0dfe1] shadow-xs no-print">
        <button
          onClick={() => setActiveSubTab('routine')}
          className={`flex-1 w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'routine'
              ? 'bg-[#78988b] text-white shadow-xs'
              : 'text-[#53685e] hover:bg-[#b1c0a1]/20'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>পরীক্ষার রুটিন তৈরি (Routine)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('admit')}
          className={`flex-1 w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'admit'
              ? 'bg-[#78988b] text-white shadow-xs'
              : 'text-[#53685e] hover:bg-[#b1c0a1]/20'
          }`}
        >
          <IdCard className="w-4 h-4" />
          <span>প্রবেশপত্র তৈরি ও প্রিন্ট (Admit Card)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('seat')}
          className={`flex-1 w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'seat'
              ? 'bg-[#78988b] text-white shadow-xs'
              : 'text-[#53685e] hover:bg-[#b1c0a1]/20'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>পরীক্ষার সিট প্ল্যান (Seat Plan)</span>
        </button>
      </div>

      {/* SUB-TAB 1: Exam Routine */}
      {activeSubTab === 'routine' && (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#c0dfe1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#b1c0a1]/30 border border-[#b1c0a1] flex items-center justify-center text-[#78988b] shrink-0 shadow-2xs">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1f332c] flex items-center gap-2">
                  <span>পরীক্ষার রুটিন তৈরি - শ্রেণি ভিত্তিক</span>
                </h2>
                <p className="text-xs text-[#53685e] mt-0.5">
                  তারিখ, বার, বিষয়, সময় - শ্রেণি অনুযায়ী আলাদা রুটিন, এই তথ্য সরাসরি প্রবেশপত্রে যুক্ত হয়
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="px-3 py-2 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] text-[#1f332c] font-medium focus:ring-1 focus:ring-[#749fa0] outline-none"
              >
                {classesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={selectedTerm}
                onChange={e => setSelectedTerm(e.target.value)}
                className="px-3 py-2 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] text-[#1f332c] font-medium focus:ring-1 focus:ring-[#749fa0] outline-none"
              >
                {termsList.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-[#749fa0] hover:bg-[#5f8788] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>রুটিন প্রিন্ট / PDF</span>
              </button>
            </div>
          </div>

          {/* Routine Table Container (Printable) */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#c0dfe1] shadow-xs overflow-hidden p-6 font-['Hind_Siliguri',sans-serif]">
            {/* Header for print */}
            <div className="text-center pb-4 mb-4 border-b border-[#c0dfe1]">
              <h3 className="text-xl font-bold text-[#1f332c]">{institution.nameBn}</h3>
              <p className="text-xs text-[#53685e]">{institution.village}, {institution.upazila}, {institution.district}</p>
              <div className="mt-2 inline-block bg-[#b1c0a1]/30 text-[#1f332c] px-4 py-1 rounded-full text-xs font-bold border border-[#b1c0a1]">
                {selectedTerm} - {selectedClass} এর সময়সূচী
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-[#78988b] text-white border border-[#78988b] font-semibold">
                    <th className="py-2.5 px-3 border border-[#688579]">ক্র.</th>
                    <th className="py-2.5 px-3 border border-[#688579]">তারিখ</th>
                    <th className="py-2.5 px-3 border border-[#688579]">বার</th>
                    <th className="py-2.5 px-3 border border-[#688579]">বিষয়</th>
                    <th className="py-2.5 px-3 border border-[#688579]">সময়</th>
                    <th className="py-2.5 px-3 border border-[#688579]">ধরন</th>
                    <th className="py-2.5 px-3 border border-[#688579]">কক্ষ নং</th>
                    <th className="py-2.5 px-3 border border-[#688579] no-print">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c0dfe1]">
                  {routines.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-[#eae8d9]/30 transition">
                      <td className="py-2.5 px-3 border border-[#c0dfe1] font-mono">{toBengaliNumber(idx + 1)}</td>
                      <td className="py-2.5 px-3 border border-[#c0dfe1] font-mono font-medium">{item.date}</td>
                      <td className="py-2.5 px-3 border border-[#c0dfe1]">{item.day}</td>
                      <td className="py-2.5 px-3 border border-[#c0dfe1] font-bold text-[#1f332c]">{item.subject}</td>
                      <td className="py-2.5 px-3 border border-[#c0dfe1] font-mono">{item.time}</td>
                      <td className="py-2.5 px-3 border border-[#c0dfe1]">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#b1c0a1]/40 text-[#1f332c] text-[11px] font-semibold">
                          {item.shift}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 border border-[#c0dfe1] font-mono">{item.roomNo || '১০১'}</td>
                      <td className="py-2.5 px-3 border border-[#c0dfe1] no-print">
                        <button
                          onClick={() => deleteRoutine(item.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signature Block for Print */}
            <div className="mt-12 hidden print-only pt-8">
              <div className="flex justify-between items-center text-xs font-semibold px-8">
                <div className="text-center">
                  <div className="w-32 border-t border-[#1f332c] pt-1">পরীক্ষা নিয়ন্ত্রক</div>
                </div>
                <div className="text-center">
                  <div className="w-32 border-t border-[#1f332c] pt-1">{institution.headmasterTitle}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Routine Row Form */}
          <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#c0dfe1] shadow-xs no-print">
            <h3 className="text-xs font-bold text-[#1f332c] mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#78988b]" />
              <span>রুটিনে নতুন বিষয় ও তারিখ যোগ করুন</span>
            </h3>

            <form onSubmit={handleAddRoutineItem} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-semibold text-[#53685e] mb-1">তারিখ:</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] text-[#1f332c] outline-none focus:ring-1 focus:ring-[#749fa0]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#53685e] mb-1">বার নির্বাচন:</label>
                <select
                  value={newDay}
                  onChange={e => setNewDay(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] text-[#1f332c] outline-none focus:ring-1 focus:ring-[#749fa0]"
                >
                  {daysList.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#53685e] mb-1">বিষয়:</label>
                <select
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] text-[#1f332c] outline-none focus:ring-1 focus:ring-[#749fa0]"
                >
                  {subjectsList.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#53685e] mb-1">সময়সূচী:</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] text-[#1f332c] font-mono outline-none focus:ring-1 focus:ring-[#749fa0]"
                  placeholder="১০:০০ - ১২:০০"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#53685e] mb-1">শিফট / রুম:</label>
                <div className="grid grid-cols-2 gap-1">
                  <select
                    value={newShift}
                    onChange={e => setNewShift(e.target.value as 'সকাল' | 'বিকাল')}
                    className="w-full px-1.5 py-1.5 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] text-[#1f332c] outline-none focus:ring-1 focus:ring-[#749fa0]"
                  >
                    <option value="সকাল">সকাল</option>
                    <option value="বিকাল">বিকাল</option>
                  </select>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={e => setNewRoom(e.target.value)}
                    className="w-full px-1.5 py-1.5 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] text-[#1f332c] font-mono outline-none focus:ring-1 focus:ring-[#749fa0]"
                    placeholder="১০১"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1 bg-[#78988b] hover:bg-[#658276] text-white py-2 px-3 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ যোগ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Admit Cards (প্রবেশপত্র) */}
      {activeSubTab === 'admit' && (
        <div className="space-y-6">

          {/* Toast Notification */}
          {notification && (
            <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-sm font-medium">{notification}</span>
            </div>
          )}

          {/* Signatures Upload Cards: Principal & Class Teacher */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
            {/* Principal Signature Card */}
            <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                  <FileSignature className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-amber-950">
                      অধ্যক্ষ / প্রধান শিক্ষকের স্বাক্ষর (Principal Signature)
                    </h3>
                    {principalSignatureUrl ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md font-semibold">
                        সক্রিয় ✓
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-md font-semibold">
                        ডিফল্ট
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-amber-900/80 mt-0.5">
                    প্রধান শিক্ষকের স্ক্যান বা ডিজিটাল স্বাক্ষর
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end pt-2 border-t border-amber-200/60">
                {principalSignatureUrl && (
                  <div className="h-9 px-2 bg-white rounded-lg border border-amber-300 flex items-center shadow-2xs">
                    <img src={principalSignatureUrl} alt="Signature Preview" className="h-7 max-w-[80px] object-contain" />
                  </div>
                )}
                <input
                  type="file"
                  ref={sigInputRef}
                  onChange={handlePrincipalSignatureUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => sigInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{principalSignatureUrl ? 'পরিবর্তন' : 'আপলোড'}</span>
                </button>
                {principalSignatureUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setPrincipalSignatureUrl('');
                      showToast('🔄 প্রধান শিক্ষকের স্বাক্ষর মুছে ফেলা হয়েছে।');
                    }}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
                    title="স্বাক্ষর মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Class Teacher Signature Card (As requested: শ্রেনী শিক্ষকের সাক্ষর ব্লাঙ্ক ও সাক্সর এড করার অপশন এড করো) */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                  <FileSignature className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      শ্রেণি শিক্ষকের স্বাক্ষর (Class Teacher Signature)
                    </h3>
                    {classTeacherSignatureUrl ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md font-semibold">
                        আপলোডকৃত ✓
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-200 text-slate-700 border border-slate-300 px-2 py-0.5 rounded-md font-semibold">
                        খালি (ম্যানুয়াল সই)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-900/80 mt-0.5">
                    ডিফল্টভাবে খালি থাকবে; চাইলে স্ক্যান করা স্বাক্ষর যোগ করতে পারেন।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end pt-2 border-t border-emerald-200/60">
                {classTeacherSignatureUrl && (
                  <div className="h-9 px-2 bg-white rounded-lg border border-emerald-300 flex items-center shadow-2xs">
                    <img src={classTeacherSignatureUrl} alt="Class Teacher Sig Preview" className="h-7 max-w-[80px] object-contain" />
                  </div>
                )}
                <input
                  type="file"
                  ref={classTeacherSigInputRef}
                  onChange={handleClassTeacherSigUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => classTeacherSigInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{classTeacherSignatureUrl ? 'পরিবর্তন' : 'স্বাক্ষর যোগ করুন'}</span>
                </button>
                {classTeacherSignatureUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setClassTeacherSignatureUrl('');
                      showToast('🔄 শ্রেণি শিক্ষকের স্বাক্ষর মুছে খালি করা হয়েছে।');
                    }}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
                    title="স্বাক্ষর মুছে খালি করুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Top Main Navigation Tabs: Designer vs Archive */}
          <div className="flex items-center gap-2 bg-[#ffffff] p-2 rounded-2xl border border-[#c0dfe1] shadow-xs no-print">
            <button
              onClick={() => setAdmitActiveTab('create')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                admitActiveTab === 'create'
                  ? 'bg-[#78988b] text-white shadow-xs'
                  : 'text-[#53685e] hover:bg-[#b1c0a1]/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{editingAdmitCardId ? 'এডমিট কার্ড এডিটিং ও লাইভ প্রিভিউ' : 'নতুন এডমিট কার্ড তৈরি ও প্রিভিউ'}</span>
            </button>

            <button
              onClick={() => setAdmitActiveTab('archive')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                admitActiveTab === 'archive'
                  ? 'bg-[#78988b] text-white shadow-xs'
                  : 'text-[#53685e] hover:bg-[#b1c0a1]/20'
              }`}
            >
              <FolderArchive className="w-4 h-4" />
              <span>সংরক্ষিত এডমিট কার্ডসমূহ ({toBengaliNumber(savedAdmitCards.length)}টি জমা রয়েছে)</span>
            </button>
          </div>

          {admitActiveTab === 'create' ? (
            <>
              {/* Controls Toolbar */}
              <div className="bg-[#ffffff] p-4 sm:p-5 rounded-2xl border border-[#c0dfe1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
                <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#b1c0a1]/30 border border-[#b1c0a1] flex items-center justify-center text-[#78988b] shrink-0 shadow-2xs">
                <IdCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1f332c] flex items-center gap-2">
                  <span>প্রবেশপত্র প্রিন্ট ও ডিজিটাল এডিটর (A4 সাইজ রেডি)</span>
                </h2>
                <p className="text-xs text-[#53685e] mt-0.5">
                  বোর্ড স্ট্যান্ডার্ড ডিজাইন • বাংলা ও ইংরেজি দুই ফরম্যাট • রঙিন পিডিএফ ডাউনলোড
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Page Setup: Dedicated Landscape A4 Format */}
              <div className="flex items-center gap-2 bg-[#eae8d9] px-3.5 py-1.5 rounded-xl border border-[#c0dfe1] text-xs font-bold text-[#1f332c] shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                <span>পেজ সেটাপ: ল্যান্ডস্কেপ (A4 Landscape)</span>
              </div>

              {/* Language Format Toggle: বাংলা vs English */}
              <div className="flex items-center gap-1 bg-[#eae8d9] p-1 rounded-xl border border-[#c0dfe1]">
                <button
                  type="button"
                  onClick={() => setAdmitLanguage('bn')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    admitLanguage === 'bn' ? 'bg-[#78988b] text-white shadow-xs' : 'text-[#1f332c] hover:bg-white/60'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setAdmitLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    admitLanguage === 'en' ? 'bg-[#78988b] text-white shadow-xs' : 'text-[#1f332c] hover:bg-white/60'
                  }`}
                >
                  English
                </button>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#1f332c] cursor-pointer bg-[#eae8d9]/60 px-3 py-2 rounded-xl border border-[#c0dfe1]">
                <input
                  type="checkbox"
                  checked={includeRoutineInAdmit}
                  onChange={e => setIncludeRoutineInAdmit(e.target.checked)}
                  className="rounded text-[#78988b] focus:ring-[#78988b]"
                />
                <span>{admitLanguage === 'bn' ? 'রুটিন যুক্ত রাখুন' : 'Include Routine'}</span>
              </label>

              {/* Colorful PDF Download Button */}
              <button
                type="button"
                onClick={handleDownloadAdmitPDF}
                disabled={isExportingPdf}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
                title="রঙিন পিডিএফ ফাইল হিসেবে ডাউনলোড করুন"
              >
                <Download className="w-4 h-4 text-blue-100" />
                <span>{isExportingPdf ? 'প্রস্তুত হচ্ছে...' : 'রঙিন PDF ডাউনলোড'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-[#78988b] hover:bg-[#658276] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{admitLanguage === 'bn' ? 'প্রবেশপত্র প্রিন্ট' : 'Print Admit Card'}</span>
              </button>
            </div>
          </div>

          {/* শিক্ষার্থী ও এডমিট কার্ডের তথ্য পূরণ (স্বয়ংক্রিয় বা কাস্টম) Form Card */}
          <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#c0dfe1] shadow-xs space-y-4 no-print">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#c0dfe1] gap-2">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Sliders className="w-4 h-4 text-[#78988b]" />
                <span>শিক্ষার্থী ও এডমিট কার্ডের তথ্য পূরণ (স্বয়ংক্রিয় বা কাস্টম)</span>
              </div>

              {/* Mode Buttons */}
              <div className="flex items-center gap-1.5 bg-[#eae8d9]/60 p-1 rounded-xl border border-[#c0dfe1] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAdmitMode('batch')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    admitMode === 'batch' ? 'bg-[#78988b] text-white shadow-xs' : 'text-[#53685e]'
                  }`}
                >
                  পুরো শ্রেণি ({toBengaliNumber(classStudents.length)} জন)
                </button>
                <button
                  type="button"
                  onClick={() => setAdmitMode('single_custom')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    admitMode === 'single_custom' ? 'bg-[#78988b] text-white shadow-xs' : 'text-[#53685e]'
                  }`}
                >
                  একক শিক্ষার্থী / কাস্টম তথ্য
                </button>
              </div>
            </div>

            {/* Linked Class Dropdown -> Student Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 text-xs">
              <div>
                <label className="block text-[#53685e] font-bold mb-1">শ্রেণি নির্বাচন (Class):</label>
                <select
                  value={selectedClass}
                  onChange={e => handleClassChange(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-bold outline-none cursor-pointer focus:ring-1 focus:ring-[#78988b]"
                >
                  {classList.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#53685e] font-bold mb-1">
                  শিক্ষার্থী নির্বাচন ({toBengaliNumber(classStudents.length)} জন শিক্ষার্থী ভর্তি রয়েছে):
                </label>
                <select
                  value={selectedStudentId}
                  onChange={e => {
                    handleSelectStudent(e.target.value);
                    if (admitMode === 'batch') setAdmitMode('single_custom');
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-bold text-slate-900 outline-none cursor-pointer focus:ring-1 focus:ring-[#78988b]"
                >
                  {classStudents.length === 0 ? (
                    <option value="">এই শ্রেণিতে কোনো শিক্ষার্থী নেই (কাস্টম তথ্য লিখুন)</option>
                  ) : (
                    classStudents.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.nameBn} ({s.nameEn || 'Student'}) • রোল: {s.roll} • পিতা: {s.fatherName}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Editable Fields in Single / Custom Mode */}
            {admitMode === 'single_custom' && (
              <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>নির্বাচিত শিক্ষার্থীর কাস্টম তথ্য সম্পাদন (নিচে সরাসরি প্রিভিউ হবে)</span>
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    প্রয়োজন অনুযায়ী যেকোনো তথ্য পরিবর্তন করতে পারেন
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[#53685e] font-semibold mb-1">শিক্ষার্থীর নাম (বাংলা):</label>
                    <input
                      type="text"
                      value={customStudentNameBn}
                      onChange={e => setCustomStudentNameBn(e.target.value)}
                      className="w-full p-2 border border-[#c0dfe1] rounded-lg font-bold text-slate-900 bg-white outline-none focus:ring-1 focus:ring-[#78988b]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#53685e] font-semibold mb-1">Student Name (English):</label>
                    <input
                      type="text"
                      value={customStudentNameEn}
                      onChange={e => setCustomStudentNameEn(e.target.value)}
                      className="w-full p-2 border border-[#c0dfe1] rounded-lg font-sans font-bold text-slate-900 bg-white outline-none focus:ring-1 focus:ring-[#78988b]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#53685e] font-semibold mb-1">পিতার নাম:</label>
                    <input
                      type="text"
                      value={customFatherName}
                      onChange={e => setCustomFatherName(e.target.value)}
                      className="w-full p-2 border border-[#c0dfe1] rounded-lg text-slate-800 bg-white outline-none focus:ring-1 focus:ring-[#78988b]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#53685e] font-semibold mb-1">মাতার নাম:</label>
                    <input
                      type="text"
                      value={customMotherName}
                      onChange={e => setCustomMotherName(e.target.value)}
                      className="w-full p-2 border border-[#c0dfe1] rounded-lg text-slate-800 bg-white outline-none focus:ring-1 focus:ring-[#78988b]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#53685e] font-semibold mb-1">শ্রেণি ও শাখা:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={customClass}
                        onChange={e => setCustomClass(e.target.value)}
                        placeholder="শ্রেণি"
                        className="w-full p-2 border border-[#c0dfe1] rounded-lg font-bold text-slate-800 bg-white outline-none"
                      />
                      <input
                        type="text"
                        value={customSection}
                        onChange={e => setCustomSection(e.target.value)}
                        placeholder="শাখা"
                        className="w-full p-2 border border-[#c0dfe1] rounded-lg font-bold text-slate-800 bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#53685e] font-semibold mb-1">রোল ও রেজিস্ট্রেশন:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={customRoll}
                        onChange={e => setCustomRoll(e.target.value)}
                        placeholder="রোল"
                        className="w-full p-2 border border-[#c0dfe1] rounded-lg font-mono font-bold text-slate-800 bg-white outline-none"
                      />
                      <input
                        type="text"
                        value={customRegNo}
                        onChange={e => setCustomRegNo(e.target.value)}
                        placeholder="রেজিস্ট্রেশন"
                        className="w-full p-2 border border-[#c0dfe1] rounded-lg font-mono text-slate-800 bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#53685e] font-semibold mb-1">গ্রুপ / বিভাগ:</label>
                    <input
                      type="text"
                      value={customGroup}
                      onChange={e => setCustomGroup(e.target.value)}
                      className="w-full p-2 border border-[#c0dfe1] rounded-lg text-slate-800 bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#53685e] font-semibold mb-1">পরীক্ষা কেন্দ্র ও কক্ষ:</label>
                    <input
                      type="text"
                      value={customExamCenter}
                      onChange={e => setCustomExamCenter(e.target.value)}
                      className="w-full p-2 border border-[#c0dfe1] rounded-lg text-slate-800 bg-white outline-none"
                    />
                  </div>
                </div>

                {/* Photo Upload in Custom Form */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="file"
                    ref={photoInputRef}
                    onChange={handleStudentPhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-[#c0dfe1] hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{customPhotoUrl ? 'ছবি পরিবর্তন' : 'শিক্ষার্থীর ছবি আপলোড'}</span>
                  </button>
                  {customPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomPhotoUrl('');
                        showToast('শিক্ষার্থীর ছবি মুছে ফেলা হয়েছে।');
                      }}
                      className="text-xs text-rose-600 hover:underline cursor-pointer"
                    >
                      ছবি মুছুন
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Create Admit Card Button Action Bar */}
            <div className="pt-3 border-t border-[#c0dfe1] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>সকল তথ্য ও ছবি পূরণ করে "ক্রিয়েট এডমিট কার্ড" বাটনে ক্লিক করুন। এটি স্থায়ীভাবে সেভ থাকবে।</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setAdmitActiveTab('archive')}
                  className="px-3.5 py-2.5 rounded-xl bg-[#eae8d9]/80 hover:bg-[#eae8d9] text-[#1f332c] border border-[#c0dfe1] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
                  title="সংরক্ষিত সকল এডমিট কার্ড দেখুন"
                >
                  <FolderArchive className="w-4 h-4 text-[#78988b]" />
                  <span>সংরক্ষিত তালিকা ({toBengaliNumber(savedAdmitCards.length)})</span>
                </button>

                {editingAdmitCardId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAdmitCardId(null);
                      showToast('এডিটিং বাতিল করা হয়েছে।');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition"
                  >
                    বাতিল করুন
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCreateAdmitCard}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-900/20 flex items-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{editingAdmitCardId ? 'এডমিট কার্ড আপডেট করুন (Update Admit Card)' : 'ক্রিয়েট এডমিট কার্ড (Create Admit Card)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Admit Cards Preview Grid */}
          <div id="admit-cards-container" className="space-y-8 font-['Hind_Siliguri','Plus_Jakarta_Sans',sans-serif]">
            {/* Dedicated Print Style: Strict A4 Landscape with crisp border */}
            <style>{`
              @media print {
                @page {
                  size: A4 landscape !important;
                  margin: 6mm !important;
                }
                html, body {
                  margin: 0 !important;
                  padding: 0 !important;
                  background: #ffffff !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                .admit-card-sheet {
                  margin: 0 auto !important;
                  width: 100% !important;
                  max-width: 280mm !important;
                  page-break-after: always !important;
                  break-after: page !important;
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                  border: 2px solid #065f46 !important;
                  box-shadow: none !important;
                  background-color: #ffffff !important;
                  box-sizing: border-box !important;
                }
              }
            `}</style>

            {(admitMode === 'single_custom' 
              ? [{
                  id: selectedStudentId || 'custom-admit-1',
                  nameBn: customStudentNameBn,
                  nameEn: customStudentNameEn,
                  fatherName: customFatherName,
                  motherName: customMotherName,
                  class: customClass,
                  section: customSection,
                  roll: customRoll,
                  nidOrBirthReg: customRegNo,
                  photoUrl: customPhotoUrl,
                  customGroupVal: customGroup,
                  customExamCenterVal: customExamCenter
                }]
              : classStudents.map((st, i) => ({
                  ...st,
                  customGroupVal: 'বিজ্ঞান (Science)',
                  customExamCenterVal: 'প্রধান ক্যাম্পাস, কেন্দ্র-০১'
                }))
            ).map((st, index) => (
              <div 
                key={st.id || index} 
                id={`admit-card-sheet-${index}`}
                className="admit-card-sheet bg-[#ffffff] rounded-2xl border-2 border-emerald-800 shadow-md mx-auto page-break relative select-none w-full max-w-5xl p-5 sm:p-7"
                style={{
                  boxSizing: 'border-box'
                }}
              >
                {/* Board Frame Inset Border */}
                <div className="absolute inset-2 border border-emerald-300 pointer-events-none rounded-xl"></div>

                {/* Admit Header */}
                <div className="border-b-2 border-emerald-800 pb-3 relative">
                  {/* Photo & Signature Frame on top right */}
                  <div className="absolute right-0 top-0 flex flex-col items-center">
                    <div className="w-20 h-24 border-2 border-emerald-400 border-dashed rounded-lg flex items-center justify-center text-[10px] text-slate-500 font-medium bg-emerald-50/40 overflow-hidden shadow-2xs">
                      {st.photoUrl ? (
                        <img src={st.photoUrl} alt="Student" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="text-center p-1">
                          <User className="w-6 h-6 mx-auto text-emerald-400 mb-0.5" />
                          <span className="text-[9px] block text-emerald-700">{admitLanguage === 'bn' ? 'ছবি (Photo)' : 'Photo'}</span>
                        </div>
                      )}
                    </div>
                    <div className="w-20 text-[9px] text-center border-t border-slate-400 mt-1 font-mono text-slate-500">
                      {admitLanguage === 'bn' ? 'পরীক্ষার্থীর স্বাক্ষর' : 'Signature'}
                    </div>
                  </div>

                  {/* Header Title Information */}
                  <div className="text-center pr-24 pl-4">
                    <p className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-600 uppercase font-sans">
                      {admitLanguage === 'bn' 
                        ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত পাঠ্যক্রম অনুযায়ী পরিচালিত'
                        : 'BOARD OF INTERMEDIATE & SECONDARY EDUCATION APPROVED'}
                    </p>

                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-0.5">
                      {admitLanguage === 'bn' ? institution.nameBn : (institution.nameEn || 'SCIENCE STUDIO ACADEMY')}
                    </h2>
                    <p className="text-xs text-slate-600 font-medium">
                      {institution.village}, {institution.upazila}, {institution.district} | EIIN: <strong>{institution.eiin}</strong>
                    </p>

                    {/* Title Pill - Centered with Zero Displacement */}
                    <div className="mt-2.5 flex justify-center">
                      <div 
                        className="inline-block px-7 py-1.5 rounded-full border-2 select-none"
                        style={{
                          backgroundColor: '#f0fdf4',
                          borderColor: '#059669',
                          color: '#065f46',
                          boxShadow: 'none'
                        }}
                      >
                        <span className="text-xs sm:text-sm font-black tracking-wider uppercase font-sans">
                          {admitLanguage === 'bn' 
                            ? `প্রবেশপত্র (ADMIT CARD) — ${selectedTerm}` 
                            : `ADMIT CARD — ANNUAL EXAMINATION / MODEL TEST 2026`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Info Grid (Board Standard Layout with Clear Padding and Balanced Alignment) */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs bg-slate-50/90 p-3.5 sm:p-4 rounded-xl border border-slate-300">
                  <div className="space-y-0.5">
                    <span className="text-slate-500 text-[11px] font-medium block">{admitLanguage === 'bn' ? 'শিক্ষার্থীর নাম:' : 'Candidate Name:'}</span>
                    <strong className="text-slate-950 font-bold block text-xs sm:text-sm">{admitLanguage === 'bn' ? st.nameBn : (st.nameEn || st.nameBn)}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-500 text-[11px] font-medium block">{admitLanguage === 'bn' ? 'শ্রেণি ও শাখা:' : 'Class & Section:'}</span>
                    <strong className="text-slate-900 block font-bold">{st.class} ({st.section})</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-500 text-[11px] font-medium block">{admitLanguage === 'bn' ? 'রোল নম্বর:' : 'Roll Number:'}</span>
                    <strong className="text-emerald-800 font-mono text-base block font-black">{st.roll}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-500 text-[11px] font-medium block">{admitLanguage === 'bn' ? 'রেজিস্ট্রেশন নং:' : 'Registration No:'}</span>
                    <span className="font-mono text-slate-800 block font-bold">{st.nidOrBirthReg || `231408${index + 10}`}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-500 text-[11px] font-medium block">{admitLanguage === 'bn' ? 'পিতার নাম:' : "Father's Name:"}</span>
                    <span className="text-slate-900 block font-medium">{st.fatherName}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-500 text-[11px] font-medium block">{admitLanguage === 'bn' ? 'মাতার নাম:' : "Mother's Name:"}</span>
                    <span className="text-slate-900 block font-medium">{st.motherName}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-500 text-[11px] font-medium block">{admitLanguage === 'bn' ? 'গ্রুপ / বিভাগ:' : 'Group / Dept:'}</span>
                    <span className="text-slate-900 block font-semibold">{st.customGroupVal || (admitLanguage === 'bn' ? 'বিজ্ঞান (Science)' : 'Science')}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-500 text-[11px] font-medium block">{admitLanguage === 'bn' ? 'পরীক্ষা কেন্দ্র:' : 'Exam Center:'}</span>
                    <span className="text-slate-900 block font-medium">{st.customExamCenterVal || (admitLanguage === 'bn' ? 'প্রধান ক্যাম্পাস, কেন্দ্র-০১' : 'Main Center-01')}</span>
                  </div>
                </div>

                {/* Exam Schedule Table inside Admit Card */}
                {includeRoutineInAdmit && (
                  <div className="mt-3.5">
                    <h4 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{admitLanguage === 'bn' ? 'পরীক্ষার সময়সূচী:' : 'Examination Schedule & Routine:'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                        <QrCode className="w-3.5 h-3.5 text-slate-700" />
                        <span>VERIFIED-EXAM-ADMIT</span>
                      </div>
                    </h4>
                    <table className="w-full text-xs text-center border-collapse border border-slate-300">
                      <thead>
                        <tr className="bg-slate-100 font-bold text-slate-900">
                          <th className="py-1.5 px-2 border border-slate-300">{admitLanguage === 'bn' ? 'তারিখ' : 'Date'}</th>
                          <th className="py-1.5 px-2 border border-slate-300">{admitLanguage === 'bn' ? 'বার' : 'Day'}</th>
                          <th className="py-1.5 px-2 border border-slate-300">{admitLanguage === 'bn' ? 'বিষয়' : 'Subject'}</th>
                          <th className="py-1.5 px-2 border border-slate-300">{admitLanguage === 'bn' ? 'সময়সূচী' : 'Time'}</th>
                          <th className="py-1.5 px-2 border border-slate-300">{admitLanguage === 'bn' ? 'পরীক্ষা কক্ষ' : 'Room'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {routines.slice(0, 5).map(r => (
                          <tr key={r.id} className="hover:bg-slate-50">
                            <td className="py-1.5 px-2 border border-slate-300 font-mono text-[11px]">{r.date}</td>
                            <td className="py-1.5 px-2 border border-slate-300">{r.day}</td>
                            <td className="py-1.5 px-2 border border-slate-300 font-bold text-slate-950">{r.subject}</td>
                            <td className="py-1.5 px-2 border border-slate-300 font-mono text-[11px]">{r.time}</td>
                            <td className="py-1.5 px-2 border border-slate-300 font-mono font-bold text-slate-800">{r.roomNo || '১০১'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Examination Instructions */}
                <div className="mt-3 text-[10.5px] text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-300 leading-relaxed">
                  <p className="font-bold text-slate-900 mb-1">
                    {admitLanguage === 'bn' ? 'পরীক্ষার্থীদের জন্য বিশেষ নির্দেশাবলী:' : 'Important Rules & Instructions for Examinees:'}
                  </p>
                  {admitLanguage === 'bn' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
                      <p>১. পরীক্ষা শুরুর কমপক্ষে ১৫ মিনিট পূর্বে নির্ধারিত আসনে উপস্থিত হতে হবে।</p>
                      <p>২. মূল প্রবেশপত্র ব্যতীত কোনো অবস্থাতেই পরীক্ষা কক্ষে প্রবেশ করতে দেওয়া হবে না।</p>
                      <p>৩. মোবাইল ফোন, স্মার্ট ওয়াচ বা যেকোনো ইলেকট্রনিক ডিভাইস সম্পূর্ণ নিষিদ্ধ।</p>
                      <p>৪. উত্তরপত্রে রোল নম্বর ও রেজিস্ট্রেশন নম্বর যথাযথভাবে বৃত্ত ভরাট করতে হবে।</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
                      <p>1. Candidates must take their seats at least 15 minutes before the exam commences.</p>
                      <p>2. No candidate will be admitted into the examination hall without this original Admit Card.</p>
                      <p>3. Mobile phones, smart watches, and unauthorized electronic devices are strictly prohibited.</p>
                      <p>4. Carefully bubble the Roll number and Registration number on the OMR/Answer script.</p>
                    </div>
                  )}
                </div>

                {/* Signatures Row (Class Teacher Blank / Uploaded, Controller Blank, Principal Linked) */}
                <div className="mt-6 pt-2 flex justify-between items-end text-xs font-semibold text-slate-900 px-2 sm:px-6">
                  {/* Left: Class Teacher (As requested: শ্রেনী শিক্ষকের সাক্ষর ব্লাঙ্ক ও সাক্সর এড করার অপশন) */}
                  <div className="text-center">
                    {classTeacherSignatureUrl ? (
                      <div className="h-10 sm:h-12 flex items-end justify-center pb-1">
                        <img 
                          src={classTeacherSignatureUrl} 
                          alt="Class Teacher Signature" 
                          className="max-h-10 sm:max-h-12 max-w-[130px] object-contain mx-auto" 
                        />
                      </div>
                    ) : (
                      <div className="h-10 sm:h-12 flex items-end justify-center"></div>
                    )}
                    <div className="w-32 sm:w-44 border-t-2 border-emerald-800 pt-1 text-slate-900 font-bold mx-auto">
                      {admitLanguage === 'bn' ? 'শ্রেণি শিক্ষকের স্বাক্ষর' : 'Class Teacher'}
                    </div>
                  </div>

                  {/* Center: Controller of Exams (Blank line for physical signature, zero hardcoded names) */}
                  <div className="text-center">
                    <div className="h-10 sm:h-12 flex items-end justify-center"></div>
                    <div className="w-32 sm:w-44 border-t-2 border-emerald-800 pt-1 text-slate-900 font-bold mx-auto">
                      {admitLanguage === 'bn' ? 'পরীক্ষা নিয়ন্ত্রক' : 'Controller of Exams'}
                    </div>
                  </div>

                  {/* Right: Principal & Headmaster (Shows uploaded signature image or clean blank line) */}
                  <div className="text-center">
                    {principalSignatureUrl ? (
                      <div className="h-10 sm:h-12 flex items-end justify-center pb-1">
                        <img 
                          src={principalSignatureUrl} 
                          alt="Principal Signature" 
                          className="max-h-10 sm:max-h-12 max-w-[130px] object-contain mx-auto" 
                        />
                      </div>
                    ) : (
                      <div className="h-10 sm:h-12 flex items-end justify-center"></div>
                    )}
                    <div className="w-32 sm:w-44 border-t-2 border-emerald-800 pt-1 text-slate-900 font-bold mx-auto">
                      {admitLanguage === 'bn' ? institution.headmasterTitle : 'Headmaster / Principal'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans">
                      {admitLanguage === 'bn' ? institution.nameBn : (institution.nameEn || 'SCIENCE STUDIO ACADEMY')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
            </>
          ) : (
            /* ========================================================================= */
            /* TAB 2: SAVED ADMIT CARDS ARCHIVE                                          */
            /* ========================================================================= */
            <div className="space-y-6">
              {/* Archive Header & Filters */}
              <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#c0dfe1] shadow-xs space-y-4 no-print">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#1f332c] flex items-center gap-2">
                      <FolderArchive className="w-5 h-5 text-[#78988b]" />
                      <span>সংরক্ষিত প্রবেশপত্র আর্কাইভ (Saved Admit Cards)</span>
                      <span className="text-xs bg-[#b1c0a1]/40 text-[#1f332c] px-2.5 py-0.5 rounded-full font-bold">
                        {toBengaliNumber(savedAdmitCards.length)}টি সংরক্ষিত
                      </span>
                    </h2>
                    <p className="text-xs text-[#53685e] mt-1">
                      পূর্বে তৈরি করা সকল প্রবেশপত্র এখানে জমা রয়েছে। এখান থেকে সরাসরি রঙিন PDF ডাউনলোড, এডিট ও প্রিন্ট করতে পারেন।
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingAdmitCardId(null);
                      setAdmitActiveTab('create');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#78988b] hover:bg-[#688579] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-xs self-start sm:self-auto"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ নতুন এডমিট কার্ড তৈরি করুন</span>
                  </button>
                </div>

                {/* Search and Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={archiveSearch}
                      onChange={(e) => setArchiveSearch(e.target.value)}
                      placeholder="শিক্ষার্থীর নাম, রোল বা রেজিস্ট্রেশন নং দিয়ে খুঁজুন..."
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-[#78988b]"
                    />
                  </div>

                  <div>
                    <select
                      value={archiveClassFilter}
                      onChange={(e) => setArchiveClassFilter(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-800 outline-none cursor-pointer"
                    >
                      <option value="all">সব শ্রেণি</option>
                      {classList.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Cards Grid / Empty State */}
              {filteredSavedAdmitCards.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 shadow-sm space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <FolderArchive className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-700">কোনো সংরক্ষিত প্রবেশপত্র পাওয়া যায়নি</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    প্রবেশপত্র তৈরিতে গিয়ে শিক্ষার্থীর তথ্য পূরণ করে "ক্রিয়েট এডমিট কার্ড" বাটনে ক্লিক করলে তা স্বয়ংক্রিয়ভাবে এখানে জমা থাকবে।
                  </p>
                  <button
                    onClick={() => {
                      setEditingAdmitCardId(null);
                      setAdmitActiveTab('create');
                    }}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition shadow-sm inline-flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>প্রথম প্রবেশপত্র তৈরি করুন</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSavedAdmitCards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-14 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center justify-center overflow-hidden shrink-0">
                            {card.photoUrl ? (
                              <img src={card.photoUrl} alt={card.studentNameBn} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-6 h-6 text-emerald-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-1">
                              {card.examTerm}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 truncate">
                              {card.studentNameBn}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-sans truncate">
                              {card.studentNameEn}
                            </p>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                          <div className="flex justify-between">
                            <span>শ্রেণি ও শাখা:</span>
                            <strong className="text-slate-800">{card.studentClass} ({card.section})</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>রোল ও রেজি:</span>
                            <span className="font-mono font-bold text-slate-800">রোল: {card.roll} | রেজি: {card.regNo}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>কেন্দ্র ও বিভাগ:</span>
                            <span className="text-slate-700 truncate max-w-[170px]">{card.group}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 text-right pt-1">
                            তৈরি: {card.createdAt}
                          </div>
                        </div>
                      </div>

                      {/* Actions: Download PDF, Edit, Delete */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            handleEditSavedAdmit(card);
                            setTimeout(() => {
                              handleDownloadAdmitPDF();
                            }, 400);
                          }}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition border border-blue-200"
                          title="রঙিন পিডিএফ ডাউনলোড করুন"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>রঙিন PDF</span>
                        </button>

                        <button
                          onClick={() => handleEditSavedAdmit(card)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer transition border border-emerald-200"
                          title="তথ্য এডিট করুন"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteSavedAdmit(card.id, card.studentNameBn)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer transition border border-rose-200"
                          title="ডিলিট করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: Seat Plan (সিট প্ল্যান) */}
      {activeSubTab === 'seat' && (
        <div className="space-y-6">
          <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#c0dfe1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#b1c0a1]/30 border border-[#b1c0a1] flex items-center justify-center text-[#78988b] shrink-0 shadow-2xs">
                <Grid className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1f332c]">পরীক্ষার সিট প্ল্যান ও ডেস্ক ট্যাগ প্রিন্ট</h2>
                <p className="text-xs text-[#53685e]">পরীক্ষার হলের প্রতিটি বেঞ্চে লাগানোর জন্য রোল ট্যাগ</p>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#78988b] hover:bg-[#658276] text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>সিট প্ল্যান প্রিন্ট</span>
            </button>
          </div>

          {/* Seat Tag Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-['Hind_Siliguri',sans-serif]">
            {classStudents.map(st => (
              <div key={st.id} className="border-2 border-dashed border-[#78988b] p-4 rounded-2xl text-center bg-[#ffffff] shadow-2xs">
                <div className="text-[10px] font-bold text-[#53685e] border-b border-[#c0dfe1] pb-1.5">
                  {institution.nameBn} - {selectedTerm}
                </div>
                <div className="my-2.5">
                  <span className="text-[10px] text-[#53685e] block">রোল নং</span>
                  <div className="text-3xl font-extrabold font-mono text-[#78988b]">{st.roll}</div>
                </div>
                <div className="text-xs font-bold text-[#1f332c]">{st.nameBn}</div>
                <div className="text-[11px] text-[#53685e]">{st.class} | শাখা: {st.section}</div>
                <div className="mt-2 text-[10px] text-[#749fa0] font-semibold bg-[#eae8d9]/60 py-0.5 rounded-md">কক্ষ নং: ১০১</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
