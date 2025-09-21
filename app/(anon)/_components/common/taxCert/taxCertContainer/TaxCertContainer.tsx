'use client';

import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { TaxCertInput } from '@/(anon)/_components/common/taxCert/taxCertInput/TaxCertInput';
import { TaxCertOutput } from '@/(anon)/_components/common/taxCert/taxCertOutput/TaxCertOutput';
import { DataContainer } from '@/(anon)/_components/common/container/DataContainer';
import { useTaxCertContainer } from '@/hooks/useTaxCertContainer';
import { useModalStore } from '@libs/stores/modalStore';

interface TaxCertContainerProps {
  onShowSimpleAuthModal: () => void;
  onSimpleAuthApprove: () => void;
  onSimpleAuthCancel: () => void;
}

export interface TaxCertContainerRef {
  handleSimpleAuthApprove: () => void;
}

export const TaxCertContainer = forwardRef<
  TaxCertContainerRef,
  TaxCertContainerProps
>(({ onShowSimpleAuthModal, onSimpleAuthApprove, onSimpleAuthCancel }, ref) => {
  const {
    formData,
    response,
    existsData,
    submitTaxCertMutation,
    submitTwoWayAuthMutation,
    isDataLoading,
    activeTab,
    setActiveTab,
    handleSubmit,
    handleSimpleAuthApprove,
  } = useTaxCertContainer({
    onShowSimpleAuthModal,
    onSimpleAuthApprove,
    onSimpleAuthCancel,
  });

  // 모달 스토어에서 openModal 함수 가져오기
  const { openModal } = useModalStore();

  // response 변경을 감지하여 에러 모달 표시
  useEffect(() => {
    if (response && !response.success) {
      openModal({
        title: '오류',
        content: response.message || '납세증명서 발급 중 오류가 발생했습니다.',
        icon: 'error',
        confirmText: '확인',
        onConfirm: async () => {
          // 확인 버튼 클릭 시 아무것도 하지 않음 (모달만 닫힘)
        },
      });
    }
  }, [response, openModal]);

  // ref를 통해 외부에서 접근할 수 있는 메서드 노출
  useImperativeHandle(ref, () => ({
    handleSimpleAuthApprove,
  }));

  // 입력 컴포넌트
  const inputComponent = ({ onSuccess }: { onSuccess: () => void }) => (
    <TaxCertInput
      formData={formData}
      onSubmit={handleSubmit}
      loading={submitTaxCertMutation.isPending}
      onSuccess={onSuccess}
      isAuthMethodModalOpen={false}
      onAuthMethodSelect={() => {}}
      setIsAuthMethodModalOpen={() => {}}
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
          exists:
            (existsData as unknown as { exists: boolean })?.exists || false,
        }
      : undefined,
    isLoading: false,
    refetch: () => {
      // existsData를 다시 확인하는 로직이 필요하다면 여기에 구현
    },
  };

  return (
    <DataContainer
      title='납세증명서 조회'
      inputComponent={inputComponent}
      outputComponent={outputComponent}
      checkExistsQuery={checkExistsQuery}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
});

TaxCertContainer.displayName = 'TaxCertContainer';
