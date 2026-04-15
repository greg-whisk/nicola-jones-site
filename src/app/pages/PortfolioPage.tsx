import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { BlobShape } from '../components/BlobShape';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { client, urlFor } from '../../lib/sanity';

const categories = ['All', 'Illustration', 'Murals', 'Books', 'Theatre & Events'];

const categoryMap: Record<string, string> = {
  illustration: 'Illustration',
  murals: 'Murals',
  books: 'Books',
  'theatre-events': 'Theatre & Events',
};

interface PortfolioItem {
  id: string | number;
  category: string;
  image: string;
  title: string;
  slug?: string;
}

interface FeaturedProject {
  title: string;
  description: string;
  image: string;
  slug: string;
}

const fallbackItems: PortfolioItem[] = [
  { id: 1, category: 'Murals', image: 'https://cdn.sanity.io/images/fnwcgtif/production/3019706bf19f8f899bc740a4d32484ee1fea82e6-1582x792.webp', title: 'Trees For Cities', slug: 'trees-for-cities' },
  { id: 2, category: 'Theatre & Events', image: 'https://cdn.sanity.io/images/fnwcgtif/production/b74056942f180fa86437e88ddf45c7482b751290-938x688.webp', title: 'Shitfaced Shakespeare', slug: 'shitfaced-shakespeare' },
  { id: 3, category: 'Murals', image: 'https://cdn.sanity.io/images/fnwcgtif/production/c1924c5cafe4c88202daf3d5a78a5903b6e31c39-2500x1875.webp', title: 'Greenpeace Glastonbury', slug: 'greenpeace-glastonbury' },
  { id: 4, category: 'Illustration', image: 'https://cdn.sanity.io/images/fnwcgtif/production/3a34e71f48b9c70618f87f21de9a1e75990ac1cd-2388x1668.webp', title: 'Pinpoint Graphic Design', slug: 'pinpoint-graphic-design' },
  { id: 5, category: 'Illustration', image: 'https://cdn.sanity.io/images/fnwcgtif/production/911d4c1b88396c9ca522d0012c4cf58d10dcb74d-1365x1365.webp', title: 'Darling & Edge', slug: 'darling-and-edge' },
  { id: 6, category: 'Illustration', image: 'https://cdn.sanity.io/images/fnwcgtif/production/abf3d9801d54142b3dccaaa6565f6666b9e6b11d-2442x2500.webp', title: 'Springtide Branding', slug: 'springtide-branding' },
  { id: 7, category: 'Illustration', image: 'https://cdn.sanity.io/images/fnwcgtif/production/185033b23580aa12fab8e77751ddf777fc888523-2500x1407.webp', title: 'Mermaids', slug: 'mermaids' },
  { id: 8, category: 'Illustration', image: 'https://cdn.sanity.io/images/fnwcgtif/production/292cd1801a4012ceb14be47972788201fbf0de9b-2500x2500.webp', title: 'Cheeky Bits', slug: 'cheeky-bits' },
];

const fallbackFeatured: FeaturedProject = {
  title: 'Shitfaced Shakespeare',
  description: 'Theatrical set design and scenic painting for the hit comedy show Shitfaced Shakespeare.',
  image: 'https://cdn.sanity.io/images/fnwcgtif/production/b74056942f180fa86437e88ddf45c7482b751290-938x688.webp',
  slug: 'shitfaced-shakespeare',
};

function blocksToText(blocks: any[]): string {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .filter((b: any) => b._type === 'block')
    .map((b: any) => (b.children || []).map((c: any) => c.text || '').join(''))
    .join(' ');
}

