import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'shopPage',
  title: 'Shop Page',
  type: 'document',
  fields: [
    defineField({ name: 'heroHeading', title: 'Hero Heading', type: 'string' }),
    defineField({ name: 'heroSubheading', title: 'Hero Subheading', type: 'text', rows: 3 }),
    defineField({
      name: 'trustNote',
      title: 'Trust Note',
      type: 'text',
      rows: 2,
      description: 'Text shown below the product grid',
    }),
    defineField({ name: 'closingCtaHeading', title: 'Closing CTA Heading', type: 'string' }),
    defineField({ name: 'closingCtaBody', title: 'Closing CTA Body', type: 'text', rows: 3 }),
  ],
  preview: {
    prepare() {
      return { title: 'Shop Page' }
    },
  },
})
