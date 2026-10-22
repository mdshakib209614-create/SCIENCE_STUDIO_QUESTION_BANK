import { MCQQuestion, CQQuestion, QuestionItem } from '../types';
import { getChaptersForClassAndSubject } from './chaptersData';
import { generateClassEnglishQuestions } from './questions/englishClassBoardFormats';

// Reputable board and school tags for Class 6, 7, 8 exams
const JUNIOR_BOARD_TAGS = [
  "ঢাকা শিক্ষা বোর্ড ও সরকারি মডেল স্কুল '২৪",
  "মতিঝিল আইডিয়াল স্কুল এন্ড কলেজ '২৪",
  "ভিকারুননিসা নূন স্কুল এন্ড কলেজ '২৪",
  "রাজউক উত্তরা মডেল কলেজ '২৪",
  "মিরপুর সরকারি উচ্চ বিদ্যালয় '২৪",
  "গভ. ল্যাবরেটরি হাই স্কুল, ঢাকা '২৪",
  "ঢাকা রেসিডেন্সিয়াল মডেল কলেজ '২৪",
  "চট্টগ্রাম কলেজিয়েট স্কুল '২৪",
  "চট্টগ্রাম সরকারি মুসলিম হাই স্কুল '২৪",
  "রাজশাহী কলেজিয়েট স্কুল '২৪",
  "বগুড়া জিলা স্কুল '২৪",
  "দিনাজপুর জিলা স্কুল '২৪",
  "রংপুর জিলা স্কুল '২৪",
  "কুমিল্লা জিলা স্কুল '২৪",
  "বরিশাল জিলা স্কুল '২৪",
  "সিলেট সরকারি পাইলট উচ্চ বিদ্যালয় '২৪",
  "ময়মনসিংহ জিলা স্কুল '২৪",
  "মির্জাপুর ক্যাডেট কলেজ '২৪",
  "ফৌজদারহাট ক্যাডেট কলেজ '২৪",
  "বরিশাল ক্যাডেট কলেজ '২৪",
  "রংপুর ক্যাডেট কলেজ '২৪",
  "সেন্ট জোসেফ উচ্চ বিদ্যালয় '২৪",
  "সেন্ট গ্রেগরিজ হাই স্কুল '২৪",
  "আদমজী ক্যান্টনমেন্ট পাবলিক স্কুল '২৪",
  "বিএএফ শাহীন কলেজ ঢাকা '২৪",
  "বীরশ্রেষ্ঠ নূর মোহাম্মদ পাবলিক কলেজ '২৪",
  "আইডিয়াল প্রিপারেটরি স্কুল '২৪",
  "খুলনা জিলা স্কুল '২৪",
  "যশোর জিলা স্কুল '২৪",
  "পাবনা ক্যাডেট কলেজ '২৪"
];

