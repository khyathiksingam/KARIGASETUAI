"""Pydantic v2 schemas for API validation and serialization."""
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ----------------------------------------------------------------------
# 1. Auth Schemas
# ----------------------------------------------------------------------
class GoogleAuthRequest(BaseModel):
    id_token: str
    role: Optional[str] = "SELLER"

class SendEmailOTPRequest(BaseModel):
    email: str

class VerifyEmailOTPRequest(BaseModel):
    email: str
    otp: str
    role: Optional[str] = "SELLER"

class SendMobileOTPRequest(BaseModel):
    mobile: str

class VerifyMobileOTPRequest(BaseModel):
    mobile: str
    otp: str
    role: Optional[str] = "SELLER"

class DemoLoginRequest(BaseModel):
    role: str = "SELLER"  # SELLER, BUYER, ADMIN

class UserResponse(BaseModel):
    id: str
    email: Optional[str] = None
    mobile: Optional[str] = None
    role: str
    status: str

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    profile: Optional[Dict[str, Any]] = None

# ----------------------------------------------------------------------
# 2. Seller & Buyer Profile Schemas
# ----------------------------------------------------------------------
class SellerProfileBase(BaseModel):
    full_name: str
    business_name: Optional[str] = None
    primary_craft: str
    experience_years: int = 0
    monthly_capacity_units: int = 10
    preferred_language: str = "te"
    location: str
    profile_image_url: Optional[str] = None
    story: Optional[str] = None

class SellerProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    business_name: Optional[str] = None
    primary_craft: Optional[str] = None
    experience_years: Optional[int] = None
    monthly_capacity_units: Optional[int] = None
    preferred_language: Optional[str] = None
    location: Optional[str] = None
    story: Optional[str] = None

class SellerProfileResponse(SellerProfileBase):
    id: str
    user_id: str
    verification_badge: str
    readiness_score: int
    export_readiness_score: int

    class Config:
        from_attributes = True

class HeroSalesData(BaseModel):
    monthly_sales_inr: float
    growth_percentage: float
    chart_series: List[float]

class SellerDashboardKPIs(BaseModel):
    products_count: int
    buyers_count: int
    pending_rfqs: int

class AIBusinessInsight(BaseModel):
    title: str
    message: str
    action_label: str = "View Insight"

class SellerDashboardResponse(BaseModel):
    artisan_name: str
    greeting: str
    subtitle: str
    hero_sales: HeroSalesData
    kpis: SellerDashboardKPIs
    ai_business_insight: AIBusinessInsight

class BuyerProfileBase(BaseModel):
    contact_name: str
    company_name: str
    buyer_type: str = "CORPORATE"
    location: str
    typical_order_size: int = 100

class BuyerProfileResponse(BuyerProfileBase):
    id: str
    user_id: str
    verified_buyer: bool

    class Config:
        from_attributes = True

class BuyerDashboardResponse(BaseModel):
    contact_name: str
    company_name: str
    active_rfqs_count: int
    total_orders_count: int
    recommended_products: List[Dict[str, Any]]
    trending_crafts: List[str]

# ----------------------------------------------------------------------
# 3. Product Schemas
# ----------------------------------------------------------------------
class ProductCreate(BaseModel):
    name: str
    description: str
    category: str
    subcategory: Optional[str] = None
    material: str
    craft_type: str
    color: Optional[str] = None
    dimensions: Optional[str] = None
    weight: Optional[str] = None
    production_time: str = "2 days"
    price: float
    quantity: int = 10
    image_urls: List[str] = []
    quality_score: int = 90
    ai_confidence: float = 0.92

class ProductResponse(BaseModel):
    id: str
    seller_id: str
    name: str
    description: str
    category: str
    subcategory: Optional[str] = None
    material: str
    craft_type: str
    color: Optional[str] = None
    dimensions: Optional[str] = None
    weight: Optional[str] = None
    production_time: str
    price: float
    quantity: int
    status: str
    quality_score: int
    ai_confidence: float
    verified_product: bool
    image_url: Optional[str] = None
    artisan_name: Optional[str] = None
    artisan_location: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------------------------------------------------------------
# 4. AI Intelligence Pipeline Schemas
# ----------------------------------------------------------------------
class ImageQualityResponse(BaseModel):
    quality_score: int
    sharpness: int
    lighting: int
    background: int
    verdict: str
    tip: str

