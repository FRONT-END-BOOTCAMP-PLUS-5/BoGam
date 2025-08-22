'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/(anon)/_components/common/button/Button';
import { styles } from '@/(anon)/main/_components/floatingButton/FloatingButton.styles';
import { ClipboardCheck } from 'lucide-react';

export default function FloatingButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/steps');
  };

  return (
    <div className={styles.container}>
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
