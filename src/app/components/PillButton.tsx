import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface PillButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

export function PillButton({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  type = 'button'
}: PillButtonProps) {
  const variants = {
    primary: 'bg-[#4A3428] text-[#FAF8F5] hover:bg-[#6B7554]',
    secondary: 'bg-[#6B7554] text-[#FAF8F5] hover:bg-[#4A3428]',
    accent: 'bg-[#E8846F] text-[#FAF8F5] hover:bg-[#5D9B9B]',
    outline: 'bg-transparent border-2 border-[#4A3428] text-[#4A3428] hover:bg-[#4A3428] hover:text-[#FAF8F5]'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`px-8 py-3 rounded-full font-['Plus_Jakarta_Sans'] whitespace-nowrap transition-all duration-300 ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}
