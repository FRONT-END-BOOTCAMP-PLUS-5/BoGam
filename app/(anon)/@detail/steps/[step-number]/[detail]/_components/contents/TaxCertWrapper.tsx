'use client';

import TaxCertIntro from './TaxCertIntro';
import { TaxCertContainer } from '@/(anon)/_components/common/taxCert/taxCertContainer/TaxCertContainer';

interface ChecklistItem {
  id: string;
  label: string;
  defaultValue: 'match' | 'mismatch';
}

interface ContentSection {
  subtitle: string;
  contents: string[];
}

interface TaxCertIntroData {
  contentSections: ContentSection[];
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  checklistItems: ChecklistItem[];
}

interface TaxCertWrapperProps {
  sectionIndex: number;
  section: {
    type: string;
    data?: TaxCertIntroData;
  };
}

export default function TaxCertWrapper({
  sectionIndex,
  section,
}: TaxCertWrapperProps) {
  // 슬라이드별 렌더링
  switch (sectionIndex) {
    case 0:
      return section.data ? (
        <TaxCertIntro
          data={section.data}
        />
      ) : null;

    case 1:
      return (
        <TaxCertContainer />
      );

    default:
      return null;
  }
}
