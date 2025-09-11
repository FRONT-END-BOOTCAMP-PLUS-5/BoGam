'use client';

import StepDetailPage from './steps/[step-number]/[detail]/StepDetail';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

export default function DetailSlot() {
  const router = useRouter();
  const pathname = usePathname();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // URL 패턴 확인: /steps/[step-number]/[detail]
    const stepPattern = /^\/steps\/(\d+)\/(\d+)$/;
    const match = pathname.match(stepPattern);
    const isStepDetailUrl = !!match;

    if (isStepDetailUrl && match) {
      const stepNumber = parseInt(match[1]);
      
      // step-number 유효성 검사 (1-7만 허용)
      if (stepNumber < 1 || stepNumber > 7) {
        notFound();
        return;
      }

      // 세션스토리지에서 프로그래밍 라우팅 플래그와 타임스탬프 확인
      const isProgrammaticNavigation = sessionStorage.getItem(
        'programmatic-navigation'
      );
      const navigationTimestamp = sessionStorage.getItem(
        'navigation-timestamp'
      );
      const currentTime = Date.now();

      // 타임스탬프가 5초 이내이고 플래그가 있으면 프로그래밍 라우팅으로 간주
      const isRecentNavigation =
        navigationTimestamp &&
        currentTime - parseInt(navigationTimestamp) < 5000;

      if (isProgrammaticNavigation === 'true' && isRecentNavigation) {
        setShouldShow(true);
        // 플래그 제거
        sessionStorage.removeItem('programmatic-navigation');
        sessionStorage.removeItem('navigation-timestamp');
      } else {

        // 프로그래밍 라우팅이 아닌 경우 404 처리
        notFound();
        return;
      }
    } else {
      // steps/로 시작하지만 패턴이 맞지 않는 경우 404
      // 단, steps/숫자 (메인 steps 페이지)는 제외
      const mainStepsPattern = /^\/steps\/(\d+)$/;
      const isMainStepsPage = mainStepsPattern.test(pathname);
      
      if (pathname.startsWith('/steps/') && !isMainStepsPage) {
        notFound();
        return;
      }
      setShouldShow(false);
    }
  }, [pathname]);

  if (!shouldShow) {
    return null;
  }

  return (
    <StepDetailPage
      isOpen={shouldShow}
      onClose={() => {
        setShouldShow(false);
        router.back();
      }}
    />
  );
}
