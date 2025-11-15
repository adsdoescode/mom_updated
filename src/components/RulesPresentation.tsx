import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChevronRight, Clock, Search, Lock, Trophy } from 'lucide-react';

export function RulesPresentation() {
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
