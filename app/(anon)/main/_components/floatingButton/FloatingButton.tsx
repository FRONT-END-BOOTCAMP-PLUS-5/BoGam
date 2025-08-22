'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/(anon)/_components/common/button/Button';
import { styles } from '@/(anon)/main/_components/floatingButton/FloatingButton.styles';
import { ClipboardCheck } from 'lucide-react';

interface FloatingButtonProps {
  isDashboardOpen?: boolean;
}

export default function FloatingButton({ isDashboardOpen = false }: FloatingButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push('/steps');
  };

  return (
    <div 
      className={styles.container}
      style={{ 
        zIndex: isDashboardOpen ? 10 : 50 
      }}
    >
      <Button
        onClick={handleClick}
        variant='primary'
        className={styles.button}
        fullWidth={true}
      >
        <ClipboardCheck className={styles.icon} />
        <span className={styles.text}>전세 가이드 시작하기!</span>
      </Button>
    </div>
  );
}
