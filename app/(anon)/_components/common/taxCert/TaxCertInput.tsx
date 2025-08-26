'use client';

import { useState } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { FormContainer } from '@/(anon)/_components/common/forms/FormContainer';
import Field from '@/(anon)/_components/common/forms/Field';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import { TaxCertInputProps } from './types';
import { styles } from './TaxCertInput.styles';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import Image from 'next/image';
import { TAX_CERT_AUTH_METHODS } from '@libs/constants/taxCertConstants';

export const TaxCertInput = ({
  formData,
  onSubmit,
  onSuccess,
  onAuthMethodSelect,
  isAuthMethodModalOpen,
  setIsAuthMethodModalOpen,
}: TaxCertInputProps & {
  onAuthMethodSelect: (methodId: string) => void;
  isAuthMethodModalOpen: boolean;
  setIsAuthMethodModalOpen: (open: boolean) => void;
}) => {
  const { selectedAddress } = useUserAddressStore();
  const [error, setError] = useState<string | null>(null);

  // 폼 데이터 상태
  const [localFormData, setLocalFormData] = useState({
    userName: formData.userName || '',
    loginIdentity: formData.loginIdentity || '',
    identityEncYn: 'N',
    loginBirthDate: formData.loginBirthDate || '',
    loginTypeLevel: formData.loginTypeLevel || '',
    telecom: '',
    phoneNo: formData.phoneNo || '',
    loginType: formData.loginType || '6', // 비회원 간편인증 기본값
    proofType: formData.proofType || 'B0006', // 대금수령 기본값
    submitTargets: formData.submitTargets || '01', // 금융기관 기본값
    applicationType: formData.applicationType || '01', // 신청구분 기본값
    clientTypeLevel: formData.clientTypeLevel || '1', // 고객구분 기본값
    identity: formData.identity || '',
    birthDate: formData.birthDate || '',
    originDataYN: formData.originDataYN || '0',
    originDataYN1: formData.originDataYN1 || '1',
    isIdentityViewYN: formData.isIdentityViewYN || '1',
    isAddrViewYn: formData.isAddrViewYn || '0',
    organization: formData.organization || '0001',
    id:
      formData.id ||
      `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  });

  // 입력 필드 변경 핸들러
  const handleInputChange = (field: string, value: string) => {
    setLocalFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!localFormData.userName.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    if (!localFormData.loginIdentity.trim()) {
      setError('주민등록번호를 입력해주세요.');
      return;
    }

    if (!localFormData.phoneNo.trim()) {
      setError('휴대폰번호를 입력해주세요.');
      return;
    }

    if (!localFormData.loginTypeLevel) {
      setError('간편인증 방법을 선택해주세요.');
      return;
    }

    if (!selectedAddress) {
      setError('주소를 선택해주세요.');
      return;
    }

    try {
      await onSubmit({
        ...localFormData,
        phoneNo: localFormData.phoneNo.replace(/-/g, ''), // 전화번호에서 '-' 제거
        userAddressNickname: selectedAddress.nickname,
      });
      onSuccess?.();
    } catch (error) {
      setError('제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <FormContainer onSubmit={handleSubmit}>
        <div className={styles.container}>
          <Field id='userName' label='이름' required>
            <TextInput
              value={localFormData.userName}
              onChange={(e) => handleInputChange('userName', e.target.value)}
              placeholder='이름을 입력하세요'
              maxLength={50}
            />
          </Field>

          <Field id='loginIdentity' label='주민등록번호' required>
            <TextInput
              value={localFormData.loginIdentity}
              onChange={(e) =>
                handleInputChange('loginIdentity', e.target.value)
              }
              placeholder='주민등록번호 13자리'
              maxLength={13}
              type='password'
            />
          </Field>

          <Field id='phoneNo' label='휴대폰번호' required>
            <TextInput
              value={localFormData.phoneNo}
              onChange={(e) => handleInputChange('phoneNo', e.target.value)}
              placeholder='01012345678'
              mask='phone'
              inputMode='numeric'
              maxLength={14}
            />
          </Field>
        </div>

        <div>
          <Field id='loginTypeLevel' label='인증 방법' required>
            <button
              type='button'
              className={styles.authMethodButton}
              onClick={() => setIsAuthMethodModalOpen(true)}
            >
              {localFormData.loginTypeLevel ? (
                <div className={styles.selectedMethod}>
                  <Image
                    src={
                      TAX_CERT_AUTH_METHODS.find(
                        (m) => m.id === localFormData.loginTypeLevel
                      )?.image || ''
                    }
                    alt={
                      TAX_CERT_AUTH_METHODS.find(
                        (m) => m.id === localFormData.loginTypeLevel
                      )?.name || ''
                    }
                    width={24}
                    height={24}
                  />
                  <span>
                    {
                      TAX_CERT_AUTH_METHODS.find(
                        (m) => m.id === localFormData.loginTypeLevel
                      )?.name
                    }
                  </span>
                </div>
              ) : (
                <span>간편인증 방법을 선택하세요</span>
              )}
            </button>
          </Field>
        </div>

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}
      </FormContainer>
    </>
  );
};