class ImageEnhanceResponse(BaseModel):
    original_image_url: str
    enhanced_image_url: str
    enhancements_applied: List[str]

class SpeechToTextRequest(BaseModel):
    audio_base64: Optional[str] = None
    simulated_speech: Optional[str] = None
    target_language: Optional[str] = "en"

class SpeechToTextResponse(BaseModel):
    detected_language: str
    language_name: str
    original_transcript: str
    english_translation: str

class GenerateCatalogRequest(BaseModel):
    image_url: Optional[str] = None
    voice_transcript: Optional[str] = None
    craft_type_hint: Optional[str] = None

class GenerateCatalogResponse(BaseModel):
    product_name: str
    category: str
    subcategory: Optional[str] = None
    material: str
    craft_type: str
    color: Optional[str] = None
    dimensions: Optional[str] = None
    weight: Optional[str] = None
    production_time: str
    description: str
    keywords: List[str]
    confidence: float

class SuggestPriceRequest(BaseModel):
    material_cost: float
    labour_hours: float
    labour_rate_per_hour: float = 50.0
    packaging_cost: float = 50.0
    shipping_cost: float = 80.0
    desired_margin_percent: float = 25.0
    category: str = "General Craft"
    craft_type: Optional[str] = None

class PriceBreakdownItem(BaseModel):
    component: str
    amount: float
    description: str

class SuggestPriceResponse(BaseModel):
    recommended_price: float
    min_price: float
    max_price: float
    expected_margin: float
    confidence: float
    breakdown: List[PriceBreakdownItem]
    explanation: str

class BuyerMatchFactor(BaseModel):
    seller_id: str
    seller_name: str
    artisan_location: str
    craft_type: str
    match_percentage: int
    reasons: List[str]

class BuyerMatchResponse(BaseModel):
    matches: List[BuyerMatchFactor]

class AskAssistantRequest(BaseModel):
    question: str
    context: Optional[str] = None

class AskAssistantResponse(BaseModel):
    answer: str
    suggestions: List[str] = []

class NegotiateRequest(BaseModel):
    rfq_id: Optional[str] = None
    buyer_offered_price: float
    current_listing_price: float
    base_cost: float
    quantity: int

class NegotiateResponse(BaseModel):
    suggested_counter_price: float
    advice: str
    profit_margin_percent: float

# ----------------------------------------------------------------------
# 5. RFQ & Order Schemas
# ----------------------------------------------------------------------
class RFQCreate(BaseModel):
    category: str
    product_id: Optional[str] = None
    quantity: int
    target_price: float
    delivery_deadline_days: int = 14
    delivery_location: str
    custom_requirements: Optional[str] = None
    notes: Optional[str] = None

class RFQResponseCreate(BaseModel):
    quoted_price: float
    quantity: int
    delivery_days: int = 10
    message: Optional[str] = None

class RFQResponseItem(BaseModel):
    id: str
    seller_id: str
    seller_name: str
    quoted_price: float
    quantity: int
    delivery_date: datetime
    message: Optional[str] = None
    status: str

    class Config:
        from_attributes = True

class RFQDetailResponse(BaseModel):
    id: str
    buyer_id: str
    buyer_name: str
    category: str
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    quantity: int
    target_price: float
    delivery_deadline: datetime
    delivery_location: str
    custom_requirements: Optional[str] = None
    status: str
    created_at: datetime
    responses: List[RFQResponseItem] = []

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    seller_id: str
    product_id: str
    quantity: int
    unit_price: float
    rfq_id: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    buyer_id: str
    buyer_name: str
    seller_id: str
    seller_name: str
    total_amount: float
    status: str
    payment_status: str
    shipping_status: str
    tracking_number: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------------------------------------------------------------
# 6. Admin & Analytics Schemas
# ----------------------------------------------------------------------
class AdminClusterPoint(BaseModel):
    id: str
    name: str
    state: str
    district: str
    primary_craft: str
    latitude: float
    longitude: float
    artisan_count: int
    description: Optional[str] = None

class DemandTrendItem(BaseModel):
    category: str
    growth_percentage: float
    trend_direction: str  # UP, STABLE, DOWN
    monthly_searches: int

class AdminOverviewResponse(BaseModel):
    registered_artisans: int
    active_sellers: int
    digitized_products: int
    registered_buyers: int
    total_rfqs: int
    total_orders: int
    gross_merchandise_value_inr: float
    avg_readiness_score: int
    clusters_count: int
    data_tag: str = "DEMO DATA"
