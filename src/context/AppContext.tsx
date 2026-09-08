import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Product,
  Order,
  OrderStatus,
  CreditTransaction,
  Review,
  Message,
  CartItem,
  UserRole,
  ArtisanBadge,
  Coupon,
} from '../types';
import {
  DEMO_SELLERS,
  DEMO_BUYER,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CREDIT_TRANSACTIONS,
  INITIAL_REVIEWS,
  INITIAL_MESSAGES,
  INITIAL_COUPONS,
} from '../data/seedData';
import { otpService } from '../services/otpService';

interface AppContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  loginAsSeller: () => void;
  loginAsBuyer: () => void;
  login: (identity: string, pass: string) => boolean;
  verifyOtp: (mobile: string, otp: string, role: UserRole) => boolean;
  signup: (userData: Partial<UserProfile> & { password?: string }, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Products
  products: Product[];
  addProduct: (newProduct: Omit<Product, 'id' | 'created_at' | 'rating' | 'review_count' | 'views' | 'likes' | 'seller' | 'seller_id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (
    shippingAddress: Order['shipping_address'],
    paymentMethod?: string,
    discountAmount?: number,
    couponCode?: string
  ) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Coupons & Vouchers
  coupons: Coupon[];
  applyCoupon: (
    code: string,
    subtotal: number
  ) => { success: boolean; message: string; discount: number; coupon?: Coupon };
  addCoupon: (coupon: Omit<Coupon, 'id'>) => Coupon;

  // Credits
  creditTransactions: CreditTransaction[];
  awardCredits: (sellerId: string, amount: number, action: CreditTransaction['action'], description: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (productId: string, rating: number, comment: string) => void;

  // Messages
  messages: Message[];
  sendMessage: (receiverId: string, text: string, productId?: string, productName?: string) => void;

  // Demo Control
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'karigarsetu_user',
  ROLE: 'karigarsetu_role',
  AUTH_SESSION: 'karigarsetu_auth_session_active_v2',
  REGISTERED_USERS: 'karigarsetu_registered_users_v2',
  PRODUCTS: 'karigarsetu_products',
  CART: 'karigarsetu_cart',
  WISHLIST: 'karigarsetu_wishlist',
  ORDERS: 'karigarsetu_orders',
  CREDITS: 'karigarsetu_credits',
  REVIEWS: 'karigarsetu_reviews',
  MESSAGES: 'karigarsetu_messages',
  COUPONS: 'karigarsetu_coupons',
};

export interface RegisteredUserAccount {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  profile: UserProfile;
}

const DEFAULT_ACCOUNTS: RegisteredUserAccount[] = [
  {
    id: DEMO_SELLERS[0].id,
    email: 'ravi@ravicrafts.com',
    username: 'ravicrafts',
    passwordHash: 'Seller@123',
    role: 'seller',
    profile: DEMO_SELLERS[0],
  },
  {
    id: DEMO_BUYER.id,
    email: 'ananya.s@heritagearts.in',
    username: 'ananyasharma',
    passwordHash: 'Buyer@123',
    role: 'buyer',
    profile: DEMO_BUYER,
  },
];

function getBadgeForCredits(credits: number): ArtisanBadge {
  if (credits >= 1600) return 'Master Karigar';
  if (credits >= 1000) return 'Trusted Artisan';
  if (credits >= 500) return 'Rising Karigar';
  return 'New Artisan';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persistent state: first-time visitors start logged out as guests
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const hasActiveSession = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION) === 'true';
    if (!hasActiveSession) {
      // Clear legacy auto-saved session if present from previous builds
      localStorage.removeItem(STORAGE_KEYS.USER);
      return null;
    }
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const hasActiveSession = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION) === 'true';
    if (hasActiveSession) {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (saved) return saved as UserRole;
    }
    return 'buyer';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ['prod_1', 'prod_4'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ORDERS;
  });

  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CREDITS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CREDIT_TRANSACTIONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REVIEWS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_MESSAGES;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_COUPONS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEYS.ROLE, currentUser.role);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CREDITS, JSON.stringify(creditTransactions));
  }, [creditTransactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUserAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse registered users:', e);
      }
    }
    return DEFAULT_ACCOUNTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Auth actions
  const loginAsSeller = () => {
    const seller = DEMO_SELLERS[0]; // Ravi Kumar
    setCurrentUser(seller);
    setCurrentRole('seller');
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(seller));
    localStorage.setItem(STORAGE_KEYS.ROLE, 'seller');
  };

  const loginAsBuyer = () => {
    const buyer = DEMO_BUYER; // Ananya Sharma
    setCurrentUser(buyer);
    setCurrentRole('buyer');
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(buyer));
    localStorage.setItem(STORAGE_KEYS.ROLE, 'buyer');
  };

  const login = (identity: string, pass: string): boolean => {
    const cleanId = (identity || '').trim().toLowerCase();
    const cleanPass = (pass || '').trim();

    if (!cleanId || !cleanPass) {
      return false;
    }

    // Explicit demo identifiers (only with matching demo password)
    if (cleanId === 'seller_demo' && (cleanPass === 'Seller@123' || cleanPass === '123456')) {
      loginAsSeller();
      return true;
    }

    if (cleanId === 'buyer_demo' && (cleanPass === 'Buyer@123' || cleanPass === '123456')) {
      loginAsBuyer();
      return true;
    }

    // Match against real registered user accounts
    const account = registeredUsers.find(
      (acc) =>
        acc.email.toLowerCase() === cleanId ||
        acc.username.toLowerCase() === cleanId ||
        acc.profile.mobile.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
    );

    if (!account) {
      // Account does not exist -> strictly reject
      return false;
    }

    // Verify password strictly
    const isPasswordValid =
      account.passwordHash === cleanPass ||
      ((account.id === 'seller_1' || account.id === 'buyer_1') && cleanPass === '123456');

    if (!isPasswordValid) {
      // Wrong password -> strictly reject
      return false;
    }

    // Authenticate and establish real session
    setCurrentUser(account.profile);
    setCurrentRole(account.role);
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(account.profile));
    localStorage.setItem(STORAGE_KEYS.ROLE, account.role);
    return true;
  };

  const verifyOtp = (contact: string, otp: string, role: UserRole): boolean => {
    const cleanContact = (contact || '').trim().toLowerCase();
    const cleanOtp = (otp || '').trim();

    // Verify OTP against otpService
    const isOtpValid = otpService.verify(cleanOtp);
    if (!isOtpValid) {
      return false;
    }

    // Check if user already exists
    const existing = registeredUsers.find(
      (acc) =>
        acc.email.toLowerCase() === cleanContact ||
        acc.profile.mobile.replace(/\D/g, '') === cleanContact.replace(/\D/g, '')
    );

    if (existing) {
      setCurrentUser(existing.profile);
      setCurrentRole(existing.role);
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(existing.profile));
      localStorage.setItem(STORAGE_KEYS.ROLE, existing.role);
      return true;
    }

    // For new mobile/email user via OTP verification
    const isEmail = cleanContact.includes('@');
    const baseUser = role === 'seller' ? DEMO_SELLERS[0] : DEMO_BUYER;
    const userObj: UserProfile = {
      ...baseUser,
      id: `user_${Date.now()}`,
      email: isEmail ? cleanContact : `user_${Date.now()}@karigarsetu.ai`,
      mobile: !isEmail ? cleanContact : baseUser.mobile,
      role,
    };

    const newAccount: RegisteredUserAccount = {
      id: userObj.id,
      email: userObj.email,
      username: userObj.username,
      passwordHash: 'User@123',
      role,
      profile: userObj,
    };

    setRegisteredUsers((prev) => [...prev, newAccount]);
    setCurrentUser(userObj);
    setCurrentRole(role);
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    return true;
  };

  const signup = (userData: Partial<UserProfile> & { password?: string }, role: UserRole) => {
    const userId = `user_${Date.now()}`;
    const cleanPassword = userData.password ? userData.password.trim() : 'User@123';
    const newUser: UserProfile = {
      id: userId,
      full_name: userData.full_name || (role === 'seller' ? 'Shri Artisan' : 'Priya Patel'),
      username: (userData.username || `user_${Math.floor(Math.random() * 9000 + 1000)}`).toLowerCase(),
      email: (userData.email || `${userId}@karigarsetu.ai`).toLowerCase(),
      mobile: userData.mobile || '+91 98765 43210',
      profile_image: userData.profile_image || (role === 'seller' 
        ? '/avatars/ravi-kumar.jpg'
        : '/avatars/ananya-sharma.jpg'
      ),
      role: role,
      city: userData.city || 'Jaipur',
      state: userData.state || 'Rajasthan',
      bio: userData.bio || (role === 'seller' ? 'Passionate traditional craftsperson preserving handmade Indian heritage.' : 'Lover of authentic handmade Indian art.'),
      craft_specialization: userData.craft_specialization || (role === 'seller' ? 'Traditional Handicrafts' : undefined),
      credits: role === 'seller' ? 50 : 0, // 50 welcome credits
      badge: 'New Artisan',
      rating: 5.0,
      review_count: 0,
      sales_count: 0,
      products_count: 0,
      created_at: new Date().toISOString(),
    };

    const newAccount: RegisteredUserAccount = {
      id: userId,
      email: newUser.email,
      username: newUser.username,
      passwordHash: cleanPassword,
      role: role,
      profile: newUser,
    };

    setRegisteredUsers((prev) => [
      ...prev.filter((u) => u.email.toLowerCase() !== newUser.email && u.username.toLowerCase() !== newUser.username),
      newAccount,
    ]);

    setCurrentUser(newUser);
    setCurrentRole(role);
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.ROLE, role);

    if (role === 'seller') {
      awardCredits(newUser.id, 20, 'profile_completed', 'Profile registration completed');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole('buyer');
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
  };

  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'seller' && currentUser?.role !== 'seller') {
      setCurrentUser(DEMO_SELLERS[0]);
    } else if (newRole === 'buyer' && currentUser?.role !== 'buyer') {
      setCurrentUser(DEMO_BUYER);
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updatedUser: UserProfile = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

    // Update matching seller on products if profile image or name changed
    if (updatedUser.role === 'seller') {
      setProducts((prev) =>
        prev.map((p) =>
          p.seller_id === updatedUser.id || p.seller.username === updatedUser.username
            ? {
                ...p,
                seller: {
                  ...p.seller,
                  full_name: updatedUser.full_name,
                  username: updatedUser.username,
                  profile_image: updatedUser.profile_image,
                  city: updatedUser.city,
                  state: updatedUser.state,
                  craft_specialization: updatedUser.craft_specialization,
                },
              }
            : p
        )
      );
    }
  };

  // Product CRUD
  const addProduct = (
    data: Omit<Product, 'id' | 'created_at' | 'rating' | 'review_count' | 'views' | 'likes' | 'seller' | 'seller_id'>
  ): Product => {
    const seller = currentUser?.role === 'seller' ? currentUser : DEMO_SELLERS[0];
    const newId = `prod_${Date.now()}`;
    const newProd: Product = {
      ...data,
      id: newId,
      seller_id: seller.id,
      seller: {
        id: seller.id,
        full_name: seller.full_name,
        username: seller.username,
        city: seller.city,
        state: seller.state,
        rating: seller.rating,
        badge: seller.badge,
        profile_image: seller.profile_image,
        craft_specialization: seller.craft_specialization,
      },
      rating: 5.0,
      review_count: 0,
      views: 1,
      likes: 0,
      created_at: new Date().toISOString(),
    };

    setProducts((prev) => [newProd, ...prev]);

    // Update seller product count
    if (currentUser && currentUser.id === seller.id) {
      setCurrentUser({
        ...currentUser,
        products_count: (currentUser.products_count || 0) + 1,
      });
    }

    // Award +50 KarigarSetu credits for publishing!
    awardCredits(seller.id, 50, 'product_published', `Product published: ${newProd.name}`);

    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const createOrder = (
    shippingAddress: Order['shipping_address'],
    paymentMethod = 'Demo Payment (Instant UPI)',
    discountAmount = 0,
    couponCode = ''
  ): Order | null => {
    if (cart.length === 0) return null;

    const buyer = currentUser || DEMO_BUYER;
    const subtotal = cartSubtotal;
    const delivery_fee = subtotal > 1500 ? 0 : 99;
    const total_amount = Math.max(0, subtotal + delivery_fee - discountAmount);
    const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `KS202600${uniqueNumber}`;

    // Group items by primary seller (or first seller in cart)
    const primarySeller = cart[0].product.seller;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      order_code: orderCode,
      buyer_id: buyer.id,
      buyer_name: buyer.full_name,
      buyer_email: buyer.email,
      buyer_mobile: buyer.mobile,
      seller_id: primarySeller.id,
      seller_name: primarySeller.full_name,
      items: cart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images[0],
        price: item.product.price,
        quantity: item.quantity,
        seller_id: item.product.seller_id,
        seller_name: item.product.seller.full_name,
      })),
      subtotal,
      delivery_fee,
      discount_amount: discountAmount > 0 ? discountAmount : undefined,
      coupon_applied: couponCode || undefined,
      total_amount,
      shipping_address: shippingAddress,
      status: 'confirmed',
      payment_method: paymentMethod,
      payment_id: `PAY_${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Award +100 credits to the seller for the product sold!
    awardCredits(
      primarySeller.id,
      100,
      'product_sold',
      `Order ${orderCode} received (${newOrder.items[0]?.product_name})`
    );

    return newOrder;
  };

  const applyCoupon = (
    code: string,
    subtotal: number
  ): { success: boolean; message: string; discount: number; coupon?: Coupon } => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === clean);
    if (!found) {
      return { success: false, message: `Coupon code '${code}' is invalid.`, discount: 0 };
    }
    if (!found.is_active) {
      return { success: false, message: `Coupon code '${found.code}' has expired.`, discount: 0 };
    }
    if (found.min_order_amount && subtotal < found.min_order_amount) {
      return {
        success: false,
        message: `Minimum order amount of ₹${found.min_order_amount.toLocaleString('en-IN')} required for this voucher.`,
        discount: 0,
      };
    }

    let discount = 0;
    if (found.discount_type === 'percentage') {
      discount = Math.round((subtotal * found.discount_value) / 100);
      if (discount > 2500) discount = 2500; // Realistic cap
    } else {
      discount = Math.min(found.discount_value, subtotal);
    }

    return {
      success: true,
      message: `Coupon '${found.code}' applied! Saved ₹${discount.toLocaleString('en-IN')}.`,
      discount,
      coupon: found,
    };
  };

  const addCoupon = (couponData: Omit<Coupon, 'id'>): Coupon => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `coup_${Date.now()}`,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    return newCoupon;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status, updated_at: new Date().toISOString() }
          : ord
      )
    );
  };

  // Credits
  const awardCredits = (
    sellerId: string,
    amount: number,
    action: CreditTransaction['action'],
    description: string
  ) => {
    const newTx: CreditTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      seller_id: sellerId,
      amount,
      action,
      description,
      created_at: new Date().toISOString(),
    };

    setCreditTransactions((prev) => [newTx, ...prev]);

    // Update user profile credits if currently active seller
    if (currentUser && currentUser.id === sellerId) {
      const updatedCredits = (currentUser.credits || 0) + amount;
      const updatedBadge = getBadgeForCredits(updatedCredits);
      setCurrentUser({
        ...currentUser,
        credits: updatedCredits,
        badge: updatedBadge,
      });
    }
  };

  // Reviews
  const addReview = (productId: string, rating: number, comment: string) => {
    const buyer = currentUser || DEMO_BUYER;
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    const newRev: Review = {
      id: `rev_${Date.now()}`,
      product_id: productId,
      product_name: targetProduct.name,
      buyer_id: buyer.id,
      buyer_name: buyer.full_name,
      seller_id: targetProduct.seller_id,
      rating,
      comment,
      created_at: new Date().toISOString(),
    };

    setReviews((prev) => [newRev, ...prev]);

    // Update product rating
    const currentReviews = reviews.filter((r) => r.product_id === productId);
    const totalStars = currentReviews.reduce((sum, r) => sum + r.rating, rating);
    const newAvg = Number((totalStars / (currentReviews.length + 1)).toFixed(1));

    updateProduct(productId, {
      rating: newAvg,
      review_count: targetProduct.review_count + 1,
    });

    // Mark order as reviewed if applicable
    setOrders((prev) =>
      prev.map((o) =>
        o.items.some((i) => i.product_id === productId)
          ? { ...o, has_review: true }
          : o
      )
    );

    // Award +25 credits to seller for positive review
    if (rating >= 4) {
      awardCredits(
        targetProduct.seller_id,
        25,
        'positive_review',
        `${rating}-star review from ${buyer.full_name} on ${targetProduct.name}`
      );
    }
  };

  // Messages
  const sendMessage = (
    receiverId: string,
    text: string,
    productId?: string,
    productName?: string
  ) => {
    const sender = currentUser || (currentRole === 'seller' ? DEMO_SELLERS[0] : DEMO_BUYER);
    const targetSeller = DEMO_SELLERS.find((s) => s.id === receiverId);
    const receiverName = targetSeller ? targetSeller.full_name : 'Artisan Support';

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender_id: sender.id,
      sender_name: sender.full_name,
      receiver_id: receiverId,
      receiver_name: receiverName,
      product_id: productId,
      product_name: productName,
      text,
      created_at: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulate artisan response after 1.5 seconds if sent by buyer
    if (sender.role === 'buyer') {
      setTimeout(() => {
        const replyMsg: Message = {
          id: `msg_${Date.now() + 1}`,
          sender_id: receiverId,
          sender_name: receiverName,
          receiver_id: sender.id,
          receiver_name: sender.full_name,
          product_id: productId,
          product_name: productName,
          text: `Namaste ${sender.full_name}! Thank you for reaching out. Yes, every piece is 100% handcrafted and we can customize it to your preference.`,
          created_at: new Date().toISOString(),
          read: false,
        };
        setMessages((prev) => [...prev, replyMsg]);
      }, 1500);
    }
  };

  // Reset Demo
  const resetDemoData = () => {
    localStorage.clear();
    setCurrentUser(null);
    setCurrentRole('buyer');
    setProducts(INITIAL_PRODUCTS);
    setCart([]);
    setWishlist(['prod_1', 'prod_4']);
    setOrders(INITIAL_ORDERS);
    setCreditTransactions(INITIAL_CREDIT_TRANSACTIONS);
    setReviews(INITIAL_REVIEWS);
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated: Boolean(currentUser),
        loginAsSeller,
        loginAsBuyer,
        login,
        verifyOtp,
        signup,
        logout,
        switchRole,
        updateUserProfile,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        creditTransactions,
        awardCredits,
        reviews,
        addReview,
        messages,
        sendMessage,
        coupons,
        applyCoupon,
        addCoupon,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
