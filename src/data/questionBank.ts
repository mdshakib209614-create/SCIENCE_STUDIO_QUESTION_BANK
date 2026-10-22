import { QuestionItem } from '../types';
import { physicsQuestions } from './questions/physicsQuestions';
import { chemistryQuestions } from './questions/chemistryQuestions';
import { mathQuestions } from './questions/mathQuestions';
import { higherMathQuestions } from './questions/higherMathQuestions';
import { biologyQuestions } from './questions/biologyQuestions';
import { ictQuestions } from './questions/ictQuestions';
import { englishQuestions } from './questions/englishQuestions';
import { bgsQuestions } from './questions/bgsQuestions';
import { scienceQuestions } from './questions/scienceQuestions';
import { banglaQuestions } from './questions/banglaQuestions';

import { physicsCQQuestions } from './cq/physicsCQ';
import { chemistryCQQuestions } from './cq/chemistryCQ';
import { mathCQQuestions } from './cq/mathCQ';
import { higherMathCQQuestions } from './cq/higherMathCQ';
import { biologyCQQuestions } from './cq/biologyCQ';
import { ictCQQuestions } from './cq/ictCQ';
import { englishCQQuestions } from './cq/englishCQ';
import { bgsCQQuestions } from './cq/bgsCQ';
import { scienceCQQuestions } from './cq/scienceCQ';
import { banglaCQQuestions } from './cq/banglaCQ';

import { allShortQuestions } from './shortQuestions';
import { englishBoardQuestions } from './questions/englishBoardQuestions';
import { generateEnglishModelQuestions } from './questions/englishModelQuestionsGenerator';
import { generateSubjectQuestions } from './questionGenerator';
import { generateAllJuniorQuestions } from './juniorClassQuestionGenerator';

// Generate comprehensive 500+ authentic English Board Model Questions across all topics
export const englishModelQuestions = generateEnglishModelQuestions();

// Generate 1000+ authentic questions per subject for Class 6, Class 7, and Class 8
export const allJuniorQuestions = generateAllJuniorQuestions();

// Generate comprehensive 1000+ MCQs per subject for Class 9-10 (SSC)
export const allPhysicsQuestions = generateSubjectQuestions('পদার্থবিজ্ঞান', physicsQuestions, 1000);
export const allChemistryQuestions = generateSubjectQuestions('রসায়ন', chemistryQuestions, 1000);
export const allMathQuestions = generateSubjectQuestions('সাধারণ গণিত', mathQuestions, 1000);
export const allHigherMathQuestions = generateSubjectQuestions('উচ্চতর গণিত', higherMathQuestions, 1000);
export const allBiologyQuestions = generateSubjectQuestions('জীববিজ্ঞান', biologyQuestions, 1000);
export const allIctQuestions = generateSubjectQuestions('তথ্য ও যোগাযোগ প্রযুক্তি', ictQuestions, 1000);
export const allBgsQuestions = generateSubjectQuestions('বাংলাদেশ ও বিশ্ব পরিচয়', bgsQuestions, 1000);
export const allScienceQuestions = generateSubjectQuestions('বিজ্ঞান', scienceQuestions, 1000);
export const allBanglaQuestions = generateSubjectQuestions('বাংলা', banglaQuestions, 1000);

export const initialQuestionBank: QuestionItem[] = [
  ...allJuniorQuestions,
  ...englishBoardQuestions,
  ...englishModelQuestions,
  ...englishCQQuestions,
  ...allPhysicsQuestions,
  ...physicsCQQuestions,
  ...allChemistryQuestions,
  ...chemistryCQQuestions,
  ...allMathQuestions,
  ...mathCQQuestions,
  ...allHigherMathQuestions,
  ...higherMathCQQuestions,
  ...allBiologyQuestions,
  ...biologyCQQuestions,
  ...allIctQuestions,
  ...ictCQQuestions,
  ...allBgsQuestions,
  ...bgsCQQuestions,
  ...allScienceQuestions,
  ...scienceCQQuestions,
  ...allBanglaQuestions,
  ...banglaCQQuestions,
  ...allShortQuestions
];

export { 
  classesList,
  classSubjectsMap,
  getChaptersForClassAndSubject,
  subjectsList, 
  chaptersBySubject,
  englishGrammarTopics
} from './chaptersData';
export { englishBoardQuestions } from './questions/englishBoardQuestions';
