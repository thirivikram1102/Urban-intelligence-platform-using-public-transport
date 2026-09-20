import React, { useState } from 'react';
import { Bus, BusStop, PotholeAlert, UserLocationData } from '../types';
import {
  Navigation,
  Bus as BusIcon,
  Gauge,
  Users,
  BatteryCharging,
  Fuel,
  MapPin,
  Eye,
  AlertTriangle,
  Compass,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  CheckCircle2,
  Radio,
  SlidersHorizontal,
  X,
  ShieldAlert,
} from 'lucide-react';
import { CORRIDORS } from '../data/mockData';

interface FleetMapTabProps {
  buses: Bus[];
  stops: BusStop[];
  potholes: PotholeAlert[];
  selectedBusId: string | null;
  onSelectBus: (bus: Bus | null) => void;
  simulationSpeed: number;
  onChangeSimSpeed: (speed: number) => void;
  isSimRunning: boolean;
  onToggleSim: () => void;
  onInspectPothole?: (pothole: PotholeAlert) => void;
  userLocation?: UserLocationData | null;
  theme?: 'dark' | 'light';
}

export const FleetMapTab: React.FC<FleetMapTabProps> = ({
  buses,
  stops,
  potholes,
  selectedBusId,
  onSelectBus,
  simulationSpeed,
  onChangeSimSpeed,
  isSimRunning,
  onToggleSim,
  onInspectPothole,
  userLocation,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  // Layer toggles
  const [showRoutes, setShowRoutes] = useState(true);
  const [showTrafficHeat, setShowTrafficHeat] = useState(true);
  const [showStops, setShowStops] = useState(true);
  const [showPotholes, setShowPotholes] = useState(true);
  const [routeFilter, setRouteFilter] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);

  // Filtered buses
  const filteredBuses = buses.filter((b) => {
    if (routeFilter === 'ALL') return true;
    return b.routeNumber === routeFilter;
  });

  const selectedBus = buses.find((b) => b.id === selectedBusId) || null;

  const distinctRoutes = Array.from(new Set(buses.map((b) => b.routeNumber)));

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div
        className={`rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 transition-colors border ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 backdrop-blur-sm'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Play/Pause & Speed */}
          <div
            className={`flex items-center rounded-xl p-1 border ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={onToggleSim}
              className={`p-1.5 rounded-lg transition ${
                isSimRunning
                  ? 'text-amber-500 hover:bg-slate-800/20'
                  : 'text-emerald-600 hover:bg-slate-800/20'
              }`}
              title={isSimRunning ? 'Pause simulation' : 'Resume simulation'}
            >
              {isSimRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <div className={`h-4 w-px mx-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSimSpeed(spd)}
                className={`px-2 py-0.5 text-xs font-mono rounded-lg transition ${
                  simulationSpeed === spd
                    ? isDark
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold'
                      : 'bg-cyan-600 text-white font-bold shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Route Filter Dropdown */}
          <div
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs border ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
              className={`bg-transparent border-none outline-none font-mono text-xs cursor-pointer ${
                isDark ? 'text-slate-200' : 'text-slate-800 font-medium'
              }`}
            >
              <option value="ALL" className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-900'}>
                All Routes ({buses.length} buses)
              </option>
              {distinctRoutes.map((rt) => (
                <option
                  key={rt}
                  value={rt}
                  className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-900'}
                >
                  Route {rt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Layer Toggles & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`flex items-center gap-1 rounded-xl p-1 text-xs border ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => setShowTrafficHeat(!showTrafficHeat)}
              className={`px-2 py-1 rounded-lg transition text-[11px] font-medium ${
                showTrafficHeat
                  ? isDark
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                  : isDark
                  ? 'text-slate-500 hover:text-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Traffic Density
            </button>

            <button
              onClick={() => setShowRoutes(!showRoutes)}
              className={`px-2 py-1 rounded-lg transition text-[11px] font-medium ${
                showRoutes
                  ? isDark
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-cyan-100 text-cyan-900 border border-cyan-300 font-semibold'
                  : isDark
                  ? 'text-slate-500 hover:text-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Corridors
            </button>

            <button
              onClick={() => setShowStops(!showStops)}
              className={`px-2 py-1 rounded-lg transition text-[11px] font-medium ${
                showStops
                  ? isDark
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-indigo-100 text-indigo-900 border border-indigo-300 font-semibold'
                  : isDark
                  ? 'text-slate-500 hover:text-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Transit Stops
            </button>

            <button
              onClick={() => setShowPotholes(!showPotholes)}
              className={`px-2 py-1 rounded-lg transition text-[11px] font-medium ${
                showPotholes
                  ? isDark
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-rose-100 text-rose-900 border border-rose-300 font-semibold'
                  : isDark
                  ? 'text-slate-500 hover:text-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pothole Hazards
            </button>
          </div>

          <div
            className={`flex items-center rounded-xl p-1 border ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
              className={`p-1 transition ${
                isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span
              className={`px-1 text-[10px] font-mono font-medium ${
                isDark ? 'text-slate-400' : 'text-slate-700'
              }`}
            >
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className={`p-1 transition ${
                isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className={`p-1 ml-1 border-l transition ${
                isDark
                  ? 'text-slate-400 hover:text-slate-200 border-slate-800'
                  : 'text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Container & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Vector SVG Radar Map Canvas (Cols 3) */}
        <div className="lg:col-span-3 bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col min-h-[580px]">
          {/* Radar HUD Overlay Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
            <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
              <div>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Metropolitan GIS Radar</p>
                <p className="text-xs font-mono font-bold text-cyan-300">
                  Bengaluru Smart Corridors // Zone 1 to 4
                </p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-300 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Tracking: {filteredBuses.length} Public Transport Units
            </div>
          </div>

          {/* Compass / Scale */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 pointer-events-none">
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>N 12°58' // E 77°35'</span>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-slate-900/85 border border-slate-800 rounded-lg p-2.5 text-[10px] font-mono backdrop-blur-md flex flex-wrap items-center gap-3 text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-500" />
              <span>EV Bus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500" />
              <span>CNG/Diesel</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-amber-400" />
              <span>Transit Stop</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Active Pothole</span>
            </div>
          </div>

          {/* SVG Map Render */}
          <div className="w-full flex-1 relative overflow-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center p-4">
            <div
              className="relative transition-transform duration-300 origin-center"
              style={{
                transform: `scale(${zoomLevel})`,
                width: '1000px',
                height: '920px',
              }}
            >
              <svg
                viewBox="0 0 1000 920"
                className="w-full h-full select-none"
                style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.8))' }}
              >
                <defs>
                  {/* Glowing line filters */}
                  <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glow-pothole" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="corridor-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/* City District Background Contours / Gridlines */}
                <rect x="0" y="0" width="1000" height="920" fill="#030712" />

                {/* Ambient Grid Accent Lines */}
                <path
                  d="M 100,0 L 100,920 M 300,0 L 300,920 M 500,0 L 500,920 M 700,0 L 700,920 M 900,0 L 900,920"
                  stroke="#1e293b"
                  strokeWidth="0.5"
                  strokeDasharray="4,8"
                />
                <path
                  d="M 0,150 L 1000,150 M 0,350 L 1000,350 M 0,550 L 1000,550 M 0,750 L 1000,750"
                  stroke="#1e293b"
                  strokeWidth="0.5"
                  strokeDasharray="4,8"
                />

                {/* City Zones / District Boundary Polygons */}
                <polygon
                  points="140,280 420,240 460,420 220,480"
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.6"
                />
                <text x="240" y="320" fill="#475569" fontSize="11" fontFamily="monospace">
                  ZONE 1: CENTRAL BUSINESS DIST
                </text>

                <polygon
                  points="460,260 880,210 900,420 540,460"
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.6"
                />
                <text x="680" y="270" fill="#475569" fontSize="11" fontFamily="monospace">
                  ZONE 2: EAST TECH CORRIDOR (ITPL)
                </text>

                <polygon
                  points="360,520 760,540 840,900 420,890"
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.6"
                />
                <text x="520" y="850" fill="#475569" fontSize="11" fontFamily="monospace">
                  ZONE 4: SOUTHERN ELECTRONICS HUB
                </text>

                {/* Corridor Roadways */}
                {showRoutes &&
                  CORRIDORS.map((corridor) => {
                    const isCongested = corridor.congestion === 'high';
                    const isMod = corridor.congestion === 'moderate';
                    const strokeColor = !showTrafficHeat
                      ? '#38bdf8'
                      : isCongested
                      ? '#f43f5e'
                      : isMod
                      ? '#fbbf24'
                      : '#10b981';

                    return (
                      <g key={corridor.id}>
                        {/* Outer glow aura */}
                        <polyline
                          points={corridor.points}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="12"
                          strokeOpacity={isCongested ? '0.2' : '0.12'}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Main road artery */}
                        <polyline
                          points={corridor.points}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="4"
                          strokeOpacity="0.85"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Road center dashline */}
                        <polyline
                          points={corridor.points}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="1"
                          strokeDasharray="6,8"
                          opacity="0.6"
                        />
                      </g>
                    );
                  })}

                {/* Bus Stops */}
                {showStops &&
                  stops.map((stop) => {
                    const isSelected = selectedStop?.id === stop.id;
                    return (
                      <g
                        key={stop.id}
                        className="cursor-pointer group"
                        onClick={() => setSelectedStop(stop)}
                      >
                        <circle
                          cx={stop.mapPoint.x}
                          cy={stop.mapPoint.y}
                          r={isSelected ? 10 : 6}
                          fill="#1e293b"
                          stroke="#f59e0b"
                          strokeWidth="2"
                        />
                        <circle
                          cx={stop.mapPoint.x}
                          cy={stop.mapPoint.y}
                          r={isSelected ? 5 : 3}
                          fill="#fbbf24"
                        />
                        {/* Stop label */}
                        <text
                          x={stop.mapPoint.x + 10}
                          y={stop.mapPoint.y - 8}
                          fill="#cbd5e1"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="600"
                          className="pointer-events-none drop-shadow-md"
                        >
                          {stop.name.split(' ')[0]} ({stop.code})
                        </text>
                      </g>
                    );
                  })}

                {/* AI Detected Pothole Pins on Map */}
                {showPotholes &&
                  potholes.map((pth) => {
                    const isCritical = pth.severity === 'CRITICAL';
                    return (
                      <g
                        key={pth.id}
                        className="cursor-pointer group"
                        onClick={() => onInspectPothole && onInspectPothole(pth)}
                      >
                        {/* Pulsing hazard radar ring */}
                        <circle
                          cx={pth.mapPoint.x}
                          cy={pth.mapPoint.y}
                          r={isCritical ? '14' : '10'}
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="1.5"
                          opacity="0.6"
                        >
                          <animate
                            attributeName="r"
                            values="8;20;8"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.8;0;0.8"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>

                        {/* Central hazard icon */}
                        <circle
                          cx={pth.mapPoint.x}
                          cy={pth.mapPoint.y}
                          r="6"
                          fill="#e11d48"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          filter="url(#glow-pothole)"
                        />
                        <text
                          x={pth.mapPoint.x + 8}
                          y={pth.mapPoint.y + 12}
                          fill="#fca5a5"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          ⚠ {pth.id} ({pth.depthEstimateCm}cm)
                        </text>
                      </g>
                    );
                  })}

                {/* Animated Buses */}
                {filteredBuses.map((bus) => {
                  const isSelected = selectedBusId === bus.id;
                  const isElectric = bus.isElectric;
                  const busFillColor = isElectric ? '#06b6d4' : '#3b82f6';

                  return (
                    <g
                      key={bus.id}
                      className="cursor-pointer group transition-all duration-300"
                      onClick={() => onSelectBus(bus)}
                    >
                      {/* Selection Radar Aura */}
                      {isSelected && (
                        <circle
                          cx={bus.mapX}
                          cy={bus.mapY}
                          r="22"
                          fill="none"
                          stroke="#22d3ee"
                          strokeWidth="2"
                          strokeDasharray="4,3"
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from={`0 ${bus.mapX} ${bus.mapY}`}
                            to={`360 ${bus.mapX} ${bus.mapY}`}
                            dur="6s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Direction Vector Arrow */}
                      <g transform={`rotate(${bus.headingDeg}, ${bus.mapX}, ${bus.mapY})`}>
                        <polygon
                          points={`${bus.mapX},${bus.mapY - 14} ${bus.mapX - 6},${bus.mapY + 6} ${bus.mapX + 6},${bus.mapY + 6}`}
                          fill={busFillColor}
                          opacity="0.8"
                        />
                      </g>

                      {/* Bus Base Disc */}
                      <circle
                        cx={bus.mapX}
                        cy={bus.mapY}
                        r={isSelected ? 10 : 8}
                        fill="#020617"
                        stroke={busFillColor}
                        strokeWidth="2.5"
                        filter="url(#glow-cyan)"
                      />

                      <circle
                        cx={bus.mapX}
                        cy={bus.mapY}
                        r={isSelected ? 5 : 4}
                        fill={busFillColor}
                      />

                      {/* Floating Route Tag */}
                      <g transform={`translate(${bus.mapX + 12}, ${bus.mapY - 8})`}>
                        <rect
                          x="0"
                          y="0"
                          width="68"
                          height="18"
                          rx="4"
                          fill="#0f172a"
                          stroke={isSelected ? '#22d3ee' : '#334155'}
                          strokeWidth="1"
                          opacity="0.95"
                        />
                        <text
                          x="6"
                          y="13"
                          fill="#f8fafc"
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {bus.routeNumber}
                        </text>
                        <text
                          x="42"
                          y="13"
                          fill={bus.status === 'congestion' ? '#f43f5e' : '#34d399'}
                          fontSize="9"
                          fontFamily="monospace"
                        >
                          {bus.speedKmh}k
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Officer Live GPS Pin (From Authentication Payload) */}
                {userLocation && (() => {
                  // Normalize coordinates to 0-1000 canvas space
                  const rawX = ((userLocation.longitude - 77.55) / 0.18) * 1000;
                  const rawY = (1 - (userLocation.latitude - 12.85) / 0.18) * 1000;
                  const officerX = Math.max(80, Math.min(920, isNaN(rawX) ? 480 : rawX));
                  const officerY = Math.max(80, Math.min(920, isNaN(rawY) ? 520 : rawY));

                  return (
                    <g className="cursor-pointer" key="officer-live-gps-pin">
                      {/* Pulse Wave Radar Auras */}
                      <circle
                        cx={officerX}
                        cy={officerY}
                        r="28"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="1.5"
                        strokeDasharray="4,2"
                        opacity="0.6"
                      >
                        <animate
                          attributeName="r"
                          from="12"
                          to="38"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.8"
                          to="0"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </circle>

                      {/* Accuracy radius approximation */}
                      <circle
                        cx={officerX}
                        cy={officerY}
                        r={Math.min(45, Math.max(16, userLocation.accuracy / 2))}
                        fill="#06b6d4"
                        fillOpacity="0.12"
                        stroke="#06b6d4"
                        strokeWidth="1"
                        strokeOpacity="0.4"
                      />

                      {/* Center Point */}
                      <circle
                        cx={officerX}
                        cy={officerY}
                        r="8"
                        fill="#0891b2"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx={officerX}
                        cy={officerY}
                        r="3"
                        fill="#ffffff"
                      />

                      {/* Badge Tag */}
                      <g transform={`translate(${officerX - 55}, ${officerY - 34})`}>
                        <rect
                          width="110"
                          height="20"
                          rx="5"
                          fill="#0f172a"
                          stroke="#06b6d4"
                          strokeWidth="1.5"
                        />
                        <text
                          x="55"
                          y="13"
                          fill="#22d3ee"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          YOU (GPS ±{userLocation.accuracy}m)
                        </text>
                      </g>
                    </g>
                  );
                })()}
              </svg>
            </div>
          </div>
        </div>

        {/* Telemetry Inspector Sidebar (Col 1) */}
        <div className="space-y-4">
          {selectedBus ? (
            /* Selected Bus Telemetry Card */
            <div
              className={`rounded-2xl p-4 shadow-xl relative overflow-hidden transition-colors border ${
                isDark
                  ? 'bg-slate-900 border-cyan-500/40 backdrop-blur-md'
                  : 'bg-white border-cyan-200'
              }`}
            >
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div
                className={`flex items-center justify-between pb-3 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                      isDark
                        ? 'bg-cyan-500/20 border-cyan-500/40'
                        : 'bg-cyan-50 border-cyan-200'
                    }`}
                  >
                    <BusIcon className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div>
                    <h3
                      className={`font-mono font-bold text-sm ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {selectedBus.registrationNumber}
                    </h3>
                    <p className="text-xs text-cyan-600 font-mono font-semibold">
                      Route {selectedBus.routeNumber}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectBus(null)}
                  className={`p-1 rounded transition ${
                    isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                  title="Close inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status & EV Badge */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-semibold uppercase ${
                    selectedBus.status === 'on-time'
                      ? isDark
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : selectedBus.status === 'congestion'
                      ? isDark
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                      : isDark
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  ● {selectedBus.status}
                </span>

                <span
                  className={`flex items-center gap-1 text-xs font-mono ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {selectedBus.isElectric ? (
                    <>
                      <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 font-bold">{selectedBus.batteryOrFuelPercent}% EV</span>
                    </>
                  ) : (
                    <>
                      <Fuel className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-amber-600 font-bold">{selectedBus.batteryOrFuelPercent}% CNG</span>
                    </>
                  )}
                </span>
              </div>

              {/* Speedometer & Live Telemetry Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div
                  className={`rounded-xl p-2.5 border ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                    <Gauge className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Current Speed</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span
                      className={`text-2xl font-mono font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {selectedBus.speedKmh}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">km/h</span>
                  </div>
                  <div
                    className={`w-full h-1 rounded-full mt-1.5 overflow-hidden ${
                      isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((selectedBus.speedKmh / 60) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div
                  className={`rounded-xl p-2.5 border ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Occupancy</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span
                      className={`text-2xl font-mono font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {selectedBus.currentOccupancy}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">/{selectedBus.capacity}</span>
                  </div>
                  <div
                    className={`w-full h-1 rounded-full mt-1.5 overflow-hidden ${
                      isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        selectedBus.occupancyPercent > 85 ? 'bg-rose-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${selectedBus.occupancyPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Route Trajectory & Next Stop */}
              <div className="mt-4 space-y-2 text-xs">
                <div
                  className={`rounded-xl p-2.5 border ${
                    isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Next Designated Stop</p>
                  <p
                    className={`font-semibold mt-0.5 flex items-center gap-1.5 ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span className="truncate">{selectedBus.nextStop}</span>
                  </p>
                </div>

                <div
                  className={`rounded-xl p-2.5 border ${
                    isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Final Destination</p>
                  <p
                    className={`font-medium mt-0.5 truncate ${
                      isDark ? 'text-slate-300' : 'text-slate-800'
                    }`}
                  >
                    {selectedBus.destination}
                  </p>
                </div>

                <div
                  className={`rounded-xl p-2.5 font-mono text-[11px] flex justify-between border ${
                    isDark
                      ? 'bg-slate-950/70 border-slate-800 text-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span>GPS Telemetry</span>
                  <span className="text-cyan-600 font-semibold">
                    {selectedBus.lat.toFixed(4)}°N, {selectedBus.lng.toFixed(4)}°E
                  </span>
                </div>

                <div
                  className={`rounded-xl p-2.5 font-mono text-[11px] flex justify-between border ${
                    isDark
                      ? 'bg-slate-950/70 border-slate-800 text-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span>Driver Pilot</span>
                  <span className={isDark ? 'text-slate-200' : 'text-slate-900 font-medium'}>
                    {selectedBus.driverName} (★{selectedBus.driverRating})
                  </span>
                </div>
              </div>

              {/* Emergency / Safety Actions */}
              <div
                className={`mt-4 pt-3 flex gap-2 border-t ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <button
                  onClick={() =>
                    alert(`Dispatched municipal telemetry ping to pilot ${selectedBus.driverName} on Route ${selectedBus.routeNumber}`)
                  }
                  className="flex-1 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold font-mono transition shadow-xs"
                >
                  Radio Driver
                </button>
                <button
                  onClick={() =>
                    alert(`Emergency slowdown beacon transmitted to Bus ${selectedBus.registrationNumber}`)
                  }
                  className={`px-3 py-2 rounded-lg transition border ${
                    isDark
                      ? 'bg-rose-600/20 hover:bg-rose-600/40 border-rose-500/40 text-rose-300'
                      : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                  }`}
                  title="Issue corridor safety alert"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Default Fleet Summary Drawer */
            <div
              className={`rounded-2xl p-4 shadow-xl text-xs space-y-4 border transition-colors ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div
                className={`flex items-center justify-between pb-2 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <h3
                  className={`font-mono font-bold text-sm flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <Navigation className="w-4 h-4 text-cyan-600" />
                  Corridor Fleet Index
                </h3>
                <span className="text-slate-500 font-mono text-[11px]">
                  {filteredBuses.length} online
                </span>
              </div>

              <p className="text-slate-500 text-xs leading-relaxed">
                Click on any moving bus marker on the map to inspect live engine telemetry, driver metrics, and occupancy.
              </p>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {filteredBuses.map((bus) => (
                  <div
                    key={bus.id}
                    onClick={() => onSelectBus(bus)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between group ${
                      isDark
                        ? 'bg-slate-950 border-slate-800/80 hover:border-cyan-500/50'
                        : 'bg-slate-50 border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-mono font-bold text-xs group-hover:text-cyan-600 transition ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          Route {bus.routeNumber}
                        </span>
                        {bus.isElectric && (
                          <span className="px-1 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono font-bold">
                            EV
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono truncate max-w-[140px]">
                        {bus.registrationNumber}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-mono font-bold text-xs ${
                          isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}
                      >
                        {bus.speedKmh} km/h
                      </p>
                      <span
                        className={`text-[10px] font-mono font-semibold ${
                          bus.status === 'on-time'
                            ? 'text-emerald-600'
                            : bus.status === 'congestion'
                            ? 'text-rose-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {bus.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Stop Details Popover */}
          {selectedStop && (
            <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 shadow-xl text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white font-mono">{selectedStop.name}</h4>
                  <p className="text-amber-400 text-[11px] font-mono">Terminal Code: {selectedStop.code}</p>
                </div>
                <button
                  onClick={() => setSelectedStop(null)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg font-mono">
                <span className="text-slate-400">Waiting Commuters</span>
                <span className="text-emerald-300 font-bold">{selectedStop.passengerWaitingCount} pax</span>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 uppercase font-mono mb-1">Serving Transit Routes</p>
                <div className="flex flex-wrap gap-1">
                  {selectedStop.routes.map((rt) => (
                    <span
                      key={rt}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-[10px] font-bold"
                    >
                      {rt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
