import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Award, 
  FileText, 
  Printer, 
  Download, 
  School, 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Image as ImageIcon, 
  Upload, 
  QrCode, 
  RotateCcw, 
  ShieldCheck, 
  ChevronDown, 
  User, 
  BookOpen, 
  Calendar, 
  Layers,
  FoldHorizontal,
  Bookmark,
  FolderArchive,
  FileSignature,
  PlusCircle,
  Eye,
  Edit3,
  Trash2,
  Search,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toBengaliNumber } from '../utils/bengaliUtils';
import { exportElementsToPDF } from '../utils/pdfExport';
import { defaultScienceStudioLogoSvg } from '../assets/defaultWatermarkLogo';
import { SavedCertificate } from '../types';

export type CertificateType = 
  | 'testimonial'  // প্রশংসাপত্র (SSC / বোর্ড / সমাপনী)
  | 'excellence'   // কৃতিত্ব ও মেধা সনদপত্র (Certificate of Excellence & Merit)
  | 'promotion'    // শ্রেণি উত্তীর্ণ প্রত্যয়ন পত্র
  | 'bonafide'     // অধ্যয়নরত প্রত্যয়ন পত্র (Bonafide Certificate)
  | 'tc'           // ছাড়পত্র / ট্রান্সফার সার্টিফিকেট (Transfer Certificate)
  | 'course';      // কোর্স / মডেল টেস্ট সমাপনী সনদ

export type CertificateTheme = 
  | 'royal_gold'      // রাজকীয় স্বর্ণালী গিলুশ ফ্রেম
  | 'academic_navy'   // নেভি ব্লু ও একাডেমি বোর্ড স্ট্যান্ডার্ড
  | 'emerald_classic' // ক্লাসিক এমারেল্ড গ্রিন
  | 'modern_minimal'; // আধুনিক মার্জিত বর্ডার

