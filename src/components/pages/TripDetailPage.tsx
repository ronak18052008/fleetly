import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Trips, Vehicles, Drivers } from '@/entities';
import { ArrowLeft, Package, MapPin, Calendar, Truck, User, Weight } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trips | null>(null);
  const [vehicle, setVehicle] = useState<Vehicles | null>(null);
  const [driver, setDriver] = useState<Drivers | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTripData();
  }, [id]);

  const loadTripData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const tripData = await BaseCrudService.getById<Trips>('trips', id);
      setTrip(tripData);

      if (tripData?.assignedVehicleId) {
        const vehicleData = await BaseCrudService.getById<Vehicles>('vehicles', tripData.assignedVehicleId);
        setVehicle(vehicleData);
      }

      if (tripData?.assignedDriverId) {
        const driverData = await BaseCrudService.getById<Drivers>('drivers', tripData.assignedDriverId);
        setDriver(driverData);
      }
    } catch (error) {
      console.error('Error loading trip data:', error);
    } finally {
      setIsLoading(false);
    }
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
          <div className="max-w-[100rem] mx-auto px-6 py-8">
            <Link to="/trips" className="inline-flex items-center gap-2 font-paragraph text-sm text-secondary hover:text-primary mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Trips
            </Link>
            
            <div className="min-h-[100px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : !trip ? (
                <div className="text-center py-12">
                  <h1 className="font-heading text-2xl text-foreground mb-2">Trip not found</h1>
                  <p className="font-paragraph text-sm text-secondary">The trip you're looking for doesn't exist.</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h1 className="font-heading text-4xl text-foreground mb-2">{trip.tripName}</h1>
                      <p className="font-paragraph text-lg text-secondary">{trip.cargoDescription}</p>
                    </div>
                    <span className={`inline-block px-4 py-2 rounded text-sm font-medium ${getStatusColor(trip.tripStatus)}`}>
                      {trip.tripStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span className="font-paragraph text-sm text-secondary">Departure Location</span>
                      </div>
                      <p className="font-heading text-lg text-foreground">{trip.departureLocation}</p>
                    </div>

                    <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span className="font-paragraph text-sm text-secondary">Destination</span>
                      </div>
                      <p className="font-heading text-lg text-foreground">{trip.destinationLocation}</p>
                    </div>

                    <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                      <div className="flex items-center gap-3 mb-2">
                        <Weight className="w-5 h-5 text-primary" />
                        <span className="font-paragraph text-sm text-secondary">Cargo Weight</span>
                      </div>
                      <p className="font-heading text-lg text-foreground">{trip.cargoWeightKg?.toLocaleString()} kg</p>
                    </div>

                    <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-paragraph text-sm text-secondary">Scheduled Departure</span>
                      </div>
                      <p className="font-heading text-lg text-foreground">
                        {trip.scheduledDepartureTime ? format(new Date(trip.scheduledDepartureTime), 'MMM dd, yyyy HH:mm') : '-'}
                      </p>
                    </div>

                    <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-paragraph text-sm text-secondary">Scheduled Arrival</span>
                      </div>
                      <p className="font-heading text-lg text-foreground">
                        {trip.scheduledArrivalTime ? format(new Date(trip.scheduledArrivalTime), 'MMM dd, yyyy HH:mm') : '-'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {!isLoading && trip && (
          <>
            {/* Assigned Resources */}
            <section className="w-full">
              <div className="max-w-[100rem] mx-auto px-6 py-12">
                <h2 className="font-heading text-2xl text-foreground mb-6">Assigned Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Assigned Vehicle */}
                  <div className="bg-background p-8 rounded shadow-sm border border-section-background">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-primary/10 p-3 rounded">
                        <Truck className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-heading text-xl text-foreground">Assigned Vehicle</h3>
                    </div>
                    {vehicle ? (
                      <div className="space-y-3">
                        <div>
                          <span className="font-paragraph text-sm text-secondary">Name</span>
                          <p className="font-paragraph text-base text-foreground">{vehicle.name}</p>
                        </div>
                        <div>
                          <span className="font-paragraph text-sm text-secondary">Model</span>
                          <p className="font-paragraph text-base text-foreground">{vehicle.model}</p>
                        </div>
                        <div>
                          <span className="font-paragraph text-sm text-secondary">License Plate</span>
                          <p className="font-paragraph text-base text-foreground">{vehicle.licensePlate}</p>
                        </div>
                        <div>
                          <span className="font-paragraph text-sm text-secondary">Max Load Capacity</span>
                          <p className="font-paragraph text-base text-foreground">{vehicle.maxLoadCapacity?.toLocaleString()} kg</p>
                        </div>
                        <Link
                          to={`/vehicles/${vehicle._id}`}
                          className="inline-block mt-4 font-paragraph text-sm text-primary hover:underline"
                        >
                          View Vehicle Details
                        </Link>
                      </div>
                    ) : (
                      <p className="font-paragraph text-sm text-secondary">No vehicle assigned</p>
                    )}
                  </div>

                  {/* Assigned Driver */}
                  <div className="bg-background p-8 rounded shadow-sm border border-section-background">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-primary/10 p-3 rounded">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-heading text-xl text-foreground">Assigned Driver</h3>
                    </div>
                    {driver ? (
                      <div className="space-y-3">
                        <div>
                          <span className="font-paragraph text-sm text-secondary">Full Name</span>
                          <p className="font-paragraph text-base text-foreground">{driver.fullName}</p>
                        </div>
                        <div>
                          <span className="font-paragraph text-sm text-secondary">Contact Number</span>
                          <p className="font-paragraph text-base text-foreground">{driver.contactNumber}</p>
                        </div>
                        <div>
                          <span className="font-paragraph text-sm text-secondary">License Number</span>
                          <p className="font-paragraph text-base text-foreground">{driver.licenseNumber}</p>
                        </div>
                        <div>
                          <span className="font-paragraph text-sm text-secondary">Safety Score</span>
                          <p className="font-paragraph text-base text-foreground">{driver.safetyScore}/100</p>
                        </div>
                        <Link
                          to={`/drivers/${driver._id}`}
                          className="inline-block mt-4 font-paragraph text-sm text-primary hover:underline"
                        >
                          View Driver Details
                        </Link>
                      </div>
                    ) : (
                      <p className="font-paragraph text-sm text-secondary">No driver assigned</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
