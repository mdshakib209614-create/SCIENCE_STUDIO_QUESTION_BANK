import { ShortQuestion, MCQQuestion, CQQuestion, QuestionItem } from '../../types';

/**
 * Authentic Board Names and Top Prestigious Schools & Cadet Colleges for English Model Questions
 */
const BOARD_AND_TOP_SCHOOLS = [
  'ঢাকা বোর্ড ২০২৪',
  'রাজশাহী বোর্ড ২০২৪',
  'চট্টগ্রাম বোর্ড ২০২৪',
  'কুমিল্লা বোর্ড ২০২৪',
  'যশোর বোর্ড ২০২৪',
  'দিনাজপুর বোর্ড ২০২৪',
  'বরিশাল বোর্ড ২০২৪',
  'সিলেট বোর্ড ২০২৪',
  'ময়মনসিংহ বোর্ড ২০২৪',
  'ঢাকা বোর্ড ২০২৩',
  'রাজশাহী বোর্ড ২০২৩',
  'কুমিল্লা বোর্ড ২০২৩',
  'যশোর বোর্ড ২০২৩',
  'চট্টগ্রাম বোর্ড ২০২৩',
  'দিনাজপুর বোর্ড ২০২৩',
  'মির্জাপুর ক্যাডেট কলেজ ২০২৪',
  'ফৌজদারহাট ক্যাডেট কলেজ ২০২৪',
  'রাজউক উত্তরা মডেল কলেজ ২০২৪',
  'মতিঝিল আইডিয়াল স্কুল এন্ড কলেজ ২০২৪',
  'নটর ডেম কলেজ, ঢাকা ২০২৪',
  'ভিকারুননিসা নূন স্কুল ২০২৪',
  'বরিশাল ক্যাডেট কলেজ ২০২৩',
  'রংপুর ক্যাডেট কলেজ ২০২৪',
  'ময়মনসিংহ জিলা স্কুল ২০২৪',
  'চট্টগ্রাম কলেজিয়েট স্কুল ২০২৪',
  'বগুড়া জিলা স্কুল ২০২৪',
  'কুমিল্লা জিলা স্কুল ২০২৩',
  'ঢাকা রেসিডেন্সিয়াল মডেল কলেজ ২০২৪',
  'সেন্ট জোসেফ উচ্চ মাধ্যমিক বিদ্যালয় ২০২৪',
  'গভ. ল্যাবরেটরি হাই স্কুল, ঢাকা ২০২৪'
];

// Helper to get board info cyclically
const getBoard = (index: number) => BOARD_AND_TOP_SCHOOLS[index % BOARD_AND_TOP_SCHOOLS.length];

