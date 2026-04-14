import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Star, Calendar, User } from 'lucide-react';
import { getProjectBySlug, getProjectNeighbours, type Project } from '../data/projects';
import { BlobShape } from '../components/BlobShape';
import { PillButton } from '../components/PillButton';
import { WavyDivider } from '../components/WavyDivider';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { client, urlFor } from '../../lib/sanity';

interface NavProject {
  slug: string;
  title: string;
  category: string;
  heroImage: string;
  accentColor: string;
}

const categoryMap: Record<string, Project['category']> = {
  illustration: 'Illustration',
  murals: 'Murals',
  books: 'Books',
  'theatre-events': 'Theatre & Events',
};

function mapSanityToProject(data: any): Project | null {
  if (!data) return null;
  return {
    id: 0,
    slug: data.slug || '',
    title: data.title || '',
    category: categoryMap[data.category] || data.category || 'Illustration',
    client: data.client || '',
    year: data.year || '',
    heroImage: data.heroImage
      ? urlFor(data.heroImage).width(1200).url()
      : data.mainImage
      ? urlFor(data.mainImage).width(1200).url()
      : '',
    summary: data.summary || '',
    brief: data.brief || '',
    approach: data.approach || '',
    outcome: data.outcome || '',
    gallery: (data.gallery || []).map((img: any) => ({
      src: img.asset ? urlFor(img).width(800).url() : '',
      alt: img.alt || '',
      caption: img.caption || undefined,
    })),
    stats: data.stats || [],
    testimonial: data.testimonial?.quote
      ? {
          quote: data.testimonial.quote,
          author: data.testimonial.author || '',
          role: data.testimonial.role || '',
        }
      : undefined,
    nextProjectSlug: data.nextProjectSlug || undefined,
    accentColor: data.accentColor || '#5D9B9B',
  };
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const staticNeighbours = slug ? getProjectNeighbours(slug) : { prev: undefined, next: undefined };

  const toNavProject = (p: Project | undefined): NavProject | null =>
    p ? { slug: p.slug, title: p.title, category: p.category, heroImage: p.heroImage, accentColor: p.accentColor } : null;

  const [project, setProject] = useState<Project | null>(
    slug ? getProjectBySlug(slug) || null : null
  );
  const [prevNavProject, setPrevNavProject] = useState<NavProject | null>(toNavProject(staticNeighbours.prev));
  const [nextNavProject, setNextNavProject] = useState<NavProject | null>(toNavProject(staticNeighbours.next));

  useEffect(() => {
    if (!slug) return;
    client
      .fetch<any>(
        `*[_type == "portfolioProject" && slug.current == $slug][0]{
          _id, title, "slug": slug.current, category, client, year,
          accentColor, brief, approach, outcome, summary,
          heroImage, mainImage,
          stats[]{label, value},
          gallery[]{asset->, alt, caption},
          testimonial{quote, author, role},
          nextProjectSlug, featured
        }`,
        { slug }
      )
      .then((data) => {
        const mapped = mapSanityToProject(data);
        if (mapped && mapped.title) setProject(mapped);
      })
      .catch(console.error);

    // Fetch all projects for prev/next navigation
    client
      .fetch<NavProject[]>(
        `*[_type == "portfolioProject"] | order(_createdAt asc) {
          "slug": slug.current, title, category, accentColor,
          "heroImage": coalesce(heroImage, mainImage)
        }`
      )
      .then((all) => {
        if (!all?.length) return;
        // heroImage is a reference object; resolve to URL
        const resolved = all.map((p) => ({
          ...p,
          heroImage: p.heroImage
            ? (typeof p.heroImage === 'string' ? p.heroImage : urlFor(p.heroImage).width(800).url())
            : '',
          accentColor: p.accentColor || '#5D9B9B',
        }));
        const idx = resolved.findIndex((p) => p.slug === slug);
        if (idx === -1) return;
        const total = resolved.length;
        setPrevNavProject(resolved[(idx - 1 + total) % total]);
        setNextNavProject(resolved[(idx + 1) % total]);
      })
      .catch(console.error);
  }, [slug]);

  if (!project) {
    return (
      <div className="py-40 text-center">
        <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-5xl text-[#4A3428] mb-4">Project not found</h1>
        <p className="text-xl text-[#6B7554] mb-8">
          Looks like this project wandered off. Let's find it in the portfolio.
        </p>
        <Link to="/portfolio">
          <PillButton variant="primary">Back to Portfolio</PillButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        {/* Back button */}
        <div className="max-w-[1440px] mx-auto px-6 pt-8 relative z-20">
          <button
            onClick={() => navigate('/portfolio')}
            className="flex items-center gap-2 text-[#6B7554] hover:text-[#E8846F] transition-colors font-['Plus_Jakarta_Sans'] group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </button>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 pt-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div>
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span
                  className="inline-block text-white px-4 py-1.5 rounded-full text-sm font-['Plus_Jakarta_Sans']"
                  style={{ backgroundColor: project.accentColor }}
                >
                  {project.category}
                </span>
                {project.year && (
                  <span className="text-[#6B7554] text-sm flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {project.year}
                  </span>
                )}
                {project.client && (
                  <span className="text-[#6B7554] text-sm flex items-center gap-1">
                    <User className="w-4 h-4" /> {project.client}
                  </span>
                )}
              </div>

              <h1 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-5xl lg:text-6xl text-[#4A3428] mb-6 leading-[1.1]">
                {project.title}
              </h1>

              {project.summary && (
                <p className="text-xl text-[#6B7554] leading-relaxed">
                  {project.summary}
                </p>
              )}
            </div>

            {/* Hero Image */}
            <div className="relative">
              <BlobShape
                color={project.accentColor}
                className="absolute -top-12 -right-12 w-48 h-48 opacity-20"
                variant={1}
              />
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl hover:rotate-0 transition-transform duration-500" style={{ transform: 'rotate(1deg)' }}>
                <ImageWithFallback
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-auto"
                />
              </div>

              {/* Breakout character */}
              <motion.div
                className="absolute -bottom-6 -left-6 z-20"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <svg viewBox="0 0 44 44" className="w-14 h-14 drop-shadow-lg">
                  <circle cx="22" cy="22" r="20" fill={project.accentColor} />
                  <circle cx="16" cy="18" r="3" fill="#FAF8F5" />
                  <circle cx="28" cy="18" r="3" fill="#FAF8F5" />
                  <circle cx="16.5" cy="17.5" r="1.2" fill="#4A3428" />
                  <circle cx="28.5" cy="17.5" r="1.2" fill="#4A3428" />
                  <path d="M15 28 Q22 34 29 28" stroke="#4A3428" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      {project.stats.length > 0 && (
        <section className="py-12" style={{ backgroundColor: `${project.accentColor}12` }}>
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {project.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="text-center"
                >
                  <div className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl lg:text-4xl text-[#4A3428] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#6B7554]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brief / Approach / Outcome */}
      {(project.brief || project.approach || project.outcome) && (
        <section className="py-20">
          <div className="max-w-[900px] mx-auto px-6">
            <motion.div
              className="space-y-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {project.brief && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: project.accentColor }}>
                      <span className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-sm">01</span>
                    </div>
                    <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl text-[#4A3428]">The Brief</h2>
                  </div>
                  <p className="text-lg text-[#6B7554] leading-relaxed pl-[52px]">
                    {project.brief}
                  </p>
                </div>
              )}

              {project.approach && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: project.accentColor }}>
                      <span className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-sm">02</span>
                    </div>
                    <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl text-[#4A3428]">The Approach</h2>
                  </div>
                  <p className="text-lg text-[#6B7554] leading-relaxed pl-[52px]">
                    {project.approach}
                  </p>
                </div>
              )}

              {project.outcome && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: project.accentColor }}>
                      <span className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-sm">03</span>
                    </div>
                    <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl text-[#4A3428]">The Outcome</h2>
                  </div>
                  <p className="text-lg text-[#6B7554] leading-relaxed pl-[52px]">
                    {project.outcome}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      <WavyDivider color="#F5EFE8" />

      {/* Gallery */}
      {project.gallery.length > 0 && (
        <section className="bg-[#F5EFE8] py-20">
          <div className="max-w-[1440px] mx-auto px-6">
            <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl text-[#4A3428] mb-12 text-center">
              Project Gallery
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.gallery.map((img, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {index % 2 === 0 && (
                    <BlobShape
                      color={project.accentColor}
                      className="absolute -top-6 -right-6 w-20 h-20 opacity-20 z-10"
                      variant={((index % 3) + 1) as 1 | 2 | 3}
                    />
                  )}

                  <motion.div
                    className="rounded-3xl overflow-hidden shadow-lg"
                    whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? 1 : -1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ImageWithFallback
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-auto"
                    />
                  </motion.div>

                  {img.caption && (
                    <p className="mt-3 text-sm text-[#6B7554] text-center italic font-['Plus_Jakarta_Sans']">
                      {img.caption}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <WavyDivider color="#FAF8F5" flip />

      {/* Testimonial */}
      {project.testimonial && (
        <section className="py-20 relative">
          <BlobShape color={project.accentColor} className="absolute top-10 right-10 w-40 h-40 opacity-[0.07]" variant={2} />

          <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
            <div className="flex justify-center gap-1.5 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" style={{ color: project.accentColor }} />
              ))}
            </div>

            <blockquote className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-2xl lg:text-3xl text-[#4A3428] mb-6 leading-relaxed">
              "{project.testimonial.quote}"
            </blockquote>

            <div className="text-[#6B7554]">
              <span className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-lg">{project.testimonial.author}</span>
              <br />
              <span className="text-sm">{project.testimonial.role}</span>
            </div>

            {/* Character reacting */}
            <motion.div
              className="absolute -right-2 bottom-4 hidden lg:block"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <svg viewBox="0 0 36 36" className="w-10 h-10">
                <circle cx="18" cy="18" r="16" fill={project.accentColor} />
                <circle cx="13" cy="15" r="2" fill="#FAF8F5" />
                <circle cx="23" cy="15" r="2" fill="#FAF8F5" />
                <ellipse cx="18" cy="23" rx="4" ry="3" fill="#FAF8F5" />
              </svg>
            </motion.div>
          </div>
        </section>
      )}

      {/* More Projects */}
      {(prevNavProject || nextNavProject) && (
        <section className="py-16 bg-[#F5EFE8]">
          <div className="max-w-[1440px] mx-auto px-6">
            <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-4xl text-[#4A3428] mb-10 text-center">More Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prevNavProject && (
                <Link to={`/portfolio/${prevNavProject.slug}`}>
                  <motion.div
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative overflow-hidden aspect-[16/9]">
                      <ImageWithFallback
                        src={prevNavProject.heroImage}
                        alt={prevNavProject.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span
                        className="absolute top-4 left-4 text-white text-xs px-3 py-1 rounded-full font-['Plus_Jakarta_Sans']"
                        style={{ backgroundColor: prevNavProject.accentColor }}
                      >
                        {prevNavProject.category}
                      </span>
                      <span className="absolute top-4 right-4 bg-white/80 text-[#6B7554] text-xs px-3 py-1 rounded-full font-['Plus_Jakarta_Sans'] flex items-center gap-1">
                        <ArrowLeft className="w-3 h-3" /> Previous
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-2xl text-[#4A3428] group-hover:text-[#E8846F] transition-colors">
                        {prevNavProject.title}
                      </h3>
                    </div>
                  </motion.div>
                </Link>
              )}
              {nextNavProject && (
                <Link to={`/portfolio/${nextNavProject.slug}`}>
                  <motion.div
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative overflow-hidden aspect-[16/9]">
                      <ImageWithFallback
                        src={nextNavProject.heroImage}
                        alt={nextNavProject.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span
                        className="absolute top-4 left-4 text-white text-xs px-3 py-1 rounded-full font-['Plus_Jakarta_Sans']"
                        style={{ backgroundColor: nextNavProject.accentColor }}
                      >
                        {nextNavProject.category}
                      </span>
                      <span className="absolute top-4 right-4 bg-white/80 text-[#6B7554] text-xs px-3 py-1 rounded-full font-['Plus_Jakarta_Sans'] flex items-center gap-1">
                        Next <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-2xl text-[#4A3428] group-hover:text-[#E8846F] transition-colors">
                        {nextNavProject.title}
                      </h3>
                    </div>
                  </motion.div>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <h2 className="font-['Plus_Jakarta_Sans'] font-heading-manrope text-3xl text-[#4A3428] mb-4">
            Like what you see?
          </h2>
          <p className="text-lg text-[#6B7554] mb-8 max-w-xl mx-auto">
            Whether you need a mural, a book illustrated, or a brand brought to life — let's make something brilliant together.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/commissions">
              <PillButton variant="accent">Start a commission</PillButton>
            </Link>
            <Link to="/portfolio">
              <PillButton variant="outline">View more work</PillButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
