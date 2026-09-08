import React, { useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Hammer, ShoppingBag, Upload, ArrowRight, AlertCircle, Camera, Check, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LocationInput } from '../../components/common/LocationInput';
import { otpService } from '../../services/otpService';
export const SignupPage = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') || 'seller';
    const [role, setRole] = useState(initialRole);
    const { signup } = useApp();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        city: 'Kothagudem',
        state: 'Telangana',
        craftSpecialization: '',
        bio: '',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    });
    const [errorMsg, setErrorMsg] = useState('');
    // OTP Verification State
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [verifiedContact, setVerifiedContact] = useState('');
    const [otpChannel, setOtpChannel] = useState('mobile');
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const [otpError, setOtpError] = useState('');
    // Countdown timer for OTP
    React.useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);
    // Listen for auto-fill events from notification banner
    React.useEffect(() => {
        const handleAutoFill = (e) => {
            if (e.detail && e.detail.otp) {
                setOtpCode(e.detail.otp);
            }
        };
        window.addEventListener('karigarsetu-autofill-otp', handleAutoFill);
        return () => {
            window.removeEventListener('karigarsetu-autofill-otp', handleAutoFill);
        };
    }, []);
    const handleSendSignupOtp = (channel) => {
        setOtpError('');
        const target = channel === 'mobile' ? formData.mobile.trim() : formData.email.trim();
        if (channel === 'mobile' && target.replace(/\D/g, '').length < 10) {
            setOtpError('Please enter a valid 10-digit mobile number above first.');
            return;
        }
        if (channel === 'email' && !target.includes('@')) {
            setOtpError('Please enter a valid email address above first.');
            return;
        }
        setOtpChannel(channel);
        const event = otpService.dispatchOtp(target, channel);
        setGeneratedOtp(event.otp);
        setOtpSent(true);
        setResendCooldown(30);
    };
    const handleVerifySignupOtp = () => {
        setOtpError('');
        if (!otpCode) {
            setOtpError('Please enter the 6-digit verification code.');
            return;
        }
        const isValid = otpService.verify(otpCode, generatedOtp);
        if (isValid) {
            setIsOtpVerified(true);
            const contact = otpChannel === 'mobile' ? formData.mobile : formData.email;
            setVerifiedContact(contact);
            setOtpSent(false);
        }
        else {
            setOtpError('Invalid OTP code. Please enter the code delivered at the top.');
        }
    };
    const indianStates = [
        'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Gujarat', 'Haryana',
        'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
        'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan',
        'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    ];
    const presetAvatars = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    ];
    const handleImageFile = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setFormData((prev) => ({
                        ...prev,
                        profileImage: event.target?.result,
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('Passwords do not match.');
            return;
        }
        if (formData.password.length < 6) {
            setErrorMsg('Password must be at least 6 characters long.');
            return;
        }
        signup({
            full_name: formData.fullName,
            username: formData.username,
            email: formData.email,
            mobile: formData.mobile,
            city: formData.city,
            state: formData.state,
            craft_specialization: role === 'seller' ? formData.craftSpecialization : undefined,
            bio: formData.bio,
            profile_image: formData.profileImage,
            password: formData.password,
        }, role);
        if (role === 'seller') {
            navigate('/seller/dashboard');
        }
        else {
            navigate('/buyer/marketplace');
        }
    };
    return (<div className="min-h-screen bg-heritage-ivory bg-heritage-pattern py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <img src="/karigasetu-logo.png" alt="Karigasetu.ai Logo" className="h-12 w-12 rounded-full object-contain shadow-md border-2 border-heritage-gold/50 group-hover:scale-105 transition-transform"/>
            <div className="flex flex-col text-left">
              <span className="font-display font-black text-2xl tracking-tight text-heritage-brown leading-none">
                KARIGA<span className="text-heritage-terracotta">SETU</span>.AI
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-heritage-terracotta mt-0.5">
                Heritage to Market • AI
              </span>
            </div>
          </Link>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-heritage-brown mt-3">
            Join the Artisan Movement
          </h2>
          <p className="text-xs text-heritage-charcoal/70 mt-1 font-medium">
            Create your account to start selling or discovering authentic Indian heritage.
          </p>
        </div>

        {/* Selected Role Pill Selector */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex p-1 bg-white rounded-2xl border border-heritage-sand shadow-sm">
            <button type="button" onClick={() => setRole('seller')} className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition ${role === 'seller'
            ? 'bg-heritage-terracotta text-white shadow-sm'
            : 'text-heritage-charcoal/70 hover:text-heritage-brown'}`}>
              <Hammer className="w-4 h-4"/>
              <span>SELLER / ARTISAN</span>
            </button>
            <button type="button" onClick={() => setRole('buyer')} className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition ${role === 'buyer'
            ? 'bg-heritage-brown text-heritage-gold-light shadow-sm'
            : 'text-heritage-charcoal/70 hover:text-heritage-brown'}`}>
              <ShoppingBag className="w-4 h-4"/>
              <span>BUYER / PATRON</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-heritage-terracotta/20 shadow-3d">
          {errorMsg && (<div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0"/>
              <span>{errorMsg}</span>
            </div>)}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROBLEM 4 FIX: PROFILE PICTURE UPLOADER */}
            <div className="p-4 bg-heritage-sand/30 rounded-2xl border border-heritage-sand flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={formData.profileImage} alt="Profile Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-heritage-gold shadow-md group-hover:opacity-80 transition"/>
                  <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white">
                    <Camera className="w-6 h-6"/>
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-heritage-terracotta text-white p-1 rounded-full shadow-sm">
                    <Upload className="w-3 h-3"/>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-heritage-brown">
                    Profile Photo *
                  </label>
                  <p className="text-[11px] text-heritage-charcoal/60 mt-0.5">
                    Upload your face or workshop picture to personalize your dashboard.
                  </p>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2 px-3 py-1 bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white rounded-lg text-xs font-bold shadow-xs transition">
                    Upload Custom Photo
                  </button>
                </div>
              </div>

              {/* Preset avatar options */}
              <div className="flex flex-col items-center sm:items-end">
                <span className="text-[10px] font-bold text-heritage-charcoal/50 uppercase mb-1">
                  Or Pick Avatar
                </span>
                <div className="flex items-center space-x-1.5">
                  {presetAvatars.map((url, idx) => (<button key={idx} type="button" onClick={() => setFormData({ ...formData, profileImage: url })} className={`w-8 h-8 rounded-full overflow-hidden border-2 transition ${formData.profileImage === url
                ? 'border-heritage-terracotta scale-110 shadow-sm'
                : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={url} alt="Preset" className="w-full h-full object-cover"/>
                    </button>))}
                </div>
              </div>

              <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageFile}/>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3"/>
                  <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="e.g. Ramesh Chandra" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Username *
                </label>
                <input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="e.g. rameshcrafts" className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"/>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3"/>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="ramesh@artisan.in" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Mobile Number (with WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3"/>
                  <input type="tel" required value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"/>
                </div>
              </div>
            </div>

            {/* PROBLEM 5 FIX: INTERACTIVE OTP VERIFICATION (MOBILE & EMAIL) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-heritage-sand/40 to-heritage-ivory border border-heritage-terracotta/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-heritage-terracotta"/>
                  <span className="text-xs font-bold text-heritage-brown">
                    Contact Verification (Fast2SMS & Gov Mail Gateway)
                  </span>
                </div>
                {isOtpVerified ? (<span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5"/>
                    <span>Verified</span>
                  </span>) : (<span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    Verification Ready
                  </span>)}
              </div>

              {otpError && (<p className="text-[11px] font-medium text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                  {otpError}
                </p>)}

              {isOtpVerified ? (<div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0"/>
                    <span className="text-[11px] font-medium">
                      Verified & certified: <strong className="font-mono">{verifiedContact}</strong>.
                    </span>
                  </div>
                  <button type="button" onClick={() => setIsOtpVerified(false)} className="text-[10px] text-emerald-700 underline font-semibold hover:text-emerald-900">
                    Re-verify
                  </button>
                </div>) : (<div className="space-y-2.5">
                  <p className="text-[11px] text-heritage-charcoal/70">
                    Send a 6-digit OTP code to your registered mobile number or email ID to authenticate:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleSendSignupOtp('mobile')} className="flex-1 min-w-[140px] py-2 px-3 rounded-xl bg-white border border-heritage-sand hover:border-heritage-terracotta hover:bg-heritage-sand/20 text-xs font-bold text-heritage-brown flex items-center justify-center space-x-1.5 transition shadow-2xs">
                      <Phone className="w-3.5 h-3.5 text-heritage-terracotta"/>
                      <span>Send OTP to Mobile</span>
                    </button>

                    <button type="button" onClick={() => handleSendSignupOtp('email')} className="flex-1 min-w-[140px] py-2 px-3 rounded-xl bg-white border border-heritage-sand hover:border-heritage-terracotta hover:bg-heritage-sand/20 text-xs font-bold text-heritage-brown flex items-center justify-center space-x-1.5 transition shadow-2xs">
                      <Mail className="w-3.5 h-3.5 text-heritage-terracotta"/>
                      <span>Send OTP to Email</span>
                    </button>
                  </div>

                  {otpSent && (<div className="pt-2 border-t border-heritage-sand/60 space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-heritage-brown">
                          Enter 6-digit code sent to <strong className="font-mono">{otpChannel === 'mobile' ? formData.mobile : formData.email}</strong>:
                        </span>
                        {generatedOtp && (<button type="button" onClick={() => setOtpCode(generatedOtp)} className="text-[11px] text-heritage-terracotta font-bold hover:underline flex items-center space-x-0.5">
                            <Zap className="w-3 h-3 text-amber-500"/>
                            <span>Auto-Fill</span>
                          </button>)}
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="text" maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder={generatedOtp || '123456'} className="flex-1 text-center font-mono font-bold tracking-widest text-base py-1.5 px-3 rounded-xl border border-heritage-sand bg-white text-heritage-brown focus:border-heritage-terracotta outline-none"/>
                        <button type="button" onClick={handleVerifySignupOtp} className="py-2 px-4 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-xs transition">
                          Verify OTP
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-heritage-charcoal/60 pt-0.5">
                        <span>Check incoming notification at top of screen</span>
                        <button type="button" disabled={resendCooldown > 0} onClick={() => handleSendSignupOtp(otpChannel)} className={`font-semibold ${resendCooldown > 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-heritage-terracotta hover:underline'}`}>
                          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                        </button>
                      </div>
                    </div>)}
                </div>)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3"/>
                  <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Minimum 6 characters" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3"/>
                  <input type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Re-enter password" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"/>
                </div>
              </div>
            </div>

            {/* PROBLEM 1 & 2 FIX: SMART LOCATION INPUT & STATE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  State *
                </label>
                <select value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none">
                  {indianStates.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  City / Village / Cluster *
                </label>
                <LocationInput city={formData.city} state={formData.state} onChangeCity={(city) => setFormData((prev) => ({ ...prev, city }))} onChangeState={(state) => setFormData((prev) => ({ ...prev, state }))} placeholder="e.g. Kothagudem or Warangal"/>
              </div>
            </div>

            {role === 'seller' && (<div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Craft Specialization / Tradition *
                </label>
                <input type="text" required value={formData.craftSpecialization} onChange={(e) => setFormData({ ...formData, craftSpecialization: e.target.value })} placeholder="e.g. Traditional Teakwood Carving, Pit-Loom Cotton, Bell Metal" className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"/>
              </div>)}

            <div>
              <label className="block text-xs font-bold text-heritage-brown mb-1">
                Bio / Artisan Story
              </label>
              <textarea rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Share your lineage, generations of practice, or passion for authentic handmade crafts..." className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"/>
            </div>

            <button type="submit" className="w-full py-3.5 rounded-2xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-sm shadow-3d hover:scale-101 transition flex items-center justify-center space-x-2">
              <span>Complete Account Creation</span>
              <ArrowRight className="w-4 h-4"/>
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-heritage-charcoal/70 font-medium mt-6">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-heritage-terracotta hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>);
};
