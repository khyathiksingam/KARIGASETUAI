"""Integration tests for KARIGASETU AI FastAPI Endpoints."""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_and_docs():
    """Verify landing page and swagger documentation are accessible."""
    res = client.get("/")
    assert res.status_code == 200
    assert "KARIGASETU AI" in res.text

    res_docs = client.get("/docs")
    assert res_docs.status_code == 200

def test_demo_auth_flow():
    """Test demo login switch for judges."""
    res = client.post("/api/v1/auth/demo-login", json={"role": "SELLER"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "SELLER"

def test_seller_dashboard():
    """Test 3D hero dashboard data endpoint."""
    res = client.get("/api/v1/seller/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert "hero_sales" in data
    assert data["hero_sales"]["monthly_sales_inr"] == 42850.0
    assert data["hero_sales"]["growth_percentage"] == 18.4
    assert len(data["hero_sales"]["chart_series"]) > 0

def test_natural_language_search():
    """Test buyer natural language search parser."""
    res = client.get("/api/v1/search/products?q=100 handmade bags under 1200")
    assert res.status_code == 200
    products = res.json()
    assert isinstance(products, list)
    assert len(products) > 0

def test_ai_suggest_price_endpoint():
    """Test price suggestion API endpoint."""
    payload = {
        "material_cost": 420.0,
        "labour_hours": 6.0,
        "labour_rate_per_hour": 50.0,
        "packaging_cost": 50.0,
        "shipping_cost": 80.0,
        "desired_margin_percent": 25.0,
        "category": "Bags"
    }
    res = client.post("/api/v1/ai/suggest-price", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["recommended_price"] > 0
    assert "explanation" in data

def test_admin_cluster_map_endpoint():
    """Test 2.5D cluster map data endpoint."""
    res = client.get("/api/v1/admin/clusters")
    assert res.status_code == 200
    clusters = res.json()
    assert len(clusters) >= 10
    assert any(c["state"] == "Telangana" for c in clusters)
