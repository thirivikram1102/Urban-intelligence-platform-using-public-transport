import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  MapPin,
  Filter,
  Search,
  Clock,
  Sparkles,
  ShieldAlert,
  Car,
  Bus,
  Lightbulb,
  CloudRain,
  Construction,
  Layers,
  ChevronRight,
  ExternalLink,
  Plus,
  Compass,
  CheckCircle2,
  Wrench,
  Radio,
  Eye,
  Info,
} from 'lucide-react';
import {
  CityData,
  CityFault,
  FaultCategory,
  FaultSeverity,
  FaultStatus,
  UserLocationData,
} from '../types';
import { calculateDistanceKm } from '../data/faultData';

interface CityFaultsTabProps {
  activeCity: CityData;
  cityFaults: CityFault[];
  selectedDistrict: string;
  userLocation: UserLocationData | null;
  onOpenReportModal: () => void;
  onOpenAdminPortal: (faultId?: string) => void;
  onSelectFaultForDetail?: (fault: CityFault) => void;
  theme: 'dark' | 'light';
}

const CATEGORY_ICONS: Record<FaultCategory, React.ComponentType<{ className?: string }>> = {
  traffic_blockage: Car,
  transit_breakdown: Bus,
  pothole: AlertTriangle,
  signal_failure: Lightbulb,
  waterlogging: CloudRain,
  road_damage: ShieldAlert,
  debris_hazard: Construction,
};

const CATEGORY_NAMES: Record<FaultCategory, string> = {
  traffic_blockage: 'Traffic Blockage',
  transit_breakdown: 'Bus Breakdown',
  pothole: 'Pothole & Surface',
  signal_failure: 'Signal Failure',
  waterlogging: 'Waterlogging',
  road_damage: 'Road Damage',
  debris_hazard: 'Debris Hazard',
};

const SEVERITY_COLORS: Record<
  FaultSeverity,
  { bg: string; text: string; border: string; dot: string }
> = {
  CRITICAL: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    border: 'border-rose-500/50',
    dot: 'bg-rose-500',
  },
  HIGH: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/50',
    dot: 'bg-amber-500',
  },
  MEDIUM: {
    bg: 'bg-yellow-500/15',
    text: 'text-yellow-400',
    border: 'border-yellow-500/50',
    dot: 'bg-yellow-500',
  },
  LOW: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/50',
    dot: 'bg-emerald-500',
  },
};

const STATUS_BADGES: Record<
  FaultStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  REPORTED: {
    label: 'Reported',
    bg: 'bg-slate-500/15',
    text: 'text-slate-300',
    border: 'border-slate-500/40',
  },
  INVESTIGATING: {
    label: 'Investigating',
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-400',
    border: 'border-cyan-500/40',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
  },
  RESOLVED: {
    label: 'Resolved',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
  },
};

