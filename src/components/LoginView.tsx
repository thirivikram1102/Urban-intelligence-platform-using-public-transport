import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Activity,
  Shield,
  Sun,
  Moon,
  Compass,
  ArrowRight,
  Info,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  AuthUser,
  LoginPayload,
  LocationPermissionStatus,
  UserLocationData,
} from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser, payload: LoginPayload) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  theme,
  onToggleTheme,
}) => {
  // Form State
  const [emailOrUsername, setEmailOrUsername] = useState<string>('officer.sharma@urbanai.gov.in');
  const [password, setPassword] = useState<string>('UrbanSecure@2024');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSignUpMode, setIsSignUpMode] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('Inspector A. Sharma');

  // Location Permission & Telemetry State
  const [locationTrackingPermitted, setLocationTrackingPermitted] = useState<boolean>(true);
  const [locationStatus, setLocationStatus] = useState<LocationPermissionStatus>('idle');
  const [userLocation, setUserLocation] = useState<UserLocationData | null>(null);
  const [locationAlertMessage, setLocationAlertMessage] = useState<string | null>(null);

  // Validation & Submission State
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotSubmitted, setForgotSubmitted] = useState<boolean>(false);

  // Pre-fetch or probe Geolocation on mount if permitted
  useEffect(() => {
    if (locationTrackingPermitted) {
      captureDeviceLocation(false);
    } else {
      setLocationStatus('disabled');
    }
  }, []);

  // Geolocation API Handler
  const captureDeviceLocation = (interactive: boolean = false): Promise<UserLocationData | null> => {
    return new Promise((resolve) => {
      if (!locationTrackingPermitted) {
        setLocationStatus('disabled');
        setLocationAlertMessage('Location tracking is toggled off. Coordinates will not be included.');
        resolve(null);
        return;
      }

      if (!('geolocation' in navigator)) {
        setLocationStatus('unavailable');
        const fallback: UserLocationData = {
          latitude: 12.9716,
          longitude: 77.5946,
          accuracy: 150,
          timestamp: Date.now(),
          source: 'simulated-fallback',
          formattedAddress: 'Bengaluru Command Central (IP Fallback)',
        };
        setUserLocation(fallback);
        setLocationAlertMessage('Geolocation API unavailable on this browser. Applied city-hub fallback.');
        resolve(fallback);
        return;
      }

      setLocationStatus('requesting');
      setLocationAlertMessage(null);

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 30000,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locData: UserLocationData = {
            latitude: +position.coords.latitude.toFixed(6),
            longitude: +position.coords.longitude.toFixed(6),
            accuracy: Math.round(position.coords.accuracy),
            timestamp: position.timestamp || Date.now(),
            source: 'gps',
            formattedAddress: `Lat: ${position.coords.latitude.toFixed(4)}°, Lng: ${position.coords.longitude.toFixed(4)}° (±${Math.round(position.coords.accuracy)}m)`,
          };
          setUserLocation(locData);
          setLocationStatus('verified');
          setLocationAlertMessage(null);
          resolve(locData);
        },
        (error) => {
          let msg = 'Unable to retrieve location coordinates.';
          let status: LocationPermissionStatus = 'error';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              status = 'denied';
              msg = 'Location permission was denied. Proceeding with municipal network anchor.';
              break;
            case error.TIMEOUT:
              status = 'timeout';
              msg = 'Location request timed out. Using last known corridor location.';
              break;
            case error.POSITION_UNAVAILABLE:
              status = 'unavailable';
              msg = 'Location information is currently unavailable.';
              break;
          }

          setLocationStatus(status);
          // Graceful fallback coordinate so transit officers can still authenticate seamlessly
          const fallbackData: UserLocationData = {
            latitude: 12.9345,
            longitude: 77.6265,
            accuracy: 45,
            timestamp: Date.now(),
            source: 'simulated-fallback',
            formattedAddress: 'Koramangala Corridor Sector (Simulated Fallback)',
          };
          setUserLocation(fallbackData);
          setLocationAlertMessage(msg);
          resolve(fallbackData);
        },
        options
      );
    });
  };

  // Toggle location permission switch
  const handleLocationToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setLocationTrackingPermitted(isChecked);
    if (isChecked) {
      captureDeviceLocation(true);
    } else {
      setLocationStatus('disabled');
      setUserLocation(null);
      setLocationAlertMessage('Location disabled by user. Authenticating without spatial telemetry.');
    }
  };

  // Real-time client-side validation
  const validateForm = (): boolean => {
    let isValid = true;

    // Email or Username validation
    const trimmedUser = emailOrUsername.trim();
    if (!trimmedUser) {
      setEmailError('Email or username is required.');
      isValid = false;
    } else if (trimmedUser.includes('@')) {
      // If user typed an email, validate email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedUser)) {
        setEmailError('Please enter a valid email address (e.g. name@domain.com).');
        isValid = false;
      } else {
        setEmailError(null);
      }
    } else if (trimmedUser.length < 3) {
      setEmailError('Username must be at least 3 characters.');
      isValid = false;
    } else {
      setEmailError(null);
    }

    // Password validation (min 6 characters)
    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    } else {
      setPasswordError(null);
    }

    return isValid;
  };

  // Login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simultaneously capture location and process authentication
    let activeLocation = userLocation;
    if (locationTrackingPermitted && (!userLocation || locationStatus === 'idle')) {
      activeLocation = await captureDeviceLocation(true);
    }

    // Simulate network latency (800ms)
    setTimeout(() => {
      setIsLoading(false);

      const payload: LoginPayload = {
        usernameOrEmail: emailOrUsername.trim(),
        passwordHash: 'SHA-256:••••••••••••••••••••••••••••••••',
        rememberMe,
        locationTrackingPermitted,
        location: locationTrackingPermitted ? activeLocation : null,
        clientMetadata: {
          clientTimestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          platform: navigator.platform || 'Web/Desktop',
          screenResolution: `${window.innerWidth}x${window.innerHeight}`,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
        },
      };

      const authenticatedUser: AuthUser = {
        id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
        usernameOrEmail: emailOrUsername.trim(),
        name: isSignUpMode ? fullName : 'Inspector A. Sharma',
        role: 'Urban Mobility Transit Officer',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        rememberMe,
        location: locationTrackingPermitted ? activeLocation : null,
        authToken: `tok_sih_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
        sessionStartedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        loginProvider: 'credentials',
      };

      onLoginSuccess(authenticatedUser, payload);
    }, 850);
  };

  // Social Auth Handlers
  const handleSocialAuth = (provider: 'google' | 'apple') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const payload: LoginPayload = {
        usernameOrEmail: provider === 'google' ? 'sharma.officer@gmail.com' : 'officer.transit@icloud.com',
        passwordHash: 'OAUTH_BEARER_GRANT_TOKEN_VALID',
        rememberMe: true,
        locationTrackingPermitted,
        location: userLocation,
        clientMetadata: {
          clientTimestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          platform: navigator.platform || 'Web',
          screenResolution: `${window.innerWidth}x${window.innerHeight}`,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
        },
      };

      const socialUser: AuthUser = {
        id: `usr-oauth-${Date.now().toString().slice(-4)}`,
        usernameOrEmail: provider === 'google' ? 'sharma.officer@gmail.com' : 'officer.transit@icloud.com',
        name: provider === 'google' ? 'Amit Sharma (Google)' : 'Amit Sharma (Apple ID)',
        role: 'Field Transit Coordinator',
        avatarUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
        rememberMe: true,
        location: userLocation,
        authToken: `oauth_${provider}_jwt_${Date.now()}`,
        sessionStartedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        loginProvider: provider,
      };

      onLoginSuccess(socialUser, payload);
    }, 700);
  };

  // Demo autofill shortcut
  const handleAutofillDemo = () => {
    setEmailOrUsername('officer.sharma@urbanai.gov.in');
    setPassword('UrbanSecure@2024');
    setEmailError(null);
    setPasswordError(null);
    if (!locationTrackingPermitted) {
      setLocationTrackingPermitted(true);
      captureDeviceLocation(true);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center px-4 py-8 relative transition-colors duration-300 select-none ${
        isDark
          ? 'bg-slate-950 text-slate-100'
          : 'bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/40 text-slate-900'
      }`}
    >
      {/* Background Decorative Lighting Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-30 ${
            isDark ? 'bg-cyan-500/20' : 'bg-cyan-300/40'
          }`}
        />
        <div
          className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-30 ${
            isDark ? 'bg-indigo-600/20' : 'bg-indigo-300/40'
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-10 pointer-events-none ${
            isDark ? 'bg-emerald-500' : 'bg-indigo-400'
          }`}
        />
      </div>

      {/* Top Floating Controls: Theme Switcher & Quick Demo */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={handleAutofillDemo}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition border ${
            isDark
              ? 'bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border-slate-800 shadow-sm'
              : 'bg-white/80 hover:bg-white text-indigo-700 border-slate-200 shadow-sm'
          }`}
          title="Autofill Municipal Test Credentials"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Demo Fill</span>
        </button>

        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-xl border transition ${
            isDark
              ? 'bg-slate-900/80 hover:bg-slate-800 text-amber-300 border-slate-800'
              : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200 shadow-sm'
          }`}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Login Card Container */}
      <div
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 transition-all duration-300 border backdrop-blur-xl ${
          isDark
            ? 'bg-slate-900/90 border-slate-800/90 shadow-slate-950/80'
            : 'bg-white/95 border-slate-200/90 shadow-indigo-100/60'
        }`}
      >
        {/* Header: Logo Placeholder & Title */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-emerald-400 p-0.5 shadow-xl shadow-cyan-500/20 flex items-center justify-center">
            <div
              className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                isDark ? 'bg-slate-950' : 'bg-white'
              }`}
            >
              <Activity className="w-7 h-7 text-cyan-500 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-extrabold text-xl tracking-tight font-mono">
                URBAN<span className="text-cyan-500">.AI</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider border ${
                  isDark
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60'
                    : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                }`}
              >
                Smart City Hub
              </span>
            </div>
            <p
              className={`text-xs font-mono mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Smart India Hackathon • Municipal Command Portal
            </p>
          </div>
        </div>

        {/* Headline & Subtitle */}
        <div className="mt-6 text-center space-y-1">
          <h2
            className={`text-2xl font-bold tracking-tight font-sans ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {isSignUpMode ? 'Create Field Account' : 'Welcome Back'}
          </h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isSignUpMode
              ? 'Register with your municipal officer credentials'
              : 'Please enter your details'}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          {/* Full Name field (if Sign Up mode) */}
          {isSignUpMode && (
            <div className="space-y-1.5">
              <label
                className={`block text-xs font-mono font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Officer Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Officer Anita Verma"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition outline-none font-mono ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>
          )}

          {/* Email or Username Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="email-username-input"
              className={`block text-xs font-mono font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Email or Username
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email-username-input"
                type="text"
                value={emailOrUsername}
                onChange={(e) => {
                  setEmailOrUsername(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                placeholder="officer.sharma@urbanai.gov.in"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition outline-none font-mono ${
                  emailError
                    ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : isDark
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>
            {emailError && (
              <p className="text-[11px] font-mono text-rose-500 flex items-center gap-1 mt-1 animate-in fade-in">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{emailError}</span>
              </p>
            )}
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div className="space-y-1.5">
            <label
              htmlFor="password-input"
              className={`block text-xs font-mono font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Password
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                placeholder="Enter password (min 6 chars)"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition outline-none font-mono ${
                  passwordError
                    ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : isDark
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition ${
                  isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-[11px] font-mono text-rose-500 flex items-center gap-1 mt-1 animate-in fade-in">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{passwordError}</span>
              </p>
            )}
          </div>

          {/* Real-time Location Tracking Permission Section */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              isDark
                ? 'bg-slate-950/80 border-slate-800/90'
                : 'bg-indigo-50/50 border-indigo-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="location-toggle"
                className="flex items-center gap-2 cursor-pointer"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    locationTrackingPermitted
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-800/40 text-slate-500 border border-slate-700/40'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span
                    className={`text-xs font-mono font-semibold block ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    Transmit Live User Location
                  </span>
                  <span
                    className={`text-[10px] font-mono block ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Corridor dispatch verification
                  </span>
                </div>
              </label>

              {/* Toggle Switch */}
              <input
                type="checkbox"
                id="location-toggle"
                checked={locationTrackingPermitted}
                onChange={handleLocationToggle}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Visual Location Status Indicator */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                {locationStatus === 'requesting' && (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span className="text-cyan-400 font-medium">Fetching Location...</span>
                  </>
                )}

                {locationStatus === 'verified' && (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Location Verified</span>
                  </>
                )}

                {locationStatus === 'disabled' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span className="text-slate-400">Location Disabled</span>
                  </>
                )}

                {(locationStatus === 'denied' ||
                  locationStatus === 'timeout' ||
                  locationStatus === 'unavailable' ||
                  locationStatus === 'error') && (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-400 font-medium">Permission Denied (Fallback Active)</span>
                  </>
                )}

                {locationStatus === 'idle' && (
                  <span className="text-slate-400">Ready to probe GPS</span>
                )}
              </div>

              {locationTrackingPermitted && (
                <button
                  type="button"
                  onClick={() => captureDeviceLocation(true)}
                  className={`p-1 rounded transition text-[10px] flex items-center gap-1 ${
                    isDark
                      ? 'text-cyan-400 hover:text-cyan-300'
                      : 'text-indigo-600 hover:text-indigo-800'
                  }`}
                  title="Re-probe GPS coordinates"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Re-probe</span>
                </button>
              )}
            </div>

            {/* Coordinates Display Preview */}
            {userLocation && locationTrackingPermitted && (
              <div
                className={`mt-2 px-2 py-1 rounded text-[10px] font-mono flex items-center justify-between ${
                  isDark ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-700'
                }`}
              >
                <span>
                  📍 {userLocation.latitude.toFixed(4)}°N, {userLocation.longitude.toFixed(4)}°E
                </span>
                <span className="text-cyan-400 font-semibold">
                  ±{userLocation.accuracy}m
                </span>
              </div>
            )}

            {/* Soft Fallback Alert Message */}
            {locationAlertMessage && (
              <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-300 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                <span>{locationAlertMessage}</span>
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-mono select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-cyan-600 focus:ring-cyan-500 accent-cyan-500 cursor-pointer"
              />
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                Remember Me
              </span>
            </label>

            <button
              type="button"
              onClick={() => {
                setForgotPasswordOpen(true);
                setForgotSubmitted(false);
              }}
              className={`font-mono transition ${
                isDark
                  ? 'text-cyan-400 hover:text-cyan-300 hover:underline'
                  : 'text-indigo-600 hover:text-indigo-800 hover:underline'
              }`}
            >
              Forgot Password?
            </button>
          </div>

          {/* Primary Submit Button with Loading Spinner */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-mono font-bold text-sm text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] ${
              isLoading
                ? 'bg-slate-700 cursor-not-allowed opacity-80'
                : isDark
                ? 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-cyan-500 hover:from-cyan-500 hover:to-indigo-500 shadow-cyan-900/30'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-indigo-200'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Verifying & Capturing Telemetry...</span>
              </>
            ) : (
              <>
                <span>{isSignUpMode ? 'Register & Transmit' : 'Log In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Visual Divider: "Or continue with" */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div
                className={`w-full border-t ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase font-mono">
              <span
                className={`px-2 ${
                  isDark ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'
                }`}
              >
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Authentication Buttons for Google & Apple */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google Sign In */}
            <button
              type="button"
              onClick={() => handleSocialAuth('google')}
              disabled={isLoading}
              className={`py-2.5 px-3 rounded-xl border font-mono text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 ${
                isDark
                  ? 'bg-slate-950 border-slate-800 hover:bg-slate-800/80 text-slate-200'
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm'
              }`}
            >
              {/* Google Vector Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            {/* Apple Sign In */}
            <button
              type="button"
              onClick={() => handleSocialAuth('apple')}
              disabled={isLoading}
              className={`py-2.5 px-3 rounded-xl border font-mono text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 ${
                isDark
                  ? 'bg-slate-950 border-slate-800 hover:bg-slate-800/80 text-slate-200'
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm'
              }`}
            >
              {/* Apple Vector Icon */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.61.71-1.14 1.87-1 2.99 1.07.08 2.15-.51 2.81-1.33z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          {/* Bottom Prompt: Don't have an account? Sign Up */}
          <div className="pt-3 text-center">
            <p
              className={`text-xs font-mono ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {isSignUpMode ? 'Already registered?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUpMode(!isSignUpMode);
                  setEmailError(null);
                  setPasswordError(null);
                }}
                className={`font-bold transition ${
                  isDark
                    ? 'text-cyan-400 hover:text-cyan-300 underline'
                    : 'text-indigo-600 hover:text-indigo-800 underline'
                }`}
              >
                {isSignUpMode ? 'Log In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-sm rounded-2xl p-6 border shadow-2xl space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-3">
              <h3 className="font-mono font-bold text-sm">Reset Municipal Access Password</h3>
              <button
                onClick={() => setForgotPasswordOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {!forgotSubmitted ? (
              <div className="space-y-3 text-xs">
                <p className="text-slate-400">
                  Enter your registered official email or transit ID. We will dispatch a 2FA verification link.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@urbanai.gov.in"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 font-mono text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setForgotSubmitted(true)}
                    className="px-4 py-1.5 rounded-lg bg-cyan-600 text-white font-mono font-bold text-xs hover:bg-cyan-500"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-mono font-bold text-sm text-emerald-400">Reset Link Dispatched</h4>
                <p className="text-xs text-slate-400">
                  Check your municipal inbox for verification token instructions.
                </p>
                <button
                  onClick={() => setForgotPasswordOpen(false)}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-mono"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <footer className="mt-8 text-center text-[11px] font-mono opacity-60">
        UrbanAI Urban Intelligence • Encrypted Geolocation Telemetry Transmission
      </footer>
    </div>
  );
};
