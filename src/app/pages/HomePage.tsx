import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/1b114a6461acca32e5837f76b3f3ee08b3dd04a3-1600x1600.webp',
  },
  {
    title: 'Browse the Portfolio',
    description: 'Murals, theatre sets, editorial, personal work — twelve years of drawing things really, really big.',
    link: '/portfolio',
    color: '#D8767D',
    bgColor: '#F9EDEE',
    icon: Briefcase,
    rotation: -2,
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/55d849de5f05a4d41f89f95b28899b52e949939d-1600x1600.webp',
  }
];

interface ShopProduct {
  slug: string;
  image: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  accentColor: string;
}

const fallbackShopProducts: ShopProduct[] = [
  {
    slug: 'alexander-park-print',
    image: 'https://cdn.sanity.io/images/fnwcgtif/production/292cd1801a4012ceb14be47972788201fbf0de9b-2500x2500.webp',
    title: 'Alexander Park Print',
    description: "A bold, vibrant print bursting with Nicola's signature characterful illustrations. Printed on 300gsm fine art paper, ready to frame and brighten up any room.",
    price: 35,
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
  'Firefly Press',
  'Brighton Festival',
  'Bloom Coffee Co.',
  'The Guardian',
  'Penguin Random House',
  'Greenpeace',
  'Shitfaced Shakespeare',
  'Trees for Cities',
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

interface ActionCard {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

interface HomepageData {
  heroTagline?: string;
  heroHeadline?: string;
  heroHeadlineAccent?: string;
  heroSubheading?: string;
  heroImage?: any;
  pathwaySectionHeading?: string;
  pathwayCard1Title?: string;
  pathwayCard1Description?: string;
  pathwayCard2Title?: string;
  pathwayCard2Description?: string;
  pathwayCard3Title?: string;
  pathwayCard3Description?: string;
  clientNames?: string[];
  ctaHeadline?: string;
  ctaSubtext?: string;
  shopSectionIntro?: string;
  featuredWork?: Array<{ _id: string; title: string; category?: string; mainImage?: any; slug: string }>;
  actionCardsHeading?: string;
  actionCard1?: ActionCard;
  actionCard2?: ActionCard;
  actionCard3?: ActionCard;
  promiseHeading?: string;
  promiseBody?: string;
  testimonialsHeading?: string;
  testimonials?: Array<{ quote?: string; author?: string; role?: string }>;
}

const fallbackTestimonial: Testimonial = {
  quote: '',
  author: '',
  role: '',
};

const actionCardDefaults = [
  {
    title: 'Celebrate',
    description: 'Live drawing at weddings, corporate events and parties. Workshops for hens, baby showers and groups. Packages from £35pp.',
    ctaLabel: 'See what\'s on offer →',
    ctaUrl: '/celebrate',
    color: '#E8846F',
    bgColor: '#FDF0ED',
  },
  {
    title: 'Commission',
    description: 'A mural for your wall. An illustration for your brand. A painted piece made specifically for you.',
    ctaLabel: 'Start a commission →',
    ctaUrl: '/commissions',
    color: '#5D9B9B',
    bgColor: '#EDF5F5',
  },
  {
    title: 'Shop',
    description: 'Prints, originals, baubles and painted objects. Made in Hastings and shipped across the UK.',
    ctaLabel: 'Browse the shop →',
    ctaUrl: '/shop',
    color: '#D8767D',
    bgColor: '#F9EDEE',
  },
];

const fallbackTestimonials: Testimonial[] = [
  {
    quote: "Working with Nicola was an absolute joy. Her work brought our brand to life in ways we hadn't imagined.",
    author: 'Elise Edge',
    role: 'Darling and Edge',
  },
  {
    quote: 'Nicola translated our brief into something far better than we could have asked for. Highly recommended.',
    author: 'Hannah Collisson',
    role: '',
  },
  {
    quote: 'From first sketch to final install, everything was professional and creative. We\'ll use her again.',
    author: 'Stacey Norris',
    role: '',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [featuredWork, setFeaturedWork] = useState<FeaturedWork[]>(fallbackFeaturedWork);
  const [testimonial, setTestimonial] = useState<Testimonial>(fallbackTestimonial);
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>(fallbackShopProducts);
  const [homepageData, setHomepageData] = useState<HomepageData>({});

  useEffect(() => {
    client
      .fetch<HomepageData | null>(
        `*[_type == "homepage"][0]{
          heroTagline, heroHeadline, heroHeadlineAccent, heroSubheading, heroImage,
          pathwaySectionHeading,
          pathwayCard1Title, pathwayCard1Description,
          pathwayCard2Title, pathwayCard2Description,
          pathwayCard3Title, pathwayCard3Description,
          clientNames, ctaHeadline, ctaSubtext, shopSectionIntro,
          actionCardsHeading,
          actionCard1{ title, description, ctaLabel, ctaUrl },
          actionCard2{ title, description, ctaLabel, ctaUrl },
          actionCard3{ title, description, ctaLabel, ctaUrl },
          promiseHeading, promiseBody,
          testimonialsHeading,
          testimonials[]{ quote, author, role },
          "featuredWork": featuredWork[]->{
            _id, title, category, mainImage, "slug": slug.current
          }
        }`
      )
      .then((data) => {
        if (data) {
          setHomepageData(data);
          if (data.featuredWork && data.featuredWork.length > 0) {
            setFeaturedWork(
              data.featuredWork.map((item, idx) => ({
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
        }
      })
      .catch(console.error);

    // Fallback: load featured work by slug if not set via homepage doc
    client
      .fetch<any[]>(
        `*[_type == "portfolioProject" && slug.current in $slugs]{
          _id, title, category, mainImage, "slug": slug.current
        }`,
        { slugs: FEATURED_SLUGS }
      )
      .then((data) => {
        if (data && data.length > 0) {
          setFeaturedWork((prev) => {
            // Only apply fallback if homepage doc didn't supply featured work
            if (prev === fallbackFeaturedWork) {
              const sorted = FEATURED_SLUGS
                .map((slug) => data.find((d) => d.slug === slug))
                .filter(Boolean);
              return sorted.map((item: any, idx: number) => ({
                id: item._id,
                slug: item.slug,
                title: item.title,
                category: item.category || '',
                image: item.mainImage
                  ? urlFor(item.mainImage).width(600).url()
                  : fallbackFeaturedWork[idx % fallbackFeaturedWork.length].image,
              }));
            }
            return prev;
          });
        }
      })
      .catch(console.error);

    client
      .fetch<Testimonial | null>(`*[_type == "testimonial"][0]{ quote, author, role }`)
      .then((data) => {
        if (data && data.quote) setTestimonial(data);
      })
      .catch(console.error);

    client
      .fetch<any[]>(
        `*[_type == "shopProduct" && inStock != false] | order(_createdAt desc)[0...20] {
          _id, name, price, category, image, description, "slug": slug.current
        }`
      )
      .then((data) => {
        if (data && data.length > 0) {
          const accentColors = ['#E8846F', '#5D9B9B', '#D8767D', '#5D9B9B', '#E8846F'];
          const mapped: ShopProduct[] = data.map((item, idx) => ({
            slug: item.slug || fallbackShopProducts[idx % fallbackShopProducts.length].slug,
            title: item.name,
            price: item.price ?? 0,
            category: item.category || '',
            description: item.description
              ? (Array.isArray(item.description)
                  ? item.description.filter((b: any) => b._type === 'block').map((b: any) => (b.children || []).map((c: any) => c.text || '').join('')).join(' ')
                  : String(item.description))
              : fallbackShopProducts[idx % fallbackShopProducts.length].description,
            image: item.image
              ? urlFor(item.image).width(600).url()
              : fallbackShopProducts[idx % fallbackShopProducts.length].image,
            accentColor: accentColors[idx % accentColors.length],
          }));
          // Pin Alexander Park Print as featured (index 0) if not already first
          const alexanderIdx = mapped.findIndex((p) => p.slug === 'alexander-park-print');
          if (alexanderIdx > 0) {
            const [alexander] = mapped.splice(alexanderIdx, 1);
            mapped.unshift(alexander);
          } else if (alexanderIdx === -1) {
            // Alexander Park not in Sanity yet — keep fallback featured at index 0
            mapped.unshift({ ...fallbackShopProducts[0] });
            mapped.splice(6); // keep to 5 items
          }
          setShopProducts(mapped.slice(0, 5));
        }
      })
      .catch(console.error);
  }, []);

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://nicolajones.art/#nicola-jones',
    name: 'Nicola Jones',
    jobTitle: 'Muralist, Illustrator and Live Event Artist',
    url: 'https://nicolajones.art',
    email: 'hello@nicolajones.art',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hastings',
      addressRegion: 'East Sussex',
      addressCountry: 'GB',
    },
    areaServed: 'GB',
    sameAs: [
      'https://www.instagram.com/nicolajonesart',
      'https://www.linkedin.com/in/nicolajonesart',
    ],
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nicola Jones',
    url: 'https://nicolajones.art',
    founder: { '@id': 'https://nicolajones.art/#nicola-jones' },
  };

  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>Nicola Jones — Muralist, Illustrator and Live Event Artist</title>
        <meta name="description" content="Hand-painted murals, theatre backdrops, brand illustration and live event drawing. Based in Hastings, East Sussex. Working across the UK." />
        <link rel="canonical" href="https://nicolajones.art/" />
      </Helmet>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Floating decorative blobs */}
        <BlobShape color="#E8846F" className="absolute top-20 right-0 w-[500px] h-[500px] opacity-[0.07] pointer-events-none" variant={1} />
        <BlobShape color="#5D9B9B" className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.07] pointer-events-none" variant={3} />

        <div className="max-w-[1440px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-0">
          <div>
            <p className="text-[#E8846F] font-['Plus_Jakarta_Sans'] font-heading-manrope text-lg mb-4 uppercase tracking-wider">
              {homepageData.heroTagline || 'Muralist. Illustrator. Live Event Artist. Hastings, East Sussex.'}
            </p>
            <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-[#4A3428] mb-6">
              {homepageData.heroHeadline || 'Art that makes places feel like'}<br />
              <span className="text-[#E8846F]">{homepageData.heroHeadlineAccent || 'somewhere worth being.'}</span>
            </h1>
            <p className="text-xl text-[#6B7554] mb-8 leading-relaxed max-w-xl">
              {homepageData.heroSubheading || 'Murals painted by hand. Illustrations made to order. Live drawing at your event. Workshops that actually work. Based in Hastings and working across the UK.'}
            </p>
            <div className="relative z-10 flex flex-wrap gap-4">
              <PillButton variant="primary" onClick={() => navigate('/celebrate')}>
                Explore the experiences <ArrowRight className="inline ml-2 w-5 h-5" />
              </PillButton>
              <PillButton variant="accent" onClick={() => navigate('/shop')}>
                Visit the shop
              </PillButton>
            </div>
          </div>

          <div className="relative">
            {/* Blob backgrounds */}
            <BlobShape color="#E8846F" className="absolute -top-16 -right-16 w-80 h-80 opacity-20 pointer-events-none" variant={1} />
            <BlobShape color="#5D9B9B" className="absolute -bottom-8 -left-8 w-56 h-56 opacity-20 pointer-events-none" variant={2} />

            {/* Main illustration image */}
            <div className="relative z-10 transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-[85%] mx-auto">
              <ImageWithFallback
                src={homepageData.heroImage ? urlFor(homepageData.heroImage).width(900).url() : '/nicola-jones-hero.webp'}
                alt="Bold illustration work"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>

          </div>
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
              {homepageData.pathwaySectionHeading || 'Where would you like to go?'}
            </motion.h2>
            <img src="/nicola-jones-cherub-loop.png" alt="" aria-hidden="true" loading="lazy" decoding="async" className="w-28 md:w-48 h-auto pointer-events-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {pathways.map((pathway, index) => {
              const cardTitles = [homepageData.pathwayCard1Title, homepageData.pathwayCard2Title, homepageData.pathwayCard3Title];
              const cardDescs = [homepageData.pathwayCard1Description, homepageData.pathwayCard2Description, homepageData.pathwayCard3Description];
              const resolved = { ...pathway, title: cardTitles[index] || pathway.title, description: cardDescs[index] || pathway.description };
              return (
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
                      {resolved.title}
                    </h3>
                    <p className="text-[#6B7554] mb-6">
                      {resolved.description}
                    </p>

                    <span className="inline-flex items-center text-[#4A3428] group-hover:text-[#E8846F] transition-colors">
                      Explore <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <WavyDivider color="#FAF8F5" flip />

      {/* Action Cards Section */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.p
            className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-center text-lg text-[#E8846F] uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {homepageData.actionCardsHeading ?? 'What are you here for?'}
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {actionCardDefaults.map((card, index) => {
              const sanityCards = [homepageData.actionCard1, homepageData.actionCard2, homepageData.actionCard3];
              const s = sanityCards[index];
              const title = s?.title ?? card.title;
              const description = s?.description ?? card.description;
              const ctaLabel = s?.ctaLabel ?? card.ctaLabel;
              const ctaUrl = s?.ctaUrl ?? card.ctaUrl;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={ctaUrl} className="block h-full">
                    <div
                      className="h-full rounded-3xl p-8 flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300"
                      style={{ backgroundColor: card.bgColor }}
                    >
                      <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-2xl text-[#4A3428]">
                        {title}
                      </h3>
                      <p className="text-[#6B7554] flex-1 leading-relaxed">{description}</p>
                      <span
                        className="inline-flex items-center font-['Plus_Jakarta_Sans'] font-heading-manrope font-medium"
                        style={{ color: card.color }}
                      >
                        {ctaLabel}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Promise Section */}
      <section className="py-20" style={{ backgroundColor: '#5D9B9B' }}>
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <motion.h2
            className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl lg:text-4xl text-white mb-6 leading-[1.2]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {homepageData.promiseHeading ?? 'Hiring an artist should not involve three emails and a waiting game.'}
          </motion.h2>
          <motion.p
            className="text-xl leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.85)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            {homepageData.promiseBody ?? "Every service on this site has a clear price and a straightforward process. Choose what you need, book your date and I do the rest. What you see is what you pay: whether that is five hand-painted baubles for £75 or a full day of live drawing at your event."}
          </motion.p>
        </div>
      </section>

      {/* Featured Work Strip */}
      <section className="py-20 relative">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl text-[#4A3428]">Featured Work</h2>
              <img src="/nicola-jones-dancer-loop.png" alt="" aria-hidden="true" loading="lazy" decoding="async" className="w-28 md:w-48 h-auto pointer-events-none" />
            </div>
            <PillButton variant="outline" onClick={() => navigate('/portfolio')}>View all</PillButton>
          </div>
          <p className="text-lg text-[#6B7554] mb-12 max-w-xl">Murals, theatre sets, editorial illustration and live events. A selection across disciplines.</p>

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

      {/* Testimonials — 3-card grid */}
      <section className="bg-[#F5EFE8] py-20 relative overflow-hidden">
        <BlobShape color="#D8767D" className="absolute top-10 left-10 w-48 h-48 opacity-10" variant={3} />
        <BlobShape color="#5D9B9B" className="absolute bottom-10 right-10 w-36 h-36 opacity-10" variant={1} />

        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
          <motion.h2
            className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl text-center text-[#4A3428] mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {homepageData.testimonialsHeading ?? 'What clients say'}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(homepageData.testimonials && homepageData.testimonials.length > 0
              ? homepageData.testimonials.slice(0, 3)
              : fallbackTestimonials
            ).map((t, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col gap-4"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#E8846F] fill-current" />
                  ))}
                </div>
                <blockquote
                  className="text-[#4A3428] text-lg leading-relaxed flex-1"
                  style={{ fontFamily: "'Bricolage Grotesque', 'Helvetica Neue', sans-serif" }}
                >
                  "{t.quote}"
                </blockquote>
                <div>
                  <cite className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-[#4A3428] not-italic font-semibold block">
                    {t.author}
                  </cite>
                  {t.role && (
                    <p className="text-[#6B7554] text-sm">{t.role}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WavyDivider color="#FAF8F5" flip />

      {/* Featured Shop Product */}
      <section className="py-20 relative">
        <BlobShape color="#D8767D" className="absolute top-10 left-0 w-[300px] h-[300px] opacity-[0.06]" variant={2} />
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl text-[#4A3428]">From the Shop</h2>
            </div>
            <PillButton variant="outline" onClick={() => navigate('/shop')}>Browse all</PillButton>
          </div>
          <p className="text-lg text-[#6B7554] mb-12 max-w-xl">{homepageData.shopSectionIntro || 'Original prints, hand-painted objects and illustrated goods. Shipped from Hastings. No two things quite the same.'}</p>

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
            Work made for
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
                  src="https://cdn.sanity.io/images/fnwcgtif/production/e8beab52bcf307c9274b6de75570fb527e56d8b7-1283x1586.webp"
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
                I'm a muralist, illustrator and live event artist based in Hastings.
              </h2>
              <div className="space-y-4 text-lg text-[#6B7554] leading-relaxed mb-8">
                <p>
                  I've been making things professionally for over a decade: for theatre companies, brands, community spaces and private clients. The work ranges from forty-foot scenic backdrops to A5 ink drawings at someone's wedding. What stays the same is that everything is made by hand, made for a reason and made to last.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <PillButton variant="accent" onClick={() => navigate('/about')}>About and portfolio</PillButton>
                <PillButton variant="outline" onClick={() => navigate('/contact')}>Get in touch</PillButton>
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
            <img src="/nicola-jones-cherub-b-loop.png" alt="" aria-hidden="true" loading="lazy" decoding="async" className="w-40 md:w-64 h-auto mx-auto mb-6 pointer-events-none" />
            <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl lg:text-6xl text-[#4A3428] mb-6 leading-[1.15]">
              Have a space, an event or an idea that needs an artist?
            </h2>
            <p className="text-xl text-[#6B7554] mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether it's a wall that needs painting, an event that needs capturing or something you haven't quite figured out yet: start here.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <PillButton variant="primary" onClick={() => navigate('/celebrate')}>Book or commission</PillButton>
              <PillButton variant="accent" onClick={() => navigate('/shop')}>Visit the shop</PillButton>
              <PillButton variant="outline" onClick={() => navigate('/about')}>See the work</PillButton>
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