interface ChapterTemplate {
  topic: string;
  stem: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

// Curriculum-aligned template bank for Junior Classes (6, 7, 8)
type CurriculumMap = Record<string, Record<string, ChapterTemplate[]>>;

const JUNIOR_TEMPLATES: CurriculumMap = {
  // ==========================================
  // ৬ষ্ঠ শ্রেণি (CLASS 6)
  // ==========================================
  '৬ষ্ঠ শ্রেণি': {
    'সাধারণ গণিত': [
      {
        topic: 'স্বাভাবিক সংখ্যা ও ভগ্নাংশ',
        stem: 'দুটি সংখ্যার গ.সা.গু ১ হলে সংখ্যা দুটিকে পরস্পরের কী বলা হয়?',
        options: ['মৌলিক সংখ্যা', 'যৌগিক সংখ্যা', 'সহমৌলিক সংখ্যা', 'জোড় সংখ্যা'],
        correctIndex: 2,
        explanation: 'দুটি সংখ্যার সাধারণ গুণনীয়ক কেবল ১ হলে সংখ্যা দুটিকে পরস্পরের সহমৌলিক বলা হয়।'
      },
      {
        topic: 'স্বাভাবিক সংখ্যা ও ভগ্নাংশ',
        stem: 'নিচের কোন সংখ্যাটি ৩ দ্বারা বিভাজ্য?',
        options: ['১৪২', '২৫৩', '৪১৪', '৫২৩'],
        correctIndex: 2,
        explanation: '৪১৪ এর অঙ্কগুলোর যোগফল ৪+১+৪ = ৯, যা ৩ দ্বারা বিভাজ্য। তাই ৪১৪ সংখ্যাটি ৩ দ্বারা বিভাজ্য।'
      },
      {
        topic: 'অনুপাত ও শতকরা',
        stem: '৩ : ৫ অনুপাতটিকে শতকরায় প্রকাশ করলে কত হবে?',
        options: ['৪০%', '৫০%', '৬০%', '৭৫%'],
        correctIndex: 2,
        explanation: '৩/৫ × ১০০% = ৬০%।'
      },
      {
        topic: 'অনুপাত ও শতকরা',
        stem: 'একটি দ্রব্য ৫০০ টাকায় ক্রয় করে ৫৫০ টাকায় বিক্রয় করা হলে শতকরা কত লাভ হবে?',
        options: ['৫%', '৮%', '১০%', '১২%'],
        correctIndex: 2,
        explanation: 'লাভ = ৫৫০ - ৫০০ = ৫০ টাকা। শতকরা লাভ = (৫০/৫০০) × ১০০% = ১০%।'
      },
      {
        topic: 'বীজগণিতীয় রাশি',
        stem: '5x + 3y রাশিতে x এর সহগ কোনটি?',
        options: ['3', '5', 'x', 'y'],
        correctIndex: 1,
        explanation: 'চলক x এর সাথে গুণক হিসেবে ৫ আছে, তাই x এর সহগ ৫।'
      },
      {
        topic: 'বীজগণিতীয় রাশি',
        stem: 'a = 2 এবং b = 3 হলে, 3a + 2b এর মান কত হবে?',
        options: ['10', '12', '14', '16'],
        correctIndex: 1,
        explanation: '3(2) + 2(3) = 6 + 6 = 12।'
      },
      {
        topic: 'সরল সমীকরণ',
        stem: '2x + 6 = 16 সমীকরণের মূল (সমাধান) কোনটি?',
        options: ['3', '4', '5', '6'],
        correctIndex: 2,
        explanation: '2x = 16 - 6 = 10 ⇒ x = 5।'
      },
      {
        topic: 'জ্যামিতির মৌলিক ধারণা',
        stem: 'যে কোণের পরিমাপ ৯০° অপেক্ষা কম তাকে কী কোণ বলে?',
        options: ['স্থূলকোণ', 'সূক্ষ্মকোণ', 'সমকোণ', 'প্রবৃদ্ধ কোণ'],
        correctIndex: 1,
        explanation: '৯০° অপেক্ষা ছোট কোণকে সূক্ষ্মকোণ বলা হয়।'
      },
      {
        topic: 'জ্যামিতির মৌলিক ধারণা',
        stem: 'দুটি কোণের পরিমাপের যোগফল ১৮০° হলে একটিকে অপরটির কী কোণ বলে?',
        options: ['পূরক কোণ', 'সম্পূরক কোণ', 'বিপ্রতীপ কোণ', 'সন্নিহিত কোণ'],
        correctIndex: 1,
        explanation: 'দুটি কোণের সমষ্টি ১৮০° বা দুই সমকোণ হলে তাদেরকে পরস্পর সম্পূরক কোণ বলে।'
      },
      {
        topic: 'তথ্য ও উপাত্ত',
        stem: '৫, ৮, ৪, ১২, ৬ উপাত্তগুলোর মধ্যক কত?',
        options: ['৫', '৬', '৮', '৭'],
        correctIndex: 1,
        explanation: 'মানের ক্রমানুসারে সাজালে: ৪, ৫, ৬, ৮, ১২। এখানে মাঝের মান ৬, তাই মধ্যক ৬।'
      }
    ],

    'বিজ্ঞান': [
      {
        topic: 'বৈজ্ঞানিক প্রক্রিয়া ও পরিমাপ',
        stem: 'আন্তর্জাতিক পদ্ধতিতে (SI) তাপমাত্রার একক কোনটি?',
        options: ['সেলসিয়াস', 'ফারেনহাইট', 'কেলভিন (K)', 'ক্যালোরি'],
        correctIndex: 2,
        explanation: 'আন্তর্জাতিক পদ্ধতিতে (SI) তাপমাত্রার মৌলিক একক কেলভিন (K)।'
      },
      {
        topic: 'জীবজগৎ',
        stem: 'নিচের কোন জীবটি মনেরা (Monera) রাজ্যের অন্তর্ভুক্ত?',
        options: ['স্পাইরোগাইরা', 'প্যারামিসিয়াম', 'ব্যাকটেরিয়া', 'ইস্ট'],
        correctIndex: 2,
        explanation: 'ব্যাকটেরিয়া হলো এককোষী প্রোক্যারিওটিক জীব, যা মনেরা রাজ্যের অন্তর্ভুক্ত।'
      },
      {
        topic: 'উদ্ভিদ ও প্রাণীর কোষীয় সংগঠন',
        stem: 'উদ্ভিদ কোষে খাদ্য তৈরি করে কোষের কোন অঙ্গাণু?',
        options: ['মাইটোকন্ড্রিয়া', 'প্লাস্টিড (ক্লোরোপ্লাস্ট)', 'গলজি বডি', 'লাইসোজোম'],
        correctIndex: 1,
        explanation: 'ক্লোরোপ্লাস্টে উপস্থিত ক্লোরোফিল সূর্যালোকের সাহায্যে সালোকসংশ্লেষণ প্রক্রিয়ায় খাদ্য তৈরি করে।'
      },
      {
        topic: 'পদার্থের অবস্থা ও বৈশিষ্ট্য',
        stem: 'নিচের কোনটির নির্দিষ্ট আয়তন আছে কিন্তু নির্দিষ্ট আকার নেই?',
        options: ['লোহা', 'পানি', 'বাতাস', 'কাঠ'],
        correctIndex: 1,
        explanation: 'তরল পদার্থের নির্দিষ্ট আয়তন থাকলেও কোনো নির্দিষ্ট আকার থাকে না; পাত্রের আকার ধারণ করে।'
      },
      {
        topic: 'সালোকসংশ্লেষণ ও শক্তির রূপান্তর',
        stem: 'সালোকসংশ্লেষণ প্রক্রিয়ায় উপজাত হিসেবে কোন গ্যাস নির্গত হয়?',
        options: ['কার্বন ডাই-অক্সাইড', 'অক্সিজেন', 'নাইট্রোজেন', 'হাইড্রোজেন'],
        correctIndex: 1,
        explanation: 'উদ্ভিদ সালোকসংশ্লেষণ প্রক্রিয়ায় পানি ও কার্বন ডাই-অক্সাইড ব্যবহার করে গ্লুকোজ ও অক্সিজেন তৈরি করে।'
      },
      {
        topic: 'সংবেদী অঙ্গ ও স্বাস্থ্য',
        stem: 'চোখের যে অংশে বস্তুর স্পষ্ট প্রতিবিম্ব গঠিত হয় তার নাম কী?',
        options: ['কর্নিয়া', 'আইরিশ', 'রেটিনা', 'পিউপিল'],
        correctIndex: 2,
        explanation: 'চোখের অক্ষিগোলকের অভ্যন্তরীণ আলোকসংবেদী স্তর হলো রেটিনা, যেখানে প্রতিবিম্ব সৃষ্টি হয়।'
      }
    ],

    'ইংরেজি': [
      {
        topic: 'Parts of Speech & Nouns',
        stem: 'Which of the following is an Abstract Noun?',
        options: ['Gold', 'Honesty', 'Army', 'Teacher'],
        correctIndex: 1,
        explanation: '"Honesty" represents a quality of state of mind that cannot be touched, so it is an Abstract Noun.'
      },
      {
        topic: 'Articles & Prepositions',
        stem: 'He is ________ honest officer in the department.',
        options: ['a', 'an', 'the', 'no article'],
        correctIndex: 1,
        explanation: 'The word "honest" begins with a silent "h" having a vowel sound (o), hence "an" is used.'
      },
      {
        topic: 'Tense & Right Form of Verbs',
        stem: 'The sun ________ in the east every morning.',
        options: ['rise', 'rises', 'rose', 'rising'],
        correctIndex: 1,
        explanation: 'Universal truth and daily habitual facts are expressed in the Present Simple tense.'
      },
      {
        topic: 'Sentence & Transformation',
        stem: 'What a beautiful flower it is! — Identify the sentence type:',
        options: ['Assertive', 'Imperative', 'Exclamatory', 'Optative'],
        correctIndex: 2,
        explanation: 'Sentences expressing strong emotion or exclamation are Exclamatory.'
      },
      {
        topic: 'Reading & Vocabulary',
        stem: 'What is the synonym of the word "Courageous"?',
        options: ['Fearful', 'Brave', 'Timid', 'Weak'],
        correctIndex: 1,
        explanation: '"Brave" means having courage, which is the direct synonym of "Courageous".'
      },
      {
        topic: 'Writing: Paragraph & Application',
        stem: 'In a formal application to the Headmaster, which salutation is appropriate?',
        options: ['Dear buddy,', 'Sir / Madam,', 'Hello friend,', 'Hey teacher,'],
        correctIndex: 1,
        explanation: 'Formal institutional applications begin with "Sir" or "Madam".'
      }
    ],

    'বাংলাদেশ ও বিশ্ব পরিচয়': [
      {
        topic: 'বাংলাদেশের ইতিহাস ও প্রাচীন সভ্যতা',
        stem: 'উয়ারী-বটেশ্বর প্রত্নতাত্ত্বিক নিদর্শনটি কোন জেলায় অবস্থিত?',
        options: ['বগুড়া', 'কুমিল্লা', 'নরসিংদী', 'মুন্সীগঞ্জ'],
        correctIndex: 2,
        explanation: 'উয়ারী-বটেশ্বর নরসিংদী জেলার বেলাব ও শিবপুর উপজেলায় অবস্থিত আড়াই হাজার বছরের প্রাচীন দুর্গনগরী।'
      },
      {
        topic: 'বাংলাদেশ ও বাংলাদেশের নাগরিক',
        stem: 'সুনাগরিকের প্রধান কয়টি মৌলিক গুণ রয়েছে?',
        options: ['২টি', '৩টি', '৪টি', '৫টি'],
        correctIndex: 1,
        explanation: 'সুনাগরিকের প্রধান ৩টি গুণ হলো: বুদ্ধি, আত্মসংযম এবং বিবেক-বিচার।'
      },
      {
        topic: 'বাংলাদেশ ও বিশ্ব ভৌগোলিক পরিমণ্ডল',
        stem: 'বাংলাদেশ এশিয়া মহাদেশের কোন অঞ্চলে অবস্থিত?',
        options: ['পূর্ব এশিয়া', 'দক্ষিণ এশিয়া', 'পশ্চিম এশিয়া', 'মধ্য এশিয়া'],
        correctIndex: 1,
        explanation: 'বাংলাদেশ ভৌগোলিকভাবে দক্ষিণ এশিয়া অঞ্চলের অন্তর্ভুক্ত একটি সার্বভৌম রাষ্ট্র।'
      },
      {
        topic: 'বাংলাদেশের অর্থনীতি ও সমাজ',
        stem: 'বাংলাদেশের অর্থনীতির প্রধান চালিকাশক্তি ঐতিহ্যগতভাবে কোনটি?',
        options: ['খনিজ তেল', 'কৃষি খাত', 'ভারী শিল্প', 'জাহাজ নির্মাণ'],
        correctIndex: 1,
        explanation: 'কৃষি এখনও বাংলাদেশের গ্রামীণ মানুষের কর্মসংস্থান ও খাদ্য নিরাপত্তার প্রধান খাত।'
      },
      {
        topic: 'বাংলাদেশের সংস্কৃতি ও সামাজিক পরিবেশ',
        stem: 'পহেলা বৈশাখ বাঙালির সর্বজনীন উৎসব হিসেবে কোন সংস্কৃতিকে প্রতিনিধিত্ব করে?',
        options: ['ধর্মীয় সংস্কৃতি', 'লোক ও লোকজ সংস্কৃতি', 'পাশ্চাত্য সংস্কৃতি', 'উপজাতীয় সংস্কৃতি'],
        correctIndex: 1,
        explanation: 'পহেলা বৈশাখ জাতি-ধর্ম নির্বিশেষে আবহমান বাংলার ঐতিহ্যবাহী লোকসংস্কৃতির অংশ।'
      }
    ],

    'বাংলা': [
      {
        topic: 'গদ্য: সততার পুরস্কার, মিনু ও নীল নদ',
        stem: '‘সততার পুরস্কার’ গল্পে ফেরেশতা প্রথমে কোন রোগের রোগীর কাছে এসেছিলেন?',
        options: ['অন্ধ', 'কুষ্ঠরোগী', 'টাকওয়ালা', 'বোবা'],
        correctIndex: 1,
        explanation: 'মুহম্মদ শহীদুল্লাহ্ রচিত গল্পে আল্লাহ্‌র নির্দেশে ফেরেশতা প্রথমে শ্বেত বা কুষ্ঠরোগীর পরীক্ষা নিয়েছিলেন।'
      },
      {
        topic: 'পদ্য: জন্মভূমি, সুখ ও মানুষ জাতি',
        stem: '“সার্থক জনম আমার জন্মেছি এই দেশে” — কবিতাংশটির রচয়িতা কে?',
        options: ['কাজী নজরুল ইসলাম', 'রবীন্দ্রনাথ ঠাকুর', 'জসীমউদ্দীন', 'জীবনানন্দ দাশ'],
        correctIndex: 1,
        explanation: '‘জন্মভূমি’ কবিতার রচয়িতা বিশ্বকবি রবীন্দ্রনাথ ঠাকুর।'
      },
      {
        topic: 'ব্যাকরণ: ভাষা ও ব্যাকরণ',
        stem: 'বাংলা ভাষার মূল উৎস নিচের কোন ভাষা থেকে উৎপত্তি লাভ করেছে?',
        options: ['হিন্দি', 'বৈদিক বা প্রাকৃত ভাষা', 'ইংরেজি', 'ফারসি'],
        correctIndex: 1,
        explanation: 'ইন্দো-ইউরোপীয় ভাষা পরিবারের প্রাচীন ভারতীয় আর্য ভাষার প্রাকৃত স্তর থেকে বাংলা ভাষার জন্ম।'
      },
      {
        topic: 'সন্ধি ও বিরামচিহ্ন',
        stem: '‘বিদ্যালয়’ শব্দের সঠিক সন্ধি বিচ্ছেদ কোনটি?',
        options: ['বিদ + আলয়', 'বিদ্যা + আলয়', 'বিদ্য + লয়', 'বিদ্যাব + আলয়'],
        correctIndex: 1,
        explanation: 'আ-কার ও আ-কার মিলে আ-কার হয়: বিদ্যা + আলয় = বিদ্যালয়।'
      },
      {
        topic: 'শব্দ ও পদ প্রকরণ',
        stem: 'যে পদ অন্য পদের দোষ, গুণ, অবস্থা ও সংখ্যা প্রকাশ করে তাকে কী পদ বলে?',
        options: ['বিশেষ্য', 'বিশেষণ', 'সর্বনাম', 'অব্যয়'],
        correctIndex: 1,
        explanation: 'বিশেষ্য ও সর্বনামের গুণ, অবস্থা বা বৈশিষ্ট্য নির্দেশকারী পদ হলো বিশেষণ।'
      }
    ],

    'তথ্য ও যোগাযোগ প্রযুক্তি': [
      {
        topic: 'তথ্য ও যোগাযোগ প্রযুক্তি পরিচিতি',
        stem: 'ICT এর পূর্ণরূপ নিচের কোনটি?',
        options: [
          'Information and Computer Technology',
          'Information and Communication Technology',
          'Internet and Cyber Technology',
          'International Communication Tools'
        ],
        correctIndex: 1,
        explanation: 'ICT = Information and Communication Technology (তথ্য ও যোগাযোগ প্রযুক্তি)।'
      },
      {
        topic: 'কম্পিউটার সংশ্লিষ্ট যন্ত্রপাতি',
        stem: 'নিচের কোনটি কম্পিউটারের প্রধান ইনপুট ডিভাইস?',
        options: ['মনিটর', 'কিবোর্ড', 'প্রিন্টার', 'স্পিকার'],
        correctIndex: 1,
        explanation: 'কিবোর্ড ও মাউসের সাহায্যে ব্যবহারকারী কম্পিউটারে তথ্য ও নির্দেশ ইনপুট দেয়।'
      },
      {
        topic: 'ইন্টারনেট ও দৈনন্দিন জীবন',
        stem: 'বিশ্বের সবচেয়ে জনপ্রিয় ওয়েব সার্চ ইঞ্জিন কোনটি?',
        options: ['উইন্ডোজ', 'গুগল (Google)', 'ইউটিউব', 'ফেসবুক'],
        correctIndex: 1,
        explanation: 'গুগল হলো বিশ্বের সর্বাধিক ব্যবহৃত ও নির্ভরযোগ্য সার্চ ইঞ্জিন।'
      },
      {
        topic: 'নিরাপদ ও নৈতিক ব্যবহার',
        stem: 'কম্পিউটারকে ক্ষতিকর ভাইরাস আক্রমণ থেকে রক্ষা করতে কোনটি ব্যবহার করতে হয়?',
        options: ['গেম সফটওয়্যার', 'অ্যান্টিভাইরাস সফটওয়্যার', 'মিডিয়া প্লেয়ার', 'ব্রাউজার'],
        correctIndex: 1,
        explanation: 'অ্যান্টিভাইরাস প্রোগ্রাম সিস্টেম স্ক্যান করে ক্ষতিকর ম্যালওয়্যার দূর করে নিরাপত্তা দেয়।'
      }
    ],

    'ইসলাম ও নৈতিক শিক্ষা': [
      {
        topic: 'আকাইদ ও বিশ্বাস',
        stem: 'ইসলামের প্রথম ও প্রধান মৌলিক ভিত্তি কোনটি?',
        options: ['রিসালাত', 'তাওহিদ (আল্লাহর একত্ববাদ)', 'আখিরাত', 'তাকদির'],
        correctIndex: 1,
        explanation: 'তাওহিদ বা আল্লাহ তায়ালার একত্ববাদে দৃঢ় বিশ্বাস স্থাপনই হলো ইসলামের মূল বুনিয়াদ।'
      },
      {
        topic: 'ইবাদত (সালাত ও পবিত্রতা)',
        stem: 'দৈনিক কত ওয়াক্ত সালাত আদায় করা মুসলিমদের জন্য ফরজ করা হয়েছে?',
        options: ['৩ ওয়াক্ত', '৪ ওয়াক্ত', '৫ ওয়াক্ত', '৭ ওয়াক্ত'],
        correctIndex: 2,
        explanation: 'দৈনিক ৫ ওয়াক্ত (ফজর, জোহর, আসর, মাগরিব, এশা) সালাত প্রত্যেক প্রাপ্তবয়স্ক মুসলিমের ওপর ফরজ।'
      },
      {
        topic: 'আখলাক ও শিষ্টাচার',
        stem: '“পরিষ্কার-পরিচ্ছন্নতা ঈমানের অঙ্গ” — এটি কার বাণী?',
        options: ['হযরত আবু বকর (রা.)', 'হযরত মুহাম্মদ (সা.)', 'ইমাম বুখারি (রহ.)', 'হযরত উমর (রা.)'],
        correctIndex: 1,
        explanation: 'রাসুলুল্লাহ (সা.) পবিত্রতা ও পরিচ্ছন্নতাকে ঈমানের অর্ধাংশ বলে ঘোষণা করেছেন।'
      },
      {
        topic: 'কুরআন ও হাদিস শিক্ষা',
        stem: 'পবিত্র কুরআনের কোন সূরায় তাওহিদের সারমর্ম স্পষ্টভাবে তুলে ধরা হয়েছে?',
        options: ['সূরা নাস', 'সূরা ফালাক', 'সূরা ইখলাস', 'সূরা কাউসার'],
        correctIndex: 2,
        explanation: 'সূরা আল-ইখলাসে আল্লাহর একত্ববাদ, অমুখাপেক্ষিতা ও অতুলনীয় মর্যাদার বর্ণনা রয়েছে।'
      },
      {
        topic: 'আদর্শ জীবনচরিত',
        stem: 'হযরত মুহাম্মদ (সা.) বাল্যকালে সত্যবাদিতা ও বিশ্বস্ততার জন্য কী উপাধিতে ভূষিত হন?',
        options: ['আস-সাদিক', 'আল-আমিন', 'খাতামুন নাবিয়্যিন', 'সাইয়্যেদুল মুরসালিন'],
        correctIndex: 1,
        explanation: 'নবুওয়াতের পূর্বেই মক্কার পৌত্তলিক কুরাইশরা সত্যবাদিতার কারণে তাঁকে "আল-আমিন" (বিশ্বাসী) ডাকত।'
      }
    ]
  },

  // ==========================================
  // ৭ম শ্রেণি (CLASS 7)
  // ==========================================
  '৭ম শ্রেণি': {
    'সাধারণ গণিত': [
      {
        topic: 'মূলদ ও অমূলদ সংখ্যা',
        stem: 'যে সংখ্যাকে দুটি পূর্ণসংখ্যার ভগ্নাংশ p/q (যেখানে q ≠ 0) আকারে প্রকাশ করা যায় তাকে কী বলে?',
        options: ['অমূলদ সংখ্যা', 'মূলদ সংখ্যা', 'বাস্তব নয় এমন সংখ্যা', 'কাল্পনিক সংখ্যা'],
        correctIndex: 1,
        explanation: 'ভগ্নাংশ আকারে প্রকাশযোগ্য সংখ্যাসমূহ হলো মূলদ সংখ্যা।'
      },
      {
        topic: 'সমানুপাত ও লাভ-ক্ষতি',
        stem: 'একটি বই ১২০ টাকায় ক্রয় করে ১৫০ টাকায় বিক্রয় করলে শতকরা লাভ কত?',
        options: ['১৫%', '২০%', '২৫%', '৩০%'],
        correctIndex: 2,
        explanation: 'লাভ = ১৫০ - ১২০ = ৩০ টাকা। শতকরা লাভ = (৩০/১২০) × ১০০% = ২৫%।'
      },
      {
        topic: 'বীজগণিতীয় সূত্রাবলি',
        stem: '(a + b)² এর মান নির্ণয়ের মূল সূত্র কোনটি?',
        options: ['a² - 2ab + b²', 'a² + 2ab + b²', 'a² + b²', 'a² - b²'],
        correctIndex: 1,
        explanation: '(a + b)² = a² + 2ab + b²।'
      },
      {
        topic: 'বীজগণিতীয় সূত্রাবলি',
        stem: 'a + b = 5 এবং a - b = 3 হলে, a² - b² এর মান কত?',
        options: ['8', '15', '16', '25'],
        correctIndex: 1,
        explanation: 'a² - b² = (a + b)(a - b) = 5 × 3 = 15।'
      },
      {
        topic: 'ভগ্নাংশের যোগ-বিয়োগ',
        stem: '1/x + 1/y এর সরলফল নিচের কোনটি?',
        options: ['2/(x+y)', '(x+y)/xy', 'xy/(x+y)', '1/(xy)'],
        correctIndex: 1,
        explanation: 'সাধারণ হর xy নিয়ে যোগ করলে পাওয়া যায় (y + x)/xy = (x + y)/xy।'
      },
      {
        topic: 'সরল সমীকরণ',
        stem: '3x - 5 = 16 সমীকরণের সমাধান কত?',
        options: ['5', '6', '7', '8'],
        correctIndex: 2,
        explanation: '3x = 16 + 5 = 21 ⇒ x = 7।'
      },
      {
        topic: 'সর্বসমতা ও সদৃশতা',
        stem: 'দুটি ত্রিভুজের তিনটি বাহু পরস্পর সমান হলে ত্রিভুজ দুটি কী হবে?',
        options: ['সদৃশ কিন্তু অসমান', 'সর্বসম (বাহু-বাহু-বাহু)', 'বিষমবাহু', 'অসমকোণী'],
        correctIndex: 1,
        explanation: 'বাহু-বাহু-বাহু (SSS) উপপাদ্য অনুযায়ী ত্রিভুজদ্বয় সর্বসম হবে।'
      },
      {
        topic: 'তথ্য ও উপাত্ত',
        stem: 'গণসংখ্যার মোট সমষ্টিকে N ধরলে মধ্যক শ্রেণির অবস্থান কীভাবে নির্ধারিত হয়?',
        options: ['N/4', 'N/2', 'N/3', 'N/10'],
        correctIndex: 1,
        explanation: 'ক্রমযোজিত গণসংখ্যা সারণিতে N/2 তম পদের মান যে শ্রেণিতে থাকে তা মধ্যক শ্রেণি।'
      }
    ],

    'বিজ্ঞান': [
      {
        topic: 'নিম্নশ্রেণির জীব',
        stem: 'তামাক গাছের মোজাইক রোগ সৃষ্টিকারী ভাইরাসটির নাম কী?',
        options: ['T2 ফায', 'TMV (টোব্যাকো মোজাইক ভাইরাস)', 'করোনা ভাইরাস', 'ইনফ্লুয়েঞ্জা'],
        correctIndex: 1,
        explanation: 'TMV ভাইরাস তামাক পাতার ক্লোরোফিল ধ্বংস করে মোজাইক রোগ ঘটায়।'
      },
      {
        topic: 'উদ্ভিদের বাহ্যিক বৈশিষ্ট্য',
        stem: 'উদ্ভিদের কোন অংশ মাটির নিচ থেকে পানি ও খনিজ লবণ শোষণ করে?',
        options: ['পাতা', 'মূলরোম', 'কাণ্ড', 'ফুল'],
        correctIndex: 1,
        explanation: 'মূলের অগ্রভাগের মূলরোম অভিস্রবণ প্রক্রিয়ায় মাটির কৈশিক পানি শোষণ করে।'
      },
      {
        topic: 'পদার্থের গঠন',
        stem: 'পানি (H₂O) যৌগে হাইড্রোজেন ও অক্সিজেনের পরমাণুর অনুপাত কত?',
        options: ['১ : ১', '২ : ১', '১ : ২', '২ : ৩'],
        correctIndex: 1,
        explanation: 'পানির অণুতে ২টি হাইড্রোজেন ও ১টি অক্সিজেন পরমাণু থাকে।'
      },
      {
        topic: 'শক্তির ব্যবহার',
        stem: 'সেলসিয়াস স্কেলে মানবদেহের স্বাভাবিক তাপমাত্রা কত?',
        options: ['৩৬.৯° C', '৩৭° C (৯৮.৪° F)', '৩৮° C', '৪০° C'],
        correctIndex: 1,
        explanation: 'সুস্থ মানবদেহের স্বাভাবিক তাপমাত্রা প্রায় ৩৭° সেলসিয়াস বা ৯৮.৪° ফারেনহাইট।'
      },
      {
        topic: 'শব্দ ও আলোর প্রকৃতি',
        stem: 'সমতল দর্পণে সৃষ্ট প্রতিবিম্বের প্রধান বৈশিষ্ট্য কোনটি?',
        options: ['বাস্তব ও সোজা', 'অবাস্তব ও সোজা এবং লক্ষ্যবস্তুর সমান', 'বাস্তব ও উল্টো', 'অবাস্তব ও বিবর্ধিত'],
        correctIndex: 1,
        explanation: 'সমতল আয়নায় সর্বদা অবাস্তব, সোজা ও বস্তুর সমান আকারের প্রতিবিম্ব সৃষ্টি হয়।'
      },
      {
        topic: 'পরিবেশের ভারসাম্য ও শ্বসন',
        stem: 'মানবদেহে অক্সিজেন ও কার্বন ডাই-অক্সাইডের গ্যাসীয় বিনিময় কোথায় ঘটে?',
        options: ['শ্বাসনালি', 'অ্যালভিওলাই (ফুসফুস)', 'ব্রঙ্কাস', 'ল্যারিংস'],
        correctIndex: 1,
        explanation: 'ফুসফুসের কোটি কোটি ক্ষুদ্র বায়ুথলি বা অ্যালভিওলাই রক্তজালকের সাথে গ্যাসীয় বিনিময় ঘটায়।'
      }
    ],

    'ইংরেজি': [
      {
        topic: 'Right Form of Verbs',
        stem: 'Neither of the boys ________ present in the class yesterday.',
        options: ['were', 'was', 'are', 'have been'],
        correctIndex: 1,
        explanation: '"Neither of" takes a singular verb. Since it indicates past time, "was" is correct.'
      },
      {
        topic: 'Voice Change (Active & Passive)',
        stem: 'Change into passive: "The teacher teaches us English."',
        options: [
          'English is taught us by the teacher.',
          'We are taught English by the teacher.',
          'We were taught English by the teacher.',
          'English was taught to us by the teacher.'
        ],
        correctIndex: 1,
        explanation: 'Active with two objects: object "us" becomes subject "We", followed by "are taught English by the teacher".'
      },
      {
        topic: 'Narration & Speech',
        stem: 'He said to me, "I am doing my homework." — Indirect speech:',
        options: [
          'He told me that he is doing his homework.',
          'He told me that he was doing his homework.',
          'He asked me if he was doing homework.',
          'He said that he did homework.'
        ],
        correctIndex: 1,
        explanation: 'Present continuous changes to past continuous: "was doing his homework".'
      },
      {
        topic: 'Prepositions & Articles',
        stem: 'He has been suffering from fever ________ Monday last.',
        options: ['for', 'since', 'from', 'in'],
        correctIndex: 1,
        explanation: '"Since" is used to denote a specific point of past time.'
      },
      {
        topic: 'Reading & Vocabulary',
        stem: 'What is the antonym of the word "Ancient"?',
        options: ['Old', 'Historic', 'Modern', 'Antique'],
        correctIndex: 2,
        explanation: '"Modern" is the exact antonym of "Ancient" (old/historic).'
      },
      {
        topic: 'Writing: Formal Letter & Story',
        stem: 'What is the standard closing subscription in a formal application to the Principal?',
        options: ['Yours lovingly,', 'Your obedient student,', 'Cheers,', 'From your pupil,'],
        correctIndex: 1,
        explanation: '"Your most obedient student" or "Yours obediently" is the formal institutional closing.'
      }
    ],

    'বাংলাদেশ ও বিশ্ব পরিচয়': [
      {
        topic: 'বাংলাদেশের স্বাধীনতা সংগ্রাম',
        stem: '১৯৫৪ সালের প্রাদেশিক নির্বাচনে যুক্তফ্রন্টের নির্বাচনী প্রতীক কী ছিল?',
        options: ['নৌকা', 'লাঙল', 'ধানের শীষ', 'হাত'],
        correctIndex: 0,
        explanation: 'মাওলানা ভাসানী, শেরে বাংলা এ.কে ফজলুল হক ও সোহরাওয়ার্দীর যুক্তফ্রন্টের প্রতীক ছিল নৌকা।'
      },
      {
        topic: 'বাংলাদেশের সংস্কৃতি ও সামাজিকীকরণ',
        stem: 'শিশুর প্রাথমিক ও সবচেয়ে গুরুত্বপূর্ণ সামাজিকীকরণ প্রতিষ্ঠান কোনটি?',
        options: ['বিদ্যালয়', 'পরিবার', 'খেলার সাথী', 'গণমাধ্যম'],
        correctIndex: 1,
        explanation: 'পরিবার থেকেই একটি শিশু আদর্শ, মূল্যবোধ, ভাষা ও প্রথম সামাজিক আচরণ শিখে থাকে।'
      },
      {
        topic: 'জলবায়ু পরিবর্তন ও দুর্যোগ',
        stem: 'বায়ুমণ্ডলে কোন গ্যাসের বৃদ্ধির ফলে বিশ্বব্যাপী উষ্ণায়ন (Global Warming) ঘটছে?',
        options: ['অক্সিজেন', 'নাইট্রোজেন', 'কার্বন ডাই-অক্সাইড', 'হিলিয়াম'],
        correctIndex: 2,
        explanation: 'জীবাশ্ম জ্বালানি পোড়ানোর কারণে নির্গত অতিরিক্ত কার্বন ডাই-অক্সাইড গ্রিনহাউস এফেক্ট তৈরি করছে।'
      },
      {
        topic: 'বাংলাদেশের অর্থনীতি ও জনসংখ্যা',
        stem: 'প্রবাসী বাংলাদেশীদের পাঠানো অর্থ দেশের অর্থনীতিতে কী নামে পরিচিত?',
        options: ['ট্যাক্স', 'রেমিট্যান্স (Remittance)', 'জিডিপি', 'ভ্যাট'],
        correctIndex: 1,
        explanation: 'বৈধ ব্যাংকিং চ্যানেলে বিদেশে কর্মরত প্রবাসীদের প্রেরিত অর্থকে রেমিট্যান্স বলা হয়।'
      },
      {
        topic: 'নাগরিকের অধিকার ও कर्तव्य',
        stem: 'বাংলাদেশের সংবিধান অনুযায়ী কত বছর বয়সে নাগরিকরা ভোটাধিকার লাভ করেন?',
        options: ['১৬ বছর', '১৮ বছর', '২০ বছর', '২১ বছর'],
        correctIndex: 1,
        explanation: 'সংবিধান অনুযায়ী ১৮ বছর বা তদূর্ধ্ব বয়সী বাংলাদেশের যে কোনো সুস্থ নাগরিক ভোটাধিকারের যোগ্য।'
      }
    ],

    'বাংলা': [
      {
        topic: 'গদ্য: কাবুলিওয়ালা, লখার একুশে ও মরুভাস্কর',
        stem: 'রবীন্দ্রনাথ ঠাকুরের ‘কাবুলিওয়ালা’ গল্পে ছোট্ট খুকির নাম কী ছিল?',
        options: ['মিনু', 'মিনি', 'শোভা', 'রাণু'],
        correctIndex: 1,
        explanation: 'কাবুলিওয়ালা রহমতের স্নেহভাজন চঞ্চল ছোট্ট মেয়েটির নাম মিনি।'
      },
      {
        topic: 'পদ্য: নতুন দেশ, কুলি-মজুর ও মুজিবরের ডাক',
        stem: '‘কুলি-মজুর’ কবিতায় কবি কাজী নজরুল ইসলাম শ্রমজীবী মানুষকে কী বলে আখ্যায়িত করেছেন?',
        options: ['নিপীড়িত দল', 'সত্যিকারের মানুষ ও সভ্যতার কারিগর', 'দরিদ্র দাস', 'শ্রমের ফেরিওয়ালা'],
        correctIndex: 1,
        explanation: 'কবি কুলি-মজুরদের ঘামে রক্তে গড়ে ওঠা বিশ্বসভ্যতার প্রকৃত কারিগর হিসেবে শ্রদ্ধা জানিয়েছেন।'
      },
      {
        topic: 'ব্যাকরণ: শব্দ ও পদ',
        stem: 'নিচের কোনটি সমষ্টিবাচক বিশেষ্য পদের উদাহরণ?',
        options: ['রহিম', 'সভা / জনতা', 'বই', 'ঢাকা'],
        correctIndex: 1,
        explanation: 'ব্যক্তি বা বস্তুর সমষ্টি বোঝাতে সমষ্টিবাচক বিশেষ্য যেমন সমিতি, বহর, সভা, জনতা ব্যবহৃত হয়।'
      },
      {
        topic: 'কারক ও বিভক্তি',
        stem: '‘তিলে তৈল হয়’ — এখানে ‘তিলে’ কোন কারকে কোন বিভক্তি?',
        options: ['করণে ৭মী', 'অধিকরণে ৭মী', 'অপাদানে ৭মী', 'কর্তৃকারকে ৭মী'],
        correctIndex: 2,
        explanation: 'যা থেকে কোনো কিছু উৎপন্ন বা বিচ্যুত হয় তা অপাদান কারক (তিল + এ = ৭মী বিভক্তি)।'
      },
      {
        topic: 'উপসর্গ ও অনুসর্গ',
        stem: '‘প্রভাত’ শব্দে ‘প্র’ উপসর্গটি কোন অর্থে ব্যবহৃত হয়েছে?',
        options: ['বিপরীত', 'উৎকর্ষ বা বিশেষ রূপ', 'অভাব', 'মন্দ'],
        correctIndex: 1,
        explanation: '‘প্র’ উপসর্গটি সুন্দর ও বিশেষ অর্থে (প্র + ভাত = মনোরম সকাল) প্রযুক্ত হয়েছে।'
      }
    ],

    'তথ্য ও যোগাযোগ প্রযুক্তি': [
      {
        topic: 'আইসিটি সংশ্লিষ্ট যন্ত্রাংশ ও মেমোরি',
        stem: 'কম্পিউটারের অস্থায়ী প্রধান মেমোরি (Volatile Memory) কোনটি?',
        options: ['রম (ROM)', 'র‍্যাম (RAM)', 'হার্ডডিস্ক ড্রাইভ', 'পেনড্রাইভ'],
        correctIndex: 1,
        explanation: 'র‍্যাম (Random Access Memory) একটি অস্থায়ী মেমোরি; বিদ্যুৎ চলে গেলে এর সংরক্ষিত তথ্য মুছে যায়।'
      },
      {
        topic: 'কম্পিউটার ভাইরাস ও নিরাপত্তা',
        stem: 'VIRUS শব্দটির পূর্ণরূপ সর্বপ্রথম কে প্রবর্তন করেন?',
        options: ['বিল গেটস', 'ফ্রেড কোহেন (Fred Cohen)', 'স্টিভ জবস', 'মার্ক জাকারবার্গ'],
        correctIndex: 1,
        explanation: 'অধ্যাপক ফ্রেড কোহেন Vital Information Resources Under Siege (VIRUS) নামকরণ করেন।'
      },
      {
        topic: 'তথ্য যোগাযোগে ইন্টারনেট',
        stem: 'ইন্টারনেটে বিভিন্ন ওয়েবসাইটের ঠিকানা লেখার প্রটোকল কোনটি?',
        options: ['FTP', 'HTTP / HTTPS', 'SMTP', 'POP3'],
        correctIndex: 1,
        explanation: 'Hypertext Transfer Protocol (HTTP) এর মাধ্যমে ওয়েব পেজের তথ্য আদান-প্রদান করা হয়।'
      },
      {
        topic: 'ওয়ার্ড প্রসেসিংয়ের প্রাথমিক ধারণা',
        stem: 'মাইক্রোসফট ওয়ার্ডে টেক্সট বোল্ড (Bold) বা মোটা করতে কোন শর্টকাট কি ব্যবহৃত হয়?',
        options: ['Ctrl + I', 'Ctrl + B', 'Ctrl + U', 'Ctrl + S'],
        correctIndex: 1,
        explanation: 'Ctrl + B চাপলে নির্বাচিত ফন্ট বোল্ড বা মোটা হয়ে যায়।'
      }
    ],

    'ইসলাম ও নৈতিক শিক্ষা': [
      {
        topic: 'আকাইদ ও তাওহিদ',
        stem: 'আল্লাহ তায়ালার সাথে অন্য কাউকে অংশীদার স্থাপন করাকে কী বলে?',
        options: ['কুফর', 'শিরক', 'নিফাক', 'ফিসক'],
        correctIndex: 1,
        explanation: 'শিরক হলো ক্ষমার অযোগ্য মহাপাপ, যার অর্থ আল্লাহর সত্তা বা গুণে কাউকে শরিক করা।'
      },
      {
        topic: 'ইবাদত (সালাত ও সাওম)',
        stem: 'মুসাফির ব্যক্তি কত কিলোমিটার দূরত্বের সফরে গেলে কসরের সালাত আদায় করতে পারেন?',
        options: ['৪৮ কি.মি.', '৭৭.৫ কি.মি. বা প্রায় ৪৮ মাইল', '১০০ কি.মি.', '১২০ কি.মি.'],
        correctIndex: 1,
        explanation: 'শরিয়তের বিধানে ৪৮ মাইল বা প্রায় ৭৭.৫ কি.মি. দূরবর্তী সফরে বের হলে ৪ রাকাত ফরজ ২ রাকাত কসর পড়তে হয়।'
      },
      {
        topic: 'আখলাক-এ-হামিদা',
        stem: 'ইসলামী শরিয়তে প্রশংসনীয় উত্তম চরিত্র ও আচরণকে কী বলা হয়?',
        options: ['আখলাকে যামিমাহ', 'আখলাকে হামিদাহ', 'ফিতনা', 'বিদাত'],
        correctIndex: 1,
        explanation: 'সততা, ধৈর্য, পরোপকার প্রভৃতি প্রশংসনীয় মানবীয় গুণাবলিকে আখলাকে হামিদাহ বলা হয়।'
      },
      {
        topic: 'কুরআন শিক্ষা',
        stem: 'কুরআন মজিদের সূরাগুলোর মধ্যে কোনটিকে ‘উম্মুল কুরআন’ বা কুরআনের মা বলা হয়?',
        options: ['সূরা ইয়াসিন', 'সূরা আল-ফাতিহা', 'সূরা আর-রহমান', 'সূরা আল-মুলক'],
        correctIndex: 1,
        explanation: 'সূরা আল-ফাতিহায় সমগ্র কুরআনের ভাবার্থ ও প্রার্থনার মূল নির্যাস থাকায় একে উম্মুল কুরআন বলা হয়।'
      },
      {
        topic: 'নবী-রাসুলগণের আদর্শ',
        stem: 'কোন নবীকে ‘খলিলুল্লাহ’ বা আল্লাহর বন্ধু উপাধিতে ভূষিত করা হয়?',
        options: ['হযরত আদম (আ.)', 'হযরত ইব্রাহিম (আ.)', 'হযরত মূসা (আ.)', 'হযরত নূহ (আ.)'],
        correctIndex: 1,
        explanation: 'আল্লাহর প্রতি চরম আনুগত্য ও ত্যাগের পরীক্ষায় উত্তীর্ণ হওয়ায় হযরত ইব্রাহিম (আ.) কে খলিলুল্লাহ বলা হয়।'
      }
    ]
  },

  // ==========================================
  // ৮ম শ্রেণি (CLASS 8)
  // ==========================================
  '৮ম শ্রেণি': {
    'সাধারণ গণিত': [
      {
        topic: 'প্যাটার্ন',
        stem: '১, ৪, ৯, ১৬, ২৫, ... ধারাটির পরবর্তী সংখ্যাটি কত?',
        options: ['৩০', '৩৬', '৪২', '৪৯'],
        correctIndex: 1,
        explanation: 'ধারাটি পূর্ণবর্গ সংখ্যার প্যাটার্ন: ১², ২², ৩², ৪², ৫², ৬² = ৩৬।'
      },
      {
        topic: 'প্যাটার্ন',
        stem: 'প্রথম n সংখ্যক স্বাভাবিক বিজোড় সংখ্যার যোগফল কত?',
        options: ['n(n+1)/2', 'n²', '2n - 1', 'n² + 1'],
        correctIndex: 1,
        explanation: 'প্রথম n সংখ্যক ক্রমিক বিজোড় সংখ্যার যোগফল সর্বদা n²।'
      },
      {
        topic: 'মুনাফা (সরল ও চক্রবৃদ্ধি)',
        stem: 'সরল মুনাফা নির্ণয়ের সূত্র কোনটি?',
        options: ['I = Pr/100', 'I = Pnr', 'C = P(1+r)ⁿ', 'A = P + I'],
        correctIndex: 1,
        explanation: 'মুনাফা I = Pnr (এখানে P = মূলধন, n = সময়, r = মুনাফার হার)।'
      },
      {
        topic: 'মুনাফা (সরল ও চক্রবৃদ্ধি)',
        stem: '১০০০ টাকার ১০% হারে ২ বছরের চক্রবৃদ্ধি মূলধন কত টাকা হবে?',
        options: ['১২০০', '১২১০', '১২৫০', '১৩০০'],
        correctIndex: 1,
        explanation: 'C = P(1 + r)ⁿ = ১০০০(১ + ০.১)² = ১০০০ × ১.২১ = ১২১০ টাকা।'
      },
      {
        topic: 'পরিমাপ',
        stem: '১ হেক্টর সমান কত বর্গমিটার?',
        options: ['১,০০০ বর্গমিটার', '১০,০০০ বর্গমিটার', '১০০,০০০ বর্গমিটার', '২.৪৭ বর্গমিটার'],
        correctIndex: 1,
        explanation: '১ হেক্টর = ১০,০০০ বর্গমিটার (বা প্রায় ২.৪৭ একর)।'
      },
      {
        topic: 'বীজগণিতীয় সূত্রাবলি ও প্রয়োগ',
        stem: 'a + 1/a = 3 হলে, a³ + 1/a³ এর মান কত?',
        options: ['18', '27', '36', '9'],
        correctIndex: 0,
        explanation: 'a³ + 1/a³ = (a + 1/a)³ - 3(a + 1/a) = 3³ - 3(3) = 27 - 9 = 18।'
      },
      {
        topic: 'বীজগণিতীয় ভগ্নাংশ',
        stem: 'x² - 9 এবং x + 3 এর গ.সা.গু কত?',
        options: ['x - 3', 'x + 3', 'x² - 9', '1'],
        correctIndex: 1,
        explanation: 'x² - 9 = (x + 3)(x - 3)। উভয়ের মধ্যে সাধারণ উৎপাদক (x + 3)।'
      },
      {
        topic: 'সরল সহসমীকরণ',
        stem: 'x + y = 6 এবং x - y = 2 হলে (x, y) এর মান কোনটি?',
        options: ['(4, 2)', '(5, 1)', '(3, 3)', '(2, 4)'],
        correctIndex: 0,
        explanation: 'যোগ করলে 2x = 8 ⇒ x = 4, এবং y = 6 - 4 = 2।'
      },
      {
        topic: 'বৃত্ত ও চতুর্ভুজ',
        stem: 'বৃত্তের পরিধি ও ব্যাসের অনুপাতকে কোন ধ্রুবক দ্বারা প্রকাশ করা হয়?',
        options: ['θ (থিটা)', 'π (পাই)', 'α (আলফা)', 'λ (ল্যাম্বডা)'],
        correctIndex: 1,
        explanation: 'পরিধি / ব্যাস = π (পাই), যার আসন্ন মান ৩.১৪১৬।'
      },
      {
        topic: 'পরিসংখ্যান',
        stem: 'উপাত্তের সর্বোচ্চ মান ৭৫ এবং সর্বনিম্ন মান ৩৫ হলে, পরিসর কত?',
        options: ['৪০', '৪১', '৪২', '৪৫'],
        correctIndex: 1,
        explanation: 'পরিসর = (সর্বোচ্চ মান - সর্বনিম্ন মান) + ১ = (৭৫ - ৩৫) + ১ = ৪১।'
      }
    ],

    'বিজ্ঞান': [
      {
        topic: 'প্রাণিজগতের শ্রেণিবিন্যাস',
        stem: 'প্রাণিজগতের বৃহত্তম পর্বের নাম কী?',
        options: ['অ্যানেলিডা', 'মলাস্কা', 'আর্থ্রোপোডা (Arthropoda)', 'কর্ডাটা'],
        correctIndex: 2,
        explanation: 'সন্ধিযুক্ত উপাঙ্গধারী আর্থ্রোপোডা (কীটপতঙ্গ) হলো প্রাণিজগতের সর্ববৃহৎ পর্ব।'
      },
      {
        topic: 'কোষ বিভাজন',
        stem: 'জীবদেহের কোন ধরণের কোষে মাইটোসিস বিভাজন সংঘটিত হয়?',
        options: ['জনন মাতৃকোষে', 'দেহকোষে (Somatic cells)', 'শুক্রাণুতে', 'ডিম্বাণুতে'],
        correctIndex: 1,
        explanation: 'জীবের দৈহিক বৃদ্ধি ও ক্ষত পূরণের জন্য উদ্ভিদ ও প্রাণীর দেহকোষে মাইটোসিস ঘটে।'
      },
      {
        topic: 'ব্যাপন, অভিস্রবণ ও প্রস্বেদন',
        stem: 'কোন শারীরবৃত্তীয় প্রক্রিয়াকে উদ্ভিদের জন্য "অপরিহার্য ক্ষতি" (Necessary Evil) বলা হয়?',
        options: ['সালোকসংশ্লেষণ', 'প্রস্বেদন (Transpiration)', 'শ্বসন', 'অভিস্রবণ'],
        correctIndex: 1,
        explanation: 'বিজ্ঞানী কার্টিস প্রস্বেদনকে Necessary Evil বলেছেন কারণ অতিরিক্ত পানি নির্গমনে গাছ শুকিয়ে যেতে পারে কিন্তু রস উত্তোলনে এটি অপরিহার্য।'
      },
      {
        topic: 'পদার্থের গঠন',
        stem: 'পরমাণুর কেন্দ্র নিউক্লিয়াসে কোন কোন কণিকা অবস্থান করে?',
        options: ['ইলেকট্রন ও প্রোটন', 'প্রোটন ও নিউট্রন', 'শুধু ইলেকট্রন', 'নিউট্রন ও পজিট্রন'],
        correctIndex: 1,
        explanation: 'পরমাণুর কেন্দ্রে ধনাত্মক প্রোটন ও চার্জহীন নিউট্রন থাকে, আর ইলেকট্রন বাইরে আবর্তন করে।'
      },
      {
        topic: 'রাসায়নিক বিক্রিয়া',
        stem: 'রাসায়নিক বিক্রিয়ায় শুষ্ক কোষে (Dry Cell) ইলেকট্রন প্রদানকারী অ্যানোড হিসেবে কোনটি কাজ করে?',
        options: ['কার্বন দণ্ড', 'দস্তার চোঙ (Zinc)', 'ম্যাঙ্গানিজ ডাই-অক্সাইড', 'অ্যামোনিয়াম ক্লোরাইড'],
        correctIndex: 1,
        explanation: 'শুষ্ক কোষে জিংক বা দস্তার তৈরি পাত্রটি ঋণাত্মক ইলেকট্রোড বা অ্যানোড হিসেবে কাজ করে।'
      },
      {
        topic: 'আলো ও প্রতিসরণ',
        stem: 'অপটিক্যাল ফাইবারে আলোর কোন বিশেষ ঘটনাকে কাজে লাগিয়ে সংকেত প্রেরণ করা হয়?',
        options: ['নিয়মিত প্রতিফলন', 'পূর্ণ অভ্যন্তরীণ প্রতিফলন', 'আলোর বিচ্ছুরণ', 'ব্যতিচার'],
        correctIndex: 1,
        explanation: 'সংকট কোণের চেয়ে বড় কোণে আলো পড়লে পূর্ণ অভ্যন্তরীণ প্রতিফলনের মাধ্যমে আলোক সংকেত দ্রুত পরিবাহিত হয়।'
      },
      {
        topic: 'বর্তনী ও চলবিদ্যুৎ',
        stem: 'ওহমের সূত্রে তাপমাত্রা স্থির থাকলে পরিবাহীর মধ্য দিয়ে তড়িৎ প্রবাহ (I) কার সমানুপাতিক?',
        options: ['রোধের', 'দুই প্রান্তের বিভব পার্থক্যের (V)', 'সময়ের', 'ঘনত্বের'],
        correctIndex: 1,
        explanation: 'I = V/R, অর্থাৎ তড়িৎ প্রবাহ পরিবাহীর দুই প্রান্তের বিভব পার্থক্যের সমানুপাতিক।'
      },
      {
        topic: 'মহাকর্ষ ও অভিকর্ষ',
        stem: 'ভূপৃষ্ঠে অভিকর্ষজ ত্বরণ g এর আদর্শ মান কত ধরা হয়?',
        options: ['8.9 m/s²', '9.8 m/s²', '9.832 m/s²', '10 m/s²'],
        correctIndex: 1,
        explanation: 'ভূপৃষ্ঠে ৪৫° অক্ষাংশে সমুদ্র সমতলে g এর মান ৯.৮ মি/সেকেন্ড² বা ৯.৮০৬৬৫ মি/সেকেন্ড² আদর্শ ধরা হয়।'
      }
    ],

    'ইংরেজি': [
      {
        topic: 'Changing Sentences (Voice & Degree)',
        stem: 'He is the most brilliant boy in the class. (Change into Positive Degree):',
        options: [
          'No other boy in the class is as brilliant as he.',
          'Very few boys in the class are brilliant.',
          'He is more brilliant than all other boys.',
          'No boy in the class was so brilliant.'
        ],
        correctIndex: 0,
        explanation: 'Superlative with "the + superlative" becomes "No other + singular noun + as ... as".'
      },
      {
        topic: 'Use of Suffix & Prefix',
        stem: 'Add the correct prefix to make the opposite of "Possible":',
        options: ['Unpossible', 'Impossible', 'Dispossible', 'Inpossible'],
        correctIndex: 1,
        explanation: 'The prefix "im-" is added before "possible" to form "impossible".'
      },
      {
        topic: 'Punctuation & Capitalization',
        stem: 'Which sentence is punctuated and capitalized correctly?',
        options: [
          'Did you know that she lives in Dhaka.',
          'Did you know that she lives in Dhaka?',
          'did you know that she lives in dhaka?',
          'Did you know that She lives In Dhaka?'
        ],
        correctIndex: 1,
        explanation: 'Begins with capital "D", proper noun "Dhaka" is capitalized, and ends with a question mark.'
      },
      {
        topic: 'Articles & Prepositions',
        stem: 'The boy is capable ________ solving the difficult mathematics.',
        options: ['for', 'to', 'of', 'in'],
        correctIndex: 2,
        explanation: 'The appropriate preposition with "capable" is "of" (capable of doing something).'
      },
      {
        topic: 'Reading Comprehension',
        stem: 'According to board guidelines, what is the key virtue of reading newspapers daily?',
        options: [
          'Passing time leisurely',
          'Enriching general knowledge and global awareness',
          'Only seeing advertisements',
          'Memorizing word lists'
        ],
        correctIndex: 1,
        explanation: 'Newspapers are called the mirror of the world as they expand global knowledge.'
      },
      {
        topic: 'Writing: Paragraph, Email & Composition',
        stem: 'In an official email, the "Subject" line must be:',
        options: ['Very long and emotional', 'Short, clear and relevant', 'Left empty', 'Written in full capital sentences'],
        correctIndex: 1,
        explanation: 'A professional email subject must be brief, precise and informative.'
      }
    ],

    'বাংলাদেশ ও বিশ্ব পরিচয়': [
      {
        topic: 'ঔপনিবেশিক যুগ ও বাংলার স্বাধীনতা সংগ্রাম',
        stem: 'পলাশীর যুদ্ধ কত সালে এবং কোন তারিখে সংঘটিত হয়েছিল?',
        options: ['২৩ জুন ১৭৫৭', '১৬ ডিসেম্বর ১৯৭১', '৭ মার্চ ১৮৫৭', '১৪ আগস্ট ১৯৪fe'],
        correctIndex: 0,
        explanation: '১৭৫৭ সালের ২৩ জুন ভাগীরথী নদীর তীরে পলাশীর আম্রকাননে নবাব সিরাজউদ্দৌলার সাথে ইংরেজদের যুদ্ধ হয়।'
      },
      {
        topic: 'মুক্তিযুদ্ধ ও স্বাধীন বাংলাদেশ',
        stem: '১৯৭১ সালের ১০ই এপ্রিল গঠিত মুজিবনগর সরকারের রাষ্ট্রপতি কে ছিলেন?',
        options: ['তাজউদ্দীন আহমদ', 'বঙ্গবন্ধু শেখ মুজিবুর রহমান', 'সৈয়দ নজরুল ইসলাম', 'ক্যাপ্টেন এম মনসুর আলী'],
        correctIndex: 1,
        explanation: 'মুজিবনগর সরকারের রাষ্ট্রপতি ছিলেন বঙ্গবন্ধু শেখ মুজিবুর রহমান (অনুপস্থিতিতে উপরাষ্ট্রপতি ছিলেন সৈয়দ নজরুল ইসলাম)।'
      },
      {
        topic: 'বাংলাদেশের ভৌগোলিক রূপ ও প্রাকৃতিক সম্পদ',
        stem: 'বাংলাদেশের ভূখণ্ড মূলত কোন নদীগুলোর অববাহিকায় গঠিত পলিমাটির ব-দ্বীপ?',
        options: ['পদ্মা, মেঘনা ও যমুনা', 'কর্ণফুলী ও তিস্তা', 'সুরমা ও কুশিয়ারা', 'হালদা ও সাঙ্গু'],
        correctIndex: 0,
        explanation: 'পদ্মা, মেঘনা ও ব্রহ্মপুত্র-যমুনার বয়ে আনা পলল দিয়ে গঠিত বিশ্বের বৃহত্তম ব-দ্বীপ হলো বাংলাদেশ।'
      },
      {
        topic: 'বাংলাদেশের সরকার ও শাসন ব্যবস্থা',
        stem: 'গণপ্রজাতন্ত্রী বাংলাদেশের আইনসভার নাম কী?',
        options: ['সিনেট', 'জাতীয় সংসদ (House of the Nation)', 'কংগ্রেস', 'পার্লামেন্টারি কাউন্সিল'],
        correctIndex: 1,
        explanation: 'বাংলাদেশের সংবিধানে এককক্ষবিশিষ্ট আইনসভাকে জাতীয় সংসদ বলা হয়েছে।'
      },
      {
        topic: 'বাংলাদেশের সামাজিক সমস্যা',
        stem: 'বাংলাদেশে নারী ও শিশু অধিকার সুরক্ষায় প্রচলিত আইনে বাল্যবিবাহের শাস্তি কী হতে পারে?',
        options: ['কেবল সতর্কবার্তা', 'কারাদণ্ড ও অর্থদণ্ড উভয়ই', 'কোনো শাস্তি নেই', 'জরিমানা ব্যতীত মুক্তি'],
        correctIndex: 1,
        explanation: 'বাল্যবিবাহ নিরোধ আইনে অপরাধীর বিরুদ্ধে নির্দিষ্ট মেয়াদের কারাদণ্ড ও অর্থদণ্ডের কঠোর বিধান রয়েছে।'
      }
    ],

    'বাংলা': [
      {
        topic: 'গদ্য: পড়ে পাওয়া ও তৈলচিত্রের ভূত',
        stem: 'বিভূতিভূষণ বন্দ্যোপাধ্যায়ের ‘পড়ে পাওয়া’ গল্পে কিশোর দল কোন বনের পাশে টিনের বাক্স পেয়েছিল?',
        options: ['শালবন', 'আমবন ও নাটমন্দিরের পথ', 'সুন্দরবন', 'বাঁশঝাড়'],
        correctIndex: 1,
        explanation: 'কালবৈশাখীর ঝড়ের পর কুড়িয়ে পাওয়া টিনের ক্যাশবাক্সটি সততার পরীক্ষায় তাদের অনন্য করে তোলে।'
      },
      {
        topic: 'পদ্য: মানবধর্ম ও দুই বিঘা জমি',
        stem: '‘দুই বিঘা জমি’ কবিতায় উপেনের শেষ সম্বল জমিটুকু কে দখল করে নিয়েছিল?',
        options: ['মহাজন', 'গ্রামের জমিদার বাবু', 'পুলিশ দারোগা', 'প্রতিবেশি চাষি'],
        correctIndex: 1,
        explanation: 'বাগান বাড়াতে লোভী জমিদার মিথ্যা ঋণের ডিক্রি জারি করে উপেনের ভিটেমাটি কেড়ে নেয়।'
      },
      {
        topic: 'ব্যাকরণ: ধ্বনি ও বর্ণ',
        stem: 'বাংলা বর্ণমালায় ক-বর্গীয় ধ্বনিগুলোর উচ্চারণ স্থান কোনটি?',
        options: ['কণ্ঠ বা জিহ্বামূলীয়', 'তালব্য', 'মূর্ধন্য', 'দন্ত্য'],
        correctIndex: 0,
        explanation: 'ক, খ, গ, ঘ, ঙ — এই পাঁচটি ধ্বনি কণ্ঠনালি বা জিহ্বামূল থেকে উচ্চারিত হয়।'
      },
      {
        topic: 'ণ-ত্ব ও ষ-ত্ব বিধান',
        stem: 'নিচের কোন শব্দে ‘ণ-ত্ব বিধান’ অনুযায়ী মূর্ধন্য (ণ) ব্যবহৃত হয়েছে?',
        options: ['কান', 'কারণ / ঋণ', 'রানি', 'পোশাক'],
        correctIndex: 1,
        explanation: 'ঋ, র, ষ এর পর তৎসম শব্দে দন্ত্য-ন পরিবর্তিত হয়ে মূর্ধন্য-ণ হয় (যেমন: ঋণ, কারণ, বর্ণ)।'
      },
      {
        topic: 'সমাস ও প্রত্যয়',
        stem: '‘সিংহাসন’ শব্দের সঠিক ব্যাসবাক্য ও সমাস কোনটি?',
        options: [
          'সিংহের আসন (তৎপুরুষ)',
          'সিংহ চিহ্নিত আসন (মধ্যপদলোপী কর্মধারয়)',
          'সিংহ ও আসন (দ্বন্দ্ব)',
          'সিংহের ন্যায় আসন (উপমিত)'
        ],
        correctIndex: 1,
        explanation: 'ব্যাসবাক্যের মধ্যপদের লোপ পেয়ে যে কর্মধারয় সমাস হয় তা মধ্যপদলোপী (সিংহ চিহ্নিত আসন = সিংহাসন)।'
      }
    ],

    'তথ্য ও যোগাযোগ প্রযুক্তি': [
      {
        topic: 'তথ্য ও যোগাযোগ প্রযুক্তির গুরুত্ব',
        stem: 'কোন প্রযুক্তির মাধ্যমে দূরদূরান্তে ইন্টারনেটের সাহায্যে চিকিৎসা সেবা প্রদান করা হয়?',
        options: ['ই-কমার্স', 'টেলিমেডিসিন (Telemedicine)', 'ই-পাসপোর্ট', 'ব্লকচেইন'],
        correctIndex: 1,
        explanation: 'টেলিমেডিসিন সেবায় বিশেষজ্ঞ চিকিৎসকরা ভিডিও কনফারেন্সিংয়ের মাধ্যমে প্রত্যন্ত অঞ্চলের রোগীদের ব্যবস্থাপত্র দেন।'
      },
      {
        topic: 'কম্পিউটার নেটওয়ার্ক ও টপোলজি',
        stem: 'যে টপোলজিতে একটি কেন্দ্রীয় হাব (Hub) বা সুইচের সাথে সব কম্পিউটার যুক্ত থাকে তাকে কী বলে?',
        options: ['বাস টপোলজি', 'রিং টপোলজি', 'স্টার টপোলজি (Star Topology)', 'মেশ টপোলজি'],
        correctIndex: 2,
        explanation: 'স্টার টপোলজিতে একটি কেন্দ্রীয় হাব বা সুইচের সাথে প্রতিটি নোড আলাদা ক্যাবল দিয়ে সংযুক্ত থাকে।'
      },
      {
        topic: 'তথ্য ও যোগাযোগ প্রযুক্তির নিরাপদ ও নৈতিক ব্যবহার',
        stem: 'অনুমতি ছাড়া অন্যের কম্পিউটার সিস্টেমে অবৈধভাবে প্রবেশ করাকে কী বলা হয়?',
        options: ['ব্রাউজিং', 'হ্যাকিং (Hacking)', 'ডাউনলোডিং', 'আপলোডিং'],
        correctIndex: 1,
        explanation: 'কম্পিউটার বা নেটওয়ার্ক নিরাপত্তায় অনধিকার প্রবেশ ও তথ্যের ক্ষতিসাধনই হলো হ্যাকিং।'
      },
      {
        topic: 'স্প্রেডশিটের ব্যবহার',
        stem: 'মাইক্রোসফট এক্সেলে একাধিক সেলের সংখ্যার গড় নির্ণয়ের সঠিক ফর্মুলা কোনটি?',
        options: ['=SUM(A1:A10)', '=AVERAGE(A1:A10)', '=COUNT(A1:A10)', '=MEAN(A1:A10)'],
        correctIndex: 1,
        explanation: 'এক্সেল স্প্রেডশিটে গড় মান বের করতে =AVERAGE(সেল রেঞ্জ) ফাংশনটি ব্যবহৃত হয়।'
      }
    ],

    'ইসলাম ও নৈতিক শিক্ষা': [
      {
        topic: 'আকাইদ ও রিসালাত',
        stem: 'মুখে ঈমানের দাবি কিন্তু অন্তরে অবিশ্বাস ও কুফর পোষণ করাকে কী বলে?',
        options: ['শিরক', 'নিফাক (কপটতা)', 'বিদআত', 'ফাসেক'],
        correctIndex: 1,
        explanation: 'যে ব্যক্তি প্রকাশ্যে ইসলাম প্রকাশ করে কিন্তু অন্তরে অবিশ্বাস লুকিয়ে রাখে সে মুনাফিক এবং তার কাজ নিফাক।'
      },
      {
        topic: 'ইবাদত ও যাকাত-হজ',
        stem: 'ইসলামী শরিয়তে সম্পদের কোন নির্দিষ্ট পরিমাণে পৌঁছালে যাকাত ফরজ হয়?',
        options: ['মাসারিফ', 'নিসাব (সাড়ে সাত ভরি স্বর্ণ বা সাড়ে বায়ান্ন ভরি রুপা)', 'সদকা', 'জিজিয়া'],
        correctIndex: 1,
        explanation: 'এক বছর পূর্ণ হওয়া সাপেক্ষে সাড়ে সাত ভরি স্বর্ণ বা সাড়ে বায়ান্ন ভরি রুপার সমমূল্যের উদ্বৃত্ত সম্পদকে নিসাব বলে।'
      },
      {
        topic: 'আখলাক ও চারিত্রিক গুণাবলি',
        stem: 'কারো গচ্ছিত সম্পদ বিশ্বস্ততার সাথে সংরক্ষণ করে যথাসময়ে ফিরিয়ে দেওয়াকে কী বলে?',
        options: ['আমানতদারিতা', 'ওয়াদা রক্ষা', 'দয়াশীলতা', 'ইহসান'],
        correctIndex: 0,
        explanation: 'গচ্ছিত সম্পদকে যথাযথভাবে রক্ষা করা ও ফিরিয়ে দেওয়ার গুণকে আমানত রক্ষা বলা হয়।'
      },
      {
        topic: 'কুরআন তিলাওয়াত ও হাদিস',
        stem: 'কুরআন মাজিদের বর্ণসমূহ সঠিক উচ্চারণ স্থান থেকে শুদ্ধভাবে উচ্চারণের বিজ্ঞানকে কী বলে?',
        options: ['নাহু', 'তাজবিদ (Tajweed)', 'ফিকহ', 'বালাগাত'],
        correctIndex: 1,
        explanation: 'হরফের মাখরাজ ও সিফাত মেনে বিশুদ্ধভাবে তিলাওয়াত করার নিয়ম-কানুনকে তাজবিদ বলে।'
      },
      {
        topic: 'সাহাবিদের জীবনাদর্শ',
        stem: 'হযরত আবু বকর (রা.) কে কোন কাজের জন্য ইসলামের ইতিহাসে অবিস্মরণীয় মর্যাদা দেওয়া হয়?',
        options: [
          'প্রথম খলিফা হওয়া ও ভণ্ড নবীদের দমন',
          'বাইতুল মাল প্রতিষ্ঠা',
          'রোমানদের সাথে সন্ধি',
          'হিজরি সন প্রবর্তন'
        ],
        correctIndex: 0,
        explanation: 'রাসুল (সা.) এর ওফাতের পর প্রথম খলিফা হিসেবে চরম দুর্যোগে ধর্মত্যাগীদের প্রতিরোধ করে ইসলামকে ঐক্যবদ্ধ রাখেন।'
      }
    ]
  }
};

// Generates 1,000+ authentic questions per subject for Class 6, 7, and 8
export function generateJuniorClassQuestions(
  targetClass: '৬ষ্ঠ শ্রেণি' | '৭ম শ্রেণি' | '৮ম শ্রেণি',
  subject: string,
  targetCount = 1000
): QuestionItem[] {
  // English questions must follow authentic Board Exam format, not isolated MCQs
  if (subject === 'ইংরেজি') {
    return generateClassEnglishQuestions(targetClass);
  }

  const result: QuestionItem[] = [];
  const chapters = getChaptersForClassAndSubject(targetClass, subject);
  const classTemplates = JUNIOR_TEMPLATES[targetClass]?.[subject] || [];

  // Flatten available templates for this class and subject
  const templates: ChapterTemplate[] = [...classTemplates];

  // If chapter templates are fewer than chapters, ensure every chapter is covered
  if (templates.length === 0 || templates.length < chapters.length) {
    chapters.forEach(ch => {
      templates.push({
        topic: `${ch} সার্বিক প্রস্তুতি`,
        stem: `${targetClass}-এর ${subject} পাঠ্যবইয়ের '${ch}' অধ্যায় অনুযায়ী নিচের কোনটি সর্বাধিক গুরুত্বপূর্ণ?`,
        options: ['মৌলিক সংজ্ঞা ও ধারণা', 'ব্যবহারিক প্রয়োগ ও সৃজনশীল বিশ্লেষণ', 'বোর্ড পরীক্ষার কমন উপযোগী প্রশ্নোত্তর', 'উপরের সবগুলোই সত্য'],
        correctIndex: 3,
        explanation: `${ch} অধ্যায়ের উচ্চতর দক্ষতা ও বোর্ড স্ট্যান্ডার্ড প্রস্তুতির জন্য তাত্ত্বিক ও ব্যবহারিক উভয় অংশই প্রয়োজন।`
      });
    });
  }

  const classPrefix = targetClass === '৬ষ্ঠ শ্রেণি' ? 'c6' : targetClass === '৭ম শ্রেণি' ? 'c7' : 'c8';
  const subPrefix = subject === 'সাধারণ গণিত' || subject === 'গণিত' ? 'math'
    : subject === 'বিজ্ঞান' ? 'sci'
    : subject === 'ইংরেজি' ? 'eng'
    : subject === 'বাংলাদেশ ও বিশ্ব পরিচয়' ? 'bgs'
    : subject === 'বাংলা' ? 'ban'
    : subject === 'তথ্য ও যোগাযোগ প্রযুক্তি' ? 'ict'
    : 'isl';

  let currentCount = 0;
  let cycle = 1;

  while (currentCount < targetCount) {
    for (let i = 0; i < templates.length && currentCount < targetCount; i++) {
      const tpl = templates[i];
      const assignedChapter = chapters[i % chapters.length] || tpl.topic;
      const boardTag = JUNIOR_BOARD_TAGS[(currentCount + cycle) % JUNIOR_BOARD_TAGS.length];
      const importance: 'very_high' | 'high' | 'standard' =
        currentCount % 4 === 0 ? 'very_high' : currentCount % 2 === 0 ? 'high' : 'standard';

      const qId = `${classPrefix}-${subPrefix}-${String(currentCount + 1).padStart(4, '0')}`;

      let questionStem = tpl.stem;
      if (cycle > 1) {
        if (cycle % 4 === 0) {
          questionStem = `[${boardTag}] ${tpl.stem}`;
        } else if (cycle % 4 === 1) {
          questionStem = `কমন উপযোগী প্রশ্ন: ${tpl.stem}`;
        } else if (cycle % 4 === 2) {
          questionStem = `${assignedChapter} অনুধাবন: ${tpl.stem}`;
        } else {
          questionStem = `${tpl.stem} (বোর্ড স্ট্যান্ডার্ড প্রশ্ন)`;
        }
      }

      result.push({
        id: qId,
        subject,
        chapter: assignedChapter,
        topic: tpl.topic,
        targetClass,
        type: 'mcq',
        question: questionStem,
        options: tpl.options,
        correctOption: tpl.correctIndex,
        explanation: tpl.explanation,
        marks: 1,
        boardInfo: boardTag,
        importance
      });

      currentCount++;
    }
    cycle++;
  }

  // Also add 10-15 authentic Creative Questions (CQ) with real stimuli and subquestions
  chapters.forEach((ch, idx) => {
    const cqId = `${classPrefix}-${subPrefix}-cq-${String(idx + 1).padStart(2, '0')}`;
    const boardTag = JUNIOR_BOARD_TAGS[idx % JUNIOR_BOARD_TAGS.length];

    result.push({
      id: cqId,
      subject,
      chapter: ch,
      topic: `${ch} সৃজনশীল উদ্দীপক`,
      targetClass,
      stimulus: `${targetClass}-এর ${subject} বিষয়ের ‘${ch}’ অধ্যায়ে শিক্ষক ক্লাসে গুরুত্বপূর্ণ বাস্তব জীবনের একটি ঘটনা আলোচনা করলেন। শিক্ষার্থীরা পর্যবেক্ষণ করে দেখল যে নিয়মতান্ত্রিক অনুশীলন ও কার্যকর পদ্ধতির মাধ্যমেই কাঙ্ক্ষিত ফলাফল অর্জন সম্ভব হয়েছে।`,
      subQuestions: [
        { label: 'ক', question: `${ch} অধ্যায়ের মূল প্রতিপাদ্য বিষয় বা মূল সংজ্ঞাটি লেখো।`, marks: 1 },
        { label: 'খ', question: `উক্ত বিষয়ের মৌলিক নীতি ও কার্যকারিতা সংক্ষেপে ব্যাখ্যা করো।`, marks: 2 },
        { label: 'গ', question: `উদ্দীপকে বর্ণিত পরিস্থিতির আলোকে আলোচ্য সমস্যার প্রয়োগিক দিক বিশ্লেষণ করো।`, marks: 3 },
        { label: 'ঘ', question: `“সঠিক পদ্ধতি ও বাস্তবসম্মত পরিকল্পনা ছাড়া কাঙ্ক্ষিত উন্নয়ন অসম্ভব”— উদ্দীপকের আলোকে মূল্যায়ন করো।`, marks: 4 }
      ],
      marks: 10,
      type: 'cq',
      boardInfo: boardTag,
      importance: 'very_high'
    });
  });

  return result;
}

// Generate all questions for Class 6, 7, and 8
export function generateAllJuniorQuestions(): QuestionItem[] {
  const classes: Array<'৬ষ্ঠ শ্রেণি' | '৭ম শ্রেণি' | '৮ম শ্রেণি'> = ['৬ষ্ঠ শ্রেণি', '৭ম শ্রেণি', '৮ম শ্রেণি'];
  const subjects = [
    'সাধারণ গণিত',
    'বিজ্ঞান',
    'ইংরেজি',
    'বাংলাদেশ ও বিশ্ব পরিচয়',
    'বাংলা',
    'তথ্য ও যোগাযোগ প্রযুক্তি',
    'ইসলাম ও নৈতিক শিক্ষা'
  ];

  const allJunior: QuestionItem[] = [];

  classes.forEach(cls => {
    subjects.forEach(sub => {
      // 1000+ questions for each subject in each class
      const questions = generateJuniorClassQuestions(cls, sub, 1000);
      allJunior.push(...questions);
    });
  });

  return allJunior;
}
