import React, { useState } from 'react';
import { 
  PlusCircle, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Layers, 
  Sparkles, 
  Trash2, 
  ArrowRight, 
  Check, 
  Tag, 
  Award,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuestionItem, MCQQuestion, CQQuestion, ShortQuestion } from '../types';
import { subjectsList, chaptersBySubject, classesList, getChaptersForClassAndSubject } from '../data/chaptersData';

export const AddQuestionView: React.FC = () => {
  const { addCustomQuestion, questions, deleteQuestion, setActiveTab, setExamNavIntent } = useApp();

  // Selected Class, Subject & Chapter
  const [targetClass, setTargetClass] = useState<string>('৯ম-১০ম শ্রেণি');
  const [selectedSubject, setSelectedSubject] = useState<string>(subjectsList[0]);
  const [selectedChapter, setSelectedChapter] = useState<string>(
    chaptersBySubject[subjectsList[0]]?.[0] || 'সাধারণ ও বিবিধ'
  );
  const [customChapterName, setCustomChapterName] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [boardInfo, setBoardInfo] = useState<string>('');
  const [importance, setImportance] = useState<'standard' | 'high' | 'very_high'>('high');

  // Format: 'mcq' | 'cq' | 'short'
  const [format, setFormat] = useState<'mcq' | 'cq' | 'short'>('mcq');

  // MCQ state
  const [mcqQuestion, setMcqQuestion] = useState<string>('');
  const [mcqOptions, setMcqOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState<0 | 1 | 2 | 3>(0);
  const [mcqExplanation, setMcqExplanation] = useState<string>('');
  const [mcqMarks, setMcqMarks] = useState<number>(1);

  // CQ state
  const [cqStimulus, setCqStimulus] = useState<string>('');
  const [cqA, setCqA] = useState<string>('');
  const [cqB, setCqB] = useState<string>('');
  const [cqC, setCqC] = useState<string>('');
  const [cqD, setCqD] = useState<string>('');

  // Short Question state
  const [shortQuestion, setShortQuestion] = useState<string>('');
  const [shortAnswer, setShortAnswer] = useState<string>('');
  const [shortMarks, setShortMarks] = useState<number>(1);

  // Success Notification
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const availableChapters = getChaptersForClassAndSubject(targetClass, selectedSubject);

  // When subject changes, reset chapter
  const handleSubjectChange = (subj: string) => {
    setSelectedSubject(subj);
    const chapters = getChaptersForClassAndSubject(targetClass, subj);
    setSelectedChapter(chapters[0] || 'সাধারণ ও বিবিধ');
    setCustomChapterName('');
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const finalChapter = customChapterName.trim() || selectedChapter;

    if (format === 'mcq') {
      if (!mcqQuestion.trim()) {
        alert('দয়া করে এমসিকিউ প্রশ্ন বা উদ্দীপকটি টাইপ করুন!');
        return;
      }
      if (mcqOptions.some(opt => !opt.trim())) {
        alert('দয়া করে ক, খ, গ, ঘ চারটি অপশনেরই মান পূরণ করুন!');
        return;
      }

      const item: MCQQuestion = {
        id: `custom-mcq-${Date.now()}`,
        subject: selectedSubject,
        chapter: finalChapter,
        targetClass,
        topic: topic.trim() || undefined,
        question: mcqQuestion.trim(),
        options: [mcqOptions[0].trim(), mcqOptions[1].trim(), mcqOptions[2].trim(), mcqOptions[3].trim()],
        correctOption,
        explanation: mcqExplanation.trim() || undefined,
        marks: mcqMarks || 1,
        type: 'mcq',
        boardInfo: boardInfo.trim() || undefined,
        importance
      };

      addCustomQuestion(item);
      setMcqQuestion('');
      setMcqOptions(['', '', '', '']);
      setMcqExplanation('');
      setSuccessMessage('এমসিকিউ প্রশ্নটি সফলভাবে প্রশ্ন ব্যাংকে যুক্ত হয়েছে!');
    } else if (format === 'cq') {
      if (!cqStimulus.trim()) {
        alert('দয়া করে সিকিউ প্রশ্নের উদ্দীপকটি লিখুন!');
        return;
      }
      if (!cqA.trim() || !cqB.trim() || !cqC.trim() || !cqD.trim()) {
        alert('দয়া করে ক, খ, গ, ঘ চারটি উপ-প্রশ্নই পূরণ করুন!');
        return;
      }

      const item: CQQuestion = {
        id: `custom-cq-${Date.now()}`,
        subject: selectedSubject,
        chapter: finalChapter,
        targetClass,
        stimulus: cqStimulus.trim(),
        subQuestions: [
          { label: 'ক', question: cqA.trim(), marks: 1 },
          { label: 'খ', question: cqB.trim(), marks: 2 },
          { label: 'গ', question: cqC.trim(), marks: 3 },
          { label: 'ঘ', question: cqD.trim(), marks: 4 }
        ],
        marks: 10,
        type: 'cq',
        boardInfo: boardInfo.trim() || undefined,
        importance
      };

      addCustomQuestion(item);
      setCqStimulus('');
      setCqA('');
      setCqB('');
      setCqC('');
      setCqD('');
      setSuccessMessage('সৃজনশীল প্রশ্নটি (CQ) সফলভাবে প্রশ্ন ব্যাংকে যুক্ত হয়েছে!');
    } else if (format === 'short') {
      if (!shortQuestion.trim()) {
        alert('দয়া করে সংক্ষিপ্ত প্রশ্নটি লিখুন!');
        return;
      }

      const item: ShortQuestion = {
        id: `custom-short-${Date.now()}`,
        subject: selectedSubject,
        chapter: finalChapter,
        targetClass,
        topic: topic.trim() || undefined,
        question: shortQuestion.trim(),
        answer: shortAnswer.trim() || undefined,
        marks: shortMarks || 1,
        type: 'short',
        boardInfo: boardInfo.trim() || undefined,
        importance
      };

      addCustomQuestion(item);
      setShortQuestion('');
      setShortAnswer('');
      setSuccessMessage('সংক্ষিপ্ত প্রশ্নটি সফলভাবে প্রশ্ন ব্যাংকে যুক্ত হয়েছে!');
    }

    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  // Recently added custom questions
  const userAddedQuestions = questions.filter(q => q.id.startsWith('custom-'));

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 text-[#1f332c]">
      {/* Top Banner */}
      <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#c0dfe1] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#b1c0a1]/30 border border-[#b1c0a1] flex items-center justify-center text-[#78988b] shrink-0 shadow-2xs">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#1f332c]">
                প্রশ্নপত্র অ্যাড (Add New Question)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#b1c0a1]/40 text-[#1f332c] border border-[#b1c0a1]">
                প্রশ্ন ইনপুট
              </span>
            </div>
            <p className="text-xs text-[#53685e] mt-1">
              এমসিকিউ, সিকিউ এবং শর্ট কোশ্চেন ফরম্যাটে আপনার ইচ্ছামতো প্রশ্ন তৈরি করে বিষয়ের অধ্যায়ে যুক্ত করুন।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('question-bank')}
            className="px-3.5 py-2 bg-[#eae8d9]/70 hover:bg-[#b1c0a1]/30 border border-[#c0dfe1] text-[#1f332c] rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-[#78988b]" />
            <span>প্রশ্ন ব্যাংক দেখুন</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setExamNavIntent({ subject: selectedSubject, tab: 'builder' });
              setActiveTab('exam-questions');
            }}
            className="px-4 py-2 bg-[#78988b] hover:bg-[#658276] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>প্রশ্নপত্র তৈরি করুন</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="bg-[#b1c0a1]/30 border border-[#b1c0a1] text-[#1f332c] px-4 py-3 rounded-xl flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#78988b] shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-[#53685e] hover:text-[#1f332c] text-xs font-semibold cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleAddQuestion} className="bg-[#ffffff] p-6 rounded-2xl border border-[#c0dfe1] shadow-xs space-y-6">
        
        {/* Step 1: Dropdowns for Subject & Chapter Selection */}
        <div className="bg-[#eae8d9]/50 p-4 rounded-xl border border-[#c0dfe1] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1f332c]">
            <Tag className="w-4 h-4 text-[#78988b]" />
            <span>১. বিষয় ও অধ্যায় নির্বাচন করুন (Select Subject & Chapter):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Class Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-[#1f332c] mb-1">
                শ্রেণি নির্বাচন:
              </label>
              <select
                value={targetClass}
                onChange={e => {
                  const newCls = e.target.value;
                  setTargetClass(newCls);
                  const chs = getChaptersForClassAndSubject(newCls, selectedSubject);
                  setSelectedChapter(chs[0] || 'সাধারণ ও বিবিধ');
                }}
                className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] font-bold text-[#1f332c] focus:border-[#749fa0] outline-none"
              >
                {classesList.filter(c => c !== 'সব শ্রেণি').map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {/* Subject Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-[#1f332c] mb-1">
                বিষয় নির্বাচন:
              </label>
              <select
                value={selectedSubject}
                onChange={e => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] font-bold text-[#1f332c] focus:border-[#749fa0] outline-none"
              >
                {subjectsList.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>

            {/* Chapter Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-[#1f332c] mb-1">
                অধ্যায় নির্বাচন:
              </label>
              <select
                value={selectedChapter}
                onChange={e => {
                  setSelectedChapter(e.target.value);
                  setCustomChapterName('');
                }}
                className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] font-semibold text-[#1f332c] focus:border-[#749fa0] outline-none"
              >
                {availableChapters.map(ch => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
                <option value="__custom__">➕ নতুন অধ্যায়ের নাম লিখুন...</option>
              </select>
            </div>

            {/* If custom chapter selected */}
            {selectedChapter === '__custom__' && (
              <div>
                <label className="block text-[11px] font-bold text-[#78988b] mb-1">
                  নতুন অধ্যায়ের নাম টাইপ করুন:
                </label>
                <input
                  type="text"
                  value={customChapterName}
                  onChange={e => setCustomChapterName(e.target.value)}
                  placeholder="যেমন: পরিপাক ও শোষণ"
                  className="w-full px-3 py-2 text-xs border border-[#78988b] rounded-xl bg-[#ffffff] font-semibold text-[#1f332c] focus:border-[#749fa0] outline-none"
                  required
                />
              </div>
            )}

            {/* Topic (optional) */}
            <div>
              <label className="block text-[11px] font-semibold text-[#53685e] mb-1">
                টপিক / বিষয়বস্তু (ঐচ্ছিক):
              </label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="যেমন: ওহমের সূত্র"
                className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] text-[#1f332c] outline-none"
              />
            </div>

            {/* Board and Year Tag */}
            <div>
              <label className="block text-[11px] font-semibold text-[#53685e] mb-1">
                বোর্ড ও সন (ঐচ্ছিক):
              </label>
              <input
                type="text"
                value={boardInfo}
                onChange={e => setBoardInfo(e.target.value)}
                placeholder="যেমন: ঢাকা বোর্ড '২৩ বা কমন"
                className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] text-[#1f332c] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 2: 3 Question Formats Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-[#1f332c]">
            ২. প্রশ্নপত্রের ফরম্যাট সিলেক্ট করুন (Select Format):
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFormat('mcq')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                format === 'mcq'
                  ? 'border-[#749fa0] bg-[#c0dfe1]/30 ring-2 ring-[#749fa0]/40'
                  : 'border-[#c0dfe1] bg-[#eae8d9]/40 hover:bg-[#b1c0a1]/25'
              }`}
            >
              <div>
                <div className="font-bold text-xs text-[#1f332c] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#749fa0]" />
                  <span>১. এমসিকিউ (MCQ)</span>
                </div>
                <div className="text-[11px] text-[#53685e] mt-1">
                  ক, খ, গ, ঘ চার অপশন বিশিষ্ট বহুনির্বাচনী
                </div>
              </div>
              {format === 'mcq' && <Check className="w-4 h-4 text-[#749fa0]" />}
            </button>

            <button
              type="button"
              onClick={() => setFormat('cq')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                format === 'cq'
                  ? 'border-[#78988b] bg-[#b1c0a1]/30 ring-2 ring-[#78988b]/40'
                  : 'border-[#c0dfe1] bg-[#eae8d9]/40 hover:bg-[#b1c0a1]/25'
              }`}
            >
              <div>
                <div className="font-bold text-xs text-[#1f332c] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#78988b]" />
                  <span>২. সিকিউ (CQ সৃজনশীল)</span>
                </div>
                <div className="text-[11px] text-[#53685e] mt-1">
                  উদ্দীপক সহ ক, খ, গ, ঘ ৪টি উপ-প্রশ্ন
                </div>
              </div>
              {format === 'cq' && <Check className="w-4 h-4 text-[#78988b]" />}
            </button>

            <button
              type="button"
              onClick={() => setFormat('short')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                format === 'short'
                  ? 'border-[#749fa0] bg-[#c0dfe1]/30 ring-2 ring-[#749fa0]/40'
                  : 'border-[#c0dfe1] bg-[#eae8d9]/40 hover:bg-[#b1c0a1]/25'
              }`}
            >
              <div>
                <div className="font-bold text-xs text-[#1f332c] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#749fa0]" />
                  <span>৩. সংক্ষিপ্ত প্রশ্ন (Short Q)</span>
                </div>
                <div className="text-[11px] text-[#53685e] mt-1">
                  এক কথায় উত্তর বা ২ নম্বরের সংক্ষিপ্ত প্রশ্ন
                </div>
              </div>
              {format === 'short' && <Check className="w-4 h-4 text-[#749fa0]" />}
            </button>
          </div>
        </div>

        {/* Step 3: Format-Specific Fields */}
        {/* A. MCQ Fields */}
        {format === 'mcq' && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#1f332c] mb-1">
                এমসিকিউ প্রশ্ন টাইপ করুন: <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={mcqQuestion}
                onChange={e => setMcqQuestion(e.target.value)}
                placeholder="যেমন: আন্তর্জাতিক পদ্ধতিতে দীপন তীব্রতার একক কোনটি?"
                className="w-full p-3 border border-[#c0dfe1] rounded-xl text-xs focus:ring-1 focus:ring-[#749fa0] focus:border-[#749fa0] leading-relaxed font-medium bg-[#ffffff]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1f332c]">
                চারটি অপশন এবং সঠিক উত্তর টিক দিন:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['ক', 'খ', 'গ', 'ঘ'] as const).map((label, idx) => (
                  <div 
                    key={label}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                      correctOption === idx 
                        ? 'border-[#78988b] bg-[#b1c0a1]/25 ring-1 ring-[#78988b]' 
                        : 'border-[#c0dfe1] bg-[#ffffff]'
                    }`}
                  >
                    <input
                      type="radio"
                      id={`opt-${idx}`}
                      name="correctOptionRadio"
                      checked={correctOption === idx}
                      onChange={() => setCorrectOption(idx as 0 | 1 | 2 | 3)}
                      className="w-4 h-4 text-[#78988b] cursor-pointer"
                    />
                    <label htmlFor={`opt-${idx}`} className="text-xs font-bold text-[#1f332c] shrink-0 cursor-pointer">
                      ({label})
                    </label>
                    <input
                      type="text"
                      value={mcqOptions[idx]}
                      onChange={e => {
                        const next = [...mcqOptions] as [string, string, string, string];
                        next[idx] = e.target.value;
                        setMcqOptions(next);
                      }}
                      placeholder={`অপশন ${label} লিখুন...`}
                      className="w-full px-2.5 py-1 text-xs border border-[#c0dfe1] rounded-lg focus:border-[#749fa0] bg-[#ffffff]"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-[#53685e] mb-1">
                  ব্যাখ্যা / সহায়ক তথ্য (ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  value={mcqExplanation}
                  onChange={e => setMcqExplanation(e.target.value)}
                  placeholder="যেমন: দীপন তীব্রতার এসআই একক ক্যান্ডেলা (cd)।"
                  className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#53685e] mb-1">
                  নম্বর (Marks):
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={mcqMarks}
                  onChange={e => setMcqMarks(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] font-mono font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* B. CQ Fields */}
        {format === 'cq' && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#1f332c] mb-1">
                সৃজনশীল উদ্দীপক (Stimulus): <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={cqStimulus}
                onChange={e => setCqStimulus(e.target.value)}
                placeholder="উদ্দীপকটি লিখুন... যেমন: একটি বস্তুকে খাড়া উপরের দিকে নিক্ষেপ করা হলো..."
                className="w-full p-3 border border-[#c0dfe1] rounded-xl text-xs focus:ring-1 focus:ring-[#78988b] focus:border-[#78988b] leading-relaxed font-medium bg-[#ffffff]"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#1f332c]">
                ক, খ, গ, ঘ ৪টি উপ-প্রশ্ন পূরণ করুন (মোট ১০ নম্বর):
              </label>

              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-[#eae8d9]/50 rounded-xl border border-[#c0dfe1]">
                  <span className="w-8 text-center font-bold text-xs text-[#78988b] shrink-0">(ক) [১]</span>
                  <input
                    type="text"
                    value={cqA}
                    onChange={e => setCqA(e.target.value)}
                    placeholder="জ্ঞানমূলক প্রশ্ন..."
                    className="w-full px-3 py-1.5 text-xs border border-[#c0dfe1] rounded-lg bg-[#ffffff] focus:border-[#78988b]"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 p-2 bg-[#eae8d9]/50 rounded-xl border border-[#c0dfe1]">
                  <span className="w-8 text-center font-bold text-xs text-[#78988b] shrink-0">(খ) [২]</span>
                  <input
                    type="text"
                    value={cqB}
                    onChange={e => setCqB(e.target.value)}
                    placeholder="অনুধাবনমূলক প্রশ্ন..."
                    className="w-full px-3 py-1.5 text-xs border border-[#c0dfe1] rounded-lg bg-[#ffffff] focus:border-[#78988b]"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 p-2 bg-[#eae8d9]/50 rounded-xl border border-[#c0dfe1]">
                  <span className="w-8 text-center font-bold text-xs text-[#78988b] shrink-0">(গ) [৩]</span>
                  <input
                    type="text"
                    value={cqC}
                    onChange={e => setCqC(e.target.value)}
                    placeholder="প্রয়োগমূলক প্রশ্ন..."
                    className="w-full px-3 py-1.5 text-xs border border-[#c0dfe1] rounded-lg bg-[#ffffff] focus:border-[#78988b]"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 p-2 bg-[#eae8d9]/50 rounded-xl border border-[#c0dfe1]">
                  <span className="w-8 text-center font-bold text-xs text-[#78988b] shrink-0">(ঘ) [৪]</span>
                  <input
                    type="text"
                    value={cqD}
                    onChange={e => setCqD(e.target.value)}
                    placeholder="উচ্চতর দক্ষতামূলক প্রশ্ন..."
                    className="w-full px-3 py-1.5 text-xs border border-[#c0dfe1] rounded-lg bg-[#ffffff] focus:border-[#78988b]"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* C. Short Question Fields */}
        {format === 'short' && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#1f332c] mb-1">
                সংক্ষিপ্ত বা এককথায় প্রশ্ন: <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={shortQuestion}
                onChange={e => setShortQuestion(e.target.value)}
                placeholder="যেমন: বলের মাত্রা সমীকরণ কী?"
                className="w-full p-3 border border-[#c0dfe1] rounded-xl text-xs focus:ring-1 focus:ring-[#749fa0] focus:border-[#749fa0] leading-relaxed font-medium bg-[#ffffff]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-[#53685e] mb-1">
                  উত্তর বা সমাধান (ঐচ্ছিক):
                </label>
                <textarea
                  rows={2}
                  value={shortAnswer}
                  onChange={e => setShortAnswer(e.target.value)}
                  placeholder="সংক্ষিপ্ত উত্তর বা সমীকরণটি লিখুন..."
                  className="w-full p-2.5 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] focus:border-[#749fa0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#53685e] mb-1">
                  নম্বর (Marks):
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={shortMarks}
                  onChange={e => setShortMarks(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] font-mono font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#c0dfe1]/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#53685e]">
            <Sparkles className="w-4 h-4 text-[#78988b]" />
            <span>
              প্রশ্নটি <strong>{selectedSubject}</strong> বিষয়ের <strong>{customChapterName.trim() || selectedChapter}</strong> অধ্যায়ে যুক্ত হবে।
            </span>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#78988b] hover:bg-[#658276] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>অ্যাড কোশ্চেন (+ Add Question)</span>
          </button>
        </div>
      </form>

      {/* Recently Added Questions Section */}
      <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#c0dfe1] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#749fa0]" />
            <h2 className="text-sm font-bold text-[#1f332c]">
              আপনার সদ্য যুক্ত করা প্রশ্নসমূহ ({userAddedQuestions.length} টি)
            </h2>
          </div>
          {userAddedQuestions.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('exam-questions')}
              className="text-xs text-[#78988b] hover:text-[#749fa0] font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>প্রশ্নপত্র তৈরিতে ব্যবহার করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {userAddedQuestions.length === 0 ? (
          <div className="p-8 text-center bg-[#eae8d9]/50 rounded-xl border border-dashed border-[#c0dfe1] text-[#53685e] text-xs">
            এখনও কোনো কাস্টম প্রশ্ন যোগ করা হয়নি। উপরের ফর্মে বিষয় ও অধ্যায় সিলেক্ট করে সহজেই প্রশ্ন যোগ করুন!
          </div>
        ) : (
          <div className="divide-y divide-[#c0dfe1]/50 max-h-96 overflow-y-auto pr-1">
            {userAddedQuestions.map(q => (
              <div key={q.id} className="py-3 flex items-start justify-between gap-3">
                <div className="space-y-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#b1c0a1]/30 text-[#1f332c] font-bold text-[10px] border border-[#b1c0a1]">
                      {q.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#eae8d9] text-[#1f332c] text-[10px] font-medium border border-[#c0dfe1]">
                      অধ্যায়: {q.chapter}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#c0dfe1]/40 text-[#1f332c] text-[10px] font-mono font-bold uppercase">
                      {q.type}
                    </span>
                    {q.boardInfo && (
                      <span className="px-2 py-0.5 rounded bg-[#eae8d9] text-[#1f332c] text-[10px] border border-[#b1c0a1]">
                        {q.boardInfo}
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-[#1f332c] mt-1">
                    {q.type === 'mcq' ? (q as MCQQuestion).question : 
                     q.type === 'cq' ? (q as CQQuestion).stimulus : 
                     (q as ShortQuestion).question}
                  </p>

                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11px] text-[#53685e] pt-1">
                      {(q as MCQQuestion).options.map((opt, idx) => (
                        <div key={idx} className={idx === (q as MCQQuestion).correctOption ? 'font-bold text-[#78988b]' : ''}>
                          {['(ক)', '(খ)', '(গ)', '(ঘ)'][idx]} {opt} {idx === (q as MCQQuestion).correctOption && '✓'}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'short' && (q as ShortQuestion).answer && (
                    <p className="text-[11px] text-[#53685e]">
                      <strong>উত্তর:</strong> {(q as ShortQuestion).answer}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('এই প্রশ্নটি অপসারণ করতে চান?')) {
                      deleteQuestion(q.id);
                    }
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                  title="প্রশ্ন ডিলিট করুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
