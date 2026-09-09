import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Scan, TrendingUp, UserCheck, ShoppingBag, Award, Compass, ArrowRight, ChevronRight, MapPin, Star, PlusCircle } from 'lucide-react';
import { FloatingCraftHero3D } from '../components/3d/FloatingCraftHero3D';
import { ProductCard3D } from '../components/3d/ProductCard3D';
import { useApp } from '../context/AppContext';
import { DEMO_SELLERS } from '../data/seedData';
import { Avatar } from '../components/common/Avatar';
export const LandingPage = () => {
    const { products, loginAsSeller, loginAsBuyer } = useApp();
    const featuredProducts = products.slice(0, 4);
    return (<div className="min-h-screen bg-heritage-ivory bg-heritage-pattern">
      {/* 3D HERO SECTION */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
        {/* Subtle decorative background gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-heritage-gold/15 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute top-20 left-10 w-80 h-80 bg-heritage-terracotta/10 rounded-full blur-3xl pointer-events-none"/>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2.5 bg-heritage-sand/80 border border-heritage-gold/40 px-3.5 py-1.5 rounded-full shadow-sm">
                <img src="/assets/karigarsetu-ai-logo.png" alt="KARIGARSETU.AI Official Logo" className="w-6 h-6 rounded-full object-contain shrink-0"/>
                <span className="text-xs font-bold text-heritage-brown uppercase tracking-wider">
                  KARIGARSETU.AI &bull; Smart India Hackathon 2026
                </span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-heritage-brown leading-tight tracking-tight">
                From Artisan to Market <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-terracotta via-amber-600 to-heritage-gold">
                  Powered by AI
                </span>
              </h1>

              <p className="text-base sm:text-lg text-heritage-charcoal/80 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Empowering Indian artisans to showcase, understand, price and sell their creations while helping buyers discover authentic handmade heritage.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/marketplace" className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-heritage-terracotta to-heritage-terracotta-dark text-white font-bold text-sm shadow-3d hover:shadow-3d-lg hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2">
                  <ShoppingBag className="w-4 h-4"/>
                  <span>Explore Marketplace</span>
                </Link>

                <Link to="/seller/ai-analyzer" className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-heritage-brown text-heritage-gold-light border border-heritage-gold/50 font-bold text-sm shadow-3d hover:shadow-3d-lg hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 group">
                  <Scan className="w-4 h-4 text-heritage-gold group-hover:rotate-12 transition-transform"/>
                  <span>Sell with AI</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-heritage-terracotta/15 max-w-md mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl font-black font-serif text-heritage-brown">3,400+</p>
                  <p className="text-xs text-heritage-charcoal/60 font-semibold">Active Karigars</p>
                </div>
                <div>
                  <p className="text-2xl font-black font-serif text-heritage-terracotta">94%</p>
                  <p className="text-xs text-heritage-charcoal/60 font-semibold">AI Appraisal Match</p>
                </div>
                <div>
                  <p className="text-2xl font-black font-serif text-heritage-brown">100%</p>
                  <p className="text-xs text-heritage-charcoal/60 font-semibold">Direct Earnings</p>
                </div>
              </div>
            </div>

            {/* Right 3D Interactive Hero Experience */}
            <div className="lg:col-span-6">
              <FloatingCraftHero3D />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: KEY FEATURES (6 Cards with 3D effects) */}
      <section className="py-20 bg-heritage-sand/30 border-y border-heritage-terracotta/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-heritage-terracotta">
              Platform Innovations
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-heritage-brown mt-2">
              Empowering India's Heritage with Intelligent Technology
            </h2>
            <p className="text-sm sm:text-base text-heritage-charcoal/70 mt-3 font-medium">
              Bridging centuries-old craft traditions with next-generation neural appraisal and direct commerce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: AI Product Analyzer */}
            <div className="card-3d bg-white p-7 rounded-3xl border border-heritage-terracotta/20 shadow-3d hover:border-heritage-terracotta">
              <div className="w-12 h-12 rounded-2xl bg-heritage-terracotta/10 text-heritage-terracotta flex items-center justify-center mb-5">
                <Scan className="w-6 h-6"/>
              </div>
              <h3 className="font-serif font-bold text-xl text-heritage-brown mb-2">
                AI Product Analyzer
              </h3>
              <p className="text-sm text-heritage-charcoal/70 leading-relaxed mb-4">
                Analyze a product image using AI. Automatically detect craft tradition, material, dimensional estimates, and structural quality score with single-tap scanning.
              </p>
              <Link to="/seller/ai-analyzer" className="text-xs font-bold text-heritage-terracotta flex items-center group">
                Try AI Analyzer <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform"/>
              </Link>
            </div>

            {/* Card 2: Smart Pricing */}
            <div className="card-3d bg-white p-7 rounded-3xl border border-heritage-gold/40 shadow-3d hover:border-heritage-gold">
              <div className="w-12 h-12 rounded-2xl bg-heritage-gold/20 text-heritage-brown flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6 text-heritage-brown"/>
              </div>
              <h3 className="font-serif font-bold text-xl text-heritage-brown mb-2">
                Smart Pricing
              </h3>
              <p className="text-sm text-heritage-charcoal/70 leading-relaxed mb-4">
                Estimate an appropriate market price based on raw material indices, crafting time, regional craft factors, and fair living wage standards for artisans.
              </p>
              <span className="text-xs font-semibold text-heritage-gold-dark">
                Fair Trade Algorithm Included
              </span>
            </div>

            {/* Card 3: Artisan Identity */}
            <div className="card-3d bg-white p-7 rounded-3xl border border-heritage-terracotta/20 shadow-3d hover:border-heritage-terracotta">
              <div className="w-12 h-12 rounded-2xl bg-heritage-green/10 text-heritage-green flex items-center justify-center mb-5">
                <UserCheck className="w-6 h-6 text-heritage-green"/>
              </div>
              <h3 className="font-serif font-bold text-xl text-heritage-brown mb-2">
                Artisan Identity
              </h3>
              <p className="text-sm text-heritage-charcoal/70 leading-relaxed mb-4">
                Every product clearly identifies its seller with verifiable profile, craft lineage, state of origin, and customer reputation. No anonymous middlemen.
              </p>
              <span className="text-xs font-semibold text-heritage-green-light">
                Verified Artisan & Heritage Profiles
              </span>
            </div>

            {/* Card 4: Direct Marketplace */}
            <div className="card-3d bg-white p-7 rounded-3xl border border-heritage-terracotta/20 shadow-3d hover:border-heritage-terracotta">
              <div className="w-12 h-12 rounded-2xl bg-heritage-terracotta/10 text-heritage-terracotta flex items-center justify-center mb-5">
                <ShoppingBag className="w-6 h-6"/>
              </div>
              <h3 className="font-serif font-bold text-xl text-heritage-brown mb-2">
                Direct Marketplace
              </h3>
              <p className="text-sm text-heritage-charcoal/70 leading-relaxed mb-4">
                Connect buyers directly with artisans with zero hidden commission deductions. Fast checkout, automated order management, and transparent tracking.
              </p>
              <Link to="/marketplace" className="text-xs font-bold text-heritage-terracotta flex items-center group">
                Browse Listings <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform"/>
              </Link>
            </div>

            {/* Card 5: Karigar Credits */}
            <div className="card-3d bg-white p-7 rounded-3xl border border-heritage-gold/40 shadow-3d hover:border-heritage-gold">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center mb-5">
                <Award className="w-6 h-6 text-heritage-gold-dark"/>
              </div>
              <h3 className="font-serif font-bold text-xl text-heritage-brown mb-2">
                Karigar Credits
              </h3>
              <p className="text-sm text-heritage-charcoal/70 leading-relaxed mb-4">
                Reward seller activity and reputation with gamified platform credits. Earn points on every published craft, completed order, and verified 5-star review.
              </p>
              <span className="text-xs font-semibold text-heritage-gold-dark">
                Progress from New Artisan to Master Karigar
              </span>
            </div>

            {/* Card 6: Heritage Discovery */}
            <div className="card-3d bg-white p-7 rounded-3xl border border-heritage-terracotta/20 shadow-3d hover:border-heritage-terracotta">
              <div className="w-12 h-12 rounded-2xl bg-heritage-brown/10 text-heritage-brown flex items-center justify-center mb-5">
                <Compass className="w-6 h-6"/>
              </div>
              <h3 className="font-serif font-bold text-xl text-heritage-brown mb-2">
                Heritage Discovery
              </h3>
              <p className="text-sm text-heritage-charcoal/70 leading-relaxed mb-4">
                Help buyers discover India's traditional crafts through rich cultural stories, regional craft clustering, and AI-recommended artisan workshops.
              </p>
              <Link to="/marketplace" className="text-xs font-bold text-heritage-brown flex items-center group">
                Explore Crafts of India <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform"/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: HOW IT WORKS (Seller Flow vs Buyer Flow) */}
      <section id="how-it-works" className="py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-heritage-terracotta">
              Seamless Ecosystem
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-heritage-brown mt-2">
              How KARIGARSETU.AI Works
            </h2>
            <p className="text-sm sm:text-base text-heritage-charcoal/70 mt-3 font-medium">
              A transparent, two-sided pipeline linking uncatalogued rural creations with discerning urban connoisseurs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* SELLER FLOW */}
            <div className="bg-gradient-to-br from-heritage-ivory to-heritage-sand/60 p-8 rounded-3xl border-2 border-heritage-terracotta/20 shadow-3d">
              <div className="flex items-center space-x-3 mb-6">
                <span className="px-3 py-1 bg-heritage-terracotta text-white rounded-full text-xs font-bold uppercase tracking-wider">
                  For Artisans / Sellers
                </span>
                <span className="text-xs text-heritage-brown font-semibold">
                  Zero Technical Barrier
                </span>
              </div>

              <div className="space-y-4">
                {[
            { step: '1', title: 'Upload Craft Photo', desc: 'Snap photo from mobile camera or drag & drop image' },
            { step: '2', title: 'AI Analyze & Appraise', desc: 'Neural vision scans form, material, dimensions, and suggests price' },
            { step: '3', title: 'Edit & Refine Details', desc: 'Artisan confirms specs and adjusts final listing price' },
            { step: '4', title: 'Publish to Marketplace', desc: 'Listing enters verified catalog under artisan profile (+50 Credits)' },
            { step: '5', title: 'Sell & Earn Direct Payment', desc: 'Buyer purchases craft, artisan receives order notification' },
            { step: '6', title: 'Earn Credits & Badges', desc: 'Accumulate Karigar Credits toward Master Karigar standing' },
        ].map((item, idx) => (<div key={idx} className="flex items-start space-x-3.5 bg-white/80 p-3.5 rounded-2xl border border-heritage-sand shadow-sm">
                    <div className="w-7 h-7 rounded-full bg-heritage-terracotta text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-heritage-brown">{item.title}</h4>
                      <p className="text-xs text-heritage-charcoal/70">{item.desc}</p>
                    </div>
                  </div>))}
              </div>

              <div className="mt-6 text-center">
                <Link to="/seller/ai-analyzer" className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition">
                  <Scan className="w-4 h-4"/>
                  <span>Start AI Product Analysis</span>
                </Link>
              </div>
            </div>

            {/* BUYER FLOW */}
            <div className="bg-gradient-to-br from-heritage-ivory to-heritage-sand/60 p-8 rounded-3xl border-2 border-heritage-gold/40 shadow-3d">
              <div className="flex items-center space-x-3 mb-6">
                <span className="px-3 py-1 bg-heritage-brown text-heritage-gold-light rounded-full text-xs font-bold uppercase tracking-wider">
                  For Buyers & Patrons
                </span>
                <span className="text-xs text-heritage-brown font-semibold">
                  100% Authentic Heritage
                </span>
              </div>

              <div className="space-y-4">
                {[
            { step: '1', title: 'Discover Traditional Crafts', desc: 'Filter by category, material, state, or search natural language' },
            { step: '2', title: 'Explore AI Verified Specs', desc: 'Inspect dimensional details, material breakdown, and quality score' },
            { step: '3', title: 'View Artisan Story', desc: 'Read artisan bio, specialization lineage, and community reviews' },
            { step: '4', title: 'Buy Directly or Inquire', desc: 'Direct cart checkout or send custom message to artisan' },
            { step: '5', title: 'Review & Support', desc: 'Rate product with 5 stars to reward artisan with Karigar Credits' },
        ].map((item, idx) => (<div key={idx} className="flex items-start space-x-3.5 bg-white/80 p-3.5 rounded-2xl border border-heritage-sand shadow-sm">
                    <div className="w-7 h-7 rounded-full bg-heritage-brown text-heritage-gold text-xs font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-heritage-brown">{item.title}</h4>
                      <p className="text-xs text-heritage-charcoal/70">{item.desc}</p>
                    </div>
                  </div>))}
              </div>

              <div className="mt-6 text-center">
                <Link to="/marketplace" className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-heritage-brown hover:bg-heritage-brown-dark text-heritage-gold-light font-bold text-xs shadow-md transition">
                  <ShoppingBag className="w-4 h-4 text-heritage-gold"/>
                  <span>Explore Handmade Marketplace</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED MARKETPLACE HIGHLIGHT */}
      <section className="py-16 bg-white border-t border-heritage-terracotta/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-heritage-terracotta">
                Direct From Master Karigars
              </span>
              <h2 className="font-display text-3xl font-black text-heritage-brown mt-1">
                Featured Handmade Treasures
              </h2>
            </div>
            <Link to="/marketplace" className="mt-3 sm:mt-0 text-sm font-bold text-heritage-terracotta hover:text-heritage-terracotta-dark flex items-center">
              <span>{products.length > 0 ? `View All (${products.length})` : 'Browse Marketplace'}</span>
              <ChevronRight className="w-4 h-4 ml-0.5"/>
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="bg-heritage-ivory/50 rounded-3xl p-10 text-center border-2 border-dashed border-heritage-terracotta/25 space-y-3">
              <Sparkles className="w-10 h-10 text-heritage-terracotta/70 mx-auto" />
              <h3 className="font-serif font-black text-lg text-heritage-brown">
                No artisan products listed yet. Be the first artisan to add a craft.
              </h3>
              <p className="text-xs text-heritage-charcoal/70 max-w-md mx-auto">
                Artisans can list their heritage creations with AI-powered multi-angle evaluation, fair pricing appraisal, and instant certification.
              </p>
              <div className="pt-2">
                <Link
                  to="/seller/ai-analyzer"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>List Your Craft</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((prod) => (<ProductCard3D key={prod.id} product={prod}/>))}
            </div>
          )}
        </div>
      </section>

      {/* ARTISAN SPOTLIGHT SECTION */}
      <section className="py-20 bg-heritage-sand/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-heritage-terracotta">
              Guardians of Indian Craft
            </span>
            <h2 className="font-display text-3xl font-black text-heritage-brown mt-1">
              Meet India's Master Artisans
            </h2>
            <p className="text-xs sm:text-sm text-heritage-charcoal/70 mt-2 font-medium">
              Every purchase on KARIGARSETU.AI directly sustains regional craft clusters and families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DEMO_SELLERS.slice(0, 3).map((seller) => (<div key={seller.id} className="card-3d bg-white rounded-3xl p-6 border border-heritage-terracotta/20 shadow-3d flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar src={seller.profile_image} name={seller.full_name} role="seller" size="lg" className="border-2 border-heritage-gold shadow-sm shrink-0"/>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-heritage-brown">
                        {seller.full_name}
                      </h4>
                      <p className="text-xs text-heritage-terracotta font-semibold">
                        @{seller.username}
                      </p>
                      <div className="flex items-center text-[11px] text-heritage-charcoal/60 mt-0.5">
                        <MapPin className="w-3 h-3 mr-0.5 text-heritage-terracotta"/>
                        <span>{seller.city}, {seller.state}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-heritage-charcoal/80 leading-relaxed line-clamp-3 mb-4 font-medium">
                    {seller.bio}
                  </p>

                  <div className="bg-heritage-sand/40 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-heritage-charcoal/60 block">Credits</span>
                      <span className="font-black font-serif text-heritage-brown">{seller.credits}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-heritage-charcoal/60 block">Rating</span>
                      <span className="font-black text-amber-600 flex items-center">
                        <Star className="w-3 h-3 fill-current mr-0.5"/>
                        {seller.rating}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-heritage-charcoal/60 block">Badge</span>
                      <span className="font-bold text-heritage-terracotta text-[11px]">{seller.badge}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-heritage-sand">
                  <Link to={`/artisan/${seller.username}`} className="w-full block text-center py-2 rounded-xl text-xs font-bold text-heritage-brown bg-heritage-sand/60 hover:bg-heritage-sand transition">
                    View Artisan Profile & Products
                  </Link>
                </div>
              </div>))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-r from-heritage-brown via-heritage-brown-dark to-heritage-brown text-heritage-sand border-t-4 border-heritage-gold relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          <span className="inline-block px-3 py-1 rounded-full bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/40 text-xs font-bold uppercase tracking-widest">
            SIH 2026 Innovation
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white">
            Ready to Bridge Indian Craft with the Future?
          </h2>
          <p className="text-sm sm:text-base text-heritage-sand/80 max-w-2xl mx-auto font-medium leading-relaxed">
            Experience the complete flow from camera scan to appraisal, direct marketplace listing, and instant order fulfillment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/seller/ai-analyzer" className="px-8 py-3.5 rounded-2xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-sm shadow-3d-lg transition-transform hover:scale-105">
              Analyze Your First Craft Now
            </Link>
            <Link to="/select-role" className="px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-heritage-gold-light border border-heritage-gold/40 font-bold text-sm transition">
              Create Platform Account
            </Link>
          </div>
        </div>
      </section>
    </div>);
};
