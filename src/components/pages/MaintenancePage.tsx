import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { MaintenanceLogs } from '@/entities';
import { Wrench, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

export default function MaintenancePage() {
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLogs[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<MaintenanceLogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadMaintenanceLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [maintenanceLogs, searchQuery, statusFilter, typeFilter]);

  const loadMaintenanceLogs = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<MaintenanceLogs>('maintenancelogs');
      setMaintenanceLogs(result.items);
    } catch (error) {
      console.error('Error loading maintenance logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...maintenanceLogs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log =>
        log.vehicleLicensePlate?.toLowerCase().includes(query) ||
        log.description?.toLowerCase().includes(query) ||
        log.mechanicName?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.serviceStatus === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(log => log.maintenanceType === typeFilter);
    }

    setFilteredLogs(filtered);
  };

  const getStatusColor = (status?: string) => {
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

  const maintenanceTypes = Array.from(new Set(maintenanceLogs.map(log => log.maintenanceType).filter(Boolean)));

  const totalCost = filteredLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
  const pendingCount = filteredLogs.filter(log => log.serviceStatus === 'Pending' || log.serviceStatus === 'Scheduled').length;
  const completedCount = filteredLogs.filter(log => log.serviceStatus === 'Completed').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
        {/* Header Section */}
        <section className="w-full bg-section-background">
          <div className="max-w-[100rem] mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="font-heading text-4xl text-foreground mb-3">Maintenance & Service Logs</h1>
                <p className="font-paragraph text-base text-secondary">
                  Track vehicle maintenance, service records, and repair history
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-paragraph text-sm text-secondary">
                  {filteredLogs.length} of {maintenanceLogs.length} records
                </span>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                <span className="font-paragraph text-sm text-secondary">Total Maintenance Cost</span>
                <p className="font-heading text-3xl text-foreground mt-2">${totalCost.toLocaleString()}</p>
              </div>
              <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                <span className="font-paragraph text-sm text-secondary">Pending Services</span>
                <p className="font-heading text-3xl text-foreground mt-2">{pendingCount}</p>
              </div>
              <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                <span className="font-paragraph text-sm text-secondary">Completed Services</span>
                <p className="font-heading text-3xl text-foreground mt-2">{completedCount}</p>
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
                  placeholder="Search by vehicle, description, or mechanic..."
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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="font-paragraph text-sm">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {maintenanceTypes.map(type => (
                    <SelectItem key={type} value={type!}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Maintenance Logs Table */}
        <section className="w-full">
          <div className="max-w-[100rem] mx-auto px-6 py-8">
            <div className="min-h-[400px]">
              {isLoading ? null : filteredLogs.length > 0 ? (
                <div className="bg-background rounded shadow-sm border border-section-background overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-section-background">
                        <tr>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Vehicle</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Type</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Service Date</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Description</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Mechanic</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Cost</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Next Service</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLogs.map((log, index) => (
                          <motion.tr
                            key={log._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="border-t border-section-background hover:bg-section-background/50 transition-colors"
                          >
                            <td className="px-6 py-4 font-paragraph text-sm font-medium text-foreground">{log.vehicleLicensePlate}</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">{log.maintenanceType}</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">
                              {log.serviceDate ? format(new Date(log.serviceDate), 'MMM dd, yyyy') : '-'}
                            </td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary max-w-xs truncate">{log.description}</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">{log.mechanicName}</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-foreground">${log.cost?.toLocaleString()}</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">
                              {log.nextServiceDate ? format(new Date(log.nextServiceDate), 'MMM dd, yyyy') : '-'}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getStatusColor(log.serviceStatus)}`}>
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
                  <h3 className="font-heading text-xl text-foreground mb-2">No maintenance logs found</h3>
                  <p className="font-paragraph text-sm text-secondary">
                    {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'No maintenance records available'}
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
