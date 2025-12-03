import { useState, useEffect } from 'react';
import { XCircle, Lock } from 'lucide-react';
import { AccessGate } from './components/AccessGate';
import { MissionBriefing } from './components/MissionBriefing';
import { Quiz } from './components/Quiz';
import { AudioAnalyzer } from './components/AudioAnalyzer';
import { MarsMap } from './components/MarsMap';
import { Results } from './components/Results';
import { WrongAnswer } from './components/WrongAnswer';
import { HardwareConsole } from './components/HardwareConsole';
import { Congratulations } from './components/Congratulations';
import { QuizLockoutScreen } from './components/QuizLockoutScreen';

const BUFFER_TIME = 180; // 3 minutes = 180 seconds

export default function App() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizFailed, setQuizFailed] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [trialsRemaining, setTrialsRemaining] = useState(2);
  const [isInBuffer, setIsInBuffer] = useState(false);
  const [bufferTimeRemaining, setBufferTimeRemaining] = useState(0);
  const [showHardwareConsole, setShowHardwareConsole] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  // Initialize lockout state from localStorage
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('round3b_quiz_lockout');
    return saved ? parseInt(saved, 10) : null;
  });

  // Lockout timer effect
  useEffect(() => {
    if (!lockoutEndTime) return;

    const checkLockout = () => {
      const now = Date.now();
      if (now >= lockoutEndTime) {
        setLockoutEndTime(null);
        localStorage.removeItem('round3b_quiz_lockout');
        // Reset game state when lockout expires
        setGameStarted(false);
        setQuizPassed(false);
        setQuizFailed(false);
      }
    };

    // Check immediately
    checkLockout();

    // Check every second
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [lockoutEndTime]);

  // Buffer timer effect
  useEffect(() => {
    if (!isInBuffer) return;

    const timer = setInterval(() => {
      setBufferTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsInBuffer(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isInBuffer]);

  // Check for session access on mount
  useEffect(() => {
    // Check for redirect flag from HardwareConsole refresh
    if (localStorage.getItem('redirect_to_root') === 'true') {
      localStorage.removeItem('redirect_to_root');
      window.location.href = '/';
      return;
    }

    const accessGranted = sessionStorage.getItem('round3b_access_granted') === 'true';
    setHasAccess(accessGranted);

    if (!accessGranted) {
      // Clear any stale data
      sessionStorage.removeItem('round3b_access_granted');
    }
  }, []);

  // Disable right-click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Scroll to top on game state changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [gameStarted, quizPassed, quizFailed, showHardwareConsole, showCongratulations, isCorrect]);

  const handleAnswerSubmit = (answer: string) => {
    setUserAnswer(answer);
    // Check if answer is "Valles Deep" (case insensitive)
    const correct = answer.toLowerCase().trim() === 'valles deep';
    setIsCorrect(correct);

    // Decrement trials if wrong
    if (!correct) {
      setTrialsRemaining(prev => prev - 1);
    }
  };

  const handleAccessGranted = () => {
    setIsGateOpen(true);
  };

  const handleReset = () => {
    setGameStarted(false);
    setQuizPassed(false);
    setQuizFailed(false);
    setUserAnswer(null);
    setIsCorrect(null);
    setTrialsRemaining(2);
    setShowHardwareConsole(false);
    setShowCongratulations(false);
    // Note: We don't reset isGateOpen or hasAccess here to keep them logged in
  };

  const handleShowHardwareConsole = () => {
    setShowHardwareConsole(true);
  };

  const handleHardwareComplete = () => {
    setShowCongratulations(true);
  };

  const handleQuizPass = () => {
    setQuizPassed(true);
  };

  const handleQuizFail = () => {
    setQuizFailed(true);
  };

  const handleQuizFailedAllAttempts = () => {
    // Trigger lockout
    const endTime = Date.now() + (3 * 60 * 1000); // 3 minutes from now
    setLockoutEndTime(endTime);
    localStorage.setItem('round3b_quiz_lockout', endTime.toString());

    setGameStarted(false);
    setQuizPassed(false);
    setQuizFailed(false);
  };

  const handleRetryQuiz = () => {
    setQuizFailed(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🚀</span>
            <h1 className="text-cyan-400">SIGNAL RESCUE LITE</h1>
            <span className="text-4xl">📡</span>
          </div>
          <p className="text-xl text-orange-400">"Find the Alien Beacon!"</p>
        </header>



        {lockoutEndTime ? (
          <QuizLockoutScreen unlockAt={lockoutEndTime} />
        ) : !hasAccess ? (
          <div className="min-h-screen bg-gradient-to-b from-pink-100 via-white to-white flex items-center justify-center p-4 font-sans fixed inset-0 z-50">
            <div className="max-w-4xl w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
              <div className="p-12 flex flex-col items-center">
                {/* Lock Icon */}
                <div className="mb-8 opacity-20">
                  <Lock className="w-24 h-24 text-slate-400" />
                </div>

                {/* Title */}
                <h1 className="text-2xl text-slate-600 tracking-widest mb-4">
                  ACCESS DENIED
                </h1>

                {/* Subtitle */}
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-500 font-bold tracking-wide text-sm">
                    CLEARANCE LEVEL INSUFFICIENT
                  </span>
                </div>

                {/* Error Code Box */}
                <div className="w-full max-w-3xl mb-8">
                  <div className="relative w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 text-center font-mono tracking-widest uppercase">
                    ERROR CODE: R3B_UNAUTHORIZED
                  </div>
                </div>

                {/* Grey Message Box */}
                <div className="w-full max-w-4xl bg-slate-500 rounded-lg p-8 mb-8 text-center shadow-inner">
                  <p className="text-slate-300 text-lg">
                    This area is <span className="text-amber-400 font-bold">restricted</span> to authorized personnel only.
                  </p>
                  <p className="text-slate-300 text-lg">
                    Complete Round 3 Data Validation to gain access credentials.
                  </p>
                </div>

                {/* Footer Message */}
                <div className="text-center">
                  <p className="text-slate-400 text-xs flex items-center justify-center gap-2">
                    Nice try, you sneaky lil thing... but you'll need to solve the previous mission first! 🕵️
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : !isGateOpen ? (
          <AccessGate onAccessGranted={handleAccessGranted} />
        ) : !gameStarted ? (
          <MissionBriefing
            onStart={() => setGameStarted(true)}
            isInBuffer={isInBuffer}
            bufferTimeRemaining={bufferTimeRemaining}
          />
        ) : !quizPassed && !quizFailed ? (
          <Quiz
            onPass={handleQuizPass}
            onFail={handleQuizFail}
            onFailedAllAttempts={handleQuizFailedAllAttempts}
          />
        ) : quizFailed ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 border-2 border-red-400 rounded-lg p-8 shadow-2xl text-center">
              <XCircle size={64} className="mx-auto mb-4 text-white" />
              <h2 className="text-3xl mb-4">QUALIFICATION TEST FAILED</h2>
              <p className="text-xl mb-4">
                You did not answer all questions correctly or ran out of time.
              </p>
              <p className="text-gray-200">
                You must pass the qualification test to proceed to the mission.
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRetryQuiz}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 py-3 px-6 rounded-lg transition-all shadow-lg shadow-orange-500/50"
              >
                RETRY QUIZ
              </button>
            </div>
          </div>
        ) : (
          <>
            {showCongratulations ? (
              <Congratulations onReset={handleReset} />
            ) : showHardwareConsole ? (
              <HardwareConsole onComplete={handleHardwareComplete} />
            ) : isCorrect === null ? (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="lg:col-span-1">
                  <AudioAnalyzer
                    onAnswerSubmit={handleAnswerSubmit}
                    trialsRemaining={trialsRemaining}
                  />
                </div>
                <div className="lg:col-span-1">
                  <MarsMap highlightedRegion={null} />
                </div>
              </div>
            ) : isCorrect ? (
              <Results
                region="Valles Deep"
                onReset={handleReset}
                onContinue={handleShowHardwareConsole}
              />
            ) : trialsRemaining > 0 ? (
              <WrongAnswer
                userAnswer={userAnswer!}
                trialsRemaining={trialsRemaining}
                onTryAgain={() => {
                  setUserAnswer(null);
                  setIsCorrect(null);
                }}
                onReset={handleReset}
              />
            ) : (
              <WrongAnswer
                userAnswer={userAnswer!}
                trialsRemaining={0}
                onTryAgain={() => { }}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </div>
    </div >
  );
}
