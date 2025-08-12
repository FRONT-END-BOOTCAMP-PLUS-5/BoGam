'use client';

import React from 'react';
import Image from 'next/image';
import { GetTaxCertRequestDto } from '@be/applications/taxCert/dtos/GetTaxCertRequestDto';
import styles from '@/(anon)/test/tax-cert/_components/SimpleAuthForm.module.css';
import commonStyles from '@/(anon)/test/tax-cert/_components/Common.module.css';

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
  return (
    <>
      <div className={commonStyles.formGridTwo}>
        <div className={commonStyles.formField}>
          <label className={commonStyles.labelRequired}>사용자 이름</label>
          <input
            type='text'
            name='userName'
            value={formData.userName || ''}
            onChange={onInputChange}
            className={commonStyles.inputRequired}
            required
            placeholder='필수: 사용자 이름'
          />
        </div>
        <div className={commonStyles.formField}>
          <label className={commonStyles.labelRequired}>사용자 주민번호</label>
          <input
            type='text'
            name='loginIdentity'
            value={formData.loginIdentity || ''}
            onChange={onInputChange}
            className={commonStyles.inputRequired}
            required
            placeholder='필수: 사용자 주민번호'
          />
        </div>
      </div>

      <div className={commonStyles.formGridTwo}>
        <div className={commonStyles.formField}>
          <label className={commonStyles.label}>
            주민등록번호 뒷자리 암호화 여부
          </label>
          <select
            name='identityEncYn'
            value={formData.identityEncYn || ''}
            onChange={onInputChange}
            className={commonStyles.select}
          >
            <option value='N'>비암호화</option>
            <option value='Y'>암호화</option>
          </select>
        </div>
        {formData.identityEncYn === 'Y' && (
          <div className={commonStyles.formField}>
            <label className={commonStyles.labelRequired}>생년월일</label>
            <input
              type='text'
              name='loginBirthDate'
              value={formData.loginBirthDate || ''}
              onChange={onInputChange}
              className={commonStyles.inputRequired}
              placeholder='960413'
              required
            />
          </div>
        )}
      </div>

      {/* 간편인증 로그인 구분 - 아이콘 그리드 형태 */}
      <div className={commonStyles.formField}>
        <label className={commonStyles.labelRequired}>
          간편인증 로그인 구분
        </label>
        <div className={styles.simpleAuthGrid}>
          <div
            className={`${styles.simpleAuthItem} ${
              formData.loginTypeLevel === '1'
                ? styles.simpleAuthItemSelected
                : ''
            }`}
            onClick={() => onLoginTypeLevelChange('1')}
          >
            <div className={styles.simpleAuthIcon}>
              <Image
                src='/images/KakaoTalk.png'
                alt='카카오톡'
                width={120}
                height={120}
                className={styles.serviceLogo}
              />
            </div>
            <span className={styles.simpleAuthText}>카카오톡</span>
          </div>

          <div
            className={`${styles.simpleAuthItem} ${
              formData.loginTypeLevel === '3'
                ? styles.simpleAuthItemSelected
                : ''
            }`}
            onClick={() => onLoginTypeLevelChange('3')}
          >
            <div className={styles.simpleAuthIcon}>
              <Image
                src='/images/SamsungPass.png'
                alt='삼성패스'
                width={120}
                height={120}
                className={styles.serviceLogo}
              />
            </div>
            <span className={styles.simpleAuthText}>삼성패스</span>
          </div>

          <div
            className={`${styles.simpleAuthItem} ${
              formData.loginTypeLevel === '4'
                ? styles.simpleAuthItemSelected
                : ''
            }`}
            onClick={() => onLoginTypeLevelChange('4')}
          >
            <div className={styles.simpleAuthIcon}>
              <Image
                src='/images/KBMobileCertificate.png'
                alt='KB모바일인증서'
                width={120}
                height={120}
                className={styles.serviceLogo}
              />
            </div>
            <span className={styles.simpleAuthText}>KB모바일인증서</span>
          </div>

          <div
            className={`${styles.simpleAuthItem} ${
              formData.loginTypeLevel === '5'
                ? styles.simpleAuthItemSelected
                : ''
            }`}
            onClick={() => onLoginTypeLevelChange('5')}
          >
            <div className={styles.simpleAuthIcon}>
              <Image
                src='/images/Pass.png'
                alt='통신사인증서'
                width={120}
                height={120}
                className={styles.serviceLogo}
              />
            </div>
            <span className={styles.simpleAuthText}>통신사인증서</span>
          </div>

          <div
            className={`${styles.simpleAuthItem} ${
              formData.loginTypeLevel === '6'
                ? styles.simpleAuthItemSelected
                : ''
            }`}
            onClick={() => onLoginTypeLevelChange('6')}
          >
            <div className={styles.simpleAuthIcon}>
              <Image
                src='/images/Naver.png'
                alt='네이버'
                width={120}
                height={120}
                className={styles.serviceLogo}
              />
            </div>
            <span className={styles.simpleAuthText}>네이버</span>
          </div>

          <div
            className={`${styles.simpleAuthItem} ${
              formData.loginTypeLevel === '7'
                ? styles.simpleAuthItemSelected
                : ''
            }`}
            onClick={() => onLoginTypeLevelChange('7')}
          >
            <div className={styles.simpleAuthIcon}>
              <Image
                src='/images/ShinhanCertificate.png'
                alt='신한인증서'
                width={120}
                height={120}
                className={styles.serviceLogo}
              />
            </div>
            <span className={styles.simpleAuthText}>신한인증서</span>
          </div>

          <div
            className={`${styles.simpleAuthItem} ${
              formData.loginTypeLevel === '8'
                ? styles.simpleAuthItemSelected
                : ''
            }`}
            onClick={() => onLoginTypeLevelChange('8')}
          >
            <div className={styles.simpleAuthIcon}>
              <Image
                src='/images/Toss.png'
                alt='토스'
                width={120}
                height={120}
                className={styles.serviceLogo}
              />
            </div>
            <span className={styles.simpleAuthText}>toss</span>
          </div>

          <div
            className={`${styles.simpleAuthItem} ${
              formData.loginTypeLevel === '9'
                ? styles.simpleAuthItemSelected
                : ''
            }`}
            onClick={() => onLoginTypeLevelChange('9')}
          >
            <div className={styles.simpleAuthIcon}>
              <Image
                src='/images/Banksalad.png'
                alt='뱅크샐러드'
                width={120}
                height={120}
                className={styles.serviceLogo}
              />
            </div>
            <span className={styles.simpleAuthText}>뱅크샐러드</span>
          </div>
        </div>
      </div>

      {/* 통신사 (통신사인증서 선택 시에만 표시) */}
      {formData.loginTypeLevel === '5' && (
        <div className={commonStyles.formField}>
          <label className={commonStyles.labelRequired}>통신사</label>
          <select
            name='telecom'
            value={formData.telecom || ''}
            onChange={onInputChange}
            className={commonStyles.selectRequired}
            required
          >
            <option value=''>통신사 선택</option>
            <option value='0'>SKT</option>
            <option value='1'>KT</option>
            <option value='2'>LG U+</option>
          </select>
        </div>
      )}

      {/* 요청 식별 아이디 */}
      <div className={commonStyles.formField}>
        <label className={commonStyles.label}>요청 식별 아이디 (선택)</label>
        <input
          type='text'
          name='id'
          value={formData.id || ''}
          onChange={onInputChange}
          className={commonStyles.input}
          placeholder='선택: 요청 식별 아이디'
        />
      </div>

      {/* 전화번호 */}
      <div className={commonStyles.formField}>
        <label className={commonStyles.labelRequired}>전화번호</label>
        <input
          type='text'
          name='phoneNo'
          value={formData.phoneNo || ''}
          onChange={onInputChange}
          className={commonStyles.inputRequired}
          required
          placeholder='필수: 전화번호'
        />
      </div>
    </>
  );
}
