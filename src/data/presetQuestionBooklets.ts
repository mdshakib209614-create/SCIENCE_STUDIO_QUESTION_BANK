import { QuestionItem, MCQQuestion, CQQuestion, ShortQuestion, ExamPaperConfig } from '../types';
import { mathCQQuestions } from './cq/mathCQ';
import { allMathQuestions } from './questionBank';
import { englishBoardQuestions } from './questions/englishBoardQuestions';

// ============================================================================
// 1. SSC MATHEMATICS FULL 100 MARKS MODEL BOOKLET
// ============================================================================
// Structure:
// ক বিভাগ : বহুনির্বাচনী প্রশ্ন (৩০টি প্রশ্ন) = ৩০ নম্বর
// খ বিভাগ : সৃজনশীল প্রশ্ন (১১টি প্রশ্ন থেকে যেকোনো ৭টি প্রশ্ন) = ৭০ নম্বর
//   - ক অংশ (বীজগণিত): ৩টি প্রশ্ন
//   - খ অংশ (জ্যামিতি): ৩টি প্রশ্ন
//   - গ অংশ (ত্রিকোণমিতি ও পরিমিতি): ৩টি প্রশ্ন
//   - ঘ অংশ (পরিসংখ্যান): ২টি প্রশ্ন
// Total = 100 Marks (4 Pages Landscape Booklet)
// ============================================================================

