import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Play, Volume2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function BriefingVideo() {
  return (
    <Card className="bg-slate-800/50 border-red-900/50">
      <CardHeader>
        <CardTitle className="text-red-400">Mission Briefing - Introduction</CardTitle>
        <CardDescription className="text-slate-400">
          Watch this briefing to understand your role in the investigation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Embedded Video */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/4DXFurrTM_g"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Mars Climate Orbiter Mission Briefing"
          />
        </div>

        {/* Video Key Points */}
        <div className="space-y-4 text-slate-300">
          <div className="p-4 bg-slate-900/50 rounded-lg border border-red-900/30">
            <h3 className="text-red-400 mb-3">📋 Key Points from Briefing</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Mars Climate Orbiter mission failed on September 23, 1999</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>$327.6 million spacecraft lost during Mars orbital insertion</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Spacecraft entered atmosphere at wrong altitude and disintegrated</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Investigation revealed critical software and systems engineering failures</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-lg border border-red-900/30">
            <h3 className="text-red-400 mb-2">🎯 Your Mission</h3>
            <p className="text-sm">
              As part of the investigation team, you must analyze mission data, identify what went wrong, 
              and locate the classified document. A hidden password in the incident report will grant you access.
            </p>
          </div>

          <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-700/30">
            <h3 className="text-amber-400 mb-2">⚠️ Security Clearance Required</h3>
            <p className="text-sm text-amber-200">
              Some information is classified. Find the access code hidden within the mission data to unlock 
              the full investigation findings and proceed to Round 2.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
