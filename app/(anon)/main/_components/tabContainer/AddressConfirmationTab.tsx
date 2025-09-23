'use client';

import React, { useEffect, useMemo } from 'react';
import { useMainPageModule } from '@/hooks/main/useMainPageModule';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import Button from '@/(anon)/_components/common/button/Button';
import { styles } from '@/(anon)/main/_components/tabContainer/AddressConfirmationTab.styles';
import KakaoMapModule from '@/(anon)/main/_components/kakaoMapModule/KakaoMapModule';
import {
  parseDongHoInputOnly,
  formatDongHoDisplay,
} from '@utils/addressInputUtils';

export const AddressConfirmationTab: React.FC = () => {
  // Zustand store에서 직접 가져오기
  const { selectedAddress, updateAddress } = useUserAddressStore();

  // useMainPageModule에서 필요한 함수들만 가져오기
  const {
    handleMoveToAddressOnly,
    saveAddressToUser,
    isNewAddressSearch,
    // 새로운 주소 검색 시에는 useMainPageState의 dong, ho 사용
    dong: mainPageDong,
    ho: mainPageHo,
    setDong: setMainPageDong,
    setHo: setMainPageHo,
  } = useMainPageModule();

  // input ref를 사용하여 직접 제어
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 새로운 주소 검색 시에는 mainPageState의 dong, ho 사용, 아니면 store의 dong, ho 사용
  const {
    dong: storeDong,
    ho: storeHo,
    setDong: setStoreDong,
    setHo: setStoreHo,
  } = useUserAddressStore();

  // 현재 사용할 dong, ho 결정
  const currentDong = isNewAddressSearch ? mainPageDong : storeDong;
  const currentHo = isNewAddressSearch ? mainPageHo : storeHo;
  const setCurrentDong = isNewAddressSearch ? setMainPageDong : setStoreDong;
  const setCurrentHo = isNewAddressSearch ? setMainPageHo : setStoreHo;

  // 주소 수정 상태 감지
  const isAddressModified = useMemo(() => {
    // 새로운 주소 검색 상태가 아닌 경우 (즉, 기존 DB 주소가 선택된 상태)
    if (isNewAddressSearch) {
      return false;
    }

    // 선택된 주소가 있고, 해당 주소가 휘발성이 아닌 경우
    if (selectedAddress && !selectedAddress.isVolatile) {
      const originalDong = selectedAddress.dong || '';
      const originalHo = selectedAddress.ho || '';

      // 현재 입력된 동-호 값과 원본 값이 다른 경우
      return currentDong !== originalDong || currentHo !== originalHo;
    }

    return false;
  }, [isNewAddressSearch, selectedAddress, currentDong, currentHo]);

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

  // 주소 파싱 결과를 useMemo로 메모이제이션
  const parsedAddress = useMemo(() => {
    return parseAddressForDongHo(displaySearchQuery);
  }, [displaySearchQuery]);

  // 동/호가 파싱되면 자동으로 입력 필드에 설정
  useEffect(() => {
    if (parsedAddress.dong) {
      setCurrentDong(parsedAddress.dong);
    }
    if (parsedAddress.ho) {
      setCurrentHo(parsedAddress.ho);
    }
  }, [
    displaySearchQuery,
    parsedAddress.dong,
    parsedAddress.ho,
    setCurrentDong,
    setCurrentHo,
  ]);

  // 새로 주소가 추가되었을 때 동/호 input 비우기
  useEffect(() => {
    if (isNewAddressSearch && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [isNewAddressSearch]);

  // 주소 파싱 결과가 있을 때 input에 반영
  useEffect(() => {
    if (parsedAddress.dong || parsedAddress.ho) {
      if (inputRef.current) {
        inputRef.current.value = formatDongHoDisplay(
          parsedAddress.dong,
          parsedAddress.ho
        );
      }
    }
  }, [parsedAddress.dong, parsedAddress.ho]);

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
          onClick={() => {
            if (isAddressModified) {
              updateAddress(selectedAddress!.id, {
                dong: currentDong,
                ho: currentHo,
                completeAddress: selectedAddress!.roadAddress
                  ? `${
                      selectedAddress!.roadAddress
                    } ${currentDong}동${currentHo}호`
                  : `${
                      selectedAddress!.lotAddress
                    } ${currentDong}동${currentHo}호`,
              });
            } else {
              saveAddressToUser(currentDong, currentHo);
            }
          }}
          disabled={!currentDong.trim() || !currentHo.trim()}
          variant='primary'
          className={'!mt-0 !w-24 !h-8 !text-xs !px-0 !py-0'}
        >
          {isAddressModified ? '주소 수정' : '주소 저장'}
        </Button>
      </div>

      {/* 세 번째 줄: 동-호 입력 필드 */}
      <div className={styles.dongHoInputs}>
        <div className={styles.dongHoContainer}>
          <input
            ref={inputRef}
            placeholder='101-1102, 동-호 형태로'
            onChange={(e) => {
              const newValue = e.target.value;
              const result = parseDongHoInputOnly(newValue);
              setCurrentDong(result.dong);
              setCurrentHo(result.ho);
            }}
            inputMode='text'
            type='text'
            className={styles.combinedField}
          />
        </div>
      </div>

      {/* 네 번째 줄: 카카오맵 */}
      <div className={styles.mapContainer}>
        <div className={styles.mapWrapper}>
          <div className={styles.mapButtonContainer}>
            <Button
              onClick={() => {
                handleMoveToAddressOnly(currentDong);
              }}
              disabled={!currentDong.trim()}
              variant='primary'
              className={styles.confirmButton}
            >
              지도 이동
            </Button>
          </div>
          <KakaoMapModule showTransactionMarkers={true} />
        </div>
      </div>
    </div>
  );
};
