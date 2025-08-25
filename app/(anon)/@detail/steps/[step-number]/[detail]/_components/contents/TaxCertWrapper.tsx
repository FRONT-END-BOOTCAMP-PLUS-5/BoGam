'use client';

import TaxCertIntro from './TaxCertIntro';
import { TaxCertContainer } from '@/(anon)/_components/common/taxCert/taxCertContainer/TaxCertContainer';

interface TaxCertWrapperProps {
  sectionIndex: number;
  section: {
    type: string;
    data?: any;
  };
}

export default function TaxCertWrapper({
  sectionIndex,
  section,
}: TaxCertWrapperProps) {
  // 슬라이드별 렌더링
  switch (sectionIndex) {
    case 0:
      return (
        <TaxCertIntro
          data={section.data}
        />
      );

    case 1:
      return (
        <TaxCertContainer />
      );

    default:
      return null;
  }
}
