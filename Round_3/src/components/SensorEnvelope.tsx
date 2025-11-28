import { Card } from './ui/card';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { SensorGraph } from './SensorGraph';

interface GraphDataPoint {
  time: number;
  value: number;
}

interface SensorData {
  name: string;
  label: string;
  clue: string;
  puzzle: string;
  puzzleExtra?: string;
  expectedRange: string;
  graphRange?: string;
  graphData: GraphDataPoint[];
  unit: string;
  description: string;
  isImposter: boolean;
  contradiction?: string;
}

interface SensorEnvelopeProps {
  id: string;
  data: SensorData;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function SensorEnvelope({ id, data, isSelected, onSelect }: SensorEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(true);

  const getEnvelopeColor = () => {
    const colors: Record<string, string> = {
      A: 'from-blue-900/40 to-blue-950/40 border-blue-700',
      B: 'from-orange-900/40 to-orange-950/40 border-orange-700',
      C: 'from-purple-900/40 to-purple-950/40 border-purple-700',
      D: 'from-green-900/40 to-green-950/40 border-green-700'
    };
    return colors[id] || 'from-slate-900/40 to-slate-950/40 border-slate-700';
  };

  return (
    <Card 
      className={`bg-gradient-to-br ${getEnvelopeColor()} border-2 transition-all duration-300 ${
        isSelected ? 'ring-4 ring-cyan-500' : ''
      }`}
      onClick={() => onSelect(id)}
    >
      <div className="p-6">
        {/* Envelope Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl text-cyan-400">📦 {data.label}</h2>
            <p className="text-slate-300">{data.name}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
          </Button>
        </div>

        {/* Quick Info */}
        <div className="bg-slate-950/50 p-3 rounded-lg mb-4">
          <p className="text-sm text-slate-400">Expected Range</p>
          <p className="text-xl text-cyan-300">{data.expectedRange}</p>
        </div>

        {/* Expanded Content */}
        {isOpen && (
          <div className="space-y-4 mt-4 animate-in slide-in-from-top-2 duration-300">
            {/* Description */}
            <div className="bg-slate-950/50 p-4 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Description</p>
              <p className="text-white">{data.description}</p>
            </div>

            {/* Clue */}
            <div className="bg-slate-950/50 p-4 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm text-yellow-400 mb-1">💡 Clue</p>
              <p className="text-slate-200">{data.clue}</p>
            </div>

            {/* Puzzle */}
            <div className="bg-slate-950/50 p-4 rounded-lg border-l-4 border-cyan-500">
              <p className="text-sm text-cyan-400 mb-1">🧩 Logic Puzzle</p>
              <p className="text-slate-200 italic">"{data.puzzle}"</p>
              {data.puzzleExtra && (
                <p className="text-slate-300 italic mt-2">"{data.puzzleExtra}"</p>
              )}
            </div>

            {/* Graph */}
            <div className="bg-slate-950/50 p-4 rounded-lg">
              <p className="text-sm text-slate-400 mb-3">📈 Sensor Readings</p>
              <SensorGraph data={data.graphData} unit={data.unit} />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}