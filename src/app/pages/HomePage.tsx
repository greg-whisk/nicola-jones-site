import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight, Star, ShoppingBag, Palette, Briefcase } from 'lucide-react';
import { BlobShape } from '../components/BlobShape';
import { PillButton } from '../components/PillButton';
import { WavyDivider } from '../components/WavyDivider';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { client, urlFor } from '../../lib/sanity';

const pathways = [
  {
    title: 'Grab a Print',
    description: 'Original prints, tote bags, and one-off pieces. Take a bit of colour home.',
    link: '/shop',
    color: '#E8846F',
    bgColor: '#FDF0ED',
    icon: ShoppingBag,
    rotation: -3,
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/292cd1801a4012ceb14be47972788201fbf0de9b-2500x2500.webp',
  },
  {
    title: 'Commission Nicola',
    description: "Murals, theatrical backdrops, brand illustration — big or small, let's make something brilliant.",
    link: '/commissions',
    color: '#5D9B9B',
    bgColor: '#EDF5F5',
    icon: Palette,
    rotation: 2,
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/3019706bf19f8f899bc740a4d32484ee1fea82e6-1582x792.webp',
  },
  {
    title: 'Browse the Portfolio',
    description: 'Murals, theatre sets, editorial, personal work — twelve years of drawing things really, really big.',
    link: '/portfolio',
    color: '#D8767D',
    bgColor: '#F9EDEE',
    icon: Briefcase,
    rotation: -2,
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/b74056942f180fa86437e88ddf45c7482b751290-938x688.webp',
  }
];

const FEATURED_SLUGS = [
  'shitfaced-shakespeare',
  'trees-for-cities',
  'pinpoint-graphic-design',
  'springtide-branding',
  'the-common-good-live-event',
  'darling-and-edge',
  'mermaids',
  'cheeky-bits',
];

const fallbackFeaturedWork = [
  { id: 'shitfaced-shakespeare', slug: 'shitfaced-shakespeare', image: 'https://cdn.sanity.io/images/fnwcgtif/production/b74056942f180fa86437e88ddf45c7482b751290-938x688.webp', title: 'Shitfaced Shakespeare', category: 'Theatre' },
  { id: 'trees-for-cities', slug: 'trees-for-cities', image: 'https://cdn.sanity.io/images/fnwcgtif/production/3019706bf19f8f899bc740a4d32484ee1fea82e6-1582x792.webp', title: 'Trees for Cities', category: 'Murals' },
  { id: 'pinpoint-graphic-design', slug: 'pinpoint-graphic-design', image: 'https://cdn.sanity.io/images/fnwcgtif/production/3a34e71f48b9c70618f87f21de9a1e75990ac1cd-2388x1668.webp', title: 'Pinpoint Graphic Design', category: 'Illustration' },
  { id: 'springtide-branding', slug: 'springtide-branding', image: 'https://cdn.sanity.io/images/fnwcgtif/production/abf3d9801d54142b3dccaaa6565f6666b9e6b11d-2442x2500.webp', title: 'Springtide Branding', category: 'Branding' },
  { id: 'the-common-good-live-event', slug: 'the-common-good-live-event', image: 'https://cdn.sanity.io/images/fnwcgtif/production/bb60ff474e033dca8bf51908e552186fae8b9ad1-1668x2388.webp', title: 'The Common Good Live Event', category: 'Live Illustration' },
  { id: 'darling-and-edge', slug: 'darling-and-edge', image: 'https://cdn.sanity.io/images/fnwcgtif/production/911d4c1b88396c9ca522d0012c4cf58d10dcb74d-1365x1365.webp', title: 'Darling & Edge', category: 'Illustration' },
  { id: 'mermaids', slug: 'mermaids', image: 'https://cdn.sanity.io/images/fnwcgtif/production/185033b23580aa12fab8e77751ddf777fc888523-2500x1407.webp', title: 'Mermaids', category: 'Illustration' },
  { id: 'cheeky-bits', slug: 'cheeky-bits', image: 'https://cdn.sanity.io/images/fnwcgtif/production/292cd1801a4012ceb14be47972788201fbf0de9b-2500x2500.webp', title: 'Cheeky Bits', category: 'Personal Work' },
];

