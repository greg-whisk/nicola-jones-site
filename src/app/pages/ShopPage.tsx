import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import { BlobShape } from '../components/BlobShape';
import { PillButton } from '../components/PillButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { client, urlFor } from '../../lib/sanity';

const categories = ['All', 'Prints', 'Original Art', 'Tote Bags', 'Merch'];

const categoryLabels: Record<string, string> = {
  prints: 'Prints',
  'original-art': 'Original Art',
  'tote-bags': 'Tote Bags',
  merch: 'Merch',
  'live-painting': 'Live Painting',
};

interface Product {
  id: string | number;
  slug: string;
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
  slug: string;
}

const fallbackProducts: Product[] = [
  { id: 1, slug: 'cheeky-bits-print', name: 'Cheeky Bits Print', price: 28, category: 'Prints', image: 'https://cdn.sanity.io/images/fnwcgtif/production/292cd1801a4012ceb14be47972788201fbf0de9b-2500x2500.webp' },
  { id: 2, slug: 'bedroom-nudes-original', name: 'Bedroom Nudes Original', price: 450, category: 'Original Art', image: 'https://cdn.sanity.io/images/fnwcgtif/production/f8a9a2b0d7fceff55f37abc7c2ecd1ef19f41f0f-1962x2500.webp' },
  { id: 3, slug: 'illustrated-tote-bag', name: 'Illustrated Tote Bag', price: 18, category: 'Tote Bags', image: 'https://cdn.sanity.io/images/fnwcgtif/production/0e2220428fdc8c17d6ca3efb11d455ece1391b39-2500x2500.webp' },
  { id: 4, slug: 'posters-flyers-print', name: 'Posters & Flyers Print', price: 32, category: 'Prints', image: 'https://cdn.sanity.io/images/fnwcgtif/production/d83fff21b5459aff10076597afaa0809729a1a3a-1088x1577.webp' },
  { id: 5, slug: 'sketches-pack', name: 'Sketches Pack', price: 8, category: 'Merch', image: 'https://cdn.sanity.io/images/fnwcgtif/production/12a5c46ac21512bf7ff423c7346f5a886c9a45ad-2500x2500.webp' },
  { id: 6, slug: 'springtide-print', name: 'Springtide Print', price: 35, category: 'Prints', image: 'https://cdn.sanity.io/images/fnwcgtif/production/abf3d9801d54142b3dccaaa6565f6666b9e6b11d-2442x2500.webp' },
  { id: 7, slug: 'mermaids-tote-bag', name: 'Mermaids Tote Bag', price: 22, category: 'Tote Bags', image: 'https://cdn.sanity.io/images/fnwcgtif/production/185033b23580aa12fab8e77751ddf777fc888523-2500x1407.webp' },
  { id: 8, slug: 'original-illustration', name: 'Original Illustration', price: 380, category: 'Original Art', image: 'https://cdn.sanity.io/images/fnwcgtif/production/bb60ff474e033dca8bf51908e552186fae8b9ad1-1668x2388.webp' },
  { id: 9, slug: 'pinpoint-print', name: 'Pinpoint Print', price: 15, category: 'Prints', image: 'https://cdn.sanity.io/images/fnwcgtif/production/3a34e71f48b9c70618f87f21de9a1e75990ac1cd-2388x1668.webp' },
];

const fallbackFeatured: FeaturedProduct = {
  name: 'Bedroom Nudes Original',
  price: 450,
  description: 'A vibrant original piece bursting with personality. Hand-painted, signed and ready to bring joy to your walls.',
  image: 'https://cdn.sanity.io/images/fnwcgtif/production/f8a9a2b0d7fceff55f37abc7c2ecd1ef19f41f0f-1962x2500.webp',
  slug: 'bedroom-nudes-original',
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
          _id, name, price, category, image, description, "slug": slug.current
        }`
      )
      .then((data) => {
        if (data && data.length > 0) {
          const mapped: Product[] = data.map((item, idx) => ({
            id: item._id,
            slug: item.slug || fallbackProducts[idx % fallbackProducts.length].slug,
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
              slug: featured.slug || fallbackFeatured.slug,
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
          <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-5xl lg:text-7xl text-[#4A3428]">
            The Shop
          </h1>

          {/* Shopping bag character */}
          <div className="relative pointer-events-none">
            <img src="/nicola-jones-gladioli-guy-loop.png" alt="" aria-hidden="true" className="w-20 md:w-32 h-auto" />
          </div>
        </div>

        <p className="text-xl text-[#6B7554] max-w-2xl mb-12">
          Bold prints, originals, and the odd tote bag. All drawn by hand (well, mostly), all shipped from Hastings.
        </p>

        {/* Featured Product Banner */}
        <div className="bg-gradient-to-r from-[#D8767D] to-[#E8846F] rounded-3xl p-8 lg:p-12 mb-16 relative overflow-hidden">
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
              <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl lg:text-4xl text-white mb-4">
                {featuredProduct.name}
              </h2>
              {featuredProduct.description && (
                <p className="text-white/90 text-lg leading-relaxed mb-6">
                  {featuredProduct.description}
                </p>
              )}
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl text-white">£{featuredProduct.price}</span>
                <Link to={`/shop/${featuredProduct.slug}`}>
                  <PillButton variant="primary" className="bg-white !text-[#D8767D] hover:bg-[#F5EFE8]">
                    View →
                  </PillButton>
                </Link>
              </div>
            </div>
          </div>


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

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <Link key={product.id} to={`/shop/${product.slug}`}>
              <motion.div
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-[#4A3428]/5 cursor-pointer"
                whileHover={{ y: -4 }}
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
                  <span className="text-[11px] uppercase tracking-widest text-[#6B7554]/70 mb-1 block">{categoryLabels[product.category] || product.category}</span>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-xl text-[#4A3428] mb-3 group-hover:text-[#E8846F] transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-2xl text-[#4A3428]">£{product.price}</span>
                    <span className="text-sm text-[#E8846F] font-['Plus_Jakarta_Sans'] hover:underline">View →</span>
                  </div>
                </div>
              </motion.div>
            </Link>
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
            <img src="/nicola-jones-mouth-loop.png" className="w-24 md:w-40 h-auto pointer-events-none" alt="" aria-hidden="true" />

            <div className="text-center lg:text-left flex-1">
              <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl lg:text-4xl text-[#4A3428] mb-4">
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
