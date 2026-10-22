import React, { useState, useRef } from 'react';
import { 
  Settings, 
  School, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Lock, 
  KeyRound, 
  RefreshCw, 
  Download, 
  Building2, 
  Award, 
  FileText, 
  Sparkles, 
  AlertTriangle,
  UserCheck,
  Upload,
  Image as ImageIcon,
  Trash2,
  Sliders,
  Eye,
  FileSignature,
  Stamp,
  RotateCcw,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InstitutionProfile } from '../types';
import { defaultScienceStudioLogoSvg } from '../assets/defaultWatermarkLogo';
import { NoticesView } from './NoticesView';

export const SettingsView: React.FC = () => {
  const { 
    institution, 
    updateInstitution, 
    principalSignatureUrl,
    setPrincipalSignatureUrl,
    controllerSignatureUrl,
    setControllerSignatureUrl,
    classTeacherSignatureUrl,
    setClassTeacherSignatureUrl,
    watermarkImage,
    setWatermarkImage,
    watermarkOpacity,
    setWatermarkOpacity,
    watermarkSize,
    setWatermarkSize,
    showWatermark,
    setShowWatermark,
    institutionSealUrl,
    setInstitutionSealUrl,
    userProfile,
    updateUserProfile,
    pin, 
    changePin, 
    resetAllData,
    students,
    teachers,
    results 
  } = useApp();

  type SettingsTab = 'general' | 'contact' | 'codes' | 'signatures' | 'watermark' | 'profile' | 'notices' | 'security' | 'backup';
  const [activeSubTab, setActiveSubTab] = useState<SettingsTab>('general');
  const [formData, setFormData] = useState<InstitutionProfile>({ ...institution });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Local signature & upload states for direct feedback
  const [localPrincipalSig, setLocalPrincipalSig] = useState<string>(principalSignatureUrl);
  const [localControllerSig, setLocalControllerSig] = useState<string>(controllerSignatureUrl);
  const [localClassTeacherSig, setLocalClassTeacherSig] = useState<string>(classTeacherSignatureUrl);
  const [localSealUrl, setLocalSealUrl] = useState<string>(institutionSealUrl || institution.sealUrl || '');
  const [localWatermarkImg, setLocalWatermarkImg] = useState<string>(watermarkImage);
  const [localWatermarkOpacity, setLocalWatermarkOpacity] = useState<number>(watermarkOpacity);
  const [localWatermarkSize, setLocalWatermarkSize] = useState<number>(watermarkSize);
  const [localShowWatermark, setLocalShowWatermark] = useState<boolean>(showWatermark);

  // Director Profile State
  const [directorProfile, setDirectorProfile] = useState({
    name: userProfile?.name || 'Sakib Ahmed',
    role: userProfile?.role || 'Founder & Director',
    email: userProfile?.email || 'director@sciencestudio.edu.bd',
    phone: userProfile?.phone || '01700-000000',
    bio: userProfile?.bio || 'Founder of Science Studio & Educational Academic Administrator',
    avatarUrl: userProfile?.avatarUrl || '/src/assets/images/admin_avatar_1791955080118.jpg'
  });

  // File input refs for direct device file uploads
  const logoInputRef = useRef<HTMLInputElement>(null);
  const principalSigInputRef = useRef<HTMLInputElement>(null);
  const controllerSigInputRef = useRef<HTMLInputElement>(null);
  const classTeacherSigInputRef = useRef<HTMLInputElement>(null);
  const sealInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);
  const directorAvatarInputRef = useRef<HTMLInputElement>(null);

  // Generic file-to-data-URL helper
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (base64Url: string) => void,
    successAlert: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ফাইলের সাইজ ৫ মেগাবাইট (5MB)-এর কম হতে হবে।');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          callback(result);
          setSuccessMsg(successAlert);
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 3500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // PIN change state
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Global Save
  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // 1. Update Institution Info
    updateInstitution({
      ...formData,
      sealUrl: localSealUrl
    });

    // 2. Update Signatures & Seal
    setPrincipalSignatureUrl(localPrincipalSig);
    setControllerSignatureUrl(localControllerSig);
    setClassTeacherSignatureUrl(localClassTeacherSig);
    setInstitutionSealUrl(localSealUrl);

    // 3. Update Watermark
    setWatermarkImage(localWatermarkImg);
    setWatermarkOpacity(localWatermarkOpacity);
    setWatermarkSize(localWatermarkSize);
    setShowWatermark(localShowWatermark);

    // 4. Update Director Profile
    updateUserProfile({
      name: directorProfile.name,
      role: directorProfile.role,
      email: directorProfile.email,
      phone: directorProfile.phone,
      bio: directorProfile.bio,
      avatarUrl: directorProfile.avatarUrl
    });

    setSuccessMsg('অভিনন্দন! আপনার প্রতিষ্ঠানের সকল স্ট্যাটিক সেটিংস, লোগো, স্বাক্ষর ও ওয়াটারমার্ক সফলভাবে সংরক্ষিত হয়েছে।');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handlePinChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess(false);

    if (newPin !== confirmPin) {
      setPinError('নতুন পিন এবং নিশ্চিতকরণ পিন হুবহু মিলছে না!');
      return;
    }

    if (newPin.length < 4) {
      setPinError('পিন কোড কমপক্ষে ৪ ডিজিট বা অক্ষরের হতে হবে।');
      return;
    }

    const success = changePin(oldPin, newPin);
    if (success) {
      setPinSuccess(true);
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => setPinSuccess(false), 4000);
    } else {
      setPinError('পুরাতন পিন কোডটি সঠিক নয়! দয়া করে সঠিক পিন দিন।');
    }
  };

  const handleExportData = () => {
    const dataToExport = {
      institution: { ...formData, sealUrl: localSealUrl },
      signatures: {
        principal: localPrincipalSig,
        controller: localControllerSig,
        classTeacher: localClassTeacherSig,
        seal: localSealUrl
      },
      watermark: {
        image: localWatermarkImg,
        opacity: localWatermarkOpacity,
        size: localWatermarkSize,
        enabled: localShowWatermark
      },
      userProfile: directorProfile,
      studentsCount: students.length,
      teachersCount: teachers.length,
      resultsCount: results.length,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sciencestudio_settings_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFactoryReset = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে সকল প্রাথমিক ডিফল্ট তথ্যে সিস্টেম রিসেট করতে চান?')) {
      resetAllData();
      setSuccessMsg('সিস্টেম সফলভাবে প্রাথমিক ডিফল্ট অবস্থায় রিসেট হয়েছে।');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-6 text-[#1f332c] max-w-7xl mx-auto pb-16 font-['Hind_Siliguri','Plus_Jakarta_Sans',sans-serif]">
      {/* Top Banner Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c0dfe1] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#b1c0a1]/30 border border-[#b1c0a1] flex items-center justify-center text-[#78988b] shrink-0 shadow-2xs">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#1f332c]">
                সিস্টেম ও প্রাতিষ্ঠানিক সেটিংস (Static Settings)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#b1c0a1]/40 text-[#1f332c] border border-[#b1c0a1]">
                লাইভ সিঙ্ক সক্রিয়
              </span>
            </div>
            <p className="text-xs text-[#53685e] mt-1">
              প্রতিষ্ঠানের নাম, লোগো, স্বাক্ষর, সিলমোহর, বোর্ড ও প্রশ্নপত্রের পিকচার ওয়াটারমার্ক সরাসরি ফাইল থেকে আপলোড ও কাস্টমাইজ করুন।
            </p>
          </div>
        </div>

        <button
          onClick={() => handleFormSubmit()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#78988b] hover:bg-[#658276] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer shrink-0 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>সকল পরিবর্তন সংরক্ষণ করুন</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-md animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1">
            <p>{successMsg}</p>
            <p className="text-[11px] text-emerald-700 font-normal mt-0.5">
              সাইডবার, হেডার, প্রশ্নপত্র, এডমিট কার্ড, সার্টিফিকেট ও রেজাল্ট শিটে সকল পরিবর্তন কার্যকর হয়েছে।
            </p>
          </div>
        </div>
      )}

      {/* Navigation Subtabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#c0dfe1] pb-2">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'general'
              ? 'bg-[#78988b] text-white shadow-xs'
              : 'bg-white text-[#53685e] hover:bg-[#b1c0a1]/20 border border-[#c0dfe1]'
          }`}
        >
          <School className="w-4 h-4" />
          <span>১. নাম ও লোগো আপলোড</span>
        </button>

        <button
          onClick={() => setActiveSubTab('signatures')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'signatures'
              ? 'bg-[#78988b] text-white shadow-xs'
              : 'bg-white text-[#53685e] hover:bg-[#b1c0a1]/20 border border-[#c0dfe1]'
          }`}
        >
          <FileSignature className="w-4 h-4" />
          <span>২. স্বাক্ষর ও সিল আপলোড</span>
        </button>

        <button
          onClick={() => setActiveSubTab('watermark')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'watermark'
              ? 'bg-[#78988b] text-white shadow-xs'
              : 'bg-white text-[#53685e] hover:bg-[#b1c0a1]/20 border border-[#c0dfe1]'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>৩. পিকচার ওয়াটারমার্ক সেটিংস</span>
        </button>

        <button
          onClick={() => setActiveSubTab('codes')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'codes'
              ? 'bg-[#78988b] text-white shadow-xs'
              : 'bg-white text-[#53685e] hover:bg-[#b1c0a1]/20 border border-[#c0dfe1]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>৪. কোড ও শিক্ষা বোর্ড</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contact')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'contact'
              ? 'bg-[#78988b] text-white shadow-xs'
              : 'bg-white text-[#53685e] hover:bg-[#b1c0a1]/20 border border-[#c0dfe1]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>৫. ঠিকানা ও যোগাযোগ</span>
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'profile'
              ? 'bg-[#78988b] text-white shadow-xs'
              : 'bg-white text-[#53685e] hover:bg-[#b1c0a1]/20 border border-[#c0dfe1]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>৬. ডিরেক্টর প্রোফাইল ও ফটো</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notices')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'notices'
              ? 'bg-[#78988b] text-white shadow-xs'
              : 'bg-white text-[#53685e] hover:bg-[#b1c0a1]/20 border border-[#c0dfe1]'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-600" />
          <span>৭. নোটিশ বোর্ড ও জরুরি ঘোষণা</span>
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'security'
              ? 'bg-[#78988b] text-white shadow-xs'
              : 'bg-white text-[#53685e] hover:bg-[#b1c0a1]/20 border border-[#c0dfe1]'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>৮. নিরাপত্তা ও পিন কোড</span>
        </button>

        <button
          onClick={() => setActiveSubTab('backup')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'backup'
              ? 'bg-[#78988b] text-white shadow-xs'
              : 'bg-white text-[#53685e] hover:bg-[#b1c0a1]/20 border border-[#c0dfe1]'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>৯. ব্যাকআপ ও রিসেট</span>
        </button>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* TAB 1: General Info & Direct Logo Upload */}
          {activeSubTab === 'general' && (
            <div className="bg-white p-6 rounded-2xl border border-[#c0dfe1] shadow-xs space-y-5">
              <div className="border-b border-[#c0dfe1] pb-3">
                <h3 className="text-sm font-bold text-[#1f332c] flex items-center gap-2">
                  <School className="w-4 h-4 text-[#78988b]" />
                  <span>প্রতিষ্ঠানের পরিচিতি ও অফিসিয়াল লোগো আপলোড</span>
                </h3>
                <p className="text-xs text-[#53685e] mt-0.5">
                  প্রশ্নের হেডার, এডমিট কার্ড ও সনদপত্রে এই নাম এবং সরাসরি ফাইল থেকে আপলোডকৃত লোগো প্রদর্শিত হবে।
                </p>
              </div>

              {/* Direct File Upload for Logo (as requested: কোনো লিংক নয়, ফাইল থেকে সিলেক্ট করে আপলোড) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-[#1f332c]">
                  অফিসিয়াল মনোগ্রাম / লোগো (Device File Direct Upload):
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Logo Preview */}
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-[#78988b] bg-white flex items-center justify-center p-2 shrink-0 shadow-xs relative group overflow-hidden">
                    {formData.logoUrl ? (
                      <img 
                        src={formData.logoUrl} 
                        alt="Institution Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-[#78988b]">
                        <Award className="w-8 h-8 mx-auto stroke-1" />
                        <span className="text-[10px] block mt-1">ডিফল্ট লোগো</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-xs text-[#53685e]">
                      আপনার ডিভাইস থেকে সরাসরি ইমেজ ফাইল সিলেক্ট করুন (PNG, JPG, SVG, WebP)।
                    </p>
                    
                    <input 
                      type="file" 
                      ref={logoInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => {
                        setFormData(prev => ({ ...prev, logoUrl: url }));
                      }, '✅ প্রতিষ্ঠানের লোগো সফলভাবে আপলোড হয়েছে!')}
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="px-4 py-2 bg-[#78988b] hover:bg-[#658276] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>ফাইল থেকে লোগো সিলেক্ট করুন</span>
                      </button>

                      {formData.logoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, logoUrl: '' }));
                          }}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>লোগো মুছুন</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    প্রতিষ্ঠানের পূর্ণ নাম (বাংলায়) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nameBn}
                    onChange={e => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-[#1f332c] border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none"
                    placeholder="যেমন: কলাবাড়িয়া মডেল একাডেমি ও কোচিং সেন্টার"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    Institution Full Name (English) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-[#1f332c] border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none font-sans"
                    placeholder="e.g. Kolabaria Model Academy & Coaching Center"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                      প্রতিষ্ঠানের স্লোগান বা মূলমন্ত্র
                    </label>
                    <input
                      type="text"
                      value={formData.slogan || 'জ্ঞানই শক্তি, নৈতিকতাই সমৃদ্ধি'}
                      onChange={e => setFormData({ ...formData, slogan: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                      placeholder="যেমন: শিক্ষার আলো ছড়াবো আমরা"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                      স্থাপিত শিক্ষাবর্ষ / সাল
                    </label>
                    <input
                      type="text"
                      value={formData.established}
                      onChange={e => setFormData({ ...formData, established: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-mono font-bold border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                      placeholder="১৯৯৮"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Signatures & Authority Uploads */}
          {activeSubTab === 'signatures' && (
            <div className="bg-white p-6 rounded-2xl border border-[#c0dfe1] shadow-xs space-y-6">
              <div className="border-b border-[#c0dfe1] pb-3">
                <h3 className="text-sm font-bold text-[#1f332c] flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-[#78988b]" />
                  <span>স্বাক্ষর কর্মকর্তা ও প্রাতিষ্ঠানিক সিলমোহর আপলোড</span>
                </h3>
                <p className="text-xs text-[#53685e] mt-0.5">
                  এডমিট কার্ড, প্রত্যয়নপত্র ও রুটিনে প্রদর্শনের জন্য দায়িত্বশীল কর্মকর্তাদের স্বচ্ছ ব্যাকগ্রাউন্ডের স্বাক্ষর ও সীল সরাসরি ফাইল থেকে আপলোড করুন।
                </p>
              </div>

              {/* Headmaster / Principal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    অধ্যক্ষ / প্রধান শিক্ষকের নাম:
                  </label>
                  <input
                    type="text"
                    value={formData.headmasterName}
                    onChange={e => setFormData({ ...formData, headmasterName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-bold text-[#1f332c] border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none"
                    placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    পদবি (Designation):
                  </label>
                  <input
                    type="text"
                    value={formData.headmasterTitle}
                    onChange={e => setFormData({ ...formData, headmasterTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                    placeholder="যেমন: প্রধান শিক্ষক ও পরিচালক"
                  />
                </div>
              </div>

              {/* 4 Cards for Direct File Upload: Principal, Controller, Class Teacher, Academy Seal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Principal Signature */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <FileSignature className="w-4 h-4 text-amber-700" />
                      <span>১. প্রধান শিক্ষকের স্বাক্ষর</span>
                    </span>
                    {localPrincipalSig ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        যুক্ত আছে ✓
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-medium">খালি (Blank)</span>
                    )}
                  </div>

                  <div className="h-16 border-2 border-dashed border-amber-300 rounded-xl bg-white flex items-center justify-center p-1 overflow-hidden">
                    {localPrincipalSig ? (
                      <img src={localPrincipalSig} alt="Principal Signature" className="max-h-14 max-w-full object-contain" />
                    ) : (
                      <span className="text-[11px] text-slate-400">কোনো স্বাক্ষর আপলোড করা হয়নি</span>
                    )}
                  </div>

                  <input 
                    type="file" 
                    ref={principalSigInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setLocalPrincipalSig(url), 'প্রধান শিক্ষকের স্বাক্ষর সফলভাবে সিলেক্ট হয়েছে!')}
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => principalSigInputRef.current?.click()}
                      className="flex-1 py-1.5 px-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition shadow-xs"
                    >
                      <Upload className="w-3 h-3" />
                      <span>ফাইল থেকে আপলোড</span>
                    </button>
                    {localPrincipalSig && (
                      <button
                        type="button"
                        onClick={() => setLocalPrincipalSig('')}
                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition"
                        title="স্বাক্ষর মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Controller of Examination Signature */}
                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                      <FileSignature className="w-4 h-4 text-indigo-700" />
                      <span>২. পরীক্ষা নিয়ন্ত্রকের স্বাক্ষর</span>
                    </span>
                    {localControllerSig ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        যুক্ত আছে ✓
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-medium">খালি (Blank)</span>
                    )}
                  </div>

                  <div className="h-16 border-2 border-dashed border-indigo-300 rounded-xl bg-white flex items-center justify-center p-1 overflow-hidden">
                    {localControllerSig ? (
                      <img src={localControllerSig} alt="Controller Signature" className="max-h-14 max-w-full object-contain" />
                    ) : (
                      <span className="text-[11px] text-slate-400">কোনো স্বাক্ষর নেই (ব্লাঙ্ক লাইন থাকবে)</span>
                    )}
                  </div>

                  <input 
                    type="file" 
                    ref={controllerSigInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setLocalControllerSig(url), 'পরীক্ষা নিয়ন্ত্রকের স্বাক্ষর সফলভাবে সিলেক্ট হয়েছে!')}
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => controllerSigInputRef.current?.click()}
                      className="flex-1 py-1.5 px-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition shadow-xs"
                    >
                      <Upload className="w-3 h-3" />
                      <span>ফাইল থেকে আপলোড</span>
                    </button>
                    {localControllerSig && (
                      <button
                        type="button"
                        onClick={() => setLocalControllerSig('')}
                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition"
                        title="স্বাক্ষর মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Class Teacher Signature */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <FileSignature className="w-4 h-4 text-emerald-700" />
                      <span>৩. শ্রেণি শিক্ষকের স্বাক্ষর</span>
                    </span>
                    {localClassTeacherSig ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        যুক্ত আছে ✓
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-medium">খালি (Blank)</span>
                    )}
                  </div>

                  <div className="h-16 border-2 border-dashed border-emerald-300 rounded-xl bg-white flex items-center justify-center p-1 overflow-hidden">
                    {localClassTeacherSig ? (
                      <img src={localClassTeacherSig} alt="Class Teacher Signature" className="max-h-14 max-w-full object-contain" />
                    ) : (
                      <span className="text-[11px] text-slate-400">কোনো স্বাক্ষর নেই (ব্লাঙ্ক লাইন থাকবে)</span>
                    )}
                  </div>

                  <input 
                    type="file" 
                    ref={classTeacherSigInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setLocalClassTeacherSig(url), 'শ্রেণি শিক্ষকের স্বাক্ষর সফলভাবে সিলেক্ট হয়েছে!')}
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => classTeacherSigInputRef.current?.click()}
                      className="flex-1 py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition shadow-xs"
                    >
                      <Upload className="w-3 h-3" />
                      <span>ফাইল থেকে আপলোড</span>
                    </button>
                    {localClassTeacherSig && (
                      <button
                        type="button"
                        onClick={() => setLocalClassTeacherSig('')}
                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition"
                        title="স্বাক্ষর মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. Academy Official Rubber Stamp / Seal */}
                <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                      <Stamp className="w-4 h-4 text-teal-700" />
                      <span>৪. প্রাতিষ্ঠানিক গোল সিলমোহর (Seal)</span>
                    </span>
                    {localSealUrl ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        যুক্ত আছে ✓
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-medium">ঐচ্ছিক</span>
                    )}
                  </div>

                  <div className="h-16 border-2 border-dashed border-teal-300 rounded-xl bg-white flex items-center justify-center p-1 overflow-hidden">
                    {localSealUrl ? (
                      <img src={localSealUrl} alt="Academy Seal" className="max-h-14 max-w-full object-contain" />
                    ) : (
                      <span className="text-[11px] text-slate-400">কোনো সিলমোহর আপলোড করা হয়নি</span>
                    )}
                  </div>

                  <input 
                    type="file" 
                    ref={sealInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setLocalSealUrl(url), 'অফিসিয়াল সিলমোহর সফলভাবে সিলেক্ট হয়েছে!')}
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => sealInputRef.current?.click()}
                      className="flex-1 py-1.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition shadow-xs"
                    >
                      <Upload className="w-3 h-3" />
                      <span>ফাইল থেকে আপলোড</span>
                    </button>
                    {localSealUrl && (
                      <button
                        type="button"
                        onClick={() => setLocalSealUrl('')}
                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition"
                        title="সিল মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: Picture Watermark Settings (as requested: পিকচার ওয়াটারমার্ক, পার্সেন্টেজ ও অপাসিটি নির্ধারণ) */}
          {activeSubTab === 'watermark' && (
            <div className="bg-white p-6 rounded-2xl border border-[#c0dfe1] shadow-xs space-y-6">
              <div className="border-b border-[#c0dfe1] pb-3">
                <h3 className="text-sm font-bold text-[#1f332c] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#78988b]" />
                  <span>প্রশ্নপত্র পিকচার ওয়াটারমার্ক কনফিগারেশন (Picture Watermark)</span>
                </h3>
                <p className="text-xs text-[#53685e] mt-0.5">
                  প্রশ্নপত্রের পৃষ্ঠার ঠিক মাঝখানে জলছাপ হিসেবে আপনার পছন্দের ছবি/লোগো, এর সাইজ পার্সেন্টেজ এবং অপাসিটি কাস্টমাইজ করুন।
                </p>
              </div>

              {/* Watermark Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">প্রশ্নপত্রে পিকচার ওয়াটারমার্ক প্রদর্শন</h4>
                  <p className="text-[11px] text-slate-500">ওয়াটারমার্ক সক্রিয় থাকলে সকল প্রশ্নপত্র প্রিন্ট ও প্রিভিউতে ওয়াটারমার্ক দৃশ্যমান হবে।</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={localShowWatermark}
                    onChange={(e) => setLocalShowWatermark(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Watermark Image File Upload */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-[#1f332c]">
                  ওয়াটারমার্ক ছবি আপলোড (Device File Direct Upload):
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-[#78988b] bg-white flex items-center justify-center p-2 shrink-0 shadow-xs overflow-hidden">
                    <img 
                      src={localWatermarkImg || defaultScienceStudioLogoSvg} 
                      alt="Watermark preview" 
                      className="w-full h-full object-contain"
                      style={{ opacity: Math.max(0.2, localWatermarkOpacity * 2) }}
                    />
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-xs text-[#53685e]">
                      যে ছবিটি প্রশ্নপত্রের মাঝে জলছাপ আকারে রাখতে চান তা ফাইল থেকে সিলেক্ট করুন।
                    </p>

                    <input 
                      type="file" 
                      ref={watermarkInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => setLocalWatermarkImg(url), 'পিকচার ওয়াটারমার্ক সফলভাবে সিলেক্ট হয়েছে!')}
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => watermarkInputRef.current?.click()}
                        className="px-4 py-2 bg-[#78988b] hover:bg-[#658276] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>ফাইল থেকে ওয়াটারমার্ক ছবি সিলেক্ট করুন</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setLocalWatermarkImg(defaultScienceStudioLogoSvg);
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                        <span>ডিফল্ট সায়েন্স স্টুডিও লোগো</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Watermark Size (Percentage Slider) & Opacity Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Size Percentage Slider */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ওয়াটারমার্ক সাইজ (Size %):</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {localWatermarkSize}%
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="30"
                    max="180"
                    step="5"
                    value={localWatermarkSize}
                    onChange={(e) => setLocalWatermarkSize(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>ছোট (৩০%)</span>
                    <span>স্বাভাবিক (১০০%)</span>
                    <span>বড় (১৮০%)</span>
                  </div>
                </div>

                {/* Opacity Slider */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>অপাসিটি / ঘনত্ব (Opacity %):</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {Math.round(localWatermarkOpacity * 100)}%
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="0.02"
                    max="0.35"
                    step="0.01"
                    value={localWatermarkOpacity}
                    onChange={(e) => setLocalWatermarkOpacity(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>খুব হালকা (২%)</span>
                    <span>স্ট্যান্ডার্ড (৮%)</span>
                    <span>গাঢ় (৩৫%)</span>
                  </div>
                </div>
              </div>

              {/* Watermark Live Paper Sheet Simulation */}
              <div className="border border-slate-300 rounded-2xl p-4 bg-white shadow-inner space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>প্রশ্নপত্র সিমুলেশন প্রিভিউ (Watermark Live Preview):</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    {localShowWatermark ? 'সক্রিয় অবস্থায় প্রদর্শিত রূপ' : 'নিষ্ক্রিয় (অদৃশ্য)'}
                  </span>
                </div>

                <div className="h-44 border border-slate-200 rounded-xl relative overflow-hidden bg-slate-50 flex flex-col justify-between p-3 select-none">
                  {/* Watermark in Center */}
                  {localShowWatermark && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-200"
                      style={{ opacity: localWatermarkOpacity }}
                    >
                      <img 
                        src={localWatermarkImg || defaultScienceStudioLogoSvg} 
                        alt="Watermark Simulation" 
                        style={{
                          width: `${(localWatermarkSize / 100) * 110}px`,
                          height: `${(localWatermarkSize / 100) * 110}px`,
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  )}

                  {/* Dummy Question Lines */}
                  <div className="relative z-10 text-center border-b border-slate-300 pb-1">
                    <p className="text-[11px] font-bold text-slate-900">{formData.nameBn || 'কলাবাড়িয়া মডেল একাডেমি ও কোচিং সেন্টার'}</p>
                    <p className="text-[9px] text-slate-600">মডেল টেস্ট মূল্যায়ন পরীক্ষা - ২০২৬ | বিষয়: পদার্থবিজ্ঞান</p>
                  </div>
                  <div className="relative z-10 space-y-1.5 text-[9.5px] text-slate-700 py-1">
                    <p>১. নিচের কোনটি ভেক্টর রাশি? (ক) দ্রুতি (খ) সরণ (গ) ভর (ঘ) তাপমাত্রা</p>
                    <p>২. শক্তির মাত্রা সমীকরণ কোনটি? (ক) [ML²T⁻²] (খ) [MLT⁻¹] (গ) [ML²T⁻³]</p>
                    <p>৩. নিউটনের গতির ২য় সূত্র অনুযায়ী বল ও ত্বরণের সম্পর্ক ব্যাখ্যা কর।</p>
                  </div>
                  <div className="relative z-10 text-right border-t border-slate-200 pt-1 text-[9px] text-slate-400">
                    [পৃষ্ঠা ১/৪]
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: Official Codes & Board */}
          {activeSubTab === 'codes' && (
            <div className="bg-white p-6 rounded-2xl border border-[#c0dfe1] shadow-xs space-y-5">
              <div className="border-b border-[#c0dfe1] pb-3">
                <h3 className="text-sm font-bold text-[#1f332c] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#78988b]" />
                  <span>অফিসিয়াল আইডেন্টিফায়ার, EIIN ও শিক্ষা বোর্ড</span>
                </h3>
                <p className="text-xs text-[#53685e] mt-0.5">
                  বোর্ড ও সরকারি একাডেমিক নথিপত্রে যেসকল কোড প্রদর্শন আবশ্যক, সেগুলো এখান থেকে কনফিগার করুন।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড (Board):
                  </label>
                  <select
                    value={formData.boardName || 'কুমিল্লা শিক্ষা বোর্ড'}
                    onChange={e => setFormData({ ...formData, boardName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-[#1f332c] border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none"
                  >
                    <option value="কুমিল্লা শিক্ষা বোর্ড">কুমিল্লা শিক্ষা বোর্ড (Cumilla Board)</option>
                    <option value="ঢাকা শিক্ষা বোর্ড">ঢাকা শিক্ষা বোর্ড (Dhaka Board)</option>
                    <option value="চট্টগ্রাম শিক্ষা বোর্ড">চট্টগ্রাম শিক্ষা বোর্ড (Chattogram Board)</option>
                    <option value="রাজশাহী শিক্ষা বোর্ড">রাজশাহী শিক্ষা বোর্ড (Rajshahi Board)</option>
                    <option value="যশোর শিক্ষা বোর্ড">যশোর শিক্ষা বোর্ড (Jashore Board)</option>
                    <option value="বরিশাল শিক্ষা বোর্ড">বরিশাল শিক্ষা বোর্ড (Barishal Board)</option>
                    <option value="সিলেট শিক্ষা বোর্ড">সিলেট শিক্ষা বোর্ড (Sylhet Board)</option>
                    <option value="দিনাজপুর শিক্ষা বোর্ড">দিনাজপুর শিক্ষা বোর্ড (Dinajpur Board)</option>
                    <option value="ময়মনসিংহ শিক্ষা বোর্ড">ময়মনসিংহ শিক্ষা বোর্ড (Mymensingh Board)</option>
                    <option value="বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড">বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড</option>
                    <option value="বাংলাদেশ কারিগরি শিক্ষা বোর্ড">বাংলাদেশ কারিগরি শিক্ষা বোর্ড</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    EIIN নম্বর:
                  </label>
                  <input
                    type="text"
                    value={formData.eiin || '১৩৪৫৮৯'}
                    onChange={e => setFormData({ ...formData, eiin: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                    placeholder="১৩৪৫৮৯"
                  />
                  <span className="text-[11px] text-[#53685e] mt-1 block">
                    রেজাল্ট শিট, এডমিট কার্ড ও সনদে প্রদর্শিত হয়।
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    EMIS কোড নং:
                  </label>
                  <input
                    type="text"
                    value={formData.emisNo}
                    onChange={e => setFormData({ ...formData, emisNo: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    IPEMIS রেজিস্ট্রেশন কোড:
                  </label>
                  <input
                    type="text"
                    value={formData.ipemisCode}
                    onChange={e => setFormData({ ...formData, ipemisCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    সক্রিয় শিক্ষাবর্ষ:
                  </label>
                  <input
                    type="text"
                    defaultValue="২০২৬ খ্রি."
                    className="w-full px-3.5 py-2.5 text-xs font-bold border border-[#c0dfe1] rounded-xl bg-[#eae8d9]/40 text-[#1f332c]"
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Address & Contact */}
          {activeSubTab === 'contact' && (
            <div className="bg-white p-6 rounded-2xl border border-[#c0dfe1] shadow-xs space-y-5">
              <div className="border-b border-[#c0dfe1] pb-3">
                <h3 className="text-sm font-bold text-[#1f332c] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#78988b]" />
                  <span>ঠিকানা ও অফিসিয়াল যোগাযোগ নম্বর</span>
                </h3>
                <p className="text-xs text-[#53685e] mt-0.5">
                  আইডি কার্ড, সনদপত্র ও প্রশ্নপত্রের ঠিকানায় এই তথ্য ব্যবহৃত হবে।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    গ্রাম / এলাকা / হোল্ডিং:
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={e => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    ডাকঘর / পোস্ট অফিস:
                  </label>
                  <input
                    type="text"
                    value={formData.postOffice}
                    onChange={e => setFormData({ ...formData, postOffice: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    উপজেলা / থানা:
                  </label>
                  <input
                    type="text"
                    value={formData.upazila}
                    onChange={e => setFormData({ ...formData, upazila: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    জেলা:
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    অফিসিয়াল মোবাইল নং:
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    অফিসিয়াল ইমেইল:
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-sans border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    ওয়েবসাইট / ওয়েব পোর্টাল ইউআরএল:
                  </label>
                  <input
                    type="text"
                    value={formData.website || 'www.kolabaria-academy.edu.bd'}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-sans border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Director Profile & Photo Upload (Sakib Ahmed) */}
          {activeSubTab === 'profile' && (
            <div className="bg-white p-6 rounded-2xl border border-[#c0dfe1] shadow-xs space-y-6">
              <div className="border-b border-[#c0dfe1] pb-3">
                <h3 className="text-sm font-bold text-[#1f332c] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>ডিরেক্টর প্রোফাইল ও ফটো আপলোড (Director Profile - Sakib Ahmed)</span>
                </h3>
                <p className="text-xs text-[#53685e] mt-0.5">
                  টপ হেডারের গোল প্রোফাইল আইকনে পরিচালকের ছবি ও পরিচিতি প্রদর্শিত হয়। এখান থেকে সরাসরি ফাইল আপলোড করুন।
                </p>
              </div>

              {/* Round Avatar and Upload Area */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-gradient-to-br from-slate-900 to-[#0e271c] text-white rounded-2xl border-2 border-[#d4af37]/60 shadow-lg">
                {/* Circular Profile Avatar */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-full ring-4 ring-[#d4af37] p-1 overflow-hidden bg-[#07130e] flex items-center justify-center shadow-xl">
                    <img 
                      src={directorProfile.avatarUrl || "/src/assets/images/admin_avatar_1791955080118.jpg"} 
                      alt="Sakib Ahmed"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-[#0e271c] rounded-full shadow-[0_0_8px_#10b981]"></span>
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div>
                    <h4 className="text-lg font-black text-white font-sans tracking-wide">{directorProfile.name}</h4>
                    <p className="text-xs text-amber-300 font-semibold font-sans">{directorProfile.role} • Science Studio</p>
                    <p className="text-[11px] text-emerald-200/80 mt-1">{directorProfile.bio}</p>
                  </div>

                  <input 
                    type="file" 
                    ref={directorAvatarInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => {
                      setDirectorProfile(prev => ({ ...prev, avatarUrl: url }));
                    }, 'ডিরেক্টর প্রোফাইল ছবি সফলভাবে আপলোড হয়েছে!')}
                  />

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => directorAvatarInputRef.current?.click()}
                      className="px-4 py-2 bg-[#d4af37] hover:bg-[#c29f2f] text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>ফাইল থেকে প্রোফাইল ছবি পরিবর্তন করুন</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    পরিচালকের নাম (Director Name):
                  </label>
                  <input
                    type="text"
                    value={directorProfile.name}
                    onChange={e => setDirectorProfile({ ...directorProfile, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-bold border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                    placeholder="Sakib Ahmed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    পদবি (Designation):
                  </label>
                  <input
                    type="text"
                    value={directorProfile.role}
                    onChange={e => setDirectorProfile({ ...directorProfile, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-bold border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                    placeholder="Founder & Director"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    ইমেইল (Director Email):
                  </label>
                  <input
                    type="email"
                    value={directorProfile.email}
                    onChange={e => setDirectorProfile({ ...directorProfile, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                    placeholder="director@sciencestudio.edu.bd"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    ফোন নম্বর (Hotline / Direct):
                  </label>
                  <input
                    type="text"
                    value={directorProfile.phone}
                    onChange={e => setDirectorProfile({ ...directorProfile, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                    placeholder="০১৭১১-XXXXXX"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    সংক্ষিপ্ত পরিচিতি (Short Bio):
                  </label>
                  <textarea
                    rows={2}
                    value={directorProfile.bio}
                    onChange={e => setDirectorProfile({ ...directorProfile, bio: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Notices Management inside Settings */}
          {activeSubTab === 'notices' && (
            <div className="space-y-4">
              <NoticesView />
            </div>
          )}

          {/* TAB 8: Security & PIN Code */}
          {activeSubTab === 'security' && (
            <div className="bg-white p-6 rounded-2xl border border-[#c0dfe1] shadow-xs space-y-5">
              <div className="border-b border-[#c0dfe1] pb-3">
                <h3 className="text-sm font-bold text-[#1f332c] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-600" />
                  <span>সিস্টেম নিরাপত্তা ও স্ক্রিন লক পিন কোড পরিবর্তন</span>
                </h3>
                <p className="text-xs text-[#53685e] mt-0.5">
                  সাইডবারের "সিস্টেম লক করুন" বাটনে ক্লিক করলে যে পাসওয়ার্ড/পিন চাইবে, তা এখান থেকে নিজের ইচ্ছামতো পরিবর্তন করতে পারবেন।
                </p>
              </div>

              {pinSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>পিন কোড সফলভাবে পরিবর্তন হয়েছে! পরবর্তী লগইনে নতুন পিন কার্যকর হবে।</span>
                </div>
              )}

              {pinError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <form onSubmit={handlePinChangeSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    বর্তমান / পুরাতন পিন কোড:
                  </label>
                  <input
                    type="password"
                    value={oldPin}
                    onChange={e => setOldPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-rose-500 outline-none text-[#1f332c]"
                    placeholder="ডিফল্ট: Kolabaria2026"
                    required
                  />
                  <span className="text-[10px] text-[#53685e] mt-0.5 block">
                    (ডিফল্ট মাস্টার পিন: Kolabaria2026)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    নতুন পিন কোড (New PIN):
                  </label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                    placeholder="কমপক্ষে ৪ ডিজিট বা অক্ষর"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1f332c] mb-1.5">
                    নতুন পিন নিশ্চিত করুন (Confirm New PIN):
                  </label>
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#c0dfe1] rounded-xl bg-white focus:ring-1 focus:ring-[#749fa0] outline-none text-[#1f332c]"
                    placeholder="পুনরায় টাইপ করুন"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#78988b] hover:bg-[#658276] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition active:scale-95"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>পিন কোড আপডেট করুন</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 8: Backup & Factory Reset */}
          {activeSubTab === 'backup' && (
            <div className="bg-white p-6 rounded-2xl border border-[#c0dfe1] shadow-xs space-y-5">
              <div className="border-b border-[#c0dfe1] pb-3">
                <h3 className="text-sm font-bold text-[#1f332c] flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#78988b]" />
                  <span>ডাটা ব্যাকআপ, এক্সপোর্ট ও ফ্যাক্টরি রিসেট</span>
                </h3>
                <p className="text-xs text-[#53685e] mt-0.5">
                  নিরাপত্তার স্বার্থে আপনার প্রতিষ্ঠানের সেটিংস ও ডেটার ব্যাকআপ সংরক্ষণ করতে পারেন।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Export Card */}
                <div className="p-4 rounded-xl border border-[#c0dfe1] bg-[#eae8d9]/40 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-[#1f332c] text-xs">
                    <Download className="w-4 h-4 text-[#78988b]" />
                    <span>সেটিংস ব্যাকআপ ডাউনলোড (JSON)</span>
                  </div>
                  <p className="text-[11px] text-[#53685e]">
                    বর্তমান সেটিংস ও প্রাতিষ্ঠানিক ডেটার একটি অফলাইন ফাইল সংরক্ষণ করতে নিচের বোতাম চাপুন।
                  </p>
                  <button
                    onClick={handleExportData}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#78988b] hover:bg-[#658276] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ব্যাকআপ ফাইল ডাউনলোড করুন</span>
                  </button>
                </div>

                {/* Reset Card */}
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-rose-900 text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>ফ্যাক্টরি রিসেট (Restore Defaults)</span>
                  </div>
                  <p className="text-[11px] text-rose-700">
                    যদি ভুল ডেটা এন্ট্রি হয়ে থাকে এবং প্রাথমিক ডিফল্ট তথ্যে ফিরে যেতে চান, তবে রিসেট করতে পারেন।
                  </p>
                  <button
                    onClick={handleFactoryReset}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ডিফল্ট ডেটায় রিসেট করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Col: Live Synchronized Preview Card */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#c0dfe1] shadow-xs text-center space-y-4">
            <h3 className="text-xs font-bold text-[#53685e] uppercase tracking-wider">
              লাইভ প্রতিষ্ঠানের ব্র্যান্ড প্রিভিউ
            </h3>

            {/* Logo Preview */}
            <div className="w-28 h-28 mx-auto rounded-2xl border-2 border-[#78988b]/40 bg-[#b1c0a1]/20 p-2 flex flex-col items-center justify-center shadow-inner relative group">
              <div className="w-full h-full rounded-xl border border-dashed border-[#78988b] flex flex-col items-center justify-center text-[#78988b] p-1 overflow-hidden">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                ) : (
                  <Award className="w-10 h-10" />
                )}
                <span className="text-[9px] text-[#53685e] mt-0.5 font-mono">
                  স্থাপিত {formData.established || '১৯৯৮'}
                </span>
              </div>
            </div>

            {/* Details Box */}
            <div className="space-y-1.5 bg-[#eae8d9]/40 p-3.5 rounded-xl border border-[#c0dfe1] text-left text-xs">
              <div className="text-[10px] text-[#53685e] font-semibold">প্রতিষ্ঠানের নাম:</div>
              <div className="text-xs font-bold text-[#1f332c] leading-snug">
                {formData.nameBn || 'কলাবাড়িয়া মডেল একাডেমি ও কোচিং সেন্টার'}
              </div>
              <div className="text-[11px] text-[#53685e] font-sans">
                {formData.nameEn || 'Kolabaria Model Academy & Coaching Center'}
              </div>
              
              <div className="pt-1 text-[11px] text-[#53685e]">
                📍 {formData.village || 'কলাবাড়িয়া'}, {formData.upazila || 'সেনবাগ'}, {formData.district || 'নোয়াখালী'}
              </div>
              
              <div className="pt-1.5 border-t border-[#c0dfe1] flex justify-between items-center text-[10px] font-mono text-[#78988b] font-semibold">
                <span>EIIN: {formData.eiin || '১৩৪৫৮৯'}</span>
                <span>{formData.boardName || 'কুমিল্লা বোর্ড'}</span>
              </div>
            </div>

            {/* Signatures status snippet */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-1.5">
              <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <FileSignature className="w-3.5 h-3.5 text-emerald-600" />
                <span>স্বাক্ষর ও সিলমোহর স্ট্যাটাস:</span>
              </div>
              <div className="text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>প্রধান শিক্ষক:</span>
                  <span className={localPrincipalSig ? "text-emerald-700 font-bold" : "text-slate-400"}>
                    {localPrincipalSig ? "আপলোড করা আছে ✓" : "ব্লাঙ্ক"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>পরীক্ষা নিয়ন্ত্রক:</span>
                  <span className={localControllerSig ? "text-emerald-700 font-bold" : "text-slate-400"}>
                    {localControllerSig ? "আপলোড করা আছে ✓" : "ব্লাঙ্ক"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>শ্রেণি শিক্ষক:</span>
                  <span className={localClassTeacherSig ? "text-emerald-700 font-bold" : "text-slate-400"}>
                    {localClassTeacherSig ? "আপলোড করা আছে ✓" : "ব্লাঙ্ক"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ওয়াটারমার্ক:</span>
                  <span className={localShowWatermark ? "text-emerald-700 font-bold" : "text-rose-600"}>
                    {localShowWatermark ? `সক্রিয় (${localWatermarkSize}%)` : "বন্ধ"}
                  </span>
                </div>
              </div>
            </div>

            {/* Verification badge */}
            <div className="p-3 bg-[#b1c0a1]/20 rounded-xl border border-[#b1c0a1] text-left flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#78988b] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#1f332c] leading-relaxed font-medium">
                এখানে সংরক্ষিত তথ্য স্বয়ংক্রিয়ভাবে ক্লাউড ও লোকাল স্টোরেজে সিঙ্ক হয়ে হেডার, সাইডবার ও সকল প্রিন্ট ডকুমেন্টে প্রযোজ্য হবে।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
