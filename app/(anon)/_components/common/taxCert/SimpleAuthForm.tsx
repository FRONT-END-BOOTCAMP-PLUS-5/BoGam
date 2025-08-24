'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GetTaxCertRequestDto } from '@be/applications/taxCert/dtos/GetTaxCertRequestDto';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import PasswordInput from '@/(anon)/_components/common/forms/PasswordInput';
import Button from '@/(anon)/_components/common/button/Button';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import Field from '@/(anon)/_components/common/forms/Field';
import { styles } from './SimpleAuthForm.styles';

// 간편인증 방법 데이터
const authMethods = [
  {
    id: '1',
    name: '카카오톡',
    image: '/images/KakaoTalk.png',
    alt: '카카오톡'
  },
  {
    id: '3',
    name: '삼성패스',
    image: '/images/SamsungPass.png',
    alt: '삼성패스'
  },
  {
    id: '4',
    name: '국민민인증서',
    image: '/images/KBMobileCertificate.png',
    alt: '국민인증서'
  },
  {
    id: '5',
    name: '통신사인증서',
    image: '/images/Pass.png',
    alt: '통신사PASS'
  },
  {
    id: '6',
    name: '네이버',
    image: '/images/Naver.png',
    alt: '네이버'
  },
  {
    id: '7',
    name: '신한인증서',
    image: '/images/ShinhanCertificate.png',
    alt: '신한인증서'
  },
  {
    id: '8',
    name: 'toss',
    image: '/images/Toss.png',
    alt: '토스'
  },
  {
    id: '9',
    name: '뱅크샐러드',
    image: '/images/Banksalad.png',
    alt: '뱅크샐러드'
  }
];

interface SimpleAuthFormProps {
  formData: GetTaxCertRequestDto;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onLoginTypeLevelChange: (level: string) => void;
  loginType: string;
}

export default function SimpleAuthForm({
  formData,
  onInputChange,
  onLoginTypeLevelChange,
}: SimpleAuthFormProps) {
  const [isAuthMethodModalOpen, setIsAuthMethodModalOpen] = useState(false);

  const handleOpenAuthMethodModal = () => {
    setIsAuthMethodModalOpen(true);
  };

  const handleCloseAuthMethodModal = () => {
    setIsAuthMethodModalOpen(false);
  };

  const handleSelectAuthMethod = (methodId: string) => {
    onLoginTypeLevelChange(methodId);
    setIsAuthMethodModalOpen(false);
  };

  // 선택된 인증 방법 정보 가져오기
  const selectedMethod = authMethods.find(method => method.id === formData.loginTypeLevel);

  return (
    <>
      <Field
        id="userName"
        label="사용자 이름"
        required
      >
        <TextInput
          name='userName'
          value={formData.userName || ''}
          onChange={onInputChange}
          required
          placeholder='필수: 사용자 이름'
        />
      </Field>

      <Field
        id="loginIdentity"
        label="사용자 주민번호"
        required
      >
        <PasswordInput
          id='loginIdentity'
          name='loginIdentity'
          value={formData.loginIdentity || ''}
          onChange={onInputChange}
          required
          placeholder='필수: 사용자 주민번호'
          maxLength={13}
        />
      </Field>



      {/* 간편인증 로그인 구분 - 모달 버튼 */}
      <div className={`${styles.mt6} ${styles.spaceY3}`}>
        <Field
          id="loginTypeLevel"
          label="간편인증 로그인 구분"
          required
        >
          <Button
            variant="secondary"
            fullWidth
            onClick={handleOpenAuthMethodModal}
            className={styles.authMethodButton}
          >
            {selectedMethod ? (
              <div className={styles.selectedAuthMethod}>
                <Image
                  src={selectedMethod.image}
                  alt={selectedMethod.alt}
                  width={24}
                  height={24}
                  className={styles.authIconSmall}
                />
                <span className={styles.selectedAuthText}>{selectedMethod.name}</span>
              </div>
            ) : (
              <span className={styles.placeholderText}>간편인증 방법을 선택해주세요</span>
            )}
            <span className={styles.dropdownArrow}>▼</span>
          </Button>
        </Field>
      </div>

      {/* 통신사 (통신사인증서 선택 시에만 표시) */}
      {formData.loginTypeLevel === '5' && (
        <div className={`${styles.mt4} ${styles.spaceY3}`}>
          <Field
            id="telecom"
            label="통신사"
            required
          >
            <select
              name='telecom'
              value={formData.telecom || ''}
              onChange={onInputChange}
              required
            >
              <option value=''>통신사 선택</option>
              <option value='0'>SKT</option>
              <option value='1'>KT</option>
              <option value='2'>LG U+</option>
            </select>
          </Field>
        </div>
      )}

      {/* 전화번호 */}
      <div className={`${styles.mt4} ${styles.spaceY3}`}>
        <Field
          id="phoneNo"
          label="전화번호"
          required
        >
          <TextInput
            name='phoneNo'
            value={formData.phoneNo || ''}
            onChange={onInputChange}
            required
            placeholder='필수: 전화번호'
            mask='phone'
          />
        </Field>
      </div>

      {/* 간편인증 방법 선택 모달 */}
      <ConfirmModal
        isOpen={isAuthMethodModalOpen}
        title="간편인증 로그인 구분 선택"
        onCancel={handleCloseAuthMethodModal}
        confirmText="닫기"
        cancelText="취소"
        icon="info"
        onConfirm={handleCloseAuthMethodModal}
      >
        <div className={styles.authGrid}>
          {authMethods.map((method) => (
            <div
              key={method.id}
              className={`${styles.authItem} ${
                formData.loginTypeLevel === method.id
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
}
