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
// Do not change the name and type of the variables/functions
// Do not change the logic of the code either

int calculate_checksum(int value) {
    int total=0;
    while (value > 0) {
        total = total + value % 10
        value = value / 10;
    }
    return total
}

int verify_seed(int seed, int expected_checksum) {
    int actual = calculate_checksum(seed);
    if (actual = expected_checksum) {
        return 1
    }
    return 0;
}

double decode_latitude(int seed_a) {
    int lat_int = seed_a / 10000;
    double lat_decimal = (seed_a % 10000) / 10000.0;
    return lat_int + lat_decimal;
}

double decode_longitude(int seed_b, int seed_c) {
    int lon_degrees = seed_b
    double lon_fraction = seed_c / 10000.0;                                   
    double longitude = -(lon_degrees + lon_fraction)
    return longitude;
}

int main() {

    int seed_a = ${answers.a};
    int seed_b = ${answers.b};
    int seed_c = ${answers.c}
    
    printf("=== MARS MISSION NAVIGATION SYSTEM ===\\n");
    prntf("Initializing coordinate decoder...\\n\\n");
    
    printf("Verifying mission seeds...\\n");
    int checksum_a = calculate_checksum(seed_a);
    int checksum_b = calculate_checksum(seed_b)
    int checksum_c = calculate_checksum(seed_c);
    
    printf("SEED_A checksum: %f\\n", checksum_a);
    printf("SEED_B checksum: %f\\n", checksum_b);
    printf("SEED_C checksum: %f\\n", checksum_c);
    
    printf("\\nDecoding coordinates...\\n");
    double latitude = decode_latitude(seed_a);
    double longitude = decode_longitude(seed_b, seed_c);
    
    printf("\\n--- DECODED COORDINATES ---\\n");
    printf("Latitude:  %.4f°\\n", latitude);
    printf("Longitude: %.4f°\\n", longitude);
    printf("\\nMission Target: [.4f, %.4f]\\n", latitude, longitude);
    
    printf("\\n--- COORDINATE VALIDATION ---\\n");
    if (latitude > 0 & latitude < 90) {
        printf("✓ Latitude valid (Northern Hemisphere)\\n");
    } else {
        printf("✗ Latitude out of range\\n";
    }
    
    if (longitude < 0) {
        printf("✓ Longitude valid (Western Hemisphere)\\n");
    } else {
        printf("✗ Longitude out of range\\n");
    }
    
    double eq_dist = fabs(latitude) * 111.32;
    printf("\\nDistance from Equator: %.2f km\\n", eq_dist);
    
    printf("\\n=== NAVIGATION SYSTEM READY ===\\n");
    printf("Coordinates locked for Mars mission\\n");
    
    return 0;
}`;
};

export function CodeExecutor({ answers, onExecute, isCompleted = false }: CodeExecutorProps & { isCompleted?: boolean }) {
  const [code, setCode] = useState(isCompleted ? getBuggyCode(answers)
    .replace('int total;', 'int sum = 0;')
    .replace('total = total + value % 10;', 'sum += value % 10;')
    .replace('return total;', 'return sum;')
    .replace('while (value >= 0)', 'while (value > 0)')
    .replace('if (actual = expected_checksum)', 'if (actual == expected_checksum)')
    .replace('(seed_a % 10000) / 10000', '(seed_a % 10000) / 10000.0')
    .replace('seed_c / 10000', 'seed_c / 10000.0')
    .replace('double longitude = lon_degrees + lon_fraction;', 'return -(lon_degrees + lon_fraction);')
    .replace(`int seed_c = ${answers.c}`, `int seed_c = ${answers.c};`)
    .replace(/printf\("SEED_([ABC]) checksum: %f\\n", checksum_([abc])\);/g, 'printf("SEED_$1 checksum: %d\\n", checksum_$2);')
    : getBuggyCode(answers));
  const [output, setOutput] = useState('');
  const [hasExecuted, setHasExecuted] = useState(isCompleted);
  const [isCorrect, setIsCorrect] = useState(isCompleted);
  const [errorMessage, setErrorMessage] = useState('');
  const [bugsFound, setBugsFound] = useState<string[]>([]);

  const checkCode = (userCode: string) => {
    const bugs: string[] = [];
    let syntaxErrors = 0;
    let runtimeErrors = 0;
    let logicErrors = 0;

    // Check for empty code or missing core structure
    if (!userCode || userCode.trim().length < 50) {
      bugs.push('Code is empty or too short');
      syntaxErrors++;
      return { bugs, syntaxErrors, runtimeErrors, logicErrors, correct: false };
    }

    const requiredFunctions = ['main', 'calculate_checksum', 'verify_seed', 'decode_latitude', 'decode_longitude'];
    const missingFunctions = requiredFunctions.filter(func => !userCode.includes(func));
    if (missingFunctions.length > 0) {
      bugs.push('Missing required functions');
      syntaxErrors++;
    }

    // Syntax Errors
    if (userCode.includes('total = total + value % 10') && !userCode.includes('total = total + value % 10;')) {
      bugs.push('Missing semicolon in calculate_checksum (loop)');
      syntaxErrors++;
    }
    if (userCode.includes('return total') && !userCode.includes('return total;')) {
      bugs.push('Missing semicolon in calculate_checksum (return)');
      syntaxErrors++;
    }
    if (userCode.includes('return 1') && !userCode.includes('return 1;')) {
      bugs.push('Missing semicolon in verify_seed');
      syntaxErrors++;
    }
    if (userCode.includes('int lon_degrees = seed_b') && !userCode.includes('int lon_degrees = seed_b;')) {
      bugs.push('Missing semicolon in decode_longitude (lon_degrees)');
      syntaxErrors++;
    }
    if (userCode.includes('double longitude = -(lon_degrees + lon_fraction)') && !userCode.includes('double longitude = -(lon_degrees + lon_fraction);')) {
      bugs.push('Missing semicolon in decode_longitude (longitude)');
      syntaxErrors++;
    }
    if (userCode.includes(`int seed_c = ${answers.c}`) && !userCode.includes(`int seed_c = ${answers.c};`)) {
      bugs.push('Missing semicolon in main (seed_c)');
      syntaxErrors++;
    }
    if (userCode.includes('prntf')) {
      bugs.push('Typo in printf function name');
      syntaxErrors++;
    }
    if (userCode.includes('int checksum_b = calculate_checksum(seed_b)') && !userCode.includes('int checksum_b = calculate_checksum(seed_b);')) {
      bugs.push('Missing semicolon in main (checksum_b)');
      syntaxErrors++;
    }
    if (userCode.includes('printf("✗ Latitude out of range\\n";')) {
      bugs.push('Missing closing parenthesis in printf');
      syntaxErrors++;
    }

    // Logic Errors
    if (userCode.includes('if (actual = expected_checksum)')) {
      bugs.push('Assignment used instead of comparison');
      logicErrors++;
    }
    if (userCode.includes('printf("SEED_A checksum: %f')) {
      bugs.push('Incorrect format specifier (SEED_A)');
      logicErrors++;
    }
    if (userCode.includes('printf("SEED_B checksum: %f')) {
      bugs.push('Incorrect format specifier (SEED_B)');
      logicErrors++;
    }
    if (userCode.includes('printf("SEED_C checksum: %f')) {
      bugs.push('Incorrect format specifier (SEED_C)');
      logicErrors++;
    }
    if (userCode.includes('Mission Target: [.4f')) {
      bugs.push('Missing % in format specifier');
      logicErrors++;
    }
    if (userCode.includes('latitude > 0 & latitude < 90')) {
      bugs.push('Bitwise operator used instead of logical AND');
      logicErrors++;
    }

    return { bugs, syntaxErrors, runtimeErrors, logicErrors, correct: bugs.length === 0 };
  };

  const handleExecute = () => {
    setHasExecuted(true);

    const result = checkCode(code);
    setIsCorrect(result.correct);
    setBugsFound(result.bugs);

    if (result.syntaxErrors > 0) {
      // Compilation Failed - but show ALL errors found to be helpful
      const totalErrors = result.syntaxErrors + result.runtimeErrors + result.logicErrors;
      setOutput(`gcc -o mars_nav mars_locator.c -lm
mars_locator.c: In function 'main':
mars_locator.c: error: compilation failed due to syntax errors.
`);
      setErrorMessage(`Compilation Failed: ${totalErrors} error(s) detected.`);
      return;
    }

    if (result.runtimeErrors > 0) {
      // Runtime Error
      setOutput(`gcc -o mars_nav mars_locator.c -lm
./mars_nav
...
Runtime Error: Process timed out (Infinite Loop detected).
Execution halted.`);
      setErrorMessage(`Runtime Error: Critical system failure detected.`);
      return;
    }

    // Logic Errors or Correct
    let lat_int = Math.floor(answers.a / 10000);
    let lat_decimal = (answers.a % 10000) / 10000.0;
    if (result.bugs.includes('Integer division in latitude')) {
      lat_decimal = Math.floor((answers.a % 10000) / 10000); // 0
    }
    let latFloat = lat_int + lat_decimal;

    let lon_degrees = answers.b;
    let lon_fraction = answers.c / 10000.0;
    if (result.bugs.includes('Integer division in longitude')) {
      lon_fraction = Math.floor(answers.c / 10000); // 0
    }
    let lonFloat = -(lon_degrees + lon_fraction);
    if (result.bugs.includes('Incorrect longitude sign')) {
      lonFloat = lon_degrees + lon_fraction;
    }


    const checksum_a = String(answers.a).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    const checksum_b = String(answers.b).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    const checksum_c = String(answers.c).split('').reduce((sum, digit) => sum + parseInt(digit), 0);

    // Format specifier bug simulation
    const formatChecksum = (val: number) => (result.bugs.some(b => b.includes('Incorrect format specifier'))) ? '0.000000' : val.toString();

    const equatorDistance = Math.abs(latFloat) * 111.32;

    const executionOutput = `gcc -o mars_nav mars_locator.c -lm
./mars_nav

=== MARS MISSION NAVIGATION SYSTEM ===
Initializing coordinate decoder...

Verifying mission seeds...
SEED_A checksum: ${formatChecksum(checksum_a)}
SEED_B checksum: ${formatChecksum(checksum_b)}
SEED_C checksum: ${formatChecksum(checksum_c)}

Decoding coordinates...

--- DECODED COORDINATES ---
Latitude:  ${latFloat.toFixed(4)}°
Longitude: ${lonFloat.toFixed(4)}°

Mission Target: [${latFloat.toFixed(4)}, ${lonFloat.toFixed(4)}]

--- COORDINATE VALIDATION ---
${latFloat > 0 && latFloat < 90 ? '✓ Latitude valid (Northern Hemisphere)' : '✗ Latitude out of range'}
${lonFloat < 0 && lonFloat > -180 ? '✓ Longitude valid (Western Hemisphere)' : '✗ Longitude out of range'}

Distance from Equator: ${equatorDistance.toFixed(2)} km

=== NAVIGATION SYSTEM READY ===
Coordinates locked for Mars mission

${result.correct ?
        `✓ All systems operational
✓ Coordinates decoded with full precision
✓ Ready for mission deployment` :
        `⚠ WARNING: Precision errors detected in coordinate calculation
⚠ System integrity compromised
⚠ Mission may fail due to incorrect targeting`}
`;

    setOutput(executionOutput);

    if (!result.correct) {
      setErrorMessage(`System Malfunction: ${result.logicErrors} logic error(s) detected.`);
    } else {
      setErrorMessage('');
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
        <p className="text-slate-300">Oh no! The code logs have been corrupted. Fix the bugs to help locate the mission coordinates</p>
      </div>

      {/* Code Editor Card */}
      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-amber-300 flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            mars_locator.c
            {hasExecuted && !isCorrect && (
              <span className="text-red-400 text-sm ml-auto">{bugsFound.length} Errors detected</span>
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
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
                e.preventDefault();
              }
            }}
            style={{ tabSize: 4, lineHeight: '1.5', height: '2500px' }}
          />
          <div className="mt-4 flex gap-3">
            <Button
              onClick={handleExecute}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold shadow-lg shadow-amber-900/20 cursor-pointer"
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

      {/* Proceed Button - Outside the card */}
      {hasExecuted && isCorrect && (
        <div className="flex justify-center mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Button
            onClick={() => {
              const latFloat = answers.a / 10000.0;
              const lonFloat = -(answers.b + answers.c / 10000.0);
              onExecute(latFloat, lonFloat);
            }}
            className="w-full max-w-md py-6 text-2xl font-bold rounded-lg transition-all shadow-lg shadow-amber-900/20 bg-amber-500 hover:bg-amber-600 text-slate-900"
            size="lg"
          >
            Proceed to Next Mission
          </Button>
        </div>
      )}
    </div>
  );
}
