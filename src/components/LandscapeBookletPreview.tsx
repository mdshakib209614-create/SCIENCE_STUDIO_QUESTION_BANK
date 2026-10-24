import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Printer, 
  BookOpen, 
  FoldHorizontal, 
  CheckCircle2, 
  FileText,
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Download,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  X,
  Edit3,
  Shuffle,
  Monitor,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  Columns,
  Palette,
  Grid
} from 'lucide-react';
import { exportElementsToPDF } from '../utils/pdfExport';
import { InstitutionProfile, QuestionItem, MCQQuestion, CQQuestion, ShortQuestion } from '../types';
import { toBengaliNumber } from '../utils/bengaliUtils';
import { defaultScienceStudioLogoSvg } from '../assets/defaultWatermarkLogo';

export interface DraftPaperConfig {
  academyName: string;
  examTitle: string;
  subject: string;
  subjectCode: string;
  className: string;
  section: string;
  totalMarks: string;
  duration: string;
  pattern: 'k_kh_g' | 'mcq_only' | 'cq_only' | 'short_only' | 'k_kh_mcq_cq' | 'english_board_standard' | 'english_grammar_test' | 'english_1st_paper' | string;
  instructions: string;
  isCreated: boolean;
}

interface LandscapeBookletPreviewProps {
  config: DraftPaperConfig;
  institution: InstitutionProfile;
  sectionKQuestions: QuestionItem[];
  sectionKhQuestions: QuestionItem[];
  sectionGQuestions: QuestionItem[];
  showWatermark: boolean;
  watermarkText?: string;
  watermarkImage?: string;
  watermarkOpacity?: number;
  watermarkSize?: number;
  showAnswerKey: boolean;
  onEditQuestions: () => void;
  onSwitchToPortrait: () => void;
  onSavePaper?: () => void;
  onWatermarkImageChange?: (url: string) => void;
  onWatermarkOpacityChange?: (opacity: number) => void;
  onWatermarkSizeChange?: (size: number) => void;
  onShowWatermarkChange?: (show: boolean) => void;
  onShuffleQuestions?: () => void;
}

