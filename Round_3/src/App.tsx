import { useEffect, useState } from 'react';
import { SensorEnvelope } from './components/SensorEnvelope';
import { UnlockedScreen } from './components/UnlockedScreen';
import { WarningScreen } from './components/WarningScreen';
import { LockoutScreen } from './components/LockoutScreen';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { AlertCircle, Rocket, Lock } from 'lucide-react';
import { Alert, AlertDescription } from './components/ui/alert';
import { Input } from './components/ui/input';

const sensorData = {
  A: {
    name: 'Thrust Sensor',
    label: 'Sensor A',
    clue: 'Thruster force output: 3000-3300 N during descent. Physical law: Torque = Force × Distance (lever arm = 0.3m).',
    puzzle: 'I measure the push that slows our fall.',
    expectedRange: '3000–3300 N',
    graphData: [
      { time: 0, value: 3050 },
      { time: 1, value: 3150 },
      { time: 2, value: 3200 },
      { time: 3, value: 3100 },
      { time: 4, value: 3250 }
    ],
    unit: 'N',
    description: 'Measures descent thruster force',
    isImposter: false
  },
  B: {
    name: 'Temperature Sensor',
    label: 'Sensor B',
    clue: 'Mars surface temperature: -60°C to -20°C.',
    puzzle: 'I feel the cold of the red planet.',
    expectedRange: '-60 to -20°C',
    graphData: [
      { time: 0, value: -45 },
      { time: 1, value: -35 },
      { time: 2, value: -40 },
      { time: 3, value: -50 },
      { time: 4, value: -30 }
    ],
    unit: '°C',
    description: 'Monitors external temperature',
    isImposter: false
  },
  C: {
    name: 'Pressure Sensor',
    label: 'Sensor C',
    clue: 'Mars atmospheric pressure: 500-700 Pa.',
    puzzle: 'I sense the thin air of the red world.',
    expectedRange: '500–700 Pa',
    graphData: [
      { time: 0, value: 550 },
      { time: 1, value: 620 },
      { time: 2, value: 590 },
      { time: 3, value: 650 },
      { time: 4, value: 600 }
    ],
    unit: 'Pa',
    description: 'Measures atmospheric pressure',
    isImposter: false
  },
  D: {
    name: 'Torque Sensor',
    label: 'Sensor D',
    clue: 'Gyroscope torque: 900-950 N·m for stabilization. Verify with Sensor A data.',
    puzzle: 'Seek the circle’s secret measure, for without its span, the journey cannot begin. = torque/force',
    expectedRange: '900–950 N·m',
    graphData: [
      { time: 0, value: 915 },
      { time: 1, value: 945 },
      { time: 2, value: 960 },
      { time: 3, value: 930 },
      { time: 4, value: 975 }
    ],
    unit: '',
    description: 'Tracks rotational stabilization force',
    isImposter: true,
    contradiction: 'Graph shows 900-950 range matching expected N·m, but values are actually in lbf·ft! Converting: 960 lbf·ft × 1.356 = 1,302 N·m (30% too high). Password: SENSOR-D'
  }
};

