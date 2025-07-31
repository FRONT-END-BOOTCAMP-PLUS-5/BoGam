'use client';

import React from 'react';
import { TaxCertRequest } from '@/backend/tax-cert/application/dtos/TaxCertDto';
import commonStyles from './Common.module.css';

interface IdLoginFormProps {
  formData: TaxCertRequest;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function IdLoginForm({ formData, onInputChange }: IdLoginFormProps) {
  return (
    <>
      <div className={commonStyles.formGridTwo}>
        <div className={commonStyles.formField}>
          <label className={commonStyles.labelRequired}>아이디</label>
          <input
            type="text"
            name="userId"
            value={formData.userId || ''}
            onChange={onInputChange}
            className={commonStyles.inputRequired}
            required
            placeholder="필수: 아이디"
          />
        </div>
        <div className={commonStyles.formField}>
          <label className={commonStyles.labelRequired}>비밀번호 (RSA암호화)</label>
          <input
            type="password"
            name="userPassword"
            value={formData.userPassword || ''}
            onChange={onInputChange}
            className={commonStyles.inputRequired}
            required
            placeholder="필수: 비밀번호 (RSA암호화)"
          />
        </div>
      </div>
    </>
  );
} 