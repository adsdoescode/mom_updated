import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Lock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapRevealProps {
  coordinates: { lat: number; lon: number };
  onContinue: () => void;
  isCompleted?: boolean;
}

// Component to update map center
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export function MapReveal({ coordinates, onContinue, isCompleted = false }: MapRevealProps) {
  const [revealed, setRevealed] = useState(isCompleted);
  const [inputLat, setInputLat] = useState(isCompleted ? String(coordinates.lat) : '');
  const [inputLon, setInputLon] = useState(isCompleted ? String(coordinates.lon) : '');
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(isCompleted ? [coordinates.lat, coordinates.lon] : null);
  const [isCorrect, setIsCorrect] = useState(isCompleted);

  useEffect(() => {
    // Auto-reveal after a short delay
    const timer = setTimeout(() => setRevealed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const lat = parseFloat(inputLat);
    const lon = parseFloat(inputLon);
    if (!isNaN(lat) && !isNaN(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
      setMarkerPosition([lat, lon]);

      // Check if coordinates match target (with tolerance)
      const tolerance = 0.01;
      const latMatch = Math.abs(lat - coordinates.lat) < tolerance;
      const lonMatch = Math.abs(lon - coordinates.lon) < tolerance;
      setIsCorrect(latMatch && lonMatch);
    } else {
      setMarkerPosition(null);
      setIsCorrect(false);
    }
  }, [inputLat, inputLon, coordinates]);

  return (
    <div className="space-y-6">

      {/* Input Fields */}
      <Card className="bg-slate-900/50 border-amber-500">
        <CardHeader>
          <CardTitle className="text-amber-300 flex items-center gap-2">
            Enter the access codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm block mb-1">DIV_A</label>
              <input
                type="text"
                value={inputLat}
                onChange={(e) => setInputLat(e.target.value)}
                className="bg-slate-800 border border-slate-600 text-slate-200 rounded px-3 py-2 w-full focus:outline-none focus:border-amber-500"
                placeholder="e.g. 28.6083"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 text-sm block mb-1">DIV_B</label>
              <input
                type="text"
                value={inputLon}
                onChange={(e) => setInputLon(e.target.value)}
                className="bg-slate-800 border border-slate-600 text-slate-200 rounded px-3 py-2 w-full focus:outline-none focus:border-amber-500"
                placeholder="e.g. -80.6042"
              />
            </div>
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
            <div className="relative w-full h-96 rounded-lg overflow-hidden border-2 border-slate-700 z-0">
              <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markerPosition && (
                  <>
                    <Marker position={markerPosition}>
                      <Popup>
                        Target Location
                      </Popup>
                    </Marker>
                    <ChangeView center={markerPosition} zoom={13} />
                  </>
                )}
              </MapContainer>
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
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="text-center pt-4">
        <Button
          onClick={onContinue}
          disabled={!isCorrect}
          className={`bg-amber-500 hover:bg-amber-600 text-slate-900 ${!isCorrect ? 'opacity-50 cursor-not-allowed' : ''}`}
          size="lg"
        >
          <Lock className="w-5 h-5 mr-2" />
          Enter access codes to Continue
        </Button>
      </div>
    </div>
  );
}
