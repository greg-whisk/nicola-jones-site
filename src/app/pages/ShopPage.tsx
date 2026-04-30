import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import { BlobShape } from '../components/BlobShape';
import { PillButton } from '../components/PillButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { client, urlFor } from '../../lib/sanity';

const categories = ['All', 'Originals', 'Prints', 'Gifts and Apparel'];

const categoryLabels: Record<string, string> = {
  originals: 'Originals',
  prints: 'Prints',
  gifts: 'Gifts',
  apparel: 'Apparel',
  'live-painting': 'Live Painting',
  // Legacy values — kept so existing product data still renders
  'original-art': 'Original Art',
  'tote-bags': 'Tote Bags',
  merch: 'Merch',
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
  { id: 1, slug: 'alexander-park-print', name: 'Alexander Park Print', price: 35, category: 'prints', image: '' },
  { id: 2, slug: 'bathroom-print', name: 'Bathroom Print', price: 30, category: 'prints', image: '' },
  { id: 3, slug: 'bum-print', name: 'Bum Print', price: 35, category: 'prints', image: '' },
  { id: 4, slug: 'kitchen-table-print', name: 'Kitchen Table Print', price: 30, category: 'prints', image: '' },
  { id: 5, slug: 'legs-print', name: 'Legs Print', price: 35, category: 'prints', image: '' },
  { id: 7, slug: 'west-hill-from-east-hill-print', name: 'West Hill from East Hill Print', price: 30, category: 'prints', image: '' },
  { id: 8, slug: 'toilet-print', name: 'Toilet Print', price: 30, category: 'prints', image: '' },
  { id: 9, slug: 'decorated-balls', name: 'Decorated Balls', price: 75, category: 'gifts', image: '' },
  { id: 10, slug: 'teeth-original', name: 'Teeth Original', price: 150, category: 'original-art', image: '' },
  { id: 11, slug: 'trainers-original', name: 'Trainers Original', price: 220, category: 'originals', image: '' },
  { id: 12, slug: 'tulips-wooden-cutout', name: 'Tulips Wooden Cutout', price: 0, category: 'originals', image: '' },
  { id: 13, slug: 'moka-pot-wooden-cutout', name: 'Moka Pot Wooden Cutout', price: 0, category: 'originals', image: '' },
];

const fallbackFeatured: FeaturedProduct = {
  name: 'Trainers Original',
  price: 220,
  description: 'A vibrant original piece bursting with personality. Hand-painted, signed and ready to bring joy to your walls.',
  image: '',
  slug: 'trainers-original',
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
          const mapped: Product[] = data
            .filter((item) => item.slug)
            .map((item) => ({
              id: item._id,
              slug: item.slug,
              name: item.name,
              price: item.price ?? 0,
              category: item.category || '',
              image: item.image ? urlFor(item.image).width(600).url() : '',
            }));
          setProducts(mapped);

          // Use first originals item (with a slug) as featured, fallback to first item with a slug
          const featured =
            data.find((p) => (p.category === 'originals' || p.category === 'original-art') && p.slug) ||
            data.find((p) => p.slug);
          if (featured && featured.slug) {
            setFeaturedProduct({
              name: featured.name,
              price: featured.price ?? 0,
              description: featured.description
                ? blocksToText(featured.description)
                : fallbackFeatured.description,
              image: featured.image
                ? urlFor(featured.image).width(1200).url()
                : fallbackFeatured.image,
              slug: featured.slug,
            });
          }
        }
      })
      .catch(console.error);
  }, []);

  const productsWithoutFeatured = products.filter(product => product.slug !== featuredProduct.slug);

  const filteredProducts = selectedCategory === 'All'
    ? productsWithoutFeatured
    : selectedCategory === 'Gifts and Apparel'
    ? productsWithoutFeatured.filter(product => ['gifts', 'apparel'].includes(product.category))
    : productsWithoutFeatured.filter(product => categoryLabels[product.category] === selectedCategory);

  return (
    <div className="py-20">
      <Helmet>
        <title>Shop Original Art, Prints and Illustrated Goods | Nicola Jones</title>
        <meta name="description" content="Buy original hand-painted art, giclée prints and illustrated objects by Nicola Jones. Made in Hastings, East Sussex. Free UK shipping on originals." />
        <link rel="canonical" href="https://nicolajones.art/shop" />
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="relative mb-8 flex items-center justify-center gap-6 flex-wrap">
          <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-5xl lg:text-7xl text-[#4A3428] text-center">
            From the Studio
          </h1>

          {/* Shopping bag character */}
          <div className="relative pointer-events-none">
            <img src="/nicola-jones-gladioli-guy-loop.png" alt="" aria-hidden="true" className="w-20 md:w-32 h-auto" />
          </div>
        </div>

        <p className="text-xl text-[#6B7554] max-w-2xl mb-12 text-center mx-auto">
          Original prints, hand-painted plywood pieces, illustrated objects and a small collection of goods. Some things are made to order in Hastings. Some are printed and shipped by my professional lab. Everything is worth having.
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

        {/* Fulfillment note */}
        <p className="text-xs text-[#9E9A8E] text-center mb-10 font-['Plus_Jakarta_Sans'] max-w-xl mx-auto">
          Prints are fulfilled by ThePrintSpace. Originals, baubles and hand-painted objects ship directly from my Hastings studio and may arrive separately.
        </p>

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

        {/* Trust Note */}
        <motion.div
          className="mt-20 pt-12 border-t border-[#4A3428]/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-2xl lg:text-3xl text-[#4A3428] mb-4 text-center">
            What you are buying and where it comes from
          </h2>
          <p className="text-base text-[#6B7554] leading-relaxed max-w-2xl mx-auto text-center">
            Originals, baubles and hand-painted objects are made by hand in my studio in Hastings and shipped by me personally. Prints are produced and dispatched by ThePrintSpace, my professional print lab. Mugs and t-shirts are printed to order. If anything arrives damaged or is not right, get in touch and I will sort it.
          </p>
        </motion.div>

        {/* Closing CTA */}
        <motion.div
          className="bg-gradient-to-br from-[#E8846F] to-[#D4725C] rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <BlobShape color="rgba(255,255,255,0.1)" className="absolute -top-10 -left-10 w-64 h-64" variant={1} />
          <BlobShape color="rgba(255,255,255,0.1)" className="absolute -bottom-10 -right-10 w-48 h-48" variant={2} />
          <div className="relative z-10">
            <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl lg:text-4xl text-white mb-4">
              Looking for something specific?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
              If you want a print that is not listed, a custom painted object or something made for a particular reason: get in touch.
            </p>
            <Link to="/contact">
              <PillButton variant="primary" className="!bg-white !text-[#E8846F] hover:!bg-[#E8846F] hover:!text-white">
                Send me a message
              </PillButton>
            </Link>
          </div>
        </motion.div>

        {/* Commission Banner */}
        <motion.div
          className="bg-[#F5EFE8] rounded-3xl p-8 lg:p-12 mt-20 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <BlobShape color="#5D9B9B" className="absolute top-0 left-0 w-64 h-64 opacity-10" variant={2} />
          <BlobShape color="#E8846F" className="absolute bottom-0 right-0 w-48 h-48 opacity-10" variant={1} />

          <div className="relative z-10 flex flex-col items-center justify-center gap-8">
            {/* Character illustration */}
            <img src="/nicola-jones-mouth-loop.png" className="w-24 md:w-40 h-auto pointer-events-none" alt="" aria-hidden="true" loading="lazy" decoding="async" />

            <div className="text-center">
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
