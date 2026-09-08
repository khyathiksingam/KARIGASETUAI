import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft,
  ArrowRight,
  Lock,
  QrCode,
  Building2,
  Truck,
  Upload,
  Tag,
  Copy,
  Check,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Order, Coupon } from '../../types';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, createOrder, currentUser, applyCoupon } = useApp();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: '#42, 4th Cross, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
  });

  const [paymentMode, setPaymentMode] = useState<'upi' | 'bank_transfer' | 'card' | 'cod'>('upi');
  const [utrNumber, setUtrNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Coupon / Voucher state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [uploadedVoucherName, setUploadedVoucherName] = useState<string | null>(null);
  const voucherInputRef = useRef<HTMLInputElement | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const deliveryFee = cartSubtotal > 1500 ? 0 : 99;
  const totalAmount = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  // Seller's verified bank and UPI details for direct settlement
  const primarySeller = cart[0]?.product?.seller;
  const sellerBank = primarySeller?.bank_details || {
    account_holder_name: primarySeller?.full_name || 'Ravi Kumar',
    bank_name: 'State Bank of India',
    account_number: '50100492814323',
    ifsc_code: 'SBIN0020145',
    upi_id: `${primarySeller?.username || 'ravicrafts'}@sbi`,
    is_verified: true,
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleApplyCode = (code: string) => {
    setCouponMessage(null);
    if (!code.trim()) {
      setCouponMessage({ text: 'Please enter a coupon or voucher code.', isError: true });
      return;
    }

    const res = applyCoupon(code, cartSubtotal);
    if (res.success) {
      setAppliedCoupon(res.coupon || null);
      setDiscountAmount(res.discount);
      setCouponMessage({ text: res.message, isError: false });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      setCouponMessage({ text: res.message, isError: true });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponInput('');
    setUploadedVoucherName(null);
    setCouponMessage(null);
  };

  const handleVoucherFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedVoucherName(file.name);
      // Simulated intelligent OCR scan for voucher document
      const simulatedCode = 'SIH2026';
      const res = applyCoupon(simulatedCode, cartSubtotal);
      if (res.success) {
        setAppliedCoupon(res.coupon || null);
        setDiscountAmount(res.discount);
        setCouponMessage({
          text: `Voucher document verified! Scanned code '${simulatedCode}' applied (-₹${res.discount.toLocaleString('en-IN')}).`,
          isError: false,
        });
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  if (cart.length === 0 && !createdOrder) {
    return (
      <div className="min-h-screen bg-heritage-ivory py-16 px-4 text-center">
        <h2 className="font-serif font-bold text-2xl text-heritage-brown">Your cart is empty</h2>
        <p className="text-xs text-heritage-charcoal/60 mt-1">Add something handmade before checking out.</p>
        <Link to="/marketplace" className="mt-4 inline-block px-5 py-2.5 bg-heritage-terracotta text-white rounded-xl text-xs font-bold">
          Explore Marketplace
        </Link>
      </div>
    );
  }

  const handleDemoPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    let methodLabel = `Direct Artisan UPI (${sellerBank.upi_id})`;
    if (paymentMode === 'bank_transfer') {
      methodLabel = `Artisan Bank NEFT/IMPS (${sellerBank.bank_name} • UTR: ${utrNumber || 'REF' + Math.floor(100000000 + Math.random() * 900000000)})`;
    } else if (paymentMode === 'card') {
      methodLabel = `Card / NetBanking (${cardNumber.slice(-4)})`;
    } else if (paymentMode === 'cod') {
      methodLabel = 'Cash on Delivery (Tamper-Evident Artisan Seal)';
    }

    setTimeout(() => {
      const order = createOrder(shippingAddress, methodLabel, discountAmount, appliedCoupon?.code);
      setCreatedOrder(order);
      setIsProcessing(false);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation */}
        <div>
          <Link
            to="/buyer/cart"
            className="inline-flex items-center text-xs font-bold text-heritage-brown hover:text-heritage-terracotta transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Cart
          </Link>
        </div>

        {createdOrder ? (
          /* SECTION 27: ORDER SUCCESS SCREEN */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-heritage-gold shadow-3d-lg text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Successful & Order Dispatched
              </span>
              <h1 className="font-serif font-black text-3xl sm:text-4xl text-heritage-brown mt-3">
                Order #{createdOrder.order_code}
              </h1>
              <p className="text-xs sm:text-sm text-heritage-charcoal/70 mt-1 max-w-md mx-auto">
                Thank you, <strong>{createdOrder.buyer_name}</strong>! Your order has been placed directly with master artisan <strong>{createdOrder.seller_name}</strong>.
              </p>
            </div>

            <div className="p-4 bg-heritage-sand/40 rounded-2xl border border-heritage-sand text-left text-xs space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-heritage-charcoal/60">Generated Order Code:</span>
                <span className="font-mono font-bold text-heritage-brown">{createdOrder.order_code}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-heritage-charcoal/60">Artisan Awarded:</span>
                <span className="font-bold text-emerald-700">+100 Karigar Credits</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-heritage-charcoal/60">Total Paid (Demo):</span>
                <span className="font-black text-heritage-terracotta">₹{createdOrder.total_amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-heritage-charcoal/60">Destination:</span>
                <span className="font-bold text-heritage-brown">{createdOrder.shipping_address.city}, {createdOrder.shipping_address.state}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/buyer/orders"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition"
              >
                Track Live Order Delivery
              </Link>
              <Link
                to="/marketplace"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-heritage-sand hover:bg-heritage-sand/80 text-heritage-brown font-bold text-xs transition"
              >
                Continue Exploring Crafts
              </Link>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Shipping Form & Demo Payment Method */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-heritage-terracotta/20 shadow-3d space-y-6">
              <div>
                <h2 className="font-serif font-black text-2xl text-heritage-brown">
                  Delivery & Payment Details
                </h2>
                <p className="text-xs text-heritage-charcoal/70 mt-0.5">
                  Orders ship with tamper-evident heritage packaging and artisan provenance certification.
                </p>
              </div>

              <form onSubmit={handleDemoPayment} className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-heritage-terracotta">
                    Shipping Address
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-heritage-brown mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-heritage-brown mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-heritage-brown mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-heritage-brown mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Multi-Channel Payment Methods (Section 27 & SIH 2026 Direct Artisan Linkage) */}
                <div className="pt-4 border-t border-heritage-sand space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-heritage-terracotta">
                      Select Payment Method
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>ONDC Direct Settlement</span>
                    </span>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('upi')}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col items-start justify-between space-y-2 ${
                        paymentMode === 'upi'
                          ? 'border-heritage-terracotta bg-heritage-sand/40 shadow-xs ring-1 ring-heritage-terracotta'
                          : 'border-heritage-sand hover:bg-heritage-ivory/50 bg-white'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-heritage-brown">Artisan UPI</p>
                        <p className="text-[10px] text-heritage-charcoal/60">QR & Instant VPA</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode('bank_transfer')}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col items-start justify-between space-y-2 ${
                        paymentMode === 'bank_transfer'
                          ? 'border-heritage-terracotta bg-heritage-sand/40 shadow-xs ring-1 ring-heritage-terracotta'
                          : 'border-heritage-sand hover:bg-heritage-ivory/50 bg-white'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-heritage-brown">Direct Bank</p>
                        <p className="text-[10px] text-heritage-charcoal/60">NEFT / IMPS / RTGS</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode('card')}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col items-start justify-between space-y-2 ${
                        paymentMode === 'card'
                          ? 'border-heritage-terracotta bg-heritage-sand/40 shadow-xs ring-1 ring-heritage-terracotta'
                          : 'border-heritage-sand hover:bg-heritage-ivory/50 bg-white'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-heritage-brown">Cards / NetBanking</p>
                        <p className="text-[10px] text-heritage-charcoal/60">Escrow Gateway</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode('cod')}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col items-start justify-between space-y-2 ${
                        paymentMode === 'cod'
                          ? 'border-heritage-terracotta bg-heritage-sand/40 shadow-xs ring-1 ring-heritage-terracotta'
                          : 'border-heritage-sand hover:bg-heritage-ivory/50 bg-white'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-heritage-brown">Cash on Delivery</p>
                        <p className="text-[10px] text-heritage-charcoal/60">Pay at Doorstep</p>
                      </div>
                    </button>
                  </div>

                  {/* ACTIVE PAYMENT METHOD CONTENT */}
                  {paymentMode === 'upi' && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 to-heritage-sand/30 border border-emerald-200/80 space-y-3 animate-fade-in">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="space-y-1.5 text-center sm:text-left">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                            Direct Artisan Settlement
                          </span>
                          <p className="text-xs font-bold text-heritage-brown">
                            Scan to pay master artisan: {sellerBank.account_holder_name}
                          </p>
                          <div className="inline-flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-heritage-sand text-xs font-mono font-bold text-heritage-charcoal">
                            <span>{sellerBank.upi_id}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(sellerBank.upi_id, 'upi')}
                              className="text-heritage-terracotta hover:underline ml-1"
                              title="Copy UPI ID"
                            >
                              {copiedField === 'upi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <p className="text-[11px] text-heritage-charcoal/70">
                            Supported: Google Pay, PhonePe, Paytm, BHIM UPI
                          </p>
                        </div>

                        {/* Interactive QR Code Box */}
                        <div className="p-3 bg-white rounded-2xl border-2 border-emerald-300 shadow-sm text-center shrink-0">
                          <div className="w-24 h-24 bg-emerald-900 text-white rounded-xl flex flex-col items-center justify-center p-2 relative overflow-hidden">
                            <QrCode className="w-16 h-16 text-white" />
                            <span className="text-[8px] font-black text-heritage-gold tracking-widest uppercase mt-0.5">
                              ₹{totalAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-emerald-800 block mt-1">
                            Live UPI QR
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMode === 'bank_transfer' && (
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded">
                          Artisan Verified Bank Account
                        </span>
                        <span className="text-[10px] text-blue-700 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          <span>NPCI & PFMS Verified</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                          <span className="text-[10px] text-heritage-charcoal/60 block">Beneficiary Name</span>
                          <span className="font-bold text-heritage-brown">{sellerBank.account_holder_name}</span>
                        </div>

                        <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                          <span className="text-[10px] text-heritage-charcoal/60 block">Bank Name</span>
                          <span className="font-bold text-heritage-brown">{sellerBank.bank_name}</span>
                        </div>

                        <div className="p-2.5 bg-white rounded-xl border border-blue-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-heritage-charcoal/60 block">Account Number</span>
                            <span className="font-mono font-bold text-heritage-brown">{sellerBank.account_number}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(sellerBank.account_number, 'acc')}
                            className="text-blue-600 p-1 hover:bg-blue-50 rounded"
                          >
                            {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="p-2.5 bg-white rounded-xl border border-blue-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-heritage-charcoal/60 block">IFSC Code</span>
                            <span className="font-mono font-bold text-heritage-brown">{sellerBank.ifsc_code}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(sellerBank.ifsc_code, 'ifsc')}
                            className="text-blue-600 p-1 hover:bg-blue-50 rounded"
                          >
                            {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-heritage-brown mb-1">
                          Bank UTR / Transaction Reference Number (Optional for Demo)
                        </label>
                        <input
                          type="text"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          placeholder="e.g. 423984920193"
                          className="w-full p-2.5 rounded-xl border border-blue-200 text-xs font-mono font-bold bg-white focus:border-heritage-terracotta outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMode === 'card' && (
                    <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider bg-purple-100 px-2 py-0.5 rounded">
                          ONDC Escrow Gateway
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCardNumber('4532 8921 7842 1984');
                            setCardExpiry('08/29');
                            setCardCvv('742');
                          }}
                          className="text-[10px] text-purple-700 font-bold hover:underline"
                        >
                          Auto-fill Demo Card
                        </button>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-heritage-brown mb-0.5">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full p-2 rounded-xl border border-purple-200 bg-white font-mono font-bold text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-heritage-brown mb-0.5">Expiry (MM/YY)</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full p-2 rounded-xl border border-purple-200 bg-white font-mono font-bold text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-heritage-brown mb-0.5">CVV</label>
                            <input
                              type="password"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full p-2 rounded-xl border border-purple-200 bg-white font-mono font-bold text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMode === 'cod' && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1.5 animate-fade-in">
                      <p className="font-bold flex items-center space-x-1.5">
                        <Truck className="w-4 h-4 text-amber-700" />
                        <span>Cash on Delivery Available</span>
                      </p>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Pay cash upon delivery. Each consignment arrives in tamper-evident heritage packaging with a GI verification tag and artisan wax seal.
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-4 py-4 rounded-2xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-black text-sm shadow-3d transition flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <span>Processing Payment to Artisan...</span>
                  ) : (
                    <>
                      <span>Authorize Payment of ₹{totalAmount.toLocaleString('en-IN')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Summary & Coupon / Voucher Upload */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-heritage-sand shadow-3d space-y-4">
              <h3 className="font-serif font-bold text-lg text-heritage-brown border-b border-heritage-sand pb-3">
                Review Bag ({cart.length} items)
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-heritage-sand"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-heritage-brown line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-[10px] text-heritage-charcoal/60">
                        Qty: {item.quantity} &bull; Sold by {item.product.seller.full_name}
                      </p>
                    </div>
                    <span className="font-bold text-heritage-terracotta">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* COUPON & VOUCHER UPLOADER SECTION (Section 26 & User Request) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-heritage-sand/50 via-heritage-ivory to-heritage-sand/40 border border-heritage-terracotta/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-heritage-brown flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-heritage-terracotta" />
                    <span>Coupon / Voucher Discount</span>
                  </span>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[10px] text-red-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {!appliedCoupon ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 p-2 rounded-xl border border-heritage-sand bg-white text-xs font-mono uppercase font-bold focus:border-heritage-terracotta outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCode(couponInput)}
                        className="px-4 py-2 bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Voucher Document / Image Uploader */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => voucherInputRef.current?.click()}
                        className="w-full py-2 px-3 border border-dashed border-heritage-terracotta/60 hover:bg-white/80 rounded-xl text-[11px] font-bold text-heritage-terracotta flex items-center justify-center space-x-1.5 transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Voucher / Gift Certificate</span>
                      </button>
                      <input
                        type="file"
                        ref={voucherInputRef}
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleVoucherFileUpload}
                      />
                    </div>

                    {/* Quick voucher chip suggestions */}
                    <div className="pt-1">
                      <p className="text-[10px] text-heritage-charcoal/60 mb-1 font-semibold">
                        Available Offers:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApplyCode('SIH2026')}
                          className="text-[10px] bg-white border border-heritage-sand hover:border-heritage-terracotta px-2 py-0.5 rounded-lg text-heritage-brown font-mono font-bold"
                        >
                          SIH2026 (20% OFF)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyCode('HERITAGE500')}
                          className="text-[10px] bg-white border border-heritage-sand hover:border-heritage-terracotta px-2 py-0.5 rounded-lg text-heritage-brown font-mono font-bold"
                        >
                          HERITAGE500 (₹500 OFF)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyCode('ARTISAN15')}
                          className="text-[10px] bg-white border border-heritage-sand hover:border-heritage-terracotta px-2 py-0.5 rounded-lg text-heritage-brown font-mono font-bold"
                        >
                          ARTISAN15 (15% OFF)
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1" />
                        <span>{appliedCoupon.code} Applied</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-700">
                        -₹{discountAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-600">
                      {uploadedVoucherName ? `Scanned from: ${uploadedVoucherName}` : appliedCoupon.description}
                    </p>
                  </div>
                )}

                {couponMessage && (
                  <p className={`text-[10px] font-bold ${couponMessage.isError ? 'text-red-600' : 'text-emerald-700'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-heritage-sand text-xs space-y-1.5">
                <div className="flex justify-between text-heritage-charcoal/70">
                  <span>Subtotal</span>
                  <span className="font-bold text-heritage-brown">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-heritage-charcoal/70">
                  <span>Delivery</span>
                  <span className="font-bold text-emerald-700">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Voucher Discount ({appliedCoupon?.code})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-heritage-brown pt-2 border-t border-heritage-sand">
                  <span>Total Payable</span>
                  <span className="font-black text-heritage-terracotta text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
