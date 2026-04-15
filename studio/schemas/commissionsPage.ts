import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'commissionsPage',
  title: 'Commissions Page',
  type: 'document',
  fields: [
    // Hero
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      description: 'e.g. "Murals | Scenic Art | Brand Illustration | Personal Commissions"',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'e.g. "Something made by hand, made for you."',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Subtext',
      type: 'text',
      rows: 3,
      description: 'Paragraph beneath the hero headline',
    }),
    // Commission types section
    defineField({
      name: 'typesSectionHeading',
      title: 'Commission Types Section Heading',
      type: 'string',
      description: 'e.g. "What kind of commission are you looking for?"',
    }),
    defineField({
      name: 'typesSectionIntro',
      title: 'Commission Types Section Intro (legacy)',
      type: 'text',
      rows: 2,
      description: 'No longer rendered on the page — kept for reference.',
    }),
    // Per-type label + description + pricing overrides (matched by id: murals / theatre / brand / personal)
    defineField({
      name: 'commissionTypes',
      title: 'Commission Types',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'id', title: 'ID (do not change)', type: 'string', description: 'Must be one of: murals, theatre, brand, personal' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'startingFrom', title: 'Starting Price', type: 'string', description: 'e.g. "Starting from £450"' }),
            defineField({ name: 'timeline', title: 'Timeline Note', type: 'string', description: 'e.g. "Most murals take two to five days on site."' }),
            defineField({ name: 'pricingFactors', title: 'Pricing Factors Note', type: 'text', rows: 2, description: 'What affects the price for this type.' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'id' },
          },
        },
      ],
      description: 'Override copy for each commission type. Add entries with id matching: murals, theatre, brand, personal.',
    }),
    // Process section
    defineField({
      name: 'processHeading',
      title: 'Process Section Heading',
      type: 'string',
      description: 'e.g. "The process. Straightforward."',
    }),
    defineField({
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Step Name', type: 'string' }),
            defineField({ name: 'text', title: 'Step Description', type: 'text', rows: 3 }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'text' },
          },
        },
      ],
      description: 'Override the four process steps. Leave empty to use the default steps.',
    }),
    // Pricing note section
    defineField({
      name: 'pricingNoteHeading',
      title: 'Pricing Note Heading',
      type: 'string',
      description: 'e.g. "A note on pricing."',
    }),
    defineField({
      name: 'pricingNoteBody',
      title: 'Pricing Note Body',
      type: 'text',
      rows: 4,
      description: 'The paragraph beneath the pricing note heading.',
    }),
    // CTA
    defineField({
      name: 'ctaHeadline',
      title: 'CTA Headline',
      type: 'string',
      description: 'e.g. "Have a wall, a brief or an idea?"',
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
      return { title: 'Commissions Page' }
    },
  },
})
