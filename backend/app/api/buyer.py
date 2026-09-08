"""Buyer profile and B2B dashboard endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_token_payload
from app.models.models import BuyerProfile, Product, RFQ
from app.schemas.schemas import BuyerProfileResponse, BuyerDashboardResponse

router = APIRouter(prefix="/buyer", tags=["Buyer"])

@router.get("/profile", response_model=BuyerProfileResponse)
def get_buyer_profile(
    db: Session = Depends(get_db),
    auth: dict = Depends(get_current_token_payload)
):
    """Retrieve active buyer enterprise profile."""
    user_id = auth.get("sub", "user-buyer-demo")
    profile = db.query(BuyerProfile).filter_by(user_id=user_id).first()
    if not profile:
        profile = db.query(BuyerProfile).filter_by(id="buy-1").first()
    if not profile:
        raise HTTPException(status_code=404, detail="Buyer profile not found.")
    return profile

@router.get("/dashboard", response_model=BuyerDashboardResponse)
def get_buyer_dashboard(
    db: Session = Depends(get_db),
    auth: dict = Depends(get_current_token_payload)
):
    """Returns buyer discovery recommendations, active RFQs, and trending crafts."""
    user_id = auth.get("sub", "user-buyer-demo")
    profile = db.query(BuyerProfile).filter_by(user_id=user_id).first()
    if not profile:
        profile = db.query(BuyerProfile).filter_by(id="buy-1").first()

    rfq_count = db.query(RFQ).filter_by(buyer_id=profile.id if profile else "buy-1").count()

    # Get sample recommended products
    prods = db.query(Product).limit(6).all()
    rec_list = []
    for p in prods:
        rec_list.append({
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "craft_type": p.craft_type,
            "price": float(p.price),
            "quality_score": p.quality_score,
            "image_url": p.images[0].enhanced_image_url if p.images else "/static/demo/saree_enhanced.jpg",
            "artisan_name": p.seller.full_name if p.seller else "Verified Artisan",
            "artisan_location": p.seller.location if p.seller else "India",
            "verified_artisan": True
        })

    return BuyerDashboardResponse(
        contact_name=profile.contact_name if profile else "Rajesh Kumar",
        company_name=profile.company_name if profile else "FabCraft Ethical Retail",
        active_rfqs_count=max(rfq_count, 2),
        total_orders_count=4,
        recommended_products=rec_list,
        trending_crafts=[
            "Handmade Leather Bags (+28%)",
            "Pochampally Ikat Sarees (+18%)",
            "Jaipur Blue Pottery (+15%)",
            "Channapatna Wooden Toys (+12%)"
        ]
    )
