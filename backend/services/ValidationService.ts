export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationService {
  /**
   * 회원가입 요청 데이터를 검증합니다.
   */
  static validateRegisterRequest(data: {
    name?: string;
    nickname: string; // 필수 필드로 변경
    username?: string;
    password?: string;
    pinNumber?: string;
    phoneNumber?: string;
  }): ValidationResult {
    const errors: string[] = [];

    if (!data.name) {
      errors.push('이름은 필수입니다.');
    }

    if (!data.nickname) {
      errors.push('닉네임은 필수입니다.');
    }

    if (!data.username) {
      errors.push('사용자명은 필수입니다.');
    }

    if (!data.password && !data.pinNumber) {
      errors.push('비밀번호 또는 PIN 번호 중 하나는 필수입니다.');
    }

    if (!data.phoneNumber) {
      errors.push('전화번호는 필수입니다.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
