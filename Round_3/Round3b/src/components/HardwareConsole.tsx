import { useState, useEffect } from 'react';
import { CheckCircle, Lock, AlertTriangle, Zap, Clock } from 'lucide-react';
import circuitDiagram from 'figma:asset/72222c466ca4c5c4eabd65d3b928ba3e5903c4ff.png';

interface HardwareConsoleProps {
  onComplete: () => void;
}

type WireConnection = {
  id: string;
  color: string;
  currentPin: string;
  correctPin: string;
  label: string;
};

export function HardwareConsole({ onComplete }: HardwareConsoleProps) {
  const [authCode, setAuthCode] = useState(['', '', '', '']);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(420); // 7 minutes
  const [draggedWire, setDraggedWire] = useState<string | null>(null);
  const [wires, setWires] = useState<WireConnection[]>([
    { id: 'red-led', color: '#ef4444', currentPin: '5V', correctPin: 'D4', label: 'Red LED (Retrograde)' },
    { id: 'green-led', color: '#22c55e', currentPin: 'D5', correctPin: 'D3', label: 'Green LED (Prograde)' },
    { id: 'blue-led', color: '#3b82f6', currentPin: 'D3', correctPin: 'D5', label: 'Blue LED (Radial)' },
    { id: 'pot', color: '#eab308', currentPin: 'D13', correctPin: 'A0', label: 'Thrust Potentiometer' },
    { id: 'sw1', color: '#06b6d4', currentPin: 'D2', correctPin: 'D8', label: 'Status Switch 1' },
    { id: 'sw2', color: '#a855f7', currentPin: 'D6', correctPin: 'D9', label: 'Status Switch 2' },
    { id: 'sw3', color: '#ec4899', currentPin: 'RX0', correctPin: 'D10', label: 'Status Switch 3' },
    { id: 'button', color: '#f97316', currentPin: 'GND', correctPin: 'D7', label: 'Confirm Button' },
  ]);

  const CORRECT_CODE = '8801';

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...authCode];
    newCode[index] = value;
    setAuthCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleValidate = () => {
    const enteredCode = authCode.join('');

    if (enteredCode.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }

    setIsValidating(true);
    setError('');

    setTimeout(() => {
      if (enteredCode === CORRECT_CODE) {
        onComplete();
      } else {
        setError('❌ INCORRECT CODE - Check the OLED display on the hardware');
        setIsValidating(false);
      }
    }, 1500);
  };

  const handleDragStart = (wireId: string) => {
    setDraggedWire(wireId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetPin: string) => {
    if (!draggedWire) return;

    setWires(prevWires =>
      prevWires.map(wire =>
        wire.id === draggedWire
          ? { ...wire, currentPin: targetPin }
          : wire
      )
    );
    setDraggedWire(null);
  };

  const allWiresCorrect = wires.every(wire => wire.currentPin === wire.correctPin);
  const correctWiresCount = wires.filter(wire => wire.currentPin === wire.correctPin).length;
  const isTimedOut = timeRemaining === 0;

  const availablePins = ['D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D13', 'A0', 'A1', 'RX0', '5V', 'GND'];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Mission Header */}
      <div className="bg-gradient-to-r from-red-900/50 via-orange-900/50 to-red-900/50 border-2 border-red-500 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="text-red-400 animate-pulse" size={32} />
              <h1 className="text-3xl text-red-400">HARDWARE REPAIR ROUND – FIX THE ORBITAL CIRCUIT</h1>
            </div>
            <p className="text-orange-300 text-lg">
              ⚠️ CRITICAL SYSTEM FAILURE ⚠️
            </p>
          </div>
          <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-lg border border-orange-500">
            <Clock className="text-orange-400" size={24} />
            <span className="text-2xl text-orange-400 font-mono">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>

      {/* Lore Box */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-orange-600/50 rounded-xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <Zap className="text-yellow-400 flex-shrink-0 mt-1 animate-pulse" size={28} />
          <div>
            <h3 className="text-xl text-orange-400 mb-2">MISSION CRITICAL ALERT</h3>
            <p className="text-gray-300">
              A <span className="text-red-400">solar flare</span> has scrambled the Mars orbiter's control wiring.
              The circuit board connections are <span className="text-yellow-400">dangerously misconfigured</span>.
              Restore correct connections before orbital insertion fails. Time is running out!
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-2 border-cyan-500/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-cyan-300">Circuit Repair Progress:</span>
          <span className={`text-lg ${allWiresCorrect ? 'text-green-400' : 'text-orange-400'}`}>
            {correctWiresCount} / {wires.length} Wires Correct
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${allWiresCorrect
              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
              : 'bg-gradient-to-r from-orange-500 to-red-500'
              }`}
            style={{ width: `${(correctWiresCount / wires.length) * 100}%` }}
          ></div>
        </div>
        {allWiresCorrect && !isTimedOut && (
          <p className="text-green-400 text-center mt-2 animate-pulse">
            ✓ ALL WIRES CONNECTED CORRECTLY! Check the Arduino OLED display below.
          </p>
        )}
        {isTimedOut && (
          <p className="text-red-400 text-center mt-2 animate-pulse">
            ⏰ TIME'S UP! Mission Failed - Orbital insertion window closed.
          </p>
        )}
      </div>

      {/* Interactive Circuit Board */}
      <div className="bg-gradient-to-b from-[#1A1D21] to-[#0f1116] border-2 border-red-600 rounded-xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-900/50 px-4 py-2 rounded border border-red-500 animate-pulse">
          <AlertTriangle className="text-red-400" size={20} />
          <span className="text-red-400 uppercase tracking-wider">Circuit Anomaly</span>
        </div>

        <h2 className="text-2xl text-orange-400 mb-6 text-center flex items-center justify-center gap-2">
          <Zap className="animate-pulse" />
          REPAIR STATION FOR CORE MICROCONTROLLER
          <Zap className="animate-pulse" />
        </h2>

        <p className="text-center text-cyan-300 mb-6">
          🎮 <span className="text-yellow-400">DRAG AND DROP</span> each wire to its correct pin location
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Wires List */}
          <div className="bg-[#1a1a1a] border-2 border-gray-700 rounded-xl p-6 space-y-3">
            <h3 className="text-cyan-400 text-center mb-4">🔌 WIRES TO RECONNECT</h3>
            {wires.map(wire => (
              <div
                key={wire.id}
                draggable
                onDragStart={() => handleDragStart(wire.id)}
                className={`p-4 rounded-lg border-2 cursor-grab active:cursor-grabbing transition-all ${wire.currentPin === wire.correctPin
                  ? 'bg-green-900/30 border-green-500'
                  : 'bg-gray-800 border-gray-600 hover:border-orange-500'
                  }`}
                style={{
                  boxShadow: `0 0 15px ${wire.color}40`
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: wire.color, boxShadow: `0 0 10px ${wire.color}` }}
                    ></div>
                    <span className="text-gray-200 text-sm">{wire.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${wire.currentPin === wire.correctPin
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                        }`}
                    >
                      {wire.currentPin}
                    </span>
                    {wire.currentPin === wire.correctPin && (
                      <CheckCircle size={16} className="text-green-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Arduino Pin Grid + OLED Display */}
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] border-2 border-gray-700 rounded-xl p-6">
              <h3 className="text-cyan-400 text-center mb-4">🎯 ARDUINO PIN SLOTS</h3>
              <div className="grid grid-cols-4 gap-3">
                {availablePins.map(pin => {
                  const wireOnPin = wires.find(w => w.currentPin === pin);
                  const isCorrectForThisWire = wireOnPin && wireOnPin.correctPin === pin;

                  return (
                    <div
                      key={pin}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(pin)}
                      className={`h-20 border-2 rounded-lg flex flex-col items-center justify-center transition-all ${isCorrectForThisWire
                        ? 'bg-green-900/50 border-green-500'
                        : wireOnPin
                          ? 'bg-red-900/50 border-red-500'
                          : 'bg-gray-800 border-gray-600 hover:border-cyan-500'
                        }`}
                    >
                      <span className="text-cyan-300 text-sm mb-1">{pin}</span>
                      {wireOnPin && (
                        <div
                          className="w-3 h-3 rounded-full animate-pulse"
                          style={{
                            backgroundColor: wireOnPin.color,
                            boxShadow: `0 0 10px ${wireOnPin.color}`
                          }}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-4 bg-gray-900/50 border-2 border-cyan-600/50 rounded-lg">
                <p className="text-center text-cyan-300 mb-3 flex items-center justify-center gap-2">
                  <span className="text-lg">📋</span>
                  <span>CIRCUIT DIAGRAM REFERENCE</span>
                </p>
                <div className="bg-white rounded-lg p-4 shadow-lg">
                  <img
                    src={circuitDiagram}
                    alt="Arduino Circuit Diagram"
                    className="w-full h-auto max-w-md mx-auto"
                  />
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">
                  Use this diagram to wire all components correctly
                </p>
              </div>
            </div>

            {/* Arduino OLED Display */}
            <div className={`bg-[#1a1a1a] border-2 rounded-xl p-6 transition-all duration-500 ${allWiresCorrect && !isTimedOut
              ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]'
              : 'border-gray-700'
              }`}>
              <h3 className="text-cyan-400 text-center mb-4">📟 ARDUINO OLED DISPLAY</h3>

              {/* OLED Screen */}
              <div className={`mx-auto max-w-xs h-32 rounded-lg border-4 border-gray-800 p-4 transition-all duration-500 ${allWiresCorrect && !isTimedOut
                ? 'bg-gradient-to-br from-blue-400 to-cyan-300'
                : 'bg-black'
                }`}>
                {allWiresCorrect && !isTimedOut ? (
                  <div className="flex flex-col items-center justify-center h-full animate-pulse text-center px-1">
                    <div className="text-black text-[10px] mb-1">SYSTEM ONLINE</div>
                    <div className="text-black text-sm font-bold leading-tight">FREQUENCY OBTAINED</div>
                    <div className="text-black text-lg font-bold leading-none">+</div>
                    <div className="text-black text-sm font-bold leading-tight">HIGH OF AND GATE</div>
                    <div className="text-black text-[10px] mt-1">✓ VERIFIED</div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-800 text-xs text-center">
                      {isTimedOut ? (
                        <div className="text-red-900">
                          <div className="mb-1">SYSTEM</div>
                          <div className="text-lg">TIMEOUT</div>
                        </div>
                      ) : (
                        <>
                          <div className="mb-1">SYSTEM ERROR</div>
                          <div className="text-red-900 text-lg animate-pulse">OFFLINE</div>
                          <div className="mt-1 text-[10px]">FIX WIRING</div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <p className={`text-center mt-3 text-xs ${allWiresCorrect && !isTimedOut
                ? 'text-green-400'
                : isTimedOut
                  ? 'text-red-400'
                  : 'text-gray-500'
                }`}>
                {allWiresCorrect && !isTimedOut
                  ? '✓ OLED Active - Authentication code displayed'
                  : isTimedOut
                    ? '⏰ Display locked - Time expired'
                    : '⚠ Display inactive - Repair circuit to activate'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Authentication Code */}
      <div className={`bg-gradient-to-br from-[#1A1D21] to-[#0f1116] border-2 rounded-xl p-8 shadow-2xl transition-all ${allWiresCorrect ? 'border-green-600/50' : 'border-gray-700 opacity-50'
        }`}>
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Lock size={48} className={allWiresCorrect && !isTimedOut ? 'text-green-400' : 'text-gray-600'} />
              {allWiresCorrect && !isTimedOut && <CheckCircle size={48} className="text-green-400 animate-pulse" />}
              {isTimedOut && <AlertTriangle size={48} className="text-red-400 animate-pulse" />}
            </div>
            <h2 className={`text-2xl ${isTimedOut
              ? 'text-red-400'
              : allWiresCorrect
                ? 'text-green-400'
                : 'text-gray-600'
              }`}>
              CIRCUIT REPAIR VERIFICATION
            </h2>
            <p className="text-sm text-gray-400">
              {isTimedOut
                ? '⏰ TIME EXPIRED! Mission failed - orbital insertion window has closed.'
                : allWiresCorrect
                  ? 'All wires connected correctly! The Arduino OLED now displays the authentication code.'
                  : 'Fix all wire connections first. The authentication code will appear when the circuit is repaired.'
              }
            </p>
            {allWiresCorrect && !isTimedOut && (
              <p className="text-xs text-orange-400 bg-orange-900/30 border border-orange-600/50 rounded px-3 py-2 mt-2">
                ⚠️ Check the Arduino OLED display above for the 4-digit code!
              </p>
            )}
          </div>

          <div className={`bg-black/50 border rounded-lg p-4 ${allWiresCorrect && !isTimedOut ? 'border-cyan-600/50' : 'border-gray-700'
            }`}>
            <p className={`text-center text-sm mb-3 ${allWiresCorrect && !isTimedOut ? 'text-cyan-300' : 'text-gray-600'
              }`}>
              ENTER ARDUINO OLED CODE:
            </p>
            <div className="flex gap-3 justify-center">
              {authCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeInput(index, e.target.value)}
                  className={`w-16 h-20 text-center text-3xl bg-gray-900 border-2 rounded-lg focus:outline-none transition-all ${allWiresCorrect && !isTimedOut
                    ? 'border-cyan-600 focus:border-orange-400 focus:shadow-[0_0_20px_rgba(251,146,60,0.5)]'
                    : 'border-gray-700 text-gray-600 cursor-not-allowed'
                    }`}
                  disabled={isValidating || !allWiresCorrect || isTimedOut}
                  placeholder="?"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-900/30 border border-red-600/50 rounded-lg p-4">
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleValidate}
            disabled={isValidating || authCode.some(d => !d) || !allWiresCorrect || isTimedOut}
            className={`w-full py-4 rounded-lg transition-all flex items-center justify-center gap-2 text-lg ${isValidating || authCode.some(d => !d) || !allWiresCorrect || isTimedOut
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/50 hover:shadow-green-500/70'
              }`}
          >
            {isValidating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                VERIFYING REPAIR...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                {isTimedOut
                  ? 'MISSION FAILED - TIME EXPIRED'
                  : allWiresCorrect
                    ? 'SUBMIT VERIFICATION CODE'
                    : 'FIX WIRING FIRST'
                }
              </>
            )}
          </button>

          <div className="text-center text-xs text-gray-500 border-t border-gray-700 pt-4">
            <p>🔐 Secure authentication ensures hardware integrity before orbital insertion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