export const CertificatesView: React.FC = () => {
  const { 
    students, 
    institution, 
    principalSignatureUrl, 
    setPrincipalSignatureUrl,
    savedCertificates,
    saveCertificate,
    deleteCertificate
  } = useApp();

  // Navigation tab: 'create' (Designer & Preview) vs 'archive' (Saved Certificates Archive)
  const [activeMainTab, setActiveMainTab] = useState<'create' | 'archive'>('create');
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Basic Certificate Configuration
  const [certType, setCertType] = useState<CertificateType>('testimonial');
  const [theme, setTheme] = useState<CertificateTheme>('royal_gold');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [certLanguage, setCertLanguage] = useState<'bn' | 'en'>('bn');
  
  // Student Selection by Class & Student
  const classList = useMemo(() => {
    const list = Array.from(new Set(students.map(s => s.class))).filter(Boolean);
    return list.length > 0 ? list : ['১০ম শ্রেণি', '৯ম শ্রেণি', '৮ম শ্রেণি', '৭ম শ্রেণি', '৬ষ্ঠ শ্রেণি'];
  }, [students]);

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>(classList[0] || '১০ম শ্রেণি');

  // Filtered Students belonging strictly to selected class
  const classStudents = useMemo(() => {
    return students.filter(s => s.class === selectedClassFilter);
  }, [students, selectedClassFilter]);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(classStudents[0]?.id || students[0]?.id || '');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  const currentStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || classStudents[0] || students[0];
  }, [students, selectedStudentId, classStudents]);

  // Form Fields State (Editable with Smart Auto-Fill)
  const [studentNameBn, setStudentNameBn] = useState<string>(currentStudent?.nameBn || 'আরিফ হোসেন');
  const [studentNameEn, setStudentNameEn] = useState<string>(currentStudent?.nameEn || 'Arif Hossain');
  const [fatherName, setFatherName] = useState<string>(currentStudent?.fatherName || 'মোঃ জামাল উদ্দিন');
  const [motherName, setMotherName] = useState<string>(currentStudent?.motherName || 'মোসাম্মৎ ফাতেমা বেগম');
  const [birthDate, setBirthDate] = useState<string>(currentStudent?.birthDate || '১৫-০৪-২০১০');
  const [birthDateWords, setBirthDateWords] = useState<string>(currentStudent?.birthDateWords || 'পনেরোই এপ্রিল দুই হাজার দশ');
  const [studentClass, setStudentClass] = useState<string>(currentStudent?.class || selectedClassFilter);
  const [rollNo, setRollNo] = useState<string>(currentStudent?.roll || '০১');
  const [regNo, setRegNo] = useState<string>('২৩১৪০৮৯৭২১');
  const [sessionYear, setSessionYear] = useState<string>('২০২৫-২০২৬');
  const [passingYear, setPassingYear] = useState<string>('২০২৬');
  const [boardName, setBoardName] = useState<string>('মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা');
  const [gpaResult, setGpaResult] = useState<string>('GPA 5.00 (A+)');
  const [meritPosition, setMeritPosition] = useState<string>('১ম স্থান (মেধাতালিকা)');
  const [achievementTitle, setAchievementTitle] = useState<string>('বিজ্ঞান অলিম্পিয়াড ও মডেল টেস্টে অনন্য সাধারণ কৃতিত্বের জন্য');
  const [conduct, setConduct] = useState<string>('অত্যন্ত উত্তম, মার্জিত ও আদর্শ চরিত্রবান');
  const [nextClass, setNextClass] = useState<string>('একাদশ শ্রেণি');
  const [reasonForLeaving, setReasonForLeaving] = useState<string>('পিতার কর্মস্থল পরিবর্তনের কারণে');
  const [serialNo, setSerialNo] = useState<string>('SS/CERT/২০২৬/০৮৯');
  const [issueDate, setIssueDate] = useState<string>(new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }));

  // Watermark Settings
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [watermarkImage, setWatermarkImage] = useState<string>(institution.logoUrl || defaultScienceStudioLogoSvg);
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.07);
  const [watermarkSize, setWatermarkSize] = useState<number>(200);

  // Signatures & Badges
  const [showQrCode, setShowQrCode] = useState<boolean>(true);
  const [showOfficialSeal, setShowOfficialSeal] = useState<boolean>(true);
  const [showDigitalSignatures, setShowDigitalSignatures] = useState<boolean>(true);
  const [controllerSignatureUrl, setControllerSignatureUrl] = useState<string>('');
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  
  // Refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);
  const controllerSigInputRef = useRef<HTMLInputElement>(null);

  // Archive Search & Filter
  const [archiveSearch, setArchiveSearch] = useState<string>('');
  const [archiveClassFilter, setArchiveClassFilter] = useState<string>('all');
  const [archiveTypeFilter, setArchiveTypeFilter] = useState<string>('all');

  // Name Underline Style: 'none' (Clean & Bold - Recommended) vs 'stylish_underline' (Border bottom with safe clearance)
  const [nameUnderlineStyle, setNameUnderlineStyle] = useState<'none' | 'stylish_underline'>('none');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleControllerSigUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        if (res) {
          setControllerSignatureUrl(res);
          showToast('✅ পরীক্ষা নিয়ন্ত্রকের স্বাক্ষর সফলভাবে যুক্ত হয়েছে!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Safe Student Name Renderer - Zero Strike-through, Zero Center Underlines in PDF
  const renderStudentNameBadge = (name: string, isEnglish = false) => {
    return (
      <span 
        className="font-extrabold text-slate-950 px-1 font-serif inline-block align-baseline"
        style={{
          textDecoration: 'none',
          textDecorationLine: 'none',
          borderBottom: nameUnderlineStyle === 'stylish_underline' ? '2px solid #0f172a' : 'none',
          paddingBottom: nameUnderlineStyle === 'stylish_underline' ? '2px' : '0px',
          lineHeight: '1.2'
        }}
      >
        {name}
      </span>
    );
  };

  // Sync Form when selecting another student
  const handleSelectStudent = (stId: string) => {
    setSelectedStudentId(stId);
    const st = students.find(s => s.id === stId);
    if (st) {
      setStudentNameBn(st.nameBn);
      setStudentNameEn(st.nameEn || st.nameBn);
      setFatherName(st.fatherName || '');
      setMotherName(st.motherName || '');
      setBirthDate(st.birthDate || '');
      setBirthDateWords(st.birthDateWords || '');
      setStudentClass(st.class || selectedClassFilter);
      setRollNo(st.roll || '০১');
      if (st.nidOrBirthReg) {
        setRegNo(st.nidOrBirthReg);
      }
    }
  };

  // When class filter changes, select first student in that class
  const handleClassChange = (newClass: string) => {
    setSelectedClassFilter(newClass);
    setStudentClass(newClass);
    const inClass = students.filter(s => s.class === newClass);
    if (inClass.length > 0) {
      handleSelectStudent(inClass[0].id);
    }
  };

  // Principal Signature Upload Handler
  const handlePrincipalSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        if (res) {
          setPrincipalSignatureUrl(res);
          showToast('✅ অধ্যক্ষ / প্রধান শিক্ষকের স্বাক্ষর সফলভাবে আপলোড হয়েছে এবং সকল সনদে যুক্ত হয়েছে!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Watermark Image Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        if (res) {
          setWatermarkImage(res);
          showToast('✅ লগো ওয়াটারমার্কে সফলভাবে সেট হয়েছে!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save / Create Certificate
  const handleCreateCertificate = () => {
    const newCert: SavedCertificate = {
      id: editingCertId || `cert-${Date.now()}`,
      certType,
      theme,
      orientation,
      certLanguage,
      serialNo,
      issueDate,
      studentId: selectedStudentId,
      studentNameBn,
      studentNameEn,
      fatherName,
      motherName,
      birthDate,
      birthDateWords,
      studentClass,
      rollNo,
      regNo,
      sessionYear,
      passingYear,
      boardName,
      gpaResult,
      meritPosition,
      achievementTitle,
      conduct,
      nextClass,
      reasonForLeaving,
      createdAt: new Date().toISOString()
    };

    saveCertificate(newCert);
    showToast(editingCertId ? '✅ সনদপত্রটি সফলভাবে আপডেট করা হয়েছে!' : '✅ নতুন সনদপত্রটি সফলভাবে তৈরি ও আর্কাইভে যুক্ত হয়েছে!');
    setEditingCertId(null);
  };

  // Load a saved certificate for editing or preview
  const handleLoadSavedCertificate = (cert: SavedCertificate, mode: 'preview' | 'edit') => {
    setCertType(cert.certType);
    setTheme(cert.theme);
    setOrientation(cert.orientation);
    setCertLanguage(cert.certLanguage);
    setSerialNo(cert.serialNo);
    setIssueDate(cert.issueDate);
    setStudentNameBn(cert.studentNameBn);
    setStudentNameEn(cert.studentNameEn);
    setFatherName(cert.fatherName);
    setMotherName(cert.motherName);
    setBirthDate(cert.birthDate);
    setBirthDateWords(cert.birthDateWords);
    setStudentClass(cert.studentClass);
    setRollNo(cert.rollNo);
    setRegNo(cert.regNo);
    setSessionYear(cert.sessionYear);
    setPassingYear(cert.passingYear);
    setBoardName(cert.boardName);
    setGpaResult(cert.gpaResult);
    setMeritPosition(cert.meritPosition);
    setAchievementTitle(cert.achievementTitle);
    setConduct(cert.conduct);
    setNextClass(cert.nextClass);
    setReasonForLeaving(cert.reasonForLeaving);
    
    if (mode === 'edit') {
      setEditingCertId(cert.id);
      showToast('✏️ সনদপত্রটি এডিটর ফর্মে লোড হয়েছে। এডিট শেষে "আপডেট করুন" বাটনে ক্লিক করুন।');
    } else {
      showToast('👁️ সনদপত্রটি প্রিভিউতে প্রদর্শিত হচ্ছে।');
    }
    setActiveMainTab('create');
  };

  // 1-Click Clean PDF Download
  const handleDownloadPDF = async () => {
    setIsExportingPdf(true);
    try {
      const cleanFileName = `Certificate_${(studentNameEn || studentNameBn).replace(/\s+/g, '_')}_${certType}`.replace(/[/\\?%*:|"<>]/g, '_');
      const success = await exportElementsToPDF(['official-certificate-sheet'], {
        fileName: `${cleanFileName}.pdf`,
        orientation
      });
      if (!success) {
        handlePrint();
      } else {
        showToast('✅ সনদপত্রটি রঙিন ও নিখুঁতভাবে পিডিএফ ফাইল হিসেবে ডাউনলোড হয়েছে!');
      }
    } catch (err) {
      console.error('Certificate PDF export error:', err);
      handlePrint();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Direct download for a specific saved certificate from archive
  const handleDownloadSavedCert = (cert: SavedCertificate) => {
    handleLoadSavedCertificate(cert, 'preview');
    setTimeout(() => {
      handleDownloadPDF();
    }, 250);
  };

  // Vector Print Handler
  const handlePrint = () => {
    const styleId = 'dynamic-certificate-print-style';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    const sizeStr = orientation === 'landscape' ? 'A4 landscape' : 'A4 portrait';
    styleTag.innerHTML = `
      @media print {
        @page {
          size: ${sizeStr} !important;
          margin: 0.5in !important;
        }
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .no-print {
          display: none !important;
        }
        #official-certificate-sheet {
          box-shadow: none !important;
          margin: 0 auto !important;
          width: 100% !important;
          page-break-inside: avoid !important;
        }
      }
    `;
    window.print();
  };

  // Get Title in Bengali or English
  const getCertTitle = () => {
    if (certLanguage === 'en') {
      switch (certType) {
        case 'testimonial': return 'TESTIMONIAL';
        case 'excellence': return 'CERTIFICATE OF EXCELLENCE';
        case 'promotion': return 'PROMOTION CERTIFICATE';
        case 'bonafide': return 'STUDENTSHIP CERTIFICATE';
        case 'tc': return 'TRANSFER CERTIFICATE';
        case 'course': return 'CERTIFICATE OF COMPLETION';
      }
    }
    switch (certType) {
      case 'testimonial': return 'প্রশংসাপত্র';
      case 'excellence': return 'কৃতিত্ব ও মেধা সনদপত্র';
      case 'promotion': return 'শ্রেণি উত্তীর্ণ প্রত্যয়ন পত্র';
      case 'bonafide': return 'অধ্যয়নরত প্রত্যয়ন পত্র';
      case 'tc': return 'ছাড়পত্র (ট্রান্সফার সার্টিফিকেট)';
      case 'course': return 'কোর্স সমাপ্তি সনদপত্র';
    }
  };

  const getCertSubTitle = () => {
    if (certLanguage === 'en') {
      switch (certType) {
        case 'testimonial': return 'ACADEMIC & CHARACTER TESTIMONIAL';
        case 'excellence': return 'HONORING MERIT & OUTSTANDING ACHIEVEMENT';
        case 'promotion': return 'OFFICIAL ACADEMIC PROGRESS CERTIFICATE';
        case 'bonafide': return 'BONAFIDE STUDENT OF THIS INSTITUTION';
        case 'tc': return 'FORMAL INSTITUTIONAL RELEASE ORDER';
        case 'course': return 'SPECIAL EXAM PREPARATION & MODEL TEST';
      }
    }
    switch (certType) {
      case 'testimonial': return 'TESTIMONIAL & CHARACTER CERTIFICATE';
      case 'excellence': return 'CERTIFICATE OF EXCELLENCE & MERIT';
      case 'promotion': return 'CLASS PROMOTION CERTIFICATE';
      case 'bonafide': return 'BONAFIDE STUDENT CERTIFICATE';
      case 'tc': return 'TRANSFER CERTIFICATE (TC)';
      case 'course': return 'CERTIFICATE OF COMPLETION';
    }
  };

  const getCertLabelBn = (type: CertificateType) => {
    switch (type) {
      case 'testimonial': return 'প্রশংসাপত্র (Testimonial)';
      case 'excellence': return 'কৃতিত্ব ও মেধা সনদ';
      case 'promotion': return 'শ্রেণি উত্তীর্ণ প্রত্যয়ন';
      case 'bonafide': return 'অধ্যয়নরত প্রত্যয়ন';
      case 'tc': return 'ছাড়পত্র (Transfer Certificate)';
      case 'course': return 'মডেল টেস্ট কোর্স সমাপনী';
    }
  };

  // Filtered saved certificates for archive
  const filteredArchive = useMemo(() => {
    return savedCertificates.filter(cert => {
      const matchSearch = 
        !archiveSearch || 
        cert.studentNameBn.toLowerCase().includes(archiveSearch.toLowerCase()) ||
        cert.studentNameEn.toLowerCase().includes(archiveSearch.toLowerCase()) ||
        cert.serialNo.toLowerCase().includes(archiveSearch.toLowerCase()) ||
        cert.rollNo.includes(archiveSearch);
      
      const matchClass = archiveClassFilter === 'all' || cert.studentClass === archiveClassFilter;
      const matchType = archiveTypeFilter === 'all' || cert.certType === archiveTypeFilter;

      return matchSearch && matchClass && matchType;
    });
  }, [savedCertificates, archiveSearch, archiveClassFilter, archiveTypeFilter]);

  return (
    <div className="space-y-6 text-[#1f332c] font-['Hind_Siliguri','Plus_Jakarta_Sans',sans-serif] max-w-7xl mx-auto pb-16">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Signatures Upload Cards: Principal & Exam Controller */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
        {/* Principal / Headmaster Signature Card */}
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
              onClick={() => sigInputRef.current?.click()}
              className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{principalSignatureUrl ? 'পরিবর্তন' : 'আপলোড'}</span>
            </button>
            {principalSignatureUrl && (
              <button
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

        {/* Exam Controller Signature Card (As requested: পরীক্ষা নিয়ন্ত্রক এর সাক্ষর খালি ও এটিতে সাক্সর এড করার অপশন) */}
        <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 text-blue-800 flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <FileSignature className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  পরীক্ষা নিয়ন্ত্রকের স্বাক্ষর (Exam Controller Signature)
                </h3>
                {controllerSignatureUrl ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md font-semibold">
                    আপলোডকৃত ✓
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-200 text-slate-700 border border-slate-300 px-2 py-0.5 rounded-md font-semibold">
                    খালি (ম্যানুয়াল সই)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-blue-900/80 mt-0.5">
                ডিফল্টভাবে খালি থাকবে; চাইলে স্ক্যান করা স্বাক্ষর যোগ করতে পারেন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end pt-2 border-t border-blue-200/60">
            {controllerSignatureUrl && (
              <div className="h-9 px-2 bg-white rounded-lg border border-blue-300 flex items-center shadow-2xs">
                <img src={controllerSignatureUrl} alt="Controller Sig Preview" className="h-7 max-w-[80px] object-contain" />
              </div>
            )}
            <input
              type="file"
              ref={controllerSigInputRef}
              onChange={handleControllerSigUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => controllerSigInputRef.current?.click()}
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{controllerSignatureUrl ? 'পরিবর্তন' : 'স্বাক্ষর যোগ করুন'}</span>
            </button>
            {controllerSignatureUrl && (
              <button
                onClick={() => {
                  setControllerSignatureUrl('');
                  showToast('🔄 পরীক্ষা নিয়ন্ত্রকের স্বাক্ষর মুছে খালি করা হয়েছে।');
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
          onClick={() => setActiveMainTab('create')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeMainTab === 'create'
              ? 'bg-[#78988b] text-white shadow-xs'
              : 'text-[#53685e] hover:bg-[#b1c0a1]/20'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{editingCertId ? 'সনদ এডিটিং ও লাইভ প্রিভিউ' : 'নতুন সনদ তৈরি ও প্রিভিউ'}</span>
        </button>

        <button
          onClick={() => setActiveMainTab('archive')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeMainTab === 'archive'
              ? 'bg-[#78988b] text-white shadow-xs'
              : 'text-[#53685e] hover:bg-[#b1c0a1]/20'
          }`}
        >
          <FolderArchive className="w-4 h-4" />
          <span>সংরক্ষিত সনদপত্র আর্কাইভ ({toBengaliNumber(savedCertificates.length)}টি জমা রয়েছে)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CREATE / DESIGNER & LIVE PREVIEW                                   */}
      {/* ========================================================================= */}
      {activeMainTab === 'create' && (
        <div className="space-y-6">
          
          {/* Certificate Type Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-[#ffffff] p-2 rounded-2xl border border-[#c0dfe1] shadow-xs no-print">
            <button
              onClick={() => setCertType('testimonial')}
              className={`p-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center ${
                certType === 'testimonial' ? 'bg-[#78988b] text-white shadow-xs' : 'text-[#53685e] hover:bg-[#b1c0a1]/20'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>প্রশংসাপত্র (Testimonial)</span>
            </button>

            <button
              onClick={() => setCertType('excellence')}
              className={`p-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center ${
                certType === 'excellence' ? 'bg-[#78988b] text-white shadow-xs' : 'text-[#53685e] hover:bg-[#b1c0a1]/20'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>কৃতিত্ব ও মেধা সনদ</span>
            </button>

            <button
              onClick={() => setCertType('promotion')}
              className={`p-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center ${
                certType === 'promotion' ? 'bg-[#78988b] text-white shadow-xs' : 'text-[#53685e] hover:bg-[#b1c0a1]/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>শ্রেণি উত্তীর্ণ প্রত্যয়ন</span>
            </button>

            <button
              onClick={() => setCertType('bonafide')}
              className={`p-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center ${
                certType === 'bonafide' ? 'bg-[#78988b] text-white shadow-xs' : 'text-[#53685e] hover:bg-[#b1c0a1]/20'
              }`}
            >
              <School className="w-4 h-4" />
              <span>অধ্যয়নরত প্রত্যয়ন</span>
            </button>

            <button
              onClick={() => setCertType('tc')}
              className={`p-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center ${
                certType === 'tc' ? 'bg-[#78988b] text-white shadow-xs' : 'text-[#53685e] hover:bg-[#b1c0a1]/20'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>ছাড়পত্র / TC</span>
            </button>

            <button
              onClick={() => setCertType('course')}
              className={`p-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center ${
                certType === 'course' ? 'bg-[#78988b] text-white shadow-xs' : 'text-[#53685e] hover:bg-[#b1c0a1]/20'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>কোর্স সমাপনী সনদ</span>
            </button>
          </div>

          {/* Configuration & Options Toolbar */}
          <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#c0dfe1] shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs font-semibold no-print">
            <div className="flex flex-wrap items-center gap-3">
              {/* Language Format Toggle: বাংলা vs English */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#53685e]">ভাষা / Format:</span>
                <div className="flex bg-[#eae8d9]/60 p-1 rounded-xl border border-[#c0dfe1]">
                  <button
                    type="button"
                    onClick={() => setCertLanguage('bn')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer font-bold ${
                      certLanguage === 'bn' ? 'bg-[#78988b] text-white shadow-xs' : 'text-[#53685e]'
                    }`}
                  >
                    বাংলা ফরম্যাট
                  </button>
                  <button
                    type="button"
                    onClick={() => setCertLanguage('en')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer font-bold ${
                      certLanguage === 'en' ? 'bg-[#78988b] text-white shadow-xs' : 'text-[#53685e]'
                    }`}
                  >
                    English Format
                  </button>
                </div>
              </div>

              {/* Orientation Toggle */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#53685e]">লেআউট:</span>
                <div className="flex bg-[#eae8d9]/60 p-1 rounded-xl border border-[#c0dfe1]">
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer font-bold ${
                      orientation === 'landscape' ? 'bg-[#78988b] text-white shadow-xs' : 'text-[#53685e]'
                    }`}
                  >
                    ল্যান্ডস্কেপ (A4 Landscape)
                  </button>
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer font-bold ${
                      orientation === 'portrait' ? 'bg-[#78988b] text-white shadow-xs' : 'text-[#53685e]'
                    }`}
                  >
                    পোর্ট্রেট (A4 Portrait)
                  </button>
                </div>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#53685e]">ফ্রেম স্টাইল:</span>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as CertificateTheme)}
                  className="bg-[#ffffff] border border-[#c0dfe1] rounded-xl px-2.5 py-1 text-xs font-bold text-[#1f332c] outline-none cursor-pointer"
                >
                  <option value="royal_gold">রাজকীয় গোল্ড ফ্রেম (Royal Gold)</option>
                  <option value="academic_navy">একাডেমিক নেভি ব্লু (Board Navy)</option>
                  <option value="emerald_classic">এমারেল্ড গ্রিন (Emerald Green)</option>
                  <option value="modern_minimal">মডার্ন মিনিমাল (Minimalist)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={showWatermark}
                  onChange={(e) => setShowWatermark(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>জলছাপ</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={showOfficialSeal}
                  onChange={(e) => setShowOfficialSeal(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>বোর্ড সিলমোহর</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={showQrCode}
                  onChange={(e) => setShowQrCode(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>কিউআর কোড</span>
              </label>

              {/* Controller Signature Control */}
              <div className="flex items-center gap-1.5 bg-[#eae8d9]/70 px-2.5 py-1 rounded-xl border border-[#c0dfe1] text-xs">
                <FileSignature className="w-3.5 h-3.5 text-[#78988b]" />
                <span className="font-semibold text-[#53685e] hidden lg:inline">পরীক্ষা নিয়ন্ত্রক:</span>
                {controllerSignatureUrl ? (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">সংযুক্ত</span>
                    <button
                      onClick={() => setControllerSignatureUrl('')}
                      className="text-[10px] text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                      title="স্বাক্ষর মুছে ফেলুন ও ব্ল্যাঙ্ক রাখুন"
                    >
                      মুছুন
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => controllerSigInputRef.current?.click()}
                    className="text-[10px] bg-white border border-[#c0dfe1] hover:border-[#78988b] text-slate-800 font-bold px-2 py-0.5 rounded cursor-pointer"
                  >
                    + স্বাক্ষর আপলোড
                  </button>
                )}
                <input 
                  type="file" 
                  ref={controllerSigInputRef} 
                  onChange={handleControllerSigUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Action Buttons: Download PDF & Print */}
              <button
                onClick={handleDownloadPDF}
                disabled={isExportingPdf}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition disabled:opacity-50"
                title="কোনো প্রকার কালো দাগ বা শেডো ছাড়াই ঝকঝকে এ৪ পিডিএফ ডাউনলোড করুন"
              >
                <Download className="w-4 h-4 text-blue-100" />
                <span>{isExportingPdf ? 'প্রস্তুত হচ্ছে...' : 'পিডিএফ ডাউনলোড (PDF)'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition"
                title="সরাসরি প্রিন্ট প্রিভিউ খুলুন"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন</span>
              </button>
            </div>
          </div>

          {/* Main Interactive Editor Form: শিক্ষার্থী ও সনদের তথ্য পূরণ (স্বয়ংক্রিয় বা কাস্টম) */}
          <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#c0dfe1] shadow-xs space-y-4 no-print">
            <div className="flex items-center justify-between pb-3 border-b border-[#c0dfe1]">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Sliders className="w-4 h-4 text-[#78988b]" />
                <span>শিক্ষার্থী ও সনদের তথ্য পূরণ (স্বয়ংক্রিয় বা কাস্টম)</span>
                {editingCertId && (
                  <span className="text-[11px] bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-md font-semibold">
                    আর্কাইভ থেকে এডিট মোড সক্রিয়
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsCustomMode(!isCustomMode)}
                className="text-xs font-bold text-[#749fa0] hover:underline cursor-pointer"
              >
                {isCustomMode ? '← ডাটাবেজ থেকে শ্রেণি ও শিক্ষার্থী বাছুন' : '+ নতুন কাস্টম শিক্ষার্থীর তথ্য লিখুন'}
              </button>
            </div>

            {/* Linked Class Dropdown -> Student Dropdown */}
            {!isCustomMode && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
                <div>
                  <label className="block text-[#53685e] font-bold mb-1">শ্রেণি নির্বাচন (Class):</label>
                  <select
                    value={selectedClassFilter}
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
                    onChange={e => handleSelectStudent(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-bold text-slate-900 outline-none cursor-pointer focus:ring-1 focus:ring-[#78988b]"
                  >
                    {classStudents.length === 0 ? (
                      <option value="">এই শ্রেণিতে কোনো শিক্ষার্থী নেই (কাস্টম মোড ব্যবহার করুন)</option>
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
            )}

            {/* Detailed Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[#53685e] font-semibold mb-1">স্মারক / সিরিয়াল নং:</label>
                <input
                  type="text"
                  value={serialNo}
                  onChange={e => setSerialNo(e.target.value)}
                  className="w-full p-2 border border-[#c0dfe1] rounded-lg font-mono font-bold text-slate-800 outline-none focus:ring-1 focus:ring-[#78988b]"
                />
              </div>

              <div>
                <label className="block text-[#53685e] font-semibold mb-1">ইস্যুর তারিখ:</label>
                <input
                  type="text"
                  value={issueDate}
                  onChange={e => setIssueDate(e.target.value)}
                  className="w-full p-2 border border-[#c0dfe1] rounded-lg font-bold text-slate-800 outline-none focus:ring-1 focus:ring-[#78988b]"
                />
              </div>

              <div>
                <label className="block text-[#53685e] font-semibold mb-1">শিক্ষার্থীর নাম (বাংলা):</label>
                <input
                  type="text"
                  value={studentNameBn}
                  onChange={e => setStudentNameBn(e.target.value)}
                  className="w-full p-2 border border-[#c0dfe1] rounded-lg font-bold text-slate-900 outline-none focus:ring-1 focus:ring-[#78988b]"
                />
              </div>

              <div>
                <label className="block text-[#53685e] font-semibold mb-1">Student Name (English):</label>
                <input
                  type="text"
                  value={studentNameEn}
                  onChange={e => setStudentNameEn(e.target.value)}
                  className="w-full p-2 border border-[#c0dfe1] rounded-lg font-sans font-bold text-slate-900 outline-none focus:ring-1 focus:ring-[#78988b]"
                />
              </div>

              <div>
                <label className="block text-[#53685e] font-semibold mb-1">পিতার নাম:</label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={e => setFatherName(e.target.value)}
                  className="w-full p-2 border border-[#c0dfe1] rounded-lg text-slate-800 outline-none focus:ring-1 focus:ring-[#78988b]"
                />
              </div>

              <div>
                <label className="block text-[#53685e] font-semibold mb-1">মাতার নাম:</label>
                <input
                  type="text"
                  value={motherName}
                  onChange={e => setMotherName(e.target.value)}
                  className="w-full p-2 border border-[#c0dfe1] rounded-lg text-slate-800 outline-none focus:ring-1 focus:ring-[#78988b]"
                />
              </div>

              <div>
                <label className="block text-[#53685e] font-semibold mb-1">শ্রেণি ও রোল নম্বর:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={studentClass}
                    onChange={e => setStudentClass(e.target.value)}
                    placeholder="শ্রেণি"
                    className="w-full p-2 border border-[#c0dfe1] rounded-lg font-bold text-slate-800 outline-none focus:ring-1 focus:ring-[#78988b]"
                  />
                  <input
                    type="text"
                    value={rollNo}
                    onChange={e => setRollNo(e.target.value)}
                    placeholder="রোল"
                    className="w-full p-2 border border-[#c0dfe1] rounded-lg font-mono font-bold text-slate-800 outline-none focus:ring-1 focus:ring-[#78988b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#53685e] font-semibold mb-1">জন্ম তারিখ:</label>
                <input
                  type="text"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  className="w-full p-2 border border-[#c0dfe1] rounded-lg font-mono text-slate-800 outline-none focus:ring-1 focus:ring-[#78988b]"
                />
              </div>

              {/* Conditional Fields based on certificate type */}
              {(certType === 'testimonial' || certType === 'course') && (
                <>
                  <div>
                    <label className="block text-[#53685e] font-semibold mb-1">রেজিস্ট্রেশন নম্বর:</label>
                    <input
                      type="text"
                      value={regNo}
                      onChange={e => setRegNo(e.target.value)}
                      className="w-full p-2 border border-[#c0dfe1] rounded-lg font-mono text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#53685e] font-semibold mb-1">সেশন ও পাসের সাল:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={sessionYear}
                        onChange={e => setSessionYear(e.target.value)}
                        placeholder="সেশন"
                        className="w-full p-2 border border-[#c0dfe1] rounded-lg font-bold text-slate-800 outline-none"
                      />
                      <input
                        type="text"
                        value={passingYear}
                        onChange={e => setPassingYear(e.target.value)}
                        placeholder="পাসের সাল"
                        className="w-full p-2 border border-[#c0dfe1] rounded-lg font-bold text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#53685e] font-semibold mb-1">অর্জিত জিপিএ / ফলাফল:</label>
                    <input
                      type="text"
                      value={gpaResult}
                      onChange={e => setGpaResult(e.target.value)}
                      className="w-full p-2 border border-[#c0dfe1] rounded-lg font-bold text-emerald-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#53685e] font-semibold mb-1">নৈতিক চরিত্র ও আচরণ:</label>
                    <input
                      type="text"
                      value={conduct}
                      onChange={e => setConduct(e.target.value)}
                      className="w-full p-2 border border-[#c0dfe1] rounded-lg text-slate-800 outline-none"
                    />
                  </div>
                </>
              )}

              {certType === 'excellence' && (
                <>
                  <div className="lg:col-span-2">
                    <label className="block text-[#53685e] font-semibold mb-1">অর্জিত স্থান বা মেধা স্বীকৃতি:</label>
                    <input
                      type="text"
                      value={meritPosition}
                      onChange={e => setMeritPosition(e.target.value)}
                      className="w-full p-2 border border-[#c0dfe1] rounded-lg font-bold text-amber-700 outline-none"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-[#53685e] font-semibold mb-1">কৃতিত্ব ও সাফল্যের বিবরণ:</label>
                    <input
                      type="text"
                      value={achievementTitle}
                      onChange={e => setAchievementTitle(e.target.value)}
                      className="w-full p-2 border border-[#c0dfe1] rounded-lg font-bold text-slate-800 outline-none"
                    />
                  </div>
                </>
              )}

              {certType === 'promotion' && (
                <>
                  <div>
                    <label className="block text-[#53685e] font-semibold mb-1">পরবর্তী শ্রেণি:</label>
                    <input
                      type="text"
                      value={nextClass}
                      onChange={e => setNextClass(e.target.value)}
                      className="w-full p-2 border border-[#c0dfe1] rounded-lg font-bold text-teal-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#53685e] font-semibold mb-1">অর্জিত গ্রেড ও স্থান:</label>
                    <input
                      type="text"
                      value={gpaResult}
                      onChange={e => setGpaResult(e.target.value)}
                      className="w-full p-2 border border-[#c0dfe1] rounded-lg font-bold text-slate-800 outline-none"
                    />
                  </div>
                </>
              )}

              {certType === 'tc' && (
                <div className="lg:col-span-2">
                  <label className="block text-[#53685e] font-semibold mb-1">ছাড়পত্রের কারণ:</label>
                  <input
                    type="text"
                    value={reasonForLeaving}
                    onChange={e => setReasonForLeaving(e.target.value)}
                    className="w-full p-2 border border-[#c0dfe1] rounded-lg text-slate-800 outline-none"
                  />
                </div>
              )}
            </div>

            {/* CREATE CERTIFICATE BUTTON (As requested: শিক্ষার্থী ও সনদের তথ্য পূরণ এর নিচে বাটন থাকবে 'ক্রিয়েট' নামে) */}
            <div className="pt-3 border-t border-[#c0dfe1] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>সকল তথ্য যাচাই করে "ক্রিয়েট" বাটনে ক্লিক করুন। এটি স্থায়ীভাবে উপরের আর্কাইভে সেভ হয়ে থাকবে।</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveMainTab('archive')}
                  className="px-3.5 py-2.5 rounded-xl bg-[#eae8d9]/80 hover:bg-[#eae8d9] text-[#1f332c] border border-[#c0dfe1] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
                  title="আর্কাইভে সংরক্ষিত সকল সনদ দেখুন"
                >
                  <FolderArchive className="w-4 h-4 text-[#78988b]" />
                  <span>সংরক্ষিত সনদসমূহ ({toBengaliNumber(savedCertificates.length)})</span>
                </button>

                {editingCertId && (
                  <button
                    onClick={() => {
                      setEditingCertId(null);
                      showToast('এডিটিং বাতিল করা হয়েছে।');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition"
                  >
                    বাতিল করুন
                  </button>
                )}

                <button
                  onClick={handleCreateCertificate}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-900/20 flex items-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{editingCertId ? 'সনদপত্র আপডেট করুন (Update Certificate)' : 'সনদ ক্রিয়েট করুন (Create Certificate)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* AUTHENTIC OFFICIAL CERTIFICATE SHEET (A4 Landscape or Portrait)           */}
          {/* Rendered cleanly with zero shadow artifacts and 100% vibrant colors       */}
          {/* ========================================================================= */}
          <div className="flex justify-center overflow-x-auto p-2">
            <div 
              id="official-certificate-sheet"
              className="relative text-slate-900 bg-white p-6 sm:p-10 md:p-12 transition-all box-border select-none"
              style={{
                width: orientation === 'landscape' ? '297mm' : '210mm',
                minHeight: orientation === 'landscape' ? '210mm' : '297mm',
                maxWidth: '100%',
                backgroundColor: '#ffffff',
                border: theme === 'royal_gold' 
                  ? '10px solid #b45309' 
                  : theme === 'academic_navy' 
                    ? '10px solid #1e3a8a' 
                    : theme === 'emerald_classic' 
                      ? '10px solid #166534' 
                      : '10px solid #9f1239',
                outline: theme === 'royal_gold' 
                  ? '4px solid #d97706' 
                  : theme === 'academic_navy' 
                    ? '4px solid #3b82f6' 
                    : theme === 'emerald_classic' 
                      ? '4px solid #22c55e' 
                      : '4px solid #f43f5e',
                outlineOffset: '-6px'
              }}
            >
              {/* Inner Decorative Corner Rosettes & Thin Inset Border */}
              <div 
                className="absolute inset-3.5 pointer-events-none rounded-xs"
                style={{
                  border: theme === 'royal_gold' 
                    ? '1px solid #d97706' 
                    : theme === 'academic_navy' 
                      ? '1px solid #3b82f6' 
                      : theme === 'emerald_classic' 
                        ? '1px solid #16a34a'
                        : '1px solid #e11d48'
                }}
              />
              <div 
                className="absolute inset-5 pointer-events-none rounded-xs"
                style={{
                  border: theme === 'royal_gold' 
                    ? '1px dashed #f59e0b' 
                    : theme === 'academic_navy' 
                      ? '1px dashed #60a5fa' 
                      : theme === 'emerald_classic' 
                        ? '1px dashed #4ade80'
                        : '1px dashed #fb7185'
                }}
              />

              {/* Corner Flourishes */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: theme === 'royal_gold' ? '#b45309' : theme === 'academic_navy' ? '#1e3a8a' : theme === 'emerald_classic' ? '#166534' : '#9f1239' }}></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: theme === 'royal_gold' ? '#b45309' : theme === 'academic_navy' ? '#1e3a8a' : theme === 'emerald_classic' ? '#166534' : '#9f1239' }}></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: theme === 'royal_gold' ? '#b45309' : theme === 'academic_navy' ? '#1e3a8a' : theme === 'emerald_classic' ? '#166534' : '#9f1239' }}></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: theme === 'royal_gold' ? '#b45309' : theme === 'academic_navy' ? '#1e3a8a' : theme === 'emerald_classic' ? '#166534' : '#9f1239' }}></div>

              {/* Picture Watermark (Clean Centered Watermark without Black Artifacts) */}
              {showWatermark && watermarkImage && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
                  <img
                    src={watermarkImage}
                    alt="Certificate Watermark"
                    style={{
                      opacity: watermarkOpacity,
                      width: `${watermarkSize}px`,
                      maxHeight: `${watermarkSize}px`
                    }}
                    className="object-contain filter grayscale pointer-events-none select-none transition-opacity"
                  />
                </div>
              )}

              {/* Main Certificate Content */}
              <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                
                {/* Top Serial, Date & QR Badge */}
                <div className="flex items-start justify-between text-xs pb-1 border-b border-slate-300">
                  <div className="space-y-0.5">
                    <div>
                      <span className="font-semibold text-slate-600">{certLanguage === 'bn' ? 'স্মারক নং: ' : 'Serial No: '}</span>
                      <span className="font-mono font-bold text-slate-900">{serialNo}</span>
                    </div>
                    {institution.eiin && (
                      <div className="text-[10.5px] text-slate-500 font-mono">
                        EIIN: <strong>{institution.eiin}</strong> | EMIS: {institution.emisNo}
                      </div>
                    )}
                  </div>

                  {/* Center Monogram / National Emblem */}
                  <div className="text-center">
                    <div 
                      className="w-12 h-12 mx-auto rounded-full flex items-center justify-center p-1 overflow-hidden shadow-2xs"
                      style={{
                        border: '1px solid #d97706',
                        backgroundColor: '#fffbeb'
                      }}
                    >
                      {institution.logoUrl ? (
                        <img src={institution.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <Award className="w-7 h-7" style={{ color: '#b45309' }} />
                      )}
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <div>
                      <span className="font-semibold text-slate-600">{certLanguage === 'bn' ? 'তারিখ: ' : 'Date: '}</span>
                      <span className="font-bold text-slate-900">{issueDate}</span>
                    </div>
                    {showQrCode && (
                      <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 font-mono">
                        <QrCode className="w-3.5 h-3.5 text-slate-700" />
                        <span>VERIFIED CERT</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Institution Header */}
                <div className="text-center space-y-1">
                  <p className="text-[11px] font-bold tracking-wider text-slate-600 uppercase font-sans">
                    {certLanguage === 'bn' 
                      ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত পাঠ্যক্রম অনুযায়ী পরিচালিত'
                      : 'RECOGNIZED & APPROVED CURRICULUM UNDER SECONDARY EDUCATION BOARD'}
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-wide font-serif">
                    {certLanguage === 'bn' ? institution.nameBn : (institution.nameEn || 'SCIENCE STUDIO BY SAKIB')}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 font-sans tracking-wider">
                    {certLanguage === 'bn' ? institution.nameEn : institution.nameBn}
                  </p>
                  <p className="text-xs text-slate-600">
                    {certLanguage === 'bn'
                      ? `গ্রাম: ${institution.village}, ডাকঘর: ${institution.postOffice}, উপজেলা: ${institution.upazila}, জেলা: ${institution.district}।`
                      : `Village: ${institution.village}, Post: ${institution.postOffice}, Upazila: ${institution.upazila}, District: ${institution.district}.`}
                  </p>
                </div>

                {/* Certificate Title Badge - Centered with strictly equal padding on all sides */}
                <div className="w-full text-center my-3 sm:my-4" style={{ textAlign: 'center', width: '100%', margin: '14px 0' }}>
                  <div 
                    id="cert-title-badge"
                    className="mx-auto rounded-full border-2 select-none relative"
                    style={{
                      display: 'inline-block',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      boxSizing: 'border-box',
                      padding: '10px 42px',
                      backgroundColor: theme === 'royal_gold' 
                        ? '#fffbeb' 
                        : theme === 'academic_navy' 
                          ? '#eff6ff' 
                          : theme === 'emerald_classic' 
                            ? '#f0fdf4' 
                            : '#fff1f2',
                      borderColor: theme === 'royal_gold' 
                        ? '#d97706' 
                        : theme === 'academic_navy' 
                          ? '#2563eb' 
                          : theme === 'emerald_classic' 
                            ? '#16a34a' 
                            : '#e11d48',
                      boxShadow: 'none',
                      lineHeight: '1.25'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', lineHeight: '1.25', margin: 0, padding: 0 }}>
                      <span 
                        style={{
                          color: theme === 'royal_gold' ? '#d97706' : theme === 'academic_navy' ? '#3b82f6' : theme === 'emerald_classic' ? '#22c55e' : '#f43f5e',
                          fontSize: '13px',
                          lineHeight: 1
                        }}
                      >
                        ✦
                      </span>
                      <h2 
                        className="text-base sm:text-xl font-black tracking-widest font-serif uppercase text-center"
                        style={{
                          color: theme === 'royal_gold' 
                            ? '#78350f' 
                            : theme === 'academic_navy' 
                              ? '#1e3a8a' 
                              : theme === 'emerald_classic' 
                                ? '#14532d' 
                                : '#881337',
                          margin: 0,
                          padding: 0,
                          lineHeight: '1.25',
                          display: 'inline-block'
                        }}
                      >
                        {getCertTitle()}
                      </h2>
                      <span 
                        style={{
                          color: theme === 'royal_gold' ? '#d97706' : theme === 'academic_navy' ? '#3b82f6' : theme === 'emerald_classic' ? '#22c55e' : '#f43f5e',
                          fontSize: '13px',
                          lineHeight: 1
                        }}
                      >
                        ✦
                      </span>
                    </div>

                    <p 
                      className="text-[9.5px] sm:text-[11px] font-bold tracking-widest font-sans uppercase text-center"
                      style={{
                        color: theme === 'royal_gold' 
                          ? '#b45309' 
                          : theme === 'academic_navy' 
                            ? '#2563eb' 
                            : theme === 'emerald_classic' 
                              ? '#15803d' 
                              : '#be123c',
                        margin: '4px 0 0 0',
                        padding: 0,
                        letterSpacing: '0.15em',
                        lineHeight: '1.2'
                      }}
                    >
                      {getCertSubTitle()}
                    </p>
                  </div>
                </div>

                {/* Authentic Legal Certificate Body (Bengali or English) */}
                <div className="text-sm sm:text-base leading-loose text-justify px-2 sm:px-6 my-4 font-normal text-slate-900 font-serif">
                  {certType === 'testimonial' && (
                    certLanguage === 'bn' ? (
                      <p>
                        এই মর্মে প্রত্যয়ন ও প্রশংসাপত্র প্রদান করা যাচ্ছে যে,{' '}
                        {renderStudentNameBadge(studentNameBn)}{' '}
                        {studentNameEn ? `(${studentNameEn}), ` : ''}
                        পিতা: <strong className="font-bold text-slate-900 px-1">{fatherName}</strong>, 
                        মাতা: <strong className="font-bold text-slate-900 px-1">{motherName}</strong>, 
                        জন্ম তারিখ: <span className="font-mono font-bold text-slate-900 px-1">{birthDate}</span> খ্রি.। সে অত্র প্রতিষ্ঠানের একজন নিয়মিত ও মনোযোগী শিক্ষার্থী ছিল। সে{' '}
                        <strong className="font-bold text-slate-950 px-1">{boardName}</strong>-এর অধীনে{' '}
                        <strong className="font-bold text-slate-900 px-1">{passingYear}</strong> সনের সমাপনী পরীক্ষায় অংশ নিয়ে জিপিএ{' '}
                        <strong className="font-mono font-black text-emerald-800 px-1">{gpaResult}</strong> অর্জন করে কৃতিত্বের সাথে উত্তীর্ণ হয়েছে। তাহার রোল নম্বর:{' '}
                        <span className="font-mono font-bold text-slate-900 px-1">{rollNo}</span> এবং রেজিস্ট্রেশন নম্বর:{' '}
                        <span className="font-mono font-bold text-slate-900 px-1">{regNo}</span> (সেশন: {sessionYear})। অধ্যয়নকালে তাহার নৈতিক চরিত্র ও আচরণ{' '}
                        <strong className="font-bold text-slate-950 px-1">{conduct}</strong> ছিল। আমার জানামতে সে রাষ্ট্র কিংবা প্রতিষ্ঠান পরিপন্থী কোনো কার্যকলাপে লিপ্ত ছিল না। 
                        আমি তাহার উজ্জ্বল ভবিষ্যৎ ও জীবনের সর্বাঙ্গীন সাফল্য কামনা করি।
                      </p>
                    ) : (
                      <p>
                        This is to certify that {renderStudentNameBadge(studentNameEn || studentNameBn, true)}, 
                        son/daughter of <strong className="font-bold text-slate-900 px-1">{fatherName}</strong> and <strong className="font-bold text-slate-900 px-1">{motherName}</strong>, 
                        Date of Birth: <span className="font-mono font-bold text-slate-900 px-1">{birthDate}</span>, was a bonafide and regular student of this institution. 
                        He/She appeared in the Secondary School Certificate (S.S.C.) Examination in <strong className="font-bold text-slate-900 px-1">{passingYear}</strong> under the <strong className="font-bold text-slate-950 px-1">{boardName}</strong>, 
                        and successfully passed with a meritorious Grade Point Average (GPA) of <strong className="font-mono font-black text-emerald-800 px-1">{gpaResult}</strong> in Science group. 
                        His/Her Roll number was <span className="font-mono font-bold text-slate-900 px-1">{rollNo}</span> and Registration No. was <span className="font-mono font-bold text-slate-900 px-1">{regNo}</span> (Session: {sessionYear}). 
                        During his/her study here, his/her moral character and deportment were <strong className="font-bold text-slate-950 px-1">{conduct}</strong>. 
                        To the best of our knowledge, he/she never engaged in any activity subversive to the institution or the state. 
                        We wish him/her continuous brilliance, prosperity, and success in all higher academic pursuits.
                      </p>
                    )
                  )}

                  {certType === 'excellence' && (
                    certLanguage === 'bn' ? (
                      <div className="space-y-3 text-center sm:text-justify">
                        <p>
                          অত্র প্রতিষ্ঠান অত্যন্ত আনন্দ ও গৌরবের সাথে এই স্বীকৃতি প্রদান করিতেছে যে,{' '}
                          {renderStudentNameBadge(studentNameBn)}{' '}
                          {studentNameEn ? `(${studentNameEn}), ` : ''}
                          শ্রেণি: <strong className="font-bold text-slate-900 px-1">{studentClass}</strong>, রোল নং: <strong className="font-mono text-slate-900 px-1">{rollNo}</strong>, পিতা: {fatherName}, মাতা: {motherName}।
                        </p>
                        <p className="text-center font-bold text-amber-950 text-base py-1">
                          "{achievementTitle}"
                        </p>
                        <p className="text-center">
                          অত্র প্রতিষ্ঠানে অনুষ্ঠিত মূল্যায়নে সে <strong className="font-bold text-slate-950 px-1">{meritPosition}</strong> অর্জন করিয়াছে। তাহার মেধা, অধ্যবসায় ও সৃজনশীল প্রতিভা সকলের জন্য অনুপ্রেরণাদায়ী। 
                          আমরা তাহার এই অনন্য সাফল্যে গর্বিত এবং ভবিষ্যৎ জীবনে আরও বড় সাফল্যের প্রত্যাশা করি।
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 text-center sm:text-justify">
                        <p>
                          This Certificate of Academic Distinction & Merit is proudly conferred upon{' '}
                          {renderStudentNameBadge(studentNameEn || studentNameBn, true)}, 
                          Class: <strong className="font-bold text-slate-900 px-1">{studentClass}</strong>, Roll No: <strong className="font-mono text-slate-900 px-1">{rollNo}</strong>, 
                          Father: {fatherName}, Mother: {motherName}.
                        </p>
                        <p className="text-center font-bold text-amber-950 text-base py-1">
                          "{achievementTitle}"
                        </p>
                        <p className="text-center">
                          For displaying remarkable intellectual brilliance, perseverance, and securing <strong className="font-bold text-slate-950 px-1">{meritPosition}</strong> in the Academic Assessment & Science Olympiad. 
                          His/Her dedication to academic excellence serves as a model of inspiration. We celebrate this proud achievement and wish him/her glorious milestones ahead.
                        </p>
                      </div>
                    )
                  )}

                  {certType === 'promotion' && (
                    certLanguage === 'bn' ? (
                      <p>
                        এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,{' '}
                        {renderStudentNameBadge(studentNameBn)}
                        , পিতা: <span className="font-semibold text-slate-900 px-1">{fatherName}</span>, 
                        মাতা: <span className="font-semibold text-slate-900 px-1">{motherName}</span>, 
                        শ্রেণি: <strong className="font-bold text-slate-900 px-1">{studentClass}</strong>, রোল নং: <strong className="font-mono text-slate-900 px-1">{rollNo}</strong>। 
                        সে অত্র প্রতিষ্ঠানে <strong className="font-mono text-slate-900 px-1">{sessionYear}</strong> শিক্ষাবর্ষে বার্ষিক মূল্যায়নে অংশগ্রহণ করে সাফল্যের সাথে উত্তীর্ণ হয়েছে এবং অর্জিত ফলাফল:{' '}
                        <strong className="text-emerald-800 font-bold px-1">{gpaResult} ({meritPosition})</strong>। 
                        উক্ত শিক্ষার্থী পরবর্তী <strong className="text-teal-800 font-bold px-1">{nextClass}</strong> শ্রেণিতে প্রমোশন বা ভর্তির যোগ্য। তাহার সার্বিক সাফল্য ও মঙ্গল কামনা করি।
                      </p>
                    ) : (
                      <p>
                        This is to certify that {renderStudentNameBadge(studentNameEn || studentNameBn, true)}, 
                        son/daughter of <span className="font-semibold text-slate-900 px-1">{fatherName}</span> and <span className="font-semibold text-slate-900 px-1">{motherName}</span>, 
                        Class: <strong className="font-bold text-slate-900 px-1">{studentClass}</strong>, Roll No: <strong className="font-mono text-slate-900 px-1">{rollNo}</strong>, 
                        has successfully cleared the annual evaluation of academic session <strong className="font-mono text-slate-900 px-1">{sessionYear}</strong>, obtaining <strong className="text-emerald-800 font-bold px-1">{gpaResult} ({meritPosition})</strong>. 
                        He/She is hereby declared promoted and fully eligible for admission into Class <strong className="text-teal-800 font-bold px-1">{nextClass}</strong>. 
                        We wish him/her highest achievements and success in the higher class.
                      </p>
                    )
                  )}

                  {certType === 'bonafide' && (
                    certLanguage === 'bn' ? (
                      <p>
                        এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,{' '}
                        {renderStudentNameBadge(studentNameBn)}{' '}
                        {studentNameEn ? `(${studentNameEn}), ` : ''}
                        পিতা: <strong className="font-semibold text-slate-900 px-1">{fatherName}</strong>, মাতা: <strong className="font-semibold text-slate-900 px-1">{motherName}</strong>, অত্র প্রতিষ্ঠানের{' '}
                        <strong className="font-bold text-slate-900 px-1">{studentClass}</strong> শ্রেণিতে নিয়মিত অধ্যয়ন করিতেছে। তাহার শ্রেণি রোল নম্বর{' '}
                        <strong className="font-mono font-bold text-slate-900 px-1">{rollNo}</strong> এবং শিক্ষাবর্ষ <strong className="font-mono text-slate-900 px-1">{sessionYear}</strong>। 
                        সে একজন অমায়িক, পরিশ্রমী ও নিয়মানুবর্তী শিক্ষার্থী। পাসপোর্ট/ব্যাংক হিসাব/বৃত্তি আবেদনের প্রেক্ষিতে তাহার অনুরোধক্রমে অত্র প্রত্যয়নপত্র প্রদান করা হইল।
                      </p>
                    ) : (
                      <p>
                        This is to certify that {renderStudentNameBadge(studentNameEn || studentNameBn, true)}, 
                        son/daughter of <strong className="font-semibold text-slate-900 px-1">{fatherName}</strong> and <strong className="font-semibold text-slate-900 px-1">{motherName}</strong>, is a bonafide regular student of Class <strong className="font-bold text-slate-900 px-1">{studentClass}</strong> at this institution for the session <strong className="font-mono text-slate-900 px-1">{sessionYear}</strong> (Roll No: <strong className="font-mono font-bold text-slate-900 px-1">{rollNo}</strong>). 
                        He/She is well-behaved, diligent, and bears good moral character. This certificate is granted upon the official request of his/her guardian for documentation, identification, or scholarship purposes. 
                        We wish him/her every prosperity in life.
                      </p>
                    )
                  )}

                  {certType === 'tc' && (
                    certLanguage === 'bn' ? (
                      <p>
                        এই মর্মে ছাড়পত্র (Transfer Certificate) প্রদান করা যাইতেছে যে,{' '}
                        {renderStudentNameBadge(studentNameBn)}
                        , পিতা: <strong className="font-semibold text-slate-900 px-1">{fatherName}</strong>, মাতা: <strong className="font-semibold text-slate-900 px-1">{motherName}</strong>, অত্র প্রতিষ্ঠানে <strong className="font-bold text-slate-900 px-1">{studentClass}</strong> শ্রেণিতে অধ্যয়নরত ছিল (রোল নং: <strong className="font-mono text-slate-900 px-1">{rollNo}</strong>)। 
                        উক্ত শিক্ষার্থী এ প্রতিষ্ঠানে সুনাম ও নিয়মানুবর্তিতার সহিত অধ্যয়ন করিয়াছে। অধ্যয়নকালে সে কোনো প্রকার শৃঙ্খলা পরিপন্থী কাজে জড়িত ছিল না।{' '}
                        <strong className="font-bold text-slate-950 px-1">{reasonForLeaving}</strong> প্রেক্ষিতে তাহার অভিভাবকের লিখিত আবেদনের ভিত্তিতে অত্র ছাড়পত্র প্রদান করা হইল। 
                        অত্র প্রতিষ্ঠানে তাহার যাবতীয় পাওনাদি ও ফি পরিশোধিত রহিয়াছে। সে অন্য যে কোনো অনুমোদিত শিক্ষা প্রতিষ্ঠানে ভর্তির যোগ্য।
                      </p>
                    ) : (
                      <p>
                        This Transfer Certificate (T.C.) is granted to {renderStudentNameBadge(studentNameEn || studentNameBn, true)}, 
                        son/daughter of <strong className="font-semibold text-slate-900 px-1">{fatherName}</strong> and <strong className="font-semibold text-slate-900 px-1">{motherName}</strong>, who was a student of Class <strong className="font-bold text-slate-900 px-1">{studentClass}</strong> (Roll No: <strong className="font-mono text-slate-900 px-1">{rollNo}</strong>). 
                        His/Her attendance and academic record were commendable. This release order is issued on the written request of the guardian due to: <strong className="font-bold text-slate-950 px-1">{reasonForLeaving}</strong>. 
                        All institutional dues and fees have been cleared in full. He/She is qualified to seek admission into any recognized educational institution.
                      </p>
                    )
                  )}

                  {certType === 'course' && (
                    certLanguage === 'bn' ? (
                      <p>
                        এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,{' '}
                        {renderStudentNameBadge(studentNameBn)}{' '}
                        {studentNameEn ? `(${studentNameEn}), ` : ''}
                        অত্র একাডেমিতে পরিচালিত বিশেষ মডেল টেস্ট ও পরীক্ষা প্রস্তুতি কোর্স{' '}
                        <strong className="font-mono text-slate-900 px-1">{sessionYear}</strong> সফলভাবে সম্পন্ন করিয়াছে। 
                        উক্ত কোর্সে তাহার সক্রিয় অংশগ্রহণ ও পরীক্ষায় অর্জিত গ্রেড: <strong className="text-emerald-800 font-bold px-1">{gpaResult}</strong>। 
                        তাহার একাগ্রতা ও অধ্যবসায় প্রশংসনীয়। আমরা তাহার উত্তরোত্তর সাফল্য কামনা করি।
                      </p>
                    ) : (
                      <p>
                        This is to certify that {renderStudentNameBadge(studentNameEn || studentNameBn, true)} 
                        has successfully completed the Intensive Examination Preparation & Board Model Test Course for Academic Session <strong className="font-mono text-slate-900 px-1">{sessionYear}</strong>. 
                        His/Her active participation and achieved assessment grade of <strong className="text-emerald-800 font-bold px-1">{gpaResult}</strong> signify rigorous preparedness for the upcoming examinations. 
                        We commend his/her dedication and wish him/her the very best in all academic pursuits.
                      </p>
                    )
                  )}
                </div>

                {/* Bottom Signatures & Official Stamp */}
                <div className="pt-6 sm:pt-10 flex items-center justify-between text-xs sm:text-sm font-bold px-4 sm:px-10 border-t border-slate-300">
                  {/* Left Signature: Class Teacher / Exam Controller */}
                  <div className="text-center space-y-1">
                    {controllerSignatureUrl ? (
                      <div className="h-10 sm:h-12 flex items-end justify-center pb-0.5">
                        <img 
                          src={controllerSignatureUrl} 
                          alt="Controller Signature" 
                          className="max-h-10 sm:max-h-12 max-w-[140px] object-contain mx-auto" 
                        />
                      </div>
                    ) : (
                      <div className="h-10 sm:h-12 flex items-end justify-center"></div>
                    )}
                    <div className="w-36 sm:w-48 border-t-2 border-slate-900 pt-1 text-slate-900 mx-auto">
                      {certLanguage === 'bn' 
                        ? (certType === 'tc' || certType === 'promotion' ? 'শ্রেণি শিক্ষক' : 'পরীক্ষা নিয়ন্ত্রক')
                        : (certType === 'tc' || certType === 'promotion' ? 'Class Teacher' : 'Controller of Examinations')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans">
                      {certLanguage === 'bn' ? institution.nameBn : (institution.nameEn || 'SCIENCE STUDIO BY SAKIB')}
                    </div>
                  </div>

                  {/* Center Official Seal */}
                  {showOfficialSeal && (
                    <div className="text-center">
                      <div 
                        className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex flex-col items-center justify-center p-1 rotate-[-6deg]"
                        style={{
                          border: '4px double #b45309',
                          backgroundColor: 'rgba(254, 243, 199, 0.35)',
                          color: '#78350f'
                        }}
                      >
                        <ShieldCheck className="w-5 h-5" style={{ color: '#b45309' }} />
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-center font-sans mt-0.5" style={{ color: '#78350f' }}>
                          {certLanguage === 'bn' ? 'প্রতিষ্ঠান সিলমোহর' : 'OFFICIAL SEAL'}
                        </span>
                        <span className="text-[7px] font-mono" style={{ color: '#92400e' }}>★ VERIFIED ★</span>
                      </div>
                    </div>
                  )}

                  {/* Right Signature: Head of Institution (Shows uploaded signature automatically) */}
                  <div className="text-center space-y-1">
                    {principalSignatureUrl ? (
                      <div className="h-10 sm:h-12 flex items-end justify-center pb-0.5">
                        <img 
                          src={principalSignatureUrl} 
                          alt="Principal Signature" 
                          className="max-h-10 sm:max-h-12 max-w-[140px] object-contain" 
                        />
                      </div>
                    ) : showDigitalSignatures ? (
                      <div className="font-serif italic text-emerald-900 font-medium text-xs tracking-widest pb-0.5">
                        {institution.headmasterName || 'Rafiqul Islam'}
                      </div>
                    ) : (
                      <div className="h-6"></div>
                    )}
                    <div className="w-36 sm:w-48 border-t-2 border-slate-900 pt-1 text-slate-900">
                      {certLanguage === 'bn' ? institution.headmasterTitle : 'Principal & Headmaster'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans">
                      {certLanguage === 'bn' ? institution.nameBn : (institution.nameEn || 'SCIENCE STUDIO BY SAKIB')}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SAVED CERTIFICATES ARCHIVE (সংরক্ষিত সকল প্রশংসাপত্র ও সনদপত্র)      */}
      {/* ========================================================================= */}
      {activeMainTab === 'archive' && (
        <div className="space-y-6">
          {/* Archive Header & Filters */}
          <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#c0dfe1] shadow-xs space-y-4 no-print">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FolderArchive className="w-5 h-5 text-[#78988b]" />
                  <span>সংরক্ষিত সনদপত্র ও প্রশংসাপত্র আর্কাইভ</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                    মোট {toBengaliNumber(savedCertificates.length)}টি
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  পূর্বে তৈরি ও ক্রিয়েট করা সকল সনদপত্র এই আর্কাইভে সংরক্ষিত আছে। যেকোনো সময় সরাসরি ডাউনলোড, এডিট বা ডিলিট করতে পারবেন।
                </p>
              </div>

              <button
                onClick={() => setActiveMainTab('create')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ নতুন সনদ তৈরি করুন</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 text-xs">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={archiveSearch}
                  onChange={(e) => setArchiveSearch(e.target.value)}
                  placeholder="শিক্ষার্থীর নাম, রোল বা স্মারক নং দিয়ে খুঁজুন..."
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

              <div>
                <select
                  value={archiveTypeFilter}
                  onChange={(e) => setArchiveTypeFilter(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="all">সব ধরনের সনদপত্র</option>
                  <option value="testimonial">প্রশংসাপত্র (Testimonial)</option>
                  <option value="excellence">কৃতিত্ব ও মেধা সনদ</option>
                  <option value="promotion">শ্রেণি উত্তীর্ণ প্রত্যয়ন</option>
                  <option value="bonafide">অধ্যয়নরত প্রত্যয়ন</option>
                  <option value="tc">ছাড়পত্র (Transfer Certificate)</option>
                  <option value="course">কোর্স সমাপনী সনদ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Certificates Grid / Empty State */}
          {filteredArchive.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 shadow-sm space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FolderArchive className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">কোনো সংরক্ষিত সনদপত্র পাওয়া যায়নি</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                আপনি যখন নতুন সনদপত্র তৈরি ফর্মে গিয়ে শিক্ষার্থীর তথ্য পূরণ করে "সনদ ক্রিয়েট করুন" বাটনে ক্লিক করবেন, তখন তা স্বয়ংক্রিয়ভাবে এই আর্কাইভে যুক্ত হবে।
              </p>
              <button
                onClick={() => setActiveMainTab('create')}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer transition inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>প্রথম সনদপত্র তৈরি করুন</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArchive.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                        {getCertLabelBn(cert.certType)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {cert.certLanguage === 'bn' ? 'বাংলা' : 'English'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-950">
                        {cert.studentNameBn}
                      </h4>
                      {cert.studentNameEn && (
                        <p className="text-xs font-sans text-slate-500 font-medium">
                          {cert.studentNameEn}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 space-y-0.5 pt-1 border-t border-slate-100">
                      <div>শ্রেণি: <strong>{cert.studentClass}</strong> • রোল: <span className="font-mono font-bold">{cert.rollNo}</span></div>
                      <div className="font-mono text-[11px] text-slate-500">স্মারক: {cert.serialNo}</div>
                      <div className="text-[11px] text-slate-400">তারিখ: {cert.issueDate}</div>
                    </div>
                  </div>

                  {/* Actions: Download PDF, View, Edit, Delete */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleDownloadSavedCert(cert)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition border border-blue-200"
                      title="রঙিন পিডিএফ ডাউনলোড করুন"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>পিডিএফ</span>
                    </button>

                    <button
                      onClick={() => handleLoadSavedCertificate(cert, 'preview')}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition border border-slate-200"
                      title="প্রিভিউ দেখুন"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                    </button>

                    <button
                      onClick={() => handleLoadSavedCertificate(cert, 'edit')}
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer transition border border-emerald-200"
                      title="তথ্য এডিট করুন"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`আপনি কি নিশ্চিত যে "${cert.studentNameBn}"-এর এই সনদপত্রটি আর্কাইভ থেকে ডিলিট করতে চান?`)) {
                          deleteCertificate(cert.id);
                          showToast('🗑️ সনদপত্রটি সফলভাবে ডিলিট করা হয়েছে।');
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer transition border border-rose-200"
                      title="ডিলিট করুন"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
