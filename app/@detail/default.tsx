'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import StepDetail from '../(anon)/@detail/[step-number]/[detail]/StepDetail';

export default function DetailSlot() {
  const router = useRouter();
  const pathname = usePathname();
  const [shouldShow, setShouldShow] = useState(false);
  const [stepNumber, setStepNumber] = useState<string>('');
  const [detail, setDetail] = useState<string>('');

  useEffect(() => {
    console.log('DetailSlot useEffect - pathname:', pathname);

    // URL 패턴 확인: /steps/[number]/[number]
    const stepPattern = /^\/steps\/(\d+)\/(\d+)$/;
    const match = pathname.match(stepPattern);
    const isStepDetailUrl = !!match;

    console.log('Is step detail URL:', isStepDetailUrl);

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

      console.log('DetailSlot mounted, flag:', isProgrammaticNavigation);
      console.log('Navigation timestamp:', navigationTimestamp);
      console.log('Current time:', currentTime);

      // 타임스탬프가 5초 이내이고 플래그가 있으면 프로그래밍 라우팅으로 간주
      const isRecentNavigation =
        navigationTimestamp &&
        currentTime - parseInt(navigationTimestamp) < 5000;

      console.log('Is recent navigation:', isRecentNavigation);

      if (isProgrammaticNavigation === 'true' && isRecentNavigation) {
        console.log(
          'Setting shouldShow to true - Recent programmatic navigation detected'
        );
        setShouldShow(true);
        // 플래그 제거
        sessionStorage.removeItem('programmatic-navigation');
        sessionStorage.removeItem('navigation-timestamp');
      } else {
        console.log(
          'Setting shouldShow to false - Direct navigation or expired flag'
        );
        setShouldShow(false);
        // 플래그가 남아있다면 제거
        sessionStorage.removeItem('programmatic-navigation');
        sessionStorage.removeItem('navigation-timestamp');
      }
    } else {
      console.log('Not a step detail URL, hiding slot');
      setShouldShow(false);
    }
  }, [pathname]);

  console.log(
    'DetailSlot render - shouldShow:',
    shouldShow,
    'pathname:',
    pathname,
    'stepNumber:',
    stepNumber,
    'detail:',
    detail
  );

  if (!shouldShow || !stepNumber || !detail) {
    return null;
  }

  return (
    <StepDetail
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
