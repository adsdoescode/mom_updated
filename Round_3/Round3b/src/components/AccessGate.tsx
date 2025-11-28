import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

interface AccessGateProps {
  onAccessGranted: () => void;
}

export function AccessGate({ onAccessGranted }: AccessGateProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const CORRECT_CODE = 'RED-DART';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Please enter the access code');
      return;
    }

    setIsValidating(true);
    setError('');

    setTimeout(() => {
      if (code.toUpperCase().trim() === CORRECT_CODE) {
        setTimeout(() => {
          onAccessGranted();
        }, 800);
      } else {
        setError('Invalid access code. Access denied.');
        setIsValidating(false);
        setCode('');
      }
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto space-y-8">
        {/* Logo/Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Lock size={48} className="text-cyan-400" />
          </div>
          <h1 className="text-4xl text-cyan-400">CLASSIFIED MISSION ACCESS</h1>
          <p className="text-xl text-orange-400">🔒 AUTHORIZATION REQUIRED 🔒</p>
          <p className="text-gray-300 mt-4">
            This is a restricted Mars orbital operation. Only authorized personnel may proceed.
          </p>
        </div>

        {/* Access Code Form */}
        <div className="bg-gradient-to-br from-[#1A1D21] to-[#0f1116] border-2 border-cyan-600/50 rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="access-code" className="block text-cyan-300 text-lg">
                Enter Mission Access Code:
              </label>
              <input
                id="access-code"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                placeholder="TYPE CODE HERE"
                disabled={isValidating}
                className="w-full px-6 py-4 bg-gray-900 border-2 border-cyan-600 rounded-lg text-xl text-center tracking-widest uppercase focus:border-orange-400 focus:outline-none focus:shadow-[0_0_20px_rgba(251,146,60,0.5)] transition-all disabled:opacity-50"
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-900/30 border border-red-600/50 rounded-lg p-4">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isValidating}
              className={`w-full py-4 rounded-lg transition-all flex items-center justify-center gap-2 text-lg ${
                isValidating
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70'
              }`}
            >
              {isValidating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  VALIDATING...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  REQUEST ACCESS
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <p>
                <span className="text-cyan-400">Security Notice:</span> Unauthorized access attempts are logged and may result in mission termination. Contact mission control if you don't have clearance.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Decoration */}
        <div className="grid grid-cols-3 gap-4 opacity-50">
          <div className="h-1 bg-gradient-to-r from-transparent via-cyan-600 to-transparent"></div>
          <div className="h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent"></div>
          <div className="h-1 bg-gradient-to-r from-transparent via-cyan-600 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
