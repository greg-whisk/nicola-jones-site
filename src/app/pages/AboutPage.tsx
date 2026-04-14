import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { BlobShape } from '../components/BlobShape';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { client, urlFor } from '../../lib/sanity';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

const fallbackProcessSteps: ProcessStep[] = [
  { number: '01', title: 'Brief', description: 'We chat about your vision, needs, timeline, and budget. I ask loads of questions and probably doodle while we talk.', icon: '💬' },
  { number: '02', title: 'Sketches', description: "I send you rough concepts and sketches. We refine together until the idea feels just right — playful, bold, and uniquely you.", icon: '✏️' },
  { number: '03', title: 'Final Art', description: 'The magic happens! I create the final artwork with bold lines, warm colours, and all the character you deserve.', icon: '🎨' },
  { number: '04', title: 'Delivery', description: 'You receive high-res files, print-ready artwork, or (for murals) a freshly painted wall that makes people smile.', icon: '✨' },
];

const stepIcons = ['💬', '✏️', '🎨', '✨'];

const fallbackBio = [
  "Brighton born Nicola is an illustrator and decorative painter living in Hastings. She graduated with BA Hons in Illustration from NUCA 2012, and subsequently spent 10 years in London developing skills in scenic arts for immersive theatre, television and commercials.",
  "Her personal work is playful and jubilant with bold colour schemes. She is passionate about the positive change that creative input can bring about in community.",
  "Nicola annually designs and paints the theatrical backdrops for Shitfaced Shakespeare, the long-running hit comedy show. She has also delivered murals for Trees for Cities — the charity that creates edible playgrounds and green spaces in urban communities, with themes of woodlands, growing food, and clean air — working in weatherproof paint built to last outdoors.",
  "She digitally generates illustrations for graphic designers, producing fast-paced, versatile work for print and screen. From brand campaigns to editorial, the work is always bold, always warm, and always full of character.",
];

const fallbackPhoto = '/photo-placeholder.svg';

const clients = [
  { name: 'Shitfaced Shakespeare', slug: 'shitfaced-shakespeare' },
  { name: 'Trees for Cities', slug: 'trees-for-cities' },
  { name: 'Pinpoint Graphic Design', slug: 'pinpoint-graphic-design' },
  { name: 'Springtide', slug: 'springtide-branding' },
  { name: 'The Common Good', slug: 'the-common-good-live-event-illustration' },
  { name: 'Darling & Edge', slug: 'darling-and-edge' },
];

function blocksToLines(blocks: any[]): string[] {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b: any) => b._type === 'block')
    .map((b: any) => (b.children || []).map((c: any) => c.text || '').join(''))
    .filter((text: string) => text.trim().length > 0);
}

export function AboutPage() {
  const [bio, setBio] = useState<string[]>(fallbackBio);
  const [photo, setPhoto] = useState<string>(fallbackPhoto);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(fallbackProcessSteps);

  useEffect(() => {
    client
      .fetch<any>(`*[_type == "aboutContent"][0]{ bio, photo, processSteps }`)
      .then((data) => {
        if (!data) return;

        if (data.bio) {
          const lines = blocksToLines(data.bio);
          if (lines.length > 0) setBio(lines);
        }

        if (data.photo) {
          setPhoto(urlFor(data.photo).width(900).url());
        }

        if (data.processSteps && data.processSteps.length > 0) {
          setProcessSteps(
            data.processSteps.map((step: any, idx: number) => ({
              number: String(step.stepNumber ?? idx + 1).padStart(2, '0'),
              title: step.title || `Step ${idx + 1}`,
              description: step.description || '',
              icon: stepIcons[idx % stepIcons.length],
            }))
          );
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="py-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Two-column intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          {/* Photo with doodles */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img src="/nicola-jones-headshot.webp" alt="Nicola Jones" className="w-full h-full object-cover object-top" />
              </div>

              {/* Hand-drawn style frame doodles */}
              <BlobShape color="#E8846F" className="absolute -top-12 -right-12 w-32 h-32 opacity-30" variant={1} />
              <BlobShape color="#5D9B9B" className="absolute -bottom-8 -left-8 w-24 h-24 opacity-30" variant={2} />
            </div>
          </div>

          {/* Bio */}
          <div className="order-1 lg:order-2">
            <div className="flex justify-center mb-4">
              <img src="/nicola-jones-daffs-loop.png" alt="" aria-hidden="true" className="w-24 md:w-36 h-auto" />
            </div>

            <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-5xl lg:text-6xl text-[#4A3428] mb-6">
              Hello! I'm Nicola.
            </h1>

            <div className="space-y-4 text-lg text-[#6B7554] leading-relaxed">
              {bio.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-24">
          <motion.h2
            className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl text-[#4A3428] mb-4 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How We'll Work Together
          </motion.h2>
          <p className="text-xl text-[#6B7554] text-center mb-16 max-w-2xl mx-auto">
            Every project is different, but here's the general flow from "hello" to "ta-da!"
          </p>

          <div className="relative">
            {/* Wavy hand-drawn connecting line */}
            <svg className="absolute top-12 left-0 w-full h-8 pointer-events-none hidden lg:block" preserveAspectRatio="none">
              <path
                d="M 50 15 Q 200 0 350 15 T 650 15 T 950 15 T 1250 15"
                stroke="#E8846F"
                strokeWidth="3"
                fill="none"
                strokeDasharray="10 6"
                opacity="0.3"
                strokeLinecap="round"
              />
            </svg>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="text-center"
                >
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg relative z-10 mx-auto border-4 border-[#FAF8F5]">
                      <span className="text-4xl">{step.icon}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#E8846F] rounded-full flex items-center justify-center text-white font-['Plus_Jakarta_Sans'] font-heading-manrope text-sm z-20">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-2xl text-[#4A3428] mb-3">{step.title}</h3>
                  <p className="text-[#6B7554] leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Logos */}
        <motion.div
          className="bg-[#F5EFE8] rounded-3xl p-8 lg:p-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-2xl text-[#4A3428] mb-8 text-center">
            Proud to have worked with
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
            {clients.map((client, index) => (
              <motion.div
                key={client.slug}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link to={`/portfolio/${client.slug}`} className="block">
                  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow h-20 flex items-center justify-center">
                    <span className="font-['Plus_Jakarta_Sans'] text-sm text-center text-[#E8846F] hover:underline">{client.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fun fact */}
        <motion.div
          className="mt-16 text-center relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <BlobShape color="#D8767D" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-10" variant={3} />

          <p className="text-2xl text-[#4A3428] font-['Plus_Jakarta_Sans'] font-heading-manrope relative z-10">
            Brighton girl. Hastings life. Ten years of London scaffolding.
            <br />
            <span className="text-[#E8846F]">Now making big, bright things by the sea.</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
