import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  FileText, 
  Printer, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  Eye, 
  Sliders, 
  Settings2, 
  Layers, 
  Clock, 
  Award, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  ArrowUpDown, 
  Download, 
  School, 
  BookOpen, 
  FileSpreadsheet, 
  HelpCircle,
  AlertCircle,
  Copy,
  FoldHorizontal,
  Bookmark,
  Save,
  Calendar,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  FolderArchive
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LandscapeBookletPreview } from './LandscapeBookletPreview';
import { OmrSheetGenerator } from './OmrSheetGenerator';
import { AnswerKeyGenerator } from './AnswerKeyGenerator';
import { 
  QuestionItem, 
  MCQQuestion, 
  CQQuestion, 
  ShortQuestion, 
  ExamQuestionFormat,
  ExamPaperConfig
} from '../types';
import { 
  subjectsList, 
  chaptersBySubject,
  classesList,
  classSubjectsMap,
  getChaptersForClassAndSubject,
  englishGrammarTopics
} from '../data/chaptersData';
import { englishBoardQuestions } from '../data/questions/englishBoardQuestions';
import { toBengaliNumber } from '../utils/bengaliUtils';
import { exportElementsToPDF } from '../utils/pdfExport';
import { defaultScienceStudioLogoSvg } from '../assets/defaultWatermarkLogo';
import { 
  getSSCMath100MarksPreset, 
  getSSCEnglish2ndPaperPreset, 
  getEnglish4PageBookletPreset, 
  PresetBookletData 
} from '../data/presetQuestionBooklets';

export type PaperSectionPattern = 
  | 'k_kh_g'                  // ক, খ, গ বিভাগ (ক: এমসিকিউ, খ: শর্ট, গ: সিকিউ)
  | 'mcq_only'                // শুধু এমসিকিউ
  | 'cq_only'                 // শুধু সিকিউ
  | 'short_only'              // শুধু সংক্ষিপ্ত প্রশ্ন
  | 'k_kh_mcq_cq'             // ক ও খ বিভাগ (ক: এমসিকিউ, খ: সিকিউ)
  | 'english_board_standard'  // বোর্ড স্ট্যান্ডার্ড (Part A: Grammar + Part B: Composition)
  | 'english_grammar_test'    // কোচিং গ্রামার টেস্ট (Items 1-9 Grammar Only)
  | 'english_1st_paper';      // ইংরেজি ১ম পত্র (Reading + Writing)

interface DraftPaperConfig {
  academyName: string;
  examTitle: string;
  subject: string;
  subjectCode: string;
  className: string;
  section: string;
  totalMarks: string;
  duration: string;
  pattern: PaperSectionPattern;
  instructions: string;
  isCreated: boolean;
}

interface QuestionPaperMakerViewProps {
  initialTab?: 'builder' | 'preview' | 'saved-papers' | 'omr-sheet' | 'answer-key';
}

