"""Product Catalog CRUD and status management API."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_token_payload
from app.models.models import Product, ProductImage, SellerProfile, PricingPrediction
from app.schemas.schemas import ProductCreate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    auth: dict = Depends(get_current_token_payload)
):
    """Publish an artisan-approved product listing."""
    user_id = auth.get("sub", "user-seller-demo")
    seller = db.query(SellerProfile).filter_by(user_id=user_id).first()
    if not seller:
        seller = db.query(SellerProfile).filter_by(id="sel-1").first()

    product = Product(
        seller_id=seller.id,
        name=payload.name,
        description=payload.description,
        category=payload.category,
        subcategory=payload.subcategory,
        material=payload.material,
        craft_type=payload.craft_type,
        color=payload.color,
        dimensions=payload.dimensions,
        weight=payload.weight,
        production_time=payload.production_time,
        price=payload.price,
        quantity=payload.quantity,
        status="PUBLISHED",
        quality_score=payload.quality_score,
        ai_confidence=payload.ai_confidence,
        verified_product=True
    )
    db.add(product)
    db.commit()
    db.refresh(product)

    # Attach images
    if payload.image_urls:
        for idx, url in enumerate(payload.image_urls):
            db.add(ProductImage(
                product_id=product.id,
                raw_image_url=url,
                enhanced_image_url=url,
                is_primary=(idx == 0)
            ))
        db.commit()
    else:
        # Default placeholder image
        db.add(ProductImage(
            product_id=product.id,
            raw_image_url="/static/demo/leather_bag_enhanced.jpg",
            enhanced_image_url="/static/demo/leather_bag_enhanced.jpg",
            is_primary=True
        ))
        db.commit()

    db.refresh(product)

    img_url = product.images[0].enhanced_image_url if product.images else None
    return ProductResponse(
        id=product.id,
        seller_id=product.seller_id,
        name=product.name,
        description=product.description,
        category=product.category,
        subcategory=product.subcategory,
        material=product.material,
        craft_type=product.craft_type,
        color=product.color,
        dimensions=product.dimensions,
        weight=product.weight,
        production_time=product.production_time,
        price=float(product.price),
        quantity=product.quantity,
        status=product.status,
        quality_score=product.quality_score,
        ai_confidence=product.ai_confidence,
        verified_product=product.verified_product,
        image_url=img_url,
        artisan_name=seller.full_name if seller else "Savita Devi",
        artisan_location=seller.location if seller else "Telangana, India",
        created_at=product.created_at
    )

@router.get("", response_model=List[ProductResponse])
def list_products(
    category: Optional[str] = None,
    craft_type: Optional[str] = None,
    max_price: Optional[float] = None,
    limit: int = Query(50, le=100),
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Retrieve catalog products with multi-attribute filtering."""
    query = db.query(Product).filter(Product.status == "PUBLISHED")
    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if craft_type:
        query = query.filter(Product.craft_type.ilike(f"%{craft_type}%"))
    if max_price:
        query = query.filter(Product.price <= max_price)

    products = query.order_by(Product.created_at.desc()).offset(offset).limit(limit).all()

    results = []
    for p in products:
        img_url = p.images[0].enhanced_image_url if p.images else "/static/demo/saree_enhanced.jpg"
        results.append(ProductResponse(
            id=p.id,
            seller_id=p.seller_id,
            name=p.name,
            description=p.description,
            category=p.category,
            subcategory=p.subcategory,
            material=p.material,
            craft_type=p.craft_type,
            color=p.color,
            dimensions=p.dimensions,
            weight=p.weight,
            production_time=p.production_time,
            price=float(p.price),
            quantity=p.quantity,
            status=p.status,
            quality_score=p.quality_score,
            ai_confidence=p.ai_confidence,
            verified_product=p.verified_product,
            image_url=img_url,
            artisan_name=p.seller.full_name if p.seller else "Artisan Craftsman",
            artisan_location=p.seller.location if p.seller else "India",
            created_at=p.created_at
        ))
    return results

@router.get("/{id}", response_model=ProductResponse)
def get_product(id: str, db: Session = Depends(get_db)):
    """Retrieve a single product by ID."""
    p = db.query(Product).filter_by(id=id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found.")

    img_url = p.images[0].enhanced_image_url if p.images else "/static/demo/saree_enhanced.jpg"
    return ProductResponse(
        id=p.id,
        seller_id=p.seller_id,
        name=p.name,
        description=p.description,
        category=p.category,
        subcategory=p.subcategory,
        material=p.material,
        craft_type=p.craft_type,
        color=p.color,
        dimensions=p.dimensions,
        weight=p.weight,
        production_time=p.production_time,
        price=float(p.price),
        quantity=p.quantity,
        status=p.status,
        quality_score=p.quality_score,
        ai_confidence=p.ai_confidence,
        verified_product=p.verified_product,
        image_url=img_url,
        artisan_name=p.seller.full_name if p.seller else "Artisan Craftsman",
        artisan_location=p.seller.location if p.seller else "India",
        created_at=p.created_at
    )
