import React from 'react';
import { Vehicle } from '../types';
import { Zap, BatteryCharging, Gauge, MapPin, ArrowRight, Shield } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
  onQuickBook: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onSelect,
  onQuickBook
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden flex flex-col relative group hover:shadow-xl hover:border-[#0034c5]/40 transition-all duration-300">
      {/* Top Details & Tags */}
      <div className="p-5 flex-grow flex flex-col z-10">
        {/* Category & Fuel Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 bg-[#f3f2ff] text-[#0034c5] text-xs font-bold px-2.5 py-1 rounded-md">
            <Zap className="w-3.5 h-3.5 fill-[#0034c5]" />
            Electric
          </span>
          <span className="inline-flex items-center bg-[#F4F7FA] text-[#434657] border border-[#E2E8F0] text-xs font-bold px-2.5 py-1 rounded-md">
            {vehicle.category}
          </span>
          <span className="ml-auto text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {vehicle.currentBatteryPercent}% SoC
          </span>
        </div>

        {/* Vehicle Title */}
        <h3 
          onClick={() => onSelect(vehicle)}
          className="text-2xl font-bold text-[#191b25] mb-1 group-hover:text-[#0034c5] transition-colors cursor-pointer leading-snug"
        >
          {vehicle.name}
        </h3>

        {/* Subtitle / Specs */}
        <p className="text-sm font-medium text-[#545e77] mb-3">
          {vehicle.vehicleType} • {vehicle.seats}-seater
        </p>

        {/* Battery & Range Chips */}
        <div className="flex items-center gap-3 text-xs text-[#434657] mb-2 bg-[#fbf8ff] p-2 rounded-lg border border-[#e2e1f0]">
          <div className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-[#0034c5]" />
            <span className="font-semibold">{vehicle.rangeKm} km</span> range
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <div className="flex items-center gap-1">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
            <span>{vehicle.chargingSpeedKw}kW DC Fast</span>
          </div>
        </div>

        {/* Pricing line */}
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xs text-[#545e77]">From</span>
          <span className="text-xl font-bold text-[#0034c5]">${vehicle.hourlyRateOffPeak.toFixed(2)}</span>
          <span className="text-xs text-[#545e77]">/hr • +${vehicle.mileageRatePerKm.toFixed(2)}/km</span>
        </div>
      </div>

      {/* Vehicle Image Container */}
      <div 
        onClick={() => onSelect(vehicle)}
        className="relative h-48 w-full mt-auto translate-y-3 group-hover:translate-y-1 transition-transform duration-300 cursor-pointer overflow-hidden"
      >
        <img
          src={vehicle.image}
          alt={vehicle.name}
          referrerPolicy="no-referrer"
          className="absolute bottom-0 right-0 w-[110%] object-contain object-right-bottom scale-110 select-none pointer-events-none drop-shadow-md"
          loading="lazy"
        />
      </div>

      {/* Action Footer overlay on hover/active */}
      <div className="p-4 pt-2 bg-white/95 border-t border-[#f0effe] flex items-center gap-2 z-20">
        <button
          onClick={() => onSelect(vehicle)}
          className="flex-1 py-2 px-3 text-xs font-bold text-[#0034c5] bg-[#f3f2ff] hover:bg-[#dde1ff] rounded-lg transition-colors text-center cursor-pointer"
        >
          View Specs & Range
        </button>
        <button
          onClick={() => onQuickBook(vehicle)}
          className="flex-1 py-2 px-3 text-xs font-bold text-white bg-[#0034c5] hover:bg-[#00248c] rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>Book Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