const sscMathMCQs: MCQQuestion[] = [
  {
    id: 'math-mcq-p1-01',
    subject: 'সাধারণ গণিত',
    chapter: 'বাস্তব সংখ্যা',
    question: 'নিচের কোনটি অমূলদ সংখ্যা?',
    options: ['√9', '√(16/9)', '√7', '0.333...'],
    correctOption: 2,
    explanation: '√7 এর পূর্ণবর্গমূল নেই এবং এটি অনাবৃত্ত অসীম দশমিক সংখ্যা।',
    marks: 1,
    type: 'mcq',
    boardInfo: "ঢাকা বোর্ড '২৩"
  },
  {
    id: 'math-mcq-p1-02',
    subject: 'সাধারণ গণিত',
    chapter: 'সেট ও ফাংশন',
    question: 'A = {x ∈ N : x² < 20} হলে, A সেটের উপাদান সংখ্যা কয়টি?',
    options: ['২', '৩', '৪', '৫'],
    correctOption: 2,
    explanation: 'স্বাভাবিক সংখ্যা x = 1, 2, 3, 4 হলে x² = 1, 4, 9, 16 < 20। সুতরাং উপাদান ৪টি।',
    marks: 1,
    type: 'mcq',
    boardInfo: "রাজশাহী বোর্ড '২৩"
  },
  {
    id: 'math-mcq-p1-03',
    subject: 'সাধারণ গণিত',
    chapter: 'বীজগাণিতিক রাশি',
    question: 'x + 1/x = 3 হলে, x² + 1/x² এর মান কত?',
    options: ['7', '9', '11', '13'],
    correctOption: 0,
    explanation: '(x + 1/x)² - 2 = 3² - 2 = 7।',
    marks: 1,
    type: 'mcq',
    boardInfo: "চট্টগ্রাম বোর্ড '২৪"
  },
  {
    id: 'math-mcq-p1-04',
    subject: 'সাধারণ গণিত',
    chapter: 'বীজগাণিতিক রাশি',
    question: 'a³ - b³ = 513 এবং a - b = 3 হলে, ab এর মান কত?',
    options: ['48', '54', '56', '60'],
    correctOption: 1,
    explanation: 'a³ - b³ = (a-b)³ + 3ab(a-b) => 513 = 27 + 9ab => 9ab = 486 => ab = 54।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p1-05',
    subject: 'সাধারণ গণিত',
    chapter: 'সূচক ও লগারিদম',
    question: 'log₂ (1/32) এর মান কত?',
    options: ['-5', '5', '-1/5', '1/5'],
    correctOption: 0,
    explanation: 'log₂ (2⁻⁵) = -5।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p1-06',
    subject: 'সাধারণ গণিত',
    chapter: 'এক চলকবিশিষ্ট সমীকরণ',
    question: '√(2x - 3) + 3 = 2 সমীকরণটির সমাধান সেট কোনটি?',
    options: ['{2}', '{4}', '∅', '{1}'],
    correctOption: 2,
    explanation: '√(2x-3) = -1, বর্গমূল কখনো ঋণাত্মক হতে পারে না।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p1-07',
    subject: 'সাধারণ গণিত',
    chapter: 'ব্যবহারিক জ্যামিতি',
    question: 'একটি রম্বস আঁকার জন্য কয়টি স্বতন্ত্র উপাত্ত প্রয়োজন?',
    options: ['১টি', '২টি', '৩টি', '৪টি'],
    correctOption: 1,
    explanation: 'রম্বস আঁকার জন্য ২টি উপাত্ত প্রয়োজন (যেমন এক বাহু ও এক কোণ বা দুই কর্ণ)।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p1-08',
    subject: 'সাধারণ গণিত',
    chapter: 'বৃত্ত',
    question: 'অর্ধবৃত্তস্থ কোণ সর্বদা কেমন কোণ?',
    options: ['সূক্ষ্মকোণ', 'স্থূলকোণ', 'এক সমকোণ', 'প্রবৃদ্ধ কোণ'],
    correctOption: 2,
    explanation: 'উপপাদ্য অনুসারে অর্ধবৃত্তস্থ কোণ এক সমকোণ (90°)।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p1-09',
    subject: 'সাধারণ গণিত',
    chapter: 'ত্রিকোণমিতিক অনুপাত',
    question: 'sin θ = 1/2 হলে, cot θ এর মান কত?',
    options: ['1/√3', '√3', '2', '1'],
    correctOption: 1,
    explanation: 'θ = 30°, cot 30° = √3।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p1-10',
    subject: 'সাধারণ গণিত',
    chapter: 'ত্রিকোণমিতিক অনুপাত',
    question: 'tan 45° + sin² 60° + cos² 60° এর মান কত?',
    options: ['1', '2', '3', '0'],
    correctOption: 1,
    explanation: 'tan 45° = 1, এবং sin² 60° + cos² 60° = 1। সুতরাং 1 + 1 = 2।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p1-11',
    subject: 'সাধারণ গণিত',
    chapter: 'দূরত্ব ও উচ্চতা',
    question: 'একটি মিনারের পাদদেশ হতে 30 মিটার দূরে ভূ-পৃষ্ঠের কোনো বিন্দুতে চূড়ার উন্নতি কোণ 60° হলে মিনারের উচ্চতা কত?',
    options: ['10√3 মি.', '20√3 মি.', '30√3 মি.', '60 মি.'],
    correctOption: 2,
    explanation: 'tan 60° = h / 30 => h = 30√3 মি.।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p1-12',
    subject: 'সাধারণ গণিত',
    chapter: 'বীজগাণিতিক অনুপাত ও সমানুপাত',
    question: 'a : b = 3 : 4 এবং b : c = 5 : 6 হলে, a : b : c = কত?',
    options: ['15:20:24', '12:15:18', '9:12:16', '15:20:25'],
    correctOption: 0,
    explanation: 'ধারাবাহিক অনুপাত: 3×5 : 4×5 : 4×6 = 15 : 20 : 24।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p1-13',
    subject: 'সাধারণ গণিত',
    chapter: 'সসীম ধারা',
    question: '1 + 4 + 7 + 10 + ... ধারাটির দশম (১০ম) পদ কত?',
    options: ['28', '31', '34', '37'],
    correctOption: 0,
    explanation: 'a + (n-1)d = 1 + (10-1)×3 = 1 + 27 = 28।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p1-14',
    subject: 'সাধারণ গণিত',
    chapter: 'পরিমিতি',
    question: 'একটি সমবাহু ত্রিভুজের বাহুর দৈর্ঘ্য 4 সে.মি. হলে, এর ক্ষেত্রফল কত বর্গ সে.মি.?',
    options: ['2√3', '4√3', '8√3', '16√3'],
    correctOption: 1,
    explanation: '(√3 / 4) × a² = (√3 / 4) × 16 = 4√3।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p1-15',
    subject: 'সাধারণ গণিত',
    chapter: 'পরিসংখ্যান',
    question: '8, 12, 16, 20, 24 সংখ্যাগুলোর মধ্যক কত?',
    options: ['12', '16', '14', '18'],
    correctOption: 1,
    explanation: 'উপাত্তগুলো ক্রমানুসারে সাজানো আছে এবং মাঝের সংখ্যাটি ১৬।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p2-16',
    subject: 'সাধারণ গণিত',
    chapter: 'বাস্তব সংখ্যা',
    question: '0.23̇ এর সাধারণ ভগ্নাংশ কোনটি?',
    options: ['23/90', '21/90', '23/99', '21/99'],
    correctOption: 1,
    explanation: '(23 - 2) / 90 = 21/90 = 7/30।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p2-17',
    subject: 'সাধারণ গণিত',
    chapter: 'সেট ও ফাংশন',
    question: 'সার্বিক সেট U = {1, 2, 3, 4, 5, 6} এবং A = {2, 4, 6} হলে, A\' কোনটি?',
    options: ['{1, 3, 5}', '{2, 4, 6}', '{1, 2, 3}', '∅'],
    correctOption: 0,
    explanation: 'A\' = U \\ A = {1, 3, 5}।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p2-18',
    subject: 'সাধারণ গণিত',
    chapter: 'বীজগাণিতিক রাশি',
    question: 'যদি p + q = 5 এবং p - q = 3 হয়, তবে 4pq এর মান কত?',
    options: ['16', '20', '24', '34'],
    correctOption: 0,
    explanation: '4pq = (p+q)² - (p-q)² = 5² - 3² = 25 - 9 = 16।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p2-19',
    subject: 'সাধারণ গণিত',
    chapter: 'সূচক ও লগারিদম',
    question: '4^(x + 1) = 32 হলে, x এর মান কত?',
    options: ['1/2', '3/2', '2/3', '5/2'],
    correctOption: 1,
    explanation: '2^(2x + 2) = 2⁵ => 2x + 2 = 5 => 2x = 3 => x = 3/2।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p2-20',
    subject: 'সাধারণ গণিত',
    chapter: 'এক চলকবিশিষ্ট সমীকরণ',
    question: 'ax² + bx + c = 0 সমীকরণের নিশ্চায়ক (Discriminant) কোনটি?',
    options: ['b² - 4ac', 'b² + 4ac', '4ac - b²', '√(b² - 4ac)'],
    correctOption: 0,
    explanation: 'দ্বিঘাত সমীকরণের নিশ্চায়ক D = b² - 4ac।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p2-21',
    subject: 'সাধারণ গণিত',
    chapter: 'ব্যবহারিক জ্যামিতি',
    question: 'একটি ত্রিভুজ আঁকা সম্ভব যদি এর বাহুগুলোর দৈর্ঘ্য হয়—',
    options: ['2 সে.মি., 3 সে.মি., 5 সে.মি.', '3 সে.মি., 4 সে.মি., 5 সে.মি.', '1 সে.মি., 2 সে.মি., 4 সে.মি.', '2 সে.মি., 4 সে.মি., 7 সে.মি.'],
    correctOption: 1,
    explanation: 'ত্রিভুজের যেকোনো দুই বাহুর সমষ্টি ৩য় বাহু অপেক্ষা বৃহত্তর হতে হবে: 3 + 4 = 7 > 5।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p2-22',
    subject: 'সাধারণ গণিত',
    chapter: 'বৃত্ত',
    question: 'বৃত্তের পরিধি ও ব্যাসের অনুপাত কত?',
    options: ['π', '2π', 'π/2', '4π'],
    correctOption: 0,
    explanation: 'পরিধি = 2πr, ব্যাস = 2r; অনুপাত 2πr / 2r = π।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p2-23',
    subject: 'সাধারণ গণিত',
    chapter: 'ত্রিকোণমিতিক অনুপাত',
    question: 'sec² θ - tan² θ এর মান কত?',
    options: ['0', '1', '-1', '2'],
    correctOption: 1,
    explanation: 'মৌলিক ত্রিকোণমিতিক অভেদ: sec² θ - tan² θ = 1।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p2-24',
    subject: 'সাধারণ গণিত',
    chapter: 'ত্রিকোণমিতিক অনুপাত',
    question: 'সূর্য্যের উন্নতি কোণ 45° হলে একটি লাঠির দৈর্ঘ্য ও তার ছায়ার দৈর্ঘ্যের অনুপাত কত হবে?',
    options: ['1 : 1', '1 : √3', '√3 : 1', '1 : 2'],
    correctOption: 0,
    explanation: 'tan 45° = লম্ব / ভূমি = 1 => লম্ব : ভূমি = 1 : 1।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p2-25',
    subject: 'সাধারণ গণিত',
    chapter: 'সসীম ধারা',
    question: '2 + 4 + 8 + 16 + ... গুণোত্তর ধারাটির সাধারণ অনুপাত কত?',
    options: ['2', '4', '8', '1/2'],
    correctOption: 0,
    explanation: 'r = 4 / 2 = 2।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p2-26',
    subject: 'সাধারণ গণিত',
    chapter: 'পরিমিতি',
    question: 'একটি বৃত্তের ব্যাসার্ধ 7 সে.মি. হলে এর ক্ষেত্রফল কত বর্গ সে.মি.? (π = 22/7)',
    options: ['44', '88', '154', '308'],
    correctOption: 2,
    explanation: 'ক্ষেত্রফল = πr² = (22/7) × 7 × 7 = 154 বর্গ সে.মি.।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p2-27',
    subject: 'সাধারণ গণিত',
    chapter: 'পরিসংখ্যান',
    question: 'প্রচুরক শ্রেণির ক্ষেত্রে L = 40, f₁ = 5, f₂ = 3 এবং h = 10 হলে প্রচুরক কত?',
    options: ['45.25', '46.25', '47.5', '48.0'],
    correctOption: 1,
    explanation: 'L + [f₁ / (f₁ + f₂)] × h = 40 + [5 / 8] × 10 = 40 + 6.25 = 46.25।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p2-28',
    subject: 'সাধারণ গণিত',
    chapter: 'পরিসংখ্যান',
    question: 'উপাত্তের সর্বোচ্চ মান 85 এবং সর্বনিম্ন মান 31 হলে পরিসর (Range) কত?',
    options: ['54', '55', '56', '57'],
    correctOption: 1,
    explanation: 'পরিসর = (সর্বোচ্চ মান - সর্বনিম্ন মান) + ১ = (85 - 31) + 1 = 54 + 1 = 55।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p2-29',
    subject: 'সাধারণ গণিত',
    chapter: 'পরিমিতি',
    question: 'একটি ঘনকের ধার 3 সে.মি. হলে এর সম্পূর্ণ পৃষ্ঠের ক্ষেত্রফল কত?',
    options: ['27 বর্গ সে.মি.', '54 বর্গ সে.মি.', '36 বর্গ সে.মি.', '18 বর্গ সে.মি.'],
    correctOption: 1,
    explanation: 'ঘনকের সমগ্র পৃষ্ঠের ক্ষেত্রফল = 6a² = 6 × 3² = 6 × 9 = 54 বর্গ সে.মি.।',
    marks: 1,
    type: 'mcq'
  },
  {
    id: 'math-mcq-p2-30',
    subject: 'সাধারণ গণিত',
    chapter: 'বৃত্ত',
    question: 'বৃত্তের স্পর্শক ও স্পর্শবিন্দুগামী ব্যাসার্ধের মধ্যবর্তী কোণ কত ডিগ্রি?',
    options: ['45°', '60°', '90°', '180°'],
    correctOption: 2,
    explanation: 'উপপাদ্য অনুসারে বৃত্তের স্পর্শক স্পর্শবিন্দুগামী ব্যাসার্ধের ওপর লম্ব (90°)।',
    marks: 1,
    type: 'mcq'
  }
];

