import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertTriangle, Rocket, Database, MapPin } from 'lucide-react';
import Quiz from './Quiz';

interface MarsIncidentProps {
  onPasswordFound: (password: string) => void;
}

export function MarsIncident({ onPasswordFound }: MarsIncidentProps) {
  const [clickedElements, setClickedElements] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompletedCorrectly, setQuizCompletedCorrectly] = useState(false);

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

  if (showQuiz) {
    return <Quiz 
      onClose={() => setShowQuiz(false)} 
      onAllCorrect={() => setQuizCompletedCorrectly(true)}
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
                    className="mt-4 submit-button"
                    style={{
                      padding: '12px 32px',
                      background: '#61dafb',
                      color: '#1e1e1e',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#4fa8c5';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(97, 218, 251, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#61dafb';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Open Quiz
                  </button>
                </div>
              </div>
            </div>

            {/* Secret password element - appears as a random data point */}
            {quizCompletedCorrectly && (
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