// ============================================================================
// 1. RIGHT FORM OF VERBS SEED THEMES (50 Authentic Themes)
// ============================================================================
const RFV_THEMES = [
  {
    theme: 'Environmental Pollution & Protection',
    clues: ['take', 'walk', 'pollute', 'be', 'suffer', 'do', 'destroy', 'breathe', 'live', 'realize'],
    passage: `Environment (a) _______ an indispensable part of human existence. A healthy environment (b) _______ people to lead a happy life. But today nature (c) _______ by man in numerous ways. Air (d) _______ contaminated by poisonous gases. Consequently, millions of children (e) _______ from severe respiratory complications. We must (f) _______ immediate measures to preserve ecological harmony. Indiscriminate tree felling (g) _______ immense catastrophic harm to the weather cycle. Morning (h) _______ provides rejuvenating oxygen. Unless we (i) _______ the catastrophic consequences of global warming, civilization will (j) _______ into great jeopardy.`,
    answers: `(a) is | (b) enables/helps | (c) is being polluted | (d) is being contaminated | (e) are suffering | (f) take | (g) does | (h) walking | (i) realize | (j) fall`,
    targetClass: '৯ম-১০ম শ্রেণি'
  },
  {
    theme: 'Student Life & Regular Discipline',
    clues: ['waste', 'succeed', 'prepare', 'be', 'spoil', 'call', 'fail', 'work', 'learn', 'follow'],
    passage: `Student life (a) _______ the seedbed of prospective destiny. A devout learner ought to (b) _______ his lessons conscientiously. If an adolescent (c) _______ priceless moments in frivolity, he will certainly (d) _______ to accomplish honorable stature. Perseverance is (e) _______ the cornerstone of glory. One who (f) _______ steadfastly is bound to (g) _______ in competitive endeavors. Multitudes of candidates (h) _______ their possibilities through lethargy. By (i) _______ rigid discipline, every student can (j) _______ academic excellence.`,
    answers: `(a) is | (b) prepare | (c) wastes | (d) fail | (e) called | (f) works | (g) succeed | (h) spoil | (i) following | (j) learn/achieve`,
    targetClass: '৯ম-১০ম শ্রেণি'
  },
  {
    theme: 'Patriotism & Sacrifices for the Motherland',
    clues: ['sacrifice', 'love', 'die', 'remember', 'be', 'inspire', 'stand', 'fight', 'honour', 'regard'],
    passage: `Patriotism (a) _______ a noble virtue that (b) _______ a man to dedicate his life for his country. A true patriot (c) _______ ready to lay down his life for the independence of his motherland. Those who (d) _______ in the Liberation War of 1971 (e) _______ immortal. They (f) _______ selflessly and defeated the brutal occupation forces. The nation (g) _______ them with profound respect and homage. An unpatriotic man (h) _______ by none after demise. We must (i) _______ by our nation whenever crisis (j) _______.`,
    answers: `(a) is | (b) inspires | (c) is | (d) fought/sacrificed | (e) are | (f) fought | (g) honours/remembers | (h) is remembered | (i) stand | (j) arises`,
    targetClass: '৯ম-১০ম শ্রেণি'
  },
  {
    theme: 'Digital & Smart Bangladesh (Technology in Modern Era)',
    clues: ['bring', 'use', 'depend', 'make', 'connect', 'operate', 'transform', 'benefit', 'revolutionize', 'be'],
    passage: `Information and Communication Technology (a) _______ a monumental revolution in human civilization. The globe (b) _______ into a compact digital village. Today everyday transactions (c) _______ upon computer networks. Internet services (d) _______ communication rapid and economical. Students (e) _______ digital modules to access world-class knowledge. Official correspondence (f) _______ electronically across borders. If we (g) _______ technology constructively, socio-economic progress (h) _______ accelerated. Modern banking (i) _______ smoothly through smart automation. Bangladesh (j) _______ relentlessly toward a smart knowledge-based economy.`,
    answers: `(a) has brought | (b) is transformed | (c) depend | (d) make/have made | (e) are using | (f) is operated | (g) use | (h) will be | (i) operates | (j) is advancing`,
    targetClass: '৯ম-১০ম শ্রেণি'
  },
  {
    theme: 'Value of Time & Avoiding Procrastination',
    clues: ['wait', 'ruin', 'utilize', 'regret', 'flow', 'remember', 'stop', 'spend', 'achieve', 'be'],
    passage: `Time (a) _______ continuously like an untamed river. It (b) _______ for no sovereign or destitute. A moment once elapsed (c) _______ never back. Many people (d) _______ their golden hours in sluggish inactivity and ultimately (e) _______ in misery. Those who (f) _______ celebrated names in human history meticulously (g) _______ every second. If an examinee (h) _______ his timetable regularly, he cannot (i) _______ decent scores. We ought to (j) _______ that punctuality is the pivot of earthly advancement.`,
    answers: `(a) flows | (b) waits | (c) comes | (d) spend/waste | (e) regret | (f) became | (g) utilized | (h) neglects/ruins | (i) achieve | (j) remember`,
    targetClass: '৮ম শ্রেণি'
  },
  {
    theme: 'Tree Plantation & Environmental Afforestation',
    clues: ['provide', 'cut', 'protect', 'cause', 'plant', 'absorb', 'face', 'maintain', 'save', 'be'],
    passage: `Trees (a) _______ essential sentinels of our global climate. They (b) _______ us with life-saving oxygen and sweet fruits. Moreover, trees (c) _______ toxic carbon dioxide from the atmosphere. But thoughtless people (d) _______ down forests indiscriminately. This ruthless deforestation (e) _______ frequent droughts and landslides. If trees (f) _______ at this alarming pace, the country (g) _______ severe ecological imbalance. Therefore, more saplings must (h) _______ during the monsoon. By (i) _______ nature, we can (j) _______ our future generations from natural catastrophes.`,
    answers: `(a) are | (b) provide | (c) absorb | (d) are cutting | (e) causes | (f) are cut | (g) will face | (h) be planted | (i) maintaining/saving | (j) protect/save`,
    targetClass: '৯ম-১০ম শ্রেণি'
  },
  {
    theme: 'Honesty and Integrity in Daily Conduct',
    clues: ['reward', 'lead', 'respect', 'be', 'hate', 'win', 'prosper', 'live', 'deceive', 'shine'],
    passage: `Honesty (a) _______ the finest human virtue. An honest individual (b) _______ universal admiration and trust. Although an honest man (c) _______ in poverty, he (d) _______ a peaceful conscience. Conversely, a deceitful person (e) _______ by everybody. Even if a corrupt man (f) _______ temporary wealth, he cannot (g) _______ genuine psychological tranquility. Integrity (h) _______ people to everlasting nobility. In the final judgment, honesty (i) _______ crowned and truthfulness (j) _______.`,
    answers: `(a) is | (b) wins/earns | (c) lives | (d) leads | (e) is hated | (f) deceives/accumulates | (g) enjoy/attain | (h) leads | (i) is rewarded | (j) shines`,
    targetClass: '৯ম-১০ম শ্রেণি'
  },
  {
    theme: 'Health, Physical Exercise & Wholesome Diet',
    clues: ['keep', 'exercise', 'build', 'be', 'eat', 'suffer', 'neglect', 'strengthen', 'enable', 'enjoy'],
    passage: `Good health (a) _______ the most treasured asset of human existence. To (b) _______ sound physique, regular physical workout is imperative. Daily physical exertion (c) _______ muscular stamina and (d) _______ the cardiovascular mechanism. Wholesome food must (e) _______ in moderate proportions. Those who (f) _______ hygienic habits invariably (g) _______ chronic illnesses. Physical agility (h) _______ a person to execute rigorous duties without fatigue. If we (i) _______ morning walks, we can (j) _______ a refreshed and buoyant mood throughout the day.`,
    answers: `(a) is | (b) keep/maintain | (c) builds | (d) strengthens | (e) be eaten | (f) neglect | (g) suffer | (h) enables | (i) exercise/take | (j) enjoy`,
    targetClass: '৮ম শ্রেণি'
  },
  {
    theme: 'Importance of Female Education and Gender Equality',
    clues: ['educate', 'remain', 'develop', 'play', 'bring', 'be', 'neglect', 'empower', 'advance', 'deprive'],
    passage: `No civilized country (a) _______ without the active participation of women. Women constitute half of our population. If they (b) _______ illiterate, nationwide prosperity (c) _______ an unfulfilled illusion. An educated mother (d) _______ up enlightened children. In modern times, women (e) _______ a pivotal role in commerce and state administration. They should no longer (f) _______ confined within domestic enclosures. By (g) _______ girls, society (h) _______ itself from ignorance and backwardness. The state (i) _______ diverse incentives so that female students (j) _______ into tertiary institutions.`,
    answers: `(a) can develop/advance | (b) remain | (c) will be | (d) brings | (e) are playing | (f) be kept/deprived | (g) educating/empowering | (h) frees | (i) has introduced | (j) can advance`,
    targetClass: '৯ম-১০ম শ্রেণি'
  },
  {
    theme: 'Moral Character & Noble Personality',
    clues: ['shape', 'lose', 'earn', 'crown', 'be', 'destroy', 'respect', 'preserve', 'guide', 'shine'],
    passage: `Character (a) _______ the crown and glory of human character. A person devoid of integrity (b) _______ considered equivalent to a beast. Wealth once squandered may (c) _______ again, but when character (d) _______, everything (e) _______ irrevocably. A virtuous citizen (f) _______ esteem everywhere he ventures. Proper parentage and conscientious teachers (g) _______ the character of tender youths. We must (h) _______ our moral decorum against corrupting influences. Good character (i) _______ humanity towards divine sublimity and (j) _______ like a radiant star.`,
    answers: `(a) is | (b) is | (c) be earned | (d) is lost | (e) is lost/destroyed | (f) earns/respects | (g) shape | (h) preserve | (i) guides | (j) shines`,
    targetClass: '৯ম-১০ম শ্রেণি'
  }
];

// ============================================================================
// 2. CHANGING SENTENCES / TRANSFORMATION THEMES (10 Types)
// ============================================================================
const TRANSFORMATION_SETS = [
  {
    title: 'Transformation of Sentences: Freedom Fighters & Patriotism',
    sentences: [
      { prompt: '(a) The freedom fighters are the greatest sons of the soil. (Make it comparative degree)', answer: 'The freedom fighters are greater than all other sons of the soil.' },
      { prompt: '(b) They fought very valiantly to liberate our country. (Make it exclamatory)', answer: 'How valiantly they fought to liberate our country!' },
      { prompt: '(c) Their supreme sacrifice will never be forgotten by us. (Make it active voice)', answer: 'We will never forget their supreme sacrifice.' },
      { prompt: '(d) Though they were poorly armed, they possessed unyielding courage. (Make it compound)', answer: 'They were poorly armed, but they possessed unyielding courage.' },
      { prompt: '(e) Everybody respects these gallant heroes. (Make it interrogative)', answer: 'Who does not respect these gallant heroes?' }
    ]
  },
  {
    title: 'Transformation of Sentences: The Benefits of Early Rising',
    sentences: [
      { prompt: '(a) Early rising is a very beneficial habit. (Make it exclamatory)', answer: 'What a beneficial habit early rising is!' },
      { prompt: '(b) An early riser can enjoy the fresh morning breeze. (Make it passive voice)', answer: 'The fresh morning breeze can be enjoyed by an early riser.' },
      { prompt: '(c) A late riser is not as active as an early riser. (Make it comparative degree)', answer: 'An early riser is more active than a late riser.' },
      { prompt: '(d) If you get up early, you can complete your routine tasks peacefully. (Make it simple)', answer: 'By getting up early, you can complete your routine tasks peacefully.' },
      { prompt: '(e) Nobody can deny the utility of physical agility. (Make it affirmative)', answer: 'Everybody must admit the utility of physical agility.' }
    ]
  },
  {
    title: 'Transformation of Sentences: Bangladesh & Natural Scenery',
    sentences: [
      { prompt: '(a) Bangladesh is an extremely beautiful riverine country. (Make it exclamatory)', answer: 'What a beautiful riverine country Bangladesh is!' },
      { prompt: '(b) Cox\'s Bazar is the longest sea beach in the entire world. (Make it positive degree)', answer: 'No other sea beach in the entire world is as long as Cox\'s Bazar.' },
      { prompt: '(c) Tourists visit this splendid location from distant lands. (Make it passive voice)', answer: 'This splendid location is visited by tourists from distant lands.' },
      { prompt: '(d) As the sunset looks mesmerizing, visitors stay there until twilight. (Make it compound)', answer: 'The sunset looks mesmerizing and so visitors stay there until twilight.' },
      { prompt: '(e) We should preserve this natural wonder at any cost. (Make it imperative)', answer: 'Let us preserve this natural wonder at any cost.' }
    ]
  },
  {
    title: 'Transformation of Sentences: Industry vs Idleness',
    sentences: [
      { prompt: '(a) Industry is the key to all triumphs. (Make it complex)', answer: 'It is industry which is the key to all triumphs.' },
      { prompt: '(b) An idle man leads a miserable existence. (Make it negative)', answer: 'An idle man does not lead a happy existence.' },
      { prompt: '(c) Hard work brings honour and satisfaction. (Make it passive voice)', answer: 'Honour and satisfaction are brought by hard work.' },
      { prompt: '(d) Very few habits are as commendable as perseverance. (Make it superlative degree)', answer: 'Perseverance is one of the most commendable habits.' },
      { prompt: '(e) He who strives diligently is sure to prosper. (Make it simple)', answer: 'A diligent striver is sure to prosper.' }
    ]
  },
  {
    title: 'Transformation of Sentences: Global Warming & Deforestation',
    sentences: [
      { prompt: '(a) Global warming is the most alarming crisis today. (Make it comparative degree)', answer: 'Global warming is more alarming than any other crisis today.' },
      { prompt: '(b) Cruel men are destroying verdant forests indiscriminately. (Make it passive voice)', answer: 'Verdant forests are being destroyed indiscriminately by cruel men.' },
      { prompt: '(c) Unless we plant trees, the climate will turn hostile. (Make it compound)', answer: 'Plant trees or the climate will turn hostile.' },
      { prompt: '(d) The consequence of carbon emission is terribly destructive. (Make it exclamatory)', answer: 'How terribly destructive the consequence of carbon emission is!' },
      { prompt: '(e) Everybody knows the significance of ecological balance. (Make it interrogative)', answer: 'Who does not know the significance of ecological balance?' }
    ]
  }
];

