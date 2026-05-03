import sys, io, json, subprocess, tempfile, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

CK = "ck_688b2302bff120002faf465962dff9af37308816"
CS = "cs_6cf9cc51987bb92c644c9838457d466df859730c"
BASE = "https://crm.ideallivs.com/wp-json/wc/v3/products"

def create_product(data):
    body = json.dumps(data)
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False, encoding='utf-8') as f:
        f.write(body)
        tmp = f.name
    try:
        result = subprocess.run(
            ["curl", "-s", "-X", "POST", BASE,
             "-u", f"{CK}:{CS}",
             "-H", "Content-Type: application/json",
             "--data-binary", f"@{tmp}"],
            capture_output=True, text=True, timeout=60
        )
        return json.loads(result.stdout)
    finally:
        os.unlink(tmp)

products = [
    {
        "name": "Tubzee Kulfi Original 1 ltr",
        "slug": "tubzee-kulfi-original-1ltr",
        "type": "simple", "status": "publish",
        "regular_price": "59", "sku": "452229", "weight": "1",
        "stock_status": "instock", "manage_stock": False,
        "categories": [{"id": 185}, {"id": 289}],
        "description": "<p>Tubzee Original Malai Kulfi Ice Cream delivers the authentic taste of traditional Indian kulfi in a convenient 1-litre sharing tub. Made with rich full-fat milk, fresh cream, real almonds and pistachios, this kulfi offers the dense, slow-melt texture that sets it apart from ordinary ice cream. A beloved South Asian frozen dessert enjoyed for centuries across India and Pakistan, now available online in Sweden.</p><p>Perfect for family gatherings, Eid and Diwali celebrations, or as an indulgent everyday treat. Slightly soften for 2-3 minutes before serving.</p><ul><li>Traditional Indian malai kulfi recipe</li><li>Made with real milk, cream, almonds and pistachios</li><li>1 litre family sharing tub</li><li>Keep frozen at -18C or below</li></ul>",
        "short_description": "<p>Authentic Indian malai kulfi ice cream with real almonds and pistachios. Rich, dense and creamy in a 1 litre sharing tub.</p>",
        "meta_data": [
            {"key": "_gtin", "value": "5060029910259"},
            {"key": "rank_math_title", "value": "Tubzee Kulfi Original 1 ltr | Indian Kulfi Ice Cream | Ideal Livs"},
            {"key": "rank_math_description", "value": "Buy Tubzee Original Malai Kulfi Ice Cream 1 litre online in Sweden. Authentic Indian kulfi made with real milk, almonds and pistachios. Ideal Indiska Livs Stockholm."},
            {"key": "rank_math_focus_keyword", "value": "tubzee kulfi original"}
        ]
    },
    {
        "name": "Tubzee Kulfi Mango 1 ltr",
        "slug": "tubzee-kulfi-mango-1ltr",
        "type": "simple", "status": "publish",
        "regular_price": "59", "sku": "452230", "weight": "1",
        "stock_status": "instock", "manage_stock": False,
        "categories": [{"id": 185}, {"id": 289}],
        "description": "<p>Tubzee Mango Kulfi Ice Cream brings together the luscious sweetness of real mangoes with the rich creaminess of traditional Indian kulfi. Made with fresh milk, cream and real mango pieces, this 1-litre tub delivers vibrant tropical flavour in every spoonful. Mango kulfi is one of the most popular South Asian frozen desserts, beloved for its natural fruity taste and dense slow-melt texture.</p><p>Ideal for summer gatherings, Eid celebrations, or whenever you crave the taste of South Asia. Soften slightly for 2-3 minutes before serving.</p><ul><li>Mango flavoured kulfi made with real mangoes</li><li>Fresh milk and cream base</li><li>1 litre family sharing tub</li><li>Keep frozen at -18C or below</li></ul>",
        "short_description": "<p>Mango kulfi ice cream made with real mangoes and fresh milk. Vibrant tropical flavour in a rich, creamy traditional Indian kulfi. 1 litre sharing tub.</p>",
        "meta_data": [
            {"key": "_gtin", "value": "5060029910266"},
            {"key": "rank_math_title", "value": "Tubzee Kulfi Mango 1 ltr | Mango Kulfi Ice Cream | Ideal Livs"},
            {"key": "rank_math_description", "value": "Buy Tubzee Mango Kulfi Ice Cream 1 litre online in Sweden. Made with real mangoes and fresh milk. Authentic Indian frozen dessert. Ideal Indiska Livs Stockholm."},
            {"key": "rank_math_focus_keyword", "value": "tubzee kulfi mango"}
        ]
    },
    {
        "name": "Tubzee Kulfi Pista 1 ltr",
        "slug": "tubzee-kulfi-pista-1ltr",
        "type": "simple", "status": "publish",
        "regular_price": "59", "sku": "452231", "weight": "1",
        "stock_status": "instock", "manage_stock": False,
        "categories": [{"id": 185}, {"id": 289}],
        "description": "<p>Tubzee Pistachio Kulfi Ice Cream (Pista Kulfi) is a luxurious frozen dessert made with fresh milk, cream and real pistachio nuts. The distinctive rich pistachio flavour and satisfying texture of real nuts make this an irresistible treat for kulfi lovers. Pistachio kulfi is a classic Pakistani and Indian dessert enjoyed at celebrations and family occasions for generations.</p><p>This 1-litre tub is perfect for sharing. Soften slightly for 2-3 minutes before serving for the best scooping experience.</p><ul><li>Pistachio flavoured kulfi with real pistachios</li><li>Fresh milk and cream base</li><li>1 litre family sharing tub</li><li>Keep frozen at -18C or below</li></ul>",
        "short_description": "<p>Pistachio kulfi ice cream (pista kulfi) made with real pistachios and fresh milk. A classic South Asian frozen dessert in a 1 litre sharing tub.</p>",
        "meta_data": [
            {"key": "_gtin", "value": "5060029910273"},
            {"key": "rank_math_title", "value": "Tubzee Kulfi Pista 1 ltr | Pistachio Kulfi Ice Cream | Ideal Livs"},
            {"key": "rank_math_description", "value": "Buy Tubzee Pistachio Kulfi Ice Cream 1 litre online in Sweden. Authentic pista kulfi made with real pistachios and fresh milk. Ideal Indiska Livs Stockholm."},
            {"key": "rank_math_focus_keyword", "value": "tubzee kulfi pista pistachio"}
        ]
    },
    {
        "name": "Tubzee Kulfi Stick Mango 70ml",
        "slug": "tubzee-kulfi-stick-mango-70ml",
        "type": "simple", "status": "publish",
        "regular_price": "20", "sku": "452228", "weight": "0.07",
        "stock_status": "instock", "manage_stock": False,
        "categories": [{"id": 185}, {"id": 289}],
        "description": "<p>Tubzee Kulfi Stick Mango is a convenient individual portion of authentic Indian mango kulfi on a stick. Each 70ml stick is made with fresh milk, cream and real mango for a deliciously creamy frozen treat bursting with tropical flavour. Kulfi sticks are the perfect grab-and-go South Asian dessert, loved by children and adults alike.</p><ul><li>Mango kulfi on a stick made with real mangoes</li><li>Fresh milk and cream base</li><li>70ml individual portion</li><li>Keep frozen at -18C or below</li></ul>",
        "short_description": "<p>Mango kulfi ice cream on a stick. Made with real mangoes and fresh milk. Authentic Indian frozen dessert. 70ml individual portion.</p>",
        "meta_data": [
            {"key": "_gtin", "value": "5060029910099"},
            {"key": "rank_math_title", "value": "Tubzee Kulfi Stick Mango 70ml | Mango Kulfi on a Stick | Ideal Livs"},
            {"key": "rank_math_description", "value": "Buy Tubzee Mango Kulfi Stick 70ml online in Sweden. Authentic Indian mango kulfi ice cream on a stick. Ideal Indiska Livs Stockholm."},
            {"key": "rank_math_focus_keyword", "value": "tubzee kulfi stick mango"}
        ]
    },
    {
        "name": "Tubzee Kulfi Stick Original 70ml",
        "slug": "tubzee-kulfi-stick-original-70ml",
        "type": "simple", "status": "publish",
        "regular_price": "20", "sku": "452232", "weight": "0.07",
        "stock_status": "instock", "manage_stock": False,
        "categories": [{"id": 185}, {"id": 289}],
        "description": "<p>Tubzee Kulfi Stick Original is a classic Indian malai kulfi on a stick. Made with full-fat milk and cream for a rich, dense frozen dessert, each 70ml stick delivers the true taste of traditional kulfi in a convenient single-serve format. Kulfi has been enjoyed as a street food and festive dessert across South Asia for centuries.</p><ul><li>Original malai kulfi on a stick</li><li>Made with real full-fat milk and cream</li><li>70ml individual portion</li><li>Keep frozen at -18C or below</li></ul>",
        "short_description": "<p>Original malai kulfi ice cream on a stick. Authentic Indian frozen dessert made with real milk and cream. 70ml individual portion.</p>",
        "meta_data": [
            {"key": "_gtin", "value": "690225301336"},
            {"key": "rank_math_title", "value": "Tubzee Kulfi Stick Original 70ml | Indian Kulfi on a Stick | Ideal Livs"},
            {"key": "rank_math_description", "value": "Buy Tubzee Original Kulfi Stick 70ml online in Sweden. Authentic Indian malai kulfi on a stick. Ideal Indiska Livs Stockholm."},
            {"key": "rank_math_focus_keyword", "value": "tubzee kulfi stick original"}
        ]
    },
    {
        "name": "Tubzee Kulfi Stick Pistachio 70ml",
        "slug": "tubzee-kulfi-stick-pistachio-70ml",
        "type": "simple", "status": "publish",
        "regular_price": "20", "sku": "452233", "weight": "0.07",
        "stock_status": "instock", "manage_stock": False,
        "categories": [{"id": 185}, {"id": 289}],
        "description": "<p>Tubzee Kulfi Stick Pistachio is a classic South Asian pista kulfi on a stick. Made with fresh milk, cream and real pistachio nuts, each 70ml stick offers an authentic pistachio kulfi experience in a convenient individual portion. The distinctive nutty richness of real pistachios makes this a favourite among kulfi lovers of all ages.</p><ul><li>Pistachio kulfi on a stick with real pistachios</li><li>Made with fresh milk and cream</li><li>70ml individual portion</li><li>Keep frozen at -18C or below</li></ul>",
        "short_description": "<p>Pistachio kulfi ice cream on a stick (pista kulfi). Made with real pistachios and fresh milk. Authentic Indian frozen dessert. 70ml individual portion.</p>",
        "meta_data": [
            {"key": "_gtin", "value": "5060029910075"},
            {"key": "rank_math_title", "value": "Tubzee Kulfi Stick Pistachio 70ml | Pista Kulfi on a Stick | Ideal Livs"},
            {"key": "rank_math_description", "value": "Buy Tubzee Pistachio Kulfi Stick 70ml online in Sweden. Authentic Indian pista kulfi on a stick with real pistachios. Ideal Indiska Livs Stockholm."},
            {"key": "rank_math_focus_keyword", "value": "tubzee kulfi stick pistachio pista"}
        ]
    },
]

created = []
for p in products:
    print(f"Creating: {p['name']} ...", flush=True)
    result = create_product(p)
    pid = result.get("id")
    slug = result.get("slug", "")
    err = result.get("message", "")
    if pid:
        print(f"  OK - ID: {pid} | https://crm.ideallivs.com/product/{slug}/")
        created.append({"id": pid, "name": p["name"], "slug": slug})
    else:
        print(f"  ERROR: {err} | {result}")

print(f"\n=== {len(created)}/6 products created ===")
for c in created:
    print(f"  ID {c['id']} | {c['name']} | /product/{c['slug']}/")