const sscMathCQs: CQQuestion[] = [
  // Page 3 CQs (বীজগণিত ও জ্যামিতি অংশ)
  {
    id: 'math-cq-p3-01',
    subject: 'সাধারণ গণিত',
    chapter: 'বীজগাণিতিক রাশি',
    stimulus: 'একটি বীজগাণিতিক সম্পর্ক: x² - 2√6x + 1 = 0 এবং p³ + p⁻³ = 18√3, যেখানে x > 0 এবং p > 0।',
    subQuestions: [
      { label: 'ক', question: 'উৎপাদকে বিশ্লেষণ করো: 4a² - 12ab + 9b² - 16c²', marks: 2 },
      { label: 'খ', question: 'প্রমাণ করো যে, x³ + 1/x³ = 18√6', marks: 4 },
      { label: 'গ', question: 'দেখাও যে, p = √3 + √2', marks: 4 }
    ],
    marks: 10,
    type: 'cq',
    boardInfo: "ঢাকা বোর্ড '২৩"
  },
  {
    id: 'math-cq-p3-02',
    subject: 'সাধারণ গণিত',
    chapter: 'সসীম ধারা',
    stimulus: 'একটি সমান্তর ধারার ১ম পদ a এবং সাধারণ অন্তর d। ধারাটির ১৬তম পদ -২০ এবং অপর একটি গুণোত্তর ধারার ৪র্থ পদ 1/3 ও ৯ম পদ 1/(27√3)।',
    subQuestions: [
      { label: 'ক', question: 'log√3 81 এর মান নির্ণয় করো।', marks: 2 },
      { label: 'খ', question: 'সমান্তর ধারাটির প্রথম ৩১টি পদের সমষ্টি নির্ণয় করো।', marks: 4 },
      { label: 'গ', question: 'গুণোত্তর ধারাটির প্রথম ৭টি পদের সমষ্টি নির্ণয় করো।', marks: 4 }
    ],
    marks: 10,
    type: 'cq',
    boardInfo: "যশোর বোর্ড '২৪"
  },
  {
    id: 'math-cq-p3-03',
    subject: 'সাধারণ গণিত',
    chapter: 'বৃত্ত',
    stimulus: 'O কেন্দ্রবিশিষ্ট একটি বৃত্তে AB ও CD দুটি সমান জ্যা এবং কেন্দ্র থেকে এদের ওপর যথাক্রমে OE ও OF লম্ব।',
    subQuestions: [
      { label: 'ক', question: 'একটি বৃত্তের ব্যাসার্ধ 5 সে.মি. হলে এর পরিধি নির্ণয় করো।', marks: 2 },
      { label: 'খ', question: 'প্রমাণ করো যে, কেন্দ্র O থেকে AB ও CD জ্যা দুটি সমদূরবর্তী।', marks: 4 },
      { label: 'গ', question: 'যদি জ্যা দুটি বৃত্তের অভ্যন্তরে পরস্পরকে ছেদ করে, তবে দেখাও যে, একটির অংশদ্বয় অপরটির অংশদ্বয়ের সমান।', marks: 4 }
    ],
    marks: 10,
    type: 'cq',
    boardInfo: "কুমিল্লা বোর্ড '২৩"
  },
  {
    id: 'math-cq-p3-04',
    subject: 'সাধারণ গণিত',
    chapter: 'ব্যবহারিক জ্যামিতি',
    stimulus: 'একটি ত্রিভুজের ভূমি a = 5 সে.মি., ভূমি সংলগ্ন কোণ ∠x = 60° এবং অপর দুই বাহুর সমষ্টি s = 9 সে.মি.।',
    subQuestions: [
      { label: 'ক', question: 'চাঁদার সাহায্য ব্যতীত কোণ ∠x এর সম্পূরক কোণ অঙ্কন করো।', marks: 2 },
      { label: 'খ', question: 'উক্ত উপাত্তগুলো ব্যবহার করে ত্রিভুজটি অঙ্কন করো (অঙ্কনের চিহ্ন ও বিবরণ আবশ্যক)।', marks: 4 },
      { label: 'গ', question: 'একটি সমবাহু ত্রিভুজ আঁক যার পরিসীমা প্রদত্ত সমষ্টি s এর সমান।', marks: 4 }
    ],
    marks: 10,
    type: 'cq',
    boardInfo: "রাজশাহী বোর্ড '২৩"
  },

  // Page 4 CQs (ত্রিকোণমিতি, পরিমিতি ও পরিসংখ্যান অংশ)
  {
    id: 'math-cq-p4-05',
    subject: 'সাধারণ গণিত',
    chapter: 'ত্রিকোণমিতিক অনুপাত',
    stimulus: 'p = 1 + sin A এবং q = 1 - sin A। অপর একটি সমীকরণ: 2 cos(A + B) = 1 = 2 sin(A - B)।',
    subQuestions: [
      { label: 'ক', question: 'tan θ = 3/4 হলে, cos θ এর মান নির্ণয় করো।', marks: 2 },
      { label: 'খ', question: 'প্রমাণ করো যে, √(p/q) = sec A + tan A', marks: 4 },
      { label: 'গ', question: 'A ও B সূক্ষ্মকোণ হলে তাদের মান নির্ণয় করো।', marks: 4 }
    ],
    marks: 10,
    type: 'cq',
    boardInfo: "দিনাজপুর বোর্ড '২৪"
  },
  {
    id: 'math-cq-p4-06',
    subject: 'সাধারণ গণিত',
    chapter: 'দূরত্ব ও উচ্চতা',
    stimulus: 'একটি নদীর তীরে দাঁড়িয়ে এক ব্যক্তি দেখল যে, নদীর অপর তীরে অবস্থিত একটি টাওয়ারের উন্নতি কোণ 60°। ঐ স্থান থেকে 32 মিটার পিছিয়ে গেলে উন্নতি কোণ 30° হয়।',
    subQuestions: [
      { label: 'ক', question: 'সংক্ষিপ্ত বিবরণসহ আনুপাতিক চিত্র অঙ্কন করো।', marks: 2 },
      { label: 'খ', question: 'টাওয়ারটির উচ্চতা নির্ণয় করো।', marks: 4 },
      { label: 'গ', question: 'নদীটির বিস্তার নির্ণয় করো।', marks: 4 }
    ],
    marks: 10,
    type: 'cq',
    boardInfo: "বরিশাল বোর্ড '২৩"
  },
  {
    id: 'math-cq-p4-07',
    subject: 'সাধারণ গণিত',
    chapter: 'পরিমিতি',
    stimulus: 'একটি লোহার পাইপের ভেতরের ও বাইরের ব্যাস যথাক্রমে 12 সে.মি. ও 14 সে.মি. এবং পাইপের উচ্চতা 5 মিটার। 1 ঘন সে.মি. লোহার ওজন 7.2 গ্রাম।',
    subQuestions: [
      { label: 'ক', question: 'পাইপটির ফাঁপা অংশের ব্যাসার্ধ কত সে.মি.?', marks: 2 },
      { label: 'খ', question: 'পাইপটিতে ব্যবহৃত লোহার আয়তন নির্ণয় করো।', marks: 4 },
      { label: 'গ', question: 'উক্ত পাইপের লোহার মোট ওজন কত কিলোগ্রাম?', marks: 4 }
    ],
    marks: 10,
    type: 'cq',
    boardInfo: "চট্টগ্রাম বোর্ড '২৪"
  },
  {
    id: 'math-cq-p4-08',
    subject: 'সাধারণ গণিত',
    chapter: 'পরিসংখ্যান',
    stimulus: 'দশম শ্রেণির ৫০ জন শিক্ষার্থীর গণিত বিষয়ের প্রাপ্ত নম্বরের গণসংখ্যা নিবেশন সারণি নিচে দেওয়া হলো:\nশ্রেণি ব্যাপ্তি: ৩১-৪০ (৬), ৪১-৫০ (৮), ৫১-৬০ (১২), ৬১-৭০ (১০), ৭১-৮০ (৮), ৮১-৯০ (৪), ৯১-১০০ (২)।',
    subQuestions: [
      { label: 'ক', question: 'ক্রমযোজিত গণসংখ্যা সারণি প্রস্তুত করো।', marks: 2 },
      { label: 'খ', question: 'সংক্ষিপ্ত পদ্ধতিতে প্রাপ্ত নম্বরের গড় নির্ণয় করো।', marks: 4 },
      { label: 'গ', question: 'প্রদত্ত উপাত্তের মধ্যক ও প্রচুরক নির্ণয় করো।', marks: 4 }
    ],
    marks: 10,
    type: 'cq',
    boardInfo: "ময়মনসিংহ বোর্ড '২৪"
  }
];

