"use client";

import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone) {
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

  if (isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <button
      onClick={handleInstall}
      className="w-full flex items-center gap-4 bg-primary text-black p-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20 font-bold"
    >
      <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center">
        <Download className="w-5 h-5" />
      </div>
      <div className="flex-1 text-right">
        <p className="text-sm font-arabic">تنزيل التطبيق الآن</p>
      </div>
    </button>
  );
}
