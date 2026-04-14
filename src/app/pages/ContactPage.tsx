import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Instagram, Twitter } from 'lucide-react';
import { BlobShape } from '../components/BlobShape';
import { PillButton } from '../components/PillButton';
import { client } from '../../lib/sanity';

interface SocialLink {
  platform: string;
  url: string;
}

interface SiteSettings {
  contactEmail: string;
  socialLinks: SocialLink[];
}

const fallbackSettings: SiteSettings = {
  contactEmail: 'hello@nicolajones.art',
  socialLinks: [],
};

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
};

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });
  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings);

  useEffect(() => {
    client
      .fetch<SiteSettings | null>(
        `*[_type == "siteSettings"][0]{ contactEmail, socialLinks }`
      )
      .then((data) => {
        if (data) {
          setSettings({
            contactEmail: data.contactEmail || fallbackSettings.contactEmail,
            socialLinks: data.socialLinks || [],
          });
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thanks for reaching out! I\'ll get back to you soon. 🎨');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fallback social buttons when no Sanity social links
  const hasSocialLinks = settings.socialLinks && settings.socialLinks.length > 0;

  return (
    <div className="py-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-6xl text-[#4A3428] mb-4">
            Say Hello
          </h1>
          <p className="text-xl text-[#6B7554] max-w-2xl mx-auto">
            Have a project in mind? A question? Or just want to chat about art? Drop me a line!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto relative">
          {/* Left side - Contact info */}
          <div className="relative">
            {/* Headshot */}
            <div className="mb-8 flex justify-center">
              <img
                src="/nicola-jones-headshot.webp"
                alt="Nicola Jones"
                className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover object-top shadow-lg border-4 border-white"
              />
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E8846F] rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-xl text-[#4A3428] mb-2">Email</h3>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="text-[#6B7554] hover:text-[#E8846F] transition-colors text-lg"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#5D9B9B] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-xl text-[#4A3428] mb-2">Location</h3>
                  <p className="text-[#6B7554] text-lg">
                    Hastings, East Sussex
                    <br />
                    <span className="text-sm">(Available for projects worldwide)</span>
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-xl text-[#4A3428] mb-4">Follow Along</h3>
                <div className="flex gap-3">
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
                          className="w-12 h-12 bg-[#D8767D] rounded-full flex items-center justify-center hover:bg-[#E8846F] transition-colors"
                        >
                          {Icon ? (
                            <Icon className="w-6 h-6 text-white" />
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
                      <a
                        href="#"
                        className="w-12 h-12 bg-[#D8767D] rounded-full flex items-center justify-center hover:bg-[#E8846F] transition-colors"
                      >
                        <Instagram className="w-6 h-6 text-white" />
                      </a>
                      <a
                        href="#"
                        className="w-12 h-12 bg-[#D8767D] rounded-full flex items-center justify-center hover:bg-[#E8846F] transition-colors"
                      >
                        <Twitter className="w-6 h-6 text-white" />
                      </a>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Scattered illustration elements */}
            <BlobShape
              color="#5D9B9B"
              className="absolute -bottom-10 -right-10 w-24 h-24 opacity-10"
              variant={2}
            />
          </div>

          {/* Right side - Form */}
          <div className="relative">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-lg relative z-10">
              <div className="mb-6">
                <label htmlFor="name" className="block text-[#4A3428] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#F5EFE8] rounded-2xl border border-[#4A3428]/10 focus:border-[#E8846F] focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-[#4A3428] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#F5EFE8] rounded-2xl border border-[#4A3428]/10 focus:border-[#E8846F] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="projectType" className="block text-[#4A3428] mb-2">
                  Project Type
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#F5EFE8] rounded-2xl border border-[#4A3428]/10 focus:border-[#E8846F] focus:outline-none transition-colors"
                >
                  <option value="">Select a project type</option>
                  <option value="mural">Mural Commission</option>
                  <option value="theatre">Theatre/Scenic Work</option>
                  <option value="brand">Brand Illustration</option>
                  <option value="print">Print Enquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-[#4A3428] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-[#F5EFE8] rounded-2xl border border-[#4A3428]/10 focus:border-[#E8846F] focus:outline-none transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <PillButton type="submit" variant="accent" className="w-full">
                Send Message ✨
              </PillButton>
            </form>

            <BlobShape
              color="#D8767D"
              className="absolute top-1/2 -right-20 w-32 h-32 opacity-10"
              variant={3}
            />
          </div>
        </div>

        {/* Bottom decorative note */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-[#6B7554] italic">
            I typically respond within 24-48 hours. If you don't hear from me, check your spam folder—
            <br />
            sometimes my emails get categorized as "too cheerful."
          </p>
        </motion.div>
      </div>
    </div>
  );
}
