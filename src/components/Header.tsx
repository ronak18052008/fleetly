import { Link, useLocation } from 'react-router-dom';
import { Truck, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/vehicles', label: 'Vehicles' },
    { path: '/trips', label: 'Trips' },
    { path: '/drivers', label: 'Drivers' },
    { path: '/maintenance', label: 'Maintenance' },
    { path: '/expenses', label: 'Expenses' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full bg-background border-b border-section-background sticky top-0 z-50">
      <div className="max-w-[100rem] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded">
              <Truck className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">FleetFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-paragraph text-sm px-4 py-2 rounded transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-secondary hover:text-foreground hover:bg-section-background'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-secondary hover:text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-section-background">
            <div className="flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-paragraph text-sm px-4 py-3 rounded transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-secondary hover:text-foreground hover:bg-section-background'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
