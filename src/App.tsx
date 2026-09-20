/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  TabType,
  Bus,
  PotholeAlert,
  SystemMetrics,
  SystemAlert,
  AuthUser,
  LoginPayload,
  CityData,
  CityFault,
  FaultStatus,
  UserLocationDetails,
} from './types';
import {
  INITIAL_BUSES,
  BUS_STOPS,
  INITIAL_POTHOLES,
  INITIAL_METRICS,
  INITIAL_SYSTEM_ALERTS,
} from './data/mockData';
import {
  SUPPORTED_CITIES,
  INITIAL_CITY_FAULTS,
  detectClosestCity,
  calculateDistanceKm,
} from './data/faultData';
import { reverseGeocodeCoordinates } from './data/locationDirectory';
import { Header } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { FleetMapTab } from './components/FleetMapTab';
import { PotholeDetectionTab } from './components/PotholeDetectionTab';
import { CommuterAppView } from './components/CommuterAppView';
import { DispatchModal } from './components/DispatchModal';
import { AlertNotification } from './components/AlertNotification';
import { LoginView } from './components/LoginView';
import { PayloadModal } from './components/PayloadModal';
import { CitySelectorBar } from './components/CitySelectorBar';
import { CityFaultsTab } from './components/CityFaultsTab';
import { AdminFaultDashboardTab } from './components/AdminFaultDashboardTab';
import { ReportFaultModal } from './components/ReportFaultModal';
import { NearbyFaultAlertBanner } from './components/NearbyFaultAlertBanner';
import { DistrictTownSelectorModal } from './components/DistrictTownSelectorModal';
import { UserProfileModal } from './components/UserProfileModal';
import { UserProfileTab } from './components/UserProfileTab';

const DEFAULT_USER_LOCATION: UserLocationDetails = {
  state: 'Tamil Nadu',
  district: 'Tiruchirappalli',
  town: 'Srirangam',
  locality: 'Ranganathaswamy Temple Corridor',
  coords: { lat: 10.8622, lng: 78.6946 },
  accuracy: 14,
  source: 'gps_reverse_geocoded',
  formattedAddress: 'Srirangam, Tiruchirappalli, Tamil Nadu, India',
  detectedAt: 'Active (GPS Verified)',
};

