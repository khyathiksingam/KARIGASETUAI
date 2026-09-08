"""SQLAlchemy ORM models for KARIGASETU AI."""
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime,
    ForeignKey, Text, Numeric, Index
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

# ----------------------------------------------------------------------
# 1. Identity & Authentication
# ----------------------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=True, index=True)
    mobile = Column(String(20), unique=True, nullable=True, index=True)
    google_id = Column(String(128), unique=True, nullable=True, index=True)
    role = Column(String(20), nullable=False, default="SELLER")  # SELLER, BUYER, ADMIN
    email_verified = Column(Boolean, default=False)
    mobile_verified = Column(Boolean, default=False)
    status = Column(String(20), default="ACTIVE")  # ACTIVE, SUSPENDED
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
    last_login = Column(DateTime, nullable=True)

    seller_profile = relationship("SellerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    buyer_profile = relationship("BuyerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    oauth_accounts = relationship("OAuthAccount", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class OAuthAccount(Base):
    __tablename__ = "oauth_accounts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(50), nullable=False)  # 'google'
    provider_user_id = Column(String(255), nullable=False)
    access_token = Column(Text, nullable=True)
    refresh_token = Column(Text, nullable=True)
    expires_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="oauth_accounts")


class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    recipient = Column(String(255), nullable=False, index=True)  # email or phone
    channel = Column(String(10), nullable=False)  # EMAIL or SMS
    otp_hash = Column(String(128), nullable=False)
    attempts = Column(Integer, default=0)
    is_used = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=utc_now)


class Session(Base):
    __tablename__ = "sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_jti = Column(String(64), unique=True, nullable=False)
    device_info = Column(String(255), nullable=True)
    ip_address = Column(String(45), nullable=True)
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="sessions")


# ----------------------------------------------------------------------
# 2. Profiles & Artisan Clusters
# ----------------------------------------------------------------------
class ArtisanCluster(Base):
    __tablename__ = "artisan_clusters"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(150), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    primary_craft = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    artisan_count = Column(Integer, default=0)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    sellers = relationship("SellerProfile", back_populates="cluster")


class SellerProfile(Base):
    __tablename__ = "seller_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(150), nullable=False)
    business_name = Column(String(200), nullable=True)
    cluster_id = Column(String(36), ForeignKey("artisan_clusters.id"), nullable=True)
    primary_craft = Column(String(100), nullable=False)
    experience_years = Column(Integer, default=0)
    monthly_capacity_units = Column(Integer, default=10)
    preferred_language = Column(String(10), default="te")
    location = Column(String(255), nullable=False)
    profile_image_url = Column(Text, nullable=True)
    story = Column(Text, nullable=True)
    story_audio_url = Column(Text, nullable=True)
    verification_badge = Column(String(30), default="ARTISAN_VERIFIED")
    readiness_score = Column(Integer, default=84)
    export_readiness_score = Column(Integer, default=78)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="seller_profile")
    cluster = relationship("ArtisanCluster", back_populates="sellers")
    products = relationship("Product", back_populates="seller", cascade="all, delete-orphan")
    rfq_responses = relationship("RFQResponse", back_populates="seller")
    orders = relationship("Order", back_populates="seller")


class BuyerProfile(Base):
    __tablename__ = "buyer_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    contact_name = Column(String(150), nullable=False)
    company_name = Column(String(200), nullable=False)
    buyer_type = Column(String(30), nullable=False, default="CORPORATE")
    location = Column(String(255), nullable=False)
    typical_order_size = Column(Integer, default=100)
    verified_buyer = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="buyer_profile")
    preferences = relationship("BuyerPreference", back_populates="buyer", uselist=False, cascade="all, delete-orphan")
    rfqs = relationship("RFQ", back_populates="buyer", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="buyer")


class BuyerPreference(Base):
    __tablename__ = "buyer_preferences"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    buyer_id = Column(String(36), ForeignKey("buyer_profiles.id", ondelete="CASCADE"), nullable=False)
    craft_categories = Column(Text, nullable=False)  # JSON or comma-separated
    max_budget = Column(Numeric(12, 2), nullable=True)
    preferred_regions = Column(Text, nullable=True)

    buyer = relationship("BuyerProfile", back_populates="preferences")


