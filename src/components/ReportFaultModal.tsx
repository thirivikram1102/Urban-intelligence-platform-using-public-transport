import React, { useState, useEffect } from 'react';
import {
  X,
  Camera,
  MapPin,
  AlertTriangle,
  Upload,
  Sparkles,
  CheckCircle2,
  Bus,
  ShieldAlert,
  Loader2,
  Info,
  Car,
  Lightbulb,
  CloudRain,
  Construction,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  CityData,
  CityFault,
  Coordinates,
  FaultCategory,
  FaultSeverity,
  ReportedByRole,
  UserLocationData,
} from '../types';
import { runAIFaultClassification, AIClassificationResult } from '../data/faultData';

interface ReportFaultModalProps {
  activeCity: CityData;
  userLocation: UserLocationData | null;
  existingFaults: CityFault[];
  onClose: () => void;
  onSubmitFault: (fault: CityFault) => void;
}

const CATEGORY_OPTIONS: {
  id: FaultCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    id: 'traffic_blockage',
    label: 'Traffic Blockage / Congestion',
    icon: Car,
    description: 'Vehicle breakdown, accident, or gridlock halting corridor flow',
  },
  {
    id: 'transit_breakdown',
    label: 'Bus Breakdown / Transit Delay',
    icon: Bus,
    description: 'Public transport failure, motor stall, or schedule deviation',
  },
  {
    id: 'pothole',
    label: 'Pothole & Surface Damage',
    icon: AlertTriangle,
    description: 'Deep road crater, asphalt depression, rim shock hazard',
  },
  {
    id: 'signal_failure',
    label: 'Traffic Signal / Light Failure',
    icon: Lightbulb,
    description: 'Traffic light blackout, flashing red, or power surge',
  },
  {
    id: 'waterlogging',
    label: 'Waterlogging / Drainage Flooding',
    icon: CloudRain,
    description: 'Submerged underpass, drain overflow, hydraulic lock danger',
  },
  {
    id: 'road_damage',
    label: 'Severe Road Cave-In / Damage',
    icon: ShieldAlert,
    description: 'Structural road collapse, sinkhole, or utility trench damage',
  },
  {
    id: 'debris_hazard',
    label: 'Debris / Construction Obstruction',
    icon: Construction,
    description: 'Fallen tree, scaffolding rods, or construction spillage',
  },
];

const SAMPLE_FAULT_PHOTOS: { url: string; label: string; category: FaultCategory }[] = [
  {
    url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
    label: 'Heavy Vehicle Breakdown',
    category: 'traffic_blockage',
  },
  {
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    label: 'Bus Mechanical Failure',
    category: 'transit_breakdown',
  },
  {
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    label: 'Deep Road Crater',
    category: 'pothole',
  },
  {
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
    label: 'Underpass Waterlogging',
    category: 'waterlogging',
  },
  {
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    label: 'Signal Power Outage',
    category: 'signal_failure',
  },
];

