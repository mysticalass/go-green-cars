import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Car, 
  KeyRound, 
  Lock, 
  Unlock, 
  Zap, 
  Leaf, 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Copy, 
  Download, 
  QrCode, 
  AlertCircle, 
  ArrowRight, 
  Navigation, 
  Sparkles, 
  Smartphone, 
  Fuel, 
  Bell, 
  Info,
  DollarSign,
  Share2,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { Booking, UserEcoProfile, Vehicle } from '../types';
import { VEHICLES_DATA } from '../data/mockData';

interface ProfileViewProps {
  userProfile: UserEcoProfile;
  bookings: Booking[];
  onSelectVehicleToBook: (vehicle: Vehicle) => void;
  onNavigateToLocations: () => void;
  onOpenSupport: () => void;
  onCancelBooking?: (bookingId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  bookings,
  onSelectVehicleToBook,
  onNavigateToLocations,
  onOpenSupport,
  onCancelBooking
}) => {
  const [activeTab, setActiveTab] = useState<'confirmations' | 'select' | 'credentials'>('confirmations');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'confirmed' | 'completed'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Digital Bluetooth Key simulation states
  const [lockedStates, setLockedStates] = useState<Record<string, boolean>>({});
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [selectedReceiptBooking, setSelectedReceiptBooking] = useState<Booking | null>(null);
  const [qrModalBooking, setQrModalBooking] = useState<Booking | null>(null);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    showFeedback(`Booking reference #${text} copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const toggleLock = (bookingId: string, currentStatus?: boolean) => {
    const isCurrentlyLocked = lockedStates[bookingId] ?? true;
    const newLockState = !isCurrentlyLocked;
    setLockedStates(prev => ({ ...prev, [bookingId]: newLockState }));
    if (newLockState) {
      showFeedback('🔒 Bluetooth Key: Vehicle doors locked & immobilizer armed.');
    } else {
      showFeedback('⚡ Bluetooth Key: Doors UNLOCKED. Welcome aboard Go Green EV!');
    }
  };

  const handleBeep = (vehicleName: string) => {
    showFeedback(`🚨 Hazard lights flashing & horn sounded on ${vehicleName} for 5 seconds.`);
  };

  const filteredBookings = bookings.filter(b => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  const activeBookingsCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'active').length;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Feedback Notification */}
      {actionFeedback && (
        <div className="fixed top-24 right-6 z-50 bg-[#001257] text-white px-5 py-3 rounded-xl shadow-2xl border border-blue-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{actionFeedback}</span>
        </div>
      )}

      {/* Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c4c5da] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-blue-100/60 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* User Details */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#0034c5] to-[#001257] text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md shrink-0">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#191b25] tracking-tight">{userProfile.name}</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Singpass Verified Driver
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0034c5] border border-blue-200">
                  <Zap className="w-3.5 h-3.5" /> Class 3 / 3A Ready
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#545e77] flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>{userProfile.email}</span>
                <span>•</span>
                <span>Singapore (+65) 9123 4567</span>
                <span>•</span>
                <span className="font-semibold text-[#0034c5]">{userProfile.tier} Member</span>
              </p>
            </div>
          </div>

          {/* Quick EcoPoints & Active Confirmation Badge */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="bg-[#f3f2ff] p-3.5 rounded-2xl border border-[#c4c5da] text-center min-w-[130px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#545e77]">EcoPoints Balance</span>
              <div className="text-xl font-bold text-[#0034c5] mt-0.5">{userProfile.ecoPoints} pts</div>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center justify-center gap-0.5">
                <Leaf className="w-2.5 h-2.5" /> Tier 1 Saver
              </span>
            </div>

            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-center min-w-[140px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Confirmed Cars</span>
              <div className="text-xl font-bold text-emerald-900 mt-0.5">
                {activeBookingsCount} Active
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">
                {bookings.length} Total Booked
              </span>
            </div>
          </div>
        </div>

        {/* Quick Driver Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="bg-[#fbf8ff] p-3 rounded-xl border border-slate-200">
            <span className="text-[#545e77] block text-[11px]">Total EV Trips</span>
            <span className="text-base font-bold text-[#191b25]">{userProfile.totalTrips + bookings.length} trips</span>
          </div>
          <div className="bg-[#fbf8ff] p-3 rounded-xl border border-slate-200">
            <span className="text-[#545e77] block text-[11px]">Clean EV Distance</span>
            <span className="text-base font-bold text-[#191b25]">{userProfile.totalKmDriven} km</span>
          </div>
          <div className="bg-[#fbf8ff] p-3 rounded-xl border border-slate-200">
            <span className="text-[#545e77] block text-[11px]">Tailpipe CO₂ Avoided</span>
            <span className="text-base font-bold text-emerald-700">{userProfile.totalCo2SavedKg} kg</span>
          </div>
          <div className="bg-[#fbf8ff] p-3 rounded-xl border border-slate-200">
            <span className="text-[#545e77] block text-[11px]">Money Saved vs Petrol</span>
            <span className="text-base font-bold text-[#0034c5]">S${userProfile.savedMoneyVsPetrolSgd.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation inside Profile */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#c4c5da] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('confirmations')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'confirmations'
                ? 'bg-[#0034c5] text-white shadow-xs'
                : 'bg-white text-[#545e77] hover:bg-[#f3f2ff] hover:text-[#0034c5] border border-[#c4c5da]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirmed Cars & Reservations ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('select')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'select'
                ? 'bg-[#0034c5] text-white shadow-xs'
                : 'bg-white text-[#545e77] hover:bg-[#f3f2ff] hover:text-[#0034c5] border border-[#c4c5da]'
            }`}
          >
            <Car className="w-4 h-4" />
            Select & Reserve Another EV
          </button>

          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'credentials'
                ? 'bg-[#0034c5] text-white shadow-xs'
                : 'bg-white text-[#545e77] hover:bg-[#f3f2ff] hover:text-[#0034c5] border border-[#c4c5da]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Driver Credentials & Pass
          </button>
        </div>

        {activeTab === 'confirmations' && (
          <div className="flex items-center gap-1.5 text-xs bg-white p-1 rounded-xl border border-[#c4c5da]">
            <button
              onClick={() => setBookingFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                bookingFilter === 'all' ? 'bg-[#dde1ff] text-[#0034c5]' : 'text-[#545e77] hover:text-[#191b25]'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setBookingFilter('confirmed')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                bookingFilter === 'confirmed' ? 'bg-[#dde1ff] text-[#0034c5]' : 'text-[#545e77] hover:text-[#191b25]'
              }`}
            >
              Active / Confirmed ({bookings.filter(b => b.status === 'confirmed' || b.status === 'active').length})
            </button>
            <button
              onClick={() => setBookingFilter('completed')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                bookingFilter === 'completed' ? 'bg-[#dde1ff] text-[#0034c5]' : 'text-[#545e77] hover:text-[#191b25]'
              }`}
            >
              Completed ({bookings.filter(b => b.status === 'completed').length})
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: CONFIRMED CARS & RESERVATIONS CONFIRMATION PAGE */}
      {activeTab === 'confirmations' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#191b25] flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                Vehicle Reservation Confirmations
              </h2>
              <p className="text-xs sm:text-sm text-[#545e77] mt-0.5">
                Official booking receipts, digital Bluetooth unlock keys, charging instructions, and trip details for all cars reserved on this website.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('select')}
              className="px-4 py-2.5 bg-[#0034c5] hover:bg-[#00248c] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Car className="w-4 h-4" />
              + Reserve Another Vehicle
            </button>
          </div>

          {filteredBookings.length > 0 ? (
            <div className="space-y-6">
              {filteredBookings.map((booking) => {
                const isLocked = lockedStates[booking.id] ?? true;
                const isConfirmed = booking.status === 'confirmed' || booking.status === 'active';

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-3xl border border-[#c4c5da] overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                  >
                    {/* Confirmation Status Header Strip */}
                    <div className={`px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b ${
                      isConfirmed ? 'bg-[#f3f2ff] border-[#c4c5da]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                          isConfirmed 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isConfirmed ? 'CONFIRMED & READY FOR PICKUP' : 'TRIP COMPLETED'}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-[#545e77]">Booking Ref:</span>
                          <span className="font-mono font-bold text-xs sm:text-sm text-[#0034c5] bg-white px-2 py-0.5 rounded border border-[#c4c5da]">
                            {booking.id}
                          </span>
                          <button
                            onClick={() => handleCopy(booking.id, booking.id)}
                            className="text-[#545e77] hover:text-[#0034c5] p-1 cursor-pointer"
                            title="Copy booking ID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#545e77]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#0034c5]" />
                          {new Date(booking.startTime).toLocaleDateString('en-SG', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#0034c5]" />
                          {booking.durationHours} Hours Rental
                        </span>
                      </div>
                    </div>

                    {/* Main Confirmation Content Body */}
                    <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: Vehicle Image & Essential Specs */}
                      <div className="lg:col-span-4 space-y-4">
                        <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-16/10">
                          <img
                            src={booking.vehicle.image}
                            alt={booking.vehicle.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <Leaf className="w-3 h-3 text-emerald-400" />
                            {booking.vehicle.category}
                          </div>
                          <div className="absolute bottom-2.5 right-2.5 bg-[#0034c5] text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded">
                            {booking.vehicle.plateNumber}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-[#191b25]">{booking.vehicle.name}</h3>
                          <p className="text-xs text-[#545e77]">{booking.vehicle.subtitle || `${booking.vehicle.seats} Seater EV`}</p>
                        </div>

                        {/* Battery & Charging Telemetry */}
                        <div className="bg-[#fbf8ff] p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-[#545e77] flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5 text-amber-500" /> Live Battery Level:
                            </span>
                            <span className="font-bold text-[#191b25]">{booking.vehicle.currentBatteryPercent}% ({booking.vehicle.rangeKm} km)</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all"
                              style={{ width: `${booking.vehicle.currentBatteryPercent}%` }}
                            ></div>
                          </div>
                          <div className="text-[11px] text-[#545e77] flex justify-between">
                            <span>Network: {booking.vehicle.chargingNetwork}</span>
                            <span className="text-emerald-700 font-semibold">100% Free Charging</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Pick-up Location & Schedule Details */}
                      <div className="lg:col-span-4 space-y-5">
                        {/* Pick up Station */}
                        <div className="bg-[#f3f2ff] p-4 rounded-2xl border border-[#c4c5da] space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0034c5] block">
                            Pick-up & Return Station
                          </span>
                          <div className="font-bold text-sm text-[#191b25] flex items-start gap-1.5">
                            <MapPin className="w-4 h-4 text-[#0034c5] shrink-0 mt-0.5" />
                            <span>{booking.pickupLocation}</span>
                          </div>
                          <button
                            onClick={onNavigateToLocations}
                            className="text-xs font-bold text-[#0034c5] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                          >
                            <Navigation className="w-3.5 h-3.5" /> View on Live Location Map & Directions
                          </button>
                        </div>

                        {/* Schedule breakdown */}
                        <div className="border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
                          <h4 className="font-bold text-[#191b25] text-sm">Rental Schedule & Estimated Usage</h4>
                          
                          <div className="grid grid-cols-2 gap-2 text-[#434657]">
                            <div>
                              <span className="text-[11px] text-[#545e77] block">Start Time:</span>
                              <span className="font-semibold text-[#191b25]">
                                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div>
                              <span className="text-[11px] text-[#545e77] block">Return By:</span>
                              <span className="font-semibold text-[#191b25]">
                                {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div>
                              <span className="text-[11px] text-[#545e77] block">Planned Distance:</span>
                              <span className="font-semibold text-[#191b25]">{booking.estimatedKm} km</span>
                            </div>
                            <div>
                              <span className="text-[11px] text-[#545e77] block">CO₂ Saved:</span>
                              <span className="font-bold text-emerald-700">{booking.co2SavedKg} kg CO₂</span>
                            </div>
                          </div>
                        </div>

                        {/* Smart Digital Bluetooth Key Control */}
                        {isConfirmed && (
                          <div className="bg-gradient-to-br from-[#001257] to-[#0034c5] text-white p-4 sm:p-5 rounded-2xl shadow-md space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <KeyRound className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-bold uppercase tracking-wider">Digital Bluetooth Key</span>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isLocked ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                              }`}>
                                {isLocked ? 'DOORS LOCKED' : 'DOORS UNLOCKED'}
                              </span>
                            </div>

                            <p className="text-[11px] text-blue-100">
                              Instant smartphone BLE access within 5 meters of EV parking lot. No physical key required.
                            </p>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <button
                                onClick={() => toggleLock(booking.id, isLocked)}
                                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                                  isLocked 
                                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white' 
                                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                                }`}
                              >
                                {isLocked ? (
                                  <>
                                    <Unlock className="w-3.5 h-3.5" /> Unlock Car (BLE)
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3.5 h-3.5" /> Lock Car Doors
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleBeep(booking.vehicle.name)}
                                className="py-2.5 px-3 rounded-xl font-bold text-xs bg-white/15 hover:bg-white/25 text-white border border-white/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Bell className="w-3.5 h-3.5 text-blue-200" /> Beep & Flash
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Payment & Official Receipt Breakdown */}
                      <div className="lg:col-span-4 bg-[#fbf8ff] p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                            <h4 className="font-bold text-sm text-[#191b25]">Payment & Tax Receipt</h4>
                            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              ✓ Paid via {booking.paymentMethod}
                            </span>
                          </div>

                          {/* Line items */}
                          <div className="space-y-2 text-xs text-[#545e77]">
                            <div className="flex justify-between">
                              <span>Hourly Base ({booking.durationHours} hrs × S${booking.vehicle.hourlyRateOffPeak.toFixed(2)}):</span>
                              <span className="font-semibold text-[#191b25]">S${booking.baseFare.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Mileage Energy ({booking.estimatedKm} km × S${booking.vehicle.mileageRatePerKm.toFixed(2)}):</span>
                              <span className="font-semibold text-[#191b25]">S${booking.mileageFare.toFixed(2)}</span>
                            </div>
                            {booking.insuranceFare > 0 && (
                              <div className="flex justify-between">
                                <span>CDW+ Zero Excess Protection:</span>
                                <span className="font-semibold text-[#191b25]">S${booking.insuranceFare.toFixed(2)}</span>
                              </div>
                            )}
                            {booking.discount > 0 && (
                              <div className="flex justify-between text-emerald-700 font-semibold">
                                <span>EcoPoints / Promo Voucher:</span>
                                <span>-S${booking.discount.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-[11px] text-slate-400">
                              <span>GST (9% Singapore Tax Included):</span>
                              <span>S${(booking.totalCost * 0.09).toFixed(2)}</span>
                            </div>

                            <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm">
                              <span className="font-bold text-[#191b25]">Total Paid:</span>
                              <span className="font-bold text-lg text-[#0034c5]">S${booking.totalCost.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Confirmation Actions */}
                        <div className="space-y-2 pt-4 border-t border-slate-200">
                          <button
                            onClick={() => setQrModalBooking(booking)}
                            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#dde1ff] text-[#0034c5] border border-[#c4c5da] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <QrCode className="w-4 h-4" /> View Digital QR Entry Ticket
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setSelectedReceiptBooking(booking)}
                              className="py-2 px-2.5 rounded-lg bg-white hover:bg-slate-100 text-[#191b25] border border-slate-200 font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-[#545e77]" /> Tax Invoice
                            </button>

                            <button
                              onClick={onOpenSupport}
                              className="py-2 px-2.5 rounded-lg bg-white hover:bg-slate-100 text-[#0034c5] border border-slate-200 font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Smartphone className="w-3.5 h-3.5" /> 24/7 Help
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-[#c4c5da] text-center space-y-4">
              <div className="w-16 h-16 bg-[#f3f2ff] rounded-2xl flex items-center justify-center mx-auto text-[#0034c5]">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#191b25]">No car reservations found in this view</h3>
              <p className="text-xs sm:text-sm text-[#545e77] max-w-md mx-auto">
                Ready to drive Singapore's cleanest 100% electric fleet? Pick a model below to reserve and get instant confirmation.
              </p>
              <button
                onClick={() => setActiveTab('select')}
                className="px-6 py-3 bg-[#0034c5] hover:bg-[#00248c] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Browse & Reserve an EV Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SELECT & RESERVE ANOTHER EV (QUICK SELECTOR) */}
      {activeTab === 'select' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#191b25]">
                Select an Electric Car to Confirm
              </h2>
              <p className="text-xs sm:text-sm text-[#545e77] mt-0.5">
                Choose any electric vehicle from our island-wide fleet. Confirming will generate an instant reservation receipt and Bluetooth digital key in your Profile.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('confirmations')}
              className="text-xs font-bold text-[#0034c5] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              ← Back to My Confirmations
            </button>
          </div>

          {/* Quick Vehicle Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VEHICLES_DATA.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-2xl border border-[#c4c5da] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#0034c5] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                    {vehicle.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/75 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                    {vehicle.seats} Seats • {vehicle.rangeKm} km
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-base text-[#191b25]">{vehicle.name}</h3>
                    <p className="text-xs text-[#545e77] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0034c5] shrink-0" />
                      <span className="truncate">{vehicle.location}</span>
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                      <span className="bg-[#f3f2ff] text-[#0034c5] px-2 py-0.5 rounded font-medium">
                        Off-Peak S${vehicle.hourlyRateOffPeak.toFixed(2)}/hr
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        S${vehicle.mileageRatePerKm.toFixed(2)}/km
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectVehicleToBook(vehicle)}
                    className="w-full py-2.5 bg-[#0034c5] hover:bg-[#00248c] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Select & Reserve This Car
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DRIVER CREDENTIALS & SINGPASS STATUS */}
      {activeTab === 'credentials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#c4c5da] space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#191b25]">Singpass MyInfo Verification</h3>
                <span className="text-xs text-emerald-700 font-semibold">Verified on 12 Jan 2026</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#434657]">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-[#545e77]">Driver Name:</span>
                <span className="font-bold text-[#191b25]">{userProfile.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-[#545e77]">NRIC / FIN:</span>
                <span className="font-mono font-semibold">S••••789A</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-[#545e77]">Driving License Class:</span>
                <span className="font-bold text-[#0034c5]">Class 3 / 3A (Qualified Motor Car)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-[#545e77]">Demerit Points:</span>
                <span className="font-bold text-emerald-700">0 Points (Clean Record)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#545e77]">CDW+ Zero Excess Insurance:</span>
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Active & Covered</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#c4c5da] space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0034c5] flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#191b25]">Payment Methods & Wallet</h3>
                <span className="text-xs text-[#545e77]">Instant automated checkout for trips</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#f3f2ff] border border-blue-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-white flex items-center justify-center font-bold text-[#0034c5] border border-slate-200">
                    P
                  </div>
                  <div>
                    <div className="font-bold text-[#191b25]">PayNow (Singapore FAST)</div>
                    <div className="text-[11px] text-[#545e77]">Linked to +65 9123 4567 (Default)</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase bg-[#0034c5] text-white px-2 py-0.5 rounded">
                  Primary
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                    💳
                  </div>
                  <div>
                    <div className="font-bold text-[#191b25]">Visa Signature •••• 4242</div>
                    <div className="text-[11px] text-[#545e77]">Expires 08/28</div>
                  </div>
                </div>
                <span className="text-xs text-[#545e77]">Secondary</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DIGITAL QR PASS */}
      {qrModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#0034c5] bg-blue-100 px-2.5 py-1 rounded-full">
                Go Green Cars Digital Pass
              </span>
              <button
                onClick={() => setQrModalBooking(null)}
                className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#191b25]">{qrModalBooking.vehicle.name}</h3>
              <p className="text-xs text-[#545e77]">Plate: {qrModalBooking.vehicle.plateNumber}</p>
            </div>

            {/* QR Visual */}
            <div className="p-6 bg-[#fbf8ff] border-2 border-dashed border-[#0034c5]/30 rounded-2xl inline-block mx-auto">
              <div className="w-44 h-44 bg-white p-3 rounded-xl shadow-xs flex flex-col items-center justify-center border border-slate-200">
                <QrCode className="w-36 h-36 text-[#001257]" />
              </div>
            </div>

            <div className="text-xs text-[#545e77] space-y-1">
              <p className="font-mono font-bold text-sm text-[#0034c5]">{qrModalBooking.id}</p>
              <p>Scan at carpark gantry barrier or hold near vehicle windshield reader.</p>
            </div>

            <button
              onClick={() => setQrModalBooking(null)}
              className="w-full py-2.5 bg-[#0034c5] text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-[#00248c]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* MODAL: TAX INVOICE */}
      {selectedReceiptBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-[#0034c5] uppercase tracking-wider">Official Tax Invoice</span>
                <h3 className="text-xl font-bold text-[#191b25] mt-1">Go Green Cars Pte. Ltd.</h3>
                <p className="text-[11px] text-[#545e77]">UEN: 202601992E • GST Reg: M90382109</p>
              </div>
              <button
                onClick={() => setSelectedReceiptBooking(null)}
                className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#fbf8ff] p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Invoice Ref:</span>
                  <span className="font-mono font-bold text-[#191b25]">{selectedReceiptBooking.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Billed To:</span>
                  <span className="font-bold text-[#191b25]">{selectedReceiptBooking.userName}</span>
                </div>
              </div>

              <div className="space-y-2 divide-y divide-slate-100 pt-2">
                <div className="flex justify-between py-1">
                  <span>{selectedReceiptBooking.vehicle.name} ({selectedReceiptBooking.durationHours} hrs rental)</span>
                  <span className="font-semibold">S${selectedReceiptBooking.baseFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Electricity & Mileage ({selectedReceiptBooking.estimatedKm} km)</span>
                  <span className="font-semibold">S${selectedReceiptBooking.mileageFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>CDW+ Comprehensive Coverage</span>
                  <span className="font-semibold">S${selectedReceiptBooking.insuranceFare.toFixed(2)}</span>
                </div>
                {selectedReceiptBooking.discount > 0 && (
                  <div className="flex justify-between py-1 text-emerald-700 font-semibold">
                    <span>Voucher Credit</span>
                    <span>-S${selectedReceiptBooking.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 text-sm font-bold text-[#191b25]">
                  <span>Total Amount Paid</span>
                  <span className="text-[#0034c5]">S${selectedReceiptBooking.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#191b25] text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Print / Save PDF
              </button>
              <button
                onClick={() => setSelectedReceiptBooking(null)}
                className="px-5 py-2 bg-[#0034c5] hover:bg-[#00248c] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