// ============================================================================
// 2. SSC ENGLISH 2ND PAPER MODEL QUESTION BOOKLET (FULL 100 MARKS)
// ============================================================================
// Structure:
// Part A: Grammar [60 Marks]
//   1. Gap filling with clues (prepositions, articles, parts of speech) [0.5 x 10 = 5]
//   2. Gap filling without clues [0.5 x 10 = 5]
//   3. Substitution Table [1 x 6 = 6]
//   4. Right form of verbs [1 x 10 = 10]
//   5. Narrative Style (Direct to Indirect Speech) [5]
//   6. Changing Sentences (Transformation: Voice, Degree, Complex/Simple) [1 x 10 = 10]
//   7. Completing Sentences (Clauses & Conditionals) [1 x 5 = 5]
//   8. Use of Suffix and Prefix [0.5 x 10 = 5]
//   9. Tag Questions [1 x 5 = 5]
//   10. Sentence Connectors [1 x 5 = 5]
//   11. Punctuation & Capitalization [5]
// Part B: Composition [40 Marks]
//   12. Formal Letter / CV with Cover Letter [10]
//   13. Paragraph Writing (Answering Questions) [10]
//   14. Descriptive Report / Complaint Letter [10]
//   15. Short Composition [10]
// ============================================================================

const sscEnglish2ndPaperGrammarQuestions: ShortQuestion[] = [
  // Page 1 Items
  {
    id: 'eng2-item-01',
    subject: 'ইংরেজি',
    chapter: 'Grammar',
    grammarTopic: 'Gap Filling with Clues',
    topic: 'Item 1: Gap Filling with Clues (Dhaka Board)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '0.5 × 10 = 5',
    cluesBox: ['a', 'the', 'of', 'in', 'for', 'by', 'with', 'from', 'an', 'to'],
    question: `Fill in the blanks with suitable words from the box. You may need to change the forms of some words. You may use one word more than once:
[Clues: a | the | of | in | for | by | with | from | an | to]

Education is (a) _______ backbone of a nation. No nation can make progress without (b) _______ proper education. It enlightens our mind and removes (c) _______ darkness of ignorance. It develops our mental faculty and enables us (d) _______ distinguish between right and wrong. An educated man is respected (e) _______ all in society. He is free (f) _______ superstition and narrow-mindedness. We must ensure education (g) _______ all citizens (h) _______ our country. Illiteracy is (i) _______ curse that drags us backwards (j) _______ the race of modern civilization.`,
    answer: `(a) the (b) a (c) the (d) to (e) by (f) from (g) for (h) of (i) a (j) in`,
    type: 'short',
    itemNumber: 1,
    part: 'Part A: Grammar'
  },
  {
    id: 'eng2-item-02',
    subject: 'ইংরেজি',
    chapter: 'Grammar',
    grammarTopic: 'Gap Filling without Clues',
    topic: 'Item 2: Gap Filling without Clues (Rajshahi Board)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '0.5 × 10 = 5',
    question: `Fill in the blanks with suitable words (one word in each gap):

A patriot is a person who loves his motherland from (a) _______ core of his heart. Patriotism is one of (b) _______ noblest virtues of human beings. It inspires a man to do everything (c) _______ the welfare and sovereignty of his country. A true patriot does not hesitate (d) _______ sacrifice even his life for the freedom of his nation. On the contrary, an unpatriotic person thinks only (e) _______ his own selfish interests. Nobody respects (f) _______ self-centered man. When he dies, he sinks (g) _______ oblivion unhonoured and unsung. Therefore, we should all be (h) _______ to defend the honor of our nation and work hard (i) _______ eradicate poverty and corruption (j) _______ our beloved land.`,
    answer: `(a) the (b) the (c) for (d) to (e) of (f) a (g) into (h) determined / ready (i) to (j) from`,
    type: 'short',
    itemNumber: 2,
    part: 'Part A: Grammar'
  },
  {
    id: 'eng2-item-03',
    subject: 'ইংরেজি',
    chapter: 'Grammar',
    grammarTopic: 'Substitution Table',
    topic: 'Item 3: Substitution Table (Cumilla Board)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 6,
    marksDistribution: '1 × 6 = 6',
    question: `Make six meaningful sentences using parts of sentences from each column of the table below:

| Column A | Column B | Column C |
| --- | --- | --- |
| (i) Digital Bangladesh | means | an indispensable part of our modern life. |
| (ii) Information technology | has brought | having an ICT-based modern knowledge society. |
| (iii) The Internet | is | revolutionary transformations in every sphere of existence. |
| (iv) Online education | enables | students to access world-class lectures from remote hamlets. |
| (v) Freelancers | are earning | millions of dollars in foreign exchange every year. |
| (vi) We | should utilize | technology for national productivity and human development. |`,
    answer: `1. Digital Bangladesh means having an ICT-based modern knowledge society.
2. Information technology has brought revolutionary transformations in every sphere of existence.
3. The Internet is an indispensable part of our modern life.
4. Online education enables students to access world-class lectures from remote hamlets.
5. Freelancers are earning millions of dollars in foreign exchange every year.
6. We should utilize technology for national productivity and human development.`,
    type: 'short',
    itemNumber: 3,
    part: 'Part A: Grammar'
  },

  // Page 2 Items
  {
    id: 'eng2-item-04',
    subject: 'ইংরেজি',
    chapter: 'Grammar',
    grammarTopic: 'Right Form of Verbs',
    topic: 'Item 4: Right Form of Verbs (Chattogram Board)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 10,
    marksDistribution: '1 × 10 = 10',
    cluesBox: ['take', 'destroy', 'pollute', 'live', 'suffer', 'plant', 'be', 'breathe', 'do', 'realize'],
    question: `Complete the following text with the correct form of the verbs given in the box:
[Clues: take | destroy | pollute | live | suffer | plant | be | breathe | do | realize]

Environment (a) _______ an indispensable component of our life. Clean nature helps us to (b) _______ in peace and dignity. But nowadays our precious biosphere is being (c) _______ indiscriminately. Air is being polluted by hazardous fumes. As a fatal consequence, we are (d) _______ contaminated air and (e) _______ from acute respiratory maladies. Deforestation (f) _______ immense catastrophe to our regional climate. If trees (g) _______ continuously cut down, our mother planet will turn into a desert. Therefore, we should (h) _______ massive trees across the country. We must (i) _______ prompt statutory measures before things become irreversible. Unless citizens (j) _______ their environmental civic duties, sustainable progress cannot be achieved.`,
    answer: `(a) is (b) live (c) destroyed / polluted (d) breathing (e) suffering (f) is doing / does (g) are (h) plant (i) take (j) realize`,
    type: 'short',
    itemNumber: 4,
    part: 'Part A: Grammar'
  },
  {
    id: 'eng2-item-05',
    subject: 'ইংরেজি',
    chapter: 'Grammar',
    grammarTopic: 'Narration (Direct & Indirect Speech)',
    topic: 'Item 5: Narrative Style (Jashore Board)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '5 Marks',
    question: `Change the following narrative style from direct to indirect speech:

"Have you completed your preparation for the SSC examination?" said the Headmaster to Kamal. "No, sir, I am still quite weak in Mathematics and English Grammar," replied Kamal with deep humility. "Do not be discouraged. Attend our specialized remedial sessions and practice model tests attentively every single day," said the Headmaster encouragingly. "Thank you very much, respected sir, for your invaluable paternal guidance," said the grateful student.`,
    answer: `The Headmaster asked Kamal if he had completed his preparation for the SSC examination. Kamal respectfully replied in the negative and admitted that he was still quite weak in Mathematics and English Grammar. Then the Headmaster encouraged him not to be discouraged and advised him to attend their specialized remedial sessions and practice model tests attentively every single day. The grateful student thanked the respected Headmaster very much for his invaluable paternal guidance.`,
    type: 'short',
    itemNumber: 5,
    part: 'Part A: Grammar'
  },
  {
    id: 'eng2-item-06',
    subject: 'ইংরেজি',
    chapter: 'Grammar',
    grammarTopic: 'Changing Sentences / Transformation',
    topic: 'Item 6: Changing Sentences (Barishal Board)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 10,
    marksDistribution: '1 × 10 = 10',
    question: `Change the following sentences according to directions given in brackets:

(a) Corruption is the most destructive cancer of our society. (Positive)
(b) Nobody loves a corrupt official. (Interrogative)
(c) Though honesty is tough to maintain, it brings enduring peace of conscience. (Simple)
(d) We must root out this menace from our administrative systems. (Passive)
(e) Very few nations in Asia are as resilient as Bangladesh. (Superlative)
(f) The Padma Multipurpose Bridge was constructed by our own national revenue. (Active)
(g) Only hard work can usher in sustainable economic independence. (Negative)
(h) An industrious man leads an honorable life. (Complex)
(i) If we do not study regularly, we cannot achieve glowing GPA-5. (Compound)
(j) What a picturesque green country our motherland is! (Assertive)`,
    answer: `(a) No other cancer of our society is as destructive as corruption.
(b) Who loves a corrupt official? / Does anybody love a corrupt official?
(c) In spite of honesty being tough to maintain, it brings enduring peace of conscience.
(d) This menace must be rooted out from our administrative systems by us.
(e) Bangladesh is one of the most resilient nations in Asia.
(f) Our own national revenue constructed the Padma Multipurpose Bridge.
(g) Nothing but hard work can usher in sustainable economic independence.
(h) A man who is industrious leads an honorable life.
(i) Study regularly or we cannot achieve glowing GPA-5.
(j) Our motherland is a very picturesque green country.`,
    type: 'short',
    itemNumber: 6,
    part: 'Part A: Grammar'
  },
  {
    id: 'eng2-item-07',
    subject: 'ইংরেজি',
    chapter: 'Grammar',
    grammarTopic: 'Completing Sentences (Clauses & Conditionals)',
    topic: 'Item 7: Completing Sentences (Sylhet Board)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '1 × 5 = 5',
    question: `Complete the following sentences using suitable clauses or phrases:

(a) 1971 is the memorable year when ____________________________________.
(b) It is high time we ____________________________________.
(c) Walk fast lest ____________________________________.
(d) If you study hard with methodical perseverance, ____________________________________.
(e) Five years have elapsed since ____________________________________.`,
    answer: `(a) when Bangladesh achieved her long-cherished independence through supreme sacrifices.
(b) we eradicated illiteracy and social corruption from our society.
(c) you should miss the morning examination bus.
(d) you will surely secure glowing GPA 5 in the SSC examination.
(e) we first met each other in this academy.`,
    type: 'short',
    itemNumber: 7,
    part: 'Part A: Grammar'
  },

  // Page 3 Items
  {
    id: 'eng2-item-08',
    subject: 'ইংরেজি',
    chapter: 'Grammar',
    grammarTopic: 'Use of Suffix & Prefix',
    topic: 'Item 8: Suffix & Prefix (Dinajpur Board)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '0.5 × 10 = 5',
    question: `Complete the text by adding suffixes, prefixes or both with the root words underlined in brackets:

Money cannot buy true (a) _______ (happy). Happiness is purely a (b) _______ (psychology) feeling. A person with immense (c) _______ (wealthy) might be extremely (d) _______ (content) and miserable. On the other hand, an ordinary day-(e) _______ (labor) with a clear conscience may live in (f) _______ (peace) contentment. Those who are (g) _______ (greed) after material possessions never attain real (h) _______ (tranquil). Contentment is the ultimate (i) _______ (bless) of the Almighty. Therefore, we should be satisfied with our honest (j) _______ (earn).`,
    answer: `(a) happiness (b) psychological (c) wealth (d) discontented (e) laborer (f) peaceful (g) greedy (h) tranquility (i) blessing (j) earnings`,
    type: 'short',
    itemNumber: 8,
    part: 'Part A: Grammar'
  },
  {
    id: 'eng2-item-09',
    subject: 'ইংরেজি',
    chapter: 'Grammar',
    grammarTopic: 'Tag Questions',
    topic: 'Item 9: Tag Questions (Mymensingh Board)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '1 × 5 = 5',
    question: `Make tag questions for the following statements:

(a) Telling lies is a great sin, _______?
(b) Nobody respects a habitual liar, _______?
(c) Let us cultivate the noble habit of truthfulness, _______?
(d) A truthful person is honored everywhere, _______?
(e) Barking dogs seldom bite, _______?`,
    answer: `(a) isn't it?
(b) do they?
(c) shall we?
(d) isn't he?
(e) do they?`,
    type: 'short',
    itemNumber: 9,
    part: 'Part A: Grammar'
  },
  {
    id: 'eng2-item-10',
    subject: 'ইংরেজি',
    chapter: 'Grammar',
    grammarTopic: 'Sentence Connectors & Linking Words',
    topic: 'Item 10: Sentence Connectors (Dhaka Board)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '1 × 5 = 5',
    question: `Use appropriate sentence connectors in the blank spaces of the following passage:

Trees are vital gifts of Almighty nature. (a) _______, they provide us with essential oxygen without which we cannot survive for a minute. (b) _______, trees yield luscious fruits and valuable timbers. (c) _______, they protect the riverbanks from rampant erosion and shelter ecological wildlife. (d) _______, some ruthless individuals cut down trees indiscriminately for quick illicit profit. (e) _______, we must immediately plant trees on all barren lands to maintain ecological harmony.`,
    answer: `(a) First of all / Firstly
(b) Secondly / Besides
(c) In addition / Moreover
(d) But / However / Regrettably
(e) Therefore / Hence / So`,
    type: 'short',
    itemNumber: 10,
    part: 'Part A: Grammar'
  },
  {
    id: 'eng2-item-11',
    subject: 'ইংরেজি',
    chapter: 'Grammar',
    grammarTopic: 'Punctuation & Capitalization',
    topic: 'Item 11: Punctuation & Capitalization (Board Model)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '5 Marks',
    question: `Use capitals and punctuation marks where necessary in the following text:

give me a few grains of corns i am dying of hunger said the grasshopper why did you not store up food during the summer asked the ant i was singing day and night replied the grasshopper cheerily if you sang in summer you must dance in winter said the prudent ant`,
    answer: `"Give me a few grains of corns, I am dying of hunger," said the grasshopper. "Why did you not store up food during the summer?" asked the ant. "I was singing day and night," replied the grasshopper cheerily. "If you sang in summer, you must dance in winter," said the prudent ant.`,
    type: 'short',
    itemNumber: 11,
    part: 'Part A: Grammar'
  }
];

