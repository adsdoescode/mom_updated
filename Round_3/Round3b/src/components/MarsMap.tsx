interface MarsMapProps {
  highlightedRegion: string | null;
}

const REGIONS = [
  { name: 'North Ridge', color: 'from-red-600 to-orange-600', position: 'top-2 left-1/2 -translate-x-1/2' },
  { name: 'Dust Valley', color: 'from-yellow-600 to-amber-600', position: 'top-[30%] left-2' },
  { name: 'Crystal Canyon', color: 'from-cyan-600 to-blue-600', position: 'top-[30%] right-2' },
  { name: 'Olympus Gate', color: 'from-purple-600 to-pink-600', position: 'bottom-[30%] left-2' },
  { name: 'Valles Deep', color: 'from-green-600 to-teal-600', position: 'bottom-[30%] right-2' },
  { name: 'Red Storm Sector', color: 'from-orange-600 to-red-700', position: 'bottom-2 left-1/2 -translate-x-1/2' },
];

export function MarsMap({ highlightedRegion }: MarsMapProps) {
  return (
    <div className="bg-gradient-to-br from-red-950/30 to-orange-950/30 border-2 border-orange-500/50 rounded-lg p-6 shadow-2xl shadow-orange-500/20 h-full">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🗺️</span>
        <h2 className="text-xl text-orange-400">MARS SURFACE MAP</h2>
      </div>

      <div className="relative bg-black/40 border border-orange-500/30 rounded-lg p-8 min-h-[600px]">
        {/* Mars surface background effect */}
        <div className="absolute inset-0 bg-gradient-radial from-red-900/20 via-transparent to-transparent rounded-lg pointer-events-none" />
        
        {/* Central Mars icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-10">
          🔴
        </div>

        {/* Regions */}
        <div className="relative h-full min-h-[550px]">
          {REGIONS.map((region) => {
            const isHighlighted = highlightedRegion === region.name;
            return (
              <div
                key={region.name}
                className={`absolute ${region.position} transition-all duration-300`}
              >
                <div
                  className={`
                    bg-gradient-to-br ${region.color}
                    border-2 ${isHighlighted ? 'border-white shadow-2xl shadow-white/50 scale-110' : 'border-white/30'}
                    rounded-lg p-3 w-[150px]
                    transition-all duration-300
                    ${isHighlighted ? 'z-10' : 'hover:scale-105'}
                  `}
                >
                  <div className="flex items-start gap-2">
                    {isHighlighted && <span className="text-lg">📡</span>}
                    <h3 className="text-xs leading-tight">{region.name}</h3>
                  </div>
                  {isHighlighted && (
                    <p className="text-[10px] mt-2 text-yellow-300 animate-pulse">
                      ⚠️ BEACON DETECTED
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">
        Each region corresponds to a unique frequency signature
      </div>
    </div>
  );
}
