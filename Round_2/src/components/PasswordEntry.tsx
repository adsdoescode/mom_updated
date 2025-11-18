import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Lock, Unlock, AlertCircle } from 'lucide-react';

interface PasswordEntryProps {
  onCorrectPassword: () => void;
}

export function PasswordEntry({ onCorrectPassword }: PasswordEntryProps) {
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');

  const correctPasswords = ['KSC', 'ksc', 'Ksc']; // Kennedy Space Center

  const handleSubmit = () => {
    if (correctPasswords.includes(password.trim())) {
      setError('');
      onCorrectPassword();
    } else {
      setAttempts(attempts + 1);
      setError('Incorrect password. Remember: three-letter acronym for the space center.');
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-amber-400 mb-2">Security Checkpoint</h2>
        <p className="text-slate-300">Enter the password to unlock Round 3</p>
      </div>

      <Card className="bg-slate-900/50 border-amber-500">
        <CardHeader>
          <CardTitle className="text-amber-300 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Password Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-800 p-4 rounded border border-slate-700">
            <p className="text-slate-300 text-center mb-4">
              What is the three-letter acronym for the space center at coordinates <span className="text-green-400 font-mono">[28.6083, -80.6042]</span>?
            </p>
            
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-slate-900 border-slate-600 text-slate-200 text-center uppercase"
                maxLength={3}
              />
              <Button
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Unlock className="w-5 h-5" />
              </Button>
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-2 text-red-400 text-sm bg-red-950/30 p-3 rounded border border-red-500/30">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{error}</p>
                  <p className="text-red-300 mt-1">Attempts: {attempts}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-950/30 p-4 rounded border border-blue-500/30">
            <p className="text-blue-300 text-sm text-center">
              💡 Hint: Famous NASA launch facility in Florida (3 letters)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
