// HPI 1.7-G
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Vehicles, Trips, MaintenanceLogs } from '@/entities';
import { Truck, AlertTriangle, Activity, Package, TrendingUp, Calendar, ChevronRight, MapPin, Clock, ShieldCheck, Fuel } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';

// --- Utility Components for Layout & Design ---

const SectionDivider = () => (
  <div className="w-full flex items-center justify-center py-8 opacity-20">
    <div className="h-px w-full max-w-[100rem] bg-foreground/30" />
  </div>
);

const GridOverlay = () => (
  <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" 
       style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
  />
);

// --- Main Component ---

export default function HomePage() {
  // --- 1. Data Fidelity Protocol: Canonize Data Sources ---
  const [vehicles, setVehicles] = useState<Vehicles[]>([]);
  const [trips, setTrips] = useState<Trips[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- 2. Preserve Original Logic ---
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [vehiclesResult, tripsResult, maintenanceResult] = await Promise.all([
        BaseCrudService.getAll<Vehicles>('vehicles'),
        BaseCrudService.getAll<Trips>('trips'),
        BaseCrudService.getAll<MaintenanceLogs>('maintenancelogs')
      ]);
      setVehicles(vehiclesResult.items);
      setTrips(tripsResult.items);
      setMaintenanceLogs(maintenanceResult.items);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Derived Data Calculations ---
  const activeFleet = vehicles.filter(v => v.status === 'On Trip').length;
  const maintenanceAlerts = vehicles.filter(v => v.status === 'In Shop').length;
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const activeTrips = trips.filter(t => t.tripStatus === 'In Progress' || t.tripStatus === 'Dispatched').length;
  const utilizationRate = vehicles.length > 0 ? ((activeFleet / vehicles.length) * 100).toFixed(1) : '0';
  const pendingMaintenance = maintenanceLogs.filter(m => m.serviceStatus === 'Pending' || m.serviceStatus === 'Scheduled').length;

  // --- Animation Hooks ---
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 1000], [0, 400]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // --- Render Helpers ---
  
  const kpiCards = [
    {
      title: 'Active Fleet',
      value: activeFleet,
      subtitle: 'Currently On Trip',
      icon: Truck,
      color: 'text-status-on-trip',
      borderColor: 'border-status-on-trip/20'
    },
    {
      title: 'Maintenance',
      value: maintenanceAlerts,
      subtitle: 'Vehicles In Shop',
      icon: AlertTriangle,
      color: 'text-status-in-shop',
      borderColor: 'border-status-in-shop/20'
    },
    {
      title: 'Utilization',
      value: `${utilizationRate}%`,
      subtitle: `${availableVehicles} Available`,
      icon: Activity,
      color: 'text-status-available',
      borderColor: 'border-status-available/20'
    },
    {
      title: 'Active Trips',
      value: activeTrips,
      subtitle: 'In Progress',
      icon: Package,
      color: 'text-primary',
      borderColor: 'border-primary/20'
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground font-paragraph selection:bg-primary/10 selection:text-primary overflow-x-clip">
      <Header />

      <main className="w-full relative">
        
        {/* --- HERO SECTION: The Command Center --- */}
        <section className="relative w-full h-[90vh] flex items-center overflow-hidden">
          {/* Parallax Background Layer */}
          <motion.div 
            style={{ y: heroParallax }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background z-10" />
            <Image 
              src="https://static.wixstatic.com/media/b17fdf_f454808ad18d450da7858ecc86face0e~mv2.png?originWidth=1408&originHeight=768" 
              alt="Global Logistics Map" 
              className="w-full h-full object-cover opacity-40 grayscale contrast-125"
            />
          </motion.div>

          {/* Content Layer */}
          <div className="relative z-20 w-full max-w-[100rem] mx-auto px-6 md:px-12 grid grid-cols-12 gap-8">
            <motion.div 
              style={{ opacity: heroOpacity }}
              className="col-span-12 lg:col-span-8 flex flex-col justify-center"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-primary" />
                <span className="text-sm font-medium tracking-widest uppercase text-secondary">FleetFlow OS 2.0</span>
              </div>
              
              <h1 className="font-heading text-6xl md:text-8xl font-bold tracking-tight text-foreground mb-8 leading-[0.9]">
                COMMAND <br />
                <span className="text-secondary/40">CENTER</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-secondary max-w-2xl leading-relaxed mb-12 border-l-2 border-primary/20 pl-6">
                Real-time operational intelligence for the modern logistics enterprise. 
                Monitor assets, dispatch trips, and optimize efficiency from a single pane of glass.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/trips">
                  <button className="group relative px-8 py-4 bg-foreground text-background font-medium text-lg overflow-hidden rounded-sm transition-all hover:bg-primary hover:text-white">
                    <span className="relative z-10 flex items-center gap-2">
                      Initiate Dispatch <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                </Link>
                <Link to="/vehicles">
                  <button className="px-8 py-4 bg-transparent border border-foreground/20 text-foreground font-medium text-lg rounded-sm hover:bg-foreground/5 transition-colors">
                    View Fleet Registry
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Hero Stats - Floating Glass Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex col-span-4 flex-col justify-end pb-12"
            >
              <div className="bg-white/50 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between mb-6 border-b border-black/5 pb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-secondary">System Status</span>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-available opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-status-available"></span>
                    </span>
                    <span className="text-xs font-medium text-foreground">Operational</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Total Assets</span>
                    <span className="font-heading text-2xl font-bold">{vehicles.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Active Routes</span>
                    <span className="font-heading text-2xl font-bold">{trips.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Pending Service</span>
                    <span className="font-heading text-2xl font-bold text-status-in-shop">{pendingMaintenance}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- KPI SECTION: The Pulse --- */}
        <section className="relative w-full bg-background z-30 -mt-20 pb-24">
          <div className="max-w-[100rem] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-background p-8 rounded-xl shadow-lg border-t-4 ${card.borderColor} hover:shadow-xl transition-shadow duration-300 group`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-section-background rounded-lg group-hover:bg-foreground/5 transition-colors">
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full bg-section-background ${card.color}`}>
                      LIVE
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-4xl font-heading font-bold text-foreground tracking-tight">
                      {isLoading ? "..." : card.value}
                    </h3>
                    <p className="text-sm font-medium text-foreground uppercase tracking-wide">{card.title}</p>
                    <p className="text-xs text-secondary">{card.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- STICKY SPLIT SECTION: Fleet Intelligence --- */}
        <section className="w-full bg-section-background relative border-y border-border/50">
          <GridOverlay />
          <div className="max-w-[100rem] mx-auto">
            <div className="flex flex-col lg:flex-row">
              
              {/* Sticky Sidebar */}
              <div className="lg:w-1/3 p-8 md:p-16 lg:sticky lg:top-20 lg:h-screen flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border/50 bg-section-background/95 backdrop-blur-sm z-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-6 text-primary">
                    <Activity className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-widest">Fleet Intelligence</span>
                  </div>
                  <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                    Asset Status <br />Distribution
                  </h2>
                  <p className="text-secondary text-lg mb-8 max-w-md">
                    A comprehensive breakdown of your fleet's current operational status. Monitor availability and maintenance needs in real-time.
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-status-available" />
                      <span className="text-sm text-foreground">Available for Dispatch</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-status-on-trip" />
                      <span className="text-sm text-foreground">Currently En Route</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-status-in-shop" />
                      <span className="text-sm text-foreground">Maintenance Required</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Scrollable Content */}
              <div className="lg:w-2/3 p-8 md:p-16 bg-background">
                <div className="space-y-12">
                  
                  {/* Vehicle Status Bars */}
                  <div className="space-y-8">
                    <h3 className="text-xl font-heading font-bold mb-6 border-b border-border pb-4">Vehicle Availability</h3>
                    {[
                      { label: 'Available', count: vehicles.filter(v => v.status === 'Available').length, total: vehicles.length, color: 'bg-status-available' },
                      { label: 'On Trip', count: vehicles.filter(v => v.status === 'On Trip').length, total: vehicles.length, color: 'bg-status-on-trip' },
                      { label: 'In Shop', count: vehicles.filter(v => v.status === 'In Shop').length, total: vehicles.length, color: 'bg-status-in-shop' },
                      { label: 'Suspended', count: vehicles.filter(v => v.status === 'Out of Service').length, total: vehicles.length, color: 'bg-status-suspended' },
                    ].map((stat, idx) => (
                      <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-foreground">{stat.label}</span>
                          <span className="font-bold text-foreground">{stat.count} <span className="text-secondary font-normal text-sm">/ {stat.total}</span></span>
                        </div>
                        <div className="h-4 w-full bg-section-background rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${stat.total > 0 ? (stat.count / stat.total) * 100 : 0}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full ${stat.color}`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Trips Preview */}
                  <div className="pt-12">
                    <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                      <h3 className="text-xl font-heading font-bold">Recent Dispatches</h3>
                      <Link to="/trips" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                        View All <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                    
                    <div className="space-y-4">
                      {isLoading ? (
                        <div className="animate-pulse space-y-4">
                          {[1,2,3].map(i => <div key={i} className="h-20 bg-section-background rounded-lg" />)}
                        </div>
                      ) : trips.slice(0, 3).map((trip, idx) => (
                        <motion.div
                          key={trip._id}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white border border-border rounded-lg hover:border-primary/30 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                            <div className="p-3 bg-primary/5 text-primary rounded-full">
                              <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground">{trip.tripName || 'Untitled Trip'}</h4>
                              <div className="flex items-center gap-2 text-sm text-secondary">
                                <span>{trip.departureLocation}</span>
                                <span className="text-primary">→</span>
                                <span>{trip.destinationLocation}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                trip.tripStatus === 'In Progress' ? 'bg-status-on-trip/10 text-status-on-trip' :
                                trip.tripStatus === 'Completed' ? 'bg-status-available/10 text-status-available' :
                                'bg-secondary/10 text-secondary'
                              }`}>
                                {trip.tripStatus}
                              </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-secondary/30 group-hover:text-primary transition-colors" />
                          </div>
                        </motion.div>
                      ))}
                      {trips.length === 0 && !isLoading && (
                        <div className="text-center py-12 text-secondary bg-section-background rounded-lg border border-dashed border-border">
                          No recent trips found.
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FEATURE HIGHLIGHT: Operational Excellence --- */}
        <section className="w-full py-24 bg-background overflow-hidden">
          <div className="max-w-[100rem] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image 
                  src="https://static.wixstatic.com/media/b17fdf_f70565e156aa4406b1597b91dfa83295~mv2.png?originWidth=1024&originHeight=576" 
                  alt="Fleet Analytics Dashboard" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                  <div className="text-white">
                    <h3 className="text-2xl font-heading font-bold mb-2">Predictive Maintenance</h3>
                    <p className="text-white/80">AI-driven insights to prevent downtime before it happens.</p>
                  </div>
                </div>
              </motion.div>

              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                    Operational <br />Excellence
                  </h2>
                  <p className="text-lg text-secondary leading-relaxed">
                    FleetFlow provides the tools you need to maintain peak operational efficiency. 
                    From automated maintenance scheduling to detailed cost analysis, every feature is designed to maximize ROI.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { icon: ShieldCheck, title: "Safety First", desc: "Automated driver license validation and safety score tracking." },
                    { icon: Fuel, title: "Fuel Efficiency", desc: "Detailed tracking of fuel consumption and cost per kilometer." },
                    { icon: Clock, title: "Real-time Tracking", desc: "Live status updates for every vehicle in your fleet." },
                    { icon: TrendingUp, title: "Cost Analytics", desc: "Comprehensive financial reporting and expense management." }
                  ].map((feature, idx) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (idx * 0.1) }}
                      className="flex flex-col gap-3"
                    >
                      <div className="w-12 h-12 rounded-lg bg-section-background flex items-center justify-center text-primary">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-foreground text-lg">{feature.title}</h4>
                      <p className="text-sm text-secondary leading-relaxed">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- QUICK ACTIONS: The Control Deck --- */}
        <section className="w-full bg-foreground text-background py-24 relative overflow-hidden">
          {/* Abstract Background Decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/4 pointer-events-none" />
          
          <div className="max-w-[100rem] mx-auto px-6 md:px-12 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Quick Actions</h2>
                <p className="text-white/60 text-lg max-w-xl">
                  Rapidly access core management functions. Streamline your daily workflow.
                </p>
              </div>
              <Link to="/analytics">
                <button className="px-6 py-3 border border-white/20 rounded-sm hover:bg-white hover:text-foreground transition-all duration-300 flex items-center gap-2">
                  View Full Analytics <TrendingUp className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Manage Vehicles', desc: 'Add, edit, or decommission fleet assets.', link: '/vehicles', icon: Truck },
                { title: 'Dispatch Trip', desc: 'Assign drivers and vehicles to new routes.', link: '/trips', icon: MapPin },
                { title: 'Log Maintenance', desc: 'Record service history and expenses.', link: '/maintenance', icon: ShieldCheck },
              ].map((action, idx) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link to={action.link} className="block group h-full">
                    <div className="h-full bg-white/5 border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                        <action.icon className="w-24 h-24" />
                      </div>
                      
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="mb-8">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                            <action.icon className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl font-heading font-bold mb-2">{action.title}</h3>
                          <p className="text-white/60">{action.desc}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-primary font-medium group-hover:translate-x-2 transition-transform">
                          Access Module <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}