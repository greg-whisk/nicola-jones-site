import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { BlobShape } from '../components/BlobShape';
import { PillButton } from '../components/PillButton';
import { client } from '../../lib/sanity';

// ── Types ─────────────────────────────────────────────────────────────────────

interface EventPackage {
  duration: string;
  price: string;
  goodFor: string;
  includes: string;
  ctaLabel: string;
}

interface Workshop {
  title: string;
  price: string;
  description: string;
  ctaLabel: string;
}

interface Step {
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface CelebratePageData {
  heroEyebrow?: string;
  heroHeadline?: string;
  heroBody?: string;
  heroPrimaryCtaLabel?: string;
  heroSecondaryCtaLabel?: string;
  eventsHeading?: string;
  eventsIntro?: string;
  packages?: EventPackage[];
  eventsClosingNote?: string;
  workshopsHeading?: string;
  workshopsIntro?: string;
  workshops?: Workshop[];
  howItWorksHeading?: string;
  howItWorksSteps?: Step[];
  faqsHeading?: string;
  faqs?: FAQ[];
  closingCtaHeading?: string;
  closingCtaBody?: string;
  closingCtaLabel?: string;
  closingCtaUrl?: string;
}

// ── Fallback copy ─────────────────────────────────────────────────────────────

const FALLBACK_PACKAGES: EventPackage[] = [
  {
    duration: '2 Hours',
    price: '£450',
    goodFor: 'Drinks receptions, store openings, intimate parties, brand activations.',
    includes:
      'High-speed ink and wash portraits. In two hours I can usually capture fifteen to twenty guests, each one different, each one theirs to keep.',
    ctaLabel: 'Check availability',
  },
  {
    duration: '4 Hours',
    price: '£800',
    goodFor: 'Weddings — ceremony and drinks reception, or the evening party.',
    includes:
      'A broader look at the event. Key moments, key people, up to forty guest portraits.',
    ctaLabel: 'Check availability',
  },
  {
    duration: '8 Hours',
    price: '£1,800',
    goodFor:
      'Anyone who wants the whole day from the first guest arriving to the dance floor filling up.',
    includes:
      'A full visual record of the event. A mix of detailed crowd scenes and individual portraits.',
    ctaLabel: 'Check availability',
  },
];

const FALLBACK_WORKSHOPS: Workshop[] = [
  {
    title: 'Hen and Stag Parties',
    price: '£35 per person',
    description:
      'Minimum 10 guests. Two hours. Everyone makes something by hand. Includes a glass of fizz per guest. Social, a little chaotic and genuinely more fun than most people expect.',
    ctaLabel: 'Book for your group',
  },
  {
    title: 'Baby Showers',
    price: '£200 flat rate',
    description:
      'A quieter, more considered session. We work together on something for the nursery. I come to you. Flat rate applies to any venue within one hour of Hastings.',
    ctaLabel: 'Book a session',
  },
];

const FALLBACK_STEPS: Step[] = [
  {
    title: 'Choose your package',
    description:
      'Pick the time and format that fits your event. Prices are fixed. What you see is what you pay.',
  },
  {
    title: 'Secure the date',
    description: 'Check availability and pay your deposit. That is your date locked in.',
  },
  {
    title: 'The day itself',
    description: 'I arrive with everything I need. You and your guests just enjoy it.',
  },
];

const FALLBACK_FAQS: FAQ[] = [
  {
    question: 'Do you travel?',
    answer:
      'Yes. I work across the UK. Travel within 30 miles of Hastings is included. Anything further is quoted at cost and always confirmed before you commit.',
  },
  {
    question: 'How long does a portrait take?',
    answer: 'Around five to eight minutes. Guests can watch or come back once it is done.',
  },
  {
    question: 'How many guests can you draw?',
    answer:
      'Roughly eight to ten per hour depending on detail and queue length. I will give you an honest estimate for your specific event before you book.',
  },
  {
    question: 'Is live illustration right for a corporate event?',
    answer:
      'Yes. Brand launches, client entertaining and office parties all work well. Live drawing is a natural talking point at events where people do not already know each other.',
  },
  {
    question: 'What if my event does not fit the packages?',
    answer: 'Get in touch. I am happy to discuss anything outside the standard options.',
  },
];

// ── Static JSON-LD ─────────────────────────────────────────────────────────────

const SERVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Live Event Illustration',
  provider: { '@id': 'https://nicolajones.art/#nicola-jones' },
  areaServed: 'GB',
  offers: [
    {
      '@type': 'Offer',
      name: '2 Hour Live Drawing Package',
      price: '450',
      priceCurrency: 'GBP',
    },
    {
      '@type': 'Offer',
      name: '4 Hour Live Drawing Package',
      price: '800',
      priceCurrency: 'GBP',
    },
    {
      '@type': 'Offer',
      name: '8 Hour Live Drawing Package',
      price: '1800',
      priceCurrency: 'GBP',
    },
  ],
};

