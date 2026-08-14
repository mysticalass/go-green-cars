import React, { useState, useEffect } from 'react';
import { CHARGING_STATIONS } from '../data/mockData';
import { ChargingStation, Vehicle, OneMapSearchResult, OneMapGeocodeInfo, OneMapRouteType, OneMapRouteResponse } from '../types';
import {
  MapPin,
  Zap,
  Navigation,
  Search,
  CheckCircle2,
  ArrowRight,
  Route as RouteIcon,
  Compass,
  Car,
  Key,
  ShieldCheck,
  RefreshCw,
  Clock,
  Send,
  Sliders,
  ExternalLink,
  Info,
  AlertCircle,
  BatteryCharging,
  Gauge
} from 'lucide-react';

interface LocationsViewProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const LocationsView: React.FC<LocationsViewProps> = ({ onSelectVehicle }) => {
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedOperator, setSelectedOperator] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStation, setActiveStation] = useState<ChargingStation>(CHARGING_STATIONS[0]);

  // OneMap Search State
  const [oneMapSearchResults, setOneMapSearchResults] = useState<OneMapSearchResult[]>([]);
  const [isSearchingOneMap, setIsSearchingOneMap] = useState<boolean>(false);
  const [selectedOneMapLoc, setSelectedOneMapLoc] = useState<OneMapSearchResult | null>(null);

  // OneMap Route State - Dedicated to EV Driving Navigation
  const [routeType] = useState<OneMapRouteType>('drive');
  const [routeData, setRouteData] = useState<OneMapRouteResponse | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);
  const [routeStartName, setRouteStartName] = useState<string>('Raffles Place MRT (Central)');
  const [routeStartCoords, setRouteStartCoords] = useState<{ lat: number; lng: number }>({
    lat: 1.2840,
    lng: 103.8515
  });

  // Reverse Geocode State
  const [revGeocodeResult, setRevGeocodeResult] = useState<OneMapGeocodeInfo | null>(null);
  const [isRevGeocoding, setIsRevGeocoding] = useState<boolean>(false);

  // Token Minting & Dev Tools Modal
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  const [mintEmail, setMintEmail] = useState<string>('');
  const [mintPassword, setMintPassword] = useState<string>('');
  const [mintStatus, setMintStatus] = useState<{ loading: boolean; message?: string; success?: boolean }>({
    loading: false
  });
  const [apiTelemetry, setApiTelemetry] = useState<any>(null);

  // Filter stations based on Area, Operator, and Search
  const filteredStations = CHARGING_STATIONS.filter(st => {
    const matchesArea = selectedArea === 'All' || st.area === selectedArea;
    const matchesOperator = selectedOperator === 'All' || st.operator === selectedOperator;
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesArea && matchesOperator && matchesSearch;
  });

  // Fetch OneMap API telemetry on mount
  useEffect(() => {
    fetch('/api/onemap/status')
      .then(res => res.json())
      .then(data => setApiTelemetry(data))
      .catch(err => console.error('Failed to get OneMap status', err));
  }, []);

  // Debounced OneMap Geocode Search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setOneMapSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingOneMap(true);
      try {
        const res = await fetch(`/api/onemap/search?searchVal=${encodeURIComponent(searchQuery)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`);
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          setOneMapSearchResults(data.results.slice(0, 5));
        }
      } catch (err) {
        console.error('OneMap geocode error', err);
      } finally {
        setIsSearchingOneMap(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Request EV Route from OneMap API
  const handleCalculateRoute = async (
    startLat: number = routeStartCoords.lat,
    startLng: number = routeStartCoords.lng,
    endLat: number = activeStation.lat,
    endLng: number = activeStation.lng,
    mode: OneMapRouteType = 'drive'
  ) => {
    setIsLoadingRoute(true);
    try {
      const res = await fetch(
        `/api/onemap/route?start=${startLat},${startLng}&end=${endLat},${endLng}&routeType=${mode}`
      );
      const json = await res.json();
      if (json.success && json.data) {
        setRouteData(json.data);
      } else {
        setRouteData(null);
      }
    } catch (err) {
      console.error('Failed to calculate route via OneMap', err);
      setRouteData(null);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Trigger route calculation when station or origin changes
  useEffect(() => {
    if (activeStation) {
      handleCalculateRoute(routeStartCoords.lat, routeStartCoords.lng, activeStation.lat, activeStation.lng, 'drive');
    }
  }, [activeStation, routeStartCoords]);

  // Perform Reverse Geocoding via OneMap
  const handleReverseGeocode = async (lat: number, lng: number) => {
    setIsRevGeocoding(true);
    try {
      const res = await fetch(`/api/onemap/revgeocode?location=${lat},${lng}&buffer=50&addressType=All`);
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        const top = json.data[0];
        setRevGeocodeResult(top);
        setRouteStartName(top.BUILDINGNAME !== 'NIL' ? top.BUILDINGNAME : `${top.BLOCK} ${top.ROAD}`);
        setRouteStartCoords({ lat, lng });
        handleCalculateRoute(lat, lng, activeStation.lat, activeStation.lng, 'drive');
      }
    } catch (err) {
      console.error('OneMap reverse geocoding error', err);
    } finally {
      setIsRevGeocoding(false);
    }
  };

  // Mint new OneMap Token
  const handleMintToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintEmail || !mintPassword) return;

    setMintStatus({ loading: true });
    try {
      const res = await fetch('/api/onemap/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: mintEmail, password: mintPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMintStatus({
          loading: false,
          success: true,
          message: 'Token successfully minted and active for 3 days!'
        });
        // Refresh telemetry
        const statusRes = await fetch('/api/onemap/status');
        setApiTelemetry(await statusRes.json());
      } else {
        setMintStatus({
          loading: false,
          success: false,
          message: data.error || data.message || 'Authentication error from OneMap portal'
        });
      }
    } catch (err: any) {
      setMintStatus({
        loading: false,
        success: false,
        message: err.message || 'Network error while contacting OneMap'
      });
    }
  };

  // Pick a search result from OneMap
  const handleSelectOneMapResult = (item: OneMapSearchResult) => {
    const lat = parseFloat(item.LATITUDE);
    const lng = parseFloat(item.LONGITUDE);
    setSelectedOneMapLoc(item);
    setRouteStartName(item.BUILDING !== 'NIL' ? item.BUILDING : item.ADDRESS);
    setRouteStartCoords({ lat, lng });
    setOneMapSearchResults([]);
    setSearchQuery('');

    // Find closest station
    let closest = CHARGING_STATIONS[0];
    let minDist = 99999;
    CHARGING_STATIONS.forEach(st => {
      const d = Math.hypot(st.lat - lat, st.lng - lng);
      if (d < minDist) {
        minDist = d;
        closest = st;
      }
    });
    setActiveStation(closest);
    handleCalculateRoute(lat, lng, closest.lat, closest.lng, 'drive');
  };

  const estDistanceKm = routeData?.route_summary?.total_distance
    ? (routeData.route_summary.total_distance / 1000)
    : 0;
  const estBatteryKwh = estDistanceKm > 0 ? (estDistanceKm * 0.15).toFixed(1) : '0.0';
  const estChargingSpeed = activeStation.fastChargingKw;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with OneMap Gov SG Live Badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0034c5] text-xs font-bold">
              <Car className="w-3.5 h-3.5" /> 1,700+ Singapore EV Hubs & Chargers
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-emerald-600" /> Live EV Charging Lot Telemetry
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-[#0034c5] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0034c5]" /> OneMap Gov SG Navigation Active
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#191b25] tracking-tight">
            EV Hubs, Chargers & OneMap Route Navigation
          </h1>
          <p className="text-sm lg:text-base text-[#545e77] mt-1">
            Singapore SLA OneMap live geocoding, turn-by-turn EV driving navigation to charging hubs, real-time charger lots, and available fleet cars.
          </p>
        </div>

        {/* Action / Token Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTokenModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#c4c5da] hover:border-[#0034c5] text-xs font-bold text-[#0034c5] flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-[#0034c5]" />
            OneMap Token & API Tools
          </button>
        </div>
      </div>

      {/* Search & OneMap Elastic Geocoding Bar */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#545e77]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search EV charging hub or address via OneMap (e.g. 'Raffles Place', 'Jewel Changi', 'Orchard ION', '049247')..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#c4c5da] rounded-xl text-sm focus:outline-hidden focus:border-[#0034c5]"
            />
            {isSearchingOneMap && (
              <RefreshCw className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0034c5] animate-spin" />
            )}

            {/* OneMap Elastic Search Suggestions Dropdown */}
            {oneMapSearchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#c4c5da] rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100">
                <div className="bg-[#f3f2ff] px-3 py-1.5 text-[11px] font-bold text-[#0034c5] flex items-center justify-between">
                  <span>OneMap Singapore Live Geocode Results</span>
                  <span>{oneMapSearchResults.length} found</span>
                </div>
                {oneMapSearchResults.map((res, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOneMapResult(res)}
                    className="w-full text-left p-3 hover:bg-[#fbf8ff] transition-colors flex items-start gap-2.5 cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-[#0034c5] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#191b25]">{res.SEARCHVAL}</div>
                      <div className="text-[11px] text-[#545e77]">{res.ADDRESS}</div>
                      <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                        Postal: {res.POSTAL || 'N/A'} • Lat: {Number(res.LATITUDE).toFixed(4)}, Lng: {Number(res.LONGITUDE).toFixed(4)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Area Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
            {['All', 'Central', 'East', 'West', 'North', 'North-East'].map(area => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedArea === area
                    ? 'bg-[#0034c5] text-white shadow-xs'
                    : 'bg-white text-[#434657] border border-[#c4c5da] hover:border-[#0034c5]'
                }`}
              >
                {area}
              </button>
            ))}
          </div>

          {/* Operator Filter */}
          <select
            value={selectedOperator}
            onChange={(e) => setSelectedOperator(e.target.value)}
            className="px-3 py-2 bg-white border border-[#c4c5da] rounded-xl text-xs font-semibold text-[#191b25] focus:outline-hidden"
          >
            <option value="All">All CPO Partners</option>
            <option value="SP Mobility">SP Mobility Only</option>
            <option value="Charge+">Charge+ Only</option>
            <option value="Shell Recharge">Shell Recharge Only</option>
            <option value="CDG ENGIE">CDG ENGIE</option>
          </select>
        </div>

        {/* Selected Origin Pill */}
        <div className="flex flex-wrap items-center justify-between text-xs text-[#545e77] bg-[#fbf8ff] p-2.5 rounded-xl border border-[#c4c5da]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0034c5]">Electric Car Departure Point:</span>
            <span className="font-semibold text-[#191b25] bg-white px-2 py-0.5 rounded border border-[#c4c5da]">
              {routeStartName}
            </span>
            <span className="text-[11px] text-[#545e77]">
              ({routeStartCoords.lat.toFixed(4)}, {routeStartCoords.lng.toFixed(4)})
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1 sm:mt-0">
            <button
              onClick={() => handleReverseGeocode(1.3000, 103.8000)}
              disabled={isRevGeocoding}
              className="px-2.5 py-1 bg-white hover:bg-[#dde1ff] text-[#0034c5] font-bold rounded-lg border border-[#c4c5da] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Compass className={`w-3 h-3 ${isRevGeocoding ? 'animate-spin' : ''}`} />
              <span>Test Reverse Geocode (Tanglin Halt)</span>
            </button>
            <button
              onClick={() => handleReverseGeocode(1.3521, 103.8198)}
              disabled={isRevGeocoding}
              className="px-2.5 py-1 bg-white hover:bg-[#dde1ff] text-[#0034c5] font-bold rounded-lg border border-[#c4c5da] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Compass className="w-3 h-3" />
              <span>Center Singapore (Bishan)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Stations List & OneMap Route Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Station Cards List */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto custom-scrollbar pr-1">
          {filteredStations.map(station => {
            const isSelected = activeStation.id === station.id;
            return (
              <div
                key={station.id}
                onClick={() => setActiveStation(station)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#0034c5] bg-[#f3f2ff] shadow-md ring-1 ring-[#0034c5]'
                    : 'border-[#E2E8F0] bg-white hover:border-[#0034c5]/50 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-bold text-sm text-[#191b25]">{station.name}</h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0034c5]">
                    {station.operator}
                  </span>
                </div>

                <p className="text-xs text-[#545e77] mb-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0034c5] flex-shrink-0" />
                  {station.address}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{station.availableLots} of {station.totalLots} EV Lots Free</span>
                  </div>
                  <div className="text-[#545e77] font-medium">
                    ⚡ {station.fastChargingKw}kW DC Fast (${station.pricePerKwh}/kWh)
                  </div>
                </div>

                {/* Parked Ready Electric Cars Count */}
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#0034c5] bg-white/80 px-2.5 py-1 rounded-lg border border-blue-100">
                  <span className="font-semibold">🚗 {station.parkedVehicles.length} Go Green EVs ready on-site</span>
                  <span className="font-bold">Drive to Charger →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: OneMap EV Route Planner & Station Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* OneMap Routing Visualizer Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
            {/* Route Mode Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-[#191b25] flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#0034c5]" />
                  OneMap EV Route & Charger Navigation
                </h3>
                <p className="text-xs text-[#545e77]">
                  From <span className="font-semibold text-[#191b25]">{routeStartName}</span> to <span className="font-semibold text-[#191b25]">{activeStation.name}</span>
                </p>
              </div>

              {/* EV Navigation Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0034c5] text-white text-xs font-bold shadow-xs">
                  <Car className="w-3.5 h-3.5" /> EV Drive Route
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  <Zap className="w-3 h-3 text-emerald-600" /> {activeStation.fastChargingKw}kW DC Fast
                </span>
              </div>
            </div>

            {/* Visual Map Stage with Route Stats */}
            <div className="relative h-64 w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-inner flex flex-col justify-between p-4 text-white">
              {/* Top Stats Bar */}
              <div className="flex flex-wrap justify-between items-center gap-2 z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-black/70 backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-blue-400" />
                    {routeData?.route_summary?.total_time
                      ? `${Math.ceil(routeData.route_summary.total_time / 60)} mins drive`
                      : 'Calculating Drive ETA...'}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-black/70 backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
                    <Gauge className="w-3 h-3 text-emerald-400" />
                    {estDistanceKm > 0 ? `${estDistanceKm.toFixed(2)} km` : 'OneMap Gov SG Routing'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    Est. Energy: ~{estBatteryKwh} kWh
                  </span>
                </div>
              </div>

              {/* Dynamic Singapore Map Visual Polyline */}
              <div className="absolute inset-0 opacity-40 pointer-events-none flex items-center justify-center">
                <div className="w-80 h-32 border-b-2 border-dashed border-blue-400 transform -rotate-12 animate-pulse"></div>
                <div className="w-48 h-48 rounded-full border border-blue-500/20 absolute"></div>
              </div>

              {/* Waypoints Center Pins */}
              <div className="z-10 flex items-center justify-around my-auto">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-emerald-400/40">
                    <Car className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold mt-1 bg-black/80 px-2 py-0.5 rounded border border-white/10 max-w-[120px] truncate text-center">
                    {routeStartName}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-0.5 text-blue-300 text-xs font-bold animate-pulse">
                  <div className="flex items-center gap-1">
                    <span>••••</span>
                    <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white text-[10px] uppercase font-mono tracking-wider flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" /> EV DRIVE PATH
                    </span>
                    <span>••••</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-normal">Optimal Route</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-[#0046ff] text-white flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-blue-400/50">
                    <Zap className="w-4 h-4 text-yellow-300" />
                  </div>
                  <span className="text-[10px] font-bold mt-1 bg-black/80 px-2 py-0.5 rounded border border-white/10 max-w-[120px] truncate text-center">
                    {activeStation.name}
                  </span>
                </div>
              </div>

              {/* Map Footer Action */}
              <div className="flex justify-between items-center z-10 pt-2 border-t border-white/10 text-xs">
                <span className="text-white/80 truncate max-w-[280px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-400 flex-shrink-0" />
                  Charger: {activeStation.address}
                </span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activeStation.lat},${activeStation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#b9c3ff] hover:text-white flex items-center gap-1 transition-colors bg-white/10 px-2.5 py-1 rounded"
                >
                  <span>Open GPS Navigation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* EV Driving Details & Charger Lot Status Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#fbf8ff] p-3.5 rounded-xl border border-[#c4c5da] text-xs">
              <div>
                <span className="text-[#545e77] block text-[11px]">Free EV Lots</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {activeStation.availableLots} / {activeStation.totalLots} Lots
                </span>
              </div>
              <div>
                <span className="text-[#545e77] block text-[11px]">DC Fast Rate</span>
                <span className="font-bold text-[#0034c5] text-sm">
                  {activeStation.fastChargingKw} kW
                </span>
              </div>
              <div>
                <span className="text-[#545e77] block text-[11px]">Tariff Rate</span>
                <span className="font-bold text-[#191b25] text-sm">
                  ${activeStation.pricePerKwh.toFixed(2)}/kWh
                </span>
              </div>
              <div>
                <span className="text-[#545e77] block text-[11px]">EVs at Location</span>
                <span className="font-bold text-[#0034c5] text-sm">
                  {activeStation.parkedVehicles.length} Ready Cars
                </span>
              </div>
            </div>

            {/* Step-by-Step Driving Instructions */}
            {routeData?.route_instructions && routeData.route_instructions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#191b25]">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#0034c5]" />
                    EV Driving Turn-by-Turn Directions ({routeData.route_instructions.length} steps)
                  </span>
                  <span className="text-[#0034c5] text-[11px]">OneMap SLA Navigation Engine</span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar text-xs">
                  {routeData.route_instructions.map((step, sIdx) => {
                    const action = step[0] || 'Proceed';
                    const road = step[1] || 'Road';
                    const dist = step[2] ? `${step[2]}m` : '';
                    const instruction = step[9] || `${action} onto ${road} (${dist})`;
                    return (
                      <div
                        key={sIdx}
                        className="p-2.5 rounded-lg bg-[#fbf8ff] border border-[#E2E8F0] flex items-center justify-between gap-2 hover:border-[#0034c5]/40 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0034c5] font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                            {sIdx + 1}
                          </span>
                          <span className="text-[#191b25] font-medium">{instruction}</span>
                        </div>
                        {dist && (
                          <span className="text-[11px] text-[#545e77] font-semibold whitespace-nowrap bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {dist}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Parked Electric Vehicles Ready For Immediate Pickup */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-[#191b25] uppercase tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-[#0034c5]" />
                Electric Vehicles Parked & Ready at this Hub ({activeStation.parkedVehicles.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeStation.parkedVehicles.map(veh => (
                <div
                  key={veh.id}
                  className="bg-[#fbf8ff] p-4 rounded-xl border border-[#c4c5da] hover:border-[#0034c5] transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img src={veh.image} alt={veh.name} referrerPolicy="no-referrer" className="w-20 h-14 object-contain" />
                    <div>
                      <h4 className="font-bold text-sm text-[#191b25]">{veh.name}</h4>
                      <p className="text-xs text-[#545e77]">{veh.vehicleType} • {veh.seats} Seats</p>
                      <p className="text-xs font-bold text-emerald-700 mt-0.5">
                        ⚡ {veh.currentBatteryPercent}% ({veh.rangeKm} km)
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#e2e1f0] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0034c5]">${veh.hourlyRateOffPeak.toFixed(2)}/hr</span>
                    <button
                      onClick={() => onSelectVehicle(veh)}
                      className="px-3 py-1.5 bg-[#0034c5] hover:bg-[#00248c] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Book Vehicle</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* OneMap Token Minting & Developer Telemetry Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#0034c5]" />
                <h3 className="font-bold text-lg text-[#191b25]">OneMap Singapore Gov API Console</h3>
              </div>
              <button
                onClick={() => setShowTokenModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Current Active Token Telemetry */}
            <div className="bg-[#f3f2ff] p-4 rounded-xl border border-[#c4c5da] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0034c5]">Active Token Authentication:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  ✓ Active (3-Day JWT Valid)
                </span>
              </div>
              <p className="text-xs font-mono text-[#545e77] break-all bg-white p-2 rounded border border-slate-200">
                {apiTelemetry?.tokenPrefix || 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'}
              </p>
              <div className="text-[11px] text-[#545e77] flex flex-wrap gap-3 pt-1">
                <span><strong>Header:</strong> AccountKey / Authorization: Bearer</span>
                <span><strong>Service:</strong> SLA OneMap Public Routing & Elastic Geocoding</span>
              </div>
            </div>

            {/* Mint New Token Form (https://www.onemap.gov.sg/api/auth/post/getToken) */}
            <form onSubmit={handleMintToken} className="space-y-4 border border-slate-200 p-4 rounded-xl">
              <div>
                <h4 className="font-bold text-sm text-[#191b25] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0034c5]" />
                  Mint New 3-Day OneMap Token
                </h4>
                <p className="text-xs text-[#545e77] mt-0.5">
                  Sends POST request to <code>https://www.onemap.gov.sg/api/auth/post/getToken</code>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#191b25] mb-1">OneMap Registered Email</label>
                  <input
                    type="email"
                    value={mintEmail}
                    onChange={(e) => setMintEmail(e.target.value)}
                    placeholder="developer@agency.gov.sg"
                    className="w-full px-3 py-2 text-xs border border-[#c4c5da] rounded-lg focus:outline-hidden focus:border-[#0034c5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#191b25] mb-1">OneMap Password</label>
                  <input
                    type="password"
                    value={mintPassword}
                    onChange={(e) => setMintPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 text-xs border border-[#c4c5da] rounded-lg focus:outline-hidden focus:border-[#0034c5]"
                  />
                </div>
              </div>

              {mintStatus.message && (
                <div className={`p-3 rounded-lg text-xs font-medium ${mintStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {mintStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={mintStatus.loading}
                className="w-full py-2.5 bg-[#0034c5] hover:bg-[#00248c] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {mintStatus.loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Minting OneMap Token...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Generate & Activate OneMap Token</span>
                  </>
                )}
              </button>
            </form>

            <div className="flex justify-end">
              <button
                onClick={() => setShowTokenModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#191b25] font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close Console
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
