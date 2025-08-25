'use client';

import { useState, useEffect, useCallback } from 'react';
import { GetJeonseGuaranteeRequestDto } from '@libs/api_front/jeonseGuarantee.api';
import {
  REGION_OPTIONS,
  MARRIAGE_OPTIONS,
  HOUSE_COUNT_OPTIONS,
  FIELD_ERROR_MESSAGES,
  FIELD_PLACEHOLDERS,
  FIELD_LABELS,
} from '@utils/constants/jeonseGuarantee';
import { FormContainer } from '@/(anon)/_components/common/forms/FormContainer';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import { FormSelect } from '@/(anon)/_components/common/forms/FormSelect';
import Field from '@/(anon)/_components/common/forms/Field';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { formatToKoreanUnit } from '@utils/formatUtils';

interface JeonseGuaranteeInputProps {
  formData: GetJeonseGuaranteeRequestDto;
  errors: Record<keyof GetJeonseGuaranteeRequestDto, string | undefined>;
  inputModes: {
    myIncmAmt: 'none' | 'direct';
    myTotDebtAmt: 'none' | 'direct';
    mmrtAmt: 'none' | 'direct';
  };
  isPending: boolean;
  error: string | null;
  onInputChange: (
    field: keyof GetJeonseGuaranteeRequestDto,
    value: string | number
  ) => void;
  onInputModeChange: (
    field: 'myIncmAmt' | 'myTotDebtAmt' | 'mmrtAmt',
    mode: 'none' | 'direct'
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function JeonseGuaranteeInput({
  formData,
  errors,
  inputModes,
  isPending,
  error,
  onInputChange,
  onInputModeChange,
  onSubmit,
}: JeonseGuaranteeInputProps) {
  const { selectedAddress } = useUserAddressStore();

  // selectedAddress가 변경될 때 지역 코드 자동 설정
  useEffect(() => {
    if (selectedAddress?.legalDistrictCode) {
      onInputChange('trgtLwdgCd', selectedAddress.legalDistrictCode || '');
    }
  }, [selectedAddress?.legalDistrictCode, onInputChange]);

  const formatNumber = (value: string): number => {
    return parseInt(value.replace(/[^\d]/g, '')) || 0;
  };

  return (
    <div>
      <FormContainer onSubmit={onSubmit}>
        <div className='mb-6'>
          <h3 className='text-xl font-bold text-gray-800 mb-2'>
            전세자금보증 금액 조회
          </h3>
        </div>

        <div className='space-y-4'>
          {/* 전세보증금 */}
          <Field
            id='rentGrntAmt'
            label={FIELD_LABELS.rentGrntAmt}
            required
            error={errors.rentGrntAmt}
          >
            <div className='relative'>
              <TextInput
                type='text'
                placeholder={FIELD_PLACEHOLDERS.rentGrntAmt}
                value={formData.rentGrntAmt ? formData.rentGrntAmt : ''}
                onChange={(e) =>
                  onInputChange('rentGrntAmt', formatNumber(e.target.value))
                }
                error={!!errors.rentGrntAmt}
                className='pr-20'
              />
              {formData.rentGrntAmt > 0 && (
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium'>
                  {formatToKoreanUnit(formData.rentGrntAmt)}
                </div>
              )}
            </div>
          </Field>

          {/* 나이 */}
          <Field id='age' label={FIELD_LABELS.age} required error={errors.age}>
            <TextInput
              type='number'
              placeholder={FIELD_PLACEHOLDERS.age}
              value={formData.age || ''}
              onChange={(e) =>
                onInputChange('age', parseInt(e.target.value) || 0)
              }
              error={!!errors.age}
            />
          </Field>

          {/* 결혼상태 */}
          <Field
            id='weddStcd'
            label={FIELD_LABELS.weddStcd}
            required
            error={errors.weddStcd}
          >
            <FormSelect
              value={formData.weddStcd}
              onChange={(e) => onInputChange('weddStcd', e.target.value)}
              hasError={!!errors.weddStcd}
            >
              <option value=''>{FIELD_PLACEHOLDERS.weddStcd}</option>
              {MARRIAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelect>
          </Field>

          {/* 소득금액 */}
          <Field
            id='myIncmAmt'
            label={FIELD_LABELS.myIncmAmt}
            required
            error={errors.myIncmAmt}
          >
            <div className='relative'>
              <TextInput
                type='text'
                placeholder={FIELD_PLACEHOLDERS.myIncmAmt}
                value={
                  formData.myIncmAmt > 0
                    ? formData.myIncmAmt.toLocaleString()
                    : ''
                }
                onChange={(e) =>
                  onInputChange('myIncmAmt', formatNumber(e.target.value))
                }
                error={!!errors.myIncmAmt}
                className='pr-20'
              />
              {formData.myIncmAmt > 0 && (
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium'>
                  {formatToKoreanUnit(formData.myIncmAmt)}
                </div>
              )}
            </div>
          </Field>

          {/* 총부채금액 */}
          <Field
            id='myTotDebtAmt'
            label={FIELD_LABELS.myTotDebtAmt}
            required
            error={errors.myTotDebtAmt}
          >
            <div className='relative'>
              <TextInput
                type='text'
                placeholder={FIELD_PLACEHOLDERS.myTotDebtAmt}
                value={
                  formData.myTotDebtAmt > 0
                    ? formData.myTotDebtAmt.toLocaleString()
                    : ''
                }
                onChange={(e) =>
                  onInputChange('myTotDebtAmt', formatNumber(e.target.value))
                }
                error={!!errors.myTotDebtAmt}
                className='pr-20'
              />
              {formData.myTotDebtAmt > 0 && (
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium'>
                  {formatToKoreanUnit(formData.myTotDebtAmt)}
                </div>
              )}
            </div>
          </Field>

          {/* 보유주택수 */}
          <Field
            id='ownHsCnt'
            label={FIELD_LABELS.ownHsCnt}
            required
            error={errors.ownHsCnt}
          >
            <FormSelect
              value={formData.ownHsCnt.toString()}
              onChange={(e) =>
                onInputChange('ownHsCnt', parseInt(e.target.value))
              }
              hasError={!!errors.ownHsCnt}
            >
              <option value=''>{FIELD_PLACEHOLDERS.ownHsCnt}</option>
              {HOUSE_COUNT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelect>
          </Field>

          {/* 월세금액 */}
          <Field
            id='mmrtAmt'
            label={FIELD_LABELS.mmrtAmt}
            required
            error={errors.mmrtAmt}
          >
            <div className='flex gap-2'>
              <FormSelect
                value={inputModes.mmrtAmt}
                onChange={(e) =>
                  onInputModeChange(
                    'mmrtAmt',
                    e.target.value as 'none' | 'direct'
                  )
                }
                hasError={!!errors.mmrtAmt}
                className='w-1/3'
              >
                <option value='none'>없음</option>
                <option value='direct'>직접 입력</option>
              </FormSelect>
              {inputModes.mmrtAmt === 'direct' && (
                <div className='relative flex-1'>
                  <TextInput
                    type='text'
                    placeholder={FIELD_PLACEHOLDERS.mmrtAmt}
                    value={formData.mmrtAmt > 0 ? formData.mmrtAmt : ''}
                    onChange={(e) =>
                      onInputChange('mmrtAmt', formatNumber(e.target.value))
                    }
                    error={!!errors.mmrtAmt}
                    className='pr-20'
                  />
                  {formData.mmrtAmt > 0 && (
                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium'>
                      {formatToKoreanUnit(formData.mmrtAmt)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Field>
        </div>
      </FormContainer>

      {/* 에러 메시지 */}
      {error && (
        <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
          <p className='text-red-600 text-sm'>
            조회 중 오류가 발생했습니다. 다시 시도해주세요.
          </p>
        </div>
      )}
    </div>
  );
}
