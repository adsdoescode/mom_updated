import { Card } from './ui/card';
import { Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface LockoutScreenProps {
  unlockAt: number; // timestamp in ms
}

function formatTimeLeft(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function LockoutScreen({ unlockAt }: LockoutScreenProps) {
  const [timeLeftMs, setTimeLeftMs] = useState(Math.max(0, unlockAt - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeftMs(Math.max(0, unlockAt - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [unlockAt]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950 to-slate-950 text-white flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full"
      >
        <Card className="bg-gradient-to-br from-red-950/80 to-black/80 border-red-600 border-4 p-12 text-center">
          <div className="flex justify-center mb-6">
            <Clock className="size-28 text-red-500" />
          </div>
          <h1 className="text-5xl mb-4 text-yellow-400">⏳ LOCKED OUT</h1>
          <p className="text-xl text-slate-300 mb-6">You have used your attempts; please wait for the timer to finish.</p>
          <div className="bg-slate-950/70 p-6 rounded-lg mb-8 border-2 border-red-600">
            <p className="text-4xl text-cyan-300 tracking-wide">{formatTimeLeft(timeLeftMs)}</p>
          </div>
          <div className="flex justify-center">
            <img
              src={`${import.meta.env.BASE_URL}lockout_meme.jpeg`}
              alt="Lockout Meme"
              className="rounded-lg shadow-lg border border-red-500/30 max-w-full h-auto max-h-[300px]"
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default LockoutScreen;
