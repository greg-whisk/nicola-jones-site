import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import { BlobShape } from '../components/BlobShape';
import { PillButton } from '../components/PillButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { client, urlFor } from '../../lib/sanity';

const categories = ['All', 'Prints', 'Original Art', 'Tote Bags', 'Merch'];

interface Product {
  id: string | number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface FeaturedProduct {
  name: string;
  price: number;
  description: string;
  image: string;
}

const fallbackProducts: Product[] = [
  { id: 1, name: 'Cheeky Seagull Print', price: 28, category: 'Prints', image: 'https://images.unsplash.com/photo-1763690792486-812722ffb455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwcmludCUyMGZyYW1lZCUyMGlsbHVzdHJhdGlvbiUyMHdhbGx8ZW58MXx8fHwxNzc0NTA3MTIxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 2, name: 'Dancing Fish Original', price: 450, category: 'Original Art', image: 'https://images.unsplash.com/photo-1717675615860-1ea09962213d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwcGFpbnRpbmclMjBjb2xvcmZ1bCUyMGFic3RyYWN0JTIwYXJ0fGVufDF8fHx8MTc3NDUwNzEyMnww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 3, name: 'Illustrated Tote Bag', price: 18, category: 'Tote Bags', image: 'https://images.unsplash.com/photo-1648994605536-10633d3e0886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbGx1c3RyYXRlZCUyMHRvdGUlMjBiYWclMjBjYW52YXMlMjBkZXNpZ258ZW58MXx8fHwxNzc0NTA3MTE5fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 4, name: 'Bold Character Print', price: 32, category: 'Prints', image: 'https://images.unsplash.com/photo-1571473569215-d86aa5a582c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2xkJTIwZ3JhcGhpYyUyMHBvc3RlciUyMGlsbHVzdHJhdGlvbiUyMHByaW50fGVufDF8fHx8MTc3NDUwNzEyMXww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 5, name: 'Adventure Sticker Pack', price: 8, category: 'Merch', image: 'https://images.unsplash.com/photo-1770726345481-01bb16e5c76c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kJTIwZHJhd24lMjBza2V0Y2glMjBkb29kbGUlMjBhcnR8ZW58MXx8fHwxNzc0NTA3MTIwfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 6, name: 'Whimsy Collection Print', price: 35, category: 'Prints', image: 'https://images.unsplash.com/photo-1769053012127-b05ba10350d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGltc2ljYWwlMjBjYXJ0b29uJTIwY2hhcmFjdGVyJTIwYXJ0JTIwcGFpbnRpbmd8ZW58MXx8fHwxNzc0NTA3MTIxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 7, name: 'Coastal Tote Bag', price: 22, category: 'Tote Bags', image: 'https://images.unsplash.com/photo-1648994605536-10633d3e0886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbGx1c3RyYXRlZCUyMHRvdGUlMjBiYWclMjBkZXNpZ258ZW58MXx8fHwxNzc0NDc0MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 8, name: 'Original Watercolour', price: 380, category: 'Original Art', image: 'https://images.unsplash.com/photo-1649750291589-8812197b698c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGJvb2slMjBpbGx1c3RyYXRpb24lMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzQ1MDcxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 9, name: 'Character Pin Set', price: 15, category: 'Merch', image: 'https://images.unsplash.com/photo-1684342936280-df0d753e2753?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmFtZWwlMjBwaW4lMjBiYWRnZSUyMHNldCUyMGNvbG9yZnVsfGVufDF8fHx8MTc3NDUwNzEyMnww&ixlib=rb-4.1.0&q=80&w=1080' },
];

const fallbackFeatured: FeaturedProduct = {
  name: 'Dancing Fish Original',
  price: 450,
  description: 'A vibrant original watercolour piece bursting with personality. Hand-painted on 300gsm paper, signed and ready to bring joy to your walls.',
  image: 'https://images.unsplash.com/photo-1717675615860-1ea09962213d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwcGFpbnRpbmclMjBjb2xvcmZ1bCUyMGFic3RyYWN0JTIwYXJ0fGVufDF8fHx8MTc3NDUwNzEyMnww&ixlib=rb-4.1.0&q=80&w=1080',
};

function blocksToText(blocks: any[]): string {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .filter((b: any) => b._type === 'block')
    .map((b: any) => (b.children || []).map((c: any) => c.text || '').join(''))
    .join(' ');
}

export function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [featuredProduct, setFeaturedProduct] = useState<FeaturedProduct>(fallbackFeatured);

  useEffect(() => {
    client
      .fetch<any[]>(
        `*[_type == "shopProduct" && inStock != false] | order(_createdAt desc) {
          _id, name, price, category, image, description
        }`
      )
      .then((data) => {
        if (data && data.length > 0) {
          const mapped: Product[] = data.map((item, idx) => ({
            id: item._id,
            name: item.name,
            price: item.price ?? 0,
            category: item.category || '',
            image: item.image
              ? urlFor(item.image).width(600).url()
              : fallbackProducts[idx % fallbackProducts.length].image,
          }));
          setProducts(mapped);

          // Use first "Original Art" item as featured, fallback to first item
          const featured = data.find((p) => p.category === 'Original Art') || data[0];
          if (featured) {
            setFeaturedProduct({
              name: featured.name,
              price: featured.price ?? 0,
              description: featured.description
                ? blocksToText(featured.description)
                : fallbackFeatured.description,
              image: featured.image
                ? urlFor(featured.image).width(1200).url()
                : fallbackFeatured.image,
            });
          }
        }
      })
      .catch(console.error);
  }, []);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="py-20">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="relative mb-8 flex items-center gap-6 flex-wrap">
          <motion.h1
            className="font-['Fredoka'] text-5xl lg:text-7xl text-[#4A3428]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            The Shop
          </motion.h1>

          {/* Shopping bag character */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, rotate: -20 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <svg viewBox="0 0 60 70" className="w-14 h-16">
              <rect x="10" y="25" width="40" height="35" rx="6" fill="#E8846F" />
              <path d="M20 25 Q20 10 30 10 Q40 10 40 25" stroke="#4A3428" strokeWidth="3" fill="none" />
              <circle cx="24" cy="40" r="3" fill="#4A3428" />
              <circle cx="36" cy="40" r="3" fill="#4A3428" />
              <path d="M22 50 Q30 56 38 50" stroke="#4A3428" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>

        <p className="text-xl text-[#6B7554] max-w-2xl mb-12">
          Bold prints, originals, and the odd tote bag. All drawn by hand (well, mostly), all shipped from Hastings.
        </p>

        {/* Featured Product Banner */}
        <motion.div
          className="bg-gradient-to-r from-[#D8767D] to-[#E8846F] rounded-3xl p-8 lg:p-12 mb-16 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <BlobShape color="rgba(255,255,255,0.15)" className="absolute -bottom-10 -left-10 w-72 h-72" variant={3} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="rounded-2xl overflow-hidden shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 order-2 lg:order-1">
              <ImageWithFallback
                src={featuredProduct.image}
                alt={featuredProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm mb-4">
                Limited Edition
              </span>
              <h2 className="font-['Fredoka'] text-3xl lg:text-4xl text-white mb-4">
                {featuredProduct.name}
              </h2>
              {featuredProduct.description && (
                <p className="text-white/90 text-lg leading-relaxed mb-6">
                  {featuredProduct.description}
                </p>
              )}
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-['Fredoka'] text-3xl text-white">£{featuredProduct.price}</span>
                <PillButton variant="primary" className="bg-white !text-[#D8767D] hover:bg-[#F5EFE8]">
                  Add to bag
                </PillButton>
              </div>
            </div>
          </div>

          {/* Character pointing at product */}
          <motion.div
            className="absolute top-4 right-4 hidden lg:block"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <circle cx="20" cy="20" r="18" fill="#FAF8F5" fillOpacity="0.3" />
              <circle cx="15" cy="17" r="2" fill="#FAF8F5" />
              <circle cx="25" cy="17" r="2" fill="#FAF8F5" />
              <path d="M14 25 Q20 30 26 25" stroke="#FAF8F5" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </motion.div>
        </motion.div>

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

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-[#4A3428]/5"
            >
              <div className="relative aspect-square overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {index % 4 === 0 && (
                  <BlobShape
                    color={index % 2 === 0 ? '#E8846F' : '#5D9B9B'}
                    className="absolute -top-6 -right-6 w-20 h-20 opacity-30"
                    variant={((index % 3) + 1) as 1 | 2 | 3}
                  />
                )}
              </div>

              <div className="p-6">
                <span className="text-sm text-[#6B7554] mb-2 block">{product.category}</span>
                <h3 className="font-['Fredoka'] text-xl text-[#4A3428] mb-3">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-['Fredoka'] text-2xl text-[#4A3428]">£{product.price}</span>
                  <PillButton variant="accent" className="text-sm !px-6 !py-2">
                    Add to bag
                  </PillButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Commission Banner */}
        <motion.div
          className="bg-[#F5EFE8] rounded-3xl p-8 lg:p-12 mt-20 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <BlobShape color="#5D9B9B" className="absolute top-0 left-0 w-64 h-64 opacity-10" variant={2} />
          <BlobShape color="#E8846F" className="absolute bottom-0 right-0 w-48 h-48 opacity-10" variant={1} />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            {/* Character illustration */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <svg viewBox="0 0 80 100" className="w-20 h-24">
                <ellipse cx="40" cy="45" rx="30" ry="35" fill="#5D9B9B" />
                <circle cx="30" cy="38" r="4" fill="#FAF8F5" />
                <circle cx="50" cy="38" r="4" fill="#FAF8F5" />
                <circle cx="31" cy="37" r="1.5" fill="#4A3428" />
                <circle cx="51" cy="37" r="1.5" fill="#4A3428" />
                <path d="M30 55 Q40 65 50 55" stroke="#4A3428" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <line x1="10" y1="45" x2="2" y2="30" stroke="#5D9B9B" strokeWidth="6" strokeLinecap="round" />
                <line x1="70" y1="45" x2="78" y2="30" stroke="#5D9B9B" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </motion.div>

            <div className="text-center lg:text-left flex-1">
              <h2 className="font-['Fredoka'] text-3xl lg:text-4xl text-[#4A3428] mb-4">
                Want something one-of-a-kind?
              </h2>
              <p className="text-xl text-[#6B7554] mb-6 max-w-2xl">
                Commission a custom piece that's uniquely yours. From personal portraits to bespoke illustrations for your brand.
              </p>
              <Link to="/commissions">
                <PillButton variant="primary">
                  Start a commission
                </PillButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
