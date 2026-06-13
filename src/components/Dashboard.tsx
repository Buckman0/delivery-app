import React, { useState, useEffect } from 'react';
import { Truck, Clock, CheckCircle, TrendingUp, Package, MapPin, PlusCircle, Trash2, Check, Search } from 'lucide-react';

export default function Dashboard() {
  // 1. Modified State: Instead of hardcoded data, we check localStorage first!
  const [deliveries, setDeliveries] = useState(() => {
    const savedDeliveries = localStorage.getItem('hub_deliveries');
    if (savedDeliveries) {
      return JSON.parse(savedDeliveries); // Use saved data if it exists
    } else {
      // Default initial data if localStorage is totally empty
      return [
        { id: "DLV-8942", destination: "102 Oak St, Metropolis", status: "In Transit", driver: "Alex M." },
        { id: "DLV-8943", destination: "742 Evergreen Terr", status: "Pending", driver: "Sarah T." },
        { id: "DLV-8944", destination: "555 California St", status: "Delivered", driver: "James K." },
      ];
    }
  });

  const [destination, setDestination] = useState('');
  const [driver, setDriver] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // NEW: This useEffect hook automatically triggers a save to the browser's storage vault 
  // every single time the "deliveries" array changes.
  useEffect(() => {
    localStorage.setItem('hub_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  const handleAddShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !driver) return;

    const newDelivery = {
      id: `DLV-${Math.floor(1000 + Math.random() * 9000)}`,
      destination: destination,
      driver: driver,
      status: "Pending"
    };

    setDeliveries([newDelivery, ...deliveries]);
    setDestination('');
    setDriver('');
  };

  const handleDeleteShipment = (idToDelete: string) => {
    const updatedDeliveries = deliveries.filter(delivery => delivery.id !== idToDelete);
    setDeliveries(updatedDeliveries);
  };

  const handleDeliverShipment = (idToUpdate: string) => {
    const updatedDeliveries = deliveries.map(delivery => {
      if (delivery.id === idToUpdate) {
        return { ...delivery, status: "Delivered" };
      }
      return delivery;
    });
    setDeliveries(updatedDeliveries);
  };

  const filteredDeliveries = deliveries.filter(delivery => 
    delivery.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock data for our top metrics boxes
  const stats = [
    { title: "Active Deliveries", value: "18", icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Pending Orders", value: "7", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Completed Today", value: "142", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Fleet Efficiency", value: "94%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800">
      {/* Dashboard Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Delivery Hub System</h1>
        <p className="text-sm text-slate-500">Real-time logistics and fleet management tracking.</p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="flex items-center rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} mr-4`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Shipment Form */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <PlusCircle size={18} className="text-blue-500" /> Dispatch New Shipment
        </h2>
        <form onSubmit={handleAddShipment} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Destination Address</label>
            <input 
              type="text" 
              placeholder="e.g. 123 Main St, New York" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Assigned Driver</label>
            <input 
              type="text" 
              placeholder="e.g. Marcus V." 
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <button 
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Shipment
          </button>
        </form>
      </div>

      {/* Active Shipments Table */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Package size={18} className="text-slate-500" /> Active Shipments
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search driver, ID, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Tracking ID</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((delivery, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{delivery.id}</td>
                    <td className="px-4 py-3 flex items-center gap-1">
                      <MapPin size={14} className="text-slate-400" /> {delivery.destination}
                    </td>
                    <td className="px-4 py-3">{delivery.driver}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        delivery.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10' :
                        delivery.status === 'In Transit' ? 'bg-blue-50 text-blue-700 ring-blue-600/10' :
                        'bg-amber-50 text-amber-700 ring-amber-600/10'
                      }`}>
                        {delivery.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {delivery.status !== 'Delivered' && (
                          <button 
                            onClick={() => handleDeliverShipment(delivery.id)}
                            className="text-slate-400 hover:text-emerald-600 p-1 rounded-md hover:bg-emerald-50 transition-colors"
                            title="Mark as Delivered"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteShipment(delivery.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                          title="Delete Shipment"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No matching shipments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}