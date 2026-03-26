import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Building2, Palette, BookOpen, Theater, Heart, ArrowRight } from 'lucide-react';
import { BlobShape } from '../components/BlobShape';
import { PillButton } from '../components/PillButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const services = [
  { icon: Building2, title: 'Building Murals', description: 'Large-scale exterior and interior murals that transform spaces and tell stories', color: '#E8846F' },
  { icon: Palette, title: 'Brand Illustration', description: 'Custom character design and illustration systems that bring brands to life', color: '#5D9B9B' },
  { icon: BookOpen, title: 'Book Illustration', description: "Enchanting illustrations for children's books, graphic novels, and publications", color: '#D8767D' },
  { icon: Theater, title: 'Theatre & Events', description: 'Set design, backdrops, and illustrated environments for performances', color: '#6B7554' },
  { icon: Heart, title: 'Personal Commissions', description: 'One-of-a-kind pieces for your home, gifts, or special occasions', color: '#E8846F' },
];

const caseStudies = [
  {
    id: 1,
    title: 'Bloom Coffee Brand Identity',
    client: 'Bloom Coffee Co.',
    description: 'A complete illustration system featuring quirky coffee characters, hand-drawn patterns, and packaging designs that helped this local roaster stand out on shelves and online.',
    image: 'https://images.unsplash.com/photo-1571473569215-d86aa5a582c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2xkJTIwZ3JhcGhpYyUyMHBvc3RlciUyMGlsbHVzdHJhdGlvbiUyMHByaW50fGVufDF8fHx8MTc3NDUwNzEyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    stats: { duration: '6 weeks', deliverables: '25+ illustrations' }
  },
  {
    id: 2,
    title: "The Curious Cat Children's Book",
    client: 'Independent Publishing',
    description: 'A 32-page adventure filled with hand-painted watercolour illustrations, from character development through to final artwork and print-ready files.',
    image: 'https://images.unsplash.com/photo-1649750291589-8812197b698c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGJvb2slMjBpbGx1c3RyYXRpb24lMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzQ1MDcxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    stats: { duration: '4 months', deliverables: '40+ illustrations' }
  },
  {
    id: 3,
    title: 'Hastings Community Center Mural',
    client: 'Hastings Council',
    description: 'A 40-foot celebration of local history and community, created through workshops with residents to ensure it truly represented their stories and spirit.',
    image: 'https://images.unsplash.com/photo-1759936263498-325015569a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHdhbGwlMjBtdXJhbCUyMHVyYmFuJTIwYXJ0fGVufDF8fHx8MTc3NDUwNzExOHww&ixlib=rb-4.1.0&q=80&w=1080',
    stats: { duration: '3 months', deliverables: '1 epic mural' }
  }
];

