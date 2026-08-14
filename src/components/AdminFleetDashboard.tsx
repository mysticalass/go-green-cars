import React, { useState } from 'react';
import { VEHICLES_DATA, CHARGING_STATIONS } from '../data/mockData';
import { Vehicle } from '../types';
import { Shield, Zap, BatteryCharging, AlertTriangle, CheckCircle2, Wrench, Lock, Unlock, Play, RefreshCw, Send, DollarSign, Activity } from 'lucide-react';

export const AdminFleetDashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(VEHICLES_DATA);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState('All');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  const handleDispatchRunner = (vehicle: Vehicle) => {
    notify(`⚡ Operations Dispatch: Mobile charging runner assigned to ${vehicle.name} (${vehicle.plateNumber}) at ${vehicle.location}!`);
  };

  const handleToggleLock = (vehicleId: string) => {
    notify(`🔒 Remote Telematics command sent: Door lock state toggled for vehicle ${vehicleId}`);
  };

  const handleToggleMaintenance = (vehicleId: string) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        const nextAvail = !v.isAvailable;
        notify(`Vehicle ${v.plateNumber} set to ${nextAvail ? 'AVAILABLE' : 'MAINTENANCE / CHARGING'}`);
        return { ...v, isAvailable: nextAvail };
      }
      return v;
    }));
  };

  const totalEvs = vehicles.length;
  const availableEvs = vehicles.filter(v => v.isAvailable).length;
  const avgSoc = Math.round(vehicles.reduce((acc, v) => acc + v.currentBatteryPercent, 0) / totalEvs);
  const lowBatteryCount = vehicles.filter(v => v.currentBatteryPercent < 80).length;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Notification Toast */}
      {statusNotification && (
        <div className="bg-[#191b25] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg border border-[#0034c5] flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>{statusNotification}</span>
          </div>
          <button onClick={() => setStatusNotification(null)} className="text-white/60 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0034c5] text-xs font-bold mb-2">
            <Activity className="w-3.5 h-3.5" /> Fleet Control Center
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#191b25] tracking-tight">
            Singapore EV Fleet Operations & Telematics
          </h1>
          <p className="text-sm lg:text-base text-[#545e77] mt-1">
            Real-time IoT telemetry, State-of-Charge (SoC) management, charging runner dispatch, and dynamic tariff optimization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => notify('CAN-bus telemetry updated: 8 vehicles active, 0 fault codes.')}
            className="px-4 py-2 bg-white border border-[#c4c5da] hover:border-[#0034c5] text-[#191b25] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#0034c5]" /> Sync Telematics
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-bold text-[#545e77] uppercase tracking-wider">Fleet Status</span>
          <div className="text-3xl font-bold text-[#191b25] mt-2">
            {availableEvs} <span className="text-base font-normal text-[#545e77]">/ {totalEvs} online</span>
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 100% Zero-Emission BEVs
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-bold text-[#545e77] uppercase tracking-wider">Fleet Avg Battery SoC</span>
          <div className="text-3xl font-bold text-[#0034c5] mt-2">{avgSoc}%</div>
          <div className="text-xs text-[#545e77] mt-2">Target minimum threshold: 70% SoC</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-bold text-[#545e77] uppercase tracking-wider">Today's Gross Bookings</span>
          <div className="text-3xl font-bold text-[#191b25] mt-2">S$14,280</div>
          <div className="text-xs text-emerald-700 font-semibold mt-2">↑ 18.4% vs last week</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-bold text-[#545e77] uppercase tracking-wider">Daily CO₂ Emissions Saved</span>
          <div className="text-3xl font-bold text-emerald-600 mt-2">488.2 kg</div>
          <div className="text-xs text-[#545e77] mt-2">Equivalent to 24 tree days</div>
        </div>
      </div>

      {/* Fleet Telematics Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
        <div className="px-6 py-4 bg-[#fbf8ff] border-b border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="font-bold text-base text-[#191b25]">Real-Time Vehicle Telematics & Controls</h2>
            <p className="text-xs text-[#545e77]">Live telemetry over AWS IoT Core / MQTT connected to CAN-bus</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#545e77] font-semibold">Filter Area:</span>
            <select
              value={selectedAreaFilter}
              onChange={(e) => setSelectedAreaFilter(e.target.value)}
              className="text-xs border border-[#c4c5da] rounded-lg px-2.5 py-1.5 bg-white font-semibold"
            >
              <option value="All">All Regions</option>
              <option value="Central">Central</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="North">North</option>
              <option value="North-East">North-East</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#f3f2ff] text-[#191b25] font-bold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4 sm:px-6">Plate & Vehicle</th>
                <th className="py-3 px-4">Battery SoC</th>
                <th className="py-3 px-4">Current Hub Location</th>
                <th className="py-3 px-4">CPO Network</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Telematics Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#434657]">
              {vehicles
                .filter(v => selectedAreaFilter === 'All' || v.area === selectedAreaFilter)
                .map(v => (
                  <tr key={v.id} className="hover:bg-[#fbf8ff] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-[#191b25]">{v.plateNumber}</div>
                      <div className="text-xs text-[#545e77]">{v.name} ({v.category})</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${v.currentBatteryPercent > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${v.currentBatteryPercent}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-xs">{v.currentBatteryPercent}%</span>
                      </div>
                      <div className="text-[10px] text-[#747688]">{v.rangeKm} km est.</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-xs text-[#191b25] max-w-[200px] truncate">{v.location}</div>
                      <div className="text-[11px] text-blue-600 font-semibold">{v.area} Region</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {v.chargingNetwork}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {v.isAvailable ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Wrench className="w-3 h-3" /> In Service
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleDispatchRunner(v)}
                        title="Dispatch Mobile Fast Charging Runner"
                        className="p-1.5 rounded-lg bg-[#f3f2ff] hover:bg-[#dde1ff] text-[#0034c5] font-bold text-xs cursor-pointer transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        onClick={() => handleToggleLock(v.id)}
                        title="Send Bluetooth Lock/Unlock Pulse"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        onClick={() => handleToggleMaintenance(v.id)}
                        title="Toggle Maintenance Mode"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                      >
                        <Wrench className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
