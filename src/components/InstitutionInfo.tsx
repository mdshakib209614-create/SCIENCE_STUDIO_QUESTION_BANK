import React, { useState } from 'react';
import { School, Edit3, Save, CheckCircle2, ShieldCheck, MapPin, Phone, Mail, Globe, Image } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InstitutionInfo: React.FC = () => {
  const { institution, updateInstitution } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(institution);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstitution(formData);
    setIsEditing(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6 text-[#1f332c]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#ffffff] p-5 rounded-2xl border border-[#c0dfe1] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#1f332c] flex items-center gap-2">
            <School className="w-5 h-5 text-[#78988b]" />
            <span>বিদ্যালয় / কোচিং প্রতিষ্ঠানের পরিচিতি ও তথ্য</span>
          </h2>
          <p className="text-xs text-[#53685e] mt-0.5">
            প্রত্যয়ন পত্র, রুটিন, প্রবেশপত্র ও আইডি কার্ডে ব্যবহৃত যাবতীয় তথ্যাদি এখান থেকে পরিচালনা করুন
          </p>
        </div>

        <div>
          {isEditing ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-[#749fa0] hover:bg-[#5f8788] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>সংরক্ষণ করুন</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-[#78988b] hover:bg-[#658276] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>তথ্য এডিট করুন</span>
            </button>
          )}
        </div>
      </div>

      {savedMessage && (
        <div className="p-3 bg-[#b1c0a1]/30 border border-[#b1c0a1] text-[#1f332c] rounded-xl text-xs font-medium flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#78988b]" />
          <span>প্রতিষ্ঠানের তথ্য সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      {/* Main Form & Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Info Profile Display / Edit */}
        <div className="lg:col-span-2 bg-[#ffffff] p-6 rounded-2xl border border-[#c0dfe1] shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                  নাম (বাংলা):
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.nameBn}
                    onChange={e => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#749fa0] bg-[#ffffff]"
                    required
                  />
                ) : (
                  <p className="text-sm font-semibold text-[#1f332c] bg-[#eae8d9]/50 p-2.5 rounded-lg border border-[#c0dfe1]/50">
                    {institution.nameBn}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                  Name (English):
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#749fa0] bg-[#ffffff]"
                    required
                  />
                ) : (
                  <p className="text-sm font-semibold text-[#1f332c] bg-[#eae8d9]/50 p-2.5 rounded-lg border border-[#c0dfe1]/50">
                    {institution.nameEn}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                  গ্রাম / এলাকা:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.village}
                    onChange={e => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#749fa0] bg-[#ffffff]"
                  />
                ) : (
                  <p className="text-xs text-[#1f332c] bg-[#eae8d9]/50 p-2.5 rounded-lg border border-[#c0dfe1]/50">
                    {institution.village}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                  পোস্ট অফিস:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.postOffice}
                    onChange={e => setFormData({ ...formData, postOffice: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#749fa0] bg-[#ffffff]"
                  />
                ) : (
                  <p className="text-xs text-[#1f332c] bg-[#eae8d9]/50 p-2.5 rounded-lg border border-[#c0dfe1]/50">
                    {institution.postOffice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                  উপজেলা / থানা:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.upazila}
                    onChange={e => setFormData({ ...formData, upazila: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#749fa0] bg-[#ffffff]"
                  />
                ) : (
                  <p className="text-xs text-[#1f332c] bg-[#eae8d9]/50 p-2.5 rounded-lg border border-[#c0dfe1]/50">
                    {institution.upazila}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                  জেলা:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#749fa0] bg-[#ffffff]"
                  />
                ) : (
                  <p className="text-xs text-[#1f332c] bg-[#eae8d9]/50 p-2.5 rounded-lg border border-[#c0dfe1]/50">
                    {institution.district}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                  স্থাপিত সন:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.established}
                    onChange={e => setFormData({ ...formData, established: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#749fa0] bg-[#ffffff]"
                  />
                ) : (
                  <p className="text-xs font-mono text-[#1f332c] bg-[#eae8d9]/50 p-2.5 rounded-lg border border-[#c0dfe1]/50">
                    {institution.established}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                  EMIS No / রেজিস্ট্রেশন:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.emisNo}
                    onChange={e => setFormData({ ...formData, emisNo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#749fa0] bg-[#ffffff] font-mono"
                  />
                ) : (
                  <p className="text-xs font-mono text-[#1f332c] bg-[#eae8d9]/50 p-2.5 rounded-lg border border-[#c0dfe1]/50">
                    {institution.emisNo}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                  IPEMIS Code / EIIN:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.ipemisCode}
                    onChange={e => setFormData({ ...formData, ipemisCode: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#749fa0] bg-[#ffffff] font-mono"
                  />
                ) : (
                  <p className="text-xs font-mono text-[#1f332c] bg-[#eae8d9]/50 p-2.5 rounded-lg border border-[#c0dfe1]/50">
                    {institution.ipemisCode}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                  যোগাযোগ মোবাইল নং:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#749fa0] bg-[#ffffff] font-mono"
                  />
                ) : (
                  <p className="text-xs font-mono text-[#1f332c] bg-[#eae8d9]/50 p-2.5 rounded-lg border border-[#c0dfe1]/50">
                    {institution.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-[#c0dfe1]/60 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                  প্রধান শিক্ষক / পরিচালকের নাম:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.headmasterName}
                    onChange={e => setFormData({ ...formData, headmasterName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#749fa0] bg-[#ffffff]"
                  />
                ) : (
                  <p className="text-xs font-semibold text-[#1f332c] bg-[#eae8d9]/50 p-2.5 rounded-lg border border-[#c0dfe1]/50">
                    {institution.headmasterName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f332c] mb-1">
                  পদবি (স্বাক্ষর ব্লকের জন্য):
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.headmasterTitle}
                    onChange={e => setFormData({ ...formData, headmasterTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#749fa0] bg-[#ffffff]"
                  />
                ) : (
                  <p className="text-xs text-[#1f332c] bg-[#eae8d9]/50 p-2.5 rounded-lg border border-[#c0dfe1]/50">
                    {institution.headmasterTitle}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right: Official Logo / Seal Preview */}
        <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#c0dfe1] shadow-xs flex flex-col items-center text-center">
          <h3 className="text-sm font-bold text-[#1f332c] mb-4">লোগো ও সিলমোহর প্রিভিউ</h3>

          <div className="w-36 h-36 rounded-full border-4 border-[#78988b]/40 bg-[#b1c0a1]/20 p-3 flex flex-col items-center justify-center shadow-inner relative group">
            <div className="w-full h-full rounded-full border-2 border-dashed border-[#78988b] flex flex-col items-center justify-center text-[#1f332c] p-2">
              <School className="w-8 h-8 text-[#78988b] mb-1" />
              <span className="text-[10px] font-bold leading-none">মডেল একাডেমি</span>
              <span className="text-[9px] text-[#53685e] mt-1 font-mono">স্থাপিত {institution.established}</span>
            </div>
          </div>

          <div className="mt-5 space-y-1 w-full bg-[#eae8d9]/60 p-3 rounded-xl border border-[#c0dfe1]">
            <p className="text-xs font-bold text-[#1f332c]">{institution.nameBn}</p>
            <p className="text-[11px] text-[#53685e]">{institution.nameEn}</p>
            <p className="text-[10px] text-[#53685e]">
              {institution.village}, {institution.upazila}, {institution.district}
            </p>
            <p className="text-[10px] font-mono text-[#78988b] font-semibold mt-1">
              EMIS: {institution.emisNo} | IPEMIS: {institution.ipemisCode}
            </p>
          </div>

          <div className="mt-4 w-full text-left space-y-2 text-xs text-[#1f332c] bg-[#b1c0a1]/25 p-3 rounded-xl border border-[#b1c0a1]">
            <div className="font-semibold text-[#1f332c] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#78988b]" />
              <span>স্বয়ংক্রিয় সিঙ্ক তথ্য</span>
            </div>
            <p className="text-[11px] text-[#53685e] leading-relaxed">
              এখানে পরিবর্তিত যেকোনো তথ্য স্বয়ংক্রিয়ভাবে সকল শিক্ষার্থীর আইডি কার্ড, পরীক্ষার রুটিন, প্রবেশপত্র এবং প্রত্যয়ন পত্রে আপডেট হয়ে যাবে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
