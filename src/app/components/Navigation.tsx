import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Navigation() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/shop', label: 'Shop' },
    { path: '/commissions', label: 'Commissions' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#4A3428]/10">
      <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
          {/* Illustrated character on nav */}
          <div className="relative w-11 h-11">
            <svg viewBox="0 0 44 44" className="w-full h-full">
              <circle cx="22" cy="22" r="20" fill="#E8846F" />
              <circle cx="16" cy="18" r="3" fill="#4A3428" />
              <circle cx="28" cy="18" r="3" fill="#4A3428" />
              <path d="M14 28 Q22 35 30 28" stroke="#4A3428" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="17" cy="17" r="1" fill="#FAF8F5" />
              <circle cx="29" cy="17" r="1" fill="#FAF8F5" />
            </svg>
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-[#5D9B9B] rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span className="font-['Fredoka'] text-xl text-[#4A3428] group-hover:text-[#E8846F] transition-colors">
            Nicola Jones
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-['Nunito'] transition-colors hover:text-[#E8846F] relative ${
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
                  className={`block py-2 font-['Nunito'] text-lg ${
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
