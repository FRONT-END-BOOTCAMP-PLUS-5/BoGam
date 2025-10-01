'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { RealEstateContainer } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/realEstate/realEstateContainer/RealEstateContainer';
import { TaxCertContainer } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/taxCert/taxCertContainer/TaxCertContainer';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { useTaxCertStore } from '@libs/stores/taxCertStore';
import { styles } from './DocumentViewContent.styles';

export default function DocumentViewContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'realestate';

  // TaxCert Store에서 모달 상태와 핸들러 가져오기
  const {
    showSimpleAuthModal,
    handleSimpleAuthApprove,
    handleSimpleAuthCancel,
  } = useTaxCertStore();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.mainCard}>
          {type === 'realestate' ? (
            <RealEstateContainer />
          ) : type === 'taxcert' ? (
            <TaxCertContainer />
          ) : (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>지원하지 않는 문서 타입입니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 간편인증 모달 - Store가 자동으로 관리 */}
      <ConfirmModal
        isOpen={showSimpleAuthModal}
        title='🔐 간편인증 추가인증'
        onCancel={handleSimpleAuthCancel}
        cancelText='❌ 취소'
        icon='info'
        isLoading={false}
        onConfirm={handleSimpleAuthApprove}
        confirmText='✅ 승인'
      >
        <div className='space-y-3'>
          <p>📱 모바일에서 카카오 인증을 완료해주세요.</p>
          <p>✅ 인증 완료 후 아래 버튼을 클릭하여 승인해주세요.</p>
          <p className='text-sm text-brand-dark-gray'>
            * 4분 30초 내에 승인/취소를 완료해주세요.
          </p>
        </div>
      </ConfirmModal>
    </div>
  );
}
