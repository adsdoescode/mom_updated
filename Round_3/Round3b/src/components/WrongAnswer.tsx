import { XCircle, RotateCcw, Home } from 'lucide-react';

interface WrongAnswerProps {
  userAnswer: string;
  trialsRemaining: number;
  onTryAgain: () => void;
  onReset: () => void;
}

export function WrongAnswer({ userAnswer, trialsRemaining, onTryAgain, onReset }: WrongAnswerProps) {
  const isGameOver = trialsRemaining === 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Trials Remaining Banner */}
      {!isGameOver && (
        <div className={`border-2 rounded-lg p-4 text-center ${
          trialsRemaining === 1 
            ? 'bg-yellow-950/50 border-yellow-500' 
            : 'bg-orange-950/50 border-orange-500'
        }`}>
          <p className={`text-xl ${trialsRemaining === 1 ? 'text-yellow-400' : 'text-orange-400'}`}>
            ⚠️ TRIALS REMAINING: <span className="text-3xl font-bold">{trialsRemaining}</span>
          </p>
        </div>
      )}

      {/* Error Banner */}
      <div className={`border-2 rounded-lg p-8 shadow-2xl text-center ${
        isGameOver 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-600 shadow-gray-500/50'
          : 'bg-gradient-to-r from-red-600 to-orange-600 border-red-400 shadow-red-500/50'
      }`}>
        <div className="flex items-center justify-center gap-4 mb-4">
          <XCircle size={48} className="text-white" />
          <h2 className="text-3xl">{isGameOver ? 'MISSION FAILED!' : 'INCORRECT LOCATION!'}</h2>
          <XCircle size={48} className="text-white" />
        </div>
        <p className="text-xl mb-4">
          {isGameOver 
            ? '💀 Out of trials - The survivor could not be rescued 💀'
            : '⚠️ The rescue team found no beacon at this location ⚠️'
          }
        </p>
        <div className="bg-black/30 rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-lg">
            <span className="text-yellow-300">Your Answer:</span> <span className="text-2xl">{userAnswer}</span>
          </p>
          <p className="text-sm text-gray-300 mt-3">
            {isGameOver
              ? 'You have used all your trials. Mission failed.'
              : 'This is not the correct beacon location. Try analyzing the frequency spectrum again!'
            }
          </p>
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border-2 border-cyan-500/50 rounded-lg p-6 shadow-2xl">
        <h3 className="text-xl mb-4 text-cyan-400">📋 ANALYSIS FEEDBACK</h3>
        <div className="space-y-3 text-gray-300">
          <p>❌ Rescue team dispatched to <span className="text-red-400">{userAnswer}</span></p>
          <p>❌ No distress signal detected at this location</p>
          {!isGameOver && <p>⚠️ Time is running out - the survivor needs your help!</p>}
          {isGameOver && <p className="text-red-400">💀 Mission failed - No more trials remaining</p>}
          {!isGameOver && (
            <p className="text-orange-400 mt-4">
              💡 <span className="text-white">Hint:</span> Analyze the complete audio recording carefully. 
              One frequency's signal pattern will be distinctly different from the others.
            </p>
          )}
          {isGameOver && (
            <p className="text-red-400 mt-4">
              💀 Mission terminated. Better luck next time.
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center flex-wrap">
        {!isGameOver ? (
          <button
            onClick={onTryAgain}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 py-3 px-6 rounded-lg transition-all shadow-lg shadow-orange-500/50"
          >
            <RotateCcw size={20} />
            TRY AGAIN ({trialsRemaining} {trialsRemaining === 1 ? 'TRIAL' : 'TRIALS'} LEFT)
          </button>
        ) : (
          <button
            onClick={onReset}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 py-3 px-6 rounded-lg transition-all"
          >
            <Home size={20} />
            RESTART MISSION
          </button>
        )}
      </div>

      {/* Educational Note */}
      {!isGameOver && (
        <div className="bg-yellow-950/30 border border-yellow-500/50 rounded-lg p-6 text-center text-sm text-gray-400">
          <p>
            🎓 <span className="text-yellow-400">Remember:</span> Study the waveform patterns throughout the entire recording. 
            The beacon signal will have a unique signature compared to background noise.
          </p>
        </div>
      )}
    </div>
  );
}
