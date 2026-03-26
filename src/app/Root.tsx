import { Outlet, ScrollRestoration } from 'react-router';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

export function Root() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
