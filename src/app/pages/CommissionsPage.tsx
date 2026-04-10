import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Building2, Palette, Theater, Heart, ArrowRight } from 'lucide-react';
import { BlobShape } from '../components/BlobShape';
import { PillButton } from '../components/PillButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { client, urlFor } from '../../lib/sanity';

interface CommissionProject {
  slug: string;
  title: string;
  image: string;
  summary: string;
}

interface CommissionType {
  id: string;
  label: string;
  color: string;
  icon: React.ElementType;
  description: string;
  slugs: string[];
}

const commissionTypes: CommissionType[] = [
  {
    id: 'murals',
    label: 'Mural Commissions',
    color: '#5D9B9B',
    icon: Building2,
    description:
      'Transform walls, buildings, and spaces into vibrant works of art. From community murals to festival installations, I work with clients to create large-scale pieces that tell their unique story.',
    slugs: ['trees-for-cities', 'greenpeace-glastonbury'],
  },
  {
    id: 'theatre',
    label: 'Theatre & Events',
    color: '#6B7554',
    icon: Theater,
    description:
      'Set design, backdrops, and scenic art for theatrical productions and live events. I create immersive illustrated environments that transport audiences into another world from the moment they arrive.',
    slugs: ['shitfaced-shakespeare', 'darling-and-edge'],
  },
  {
    id: 'brand',
    label: 'Brand Illustration',
    color: '#D8767D',
    icon: Palette,
    description:
      'Custom illustration systems, characters, and visual identities that give brands real personality and warmth. From packaging to digital assets, I bring your brand to life with bold, distinctive work.',
    slugs: ['pinpoint-graphic-design', 'springtide-branding'],
  },
  {
    id: 'personal',
    label: 'Personal Commissions',
    color: '#E8846F',
    icon: Heart,
    description:
      'One-of-a-kind illustrated pieces for your home, as a gift, or for a special occasion. Portraits, pet illustrations, wedding illustrations — anything that captures the people and moments you love.',
    slugs: ['cheeky-bits', 'just-add-hair'],
  },
];

// Static fallback titles & summaries per slug
const slugDefaults: Record<string, { title: string; summary: string; image: string }> = {
  'trees-for-cities': {
    title: 'Trees For Cities',
    summary: 'Large-scale mural celebrating urban green spaces and community life.',
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/3019706bf19f8f899bc740a4d32484ee1fea82e6-1582x792.webp',
  },
  'greenpeace-glastonbury': {
    title: 'Greenpeace Glastonbury',
    summary: "Bold mural artwork created for Greenpeace's presence at Glastonbury Festival.",
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/c1924c5cafe4c88202daf3d5a78a5903b6e31c39-2500x1875.webp',
  },
  'shitfaced-shakespeare': {
    title: 'Shitfaced Shakespeare',
    summary: 'Theatrical set design and scenic painting for the hit comedy show.',
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/b74056942f180fa86437e88ddf45c7482b751290-938x688.webp',
  },
  'darling-and-edge': {
    title: 'Darling and Edge',
    summary: 'Scenic art and set decoration for the immersive theatre production.',
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/911d4c1b88396c9ca522d0012c4cf58d10dcb74d-1365x1365.webp',
  },
  'pinpoint-graphic-design': {
    title: 'Pinpoint Graphic Design',
    summary: 'Illustration and graphic design work for a leading digital agency.',
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/3a34e71f48b9c70618f87f21de9a1e75990ac1cd-2388x1668.webp',
  },
  'springtide-branding': {
    title: 'Springtide Branding',
    summary: 'Brand identity and illustration work for Springtide.',
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/abf3d9801d54142b3dccaaa6565f6666b9e6b11d-2442x2500.webp',
  },
  'cheeky-bits': {
    title: 'Cheeky Bits',
    summary: 'A playful personal commission series full of humour and warmth.',
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/292cd1801a4012ceb14be47972788201fbf0de9b-2500x2500.webp',
  },
  'just-add-hair': {
    title: 'Just Add Hair',
    summary: 'Witty illustrated portraits and character work for a personal commission.',
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/0e2220428fdc8c17d6ca3efb11d455ece1391b39-2500x2500.webp',
  },
};

const ALL_SLUGS = commissionTypes.flatMap((ct) => ct.slugs);

