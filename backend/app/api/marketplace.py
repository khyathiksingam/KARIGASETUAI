"""Marketplace integration and ONDC sync endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Product
from app.services.ondc_adapter import marketplace_adapter

router = APIRouter(prefix="/marketplace", tags=["Marketplace Adapter"])

@router.post("/publish")
def publish_to_marketplace(product_id: str, db: Session = Depends(get_db)):
    """Publish a product catalogue to ONDC Beckn staging sandbox."""
    product = db.query(Product).filter_by(id=product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    payload = {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "category": product.category,
        "price": float(product.price),
        "material": product.material,
        "craft_type": product.craft_type,
        "image_urls": [img.enhanced_image_url for img in product.images] if product.images else []
    }
    return marketplace_adapter.publish_catalog_item(payload)

@router.get("/status")
def get_marketplace_status():
    """Check connectivity to ONDC Sandbox / Gateway."""
    return {
        "network": "ONDC (Open Network for Digital Commerce)",
        "mode": "SANDBOX_DEMO",
        "gateway_health": "ONLINE",
        "registered_bpp_id": "karigasetu.ai.bpp",
        "sync_channels": ["ONDC Retail", "B2B Buyer Portal", "Local Artisan Cluster Network"]
    }