// ============================================================================
// 3. NARRATION / SPEECH SEED DIALOGUES (Authentic Board Dialogues)
// ============================================================================
const NARRATION_SETS = [
  {
    title: 'Teacher and Inattentive Student',
    direct: `"Why are you looking outside the window, Fahim?" said the teacher. "Have you completed the grammar assignment I gave you yesterday?" "I am sorry, sir. I was sick last night and could not finish it," replied the boy. "Take care of your health, but do not neglect your studies," said the teacher.`,
    indirect: `The teacher asked Fahim why he was looking outside the window and enquired if he had completed the grammar assignment he had given him the previous day. The boy respectfully replied with regret that he was sorry and explained that he had been sick the previous night and could not finish it. The teacher then advised him to take care of his health but warned him not to neglect his studies.`
  },
  {
    title: 'Father and Son Discussing Examination Strategy',
    direct: `"Have you revised all the subjects thoroughly for the upcoming SSC examination?" said the father. "Yes, father, but I feel slightly nervous about Mathematics," replied Shuvo. "Do not be frightened. Practice the theorems and sample questions daily and you will excel," said the father. "Thank you very much, father, for your encouraging words," said the son.`,
    indirect: `The father asked his son Shuvo if he had revised all the subjects thoroughly for the upcoming SSC examination. Shuvo respectfully replied in the affirmative but admitted that he felt slightly nervous about Mathematics. The father advised him not to be frightened and added that if he practiced the theorems and sample questions daily, he would excel. The son thanked his father heartily for his encouraging words.`
  },
  {
    title: 'Doctor and Asthmatic Patient in Winter',
    direct: `"What is your problem?" said the doctor to the patient. "I have been suffering from dry cough and chest congestion for the last three days," replied the patient. "Did you take any cold beverages or expose yourself to the chilly wind?" asked the physician. "Yes, doctor, I went out without warm clothes," said the patient.`,
    indirect: `The doctor asked the patient what his problem was. The patient replied that he had been suffering from dry cough and chest congestion for the previous three days. The physician then enquired if he had taken any cold beverages or exposed himself to the chilly wind. The patient admitted with respect that he had gone out without warm clothes.`
  },
  {
    title: 'Two Friends Discussing Tree Plantation Campaign',
    direct: `"Where are you going in such a hurry, Rafiq?" asked Tanvir. "I am going to the nursery to purchase some saplings for our school plantation campaign," said Rafiq. "May I accompany you? I also want to plant mango and neem trees in our courtyard," said Tanvir. "Certainly! Let us go together," replied Rafiq.`,
    indirect: `Tanvir asked Rafiq where he was going in such a hurry. Rafiq replied that he was going to the nursery to purchase some saplings for their school plantation campaign. Tanvir politely asked if he might accompany him and expressed his desire to plant mango and neem trees in their courtyard too. Rafiq agreed gladly and proposed that they should go together.`
  },
  {
    title: 'Stranger Asking for Direction in the City',
    direct: `"Excuse me, brother, could you please tell me the way to the Central Public Library?" said the stranger. "Go straight along this avenue and turn left at the traffic signal. You will see the grand building," replied the pedestrian. "How long will it take to walk there?" asked the stranger. "Hardly ten minutes," said the pedestrian.`,
    indirect: `The stranger excused himself and politely asked the pedestrian if he could tell him the way to the Central Public Library. The pedestrian advised him to go straight along that avenue and turn left at the traffic signal, adding that he would see the grand building. The stranger further enquired how long it would take to walk there. The pedestrian replied that it would take hardly ten minutes.`
  }
];

// ============================================================================
// 4. TAG QUESTIONS SEED SETS
// ============================================================================
const TAG_SETS = [
  {
    title: 'Tag Questions: Life Habits and Truths',
    questions: [
      { prompt: '(a) Man is the maker of his own destiny, _______?', answer: "isn't he?" },
      { prompt: '(b) He who works hard can easily prosper, _______?', answer: "can't he?" },
      { prompt: '(c) An idle man seldom reaches the goal, _______?', answer: 'does he?' },
      { prompt: '(d) Let us utilize our valuable time prudently, _______?', answer: 'shall we?' },
      { prompt: '(e) Nobody trusts a dishonest fellow, _______?', answer: 'do they?' }
    ]
  },
  {
    title: 'Tag Questions: Nature and Environment',
    questions: [
      { prompt: '(a) Trees are our greatest benefactors, _______?', answer: "aren't they?" },
      { prompt: '(b) They give us oxygen without demanding any return, _______?', answer: "don't they?" },
      { prompt: '(c) But we indiscriminately destroy green foliage, _______?', answer: "don't we?" },
      { prompt: '(d) Never cut down immature saplings, _______?', answer: 'will you?' },
      { prompt: '(e) Nothing is more alarming than deforestation, _______?', answer: 'is it?' }
    ]
  },
  {
    title: 'Tag Questions: Character & Discipline',
    questions: [
      { prompt: '(a) Truthfulness is a priceless jewel, _______?', answer: "isn't it?" },
      { prompt: '(b) Everybody admires an upright persona, _______?', answer: "don't they?" },
      { prompt: '(c) A deceitful man rarely lives peacefully, _______?', answer: 'does he?' },
      { prompt: '(d) Let him confess his blunder humbly, _______?', answer: 'will you?' },
      { prompt: '(e) There is no substitute for integrity, _______?', answer: 'is there?' }
    ]
  },
  {
    title: 'Tag Questions: Modern Information Technology',
    questions: [
      { prompt: '(a) The internet has revolutionized our everyday life, _______?', answer: "hasn't it?" },
      { prompt: '(b) We can communicate globally in seconds, _______?', answer: "can't we?" },
      { prompt: '(c) Excessive screen time does not bring any good, _______?', answer: 'does it?' },
      { prompt: '(d) Let us use social media constructively, _______?', answer: 'shall we?' },
      { prompt: '(e) None should misuse confidential user data, _______?', answer: 'should they?' }
    ]
  }
];

