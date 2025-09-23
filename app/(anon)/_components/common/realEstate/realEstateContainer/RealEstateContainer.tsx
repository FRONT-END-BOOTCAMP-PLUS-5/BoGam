'use client';

import React, { useEffect } from 'react';
import { RealEstateInput } from '@/(anon)/_components/common/realEstate/realEstateInput/RealEstateInput';
import { RealEstateOutput } from '@/(anon)/_components/common/realEstate/realEstateOutput/RealEstateOutput';
import { DataContainer } from '@/(anon)/_components/common/container/DataContainer';
import { useRealEstateContainer } from '@/hooks/useRealEstateContainer';
import { useModalStore } from '@libs/stores/modalStore';

export const RealEstateContainer = () => {
  const {
    formData,
    response,
    existsData,
    createRealEstateMutation,
    twoWayAuthMutation,
    isDataLoading,
    activeTab,
    setActiveTab,
    handleSubmit,
  } = useRealEstateContainer();

  // 모달 스토어에서 openModal 함수 가져오기
  const { openModal } = useModalStore();

  // response 변경을 감지하여 에러 모달 표시
  useEffect(() => {
    if (response && !response.success) {
      openModal({
        title: '오류',
        content: response.message.split('+').join(' ') || '부동산등기부등본 조회 중 오류가 발생했습니다.',
        icon: 'error',
        confirmText: '확인',
        onConfirm: async () => {
          // 확인 버튼 클릭 시 아무것도 하지 않음 (모달만 닫힘)
        },
      });
    }
  }, [response, openModal]);

  // 입력 컴포넌트
  const inputComponent = () => (
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
      loading={
        isDataLoading ||
        createRealEstateMutation.isPending ||
        twoWayAuthMutation.isPending
      }
      existsData={existsData}
    />
  );

  // 존재 여부 쿼리 객체 생성
  const checkExistsQuery = {
    data: existsData
      ? { success: true, exists: existsData.exists }
      : undefined,
    isLoading: false, // useCheckRealEstateExists에서 로딩 상태를 제공하지 않으므로 false로 설정
    refetch: () => {
      // existsData를 다시 확인하는 로직이 필요하다면 여기에 구현
    },
  };

  return (
    <DataContainer
      title='부동산등기부등본 조회'
      inputComponent={inputComponent}
      outputComponent={outputComponent}
      checkExistsQuery={checkExistsQuery}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};
