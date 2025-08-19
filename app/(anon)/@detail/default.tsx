'use client';

import StepDetailPage from './steps/[step-number]/[detail]/StepDetail';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DetailSlot() {
  const router = useRouter();
  const pathname = usePathname();
  const [shouldShow, setShouldShow] = useState(false);
  const [stepNumber, setStepNumber] = useState<string>('');
  const [detail, setDetail] = useState<string>('');

  useEffect(() => {
    // URL 패턴 확인: /steps/[step-number]/[detail]
    const stepPattern = /^\/steps\/(\d+)\/(\d+)$/;
    const match = pathname.match(stepPattern);
    const isStepDetailUrl = !!match;

    if (isStepDetailUrl && match) {
      const [, step, detailParam] = match;
      setStepNumber(step);
      setDetail(detailParam);

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
        setShouldShow(false);
        // 플래그가 남아있다면 제거
        sessionStorage.removeItem('programmatic-navigation');
        sessionStorage.removeItem('navigation-timestamp');
      }
    } else {
      setShouldShow(false);
    }
  }, [pathname]);

  if (!shouldShow || !stepNumber || !detail) {
    return null;
  }

  return (
    <StepDetailPage
      stepNumber={stepNumber}
      detail={detail}
      isOpen={shouldShow}
      onClose={() => {
        setShouldShow(false);
        router.back();
      }}
    />
  );
}
