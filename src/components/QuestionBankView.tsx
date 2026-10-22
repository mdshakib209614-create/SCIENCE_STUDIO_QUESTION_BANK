import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  Sparkles, 
  Layers, 
  Trash2, 
  Atom, 
  FlaskConical, 
  Calculator, 
  Dna, 
  Binary,
  ArrowRight,
  Printer,
  ChevronLeft,
  ChevronRight,
  Languages,
  Globe,
  GraduationCap,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  classesList, 
  classSubjectsMap, 
  getChaptersForClassAndSubject, 
  subjectsList, 
  chaptersBySubject,
  englishGrammarTopics
} from '../data/questionBank';
import { QuestionItem, MCQQuestion, CQQuestion, ShortQuestion } from '../types';
import { toBengaliNumber } from '../utils/bengaliUtils';

export const QuestionBankView: React.FC = () => {
  const { questions, deleteQuestion, setActiveTab, setExamNavIntent, examNavIntent } = useApp();

  // Class Selection state
  const [selectedClass, setSelectedClass] = useState<string>('সব শ্রেণি');

  // Available subjects based on selected class
  const availableSubjects = useMemo(() => {
    if (selectedClass === 'সব শ্রেণি') return subjectsList;
    return classSubjectsMap[selectedClass] || subjectsList;
  }, [selectedClass]);

  // Selected Subject (default to intent or first available subject)
  const [selectedSubject, setSelectedSubject] = useState<string>(
    examNavIntent?.subject || subjectsList[0]
  );
  const [selectedChapter, setSelectedChapter] = useState<string>('সব অধ্যায়');
  const [selectedGrammarTopic, setSelectedGrammarTopic] = useState<string>('সব গ্রামার টপিক');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'mcq' | 'cq' | 'short'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});
  const pageSize = 30;

  const toggleAnswer = (id: string) => {
    setExpandedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Auto-switch subject if not in selected class
  useEffect(() => {
    if (!availableSubjects.includes(selectedSubject)) {
      setSelectedSubject(availableSubjects[0] || subjectsList[0]);
      setSelectedChapter('সব অধ্যায়');
      setSelectedGrammarTopic('সব গ্রামার টপিক');
    }
  }, [availableSubjects, selectedSubject]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, selectedSubject, selectedChapter, selectedGrammarTopic, selectedFormat, searchQuery]);

  // Icon mapping for subjects
  const getSubjectIcon = (subj: string) => {
    switch (subj) {
      case 'পদার্থবিজ্ঞান':
        return Atom;
      case 'রসায়ন':
        return FlaskConical;
      case 'সাধারণ গণিত':
      case 'গণিত':
        return Calculator;
      case 'উচ্চতর গণিত':
        return Calculator;
      case 'জীববিজ্ঞান':
        return Dna;
      case 'তথ্য ও যোগাযোগ প্রযুক্তি':
        return Binary;
      case 'ইংরেজি':
        return Languages;
      case 'বাংলাদেশ ও বিশ্ব পরিচয়':
        return Globe;
      default:
        return BookOpen;
    }
  };

  const availableChapters = useMemo(() => {
    return getChaptersForClassAndSubject(selectedClass, selectedSubject);
  }, [selectedClass, selectedSubject]);

  // Filtered questions strictly for this view
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Class matching
      if (selectedClass !== 'সব শ্রেণি') {
        const qClass = q.targetClass || '৯ম-১০ম শ্রেণি';
        const match = qClass === selectedClass ||
          (selectedClass === '৯ম-১০ম শ্রেণি' && (qClass.includes('৯ম') || qClass.includes('১০ম') || qClass.includes('এসএসসি'))) ||
          (selectedClass === '৮ম শ্রেণি' && qClass.includes('৮ম')) ||
          (selectedClass === '৭ম শ্রেণি' && qClass.includes('৭ম')) ||
          (selectedClass === '৬ষ্ঠ শ্রেণি' && qClass.includes('৬ষ্ঠ'));
        if (!match) return false;
      }

      // Subject matching
      const matchSubject = q.subject === selectedSubject ||
        (selectedSubject === 'সাধারণ গণিত' && q.subject === 'গণিত') ||
        (selectedSubject === 'গণিত' && q.subject === 'সাধারণ গণিত');
      if (!matchSubject) return false;

      // Chapter matching
      if (selectedChapter !== 'সব অধ্যায়') {
        if (selectedSubject === 'ইংরেজি') {
          if (selectedChapter !== 'মডেল কোশ্চেন') {
            const query = selectedChapter.toLowerCase();
            const match =
              (q.chapter && q.chapter.toLowerCase() === query) ||
              (q.grammarTopic && q.grammarTopic.toLowerCase() === query) ||
              (q.grammarTopic && (q.grammarTopic.toLowerCase().includes(query) || query.includes(q.grammarTopic.toLowerCase()))) ||
              (q.chapter && (q.chapter.toLowerCase().includes(query) || query.includes(q.chapter.toLowerCase())));
            if (!match) return false;
          }
        } else if (q.chapter !== selectedChapter) {
          return false;
        }
      }

      // English Grammar Topic matching
      if (selectedSubject === 'ইংরেজি' && selectedGrammarTopic !== 'সব গ্রামার টপিক') {
        const query = selectedGrammarTopic.toLowerCase();
        const matchGrammar = 
          (q.grammarTopic && q.grammarTopic.toLowerCase().includes(query)) ||
          (q.topic && q.topic.toLowerCase().includes(query)) ||
          (q.chapter && q.chapter.toLowerCase().includes(query));
        if (!matchGrammar) return false;
      }

      // Format matching
      if (selectedFormat !== 'all' && q.type !== selectedFormat) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inChapter = q.chapter?.toLowerCase().includes(query);
        const inTopic = q.topic?.toLowerCase().includes(query);
        const inGrammar = q.grammarTopic?.toLowerCase().includes(query);
        let inContent = false;
        if (q.type === 'mcq') {
          const mcq = q as MCQQuestion;
          inContent = mcq.question.toLowerCase().includes(query) || mcq.options.some(o => o.toLowerCase().includes(query));
        } else if (q.type === 'cq') {
          const cq = q as CQQuestion;
          inContent = cq.stimulus.toLowerCase().includes(query) || cq.subQuestions.some(sq => sq.question.toLowerCase().includes(query));
        } else if (q.type === 'short') {
          const sh = q as ShortQuestion;
          inContent = sh.question.toLowerCase().includes(query) || (sh.answer ? sh.answer.toLowerCase().includes(query) : false);
        }
        return inChapter || inTopic || inGrammar || inContent;
      }

      return true;
    });
  }, [questions, selectedClass, selectedSubject, selectedChapter, selectedGrammarTopic, selectedFormat, searchQuery]);

  const subjectTotalQuestions = useMemo(() => {
    return questions.filter(q => {
      if (selectedClass !== 'সব শ্রেণি') {
        const qClass = q.targetClass || '৯ম-১০ম শ্রেণি';
        const match = qClass === selectedClass ||
          (selectedClass === '৯ম-১০ম শ্রেণি' && (qClass.includes('৯ম') || qClass.includes('১০ম') || qClass.includes('এসএসসি'))) ||
          (selectedClass === '৮ম শ্রেণি' && qClass.includes('৮ম')) ||
          (selectedClass === '৭ম শ্রেণি' && qClass.includes('৭ম')) ||
          (selectedClass === '৬ষ্ঠ শ্রেণি' && qClass.includes('৬ষ্ঠ'));
        if (!match) return false;
      }
      return q.subject === selectedSubject || 
        (selectedSubject === 'সাধারণ গণিত' && q.subject === 'গণিত') ||
        (selectedSubject === 'গণিত' && q.subject === 'সাধারণ গণিত');
    });
  }, [questions, selectedClass, selectedSubject]);

  const mcqCount = useMemo(() => {
    return subjectTotalQuestions.filter(q => q.type === 'mcq').length;
  }, [subjectTotalQuestions]);

  const cqCount = useMemo(() => {
    return subjectTotalQuestions.filter(q => q.type === 'cq').length;
  }, [subjectTotalQuestions]);

  const shortCount = useMemo(() => {
    return subjectTotalQuestions.filter(q => q.type === 'short').length;
  }, [subjectTotalQuestions]);

  const boardCount = useMemo(() => {
    return filteredQuestions.filter(q => !!q.boardInfo).length;
  }, [filteredQuestions]);

  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedQuestions = useMemo(() => {
    return filteredQuestions.slice(startIndex, startIndex + pageSize);
  }, [filteredQuestions, startIndex, pageSize]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-[#1f332c]">
      {/* Top Banner */}
      <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#c0dfe1] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#b1c0a1]/30 border border-[#b1c0a1] flex items-center justify-center text-[#78988b] shrink-0 shadow-2xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#1f332c]">
                প্রশ্ন ব্যাংক এক্সপ্লোরার (Question Bank)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#b1c0a1]/40 text-[#1f332c] border border-[#b1c0a1]">
                মোট {toBengaliNumber(questions.length)} টি প্রশ্ন
              </span>
            </div>
            <p className="text-xs text-[#53685e] mt-1">
              ৬ষ্ঠ থেকে ১০ম শ্রেণি এবং এসএসসি বোর্ড পরীক্ষার গত ১০ বছরের সিলেবাসভিত্তিক পূর্ণাঙ্গ প্রশ্নভাণ্ডার।
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('add-question')}
            className="px-4 py-2 bg-[#78988b] hover:bg-[#658276] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>➕ প্রশ্নপত্র অ্যাড করুন</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setExamNavIntent({ subject: selectedSubject, tab: 'builder' });
              setActiveTab('exam-questions');
            }}
            className="px-4 py-2 bg-[#749fa0] hover:bg-[#5f8788] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>প্রশ্নপত্র তৈরি করুন</span>
          </button>
        </div>
      </div>

      {/* Class Selector Tabs (৬ষ্ঠ, ৭ম, ৮ম, ৯ম-১০ম ও সব শ্রেণি) */}
      <div className="bg-[#ffffff] p-2.5 rounded-2xl border border-[#c0dfe1] shadow-xs flex items-center gap-2 overflow-x-auto">
        <div className="text-xs font-bold text-[#53685e] flex items-center gap-1.5 px-3 shrink-0">
          <GraduationCap className="w-4 h-4 text-[#78988b]" />
          <span>শ্রেণি নির্বাচন:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-1 overflow-x-auto">
          {classesList.map(cls => (
            <button
              key={cls}
              type="button"
              onClick={() => {
                setSelectedClass(cls);
                setSelectedChapter('সব অধ্যায়');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                selectedClass === cls
                  ? 'bg-[#78988b] text-white border-[#78988b] shadow-xs'
                  : 'bg-[#eae8d9]/40 text-[#1f332c] border-[#c0dfe1] hover:bg-[#b1c0a1]/30'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {availableSubjects.map(subj => {
          const SubjIcon = getSubjectIcon(subj);
          const isSelected = selectedSubject === subj;
          const count = questions.filter(q => {
            if (selectedClass !== 'সব শ্রেণি') {
              const qClass = q.targetClass || '৯ম-১০ম শ্রেণি';
              const match = qClass === selectedClass ||
                (selectedClass === '৯ম-১০ম শ্রেণি' && (qClass.includes('৯ম') || qClass.includes('১০ম') || qClass.includes('এসএসসি'))) ||
                (selectedClass === '৮ম শ্রেণি' && qClass.includes('৮ম')) ||
                (selectedClass === '৭ম শ্রেণি' && qClass.includes('৭ম')) ||
                (selectedClass === '৬ষ্ঠ শ্রেণি' && qClass.includes('৬ষ্ঠ'));
              if (!match) return false;
            }
            return q.subject === subj || 
              (subj === 'সাধারণ গণিত' && q.subject === 'গণিত') ||
              (subj === 'গণিত' && q.subject === 'সাধারণ গণিত');
          }).length;

          return (
            <button
              key={subj}
              type="button"
              onClick={() => {
                setSelectedSubject(subj);
                setSelectedChapter('সব অধ্যায়');
              }}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-[#78988b] text-white border-[#78988b] shadow-xs'
                  : 'bg-[#ffffff] text-[#1f332c] border-[#c0dfe1] hover:border-[#749fa0] hover:bg-[#eae8d9]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <SubjIcon className={`w-4 h-4 ${isSelected ? 'text-[#eae8d9]' : 'text-[#749fa0]'}`} />
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-[#eae8d9]' : 'bg-[#b1c0a1]/30 text-[#1f332c]'
                }`}>
                  {toBengaliNumber(count)} টি
                </span>
              </div>
              <div className="font-bold text-xs truncate">{subj}</div>
            </button>
          );
        })}
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#c0dfe1] shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Format pills */}
          <div className="flex items-center gap-1 bg-[#eae8d9]/70 p-1 rounded-xl text-xs border border-[#c0dfe1]">
            {[
              { id: 'all', label: 'সকল ফরম্যাট' },
              { id: 'mcq', label: `এমসিকিউ (${toBengaliNumber(mcqCount)})` },
              { id: 'cq', label: `সৃজনশীল (${toBengaliNumber(cqCount)})` },
              { id: 'short', label: `সংক্ষিপ্ত (${toBengaliNumber(shortCount)})` }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFormat(f.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  selectedFormat === f.id
                    ? 'bg-[#749fa0] text-white shadow-2xs'
                    : 'text-[#53685e] hover:text-[#1f332c]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#78988b] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="প্রশ্ন বা বিষয়বস্তু দিয়ে খুঁজুন..."
              className="pl-9 pr-3 py-1.5 text-xs border border-[#c0dfe1] rounded-xl bg-[#ffffff] w-60 sm:w-72 focus:border-[#749fa0] focus:ring-1 focus:ring-[#749fa0] text-[#1f332c] outline-none"
            />
          </div>
        </div>

        {/* Chapter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs pt-1 border-t border-[#c0dfe1]/50">
          <button
            type="button"
            onClick={() => setSelectedChapter('সব অধ্যায়')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
              selectedChapter === 'সব অধ্যায়'
                ? 'bg-[#78988b] text-white border-[#78988b] shadow-2xs'
                : 'bg-[#eae8d9]/50 text-[#1f332c] border-[#c0dfe1] hover:bg-[#b1c0a1]/30'
            }`}
          >
            সব অধ্যায় ({toBengaliNumber(subjectTotalQuestions.length)})
          </button>

          {availableChapters.map(ch => {
            const chCount = subjectTotalQuestions.filter(q => {
              if (selectedSubject === 'ইংরেজি') {
                if (ch === 'মডেল কোশ্চেন') return true;
                const query = ch.toLowerCase();
                return (q.chapter && q.chapter.toLowerCase() === query) ||
                  (q.grammarTopic && q.grammarTopic.toLowerCase() === query) ||
                  (q.grammarTopic && (q.grammarTopic.toLowerCase().includes(query) || query.includes(q.grammarTopic.toLowerCase()))) ||
                  (q.chapter && (q.chapter.toLowerCase().includes(query) || query.includes(q.chapter.toLowerCase())));
              }
              return q.chapter === ch;
            }).length;
            return (
              <button
                key={ch}
                type="button"
                onClick={() => setSelectedChapter(ch)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
                  selectedChapter === ch
                    ? 'bg-[#78988b] text-white border-[#78988b] shadow-2xs'
                    : 'bg-[#eae8d9]/50 text-[#1f332c] border-[#c0dfe1] hover:bg-[#b1c0a1]/30'
                }`}
              >
                {ch} ({toBengaliNumber(chCount)})
              </button>
            );
          })}
        </div>

        {/* Dedicated English Grammar Topic Filter Dropdown */}
        {selectedSubject === 'ইংরেজি' && (
          <div className="pt-2.5 border-t border-[#c0dfe1]/50 flex flex-wrap items-center justify-between gap-2.5 bg-[#eae8d9]/40 p-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#78988b] animate-ping" />
              <label htmlFor="grammar-topic-select" className="text-xs font-bold text-[#1f332c] flex items-center gap-1.5">
                <span>🏛️ বোর্ড গ্রামার টপিক নির্বাচন (Grammar Topic Dropdown):</span>
              </label>
            </div>
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <select
                id="grammar-topic-select"
                value={selectedGrammarTopic}
                onChange={e => setSelectedGrammarTopic(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 text-xs font-bold rounded-xl border border-[#749fa0] bg-white text-[#1f332c] shadow-2xs outline-none focus:ring-2 focus:ring-[#749fa0]/40 transition"
              >
                {englishGrammarTopics.map(gt => (
                  <option key={gt} value={gt}>{gt}</option>
                ))}
              </select>
              {selectedGrammarTopic !== 'সব গ্রামার টপিক' && (
                <button
                  type="button"
                  onClick={() => setSelectedGrammarTopic('সব গ্রামার টপিক')}
                  className="text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-1 rounded-lg cursor-pointer transition whitespace-nowrap"
                >
                  ফিল্টার বাতিল ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Questions Listing */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between text-xs text-[#53685e] font-semibold px-1 gap-2">
          <span>
            ফলাফল: মোট {toBengaliNumber(filteredQuestions.length)} টি প্রশ্নের মধ্যে {toBengaliNumber(startIndex + 1)} - {toBengaliNumber(Math.min(startIndex + pageSize, filteredQuestions.length))} টি প্রদর্শিত (পৃষ্ঠা {toBengaliNumber(currentPage)}/{toBengaliNumber(totalPages)})
          </span>
          {boardCount > 0 && (
            <span className="text-[#1f332c] bg-[#b1c0a1]/40 px-2 py-0.5 rounded border border-[#b1c0a1]">
              বোর্ড ও ক্যাডেট প্রশ্ন: {toBengaliNumber(boardCount)} টি
            </span>
          )}
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="bg-[#ffffff] p-12 text-center rounded-2xl border border-[#c0dfe1] shadow-xs space-y-3">
            <p className="text-sm font-bold text-[#1f332c]">কোনো প্রশ্ন পাওয়া যায়নি!</p>
            <p className="text-xs text-[#53685e]">
              উপরের শ্রেণি বা অধ্যায় ফিল্টার পরিবর্তন করুন অথবা 'প্রশ্নপত্র অ্যাড করুন' বাটনে ক্লিক করে নতুন প্রশ্ন যোগ করুন।
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('add-question')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#78988b] hover:bg-[#658276] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন প্রশ্ন যোগ করুন</span>
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3.5">
              {paginatedQuestions.map((q, idx) => {
                const isMCQ = q.type === 'mcq';
                const isCQ = q.type === 'cq';
                const isShort = q.type === 'short';

                return (
                  <div 
                    key={q.id}
                    className="bg-[#ffffff] p-5 rounded-2xl border border-[#c0dfe1] shadow-xs hover:border-[#749fa0] transition space-y-3"
                  >
                    {/* Top metadata tags */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c0dfe1]/50 pb-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-[#53685e] font-mono">
                          #{toBengaliNumber(startIndex + idx + 1)}
                        </span>
                        {q.targetClass && (
                          <span className="px-2 py-0.5 rounded-md bg-[#749fa0]/15 text-[#1f332c] font-bold text-[10px] border border-[#749fa0]/30">
                            🎓 {q.targetClass}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-[#b1c0a1]/30 text-[#1f332c] font-bold text-[10px] border border-[#b1c0a1]/50">
                          {q.subject}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#eae8d9] text-[#1f332c] text-[10px] font-medium border border-[#c0dfe1]">
                          {q.chapter}
                        </span>
                        {q.grammarTopic && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                            📖 {q.grammarTopic}
                          </span>
                        )}
                        {q.itemNumber && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                            আইটেম: {q.itemNumber}
                          </span>
                        )}
                        {q.topic && !q.grammarTopic && (
                          <span className="px-2 py-0.5 rounded-md bg-[#eae8d9]/60 text-[#53685e] text-[10px]">
                            টপিক: {q.topic}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          isMCQ ? 'bg-[#749fa0]/20 text-[#1f332c] border border-[#749fa0]/40' :
                          isCQ ? 'bg-[#78988b]/20 text-[#1f332c] border border-[#78988b]/40' : 
                          'bg-[#b1c0a1]/30 text-[#1f332c] border border-[#b1c0a1]'
                        }`}>
                          {isMCQ ? 'MCQ বহুনির্বাচনী' : isCQ ? 'CQ সৃজনশীল' : 'গ্রামার / সংক্ষিপ্ত প্রশ্ন'}
                        </span>
                        {q.boardInfo && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-bold flex items-center gap-1">
                            🏛️ {q.boardInfo}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#53685e]">
                          মান: {q.marksDistribution || toBengaliNumber(q.marks || (isCQ ? 10 : 1))}
                        </span>

                        {/* Add to Question Paper Maker Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setExamNavIntent({ subject: q.subject, tab: 'builder' });
                            setActiveTab('exam-questions');
                          }}
                          className="px-2.5 py-1 bg-[#78988b] hover:bg-[#658276] text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="এই বিষয়ের প্রশ্নপত্র তৈরিতে যান"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>প্রশ্নপত্রে নিন</span>
                        </button>

                        {q.id.startsWith('custom-') && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('আপনি কি এই কাস্টম প্রশ্নটি মুছে ফেলতে চান?')) {
                                deleteQuestion(q.id);
                              }
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="প্রশ্ন মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question Content */}
                    {isMCQ && (
                      <div className="space-y-2.5">
                        <p className="text-sm font-semibold text-[#1f332c] leading-relaxed">
                          {(q as MCQQuestion).question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                          {(q as MCQQuestion).options.map((opt, optIdx) => {
                            const isCorrect = optIdx === (q as MCQQuestion).correctOption;
                            const labels = ['(ক)', '(খ)', '(গ)', '(ঘ)'];
                            return (
                              <div 
                                key={optIdx}
                                className={`p-2 rounded-xl text-xs flex items-center gap-2 border transition ${
                                  isCorrect 
                                    ? 'bg-[#b1c0a1]/30 border-[#78988b] text-[#1f332c] font-bold shadow-2xs' 
                                    : 'bg-[#eae8d9]/40 border-[#c0dfe1] text-[#1f332c]'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] shrink-0 ${
                                  isCorrect ? 'bg-[#78988b] text-white' : 'bg-[#c0dfe1] text-[#1f332c]'
                                }`}>
                                  {labels[optIdx]}
                                </span>
                                <span className="truncate">{opt}</span>
                              </div>
                            );
                          })}
                        </div>

                        {(q as MCQQuestion).explanation && (
                          <div className="bg-[#eae8d9]/50 p-2.5 rounded-xl text-[11px] text-[#53685e] border border-[#c0dfe1] flex items-start gap-1.5">
                            <span className="font-bold text-[#1f332c] shrink-0">ব্যাখ্যা:</span>
                            <span>{(q as MCQQuestion).explanation}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {isCQ && (
                      <div className="space-y-3">
                        <div className="bg-[#eae8d9]/50 p-3 rounded-xl border border-[#c0dfe1] text-xs text-[#1f332c] leading-relaxed font-medium">
                          <strong className="text-[#1f332c] block mb-1">উদ্দীপক:</strong>
                          {(q as CQQuestion).stimulus}
                        </div>

                        <div className="grid grid-cols-1 gap-1.5 text-xs text-[#1f332c] pl-2">
                          {(q as CQQuestion).subQuestions.map(sq => (
                            <div key={sq.label} className="flex items-start gap-2">
                              <span className="font-bold text-[#749fa0] shrink-0">({sq.label})</span>
                              <span className="flex-1 font-medium">{sq.question}</span>
                              <span className="text-[#53685e] font-mono text-[11px] shrink-0">[{toBengaliNumber(sq.marks)}]</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isShort && (
                      <div className="space-y-2.5">
                        {/* Clues Box for Board Right Form of Verbs / Gap filling */}
                        {(q as ShortQuestion).cluesBox && (q as ShortQuestion).cluesBox!.length > 0 && (
                          <div className="p-3 bg-[#ffffff] border-2 border-dashed border-[#749fa0]/60 rounded-xl text-xs">
                            <span className="font-bold text-[#749fa0] mr-2 block sm:inline mb-1 sm:mb-0">[বক্স ক্লু / Clues Box]:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {(q as ShortQuestion).cluesBox!.map((clue, cIdx) => (
                                <span key={cIdx} className="px-2.5 py-0.5 bg-[#eae8d9]/70 rounded-md border border-[#c0dfe1] font-mono text-xs font-semibold text-[#1f332c]">
                                  {clue}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="text-sm font-medium text-[#1f332c] leading-relaxed whitespace-pre-line font-serif bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                          {(q as ShortQuestion).question}
                        </div>

                        {/* Toggle Answer */}
                        {(q as ShortQuestion).answer && (
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleAnswer(q.id)}
                              className="text-xs font-bold text-[#78988b] hover:text-[#53685e] flex items-center gap-1.5 transition cursor-pointer py-1"
                            >
                              {expandedAnswers[q.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              <span>{expandedAnswers[q.id] ? 'উত্তর ও মডেল সমাধান লুকান' : 'বোর্ড আদর্শ সমাধান ও উত্তর দেখুন'}</span>
                            </button>

                            {expandedAnswers[q.id] && (
                              <div className="mt-2 p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-300 text-xs text-slate-900 whitespace-pre-line font-mono">
                                <strong className="text-emerald-800 block mb-1 font-sans text-xs flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> বোর্ড উত্তরমালা / মডেল সমাধান:
                                </strong>
                                {(q as ShortQuestion).answer}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between bg-[#ffffff] p-4 rounded-2xl border border-[#c0dfe1] shadow-xs text-xs gap-3">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-3.5 py-2 rounded-xl border border-[#c0dfe1] text-[#1f332c] hover:bg-[#eae8d9]/60 disabled:opacity-40 disabled:cursor-not-allowed font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>পূর্ববর্তী পৃষ্ঠা</span>
                </button>

                <div className="flex items-center gap-1.5 font-bold flex-wrap justify-center">
                  <span className="text-[#53685e] hidden sm:inline">পৃষ্ঠা:</span>
                  <div className="flex items-center gap-1">
                    {currentPage > 3 && (
                      <button
                        type="button"
                        onClick={() => setCurrentPage(1)}
                        className="w-7 h-7 rounded-lg border border-[#c0dfe1] flex items-center justify-center hover:bg-[#eae8d9] text-xs font-bold transition"
                      >
                        ১
                      </button>
                    )}
                    {currentPage > 4 && <span className="px-1 text-slate-400">...</span>}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p >= currentPage - 2 && p <= currentPage + 2)
                      .map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          className={`w-7 h-7 rounded-lg font-bold text-xs transition cursor-pointer ${
                            currentPage === p 
                              ? 'bg-[#749fa0] text-white shadow-2xs' 
                              : 'border border-[#c0dfe1] hover:bg-[#eae8d9]/70 text-[#1f332c]'
                          }`}
                        >
                          {toBengaliNumber(p)}
                        </button>
                      ))}
                    {currentPage < totalPages - 3 && <span className="px-1 text-slate-400">...</span>}
                    {currentPage < totalPages - 2 && (
                      <button
                        type="button"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-7 h-7 rounded-lg border border-[#c0dfe1] flex items-center justify-center hover:bg-[#eae8d9] text-xs font-bold transition"
                      >
                        {toBengaliNumber(totalPages)}
                      </button>
                    )}
                  </div>
                  <span className="text-[#53685e] text-xs">(মোট {toBengaliNumber(totalPages)} পৃষ্ঠা)</span>
                </div>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-3.5 py-2 rounded-xl border border-[#c0dfe1] text-[#1f332c] hover:bg-[#eae8d9]/60 disabled:opacity-40 disabled:cursor-not-allowed font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <span>পরবর্তী পৃষ্ঠা</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
