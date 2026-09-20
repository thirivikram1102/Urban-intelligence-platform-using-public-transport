import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Compass,
  Search,
  Check,
  X,
  Navigation,
  Sparkles,
  Building2,
  ChevronRight,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import {
  INDIAN_LOCATIONS_DIRECTORY,
  StateInfo,
  DistrictInfo,
  TownInfo,
  reverseGeocodeCoordinates,
} from '../data/locationDirectory';
import { UserLocationDetails } from '../types';

interface DistrictTownSelectorModalProps {
  currentLocation: UserLocationDetails;
  onUpdateLocation: (location: UserLocationDetails) => void;
  onClose: () => void;
  onRequestGPSDetect: () => void;
  isDetectingGPS: boolean;
  theme: 'dark' | 'light';
}

export const DistrictTownSelectorModal: React.FC<DistrictTownSelectorModalProps> = ({
  currentLocation,
  onUpdateLocation,
  onClose,
  onRequestGPSDetect,
  isDetectingGPS,
  theme,
}) => {
  const [selectedStateName, setSelectedStateName] = useState<string>(
    currentLocation.state || 'Tamil Nadu'
  );
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>(
    currentLocation.district || 'Tiruchirappalli'
  );
  const [selectedTownName, setSelectedTownName] = useState<string>(
    currentLocation.town || 'Srirangam'
  );

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customDistrict, setCustomDistrict] = useState<string>('');
  const [customTown, setCustomTown] = useState<string>('');

  const isDark = theme === 'dark';

  // Selected State object
  const currentState = useMemo(() => {
    return (
      INDIAN_LOCATIONS_DIRECTORY.find((s) => s.name === selectedStateName) ||
      INDIAN_LOCATIONS_DIRECTORY[0]
    );
  }, [selectedStateName]);

  // Selected District object
  const currentDistrict = useMemo(() => {
    return (
      currentState.districts.find((d) => d.name === selectedDistrictName) ||
      currentState.districts[0]
    );
  }, [currentState, selectedDistrictName]);

  // Towns list for selected district
  const availableTowns = currentDistrict.towns;

  // Search results across all states/districts/towns
  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const matches: { state: string; district: string; town: TownInfo }[] = [];

    for (const state of INDIAN_LOCATIONS_DIRECTORY) {
      for (const dist of state.districts) {
        for (const town of dist.towns) {
          if (
            town.name.toLowerCase().includes(q) ||
            dist.name.toLowerCase().includes(q) ||
            state.name.toLowerCase().includes(q)
          ) {
            matches.push({ state: state.name, district: dist.name, town });
            if (matches.length >= 12) return matches;
          }
        }
      }
    }
    return matches;
  }, [searchQuery]);

  const handleSelectPredefinedTown = (
    stateName: string,
    districtName: string,
    town: TownInfo
  ) => {
    onUpdateLocation({
      state: stateName,
      district: districtName,
      town: town.name,
      locality: town.zone || town.taluk,
      coords: town.coords,
      accuracy: 10,
      source: 'manual_selection',
      formattedAddress: `${town.name}, ${districtName} District, ${stateName}`,
      detectedAt: 'Manual selection',
    });
    onClose();
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDistrict.trim() || !customTown.trim()) return;

    onUpdateLocation({
      state: selectedStateName,
      district: customDistrict.trim(),
      town: customTown.trim(),
      coords: currentDistrict.centerCoords,
      accuracy: 25,
      source: 'manual_selection',
      formattedAddress: `${customTown.trim()}, ${customDistrict.trim()}, ${selectedStateName}`,
      detectedAt: 'Custom entry',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600">
              <MapPin className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">
                Select Your District & Town
              </h3>
              <p className="text-xs text-slate-500">
                Filter local transit hazards, road faults, and civic services
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live GPS Quick Detect & Current Location Pill */}
        <div
          className={`px-5 py-3 border-b flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
            isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-cyan-50/50 border-cyan-100'
          }`}
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">Active Selection:</span>
            <span className="px-2 py-0.5 rounded-md font-bold text-cyan-700 bg-cyan-100/80 border border-cyan-300/60 font-mono">
              District: {currentLocation.district} | Town: {currentLocation.town}
            </span>
          </div>

          <button
            onClick={onRequestGPSDetect}
            disabled={isDetectingGPS}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition active:scale-95 disabled:opacity-60"
          >
            <Compass className={`w-3.5 h-3.5 ${isDetectingGPS ? 'animate-spin' : ''}`} />
            <span>{isDetectingGPS ? 'Acquiring GPS...' : 'Use Live GPS Auto-Detect'}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search town or district (e.g. Srirangam, Tiruchirappalli, Koramangala)..."
              className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Quick Preset Buttons (including the requested example) */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Popular Smart City Hubs (1-Click Switch)
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const tn = INDIAN_LOCATIONS_DIRECTORY.find((s) => s.name === 'Tamil Nadu')!;
                  const tryDist = tn.districts.find((d) => d.name === 'Tiruchirappalli')!;
                  const srirangam = tryDist.towns.find((t) => t.name === 'Srirangam')!;
                  handleSelectPredefinedTown('Tamil Nadu', 'Tiruchirappalli', srirangam);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                  currentLocation.district === 'Tiruchirappalli' &&
                  currentLocation.town === 'Srirangam'
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                <span>District: Tiruchirappalli | Town: Srirangam</span>
              </button>

              <button
                onClick={() => {
                  const tn = INDIAN_LOCATIONS_DIRECTORY.find((s) => s.name === 'Tamil Nadu')!;
                  const tryDist = tn.districts.find((d) => d.name === 'Tiruchirappalli')!;
                  const thillai = tryDist.towns.find((t) => t.name === 'Thillai Nagar')!;
                  handleSelectPredefinedTown('Tamil Nadu', 'Tiruchirappalli', thillai);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 text-xs font-semibold transition"
              >
                <span>Tiruchirappalli • Thillai Nagar</span>
              </button>

              <button
                onClick={() => {
                  const ka = INDIAN_LOCATIONS_DIRECTORY.find((s) => s.name === 'Karnataka')!;
                  const blr = ka.districts.find((d) => d.name === 'Bengaluru Urban')!;
                  const kora = blr.towns.find((t) => t.name === 'Koramangala')!;
                  handleSelectPredefinedTown('Karnataka', 'Bengaluru Urban', kora);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 text-xs font-semibold transition"
              >
                <span>Bengaluru • Koramangala</span>
              </button>
            </div>
          </div>

          {/* If search query has results */}
          {searchQuery.trim() ? (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Matching Locations ({filteredSearchResults.length})
              </span>
              {filteredSearchResults.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No towns or districts found matching "{searchQuery}". You can enter custom details below.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredSearchResults.map((res, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        handleSelectPredefinedTown(res.state, res.district, res.town)
                      }
                      className="p-3 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 text-left transition flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-bold text-xs text-slate-900 group-hover:text-cyan-700">
                          {res.town.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          District: {res.district} • {res.state}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Cascading State -> District -> Town Selectors */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* State Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State:
                  </label>
                  <select
                    value={selectedStateName}
                    onChange={(e) => {
                      setSelectedStateName(e.target.value);
                      const st = INDIAN_LOCATIONS_DIRECTORY.find(
                        (s) => s.name === e.target.value
                      );
                      if (st && st.districts.length > 0) {
                        setSelectedDistrictName(st.districts[0].name);
                      }
                    }}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  >
                    {INDIAN_LOCATIONS_DIRECTORY.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    District:
                  </label>
                  <select
                    value={selectedDistrictName}
                    onChange={(e) => setSelectedDistrictName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  >
                    {currentState.districts.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Towns Grid */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Town / Taluk / Locality in{' '}
                  <span className="text-cyan-700 font-bold">{selectedDistrictName}</span>:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableTowns.map((town) => {
                    const isSelected =
                      currentLocation.district === selectedDistrictName &&
                      currentLocation.town === town.name;

                    return (
                      <button
                        key={town.name}
                        onClick={() =>
                          handleSelectPredefinedTown(
                            selectedStateName,
                            selectedDistrictName,
                            town
                          )
                        }
                        className={`p-2.5 rounded-xl border text-left text-xs transition relative flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-600 text-white border-cyan-600 font-bold shadow-sm'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="truncate">
                          <p className="truncate font-semibold">{town.name}</p>
                          {town.zone && (
                            <p
                              className={`text-[10px] truncate ${
                                isSelected ? 'text-cyan-100' : 'text-slate-400'
                              }`}
                            >
                              {town.zone}
                            </p>
                          )}
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Custom Manual Entry Option */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
            >
              <span>{isCustomMode ? '− Hide Custom Entry' : '+ Enter Custom District & Town'}</span>
            </button>

            {isCustomMode && (
              <form onSubmit={handleSaveCustom} className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Custom District Name:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tiruchirappalli"
                      value={customDistrict}
                      onChange={(e) => setCustomDistrict(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Custom Town Name:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Srirangam"
                      value={customTown}
                      onChange={(e) => setCustomTown(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs transition"
                  >
                    Apply Custom Location
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-5 py-3 border-t flex items-center justify-between ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="text-[11px] text-slate-500">
            Coordinates: {currentLocation.coords.lat.toFixed(4)}°N, {currentLocation.coords.lng.toFixed(4)}°E
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
