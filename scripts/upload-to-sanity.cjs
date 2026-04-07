/**
 * Upload processed images and create Sanity documents for:
 * - portfolioProject (all projects)
 * - shopProduct (all shop items)
 * - aboutContent
 * - siteSettings
 *
 * Run from project root:
 *   arch -arm64 /usr/local/bin/node scripts/upload-to-sanity.js
 */

const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

const MANIFEST_PATH = '/tmp/nicola-jones-processed/manifest.json'
const LOGO_SVG_PATH = "/Users/gregstevenson/Downloads/Nicola_Jones_Website_Content/Website Content (Nicola Jones)/Nicola Jones Logo and Bio/nicola-jones-logo.svg"

const TOKEN = 'skhA1leU5BkRC4T1d3odLvxfjebp4vTBq69PxCsp62S2NOWvdggHh6pdIK9N60iyTV92lLZNGJxPlxi1j'

const client = createClient({
  projectId: 'fnwcgtif',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: TOKEN,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function uploadImage(filePath, label) {
  if (!filePath || !fs.existsSync(filePath)) {
    console.log(`  SKIP upload (no file): ${filePath}`)
    return null
  }
  const stream = fs.createReadStream(filePath)
  const filename = path.basename(filePath)
  console.log(`  Uploading ${label || filename}...`)
  try {
    const asset = await client.assets.upload('image', stream, {
      filename,
      contentType: 'image/webp',
    })
    console.log(`    -> Asset ID: ${asset._id}`)
    return asset
  } catch (err) {
    console.error(`  ERROR uploading ${filename}:`, err.message)
    return null
  }
}

async function uploadSvg(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    console.log(`  SKIP SVG upload (no file): ${filePath}`)
    return null
  }
  const stream = fs.createReadStream(filePath)
  const filename = path.basename(filePath)
  console.log(`  Uploading SVG: ${filename}...`)
  try {
    const asset = await client.assets.upload('file', stream, {
      filename,
      contentType: 'image/svg+xml',
    })
    console.log(`    -> Asset ID: ${asset._id}`)
    return asset
  } catch (err) {
    console.error(`  ERROR uploading SVG ${filename}:`, err.message)
    return null
  }
}

function imageRef(asset) {
  if (!asset) return undefined
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }
}

function fileRef(asset) {
  if (!asset) return undefined
  return {
    _type: 'file',
    asset: { _type: 'reference', _ref: asset._id },
  }
}

function blockText(text) {
  return [
    {
      _type: 'block',
      _key: `block-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `span-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          text,
          marks: [],
        },
      ],
    },
  ]
}

async function deleteExistingDocs(type) {
  console.log(`  Checking for existing ${type} documents...`)
  const existing = await client.fetch(`*[_type == "${type}"]._id`)
  if (existing.length > 0) {
    console.log(`  Deleting ${existing.length} existing ${type} docs...`)
    const mutations = existing.map(id => ({ delete: { id } }))
    await client.mutate(mutations)
  }
}

// ─── Portfolio Projects ────────────────────────────────────────────────────────

async function createPortfolioProject(entry) {
  const { slug, title, category, featured, description, images } = entry

  console.log(`\n[Portfolio] ${title} (${images.length} images)`)

  // Upload all images
  const uploadedImages = []
  for (let i = 0; i < images.length; i++) {
    const asset = await uploadImage(images[i], `${slug} image ${i + 1}/${images.length}`)
    if (asset) uploadedImages.push(asset)
  }

  const mainImageAsset = uploadedImages[0]
  const gallery = uploadedImages.map((asset, idx) => ({
    _type: 'image',
    _key: `gallery-${idx}`,
    asset: { _type: 'reference', _ref: asset._id },
    alt: `${title} - image ${idx + 1}`,
  }))

  const doc = {
    _type: 'portfolioProject',
    title,
    slug: { _type: 'slug', current: slug },
    category,
    featured,
    summary: description,
    ...(mainImageAsset ? { mainImage: imageRef(mainImageAsset), heroImage: imageRef(mainImageAsset) } : {}),
    gallery,
  }

  const result = await client.create(doc)
  console.log(`  Created: ${result._id}`)
  return result
}

// ─── Shop Products ─────────────────────────────────────────────────────────────

