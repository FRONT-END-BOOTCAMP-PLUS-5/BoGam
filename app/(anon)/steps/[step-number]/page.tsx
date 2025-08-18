'use client';

import { styles } from './page.styles';

interface StepNumberPageProps {
  params: Promise<{
    'step-number': string;
  }>;
}

export default function StepNumberPage({ params }: StepNumberPageProps) {
  const handleClick = async () => {
    const { 'step-number': step } = await params;

    // 프로그래밍 라우팅 플래그와 타임스탬프 설정
    sessionStorage.setItem('programmatic-navigation', 'true');
    sessionStorage.setItem('navigation-timestamp', Date.now().toString());

    // 페이지 이동 없이 URL만 변경 (슬롯만 표시)
    const newUrl = `/steps/${step}/4`;
    window.history.pushState({}, '', newUrl);

    // Next.js router의 pathname 업데이트를 위해 강제로 리렌더링 트리거
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>중단계 페이지</h1>
        <button className={styles.clickButton} onClick={handleClick}>
          클릭하여 상세 보기
        </button>
      </div>
    </div>
  );
}
