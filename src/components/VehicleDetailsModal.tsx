import React, { useState } from 'react';
import { Vehicle } from '../types';
import { X, Zap, BatteryCharging, Gauge, MapPin, CheckCircle2, Shield, Calendar, Clock, DollarSign, Leaf, Sparkles, ArrowRight, Calculator } from 'lucide-react';

interface VehicleDetailsModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onBookNow: (vehicle: Vehicle, hours: number, estimatedKm: number, date?: string) => void;
}

// Generate upcoming 14 dates for dropdown selection
const generateDateOptions = () => {
  const options = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-SG', { weekday: 'short' });
    const formatted = `${dayName} (${d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })})`;
    options.push({ value: iso, label: formatted });
  }
  return options;
};

const DATE_OPTIONS = generateDateOptions();

const HOUR_OPTIONS = [
  { value: 1, label: '1 hour' },
  { value: 2, label: '2 hours' },
  { value: 3, label: '3 hours (Standard)' },
  { value: 4, label: '4 hours' },
  { value: 5, label: '5 hours' },
  { value: 6, label: '6 hours' },
  { value: 8, label: '8 hours' },
  { value: 10, label: '10 hours' },
  { value: 12, label: '12 hours' },
  { value: 24, label: '24 hours / 1 Day' },
  { value: 48, label: '48 hours / 2 Days' },
];

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  onClose,
  onBookNow
}) => {
  if (!vehicle) return null;

  const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[0].value);
  const [hours, setHours] = useState(3);
  const [estimatedKm, setEstimatedKm] = useState(45);
  const [isPeak, setIsPeak] = useState(false);

  const hourlyRate = isPeak ? vehicle.hourlyRatePeak : vehicle.hourlyRateOffPeak;
  const timeFare = hours * hourlyRate;
  const mileageFare = estimatedKm * vehicle.mileageRatePerKm;
  const estimatedTotal = timeFare + mileageFare;
  const co2SavedKg = (estimatedKm * vehicle.co2SavedPerKmKg).toFixed(2);
  const petrolCostComparison = (estimatedKm * 0.22 + hours * (isPeak ? 16 : 12)).toFixed(2);
  const moneySaved = Math.max(0, Number(petrolCostComparison) - estimatedTotal).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-[#c4c5da] overflow-hidden my-8 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#fbf8ff]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-[#f3f2ff] text-[#0034c5] text-xs font-bold px-2.5 py-1 rounded">
              <Zap className="w-3.5 h-3.5 fill-[#0034c5]" /> Electric
            </span>
            <span className="bg-[#F4F7FA] text-[#434657] border border-[#E2E8F0] text-xs font-bold px-2.5 py-1 rounded">
              {vehicle.category}
            </span>
            <span className="text-xs text-[#545e77] font-medium hidden sm:inline">
              License Plate: <strong className="text-[#191b25]">{vehicle.plateNumber}</strong>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#747688] hover:text-[#191b25] hover:bg-[#f3f2ff] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          {/* Top Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-[#f3f2ff]/60 p-6 rounded-xl border border-[#E2E8F0]">
            <div>
              <h2 className="text-3xl font-bold text-[#191b25] tracking-tight mb-1">
                {vehicle.name}
              </h2>
              <p className="text-base text-[#545e77] mb-4">
                {vehicle.vehicleType} • {vehicle.seats} Seater • 100% Zero-Emission BEV
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-xs">
                  <div className="text-xs text-[#545e77] flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-[#0034c5]" /> Battery Range
                  </div>
                  <div className="text-lg font-bold text-[#191b25]">{vehicle.rangeKm} km</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">{vehicle.currentBatteryPercent}% Charged</div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-xs">
                  <div className="text-xs text-[#545e77] flex items-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" /> Battery Capacity
                  </div>
                  <div className="text-lg font-bold text-[#191b25]">{vehicle.batteryCapacityKwh} kWh</div>
                  <div className="text-[11px] text-[#545e77]">{vehicle.powerHp} Horsepower</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-[#434657]">
                <MapPin className="w-4 h-4 text-[#0034c5] flex-shrink-0" />
                <span>Station: <strong>{vehicle.location}</strong></span>
              </div>
            </div>

            <div className="relative h-48 md:h-56 flex items-center justify-center">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                referrerPolicy="no-referrer"
                className="w-full max-h-48 object-contain drop-shadow-xl"
              />
            </div>
          </div>

          {/* Key EV Features */}
          <div>
            <h3 className="text-sm font-bold text-[#191b25] uppercase tracking-wider mb-3">
              Included EV Features & Technology
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {vehicle.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#191b25] bg-[#fbf8ff] p-2.5 rounded-lg border border-[#e2e1f0]">
                  <CheckCircle2 className="w-4 h-4 text-[#0034c5] flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Pricing & Carbon Savings Calculator */}
          <div className="bg-[#fbf8ff] p-6 rounded-xl border border-[#0034c5]/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#191b25] flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#0034c5]" /> Interactive Trip Cost Estimator
                </h3>
                <p className="text-xs text-[#545e77]">Calculated with Singapore transparent time + mileage tariffs (Free Charging Included)</p>
              </div>

              {/* Peak/Off-Peak Toggle */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#c4c5da] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setIsPeak(false)}
                  className={`px-3 py-1 rounded transition-colors ${!isPeak ? 'bg-[#0034c5] text-white' : 'text-[#545e77]'}`}
                >
                  Off-Peak (${vehicle.hourlyRateOffPeak.toFixed(2)}/h)
                </button>
                <button
                  type="button"
                  onClick={() => setIsPeak(true)}
                  className={`px-3 py-1 rounded transition-colors ${isPeak ? 'bg-[#0034c5] text-white' : 'text-[#545e77]'}`}
                >
                  Peak (${vehicle.hourlyRatePeak.toFixed(2)}/h)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Dropdowns & Sliders */}
              <div className="space-y-4">
                {/* Date and Hours Dropdown Menus */}
                <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-[#c4c5da]">
                  <div>
                    <label className="block text-[11px] font-bold text-[#191b25] mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#0034c5]" />
                      <span>Rental Date</span>
                    </label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full text-xs font-semibold bg-[#fbf8ff] text-[#191b25] border border-[#c4c5da] rounded-lg p-2 focus:outline-hidden cursor-pointer"
                    >
                      {DATE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#191b25] mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#0034c5]" />
                      <span>Rental Duration</span>
                    </label>
                    <select
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="w-full text-xs font-semibold bg-[#fbf8ff] text-[#191b25] border border-[#c4c5da] rounded-lg p-2 focus:outline-hidden cursor-pointer"
                    >
                      {HOUR_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#191b25] mb-1">
                    <span>Fine-tune Hours</span>
                    <span className="text-[#0034c5]">{hours} hours ({hours >= 24 ? `${Math.floor(hours/24)} days` : 'Hourly'})</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="48"
                    step="1"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full accent-[#0034c5] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#191b25] mb-1">
                    <span>Estimated Distance</span>
                    <span className="text-[#0034c5]">{estimatedKm} km</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="300"
                    step="5"
                    value={estimatedKm}
                    onChange={(e) => setEstimatedKm(Number(e.target.value))}
                    className="w-full accent-[#0034c5] cursor-pointer"
                  />
                </div>
              </div>

              {/* Cost Summary Box */}
              <div className="bg-white p-4 rounded-xl border border-[#c4c5da] flex flex-col justify-between shadow-xs">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#545e77]">
                    <span>Time Fare ({hours}h × ${hourlyRate.toFixed(2)}):</span>
                    <span className="font-semibold text-[#191b25]">${timeFare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#545e77]">
                    <span>Mileage Charge ({estimatedKm}km × ${vehicle.mileageRatePerKm.toFixed(2)}):</span>
                    <span className="font-semibold text-[#191b25]">${mileageFare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    <span className="flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5" /> CO₂ Avoided:
                    </span>
                    <span className="font-bold">{co2SavedKg} kg CO₂e</span>
                  </div>
                  <div className="border-t border-[#E2E8F0] pt-2 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-[#191b25]">Estimated Total Fare:</span>
                    <span className="text-2xl font-bold text-[#0034c5]">${estimatedTotal.toFixed(2)} SGD</span>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-[#545e77] bg-[#f3f2ff] p-2 rounded flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0034c5] flex-shrink-0" />
                  <span>Free DC Fast Charging at all SP Mobility & Charge+ stations included.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#fbf8ff] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#545e77] text-center sm:text-left">
            <span>Instant booking • Digital Bluetooth Key • $0 Fuel Liability</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 border border-[#c4c5da] text-[#434657] hover:bg-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => onBookNow(vehicle, hours, estimatedKm, selectedDate)}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#0034c5] hover:bg-[#00248c] text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Confirm & Reserve EV</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
