import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Lock } from 'lucide-react';

interface MapRevealProps {
  coordinates: { lat: number; lon: number };
  onContinue: () => void;
}

export function MapReveal({ coordinates, onContinue }: MapRevealProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Auto-reveal after a short delay
    const timer = setTimeout(() => setRevealed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const { lat, lon } = coordinates;
  
  // Map URL using OpenStreetMap
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.05},${lat - 0.05},${lon + 0.05},${lat + 0.05}&layer=mapnik&marker=${lat},${lon}`;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-amber-400 mb-2">Round 2: Location Reveal</h2>
        <p className="text-slate-300">The coordinates point to a specific location. Find its name to unlock Round 3.</p>
      </div>

      {/* Coordinates Display */}
      <Card className="bg-slate-900/50 border-amber-500">
        <CardHeader>
          <CardTitle className="text-amber-300 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Mission Target Coordinates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <p className="text-slate-300">Latitude: <span className="text-green-400 font-mono">{lat.toFixed(4)}°</span></p>
            <p className="text-slate-300">Longitude: <span className="text-green-400 font-mono">{lon.toFixed(4)}°</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      {revealed && (
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-amber-300">Interactive Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-96 rounded-lg overflow-hidden border-2 border-slate-700">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={mapUrl}
                className="rounded"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-slate-400 text-sm">
                📍 Zoom in and explore the location to discover its name
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hint Card */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500">
        <CardHeader>
          <CardTitle className="text-purple-300">🔍 Mission Briefing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300">
            This location is a famous space center in Florida. The password is the three-letter acronym for this facility. 
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Hint: It's where many historic NASA missions have launched from.
          </p>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="text-center pt-4">
        <Button
          onClick={onContinue}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900"
          size="lg"
        >
          <Lock className="w-5 h-5 mr-2" />
          Enter Password to Continue
        </Button>
      </div>
    </div>
  );
}