export function CommissionsPage() {
  const [projectData, setProjectData] = useState<Record<string, CommissionProject>>(
    () =>
      Object.fromEntries(
        ALL_SLUGS.map((slug) => [
          slug,
          { slug, title: slugDefaults[slug].title, image: slugDefaults[slug].image, summary: slugDefaults[slug].summary },
        ])
      )
  );

  useEffect(() => {
    client
      .fetch<any[]>(
        `*[_type == "portfolioProject" && slug.current in $slugs] {
          "slug": slug.current, title, summary, mainImage
        }`,
        { slugs: ALL_SLUGS }
      )
      .then((data) => {
        if (!data?.length) return;
        setProjectData((prev) => {
          const next = { ...prev };
          data.forEach((item) => {
            if (!item.slug) return;
            next[item.slug] = {
              slug: item.slug,
              title: item.title || slugDefaults[item.slug]?.title || item.slug,
              summary: item.summary || slugDefaults[item.slug]?.summary || '',
              image: item.mainImage
                ? urlFor(item.mainImage).width(800).url()
                : (slugDefaults[item.slug]?.image || ''),
            };
          });
          return next;
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="py-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="relative mb-20 text-center">
          <motion.h1
            className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-5xl lg:text-7xl text-[#4A3428] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Let's Make Something Together
          </motion.h1>

          <motion.p
            className="text-xl text-[#6B7554] max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Whether it's a building-sized mural, a book full of characters, or a brand that needs personality — I'd love to bring your vision to life with bold, playful illustration.
          </motion.p>

          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            <img src="/nicola-jones-dancer-loop.png" alt="" aria-hidden="true" className="w-24 h-auto pointer-events-none" />
          </motion.div>
        </div>

        {/* Commission Types */}
        <div className="mb-20">
          <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl text-[#4A3428] mb-4 text-center">Commission Types</h2>
          <p className="text-xl text-[#6B7554] text-center mb-16 max-w-2xl mx-auto">
            Here's a selection of recent commissions across my main areas of work.
          </p>

          <div className="space-y-24">
            {commissionTypes.map((ct, index) => {
              const projects = ct.slugs.map((s) => projectData[s]).filter(Boolean);
              return (
                <motion.div
                  key={ct.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${
                    index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  {/* Text side */}
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                      style={{ backgroundColor: ct.color }}
                    >
                      <ct.icon className="w-7 h-7 text-white" />
                    </div>
                    <span
                      className="inline-block text-white px-4 py-2 rounded-full text-sm mb-4 font-['Plus_Jakarta_Sans']"
                      style={{ backgroundColor: ct.color }}
                    >
                      {ct.label}
                    </span>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl text-[#4A3428] mb-4">{ct.label}</h3>
                    <p className="text-lg text-[#6B7554] leading-relaxed mb-8">{ct.description}</p>
                    <Link to="/contact">
                      <button
                        className="text-[#E8846F] hover:text-[#4A3428] transition-colors flex items-center gap-2 font-['Plus_Jakarta_Sans'] group"
                        style={{ color: ct.color }}
                      >
                        Commission this type of work
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>

                  {/* Project thumbnails */}
                  <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <BlobShape
                      color={ct.color}
                      className="absolute -top-10 -right-10 w-32 h-32 opacity-20 z-0"
                      variant={((index % 3) + 1) as 1 | 2 | 3}
                    />
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                      {projects.map((proj, pi) => (
                        <Link key={proj.slug} to={`/portfolio/${proj.slug}`}>
                          <motion.div
                            className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
                            whileHover={{ y: -4, rotate: pi % 2 === 0 ? 1 : -1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="relative overflow-hidden aspect-square">
                              <ImageWithFallback
                                src={proj.image}
                                alt={proj.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <span className="text-white text-xs font-['Plus_Jakarta_Sans'] flex items-center gap-1">
                                  View project <ArrowRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                            <div className="p-3">
                              <p className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-base text-[#4A3428] leading-tight">{proj.title}</p>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>

                    {/* Walking character between sections */}
                    {index < commissionTypes.length - 1 && (
                      <motion.div
                        className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-20 hidden lg:block pointer-events-none"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <img src="/nicola-jones-mouth-loop.png" alt="" aria-hidden="true" className="w-16 h-auto" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-[#6B7554] to-[#4A3428] rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <BlobShape color="rgba(255,255,255,0.1)" className="absolute top-0 left-0 w-96 h-96" variant={1} />
          <BlobShape color="rgba(255,255,255,0.1)" className="absolute bottom-0 right-0 w-64 h-64" variant={2} />

          <div className="relative z-10">
            <motion.div
              className="flex justify-center mb-8 pointer-events-none"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <img src="/nicola-jones-cherub-b-loop.png" alt="" aria-hidden="true" className="w-32 h-auto" />
            </motion.div>

            <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl lg:text-5xl text-white mb-6">
              Got a project in mind?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let's chat about your ideas, timelines, and how we can make something brilliant together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <PillButton variant="primary" className="!bg-[#E8846F] hover:!bg-white hover:!text-[#4A3428]">
                  Start a conversation
                </PillButton>
              </Link>
              <Link to="/portfolio">
                <PillButton variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-[#4A3428]">
                  View the portfolio
                </PillButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
