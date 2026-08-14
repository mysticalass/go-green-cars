export type FuelType = 'Electric' | 'Petrol' | 'Diesel' | 'Hybrid';

export type NavTab = 'cars' | 'rates' | 'locations' | 'carparks' | 'sustainability';

export interface CarparkItem {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string;
  AvailableLots: number;
  LotType: 'C' | 'H' | 'Y' | string;
  Agency: 'HDB' | 'LTA' | 'URA' | string;
  lat?: number;
  lng?: number;
  hasEvCharging?: boolean;
  totalLotsEstimated?: number;
  occupancyPercent?: number;
}

export type VehicleType = 'SUV' | 'Sedan' | 'Van' | 'MPV' | 'Hatchback' | 'Station wagon';

export type VehicleCategory = 
  | 'Select Electric'
  | 'Plus Electric'
  | 'Commercial Electric'
  | 'Standard Electric'
  | 'Luxury'
  | 'Grand'
  | 'Plus'
  | 'Select'
  | 'Standard'
  | 'Economy';

export interface Vehicle {
  id: string;
  name: string;
  subtitle?: string;
  brand: string;
  vehicleType: VehicleType;
  category: VehicleCategory;
  fuelType: FuelType;
  seats: number;
  image: string;
  rangeKm: number;
  batteryCapacityKwh: number;
  currentBatteryPercent: number;
  powerHp: number;
  hourlyRateOffPeak: number;
  hourlyRatePeak: number;
  dailyRate: number;
  mileageRatePerKm: number;
  co2SavedPerKmKg: number;
  location: string;
  area: 'Central' | 'East' | 'West' | 'North' | 'North-East';
  chargingSpeedKw: number;
  features: string[];
  plateNumber: string;
  isAvailable: boolean;
  chargingNetwork: string;
}

export interface FilterState {
  fuelTypes: FuelType[];
  vehicleTypes: VehicleType[];
  categories: VehicleCategory[];
  brands: string[];
  searchQuery: string;
  seatCount: number | null;
  maxHourlyRate: number;
  areaFilter: string;
  onlyAvailable: boolean;
}

export interface Booking {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  startTime: string;
  endTime: string;
  durationHours: number;
  estimatedKm: number;
  baseFare: number;
  mileageFare: number;
  insuranceFare: number;
  discount: number;
  totalCost: number;
  co2SavedKg: number;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  pickupLocation: string;
  userName: string;
  userEmail: string;
  licenseVerified: boolean;
  paymentMethod: 'PayNow' | 'Credit Card' | 'EcoPoints';
  digitalKeyUnlocked?: boolean;
}

export interface ChargingStation {
  id: string;
  name: string;
  operator: 'SP Mobility' | 'Charge+' | 'Shell Recharge' | 'CDG ENGIE';
  address: string;
  area: 'Central' | 'East' | 'West' | 'North' | 'North-East';
  lat: number;
  lng: number;
  availableLots: number;
  totalLots: number;
  fastChargingKw: number;
  pricePerKwh: number;
  parkedVehicles: Vehicle[];
}

export interface UserEcoProfile {
  name: string;
  email: string;
  tier: 'Eco Bronze' | 'Green Silver' | 'Electric Gold' | 'Zero-Emission Pioneer';
  ecoPoints: number;
  totalTrips: number;
  totalKmDriven: number;
  totalCo2SavedKg: number;
  treesPlantedEquivalent: number;
  savedMoneyVsPetrolSgd: number;
}

export interface OneMapSearchResult {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
}

export interface OneMapGeocodeInfo {
  BUILDINGNAME: string;
  BLOCK: string;
  ROAD: string;
  POSTALCODE: string;
  XCOORD: string;
  YCOORD: string;
  LATITUDE: string;
  LONGITUDE: string;
}

export type OneMapRouteType = 'walk' | 'drive' | 'cycle' | 'pt';

export interface OneMapRouteInstruction {
  action: string;
  road: string;
  distance: number;
  coordinates: string;
  durationSeconds: number;
  distanceText: string;
  heading: string;
  turnDirection: string;
  mode: string;
  instructionText: string;
}

export interface OneMapRouteResponse {
  status_message?: string;
  route_geometry?: string;
  status?: number;
  route_instructions?: any[][];
  route_summary?: {
    total_distance?: number;
    total_time?: number;
    start_point?: string;
    end_point?: string;
  };
  subtitle_summary?: string;
}

