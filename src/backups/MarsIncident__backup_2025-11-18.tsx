import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertTriangle, Rocket, Database, MapPin } from 'lucide-react';
import Quiz from './Quiz';
import './Quiz.css';

interface MarsIncidentProps {
  onPasswordFound: (password: string) => void;
}

export function MarsIncident({ onPasswordFound }: MarsIncidentProps) {
  const [clickedElements, setClickedElements] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompletedCorrectly, setQuizCompletedCorrectly] = useState(false);
  const [correctAccessCode, setCorrectAccessCode] = useState<number | null>(null);
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [codeVerified, setCodeVerified] = useState(false);
  const [quizAttemptCount, setQuizAttemptCount] = useState(0);
  const [lastSubmittedAccessCode, setLastSubmittedAccessCode] = useState<number | null>(null);

  // Handle keyboard input for the keypad
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      // Check if a number key (0-9) was pressed
      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        handleKeypadInput(key);
      }
      // Handle Backspace
      else if (key === 'Backspace') {
        event.preventDefault();
        handleKeypadBackspace();
      }
      // Handle Enter to submit
      else if (key === 'Enter') {
        event.preventDefault();
        handleKeypadSubmit();
      }
      // Handle Escape to clear
      else if (key === 'Escape') {
        event.preventDefault();
        handleKeypadClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enteredCode, correctAccessCode, quizAttemptCount]);

  const handleHiddenClick = (element: string, password: string) => {
    if (!clickedElements.includes(element)) {
      setClickedElements([...clickedElements, element]);
      onPasswordFound(password);
    }
  };

  const handleCopyToClipboard = async (text: string, element: string) => {
    try {
      await navigator.clipboard.writeText(text);
      handleHiddenClick(element, text);
      // Show a subtle notification
      const notification = document.createElement('div');
      notification.textContent = '✓ Access code discovered and copied to clipboard';
      notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        handleHiddenClick(element, text);
        const notification = document.createElement('div');
        notification.textContent = '✓ Access code discovered and copied to clipboard';
        notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleKeypadInput = (digit: string) => {
    if (enteredCode.length < 10) { // Limit to reasonable length
      setEnteredCode(enteredCode + digit);
    }
  };

  const handleKeypadClear = () => {
    setEnteredCode('');
    setCodeVerified(false);
  };

  const handleKeypadBackspace = () => {
    setEnteredCode(enteredCode.slice(0, -1));
    setCodeVerified(false);
  };

  const handleKeypadSubmit = () => {
    const entered = parseInt(enteredCode, 10);
    if (isNaN(entered)) {
      const notification = document.createElement('div');
      notification.textContent = '✗ Please enter valid access code';
      notification.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 6000);
      return;
    }

    // Special case: user entered 24 and the quiz's last submitted code exists and is different
    if (entered === 24 && lastSubmittedAccessCode !== null && lastSubmittedAccessCode !== 24) {
      setEnteredCode('');
      setCodeVerified(false);
      const notification = document.createElement('div');
      notification.textContent = 'sneaky you ! solve the questions correctly - random guesses and help from your friends is not allowed in this orbiter';
      notification.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 6000);
      return;
    }

    if (correctAccessCode === null) {
      // Quiz not completed correctly yet
      const notification = document.createElement('div');
      notification.textContent = quizAttemptCount === 0 
        ? '✗ Please complete the quiz first'
        : '✗ Please enter valid access code';
      notification.className = 'fixed bottom-4 right-4 bg-amber-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 6000);
      return;
    }

    if (entered === correctAccessCode) {
      setCodeVerified(true);
      // Special success case: correct code 24 — show subtle amber notification
      if (entered === 24) {
        const notification = document.createElement('div');
        notification.textContent = 'New information discovered. Examine carefully.';
        notification.className = 'fixed bottom-4 right-4 bg-amber-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
      }
    } else {
      setEnteredCode('');
      setCodeVerified(false);
      // Show error feedback
      const notification = document.createElement('div');
      notification.textContent = '✗ Access code incorrect';
      notification.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 6000);
    }
  };

  if (showQuiz) {
    return <Quiz 
      onClose={() => setShowQuiz(false)} 
      onAllCorrect={(accessCode) => {
        setQuizCompletedCorrectly(true);
        setCorrectAccessCode(accessCode);
      }}
      onQuizSubmitted={(accessCode, allCorrect) => {
        setQuizAttemptCount(prev => prev + 1);
        // store last submitted access code even if not all correct
        setLastSubmittedAccessCode(accessCode);
        if (allCorrect) {
          setQuizCompletedCorrectly(true);
          setCorrectAccessCode(accessCode);
        }
      }}
    />;
  }

  return (
    <div className="space-y-6">
      {/* Main Incident Card */}
      <Card className="bg-slate-800/50 border-red-900/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Mission Failure Report
              </CardTitle>
              <CardDescription className="text-slate-400 mt-2">
                Incident Date: September 23, 1999 | Status: LOST
              </CardDescription>
            </div>
            <Badge variant="destructive" className="text-sm">CLASSIFIED</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1527826507412-72e447368aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJzJTIwcGxhbmV0JTIwc3VyZmFjZXxlbnwxfHx8fDE3NjIzMDU0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Mars Surface"
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-sm text-slate-400 italic">
                Mars Climate Orbiter was designed to study Martian weather and climate
              </p>
            </div>

            <div className="space-y-4 text-slate-300">
              <div>
                <h3 className="text-red-400 mb-2">Mission Summary</h3>
                <p className="text-sm leading-relaxed">
                  The Mars Climate Orbiter was launched on December 11, 1998, as part of NASA's 
                  Mars Surveyor program. Its primary objective was to serve as a communications 
                  relay for the Mars Polar Lander and to study the Martian atmosphere and surface.
                </p>
              </div>

              <div>
                <h3 className="text-red-400 mb-2">The Incident</h3>
                <p className="text-sm leading-relaxed">
                  Contact was lost on September 23, 1999, as the spacecraft prepared to enter 
                  orbit around Mars. Post-incident analysis revealed the orbiter approached Mars 
                  at an altitude of only 57 kilometers instead of the planned 140-150 kilometers, 
                  causing it to enter the atmosphere and disintegrate.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Data Tabs */}
      <Card className="bg-slate-800/50 border-red-900/50">
        <CardHeader>
          <CardTitle className="text-red-400">Mission Data Analysis</CardTitle>
          <CardDescription className="text-slate-400">
            Review the technical specifications and telemetry data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-900/50">
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Rocket className="w-5 h-5 text-red-400" />
                    <h4 className="text-red-400">Spacecraft Details</h4>
                  </div>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mass:</span>
                      <span>638 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Launch Date:</span>
                      <span>Dec 11, 1998</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Launch Vehicle:</span>
                      <span>Delta II 7425</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mission Cost:</span>
                      <span>$327.6M</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="w-5 h-5 text-red-400" />
                    <h4 className="text-red-400">Technical Parameters</h4>
                  </div>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Planned Altitude:</span>
                      <span 
                        className="cursor-pointer hover:text-amber-400 transition-colors"
                        onClick={() => handleHiddenClick('altitude', 'METRIC2IMPERIAL')}
                        title="Click for more details"
                      >
                        140-150 km
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Actual Altitude:</span>
                      <span className="text-red-400">~57 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Power System:</span>
                      <span>Solar Arrays</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Propulsion:</span>
                      <span data-code="METRIC">Hydrazine</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hidden clue in image */}
              <div className="p-4 bg-amber-900/10 rounded-lg border border-amber-700/30">
                <p className="text-sm text-amber-200">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  The discrepancy in altitude calculations suggests a fundamental error in 
                  the navigation software. Investigation ongoing...
                </p>
              </div>
            </TabsContent>

            <TabsContent value="telemetry" className="mt-4">
              <div className="space-y-4">
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <h4 className="text-red-400 mb-3">Trajectory Correction Maneuvers</h4>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex justify-between py-2 border-b border-slate-700/50">
                      <span className="text-slate-400">TCM-1:</span>
                      <span className="text-slate-300">Dec 21, 1998 - Success</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-700/50">
                      <span className="text-slate-400">TCM-2:</span>
                      <span className="text-slate-300">Mar 4, 1999 - Success</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-700/50">
                      <span className="text-slate-400">TCM-3:</span>
                      <span className="text-slate-300">Jul 25, 1999 - Success</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-700/50">
                      <span className="text-slate-400">TCM-4:</span>
                      <span className="text-slate-300">Sep 15, 1999 - Success</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-400">Orbital Insertion:</span>
                      <span className="text-red-400">Sep 23, 1999 - FAILED</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <h4 className="text-red-400 mb-3">Navigation Data Anomalies</h4>
                  <div className="text-sm text-slate-300 space-y-2">
                    <p>
                      Multiple trajectory corrections were required throughout the mission. 
                      Ground control noted increasing deviations from predicted path.
                    </p>
                    <p className="text-amber-400">
                      ⚠ Thruster force data showed{' '}
                      <span 
                        className="underline decoration-dotted cursor-help"
                        title="Units discrepancy detected"
                      >
                        inconsistencies
                      </span>
                      {' '}between calculated and expected values.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              <div className="relative space-y-6">
                {/* Timeline items */}
                {[
                  {
                    date: 'Dec 11, 1998',
                    event: 'Launch',
                    description: 'Successfully launched from Cape Canaveral',
                    status: 'success'
                  },
                  {
                    date: 'Jan-Sep 1999',
                    event: 'Transit Phase',
                    description: 'Multiple trajectory corrections performed',
                    status: 'warning'
                  },
                  {
                    date: 'Sep 23, 1999',
                    event: 'Mars Arrival',
                    description: 'Lost contact during orbital insertion',
                    status: 'error'
                  },
                  {
                    date: 'Sep 24-30, 1999',
                    event: 'Recovery Attempts',
                    description: 'No signal detected from spacecraft',
                    status: 'error'
                  },
                  {
                    date: 'Oct 1999',
                    event: 'Investigation Begins',
                    description: 'Root cause analysis initiated',
                    status: 'info'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${
                        item.status === 'success' ? 'bg-green-500' :
                        item.status === 'warning' ? 'bg-amber-500' :
                        item.status === 'error' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`} />
                      {index < 4 && <div className="w-0.5 h-full bg-slate-700 mt-2" />}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400 text-sm">{item.date}</span>
                          <Badge variant={item.status === 'error' ? 'destructive' : 'secondary'} className="text-xs">
                            {item.event}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Investigation Notes */}
      <Card className="bg-slate-800/50 border-red-900/50">
        <CardHeader>
          <CardTitle className="text-red-400">Investigation Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                <div className="text-sm text-slate-300 space-y-2">
                  <p>
                    <span className="text-red-400">Key Finding:</span> The spacecraft's 
                    navigation software calculated trajectory corrections using{' '}
                    <span className="text-amber-400 cursor-pointer hover:underline"
                          onClick={() => handleHiddenClick('units', 'METRIC2IMPERIAL')}>
                      metric units (Newtons)
                    </span>, while the ground-based software provided thruster data in{' '}
                    <span className="text-amber-400">imperial units (pound-force)</span>.
                  </p>
                  <p>
                    This units mismatch went undetected throughout the mission, causing 
                    a cumulative navigation error that resulted in the spacecraft approaching 
                    Mars at an altitude far lower than planned.
                  </p>
                  <p className="text-red-400">
                    The failure to detect and correct this error represents a critical 
                    breakdown in quality assurance and verification processes.
                  </p>
                  <button
                    onClick={() => setShowQuiz(true)}
                    disabled={codeVerified || quizCompletedCorrectly}
                    aria-disabled={codeVerified || quizCompletedCorrectly}
                    className={`submit-button mt-4 ${(codeVerified || quizCompletedCorrectly) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    Open Quiz
                  </button>
                </div>
              </div>
            </div>

            {/* Access Code Keypad - Always visible */}
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 mx-auto" style={{ width: 'fit-content' }}>
              <h4 className="text-red-400 mb-3 text-sm font-semibold text-center">System Access Terminal</h4>
              <div className="space-y-3">
                {/* Display */}
                <div className="p-3 bg-slate-950/50 rounded border border-slate-700/50 font-mono text-right" style={{ minWidth: '180px' }}>
                  <div className="text-xs text-slate-500 mb-1">Enter Access Code</div>
                  <div className="text-2xl text-slate-300 min-h-[2rem] flex items-center justify-end">
                    <span>{enteredCode}</span>
                    <span className="blinking-cursor"></span>
                  </div>
                </div>

                {/* Keypad - Square 4x3 Grid */}
                <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(3, 1fr)', width: '240px' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleKeypadInput(num.toString())}
                      className="p-2 bg-slate-800 hover:bg-slate-600 hover:border-slate-500 hover:brightness-110 hover:scale-105 active:scale-95 border border-slate-700 rounded text-slate-300 font-mono text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={handleKeypadClear}
                    style={{ backgroundColor: '#dc2626' }}
                    className="p-2 hover:bg-red-500 border border-red-400 rounded text-white font-mono text-xs transition-all duration-200 shadow-sm hover:shadow-md hover:brightness-110 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    CLEAR
                  </button>
                  <button
                    onClick={() => handleKeypadInput('0')}
                    className="p-2 bg-slate-800 hover:bg-slate-600 hover:border-slate-500 hover:brightness-110 hover:scale-105 active:scale-95 border border-slate-700 rounded text-slate-300 font-mono text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    0
                  </button>
                  <button
                    onClick={handleKeypadBackspace}
                    className="p-2 bg-amber-900/50 hover:bg-amber-800/70 hover:border-amber-600 hover:brightness-110 hover:scale-105 active:scale-95 border border-amber-800/50 rounded text-amber-300 text-sm transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    ⌫
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleKeypadSubmit}
                  disabled={!enteredCode}
                  className="submit-button w-full font-mono text-slate-300"
                >
                  Verify Access Code
                </button>

                {/* Keyboard Hints */}
                <div className="text-center text-slate-500 space-y-0" style={{ fontSize: '8px' }}>
                  <p>Press <span className="text-amber-400 font-semibold">Enter</span> to submit</p>
                  <p>Press <span className="text-amber-400 font-semibold">Esc</span> to clear</p>
                </div>
              </div>
            </div>

            {/* Verification Code - Only shown when code is verified */}
            {codeVerified && (
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 opacity-50 hover:opacity-100 transition-opacity">
                <p className="text-xs text-slate-500 font-mono">
                  Debug Log [ID: MCO-1999-092399] | Verification Code:{' '}
                  <span 
                    className="text-slate-600 cursor-pointer select-all"
                    onClick={() => handleCopyToClipboard('METRIC2IMPERIAL', 'debug')}
                  >
                    METRIC2IMPERIAL
                  </span>
                  {' '}| Status: Archived
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hint Card */}
      <Card className="bg-blue-900/20 border-blue-700/50">
        <CardContent className="p-4">
          <p className="text-sm text-blue-300">
            💡 <span className="text-blue-400">Investigator's Tip:</span> Certain elements within the report may respond differently upon closer examination. Small irregularities can offer meaningful insight.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
