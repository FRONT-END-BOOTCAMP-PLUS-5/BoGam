'use client';

import { useState, useEffect } from 'react';
import { styles } from './PWAInstallPrompt.styles';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA 설치됨');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className={styles.container}>
      <style>{styles.animation}</style>
      <div className={styles.content}>
        <div className={styles.textSection}>
          <h3 className={styles.title}>전세보감 앱 설치</h3>
          <p className={styles.description}>홈 화면에 추가하여 더 빠르게 접근하세요</p>
        </div>
        <div className={styles.buttonSection}>
          <button
            onClick={handleDismiss}
            className={styles.dismissButton}
          >
            나중에
          </button>
          <button
            onClick={handleInstallClick}
            className={styles.installButton}
          >
            설치
          </button>
        </div>
      </div>
    </div>
  );
} 