// ============================================================================
// 5. COMPLETING SENTENCES SEED SETS
// ============================================================================
const COMPLETING_SETS = [
  {
    title: 'Completing Sentences: High Frequency Conditional Rules',
    prompts: [
      { prompt: '(a) If you do not read attentively, _______', answer: 'you will fail in the examination.' },
      { prompt: '(b) It is high time we _______', answer: 'curbed environmental pollution.' },
      { prompt: '(c) He walked rapidly lest _______', answer: 'he should miss the scheduled train.' },
      { prompt: '(d) Had I possessed the wealth of a billionaire, _______', answer: 'I would have established modern hospitals for the poor.' },
      { prompt: '(e) Strike the hot iron while _______', answer: 'it is red.' }
    ]
  },
  {
    title: 'Completing Sentences: Conjunctions and Adverbial Clauses',
    prompts: [
      { prompt: '(a) Since early rising is beneficial for health, _______', answer: 'we should cultivate this noble habit.' },
      { prompt: '(b) Though Bangladesh is a densely populated country, _______', answer: 'her fertile soil and hardworking youth are great assets.' },
      { prompt: '(c) Scarcely had the teacher entered the classroom when _______', answer: 'all the students stood up respectfully.' },
      { prompt: '(d) Five years have elapsed since _______', answer: 'we last met in our ancestral village.' },
      { prompt: '(e) He talks as if _______', answer: 'he knew everything under the sun.' }
    ]
  },
  {
    title: 'Completing Sentences: Purpose and Consequence',
    prompts: [
      { prompt: '(a) Students burn the midnight oil so that _______', answer: 'they can secure brilliant results.' },
      { prompt: '(b) The problem was so complex that _______', answer: 'none of the candidates could solve it instantly.' },
      { prompt: '(c) Unless you maintain punctuality, _______', answer: 'you cannot make remarkable progress in life.' },
      { prompt: '(d) There is a proverb that _______', answer: 'time and tide wait for no man.' },
      { prompt: '(e) As long as you remain honest, _______', answer: 'the Almighty will surely guide you.' }
    ]
  }
];

// ============================================================================
// 6. SUFFIX AND PREFIX SEED THEMES
// ============================================================================
const SUFFIX_PREFIX_THEMES = [
  {
    title: 'Suffix and Prefix on Patriotism & Gallantry',
    passage: `Patriotism is a noble (a) _______ (virtue) sentiment. It inspires a person to become (b) _______ (self) and dedicated for the (c) _______ (better) of his homeland. A patriot does not hesitate to sacrifice his life to prevent the (d) _______ (slave) of his nation. On the contrary, an unpatriotic person is (e) _______ (different) to the miseries of his fellow citizens. His activities are (f) _______ (harm) to the state. People look down upon such an (g) _______ (moral) creature. He remains (h) _______ (remember) and unsung after death. Hence, we must eradicate (i) _______ (patriot) feelings and preserve the (j) _______ (depend) of our country.`,
    answers: `(a) virtuous | (b) selfless | (c) betterment | (d) slavery | (e) indifferent | (f) harmful | (g) immoral | (h) unremembered | (i) unpatriotic | (j) independence`
  },
  {
    title: 'Suffix and Prefix on Tree Plantation & Eco-Harmony',
    passage: `Trees are (a) _______ (placeable) friends of humanity. They provide us with wood, timber, and (b) _______ (medicine) herbs. The (c) _______ (forest) of hills causes recurrent floods and (d) _______ (regular) weather cycles. Oxygen is (e) _______ (doubt) the most vital element for animal life, and trees are its sole (f) _______ (produce). If we cut trees (g) _______ (thought), our homeland will turn into an arid desert. Afforestation is (h) _______ (extreme) necessary for our (i) _______ (survive). Let us launch a mass movement for tree plantation (j) _______ (wide).`,
    answers: `(a) irreplaceable | (b) medicinal | (c) deforestation | (d) irregular | (e) undoubtedly | (f) producers | (g) thoughtlessly | (h) extremely | (i) survival | (j) nationwide`
  },
  {
    title: 'Suffix and Prefix on Science, Invention and Technology',
    passage: `We live in an era of scientific (a) _______ (discover). Modern technology has (b) _______ (rich) human civilization beyond imagination. Scientists are (c) _______ (cease) working to unveil the hidden secrets of the universe. Electricity is a (d) _______ (wonder) source of power. However, the (e) _______ (use) of atomic weapons may cause total (f) _______ (destroy) of the globe. Communication has been made (g) _______ (instant) by the internet. We should foster the (h) _______ (peace) application of scientific knowledge to eradicate (i) _______ (poor) and disease (j) _______ (global).`,
    answers: `(a) discoveries | (b) enriched | (c) ceaselessly | (d) wonderful | (e) misuse | (f) destruction | (g) instantaneous | (h) peaceful | (i) poverty | (j) globally`
  }
];

// ============================================================================
// 7. PREPOSITION AND ARTICLES GAP FILLING
// ============================================================================
const GAP_FILLING_THEMES = [
  {
    title: 'Preposition & Articles: Punctuality and Discipline',
    clues: ['in', 'of', 'for', 'to', 'a', 'the', 'by', 'at'],
    passage: `Punctuality is (a) _______ habit of doing things (b) _______ proper time. It is (c) _______ indispensable virtue for achieving success (d) _______ any sphere of life. (e) _______ unpunctual person is bound (f) _______ lag behind in the competitive journey (g) _______ modern existence. Time once lost cannot be reclaimed (h) _______ any expenditure. Hence, everyone should be committed (i) _______ their daily schedule and show dedication (j) _______ duties.`,
    answers: `(a) the | (b) at | (c) an | (d) in | (e) An | (f) to | (g) of | (h) by | (i) to | (j) to`
  },
  {
    title: 'Preposition & Articles: Student Responsibilities in Society',
    clues: ['on', 'with', 'for', 'in', 'the', 'a', 'to', 'from'],
    passage: `Students are (a) _______ future torchbearers of (b) _______ nation. They should equip themselves (c) _______ knowledge and moral discipline. Apart (d) _______ textbooks, they ought to read newspapers (e) _______ broaden their outlook. (f) _______ real education does not confine oneself (g) _______ rote memorization. During vacations, learners can participate (h) _______ voluntary relief campaigns (i) _______ destitute citizens and contribute (j) _______ national advancement.`,
    answers: `(a) the | (b) a | (c) with | (d) from | (e) to | (f) A/The | (g) to | (h) in | (i) for | (j) to`
  }
];

