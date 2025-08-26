'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import TaxCertIntro from './TaxCertIntro';
import { TaxCertContainer, TaxCertContainerRef } from '@/(anon)/_components/common/taxCert/taxCertContainer/TaxCertContainer';

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
  onShowSimpleAuthModal: () => void;
  onSimpleAuthApprove: () => void;
  onSimpleAuthCancel: () => void;
}

export interface TaxCertWrapperRef {
  handleSimpleAuthApprove: () => void;
}

const TaxCertWrapper = forwardRef<TaxCertWrapperRef, TaxCertWrapperProps>(({
  sectionIndex,
  section,
  onShowSimpleAuthModal,
  onSimpleAuthApprove,
  onSimpleAuthCancel,
}, ref) => {
  const taxCertContainerRef = React.useRef<TaxCertContainerRef | null>(null);

  // ref를 통해 외부에서 접근할 수 있는 메서드 노출
  useImperativeHandle(ref, () => ({
    handleSimpleAuthApprove: () => {
      if (taxCertContainerRef.current) {
        taxCertContainerRef.current.handleSimpleAuthApprove();
      }
    },
  }));

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
        <TaxCertContainer
          ref={taxCertContainerRef}
          onShowSimpleAuthModal={onShowSimpleAuthModal}
          onSimpleAuthApprove={onSimpleAuthApprove}
          onSimpleAuthCancel={onSimpleAuthCancel}
        />
      );

    default:
      return null;
  }
});

TaxCertWrapper.displayName = 'TaxCertWrapper';

export default TaxCertWrapper;
