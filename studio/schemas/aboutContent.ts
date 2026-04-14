import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutContent',
  title: 'About Content',
  type: 'document',
  fields: [
    // Page copy
    defineField({
      name: 'pageHeading',
      title: 'Page Heading',
      type: 'string',
      description: 'e.g. "Hello! I\'m Nicola."',
    }),
    defineField({
      name: 'processSectionHeading',
      title: 'Process Section Heading',
      type: 'string',
      description: 'e.g. "How We\'ll Work Together"',
    }),
    defineField({
      name: 'processIntro',
      title: 'Process Section Intro',
      type: 'text',
      rows: 2,
      description: 'e.g. "Every project is different, but here\'s the general flow..."',
    }),
    defineField({
      name: 'funFact',
      title: 'Fun Fact (main)',
      type: 'text',
      rows: 2,
      description: 'First part of the fun-fact line at the bottom of the page, e.g. "Brighton girl. Hastings life. Ten years of London scaffolding."',
    }),
    defineField({
      name: 'funFactAccent',
      title: 'Fun Fact (accent)',
      type: 'string',
      description: 'Second part shown in coral, e.g. "Now making big, bright things by the sea."',
    }),
    // Bio + photo
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'step', title: 'Step Number', type: 'number' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'step' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { media: 'photo' },
    prepare() {
      return { title: 'About Content' }
    },
  },
})