export const CityFaultsTab: React.FC<CityFaultsTabProps> = ({
  activeCity,
  cityFaults,
  selectedDistrict,
  userLocation,
  onOpenReportModal,
  onOpenAdminPortal,
  theme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [onlyNearby, setOnlyNearby] = useState(false);
  const [selectedFaultId, setSelectedFaultId] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState(1);

  const isDark = theme === 'dark';

  // Filter faults for active city & criteria
  const filteredFaults = useMemo(() => {
    return cityFaults
      .filter((fault) => {
        // City match
        if (fault.cityId !== activeCity.id) return false;

        // District match
        if (selectedDistrict !== 'All Districts' && fault.district !== selectedDistrict) {
          return false;
        }

        // Category match
        if (selectedCategory !== 'all' && fault.category !== selectedCategory) {
          return false;
        }

        // Severity match
        if (selectedSeverity !== 'all' && fault.severity !== selectedSeverity) {
          return false;
        }

        // Status match
        if (selectedStatus !== 'all' && fault.status !== selectedStatus) {
          return false;
        }

        // Search match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = fault.title.toLowerCase().includes(q);
          const matchLoc = fault.locationName.toLowerCase().includes(q);
          const matchDesc = fault.description.toLowerCase().includes(q);
          const matchRoute = fault.affectedBusRoutes?.some((r) => r.toLowerCase().includes(q));
          if (!matchTitle && !matchLoc && !matchDesc && !matchRoute) return false;
        }

        // Proximity filter (< 5km)
        if (onlyNearby && userLocation) {
          const dist = calculateDistanceKm(
            { lat: userLocation.latitude, lng: userLocation.longitude },
            fault.coords
          );
          if (dist > 5.0) return false;
        }

        return true;
      })
      .sort((a, b) => b.priorityScore - a.priorityScore); // Sort by AI Priority descending
  }, [
    cityFaults,
    activeCity,
    selectedDistrict,
    selectedCategory,
    selectedSeverity,
    selectedStatus,
    searchQuery,
    onlyNearby,
    userLocation,
  ]);

  const selectedFault = useMemo(() => {
    if (!selectedFaultId) return filteredFaults[0] || null;
    return cityFaults.find((f) => f.id === selectedFaultId) || filteredFaults[0] || null;
  }, [selectedFaultId, cityFaults, filteredFaults]);

  // Compute officer map position if in active city
  const officerMapCoords = useMemo(() => {
    if (!userLocation) return null;
    // Map GPS coords proportionally to 0-1000 SVG canvas relative to city center
    const dLat = userLocation.latitude - activeCity.centerCoords.lat;
    const dLng = userLocation.longitude - activeCity.centerCoords.lng;
    const x = Math.max(80, Math.min(920, 500 + dLng * 2500));
    const y = Math.max(80, Math.min(920, 500 - dLat * 2500));
    return { x, y };
  }, [userLocation, activeCity]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border transition-colors flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
          isDark
            ? 'bg-slate-900/80 border-slate-800 shadow-xl'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Live City GIS Ingest
            </span>
            <span className="text-xs font-mono text-slate-400">
              {activeCity.name} Municipal Domain
            </span>
          </div>
          <h2
            className={`text-xl sm:text-2xl font-bold font-mono tracking-tight flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Location-Based Smart City Fault Detection
          </h2>
          <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Detecting road blockages, bus breakdowns, transit delays, potholes, signal blackouts & drainage hazards
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenAdminPortal(selectedFault?.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs font-semibold border transition ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-cyan-600" />
            <span>Admin Work Order Hub</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-mono text-xs font-bold shadow-md shadow-rose-950/40 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className={`p-3.5 rounded-2xl border space-y-3 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roads, bus routes, or defects..."
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs font-mono transition focus:outline-none ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-600'
              }`}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full px-3 py-1.5 rounded-xl border text-xs font-mono focus:outline-none transition ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-cyan-500'
                  : 'bg-white border-slate-300 text-slate-800 focus:border-cyan-600'
              }`}
            >
              <option value="all">All Fault Categories</option>
              <option value="traffic_blockage">Traffic Congestion & Blockage</option>
              <option value="transit_breakdown">Bus Breakdown & Delays</option>
              <option value="pothole">Potholes & Damaged Roads</option>
              <option value="signal_failure">Traffic Signal Failure</option>
              <option value="waterlogging">Waterlogging & Flooding</option>
              <option value="road_damage">Severe Road Cave-In</option>
              <option value="debris_hazard">Debris & Obstructions</option>
            </select>
          </div>

          {/* Severity Dropdown */}
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className={`w-full px-3 py-1.5 rounded-xl border text-xs font-mono focus:outline-none transition ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-cyan-500'
                  : 'bg-white border-slate-300 text-slate-800 focus:border-cyan-600'
              }`}
            >
              <option value="all">All Severities</option>
              <option value="CRITICAL">Critical Priority (Immediate)</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full px-3 py-1.5 rounded-xl border text-xs font-mono focus:outline-none transition ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-cyan-500'
                  : 'bg-white border-slate-300 text-slate-800 focus:border-cyan-600'
              }`}
            >
              <option value="all">All Statuses</option>
              <option value="REPORTED">Reported / Unassigned</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="IN_PROGRESS">In Progress / Dispatched</option>
              <option value="RESOLVED">Resolved / Repaired</option>
            </select>
          </div>
        </div>

        {/* Sub-row: Proximity Filter and Results count */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/40 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              Showing <strong className="text-cyan-400">{filteredFaults.length}</strong> incidents in{' '}
              {selectedDistrict === 'All Districts' ? activeCity.name : selectedDistrict}
            </span>

            {userLocation && (
              <label className="flex items-center gap-1.5 text-cyan-300 cursor-pointer text-[11px] bg-cyan-950/40 px-2 py-0.5 rounded-lg border border-cyan-800/60">
                <input
                  type="checkbox"
                  checked={onlyNearby}
                  onChange={(e) => setOnlyNearby(e.target.checked)}
                  className="accent-cyan-500 rounded"
                />
                <span>Only within 5 km of my GPS</span>
              </label>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>AI Sorting: Prioritized by commuter friction score</span>
          </div>
        </div>
      </div>

      {/* Main Workspace: Interactive City GIS Map & Split Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Interactive City GIS Fault Radar Map */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div
            className={`rounded-3xl border overflow-hidden relative shadow-xl flex flex-col ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-300'
            }`}
          >
            {/* Map Header Overlay */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
              <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 pointer-events-auto shadow-md">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-white">
                  {activeCity.name} GIS Fault Radar
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  ({filteredFaults.length} Active Pins)
                </span>
              </div>

              <div className="bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 flex items-center gap-1 pointer-events-auto">
                <button
                  onClick={() => setMapZoom((z) => Math.min(1.4, z + 0.1))}
                  className="px-2 py-0.5 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => setMapZoom(1)}
                  className="px-2 py-0.5 text-[10px] font-mono text-slate-400 hover:text-white rounded"
                >
                  {Math.round(mapZoom * 100)}%
                </button>
                <button
                  onClick={() => setMapZoom((z) => Math.max(0.7, z - 0.1))}
                  className="px-2 py-0.5 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 rounded"
                >
                  -
                </button>
              </div>
            </div>

            {/* SVG GIS Map Canvas */}
            <div className="w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-950 relative overflow-hidden flex items-center justify-center">
              <svg
                viewBox="0 0 1000 800"
                className="w-full h-full select-none cursor-grab active:cursor-grabbing transition-transform duration-300"
                style={{ transform: `scale(${mapZoom})` }}
              >
                <defs>
                  {/* Subtle City Road Grids */}
                  <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="rgba(51, 65, 85, 0.25)"
                      strokeWidth="0.8"
                    />
                  </pattern>

                  {/* Radial glow for critical faults */}
                  <radialGradient id="critGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <rect width="1000" height="800" fill="#030712" />
                <rect width="1000" height="800" fill="url(#cityGrid)" />

                {/* Simulated City Arterials and Transit Corridors */}
                <g stroke="#1e293b" strokeWidth="8" strokeLinecap="round" opacity="0.8">
                  {/* Outer Ring Expressway */}
                  <path
                    d="M 120 400 Q 250 150 500 120 T 880 320 T 780 720 T 420 740 Z"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="10"
                  />
                  {/* Central Arterial Highway */}
                  <line x1="100" y1="400" x2="900" y2="400" stroke="#334155" strokeWidth="6" />
                  <line x1="500" y1="100" x2="500" y2="750" stroke="#334155" strokeWidth="6" />
                  {/* Diagonal Flyover Corridors */}
                  <line x1="200" y1="200" x2="800" y2="650" stroke="#1e293b" strokeWidth="5" />
                  <line x1="200" y1="650" x2="800" y2="200" stroke="#1e293b" strokeWidth="5" />
                </g>

                {/* District Label Watermarks */}
                <g
                  fill="#475569"
                  fontFamily="monospace"
                  fontSize="12"
                  fontWeight="600"
                  opacity="0.4"
                  textAnchor="middle"
                >
                  <text x="500" y="380">
                    {activeCity.name.toUpperCase()} METROPOLITAN CORE
                  </text>
                  <text x="260" y="240">WEST ARTERIAL ZONE</text>
                  <text x="740" y="240">TECH PARK CORRIDOR</text>
                  <text x="500" y="700">SOUTH INDUSTRIAL GATEWAY</text>
                  <text x="480" y="160">NORTH EXPRESSWAY</text>
                </g>

                {/* Render Officer / User GPS Marker on SVG */}
                {officerMapCoords && (
                  <g transform={`translate(${officerMapCoords.x}, ${officerMapCoords.y})`}>
                    <circle r="36" fill="rgba(6, 182, 212, 0.15)">
                      <animate
                        attributeName="r"
                        values="18;45;18"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0;0.8"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="12" fill="#06b6d4" stroke="#ffffff" strokeWidth="2.5" />
                    <circle r="4" fill="#ffffff" />
                    <text
                      y="-18"
                      textAnchor="middle"
                      fill="#22d3ee"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      YOU (±{userLocation?.accuracy}m)
                    </text>
                  </g>
                )}

                {/* Render Fault Pins on Map */}
                {filteredFaults.map((fault) => {
                  const isSelected = selectedFault?.id === fault.id;
                  const isCritical = fault.severity === 'CRITICAL';
                  const isHigh = fault.severity === 'HIGH';
                  const point = fault.mapPoint || { x: 500, y: 400 };

                  let pinColor = '#10b981'; // LOW
                  if (isCritical) pinColor = '#f43f5e';
                  else if (isHigh) pinColor = '#f59e0b';
                  else if (fault.severity === 'MEDIUM') pinColor = '#eab308';

                  return (
                    <g
                      key={fault.id}
                      transform={`translate(${point.x}, ${point.y})`}
                      onClick={() => setSelectedFaultId(fault.id)}
                      className="cursor-pointer transition-transform hover:scale-125"
                    >
                      {/* Pulsing ring for critical/selected */}
                      {(isCritical || isSelected) && (
                        <circle
                          r={isSelected ? '28' : '22'}
                          fill="none"
                          stroke={pinColor}
                          strokeWidth="2"
                          opacity="0.8"
                        >
                          <animate
                            attributeName="r"
                            values="12;30;12"
                            dur={isCritical ? '1.5s' : '2.5s'}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.9;0;0.9"
                            dur={isCritical ? '1.5s' : '2.5s'}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Fault marker pin */}
                      <circle
                        r={isSelected ? '12' : '9'}
                        fill={pinColor}
                        stroke="#0f172a"
                        strokeWidth="2.5"
                      />
                      <circle r="3.5" fill="#ffffff" />

                      {/* Mini Label badge on hover or selected */}
                      {isSelected && (
                        <g transform="translate(0, -22)">
                          <rect
                            x="-70"
                            y="-18"
                            width="140"
                            height="20"
                            rx="5"
                            fill="#020617"
                            stroke={pinColor}
                            strokeWidth="1.2"
                          />
                          <text
                            x="0"
                            y="-4"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {fault.id} • {CATEGORY_NAMES[fault.category]}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Map Legend Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Critical Hazard
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  High Severity
                </span>
                <span className="flex items-center gap-1.5 text-yellow-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  Medium
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Low / Solved
                </span>
              </div>

              {userLocation && (
                <div className="flex items-center gap-1 text-cyan-400 text-[11px]">
                  <Compass className="w-3.5 h-3.5" />
                  <span>GPS Radar Tracking Active</span>
                </div>
              )}
            </div>
          </div>

          {/* Fault Incident Cards Grid (Bottom) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3
                className={`text-sm font-mono font-bold flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <span>Verified City Hazard Stream</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] ${
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700 font-semibold'
                  }`}
                >
                  {filteredFaults.length}
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredFaults.length === 0 ? (
                <div
                  className={`col-span-2 p-8 text-center rounded-2xl font-mono border ${
                    isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No active faults match current filters</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try adjusting the district, category, or search query.
                  </p>
                </div>
              ) : (
                filteredFaults.map((fault) => {
                  const isSelected = selectedFault?.id === fault.id;
                  const Icon = CATEGORY_ICONS[fault.category] || AlertTriangle;
                  const sevStyle = SEVERITY_COLORS[fault.severity];
                  const statStyle = STATUS_BADGES[fault.status];

                  // Distance from user
                  const distanceKm = userLocation
                    ? calculateDistanceKm(
                        { lat: userLocation.latitude, lng: userLocation.longitude },
                        fault.coords
                      )
                    : null;

                  return (
                    <div
                      key={fault.id}
                      onClick={() => setSelectedFaultId(fault.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? isDark
                            ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg'
                            : 'bg-cyan-50/70 border-cyan-500 ring-1 ring-cyan-500/50 shadow-md'
                          : isDark
                          ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${sevStyle.bg} ${sevStyle.text} ${sevStyle.border}`}
                            >
                              {fault.severity}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${statStyle.bg} ${statStyle.text} ${statStyle.border}`}
                            >
                              {statStyle.label}
                            </span>
                            {distanceKm !== null && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 border ${
                                  isDark
                                    ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                                    : 'bg-cyan-50 text-cyan-800 border-cyan-200 font-semibold'
                                }`}
                              >
                                <Radio className="w-2.5 h-2.5" />
                                {distanceKm} km away
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] font-mono text-cyan-600 font-bold">
                            Score: {fault.priorityScore}/100
                          </div>
                        </div>

                        {/* Title & Category */}
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`p-2 rounded-xl flex-shrink-0 mt-0.5 border ${
                              isDark
                                ? 'bg-slate-900 border-slate-800 text-slate-300'
                                : 'bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            <Icon className="w-4 h-4 text-cyan-600" />
                          </div>
                          <div>
                            <h4
                              className={`text-xs font-mono font-bold line-clamp-2 leading-snug ${
                                isDark ? 'text-white' : 'text-slate-900'
                              }`}
                            >
                              {fault.title}
                            </h4>
                            <p className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span className="truncate">{fault.locationName}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div
                        className={`pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
                          isDark ? 'border-slate-800/80 text-slate-500' : 'border-slate-100 text-slate-500'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {fault.reportedAt} by {fault.reportedBy.name}
                        </span>

                        <span className="text-cyan-600 hover:text-cyan-700 font-semibold flex items-center gap-0.5">
                          Inspect <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Detailed Fault Dossier & AI Triage */}
        <div className="lg:col-span-5">
          {selectedFault ? (
            <div
              className={`rounded-3xl border p-5 space-y-5 sticky top-24 transition-colors ${
                isDark ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              {/* Header */}
              <div
                className={`flex items-start justify-between gap-3 pb-4 border-b ${
                  isDark ? 'border-slate-800/80' : 'border-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-600">
                      {selectedFault.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        SEVERITY_COLORS[selectedFault.severity].bg
                      } ${SEVERITY_COLORS[selectedFault.severity].text} ${
                        SEVERITY_COLORS[selectedFault.severity].border
                      }`}
                    >
                      {selectedFault.severity} SEVERITY
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        STATUS_BADGES[selectedFault.status].bg
                      } ${STATUS_BADGES[selectedFault.status].text} ${
                        STATUS_BADGES[selectedFault.status].border
                      }`}
                    >
                      {STATUS_BADGES[selectedFault.status].label}
                    </span>
                  </div>
                  <h3
                    className={`text-sm font-mono font-bold leading-snug ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {selectedFault.title}
                  </h3>
                </div>
              </div>

              {/* Photo Evidence Thumbnail if present */}
              {selectedFault.imageUrl && (
                <div
                  className={`rounded-2xl overflow-hidden relative aspect-video group border ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  <img
                    src={selectedFault.imageUrl}
                    alt={selectedFault.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white">
                    <span className="bg-slate-950/80 px-2 py-0.5 rounded backdrop-blur-md">
                      Visual Evidence
                    </span>
                    <span className="text-slate-300">
                      GPS: {selectedFault.coords.lat.toFixed(4)}°, {selectedFault.coords.lng.toFixed(4)}°
                    </span>
                  </div>
                </div>
              )}

              {/* Description */}
              <div
                className={`p-3.5 rounded-2xl text-xs font-mono leading-relaxed border ${
                  isDark
                    ? 'bg-slate-950/70 border-slate-800 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Field Observations
                </span>
                {selectedFault.description}
              </div>

              {/* Location & District */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div
                  className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 block">District Zone</span>
                  <span className={`font-semibold truncate block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedFault.district}
                  </span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 block">Reported By</span>
                  <span className="text-cyan-600 font-semibold truncate block">
                    {selectedFault.reportedBy.name} ({selectedFault.reportedBy.role})
                  </span>
                </div>
              </div>

              {/* AI/ML Classification & Priority Card */}
              <div
                className={`p-4 rounded-2xl space-y-2.5 text-xs font-mono border ${
                  isDark
                    ? 'bg-indigo-950/40 border-indigo-500/30'
                    : 'bg-indigo-50/60 border-indigo-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-indigo-700 dark:text-cyan-300 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    <span>AI Model Triage Assessment</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded border ${
                      isDark
                        ? 'bg-indigo-900/60 text-cyan-300 border-indigo-700'
                        : 'bg-indigo-100 text-indigo-800 border-indigo-200 font-semibold'
                    }`}
                  >
                    {selectedFault.aiAnalysis.confidence}% Conf
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-slate-500 block text-[10px]">Priority Score</span>
                    <span className="text-sm font-bold text-rose-600">
                      {selectedFault.priorityScore} / 100
                    </span>
                  </div>
                  <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-slate-500 block text-[10px]">Est. Corridor Delay</span>
                    <span className="text-sm font-bold text-amber-600">
                      +{selectedFault.aiAnalysis.estimatedDelayMins} mins
                    </span>
                  </div>
                </div>

                <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <span className="text-slate-500 block text-[10px]">Automated Municipal Routing</span>
                  <span className={`font-semibold text-[11px] block mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedFault.aiAnalysis.recommendedDepartment}
                  </span>
                </div>

                {selectedFault.affectedBusRoutes && selectedFault.affectedBusRoutes.length > 0 && (
                  <div className={`p-2.5 rounded-lg flex items-center justify-between border ${isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-slate-500 text-[10px]">Impacted Transit Lines:</span>
                    <div className="flex items-center gap-1">
                      {selectedFault.affectedBusRoutes.map((rt) => (
                        <span
                          key={rt}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                            isDark
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                              : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                          }`}
                        >
                          Route {rt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => onOpenAdminPortal(selectedFault.id)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold shadow-md shadow-cyan-900/20 transition flex items-center justify-center gap-2"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Update Status / Work Order</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`p-12 text-center rounded-3xl border font-mono ${
                isDark ? 'border-slate-800 bg-slate-900/50 text-slate-500' : 'border-slate-200 bg-white text-slate-500 shadow-sm'
              }`}
            >
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-60" />
              <p>Select any hazard from the map or list to inspect the AI triage dossier.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
