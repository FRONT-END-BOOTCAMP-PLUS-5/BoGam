'use client';

import React, { useState } from 'react';
import { styles } from '@/(anon)/_components/common/taxCert/TaxCert.styles';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { useTaxCertValidation } from './hooks/useTaxCertValidation';
import { useTaxCertApi } from './hooks/useTaxCertApi';
import { useTaxCertTwoWay } from './hooks/useTaxCertTwoWay';
import { useTaxCertHandlers } from './hooks/useTaxCertHandlers';
import TaxCertForm from './TaxCertForm';
import { GetTaxCertRequestDto } from '@be/applications/taxCert/dtos/GetTaxCertRequestDto';

export default function TaxCert() {
  const [formData, setFormData] = useState<GetTaxCertRequestDto>({
    organization: '0001',
    loginType: '6', // 비회원 간편인증
    loginTypeLevel: '1', // 카카오톡
    phoneNo: '', // 필수
    userName: '', // 필수
    loginIdentity: '', // 필수 (주민번호 13자리)
    loginBirthDate: '', // 생년월일 6자리
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // 세션/다건 처리용
    isIdentityViewYN: '1',
    isAddrViewYn: '0',
    proofType: 'B0006',
    submitTargets: '04',
    applicationType: '01',
    clientTypeLevel: '1',
    identity: '',
    birthDate: '',
    originDataYN: '0',
    originDataYN1: '1',
  });

  // 커스텀 훅들 사용
  const { validateFormData } = useTaxCertValidation();
  const { isLoading, error, response, setError, submitTaxCert, submitTwoWayAuth } = useTaxCertApi();
  const { showSimpleAuthModal, setShowSimpleAuthModal, handleFirstRequestComplete } = useTaxCertTwoWay();
  
  const { handleInputChange, handleLoginTypeLevelChange, handleSubmit, handleSimpleAuthApprove, handleSimpleAuthCancel } = useTaxCertHandlers(
    formData,
    setFormData,
    submitTaxCert,
    submitTwoWayAuth,
    handleFirstRequestComplete,
    setShowSimpleAuthModal,
    validateFormData,
    setError
  );

  return (
    <div className={styles.container}>
      {/* 입력 폼 */}
      <TaxCertForm
        formData={formData}
        onInputChange={handleInputChange}
        onLoginTypeLevelChange={handleLoginTypeLevelChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />

      {/* 간편인증 추가인증 UI */}
      <ConfirmModal
        isOpen={showSimpleAuthModal}
        onConfirm={handleSimpleAuthApprove}
        onCancel={handleSimpleAuthCancel}
        title="🔐 간편인증 추가인증"
        confirmText="✅ 승인"
        cancelText="❌ 취소"
        icon="info"
        isLoading={isLoading}
      >
        <div className="space-y-3">
          <p>📱 모바일에서 카카오 인증을 완료해주세요.</p>
          <p>✅ 인증 완료 후 아래 버튼을 클릭하여 승인해주세요.</p>
          <p className="text-sm text-gray-600">
            * 4분 30초 내에 승인/취소를 완료해주세요.
          </p>
        </div>
      </ConfirmModal>
    </div>
  );
}
