import { MarsMap } from './MarsMap';
import { Rocket, Award, RotateCcw } from 'lucide-react';

interface ResultsProps {
  region: string;
  onReset: () => void;
  onContinue: () => void;
}

export function Results({ region, onReset, onContinue }: ResultsProps) {
  return (
    <div className="space-y-8">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 border-2 border-green-400 rounded-lg p-8 shadow-2xl shadow-green-500/50 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Rocket size={48} className="animate-bounce" />
          <h2 className="text-3xl">MISSION SUCCESS!</h2>
          <Award size={48} className="animate-bounce" />
        </div>
        <p className="text-xl mb-4">🎉 You've successfully decoded the distress beacon! 🎉</p>
        <div className="bg-black/30 rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-lg mb-2">
            <span className="text-yellow-300">Detected Frequency:</span> <span className="text-2xl">880 Hz</span>
          </p>
          <p className="text-lg">
            <span className="text-yellow-300">Correct Beacon Location:</span> <span className="text-2xl">{region}</span>
          </p>
        </div>
      </div>

      {/* Map with highlighted region */}
      <MarsMap highlightedRegion={region} />

      {/* Mission Complete Message */}
      <div className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border-2 border-cyan-500/50 rounded-lg p-6 shadow-2xl">
        <h3 className="text-xl mb-4 text-cyan-400">📋 MISSION REPORT</h3>
        <div className="space-y-3 text-gray-300">
          <p>✅ Audio telemetry successfully analyzed</p>
          <p>✅ FFT processing complete - peak frequency identified</p>
          <p>✅ Beacon location triangulated to <span className="text-orange-400">{region}</span></p>
          <p>✅ Rescue team dispatched</p>
          <p className="text-green-400 mt-4">🚀 The survivor has been rescued and is returning to base!</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onContinue}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 py-4 px-8 rounded-lg transition-all shadow-lg shadow-green-500/50 text-lg"
        >
          <Award size={24} />
          PROCEED TO ELECTRICAL ROOM
        </button>
      </div>

      {/* Educational Note */}
      <div className="bg-orange-950/30 border border-orange-500/50 rounded-lg p-6 text-center text-sm text-gray-400">
        <p>
          🎓 <span className="text-orange-400">Learning Point:</span> Fast Fourier Transform (FFT) is used in real space missions
          to analyze radio signals, identify communication frequencies, and process telemetry data from spacecraft!
        </p>
      </div>
    </div>
  );
}
