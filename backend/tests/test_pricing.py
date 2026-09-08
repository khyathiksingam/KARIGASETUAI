"""Unit tests for Explainable AI Pricing Engine."""
import pytest
from app.services.pricing_engine import explainable_pricing_engine

def test_pricing_calculation_basic():
    """Test cost-plus calculation for handmade bag."""
    res = explainable_pricing_engine.calculate_price(
        material_cost=420.0,
        labour_hours=6.0,
        labour_rate_per_hour=50.0,
        packaging_cost=50.0,
        shipping_cost=80.0,
        desired_margin_percent=25.0,
        category="Bags"
    )

    assert "recommended_price" in res
    assert "breakdown" in res
    assert "explanation" in res
    assert res["recommended_price"] > 0
    assert res["min_price"] <= res["recommended_price"] <= res["max_price"]
    assert res["expected_margin"] > 0
    assert len(res["breakdown"]) == 6

def test_pricing_zero_labour_fallback():
    """Test edge case with minimal costs."""
    res = explainable_pricing_engine.calculate_price(
        material_cost=100.0,
        labour_hours=1.0,
        labour_rate_per_hour=50.0,
        packaging_cost=20.0,
        shipping_cost=30.0,
        desired_margin_percent=20.0,
        category="Wooden Toys & Decor"
    )
    assert res["recommended_price"] >= 200.0
    assert res["confidence"] >= 0.80
