import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Drivers, Trips } from '@/entities';
import { ArrowLeft, User, Mail, Phone, Calendar, Award, TrendingUp, MapPin, Truck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Image } from '@/components/ui/image';
import { format } from 'date-fns';

export default function DriverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [driver, setDriver] = useState<Drivers | null>(null);
  const [trips, setTrips] = useState<Trips[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDriverData();
  }, [id]);

  const loadDriverData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [driverData, tripsResult] = await Promise.all([
        BaseCrudService.getById<Drivers>('drivers', id),
        BaseCrudService.getAll<Trips>('trips')
      ]);
      
      setDriver(driverData);
      
      const driverTrips = tripsResult.items.filter(t => t.assignedDriverId === id);
      setTrips(driverTrips);
    } catch (error) {
      console.error('Error loading driver data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'On Duty':
        return 'bg-status-available text-white';
      case 'Off Duty':
        return 'bg-secondary text-white';
      case 'Suspended':
        return 'bg-status-suspended text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  const getLicenseStatusColor = (status?: string) => {
    switch (status) {
      case 'Valid':
        return 'bg-status-available text-white';
      case 'Expired':
        return 'bg-destructive text-white';
      case 'Expiring Soon':
        return 'bg-status-in-shop text-foreground';
      default:
        return 'bg-secondary text-white';
    }
  };

  const getTripStatusColor = (status?: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-status-available text-white';
      case 'In Progress':
      case 'Dispatched':
        return 'bg-status-on-trip text-white';
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
          <div className="max-w-[100rem] mx-auto px-6 py-8">
            <Link to="/drivers" className="inline-flex items-center gap-2 font-paragraph text-sm text-secondary hover:text-primary mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Drivers
            </Link>
            
            <div className="min-h-[100px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : !driver ? (
                <div className="text-center py-12">
                  <h1 className="font-heading text-2xl text-foreground mb-2">Driver not found</h1>
                  <p className="font-paragraph text-sm text-secondary">The driver you're looking for doesn't exist.</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
                    {driver.profilePicture ? (
                      <Image
                        src={driver.profilePicture}
                        alt={driver.fullName || 'Driver'}
                        width={120}
                        className="w-32 h-32 rounded object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded bg-background border border-section-background flex items-center justify-center">
                        <User className="w-16 h-16 text-secondary" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h1 className="font-heading text-4xl text-foreground mb-2">{driver.fullName}</h1>
                          <p className="font-paragraph text-lg text-secondary">{driver.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block px-4 py-2 rounded text-sm font-medium ${getStatusColor(driver.dutyStatus)}`}>
                            {driver.dutyStatus}
                          </span>
                          <span className={`inline-block px-4 py-2 rounded text-sm font-medium ${getLicenseStatusColor(driver.licenseStatus)}`}>
                            {driver.licenseStatus}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                          <div className="flex items-center gap-3 mb-2">
                            <Phone className="w-5 h-5 text-primary" />
                            <span className="font-paragraph text-sm text-secondary">Contact</span>
                          </div>
                          <p className="font-paragraph text-base text-foreground">{driver.contactNumber}</p>
                        </div>

                        <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                          <div className="flex items-center gap-3 mb-2">
                            <Award className="w-5 h-5 text-primary" />
                            <span className="font-paragraph text-sm text-secondary">License Number</span>
                          </div>
                          <p className="font-paragraph text-base text-foreground">{driver.licenseNumber}</p>
                        </div>

                        <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                          <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span className="font-paragraph text-sm text-secondary">License Expiry</span>
                          </div>
                          <p className="font-paragraph text-base text-foreground">
                            {driver.licenseExpiryDate ? format(new Date(driver.licenseExpiryDate), 'MMM dd, yyyy') : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {!isLoading && driver && (
          <>
            {/* Performance Metrics */}
            <section className="w-full">
              <div className="max-w-[100rem] mx-auto px-6 py-12">
                <h2 className="font-heading text-2xl text-foreground mb-6">Performance Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-background p-8 rounded shadow-sm border border-section-background">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-status-available/10 p-3 rounded">
                        <Award className="w-6 h-6 text-status-available" />
                      </div>
                      <span className="font-paragraph text-sm text-secondary">Safety Score</span>
                    </div>
                    <p className="font-heading text-4xl text-foreground mb-2">{driver.safetyScore}</p>
                    <p className="font-paragraph text-sm text-secondary">out of 100</p>
                  </div>

                  <div className="bg-background p-8 rounded shadow-sm border border-section-background">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-3 rounded">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <span className="font-paragraph text-sm text-secondary">Trip Completion Rate</span>
                    </div>
                    <p className="font-heading text-4xl text-foreground mb-2">{driver.tripCompletionRate}%</p>
                    <p className="font-paragraph text-sm text-secondary">completion rate</p>
                  </div>

                  <div className="bg-background p-8 rounded shadow-sm border border-section-background">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-status-on-trip/10 p-3 rounded">
                        <TrendingUp className="w-6 h-6 text-status-on-trip" />
                      </div>
                      <span className="font-paragraph text-sm text-secondary">Total Trips</span>
                    </div>
                    <p className="font-heading text-4xl text-foreground mb-2">{trips.length}</p>
                    <p className="font-paragraph text-sm text-secondary">trips assigned</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Trip History */}
            <section className="w-full bg-section-background">
              <div className="max-w-[100rem] mx-auto px-6 py-12">
                <h2 className="font-heading text-2xl text-foreground mb-6">Trip History</h2>
                {trips.length > 0 ? (
                  <div className="space-y-4">
                    {/* Active Trip Highlight */}
                    {trips.find(t => t.tripStatus === 'In Progress' || t.tripStatus === 'Dispatched') && (
                      <div className="bg-status-on-trip/10 border-2 border-status-on-trip rounded-lg p-6 mb-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-status-on-trip/20 p-3 rounded-lg">
                            <Truck className="w-6 h-6 text-status-on-trip" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-heading text-lg text-status-on-trip font-bold mb-2">Currently Active Trip</h3>
                            {trips.find(t => t.tripStatus === 'In Progress' || t.tripStatus === 'Dispatched') && (
                              <div className="space-y-2">
                                <p className="font-heading text-base text-foreground">{trips.find(t => t.tripStatus === 'In Progress' || t.tripStatus === 'Dispatched')?.tripName}</p>
                                <div className="flex items-center gap-2 text-sm font-paragraph text-secondary">
                                  <MapPin className="w-4 h-4" />
                                  <span>{trips.find(t => t.tripStatus === 'In Progress' || t.tripStatus === 'Dispatched')?.departureLocation} → {trips.find(t => t.tripStatus === 'In Progress' || t.tripStatus === 'Dispatched')?.destinationLocation}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-paragraph text-secondary">
                                  <Clock className="w-4 h-4" />
                                  <span>Cargo: {trips.find(t => t.tripStatus === 'In Progress' || t.tripStatus === 'Dispatched')?.cargoWeightKg?.toLocaleString()} kg</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-background rounded shadow-sm border border-section-background overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-section-background">
                            <tr>
                              <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Trip Name</th>
                              <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Departure</th>
                              <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Destination</th>
                              <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Cargo Weight</th>
                              <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Status</th>
                              <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {trips.map((trip, index) => (
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
                                <td className="px-6 py-4">
                                  <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getTripStatusColor(trip.tripStatus)}`}>
                                    {trip.tripStatus}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <Link to={`/trips/${trip._id}`} className="font-paragraph text-sm text-primary hover:underline">
                                    View Details
                                  </Link>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-background rounded shadow-sm border border-section-background p-12 text-center">
                    <User className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <p className="font-paragraph text-sm text-secondary">No trip history available</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
