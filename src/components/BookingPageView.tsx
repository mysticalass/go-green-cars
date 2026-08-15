import React, { useState } from 'react';
import { Vehicle, Booking, UserEcoProfile } from '../types';
import { VEHICLES_DATA } from '../data/mockData';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Zap,
  BatteryCharging,
  Gauge,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Leaf,
  CreditCard,
  QrCode,
  Tag,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Info,
  Car,
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface BookingPageViewProps {
  vehicle: Vehicle | null;
  initialHours?: number;
  initialEstimatedKm?: number;
  initialDate?: string;
  userProfile: UserEcoProfile;
  onBackToCars: () => void;
  onCompleteBooking: (booking: Booking) => void;
  onOpenSupport: () => void;
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
    const formatted = `${dayName}, ${d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    options.push({ value: iso, label: formatted, shortLabel: `${dayName} (${d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })})` });
  }
  return options;
};

const DATE_OPTIONS = generateDateOptions();

const HOUR_OPTIONS = [
  { value: 1, label: '1 hour — Quick errand / city jump' },
  { value: 2, label: '2 hours — Short shopping trip' },
  { value: 3, label: '3 hours — Standard island run (Recommended)' },
  { value: 4, label: '4 hours — Half-day excursion' },
  { value: 5, label: '5 hours — Extended booking' },
  { value: 6, label: '6 hours — Islandwide sightseeing' },
  { value: 8, label: '8 hours — Full business day' },
  { value: 10, label: '10 hours — Extended day trip' },
  { value: 12, label: '12 hours — 12-Hour Day Pass' },
  { value: 24, label: '24 hours (1 Day) — 24-Hour Saver Pass' },
  { value: 48, label: '48 hours (2 Days) — Weekend Roadtrip' },
  { value: 72, label: '72 hours (3 Days) — Multi-Day Package' },
];

const TIME_OPTIONS = [
  'Immediate Access (Now)',
  '08:00 AM (Morning)',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM (Noon)',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM (Afternoon)',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM (Evening Peak)',
  '07:00 PM',
  '08:00 PM',
  '09:00 PM (Night)',
  '10:00 PM'
];

export const BookingPageView: React.FC<BookingPageViewProps> = ({
  vehicle: propVehicle,
  initialHours = 3,
  initialEstimatedKm = 45,
  initialDate,
  userProfile,
  onBackToCars,
  onCompleteBooking,
  onOpenSupport
}) => {
  // If no vehicle provided, default to first available
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(propVehicle?.id || VEHICLES_DATA[0].id);
  const currentVehicle = VEHICLES_DATA.find(v => v.id === selectedVehicleId) || VEHICLES_DATA[0];

  // Dropdown States
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || DATE_OPTIONS[0].value);
  const [hours, setHours] = useState<number>(initialHours);
  const [pickupTime, setPickupTime] = useState<string>(TIME_OPTIONS[0]);
  const [estimatedKm, setEstimatedKm] = useState<number>(initialEstimatedKm);

  // Protection & Add-ons
  const [cdwPlus, setCdwPlus] = useState<boolean>(true);
  const [ecoDonation, setEcoDonation] = useState<boolean>(true);

  // Payment & Promo
  const [paymentMethod, setPaymentMethod] = useState<'PayNow' | 'Credit Card' | 'EcoPoints'>('PayNow');
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Price Calculations
  const baseFare = hours * currentVehicle.hourlyRateOffPeak;
  const mileageFare = estimatedKm * currentVehicle.mileageRatePerKm;
  const insuranceFare = cdwPlus ? 5.50 * Math.max(1, Math.ceil(hours / 4)) : 0.00;
  const greenDonationFare = ecoDonation ? 1.50 : 0.00;
  const discount = promoApplied ? 15.00 : 0.00;
  const totalCost = Math.max(0, baseFare + mileageFare + insuranceFare + greenDonationFare - discount);
  const co2SavedKg = Number((estimatedKm * currentVehicle.co2SavedPerKmKg).toFixed(2));
  const ecoPointsEarned = Math.round(co2SavedKg * 10) + (ecoDonation ? 25 : 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'GREEN2026' || code === 'GOGREEN' || code.startsWith('ECO10') || code.startsWith('GREEN-10')) {
      setPromoApplied(true);
      showToast('Promo code applied: S$15.00 discount credited!');
    } else {
      showToast('Invalid promo code. Try GREEN2026 or GOGREEN.');
    }
  };

  const handleConfirmReservation = () => {
    setIsSubmitting(true);
    
    // Construct real start and end timestamps based on selected date
    const startIso = selectedDate 
      ? new Date(`${selectedDate}T09:00:00`).toISOString() 
      : new Date().toISOString();
    const startDateObj = new Date(startIso);
    const endIso = new Date(startDateObj.getTime() + hours * 3600000).toISOString();

    const newBooking: Booking = {
      id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      vehicleId: currentVehicle.id,
      vehicle: currentVehicle,
      startTime: startIso,
      endTime: endIso,
      durationHours: hours,
      estimatedKm: estimatedKm,
      baseFare: baseFare,
      mileageFare: mileageFare,
      insuranceFare: insuranceFare,
      discount: discount,
      totalCost: totalCost,
      co2SavedKg: co2SavedKg,
      status: 'confirmed',
      pickupLocation: currentVehicle.location,
      userName: userProfile.name || 'Susan Tan',
      userEmail: 'susantan@gmail.com',
      licenseVerified: true,
      paymentMethod: paymentMethod,
      bookingRef: `SG-EV-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onCompleteBooking(newBooking);
    }, 600);
  };

  return (
    <div className="flex-grow max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#191b25] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500/50 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-[#e2e1f0]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCars}
            className="flex items-center gap-2 text-sm font-bold text-[#0034c5] hover:text-[#00248c] bg-white hover:bg-[#dde1ff] px-3.5 py-2 rounded-xl border border-[#c4c5da] transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cars Catalog</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#545e77]">
            <span>Cars Catalog</span>
            <span>/</span>
            <span className="text-[#191b25] font-bold">Book {currentVehicle.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Instant Digital Key
          </span>
        </div>
      </div>

      {/* Main Booking Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Booking Form & Dropdown Selections (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">

          {/* Section 1: Selected EV Banner & Quick Model Switcher */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#dde1ff] text-[#0034c5]">
                    {currentVehicle.category}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-emerald-600" /> 100% Electric
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191b25]">
                  {currentVehicle.name}
                </h1>
                <p className="text-xs text-[#545e77] mt-0.5">
                  Plate: <span className="font-bold text-[#191b25]">{currentVehicle.plateNumber}</span> • Station: <span className="font-bold text-[#191b25]">{currentVehicle.location}</span>
                </p>
              </div>

              {/* Quick Vehicle Switcher Dropdown */}
              <div className="sm:w-64">
                <label className="block text-[11px] font-bold text-[#545e77] uppercase tracking-wider mb-1">
                  Switch Vehicle Model
                </label>
                <div className="relative">
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full bg-[#fbf8ff] text-xs font-bold text-[#191b25] border border-[#c4c5da] rounded-xl px-3 py-2.5 pr-8 focus:outline-hidden focus:border-[#0034c5] focus:ring-2 focus:ring-[#0034c5]/20 cursor-pointer shadow-xs"
                  >
                    {VEHICLES_DATA.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} (${v.hourlyRateOffPeak}/h - {v.area})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#545e77] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Vehicle Image & Quick Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
              <div className="md:col-span-5 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl p-3 border border-slate-100 flex items-center justify-center">
                <img
                  src={currentVehicle.image}
                  alt={currentVehicle.name}
                  className="h-32 object-contain hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="bg-[#fbf8ff] p-2.5 rounded-xl border border-[#e2e1f0]">
                  <div className="flex items-center gap-1.5 text-xs text-[#545e77]">
                    <BatteryCharging className="w-4 h-4 text-emerald-600" />
                    <span>Battery Level</span>
                  </div>
                  <div className="text-sm font-extrabold text-[#191b25] mt-1">
                    {currentVehicle.currentBatteryPercent}% Charged
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${currentVehicle.currentBatteryPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-[#fbf8ff] p-2.5 rounded-xl border border-[#e2e1f0]">
                  <div className="flex items-center gap-1.5 text-xs text-[#545e77]">
                    <Gauge className="w-4 h-4 text-[#0034c5]" />
                    <span>Total Range</span>
                  </div>
                  <div className="text-sm font-extrabold text-[#191b25] mt-1">
                    {currentVehicle.rangeKm} km
                  </div>
                  <div className="text-[10px] text-[#545e77] mt-0.5">WLTP Tested</div>
                </div>

                <div className="bg-[#fbf8ff] p-2.5 rounded-xl border border-[#e2e1f0]">
                  <div className="flex items-center gap-1.5 text-xs text-[#545e77]">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Base Hourly</span>
                  </div>
                  <div className="text-sm font-extrabold text-[#0034c5] mt-1">
                    ${currentVehicle.hourlyRateOffPeak.toFixed(2)}/h
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Off-Peak Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Core Dropdown Menus (Rental Date & Rental Hours) */}
          <div className="bg-white rounded-2xl border-2 border-[#0034c5]/30 p-6 shadow-sm space-y-5 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0034c5] text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#191b25]">
                    Rental Schedule & Duration Selection
                  </h2>
                  <p className="text-xs text-[#545e77]">
                    Choose your pick-up date and rental hours from the drop-down menus below
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#0034c5] bg-[#dde1ff] px-3 py-1 rounded-full">
                Step 1 of 2
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Dropdown 1: Rental Date Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#191b25] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#0034c5]" />
                  <span>Rental Date (Select Date)</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full text-sm font-bold bg-[#fbf8ff] text-[#191b25] border-2 border-[#c4c5da] focus:border-[#0034c5] rounded-xl px-3.5 py-3 pr-10 focus:outline-hidden focus:ring-2 focus:ring-[#0034c5]/20 cursor-pointer shadow-xs transition-colors"
                  >
                    {DATE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <Calendar className="w-4 h-4 text-[#0034c5] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-[#545e77] px-1">
                  Selected: <strong className="text-[#0034c5]">{DATE_OPTIONS.find(o => o.value === selectedDate)?.label}</strong>
                </p>
              </div>

              {/* Dropdown 2: Rental Hours Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#191b25] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#0034c5]" />
                  <span>Rental Hours (Select Duration)</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full text-sm font-bold bg-[#fbf8ff] text-[#191b25] border-2 border-[#c4c5da] focus:border-[#0034c5] rounded-xl px-3.5 py-3 pr-10 focus:outline-hidden focus:ring-2 focus:ring-[#0034c5]/20 cursor-pointer shadow-xs transition-colors"
                  >
                    {HOUR_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} — S${(opt.value * currentVehicle.hourlyRateOffPeak).toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <Clock className="w-4 h-4 text-[#0034c5] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-[#545e77] px-1">
                  Duration: <strong className="text-[#0034c5]">{hours} hour{hours > 1 ? 's' : ''}</strong> (Base: S${(hours * currentVehicle.hourlyRateOffPeak).toFixed(2)} SGD)
                </p>
              </div>
            </div>

            {/* Dropdown 3: Pick-up Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#191b25] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#0034c5]" />
                  <span>Pick-up Time Slot</span>
                </label>
                <div className="relative">
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full text-xs font-semibold bg-white text-[#191b25] border border-[#c4c5da] rounded-xl px-3.5 py-2.5 pr-10 focus:outline-hidden focus:border-[#0034c5] cursor-pointer shadow-xs"
                  >
                    {TIME_OPTIONS.map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#545e77] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Station Location Confirmation */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#191b25] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Collection & Return Hub</span>
                </label>
                <div className="bg-[#f3f2ff] border border-[#c4c5da] rounded-xl px-3.5 py-2 text-xs font-bold text-[#191b25] flex items-center justify-between">
                  <span className="truncate">{currentVehicle.location}</span>
                  <span className="text-[10px] bg-[#0034c5] text-white px-2 py-0.5 rounded-md shrink-0 ml-2">
                    {currentVehicle.area}
                  </span>
                </div>
              </div>
            </div>

            {/* Estimated Mileage Slider & Presets */}
            <div className="bg-[#fbf8ff] p-4 rounded-xl border border-[#e2e1f0] space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-[#191b25] flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-[#0034c5]" />
                  <span>Estimated Trip Distance: <strong className="text-[#0034c5]">{estimatedKm} km</strong></span>
                </div>
                <span className="text-xs font-bold text-[#0034c5]">
                  +${mileageFare.toFixed(2)} SGD (${currentVehicle.mileageRatePerKm}/km)
                </span>
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

              {/* Quick Distance Presets */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label: '20 km (Short Run)', km: 20 },
                  { label: '45 km (Standard)', km: 45 },
                  { label: '80 km (Island Tour)', km: 80 },
                  { label: '150 km (Full Day)', km: 150 },
                  { label: '250 km (Max)', km: 250 },
                ].map(preset => (
                  <button
                    key={preset.km}
                    type="button"
                    onClick={() => setEstimatedKm(preset.km)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      estimatedKm === preset.km
                        ? 'bg-[#0034c5] text-white border-[#0034c5]'
                        : 'bg-white text-[#434657] border-[#c4c5da] hover:bg-[#dde1ff]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Driver Singpass Verification & Protection Add-ons */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-[#191b25]">
                  Driver Credentials & Singpass Verification
                </h3>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Singpass Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#fbf8ff] p-3 rounded-xl border border-[#e2e1f0]">
                <div className="text-[#545e77]">Driver Name</div>
                <div className="font-bold text-[#191b25] text-sm mt-0.5">{userProfile.name || 'Susan Tan'}</div>
              </div>
              <div className="bg-[#fbf8ff] p-3 rounded-xl border border-[#e2e1f0]">
                <div className="text-[#545e77]">Driving License Status</div>
                <div className="font-bold text-emerald-700 text-sm mt-0.5">Class 3 / 3A (Valid)</div>
              </div>
            </div>

            {/* Protection Toggles */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-[#191b25] uppercase tracking-wider">
                Coverage & Green Initiatives
              </h4>

              {/* CDW+ */}
              <div
                onClick={() => setCdwPlus(!cdwPlus)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  cdwPlus ? 'bg-blue-50/70 border-[#0034c5]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border ${
                    cdwPlus ? 'bg-[#0034c5] border-[#0034c5] text-white' : 'bg-white border-slate-300'
                  }`}>
                    {cdwPlus && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#191b25] flex items-center gap-2">
                      <span>CDW+ Collision Damage Waiver (Zero Excess)</span>
                      <span className="text-[10px] bg-[#0034c5] text-white font-bold px-1.5 py-0.5 rounded">Recommended</span>
                    </div>
                    <div className="text-[11px] text-[#545e77] mt-0.5">
                      Reduces accident excess liability from S$2,500 down to S$0. Full coverage.
                    </div>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-[#0034c5] shrink-0 ml-2">
                  +${(5.50 * Math.max(1, Math.ceil(hours / 4))).toFixed(2)} SGD
                </div>
              </div>

              {/* Eco Carbon Donation */}
              <div
                onClick={() => setEcoDonation(!ecoDonation)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  ecoDonation ? 'bg-emerald-50/70 border-emerald-500' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border ${
                    ecoDonation ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300'
                  }`}>
                    {ecoDonation && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#191b25] flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Singapore National Parks Tree Planting Offset</span>
                    </div>
                    <div className="text-[11px] text-[#545e77] mt-0.5">
                      Earn +25 Bonus EcoPoints & plant urban trees across Singapore
                    </div>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-emerald-700 shrink-0 ml-2">
                  +$1.50 SGD
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Price Breakdown, Payment & Confirm (4-5 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Itemized Order Summary Box */}
          <div className="bg-white rounded-2xl border-2 border-[#c4c5da] p-6 shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e1f0]">
              <div>
                <h3 className="text-lg font-bold text-[#191b25]">Reservation Summary</h3>
                <p className="text-xs text-[#545e77]">{currentVehicle.name} • {hours} Hours</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Verified Rate
                </span>
              </div>
            </div>

            {/* Schedule Snapshot */}
            <div className="bg-[#fbf8ff] p-3.5 rounded-xl border border-[#e2e1f0] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#545e77]">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-[#0034c5]" /> Pick-up Date:
                </span>
                <span className="font-bold text-[#191b25]">
                  {DATE_OPTIONS.find(o => o.value === selectedDate)?.shortLabel}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#545e77]">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#0034c5]" /> Duration & Time:
                </span>
                <span className="font-bold text-[#191b25]">
                  {hours} hrs ({pickupTime})
                </span>
              </div>
              <div className="flex items-center justify-between text-[#545e77]">
                <span className="flex items-center gap-1.5 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#0034c5]" /> Hub Location:
                </span>
                <span className="font-bold text-[#191b25] truncate max-w-[140px]">
                  {currentVehicle.location}
                </span>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2.5 text-xs text-[#434657]">
              <div className="flex justify-between items-center">
                <span>Base Time ({hours} hrs @ ${currentVehicle.hourlyRateOffPeak}/h)</span>
                <span className="font-bold text-[#191b25]">${baseFare.toFixed(2)} SGD</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Estimated Distance ({estimatedKm} km @ ${currentVehicle.mileageRatePerKm}/km)</span>
                <span className="font-bold text-[#191b25]">${mileageFare.toFixed(2)} SGD</span>
              </div>

              {cdwPlus && (
                <div className="flex justify-between items-center text-blue-900 font-medium">
                  <span>CDW+ Zero Excess Protection</span>
                  <span className="font-bold">${insuranceFare.toFixed(2)} SGD</span>
                </div>
              )}

              {ecoDonation && (
                <div className="flex justify-between items-center text-emerald-800 font-medium">
                  <span>NParks Urban Greening Offset</span>
                  <span className="font-bold">${greenDonationFare.toFixed(2)} SGD</span>
                </div>
              )}

              {promoApplied && (
                <div className="flex justify-between items-center text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">
                  <span>Promo Code Discount</span>
                  <span>-${discount.toFixed(2)} SGD</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-[#545e77]">
                <span>Includes 9% Singapore GST</span>
                <span>${(totalCost * 0.09).toFixed(2)} SGD</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="pt-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#545e77] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo Code (e.g. GREEN2026)"
                    className="w-full pl-8 pr-2 py-2 text-xs font-semibold uppercase bg-slate-50 border border-[#c4c5da] rounded-lg focus:outline-hidden focus:border-[#0034c5]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3 py-2 bg-[#0034c5] text-white text-xs font-bold rounded-lg hover:bg-[#00248c] transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {!promoApplied && (
                <button
                  type="button"
                  onClick={() => { setPromoCode('GREEN2026'); setPromoApplied(true); showToast('GREEN2026 Applied: S$15 OFF!'); }}
                  className="text-[11px] text-[#0034c5] font-semibold hover:underline mt-1 cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" /> Apply coupon: GREEN2026 (-$15)
                </button>
              )}
            </div>

            {/* Total Fare Display */}
            <div className="p-4 bg-gradient-to-r from-[#0034c5] to-[#00248c] text-white rounded-xl space-y-1 shadow-md">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-blue-100">Estimated Total Fare</span>
                <span className="text-2xl font-black">${totalCost.toFixed(2)} <span className="text-xs font-normal">SGD</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-emerald-300 pt-1 border-t border-white/20">
                <span>Earn +{ecoPointsEarned} EcoPoints</span>
                <span>Save {co2SavedKg} kg CO₂</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#191b25]">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'PayNow', label: 'PayNow QR', icon: QrCode },
                  { id: 'Credit Card', label: 'Card / Pay', icon: CreditCard },
                  { id: 'EcoPoints', label: 'EcoPoints', icon: Leaf },
                ].map(method => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === method.id
                          ? 'border-[#0034c5] bg-[#dde1ff] text-[#0034c5] font-bold shadow-xs'
                          : 'border-[#c4c5da] bg-white text-[#545e77] hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px]">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confirm & Book CTA */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmReservation}
              className="w-full py-3.5 px-4 bg-[#0034c5] hover:bg-[#00248c] disabled:bg-slate-400 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Confirming EV Reservation...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Confirm & Book EV Now (${totalCost.toFixed(2)} SGD)</span>
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="space-y-2 pt-1 text-[11px] text-[#545e77]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Free cancellation up to 30 mins before scheduled start.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Bluetooth Digital Key auto-activates immediately upon confirmation.</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#0034c5] shrink-0" />
                <span>24/7 Roadside Assistance: <strong>+65 6789 2277</strong></span>
              </div>
            </div>

          </div>

          {/* Need Assistance Pill */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center justify-between text-xs shadow-xs">
            <div>
              <div className="font-bold text-[#191b25]">Questions about booking?</div>
              <div className="text-[#545e77]">Speak to our EV Concierge live support</div>
            </div>
            <button
              type="button"
              onClick={onOpenSupport}
              className="px-3 py-1.5 bg-[#f3f2ff] hover:bg-[#dde1ff] text-[#0034c5] font-bold rounded-lg transition-colors cursor-pointer border border-[#c4c5da]"
            >
              Live Chat
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
