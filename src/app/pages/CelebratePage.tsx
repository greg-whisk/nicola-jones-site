import { motion } from 'motion/react';

export function CelebratePage() {
  return (
    <div className="py-20">
      <div className="max-w-[1440px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-5xl lg:text-6xl text-[#4A3428] mb-6">
            Celebrate
          </h1>
          <p className="text-xl text-[#6B7554]">Coming soon.</p>
        </motion.div>
      </div>
    </div>
  );
}
