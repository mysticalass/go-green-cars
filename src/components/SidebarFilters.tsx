import React from 'react';
import { FilterState, VehicleType, VehicleCategory } from '../types';
import { RotateCcw, Zap } from 'lucide-react';

interface SidebarFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatches: number;
}

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  filters,
  setFilters,
  totalMatches
}) => {
  const handleVehicleTypeToggle = (type: VehicleType) => {
    setFilters(prev => {
      const exists = prev.vehicleTypes.includes(type);
      const newTypes = exists
        ? prev.vehicleTypes.filter(t => t !== type)
        : [...prev.vehicleTypes, type];
      return { ...prev, vehicleTypes: newTypes };
    });
  };

  const handleCategoryToggle = (category: VehicleCategory) => {
    setFilters(prev => {
      const exists = prev.categories.includes(category);
      const newCats = exists
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCats };
    });
  };

  const handleBrandToggle = (brand: string) => {
    setFilters(prev => {
      const exists = prev.brands.includes(brand);
      const newBrands = exists
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: newBrands };
    });
  };

  const resetFilters = () => {
    setFilters({
      fuelTypes: ['Electric'],
      vehicleTypes: [],
      categories: [],
      brands: [],
      searchQuery: '',
      seatCount: null,
      maxHourlyRate: 30,
      areaFilter: 'All',
      onlyAvailable: false
    });
  };

  const vehicleTypeOptions: VehicleType[] = ['SUV', 'MPV', 'Van'];
  const categoryOptions: VehicleCategory[] = [
    'Select Electric',
    'Plus Electric',
    'Standard Electric',
    'Commercial Electric'
  ];
  const brandOptions = ['Hyundai', 'BYD', 'Shineray', 'DFSK'];

  return (
    <aside className="w-full lg:w-[280px] flex-shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto custom-scrollbar lg:pr-4 py-2 flex flex-col gap-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl lg:text-[40px] font-bold text-[#191b25] tracking-tight leading-tight">
            Our vehicles
          </h1>
        </div>
        
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#191b25]">Filter by</h2>
          {(filters.fuelTypes.length !== 1 || filters.vehicleTypes.length > 0 || filters.categories.length > 0 || filters.brands.length > 0 || filters.areaFilter !== 'All') && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-[#0034c5] hover:text-[#00248c] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Sustainable Mobility Alert */}
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
        <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">100% Zero Emission:</span> All vehicles in our active fleet are pure electric with free islandwide DC charging.
        </div>
      </div>

      {/* Fuel type */}
      <div className="border-b border-[#E2E8F0] pb-5">
        <h3 className="text-sm font-bold text-[#191b25] mb-3">
          Fuel type
        </h3>
        <div className="flex items-center justify-between py-2 px-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs font-semibold text-emerald-900">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-[#191b25]">Electric</span>
          </div>
          <span className="text-[10px] uppercase font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
            100% EV
          </span>
        </div>
      </div>

      {/* Vehicle type */}
      <div className="border-b border-[#E2E8F0] pb-5">
        <h3 className="text-sm font-bold text-[#191b25] mb-3">
          Vehicle type
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {vehicleTypeOptions.map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={filters.vehicleTypes.includes(type)}
                onChange={() => handleVehicleTypeToggle(type)}
                className="rounded border-[#c4c5da] text-[#0034c5] focus:ring-[#0034c5] h-4 w-4 accent-[#0034c5] cursor-pointer"
              />
              <span className="text-[15px] text-[#434657] group-hover:text-[#0034c5] transition-colors whitespace-nowrap">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Vehicle category */}
      <div className="border-b border-[#E2E8F0] pb-5">
        <h3 className="text-sm font-bold text-[#191b25] mb-3">
          Vehicle category
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {categoryOptions.map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => handleCategoryToggle(cat)}
                className="rounded border-[#c4c5da] text-[#0034c5] focus:ring-[#0034c5] h-4 w-4 accent-[#0034c5] cursor-pointer"
              />
              <span className="text-[14px] text-[#434657] group-hover:text-[#0034c5] transition-colors leading-tight">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="border-b border-[#E2E8F0] pb-5">
        <h3 className="text-sm font-bold text-[#191b25] mb-3">
          Brand
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {brandOptions.map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className="rounded border-[#c4c5da] text-[#0034c5] focus:ring-[#0034c5] h-4 w-4 accent-[#0034c5] cursor-pointer"
              />
              <span className="text-[15px] text-[#434657] group-hover:text-[#0034c5] transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Singapore Location Area Filter */}
      <div>
        <h3 className="text-sm font-bold text-[#191b25] mb-3">
          Singapore Region
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Central', 'East', 'West', 'North', 'North-East'].map(area => (
            <button
              key={area}
              onClick={() => setFilters(prev => ({ ...prev, areaFilter: area }))}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                filters.areaFilter === area
                  ? 'bg-[#0034c5] text-white border-[#0034c5] font-bold'
                  : 'bg-white text-[#434657] border-[#c4c5da] hover:border-[#0034c5]'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
