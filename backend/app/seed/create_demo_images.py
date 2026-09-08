"""Generate clean demo craft images with PIL to ensure all sample listings display gracefully."""
import os
from PIL import Image, ImageDraw, ImageFont

def generate_craft_thumbnails():
    demo_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "demo")
    os.makedirs(demo_dir, exist_ok=True)

    items = [
        ("saree_enhanced.jpg", (28, 54, 148), (220, 38, 38), "Pochampally Ikat Saree"),
        ("leather_bag_enhanced.jpg", (120, 53, 15), (217, 119, 6), "Handcrafted Leather Bag"),
        ("leather_bag_raw.jpg", (90, 40, 10), (160, 90, 10), "Raw Bag Photo"),
        ("train_toy.jpg", (217, 119, 6), (16, 185, 129), "Channapatna Wooden Train"),
        ("blue_vase.jpg", (30, 58, 138), (14, 165, 233), "Jaipur Blue Pottery"),
        ("chappal.jpg", (146, 64, 14), (202, 138, 4), "Kolhapuri Chappal"),
        ("tree_of_life.jpg", (180, 83, 9), (5, 150, 105), "Madhubani Tree of Life"),
        ("banarasi.jpg", (159, 18, 57), (234, 179, 8), "Banarasi Brocade Silk"),
        ("kanchi.jpg", (202, 138, 4), (185, 28, 28), "Kanchipuram Silk"),
        ("messenger_bag.jpg", (100, 45, 15), (180, 100, 20), "Leather Messenger Bag"),
        ("tote_bag.jpg", (125, 60, 25), (195, 115, 30), "Handcrafted Leather Tote"),
        ("savita_profile.jpg", (245, 158, 11), (30, 41, 59), "Savita Devi (Artisan)"),
        ("dupatta.jpg", (13, 148, 136), (245, 158, 11), "Handloom Dupatta"),
        ("fabric.jpg", (55, 65, 81), (225, 29, 72), "Pochampally Ikat Fabric"),
        ("stole.jpg", (4, 120, 87), (245, 158, 11), "Mulberry Silk Stole"),
        ("ring_toy.jpg", (239, 68, 68), (59, 130, 246), "Channapatna Stacking Ring"),
        ("pepper_mill.jpg", (68, 64, 60), (217, 119, 6), "Turned Wooden Mill"),
        ("coasters.jpg", (2, 132, 199), (248, 250, 252), "Blue Pottery Coasters"),
        ("bowl.jpg", (30, 58, 138), (250, 204, 21), "Blue Pottery Bowl"),
        ("jutti.jpg", (113, 63, 18), (202, 138, 4), "Hand-Tooled Leather Jutti"),
        ("cushion.jpg", (180, 83, 9), (220, 38, 38), "Madhubani Cushion Cover"),
        ("banarasi_dupatta.jpg", (13, 148, 136), (234, 179, 8), "Banarasi Zari Dupatta"),
        ("wallet.jpg", (136, 19, 55), (244, 63, 94), "Embossed Leather Wallet"),
        ("ajrakh.jpg", (30, 58, 138), (185, 28, 28), "Ajrakh Modal Silk"),
        ("rogan.jpg", (17, 24, 39), (245, 158, 11), "Kutch Rogan Wall Art"),
        ("dhokra.jpg", (161, 98, 7), (120, 53, 15), "Dhokra Brass Figurine"),
        ("dhokra_lamp.jpg", (180, 83, 9), (202, 138, 4), "Dhokra Brass Diya"),
        ("pashmina.jpg", (248, 250, 252), (55, 65, 81), "Kashmir Pashmina Shawl"),
        ("walnut_box.jpg", (68, 64, 60), (120, 53, 15), "Carved Walnut Box"),
        ("brass_pitcher.jpg", (202, 138, 4), (250, 204, 21), "Moradabad Brass Pitcher"),
        ("brass_lamp.jpg", (180, 83, 9), (245, 158, 11), "Brass Hanging Lamp"),
        ("thanjavur_painting.jpg", (234, 179, 8), (185, 28, 28), "Thanjavur Gold Foil Art"),
        ("thanjavur_doll.jpg", (220, 38, 38), (234, 179, 8), "Thanjavur Dancing Doll"),
        ("sambalpuri.jpg", (17, 24, 39), (220, 38, 38), "Sambalpuri Handloom Saree"),
        ("bankura_horse.jpg", (194, 65, 12), (124, 45, 18), "Bankura Terracotta Horse"),
        ("terracotta_tile.jpg", (194, 65, 12), (217, 119, 6), "Terracotta Relief Tile"),
        ("dharmavaram.jpg", (190, 24, 93), (30, 58, 138), "Dharmavaram Silk Saree"),
        ("jali_screen.jpg", (120, 53, 15), (68, 64, 60), "Sheesham Jali Screen"),
        ("jewelry_box.jpg", (87, 83, 78), (217, 119, 6), "Carved Keepsake Box"),
        ("mysore_inlay.jpg", (120, 53, 15), (245, 158, 11), "Mysore Rosewood Inlay"),
        ("dhurrie.jpg", (30, 58, 138), (245, 245, 244), "Warangal Cotton Dhurrie"),
        ("marble_coasters.jpg", (248, 250, 252), (30, 58, 138), "Agra Marble Inlay"),
        ("zardozi_clutch.jpg", (15, 23, 42), (234, 179, 8), "Zardozi Velvet Clutch"),
        ("runner.jpg", (30, 58, 138), (245, 158, 11), "Ikat Table Runner Set"),
        ("diffuser.jpg", (217, 119, 6), (245, 245, 244), "Wooden Aroma Diffuser"),
        ("desk_pad.jpg", (120, 53, 15), (180, 83, 9), "Leather Desk Blotter"),
        ("jute_bag.jpg", (180, 83, 9), (120, 53, 15), "Jute & Leather Tote Bag"),
        ("folder.jpg", (161, 98, 7), (245, 245, 244), "Jute Conference Folder"),
        ("dhokra_elephant.jpg", (120, 53, 15), (202, 138, 4), "Dhokra Brass Elephant"),
        ("copper_bottle.jpg", (194, 65, 12), (245, 158, 11), "Hammered Copper Bottle"),
        ("phone_stand.jpg", (120, 53, 15), (217, 119, 6), "Sheesham Phone Stand"),
        ("yoga_mat.jpg", (5, 150, 105), (245, 245, 244), "Warangal Cotton Yoga Mat"),
        ("oil_burner.jpg", (14, 165, 233), (250, 204, 21), "Blue Pottery Oil Burner"),
    ]

    for fname, col1, col2, title in items:
        path = os.path.join(demo_dir, fname)
        if not os.path.exists(path):
            img = Image.new("RGB", (600, 450), color=col1)
            draw = ImageDraw.Draw(img)
            # Draw subtle decorative inner frame
            draw.rectangle([20, 20, 580, 430], outline=col2, width=4)
            draw.rectangle([30, 30, 570, 420], outline=col2, width=1)
            # Label
            draw.text((40, 210), f"KARIGASETU AI\n{title}", fill=(255, 255, 255))
            img.save(path, "JPEG", quality=88)

    print("Demo thumbnails successfully generated in backend/static/demo/.")

if __name__ == "__main__":
    generate_craft_thumbnails()
