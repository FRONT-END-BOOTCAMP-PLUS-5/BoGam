'use client';

import { Suspense } from 'react';
import DocumentViewPageContent from './_components/DocumentViewContent';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';

export default function DocumentViewPage() {
  return (
    <Suspense
      fallback={
        <LoadingOverlay
          isVisible={true}
          title='페이지를 불러오는 중입니다...'
          currentStep={1}
          totalSteps={1}
        />
      }
    >
      <DocumentViewPageContent />
    </Suspense>
  );
}
