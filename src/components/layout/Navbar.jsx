import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ShoppingBag, Heart, Menu, X, LogOut, Layers, Scan, LayoutDashboard, Award, Globe, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { useI18n, SUPPORTED_LANGUAGES } from '../../services/i18n';

export const Navbar = () => {
    const { currentUser, currentRole, switchRole, logout, cartCount, wishlist, loginAsSeller, loginAsBuyer, resetDemoData } = useApp();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const { language, changeLanguage, t } = useI18n();
    const navigate = useNavigate();
    const location = useLocation();

    const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

    const handleRoleToggle = (targetRole) => {
        switchRole(targetRole);
        if (targetRole === 'seller') {
            navigate('/seller/dashboard');
        }
        else {
            navigate('/buyer/marketplace');
        }
    };

    return (<header className="sticky top-0 z-50 bg-heritage-ivory/90 backdrop-blur-md border-b border-heritage-terracotta/15 transition-all">
      {/* SIH Top Announcement Bar */}
      <div className="bg-gradient-to-r from-heritage-brown via-heritage-terracotta to-heritage-brown text-heritage-gold-light py-1.5 px-4 text-xs font-medium text-center shadow-sm flex items-center justify-center space-x-2">
        <span className="bg-heritage-gold text-heritage-brown font-bold px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase shadow-xs">
          SIH 2026
        </span>
        <span className="truncate">Smart India Hackathon • Team HEXANOVA • Theme: Heritage & Culture</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group shrink-0">
          <img src="/assets/karigarsetu-ai-logo.png" alt="KARIGARSETU.AI Official Logo" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-contain shadow-xs border border-heritage-terracotta/25 group-hover:scale-105 transition-transform shrink-0"/>
          <div className="flex flex-col text-left">
            <span className="font-display font-black text-lg sm:text-xl tracking-wider text-heritage-brown leading-tight">
              KARIGARSETU.AI
            </span>
            <p className="text-[9.5px] sm:text-[10px] tracking-wider text-heritage-brown/80 font-medium -mt-0.5 hidden xs:block">
              {t('tagline')}
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-heritage-brown">
          <Link to="/" className={`hover:text-heritage-terracotta transition ${location.pathname === '/' ? 'text-heritage-terracotta font-bold' : ''}`}>
            {t('home')}
          </Link>
          <Link to="/marketplace" className={`hover:text-heritage-terracotta transition ${location.pathname.includes('/marketplace') ? 'text-heritage-terracotta font-bold' : ''}`}>
            {t('marketplace')}
          </Link>
          <a href="/#how-it-works" className="hover:text-heritage-terracotta transition">
            {t('howItWorks')}
          </a>
          <Link to="/seller/ai-analyzer" className="flex items-center space-x-1.5 bg-gradient-to-r from-heritage-terracotta/10 to-heritage-gold/15 text-heritage-terracotta px-3 py-1.5 rounded-full border border-heritage-terracotta/25 hover:border-heritage-terracotta hover:bg-heritage-terracotta/20 transition group">
            <Scan className="w-4 h-4 text-heritage-terracotta group-hover:rotate-12 transition-transform"/>
            <span>{t('aiAnalyzer')}</span>
          </Link>

          {currentUser?.role === 'seller' ? (<Link to="/seller/dashboard" className={`hover:text-heritage-terracotta transition flex items-center space-x-1 ${location.pathname.startsWith('/seller') && !location.pathname.includes('ai-analyzer') ? 'text-heritage-terracotta font-bold' : ''}`}>
              <LayoutDashboard className="w-4 h-4"/>
              <span>{t('artisanPortal')}</span>
            </Link>) : currentUser?.role === 'buyer' ? (<Link to="/buyer/orders" className={`hover:text-heritage-terracotta transition flex items-center space-x-1 ${location.pathname.startsWith('/buyer') ? 'text-heritage-terracotta font-bold' : ''}`}>
              <ShoppingBag className="w-4 h-4"/>
              <span>{t('myOrders')}</span>
            </Link>) : (<Link to="/login" state={{ from: { pathname: '/seller/dashboard' } }} className={`hover:text-heritage-terracotta transition flex items-center space-x-1 text-heritage-brown`}>
              <LayoutDashboard className="w-4 h-4"/>
              <span>{t('artisanPortal')}</span>
            </Link>)}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center space-x-2.5">
          {/* Global Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full border border-heritage-terracotta/25 bg-white/80 hover:bg-white text-heritage-brown text-xs font-bold transition shadow-xs"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-heritage-terracotta" />
              <span className="text-[11px] font-bold">{currentLangObj.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-heritage-charcoal/60" />
            </button>
            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-3d-lg border border-heritage-terracotta/15 py-2 z-50"
                onMouseLeave={() => setLangDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-heritage-charcoal/60 uppercase tracking-wider border-b border-heritage-sand">
                  Choose Language / भाषा
                </div>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      changeLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs font-bold transition flex items-center justify-between ${
                      language === l.code
                        ? 'bg-heritage-terracotta/10 text-heritage-terracotta'
                        : 'text-heritage-brown hover:bg-heritage-sand/30'
                    }`}
                  >
                    <span>{l.nativeName}</span>
                    <span className="text-[10px] text-heritage-charcoal/50 font-normal">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          <Link to="/buyer/wishlist" className="p-2 text-heritage-brown hover:text-heritage-terracotta transition relative" title="Wishlist">
            <Heart className="w-5 h-5"/>
            {wishlist.length > 0 && (<span className="absolute top-1 right-1 w-4 h-4 bg-heritage-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>)}
          </Link>

          {/* Cart Icon */}
          <Link to="/buyer/cart" className="p-2 text-heritage-brown hover:text-heritage-terracotta transition relative" title="Shopping Cart">
            <ShoppingBag className="w-5 h-5"/>
            {cartCount > 0 && (<span className="absolute top-1 right-1 w-4 h-4 bg-heritage-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>)}
          </Link>

          {/* User Profile / Auth State */}
          {currentUser ? (<div className="relative">
              <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="flex items-center space-x-2 p-1.5 rounded-full border border-heritage-terracotta/20 hover:border-heritage-terracotta bg-white/80 transition">
                <Avatar src={currentUser.profile_image} name={currentUser.full_name} size="sm" role={currentUser.role}/>
                <div className="hidden lg:block text-left pr-2">
                  <p className="text-xs font-bold text-heritage-brown leading-none">
                    {currentUser.full_name}
                  </p>
                  <p className="text-[10px] text-heritage-terracotta font-medium capitalize mt-0.5">
                    {currentUser.role}
                  </p>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (<div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-3d-lg border border-heritage-terracotta/15 py-2 z-50" onMouseLeave={() => setProfileDropdownOpen(false)}>
                  <div className="px-4 py-3 border-b border-heritage-sand bg-heritage-ivory/50">
                    <p className="text-xs font-semibold text-heritage-charcoal">{t('loggedInAs')}</p>
                    <p className="text-sm font-bold text-heritage-brown truncate">{currentUser.full_name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-heritage-gold/20 text-heritage-brown border border-heritage-gold/30 uppercase">
                        {currentUser.role}
                      </span>
                      {currentUser.role === 'seller' && (<span className="text-[11px] font-semibold text-heritage-terracotta flex items-center">
                          <Award className="w-3.5 h-3.5 mr-0.5"/>
                          {currentUser.credits} {t('credits')}
                        </span>)}
                    </div>
                  </div>

                  <div className="py-1">
                    {currentUser.role === 'seller' ? (<>
                        <Link to="/seller/dashboard" onClick={() => setProfileDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-heritage-charcoal hover:bg-heritage-sand/40 hover:text-heritage-terracotta">
                          <LayoutDashboard className="w-4 h-4 mr-2.5 text-heritage-brown"/>
                          {t('artisanDashboard')}
                        </Link>
                        <Link to="/seller/ai-analyzer" onClick={() => setProfileDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-heritage-charcoal hover:bg-heritage-sand/40 hover:text-heritage-terracotta">
                          <Scan className="w-4 h-4 mr-2.5 text-heritage-terracotta"/>
                          {t('aiAnalyzer')}
                        </Link>
                        <Link to="/seller/products" onClick={() => setProfileDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-heritage-charcoal hover:bg-heritage-sand/40 hover:text-heritage-terracotta">
                          <Layers className="w-4 h-4 mr-2.5 text-heritage-brown"/>
                          {t('myProducts')}
                        </Link>
                        <Link to="/seller/credits" onClick={() => setProfileDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-heritage-charcoal hover:bg-heritage-sand/40 hover:text-heritage-terracotta">
                          <Award className="w-4 h-4 mr-2.5 text-heritage-gold"/>
                          {t('credits')}
                        </Link>
                      </>) : (<>
                        <Link to="/buyer/orders" onClick={() => setProfileDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-heritage-charcoal hover:bg-heritage-sand/40 hover:text-heritage-terracotta">
                          <ShoppingBag className="w-4 h-4 mr-2.5 text-heritage-brown"/>
                          {t('myOrders')}
                        </Link>
                        <Link to="/buyer/marketplace" onClick={() => setProfileDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-heritage-charcoal hover:bg-heritage-sand/40 hover:text-heritage-terracotta">
                          <Sparkles className="w-4 h-4 mr-2.5 text-heritage-brown"/>
                          {t('exploreCrafts')}
                        </Link>
                      </>)}

                    <div className="border-t border-heritage-sand my-1"></div>
                    <button onClick={() => {
                    logout();
                    setProfileDropdownOpen(false);
                    navigate('/');
                }} className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2.5"/>
                      {t('signOut')}
                    </button>
                  </div>
                </div>)}
            </div>) : (<div className="flex items-center space-x-2">
              <Link to="/login" className="px-4 py-1.5 text-xs font-bold text-heritage-brown hover:text-heritage-terracotta border border-heritage-terracotta/30 hover:border-heritage-terracotta bg-white/90 rounded-full shadow-xs transition">
                {t('login')}
              </Link>
              <Link to="/select-role" className="px-4 py-1.5 text-xs font-bold bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white rounded-full shadow-3d-sm hover:shadow-3d transition">
                {t('signUp')}
              </Link>
            </div>)}

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-heritage-brown hover:text-heritage-terracotta cursor-pointer">
            {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (<div className="md:hidden bg-heritage-ivory border-b border-heritage-terracotta/20 px-4 pt-3 pb-6 space-y-3">
          {currentUser && (<div className="flex items-center space-x-3 p-3 bg-white rounded-2xl border border-heritage-sand/80 shadow-xs mb-2">
              <Avatar src={currentUser.profile_image} name={currentUser.full_name} size="md" role={currentUser.role}/>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-bold text-heritage-brown truncate">{currentUser.full_name}</p>
                <p className="text-[11px] text-heritage-terracotta font-medium capitalize">{currentUser.role}</p>
              </div>
            </div>)}
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-heritage-brown hover:text-heritage-terracotta">
            {t('home')}
          </Link>
          <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-heritage-brown hover:text-heritage-terracotta">
            {t('marketplace')}
          </Link>
          <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-heritage-brown hover:text-heritage-terracotta">
            {t('howItWorks')}
          </a>
          <Link to="/seller/ai-analyzer" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2 py-2 text-sm font-semibold text-heritage-terracotta">
            <Scan className="w-4 h-4"/>
            <span>{t('aiAnalyzer')}</span>
          </Link>
          {currentUser?.role === 'seller' ? (<Link to="/seller/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-heritage-brown hover:text-heritage-terracotta">
              {t('artisanDashboard')}
            </Link>) : currentUser?.role === 'buyer' ? (<Link to="/buyer/orders" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-heritage-brown hover:text-heritage-terracotta">
              {t('myOrders')}
            </Link>) : (<Link to="/login" state={{ from: { pathname: '/seller/dashboard' } }} onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-heritage-brown hover:text-heritage-terracotta">
              {t('artisanPortal')}
            </Link>)}

          {/* Mobile Language Selector */}
          <div className="pt-2 border-t border-heritage-sand/60">
            <p className="text-xs font-bold text-heritage-brown mb-2 flex items-center">
              <Globe className="w-3.5 h-3.5 mr-1 text-heritage-terracotta" />
              <span>Language / भाषा:</span>
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    changeLanguage(l.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 px-2.5 rounded-xl text-xs font-bold text-left transition flex items-center justify-between ${
                    language === l.code
                      ? 'bg-heritage-terracotta text-white'
                      : 'bg-white/80 text-heritage-brown hover:bg-white'
                  }`}
                >
                  <span>{l.nativeName}</span>
                  <span className="text-[10px] opacity-75">{l.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {currentUser ? (<button onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                }} className="w-full text-left py-2 text-sm font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-2 border-t border-heritage-sand/60 pt-3 cursor-pointer">
              <LogOut className="w-4 h-4"/>
              <span>{t('signOut')}</span>
            </button>) : (<div className="pt-3 border-t border-heritage-sand/60 flex space-x-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 text-xs font-bold text-heritage-brown bg-heritage-sand/40 hover:bg-heritage-sand/70 rounded-xl transition">
                {t('login')}
              </Link>
              <Link to="/select-role" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 text-xs font-bold text-white bg-heritage-terracotta hover:bg-heritage-terracotta-dark rounded-xl transition">
                {t('signUp')}
              </Link>
            </div>)}
        </div>)}
    </header>);
};
