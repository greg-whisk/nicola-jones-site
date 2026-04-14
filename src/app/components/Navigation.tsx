import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Navigation() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: '/commissions', label: 'Commission' },
    { path: '/celebrate', label: 'Celebrate' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#4A3428]/10">
      <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center group" onClick={() => setMobileOpen(false)}>
          <img src="/nicola-jones-logo-horizontal.svg" alt="Nicola Jones" className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-['Plus_Jakarta_Sans'] transition-colors hover:text-[#E8846F] relative ${
                location.pathname === link.path ? 'text-[#E8846F]' : 'text-[#4A3428]'
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#E8846F] rounded-full"
                />
              )}
            </Link>
          ))}

        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-[#4A3428]"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-[#FAF8F5] border-t border-[#4A3428]/10"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2 font-['Plus_Jakarta_Sans'] text-lg ${
                    location.pathname === link.path ? 'text-[#E8846F]' : 'text-[#4A3428]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
