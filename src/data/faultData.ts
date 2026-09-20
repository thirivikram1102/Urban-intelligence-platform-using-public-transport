import { CityData, CityFault, Coordinates, FaultCategory, FaultSeverity, ReportedByRole } from '../types';

export const SUPPORTED_CITIES: CityData[] = [
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    centerCoords: { lat: 12.9716, lng: 77.5946 },
    districts: [
      'All Districts',
      'Central Business District',
      'Koramangala & HSR Layout',
      'Whitefield & East Corridor',
      'Indiranagar & Old Airport Rd',
      'Electronic City & South',
      'Hebbal & North Gateway',
    ],
    activeFaultsCount: 19,
    congestionIndex: 72,
    transitDelayMins: 14,
    activeBuses: 38,
    zoomScale: 1.0,
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    centerCoords: { lat: 19.076, lng: 72.8777 },
    districts: [
      'All Districts',
      'South Mumbai & Fort',
      'Bandra-Kurla Complex (BKC)',
      'Andheri West & Lokhandwala',
      'Dadar & Central Mumbai',
      'Navi Mumbai & Vashi Corridor',
    ],
    activeFaultsCount: 23,
    congestionIndex: 81,
    transitDelayMins: 22,
    activeBuses: 44,
    zoomScale: 1.0,
  },
  {
    id: 'delhi',
    name: 'Delhi-NCR',
    state: 'National Capital Region',
    centerCoords: { lat: 28.6139, lng: 77.209 },
    districts: [
      'All Districts',
      'Connaught Place & Central',
      'South Extension & AIIMS Ring',
      'Cyber City & Gurugram Hub',
      'Noida Sector 62 & Expressway',
      'Rohini & North West',
    ],
    activeFaultsCount: 27,
    congestionIndex: 78,
    transitDelayMins: 18,
    activeBuses: 52,
    zoomScale: 1.0,
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    centerCoords: { lat: 17.385, lng: 78.4867 },
    districts: [
      'All Districts',
      'Hitec City & Madhapur',
      'Gachibowli Financial District',
      'Banjara Hills & Jubilee Hills',
      'Secunderabad Station Area',
      'Old City & Charminar',
    ],
    activeFaultsCount: 14,
    congestionIndex: 61,
    transitDelayMins: 11,
    activeBuses: 35,
    zoomScale: 1.0,
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    centerCoords: { lat: 18.5204, lng: 73.8567 },
    districts: [
      'All Districts',
      'Shivajinagar & FC Road',
      'Hinjewadi IT Corridor',
      'Kothrud & Karve Road',
      'Viman Nagar & Airport Road',
      'Hadapsar & Magarpatta',
    ],
    activeFaultsCount: 12,
    congestionIndex: 58,
    transitDelayMins: 9,
    activeBuses: 29,
    zoomScale: 1.0,
  },
  {
    id: 'tiruchirappalli',
    name: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    centerCoords: { lat: 10.7905, lng: 78.7047 },
    districts: [
      'All Districts',
      'Srirangam Island & North',
      'Thillai Nagar Commercial Hub',
      'Cantonment & Central Bus Stand',
      'Ponmalai (Golden Rock) & Railway',
      'K.K. Nagar & Airport Corridor',
      'Gandhi Market & Historic Core',
    ],
    activeFaultsCount: 14,
    congestionIndex: 59,
    transitDelayMins: 11,
    activeBuses: 28,
    zoomScale: 1.0,
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    centerCoords: { lat: 13.0827, lng: 80.2707 },
    districts: [
      'All Districts',
      'T. Nagar Commercial Core',
      'OMR IT Expressway',
      'Guindy Industrial Hub',
      'Anna Nagar West',
      'Central Station & Marina',
    ],
    activeFaultsCount: 16,
    congestionIndex: 64,
    transitDelayMins: 13,
    activeBuses: 33,
    zoomScale: 1.0,
  },
];

