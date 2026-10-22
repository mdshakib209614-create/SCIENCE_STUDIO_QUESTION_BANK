import { ShortQuestion, MCQQuestion, CQQuestion, QuestionItem } from '../../types';

/**
 * Authentic Board Questions Analyzed from SSC & School Board Exams (2019 - 2024)
 * Cover all NCTB English Grammar & Composition items.
 */
const rawEnglishBoardQuestions: ShortQuestion[] = [
  // =========================================================================
  // 1. RIGHT FORM OF VERBS (SSC / Class 9-10 & Class 8)
  // =========================================================================
  {
    id: 'eng-board-rfv-01',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Right Form of Verbs',
    topic: '[বোর্ড মডেল] Right Form of Verbs (Dhaka Board 2024)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '0.5 × 10 = 5',
    cluesBox: ['take', 'walk', 'pollute', 'be', 'suffer', 'do', 'destroy', 'breathe', 'live', 'realize'],
    question: `Read the text and fill in the gaps with the correct form of verbs as per subject and context:
[Clues: take | walk | pollute | be | suffer | do | destroy | breathe | live | realize]

Environment (a) _______ an indispensable part of human life. A healthy environment helps us to (b) _______ peacefully. But nowadays our environment is being (c) _______ in many ways. Air is being polluted by smokes. As a result, we are (d) _______ impure air and (e) _______ from various respiratory diseases. We must (f) _______ steps to protect our ecology. Trees (g) _______ indiscriminate cutting down which (h) _______ great harm to nature. Morning (i) _______ is good for health, but people cannot enjoy fresh air unless they (j) _______ the urgency of environmental protection.`,
    answer: `Answers:
(a) is
(b) live
(c) polluted
(d) breathing
(e) suffering
(f) take
(g) are being (or should not be)
(h) does
(i) walking
(j) realize`,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 2
  },
  {
    id: 'eng-board-rfv-02',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Right Form of Verbs',
    topic: '[বোর্ড মডেল] Right Form of Verbs (Rajshahi Board 2023)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '0.5 × 10 = 5',
    cluesBox: ['prepare', 'waste', 'succeed', 'follow', 'be', 'fail', 'spoil', 'work', 'learn', 'call'],
    question: `Read the text and fill in the gaps with the correct form of verbs:
[Clues: prepare | waste | succeed | follow | be | fail | spoil | work | learn | call]

Student life (a) _______ the golden season of human life. A student should (b) _______ his lessons regularly. If a student (c) _______ his valuable time in idleness, he will surely (d) _______ in life. Diligence is (e) _______ the mother of good luck. He who (f) _______ hard is sure to (g) _______. Many students (h) _______ their future due to negligence. By (i) _______ the rules of discipline, a learner can (j) _______ moral and academic excellence.`,
    answer: `Answers:
(a) is
(b) prepare
(c) wastes
(d) fail
(e) called
(f) works
(g) succeed
(h) spoil
(i) following
(j) learn`,
    type: 'short',
    boardInfo: 'রাজশাহী বোর্ড ২০২৩',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 2
  },
  {
    id: 'eng-board-rfv-03',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Right Form of Verbs',
    topic: '[বোর্ড মডেল] Right Form of Verbs (Chattogram Board 2024)',
    targetClass: '৮ম শ্রেণি',
    marks: 5,
    marksDistribution: '1 × 5 = 5',
    cluesBox: ['rain', 'play', 'go', 'study', 'stop'],
    question: `Fill in the blanks with the right form of verbs from the box:
[Clues: rain | play | go | study | stop]

(a) It _______ since morning, so we could not go out to play.
(b) The boys were _______ football in the muddy ground happily.
(c) Father had arrived before the rain _______.
(d) You cannot prosper unless you _______ attentively.
(e) Yesterday at this time, Mother _______ to the market.`,
    answer: `Answers:
(a) has been raining
(b) playing
(c) stopped
(d) study
(e) was going`,
    type: 'short',
    boardInfo: 'চট্টগ্রাম বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 2
  },

  // =========================================================================
  // 2. CHANGING SENTENCES / TRANSFORMATION (SSC & Class 8)
  // =========================================================================
  {
    id: 'eng-board-cs-01',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Changing Sentences / Transformation',
    topic: '[বোর্ড মডেল] Changing Sentences (Dhaka Board 2024)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '1 × 5 = 5',
    question: `Change the sentences according to directions given in brackets:
(a) Cricket is a very exciting game. (Make it Exclamatory)
(b) People of all ages enjoy this game. (Make it Passive)
(c) It is one of the most popular games in Bangladesh. (Make it Positive degree)
(d) Though cricket is an expensive game, our youths love it dearly. (Make it Compound)
(e) Everybody wants our team to win every match. (Make it Negative)`,
    answer: `Answers:
(a) What an exciting game cricket is!
(b) This game is enjoyed by people of all ages.
(c) Very few games in Bangladesh are as popular as cricket.
(d) Cricket is an expensive game, but our youths love it dearly.
(e) Who does not want our team to win every match? / There is nobody but wants our team to win every match.`,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 3
  },
  {
    id: 'eng-board-cs-02',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Changing Sentences / Transformation',
    topic: '[বোর্ড মডেল] Changing Sentences (Cumilla Board 2023)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '1 × 5 = 5',
    question: `Change the following sentences according to directions:
(a) Patriotism is a noble virtue. (Make it Interrogative)
(b) A patriot is respected by all. (Make it Active)
(c) An unpatriotic man is worse than a brute. (Make it Positive degree)
(d) When a patriot dies, everyone mourns for him. (Make it Simple)
(e) We must love our motherland. (Make it Negative without changing meaning)`,
    answer: `Answers:
(a) Isn't patriotism a noble virtue?
(b) All respect a patriot.
(c) A brute is not as bad as an unpatriotic man.
(d) At the time of a patriot's death, everyone mourns for him.
(e) We cannot but love our motherland. / We cannot help loving our motherland.`,
    type: 'short',
    boardInfo: 'কুমিল্লা বোর্ড ২০২৩',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 3
  },
  {
    id: 'eng-board-cs-03',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Changing Sentences / Transformation',
    topic: '[বোর্ড মডেল] Changing Sentences (Jashore Board 2024)',
    targetClass: '৮ম শ্রেণি',
    marks: 5,
    marksDistribution: '1 × 5 = 5',
    question: `Transform the sentences as directed:
(a) Honest people lead a very simple life. (Exclamatory)
(b) They never tell a lie. (Affirmative)
(c) We should always respect the honest. (Passive voice)
(d) Truthfulness is greater than most other virtues. (Superlative)
(e) A dishonest man can never be truly happy. (Interrogative)`,
    answer: `Answers:
(a) What a simple life honest people lead!
(b) They always speak the truth.
(c) The honest should always be respected by us.
(d) Truthfulness is one of the greatest virtues.
(e) Can a dishonest man ever be truly happy?`,
    type: 'short',
    boardInfo: 'যশোর বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 3
  },

  // =========================================================================
  // 3. NARRATION / DIRECT & INDIRECT SPEECH
  // =========================================================================
  {
    id: 'eng-board-nar-01',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Narration (Direct & Indirect Speech)',
    topic: '[বোর্ড মডেল] Passage Narration (Dhaka Board 2024)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '5',
    question: `Change the narrative style of the following text:
"Why are you putting up the food in your pocket, sir? Why don't you eat?" said the noble man to Sheikh Saadi. "I am doing the right thing. My dress deserves these rich dishes," replied Sheikh Saadi. "I don't understand what you mean to say," said the nobleman. "Please explain it to me."`,
    answer: `Answer:
The noble man respectfully asked Sheikh Saadi why he was putting up the food in his pocket and why he did not eat. Sheikh Saadi replied that he was doing the right thing and added that his dress deserved those rich dishes. The nobleman admitted that he did not understand what he meant to say and requested him politely to explain it to him.`,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 4
  },
  {
    id: 'eng-board-nar-02',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Narration (Direct & Indirect Speech)',
    topic: '[বোর্ড মডেল] Passage Narration (Rajshahi Board 2023)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '5',
    question: `Change the narrative style of the following text:
"Good morning, Rupa," said Kamal. "Have you completed the assignment on environmental pollution?" "No, I haven't done it yet because I was sick yesterday," she replied. "Don't worry, I can help you finish it within two hours," said Kamal. "Thank you very much for your kindness," said Rupa.`,
    answer: `Answer:
Kamal wished Rupa good morning and asked her if she had completed the assignment on environmental pollution. Rupa replied in the negative and explained that she had not done it yet because she had been sick the previous day. Kamal advised her not to worry and assured her that he could help her finish it within two hours. At this, Rupa thanked him very much for his kindness.`,
    type: 'short',
    boardInfo: 'রাজশাহী বোর্ড ২০২৩',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 4
  },
  {
    id: 'eng-board-nar-03',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Narration (Direct & Indirect Speech)',
    topic: '[বোর্ড মডেল] Sentence Narration (Class 8 & 9)',
    targetClass: '৮ম শ্রেণি',
    marks: 5,
    marksDistribution: '1 × 5 = 5',
    question: `Rewrite the following sentences into Indirect Speech:
(a) Father said to me, "Do not waste your time in idle pursuits."
(b) The teacher said to the boys, "The earth moves round the sun."
(c) He said to his friend, "May you pass the examination with GPA 5.00."
(d) Salma said, "Alas! I have lost my admission card."
(e) The policeman said to the driver, "Show me your driving license."`,
    answer: `Answers:
(a) Father advised me not to waste my time in idle pursuits.
(b) The teacher told the boys that the earth moves round the sun.
(c) He wished his friend that he might pass the examination with GPA 5.00.
(d) Salma exclaimed with sorrow that she had lost her admission card.
(e) The policeman ordered the driver to show him his driving license.`,
    type: 'short',
    boardInfo: 'চট্টগ্রাম বোর্ড ২০২৩',
    importance: 'high',
    part: 'Part A: Grammar',
    itemNumber: 4
  },

  // =========================================================================
  // 4. TAG QUESTIONS
  // =========================================================================
  {
    id: 'eng-board-tq-01',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Tag Questions',
    topic: '[বোর্ড মডেল] Tag Questions (Dhaka Board 2024)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '1 × 5 = 5',
    question: `Add tag questions to the following sentences:
(a) Nobody believes a liar, _______?
(b) Let's have a walk by the river side, _______?
(c) The mother rose in her at the sight of the crying orphan, _______?
(d) Neither of them was present at the morning assembly, _______?
(e) There is little water in the jug, _______?`,
    answer: `Answers:
(a) Nobody believes a liar, do they?
(b) Let's have a walk by the river side, shall we?
(c) The mother rose in her at the sight of the crying orphan, didn't it?
(d) Neither of them was present at the morning assembly, were they?
(e) There is little water in the jug, is there?`,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 5
  },
  {
    id: 'eng-board-tq-02',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Tag Questions',
    topic: '[বোর্ড মডেল] Tag Questions (Barishal Board 2024)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '1 × 5 = 5',
    question: `Add suitable tag questions:
(a) Barking dogs seldom bite, _______?
(b) You, he and I completed the science project together, _______?
(c) Please do me a favor, _______?
(d) Everything looked serene in the twilight, _______?
(e) He has scarcely any money left, _______?`,
    answer: `Answers:
(a) Barking dogs seldom bite, do they?
(b) You, he and I completed the science project together, didn't we?
(c) Please do me a favor, will you? / won't you?
(d) Everything looked serene in the twilight, didn't it?
(e) He has scarcely any money left, has he?`,
    type: 'short',
    boardInfo: 'বরিশাল বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 5
  },

  // =========================================================================
  // 5. COMPLETING SENTENCES (CLAUSES & CONDITIONALS)
  // =========================================================================
  {
    id: 'eng-board-csent-01',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Completing Sentences (Clauses & Conditionals)',
    topic: '[বোর্ড মডেল] Completing Sentences (Sylhet Board 2024)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '1 × 5 = 5',
    question: `Complete the sentences using suitable clauses or phrases:
(a) It is high time we _______ against food adulteration.
(b) Had I possessed huge wealth, I _______.
(c) Walk attentively lest you _______.
(d) 1971 is the year when _______.
(e) A student who does not study regularly cannot _______ in the examination.`,
    answer: `Answers:
(a) It is high time we raised our voice (or built resistance) against food adulteration.
(b) Had I possessed huge wealth, I would have helped the destitute and orphans.
(c) Walk attentively lest you should stumble and fall down.
(d) 1971 is the year when Bangladesh achieved her long-cherished independence.
(e) A student who does not study regularly cannot expect to do well / prosper in the examination.`,
    type: 'short',
    boardInfo: 'সিলেট বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 6
  },
  {
    id: 'eng-board-csent-02',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Completing Sentences (Clauses & Conditionals)',
    topic: '[বোর্ড মডেল] Completing Sentences (Dinajpur Board 2023)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '1 × 5 = 5',
    question: `Complete the following sentences:
(a) Unless you work hard, you _______.
(b) Five years have passed since _______.
(c) Danger often comes where _______.
(d) She spoke so fast that _______.
(e) As the weather was extremely rough, _______.`,
    answer: `Answers:
(a) Unless you work hard, you will not shine in life.
(b) Five years have passed since I met him last.
(c) Danger often comes where danger is feared.
(d) She spoke so fast that nobody could understand her words.
(e) As the weather was extremely rough, the launch could not leave the terminal.`,
    type: 'short',
    boardInfo: 'দিনাজপুর বোর্ড ২০২৩',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 6
  },

  // =========================================================================
  // 6. GAP FILLING (PREPOSITIONS & ARTICLES / DETERMINERS)
  // =========================================================================
  {
    id: 'eng-board-gf-01',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Gap Filling (Prepositions & Articles)',
    topic: '[বোর্ড মডেল] Gap Filling with Articles & Prepositions (Dhaka Board 2024)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '0.5 × 10 = 5',
    question: `Fill in the blanks with suitable prepositions, articles, or zero articles (put a cross '×' where an article is not needed):

A library is (a) _______ storehouse of knowledge. It satisfies our eternal thirst (b) _______ knowledge of the unknown. In (c) _______ library, there are precious books (d) _______ different subjects written (e) _______ renowned scholars. Readers sit quietly in (f) _______ reading room and read attentively. Nobody is allowed to make (g) _______ noise there. (h) _______ discipline of a library must be maintained (i) _______ all costs. Books are indeed our best friends (j) _______ our journey through life.`,
    answer: `Answers:
(a) a
(b) for
(c) a
(d) on
(e) by
(f) the
(g) a
(h) The
(i) at
(j) in`,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 1
  },
  {
    id: 'eng-board-gf-02',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Gap Filling (Prepositions & Articles)',
    topic: '[বোর্ড মডেল] Appropriate Prepositions & Articles (Cumilla Board 2024)',
    targetClass: '৮ম শ্রেণি',
    marks: 5,
    marksDistribution: '0.5 × 10 = 5',
    question: `Fill in the blanks with suitable prepositions and articles:

Honesty is considered (a) _______ best policy. (b) _______ honest man never deviates (c) _______ the path of truth. He is respected (d) _______ everyone (e) _______ his upright character. On (f) _______ other hand, a dishonest person may prosper (g) _______ a short time, but he suffers (h) _______ the long run. We should instill the virtue of honesty (i) _______ our young generation right (j) _______ childhood.`,
    answer: `Answers:
(a) the
(b) An
(c) from
(d) by
(e) for
(f) the
(g) for
(h) in
(i) in / into
(j) from`,
    type: 'short',
    boardInfo: 'কুমিল্লা বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 1
  },

  // =========================================================================
  // 7. SENTENCE CONNECTORS & LINKING WORDS
  // =========================================================================
  {
    id: 'eng-board-conn-01',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Sentence Connectors & Linking Words',
    topic: '[বোর্ড মডেল] Sentence Connectors (Jashore Board 2024)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '0.5 × 10 = 5',
    question: `Use appropriate sentence connectors in the blank spaces of the following passage:

Trees are essential for our survival. (a) _______, they provide us with oxygen without which we cannot live a single moment. (b) _______, they supply us with timber, fruits and shade. (c) _______, unscrupulous people cut down trees indiscriminately. (d) _______, our ecology is facing great threats. (e) _______, if we do not plant trees on a massive scale, our country will turn into a desert. (f) _______, we must observe national tree plantation week seriously. (g) _______ government organizations, schools and colleges should take initiatives. (h) _______, media can play a vital role. (i) _______ public awareness is created, our environment cannot be saved. (j) _______, let us all join hands to make Bangladesh green again.`,
    answer: `Answers:
(a) Firstly / Indeed
(b) Secondly / Moreover
(c) But / However
(d) As a result / Consequently
(e) Furthermore / In fact
(f) Therefore / Hence
(g) Besides
(h) Similarly / In addition
(i) Unless
(j) So / Finally`,
    type: 'short',
    boardInfo: 'যশোর বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 7
  },

  // =========================================================================
  // 8. USE OF SUFFIX & PREFIX
  // =========================================================================
  {
    id: 'eng-board-sp-01',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Use of Suffix & Prefix',
    topic: '[বোর্ড মডেল] Suffix and Prefix (Dhaka Board 2024)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '0.5 × 10 = 5',
    question: `Complete the text adding suffixes, prefixes, or both with the root words given in the parenthesis:

Education is the backbone of a nation. It removes (a) _______ (dark) of ignorance. An (b) _______ (educate) man cannot contribute fruitfully to his society. Proper education enables a person to differentiate between right and wrong. It broadens our mental (c) _______ (horizon) and makes us (d) _______ (depend) thinkers. Illiteracy is a great curse and the main barrier to national (e) _______ (develop). Therefore, our government has made primary education free and (f) _______ (compel). We should also provide technical and (g) _______ (vocation) training so that our youth can become self-(h) _______ (reliant). Let us eradicate illiteracy (i) _______ (quick) to build a (j) _______ (prosper) Bangladesh.`,
    answer: `Answers:
(a) darkness
(b) uneducated
(c) horizon (or horizons)
(d) independent
(e) development
(f) compulsory
(g) vocational
(h) reliant
(i) quickly
(j) prosperous`,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 8
  },

  // =========================================================================
  // 9. PUNCTUATION & CAPITALIZATION
  // =========================================================================
  {
    id: 'eng-board-punc-01',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Punctuation & Capitalization',
    topic: '[বোর্ড মডেল] Punctuation & Capitalization (Dhaka Board 2024)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 5,
    marksDistribution: '5',
    question: `Use capitals and punctuation marks where necessary in the following text:
why are you looking so depressed asad asked my father i replied i have done badly in the mathematics exam dont worry my son work hard from today and you will overcome your weakness`,
    answer: `Answer:
"Why are you looking so depressed, Asad?" asked my father.
I replied, "I have done badly in the Mathematics exam."
"Don't worry, my son. Work hard from today, and you will overcome your weakness."`,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part A: Grammar',
    itemNumber: 9
  },
  {
    id: 'eng-board-punc-02',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Punctuation & Capitalization',
    topic: '[বোর্ড মডেল] Punctuation & Capitalization (Class 8 & 7)',
    targetClass: '৮ম শ্রেণি',
    marks: 5,
    marksDistribution: '5',
    question: `Use capitals and punctuation marks where necessary:
have you ever been to cox's bazar said nafisa no i have never been there replied tina but i wish to visit the longest sea beach in the world`,
    answer: `Answer:
"Have you ever been to Cox's Bazar?" said Nafisa.
"No, I have never been there," replied Tina. "But I wish to visit the longest sea beach in the world."`,
    type: 'short',
    boardInfo: 'দিনাজপুর বোর্ড ২০২৩',
    importance: 'high',
    part: 'Part A: Grammar',
    itemNumber: 9
  },

  // =========================================================================
  // 10. READING COMPREHENSION (SEEN / UNSEEN PASSAGE - 1ST PAPER)
  // =========================================================================
  {
    id: 'eng-board-rc-01',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Reading Comprehension (Seen/Unseen)',
    topic: '[বোর্ড মডেল] Seen Comprehension on 21st February (English 1st Paper)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 10,
    marksDistribution: '2 × 5 = 10',
    question: `Read the passage carefully and answer the questions that follow:
21 February is a memorable day in our national history. We observe the day every year as International Mother Language Day. The day is a national holiday. On this day, we pay tribute to the martyrs who laid down their lives to establish Bangla as a state language in undivided Pakistan in 1952. The struggle to achieve our language rights is known as the Language Movement. The seed of the Language Movement was sown on 21 March 1948 when Mohammad Ali Jinnah, the Governor General of Pakistan, declared in a public meeting in Dhaka that Urdu would be the only state language of Pakistan. The declaration raised a storm of protest all over the country.

Questions:
(a) Why is 21 February observed as International Mother Language Day worldwide?
(b) Who are given tribute on this memorable day and why?
(c) When was the seed of the Language Movement sown?
(d) What was Mohammad Ali Jinnah's controversial declaration in Dhaka?
(e) How did the people of East Bengal react to Jinnah's declaration?`,
    answer: `Answers:
(a) 21 February is observed as International Mother Language Day to honor the supreme sacrifice of the language martyrs of 1952 and to promote linguistic and cultural diversity worldwide.
(b) Tribute is paid to Salam, Barkat, Rafiq, Jabbar, and other courageous martyrs who laid down their lives to establish Bangla as a state language.
(c) The seed of the Language Movement was sown on 21 March 1948.
(d) Jinnah declared in a public gathering at Racecourse Ground that Urdu, and only Urdu, would be the state language of Pakistan.
(e) The people of East Bengal vehemently protested against the unjust declaration, shouting "No, No!" and launching persistent mass movements.`,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part A: Reading',
    itemNumber: 1
  },

  // =========================================================================
  // 11. WRITING & COMPOSITION (PART B - SSC & SCHOOLS)
  // =========================================================================
  {
    id: 'eng-board-comp-01',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Writing: Paragraph, CV & Application',
    topic: '[বোর্ড মডেল] CV with Cover Letter for Assistant Teacher (SSC Board Standard)',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 8,
    marksDistribution: '8',
    question: `Suppose you are Arif / Arifa. You have completed BA (Honours) in English and B.Ed. You have seen a vacancy advertisement in "The Daily Star" for the post of an 'Assistant Teacher in English' at Ideal Model High School, Dhaka. Now, write a CV with a cover letter for the advertised post. Your CV should not exceed one page.`,
    answer: `Model Outline & Format:
1. Formal Cover Letter addressing the Principal/Headmaster with date, subject line, reference to the newspaper advertisement, and expression of candidacy.
2. Curriculum Vitae (CV) containing:
   - Personal Details (Name, Father's Name, Mother's Name, DOB, Permanent Address, Contact No, Email)
   - Educational Qualifications (SSC, HSC, BA Honours, B.Ed with GPA/CGPA, Board/University, Year)
   - Skills & Language Proficiency (English Fluency, ICT Literacy)
   - Reference (Two respectable referees)
   - Signature & Date`,
    type: 'short',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part B: Composition',
    itemNumber: 10
  },
  {
    id: 'eng-board-comp-02',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Writing: Paragraph, CV & Application',
    topic: '[বোর্ড মডেল] Formal Letter / Application for Setting Up a Computer Club',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 10,
    marksDistribution: '10',
    question: `Write an application to the Headmaster / Principal of your school praying for setting up a modern computer club with internet facilities for the students.`,
    answer: `Model Outline:
- Date, Headmaster, School Name & Address
- Subject: Application for setting up a computer club.
- Sir, We, the students of your school, beg to state that ours is one of the most reputed schools in the district. But unfortunately, we do not have a computer club...
- Explanation of modern ICT needs for digital learning and global competition.
- Prayer for immediate establishment of the club.
- Yours obediently, On behalf of the students.`,
    type: 'short',
    boardInfo: 'রাজশাহী বোর্ড ২০২৩',
    importance: 'very_high',
    part: 'Part B: Composition',
    itemNumber: 11
  },
  {
    id: 'eng-board-comp-03',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Writing: Paragraph, CV & Application',
    topic: '[বোর্ড মডেল] Paragraph on "Price Hike of Essential Commodities"',
    targetClass: '৯ম-১০ম শ্রেণি',
    marks: 10,
    marksDistribution: '10',
    question: `Write a paragraph on "Price Hike of Essential Commodities" answering the following questions:
(a) What is price hike?
(b) What are the main causes behind this problem in our country?
(c) How does it affect the daily life of common and fixed-income people?
(d) What illegal activities by syndicate hoarders worsen the crisis?
(e) What remedial measures should the government take to curb price spiraling?`,
    answer: `Paragraph Guidelines:
Price hike means the abnormal and continuous increase in the market prices of daily essential commodities such as rice, oil, pulses, vegetables, and medicine. It is currently one of the most agonizing problems in Bangladesh... (150-200 words covering all prompt questions).`,
    type: 'short',
    boardInfo: 'চট্টগ্রাম বোর্ড ২০২৪',
    importance: 'very_high',
    part: 'Part B: Composition',
    itemNumber: 12
  },
  {
    id: 'eng-board-comp-04',
    subject: 'ইংরেজি',
    chapter: 'মডেল কোশ্চেন',
    grammarTopic: 'Writing: Paragraph, CV & Application',
    topic: '[বোর্ড মডেল] Dialogue on Preparation for Upcoming SSC Examination',
    targetClass: '৮ম শ্রেণি',
    marks: 10,
    marksDistribution: '10',
    question: `Write a dialogue between two friends, Fahim and Sajjad, discussing their preparation for the upcoming examination and how they plan to overcome difficulties in English and Mathematics.`,
    answer: `Model Dialogue:
Fahim: Hello Sajjad! How are you doing?
Sajjad: I am well, Fahim. But I'm feeling quite nervous about our upcoming examination...
(Contains 8-10 meaningful exchanges with greeting, discussion on weak areas, daily study timetable, revision strategy, and closing wishes).`,
    type: 'short',
    boardInfo: 'কুমিল্লা বোর্ড ২০২৩',
    importance: 'high',
    part: 'Part B: Composition',
    itemNumber: 12
  }
];

export const englishBoardQuestions: ShortQuestion[] = rawEnglishBoardQuestions.map(q => ({
  ...q,
  chapter: q.grammarTopic || q.chapter
}));
