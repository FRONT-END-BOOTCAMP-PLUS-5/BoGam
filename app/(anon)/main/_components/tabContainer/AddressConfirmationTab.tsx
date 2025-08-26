'use client';

import React, { useEffect, useState } from 'react';
import { useMainPageModule } from '@/hooks/main/useMainPageModule';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useModalStore } from '@libs/stores/modalStore';
import { DaumPostcodeModal } from '@/(anon)/main/_components/daumPostcodeModal/DaumPostcodeModal';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import Button from '@/(anon)/_components/common/button/Button';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import { styles } from '@/(anon)/main/_components/tabContainer/AddressConfirmationTab.styles';
import KakaoMapModule from '@/(anon)/main/_components/kakaoMapModule/KakaoMapModule';

export const AddressConfirmationTab: React.FC = () => {
  // Zustand store에서 직접 가져오기
  const { selectedAddress, dong, ho, setDong, setHo } = useUserAddressStore();

  // 강제 리렌더링을 위한 상태
  const [, forceUpdate] = useState({});

  // 모달 스토어
  const { isOpen, content, closeModal, confirmModal, cancelModal } =
    useModalStore();

  // useMainPageModule에서 필요한 함수들만 가져오기
  const {
    onSearch,
    executePostcode,
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

  // 주소 표시 로직
  const displaySearchQuery = selectedAddress?.completeAddress || '';

  // 주소에서 동/호 파싱하는 함수
  const parseAddressForDongHo = (address: string) => {
    if (!address) return { address: '', dong: '', ho: '' };

    // 정규식으로 동/호 패턴 찾기
    // 패턴: "xx동 xx호" 형태
    const dongHoPattern = /(\d+)동\s*(\d+)호/;

    let dong = '';
    let ho = '';
    let cleanAddress = address;

    // 패턴 매칭 시도
    const match = address.match(dongHoPattern);
    if (match) {
      dong = match[1]; // "동" 글자 제거하고 숫자만 추출
      ho = match[2]; // "호" 글자 제거하고 숫자만 추출
      cleanAddress = address.replace(dongHoPattern, '').trim();
    }

    // 쉼표나 괄호로 끝나는 경우 정리
    cleanAddress = cleanAddress.replace(/[,\s]+$/, '').trim();

    return {
      address: cleanAddress,
      dong: dong,
      ho: ho,
    };
  };

  // 주소 파싱 결과
  const parsedAddress = parseAddressForDongHo(displaySearchQuery);
  console.log('parsedAddress.dong', parsedAddress.dong);
  console.log('dong', dong);
  console.log('parsedAddress.ho', parsedAddress.ho);
  console.log('ho', ho);
  // 동/호가 파싱되면 자동으로 입력 필드에 설정
  useEffect(() => {
    console.log(
      'useEffect 실행됨 - parsedAddress.dong:',
      parsedAddress.dong,
      'parsedAddress.ho:',
      parsedAddress.ho
    );

    if (parsedAddress.dong) {
      console.log('setDong 실행:', parsedAddress.dong);
      setDong(parsedAddress.dong);
      // 강제 리렌더링
      forceUpdate({});
    }
    if (parsedAddress.ho) {
      console.log('setHo 실행:', parsedAddress.ho);
      setHo(parsedAddress.ho);
      // 강제 리렌더링
      forceUpdate({});
    }
  }, [selectedAddress, parsedAddress.dong, parsedAddress.ho]); // dong, ho 의존성 제거

  return (
    <div className={styles.container}>
      {/* 두 번째 줄: 주소 검색 결과 */}
      <div className={styles.addressSearchRow}>
        <div className={styles.addressContainer}>
          <span
            className={`${
              parsedAddress.address || displaySearchQuery
                ? styles.addressValue
                : styles.addressPlaceholder
            }`}
          >
            {parsedAddress.address ||
              displaySearchQuery ||
              '주소를 검색하여 추가해주세요'}
          </span>
        </div>
        <Button
          onClick={handleAddressSearch}
          variant='primary'
          className={styles.searchButton}
        >
          검색하기
        </Button>
      </div>

      {/* 세 번째 줄: 동/호 입력 필드 */}
      <div className={styles.dongHoInputs}>
        <div className={styles.dongHoContainer}>
          <TextInput
            placeholder='동'
            value={dong || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setDong(value);
            }}
            inputMode='numeric'
            className={styles.dongField}
          />
          <span className={styles.dongHoLabel}>동</span>
        </div>
        <div className={styles.dongHoContainer}>
          <TextInput
            placeholder='호'
            value={ho || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setHo(value);
            }}
            inputMode='numeric'
            className={styles.hoField}
          />
          <span className={styles.dongHoLabel}>호</span>
        </div>
      </div>

      <div className={styles.buttonRow}>
        <Button
          onClick={() => {
            saveAddressToUser(dong, ho);
          }}
          disabled={!dong.trim() || !ho.trim()}
          variant='primary'
          className={styles.saveButton}
        >
          주소 저장하기
        </Button>
      </div>

      {/* 네 번째 줄: 카카오맵 */}
      <div className={styles.mapContainer}>
        <div className={styles.mapWrapper}>
          <div className={styles.mapButtonContainer}>
            <Button
              onClick={() => {
                handleMoveToAddressOnly(dong);
              }}
              disabled={!dong.trim()}
              variant='primary'
              className={styles.confirmButton}
            >
              지도 이동
            </Button>
          </div>
          <KakaoMapModule showTransactionMarkers={true} />
        </div>
      </div>

      {/* Daum 우편번호 검색 모달 */}
      <DaumPostcodeModal
        postcodeRef={postcodeRef}
        showPostcode={showPostcode}
        onClose={() => setShowPostcode(false)}
        onSearch={executePostcode}
      />

      {/* 공통 모달 */}
      <ConfirmModal
        isOpen={isOpen}
        title={content?.title || ''}
        onConfirm={confirmModal}
        onCancel={cancelModal}
        confirmText={content?.confirmText}
        cancelText={content?.cancelText}
        icon={content?.icon || 'info'}
      >
        {content?.content}
      </ConfirmModal>
    </div>
  );
};
