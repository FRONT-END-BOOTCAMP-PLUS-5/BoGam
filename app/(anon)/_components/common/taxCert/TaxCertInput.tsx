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

const authMethods = [
  {
    id: '1',
    name: '카카오톡',
    image: '/images/KakaoTalk.png',
    alt: '카카오톡',
  },
  {
    id: '3',
    name: '삼성패스',
    image: '/images/SamsungPass.png',
    alt: '삼성패스',
  },
  {
    id: '4',
    name: '국민민인증서',
    image: '/images/KBMobileCertificate.png',
    alt: '국민인증서',
  },
  {
    id: '5',
    name: '통신사인증서',
    image: '/images/Pass.png',
    alt: '통신사PASS',
  },
  {
    id: '6',
    name: '네이버',
    image: '/images/Naver.png',
    alt: '네이버',
  },
  {
    id: '7',
    name: '신한인증서',
    image: '/images/ShinhanCertificate.png',
    alt: '신한인증서',
  },
  {
    id: '8',
    name: 'toss',
    image: '/images/Toss.png',
    alt: '토스',
  },
  {
    id: '9',
    name: '뱅크샐러드',
    image: '/images/Banksalad.png',
    alt: '뱅크샐러드',
  },
];

export const TaxCertInput = ({
  formData,
  onSubmit,
  onSuccess,
}: TaxCertInputProps) => {
  const { selectedAddress } = useUserAddressStore();
  const [error, setError] = useState<string | null>(null);
  const [isAuthMethodModalOpen, setIsAuthMethodModalOpen] = useState(false);

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

  // 선택된 주소가 변경되면 주소 정보 업데이트
  const handleAddressChange = () => {
    if (selectedAddress) {
    }
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (field: string, value: string) => {
    setLocalFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 간편인증 방법 선택 핸들러
  const handleAuthMethodSelect = (methodId: string) => {
    setLocalFormData((prev) => ({
      ...prev,
      loginTypeLevel: methodId,
    }));
    setIsAuthMethodModalOpen(false);
  };

  const handleSelectAuthMethod = (methodId: string) => {
    setLocalFormData((prev) => ({
      ...prev,
      loginTypeLevel: methodId,
    }));
  };

  // 모달 닫기 핸들러
  const handleCloseAuthMethodModal = () => {
    setIsAuthMethodModalOpen(false);
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

    if (!localFormData.loginBirthDate.trim()) {
      setError('생년월일을 입력해주세요.');
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

          <Field id='loginBirthDate' label='생년월일' required>
            <TextInput
              value={localFormData.loginBirthDate}
              onChange={(e) =>
                handleInputChange('loginBirthDate', e.target.value)
              }
              placeholder='생년월일 6자리 (YYMMDD)'
              maxLength={6}
            />
          </Field>

          <Field id='phoneNo' label='휴대폰번호' required>
            <TextInput
              value={localFormData.phoneNo}
              onChange={(e) => handleInputChange('phoneNo', e.target.value)}
              placeholder='01012345678'
              mask='phone'
              inputMode='numeric'
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
                      authMethods.find(
                        (m) => m.id === localFormData.loginTypeLevel
                      )?.image || ''
                    }
                    alt={
                      authMethods.find(
                        (m) => m.id === localFormData.loginTypeLevel
                      )?.name || ''
                    }
                    width={24}
                    height={24}
                  />
                  <span>
                    {
                      authMethods.find(
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

      <ConfirmModal
        isOpen={isAuthMethodModalOpen}
        title='간편인증 로그인 구분 선택'
        onCancel={handleCloseAuthMethodModal}
        onConfirm={handleCloseAuthMethodModal}
        confirmText='결정'
        cancelText='취소'
        icon='info'
      >
        <div className={styles.authGrid}>
          {authMethods.map((method) => (
            <div
              key={method.id}
              className={`${styles.authItem} ${
                localFormData.loginTypeLevel === method.id
                  ? styles.authItemSelected
                  : styles.authItemDefault
              }`}
              onClick={() => handleSelectAuthMethod(method.id)}
            >
              <div className={styles.authIconContainer}>
                <Image
                  src={method.image}
                  alt={method.alt}
                  width={48}
                  height={48}
                  className={styles.authIcon}
                />
                <span className={styles.authText}>{method.name}</span>
              </div>
            </div>
          ))}
        </div>
      </ConfirmModal>
    </>
  );
};
