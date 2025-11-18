import { useState } from 'react';
import { RiddleRound } from './components/RiddleRound';
import { CodeExecutor } from './components/CodeExecutor';
import { MapReveal } from './components/MapReveal';
import { PasswordEntry } from './components/PasswordEntry';
import { RoundThree } from './components/RoundThree';

export default function App() {
  const [currentStage, setCurrentStage] = useState<'riddles' | 'code' | 'map' | 'password' | 'round3'>('riddles');
  const [riddleAnswers, setRiddleAnswers] = useState({ a: 0, b: 0, c: 0 });
  const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-amber-400 mb-2">🔐 COORDINATE CIPHER CHALLENGE</h1>
          <p className="text-slate-300">Solve the riddles • Execute the code • Find the location • Unlock Round 3</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {['riddles', 'code', 'map', 'password', 'round3'].map((stage, idx) => (
            <div
              key={stage}
              className={`h-2 w-16 rounded-full transition-all ${
                currentStage === stage
                  ? 'bg-amber-400'
                  : ['riddles', 'code', 'map', 'password', 'round3'].indexOf(currentStage) > idx
                  ? 'bg-green-500'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur rounded-lg p-8 border border-slate-700 shadow-2xl">
          {currentStage === 'riddles' && (
            <RiddleRound
              onComplete={(answers) => {
                setRiddleAnswers(answers);
                setCurrentStage('code');
              }}
            />
          )}

          {currentStage === 'code' && (
            <CodeExecutor
              answers={riddleAnswers}
              onExecute={(lat, lon) => {
                setCoordinates({ lat, lon });
                setCurrentStage('map');
              }}
            />
          )}

          {currentStage === 'map' && (
            <MapReveal
              coordinates={coordinates}
              onContinue={() => setCurrentStage('password')}
            />
          )}

          {currentStage === 'password' && (
            <PasswordEntry
              onCorrectPassword={() => setCurrentStage('round3')}
            />
          )}

          {currentStage === 'round3' && <RoundThree />}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>Mission Classification: TOP SECRET • Clearance Level: RESTRICTED</p>
        </div>
      </div>
    </div>
  );
}
