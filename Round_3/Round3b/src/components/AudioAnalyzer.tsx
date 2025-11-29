import { useState, useRef, useEffect } from 'react';
import { Radio, Play, Pause } from 'lucide-react';

interface AudioAnalyzerProps {
  onAnswerSubmit: (answer: string) => void;
  trialsRemaining: number;
}

const TARGET_FREQUENCIES = [
  { freq: 440, name: 'North Ridge', color: '#ef4444' },
  { freq: 550, name: 'Dust Valley', color: '#f59e0b' },
  { freq: 660, name: 'Crystal Canyon', color: '#06b6d4' },
  { freq: 770, name: 'Olympus Gate', color: '#a855f7' },
  { freq: 880, name: 'Valles Deep', color: '#10b981' },
  { freq: 990, name: 'Red Storm Sector', color: '#f97316' },
];

export function AudioAnalyzer({ onAnswerSubmit, trialsRemaining }: AudioAnalyzerProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');
  const [activeFrequency, setActiveFrequency] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
    };
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        setError('Please upload a valid audio file');
        return;
      }

      setAudioFile(file);
      setIsPlaying(false);
      setError('');
      setActiveFrequency(null);

      // Clean up previous audio
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      // Reset refs
      audioElementRef.current = null;
      audioContextRef.current = null;
      analyserRef.current = null;
      sourceRef.current = null;
    }
  };

  const togglePlayPause = async () => {
    if (!audioFile) return;

    try {
      if (!audioElementRef.current) {
        // Create audio element
        const audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audioElementRef.current = audio;

        // Create audio context and analyser
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 16384; // Larger FFT for better frequency resolution
        analyser.smoothingTimeConstant = 0.3; // Less smoothing for more responsive detection
        analyserRef.current = analyser;

        const source = audioContext.createMediaElementSource(audio);
        sourceRef.current = source;

        source.connect(analyser);
        analyser.connect(audioContext.destination);

        audio.addEventListener('ended', () => {
          setIsPlaying(false);
          setActiveFrequency(null);
          if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
          }
        });

        // Set the source after connecting to avoid issues
        const objectURL = URL.createObjectURL(audioFile);
        audio.src = objectURL;

        // Load the audio
        await audio.load();
      }

      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
        setActiveFrequency(null);
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
      } else {
        // Resume audio context if suspended
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        await audioElementRef.current.play();
        setIsPlaying(true);
        visualize();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setError(`Error playing audio file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const findDominantFrequency = (dataArray: Uint8Array): number | null => {
    if (!audioContextRef.current) return null;

    const sampleRate = audioContextRef.current.sampleRate;
    const nyquist = sampleRate / 2;
    const bufferLength = dataArray.length;

    let maxAmplitude = 0;
    let dominantFreq = null;

    // Check each target frequency
    for (const target of TARGET_FREQUENCIES) {
      const targetFreq = target.freq;
      const binIndex = Math.round((targetFreq / nyquist) * bufferLength);

      // Check a wider range around the target frequency (±5 bins for better tolerance)
      let sum = 0;
      let count = 0;
      for (let i = Math.max(0, binIndex - 5); i <= Math.min(bufferLength - 1, binIndex + 5); i++) {
        sum += dataArray[i];
        count++;
      }
      const avgAmplitude = sum / count;

      // Lower threshold and find the maximum
      if (avgAmplitude > maxAmplitude && avgAmplitude > 10) {
        maxAmplitude = avgAmplitude;
        dominantFreq = targetFreq;
      }
    }

    // Only return if we have a significant signal
    if (maxAmplitude > 15) {
      return dominantFreq;
    }

    return null;
  };

  const waveformDataRef = useRef<Map<number, number[]>>(new Map());
  const timeRef = useRef(0);

  const visualize = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Initialize waveform data for each frequency if not exists
    TARGET_FREQUENCIES.forEach(target => {
      if (!waveformDataRef.current.has(target.freq)) {
        waveformDataRef.current.set(target.freq, new Array(100).fill(0));
      }
    });

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      // Find dominant frequency and update active state
      const dominantFreq = findDominantFrequency(dataArray);
      setActiveFrequency(dominantFreq);

      const width = canvas.width;
      const height = canvas.height;
      const leftMargin = 120;
      const rightMargin = 40;
      const topMargin = 20;
      const bottomMargin = 20;
      const graphWidth = width - leftMargin - rightMargin;
      const graphHeight = height - topMargin - bottomMargin;

      // Clear canvas
      ctx.fillStyle = '#0a0e1a';
      ctx.fillRect(0, 0, width, height);

      // Update waveform data for each frequency
      TARGET_FREQUENCIES.forEach(target => {
        const waveData = waveformDataRef.current.get(target.freq)!;
        const isActive = dominantFreq === target.freq;

        // Shift data left
        waveData.shift();

        // Add new peak value based on activity
        if (isActive) {
          const amplitude = 0.7 + Math.random() * 0.3; // High amplitude with variation
          waveData.push(amplitude);
        } else {
          // Decay to baseline
          const lastValue = waveData[waveData.length - 1];
          waveData.push(lastValue * 0.85); // Smooth decay
        }
      });

      // Draw each frequency track
      const trackHeight = graphHeight / TARGET_FREQUENCIES.length;

      TARGET_FREQUENCIES.forEach((target, index) => {
        const isActive = dominantFreq === target.freq;
        const trackY = topMargin + index * trackHeight;
        const centerY = trackY + trackHeight / 2;

        // Draw track background
        ctx.fillStyle = '#0f1729';
        ctx.fillRect(leftMargin, trackY, graphWidth, trackHeight);

        // Draw horizontal separator
        if (index > 0) {
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(leftMargin, trackY);
          ctx.lineTo(leftMargin + graphWidth, trackY);
          ctx.stroke();
        }

        // Draw center line
        ctx.strokeStyle = target.color + '33';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(leftMargin, centerY);
        ctx.lineTo(leftMargin + graphWidth, centerY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw waveform
        const waveData = waveformDataRef.current.get(target.freq)!;
        const waveAmplitude = trackHeight * 0.4;

        // Glow effect for active waveform
        if (isActive) {
          ctx.shadowColor = target.color;
          ctx.shadowBlur = 20;
        }

        // Draw the waveform line
        ctx.strokeStyle = isActive ? target.color : target.color + '66';
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.beginPath();

        for (let i = 0; i < waveData.length; i++) {
          const x = leftMargin + (i / waveData.length) * graphWidth;
          const amplitude = waveData[i] * waveAmplitude;
          const y = centerY - amplitude;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Draw filled area under waveform
        if (isActive) {
          const gradient = ctx.createLinearGradient(0, centerY - waveAmplitude, 0, centerY);
          gradient.addColorStop(0, target.color + '66');
          gradient.addColorStop(1, target.color + '11');
          ctx.fillStyle = gradient;

          ctx.beginPath();
          for (let i = 0; i < waveData.length; i++) {
            const x = leftMargin + (i / waveData.length) * graphWidth;
            const amplitude = waveData[i] * waveAmplitude;
            const y = centerY - amplitude;

            if (i === 0) {
              ctx.moveTo(x, centerY);
              ctx.lineTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.lineTo(leftMargin + graphWidth, centerY);
          ctx.closePath();
          ctx.fill();
        }

        ctx.shadowBlur = 0;

        // Draw frequency label on the left
        ctx.fillStyle = isActive ? '#ffffff' : '#9ca3af';
        ctx.textAlign = 'right';
        ctx.font = isActive ? 'bold 13px monospace' : '12px monospace';
        ctx.fillText(`${target.freq} Hz`, leftMargin - 10, centerY + 4);

        // Draw region name
        ctx.font = isActive ? 'bold 10px monospace' : '10px monospace';
        ctx.fillStyle = isActive ? target.color : '#6b7280';
        ctx.fillText(target.name, leftMargin - 10, centerY - 10);

        // Draw "ACTIVE" indicator
        if (isActive) {
          const pulseSize = 8 + Math.sin(timeRef.current * 0.1) * 2;
          ctx.fillStyle = target.color;
          ctx.beginPath();
          ctx.arc(leftMargin - 50, centerY, pulseSize, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = target.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(leftMargin - 50, centerY, pulseSize + 5, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Dim indicator
          ctx.fillStyle = '#374151';
          ctx.beginPath();
          ctx.arc(leftMargin - 50, centerY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw border
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(leftMargin, topMargin, graphWidth, graphHeight);

      timeRef.current++;
    };

    draw();
  };

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      setError('Please enter your answer!');
      return;
    }
    onAnswerSubmit(userAnswer.trim());
  };

  return (
    <div className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 border-2 border-blue-500/50 rounded-lg p-6 shadow-2xl shadow-blue-500/20 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Radio className="text-cyan-400" size={28} />
          <h2 className="text-xl text-cyan-400">FFT SIGNAL ANALYZER</h2>
        </div>
        <div className="flex items-center gap-2 bg-orange-950/50 border-2 border-orange-500/70 rounded-lg px-4 py-2">
          <span className="text-orange-400">⚠️ TRIALS REMAINING:</span>
          <span className={`text-2xl ${trialsRemaining === 2 ? 'text-green-400' : trialsRemaining === 1 ? 'text-yellow-400' : 'text-red-400'}`}>
            {trialsRemaining}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block mb-2 text-sm text-gray-400">
            📁 Upload Corrupted Telemetry Audio
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="w-full bg-black/40 border border-cyan-500/30 rounded px-4 py-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 file:cursor-pointer"
          />
          {audioFile && (
            <p className="mt-2 text-sm text-cyan-400">✓ Loaded: {audioFile.name}</p>
          )}
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          disabled={!audioFile}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed py-3 px-6 rounded transition-all flex items-center justify-center gap-3"
        >
          {isPlaying ? (
            <>
              <Pause size={20} />
              ⏸️ PAUSE AUDIO
            </>
          ) : (
            <>
              <Play size={20} />
              ▶️ PLAY & ANALYZE
            </>
          )}
        </button>

        {/* Frequency Reference Table */}
        <div className="bg-purple-950/30 border border-purple-500/50 rounded p-4">
          <h3 className="text-sm mb-3 text-purple-400">🗺️ MARS REGIONS & FREQUENCIES</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-400"></span>
              <span className="text-cyan-400">440 Hz</span> → North Ridge
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-400"></span>
              <span className="text-cyan-400">550 Hz</span> → Dust Valley
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-cyan-400"></span>
              <span className="text-cyan-400">660 Hz</span> → Crystal Canyon
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-purple-400"></span>
              <span className="text-cyan-400">770 Hz</span> → Olympus Gate
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-400"></span>
              <span className="text-cyan-400">880 Hz</span> → Valles Deep
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#f97316' }}></span>
              <span className="text-cyan-400">990 Hz</span> → Red Storm Sector
            </div>
          </div>
        </div>

        {/* Frequency Detection Display */}
        <div className="bg-black/40 border border-cyan-500/30 rounded p-4">
          <h3 className="text-sm mb-3 text-orange-400">📊 REAL-TIME WAVEFORM ANALYZER</h3>
          <canvas
            ref={canvasRef}
            width={900}
            height={450}
            className="w-full h-[450px] rounded bg-[#0a0e1a]"
          />
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-400 text-center">
              Watch for animated peaks in the waveforms - the most active frequency shows where the beacon is!
            </p>
          </div>
        </div>

        {/* Manual Answer Input */}
        <div className="bg-orange-950/30 border-2 border-orange-500/70 rounded p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              📍 Enter the Beacon Location:
            </label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => {
                setUserAnswer(e.target.value);
                setError('');
              }}
              placeholder="Type region name here..."
              className="w-full bg-black/40 border border-orange-500/50 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400"
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">⚠️ {error}</p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 py-3 px-6 rounded transition-all shadow-lg shadow-orange-500/50"
          >
            🚀 SUBMIT ANSWER
          </button>
        </div>

        {/* Debug Info */}
        {isPlaying && (
          <div className="bg-purple-950/30 border border-purple-500/30 rounded p-3 text-xs text-gray-400">
            <p>🔍 <span className="text-purple-400">Current Detection:</span> {activeFrequency ? `${activeFrequency} Hz` : 'No signal detected'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
