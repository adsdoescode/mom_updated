interface MissionBriefingProps {
  onStart: () => void;
  isInBuffer: boolean;
  bufferTimeRemaining: number;
}

export function MissionBriefing({ onStart, isInBuffer, bufferTimeRemaining }: MissionBriefingProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border-2 border-cyan-500/50 rounded-lg p-8 shadow-2xl shadow-cyan-500/20">
        <h2 className="text-2xl mb-6 text-cyan-400">🛸 MISSION BRIEFING</h2>
        
        <div className="space-y-6 text-gray-300">
          <p className="text-lg">
            Your orbiter has intercepted a distress beacon coming from an unknown crater on Mars…
            <span className="text-orange-400 ml-2">But the signal is jammed.</span>
          </p>

          <div className="bg-black/40 border border-cyan-500/30 rounded p-4">
            <p className="text-cyan-300">
              <span className="text-orange-400">Your job?</span> Decode the beacon's location using FFT.
            </p>
            <p className="text-cyan-300 mt-2">
              Fastest team saves the survivor. 🏆
            </p>
          </div>

          <div className="bg-purple-950/30 border border-purple-500/50 rounded p-4">
            <h3 className="text-lg mb-3 text-purple-400">📡 SITUATION ANALYSIS</h3>
            <p className="text-sm leading-relaxed">
              A weak distress transmission is echoing from somewhere within the mission zone, but all visual channels have collapsed, leaving only a fragmented audio feed to analyze. Each region on the map is known to emit its own characteristic tone whenever activity is detected, and traces of these signatures are scattered throughout the recording. By studying the pattern and noticing which signal seems to surface more consistently than the others, you can pinpoint the likely origin of the beacon and guide the rescue team to the right location.
            </p>
          </div>

          <div>
            <h3 className="text-lg mb-3 text-orange-400">📋 HOW TO PLAY</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-cyan-400 font-mono">STEP 1</span>
                <p>Upload the corrupted telemetry audio file</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-950/30 border border-orange-500/50 rounded p-4">
            <h3 className="text-lg mb-3 text-orange-400">🗺️ MARS REGIONS</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-gray-300">• North Ridge</div>
              <div className="text-gray-300">• Dust Valley</div>
              <div className="text-gray-300">• Crystal Canyon</div>
              <div className="text-gray-300">• Olympus Gate</div>
              <div className="text-gray-300">• Valles Deep</div>
              <div className="text-gray-300">• Red Storm Sector</div>
            </div>
          </div>
        </div>

        {isInBuffer && (
          <div className="mt-6 bg-red-950/50 border-2 border-red-500/70 rounded-lg p-6 text-center">
            <h3 className="text-xl text-red-400 mb-3">⚠️ SYSTEM LOCKOUT ACTIVE</h3>
            <p className="text-gray-300 mb-4">
              You have failed the qualification test twice. The system is in cooldown mode.
            </p>
            <div className="bg-black/40 border border-yellow-500/50 rounded-lg p-4 inline-block">
              <div className="text-sm text-gray-400 mb-1">TIME UNTIL UNLOCKED</div>
              <div className="text-4xl text-yellow-400">{formatTime(bufferTimeRemaining)}</div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Please wait until the cooldown period ends before starting a new mission.
            </p>
          </div>
        )}

        <button
          onClick={onStart}
          disabled={isInBuffer}
          className={`mt-8 w-full py-4 px-8 rounded-lg transition-all ${
            isInBuffer
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transform hover:scale-105 shadow-lg shadow-cyan-500/50'
          }`}
        >
          {isInBuffer ? '🔒 MISSION LOCKED' : '🚀 START MISSION'}
        </button>
      </div>
    </div>
  );
}
