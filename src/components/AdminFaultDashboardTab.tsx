import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  ShieldAlert,
  Car,
  Bus,
  Lightbulb,
  CloudRain,
  Construction,
  Layers,
  ChevronDown,
  Edit3,
  Send,
  Building2,
  Users,
  Sparkles,
  BarChart3,
  MapPin,
  Flame,
  ArrowUpRight,
} from 'lucide-react';
import {
  CityData,
  CityFault,
  FaultCategory,
  FaultSeverity,
  FaultStatus,
} from '../types';
import { SUPPORTED_CITIES } from '../data/faultData';

interface AdminFaultDashboardTabProps {
  activeCity: CityData;
  cityFaults: CityFault[];
  onUpdateFaultStatus: (
    faultId: string,
    newStatus: FaultStatus,
    assignedTeam?: string,
    notes?: string
  ) => void;
  onSimulateUrgentHazard: () => void;
  initialSelectedFaultId?: string;
  theme: 'dark' | 'light';
}

const CATEGORY_NAMES: Record<FaultCategory, string> = {
  traffic_blockage: 'Traffic Blockage',
  transit_breakdown: 'Bus Breakdown',
  pothole: 'Pothole & Surface',
  signal_failure: 'Signal Failure',
  waterlogging: 'Waterlogging',
  road_damage: 'Road Damage',
  debris_hazard: 'Debris Hazard',
};

const TEAMS_LIST = [
  'BBMP Major Roads Rapid Pothole Squad',
  'City Traffic Police Heavy Tow Unit Bravo',
  'Metropolitan Transit EV Mobile Workshop',
  'BESCOM Urban Signals & Power Division',
  'BWSSB Stormwater Drainage Brigade',
  'Disaster Management Quick Clear Sq. 04',
  'MMRDA Express Corridor Engineering',
  'GMDA Stormwater Suction Units 1 & 4',
];

