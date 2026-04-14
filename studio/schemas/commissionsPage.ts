import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'commissionsPage',
  title: 'Commissions Page',
  type: 'document',
  fields: [
    // Hero
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'e.g. "Let\'s Make Something Together"',
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
      description: 'e.g. "Commission Types"',
    }),
    defineField({
      name: 'typesSectionIntro',
      title: 'Commission Types Section Intro',
      type: 'text',
      rows: 2,
      description: 'e.g. "Here\'s a selection of recent commissions across my main areas of work."',
    }),
    // Per-type label + description overrides (matched by id: murals / theatre / brand / personal)
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
          ],
          preview: {
            select: { title: 'label', subtitle: 'id' },
          },
        },
      ],
      description: 'Override label/description for each commission type. Add entries with id matching: murals, theatre, brand, personal.',
    }),
    // CTA
    defineField({
      name: 'ctaHeadline',
      title: 'CTA Headline',
      type: 'string',
      description: 'e.g. "Got a project in mind?"',
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
