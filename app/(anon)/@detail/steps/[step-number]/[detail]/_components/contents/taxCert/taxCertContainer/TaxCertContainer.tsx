'use client';

import React, { useEffect } from 'react';
import { TaxCertInput } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/taxCert/taxCertInput/TaxCertInput';
import { TaxCertOutput } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/taxCert/taxCertOutput/TaxCertOutput';
import { DataContainer } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/container/DataContainer';
import { useTaxCertContainer } from '@/hooks/useTaxCertContainer';
import { setTaxCertContainerRef } from '@libs/stores/taxCertStore';

export const TaxCertContainer = () => {
  const {
    formData,
    existsData,
    submitTaxCertMutation,
    submitTwoWayAuthMutation,
    isDataLoading,
    activeTab,
    setActiveTab,
    handleSubmit,
    handleSimpleAuthApprove,
  } = useTaxCertContainer();

  // Store에 ref 등록 (외부 변수로 관리하여 무한 루프 방지)
  useEffect(() => {
    setTaxCertContainerRef({ handleSimpleAuthApprove });
    return () => {
      setTaxCertContainerRef(null);
    };
  }, [handleSimpleAuthApprove]);

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

  // 결과 컴포넌트 - response는 null로 전달 (DB에서 조회)
  const outputComponent = (
    <TaxCertOutput
      response={null}
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
};