export const AdminFaultDashboardTab: React.FC<AdminFaultDashboardTabProps> = ({
  activeCity,
  cityFaults,
  onUpdateFaultStatus,
  onSimulateUrgentHazard,
  initialSelectedFaultId,
  theme,
}) => {
  const [cityFilter, setCityFilter] = useState<string>(activeCity.id);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active fault being edited
  const [editingFault, setEditingFault] = useState<CityFault | null>(() => {
    if (initialSelectedFaultId) {
      return cityFaults.find((f) => f.id === initialSelectedFaultId) || null;
    }
    return null;
  });

  const [editStatus, setEditStatus] = useState<FaultStatus>('INVESTIGATING');
  const [editAssignedTeam, setEditAssignedTeam] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  const isDark = theme === 'dark';

  // Filtered faults across city or all
  const filteredFaults = cityFaults.filter((fault) => {
    if (cityFilter !== 'all' && fault.cityId !== cityFilter) return false;
    if (statusFilter !== 'all' && fault.status !== statusFilter) return false;
    if (severityFilter !== 'all' && fault.severity !== severityFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = fault.title.toLowerCase().includes(q);
      const matchId = fault.id.toLowerCase().includes(q);
      const matchLoc = fault.locationName.toLowerCase().includes(q);
      const matchDept = fault.aiAnalysis.recommendedDepartment.toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchLoc && !matchDept) return false;
    }

    return true;
  });

  // Calculate Metrics
  const totalFaults = cityFaults.length;
  const criticalCount = cityFaults.filter((f) => f.severity === 'CRITICAL' && f.status !== 'RESOLVED').length;
  const inProgressCount = cityFaults.filter((f) => f.status === 'IN_PROGRESS' || f.status === 'INVESTIGATING').length;
  const resolvedCount = cityFaults.filter((f) => f.status === 'RESOLVED').length;
  const resolutionRate = totalFaults > 0 ? Math.round((resolvedCount / totalFaults) * 100) : 100;

  const handleStartEdit = (fault: CityFault) => {
    setEditingFault(fault);
    setEditStatus(fault.status);
    setEditAssignedTeam(fault.assignedTeam || fault.aiAnalysis.recommendedDepartment);
    setEditNotes(fault.resolutionNotes || '');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFault) return;

    onUpdateFaultStatus(
      editingFault.id,
      editStatus,
      editAssignedTeam.trim() || undefined,
      editNotes.trim() || undefined
    );

    setEditingFault(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Simulation Trigger */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border transition-colors flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
          isDark
            ? 'bg-slate-900/80 border-slate-800 shadow-xl'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                isDark
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  : 'bg-cyan-50 text-cyan-700 border-cyan-200'
              }`}
            >
              Municipal Operations Hub
            </span>
            <span className="text-xs font-mono text-slate-500">
              City-Wide Smart Fault Administration
            </span>
          </div>
          <h2
            className={`text-xl sm:text-2xl font-bold font-mono tracking-tight flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            City Fault Command & Dispatch Portal
          </h2>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Monitor, triage, assign field maintenance units, and resolve urban road and transit failures
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onSimulateUrgentHazard}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-mono text-xs font-bold border transition active:scale-95 ${
              isDark
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulate Urgent Transit Hazard</span>
          </button>
        </div>
      </div>

      {/* Municipal KPI Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div
          className={`p-4 rounded-2xl border space-y-1 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[11px] font-mono text-slate-500 block">Total Reported Faults</span>
          <span className={`text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalFaults}</span>
          <span className="text-[10px] font-mono text-slate-400 block">Across 6 Smart Cities</span>
        </div>

        <div
          className={`p-4 rounded-2xl border space-y-1 ${
            isDark ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50 border-rose-200'
          }`}
        >
          <span className={`text-[11px] font-mono block ${isDark ? 'text-rose-300' : 'text-rose-700 font-semibold'}`}>Critical Emergencies</span>
          <span className="text-2xl font-bold font-mono text-rose-600">{criticalCount}</span>
          <span className={`text-[10px] font-mono block ${isDark ? 'text-rose-300/70' : 'text-rose-600/80'}`}>Immediate dispatch required</span>
        </div>

        <div
          className={`p-4 rounded-2xl border space-y-1 ${
            isDark ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'
          }`}
        >
          <span className={`text-[11px] font-mono block ${isDark ? 'text-cyan-300' : 'text-cyan-700 font-semibold'}`}>Active Work Orders</span>
          <span className="text-2xl font-bold font-mono text-cyan-600">{inProgressCount}</span>
          <span className={`text-[10px] font-mono block ${isDark ? 'text-cyan-300/70' : 'text-cyan-600/80'}`}>In progress with field teams</span>
        </div>

        <div
          className={`p-4 rounded-2xl border space-y-1 ${
            isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
          }`}
        >
          <span className={`text-[11px] font-mono block ${isDark ? 'text-emerald-300' : 'text-emerald-700 font-semibold'}`}>Resolved / Restored</span>
          <span className="text-2xl font-bold font-mono text-emerald-600">{resolvedCount}</span>
          <span className={`text-[10px] font-mono block ${isDark ? 'text-emerald-300/70' : 'text-emerald-600/80'}`}>Roadways cleared</span>
        </div>

        <div
          className={`p-4 rounded-2xl border space-y-1 col-span-2 sm:col-span-1 ${
            isDark ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'
          }`}
        >
          <span className={`text-[11px] font-mono block ${isDark ? 'text-indigo-300' : 'text-indigo-700 font-semibold'}`}>Municipal SLA Rate</span>
          <span className="text-2xl font-bold font-mono text-indigo-600">{resolutionRate}%</span>
          <span className={`text-[10px] font-mono block ${isDark ? 'text-indigo-300/70' : 'text-indigo-600/80'}`}>Avg. Resolution: 1.6 hrs</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`p-3.5 rounded-2xl border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        {/* City Filter */}
        <div>
          <label className="block text-[10px] font-mono text-slate-500 mb-1">Municipal Region</label>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className={`w-full px-3 py-1.5 rounded-xl border text-xs font-mono focus:outline-none ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500'
                : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-600'
            }`}
          >
            <option value="all">All Cities (Pan-India)</option>
            {SUPPORTED_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}, {c.state}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[10px] font-mono text-slate-500 mb-1">Work Order Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full px-3 py-1.5 rounded-xl border text-xs font-mono focus:outline-none ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500'
                : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-600'
            }`}
          >
            <option value="all">All Statuses</option>
            <option value="REPORTED">Reported (Pending Review)</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="IN_PROGRESS">In Progress (Field Dispatched)</option>
            <option value="RESOLVED">Resolved / Repaired</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <label className="block text-[10px] font-mono text-slate-500 mb-1">Severity Tier</label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className={`w-full px-3 py-1.5 rounded-xl border text-xs font-mono focus:outline-none ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500'
                : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-600'
            }`}
          >
            <option value="all">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Search Input */}
        <div>
          <label className="block text-[10px] font-mono text-slate-500 mb-1">Search Keywords</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Fault ID, road, team..."
              className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs font-mono focus:outline-none ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Main Table: City-Wide Fault Incident Matrix */}
      <div
        className={`rounded-3xl border overflow-hidden transition-colors ${
          isDark
            ? 'border-slate-800 bg-slate-900/80 shadow-xl'
            : 'border-slate-200 bg-white shadow-sm'
        }`}
      >
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <h3
              className={`font-mono font-bold text-sm ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Municipal Fault Ledger & Dispatch Registry
            </h3>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                isDark
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                  : 'bg-cyan-50 text-cyan-700 border-cyan-200 font-semibold'
              }`}
            >
              {filteredFaults.length} Active Records
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Click 'Update Status' to change investigation or resolution logs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead
              className={`border-b text-[11px] uppercase tracking-wider ${
                isDark
                  ? 'bg-slate-950/80 border-slate-800 text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <tr>
                <th className="p-3 pl-4">Incident ID & City</th>
                <th className="p-3">Problem & Category</th>
                <th className="p-3">Location & District</th>
                <th className="p-3">Severity & AI Score</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned Municipal Team</th>
                <th className="p-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDark ? 'divide-slate-800/60' : 'divide-slate-100'
              }`}
            >
              {filteredFaults.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No faults match the current filters.
                  </td>
                </tr>
              ) : (
                filteredFaults.map((fault) => {
                  const isCritical = fault.severity === 'CRITICAL';
                  const isResolved = fault.status === 'RESOLVED';

                  return (
                    <tr
                      key={fault.id}
                      className={`transition group ${
                        isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* ID & City */}
                      <td className="p-3 pl-4">
                        <span
                          className={`font-bold block ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {fault.id}
                        </span>
                        <span className="text-[10px] text-cyan-600 font-semibold">
                          {fault.cityName}
                        </span>
                      </td>

                      {/* Problem & Category */}
                      <td className="p-3 max-w-xs">
                        <p
                          className={`font-bold line-clamp-1 ${
                            isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}
                        >
                          {fault.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {CATEGORY_NAMES[fault.category]} • {fault.reportedAt}
                        </p>
                      </td>

                      {/* Location & District */}
                      <td className="p-3 max-w-xs">
                        <p
                          className={`line-clamp-1 ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
                          {fault.locationName}
                        </p>
                        <p className="text-[10px] text-slate-400">{fault.district}</p>
                      </td>

                      {/* Severity & AI Score */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              fault.severity === 'CRITICAL'
                                ? 'bg-rose-500/15 text-rose-600 border-rose-400/40'
                                : fault.severity === 'HIGH'
                                ? 'bg-amber-500/15 text-amber-600 border-amber-400/40'
                                : fault.severity === 'MEDIUM'
                                ? 'bg-yellow-500/15 text-yellow-600 border-yellow-400/40'
                                : 'bg-emerald-500/15 text-emerald-600 border-emerald-400/40'
                            }`}
                          >
                            {fault.severity}
                          </span>
                          <span className="text-[10px] text-cyan-600 font-bold">
                            {fault.priorityScore}/100
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            fault.status === 'REPORTED'
                              ? isDark
                                ? 'bg-slate-800 text-slate-300 border-slate-700'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                              : fault.status === 'INVESTIGATING'
                              ? 'bg-cyan-500/15 text-cyan-700 border-cyan-400/40'
                              : fault.status === 'IN_PROGRESS'
                              ? 'bg-amber-500/15 text-amber-700 border-amber-400/40'
                              : 'bg-emerald-500/15 text-emerald-700 border-emerald-400/40'
                          }`}
                        >
                          {fault.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Assigned Team */}
                      <td className="p-3 max-w-xs">
                        <span
                          className={`text-xs line-clamp-1 ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
                          {fault.assignedTeam || fault.aiAnalysis.recommendedDepartment}
                        </span>
                        {fault.resolutionNotes && (
                          <span className="text-[10px] text-emerald-600 line-clamp-1 font-semibold">
                            Note: {fault.resolutionNotes}
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-3 pr-4 text-right">
                        <button
                          onClick={() => handleStartEdit(fault)}
                          className={`px-2.5 py-1.5 rounded-lg border font-mono text-[11px] font-bold transition ${
                            isDark
                              ? 'bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border-cyan-500/40'
                              : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-300'
                          }`}
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {editingFault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div
            className={`border rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl space-y-0 transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {/* Header */}
            <div
              className={`p-4 sm:p-5 border-b flex items-center justify-between ${
                isDark
                  ? 'bg-gradient-to-r from-slate-950 to-slate-900 border-slate-800'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <span className="text-xs font-mono font-bold text-cyan-600">
                  Update Municipal Incident #{editingFault.id}
                </span>
                <h3
                  className={`font-mono font-bold text-base mt-0.5 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {editingFault.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingFault(null)}
                className={`p-1.5 rounded-lg transition ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveStatus} className="p-5 space-y-4 font-mono text-xs">
              <div>
                <label
                  className={`block font-semibold mb-1.5 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Update Fault Status:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['REPORTED', 'INVESTIGATING', 'IN_PROGRESS', 'RESOLVED'] as FaultStatus[]).map(
                    (st) => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setEditStatus(st)}
                        className={`p-2 rounded-xl border text-center font-bold transition ${
                          editStatus === st
                            ? st === 'RESOLVED'
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-600'
                              : st === 'IN_PROGRESS'
                              ? 'bg-amber-500/20 border-amber-400 text-amber-600'
                              : st === 'INVESTIGATING'
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-600'
                              : isDark
                              ? 'bg-slate-800 border-slate-600 text-slate-200'
                              : 'bg-slate-200 border-slate-400 text-slate-800'
                            : isDark
                            ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            : 'bg-slate-50 border-slate-300 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label
                  className={`block font-semibold mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Assign Municipal Maintenance Team / Contractor:
                </label>
                <input
                  type="text"
                  value={editAssignedTeam}
                  onChange={(e) => setEditAssignedTeam(e.target.value)}
                  placeholder="e.g. BBMP Major Roads Rapid Pothole Squad"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                  }`}
                />
                <div className="mt-1 flex flex-wrap gap-1">
                  {TEAMS_LIST.slice(0, 3).map((tm) => (
                    <button
                      type="button"
                      key={tm}
                      onClick={() => setEditAssignedTeam(tm)}
                      className={`px-1.5 py-0.5 rounded text-[10px] transition ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      + {tm.split(' ')[0]} {tm.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className={`block font-semibold mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Resolution Notes / Field Officer Report:
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Enter details: e.g. 'Defect cold-patched with 120kg asphalt binder. Traffic resumed on both lanes at 15:42.'"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                  }`}
                />
              </div>

              <div
                className={`pt-3 border-t flex items-center justify-end gap-2 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setEditingFault(null)}
                  className={`px-4 py-2 rounded-xl ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold shadow-md shadow-indigo-950/20"
                >
                  Commit Status Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
