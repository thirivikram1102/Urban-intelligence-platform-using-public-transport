import React, { useState, useEffect } from 'react';
import { TabType, SystemMetrics, AuthUser, UserLocationDetails } from '../types';
import {
  Activity,
  Bus,
  Layers,
  AlertTriangle,
  Smartphone,
  Radio,
  Clock,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  LogOut,
  MapPin,
  Code2,
  Sun,
  Moon,
  User,
  ShieldAlert,
  Wrench,
  Camera,
} from 'lucide-react';

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  metrics: SystemMetrics;
  onSimulateAlert: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  unreadAlertCount: number;
  currentUser: AuthUser | null;
  onSignOut: () => void;
  onOpenPayloadModal: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  activeFaultCount?: number;
  userLocationDetails?: UserLocationDetails;
  onOpenProfileModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  metrics,
  onSimulateAlert,
  soundEnabled,
  onToggleSound,
  unreadAlertCount,
  currentUser,
  onSignOut,
  onOpenPayloadModal,
  theme,
  onToggleTheme,
  activeFaultCount = 0,
  userLocationDetails,
  onOpenProfileModal,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === 'dark';

  const navTabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Command HUD', icon: Layers },
    { id: 'fleet-map', label: 'Live Fleet Radar', icon: Radio },
    { id: 'faults', label: 'City Faults', icon: ShieldAlert },
    { id: 'admin-portal', label: 'Admin Portal', icon: Wrench },
    { id: 'potholes', label: 'AI Potholes', icon: AlertTriangle },
    { id: 'commuter-view', label: 'Commuter App', icon: Smartphone },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-colors border-b ${
        isDark
          ? 'bg-slate-950/95 backdrop-blur-md border-slate-800/80 shadow-2xl'
          : 'bg-white/95 backdrop-blur-md border-slate-200 shadow-sm'
      }`}
    >
      {/* Top Banner / SIH Badging, Live Officer GPS & System Telemetry */}
      <div
        className={`px-4 py-1.5 border-b flex flex-wrap items-center justify-between text-xs gap-2 transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800/50 text-slate-400'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium text-[11px] ${
              isDark
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-emerald-50 border border-emerald-300 text-emerald-700'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            All Systems Active
          </span>

          {/* District & Town Telemetry Header Display */}
          {userLocationDetails && (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold ${
                isDark
                  ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
                  : 'bg-cyan-50 border border-cyan-300 text-cyan-800'
              }`}
            >
              <MapPin className="w-3 h-3 text-cyan-600" />
              District: {userLocationDetails.district} | Town: {userLocationDetails.town}
            </span>
          )}

          <span
            className={`hidden md:inline-flex items-center gap-1.5 font-mono text-[11px] ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-500" />
            AI Latency: <span className="font-semibold text-cyan-600">{metrics.aiLatencyMs}ms</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className={`hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
              isDark
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
                : 'bg-amber-50 border border-amber-300 text-amber-800'
            }`}
          >
            SIH-2024 Urban Mobility
          </span>

          <div
            className={`flex items-center gap-1.5 font-mono text-xs ${
              isDark ? 'text-slate-300' : 'text-slate-700 font-semibold'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{currentTime || '00:00:00'} IST</span>
          </div>

          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute audio alerts' : 'Enable audio alert pings'}
            className={`p-1 rounded transition ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={onToggleTheme}
            title={isDark ? 'Switch to Clean Light Mode' : 'Switch to Futuristic Dark Mode'}
            className={`p-1 rounded transition ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
            }`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-500 p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
              <div
                className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                  isDark ? 'bg-slate-950' : 'bg-white'
                }`}
              >
                <Activity className="w-5 h-5 text-cyan-600 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-extrabold text-lg sm:text-xl tracking-tight font-mono ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  URBAN<span className="text-cyan-600">.AI</span>
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider font-mono ${
                    isDark
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                      : 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                  }`}
                >
                  v3.4-SIH
                </span>
              </div>
              <p
                className={`text-xs font-medium hidden sm:block ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Autonomous Urban Transit & Road Surface Intelligence System
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? isDark
                        ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40 shadow-md shadow-cyan-950/50'
                        : 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? isDark
                          ? 'text-cyan-400'
                          : 'text-cyan-600'
                        : isDark
                        ? 'text-slate-400'
                        : 'text-slate-500'
                    }`}
                  />
                  <span>{tab.label}</span>
                  {tab.id === 'faults' && activeFaultCount > 0 && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono ${
                        isDark ? 'bg-amber-500 text-slate-950' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {activeFaultCount}
                    </span>
                  )}
                  {tab.id === 'potholes' && unreadAlertCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold font-mono animate-bounce">
                      {unreadAlertCount}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Authenticated User Profile Photo & Actions */}
          <div className="flex items-center gap-2">
            {/* View Payload Inspector Button */}
            <button
              onClick={onOpenPayloadModal}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-cyan-300'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
              title="Inspect submitted login telemetry and location payload"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>Payload</span>
            </button>

            {/* Officer Profile Photo Card & Sign Out */}
            {currentUser && (
              <div
                className={`flex items-center gap-2 pl-2 border-l ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                {/* Profile Photo Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenProfileModal) {
                      onOpenProfileModal();
                    } else {
                      onSelectTab('profile');
                    }
                  }}
                  className={`flex items-center gap-2 p-1 rounded-xl transition border group ${
                    isDark
                      ? 'border-transparent hover:bg-slate-800/80 hover:border-slate-700'
                      : 'border-transparent hover:bg-slate-100 hover:border-slate-200'
                  }`}
                  title="Click to view/update profile photo and credentials"
                >
                  {/* Photo with Online Indicator and Camera Overlay on Hover */}
                  <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-cyan-500 relative flex-shrink-0 shadow-sm">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                      <Camera className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="hidden xl:block text-left">
                    <p
                      className={`text-xs font-bold leading-none font-mono truncate max-w-[120px] ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-cyan-600 font-mono leading-none mt-1">
                      {currentUser.role.split(' ')[0]} • Edit
                    </p>
                  </div>
                </button>

                {/* Sign Out Button */}
                <button
                  onClick={onSignOut}
                  className={`p-1.5 rounded-xl border transition ${
                    isDark
                      ? 'bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border-slate-800 hover:border-rose-500/40'
                      : 'bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border-slate-200 hover:border-rose-300'
                  }`}
                  title="Sign Out to Login Screen"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


