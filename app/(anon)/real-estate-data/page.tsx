'use client';

import { Suspense } from 'react';
import RealEstateDataPageContent from '@/(anon)/real-estate-data/_components/pageContent/PageContent';

export default function RealEstateDataPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RealEstateDataPageContent />
    </Suspense>
  );
}
