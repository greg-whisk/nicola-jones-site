import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    // Hero
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
      description: 'Small label above the headline, e.g. "Illustrator & Decorative Painter"',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'Main hero heading, e.g. "Murals. Theatre. Illustration."',
    }),
    defineField({
      name: 'heroHeadlineAccent',
      title: 'Hero Headline — Accent Line',
      type: 'string',
      description: 'Second line shown in coral/orange, e.g. "All drawn with a grin."',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      rows: 3,
      description: 'Paragraph beneath the headline',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Main illustration shown on the right side of the hero',
    }),
    // Pathway cards
    defineField({
      name: 'pathwaySectionHeading',
      title: 'Pathway Section Heading',
      type: 'string',
      description: 'e.g. "Where would you like to go?"',
    }),
    defineField({
      name: 'pathwayCard1Title',
      title: 'Pathway Card 1 — Title',
      type: 'string',
      description: 'e.g. "Grab a Print"',
    }),
    defineField({
      name: 'pathwayCard1Description',
      title: 'Pathway Card 1 — Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'pathwayCard2Title',
      title: 'Pathway Card 2 — Title',
      type: 'string',
      description: 'e.g. "Commission Nicola"',
    }),
    defineField({
      name: 'pathwayCard2Description',
      title: 'Pathway Card 2 — Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'pathwayCard3Title',
      title: 'Pathway Card 3 — Title',
      type: 'string',
      description: 'e.g. "Browse the Portfolio"',
    }),
    defineField({
      name: 'pathwayCard3Description',
      title: 'Pathway Card 3 — Description',
      type: 'text',
      rows: 2,
    }),
    // Featured work
    defineField({
      name: 'featuredWork',
      title: 'Featured Work',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'portfolioProject' }] }],
      description: 'Up to 8 portfolio projects shown in the Featured Work strip',
      validation: (Rule) => Rule.max(8),
    }),
    // Clients marquee
    defineField({
      name: 'clientNames',
      title: 'Client Marquee',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Names shown in the scrolling "Trusted by" marquee',
    }),
    // CTA
    defineField({
      name: 'ctaHeadline',
      title: 'CTA Headline',
      type: 'string',
      description: 'Headline in the bottom call-to-action section',
    }),
    defineField({
      name: 'ctaSubtext',
      title: 'CTA Subtext',
      type: 'text',
      rows: 3,
    }),
    // Shop section
    defineField({
      name: 'shopSectionIntro',
      title: 'Shop Section Intro',
      type: 'text',
      rows: 2,
      description: 'Short line beneath "From the Shop" heading, e.g. "Prints, tote bags, stickers…"',
    }),
    // Action Cards
    defineField({
      name: 'actionCardsHeading',
      title: 'Action Cards — Heading (eyebrow)',
      type: 'string',
      description: 'e.g. "What are you here for?"',
    }),
    defineField({
      name: 'actionCard1',
      title: 'Action Card 1 — Celebrate',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'ctaLabel', title: 'CTA Label', type: 'string' },
        { name: 'ctaUrl', title: 'CTA URL', type: 'string' },
      ],
    }),
    defineField({
      name: 'actionCard2',
      title: 'Action Card 2 — Commission',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'ctaLabel', title: 'CTA Label', type: 'string' },
        { name: 'ctaUrl', title: 'CTA URL', type: 'string' },
      ],
    }),
    defineField({
      name: 'actionCard3',
      title: 'Action Card 3 — Shop',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'ctaLabel', title: 'CTA Label', type: 'string' },
        { name: 'ctaUrl', title: 'CTA URL', type: 'string' },
      ],
    }),
    // The Promise
    defineField({
      name: 'promiseHeading',
      title: 'The Promise — Heading',
      type: 'string',
      description: 'e.g. "Hiring an artist should not involve three emails and a waiting game."',
    }),
    defineField({
      name: 'promiseBody',
      title: 'The Promise — Body',
      type: 'text',
      rows: 4,
      description: 'Short paragraph beneath the promise heading',
    }),
    // Testimonials (3-card grid)
    defineField({
      name: 'testimonialsHeading',
      title: 'Testimonials — Heading (eyebrow)',
      type: 'string',
      description: 'e.g. "What clients say"',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'quote', title: 'Quote', type: 'text' },
            { name: 'author', title: 'Author Name', type: 'string' },
            { name: 'role', title: 'Role / Company', type: 'string' },
          ],
          preview: {
            select: { title: 'author', subtitle: 'quote' },
          },
        },
      ],
      description: 'Client testimonials shown as a 3-card grid on the homepage',
      validation: (Rule) => Rule.max(6),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Homepage' }
    },
  },
})