# ----------------------------------------------------------------------
# 3. Products & AI Analysis
# ----------------------------------------------------------------------
class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    seller_id = Column(String(36), ForeignKey("seller_profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, index=True)
    subcategory = Column(String(100), nullable=True)
    material = Column(String(150), nullable=False)
    craft_type = Column(String(100), nullable=False, index=True)
    color = Column(String(50), nullable=True)
    dimensions = Column(String(100), nullable=True)
    weight = Column(String(50), nullable=True)
    production_time = Column(String(50), nullable=False, default="2 days")
    price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, default=10)
    status = Column(String(20), default="PUBLISHED")
    quality_score = Column(Integer, default=90)
    ai_confidence = Column(Float, default=0.92)
    verified_product = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    seller = relationship("SellerProfile", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    ai_analysis = relationship("ProductAIAnalysis", back_populates="product", uselist=False, cascade="all, delete-orphan")
    translations = relationship("ProductTranslation", back_populates="product", cascade="all, delete-orphan")
    pricing_prediction = relationship("PricingPrediction", back_populates="product", uselist=False, cascade="all, delete-orphan")


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    raw_image_url = Column(Text, nullable=False)
    enhanced_image_url = Column(Text, nullable=True)
    thumbnail_url = Column(Text, nullable=True)
    is_primary = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    product = relationship("Product", back_populates="images")


class ProductAIAnalysis(Base):
    __tablename__ = "product_ai_analysis"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), unique=True, nullable=False)
    sharpness_score = Column(Integer, nullable=False, default=92)
    lighting_score = Column(Integer, nullable=False, default=89)
    background_score = Column(Integer, nullable=False, default=94)
    overall_score = Column(Integer, nullable=False, default=92)
    recommendation_tip = Column(Text, nullable=True)
    detected_objects = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    product = relationship("Product", back_populates="ai_analysis")


class ProductTranslation(Base):
    __tablename__ = "product_translations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    language_code = Column(String(10), nullable=False)  # en, hi, te
    translated_name = Column(String(255), nullable=False)
    translated_description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utc_now)

    product = relationship("Product", back_populates="translations")


class PricingPrediction(Base):
    __tablename__ = "pricing_predictions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), unique=True, nullable=False)
    material_cost = Column(Numeric(10, 2), nullable=False)
    labour_hours = Column(Float, nullable=False)
    labour_cost = Column(Numeric(10, 2), nullable=False)
    packaging_cost = Column(Numeric(10, 2), nullable=False)
    shipping_cost = Column(Numeric(10, 2), nullable=False)
    desired_margin = Column(Numeric(10, 2), nullable=False)
    demand_premium = Column(Numeric(10, 2), default=0.0)
    market_average = Column(Numeric(10, 2), nullable=False)
    recommended_price = Column(Numeric(10, 2), nullable=False)
    min_price = Column(Numeric(10, 2), nullable=False)
    max_price = Column(Numeric(10, 2), nullable=False)
    confidence = Column(Float, nullable=False, default=0.88)
    explanation = Column(Text, nullable=False)
    model_version = Column(String(20), default="v1.0")
    created_at = Column(DateTime, default=utc_now)

    product = relationship("Product", back_populates="pricing_prediction")


class MarketPrice(Base):
    __tablename__ = "market_prices"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    category = Column(String(100), nullable=False, index=True)
    craft_type = Column(String(100), nullable=False, index=True)
    average_retail_price = Column(Numeric(10, 2), nullable=False)
    low_price = Column(Numeric(10, 2), nullable=False)
    high_price = Column(Numeric(10, 2), nullable=False)
    region = Column(String(100), nullable=True)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


