'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useMainPageModule } from '@/hooks/main/useMainPageModule';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import Button from '@/(anon)/_components/common/button/Button';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import { styles } from '@/(anon)/main/_components/tabContainer/AddressConfirmationTab.styles';
import KakaoMapModule from '@/(anon)/main/_components/kakaoMapModule/KakaoMapModule';
import {
  parseDongHoInputOnly,
  formatDongHoDisplay,
} from '@utils/addressInputUtils';

export const AddressConfirmationTab: React.FC = () => {
  // Zustand store에서 직접 가져오기
  const { selectedAddress, dong, ho, setDong, setHo } = useUserAddressStore();

  // 입력값을 직접 제어하는 상태
  const [inputValue, setInputValue] = useState('');

  // useMainPageModule에서 필요한 함수들만 가져오기
  const { handleMoveToAddressOnly, saveAddressToUser, isNewAddressSearch } =
    useMainPageModule();

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
      setDong(parsedAddress.dong);
    }
    if (parsedAddress.ho) {
      setHo(parsedAddress.ho);
    }
  }, [
    displaySearchQuery,
    parsedAddress.dong,
    parsedAddress.ho,
    setDong,
    setHo,
  ]);

  // 동/호 값이 변경되면 inputValue 업데이트
  useEffect(() => {
    setInputValue(formatDongHoDisplay(dong || '', ho || ''));
  }, [dong, ho]);

  // 새로 주소가 추가되었을 때 동/호 input 비우기
  useEffect(() => {
    if (isNewAddressSearch) {
      setInputValue('');
    }
  }, [isNewAddressSearch]);

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
            saveAddressToUser(dong, ho);
          }}
          disabled={!dong.trim() || !ho.trim()}
          variant='primary'
          className={'!mt-0 !w-24 !h-8 !text-xs !px-0 !py-0'}
        >
          주소 저장
        </Button>
      </div>

      {/* 세 번째 줄: 동-호 입력 필드 */}
      <div className={styles.dongHoInputs}>
        <div className={styles.dongHoContainer}>
          <TextInput
            placeholder='101-1102, 동-호 형태로'
            value={inputValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setInputValue(newValue);

              const result = parseDongHoInputOnly(newValue);
              setDong(result.dong);
              setHo(result.ho);
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
    </div>
  );
};
