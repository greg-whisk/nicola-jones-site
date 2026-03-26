import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './studio/schemas'

export default defineConfig({
  name: 'nicola-jones-site',
  title: 'Nicola Jones Site',

  projectId: 'fnwcgtif',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