export default function App() {
  // Theme state with localStorage persistence - default to clean, modern light theme
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('urbanai_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return 'light';
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('urbanai_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [userLocationDetails, setUserLocationDetails] = useState<UserLocationDetails>(() => {
    try {
      const saved = localStorage.getItem('urbanai_location_details');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_USER_LOCATION;
  });

  const [isDistrictTownModalOpen, setIsDistrictTownModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [submittedPayload, setSubmittedPayload] = useState<LoginPayload | null>(null);
  const [isPayloadModalOpen, setIsPayloadModalOpen] = useState<boolean>(false);

  // Smart City & Fault Detection States
  const [activeCity, setActiveCity] = useState<CityData>(SUPPORTED_CITIES[0]); // Default Bengaluru
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');
  const [cityFaults, setCityFaults] = useState<CityFault[]>(INITIAL_CITY_FAULTS);
  const [isReportFaultModalOpen, setIsReportFaultModalOpen] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [adminTargetFaultId, setAdminTargetFaultId] = useState<string | undefined>(undefined);

  // Synchronize theme with localStorage and root HTML class
  useEffect(() => {
    try {
      localStorage.setItem('urbanai_theme', theme);
    } catch {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [stops] = useState(BUS_STOPS);
  const [potholes, setPotholes] = useState<PotholeAlert[]>(INITIAL_POTHOLES);
  const [metrics, setMetrics] = useState<SystemMetrics>(INITIAL_METRICS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_SYSTEM_ALERTS);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [dispatchingPothole, setDispatchingPothole] = useState<PotholeAlert | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Audio synthesizer for alerts
  const playSoundChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {
      // Ignore audio autoplay restrictions
    }
  };

  // Handle Login Authentication
  const handleLoginSuccess = (user: AuthUser, payload: LoginPayload) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('urbanai_user', JSON.stringify(user));
    } catch {}

    setSubmittedPayload(payload);
    playSoundChime();

    // If payload location has district or town, apply to details
    if (payload.location) {
      const updatedDetails: UserLocationDetails = {
        state: payload.location.state || userLocationDetails.state,
        district: payload.location.district || userLocationDetails.district,
        town: payload.location.town || userLocationDetails.town,
        coords: { lat: payload.location.latitude, lng: payload.location.longitude },
        accuracy: payload.location.accuracy,
        source: 'gps_reverse_geocoded',
        formattedAddress:
          payload.location.formattedAddress ||
          `${payload.location.town || userLocationDetails.town}, ${payload.location.district || userLocationDetails.district}`,
        detectedAt: 'Verified upon login',
      };
      setUserLocationDetails(updatedDetails);
      try {
        localStorage.setItem('urbanai_location_details', JSON.stringify(updatedDetails));
      } catch {}
    }

    const locationText = payload.location
      ? `GPS Coordinates Verified: ${payload.location.latitude.toFixed(4)}°N, ${payload.location.longitude.toFixed(4)}°E (±${payload.location.accuracy}m)`
      : 'Location tracking disabled by officer.';

    setAlerts((prev) => [
      {
        id: `login-${Date.now()}`,
        type: 'SOS',
        title: `Welcome, ${user.name}`,
        message: `Authenticated via ${user.loginProvider.toUpperCase()}. ${locationText}`,
        timestamp: 'Just now',
        severity: 'success',
      },
      ...prev,
    ]);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('urbanai_user');
    } catch {}
    setAlerts((prev) => [
      {
        id: `logout-${Date.now()}`,
        type: 'DISPATCH',
        title: 'Officer Session Terminated',
        message: 'You have signed out from the municipal command network.',
        timestamp: 'Just now',
        severity: 'info',
      },
      ...prev,
    ]);
  };

  // User Profile Update (photo upload, bio, role, contact)
  const handleUpdateUser = (updatedUser: AuthUser) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('urbanai_user', JSON.stringify(updatedUser));
    } catch {}
    playSoundChime();
    setAlerts((prev) => [
      {
        id: `user-upd-${Date.now()}`,
        type: 'DISPATCH',
        title: 'Officer Profile Synchronized',
        message: `Profile photo and credentials updated for ${updatedUser.name}.`,
        timestamp: 'Just now',
        severity: 'success',
      },
      ...prev.slice(0, 4),
    ]);
  };

  // Smart City Fault & Location Handlers
  const handleSelectCity = (city: CityData) => {
    setActiveCity(city);
    setSelectedDistrict('All Districts');
    playSoundChime();
    setAlerts((prev) => [
      {
        id: `city-${Date.now()}`,
        type: 'CONGESTION',
        title: `Switched City Node: ${city.name}`,
        message: `Connected to ${city.name}, ${city.state} Smart Grid. Congestion Index: ${city.congestionIndex}%.`,
        timestamp: 'Just now',
        severity: 'info',
      },
      ...prev.slice(0, 4),
    ]);
  };

  // Automatic GPS Reverse-Geocoding for District and Town
  const handleDetectGPSLocation = () => {
    if (!navigator.geolocation) {
      setAlerts((prev) => [
        {
          id: `gps-err-${Date.now()}`,
          type: 'SOS',
          title: 'GPS Sensor Unavailable',
          message: 'HTML5 Geolocation is not supported by this browser.',
          timestamp: 'Just now',
          severity: 'warning',
        },
        ...prev,
      ]);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        try {
          // Perform reverse geocoding to identify District and Town
          const geoResult = await reverseGeocodeCoordinates({ lat: latitude, lng: longitude });

          const newDetails: UserLocationDetails = {
            state: geoResult.state,
            district: geoResult.district,
            town: geoResult.town,
            coords: { lat: latitude, lng: longitude },
            accuracy: Math.round(accuracy),
            source: 'gps_reverse_geocoded',
            formattedAddress: geoResult.displayName,
            detectedAt: 'Just now (GPS Locked)',
          };

          setUserLocationDetails(newDetails);
          try {
            localStorage.setItem('urbanai_location_details', JSON.stringify(newDetails));
          } catch {}

          // Also match or switch closest city in the fault network
          const closestCity = detectClosestCity({ lat: latitude, lng: longitude });
          setActiveCity(closestCity);
          setSelectedDistrict('All Districts');

          // Update user location data
          if (currentUser) {
            const updatedUser: AuthUser = {
              ...currentUser,
              location: {
                latitude,
                longitude,
                accuracy: Math.round(accuracy),
                timestamp: Date.now(),
                source: 'gps',
                district: geoResult.district,
                town: geoResult.town,
                state: geoResult.state,
                formattedAddress: geoResult.displayName,
              },
            };
            setCurrentUser(updatedUser);
            try {
              localStorage.setItem('urbanai_user', JSON.stringify(updatedUser));
            } catch {}
          }

          playSoundChime();
          setAlerts((prev) => [
            {
              id: `gps-success-${Date.now()}`,
              type: 'SOS',
              title: `Detected: District: ${geoResult.district} | Town: ${geoResult.town}`,
              message: `GPS coordinates ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E (±${Math.round(
                accuracy
              )}m). Filtered transport faults for ${geoResult.town}.`,
              timestamp: 'Just now',
              severity: 'success',
            },
            ...prev.slice(0, 4),
          ]);
        } catch {
          // Fallback handled inside reverseGeocodeCoordinates
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        playSoundChime();
        setAlerts((prev) => [
          {
            id: `gps-fallback-${Date.now()}`,
            type: 'SOS',
            title: 'GPS Fallback Active',
            message: `${error.message || 'Location permission denied'}. Defaulted to District: ${userLocationDetails.district} | Town: ${userLocationDetails.town}.`,
            timestamp: 'Just now',
            severity: 'warning',
          },
          ...prev.slice(0, 4),
        ]);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Manual District & Town selection handler
  const handleUpdateDistrictTownLocation = (newLocation: UserLocationDetails) => {
    setUserLocationDetails(newLocation);
    try {
      localStorage.setItem('urbanai_location_details', JSON.stringify(newLocation));
    } catch {}

    // Check if city matches
    const matchingCity = SUPPORTED_CITIES.find(
      (c) =>
        c.name.toLowerCase() === newLocation.district.toLowerCase() ||
        c.districts.some((d) => d.toLowerCase() === newLocation.district.toLowerCase())
    );
    if (matchingCity) {
      setActiveCity(matchingCity);
    }

    if (currentUser) {
      const updatedUser: AuthUser = {
        ...currentUser,
        location: {
          latitude: newLocation.coords.lat,
          longitude: newLocation.coords.lng,
          accuracy: newLocation.accuracy,
          timestamp: Date.now(),
          source: 'simulated-fallback',
          district: newLocation.district,
          town: newLocation.town,
          state: newLocation.state,
          formattedAddress: newLocation.formattedAddress,
        },
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('urbanai_user', JSON.stringify(updatedUser));
      } catch {}
    }

    playSoundChime();
    setAlerts((prev) => [
      {
        id: `loc-sel-${Date.now()}`,
        type: 'CONGESTION',
        title: `Location Switched: ${newLocation.town}`,
        message: `District: ${newLocation.district} | Town: ${newLocation.town}. Nearby faults & road blockages active.`,
        timestamp: 'Just now',
        severity: 'info',
      },
      ...prev.slice(0, 4),
    ]);
  };

  const handleSubmitNewFault = (newFault: CityFault) => {
    setCityFaults((prev) => [newFault, ...prev]);
    playSoundChime();
    setAlerts((prev) => [
      {
        id: `new-flt-${Date.now()}`,
        type: 'POTHOLE',
        title: `Incident ${newFault.id} Logged (${newFault.severity})`,
        message: `${newFault.title} reported at ${newFault.locationName}. AI Priority: ${newFault.priorityScore}/100.`,
        timestamp: 'Just now',
        severity: newFault.severity === 'CRITICAL' ? 'danger' : 'warning',
      },
      ...prev.slice(0, 4),
    ]);
  };

  const handleUpdateFaultStatus = (
    faultId: string,
    newStatus: FaultStatus,
    assignedTeam?: string,
    notes?: string
  ) => {
    setCityFaults((prev) =>
      prev.map((f) => {
        if (f.id === faultId) {
          return {
            ...f,
            status: newStatus,
            assignedTeam: assignedTeam !== undefined ? assignedTeam : f.assignedTeam,
            resolutionNotes: notes !== undefined ? notes : f.resolutionNotes,
            resolvedAt: newStatus === 'RESOLVED' ? 'Just now' : f.resolvedAt,
          };
        }
        return f;
      })
    );

    playSoundChime();
    setAlerts((prev) => [
      {
        id: `update-flt-${Date.now()}`,
        type: 'DISPATCH',
        title: `Work Order ${faultId} Updated`,
        message: `Status transitioned to ${newStatus.replace('_', ' ')}.${
          assignedTeam ? ` Assigned to: ${assignedTeam}.` : ''
        }`,
        timestamp: 'Just now',
        severity: newStatus === 'RESOLVED' ? 'success' : 'info',
      },
      ...prev.slice(0, 4),
    ]);
  };

  const handleSimulateUrgentHazard = () => {
    const hazardId = `FLT-${activeCity.id.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newHazard: CityFault = {
      id: hazardId,
      cityId: activeCity.id,
      cityName: activeCity.name,
      district: activeCity.districts[1] || 'Central Business District',
      title: 'Sudden Multi-Vehicle Collision & Hydraulic Oil Spill on Flyover',
      description:
        'Three vehicles involved in pile-up on primary flyover descent. Heavy oil slick covering 60 meters of road surface. Total standstill.',
      category: 'traffic_blockage',
      severity: 'CRITICAL',
      status: 'REPORTED',
      priorityScore: 98,
      coords: {
        lat: activeCity.centerCoords.lat + (Math.random() - 0.5) * 0.02,
        lng: activeCity.centerCoords.lng + (Math.random() - 0.5) * 0.02,
      },
      mapPoint: { x: Math.round(300 + Math.random() * 400), y: Math.round(300 + Math.random() * 400) },
      locationName: `Main Central Expressway Flyover, ${activeCity.name}`,
      reportedAt: 'Just now',
      reportedTimestamp: Date.now(),
      reportedBy: {
        name: 'Automated AI CCTV Camera #09',
        role: 'automated_ai_sensor',
        contact: 'Traffic Command Feed',
      },
      imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
      aiAnalysis: {
        confidence: 99.4,
        detectedElements: ['Flyover total obstruction', 'Combustible oil slick hazard', 'Immediate fire brigade & tow required'],
        estimatedDelayMins: 45,
        recommendedDepartment: 'Traffic Police Quick Response & Fire Services Hazardous Materials Unit',
        duplicateCount: 0,
      },
      affectedBusRoutes: ['Express-01', 'Route-500'],
    };

    setCityFaults((prev) => [newHazard, ...prev]);
    playSoundChime();
    setAlerts((prev) => [
      {
        id: `sim-hazard-${Date.now()}`,
        type: 'SOS',
        title: `🚨 CRITICAL EMERGENCY: ${hazardId}`,
        message: `${newHazard.title} in ${activeCity.name}. Immediate diversion active.`,
        timestamp: 'Just now',
        severity: 'danger',
      },
      ...prev.slice(0, 4),
    ]);
  };

  const handleOpenAdminPortal = (faultId?: string) => {
    setAdminTargetFaultId(faultId);
    setCurrentTab('admin-portal');
  };

  // Continuous Bus Telemetry Simulation Engine
  useEffect(() => {
    if (!isSimRunning) return;

    const intervalMs = 1000 / simulationSpeed;
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          const waypoints = bus.pathWaypoints;
          if (waypoints.length < 2) return bus;

          // Increment progress along segment
          let nextProgress = bus.progressAlongSegment + 0.04;
          let nextWaypointIndex = bus.currentWaypointIndex;

          if (nextProgress >= 1) {
            nextProgress = 0;
            nextWaypointIndex = (nextWaypointIndex + 1) % (waypoints.length - 1);
          }

          const p1 = waypoints[nextWaypointIndex];
          const p2 = waypoints[nextWaypointIndex + 1] || waypoints[0];

          // Linear interpolation between waypoints
          const currentX = p1.x + (p2.x - p1.x) * nextProgress;
          const currentY = p1.y + (p2.y - p1.y) * nextProgress;

          // Calculate heading angle
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const headingDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

          // Slight speed fluctuation
          const speedVariance = (Math.random() - 0.5) * 2;
          const newSpeed = Math.round(Math.max(12, Math.min(55, bus.speedKmh + speedVariance)));

          // GPS coordinate approximation for Bengaluru corridor
          const newLat = +(12.85 + (1 - currentY / 1000) * 0.18).toFixed(4);
          const newLng = +(77.55 + (currentX / 1000) * 0.18).toFixed(4);

          return {
            ...bus,
            mapX: Math.round(currentX),
            mapY: Math.round(currentY),
            headingDeg: Math.round(headingDeg),
            progressAlongSegment: nextProgress,
            currentWaypointIndex: nextWaypointIndex,
            speedKmh: newSpeed,
            lat: newLat,
            lng: newLng,
            lastUpdated: 'Just now',
          };
        })
      );
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isSimRunning, simulationSpeed]);

  // Simulate new AI Alert (Pothole or Congestion Spike)
  const handleSimulateAlert = () => {
    playSoundChime();
    const alertId = `PTH-${Math.floor(8100 + Math.random() * 900)}`;
    const corridors = ['Corridor Alpha', 'Corridor Beta', 'Corridor Gamma', 'Corridor Delta', 'Corridor Epsilon'];
    const roadNames = [
      'Outer Ring Road, Near Bellandur Junction',
      'Old Madras Road, Near Swami Vivekananda Metro',
      'Bannerghatta Road, Near Jayadeva Hospital Underpass',
      'Sarjapur Main Road, Near Wipro Gate 2',
      'Hosur Road, Near Bommanahalli Junction',
    ];

    const randomIdx = Math.floor(Math.random() * roadNames.length);
    const depth = +(8 + Math.random() * 9).toFixed(1);
    const confidence = +(94 + Math.random() * 5).toFixed(1);
    const bus = buses[Math.floor(Math.random() * buses.length)];

    const newPothole: PotholeAlert = {
      id: alertId,
      roadName: roadNames[randomIdx],
      corridor: corridors[randomIdx],
      coords: {
        lat: +(12.91 + Math.random() * 0.08).toFixed(4),
        lng: +(77.61 + Math.random() * 0.08).toFixed(4),
      },
      mapPoint: {
        x: Math.round(350 + Math.random() * 300),
        y: Math.round(300 + Math.random() * 350),
      },
      severity: depth > 12 ? 'CRITICAL' : 'HIGH',
      confidenceScore: confidence,
      depthEstimateCm: depth,
      estimatedAreaSqM: +(0.8 + Math.random() * 1.5).toFixed(2),
      timestamp: 'Just now',
      detectedByBusId: `${bus.id} (${bus.registrationNumber})`,
      detectionModel: 'YOLOv8-UrbanRoad-v2.1 + Multi-Axis IMU Sensor Spike',
      status: 'DETECTED',
      imageUrl:
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    };

    setPotholes((prev) => [newPothole, ...prev]);

    // Add toast
    const newAlert: SystemAlert = {
      id: `alert-${Date.now()}`,
      type: 'POTHOLE',
      title: `AI Defect Detected: ${alertId}`,
      message: `Depth ${depth}cm on ${roadNames[randomIdx]} verified by Bus ${bus.registrationNumber}.`,
      timestamp: 'Just now',
      severity: depth > 12 ? 'danger' : 'warning',
    };
    setAlerts((prev) => [newAlert, ...prev.slice(0, 4)]);

    // Update metrics
    setMetrics((prev) => ({
      ...prev,
      potholesReportedToday: prev.potholesReportedToday + 1,
    }));
  };

  // Open Dispatch Modal
  const handleOpenDispatchModal = (pothole: PotholeAlert) => {
    setDispatchingPothole(pothole);
  };

  // Confirm Dispatch
  const handleConfirmDispatch = (potholeId: string, team: string, ticketId: string) => {
    setPotholes((prev) =>
      prev.map((p) =>
        p.id === potholeId
          ? {
              ...p,
              status: 'DISPATCHED',
              assignedTeam: team,
              dispatchTicketId: ticketId,
            }
          : p
      )
    );

    setMetrics((prev) => ({
      ...prev,
      potholesDispatched: prev.potholesDispatched + 1,
    }));

    setDispatchingPothole(null);
    playSoundChime();

    setAlerts((prev) => [
      {
        id: `dispatch-${Date.now()}`,
        type: 'DISPATCH',
        title: `Work Order ${ticketId} Issued`,
        message: `${team} mobilized to repair defect at ${potholeId}.`,
        timestamp: 'Just now',
        severity: 'success',
      },
      ...prev.slice(0, 4),
    ]);
  };

  const handleDismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const unreadPotholeCount = potholes.filter((p) => p.status === 'DETECTED').length;

  const isDark = theme === 'dark';

  // If user is not yet logged in, render the modern responsive Login Interface
  if (!currentUser) {
    return (
      <div className={isDark ? 'dark' : ''}>
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        {/* Floating System Alerts Notification Stack */}
        <AlertNotification alerts={alerts} onDismiss={handleDismissAlert} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-white transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Navigation Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        metrics={metrics}
        onSimulateAlert={handleSimulateAlert}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        unreadAlertCount={unreadPotholeCount}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenPayloadModal={() => setIsPayloadModalOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        activeFaultCount={
          cityFaults.filter((f) => f.cityId === activeCity.id && f.status !== 'RESOLVED').length
        }
        userLocationDetails={userLocationDetails}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Real-time Proximity Fault Alert Banner (GPS Nearby Warning) */}
      <NearbyFaultAlertBanner
        userLocation={currentUser?.location || null}
        cityFaults={cityFaults}
        onSelectFault={() => {
          setCurrentTab('faults');
        }}
      />

      {/* Smart City Selector & GPS Detection Bar */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <CitySelectorBar
          activeCity={activeCity}
          onSelectCity={handleSelectCity}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={setSelectedDistrict}
          userLocation={currentUser?.location || null}
          onRequestDetectCity={handleDetectGPSLocation}
          isLocating={isLocating}
          onOpenReportModal={() => setIsReportFaultModalOpen(true)}
          cityFaults={cityFaults}
          theme={theme}
        />
      </div>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardTab
            metrics={metrics}
            buses={buses}
            potholes={potholes}
            onNavigateTab={setCurrentTab}
            onSelectBus={(bus) => {
              setSelectedBusId(bus.id);
              setCurrentTab('fleet-map');
            }}
            onDispatchPothole={handleOpenDispatchModal}
            onSimulateAlert={handleSimulateAlert}
            userLocation={userLocationDetails}
            onOpenLocationSelector={() => setIsDistrictTownModalOpen(true)}
            onRequestGPSDetect={handleDetectGPSLocation}
            isDetectingGPS={isLocating}
            cityFaults={cityFaults}
            theme={theme}
            onOpenReportModal={() => setIsReportFaultModalOpen(true)}
          />
        )}

        {currentTab === 'faults' && (
          <CityFaultsTab
            activeCity={activeCity}
            cityFaults={cityFaults}
            selectedDistrict={selectedDistrict}
            userLocation={currentUser?.location || null}
            onOpenReportModal={() => setIsReportFaultModalOpen(true)}
            onOpenAdminPortal={handleOpenAdminPortal}
            theme={theme}
          />
        )}

        {currentTab === 'admin-portal' && (
          <AdminFaultDashboardTab
            activeCity={activeCity}
            cityFaults={cityFaults}
            onUpdateFaultStatus={handleUpdateFaultStatus}
            onSimulateUrgentHazard={handleSimulateUrgentHazard}
            initialSelectedFaultId={adminTargetFaultId}
            theme={theme}
          />
        )}

        {currentTab === 'fleet-map' && (
          <FleetMapTab
            buses={buses}
            stops={stops}
            potholes={potholes}
            selectedBusId={selectedBusId}
            onSelectBus={(bus) => setSelectedBusId(bus ? bus.id : null)}
            simulationSpeed={simulationSpeed}
            onChangeSimSpeed={setSimulationSpeed}
            isSimRunning={isSimRunning}
            onToggleSim={() => setIsSimRunning(!isSimRunning)}
            onInspectPothole={(pth) => {
              setDispatchingPothole(pth);
            }}
            userLocation={currentUser.location}
          />
        )}

        {currentTab === 'potholes' && (
          <PotholeDetectionTab
            potholes={potholes}
            onDispatchPothole={handleOpenDispatchModal}
            onSimulateNewPothole={handleSimulateAlert}
          />
        )}

        {currentTab === 'commuter-view' && (
          <CommuterAppView stops={stops} buses={buses} />
        )}

        {currentTab === 'profile' && currentUser && (
          <UserProfileTab
            user={currentUser}
            location={userLocationDetails}
            onUpdateUser={handleUpdateUser}
            onOpenLocationSelector={() => setIsDistrictTownModalOpen(true)}
            theme={theme}
          />
        )}
      </main>

      {/* District & Town Manual Selector Modal */}
      {isDistrictTownModalOpen && (
        <DistrictTownSelectorModal
          currentLocation={userLocationDetails}
          onUpdateLocation={(loc) => {
            handleUpdateDistrictTownLocation(loc);
            setIsDistrictTownModalOpen(false);
          }}
          onClose={() => setIsDistrictTownModalOpen(false)}
          onRequestGPSDetect={handleDetectGPSLocation}
          isDetectingGPS={isLocating}
          theme={theme}
        />
      )}

      {/* User Profile & Avatar Modal */}
      {isProfileModalOpen && currentUser && (
        <UserProfileModal
          user={currentUser}
          location={userLocationDetails}
          onUpdateUser={(updated) => {
            handleUpdateUser(updated);
          }}
          onClose={() => setIsProfileModalOpen(false)}
          theme={theme}
        />
      )}

      {/* Citizen / Driver Fault Reporting Modal */}
      {isReportFaultModalOpen && (
        <ReportFaultModal
          activeCity={activeCity}
          userLocation={currentUser?.location || null}
          existingFaults={cityFaults}
          onClose={() => setIsReportFaultModalOpen(false)}
          onSubmitFault={(newFault) => {
            handleSubmitNewFault(newFault);
            setIsReportFaultModalOpen(false);
          }}
        />
      )}

      {/* Work Order Dispatch Modal */}
      {dispatchingPothole && (
        <DispatchModal
          pothole={dispatchingPothole}
          onClose={() => setDispatchingPothole(null)}
          onConfirmDispatch={handleConfirmDispatch}
        />
      )}

      {/* Authentication & Location Payload Inspector Modal */}
      {isPayloadModalOpen && (
        <PayloadModal
          payload={submittedPayload}
          user={currentUser}
          onClose={() => setIsPayloadModalOpen(false)}
        />
      )}

      {/* Floating System Alerts Notification Stack */}
      <AlertNotification alerts={alerts} onDismiss={handleDismissAlert} />

      {/* Footer */}
      <footer
        className={`mt-auto border-t py-4 text-center text-xs font-mono transition-colors ${
          isDark
            ? 'border-slate-900 bg-slate-950 text-slate-500'
            : 'border-slate-200 bg-white text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            UrbanAI • Autonomous Mobile Urban Intelligence Platform (SIH-2024 Project)
          </span>
          <span className="flex items-center gap-2 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active Session: {currentUser.name} ({currentUser.role})
          </span>
        </div>
      </footer>
    </div>
  );
}
