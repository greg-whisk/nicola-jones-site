import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'celebratePage',
  title: 'Celebrate Page',
  type: 'document',
  fields: [
    // ── Hero ──────────────────────────────────────────────────
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      description: 'Small label above the headline, e.g. "Live Illustration and Workshops"',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'e.g. "Art that captures the energy of the room."',
    }),
    defineField({
      name: 'heroBody',
      title: 'Hero Body',
      type: 'text',
      rows: 4,
      description: 'Introductory paragraph beneath the headline.',
    }),
    defineField({
      name: 'heroPrimaryCtaLabel',
      title: 'Hero Primary CTA Label',
      type: 'string',
      description: 'e.g. "See the packages" — links to the #events section',
    }),
    defineField({
      name: 'heroSecondaryCtaLabel',
      title: 'Hero Secondary CTA Label',
      type: 'string',
      description: 'e.g. "Book a workshop" — links to the #workshops section',
    }),

    // ── Event Packages ────────────────────────────────────────
    defineField({
      name: 'eventsHeading',
      title: 'Events Section Heading',
      type: 'string',
      description: 'e.g. "Event packages"',
    }),
    defineField({
      name: 'eventsIntro',
      title: 'Events Section Intro',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'packages',
      title: 'Event Packages',
      type: 'array',
      description: 'The live-drawing packages. Minimum 3 entries recommended.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'duration', title: 'Duration', type: 'string', description: 'e.g. "2 Hours"' }),
            defineField({ name: 'price', title: 'Price', type: 'string', description: 'e.g. "£450"' }),
            defineField({ name: 'goodFor', title: 'Good For', type: 'text', rows: 2 }),
            defineField({ name: 'includes', title: 'What Is Included', type: 'text', rows: 3 }),
            defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string', description: 'e.g. "Check availability"' }),
          ],
          preview: {
            select: { title: 'duration', subtitle: 'price' },
          },
        },
      ],
    }),
    defineField({
      name: 'eventsClosingNote',
      title: 'Events Closing Note',
      type: 'string',
      description: 'Small italic note shown below the packages, e.g. "Originals and prints available on request."',
    }),

    // ── Workshops ─────────────────────────────────────────────
    defineField({
      name: 'workshopsHeading',
      title: 'Workshops Section Heading',
      type: 'string',
      description: 'e.g. "Workshops"',
    }),
    defineField({
      name: 'workshopsIntro',
      title: 'Workshops Section Intro',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'workshops',
      title: 'Workshops',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', description: 'e.g. "Hen and Stag Parties"' }),
            defineField({ name: 'price', title: 'Price', type: 'string', description: 'e.g. "£35 per person"' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string', description: 'e.g. "Book for your group"' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'price' },
          },
        },
      ],
    }),

    // ── How It Works ──────────────────────────────────────────
    defineField({
      name: 'howItWorksHeading',
      title: 'How It Works Heading',
      type: 'string',
      description: 'e.g. "Three steps. No back-and-forth."',
    }),
    defineField({
      name: 'howItWorksSteps',
      title: 'How It Works Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Step Title', type: 'string' }),
            defineField({ name: 'description', title: 'Step Description', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    }),

    // ── FAQs ──────────────────────────────────────────────────
    defineField({
      name: 'faqsHeading',
      title: 'FAQs Section Heading',
      type: 'string',
      description: 'e.g. "Common questions"',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string' }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3 }),
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
    }),

    // ── Closing CTA ───────────────────────────────────────────
    defineField({
      name: 'closingCtaHeading',
      title: 'Closing CTA Heading',
      type: 'string',
      description: 'e.g. "Something else in mind?"',
    }),
    defineField({
      name: 'closingCtaBody',
      title: 'Closing CTA Body',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'closingCtaLabel',
      title: 'Closing CTA Label',
      type: 'string',
      description: 'e.g. "Send me a message"',
    }),
    defineField({
      name: 'closingCtaUrl',
      title: 'Closing CTA URL',
      type: 'string',
      description: 'e.g. "/contact"',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Celebrate Page' }
    },
  },
})