export const INITIAL_CITY_FAULTS: CityFault[] = [
  // TIRUCHIRAPPALLI & SRIRANGAM FAULTS
  {
    id: 'FLT-TRY-01',
    cityId: 'tiruchirappalli',
    cityName: 'Tiruchirappalli',
    district: 'Srirangam Island & North',
    title: 'Kaveri River Bridge Approach Road Severe Waterlogging & Traffic Choke',
    description:
      'Heavy flash rain caused 1.2ft water accumulation along Srirangam Kaveri North Bridge approach ramp near Mambalasalai. TNSTC Route 1 & 12 buses queued for 1.8km. Two-wheelers stalled.',
    category: 'waterlogging',
    severity: 'CRITICAL',
    status: 'INVESTIGATING',
    priorityScore: 96,
    coords: { lat: 10.8522, lng: 78.6946 },
    mapPoint: { x: 420, y: 310 },
    locationName: 'Mambalasalai Kaveri North Bridge Ramp, Srirangam',
    reportedAt: '12 mins ago',
    reportedTimestamp: Date.now() - 12 * 60 * 1000,
    reportedBy: {
      name: 'K. Murugan',
      role: 'driver',
      contact: 'TNSTC Driver #TR-01',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 98.2,
      detectedElements: ['Submerged carriage way: 45cm', 'Bus bottleneck queue', 'Heavy stormwater backflow'],
      estimatedDelayMins: 35,
      recommendedDepartment: 'Tiruchirappalli City Corporation Drainage Brigade & Traffic Police Unit',
      duplicateCount: 5,
    },
    assignedTeam: 'Trichy Municipal Suction Truck Squad 2',
    affectedBusRoutes: ['Route-1 (Chathiram - Srirangam)', 'Route-12', 'Route-102 (Airport - Srirangam)'],
  },
  {
    id: 'FLT-TRY-02',
    cityId: 'tiruchirappalli',
    cityName: 'Tiruchirappalli',
    district: 'Srirangam Island & North',
    title: 'Rajagopuram Ratha Veedhi Underground Pipeline Leak & Road Subsidence',
    description:
      'Water pipeline trench sank creating an active 35cm deep crater right on the primary tourist circumambulation street. Heavy temple pilgrim footfall and tourist van obstruction.',
    category: 'road_damage',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    priorityScore: 88,
    coords: { lat: 10.8622, lng: 78.6925 },
    mapPoint: { x: 440, y: 280 },
    locationName: 'South Chithirai Street near Rajagopuram, Srirangam',
    reportedAt: '38 mins ago',
    reportedTimestamp: Date.now() - 38 * 60 * 1000,
    reportedBy: {
      name: 'Dr. R. Senthamil',
      role: 'passenger',
      contact: 'Srirangam Commuter Forum',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 96.5,
      detectedElements: ['Trench pavement subsidence', 'Heritage pedestrian zone hazard', 'Utility line breach'],
      estimatedDelayMins: 20,
      recommendedDepartment: 'TWAD Board & Srirangam Municipal Engineering Ward 2',
      duplicateCount: 3,
    },
    assignedTeam: 'Srirangam Rapid Asphalt Patch Unit',
    resolutionNotes: 'Emergency steel plates installed over trench. Paver restoration underway.',
    affectedBusRoutes: ['Route-1 (Srirangam Loop)'],
  },
  {
    id: 'FLT-TRY-03',
    cityId: 'tiruchirappalli',
    cityName: 'Tiruchirappalli',
    district: 'Thillai Nagar Commercial Hub',
    title: 'Thillai Nagar Main Road 11th Cross Smart Traffic Signal Controller Crash',
    description:
      'Signal controller reboot loop causing all four phases to display flashing amber simultaneously. Gridlock at prime medical and commercial crossroads.',
    category: 'signal_failure',
    severity: 'HIGH',
    status: 'REPORTED',
    priorityScore: 84,
    coords: { lat: 10.8286, lng: 78.6865 },
    mapPoint: { x: 380, y: 480 },
    locationName: '11th Cross Junction, Thillai Nagar Main Road',
    reportedAt: '25 mins ago',
    reportedTimestamp: Date.now() - 25 * 60 * 1000,
    reportedBy: {
      name: 'Sub-Inspector Anbarasan',
      role: 'field_officer',
      contact: 'Trichy Traffic Police Control',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 95.8,
      detectedElements: ['Traffic light hardware fault', 'Intersection conflict risk', 'Manual cop intervention needed'],
      estimatedDelayMins: 18,
      recommendedDepartment: 'Trichy City Traffic Electronics Division & Smart City ICCC',
      duplicateCount: 2,
    },
    affectedBusRoutes: ['Route-26', 'Route-45B'],
  },
  {
    id: 'FLT-TRY-04',
    cityId: 'tiruchirappalli',
    cityName: 'Tiruchirappalli',
    district: 'Cantonment & Central Bus Stand',
    title: 'Heavy Inter-District Bus Engine Failure at Collectorate Roundabout',
    description:
      'Stalled SETC deluxe bus blocking two lanes of roundabout feeding Central Bus Stand. Heavy diesel spill across asphalt surface.',
    category: 'transit_breakdown',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    priorityScore: 89,
    coords: { lat: 10.8045, lng: 78.6834 },
    mapPoint: { x: 350, y: 580 },
    locationName: 'District Collectorate Roundabout, Cantonment',
    reportedAt: '19 mins ago',
    reportedTimestamp: Date.now() - 19 * 60 * 1000,
    reportedBy: {
      name: 'TNSTC Traffic Supervisor V. Raman',
      role: 'field_officer',
      contact: 'Central Depot Ops',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 97.1,
      detectedElements: ['Immobilized bus carriage', 'Hydraulic fluid slick', 'High volume commuter arterial'],
      estimatedDelayMins: 25,
      recommendedDepartment: 'SETC Mechanical Recovery Squad & Cantonment Traffic Police',
      duplicateCount: 4,
    },
    assignedTeam: 'Trichy Central Depot Heavy Tow Wrecker #01',
    affectedBusRoutes: ['All Inter-District Express Corridors', 'Town Route 1', 'Town Route 110'],
  },
  {
    id: 'FLT-TRY-05',
    cityId: 'tiruchirappalli',
    cityName: 'Tiruchirappalli',
    district: 'Ponmalai (Golden Rock) & Railway',
    title: 'Railway Level Crossing Road Pothole Cluster & Loose Ballast Stones',
    description:
      'Three consecutive deep craters adjacent to railway tracks on Ponmalai Workshop Link Road causing two-wheelers to slip and slow down transit.',
    category: 'pothole',
    severity: 'MEDIUM',
    status: 'REPORTED',
    priorityScore: 72,
    coords: { lat: 10.7853, lng: 78.7189 },
    mapPoint: { x: 620, y: 640 },
    locationName: 'Golden Rock Workshop Feeder Road, Ponmalai',
    reportedAt: '1 hour ago',
    reportedTimestamp: Date.now() - 60 * 60 * 1000,
    reportedBy: {
      name: 'Southern Railway Transit Watch',
      role: 'automated_ai_sensor',
      contact: 'Track Cam AI #04',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 94.2,
      detectedElements: ['Road crater 18cm depth', 'Pavement edge breakdown', 'Loose gravel skidding danger'],
      estimatedDelayMins: 12,
      recommendedDepartment: 'Highways Department & Railway Engineering Liaison',
      duplicateCount: 1,
    },
    affectedBusRoutes: ['Route-63', 'Route-82'],
  },
  // BENGALURU FAULTS
  {
    id: 'FLT-BLR-01',
    cityId: 'bengaluru',
    cityName: 'Bengaluru',
    district: 'Electronic City & South',
    title: 'Multi-Axle Concrete Truck Breakdown Blocking 2 Express Lanes',
    description:
      'Heavy vehicle axle snapped on Silk Board Flyover descending ramp toward BTM. Traffic backed up 2.4 km into HSR sector. BMTC feeder buses delayed by 25+ mins.',
    category: 'traffic_blockage',
    severity: 'CRITICAL',
    status: 'INVESTIGATING',
    priorityScore: 94,
    coords: { lat: 12.9176, lng: 77.6238 },
    mapPoint: { x: 480, y: 720 },
    locationName: 'Silk Board Flyover Descending Ramp, BTM Stage 2',
    reportedAt: '14 mins ago',
    reportedTimestamp: Date.now() - 14 * 60 * 1000,
    reportedBy: {
      name: 'Ramesh Gowda',
      role: 'driver',
      contact: 'BMTC Pilot #500-D',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 97.4,
      detectedElements: ['Heavy vehicle obstruction', 'Lane blockage: 66%', 'Severe tailback queue'],
      estimatedDelayMins: 28,
      recommendedDepartment: 'Traffic Police Zone South & Municipal Heavy Tow Ops',
      duplicateCount: 6,
    },
    assignedTeam: 'Traffic Rapid Tow Unit Bravo',
    affectedBusRoutes: ['500-D', '201-R', 'V-335', 'G-4'],
  },
  {
    id: 'FLT-BLR-02',
    cityId: 'bengaluru',
    cityName: 'Bengaluru',
    district: 'Koramangala & HSR Layout',
    title: 'Active BMTC Electric Bus Battery Traction Alert & Stall',
    description:
      'Bus KA-57-F-9120 suffered high temperature inverter fault at Sony World signal. Vehicle parked safely in curb lane, 45 passengers transshipped.',
    category: 'transit_breakdown',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    priorityScore: 86,
    coords: { lat: 12.9345, lng: 77.6265 },
    mapPoint: { x: 500, y: 560 },
    locationName: 'Sony World Junction, 80ft Road Koramangala 4th Block',
    reportedAt: '28 mins ago',
    reportedTimestamp: Date.now() - 28 * 60 * 1000,
    reportedBy: {
      name: 'Praveen Kumar',
      role: 'field_officer',
      contact: 'BMTC Control Room',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 98.8,
      detectedElements: ['Public transit mechanical fault', 'Curb passenger evacuation', 'Route frequency dip'],
      estimatedDelayMins: 15,
      recommendedDepartment: 'BMTC Depot 25 Mobile EV Workshop',
      duplicateCount: 2,
    },
    assignedTeam: 'Depot 25 EV Response Team',
    affectedBusRoutes: ['201-R', '171-A'],
  },
  {
    id: 'FLT-BLR-03',
    cityId: 'bengaluru',
    cityName: 'Bengaluru',
    district: 'Indiranagar & Old Airport Rd',
    title: '4-Way Intelligent Traffic Signal Controller Blackout',
    description:
      'Traffic light signals blinking red following transformer surge at CMH Road and 100ft road intersection. High collision risk during evening commute peak.',
    category: 'signal_failure',
    severity: 'CRITICAL',
    status: 'REPORTED',
    priorityScore: 91,
    coords: { lat: 12.9784, lng: 77.6408 },
    mapPoint: { x: 580, y: 320 },
    locationName: '100ft Road x CMH Road Intersection, Indiranagar',
    reportedAt: '6 mins ago',
    reportedTimestamp: Date.now() - 6 * 60 * 1000,
    reportedBy: {
      name: 'Siddharth M.',
      role: 'passenger',
      contact: 'Citizen App User',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 95.2,
      detectedElements: ['Signal power outage', 'Intersection dead-lock', 'High collision probability'],
      estimatedDelayMins: 20,
      recommendedDepartment: 'BESCOM Urban Power & BTP Signals Division',
      duplicateCount: 4,
    },
    assignedTeam: 'BTP Emergency Traffic Warden Sq. 4',
    affectedBusRoutes: ['335-E', 'V-335'],
  },
  {
    id: 'FLT-BLR-04',
    cityId: 'bengaluru',
    cityName: 'Bengaluru',
    district: 'Whitefield & East Corridor',
    title: 'Deep 18cm Road Cavity & Exposed Rebar Hazard',
    description:
      'Severe pothole spanning 1.8 sq. meters outside ITPL Gate 2. Multiple two-wheelers suffered rim damage. Slowing bus corridor speeds to under 10 km/h.',
    category: 'pothole',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    priorityScore: 82,
    coords: { lat: 12.985, lng: 77.731 },
    mapPoint: { x: 860, y: 260 },
    locationName: 'ITPL Main Road, Opposite Gate 2, Whitefield',
    reportedAt: '42 mins ago',
    reportedTimestamp: Date.now() - 42 * 60 * 1000,
    reportedBy: {
      name: 'Automated YOLOv8 Dashcam',
      role: 'automated_ai_sensor',
      contact: 'Bus #335-E Telemetry',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 96.9,
      detectedElements: ['Deep crater >15cm', 'Exposed metal rebar', 'High rim shock impact'],
      estimatedDelayMins: 12,
      recommendedDepartment: 'BBMP Major Roads Infrastructure Division',
      duplicateCount: 9,
    },
    assignedTeam: 'BBMP Mahadevapura Pothole Squad',
    affectedBusRoutes: ['335-E', '500-D'],
  },
  {
    id: 'FLT-BLR-05',
    cityId: 'bengaluru',
    cityName: 'Bengaluru',
    district: 'Hebbal & North Gateway',
    title: 'Flash Waterlogging 30cm Under Flyover Loop After Cloudburst',
    description:
      'Stormwater drain blocked by construction silt under Hebbal Esteem Mall underpass. Submerged left 2 lanes causing 3 km airport corridor tailback.',
    category: 'waterlogging',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    priorityScore: 89,
    coords: { lat: 13.0358, lng: 77.597 },
    mapPoint: { x: 360, y: 120 },
    locationName: 'Hebbal Esteem Underpass Loop, Bellary Road',
    reportedAt: '19 mins ago',
    reportedTimestamp: Date.now() - 19 * 60 * 1000,
    reportedBy: {
      name: 'Inspector Ananya Roy',
      role: 'field_officer',
      contact: 'BTP North Sector',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 94.6,
      detectedElements: ['Water depth: 30cm', 'Hydraulic lock hazard for small vehicles', 'Airport transit bottleneck'],
      estimatedDelayMins: 35,
      recommendedDepartment: 'BWSSB Stormwater Drain & Disaster Response Unit',
      duplicateCount: 8,
    },
    assignedTeam: 'Disaster High-Power Pump Unit 2',
    affectedBusRoutes: ['500-D', 'G-4'],
  },
  {
    id: 'FLT-BLR-06',
    cityId: 'bengaluru',
    cityName: 'Bengaluru',
    district: 'Central Business District',
    title: 'Fallen Metro Construction Scaffolding Pipe Debris',
    description:
      'Steel scaffolding rods fell into bus lane during overhead metro girder maintenance near MG Road metro station. Road cordon created by wardens.',
    category: 'debris_hazard',
    severity: 'HIGH',
    status: 'RESOLVED',
    priorityScore: 78,
    coords: { lat: 12.9756, lng: 77.6066 },
    mapPoint: { x: 380, y: 360 },
    locationName: 'MG Road Metro Station West Gate',
    reportedAt: '1 hr 10 mins ago',
    reportedTimestamp: Date.now() - 70 * 60 * 1000,
    reportedBy: {
      name: 'Karthik Rao',
      role: 'passenger',
      contact: 'Metro commuter',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 98.1,
      detectedElements: ['Metallic debris obstruction', 'Pedestrian hazard zone', 'Bus lane blocked'],
      estimatedDelayMins: 8,
      recommendedDepartment: 'BMRCL Metro Safety & BBMP East Core',
    },
    assignedTeam: 'BMRCL Emergency Civil Response',
    resolutionNotes: 'All steel pipes cleared from roadway and stored in barricaded yard. Normal traffic restored.',
    resolvedAt: '15 mins ago',
  },

  // MUMBAI FAULTS
  {
    id: 'FLT-BOM-01',
    cityId: 'mumbai',
    cityName: 'Mumbai',
    district: 'Bandra-Kurla Complex (BKC)',
    title: 'Water Main Line Rupture Causing Sinkhole & Massive BKC Gridlock',
    description:
      'Major 600mm potable water pipe burst outside Diamond Bourse. Road foundation caved in 40cm. BKC connector to Eastern Express Highway halted.',
    category: 'road_damage',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    priorityScore: 96,
    coords: { lat: 19.0657, lng: 72.8687 },
    mapPoint: { x: 520, y: 440 },
    locationName: 'BKC Connector Junction near Bharat Diamond Bourse',
    reportedAt: '22 mins ago',
    reportedTimestamp: Date.now() - 22 * 60 * 1000,
    reportedBy: {
      name: 'BEST Supervisor Mhatre',
      role: 'field_officer',
      contact: 'BEST Control Hub',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 99.2,
      detectedElements: ['Water main rupture', 'Asphalt structural cave-in', 'Corporate transit gridlock'],
      estimatedDelayMins: 45,
      recommendedDepartment: 'MCGM Hydraulic Engineering & MMRDA',
      duplicateCount: 14,
    },
    assignedTeam: 'MCGM Emergency Pipe Brigade',
    affectedBusRoutes: ['BEST C-40', 'BEST 310', 'BEST AS-4'],
  },
  {
    id: 'FLT-BOM-02',
    cityId: 'mumbai',
    cityName: 'Mumbai',
    district: 'Andheri West & Lokhandwala',
    title: 'Double Decker Electric AC Bus Steering Hydraulics Delay',
    description:
      'BEST Route A-202 stalled right before Andheri SV Road underpass. Commuters safely transferred to subsequent frequency. Severe bottleneck on SV road.',
    category: 'transit_breakdown',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    priorityScore: 84,
    coords: { lat: 19.1197, lng: 72.8468 },
    mapPoint: { x: 380, y: 310 },
    locationName: 'SV Road Junction, near Andheri Subway',
    reportedAt: '35 mins ago',
    reportedTimestamp: Date.now() - 35 * 60 * 1000,
    reportedBy: {
      name: 'Sunil Parab',
      role: 'driver',
      contact: 'BEST Depot Pilot',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 96.5,
      detectedElements: ['Electric bus hydraulic failure', 'Underpass approach blocked', 'High density artery'],
      estimatedDelayMins: 22,
      recommendedDepartment: 'BEST Dindoshi Workshop & Mumbai Traffic Police',
    },
    assignedTeam: 'BEST Recovery Vehicle 08',
  },
  {
    id: 'FLT-BOM-03',
    cityId: 'mumbai',
    cityName: 'Mumbai',
    district: 'South Mumbai & Fort',
    title: 'Crumbling Heritage Stone Curb Blocks Marine Drive Walkway & Lane',
    description:
      'Section of historic stone masonry along Marine Drive sea-face dislodged by tidal surge. 1 outer northbound lane barricaded for safety.',
    category: 'debris_hazard',
    severity: 'MEDIUM',
    status: 'REPORTED',
    priorityScore: 71,
    coords: { lat: 18.9438, lng: 72.8234 },
    mapPoint: { x: 260, y: 680 },
    locationName: 'Marine Drive Promenade near Air India Building',
    reportedAt: '50 mins ago',
    reportedTimestamp: Date.now() - 50 * 60 * 1000,
    reportedBy: {
      name: 'Deepak Merchant',
      role: 'passenger',
      contact: 'Resident Citizen',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 92.4,
      detectedElements: ['Masonry debris', 'Single lane restriction', 'Pedestrian hazard'],
      estimatedDelayMins: 10,
      recommendedDepartment: 'MCGM A-Ward Heritage Works',
    },
  },

  // DELHI-NCR FAULTS
  {
    id: 'FLT-DEL-01',
    cityId: 'delhi',
    cityName: 'Delhi-NCR',
    district: 'Cyber City & Gurugram Hub',
    title: 'Underpass Drainage Pump Failure Causing 45cm Water Logging',
    description:
      'DLF Cyber City Phase 2 underpass submerged following heavy morning downpour. Multiple sedans stranded. Rapid transit shuttle suspended.',
    category: 'waterlogging',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    priorityScore: 95,
    coords: { lat: 28.4947, lng: 77.0894 },
    mapPoint: { x: 340, y: 680 },
    locationName: 'Cyber City DLF Phase 2 Underpass, Gurugram',
    reportedAt: '18 mins ago',
    reportedTimestamp: Date.now() - 18 * 60 * 1000,
    reportedBy: {
      name: 'Gurugram Traffic Marshal',
      role: 'field_officer',
      contact: 'GMDA Traffic Cell',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 98.7,
      detectedElements: ['Severe underpass flooding >40cm', 'Stranded light vehicles', 'Total arterial shutdown'],
      estimatedDelayMins: 40,
      recommendedDepartment: 'GMDA Stormwater Division & Gurugram Police',
      duplicateCount: 18,
    },
    assignedTeam: 'GMDA Heavy Suction Pumps 1 & 4',
  },
  {
    id: 'FLT-DEL-02',
    cityId: 'delhi',
    cityName: 'Delhi-NCR',
    district: 'Connaught Place & Central',
    title: 'Asphalt Road Subsidence Crater on Radial Road 3',
    description:
      'Circular road crater 2.1m wide formed over old utility trench outside KG Marg radial. Ring traffic diverted into inner circle.',
    category: 'road_damage',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    priorityScore: 88,
    coords: { lat: 28.6315, lng: 77.2197 },
    mapPoint: { x: 500, y: 350 },
    locationName: 'Radial Road 3 toward KG Marg, Connaught Place',
    reportedAt: '30 mins ago',
    reportedTimestamp: Date.now() - 30 * 60 * 1000,
    reportedBy: {
      name: 'Vipin Sharma',
      role: 'driver',
      contact: 'DTC Route 73 Pilot',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 97.1,
      detectedElements: ['Road subsidence', 'Deep foundation depression', 'High volume commuter impact'],
      estimatedDelayMins: 18,
      recommendedDepartment: 'NDMC Civil Infrastructure & Traffic Division',
    },
    assignedTeam: 'NDMC Rapid Patch Unit 03',
  },
  {
    id: 'FLT-DEL-03',
    cityId: 'delhi',
    cityName: 'Delhi-NCR',
    district: 'Noida Sector 62 & Expressway',
    title: 'Electronic Toll & Fastag Reader Matrix Breakdown',
    description:
      'Server connection dropped at 6 toll gantries entering Noida Expressway. Massive 3km tailback with vehicles forced into manual cash lanes.',
    category: 'traffic_blockage',
    severity: 'HIGH',
    status: 'REPORTED',
    priorityScore: 85,
    coords: { lat: 28.628, lng: 77.3649 },
    mapPoint: { x: 780, y: 480 },
    locationName: 'Noida-Greater Noida Expressway Toll Plaza',
    reportedAt: '12 mins ago',
    reportedTimestamp: Date.now() - 12 * 60 * 1000,
    reportedBy: {
      name: 'Pooja Agarwal',
      role: 'passenger',
      contact: 'Commuter App',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 96.0,
      detectedElements: ['Toll reader offline', 'Manual queue backup', 'Intercity highway slowdown'],
      estimatedDelayMins: 25,
      recommendedDepartment: 'NHAI ITS Division & Noida Authority',
    },
  },

  // HYDERABAD FAULTS
  {
    id: 'FLT-HYD-01',
    cityId: 'hyderabad',
    cityName: 'Hyderabad',
    district: 'Hitec City & Madhapur',
    title: 'Metro Feeder Bus Breakdown at Mindspace Rotary',
    description:
      'TSRTC Electric bus stalled at Mindspace circle bottleneck blocking 2 connecting flyover ramps to Inorbit Mall.',
    category: 'transit_breakdown',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    priorityScore: 87,
    coords: { lat: 17.4435, lng: 78.3772 },
    mapPoint: { x: 360, y: 390 },
    locationName: 'Mindspace Junction Rotary, Madhapur',
    reportedAt: '24 mins ago',
    reportedTimestamp: Date.now() - 24 * 60 * 1000,
    reportedBy: {
      name: 'TSRTC Officer Venkat',
      role: 'field_officer',
      contact: 'Cyberabad Transit Control',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 97.9,
      detectedElements: ['Public transit blockage', 'Rotary choke point', 'Tech corridor delay'],
      estimatedDelayMins: 20,
      recommendedDepartment: 'TSRTC Cyberabad Mobile Recovery & Cyberabad Police',
    },
    assignedTeam: 'TSRTC Heavy Tow 03',
  },
  {
    id: 'FLT-HYD-02',
    cityId: 'hyderabad',
    cityName: 'Hyderabad',
    district: 'Gachibowli Financial District',
    title: 'Optical Fiber Trench Settlement Pothole Swarm',
    description:
      'Un-compacted telecom fiber optic trench settled 12cm across 3 lanes near WaveRock building. Severe chassis bumping reported.',
    category: 'pothole',
    severity: 'MEDIUM',
    status: 'INVESTIGATING',
    priorityScore: 74,
    coords: { lat: 17.4172, lng: 78.3431 },
    mapPoint: { x: 280, y: 550 },
    locationName: 'Financial District Main Road, near WaveRock SEZ',
    reportedAt: '48 mins ago',
    reportedTimestamp: Date.now() - 48 * 60 * 1000,
    reportedBy: {
      name: 'Suresh Reddy',
      role: 'driver',
      contact: 'Cab Partner',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      confidence: 93.8,
      detectedElements: ['Linear trench subsidence', 'Sharp edge impact', 'Moderate lane delay'],
      estimatedDelayMins: 10,
      recommendedDepartment: 'GHMC Serilingampally Engineering Division',
    },
  },
];

