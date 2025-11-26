import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Play, Terminal, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';

interface CodeExecutorProps {
  answers: { a: number; b: number; c: number };
  onExecute: (lat: number, lon: number) => void;
}

// The buggy code that users start with - much longer and more complex
const getBuggyCode = (answers: { a: number; b: number; c: number }) => {
  return `#include <stdio.h>
#include <math.h>

// Mars Mission Navigation System
// Decode coordinates from mission seeds

int calculate_checksum(int value) {
    int sum;
    while (value >= 0) {
        sum = sum + value % 10;
        value = value / 10;
    }
    return sum;
}

int verify_seed(int seed, int expected_checksum) {
    int actual = calculate_checksum(seed);
    if (actual = expected_checksum) {
        return 1;
    }
    return 0;
}

double decode_latitude(int seed_a) {
    // Convert seed to latitude coordinate
    int lat_int = seed_a / 10000;
    double lat_decimal = (seed_a % 10000) / 10000;
    double latitude = lat_int + lat_decimal;
    return latitude;
}

double decode_longitude(int seed_b, int seed_c) {
    // Longitude is negative (West)
    int lon_degrees = seed_b;
    double lon_minutes = seed_c / 10000;
    double longitude = lon_degrees + lon_minutes;
    return longitude;
}

int main() {
    // Mission seeds from riddles
    int seed_a = ${answers.a};
    int seed_b = ${answers.b};
    int seed_c = ${answers.c}
    
    printf("=== MARS MISSION NAVIGATION SYSTEM ===\\n");
    printf("Initializing coordinate decoder...\\n\\n");
    
    // Verify seeds
    printf("Verifying mission seeds...\\n");
    int checksum_a = calculate_checksum(seed_a);
    int checksum_b = calculate_checksum(seed_b);
    int checksum_c = calculate_checksum(seed_c);
    
    printf("SEED_A checksum: %f\\n", checksum_a);
    printf("SEED_B checksum: %f\\n", checksum_b);
    printf("SEED_C checksum: %f\\n", checksum_c);
    
    // Decode coordinates
    printf("\\nDecoding coordinates...\\n");
    double latitude = decode_latitude(seed_a);
    double longitude = decode_longitude(seed_b, seed_c);
    
    // Display results
    printf("\\n--- DECODED COORDINATES ---\\n");
    printf("Latitude:  %.4f°\\n", latitude);
    printf("Longitude: %.4f°\\n", longitude);
    printf("\\nMission Target: [%.4f, %.4f]\\n", latitude, longitude);
    
    // Validation check
    printf("\\n--- COORDINATE VALIDATION ---\\n");
    if (latitude > 0 && latitude < 90) {
        printf("✓ Latitude valid (Northern Hemisphere)\\n");
    } else {
        printf("✗ Latitude out of range\\n");
    }
    
    if (longitude < 0 && longitude > -180) {
        printf("✓ Longitude valid (Western Hemisphere)\\n");
    } else {
        printf("✗ Longitude out of range\\n");
    }
    
    // Calculate distance from equator
    double equator_distance = fabs(latitude) * 111.32;
    printf("\\nDistance from Equator: %.2f km\\n", equator_distance);
    
    // Mission status
    printf("\\n=== NAVIGATION SYSTEM READY ===\\n");
    printf("Coordinates locked for Mars mission\\n");
    
    return 0;
}`;
};

