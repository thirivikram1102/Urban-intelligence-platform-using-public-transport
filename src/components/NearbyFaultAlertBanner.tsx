import React, { useState } from 'react';
import { AlertTriangle, MapPin, X, ArrowRight, Radio, Compass } from 'lucide-react';
import { CityFault, UserLocationData } from '../types';
import { calculateDistanceKm } from '../data/faultData';

interface NearbyFaultAlertBannerProps {
  userLocation: UserLocationData | null;
  cityFaults: CityFault[];
  onSelectFault: (fault: CityFault) => void;
}

export const NearbyFaultAlertBanner: React.FC<NearbyFaultAlertBannerProps> = ({
  userLocation,
  cityFaults,
  onSelectFault,
}) => {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  if (!userLocation) return null;

  // Find nearest active critical or high hazard
  const activeNearbyFaults = cityFaults
    .filter((f) => f.status !== 'RESOLVED' && !dismissedIds.includes(f.id))
    .map((f) => {
      const dist = calculateDistanceKm(
        { lat: userLocation.latitude, lng: userLocation.longitude },
        f.coords
      );
      return { ...f, dist };
    })
    .filter((f) => f.dist <= 4.5 && (f.severity === 'CRITICAL' || f.severity === 'HIGH'))
    .sort((a, b) => a.dist - b.dist);

  if (activeNearbyFaults.length === 0) return null;

  const topHazard = activeNearbyFaults[0];

  return (
    <div className="bg-gradient-to-r from-rose-950/90 via-amber-950/80 to-slate-950/90 border-b border-rose-500/40 text-slate-100 px-4 py-2.5 sm:px-6 shadow-lg backdrop-blur-md animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center flex-shrink-0">
            <Radio className="w-4 h-4 text-rose-400 animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500 text-white uppercase tracking-wider">
                Proximity Hazard Alert
              </span>
              <span className="text-xs font-mono font-bold text-rose-300">
                {topHazard.dist} km from your GPS location
              </span>
            </div>

            <p className="text-xs font-mono text-white font-semibold line-clamp-1 mt-0.5">
              {topHazard.title} • {topHazard.locationName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => onSelectFault(topHazard)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition shadow-sm"
          >
            <span>View Hazard Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setDismissedIds((prev) => [...prev, topHazard.id])}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