# ----------------------------------------------------------------------
# 4. RFQ, Orders, and Payments
# ----------------------------------------------------------------------
class RFQ(Base):
    __tablename__ = "rfqs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    buyer_id = Column(String(36), ForeignKey("buyer_profiles.id", ondelete="CASCADE"), nullable=False)
    target_product_id = Column(String(36), ForeignKey("products.id"), nullable=True)
    category = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False)
    target_price = Column(Numeric(10, 2), nullable=False)
    delivery_deadline = Column(DateTime, nullable=False)
    delivery_location = Column(String(255), nullable=False)
    custom_requirements = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String(20), default="OPEN")  # OPEN, MATCHED, CLOSED
    created_at = Column(DateTime, default=utc_now)

    buyer = relationship("BuyerProfile", back_populates="rfqs")
    responses = relationship("RFQResponse", back_populates="rfq", cascade="all, delete-orphan")


class RFQResponse(Base):
    __tablename__ = "rfq_responses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    rfq_id = Column(String(36), ForeignKey("rfqs.id", ondelete="CASCADE"), nullable=False)
    seller_id = Column(String(36), ForeignKey("seller_profiles.id", ondelete="CASCADE"), nullable=False)
    quoted_price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False)
    delivery_date = Column(DateTime, nullable=False)
    message = Column(Text, nullable=True)
    ai_suggested_counter = Column(Numeric(10, 2), nullable=True)
    status = Column(String(20), default="SUBMITTED")  # SUBMITTED, COUNTERED, ACCEPTED, REJECTED
    created_at = Column(DateTime, default=utc_now)

    rfq = relationship("RFQ", back_populates="responses")
    seller = relationship("SellerProfile", back_populates="rfq_responses")


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    buyer_id = Column(String(36), ForeignKey("buyer_profiles.id"), nullable=False)
    seller_id = Column(String(36), ForeignKey("seller_profiles.id"), nullable=False)
    rfq_id = Column(String(36), ForeignKey("rfqs.id"), nullable=True)
    total_amount = Column(Numeric(12, 2), nullable=False)
    status = Column(String(20), default="PENDING")  # PENDING, ACCEPTED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    payment_status = Column(String(20), default="ESCROW_HELD")
    shipping_status = Column(String(20), default="NOT_DISPATCHED")
    tracking_number = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    buyer = relationship("BuyerProfile", back_populates="orders")
    seller = relationship("SellerProfile", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    order_id = Column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Numeric(12, 2), nullable=False)

    order = relationship("Order", back_populates="items")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    order_id = Column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    provider = Column(String(50), default="DEMO_ESCROW")
    transaction_ref = Column(String(100), unique=True, nullable=False)
    status = Column(String(20), default="SUCCESS")
    created_at = Column(DateTime, default=utc_now)

    order = relationship("Order", back_populates="payments")


# ----------------------------------------------------------------------
# 5. Vectors, Search, Notifications & Sync
# ----------------------------------------------------------------------
class Embedding(Base):
    __tablename__ = "embeddings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    entity_type = Column(String(20), nullable=False)  # PRODUCT, QUERY
    entity_id = Column(String(36), nullable=False)
    vector_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utc_now)


class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=True)
    query = Column(Text, nullable=False)
    parsed_category = Column(String(100), nullable=True)
    parsed_budget = Column(Numeric(10, 2), nullable=True)
    results_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)


class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=False)
    role = Column(String(20), nullable=False)  # user, assistant
    content = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    audio_url = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    body = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)
    is_read = Column(Boolean, default=False)
    action_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="notifications")


class VerificationRecord(Base):
    __tablename__ = "verification_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    seller_id = Column(String(36), ForeignKey("seller_profiles.id", ondelete="CASCADE"), nullable=False)
    verifier_id = Column(String(36), nullable=True)
    verification_type = Column(String(50), nullable=False)
    status = Column(String(20), default="VERIFIED")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)


class SyncQueue(Base):
    __tablename__ = "sync_queue"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=False)
    client_mutation_id = Column(String(64), unique=True, nullable=False)
    action_type = Column(String(50), nullable=False)
    payload_json = Column(Text, nullable=False)
    status = Column(String(20), default="PENDING")
    attempts = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)
    processed_at = Column(DateTime, nullable=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=True)
    action = Column(String(100), nullable=False)
    resource = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    timestamp = Column(DateTime, default=utc_now)
