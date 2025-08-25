'use client';

import { Suspense } from 'react';
import RealEstateDataPageContent from './_components/pageContent/PageContent';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';

export default function RealEstateDataPage() {
  return (
    <Suspense 
      fallback={
        <LoadingOverlay 
          isVisible={true}
          title="페이지를 불러오는 중입니다..."
          currentStep={1}
          totalSteps={1}
        />
      }
    >
      <RealEstateDataPageContent />
    </Suspense>
  );
}
