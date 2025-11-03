'use client';

import StepDetailPage from './steps/[step-number]/[detail]/StepDetail';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import {
  isStepDetailUrl,
  isMainStepsPage,
  isProgrammaticNavigation,
  clearProgrammaticNavigationFlag,
  closeMultiSlot,
} from '@utils/multiSlotNavigation';

export default function DetailSlot() {
  const router = useRouter();
  const pathname = usePathname();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (isStepDetailUrl(pathname)) {
      // step-number 유효성 검사는 steps/[step-number]/page.tsx에서 이미 처리됨

      if (isProgrammaticNavigation()) {
        setShouldShow(true);
        clearProgrammaticNavigationFlag();
      } else {
        // 프로그래밍 라우팅이 아닌 경우 404 처리
        notFound();
        return;
      }
    } else {
      // steps/로 시작하지만 패턴이 맞지 않는 경우 404
      // 단, steps/숫자 (메인 steps 페이지)는 제외
      if (pathname.startsWith('/steps/') && !isMainStepsPage(pathname)) {
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
      onClose={() => closeMultiSlot(router, setShouldShow)}
    />
  );
}
