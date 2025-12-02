import { Card } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, Rocket, Lock, Unlock } from 'lucide-react';
import { motion } from 'motion/react';

export function UnlockedScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full"
      >
        <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border-emerald-500 border-2 p-12 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <CheckCircle2 className="size-24 text-emerald-400" />
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -top-2 -right-2"
              >
                <Unlock className="size-10 text-yellow-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl mb-4 text-emerald-300">ACCESS GRANTED</h1>
            <p className="text-2xl text-emerald-300 mb-6">Imposter Identified!</p>
          </motion.div>

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-950/50 p-6 rounded-lg mb-8 text-left"
          >
            <h2 className="text-xl text-cyan-400 mb-3">🔍 Analysis Report</h2>
            <div className="space-y-2 text-slate-200">
              <p><strong className="text-red-400">Sensor D – Torque Sensor</strong> was the imposter.</p>
              <p className="mt-3">⚠️ <strong>Critical Error Detected:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                <li>Expected range: <span className="text-green-400">900–950 N·m</span></li>
                <li>Measured range: <span className="text-yellow-400">915–975</span> (appeared correct)</li>
                <li>The sensor was reporting in <strong>lbf·ft</strong> (pound-force feet) instead of N·m!</li>
                <li>Clue: "My language is foreign" – hidden hint about imperial units</li>
              </ul>
            </div>
          </motion.div>

          {/* Password Reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border-2 border-yellow-500 p-6 rounded-lg"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Lock className="size-6 text-yellow-400" />
              <h3 className="text-xl text-yellow-300">Next Stage Password</h3>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg">
              <p className="text-4xl tracking-wider text-cyan-400 select-all">RED-DART</p>
            </div>
            <p className="text-sm text-slate-400 mt-3">Use this password to proceed to the next challenge</p>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 flex items-center justify-center gap-2 text-slate-400"
          >
            <Rocket className="size-5" />
            <p>Mission Control – Data Validation Complete</p>
          </motion.div>
          <div className="mt-6 flex justify-center">
            {/* Static file download - place your audio file in public/audio/mission-sucess.wav */}
            <Button asChild variant="default" className="px-6">
              <a href="/round3/audio/mission-sucess.wav" download>
                Download Mission Audio
              </a>
            </Button>
            <Button asChild variant="outline" className="px-6 ml-4">
              <a href="/round3/Round3b/">
                Proceed to Telemetry Decoding
              </a>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}