'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RealEstateFormData, RealEstateInputProps } from './types';
import Button from '@/(anon)/_components/common/button/Button';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import { styles } from './RealEstateInput.styles';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

export const RealEstateInput = ({
  formData,
  onSubmit,
  loading,
}: RealEstateInputProps) => {
  const { selectedAddress } = useUserAddressStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<RealEstateFormData>({
    defaultValues: formData,
  });

  // 선택된 주소가 변경되면 자동으로 address 필드 업데이트
  useEffect(() => {
    if (selectedAddress) {
      const address = `${
        selectedAddress.roadAddress
          ? selectedAddress.roadAddress
          : selectedAddress.lotAddress
      } ${selectedAddress.dong}동 ${selectedAddress.ho}호`;
      setValue('address', address);
      setValue('userAddressNickname', selectedAddress.nickname);
    }
  }, [selectedAddress, setValue]);

  // 폼 제출 시에만 상위 컴포넌트에 데이터 전달

  const handleFormSubmit = (data: RealEstateFormData) => {
    onSubmit(data);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
        <div className={styles.formContainer}>
          <div className={styles.gridContainer}>
            <div className={styles.fieldContainer}>
              <label htmlFor='phoneNo' className={styles.requiredLabel}>
                전화번호
              </label>
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
                mask='phone'
                className={errors.phoneNo ? styles.inputError : styles.input}
              />
              {errors.phoneNo && (
                <p className={styles.errorMessage}>{errors.phoneNo.message}</p>
              )}
            </div>

            <div className={styles.fieldContainer}>
              <label htmlFor='password' className={styles.requiredLabel}>
                비밀번호 (4자리 숫자)
              </label>
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
                className={errors.password ? styles.inputError : styles.input}
              />
              {errors.password && (
                <p className={styles.errorMessage}>{errors.password.message}</p>
              )}
            </div>

            <div className={styles.fieldContainer}>
              <label htmlFor='realtyType' className={styles.label}>
                부동산 구분
              </label>
              <select {...register('realtyType')} className={styles.select}>
                <option value='0'>토지+건물</option>
                <option value='1'>집합건물</option>
                <option value='2'>토지</option>
                <option value='3'>건물</option>
              </select>
            </div>

            <div className={styles.fieldContainer}>
              <label htmlFor='issueType' className={styles.requiredLabel}>
                발행구분
              </label>
              <select {...register('issueType')} className={styles.select}>
                <option value='0'>발급</option>
                <option value='1'>열람</option>
                <option value='2'>고유번호조회</option>
                <option value='3'>원문데이터로 결과처리</option>
              </select>
            </div>

            <div className={styles.fieldContainer}>
              <label htmlFor='address' className={styles.requiredLabel}>
                주소
              </label>
              <TextInput
                {...register('address', {
                  required: '주소는 필수입니다.',
                })}
                placeholder={
                  selectedAddress
                    ? selectedAddress.nickname
                    : '주소를 선택하세요'
                }
                className={errors.address ? styles.inputError : styles.input}
                readOnly
              />
              {errors.address && (
                <p className={styles.errorMessage}>{errors.address.message}</p>
              )}
              {!selectedAddress && (
                <p className={styles.helpText}>주소를 선택해주세요</p>
              )}
            </div>

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
              {loading ? '요청 중...' : 'API 호출'}
            </Button>
            <Button
              type='button'
              variant='secondary'
              className={styles.resetButton}
              onClick={() => {
                // 폼 초기화 로직
                reset({
                  phoneNo: '01011111111',
                  password: '1234',
                  address: '',
                  userAddressNickname: '',
                  realtyType: '1',
                  recordStatus: '0',
                  startPageNo: '1',
                  pageCount: '5',
                  applicationType: '1',
                  organization: '0002',
                  inquiryType: '1',
                  issueType: '1',
                  jointMortgageJeonseYN: '0',
                  tradingYN: '0',
                  electronicClosedYN: '0',
                  originDataYN: '1',
                  warningSkipYN: '0',
                  registerSummaryYN: '0',
                  selectAddress: '0',
                  isIdentityViewYn: '0',
                  uniqueNo: '',
                  addr_sido: '',
                  addr_dong: '',
                  addr_lotNumber: '',
                  inputSelect: '',
                  buildingName: '',
                  dong: '101',
                  ho: '101',
                  addr_sigungu: '',
                  addr_roadName: '',
                  addr_buildingNumber: '',
                  listNumber: '',
                  ePrepayNo: '',
                  ePrepayPass: '',
                  originData: '',
                  reqIdentity: '',
                  identityList: [{ reqIdentity: '' }],
                });
              }}
            >
              초기화
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
