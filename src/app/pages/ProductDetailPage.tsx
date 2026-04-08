import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { BlobShape } from '../components/BlobShape';
import { PillButton } from '../components/PillButton';
import { WavyDivider } from '../components/WavyDivider';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { client, urlFor } from '../../lib/sanity';

interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

const categoryColors: Record<string, string> = {
  Prints: '#E8846F',
  'Original Art': '#5D9B9B',
  'Tote Bags': '#6B7554',
  Merch: '#D8767D',
};

const fallbackProducts: ShopProduct[] = [
  { id: '1', slug: 'cheeky-bits-print', name: 'Cheeky Bits Print', price: 28, category: 'Prints', image: 'https://cdn.sanity.io/images/fnwcgtif/production/292cd1801a4012ceb14be47972788201fbf0de9b-2500x2500.webp', description: 'A bold, playful print bursting with personality. Printed on high-quality 300gsm matte paper, signed and ready to hang.' },
  { id: '2', slug: 'bedroom-nudes-original', name: 'Bedroom Nudes Original', price: 450, category: 'Original Art', image: 'https://cdn.sanity.io/images/fnwcgtif/production/f8a9a2b0d7fceff55f37abc7c2ecd1ef19f41f0f-1962x2500.webp', description: 'A vibrant original piece bursting with personality. Hand-painted, signed and ready to bring joy to your walls.' },
  { id: '3', slug: 'illustrated-tote-bag', name: 'Illustrated Tote Bag', price: 18, category: 'Tote Bags', image: 'https://cdn.sanity.io/images/fnwcgtif/production/0e2220428fdc8c17d6ca3efb11d455ece1391b39-2500x2500.webp', description: 'A sturdy cotton tote with a hand-drawn illustration. Perfect for shopping, beach trips, or looking fabulous.' },
  { id: '4', slug: 'posters-flyers-print', name: 'Posters & Flyers Print', price: 32, category: 'Prints', image: 'https://cdn.sanity.io/images/fnwcgtif/production/d83fff21b5459aff10076597afaa0809729a1a3a-1088x1577.webp', description: 'Eye-catching poster art with a distinctive illustrative style. Limited edition run.' },
  { id: '5', slug: 'sketches-pack', name: 'Sketches Pack', price: 8, category: 'Merch', image: 'https://cdn.sanity.io/images/fnwcgtif/production/12a5c46ac21512bf7ff423c7346f5a886c9a45ad-2500x2500.webp', description: 'A collection of mini print sketches — great for gifts, bullet journals, or brightening up a shelf.' },
  { id: '6', slug: 'springtide-print', name: 'Springtide Print', price: 35, category: 'Prints', image: 'https://cdn.sanity.io/images/fnwcgtif/production/abf3d9801d54142b3dccaaa6565f6666b9e6b11d-2442x2500.webp', description: 'A joyful springtime illustration, full of flowers and colour. Printed on archival-quality paper.' },
];

function blocksToText(blocks: any[]): string {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .filter((b: any) => b._type === 'block')
    .map((b: any) => (b.children || []).map((c: any) => c.text || '').join(''))
    .join(' ');
}