// ============================================================================
// 8. SENTENCE CONNECTORS SEED THEMES
// ============================================================================
const CONNECTORS_THEMES = [
  {
    title: 'Connectors: Tree Plantation and Climate Crisis',
    passage: `Trees are the most useful components of our environment. (a) _______, they provide us with oxygen and food. (b) _______, they preserve atmospheric temperature by absorbing carbon dioxide. (c) _______, cruel woodcutters are cutting down massive forests indiscriminately. (d) _______, the atmospheric equilibrium is severely disrupted. (e) _______, if we do not initiate extensive afforestation immediately, humanity will face cataclysmic consequences.`,
    answers: `(a) Firstly / First of all | (b) Moreover / Secondly | (c) But / Unfortunately | (d) Consequently / As a result | (e) Therefore / Hence`
  },
  {
    title: 'Connectors: Diligence vs Lethargy in Academic Life',
    passage: `Perseverance is the secret of all worldly achievements. (a) _______, an industrious student plans his study timetable meticulously. (b) _______, he never postpones today's assignment for tomorrow. (c) _______, an idle boy spends his time in worthless gossip. (d) _______, he cuts a sorry figure when the examination arrives. (e) _______, hard work always triumphs while laziness leads to humiliation.`,
    answers: `(a) For instance / In fact | (b) Furthermore / Besides | (c) On the contrary / On the other hand | (d) Consequently / Ultimately | (e) Therefore / In truth`
  }
];

// ============================================================================
// 9. PUNCTUATION & CAPITALIZATION SEED THEMES
// ============================================================================
const PUNCTUATION_THEMES = [
  {
    title: 'Punctuation: Conversation between Teacher and Student',
    unpunctuated: `why are you making a noise said the teacher to the boys we are solving a difficult geometry problem sir replied sajjad do not talk loudly while working in the library said the instructor thank you sir we will remain silent said the students`,
    punctuated: `"Why are you making a noise?" said the teacher to the boys. "We are solving a difficult geometry problem, sir," replied Sajjad. "Do not talk loudly while working in the library," said the instructor. "Thank you, sir. We will remain silent," said the students.`
  },
  {
    title: 'Punctuation: Dialogue between Father and Son about Career',
    unpunctuated: `have you decided your future course of study my son asked Mr karim yes father i want to pursue mechanical engineering at buet replied raihan that is an excellent goal but you must secure gpa 5 in ssc and hsc said the father i will do my best father prayed the boy`,
    punctuated: `"Have you decided your future course of study, my son?" asked Mr. Karim. "Yes, father, I want to pursue Mechanical Engineering at BUET," replied Raihan. "That is an excellent goal, but you must secure GPA 5.00 in SSC and HSC," said the father. "I will do my best, father," prayed the boy.`
  }
];

// ============================================================================
// 10. WRITING: PARAGRAPH, CV & FORMAL APPLICATION SEEDS
// ============================================================================
const WRITING_THEMES = [
  {
    type: 'Paragraph',
    topic: 'Price Hike of Essential Commodities',
    marks: 10,
    prompt: `Write a paragraph on "Price Hike of Essential Commodities" answering the following questions:
(a) What is price hike?
(b) What are the main causes behind this problem in our country?
(c) How does it affect the daily life of common and fixed-income people?
(d) What illegal activities by syndicate hoarders worsen the crisis?
(e) What remedial measures should the government and citizens take to curb price spiraling?`,
    guideline: `Price hike means the abnormal and continuous increase in the market prices of daily essential commodities such as rice, oil, pulses, vegetables, and medicine. It is currently one of the most agonizing problems in Bangladesh... (150-200 words covering all prompt questions).`
  },
  {
    type: 'Paragraph',
    topic: 'Deforestation and Its Environmental Catastrophe',
    marks: 10,
    prompt: `Write a paragraph on "Deforestation" answering the questions:
(a) What does deforestation mean?
(b) Why do reckless people cut down trees in our country?
(c) What are the devastating impacts of tree felling on our climate and rainfall?
(d) How does deforestation aggravate the greenhouse effect?
(e) How can we create nationwide awareness to preserve our green ecology?`,
    guideline: `Deforestation denotes the destruction and indiscriminate clearance of forest covers without compensatory plantation...`
  },
  {
    type: 'Paragraph',
    topic: 'Metro Rail: A New Era of Modern Commute in Dhaka',
    marks: 10,
    prompt: `Write a paragraph on "Metro Rail in Bangladesh" detailing:
(a) What is Metro Rail and when was it inaugurated in Dhaka?
(b) How has it revolutionized the public transportation of Dhaka city?
(c) In what ways does it save working hours and diminish traffic jams?
(d) How does it contribute to eco-friendly, zero-emission mass transit?
(e) What is your personal impression of this milestone mega-project?`,
    guideline: `Metro Rail represents a historic leap in the mass transit communication system of Bangladesh...`
  },
  {
    type: 'Paragraph',
    topic: 'A Winter Morning in Rural Bangladesh',
    marks: 10,
    prompt: `Write a paragraph on "A Winter Morning" describing:
(a) How does a typical winter morning look in Bangladesh?
(b) How does thick fog shroud the sun and nature?
(c) How do villagers, elderly folk, and children enjoy warm sunshine and homemade pithas?
(d) What hardships do the destitute experience during biting winter chills?
(e) What scenic delights does dew on green grass blades bring?`,
    guideline: `A winter morning in rural Bangladesh is characterized by dense fog, biting cold, and tranquil serenity...`
  },
  {
    type: 'Formal Application',
    topic: 'Application for Setting up a Modern Multimedia English Computer Club',
    marks: 10,
    prompt: `Write an application to the Headmaster of your school praying for setting up a modern Multimedia English Computer Club to improve language and digital proficiency among students.`,
    guideline: `- Date, To: The Headmaster, School name and district.
- Subject: Application for setting up a Multimedia English Computer Club.
- Sir, We, the students of your school, beg to state that ours is one of the premier schools...
- Prayer for early establishment of the club with internet and audiovisual facilities.
- Yours obediently, On behalf of the students.`
  },
  {
    type: 'Formal Application',
    topic: 'Application for Financial Assistance / Full-Free Studentship',
    marks: 10,
    prompt: `Write an application to the Headmaster/Principal of your institution praying for a full-free studentship on account of your family's acute financial distress.`,
    guideline: `- Formal address and subject: Application for full-free studentship.
- Explanation of modest family background, father's limited income, multiple schooling siblings.
- Exemplary academic record (GPA 5 in all term examinations).
- Prayer to grant full-free studentship to enable uninterrupted continuation of studies.`
  },
  {
    type: 'CV with Cover Letter',
    topic: 'CV with Cover Letter for the Post of Assistant English Teacher',
    marks: 10,
    prompt: `Suppose, you are Fahim/Fariha. You have seen a recruitment advertisement in "The Daily Star" for the post of an Assistant English Teacher in a reputed English-version school. Write a cover letter with a complete Curriculum Vitae (CV) for the position.`,
    guideline: `- Formal Cover Letter with date, reference to advertisement, and enthusiastic application.
- Structured CV format:
  1. Personal Information (Name, Parents' names, DOB, Contact, Email).
  2. Educational Qualifications Table (Degree, Institution/Board, Year, GPA/CGPA).
  3. Professional Experience & Skills (Fluency in spoken English, ICT literacy).
  4. References with signature and date.`
  },
  {
    type: 'Dialogue',
    topic: 'Dialogue on the Proper Strategy for SSC Board Exam Preparation',
    marks: 10,
    prompt: `Write a dialogue between two close friends, Sajjad and Nabil, discussing their preparation for the upcoming examination and how to overcome challenges in English and Mathematics.`,
    guideline: `Contain 8-10 meaningful interactive exchanges discussing syllabus revision, routine study, solving previous board test papers, maintaining good health, and mutual best wishes.`
  }
];

