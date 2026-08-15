import React from 'react';
import { Zap, ShieldCheck, Leaf, Car, MapPin, Calculator, HelpCircle, Smartphone, User, Sparkles, ParkingSquare } from 'lucide-react';
import { UserEcoProfile, NavTab } from '../types';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userProfile: UserEcoProfile;
  onOpenBookingSummary?: () => void;
  onOpenSupport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenSupport
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white border-b border-[#c4c5da] sticky top-0 z-50 shadow-xs">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 mx-auto h-20 max-w-[1280px]">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('rates')}
            className="text-left flex items-center gap-2.5 focus:outline-hidden group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0034c5] flex items-center justify-center text-white shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold text-[#0034c5] tracking-tight">Go Green Cars</span>
                <span className="text-xs uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5">
                  <Leaf className="w-3 h-3 text-emerald-600 inline" /> 100% EV
                </span>
              </div>
              <span className="text-[11px] text-[#545e77] font-medium block leading-none">Drive Green, Share Smart</span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('rates')}
            className={`text-sm font-medium transition-colors px-3.5 py-2 rounded-lg ${
              activeTab === 'rates'
                ? 'text-[#0034c5] font-bold bg-[#dde1ff]'
                : 'text-[#434657] hover:text-[#0034c5] hover:bg-[#f3f2ff]'
            }`}
          >
            Rates
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`text-sm font-medium transition-colors px-3.5 py-2 rounded-lg ${
              activeTab === 'locations'
                ? 'text-[#0034c5] font-bold bg-[#dde1ff]'
                : 'text-[#434657] hover:text-[#0034c5] hover:bg-[#f3f2ff]'
            }`}
          >
            Location Map & Chargers
          </button>

          <button
            onClick={() => setActiveTab('carparks')}
            className={`text-sm font-medium transition-colors px-3.5 py-2 rounded-lg flex items-center gap-1.5 ${
              activeTab === 'carparks'
                ? 'text-[#0034c5] font-bold bg-[#dde1ff]'
                : 'text-[#434657] hover:text-[#0034c5] hover:bg-[#f3f2ff]'
            }`}
          >
            <ParkingSquare className="w-4 h-4 text-[#0034c5]" />
            Live Carpark
          </button>

          <button
            onClick={() => setActiveTab('sustainability')}
            className={`text-sm font-medium transition-colors px-3.5 py-2 rounded-lg flex items-center gap-1.5 ${
              activeTab === 'sustainability'
                ? 'text-[#0034c5] font-bold bg-[#dde1ff]'
                : 'text-[#434657] hover:text-[#0034c5] hover:bg-[#f3f2ff]'
            }`}
          >
            <Leaf className="w-4 h-4 text-emerald-600" />
            Impact
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`text-sm font-medium transition-colors px-3.5 py-2 rounded-lg flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'text-[#0034c5] font-bold bg-[#dde1ff]'
                : 'text-[#434657] hover:text-[#0034c5] hover:bg-[#f3f2ff]'
            }`}
          >
            <User className="w-4 h-4 text-[#0034c5]" />
            Profile
          </button>
        </nav>

        {/* Right Section / User & Download CTA */}
        <div className="flex items-center gap-3">
          {/* User Eco Status Pill */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`hidden lg:flex items-center gap-2 border text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              activeTab === 'profile' 
                ? 'bg-[#dde1ff] border-[#0034c5] text-[#0034c5]' 
                : 'bg-[#f3f2ff] hover:bg-[#dde1ff] border-[#c4c5da] text-[#191b25]'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>{userProfile.name}</span>
            <span className="bg-[#0034c5] text-white px-2 py-0.5 rounded-full text-[11px] font-bold">
              {userProfile.ecoPoints} pts
            </span>
          </button>

          <button
            onClick={() => {
              alert('Drive Green App is available on Apple App Store & Google Play Store for Singapore (iOS / Android). Keyless BLE unlock enabled!');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#0034c5] text-white text-sm font-semibold rounded-full px-5 py-2.5 hover:bg-[#00248c] transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            Download App
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#191b25] hover:bg-[#f3f2ff]"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#c4c5da] bg-white px-4 py-4 space-y-2">
          <button
            onClick={() => { setActiveTab('rates'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md font-medium text-sm ${activeTab === 'rates' ? 'bg-[#dde1ff] text-[#0034c5] font-bold' : 'text-[#434657]'}`}
          >
            Rental Rates & Mileage Fees
          </button>
          <button
            onClick={() => { setActiveTab('locations'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md font-medium text-sm ${activeTab === 'locations' ? 'bg-[#dde1ff] text-[#0034c5] font-bold' : 'text-[#434657]'}`}
          >
            Location Map & Chargers
          </button>
          <button
            onClick={() => { setActiveTab('carparks'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md font-medium text-sm ${activeTab === 'carparks' ? 'bg-[#dde1ff] text-[#0034c5] font-bold' : 'text-[#434657]'}`}
          >
            Live Carpark Availability (HDB/LTA/URA)
          </button>
          <button
            onClick={() => { setActiveTab('sustainability'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md font-medium text-sm ${activeTab === 'sustainability' ? 'bg-[#dde1ff] text-[#0034c5] font-bold' : 'text-[#434657]'}`}
          >
            Sustainability Impact & EcoPoints
          </button>
          <button
            onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md font-medium text-sm flex items-center justify-between ${activeTab === 'profile' ? 'bg-[#dde1ff] text-[#0034c5] font-bold' : 'text-[#434657]'}`}
          >
            <span>Driver Profile & Car Confirmations</span>
            <span className="text-xs bg-[#0034c5] text-white px-2 py-0.5 rounded-full font-bold">Singpass</span>
          </button>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                alert('Drive Green App is available on Apple App Store & Google Play Store for Singapore (iOS / Android).');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#0034c5] text-white py-2.5 rounded-lg text-sm font-semibold text-center"
            >
              Download Mobile App
            </button>
            <button
              onClick={() => { onOpenSupport(); setMobileMenuOpen(false); }}
              className="w-full bg-[#f3f2ff] text-[#0034c5] py-2 rounded-lg text-sm font-medium text-center"
            >
              24/7 Customer Support
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
