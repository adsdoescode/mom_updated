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
1) There are 15 MCQs. Choose A / B / C / D for each.
2) Each option has a numeric code: A = 1, B = 2, C = 3, D = 4.
3) After selecting answers for ALL questions, press SUBMIT exactly once.
4) On submit:
   - Your chosen options will turn GREEN if correct and RED if wrong.
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
  'MTg0Mjc2MjIzOA',
  'LTM0MDkxNDY4OQ',
  'LTE4MjI5OTE3NDI',
  'LTYyNTAxMzEw',
  'MjA0ODc4OTA1OQ',
  'LTQ4NTY4NzgwNQ',
  'MTYyNTYwMjU2NA',
  'LTExMzU4NDEyMzc',
  'OTc1NDQ5MTMy',
  'LTEyMDgyMjc3OTU',
  'OTAzMDYyNTc0',
  'LTE2MzE0MTQyOTA',
  'ODMwNjc2MDE2'
];

export const questions: MCQ[] = [
  {
    id: 1,
    type: 'mcq',
    question: `What is the output of print(len([i for i in range(0, 60, 15)]))?`,
    options: [
      '4',
      '3',
      '5',
      '2'
    ]
  },
  {
    id: 2,
    type: 'mcq',
    question: `According to the mission briefing video, the failure of the spacecraft resulted from a risk in converting between which unit systems?`,
    options: [
      'Metric to Imperial',
      'Imperial to Metric',
      'Metric to Standard',
      'Standard to Imperial'
    ]
  },
  {
    id: 3,
    type: 'mcq',
    question: `What value is printed by printf("%d", a++ + ++b) if int a = 2, b = 3;?`,
    options: [
      '6',
      '5',
      '7',
      '4'
    ]
  },
  {
    id: 4,
    type: 'mcq',
    question: `In the official mission dossier, the mass of the spacecraft is listed at approximately:`,
    options: [
      '638 kg',
      '980 kg',
      '768 kg',
      '1120 kg'
    ]
  },
  {
    id: 5,
    type: 'mcq',
    question: `What is printed by System.out.println(x * 2 + 3) when int x = 5?`,
    options: [
      '10',
      '12',
      '13',
      '15'
    ]
  },
  {
    id: 6,
    type: 'mcq',
    question: `The publicly released cost figure for the mission is approximately:`,
    options: [
      '$672 million',
      '$327.6 million',
      '$450 million',
      '$210 million'
    ]
  },
  {
    id: 7,
    type: 'mcq',
    question: `What is the result of cout << meters / 1000.0 when double meters = 5000?`,
    options: [
      '5000',
      '5.0',
      '0.5',
      '50'
    ]
  },
  {
    id: 8,
    type: 'mcq',
    question: `The incident report indicates that the spacecraft entered Mars' atmosphere at approximately what altitude?`,
    options: [
      '~57 km',
      '~100 km',
      '~140 km',
      '~200 km'
    ]
  },
  {
    id: 9,
    type: 'mcq',
    question: `What is the output of [4, 8, 12].map(x => x / 4)?`,
    options: [
      '[1, 2, 3]',
      '[4, 8, 12]',
      '[0.25, 0.5, 0.75]',
      '[2, 4, 6]'
    ]
  },
  {
    id: 10,
    type: 'mcq',
    question: `The official analysis cites the root cause as a mismatch between:`,
    options: [
      'Temperature units vs. pressure units',
      'Metric units (Newtons) vs. Imperial units (pound-force)',
      'Time units (seconds vs. minutes)',
      'Distance units (meters vs. feet)'
    ]
  },
  {
    id: 11,
    type: 'mcq',
    question: `The mission documentation lists the propulsion type used as:`,
    options: [
      'Ion thrusters',
      'Hydrazine',
      'Chemical methane/oxygen',
      'Solar‐electric plasma'
    ]
  },
  {
    id: 12,
    type: 'mcq',
    question: `From launch to loss of contact, the mission lasted approximately:`,
    options: [
      'A few weeks',
      '~9 months',
      '~3 years',
      '~2 months'
    ]
  },
  {
    id: 13,
    type: 'mcq',
    question: `In the investigation notes, which phrase is used to describe how the unit mismatch manifested over time?`,
    options: [
      '"Software synchronization mismatch"',
      '"Cumulative navigation error"',
      '"Atmospheric density deviation"',
      '"Trajectory oscillation drift"'
    ]
  },
  {
    id: 14,
    type: 'mcq',
    question: `The mission briefing video thumbnail features a ruler graphic. Which annotation is shown near the ruler to emphasise the measurement systems?`,
    options: [
      '"standard units"',
      '"imperial units"',
      '"metric units"',
      '"system units"'
    ]
  },
  {
    id: 15,
    type: 'mcq',
    question: `In the technical parameter card, what term is used to denote the officially planned orbit altitude range?`,
    options: [
      '"Flight corridor: 110–120 km"',
      '"Planned Altitude: 140–150 km"',
      '"Target Height: 90–100 km"',
      '"Design Orbit: 160–170 km"'
    ]
  }
];

interface QuizProps {
  onClose: () => void;
  onAllCorrect?: (accessCode: number) => void;
  onQuizSubmitted?: (accessCode: number, allCorrect: boolean) => void;
}

export default function Quiz({ onClose, onAllCorrect, onQuizSubmitted }: QuizProps) {
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

  const allAnswersCorrect = () => {
    return questions.every((question, index) => {
      return answers[index] !== null && verifyAnswer(question.id, answers[index], ANSWER_KEYS[index]);
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const accessCode = calculateAccessCode();
    const allCorrect = allAnswersCorrect();
    
    // Always notify about submission with access code
    if (onQuizSubmitted) {
      onQuizSubmitted(accessCode, allCorrect);
    }
    
    // Also call onAllCorrect for backward compatibility
    if (allCorrect && onAllCorrect) {
      onAllCorrect(accessCode);
    }
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