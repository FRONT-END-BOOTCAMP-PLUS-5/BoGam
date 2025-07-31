'use client';

import React from 'react';
import { TaxCertRequest } from '@/backend/tax-cert/application/dtos/TaxCertDto';
import commonStyles from './Common.module.css';

interface CertificateLoginFormProps {
  formData: TaxCertRequest;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  loginType: string;
}

export default function CertificateLoginForm({ 
  formData, 
  onInputChange, 
  loginType 
}: CertificateLoginFormProps) {
  return (
    <>
      {(loginType === '0' || loginType === '2') && (
        <div className={commonStyles.formField}>
          <label className={commonStyles.labelRequired}>인증서 구분</label>
          <select
            name="certType"
            value={formData.certType || ''}
            onChange={onInputChange}
            className={commonStyles.selectRequired}
            required
          >
            <option value="">인증서 구분 선택</option>
            <option value="1">기본인증서(der/key)</option>
            <option value="2">금융인증서</option>
            <option value="pfx">pfx 인증서</option>
          </select>
        </div>
      )}
      {(formData.certType === '1' || formData.certType === 'pfx') && (
        <>
          <div className={commonStyles.formField}>
            <label className={commonStyles.labelRequired}>인증서 der/pfx 파일</label>
            <textarea
              name="certFile"
              value={formData.certFile || ''}
              onChange={onInputChange}
              className={commonStyles.inputRequired}
              required
              placeholder="필수: 인증서 der 또는 pfx 파일(Base64)"
            />
          </div>
          {formData.certType === '1' && (
            <div className={commonStyles.formField}>
              <label className={commonStyles.labelRequired}>인증서 key 파일</label>
              <textarea
                name="keyFile"
                value={formData.keyFile || ''}
                onChange={onInputChange}
                className={commonStyles.inputRequired}
                required
                placeholder="필수: 인증서 key 파일(Base64)"
              />
            </div>
          )}
          <div className={commonStyles.formField}>
            <label className={commonStyles.labelRequired}>인증서 비밀번호 (RSA암호화)</label>
            <input
              type="password"
              name="certPassword"
              value={formData.certPassword || ''}
              onChange={onInputChange}
              className={commonStyles.inputRequired}
              required
              placeholder="필수: 인증서 비밀번호 (RSA암호화)"
            />
          </div>
        </>
      )}
      {formData.certType === '2' && (
        <div className={commonStyles.formField}>
          <label className={commonStyles.labelRequired}>요청 식별 아이디</label>
          <input
            type="text"
            name="id"
            value={formData.id || ''}
            onChange={onInputChange}
            className={commonStyles.inputRequired}
            required
            placeholder="필수: 요청 식별 아이디"
          />
        </div>
      )}
      {loginType === '0' && (
        <>
          <div className={commonStyles.formField}>
            <label className={commonStyles.label}>세무대리인 관리번호 (선택)</label>
            <input
              type="text"
              name="manageNo"
              value={formData.manageNo || ''}
              onChange={onInputChange}
              className={commonStyles.input}
              placeholder="선택: 세무대리인 관리번호"
            />
          </div>
          <div className={commonStyles.formField}>
            <label className={commonStyles.label}>세무대리인 관리 비밀번호 (RSA암호화, 선택)</label>
            <input
              type="password"
              name="managePassword"
              value={formData.managePassword || ''}
              onChange={onInputChange}
              className={commonStyles.input}
              placeholder="선택: 세무대리인 관리 비밀번호 (RSA암호화)"
            />
          </div>
        </>
      )}
    </>
  );
} 