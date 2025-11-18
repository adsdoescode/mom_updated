import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Trophy, Rocket, Star } from 'lucide-react';

export function RoundThree() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
          <h2 className="text-amber-400">Round 3 Unlocked!</h2>
          <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
        </div>
        <p className="text-slate-300">Congratulations! You've successfully completed the Coordinate Cipher Challenge!</p>
      </div>

      <Card className="bg-gradient-to-br from-amber-900/30 via-purple-900/30 to-blue-900/30 border-amber-500">
        <CardHeader>
          <CardTitle className="text-amber-300 text-center flex items-center justify-center gap-2">
            <Rocket className="w-6 h-6" />
            Mission Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-900/50 p-6 rounded border border-slate-700 text-center">
            <p className="text-green-400 mb-4">🎯 Challenge Summary</p>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center justify-between px-4">
                <span>✓ Round 1: Riddles Solved</span>
                <span className="text-green-400">286083, 80, 6042</span>
              </div>
              <div className="flex items-center justify-between px-4">
                <span>✓ Round 2: Code Executed</span>
                <span className="text-green-400">[28.6083, -80.6042]</span>
              </div>
              <div className="flex items-center justify-between px-4">
                <span>✓ Location Identified</span>
                <span className="text-green-400">Kennedy Space Center</span>
              </div>
              <div className="flex items-center justify-between px-4">
                <span>✓ Password Verified</span>
                <span className="text-green-400">KSC</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 rounded border border-purple-500">
            <div className="text-center">
              <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-yellow-300 mb-2">Achievement Unlocked</h3>
              <p className="text-slate-300 mb-4">Master Codebreaker</p>
              <p className="text-slate-400 text-sm">
                You've proven your skills in mathematics, programming, and geospatial intelligence.
              </p>
            </div>
          </div>

          <div className="text-center text-slate-400 text-sm pt-4">
            <p>🚀 Ready for your next mission?</p>
            <p className="text-amber-400 mt-2">Mission Status: SUCCESS</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