export const QuestionPaperMakerView: React.FC<QuestionPaperMakerViewProps> = ({ initialTab = 'builder' }) => {
  const { 
    institution, 
    questions, 
    addCustomQuestion, 
    savedExamPapers, 
    saveExamPaper, 
    deleteExamPaper, 
    examNavIntent,
    watermarkImage,
    setWatermarkImage,
    watermarkOpacity,
    setWatermarkOpacity,
    watermarkSize,
    setWatermarkSize,
    showWatermark,
    setShowWatermark
  } = useApp();

  // Mode: 'builder' | 'preview' | 'saved-papers' | 'omr-sheet' | 'answer-key'
  const [viewMode, setViewMode] = useState<'builder' | 'preview' | 'saved-papers' | 'omr-sheet' | 'answer-key'>(initialTab);

  // Active Question Set (ক, খ, গ, ঘ) - eProshnobank & ProshnoLab signature feature
  const [activeQuestionSet, setActiveQuestionSet] = useState<'ক' | 'খ' | 'গ' | 'ঘ'>('ক');

  // Font Size for Portrait A4: 'compact' (ছোট), 'normal' (স্বাভাবিক), 'large' (বড়)
  const [paperFontSize, setPaperFontSize] = useState<'compact' | 'normal' | 'large'>('normal');

  // Saved Paper Metadata
  const [paperTitle, setPaperTitle] = useState<string>('');
  const [currentPaperId, setCurrentPaperId] = useState<string>('');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  // Print Layout Mode: 'standard_portrait' (A4 Single/2-Col) vs 'landscape_booklet' (Landscape 4-Section Fold)
  const [paperLayoutMode, setPaperLayoutMode] = useState<'standard_portrait' | 'landscape_booklet'>('landscape_booklet');

  // Step 1: Format Blueprint State
  const [config, setConfig] = useState<DraftPaperConfig>({
    academyName: institution.nameBn || 'কলাবাড়িয়া মডেল একাডেমি ও কোচিং সেন্টার',
    examTitle: 'মডেল টেস্ট মূল্যায়ন পরীক্ষা - ২০২৬',
    subject: 'পদার্থবিজ্ঞান',
    subjectCode: '১৭৪',
    className: '১০ম শ্রেণি (SSC পরীক্ষার্থী)',
    section: 'ক শাখা (বিজ্ঞান)',
    totalMarks: '১০০',
    duration: '২ ঘণ্টা ৩০ মিনিট',
    pattern: 'k_kh_g',
    instructions: 'বিশেষ দ্রষ্টব্য: ডান পাশের সংখ্যা প্রশ্নের পূর্ণমান জ্ঞাপক। ক বিভাগের সকল প্রশ্ন এবং গ বিভাগের যেকোনো ৫টি প্রশ্নের উত্তর দাও।',
    isCreated: true // starts with a pre-configured ready format!
  });

  // Controls whether format configuration accordion/panel is open
  const [showConfigPanel, setShowConfigPanel] = useState<boolean>(false);

  // Selected Questions sorted by Section
  // Starts completely blank for a clean custom paper!
  const [sectionKQuestions, setSectionKQuestions] = useState<QuestionItem[]>([]);
  const [sectionKhQuestions, setSectionKhQuestions] = useState<QuestionItem[]>([]);
  const [sectionGQuestions, setSectionGQuestions] = useState<QuestionItem[]>([]);

  // Picker drawer / modal for adding questions
  const [showAddDrawer, setShowAddDrawer] = useState<boolean>(false);
  const [targetSectionForAdd, setTargetSectionForAdd] = useState<'auto' | 'k' | 'kh' | 'g'>('auto');
  const [pickerClass, setPickerClass] = useState<string>('সব শ্রেণি');
  const [pickerSubject, setPickerSubject] = useState<string>('পদার্থবিজ্ঞান');
  const [pickerChapter, setPickerChapter] = useState<string>('সব অধ্যায়');
  const [pickerGrammarTopic, setPickerGrammarTopic] = useState<string>('সব গ্রামার টপিক');
  const [pickerType, setPickerType] = useState<'all' | 'mcq' | 'cq' | 'short'>('all');
  const [pickerSearch, setPickerSearch] = useState<string>('');
  const [drawerDisplayLimit, setDrawerDisplayLimit] = useState<number>(60);

  // ProshnoLab & eProshnobank Advanced Question Bank Filter States
  const [pickerSpecialFilter, setPickerSpecialFilter] = useState<'all' | 'repeated_board' | 'math' | 'theory' | 'বহুপদী'>('all');
  const [pickerBoardFilter, setPickerBoardFilter] = useState<string>('সব বোর্ড');
  const [pickerSchoolFilter, setPickerSchoolFilter] = useState<string>('সব প্রতিষ্ঠান');
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});

  // Portrait A4 Live Customization States (ProshnoLab & eProshnobank Style)
  const [portraitOptionStyle, setPortraitOptionStyle] = useState<'circle' | 'paren' | 'dot'>('circle');
  const [portraitShowTickAnswer, setPortraitShowTickAnswer] = useState<boolean>(false);
  const [portraitShowExplanation, setPortraitShowExplanation] = useState<boolean>(false);
  const [portraitShowMiniOmr, setPortraitShowMiniOmr] = useState<boolean>(false);
  const [portraitShowMarksBox, setPortraitShowMarksBox] = useState<boolean>(false);
  const [portraitShowStudentInfo, setPortraitShowStudentInfo] = useState<boolean>(false);
  const [portraitShowBoardTag, setPortraitShowBoardTag] = useState<boolean>(true);
  const [portraitInlineEdit, setPortraitInlineEdit] = useState<boolean>(false);
  const [portraitShowSidebar, setPortraitShowSidebar] = useState<boolean>(true);

  // Swap / Replace Modal
  const [swapModalOpen, setSwapModalOpen] = useState<boolean>(false);
  const [questionToSwap, setQuestionToSwap] = useState<{ section: 'k' | 'kh' | 'g'; index: number; question: QuestionItem } | null>(null);

  // Edit Question Modal
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<{ section: 'k' | 'kh' | 'g'; index: number; question: QuestionItem } | null>(null);

  // Custom question writing form
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customType, setCustomType] = useState<'mcq' | 'cq' | 'short'>('mcq');
  const [customQuestionText, setCustomQuestionText] = useState<string>('');
  const [customStimulus, setCustomStimulus] = useState<string>('');
  const [customOptions, setCustomOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [customCorrect, setCustomCorrect] = useState<0 | 1 | 2 | 3>(0);
  const [customMarks, setCustomMarks] = useState<number>(1);
  const [customSubQuestions, setCustomSubQuestions] = useState<{ label: 'ক' | 'খ' | 'গ' | 'ঘ'; question: string; marks: number }[]>([
    { label: 'ক', question: '', marks: 1 },
    { label: 'খ', question: '', marks: 2 },
    { label: 'গ', question: '', marks: 3 },
    { label: 'ঘ', question: '', marks: 4 }
  ]);

  // Print & Watermark modal settings
  const [printColumns, setPrintColumns] = useState<1 | 2>(2);
  const [showWatermarkModal, setShowWatermarkModal] = useState<boolean>(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [isExportingPortraitPdf, setIsExportingPortraitPdf] = useState<boolean>(false);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotificationMsg = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Shuffle questions across sections for Set ক, খ, গ, ঘ
  const handleShufflePaperQuestions = () => {
    const shuffleArr = <T,>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };
    setSectionKQuestions(prev => shuffleArr(prev));
    setSectionKhQuestions(prev => shuffleArr(prev));
    setSectionGQuestions(prev => shuffleArr(prev));
    showNotificationMsg('🔀 প্রশ্নের ক্রম সফলভাবে শাফল (Shuffle) করা হয়েছে!');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setWatermarkImage(result);
          showNotificationMsg('✅ নতুন লগো সফলভাবে আপলোড হয়েছে এবং ওয়াটারমার্কে যুক্ত হয়েছে!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetToDefaultLogo = () => {
    setWatermarkImage(defaultScienceStudioLogoSvg);
    showNotificationMsg('🔄 ওয়াটারমার্ক লগো সায়েন্স স্টুডিও ডিফল্ট সিগনেচারে রিসেট করা হয়েছে।');
  };

  const handleDownloadPortraitPDF = async () => {
    setIsExportingPortraitPdf(true);
    try {
      const cleanFileName = (paperTitle || `${config.className}_${config.subject}_${config.examTitle}`)
        .replace(/[/\\?%*:|"<>]/g, '_')
        .replace(/\s+/g, '_');
      const success = await exportElementsToPDF(['printable-exam-paper'], {
        fileName: `${cleanFileName}_A4.pdf`,
        orientation: 'portrait'
      });
      if (!success) {
        handlePrint();
      } else {
        showNotificationMsg('✅ প্রশ্নপত্রটি দাগমুক্ত ও নিখুঁতভাবে পিডিএফ ফাইল হিসেবে ডাউনলোড হয়েছে!');
      }
    } catch (err) {
      console.error('Portrait PDF export error:', err);
      handlePrint();
    } finally {
      setIsExportingPortraitPdf(false);
    }
  };

  // Synchronize initialTab
  useEffect(() => {
    if (initialTab) {
      setViewMode(initialTab);
    }
  }, [initialTab]);


  // Synchronize picker subject & class with config when changed
  useEffect(() => {
    if (config.subject && subjectsList.includes(config.subject)) {
      setPickerSubject(config.subject);
    }
  }, [config.subject]);

  useEffect(() => {
    if (config.className.includes('৬ষ্ঠ')) {
      setPickerClass('৬ষ্ঠ শ্রেণি');
    } else if (config.className.includes('৭ম')) {
      setPickerClass('৭ম শ্রেণি');
    } else if (config.className.includes('৮ম')) {
      setPickerClass('৮ম শ্রেণি');
    } else if (config.className.includes('৯ম') || config.className.includes('১০ম') || config.className.includes('SSC')) {
      setPickerClass('৯ম-১০ম শ্রেণি');
    }
  }, [config.className]);

  // Check if current paper is English board format
  const isEnglishPaper = config.subject === 'ইংরেজি' || config.pattern.startsWith('english_');

  // Calculate current marks per section and total
  const sectionKMarks = useMemo(() => {
    return sectionKQuestions.reduce((acc, q) => acc + (q.marks || 1), 0);
  }, [sectionKQuestions]);

  const sectionKhMarks = useMemo(() => {
    return sectionKhQuestions.reduce((acc, q) => acc + (q.marks || 2), 0);
  }, [sectionKhQuestions]);

  const sectionGMarks = useMemo(() => {
    return sectionGQuestions.reduce((acc, q) => acc + (q.marks || 10), 0);
  }, [sectionGQuestions]);

  const currentTotalMarks = sectionKMarks + sectionKhMarks + sectionGMarks;

  // 1-Click English Board Model Question (100 Marks SSC Standard)
  const handleLoadEnglishBoardModel = () => {
    setConfig(prev => ({
      ...prev,
      subject: 'ইংরেজি',
      subjectCode: '১০৮',
      totalMarks: '১০০',
      duration: '৩ ঘণ্টা',
      pattern: 'english_board_standard',
      instructions: 'Special Note: Figures in the right margin indicate full marks. Answer all the questions in Part A (Grammar) and Part B (Composition).'
    }));

    // Filter genuine board grammar & composition items
    const grammarItems = englishBoardQuestions.filter(q => q.part === 'Part A: Grammar');
    const compItems = englishBoardQuestions.filter(q => q.part === 'Part B: Composition');

    setSectionKQuestions(grammarItems);
    setSectionKhQuestions([]);
    setSectionGQuestions(compItems);

    showNotificationMsg('✅ এসএসসি বোর্ড স্ট্যান্ডার্ড ১০০ নম্বরের পূর্ণাঙ্গ মডেল প্রশ্নপত্র লোড হয়েছে!');
  };

  // 1-Click English Coaching Grammar Assessment Test (50 Marks)
  const handleLoadEnglishGrammarTest = () => {
    setConfig(prev => ({
      ...prev,
      subject: 'ইংরেজি',
      subjectCode: '১০৮',
      totalMarks: '৫০',
      duration: '১ ঘণ্টা ৩০ মিনিট',
      pattern: 'english_grammar_test',
      instructions: 'Special Note: Figures in the right margin indicate full marks. Answer all the questions.'
    }));

    const grammarItems = englishBoardQuestions.filter(q => q.part === 'Part A: Grammar');
    setSectionKQuestions(grammarItems);
    setSectionKhQuestions([]);
    setSectionGQuestions([]);

    showNotificationMsg('✅ কোচিং ৫০ নম্বরের স্পেশাল গ্রামার টেস্ট প্রশ্নপত্র লোড হয়েছে!');
  };

  // Filtered Question Bank for the Question Picker
  const filteredPickerQuestions = useMemo(() => {
    return questions.filter(q => {
      // Class filter
      if (pickerClass !== 'সব শ্রেণি') {
        const qClass = q.targetClass || '৯ম-১০ম শ্রেণি';
        const match = qClass === pickerClass ||
          (pickerClass === '৯ম-১০ম শ্রেণি' && (qClass.includes('৯ম') || qClass.includes('১০ম') || qClass.includes('এসএসসি'))) ||
          (pickerClass === '৮ম শ্রেণি' && qClass.includes('৮ম')) ||
          (pickerClass === '৭ম শ্রেণি' && qClass.includes('৭ম')) ||
          (pickerClass === '৬ষ্ঠ শ্রেণি' && qClass.includes('৬ষ্ঠ'));
        if (!match) return false;
      }

      // Subject filter (allows 'সব বিষয়' for mixed exams!)
      if (pickerSubject !== 'সব বিষয়' && q.subject !== pickerSubject) {
        return false;
      }
      // Chapter filter
      if (pickerChapter !== 'সব অধ্যায়') {
        if (pickerSubject === 'ইংরেজি') {
          if (pickerChapter !== 'মডেল কোশ্চেন') {
            const query = pickerChapter.toLowerCase();
            const match =
              (q.chapter && q.chapter.toLowerCase() === query) ||
              (q.grammarTopic && q.grammarTopic.toLowerCase() === query) ||
              (q.grammarTopic && (q.grammarTopic.toLowerCase().includes(query) || query.includes(q.grammarTopic.toLowerCase()))) ||
              (q.chapter && (q.chapter.toLowerCase().includes(query) || query.includes(q.chapter.toLowerCase())));
            if (!match) return false;
          }
        } else if (q.chapter !== pickerChapter) {
          return false;
        }
      }

      // English Grammar Topic filter
      if (pickerSubject === 'ইংরেজি' && pickerGrammarTopic !== 'সব গ্রামার টপিক') {
        const query = pickerGrammarTopic.toLowerCase();
        const matchGrammar = (q.grammarTopic && q.grammarTopic.toLowerCase().includes(query)) ||
          (q.topic && q.topic.toLowerCase().includes(query)) ||
          (q.chapter && q.chapter.toLowerCase().includes(query));
        if (!matchGrammar) return false;
      }

      // Type filter
      if (pickerType !== 'all' && q.type !== pickerType) {
        return false;
      }

      // ProshnoLab Special Filter
      const qText = q.type === 'cq'
        ? (q.stimulus + ' ' + q.subQuestions.map(sq => sq.question).join(' '))
        : (q.question || '');

      if (pickerSpecialFilter === 'repeated_board') {
        if (!q.boardInfo && q.importance !== 'very_high') return false;
      } else if (pickerSpecialFilter === 'math') {
        const hasMath = /[0-9০-৯+\-=×÷%√^]|কত|নির্ণয়|মান|বেগ|ত্বরণ|বল|দূরত্ব|ভর|শক্তি|ক্ষেত্রফল|আয়তন/.test(qText);
        if (!hasMath) return false;
      } else if (pickerSpecialFilter === 'theory') {
        const isMathOnly = /কত\?|নির্ণয় কর/.test(qText);
        if (isMathOnly) return false;
      } else if (pickerSpecialFilter === 'বহুপদী') {
        const isMulti = /i\.|ii\.|iii\.|নিচের কোনটি সঠিক/.test(qText);
        if (!isMulti) return false;
      }

      // Board Filter
      if (pickerBoardFilter !== 'সব বোর্ড') {
        const boardShort = pickerBoardFilter.replace(' বোর্ড', '').slice(0, 2);
        const bInfo = q.boardInfo || '';
        if (!bInfo.includes(boardShort) && !bInfo.includes(pickerBoardFilter.replace(' বোর্ড', ''))) {
          return false;
        }
      }

      // Top School/College Filter
      if (pickerSchoolFilter !== 'সব প্রতিষ্ঠান') {
        const bInfo = (q.boardInfo || '') + ' ' + qText;
        if (!bInfo.includes(pickerSchoolFilter.split(' ')[0])) {
          // If question doesn't explicitly mention school, match high-importance questions for top schools
          if (q.importance !== 'very_high') return false;
        }
      }

      // Search
      if (pickerSearch.trim()) {
        const query = pickerSearch.toLowerCase();
        const inPrompt = qText.toLowerCase();
        const inBoard = (q.boardInfo || '').toLowerCase();
        const inGrammar = (q.grammarTopic || '').toLowerCase();
        if (!inPrompt.includes(query) && !inBoard.includes(query) && !inGrammar.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [questions, pickerClass, pickerSubject, pickerChapter, pickerGrammarTopic, pickerType, pickerSpecialFilter, pickerBoardFilter, pickerSchoolFilter, pickerSearch]);

  // Check if a question is already added in the paper
  const isQuestionAdded = (id: string): boolean => {
    return (
      sectionKQuestions.some(q => q.id === id) ||
      sectionKhQuestions.some(q => q.id === id) ||
      sectionGQuestions.some(q => q.id === id)
    );
  };

  // User flow: Add question with automatic routing based on question type!
  const handleAddQuestionToPaper = (question: QuestionItem) => {
    if (isQuestionAdded(question.id)) {
      showNotificationMsg('এই প্রশ্নটি ইতোমধ্যে প্রশ্নপত্রে যুক্ত করা হয়েছে!');
      return;
    }

    // Specialized English board routing
    if (isEnglishPaper) {
      if (question.part === 'Part B: Composition' || question.grammarTopic?.includes('Writing') || question.chapter?.includes('Writing')) {
        setSectionGQuestions(prev => [...prev, question]);
        showNotificationMsg(`'Part B: Composition' অংশে প্রশ্ন যুক্ত হয়েছে! মোট: ${toBengaliNumber(sectionGQuestions.length + 1)}টি`);
        return;
      }
      setSectionKQuestions(prev => [...prev, question]);
      showNotificationMsg(`'Part A: Grammar' অংশে প্রশ্ন যুক্ত হয়েছে! মোট: ${toBengaliNumber(sectionKQuestions.length + 1)}টি`);
      return;
    }

    if (config.pattern === 'mcq_only') {
      setSectionKQuestions(prev => [...prev, question]);
      showNotificationMsg(`এমসিকিউ প্রশ্ন যুক্ত হয়েছে! মোট এমসিকিউ: ${toBengaliNumber(sectionKQuestions.length + 1)}টি`);
      return;
    }

    if (config.pattern === 'cq_only') {
      setSectionGQuestions(prev => [...prev, question]);
      showNotificationMsg(`সৃজনশীল প্রশ্ন যুক্ত হয়েছে! মোট সিকিউ: ${toBengaliNumber(sectionGQuestions.length + 1)}টি`);
      return;
    }

    if (config.pattern === 'short_only') {
      setSectionKhQuestions(prev => [...prev, question]);
      showNotificationMsg(`সংক্ষিপ্ত প্রশ্ন যুক্ত হয়েছে! মোট প্রশ্ন: ${toBengaliNumber(sectionKhQuestions.length + 1)}টি`);
      return;
    }

    // Default 'k_kh_g' or 'k_kh_mcq_cq':
    if (question.type === 'mcq') {
      setSectionKQuestions(prev => [...prev, question]);
      showNotificationMsg(`'ক' বিভাগ (MCQ)-এ প্রশ্ন যুক্ত হয়েছে!`);
    } else if (question.type === 'short') {
      setSectionKhQuestions(prev => [...prev, question]);
      showNotificationMsg(`'খ' বিভাগ (সংক্ষিপ্ত প্রশ্ন)-এ প্রশ্ন যুক্ত হয়েছে!`);
    } else if (question.type === 'cq') {
      setSectionGQuestions(prev => [...prev, question]);
      showNotificationMsg(`'গ' বিভাগ (সৃজনশীল CQ)-এ প্রশ্ন যুক্ত হয়েছে!`);
    }
  };

  // Remove question from a section
  const handleRemoveQuestion = (section: 'k' | 'kh' | 'g', index: number) => {
    if (section === 'k') {
      setSectionKQuestions(prev => prev.filter((_, i) => i !== index));
    } else if (section === 'kh') {
      setSectionKhQuestions(prev => prev.filter((_, i) => i !== index));
    } else if (section === 'g') {
      setSectionGQuestions(prev => prev.filter((_, i) => i !== index));
    }
    showNotificationMsg('প্রশ্নটি প্রশ্নপত্র থেকে সরানো হয়েছে।');
  };

  // Swap question: replace selected question with another from question bank
  const handleConfirmSwap = (newQuestion: QuestionItem) => {
    if (!questionToSwap) return;
    const { section, index } = questionToSwap;

    if (section === 'k') {
      setSectionKQuestions(prev => prev.map((q, i) => i === index ? newQuestion : q));
    } else if (section === 'kh') {
      setSectionKhQuestions(prev => prev.map((q, i) => i === index ? newQuestion : q));
    } else if (section === 'g') {
      setSectionGQuestions(prev => prev.map((q, i) => i === index ? newQuestion : q));
    }

    setSwapModalOpen(false);
    setQuestionToSwap(null);
    showNotificationMsg('প্রশ্নটি সফলভাবে নতুন প্রশ্ন দিয়ে প্রতিস্থাপন করা হয়েছে!');
  };

  // Move question up/down
  const handleReorderQuestion = (section: 'k' | 'kh' | 'g', index: number, direction: 'up' | 'down') => {
    const list = section === 'k' ? [...sectionKQuestions] : section === 'kh' ? [...sectionKhQuestions] : [...sectionGQuestions];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    if (section === 'k') setSectionKQuestions(list);
    else if (section === 'kh') setSectionKhQuestions(list);
    else setSectionGQuestions(list);
  };

  // Save edited question
  const handleSaveEditedQuestion = () => {
    if (!editingQuestion) return;
    const { section, index, question } = editingQuestion;

    if (section === 'k') {
      setSectionKQuestions(prev => prev.map((q, i) => i === index ? question : q));
    } else if (section === 'kh') {
      setSectionKhQuestions(prev => prev.map((q, i) => i === index ? question : q));
    } else if (section === 'g') {
      setSectionGQuestions(prev => prev.map((q, i) => i === index ? question : q));
    }

    setEditModalOpen(false);
    setEditingQuestion(null);
    showNotificationMsg('প্রশ্নের পরিবর্তন সংরক্ষিত হয়েছে!');
  };

  // Create Custom Question and immediately route into appropriate section
  const handleCreateCustomQuestion = () => {
    if (customType === 'mcq') {
      if (!customQuestionText.trim() || !customOptions[0].trim() || !customOptions[1].trim()) {
        alert('দয়া করে এমসিকিউ প্রশ্ন এবং অন্তত প্রথম ২টি অপশন লিখুন।');
        return;
      }
      const newMcq: MCQQuestion = {
        id: `custom-mcq-${Date.now()}`,
        subject: config.subject,
        chapter: 'কাস্টম প্রশ্ন',
        question: customQuestionText,
        options: [...customOptions],
        correctOption: customCorrect,
        marks: customMarks || 1,
        type: 'mcq',
        importance: 'very_high'
      };
      addCustomQuestion(newMcq);
      handleAddQuestionToPaper(newMcq);
    } else if (customType === 'short') {
      if (!customQuestionText.trim()) {
        alert('দয়া করে সংক্ষিপ্ত প্রশ্নটি লিখুন।');
        return;
      }
      const newShort: ShortQuestion = {
        id: `custom-short-${Date.now()}`,
        subject: config.subject,
        chapter: 'কাস্টম প্রশ্ন',
        question: customQuestionText,
        marks: customMarks || 2,
        type: 'short',
        importance: 'very_high'
      };
      addCustomQuestion(newShort);
      handleAddQuestionToPaper(newShort);
    } else if (customType === 'cq') {
      if (!customStimulus.trim() || !customSubQuestions[0].question.trim()) {
        alert('দয়া করে উদ্দীপক এবং অন্তত "ক" উপ-প্রশ্নটি লিখুন।');
        return;
      }
      const newCq: CQQuestion = {
        id: `custom-cq-${Date.now()}`,
        subject: config.subject,
        chapter: 'কাস্টম প্রশ্ন',
        stimulus: customStimulus,
        subQuestions: [...customSubQuestions],
        marks: 10,
        type: 'cq',
        importance: 'very_high'
      };
      addCustomQuestion(newCq);
      handleAddQuestionToPaper(newCq);
    }

    // Reset form
    setCustomQuestionText('');
    setCustomStimulus('');
    setCustomOptions(['', '', '', '']);
    setShowCustomModal(false);
  };

  // Format creation handler (Blueprint confirmation)
  const handleCreateBlueprint = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig(prev => ({ ...prev, isCreated: true }));
    setShowConfigPanel(false);
    if (sectionKQuestions.length === 0 && sectionKhQuestions.length === 0 && sectionGQuestions.length === 0) {
      showNotificationMsg('✨ প্রশ্নপত্রের হেডার তৈরি হয়েছে! সম্পূর্ণ ২টি ব্ল্যাঙ্ক পেজ প্রস্তুত। এবার পছন্দমতো প্রশ্ন যোগ করুন।');
    } else {
      showNotificationMsg('✨ প্রশ্নপত্রের ফরম্যাট সফলভাবে আপডেট করা হয়েছে!');
    }
  };

  // Reset to a brand new blank question paper
  const handleCreateNewBlankPaper = () => {
    setSectionKQuestions([]);
    setSectionKhQuestions([]);
    setSectionGQuestions([]);
    setCurrentPaperId('');
    setPaperTitle('');
    setConfig(prev => ({
      ...prev,
      isCreated: false
    }));
    setShowConfigPanel(true);
    setViewMode('builder');
    showNotificationMsg('✨ নতুন প্রশ্নপত্র তৈরির পাতা প্রস্তুত! হেডার তথ্য পূরণ করে "প্রশ্নপত্র তৈরি করুন" বাটনে চাপ দিন।');
  };

  // Load 1-Click Complete Model Booklets (SSC Math 100 Marks, SSC English 2nd Paper, 4-Page English)
  const handleLoadPresetBooklet = (type: 'ssc_math_100' | 'ssc_english_2nd' | 'english_4page') => {
    let presetData: PresetBookletData;
    if (type === 'ssc_math_100') {
      presetData = getSSCMath100MarksPreset(institution.nameBn);
    } else if (type === 'ssc_english_2nd') {
      presetData = getSSCEnglish2ndPaperPreset(institution.nameEn || institution.nameBn);
    } else {
      presetData = getEnglish4PageBookletPreset(institution.nameEn || institution.nameBn);
    }

    setConfig({
      ...presetData.config,
      pattern: presetData.config.pattern as PaperSectionPattern
    });
    setSectionKQuestions(presetData.sectionKQuestions);
    setSectionKhQuestions(presetData.sectionKhQuestions);
    setSectionGQuestions(presetData.sectionGQuestions);
    setPaperTitle(presetData.paperTitle);
    setCurrentPaperId(`paper-preset-${Date.now()}`);
    setPaperLayoutMode('landscape_booklet');
    setViewMode('preview');
    showNotificationMsg(`🎉 "${presetData.paperTitle}" সফলভাবে লোড হয়েছে! ৪-পৃষ্ঠার লাইভ বুকলেট প্রিভিউ নিচে প্রদর্শিত হচ্ছে।`);
  };

  // Open Save Modal
  const handleOpenSaveModal = () => {
    if (!paperTitle.trim()) {
      setPaperTitle(`${config.className} ${config.subject} - ${config.examTitle}`);
    }
    setShowSaveModal(true);
  };

  // Confirm and persist to savedExamPapers in AppContext
  const handleConfirmSave = () => {
    const paperId = currentPaperId || `paper-${Date.now()}`;
    const title = paperTitle.trim() || `${config.className} ${config.subject} - ${config.examTitle}`;
    
    const paperToSave: ExamPaperConfig = {
      id: paperId,
      paperTitle: title,
      coachingName: config.academyName,
      examTitle: config.examTitle,
      subject: config.subject,
      subjectCode: config.subjectCode,
      class: config.className,
      section: config.section,
      duration: config.duration,
      totalMarks: parseInt(config.totalMarks, 10) || 100,
      format: config.pattern === 'mcq_only' ? 'mcq' : config.pattern === 'cq_only' ? 'cq' : 'combined',
      pattern: config.pattern,
      pageLayout: 'two_column',
      paperLayoutMode: paperLayoutMode,
      instructions: config.instructions,
      watermark: {
        enabled: showWatermark,
        type: 'image',
        text: '',
        imageUrl: watermarkImage,
        opacity: watermarkOpacity
      },
      columns: printColumns,
      showAnswersInPrint: showAnswerKey,
      selectedQuestionIds: [
        ...sectionKQuestions.map(q => q.id),
        ...sectionKhQuestions.map(q => q.id),
        ...sectionGQuestions.map(q => q.id)
      ],
      customQuestions: [],
      sectionKQuestions: [...sectionKQuestions],
      sectionKhQuestions: [...sectionKhQuestions],
      sectionGQuestions: [...sectionGQuestions],
      date: new Date().toLocaleDateString('bn-BD'),
      createdAt: new Date().toISOString()
    };

    saveExamPaper(paperToSave);
    setCurrentPaperId(paperId);
    setShowSaveModal(false);
    showNotificationMsg(`✅ "${title}" প্রশ্নপত্রটি সফলভাবে সংরক্ষিত হয়েছে! "প্রশ্নপত্রসমূহ" তালিকায় এটি যুক্ত হয়েছে।`);
  };

  // Load a saved paper into builder or preview
  const handleLoadSavedPaper = (paper: ExamPaperConfig, targetMode: 'preview' | 'builder' = 'preview') => {
    setCurrentPaperId(paper.id);
    setPaperTitle(paper.paperTitle || `${paper.class} ${paper.subject} - ${paper.examTitle}`);
    
    setConfig({
      academyName: paper.coachingName || institution.nameBn || 'কলাবাড়িয়া মডেল একাডেমি ও কোচিং সেন্টার',
      examTitle: paper.examTitle || 'মডেল টেস্ট মূল্যায়ন পরীক্ষা - ২০২৬',
      subject: paper.subject || 'পদার্থবিজ্ঞান',
      subjectCode: paper.subjectCode || '১৭৪',
      className: paper.class || '১০ম শ্রেণি (SSC পরীক্ষার্থী)',
      section: paper.section || 'ক শাখা (বিজ্ঞান)',
      totalMarks: String(paper.totalMarks || 100),
      duration: paper.duration || '২ ঘণ্টা ৩০ মিনিট',
      pattern: (paper.pattern as any) || 'k_kh_g',
      instructions: paper.instructions || 'বিশেষ দ্রষ্টব্য: ডান পাশের সংখ্যা প্রশ্নের পূর্ণমান জ্ঞাপক।',
      isCreated: true
    });

    if (paper.paperLayoutMode) {
      setPaperLayoutMode(paper.paperLayoutMode);
    }
    if (paper.watermark) {
      setShowWatermark(paper.watermark.enabled);
      if (paper.watermark.imageUrl) {
        setWatermarkImage(paper.watermark.imageUrl);
      }
      if (paper.watermark.opacity !== undefined) {
        setWatermarkOpacity(paper.watermark.opacity);
      }
    }
    if (paper.showAnswersInPrint !== undefined) {
      setShowAnswerKey(paper.showAnswersInPrint);
    }

    if (paper.sectionKQuestions && paper.sectionKQuestions.length > 0) {
      setSectionKQuestions(paper.sectionKQuestions);
    } else if (paper.selectedQuestionIds && paper.selectedQuestionIds.length > 0) {
      const matched = questions.filter(q => paper.selectedQuestionIds.includes(q.id));
      setSectionKQuestions(matched.filter(q => q.type === 'mcq'));
    } else {
      setSectionKQuestions([]);
    }

    if (paper.sectionKhQuestions && paper.sectionKhQuestions.length > 0) {
      setSectionKhQuestions(paper.sectionKhQuestions);
    } else if (paper.selectedQuestionIds && paper.selectedQuestionIds.length > 0) {
      const matched = questions.filter(q => paper.selectedQuestionIds.includes(q.id));
      setSectionKhQuestions(matched.filter(q => q.type === 'short'));
    } else {
      setSectionKhQuestions([]);
    }

    if (paper.sectionGQuestions && paper.sectionGQuestions.length > 0) {
      setSectionGQuestions(paper.sectionGQuestions);
    } else if (paper.selectedQuestionIds && paper.selectedQuestionIds.length > 0) {
      const matched = questions.filter(q => paper.selectedQuestionIds.includes(q.id));
      setSectionGQuestions(matched.filter(q => q.type === 'cq'));
    } else {
      setSectionGQuestions([]);
    }

    setViewMode(targetMode);
    showNotificationMsg(`📄 "${paper.paperTitle || paper.examTitle}" প্রশ্নপত্রটি সফলভাবে লোড করা হয়েছে!`);
  };

  // State for tracking PDF download per paper in Archive
  const [downloadingPaperId, setDownloadingPaperId] = useState<string | null>(null);

  // Download a saved paper directly as a multi-page PDF from Archive
  const handleDownloadSavedPaper = async (paper: ExamPaperConfig) => {
    setDownloadingPaperId(paper.id);
    handleLoadSavedPaper(paper, 'preview');
    const isPortrait = paper.paperLayoutMode === 'standard_portrait';
    showNotificationMsg(`⏳ "${paper.paperTitle || paper.examTitle}" এর পূর্ণাঙ্গ পিডিএফ প্রস্তুত হচ্ছে...`);

    setTimeout(async () => {
      try {
        const cleanFileName = (paper.paperTitle || `${paper.class}_${paper.subject}_${paper.examTitle}`)
          .replace(/[/\\?%*:|"<>]/g, '_')
          .replace(/\s+/g, '_');
        
        const elementIds = isPortrait ? ['printable-exam-paper'] : ['booklet-sheet-1', 'booklet-sheet-2'];
        const orientation = isPortrait ? 'portrait' : 'landscape';

        const success = await exportElementsToPDF(elementIds, {
          fileName: `${cleanFileName}.pdf`,
          orientation
        });

        if (!success) {
          window.print();
        } else {
          showNotificationMsg(`✅ "${paper.paperTitle || paper.examTitle}" সফলভাবে পিডিএফ ফাইল হিসেবে ডাউনলোড হয়েছে!`);
        }
      } catch (err) {
        console.error('PDF export error:', err);
        window.print();
      } finally {
        setDownloadingPaperId(null);
      }
    }, 600);
  };

  // Print a saved paper immediately
  const handlePrintSavedPaper = (paper: ExamPaperConfig) => {
    handleLoadSavedPaper(paper, 'preview');
    setTimeout(() => {
      handlePrint();
    }, 400);
  };

  // Synchronize with navigation intents from Sidebar
  useEffect(() => {
    if (!examNavIntent) return;

    if (examNavIntent.paperId) {
      const found = savedExamPapers.find(p => p.id === examNavIntent.paperId);
      if (found) {
        handleLoadSavedPaper(found, examNavIntent.tab === 'builder' ? 'builder' : 'preview');
        return;
      }
    }

    if (examNavIntent.tab === 'saved-papers') {
      setViewMode('saved-papers');
    } else if (examNavIntent.tab === 'preview') {
      setViewMode('preview');
    } else if (examNavIntent.tab === 'builder') {
      setViewMode('builder');
    }

    if (examNavIntent.action === 'preset_board' && examNavIntent.tab === 'builder') {
      // Create new blank paper
      handleCreateNewBlankPaper();
    }
  }, [examNavIntent, savedExamPapers]);

  // Print Question Paper trigger with dynamic page orientation
  const handlePrint = () => {
    const styleId = 'dynamic-booklet-landscape-print-style';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    if (paperLayoutMode === 'landscape_booklet') {
      styleTag.innerHTML = `
        @media print {
          @page {
            size: landscape !important;
            margin: 4mm 4mm 4mm 4mm !important;
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
          .booklet-print-sheet {
            page-break-after: always !important;
            break-after: page !important;
            width: 100% !important;
            height: 100vh !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .booklet-print-sheet:last-of-type {
            page-break-after: auto !important;
            break-after: auto !important;
          }
        }
      `;
    } else {
      styleTag.innerHTML = `
        @media print {
          @page {
            size: A4 portrait !important;
            margin: 0.5in !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-exam-paper {
            border: 1.5px solid #0f172a !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
          }
        }
      `;
    }
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-['Hind_Siliguri',sans-serif]">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Top Main Command Bar - Responsive, Beautiful & Stays strictly within screen bounds */}
      {viewMode !== 'saved-papers' && (
        <>
          <div className="bg-white rounded-3xl shadow-xs border border-[#c0dfe1] p-4 sm:p-5 space-y-4 print:hidden text-[#1f332c]">
          {/* Row 1: Studio Title & Primary Quick Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#c0dfe1]/60">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-[#b1c0a1]/30 border border-[#b1c0a1] text-[#78988b] flex items-center justify-center font-bold shrink-0 shadow-2xs">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-black text-[#1f332c] tracking-tight">
                    প্রশ্নপত্র তৈরি ও প্রিন্ট স্টুডিও
                  </h1>
                  {paperTitle && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#b1c0a1]/40 text-[#1f332c] border border-[#b1c0a1] truncate max-w-xs shadow-2xs">
                      {paperTitle}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#53685e] mt-0.5">
                  ক, খ, গ বিভাগীয় ফরম্যাট • ১০০ মার্কের ৪-সেকশন ল্যান্ডস্কেপ ভাঁজ বুকলেট ও স্ট্যান্ডার্ড পোর্ট্রেট প্রিন্ট
                </p>
              </div>
            </div>

            {/* Top Quick Actions: New Blank, Save, and Print */}
            <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
              <button
                id="btn-create-new-blank-paper"
                onClick={handleCreateNewBlankPaper}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#1f332c] font-bold text-xs sm:text-sm transition cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-2xs"
                title="সব প্রশ্ন খালি করে সম্পূর্ণ নতুন ব্ল্যাঙ্ক প্রশ্নপত্র তৈরি করুন"
              >
                <PlusCircle className="w-4 h-4 text-[#78988b]" />
                <span>নতুন প্রশ্নপত্র তৈরি</span>
              </button>

              <button
                id="btn-save-paper-top"
                onClick={handleOpenSaveModal}
                className="px-4 py-2 rounded-xl bg-[#749fa0] hover:bg-[#5f8788] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                title="বর্তমান প্রশ্নপত্রটি সেভ করুন"
              >
                <Save className="w-4 h-4 text-white" />
                <span>সেভ করুন</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4 text-white" />
                <span>প্রিন্ট করুন</span>
              </button>
            </div>
          </div>

          {/* Row 2: Module Badges Navigation (বডিতে আকর্ষণীয় ও রেসপনসিভভাবে বিন্যস্ত) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
            {/* 1. প্রশ্নপত্র বিল্ডার */}
            <button
              onClick={() => setViewMode('builder')}
              className={`p-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border text-center ${
                viewMode === 'builder'
                  ? 'bg-[#78988b] text-white shadow-md border-[#78988b] ring-2 ring-[#78988b]/30'
                  : 'bg-[#eae8d9]/40 text-[#53685e] hover:bg-[#eae8d9] hover:text-[#1f332c] border-[#c0dfe1]'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span className="truncate">প্রশ্নপত্র বিল্ডার</span>
            </button>

            {/* 2. ৪-পৃষ্ঠা বুকলেট */}
            <button
              onClick={() => {
                setViewMode('preview');
                setPaperLayoutMode('landscape_booklet');
              }}
              className={`p-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border text-center ${
                viewMode === 'preview' && paperLayoutMode === 'landscape_booklet'
                  ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-md border-emerald-600 ring-2 ring-emerald-400/40'
                  : 'bg-[#eae8d9]/40 text-[#53685e] hover:bg-[#eae8d9] hover:text-[#1f332c] border-[#c0dfe1]'
              }`}
              title="১০০ নম্বরের মডেল টেস্ট: ২টি ল্যান্ডস্কেপ পেজ (এপিডোবিট প্রিন্ট ও মাঝখানে ভাঁজ)"
            >
              <FoldHorizontal className="w-4 h-4 shrink-0" />
              <span className="truncate">৪-পৃষ্ঠা বুকলেট</span>
            </button>

            {/* 3. পোর্ট্রেট A4 */}
            <button
              onClick={() => {
                setViewMode('preview');
                setPaperLayoutMode('standard_portrait');
              }}
              className={`p-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border text-center ${
                viewMode === 'preview' && paperLayoutMode === 'standard_portrait'
                  ? 'bg-[#78988b] text-white shadow-md border-[#78988b] ring-2 ring-[#78988b]/30'
                  : 'bg-[#eae8d9]/40 text-[#53685e] hover:bg-[#eae8d9] hover:text-[#1f332c] border-[#c0dfe1]'
              }`}
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span className="truncate">পোর্ট্রেট A4</span>
            </button>

            {/* 4. ওএমআর শিট (OMR) */}
            <button
              onClick={() => setViewMode('omr-sheet')}
              className={`p-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border text-center ${
                viewMode === 'omr-sheet'
                  ? 'bg-emerald-700 text-white shadow-md border-emerald-600 ring-2 ring-emerald-400/40'
                  : 'bg-[#eae8d9]/40 text-[#53685e] hover:bg-[#eae8d9] hover:text-[#1f332c] border-[#c0dfe1]'
              }`}
              title="২০, ২৫, ৩০, ৫০ বা ১০০ নম্বরের ওএমআর শিট জেনারেটর ও ১-ক্লিক প্রিন্ট"
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span className="truncate">ওএমআর শিট (OMR)</span>
            </button>

            {/* 5. উত্তরমালা ও সমাধান */}
            <button
              onClick={() => setViewMode('answer-key')}
              className={`p-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border text-center ${
                viewMode === 'answer-key'
                  ? 'bg-teal-700 text-white shadow-md border-teal-600 ring-2 ring-teal-400/40'
                  : 'bg-[#eae8d9]/40 text-[#53685e] hover:bg-[#eae8d9] hover:text-[#1f332c] border-[#c0dfe1]'
              }`}
              title="সেটভিত্তিক (ক, খ, গ, ঘ) বহুনির্বাচনী উত্তর সারণি ও শিক্ষক সমাধান গাইড"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="truncate">উত্তরমালা ও সমাধান</span>
            </button>

            {/* 6. প্রশ্নপত্র আর্কাইভ */}
            <button
              onClick={() => setViewMode('saved-papers')}
              className={`p-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border text-center ${
                (viewMode as string) === 'saved-papers'
                  ? 'bg-[#78988b] text-white shadow-md border-[#78988b] ring-2 ring-[#78988b]/30'
                  : 'bg-[#eae8d9]/40 text-[#53685e] hover:bg-[#eae8d9] hover:text-[#1f332c] border-[#c0dfe1]'
              }`}
            >
              <Bookmark className="w-4 h-4 shrink-0" />
              <span className="truncate">প্রশ্নপত্র আর্কাইভ</span>
              <span className="px-1.5 py-0.5 bg-[#b1c0a1]/40 text-[#1f332c] rounded-full text-[10px] font-black shrink-0">
                {toBengaliNumber(savedExamPapers.length)}
              </span>
            </button>
          </div>
        </div>

      {/* 1-Click Ready Model Booklet Presets (SSC Math 100 Marks, SSC English 2nd Paper, 4-Page English) */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-xs no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-emerald-200/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-2xs shrink-0">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>বোর্ড স্ট্যান্ডার্ড রেডিমেড মডেল বুকলেট (১-ক্লিকে লোড ও ৪-পৃষ্ঠা বুকলেট প্রিন্ট)</span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                  ১০০ মার্কস
                </span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                NCTB কারিকুলাম ও বোর্ড পরীক্ষার আদলে তৈরি সম্পূর্ণ প্রশ্নপত্র — ১ ক্লিকে লোড করে সরাসরি ভাঁজ বুকলেটে প্রিন্ট ও পিডিএফ ডাউনলোড করুন
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
          {/* Preset 1: SSC Mathematics Full 100 Marks */}
          <button
            type="button"
            onClick={() => handleLoadPresetBooklet('ssc_math_100')}
            className="p-3.5 rounded-xl bg-white hover:bg-emerald-50/70 border border-emerald-200/90 hover:border-emerald-400 text-left transition shadow-2xs group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-emerald-900 group-hover:text-emerald-700 flex items-center gap-1.5">
                  <span className="text-base">📐</span>
                  <span>SSC Mathematics Model Booklet</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.2 rounded">
                  ১০০ নম্বর
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                ক বিভাগ: ৩০টি বহুনির্বাচনী প্রশ্ন (৩০ নম্বর) + খ বিভাগ: ১১টি সৃজনশীল ক-খ-গ-ঘ বিভাগসহ (৭০ নম্বর)।
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
              <span>৪-পৃষ্ঠা বুকলেট লোড করুন</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>

          {/* Preset 2: SSC English 2nd Paper */}
          <button
            type="button"
            onClick={() => handleLoadPresetBooklet('ssc_english_2nd')}
            className="p-3.5 rounded-xl bg-white hover:bg-blue-50/70 border border-blue-200/90 hover:border-blue-400 text-left transition shadow-2xs group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-blue-950 group-hover:text-blue-700 flex items-center gap-1.5">
                  <span className="text-base">📝</span>
                  <span>SSC English 2nd Paper Booklet</span>
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-mono font-bold px-1.5 py-0.2 rounded">
                  100 Marks
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                Part A: Grammar 11 Items (60 Marks) + Part B: Composition CV, Letter, Paragraph, Essay (40 Marks)।
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-700">
              <span>গ্রামার ও রাইটিং লোড করুন</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>

          {/* Preset 3: 4-Page English Model Question Booklet */}
          <button
            type="button"
            onClick={() => handleLoadPresetBooklet('english_4page')}
            className="p-3.5 rounded-xl bg-white hover:bg-purple-50/70 border border-purple-200/90 hover:border-purple-400 text-left transition shadow-2xs group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-purple-950 group-hover:text-purple-700 flex items-center gap-1.5">
                  <span className="text-base">📖</span>
                  <span>4-Page English Model Booklet</span>
                </span>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-mono font-bold px-1.5 py-0.2 rounded">
                  4 Pages
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                P1: Seen Passage • P2: Unseen Passage & Table • P3: Core Grammar Cloze & Tag • P4: Guided Writing।
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-purple-700">
              <span>কমপ্লিট ৪-পৃষ্ঠা লোড করুন</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>
        </div>
      </div>
    </>
  )}

  {/* Step 1: Format Blueprint & Header Configuration Card - Visible only in Builder */}
  {viewMode === 'builder' && (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:hidden">
        <div 
          onClick={() => setShowConfigPanel(!showConfigPanel)}
          className="p-4 md:p-5 bg-gradient-to-r from-slate-50 to-emerald-50/40 border-b border-slate-200 flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              ১
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  প্রশ্নপত্রের ফরম্যাট ও একাডেমি হেডার নির্ধারণ
                </h2>
                {config.isCreated ? (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center gap-1">
                    <Check className="w-3 h-3" /> ফরম্যাট প্রস্তুত
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    সেট করুন
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                একাডেমির নাম, বিষয়, পূর্ণমান, সময় ও ক-খ-গ বিভাগীয় ধরণ ড্রপডাউন থেকে নির্বাচন করুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 hidden sm:inline">
              {showConfigPanel ? 'সংকুচিত করুন' : 'পরিবর্তন / এডিট করুন'}
            </span>
            {showConfigPanel ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
          </div>
        </div>

        {/* Blueprint Form Body */}
        {showConfigPanel && (
          <form onSubmit={handleCreateBlueprint} className="p-4 md:p-6 space-y-5 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Academy Name Dropdown / Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-emerald-600" />
                  <span>একাডেমির নাম (কোচিং / প্রতিষ্ঠান)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={config.academyName}
                    onChange={(e) => setConfig({ ...config, academyName: e.target.value })}
                    placeholder="প্রতিষ্ঠানের নাম লিখুন..."
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition font-medium"
                    required
                  />
                </div>
                <div className="flex gap-1.5 flex-wrap text-[11px] text-slate-400">
                  <span className="text-slate-500 font-semibold">প্রস্তাবিত:</span>
                  <button 
                    type="button" 
                    onClick={() => setConfig({ ...config, academyName: institution.nameBn })}
                    className="text-emerald-600 hover:underline cursor-pointer"
                  >
                    {institution.nameBn}
                  </button>
                </div>
              </div>

              {/* Exam Title Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>পরীক্ষার নাম / মূল্যায়ন শিরোনাম</span>
                </label>
                <select
                  value={config.examTitle}
                  onChange={(e) => setConfig({ ...config, examTitle: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition font-medium"
                >
                  <option value="মডেল টেস্ট মূল্যায়ন পরীক্ষা - ২০২৬">মডেল টেস্ট মূল্যায়ন পরীক্ষা - ২০২৬</option>
                  <option value="১ম সাময়িক মূল্যায়ন পরীক্ষা - ২০২৬">১ম সাময়িক মূল্যায়ন পরীক্ষা - ২০২৬</option>
                  <option value="২য় সাময়িক মূল্যায়ন পরীক্ষা - ২০২৬">২য় সাময়িক মূল্যায়ন পরীক্ষা - ২০২৬</option>
                  <option value="বার্ষিক পরীক্ষা - ২০২৬">বার্ষিক পরীক্ষা - ২০২৬</option>
                  <option value="প্রাক-নির্বাচনী মূল্যায়ন পরীক্ষা - ২০২৬">প্রাক-নির্বাচনী মূল্যায়ন পরীক্ষা - ২০২৬</option>
                  <option value="এসএসসি টেস্ট পরীক্ষা (নির্বাচনী) - ২০২৬">এসএসসি টেস্ট পরীক্ষা (নির্বাচনী) - ২০২৬</option>
                  <option value="সাপ্তাহিক স্পেশাল টেস্ট - ২০২৬">সাপ্তাহিক স্পেশাল টেস্ট - ২০২৬</option>
                  <option value="অধ্যায়ভিত্তিক স্পেশাল মূল্যায়ন টেস্ট">অধ্যায়ভিত্তিক স্পেশাল মূল্যায়ন টেস্ট</option>
                </select>
              </div>

              {/* Subject Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>বিষয় নির্বাচন</span>
                </label>
                <select
                  value={config.subject}
                  onChange={(e) => {
                    const newSub = e.target.value;
                    let code = '১৭৪';
                    if (newSub === 'রসায়ন') code = '১৭৬';
                    else if (newSub === 'সাধারণ গণিত') code = '১০৯';
                    else if (newSub === 'উচ্চতর গণিত') code = '১২৬';
                    else if (newSub === 'জীববিজ্ঞান') code = '১৭৮';
                    else if (newSub === 'তথ্য ও যোগাযোগ প্রযুক্তি') code = '১৫৪';
                    setConfig({ ...config, subject: newSub, subjectCode: code });
                    setPickerSubject(newSub);
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition font-medium"
                >
                  {subjectsList.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                  <option value="সমন্বিত যৌথ বিষয় (বিজ্ঞান বিভাগ)">সমন্বিত যৌথ বিষয় (বিজ্ঞান বিভাগ)</option>
                </select>
              </div>

              {/* Class & Section */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>শ্রেণি ও শাখা</span>
                </label>
                <select
                  value={config.className}
                  onChange={(e) => setConfig({ ...config, className: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition font-medium"
                >
                  <option value="১০ম শ্রেণি (SSC পরীক্ষার্থী)">১০ম শ্রেণি (SSC পরীক্ষার্থী)</option>
                  <option value="৯ম শ্রেণি">৯ম শ্রেণি</option>
                  <option value="৮ম শ্রেণি">৮ম শ্রেণি</option>
                  <option value="৭ম শ্রেণি">৭ম শ্রেণি</option>
                  <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি</option>
                  <option value="বিজ্ঞান বিভাগ">বিজ্ঞান বিভাগ</option>
                  <option value="ব্যবসায় শিক্ষা বিভাগ">ব্যবসায় শিক্ষা বিভাগ</option>
                  <option value="মানবিক বিভাগ">মানবিক বিভাগ</option>
                </select>
              </div>

              {/* Total Marks Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>পূর্ণমান (Total Marks)</span>
                </label>
                <select
                  value={config.totalMarks}
                  onChange={(e) => setConfig({ ...config, totalMarks: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition font-medium"
                >
                  <option value="১০০">১০০ মার্ক (পূর্ণাঙ্গ বোর্ড পরীক্ষা)</option>
                  <option value="৭৫">৭৫ মার্ক (তত্ত্বীয় পরীক্ষা)</option>
                  <option value="৫০">৫০ মার্ক (অর্ধেক সিলেবাস)</option>
                  <option value="৪০">৪০ মার্ক</option>
                  <option value="৩০">৩০ মার্ক (মডেল টেস্ট)</option>
                  <option value="২৫">২৫ মার্ক (ক্লাস টেস্ট)</option>
                  <option value="২০">২০ মার্ক (কুইজ টেস্ট)</option>
                </select>
              </div>

              {/* Duration Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>সময় (Duration)</span>
                </label>
                <select
                  value={config.duration}
                  onChange={(e) => setConfig({ ...config, duration: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition font-medium"
                >
                  <option value="৩ ঘণ্টা">৩ ঘণ্টা</option>
                  <option value="২ ঘণ্টা ৩০ মিনিট">২ ঘণ্টা ৩০ মিনিট</option>
                  <option value="২ ঘণ্টা">২ ঘণ্টা</option>
                  <option value="১ ঘণ্টা ৩০ মিনিট">১ ঘণ্টা ৩০ মিনিট</option>
                  <option value="১ ঘণ্টা">১ ঘণ্টা</option>
                  <option value="৪৫ মিনিট">৪৫ মিনিট</option>
                  <option value="৩০ মিনিট">৩০ মিনিট</option>
                </select>
              </div>
            </div>

            {/* Department / Question Structure Selection */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                প্রশ্নপত্রের ধরণ ও বিভাগীয় গঠন (Question Paper Structure)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  config.pattern === 'k_kh_g'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="pattern"
                    checked={config.pattern === 'k_kh_g'}
                    onChange={() => setConfig({ ...config, pattern: 'k_kh_g' })}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      ক, খ, গ বিভাগ ভিত্তিক প্রশ্নপত্র
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      ক: বহুনির্বাচনী (MCQ) • খ: সংক্ষিপ্ত প্রশ্ন • গ: সৃজনশীল (CQ)
                    </span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  config.pattern === 'mcq_only'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="pattern"
                    checked={config.pattern === 'mcq_only'}
                    onChange={() => setConfig({ ...config, pattern: 'mcq_only' })}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      শুধু বহুনির্বাচনী প্রশ্নপত্র (MCQ Only)
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      ৩০/২৫/৫০টি এমসিকিউ প্রশ্ন নিয়ে তৈরি একক প্রশ্নপত্র
                    </span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  config.pattern === 'cq_only'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="pattern"
                    checked={config.pattern === 'cq_only'}
                    onChange={() => setConfig({ ...config, pattern: 'cq_only' })}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      শুধু সৃজনশীল প্রশ্নপত্র (CQ Only)
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      উদ্দীপক ও (ক, খ, গ, ঘ) যুক্ত পূর্ণাঙ্গ সৃজনশীল প্রশ্নমালা
                    </span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  config.pattern === 'short_only'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="pattern"
                    checked={config.pattern === 'short_only'}
                    onChange={() => setConfig({ ...config, pattern: 'short_only' })}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      শুধু সংক্ষিপ্ত প্রশ্নপত্র (Short Question)
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      ১ ও ২ মার্কের জ্ঞানমূলক ও অনুধাবনমূলক প্রশ্নোত্তর
                    </span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  config.pattern === 'k_kh_mcq_cq'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="pattern"
                    checked={config.pattern === 'k_kh_mcq_cq'}
                    onChange={() => setConfig({ ...config, pattern: 'k_kh_mcq_cq' })}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      ক ও খ বিভাগ (MCQ + CQ)
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      ক বিভাগ: বহুনির্বাচনী • খ বিভাগ: সৃজনশীল
                    </span>
                  </div>
                </label>

                {/* English Board Standard Formats */}
                <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  config.pattern === 'english_board_standard'
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="pattern"
                    checked={config.pattern === 'english_board_standard'}
                    onChange={() => setConfig({ 
                      ...config, 
                      pattern: 'english_board_standard', 
                      subject: 'ইংরেজি',
                      subjectCode: '১০৮',
                      instructions: 'Special Note: Figures in the right margin indicate full marks. Answer all the questions in Part A (Grammar) and Part B (Composition).'
                    })}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                      <span>🇬🇧 ইংরেজি বোর্ড স্ট্যান্ডার্ড (১০০ নম্বর)</span>
                      <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold">SSC/Board</span>
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      Part A: Grammar (আইটেম ১-৯) • Part B: Composition (CV, Application, Paragraph)
                    </span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  config.pattern === 'english_grammar_test'
                    ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="pattern"
                    checked={config.pattern === 'english_grammar_test'}
                    onChange={() => setConfig({ 
                      ...config, 
                      pattern: 'english_grammar_test', 
                      subject: 'ইংরেজি',
                      subjectCode: '১০৮',
                      instructions: 'Special Note: Figures in the right margin indicate full marks. Answer all the grammar questions.'
                    })}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                      <span>🇬🇧 কোচিং গ্রামার টেস্ট (৩০/৫০ নম্বর)</span>
                      <span className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold">Coaching</span>
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      শুধুমাত্র গ্রামার আইটেমসমূহ (Right Form of Verbs, Transformation, Narration, Tag ইত্যাদি)
                    </span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  config.pattern === 'english_1st_paper'
                    ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="pattern"
                    checked={config.pattern === 'english_1st_paper'}
                    onChange={() => setConfig({ 
                      ...config, 
                      pattern: 'english_1st_paper', 
                      subject: 'ইংরেজি',
                      subjectCode: '১০৭',
                      instructions: 'Special Note: Figures in the right margin indicate full marks. Answer all the questions in Part A (Reading) and Part B (Writing).'
                    })}
                    className="mt-1 text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-teal-950 flex items-center gap-1.5">
                      <span>🇬🇧 ইংরেজি ১ম পত্র (Reading + Writing)</span>
                      <span className="bg-teal-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold">1st Paper</span>
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      Part A: Reading Test (Seen Comprehension) • Part B: Guided Writing
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit / Create Blueprint Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-900/20 flex items-center gap-2 transition cursor-pointer hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>প্রশ্নপত্র তৈরি করুন (ব্ল্যাঙ্ক শিট ক্রিয়েট) →</span>
              </button>
            </div>
          </form>
        )}

        {/* Compact Summary Bar when config panel is closed */}
        {!showConfigPanel && (
          <div className="px-4 py-3 bg-slate-50 flex items-center justify-between text-xs font-medium text-slate-600 flex-wrap gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span><strong>প্রতিষ্ঠান:</strong> {config.academyName}</span>
              <span className="text-slate-300">|</span>
              <span><strong>পরীক্ষা:</strong> {config.examTitle}</span>
              <span className="text-slate-300">|</span>
              <span><strong>বিষয়:</strong> {config.subject}</span>
              <span className="text-slate-300">|</span>
              <span><strong>সময়:</strong> {config.duration}</span>
              <span className="text-slate-300">|</span>
              <span><strong>নির্ধারিত পূর্ণমান:</strong> {config.totalMarks}</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-emerald-700">
              <span>মোট সংগৃহীত মার্ক: {toBengaliNumber(currentTotalMarks)}</span>
            </div>
          </div>
        )}
      </div>
    )}

      {/* Main Body: Either Builder Mode or Preview Mode */}
      {viewMode === 'builder' ? (
        !config.isCreated ? (
          <div className="bg-white rounded-3xl p-8 md:p-10 border-2 border-dashed border-emerald-300 shadow-sm text-center max-w-2xl mx-auto my-6 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                ধাপ ১: প্রশ্নপত্রের হেডার ও প্রয়োজনীয় তথ্য সেটআপ
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                উপরের বক্সে প্রতিষ্ঠানের নাম, পরীক্ষার নাম, বিষয়, শ্রেণি ও প্রশ্নের প্যাটার্ন নির্বাচন করে 
                <strong className="text-emerald-700"> "প্রশ্নপত্র তৈরি করুন (ব্ল্যাঙ্ক শিট ক্রিয়েট)" </strong> 
                বাটনে চাপ দিন। আপনার দেওয়া তথ্য দিয়ে সম্পূর্ণ ২টি ব্ল্যাঙ্ক পেজ শিট প্রস্তুত হয়ে যাবে এবং প্রশ্ন যোগ করার অপশন উন্মুক্ত হবে।
              </p>
            </div>
            <button
              onClick={() => {
                setConfig(prev => ({ ...prev, isCreated: true }));
                setShowConfigPanel(false);
                showNotificationMsg('✨ হেডার সহ সম্পূর্ণ দুটি ব্ল্যাঙ্ক পেজ প্রস্তুত! এবার পছন্দমতো প্রশ্ন যোগ করুন।');
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-900/20 inline-flex items-center gap-2 cursor-pointer transition hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>প্রশ্নপত্র তৈরি করুন (ব্ল্যাঙ্ক শিট ক্রিয়েট) →</span>
            </button>
          </div>
        ) : (
        <div className="space-y-6">

          {/* Quick English Board Model Loader Bar */}
          {isEnglishPaper && (
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-blue-700/50 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
                    বোর্ড এনালাইসিস সিস্টেম
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
                    <span>🇬🇧 ইংরেজি বোর্ড স্ট্যান্ডার্ড মডেল কোশ্চেন জেনারেটর</span>
                  </h3>
                </div>
                <p className="text-xs text-blue-200 leading-relaxed">
                  অন্যান্য বিষয়ের মতো ইংরেজিতে সিকিউ (ক, খ, গ, ঘ) হয় না। এখানে বোর্ড প্রশ্নের প্যাটার্ন অনুসারে আইটেম ১-৯ (Grammar) এবং কম্পোজিশন ফরম্যাটে ১-ক্লিকে প্রশ্ন তৈরি করুন।
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleLoadEnglishBoardModel}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>১-ক্লিকে ১০০ নম্বর বোর্ড মডেল লোড</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadEnglishGrammarTest}
                  className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/25 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <FileText className="w-4 h-4 text-blue-200" />
                  <span>৫০ মার্ক গ্রামার টেস্ট লোড</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Ribbon: Quick Add from Bank & Custom Write */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                প্রশ্ন ব্যবস্থাপনা:
              </span>
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                মোট প্রশ্ন: {toBengaliNumber(sectionKQuestions.length + sectionKhQuestions.length + sectionGQuestions.length)}টি
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                মোট মান: {toBengaliNumber(currentTotalMarks)} / {toBengaliNumber(config.totalMarks)}
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  setTargetSectionForAdd('auto');
                  setShowAddDrawer(true);
                }}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-cyan-200" />
                <span>প্রশ্ন ব্যাংক থেকে প্রশ্ন যোগ করুন (+Add)</span>
              </button>

              <button
                onClick={() => setShowCustomModal(true)}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-300"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                <span>নতুন প্রশ্ন নিজে লিখুন</span>
              </button>
            </div>
          </div>

          {/* Section K: 'ক' বিভাগ (MCQ) or English 'Part A: Grammar' */}
          {(config.pattern === 'k_kh_g' || config.pattern === 'mcq_only' || config.pattern === 'k_kh_mcq_cq' || isEnglishPaper) && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs ${
                    isEnglishPaper ? 'bg-blue-600' : 'bg-emerald-600'
                  }`}>
                    {isEnglishPaper ? 'A' : 'ক'}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">
                      {isEnglishPaper 
                        ? 'Part A: Grammar (গ্রামার অংশ)' 
                        : config.pattern === 'mcq_only' 
                          ? 'বহুনির্বাচনী প্রশ্নাবলী (MCQ Section)' 
                          : '\'ক\' বিভাগ : বহুনির্বাচনী প্রশ্ন (MCQ)'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      যুক্ত প্রশ্ন: {toBengaliNumber(sectionKQuestions.length)}টি • মোট মার্ক: {toBengaliNumber(sectionKMarks)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTargetSectionForAdd('k');
                    setPickerType(isEnglishPaper ? 'all' : 'mcq');
                    if (isEnglishPaper) setPickerSubject('ইংরেজি');
                    setShowAddDrawer(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition ${
                    isEnglishPaper 
                      ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200' 
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isEnglishPaper ? '+ Part A-তে গ্রামার যোগ করুন' : '+ ক বিভাগে MCQ যোগ করুন'}</span>
                </button>
              </div>

              {/* Questions List */}
              <div className="p-4 divide-y divide-slate-100">
                {sectionKQuestions.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <HelpCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium">
                      {isEnglishPaper ? 'Part A: Grammar অংশে এখনো কোনো প্রশ্ন যোগ করা হয়নি।' : 'ক বিভাগে এখনো কোনো বহুনির্বাচনী প্রশ্ন যোগ করা হয়নি।'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">উপরের বাটন দিয়ে প্রশ্ন ব্যাংক থেকে প্রশ্ন যুক্ত করুন।</p>
                  </div>
                ) : (
                  sectionKQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="py-3.5 flex items-start justify-between gap-4 group">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span className="font-bold text-slate-500 text-xs font-mono bg-slate-100 px-2 py-0.5 rounded-md mt-0.5 shrink-0">
                          {q.itemNumber ? `Item ${q.itemNumber}.` : `${toBengaliNumber(idx + 1)}.`}
                        </span>
                        <div className="space-y-1.5 min-w-0 flex-1">
                          {/* English / Short Item Header */}
                          {q.type === 'short' && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-900 text-sm">
                                  {q.grammarTopic || q.topic || 'Grammar Question'}
                                </span>
                                {q.boardInfo && (
                                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                    🏛️ {q.boardInfo}
                                  </span>
                                )}
                                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  মান: {q.marksDistribution || `${q.marks} Marks`}
                                </span>
                              </div>

                              {/* Clues Box for Board Right Form of Verbs / Gap Filling */}
                              {(q as ShortQuestion).cluesBox && (q as ShortQuestion).cluesBox!.length > 0 && (
                                <div className="p-2.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-xs font-mono text-slate-800 flex flex-wrap gap-1.5 items-center">
                                  <span className="font-bold text-slate-600 font-sans">[Clues]:</span>
                                  {(q as ShortQuestion).cluesBox!.map((clue, cIdx) => (
                                    <span key={cIdx} className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-900 font-bold">
                                      {clue}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <p className="text-xs text-slate-800 whitespace-pre-line font-serif leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-200">
                                {(q as ShortQuestion).question}
                              </p>
                            </div>
                          )}

                          {q.type === 'mcq' && (
                            <>
                              <p className="text-sm font-semibold text-slate-900 leading-snug">
                                {q.question}
                              </p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
                                {q.options.map((opt, oIdx) => {
                                  const labels = ['(ক)', '(খ)', '(গ)', '(ঘ)'];
                                  const isCorrect = q.correctOption === oIdx;
                                  return (
                                    <span key={oIdx} className={`px-2 py-1 rounded-md border ${
                                      isCorrect 
                                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-800 font-semibold' 
                                        : 'bg-slate-50 border-slate-200'
                                    }`}>
                                      <strong className="mr-1">{labels[oIdx]}</strong> {opt}
                                    </span>
                                  );
                                })}
                              </div>
                            </>
                          )}

                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span>বিষয়: {q.subject}</span>
                            <span>•</span>
                            <span>অধ্যায়: {q.chapter}</span>
                            {q.boardInfo && q.type !== 'short' && (
                              <>
                                <span>•</span>
                                <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded font-medium">{q.boardInfo}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons: Swap, Reorder, Remove */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          title="উপরে নিন"
                          disabled={idx === 0}
                          onClick={() => handleReorderQuestion('k', idx, 'up')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          title="নিচে নিন"
                          disabled={idx === sectionKQuestions.length - 1}
                          onClick={() => handleReorderQuestion('k', idx, 'down')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          title="অন্য প্রশ্ন দিয়ে পরিবর্তন / বদলান"
                          onClick={() => {
                            setQuestionToSwap({ section: 'k', index: idx, question: q });
                            setSwapModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-cyan-600 hover:bg-cyan-50 cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          title="প্রশ্নটি বাদ দিন"
                          onClick={() => handleRemoveQuestion('k', idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Section Kh: 'খ' বিভাগ (Short Questions) */}
          {(config.pattern === 'k_kh_g' || config.pattern === 'short_only') && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    খ
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">
                      {config.pattern === 'short_only' ? 'সংক্ষিপ্ত প্রশ্নাবলী' : '\'খ\' বিভাগ : সংক্ষিপ্ত প্রশ্ন (Short Question)'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      যুক্ত প্রশ্ন: {toBengaliNumber(sectionKhQuestions.length)}টি • মোট মার্ক: {toBengaliNumber(sectionKhMarks)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTargetSectionForAdd('kh');
                    setPickerType('short');
                    setShowAddDrawer(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold border border-teal-200 flex items-center gap-1.5 cursor-pointer transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ খ বিভাগে সংক্ষিপ্ত প্রশ্ন যোগ করুন</span>
                </button>
              </div>

              {/* Questions List */}
              <div className="p-4 divide-y divide-slate-100">
                {sectionKhQuestions.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <HelpCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium">খ বিভাগে এখনো কোনো সংক্ষিপ্ত প্রশ্ন যোগ করা হয়নি।</p>
                    <p className="text-xs text-slate-400 mt-1">উপরের বাটন দিয়ে প্রশ্ন ব্যাংক থেকে প্রশ্ন যুক্ত করুন।</p>
                  </div>
                ) : (
                  sectionKhQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="py-3.5 flex items-start justify-between gap-4 group">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="font-bold text-slate-500 text-xs font-mono bg-slate-100 px-2 py-0.5 rounded-md mt-0.5 shrink-0">
                          {toBengaliNumber(idx + 1)}.
                        </span>
                        <div className="space-y-1.5 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 leading-snug">
                            {q.type === 'short' ? q.question : 'প্রশ্ন'}
                          </p>

                          {q.type === 'short' && q.answer && (
                            <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                              <span className="font-bold text-teal-800">নমুনা উত্তর: </span>
                              {q.answer}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span>মান: {toBengaliNumber(q.marks || 2)}</span>
                            <span>•</span>
                            <span>অধ্যায়: {q.chapter}</span>
                            {q.boardInfo && (
                              <>
                                <span>•</span>
                                <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded font-medium">{q.boardInfo}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          title="উপরে নিন"
                          disabled={idx === 0}
                          onClick={() => handleReorderQuestion('kh', idx, 'up')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          title="নিচে নিন"
                          disabled={idx === sectionKhQuestions.length - 1}
                          onClick={() => handleReorderQuestion('kh', idx, 'down')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          title="অন্য প্রশ্ন দিয়ে পরিবর্তন / বদলান"
                          onClick={() => {
                            setQuestionToSwap({ section: 'kh', index: idx, question: q });
                            setSwapModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-cyan-600 hover:bg-cyan-50 cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          title="প্রশ্নটি বাদ দিন"
                          onClick={() => handleRemoveQuestion('kh', idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Section G: 'গ' বিভাগ (CQ) or English 'Part B: Composition' */}
          {(config.pattern === 'k_kh_g' || config.pattern === 'cq_only' || config.pattern === 'k_kh_mcq_cq' || (isEnglishPaper && config.pattern !== 'english_grammar_test')) && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs ${
                    isEnglishPaper ? 'bg-indigo-600' : 'bg-purple-600'
                  }`}>
                    {isEnglishPaper ? 'B' : config.pattern === 'k_kh_mcq_cq' ? 'খ' : 'গ'}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">
                      {isEnglishPaper
                        ? 'Part B: Composition (কম্পোজিশন অংশ)'
                        : config.pattern === 'cq_only' 
                          ? 'সৃজনশীল প্রশ্নাবলী (CQ Section)' 
                          : config.pattern === 'k_kh_mcq_cq'
                            ? '\'খ\' বিভাগ : সৃজনশীল প্রশ্ন (CQ)'
                            : '\'গ\' বিভাগ : সৃজনশীল প্রশ্ন (CQ)'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isEnglishPaper
                        ? `যুক্ত কম্পোজিশন: ${toBengaliNumber(sectionGQuestions.length)}টি • মোট মার্ক: ${toBengaliNumber(sectionGMarks)}`
                        : `যুক্ত সিকিউ: ${toBengaliNumber(sectionGQuestions.length)}টি • মোট মার্ক: ${toBengaliNumber(sectionGMarks)}`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTargetSectionForAdd('g');
                    setPickerType(isEnglishPaper ? 'short' : 'cq');
                    if (isEnglishPaper) setPickerSubject('ইংরেজি');
                    setShowAddDrawer(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition ${
                    isEnglishPaper
                      ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isEnglishPaper ? '+ Part B-তে কম্পোজিশন যোগ করুন' : '+ সৃজনশীল (CQ) যোগ করুন'}</span>
                </button>
              </div>

              {/* Questions List */}
              <div className="p-4 divide-y divide-slate-100">
                {sectionGQuestions.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <HelpCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium">
                      {isEnglishPaper ? 'Part B: Composition অংশে এখনো কোনো প্রশ্ন যোগ করা হয়নি।' : 'সৃজনশীল বিভাগে এখনো কোনো প্রশ্ন যোগ করা হয়নি।'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {isEnglishPaper ? 'উপরের বাটন দিয়ে প্রশ্ন ব্যাংক থেকে কম্পোজিশন (Paragraph, Application, CV ইত্যাদি) যোগ করুন।' : 'উপরের বাটন দিয়ে প্রশ্ন ব্যাংক থেকে উদ্দীপকযুক্ত সিকিউ প্রশ্ন যুক্ত করুন।'}
                    </p>
                  </div>
                ) : (
                  sectionGQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="py-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-2.5">
                          <span className={`font-bold text-xs px-2 py-0.5 rounded-md shrink-0 ${
                            isEnglishPaper ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {isEnglishPaper && q.itemNumber ? `Item ${q.itemNumber}.` : `প্রশ্ন ${toBengaliNumber(idx + 1)}`}
                          </span>
                          <span className="text-xs text-slate-500">অধ্যায়: {q.chapter} {q.boardInfo && `(${q.boardInfo})`}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            title="উপরে নিন"
                            disabled={idx === 0}
                            onClick={() => handleReorderQuestion('g', idx, 'up')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            title="নিচে নিন"
                            disabled={idx === sectionGQuestions.length - 1}
                            onClick={() => handleReorderQuestion('g', idx, 'down')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            title="অন্য প্রশ্ন দিয়ে পরিবর্তন করুন"
                            onClick={() => {
                              setQuestionToSwap({ section: 'g', index: idx, question: q });
                              setSwapModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-cyan-600 hover:bg-cyan-50 cursor-pointer"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            title="প্রশ্নটি বাদ দিন"
                            onClick={() => handleRemoveQuestion('g', idx)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Composition Short Question Render */}
                      {q.type === 'short' && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">
                              {q.grammarTopic || q.topic || 'Composition Item'}
                            </span>
                            {q.boardInfo && (
                              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                🏛️ {q.boardInfo}
                              </span>
                            )}
                            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                              মান: {q.marksDistribution || `${q.marks} Marks`}
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 whitespace-pre-line font-serif leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-200">
                            {q.question}
                          </p>
                        </div>
                      )}

                      {q.type === 'cq' && (
                        <div className="space-y-2">
                          {/* Stimulus */}
                          <div className="p-3 bg-slate-50/80 rounded-xl text-xs text-slate-800 leading-relaxed font-serif">
                            <span className="font-bold text-slate-900 not-italic block mb-1">উদ্দীপক:</span>
                            {q.stimulus}
                          </div>

                          {/* Sub questions */}
                          <div className="space-y-1 pl-2 border-l-2 border-purple-200">
                            {q.subQuestions.map(sq => (
                              <div key={sq.label} className="text-xs flex items-center justify-between text-slate-700">
                                <span><strong>({sq.label})</strong> {sq.question}</span>
                                <span className="text-slate-400 font-mono">[{toBengaliNumber(sq.marks)}]</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Action Bar: Save Question Paper & Preview */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center md:text-left">
              <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>প্রশ্ন সাজানো শেষ হলে এখান থেকে সংরক্ষণ বা প্রিন্ট করুন</span>
              </h3>
              <p className="text-xs text-slate-500">
                মোট সংযুক্ত প্রশ্ন: {toBengaliNumber(sectionKQuestions.length + sectionKhQuestions.length + sectionGQuestions.length)}টি | বর্তমান পূর্ণমান: {toBengaliNumber(currentTotalMarks)} / {toBengaliNumber(config.totalMarks)}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              {/* Prominent Save Button as explicitly requested by user */}
              <button
                id="btn-save-exam-paper-bottom"
                onClick={handleOpenSaveModal}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-teal-900/20 inline-flex items-center gap-2 cursor-pointer transition hover:scale-[1.02]"
              >
                <Bookmark className="w-4 h-4 text-teal-200" />
                <span>সেভ প্রশ্নপত্র</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('preview');
                  setPaperLayoutMode('landscape_booklet');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md inline-flex items-center gap-2 cursor-pointer transition hover:scale-[1.02]"
              >
                <FoldHorizontal className="w-4 h-4 text-emerald-200" />
                <span>৪-পৃষ্ঠা বুকলেট প্রিভিউ</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('preview');
                  setPaperLayoutMode('standard_portrait');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-300 inline-flex items-center gap-2 cursor-pointer transition"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span>পোর্ট্রেট A4</span>
              </button>
            </div>
          </div>
        </div>
        )
      ) : viewMode === 'saved-papers' ? (
        /* Saved Papers List / Archive View - Strictly stores and displays created questions */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold shadow-xs">
                <Bookmark className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  প্রশ্নপত্র আর্কাইভ (সংরক্ষিত প্রশ্নপত্রসমূহ)
                </h2>
                <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                  এখানে পূর্বে তৈরি করা সকল প্রশ্নপত্র জমা রয়েছে। যেকোনো সংরক্ষিত প্রশ্নপত্রে ক্লিক করে দেখতে, এডিট করতে, প্রিন্ট দিতে ও সম্পূর্ণ পিডিএফ ডাউনলোড করতে পারেন।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 border border-teal-200/90 text-teal-800 text-xs font-bold font-sans">
              <FolderArchive className="w-4 h-4 text-teal-600" />
              <span>মোট জমা: {toBengaliNumber(savedExamPapers.length)}টি প্রশ্নপত্র</span>
            </div>
          </div>

          {savedExamPapers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Bookmark className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800">কোনো সংরক্ষিত প্রশ্নপত্র নেই</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  আপনি যখন নতুন প্রশ্নপত্র তৈরিতে গিয়ে ফরম্যাট তৈরি করবেন এবং প্রশ্ন যোগ করে "সেভ প্রশ্নপত্র" বাটনে ক্লিক করবেন, তখন তা সিরিয়ালি এই আর্কাইভে যুক্ত হবে।
                </p>
              </div>
              <button
                onClick={handleCreateNewBlankPaper}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md cursor-pointer transition inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>প্রথম প্রশ্নপত্রটি তৈরি করুন</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-500 px-1">
                মোট সংরক্ষিত প্রশ্নপত্র: {toBengaliNumber(savedExamPapers.length)}টি
              </div>

              <div className="grid grid-cols-1 gap-4">
                {savedExamPapers.map((paper, index) => {
                  const totalQuestions = (paper.sectionKQuestions?.length || 0) + 
                    (paper.sectionKhQuestions?.length || 0) + 
                    (paper.sectionGQuestions?.length || 0) || 
                    paper.selectedQuestionIds?.length || 0;

                  return (
                    <div
                      key={paper.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group/card"
                    >
                      {/* Clickable Paper Info Area */}
                      <div 
                        onClick={() => handleLoadSavedPaper(paper, 'preview')}
                        className="flex items-start gap-4 cursor-pointer flex-1 group"
                        title="প্রশ্নপত্রটি দেখতে ক্লিক করুন"
                      >
                        {/* Serial Number Badge */}
                        <div className="w-10 h-10 rounded-xl bg-teal-100/70 text-teal-800 font-bold flex items-center justify-center text-sm shrink-0 font-sans border border-teal-200 group-hover:bg-teal-600 group-hover:text-white transition">
                          {toBengaliNumber(index + 1)}
                        </div>

                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-teal-700 transition">
                              {paper.paperTitle || `${paper.class} ${paper.subject} - ${paper.examTitle}`}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {paper.subject}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                              {paper.class}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 md:gap-4 text-xs text-slate-500 flex-wrap">
                            <span><strong>প্রতিষ্ঠান:</strong> {paper.coachingName || institution.nameBn}</span>
                            <span>•</span>
                            <span><strong>পূর্ণমান:</strong> {toBengaliNumber(paper.totalMarks || 100)}</span>
                            <span>•</span>
                            <span><strong>সময়:</strong> {paper.duration || '২ ঘণ্টা ৩০ মিনিট'}</span>
                            <span>•</span>
                            <span><strong>প্রশ্ন:</strong> {toBengaliNumber(totalQuestions)}টি</span>
                            {paper.createdAt && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(paper.createdAt).toLocaleDateString('bn-BD')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions: Download (PDF), Edit, Print, Delete */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadSavedPaper(paper);
                          }}
                          disabled={downloadingPaperId === paper.id}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition disabled:opacity-50"
                          title="সম্পূর্ণ প্রশ্নপত্রটি সকল পৃষ্ঠাসহ পিডিএফ ফাইল হিসেবে ডাউনলোড করুন"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-100" />
                          <span>{downloadingPaperId === paper.id ? 'ডাউনলোড হচ্ছে...' : 'ডাউনলোড (PDF)'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadSavedPaper(paper, 'builder');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition border border-slate-200"
                          title="প্রশ্নপত্রে প্রশ্ন যোগ বা এডিট করুন"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>এডিট করুন</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrintSavedPaper(paper);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition border border-slate-200"
                          title="সরাসরি প্রিন্ট প্রিভিউ খুলুন"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-600" />
                          <span>প্রিন্ট</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`আপনি কি নিশ্চিত "${paper.paperTitle || paper.examTitle}" প্রশ্নপত্রটি আর্কাইভ থেকে মুছে ফেলতে চান?`)) {
                              deleteExamPaper(paper.id);
                              showNotificationMsg('🗑️ প্রশ্নপত্রটি আর্কাইভ থেকে মুছে ফেলা হয়েছে।');
                            }
                          }}
                          className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer border border-rose-200"
                          title="আর্কাইভ থেকে মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ডিলিট</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : paperLayoutMode === 'landscape_booklet' ? (
        /* Landscape 4-Section Folding Booklet Preview */
        <LandscapeBookletPreview
          config={config}
          institution={institution}
          sectionKQuestions={sectionKQuestions}
          sectionKhQuestions={sectionKhQuestions}
          sectionGQuestions={sectionGQuestions}
          showWatermark={showWatermark}
          watermarkText=""
          watermarkImage={watermarkImage}
          watermarkOpacity={watermarkOpacity}
          watermarkSize={watermarkSize}
          showAnswerKey={showAnswerKey}
          onEditQuestions={() => setViewMode('builder')}
          onSwitchToPortrait={() => setPaperLayoutMode('standard_portrait')}
          onSavePaper={handleOpenSaveModal}
          onWatermarkImageChange={setWatermarkImage}
          onWatermarkOpacityChange={setWatermarkOpacity}
          onWatermarkSizeChange={setWatermarkSize}
          onShowWatermarkChange={setShowWatermark}
          onShuffleQuestions={handleShufflePaperQuestions}
        />
      ) : (
        /* Preview Mode (A4 Print Ready Paper View + ProshnoLab/eProshnobank Live Studio) */
        <div className="space-y-5">
          
          {/* Preview Configuration Toolbar */}
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setPaperLayoutMode('landscape_booklet')}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
              >
                <FoldHorizontal className="w-3.5 h-3.5" />
                <span>৪-পৃষ্ঠা বুকলেট ভিউ</span>
              </button>

              {/* Multiple Question Sets Selector */}
              <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-300">
                <span className="text-[11px] font-bold text-amber-900 px-1">সেট:</span>
                {(['ক', 'খ', 'গ', 'ঘ'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setActiveQuestionSet(s);
                      showNotificationMsg(`📋 প্রশ্নপত্র সেট "${s}" নির্বাচন করা হয়েছে।`);
                    }}
                    className={`px-2 py-0.5 rounded font-black text-xs cursor-pointer transition ${
                      activeQuestionSet === s
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-amber-900 hover:bg-amber-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* 1-Col vs 2-Col Layout Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setPrintColumns(1)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                    printColumns === 1 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  ১ কলাম
                </button>
                <button
                  onClick={() => setPrintColumns(2)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                    printColumns === 2 ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  ২ কলাম (কোচিং স্ট্যান্ডার্ড)
                </button>
              </div>

              {/* Live Inline Editing Button */}
              <button
                onClick={() => setPortraitInlineEdit(!portraitInlineEdit)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition border ${
                  portraitInlineEdit
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>এডিটিং মোড {portraitInlineEdit ? '(চালু)' : '(বন্ধ)'}</span>
              </button>

              {/* Quick Jump to OMR & Solution Sheet */}
              <button
                onClick={() => setViewMode('omr-sheet')}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>ওএমআর শিট</span>
              </button>

              <button
                onClick={() => setViewMode('answer-key')}
                className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>উত্তরমালা</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setPortraitShowSidebar(!portraitShowSidebar)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition border ${
                  portraitShowSidebar
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>কাস্টমাইজেশন প্যানেল</span>
              </button>

              <button
                onClick={() => setViewMode('builder')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer transition"
              >
                ← প্রশ্ন এডিট
              </button>

              <button
                onClick={handleOpenSaveModal}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition"
              >
                <Bookmark className="w-3.5 h-3.5 text-teal-200" />
                <span>সেভ</span>
              </button>

              <button
                onClick={handleDownloadPortraitPDF}
                disabled={isExportingPortraitPdf}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-blue-100" />
                <span>{isExportingPortraitPdf ? 'ডাউনলোড হচ্ছে...' : 'ডাউনলোড (PDF)'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট A4</span>
              </button>
            </div>
          </div>

          {/* Portrait A4 Split Workspace: Paper on Left + ProshnoLab Customization Studio on Right */}
          <div className="flex flex-col xl:flex-row items-start justify-center gap-5">
            {/* Actual A4 Sheet Container - Clean Zero-Shadow Border */}
            <div className="flex-1 flex justify-center w-full overflow-x-auto">
              <div 
                id="printable-exam-paper"
                className="w-full max-w-[210mm] bg-white rounded-none px-6 py-6 sm:px-9 sm:py-8 relative border-2 border-slate-900 shadow-sm print:shadow-none print:border-none print:m-0 print:p-6 print:max-w-none text-slate-900 font-serif box-border"
                style={{ minHeight: '297mm' }}
              >
                {/* Picture Watermark */}
                {showWatermark && watermarkImage && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
                    <img
                      src={watermarkImage}
                      alt="Watermark Logo"
                      style={{
                        opacity: watermarkOpacity,
                        width: `${watermarkSize}px`,
                        maxHeight: `${watermarkSize}px`
                      }}
                      className="object-contain filter grayscale pointer-events-none select-none transition-opacity"
                    />
                  </div>
                )}

                {/* A4 Header Section (Authentic Board & Coaching Standard) */}
                <div className="relative z-10 text-center space-y-1.5 pb-2.5 border-b-2 border-slate-900 mb-3.5">
                  <div className="flex items-start justify-between gap-2">
                    {portraitShowMarksBox ? (
                      <div className="border border-slate-800 px-2 py-1 text-[10px] font-sans font-bold text-center shrink-0 bg-white">
                        <div className="border-b border-slate-400 pb-0.5">প্রাপ্ত নম্বর</div>
                        <div className="h-4" />
                      </div>
                    ) : (
                      <div className="w-12 shrink-0" />
                    )}

                    <div className="flex-1 text-center">
                      <h1
                        className="text-xl md:text-2xl font-black tracking-wide text-slate-950 font-sans"
                        contentEditable={portraitInlineEdit}
                        suppressContentEditableWarning
                      >
                        {config.academyName}
                      </h1>
                      <p className="text-xs text-slate-600 font-medium font-sans" contentEditable={portraitInlineEdit} suppressContentEditableWarning>
                        {institution.village}, {institution.upazila}, {institution.district} {institution.eiin ? `| EIIN: ${institution.eiin}` : ''}
                      </p>
                      <div
                        className="font-bold text-sm md:text-base text-slate-950 font-serif tracking-wide mt-0.5"
                        contentEditable={portraitInlineEdit}
                        suppressContentEditableWarning
                      >
                        {config.examTitle}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0 font-sans">
                      <div className="px-2 py-0.5 rounded border border-slate-900 font-mono font-black text-xs bg-amber-50 text-slate-950">
                        সেট: {activeQuestionSet}
                      </div>
                      {config.subjectCode && (
                        <div className="flex items-center gap-0.5 text-[10px] font-bold">
                          <span className="mr-0.5">কোড:</span>
                          {config.subjectCode.split('').map((d, i) => (
                            <span key={i} className="inline-flex items-center justify-center w-4 h-4 border border-slate-800 font-mono bg-white">
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {portraitShowStudentInfo && (
                    <div className="pt-1 border-t border-slate-300 flex items-center justify-between gap-3 text-xs font-sans font-semibold text-slate-800">
                      <span className="flex-1 text-left">শিক্ষার্থীর নাম: ................................................................</span>
                      <span>রোল: .......................</span>
                      <span>শাখা: ...................</span>
                    </div>
                  )}

                  {/* Meta Details Row */}
                  <div className="pt-1.5 flex items-center justify-between text-xs md:text-sm font-semibold text-slate-800 px-1 border-t border-slate-300/80 font-sans">
                    <div className="text-left space-y-0.5" contentEditable={portraitInlineEdit} suppressContentEditableWarning>
                      {isEnglishPaper ? (
                        <>
                          <div>Subject: <strong>{config.subject === 'ইংরেজি' ? 'English (Compulsory)' : config.subject}</strong></div>
                          <div>Class: {config.className} {config.section ? `• ${config.section}` : ''}</div>
                        </>
                      ) : (
                        <>
                          <div>বিষয়: <strong>{config.subject}</strong> | শ্রেণি: {config.className} {config.section ? `(${config.section})` : ''}</div>
                        </>
                      )}
                    </div>

                    <div className="text-right space-y-0.5" contentEditable={portraitInlineEdit} suppressContentEditableWarning>
                      {isEnglishPaper ? (
                        <div>Time: <strong>{config.duration}</strong> | Full Marks: <strong>{config.totalMarks}</strong></div>
                      ) : (
                        <div>সময়: <strong>{config.duration}</strong> | পূর্ণমান: <strong>{config.totalMarks}</strong></div>
                      )}
                    </div>
                  </div>

                  {config.instructions && (
                    <div
                      className="text-[11px] text-slate-700 italic pt-1 border-t border-dashed border-slate-300 text-center"
                      contentEditable={portraitInlineEdit}
                      suppressContentEditableWarning
                    >
                      [{config.instructions}]
                    </div>
                  )}
                </div>

                {/* Questions Body */}
                <div className="relative z-10 space-y-5">

                  {/* 'ক' বিভাগ (MCQ) or English 'Part A: Grammar' in Print (Strictly ZERO underlines under MCQs!) */}
                  {sectionKQuestions.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="text-center">
                        <h2 className="inline-block text-xs md:text-sm font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5">
                          {isEnglishPaper
                            ? config.pattern === 'english_grammar_test'
                              ? `English Grammar Assessment Test [Marks: ${toBengaliNumber(sectionKMarks)}]`
                              : `Part A : Grammar [Marks: ${toBengaliNumber(sectionKMarks)}]`
                            : config.pattern === 'mcq_only' 
                              ? 'বহুনির্বাচনী প্রশ্নাবলী' 
                              : `'ক' বিভাগ : বহুনির্বাচনী প্রশ্ন [পূর্ণমান: ${toBengaliNumber(sectionKMarks)}]`}
                        </h2>
                        <p className="text-[10.5px] text-slate-600 italic mt-0.5">
                          {isEnglishPaper
                            ? '[Answer all the questions. Figures in the right margin indicate full marks.]'
                            : '[সকল প্রশ্নের উত্তর দাও। প্রতিটি প্রশ্নের মান ১। সঠিক উত্তরের বৃত্ত ভরাট করো।]'}
                        </p>
                      </div>

                      <div className={`grid ${printColumns === 2 && !isEnglishPaper ? 'grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2' : 'grid-cols-1 gap-y-2'} ${
                        paperFontSize === 'compact' ? 'text-[11px] leading-snug' : paperFontSize === 'large' ? 'text-[13px] leading-relaxed' : 'text-xs leading-snug'
                      }`}>
                        {sectionKQuestions.map((q, idx) => (
                          <div key={q.id || idx} className="mcq-question-item space-y-0.5 break-inside-avoid">
                            {q.type === 'short' ? (
                              <div className="space-y-1 pb-2">
                                <div className="flex items-start justify-between gap-3 font-semibold text-slate-950">
                                  <div className="leading-snug" contentEditable={portraitInlineEdit} suppressContentEditableWarning>
                                    <span className="font-bold">{q.itemNumber ? `${q.itemNumber}. ` : `${idx + 1}. `}</span>
                                    <span>{q.question.split('\n')[0]}</span>
                                  </div>
                                  {q.marksDistribution && (
                                    <span className="font-mono text-slate-700 shrink-0 text-[11px] font-bold">
                                      {q.marksDistribution}
                                    </span>
                                  )}
                                </div>

                                {(q as ShortQuestion).cluesBox && (q as ShortQuestion).cluesBox!.length > 0 && (
                                  <div className="p-1.5 border border-slate-400 rounded text-[11px] font-mono text-center my-1 bg-slate-50/50">
                                    [ {(q as ShortQuestion).cluesBox!.join(' | ')} ]
                                  </div>
                                )}

                                {q.question.includes('\n') && (
                                  <div className="text-[11.5px] font-serif leading-relaxed text-slate-900 whitespace-pre-line pl-4" contentEditable={portraitInlineEdit} suppressContentEditableWarning>
                                    {q.question.substring(q.question.indexOf('\n') + 1).trim()}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <>
                                <p className="font-semibold text-slate-950 font-sans" contentEditable={portraitInlineEdit} suppressContentEditableWarning>
                                  <span>{toBengaliNumber(idx + 1)}. </span>
                                  {q.type === 'mcq' ? q.question : ''}
                                  {portraitShowBoardTag && q.boardInfo && (
                                    <span className="ml-1 text-[9.5px] font-normal text-slate-600">[{q.boardInfo}]</span>
                                  )}
                                </p>

                                {q.type === 'mcq' && (
                                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pl-2 text-[11px] text-slate-800 font-sans">
                                    {q.options.map((opt, oIdx) => {
                                      const ltr = ['ক', 'খ', 'গ', 'ঘ'][oIdx];
                                      const isAns = portraitShowTickAnswer && q.correctOption === oIdx;
                                      return (
                                        <span key={oIdx} className="inline-flex items-center gap-1" contentEditable={portraitInlineEdit} suppressContentEditableWarning>
                                          {portraitOptionStyle === 'circle' ? (
                                            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full border text-[9.5px] font-bold shrink-0 ${
                                              isAns ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-700 text-slate-900'
                                            }`}>
                                              {ltr}
                                            </span>
                                          ) : portraitOptionStyle === 'dot' ? (
                                            <strong className={isAns ? 'underline text-emerald-800' : ''}>{ltr}.</strong>
                                          ) : (
                                            <strong className={isAns ? 'underline text-emerald-800' : ''}>({ltr})</strong>
                                          )}
                                          <span>{opt}</span>
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}

                                {portraitShowExplanation && q.type === 'mcq' && (
                                  <div className="mt-1 ml-2 p-1 rounded border border-slate-300 bg-slate-50 text-[10px] text-slate-700 font-sans">
                                    <strong>ব্যাখ্যা:</strong> সঠিক উত্তর ({['ক', 'খ', 'গ', 'ঘ'][q.correctOption]}) {q.options[q.correctOption]}।
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 'খ' বিভাগ (Short Questions) in Print */}
                  {sectionKhQuestions.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <div className="text-center">
                        <h2 className="inline-block text-xs md:text-sm font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5">
                          {config.pattern === 'short_only'
                            ? 'সংক্ষিপ্ত প্রশ্নাবলী'
                            : `'খ' বিভাগ : সংক্ষিপ্ত প্রশ্ন [পূর্ণমান: ${toBengaliNumber(sectionKhMarks)}]`}
                        </h2>
                        <p className="text-[10.5px] text-slate-600 italic mt-0.5">
                          [যেকোনো {toBengaliNumber(Math.min(sectionKhQuestions.length, 10))}টি প্রশ্নের উত্তর দাও। প্রতিটি প্রশ্নের মান ২।]
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-y-1.5 text-xs">
                        {sectionKhQuestions.map((q, idx) => (
                          <div key={q.id || idx} className="flex items-start justify-between gap-4 break-inside-avoid">
                            <p className="text-slate-950" contentEditable={portraitInlineEdit} suppressContentEditableWarning>
                              <strong>{toBengaliNumber(idx + 1)}. </strong>
                              {q.type === 'short' ? q.question : ''}
                            </p>
                            <span className="font-mono text-slate-600 shrink-0">[{toBengaliNumber(q.marks || 2)}]</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 'গ' বিভাগ (CQ) or English 'Part B: Composition' in Print */}
                  {sectionGQuestions.length > 0 && (
                    <div className="space-y-3.5 pt-2">
                      <div className="text-center">
                        <h2 className="inline-block text-xs md:text-sm font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5">
                          {isEnglishPaper
                            ? `Part B : Composition [Marks: ${toBengaliNumber(sectionGMarks)}]`
                            : config.pattern === 'cq_only'
                              ? 'সৃজনশীল প্রশ্নাবলী'
                              : config.pattern === 'k_kh_mcq_cq'
                                ? `'খ' বিভাগ : সৃজনশীল প্রশ্ন [পূর্ণমান: ${toBengaliNumber(sectionGMarks)}]`
                                : `'গ' বিভাগ : সৃজনশীল প্রশ্ন [পূর্ণমান: ${toBengaliNumber(sectionGMarks)}]`}
                        </h2>
                        <p className="text-[10.5px] text-slate-600 italic mt-0.5">
                          {isEnglishPaper
                            ? '[Answer the following questions / write the composition as instructed.]'
                            : '[উদ্দীপকগুলো মনোযোগ সহকারে পড়ে সংশ্লিষ্ট প্রশ্নগুলোর যথাযথ উত্তর প্রদান করো।]'}
                        </p>
                      </div>

                      <div className="space-y-3 text-xs">
                        {sectionGQuestions.map((q, idx) => (
                          <div key={q.id || idx} className="space-y-1 break-inside-avoid pb-2">
                            {q.type === 'short' ? (
                              <div className="space-y-1">
                                <div className="flex items-start justify-between gap-3 font-semibold text-slate-950">
                                  <div className="leading-snug" contentEditable={portraitInlineEdit} suppressContentEditableWarning>
                                    <span className="font-bold">{q.itemNumber ? `${q.itemNumber}. ` : `${sectionKQuestions.length + idx + 1}. `}</span>
                                    <span>{q.question.split('\n')[0]}</span>
                                  </div>
                                  {q.marksDistribution && (
                                    <span className="font-mono text-slate-700 shrink-0 text-[11px] font-bold">
                                      {q.marksDistribution}
                                    </span>
                                  )}
                                </div>
                                {q.question.includes('\n') && (
                                  <div className="text-[11.5px] font-serif leading-relaxed text-slate-900 whitespace-pre-line pl-4" contentEditable={portraitInlineEdit} suppressContentEditableWarning>
                                    {q.question.substring(q.question.indexOf('\n') + 1).trim()}
                                  </div>
                                )}
                              </div>
                            ) : q.type === 'cq' ? (
                              <div className="space-y-1 font-serif text-slate-950">
                                <div className="font-bold text-slate-950 font-sans text-xs" contentEditable={portraitInlineEdit} suppressContentEditableWarning>
                                  {toBengaliNumber(idx + 1)}. নিচের উদ্দীপকটি পড়ে সংশ্লিষ্ট প্রশ্নগুলোর যথাযথ উত্তর দাও:
                                  {portraitShowBoardTag && q.boardInfo && (
                                    <span className="ml-1.5 text-[10px] font-normal text-slate-600">[{q.boardInfo}]</span>
                                  )}
                                </div>

                                <div className="text-justify leading-relaxed text-slate-950 text-[11.5px] font-serif py-0.5" contentEditable={portraitInlineEdit} suppressContentEditableWarning>
                                  {q.stimulus}
                                </div>

                                <div className="space-y-0.5 pl-3 font-sans pt-0.5">
                                  {q.subQuestions.map(sq => (
                                    <div key={sq.label} className="flex items-start justify-between text-slate-950 text-[11px]">
                                      <span className="leading-snug" contentEditable={portraitInlineEdit} suppressContentEditableWarning>
                                        <strong>({sq.label})</strong> {sq.question}
                                      </span>
                                      <span className="font-mono text-slate-700 font-bold pl-2 shrink-0">{toBengaliNumber(sq.marks)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Optional Attached Mini OMR Grid at Bottom */}
                  {portraitShowMiniOmr && sectionKQuestions.some(q => q.type === 'mcq') && (
                    <div className="pt-3 border-t-2 border-dashed border-slate-700 bg-slate-50/70 p-2.5 rounded">
                      <div className="flex items-center justify-between text-[10px] font-bold font-sans text-slate-900 mb-1.5 border-b border-slate-300 pb-1">
                        <span>✂ সংযুক্ত মিনি OMR উত্তরপত্র (সঠিক বৃত্তটি কালো বলপেন দিয়ে ভরাট করো)</span>
                        <span>নাম: ....................................... রোল: ................ সেট: [{activeQuestionSet}]</span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-3 gap-y-1 font-sans text-[9.5px]">
                        {sectionKQuestions
                          .filter(q => q.type === 'mcq')
                          .slice(0, 30)
                          .map((q, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <span className="w-4 font-bold text-right">{toBengaliNumber(idx + 1)}.</span>
                              {(['ক', 'খ', 'গ', 'ঘ'] as const).map((ltr, oIdx) => {
                                const isAns = portraitShowTickAnswer && (q as MCQQuestion).correctOption === oIdx;
                                return (
                                  <span
                                    key={ltr}
                                    className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border text-[8px] font-bold ${
                                      isAns ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-600 text-slate-800 bg-white'
                                    }`}
                                  >
                                    {ltr}
                                  </span>
                                );
                              })}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Optional Answer Key Section */}
                  {showAnswerKey && sectionKQuestions.length > 0 && (
                    <div className="pt-4 border-t-2 border-dashed border-slate-400 space-y-2">
                      <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-800">
                        ★ বহুনির্বাচনী প্রশ্নাবলীর উত্তরমালা (সেট: {activeQuestionSet}) ★
                      </div>
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 text-[11px] text-center font-mono">
                        {sectionKQuestions.map((q, idx) => {
                          const correctLetters = ['ক', 'খ', 'গ', 'ঘ'];
                          return (
                            <div key={idx} className="p-1 border border-slate-300 bg-slate-50 rounded">
                              <span className="text-slate-500">{toBengaliNumber(idx + 1)}:</span>
                              <strong className="text-emerald-700 ml-1">
                                {q.type === 'mcq' ? correctLetters[q.correctOption] : '-'}
                              </strong>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Footer Page Note */}
                  <div className="pt-6 text-center text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-200 mt-4">
                    <span>{config.academyName}</span>
                    <span>— সমাপ্ত —</span>
                    <span>সেট: {activeQuestionSet}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar: ProshnoLab / eProshnobank Live Customization Studio for Portrait A4 */}
            {portraitShowSidebar && (
              <div className="w-full xl:w-72 shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4 print:hidden sticky top-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-sm text-slate-900">A4 কাস্টমাইজেশন স্টুডিও</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Live</span>
                </div>

                <button
                  type="button"
                  onClick={handleShufflePaperQuestions}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>প্রশ্ন শাফল করুন (Shuffle Set)</span>
                </button>

                <div className="space-y-1.5 text-xs">
                  {[
                    { label: 'এডিটিং মোড (Live Edit)', state: portraitInlineEdit, setter: setPortraitInlineEdit },
                    { label: 'উত্তরপত্র (সঠিক বৃত্ত ভরাট ●)', state: portraitShowTickAnswer, setter: setPortraitShowTickAnswer },
                    { label: 'সমাধান / ব্যাখ্যা সংযুক্ত', state: portraitShowExplanation, setter: setPortraitShowExplanation },
                    { label: 'প্রশ্নে মিনি OMR সংযুক্ত', state: portraitShowMiniOmr, setter: setPortraitShowMiniOmr },
                    { label: 'শেষে পূর্ণাঙ্গ উত্তরমালা ছক', state: showAnswerKey, setter: setShowAnswerKey },
                    { label: 'বোর্ড ও সাল ট্যাগ [ঢা. বো. ২৪]', state: portraitShowBoardTag, setter: setPortraitShowBoardTag },
                    { label: 'প্রাপ্ত নম্বর ঘর (উপরে বামে)', state: portraitShowMarksBox, setter: setPortraitShowMarksBox },
                    { label: 'শিক্ষার্থীর নাম ও রোল ঘর', state: portraitShowStudentInfo, setter: setPortraitShowStudentInfo },
                    { label: 'লগো জলছাপ (Watermark)', state: showWatermark, setter: setShowWatermark },
                  ].map((item, idx) => (
                    <label
                      key={idx}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={item.state}
                        onChange={(e) => item.setter(e.target.checked)}
                        className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                  <span className="font-bold text-slate-700 block">অপশন স্টাইল:</span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'circle', label: 'বৃত্ত ⓐ' },
                      { id: 'paren', label: 'বন্ধনী (ক)' },
                      { id: 'dot', label: 'ডট ক.' },
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setPortraitOptionStyle(st.id as any)}
                        className={`py-1.5 rounded-lg font-bold border text-[11px] cursor-pointer ${
                          portraitOptionStyle === st.id
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE: OMR Sheet Generator (eProshnobank & ProshnoLab signature feature) */}
      {viewMode === 'omr-sheet' && (
        <OmrSheetGenerator
          academyName={config.academyName}
          examTitle={config.examTitle}
          subject={config.subject}
          subjectCode={config.subjectCode}
          className={config.className}
          initialQuestionCount={sectionKQuestions.filter(q => q.type === 'mcq').length || 30}
          initialSet={activeQuestionSet}
          onBackToBuilder={() => setViewMode('builder')}
        />
      )}

      {/* VIEW MODE: Teacher Solution & Answer Key Guide (eProshnobank & ProshnoLab signature feature) */}
      {viewMode === 'answer-key' && (
        <AnswerKeyGenerator
          academyName={config.academyName}
          examTitle={config.examTitle}
          subject={config.subject}
          subjectCode={config.subjectCode}
          className={config.className}
          sectionKQuestions={sectionKQuestions}
          sectionKhQuestions={sectionKhQuestions}
          sectionGQuestions={sectionGQuestions}
          onBackToBuilder={() => setViewMode('builder')}
        />
      )}

      {/* Drawer / Modal: Add Questions from Question Bank (ProshnoLab & eProshnobank Style) */}
      {showAddDrawer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 md:p-5 print:hidden">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base text-white flex items-center gap-2">
                    <span>প্রশ্ন ব্যাংক ও বোর্ড অ্যানালাইসিস স্টুডিও</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      ProshnoLab + eProshnobank ফিল্টার
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    বোর্ড, শীর্ষস্থানীয় স্কুল/কলেজ, গাণিতিক ও রিপিটেড প্রশ্ন ফিল্টার করে ১-ক্লিকে প্রশ্নপত্রে যুক্ত করুন
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs">
                  যুক্ত প্রশ্ন: {toBengaliNumber(sectionKQuestions.length + sectionKhQuestions.length + sectionGQuestions.length)}টি
                </span>
                <button
                  onClick={() => setShowAddDrawer(false)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter bar */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
                {/* Class Filter */}
                <div>
                  <label className="text-[10.5px] font-bold text-slate-500 block mb-0.5">শ্রেণি</label>
                  <select
                    value={pickerClass}
                    onChange={(e) => {
                      const newClass = e.target.value;
                      setPickerClass(newClass);
                      const classSubjects = newClass === 'সব শ্রেণি' ? subjectsList : (classSubjectsMap[newClass] || subjectsList);
                      if (pickerSubject !== 'সব বিষয়' && !classSubjects.includes(pickerSubject)) {
                        setPickerSubject(classSubjects[0] || 'সব বিষয়');
                      }
                      setPickerChapter('সব অধ্যায়');
                    }}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold outline-none focus:border-teal-500"
                  >
                    {classesList.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-[10.5px] font-bold text-slate-500 block mb-0.5">বিষয়</label>
                  <select
                    value={pickerSubject}
                    onChange={(e) => {
                      setPickerSubject(e.target.value);
                      setPickerChapter('সব অধ্যায়');
                    }}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold outline-none focus:border-teal-500"
                  >
                    <option value="সব বিষয়">সব বিষয় (সমন্বিত)</option>
                    {(pickerClass === 'সব শ্রেণি' ? subjectsList : (classSubjectsMap[pickerClass] || subjectsList)).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* Chapter */}
                <div>
                  <label className="text-[10.5px] font-bold text-slate-500 block mb-0.5">অধ্যায়</label>
                  <select
                    value={pickerChapter}
                    onChange={(e) => setPickerChapter(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold outline-none focus:border-teal-500"
                  >
                    <option value="সব অধ্যায়">সব অধ্যায়</option>
                    {pickerSubject !== 'সব বিষয়' && getChaptersForClassAndSubject(pickerClass, pickerSubject)?.map(ch => (
                      <option key={ch} value={ch}>{ch}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="text-[10.5px] font-bold text-slate-500 block mb-0.5">প্রশ্নের ধরণ</label>
                  <select
                    value={pickerType}
                    onChange={(e) => setPickerType(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold outline-none focus:border-teal-500"
                  >
                    <option value="all">সব ধরণ (MCQ + CQ + Short)</option>
                    <option value="mcq">বহুনির্বাচনী (MCQ)</option>
                    <option value="short">সংক্ষিপ্ত / গ্রামার</option>
                    <option value="cq">সৃজনশীল (CQ)</option>
                  </select>
                </div>

                {/* Board Filter */}
                <div>
                  <label className="text-[10.5px] font-bold text-slate-500 block mb-0.5">শিক্ষা বোর্ড ফিল্টার</label>
                  <select
                    value={pickerBoardFilter}
                    onChange={(e) => setPickerBoardFilter(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold outline-none focus:border-teal-500"
                  >
                    {[
                      'সব বোর্ড',
                      'ঢাকা বোর্ড',
                      'রাজশাহী বোর্ড',
                      'কুমিল্লা বোর্ড',
                      'চট্টগ্রাম বোর্ড',
                      'যশোর বোর্ড',
                      'দিনাজপুর বোর্ড',
                      'সিলেট বোর্ড',
                      'বরিশাল বোর্ড',
                      'ময়মনসিংহ বোর্ড',
                    ].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Top School / College Filter */}
                <div>
                  <label className="text-[10.5px] font-bold text-slate-500 block mb-0.5">শীর্ষ স্কুল/কলেজ</label>
                  <select
                    value={pickerSchoolFilter}
                    onChange={(e) => setPickerSchoolFilter(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold outline-none focus:border-teal-500"
                  >
                    {[
                      'সব প্রতিষ্ঠান',
                      'ক্যাডেট কলেজ',
                      'রাজউক উত্তরা মডেল কলেজ',
                      'ভিকারুননিসা নূন স্কুল এন্ড কলেজ',
                      'আইডিয়াল স্কুল এন্ড কলেজ',
                      'হলি ক্রস কলেজ',
                      'আদমজী ক্যান্টনমেন্ট',
                    ].map(sc => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Second Filter Row: ProshnoLab Special Filter Pills + Keyword Search + Batch Select */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-200/80">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-700 mr-1">স্পেশাল ফিল্টার:</span>
                  {[
                    { id: 'all', label: 'সব প্রশ্ন' },
                    { id: 'repeated_board', label: '⭐ রিপিটেড বোর্ড প্রশ্ন' },
                    { id: 'math', label: '📐 গাণিতিক সমস্যা' },
                    { id: 'theory', label: '📖 তত্ত্বীয় প্রশ্ন' },
                    { id: 'বহুপদী', label: '🔢 বহুপদী (i, ii, iii)' },
                  ].map(sf => (
                    <button
                      key={sf.id}
                      type="button"
                      onClick={() => setPickerSpecialFilter(sf.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition border ${
                        pickerSpecialFilter === sf.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sf.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
                  <div className="relative w-48">
                    <input
                      type="text"
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      placeholder="প্রশ্ন বা টপিক খুঁজুন..."
                      className="w-full pl-7 pr-2.5 py-1 rounded-lg border border-slate-300 bg-white font-medium outline-none focus:border-teal-500 text-xs"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1.5" />
                  </div>

                  {/* Batch Add 10 Questions Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const unadded = filteredPickerQuestions.filter(q => !isQuestionAdded(q.id)).slice(0, 10);
                      if (unadded.length === 0) {
                        showNotificationMsg('এই ফিল্টারের সকল প্রশ্ন ইতোমধ্যে যুক্ত করা হয়েছে!');
                        return;
                      }
                      unadded.forEach(q => handleAddQuestionToPaper(q));
                      showNotificationMsg(`✅ এক ক্লিকে ${toBengaliNumber(unadded.length)}টি প্রশ্ন প্রশ্নপত্রে যুক্ত হয়েছে!`);
                    }}
                    className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] cursor-pointer transition shadow-2xs whitespace-nowrap"
                  >
                    + ১০টি প্রশ্ন একসাথে নিন
                  </button>
                </div>
              </div>

              {/* Dedicated English Grammar Topic Filter in Drawer */}
              {pickerSubject === 'ইংরেজি' && (
                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200/80 bg-blue-50/60 p-2 rounded-xl">
                  <span className="text-xs font-bold text-blue-900 shrink-0 flex items-center gap-1.5">
                    <span>🏛️ বোর্ড গ্রামার টপিক নির্বাচন:</span>
                  </span>
                  <select
                    value={pickerGrammarTopic}
                    onChange={(e) => setPickerGrammarTopic(e.target.value)}
                    className="flex-1 px-3 py-1 text-xs font-bold rounded-lg border border-blue-300 bg-white text-blue-950 outline-none"
                  >
                    {englishGrammarTopics.map(gt => (
                      <option key={gt} value={gt}>{gt}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs text-slate-600 pb-1">
                <span>পাওয়া গেছে: <strong>{toBengaliNumber(filteredPickerQuestions.length)}টি</strong> মানসম্মত প্রশ্ন</span>
                <span className="text-[11px] text-emerald-700 font-semibold">সঠিক উত্তর সবুজ রঙে চিহ্নিত</span>
              </div>

              {filteredPickerQuestions.slice(0, drawerDisplayLimit).map((q, qIdx) => {
                const added = isQuestionAdded(q.id);
                const isExpOpen = !!expandedExplanations[q.id];
                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-2xl border-2 transition flex items-start justify-between gap-4 bg-white ${
                      added ? 'border-emerald-500 bg-emerald-50/20 shadow-xs' : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-500">#{toBengaliNumber(qIdx + 1)}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          q.type === 'mcq' ? 'bg-emerald-100 text-emerald-800' :
                          q.type === 'short' ? 'bg-teal-100 text-teal-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {q.type === 'mcq' ? 'MCQ' : q.type === 'short' ? 'সংক্ষিপ্ত / আইটেম' : 'সৃজনশীল (CQ)'}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">{q.subject} • {q.chapter}</span>
                        {q.boardInfo && (
                          <span className="text-[10.5px] text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md font-bold">
                            🏛️ {q.boardInfo}
                          </span>
                        )}
                        {q.importance === 'very_high' && (
                          <span className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md font-bold">
                            🔥 ১০০% কমন উপযোগী
                          </span>
                        )}
                      </div>

                      <p className="text-xs md:text-sm text-slate-900 font-semibold leading-snug">
                        {q.type === 'cq' ? q.stimulus : q.question}
                      </p>

                      {q.type === 'mcq' && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                          {q.options.map((opt, i) => {
                            const isCorrect = q.correctOption === i;
                            return (
                              <span
                                key={i}
                                className={`px-2 py-1 rounded-lg border flex items-center gap-1.5 ${
                                  isCorrect
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                                    : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-400 text-slate-700'
                                }`}>
                                  {['ক', 'খ', 'গ', 'ঘ'][i]}
                                </span>
                                <span className="truncate">{opt}</span>
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'mcq' && isExpOpen && (
                        <div className="mt-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-800">
                          <strong className="text-amber-900">ব্যাখ্যা ও সমাধান:</strong> সঠিক উত্তর অপশন ({['ক', 'খ', 'গ', 'ঘ'][q.correctOption]}) — <strong>{q.options[q.correctOption]}</strong>। অধ্যয়ন নোট: {q.chapter} অধ্যায়ের বোর্ড স্ট্যান্ডার্ড প্রশ্ন।
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAddQuestionToPaper(q)}
                        disabled={added}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          added
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {added ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>যুক্ত করা হয়েছে</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>+ প্রশ্নটি নিন</span>
                          </>
                        )}
                      </button>

                      {q.type === 'mcq' && (
                        <button
                          type="button"
                          onClick={() => setExpandedExplanations(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                          className="text-[11px] font-semibold text-teal-700 hover:underline cursor-pointer"
                        >
                          {isExpOpen ? 'ব্যাখ্যা লুকান ▲' : 'ব্যাখ্যা দেখুন ▼'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredPickerQuestions.length > drawerDisplayLimit && (
                <div className="pt-4 pb-2 text-center">
                  <button
                    type="button"
                    onClick={() => setDrawerDisplayLimit(prev => prev + 60)}
                    className="px-5 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs rounded-xl border border-teal-300 transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                  >
                    <span>আরও ৬০টি প্রশ্ন লোড করুন</span>
                    <span className="text-[11px] text-teal-600">({toBengaliNumber(drawerDisplayLimit)} / {toBengaliNumber(filteredPickerQuestions.length)}টি প্রদর্শিত)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                টিপস: প্রশ্নগুলো পছন্দ করার পর ডানদিকের প্রিভিউ মোডে গিয়ে ৪-পৃষ্ঠা বুকলেট বা পোর্ট্রেট A4 ফরম্যাটে প্রিন্ট ও পিডিএফ ডাউনলোড করুন।
              </span>
              <button
                onClick={() => setShowAddDrawer(false)}
                className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                সম্পন্ন ও প্রিভিউ দেখুন →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Swap / Replace Question */}
      {swapModalOpen && questionToSwap && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 md:p-6 print:hidden">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-cyan-600" />
                  <span>প্রশ্নটি প্রতিস্থাপন / বদলান</span>
                </h3>
                <p className="text-xs text-slate-500">
                  বর্তমান প্রশ্নের বদলে একই বিষয় ও অধ্যায়ের আরেকটি প্রশ্ন পছন্দ করুন
                </p>
              </div>
              <button onClick={() => setSwapModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Question Display */}
            <div className="p-3 bg-cyan-50/50 border-b border-cyan-100 text-xs">
              <span className="text-cyan-800 font-bold block mb-0.5">বর্তমান প্রশ্ন:</span>
              <p className="text-slate-800">
                {questionToSwap.question.type === 'cq' 
                  ? questionToSwap.question.stimulus 
                  : questionToSwap.question.question}
              </p>
            </div>

            {/* Candidate Questions List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              <div className="text-xs text-slate-500">বিকল্প প্রশ্নসমূহ:</div>
              {questions
                .filter(q => 
                  q.type === questionToSwap.question.type && 
                  q.subject === questionToSwap.question.subject && 
                  q.id !== questionToSwap.question.id &&
                  !isQuestionAdded(q.id)
                )
                .slice(0, 15)
                .map(q => (
                  <div key={q.id} className="p-3 rounded-xl border border-slate-200 hover:border-cyan-400 flex items-start justify-between gap-3 transition">
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-bold text-slate-500">{q.chapter} {q.boardInfo && `• ${q.boardInfo}`}</span>
                      <p className="font-medium text-slate-900">{q.type === 'cq' ? q.stimulus : q.question}</p>
                    </div>
                    <button
                      onClick={() => handleConfirmSwap(q)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shrink-0 cursor-pointer"
                    >
                      এই প্রশ্নটি নিন
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Write Custom Question */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 md:p-6 print:hidden">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-600" />
                  <span>নতুন প্রশ্ন নিজে লিখুন (+Custom Question)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  আপনার প্রতিষ্ঠানের নিজস্ব প্রশ্নপত্র অনুযায়ী কাস্টম প্রশ্ন লিখে অবিলম্বে যুক্ত করুন
                </p>
              </div>
              <button onClick={() => setShowCustomModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {/* Type selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">প্রশ্নের ধরণ</label>
                <div className="flex gap-2">
                  {(['mcq', 'short', 'cq'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCustomType(t)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        customType === t
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t === 'mcq' ? 'বহুনির্বাচনী (MCQ)' : t === 'short' ? 'সংক্ষিপ্ত প্রশ্ন' : 'সৃজনশীল (CQ)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* If MCQ or Short: Question prompt */}
              {customType !== 'cq' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">প্রশ্নের বিবরণ</label>
                  <textarea
                    rows={2}
                    value={customQuestionText}
                    onChange={(e) => setCustomQuestionText(e.target.value)}
                    placeholder="এখানে প্রশ্নটি টাইপ করুন..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* If MCQ: Options */}
              {customType === 'mcq' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">অপশনসমূহ ও সঠিক উত্তর</label>
                  {(['ক', 'খ', 'গ', 'ঘ'] as const).map((label, idx) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="w-6 text-xs font-bold text-slate-500">{label}.</span>
                      <input
                        type="text"
                        value={customOptions[idx]}
                        onChange={(e) => {
                          const updated = [...customOptions] as [string, string, string, string];
                          updated[idx] = e.target.value;
                          setCustomOptions(updated);
                        }}
                        placeholder={`অপশন ${label} লিখুন...`}
                        className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none"
                      />
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={customCorrect === idx}
                        onChange={() => setCustomCorrect(idx as any)}
                        title="সঠিক উত্তর হিসেবে চিহ্নিত করুন"
                        className="text-emerald-600"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* If CQ: Stimulus & subquestions */}
              {customType === 'cq' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">উদ্দীপক (Stimulus)</label>
                    <textarea
                      rows={3}
                      value={customStimulus}
                      onChange={(e) => setCustomStimulus(e.target.value)}
                      placeholder="উদ্দীপকের তথ্য, অনুচ্ছেদ বা গাণিতিক পরিস্থিতি লিখুন..."
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">উপ-প্রশ্নসমূহ</label>
                    {customSubQuestions.map((sq, idx) => (
                      <div key={sq.label} className="flex items-center gap-2">
                        <span className="w-6 text-xs font-bold text-purple-700">({sq.label})</span>
                        <input
                          type="text"
                          value={sq.question}
                          onChange={(e) => {
                            const updated = [...customSubQuestions];
                            updated[idx].question = e.target.value;
                            setCustomSubQuestions(updated);
                          }}
                          placeholder={`প্রশ্ন ${sq.label} লিখুন...`}
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none"
                        />
                        <span className="text-[11px] text-slate-400 font-mono">[{sq.marks}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleCreateCustomQuestion}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer"
              >
                প্রশ্নপত্রে যুক্ত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Question Paper Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">প্রশ্নপত্র সংরক্ষণ করুন</h3>
                  <p className="text-xs text-slate-500">পরবর্তীতে পুনরায় দেখার বা প্রিন্ট করার জন্য সেভ করে রাখুন</p>
                </div>
              </div>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  প্রশ্নপত্রের শিরোনাম বা টাইটেল:
                </label>
                <input
                  type="text"
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                  placeholder="যেমন: ১০ম শ্রেণি পদার্থবিজ্ঞান মডেল টেস্ট পরীক্ষা"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition font-medium"
                  autoFocus
                />
                <span className="text-[11px] text-slate-400 block">
                  এই শিরোনাম অনুযায়ী সাইডবারের "প্রশ্নপত্রসমূহ" সাব-মেনুতে সিরিয়ালি তালিকাভুক্ত থাকবে।
                </span>
              </div>

              {/* Summary of current paper */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>বিষয় ও শ্রেণি:</span>
                  <span className="font-bold text-slate-900">{config.subject} ({config.className})</span>
                </div>
                <div className="flex justify-between">
                  <span>পরীক্ষার নাম:</span>
                  <span className="font-bold text-slate-900">{config.examTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span>মোট সংযুক্ত প্রশ্ন:</span>
                  <span className="font-bold text-emerald-700">
                    {toBengaliNumber(sectionKQuestions.length + sectionKhQuestions.length + sectionGQuestions.length)}টি
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>মোট পূর্ণমান:</span>
                  <span className="font-bold text-slate-900">{toBengaliNumber(config.totalMarks)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition"
              >
                বাতিল
              </button>

              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-teal-900/20 flex items-center gap-1.5 cursor-pointer transition"
              >
                <Save className="w-4 h-4 text-teal-100" />
                <span>সংরক্ষণ করুন (Save Paper)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Picture Watermark (লগো জলছাপ) Settings Modal */}
      {showWatermarkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">প্রশ্নপত্রের লগো ওয়াটারমার্ক সেটিংস</h3>
                  <p className="text-xs text-slate-500">আপনার নিজস্ব প্রতিষ্ঠান/একাডেমির লগো পিকচার ওয়াটারমার্ক হিসেবে যোগ করুন</p>
                </div>
              </div>
              <button
                onClick={() => setShowWatermarkModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Enable / Disable Watermark */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800">জলছাপ প্রদর্শন করুন (Show Watermark)</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showWatermark}
                    onChange={(e) => setShowWatermark(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {/* Watermark Preview & Upload */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden shrink-0 relative group">
                  {watermarkImage ? (
                    <img
                      src={watermarkImage}
                      alt="Current Logo"
                      style={{ opacity: Math.max(0.2, watermarkOpacity * 3) }}
                      className="max-h-20 max-w-20 object-contain filter grayscale"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  )}
                </div>

                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <div className="text-xs font-bold text-slate-900">
                    লগো ইমেজ (Picture / Logo)
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    আপনার কম্পিউটার বা ফোন থেকে প্রতিষ্ঠানের যে কোনো লগো (PNG, JPG, SVG) আপলোড করুন। এটি স্বয়ংক্রিয়ভাবে প্রশ্নপত্রের ঠিক মাঝখানে হালকা জলছাপ হিসেবে বসবে।
                  </p>

                  <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                    <input
                      type="file"
                      ref={logoFileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>লগো আপলোড করুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetToDefaultLogo}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition"
                      title="ডিফল্ট সায়েন্স স্টুডিও সিল লগোতে ফিরিয়ে নিন"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>সায়েন্স স্টুডিও সিল</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Opacity selector & Slider */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">জলছাপের স্বচ্ছতা (Opacity):</span>
                  <span className="font-mono text-teal-700 font-black bg-teal-100 px-2 py-0.5 rounded-md text-xs">
                    {Math.round(watermarkOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.02"
                  max="0.30"
                  step="0.01"
                  value={watermarkOpacity}
                  onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { label: 'খুব হালকা', val: 0.04 },
                    { label: 'আদর্শ', val: 0.07 },
                    { label: 'স্পষ্ট', val: 0.11 },
                    { label: 'গাঢ়', val: 0.16 }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setWatermarkOpacity(opt.val)}
                      className={`py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                        Math.abs(watermarkOpacity - opt.val) < 0.005
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label} ({Math.round(opt.val * 100)}%)
                    </button>
                  ))}
                </div>
              </div>

              {/* Size selector & Slider */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">লগোর আকার (Watermark Size):</span>
                  <span className="font-mono text-teal-700 font-black bg-teal-100 px-2 py-0.5 rounded-md text-xs">
                    {watermarkSize}px ({Math.round((watermarkSize / 160) * 100)}%)
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="360"
                  step="10"
                  value={watermarkSize}
                  onChange={(e) => setWatermarkSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { label: 'ছোট (৭৫%)', val: 120 },
                    { label: 'আদর্শ (১০০%)', val: 160 },
                    { label: 'বড় (১৩৫%)', val: 220 },
                    { label: 'বৃহৎ (১৭৫%)', val: 280 }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setWatermarkSize(opt.val)}
                      className={`py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                        watermarkSize === opt.val
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowWatermarkModal(false)}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs cursor-pointer transition"
              >
                সম্পন্ন করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
