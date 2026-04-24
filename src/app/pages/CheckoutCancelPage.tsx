import { Link } from 'react-router';
import { XCircle } from 'lucide-react';
import { PillButton } from '../components/PillButton';

export function CheckoutCancelPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-8 bg-[#F5EEE3]">
        <XCircle className="w-10 h-10 text-[#9E9A8E]" />
      </div>

      <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl lg:text-5xl text-[#4A3428] mb-4">
        Order cancelled
      </h1>

      <p className="text-lg text-[#6B7554] font-['Plus_Jakarta_Sans'] max-w-md mb-10">
        No payment was taken. Head back to the shop whenever you're ready.
      </p>

      <Link to="/shop">
        <PillButton variant="primary">Back to Shop</PillButton>
      </Link>
    </div>
  );
}
