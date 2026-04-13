export default {
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    {
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
    },
    {
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'pathwayCard1Title',
      title: 'Pathway Card 1 Title',
      type: 'string',
    },
    {
      name: 'pathwayCard1Description',
      title: 'Pathway Card 1 Description',
      type: 'text',
    },
    {
      name: 'pathwayCard2Title',
      title: 'Pathway Card 2 Title',
      type: 'string',
    },
    {
      name: 'pathwayCard2Description',
      title: 'Pathway Card 2 Description',
      type: 'text',
    },
    {
      name: 'pathwayCard3Title',
      title: 'Pathway Card 3 Title',
      type: 'string',
    },
    {
      name: 'pathwayCard3Description',
      title: 'Pathway Card 3 Description',
      type: 'text',
    },
    {
      name: 'testimonialQuote',
      title: 'Testimonial Quote',
      type: 'text',
    },
    {
      name: 'testimonialAuthor',
      title: 'Testimonial Author',
      type: 'string',
    },
    {
      name: 'testimonialRole',
      title: 'Testimonial Role',
      type: 'string',
    },
    {
      name: 'aboutTeaserText',
      title: 'About Teaser Text',
      type: 'text',
    },
    {
      name: 'aboutTeaserImage',
      title: 'About Teaser Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'ctaHeadline',
      title: 'CTA Headline',
      type: 'string',
    },
  ],
}
