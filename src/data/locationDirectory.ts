import { Coordinates } from '../types';

export interface TownInfo {
  name: string;
  coords: Coordinates;
  taluk?: string;
  zone?: string;
}

export interface DistrictInfo {
  name: string;
  state: string;
  centerCoords: Coordinates;
  towns: TownInfo[];
}

export interface StateInfo {
  name: string;
  districts: DistrictInfo[];
}

export const INDIAN_LOCATIONS_DIRECTORY: StateInfo[] = [
  {
    name: 'Tamil Nadu',
    districts: [
      {
        name: 'Tiruchirappalli',
        state: 'Tamil Nadu',
        centerCoords: { lat: 10.7905, lng: 78.7047 },
        towns: [
          { name: 'Srirangam', coords: { lat: 10.8622, lng: 78.6946 }, taluk: 'Srirangam', zone: 'North Zone' },
          { name: 'Thillai Nagar', coords: { lat: 10.8286, lng: 78.6865 }, taluk: 'Tiruchirappalli West', zone: 'West Zone' },
          { name: 'Cantonment', coords: { lat: 10.8045, lng: 78.6834 }, taluk: 'Tiruchirappalli West', zone: 'Central Zone' },
          { name: 'Ponmalai (Golden Rock)', coords: { lat: 10.7853, lng: 78.7189 }, taluk: 'Tiruchirappalli East', zone: 'East Zone' },
          { name: 'K.K. Nagar', coords: { lat: 10.7712, lng: 78.7001 }, taluk: 'Tiruchirappalli East', zone: 'South Zone' },
          { name: 'Palakkarai', coords: { lat: 10.8123, lng: 78.6987 }, taluk: 'Tiruchirappalli East', zone: 'Central Zone' },
          { name: 'Woraiyur', coords: { lat: 10.8354, lng: 78.6751 }, taluk: 'Tiruchirappalli West', zone: 'Historic Core' },
          { name: 'Lalgudi', coords: { lat: 10.8698, lng: 78.8145 }, taluk: 'Lalgudi', zone: 'Outer North' },
          { name: 'Manapparai', coords: { lat: 10.6074, lng: 78.4191 }, taluk: 'Manapparai', zone: 'Outer South' },
          { name: 'Thiruverumbur', coords: { lat: 10.7681, lng: 78.7842 }, taluk: 'Thiruverumbur', zone: 'BHEL Industrial Belt' },
        ],
      },
      {
        name: 'Chennai',
        state: 'Tamil Nadu',
        centerCoords: { lat: 13.0827, lng: 80.2707 },
        towns: [
          { name: 'T. Nagar', coords: { lat: 13.0418, lng: 80.2341 } },
          { name: 'Adyar', coords: { lat: 13.0012, lng: 80.2565 } },
          { name: 'Mylapore', coords: { lat: 13.0368, lng: 80.2676 } },
          { name: 'Anna Nagar', coords: { lat: 13.085, lng: 80.2101 } },
          { name: 'Guindy', coords: { lat: 13.0067, lng: 80.2026 } },
          { name: 'Velachery', coords: { lat: 12.9815, lng: 80.218 } },
          { name: 'Tambaram', coords: { lat: 12.9249, lng: 80.1275 } },
          { name: 'Thiruvanmiyur', coords: { lat: 12.983, lng: 80.2594 } },
        ],
      },
      {
        name: 'Coimbatore',
        state: 'Tamil Nadu',
        centerCoords: { lat: 11.0168, lng: 76.9558 },
        towns: [
          { name: 'Gandhipuram', coords: { lat: 11.0183, lng: 76.9644 } },
          { name: 'RS Puram', coords: { lat: 11.0093, lng: 76.9467 } },
          { name: 'Peelamedu', coords: { lat: 11.0315, lng: 77.0145 } },
          { name: 'Saravanampatti', coords: { lat: 11.0805, lng: 76.9942 } },
          { name: 'Singanallur', coords: { lat: 10.9992, lng: 77.025 } },
        ],
      },
      {
        name: 'Madurai',
        state: 'Tamil Nadu',
        centerCoords: { lat: 9.9252, lng: 78.1198 },
        towns: [
          { name: 'Meenakshi Temple Area', coords: { lat: 9.9195, lng: 78.1193 } },
          { name: 'KK Nagar', coords: { lat: 9.9328, lng: 78.1481 } },
          { name: 'Anna Nagar', coords: { lat: 9.9234, lng: 78.1561 } },
          { name: 'Goripalayam', coords: { lat: 9.9317, lng: 78.1311 } },
        ],
      },
    ],
  },
  {
    name: 'Karnataka',
    districts: [
      {
        name: 'Bengaluru Urban',
        state: 'Karnataka',
        centerCoords: { lat: 12.9716, lng: 77.5946 },
        towns: [
          { name: 'Koramangala', coords: { lat: 12.9352, lng: 77.6245 } },
          { name: 'Indiranagar', coords: { lat: 12.9784, lng: 77.6408 } },
          { name: 'Whitefield', coords: { lat: 12.9698, lng: 77.75 } },
          { name: 'HSR Layout', coords: { lat: 12.9121, lng: 77.6446 } },
          { name: 'Electronic City', coords: { lat: 12.8452, lng: 77.6602 } },
          { name: 'Jayanagar', coords: { lat: 12.9308, lng: 77.5838 } },
          { name: 'Yelahanka', coords: { lat: 13.1007, lng: 77.5963 } },
          { name: 'Hebbal', coords: { lat: 13.0358, lng: 77.597 } },
        ],
      },
      {
        name: 'Mysuru',
        state: 'Karnataka',
        centerCoords: { lat: 12.2958, lng: 76.6394 },
        towns: [
          { name: 'Gokulam', coords: { lat: 12.3275, lng: 76.6264 } },
          { name: 'Vijayanagar', coords: { lat: 12.3382, lng: 76.6025 } },
          { name: 'Kuvempunagar', coords: { lat: 12.2882, lng: 76.6234 } },
          { name: 'Jayalakshmipuram', coords: { lat: 12.3168, lng: 76.6248 } },
        ],
      },
    ],
  },
  {
    name: 'Maharashtra',
    districts: [
      {
        name: 'Mumbai Suburban',
        state: 'Maharashtra',
        centerCoords: { lat: 19.076, lng: 72.8777 },
        towns: [
          { name: 'Bandra', coords: { lat: 19.0596, lng: 72.8295 } },
          { name: 'Andheri West', coords: { lat: 19.1363, lng: 72.8277 } },
          { name: 'Juhu', coords: { lat: 19.1075, lng: 72.8263 } },
          { name: 'Borivali', coords: { lat: 19.2307, lng: 72.8567 } },
          { name: 'Powai', coords: { lat: 19.1176, lng: 72.906 } },
        ],
      },
      {
        name: 'Pune',
        state: 'Maharashtra',
        centerCoords: { lat: 18.5204, lng: 73.8567 },
        towns: [
          { name: 'Shivajinagar', coords: { lat: 18.5314, lng: 73.8446 } },
          { name: 'Hinjewadi', coords: { lat: 18.5913, lng: 73.7389 } },
          { name: 'Kothrud', coords: { lat: 18.5074, lng: 73.8077 } },
          { name: 'Viman Nagar', coords: { lat: 18.5679, lng: 73.9143 } },
          { name: 'Hadapsar', coords: { lat: 18.5089, lng: 73.926 } },
        ],
      },
    ],
  },
  {
    name: 'Delhi NCR',
    districts: [
      {
        name: 'New Delhi',
        state: 'Delhi NCR',
        centerCoords: { lat: 28.6139, lng: 77.209 },
        towns: [
          { name: 'Connaught Place', coords: { lat: 28.6304, lng: 77.2177 } },
          { name: 'Hauz Khas', coords: { lat: 28.5494, lng: 77.2001 } },
          { name: 'Saket', coords: { lat: 28.5244, lng: 77.2177 } },
          { name: 'Vasant Kunj', coords: { lat: 28.5244, lng: 77.1557 } },
          { name: 'Lajpat Nagar', coords: { lat: 28.5708, lng: 77.2435 } },
        ],
      },
      {
        name: 'Gurugram',
        state: 'Haryana (NCR)',
        centerCoords: { lat: 28.4595, lng: 77.0266 },
        towns: [
          { name: 'Cyber City', coords: { lat: 28.4952, lng: 77.0895 } },
          { name: 'Golf Course Road', coords: { lat: 28.4614, lng: 77.1009 } },
          { name: 'Sohna Road', coords: { lat: 28.4116, lng: 77.0425 } },
        ],
      },
    ],
  },
  {
    name: 'Telangana',
    districts: [
      {
        name: 'Hyderabad',
        state: 'Telangana',
        centerCoords: { lat: 17.385, lng: 78.4867 },
        towns: [
          { name: 'Banjara Hills', coords: { lat: 17.4156, lng: 78.4357 } },
          { name: 'Hitec City / Madhapur', coords: { lat: 17.4435, lng: 78.3772 } },
          { name: 'Gachibowli', coords: { lat: 17.4401, lng: 78.3489 } },
          { name: 'Secunderabad', coords: { lat: 17.4399, lng: 78.4983 } },
          { name: 'Charminar Core', coords: { lat: 17.3616, lng: 78.4747 } },
        ],
      },
    ],
  },
];

