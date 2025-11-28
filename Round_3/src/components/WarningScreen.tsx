import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, Skull } from 'lucide-react';
import { motion } from 'motion/react';

interface WarningScreenProps {
  onContinue: () => void;
}

export function WarningScreen({ onContinue }: WarningScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-orange-950 to-slate-900 text-white flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full"
      >
        <Card className="bg-gradient-to-br from-red-900/60 to-orange-950/60 border-red-500 border-4 p-12 text-center">
          {/* Warning Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <AlertTriangle className="size-32 text-red-500" />
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.5, duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                className="absolute -top-4 -right-4"
              >
                <Skull className="size-16 text-orange-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Warning Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-6xl mb-6">⚠️ WRONG ANSWER! ⚠️</h1>
            <p className="text-3xl text-red-400 mb-4">Mission Control is NOT impressed...</p>
            <p className="text-xl text-orange-300 mb-8">
              That sensor is functioning perfectly. Try harder!
            </p>
          </motion.div>

          {/* Troll Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-950/70 p-6 rounded-lg mb-8 border-2 border-orange-500"
          >
            <h2 className="text-2xl text-yellow-400 mb-3">🤡 BUT WAIT...</h2>
            <p className="text-xl text-slate-200">
              You have <span className="text-red-400 text-3xl">ONE MORE CHANCE</span> left!
            </p>
            <p className="text-slate-400 mt-3">
              Hint: Maybe the problem isn't what you SEE... but what you DON'T see.
            </p>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={onContinue}
              size="lg"
              className="text-xl px-12 py-6 bg-orange-600 hover:bg-orange-700"
            >
              Try Again (Last Chance!)
            </Button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-slate-500 text-sm"
          >
            <p>💀 Next wrong answer = GAME OVER 💀</p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
