'use client';

import React from 'react';
import { X } from 'lucide-react';
import { styles } from './DashboardHeader.styles';

interface DashboardHeaderProps {
  onClose: () => void;
}

export default function DashboardHeader({ onClose }: DashboardHeaderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.rightSection}>
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="닫기"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
