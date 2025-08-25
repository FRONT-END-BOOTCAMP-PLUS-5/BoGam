'use client';

import React from 'react';
import { TaxCertInput } from '@/(anon)/_components/common/taxCert/TaxCertInput';
import { TaxCertOutput } from '@/(anon)/_components/common/taxCert/taxCertOutput/TaxCertOutput';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { DataContainer } from '@/(anon)/_components/common/container/DataContainer';
import { useTaxCertContainer } from '@/hooks/useTaxCertContainer';

export const TaxCertContainer = () => {
  const {
    formData,
    response,
    showSimpleAuthModal,
    existsData,
    submitTaxCertMutation,
    submitTwoWayAuthMutation,
    isDataLoading,
    activeTab,
    setActiveTab,
    handleSimpleAuthApprove,
    handleSimpleAuthCancel,
    handleSubmit,
  } = useTaxCertContainer();

  // 입력 컴포넌트
  const inputComponent = ({ onSuccess }: { onSuccess: () => void }) => (
    <TaxCertInput
      formData={formData}
      onSubmit={handleSubmit}
      loading={submitTaxCertMutation.isPending}
      onSuccess={onSuccess}
    />
  );

  // 결과 컴포넌트
  const outputComponent = (
    <TaxCertOutput
      response={response}
      loading={
        isDataLoading ||
        submitTaxCertMutation.isPending ||
        submitTwoWayAuthMutation.isPending
      }
      existsData={existsData}
    />
  );

  // 존재 여부 쿼리 객체 생성
  const checkExistsQuery = {
    data: existsData
      ? {
          success: true,
          data: {
            exists:
              (existsData as unknown as { exists: boolean })?.exists || false,
          },
        }
      : undefined,
    isLoading: false,
    refetch: () => {
      // existsData를 다시 확인하는 로직이 필요하다면 여기에 구현
    },
  };

  return (
    <>
      <DataContainer
        title='납세증명서 관리'
        inputComponent={inputComponent}
        outputComponent={outputComponent}
        checkExistsQuery={checkExistsQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 간편인증 추가인증 모달 */}
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
          <p className='text-sm text-gray-600'>
            * 4분 30초 내에 승인/취소를 완료해주세요.
          </p>
        </div>
      </ConfirmModal>
    </>
  );
};
