export type UserRole = 'seller' | 'buyer';

export type ArtisanBadge = 'New Artisan' | 'Rising Karigar' | 'Trusted Artisan' | 'Master Karigar';

export interface BankDetails {
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  upi_id: string;
  passbook_image?: string;
  is_verified: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount?: number;
  description: string;
  voucher_image?: string;
  created_by_artisan?: string;
  is_active: boolean;
}

export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  mobile: string;
  profile_image: string;
  role: UserRole;
  city: string;
  state: string;
  bio?: string;
  craft_specialization?: string;
  bank_details?: BankDetails;
  credits: number;
  badge: ArtisanBadge;
  rating: number;
  review_count: number;
  sales_count: number;
  products_count: number;
  created_at: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface Product {
  id: string;
  seller_id: string;
  seller: {
    id: string;
    full_name: string;
    username: string;
    city: string;
    state: string;
    rating: number;
    badge: ArtisanBadge;
    profile_image: string;
    craft_specialization?: string;
    bank_details?: BankDetails;
  };
  name: string;
  description: string;
  category: string;
  material: string;
  model_style: string;
  dimensions: Dimensions;
  is_dimensions_estimated: boolean;
  primary_color: string;
  secondary_color?: string;
  quality_score: number; // e.g. 4.5
  market_price_min: number;
  market_price_max: number;
  suggested_price: number;
  price: number;
  quantity: number;
  crafting_time_days: number;
  images: string[];
  state: string;
  city: string;
  rating: number;
  review_count: number;
  views: number;
  likes: number;
  created_at: string;
}

export interface QualityAssessment {
  craftsmanship: number;
  materialQuality: number;
  finish: number;
  designAesthetic: number;
  overall: number;
  explanation?: string;
}

export interface AIAnalysisResult {
  productName: string;
  category: string;
  craftType?: string;
  material: string;
  model: string;
  craftTechnique?: string;
  dimensions: string; // e.g. "28 × 12 × 8 cm"
  length: number;
  width: number;
  height: number;
  primaryColor: string;
  secondaryColor: string;
  visualDescription?: string;
  shape?: string;
  texture?: string;
  craftFinish?: string;
  qualityScore: number; // e.g. 4.5
  qualityStars: string;
  qualityAssessment?: QualityAssessment;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  suggestedPrice: number;
  confidence: number; // e.g. 94
  pricingReasoning?: string;
  descriptionSnippet: string;
  culturalSignificance?: string;
  craftingTechnique?: string;
  isValidCraft?: boolean;
  isHumanSubject?: boolean;
  isDocumentSubject?: boolean;
  rejectionReason?: string;
  isLiveAi?: boolean;
  analysisSource?: 'live_ai' | 'local_vision';
}

export type OrderStatus = 'ordered' | 'confirmed' | 'preparing' | 'shipped' | 'delivered';

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  seller_id: string;
  seller_name: string;
}

export interface Order {
  id: string;
  order_code: string; // e.g. KS2026001024
  buyer_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_mobile: string;
  seller_id: string;
  seller_name: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount_amount?: number;
  coupon_applied?: string;
  total_amount: number;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: OrderStatus;
  payment_method: string;
  payment_id: string;
  created_at: string;
  updated_at: string;
  has_review?: boolean;
}

export interface CreditTransaction {
  id: string;
  seller_id: string;
  amount: number; // positive integer, e.g. 50, 100
  action: 'product_published' | 'product_sold' | 'positive_review' | 'profile_completed' | 'bonus';
  description: string;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  product_name: string;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  rating: number;
  comment: string;
  image?: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  receiver_id: string;
  receiver_name: string;
  product_id?: string;
  product_name?: string;
  text: string;
  created_at: string;
  read: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
