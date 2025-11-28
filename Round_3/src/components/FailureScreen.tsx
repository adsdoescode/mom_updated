import { Card } from './ui/card';
import { XCircle, Skull } from 'lucide-react';
import { motion } from 'motion/react';

export function FailureScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950 to-slate-950 text-white flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full"
      >
        <Card className="bg-gradient-to-br from-red-950/80 to-black/80 border-red-600 border-4 p-12 text-center">
          {/* Failure Icon */}
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <XCircle className="size-32 text-red-500" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-4 -right-4"
              >
                <Skull className="size-20 text-red-700" />
              </motion.div>
            </div>
          </motion.div>

          {/* Failure Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-6xl mb-6">💀 MISSION FAILED 💀</h1>
            <p className="text-3xl text-red-400 mb-4">Maximum Attempts Exceeded</p>
            <p className="text-xl text-slate-300 mb-8">
              The orbiter has lost contact with Mission Control...
            </p>
          </motion.div>

          {/* Troll Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-950/70 p-6 rounded-lg mb-8 border-2 border-red-600"
          >
            <h2 className="text-2xl text-red-400 mb-3">🎭 GAME OVER 🎭</h2>
            <p className="text-xl text-slate-200 mb-4">
              You were looking for units that didn't match their labels.
            </p>
            <p className="text-lg text-slate-400">
              <span className="text-red-400">Sensor D</span> was reporting in <span className="text-yellow-400">lbf·ft</span> instead of <span className="text-cyan-400">N·m</span>!
            </p>
            <p className="text-sm text-slate-500 mt-4">
              The conversion factor was <span className="text-yellow-400">1.356</span>
            </p>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-slate-500 text-sm"
          >
            <p>Better luck next time, Space Cadet! 🚀</p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}