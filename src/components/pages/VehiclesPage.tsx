import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Vehicles } from '@/entities';
import { Truck, Filter, Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicles[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, searchQuery, statusFilter, typeFilter]);

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Vehicles>('vehicles');
      setVehicles(result.items);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v =>
        v.name?.toLowerCase().includes(query) ||
        v.model?.toLowerCase().includes(query) ||
        v.licensePlate?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(v => v.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(v => v.vehicleType === typeFilter);
    }

    setFilteredVehicles(filtered);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Available':
        return 'bg-status-available text-white';
      case 'On Trip':
        return 'bg-status-on-trip text-white';
      case 'In Shop':
        return 'bg-status-in-shop text-foreground';
      case 'Out of Service':
        return 'bg-status-suspended text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  const vehicleTypes = Array.from(new Set(vehicles.map(v => v.vehicleType).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
        {/* Header Section */}
        <section className="w-full bg-section-background">
          <div className="max-w-[100rem] mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h1 className="font-heading text-4xl text-foreground mb-3">Vehicle Registry</h1>
                <p className="font-paragraph text-base text-secondary">
                  Manage your fleet assets and monitor vehicle status
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-paragraph text-sm text-secondary">
                  {filteredVehicles.length} of {vehicles.length} vehicles
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="w-full border-b border-section-background">
          <div className="max-w-[100rem] mx-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                <Input
                  type="text"
                  placeholder="Search by name, model, or license plate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-paragraph text-sm"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="font-paragraph text-sm">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="On Trip">On Trip</SelectItem>
                  <SelectItem value="In Shop">In Shop</SelectItem>
                  <SelectItem value="Out of Service">Out of Service</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="font-paragraph text-sm">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {vehicleTypes.map(type => (
                    <SelectItem key={type} value={type!}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Vehicles Table */}
        <section className="w-full">
          <div className="max-w-[100rem] mx-auto px-6 py-8">
            <div className="min-h-[400px]">
              {isLoading ? null : filteredVehicles.length > 0 ? (
                <div className="bg-background rounded shadow-sm border border-section-background overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-section-background">
                        <tr>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Name</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Model</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">License Plate</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Type</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Max Load (kg)</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Odometer (km)</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Status</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVehicles.map((vehicle, index) => (
                          <motion.tr
                            key={vehicle._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="border-t border-section-background hover:bg-section-background/50 transition-colors"
                          >
                            <td className="px-6 py-4 font-paragraph text-sm text-foreground">{vehicle.name}</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">{vehicle.model}</td>
                            <td className="px-6 py-4 font-paragraph text-sm font-medium text-foreground">{vehicle.licensePlate}</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">{vehicle.vehicleType}</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">{vehicle.maxLoadCapacity?.toLocaleString()}</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">{vehicle.odometerReading?.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                                {vehicle.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Link
                                to={`/vehicles/${vehicle._id}`}
                                className="font-paragraph text-sm text-primary hover:underline"
                              >
                                View Details
                              </Link>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-background rounded shadow-sm border border-section-background p-12 text-center">
                  <Truck className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h3 className="font-heading text-xl text-foreground mb-2">No vehicles found</h3>
                  <p className="font-paragraph text-sm text-secondary">
                    {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'No vehicles in the registry'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
