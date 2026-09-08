"""Realistic seed dataset for KARIGASETU AI SIH 2026 Prototype.
Contains 20+ authentic Indian artisan clusters, 50+ products, 10+ B2B buyers, RFQs, and orders.
Clearly marked as DEMO DATA.
"""
from datetime import datetime, timezone, timedelta
from app.core.database import SessionLocal, engine, Base
from app.models.models import (
    User, SellerProfile, BuyerProfile, ArtisanCluster,
    Product, ProductImage, ProductAIAnalysis, PricingPrediction,
    RFQ, RFQResponse, Order, OrderItem, Payment, MarketPrice
)

DEMO_DATA_BANNER = "DEMO DATA - SIH 2026 PROTOTYPE"

def populate_demo_database():
    """Initializes tables and seeds 20+ artisans, 50+ products, 10+ buyers, RFQs & orders."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).filter_by(id="user-seller-demo").first():
            print("Database already seeded with demo data.")
            return

        print("Seeding KARIGASETU AI database with 20+ artisans, 50+ products, clusters, and RFQs...")

        # ------------------------------------------------------------------
        # 1. Artisan Clusters (20 Authentic Geographic Craft Hubs)
        # ------------------------------------------------------------------
        clusters_data = [
            ("cl-1", "Pochampally Handloom Cluster", "Telangana", "Yadadri Bhuvanagiri", "Handloom Ikat Weaving", 17.3456, 78.8143, 1240, "Traditional tie-and-dye double ikat silk and cotton sarees."),
            ("cl-2", "Channapatna Toy Town", "Karnataka", "Ramanagara", "Lacquer Wooden Toys", 12.6518, 77.2089, 850, "Centuries-old craft of turnery using ivory wood and organic vegetable dyes."),
            ("cl-3", "Jaipur Blue Pottery Hub", "Rajasthan", "Jaipur", "Blue Pottery & Glazed Ceramics", 26.9124, 75.7873, 1620, "Quartz-based non-clay decorative pottery with vibrant Persian blue motifs."),
            ("cl-4", "Kolhapur Leather Cluster", "Maharashtra", "Kolhapur", "Kolhapuri Leathercraft", 16.7050, 74.2433, 980, "Hand-braided, vegetable-tanned handcrafted open leather footwear."),
            ("cl-5", "Madhubani Folk Painting Cluster", "Bihar", "Madhubani", "Mithila Painting", 26.3533, 86.0718, 1420, "Ancient ritual folk art drawn using fingers, twigs, and natural mineral dyes."),
            ("cl-6", "Varanasi Silk Weaving Hub", "Uttar Pradesh", "Varanasi", "Banarasi Brocade Silk", 25.3176, 82.9739, 2100, "Fine gold and silver metallic zari brocades on pure mulberry silk."),
            ("cl-7", "Kanchipuram Silk Cluster", "Tamil Nadu", "Kanchipuram", "Kanchipuram Silk Weaving", 12.8342, 79.7036, 1850, "Heavyweight mulberry silk sarees with contrasting woven temple borders."),
            ("cl-8", "Shantiniketan Leather Craft", "West Bengal", "Birbhum", "Embossed Leatherwork", 23.6797, 87.6979, 640, "Touch-embossed vegetable tanned leather bags with batik motifs."),
            ("cl-9", "Kutch Ajrakh & Rogan Hub", "Gujarat", "Kutch", "Ajrakh Block Print & Rogan Art", 23.2420, 69.6669, 1150, "Castor oil based Rogan painting and 16-stage natural resist block printing."),
            ("cl-10", "Bastar Bell Metal Cluster", "Chhattisgarh", "Bastar", "Dhokra Metal Casting", 19.0743, 82.0298, 590, "Lost-wax cast brass and bronze tribal figurines."),
            ("cl-11", "Kashmir Pashmina & Walnut Wood", "Jammu and Kashmir", "Srinagar", "Pashmina Shawls & Wood Carving", 34.0837, 74.7973, 1310, "Hand-spun Changthangi cashmere Pashmina and carved walnut furniture."),
            ("cl-12", "Moradabad Brassware Hub", "Uttar Pradesh", "Moradabad", "Hand-Etched Brassware", 28.8386, 78.7733, 2350, "Artisan brass vases, lamps, and engraved tabletop decor."),
            ("cl-13", "Thanjavur Art & Doll Cluster", "Tamil Nadu", "Thanjavur", "Thanjavur Painting & Dancing Dolls", 10.7870, 79.1378, 480, "Gold-foil embedded classical icon paintings and roly-poly papier-mache toys."),
            ("cl-14", "Sambalpur Ikat Weavers", "Odisha", "Sambalpur", "Sambalpuri Bandha Weaving", 21.4669, 83.9812, 1120, "Curved ikat wave patterns woven on traditional wooden pit looms."),
            ("cl-15", "Bishnupur Terracotta Hub", "West Bengal", "Bankura", "Terracotta Pottery & Bankura Horse", 23.0760, 87.3190, 730, "Kiln-baked red clay architectural plaques and iconic Bankura horses."),
            ("cl-16", "Dharmavaram Silk Hub", "Andhra Pradesh", "Sri Sathya Sai", "Broad-Border Silk Weaving", 14.4137, 77.7126, 910, "Broad golden pallu silk sarees with double shade body colors."),
            ("cl-17", "Saharanpur Wood Carving", "Uttar Pradesh", "Saharanpur", "Carved Sheesham Woodwork", 29.9640, 77.5460, 1580, "Hand-chiseled jali screens, boxes, and furniture in Indian rosewood."),
            ("cl-18", "Mysore Rosewood Inlay", "Karnataka", "Mysore", "Rosewood Marquetry & Inlay", 12.2958, 76.6394, 420, "Intricate geometric and flora inlays using natural tinted wood pieces."),
            ("cl-19", "Warangal Dhurrie Cluster", "Telangana", "Warangal", "Cotton Rugs & Dhurries", 17.9689, 79.5941, 620, "Geometric and ikat-style handwoven flat-weave floor rugs."),
            ("cl-20", "Agra Zardozi & Inlay Hub", "Uttar Pradesh", "Agra", "Zardozi Embroidery & Marble Inlay", 27.1767, 78.0081, 1490, "Gold wire 3D raised embroidery and Pietra Dura marble inlay.")
        ]

        for cid, name, state, dist, craft, lat, lng, count, desc in clusters_data:
            db.add(ArtisanCluster(
                id=cid, name=name, state=state, district=dist,
                primary_craft=craft, latitude=lat, longitude=lng,
                artisan_count=count, description=desc
            ))
        db.commit()

        # ------------------------------------------------------------------
        # 2. Core Users (Seller, Buyer, Admin + Artisans)
        # ------------------------------------------------------------------
        # Demo Seller: Savita Devi
        user_seller = User(
            id="user-seller-demo",
            email="savita.pochampally@example.com",
            mobile="+919876543210",
            role="SELLER",
            email_verified=True,
            mobile_verified=True,
            status="ACTIVE"
        )
        db.add(user_seller)

        # Demo Buyer: Rajesh Kumar (FabCraft)
        user_buyer = User(
            id="user-buyer-demo",
            email="rajesh.kumar@fabcraft.example.com",
            mobile="+919876543211",
            role="BUYER",
            email_verified=True,
            mobile_verified=True,
            status="ACTIVE"
        )
        db.add(user_buyer)

        # Demo Admin: Officer Ananya Sharma
        user_admin = User(
            id="user-admin-demo",
            email="admin.ananya@karigasetu.gov.in",
            mobile="+919876543212",
            role="ADMIN",
            email_verified=True,
            mobile_verified=True,
            status="ACTIVE"
        )
        db.add(user_admin)
        db.commit()

        # ------------------------------------------------------------------
        # 3. Profiles (20 Authentic Artisans + 10 B2B Buyers)
        # ------------------------------------------------------------------
        # Hero Seller Profile
        seller_savita = SellerProfile(
            id="sel-1",
            user_id="user-seller-demo",
            full_name="Savita Devi",
            business_name="Savita Ikat Handlooms",
            cluster_id="cl-1",
            primary_craft="Handloom Ikat Weaving",
            experience_years=18,
            monthly_capacity_units=25,
            preferred_language="te",
            location="Pochampally, Telangana",
            profile_image_url="/static/demo/savita_profile.jpg",
            story="Savita Devi is a 3rd-generation master weaver from Bhuvanagiri who preserves the intricate double-ikat resist-dyeing tradition.",
            verification_badge="ARTISAN_VERIFIED",
            readiness_score=84,
            export_readiness_score=78
        )
        db.add(seller_savita)

        # Additional 19 Artisans
        artisans_raw = [
            ("sel-2", "Rameshwar Gowda", "Channapatna Toycraft", "cl-2", "Lacquer Wooden Toys", 22, 200, "kn", "Channapatna, Karnataka"),
            ("sel-3", "Kailash Chand Sharma", "Jaipur Royal Blue Pottery", "cl-3", "Blue Pottery & Glazed Ceramics", 30, 80, "hi", "Jaipur, Rajasthan"),
            ("sel-4", "Baburao Shinde", "Kolhapuri Heritage Footwear", "cl-4", "Kolhapuri Leathercraft", 16, 120, "mr", "Kolhapur, Maharashtra"),
            ("sel-5", "Sita Devi Jha", "Mithila Kalakriti Collective", "cl-5", "Mithila Painting", 25, 40, "hi", "Madhubani, Bihar"),
            ("sel-6", "Mohammad Aslam Ansari", "Noor Banarasi Silks", "cl-6", "Banarasi Brocade Silk", 28, 30, "hi", "Varanasi, Uttar Pradesh"),
            ("sel-7", "Kuppuswamy Mudaliar", "Sri Varadaraja Handlooms", "cl-7", "Kanchipuram Silk Weaving", 35, 20, "ta", "Kanchipuram, Tamil Nadu"),
            ("sel-8", "Anirban Mukherjee", "Shantiniketan Leather Art", "cl-8", "Embossed Leatherwork", 14, 150, "bn", "Bolpur, West Bengal"),
            ("sel-9", "Ismail Mohammad Khatri", "Kutch Ajrakh Masters", "cl-9", "Ajrakh Block Print & Rogan Art", 32, 100, "hi", "Bhuj, Gujarat"),
            ("sel-10", "Sukhnath Kashyap", "Bastar Dhokra Collective", "cl-10", "Dhokra Metal Casting", 19, 60, "hi", "Jagdalpur, Chhattisgarh"),
            ("sel-11", "Ghulam Nabi Mir", "Chinar Valley Shawls", "cl-11", "Pashmina Shawls & Wood Carving", 26, 35, "en", "Srinagar, Jammu & Kashmir"),
            ("sel-12", "Dinesh Kumar Rastogi", "Brass Heritage Exports", "cl-12", "Hand-Etched Brassware", 20, 300, "hi", "Moradabad, Uttar Pradesh"),
            ("sel-13", "S. Soundararajan", "Thanjavur Art Guild", "cl-13", "Thanjavur Painting & Dancing Dolls", 24, 25, "ta", "Thanjavur, Tamil Nadu"),
            ("sel-14", "Bichitra Meher", "Sambalpuri Weavers Union", "cl-14", "Sambalpuri Bandha Weaving", 17, 45, "hi", "Bargarh, Odisha"),
            ("sel-15", "Sanatan Karmakar", "Bankura Terracotta House", "cl-15", "Terracotta Pottery & Bankura Horse", 21, 150, "bn", "Bishnupur, West Bengal"),
            ("sel-16", "Venkataswamy Chetty", "Dharmavaram Silk Guild", "cl-16", "Broad-Border Silk Weaving", 29, 30, "te", "Dharmavaram, Andhra Pradesh"),
            ("sel-17", "Zahid Ali", "Sheesham Carving Guild", "cl-17", "Carved Sheesham Woodwork", 18, 180, "hi", "Saharanpur, Uttar Pradesh"),
            ("sel-18", "Manjunath Acharya", "Mysore Inlay Heritage", "cl-18", "Rosewood Marquetry & Inlay", 23, 50, "kn", "Mysore, Karnataka"),
            ("sel-19", "Mallaiah Yadav", "Warangal Dhurrie Works", "cl-19", "Cotton Rugs & Dhurries", 15, 90, "te", "Warangal, Telangana"),
            ("sel-20", "Imtiaz Hashmi", "Mughal Inlay & Zari Studio", "cl-20", "Zardozi Embroidery & Marble Inlay", 27, 45, "hi", "Agra, Uttar Pradesh")
        ]

        for sid, name, biz, cid, craft, exp, cap, lang, loc in artisans_raw:
            user_a = User(
                id=f"user-{sid}",
                email=f"{sid}@artisan.example.com",
                role="SELLER",
                email_verified=True,
                status="ACTIVE"
            )
            db.add(user_a)
            db.add(SellerProfile(
                id=sid,
                user_id=user_a.id,
                full_name=name,
                business_name=biz,
                cluster_id=cid,
                primary_craft=craft,
                experience_years=exp,
                monthly_capacity_units=cap,
                preferred_language=lang,
                location=loc,
                verification_badge="ARTISAN_VERIFIED",
                readiness_score=80 + (exp % 15),
                export_readiness_score=72 + (exp % 20)
            ))

        # Hero Buyer Profile: Rajesh Kumar
        buyer_rajesh = BuyerProfile(
            id="buy-1",
            user_id="user-buyer-demo",
            contact_name="Rajesh Kumar",
            company_name="FabCraft Ethical Retail",
            buyer_type="RETAILER",
            location="Bengaluru, Karnataka",
            typical_order_size=100,
            verified_buyer=True
        )
        db.add(buyer_rajesh)

        # 9 Additional Institutional B2B Buyers
        buyers_raw = [
            ("buy-2", "Sunita Singhania", "IndiEthnic Boutique Chain", "RETAILER", "Mumbai, Maharashtra", 150),
            ("buy-3", "Vikramaditya Oberoi", "The Oberoi Heritage Hotels", "CORPORATE", "New Delhi, Delhi", 300),
            ("buy-4", "Karthik Sundaram", "Dakshin Crafts Export House", "WHOLESALER", "Chennai, Tamil Nadu", 500),
            ("buy-5", "Preeti Deshmukh", "Khadi Gramodyog Bhavan", "GOVERNMENT", "Pune, Maharashtra", 400),
            ("buy-6", "David Miller", "Global Artisans UK Import Ltd", "CORPORATE", "London / Mumbai Hub", 250),
            ("buy-7", "Alok Sengupta", "Tribal Cooperative Marketing (TRIFED)", "GOVERNMENT", "Kolkata, West Bengal", 600),
            ("buy-8", "Neha Aggarwal", "FabIndia Regional Sourcing", "RETAILER", "Gurugram, Haryana", 350),
            ("buy-9", "Amitav Sen", "Craftroots Collective", "INSTITUTIONAL", "Ahmedabad, Gujarat", 200),
            ("buy-10", "Rohit Bhargava", "ITC Maurya Souvenirs & Decor", "CORPORATE", "Jaipur, Rajasthan", 180),
        ]
        for bid, bname, comp, btype, bloc, bsize in buyers_raw:
            user_b = User(
                id=f"user-{bid}",
                email=f"{bid}@buyer.example.com",
                role="BUYER",
                email_verified=True,
                status="ACTIVE"
            )
            db.add(user_b)
            db.add(BuyerProfile(
                id=bid,
                user_id=user_b.id,
                contact_name=bname,
                company_name=comp,
                buyer_type=btype,
                location=bloc,
                typical_order_size=bsize,
                verified_buyer=True
            ))

        db.commit()

        # ------------------------------------------------------------------
        # 4. Products (50+ Curated Authentic Indian Craft Products)
        # ------------------------------------------------------------------
        products_data = [
            # Savita Devi (sel-1)
            ("prod-1", "sel-1", "Handwoven Mulberry Silk Ikat Saree", "Authentic double-ikat pure silk handloom saree with geometric diamond motifs.", "Textiles & Apparels", "Sarees", "Pure Mulberry Silk", "Pochampally Ikat", "Royal Blue & Crimson", "5.5m x 1.15m", "620g", "3 days", 3850.00, 8, "/static/demo/saree_enhanced.jpg"),
            ("prod-2", "sel-1", "Handwoven Pochampally Cotton Dupatta", "Lightweight breathable handloom cotton dupatta with resist-dyed chevron border.", "Textiles & Apparels", "Dupattas", "Organic Cotton", "Pochampally Ikat", "Turquoise & Ochre", "2.4m x 0.9m", "180g", "1 day", 890.00, 25, "/static/demo/dupatta.jpg"),
            ("prod-3", "sel-1", "Pochampally Ikat Fabric Running Yardage", "Fine thread count ikat cotton fabric ideal for premium apparel manufacturing.", "Textiles & Apparels", "Yardage", "Handloom Cotton", "Pochampally Ikat", "Charcoal & Maroon", "Per Meter", "140g/m", "2 days", 450.00, 100, "/static/demo/fabric.jpg"),
            ("prod-4", "sel-1", "Handloom Silk Pocket Square & Stole Set", "Sophisticated corporate gift set handcrafted with traditional warp-weft alignment.", "Accessories", "Stoles", "Mulberry Silk", "Pochampally Ikat", "Emerald Green", "1.8m x 0.5m", "210g", "1 day", 1250.00, 40, "/static/demo/stole.jpg"),

            # Rameshwar Gowda (sel-2)
            ("prod-5", "sel-2", "Traditional Channapatna Lacquer Wooden Toy Train", "Eco-friendly wooden train with rolling wheels, colored using child-safe vegetable dyes.", "Wooden Toys & Decor", "Toys", "Ivory Wood", "Channapatna Turnery", "Multicolor", "28cm x 7cm x 6cm", "340g", "1 day", 580.00, 50, "/static/demo/train_toy.jpg"),
            ("prod-6", "sel-2", "Channapatna Stacking Ring Sensory Toy", "Classic developmental ring stacker turned on traditional lathe with turmeric and kumkum dyes.", "Wooden Toys & Decor", "Educational Toys", "Wrightia Tinctoria Wood", "Channapatna Turnery", "Rainbow Natural", "18cm Height", "280g", "1 day", 420.00, 80, "/static/demo/ring_toy.jpg"),
            ("prod-7", "sel-2", "Hand-Turned Wooden Pepper Mill & Salt Shaker", "Smooth lacquer-finished gourmet kitchen grinder with ceramic core mechanism.", "Kitchen & Dining", "Serveware", "Rosewood & Hale Wood", "Channapatna Turnery", "Walnut & Natural", "20cm x 6cm", "410g", "2 days", 790.00, 30, "/static/demo/pepper_mill.jpg"),

            # Kailash Chand Sharma (sel-3)
            ("prod-8", "sel-3", "Jaipur Blue Pottery Floral Arabesque Vase", "Handcrafted quartz-based decorative vase with cobalt and copper oxide glaze.", "Home Decor & Pottery", "Vases", "Quartz Powder & Glass", "Jaipur Blue Pottery", "Cobalt Blue", "24cm x 12cm", "920g", "4 days", 1290.00, 20, "/static/demo/blue_vase.jpg"),
            ("prod-9", "sel-3", "Hand-Painted Ceramic Coaster Set (Set of 6)", "Heat-resistant blue pottery drink coasters featuring Mughal marigold patterns.", "Home Decor & Pottery", "Tabletop", "Glazed Ceramic", "Jaipur Blue Pottery", "Turquoise & White", "10cm x 10cm", "450g", "2 days", 650.00, 60, "/static/demo/coasters.jpg"),
            ("prod-10", "sel-3", "Decorative Blue Pottery Serving Bowl", "Food-safe decorative centerpiece bowl embellished with hand-brushed Persian arabesques.", "Kitchen & Dining", "Bowls", "Quartz & Kaolin", "Jaipur Blue Pottery", "Indigo & Yellow", "22cm Diameter", "780g", "3 days", 950.00, 25, "/static/demo/bowl.jpg"),

            # Baburao Shinde (sel-4)
            ("prod-11", "sel-4", "Authentic Kolhapuri Hand-Braided Leather Chappal", "Traditional vegetable-tanned open-toe sandals stitched with sturdy leather cords.", "Footwear & Leather", "Footwear", "Buffalo Leather", "Kolhapuri Leathercraft", "Raw Tan Brown", "Standard Indian 7-10", "480g", "2 days", 1199.00, 45, "/static/demo/chappal.jpg"),
            ("prod-12", "sel-4", "Hand-Tooled Leather Jutti & Moccasin", "Cushioned slip-on footwear featuring intricate punch-hole perforation patterns.", "Footwear & Leather", "Footwear", "Vegetable Tanned Leather", "Hand-Tooled Leather", "Deep Mahogany", "Sizes 6-11", "420g", "3 days", 1450.00, 30, "/static/demo/jutti.jpg"),

            # Sita Devi Jha (sel-5)
            ("prod-13", "sel-5", "Handmade Madhubani Tree of Life Painting", "Traditional Mithila folk artwork on handmade paper depicting cosmic harmony.", "Art & Collectibles", "Paintings", "Handmade Cotton Paper", "Mithila Painting", "Natural Mineral Pigments", "40cm x 30cm", "150g", "4 days", 1850.00, 15, "/static/demo/tree_of_life.jpg"),
            ("prod-14", "sel-5", "Madhubani Hand-Painted Cotton Cushion Covers (Pair)", "Pair of festive cotton cushion covers with auspicious fish and lotus motifs.", "Home Furnishings", "Cushion Covers", "Organic Cotton", "Mithila Fabric Painting", "Ochre & Madder Red", "40cm x 40cm", "260g", "2 days", 780.00, 50, "/static/demo/cushion.jpg"),

            # Mohammad Aslam Ansari (sel-6)
            ("prod-15", "sel-6", "Royal Banarasi Katan Silk Brocade Saree", "Opulent bridal saree with intricate golden kadwa floral jaal woven across pure katan silk.", "Textiles & Apparels", "Sarees", "Katan Pure Silk", "Banarasi Weaving", "Maroon & Antique Gold", "5.5m x 1.15m", "890g", "7 days", 7450.00, 6, "/static/demo/banarasi.jpg"),
            ("prod-16", "sel-6", "Banarasi Zari Handloom Dupatta", "Regal lightweight organza silk dupatta with ornate meenakari borders.", "Textiles & Apparels", "Dupattas", "Organza Silk & Metallic Zari", "Banarasi Handloom", "Pastel Mint & Gold", "2.5m x 1m", "220g", "3 days", 2400.00, 20, "/static/demo/banarasi_dupatta.jpg"),

            # Kuppuswamy Mudaliar (sel-7)
            ("prod-17", "sel-7", "Kanchipuram Temple Border Silk Saree", "Double-warp heavy South Indian silk saree with korvai contrasting border and grand pallu.", "Textiles & Apparels", "Sarees", "Mulberry Silk & Half-Fine Zari", "Kanchipuram Weaving", "Mustard Yellow & Maroon", "5.5m x 1.15m", "780g", "5 days", 6200.00, 8, "/static/demo/kanchi.jpg"),

            # Anirban Mukherjee (sel-8)
            ("prod-18", "sel-8", "Shantiniketan Embossed Leather Messenger Bag", "Durable laptop messenger bag with hand-embossed floral relief and zippered partitions.", "Leather Goods", "Bags", "Vegetable Tanned Leather", "Shantiniketan Embossing", "Vintage Chestnut", "36cm x 28cm x 8cm", "820g", "3 days", 1890.00, 35, "/static/demo/messenger_bag.jpg"),
            ("prod-19", "sel-8", "Handcrafted Leather Tote Bag with Batik Detailing", "Spacious everyday shoulder tote handcrafted with durable reinforced shoulder straps.", "Leather Goods", "Bags & Totes", "Full Grain Leather", "Leathercraft", "Cognac Brown", "38cm x 32cm x 10cm", "710g", "2 days", 1650.00, 40, "/static/demo/tote_bag.jpg"),
            ("prod-20", "sel-8", "Embossed Leather Zippered Travel Wallet", "Slim travel passport organizer with multi-card slots and coin pocket.", "Accessories", "Wallets", "Goat Leather", "Hand Embossed", "Burgundy", "22cm x 12cm", "180g", "1 day", 690.00, 80, "/static/demo/wallet.jpg"),

            # Ismail Mohammad Khatri (sel-9)
            ("prod-21", "sel-9", "Natural Indigo Ajrakh Modal Silk Dupatta", "Traditional 16-stage hand-block printed modal silk scarf using indigo, iron rust, and madder.", "Textiles & Apparels", "Stoles", "Modal Silk", "Ajrakh Block Print", "Deep Indigo & Rust", "2.4m x 0.9m", "190g", "3 days", 1450.00, 30, "/static/demo/ajrakh.jpg"),
            ("prod-22", "sel-9", "Authentic Kutch Rogan Art Wall Hanging", "Meticulously drawn Tree of Prosperity made with castor-seed oil paste and natural earth pigments.", "Art & Collectibles", "Wall Art", "Khadi Cotton Fabric", "Rogan Art", "Multicolor on Black Khadi", "45cm x 45cm", "210g", "5 days", 2800.00, 10, "/static/demo/rogan.jpg"),

            # Sukhnath Kashyap (sel-10)
            ("prod-23", "sel-10", "Bastar Dhokra Brass Tribal Musician Figurine", "Lost-wax cast bronze figurine of tribal flutist embodying ancient indigenous forms.", "Art & Collectibles", "Sculptures", "Recycled Brass & Bronze", "Dhokra Metal Casting", "Antique Patina Brass", "18cm x 8cm x 6cm", "620g", "3 days", 1150.00, 25, "/static/demo/dhokra.jpg"),
            ("prod-24", "sel-10", "Dhokra Brass Oil Lamp / Diya with Peacock Arch", "Traditional cast ritual oil lamp featuring perched peacock motif.", "Home Decor & Pottery", "Lamps", "Bell Metal", "Dhokra Casting", "Golden Antique Bronze", "15cm x 12cm", "510g", "2 days", 850.00, 35, "/static/demo/dhokra_lamp.jpg"),

            # Ghulam Nabi Mir (sel-11)
            ("prod-25", "sel-11", "Kashmir Hand-Spun Pure Pashmina Sozni Shawl", "Ultra-soft genuine Changthangi Pashmina shawl adorned with needlework needle embroidery.", "Textiles & Apparels", "Shawls", "Pure Cashmere Pashmina", "Sozni Needle Embroidery", "Warm Ivory & Charcoal", "2m x 1m", "190g", "14 days", 12500.00, 5, "/static/demo/pashmina.jpg"),
            ("prod-26", "sel-11", "Carved Walnut Wood Dry Fruit Bowl", "Deep relief carved solid walnut wood box featuring chinar leaf motifs.", "Kitchen & Dining", "Serveware", "Kashmir Walnut Wood", "Hand Wood Carving", "Natural Walnut Oil", "20cm x 15cm x 8cm", "590g", "3 days", 1650.00, 20, "/static/demo/walnut_box.jpg"),

            # Dinesh Kumar Rastogi (sel-12)
            ("prod-27", "sel-12", "Hand-Etched Moradabad Brass Pitcher & Goblet Set", "Royal water pitcher with two matching goblets engraved with floral jaali filigree.", "Kitchen & Dining", "Drinkware", "Pure Brass", "Hand-Etched Brassware", "Polished Gold Brass", "25cm Pitcher", "1100g", "3 days", 2200.00, 25, "/static/demo/brass_pitcher.jpg"),
            ("prod-28", "sel-12", "Antique Brass Hanging Moroccan Lamp", "Punched brass pendant lamp diffusing warm geometric shadow patterns.", "Home Decor & Pottery", "Lighting", "Spun Brass Sheet", "Hand Piercing", "Vintage Brass Finish", "30cm x 18cm", "750g", "2 days", 1450.00, 40, "/static/demo/brass_lamp.jpg"),

            # S. Soundararajan (sel-13)
            ("prod-29", "sel-13", "Thanjavur Gilded Lakshmi Painting (Gold Foil)", "Sacred classical painting adorned with genuine 22-carat gold foil and Jaipur gemstones.", "Art & Collectibles", "Paintings", "Teak Wood Frame & Gold Foil", "Thanjavur Art", "Gold & Natural Pigments", "30cm x 25cm", "1800g", "6 days", 5500.00, 8, "/static/demo/thanjavur_painting.jpg"),
            ("prod-30", "sel-13", "Traditional Thanjavur Bobblehead Dancing Doll", "Clay and papier-mache oscillating doll balanced on a single center of gravity.", "Wooden Toys & Decor", "Dolls", "Papier-Mache & Clay", "Thanjavur Dollmaking", "Vibrant Red & Gold", "26cm Height", "380g", "2 days", 480.00, 60, "/static/demo/thanjavur_doll.jpg"),

            # Bichitra Meher (sel-14)
            ("prod-31", "sel-14", "Sambalpuri Handloom Cotton Saree (Pasapalli)", "Iconic chess-board checkered handloom cotton saree with woven temple borders.", "Textiles & Apparels", "Sarees", "Combed Mercerized Cotton", "Sambalpuri Bandha", "Black, White & Red", "5.5m x 1.15m", "580g", "3 days", 2950.00, 12, "/static/demo/sambalpuri.jpg"),

            # Sanatan Karmakar (sel-15)
            ("prod-32", "sel-15", "Terracotta Bankura Horse Pair (Pride of Bengal)", "Distinctive tall-eared, long-necked auspicious red clay decorative horse sculptures.", "Art & Collectibles", "Sculptures", "Alluvial River Clay", "Terracotta Pottery", "Natural Terracotta Red", "32cm Height", "1400g", "3 days", 990.00, 30, "/static/demo/bankura_horse.jpg"),
            ("prod-33", "sel-15", "Bishnupur Terracotta Wall Tile Relief", "Architectural decorative plaque depicting rural monsoon harvesting celebrations.", "Home Decor & Pottery", "Wall Decor", "Fired Clay", "Terracotta Relief", "Earthy Ochre", "25cm x 25cm x 3cm", "850g", "2 days", 650.00, 45, "/static/demo/terracotta_tile.jpg"),

            # Venkataswamy Chetty (sel-16)
            ("prod-34", "sel-16", "Dharmavaram Double-Shade Wedding Silk Saree", "Lustrous shot-color silk saree with peacock motifs woven in pure golden zari.", "Textiles & Apparels", "Sarees", "Mulberry Silk", "Dharmavaram Handloom", "Magenta & Peacock Blue", "5.5m x 1.15m", "720g", "4 days", 4950.00, 10, "/static/demo/dharmavaram.jpg"),

            # Zahid Ali (sel-17)
            ("prod-35", "sel-17", "Hand-Chiseled Sheesham Wood Jali Room Divider", "Foldable 3-panel acoustic accent screen intricately pierced with trellis fretwork.", "Furniture & Living", "Partitions", "Indian Rosewood (Sheesham)", "Wood Lattice Carving", "Natural Honey Wax Finish", "180cm x 150cm", "14500g", "8 days", 8900.00, 6, "/static/demo/jali_screen.jpg"),
            ("prod-36", "sel-17", "Carved Sheesham Keepsake Jewelry Box", "Solid wooden chest with brass floral inlays and velvet interior lining.", "Accessories", "Boxes", "Sheesham Wood & Brass", "Hand Carving", "Dark Walnut", "22cm x 14cm x 8cm", "680g", "2 days", 750.00, 50, "/static/demo/jewelry_box.jpg"),

            # Manjunath Acharya (sel-18)
            ("prod-37", "sel-18", "Mysore Rosewood Inlay Wall Art Panel", "Intricate scenery crafted by inlaying varied naturally tinted wood veneers into rosewood.", "Art & Collectibles", "Wall Art", "Rosewood & Timber Inlays", "Mysore Marquetry", "Natural Wood Tones", "45cm x 30cm", "1200g", "4 days", 3400.00, 12, "/static/demo/mysore_inlay.jpg"),

            # Mallaiah Yadav (sel-19)
            ("prod-38", "sel-19", "Handwoven Warangal Cotton Dhurrie Rug", "Durable reversible flat-weave floor rug with geometric chevron tribal design.", "Home Furnishings", "Rugs", "Heavy Cotton Yarn", "Dhurrie Weaving", "Indigo & Natural Ecru", "150cm x 90cm", "1600g", "2 days", 1350.00, 30, "/static/demo/dhurrie.jpg"),

            # Imtiaz Hashmi (sel-20)
            ("prod-39", "sel-20", "Agra White Marble Inlay Coaster Set (Pietra Dura)", "Set of 4 makrana white marble coasters inlaid with semi-precious lapis lazuli and malachite.", "Home Decor & Pottery", "Tabletop", "Makrana White Marble", "Pietra Dura Stone Inlay", "White Marble with Gemstones", "10cm x 10cm", "650g", "3 days", 1850.00, 20, "/static/demo/marble_coasters.jpg"),
            ("prod-40", "sel-20", "Zardozi Embroidered Royal Velvet Clutch", "Handheld evening clutch richly embellished with gold metallic dabka and french knots.", "Fashion & Accessories", "Bags", "Silk Velvet & Gold Thread", "Zardozi Needlework", "Midnight Navy & Gold", "22cm x 12cm x 4cm", "320g", "3 days", 1650.00, 25, "/static/demo/zardozi_clutch.jpg"),

            # Additional bulk items for diverse B2B discovery
            ("prod-41", "sel-1", "Handloom Pochampally Cotton Table Runner Set", "Includes 1 runner and 6 matching placemats resist-dyed with natural indigo.", "Home Furnishings", "Dining Linens", "100% Cotton", "Pochampally Weave", "Indigo & Cream", "180cm x 35cm", "520g", "1 day", 950.00, 35, "/static/demo/runner.jpg"),
            ("prod-42", "sel-2", "Hand-Turned Wooden Aromatherapy Diffuser", "Porous lacquer-free wooden scent pot for essential oils.", "Home Decor & Pottery", "Wellness", "Cedar & Ivory Wood", "Channapatna Turnery", "Natural Wood", "12cm x 8cm", "180g", "1 day", 350.00, 100, "/static/demo/diffuser.jpg"),
            ("prod-43", "sel-4", "Hand-Stitched Leather Desk Blotter & Mousepad", "Full-grain vegetable-tanned desk pad with burnished beveled edges.", "Office & Stationery", "Desk Accessories", "Buff Leather", "Leathercraft", "Cognac Tan", "60cm x 40cm", "650g", "2 days", 1350.00, 40, "/static/demo/desk_pad.jpg"),
            ("prod-44", "sel-8", "Eco-Friendly Jute & Hand-Tooled Leather Tote Bag", "Hybrid eco-friendly tote blending natural golden jute fiber with sturdy leather handles.", "Bags & Totes", "Bags", "Jute & Buff Leather", "Artisan Stitched", "Natural Golden & Tan", "40cm x 35cm x 12cm", "450g", "2 days", 480.00, 120, "/static/demo/jute_bag.jpg"),
            ("prod-45", "sel-8", "Handmade Jute Conference Folder & Notebook", "Corporate eco-stationery folder with recycled handmade cotton paper insert.", "Office & Stationery", "Folders", "Natural Jute & Handmade Paper", "Eco Handcrafted", "Natural Beige", "32cm x 24cm", "380g", "1 day", 280.00, 250, "/static/demo/folder.jpg"),
            ("prod-46", "sel-10", "Dhokra Tribal Elephant Pen Stand", "Cast bell metal desk organizer shaped like an adorned ceremonial elephant.", "Office & Stationery", "Organizers", "Recycled Brass", "Dhokra Casting", "Antique Patina", "14cm x 10cm x 6cm", "550g", "2 days", 890.00, 30, "/static/demo/dhokra_elephant.jpg"),
            ("prod-47", "sel-12", "Hammered Copper Water Bottle with Brass Cap", "Ayurvedic seamless pure copper wellness vessel with leakproof threaded seal.", "Kitchen & Dining", "Drinkware", "Pure Copper & Brass", "Hand-Hammered Metal", "Warm Copper Glow", "900ml Capacity", "340g", "1 day", 750.00, 90, "/static/demo/copper_bottle.jpg"),
            ("prod-48", "sel-17", "Sheesham Wood Cell Phone & Tablet Stand", "Ergonomic desk stand with cable pass-through slot and hand-carved floral accents.", "Office & Stationery", "Accessories", "Sheesham Wood", "Wood Carving", "Natural Matte", "14cm x 9cm", "210g", "1 day", 260.00, 150, "/static/demo/phone_stand.jpg"),
            ("prod-49", "sel-19", "Warangal Ikat Striped Yoga Mat Rug", "Eco-friendly, sweat-absorbent cotton woven yoga mat with non-slip natural rubber backing.", "Wellness & Fitness", "Mats", "Heavy Twisted Cotton", "Flat Weave", "Forest Green & Ecru", "180cm x 60cm", "1400g", "2 days", 1150.00, 45, "/static/demo/yoga_mat.jpg"),
            ("prod-50", "sel-3", "Handcrafted Blue Pottery Essential Oil Burner", "Two-piece ceramic burner featuring pierced star motifs casting ambient candlelight.", "Home Decor & Pottery", "Aromatherapy", "Quartz Glazed Clay", "Jaipur Blue Pottery", "Turquoise", "14cm Height", "420g", "2 days", 550.00, 50, "/static/demo/oil_burner.jpg")
        ]

        for pid, sid, pname, pdesc, pcat, psub, pmat, pcraft, pcol, pdim, pwt, ptime, pprice, pqty, pimg in products_data:
            prod = Product(
                id=pid,
                seller_id=sid,
                name=pname,
                description=pdesc,
                category=pcat,
                subcategory=psub,
                material=pmat,
                craft_type=pcraft,
                color=pcol,
                dimensions=pdim,
                weight=pwt,
                production_time=ptime,
                price=pprice,
                quantity=pqty,
                status="PUBLISHED",
                quality_score=92,
                ai_confidence=0.94,
                verified_product=True
            )
            db.add(prod)
            # Add product image
            db.add(ProductImage(
                product_id=pid,
                raw_image_url=pimg,
                enhanced_image_url=pimg,
                is_primary=True
            ))
            # Add AI analysis record
            db.add(ProductAIAnalysis(
                product_id=pid,
                sharpness_score=94,
                lighting_score=90,
                background_score=92,
                overall_score=92,
                recommendation_tip="Optimal photo quality with clear weave detail.",
                detected_objects=f'["{pcraft}", "{pmat}", "{pcat}"]'
            ))
            # Add Explainable Pricing prediction
            mat_cost = round(float(pprice) * 0.40, 2)
            lab_cost = round(float(pprice) * 0.30, 2)
            margin = round(float(pprice) * 0.20, 2)
            pack_cost = 50.0
            db.add(PricingPrediction(
                product_id=pid,
                material_cost=mat_cost,
                labour_hours=12.0,
                labour_cost=lab_cost,
                packaging_cost=pack_cost,
                shipping_cost=80.0,
                desired_margin=margin,
                demand_premium=round(float(pprice) * 0.10, 2),
                market_average=pprice,
                recommended_price=pprice,
                min_price=round(pprice * 0.85, 2),
                max_price=round(pprice * 1.25, 2),
                confidence=0.91,
                explanation=f"Material (₹{mat_cost}) + Labour (₹{lab_cost}) + Packaging (₹{pack_cost}) + Margin (₹{margin})."
            ))

        db.commit()

        # ------------------------------------------------------------------
        # 5. RFQs and B2B Negotiations
        # ------------------------------------------------------------------
        # Active RFQ 1: Corporate procurement of Jute/Handloom Bags
        rfq1 = RFQ(
            id="rfq-101",
            buyer_id="buy-1",
            target_product_id="prod-44",
            category="Bags & Totes",
            quantity=100,
            target_price=280.00,
            delivery_deadline=datetime.now(timezone.utc) + timedelta(days=21),
            delivery_location="Bengaluru, Karnataka (Whitefield Hub)",
            custom_requirements="Custom silk-screened company logo on inner pocket. Eco-friendly packaging.",
            notes="Ready to place regular quarterly follow-up orders if quality meets requirements.",
            status="OPEN"
        )
        db.add(rfq1)

        # Active RFQ 2: Blue Pottery Corporate Gift Coasters
        rfq2 = RFQ(
            id="rfq-102",
            buyer_id="buy-3",
            target_product_id="prod-9",
            category="Home Decor & Pottery",
            quantity=250,
            target_price=480.00,
            delivery_deadline=datetime.now(timezone.utc) + timedelta(days=30),
            delivery_location="New Delhi, Delhi",
            custom_requirements="Custom gift presentation box with artisan authentication card.",
            notes="For Diwali executive corporate gifting.",
            status="OPEN"
        )
        db.add(rfq2)

        # RFQ 3: Pochampally Handloom Dupattas for Boutique Chain
        rfq3 = RFQ(
            id="rfq-103",
            buyer_id="buy-2",
            target_product_id="prod-2",
            category="Textiles & Apparels",
            quantity=50,
            target_price=720.00,
            delivery_deadline=datetime.now(timezone.utc) + timedelta(days=15),
            delivery_location="Mumbai, Maharashtra",
            custom_requirements="Natural indigo and madder red palette.",
            status="MATCHED"
        )
        db.add(rfq3)

        # Add RFQ Response with AI counter-offer recommendation
        db.add(RFQResponse(
            id="resp-201",
            rfq_id="rfq-101",
            seller_id="sel-1",
            quoted_price=320.00,
            quantity=100,
            delivery_date=datetime.now(timezone.utc) + timedelta(days=18),
            message="We can fulfill 100 bags using authentic handloom accents. Countering at ₹320 based on fair artisan labor.",
            ai_suggested_counter=320.00,
            status="COUNTERED"
        ))

        # ------------------------------------------------------------------
        # 6. Commercial Orders
        # ------------------------------------------------------------------
        order1 = Order(
            id="ord-501",
            buyer_id="buy-1",
            seller_id="sel-1",
            rfq_id="rfq-103",
            total_amount=36000.00,
            status="SHIPPED",
            payment_status="ESCROW_HELD",
            shipping_status="IN_TRANSIT",
            tracking_number="IND-POST-TE-984210"
        )
        db.add(order1)
        db.add(OrderItem(
            order_id="ord-501",
            product_id="prod-2",
            unit_price=720.00,
            quantity=50,
            total_price=36000.00
        ))
        db.add(Payment(
            order_id="ord-501",
            amount=36000.00,
            provider="DEMO_ESCROW",
            transaction_ref="TXN_ESCROW_984210",
            status="SUCCESS"
        ))

        # Order 2: Delivered historical order contributing to Savita's ₹42,850 sales
        order2 = Order(
            id="ord-502",
            buyer_id="buy-4",
            seller_id="sel-1",
            total_amount=42850.00,
            status="DELIVERED",
            payment_status="RELEASED",
            shipping_status="DELIVERED",
            tracking_number="IND-POST-TE-884112"
        )
        db.add(order2)

        db.commit()
        print(f"Successfully initialized and populated {DEMO_DATA_BANNER}!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding demo database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    populate_demo_database()
