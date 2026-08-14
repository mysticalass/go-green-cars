import React, { useState } from 'react';
import { CHARGING_STATIONS, VEHICLES_DATA } from '../data/mockData';
import { ChargingStation, Vehicle } from '../types';
import { MapPin, Zap, BatteryCharging, Navigation, Search, Filter, CheckCircle2, ArrowRight } from 'lucide-react';

interface LocationsViewProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const LocationsView: React.FC<LocationsViewProps> = ({ onSelectVehicle }) => {
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedOperator, setSelectedOperator] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStation, setActiveStation] = useState<ChargingStation>(CHARGING_STATIONS[0]);

  const filteredStations = CHARGING_STATIONS.filter(st => {
    const matchesArea = selectedArea === 'All' || st.area === selectedArea;
    const matchesOperator = selectedOperator === 'All' || st.operator === selectedOperator;
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          st.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesArea && matchesOperator && matchesSearch;
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0034c5] text-xs font-bold mb-2">
            <MapPin className="w-3.5 h-3.5" /> 1,700+ Singapore Hubs
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#191b25] tracking-tight">
            EV Parking Pods & Smart Charging Hubs
          </h1>
          <p className="text-sm lg:text-base text-[#545e77] mt-1">
            Pick up and return 100% electric vehicles at designated lots integrated with SP Mobility, Charge+, and Shell Recharge.
          </p>
        </div>

        {/* Partner Logos */}
        <div className="flex items-center gap-2 bg-[#f3f2ff] p-2.5 rounded-xl border border-[#c4c5da]">
          <span className="text-xs font-bold text-[#0034c5]">CPO Network Partners:</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-[#191b25] shadow-xs">SP Mobility</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-[#191b25] shadow-xs">Charge+</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-[#191b25] shadow-xs">Shell Recharge</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#545e77]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Singapore location, mall, or postal code..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#c4c5da] rounded-xl text-sm focus:outline-hidden focus:border-[#0034c5]"
          />
        </div>

        {/* Area Pills */}
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
          <option value="All">All Operators (SP, Charge+, Shell)</option>
          <option value="SP Mobility">SP Mobility Only</option>
          <option value="Charge+">Charge+ Only</option>
          <option value="Shell Recharge">Shell Recharge Only</option>
          <option value="CDG ENGIE">CDG ENGIE</option>
        </select>
      </div>

      {/* Main Grid: Interactive Map View & Station Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Station Cards List */}
        <div className="lg:col-span-5 space-y-3 max-h-[620px] overflow-y-auto custom-scrollbar pr-1">
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
                  <div className="text-[#545e77]">
                    ⚡ {station.fastChargingKw}kW DC Fast
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Station Interactive Detail Map & Ready Vehicles */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 flex flex-col justify-between shadow-xs space-y-6">
          {/* Simulated Visual Interactive Map Stage */}
          <div className="relative h-64 w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-inner flex flex-col justify-between p-4 text-white">
            {/* Map Header */}
            <div className="flex justify-between items-center z-10">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-black/60 backdrop-blur-xs border border-white/20">
                Singapore Grid Coordinates: {activeStation.lat}°N, {activeStation.lng}°E
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/80 text-white flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span> Live Telematics
              </span>
            </div>

            {/* Singapore Map Abstract Grid Visualization */}
            <div className="absolute inset-0 opacity-30 pointer-events-none flex items-center justify-center">
              <div className="w-72 h-72 rounded-full border border-blue-400/40 animate-pulse"></div>
              <div className="w-48 h-48 rounded-full border border-blue-300/30 absolute"></div>
            </div>

            {/* Station Map Marker Pin */}
            <div className="z-10 text-center mx-auto my-auto flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#0046ff] text-white flex items-center justify-center shadow-lg ring-4 ring-blue-400/40 animate-bounce">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div className="mt-2 bg-black/80 px-3 py-1 rounded-lg text-xs font-bold border border-white/20">
                {activeStation.name}
              </div>
              <p className="text-[11px] text-blue-200">{activeStation.operator} • {activeStation.fastChargingKw}kW DC</p>
            </div>

            {/* Map Footer Action */}
            <div className="flex justify-between items-center z-10 pt-2 border-t border-white/10">
              <span className="text-xs text-white/80">{activeStation.address}</span>
              <button
                onClick={() => alert(`Opening Google Maps navigation to: ${activeStation.address}`)}
                className="text-xs font-bold text-[#b9c3ff] hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" /> Navigate in Maps
              </button>
            </div>
          </div>

          {/* Parked Electric Vehicles Ready For Immediate Pickup */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-[#191b25] uppercase tracking-wider">
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
    </div>
  );
};