const sscEnglish2ndPaperCompositionQuestions: ShortQuestion[] = [
  // Page 4 Composition Items
  {
    id: 'eng2-item-12',
    subject: 'ইংরেজি',
    chapter: 'Writing',
    grammarTopic: 'Writing: Paragraph, CV & Application',
    topic: 'Item 12: Curriculum Vitae (CV) with Cover Letter',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 10,
    marksDistribution: '10 Marks',
    question: `Suppose, you are Sumon / Sumona and you have completed B.Sc (Honors) in Mathematics. Square Pharmaceuticals Ltd. published an advertisement in "The Daily Star" for the post of a "Junior Quality Assurance Officer". Now, write a complete CV with a formal cover letter applying for the post. Your CV should not exceed one page.`,
    answer: `Format of CV with Cover Letter:
1. Date, Designation, Company Address
2. Subject: Application for the post of Junior Quality Assurance Officer
3. Salutation & Body of Cover Letter referencing the advertisement
4. Enclosures list
5. Curriculum Vitae: Personal details, Educational Qualifications (Exam, Year, Board/Univ, GPA), Technical Skills, Experience, References.`,
    type: 'short',
    itemNumber: 12,
    part: 'Part B: Composition'
  },
  {
    id: 'eng2-item-13',
    subject: 'ইংরেজি',
    chapter: 'Writing',
    grammarTopic: 'Writing: Paragraph, CV & Application',
    topic: 'Item 13: Formal Application / Complaint Letter',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 10,
    marksDistribution: '10 Marks',
    question: `Write an official application to the Upazila Nirbahi Officer (UNO) on behalf of the inhabitants of your union requesting immediate repair of the damaged embankment and construction of a flood-shelter center in your locality.`,
    answer: `Official letter layout:
- Date
- The Upazila Nirbahi Officer
- Upazila, District
- Subject: Prayer for urgent repair of damaged embankment and construction of a flood shelter.
- Formal body highlighting seasonal monsoon floods, suffering of school children, damage to crops, and urgent prayer.`,
    type: 'short',
    itemNumber: 13,
    part: 'Part B: Composition'
  },
  {
    id: 'eng2-item-14',
    subject: 'ইংরেজি',
    chapter: 'Writing',
    grammarTopic: 'Writing: Paragraph, CV & Application',
    topic: 'Item 14: Paragraph Writing (Answering Questions)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 10,
    marksDistribution: '10 Marks',
    question: `Write a coherent paragraph of about 200 words on "Deforestation and Climate Change" answering the following prompt questions:
(a) What is deforestation?
(b) What are the principal causes behind ruthless tree felling in Bangladesh?
(c) How does deforestation aggravate the greenhouse effect and global warming?
(d) What catastrophic consequences are our coastal populations facing?
(e) What remedial measures should our government and society undertake without delay?`,
    answer: `Paragraph writing guidelines:
A clear topic sentence, logical development answering all prompt questions (causes, greenhouse effect, melting polar ice caps, sea-level rise in Bangladesh coastal belts), and decisive civic recommendations for mass social forestry and strict enforcement of forestry protection statutes.`,
    type: 'short',
    itemNumber: 14,
    part: 'Part B: Composition'
  },
  {
    id: 'eng2-item-15',
    subject: 'ইংরেজি',
    chapter: 'Writing',
    grammarTopic: 'Writing: Paragraph, CV & Application',
    topic: 'Item 15: Descriptive Composition / Essay',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 10,
    marksDistribution: '10 Marks',
    question: `Write a short composition on "The Wonders of Modern Science" or "Duties of an Ideal Student" in about 250 words. Your composition should include:
- Introduction
- Fields of contribution (Communication, Healthcare, Agriculture & Education)
- Potential abuses / ethical responsibilities
- Concluding remarks.`,
    answer: `Standard Composition Layout with distinct thematic subheadings or graceful paragraphs examining the triumphs of science and human perseverance.`,
    type: 'short',
    itemNumber: 15,
    part: 'Part B: Composition'
  }
];

