import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Lock, User, Phone, CheckCircle, Shield, ArrowRight, AlertCircle, Mail, Zap, RefreshCw, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { otpService } from '../../services/otpService';
import { Avatar } from '../../components/common/Avatar';

export const LoginPage: React.FC = () => {
  const { login, verifyOtp, loginAsSeller, loginAsBuyer } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [authMethod, setAuthMethod] = useState<'credentials' | 'otp'>('credentials');
  const [identity, setIdentity] = useState('seller_demo');
  const [password, setPassword] = useState('Seller@123');
  const [otpTargetType, setOtpTargetType] = useState<'mobile' | 'email'>('mobile');
  const [mobile, setMobile] = useState('+91 92814 32397');
  const [email, setEmail] = useState('artisan@karigarsetu.ai');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole>('seller');
  const [errorMsg, setErrorMsg] = useState('');

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Listen for auto-fill events from notification banner
  useEffect(() => {
    const handleAutoFill = (e: CustomEvent<{ otp: string }>) => {
      if (e.detail && e.detail.otp) {
        setOtp(e.detail.otp);
      }
    };
    window.addEventListener('karigarsetu-autofill-otp' as any, handleAutoFill as any);
    return () => {
      window.removeEventListener('karigarsetu-autofill-otp' as any, handleAutoFill as any);
    };
  }, []);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = login(identity, password);
    if (success) {
      navigate('/seller/dashboard');
    } else {
      setErrorMsg('Invalid username or password. Please use the quick demo presets below.');
    }
  };

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const targetContact = otpTargetType === 'mobile' ? mobile.trim() : email.trim();
    if (otpTargetType === 'mobile' && targetContact.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (otpTargetType === 'email' && !targetContact.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Dispatch real simulated OTP with audio chime & push notification
    const event = otpService.dispatchOtp(targetContact, otpTargetType);
    setGeneratedOtp(event.otp);
    setOtpSent(true);
    setResendCooldown(30);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetContact = otpTargetType === 'mobile' ? mobile : email;
    const isValid = otpService.verify(otp, generatedOtp);

    if (isValid) {
      const success = verifyOtp(targetContact, otp, selectedRole);
      if (success) {
        if (selectedRole === 'seller') {
          navigate('/seller/dashboard');
        } else {
          navigate('/buyer/marketplace');
        }
      } else {
        setErrorMsg('Authentication failed. Please retry or use demo presets.');
      }
    } else {
      setErrorMsg(`Invalid verification code. Please enter the 6-digit OTP delivered above (or 123456).`);
    }
  };

  const handleGoogleLogin = () => {
    if (selectedRole === 'seller') {
      loginAsSeller();
      navigate('/seller/dashboard');
    } else {
      loginAsBuyer();
      navigate('/buyer/marketplace');
    }
  };

  return (
    <div className="min-h-screen bg-heritage-ivory bg-heritage-pattern flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-heritage-terracotta text-heritage-gold flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-heritage-gold-light" />
            </div>
            <span className="font-display font-black text-2xl text-heritage-brown">
              KARIGAR<span className="text-heritage-terracotta">SETU</span> AI
            </span>
          </Link>
          <h2 className="font-serif font-black text-2xl text-heritage-brown mt-4">
            Welcome Back
          </h2>
          <p className="text-xs text-heritage-charcoal/70 mt-1 font-medium">
            Sign in to manage your crafts, orders, and AI listings.
          </p>
        </div>

        {/* SECTION 42: SIH Judge Quick Demo Presets */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-heritage-sand/80 via-white to-heritage-sand/80 border-2 border-heritage-gold/60 shadow-md">
          <p className="text-xs font-bold text-heritage-brown text-center mb-3 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 mr-1.5 text-heritage-terracotta" />
            <span>Instant Demo Access for SIH 2026 Evaluators</span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                loginAsSeller();
                navigate('/seller/dashboard');
              }}
              className="p-3 rounded-2xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white text-xs font-bold shadow-sm hover:shadow-md transition flex items-center space-x-2.5 text-left group"
            >
              <Avatar src="/avatars/ravi-kumar.jpg" name="Ravi Kumar" role="seller" size="sm" className="border-white/40 group-hover:scale-105 transition-transform shrink-0" />
              <div className="min-w-0">
                <span className="block leading-tight font-black">Try Seller Demo</span>
                <span className="text-[10px] font-normal text-white/80 truncate block">Ravi Kumar (Artisan)</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                loginAsBuyer();
                navigate('/buyer/marketplace');
              }}
              className="p-3 rounded-2xl bg-heritage-brown hover:bg-heritage-brown-dark text-heritage-gold-light text-xs font-bold shadow-sm hover:shadow-md transition flex items-center space-x-2.5 text-left group"
            >
              <Avatar src="/avatars/ananya-sharma.jpg" name="Ananya Sharma" role="buyer" size="sm" className="border-heritage-gold/40 group-hover:scale-105 transition-transform shrink-0" />
              <div className="min-w-0">
                <span className="block leading-tight font-black text-white">Try Buyer Demo</span>
                <span className="text-[10px] font-normal text-heritage-sand/80 truncate block">Ananya Sharma (Patron)</span>
              </div>
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-terracotta/20 shadow-3d">
          {/* Method Tabs */}
          <div className="flex border-b border-heritage-sand pb-4 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('credentials');
                setErrorMsg('');
              }}
              className={`flex-1 pb-2 text-xs font-bold text-center border-b-2 transition ${
                authMethod === 'credentials'
                  ? 'border-heritage-terracotta text-heritage-terracotta'
                  : 'border-transparent text-heritage-charcoal/60 hover:text-heritage-brown'
              }`}
            >
              Username & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('otp');
                setErrorMsg('');
              }}
              className={`flex-1 pb-2 text-xs font-bold text-center border-b-2 transition ${
                authMethod === 'otp'
                  ? 'border-heritage-terracotta text-heritage-terracotta'
                  : 'border-transparent text-heritage-charcoal/60 hover:text-heritage-brown'
              }`}
            >
              OTP Login (Mobile / Email)
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {authMethod === 'credentials' ? (
            /* Username + Password Form */
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    placeholder="seller_demo or buyer_demo"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium text-heritage-charcoal focus:border-heritage-terracotta focus:ring-1 focus:ring-heritage-terracotta outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-heritage-brown">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Demo Password is: Seller@123 or Buyer@123')}
                    className="text-[11px] text-heritage-terracotta font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium text-heritage-charcoal focus:border-heritage-terracotta focus:ring-1 focus:ring-heritage-terracotta outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition"
              >
                Sign In
              </button>
            </form>
          ) : (
            /* Multi-Channel OTP Flow (SMS / WhatsApp or Email) */
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {/* Channel Switcher */}
                  <div className="flex items-center space-x-2 bg-heritage-sand/40 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setOtpTargetType('mobile')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                        otpTargetType === 'mobile'
                          ? 'bg-heritage-terracotta text-white shadow-xs'
                          : 'text-heritage-brown hover:bg-white/50'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Mobile SMS / WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtpTargetType('email')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                        otpTargetType === 'email'
                          ? 'bg-heritage-terracotta text-white shadow-xs'
                          : 'text-heritage-brown hover:bg-white/50'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Address</span>
                    </button>
                  </div>

                  {otpTargetType === 'mobile' ? (
                    <div>
                      <label className="block text-xs font-bold text-heritage-brown mb-1">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          required
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="+91 92814 32397"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium text-heritage-charcoal focus:border-heritage-terracotta focus:ring-1 focus:ring-heritage-terracotta outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-heritage-charcoal/60 mt-1">
                        We will send a 6-digit OTP via SMS / WhatsApp gateway.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-heritage-brown mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="artisan@karigarsetu.ai"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium text-heritage-charcoal focus:border-heritage-terracotta focus:ring-1 focus:ring-heritage-terracotta outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-heritage-charcoal/60 mt-1">
                        We will deliver a 6-digit verification code to your inbox.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-heritage-brown mb-1.5">
                      Login Role
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('seller')}
                        className={`py-2 text-xs font-bold rounded-lg border transition ${
                          selectedRole === 'seller'
                            ? 'bg-heritage-terracotta text-white border-heritage-terracotta'
                            : 'border-heritage-sand text-heritage-brown bg-heritage-ivory/50'
                        }`}
                      >
                        Artisan / Seller
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole('buyer')}
                        className={`py-2 text-xs font-bold rounded-lg border transition ${
                          selectedRole === 'buyer'
                            ? 'bg-heritage-brown text-heritage-gold-light border-heritage-brown'
                            : 'border-heritage-sand text-heritage-brown bg-heritage-ivory/50'
                        }`}
                      >
                        Buyer
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
                  >
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold flex items-center">
                        <CheckCircle className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
                        Verification Code Sent!
                      </p>
                      <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700">
                      Dispatched to <strong className="font-mono">{otpTargetType === 'mobile' ? mobile : email}</strong> via Fast2SMS & Gov Mail Gateway.
                    </p>
                    <p className="text-[10px] text-emerald-600 italic">
                      Check the notification banner at the top of your screen.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-heritage-brown">
                        Enter 6-Digit Verification Code
                      </label>
                      {generatedOtp && (
                        <button
                          type="button"
                          onClick={() => setOtp(generatedOtp)}
                          className="text-[11px] text-heritage-terracotta font-bold hover:underline flex items-center space-x-1"
                        >
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span>Auto-Fill {generatedOtp}</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder={generatedOtp || '123456'}
                      className="w-full text-center tracking-widest text-xl font-mono font-black py-2.5 rounded-xl border-2 border-heritage-sand bg-white text-heritage-brown focus:border-heritage-terracotta outline-none shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition"
                  >
                    Verify & Sign In
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      disabled={resendCooldown > 0}
                      onClick={() => handleSendOtp()}
                      className={`font-semibold flex items-center space-x-1 ${
                        resendCooldown > 0
                          ? 'text-heritage-charcoal/40 cursor-not-allowed'
                          : 'text-heritage-terracotta hover:underline'
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                      <span>
                        {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                      }}
                      className="text-heritage-charcoal/60 font-semibold hover:underline"
                    >
                      Change {otpTargetType === 'mobile' ? 'Mobile' : 'Email'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-heritage-sand"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-heritage-charcoal/50 font-medium">
                Or Continue With
              </span>
            </div>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 rounded-xl border border-heritage-sand hover:bg-heritage-sand/40 text-xs font-bold text-heritage-brown flex items-center justify-center space-x-2 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-heritage-charcoal/70 font-medium mt-6">
          New to KARIGARSETU AI?{' '}
          <Link to="/select-role" className="font-bold text-heritage-terracotta hover:underline">
            Choose Role & Join
          </Link>
        </p>
      </div>
    </div>
  );
};
