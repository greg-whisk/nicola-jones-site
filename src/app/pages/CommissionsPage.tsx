import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Building2, Palette, Theater, Heart, ArrowRight } from 'lucide-react';
import { BlobShape } from '../components/BlobShape';
import { PillButton } from '../components/PillButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { client, urlFor } from '../../lib/sanity';

interface CommissionsPageData {
  heroEyebrow?: string;
  heroHeadline?: string;
  heroSubtext?: string;
  typesSectionHeading?: string;
  commissionTypes?: Array<{
    id: string;
    label?: string;
    description?: string;
    startingFrom?: string;
    timeline?: string;
    pricingFactors?: string;
  }>;
  processHeading?: string;
  processSteps?: Array<{ name: string; text: string }>;
  pricingNoteHeading?: string;
  pricingNoteBody?: string;
  ctaHeadline?: string;
  ctaSubtext?: string;
}

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
  startingFrom: string;
  timeline?: string;
  pricingFactors?: string;
  ctaLabel: string;
  ctaHref: string;
  slugs: string[];
}

const commissionTypes: CommissionType[] = [
  {
    id: 'murals',
    label: 'Murals',
    color: '#5D9B9B',
    icon: Building2,
    description:
      "Walls, buildings, community spaces and festival installations. Painted by hand at whatever scale the brief calls for. I've painted community walls and Greenpeace's field at Glastonbury. The process is the same either way: we agree the design, I show up, I paint it.",
    startingFrom: 'Starting from £450',
    timeline: 'Most murals take two to five days on site.',
    pricingFactors:
      'What affects the price: size, complexity, surface preparation, access and location. I will give you a clear quote before anything starts.',
    ctaLabel: 'Commission a mural',
    ctaHref: '/contact?type=mural',
    slugs: ['trees-for-cities', 'greenpeace-glastonbury'],
  },
  {
    id: 'theatre',
    label: 'Theatre and Scenic Art',
    color: '#6B7554',
    icon: Theater,
    description:
      'Scenic painting and backdrops for theatre, film, television and live events. Credits include Shitfaced Shakespeare, Darling and Edge and Greenpeace at Glastonbury. Large-scale, hand-painted environments built to perform under stage lighting and survive a full run.',
    startingFrom: 'Quoted per project. Day rates from £450.',
    ctaLabel: 'Discuss a project',
    ctaHref: '/contact?type=theatre',
    slugs: ['shitfaced-shakespeare', 'darling-and-edge'],
  },
  {
    id: 'brand',
    label: 'Brand Illustration',
    color: '#D8767D',
    icon: Palette,
    description:
      'Illustration for brands: characters, visual identities, packaging and editorial. Work that gives a brand a specific, recognisable visual voice. Previous clients include Penguin Random House, The Guardian and Springtides.',
    startingFrom: 'Starting from £350',
    timeline: 'Two to four weeks depending on scope.',
    ctaLabel: 'Commission brand illustration',
    ctaHref: '/contact?type=brand',
    slugs: ['pinpoint-graphic-design', 'springtide-branding'],
  },
  {
    id: 'personal',
    label: 'Personal Commissions',
    color: '#E8846F',
    icon: Heart,
    description:
      'Portraits, pet illustrations, wedding drawings, house portraits. Made for your home or given as a gift. Drawn by hand, specific to the person or place.',
    startingFrom: 'Plywood originals from £220 (incl. UK shipping). Paper commissions from £95.',
    timeline: 'Two to three weeks standard.',
    ctaLabel: 'Commission a personal piece',
    ctaHref: '/contact?type=personal',
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

const defaultProcessSteps = [
  {
    name: 'Tell me what you need',
    text: 'A rough idea, a photo of the wall, a brief or just a feeling. I will ask a few questions and we will work out together whether it is something I can help with.',
  },
  {
    name: 'Quote and design',
    text: 'I will send a clear quote. No hidden numbers. Once you are happy we agree the design before anything is made or painted.',
  },
  {
    name: 'Made by hand',
    text: 'I make the work. In your space or mine, depending on the commission.',
  },
  {
    name: 'Delivered or installed',
    text: 'You have something real. Painted, drawn and made specifically for you.',
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Mural and Illustration Commissions',
  provider: { '@id': 'https://nicolajones.art/#nicola-jones' },
  areaServed: 'GB',
  serviceType: ['Mural Painting', 'Scenic Art', 'Brand Illustration', 'Portrait Commission'],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to commission artwork from Nicola Jones',
  step: defaultProcessSteps.map((step, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: step.name,
    text: step.text,
  })),
};

export function CommissionsPage() {
  const [pageData, setPageData] = useState<CommissionsPageData>({});
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
      .fetch<CommissionsPageData | null>(
        `*[_type == "commissionsPage"][0]{
          heroEyebrow, heroHeadline, heroSubtext,
          typesSectionHeading,
          commissionTypes[]{ id, label, description, startingFrom, timeline, pricingFactors },
          processHeading,
          processSteps[]{ name, text },
          pricingNoteHeading, pricingNoteBody,
          ctaHeadline, ctaSubtext
        }`
      )
      .then((data) => { if (data) setPageData(data); })
      .catch(console.error);

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

  const processSteps = pageData.processSteps?.length ? pageData.processSteps : defaultProcessSteps;

  return (
    <div className="py-20 overflow-hidden">
      <Helmet>
        <title>Commission a Mural or Illustration | Nicola Jones | Hastings, East Sussex</title>
        <meta name="description" content="Commission a hand-painted mural, scenic backdrop, brand illustration or personal portrait from Nicola Jones. Based in Hastings, working across the UK. Clear pricing, straightforward process." />
        <link rel="canonical" href="https://nicolajones.art/commissions" />
      </Helmet>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <div className="max-w-[1440px] mx-auto px-6">
        {/* Hero */}
        <div className="relative mb-20 text-center">
          <p className="text-sm font-['Plus_Jakarta_Sans'] text-[#6B7554] tracking-widest uppercase mb-4">
            {pageData.heroEyebrow || 'Murals | Scenic Art | Brand Illustration | Personal Commissions'}
          </p>

          <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-5xl lg:text-7xl text-[#4A3428] mb-6">
            {pageData.heroHeadline || 'Something made by hand, made for you.'}
          </h1>

          <p className="text-xl text-[#6B7554] max-w-3xl mx-auto mb-8">
            {pageData.heroSubtext ||
              'I take on commissions across a wide range: from forty-foot theatre backdrops to A5 portrait drawings. The brief can be fully formed or half an idea. Either works. Here is what I do and roughly what it costs.'}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link to="/contact">
              <PillButton variant="accent">Get in touch about a project</PillButton>
            </Link>
            <Link to="/about">
              <PillButton variant="outline">See the work</PillButton>
            </Link>
          </div>

          <div className="flex justify-center gap-4">
            <img src="/nicola-jones-dancer-loop.png" alt="" aria-hidden="true" className="w-28 md:w-48 h-auto pointer-events-none" />
          </div>
        </div>

        {/* Commission Types */}
        <div className="mb-20">
          <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl text-[#4A3428] mb-16 text-center">
            {pageData.typesSectionHeading || 'What kind of commission are you looking for?'}
          </h2>

          <div className="space-y-24">
            {commissionTypes.map((ct, index) => {
              const override = pageData.commissionTypes?.find((o) => o.id === ct.id);
              const resolvedCt = {
                ...ct,
                label: override?.label || ct.label,
                description: override?.description || ct.description,
                startingFrom: override?.startingFrom || ct.startingFrom,
                timeline: override?.timeline ?? ct.timeline,
                pricingFactors: override?.pricingFactors ?? ct.pricingFactors,
              };
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
                      {resolvedCt.label}
                    </span>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl text-[#4A3428] mb-4">{resolvedCt.label}</h3>
                    <p className="text-lg text-[#6B7554] leading-relaxed mb-6">{resolvedCt.description}</p>

                    {/* Price and timeline notes */}
                    <div className="mb-8 space-y-1.5">
                      {resolvedCt.startingFrom && (
                        <p className="text-sm font-['Plus_Jakarta_Sans'] font-semibold text-[#4A3428]">{resolvedCt.startingFrom}</p>
                      )}
                      {resolvedCt.timeline && (
                        <p className="text-sm text-[#6B7554]">{resolvedCt.timeline}</p>
                      )}
                      {resolvedCt.pricingFactors && (
                        <p className="text-sm text-[#6B7554] italic">{resolvedCt.pricingFactors}</p>
                      )}
                    </div>

                    <Link to={resolvedCt.ctaHref}>
                      <button
                        className="hover:text-[#4A3428] transition-colors flex items-center gap-2 font-['Plus_Jakarta_Sans'] group"
                        style={{ color: ct.color }}
                      >
                        {resolvedCt.ctaLabel}
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
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Process Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl text-[#4A3428] mb-12 text-center">
            {pageData.processHeading || 'The process. Straightforward.'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-['Plus_Jakarta_Sans'] font-bold text-[#E8846F]/20 mb-3 leading-none">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-lg text-[#4A3428] mb-3">{step.name}</h3>
                <p className="text-[#6B7554] leading-relaxed text-sm">{step.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Note Section */}
        <motion.div
          className="mb-20 bg-[#FDF8F3] rounded-2xl px-10 py-12 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl text-[#4A3428] mb-6">
            {pageData.pricingNoteHeading || 'A note on pricing.'}
          </h2>
          <p className="text-lg text-[#6B7554] max-w-3xl mx-auto leading-relaxed">
            {pageData.pricingNoteBody ||
              'I quote every commission individually because every brief is different. But I do not hide numbers. Starting prices for each type of commission are listed above and I will always give you a full quote before any work begins. If something is outside your budget, I will say so. If there is a version of the project that works within it, I will suggest that too.'}
          </p>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-br from-[#E8846F] to-[#D4725C] rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden"
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
              <img src="/nicola-jones-cherub-b-loop.png" alt="" aria-hidden="true" loading="lazy" decoding="async" className="w-40 md:w-64 h-auto" />
            </motion.div>

            <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl lg:text-5xl text-white mb-6">
              {pageData.ctaHeadline || 'Have a wall, a brief or an idea?'}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {pageData.ctaSubtext ||
                'Tell me what you are thinking. Even if it is not fully formed. I will ask the right questions and we will work out what makes sense.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <PillButton variant="primary" className="!bg-white !text-[#E8846F] hover:!bg-[#E8846F] hover:!text-white">
                  Get in touch
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