// ============================================================================
// 3. 4-PAGE ENGLISH MODEL QUESTION BOOKLET (INTEGRATED 1ST & 2ND PAPER)
// ============================================================================
// Page 1: Seen Reading Comprehension (Passage + MCQ 1-7 + QA 2x5=10) [20 Marks]
// Page 2: Unseen Passage (Information Transfer + Summary + Cloze Test) [25 Marks]
// Page 3: Grammar Part (Items 1-6) [25 Marks]
// Page 4: Writing Part (CV/Letter + Paragraph + Dialogue / Story) [30 Marks]
// Total = 100 Marks
// ============================================================================

const english4PageSeenQuestions: ShortQuestion[] = [
  {
    id: 'eng4p-seen-01',
    subject: 'ইংরেজি',
    chapter: 'Reading Comprehension',
    grammarTopic: 'Reading Comprehension (Seen/Unseen)',
    topic: 'Seen Comprehension: 21st February & International Mother Language Day',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 17,
    marksDistribution: '7 + 10 = 17',
    question: `Read the following passage carefully and answer the questions that follow:

21 February is observed as Shaheed Dibosh every year throughout the country in remembrance of the martyrs of language movement of 1952. The commemoration begins at the early hours of the day with mournful songs that recall the supreme sacrifice of our language martyrs. People wear black badges and go to the Central Shaheed Minar in bare-footed procession, singing the mournful song "Amar bhaier rokte rangano Ekushey February". They place wreaths at the Minar to pay homage to the martyrs. 

21 February is also declared as International Mother Language Day by UNESCO in November 1999 to promote linguistic diversity and multilingual education across the globe. The seed of the independence movement of Bangladesh was sown on this historic day.

1. Choose the correct answer from the following alternatives (1 × 7 = 7):
(a) The word 'commemoration' stands for— (i) celebration (ii) remembrance (iii) negligence (iv) indifference
(b) People walk towards the Shaheed Minar— (i) wearing shoes (ii) on vehicles (iii) bare-footed (iv) silently
(c) UNESCO recognized 21 February in— (i) 1952 (ii) 1971 (iii) 1999 (iv) 2000
(d) What is the main objective of observing International Mother Language Day?
(i) To promote trade (ii) To promote linguistic diversity (iii) To honor heroes (iv) To encourage travel
(e) The seed of our liberation war was sown in— (i) 1947 (ii) 1952 (iii) 1969 (iv) 1971
(f) The procession begins— (i) at noon (ii) at dusk (iii) at early hours of the day (iv) at midnight
(g) Black badges symbolize— (i) victory (ii) mourning and tribute (iii) anger (iv) protest

2. Answer the following questions in your own words (2 × 5 = 10):
(a) Why do we observe 21 February as Shaheed Dibosh?
(b) How do people pay tribute to the language martyrs at the Central Shaheed Minar?
(c) What does the proclamation of UNESCO signify for our nation?
(d) Why is the language movement of 1952 considered the prelude to our independence?
(e) What is the core significance of multilingual education today?`,
    answer: `1. Answers: (a)-(ii), (b)-(iii), (c)-(iii), (d)-(ii), (e)-(ii), (f)-(iii), (g)-(ii).
2. Answers:
(a) We observe 21 February to recall the supreme sacrifice of our heroic martyrs who laid down their lives for the dignity of Bangla language in 1952.
(b) People walk bare-footed in mourning processions singing sorrowful melodies and placing floral wreaths at the Central Shaheed Minar.
(c) It signifies global recognition of our heroic language struggle and underlines the necessity to preserve all indigenous mother languages.
(d) Because the linguistic solidarity instilled the unshakeable determination for self-determination and sovereign nationhood.
(e) It fosters intercultural tolerance, preserves ancient linguistic heritage, and empowers marginalized communities.`,
    type: 'short',
    itemNumber: 1,
    part: 'Part 1: Reading'
  }
];

