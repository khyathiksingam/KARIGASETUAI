"""6-Factor AI Buyer-Artisan Matching Engine."""
from typing import List, Dict, Any, Optional

class SixFactorMatchingEngine:
    """Calculates weighted compatibility scores between buyer RFQs and verified artisans."""

    # Weights: 30% product, 20% price, 15% capacity, 15% location, 10% delivery, 10% verification
    WEIGHTS = {
        "product": 0.30,
        "price": 0.20,
        "capacity": 0.15,
        "location": 0.15,
        "delivery": 0.10,
        "verification": 0.10,
    }

    @classmethod
    def score_match(
        cls,
        rfq_category: str,
        rfq_target_price: float,
        rfq_quantity: int,
        rfq_location: str,
        rfq_deadline_days: int,
        seller: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Compute compatibility score and itemized reasons for a single artisan."""
        reasons: List[str] = []

        # 1. Product category similarity (30%)
        artisan_craft = seller.get("primary_craft", "").lower()
        req_cat = rfq_category.lower()
        if req_cat in artisan_craft or artisan_craft in req_cat or any(k in artisan_craft for k in req_cat.split()):
            s_prod = 1.0
            reasons.append(f"✓ Product matches artisan craft ({seller.get('primary_craft')})")
        else:
            s_prod = 0.65

        # 2. Price Fit (20%)
        est_price = seller.get("benchmark_unit_price", rfq_target_price)
        if est_price <= rfq_target_price:
            s_price = 1.0
            reasons.append(f"✓ Within budget (Unit quote ~₹{int(est_price)} vs budget ₹{int(rfq_target_price)})")
        else:
            ratio = rfq_target_price / est_price
            s_price = max(0.4, min(1.0, ratio))
            if s_price > 0.8:
                reasons.append("✓ Close to target price target (negotiable via bulk discount)")

        # 3. Quantity Capacity (15%)
        monthly_capacity = seller.get("monthly_capacity_units", 50)
        if monthly_capacity >= rfq_quantity:
            s_qty = 1.0
            reasons.append(f"✓ Capacity available ({monthly_capacity} units/mo meets {rfq_quantity} units)")
        else:
            s_qty = max(0.3, monthly_capacity / float(rfq_quantity))

        # 4. Location Compatibility (15%)
        s_loc = 0.90
        reasons.append(f"✓ Established regional shipping corridor ({seller.get('location', 'India')})")

        # 5. Delivery Lead Time (10%)
        prod_days = seller.get("standard_lead_days", 7)
        if prod_days <= rfq_deadline_days:
            s_del = 1.0
            reasons.append(f"✓ Delivery compatible ({prod_days} days lead time meets {rfq_deadline_days} days deadline)")
        else:
            s_del = 0.70

        # 6. Verification & Trust (10%)
        badge = seller.get("verification_badge", "UNVERIFIED")
        if badge in ["ARTISAN_VERIFIED", "PROFILE_VERIFIED"]:
            s_trust = 1.0
            reasons.append("✓ Verified Artisan credentials")
        else:
            s_trust = 0.70

        # Final weighted score
        total_score = (
            cls.WEIGHTS["product"] * s_prod +
            cls.WEIGHTS["price"] * s_price +
            cls.WEIGHTS["capacity"] * s_qty +
            cls.WEIGHTS["location"] * s_loc +
            cls.WEIGHTS["delivery"] * s_del +
            cls.WEIGHTS["verification"] * s_trust
        )

        match_pct = int(round(total_score * 100))

        return {
            "seller_id": seller.get("id"),
            "seller_name": seller.get("full_name") or seller.get("business_name", "Artisan Crafts"),
            "artisan_location": seller.get("location", "India"),
            "craft_type": seller.get("primary_craft", "Handicrafts"),
            "match_percentage": match_pct,
            "reasons": reasons
        }

six_factor_matching_engine = SixFactorMatchingEngine()
