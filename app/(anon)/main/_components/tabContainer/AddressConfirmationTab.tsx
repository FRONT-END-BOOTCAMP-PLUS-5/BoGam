'use client';

import React, { useEffect } from 'react';
import { useMainPageModule } from '@/hooks/main/useMainPageModule';
import { useMainPageState } from '@/hooks/main/useMainPageState';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { DaumPostcodeModal } from '@/(anon)/main/_components/daumPostcodeModal/DaumPostcodeModal';
import Button from '@/(anon)/_components/common/button/Button';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import { styles } from '@/(anon)/main/_components/tabContainer/AddressConfirmationTab.styles';
import KakaoMapModule from '@/(anon)/main/_components/kakaoMapModule/KakaoMapModule';

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
  const { dong, ho, setSearchQuery, setDong, setHo } = useMainPageState();

  // 선택된 주소가 변경될 때 동 데이터만 업데이트 (호는 저장 시에만 사용)
  useEffect(() => {
    if (selectedAddress) {
      setDong(selectedAddress.dong || '');
      setHo(selectedAddress.ho || '');
    }
  }, [selectedAddress, setDong, setHo]);

  // 주소 표시 로직
  const displaySearchQuery = selectedAddress?.completeAddress || '';

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
             {displaySearchQuery || '주소 검색으로 주소를 검색 해주세요'}
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
            value={dong}
            onChange={(e) => setDong(e.target.value)}
            className={styles.dongField}
          />
          <span className={styles.dongHoLabel}>동</span>
        </div>
        <div className={styles.dongHoContainer}>
          <TextInput
            placeholder='호'
            value={ho}
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
      /> 
    </div>
  );
};
