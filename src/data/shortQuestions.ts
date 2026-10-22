import { ShortQuestion } from '../types';

export const allShortQuestions: ShortQuestion[] = [
  // ==================== ইংরেজি (English) ====================
  {
    id: 'sq-eng-01',
    subject: 'ইংরেজি',
    chapter: 'Parts of Speech & Identification',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'Define an Abstract Noun with two examples.',
    answer: 'An abstract noun is a word that names a quality, concept, feeling, or state that cannot be touched or seen. Examples: Honesty, Freedom, Kindness.',
    marks: 2,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-eng-02',
    subject: 'ইংরেজি',
    chapter: 'Tense & Right Form of Verbs',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'State the rule for using verbs after "as if" or "as though".',
    answer: 'If the first clause is in present tense, the following clause takes past subjunctive (were / V2). Example: He talks as if he knew everything.',
    marks: 2,
    type: 'short',
    boardInfo: 'রাজশাহী বোর্ড ২০২৩',
    importance: 'very_high'
  },
  {
    id: 'sq-eng-03',
    subject: 'ইংরেজি',
    chapter: 'Preposition & Appropriate Usage',
    targetClass: '৮ম শ্রেণি',
    question: 'Differentiate between the usage of "between" and "among".',
    answer: '"Between" is used when referring to two persons or things. "Among" is used when referring to more than two persons or things.',
    marks: 2,
    type: 'short',
    boardInfo: 'চট্টগ্রাম বোর্ড ২০২৪',
    importance: 'high'
  },
  {
    id: 'sq-eng-04',
    subject: 'ইংরেজি',
    chapter: 'Voice Change (Active & Passive)',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'What is a quasi-passive verb? Give an example.',
    answer: 'A quasi-passive verb is active in form but passive in sense. Example: "Honey tastes sweet" (Passive: Honey is sweet when it is tasted).',
    marks: 2,
    type: 'short',
    boardInfo: 'যশোর বোর্ড ২০২৩',
    importance: 'very_high'
  },
  {
    id: 'sq-eng-05',
    subject: 'ইংরেজি',
    chapter: 'Tag Questions & Suffix-Prefix',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'What question tag is used for sentences beginning with "Nobody", "None", or "Neither"?',
    answer: 'Pronoun "they" is used for nobody/none/neither with an affirmative auxiliary verb because the words are negative. Example: Nobody called, did they?',
    marks: 2,
    type: 'short',
    boardInfo: 'কুমিল্লা বোর্ড ২০২৪',
    importance: 'high'
  },
  {
    id: 'sq-eng-06',
    subject: 'ইংরেজি',
    chapter: 'Articles & Determiners',
    targetClass: '৬ষ্ঠ শ্রেণি',
    question: 'When do we use "an" instead of "a"? Give two examples.',
    answer: 'We use "an" before words starting with a vowel sound (not necessarily vowel letter). Examples: an umbrella, an honest man.',
    marks: 2,
    type: 'short',
    boardInfo: 'দিনাজপুর বোর্ড ২০২৩',
    importance: 'standard'
  },
  {
    id: 'sq-eng-07',
    subject: 'ইংরেজি',
    chapter: 'Punctuation & Capitalization',
    targetClass: '৭ম শ্রেণি',
    question: 'Name four essential situations where capital letters must be used.',
    answer: '1. First word of every sentence. 2. Proper nouns and adjectives derived from them. 3. The pronoun "I". 4. Names of days and months.',
    marks: 2,
    type: 'short',
    boardInfo: 'বরিশাল বোর্ড ২০২৪',
    importance: 'high'
  },

  // ==================== সাধারণ গণিত (General Mathematics) ====================
  {
    id: 'sq-math-01',
    subject: 'সাধারণ গণিত',
    chapter: 'বাস্তব সংখ্যা',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'মূলদ সংখ্যা ও অমূলদ সংখ্যার প্রধান পার্থক্য কী?',
    answer: 'যে সংখ্যাকে দুটি পূর্ণসংখ্যার ভগ্নাংশ p/q আকারে প্রকাশ করা যায় (যেখানে q ≠ 0) তাকে মূলদ সংখ্যা বলে। যাকে p/q আকারে প্রকাশ করা যায় না তাকে অমূলদ সংখ্যা বলে (যেমন √2, √3)।',
    marks: 2,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-math-02',
    subject: 'সাধারণ গণিত',
    chapter: 'সেট ও ফাংশন',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'শক্তি সেট (Power Set) বলতে কী বোঝায়? কোনো সেটের উপাদান সংখ্যা n হলে উপসেট সংখ্যা কত?',
    answer: 'কোনো সেটের সকল উপসেট নিয়ে গঠিত সেটকে ঐ সেটের শক্তি সেট বলে। উপাদান সংখ্যা n হলে উপসেট সংখ্যা 2^n এবং প্রকৃত উপসেট সংখ্যা (2^n - 1)।',
    marks: 2,
    type: 'short',
    boardInfo: 'রাজশাহী বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-math-03',
    subject: 'সাধারণ গণিত',
    chapter: 'বীজগাণিতিক রাশি',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'যদি a + b = 5 এবং ab = 6 হয়, তবে a³ + b³ এর মান কত?',
    answer: 'a³ + b³ = (a + b)³ - 3ab(a + b) = 5³ - 3(6)(5) = 125 - 90 = 35।',
    marks: 2,
    type: 'short',
    boardInfo: 'যশোর বোর্ড ২০২৩',
    importance: 'very_high'
  },
  {
    id: 'sq-math-04',
    subject: 'সাধারণ গণিত',
    chapter: 'সূচক ও লগারিদম',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'লগারিদমের ভিত্তি কেন 1 হতে পারে না এবং ঋণাত্মক হতে পারে না?',
    answer: 'লগের ভিত্তির ক্ষেত্রে a > 0 এবং a ≠ 1। কারণ 1 এর যেকোনো ঘাত সর্বদাই 1 এবং ঋণাত্মক সংখ্যার বাস্তব লগারিদম সংজ্ঞায়িত নয়।',
    marks: 2,
    type: 'short',
    boardInfo: 'চট্টগ্রাম বোর্ড ২০২৪',
    importance: 'high'
  },
  {
    id: 'sq-math-05',
    subject: 'সাধারণ গণিত',
    chapter: 'ত্রিকোণমিতিক অনুপাত',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'প্রমাণ করো যে: sin²θ + cos²θ = 1।',
    answer: 'সমকোণী ত্রিভুজে পিথাগোরাসের সূত্রানুসারে: লম্ব² + ভূমি² = অতিভুজ²। অতিভুজ² দ্বারা ভাগ করলে (লম্ব/অতিভুজ)² + (ভূমি/অতিভুজ)² = 1, অর্থাৎ sin²θ + cos²θ = 1।',
    marks: 2,
    type: 'short',
    boardInfo: 'দিনাজপুর বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-math-06',
    subject: 'সাধারণ গণিত',
    chapter: 'প্যাটার্ন ও মুনাফা (৮ম)',
    targetClass: '৮ম শ্রেণি',
    question: 'চক্রবৃদ্ধি মূলধন (C) এবং চক্রবৃদ্ধি মুনাফার সূত্র দুটি লেখো।',
    answer: 'চক্রবৃদ্ধি মূলধন C = P(1 + r)^n এবং চক্রবৃদ্ধি মুনাফা = C - P = P[(1 + r)^n - 1] (যেখানে P = মূলধন, r = মুনাফার হার, n = সময়)।',
    marks: 2,
    type: 'short',
    boardInfo: 'কুমিল্লা বোর্ড ২০২৩',
    importance: 'very_high'
  },
  {
    id: 'sq-math-07',
    subject: 'সাধারণ গণিত',
    chapter: 'অনুপাত ও শতকরা (৬ষ্ঠ-৮ম)',
    targetClass: '৭ম শ্রেণি',
    question: 'ধারাবাহিক অনুপাত কাকে বলে? উদাহরণ দাও।',
    answer: 'দুটি অনুপাত a:b এবং b:c হলে তাদেরকে সংযুক্ত করে a:b:c আকারে প্রকাশ করাকে ধারাবাহিক অনুপাত বলে। যেমন 2:3 এবং 3:5 হলে ধারাবাহিক অনুপাত 2:3:5।',
    marks: 2,
    type: 'short',
    boardInfo: 'বরিশাল বোর্ড ২০২৪',
    importance: 'high'
  },
  {
    id: 'sq-math-08',
    subject: 'সাধারণ গণিত',
    chapter: 'স্বাভাবিক সংখ্যা ও ভগ্নাংশ (৬ষ্ঠ-৮ম)',
    targetClass: '৬ষ্ঠ শ্রেণি',
    question: 'সহমৌলিক সংখ্যা (Co-prime Numbers) কাকে বলে? একটি উদাহরণ দাও।',
    answer: 'যদি দুই বা ততোধিক সংখ্যার গ.সা.গু 1 হয় (অর্থাৎ 1 ছাড়া অন্য কোনো সাধারণ উৎপাদক না থাকে), তবে সংখ্যাগুলোকে পরস্পর সহমৌলিক বলে। যেমন: 8 ও 9 সহমৌলিক।',
    marks: 2,
    type: 'short',
    boardInfo: 'ময়মনসিংহ বোর্ড ২০২৩',
    importance: 'standard'
  },

  // ==================== বাংলাদেশ ও বিশ্ব পরিচয় (BGS) ====================
  {
    id: 'sq-bgs-01',
    subject: 'বাংলাদেশ ও বিশ্ব পরিচয়',
    chapter: 'পূর্ব বাংলার আন্দোলন ও জাতীয়তাবাদের উত্থান (১৯৪৭-১৯৭০)',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: '১৯৫২ সালের ভাষা আন্দোলনের আন্তর্জাতিক তাৎপর্য কী?',
    answer: '১৯৫২ সালের ২১শে ফেব্রুয়ারির আত্মত্যাগের স্বীকৃতিস্বরূপ ১৯৯৯ সালে ইউনেস্কো দিনটিকে "আন্তর্জাতিক মাতৃভাষা দিবস" হিসেবে ঘোষণা করে, যা বাঙালি জাতীয়তাবাদের বিশ্বস্বীকৃতি।',
    marks: 2,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-bgs-02',
    subject: 'বাংলাদেশ ও বিশ্ব পরিচয়',
    chapter: 'স্বাধীন বাংলাদেশ ও মুক্তিযুদ্ধ (১৯৭১)',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'অস্থায়ী মুজিবনগর সরকার কবে গঠিত এবং কবে শপথ গ্রহণ করে?',
    answer: '১৯৭১ সালের ১০ই এপ্রিল মুজিবনগর সরকার গঠিত হয় এবং ১৭ই এপ্রিল মেহেরপুরের বৈদ্যনাথতলার (বর্তমান মুজিবনগর) আম্রকাননে আনুষ্ঠানিকভাবে শপথ গ্রহণ করে।',
    marks: 2,
    type: 'short',
    boardInfo: 'রাজশাহী বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-bgs-03',
    subject: 'বাংলাদেশ ও বিশ্ব পরিচয়',
    chapter: 'বাংলাদেশের ভূপ্রকৃতি ও জলবায়ু',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'প্লাইস্টোসিন কালের সোপানসমূহ বলতে কী বোঝায়? এর অঞ্চলগুলো কী কী?',
    answer: 'প্রায় ২৫,০০০ বছর পূর্বের বরফ যুগের বরফ গলে সৃষ্ট প্লাবন ভূমিকে প্লাইস্টোসিন সোপান বলে। এর মধ্যে রয়েছে: বরেন্দ্রভূমি, মধুপুর ও ভাওয়ালের গড় এবং লালমাই পাহাড়।',
    marks: 2,
    type: 'short',
    boardInfo: 'যশোর বোর্ড ২০২৩',
    importance: 'very_high'
  },
  {
    id: 'sq-bgs-04',
    subject: 'বাংলাদেশ ও বিশ্ব পরিচয়',
    chapter: 'রাষ্ট্র, নাগরিকতা ও আইন',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'আইনের প্রধান তিনটি উৎস উল্লেখ করো।',
    answer: '১. প্রথা ও রীতিনীতি। ২. আইনসভা বা সংসদ কর্তৃক প্রণীত আইন। ৩. বিচার বিভাগীয় সিদ্ধান্ত বা নজির।',
    marks: 2,
    type: 'short',
    boardInfo: 'চট্টগ্রাম বোর্ড ২০২৪',
    importance: 'high'
  },
  {
    id: 'sq-bgs-05',
    subject: 'বাংলাদেশ ও বিশ্ব পরিচয়',
    chapter: 'বাংলাদেশের পরিবার কাঠামো ও সামাজিকীকরণ',
    targetClass: '৮ম শ্রেণি',
    question: 'পিতৃতান্ত্রিক ও মাতৃতান্ত্রিক পরিবারের মূল পার্থক্য কী?',
    answer: 'পিতৃতান্ত্রিক পরিবারে পিতা বা পুরুষ পরিবারের প্রধান এবং সন্তানরা পিতার বংশমর্যাদা লাভ করে (বাঙাল সমাজে)। মাতৃতান্ত্রিক পরিবারে মা প্রধান (যেমন গারো ও খাসিয়া উপজাতিদের মধ্যে)।',
    marks: 2,
    type: 'short',
    boardInfo: 'কুমিল্লা বোর্ড ২০২৩',
    importance: 'high'
  },
  {
    id: 'sq-bgs-06',
    subject: 'বাংলাদেশ ও বিশ্ব পরিচয়',
    chapter: 'বাংলাদেশের সামাজিক সমস্যা ও এর প্রতিকার',
    targetClass: '৮ম শ্রেণি',
    question: 'কিশোর অপরাধ প্রতিরোধে পরিবারের দুটি করণীয় লেখো।',
    answer: '১. সন্তানদের পর্যাপ্ত স্নেহ, সময় ও সৌহার্দ্যপূর্ণ পারিবারিক পরিবেশ নিশ্চিত করা। ২. অসৎ সঙ্গ পরিহার এবং ইন্টারনেটের ইতিবাচক ব্যবহারের ওপর নজরদারি রাখা।',
    marks: 2,
    type: 'short',
    boardInfo: 'দিনাজপুর বোর্ড ২০২৪',
    importance: 'very_high'
  },

  // ==================== বিজ্ঞান (General Science for Class 6-8) ====================
  {
    id: 'sq-sci-01',
    subject: 'বিজ্ঞান',
    chapter: 'প্রাণিজজগতের শ্রেণিবিন্যাস (৮ম)',
    targetClass: '৮ম শ্রেণি',
    question: 'আর্থ্রোপোডা (Arthropoda) পর্বের প্রাণীদের দুটি শনাক্তকারী বৈশিষ্ট্য লেখো।',
    answer: '১. দেহ বিভিন্ন অঞ্চলে বিভক্ত ও সন্ধিযুক্ত উপাঙ্গ বিদ্যমান। ২. মাথায় একজোড়া পুঞ্জাক্ষি ও অ্যান্টেনা থাকে এবং কাইটিনযুক্ত বহিঃকঙ্কালে আবৃত (যেমন: প্রজাপতি, চিংড়ি)।',
    marks: 2,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-sci-02',
    subject: 'বিজ্ঞান',
    chapter: 'মহাকর্ষ ও অভিকর্ষ (৮ম)',
    targetClass: '৮ম শ্রেণি',
    question: 'অভিকর্ষজ ত্বরণ (g) কেন বস্তুর ভরের ওপর নির্ভর করে না?',
    answer: 'সূত্রানুসারে g = GM/R² (এখানে M = পৃথিবীর ভর, R = পৃথিবীর ব্যাসার্ধ)। সমীকরণে নিক্ষিপ্ত বা পতনশীল বস্তুর ভর (m) অনুপস্থিত, তাই মুক্তভাবে পড়ন্ত সকল বস্তুর ক্ষেত্রে g সমান।',
    marks: 2,
    type: 'short',
    boardInfo: 'রাজশাহী বোর্ড ২০২৩',
    importance: 'very_high'
  },
  {
    id: 'sq-sci-03',
    subject: 'বিজ্ঞান',
    chapter: 'পদার্থের গঠন ও রাসায়নিক বিক্রিয়া (৮ম)',
    targetClass: '৮ম শ্রেণি',
    question: 'যোজনী (Valency) কাকে বলে? অক্সিজেনের যোজনী কত?',
    answer: 'কোনো মৌলের একটি পরমাণু অন্য কোনো মৌলের পরমাণুর সাথে যুক্ত হওয়ার সামর্থ্য বা ক্ষমতাকে তার যোজনী বলে। অক্সিজেনের যোজনী ২।',
    marks: 2,
    type: 'short',
    boardInfo: 'চট্টগ্রাম বোর্ড ২০২৪',
    importance: 'high'
  },
  {
    id: 'sq-sci-04',
    subject: 'বিজ্ঞান',
    chapter: 'উদ্ভিদ ও প্রাণীর কোষীয় সংগঠন (৬ষ্ঠ-৭ম)',
    targetClass: '৭ম শ্রেণি',
    question: 'মাইটোকন্ড্রিয়াকে কেন কোষের শক্তিঘর (Powerhouse) বলা হয়?',
    answer: 'শ্বসন প্রক্রিয়ার মাধ্যমে কোষে প্রয়োজনীয় জৈব শক্তি (ATP) উৎপাদনের সিংহভাগ বিক্রিয়া মাইটোকন্ড্রিয়াতেই সম্পন্ন হয়, তাই একে শক্তিঘর বলা হয়।',
    marks: 2,
    type: 'short',
    boardInfo: 'যশোর বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-sci-05',
    subject: 'বিজ্ঞান',
    chapter: 'বৈজ্ঞানিক প্রক্রিয়া ও পরিমাপ (৬ষ্ঠ)',
    targetClass: '৬ষ্ঠ শ্রেণি',
    question: 'মৌলিক একক কাকে বলে? এসআই পদ্ধতিতে ভরের একক কী?',
    answer: 'যেসব একক স্বাধীন ও নিরপেক্ষ এবং অন্য কোনো এককের ওপর নির্ভর করে না, তাদেরকে মৌলিক একক বলে। আন্তর্জাতিক পদ্ধতিতে ভরের একক কিলোগ্রাম (kg)।',
    marks: 2,
    type: 'short',
    boardInfo: 'দিনাজপুর বোর্ড ২০২৩',
    importance: 'standard'
  },

  // ==================== পদার্থবিজ্ঞান (Physics - Class 9-10) ====================
  {
    id: 'sq-phy-01',
    subject: 'পদার্থবিজ্ঞান',
    chapter: 'ভৌত রাশি ও পরিমাপ',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'মৌলিক রাশি ও লব্ধ রাশির মধ্যে মূল পার্থক্য কী?',
    answer: 'যেসব রাশি স্বাধীন বা নিরপেক্ষ, সেগুলোকে মৌলিক রাশি বলে (যেমন: দৈর্ঘ্য, ভর, সময়)। আর যেসব রাশি মৌলিক রাশির ওপর নির্ভর করে, সেগুলোকে লব্ধ রাশি বলে (যেমন: বেগ, বল)।',
    marks: 2,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-phy-02',
    subject: 'পদার্থবিজ্ঞান',
    chapter: 'ভৌত রাশি ও পরিমাপ',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'ভার্নিয়ার ধ্রুবক (Vernier Constant) বলতে কী বোঝায়?',
    answer: 'প্রধান স্কেলের ক্ষুদ্রতম এক ভাগের চেয়ে ভার্নিয়ার স্কেলের এক ভাগ যতটুকু ছোট, তাকে ভার্নিয়ার ধ্রুবক বলে। VC = s / n।',
    marks: 2,
    type: 'short',
    boardInfo: 'রাজশাহী বোর্ড ২০২৩',
    importance: 'high'
  },
  {
    id: 'sq-phy-03',
    subject: 'পদার্থবিজ্ঞান',
    chapter: 'গতি',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'সুষম ত্বরণ এবং অসম ত্বরণের সংজ্ঞা দাও।',
    answer: 'সময়ের সাথে কোনো বস্তুর বেগ বৃদ্ধির হার সমান থাকলে তাকে সুষম ত্বরণ বলে। বেগ বৃদ্ধির হার প্রতিনিয়ত পরিবর্তিত হলে তাকে অসম ত্বরণ বলে।',
    marks: 2,
    type: 'short',
    boardInfo: 'চট্টগ্রাম বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-phy-04',
    subject: 'পদার্থবিজ্ঞান',
    chapter: 'বল',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'নিউটনের গতির দ্বিতীয় সূত্রটি বিবৃত করো এবং গাণিতিক রূপ দাও।',
    answer: 'বস্তুর ভরবেগের পরিবর্তনের হার তার ওপর প্রযুক্ত বলের সমানুপাতিক এবং বল যেদিকে ক্রিয়া করে বস্তুর ভরবেগের পরিবর্তনও সেদিকে ঘটে। গাণিতিক রূপ: F = ma।',
    marks: 2,
    type: 'short',
    boardInfo: 'যশোর বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-phy-05',
    subject: 'পদার্থবিজ্ঞান',
    chapter: 'কাজ, ক্ষমতা ও শক্তি',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'কাজের বৈজ্ঞানিক সংজ্ঞা এবং ১ জুল কাজ বলতে কী বোঝায়?',
    answer: 'কোনো বস্তুর ওপর বল প্রয়োগে যদি বলের দিকে বস্তুর সরণ ঘটে, তবে প্রযুক্ত বল ও সরণের গুণফলকে কাজ বলে। ১ নিউটন বল প্রয়োগে বলের দিকে ১ মিটার সরণ হলে তাকে ১ জুল কাজ বলে।',
    marks: 2,
    type: 'short',
    boardInfo: 'বরিশাল বোর্ড ২০২৩',
    importance: 'very_high'
  },

  // ==================== রসায়ন (Chemistry - Class 9-10) ====================
  {
    id: 'sq-chem-01',
    subject: 'রসায়ন',
    chapter: 'পদার্থের অবস্থা',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'ব্যাপন ও নিঃসরণের মধ্যে মূল পার্থক্য কী?',
    answer: 'উচ্চ ঘনমাত্রার স্থান থেকে নিম্ন ঘনমাত্রার স্থানে স্বতঃস্ফূর্ত ও সমানভাবে ছড়িয়ে পড়ার প্রক্রিয়া হলো ব্যাপন। আর সরু ছিদ্রপথে উচ্চচাপ থেকে নিম্নচাপে কোনো গ্যাসের সজোরে বের হওয়া হলো নিঃসরণ।',
    marks: 2,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-chem-02',
    subject: 'রসায়ন',
    chapter: 'পদার্থের গঠন',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'আইসোটোপ কাকে বলে? হাইড্রোজেনের তিনটি প্রধান আইসোটোপের নাম লেখো।',
    answer: 'যেসব পরমাণুর প্রোটন সংখ্যা সমান কিন্তু ভর সংখ্যা ভিন্ন, তাদেরকে পরস্পরের আইসোটোপ বলে। হাইড্রোজেনের তিনটি আইসোটোপ: প্রোটিয়াম (¹H), ডিউটেরিয়াম (²H), ট্রিটিয়াম (³H)।',
    marks: 2,
    type: 'short',
    boardInfo: 'রাজশাহী বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-chem-03',
    subject: 'রসায়ন',
    chapter: 'পর্যায় সারণি',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'মেন্ডেলিফের আধুনিক পর্যায় সূত্রটি বিবৃত করো।',
    answer: 'মৌলসমূহের ভৌত ও রাসায়নিক ধর্মাবলি তাদের পারমাণবিক সংখ্যা বৃদ্ধির সাথে পর্যায়ক্রমে আবর্তিত হয়।',
    marks: 2,
    type: 'short',
    boardInfo: 'যশোর বোর্ড ২০২৩',
    importance: 'very_high'
  },
  {
    id: 'sq-chem-04',
    subject: 'রসায়ন',
    chapter: 'মোলের ধারণা ও রাসায়নিক গণনা',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'অ্যাভোগাড্রো সংখ্যা কী এবং এর মান কত?',
    answer: 'কোনো পদার্থের ১ মোলে নির্দিষ্ট সংখ্যক অণু, পরমাণু বা আয়ন থাকে। এই ধ্রুব সংখ্যাটিকে অ্যাভোগাড্রো সংখ্যা বলে, যার মান ৬.০২ × ১০²³।',
    marks: 2,
    type: 'short',
    boardInfo: 'কুমিল্লা বোর্ড ২০২৪',
    importance: 'very_high'
  },

  // ==================== জীববিজ্ঞান (Biology - Class 9-10) ====================
  {
    id: 'sq-bio-01',
    subject: 'জীববিজ্ঞান',
    chapter: 'জীবকোষ ও টিস্যু',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'প্রোক্যারিওটিক (আদিকোষ) ও ইউক্যারিওটিক (প্রকৃতকোষ) কোষের প্রধান পার্থক্য কী?',
    answer: 'আদিকোষে সুগঠিত নিউক্লিয়াস ও আবরণীযুক্ত অঙ্গাণু থাকে না (যেমন ব্যাকটেরিয়া)। প্রকৃতকোষে সুগঠিত নিউক্লিয়ার মেমব্রেন ও অঙ্গাণু বিদ্যমান (যেমন উদ্ভিদ ও প্রাণীকোষ)।',
    marks: 2,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-bio-02',
    subject: 'জীববিজ্ঞান',
    chapter: 'কোষ বিভাজন',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'মিয়োসিসকে হ্রাসমূলক বিভাজন বলা হয় কেন?',
    answer: 'মিয়োসিস বিভাজনে নিউক্লিয়াস দুইবার বিভাজিত হলেও ক্রোমোজোম মাত্র একবার বিভাজিত হয়, ফলে অপত্য কোষের ক্রোমোজোম সংখ্যা মাতৃকোষের অর্ধেক হয়ে যায়।',
    marks: 2,
    type: 'short',
    boardInfo: 'রাজশাহী বোর্ড ২০২৩',
    importance: 'very_high'
  },
  {
    id: 'sq-bio-03',
    subject: 'জীববিজ্ঞান',
    chapter: 'জীবনীশক্তি (সালোকসংশ্লেষণ ও শ্বসন)',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'ATP কে জৈব মুদ্রা বা শক্তি মুদ্রা (Biological Currency) কেন বলা হয়?',
    answer: 'কোষের সকল বিপাকীয় কাজের শক্তি ATP এর ফসফেট বন্ধনীতে সঞ্চিত থাকে এবং প্রয়োজন অনুযায়ী এটি ভেঙে শক্তি সরবরাহ করে, তাই একে জৈব মুদ্রা বলে।',
    marks: 2,
    type: 'short',
    boardInfo: 'দিনাজপুর বোর্ড ২০২৪',
    importance: 'very_high'
  },

  // ==================== উচ্চতর গণিত (Higher Math) ====================
  {
    id: 'sq-hm-01',
    subject: 'উচ্চতর গণিত',
    chapter: 'সেট ও ফাংশন',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'এক-এক ফাংশন (One-to-One Function) ও সার্বিক ফাংশনের সংজ্ঞা দাও।',
    answer: 'একটি ফাংশন f: A → B কে এক-এক বলা হয় যদি ডোমেনের ভিন্ন ভিন্ন উপাদানের প্রতিচ্ছবিও ভিন্ন ভিন্ন হয়। আর রেঞ্জ যদি কো-ডোমেনের সমান হয় তবে তাকে সার্বিক (On-to) ফাংশন বলে।',
    marks: 2,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-hm-02',
    subject: 'উচ্চতর গণিত',
    chapter: 'ত্রিকোণমিতি',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'রেডিয়ান কোণ কাকে বলে? এটি কেন ধ্রুব কোণ?',
    answer: 'কোনো বৃত্তের ব্যাসার্ধের সমান চাপ ঐ বৃত্তের কেন্দ্রে যে কোণ উৎপন্ন করে, তাকে ১ রেডিয়ান কোণ বলে। যেহেতু বৃত্তের পরিধি ও ব্যাসার্ধের অনুপাত ধ্রুব (2π), তাই রেডিয়ান একটি ধ্রুব কোণ।',
    marks: 2,
    type: 'short',
    boardInfo: 'চট্টগ্রাম বোর্ড ২০২৩',
    importance: 'very_high'
  },

  // ==================== তথ্য ও যোগাযোগ প্রযুক্তি (ICT) ====================
  {
    id: 'sq-ict-01',
    subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
    chapter: 'তথ্য ও যোগাযোগ প্রযুক্তি এবং আমাদের বাংলাদেশ',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'ই-লার্নিং (e-Learning) ও ই-গভর্ন্যান্সের সংজ্ঞা দাও।',
    answer: 'ইন্টারনেট ও ইলেকট্রনিক মাধ্যম ব্যবহার করে শিক্ষাদান পদ্ধতি হলো ই-লার্নিং। আর সরকারি কার্যক্রমে স্বচ্ছতা ও দ্রুততা আনতে প্রযুক্তির ব্যবহার হলো ই-গভর্ন্যান্স।',
    marks: 2,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-ict-02',
    subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
    chapter: 'কম্পিউটার ও কম্পিউটার ব্যবহারকারীর নিরাপত্তা',
    targetClass: '৮ম শ্রেণি',
    question: 'ম্যালওয়্যার ও স্পাইওয়্যারের মধ্যে পার্থক্য কী?',
    answer: 'ম্যালওয়্যার হলো যেকোনো ক্ষতিকারক প্রোগ্রাম যা ফাইল নষ্ট করে বা সিস্টেম ক্ষতিগ্রস্ত করে। স্পাইওয়্যার হলো এমন প্রোগ্রাম যা গোপনে ব্যবহারকারীর তথ্য চুরি করে অন্যত্র পাঠায়।',
    marks: 2,
    type: 'short',
    boardInfo: 'রাজশাহী বোর্ড ২০২৪',
    importance: 'very_high'
  },

  // ==================== বাংলা (Bangla) ====================
  {
    id: 'sq-ban-01',
    subject: 'বাংলা',
    chapter: 'ধ্বনি ও বর্ণ প্রকরণ',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'ঘোষ ধ্বনি ও অঘোষ ধ্বনির মধ্যে পার্থক্য কী?',
    answer: 'যেসব ধ্বনি উচ্চারণের সময় স্বরতন্ত্রী অনুরণিত হয় সেগুলোকে ঘোষ ধ্বনি বলে (বর্গের ৩য় ও ৪র্থ বর্ণ)। আর যে ধ্বনি উচ্চারণে স্বরতন্ত্রী অনুরণিত হয় না তাকে অঘোষ ধ্বনি বলে (১ম ও ২য় বর্ণ)।',
    marks: 2,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-ban-02',
    subject: 'বাংলা',
    chapter: 'সমাস ও প্রত্যয়',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'সমাস শব্দের অর্থ কী? রূপক কর্মধারয় সমাসের দুটি উদাহরণ দাও।',
    answer: 'সমাস শব্দের অর্থ সংক্ষেপণ বা একাধিক পদের একপদীকরণ। রূপক কর্মধারয় সমাসে উপমান ও উপমেয়ের মধ্যে অভেদ কল্পনা করা হয়। যেমন: মনরূপ মাঝি = মনমাঝি, বিষাদরূপ সিন্ধু = বিষাদসিন্ধু।',
    marks: 2,
    type: 'short',
    boardInfo: 'যশোর বোর্ড ২০২৩',
    importance: 'very_high'
  },

  // ==================== ইসলাম ও নৈতিক শিক্ষা ====================
  {
    id: 'sq-isl-01',
    subject: 'ইসলাম ও নৈতিক শিক্ষা',
    chapter: 'আকাইদ ও বিশ্বাস',
    targetClass: '৯ম-১০ম শ্রেণি',
    question: 'তাওহিদ শব্দের অর্থ কী? তাওহিদে বিশ্বাসের মূল তাৎপর্য লেখো।',
    answer: 'তাওহিদ শব্দের অর্থ একত্ববাদ। মহান আল্লাহকে একমাত্র সৃষ্টিকর্তা, পালনকর্তা ও উপাস্য হিসেবে মনেপ্রাণে বিশ্বাস করা ও স্বীকার করাই হলো তাওহিদ।',
    marks: 2,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high'
  },
  {
    id: 'sq-isl-02',
    subject: 'ইসলাম ও নৈতিক শিক্ষা',
    chapter: 'আখলাক ও নৈতিক চরিত্র',
    targetClass: '৮ম শ্রেণি',
    question: 'আখলাকে হামিদা ও আখলাকে জামিমার পার্থক্য লেখো।',
    answer: 'আখলাকে হামিদা হলো মানবজীবনের উত্তম, প্রশংসনীয় ও মার্জিত স্বভাব (যেমন: সত্যবাদিতা, আমানতদারিতা)। আর আখলাকে জামিমা হলো নিন্দনীয় চরিত্র (যেমন: মিথ্যাচার, অহংকার)।',
    marks: 2,
    type: 'short',
    boardInfo: 'চট্টগ্রাম বোর্ড ২০২৪',
    importance: 'high'
  }
];
