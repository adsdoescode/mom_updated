import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GraphDataPoint {
  time: number;
  value: number;
}

interface SensorGraphProps {
  data: GraphDataPoint[];
  unit: string;
}

export function SensorGraph({ data, unit }: SensorGraphProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis 
          dataKey="time" 
          stroke="#94a3b8"
          label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
        />
        <YAxis 
          stroke="#94a3b8"
          label={{ value: unit, angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1e293b', 
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#f1f5f9'
          }}
          formatter={(value: number) => [value.toFixed(2), 'Value']}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#06b6d4" 
          strokeWidth={2}
          dot={{ fill: '#06b6d4', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
