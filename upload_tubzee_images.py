"""
Upload Tubzee PNG images to WordPress media library and attach as product images.
Uses WooCommerce REST API for product update (image already uploaded via WP media endpoint).
"""
import sys, io, json, subprocess, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

CK = "ck_688b2302bff120002faf465962dff9af37308816"
CS = "cs_6cf9cc51987bb92c644c9838457d466df859730c"
WP_MEDIA = "https://crm.ideallivs.com/wp-json/wp/v2/media"
WC_PRODUCTS = "https://crm.ideallivs.com/wp-json/wc/v3/products"
IMG_DIR = r"D:\Visual codes\grocery-template\design\Product\processed"

PRODUCTS = [
    {"id": 5726, "file": "tubzee-kulfi-original-1ltr.png",       "alt": "Tubzee Kulfi Original Malai Ice Cream 1 Litre Tub"},
    {"id": 5727, "file": "tubzee-kulfi-mango-1ltr.png",          "alt": "Tubzee Kulfi Mango Flavoured Ice Cream 1 Litre Tub"},
    {"id": 5728, "file": "tubzee-kulfi-pista-1ltr.png",          "alt": "Tubzee Kulfi Pistachio Flavoured Ice Cream 1 Litre Tub"},
    {"id": 5729, "file": "tubzee-kulfi-stick-mango-70ml.png",    "alt": "Tubzee Kulfi Stick Mango 70ml"},
    {"id": 5730, "file": "tubzee-kulfi-stick-original-70ml.png", "alt": "Tubzee Kulfi Stick Original 70ml"},
    {"id": 5731, "file": "tubzee-kulfi-stick-pistachio-70ml.png","alt": "Tubzee Kulfi Stick Pistachio 70ml"},
]

def upload_image(filepath, alt_text):
    filename = os.path.basename(filepath)
    result = subprocess.run(
        ["curl", "-s", "-X", "POST", WP_MEDIA,
         "-u", f"{CK}:{CS}",
         "-H", f"Content-Disposition: attachment; filename={filename}",
         "-H", "Content-Type: image/png",
         "--data-binary", f"@{filepath}"],
        capture_output=True, text=True, timeout=120
    )
    try:
        data = json.loads(result.stdout)
    except Exception:
        print(f"  Upload parse error: {result.stdout[:300]}")
        return None
    if "id" in data:
        media_id = data["id"]
        # Update alt text
        subprocess.run(
            ["curl", "-s", "-X", "POST", f"{WP_MEDIA}/{media_id}",
             "-u", f"{CK}:{CS}",
             "-H", "Content-Type: application/json",
             "-d", json.dumps({"alt_text": alt_text, "title": alt_text})],
            capture_output=True, timeout=30
        )
        return media_id
    else:
        print(f"  Upload error: {data.get('message', data)}")
        return None

def attach_image_to_product(product_id, media_id, alt_text):
    body = json.dumps({"images": [{"id": media_id, "alt": alt_text}]})
    result = subprocess.run(
        ["curl", "-s", "-X", "PUT", f"{WC_PRODUCTS}/{product_id}",
         "-u", f"{CK}:{CS}",
         "-H", "Content-Type: application/json",
         "-d", body],
        capture_output=True, text=True, timeout=60
    )
    try:
        data = json.loads(result.stdout)
        imgs = data.get("images", [])
        return imgs[0].get("src", "") if imgs else ""
    except Exception:
        return ""

for p in PRODUCTS:
    filepath = os.path.join(IMG_DIR, p["file"])
    print(f"\nUploading: {p['file']} ...", flush=True)
    media_id = upload_image(filepath, p["alt"])
    if not media_id:
        print(f"  FAILED upload for product {p['id']}")
        continue
    print(f"  Uploaded media ID: {media_id}", flush=True)
    src = attach_image_to_product(p["id"], media_id, p["alt"])
    if src:
        print(f"  Attached to product {p['id']}: {src}")
    else:
        print(f"  Attach failed for product {p['id']}")

print("\nDone.")
