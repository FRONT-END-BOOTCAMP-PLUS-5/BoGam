'use client';

import React, { useState } from 'react';
import { GetTaxCertRequestDto } from '@be/applications/taxCert/dtos/GetTaxCertRequestDto';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import Field from '@/(anon)/_components/common/forms/Field';
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
           {/* 모든 필드를 하나의 컨테이너에 배치 */}
           <div className={styles.gridOne}>
             <Field
               id="proofType"
               label="증명구분"
               required
             >
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
             </Field>

             <Field
               id="submitTargets"
               label="제출처"
               required
             >
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
             </Field>

             <Field
               id="applicationType"
               label="신청 구분"
             >
               <select
                 name='applicationType'
                 value={formData.applicationType || ''}
                 onChange={onInputChange}
                 className={styles.select}
               >
                 <option value='01'>본인</option>
                 <option value='02'>세무대리인</option>
               </select>
             </Field>

             <Field
               id="clientTypeLevel"
               label="의뢰인 구분"
             >
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
             </Field>

             <Field
               id="identityEncYn"
               label="주민등록번호 뒷자리 암호화 여부"
             >
               <select
                 name='identityEncYn'
                 value={formData.identityEncYn || ''}
                 onChange={onInputChange}
               >
                 <option value='N'>비암호화</option>
                 <option value='Y'>암호화</option>
               </select>
             </Field>

             {formData.identityEncYn === 'Y' && (
               <Field
                 id="loginBirthDate"
                 label="생년월일"
                 required
               >
                 <TextInput
                   name='loginBirthDate'
                   value={formData.loginBirthDate || ''}
                   onChange={onInputChange}
                   placeholder='960413'
                   required
                   maxLength={6}
                   inputMode='numeric'
                 />
               </Field>
             )}

             <Field
               id="identity"
               label="사업자번호/주민등록번호"
             >
               <TextInput
                 name='identity'
                 value={formData.identity || ''}
                 onChange={onInputChange}
                 placeholder='사업자번호 또는 주민등록번호'
                 maxLength={13}
                 inputMode='numeric'
               />
             </Field>

             <Field
               id="birthDate"
               label="생년월일"
             >
               <TextInput
                 name='birthDate'
                 value={formData.birthDate || ''}
                 onChange={onInputChange}
                 placeholder='960413'
                 maxLength={6}
                 inputMode='numeric'
               />
             </Field>
           </div>
         </div>
      )}
    </div>
  );
}
