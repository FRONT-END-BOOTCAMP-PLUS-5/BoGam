'use client';

import React from 'react';
import { RealEstateInput } from '@/(anon)/_components/common/realEstate/realEstateInput/RealEstateInput';
import { RealEstateOutput } from '@/(anon)/_components/common/realEstate/realEstateOutput/RealEstateOutput';
import { RealEstateTwoWayContent } from '@/(anon)/_components/common/realEstate/realEstateTwoWayContent/RealEstateTwoWayContent';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { styles } from './RealEstateContainer.styles';
import { useRealEstateContainer } from '@/hooks/useRealEstateContainer';

export const RealEstateContainer = () => {
  const {
    activeTab,
    setActiveTab,
    formData,
    response,
    twoWaySelectedAddress,
    showTwoWayModal,
    selectedAddress,
    existsData,
    createRealEstateMutation,
    twoWayAuthMutation,
    handleAddressSelect,
    handleCloseTwoWayModal,
    handleSubmit,
  } = useRealEstateContainer();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>부동산등기부등본 조회</h1>

      {/* 탭 네비게이션 */}
      <div className={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('input')}
          className={`${styles.tab} ${
            activeTab === 'input' ? styles.activeTab : styles.inactiveTab
          }`}
        >
          입력
        </button>
        <button
          onClick={() => setActiveTab('output')}
          className={`${styles.tab} ${
            activeTab === 'output' ? styles.activeTab : styles.inactiveTab
          }`}
        >
          결과
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className={styles.tabContent}>
        {activeTab === 'input' && (
          <RealEstateInput
            formData={formData}
            onSubmit={handleSubmit}
            loading={createRealEstateMutation.isPending}
          />
        )}

        {activeTab === 'output' && (
          <RealEstateOutput
            response={response}
            loading={createRealEstateMutation.isPending}
            existsData={existsData}
          />
        )}
      </div>

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
    </div>
  );
};