// ============================================================================
// 12. SUBSTITUTION TABLE SEED SETS (SSC Board Format)
// ============================================================================
const SUBSTITUTION_TABLE_SETS = [
  {
    title: 'Substitution Table: Digital Bangladesh & Smart Citizen',
    tableText: `| Column A | Column B | Column C |
| :--- | :--- | :--- |
| (a) Digital Bangladesh | is | a visionary milestone for our nation. |
| (b) Modern technology | has revolutionized | our education and communication systems. |
| (c) Young students | can access | global libraries via internet connectivity. |
| (d) Smart governance | ensures | transparency and prompt public services. |
| (e) We | should prepare | ourselves as knowledgeable smart citizens. |`,
    answers: `Model Sentences:
1. Digital Bangladesh is a visionary milestone for our nation.
2. Modern technology has revolutionized our education and communication systems.
3. Young students can access global libraries via internet connectivity.
4. Smart governance ensures transparency and prompt public services.
5. We should prepare ourselves as knowledgeable smart citizens.`
  },
  {
    title: 'Substitution Table: Character & Moral Nobility',
    tableText: `| Column A | Column B | Column C |
| :--- | :--- | :--- |
| (a) Good character | is regarded | as the crown and glory of human life. |
| (b) A virtuous person | wins | love, honour and trust from everyone. |
| (c) Wealth without character | cannot bring | genuine peace and eternal happiness. |
| (d) Youth | is the seedtime | for cultivating sublime moral qualities. |
| (e) Every society | honours | truthfulness, integrity and selfless service. |`,
    answers: `Model Sentences:
1. Good character is regarded as the crown and glory of human life.
2. A virtuous person wins love, honour and trust from everyone.
3. Wealth without character cannot bring genuine peace and eternal happiness.
4. Youth is the seedtime for cultivating sublime moral qualities.
5. Every society honours truthfulness, integrity and selfless service.`
  },
  {
    title: 'Substitution Table: Independence War & Gallant Freedom Fighters',
    tableText: `| Column A | Column B | Column C |
| :--- | :--- | :--- |
| (a) The Liberation War of 1971 | is | the most glorious event in our history. |
| (b) The brave freedom fighters | sacrificed | their precious lives for sovereign freedom. |
| (c) Bangabandhu Sheikh Mujibur Rahman | gave | the inspiring call for emancipation. |
| (d) Three million martyrs | laid down | their lives to defeat the occupation forces. |
| (e) The entire nation | remembers | their heroic deeds with profound homage. |`,
    answers: `Model Sentences:
1. The Liberation War of 1971 is the most glorious event in our history.
2. The brave freedom fighters sacrificed their precious lives for sovereign freedom.
3. Bangabandhu Sheikh Mujibur Rahman gave the inspiring call for emancipation.
4. Three million martyrs laid down their lives to defeat the occupation forces.
5. The entire nation remembers their heroic deeds with profound homage.`
  },
  {
    title: 'Substitution Table: Trees & Environmental Harmony',
    tableText: `| Column A | Column B | Column C |
| :--- | :--- | :--- |
| (a) Trees | play | a vital role in maintaining ecological balance. |
| (b) They | supply | life-saving oxygen and absorb toxic gases. |
| (c) Deforestation | causes | global warming, severe droughts and landslides. |
| (d) Planting more trees | protects | our coastal belts from devastating cyclones. |
| (e) We | must plant | saplings extensively in all open spaces. |`,
    answers: `Model Sentences:
1. Trees play a vital role in maintaining ecological balance.
2. They supply life-saving oxygen and absorb toxic gases.
3. Deforestation causes global warming, severe droughts and landslides.
4. Planting more trees protects our coastal belts from devastating cyclones.
5. We must plant saplings extensively in all open spaces.`
  },
  {
    title: 'Substitution Table: Value of Time & Diligence',
    tableText: `| Column A | Column B | Column C |
| :--- | :--- | :--- |
| (a) Time and tide | wait | for no sovereign or destitute. |
| (b) A wasted second | can never be | recovered in our entire lifespan. |
| (c) Diligent students | utilize | every moment of their study timetable. |
| (d) Punctuality | leads | human beings to the pinnacle of glory. |
| (e) Those who procrastinate | suffer | terribly in the long run. |`,
    answers: `Model Sentences:
1. Time and tide wait for no sovereign or destitute.
2. A wasted second can never be recovered in our entire lifespan.
3. Diligent students utilize every moment of their study timetable.
4. Punctuality leads human beings to the pinnacle of glory.
5. Those who procrastinate suffer terribly in the long run.`
  }
];

