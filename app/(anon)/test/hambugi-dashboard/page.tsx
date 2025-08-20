'use client';

import React, { useState } from 'react';
import HambugiDashboard from '@/(anon)/_components/dashboard/HambugiDashboard';
import { styles } from './page.styles';

export default function HambugiDashboardTestPage() {
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          햄부기 대시보드 테스트
        </h1>
        
        <div className={styles.card}>
          <p className={styles.description}>
            아래 버튼을 클릭하여 햄부기 대시보드를 열어보세요.
          </p>
          
          <button
            onClick={() => setIsDashboardOpen(true)}
            className={styles.openButton}
          >
            대시보드 열기
          </button>
        </div>

        {/* 햄부기 대시보드 슬라이드 패널 */}
        <div className={`${styles.slidePanel} ${
          isDashboardOpen ? styles.slideIn : styles.slideOut
        }`}>
          <HambugiDashboard onClose={() => setIsDashboardOpen(false)} />
        </div>
      </div>
    </div>
  );
}
