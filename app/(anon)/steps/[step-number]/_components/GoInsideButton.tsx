'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { styles } from './GeneralPage.styles';

interface GoInsideButtonProps {
  stepNumber: string;
  pageIdx: number;
}

export default function GoInsideButton({ 
  stepNumber, 
  pageIdx, 
}: GoInsideButtonProps) {
  const router = useRouter();
  const [, setStepNum] = useState<string>('');

  const handleClick = async () => {
    setStepNum(stepNumber);

    const newUrl = `/steps/${stepNumber}/${pageIdx}`;

    // 현재 보고 있는 페이지 정보를 sessionStorage에 저장 (뒤로가기 시 복원용)
    sessionStorage.setItem('saved-page', pageIdx.toString());
    sessionStorage.setItem('programmatic-navigation', 'true');
    sessionStorage.setItem('navigation-timestamp', Date.now().toString());
    window.dispatchEvent(new PopStateEvent('popstate'));

    router.push(newUrl);
  };

  return (
    <button className={styles.goInside} onClick={handleClick}>
      바로가기
    </button>
  );
}
