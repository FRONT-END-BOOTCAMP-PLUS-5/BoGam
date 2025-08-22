'use client';

import React, { useState } from 'react';
import { GetTaxCertRequestDto } from '@be/applications/taxCert/dtos/GetTaxCertRequestDto';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import { styles } from './CommonFields.styles';

interface CommonFieldsProps {
  formData: GetTaxCertRequestDto;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function CommonFields({
  formData,
  onInputChange,
}: CommonFieldsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.accordionContainer}>
      {/* 아코디언 헤더 */}
      <button
        type="button"
        onClick={toggleExpanded}
        className={styles.accordionHeader}
        aria-expanded={isExpanded}
      >
        <span className={styles.accordionTitle}>📋 추가 설정</span>
        <span className={styles.accordionIcon}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {/* 아코디언 콘텐츠 */}
      {isExpanded && (
        <div className={styles.accordionContent}>
          {/* 공통 필드 */}
          <div className={styles.gridTwo}>
            <div className={styles.field}>
              <label className={styles.labelRequired}>증명구분</label>
              <select
                name='proofType'
                value={formData.proofType || ''}
                onChange={onInputChange}
                className={styles.selectRequired}
                required
              >
                <option value='B0006'>대금수령</option>
                <option value='B0007'>기타</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.labelRequired}>제출처</label>
              <select
                name='submitTargets'
                value={formData.submitTargets || ''}
                onChange={onInputChange}
                className={styles.selectRequired}
                required
              >
                <option value='04'>금융기관</option>
                <option value='05'>기타</option>
              </select>
            </div>
          </div>

          {/* 신청구분 및 의뢰인구분 */}
          <div className={styles.gridTwo}>
            <div className={styles.field}>
              <label className={styles.label}>신청 구분</label>
              <select
                name='applicationType'
                value={formData.applicationType || ''}
                onChange={onInputChange}
                className={styles.select}
              >
                <option value='01'>본인</option>
                <option value='02'>세무대리인</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>의뢰인 구분</label>
              <select
                name='clientTypeLevel'
                value={formData.clientTypeLevel || ''}
                onChange={onInputChange}
                className={styles.select}
              >
                <option value='1'>개인</option>
                <option value='2'>개인 단체</option>
                <option value='3'>사업자</option>
              </select>
            </div>
          </div>

          {/* 사업자번호/주민등록번호 및 생년월일 */}
          <div className={styles.gridTwo}>
            <div className={styles.field}>
              <label className={styles.label}>
                사업자번호/주민등록번호
              </label>
              <TextInput
                name='identity'
                value={formData.identity || ''}
                onChange={onInputChange}
                placeholder='사업자번호 또는 주민등록번호'
                maxLength={13}
                inputMode='numeric'
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>생년월일</label>
              <TextInput
                name='birthDate'
                value={formData.birthDate || ''}
                onChange={onInputChange}
                placeholder='960413'
                maxLength={6}
                inputMode='numeric'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
