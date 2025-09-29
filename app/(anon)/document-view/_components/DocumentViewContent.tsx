'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { RealEstateContainer } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/realEstate/realEstateContainer/RealEstateContainer';
import { TaxCertContainer } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/taxCert/taxCertContainer/TaxCertContainer';
import { styles } from './DocumentViewContent.styles';

export default function DocumentViewContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'realestate';
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');

  const handleShowSimpleAuthModal = () => {
    // 간편인증 모달은 여기서는 사용하지 않음
  };

  const handleSimpleAuthApprove = () => {
    // 간편인증 승인은 여기서는 사용하지 않음
  };

  const handleSimpleAuthCancel = () => {
    // 간편인증 취소는 여기서는 사용하지 않음
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.mainCard}>
          {type === 'realestate' ? (
            <RealEstateContainer />
          ) : type === 'taxcert' ? (
            <TaxCertContainer
              onShowSimpleAuthModal={handleShowSimpleAuthModal}
              onSimpleAuthApprove={handleSimpleAuthApprove}
              onSimpleAuthCancel={handleSimpleAuthCancel}
            />
          ) : (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>지원하지 않는 문서 타입입니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
