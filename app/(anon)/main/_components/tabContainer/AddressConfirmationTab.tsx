'use client';

import React, { useEffect } from 'react';
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

  // 모달 스토어
  const { isOpen, content, closeModal, confirmModal, cancelModal } = useModalStore();

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
    const dongHoPattern = /(\d+동)\s*(\d+호)/;

    let dong = '';
    let ho = '';
    let cleanAddress = address;

    // 패턴 매칭 시도
    const match = address.match(dongHoPattern);
    if (match) {
      dong = match[1];
      ho = match[2];
      cleanAddress = address.replace(dongHoPattern, '').trim();
    }

    // 쉼표나 괄호로 끝나는 경우 정리
    cleanAddress = cleanAddress.replace(/[,\s]+$/, '').trim();

    return {
      address: cleanAddress,
      dong: dong,
      ho: ho
    };
  };

  // 주소 파싱 결과
  const parsedAddress = parseAddressForDongHo(displaySearchQuery);

  // 동/호가 파싱되면 자동으로 입력 필드에 설정
  useEffect(() => {
    if (parsedAddress.dong && !dong) {
      setDong(parsedAddress.dong);
    }
    if (parsedAddress.ho && !ho) {
      setHo(parsedAddress.ho);
    }
  }, [parsedAddress.dong, parsedAddress.ho, dong, ho]);

  return (
    <div className={styles.container}>
      {/* 첫 번째 줄: 버튼들 */}
      <div className={styles.buttonRow}>
        <Button
          onClick={() => handleMoveToAddressOnly(dong)}
          disabled={!dong.trim()}
          variant='primary'
          className={styles.confirmButton}
        >
          지도에서 확인하기
        </Button>
        <Button
          onClick={() => {
            saveAddressToUser(dong, ho);
          }}
          disabled={!dong.trim()}
          variant='secondary'
          className={styles.saveButton}
        >
          저장하기
        </Button>
      </div>

             {/* 두 번째 줄: 주소 검색 결과 */}
       <div className={styles.addressSearchRow}>
         <div className={styles.addressContainer}>
           <span className={styles.addressValue}>
             {parsedAddress.address || displaySearchQuery || '주소 검색으로 주소를 검색 해주세요'}
           </span>
         </div>
         <Button
           onClick={handleAddressSearch}
           variant='primary'
           className={styles.searchButton}
         >
           주소 검색
         </Button>
       </div>

      {/* 세 번째 줄: 동/호 입력 필드 */}
      <div className={styles.dongHoInputs}>
        <div className={styles.dongHoContainer}>
          <TextInput
            placeholder='동'
            value={dong || parsedAddress.dong || ''}
            onChange={(e) => setDong(e.target.value)}
            className={styles.dongField}
          />
          <span className={styles.dongHoLabel}>동</span>
        </div>
        <div className={styles.dongHoContainer}>
          <TextInput
            placeholder='호'
            value={ho || parsedAddress.ho || ''}
            onChange={(e) => setHo(e.target.value)}
            className={styles.hoField}
          />
          <span className={styles.dongHoLabel}>호</span>
        </div>
      </div>

      {/* 네 번째 줄: 카카오맵 */}
      <div className={styles.mapContainer}>
        <KakaoMapModule showTransactionMarkers={true} />
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
