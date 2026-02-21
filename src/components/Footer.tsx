import { Link } from 'react-router-dom';
import { Truck, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-section-background border-t border-secondary/20">
      <div className="max-w-[100rem] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary p-2 rounded">
                <Truck className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold text-foreground">FleetFlow</span>
            </div>
            <p className="font-paragraph text-sm text-secondary leading-relaxed">
              Enterprise-grade fleet and logistics management platform for modern transportation operations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-base font-bold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="font-paragraph text-sm text-secondary hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="font-paragraph text-sm text-secondary hover:text-primary transition-colors">
                  Vehicles
                </Link>
              </li>
              <li>
                <Link to="/trips" className="font-paragraph text-sm text-secondary hover:text-primary transition-colors">
                  Trips
                </Link>
              </li>
              <li>
                <Link to="/drivers" className="font-paragraph text-sm text-secondary hover:text-primary transition-colors">
                  Drivers
                </Link>
              </li>
            </ul>
          </div>

          {/* Management */}
          <div>
            <h3 className="font-heading text-base font-bold text-foreground mb-4">Management</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/maintenance" className="font-paragraph text-sm text-secondary hover:text-primary transition-colors">
                  Maintenance
                </Link>
              </li>
              <li>
                <Link to="/expenses" className="font-paragraph text-sm text-secondary hover:text-primary transition-colors">
                  Expenses
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="font-paragraph text-sm text-secondary hover:text-primary transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/contact" className="font-paragraph text-sm text-secondary hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-base font-bold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-secondary" />
                <a href="mailto:support@fleetflow.com" className="font-paragraph text-sm text-secondary hover:text-primary transition-colors">
                  support@fleetflow.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-secondary" />
                <a href="tel:+1234567890" className="font-paragraph text-sm text-secondary hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-paragraph text-sm text-secondary">
              © {currentYear} FleetFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/contact" className="font-paragraph text-sm text-secondary hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/contact" className="font-paragraph text-sm text-secondary hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
