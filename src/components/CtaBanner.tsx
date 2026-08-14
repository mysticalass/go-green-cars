import React, { useState } from 'react';
import { Search, MapPin, Zap } from 'lucide-react';

interface CtaBannerProps {
  onSearchLocation: (location: string) => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onSearchLocation }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchLocation(query.trim());
    }
  };

  return (
    <section className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 mb-8">
      <div className="flex flex-col md:flex-row gap-6 bg-[#f3f2ff] rounded-2xl overflow-hidden shadow-xs border border-[#E2E8F0] relative min-h-[400px]">
        {/* Left text & search container */}
        <div className="p-8 md:p-12 flex-1 flex flex-col justify-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-[#0034c5] text-xs font-bold w-max mb-4">
            <Zap className="w-3.5 h-3.5 fill-[#0034c5]" />
            Singapore's 100% Electric Carsharing
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-[#191b25] mb-4 max-w-md tracking-tight leading-tight">
            Rent a Go Green Cars vehicle near you
          </h2>

          <p className="text-base lg:text-lg text-[#434657] mb-8 max-w-md">
            We’re Singapore’s premier 100% electric carsharing service, with more than 3,000 EVs in over 1,700 locations islandwide!
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
            <div className="relative flex-grow">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#545e77]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter postal code or location (e.g. Marina Bay, Tampines)"
                className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-[#E2E8F0] bg-white text-[#191b25] text-sm focus:outline-hidden focus:border-[#0034c5] focus:ring-2 focus:ring-[#0034c5]/20 shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="bg-[#0034c5] text-white font-bold text-sm py-3.5 px-8 rounded-lg hover:bg-[#00248c] transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Right lifestyle garage car image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida/AP1WRLtStK4Kk98DiOYWatB_xTTKxunx6ua0liZ48xQ3tF0c1ccp41QJS9oyxAQKZxVpAMjs_8o79vie6uyV7j3SirrpAgseGSItNjGqYgUolxWMCdujnPJpaXezX-WpftTYzVETcOYFsb8dzlj63D-7pxH4Epxuzz42KGdVKf9rGx_JV1gEr0T4h2_rciE7-WjToo98XmRLz9rgQFTo2VLridrlRg9t6sdsEUKxDrrdLK0vHFiiXg5_Hvk9NWc"
            alt="Go Green Cars electric vehicle in modern Singapore parking garage"
            className="absolute inset-0 w-full h-full object-cover object-center rounded-r-2xl md:rounded-l-none md:rounded-r-2xl rounded-b-2xl md:rounded-bl-none hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>
    </section>
  );
};
