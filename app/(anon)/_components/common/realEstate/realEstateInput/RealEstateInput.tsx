'use client';

import {
  RealEstateFormData,
  RealEstateInputProps,
} from '@/(anon)/_components/common/realEstate/types';
import { FormContainer } from '@/(anon)/_components/common/forms/FormContainer';
import Field from '@/(anon)/_components/common/forms/Field';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import { DropDown } from '@/(anon)/_components/common/dropdown/DropDown';
import OtpInput from '@/(anon)/_components/common/forms/OtpInput';
import { useRealEstateInput } from '@/hooks/useRealEstateInput';
import { useState } from 'react';

export const RealEstateInput = ({
  formData,
  onSubmit,
  loading,
}: RealEstateInputProps) => {
  const { selectedAddress, register, handleSubmit, errors, watch, setValue } =
    useRealEstateInput({ formData });

  const [password, setPassword] = useState('');

  // 부동산 구분 옵션
  const realtyTypeOptions = [
    { value: '0', label: '토지+건물' },
    { value: '1', label: '집합건물' },
    { value: '2', label: '토지' },
    { value: '3', label: '건물' },
  ];

  // 발행구분 옵션
  const issueTypeOptions = [
    { value: '0', label: '발급' },
    { value: '1', label: '열람' },
    { value: '2', label: '고유번호조회' },
    { value: '3', label: '원문데이터로 결과처리' },
  ];

  const handleFormSubmit = (data: RealEstateFormData) => {
    // 비밀번호 검증
    if (password.length !== 4) {
      return;
    }

    // 전화번호에서 '-' 제거
    const cleanedData = {
      ...data,
      phoneNo: data.phoneNo.replace(/-/g, ''),
      password: password, // OTP 입력값 사용
    };
    onSubmit(cleanedData);
  };

  return (
    <FormContainer
      onSubmit={handleSubmit(handleFormSubmit)}
      isLoading={loading}
      submitText='등본 가져오기'
    >
      <Field
        id='phone-no'
        label='전화번호'
        required
        error={errors.phoneNo?.message}
      >
        <TextInput
          {...register('phoneNo')}
          mask='phone'
          inputMode='numeric'
          placeholder='01012345678'
          error={!!errors.phoneNo}
        />
      </Field>

      <Field
        id='password'
        label='비밀번호 (4자리 숫자)'
        required
        error={password.length < 4 ? '4자리 숫자를 입력해주세요.' : undefined}
      >
        <OtpInput length={4} onChange={(value) => setPassword(value)} />
      </Field>

      <DropDown
        id='realty-type'
        label='부동산 구분'
        options={realtyTypeOptions}
        value={watch('realtyType') || '0'}
        onChange={(value) => setValue('realtyType', value)}
      />

      <DropDown
        id='issue-type'
        label='발행구분'
        required
        options={issueTypeOptions}
        value={watch('issueType') || '0'}
        onChange={(value) => setValue('issueType', value)}
      />

      <Field
        id='address'
        label='주소'
        required
        error={errors.address?.message}
        hint={!selectedAddress ? '주소를 선택해주세요' : undefined}
      >
        <TextInput
          {...register('address', {
            required: '주소는 필수입니다.',
          })}
          placeholder={
            selectedAddress ? selectedAddress.nickname : '주소를 선택하세요'
          }
          readOnly
          error={!!errors.address}
        />
      </Field>

      {/* 숨겨진 userAddressNickname 필드 */}
      <input
        type='hidden'
        {...register('userAddressNickname')}
        value={selectedAddress?.nickname || ''}
      />
    </FormContainer>
  );
};