// Haversine distance calculator between two GPS coordinates (in kilometers)
export function calculateDistanceKm(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(2);
}

// Identify closest smart city given GPS coordinates
export function detectClosestCity(userCoords: Coordinates): CityData {
  let closest = SUPPORTED_CITIES[0];
  let minDistance = Infinity;

  for (const city of SUPPORTED_CITIES) {
    const dist = calculateDistanceKm(userCoords, city.centerCoords);
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  }

  return closest;
}

// AI Fault Classifier & Priority Assessor (client-side Edge AI simulation with real heuristic weights)
export interface AIClassificationResult {
  category: FaultCategory;
  severity: FaultSeverity;
  priorityScore: number;
  confidence: number;
  detectedElements: string[];
  estimatedDelayMins: number;
  recommendedDepartment: string;
  duplicateWarning?: boolean;
}

export function runAIFaultClassification(
  title: string,
  description: string,
  chosenCategory: FaultCategory,
  chosenSeverity: FaultSeverity,
  existingFaults: CityFault[]
): AIClassificationResult {
  const text = `${title} ${description}`.toLowerCase();

  // Keyword weighted detection
  let detectedCategory = chosenCategory;
  if (text.includes('pothole') || text.includes('crater') || text.includes('road cave')) {
    detectedCategory = 'pothole';
  } else if (text.includes('waterlog') || text.includes('flooding') || text.includes('drain') || text.includes('submerged')) {
    detectedCategory = 'waterlogging';
  } else if (text.includes('breakdown') || text.includes('engine') || text.includes('bmtc') || text.includes('best bus') || text.includes('stalled bus')) {
    detectedCategory = 'transit_breakdown';
  } else if (text.includes('signal') || text.includes('traffic light') || text.includes('blackout') || text.includes('blinking red')) {
    detectedCategory = 'signal_failure';
  } else if (text.includes('debris') || text.includes('tree fallen') || text.includes('scaffolding') || text.includes('stone')) {
    detectedCategory = 'debris_hazard';
  } else if (text.includes('jam') || text.includes('block') || text.includes('truck') || text.includes('accident')) {
    detectedCategory = 'traffic_blockage';
  }

  // Severity and Priority calculation
  let severityScore = 60;
  if (chosenSeverity === 'CRITICAL' || text.includes('severe') || text.includes('danger') || text.includes('deadlock') || text.includes('hospital') || text.includes('flyover')) {
    severityScore = 92;
  } else if (chosenSeverity === 'HIGH' || text.includes('major') || text.includes('delay') || text.includes('rim damage')) {
    severityScore = 82;
  } else if (chosenSeverity === 'MEDIUM') {
    severityScore = 68;
  } else {
    severityScore = 48;
  }

  const confidence = +(93 + Math.random() * 5.8).toFixed(1);

  // Department recommendation
  let dept = 'Municipal Roads & Infrastructure Maintenance';
  if (detectedCategory === 'traffic_blockage' || detectedCategory === 'signal_failure') {
    dept = 'City Traffic Police & Automated Signal Operations Cell';
  } else if (detectedCategory === 'transit_breakdown') {
    dept = 'Metropolitan Transport Corporation & Rapid EV Recovery Unit';
  } else if (detectedCategory === 'waterlogging') {
    dept = 'Water Supply & Stormwater Sewerage Emergency Brigade';
  } else if (detectedCategory === 'debris_hazard') {
    dept = 'Disaster Management & Municipal Solid Waste Quick Response';
  }

  // Estimated transit delay impact in minutes
  const estimatedDelay = severityScore > 85 ? Math.round(20 + Math.random() * 20) : Math.round(8 + Math.random() * 10);

  // Check duplicate reports in proximity
  const duplicate = existingFaults.some(
    (f) => f.title.toLowerCase().includes(title.toLowerCase().slice(0, 10)) && f.status !== 'RESOLVED'
  );

  return {
    category: detectedCategory,
    severity: severityScore >= 90 ? 'CRITICAL' : severityScore >= 78 ? 'HIGH' : severityScore >= 60 ? 'MEDIUM' : 'LOW',
    priorityScore: severityScore,
    confidence,
    detectedElements: [
      `AI Vision Match: ${detectedCategory.replace('_', ' ').toUpperCase()}`,
      `Risk Assessment Score: ${severityScore}/100`,
      `Commuter Impact: ${estimatedDelay} min expected corridor friction`,
    ],
    estimatedDelayMins: estimatedDelay,
    recommendedDepartment: dept,
    duplicateWarning: duplicate,
  };
}
