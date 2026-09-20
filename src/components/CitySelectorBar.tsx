import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Navigation,
  ChevronDown,
  AlertTriangle,
  Plus,
  Radio,
  Flame,
  Clock,
  Layers,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { CityData, UserLocationData, CityFault } from '../types';
import { SUPPORTED_CITIES, calculateDistanceKm } from '../data/faultData';

interface CitySelectorBarProps {
  activeCity: CityData;
  onSelectCity: (city: CityData) => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  userLocation: UserLocationData | null;
  onRequestDetectCity: () => void;
  isLocating: boolean;
  onOpenReportModal: () => void;
  cityFaults: CityFault[];
  theme: 'dark' | 'light';
}

export const CitySelectorBar: React.FC<CitySelectorBarProps> = ({
  activeCity,
  onSelectCity,
  selectedDistrict,
  onSelectDistrict,
  userLocation,
  onRequestDetectCity,
  isLocating,
  onOpenReportModal,
  cityFaults,
  theme,
}) => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const isDark = theme === 'dark';

  // Filter faults for this city
  const activeFaults = cityFaults.filter(
    (f) => f.cityId === activeCity.id && f.status !== 'RESOLVED'
  );
  const criticalCount = activeFaults.filter((f) => f.severity === 'CRITICAL').length;

  // Nearby hazard calculation if user location is active
  const nearbyFaults = userLocation
    ? cityFaults.filter((f) => {
        if (f.status === 'RESOLVED') return false;
        const dist = calculateDistanceKm(
          { lat: userLocation.latitude, lng: userLocation.longitude },
          f.coords
        );
        return dist <= 5.0; // within 5 km
      })
    : [];

  return (
    <div
      className={`border-b transition-colors px-4 py-2.5 sm:px-6 lg:px-8 ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-slate-200 backdrop-blur-md'
          : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left Side: City Selector & GPS Detection */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* City Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition shadow-sm ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white hover:border-cyan-500'
                  : 'bg-slate-100 border-slate-300 text-slate-900 hover:border-cyan-600'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {activeCity.name}, {activeCity.state}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isCityDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsCityDropdownOpen(false)}
                />
                <div
                  className={`absolute left-0 top-full mt-1.5 w-64 rounded-2xl border shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    Select Smart City Node
                  </div>
                  {SUPPORTED_CITIES.map((city) => {
                    const isSelected = city.id === activeCity.id;
                    return (
                      <button
                        key={city.id}
                        onClick={() => {
                          onSelectCity(city);
                          setIsCityDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs font-mono transition ${
                          isSelected
                            ? isDark
                              ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                              : 'bg-cyan-50 text-cyan-700 font-bold'
                            : isDark
                            ? 'hover:bg-slate-800 text-slate-300'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div>
                          <p>{city.name}</p>
                          <p className="text-[10px] text-slate-400">{city.state}</p>
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            city.congestionIndex > 75
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {city.activeFaultsCount} hazards
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* GPS Auto-Detect Button */}
          <button
            onClick={onRequestDetectCity}
            disabled={isLocating}
            title="Auto-detect current city and nearby hazards using device GPS"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono transition ${
              userLocation
                ? isDark
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : isDark
                ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-cyan-700'
            }`}
          >
            <Compass
              className={`w-3.5 h-3.5 ${
                isLocating ? 'animate-spin text-cyan-400' : 'text-emerald-400'
              }`}
            />
            <span>
              {isLocating
                ? 'Resolving GPS...'
                : userLocation
                ? `GPS: ±${userLocation.accuracy}m`
                : 'Detect City (GPS)'}
            </span>
          </button>

          {/* District Selector Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => onSelectDistrict(e.target.value)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono focus:outline-none transition ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-slate-200 focus:border-cyan-500'
                  : 'bg-slate-100 border-slate-300 text-slate-800 focus:border-cyan-600'
              }`}
            >
              {activeCity.districts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Side: City KPI Badges & Report Fault Action */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 sm:gap-3">
          {/* Quick Metrics */}
          <div className="flex items-center gap-2 text-[11px] font-mono">
            {/* Active Faults */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                criticalCount > 0
                  ? isDark
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                    : 'bg-rose-50 border-rose-200 text-rose-700 font-semibold'
                  : isDark
                  ? 'bg-slate-800/40 border-slate-700 text-slate-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>
                <strong>{activeFaults.length}</strong> Faults ({criticalCount} Crit)
              </span>
            </div>

            {/* Congestion Index */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                activeCity.congestionIndex > 70
                  ? isDark
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                    : 'bg-amber-50 border-amber-200 text-amber-800 font-semibold'
                  : isDark
                  ? 'bg-slate-800/40 border-slate-700 text-slate-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>
                Congestion: <strong>{activeCity.congestionIndex}%</strong>
              </span>
            </div>

            {/* Nearby Alert Badge */}
            {nearbyFaults.length > 0 && (
              <div
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border animate-pulse ${
                  isDark
                    ? 'bg-indigo-950/60 border-indigo-500/40 text-cyan-300'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                }`}
              >
                <Radio className="w-3 h-3 text-cyan-500" />
                <span>{nearbyFaults.length} nearby &lt; 5km</span>
              </div>
            )}
          </div>

          {/* Report Fault Button */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-mono text-xs font-bold shadow-md shadow-rose-950/40 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Report Fault</span>
          </button>
        </div>
      </div>
    </div>
  );
};
