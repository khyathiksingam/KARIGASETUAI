import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Copy, Check, X, Zap, ShieldCheck } from 'lucide-react';
import { otpService } from '../../services/otpService';
export const OtpNotificationBanner = () => {
    const [activeNotification, setActiveNotification] = useState(null);
    const [copied, setCopied] = useState(false);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const unsubscribe = otpService.subscribe((event) => {
            setActiveNotification(event);
            setVisible(true);
            setCopied(false);
            // Auto dismiss after 15s
            const timer = setTimeout(() => {
                setVisible(false);
            }, 15000);
            return () => clearTimeout(timer);
        });
        return () => unsubscribe();
    }, []);
    if (!visible || !activeNotification)
        return null;
    const handleCopy = () => {
        if (activeNotification) {
            navigator.clipboard.writeText(activeNotification.otp);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    const handleAutoFill = () => {
        if (activeNotification) {
            window.dispatchEvent(new CustomEvent('karigarsetu-autofill-otp', {
                detail: { otp: activeNotification.otp },
            }));
            handleCopy();
        }
    };
    const isMobile = activeNotification.type === 'mobile';
    return (<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[92%] sm:w-[480px] max-w-full animate-bounce-short">
      <div className="bg-gradient-to-r from-heritage-brown via-[#2a170e] to-heritage-charcoal text-white rounded-2xl p-4 shadow-3d-lg border-2 border-heritage-gold/60 backdrop-blur-md">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
          <div className="flex items-center space-x-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isMobile ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}>
              {isMobile ? <MessageSquare className="w-4 h-4"/> : <Mail className="w-4 h-4"/>}
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-heritage-gold">
                {isMobile ? 'SMS / WhatsApp Notification' : 'Email Inbox Notification'}
              </p>
              <p className="text-[10px] text-white/60">
                via {activeNotification.provider} &bull; Just now
              </p>
            </div>
          </div>
          <button type="button" onClick={() => setVisible(false)} className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition">
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* Message Content */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-white/90 font-medium">
                Sent to <span className="font-bold text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">{activeNotification.target}</span>:
              </p>
              <p className="text-xs text-heritage-sand/90 mt-1 leading-relaxed">
                Your KARIGARSETU.AI security passcode is:
              </p>
            </div>
            <div className="bg-white/10 border border-heritage-gold/50 rounded-xl px-3 py-1.5 text-center shrink-0">
              <span className="font-mono font-black text-xl tracking-widest text-heritage-gold-light">
                {activeNotification.otp}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 pt-1">
            <button type="button" onClick={handleAutoFill} className="flex-1 py-1.5 px-3 rounded-lg bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition">
              <Zap className="w-3.5 h-3.5"/>
              <span>Auto-Fill OTP</span>
            </button>

            <button type="button" onClick={handleCopy} className="py-1.5 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center space-x-1 transition">
              {copied ? (<>
                  <Check className="w-3.5 h-3.5 text-emerald-400"/>
                  <span className="text-emerald-400">Copied</span>
                </>) : (<>
                  <Copy className="w-3.5 h-3.5"/>
                  <span>Copy</span>
                </>)}
            </button>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
          <span className="flex items-center space-x-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>OTP Delivered • Valid for 10 min</span>
          </span>
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-heritage-gold"/>
            <span>Gov CDAC / Fast2SMS Verified</span>
          </span>
        </div>
      </div>
    </div>);
};
