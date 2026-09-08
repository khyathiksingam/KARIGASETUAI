import React, { useState } from 'react';
import { RotateCcw, ShieldCheck, Database, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { isSupabaseConfigured } from '../services/supabase';
export const SettingsPage = () => {
    const { resetDemoData, loginAsSeller, loginAsBuyer, currentUser, currentRole } = useApp();
    const [resetSuccess, setResetSuccess] = useState(false);
    const handleReset = () => {
        if (window.confirm('Reset all demo state (catalog, orders, credits, messages, and accounts) to original seed data?')) {
            resetDemoData();
            confetti({ particleCount: 70, spread: 60 });
            setResetSuccess(true);
            setTimeout(() => setResetSuccess(false), 2500);
        }
    };
    const hasGeminiKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.AI_API_KEY);
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-heritage-terracotta mb-1">
            <ShieldCheck className="w-3.5 h-3.5"/>
            <span>SIH 2026 Developer & Demo Control</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-heritage-brown">
            Demo Environment & Architecture Settings
          </h1>
          <p className="text-xs text-heritage-charcoal/70 mt-0.5">
            Configure system states, test accounts, and trigger clean state resets for judging sessions.
          </p>
        </div>

        {resetSuccess && (<div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700"/>
            <span>All demo data has been restored to factory seed state!</span>
          </div>)}

        {/* SECTION 55: DEMO RESET CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-heritage-terracotta/30 shadow-3d space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif font-black text-xl text-heritage-brown">
                Reset Demo Data (Factory Reset)
              </h2>
              <p className="text-xs text-heritage-charcoal/70 mt-1 max-w-lg">
                Cleans `localStorage` and restores 6 master artisans, 20+ realistic products, clean order pipelines, and default KARIGARSETU.AI Credit balances.
              </p>
            </div>
            <button type="button" onClick={handleReset} className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-2">
              <RotateCcw className="w-4 h-4"/>
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>

        {/* SECTION 42: DEMO ACCOUNTS HELPER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-sand shadow-3d space-y-4">
          <h3 className="font-serif font-bold text-lg text-heritage-brown">
            Demo Credentials & Test Personas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Seller Account */}
            <div className="p-4 rounded-2xl bg-heritage-ivory/60 border border-heritage-sand space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-heritage-brown">Artisan Persona</span>
                <span className="bg-heritage-terracotta text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                  SELLER
                </span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-heritage-charcoal/80">
                <p>Username: <strong>seller_demo</strong></p>
                <p>Password: <strong>Seller@123</strong></p>
                <p>Persona: <strong>Ravi Kumar (Wood Sculptor)</strong></p>
              </div>
              <button type="button" onClick={loginAsSeller} className="w-full py-2 bg-heritage-terracotta/15 hover:bg-heritage-terracotta hover:text-white text-heritage-terracotta font-bold rounded-xl transition text-[11px]">
                Log In As Ravi Kumar
              </button>
            </div>

            {/* Buyer Account */}
            <div className="p-4 rounded-2xl bg-heritage-ivory/60 border border-heritage-sand space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-heritage-brown">Patron Persona</span>
                <span className="bg-heritage-brown text-heritage-gold-light px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                  BUYER
                </span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-heritage-charcoal/80">
                <p>Username: <strong>buyer_demo</strong></p>
                <p>Password: <strong>Buyer@123</strong></p>
                <p>Persona: <strong>Ananya Sharma (Craft Collector)</strong></p>
              </div>
              <button type="button" onClick={loginAsBuyer} className="w-full py-2 bg-heritage-brown/15 hover:bg-heritage-brown hover:text-white text-heritage-brown font-bold rounded-xl transition text-[11px]">
                Log In As Ananya Sharma
              </button>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            <strong>Demo OTP:</strong> For mobile phone login simulation, use OTP: <strong>123456</strong>.
          </div>
        </div>

        {/* SECTION 41 & 56: BACKEND & API STATUS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-sand shadow-3d space-y-4">
          <h3 className="font-serif font-bold text-lg text-heritage-brown">
            Cloud & AI Service Health
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-heritage-ivory/50 border border-heritage-sand">
              <div className="flex items-center space-x-3">
                <Database className="w-4 h-4 text-heritage-brown"/>
                <div>
                  <p className="font-bold text-heritage-brown">Supabase Cloud Database</p>
                  <p className="text-[10px] text-heritage-charcoal/60">PostgreSQL + Storage + RLS Engine</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${isSupabaseConfigured
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-heritage-gold/20 text-heritage-brown'}`}>
                {isSupabaseConfigured ? 'Connected (Live)' : 'Local Fallback Active (Zero-Failure)'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-heritage-ivory/50 border border-heritage-sand">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-4 h-4 text-heritage-terracotta"/>
                <div>
                  <p className="font-bold text-heritage-brown">Google Gemini Vision API</p>
                  <p className="text-[10px] text-heritage-charcoal/60">Neural handicraft appraisal & pricing</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${hasGeminiKey
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-heritage-gold/20 text-heritage-brown'}`}>
                {hasGeminiKey ? 'Gemini 1.5 Flash Connected' : 'Local Heuristic Fallback Active'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
