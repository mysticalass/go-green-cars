import React, { useState } from 'react';
import { Calculator, DollarSign, Leaf, Zap, Shield, Sparkles, Check, ArrowRight } from 'lucide-react';
import { VEHICLES_DATA } from '../data/mockData';

export const RatesCalculatorView: React.FC = () => {
  const [weeklyKm, setWeeklyKm] = useState(120);
  const [weeklyHours, setWeeklyHours] = useState(8);
  const [selectedCategory, setSelectedCategory] = useState<'Standard' | 'Plus' | 'Commercial'>('Plus');

  // Comparison formulas
  const avgEvHourlyRate = selectedCategory === 'Commercial' ? 6.50 : selectedCategory === 'Plus' ? 8.50 : 7.00;
  const avgEvMileageRate = 0.39;
  
  const driveGreenWeeklyCost = (weeklyHours * avgEvHourlyRate) + (weeklyKm * avgEvMileageRate);
  
  // Traditional petrol car rental comparison (rental + petrol @ $2.85/L, 12km/L = $0.24/km + fuel surcharge)
  const petrolCarRentalWeeklyCost = (weeklyHours * 12.50) + (weeklyKm * 0.24) + 15.00; // base + fuel + fuel admin fee
  
  // Ride hailing comparison (Grab/Tada avg $24 per 15km trip)
  const rideHailingWeeklyCost = (weeklyKm / 12) * 18.50;

  const weeklySavedVsPetrol = Math.max(0, petrolCarRentalWeeklyCost - driveGreenWeeklyCost);
  const annualSavedVsPetrol = (weeklySavedVsPetrol * 52).toFixed(0);
  
  const weeklyCo2SavedKg = (weeklyKm * 0.175).toFixed(1);
  const annualCo2SavedKg = (Number(weeklyCo2SavedKg) * 52).toFixed(0);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0034c5] text-xs font-bold mb-2">
          <DollarSign className="w-3.5 h-3.5" /> Transparent Pricing
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-[#191b25] tracking-tight">
          Simple, All-Inclusive EV Rental Rates
        </h1>
        <p className="text-sm lg:text-base text-[#545e77] mt-1 max-w-2xl">
          No hidden fuel deposits, no fluctuating petrol surcharges. All rentals include 100% free DC fast charging at SP Mobility and Charge+ hubs, road tax, and comprehensive 24/7 roadside assistance.
        </p>
      </div>

      {/* Pricing Rate Matrix Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
        <div className="px-6 py-4 bg-[#fbf8ff] border-b border-[#E2E8F0] flex justify-between items-center">
          <h2 className="font-bold text-base text-[#191b25]">Fleet Pricing Matrix by Category (SGD)</h2>
          <span className="text-xs text-[#545e77]">Off-Peak: Mon-Fri (12am-5pm) • Peak: Mon-Fri (5pm-12am) & Weekends</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#f3f2ff] text-[#191b25] font-bold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Vehicle Category</th>
                <th className="py-3.5 px-4">Representative Models</th>
                <th className="py-3.5 px-4">Off-Peak / Hour</th>
                <th className="py-3.5 px-4">Peak / Hour</th>
                <th className="py-3.5 px-4">24-Hr Day Pass</th>
                <th className="py-3.5 px-4">Mileage Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#434657]">
              <tr className="hover:bg-[#fbf8ff] transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#191b25] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> Standard Electric
                </td>
                <td className="py-3.5 px-4">BYD e6, Kona EV 39kWh</td>
                <td className="py-3.5 px-4 font-bold text-[#0034c5]">$6.80 - $7.20</td>
                <td className="py-3.5 px-4 font-semibold text-[#191b25]">$9.90 - $10.50</td>
                <td className="py-3.5 px-4 font-semibold">$88.00 - $92.00</td>
                <td className="py-3.5 px-4">$0.38 / km</td>
              </tr>
              <tr className="hover:bg-[#fbf8ff] transition-colors bg-blue-50/30">
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#191b25] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0046ff]"></span> Plus Electric (Most Popular)
                </td>
                <td className="py-3.5 px-4">BYD Atto 3, Hyundai IONIQ 5</td>
                <td className="py-3.5 px-4 font-bold text-[#0034c5]">$8.50 - $9.80</td>
                <td className="py-3.5 px-4 font-semibold text-[#191b25]">$12.80 - $14.50</td>
                <td className="py-3.5 px-4 font-semibold">$110.00 - $125.00</td>
                <td className="py-3.5 px-4">$0.39 - $0.42 / km</td>
              </tr>
              <tr className="hover:bg-[#fbf8ff] transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#191b25] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Select Electric
                </td>
                <td className="py-3.5 px-4">Hyundai Kona EV Select</td>
                <td className="py-3.5 px-4 font-bold text-[#0034c5]">$7.50</td>
                <td className="py-3.5 px-4 font-semibold text-[#191b25]">$11.50</td>
                <td className="py-3.5 px-4 font-semibold">$98.00</td>
                <td className="py-3.5 px-4">$0.39 / km</td>
              </tr>
              <tr className="hover:bg-[#fbf8ff] transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#191b25] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span> Commercial Electric Van
                </td>
                <td className="py-3.5 px-4">Shineray X30LEV, DFSK EC35, BYD T3</td>
                <td className="py-3.5 px-4 font-bold text-[#0034c5]">$6.00 - $6.80</td>
                <td className="py-3.5 px-4 font-semibold text-[#191b25]">$9.00 - $9.80</td>
                <td className="py-3.5 px-4 font-semibold">$75.00 - $85.00</td>
                <td className="py-3.5 px-4">$0.35 - $0.36 / km</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Savings Calculator */}
      <div className="bg-[#f3f2ff] p-6 sm:p-8 rounded-2xl border border-[#0034c5]/20 space-y-6">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold text-[#191b25] flex items-center gap-2">
            <Calculator className="w-6 h-6 text-[#0034c5]" /> How Much Can You Save Going 100% Electric?
          </h2>
          <p className="text-xs sm:text-sm text-[#545e77] mt-1">
            Compare "Drive Green, Share Smart" against traditional petrol carsharing and ride-hailing services in Singapore.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Inputs */}
          <div className="lg:col-span-6 space-y-5 bg-white p-6 rounded-xl border border-[#c4c5da] shadow-xs">
            <div>
              <div className="flex justify-between text-xs font-bold text-[#191b25] mb-1">
                <span>Weekly Driving Time:</span>
                <span className="text-[#0034c5]">{weeklyHours} hours/week</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full accent-[#0034c5] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#191b25] mb-1">
                <span>Weekly Distance:</span>
                <span className="text-[#0034c5]">{weeklyKm} km/week</span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={weeklyKm}
                onChange={(e) => setWeeklyKm(Number(e.target.value))}
                className="w-full accent-[#0034c5] cursor-pointer"
              />
            </div>

            <div>
              <span className="block text-xs font-bold text-[#191b25] mb-2">Fleet Category:</span>
              <div className="grid grid-cols-3 gap-2">
                {(['Standard', 'Plus', 'Commercial'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#0034c5] text-white shadow-xs'
                        : 'bg-[#fbf8ff] text-[#545e77] border border-[#c4c5da] hover:border-[#0034c5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Comparison Metric Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border-2 border-[#0034c5] shadow-md flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0034c5] bg-blue-100 px-2 py-0.5 rounded">
                  Go Green Cars (100% EV)
                </span>
                <div className="text-3xl font-bold text-[#191b25] mt-2">${driveGreenWeeklyCost.toFixed(2)}</div>
                <div className="text-xs text-[#545e77]">per week (All-inclusive)</div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Avoids {weeklyCo2SavedKg} kg CO₂/wk</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#c4c5da] shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Traditional Petrol Carsharing (Tribecar / Petrol Rentals)
                </span>
                <div className="text-3xl font-bold text-slate-700 mt-2">${petrolCarRentalWeeklyCost.toFixed(2)}</div>
                <div className="text-xs text-[#545e77]">per week (incl. petrol top-ups)</div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-red-600 font-medium">
                + S${weeklySavedVsPetrol.toFixed(2)} higher cost
              </div>
            </div>

            {/* Annual Savings Highlight */}
            <div className="sm:col-span-2 bg-emerald-900 text-white p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold">Estimated Annual Savings with Go Green Cars:</h4>
                <p className="text-xs text-emerald-200">Based on {weeklyHours} hrs & {weeklyKm} km weekly usage across Singapore.</p>
              </div>
              <div className="text-right sm:text-right">
                <div className="text-3xl font-bold text-emerald-300">S${annualSavedVsPetrol} / year</div>
                <div className="text-xs text-emerald-100 font-medium">+{annualCo2SavedKg} kg CO₂ saved annually</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
