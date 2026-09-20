import React, { useState } from 'react';
import { LoginPayload, AuthUser } from '../types';
import { X, Copy, Check, MapPin, ShieldCheck, Cpu, Code2 } from 'lucide-react';

interface PayloadModalProps {
  payload: LoginPayload | null;
  user: AuthUser | null;
  onClose: () => void;
}

export const PayloadModal: React.FC<PayloadModalProps> = ({
  payload,
  user,
  onClose,
}) => {
  if (!payload) return null;

  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(
    {
      authenticatedUser: user,
      submittedAuthPayload: payload,
    },
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-white text-sm">
                Transmitted Authentication & Location Payload
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Verified API Payload • Device Telemetry Transmitted
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono flex items-center gap-1 border border-slate-700 transition"
              title="Copy JSON to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="px-6 pt-2">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">User Account</span>
                <span className="text-slate-200 font-bold truncate block">{payload.usernameOrEmail}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">Location Telemetry</span>
                <span className="text-cyan-300 font-bold block">
                  {payload.location
                    ? `${payload.location.latitude.toFixed(4)}°, ${payload.location.longitude.toFixed(4)}°`
                    : 'Location Omitted'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">Accuracy Radius</span>
                <span className="text-emerald-300 font-bold block">
                  {payload.location ? `±${payload.location.accuracy} meters` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Viewport */}
        <div className="px-6 pb-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-auto max-h-[360px] text-xs font-mono text-cyan-300">
            <pre className="whitespace-pre">{jsonString}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
