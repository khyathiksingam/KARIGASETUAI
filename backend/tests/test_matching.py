"""Unit tests for 6-Factor AI Buyer-Artisan Matching Engine."""
import pytest
from app.services.matching_engine import six_factor_matching_engine

def test_six_factor_matching_high_compatibility():
    """Verify high match percentage when category, price, capacity, and credentials align."""
    artisan = {
        "id": "sel-1",
        "full_name": "Savita Devi",
        "primary_craft": "Handloom Bags & Textiles",
        "monthly_capacity_units": 200,
        "location": "Pochampally, Telangana",
        "verification_badge": "ARTISAN_VERIFIED",
        "benchmark_unit_price": 450.0,
        "standard_lead_days": 10
    }

    match = six_factor_matching_engine.score_match(
        rfq_category="Handloom Bags",
        rfq_target_price=500.0,
        rfq_quantity=100,
        rfq_location="Bengaluru",
        rfq_deadline_days=14,
        seller=artisan
    )

    assert match["match_percentage"] >= 85
    assert len(match["reasons"]) >= 4
    assert any("Product matches" in r for r in match["reasons"])
    assert any("Within budget" in r for r in match["reasons"])

def test_six_factor_matching_capacity_shortfall():
    """Verify lower match percentage when artisan capacity is below requested bulk quantity."""
    artisan = {
        "id": "sel-2",
        "full_name": "Artisan Small Guild",
        "primary_craft": "Woodcraft",
        "monthly_capacity_units": 20,  # Small capacity
        "location": "Kerala",
        "verification_badge": "UNVERIFIED",
        "benchmark_unit_price": 800.0,
        "standard_lead_days": 30
    }

    match = six_factor_matching_engine.score_match(
        rfq_category="Silk Sarees",
        rfq_target_price=400.0,
        rfq_quantity=500,  # Far exceeds 20 units
        rfq_location="Delhi",
        rfq_deadline_days=10,
        seller=artisan
    )

    assert match["match_percentage"] < 70
