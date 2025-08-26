'use client';

import { styles } from './GeneralPage.styles';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface pageType {
  title: string;
  category: string;
  content: string | string[];
  pageIdx: number;
  stepNumber: string;
  currentPage: number;
}

// \n을 <br> 태그로 변환하는 함수
const formatContent = (content: string | string[]): string => {
  if (Array.isArray(content)) {
    return content.join('\n').replace(/\n/g, '<br>');
  }
  return content.replace(/\n/g, '<br>');
};

export default function GeneralPage({
  title,
  category,
  content,
  pageIdx,
  stepNumber,
  currentPage,
}: pageType) {
  const router = useRouter();
  const [, setStepNum] = useState<string>('');

  const handleClick = async () => {
    setStepNum(stepNumber);

    const newUrl = `/steps/${stepNumber}/${pageIdx}`;

    // 현재 보고 있는 페이지 정보를 sessionStorage에 저장 (뒤로가기 시 복원용)
    sessionStorage.setItem('saved-page', currentPage.toString());
    sessionStorage.setItem('programmatic-navigation', 'true');
    sessionStorage.setItem('navigation-timestamp', Date.now().toString());
    window.dispatchEvent(new PopStateEvent('popstate'));

    router.push(newUrl);
  };

  return (
    <div className={styles.contents}>
      {/* 상단 */}
      <div className={styles.topSection}>
        <h3 className={styles.smallFont}> {title} </h3>
      </div>
      
      {/* 중간 */}
      <div className={styles.middleSection}>
        <h5 className={styles.danger}> {category} </h5>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
      </div>
      
      {/* 하단 */}
      <div className={styles.bottomSection}>
        <button className={styles.goInside} onClick={handleClick}>
          {' '}
          바로가기{' '}
        </button>
      </div>
    </div>
  );
}