export function CommissionsPage() {
  return (
    <div className="py-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="relative mb-20 text-center">
          <motion.h1
            className="font-['Fredoka'] text-5xl lg:text-7xl text-[#4A3428] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Let's Make Something Together
          </motion.h1>

          <motion.p
            className="text-xl text-[#6B7554] max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Whether it's a building-sized mural, a book full of characters, or a brand that needs personality — I'd love to bring your vision to life with bold, playful illustration.
          </motion.p>

          {/* Illustrated handshake scene */}
          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <svg viewBox="0 0 120 60" className="w-32 h-16">
              <circle cx="25" cy="30" r="22" fill="#E8846F" />
              <circle cx="18" cy="25" r="3" fill="#4A3428" />
              <circle cx="32" cy="25" r="3" fill="#4A3428" />
              <path d="M16 38 Q25 44 34 38" stroke="#4A3428" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="95" cy="30" r="22" fill="#5D9B9B" />
              <circle cx="88" cy="25" r="3" fill="#FAF8F5" />
              <circle cx="102" cy="25" r="3" fill="#FAF8F5" />
              <path d="M86 38 Q95 44 104 38" stroke="#FAF8F5" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M47 35 L73 35" stroke="#4A3428" strokeWidth="4" strokeLinecap="round" />
              <circle cx="60" cy="28" r="5" fill="#D8767D" />
            </svg>
          </motion.div>
        </div>

        {/* Services Grid - staggered offset */}
        <div className="mb-24">
          <h2 className="font-['Fredoka'] text-4xl text-[#4A3428] mb-12 text-center">What I Do</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
                style={{ marginTop: index % 2 === 1 ? '2rem' : 0 }}
              >
                <motion.div
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group"
                  whileHover={{ y: -5 }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: service.color }}
                  >
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-['Fredoka'] text-2xl text-[#4A3428] mb-3">{service.title}</h3>
                  <p className="text-[#6B7554] leading-relaxed">{service.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Case Studies */}
        <div className="mb-20">
          <h2 className="font-['Fredoka'] text-4xl text-[#4A3428] mb-4 text-center">Recent Projects</h2>
          <p className="text-xl text-[#6B7554] text-center mb-16 max-w-2xl mx-auto">
            Here's a peek at some recent collaborations and the magic we made together.
          </p>

          <div className="space-y-24">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <span className="inline-block bg-[#E8846F] text-white px-4 py-2 rounded-full text-sm mb-4">
                    {study.client}
                  </span>
                  <h3 className="font-['Fredoka'] text-3xl text-[#4A3428] mb-4">
                    {study.title}
                  </h3>
                  <p className="text-lg text-[#6B7554] leading-relaxed mb-6">
                    {study.description}
                  </p>
                  <div className="flex gap-8 mb-6">
                    <div>
                      <div className="text-sm text-[#6B7554] mb-1">Duration</div>
                      <div className="font-['Fredoka'] text-lg text-[#4A3428]">{study.stats.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#6B7554] mb-1">Deliverables</div>
                      <div className="font-['Fredoka'] text-lg text-[#4A3428]">{study.stats.deliverables}</div>
                    </div>
                  </div>
                  <button className="text-[#E8846F] hover:text-[#4A3428] transition-colors flex items-center gap-2 font-['Nunito']">
                    View full case study <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <BlobShape
                    color={index % 2 === 0 ? '#5D9B9B' : '#D8767D'}
                    className="absolute -top-10 -right-10 w-32 h-32 opacity-20 z-0"
                    variant={((index % 3) + 1) as 1 | 2 | 3}
                  />

                  <motion.div
                    className="rounded-3xl overflow-hidden shadow-2xl relative z-10"
                    whileHover={{ scale: 1.03, rotate: index % 2 === 0 ? 1 : -1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ImageWithFallback
                      src={study.image}
                      alt={study.title}
                      className="w-full h-auto"
                    />
                  </motion.div>

                  {/* Connecting character walking between case studies */}
                  {index < caseStudies.length - 1 && (
                    <motion.div
                      className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-20 hidden lg:block"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <svg viewBox="0 0 30 40" className="w-8 h-10">
                        <ellipse cx="15" cy="15" rx="12" ry="14" fill="#D8767D" />
                        <circle cx="11" cy="12" r="2" fill="#4A3428" />
                        <circle cx="19" cy="12" r="2" fill="#4A3428" />
                        <path d="M10 19 Q15 23 20 19" stroke="#4A3428" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        <line x1="15" y1="29" x2="15" y2="35" stroke="#D8767D" strokeWidth="3" strokeLinecap="round" />
                        <line x1="10" y1="38" x2="15" y2="35" stroke="#D8767D" strokeWidth="3" strokeLinecap="round" />
                        <line x1="20" y1="38" x2="15" y2="35" stroke="#D8767D" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-[#6B7554] to-[#4A3428] rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <BlobShape color="rgba(255,255,255,0.1)" className="absolute top-0 left-0 w-96 h-96" variant={1} />
          <BlobShape color="rgba(255,255,255,0.1)" className="absolute bottom-0 right-0 w-64 h-64" variant={2} />

          <div className="relative z-10">
            {/* Enthusiastic character */}
            <motion.div
              className="flex justify-center mb-8"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg viewBox="0 0 80 80" className="w-20 h-20">
                <circle cx="40" cy="40" r="35" fill="#E8846F" />
                <circle cx="30" cy="34" r="4" fill="#FAF8F5" />
                <circle cx="50" cy="34" r="4" fill="#FAF8F5" />
                <circle cx="31" cy="33" r="1.5" fill="#4A3428" />
                <circle cx="51" cy="33" r="1.5" fill="#4A3428" />
                <ellipse cx="40" cy="50" rx="8" ry="6" fill="#FAF8F5" />
                <line x1="5" y1="40" x2="-5" y2="20" stroke="#E8846F" strokeWidth="6" strokeLinecap="round" />
                <line x1="75" y1="40" x2="85" y2="20" stroke="#E8846F" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </motion.div>

            <h2 className="font-['Fredoka'] text-4xl lg:text-5xl text-white mb-6">
              Got a project in mind?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let's chat about your ideas, timelines, and how we can make something brilliant together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <PillButton variant="primary" className="!bg-[#E8846F] hover:!bg-white hover:!text-[#4A3428]">
                  Start a conversation
                </PillButton>
              </Link>
              <Link to="/portfolio">
                <PillButton variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-[#4A3428]">
                  View the portfolio
                </PillButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
