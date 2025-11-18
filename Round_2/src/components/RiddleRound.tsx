import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, Circle } from 'lucide-react';

interface RiddleRoundProps {
  onComplete: (answers: { a: number; b: number; c: number }) => void;
}

export function RiddleRound({ onComplete }: RiddleRoundProps) {
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');

  const correctAnswers = {
    a: 286083,
    b: 80,
    c: 6042,
  };

  const isCorrect1 = answer1 && parseInt(answer1) === correctAnswers.a;
  const isCorrect2 = answer2 && parseInt(answer2) === correctAnswers.b;
  const isCorrect3 = answer3 && parseInt(answer3) === correctAnswers.c;

  const allCorrect = isCorrect1 && isCorrect2 && isCorrect3;

  const handleSubmit = () => {
    if (allCorrect) {
      onComplete({
        a: correctAnswers.a,
        b: correctAnswers.b,
        c: correctAnswers.c,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-amber-400 mb-2">Round 1: The Coordinate Riddles</h2>
        <p className="text-slate-300">Solve these riddles to obtain the coordinate seeds</p>
      </div>

      {/* Riddle 1 - Latitude */}
      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-amber-300 flex items-center gap-2">
              {isCorrect1 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
              SEED_A: Latitude Digits
            </CardTitle>
          </div>
          <CardDescription className="text-slate-400">Riddle for the Latitude Component</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-800 p-4 rounded mb-4 border border-slate-700">
            <p className="text-slate-200 italic">
              "I am a number that is twice the total number of days in the year 143,041 and a half. What number am I?"
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter your answer..."
              value={answer1}
              onChange={(e) => setAnswer1(e.target.value)}
              className="bg-slate-800 border-slate-600 text-slate-200"
            />
            {isCorrect1 && <CheckCircle2 className="w-10 h-10 text-green-500 flex-shrink-0" />}
          </div>
        </CardContent>
      </Card>

      {/* Riddle 2 - Longitude Degrees */}
      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-amber-300 flex items-center gap-2">
              {isCorrect2 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
              SEED_B: Longitude Degrees
            </CardTitle>
          </div>
          <CardDescription className="text-slate-400">Riddle for the Longitude Degrees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-800 p-4 rounded mb-4 border border-slate-700">
            <p className="text-slate-200 italic">
              "I am the number of bits in ten bytes. (One byte equals 8 bits). What number am I?"
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter your answer..."
              value={answer2}
              onChange={(e) => setAnswer2(e.target.value)}
              className="bg-slate-800 border-slate-600 text-slate-200"
            />
            {isCorrect2 && <CheckCircle2 className="w-10 h-10 text-green-500 flex-shrink-0" />}
          </div>
        </CardContent>
      </Card>

      {/* Riddle 3 - Longitude Minutes/Seconds */}
      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-amber-300 flex items-center gap-2">
              {isCorrect3 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
              SEED_C: Longitude Decimal Digits
            </CardTitle>
          </div>
          <CardDescription className="text-slate-400">Riddle for the Longitude Decimal Component</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-800 p-4 rounded mb-4 border border-slate-700">
            <p className="text-slate-200 italic">
              "I am the result of 123 × 49 + 15. What number am I?"
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter your answer..."
              value={answer3}
              onChange={(e) => setAnswer3(e.target.value)}
              className="bg-slate-800 border-slate-600 text-slate-200"
            />
            {isCorrect3 && <CheckCircle2 className="w-10 h-10 text-green-500 flex-shrink-0" />}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!allCorrect}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900"
          size="lg"
        >
          {allCorrect ? '🚀 Proceed to Code Execution' : '🔒 Solve All Riddles to Continue'}
        </Button>
      </div>
    </div>
  );
}