export const LandscapeBookletPreview: React.FC<LandscapeBookletPreviewProps> = ({
  config,
  institution,
  sectionKQuestions,
  sectionKhQuestions,
  sectionGQuestions,
  showWatermark: initialShowWatermark,
  watermarkImage: initialWatermarkImage,
  watermarkOpacity: initialWatermarkOpacity = 0.07,
  watermarkSize: initialWatermarkSize = 160,
  showAnswerKey: initialShowAnswerKey,
  onEditQuestions,
  onSwitchToPortrait,
  onSavePaper,
  onWatermarkImageChange,
  onWatermarkOpacityChange,
  onWatermarkSizeChange,
  onShowWatermarkChange,
  onShuffleQuestions,
}) => {
  // Paper size: A4 (Standard Desktop Printer) vs A3 (Commercial Press Standard)
  const [paperSize, setPaperSize] = useState<'A4' | 'A3'>('A4');

  // Border style: 'solid' (Standard Exam Board Frame) vs 'double' (Classic Double Frame) vs 'thin' vs 'none'
  const [borderStyle, setBorderStyle] = useState<'solid' | 'double' | 'thin' | 'none'>('solid');

  // Imposition mode: 
  // 'p1_p2' (Natural sequential screen reading: Sheet 1 = [P1 | P2], Sheet 2 = [P3 | P4])
  // 'p4_p1' (Standard Booklet Fold: Sheet 1 = [P4 | P1], Sheet 2 = [P2 | P3] -> Sequence: 4, 1, 2, 3)
  // 'p1_p4' (Left = Page 1, Right = Page 4)
  const [orderMode, setOrderMode] = useState<'p4_p1' | 'p1_p4' | 'p1_p2'>('p1_p2');

  // Font density / spacing
  const [density, setDensity] = useState<'normal' | 'spacious' | 'compact'>('compact');

  // ProshnoLab & eProshnobank Advanced Live Paper Customization States
  const isEnglishPaper = config.subject === 'ইংরেজি' || (config.pattern && config.pattern.startsWith('english_'));
  const [mcqColumns, setMcqColumns] = useState<1 | 2>(isEnglishPaper ? 1 : 2);
  const [optionStyle, setOptionStyle] = useState<'circle' | 'paren' | 'dot'>('circle');
  const [numberStyle, setNumberStyle] = useState<'dot' | ' zero_dot' | 'paren'>('dot');
  const [activeSet, setActiveSet] = useState<'ক' | 'খ' | 'গ' | 'ঘ'>('ক');
  const [showSetCode, setShowSetCode] = useState<boolean>(true);
  const [showSubjectCodeBox, setShowSubjectCodeBox] = useState<boolean>(true);
  const [showMarksBox, setShowMarksBox] = useState<boolean>(false);
  const [showStudentInfoBar, setShowStudentInfoBar] = useState<boolean>(false);
  const [showBoardTag, setShowBoardTag] = useState<boolean>(true);
  const [showTickAnswer, setShowTickAnswer] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showMiniOmr, setShowMiniOmr] = useState<boolean>(false);
  const [showTearOffSlip, setShowTearOffSlip] = useState<boolean>(false);
  const [headerColoredBg, setHeaderColoredBg] = useState<boolean>(false);
  const [headerBgColor, setHeaderBgColor] = useState<string>('#f0fdf4');
  const [paperTextColor, setPaperTextColor] = useState<string>('#0f172a');
  const [customFontSizePx, setCustomFontSizePx] = useState<number>(11);
  const [customGapPx, setCustomGapPx] = useState<number>(4);
  const [isInlineEditing, setIsInlineEditing] = useState<boolean>(false);
  const [showCustomizationSidebar, setShowCustomizationSidebar] = useState<boolean>(true);
  const [showSmartBoard, setShowSmartBoard] = useState<boolean>(false);
  const [smartBoardIndex, setSmartBoardIndex] = useState<number>(0);
  const [smartBoardReveal, setSmartBoardReveal] = useState<boolean>(false);

  useEffect(() => {
    setMcqColumns(isEnglishPaper ? 1 : 2);
  }, [isEnglishPaper]);

  // Local toggles
  const [showWatermark, setShowWatermark] = useState<boolean>(initialShowWatermark);
  const [watermarkImage, setWatermarkImage] = useState<string>(initialWatermarkImage || institution.logoUrl || defaultScienceStudioLogoSvg);
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(initialWatermarkOpacity);
  const [watermarkSize, setWatermarkSize] = useState<number>(initialWatermarkSize);
  const [showWatermarkModal, setShowWatermarkModal] = useState<boolean>(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setShowWatermark(initialShowWatermark);
  }, [initialShowWatermark]);

  useEffect(() => {
    if (initialWatermarkImage) setWatermarkImage(initialWatermarkImage);
  }, [initialWatermarkImage]);

  useEffect(() => {
    if (typeof initialWatermarkOpacity === 'number') setWatermarkOpacity(initialWatermarkOpacity);
  }, [initialWatermarkOpacity]);

  useEffect(() => {
    if (typeof initialWatermarkSize === 'number') setWatermarkSize(initialWatermarkSize);
  }, [initialWatermarkSize]);

  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(initialShowAnswerKey || false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const handleToggleWatermark = (val: boolean) => {
    setShowWatermark(val);
    if (onShowWatermarkChange) onShowWatermarkChange(val);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setWatermarkImage(result);
          if (onWatermarkImageChange) onWatermarkImageChange(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetToDefaultLogo = () => {
    setWatermarkImage(defaultScienceStudioLogoSvg);
    if (onWatermarkImageChange) onWatermarkImageChange(defaultScienceStudioLogoSvg);
  };

  const handleDownloadPDF = async () => {
    setIsExportingPdf(true);
    try {
      const cleanFileName = `${config.className || 'Exam'}_${config.subject || 'Subject'}_${config.examTitle || 'Paper'}`
        .replace(/[/\\?%*:|"<>]/g, '_')
        .replace(/\s+/g, '_');
      const success = await exportElementsToPDF(['booklet-sheet-1', 'booklet-sheet-2'], {
        fileName: `${cleanFileName}_Booklet.pdf`,
        orientation: 'landscape'
      });
      if (!success) {
        window.print();
      }
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Distribution of questions across the 4 pages:
  const defaultMcqSplit = Math.max(1, Math.min(sectionKQuestions.length, Math.ceil(sectionKQuestions.length * 0.55) || 16));
  const defaultCqSplit = Math.max(1, Math.min(sectionGQuestions.length, Math.ceil(sectionGQuestions.length / 2) || 4));

  const [mcqPage1Count, setMcqPage1Count] = useState<number>(defaultMcqSplit);
  const [cqPage3Count, setCqPage3Count] = useState<number>(defaultCqSplit);

  useEffect(() => {
    const newMcqSplit = Math.max(1, Math.min(sectionKQuestions.length, Math.ceil(sectionKQuestions.length * 0.55) || 16));
    const newCqSplit = Math.max(1, Math.min(sectionGQuestions.length, Math.ceil(sectionGQuestions.length / 2) || 4));
    setMcqPage1Count(newMcqSplit);
    setCqPage3Count(newCqSplit);
  }, [sectionKQuestions.length, sectionGQuestions.length]);

  const formatSerialNumber = (num: number, isEng = false) => {
    const str = isEng ? String(num) : toBengaliNumber(num);
    const padded = num < 10 ? (isEng ? `0${num}` : `০${str}`) : str;
    if (numberStyle === ' zero_dot') return `${padded}.`;
    if (numberStyle === 'paren') return `(${str})`;
    return `${str}.`;
  };

  const renderOptionBadge = (optIdx: number, isCorrect: boolean) => {
    const letters = isEnglishPaper ? ['a', 'b', 'c', 'd'] : ['ক', 'খ', 'গ', 'ঘ'];
    const letter = letters[optIdx] || 'ক';
    const highlight = showTickAnswer && isCorrect;

    if (optionStyle === 'circle') {
      return (
        <span
          className={`inline-flex items-center justify-center w-[15px] h-[15px] rounded-full text-[9.5px] font-bold mr-1 shrink-0 border ${
            highlight
              ? 'bg-slate-900 text-white border-slate-900'
              : 'border-slate-700 text-slate-900 bg-transparent'
          }`}
        >
          {letter}
        </span>
      );
    }
    if (optionStyle === 'dot') {
      return (
        <strong className={`mr-1 ${highlight ? 'underline font-black text-emerald-800' : ''}`}>
          {letter}. {highlight ? '✓' : ''}
        </strong>
      );
    }
    return (
      <strong className={`mr-1 ${highlight ? 'underline font-black text-emerald-800' : ''}`}>
        ({letter}){highlight ? '✓' : ''}
      </strong>
    );
  };

  // High-fidelity Question Content & Markdown Table Formatter
  const renderFormattedQuestionContent = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    const tableStartIndex = lines.findIndex(l => l.trim().startsWith('|') && l.trim().endsWith('|'));

    if (tableStartIndex !== -1) {
      let tableEndIndex = tableStartIndex;
      while (tableEndIndex < lines.length && lines[tableEndIndex].trim().startsWith('|')) {
        tableEndIndex++;
      }

      const beforeTable = lines.slice(0, tableStartIndex).join('\n').trim();
      const tableLines = lines.slice(tableStartIndex, tableEndIndex);
      const afterTable = lines.slice(tableEndIndex).join('\n').trim();

      const rows = tableLines
        .filter(l => !l.includes('---'))
        .map(l => l.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1));

      return (
        <div className="space-y-1 text-slate-950 font-serif leading-relaxed">
          {beforeTable && <div className="whitespace-pre-line text-justify">{beforeTable}</div>}
          {rows.length > 0 && (
            <div className="overflow-x-auto my-1.5">
              <table className="w-full text-[9.5px] border-collapse border border-slate-700 font-sans">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-900">
                    {rows[0].map((header, hIdx) => (
                      <th key={hIdx} className="border border-slate-500 px-2 py-1 text-left">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(1).map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="border border-slate-400 px-2 py-0.5">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {afterTable && <div className="whitespace-pre-line text-justify">{afterTable}</div>}
        </div>
      );
    }

    return <div className="whitespace-pre-line leading-relaxed text-justify">{text}</div>;
  };

  // Calculated slices
  const page1Mcqs = useMemo(() => sectionKQuestions.slice(0, mcqPage1Count), [sectionKQuestions, mcqPage1Count]);
  const page2Mcqs = useMemo(() => sectionKQuestions.slice(mcqPage1Count), [sectionKQuestions, mcqPage1Count]);
  const page3Cqs = useMemo(() => sectionGQuestions.slice(0, cqPage3Count), [sectionGQuestions, cqPage3Count]);
  const page4Cqs = useMemo(() => sectionGQuestions.slice(cqPage3Count), [sectionGQuestions, cqPage3Count]);

  // Section marks
  const sectionKMarks = useMemo(() => sectionKQuestions.reduce((acc, q) => acc + (q.marks || 1), 0), [sectionKQuestions]);
  const sectionKhMarks = useMemo(() => sectionKhQuestions.reduce((acc, q) => acc + (q.marks || 2), 0), [sectionKhQuestions]);
  const sectionGMarks = useMemo(() => sectionGQuestions.reduce((acc, q) => acc + (q.marks || 10), 0), [sectionGQuestions]);
  const totalCalculatedMarks = sectionKMarks + sectionKhMarks + sectionGMarks;

  // Border frame classes for standard exam question papers
  const borderClass = {
    solid: 'border-2 border-slate-900',
    double: 'border-4 border-double border-slate-900',
    thin: 'border border-slate-800',
    none: 'border border-transparent'
  }[borderStyle];

  // Print Booklet handler
  const handlePrint = () => {
    const styleId = 'dynamic-booklet-landscape-print-style';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    const paperSizeStr = paperSize === 'A3' ? 'A3 landscape' : 'A4 landscape';
    styleTag.innerHTML = `
      @media print {
        @page {
          size: ${paperSizeStr} !important;
          margin: 4mm 4mm 4mm 4mm !important;
        }
        html, body {
          width: 100% !important;
          height: 100% !important;
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
          height: 100% !important;
          min-height: 98vh !important;
          max-height: 100vh !important;
          box-sizing: border-box !important;
          box-shadow: none !important;
          border: none !important;
          margin: 0 auto !important;
          padding: 0 !important;
          background: #ffffff !important;
          overflow: hidden !important;
        }
        .booklet-print-sheet:last-of-type {
          page-break-after: auto !important;
          break-after: auto !important;
        }
      }
    `;
    window.print();
  };

  // Typography density classes
  const fontDensityClasses = {
    compact: {
      bodyText: 'text-[10.5px] leading-snug',
      heading: 'text-[11.5px] font-bold',
      mcqText: 'text-[10.5px] font-medium leading-snug',
      optionsText: 'text-[10px]',
      cqText: 'text-[10.5px] leading-snug',
      stimulusText: 'text-[10.5px] leading-snug p-1.5',
      spacing: 'space-y-1',
      headerPadding: 'pb-1 mb-1',
      institutionTitle: 'text-base font-black',
    },
    normal: {
      bodyText: 'text-[11.5px] leading-normal',
      heading: 'text-[12.5px] font-bold',
      mcqText: 'text-[11.5px] font-medium leading-normal',
      optionsText: 'text-[11px]',
      cqText: 'text-[11px] leading-relaxed',
      stimulusText: 'text-[11px] leading-relaxed p-2',
      spacing: 'space-y-1.5',
      headerPadding: 'pb-1.5 mb-1.5',
      institutionTitle: 'text-lg font-black',
    },
    spacious: {
      bodyText: 'text-[12.5px] leading-relaxed',
      heading: 'text-sm font-bold',
      mcqText: 'text-[12.5px] font-medium leading-relaxed',
      optionsText: 'text-[11.5px]',
      cqText: 'text-[12px] leading-relaxed',
      stimulusText: 'text-[11.5px] leading-relaxed p-2.5',
      spacing: 'space-y-2.5',
      headerPadding: 'pb-2 mb-2',
      institutionTitle: 'text-xl font-black',
    },
  }[density];

  // Picture Watermark Component
  const WatermarkOverlay = () => {
    if (!showWatermark || !watermarkImage) return null;
    return (
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
    );
  };

  // Reusable MCQ / Item Renderer (Strictly ZERO underlines under MCQs!)
  const renderMcqQuestionBlock = (q: QuestionItem, serialNum: number) => {
    if (q.type === 'short') {
      return (
        <div
          key={q.id || serialNum}
          className="mcq-question-item text-slate-950 break-inside-avoid pb-1"
          style={{ marginBottom: `${customGapPx}px`, fontSize: `${customFontSizePx}px`, color: paperTextColor }}
        >
          <div className="space-y-0.5">
            <div className="flex items-start justify-between gap-2">
              <p className="font-sans leading-snug" contentEditable={isInlineEditing} suppressContentEditableWarning>
                <strong className="font-serif">{q.itemNumber ? `${q.itemNumber}. ` : `${formatSerialNumber(serialNum, true)} `}</strong>
                <span>{q.question.split('\n')[0]}</span>
              </p>
              {q.marksDistribution && (
                <span className="font-mono text-[9.5px] text-slate-700 shrink-0 font-bold">
                  {q.marksDistribution}
                </span>
              )}
            </div>
            {(q as any).cluesBox && (q as any).cluesBox.length > 0 && (
              <div className="p-1 border border-slate-400 rounded text-[9px] font-mono text-center my-0.5 bg-slate-50/50">
                [ {(q as any).cluesBox.join(' | ')} ]
              </div>
            )}
            {q.question.includes('\n') && (
              <div
                className="text-[10px] font-serif leading-relaxed text-slate-900 pl-2.5"
                contentEditable={isInlineEditing}
                suppressContentEditableWarning
              >
                {renderFormattedQuestionContent(q.question.substring(q.question.indexOf('\n') + 1).trim())}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (q.type === 'mcq') {
      const optionsGridClass =
        mcqColumns === 2
          ? 'grid grid-cols-2 gap-x-1.5 gap-y-0.5 pl-2 pt-0.5'
          : 'grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-0.5 pl-2 pt-0.5';

      return (
        <div
          key={q.id || serialNum}
          className="mcq-question-item break-inside-avoid"
          style={{ marginBottom: `${customGapPx}px`, fontSize: `${customFontSizePx}px`, color: paperTextColor }}
        >
          <div className="flex items-start justify-between gap-1">
            <p className="font-sans leading-snug font-medium" contentEditable={isInlineEditing} suppressContentEditableWarning>
              <strong className="font-serif mr-1">{formatSerialNumber(serialNum, isEnglishPaper)}</strong>
              <span>{q.question}</span>
              {showBoardTag && q.boardInfo && (
                <span className="ml-1 text-[8.5px] font-normal text-slate-600 font-sans">
                  [{q.boardInfo}]
                </span>
              )}
            </p>
          </div>

          <div className={`${optionsGridClass} font-sans text-slate-900`} style={{ fontSize: `${Math.max(9, customFontSizePx - 0.5)}px` }}>
            {q.options.map((opt, oIdx) => (
              <span
                key={oIdx}
                className="inline-flex items-center leading-tight"
                contentEditable={isInlineEditing}
                suppressContentEditableWarning
              >
                {renderOptionBadge(oIdx, q.correctOption === oIdx)}
                <span>{opt}</span>
              </span>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-1 ml-2 p-1 rounded border border-slate-300 bg-slate-50/80 text-[9px] text-slate-700 font-sans leading-snug">
              <strong>ব্যাখ্যা:</strong> সঠিক উত্তর ({['ক', 'খ', 'গ', 'ঘ'][q.correctOption]}) {q.options[q.correctOption]}। {(q as any).explanation || ''}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  // Subject Code Digit Boxes Helper (e.g., [১][৭][৪])
  const subjectCodeDigits = useMemo(() => {
    const raw = (config.subjectCode || '১৭৪').trim();
    return raw.split('');
  }, [config.subjectCode]);

  // -------------------------------------------------------------
  // PAGE 1: Front Cover / Header & 'ক' বিভাগ (MCQ Part 1)
  // -------------------------------------------------------------
  const renderPage1 = () => (
    <div
      className={`relative flex flex-col h-full justify-between p-3 text-slate-950 font-serif ${borderClass} bg-white box-border`}
      style={{ color: paperTextColor }}
    >
      <WatermarkOverlay />
      
      <div className="relative z-10 flex-1 flex flex-col justify-start">
        {/* Institution & Exam Header (Authentic Board & ProshnoLab/eProshnobank Coaching Standard) */}
        <div
          className={`text-center border-b-2 border-slate-900 ${fontDensityClasses.headerPadding} rounded-t`}
          style={headerColoredBg ? { backgroundColor: headerBgColor, padding: '6px 8px' } : undefined}
        >
          {/* Top Row: Marks Box (Left) | Academy Title (Center) | Set & Subject Code Boxes (Right) */}
          <div className="flex items-start justify-between gap-2">
            {/* Left: Optional Obtained Marks Box */}
            {showMarksBox ? (
              <div className="border border-slate-800 px-1.5 py-0.5 text-[9px] font-sans font-bold text-center shrink-0 bg-white">
                <div className="border-b border-slate-400 pb-0.5">প্রাপ্ত নম্বর</div>
                <div className="h-3.5" />
              </div>
            ) : (
              <div className="w-10 shrink-0" />
            )}

            {/* Center: Institution Name & Address */}
            <div className="flex-1 text-center">
              <h1
                className={`${fontDensityClasses.institutionTitle} tracking-tight text-slate-950 leading-tight`}
                contentEditable={isInlineEditing}
                suppressContentEditableWarning
              >
                {config.academyName}
              </h1>
              {institution.village && (
                <p className="text-[9.5px] text-slate-600 font-sans" contentEditable={isInlineEditing} suppressContentEditableWarning>
                  {institution.village}, {institution.upazila}, {institution.district} {institution.eiin ? `| EIIN: ${institution.eiin}` : ''}
                </p>
              )}
              <div
                className="inline-block px-2.5 py-0.5 font-bold text-[11.5px] text-slate-950 font-sans"
                contentEditable={isInlineEditing}
                suppressContentEditableWarning
              >
                {config.examTitle}
              </div>
            </div>

            {/* Right: Set Code & Subject Code Digit Boxes */}
            <div className="flex flex-col items-end gap-1 shrink-0 font-sans">
              {showSetCode && (
                <div className="flex items-center gap-1 text-[9.5px] font-bold">
                  <span>সেট:</span>
                  <span className="inline-flex items-center justify-center w-4 h-4 border border-slate-900 font-black bg-white">
                    {activeSet}
                  </span>
                </div>
              )}
              {showSubjectCodeBox && config.subjectCode && (
                <div className="flex items-center gap-0.5 text-[9px] font-bold">
                  <span className="mr-0.5">কোড:</span>
                  {subjectCodeDigits.map((d, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center justify-center w-3.5 h-4 border border-slate-800 font-mono font-bold bg-white text-[9.5px]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Student Info Bar (Name, Roll, Section, Date) */}
          {showStudentInfoBar && (
            <div className="mt-1 pt-1 border-t border-slate-400 flex items-center justify-between gap-2 text-[9.5px] font-sans font-semibold text-slate-800">
              <span className="flex-1 text-left">শিক্ষার্থীর নাম: ....................................................</span>
              <span>রোল: ...................</span>
              <span>শাখা: ...............</span>
            </div>
          )}

          {/* Meta Bar: Subject, Class, Time, Marks */}
          <div className="pt-1 mt-0.5 flex items-center justify-between text-[10.5px] font-bold text-slate-900 px-0.5 border-t border-slate-400 font-sans">
            <div className="text-left" contentEditable={isInlineEditing} suppressContentEditableWarning>
              <span>বিষয়: {config.subject}</span>
              <span className="mx-1.5">|</span>
              <span>শ্রেণি: {config.className} {config.section ? `(${config.section})` : ''}</span>
            </div>
            <div className="text-right" contentEditable={isInlineEditing} suppressContentEditableWarning>
              <span>সময়: {config.duration}</span>
              <span className="mx-1.5">|</span>
              <span>পূর্ণমান: {config.totalMarks}</span>
            </div>
          </div>

          {config.instructions && (
            <div
              className="text-[9px] text-slate-700 italic pt-0.5 border-t border-dashed border-slate-300 text-center font-sans"
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
            >
              [{config.instructions}]
            </div>
          )}
        </div>

        {/* 'ক' বিভাগ : বহুনির্বাচনী প্রশ্ন (Part 1) or Part A: Grammar */}
        {page1Mcqs.length > 0 && (
          <div className="flex-1 flex flex-col mt-1">
            <div className="text-center border-b border-slate-800 pb-0.5 mb-1.5">
              <h2
                className={`font-bold uppercase tracking-wider text-slate-900 ${fontDensityClasses.heading}`}
                contentEditable={isInlineEditing}
                suppressContentEditableWarning
              >
                {isEnglishPaper
                  ? `Part A : Grammar [Full Marks: ${sectionKMarks}]`
                  : `'ক' বিভাগ : বহুনির্বাচনী প্রশ্ন ${sectionKMarks > 0 ? `[মান: ${toBengaliNumber(sectionKMarks)}]` : ''}`}
              </h2>
              <p className="text-[9px] text-slate-600 italic">
                {isEnglishPaper
                  ? '[Answer all the questions. Figures in the right margin indicate full marks.]'
                  : '[সঠিক উত্তরের বৃত্তটি ভরাট করো। প্রতিটি প্রশ্নের মান ১।]'}
              </p>
            </div>

            {/* Questions list - Supports 2-Column Coaching/Board Split or 1-Column */}
            <div
              className={
                mcqColumns === 2 && !isEnglishPaper
                  ? 'grid grid-cols-2 gap-x-3 items-start'
                  : 'flex-1 flex flex-col justify-start'
              }
            >
              {page1Mcqs.map((q, idx) => renderMcqQuestionBlock(q, idx + 1))}
            </div>
          </div>
        )}

        {/* If completely blank paper, show a friendly prompt on screen */}
        {sectionKQuestions.length === 0 && sectionKhQuestions.length === 0 && sectionGQuestions.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl my-4 text-center print:hidden bg-slate-50/70">
            <p className="text-sm font-bold text-slate-800">✨ সম্পূর্ণ ব্ল্যাঙ্ক প্রশ্নপত্র প্রস্তুত</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              উপরে একাডেমি ও পরীক্ষার হেডার সেট করা হয়েছে। প্রশ্নপত্র বিল্ডারে গিয়ে পছন্দমতো প্রশ্ন যোগ করলে এখানে স্বয়ংক্রিয়ভাবে সাজিয়ে যাবে।
            </p>
            <button
              onClick={onEditQuestions}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>প্রশ্ন যোগ করুন (Go to Builder)</span>
            </button>
          </div>
        )}
      </div>

      {/* Page 1 Footer */}
      <div className="relative z-10 pt-1 mt-auto border-t border-slate-300 text-center font-bold text-[10.5px] text-slate-900 font-sans tracking-widest">
        — পৃষ্ঠা ১ —
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // PAGE 2: Inside Left / 'ক' বিভাগ (MCQ Part 2) & 'খ' বিভাগ (Short)
  // -------------------------------------------------------------
  const renderPage2 = () => (
    <div
      className={`relative flex flex-col h-full justify-between p-3 text-slate-950 font-serif ${borderClass} bg-white box-border`}
      style={{ color: paperTextColor }}
    >
      <WatermarkOverlay />

      <div className="relative z-10 flex-1 flex flex-col justify-start">
        {/* Subtle Top Header */}
        <div className="flex items-center justify-between text-[9.5px] font-bold text-slate-700 border-b border-slate-300 pb-0.5 mb-1.5 font-sans">
          <span>{config.subject} ({config.className})</span>
          <span>সেট: {activeSet} | {config.examTitle}</span>
        </div>

        {/* 'ক' বিভাগ : বহুনির্বাচনী প্রশ্ন (Part 2) */}
        {page2Mcqs.length > 0 && (
          <div className="mb-2">
            <div className="text-center border-b border-slate-800 pb-0.5 mb-1.5">
              <h2 className={`font-bold uppercase tracking-wider text-slate-900 ${fontDensityClasses.heading}`}>
                {isEnglishPaper ? 'Part A : Grammar (Continued)' : '\'ক\' বিভাগ : বহুনির্বাচনী প্রশ্ন (অবশিষ্টাংশ)'}
              </h2>
            </div>

            <div
              className={
                mcqColumns === 2 && !isEnglishPaper
                  ? 'grid grid-cols-2 gap-x-3 items-start'
                  : 'flex flex-col'
              }
            >
              {page2Mcqs.map((q, idx) => renderMcqQuestionBlock(q, mcqPage1Count + idx + 1))}
            </div>
          </div>
        )}

        {/* 'খ' বিভাগ : সংক্ষিপ্ত প্রশ্নাবলী (Short Questions) */}
        {sectionKhQuestions.length > 0 && (
          <div className="flex-1 flex flex-col pt-1.5 border-t border-dashed border-slate-400">
            <div className="text-center border-b border-slate-800 pb-0.5 mb-1.5">
              <h2 className={`font-bold uppercase tracking-wider text-slate-900 ${fontDensityClasses.heading}`}>
                'খ' বিভাগ : সংক্ষিপ্ত প্রশ্নাবলী [পূর্ণমান: {toBengaliNumber(sectionKhMarks)}]
              </h2>
              <p className="text-[9px] text-slate-600 italic">
                [যেকোনো {toBengaliNumber(Math.min(sectionKhQuestions.length, 10))}টি প্রশ্নের সংক্ষিপ্ত উত্তর দাও। প্রতিটি প্রশ্নের মান ২।]
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-start space-y-1">
              {sectionKhQuestions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="flex items-start justify-between gap-3 break-inside-avoid text-slate-950 font-sans"
                  style={{ fontSize: `${customFontSizePx}px` }}
                >
                  <p contentEditable={isInlineEditing} suppressContentEditableWarning>
                    <strong className="font-serif">{formatSerialNumber(idx + 1)} </strong>
                    {q.type === 'short' ? q.question : ''}
                  </p>
                  <span className="font-mono text-[9.5px] text-slate-700 shrink-0 font-bold">
                    [{toBengaliNumber(q.marks || 2)}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional Attached Mini OMR Grid at Bottom of Page 2 (ProshnoLab / eProshnobank signature feature) */}
        {showMiniOmr && sectionKQuestions.some(q => q.type === 'mcq') && (
          <div className="mt-auto pt-1.5 border-t-2 border-dashed border-slate-700 bg-slate-50/60 p-1.5 rounded">
            <div className="flex items-center justify-between text-[8.5px] font-bold font-sans text-slate-900 mb-1 border-b border-slate-300 pb-0.5">
              <span>✂ সংযুক্ত মিনি OMR উত্তরপত্র (সঠিক বৃত্তটি কালো বলপেন দিয়ে ভরাট করো)</span>
              <span>নাম: ............................... রোল: ............ সেট: [{activeSet}]</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-2 gap-y-0.5 font-sans text-[8px]">
              {sectionKQuestions
                .filter(q => q.type === 'mcq')
                .slice(0, 30)
                .map((q, idx) => (
                  <div key={idx} className="flex items-center gap-0.5">
                    <span className="w-3.5 font-bold text-right">{toBengaliNumber(idx + 1)}.</span>
                    {(['ক', 'খ', 'গ', 'ঘ'] as const).map((ltr, oIdx) => {
                      const isAns = showTickAnswer && (q as MCQQuestion).correctOption === oIdx;
                      return (
                        <span
                          key={ltr}
                          className={`inline-flex items-center justify-center w-3 h-3 rounded-full border text-[7px] font-bold ${
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
      </div>

      {/* Page 2 Footer */}
      <div className="relative z-10 pt-1 mt-auto border-t border-slate-300 text-center font-bold text-[10.5px] text-slate-900 font-sans tracking-widest">
        — পৃষ্ঠা ২ —
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // PAGE 3: Inside Right / 'গ' বিভাগ : সৃজনশীল প্রশ্ন (CQ Part 1)
  // -------------------------------------------------------------
  const renderPage3 = () => (
    <div
      className={`relative flex flex-col h-full justify-between p-3 text-slate-950 font-serif ${borderClass} bg-white box-border`}
      style={{ color: paperTextColor }}
    >
      <WatermarkOverlay />

      <div className="relative z-10 flex-1 flex flex-col justify-start">
        {/* Subtle Top Header */}
        <div className="flex items-center justify-between text-[9.5px] font-bold text-slate-700 border-b border-slate-300 pb-0.5 mb-1.5 font-sans">
          <span>{config.subject} ({config.className})</span>
          <span>সেট: {activeSet} | {config.examTitle}</span>
        </div>

        {/* 'গ' বিভাগ : সৃজনশীল প্রশ্ন (CQ Part 1) or Part B: Composition */}
        {page3Cqs.length > 0 && (
          <div className="flex-1 flex flex-col">
            <div className="text-center border-b border-slate-800 pb-0.5 mb-1.5">
              <h2 className={`font-bold uppercase tracking-wider text-slate-900 ${fontDensityClasses.heading}`}>
                {isEnglishPaper
                  ? `Part B : Composition [Full Marks: ${sectionGMarks}]`
                  : `'গ' বিভাগ : সৃজনশীল প্রশ্নাবলী (CQ) ${sectionGMarks > 0 ? `[পূর্ণমান: ${toBengaliNumber(sectionGMarks)}]` : ''}`}
              </h2>
              <p className="text-[9px] text-slate-600 italic">
                {isEnglishPaper
                  ? '[Answer the following questions / write the composition as instructed.]'
                  : '[উদ্দীপকগুলো মনোযোগ সহকারে পড়ে সংশ্লিষ্ট প্রশ্নগুলোর যথাযথ উত্তর দাও।]'}
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-start space-y-2">
              {page3Cqs.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="break-inside-avoid pb-1.5"
                  style={{ fontSize: `${customFontSizePx}px` }}
                >
                  {q.type === 'short' ? (
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-sans leading-snug" contentEditable={isInlineEditing} suppressContentEditableWarning>
                          <strong className="font-serif">{q.itemNumber ? `${q.itemNumber}. ` : `${page1Mcqs.length + page2Mcqs.length + idx + 1}. `}</strong>
                          <span>{q.question.split('\n')[0]}</span>
                        </p>
                        {q.marksDistribution && (
                          <span className="font-mono text-[9.5px] text-slate-700 shrink-0 font-bold">
                            {q.marksDistribution}
                          </span>
                        )}
                      </div>
                      {q.question.includes('\n') && (
                        <div className="text-[10px] font-serif leading-relaxed text-slate-900 pl-3 pt-0.5" contentEditable={isInlineEditing} suppressContentEditableWarning>
                          {renderFormattedQuestionContent(q.question.substring(q.question.indexOf('\n') + 1).trim())}
                        </div>
                      )}
                    </div>
                  ) : q.type === 'cq' ? (
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-950 font-sans" contentEditable={isInlineEditing} suppressContentEditableWarning>
                          {formatSerialNumber(idx + 1)} নিচের উদ্দীপকটি পড়ে সংশ্লিষ্ট প্রশ্নগুলোর যথাযথ উত্তর দাও:
                        </span>
                        {showBoardTag && q.boardInfo && (
                          <span className="font-sans text-[8.5px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-300">
                            {q.boardInfo}
                          </span>
                        )}
                      </div>
                      {/* Stimulus */}
                      <div
                        className="font-serif leading-relaxed text-slate-950 text-justify py-0.5 pl-0.5 font-medium"
                        contentEditable={isInlineEditing}
                        suppressContentEditableWarning
                      >
                        {q.stimulus}
                      </div>

                      {/* Sub Questions (ক, খ, গ, ঘ) */}
                      <div className="space-y-0.5 pl-2 font-sans">
                        {q.subQuestions.map(sq => (
                          <div key={sq.label} className="flex items-start justify-between text-slate-900">
                            <span contentEditable={isInlineEditing} suppressContentEditableWarning>
                              <strong>({sq.label})</strong> {sq.question}
                            </span>
                            <span className="font-mono text-slate-700 pl-2 font-bold shrink-0 text-[9.5px]">
                              [{isEnglishPaper ? sq.marks : toBengaliNumber(sq.marks)}]
                            </span>
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
      </div>

      {/* Page 3 Footer */}
      <div className="relative z-10 pt-1 mt-auto border-t border-slate-300 text-center font-bold text-[10.5px] text-slate-900 font-sans tracking-widest">
        — পৃষ্ঠা ৩ —
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // PAGE 4: Back Cover / 'গ' বিভাগ (CQ Part 2) & Clean Ending
  // -------------------------------------------------------------
  const renderPage4 = () => (
    <div
      className={`relative flex flex-col h-full justify-between p-3 text-slate-950 font-serif ${borderClass} bg-white box-border`}
      style={{ color: paperTextColor }}
    >
      <WatermarkOverlay />

      <div className="relative z-10 flex-1 flex flex-col justify-start">
        {/* Subtle Top Header */}
        <div className="flex items-center justify-between text-[9.5px] font-bold text-slate-700 border-b border-slate-300 pb-0.5 mb-1.5 font-sans">
          <span>{config.subject} ({config.className})</span>
          <span>সেট: {activeSet} | {config.examTitle}</span>
        </div>

        {/* 'গ' বিভাগ : সৃজনশীল প্রশ্ন (CQ Part 2) or Part B: Composition continued */}
        {page4Cqs.length > 0 && (
          <div className="flex-1 flex flex-col">
            <div className="text-center border-b border-slate-800 pb-0.5 mb-1.5">
              <h2 className={`font-bold uppercase tracking-wider text-slate-900 ${fontDensityClasses.heading}`}>
                {isEnglishPaper ? 'Part B : Composition (Continued)' : '\'গ\' বিভাগ : সৃজনশীল প্রশ্নাবলী (অবশিষ্টাংশ)'}
              </h2>
            </div>

            <div className="flex-1 flex flex-col justify-start space-y-2">
              {page4Cqs.map((q, idx) => {
                const serialNum = cqPage3Count + idx + 1;
                return (
                  <div
                    key={q.id || idx}
                    className="break-inside-avoid pb-1.5"
                    style={{ fontSize: `${customFontSizePx}px` }}
                  >
                    {q.type === 'short' ? (
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-sans leading-snug" contentEditable={isInlineEditing} suppressContentEditableWarning>
                            <strong className="font-serif">{q.itemNumber ? `${q.itemNumber}. ` : `${page1Mcqs.length + page2Mcqs.length + serialNum}. `}</strong>
                            <span>{q.question.split('\n')[0]}</span>
                          </p>
                          {q.marksDistribution && (
                            <span className="font-mono text-[9.5px] text-slate-700 shrink-0 font-bold">
                              {q.marksDistribution}
                            </span>
                          )}
                        </div>
                        {q.question.includes('\n') && (
                          <div className="text-[10px] font-serif leading-relaxed text-slate-900 pl-3 pt-0.5" contentEditable={isInlineEditing} suppressContentEditableWarning>
                            {renderFormattedQuestionContent(q.question.substring(q.question.indexOf('\n') + 1).trim())}
                          </div>
                        )}
                      </div>
                    ) : q.type === 'cq' ? (
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-950 font-sans" contentEditable={isInlineEditing} suppressContentEditableWarning>
                            {formatSerialNumber(serialNum)} নিচের উদ্দীপকটি পড়ে সংশ্লিষ্ট প্রশ্নগুলোর যথাযথ উত্তর দাও:
                          </span>
                          {showBoardTag && q.boardInfo && (
                            <span className="font-sans text-[8.5px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-300">
                              {q.boardInfo}
                            </span>
                          )}
                        </div>
                        {/* Stimulus */}
                        <div
                          className="font-serif leading-relaxed text-slate-950 text-justify py-0.5 pl-0.5 font-medium"
                          contentEditable={isInlineEditing}
                          suppressContentEditableWarning
                        >
                          {q.stimulus}
                        </div>

                        {/* Sub Questions (ক, খ, গ, ঘ) */}
                        <div className="space-y-0.5 pl-2 font-sans">
                          {q.subQuestions.map(sq => (
                            <div key={sq.label} className="flex items-start justify-between text-slate-900">
                              <span contentEditable={isInlineEditing} suppressContentEditableWarning>
                                <strong>({sq.label})</strong> {sq.question}
                              </span>
                              <span className="font-mono text-slate-700 pl-2 font-bold shrink-0 text-[9.5px]">
                                [{isEnglishPaper ? sq.marks : toBengaliNumber(sq.marks)}]
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Clean Completion Line */}
        <div className="mt-auto py-1.5 text-center text-slate-700 font-bold text-[11px] tracking-wider">
          — সমাপ্ত —
        </div>

        {/* Optional Chirkut / Tear-off Answer Slip (চিরকুট উত্তরপত্র) */}
        {showTearOffSlip && sectionKQuestions.length > 0 && (
          <div className="mt-1 pt-1 border-t border-dashed border-slate-500 space-y-1">
            <div className="flex items-center justify-between text-[8px] font-bold text-slate-800 font-sans">
              <span>✂ চিরকুট উত্তরপত্র (শিক্ষার্থীর অংশ)</span>
              <span>নাম: .................................... রোল: .............</span>
            </div>
            <div className="grid grid-cols-10 gap-0.5 text-[8px] text-center font-mono">
              {sectionKQuestions.slice(0, 30).map((_, idx) => (
                <div key={idx} className="p-0.5 border border-slate-400 bg-white">
                  <span className="text-slate-600">{toBengaliNumber(idx + 1)}:</span> ___
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional Answer Key for Teachers / Evaluators */}
        {showAnswerKey && sectionKQuestions.length > 0 && (
          <div className="mt-1.5 pt-1 border-t border-dashed border-slate-400 space-y-1">
            <div className="text-center font-bold text-[8.5px] uppercase tracking-wider text-slate-800 font-sans">
              ★ বহুনির্বাচনী উত্তরমালা (সেট: {activeSet}) ★
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1 text-[8px] text-center font-mono">
              {sectionKQuestions.map((q, idx) => {
                const correctLetters = ['ক', 'খ', 'গ', 'ঘ'];
                return (
                  <div key={idx} className="p-0.5 border border-slate-300 bg-slate-50 rounded">
                    <span className="text-slate-500">{toBengaliNumber(idx + 1)}:</span>
                    <strong className="text-emerald-700 ml-0.5 font-bold">
                      {q.type === 'mcq' ? correctLetters[q.correctOption] : '-'}
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Page 4 Footer */}
      <div className="relative z-10 pt-1 mt-auto border-t border-slate-300 text-center font-bold text-[10.5px] text-slate-900 font-sans tracking-widest">
        — পৃষ্ঠা ৪ —
      </div>
    </div>
  );

  // All questions combined for Smart Board classroom view
  const allQuestionsForBoard = useMemo(
    () => [...sectionKQuestions, ...sectionKhQuestions, ...sectionGQuestions],
    [sectionKQuestions, sectionKhQuestions, sectionGQuestions]
  );

  return (
    <div className="space-y-4 text-[#1f332c]">
      
      {/* Top Action & Quick Mode Bar */}
      <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onSwitchToPortrait}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <FileText className="w-3.5 h-3.5 text-teal-700" />
            <span>পোর্ট্রেট A4 ভিউ</span>
          </button>

          {/* Imposition / Page Layout Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setOrderMode('p1_p2')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1 ${
                orderMode === 'p1_p2' ? 'bg-teal-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>স্বাভাবিক ক্রম (১, ২ | ৩, ৪)</span>
            </button>

            <button
              onClick={() => setOrderMode('p4_p1')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1 ${
                orderMode === 'p4_p1' ? 'bg-teal-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FoldHorizontal className="w-3.5 h-3.5" />
              <span>বুকলেট ভাঁজ (৪, ১ | ২, ৩)</span>
            </button>
          </div>

          {/* 1-Column vs 2-Column MCQ inside Booklet Pages */}
          <div className="flex items-center gap-1 bg-emerald-50 p-1 rounded-xl border border-emerald-200">
            <Columns className="w-3.5 h-3.5 text-emerald-700 ml-1" />
            <button
              onClick={() => setMcqColumns(1)}
              className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                mcqColumns === 1 ? 'bg-emerald-700 text-white' : 'text-emerald-900'
              }`}
            >
              ১ কলাম MCQ
            </button>
            <button
              onClick={() => setMcqColumns(2)}
              className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                mcqColumns === 2 ? 'bg-emerald-700 text-white' : 'text-emerald-900'
              }`}
            >
              ২ কলাম MCQ (কোচিং স্ট্যান্ডার্ড)
            </button>
          </div>

          {/* Live Inline Editing Toggle */}
          <button
            onClick={() => setIsInlineEditing(!isInlineEditing)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition border ${
              isInlineEditing
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>এডিটিং মোড {isInlineEditing ? '(চালু)' : '(বন্ধ)'}</span>
          </button>

          {/* Smart Board Classroom Mode */}
          <button
            onClick={() => {
              setSmartBoardIndex(0);
              setSmartBoardReveal(false);
              setShowSmartBoard(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Smart Board-এ নিন</span>
          </button>
        </div>

        {/* Right Side: Customize Drawer Toggle, Save, PDF & Print */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowCustomizationSidebar(!showCustomizationSidebar)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition border ${
              showCustomizationSidebar
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 text-slate-800 border-slate-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>প্রশ্ন কাস্টমাইজেশন প্যানেল</span>
          </button>

          <button
            onClick={onEditQuestions}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-semibold text-xs cursor-pointer transition"
          >
            ← প্রশ্ন সংযোজন
          </button>

          {onSavePaper && (
            <button
              onClick={onSavePaper}
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>সেভ</span>
            </button>
          )}

          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPdf}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'পিডিএফ তৈরি হচ্ছে...' : 'ডাউনলোড (PDF)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>প্রিন্ট বুকলেট</span>
          </button>
        </div>
      </div>

      {/* Floating Inline Editing Rich Text Toolbar (When Editing Mode is Active) */}
      {isInlineEditing && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-3 print:hidden shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
            <Edit3 className="w-4 h-4 text-amber-600" />
            <span>লাইভ এডিটিং চালু: প্রশ্নপত্রের যেকোনো লেখার ওপর ক্লিক করে সরাসরি বাংলা/ইংরেজি এডিট করুন!</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-amber-200">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold'); }}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-800 font-bold"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic'); }}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-800"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); document.execCommand('underline'); }}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-800"
              title="Underline"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); document.execCommand('justifyLeft'); }}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-800"
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); document.execCommand('justifyCenter'); }}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-800"
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Split Workspace: Left = Printable Booklet Sheets | Right = ProshnoLab/eProshnobank Live Settings Sidebar */}
      <div className="flex flex-col xl:flex-row items-start gap-5">
        
        {/* LEFT COLUMN: Page Split Bar + Printable Booklet Sheets */}
        <div className="flex-1 w-full min-w-0 space-y-5">
          {/* Page Split Adjustment Toolbar */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 text-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>৪টি পেজে প্রশ্ন বণ্টন ও ফন্ট সাইজ নিয়ন্ত্রণ:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-slate-800">
              {/* MCQ Split Control */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-600">১ম পৃষ্ঠায় MCQ:</span>
                <button
                  onClick={() => setMcqPage1Count(prev => Math.max(1, prev - 1))}
                  disabled={mcqPage1Count <= 1}
                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center cursor-pointer disabled:opacity-40"
                >
                  -
                </button>
                <span className="font-bold text-emerald-800 min-w-[18px] text-center">
                  {toBengaliNumber(mcqPage1Count)}
                </span>
                <button
                  onClick={() => setMcqPage1Count(prev => Math.min(sectionKQuestions.length, prev + 1))}
                  disabled={mcqPage1Count >= sectionKQuestions.length}
                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center cursor-pointer disabled:opacity-40"
                >
                  +
                </button>
                <span className="text-[10.5px] text-slate-400">
                  (২য় পৃষ্ঠায় {toBengaliNumber(Math.max(0, sectionKQuestions.length - mcqPage1Count))}টি)
                </span>
              </div>

              {/* CQ Split Control */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-600">৩য় পৃষ্ঠায় CQ:</span>
                <button
                  onClick={() => setCqPage3Count(prev => Math.max(1, prev - 1))}
                  disabled={cqPage3Count <= 1}
                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center cursor-pointer disabled:opacity-40"
                >
                  -
                </button>
                <span className="font-bold text-emerald-800 min-w-[18px] text-center">
                  {toBengaliNumber(cqPage3Count)}
                </span>
                <button
                  onClick={() => setCqPage3Count(prev => Math.min(sectionGQuestions.length, prev + 1))}
                  disabled={cqPage3Count >= sectionGQuestions.length}
                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center cursor-pointer disabled:opacity-40"
                >
                  +
                </button>
                <span className="text-[10.5px] text-slate-400">
                  (৪র্থ পৃষ্ঠায় {toBengaliNumber(Math.max(0, sectionGQuestions.length - cqPage3Count))}টি)
                </span>
              </div>

              {/* Font Size px Control */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-600">ফন্ট:</span>
                <button
                  onClick={() => setCustomFontSizePx(prev => Math.max(9, prev - 0.5))}
                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <span className="font-mono font-bold text-slate-800">{customFontSizePx}px</span>
                <button
                  onClick={() => setCustomFontSizePx(prev => Math.min(16, prev + 0.5))}
                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Gap px Control */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-600">গ্যাপ:</span>
                <button
                  onClick={() => setCustomGapPx(prev => Math.max(1, prev - 1))}
                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <span className="font-mono font-bold text-slate-800">{customGapPx}px</span>
                <button
                  onClick={() => setCustomGapPx(prev => Math.min(14, prev + 1))}
                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PRINTABLE SHEETS CONTAINER (Exact A4 Landscape Proportions) */}
          {/* ========================================================================= */}
          <div id="printable-booklet-sheets" className="space-y-8 overflow-x-auto pb-2">

            {/* SHEET 1 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1 print:hidden">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>পাতা ১ : ল্যান্ডস্কেপ শিট (Sheet 1)</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {orderMode === 'p4_p1' && 'বামে [পৃষ্ঠা ৪] • ডানে [পৃষ্ঠা ১] (বুকলেট ভাঁজ ক্রম)'}
                  {orderMode === 'p1_p4' && 'বামে [পৃষ্ঠা ১] • ডানে [পৃষ্ঠা ৪]'}
                  {orderMode === 'p1_p2' && 'বামে [পৃষ্ঠা ১] • ডানে [পৃষ্ঠা ২] (ধারাবাহিক ক্রম)'}
                </span>
              </div>

              <div 
                id="booklet-sheet-1" 
                className="booklet-print-sheet bg-white border border-slate-300 rounded-none print:shadow-none print:border-none print:m-0 w-full max-w-[1122px] mx-auto shadow-sm box-border min-h-[793px] h-auto print:h-full"
              >
                <div className="grid grid-cols-2 min-h-[793px] h-full relative divide-x-2 divide-dashed divide-slate-400">
                  {/* Left Half of Sheet 1 */}
                  <div className="h-full p-2.5 box-border flex flex-col justify-between">
                    {orderMode === 'p1_p4' ? renderPage1() : orderMode === 'p4_p1' ? renderPage4() : renderPage1()}
                  </div>

                  {/* Center Fold Line Guide */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col justify-between items-center pointer-events-none py-2 text-[9px] text-slate-600 print:hidden z-20">
                    <span className="bg-white/95 px-1.5 py-0.5 rounded border border-slate-300 font-sans font-bold text-slate-700">
                      ✂ ভাঁজ রেখা
                    </span>
                    <span className="bg-white/95 px-1.5 py-0.5 rounded border border-slate-300 font-sans font-bold text-slate-700">
                      ✂ মাঝখানে ভাঁজ
                    </span>
                  </div>

                  {/* Right Half of Sheet 1 */}
                  <div className="h-full p-2.5 box-border flex flex-col justify-between">
                    {orderMode === 'p1_p4' ? renderPage4() : orderMode === 'p4_p1' ? renderPage1() : renderPage2()}
                  </div>
                </div>
              </div>
            </div>

            {/* SHEET 2 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1 print:hidden">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>পাতা ২ : ল্যান্ডস্কেপ শিট (Sheet 2)</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {orderMode === 'p1_p2' ? 'বামে [পৃষ্ঠা ৩] • ডানে [পৃষ্ঠা ৪]' : 'বামে [পৃষ্ঠা ২] • ডানে [পৃষ্ঠা ৩]'}
                </span>
              </div>

              <div 
                id="booklet-sheet-2" 
                className="booklet-print-sheet bg-white border border-slate-300 rounded-none print:shadow-none print:border-none print:m-0 w-full max-w-[1122px] mx-auto shadow-sm box-border min-h-[793px] h-auto print:h-full"
              >
                <div className="grid grid-cols-2 min-h-[793px] h-full relative divide-x-2 divide-dashed divide-slate-400">
                  {/* Left Half of Sheet 2 */}
                  <div className="h-full p-2.5 box-border flex flex-col justify-between">
                    {orderMode === 'p1_p2' ? renderPage3() : renderPage2()}
                  </div>

                  {/* Center Fold Line Guide */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col justify-between items-center pointer-events-none py-2 text-[9px] text-slate-600 print:hidden z-20">
                    <span className="bg-white/95 px-1.5 py-0.5 rounded border border-slate-300 font-sans font-bold text-slate-700">
                      ✂ ভাঁজ রেখা
                    </span>
                    <span className="bg-white/95 px-1.5 py-0.5 rounded border border-slate-300 font-sans font-bold text-slate-700">
                      ✂ মাঝখানে ভাঁজ
                    </span>
                  </div>

                  {/* Right Half of Sheet 2 */}
                  <div className="h-full p-2.5 box-border flex flex-col justify-between">
                    {orderMode === 'p1_p2' ? renderPage4() : renderPage3()}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: ProshnoLab & eProshnobank Style Live Customization Sidebar */}
        {showCustomizationSidebar && (
          <div className="w-full xl:w-80 shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4 print:hidden sticky top-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">প্রশ্নপত্র কাস্টমাইজেশন স্টুডিও</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                ProshnoLab + eProshno
              </span>
            </div>

            {/* Set Selector & Shuffle */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">সেট কোড নির্বাচন:</span>
                <div className="flex items-center gap-1">
                  {(['ক', 'খ', 'গ', 'ঘ'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setActiveSet(s)}
                      className={`w-6 h-6 rounded font-bold text-xs cursor-pointer transition ${
                        activeSet === s
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {onShuffleQuestions && (
                <button
                  type="button"
                  onClick={onShuffleQuestions}
                  className="w-full py-1.5 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>প্রশ্ন শাফল করুন (Shuffle Set)</span>
                </button>
              )}
            </div>

            {/* Toggle Switches (প্রশ্নে সংযুক্তি) */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>প্রশ্নে সংযুক্তি ও অপশন টগল:</span>
              </div>

              <div className="space-y-1.5 text-xs">
                {[
                  { label: 'এডিটিং মোড (Live Edit)', state: isInlineEditing, setter: setIsInlineEditing },
                  { label: 'উত্তরপত্র (সঠিক বৃত্ত ভরাট ●)', state: showTickAnswer, setter: setShowTickAnswer },
                  { label: 'সমাধান / ব্যাখ্যা সংযুক্ত', state: showExplanation, setter: setShowExplanation },
                  { label: 'প্রশ্নে মিনি OMR সংযুক্ত', state: showMiniOmr, setter: setShowMiniOmr },
                  { label: 'চিরকুট উত্তরপত্র সংযুক্ত', state: showTearOffSlip, setter: setShowTearOffSlip },
                  { label: 'শেষে পূর্ণাঙ্গ উত্তরমালা ছক', state: showAnswerKey, setter: setShowAnswerKey },
                  { label: 'বোর্ড ও সাল ট্যাগ [ঢা. বো. ২৪]', state: showBoardTag, setter: setShowBoardTag },
                  { label: 'বিষয় কোড বক্স [১][৭][৪]', state: showSubjectCodeBox, setter: setShowSubjectCodeBox },
                  { label: 'সেট কোড প্রদর্শন [ক]', state: showSetCode, setter: setShowSetCode },
                  { label: 'প্রাপ্ত নম্বর ঘর (উপরে বামে)', state: showMarksBox, setter: setShowMarksBox },
                  { label: 'শিক্ষার্থীর নাম ও রোল ঘর', state: showStudentInfoBar, setter: setShowStudentInfoBar },
                  { label: 'লগো জলছাপ (Watermark)', state: showWatermark, setter: handleToggleWatermark },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition"
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
            </div>

            {/* Option Style & Numbering Style */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="font-bold text-slate-700 block mb-1">অপশন স্টাইল (MCQ Circle):</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'circle', label: 'বৃত্ত ⓐ ⓑ' },
                    { id: 'paren', label: 'বন্ধনী (ক)' },
                    { id: 'dot', label: 'ডট ক. খ.' },
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setOptionStyle(st.id as any)}
                      className={`py-1.5 px-2 rounded-lg font-bold border text-[11px] cursor-pointer transition ${
                        optionStyle === st.id
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">প্রশ্নের নম্বর স্টাইল:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'dot', label: '১. ২. ৩.' },
                    { id: ' zero_dot', label: '০১. ০২.' },
                    { id: 'paren', label: '(১) (২)' },
                  ].map(ns => (
                    <button
                      key={ns.id}
                      type="button"
                      onClick={() => setNumberStyle(ns.id as any)}
                      className={`py-1.5 px-2 rounded-lg font-bold border text-[11px] cursor-pointer transition ${
                        numberStyle === ns.id
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ns.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">পেইজ বর্ডার স্টাইল:</span>
                <select
                  value={borderStyle}
                  onChange={(e) => setBorderStyle(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 font-bold text-slate-800 outline-none"
                >
                  <option value="solid">সিঙ্গেল বর্ডার (বোর্ড স্ট্যান্ডার্ড)</option>
                  <option value="double">ক্লাসিক ডাবল বর্ডার</option>
                  <option value="thin">সূক্ষ্ম বর্ডার (Thin)</option>
                  <option value="none">বর্ডার ছাড়া (No Border)</option>
                </select>
              </div>

              {/* Header Colored Background & Text Color */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-teal-600" />
                    <span>রঙিন হেডার ব্যাকগ্রাউন্ড</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={headerColoredBg}
                    onChange={(e) => setHeaderColoredBg(e.target.checked)}
                    className="w-4 h-4 accent-teal-600 cursor-pointer"
                  />
                </div>
                {headerColoredBg && (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-slate-500">ব্যাকগ্রাউন্ড কালার:</span>
                    <input
                      type="color"
                      value={headerBgColor}
                      onChange={(e) => setHeaderBgColor(e.target.value)}
                      className="w-8 h-6 rounded cursor-pointer border border-slate-300"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/70">
                  <span className="text-[11px] text-slate-600 font-semibold">প্রশ্নের টেক্সট কালার:</span>
                  <input
                    type="color"
                    value={paperTextColor}
                    onChange={(e) => setPaperTextColor(e.target.value)}
                    className="w-8 h-6 rounded cursor-pointer border border-slate-300"
                  />
                </div>
              </div>

              {/* Watermark Quick Configure Button */}
              <button
                type="button"
                onClick={() => setShowWatermarkModal(true)}
                className="w-full py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>লগো জলছাপ আপলোড ও অপাসিটি</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Smart Board Interactive Classroom Modal */}
      {showSmartBoard && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 print:hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-white">{config.academyName} — Smart Board</h2>
                <p className="text-xs text-slate-400">
                  {config.subject} ({config.className}) • প্রশ্ন {toBengaliNumber(smartBoardIndex + 1)} / {toBengaliNumber(Math.max(1, allQuestionsForBoard.length))}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSmartBoard(false)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
            >
              Smart Board বন্ধ করুন ✕
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center max-w-4xl w-full mx-auto py-8">
            {allQuestionsForBoard.length === 0 ? (
              <div className="text-center text-slate-400">কোনো প্রশ্ন যুক্ত করা হয়নি।</div>
            ) : (
              (() => {
                const q = allQuestionsForBoard[smartBoardIndex];
                if (!q) return null;
                return (
                  <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                        প্রশ্ন নং {toBengaliNumber(smartBoardIndex + 1)}
                      </span>
                      {q.boardInfo && (
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                          🏛️ {q.boardInfo}
                        </span>
                      )}
                    </div>

                    <div className="text-2xl md:text-3xl font-bold leading-relaxed text-white">
                      {q.type === 'cq' ? q.stimulus : q.question}
                    </div>

                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = q.correctOption === oIdx;
                          return (
                            <div
                              key={oIdx}
                              onClick={() => setSmartBoardReveal(true)}
                              className={`p-4 rounded-2xl border-2 text-lg font-semibold cursor-pointer transition flex items-center gap-3 ${
                                smartBoardReveal && isCorrect
                                  ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200'
                                  : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-indigo-400'
                              }`}
                            >
                              <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">
                                {['ক', 'খ', 'গ', 'ঘ'][oIdx]}
                              </span>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'cq' && (
                      <div className="space-y-3 pt-2 text-lg text-slate-200">
                        {q.subQuestions.map(sq => (
                          <div key={sq.label} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex justify-between">
                            <span><strong>({sq.label})</strong> {sq.question}</span>
                            <span className="text-indigo-400 font-mono">[{toBengaliNumber(sq.marks)}]</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <button
              disabled={smartBoardIndex <= 0}
              onClick={() => {
                setSmartBoardIndex(prev => Math.max(0, prev - 1));
                setSmartBoardReveal(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 font-bold text-sm cursor-pointer"
            >
              ← পূর্ববর্তী প্রশ্ন
            </button>

            <button
              onClick={() => setSmartBoardReveal(!smartBoardReveal)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm cursor-pointer"
            >
              {smartBoardReveal ? 'উত্তর লুকান' : 'সঠিক উত্তর দেখুন ✓'}
            </button>

            <button
              disabled={smartBoardIndex >= allQuestionsForBoard.length - 1}
              onClick={() => {
                setSmartBoardIndex(prev => Math.min(allQuestionsForBoard.length - 1, prev + 1));
                setSmartBoardReveal(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 font-bold text-sm cursor-pointer"
            >
              পরবর্তী প্রশ্ন →
            </button>
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
                  <h3 className="font-bold text-slate-900 text-base">বুকলেট লগো ওয়াটারমার্ক সেটিংস</h3>
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
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800">জলছাপ প্রদর্শন করুন (Show Watermark)</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showWatermark}
                    onChange={(e) => handleToggleWatermark(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

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
                  <div className="text-xs font-bold text-slate-900">লগো ইমেজ (Picture / Logo)</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    আপনার কম্পিউটার বা ফোন থেকে প্রতিষ্ঠানের যে কোনো লগো আপলোড করুন। এটি ৪-পৃষ্ঠার প্রতিটি পাতার মাঝখানে হালকা জলছাপ হিসেবে বসবে।
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
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>সায়েন্স স্টুডিও সিল</span>
                    </button>
                  </div>
                </div>
              </div>

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
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setWatermarkOpacity(val);
                    if (onWatermarkOpacityChange) onWatermarkOpacityChange(val);
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">লগোর আকার (Watermark Size):</span>
                  <span className="font-mono text-teal-700 font-black bg-teal-100 px-2 py-0.5 rounded-md text-xs">
                    {watermarkSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="360"
                  step="10"
                  value={watermarkSize}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setWatermarkSize(val);
                    if (onWatermarkSizeChange) onWatermarkSizeChange(val);
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
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
