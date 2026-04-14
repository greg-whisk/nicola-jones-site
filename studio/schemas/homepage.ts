import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    // Hero
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'Main hero heading, e.g. "Murals. Theatre. Illustration."',
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
  ],
  preview: {
    prepare() {
      return { title: 'Homepage' }
    },
  },
})
