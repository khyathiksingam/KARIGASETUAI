"""Artisan / Seller profile and 3D dashboard endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_token_payload
from app.models.models import SellerProfile, Product, RFQResponse
from app.schemas.schemas import (
    SellerProfileResponse, SellerProfileUpdate, SellerDashboardResponse,
    HeroSalesData, SellerDashboardKPIs, AIBusinessInsight
)

router = APIRouter(prefix="/seller", tags=["Seller & Artisan"])

@router.get("/profile", response_model=SellerProfileResponse)
def get_seller_profile(
    db: Session = Depends(get_db),
    auth: dict = Depends(get_current_token_payload)
):
    """Retrieve active artisan's business profile and readiness scores."""
    user_id = auth.get("sub", "user-seller-demo")
    profile = db.query(SellerProfile).filter_by(user_id=user_id).first()
    if not profile:
        # Fallback to default demo seller
        profile = db.query(SellerProfile).filter_by(id="sel-1").first()
    if not profile:
        raise HTTPException(status_code=404, detail="Artisan profile not found.")
    return profile

@router.put("/profile", response_model=SellerProfileResponse)
def update_seller_profile(
    payload: SellerProfileUpdate,
    db: Session = Depends(get_db),
    auth: dict = Depends(get_current_token_payload)
):
    """Update artisan craft capacity and business details."""
    user_id = auth.get("sub", "user-seller-demo")
    profile = db.query(SellerProfile).filter_by(user_id=user_id).first()
    if not profile:
        profile = db.query(SellerProfile).filter_by(id="sel-1").first()
    if not profile:
        raise HTTPException(status_code=404, detail="Artisan profile not found.")

    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    return profile

@router.get("/dashboard", response_model=SellerDashboardResponse)
def get_seller_dashboard(
    db: Session = Depends(get_db),
    auth: dict = Depends(get_current_token_payload)
):
    """Returns the hero 3D dashboard metrics, monthly sales, animated curve, and AI business insights."""
    user_id = auth.get("sub", "user-seller-demo")
    profile = db.query(SellerProfile).filter_by(user_id=user_id).first()
    if not profile:
        profile = db.query(SellerProfile).filter_by(id="sel-1").first()

    name = profile.full_name.split()[0] if profile else "Savita"

    # Count real products or return hero baseline
    prod_count = db.query(Product).count()
    rfq_count = db.query(RFQResponse).count()

    return SellerDashboardResponse(
        artisan_name=name,
        greeting=f"Good Morning, {name} 👋",
        subtitle="Your craft is ready for the world.",
        hero_sales=HeroSalesData(
            monthly_sales_inr=42850.0,
            growth_percentage=18.4,
            chart_series=[28000.0, 31500.0, 36200.0, 39400.0, 42850.0]
        ),
        kpis=SellerDashboardKPIs(
            products_count=max(prod_count, 24),
            buyers_count=18,
            pending_rfqs=max(rfq_count, 3)
        ),
        ai_business_insight=AIBusinessInsight(
            title="✨ AI BUSINESS INSIGHT",
            message="Demand for your handmade bags increased this week (+28%). Consider producing more.",
            action_label="View Insight"
        )
    )
