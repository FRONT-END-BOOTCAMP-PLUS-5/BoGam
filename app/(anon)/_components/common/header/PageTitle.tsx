'use client';

import { stepSummaries } from '@/(anon)/steps/_components/stepSummaries';
import { styles } from './PageTitle.styles';

interface PageTitleProps {
  pathname: string;
}

export default function PageTitle({ pathname }: PageTitleProps) {
  // 현재 경로에 따른 제목 정보 반환 함수
  const getPageTitleInfo = (path: string): { title: string; subtitle?: string } => {
    // 메인 페이지
    if (path === '/main') return { title: '전세보감' };
    
    // /steps 경로 (전체 가이드)
    if (path === '/steps') return { title: '전세 가이드' };
    
    // /steps/[step-number] 경로 (특정 단계)
    if (path.startsWith('/steps/')) {
      const stepMatch = path.match(/\/steps\/(\d+)/);
      if (stepMatch) {
        const stepNumber = parseInt(stepMatch[1]);
        const stepInfo = stepSummaries.find(step => step.id === stepNumber);
        if (stepInfo) {
          return { 
            title: stepInfo.title, 
            subtitle: stepInfo.subtitle 
          };
        }
        return { title: `${stepNumber}단계` };
      }
      return { title: '단계별 가이드' };
    }
    
    // 상세 페이지
    if (path.startsWith('/@detail/steps/')) {
      const stepMatch = path.match(/\/@detail\/steps\/(\d+)/);
      if (stepMatch) {
        const stepNumber = stepMatch[1];
        return { title: `${stepNumber}단계 상세` };
      }
      return { title: '상세 가이드' };
    }
    
    // 마이페이지
    if (path === '/mypage') return { title: '마이페이지' };
    
    // 온보딩
    if (path.startsWith('/onboarding')) return { title: '온보딩' };
    
    // 기본값
    return { title: '전세보감' };
  };

  const titleInfo = getPageTitleInfo(pathname);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {titleInfo.title}
      </div>
      {titleInfo.subtitle && (
        <div className={styles.subtitle}>
          {titleInfo.subtitle}
        </div>
      )}
    </div>
  );
}
