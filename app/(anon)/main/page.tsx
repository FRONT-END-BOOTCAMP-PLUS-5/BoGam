'use client';

import React, { useState, useEffect } from 'react';
import MainPageModule from '@/(anon)/main/_components/mainPageModule/MainPageModule';
import { useMainPageModule } from '@/(anon)/main/_components/hooks/useMainPageModule';
import { styles } from './main.styles';

export default function MainPage() {
  const mainPageState = useMainPageModule();
  const [isMobile, setIsMobile] = useState(false);

  // 반응형 디자인 감지
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <div className={isMobile ? styles.containerMobile : styles.container}>
      {/* MainPage UI 모듈 */}
      <MainPageModule state={mainPageState} />
    </div>
  );
}
