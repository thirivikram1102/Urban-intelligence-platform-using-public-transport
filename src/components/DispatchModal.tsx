import React, { useState } from 'react';
import { PotholeAlert } from '../types';
import { X, Wrench, ShieldAlert, CheckCircle2, Truck, HardHat } from 'lucide-react';

interface DispatchModalProps {
  pothole: PotholeAlert | null;
  onClose: () => void;
  onConfirmDispatch: (potholeId: string, team: string, ticketId: string) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  pothole,
  onClose,
  onConfirmDispatch,
}) => {
  if (!pothole) return null;

  const [selectedTeam, setSelectedTeam] = useState<string>(
    'BBMP Ward Rapid Asphalt Squad #4'
  );
  const [priority, setPriority] = useState<string>(
    pothole.severity === 'CRITICAL' ? 'EMERGENCY_IMMEDIATE' : 'HIGH_PRIORITY'
  );
  const [notes, setNotes] = useState<string>(
    `Repair pothole depth ~${pothole.depthEstimateCm}cm identified by onboard edge camera.`
  );

  const ticketId = `WO-SIH-2024-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmDispatch(pothole.id, selectedTeam, ticketId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
              <HardHat className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-white text-sm">
                Dispatch Municipal Road Repair Unit
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Incident Ref: {pothole.id} • Depth: {pothole.depthEstimateCm}cm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
          {/* Location details card */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Corridor</span>
              <span className="font-bold">{pothole.corridor}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Exact Location</span>
              <span className="truncate max-w-[240px]">{pothole.roadName}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Confidence</span>
              <span className="text-emerald-400 font-bold">{pothole.confidenceScore}% (YOLOv8)</span>
            </div>
          </div>

          {/* Assigned Squad Selector */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-mono font-semibold">
              Select Municipal Asphalt Crew
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:border-cyan-500 outline-none"
            >
              <option value="BBMP Ward Rapid Asphalt Squad #4">
                BBMP Ward Rapid Asphalt Squad #4 (Available - 12m away)
              </option>
              <option value="Municipal Zone 2 Emergency Road Patcher">
                Municipal Zone 2 Emergency Road Patcher (Available - 18m away)
              </option>
              <option value="NHAI Quick Patch Squad #5">
                NHAI Quick Patch Squad #5 (Expressway Specialist)
              </option>
            </select>
          </div>

          {/* Priority Level */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-mono font-semibold">
              Dispatch Priority Rating
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPriority('EMERGENCY_IMMEDIATE')}
                className={`py-2 px-3 rounded-xl font-mono text-xs border transition ${
                  priority === 'EMERGENCY_IMMEDIATE'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                🚨 Emergency (Within 2 Hours)
              </button>
              <button
                type="button"
                onClick={() => setPriority('HIGH_PRIORITY')}
                className={`py-2 px-3 rounded-xl font-mono text-xs border transition ${
                  priority === 'HIGH_PRIORITY'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                ⚡ High Priority (Same Day)
              </button>
            </div>
          </div>

          {/* Work Order Instructions */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-mono font-semibold">
              Crew Instructions & Material Specs
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 font-mono text-xs focus:border-cyan-500 outline-none resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Confirm & Dispatch Crew</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