// Flat list helper of all districts
export const ALL_DISTRICTS: DistrictInfo[] = INDIAN_LOCATIONS_DIRECTORY.flatMap(
  (s) => s.districts
);

// Calculate distance
export function calculateSpatialDistanceKm(
  c1: Coordinates,
  c2: Coordinates
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
  const dLon = ((c2.lng - c1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1.lat * Math.PI) / 180) *
      Math.cos((c2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(2);
}

// Find nearest District and Town using built-in high precision spatial database
export function findNearestDistrictAndTown(coords: Coordinates): {
  district: DistrictInfo;
  town: TownInfo;
  distanceKm: number;
} {
  let closestDistrict = ALL_DISTRICTS[0];
  let closestTown = closestDistrict.towns[0];
  let minDistance = Infinity;

  for (const dist of ALL_DISTRICTS) {
    for (const town of dist.towns) {
      const d = calculateSpatialDistanceKm(coords, town.coords);
      if (d < minDistance) {
        minDistance = d;
        closestDistrict = dist;
        closestTown = town;
      }
    }
  }

  return {
    district: closestDistrict,
    town: closestTown,
    distanceKm: minDistance,
  };
}

// Live Reverse Geocoding with OpenStreetMap Nominatim and Instant Fallback
export async function reverseGeocodeCoordinates(coords: Coordinates): Promise<{
  state: string;
  district: string;
  town: string;
  displayName: string;
  source: 'osm_nominatim' | 'spatial_directory';
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=14&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'UrbanAI-SmartCityPlatform/3.4',
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const state = addr.state || 'Tamil Nadu';

      // District candidate resolution
      const district =
        addr.state_district ||
        addr.county ||
        addr.district ||
        addr.city_district ||
        addr.city ||
        'Tiruchirappalli';

      // Town / Suburb / Locality resolution
      const town =
        addr.suburb ||
        addr.town ||
        addr.neighbourhood ||
        addr.residential ||
        addr.village ||
        addr.city ||
        'Srirangam';

      return {
        state,
        district: cleanDistrictName(district),
        town: cleanTownName(town),
        displayName: data.display_name || `${town}, ${district}, ${state}`,
        source: 'osm_nominatim',
      };
    }
  } catch (err) {
    // Network timeout, CORS or offline: seamless fallback to internal spatial directory
  }

  // Fallback to spatial directory lookup
  const nearest = findNearestDistrictAndTown(coords);
  return {
    state: nearest.district.state,
    district: nearest.district.name,
    town: nearest.town.name,
    displayName: `${nearest.town.name}, ${nearest.district.name}, ${nearest.district.state}`,
    source: 'spatial_directory',
  };
}

function cleanDistrictName(raw: string): string {
  return raw
    .replace(/\s+District$/i, '')
    .replace(/\s+Division$/i, '')
    .trim();
}

function cleanTownName(raw: string): string {
  return raw.replace(/\s+Taluk$/i, '').trim();
}
