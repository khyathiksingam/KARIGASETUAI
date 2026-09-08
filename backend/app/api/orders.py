"""Order lifecycle management endpoints."""
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_token_payload
from app.models.models import Order, OrderItem, Payment, BuyerProfile, SellerProfile, Product
from app.schemas.schemas import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders"])

VALID_STATUSES = ["PENDING", "ACCEPTED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    auth: dict = Depends(get_current_token_payload)
):
    """Place a commercial purchase order."""
    user_id = auth.get("sub", "user-buyer-demo")
    buyer = db.query(BuyerProfile).filter_by(user_id=user_id).first()
    if not buyer:
        buyer = db.query(BuyerProfile).filter_by(id="buy-1").first()

    seller = db.query(SellerProfile).filter_by(id=payload.seller_id).first()
    if not seller:
        raise HTTPException(status_code=404, detail="Artisan seller not found.")

    total = payload.quantity * payload.unit_price

    order = Order(
        buyer_id=buyer.id,
        seller_id=seller.id,
        rfq_id=payload.rfq_id,
        total_amount=total,
        status="PENDING",
        payment_status="ESCROW_HELD",
        shipping_status="NOT_DISPATCHED",
        tracking_number=f"IND-POST-{uuid.uuid4().hex[:8].upper()}"
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # Add order item
    db.add(OrderItem(
        order_id=order.id,
        product_id=payload.product_id,
        unit_price=payload.unit_price,
        quantity=payload.quantity,
        total_price=total
    ))

    # Add demo escrow payment
    db.add(Payment(
        order_id=order.id,
        amount=total,
        provider="DEMO_ESCROW",
        transaction_ref=f"TXN_ESCROW_{uuid.uuid4().hex[:10].upper()}",
        status="SUCCESS"
    ))
    db.commit()
    db.refresh(order)

    return OrderResponse(
        id=order.id,
        buyer_id=order.buyer_id,
        buyer_name=buyer.company_name,
        seller_id=order.seller_id,
        seller_name=seller.full_name,
        total_amount=float(order.total_amount),
        status=order.status,
        payment_status=order.payment_status,
        shipping_status=order.shipping_status,
        tracking_number=order.tracking_number,
        created_at=order.created_at
    )

@router.get("", response_model=List[OrderResponse])
def list_orders(
    db: Session = Depends(get_db),
    auth: dict = Depends(get_current_token_payload)
):
    """Retrieve orders for the active buyer or seller."""
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    results = []
    for o in orders:
        results.append(OrderResponse(
            id=o.id,
            buyer_id=o.buyer_id,
            buyer_name=o.buyer.company_name if o.buyer else "Buyer",
            seller_id=o.seller_id,
            seller_name=o.seller.full_name if o.seller else "Artisan",
            total_amount=float(o.total_amount),
            status=o.status,
            payment_status=o.payment_status,
            shipping_status=o.shipping_status,
            tracking_number=o.tracking_number,
            created_at=o.created_at
        ))
    return results

@router.get("/{id}", response_model=OrderResponse)
def get_order(id: str, db: Session = Depends(get_db)):
    """Retrieve details and fulfillment tracking for a specific order."""
    o = db.query(Order).filter_by(id=id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Order not found.")

    return OrderResponse(
        id=o.id,
        buyer_id=o.buyer_id,
        buyer_name=o.buyer.company_name if o.buyer else "Buyer",
        seller_id=o.seller_id,
        seller_name=o.seller.full_name if o.seller else "Artisan",
        total_amount=float(o.total_amount),
        status=o.status,
        payment_status=o.payment_status,
        shipping_status=o.shipping_status,
        tracking_number=o.tracking_number,
        created_at=o.created_at
    )

@router.put("/{id}/status", response_model=OrderResponse)
def update_order_status(id: str, new_status: str, db: Session = Depends(get_db)):
    """Transition order status through fulfillment stages."""
    status_upper = new_status.upper()
    if status_upper not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Choose from: {VALID_STATUSES}")

    o = db.query(Order).filter_by(id=id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Order not found.")

    o.status = status_upper
    if status_upper == "SHIPPED":
        o.shipping_status = "IN_TRANSIT"
    elif status_upper == "DELIVERED":
        o.shipping_status = "DELIVERED"
        o.payment_status = "RELEASED"

    db.commit()
    db.refresh(o)

    return OrderResponse(
        id=o.id,
        buyer_id=o.buyer_id,
        buyer_name=o.buyer.company_name if o.buyer else "Buyer",
        seller_id=o.seller_id,
        seller_name=o.seller.full_name if o.seller else "Artisan",
        total_amount=float(o.total_amount),
        status=o.status,
        payment_status=o.payment_status,
        shipping_status=o.shipping_status,
        tracking_number=o.tracking_number,
        created_at=o.created_at
    )
