import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

export function Root() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navigation />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
