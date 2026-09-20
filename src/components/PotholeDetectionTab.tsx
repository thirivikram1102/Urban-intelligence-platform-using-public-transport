import React, { useState, useEffect } from 'react';
import { PotholeAlert, PotholeSeverity } from '../types';
import {
  AlertTriangle,
  Camera,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Wrench,
  Search,
  Filter,
  ShieldCheck,
  Cpu,
  Eye,
  Sliders,
  AlertOctagon,
  TrendingDown,
} from 'lucide-react';

interface PotholeDetectionTabProps {
  potholes: PotholeAlert[];
  onDispatchPothole: (pothole: PotholeAlert) => void;
  onSimulateNewPothole: () => void;
  theme?: 'dark' | 'light';
}

export const PotholeDetectionTab: React.FC<PotholeDetectionTabProps> = ({
  potholes,
  onDispatchPothole,
  onSimulateNewPothole,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCamIndex, setActiveCamIndex] = useState<number>(0);
  const [scanPulse, setScanPulse] = useState<number>(0);

  // Simulated live scanner pulse effect
  useEffect(() => {
    const timer = setInterval(() => {
      setScanPulse((prev) => (prev + 1) % 100);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  const filteredPotholes = potholes.filter((p) => {
    if (severityFilter !== 'ALL' && p.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.id.toLowerCase().includes(q) ||
        p.roadName.toLowerCase().includes(q) ||
        p.corridor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedForCam = potholes[activeCamIndex] || potholes[0];

  return (
    <div className="space-y-6">
      {/* Top Banner / Edge AI Pipeline Header */}
      <div
        className={`rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors border ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 backdrop-blur-sm'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${
              isDark
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-rose-50 border-rose-200 text-rose-600'
            }`}
          >
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`font-mono font-bold text-base sm:text-lg ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Mobile Edge AI: Autonomous Road Defect Vision Lab
              </h2>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                  isDark
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
                }`}
              >
                YOLOv8-UrbanRoad-v2.1
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Dual sensor fusion: Dashcam high-res optical flow + 6-Axis bus chassis accelerometer (4.2G shock validation).
            </p>
          </div>
        </div>

        <button
          onClick={onSimulateNewPothole}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold font-mono transition shadow-lg shadow-rose-600/30 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          Simulate Camera Defect Spike
        </button>
      </div>

      {/* Main Grid: Live Camera HUD Feed & Sensor Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Camera Feed Simulator (7 cols) */}
        <div
          className={`lg:col-span-7 rounded-2xl overflow-hidden shadow-2xl flex flex-col border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-200 shadow-md'
          }`}
        >
          {/* Header of feed */}
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-white font-bold">
                BUS CAM FEED: {selectedForCam?.detectedByBusId || 'Bus Unit KA-01-F-4421'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              <span>FPS: <strong className="text-emerald-400">28.4</strong></span>
              <span>RES: <strong>1080p@60Hz</strong></span>
              <span className="text-cyan-400">TensorRT Engine</span>
            </div>
          </div>

          {/* Video / Snapshot Viewport with Animated Bounding Box Overlays */}
          <div className="relative aspect-video w-full bg-slate-900 overflow-hidden flex items-center justify-center">
            {selectedForCam ? (
              <img
                src={selectedForCam.imageUrl}
                alt="Dashcam Road Surface"
                className="w-full h-full object-cover filter contrast-125"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-slate-500 font-mono text-xs">No active video stream</div>
            )}

            {/* Dark Vignette and Futuristic HUD Scanner Grid */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

            {/* Horizontal Scanning Laser Bar */}
            <div
              className="absolute left-0 right-0 h-0.5 bg-cyan-400/80 shadow-[0_0_12px_#22d3ee] pointer-events-none"
              style={{ top: `${scanPulse}%` }}
            />

            {/* Computer Vision Bounding Box Overlay */}
            {selectedForCam && (
              <div className="absolute inset-x-1/4 top-1/3 bottom-1/4 border-2 border-rose-500 bg-rose-500/10 rounded-lg shadow-[0_0_15px_rgba(244,63,94,0.4)] pointer-events-none p-2 flex flex-col justify-between">
                {/* Bounding box top tag */}
                <div className="self-start -mt-5 -ml-1 bg-rose-600 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow flex items-center gap-1.5 font-bold">
                  <span>POTHOLE: {selectedForCam.confidenceScore}%</span>
                  <span className="bg-rose-950/60 px-1 rounded">DEPTH: {selectedForCam.depthEstimateCm}cm</span>
                </div>

                {/* Sonar Depth Profiler Overlay */}
                <div className="self-end bg-slate-950/90 border border-rose-500/50 rounded p-1.5 text-[9px] font-mono text-slate-200">
                  <div className="text-rose-400 font-bold">SONAR PROFILE:</div>
                  <div>Area: ~{selectedForCam.estimatedAreaSqM} m²</div>
                  <div>Max Depth: {selectedForCam.depthEstimateCm} cm</div>
                </div>
              </div>
            )}

            {/* Corner Crosshair Accents */}
            <div className="absolute top-3 left-3 text-cyan-400 font-mono text-[10px] bg-slate-950/80 px-2 py-1 rounded border border-slate-700">
              ISO 400 // SHUTTER 1/1200 // F1.8
            </div>
            <div className="absolute bottom-3 left-3 text-emerald-400 font-mono text-[10px] bg-slate-950/80 px-2 py-1 rounded border border-slate-700">
              GPS: {selectedForCam?.coords.lat.toFixed(5)}°N, {selectedForCam?.coords.lng.toFixed(5)}°E
            </div>
            <div className="absolute bottom-3 right-3 text-amber-300 font-mono text-[10px] bg-slate-950/80 px-2 py-1 rounded border border-slate-700">
              SEVERITY: {selectedForCam?.severity}
            </div>
          </div>

          {/* Multi-Cam Selector Thumbnails */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap mr-1">
              Select Capture:
            </span>
            {potholes.map((pth, idx) => (
              <button
                key={pth.id}
                onClick={() => setActiveCamIndex(idx)}
                className={`relative flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border transition ${
                  activeCamIndex === idx
                    ? 'border-rose-500 ring-2 ring-rose-500/30'
                    : 'border-slate-700 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={pth.imageUrl}
                  alt={pth.id}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] font-mono text-center text-white truncate px-0.5">
                  {pth.id}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Accelerometer Sensor Fusion & Severity Breakdown (5 cols) */}
        <div
          className={`lg:col-span-5 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between transition-colors border ${
            isDark
              ? 'bg-slate-900/90 border-slate-800 backdrop-blur-sm'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}
            >
              <h3
                className={`font-mono font-bold text-base flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <Activity className="w-4 h-4 text-cyan-600" />
                Sensor Fusion Telemetry
              </h3>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                  isDark
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-emerald-800 bg-emerald-50 border-emerald-200 font-semibold'
                }`}
              >
                Verified Incident
              </span>
            </div>

            {/* Vibration Impact Readout */}
            <div className="mt-4 space-y-3">
              <div
                className={`p-3 rounded-xl space-y-2 border ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Chassis Z-Axis Shock</span>
                  <span className="text-rose-600 font-bold">4.24 G (Threshold: 2.5G)</span>
                </div>
                {/* Visual vibration sparkline simulator */}
                <div className="flex items-end gap-1 h-12 pt-2 px-1">
                  {[12, 14, 18, 15, 22, 18, 92, 100, 48, 24, 18, 14, 12, 16, 14, 12].map((val, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t transition-all ${
                        val > 60 ? 'bg-rose-500' : val > 30 ? 'bg-amber-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'
                      }`}
                      style={{ height: `${val}%` }}
                      title={`Spike: ${val}%`}
                    />
                  ))}
                </div>
                <p className="text-[10px] font-mono text-slate-500 text-center">
                  Impact vibration matches optical bounding box coordinates
                </p>
              </div>

              {/* Road Defect Specs */}
              {selectedForCam && (
                <div
                  className={`p-3 rounded-xl space-y-2 text-xs font-mono border ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Road Corridor</span>
                    <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{selectedForCam.corridor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Defect Location</span>
                    <span className={`truncate max-w-[180px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{selectedForCam.roadName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Estimated Depth</span>
                    <span className="text-rose-600 font-bold">{selectedForCam.depthEstimateCm} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Damaged Surface Area</span>
                    <span className="text-cyan-600 font-bold">{selectedForCam.estimatedAreaSqM} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Asphalt Patch Req.</span>
                    <span className="text-amber-600 font-bold">
                      {(selectedForCam.depthEstimateCm * selectedForCam.estimatedAreaSqM * 0.024).toFixed(2)} tons
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Dispatch Action Button */}
          {selectedForCam && (
            <div className="pt-2">
              {selectedForCam.status === 'DETECTED' ? (
                <button
                  onClick={() => onDispatchPothole(selectedForCam)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition active:scale-98"
                >
                  <Wrench className="w-4 h-4" />
                  Dispatch Municipal Repair Work Order
                </button>
              ) : (
                <div
                  className={`p-3 rounded-xl font-mono text-xs text-center flex items-center justify-center gap-2 border ${
                    isDark
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Work Order {selectedForCam.dispatchTicketId || 'WO-ACTIVE'} Assigned</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filterable Catalog of Road Defects */}
      <div
        className={`rounded-2xl p-5 shadow-xl space-y-4 transition-colors border ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 backdrop-blur-sm'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}
        >
          <div>
            <h3
              className={`font-mono font-bold text-base flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-rose-500" />
              Municipal Road Defect Registry
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Verified road anomalies detected by mobile public transport sensors
            </p>
          </div>

          {/* Filters & Search Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search road or ID..."
                className={`bg-transparent border-none outline-none font-mono text-xs w-28 sm:w-36 ${
                  isDark ? 'text-slate-200' : 'text-slate-900'
                }`}
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className={`rounded-lg px-2.5 py-1 text-xs font-mono border ${
                isDark
                  ? 'bg-slate-950 text-slate-200 border-slate-800'
                  : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`rounded-lg px-2.5 py-1 text-xs font-mono border ${
                isDark
                  ? 'bg-slate-950 text-slate-200 border-slate-800'
                  : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <option value="ALL">All Statuses</option>
              <option value="DETECTED">Pending Dispatch</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="REPAIRED">Repaired</option>
            </select>
          </div>
        </div>

        {/* Pothole Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPotholes.map((pothole) => {
            const isCritical = pothole.severity === 'CRITICAL';
            const isHigh = pothole.severity === 'HIGH';

            return (
              <div
                key={pothole.id}
                className={`rounded-xl p-4 space-y-3 transition flex flex-col justify-between border ${
                  isDark
                    ? 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
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
                          ? isDark
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isHigh
                          ? isDark
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                          : isDark
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}
                    >
                      {pothole.severity}
                    </span>
                  </div>

                  <div
                    className={`aspect-video rounded-lg overflow-hidden relative border ${
                      isDark ? 'border-slate-800' : 'border-slate-200'
                    }`}
                  >
                    <img
                      src={pothole.imageUrl}
                      alt={pothole.id}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400">
                      YOLOv8: {pothole.confidenceScore}%
                    </div>
                  </div>

                  <p
                    className={`text-xs font-semibold ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {pothole.roadName}
                  </p>

                  <div
                    className={`grid grid-cols-2 gap-1.5 text-[11px] font-mono pt-1 border-t ${
                      isDark
                        ? 'text-slate-400 border-slate-800/60'
                        : 'text-slate-600 border-slate-200'
                    }`}
                  >
                    <div>
                      Depth: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{pothole.depthEstimateCm} cm</strong>
                    </div>
                    <div>
                      Area: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{pothole.estimatedAreaSqM} m²</strong>
                    </div>
                    <div className="truncate col-span-2">
                      Reported by: <span className="text-cyan-600 font-medium">{pothole.detectedByBusId}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`pt-2 border-t flex items-center justify-between ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono uppercase font-semibold ${
                      pothole.status === 'DISPATCHED'
                        ? 'text-amber-600'
                        : pothole.status === 'REPAIRED'
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }`}
                  >
                    ● {pothole.status}
                  </span>

                  {pothole.status === 'DETECTED' ? (
                    <button
                      onClick={() => onDispatchPothole(pothole)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition border ${
                        isDark
                          ? 'bg-rose-600/30 hover:bg-rose-600/50 border-rose-500/50 text-rose-200'
                          : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                      }`}
                    >
                      Dispatch Crew
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-500 truncate max-w-[140px]">
                      {pothole.assignedTeam || 'Ticket Active'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