export const ReportFaultModal: React.FC<ReportFaultModalProps> = ({
  activeCity,
  userLocation,
  existingFaults,
  onClose,
  onSubmitFault,
}) => {
  const [category, setCategory] = useState<FaultCategory>('traffic_blockage');
  const [severity, setSeverity] = useState<FaultSeverity>('HIGH');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [district, setDistrict] = useState<string>(activeCity.districts[1] || 'Central Business District');
  const [locationName, setLocationName] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>('Officer Sharma');
  const [reporterRole, setReporterRole] = useState<ReportedByRole>('field_officer');
  const [reporterContact, setReporterContact] = useState<string>('');
  const [affectedBusRoute, setAffectedBusRoute] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>(SAMPLE_FAULT_PHOTOS[0].url);
  const [useGpsCoords, setUseGpsCoords] = useState<boolean>(true);
  const [customLat, setCustomLat] = useState<number>(activeCity.centerCoords.lat);
  const [customLng, setCustomLng] = useState<number>(activeCity.centerCoords.lng);

  // AI Classification Preview state
  const [aiResult, setAiResult] = useState<AIClassificationResult | null>(null);
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Auto-fill coordinates if GPS is present
  useEffect(() => {
    if (userLocation && useGpsCoords) {
      setCustomLat(userLocation.latitude);
      setCustomLng(userLocation.longitude);
      if (!locationName) {
        setLocationName(`Near GPS Sector (${userLocation.latitude.toFixed(4)}°, ${userLocation.longitude.toFixed(4)}°)`);
      }
    } else {
      setCustomLat(activeCity.centerCoords.lat);
      setCustomLng(activeCity.centerCoords.lng);
    }
  }, [userLocation, useGpsCoords, activeCity]);

  // Debounced AI classification whenever title, description, category or severity changes
  useEffect(() => {
    if (!title && !description) {
      setAiResult(null);
      return;
    }

    setIsClassifying(true);
    const timer = setTimeout(() => {
      const result = runAIFaultClassification(
        title,
        description,
        category,
        severity,
        existingFaults
      );
      setAiResult(result);
      setIsClassifying(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [title, description, category, severity, existingFaults]);

  // Handle Photo selection from presets or simulated camera upload
  const handlePhotoSelect = (url: string, cat: FaultCategory) => {
    setImageUrl(url);
    setCategory(cat);
  };

  const handleSimulateCustomPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Create local object URL for preview
      const localUrl = URL.createObjectURL(e.target.files[0]);
      setImageUrl(localUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    const finalAI = aiResult || runAIFaultClassification(
      title,
      description,
      category,
      severity,
      existingFaults
    );

    // Compute approximate SVG map point (0-1000) for city visualizer
    const mapX = Math.round(200 + Math.random() * 600);
    const mapY = Math.round(200 + Math.random() * 600);

    const newFault: CityFault = {
      id: `FLT-${activeCity.id.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      cityId: activeCity.id,
      cityName: activeCity.name,
      district,
      title: title.trim(),
      description: description.trim() || 'Citizen reported urban hazard verified via intelligent sensor ingest.',
      category: finalAI.category,
      severity: finalAI.severity,
      status: 'REPORTED',
      priorityScore: finalAI.priorityScore,
      coords: { lat: customLat, lng: customLng },
      mapPoint: { x: mapX, y: mapY },
      locationName: locationName.trim() || `${district}, ${activeCity.name}`,
      reportedAt: 'Just now',
      reportedTimestamp: Date.now(),
      reportedBy: {
        name: reporterName.trim() || 'Anonymous Commuter',
        role: reporterRole,
        contact: reporterContact.trim() || 'Verified Mobile Device',
      },
      imageUrl,
      aiAnalysis: {
        confidence: finalAI.confidence,
        detectedElements: finalAI.detectedElements,
        estimatedDelayMins: finalAI.estimatedDelayMins,
        recommendedDepartment: finalAI.recommendedDepartment,
        duplicateCount: finalAI.duplicateWarning ? 1 : 0,
      },
      affectedBusRoutes: affectedBusRoute ? [affectedBusRoute.trim()] : undefined,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitFault(newFault);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl space-y-0 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-indigo-950/50 to-slate-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-bold text-white text-base">
                  Report Smart City Fault / Hazard
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {activeCity.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Location-based defect ingest • AI priority scoring & automated dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Reporter Role Selector */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-2">
              Who is reporting this incident?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'passenger', label: 'Passenger / Citizen', desc: 'Commuter App' },
                { id: 'driver', label: 'Transit Driver', desc: 'Bus Pilot' },
                { id: 'field_officer', label: 'Field Officer', desc: 'Traffic Warden' },
                { id: 'automated_ai_sensor', label: 'AI Sensor', desc: 'YOLOv8 Edge' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setReporterRole(item.id as ReportedByRole)}
                  className={`p-2.5 rounded-xl border text-left transition font-mono ${
                    reporterRole === item.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{item.label}</p>
                  <p className="text-[10px] opacity-70">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Fault Category Selection Grid */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-2">
              Fault / Problem Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {CATEGORY_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = category === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setCategory(opt.id)}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-400 text-indigo-100 shadow-md shadow-indigo-950/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg mt-0.5 flex-shrink-0 ${
                        isSelected
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold font-mono leading-snug">{opt.label}</p>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{opt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Problem Title & Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Incident Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken Down Double-Axle Truck Blocking Left Lanes on Main Arterial"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Detailed Description & Road Conditions
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe current impact: lane blockage, water depth, traffic queue length, affected public buses, or immediate safety hazards..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          {/* District & Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                City District / Zone
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              >
                {activeCity.districts
                  .filter((d) => d !== 'All Districts')
                  .map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Specific Location Landmark
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Near Silk Board Flyover Underpass"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
                <MapPin className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          {/* Location GPS & Severity Controls */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* GPS Telemetry Options */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  GPS Pinpoint Coordinates
                </span>
                <label className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useGpsCoords}
                    onChange={(e) => setUseGpsCoords(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Use Device GPS</span>
                </label>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 text-[11px]">
                  Lat: {customLat.toFixed(4)}°
                </div>
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 text-[11px]">
                  Lng: {customLng.toFixed(4)}°
                </div>
              </div>
              <p className="text-[10px] font-mono text-slate-500 mt-1">
                {userLocation ? `Acquired via HTML5 Geolocation (±${userLocation.accuracy}m)` : `Anchored to ${activeCity.name} Municipal Grid`}
              </p>
            </div>

            {/* Urgency / Severity */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                Initial Severity Assessment
              </label>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-[11px]">
                {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as FaultSeverity[]).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setSeverity(lvl)}
                    className={`py-1.5 rounded-lg border text-center font-bold transition ${
                      severity === lvl
                        ? lvl === 'CRITICAL'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : lvl === 'HIGH'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : lvl === 'MEDIUM'
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                          : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Optional Affected Bus Route */}
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={affectedBusRoute}
                  onChange={(e) => setAffectedBusRoute(e.target.value)}
                  placeholder="Affected Bus Route (e.g. 500-D, 335-E)"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Photo Attachment & Preset Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                Attach Photo Evidence (Uploaded or Select Preset)
              </label>
              <label className="cursor-pointer text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Upload From Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSimulateCustomPhoto}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SAMPLE_FAULT_PHOTOS.map((photo, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handlePhotoSelect(photo.url, photo.category)}
                  className={`group relative rounded-xl overflow-hidden border transition aspect-video sm:aspect-square ${
                    imageUrl === photo.url
                      ? 'border-cyan-400 ring-2 ring-cyan-500/40'
                      : 'border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.label}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[10px] font-mono text-white leading-tight font-medium">
                      {photo.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Real-Time AI / ML Classification & Priority Card */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white">
                  Edge AI/ML Hazard Assessment Engine
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-900/60 text-cyan-300 border border-indigo-700">
                YOLOv8 + NLP Road Classifier
              </span>
            </div>

            {isClassifying ? (
              <div className="py-4 flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Classifying incident severity and dispatch routing...</span>
              </div>
            ) : aiResult ? (
              <div className="space-y-2.5 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-indigo-900/60">
                    <span className="text-[10px] text-slate-400 block">AI Priority Score</span>
                    <span className="text-base font-bold text-cyan-300">
                      {aiResult.priorityScore} / 100
                    </span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-indigo-900/60">
                    <span className="text-[10px] text-slate-400 block">AI Confidence</span>
                    <span className="text-base font-bold text-emerald-400">
                      {aiResult.confidence}%
                    </span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-indigo-900/60">
                    <span className="text-[10px] text-slate-400 block">Est. Corridor Delay</span>
                    <span className="text-base font-bold text-amber-400">
                      +{aiResult.estimatedDelayMins} mins
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-indigo-900/60">
                  <span className="text-[10px] text-slate-400 block mb-1">
                    Automated Municipal Dispatch Routing:
                  </span>
                  <span className="text-xs text-indigo-200 font-semibold">
                    {aiResult.recommendedDepartment}
                  </span>
                </div>

                {aiResult.duplicateWarning && (
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>
                      Potential existing report detected in proximity. Report will be clustered to prevent dispatch redundancy.
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs font-mono text-slate-400">
                Type an incident title or description above to generate automated AI priority ranking, corridor impact, and municipal department routing.
              </p>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between flex-shrink-0">
          <p className="text-[11px] font-mono text-slate-500 hidden sm:block">
            Submitting will broadcast to {activeCity.name} Municipal Transit Ops & nearby commuters.
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting || !title.trim()}
              onClick={handleSubmit}
              className={`px-5 py-2.5 rounded-xl font-mono font-bold text-xs text-white shadow-lg transition-all flex items-center gap-2 ${
                isSubmitting || !title.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 hover:from-amber-500 hover:to-rose-500 shadow-rose-950/40 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting Fault Report...</span>
                </>
              ) : (
                <>
                  <span>Broadcast Fault Report</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
