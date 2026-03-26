import { useState } from 'react';
import { Link } from 'react-router';
import { Instagram, Mail, Twitter } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="relative bg-[#2B2726] text-[#FAF8F5] pt-20 pb-12 overflow-hidden">
      {/* Character peeking from bottom right */}
      <motion.div
        className="absolute bottom-0 right-16 z-10"
        animate={{ y: [8, 0, 8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 60 50" className="w-16 h-12">
          <ellipse cx="30" cy="25" rx="28" ry="24" fill="#E8846F" />
          <circle cx="22" cy="18" r="4" fill="#2B2726" />
          <circle cx="38" cy="18" r="4" fill="#2B2726" />
          <circle cx="23" cy="17" r="1.5" fill="#FAF8F5" />
          <circle cx="39" cy="17" r="1.5" fill="#FAF8F5" />
          <path d="M20 30 Q30 38 40 30" stroke="#2B2726" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <line x1="2" y1="22" x2="-8" y2="10" stroke="#E8846F" strokeWidth="5" strokeLinecap="round" />
          <line x1="58" y1="22" x2="68" y2="10" stroke="#E8846F" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </motion.div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-['Fredoka'] text-xl mb-4">Nicola Jones</h3>
            <p className="text-[#D4A99C] text-sm leading-relaxed">
              Bold illustration. Big walls. Tiny tote bags. Everything in between.
            </p>
          </div>

          <div>
            <h4 className="font-['Fredoka'] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/portfolio" className="text-[#D4A99C] hover:text-[#E8846F] transition-colors">Portfolio</Link></li>
              <li><Link to="/shop" className="text-[#D4A99C] hover:text-[#E8846F] transition-colors">Shop</Link></li>
              <li><Link to="/commissions" className="text-[#D4A99C] hover:text-[#E8846F] transition-colors">Commissions</Link></li>
              <li><Link to="/about" className="text-[#D4A99C] hover:text-[#E8846F] transition-colors">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-['Fredoka'] mb-4">Say Hello</h4>
            <div className="space-y-3">
              <p className="text-[#D4A99C] text-sm">Hastings, UK</p>
              <a href="mailto:hello@nicolajones.art" className="text-[#D4A99C] hover:text-[#E8846F] transition-colors text-sm block">
                hello@nicolajones.art
              </a>
              <div className="flex gap-3 pt-2">
                <a href="#" className="w-8 h-8 bg-[#E8846F] rounded-full flex items-center justify-center hover:bg-[#5D9B9B] transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-[#E8846F] rounded-full flex items-center justify-center hover:bg-[#5D9B9B] transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-[#E8846F] rounded-full flex items-center justify-center hover:bg-[#5D9B9B] transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-['Fredoka'] mb-4">Newsletter</h4>
            <p className="text-[#D4A99C] text-sm mb-3">Get studio updates, new prints, and behind-the-scenes peeks.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); setEmail(''); alert('Thanks for subscribing! 🎨'); }}
              className="flex gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded-full bg-[#3D3938] text-[#FAF8F5] text-sm border border-[#4A3428] focus:border-[#E8846F] focus:outline-none placeholder:text-[#6B6260]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#E8846F] text-white rounded-full text-sm hover:bg-[#5D9B9B] transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#4A3428] pt-8 text-center text-sm text-[#D4A99C]">
          © 2026 Nicola Jones. All rights reserved. Illustrations are bold and so are you for reading this.
        </div>
      </div>
    </footer>
  );
}
