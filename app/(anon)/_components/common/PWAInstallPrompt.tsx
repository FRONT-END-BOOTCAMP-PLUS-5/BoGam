'use client';

import { useState, useEffect } from 'react';

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
    <div
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        backdropFilter: 'blur(8px)',
        background: 'rgba(255,255,255,0.85)',
        border: '1px solid #e5e7eb',
        borderRadius: '1.25rem',
        padding: '1.5rem',
        position: 'fixed',
        left: '50%',
        bottom: '2rem',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        minWidth: '320px',
        maxWidth: '95vw',
        animation: 'fadeInPWA 0.4s cubic-bezier(0.4,0,0.2,1)'
      }}
    >
      <style>{`
        @keyframes fadeInPWA {
          from { opacity: 0; transform: translateY(30px) translateX(-50%); }
          to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563eb', marginBottom: 2 }}>전세보감 앱 설치</h3>
          <p style={{ fontSize: '0.85rem', color: '#374151', marginTop: 4 }}>홈 화면에 추가하여 더 빠르게 접근하세요</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
          <button
            onClick={handleDismiss}
            style={{
              fontSize: '0.85rem',
              color: '#6b7280',
              background: 'none',
              border: 'none',
              padding: '0.4rem 0.8rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.color = '#111827')}
            onMouseOut={e => (e.currentTarget.style.color = '#6b7280')}
          >
            나중에
          </button>
          <button
            onClick={handleInstallClick}
            style={{
              fontSize: '0.85rem',
              color: '#fff',
              background: 'linear-gradient(90deg, #2563eb 60%, #60a5fa 100%)',
              border: 'none',
              padding: '0.4rem 1.2rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #1d4ed8 60%, #2563eb 100%)')}
            onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb 60%, #60a5fa 100%)')}
          >
            설치
          </button>
        </div>
      </div>
    </div>
  );
} 