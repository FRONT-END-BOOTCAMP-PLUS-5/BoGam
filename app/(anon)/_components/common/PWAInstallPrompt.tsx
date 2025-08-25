'use client';

import { useState, useEffect } from 'react';
import { styles } from './PWAInstallPrompt.styles';
import { useSession } from 'next-auth/react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // PWA가 이미 설치되어 있는지 확인
    const checkIfInstalled = () => {
      // display-mode: standalone은 PWA가 독립 앱으로 실행될 때
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      // navigator.standalone은 iOS Safari에서 PWA 설치 여부 확인
      if ('standalone' in navigator && (navigator as NavigatorWithStandalone).standalone) {
        setIsInstalled(true);
        return;
      }
      
      // localStorage에 설치 상태 저장/확인
      const installStatus = localStorage.getItem('pwa-installed');
      if (installStatus === 'true') {
        setIsInstalled(true);
        return;
      }
      
      // 로그인된 사용자의 경우, 해당 사용자별로 닫기 버튼 클릭 상태 확인
      if (session?.user?.email) {
        const userKey = `pwa-dismissed-${session.user.email}`;
        const dismissedStatus = sessionStorage.getItem(userKey);
        if (dismissedStatus === 'true') {
          setIsInstalled(true);
          return;
        }
      }
    };

    checkIfInstalled();

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [session]); // session 변경 시 효과 다시 적용

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // beforeinstallprompt 이벤트가 없는 경우 수동 설치 안내
      alert('브라우저 주소창 옆의 설치 아이콘을 클릭하여 앱을 설치하세요.');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA 설치됨');
      // 설치 성공 시 localStorage에 상태 저장하고 프롬프트 숨김
      localStorage.setItem('pwa-installed', 'true');
      setIsInstalled(true);
    }
  };

  const handleDismiss = () => {
    // 닫기 버튼 클릭 시 해당 로그인 세션이 유지되는 동안은 다시 표시되지 않도록 함
    // 사용자별로 sessionStorage에 상태 저장
    if (session?.user?.email) {
      const userKey = `pwa-dismissed-${session.user.email}`;
      sessionStorage.setItem(userKey, 'true');
    }
    setIsInstalled(true); // 프롬프트를 숨김
  };

  // 이미 설치된 경우 프롬프트를 표시하지 않음
  if (isInstalled) return null;

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