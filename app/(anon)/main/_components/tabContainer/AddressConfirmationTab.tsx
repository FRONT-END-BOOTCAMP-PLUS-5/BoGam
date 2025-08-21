'use client';

import React, { useEffect, useState } from 'react';
import { useMainPageModule } from '@/(anon)/main/_components/hooks/useMainPageModule';
import { useMainPageState } from '@/(anon)/main/_components/hooks/useMainPageState';
import { DaumPostcodeModal } from '@/(anon)/main/_components/daumPostcodeModal/DaumPostcodeModal';
import Button from '@/(anon)/_components/common/button/Button';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import { styles } from '@/(anon)/main/_components/tabContainer/AddressConfirmationTab.styles';

export const AddressConfirmationTab: React.FC = () => {
  // useMainPageModule에서 필요한 함수들 가져오기
  const {
    selectedAddress,
    isNewAddressSearch,
    onSearch,
    postcodeRef,
    handleMoveToAddressOnly,
    saveAddressToUser,
    showPostcode,
    setShowPostcode,
    activeAddressType,
    setActiveAddressType,
  } = useMainPageModule();

  // Daum Postcode 실행 함수
  const handleAddressSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  // useMainPageState에서 상태와 setter 함수들 가져오기
  const {
    searchQuery,
    roadAddress,
    dong,
    ho,
    newAddressData,
    setSearchQuery,
    setDong,
    setHo,
    setNewAddressData,
  } = useMainPageState();

  // 새로운 주소용 동/호 상태
  const [newDong, setNewDong] = useState('');
  const [newHo, setNewHo] = useState('');

  // 드롭다운 선택 시 동/호 데이터 업데이트
  useEffect(() => {
    if (activeAddressType === 'dropdown' && selectedAddress) {
      const dongValue = selectedAddress.dong || '';
      const hoValue = selectedAddress.ho || '';

      console.log('드롭다운 주소 선택 시 동/호 업데이트:', {
        dongValue,
        hoValue,
      });

      // React 상태 업데이트
      setDong(dongValue);
      setHo(hoValue);
    }
  }, [selectedAddress, activeAddressType]); // setDong, setHo 의존성 제거

  // 새로운 주소에서 동/호 수정 시 새로운 주소 데이터 업데이트
  useEffect(() => {
    if (activeAddressType === 'new') {
      console.log('새로운 주소에서 동/호 수정:', {
        newDong,
        newHo,
        activeAddressType,
      });
      setNewAddressData((prev) => ({
        ...prev,
        dong: newDong,
        ho: newHo,
      }));
    }
  }, [newDong, newHo, activeAddressType]); // setNewAddressData 의존성 제거

  // 새로운 주소 검색 시 새로운 동/호 상태 초기화
  useEffect(() => {
    if (activeAddressType === 'new' && newAddressData.roadAddress) {
      console.log('새로운 주소 검색 시 새로운 동/호 상태 초기화:', {
        activeAddressType,
        newAddressData: newAddressData.roadAddress,
        currentNewDong: newDong,
        currentNewHo: newHo,
        newAddressDataFull: newAddressData,
      });
      setNewDong('');
      setNewHo('');
    }
  }, [activeAddressType, newAddressData.roadAddress]); // selectedAddress 의존성 제거

  // 주소 표시 로직 - 활성화된 주소 타입에 따라 표시
  const displaySearchQuery = (() => {
    if (activeAddressType === 'dropdown' && selectedAddress) {
      return selectedAddress.completeAddress || '';
    } else if (activeAddressType === 'new') {
      return (
        searchQuery ||
        newAddressData.searchQuery ||
        selectedAddress?.completeAddress ||
        ''
      );
    }
    return '';
  })();

  // 디버깅: 현재 상태 로그
  console.log('AddressConfirmationTab 상태:', {
    activeAddressType,
    newDong,
    newHo,
    dong,
    ho,
    selectedAddress: selectedAddress?.completeAddress,
    searchQuery,
    newAddressData,
    displaySearchQuery,
  });

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
            onClick={() => {
              if (activeAddressType === 'new') {
                handleMoveToAddressOnly(newDong, newHo);
              } else {
                handleMoveToAddressOnly(dong, ho);
              }
            }}
            disabled={
              activeAddressType === 'new' ? !newDong.trim() : !dong.trim()
            }
            variant='primary'
            className={styles.confirmButton}
          >
            확인하기
          </Button>
          <Button
            onClick={saveAddressToUser}
            disabled={
              activeAddressType === 'new' ? !newDong.trim() : !dong.trim()
            }
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
          {/* 기존 주소용 동/호 input (드롭다운 선택 시) */}
          {activeAddressType === 'dropdown' && (
            <>
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
            </>
          )}
          {/* 새로운 주소용 동/호 input (새 주소 검색 시) */}
          {activeAddressType === 'new' && (
            <>
              <TextInput
                placeholder='동'
                value={newDong}
                onChange={(e) => {
                  console.log('새로운 동 입력:', e.target.value);
                  setNewDong(e.target.value);
                }}
                className={styles.dongField}
              />
              <TextInput
                placeholder='호'
                value={newHo}
                onChange={(e) => {
                  console.log('새로운 호 입력:', e.target.value);
                  setNewHo(e.target.value);
                }}
                className={styles.hoField}
              />
            </>
          )}
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
