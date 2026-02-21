import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Expenses } from '@/entities';
import { DollarSign, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expenses[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expenses[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [expenses, searchQuery, typeFilter]);

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Expenses>('expenses');
      setExpenses(result.items);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...expenses];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(exp =>
        exp.vehicleLicensePlate?.toLowerCase().includes(query) ||
        exp.description?.toLowerCase().includes(query)
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(exp => exp.expenseType === typeFilter);
    }

    setFilteredExpenses(filtered);
  };

  const expenseTypes = Array.from(new Set(expenses.map(exp => exp.expenseType).filter(Boolean)));

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const fuelExpenses = filteredExpenses.filter(exp => exp.expenseType === 'Fuel').reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const maintenanceExpenses = filteredExpenses.filter(exp => exp.expenseType === 'Maintenance').reduce((sum, exp) => sum + (exp.amount || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
        {/* Header Section */}
        <section className="w-full bg-section-background">
          <div className="max-w-[100rem] mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="font-heading text-4xl text-foreground mb-3">Expense Tracking</h1>
                <p className="font-paragraph text-base text-secondary">
                  Monitor fuel consumption, maintenance costs, and operational expenses
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-paragraph text-sm text-secondary">
                  {filteredExpenses.length} of {expenses.length} records
                </span>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                <span className="font-paragraph text-sm text-secondary">Total Expenses</span>
                <p className="font-heading text-3xl text-foreground mt-2">${totalExpenses.toLocaleString()}</p>
              </div>
              <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                <span className="font-paragraph text-sm text-secondary">Fuel Expenses</span>
                <p className="font-heading text-3xl text-foreground mt-2">${fuelExpenses.toLocaleString()}</p>
              </div>
              <div className="bg-background p-6 rounded shadow-sm border border-section-background">
                <span className="font-paragraph text-sm text-secondary">Maintenance Expenses</span>
                <p className="font-heading text-3xl text-foreground mt-2">${maintenanceExpenses.toLocaleString()}</p>
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
                  placeholder="Search by vehicle or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-paragraph text-sm"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="font-paragraph text-sm">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {expenseTypes.map(type => (
                    <SelectItem key={type} value={type!}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Expenses Table */}
        <section className="w-full">
          <div className="max-w-[100rem] mx-auto px-6 py-8">
            <div className="min-h-[400px]">
              {isLoading ? null : filteredExpenses.length > 0 ? (
                <div className="bg-background rounded shadow-sm border border-section-background overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-section-background">
                        <tr>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Date</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Vehicle</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Type</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Description</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Amount</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Fuel Quantity</th>
                          <th className="px-6 py-4 text-left font-heading text-sm font-bold text-foreground">Odometer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExpenses.map((expense, index) => (
                          <motion.tr
                            key={expense._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="border-t border-section-background hover:bg-section-background/50 transition-colors"
                          >
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">
                              {expense.date ? format(new Date(expense.date), 'MMM dd, yyyy') : '-'}
                            </td>
                            <td className="px-6 py-4 font-paragraph text-sm font-medium text-foreground">{expense.vehicleLicensePlate}</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">{expense.expenseType}</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary max-w-xs truncate">{expense.description}</td>
                            <td className="px-6 py-4 font-paragraph text-sm font-medium text-foreground">${expense.amount?.toLocaleString()}</td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">
                              {expense.fuelQuantityLiters ? `${expense.fuelQuantityLiters} L` : '-'}
                            </td>
                            <td className="px-6 py-4 font-paragraph text-sm text-secondary">
                              {expense.odometerReading ? `${expense.odometerReading.toLocaleString()} km` : '-'}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-background rounded shadow-sm border border-section-background p-12 text-center">
                  <DollarSign className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h3 className="font-heading text-xl text-foreground mb-2">No expenses found</h3>
                  <p className="font-paragraph text-sm text-secondary">
                    {searchQuery || typeFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'No expense records available'}
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
