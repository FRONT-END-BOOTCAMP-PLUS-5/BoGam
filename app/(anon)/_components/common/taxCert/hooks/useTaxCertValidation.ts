import { GetTaxCertRequestDto } from '@be/applications/taxCert/dtos/GetTaxCertRequestDto';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const useTaxCertValidation = () => {
  const validateFormData = (formData: GetTaxCertRequestDto): ValidationResult => {
    const errors: string[] = [];

    // 기본 필수 필드 검증
    if (!formData.phoneNo) {
      errors.push('전화번호는 필수입니다.');
    }

    if (!formData.userName) {
      errors.push('사용자 이름은 필수입니다.');
    }

    if (!formData.loginIdentity) {
      errors.push('사용자 주민번호는 필수입니다.');
    }

    // 간편인증 필수 필드 검증
    if (!formData.loginTypeLevel) {
      errors.push('간편인증 로그인 구분은 필수입니다.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  return {
    validateFormData,
  };
};
