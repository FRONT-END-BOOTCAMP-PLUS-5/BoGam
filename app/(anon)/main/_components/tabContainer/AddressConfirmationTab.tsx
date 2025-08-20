'use client';

import React, { useEffect, useState } from 'react';
import { useMainPageModule } from '@/hooks/main/useMainPageModule';
import { useMainPageState } from '@/hooks/main/useMainPageState';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { DaumPostcodeModal } from '@/(anon)/main/_components/daumPostcodeModal/DaumPostcodeModal';
import Button from '@/(anon)/_components/common/button/Button';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import { styles } from '@/(anon)/main/_components/tabContainer/AddressConfirmationTab.styles';

export const AddressConfirmationTab: React.FC = () => {
  // Zustand store에서 직접 가져오기
  const { selectedAddress } = useUserAddressStore();

  // useMainPageModule에서 필요한 함수들만 가져오기
  const {
    onSearch,
    postcodeRef,
    handleMoveToAddressOnly,
    saveAddressToUser,
    showPostcode,
    setShowPostcode,
  } = useMainPageModule();

  // Daum Postcode 실행 함수
  const handleAddressSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  // useMainPageState에서 상태와 setter 함수들 가져오기
  const { searchQuery, dong, ho, setSearchQuery, setDong, setHo } =
    useMainPageState();

  // 선택된 주소가 변경될 때 동/호 데이터 업데이트
  useEffect(() => {
    if (selectedAddress) {
      const dongValue = selectedAddress.dong || '';
      const hoValue = selectedAddress.ho || '';

      // React 상태 업데이트
      setDong(dongValue);
      setHo(hoValue);
    }
  }, [selectedAddress, setDong, setHo]);

  // 주소 표시 로직
  const displaySearchQuery = selectedAddress?.completeAddress || '';

  // 디버깅: 현재 상태 로그

  return (
    <div className={styles.container}>
      {/* 첫 번째 줄: 버튼들 */}
      <div className={styles.buttonRow}>
        <Button
          onClick={handleAddressSearch}
          variant='primary'
          className={styles.searchButton}
        >
          주소 검색
        </Button>
        <div className={styles.actionButtons}>
          <Button
            onClick={() => handleMoveToAddressOnly(dong, ho)}
            disabled={!dong.trim()}
            variant='primary'
            className={styles.confirmButton}
          >
            확인하기
          </Button>
          <Button
            onClick={saveAddressToUser}
            disabled={!dong.trim()}
            variant='secondary'
            className={styles.saveButton}
          >
            저장하기
          </Button>
        </div>
      </div>

      {/* 두 번째 줄: 입력 필드들 */}
      <div className={styles.inputRow}>
        <TextInput
          placeholder='주소 검색으로 주소를 검색 해주세요'
          value={displaySearchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
          readOnly
        />
        <div className={styles.dongHoInputs}>
          <TextInput
            placeholder='동'
            value={dong}
            onChange={(e) => setDong(e.target.value)}
            className={styles.dongField}
          />
          <TextInput
            placeholder='호'
            value={ho}
            onChange={(e) => setHo(e.target.value)}
            className={styles.hoField}
          />
        </div>
      </div>

      {/* Daum 우편번호 검색 모달 */}
      <DaumPostcodeModal
        postcodeRef={postcodeRef}
        showPostcode={showPostcode}
        onClose={() => setShowPostcode(false)}
      />
    </div>
  );
};