export default function App() {
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  // Replaces `failed` behavior: set a timestamp until which the app is locked
  const [sleepUntil, setSleepUntil] = useState<number | null>(() => {
    try {
      const value = localStorage.getItem('sleepUntil');
      return value ? parseInt(value, 10) : null;
    } catch {
      return null;
    }
  });
  const [now, setNow] = useState(Date.now());
  const [orbitError, setOrbitError] = useState(false);

  const [lockoutCount, setLockoutCount] = useState(() => {
    try {
      const saved = localStorage.getItem('lockoutCount');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const handleSubmit = (sensor: string) => {
    if (sensor === 'D') {
      setShowPasscode(true);
      setError(false);
      setShowWarning(false);
      setOrbitError(false);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 2) {
        // Increment lockout count
        const newLockoutCount = lockoutCount + 1;
        setLockoutCount(newLockoutCount);
        localStorage.setItem('lockoutCount', String(newLockoutCount));

        // Calculate duration: 2 minutes * lockout count
        const lockDurationMinutes = newLockoutCount * 2;
        const lockDurationMs = lockDurationMinutes * 60 * 1000;

        const until = Date.now() + lockDurationMs;
        setSleepUntil(until);
        try { localStorage.setItem('sleepUntil', String(until)); } catch { }

        // Reset UI selection and passcode entry during lock
        setSelectedSensor(null);
        setShowPasscode(false);
        setPasscode('');
        setOrbitError(false);
      } else {
        setShowWarning(true);
        setError(false);
        setShowPasscode(false);
        setOrbitError(false);
      }
    }
  };

  const handlePasscodeSubmit = () => {
    if (passcode === '0.3') {
      setUnlocked(true);
      setError(false);
      setOrbitError(false);
    } else {
      setError(true);
      setOrbitError(true);
      setTimeout(() => {
        setError(false);
        setOrbitError(false);
      }, 3000);
    }
  };

  // Passcode input color: keep neutral/white in all cases
  const passcodeColorClass = 'text-white';

  const handleContinueFromWarning = () => {
    setShowWarning(false);
  };

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  // Check for session access on mount
  useEffect(() => {
    const accessGranted = sessionStorage.getItem('round3_access_granted') === 'true';
    setHasAccess(accessGranted);

    if (!accessGranted) {
      // Clear any stale data
      sessionStorage.removeItem('round3_access_granted');
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

  // A simple timer tick to update `now` and drive the countdown UI
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // When the timer expires, clear lock state and reset attempts
  useEffect(() => {
    if (sleepUntil && sleepUntil <= Date.now()) {
      setSleepUntil(null);
      setAttempts(0);
      try { localStorage.removeItem('sleepUntil'); } catch { }
    }
  }, [sleepUntil, now]);

  // Show error if access not granted
  if (hasAccess === false) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-100 via-white to-white flex items-center justify-center p-4 font-sans">
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
                ERROR CODE: R3_UNAUTHORIZED
              </div>
            </div>

            {/* Grey Message Box */}
            <div className="w-full max-w-4xl bg-slate-500 rounded-lg p-8 mb-8 text-center shadow-inner">
              <p className="text-slate-300 text-lg">
                This area is <span className="text-amber-400 font-bold">restricted</span> to authorized personnel only.
              </p>
              <p className="text-slate-300 text-lg">
                Complete Round 2 to gain access credentials.
              </p>
            </div>

            {/* Footer Message */}
            <div className="text-center">
              <p className="text-slate-400 text-xs flex items-center justify-center gap-2">
                Nice try, you sneaky lil thing... but you'll need to solve the second mission first! 🕵️
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  if (unlocked) {
    return <UnlockedScreen />;
  }

  if (sleepUntil && sleepUntil > Date.now()) {
    return <LockoutScreen unlockAt={sleepUntil} />;
  }

  if (showWarning) {
    return <WarningScreen onContinue={handleContinueFromWarning} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="size-12 text-orange-500" />
            <h1 className="text-5xl">🌌 ORBITER DATA VALIDATION</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Four subsystems are transmitting data from Mars orbit. One sensor contains inconsistent or impossible information.
            Identify the <span className="text-red-500">IMPOSTER</span> to proceed.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-950 border-red-500">
            <AlertCircle className="size-4" />
            <AlertDescription className="text-red-200">
              {showPasscode ? 'Incorrect passcode. Try again.' : 'Incorrect sensor identified. Review all data carefully.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Sensor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(sensorData).map(([key, data]) => (
            <SensorEnvelope
              key={key}
              id={key}
              data={data}
              isSelected={selectedSensor === key}
              onSelect={setSelectedSensor}
            />
          ))}
        </div>

        {/* Submit Section */}
        <Card className="bg-slate-900/50 border-slate-700 p-8">
          <h2 className="text-2xl mb-4 text-center text-white">Identify the Imposter</h2>
          <p className="text-center text-slate-400 mb-6">
            Select the sensor you believe is transmitting faulty data
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {Object.entries(sensorData).map(([key, data]) => (
              <Button
                key={key}
                onClick={() => handleSubmit(key)}
                variant={selectedSensor === key ? 'default' : 'outline'}
                className="px-8"
              >
                {data.label}: {data.name}
              </Button>
            ))}
          </div>
        </Card>

        {/* Passcode Input */}
        {showPasscode && (
          <Card className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-2 border-yellow-500 p-8 mt-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Lock className="size-8 text-yellow-400" />
              <h2 className="text-2xl text-yellow-300">Verification Required</h2>
            </div>
            <p className="text-center text-slate-300 mb-6">
              Solve the aptitude challenge from Sensor D to obtain the access code
            </p>
            <div className="max-w-md mx-auto space-y-4">
              <Input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter calculated answer..."
                className={`text-center text-lg bg-slate-950 border-slate-600 ${passcodeColorClass}`}
                onKeyDown={(e) => e.key === 'Enter' && handlePasscodeSubmit()}
              />
              <Button
                onClick={handlePasscodeSubmit}
                variant="default"
                className="w-full"
              >
                Verify & Unlock
              </Button>
            </div>
          </Card>
        )}

        {/* Orbit Error Message */}
        {orbitError && (
          <Card className="bg-slate-900/50 border-slate-700 p-8 mt-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="size-16 text-red-500 mb-4" />
              <h2 className="text-4xl font-bold text-red-500 mb-2">WARNING</h2>
              <p className="text-3xl text-white font-bold">
                WHEEL GOING OUT OF ORBIT
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}