const english4PageUnseenQuestions: ShortQuestion[] = [
  {
    id: 'eng4p-unseen-02',
    subject: 'ইংরেজি',
    chapter: 'Reading Comprehension',
    grammarTopic: 'Reading Comprehension (Seen/Unseen)',
    topic: 'Unseen Passage: Begum Rokeya & Female Emancipation',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 20,
    marksDistribution: '5 + 10 + 5 = 20',
    question: `Read the following text and answer the questions below:

Begum Rokeya (1880-1932) was a pioneering Bengali writer, educationist, and social reformer. She is widely regarded as the pioneer of women's liberation in the Bengal renaissance. Born in a conservative Muslim family in Pairabandh, Rangpur, she was denied formal schooling due to prevailing colonial social prejudices. However, with the liberal support of her elder brother Ibrahim Saber and later her husband Khan Bahadur Sakhawat Hussain, she mastered Bengali and English literature. 

After her husband's premature demise in 1909, she established the "Sakhawat Memorial Girls' School" in Bhagalpur with only five students, later moving it to Kolkata. She also founded the "Anjuman-e-Khawateen-e-Islam" (Muslim Women's Association) to provide vocational education and shelter to distressed destitute women. Through her satirical masterworks like "Sultana's Dream" and "Padmarag", she boldly advocated that society cannot prosper while keeping half of its population locked in ignorance.

3. Complete the following information transfer table (1 × 5 = 5):
| Who / What | Event / Activity | Year / Place |
| --- | --- | --- |
| Begum Rokeya | Born | (i) ___________________ |
| Sakhawat Memorial School | Founded originally | (ii) ___________________ |
| The school | Shifted to Kolkata | (iii) ___________________ |
| Anjuman-e-Khawateen | Founded to support | (iv) ___________________ |
| Begum Rokeya | Passed away | (v) ___________________ |

4. Write a summary of the passage in your own words focusing on Rokeya's social reforms (10 Marks).

5. Match the phrases from Column A and Column B to make complete sentences (1 × 5 = 5):
(a) Begum Rokeya believed that -> half of humanity cannot be neglected.
(b) Female education is -> the cornerstone of social emancipation.
(c) Sultana's Dream is -> a classic feminist utopian novella.
(d) Her brother helped her -> to master Bengali and English literature.
(e) We must honor her memory -> by guaranteeing equal rights for all women.`,
    answer: `3. Information transfer: (i) 1880, Pairabandh, Rangpur (ii) 1909, Bhagalpur (iii) 1911 (iv) distressed and destitute women (v) 1932.
4. Summary: Begum Rokeya was a legendary pioneer of women's rights in South Asia. Despite severe societal restrictions, she acquired vast learning and dedicated her life to girl's education. She founded Sakhawat Memorial School and an association for destitute women. Her visionary writings championed gender equality and progressive education.`,
    type: 'short',
    itemNumber: 2,
    part: 'Part 1: Reading'
  }
];

