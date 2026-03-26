import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutContent',
  title: 'About Content',
  type: 'document',
  fields: [
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
