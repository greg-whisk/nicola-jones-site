import { Link } from 'react-router';
import { CheckCircle } from 'lucide-react';
import { PillButton } from '../components/PillButton';

const TEAL = '#2C7A7B';

export function CheckoutSuccessPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
        style={{ backgroundColor: '#E8F5F5' }}
      >
        <CheckCircle className="w-10 h-10" style={{ color: TEAL }} />
      </div>

      <h1
        className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl lg:text-5xl mb-4"
        style={{ color: '#4A3428' }}
      >
        Thank you for your order!
      </h1>

      <p className="text-lg text-[#6B7554] font-['Plus_Jakarta_Sans'] max-w-md mb-3">
        Your order is confirmed. You'll receive a confirmation email shortly.
      </p>

      <p className="text-sm text-[#9E9A8E] font-['Plus_Jakarta_Sans'] max-w-sm mb-10">
        Print orders are fulfilled by ThePrintSpace and typically arrive within 3–5 working days.
        Handmade items are sent directly from Nicola's studio in Hastings.
      </p>

      <Link to="/shop">
        <PillButton variant="primary">Continue Shopping</PillButton>
      </Link>
    </div>
  );
}
