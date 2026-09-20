import React from 'react';
import {
  MapPin,
  Compass,
  ChevronDown,
  Navigation,
  AlertTriangle,
  Radio,
  Sparkles,
  ShieldCheck,
  Building,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { UserLocationDetails, CityFault } from '../types';

interface LocationDetectionBannerProps {
  location: UserLocationDetails;
  onOpenSelector: () => void;
  onRequestGPSDetect: () => void;
  isDetectingGPS: boolean;
  activeFaultsInLocation: CityFault[];
  onViewFaults: () => void;
  theme: 'dark' | 'light';
}

export const LocationDetectionBanner: React.FC<LocationDetectionBannerProps> = ({
  location,
  onOpenSelector,
  onRequestGPSDetect,
  isDetectingGPS,
  activeFaultsInLocation,
  onViewFaults,
  theme,
}) => {
  const isDark = theme === 'dark';

  const criticalFaults = activeFaultsInLocation.filter(
    (f) => f.severity === 'CRITICAL' && f.status !== 'RESOLVED'
  );

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 shadow-sm p-4 sm:p-5 ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200/90 text-slate-900 shadow-slate-100'
      }`}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Location Pin, Detected District and Town */}
        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center flex-shrink-0 text-cyan-600 shadow-sm">
            <MapPin className="w-6 h-6 text-cyan-600" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-cyan-100 text-cyan-800 border border-cyan-200">
                GPS Verified Smart City Node
              </span>
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {location.source === 'gps_reverse_geocoded'
                  ? 'OSM Reverse Geocoded'
                  : location.source === 'manual_selection'
                  ? 'Manually Selected'
                  : 'Automatic Node'}
              </span>
            </div>

            {/* Clear Primary Display: District: Tiruchirappalli | Town: Srirangam */}
            <div className="flex flex-wrap items-baseline gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 font-mono">
                District: <span className="text-cyan-700">{location.district}</span>{' '}
                <span className="text-slate-300 font-light mx-1">|</span> Town:{' '}
                <span className="text-emerald-700">{location.town}</span>
              </h2>
            </div>

            {/* Coordinates & Secondary Address */}
            <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2 font-mono">
              <span className="text-slate-500">
                {location.formattedAddress || `${location.town}, ${location.district}, ${location.state}`}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">
                {location.coords.lat.toFixed(4)}°N, {location.coords.lng.toFixed(4)}°E (±{location.accuracy}m)
              </span>
            </p>
          </div>
        </div>

        {/* Right: Actions & Nearby Issues Badge */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          {/* Nearby Transport Issues Pill */}
          <button
            onClick={onViewFaults}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition active:scale-95 ${
              criticalFaults.length > 0
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 shadow-sm'
                : activeFaultsInLocation.length > 0
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            <AlertTriangle
              className={`w-4 h-4 ${
                criticalFaults.length > 0 ? 'text-rose-600 animate-bounce' : 'text-amber-600'
              }`}
            />
            <span>
              <strong>{activeFaultsInLocation.length}</strong> Nearby Issues in {location.town}
              {criticalFaults.length > 0 && ` (${criticalFaults.length} Critical)`}
            </span>
          </button>

          {/* Change District / Town Button */}
          <button
            onClick={onOpenSelector}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition active:scale-95 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            <span>Change District / Town</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Auto-Detect Location Button */}
          <button
            onClick={onRequestGPSDetect}
            disabled={isDetectingGPS}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs transition active:scale-95 shadow-sm disabled:opacity-60"
            title="Auto-detect current coordinates and reverse-geocode District and Town"
          >
            <Compass className={`w-3.5 h-3.5 ${isDetectingGPS ? 'animate-spin' : ''}`} />
            <span>{isDetectingGPS ? 'Locating...' : 'Auto-Detect GPS'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