// ============================================================================
// EXPORT PRESET FACTORY FUNCTIONS
// ============================================================================

export interface PresetBookletData {
  config: {
    academyName: string;
    examTitle: string;
    subject: string;
    subjectCode: string;
    className: string;
    section: string;
    totalMarks: string;
    duration: string;
    pattern: string;
    instructions: string;
    isCreated: boolean;
  };
  sectionKQuestions: QuestionItem[];
  sectionKhQuestions: QuestionItem[];
  sectionGQuestions: QuestionItem[];
  paperTitle: string;
}

export function getSSCMath100MarksPreset(institutionName: string): PresetBookletData {
  return {
    config: {
      academyName: institutionName || 'কলাবাড়িয়া মডেল একাডেমি ও কোচিং সেন্টার',
      examTitle: 'এসএসসি মডেল টেস্ট মূল্যায়ন পরীক্ষা - ২০২৬ (পূর্ণাঙ্গ ১০০ নম্বর)',
      subject: 'সাধারণ গণিত',
      subjectCode: '১০৯',
      className: '১০ম শ্রেণি (SSC পরীক্ষার্থী)',
      section: 'সকল শাখা (বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা)',
      totalMarks: '১০০',
      duration: '৩ ঘণ্টা (সৃজনশীল ২ ঘণ্টা ৩০ মি. + বহুনির্বাচনী ৩০ মি.)',
      pattern: 'k_kh_g',
      instructions: 'বিশেষ দ্রষ্টব্য: ডান পাশের সংখ্যা প্রশ্নের পূর্ণমান জ্ঞাপক। ক বিভাগের সকল (৩০টি) বহুনির্বাচনী প্রশ্নের উত্তর দাও (মান ৩০)। গ বিভাগের সৃজনশীল প্রশ্নাবলীতে প্রতিটি বিভাগ থেকে কমপক্ষে একটি করে মোট ৭টি প্রশ্নের উত্তর দাও (মান ৭০)।',
      isCreated: true
    },
    sectionKQuestions: sscMathMCQs,
    sectionKhQuestions: [],
    sectionGQuestions: sscMathCQs,
    paperTitle: '১০ম শ্রেণি সাধারণ গণিত - এসএসসি পূর্ণাঙ্গ ১০০ নম্বরের মডেল টেস্ট বুকলেট'
  };
}

export function getSSCEnglish2ndPaperPreset(institutionName: string): PresetBookletData {
  return {
    config: {
      academyName: institutionName || 'SCIENCE STUDIO & MODEL ACADEMY',
      examTitle: 'SSC MODEL TEST EXAMINATION 2026 (FULL 100 MARKS)',
      subject: 'ইংরেজি',
      subjectCode: '108',
      className: 'Class 10 (SSC Examinees)',
      section: 'All Groups (Science, Arts & Commerce)',
      totalMarks: '100',
      duration: '3 Hours',
      pattern: 'english_board_standard',
      instructions: 'Figures in the right margin indicate full marks. Answer all questions from Part A (Grammar) and Part B (Composition) as directed.',
      isCreated: true
    },
    // For English 2nd paper: Part A Grammar items in Section K & Kh, Part B Composition in Section G
    sectionKQuestions: sscEnglish2ndPaperGrammarQuestions.slice(0, 6),
    sectionKhQuestions: sscEnglish2ndPaperGrammarQuestions.slice(6),
    sectionGQuestions: sscEnglish2ndPaperCompositionQuestions,
    paperTitle: 'Class 10 English 2nd Paper - SSC Board Standard 100 Marks Model Booklet'
  };
}

export function getEnglish4PageBookletPreset(institutionName: string): PresetBookletData {
  return {
    config: {
      academyName: institutionName || 'SCIENCE STUDIO & MODEL ACADEMY',
      examTitle: 'SSC COMPREHENSIVE 4-PAGE ENGLISH MODEL TEST (100 MARKS)',
      subject: 'ইংরেজি',
      subjectCode: '107 & 108',
      className: 'Class 10 (SSC Batch 2026)',
      section: 'All Sections',
      totalMarks: '100',
      duration: '3 Hours',
      pattern: 'english_1st_paper',
      instructions: 'Answer all the questions. Write your answers neatly on the answer script. Figures in the right margin indicate full marks.',
      isCreated: true
    },
    // Page 1 Seen, Page 2 Unseen, Page 3 Grammar, Page 4 Writing
    sectionKQuestions: english4PageSeenQuestions,
    sectionKhQuestions: [
      ...english4PageUnseenQuestions,
      ...sscEnglish2ndPaperGrammarQuestions.slice(3, 7)
    ],
    sectionGQuestions: sscEnglish2ndPaperCompositionQuestions.slice(0, 3),
    paperTitle: 'SSC 4-Page English Model Question Booklet (Reading, Grammar & Writing)'
  };
}
