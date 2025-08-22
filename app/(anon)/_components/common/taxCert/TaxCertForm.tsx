'use client';

import React from 'react';
import { GetTaxCertRequestDto } from '@be/applications/taxCert/dtos/GetTaxCertRequestDto';
import { styles } from './TaxCert.styles';
import Button from '@/(anon)/_components/common/button/Button';
import SimpleAuthForm from './SimpleAuthForm';
import CommonFields from './CommonFields';

interface TaxCertFormProps {
  formData: GetTaxCertRequestDto;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onLoginTypeLevelChange: (level: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

export default function TaxCertForm({
  formData,
  onInputChange,
  onLoginTypeLevelChange,
  onSubmit,
  isLoading,
  error,
}: TaxCertFormProps) {
  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>📄 납세증명서 발급</h2>

      <form onSubmit={onSubmit} className={styles.form}>
        {/* 로그인 타입별 필드 */}
        <SimpleAuthForm
          formData={formData}
          onInputChange={onInputChange}
          onLoginTypeLevelChange={onLoginTypeLevelChange}
          loginType={formData.loginType}
        />

        {/* 공통 필드 */}
        <CommonFields
          formData={formData}
          onInputChange={onInputChange}
        />

        <div className={styles.buttonContainer}>
          <Button
            type='submit'
            variant='primary'
            isLoading={isLoading}
            disabled={isLoading}
          >
            납세증명서 발급
          </Button>
        </div>
      </form>

      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}
    </div>
  );
}
