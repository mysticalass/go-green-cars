import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SidebarFilters } from './components/SidebarFilters';
import { VehicleCard } from './components/VehicleCard';
import { VehicleDetailsModal } from './components/VehicleDetailsModal';
import { BookingModal } from './components/BookingModal';
import { LocationsView } from './components/LocationsView';
import { LiveCarparksView } from './components/LiveCarparksView';
import { RatesCalculatorView } from './components/RatesCalculatorView';
import { SustainabilityView } from './components/SustainabilityView';
import { ProfileView } from './components/ProfileView';
import { DisqusForum } from './components/DisqusForum';
import { NewsletterFooter } from './components/NewsletterFooter';
import { SupportChatModal } from './components/SupportChatModal';
import { VEHICLES_DATA, DEFAULT_USER_PROFILE, DEFAULT_CONFIRMED_BOOKINGS } from './data/mockData';
import { Vehicle, Booking, UserEcoProfile, NavTab, FilterState } from './types';
import { Search, Filter, MessageSquare, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('cars');
  const [userProfile, setUserProfile] = useState<UserEcoProfile>(DEFAULT_USER_PROFILE);
  const [bookings, setBookings] = useState<Booking[]>(DEFAULT_CONFIRMED_BOOKINGS);

  // Modals state
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);
  const [bookingHours, setBookingHours] = useState<number>(3);
  const [bookingKm, setBookingKm] = useState<number>(45);
  const [supportOpen, setSupportOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
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

  // Filtered vehicles logic
  const filteredVehicles = useMemo(() => {
    return VEHICLES_DATA.filter(veh => {
      // Fuel type
      if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(veh.fuelType)) {
        return false;
      }
      // Vehicle type
      if (filters.vehicleTypes.length > 0 && !filters.vehicleTypes.includes(veh.vehicleType)) {
        return false;
      }
      // Categories
      if (filters.categories.length > 0 && !filters.categories.includes(veh.category)) {
        return false;
      }
      // Brands
      if (filters.brands.length > 0 && !filters.brands.includes(veh.brand)) {
        return false;
      }
      // Area
      if (filters.areaFilter !== 'All' && veh.area !== filters.areaFilter) {
        return false;
      }
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = veh.name.toLowerCase().includes(q);
        const matchesType = veh.vehicleType.toLowerCase().includes(q);
        const matchesLocation = veh.location.toLowerCase().includes(q);
        const matchesBrand = veh.brand.toLowerCase().includes(q);
        const matchesCategory = veh.category.toLowerCase().includes(q);
        if (!matchesName && !matchesType && !matchesLocation && !matchesBrand && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

  const handleOpenBooking = (vehicle: Vehicle, hours: number = 3, estimatedKm: number = 45) => {
    setSelectedVehicle(null);
    setBookingVehicle(vehicle);
    setBookingHours(hours);
    setBookingKm(estimatedKm);
  };

  const handleCompleteBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    // update eco profile
    setUserProfile(prev => ({
      ...prev,
      ecoPoints: prev.ecoPoints + Math.round(newBooking.co2SavedKg * 10),
      totalTrips: prev.totalTrips + 1,
      totalKmDriven: prev.totalKmDriven + newBooking.estimatedKm,
      totalCo2SavedKg: Number((prev.totalCo2SavedKg + newBooking.co2SavedKg).toFixed(1)),
      savedMoneyVsPetrolSgd: prev.savedMoneyVsPetrolSgd + (newBooking.estimatedKm * 0.15)
    }));
    setActiveTab('profile');
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf8ff] text-[#191b25] antialiased">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenSupport={() => setSupportOpen(true)}
      />

      {/* Main Tab Routing */}
      {activeTab === 'cars' && (
        <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 relative">
          {/* Desktop Left Sidebar Filters */}
          <div className="hidden lg:block">
            <SidebarFilters
              filters={filters}
              setFilters={setFilters}
              totalMatches={filteredVehicles.length}
            />
          </div>

          {/* Mobile Filter Drawer Modal */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end lg:hidden">
              <div className="bg-white w-5/6 max-w-sm h-full p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between">
                <SidebarFilters
                  filters={filters}
                  setFilters={setFilters}
                  totalMatches={filteredVehicles.length}
                />
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full mt-6 py-3 bg-[#0034c5] text-white font-bold text-sm rounded-xl text-center cursor-pointer"
                >
                  Apply Filters ({filteredVehicles.length} Results)
                </button>
              </div>
            </div>
          )}

          {/* Right Main Content */}
          <div className="flex-grow w-full space-y-6">
            {/* Mobile Header Filter Button */}
            <div className="lg:hidden flex items-center justify-between gap-3">
              <h1 className="text-2xl font-bold text-[#191b25]">Our vehicles</h1>
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center gap-2 text-[#0034c5] font-bold text-xs py-2 px-4 rounded-lg bg-[#f3f2ff] border border-[#c4c5da] cursor-pointer"
              >
                <Filter className="w-4 h-4" /> Filter by ({filteredVehicles.length})
              </button>
            </div>

            {/* Sticky Search Bar matching exact style */}
            <div className="sticky top-20 z-40 bg-[#fbf8ff]/95 backdrop-blur-xs py-2">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#545e77]" />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder="Search for vehicles by model, category, or location..."
                  className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-[#E2E8F0] bg-white text-base text-[#191b25] placeholder:text-[#545e77] focus:outline-hidden focus:border-[#0034c5] focus:ring-2 focus:ring-[#0034c5]/20 shadow-xs"
                />
                {filters.searchQuery && (
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Active Filter Chips */}
            {(filters.categories.length > 0 || filters.vehicleTypes.length > 0 || filters.brands.length > 0 || filters.areaFilter !== 'All') && (
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-[#545e77] font-semibold">Active:</span>
                {filters.areaFilter !== 'All' && (
                  <span className="px-2.5 py-1 rounded-full bg-[#0034c5] text-white font-bold flex items-center gap-1">
                    {filters.areaFilter} Region
                  </span>
                )}
                {filters.categories.map(c => (
                  <span key={c} className="px-2.5 py-1 rounded-full bg-blue-100 text-[#0034c5] font-bold">
                    {c}
                  </span>
                ))}
                {filters.vehicleTypes.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-slate-100 text-[#191b25] font-semibold">
                    {t}
                  </span>
                ))}
                {filters.brands.map(b => (
                  <span key={b} className="px-2.5 py-1 rounded-full bg-slate-100 text-[#191b25] font-semibold">
                    {b}
                  </span>
                ))}
                <button
                  onClick={() => setFilters({
                    fuelTypes: ['Electric'],
                    vehicleTypes: [],
                    categories: [],
                    brands: [],
                    searchQuery: '',
                    seatCount: null,
                    maxHourlyRate: 30,
                    areaFilter: 'All',
                    onlyAvailable: false
                  })}
                  className="text-[#0034c5] font-semibold hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Vehicle Grid matching 3-col on XL */}
            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map(vehicle => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onSelect={(v) => setSelectedVehicle(v)}
                    onQuickBook={(v) => handleOpenBooking(v)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-[#E2E8F0] text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-[#747688] mx-auto" />
                <h3 className="text-xl font-bold text-[#191b25]">No electric vehicles match your filter</h3>
                <p className="text-sm text-[#545e77] max-w-md mx-auto">
                  Try clearing some filter criteria or searching for another location across Singapore.
                </p>
                <button
                  onClick={() => setFilters({
                    fuelTypes: ['Electric'],
                    vehicleTypes: [],
                    categories: [],
                    brands: [],
                    searchQuery: '',
                    seatCount: null,
                    maxHourlyRate: 30,
                    areaFilter: 'All',
                    onlyAvailable: false
                  })}
                  className="px-5 py-2.5 bg-[#0034c5] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#00248c]"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {activeTab === 'profile' && (
        <ProfileView
          userProfile={userProfile}
          bookings={bookings}
          onSelectVehicleToBook={(v) => handleOpenBooking(v)}
          onNavigateToLocations={() => setActiveTab('locations')}
          onOpenSupport={() => setSupportOpen(true)}
          onCancelBooking={handleCancelBooking}
        />
      )}

      {activeTab === 'rates' && <RatesCalculatorView />}
      {activeTab === 'locations' && <LocationsView onSelectVehicle={(v) => handleOpenBooking(v)} />}
      {activeTab === 'carparks' && <LiveCarparksView />}
      {activeTab === 'sustainability' && (
        <SustainabilityView
          userProfile={userProfile}
          onUpdateProfile={setUserProfile}
        />
      )}

      {/* Community Discussion Forum (Disqus) */}
      <DisqusForum pageIdentifier={`go-green-cars-${activeTab}`} />

      {/* Weekly Newsletter & Footer */}
      <NewsletterFooter
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupport={() => setSupportOpen(true)}
      />

      {/* Modals */}
      <VehicleDetailsModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        onBookNow={(veh, hours, km) => handleOpenBooking(veh, hours, km)}
      />

      <BookingModal
        vehicle={bookingVehicle}
        initialHours={bookingHours}
        initialEstimatedKm={bookingKm}
        onClose={() => setBookingVehicle(null)}
        onCompleteBooking={handleCompleteBooking}
      />

      <SupportChatModal
        isOpen={supportOpen}
        onClose={() => setSupportOpen(false)}
      />

      {/* Floating 24/7 AI Chat Widget Button */}
      <button
        onClick={() => setSupportOpen(true)}
        aria-label="Open 24/7 Customer Support Assistant"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#b9c3ff] hover:bg-[#dde1ff] text-[#001257] rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all z-40 cursor-pointer border-2 border-white"
      >
        <MessageSquare className="w-6 h-6 fill-[#001257]" />
      </button>
    </div>
  );
}
