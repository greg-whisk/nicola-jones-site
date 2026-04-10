import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
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

const shopProducts = [
  {
    slug: 'cheeky-bits-print',
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/292cd1801a4012ceb14be47972788201fbf0de9b-2500x2500.webp',
    title: 'Cheeky Bits Print',
    description: "A bold, playful print bursting with Nicola's signature characterful illustrations. Printed on 300gsm fine art paper, ready to frame and brighten up any room.",
    price: 28,
    category: 'Prints',
    accentColor: '#E8846F',
  },
  {
    slug: 'illustrated-tote-bag',
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/0e2220428fdc8c17d6ca3efb11d455ece1391b39-2500x2500.webp',
    title: 'Illustrated Tote Bag',
    price: 18,
    category: 'Tote Bags',
    accentColor: '#5D9B9B',
  },
  {
    slug: 'posters-flyers-print',
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/d83fff21b5459aff10076597afaa0809729a1a3a-1088x1577.webp',
    title: 'Posters & Flyers Print',
    price: 32,
    category: 'Prints',
    accentColor: '#D8767D',
  },
  {
    slug: 'springtide-print',
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/abf3d9801d54142b3dccaaa6565f6666b9e6b11d-2442x2500.webp',
    title: 'Springtide Print',
    price: 35,
    category: 'Prints',
    accentColor: '#5D9B9B',
  },
  {
    slug: 'mermaids-tote-bag',
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/185033b23580aa12fab8e77751ddf777fc888523-2500x1407.webp',
    title: 'Mermaids Tote Bag',
    price: 22,
    category: 'Tote Bags',
    accentColor: '#E8846F',
  },
];