export function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(fallbackItems);
  const [featuredProject, setFeaturedProject] = useState<FeaturedProject>(fallbackFeatured);

  useEffect(() => {
    client
      .fetch<any[]>(
        `*[_type == "portfolioProject"] | order(_createdAt desc) {
          _id, title, category, mainImage, featured, slug
        }`
      )
      .then((data) => {
        if (data && data.length > 0) {
          const sanityItems = data.map((item, idx) => ({
            id: item._id,
            title: item.title,
            category: categoryMap[item.category] || item.category || '',
            slug: item.slug?.current,
            image: item.mainImage
              ? urlFor(item.mainImage).width(800).url()
              : fallbackItems[idx % fallbackItems.length].image,
          }));
          const remainingFallbacks = fallbackItems.slice(sanityItems.length);
          setPortfolioItems([...sanityItems, ...remainingFallbacks]);

          const featured = data.find((p) => p.featured);
          if (featured) {
            setFeaturedProject({
              title: featured.title,
              description: '',
              image: featured.mainImage
                ? urlFor(featured.mainImage).width(1200).url()
                : fallbackFeatured.image,
            });
          }
        }
      })
      .catch(console.error);

    client
      .fetch<any>(
        `*[_type == "portfolioProject" && featured == true][0]{
          title, mainImage, description, "slug": slug.current
        }`
      )
      .then((data) => {
        if (data && data.title) {
          setFeaturedProject({
            title: data.title,
            description: data.description ? blocksToText(data.description) : fallbackFeatured.description,
            image: data.mainImage
              ? urlFor(data.mainImage).width(1200).url()
              : fallbackFeatured.image,
            slug: data.slug || fallbackFeatured.slug,
          });
        }
      })
      .catch(console.error);
  }, []);

  const filteredItems = selectedCategory === 'All'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === selectedCategory);

  return (
    <div className="py-20">
      <Helmet>
        <title>Portfolio | Nicola Jones | Murals, Illustration, Theatre and Brand Work</title>
        <meta name="description" content="Selected commissions and personal work by Nicola Jones. Murals, scenic art for theatre and live events, brand illustration and editorial." />
        <link rel="canonical" href="https://nicolajones.art/portfolio" />
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="relative mb-16">
          <BlobShape color="#E8846F" className="absolute -top-20 -right-20 w-64 h-64 opacity-10" variant={1} />

          <div className="flex items-end gap-6 flex-wrap">
            <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-5xl lg:text-7xl text-[#4A3428]">
              The Work
            </h1>

            {/* Paintbrush character peeking over text */}
            <motion.div
              className="relative -mb-2 pointer-events-none"
              animate={{ rotate: [0, 10, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <img src="/nicola-jones-shimmy-loop.png" alt="" aria-hidden="true" className="w-24 md:w-40 h-auto" />
            </motion.div>
          </div>

          <p className="text-xl text-[#6B7554] max-w-2xl mt-4">
            From tiny book pages to towering building facades — here's where imagination meets walls, pages, and everything in between.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-['Plus_Jakarta_Sans'] transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-[#E8846F] text-white shadow-lg'
                  : 'bg-white text-[#4A3428] hover:bg-[#F5EFE8] border border-[#4A3428]/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Featured Project Banner */}
        <div className="bg-gradient-to-r from-[#5D9B9B] to-[#6B7554] rounded-3xl p-8 lg:p-12 mb-16 relative overflow-hidden">
          <BlobShape color="rgba(255,255,255,0.1)" className="absolute top-0 right-0 w-96 h-96" variant={2} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm mb-4">
                Featured Project
              </span>
              <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl lg:text-4xl text-white mb-4">
                {featuredProject.title}
              </h2>
              {featuredProject.description && (
                <p className="text-white/90 text-lg leading-relaxed mb-6">
                  {featuredProject.description}
                </p>
              )}
              <Link
                to={`/portfolio/${featuredProject.slug}`}
                className="inline-block bg-white text-[#5D9B9B] px-8 py-3 rounded-full hover:bg-[#F5EFE8] transition-colors font-['Plus_Jakarta_Sans']"
              >
                View Case Study
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <ImageWithFallback
                src={featuredProject.image}
                alt={featuredProject.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>

        {/* Masonry Gallery */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ResponsiveMasonry columnsCountBreakPoints={{ 0: 2, 768: 3, 1024: 4 }}>
            <Masonry gutter="1.5rem">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative group cursor-pointer"
                >
                  <Link to={`/portfolio/${item.slug}`} className="block">
                  <div className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    {index % 3 === 0 && (
                      <BlobShape
                        color={index % 2 === 0 ? '#E8846F' : '#5D9B9B'}
                        className="absolute -top-8 -right-8 w-24 h-24 opacity-30 z-20"
                        variant={((index % 3) + 1) as 1 | 2 | 3}
                      />
                    )}

                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#4A3428]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-[#E8846F] text-sm mb-2">{item.category}</span>
                      <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-2xl text-white">{item.title}</h3>
                    </div>
                  </div>
                  </Link>
                </motion.div>
              ))}
            </Masonry>
            </ResponsiveMasonry>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
