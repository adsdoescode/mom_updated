import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChevronRight, Clock, Search, Lock, Trophy, Play } from 'lucide-react';

interface RulesPresentationProps {
  timerStarted: boolean;
  timeRemaining: number;
  timerExpired: boolean;
  onStartTimer: () => void;
  formatTime: (ms: number) => string;
}

export function RulesPresentation({ 
  timerStarted, 
  timeRemaining, 
  timerExpired, 
  onStartTimer, 
  formatTime 
}: RulesPresentationProps) {
  const rules = [
    {
      icon: Clock,
      title: 'Time Limit',
      description: 'You have 30 minutes to complete the investigation',
      details: 'Work efficiently but thoroughly. Every detail matters.'
    },
    {
      icon: Search,
      title: 'Find the Password',
      description: 'A password is hidden somewhere in the incident report',
      details: 'Look carefully at all elements - text, images, data, and anomalies.'
    },
    {
      icon: Lock,
      title: 'Access the Document',
      description: 'Use the password to unlock the classified findings',
      details: 'The document contains the final mission analysis and root cause.'
    },
    {
      icon: Trophy,
      title: 'Complete the Mission',
      description: 'Successfully identify what went wrong',
      details: 'Understanding the failure will help prevent future incidents.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Timer Card */}
      <Card className={`border-2 ${
        timerExpired 
          ? 'bg-red-900/30 border-red-700/50' 
          : timerStarted 
            ? 'bg-amber-900/30 border-amber-700/50' 
            : 'bg-slate-800/50 border-slate-700/50'
      }`}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center gap-3">
              <Clock className={`w-8 h-8 ${
                timerExpired 
                  ? 'text-red-400' 
                  : timerStarted 
                    ? 'text-amber-400' 
                    : 'text-slate-400'
              }`} />
              <h2 className={`text-2xl font-bold ${
                timerExpired 
                  ? 'text-red-400' 
                  : timerStarted 
                    ? 'text-slate-400' 
                    : 'text-slate-400'
              }`}>
                {timerExpired 
                  ? 'Time Expired' 
                  : timerStarted 
                    ? 'Time Remaining' 
                    : 'Mission Timer'}
              </h2>
            </div>
            
            {timerStarted && !timerExpired && (
              <div className="text-5xl font-mono font-bold text-amber-400">
                {formatTime(timeRemaining)}
              </div>
            )}
            
            {timerExpired && (
              <div className="text-center space-y-2">
                <div className="text-3xl font-mono font-bold text-red-400">00:00</div>
                <p className="text-red-300 text-sm">Access to restricted pages has been revoked.</p>
              </div>
            )}
            
            {!timerStarted && (
              <div className="text-center space-y-4">
                <div className="text-3xl font-mono font-bold text-slate-400">30:00</div>
                <p className="text-slate-400 text-sm mb-4">
                  Click the button below to start the 30-minute countdown timer.
                  <br />
                  Once started, you'll gain access to the Incident Report and Classified Document pages.
                </p>
                <Button
                  onClick={onStartTimer}
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Mission Timer
                </Button>
              </div>
            )}
            
            {timerStarted && !timerExpired && (
              <div className="text-center space-y-2">
                <p className="text-amber-300 text-sm">
                  ⚠️ Timer is active. Access to restricted pages will be revoked when time expires.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Title Slide */}
      <Card className="bg-gradient-to-r from-red-900/50 to-slate-800/50 border-red-900/50">
        <CardHeader className="text-center py-12">
          <div className="text-6xl mb-4">🚀</div>
          <CardTitle className="text-3xl text-red-400 mb-4">
            Investigation Protocol
          </CardTitle>
          <p className="text-slate-300 text-lg">
            Mars Climate Orbiter Mission Failure Analysis Event
          </p>
          <p className="text-slate-500 mt-2">
            Security Clearance Required | Team Exercise
          </p>
        </CardHeader>
      </Card>

      {/* Rules Cards */}
      {rules.map((rule, index) => (
        <Card key={index} className="bg-slate-800/50 border-red-900/50 hover:border-red-700/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Slide Number */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-red-900/50 flex items-center justify-center text-2xl text-red-400">
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <rule.icon className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl text-red-400 mb-2">{rule.title}</h3>
                    <p className="text-slate-300">{rule.description}</p>
                  </div>
                </div>
                <div className="pl-11 pt-2 border-l-2 border-red-900/30 ml-4">
                  <p className="text-slate-400 text-sm">{rule.details}</p>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-6 h-6 text-red-900/50 flex-shrink-0 mt-2" />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Additional Guidelines */}
      <Card className="bg-slate-800/30 border-amber-700/50">
        <CardHeader>
          <CardTitle className="text-amber-400">Event Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-slate-300 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-amber-400">•</span>
            <p>Work individually or in teams as directed by your facilitator</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400">•</span>
            <p>Pay attention to technical details and numerical data</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400">•</span>
            <p>The password is case-sensitive and contains no spaces</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400">•</span>
            <p>Use all available resources on the webpage to find clues</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400">•</span>
            <p>Think like an investigator - question everything</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
