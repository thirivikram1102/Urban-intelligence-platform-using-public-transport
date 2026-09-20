import React, { useState } from 'react';
import { Bus, PotholeAlert, SystemMetrics, TabType, UserLocationDetails, CityFault } from '../types';
import {
  Bus as BusIcon,
  AlertTriangle,
  Activity,
  TrendingUp,
  MapPin,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Gauge,
  SlidersHorizontal,
  Flame,
  Zap,
  Leaf,
  Layers,
  ChevronRight,
  Wrench,
  Compass,
  Radio,
  Plus,
} from 'lucide-react';
import { CORRIDORS } from '../data/mockData';
import { LocationDetectionBanner } from './LocationDetectionBanner';

interface DashboardTabProps {
  metrics: SystemMetrics;
  buses: Bus[];
  potholes: PotholeAlert[];
  onNavigateTab: (tab: TabType) => void;
  onSelectBus: (bus: Bus) => void;
  onDispatchPothole: (pothole: PotholeAlert) => void;
  onSimulateAlert: () => void;
  userLocation?: UserLocationDetails;
  onOpenLocationSelector?: () => void;
  onRequestGPSDetect?: () => void;
  isDetectingGPS?: boolean;
  cityFaults?: CityFault[];
  theme?: 'dark' | 'light';
  onOpenReportModal?: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  metrics,
  buses,
  potholes,
  onNavigateTab,
  onSelectBus,
  onDispatchPothole,
  onSimulateAlert,
  userLocation,
  onOpenLocationSelector,
  onRequestGPSDetect,
  isDetectingGPS = false,
  cityFaults = [],
  theme = 'light',
  onOpenReportModal,
}) => {
  const [fleetFilter, setFleetFilter] = useState<'ALL' | 'ON_TIME' | 'DELAYED' | 'EV'>('ALL');
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('c1');

  const isDark = theme === 'dark';

  // Filtered bus list
  const filteredBuses = buses.filter((bus) => {
    if (fleetFilter === 'ON_TIME') return bus.status === 'on-time';
    if (fleetFilter === 'DELAYED') return bus.status === 'delayed' || bus.status === 'congestion';
    if (fleetFilter === 'EV') return bus.isElectric;
    return true;
  });

  // Filter faults in current town/district
  const currentTown = userLocation?.town || 'Srirangam';
  const currentDistrict = userLocation?.district || 'Tiruchirappalli';

  const nearbyLocationFaults = cityFaults.filter((f) => {
    if (f.status === 'RESOLVED') return false;
    const matchTown =
      f.district?.toLowerCase().includes(currentTown.toLowerCase()) ||
      f.locationName?.toLowerCase().includes(currentTown.toLowerCase()) ||
      f.title?.toLowerCase().includes(currentTown.toLowerCase());
    const matchDistrict =
      f.cityName?.toLowerCase().includes(currentDistrict.toLowerCase()) ||
      f.district?.toLowerCase().includes(currentDistrict.toLowerCase());
    return matchTown || matchDistrict;
  });

  return (
    <div className="space-y-6">
      {/* 1. Location Detection Banner (Displays District & Town prominently) */}
      {userLocation && (
        <LocationDetectionBanner
          location={userLocation}
          onOpenSelector={onOpenLocationSelector || (() => {})}
          onRequestGPSDetect={onRequestGPSDetect || (() => {})}
          isDetectingGPS={isDetectingGPS}
          activeFaultsInLocation={nearbyLocationFaults}
          onViewFaults={() => onNavigateTab('faults')}
          theme={theme}
        />
      )}

      {/* Top Banner Alert Bar */}
      <div
        className={`border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border-indigo-500/30 shadow-xl'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isDark
                ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-400'
                : 'bg-indigo-50 border border-indigo-200 text-indigo-600'
            }`}
          >
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`font-mono font-bold text-base sm:text-lg ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Autonomous Urban Transit & Road Condition Network
              </h2>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                AI Edge Core Online
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Telemetry stream from public transit sensors, dual-camera YOLOv8 vision feeds, and IMU road impact nodes across {currentDistrict} & {currentTown}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={onSimulateAlert}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold font-mono transition shadow-sm active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            Simulate AI Defect
          </button>
          <button
            onClick={() => onNavigateTab('fleet-map')}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium font-mono border transition ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
            }`}
          >
            <span>Live Radar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Core KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Fleet */}
        <div
          onClick={() => onNavigateTab('fleet-map')}
          className={`border rounded-2xl p-4 cursor-pointer transition group ${
            isDark
              ? 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/40 shadow-xl'
              : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-mono uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500 font-semibold'
              }`}
            >
              Active Fleet Telemetry
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition">
              <BusIcon className="w-4 h-4 text-cyan-600" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold font-mono ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {metrics.activeBuses}
            </span>
            <span className={`text-sm font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              / {metrics.totalBuses} Units
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {metrics.onTimeRatePercent}% On-Time
            </span>
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>4 Maintenance</span>
          </div>
          <div
            className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${
              isDark ? 'bg-slate-800' : 'bg-slate-100'
            }`}
          >
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full"
              style={{ width: `${(metrics.activeBuses / metrics.totalBuses) * 100}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Traffic Congestion Index */}
        <div
          className={`border rounded-2xl p-4 transition ${
            isDark
              ? 'bg-slate-900/90 border-slate-800 hover:border-amber-500/40 shadow-xl'
              : 'bg-white border-slate-200 hover:border-amber-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-mono uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500 font-semibold'
              }`}
            >
              Traffic Congestion Index
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-600">
              {metrics.trafficCongestionIndex}
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              / 100 Index
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-mono">
            <span className="text-amber-600 font-medium">Urban Corridor Flow</span>
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              Avg {metrics.avgNetworkSpeedKmh} km/h
            </span>
          </div>
          <div
            className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${
              isDark ? 'bg-slate-800' : 'bg-slate-100'
            }`}
          >
            <div
              className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full"
              style={{ width: `${metrics.trafficCongestionIndex}%` }}
            />
          </div>
        </div>

        {/* KPI 3: Pothole & Road Fault Alerts */}
        <div
          onClick={() => onNavigateTab('faults')}
          className={`border rounded-2xl p-4 cursor-pointer transition group ${
            isDark
              ? 'bg-slate-900/90 border-slate-800 hover:border-rose-500/40 shadow-xl'
              : 'bg-white border-slate-200 hover:border-rose-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-mono uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500 font-semibold'
              }`}
            >
              City Faults & Potholes
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center group-hover:scale-110 transition">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-rose-600">
              {metrics.potholesReportedToday}
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Reported Today
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" />
              {metrics.potholesDispatched} Dispatched
            </span>
            <span className="text-rose-600 font-bold">
              {potholes.filter((p) => p.status === 'DETECTED').length} Pending
            </span>
          </div>
          <div
            className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${
              isDark ? 'bg-slate-800' : 'bg-slate-100'
            }`}
          >
            <div
              className="bg-gradient-to-r from-rose-500 to-indigo-600 h-full rounded-full"
              style={{ width: `${(metrics.potholesDispatched / metrics.potholesReportedToday) * 100}%` }}
            />
          </div>
        </div>

        {/* KPI 4: Clean Transit & Carbon Abatement */}
        <div
          className={`border rounded-2xl p-4 transition ${
            isDark
              ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/40 shadow-xl'
              : 'bg-white border-slate-200 hover:border-emerald-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-mono uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500 font-semibold'
              }`}
            >
              CO2 Abated / Clean EV
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-emerald-600">
              {(metrics.carbonEmissionsSavedKg / 1000).toFixed(1)}T
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              CO2 Reduced
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-700 font-bold">50% Electric Fleet</span>
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>68.4k Riders</span>
          </div>
          <div
            className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${
              isDark ? 'bg-slate-800' : 'bg-slate-100'
            }`}
          >
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-3/5" />
          </div>
        </div>
      </div>

      {/* Dedicated Section: Location-Based Municipal Faults & Transport Disruptions */}
      <div
        className={`border rounded-2xl p-5 shadow-sm transition ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <h3
                className={`font-bold text-base tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Nearby Faults & Road Hazards in <span className="text-cyan-600">{currentTown}</span>,{' '}
                <span className="text-slate-700">{currentDistrict}</span>
              </h3>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Verified by computer vision AI sensors, commuter alerts, and municipal transit supervisors
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenReportModal && (
              <button
                onClick={onOpenReportModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-semibold text-xs shadow-sm transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Report Issue in {currentTown}</span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('faults')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition"
            >
              <span>View All Faults ({cityFaults.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Fault Cards Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {nearbyLocationFaults.slice(0, 3).map((fault) => (
            <div
              key={fault.id}
              onClick={() => onNavigateTab('faults')}
              className={`p-4 rounded-xl border transition cursor-pointer group flex flex-col justify-between ${
                isDark
                  ? 'bg-slate-950 border-slate-800 hover:border-cyan-500/50'
                  : 'bg-slate-50/70 border-slate-200 hover:border-cyan-400 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      fault.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : fault.severity === 'HIGH'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {fault.severity}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{fault.reportedAt}</span>
                </div>

                <h4
                  className={`font-bold text-xs leading-snug line-clamp-2 group-hover:text-cyan-700 transition ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {fault.title}
                </h4>

                <p className="text-[11px] text-slate-600 line-clamp-2 mt-1.5">{fault.description}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="truncate max-w-[150px]">📍 {fault.locationName}</span>
                <span className="font-semibold text-cyan-700">{fault.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Corridor Congestion Radar & AI Pothole Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Traffic Congestion Index & Corridors (7 cols) */}
        <div
          className={`lg:col-span-7 border rounded-2xl p-5 shadow-sm space-y-4 transition ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3
                className={`font-mono font-bold text-base flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <Gauge className="w-4 h-4 text-amber-500" />
                Corridor Congestion & Speed Analytics
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Real-time congestion calculation using bus dwell latency and GPS telemetry
              </p>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-mono ${
                isDark
                  ? 'bg-slate-950 border border-slate-700 text-slate-300'
                  : 'bg-slate-100 border border-slate-200 text-slate-700'
              }`}
            >
              Network Avg:{' '}
              <strong className="text-cyan-700">{metrics.avgNetworkSpeedKmh} km/h</strong>
            </span>
          </div>

          {/* Corridor Selection & Real-time Bars */}
          <div className="space-y-3">
            {CORRIDORS.map((corridor) => {
              const isHigh = corridor.congestion === 'high';
              const isMod = corridor.congestion === 'moderate';
              const pct = isHigh ? 82 : isMod ? 54 : 26;

              return (
                <div
                  key={corridor.id}
                  onClick={() => setSelectedCorridorId(corridor.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    selectedCorridorId === corridor.id
                      ? isDark
                        ? 'bg-slate-950 border-cyan-500/50 shadow-md'
                        : 'bg-cyan-50/70 border-cyan-300 shadow-sm'
                      : isDark
                      ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-mono font-bold truncate max-w-[280px] ${
                        isDark ? 'text-slate-200' : 'text-slate-900'
                      }`}
                    >
                      {corridor.name}
                    </span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        {corridor.avgSpeed} km/h avg
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isHigh
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : isMod
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {corridor.congestion}
                      </span>
                    </div>
                  </div>

                  {/* Congestion Index Meter */}
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className={`flex-1 h-2 rounded-full overflow-hidden ${
                        isDark ? 'bg-slate-800' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHigh ? 'bg-rose-500' : isMod ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-mono font-bold w-10 text-right ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live AI Pothole Detection Stream (5 cols) */}
        <div
          className={`lg:col-span-5 border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between transition ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <h3
                    className={`font-mono font-bold text-base ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Edge AI Pothole Feed
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    YOLOv8-UrbanRoad model detections
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('potholes')}
                className="text-xs text-cyan-600 hover:text-cyan-700 font-mono flex items-center gap-1 font-semibold"
              >
                <span>Full Vision Lab</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pothole Alerts Feed */}
            <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {potholes.slice(0, 3).map((pothole) => {
                const isCritical = pothole.severity === 'CRITICAL';
                return (
                  <div
                    key={pothole.id}
                    className={`p-3 border rounded-xl space-y-2.5 transition ${
                      isDark
                        ? 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold text-xs ${
                              isDark ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {pothole.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              isCritical
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {pothole.severity}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-600 font-semibold">
                            {pothole.confidenceScore}% conf
                          </span>
                        </div>
                        <p
                          className={`text-xs font-medium mt-1 ${
                            isDark ? 'text-slate-300' : 'text-slate-800'
                          }`}
                        >
                          {pothole.roadName}
                        </p>
                      </div>

                      {/* Small thumbnail */}
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-300 relative flex-shrink-0">
                        <img
                          src={pothole.imageUrl}
                          alt="Road anomaly"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-200/80">
                      <span>Depth: <strong className="text-slate-700">{pothole.depthEstimateCm} cm</strong></span>
                      <span>Sensor: {pothole.detectedByBusId.split(' ')[0]}</span>
                      <span className="text-indigo-600">{pothole.timestamp}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono uppercase text-slate-600">
                        Status: <strong className="text-cyan-700">{pothole.status}</strong>
                      </span>

                      {pothole.status === 'DETECTED' ? (
                        <button
                          onClick={() => onDispatchPothole(pothole)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 text-xs font-mono font-semibold transition"
                        >
                          Dispatch Crew
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">
                          Assigned to Rapid Unit
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('potholes')}
            className={`w-full py-2.5 rounded-xl text-xs font-mono font-semibold transition text-center mt-2 border ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
            }`}
          >
            Review All {potholes.length} Road Hazards
          </button>
        </div>
      </div>

      {/* Live Fleet Telemetry Log Table */}
      <div
        className={`border rounded-2xl p-5 shadow-sm space-y-4 transition ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3
              className={`font-mono font-bold text-base flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <BusIcon className="w-4 h-4 text-cyan-600" />
              Live Fleet Corridor Log
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Continuous IoT edge telemetry from transit buses across {currentDistrict} and operating sectors
            </p>
          </div>

          {/* Interactive Filters */}
          <div
            className={`flex items-center gap-1.5 border rounded-xl p-1 text-xs ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => setFleetFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-mono transition ${
                fleetFilter === 'ALL'
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({buses.length})
            </button>
            <button
              onClick={() => setFleetFilter('ON_TIME')}
              className={`px-2.5 py-1 rounded-lg font-mono transition ${
                fleetFilter === 'ON_TIME'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              On-Time
            </button>
            <button
              onClick={() => setFleetFilter('DELAYED')}
              className={`px-2.5 py-1 rounded-lg font-mono transition ${
                fleetFilter === 'DELAYED'
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Delayed
            </button>
            <button
              onClick={() => setFleetFilter('EV')}
              className={`px-2.5 py-1 rounded-lg font-mono transition ${
                fleetFilter === 'EV'
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EV Units
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr
                className={`border-b text-[11px] uppercase tracking-wider ${
                  isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}
              >
                <th className="py-2.5 px-3">Vehicle / Route</th>
                <th className="py-2.5 px-3">Corridor & Destination</th>
                <th className="py-2.5 px-3">Speed</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Passenger Load</th>
                <th className="py-2.5 px-3">Next Stop</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
              {filteredBuses.map((bus) => (
                <tr
                  key={bus.id}
                  className={`transition cursor-pointer group ${
                    isDark ? 'hover:bg-slate-950/80' : 'hover:bg-slate-50'
                  }`}
                  onClick={() => {
                    onSelectBus(bus);
                    onNavigateTab('fleet-map');
                  }}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded border flex items-center justify-center ${
                          isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                        }`}
                      >
                        <BusIcon className="w-3.5 h-3.5 text-cyan-600" />
                      </div>
                      <div>
                        <span
                          className={`font-bold text-xs group-hover:text-cyan-600 transition ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          Route {bus.routeNumber}
                        </span>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {bus.registrationNumber} {bus.isElectric && '⚡ EV'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <p
                      className={`text-xs font-sans font-medium truncate max-w-[200px] ${
                        isDark ? 'text-slate-300' : 'text-slate-800'
                      }`}
                    >
                      {bus.routeName}
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {bus.corridor}
                    </span>
                  </td>

                  <td
                    className={`py-3 px-3 font-bold ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {bus.speedKmh} km/h
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        bus.status === 'on-time'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : bus.status === 'congestion'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {bus.status}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-16 h-1.5 rounded-full overflow-hidden ${
                          isDark ? 'bg-slate-800' : 'bg-slate-200'
                        }`}
                      >
                        <div
                          className={`h-full rounded-full ${
                            bus.occupancyPercent > 85 ? 'bg-rose-500' : 'bg-cyan-600'
                          }`}
                          style={{ width: `${bus.occupancyPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {bus.currentOccupancy}/{bus.capacity}
                      </span>
                    </div>
                  </td>

                  <td
                    className={`py-3 px-3 truncate max-w-[150px] ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {bus.nextStop}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBus(bus);
                        onNavigateTab('fleet-map');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-[11px] font-semibold border border-cyan-200 transition"
                    >
                      Inspect Radar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