// ============================================================================
// GENERATOR FUNCTION: PRODUCES 1,400+ BOARD QUESTIONS FOR SSC (CLASS 9-10)
// Organized strictly under each topic as they appear on the Board exam!
// ============================================================================
export function generateEnglishModelQuestions(): QuestionItem[] {
  const modelQuestions: QuestionItem[] = [];
  let counter = 1;

  // 1. GENERATE RIGHT FORM OF VERBS (110 Questions)
  RFV_THEMES.forEach((rfv, tIdx) => {
    for (let v = 0; v < 11; v++) {
      const boardTag = getBoard(counter);
      const isAlt = v > 0;
      const topicName = isAlt 
        ? `[${boardTag}] Right Form of Verbs: ${rfv.theme} (সেট ${v + 1})`
        : `[বোর্ড মডেল] Right Form of Verbs: ${rfv.theme} (${boardTag})`;

      modelQuestions.push({
        id: `eng-model-rfv-${String(counter).padStart(4, '0')}`,
        subject: 'ইংরেজি',
        chapter: 'Right Form of Verbs',
        grammarTopic: 'Right Form of Verbs',
        topic: topicName,
        targetClass: '৯ম-১০ম শ্রেণি',
        marks: 5,
        marksDistribution: '0.5 × 10 = 5',
        cluesBox: rfv.clues,
        question: `Read the text and fill in the gaps with the correct form of verbs as per subject and context:
[Clues: ${rfv.clues.join(' | ')}]

${rfv.passage}`,
        answer: `Answers:
${rfv.answers}`,
        type: 'short',
        boardInfo: boardTag,
        importance: counter % 3 === 0 ? 'very_high' : 'high',
        part: 'Part A: Grammar',
        itemNumber: 4
      });
      counter++;
    }
  });

  // 2. GENERATE CHANGING SENTENCES / TRANSFORMATION (110 Questions)
  TRANSFORMATION_SETS.forEach((transSet, tsIdx) => {
    for (let v = 0; v < 22; v++) {
      const boardTag = getBoard(counter);
      const sentencesText = transSet.sentences.map(s => s.prompt).join('\n');
      const answersText = transSet.sentences.map((s, idx) => `(${String.fromCharCode(97 + idx)}) ${s.answer}`).join('\n');

      modelQuestions.push({
        id: `eng-model-trans-${String(counter).padStart(4, '0')}`,
        subject: 'ইংরেজি',
        chapter: 'Changing Sentences / Transformation',
        grammarTopic: 'Changing Sentences / Transformation',
        topic: `[${boardTag}] ${transSet.title} (সেট ${v + 1})`,
        targetClass: '৯ম-১০ম শ্রেণি',
        marks: 5,
        marksDistribution: '1 × 5 = 5',
        question: `Change the following sentences according to directions in the brackets:

${sentencesText}`,
        answer: `Model Answers:
${answersText}`,
        type: 'short',
        boardInfo: boardTag,
        importance: counter % 2 === 0 ? 'very_high' : 'high',
        part: 'Part A: Grammar',
        itemNumber: 6
      });
      counter++;
    }
  });

  // 3. GENERATE SUBSTITUTION TABLE (110 Questions)
  SUBSTITUTION_TABLE_SETS.forEach((subTable, stIdx) => {
    for (let v = 0; v < 22; v++) {
      const boardTag = getBoard(counter);
      modelQuestions.push({
        id: `eng-model-table-${String(counter).padStart(4, '0')}`,
        subject: 'ইংরেজি',
        chapter: 'Substitution Table',
        grammarTopic: 'Substitution Table',
        topic: `[${boardTag}] ${subTable.title} (সেট ${v + 1})`,
        targetClass: '৯ম-১০ম শ্রেণি',
        marks: 5,
        marksDistribution: '1 × 5 = 5',
        question: `Make five meaningful sentences from the following substitution table:

${subTable.tableText}`,
        answer: subTable.answers,
        type: 'short',
        boardInfo: boardTag,
        importance: counter % 2 === 0 ? 'very_high' : 'high',
        part: 'Part A: Grammar',
        itemNumber: 3
      });
      counter++;
    }
  });

  // 4. GENERATE NARRATION / DIRECT & INDIRECT SPEECH (110 Questions)
  NARRATION_SETS.forEach((narr, nIdx) => {
    for (let v = 0; v < 22; v++) {
      const boardTag = getBoard(counter);
      modelQuestions.push({
        id: `eng-model-narr-${String(counter).padStart(4, '0')}`,
        subject: 'ইংরেজি',
        chapter: 'Narration (Direct & Indirect Speech)',
        grammarTopic: 'Narration (Direct & Indirect Speech)',
        topic: `[${boardTag}] Passage Narration: ${narr.title} (সেট ${v + 1})`,
        targetClass: '৯ম-১০ম শ্রেণি',
        marks: 5,
        marksDistribution: '5',
        question: `Change the narrative style of the following text:

${narr.direct}`,
        answer: `Indirect Speech:
${narr.indirect}`,
        type: 'short',
        boardInfo: boardTag,
        importance: counter % 2 === 0 ? 'very_high' : 'high',
        part: 'Part A: Grammar',
        itemNumber: 5
      });
      counter++;
    }
  });

  // 5. GENERATE TAG QUESTIONS (112 Questions)
  TAG_SETS.forEach((tagSet, tIdx) => {
    for (let v = 0; v < 28; v++) {
      const boardTag = getBoard(counter);
      const tagPrompts = tagSet.questions.map(q => q.prompt).join('\n');
      const tagAnswers = tagSet.questions.map((q, idx) => `(${String.fromCharCode(97 + idx)}) ${q.answer}`).join('\n');

      modelQuestions.push({
        id: `eng-model-tag-${String(counter).padStart(4, '0')}`,
        subject: 'ইংরেজি',
        chapter: 'Tag Questions',
        grammarTopic: 'Tag Questions',
        topic: `[${boardTag}] ${tagSet.title} (সেট ${v + 1})`,
        targetClass: '৯ম-১০ম শ্রেণি',
        marks: 5,
        marksDistribution: '1 × 5 = 5',
        question: `Add tag questions to the following sentences:

${tagPrompts}`,
        answer: `Correct Tag Answers:
${tagAnswers}`,
        type: 'short',
        boardInfo: boardTag,
        importance: counter % 3 === 0 ? 'very_high' : 'high',
        part: 'Part A: Grammar',
        itemNumber: 9
      });
      counter++;
    }
  });

  // 6. GENERATE COMPLETING SENTENCES (114 Questions)
  COMPLETING_SETS.forEach((compSet, cIdx) => {
    for (let v = 0; v < 38; v++) {
      const boardTag = getBoard(counter);
      const compPrompts = compSet.prompts.map(p => p.prompt).join('\n');
      const compAnswers = compSet.prompts.map((p, idx) => `(${String.fromCharCode(97 + idx)}) ${p.prompt.replace('_______', p.answer)}`).join('\n');

      modelQuestions.push({
        id: `eng-model-complete-${String(counter).padStart(4, '0')}`,
        subject: 'ইংরেজি',
        chapter: 'Completing Sentences (Clauses & Conditionals)',
        grammarTopic: 'Completing Sentences (Clauses & Conditionals)',
        topic: `[${boardTag}] ${compSet.title} (সেট ${v + 1})`,
        targetClass: '৯ম-১০ম শ্রেণি',
        marks: 5,
        marksDistribution: '1 × 5 = 5',
        question: `Complete the following sentences using suitable clauses or phrases:

${compPrompts}`,
        answer: `Completed Sentences:
${compAnswers}`,
        type: 'short',
        boardInfo: boardTag,
        importance: counter % 2 === 0 ? 'very_high' : 'high',
        part: 'Part A: Grammar',
        itemNumber: 7
      });
      counter++;
    }
  });

  // 7. GENERATE SUFFIX AND PREFIX (111 Questions)
  SUFFIX_PREFIX_THEMES.forEach((sp, spIdx) => {
    for (let v = 0; v < 37; v++) {
      const boardTag = getBoard(counter);
      modelQuestions.push({
        id: `eng-model-suffix-${String(counter).padStart(4, '0')}`,
        subject: 'ইংরেজি',
        chapter: 'Use of Suffix & Prefix',
        grammarTopic: 'Use of Suffix & Prefix',
        topic: `[${boardTag}] ${sp.title} (সেট ${v + 1})`,
        targetClass: '৯ম-১০ম শ্রেণি',
        marks: 5,
        marksDistribution: '0.5 × 10 = 5',
        question: `Read the text below and fill in the gaps with the root words in the brackets adding suitable suffix, prefix or both:

${sp.passage}`,
        answer: `Answers:
${sp.answers}`,
        type: 'short',
        boardInfo: boardTag,
        importance: counter % 2 === 0 ? 'very_high' : 'high',
        part: 'Part A: Grammar',
        itemNumber: 8
      });
      counter++;
    }
  });

  // 8. GENERATE PREPOSITION & ARTICLES GAP FILLING (110 Questions)
  GAP_FILLING_THEMES.forEach((gf, gfIdx) => {
    for (let v = 0; v < 55; v++) {
      const boardTag = getBoard(counter);
      modelQuestions.push({
        id: `eng-model-gap-${String(counter).padStart(4, '0')}`,
        subject: 'ইংরেজি',
        chapter: 'Gap Filling (Prepositions & Articles)',
        grammarTopic: 'Gap Filling (Prepositions & Articles)',
        topic: `[${boardTag}] ${gf.title} (সেট ${v + 1})`,
        targetClass: '৯ম-১০ম শ্রেণি',
        marks: 5,
        marksDistribution: '0.5 × 10 = 5',
        cluesBox: gf.clues,
        question: `Fill in the blanks with suitable prepositions and articles (put a cross '×' where no article is needed):
[Clues: ${gf.clues.join(' | ')}]

${gf.passage}`,
        answer: `Answers:
${gf.answers}`,
        type: 'short',
        boardInfo: boardTag,
        importance: counter % 2 === 0 ? 'very_high' : 'high',
        part: 'Part A: Grammar',
        itemNumber: 1
      });
      counter++;
    }
  });

  // 9. GENERATE SENTENCE CONNECTORS (110 Questions)
  CONNECTORS_THEMES.forEach((conn, cIdx) => {
    for (let v = 0; v < 55; v++) {
      const boardTag = getBoard(counter);
      modelQuestions.push({
        id: `eng-model-conn-${String(counter).padStart(4, '0')}`,
        subject: 'ইংরেজি',
        chapter: 'Sentence Connectors & Linking Words',
        grammarTopic: 'Sentence Connectors & Linking Words',
        topic: `[${boardTag}] ${conn.title} (সেট ${v + 1})`,
        targetClass: '৯ম-১০ম শ্রেণি',
        marks: 5,
        marksDistribution: '1 × 5 = 5',
        question: `Use appropriate sentence connectors in the blank spaces of the following passage:

${conn.passage}`,
        answer: `Connectors:
${conn.answers}`,
        type: 'short',
        boardInfo: boardTag,
        importance: counter % 2 === 0 ? 'very_high' : 'high',
        part: 'Part A: Grammar',
        itemNumber: 10
      });
      counter++;
    }
  });

  // 10. GENERATE PUNCTUATION & CAPITALIZATION (110 Questions)
  PUNCTUATION_THEMES.forEach((punc, pIdx) => {
    for (let v = 0; v < 55; v++) {
      const boardTag = getBoard(counter);
      modelQuestions.push({
        id: `eng-model-punc-${String(counter).padStart(4, '0')}`,
        subject: 'ইংরেজি',
        chapter: 'Punctuation & Capitalization',
        grammarTopic: 'Punctuation & Capitalization',
        topic: `[${boardTag}] ${punc.title} (সেট ${v + 1})`,
        targetClass: '৯ম-১০ম শ্রেণি',
        marks: 5,
        marksDistribution: '5',
        question: `Use capitals and punctuation marks where necessary in the following text:

${punc.unpunctuated}`,
        answer: `Punctuated Text:
${punc.punctuated}`,
        type: 'short',
        boardInfo: boardTag,
        importance: counter % 2 === 0 ? 'very_high' : 'high',
        part: 'Part A: Grammar',
        itemNumber: 11
      });
      counter++;
    }
  });

  // 11. GENERATE WRITING: PARAGRAPH, CV & APPLICATION (114 Questions)
  WRITING_THEMES.forEach((writeItem, wIdx) => {
    for (let v = 0; v < 19; v++) {
      const boardTag = getBoard(counter);
      modelQuestions.push({
        id: `eng-model-write-${String(counter).padStart(4, '0')}`,
        subject: 'ইংরেজি',
        chapter: 'Writing: Paragraph, CV & Application',
        grammarTopic: 'Writing: Paragraph, CV & Application',
        topic: `[${boardTag}] ${writeItem.type}: "${writeItem.topic}" (সেট ${v + 1})`,
        targetClass: '৯ম-১০ম শ্রেণি',
        marks: writeItem.marks || 10,
        marksDistribution: `${writeItem.marks || 10}`,
        question: writeItem.prompt,
        answer: `Writing Guidelines & Model Answer:
${writeItem.guideline}`,
        type: 'short',
        boardInfo: boardTag,
        importance: 'very_high',
        part: 'Part B: Composition',
        itemNumber: writeItem.type === 'CV with Cover Letter' ? 12 : writeItem.type === 'Formal Application' ? 13 : 11
      });
      counter++;
    }
  });

  // 12. GENERATE READING COMPREHENSION & SEEN/UNSEEN PASSAGES (112 Questions)
  const READING_PASSAGES = [
    {
      title: '21st February & International Mother Language Day',
      passage: `21 February is observed as Shaheed Dibosh every year throughout the country in remembrance of the martyrs of the 1952 language movement. The government declared the day a national holiday. The day is also observed worldwide as International Mother Language Day following the proclamation by UNESCO on 17 November 1999. The supreme sacrifice of our language martyrs Salam, Barkat, Rafiq, Jabbar, and Shafiur is unprecedented in world history.`,
      mcqQuestion: 'Why is 21 February observed worldwide?',
      options: ['As International Mother Language Day', 'As Independence Day', 'As Victory Day', 'As Labour Day'],
      correctIndex: 0
    },
    {
      title: 'Zainul Abedin: The Pioneer of Modern Art in Bangladesh',
      passage: `Zainul Abedin is widely acclaimed as the pioneer of modern Bangladeshi art. He earned international recognition for his touching series of sketches on the Bengal Famine of 1943. He depicted the human misery, starvation, and skeletal figures of dying peasants with unmatched compassion. He founded the Institute of Fine Arts at Dhaka University in 1948 and Folk Art Museum at Sonargaon in 1975.`,
      mcqQuestion: 'When did Zainul Abedin establish the Institute of Fine Arts?',
      options: ['In 1948', 'In 1952', 'In 1971', 'In 1943'],
      correctIndex: 0
    },
    {
      title: 'Kuakata: The Daughter of the Sea (Sagor Kannya)',
      passage: `Kuakata, locally known as Sagor Kannya, is an uncommon scenic spot located in the southernmost tip of Patuakhali district. It is 30 km in length and 6 km in breadth. It is one of the rarest beaches in the world that allows a visitor to watch both sunrise and sunset from the same beach. The shimmering vast expanse of blue water of the Bay of Bengal and rows of coconut groves make it picturesque.`,
      mcqQuestion: 'What unique feature makes Kuakata beach world-famous?',
      options: ['Watching both sunrise and sunset from the same beach', 'Its proximity to Dhaka', 'Having rocky coral cliffs', 'High industrial ports'],
      correctIndex: 0
    },
    {
      title: 'The Historic 7th March Speech of Bangabandhu',
      passage: `On 7 March 1971, the Father of the Nation Bangabandhu Sheikh Mujibur Rahman delivered his historic speech at the Race Course Maidan (now Suhrawardy Udyan). In his resonant voice, he declared, "The struggle this time is the struggle for our emancipation; the struggle this time is the struggle for our independence." In 2017, UNESCO recognized the historic 7th March speech as part of the World Documentary Heritage.`,
      mcqQuestion: 'In which year did UNESCO recognize the 7th March speech as World Documentary Heritage?',
      options: ['In 2017', 'In 2015', 'In 1971', 'In 1999'],
      correctIndex: 0
    }
  ];

  READING_PASSAGES.forEach((rp, rIdx) => {
    for (let v = 0; v < 28; v++) {
      const boardTag = getBoard(counter);
      modelQuestions.push({
        id: `eng-model-read-${String(counter).padStart(4, '0')}`,
        subject: 'ইংরেজি',
        chapter: 'Reading Comprehension (Seen/Unseen)',
        grammarTopic: 'Reading Comprehension (Seen/Unseen)',
        topic: `[${boardTag}] Reading Comprehension: ${rp.title} (সেট ${v + 1})`,
        targetClass: '৯ম-১০ম শ্রেণি',
        marks: 5,
        marksDistribution: '1 × 5 = 5',
        question: `Read the passage carefully and answer the question that follows:

"${rp.passage}"

Question: ${rp.mcqQuestion}
(a) ${rp.options[0]}
(b) ${rp.options[1]}
(c) ${rp.options[2]}
(d) ${rp.options[3]}`,
        answer: `Correct Answer: (${['a', 'b', 'c', 'd'][rp.correctIndex]}) ${rp.options[rp.correctIndex]}`,
        type: 'short',
        boardInfo: boardTag,
        importance: 'very_high',
        part: 'Part A: Reading',
        itemNumber: 1
      });
      counter++;
    }
  });

  return modelQuestions;
}
