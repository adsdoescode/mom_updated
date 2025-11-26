import { useState, useEffect } from 'react';
import { RiddleRound } from './components/RiddleRound';
import { CodeExecutor } from './components/CodeExecutor';
import { MapReveal } from './components/MapReveal';
import { PasswordEntry } from './components/PasswordEntry';
import { RoundThree } from './components/RoundThree';
import { SlidingPuzzle } from './components/SlidingPuzzle';
import { Button } from './components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function App() {
  const stages = ['puzzle', 'code', 'riddles', 'map', 'password', 'round3'] as const;
  type Stage = typeof stages[number];

  const [currentStage, setCurrentStage] = useState<Stage>('puzzle');
  const [maxStage, setMaxStage] = useState<Stage>('puzzle');

  const advanceStage = (nextStage: Stage) => {
    setCurrentStage(nextStage);
    const nextIndex = stages.indexOf(nextStage);
    const maxIndex = stages.indexOf(maxStage);
    if (nextIndex > maxIndex) {
      setMaxStage(nextStage);
    }
  };
  const [riddleAnswers, setRiddleAnswers] = useState({ a: 0, b: 0, c: 0 });
  const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0 });
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  // Check for session access on mount
  useEffect(() => {
    const accessGranted = sessionStorage.getItem('round2_access_granted') === 'true';
    setHasAccess(accessGranted);

    if (!accessGranted) {
      // Clear any stale data
      sessionStorage.removeItem('round2_access_granted');
    }
  }, []);

  // Show error if access not granted
  if (hasAccess === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <div className="relative max-w-2xl w-full">
          {/* Animated background glow - using multiple layers for better color */}
          <div className="absolute inset-0 rounded-2xl animate-pulse"
            style={{
              boxShadow: '0 0 80px 40px rgba(168, 85, 247, 0.4), 0 0 120px 60px rgba(245, 158, 11, 0.3)',
              background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.15) 0%, rgba(245, 158, 11, 0.15) 50%, rgba(168, 85, 247, 0.15) 100%)'
            }}
          />

          {/* Main card */}
          <div className="relative bg-slate-900/90 backdrop-blur-2xl rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-purple-600 via-amber-500 to-purple-600 animate-pulse" />

            <div className="px-8 py-12 sm:px-12 sm:py-16">
              {/* Lock icon with animation */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative bg-gradient-to-br from-purple-600 to-amber-600 p-6 rounded-full">
                    <svg
                      className="w-16 h-16 text-white animate-pulse"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-amber-400 to-purple-400 animate-pulse">
                  ACCESS DENIED
                </span>
              </h1>

              {/* Subtitle */}
              <div className="text-center mb-6">
                <p className="text-amber-400 text-xl font-semibold mb-2 tracking-wide">
                  🔒 CLEARANCE LEVEL INSUFFICIENT
                </p>
                <div className="inline-block bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
                  <p className="text-red-400 font-mono text-sm">
                    ERROR CODE: R2_UNAUTHORIZED
                  </p>
                </div>
              </div>

              {/* Message */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20 mb-6">
                <p className="text-slate-300 text-center text-lg leading-relaxed">
                  This area is <span className="text-amber-400 font-semibold">restricted</span> to authorized personnel only.
                  <br />
                  <span className="text-purple-400">Complete Round 1</span> to gain access credentials.
                </p>
              </div>

              {/* Fun message */}
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-4">
                  Nice try, you sneaky lil thing... but you'll need to solve the first mission first! 🕵️
                </p>

                {/* Animated warning stripes */}
                <div className="flex justify-center gap-2 opacity-50">
                  <div className="w-8 h-1 bg-amber-500 animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-8 h-1 bg-amber-500 animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-8 h-1 bg-amber-500 animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>

            {/* Bottom accent bar */}
            <div className="h-1 bg-gradient-to-r from-purple-600 via-amber-500 to-purple-600 animate-pulse" />
          </div>

          {/* Corner decorations */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-purple-500/50 rounded-tl-lg" />
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-purple-500/50 rounded-tr-lg" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/50 rounded-bl-lg" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500/50 rounded-br-lg" />
        </div>
      </div>
    );
  }

  // Show loading while checking access
  if (hasAccess === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300 text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className={`container mx-auto px-4 py-8 ${currentStage === 'puzzle' ? 'max-w-7xl' : 'max-w-4xl'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-amber-400 text-3xl font-bold mb-2">
            🔐 COORDINATE CIPHER CHALLENGE
          </h1>
          <p className="text-slate-300">
            Solve the riddles • Execute the code • Find the location • Unlock Round 3
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {stages.map((stage, idx) => {
            const isUnlocked = stages.indexOf(stage) <= stages.indexOf(maxStage);
            return (
              <div
                key={stage}
                onClick={() => {
                  if (isUnlocked) {
                    setCurrentStage(stage);
                  }
                }}
                className={`h-2 w-16 rounded-full transition-all ${isUnlocked ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'
                  } ${currentStage === stage
                    ? 'bg-amber-400'
                    : stages.indexOf(currentStage) > idx
                      ? 'bg-green-500'
                      : 'bg-slate-700'
                  }`}
              />
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between mb-8 max-w-2xl mx-auto">
          <Button
            onClick={() => {
              const currentIndex = stages.indexOf(currentStage);
              if (currentIndex > 0) {
                setCurrentStage(stages[currentIndex - 1]);
              }
            }}
            disabled={stages.indexOf(currentStage) === 0}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={() => {
              const currentIndex = stages.indexOf(currentStage);
              if (currentIndex < stages.length - 1) {
                setCurrentStage(stages[currentIndex + 1]);
              }
            }}
            disabled={
              stages.indexOf(currentStage) >= stages.indexOf(maxStage) ||
              stages.indexOf(currentStage) === stages.length - 1
            }
            className="bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-30"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur rounded-lg p-8 border border-slate-700 shadow-2xl">
          {currentStage === 'puzzle' && (
            <SlidingPuzzle
              onComplete={() => advanceStage('code')}
              isCompleted={stages.indexOf('puzzle') < stages.indexOf(maxStage)}
            />
          )}

          {currentStage === 'code' && (
            <CodeExecutor
              answers={{ a: 123456, b: 45, c: 6789 }} // Test data for debugging phase
              onExecute={() => {
                advanceStage('riddles');
              }}
              isCompleted={stages.indexOf('code') < stages.indexOf(maxStage)}
            />
          )}

          {currentStage === 'riddles' && (
            <RiddleRound
              onComplete={(answers) => {
                setRiddleAnswers(answers);
                // Calculate coordinates based on the solved riddles
                const lat = answers.a / 10000.0;
                const lon = -(answers.b + answers.c / 10000.0);
                setCoordinates({ lat, lon });
                advanceStage('map');
              }}
              isCompleted={stages.indexOf('riddles') < stages.indexOf(maxStage)}
            />
          )}

          {currentStage === 'map' && (
            <MapReveal
              coordinates={coordinates}
              onContinue={() => advanceStage('password')}
              isCompleted={stages.indexOf('map') < stages.indexOf(maxStage)}
            />
          )}

          {currentStage === 'password' && (
            <PasswordEntry
              onCorrectPassword={() => advanceStage('round3')}
              isCompleted={stages.indexOf('password') < stages.indexOf(maxStage)}
            />
          )}

          {currentStage === 'round3' && <RoundThree />}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>Mission Classification: TOP SECRET • Clearance Level: RESTRICTED</p>
        </div>
      </div>
    </div >
  );
}
