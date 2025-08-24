'use client';

import {
  RealEstateFormData,
  RealEstateInputProps,
} from '@/(anon)/_components/common/realEstate/types';
import { FormContainer } from '@/(anon)/_components/common/forms/FormContainer';
import Field from '@/(anon)/_components/common/forms/Field';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import { FormSelect } from '@/(anon)/_components/common/forms/FormSelect';
import { useRealEstateInput } from '@/hooks/useRealEstateInput';

export const RealEstateInput = ({
  formData,
  onSubmit,
  loading,
}: RealEstateInputProps) => {
  const { selectedAddress, register, handleSubmit, errors } =
    useRealEstateInput({ formData });

  const handleFormSubmit = (data: RealEstateFormData) => {
    onSubmit(data);
  };

  return (
    <FormContainer
      title='부동산등기부등본 조회'
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
          {...register('phoneNo', {
            required: '전화번호는 필수입니다.',
            pattern: {
              value:
                /^(010|011|016|017|018|019|070|02|031|032|033|041|042|043|0502|0505|051|052|053|054|055|061|062|063|064)\d{7,8}$/,
              message: '유효한 전화번호를 입력해주세요.',
            },
          })}
          placeholder='010-1234-5678'
          error={!!errors.phoneNo}
        />
      </Field>

      <Field
        id='password'
        label='비밀번호 (4자리 숫자)'
        required
        error={errors.password?.message}
      >
        <TextInput
          {...register('password', {
            required: '비밀번호는 필수입니다.',
            pattern: {
              value: /^[0-9]{4}$/,
              message: '4자리 숫자를 입력해주세요.',
            },
          })}
          type='password'
          maxLength={4}
          placeholder='0000'
          error={!!errors.password}
        />
      </Field>

      <Field id='realty-type' label='부동산 구분'>
        <FormSelect {...register('realtyType')}>
          <option value='0'>토지+건물</option>
          <option value='1'>집합건물</option>
          <option value='2'>토지</option>
          <option value='3'>건물</option>
        </FormSelect>
      </Field>

      <Field id='issue-type' label='발행구분' required>
        <FormSelect {...register('issueType')}>
          <option value='0'>발급</option>
          <option value='1'>열람</option>
          <option value='2'>고유번호조회</option>
          <option value='3'>원문데이터로 결과처리</option>
        </FormSelect>
      </Field>

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
