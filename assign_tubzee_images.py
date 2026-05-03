import sys, io, json, subprocess
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

CK = "ck_688b2302bff120002faf465962dff9af37308816"
CS = "cs_6cf9cc51987bb92c644c9838457d466df859730c"
WP_MEDIA   = "https://crm.ideallivs.com/wp-json/wp/v2/media"
WC_PRODUCTS = "https://crm.ideallivs.com/wp-json/wc/v3/products"

# media_id -> (product_id, alt_text, title)
ITEMS = [
    (5737, 5726, "Tubzee Kulfi Original Malai 1 Litre Ice Cream Tub",       "Tubzee Kulfi Original 1 ltr"),
    (5736, 5727, "Tubzee Kulfi Mango Flavour 1 Litre Ice Cream Tub",        "Tubzee Kulfi Mango 1 ltr"),
    (5732, 5728, "Tubzee Kulfi Pistachio Pista Flavour 1 Litre Ice Cream Tub", "Tubzee Kulfi Pista 1 ltr"),
    (5733, 5729, "Tubzee Kulfi Stick Mango 70ml Individual Portion",        "Tubzee Kulfi Stick Mango 70ml"),
    (5734, 5730, "Tubzee Kulfi Stick Original Malai 70ml Individual Portion", "Tubzee Kulfi Stick Original 70ml"),
    (5735, 5731, "Tubzee Kulfi Stick Pistachio Pista 70ml Individual Portion", "Tubzee Kulfi Stick Pistachio 70ml"),
]

def curl(method, url, data):
    r = subprocess.run(
        ["curl", "-s", "-X", method, url, "-u", f"{CK}:{CS}",
         "-H", "Content-Type: application/json", "-d", json.dumps(data)],
        capture_output=True, text=True, timeout=60
    )
    try:
        return json.loads(r.stdout)
    except Exception:
        return {"_raw": r.stdout[:300]}

for media_id, product_id, alt, title in ITEMS:
    print(f"Media {media_id} -> Product {product_id} | {title}", flush=True)

    # 1. Set alt text + title on the media item
    res = curl("POST", f"{WP_MEDIA}/{media_id}", {"alt_text": alt, "title": title})
    if "id" in res:
        print(f"  Alt set: '{alt}'")
    else:
        print(f"  Alt error: {res.get('message', res)}")

    # 2. Attach image to WooCommerce product
    res = curl("PUT", f"{WC_PRODUCTS}/{product_id}", {"images": [{"id": media_id, "alt": alt, "name": title}]})
    imgs = res.get("images", [])
    if imgs:
        print(f"  Image attached: {imgs[0].get('src','')}")
    else:
        print(f"  Attach error: {res.get('message', res)}")

print("\nAll done.")