async function createShopProduct(entry) {
  const { slug, name, category, price, image: imagePath } = entry

  console.log(`\n[Shop] ${name}`)

  const imageAsset = await uploadImage(imagePath, name)

  const doc = {
    _type: 'shopProduct',
    name,
    slug: { _type: 'slug', current: slug },
    price,
    category,
    inStock: true,
    ...(imageAsset ? { image: imageRef(imageAsset) } : {}),
    description: blockText(`${name} — original artwork by Nicola Jones.`),
  }

  const result = await client.create(doc)
  console.log(`  Created: ${result._id}`)
  return result
}

// ─── About Content ─────────────────────────────────────────────────────────────

async function createAboutContent(photoPath) {
  console.log('\n[About Content]')

  const photoAsset = await uploadImage(photoPath, 'About photo')

  const BIO = "Brighton born Nicola is an illustrator and decorative painter living in Hastings. She graduated with BA Hons in Illustration from NUCA 2012, and subsequently spent 10 years in London developing skills in scenic arts for immersive theatre, television and commercials. Her personal work is playful and jubilant with bold colour schemes. She is passionate about the positive change that creative input can bring about in community."

  const doc = {
    _type: 'aboutContent',
    bio: blockText(BIO),
    ...(photoAsset ? { photo: imageRef(photoAsset) } : {}),
    processSteps: [
      { _type: 'object', _key: 'step1', step: 1, title: 'Brief', description: 'We start with a detailed conversation about your project, space, and vision.' },
      { _type: 'object', _key: 'step2', step: 2, title: 'Sketches', description: 'Initial sketches and concepts are developed and shared for your feedback.' },
      { _type: 'object', _key: 'step3', step: 3, title: 'Final Art', description: 'The approved design is brought to life with bold colour and confident brushwork.' },
      { _type: 'object', _key: 'step4', step: 4, title: 'Delivery', description: 'The completed work is delivered to your space, ready to enjoy.' },
    ],
  }

  // Check if one already exists
  const existing = await client.fetch(`*[_type == "aboutContent"][0]._id`)
  let result
  if (existing) {
    console.log(`  Patching existing: ${existing}`)
    result = await client.patch(existing).set(doc).commit()
  } else {
    result = await client.create(doc)
  }
  console.log(`  About content saved: ${result._id}`)
  return result
}

// ─── Site Settings ─────────────────────────────────────────────────────────────

async function createSiteSettings(logoSvgPath) {
  console.log('\n[Site Settings]')

  // Upload SVG as a file asset
  const logoAsset = await uploadSvg(logoSvgPath)

  const doc = {
    _type: 'siteSettings',
    siteTitle: 'Nicola Jones',
    tagline: 'Illustrator & Decorative Painter',
    contactEmail: '',
    footerText: '© Nicola Jones. All rights reserved.',
    socialLinks: [],
    ...(logoAsset ? { logo: fileRef(logoAsset) } : {}),
  }

  const existing = await client.fetch(`*[_type == "siteSettings"][0]._id`)
  let result
  if (existing) {
    console.log(`  Patching existing: ${existing}`)
    result = await client.patch(existing).set(doc).commit()
  } else {
    result = await client.create(doc)
  }
  console.log(`  Site settings saved: ${result._id}`)
  return result
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Nicola Jones — Sanity Content Upload ===\n')

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`ERROR: Manifest not found at ${MANIFEST_PATH}`)
    console.error('Run process-images.py first.')
    process.exit(1)
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))

  // Delete existing portfolio + shop docs to start fresh
  console.log('\n--- Clearing existing content ---')
  await deleteExistingDocs('portfolioProject')
  await deleteExistingDocs('shopProduct')

  // Portfolio projects
  console.log('\n--- Creating Portfolio Projects ---')
  const portfolioEntries = Object.entries(manifest).filter(([k]) => k.startsWith('portfolio_'))
  for (const [, entry] of portfolioEntries) {
    await createPortfolioProject(entry)
  }

  // Shop products
  console.log('\n--- Creating Shop Products ---')
  const shopEntries = Object.entries(manifest).filter(([k]) => k.startsWith('shop_'))
  for (const [, entry] of shopEntries) {
    await createShopProduct(entry)
  }

  // About content
  console.log('\n--- Creating About Content ---')
  const aboutEntry = manifest['about']
  await createAboutContent(aboutEntry?.photo)

  // Site settings (with logo)
  console.log('\n--- Creating Site Settings ---')
  await createSiteSettings(LOGO_SVG_PATH)

  console.log('\n\n✅ All done! Content uploaded to Sanity.')
  console.log('   Project: fnwcgtif | Dataset: production')
}

main().catch(err => {
  console.error('\nFATAL ERROR:', err)
  process.exit(1)
})
