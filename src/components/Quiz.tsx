import React, { useState } from 'react';
import './Quiz.css';

export type OptionLetter = 'A' | 'B' | 'C' | 'D';

export const OPTION_CODE: Record<OptionLetter, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
};

export const QUIZ_RULES = `
RULES:
1) There are 10 MCQs. Choose A / B / C / D for each.
2) Each option has a numeric code: A = 1, B = 2, C = 3, D = 4.
3) After selecting answers for ALL questions, press SUBMIT exactly once.
4) On submit:
   - Your chosen options will turn GREEN if correct and RED if wrong.
   - Wrong choices will NOT reveal the correct answer.
5) Final System Access Code = Sum of codes (A=1, B=2, C=3, D=4) for all CORRECT answers.
For example, if there are 6 questions with options A, B, C, A, D, B, your code would be 1 + 2 + 3 + 1 + 4 + 2 = 13.
`;

export type MCQ = {
  id: number;
  type: 'mcq';
  question: string;
  options: [string, string, string, string];
  
};

// Obfuscation utility functions
const SALT = 'MARS_ORBITER_1999_QUIZ_SECRET';
const encodeAnswer = (questionId: number, answer: OptionLetter): string => {
  const answerIndex = OPTION_CODE[answer] - 1; // 0-3
  const combined = `${questionId}-${answerIndex}-${SALT}`;
  // Simple hash-like encoding
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return btoa(String(hash)).replace(/[+/=]/g, (m) => ({ '+': '-', '/': '_', '=': '' }[m] || ''));
};

const verifyAnswer = (questionId: number, userAnswer: OptionLetter, encodedAnswer: string): boolean => {
  return encodeAnswer(questionId, userAnswer) === encodedAnswer;
};

// Obfuscated answer keys (pre-computed encoded hashes)
// Answers are encoded using a hash function with a salt to prevent inspection
// The actual answers are not stored in plain text anywhere in the code
const ANSWER_KEYS: string[] = [
  'MTkxNTE0ODc5Ng',
  'LTI2ODUyODEzMQ',
  'LTE3NTA2MDUxODQ',
  'MzYwNjg1MTg1',
  'MjEyMTE3NTYxNw',
  'NjM5MDk4NTY0',
  'MTY5Nzk4OTEyMg',
  'LTQ4NTY4NzgwNQ',
  'MTk3NjQwMjUwMQ',
  'LTE0ODY2NDExNzQ'
];

export const questions: MCQ[] = [
  {
    id: 1,
    type: 'mcq',
    question: `What is the output of print(len([i for i in range(0, 60, 15)])) ?`,
    options: [
      '4 (0, 15, 30, 45 are 4 readings)',
      '3 (0, 15, 30)',
      '5 (0, 15, 30, 45, 60)',
      '2 (only start and end counted)'
    ]
  },
  {
    id: 2,
    type: 'mcq',
    question: `What is the output of printf("%d", a++ + ++b) if int a = 2, b = 3; ?`,
    options: [
      '6 (2 + 4 = 6)',
      '5 (postfix and prefix cancel)',
      '7 (unexpected increment)',
      '4 (original values only)'
    ]
  },
  {
    id: 3,
    type: 'mcq',
    question: `What is the output of System.out.println(x * 2 + 3) if int x = 5; ?`,
    options: [
      '10 (x * 2)',
      '12 (x * 2 + 2)',
      '13 (5 * 2 + 3 = 13)',
      '15 (x * 3)'
    ]
  },
  {
    id: 4,
    type: 'mcq',
    question: `What was the first U.S. space program to send an astronaut to orbit the Earth?`,
    options: [
      'Gemini (later 2-astronaut missions)',
      'Apollo (moon missions)',
      'Mercury (first US orbital program)',
      'Skylab (space station)'
    ]
  },
  {
    id: 5,
    type: 'mcq',
    question: `What is the output of cout << meters / 1000.0 if double meters = 5000; ?`,
    options: [
      '5000 (no division)',
      '5.0 (5000 / 1000)',
      '0.5 (decimal shift)',
      '50 (incorrect scale)'
    ]
  },
  {
    id: 6,
    type: 'mcq',
    question: `The Curiosity and Perseverance Mars rovers primarily use six of which component for mobility?`,
    options: [
      'Tracks',
      'Legs',
      'Propellers',
      'Wheels'
    ]
  },
  {
    id: 7,
    type: 'mcq',
    question: `What is the output of console.log(data.map(x => x/4)) if let data = [4, 8, 12]; ?`,
    options: [
      '[1, 2, 3]',
      '[4, 8, 12]',
      '[0.25, 0.5, 0.75]',
      '[2, 4, 6]'
    ]
  },
  {
    id: 8,
    type: 'mcq',
    question: `Which planet is the focus of NASA's Juno mission?`,
    options: [
      'Jupiter',
      'Mars',
      'Saturn',
      'Venus'
    ]
  },
  {
    id: 9,
    type: 'mcq',
    question: `In Object Oriented Programming, the concept where one class can inherit features from another is called:`,
    options: [
      'Encapsulation',
      'Inheritance',
      'Polymorphism',
      'Abstraction'
    ]
  },
  {
    id: 10,
    type: 'mcq',
    question: `Which planet is commonly referred to as the "Red Planet"?`,
    options: [
      'Mars',
      'Venus',
      'Jupiter',
      'Mercury'
    ]
  }
];

