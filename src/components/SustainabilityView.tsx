import React, { useState } from 'react';
import { 
  Leaf, 
  Award, 
  TreePine, 
  Zap, 
  Share2, 
  Download, 
  CheckCircle2, 
  Gift, 
  TrendingUp, 
  ShieldCheck, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  QrCode, 
  Coffee, 
  ExternalLink,
  AlertCircle,
  Clock,
  Ticket
} from 'lucide-react';
import { UserEcoProfile } from '../types';

interface ClaimedReward {
  id: string;
  title: string;
  type: 'voucher' | 'tree' | 'perk';
  code?: string;
  date: string;
  pointsSpent: number;
  status: 'active' | 'completed';
  details: string;
}

interface SustainabilityViewProps {
  userProfile: UserEcoProfile;
  onUpdateProfile?: (updater: (prev: UserEcoProfile) => UserEcoProfile) => void;
}

export const SustainabilityView: React.FC<SustainabilityViewProps> = ({ 
  userProfile,
  onUpdateProfile 
}) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active redemption modals
  const [activeModal, setActiveModal] = useState<'voucher' | 'tree' | 'starbucks' | 'insufficient' | null>(null);
  const [currentVoucherCode, setCurrentVoucherCode] = useState<string>('');
  const [currentTreeId, setCurrentTreeId] = useState<string>('');
  const [currentStarbucksCode, setCurrentStarbucksCode] = useState<string>('');
  const [insufficientReqPoints, setInsufficientReqPoints] = useState<number>(0);

  // Claimed rewards list
  const [claimedRewards, setClaimedRewards] = useState<ClaimedReward[]>([
    {
      id: 'CLM-INIT-1',
      title: 'Drive Green S$10 Welcome Voucher',
      type: 'voucher',
      code: 'GREEN2026',
      date: '10 Aug 2026',
      pointsSpent: 0,
      status: 'active',
      details: 'S$10 off any electric vehicle reservation'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    showToast(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // 1. Redeem S$10 Voucher (1,000 points)
  const handleRedeemVoucher = () => {
    const requiredPoints = 1000;
    if (userProfile.ecoPoints < requiredPoints) {
      setInsufficientReqPoints(requiredPoints);
      setActiveModal('insufficient');
      return;
    }

    const uniqueCode = `ECO10-SG-${Math.floor(100000 + Math.random() * 900000)}`;
    setCurrentVoucherCode(uniqueCode);

    if (onUpdateProfile) {
      onUpdateProfile(prev => ({
        ...prev,
        ecoPoints: prev.ecoPoints - requiredPoints
      }));
    }

    const newReward: ClaimedReward = {
      id: `CLM-${Date.now()}`,
      title: 'S$10 Drive Green Promo Voucher',
      type: 'voucher',
      code: uniqueCode,
      date: 'Today',
      pointsSpent: requiredPoints,
      status: 'active',
      details: 'S$10 rental credit valid on all BYD, Hyundai, and electric fleets.'
    };

    setClaimedRewards(prev => [newReward, ...prev]);
    setActiveModal('voucher');
    showToast('S$10 Voucher successfully redeemed!');
  };

  // 2. Plant 1 Tree in Singapore (2,500 points)
  const handlePlantTree = () => {
    const requiredPoints = 2500;
    if (userProfile.ecoPoints < requiredPoints) {
      setInsufficientReqPoints(requiredPoints);
      setActiveModal('insufficient');
      return;
    }

    const treeRegId = `SG-NP-TREE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setCurrentTreeId(treeRegId);

    if (onUpdateProfile) {
      onUpdateProfile(prev => ({
        ...prev,
        ecoPoints: prev.ecoPoints - requiredPoints,
        treesPlantedEquivalent: (prev.treesPlantedEquivalent || 0) + 1,
        totalCo2SavedKg: Number((prev.totalCo2SavedKg + 22.0).toFixed(1)) // +22kg annual tree absorption
      }));
    }

    const newReward: ClaimedReward = {
      id: `CLM-${Date.now()}`,
      title: 'Native Tree Planted (NParks OneMillionTrees)',
      type: 'tree',
      code: treeRegId,
      date: 'Today',
      pointsSpent: requiredPoints,
      status: 'completed',
      details: 'Native Merawan Siput Jantan planted at Rail Corridor (Jurong Sector).'
    };

    setClaimedRewards(prev => [newReward, ...prev]);
    setActiveModal('tree');
    showToast('1 Native Tree planted in Singapore! Thank you for your leadership.');
  };

  // 3. Redeem Starbucks Perk (800 points)
  const handleRedeemStarbucks = () => {
    const requiredPoints = 800;
    if (userProfile.ecoPoints < requiredPoints) {
      setInsufficientReqPoints(requiredPoints);
      setActiveModal('insufficient');
      return;
    }

    const barCode = `SBUX-OAT-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setCurrentStarbucksCode(barCode);

    if (onUpdateProfile) {
      onUpdateProfile(prev => ({
        ...prev,
        ecoPoints: prev.ecoPoints - requiredPoints
      }));
    }

    const newReward: ClaimedReward = {
      id: `CLM-${Date.now()}`,
      title: 'Free Starbucks Oat Latte & Croissant',
      type: 'perk',
      code: barCode,
      date: 'Today',
      pointsSpent: requiredPoints,
      status: 'active',
      details: '1x Grande Oat Latte + Warm Croissant at any Starbucks SG outlet.'
    };

    setClaimedRewards(prev => [newReward, ...prev]);
    setActiveModal('starbucks');
    showToast('Starbucks treat voucher redeemed!');
  };

  const downloadSimulatedCertificate = (certName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = certName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Certificate "${certName}" downloaded successfully.`);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* In-app floating toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191b25] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-emerald-500/40 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

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
            <div className="text-3xl font-bold text-[#191b25]">
              {(1482.4 + (userProfile.totalCo2SavedKg || 0)).toFixed(1)} <span className="text-sm font-medium text-[#545e77]">kg</span>
            </div>
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
            <span className="text-xs font-bold text-[#545e77] uppercase tracking-wider">Trees Planted & Offset</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TreePine className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-[#191b25]">
              {74 + (userProfile.treesPlantedEquivalent || 0)} <span className="text-sm font-medium text-[#545e77]">trees</span>
            </div>
            <p className="text-xs text-emerald-700 font-semibold mt-1">🌳 Dedicated in Singapore soil</p>
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
              <div className="text-xl font-bold text-[#0034c5]">{userProfile.ecoPoints.toLocaleString()} Points</div>
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
            <div className="text-xs text-[#545e77]">Trees Dedicated</div>
            <div className="text-lg font-bold text-emerald-700 flex items-center gap-1">
              <TreePine className="w-4 h-4 text-emerald-600" />
              <span>{userProfile.treesPlantedEquivalent || 0} planted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Green Rewards Catalog */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#191b25] flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#0034c5]" /> Redeem Your EcoPoints
          </h3>
          <span className="text-xs text-[#545e77]">
            Balance: <strong className="text-[#0034c5]">{userProfile.ecoPoints.toLocaleString()} pts</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* S$10 Promo Voucher */}
          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#0034c5]/40 transition-all">
            <div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Rental Credit</span>
              <h4 className="font-bold text-base text-[#191b25] mt-2">S$10 Drive Green Promo Voucher</h4>
              <p className="text-xs text-[#545e77] mt-1">Valid on any BYD, Hyundai, or commercial electric rental.</p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0034c5]">1,000 Points</span>
                <span className="text-[10px] text-slate-400">Instant code generation</span>
              </div>
              <button
                onClick={handleRedeemVoucher}
                className="px-4 py-2 bg-[#0034c5] hover:bg-[#00248c] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Redeem</span>
              </button>
            </div>
          </div>

          {/* Plant 1 Tree */}
          <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-400 transition-all bg-linear-to-b from-white to-emerald-50/20">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">NParks Tree Donation</span>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">Popular</span>
              </div>
              <h4 className="font-bold text-base text-[#191b25] mt-2 flex items-center gap-1.5">
                <TreePine className="w-4 h-4 text-emerald-600" />
                <span>Plant 1 Native Tree in Singapore</span>
              </h4>
              <p className="text-xs text-[#545e77] mt-1">Partnership with Garden City Fund & OneMillionTrees movement.</p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-emerald-700">2,500 Points</span>
                <span className="text-[10px] text-emerald-600 font-medium">Includes Official Certificate</span>
              </div>
              <button
                onClick={handlePlantTree}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <TreePine className="w-3.5 h-3.5" />
                <span>Plant Tree</span>
              </button>
            </div>
          </div>

          {/* Starbucks Partner Perk */}
          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all">
            <div>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Partner Perk</span>
              <h4 className="font-bold text-base text-[#191b25] mt-2 flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-purple-600" />
                <span>Free Starbucks Oat Latte & Croissant</span>
              </h4>
              <p className="text-xs text-[#545e77] mt-1">Enjoy a warm green coffee break while your EV charges.</p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-purple-700">800 Points</span>
                <span className="text-[10px] text-slate-400">Barcode barcode e-pass</span>
              </div>
              <button
                onClick={handleRedeemStarbucks}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Redeem</span>
              </button>
            </div>
          </div>
        </div>

        {/* Claimed Rewards / Wallet Section */}
        {claimedRewards.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#c4c5da] p-6 space-y-4 mt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#0034c5]" />
                <h4 className="font-bold text-[#191b25] text-base">Your Claimed Rewards & Dedications ({claimedRewards.length})</h4>
              </div>
              <span className="text-xs text-[#545e77]">Available in your digital wallet</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {claimedRewards.map((reward) => (
                <div key={reward.id} className="p-4 rounded-xl bg-[#fbf8ff] border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0034c5] bg-blue-50 px-2 py-0.5 rounded">
                        {reward.type === 'tree' ? '🌱 Tree Dedicated' : reward.type === 'perk' ? '☕ Partner Perk' : '🎟️ Promo Voucher'}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {reward.date}
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-[#191b25] mt-2">{reward.title}</h5>
                    <p className="text-xs text-[#545e77] mt-1">{reward.details}</p>
                  </div>

                  {reward.code && (
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between bg-white px-3 py-2 rounded-lg border">
                      <span className="font-mono font-bold text-xs text-[#191b25]">{reward.code}</span>
                      <button
                        onClick={() => handleCopy(reward.code!, 'Code')}
                        className="text-xs font-semibold text-[#0034c5] hover:text-[#00248c] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedCode === reward.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedCode === reward.code ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal 1: Voucher Redemption Modal */}
      {activeModal === 'voucher' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-blue-200 p-6 relative space-y-5 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-blue-50 text-[#0034c5] rounded-full flex items-center justify-center mx-auto border-2 border-blue-200">
                <Ticket className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#191b25]">S$10 Rental Voucher Redeemed!</h3>
              <p className="text-xs text-[#545e77]">
                1,000 EcoPoints have been deducted. Use this voucher on your next EV reservation.
              </p>
            </div>

            <div className="bg-[#f3f2ff] p-4 rounded-xl border border-blue-200 text-center space-y-2">
              <span className="text-[11px] uppercase font-bold text-blue-700 tracking-wider">Your Promo Code</span>
              <div className="flex items-center justify-center gap-2 bg-white py-2.5 px-4 rounded-lg border border-blue-300 shadow-inner">
                <span className="text-lg font-mono font-black text-[#0034c5] tracking-widest">{currentVoucherCode}</span>
                <button
                  onClick={() => handleCopy(currentVoucherCode, 'Promo Code')}
                  className="p-1.5 bg-blue-50 text-[#0034c5] hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                  title="Copy Code"
                >
                  {copiedCode === currentVoucherCode ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">Valid for 6 months • Applicable across all BYD and Hyundai models</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  handleCopy(currentVoucherCode, 'Promo Code');
                  setActiveModal(null);
                }}
                className="w-full py-2.5 bg-[#0034c5] hover:bg-[#00248c] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Copy Code & Save to Wallet</span>
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Tree Dedication Certificate Modal */}
      {activeModal === 'tree' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border-2 border-emerald-500 p-7 relative space-y-6 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500 shadow-xs">
                <TreePine className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-bold text-[#191b25]">OneMillionTrees Tree Dedication</h3>
              <p className="text-xs text-emerald-800 font-semibold">
                In partnership with NParks & Garden City Fund Singapore
              </p>
            </div>

            <div className="bg-emerald-50/60 p-5 rounded-xl border border-emerald-200 text-xs space-y-3">
              <div className="flex justify-between border-b border-emerald-200/80 pb-2">
                <span className="text-slate-600">Dedicated By:</span>
                <span className="font-bold text-[#191b25]">{userProfile.name}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-200/80 pb-2">
                <span className="text-slate-600">Tree Species:</span>
                <span className="font-bold text-[#191b25]">Hopea odorata (Merawan Siput Jantan)</span>
              </div>
              <div className="flex justify-between border-b border-emerald-200/80 pb-2">
                <span className="text-slate-600">Conservation Plot:</span>
                <span className="font-bold text-[#191b25]">Rail Corridor Green Spine (Jurong Sector)</span>
              </div>
              <div className="flex justify-between border-b border-emerald-200/80 pb-2">
                <span className="text-slate-600">Estimated Carbon Sequestration:</span>
                <span className="font-bold text-emerald-700">+22.0 kg CO₂ / year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">NParks Registry ID:</span>
                <span className="font-mono font-bold text-slate-800">{currentTreeId}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const certText = `NParks OneMillionTrees Movement Certificate\nRegistry ID: ${currentTreeId}\nDedicated By: ${userProfile.name}\nSpecies: Hopea odorata\nLocation: Rail Corridor Singapore\nDate: 2026\nThank you for contributing to Singapore's City in Nature vision.`;
                  downloadSimulatedCertificate(`${currentTreeId}.txt`, certText);
                }}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" /> Download Certificate
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 border border-[#c4c5da] text-[#434657] text-xs font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Starbucks Partner Perk Modal */}
      {activeModal === 'starbucks' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-purple-200 p-6 relative space-y-5 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center mx-auto border-2 border-purple-200">
                <Coffee className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#191b25]">Starbucks Green e-Pass</h3>
              <p className="text-xs text-[#545e77]">
                Present this barcode at any Starbucks counter in Singapore while charging your EV!
              </p>
            </div>

            <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-200 text-center space-y-3">
              <div className="bg-white p-4 rounded-lg border border-purple-200 inline-block mx-auto shadow-xs">
                <div className="font-mono text-xl tracking-widest font-black text-slate-800">
                  ||| | | |||| | || | |||
                </div>
                <div className="font-mono font-bold text-xs text-purple-900 mt-1">{currentStarbucksCode}</div>
              </div>
              <div className="text-xs font-semibold text-purple-900">
                Includes: Grande Oat Milk Latte + Warm Butter/Almond Croissant
              </div>
              <p className="text-[10px] text-slate-500">Valid across all 140+ Starbucks outlets in Singapore</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  handleCopy(currentStarbucksCode, 'Starbucks Barcode');
                  setActiveModal(null);
                }}
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Copy Barcode & Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Insufficient Points Notice */}
      {activeModal === 'insufficient' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl shadow-2xl border border-amber-200 p-6 relative space-y-4 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#191b25]">More EcoPoints Needed</h3>
              <p className="text-xs text-[#545e77]">
                You currently have <strong className="text-[#0034c5]">{userProfile.ecoPoints} points</strong>, but this reward requires <strong className="text-[#191b25]">{insufficientReqPoints} points</strong>.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border text-xs text-[#545e77] space-y-1.5">
              <div className="font-semibold text-[#191b25]">How to earn more points:</div>
              <div>⚡ <strong>10 points</strong> per kilometer driven in our 100% EV fleet.</div>
              <div>🔋 <strong>50 bonus points</strong> when completing a fast charge at partner hubs.</div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-[#0034c5] text-white text-xs font-bold rounded-xl hover:bg-[#00248c] transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Modal: ESG Carbon Certificate */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl border border-emerald-500/40 p-8 relative space-y-6 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

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
                <span className="font-bold text-[#191b25]">{userProfile.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-[#545e77]">Electric Fleet Miles Driven:</span>
                <span className="font-bold text-[#191b25]">{userProfile.totalKmDriven} Kilometers</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-[#545e77]">Net Scope 1 & 2 Emissions Prevented:</span>
                <span className="font-bold text-emerald-600 text-sm">{userProfile.totalCo2SavedKg} kg CO₂e</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-[#545e77]">Native Trees Dedicated in Singapore:</span>
                <span className="font-bold text-emerald-700">{userProfile.treesPlantedEquivalent || 0} Trees</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#545e77]">Certificate ID:</span>
                <span className="font-mono text-slate-700">SG-EV-2026-889104</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const certText = `VERIFIED ESG CARBON CERTIFICATE\nCertificate ID: SG-EV-2026-889104\nIssued To: ${userProfile.name}\nElectric Miles: ${userProfile.totalKmDriven} km\nCO2 Prevented: ${userProfile.totalCo2SavedKg} kg CO2e\nTrees Planted: ${userProfile.treesPlantedEquivalent || 0}\nCompliance: Singapore Green Plan 2030 & ISO 14064\nGo Green Cars Singapore Pte Ltd`;
                  downloadSimulatedCertificate('SG-EV-Carbon-Certificate-889104.txt', certText);
                }}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" /> Download Certificate
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2.5 border border-[#c4c5da] text-[#434657] text-xs font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
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