export function CodeExecutor({ answers, onExecute, isCompleted = false }: CodeExecutorProps & { isCompleted?: boolean }) {
  const [code, setCode] = useState(isCompleted ? getBuggyCode(answers).replace('int sum;', 'int sum = 0;').replace('while (value >= 0)', 'while (value > 0)').replace('if (actual = expected_checksum)', 'if (actual == expected_checksum)').replace('(seed_a % 10000) / 10000', '(seed_a % 10000) / 10000.0').replace('seed_c / 10000', 'seed_c / 10000.0').replace('-(lon_degrees + lon_minutes)', '-1 * (lon_degrees + lon_minutes)').replace('int seed_c =', `int seed_c = ${answers.c};`).replace('printf("SEED_A checksum: %f', 'printf("SEED_A checksum: %d') : getBuggyCode(answers));
  const [output, setOutput] = useState('');
  const [hasExecuted, setHasExecuted] = useState(isCompleted);
  const [isCorrect, setIsCorrect] = useState(isCompleted);
  const [errorMessage, setErrorMessage] = useState('');
  const [bugsFound, setBugsFound] = useState<string[]>([]);

  const checkCode = (userCode: string): { correct: boolean; bugs: string[] } => {
    const foundBugs: string[] = [];

    // Bug 1: Uninitialized variable in calculate_checksum
    if (userCode.includes('int sum;') && !userCode.includes('int sum = 0;')) {
      foundBugs.push('Uninitialized variable');
    }

    // Bug 2: Infinite loop in calculate_checksum
    if (userCode.includes('while (value >= 0)')) {
      foundBugs.push('Infinite loop condition');
    }

    // Bug 3: Assignment instead of comparison in verify_seed
    if (userCode.includes('if (actual = expected_checksum)')) {
      foundBugs.push('Assignment used instead of comparison');
    }

    // Bug 4: Integer division in decode_latitude
    if (userCode.includes('(seed_a % 10000) / 10000') && !userCode.includes('(seed_a % 10000) / 10000.0')) {
      foundBugs.push('Integer division in latitude');
    }

    // Bug 5: Integer division in decode_longitude
    if (userCode.includes('seed_c / 10000') && !userCode.includes('seed_c / 10000.0')) {
      foundBugs.push('Integer division in longitude');
    }

    // Bug 6: Missing negative sign for longitude
    if (!userCode.includes('-(lon_degrees + lon_minutes)') && !userCode.includes('-1 *') && !userCode.includes('0 -')) {
      foundBugs.push('Incorrect longitude sign');
    }

    // Bug 7: Missing semicolon
    if (userCode.includes('int seed_c =') && !userCode.includes('int seed_c = ' + answers.c + ';')) {
      foundBugs.push('Missing semicolon');
    }

    // Bug 8: Wrong printf format
    if (userCode.includes('printf("SEED_A checksum: %f') || userCode.includes('printf("SEED_B checksum: %f') || userCode.includes('printf("SEED_C checksum: %f')) {
      foundBugs.push('Incorrect format specifier');
    }

    const allFixed = foundBugs.length === 0;
    return { correct: allFixed, bugs: foundBugs };
  };

  const handleExecute = () => {
    setHasExecuted(true);

    const result = checkCode(code);
    setIsCorrect(result.correct);
    setBugsFound(result.bugs);

    if (result.correct) {
      // Correct output
      const latFloat = answers.a / 10000.0;
      const lonFloat = -(answers.b + answers.c / 10000.0);

      const checksum_a = String(answers.a).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      const checksum_b = String(answers.b).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      const checksum_c = String(answers.c).split('').reduce((sum, digit) => sum + parseInt(digit), 0);

      const equatorDistance = Math.abs(latFloat) * 111.32;

      const executionOutput = `gcc -o mars_nav mars_locator.c -lm
./mars_nav

=== MARS MISSION NAVIGATION SYSTEM ===
Initializing coordinate decoder...

Verifying mission seeds...
SEED_A checksum: ${checksum_a}
SEED_B checksum: ${checksum_b}
SEED_C checksum: ${checksum_c}

Decoding coordinates...

--- DECODED COORDINATES ---
Latitude:  ${latFloat.toFixed(4)}°
Longitude: ${lonFloat.toFixed(4)}°

Mission Target: [${latFloat.toFixed(4)}, ${lonFloat.toFixed(4)}]

--- COORDINATE VALIDATION ---
✓ Latitude valid (Northern Hemisphere)
✓ Longitude valid (Western Hemisphere)

Distance from Equator: ${equatorDistance.toFixed(2)} km

=== NAVIGATION SYSTEM READY ===
Coordinates locked for Mars mission

✓ All systems operational
✓ Coordinates decoded with full precision
✓ Ready for mission deployment`;

      setOutput(executionOutput);
      setErrorMessage('');

      setErrorMessage('');
    } else {
      // Buggy output - showing wrong calculations
      const latInt = Math.floor(answers.a / 10000);
      const latDecimal = Math.floor((answers.a % 10000) / 10000); // This will be 0 due to integer division
      const latWrong = latInt + latDecimal;

      const lonMinutes = Math.floor(answers.c / 10000); // This will be 0 due to integer division
      const lonWrong = -(answers.b + lonMinutes);

      const checksum_a = String(answers.a).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      const checksum_b = String(answers.b).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      const checksum_c = String(answers.c).split('').reduce((sum, digit) => sum + parseInt(digit), 0);

      const equatorDistance = Math.abs(latWrong) * 111.32;

      const executionOutput = `gcc -o mars_nav mars_locator.c -lm
./mars_nav

=== MARS MISSION NAVIGATION SYSTEM ===
Initializing coordinate decoder...

Verifying mission seeds...
SEED_A checksum: ${checksum_a}
SEED_B checksum: ${checksum_b}
SEED_C checksum: ${checksum_c}

Decoding coordinates...

--- DECODED COORDINATES ---
Latitude:  ${latWrong.toFixed(4)}°
Longitude: ${lonWrong.toFixed(4)}°

Mission Target: [${latWrong.toFixed(4)}, ${lonWrong.toFixed(4)}]

--- COORDINATE VALIDATION ---
✓ Latitude valid (Northern Hemisphere)
✓ Longitude valid (Western Hemisphere)

Distance from Equator: ${equatorDistance.toFixed(2)} km

=== NAVIGATION SYSTEM READY ===
Coordinates locked for Mars mission

⚠ WARNING: Precision errors detected in coordinate calculation
⚠ Integer division causing data loss
⚠ Mission may fail due to incorrect targeting`;

      setOutput(executionOutput);
      setErrorMessage(`Compilation Failed: ${result.bugs.length} errors detected.`);
    }
  };

  const handleReset = () => {
    setCode(getBuggyCode(answers));
    setHasExecuted(false);
    setIsCorrect(false);
    setOutput('');
    setErrorMessage('');
    setBugsFound([]);
  };

  useEffect(() => {
    if (isCompleted) {
      // Simulate successful execution output
      const latFloat = answers.a / 10000.0;
      const lonFloat = -(answers.b + answers.c / 10000.0);
      const checksum_a = String(answers.a).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      const checksum_b = String(answers.b).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      const checksum_c = String(answers.c).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      const equatorDistance = Math.abs(latFloat) * 111.32;

      const executionOutput = `gcc -o mars_nav mars_locator.c -lm
./mars_nav

=== MARS MISSION NAVIGATION SYSTEM ===
Initializing coordinate decoder...

Verifying mission seeds...
SEED_A checksum: ${checksum_a}
SEED_B checksum: ${checksum_b}
SEED_C checksum: ${checksum_c}

Decoding coordinates...

--- DECODED COORDINATES ---
Latitude:  ${latFloat.toFixed(4)}°
Longitude: ${lonFloat.toFixed(4)}°

Mission Target: [${latFloat.toFixed(4)}, ${lonFloat.toFixed(4)}]

--- COORDINATE VALIDATION ---
✓ Latitude valid (Northern Hemisphere)
✓ Longitude valid (Western Hemisphere)

Distance from Equator: ${equatorDistance.toFixed(2)} km

=== NAVIGATION SYSTEM READY ===
Coordinates locked for Mars mission

✓ All systems operational
✓ Coordinates decoded with full precision
✓ Ready for mission deployment`;
      setOutput(executionOutput);
    }
  }, [isCompleted, answers]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-amber-400 mb-2 text-2xl font-bold">Debug the Navigation System</h2>
        <p className="text-slate-300">Fix the bugs in the Mars Mission coordinate decoder</p>
      </div>

      {/* Code Editor Card */}
      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-amber-300 flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            mars_locator.c
            {hasExecuted && !isCorrect && (
              <span className="text-red-400 text-sm ml-auto">Errors detected</span>
            )}
            {hasExecuted && isCorrect && (
              <span className="text-green-400 text-sm ml-auto flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                All bugs fixed!
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-black p-4 rounded font-mono text-sm text-green-400 border border-slate-700 focus:border-amber-500 focus:outline-none resize-none"
            spellCheck={false}
            style={{ tabSize: 4, lineHeight: '1.5', height: '2500px' }}
          />
          <div className="mt-4 flex gap-3">
            <Button
              onClick={handleExecute}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold shadow-lg shadow-amber-900/20"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Compile & Run
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output Display */}
      {hasExecuted && (
        <Card className={`${isCorrect ? 'bg-black border-green-500' : 'bg-black border-red-500'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              <Terminal className="w-5 h-5" />
              Terminal Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className={`font-mono text-sm whitespace-pre-wrap ${isCorrect ? 'text-green-400' : 'text-yellow-400'}`}>
              {output}
            </pre>

            {isCorrect ? (
              <div className="mt-4 text-center space-y-2">
                <p className="text-green-400 animate-pulse flex items-center justify-center gap-2 text-lg font-semibold">
                  <CheckCircle2 className="w-6 h-6" />
                  ✓ All bugs fixed! Navigation system operational.
                </p>
                <p className="text-emerald-300 text-sm">Coordinates decoded with full precision</p>
                <p className="text-emerald-300 text-sm">Coordinates decoded with full precision</p>
                <Button
                  onClick={() => {
                    const latFloat = answers.a / 10000.0;
                    const lonFloat = -(answers.b + answers.c / 10000.0);
                    onExecute(latFloat, lonFloat);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 mt-4 font-bold text-lg px-8 py-6"
                  size="lg"
                >
                  🚀 Proceed to Next Mission
                </Button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-red-950/50 border border-red-800 rounded">
                  <p className="text-red-300 flex items-center gap-2 font-semibold mb-2">
                    <AlertCircle className="w-5 h-5" />
                    {errorMessage}
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    Review the code carefully. Check for syntax errors, logic flaws, and type mismatches.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
