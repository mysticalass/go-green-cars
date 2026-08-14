import React, { useState } from 'react';
import { Leaf, Award, TreePine, Zap, Share2, Download, CheckCircle2, Gift, TrendingUp, ShieldCheck } from 'lucide-react';
import { UserEcoProfile } from '../types';

interface SustainabilityViewProps {
  userProfile: UserEcoProfile;
}

export const SustainabilityView: React.FC<SustainabilityViewProps> = ({ userProfile }) => {
  const [pointsClaimed, setPointsClaimed] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Leaf className="w-3.5 h-3.5" /> Singapore Green Plan 2030 Partner
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#191b25] tracking-tight">
            Sustainability & Carbon Accounting
          </h1>
          <p className="text-sm lg:text-base text-[#545e77] mt-1 max-w-2xl">
            Real-time carbon telemetry for every kilometer driven. 100% verified zero tailpipe emissions powering Singapore's clean energy transition.
          </p>
        </div>

        <button
          onClick={() => setShowCertificate(true)}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
        >
          <Award className="w-4 h-4" />
          <span>View ESG Carbon Certificate</span>
        </button>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#545e77] uppercase tracking-wider">Total CO₂ Avoided</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-[#191b25]">1,482.4 <span className="text-sm font-medium text-[#545e77]">kg</span></div>
            <p className="text-xs text-emerald-700 font-semibold mt-1">🌿 Islandwide community total</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#545e77] uppercase tracking-wider">Shared EV Kilometers</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0034c5] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-[#191b25]">8,620 <span className="text-sm font-medium text-[#545e77]">km</span></div>
            <p className="text-xs text-blue-700 font-semibold mt-1">⚡ 100% electric clean miles</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#545e77] uppercase tracking-wider">Equivalent Trees</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TreePine className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-[#191b25]">74 <span className="text-sm font-medium text-[#545e77]">trees</span></div>
            <p className="text-xs text-emerald-700 font-semibold mt-1">🌳 Annual carbon absorption eq.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#545e77] uppercase tracking-wider">Fleet Charging Efficiency</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-[#191b25]">94.8%</div>
            <p className="text-xs text-purple-700 font-semibold mt-1">🔋 SP & Charge+ smart grid sync</p>
          </div>
        </div>
      </div>

      {/* User Personal Green Profile Card */}
      <div className="bg-[#f3f2ff] p-6 sm:p-8 rounded-2xl border border-[#0034c5]/20 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-[#191b25]">{userProfile.name}'s Eco Dashboard</h2>
              <span className="bg-[#0034c5] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {userProfile.tier}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#545e77] mt-1">{userProfile.email} • Driver since 2024</p>
          </div>

          <div className="bg-white px-5 py-3 rounded-xl border border-[#c4c5da] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#545e77] font-semibold">Available EcoPoints</div>
              <div className="text-xl font-bold text-[#0034c5]">{userProfile.ecoPoints} Points</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-5 rounded-xl border border-[#c4c5da]">
          <div>
            <div className="text-xs text-[#545e77]">Your Trips</div>
            <div className="text-lg font-bold text-[#191b25]">{userProfile.totalTrips} rides</div>
          </div>
          <div>
            <div className="text-xs text-[#545e77]">EV Distance</div>
            <div className="text-lg font-bold text-[#191b25]">{userProfile.totalKmDriven} km</div>
          </div>
          <div>
            <div className="text-xs text-[#545e77]">CO₂ Prevented</div>
            <div className="text-lg font-bold text-emerald-600">{userProfile.totalCo2SavedKg} kg</div>
          </div>
          <div>
            <div className="text-xs text-[#545e77]">Cost Saved vs Petrol</div>
            <div className="text-lg font-bold text-[#0034c5]">S${userProfile.savedMoneyVsPetrolSgd.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Green Rewards Catalog */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#191b25] flex items-center gap-2">
          <Gift className="w-5 h-5 text-[#0034c5]" /> Redeem Your EcoPoints
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Rental Credit</span>
              <h4 className="font-bold text-base text-[#191b25] mt-2">S$10 Drive Green Promo Voucher</h4>
              <p className="text-xs text-[#545e77] mt-1">Valid on any BYD, Hyundai, or commercial electric rental.</p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0034c5]">1,000 Points</span>
              <button
                onClick={() => { setPointsClaimed(true); alert('Redeemed S$10 Promo Voucher! Added to your wallet.'); }}
                className="px-3 py-1.5 bg-[#0034c5] hover:bg-[#00248c] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Redeem
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">NParks Tree Donation</span>
              <h4 className="font-bold text-base text-[#191b25] mt-2">Plant 1 Native Tree in Singapore</h4>
              <p className="text-xs text-[#545e77] mt-1">Partnership with Garden City Fund & OneMillionTrees movement.</p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700">2,500 Points</span>
              <button
                onClick={() => alert('Planted 1 Native Tree in Singapore on behalf of Jane Low! Thank you for your environmental leadership.')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Plant Tree
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Partner Perk</span>
              <h4 className="font-bold text-base text-[#191b25] mt-2">Free Starbucks Oat Latte & Croissant</h4>
              <p className="text-xs text-[#545e77] mt-1">Enjoy a warm green coffee break while your EV charges.</p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700">800 Points</span>
              <button
                onClick={() => alert('Starbucks e-voucher barcode dispatched to janelowys@gmail.com!')}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Redeem
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: ESG Carbon Certificate */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl border border-emerald-500/40 p-8 relative space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-bold text-[#191b25]">Verified Carbon Offset Certificate</h3>
              <p className="text-xs text-emerald-800 font-semibold">Singapore Green Plan 2030 & ISO 14064 Compliance</p>
            </div>

            <div className="bg-[#fbf8ff] p-5 rounded-xl border border-[#c4c5da] space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-[#545e77]">Issued To:</span>
                <span className="font-bold text-[#191b25]">Jane Low</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-[#545e77]">Electric Fleet Miles Driven:</span>
                <span className="font-bold text-[#191b25]">1,420 Kilometers</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-[#545e77]">Net Scope 1 & 2 Emissions Prevented:</span>
                <span className="font-bold text-emerald-600 text-sm">244.20 kg CO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#545e77]">Certificate ID:</span>
                <span className="font-mono text-slate-700">SG-EV-2026-889104</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { alert('Certificate downloaded as PDF (SG-EV-2026-889104.pdf)'); setShowCertificate(false); }}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download PDF Certificate
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2.5 border border-[#c4c5da] text-[#434657] text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
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
