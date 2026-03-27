import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Masonry from 'react-responsive-masonry';
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
}

interface FeaturedProject {
  title: string;
  description: string;
  image: string;
}

const fallbackItems: PortfolioItem[] = [
  { id: 1, category: 'Murals', image: 'https://images.unsplash.com/photo-1758426637884-8d27c12b2741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXJnZSUyMGJ1aWxkaW5nJTIwbXVyYWwlMjBzdHJlZXQlMjBwYWludGluZ3xlbnwxfHx8fDE3NzQ1MDcxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080', title: 'High Street Mural' },
  { id: 2, category: 'Books', image: 'https://images.unsplash.com/photo-1649750291589-8812197b698c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGJvb2slMjBpbGx1c3RyYXRpb24lMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzQ1MDcxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080', title: 'The Curious Cat' },
  { id: 3, category: 'Theatre & Events', image: 'https://images.unsplash.com/photo-1737617009800-5d570a8552ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdHJlJTIwc3RhZ2UlMjBzZXQlMjBjb2xvcmZ1bCUyMGRlc2lnbnxlbnwxfHx8fDE3NzQ1MDcxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080', title: 'Midsummer Night Set' },
  { id: 4, category: 'Illustration', image: 'https://images.unsplash.com/photo-1571473569215-d86aa5a582c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2xkJTIwZ3JhcGhpYyUyMHBvc3RlciUyMGlsbHVzdHJhdGlvbiUyMHByaW50fGVufDF8fHx8MTc3NDUwNzEyMXww&ixlib=rb-4.1.0&q=80&w=1080', title: 'Brand Characters' },
  { id: 5, category: 'Illustration', image: 'https://images.unsplash.com/photo-1769053012127-b05ba10350d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGltc2ljYWwlMjBjYXJ0b29uJTIwY2hhcmFjdGVyJTIwYXJ0JTIwcGFpbnRpbmd8ZW58MXx8fHwxNzc0NTA3MTIxfDA&ixlib=rb-4.1.0&q=80&w=1080', title: 'Whimsical Series' },
  { id: 6, category: 'Murals', image: 'https://images.unsplash.com/photo-1759936263498-325015569a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHdhbGwlMjBtdXJhbCUyMHVyYmFuJTIwYXJ0fGVufDF8fHx8MTc3NDUwNzExOHww&ixlib=rb-4.1.0&q=80&w=1080', title: 'Community Center Mural' },
  { id: 7, category: 'Books', image: 'https://images.unsplash.com/photo-1770726345481-01bb16e5c76c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kJTIwZHJhd24lMjBza2V0Y2glMjBkb29kbGUlMjBhcnR8ZW58MXx8fHwxNzc0NTA3MTIwfDA&ixlib=rb-4.1.0&q=80&w=1080', title: 'Adventure Book' },
  { id: 8, category: 'Illustration', image: 'https://images.unsplash.com/photo-1717675615860-1ea09962213d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwcGFpbnRpbmclMjBjb2xvcmZ1bCUyMGFic3RyYWN0JTIwYXJ0fGVufDF8fHx8MTc3NDUwNzEyMnww&ixlib=rb-4.1.0&q=80&w=1080', title: 'Watercolour Originals' },
];

const fallbackFeatured: FeaturedProject = {
  title: 'Hastings Seafront Mural',
  description: 'A 40-foot celebration of coastal life featuring cheeky seagulls, dancing fish, and local characters. This project brought the community together and now serves as a beloved landmark.',
  image: 'https://images.unsplash.com/photo-1758426637884-8d27c12b2741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXJnZSUyMGJ1aWxkaW5nJTIwbXVyYWwlMjBzdHJlZXQlMjBwYWludGluZ3xlbnwxfHx8fDE3NzQ1MDcxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
          _id, title, category, mainImage, featured
        }`
      )
      .then((data) => {
        if (data && data.length > 0) {
          setPortfolioItems(
            data.map((item, idx) => ({
              id: item._id,
              title: item.title,
              category: categoryMap[item.category] || item.category || '',
              image: item.mainImage
                ? urlFor(item.mainImage).width(800).url()
                : fallbackItems[idx % fallbackItems.length].image,
            }))
          );

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
      .catch(() => {});

    client
      .fetch<any>(
        `*[_type == "portfolioProject" && featured == true][0]{
          title, mainImage, description
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
          });
        }
      })
      .catch(() => {});
  }, []);

  const filteredItems = selectedCategory === 'All'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === selectedCategory);

  return (
    <div className="py-20">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="relative mb-16">
          <BlobShape color="#E8846F" className="absolute -top-20 -right-20 w-64 h-64 opacity-10" variant={1} />

          <div className="flex items-end gap-6 flex-wrap">
            <motion.h1
              className="font-['Fredoka'] text-5xl lg:text-7xl text-[#4A3428]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              The Work
            </motion.h1>

            {/* Paintbrush character peeking over text */}
            <motion.div
              className="relative -mb-2"
              animate={{ rotate: [0, 10, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <svg viewBox="0 0 50 70" className="w-10 h-14">
                <rect x="22" y="30" width="6" height="35" rx="3" fill="#4A3428" />
                <ellipse cx="25" cy="25" rx="14" ry="18" fill="#E8846F" />
                <circle cx="20" cy="20" r="3" fill="#4A3428" />
                <circle cx="30" cy="20" r="3" fill="#4A3428" />
                <path d="M18 28 Q25 34 32 28" stroke="#4A3428" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
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
              className={`px-6 py-3 rounded-full font-['Nunito'] transition-all duration-300 ${
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
        <motion.div
          className="bg-gradient-to-r from-[#5D9B9B] to-[#6B7554] rounded-3xl p-8 lg:p-12 mb-16 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <BlobShape color="rgba(255,255,255,0.1)" className="absolute top-0 right-0 w-96 h-96" variant={2} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm mb-4">
                Featured Project
              </span>
              <h2 className="font-['Fredoka'] text-3xl lg:text-4xl text-white mb-4">
                {featuredProject.title}
              </h2>
              {featuredProject.description && (
                <p className="text-white/90 text-lg leading-relaxed mb-6">
                  {featuredProject.description}
                </p>
              )}
              <button className="bg-white text-[#5D9B9B] px-8 py-3 rounded-full hover:bg-[#F5EFE8] transition-colors font-['Nunito']">
                View Case Study
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <ImageWithFallback
                src={featuredProject.image}
                alt={featuredProject.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Character breaking out of frame */}
          <motion.div
            className="absolute -bottom-4 right-8 z-20 hidden lg:block"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg viewBox="0 0 40 40" className="w-12 h-12">
              <circle cx="20" cy="20" r="18" fill="#E8846F" />
              <circle cx="15" cy="16" r="2.5" fill="#4A3428" />
              <circle cx="25" cy="16" r="2.5" fill="#4A3428" />
              <path d="M14 25 Q20 31 26 25" stroke="#4A3428" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Masonry Gallery */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Masonry columnsCount={3} gutter="1.5rem">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative group cursor-pointer"
                >
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
                      <h3 className="font-['Fredoka'] text-2xl text-white">{item.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </Masonry>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
