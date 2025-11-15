import { useState } from 'react';
import { BriefingVideo } from './components/BriefingVideo';
import { RulesPresentation } from './components/RulesPresentation';
import { MarsIncident } from './components/MarsIncident';
import { PasswordProtected } from './components/PasswordProtected';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [discoveredPassword, setDiscoveredPassword] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-red-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-red-900/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-red-500">CLASSIFIED MISSION DEBRIEFING</h1>
              <p className="text-slate-400 text-sm">Mars Climate Orbiter - September 23, 1999</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="briefing" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 mb-8">
            <TabsTrigger value="briefing">Briefing Video</TabsTrigger>
            <TabsTrigger value="rules">Rules & Protocol</TabsTrigger>
            <TabsTrigger value="incident">Incident Report</TabsTrigger>
            <TabsTrigger value="document">Classified Document</TabsTrigger>
          </TabsList>

          <TabsContent value="briefing">
            <BriefingVideo />
          </TabsContent>

          <TabsContent value="rules">
            <RulesPresentation />
          </TabsContent>

          <TabsContent value="incident">
            <MarsIncident onPasswordFound={setDiscoveredPassword} />
          </TabsContent>

          <TabsContent value="document">
            <PasswordProtected discoveredPassword={discoveredPassword} />
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
