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
      name: 'price',
      title: 'Price (£)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Prints', value: 'prints' },
          { title: 'Original Art', value: 'original-art' },
          { title: 'Tote Bags', value: 'tote-bags' },
          { title: 'Merch', value: 'merch' },
          { title: 'Live Painting', value: 'live-painting' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'productDetails',
      title: 'Product Details',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: [
          { title: 'A1 (594 × 841 mm)', value: 'a1' },
          { title: 'A2 (420 × 594 mm)', value: 'a2' },
          { title: 'A3 (297 × 420 mm)', value: 'a3' },
          { title: 'A4 (210 × 297 mm)', value: 'a4' },
          { title: 'Original', value: 'original' },
          { title: 'One Size', value: 'one-size' },
        ],
      },
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'name', media: 'image', subtitle: 'category' },
  },
})
