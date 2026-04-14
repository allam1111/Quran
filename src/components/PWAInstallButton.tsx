"use client";

import React, { useEffect, useState } from "react";
import { Download, Smartphone, Info } from "lucide-react";

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showHelper, setShowHelper] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowHelper(false);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone) {
      setIsInstalled(true);
    }

    // If after 3 seconds prompt hasn't arrived and not on iOS/Installed, show manual helper
    const timer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled && !isIOS) {
        setShowHelper(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, [deferredPrompt, isInstalled, isIOS]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) {
    return (
      <div className="w-full flex items-center gap-4 bg-green-500/10 border border-green-500/20 p-5 rounded-2xl animate-in fade-in duration-500">
        <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500 shadow-lg shadow-green-500/10">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="flex-1 text-right">
          <p className="text-sm font-bold text-green-500 font-arabic">التطبيق مثبت ✓</p>
          <p className="text-[10px] text-white/40 font-arabic">استمتع بتجربة كاملة من الشاشة الرئيسية</p>
        </div>
      </div>
    );
  }

  if (isIOS) {
    return (
      <div className="w-full flex items-center gap-4 bg-primary/5 border border-primary/20 p-5 rounded-2xl animate-in slide-in-from-bottom-2 duration-700">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="flex-1 text-right">
          <p className="text-sm font-bold text-white font-arabic">للثبيت على الأيفون:</p>
          <p className="text-[10px] text-white/60 font-arabic leading-relaxed">
            اضغط على زر <span className="text-primary font-bold">المشاركة</span> ثم اختر <span className="text-primary font-bold">"إضافة إلى الشاشة الرئيسية"</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleInstall}
        className={`w-full flex items-center gap-4 bg-gradient-to-r from-primary/15 to-primary/5 hover:from-primary/25 hover:to-primary/15 border border-primary/30 p-5 rounded-2xl transition-all group active:scale-[0.98] ${!deferredPrompt ? 'opacity-50 grayscale cursor-not-allowed hidden' : ''}`}
        disabled={!deferredPrompt}
      >
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-xl shadow-primary/20">
          <Download className="w-5 h-5" />
        </div>
        <div className="flex-1 text-right">
          <p className="text-sm font-bold text-white font-arabic">تنزيل التطبيق</p>
          <p className="text-[10px] text-white/50 font-arabic">تثبيت سريع واستخدام بدون إنترنت</p>
        </div>
      </button>

      {showHelper && !deferredPrompt && (
        <div className="w-full flex items-start gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="flex-1 text-right">
            <p className="text-xs font-bold text-white/80 font-arabic">كيفية التثبيت:</p>
            <p className="text-[10px] text-white/40 font-arabic mt-1 leading-relaxed">
              افتح قائمة المتصفح (⋮) ثم اضغط على "Install App" أو "إضافة إلى الشاشة الرئيسية".
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
