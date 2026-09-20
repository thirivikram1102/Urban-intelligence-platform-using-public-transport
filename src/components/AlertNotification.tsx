import React from 'react';
import { SystemAlert } from '../types';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, X } from 'lucide-react';

interface AlertNotificationProps {
  alerts: SystemAlert[];
  onDismiss: (id: string) => void;
  onViewIncident?: (alert: SystemAlert) => void;
}

export const AlertNotification: React.FC<AlertNotificationProps> = ({
  alerts,
  onDismiss,
  onViewIncident,
}) => {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {alerts.slice(0, 3).map((alert) => {
        const isDanger = alert.severity === 'danger';
        const isWarning = alert.severity === 'warning';
        const isSuccess = alert.severity === 'success';

        return (
          <div
            key={alert.id}
            className={`pointer-events-auto p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              isDanger
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-100 shadow-rose-950/50'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-100 shadow-amber-950/50'
                : isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-emerald-950/50'
                : 'bg-indigo-950/90 border-indigo-500/50 text-indigo-100 shadow-indigo-950/50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex-shrink-0">
                  {isDanger && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                  {isWarning && <AlertCircle className="w-4 h-4 text-amber-400" />}
                  {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {!isDanger && !isWarning && !isSuccess && (
                    <Info className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-mono font-bold text-xs">{alert.title}</h5>
                    <span className="text-[10px] font-mono opacity-60">
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-85 leading-snug mt-1">
                    {alert.message}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onDismiss(alert.id)}
                className="p-1 rounded opacity-60 hover:opacity-100 transition flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
