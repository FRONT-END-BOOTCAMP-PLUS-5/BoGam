'use client';

import {
  RealEstateFormData,
  RealEstateInputProps,
} from '@/(anon)/_components/common/realEstate/types';
import Button from '@/(anon)/_components/common/button/Button';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import OtpInput from '@/(anon)/_components/common/forms/OtpInput';
import Field from '@/(anon)/_components/common/forms/Field';
import { styles } from './RealEstateInput.styles';
import { useRealEstateInput } from '@/hooks/useRealEstateInput';

export const RealEstateInput = ({
  formData,
  onSubmit,
  loading,
}: RealEstateInputProps) => {
  const { selectedAddress, register, handleSubmit, errors, setValue, reset } =
    useRealEstateInput({ formData });

  // 폼 제출 시에만 상위 컴포넌트에 데이터 전달

  const handleFormSubmit = (data: RealEstateFormData) => {
    // 전화번호에서 하이픈 제거
    const cleanData = {
      ...data,
      phoneNo: data.phoneNo.replace(/-/g, '')
    };
    onSubmit(cleanData);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
        <div className={styles.formContainer}>
                  <div className={styles.gridContainer}>
          <Field
            id="phoneNo"
            label="전화번호"
            required
          >
            <TextInput
              {...register('phoneNo', {
                required: '전화번호는 필수입니다.',
                pattern: {
                  value: /^(010|011|016|017|018|019|070|02|031|032|033|041|042|043|0502|0505|051|052|053|054|055|061|062|063|064)-\d{3,4}-\d{4}$/,
                  message: '유효한 전화번호를 입력해주세요.',
                },
              })}
              placeholder='필수:전화번호'
              mask='phone'
              className={errors.phoneNo ? styles.inputError : styles.input}
            />
            {errors.phoneNo && (
              <p className={styles.errorMessage}>{errors.phoneNo.message}</p>
            )}
          </Field>

                      <Field
            id="password"
            label="비밀번호 (4자리 숫자)"
            required
          >
            <OtpInput
              length={4}
              onChange={(value) => setValue('password', value)}
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </Field>

          <Field
            id="realtyType"
            label="부동산 구분"
          >
            <select {...register('realtyType')} className={styles.select}>
              <option value='0'>토지+건물</option>
              <option value='1'>집합건물</option>
              <option value='2'>토지</option>
              <option value='3'>건물</option>
            </select>
          </Field>

                      <Field
            id="issueType"
            label="발행구분"
            required
          >
            <select {...register('issueType')} className={styles.select}>
              <option value='0'>발급</option>
              <option value='1'>열람</option>
              <option value='2'>고유번호조회</option>
              <option value='3'>원문데이터로 결과처리</option>
            </select>
          </Field>

                      <Field
            id="address"
            label="주소"
            required
          >
            <TextInput
              {...register('address', {
                required: '주소는 필수입니다.',
              })}
              placeholder={
                selectedAddress
                  ? selectedAddress.nickname
                  : '주소를 선택하세요'
              }
              className={errors.address ? styles.inputError : styles.addressinput}
              readOnly
            />
            {errors.address && (
              <p className={styles.errorMessage}>{errors.address.message}</p>
            )}
            {!selectedAddress && (
              <p className={styles.helpText}>주소를 선택해주세요</p>
            )}
          </Field>

            {/* 숨겨진 userAddressNickname 필드 */}
            <input
              type='hidden'
              {...register('userAddressNickname')}
              value={selectedAddress?.nickname || ''}
            />
          </div>

          {/* 버튼 섹션 */}
          <div className={styles.buttonContainer}>
            <Button
              type='submit'
              disabled={loading}
              variant='primary'
              className={styles.submitButton}
            >
              {loading ? '요청 중...' : '등본 가져오기'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
