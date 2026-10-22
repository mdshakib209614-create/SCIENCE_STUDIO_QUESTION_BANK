import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Notice } from '../types';
import { toBengaliNumber } from '../utils/bengaliUtils';

export const NoticesView: React.FC = () => {
  const { notices, addNotice, deleteNotice, institution } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);

  const emergencyNotice = notices.find(n => n.isEmergency) || notices[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addNotice({
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      isEmergency,
      publishedBy: institution.headmasterTitle || 'প্রধান শিক্ষক ও পরিচালক',
    });

    setTitle('');
    setContent('');
    setIsEmergency(false);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-[#1f332c]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#ffffff] p-5 rounded-2xl border border-[#c0dfe1] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#1f332c] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#78988b]" />
            <span>নোটিশ বোর্ড ও জরুরি ঘোষণা</span>
          </h2>
          <p className="text-xs text-[#53685e] mt-0.5">
            শিক্ষক, শিক্ষার্থী ও অভিভাবকদের জন্য সকল প্রাতিষ্ঠানিক নোটিশ
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#78988b] hover:bg-[#658276] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন নোটিশ প্রকাশ করুন</span>
        </button>
      </div>

      {/* Emergency Ticker Control */}
      {emergencyNotice && (
        <div className="bg-[#b1c0a1]/25 border border-[#b1c0a1] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#78988b] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-[#1f332c]">চলমান জরুরি নোটিশ:</h4>
              <p className="text-xs text-[#53685e] font-medium">{emergencyNotice.title}</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-[#78988b] hover:bg-[#658276] text-white text-xs font-semibold rounded-lg shrink-0 transition cursor-pointer shadow-xs"
          >
            নতুন জরুরি নোটিশ দিন
          </button>
        </div>
      )}

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map(notice => (
          <div
            key={notice.id}
            className="bg-[#ffffff] p-5 rounded-2xl border border-[#c0dfe1] shadow-xs hover:border-[#749fa0] transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  {notice.isEmergency && (
                    <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      জরুরি
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-[#1f332c]">{notice.title}</h3>
                </div>

                <p className="text-xs text-[#53685e] leading-relaxed whitespace-pre-line">
                  {notice.content}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-[#53685e]/80 font-mono pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#749fa0]" />
                    <span>প্রকাশের তারিখ: {notice.date}</span>
                  </span>
                  <span>প্রকাশক: {notice.publishedBy}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm('আপনি কি নিশ্চিত এই নোটিশটি মুছে ফেলতে চান?')) {
                    deleteNotice(notice.id);
                  }
                }}
                className="p-1.5 text-[#53685e] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                title="মুছুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1c2d26]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#c0dfe1]">
            <div className="flex items-center justify-between pb-3 border-b border-[#c0dfe1]">
              <h3 className="text-sm font-bold text-[#1f332c] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#78988b]" />
                <span>নতুন প্রাতিষ্ঠানিক নোটিশ প্রকাশ</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#53685e] hover:text-[#1f332c]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[#1f332c] font-semibold mb-1">নোটিশের শিরোনাম: *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2 border border-[#c0dfe1] rounded-lg focus:ring-1 focus:ring-[#749fa0] bg-[#ffffff] outline-none text-[#1f332c]"
                  placeholder="যেমন: ৩য় প্রান্তিক মূল্যায়নের সময়সূচি প্রকাশ প্রসঙ্গে"
                />
              </div>

              <div>
                <label className="block text-[#1f332c] font-semibold mb-1">বিস্তারিত বিবরণ: *</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full p-2 border border-[#c0dfe1] rounded-lg focus:ring-1 focus:ring-[#749fa0] bg-[#ffffff] outline-none text-[#1f332c]"
                  placeholder="নোটিশের বিস্তারিত অংশ এখানে লিখুন..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="emergencyCheck"
                  checked={isEmergency}
                  onChange={e => setIsEmergency(e.target.checked)}
                  className="rounded text-[#78988b] focus:ring-[#78988b]"
                />
                <label htmlFor="emergencyCheck" className="text-[#1f332c] font-semibold cursor-pointer">
                  জরুরি নোটিশ হিসেবে হেডার বারে হাইলাইট করুন
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#c0dfe1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#53685e] hover:bg-[#eae8d9] rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-[#78988b] hover:bg-[#658276] text-white rounded-xl shadow-xs cursor-pointer"
                >
                  প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
