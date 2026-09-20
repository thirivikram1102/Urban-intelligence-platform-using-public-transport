export type TabType =
  | 'dashboard'
  | 'fleet-map'
  | 'faults'
  | 'admin-portal'
  | 'potholes'
  | 'commuter-view'
  | 'profile';

export type FaultCategory =
  | 'pothole'
  | 'road_damage'
  | 'traffic_blockage'
  | 'transit_breakdown'
  | 'signal_failure'
  | 'waterlogging'
  | 'debris_hazard';

export type FaultSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type FaultStatus = 'REPORTED' | 'INVESTIGATING' | 'IN_PROGRESS' | 'RESOLVED';

export type ReportedByRole = 'passenger' | 'driver' | 'field_officer' | 'automated_ai_sensor';

export interface CityFault {
  id: string;
  cityId: string;
  cityName: string;
  district: string;
  title: string;
  description: string;
  category: FaultCategory;
  severity: FaultSeverity;
  status: FaultStatus;
  priorityScore: number; // 1-100 calculated by AI/ML
  coords: Coordinates;
  mapPoint: MapPoint;
  locationName: string;
  reportedAt: string;
  reportedTimestamp: number;
  reportedBy: {
    name: string;
    role: ReportedByRole;
    contact?: string;
  };
  imageUrl?: string;
  aiAnalysis: {
    confidence: number;
    detectedElements: string[];
    estimatedDelayMins: number;
    recommendedDepartment: string;
    duplicateCount?: number;
  };
  assignedTeam?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  affectedBusRoutes?: string[];
  proximityDistanceKm?: number;
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  centerCoords: Coordinates;
  districts: string[];
  activeFaultsCount: number;
  congestionIndex: number;
  transitDelayMins: number;
  activeBuses: number;
  zoomScale: number;
}


export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapPoint {
  x: number; // 0 to 1000 coordinate space for vector map
  y: number;
}

export interface BusStop {
  id: string;
  name: string;
  code: string;
  corridor: string;
  coords: Coordinates;
  mapPoint: MapPoint;
  routes: string[];
  passengerWaitingCount: number;
}

export interface Bus {
  id: string;
  registrationNumber: string;
  routeNumber: string;
  routeName: string;
  corridor: string;
  driverName: string;
  driverRating: number;
  speedKmh: number;
  status: 'on-time' | 'delayed' | 'congestion' | 'depot';
  occupancyPercent: number; // 0-100%
  capacity: number;
  currentOccupancy: number;
  nextStop: string;
  destination: string;
  isElectric: boolean;
  batteryOrFuelPercent: number;
  lat: number;
  lng: number;
  mapX: number; // Position on SVG canvas (0 to 1000)
  mapY: number;
  pathWaypoints: MapPoint[];
  currentWaypointIndex: number;
  progressAlongSegment: number; // 0 to 1
  headingDeg: number;
  lastUpdated: string;
}

export type PotholeSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface PotholeAlert {
  id: string;
  roadName: string;
  corridor: string;
  coords: Coordinates;
  mapPoint: MapPoint;
  severity: PotholeSeverity;
  confidenceScore: number; // e.g. 96.8%
  depthEstimateCm: number;
  estimatedAreaSqM: number;
  timestamp: string;
  detectedByBusId: string;
  detectionModel: string; // e.g. "YOLOv8-UrbanRoad-v2.1 + IMU Sensor"
  status: 'DETECTED' | 'DISPATCHED' | 'REPAIRED';
  imageUrl: string;
  assignedTeam?: string;
  dispatchTicketId?: string;
}

export interface ETAPredictionItem {
  id: string;
  busId: string;
  routeNumber: string;
  routeName: string;
  destination: string;
  currentStop: string;
  targetStop: string;
  stopsAway: number;
  distanceKm: number;
  lstmEtaMinutes: number;
  xgboostEtaMinutes: number;
  blendedEtaMinutes: number;
  confidencePercent: number;
  crowdLevel: 'Low' | 'Moderate' | 'Crowded' | 'Full';
  isElectric: boolean;
  modelFactors: {
    corridorCongestionFactor: number; // 1.0 to 2.5
    weatherDelaySeconds: number;
    historicDwellVariance: number;
    segmentSpeedFactor: number;
  };
}

export interface SystemMetrics {
  activeBuses: number;
  totalBuses: number;
  onTimeRatePercent: number;
  avgNetworkSpeedKmh: number;
  trafficCongestionIndex: number; // 0 - 100
  potholesReportedToday: number;
  potholesDispatched: number;
  carbonEmissionsSavedKg: number;
  passengersMovedToday: number;
  systemHealth: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  aiLatencyMs: number;
}

export interface SystemAlert {
  id: string;
  type: 'POTHOLE' | 'CONGESTION' | 'SOS' | 'ETA_ANOMALY' | 'DISPATCH';
  title: string;
  message: string;
  timestamp: string;
  severity: 'danger' | 'warning' | 'info' | 'success';
  read?: boolean;
}

export type LocationPermissionStatus =
  | 'idle'
  | 'requesting'
  | 'verified'
  | 'denied'
  | 'timeout'
  | 'unavailable'
  | 'disabled'
  | 'error';

export interface UserLocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  source: 'gps' | 'network' | 'simulated-fallback';
  formattedAddress?: string;
  district?: string;
  town?: string;
  state?: string;
}

export interface UserLocationDetails {
  state: string;
  district: string;
  town: string;
  locality?: string;
  coords: Coordinates;
  accuracy: number;
  source: 'gps_reverse_geocoded' | 'manual_selection' | 'default';
  formattedAddress?: string;
  detectedAt?: string;
}

export interface AuthUser {
  id: string;
  usernameOrEmail: string;
  name: string;
  role: string;
  avatarUrl: string;
  rememberMe: boolean;
  location?: UserLocationData | null;
  authToken: string;
  sessionStartedAt: string;
  loginProvider: 'credentials' | 'google' | 'apple';
  department?: string;
  phone?: string;
  bio?: string;
  profilePhotoUploadedAt?: string;
}

export interface LoginPayload {
  usernameOrEmail: string;
  passwordHash: string; // obfuscated in payload
  rememberMe: boolean;
  locationTrackingPermitted: boolean;
  location: UserLocationData | null;
  clientMetadata: {
    clientTimestamp: string;
    userAgent: string;
    platform: string;
    screenResolution: string;
    timeZone: string;
  };
}

