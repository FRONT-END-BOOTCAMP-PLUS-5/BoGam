'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { styles } from './not-found.styles';
import Button from '@/(anon)/_components/common/button/Button';

export default function NotFound() {
  const router = useRouter();

  // 페이지 타이틀 설정
  useEffect(() => {
    document.title = '페이지를 찾을 수 없습니다 | Bogam';
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>
          <span className="relative z-10">404</span>
          <div className={clsx(styles.errorCodeBottom)}></div>
        </div>
        <h1 className={styles.title}>페이지를 찾을 수 없습니다</h1>
        <p className={styles.description}>
          요청하신 URL을 서버에서 찾을 수 없습니다.
        </p>
        <div className={styles.buttonGroup}>
          <Button 
            onClick={handleGoBack}
            variant="primary"
          >
            이전 페이지로
          </Button>
        </div>
      </div>
    </div>
  );
}
