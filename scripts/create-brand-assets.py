"""Régénération facultative des images de partage et de l’icône (Pillow)."""
from pathlib import Path
import sys
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
CREAM, RED, GREEN, CHARCOAL = "#FFF8EF", "#B83B2D", "#2F5D43", "#292522"


def font(family, size):
    return ImageFont.truetype(str(PUBLIC / "fonts" / family), size)


def create_assets():
    serif = "fraunces-normal.woff2"
    italic = "fraunces-italic.woff2"
    sans = "manrope-normal.woff2"
    icon = Image.new("RGB", (360, 360), RED)
    draw = ImageDraw.Draw(icon)
    draw.ellipse((35, 35, 325, 325), outline=CREAM, width=3)
    draw.text((180, 175), "V", font=font(italic, 245), fill=CREAM, anchor="mm")
    draw.ellipse((253, 250, 272, 269), fill="#D7A65A")
    icon.resize((180, 180), Image.Resampling.LANCZOS).save(PUBLIC / "apple-touch-icon.png", optimize=True)

    image = Image.new("RGB", (1200, 630), CREAM)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 1199, 12), fill=GREEN)
    draw.text((65, 61), "Le Verone", font=font(serif, 44), fill=RED)
    draw.text((66, 125), "PIZZERIA & CUCINA ITALIANA", font=font(sans, 12), fill=GREEN)
    draw.text((59, 230), "Une pizza.", font=font(serif, 70), fill=CHARCOAL)
    draw.text((59, 318), "Et la dolce vita.", font=font(italic, 59), fill=RED)
    draw.line((65, 455, 568, 455), fill="#DBCFBE", width=2)
    draw.text((65, 490), "LE GOÛT DE L’ITALIE, LE PLAISIR D’ÊTRE ENSEMBLE.", font=font(sans, 12), fill=GREEN)
    draw.text((65, 548), "Carte de démonstration · Photo provisoire Del Arte", font=font(sans, 11), fill="#6D6258")
    photo = Image.open(PUBLIC / "images" / "margherita-600.webp").convert("RGB").resize((535, 535), Image.Resampling.LANCZOS)
    mask = Image.new("L", photo.size)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, 534, 534), radius=16, fill=255)
    image.paste(photo, (630, 54), mask)
    image.save(PUBLIC / "images" / "social-preview.jpg", quality=88, optimize=True)
    print("Icône 180 × 180 et aperçu social 1200 × 630 générés.")


def create_avif_variants():
    total = 0
    for source in sorted((PUBLIC / "images").glob("*.webp")):
        destination = source.with_suffix(".avif")
        with Image.open(source) as image:
            image.convert("RGB").save(destination, "AVIF", quality=45, speed=6)
        total += destination.stat().st_size
    print(f"Variantes AVIF générées : {total} octets, WebP originaux préservés.")


if __name__ == "__main__":
    if "--avif-only" not in sys.argv:
        create_assets()
    create_avif_variants()
