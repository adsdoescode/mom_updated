import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, Shield } from 'lucide-react';

interface QuizProps {
  onPass: () => void;
  onFail: () => void;
  onFailedAllAttempts: () => void;
}

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct answer
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "Digital Systems",
    question: "A system uses 4-bit binary values. What is the maximum decimal number it can represent?",
    options: ["15", "16", "31"],
    correctAnswer: 0
  },
  {
    id: 2,
    category: "Electronics",
    question: "What is the primary function of a diode in a circuit?",
    options: [
      "To allow current to flow only in one direction",
      "To regulate and smooth voltage levels",
      "To store and release electrical energy"
    ],
    correctAnswer: 0
  },
  {
    id: 3,
    category: "Sensors",
    question: "Which of the following sensors is commonly used to measure distance using ultrasonic waves?",
    options: ["LDR sensor", "HC-SR04", "DHT11"],
    correctAnswer: 1
  },
  {
    id: 4,
    category: "Logic Gates",
    question: "Which logic gate outputs HIGH only when all its inputs are HIGH?",
    options: ["OR gate", "AND gate", "XOR gate"],
    correctAnswer: 1
  }
];

const TIME_LIMIT = 45; // 50 seconds
const MAX_ATTEMPTS = 2;

export function Quiz({ onPass, onFail, onFailedAllAttempts }: QuizProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUESTIONS.length).fill(null));
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(MAX_ATTEMPTS);
  const [showFailureMessage, setShowFailureMessage] = useState(false);

  // Quiz timer
  useEffect(() => {
    if (isSubmitted || hasTimedOut) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setHasTimedOut(true);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, hasTimedOut]);

  const handleTimeout = () => {
    // Check if all answered correctly
    const allCorrect = QUESTIONS.every((q, idx) => answers[idx] === q.correctAnswer);
    if (allCorrect && answers.every(a => a !== null)) {
      onPass();
    } else {
      handleFailure();
    }
  };

  const handleFailure = () => {
    const newAttempts = attemptsRemaining - 1;
    setAttemptsRemaining(newAttempts);
    setShowFailureMessage(true);

    if (newAttempts <= 0) {
      // All attempts used - go back to briefing with buffer
      setTimeout(() => {
        onFailedAllAttempts();
      }, 2000); // Wait 2 seconds before redirecting
    }
  };

  const handleRetry = () => {
    setAnswers(new Array(QUESTIONS.length).fill(null));
    setTimeRemaining(TIME_LIMIT);
    setIsSubmitted(false);
    setHasTimedOut(false);
    setShowFailureMessage(false);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (isSubmitted || hasTimedOut) return;
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (answers.some(a => a === null)) {
      alert('Please answer all questions before submitting!');
      return;
    }

    setIsSubmitted(true);

    // Check if all answers are correct
    const allCorrect = QUESTIONS.every((q, idx) => answers[idx] === q.correctAnswer);

    if (allCorrect) {
      onPass();
    } else {
      handleFailure();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const allAnswered = answers.every(a => a !== null);
  const timeColor = timeRemaining <= 10 ? 'text-red-400' : timeRemaining <= 25 ? 'text-yellow-400' : 'text-green-400';

  // Failure message screen
  if (showFailureMessage) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 border-2 border-red-400 rounded-lg p-8 shadow-2xl text-center">
          <XCircle size={64} className="mx-auto mb-4 text-white" />
          <h2 className="text-3xl mb-4">QUALIFICATION TEST FAILED</h2>
          <p className="text-xl mb-4">
            You did not answer all questions correctly or ran out of time.
          </p>
          <div className="bg-black/30 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-lg mb-2">
              <span className="text-yellow-300">Attempts Remaining:</span>
              <span className={`text-3xl ml-3 ${attemptsRemaining === 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                {attemptsRemaining}
              </span>
            </p>
            <p className="text-sm text-gray-300 mt-3">
              {attemptsRemaining > 0
                ? 'Review the questions carefully and try again!'
                : 'You have used all your attempts. Security lockout initiating...'
              }
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          {attemptsRemaining > 0 ? (
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 py-3 px-6 rounded-lg transition-all shadow-lg shadow-orange-500/50"
            >
              🔄 RETRY QUIZ
            </button>
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-lg">⏳ System Locking...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Timer and Attempts */}
      <div className="bg-gradient-to-r from-purple-950/50 to-blue-950/50 border-2 border-cyan-500/50 rounded-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-cyan-400 mb-2">⚡ PRE-MISSION QUALIFICATION TEST</h2>
            <p className="text-sm text-gray-400">Answer all questions correctly within the time limit to proceed</p>
          </div>
          <div className="flex gap-4">
            {/* Attempts Counter */}
            <div className="bg-orange-950/50 border-2 border-orange-500/70 rounded-lg px-4 py-2 text-center">
              <div className="text-xs text-gray-400">ATTEMPTS</div>
              <div className={`text-2xl ${attemptsRemaining === 2 ? 'text-green-400' : 'text-yellow-400'}`}>
                {attemptsRemaining} / {MAX_ATTEMPTS}
              </div>
            </div>
            {/* Timer */}
            <div className={`flex items-center gap-3 bg-black/40 border-2 ${timeRemaining <= 10 ? 'border-red-500' : timeRemaining <= 25 ? 'border-yellow-500' : 'border-green-500'
              } rounded-lg px-6 py-3`}>
              <Clock className={timeColor} size={32} />
              <div className="text-center">
                <div className="text-xs text-gray-400">TIME LEFT</div>
                <div className={`text-3xl ${timeColor}`}>{formatTime(timeRemaining)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {QUESTIONS.map((question, qIndex) => (
          <div
            key={question.id}
            className="bg-gradient-to-br from-blue-950/30 to-purple-950/30 border-2 border-cyan-500/30 rounded-lg p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                {qIndex + 1}
              </div>
              <div className="flex-1">
                <div className="text-xs text-purple-400 mb-2">🔹 {question.category}</div>
                <h3 className="text-lg text-white mb-4">{question.question}</h3>

                <div className="space-y-2">
                  {question.options.map((option, oIndex) => {
                    const isSelected = answers[qIndex] === oIndex;

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleAnswerSelect(qIndex, oIndex)}
                        disabled={isSubmitted || hasTimedOut}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected
                          ? 'bg-cyan-600/30 border-cyan-400 text-white'
                          : 'bg-black/20 border-gray-600 text-gray-300 hover:border-cyan-500/50 hover:bg-cyan-950/20'
                          } ${(isSubmitted || hasTimedOut) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-cyan-400 bg-cyan-600' : 'border-gray-500'
                            }`}>
                            {isSelected && <div className="w-3 h-3 rounded-full bg-white"></div>}
                          </div>
                          <span className="flex-1">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || isSubmitted || hasTimedOut}
          className={`flex items-center gap-3 px-8 py-4 rounded-lg text-lg transition-all ${allAnswered && !isSubmitted && !hasTimedOut
            ? 'bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 shadow-lg shadow-green-500/50 cursor-pointer'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
        >
          {allAnswered ? (
            <>
              <CheckCircle2 size={24} />
              SUBMIT ANSWERS
            </>
          ) : (
            <>
              <AlertCircle size={24} />
              ANSWER ALL QUESTIONS
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-950/30 border border-yellow-500/50 rounded-lg p-4 text-center text-sm text-gray-400">
        <p>
          ⚠️ <span className="text-yellow-400">Note:</span> You must answer all questions correctly to proceed to the mission.
          Time limit: 45 seconds | Attempts: {attemptsRemaining}
        </p>
      </div>
    </div>
  );
}
