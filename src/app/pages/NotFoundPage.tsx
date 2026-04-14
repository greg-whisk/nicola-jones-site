import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <div className="py-32 flex flex-col items-center justify-center text-center max-w-[1440px] mx-auto px-6">
      <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-6xl lg:text-8xl text-[#4A3428] mb-6">
        Page not found
      </h1>
      <p className="font-['Plus_Jakarta_Sans'] text-xl text-[#6B7554] mb-10">
        Sorry, that page doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-block px-8 py-4 rounded-full bg-[#E8846F] text-white font-['Plus_Jakarta_Sans'] hover:bg-[#D8767D] transition-colors"
      >
        Back to home →
      </Link>
    </div>
  );
}
