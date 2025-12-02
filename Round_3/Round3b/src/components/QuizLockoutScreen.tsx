import { Card } from './ui/card';
import { Clock, Lock } from 'lucide-react';

import { useEffect, useState } from 'react';

interface QuizLockoutScreenProps {
    unlockAt: number; // timestamp in ms
}

function formatTimeLeft(ms: number) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

export function QuizLockoutScreen({ unlockAt }: QuizLockoutScreenProps) {
    const [timeLeftMs, setTimeLeftMs] = useState(Math.max(0, unlockAt - Date.now()));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeftMs(Math.max(0, unlockAt - Date.now()));
        }, 1000);

        // Prevent back navigation
        window.history.pushState(null, "", window.location.href);
        const handlePopState = () => {
            window.history.pushState(null, "", window.location.href);
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            clearInterval(interval);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [unlockAt]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-red-950 to-slate-950 text-white flex items-center justify-center p-8">
            <div className="max-w-3xl w-full animate-in fade-in zoom-in duration-500">
                <Card className="bg-gradient-to-br from-red-950/80 to-black/80 border-red-600 border-4 p-12 text-center shadow-[0_0_50px_rgba(220,38,38,0.5)]">
                    <div className="flex justify-center mb-6">
                        <Lock className="size-28 text-red-500 animate-pulse" />
                    </div>
                    <h1 className="text-5xl mb-4 text-red-500 font-bold tracking-wider">ACCESS SUSPENDED</h1>
                    <p className="text-xl text-slate-300 mb-6">
                        Qualification test failure detected. Security protocols have initiated a temporary lockout.
                    </p>
                    <div className="bg-black/60 p-6 rounded-lg mb-8 border-2 border-red-600/50">
                        <p className="text-sm text-red-400 mb-2 uppercase tracking-widest">Lockout Timer</p>
                        <p className="text-6xl text-red-500 font-mono tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                            {formatTimeLeft(timeLeftMs)}
                        </p>
                    </div>
                    <div className="flex justify-center mb-6">
                        <img
                            src={`${import.meta.env.BASE_URL}rapid_fire_meme.jpeg`}
                            alt="Rapid Fire Meme"
                            className="rounded-lg shadow-lg border border-red-500/30 max-w-full h-auto max-h-[300px]"
                        />
                    </div>
                    <p className="text-gray-500 text-sm">
                        Please wait for the security cooldown to expire before re-attempting the qualification test.
                    </p>
                </Card>
            </div>
        </div>
    );
}
