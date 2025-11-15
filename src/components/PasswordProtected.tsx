import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Lock, Unlock, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PasswordProtectedProps {
  discoveredPassword: string;
}

export function PasswordProtected({ discoveredPassword }: PasswordProtectedProps) {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  const correctPassword = 'METRIC2IMPERIAL';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Access denied. Incorrect password.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAutoFill = () => {
    if (discoveredPassword) {
      setPassword(discoveredPassword);
    }
  };

  if (isUnlocked) {
    return (
      <div className="space-y-6">
        {/* Success Message */}
        <Alert className="bg-green-900/30 border-green-700/50">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">
            Access granted. Viewing classified document.
          </AlertDescription>
        </Alert>

        {/* Classified Document */}
        <Card className="bg-slate-800/50 border-green-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Unlock className="w-6 h-6 text-green-400" />
                <CardTitle className="text-green-400">Root Cause Analysis Report</CardTitle>
              </div>
              <span className="text-xs text-slate-500 font-mono">DOC-MCO-RCA-001</span>
            </div>
            <CardDescription className="text-slate-400">
              Final Investigation Findings - Mars Climate Orbiter Mission Failure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Executive Summary */}
            <div className="p-6 bg-slate-900/50 rounded-lg border border-green-900/30">
              <h3 className="text-green-400 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Executive Summary
              </h3>
              <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
                <p>
                  The Mars Climate Orbiter was lost on September 23, 1999, due to a navigation 
                  error that caused the spacecraft to enter Mars' atmosphere at approximately 
                  57 kilometers altitude instead of the planned 140-150 kilometer altitude.
                </p>
                <p className="text-amber-300">
                  <strong>Root Cause:</strong> A software interface specification discrepancy 
                  between two mission-critical systems.
                </p>
              </div>
            </div>

            {/* The Technical Failure */}
            <div className="p-6 bg-red-900/20 rounded-lg border border-red-700/30">
              <h3 className="text-red-400 mb-4">The Critical Error</h3>
              <div className="space-y-4 text-slate-300 text-sm">
                <p>
                  The spacecraft's navigation software, developed by NASA's Jet Propulsion 
                  Laboratory, was programmed to interpret thruster force data in <strong>metric 
                  units (Newtons)</strong>.
                </p>
                <p>
                  However, the ground-based software developed by Lockheed Martin Astronautics 
                  was outputting this data in <strong>imperial units (pound-force seconds)</strong>.
                </p>
                <div className="p-4 bg-slate-900/50 rounded border border-red-700/50 font-mono text-xs">
                  <p className="text-red-400">Unit Conversion Error:</p>
                  <p className="mt-2">Expected: Newtons (N)</p>
                  <p>Received: Pound-force (lbf)</p>
                  <p className="mt-2 text-amber-400">1 lbf ≈ 4.448 N</p>
                </div>
                <p>
                  This discrepancy caused the spacecraft's trajectory to be miscalculated by 
                  approximately 4.45 times throughout its nine-month journey to Mars.
                </p>
              </div>
            </div>

            {/* Contributing Factors */}
            <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <h3 className="text-green-400 mb-4">Contributing Factors</h3>
              <div className="space-y-3 text-slate-300 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <p>
                    <strong>Inadequate Testing:</strong> The units mismatch was not caught during 
                    integration testing or simulation phases.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <p>
                    <strong>Communication Breakdown:</strong> Different engineering teams used 
                    different unit conventions without proper documentation or verification.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <p>
                    <strong>Schedule Pressure:</strong> The "faster, better, cheaper" approach 
                    led to reduced oversight and quality assurance measures.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <p>
                    <strong>Warning Signs Ignored:</strong> Anomalies in trajectory corrections 
                    were noted but not thoroughly investigated.
                  </p>
                </div>
              </div>
            </div>

            {/* Spacecraft Image */}
            <div className="rounded-lg overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1597635201981-308a4bfd0e55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXNhJTIwc3BhY2VjcmFmdHxlbnwxfHx8fDE3NjIzMDU0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Spacecraft"
                className="w-full h-64 object-cover"
              />
              <p className="text-xs text-slate-500 text-center mt-2">
                Mars Climate Orbiter - Lost September 23, 1999
              </p>
            </div>

            {/* Lessons Learned */}
            <div className="p-6 bg-blue-900/20 rounded-lg border border-blue-700/30">
              <h3 className="text-blue-400 mb-4">Lessons Learned</h3>
              <div className="space-y-3 text-slate-300 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <p>
                    Implement standardized units across all mission software and documentation
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <p>
                    Enhance verification and validation processes for software interfaces
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <p>
                    Improve communication protocols between different contractor teams
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <p>
                    Thoroughly investigate anomalies rather than accepting them as normal variations
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <p>
                    Balance cost and schedule constraints with adequate quality assurance
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-700/50 text-center space-y-4">
              <p className="text-slate-500 text-sm">
                This $327.6 million mission failure became one of the most studied cases in 
                engineering education, highlighting the critical importance of attention to 
                detail and proper systems engineering practices.
              </p>
              <p className="text-green-400 text-sm">
                Round 1 Complete: Investigation Successful
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Round 2 Access */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-700/50">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              Round 2: Advanced Investigation
            </CardTitle>
            <CardDescription className="text-slate-300">
              You've successfully completed Round 1. Proceed to the next phase of your investigation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-900/50 rounded-lg border border-purple-700/30">
              <h4 className="text-purple-300 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Next Steps
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">1</span>
                  <div className="flex-1">
                    <p className="text-slate-300 text-sm mb-2">Access the Round 2 Investigation Platform:</p>
                    <a 
                      href="#round2" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                    >
                      Open Round 2 Website
                      <span>→</span>
                    </a>
                    <p className="text-xs text-slate-500 mt-2 italic">
                      Replace '#round2' with your Round 2 website URL
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">2</span>
                  <div className="flex-1">
                    <p className="text-slate-300 text-sm mb-2">Download the Investigation Files:</p>
                    <a 
                      href="#folder" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Access Mission Files Folder
                    </a>
                    <p className="text-xs text-slate-500 mt-2 italic">
                      Replace '#folder' with your Google Drive folder link
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-700/30">
              <p className="text-amber-200 text-sm">
                ⚠️ <strong>Important:</strong> Keep this window open for reference. You may need 
                information from Round 1 to complete Round 2 challenges.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-red-900/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="w-6 h-6 text-red-400" />
          <CardTitle className="text-red-400">Classified Document</CardTitle>
        </div>
        <CardDescription className="text-slate-400">
          This document contains sensitive mission analysis data and requires authorization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Form */}
        <div className="max-w-md mx-auto space-y-6 py-8">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-xl text-slate-200">Access Restricted</h3>
            <p className="text-sm text-slate-400">
              Enter the password found in the incident report to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter access code..."
                value={password}
                onChange={(e) => setPassword(e.target.value.toUpperCase())}
                className="text-center text-lg tracking-wider bg-slate-900/50 border-slate-700 focus:border-red-500 text-white placeholder:text-slate-500"
                autoComplete="off"
              />
              {discoveredPassword && !isUnlocked && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAutoFill}
                  className="w-full mt-2 text-green-400 hover:text-green-300"
                >
                  Use discovered password
                </Button>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={!password}
            >
              Unlock Document
            </Button>
          </form>

          {/* Hint */}
          <div className="text-center pt-4 border-t border-slate-700/50">
            <p className="text-xs text-slate-500">
              Haven't found the password yet? Return to the Incident Report and look for clues there.
              
            </p>
          </div>
        </div>

        {/* Visual Security Elements */}
        <div className="grid grid-cols-3 gap-4 opacity-20">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-slate-900/50 rounded-lg flex items-center justify-center">
              <Lock className="w-8 h-8 text-slate-700" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
