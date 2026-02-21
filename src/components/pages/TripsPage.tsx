import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Trips } from '@/entities';
import { Package, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

export default function TripsPage() {
  const [trips, setTrips] = useState<Trips[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trips[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [trips, searchQuery, statusFilter]);

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Trips>('trips');
      setTrips(result.items);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...trips];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.tripName?.toLowerCase().includes(query) ||
        t.departureLocation?.toLowerCase().includes(query) ||
        t.destinationLocation?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.tripStatus === statusFilter);
    }

    setFilteredTrips(filtered);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-status-available text-white';
      case 'In Progress':
      case 'Dispatched':
        return 'bg-status-on-trip text-white';
      case 'Scheduled':
        return 'bg-status-in-shop text-foreground';
      case 'Cancelled':
        return 'bg-destructive text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
        {/* Header Section */}
        <section className="w-full bg-section-background">
          <div className="max-w-[100rem] mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h1 className="font-heading text-4xl text-foreground mb-3">Trip Management</h1>
                <p className="font-paragraph text-base text-secondary">
                  Monitor and manage all trip dispatches and deliveries
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-paragraph text-sm text-secondary">
                  {filteredTrips.length} of {trips.length} trips
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="w-full border-b border-section-background">
          <div className="max-w-[100rem] mx-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                <Input
                  type="text"
                  placeholder="Search by trip name or location..."
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
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Dispatched">Dispatched</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Trips Table */}
        <section className="w-full">
          <div className="max-w-[100rem] mx-auto px-6 py-8">
            <div className="min-h-[400px]">
              {isLoading ? null : filteredTrips.length > 0 ? (
                <div className="bg-background rounded shadow-sm border border-section-background overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-section-background">
                        <tr>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Trip Name</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Departure</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Destination</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Cargo Weight</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Scheduled Departure</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Status</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTrips.map((trip, index) => (
                          <motion.tr
                            key={trip._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="border-t border-section-background hover:bg-section-background/50 transition-colors"
                          >
                            <td className="px-6 py-4 font-paragraph text-sm text-foreground">{trip.tripName}</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">{trip.departureLocation}</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">{trip.destinationLocation}</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">{trip.cargoWeightKg?.toLocaleString()} kg</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">
                              {trip.scheduledDepartureTime ? format(new Date(trip.scheduledDepartureTime), 'MMM dd, yyyy HH:mm') : '-'}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getStatusColor(trip.tripStatus)}`}>
                                {trip.tripStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Link
                                to={`/trips/${trip._id}`}
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
                  <Package className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h3 className="font-heading text-xl text-foreground mb-2">No trips found</h3>
                  <p className="font-paragraph text-sm text-secondary">
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'No trips scheduled'}
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
