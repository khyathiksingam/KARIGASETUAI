"""Explainable Cost-Plus AI Pricing Engine for Artisans."""
from typing import Dict, Any, List

# Category baseline market benchmarks across India
BENCHMARK_RANGES = {
    "Leather Goods": {"min": 1000.0, "avg": 1250.0, "max": 1600.0, "demand_factor": 0.15},
    "Bags": {"min": 950.0, "avg": 1199.0, "max": 1450.0, "demand_factor": 0.18},
    "Textiles & Apparels": {"min": 2800.0, "avg": 3850.0, "max": 4800.0, "demand_factor": 0.12},
    "Sarees": {"min": 3000.0, "avg": 3950.0, "max": 5200.0, "demand_factor": 0.14},
    "Wooden Toys & Decor": {"min": 400.0, "avg": 650.0, "max": 950.0, "demand_factor": 0.08},
    "Home Decor & Pottery": {"min": 600.0, "avg": 950.0, "max": 1400.0, "demand_factor": 0.10},
    "Default": {"min": 500.0, "avg": 900.0, "max": 1500.0, "demand_factor": 0.10},
}

class ExplainablePricingEngine:
    """Calculates fair, transparent selling price recommendations with clear cost breakdown."""

    @staticmethod
    def calculate_price(
        material_cost: float,
        labour_hours: float,
        labour_rate_per_hour: float = 50.0,
        packaging_cost: float = 50.0,
        shipping_cost: float = 80.0,
        desired_margin_percent: float = 25.0,
        category: str = "Bags",
        craft_type: str = "Handcrafted"
    ) -> Dict[str, Any]:
        """Compute recommended price, bounds, expected margin, and itemized justification."""
        labour_cost = round(labour_hours * labour_rate_per_hour, 2)
        base_production_cost = round(material_cost + labour_cost + packaging_cost + shipping_cost, 2)

        # Retrieve category market benchmark
        benchmark = BENCHMARK_RANGES.get(category, BENCHMARK_RANGES["Default"])
        demand_adjustment = round(base_production_cost * benchmark["demand_factor"], 2)

        # Compute fair artisan margin
        margin_multiplier = desired_margin_percent / 100.0
        calculated_margin = round(base_production_cost * margin_multiplier, 2)

        # Final raw recommended price
        raw_recommended = base_production_cost + demand_adjustment + calculated_margin

        # Round to neat Indian retail pricing ending (e.g. 99, 50, or 00)
        recommended_price = float(int(raw_recommended // 50) * 50 - 1 if raw_recommended > 200 else round(raw_recommended, 0))
        if recommended_price < base_production_cost + 100:
            recommended_price = float(round(base_production_cost * 1.30, 0))

        min_price = float(round(max(base_production_cost * 1.10, benchmark["min"]), 0))
        max_price = float(round(max(recommended_price * 1.25, benchmark["max"]), 0))
        expected_margin = float(round(recommended_price - base_production_cost, 2))

        # Itemized breakdown list
        breakdown = [
            {"component": "Raw Materials", "amount": float(material_cost), "description": "Fabrics, yarn, dyes, hardware"},
            {"component": f"Artisan Labour ({labour_hours} hrs)", "amount": float(labour_cost), "description": f"Fair wage @ ₹{labour_rate_per_hour}/hr"},
            {"component": "Packaging & Box", "amount": float(packaging_cost), "description": "Protective eco-friendly packaging"},
            {"component": "Handling / Shipping", "amount": float(shipping_cost), "description": "Local transit & drop-off"},
            {"component": "Market Demand Premium", "amount": float(demand_adjustment), "description": f"+{int(benchmark['demand_factor']*100)}% seasonal velocity"},
            {"component": "Fair Artisan Margin", "amount": float(calculated_margin), "description": f"{desired_margin_percent}% sustainable profit"},
        ]

        explanation = (
            f"Material cost +₹{int(material_cost)} | Labour +₹{int(labour_cost)} | "
            f"Packaging +₹{int(packaging_cost)} | Shipping +₹{int(shipping_cost)} | "
            f"Market demand +₹{int(demand_adjustment)} | Desired Margin +₹{int(calculated_margin)}. "
            f"Recommended price: ₹{int(recommended_price)} (Estimates only; not guaranteed)."
        )

        return {
            "recommended_price": recommended_price,
            "min_price": min_price,
            "max_price": max_price,
            "expected_margin": expected_margin,
            "confidence": 0.88,
            "breakdown": breakdown,
            "explanation": explanation
        }

explainable_pricing_engine = ExplainablePricingEngine()
