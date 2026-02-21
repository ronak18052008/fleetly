import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Drivers } from '@/entities';
import { User, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image } from '@/components/ui/image';

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Drivers[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Drivers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadDrivers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [drivers, searchQuery, statusFilter]);

  const loadDrivers = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Drivers>('drivers');
      setDrivers(result.items);
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...drivers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.fullName?.toLowerCase().includes(query) ||
        d.email?.toLowerCase().includes(query) ||
        d.licenseNumber?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.dutyStatus === statusFilter);
    }

    setFilteredDrivers(filtered);
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
        {/* Header Section */}
        <section className="w-full bg-section-background">
          <div className="max-w-[100rem] mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h1 className="font-heading text-4xl text-foreground mb-3">Driver Management</h1>
                <p className="font-paragraph text-base text-secondary">
                  Manage driver profiles, licenses, and performance metrics
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-paragraph text-sm text-secondary">
                  {filteredDrivers.length} of {drivers.length} drivers
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
                  placeholder="Search by name, email, or license..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-paragraph text-sm"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="font-paragraph text-sm">
                  <SelectValue placeholder="Filter by duty status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="On Duty">On Duty</SelectItem>
                  <SelectItem value="Off Duty">Off Duty</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Drivers Grid */}
        <section className="w-full">
          <div className="max-w-[100rem] mx-auto px-6 py-8">
            <div className="min-h-[400px]">
              {isLoading ? null : filteredDrivers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDrivers.map((driver, index) => (
                    <motion.div
                      key={driver._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-background p-6 rounded shadow-sm border border-section-background hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        {driver.profilePicture ? (
                          <Image
                            src={driver.profilePicture}
                            alt={driver.fullName || 'Driver'}
                            width={64}
                            className="w-16 h-16 rounded object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded bg-section-background flex items-center justify-center">
                            <User className="w-8 h-8 text-secondary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-heading text-lg text-foreground mb-1">{driver.fullName}</h3>
                          <p className="font-paragraph text-sm text-secondary">{driver.email}</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="font-paragraph text-sm text-secondary">License</span>
                          <span className="font-paragraph text-sm text-foreground">{driver.licenseNumber}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-paragraph text-sm text-secondary">Safety Score</span>
                          <span className="font-heading text-sm font-bold text-foreground">{driver.safetyScore}/100</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-paragraph text-sm text-secondary">Completion Rate</span>
                          <span className="font-heading text-sm font-bold text-foreground">{driver.tripCompletionRate}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getStatusColor(driver.dutyStatus)}`}>
                          {driver.dutyStatus}
                        </span>
                        <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getLicenseStatusColor(driver.licenseStatus)}`}>
                          {driver.licenseStatus}
                        </span>
                      </div>

                      <Link
                        to={`/drivers/${driver._id}`}
                        className="block w-full text-center bg-primary text-primary-foreground py-2 rounded font-paragraph text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        View Profile
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-background rounded shadow-sm border border-section-background p-12 text-center">
                  <User className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h3 className="font-heading text-xl text-foreground mb-2">No drivers found</h3>
                  <p className="font-paragraph text-sm text-secondary">
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'No drivers in the system'}
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
