import { useState, useEffect } from 'react';
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
  "Nicola designs backdrops for Shitfaced Shakespeare annually, creating the vivid theatrical sets that bring their chaotic productions to life. She has painted murals for Trees for Cities, bringing colour and joy to urban green spaces across the UK.",
  "Her digital illustration work extends to collaborations with graphic designers, producing bold brand assets and editorial illustrations that translate seamlessly across print and screen.",
];

const fallbackPhoto = 'https://images.unsplash.com/photo-1752649935691-ac99478aaa56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGFydGlzdCUyMHBhaW50aW5nJTIwc3R1ZGlvJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzc0NTA3MTE4fDA&ixlib=rb-4.1.0&q=80&w=1080';

const clients = ['Shitfaced Shakespeare', 'Trees for Cities', 'Pinpoint Graphic Design', 'Springtide', 'The Common Good', 'Darling & Edge'];

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
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={photo}
                  alt="Nicola Jones in her studio"
                  className="w-full h-auto"
                />
              </div>

              {/* Hand-drawn style frame doodles */}
              <BlobShape color="#E8846F" className="absolute -top-12 -right-12 w-32 h-32 opacity-30" variant={1} />
              <BlobShape color="#5D9B9B" className="absolute -bottom-8 -left-8 w-24 h-24 opacity-30" variant={2} />

              {/* Character peeking around edges */}
              <motion.div
                className="absolute -top-6 -left-4 z-20"
                animate={{ rotate: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <svg viewBox="0 0 40 40" className="w-12 h-12 drop-shadow-lg">
                  <circle cx="20" cy="20" r="18" fill="#D8767D" />
                  <circle cx="15" cy="17" r="2.5" fill="#FAF8F5" />
                  <circle cx="25" cy="17" r="2.5" fill="#FAF8F5" />
                  <circle cx="15.5" cy="16.5" r="1" fill="#4A3428" />
                  <circle cx="25.5" cy="16.5" r="1" fill="#4A3428" />
                  <path d="M14 25 Q20 30 26 25" stroke="#4A3428" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-8 -right-6 z-20"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg viewBox="0 0 35 35" className="w-10 h-10 drop-shadow-lg">
                  <circle cx="17.5" cy="17.5" r="16" fill="#E8846F" />
                  <circle cx="12" cy="14" r="2" fill="#4A3428" />
                  <circle cx="23" cy="14" r="2" fill="#4A3428" />
                  <path d="M11 22 Q17.5 27 24 22" stroke="#4A3428" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-4 z-20"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <svg viewBox="0 0 28 28" className="w-8 h-8 drop-shadow-lg">
                  <circle cx="14" cy="14" r="13" fill="#5D9B9B" />
                  <circle cx="10" cy="11" r="1.5" fill="#FAF8F5" />
                  <circle cx="18" cy="11" r="1.5" fill="#FAF8F5" />
                  <ellipse cx="14" cy="18" rx="3" ry="2" fill="#FAF8F5" />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-['Fredoka'] text-5xl lg:text-6xl text-[#4A3428] mb-6">
              Hello! I'm Nicola.
            </h1>

            <div className="space-y-4 text-lg text-[#6B7554] leading-relaxed">
              {bio.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Process Section */}
        <div className="mb-24">
          <motion.h2
            className="font-['Fredoka'] text-4xl text-[#4A3428] mb-4 text-center"
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
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#E8846F] rounded-full flex items-center justify-center text-white font-['Fredoka'] text-sm z-20">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="font-['Fredoka'] text-2xl text-[#4A3428] mb-3">{step.title}</h3>
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
          <h3 className="font-['Fredoka'] text-2xl text-[#4A3428] mb-8 text-center">
            Proud to have worked with
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
            {clients.map((clientName, index) => (
              <motion.div
                key={clientName}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow h-20 flex items-center justify-center">
                  <span className="text-[#6B7554] font-['Nunito'] text-sm text-center opacity-60">{clientName}</span>
                </div>
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

          <p className="text-2xl text-[#4A3428] font-['Fredoka'] relative z-10">
            Fun fact: I've painted over 200 seagulls in my career.
            <br />
            <span className="text-[#E8846F]">Not one of them has been grumpy.</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
