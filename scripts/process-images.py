#!/usr/bin/env python3
"""
Process all Nicola Jones content images for Sanity upload:
1. Convert HEIC to JPEG using sips (macOS)
2. Resize to max 2500px longest side (no upscaling)
3. Save as WebP quality 90
4. Name: nicola-jones-[project-slug]-[nn].webp

Outputs a JSON manifest to /tmp/nicola-jones-processed/manifest.json
"""

import os
import subprocess
import tempfile
import json
import shutil
from PIL import Image

CONTENT_ROOT = "/Users/gregstevenson/Downloads/Nicola_Jones_Website_Content/Website Content (Nicola Jones)"
OUTPUT_DIR = "/tmp/nicola-jones-processed"
MAX_SIZE = 2500

# Image extensions to process (skip videos, GIFs, AI files)
IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.heic', '.heif'}

def slugify(name):
    s = name.lower()
    for ch in ['&', 'and']:
        s = s.replace(' & ', '-').replace('&', 'and')
    s = s.replace(' - ', '-').replace(' ', '-')
    for ch in ['(', ')', ',', "'", '"', '/', '\\', '.']:
        s = s.replace(ch, '')
    # Clean up multiple dashes
    while '--' in s:
        s = s.replace('--', '-')
    return s.strip('-')

def heic_to_jpeg(src_path):
    """Convert HEIC to JPEG using sips, return temp path."""
    tmp = tempfile.NamedTemporaryFile(suffix='.jpg', delete=False)
    tmp_path = tmp.name
    tmp.close()
    result = subprocess.run(
        ['sips', '-s', 'format', 'jpeg', src_path, '--out', tmp_path],
        capture_output=True
    )
    if result.returncode != 0:
        os.unlink(tmp_path)
        raise RuntimeError(f"sips failed for {src_path}: {result.stderr.decode()}")
    return tmp_path

def process_image(src_path, output_path):
    """Load image, resize if needed, save as WebP at quality 90.
    IMPORTANT: Does NOT apply EXIF rotation — preserves original orientation.
    """
    ext = os.path.splitext(src_path)[1].lower()
    tmp_path = None

    try:
        if ext in ('.heic', '.heif'):
            tmp_path = heic_to_jpeg(src_path)
            load_path = tmp_path
        else:
            load_path = src_path

        with Image.open(load_path) as img:
            # Do NOT apply EXIF rotation (preserve orientation as-is)
            w, h = img.size
            max_dim = max(w, h)

            if max_dim > MAX_SIZE:
                scale = MAX_SIZE / max_dim
                new_w = int(w * scale)
                new_h = int(h * scale)
                img = img.resize((new_w, new_h), Image.LANCZOS)

            # Ensure RGB for WebP (handle RGBA, palette, etc.)
            if img.mode == 'RGBA':
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[3])
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')

            img.save(output_path, 'WEBP', quality=90)
            print(f"  OK: {os.path.basename(src_path)} -> {os.path.basename(output_path)}")

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)

def get_images_from_folder(folder):
    """Return sorted list of image files from folder, skipping non-images."""
    if not os.path.isdir(folder):
        return []
    files = []
    for f in sorted(os.listdir(folder)):
        if f.startswith('.'):
            continue
        ext = os.path.splitext(f)[1].lower()
        if ext in IMAGE_EXTS:
            files.append(os.path.join(folder, f))
    return files

def process_project(slug, source_folder, output_subdir):
    """Process all images in a project folder. Returns list of output paths."""
    images = get_images_from_folder(source_folder)
    if not images:
        print(f"  WARNING: No images found in {source_folder}")
        return []

    os.makedirs(output_subdir, exist_ok=True)
    output_paths = []

    for i, img_path in enumerate(images, 1):
        out_name = f"nicola-jones-{slug}-{i:02d}.webp"
        out_path = os.path.join(output_subdir, out_name)
        try:
            process_image(img_path, out_path)
            output_paths.append(out_path)
        except Exception as e:
            print(f"  ERROR processing {img_path}: {e}")

    return output_paths

