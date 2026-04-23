import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', title: 'Platform', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Studio location shown in the footer and contact page, e.g. "Hastings, East Sussex"',
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'string',
    }),
    // Contact page copy
    defineField({
      name: 'contactPageHeading',
      title: 'Contact Page Heading',
      type: 'string',
      description: 'e.g. "Say Hello"',
    }),
    defineField({
      name: 'contactPageIntro',
      title: 'Contact Page Intro',
      type: 'text',
      rows: 2,
      description: 'e.g. "Have a project in mind? A question? Or just want to chat about art? Drop me a line!"',
    }),
    defineField({
      name: 'responseTimeNote',
      title: 'Response Time Note',
      type: 'text',
      rows: 2,
      description: 'Closing note on the contact page, e.g. "I typically respond within 24-48 hours..."',
    }),
    defineField({
      name: 'newsletterHeading',
      title: 'Newsletter Heading',
      type: 'string',
      description: 'Heading for the footer newsletter signup',
    }),
    defineField({
      name: 'newsletterBody',
      title: 'Newsletter Body',
      type: 'text',
      rows: 2,
      description: 'Body text for the footer newsletter signup',
    }),
    defineField({
      name: 'logo',
      title: 'Logo (SVG)',
      type: 'file',
      description: 'Site logo — SVG with transparent background',
      options: { accept: 'image/svg+xml' },
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