function getFallbackBySlug(slug: string): ShopProduct | null {
  return fallbackProducts.find((p) => p.slug === slug) || null;
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ShopProduct | null>(
    slug ? getFallbackBySlug(slug) : null
  );
  const [related, setRelated] = useState<ShopProduct[]>([]);

  useEffect(() => {
    if (!slug) return;

    client
      .fetch<any>(
        `*[_type == "shopProduct" && slug.current == $slug][0]{
          _id, name, price, category, image, description, "slug": slug.current
        }`,
        { slug }
      )
      .then((data) => {
        if (data && data.name) {
          setProduct({
            id: data._id,
            slug: data.slug || slug,
            name: data.name,
            price: data.price ?? 0,
            category: data.category || '',
            image: data.image ? urlFor(data.image).width(1200).url() : '',
            description: data.description
              ? blocksToText(data.description)
              : '',
          });
        }
      })
      .catch(console.error);

    client
      .fetch<any[]>(
        `*[_type == "shopProduct" && slug.current != $slug][0..3]{
          _id, name, price, category, image, "slug": slug.current
        }`,
        { slug }
      )
      .then((data) => {
        if (data && data.length > 0) {
          const mapped: ShopProduct[] = data.map((item, idx) => ({
            id: item._id,
            slug: item.slug || '',
            name: item.name,
            price: item.price ?? 0,
            category: item.category || '',
            image: item.image
              ? urlFor(item.image).width(600).url()
              : fallbackProducts[idx % fallbackProducts.length].image,
            description: '',
          }));
          setRelated(mapped);
        } else {
          // fallback related
          setRelated(
            fallbackProducts.filter((p) => p.slug !== slug).slice(0, 4)
          );
        }
      })
      .catch(() => {
        setRelated(fallbackProducts.filter((p) => p.slug !== slug).slice(0, 4));
      });
  }, [slug]);

  const accentColor = product ? categoryColors[product.category] || '#E8846F' : '#E8846F';

  if (!product) {
    return (
      <div className="py-40 text-center">
        <h1 className="font-['Fredoka'] text-5xl text-[#4A3428] mb-4">Product not found</h1>
        <p className="text-xl text-[#6B7554] mb-8">
          Looks like this one sold out — or wandered off. Back to the shop?
        </p>
        <Link to="/shop">
          <PillButton variant="primary">Back to Shop</PillButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Back link */}
      <div className="max-w-[1440px] mx-auto px-6 pt-8 relative z-20">
        <motion.button
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 text-[#6B7554] hover:text-[#E8846F] transition-colors font-['Nunito'] group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </motion.button>
      </div>

      {/* Hero */}
      <section className="max-w-[1440px] mx-auto px-6 pt-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Product Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <BlobShape
              color={accentColor}
              className="absolute -top-16 -left-16 w-64 h-64 opacity-20"
              variant={2}
            />
            <BlobShape
              color={accentColor}
              className="absolute -bottom-10 -right-10 w-40 h-40 opacity-15"
              variant={3}
            />
            <div
              className="relative z-10 rounded-3xl overflow-hidden shadow-2xl"
              style={{ transform: 'rotate(-1deg)' }}
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-auto"
              />
            </div>

            {/* Floating character */}
            <motion.div
              className="absolute -bottom-6 -right-6 z-20"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <svg viewBox="0 0 44 44" className="w-14 h-14 drop-shadow-lg">
                <circle cx="22" cy="22" r="20" fill={accentColor} />
                <circle cx="16" cy="18" r="3" fill="#FAF8F5" />
                <circle cx="28" cy="18" r="3" fill="#FAF8F5" />
                <circle cx="16.5" cy="17.5" r="1.2" fill="#4A3428" />
                <circle cx="28.5" cy="17.5" r="1.2" fill="#4A3428" />
                <path d="M15 28 Q22 34 29 28" stroke="#4A3428" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Category pill */}
            <div className="mb-5">
              <span
                className="inline-block text-white px-4 py-1.5 rounded-full text-sm font-['Nunito']"
                style={{ backgroundColor: accentColor }}
              >
                {product.category}
              </span>
            </div>

            <h1 className="font-['Fredoka'] text-4xl lg:text-5xl text-[#4A3428] mb-4 leading-[1.1]">
              {product.name}
            </h1>

            <p className="font-['Fredoka'] text-4xl text-[#4A3428] mb-6">
              £{product.price}
            </p>

            {product.description && (
              <p className="text-lg text-[#6B7554] leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Buy Now */}
            <div className="flex flex-wrap gap-4 items-center">
              <motion.button
                className="flex items-center gap-3 px-10 py-4 rounded-full font-['Nunito'] text-lg bg-[#E8846F] text-white shadow-lg hover:bg-[#D8767D] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Stripe checkout placeholder
                  alert('Checkout coming soon!');
                }}
              >
                <ShoppingBag className="w-5 h-5" />
                Buy Now
              </motion.button>
              <Link to="/commissions">
                <PillButton variant="outline">Want it custom?</PillButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <WavyDivider color="#F5EFE8" />

      {/* Related Products */}
      {related.length > 0 && (
        <section className="bg-[#F5EFE8] py-20">
          <div className="max-w-[1440px] mx-auto px-6">
            <h2 className="font-['Fredoka'] text-4xl text-[#4A3428] mb-12 text-center">
              You might also like
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item, index) => (
                <Link key={item.id} to={`/shop/${item.slug}`}>
                  <motion.div
                    className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-[#4A3428]/5"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-xs text-[#6B7554] mb-1 block">{item.category}</span>
                      <h3 className="font-['Fredoka'] text-lg text-[#4A3428] mb-2 group-hover:text-[#E8846F] transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-['Fredoka'] text-xl text-[#4A3428]">£{item.price}</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/shop">
                <PillButton variant="outline">View all products</PillButton>
              </Link>
            </div>
          </div>
        </section>
      )}

      <WavyDivider color="#FAF8F5" flip />
    </div>
  );
}
