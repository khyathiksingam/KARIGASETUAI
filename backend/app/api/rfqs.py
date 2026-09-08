"""B2B Request For Quotation (RFQ) and negotiation endpoints."""
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_token_payload
from app.models.models import RFQ, RFQResponse, BuyerProfile, SellerProfile, Product
from app.schemas.schemas import RFQCreate, RFQResponseCreate, RFQDetailResponse, RFQResponseItem

router = APIRouter(prefix="/rfqs", tags=["B2B RFQs & Negotiations"])

@router.post("", response_model=RFQDetailResponse, status_code=status.HTTP_201_CREATED)
def create_rfq(
    payload: RFQCreate,
    db: Session = Depends(get_db),
    auth: dict = Depends(get_current_token_payload)
):
    """Buyer submits a bulk B2B Request For Quotation."""
    user_id = auth.get("sub", "user-buyer-demo")
    buyer = db.query(BuyerProfile).filter_by(user_id=user_id).first()
    if not buyer:
        buyer = db.query(BuyerProfile).filter_by(id="buy-1").first()

    deadline = datetime.now(timezone.utc) + timedelta(days=payload.delivery_deadline_days)

    rfq = RFQ(
        buyer_id=buyer.id,
        target_product_id=payload.product_id,
        category=payload.category,
        quantity=payload.quantity,
        target_price=payload.target_price,
        delivery_deadline=deadline,
        delivery_location=payload.delivery_location,
        custom_requirements=payload.custom_requirements,
        notes=payload.notes,
        status="OPEN"
    )
    db.add(rfq)
    db.commit()
    db.refresh(rfq)

    prod_name = None
    if payload.product_id:
        p = db.query(Product).filter_by(id=payload.product_id).first()
        if p:
            prod_name = p.name

    return RFQDetailResponse(
        id=rfq.id,
        buyer_id=buyer.id,
        buyer_name=buyer.company_name,
        category=rfq.category,
        product_id=rfq.target_product_id,
        product_name=prod_name,
        quantity=rfq.quantity,
        target_price=float(rfq.target_price),
        delivery_deadline=rfq.delivery_deadline,
        delivery_location=rfq.delivery_location,
        custom_requirements=rfq.custom_requirements,
        status=rfq.status,
        created_at=rfq.created_at,
        responses=[]
    )

@router.get("", response_model=List[RFQDetailResponse])
def list_rfqs(db: Session = Depends(get_db)):
    """List open and matched RFQs."""
    rfqs = db.query(RFQ).order_by(RFQ.created_at.desc()).all()
    results = []
    for r in rfqs:
        p_name = r.target_product_id
        if r.target_product_id:
            p = db.query(Product).filter_by(id=r.target_product_id).first()
            p_name = p.name if p else None

        resp_items = []
        for resp in r.responses:
            resp_items.append(RFQResponseItem(
                id=resp.id,
                seller_id=resp.seller_id,
                seller_name=resp.seller.full_name if resp.seller else "Artisan",
                quoted_price=float(resp.quoted_price),
                quantity=resp.quantity,
                delivery_date=resp.delivery_date,
                message=resp.message,
                status=resp.status
            ))

        results.append(RFQDetailResponse(
            id=r.id,
            buyer_id=r.buyer_id,
            buyer_name=r.buyer.company_name if r.buyer else "Institutional Buyer",
            category=r.category,
            product_id=r.target_product_id,
            product_name=p_name,
            quantity=r.quantity,
            target_price=float(r.target_price),
            delivery_deadline=r.delivery_deadline,
            delivery_location=r.delivery_location,
            custom_requirements=r.custom_requirements,
            status=r.status,
            created_at=r.created_at,
            responses=resp_items
        ))
    return results

@router.get("/{id}", response_model=RFQDetailResponse)
def get_rfq(id: str, db: Session = Depends(get_db)):
    """Retrieve single RFQ details with responses and negotiation history."""
    r = db.query(RFQ).filter_by(id=id).first()
    if not r:
        raise HTTPException(status_code=404, detail="RFQ not found.")

    p_name = None
    if r.target_product_id:
        p = db.query(Product).filter_by(id=r.target_product_id).first()
        p_name = p.name if p else None

    resp_items = []
    for resp in r.responses:
        resp_items.append(RFQResponseItem(
            id=resp.id,
            seller_id=resp.seller_id,
            seller_name=resp.seller.full_name if resp.seller else "Artisan",
            quoted_price=float(resp.quoted_price),
            quantity=resp.quantity,
            delivery_date=resp.delivery_date,
            message=resp.message,
            status=resp.status
        ))

    return RFQDetailResponse(
        id=r.id,
        buyer_id=r.buyer_id,
        buyer_name=r.buyer.company_name if r.buyer else "Buyer",
        category=r.category,
        product_id=r.target_product_id,
        product_name=p_name,
        quantity=r.quantity,
        target_price=float(r.target_price),
        delivery_deadline=r.delivery_deadline,
        delivery_location=r.delivery_location,
        custom_requirements=r.custom_requirements,
        status=r.status,
        created_at=r.created_at,
        responses=resp_items
    )

@router.post("/{id}/respond")
def respond_to_rfq(
    id: str,
    payload: RFQResponseCreate,
    db: Session = Depends(get_db),
    auth: dict = Depends(get_current_token_payload)
):
    """Artisan responds to RFQ with quotation or counter-offer."""
    rfq = db.query(RFQ).filter_by(id=id).first()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found.")

    user_id = auth.get("sub", "user-seller-demo")
    seller = db.query(SellerProfile).filter_by(user_id=user_id).first()
    if not seller:
        seller = db.query(SellerProfile).filter_by(id="sel-1").first()

    del_date = datetime.now(timezone.utc) + timedelta(days=payload.delivery_days)

    resp = RFQResponse(
        rfq_id=rfq.id,
        seller_id=seller.id,
        quoted_price=payload.quoted_price,
        quantity=payload.quantity,
        delivery_date=del_date,
        message=payload.message or "Quotation submitted by artisan.",
        status="COUNTERED" if payload.quoted_price != rfq.target_price else "ACCEPTED"
    )
    db.add(resp)
    rfq.status = "MATCHED"
    db.commit()
    db.refresh(resp)

    return {
        "status": "SUCCESS",
        "response_id": resp.id,
        "rfq_id": rfq.id,
        "quoted_price": float(resp.quoted_price),
        "status_code": resp.status,
        "message": "Quotation submitted successfully."
    }
