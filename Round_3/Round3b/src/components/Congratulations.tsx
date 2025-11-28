import { Sparkles, Trophy, Star, Rocket } from 'lucide-react';

interface CongratulationsProps {
  onReset: () => void;
}

export function Congratulations({ onReset }: CongratulationsProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Main Congratulations Banner */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 border-4 border-yellow-400 rounded-2xl p-12 shadow-2xl shadow-purple-500/50 text-center overflow-hidden">
        {/* Animated background stars */}
        <div className="absolute inset-0 opacity-20">
          <Star className="absolute top-4 left-8 animate-pulse" size={24} />
          <Star className="absolute top-12 right-12 animate-pulse" size={32} style={{ animationDelay: '0.5s' }} />
          <Star className="absolute bottom-8 left-16 animate-pulse" size={28} style={{ animationDelay: '1s' }} />
          <Star className="absolute bottom-16 right-8 animate-pulse" size={20} style={{ animationDelay: '1.5s' }} />
          <Sparkles className="absolute top-1/2 left-4 animate-bounce" size={36} style={{ animationDelay: '0.3s' }} />
          <Sparkles className="absolute top-1/3 right-6 animate-bounce" size={32} style={{ animationDelay: '0.8s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-6 mb-6">
            <Trophy size={80} className="text-yellow-300 animate-bounce" />
            <Rocket size={80} className="text-white animate-pulse" />
          </div>
          
          <h1 className="text-5xl mb-4">🎉 CONGRATULATIONS! 🎉</h1>
          <h2 className="text-3xl text-yellow-200 mb-6">MISSION ACCOMPLISHED</h2>
          
          <div className="bg-black/40 backdrop-blur-sm border-2 border-yellow-400 rounded-xl p-8 max-w-3xl mx-auto">
            <p className="text-2xl mb-4">
              You have successfully completed the <span className="text-cyan-300">Signal Rescue Lite</span> mission!
            </p>
            <p className="text-xl text-gray-200">
              Your exceptional skills in signal analysis and problem-solving have saved a life on Mars.
            </p>
          </div>
        </div>
      </div>

      {/* Achievement Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-950/50 to-cyan-950/50 border-2 border-cyan-500/50 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-xl text-cyan-400 mb-2">Qualification Test</h3>
          <p className="text-sm text-gray-300">Passed technical assessment with flying colors</p>
        </div>

        <div className="bg-gradient-to-br from-purple-950/50 to-pink-950/50 border-2 border-purple-500/50 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-xl text-purple-400 mb-2">Signal Analysis</h3>
          <p className="text-sm text-gray-300">Successfully decoded alien distress beacon</p>
        </div>

        <div className="bg-gradient-to-br from-orange-950/50 to-red-950/50 border-2 border-orange-500/50 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-xl text-orange-400 mb-2">Mission Complete</h3>
          <p className="text-sm text-gray-300">Rescued survivor from Valles Deep region</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 border-2 border-green-500/50 rounded-lg p-8">
        <h3 className="text-2xl text-green-400 mb-6 text-center">🌟 MISSION STATISTICS 🌟</h3>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-3xl text-yellow-400 mb-2">880 Hz</div>
            <div className="text-sm text-gray-400">Beacon Frequency Detected</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-3xl text-cyan-400 mb-2">Valles Deep</div>
            <div className="text-sm text-gray-400">Correct Location Identified</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-3xl text-green-400 mb-2">100%</div>
            <div className="text-sm text-gray-400">Mission Success Rate</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-3xl text-purple-400 mb-2">Elite</div>
            <div className="text-sm text-gray-400">Operator Status</div>
          </div>
        </div>
      </div>

      {/* Thank You Message */}
      <div className="bg-gradient-to-r from-indigo-950/50 to-purple-950/50 border-2 border-indigo-500/50 rounded-lg p-8 text-center">
        <h3 className="text-2xl text-indigo-400 mb-4">🙏 Thank You for Playing!</h3>
        <p className="text-lg text-gray-300 mb-4">
          You've demonstrated exceptional technical skills and quick thinking under pressure.
        </p>
        <p className="text-md text-gray-400">
          In real space missions, similar signal analysis techniques are used to communicate with spacecraft,
          analyze telemetry data, and locate distress beacons across vast distances.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pb-4">
        <p>Signal Rescue Lite - A Space Signal Analysis Game</p>
      </div>
    </div>
  );
}
