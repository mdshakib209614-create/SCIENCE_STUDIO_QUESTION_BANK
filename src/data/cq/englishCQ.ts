import { CQQuestion } from '../../types';

export const englishCQQuestions: CQQuestion[] = [
  {
    id: 'cq-eng-01',
    subject: 'ইংরেজি',
    chapter: 'Reading Comprehension & Vocabulary',
    topic: 'Comprehension on Environment & Tree Plantation',
    targetClass: '৯ম-১০ম শ্রেণি',
    stimulus: 'Trees are our best friends. They give us food, shelter, oxygen, and protect our environment from global warming and soil erosion. Without trees, the earth would turn into a desert.',
    marks: 10,
    type: 'cq',
    boardInfo: 'ঢাকা বোর্ড ২০২৪',
    importance: 'very_high',
    subQuestions: [
      {
        label: 'ক',
        question: 'What do trees give us to breathe in?',
        marks: 1
      },
      {
        label: 'খ',
        question: 'Why are trees called our best friends? Explain in two sentences.',
        marks: 2
      },
      {
        label: 'গ',
        question: 'How do trees protect our ecology and soil from natural disasters?',
        marks: 3
      },
      {
        label: 'ঘ',
        question: '"Without trees, our existence is in peril." Analyze this statement with practical suggestions for mass tree plantation.',
        marks: 4
      }
    ]
  },
  {
    id: 'cq-eng-02',
    subject: 'ইংরেজি',
    chapter: 'Writing: Formal Letter & Paragraph',
    topic: 'Digital Bangladesh and Smart Education',
    targetClass: '৮ম শ্রেণি',
    stimulus: 'Modern technology has completely revolutionized the way young students learn today. Internet connectivity, multimedia classrooms, and interactive e-books facilitate continuous self-learning.',
    marks: 10,
    type: 'cq',
    boardInfo: 'চট্টগ্রাম বোর্ড ২০২৩',
    importance: 'high',
    subQuestions: [
      {
        label: 'ক',
        question: 'What is multimedia learning?',
        marks: 1
      },
      {
        label: 'খ',
        question: 'How does internet access help rural students?',
        marks: 2
      },
      {
        label: 'গ',
        question: 'Discuss the positive impacts of smart classrooms in secondary education.',
        marks: 3
      },
      {
        label: 'ঘ',
        question: 'Evaluate the role of educational technologies in building a skilled nation.',
        marks: 4
      }
    ]
  }
];
