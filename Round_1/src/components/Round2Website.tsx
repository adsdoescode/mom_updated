import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertTriangle, FileSearch, Download, Lock, Key } from 'lucide-react';

export function Round2Website() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black">
      {/* Header */}
      <header className="border-b border-purple-900/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-purple-500" />
              <div>
                <h1 className="text-purple-400">ROUND 2: DEEP INVESTIGATION</h1>
                <p className="text-slate-400 text-sm">Advanced Mission Analysis Protocol</p>
              </div>
            </div>
            <Badge className="bg-purple-600">Active Mission</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Welcome Card */}
          <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-700/50">
            <CardHeader>
              <CardTitle className="text-purple-400 text-2xl">Welcome to Round 2</CardTitle>
              <CardDescription className="text-slate-300">
                You've successfully identified the root cause. Now dive deeper into the investigation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">
                This round will test your ability to analyze complex technical documentation, 
                identify additional failure points, and understand the broader implications of 
                the Mars Climate Orbiter incident.
              </p>
            </CardContent>
          </Card>

          {/* Challenge Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-purple-700/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileSearch className="w-6 h-6 text-purple-400" />
                  <CardTitle className="text-purple-400">Document Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 text-sm">
                  Review the investigation files in the shared folder. Look for:
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Communication logs between teams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Software specification documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Test reports and validation records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Timeline of warning signs</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-700/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="w-6 h-6 text-blue-400" />
                  <CardTitle className="text-blue-400">Hidden Clues</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 text-sm">
                  Multiple clues are hidden in the investigation folder:
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>Examine file names carefully</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>Check metadata and timestamps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>Look for anomalies in the data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>Cross-reference information</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Access Resources */}
          <Card className="bg-slate-800/50 border-purple-700/50">
            <CardHeader>
              <CardTitle className="text-purple-400">Investigation Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-lg border border-purple-700/30">
                  <h4 className="text-purple-300 mb-3 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Mission Files Folder
                  </h4>
                  <p className="text-slate-400 text-sm mb-4">
                    Access the complete investigation documentation, including technical specs, 
                    communication logs, and test reports.
                  </p>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => window.open('https://drive.google.com/drive/folders/your-folder-id', '_blank')}
                  >
                    Open Folder
                  </Button>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <h4 className="text-slate-300 mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Password Protected Files
                  </h4>
                  <p className="text-slate-400 text-sm mb-4">
                    Some files are password protected. Use clues from Round 1 and the folder 
                    contents to unlock them.
                  </p>
                  <Button variant="outline" className="w-full" disabled>
                    Password Required
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-amber-900/20 border-amber-700/50">
            <CardHeader>
              <CardTitle className="text-amber-400">Round 2 Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-slate-300 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">1.</span>
                  <p>Download all files from the investigation folder</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">2.</span>
                  <p>Analyze each document thoroughly for hidden information</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">3.</span>
                  <p>Identify the secondary failures and contributing factors</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">4.</span>
                  <p>Use discovered passwords to unlock protected documents</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">5.</span>
                  <p>Compile your findings and present the complete failure analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timer/Status */}
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">
              Time Remaining: 20 Minutes
            </p>
            <div className="mt-4 max-w-md mx-auto h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-purple-600 to-blue-600" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/50 mt-16 py-6 bg-slate-900/50">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>NASA Advanced Investigation Protocol | Round 2 of 2</p>
        </div>
      </footer>
    </div>
  );
}
