'use client';

import React from 'react';
import { RealEstateInput } from '@/(anon)/_components/common/realEstate/realEstateInput/RealEstateInput';
import { RealEstateOutput } from '@/(anon)/_components/common/realEstate/realEstateOutput/RealEstateOutput';
import { RealEstateTwoWayContent } from '@/(anon)/_components/common/realEstate/realEstateTwoWayContent/RealEstateTwoWayContent';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { DataContainer } from '@/(anon)/_components/common/container/DataContainer';
import { useRealEstateContainer } from '@/hooks/useRealEstateContainer';

export const RealEstateContainer = () => {
  const {
    formData,
    response,
    twoWaySelectedAddress,
    showTwoWayModal,
    existsData,
    createRealEstateMutation,
    handleAddressSelect,
    handleCloseTwoWayModal,
    handleSubmit,
  } = useRealEstateContainer();

  // 입력 컴포넌트
  const inputComponent = ({ onSuccess }: { onSuccess: () => void }) => (
    <RealEstateInput
      formData={formData}
      onSubmit={handleSubmit}
      loading={createRealEstateMutation.isPending}
    />
  );

  // 결과 컴포넌트
  const outputComponent = (
    <RealEstateOutput
      response={response}
      loading={createRealEstateMutation.isPending}
      existsData={existsData}
    />
  );

  // 존재 여부 쿼리 객체 생성
  const checkExistsQuery = {
    data: existsData
      ? { success: true, data: { exists: existsData.exists } }
      : undefined,
    isLoading: false, // useCheckRealEstateExists에서 로딩 상태를 제공하지 않으므로 false로 설정
    refetch: () => {
      // existsData를 다시 확인하는 로직이 필요하다면 여기에 구현
    },
  };

  return (
    <>
      <DataContainer
        title='부동산등기부등본 조회'
        inputComponent={inputComponent}
        outputComponent={outputComponent}
        checkExistsQuery={checkExistsQuery}
      />

      {/* 2-way 인증 모달 */}
      <ConfirmModal
        isOpen={showTwoWayModal}
        title='부동산 목록에서 선택하세요'
        onCancel={handleCloseTwoWayModal}
        cancelText='취소'
        icon='info'
        isLoading={false}
        onConfirm={undefined}
      >
        <RealEstateTwoWayContent
          resAddrList={response?.resAddrList || []}
          selectedAddress={twoWaySelectedAddress}
          onAddressSelect={handleAddressSelect}
        />
      </ConfirmModal>
    </>
  );
};
