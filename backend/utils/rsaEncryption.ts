import NodeRSA from 'node-rsa';

/**
 * RSA 암호화 유틸리티 클래스
 */
export class RSAEncryption {
  private static rsaKey: NodeRSA | null = null;

  /**
   * RSA 키 초기화
   */
  private static initializeRSA(): NodeRSA {
    if (!this.rsaKey) {
      const publicKey = process.env.CODEF_PUBLIC_KEY_NO;
      if (!publicKey) {
        throw new Error('CODEF_PUBLIC_KEY_NO가 설정되지 않았습니다.');
      }
      this.rsaKey = new NodeRSA(publicKey, 'pkcs8-public');
      this.rsaKey.setOptions({ encryptionScheme: 'pkcs1' });
    }
    return this.rsaKey;
  }

  /**
   * RSA 암호화 수행
   * @param data 암호화할 데이터
   * @returns 암호화된 데이터
   */
  static encryptWithRSA(data: string): string {
    try {
      const rsa = this.initializeRSA();
      return rsa.encrypt(data, 'base64');
    } catch (error) {
      console.error('RSA 암호화 실패:', error);
      throw new Error('RSA 암호화에 실패했습니다.');
    }
  }

  /**
   * 비밀번호 암호화 (RSA 우선, 실패시 Base64)
   * @param password 암호화할 비밀번호
   * @returns 암호화된 비밀번호
   */
  static encryptPassword(password: string): string {
    try {
      return this.encryptWithRSA(password);
    } catch (error) {
      console.warn('RSA 암호화 실패, Base64로 대체:', error);
      return Buffer.from(password).toString('base64');
    }
  }

  /**
   * 강제 RSA 암호화 (부동산등기부등본 API용)
   * @param password 암호화할 비밀번호
   * @returns RSA 암호화된 비밀번호
   */
  static encryptWithRSAForce(password: string): string {
    return this.encryptWithRSA(password);
  }
}

// 기존 함수들과의 호환성을 위한 래퍼 함수들
let rsaEncryptionInstance: RSAEncryption | null = null;

/**
 * RSA 암호화 인스턴스 획득 (기존 호환성)
 * @returns RSAEncryption 인스턴스
 */
export function getRSAEncryption(): RSAEncryption {
  if (!rsaEncryptionInstance) {
    rsaEncryptionInstance = new RSAEncryption();
  }
  return rsaEncryptionInstance;
}

/**
 * 비밀번호 암호화 헬퍼 함수 (기존 호환성)
 * @param password 평문 비밀번호
 * @returns 암호화된 비밀번호
 */
export function encryptPassword(password: string): string {
  return RSAEncryption.encryptPassword(password);
}
