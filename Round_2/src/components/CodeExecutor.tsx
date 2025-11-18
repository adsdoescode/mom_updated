import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Play, Terminal } from 'lucide-react';

interface CodeExecutorProps {
  answers: { a: number; b: number; c: number };
  onExecute: (lat: number, lon: number) => void;
}

export function CodeExecutor({ answers, onExecute }: CodeExecutorProps) {
  const [hasExecuted, setHasExecuted] = useState(false);
  const [output, setOutput] = useState('');

  const handleExecute = () => {
    // Simulate Python execution
    const latFloat = answers.a / 10000.0;
    const lonFloat = -(answers.b + answers.c / 10000.0);

    const executionOutput = `Python 3.11.0 (main, Nov 16 2024, 12:00:00)
>>> # LOCATOR_KSC.PY executing...
>>> SEED_A = ${answers.a}
>>> SEED_B = ${answers.b}
>>> SEED_C = ${answers.c}
>>> 
>>> # Reconstructing coordinates...
>>> lat_float = ${answers.a} / 10000.0  # = ${latFloat}
>>> lon_float = -(${answers.b} + (${answers.c} / 10000.0))  # = ${lonFloat}
>>> 
>>> print(f"Mission Target Coordinate: [{lat_float}, {lon_float}]")
Mission Target Coordinate: [${latFloat}, ${lonFloat}]
>>> 
>>> # Execution complete. Coordinates locked.`;

    setOutput(executionOutput);
    setHasExecuted(true);

    // Wait a moment before allowing to proceed
    setTimeout(() => {
      onExecute(latFloat, lonFloat);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-amber-400 mb-2">Round 2: Code Execution</h2>
        <p className="text-slate-300">Run the Python decoder to reveal the coordinates</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-amber-300 flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            LOCATOR_KSC.PY
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black p-4 rounded font-mono text-sm overflow-x-auto">
            <pre className="text-green-400">
{`# LOCATOR_KSC.PY
# SEED_A: Latitude digits (${answers.a})
# SEED_B: Longitude degrees (${answers.b})
# SEED_C: Longitude minutes/seconds digits (${answers.c})

SEED_A = ${answers.a}  # From Riddle 1
SEED_B = ${answers.b}  # From Riddle 2
SEED_C = ${answers.c}  # From Riddle 3

# Reconstruct Latitude
lat_float = SEED_A / 10000.0

# Reconstruct Longitude (must be negative)
lon_float = -(SEED_B + (SEED_C / 10000.0))

# Print the result in the target format
print(f"Mission Target Coordinate: [{lat_float}, {lon_float}]")`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {!hasExecuted ? (
        <div className="text-center">
          <Button
            onClick={handleExecute}
            className="bg-green-500 hover:bg-green-600 text-white"
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Execute Code
          </Button>
        </div>
      ) : (
        <Card className="bg-black border-green-500">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Terminal Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{output}</pre>
            <div className="mt-4 text-center">
              <p className="text-green-400 animate-pulse">✓ Coordinates successfully decoded</p>
              <p className="text-slate-400 text-sm mt-2">Proceeding to map visualization...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
