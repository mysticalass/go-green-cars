import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
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
import { DEFAULT_USER_PROFILE, DEFAULT_CONFIRMED_BOOKINGS } from './data/mockData';
import { Vehicle, Booking, UserEcoProfile, NavTab } from './types';
import { MessageSquare } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('profile');
  const [userProfile, setUserProfile] = useState<UserEcoProfile>(DEFAULT_USER_PROFILE);
  const [bookings, setBookings] = useState<Booking[]>(DEFAULT_CONFIRMED_BOOKINGS);

  // Modals state
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);
  const [bookingHours, setBookingHours] = useState<number>(3);
  const [bookingKm, setBookingKm] = useState<number>(45);
  const [supportOpen, setSupportOpen] = useState(false);

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