interface QuizProps {
  onClose: () => void;
}

export default function Quiz({ onClose }: QuizProps) {
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<OptionLetter[]>(new Array(questions.length).fill(null));
  const [showRules, setShowRules] = useState(true);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (!submitted) {
      const optionLetters: OptionLetter[] = ['A', 'B', 'C', 'D'];
      const newAnswers = [...answers];
      newAnswers[questionIndex] = optionLetters[optionIndex];
      setAnswers(newAnswers);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const allAnswered = answers.every(answer => answer !== null);

  const calculateAccessCode = () => {
    let code = 0;
    questions.forEach((question, index) => {
      // Use obfuscated answer verification
      if (answers[index] && verifyAnswer(question.id, answers[index], ANSWER_KEYS[index])) {
        code += OPTION_CODE[answers[index]];
      }
    });
    return code;
  };

  if (showRules) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>Quiz Rules</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="quiz-rules">
          <pre>{QUIZ_RULES}</pre>
        </div>
        <div className="quiz-footer">
          <button 
            className="submit-button"
            onClick={() => setShowRules(false)}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>System Access Quiz</h2>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>

      <div className="quiz-content">
        {questions.map((question, questionIndex) => (
          <div key={question.id} className="question-block">
            <h3>{question.id}. {question.question}</h3>
            <div className="options">
              {question.options.map((option, optionIndex) => {
                const optionLetters: OptionLetter[] = ['A', 'B', 'C', 'D'];
                const optionLetter = optionLetters[optionIndex];
                const isSelected = answers[questionIndex] === optionLetter;
                // Use obfuscated answer verification instead of direct comparison
                const isCorrect = submitted ? verifyAnswer(question.id, optionLetter, ANSWER_KEYS[questionIndex]) : false;
                let className = 'option';

                if (submitted) {
                  if (isSelected && isCorrect) {
                    className += ' correct';
                  } else if (isSelected && !isCorrect) {
                    className += ' incorrect';
                  }
                }

                return (
                  <button
                    key={optionIndex}
                    className={className}
                    onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                    disabled={submitted}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={isSelected}
                      onChange={() => {}}
                    />
                    <label><strong>{optionLetter}.</strong> {option}</label>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {submitted && (
        <div className="access-code">
          <p><strong>System Access Code:</strong> {calculateAccessCode()}</p>
        </div>
      )}

      <div className="quiz-footer">
        {!submitted && (
          <button 
            className="submit-button"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Submit Quiz
          </button>
        )}
        {submitted && (
          <button className="close-button-footer" onClick={onClose}>
            Close Quiz
          </button>
        )}
      </div>
    </div>
  );
}