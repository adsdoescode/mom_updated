import { useState, useEffect } from 'react';
import { BriefingVideo } from './components/BriefingVideo';
import { RulesPresentation } from './components/RulesPresentation';
import { MarsIncident } from './components/MarsIncident';
import { PasswordProtected } from './components/PasswordProtected';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { AlertCircle, Clock } from 'lucide-react';

const TIMER_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const TIMER_STORAGE_KEY = 'mission_timer_start';
const TIMER_ACCESS_KEY = 'mission_timer_active';

export default function App() {
  const [discoveredPassword, setDiscoveredPassword] = useState<string>('');
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(TIMER_DURATION);
  const [timerExpired, setTimerExpired] = useState<boolean>(false);

  // Load timer state from sessionStorage on mount (persists on reload, clears on new session)
  useEffect(() => {
    const savedStartTime = sessionStorage.getItem(TIMER_STORAGE_KEY);
    const accessGranted = sessionStorage.getItem(TIMER_ACCESS_KEY) === 'true';
    
    if (savedStartTime && accessGranted) {
      const startTime = parseInt(savedStartTime, 10);
      const elapsed = Date.now() - startTime;
      const remaining = TIMER_DURATION - elapsed;
      
      if (remaining > 0) {
        setTimerStarted(true);
        setTimeRemaining(remaining);
      } else {
        setTimerExpired(true);
        setTimeRemaining(0);
        sessionStorage.removeItem(TIMER_STORAGE_KEY);
        sessionStorage.removeItem(TIMER_ACCESS_KEY);
      }
    }
  }, []);

  // Update timer countdown
  useEffect(() => {
    if (!timerStarted || timerExpired) return;

    const interval = setInterval(() => {
      const savedStartTime = sessionStorage.getItem(TIMER_STORAGE_KEY);
      if (savedStartTime) {
        const startTime = parseInt(savedStartTime, 10);
        const elapsed = Date.now() - startTime;
        const remaining = TIMER_DURATION - elapsed;

        if (remaining > 0) {
          setTimeRemaining(remaining);
        } else {
          setTimerExpired(true);
          setTimeRemaining(0);
          sessionStorage.removeItem(TIMER_STORAGE_KEY);
          sessionStorage.removeItem(TIMER_ACCESS_KEY);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerStarted, timerExpired]);

  const handleStartTimer = () => {
    const startTime = Date.now();
    sessionStorage.setItem(TIMER_STORAGE_KEY, startTime.toString());
    sessionStorage.setItem(TIMER_ACCESS_KEY, 'true');
    setTimerStarted(true);
    setTimeRemaining(TIMER_DURATION);
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const canAccessRestrictedPages = timerStarted && !timerExpired;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-red-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-red-900/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-red-500">CLASSIFIED MISSION DEBRIEFING</h1>
                <p className="text-slate-400 text-sm">Mars Climate Orbiter - September 23, 1999</p>
              </div>
            </div>
            {timerStarted && !timerExpired && (
              <div className="flex items-center gap-3 px-4 py-2 bg-amber-900/30 border border-amber-700/50 rounded-lg">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-amber-400 font-mono font-bold text-xl">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            {timerExpired && (
              <div className="flex items-center gap-3 px-4 py-2 bg-red-900/30 border border-red-700/50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-bold">Time Expired</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="briefing" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 mb-8">
            <TabsTrigger value="briefing">Briefing Video</TabsTrigger>
            <TabsTrigger value="rules">Rules & Protocol</TabsTrigger>
            <TabsTrigger 
              value="incident" 
              disabled={!canAccessRestrictedPages}
              className={!canAccessRestrictedPages ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Incident Report
              {!canAccessRestrictedPages && <span className="ml-2 text-xs">🔒</span>}
            </TabsTrigger>
            <TabsTrigger 
              value="document" 
              disabled={!canAccessRestrictedPages}
              className={!canAccessRestrictedPages ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Classified Document
              {!canAccessRestrictedPages && <span className="ml-2 text-xs">🔒</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="briefing">
            <BriefingVideo />
          </TabsContent>

          <TabsContent value="rules">
            <RulesPresentation 
              timerStarted={timerStarted}
              timeRemaining={timeRemaining}
              timerExpired={timerExpired}
              onStartTimer={handleStartTimer}
              formatTime={formatTime}
            />
          </TabsContent>

          <TabsContent value="incident">
            {canAccessRestrictedPages ? (
              <MarsIncident onPasswordFound={setDiscoveredPassword} />
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                  <h2 className="text-2xl text-red-400">Access Restricted</h2>
                  <p className="text-slate-400">
                    Please start the timer from the Rules & Protocol page to access this section.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="document">
            {canAccessRestrictedPages ? (
              <PasswordProtected discoveredPassword={discoveredPassword} />
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                  <h2 className="text-2xl text-red-400">Access Restricted</h2>
                  <p className="text-slate-400">
                    Please start the timer from the Rules & Protocol page to access this section.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-red-900/50 mt-16 py-6 bg-slate-900/50">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>NASA Mission Analysis Division | Confidential Event</p>
          <p className="mt-2">Hint: The truth is hidden in the details...</p>
        </div>
      </footer>
    </div>
  );
}
