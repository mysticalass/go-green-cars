import React, { useState } from 'react';
import { CheckCircle2, Shield, Leaf, Zap, Heart, ParkingSquare, MessageSquare, Car } from 'lucide-react';
import { NavTab } from '../types';

interface NewsletterFooterProps {
  onNavigate: (tab: NavTab) => void;
  onOpenSupport: () => void;
}

export const NewsletterFooter: React.FC<NewsletterFooterProps> = ({
  onNavigate,
  onOpenSupport
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hasLicense, setHasLicense] = useState<'yes' | 'no' | null>('yes');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#000B29] text-white py-16 px-4 sm:px-6 lg:px-8 rounded-t-[32px] mt-auto w-full border-t border-blue-950">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between gap-12">
        {/* Left Newsletter Subscription Form */}
        <div className="flex-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 text-emerald-400 text-xs font-semibold mb-3">
            <Leaf className="w-3.5 h-3.5" /> Singapore Green Plan Partner
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-white tracking-tight">
            Stay in the loop with our weekly newsletter
          </h2>

          {subscribed ? (
            <div className="p-5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-white">Thank you for subscribing, {name}!</h4>
                <p className="text-sm text-emerald-300">You will receive exclusive EV rental promotions, green drive tips, and $15 promo credits.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1.5 text-white/80">
                    Name<span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white text-[#191b25] placeholder:text-[#747688] focus:ring-2 focus:ring-[#0046ff] focus:outline-hidden text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1.5 text-white/80">
                    Email<span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white text-[#191b25] placeholder:text-[#747688] focus:ring-2 focus:ring-[#0046ff] focus:outline-hidden text-sm"
                  />
                </div>
                <div className="flex items-end mt-2 sm:mt-0">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#0034c5] hover:bg-[#00248c] text-white font-bold text-sm py-3 px-8 rounded-lg transition-colors cursor-pointer shadow-md"
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* License Radio buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                <span className="text-xs font-medium text-white/80">
                  Do you own a driving licence in Singapore?<span className="text-red-400">*</span>
                </span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="singapore_license"
                      checked={hasLicense === 'yes'}
                      onChange={() => setHasLicense('yes')}
                      className="text-[#0034c5] focus:ring-[#0034c5] bg-white border-white/20 cursor-pointer h-4 w-4"
                    />
                    <span className="text-sm font-medium text-white">Yes (Singpass ready)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="singapore_license"
                      checked={hasLicense === 'no'}
                      onChange={() => setHasLicense('no')}
                      className="text-[#0034c5] focus:ring-[#0034c5] bg-white border-white/20 cursor-pointer h-4 w-4"
                    />
                    <span className="text-sm font-medium text-white">No / International</span>
                  </label>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Right Navigation & Resources Links */}
        <div className="flex-1 flex flex-wrap justify-between md:justify-end gap-10 md:gap-16 pt-8 md:pt-0 border-t border-white/10 md:border-none">
          <div>
            <h3 className="text-[#b9c3ff] font-bold text-sm uppercase tracking-wider mb-4">
              How it works
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('rates')}
                  className="text-white/80 hover:text-white transition-colors text-sm text-left"
                >
                  Rates & Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('locations')}
                  className="text-white/80 hover:text-white transition-colors text-sm text-left"
                >
                  Location Map & Chargers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('carparks')}
                  className="text-white/80 hover:text-white transition-colors text-sm text-left flex items-center gap-1.5"
                >
                  <ParkingSquare className="w-3.5 h-3.5 text-blue-400 inline" /> Live Carpark Lots (LTA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cars')}
                  className="text-white/80 hover:text-white transition-colors text-sm text-left flex items-center gap-1.5"
                >
                  <Car className="w-3.5 h-3.5 text-blue-400 inline" /> 100% EV Fleet Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="text-white/80 hover:text-white transition-colors text-sm text-left"
                >
                  Driver Profile & Confirmations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sustainability')}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm text-left flex items-center gap-1"
                >
                  <Leaf className="w-3 h-3 inline" /> Carbon Accounting
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#b9c3ff] font-bold text-sm uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('rates')}
                  className="text-white/80 hover:text-white transition-colors text-sm text-left"
                >
                  Rates & Pricing Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('community-discussion');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-white/80 hover:text-white transition-colors text-sm text-left flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400 inline" /> Community Forum (Disqus)
                </button>
              </li>
              <li>
                <span className="text-white/80 hover:text-white transition-colors text-sm cursor-pointer" onClick={() => alert('Go Green Cars: 15% OFF your first 3 Electric rides with promo code GREEN2026')}>
                  GoGreen Deals & Promos
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#b9c3ff] font-bold text-sm uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={onOpenSupport}
                  className="text-white/80 hover:text-white transition-colors text-sm text-left"
                >
                  24/7 Roadside Help
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSupport}
                  className="text-white/80 hover:text-white transition-colors text-sm text-left"
                >
                  Charging FAQ
                </button>
              </li>
              <li>
                <a
                  href="mailto:support@gogreencars.sg"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Contact Operations
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Social Links */}
      <div className="max-w-[1280px] mx-auto mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
        <p>© 2026 Go Green Cars Pte. Ltd. • Drive Green, Share Smart Singapore</p>
        
        <div className="flex gap-6">
          <button onClick={() => alert('Terms of Service: Valid Singapore Class 3/3A license required. $0 deposit, fuel included through EV charging network.')} className="hover:text-white transition-colors">Terms of Service</button>
          <button onClick={() => alert('Privacy Policy: PDPA & Singpass compliant. Vehicle telemetry data encrypted.')} className="hover:text-white transition-colors">Privacy Notice</button>
          <button onClick={() => alert('Singapore Green Plan 2030 certified carbon neutrality.')} className="hover:text-emerald-400 transition-colors">ESG Compliance</button>
        </div>

        <div className="flex items-center gap-4 text-white/70">
          <span className="hover:text-white transition-colors cursor-pointer text-xs font-semibold">TikTok</span>
          <span className="hover:text-white transition-colors cursor-pointer text-xs font-semibold">Instagram</span>
          <span className="hover:text-white transition-colors cursor-pointer text-xs font-semibold">Facebook</span>
          <span className="hover:text-white transition-colors cursor-pointer text-xs font-semibold">LinkedIn</span>
        </div>
      </div>
    </footer>
  );
};
