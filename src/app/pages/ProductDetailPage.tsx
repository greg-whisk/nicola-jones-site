import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PillButton } from '../components/PillButton';
import { WavyDivider } from '../components/WavyDivider';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { client, urlFor } from '../../lib/sanity';

const TEAL = '#2C7A7B';

const sizeLabels: Record<string, string> = {
  a1: 'A1 — 594 × 841 mm',
  a2: 'A2 — 420 × 594 mm',
  a3: 'A3 — 297 × 420 mm',
  a4: 'A4 — 210 × 297 mm',
  original: 'Original',
  'one-size': 'One Size',
};

const categoryLabels: Record<string, string> = {
  prints: 'Prints',
  'original-art': 'Original Art',
  'tote-bags': 'Tote Bags',
  merch: 'Merch',
};

interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  primaryImage: string;
  gallery: string[];
  shortDescription: string;
  size: string;
  productDetails: any[];
}

interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

function blocksToLines(blocks: any[]): string[] {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b: any) => b._type === 'block')
    .map((b: any) =>
      (b.children || []).map((c: any) => c.text || '').join('')
    )
    .filter(Boolean);
}

function formatPrice(price: number): string {
  return `£${price.toFixed(2)}`;
}

const fallbackRelated: RelatedProduct[] = [
  { id: '1', slug: 'cheeky-bits-print', name: 'Cheeky Bits Print', price: 28, category: 'prints', image: 'https://cdn.sanity.io/images/fnwcgtif/production/292cd1801a4012ceb14be47972788201fbf0de9b-2500x2500.webp' },
  { id: '2', slug: 'bedroom-nudes-original', name: 'Bedroom Nudes Original', price: 450, category: 'original-art', image: 'https://cdn.sanity.io/images/fnwcgtif/production/f8a9a2b0d7fceff55f37abc7c2ecd1ef19f41f0f-1962x2500.webp' },
  { id: '3', slug: 'illustrated-tote-bag', name: 'Illustrated Tote Bag', price: 18, category: 'tote-bags', image: 'https://cdn.sanity.io/images/fnwcgtif/production/0e2220428fdc8c17d6ca3efb11d455ece1391b39-2500x2500.webp' },
  { id: '4', slug: 'posters-flyers-print', name: 'Posters & Flyers Print', price: 32, category: 'prints', image: 'https://cdn.sanity.io/images/fnwcgtif/production/d83fff21b5459aff10076597afaa0809729a1a3a-1088x1577.webp' },
];

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    setLoading(true);
    setCurrentImageIndex(0);
    setQuantity(1);
    setProduct(null);

    async function load() {
      try {
        const data = await client.fetch<any>(
          `*[_type == "shopProduct" && slug.current == $slug][0]{
            _id, name, price, category, image, gallery,
            shortDescription, size, productDetails,
            "slug": slug.current
          }`,
          { slug }
        );

        if (cancelled) return;

        if (!data || !data.name) {
          setLoading(false);
          return;
        }

        const primaryImage = data.image
          ? urlFor(data.image).width(1200).url()
          : '';
        const gallery: string[] = Array.isArray(data.gallery)
          ? data.gallery.map((img: any) => urlFor(img).width(1200).url())
          : [];

        setProduct({
          id: data._id,
          slug: data.slug || slug,
          name: data.name,
          price: data.price ?? 0,
          category: data.category || '',
          primaryImage,
          gallery,
          shortDescription: data.shortDescription || '',
          size: data.size || '',
          productDetails: data.productDetails || [],
        });
        // Clear loading as soon as the product is ready so the layout renders
        // immediately. Related products continue fetching in the background.
        setLoading(false);

        // Fetch related — same category first, then fallback to newest
        let relatedData: any[] | null = null;
        if (data.category) {
          relatedData = await client.fetch<any[]>(
            `*[_type == "shopProduct" && slug.current != $slug && category == $category][0..3]{
              _id, name, price, category, image, "slug": slug.current
            }`,
            { slug, category: data.category }
          );
        }

        if (cancelled) return;

        if (!relatedData || relatedData.length === 0) {
          relatedData = await client.fetch<any[]>(
            `*[_type == "shopProduct" && slug.current != $slug] | order(_createdAt desc) [0..3]{
              _id, name, price, category, image, "slug": slug.current
            }`,
            { slug }
          );
        }

        if (cancelled) return;

        if (relatedData && relatedData.length > 0) {
          setRelated(
            relatedData.map((item: any) => ({
              id: item._id,
              slug: item.slug || '',
              name: item.name,
              price: item.price ?? 0,
              category: item.category || '',
              image: item.image ? urlFor(item.image).width(600).url() : '',
            }))
          );
        } else {
          setRelated(
            fallbackRelated.filter((p) => p.slug !== slug).slice(0, 4)
          );
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setRelated(
            fallbackRelated.filter((p) => p.slug !== slug).slice(0, 4)
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="py-40 text-center">
        <p className="text-[#6B7554] font-['Plus_Jakarta_Sans']">Loading…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-40 text-center">
        <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-5xl text-[#4A3428] mb-4">
          Product not found
        </h1>
        <p className="text-xl text-[#6B7554] mb-8">
          Looks like this one sold out — or wandered off. Back to the shop?
        </p>
        <Link to="/shop">
          <PillButton variant="primary">Back to Shop</PillButton>
        </Link>
      </div>
    );
  }

  const allImages = [product.primaryImage, ...product.gallery].filter(Boolean);
  const hasGallery = allImages.length > 1;
  const displayImage = allImages[currentImageIndex] || '';
  const categoryLabel = categoryLabels[product.category] || product.category;
  const sizeLabel = sizeLabels[product.size] || product.size;
  const detailLines = blocksToLines(product.productDetails);

  function handlePrevImage() {
    setCurrentImageIndex((i) => (i === 0 ? allImages.length - 1 : i - 1));
  }

  function handleNextImage() {
    setCurrentImageIndex((i) =>
      i === allImages.length - 1 ? 0 : i + 1
    );
  }

  function handleBuyNow() {
    console.log('Buy Now intent:', {
      product: product!.name,
      slug: product!.slug,
      price: product!.price,
      quantity,
      total: product!.price * quantity,
    });
    // Stripe integration wired in a separate task
  }

  return (
    <div className="overflow-hidden">
      {/* Back link */}
      <div className="max-w-[1200px] mx-auto px-6 pt-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-[#6B7554] hover:text-[#2C7A7B] transition-colors font-['Plus_Jakarta_Sans'] text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>
      </div>

      {/* Main product section */}
      <section className="max-w-[1200px] mx-auto px-6 pt-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Left column: image carousel ── */}
          <div>
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#F5EEE3]">
              <ImageWithFallback
                src={displayImage}
                alt={product.name}
                className="w-full h-auto"
              />
              {hasGallery && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#4A3428]" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-[#4A3428]" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {hasGallery && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === currentImageIndex
                        ? 'border-[#2C7A7B]'
                        : 'border-transparent hover:border-[#2C7A7B]/40'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${product.name} — image ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right column: product info ── */}
          <div className="flex flex-col gap-5">

            {/* 1. Category pill + In stock */}
            <div className="flex items-center gap-3">
              <span
                className="inline-block px-3 py-1 rounded-full text-sm text-white font-['Plus_Jakarta_Sans']"
                style={{ backgroundColor: TEAL }}
              >
                {categoryLabel}
              </span>
              <span className="text-sm text-[#9E9A8E] font-['Plus_Jakarta_Sans']">
                ✓ In stock
              </span>
            </div>

            {/* 2. Product name */}
            <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl lg:text-5xl text-[#4A3428] leading-[1.1]">
              {product.name}
            </h1>

            {/* 3. Price */}
            <p
              className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl"
              style={{ color: TEAL }}
            >
              {formatPrice(product.price)}
            </p>

            {/* 4. Short description */}
            {product.shortDescription && (
              <p className="text-base text-[#6B7554] leading-relaxed font-['Plus_Jakarta_Sans']">
                {product.shortDescription}
              </p>
            )}

            {/* 5. Size pill */}
            {sizeLabel && (
              <div className="inline-flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest text-[#9E9A8E] font-['Plus_Jakarta_Sans'] mb-1">
                  Size
                </span>
                <span
                  className="px-4 py-2 rounded-full text-sm font-['Plus_Jakarta_Sans'] text-[#4A3428]"
                  style={{ backgroundColor: '#F5EEE3' }}
                >
                  {sizeLabel}
                </span>
              </div>
            )}

            {/* 6. Quantity + Buy Now */}
            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center rounded-full border border-[#D5CFC5] overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-10 flex items-center justify-center text-[#4A3428] hover:bg-[#F5EEE3] transition-colors font-['Plus_Jakarta_Sans'] text-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-9 text-center text-sm font-['Plus_Jakarta_Sans'] text-[#4A3428] select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="w-9 h-10 flex items-center justify-center text-[#4A3428] hover:bg-[#F5EEE3] transition-colors font-['Plus_Jakarta_Sans'] text-lg"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-white font-['Plus_Jakarta_Sans'] text-sm transition-opacity hover:opacity-90 active:opacity-80"
                style={{ backgroundColor: TEAL }}
              >
                <ShoppingCart className="w-4 h-4" />
                Buy Now — {formatPrice(product.price * quantity)}
              </button>
            </div>

            {/* 7. Trust badges */}
            <div className="flex gap-6 flex-wrap pt-1 border-t border-[#EDE8E0]">
              <div className="flex items-start gap-2 pt-4">
                <Truck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                <div>
                  <p className="text-xs font-['Plus_Jakarta_Sans'] text-[#4A3428] leading-tight">
                    Free UK shipping
                  </p>
                  <p className="text-xs font-['Plus_Jakarta_Sans'] text-[#9E9A8E] leading-tight">
                    Orders over £25
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-4">
                <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                <div>
                  <p className="text-xs font-['Plus_Jakarta_Sans'] text-[#4A3428] leading-tight">
                    Secure checkout
                  </p>
                  <p className="text-xs font-['Plus_Jakarta_Sans'] text-[#9E9A8E] leading-tight">
                    Powered by Stripe
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-4">
                <RotateCcw className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                <div>
                  <p className="text-xs font-['Plus_Jakarta_Sans'] text-[#4A3428] leading-tight">
                    Easy returns
                  </p>
                  <p className="text-xs font-['Plus_Jakarta_Sans'] text-[#9E9A8E] leading-tight">
                    30-day returns
                  </p>
                </div>
              </div>
            </div>

            {/* 8 + 9. Product Details */}
            {detailLines.length > 0 && (
              <div className="pt-2">
                <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-lg text-[#4A3428] mb-3">
                  Product Details
                </h2>
                <ul className="flex flex-col gap-2">
                  {detailLines.map((line, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 font-['Plus_Jakarta_Sans'] text-sm text-[#6B7554]"
                    >
                      <span
                        className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: TEAL }}
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      <WavyDivider color="#F5EFE8" />

      {/* You might also like */}
      {related.length > 0 && (
        <section className="bg-[#F5EFE8] py-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl text-[#4A3428] mb-12 text-center">
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
                      <span className="text-xs text-[#6B7554] mb-1 block">
                        {categoryLabels[item.category] || item.category}
                      </span>
                      <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-lg text-[#4A3428] mb-2 group-hover:text-[#2C7A7B] transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-xl text-[#4A3428]">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-sm text-[#6B7554] group-hover:text-[#2C7A7B] transition-colors">
                          View →
                        </span>
                      </div>
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
