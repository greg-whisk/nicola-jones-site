import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'shopProduct',
  title: 'Shop Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'Displayed as a pill badge on the product page.',
      type: 'string',
      options: {
        list: [
          { title: 'Prints', value: 'prints' },
          { title: 'Original Art', value: 'original-art' },
          { title: 'Totes & Bags', value: 'tote-bags' },
          { title: 'Merch', value: 'merch' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (£)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'size',
      title: 'Size',
      description: 'Single fixed size string, e.g. "38 × 42 cm".',
      type: 'string',
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      description: 'Shows "✓ In stock" badge on the product page when enabled.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      description:
        '1–2 sentence marketing blurb shown under the product title. Max 200 characters.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'image',
      title: 'Primary Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      description: 'Additional images shown as thumbnails in the product carousel.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: 'productDetails',
      title: 'Product Details',
      description: 'Bullet-point list shown under the "Product Details" heading.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      description: 'Optional long-form description (rich text).',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: { title: 'name', media: 'image', subtitle: 'category' },
  },
})