interface FeaturedWork {
  id: string | number;
  slug?: string;
  image: string;
  title: string;
  category: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const fallbackTestimonial: Testimonial = {
  quote: '',
  author: '',
  role: '',
};

export function HomePage() {
  const [featuredWork, setFeaturedWork] = useState<FeaturedWork[]>(fallbackFeaturedWork);
  const [testimonial, setTestimonial] = useState<Testimonial>(fallbackTestimonial);

  useEffect(() => {
    client
      .fetch<any[]>(
        `*[_type == "portfolioProject" && slug.current in $slugs]{
          _id, title, category, mainImage, "slug": slug.current
        }`,
        { slugs: FEATURED_SLUGS }
      )
      .then((data) => {
        if (data && data.length > 0) {
          // Sort by FEATURED_SLUGS order
          const sorted = FEATURED_SLUGS
            .map((slug) => data.find((d) => d.slug === slug))
            .filter(Boolean);
          setFeaturedWork(
            sorted.map((item: any, idx: number) => ({
              id: item._id,
              slug: item.slug,
              title: item.title,
              category: item.category || '',
              image: item.mainImage
                ? urlFor(item.mainImage).width(600).url()
                : fallbackFeaturedWork[idx % fallbackFeaturedWork.length].image,
            }))
          );
        }
      })
      .catch(console.error);

    client
      .fetch<Testimonial | null>(`*[_type == "testimonial"][0]{ quote, author, role }`)
      .then((data) => {
        if (data && data.quote) setTestimonial(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Floating decorative blobs */}
        <BlobShape color="#E8846F" className="absolute top-20 right-0 w-[500px] h-[500px] opacity-[0.07]" variant={1} />
        <BlobShape color="#5D9B9B" className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.07]" variant={3} />

        <div className="max-w-[1440px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="text-[#E8846F] font-['Fredoka'] text-lg mb-4 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Illustrator & Decorative Painter
            </motion.p>
            <h1 className="font-['Fredoka'] text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-[#4A3428] mb-6">
              Murals. Theatre. Illustration.<br />
              <span className="text-[#E8846F]">All drawn with a grin.</span>
            </h1>
            <p className="text-xl text-[#6B7554] mb-8 leading-relaxed max-w-xl">
              Brighton-born illustrator and decorative painter, now based in Hastings. Theatre backdrops, community murals, brand illustration — and the occasional very large fish.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/portfolio">
                <PillButton variant="primary">
                  See the work <ArrowRight className="inline ml-2 w-5 h-5" />
                </PillButton>
              </Link>
              <Link to="/shop">
                <PillButton variant="accent">
                  Visit the shop
                </PillButton>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Blob backgrounds */}
            <BlobShape color="#E8846F" className="absolute -top-16 -right-16 w-80 h-80 opacity-20" variant={1} />
            <BlobShape color="#5D9B9B" className="absolute -bottom-8 -left-8 w-56 h-56 opacity-20" variant={2} />

            {/* Main illustration image */}
            <div className="relative z-10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <ImageWithFallback
                src="/nicola-jones-hero.webp"
                alt="Bold illustration work"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>

            {/* Breakout character element - overlaps nav area */}
            <motion.div
              className="absolute -top-12 right-12 z-20 hidden lg:block"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg viewBox="0 0 60 60" className="w-16 h-16 drop-shadow-lg">
                <circle cx="30" cy="30" r="28" fill="#D8767D" />
                <circle cx="22" cy="24" r="4" fill="#4A3428" />
                <circle cx="38" cy="24" r="4" fill="#4A3428" />
                <path d="M20 38 Q30 46 40 38" stroke="#4A3428" strokeWidth="3" fill="none" strokeLinecap="round" />
                <circle cx="23" cy="23" r="1.5" fill="#FAF8F5" />
                <circle cx="39" cy="23" r="1.5" fill="#FAF8F5" />
              </svg>
            </motion.div>

            {/* Paint splash overlapping */}
            <motion.div
              className="absolute -bottom-6 -left-6 w-20 h-20 z-20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
              <BlobShape color="#5D9B9B" className="w-full h-full" variant={3} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <WavyDivider color="#F5EFE8" />

      {/* Pathway Cards */}
      <section className="bg-[#F5EFE8] py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.h2
            className="font-['Fredoka'] text-4xl lg:text-5xl text-center mb-16 text-[#4A3428]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Where would you like to go?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {pathways.map((pathway, index) => (
              <motion.div
                key={pathway.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: index === 1 ? -20 : 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Link to={pathway.link}>
                  <motion.div
                    className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group h-full"
                    style={{ transform: `rotate(${pathway.rotation}deg)` }}
                    whileHover={{ rotate: 0, scale: 1.03 }}
                  >
                    {/* Blob decoration */}
                    <BlobShape
                      color={pathway.color}
                      className="absolute -top-10 -right-10 w-40 h-40 opacity-15 group-hover:opacity-25 transition-opacity"
                      variant={(index % 3 + 1) as 1 | 2 | 3}
                    />

                    {/* Image preview */}
                    <div className="relative w-full aspect-[4/3] mb-6 rounded-2xl overflow-hidden">
                      <ImageWithFallback
                        src={pathway.image}
                        alt={pathway.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{ backgroundColor: pathway.color }}
                      />
                    </div>

                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: pathway.color }}
                    >
                      <pathway.icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="font-['Fredoka'] text-2xl mb-3 text-[#4A3428]">
                      {pathway.title}
                    </h3>
                    <p className="text-[#6B7554] mb-6">
                      {pathway.description}
                    </p>

                    <span className="inline-flex items-center text-[#4A3428] group-hover:text-[#E8846F] transition-colors">
                      Explore <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WavyDivider color="#FAF8F5" flip />

      {/* Featured Work Strip */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-['Fredoka'] text-4xl text-[#4A3428]">Featured Work</h2>
            <Link to="/portfolio">
              <PillButton variant="outline">View all</PillButton>
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
            {featuredWork.map((work, index) => (
              <motion.div
                key={work.id}
                className="relative group cursor-pointer flex-shrink-0 w-[280px] snap-start"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Link to={`/portfolio/${work.slug || work.id}`}>
                <div className="relative overflow-hidden rounded-3xl aspect-[3/4]">
                  <ImageWithFallback
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4A3428]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-[#E8846F] text-sm mb-1">{work.category}</span>
                    <h3 className="font-['Fredoka'] text-xl text-white">{work.title}</h3>
                  </div>
                </div>

                {/* Organic blob mask accent */}
                {index % 2 === 0 && (
                  <div className="absolute -top-4 -right-4 z-10">
                    <BlobShape
                      color={index === 0 ? '#E8846F' : '#5D9B9B'}
                      className="w-16 h-16 opacity-40"
                      variant={((index % 3) + 1) as 1 | 2 | 3}
                    />
                  </div>
                )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial — only rendered when real data is available from Sanity */}
      {testimonial.quote && <section className="bg-[#F5EFE8] py-20 relative overflow-hidden">
        <BlobShape color="#D8767D" className="absolute top-10 left-10 w-48 h-48 opacity-10" variant={3} />
        <BlobShape color="#5D9B9B" className="absolute bottom-10 right-10 w-36 h-36 opacity-10" variant={1} />

        <div className="max-w-[900px] mx-auto px-6 text-center relative z-10">
          {/* Illustrated speech bubble / stars */}
          <motion.div
            className="flex justify-center gap-2 mb-6"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-[#E8846F] fill-current" />
            ))}
          </motion.div>

          <motion.blockquote
            className="text-2xl lg:text-3xl text-[#4A3428] mb-6 leading-relaxed"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            "{testimonial.quote}"
          </motion.blockquote>
          <cite className="font-['Fredoka'] text-lg text-[#6B7554] not-italic">
            — {testimonial.author}{testimonial.role ? `, ${testimonial.role}` : ''}
          </cite>

          {/* Character reacting */}
          <motion.div
            className="absolute -right-4 bottom-0 hidden lg:block"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <svg viewBox="0 0 50 50" className="w-14 h-14">
              <circle cx="25" cy="25" r="23" fill="#5D9B9B" />
              <circle cx="18" cy="20" r="3" fill="#FAF8F5" />
              <circle cx="32" cy="20" r="3" fill="#FAF8F5" />
              <ellipse cx="25" cy="32" rx="6" ry="4" fill="#FAF8F5" />
            </svg>
          </motion.div>
        </div>
      </section>}

      {/* Footer note */}
      <section className="py-8 bg-[#FAF8F5]">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <p className="text-sm text-[#6B7554]">
            Nicola Jones — Illustrator &amp; Decorative Painter, Hastings, East Sussex
          </p>
        </div>
      </section>
    </div>
  );
}
