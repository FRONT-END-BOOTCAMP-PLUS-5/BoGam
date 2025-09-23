'use client';

import React, { useState } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { FormContainer } from '@/(anon)/_components/common/forms/FormContainer';
import Field from '@/(anon)/_components/common/forms/Field';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import { DropDown } from '@/(anon)/_components/common/dropdown/DropDown';
import Button from '@/(anon)/_components/common/button/Button';
import { TransactionSearchInputProps } from '../types';
import { styles } from './TransactionSearchInput.styles';
import { formatToKoreanUnit, formatNumber } from '@utils/formatUtils';

interface TransactionSearchInputExtendedProps extends TransactionSearchInputProps {
  onYearChange: (year: string) => void;
  onTypeChange: (type: string) => void;
  onComplexNameChange: (name: string) => void;
  onDanjiNameChange: (name: string) => void;
  onTargetAreaChange: (area: string) => void;
  onTargetPriceChange: (price: number) => void;
  onFetchComplex: () => void;
}

export const TransactionSearchInput = ({
  formData,
  onSubmit,
  loading,
  onSuccess,
  onYearChange,
  onTypeChange,
  onTargetAreaChange,
  onTargetPriceChange,
  onFetchComplex,
}: TransactionSearchInputExtendedProps) => {
  const { selectedAddress } = useUserAddressStore();
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.parsedAddress.addrSido || !formData.parsedAddress.addrSigungu) {
      setError('주소를 선택해주세요.');
      return;
    }

    if (!formData.complexName) {
      setError('단지명을 검색해주세요.');
      return;
    }

    if (!formData.targetArea) {
      setError('거래하려는 집 전용면적을 입력해주세요.');
      return;
    }

    if (formData.targetPrice <= 0) {
      setError('전세 거래금액을 입력해주세요.');
      return;
    }

    try {
      await onSubmit(formData);
      onSuccess?.();
    } catch {
      setError('조회 중 오류가 발생했습니다.');
    }
  };

  // 주소 표시 로직
  const displayAddress = selectedAddress?.roadAddress || selectedAddress?.lotAddress || '';

  const isFormDisabled = 
    !formData.parsedAddress.addrSido ||
    !formData.parsedAddress.addrSigungu ||
    loading ||
    !formData.complexName;

  return (
    <FormContainer 
      onSubmit={handleSubmit} 
      submitText="실거래가 조회하기"
      disabled={isFormDisabled}
    >
      <div className={styles.container}>
        <h3 className={styles.formTitle}>실거래가 조회</h3>

        {/* 주소 정보 표시 */}
        {displayAddress && (
          <div className={styles.addressDisplay}>
            <label className={styles.formLabel}>선택된 주소:</label>
            <div className={styles.addressValue}>{displayAddress}</div>
          </div>
        )}

        {/* 조회 년도 */}
        <Field
          id='selectedYear'
          label='조회 년도'
          required
        >
          <DropDown
            value={formData.selectedYear}
            onChange={onYearChange}
            options={[
              { value: '2025', label: '2025' },
              { value: '2024', label: '2024' },
              { value: '2023', label: '2023' },
              { value: '2022', label: '2022' },
              { value: '2021', label: '2021' },
              { value: '2020', label: '2020' },
            ]}
          />
        </Field>

        {/* 건물 타입 */}
        <Field
          id='selectedType'
          label='건물 타입'
          required
        >
          <DropDown
            value={formData.selectedType}
            onChange={onTypeChange}
            options={[
              { value: '0', label: '아파트' },
              { value: '1', label: '연립/다세대' },
              { value: '2', label: '오피스텔' },
            ]}
          />
        </Field>

        {/* 단지명 */}
        <Field
          id='danjiName'
          label='단지명'
          required
        >
          <div className={styles.complexInputGroup}>
            <div className={styles.complexDisplay}>
              {formData.danjiName || '세밀한 검색을 위한 단지명 검색'}
            </div>
            <Button
              onClick={onFetchComplex}
              variant='primary'
              className={styles.fetchButton}
            >
              가져오기
            </Button>
          </div>
          {!formData.danjiName && (
            <p className={styles.danjiHint}>
              * 아파트, 연립/다세대, 오피스텔 검색을 위해서는 단지명이 필요합니다
            </p>
          )}
        </Field>

        {/* 거래하려는 집 정보 */}
        <Field
          id='targetArea'
          label='거래하려는 집 전용면적 (㎡)'
          required
        >
          <TextInput
            type='number'
            step='0.1'
            min='0'
            value={formData.targetArea}
            onChange={(e) => onTargetAreaChange(e.target.value)}
            placeholder='예: 84.5'
          />
        </Field>

        <Field
          id='targetPrice'
          label='전세 거래금액'
          required
        >
          <div className={styles.inputWrapper}>
            <TextInput
              type='text'
              value={formData.targetPrice > 0 ? formData.targetPrice.toLocaleString() : ''}
              onChange={(e) => onTargetPriceChange(formatNumber(e.target.value))}
              placeholder='예: 550000000'
              className={styles.inputWithUnit}
            />
            {formData.targetPrice > 0 && (
              <div className={styles.unitDisplay}>
                {formatToKoreanUnit(formData.targetPrice)}
              </div>
            )}
          </div>
        </Field>

        {!formData.complexName && (
          <p className={styles.complexError}>
            단지명을 먼저 검색해주세요
          </p>
        )}

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}
      </div>
    </FormContainer>
  );
};
