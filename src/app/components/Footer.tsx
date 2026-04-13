import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Instagram, Mail, Twitter } from 'lucide-react';
import { client } from '../../lib/sanity';

interface SocialLink {
  platform: string;
  url: string;
}

interface SiteSettings {
  contactEmail: string;
  socialLinks: SocialLink[];
  footerText: string;
}

const fallbackSettings: SiteSettings = {
  contactEmail: 'hello@nicolajones.art',
  socialLinks: [],
  footerText: '',
};

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  email: Mail,
};

export function Footer() {
  const [email, setEmail] = useState('');
  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings);

  useEffect(() => {
    client
      .fetch<SiteSettings | null>(
        `*[_type == "siteSettings"][0]{ contactEmail, socialLinks, footerText }`
      )
      .then((data) => {
        if (data) {
          setSettings({
            contactEmail: data.contactEmail || fallbackSettings.contactEmail,
            socialLinks: data.socialLinks || [],
            footerText: data.footerText || '',
          });
        }
      })
      .catch(() => {});
  }, []);

  const hasSocialLinks = settings.socialLinks && settings.socialLinks.length > 0;

  return (
    <footer className="relative bg-[#2B2726] text-[#FAF8F5] pt-20 pb-12 overflow-hidden">
<div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <img
              src="/nicola-jones-logo.svg"
              alt="Nicola Jones"
              className="mb-4"
              style={{ width: '70px', height: '70px', filter: 'brightness(0) invert(1) sepia(0.15)', opacity: 0.88 }}
            />
            <p className="text-[#D4A99C] text-sm leading-relaxed">
              Bold illustration. Big walls. Tiny tote bags. Everything in between.
            </p>
          </div>

          <div>
            <h4 className="font-['Plus_Jakarta_Sans'] font-heading-manrope mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/portfolio" className="text-[#D4A99C] hover:text-[#E8846F] transition-colors">Portfolio</Link></li>
              <li><Link to="/shop" className="text-[#D4A99C] hover:text-[#E8846F] transition-colors">Shop</Link></li>
              <li><Link to="/commissions" className="text-[#D4A99C] hover:text-[#E8846F] transition-colors">Commissions</Link></li>
              <li><Link to="/about" className="text-[#D4A99C] hover:text-[#E8846F] transition-colors">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-['Plus_Jakarta_Sans'] font-heading-manrope mb-4">Say Hello</h4>
            <div className="space-y-3">
              <p className="text-[#D4A99C] text-sm">Hastings, UK</p>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-[#D4A99C] hover:text-[#E8846F] transition-colors text-sm block"
              >
                {settings.contactEmail}
              </a>
              <div className="flex gap-3 pt-2">
                {hasSocialLinks ? (
                  settings.socialLinks.map((link) => {
                    const platform = link.platform?.toLowerCase() || '';
                    const Icon = socialIconMap[platform];
                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-[#E8846F] rounded-full flex items-center justify-center hover:bg-[#5D9B9B] transition-colors"
                      >
                        {Icon ? (
                          <Icon className="w-4 h-4" />
                        ) : (
                          <span className="text-white text-xs font-bold uppercase">
                            {platform.slice(0, 2)}
                          </span>
                        )}
                      </a>
                    );
                  })
                ) : (
                  <>
                    <a href="#" className="w-8 h-8 bg-[#E8846F] rounded-full flex items-center justify-center hover:bg-[#5D9B9B] transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 bg-[#E8846F] rounded-full flex items-center justify-center hover:bg-[#5D9B9B] transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 bg-[#E8846F] rounded-full flex items-center justify-center hover:bg-[#5D9B9B] transition-colors">
                      <Mail className="w-4 h-4" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-['Plus_Jakarta_Sans'] font-heading-manrope mb-4">Newsletter</h4>
            <p className="text-[#D4A99C] text-sm mb-3">Get studio updates, new prints, and behind-the-scenes peeks.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); setEmail(''); alert('Thanks for subscribing!'); }}
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
          {settings.footerText
            ? settings.footerText
            : '© 2026 Nicola Jones. All rights reserved. Illustrations are bold and so are you for reading this.'}
        </div>
      </div>
      <img
        src="/nicola-jones-wave-up-loop.png"
        className="absolute bottom-[-20px] right-4 md:right-8 w-24 md:w-40 h-auto pointer-events-none"
        alt=""
        aria-hidden="true"
      />
    </footer>
  );
}
