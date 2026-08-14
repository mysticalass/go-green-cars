import React, { useState } from 'react';
import { Vehicle, Booking } from '../types';
import { X, CheckCircle2, Shield, Lock, Unlock, Zap, Car, Leaf, CreditCard, QrCode, Smartphone, AlertCircle, KeyRound, Bell } from 'lucide-react';

interface BookingModalProps {
  vehicle: Vehicle | null;
  initialHours?: number;
  initialEstimatedKm?: number;
  onClose: () => void;
  onCompleteBooking: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  vehicle,
  initialHours = 3,
  initialEstimatedKm = 40,
  onClose,
  onCompleteBooking
}) => {
  if (!vehicle) return null;

  const [step, setStep] = useState<'details' | 'license' | 'payment' | 'confirmed'>('details');
  const [hours, setHours] = useState(initialHours);
  const [estimatedKm, setEstimatedKm] = useState(initialEstimatedKm);
  const [cdwPlus, setCdwPlus] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'PayNow' | 'Credit Card' | 'EcoPoints'>('PayNow');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [licenseVerified, setLicenseVerified] = useState(true);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  
  // Digital Bluetooth Key simulation states
  const [keyLocked, setKeyLocked] = useState(true);
  const [hazardFlash, setHazardFlash] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const baseFare = hours * vehicle.hourlyRateOffPeak;
  const mileageFare = estimatedKm * vehicle.mileageRatePerKm;
  const insuranceFare = cdwPlus ? 5.50 * Math.ceil(hours / 4) : 0.00;
  const discount = promoApplied ? 15.00 : 0.00;
  const totalCost = Math.max(0, baseFare + mileageFare + insuranceFare - discount);
  const co2SavedKg = Number((estimatedKm * vehicle.co2SavedPerKmKg).toFixed(2));

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'GREEN2026' || promoCode.trim().toUpperCase() === 'GOGREEN') {
      setPromoApplied(true);
      showToast('Promo code applied: S$15.00 discount credited!');
    } else {
      alert('Enter promo code GREEN2026 for S$15 OFF your ride.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConfirmReservation = () => {
    const newBooking: Booking = {
      id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      vehicleId: vehicle.id,
      vehicle: vehicle,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + hours * 3600000).toISOString(),
      durationHours: hours,
      estimatedKm: estimatedKm,
      baseFare: baseFare,
      mileageFare: mileageFare,
      insuranceFare: insuranceFare,
      discount: discount,
      totalCost: totalCost,
      co2SavedKg: co2SavedKg,
      status: 'confirmed',
      pickupLocation: vehicle.location,
      userName: 'Susan Tan',
      userEmail: 'susantan@gmail.com',
      licenseVerified: true,
      paymentMethod: paymentMethod,
      digitalKeyUnlocked: false
    };

    setCreatedBooking(newBooking);
    onCompleteBooking(newBooking);
    setStep('confirmed');
  };

  const handleUnlockVehicle = () => {
    setKeyLocked(false);
    showToast('⚡ Bluetooth Signal Sent: Vehicle doors UNLOCKED. Immobilizer disarmed!');
  };

  const handleLockVehicle = () => {
    setKeyLocked(true);
    showToast('🔒 Vehicle doors LOCKED securely.');
  };

  const handleBeepHazard = () => {
    setHazardFlash(true);
    showToast('🚨 Hazard lights flashing & horn sounded for 5 seconds!');
    setTimeout(() => setHazardFlash(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#c4c5da] overflow-hidden my-6 relative flex flex-col max-h-[90vh]">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#191b25] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-white/20 flex items-center gap-2 animate-bounce">
            <Bell className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#fbf8ff]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#0034c5] text-white flex items-center justify-center font-bold text-xs">
              EV
            </span>
            <div>
              <h3 className="font-bold text-[#191b25] text-base leading-tight">
                {step === 'confirmed' ? 'Booking Confirmed & Digital Key' : 'Reserve Electric Vehicle'}
              </h3>
              <p className="text-xs text-[#545e77]">{vehicle.name} • {vehicle.plateNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#747688] hover:text-[#191b25] hover:bg-[#f3f2ff]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Progress (when not confirmed) */}
        {step !== 'confirmed' && (
          <div className="flex border-b border-[#E2E8F0] bg-white text-xs font-bold text-center">
            <div className={`flex-1 py-2.5 border-b-2 ${step === 'details' ? 'border-[#0034c5] text-[#0034c5]' : 'border-transparent text-[#747688]'}`}>
              1. Trip Details
            </div>
            <div className={`flex-1 py-2.5 border-b-2 ${step === 'license' ? 'border-[#0034c5] text-[#0034c5]' : 'border-transparent text-[#747688]'}`}>
              2. Singpass ID Check
            </div>
            <div className={`flex-1 py-2.5 border-b-2 ${step === 'payment' ? 'border-[#0034c5] text-[#0034c5]' : 'border-transparent text-[#747688]'}`}>
              3. Payment & Confirm
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
          {/* STEP 1: TRIP DETAILS */}
          {step === 'details' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-[#f3f2ff] p-4 rounded-xl border border-[#E2E8F0]">
                <img src={vehicle.image} alt={vehicle.name} className="w-24 h-16 object-contain" />
                <div>
                  <h4 className="font-bold text-sm text-[#191b25]">{vehicle.name}</h4>
                  <p className="text-xs text-[#545e77]">{vehicle.location}</p>
                  <p className="text-xs font-semibold text-emerald-700 mt-1">
                    ⚡ {vehicle.currentBatteryPercent}% Battery ({vehicle.rangeKm} km Range)
                  </p>
                </div>
              </div>

              {/* Rental Duration Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#191b25] mb-1">
                  <span>Rental Duration: {hours} hours</span>
                  <span className="text-[#0034c5]">${(hours * vehicle.hourlyRateOffPeak).toFixed(2)} SGD</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full accent-[#0034c5] cursor-pointer"
                />
              </div>

              {/* Estimated Km Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#191b25] mb-1">
                  <span>Estimated Distance: {estimatedKm} km</span>
                  <span className="text-[#0034c5]">${(estimatedKm * vehicle.mileageRatePerKm).toFixed(2)} SGD</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="250"
                  step="5"
                  value={estimatedKm}
                  onChange={(e) => setEstimatedKm(Number(e.target.value))}
                  className="w-full accent-[#0034c5] cursor-pointer"
                />
              </div>

              {/* Insurance Option */}
              <div className="border border-[#c4c5da] p-3.5 rounded-xl bg-white space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#0034c5]" />
                    <span className="text-xs font-bold text-[#191b25]">CDW Plus Zero-Excess Protection</span>
                  </div>
                  <span className="text-xs font-bold text-[#0034c5]">+$5.50</span>
                </div>
                <p className="text-[11px] text-[#545e77]">
                  Reduces insurance excess from $3,000 to $0 in case of accidental damage. Includes 24/7 roadside recovery.
                </p>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={cdwPlus}
                    onChange={(e) => setCdwPlus(e.target.checked)}
                    className="rounded border-[#c4c5da] text-[#0034c5] h-4 w-4"
                  />
                  <span className="text-xs font-semibold text-[#191b25]">Add CDW Plus coverage (Recommended)</span>
                </label>
              </div>

              {/* Promo Code Box */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (try: GREEN2026)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-[#c4c5da] rounded-lg focus:outline-hidden uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-[#f3f2ff] hover:bg-[#dde1ff] text-[#0034c5] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* Carbon summary preview */}
              <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <Leaf className="w-4 h-4 text-emerald-600" /> Carbon Avoidance:
                </span>
                <span className="font-bold">{co2SavedKg} kg CO₂e saved (+{Math.round(co2SavedKg * 10)} EcoPoints)</span>
              </div>
            </div>
          )}

          {/* STEP 2: SINGPASS LICENSE VERIFICATION */}
          {step === 'license' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#191b25]">Singpass MyInfo Verified</h4>
                <p className="text-xs text-[#545e77] max-w-sm mx-auto mt-1">
                  Singapore Class 3A Driving License is active and eligible for instant keyless access.
                </p>
              </div>

              <div className="bg-[#fbf8ff] p-4 rounded-xl border border-[#c4c5da] text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#545e77]">Driver Name:</span>
                  <span className="font-bold text-[#191b25]">Susan Tan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#545e77]">License Class:</span>
                  <span className="font-bold text-[#191b25]">Class 3 / 3A (Qualified &gt; 2 yrs)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#545e77]">Demerit Points:</span>
                  <span className="font-bold text-emerald-600">0 Points (Clean Record)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#545e77]">ID Verification:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 inline" /> Singpass Authenticated
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD & SUMMARY */}
          {step === 'payment' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#191b25]">Select Payment Method</h4>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PayNow')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'PayNow'
                      ? 'border-[#0034c5] bg-[#f3f2ff] text-[#0034c5]'
                      : 'border-[#c4c5da] bg-white text-[#545e77] hover:border-[#0034c5]'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>PayNow QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Credit Card')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'Credit Card'
                      ? 'border-[#0034c5] bg-[#f3f2ff] text-[#0034c5]'
                      : 'border-[#c4c5da] bg-white text-[#545e77] hover:border-[#0034c5]'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('EcoPoints')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'EcoPoints'
                      ? 'border-[#0034c5] bg-[#f3f2ff] text-[#0034c5]'
                      : 'border-[#c4c5da] bg-white text-[#545e77] hover:border-[#0034c5]'
                  }`}
                >
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  <span>EcoPoints (3,450)</span>
                </button>
              </div>

              {/* PayNow QR Simulation */}
              {paymentMethod === 'PayNow' && (
                <div className="bg-[#fbf8ff] p-4 rounded-xl border border-[#c4c5da] text-center space-y-2">
                  <div className="w-32 h-32 bg-white p-2 border border-slate-300 rounded-lg mx-auto flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-[#0034c5]" />
                  </div>
                  <p className="text-xs text-[#545e77]">Scan with any Singapore banking app (DBS, OCBC, UOB, GrabPay)</p>
                  <p className="text-xs font-bold text-[#191b25]">UEN: 202412345E (Go Green Cars Pte. Ltd.)</p>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="bg-white p-4 rounded-xl border border-[#c4c5da] text-xs space-y-1.5">
                <div className="flex justify-between text-[#545e77]">
                  <span>Time Fare ({hours}h):</span>
                  <span>${baseFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#545e77]">
                  <span>Mileage Tariff ({estimatedKm}km):</span>
                  <span>${mileageFare.toFixed(2)}</span>
                </div>
                {cdwPlus && (
                  <div className="flex justify-between text-[#545e77]">
                    <span>CDW Zero Excess:</span>
                    <span>${insuranceFare.toFixed(2)}</span>
                  </div>
                )}
                {promoApplied && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Promo Discount (GREEN2026):</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-[#E2E8F0] pt-2 flex justify-between text-base font-bold text-[#191b25]">
                  <span>Total Payable:</span>
                  <span className="text-[#0034c5]">${totalCost.toFixed(2)} SGD</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMED & DIGITAL BLUETOOTH KEY */}
          {step === 'confirmed' && createdBooking && (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-emerald-950">Reservation Confirmed!</h4>
                <p className="text-xs text-emerald-800">
                  Booking Reference: <strong className="font-mono">{createdBooking.id}</strong>
                </p>
                <p className="text-xs text-emerald-700">
                  Your vehicle is ready at <strong>{createdBooking.pickupLocation}</strong>.
                </p>
              </div>

              {/* Digital BLE Smart Key Panel */}
              <div className={`p-5 rounded-2xl border-2 transition-all ${hazardFlash ? 'border-amber-400 bg-amber-50/50' : 'border-[#0034c5]/30 bg-[#f3f2ff]'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-[#0034c5]" />
                    <h5 className="font-bold text-sm text-[#191b25]">Digital Bluetooth Key</h5>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> BLE Connected
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={handleUnlockVehicle}
                    className={`py-3 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                      !keyLocked ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-[#191b25] hover:bg-emerald-50'
                    }`}
                  >
                    <Unlock className="w-6 h-6" />
                    <span>Unlock Doors</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLockVehicle}
                    className={`py-3 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                      keyLocked ? 'bg-[#0034c5] text-white shadow-md' : 'bg-white text-[#191b25] hover:bg-blue-50'
                    }`}
                  >
                    <Lock className="w-6 h-6" />
                    <span>Lock Doors</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBeepHazard}
                    className="py-3 px-2 rounded-xl text-xs font-bold bg-white text-amber-800 hover:bg-amber-100 flex flex-col items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Zap className="w-6 h-6 text-amber-500 fill-amber-400" />
                    <span>Flash & Horn</span>
                  </button>
                </div>

                <div className="mt-3 text-[11px] text-[#545e77] text-center">
                  Door Status: <strong className={keyLocked ? 'text-blue-700' : 'text-emerald-700'}>{keyLocked ? 'LOCKED' : 'UNLOCKED (Ready to drive)'}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-[#fbf8ff] border-t border-[#E2E8F0] flex justify-between items-center">
          {step === 'details' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#c4c5da] text-xs font-semibold rounded-lg hover:bg-white text-[#545e77] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep('license')}
                className="px-6 py-2.5 bg-[#0034c5] hover:bg-[#00248c] text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
              >
                Continue to Verification
              </button>
            </>
          )}

          {step === 'license' && (
            <>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-4 py-2 border border-[#c4c5da] text-xs font-semibold rounded-lg hover:bg-white text-[#545e77] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="px-6 py-2.5 bg-[#0034c5] hover:bg-[#00248c] text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
              >
                Continue to Payment
              </button>
            </>
          )}

          {step === 'payment' && (
            <>
              <button
                type="button"
                onClick={() => setStep('license')}
                className="px-4 py-2 border border-[#c4c5da] text-xs font-semibold rounded-lg hover:bg-white text-[#545e77] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmReservation}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Pay ${totalCost.toFixed(2)} & Lock Vehicle
              </button>
            </>
          )}

          {step === 'confirmed' && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-[#0034c5] hover:bg-[#00248c] text-white text-xs font-bold rounded-lg shadow cursor-pointer text-center"
            >
              Done & Return to Fleet Catalog
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
