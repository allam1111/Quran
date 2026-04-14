"use client";

import React, { useEffect, useState } from "react";
import { Download, Smartphone, Wifi, WifiOff } from "lucide-react";

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

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
      <div className="w-full flex items-center gap-4 bg-green-500/5 border border-green-500/20 p-5 rounded-2xl">
        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-green-500" />
        </div>
        <div className="flex-1 text-right">
          <p className="text-xs font-bold text-green-500 font-arabic">التطبيق مثبت ✓</p>
          <p className="text-[9px] text-white/30 font-arabic">يمكنك فتحه من الشاشة الرئيسية</p>
        </div>
      </div>
    );
  }

  if (isIOS) {
    return (
      <div className="w-full flex items-center gap-4 bg-primary/5 border border-primary/20 p-5 rounded-2xl">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="flex-1 text-right">
          <p className="text-sm font-bold text-white font-arabic">على الأيفون:</p>
          <p className="text-[10px] text-white/60 font-arabic">اضغط على زر المشاركة ثم "Add to Home Screen"</p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleInstall}
      className={`w-full flex items-center gap-4 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20 p-5 rounded-2xl transition-all group active:scale-95 ${!deferredPrompt ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
      disabled={!deferredPrompt}
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all shadow-lg">
        <Download className="w-5 h-5" />
      </div>
      <div className="flex-1 text-right">
        <p className="text-sm font-bold text-white font-arabic">تنزيل التطبيق</p>
        <p className="text-[10px] text-white/40 font-arabic">تثبيت للاستخدام بدون إنترنت</p>
      </div>
    </button>
  );
}