const clients = [
  'Hastings Borough Council',
  'Firefly Press',
  'Brighton Festival',
  'Bloom Coffee Co.',
  'The Guardian',
  'Penguin Random House',
  'National Trust',
  'Channel 4',
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
  const navigate = useNavigate();
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
        <BlobShape color="#E8846F" className="absolute top-20 right-0 w-[500px] h-[500px] opacity-[0.07] pointer-events-none" variant={1} />
        <BlobShape color="#5D9B9B" className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.07] pointer-events-none" variant={3} />

        <div className="max-w-[1440px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="text-[#E8846F] font-['Plus_Jakarta_Sans'] font-heading-manrope text-lg mb-4 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Illustrator & Decorative Painter
            </motion.p>
            <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-[#4A3428] mb-6">
              Murals. Theatre. Illustration.<br />
              <span className="text-[#E8846F]">All drawn with a grin.</span>
            </h1>
            <p className="text-xl text-[#6B7554] mb-8 leading-relaxed max-w-xl">
              Brighton-born illustrator and decorative painter, now based in Hastings. Theatre backdrops, community murals, brand illustration — and quite a few bums.
            </p>
            <div className="relative z-10 flex flex-wrap gap-4">
              <PillButton variant="primary" onClick={() => navigate('/portfolio')}>
                See the work <ArrowRight className="inline ml-2 w-5 h-5" />
              </PillButton>
              <PillButton variant="accent" onClick={() => navigate('/shop')}>
                Visit the shop
              </PillButton>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Blob backgrounds */}
            <BlobShape color="#E8846F" className="absolute -top-16 -right-16 w-80 h-80 opacity-20 pointer-events-none" variant={1} />
            <BlobShape color="#5D9B9B" className="absolute -bottom-8 -left-8 w-56 h-56 opacity-20 pointer-events-none" variant={2} />

            {/* Main illustration image */}
            <div className="relative z-10 transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-[85%] mx-auto">
              <ImageWithFallback
                src="/nicola-jones-hero.webp"
                alt="Bold illustration work"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>

            {/* Paint splash overlapping */}
            <motion.div
              className="absolute -bottom-6 -left-6 w-20 h-20 z-20 pointer-events-none"
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
          <div className="flex items-center justify-center gap-4 mb-16">
            <motion.h2
              className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl lg:text-5xl text-center text-[#4A3428]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Where would you like to go?
            </motion.h2>
            <img src="/nicola-jones-cherub-loop.png" alt="" aria-hidden="true" className="w-28 md:w-48 h-auto pointer-events-none" />
          </div>

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

                    <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-2xl mb-3 text-[#4A3428]">
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
      <section className="py-20 relative">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl text-[#4A3428]">Featured Work</h2>
              <img src="/nicola-jones-dancer-loop.png" alt="" aria-hidden="true" className="w-28 md:w-48 h-auto pointer-events-none" />
            </div>
            <PillButton variant="outline" onClick={() => navigate('/portfolio')}>View all</PillButton>
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
                    <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-xl text-white">{work.title}</h3>
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
            style={{ fontFamily: "'Bricolage Grotesque', 'Helvetica Neue', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            "{testimonial.quote}"
          </motion.blockquote>
          <cite className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-lg text-[#6B7554] not-italic">
            — {testimonial.author}{testimonial.role ? `, ${testimonial.role}` : ''}
          </cite>

          {/* Character reacting */}
          <motion.div
            className="absolute -right-4 bottom-0 hidden lg:block pointer-events-none"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <img src="/nicola-jones-mouth-loop.png" alt="" aria-hidden="true" className="w-40 md:w-64 h-auto drop-shadow-lg" />
          </motion.div>
        </div>
      </section>}

      <WavyDivider color="#FAF8F5" flip />

      {/* Featured Shop Product */}
      <section className="py-20 relative">
        <BlobShape color="#D8767D" className="absolute top-10 left-0 w-[300px] h-[300px] opacity-[0.06]" variant={2} />
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl text-[#4A3428]">From the Shop</h2>
              <img src="/nicola-jones-flowers-loop.png" alt="" aria-hidden="true" className="w-32 md:w-56 h-auto pointer-events-none" />
            </div>
            <PillButton variant="outline" onClick={() => navigate('/shop')}>Browse all</PillButton>
          </div>
          <p className="text-lg text-[#6B7554] mb-12 max-w-xl">Prints, tote bags, stickers, and illustrated goodies — shipped with love from Hastings.</p>

          <Link to={`/shop/${shopProducts[0].slug}`}>
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl shadow-xl overflow-hidden group cursor-pointer hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-square overflow-hidden">
                <ImageWithFallback
                  src={shopProducts[0].image}
                  alt={shopProducts[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-[#E8846F] text-white px-4 py-2 rounded-full text-sm font-['Plus_Jakarta_Sans']">Bestseller</span>
                </div>
                <BlobShape color={shopProducts[0].accentColor} className="absolute -bottom-8 -right-8 w-32 h-32 opacity-20" variant={3} />
              </div>
              <div className="p-8 lg:p-12">
                <span className="text-xs text-[#6B7554] uppercase tracking-wider">{shopProducts[0].category}</span>
                <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl lg:text-4xl text-[#4A3428] mt-2 mb-4">{shopProducts[0].title}</h3>
                <p className="text-lg text-[#6B7554] leading-relaxed mb-6">{shopProducts[0].description}</p>
                <div className="flex items-center gap-6">
                  <span className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl" style={{ color: shopProducts[0].accentColor }}>£{shopProducts[0].price}</span>
                  <span className="inline-flex items-center gap-2 text-[#4A3428] group-hover:text-[#E8846F] transition-colors font-['Plus_Jakarta_Sans']">
                    View product <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Quick product strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {shopProducts.slice(1, 5).map((product, i) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/shop/${product.slug}`}>
                  <motion.div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group" whileHover={{ y: -6 }}>
                    <div className="aspect-square overflow-hidden">
                      <ImageWithFallback src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-sm text-[#4A3428] truncate">{product.title}</h4>
                      <p className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-lg" style={{ color: product.accentColor }}>£{product.price}</p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WavyDivider color="#F5EFE8" />

      {/* Client Logos */}
      <section className="bg-[#F5EFE8] py-16 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.p
            className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-lg text-[#6B7554] text-center mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Trusted by lovely people at
          </motion.p>
          <div className="relative">
            <motion.div
              className="flex gap-16 items-center"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {[...clients, ...clients].map((client, i) => (
                <span
                  key={`${client}-${i}`}
                  className="flex-shrink-0 font-['Plus_Jakarta_Sans'] font-heading-manrope text-xl text-[#4A3428]/30 whitespace-nowrap hover:text-[#4A3428]/60 transition-colors"
                >
                  {client}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <WavyDivider color="#FAF8F5" flip />

      {/* About Nicola Teaser */}
      <section className="py-20 relative">
        <BlobShape color="#5D9B9B" className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-[0.06]" variant={1} />
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <BlobShape color="#5D9B9B" className="absolute -top-10 -left-10 w-40 h-40 opacity-20 z-0" variant={2} />
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl" style={{ transform: 'rotate(-2deg)' }}>
                <ImageWithFallback
                  src="https://cdn.sanity.io/images/fnwcgtif/production/3019706bf19f8f899bc740a4d32484ee1fea82e6-1582x792.webp"
                  alt="Nicola Jones mural work"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p className="text-[#5D9B9B] font-['Plus_Jakarta_Sans'] font-heading-manrope text-lg mb-3 uppercase tracking-wider">About Nicola</p>
              <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl lg:text-5xl text-[#4A3428] mb-6 leading-[1.15]">
                I draw things on walls and on paper.
              </h2>
              <div className="space-y-4 text-lg text-[#6B7554] leading-relaxed mb-8">
                <p>
                  I'm Nicola Jones — illustrator, mural painter, and chronic doodler based in Hastings on the beautiful south coast.
                </p>
                <p>
                  My work is bold, colourful, and full of character. I believe illustration should make people smile, tell stories, and bring unexpected joy to everyday spaces.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <PillButton variant="accent" onClick={() => navigate('/about')}>Read more about me</PillButton>
                <PillButton variant="outline" onClick={() => navigate('/commissions')}>Work with me</PillButton>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <WavyDivider color="#F5EFE8" />

      {/* Final CTA */}
      <section className="bg-[#F5EFE8] py-24 relative overflow-hidden">
        <BlobShape color="#E8846F" className="absolute -top-20 -left-20 w-[500px] h-[500px] opacity-[0.08]" variant={1} />
        <BlobShape color="#5D9B9B" className="absolute -bottom-16 -right-16 w-[400px] h-[400px] opacity-[0.08]" variant={3} />
        <div className="max-w-[900px] mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img src="/nicola-jones-cherub-b-loop.png" alt="" aria-hidden="true" className="w-40 md:w-64 h-auto mx-auto mb-6 pointer-events-none" />
            <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl lg:text-6xl text-[#4A3428] mb-6 leading-[1.15]">
              Let's make something <span className="text-[#E8846F]">brilliant</span> together.
            </h2>
            <p className="text-xl text-[#6B7554] mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether it's a 40-foot mural, a children's book, a brand identity, or a set of cheeky greeting cards — I'd love to hear your idea.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <PillButton variant="primary" onClick={() => navigate('/commissions')}>Start a commission</PillButton>
              <PillButton variant="accent" onClick={() => navigate('/shop')}>Visit the shop</PillButton>
              <PillButton variant="outline" onClick={() => navigate('/portfolio')}>Browse the portfolio</PillButton>
            </div>
          </motion.div>
        </div>
      </section>

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
