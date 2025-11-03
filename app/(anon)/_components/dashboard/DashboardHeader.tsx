'use client';

import React from 'react';
import { X, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { styles } from './DashboardHeader.styles';

interface DashboardHeaderProps {
  onClose: () => void;
}

export default function DashboardHeader({ onClose }: DashboardHeaderProps) {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/main');
    onClose();
  };

  return (
    <div className={styles.container}>
      <div className={styles.rightSection}>
        <button
          onClick={handleHomeClick}
          className={styles.homeButton}
          aria-label='메인으로 이동'
        >
          <Home size={24} />
        </button>
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label='닫기'
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
