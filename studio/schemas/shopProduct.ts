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
          { title: 'Originals', value: 'originals' },
          { title: 'Prints', value: 'prints' },
          { title: 'Gifts', value: 'gifts' },
          { title: 'Apparel', value: 'apparel' },
          { title: 'Live Painting', value: 'live-painting' },
          // Legacy values — kept so existing product data is not lost
          { title: 'Original Art (legacy)', value: 'original-art' },
          { title: 'Tote Bags (legacy)', value: 'tote-bags' },
          { title: 'Merch (legacy)', value: 'merch' },
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
    defineField({
      name: 'fulfillment',
      title: 'Fulfillment',
      type: 'string',
      options: {
        list: [
          { title: 'Studio (Hastings)', value: 'studio' },
          { title: 'ThePrintSpace', value: 'theprintspace' },
        ],
      },
      description: 'Controls which fulfillment note appears on the product page.',
    }),
    defineField({
      name: 'shippingIncluded',
      title: 'Free UK Shipping Included',
      type: 'boolean',
      description: 'When true, shows "Free UK shipping included" instead of the orders-over-£25 note.',
      initialValue: false,
    }),
    defineField({
      name: 'allowCustomNotes',
      title: 'Allow Customisation Notes',
      type: 'boolean',
      description: 'When true, the product page shows a customisation notes textarea.',
      initialValue: false,
    }),
    defineField({
      name: 'customNotesLabel',
      title: 'Customisation Notes Label',
      type: 'string',
      description: 'Label shown above the customisation notes field (e.g. "Customisation notes (themes, names, colours)").',
    }),
    defineField({
      name: 'creativehubSku',
      title: 'CreativeHub SKU',
      type: 'string',
      description: 'SKU from CreativeHub/ThePrintSpace for fulfilment. Required for products with ThePrintSpace fulfillment.',
    }),
  ],
  preview: {
    select: { title: 'name', media: 'image', subtitle: 'category' },
  },
})
