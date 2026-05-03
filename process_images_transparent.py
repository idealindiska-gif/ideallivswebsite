"""
Re-process Tubzee product images as transparent PNGs (500x500).
Uses rembg to remove background, then pads to square with transparency.
"""
import sys, os
sys.stdout = __import__('io').TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from rembg import remove
from PIL import Image
import io

SRC = r"D:\Visual codes\grocery-template\design\Product"
OUT = r"D:\Visual codes\grocery-template\design\Product\processed"
SIZE = 500
PAD = 0.06  # 6% padding

# Same mapping as before (based on product content identified in prior session)
MAPPING = [
    ("WhatsApp Image 2026-05-01 at 11.45.54 PM.jpeg",      "tubzee-kulfi-original-1ltr.png"),
    ("WhatsApp Image 2026-05-01 at 11.45.54 PM (1).jpeg",  "tubzee-kulfi-mango-1ltr.png"),
    ("WhatsApp Image 2026-05-01 at 11.45.54 PM (2).jpeg",  "tubzee-kulfi-pista-1ltr.png"),
    ("WhatsApp Image 2026-05-01 at 11.45.54 PM (3).jpeg",  "tubzee-kulfi-stick-mango-70ml.png"),
    ("WhatsApp Image 2026-05-01 at 11.45.54 PM (4).jpeg",  "tubzee-kulfi-stick-original-70ml.png"),
    ("WhatsApp Image 2026-05-01 at 11.45.54 PM (5).jpeg",  "tubzee-kulfi-stick-pistachio-70ml.png"),
]

os.makedirs(OUT, exist_ok=True)

for src_name, out_name in MAPPING:
    src_path = os.path.join(SRC, src_name)
    out_path = os.path.join(OUT, out_name)
    print(f"Processing: {src_name} -> {out_name}", flush=True)

    with open(src_path, "rb") as f:
        raw = f.read()

    # Remove background -> RGBA PNG bytes
    removed = remove(raw)
    img = Image.open(io.BytesIO(removed)).convert("RGBA")

    # Crop to bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)

    # Add padding and fit into square canvas (transparent)
    w, h = img.size
    side = max(w, h)
    pad_px = int(side * PAD)
    canvas_size = side + 2 * pad_px

    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    x = (canvas_size - w) // 2
    y = (canvas_size - h) // 2
    canvas.paste(img, (x, y), img)

    # Resize to 500x500
    final = canvas.resize((SIZE, SIZE), Image.LANCZOS)
    final.save(out_path, "PNG", optimize=True)
    print(f"  Saved: {out_path} ({final.size})", flush=True)

print("\nDone! All images saved as transparent PNGs.")
