import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Vehicles, Trips, MaintenanceLogs } from '@/entities';
import { ArrowLeft, Truck, Calendar, Gauge, Package, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicles | null>(null);
  const [trips, setTrips] = useState<Trips[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVehicleData();
  }, [id]);

  const loadVehicleData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [vehicleData, tripsResult, maintenanceResult] = await Promise.all([
        BaseCrudService.getById<Vehicles>('vehicles', id),
        BaseCrudService.getAll<Trips>('trips'),
        BaseCrudService.getAll<MaintenanceLogs>('maintenancelogs')
      ]);
      
      setVehicle(vehicleData);
      
      const vehicleTrips = tripsResult.items.filter(t => t.assignedVehicleId === id);
      setTrips(vehicleTrips);
      
      const vehicleMaintenance = maintenanceResult.items.filter(m => m.vehicleLicensePlate === vehicleData?.licensePlate);
      setMaintenanceLogs(vehicleMaintenance);
    } catch (error) {
      console.error('Error loading vehicle data:', error);
    } finally {
      setIsLoading(false);
    }
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

  const getMaintenanceStatusColor = (status?: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-status-available text-white';
      case 'In Progress':
        return 'bg-status-on-trip text-white';
      case 'Pending':
      case 'Scheduled':
        return 'bg-status-in-shop text-foreground';
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
            <Link to="/vehicles" className="inline-flex items-center gap-2 font-paragraph text-sm text-secondary hover:text-primary mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Vehicles
            </Link>
            
            <div className="min-h-[100px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : !vehicle ? (
                <div className="text-center py-12">
                  <h1 className="font-heading text-2xl text-foreground mb-2">Vehicle not found</h1>
                  <p className="font-paragraph text-sm text-secondary">The vehicle you're looking for doesn't exist.</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h1 className="font-heading text-4xl text-foreground mb-2">{vehicle.name}</h1>
                      <p className="font-paragraph text-lg text-secondary">{vehicle.model}</p>
                    </div>
                    <span className={`inline-block px-4 py-2 rounded text-sm font-medium ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                      <div className="flex items-center gap-3 mb-2">
                        <Truck className="w-5 h-5 text-primary" />
                        <span className="font-paragraph text-sm text-secondary">License Plate</span>
                      </div>
                      <p className="font-heading text-xl text-foreground">{vehicle.licensePlate}</p>
                    </div>

                    <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-primary" />
                        <span className="font-paragraph text-sm text-secondary">Max Load Capacity</span>
                      </div>
                      <p className="font-heading text-xl text-foreground">{vehicle.maxLoadCapacity?.toLocaleString()} kg</p>
                    </div>

                    <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                      <div className="flex items-center gap-3 mb-2">
                        <Gauge className="w-5 h-5 text-primary" />
                        <span className="font-paragraph text-sm text-secondary">Odometer Reading</span>
                      </div>
                      <p className="font-heading text-xl text-foreground">{vehicle.odometerReading?.toLocaleString()} km</p>
                    </div>

                    <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                      <div className="flex items-center gap-3 mb-2">
                        <Truck className="w-5 h-5 text-primary" />
                        <span className="font-paragraph text-sm text-secondary">Vehicle Type</span>
                      </div>
                      <p className="font-heading text-xl text-foreground">{vehicle.vehicleType}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {!isLoading && vehicle && (
          <>
            {/* Trip History */}
            <section className="w-full">
              <div className="max-w-[100rem] mx-auto px-6 py-12">
                <h2 className="font-heading text-2xl text-foreground mb-6">Trip History</h2>
                {trips.length > 0 ? (
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
                ) : (
                  <div className="bg-background rounded shadow-sm border border-section-background p-12 text-center">
                    <Package className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <p className="font-paragraph text-sm text-secondary">No trip history available</p>
                  </div>
                )}
              </div>
            </section>

            {/* Maintenance History */}
            <section className="w-full bg-section-background">
              <div className="max-w-[100rem] mx-auto px-6 py-12">
                <h2 className="font-heading text-2xl text-foreground mb-6">Maintenance History</h2>
                {maintenanceLogs.length > 0 ? (
                  <div className="bg-background rounded shadow-sm border border-section-background overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-section-background">
                          <tr>
                            <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Type</th>
                            <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Service Date</th>
                            <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Description</th>
                            <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Cost</th>
                            <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Mechanic</th>
                            <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {maintenanceLogs.map((log, index) => (
                            <motion.tr
                              key={log._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="border-t border-section-background hover:bg-section-background/50 transition-colors"
                            >
                              <td className="px-6 py-4 font-paragraph text-sm text-foreground">{log.maintenanceType}</td>
                              <td className="px-6 py-4 font-paragraph text-sm text-secondary">
                                {log.serviceDate ? format(new Date(log.serviceDate), 'MMM dd, yyyy') : '-'}
                              </td>
                              <td className="px-6 py-4 font-paragraph text-sm text-secondary">{log.description}</td>
                              <td className="px-6 py-4 font-paragraph text-sm text-secondary">${log.cost?.toLocaleString()}</td>
                              <td className="px-6 py-4 font-paragraph text-sm text-secondary">{log.mechanicName}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getMaintenanceStatusColor(log.serviceStatus)}`}>
                                  {log.serviceStatus}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-background rounded shadow-sm border border-section-background p-12 text-center">
                    <Wrench className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <p className="font-paragraph text-sm text-secondary">No maintenance history available</p>
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
