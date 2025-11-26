import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, Circle } from 'lucide-react';

interface RiddleRoundProps {
  onComplete: (answers: { a: number; b: number; c: number; d: number }) => void;
}

export function RiddleRound({ onComplete, isCompleted = false }: RiddleRoundProps & { isCompleted?: boolean }) {
  const [answer1, setAnswer1] = useState(isCompleted ? '60' : '');
  const [answer2, setAnswer2] = useState(isCompleted ? '83' : '');
  const [answer3, setAnswer3] = useState(isCompleted ? '60' : '');
  const [answer4, setAnswer4] = useState(isCompleted ? '42' : '');

  const correctAnswers = {
    a: 60,
    b: 83,
    c: 60,
    d: 42,
  };

  const isCorrect1 = answer1 && parseInt(answer1) === correctAnswers.a;
  const isCorrect2 = answer2 && parseInt(answer2) === correctAnswers.b;
  const isCorrect3 = answer3 && parseInt(answer3) === correctAnswers.c;
  const isCorrect4 = answer4 && parseInt(answer4) === correctAnswers.d;

  const allCorrect = isCorrect1 && isCorrect2 && isCorrect3 && isCorrect4;

  const handleSubmit = () => {
    if (allCorrect) {
      onComplete({
        a: correctAnswers.a,
        b: correctAnswers.b,
        c: correctAnswers.c,
        d: correctAnswers.d,
      });
    }
  };

  return (
    <div className="space-y-6">


      {/* Riddle 1 - Latitude */}
      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-amber-300 flex items-center gap-2">
              {isCorrect1 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
              SEED_A: Latitude Decimal
            </CardTitle>
          </div>
          <CardDescription className="text-slate-400">Riddle for the Latitude Component</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-800 p-4 rounded mb-4 border border-slate-700">
            <p className="text-slate-200 italic">
              "I am the product of Monica's most ecstatic teaching moment and her most romantic milestone. Count the number of times she frantically shouted 'SEVEN!' in Season 4. Multiply that by the number of friends present in the apartment for the candlelight proposal. What number am I?"
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter your answer..."
              value={answer1}
              onChange={(e) => setAnswer1(e.target.value)}
              onWheel={(e) => e.currentTarget.blur()}
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
              SEED_B: Latitude Decimal
            </CardTitle>
          </div>
          <CardDescription className="text-slate-400">Riddle for the Longitude Degrees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-800 p-4 rounded mb-4 border border-slate-700">
            <p className="text-slate-200 italic">
              "Before the 2011 victory lap, I was the original miracle. I am the year the 'underdogs' stunned the West Indies at Lord's. I am also the literal title of the Ranveer Singh movie that reenacted that glory. Drop the century and tell me the number that changed cricket history."
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter your answer..."
              value={answer2}
              onChange={(e) => setAnswer2(e.target.value)}
              onWheel={(e) => e.currentTarget.blur()}
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
              SEED_C: Longitude Decimal
            </CardTitle>
          </div>
          <CardDescription className="text-slate-400">Riddle for the Longitude Decimal Component</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-800 p-4 rounded mb-4 border border-slate-700">
            <p className="text-slate-200 italic">
              "Cameron Tucker is dramatic about everything, especially his birthday, which falls on February 29th (Leap Day). In Season 3, he throws a massive tantrum because he is technically only turning '10'. If you fast-forward to the future day when Cam finally celebrates his 15th actual birthday, how old is the man standing in front of you?"
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter your answer..."
              value={answer3}
              onChange={(e) => setAnswer3(e.target.value)}
              onWheel={(e) => e.currentTarget.blur()}
              className="bg-slate-800 border-slate-600 text-slate-200"
            />
            {isCorrect3 && <CheckCircle2 className="w-10 h-10 text-green-500 flex-shrink-0" />}
          </div>
        </CardContent>
      </Card>

      {/* Riddle 4 - Longitude Decimal */}
      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-amber-300 flex items-center gap-2">
              {isCorrect4 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
              SEED_D: Longitude Decimal
            </CardTitle>
          </div>
          <CardDescription className="text-slate-400">Riddle for the Longitude Decimal Component</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-800 p-4 rounded mb-4 border border-slate-700">
            <p className="text-slate-200 italic">
              "In the Spider-Verse, I am the dimension the glitch-spider came from. I am the number painted on the spider's back that bit Miles Morales, creating the anomaly. What number am I?"
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter your answer..."
              value={answer4}
              onChange={(e) => setAnswer4(e.target.value)}
              onWheel={(e) => e.currentTarget.blur()}
              className="bg-slate-800 border-slate-600 text-slate-200"
            />
            {isCorrect4 && <CheckCircle2 className="w-10 h-10 text-green-500 flex-shrink-0" />}
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
          {allCorrect ? 'Proceed to the next section' : '🔒 Solve All Riddles to Continue'}
        </Button>
      </div>
    </div>
  );
}