// ── Component ─────────────────────────────────────────────────────────────────

export function CelebratePage() {
  const [pageData, setPageData] = useState<CelebratePageData>({});

  useEffect(() => {
    client
      .fetch<CelebratePageData | null>(
        `*[_type == "celebratePage"][0]{
          heroEyebrow, heroHeadline, heroBody, heroPrimaryCtaLabel, heroSecondaryCtaLabel,
          eventsHeading, eventsIntro,
          packages[]{ duration, price, goodFor, includes, ctaLabel },
          eventsClosingNote,
          workshopsHeading, workshopsIntro,
          workshops[]{ title, price, description, ctaLabel },
          howItWorksHeading,
          howItWorksSteps[]{ title, description },
          faqsHeading,
          faqs[]{ question, answer },
          closingCtaHeading, closingCtaBody, closingCtaLabel, closingCtaUrl
        }`
      )
      .then((data) => {
        if (data) setPageData(data);
      })
      .catch(console.error);
  }, []);

  // Effective values — Sanity data wins where present, fallback fills the rest
  const heroEyebrow = pageData.heroEyebrow || 'Live Illustration and Workshops';
  const heroHeadline =
    pageData.heroHeadline || 'Art that captures the energy of the room.';
  const heroBody =
    pageData.heroBody ||
    'I draw at weddings, parties, brand events and workshops: fast, by hand, in the moment. Guests leave with something real. Not a favour bag. Not a photo booth strip. An original piece of art made on the day, just for them.';
  const heroPrimaryCtaLabel = pageData.heroPrimaryCtaLabel || 'See the packages';
  const heroSecondaryCtaLabel = pageData.heroSecondaryCtaLabel || 'Book a workshop';

  const eventsHeading = pageData.eventsHeading || 'Event packages';
  const eventsIntro =
    pageData.eventsIntro ||
    'I draw your guests as the day happens. Each portrait takes around five to eight minutes. Here is how the packages work.';
  const packages = pageData.packages?.length ? pageData.packages : FALLBACK_PACKAGES;
  const eventsClosingNote =
    pageData.eventsClosingNote ||
    'Originals and additional prints available on request after the event. A5 prints from £40 unframed.';

  const workshopsHeading = pageData.workshopsHeading || 'Workshops';
  const workshopsIntro =
    pageData.workshopsIntro ||
    'I come to you or we find a space together. All materials are provided. No experience needed.';
  const workshops = pageData.workshops?.length ? pageData.workshops : FALLBACK_WORKSHOPS;

  const howItWorksHeading = pageData.howItWorksHeading || 'Three steps. No back-and-forth.';
  const steps = pageData.howItWorksSteps?.length
    ? pageData.howItWorksSteps
    : FALLBACK_STEPS;

  const faqsHeading = pageData.faqsHeading || 'Common questions';
  const faqs = pageData.faqs?.length ? pageData.faqs : FALLBACK_FAQS;

  const closingCtaHeading = pageData.closingCtaHeading || 'Something else in mind?';
  const closingCtaBody =
    pageData.closingCtaBody ||
    'If your celebration does not fit neatly into a package, just ask. I am always open to a conversation about what might work.';
  const closingCtaLabel = pageData.closingCtaLabel || 'Send me a message';
  const closingCtaUrl = pageData.closingCtaUrl || '/contact';

  // FAQPage JSON-LD — generated from effective FAQ data so it stays in sync with Sanity
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <div className="overflow-hidden">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── Zone 1: Hero ───────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 relative">
        <BlobShape
          color="#E8846F"
          className="absolute top-0 right-0 w-72 h-72 opacity-10 -translate-y-1/4 translate-x-1/4"
          variant={1}
        />
        <BlobShape
          color="#5D9B9B"
          className="absolute bottom-0 left-0 w-48 h-48 opacity-10 translate-y-1/4 -translate-x-1/4"
          variant={3}
        />

        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-[#5D9B9B] text-white text-sm font-['Plus_Jakarta_Sans'] px-5 py-2 rounded-full mb-6">
              {heroEyebrow}
            </span>

            <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-5xl lg:text-7xl text-[#4A3428] mb-8 leading-tight">
              {heroHeadline}
            </h1>

            <p className="text-xl text-[#6B7554] leading-relaxed mb-10">{heroBody}</p>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href="#events"
                className="px-8 py-3 rounded-full font-['Plus_Jakarta_Sans'] bg-[#E8846F] text-[#FAF8F5] hover:bg-[#5D9B9B] transition-colors duration-300 inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {heroPrimaryCtaLabel}
              </motion.a>
              <motion.a
                href="#workshops"
                className="px-8 py-3 rounded-full font-['Plus_Jakarta_Sans'] bg-transparent border-2 border-[#4A3428] text-[#4A3428] hover:bg-[#4A3428] hover:text-[#FAF8F5] transition-colors duration-300 inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {heroSecondaryCtaLabel}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Zone 2: Event Packages ─────────────────────────────────────────── */}
      <section id="events" className="py-20 bg-[#F5EFE8]">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl lg:text-5xl text-[#4A3428] mb-5">
              {eventsHeading}
            </h2>
            <p className="text-lg text-[#6B7554] max-w-2xl mx-auto">{eventsIntro}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {packages.map((pkg, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Card header */}
                <div className="bg-[#4A3428] px-7 py-6">
                  <p className="font-['Plus_Jakarta_Sans'] text-[#E8846F] text-sm uppercase tracking-wider mb-1">
                    {pkg.duration}
                  </p>
                  <p className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl text-white">
                    {pkg.price}
                  </p>
                </div>

                {/* Card body */}
                <div className="px-7 py-6 flex flex-col flex-1">
                  <div className="mb-5">
                    <p className="font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider text-[#E8846F] mb-2">
                      Good for
                    </p>
                    <p className="text-[#6B7554] leading-relaxed">{pkg.goodFor}</p>
                  </div>
                  <div className="mb-8">
                    <p className="font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider text-[#5D9B9B] mb-2">
                      What is included
                    </p>
                    <p className="text-[#6B7554] leading-relaxed">{pkg.includes}</p>
                  </div>
                  <div className="mt-auto">
                    <Link to="/contact">
                      <motion.div
                        className="flex items-center gap-2 text-[#E8846F] font-['Plus_Jakarta_Sans'] group cursor-pointer"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {pkg.ctaLabel}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="text-center text-sm italic text-[#6B7554]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {eventsClosingNote}
          </motion.p>
        </div>
      </section>

      {/* ── Zone 3: Workshops ──────────────────────────────────────────────── */}
      <section id="workshops" className="py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl lg:text-5xl text-[#4A3428] mb-5">
              {workshopsHeading}
            </h2>
            <p className="text-lg text-[#6B7554] max-w-2xl mx-auto">{workshopsIntro}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workshops.map((ws, i) => (
              <motion.div
                key={i}
                className="bg-[#F5EFE8] rounded-3xl overflow-hidden relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <BlobShape
                  color="#D8767D"
                  className="absolute top-0 right-0 w-40 h-40 opacity-10"
                  variant={i === 0 ? 2 : 3}
                />
                <div className="relative z-10 p-8 lg:p-10">
                  <div className="mb-6">
                    <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-2xl text-[#4A3428] mb-2">
                      {ws.title}
                    </h3>
                    <span className="inline-block bg-[#D8767D] text-white text-sm font-['Plus_Jakarta_Sans'] px-4 py-1 rounded-full">
                      {ws.price}
                    </span>
                  </div>
                  <p className="text-[#6B7554] leading-relaxed mb-8">{ws.description}</p>
                  <Link to="/contact">
                    <motion.div
                      className="flex items-center gap-2 text-[#D8767D] font-['Plus_Jakarta_Sans'] group cursor-pointer"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {ws.ctaLabel}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Zone 4: How It Works ───────────────────────────────────────────── */}
      <section className="py-20 bg-[#4A3428]">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.h2
            className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl lg:text-5xl text-white text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {howItWorksHeading}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className="w-14 h-14 rounded-full bg-[#E8846F] flex items-center justify-center mx-auto mb-6">
                  <span className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-xl text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-xl text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/70 leading-relaxed font-['Plus_Jakarta_Sans']">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Zone 5: FAQs ──────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.h2
            className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl lg:text-5xl text-[#4A3428] text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {faqsHeading}
          </motion.h2>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="border-b border-[#4A3428]/10 pb-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-lg text-[#4A3428] mb-2">
                  {faq.question}
                </h3>
                <p className="text-[#6B7554] leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Zone 6: Closing CTA ────────────────────────────────────────────── */}
      <section className="pb-20 px-6">
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            className="bg-gradient-to-br from-[#E8846F] to-[#D4725C] rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <BlobShape
              color="rgba(255,255,255,0.1)"
              className="absolute top-0 left-0 w-96 h-96"
              variant={1}
            />
            <BlobShape
              color="rgba(255,255,255,0.1)"
              className="absolute bottom-0 right-0 w-64 h-64"
              variant={2}
            />

            <div className="relative z-10">
              <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl lg:text-5xl text-white mb-6">
                {closingCtaHeading}
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-['Plus_Jakarta_Sans']">
                {closingCtaBody}
              </p>
              <Link to={closingCtaUrl}>
                <PillButton
                  variant="primary"
                  className="!bg-white !text-[#E8846F] hover:!bg-[#4A3428] hover:!text-white"
                >
                  {closingCtaLabel}
                </PillButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
