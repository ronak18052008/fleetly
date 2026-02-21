import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Vehicles, Trips, Expenses, MaintenanceLogs } from '@/entities';
import { TrendingUp, DollarSign, Gauge, Package, Truck, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AnalyticsPage() {
  const [vehicles, setVehicles] = useState<Vehicles[]>([]);
  const [trips, setTrips] = useState<Trips[]>([]);
  const [expenses, setExpenses] = useState<Expenses[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [vehiclesResult, tripsResult, expensesResult, maintenanceResult] = await Promise.all([
        BaseCrudService.getAll<Vehicles>('vehicles'),
        BaseCrudService.getAll<Trips>('trips'),
        BaseCrudService.getAll<Expenses>('expenses'),
        BaseCrudService.getAll<MaintenanceLogs>('maintenancelogs')
      ]);
      setVehicles(vehiclesResult.items);
      setTrips(tripsResult.items);
      setExpenses(expensesResult.items);
      setMaintenanceLogs(maintenanceResult.items);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const fuelExpenses = expenses.filter(exp => exp.expenseType === 'Fuel').reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const maintenanceExpenses = maintenanceLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
  
  const totalFuelLiters = expenses.filter(exp => exp.fuelQuantityLiters).reduce((sum, exp) => sum + (exp.fuelQuantityLiters || 0), 0);
  const totalDistance = vehicles.reduce((sum, v) => sum + (v.odometerReading || 0), 0);
  const fuelEfficiency = totalFuelLiters > 0 ? (totalDistance / totalFuelLiters).toFixed(2) : '0';
  
  const costPerKm = totalDistance > 0 ? (totalExpenses / totalDistance).toFixed(2) : '0';
  
  const completedTrips = trips.filter(t => t.tripStatus === 'Completed').length;
  const activeTrips = trips.filter(t => t.tripStatus === 'In Progress' || t.tripStatus === 'Dispatched').length;
  
  const utilizationRate = vehicles.length > 0 ? ((vehicles.filter(v => v.status === 'On Trip').length / vehicles.length) * 100).toFixed(1) : '0';

  const avgCargoWeight = trips.length > 0 ? (trips.reduce((sum, t) => sum + (t.cargoWeightKg || 0), 0) / trips.length).toFixed(0) : '0';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
        {/* Header Section */}
        <section className="w-full bg-section-background">
          <div className="max-w-[100rem] mx-auto px-6 py-12">
            <h1 className="font-heading text-4xl text-foreground mb-3">Operational Analytics & Reports</h1>
            <p className="font-paragraph text-base text-secondary">
              Comprehensive insights into fleet performance, costs, and operational efficiency
            </p>
          </div>
        </section>

        {/* Financial Metrics */}
        <section className="w-full">
          <div className="max-w-[100rem] mx-auto px-6 py-12">
            <h2 className="font-heading text-2xl text-foreground mb-6">Financial Metrics</h2>
            <div className="min-h-[200px]">
              {isLoading ? null : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-background p-8 rounded shadow-sm border border-section-background"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-3 rounded">
                        <DollarSign className="w-6 h-6 text-primary" />
                      </div>
                      <span className="font-paragraph text-sm text-secondary">Total Expenses</span>
                    </div>
                    <p className="font-heading text-3xl text-foreground mb-2">${totalExpenses.toLocaleString()}</p>
                    <p className="font-paragraph text-xs text-secondary">All operational costs</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-background p-8 rounded shadow-sm border border-section-background"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-status-on-trip/10 p-3 rounded">
                        <DollarSign className="w-6 h-6 text-status-on-trip" />
                      </div>
                      <span className="font-paragraph text-sm text-secondary">Fuel Expenses</span>
                    </div>
                    <p className="font-heading text-3xl text-foreground mb-2">${fuelExpenses.toLocaleString()}</p>
                    <p className="font-paragraph text-xs text-secondary">Total fuel costs</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-background p-8 rounded shadow-sm border border-section-background"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-status-in-shop/10 p-3 rounded">
                        <Wrench className="w-6 h-6 text-status-in-shop" />
                      </div>
                      <span className="font-paragraph text-sm text-secondary">Maintenance Costs</span>
                    </div>
                    <p className="font-heading text-3xl text-foreground mb-2">${maintenanceExpenses.toLocaleString()}</p>
                    <p className="font-paragraph text-xs text-secondary">Total service costs</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="bg-background p-8 rounded shadow-sm border border-section-background"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-status-available/10 p-3 rounded">
                        <TrendingUp className="w-6 h-6 text-status-available" />
                      </div>
                      <span className="font-paragraph text-sm text-secondary">Cost per KM</span>
                    </div>
                    <p className="font-heading text-3xl text-foreground mb-2">${costPerKm}</p>
                    <p className="font-paragraph text-xs text-secondary">Average operational cost</p>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Operational Metrics */}
        <section className="w-full bg-section-background">
          <div className="max-w-[100rem] mx-auto px-6 py-12">
            <h2 className="font-heading text-2xl text-foreground mb-6">Operational Metrics</h2>
            <div className="min-h-[200px]">
              {isLoading ? null : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="bg-background p-8 rounded shadow-sm border border-section-background"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-3 rounded">
                        <Gauge className="w-6 h-6 text-primary" />
                      </div>
                      <span className="font-paragraph text-sm text-secondary">Fuel Efficiency</span>
                    </div>
                    <p className="font-heading text-3xl text-foreground mb-2">{fuelEfficiency}</p>
                    <p className="font-paragraph text-xs text-secondary">km per liter</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="bg-background p-8 rounded shadow-sm border border-section-background"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-status-available/10 p-3 rounded">
                        <Truck className="w-6 h-6 text-status-available" />
                      </div>
                      <span className="font-paragraph text-sm text-secondary">Fleet Utilization</span>
                    </div>
                    <p className="font-heading text-3xl text-foreground mb-2">{utilizationRate}%</p>
                    <p className="font-paragraph text-xs text-secondary">vehicles in use</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="bg-background p-8 rounded shadow-sm border border-section-background"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-status-on-trip/10 p-3 rounded">
                        <Package className="w-6 h-6 text-status-on-trip" />
                      </div>
                      <span className="font-paragraph text-sm text-secondary">Completed Trips</span>
                    </div>
                    <p className="font-heading text-3xl text-foreground mb-2">{completedTrips}</p>
                    <p className="font-paragraph text-xs text-secondary">successful deliveries</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                    className="bg-background p-8 rounded shadow-sm border border-section-background"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-status-in-shop/10 p-3 rounded">
                        <Package className="w-6 h-6 text-status-in-shop" />
                      </div>
                      <span className="font-paragraph text-sm text-secondary">Avg Cargo Weight</span>
                    </div>
                    <p className="font-heading text-3xl text-foreground mb-2">{avgCargoWeight}</p>
                    <p className="font-paragraph text-xs text-secondary">kg per trip</p>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Fleet Overview */}
        <section className="w-full">
          <div className="max-w-[100rem] mx-auto px-6 py-12">
            <h2 className="font-heading text-2xl text-foreground mb-6">Fleet Overview</h2>
            <div className="min-h-[200px]">
              {isLoading ? null : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="bg-background p-8 rounded shadow-sm border border-section-background"
                  >
                    <h3 className="font-heading text-xl text-foreground mb-6">Vehicle Status Breakdown</h3>
                    <div className="space-y-4">
                      {[
                        { status: 'Available', count: vehicles.filter(v => v.status === 'Available').length, color: 'bg-status-available' },
                        { status: 'On Trip', count: vehicles.filter(v => v.status === 'On Trip').length, color: 'bg-status-on-trip' },
                        { status: 'In Shop', count: vehicles.filter(v => v.status === 'In Shop').length, color: 'bg-status-in-shop' },
                        { status: 'Out of Service', count: vehicles.filter(v => v.status === 'Out of Service').length, color: 'bg-status-suspended' }
                      ].map(item => (
                        <div key={item.status} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                            <span className="font-paragraph text-base text-foreground">{item.status}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-heading text-lg font-bold text-foreground">{item.count}</span>
                            <span className="font-paragraph text-sm text-secondary">
                              {vehicles.length > 0 ? ((item.count / vehicles.length) * 100).toFixed(0) : 0}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="bg-background p-8 rounded shadow-sm border border-section-background"
                  >
                    <h3 className="font-heading text-xl text-foreground mb-6">Trip Status Distribution</h3>
                    <div className="space-y-4">
                      {[
                        { status: 'Scheduled', count: trips.filter(t => t.tripStatus === 'Scheduled').length },
                        { status: 'Dispatched', count: trips.filter(t => t.tripStatus === 'Dispatched').length },
                        { status: 'In Progress', count: trips.filter(t => t.tripStatus === 'In Progress').length },
                        { status: 'Completed', count: trips.filter(t => t.tripStatus === 'Completed').length },
                        { status: 'Cancelled', count: trips.filter(t => t.tripStatus === 'Cancelled').length }
                      ].map(item => (
                        <div key={item.status} className="flex items-center justify-between">
                          <span className="font-paragraph text-base text-foreground">{item.status}</span>
                          <div className="flex items-center gap-4">
                            <span className="font-heading text-lg font-bold text-foreground">{item.count}</span>
                            <span className="font-paragraph text-sm text-secondary">
                              {trips.length > 0 ? ((item.count / trips.length) * 100).toFixed(0) : 0}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Summary Stats */}
        <section className="w-full bg-section-background">
          <div className="max-w-[100rem] mx-auto px-6 py-12">
            <h2 className="font-heading text-2xl text-foreground mb-6">Summary Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                <span className="font-paragraph text-sm text-secondary">Total Vehicles</span>
                <p className="font-heading text-3xl text-foreground mt-2">{vehicles.length}</p>
              </div>
              <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                <span className="font-paragraph text-sm text-secondary">Total Trips</span>
                <p className="font-heading text-3xl text-foreground mt-2">{trips.length}</p>
              </div>
              <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                <span className="font-paragraph text-sm text-secondary">Active Trips</span>
                <p className="font-heading text-3xl text-foreground mt-2">{activeTrips}</p>
              </div>
              <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                <span className="font-paragraph text-sm text-secondary">Total Distance</span>
                <p className="font-heading text-3xl text-foreground mt-2">{totalDistance.toLocaleString()} km</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