def main():
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR)

    manifest = {}

    # ─── PORTFOLIO PROJECTS ───────────────────────────────────────────────

    print("\n=== Murals ===")

    projects = [
        # (slug, title, category, source_folder, featured, description)
        (
            "bedroom-nudes",
            "Bedroom Nudes",
            "murals",
            os.path.join(CONTENT_ROOT, "Decorative Painting/Murals/Bedroom Nudes"),
            False,
            "A series of expressive nude figure murals painted in a private bedroom setting.",
        ),
        (
            "greenpeace-glastonbury",
            "Greenpeace Glastonbury",
            "murals",
            os.path.join(CONTENT_ROOT, "Decorative Painting/Murals/Greenpeace Glastonbury"),
            False,
            "Bold mural artwork created for Greenpeace's presence at Glastonbury Festival.",
        ),
        (
            "mermaids",
            "Mermaids",
            "murals",
            os.path.join(CONTENT_ROOT, "Decorative Painting/Murals/Mermaids"),
            False,
            "Vibrant mermaid-themed mural celebrating the sea and feminine energy.",
        ),
        (
            "trees-for-cities",
            "Trees For Cities",
            "murals",
            os.path.join(CONTENT_ROOT, "Decorative Painting/Murals/Trees For Cities"),
            True,
            "Community mural for the charity Trees For Cities, bringing nature into urban spaces.",
        ),
    ]

    print("\n=== Theatre & Events ===")
    projects += [
        (
            "darling-and-edge",
            "Darling and Edge",
            "theatre-events",
            os.path.join(CONTENT_ROOT, "Decorative Painting/Scenic - Theatrical/Darling and Edge"),
            False,
            "Scenic art and set decoration for the immersive theatre production Darling and Edge.",
        ),
        (
            "shitfaced-shakespeare",
            "Shitfaced Shakespeare",
            "theatre-events",
            os.path.join(CONTENT_ROOT, "Decorative Painting/Scenic - Theatrical/Shitfaced Shakespeare"),
            True,
            "Theatrical set design and scenic painting for the hit comedy show Shitfaced Shakespeare.",
        ),
    ]

    print("\n=== Illustration ===")
    projects += [
        (
            "cheeky-bits",
            "Cheeky Bits",
            "illustration",
            os.path.join(CONTENT_ROOT, "Illustration/Personal Work/Cheeky Bits"),
            False,
            "A playful personal illustration series with bold colours and cheeky humour.",
        ),
        (
            "just-add-hair",
            "Just Add Hair",
            "illustration",
            os.path.join(CONTENT_ROOT, "Illustration/Personal Work/Just Add Hair"),
            False,
            "Personal illustration project exploring hair, identity and self-expression.",
        ),
        (
            "sketches-and-intimate-works",
            "Sketches and Intimate Works",
            "illustration",
            os.path.join(CONTENT_ROOT, "Illustration/Personal Work/Sketches and Intimate Works"),
            False,
            "An intimate collection of sketches and small-scale personal works.",
        ),
        (
            "pinpoint-graphic-design",
            "Pinpoint Graphic Design",
            "illustration",
            os.path.join(CONTENT_ROOT, "Illustration/Pinpoint Graphic Design - Website Development"),
            True,
            "Illustration and graphic design work produced for Pinpoint, a digital agency.",
        ),
        (
            "posters-and-flyers",
            "Posters and Flyers",
            "illustration",
            os.path.join(CONTENT_ROOT, "Illustration/Posters and Flyers"),
            False,
            "Event posters and promotional flyers with hand-illustrated artwork.",
        ),
        (
            "springtide-branding",
            "Springtide Branding",
            "illustration",
            os.path.join(CONTENT_ROOT, "Illustration/Springtide Branding"),
            False,
            "Brand identity and illustration work for Springtide.",
        ),
        (
            "the-common-good-live-event",
            "The Common Good - Live Event Illustration",
            "illustration",
            os.path.join(CONTENT_ROOT, "Illustration/The Common Good/Live Event Illustration"),
            False,
            "Live event illustration capturing real-time moments for The Common Good.",
        ),
        (
            "the-common-good-promotional",
            "The Common Good - Promotional Illustration",
            "illustration",
            os.path.join(CONTENT_ROOT, "Illustration/The Common Good/Promotional Illustration"),
            False,
            "Promotional illustration series created for The Common Good organisation.",
        ),
        (
            "commissions",
            "Commissions",
            "illustration",
            os.path.join(CONTENT_ROOT, "Illustration/Commissions "),
            False,
            "A selection of commissioned illustration work for private and commercial clients.",
        ),
    ]

    for slug, title, category, folder, featured, description in projects:
        print(f"\n[{slug}] Processing from: {folder}")
        out_subdir = os.path.join(OUTPUT_DIR, "portfolio", slug)
        paths = process_project(slug, folder, out_subdir)
        manifest[f"portfolio_{slug}"] = {
            "type": "portfolioProject",
            "slug": slug,
            "title": title,
            "category": category,
            "featured": featured,
            "description": description,
            "images": paths,
        }

    # ─── SHOP PRODUCTS ───────────────────────────────────────────────────

    print("\n=== Shop Products ===")
    shop_root = os.path.join(CONTENT_ROOT, "Shop Content")
    shop_products = [
        ("alexander-park-print", "Alexander Park Print", "prints", 35, "Alexander Park Print.heic"),
        ("bathroom-print", "Bathroom Print", "prints", 30, "Bathroom Print.heic"),
        ("bum-print", "Bum Print", "prints", 25, "Bum Print.heic"),
        ("decorated-balls", "Decorated Balls", "prints", 30, "Decorated Balls.jpg"),
        ("kitchen-table-print", "Kitchen Table Print", "prints", 30, "Kitchen Table Print.heic"),
        ("legs-print", "Legs Print", "prints", 25, "Legs Print.heic"),
        ("teeth-original", "Teeth Original", "original-art", 150, "Teeth Original.heic"),
        ("toilet-print", "Toilet Print", "prints", 30, "Toilet Print.jpg"),
        ("trainers-original", "Trainers Original", "original-art", 175, "Trainers Original.HEIC"),
        ("west-hill-from-east-hill-print", "West Hill from East Hill Print", "prints", 35, "West Hill from East Hill Print.heic"),
    ]

    for slug, name, category, price, filename in shop_products:
        print(f"\n[shop/{slug}]")
        src = os.path.join(shop_root, filename)
        if not os.path.exists(src):
            print(f"  WARNING: File not found: {src}")
            manifest[f"shop_{slug}"] = {"type": "shopProduct", "slug": slug, "name": name, "category": category, "price": price, "image": None}
            continue

        out_subdir = os.path.join(OUTPUT_DIR, "shop")
        os.makedirs(out_subdir, exist_ok=True)
        out_name = f"nicola-jones-{slug}-01.webp"
        out_path = os.path.join(out_subdir, out_name)
        try:
            process_image(src, out_path)
            manifest[f"shop_{slug}"] = {
                "type": "shopProduct",
                "slug": slug,
                "name": name,
                "category": category,
                "price": price,
                "image": out_path,
            }
        except Exception as e:
            print(f"  ERROR: {e}")
            manifest[f"shop_{slug}"] = {"type": "shopProduct", "slug": slug, "name": name, "category": category, "price": price, "image": None}

    # ─── ABOUT PHOTO ─────────────────────────────────────────────────────

    print("\n=== About Photo ===")
    about_photo_src = os.path.join(CONTENT_ROOT, "Nicola Jones Logo and Bio/IMG_1907.JPG")
    about_photo_out = None
    if os.path.exists(about_photo_src):
        out_subdir = os.path.join(OUTPUT_DIR, "about")
        os.makedirs(out_subdir, exist_ok=True)
        out_path = os.path.join(out_subdir, "nicola-jones-about-photo-01.webp")
        try:
            process_image(about_photo_src, out_path)
            about_photo_out = out_path
            print(f"  About photo: {out_path}")
        except Exception as e:
            print(f"  ERROR: {e}")

    manifest["about"] = {"type": "aboutContent", "photo": about_photo_out}

    # ─── WRITE MANIFEST ──────────────────────────────────────────────────

    manifest_path = os.path.join(OUTPUT_DIR, "manifest.json")
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)

    print(f"\n\n✓ Manifest written to {manifest_path}")
    print(f"✓ Processed images in {OUTPUT_DIR}")
    total_images = sum(
        len(v.get('images', [])) + (1 if v.get('image') else 0) + (1 if v.get('photo') else 0)
        for v in manifest.values()
    )
    print(f"✓ Total images processed: {total_images}")

if __name__ == '__main__':
    main()
