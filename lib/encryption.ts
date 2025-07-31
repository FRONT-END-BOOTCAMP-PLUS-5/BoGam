// CODEF API RSA 암호화 라이브러리
import { loadCodefConfig } from './config';

export interface EncryptionConfig {
  publicKey: string;
}

export class CodefEncryption {
  private config: EncryptionConfig;

  constructor(config?: EncryptionConfig) {
    if (config) {
      this.config = config;
    } else {
      const codefConfig = loadCodefConfig();
      this.config = {
        publicKey: codefConfig.encryption.publicKey,
      };
    }
  }

  /**
   * RSA 공개키로 데이터 암호화
   */
  async encryptWithRSA(data: string): Promise<string> {
    try {
      console.log('🔐 RSA 암호화 시작:', {
        dataLength: data.length,
        hasPublicKey: !!this.config.publicKey,
      });

      if (!this.config.publicKey) {
        throw new Error('공개키가 설정되지 않았습니다.');
      }

      // 브라우저 환경에서 RSA 암호화 수행
      const encryptedData = await this.encryptInBrowser(data);
      
      console.log('✅ RSA 암호화 완료:', {
        originalLength: data.length,
        encryptedLength: encryptedData.length,
      });

      return encryptedData;

    } catch (error) {
      console.error('❌ RSA 암호화 실패:', error);
      throw error;
    }
  }

  /**
   * 브라우저 환경에서 RSA 암호화
   */
  private async encryptInBrowser(data: string): Promise<string> {
    // Web Crypto API를 사용한 RSA 암호화
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // PEM 형식의 공개키를 CryptoKey로 변환
    const publicKey = await this.importPublicKey(this.config.publicKey);
    
    // RSA-OAEP로 암호화
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      } as RsaOaepParams,
      publicKey,
      dataBuffer
    );

    // Base64로 인코딩
    return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
  }

  /**
   * PEM 형식의 공개키를 CryptoKey로 변환
   */
  private async importPublicKey(pemKey: string): Promise<CryptoKey> {
    // PEM 헤더/푸터 제거
    const base64Key = pemKey
      .replace(/-----BEGIN PUBLIC KEY-----/, '')
      .replace(/-----END PUBLIC KEY-----/, '')
      .replace(/\s/g, '');

    // Base64 디코딩
    const binaryKey = atob(base64Key);
    const keyBuffer = new Uint8Array(binaryKey.length);
    for (let i = 0; i < binaryKey.length; i++) {
      keyBuffer[i] = binaryKey.charCodeAt(i);
    }

    // CryptoKey로 가져오기
    return crypto.subtle.importKey(
      'spki',
      keyBuffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['encrypt']
    );
  }

  /**
   * 비밀번호 암호화 (CODEF API 요구사항)
   */
  async encryptPassword(password: string): Promise<string> {
    return this.encryptWithRSA(password);
  }

  /**
   * 인증서 비밀번호 암호화
   */
  async encryptCertPassword(password: string): Promise<string> {
    return this.encryptWithRSA(password);
  }

  /**
   * 세무대리인 관리 비밀번호 암호화
   */
  async encryptManagePassword(password: string): Promise<string> {
    return this.encryptWithRSA(password);
  }

  /**
   * 사용자 비밀번호 암호화
   */
  async encryptUserPassword(password: string): Promise<string> {
    return this.encryptWithRSA(password);
  }
}

// 싱글톤 인스턴스
let encryptionInstance: CodefEncryption | null = null;

/**
 * 암호화 인스턴스 생성 또는 반환
 */
export function createCodefEncryption(config?: EncryptionConfig): CodefEncryption {
  if (!encryptionInstance) {
    encryptionInstance = new CodefEncryption(config);
    console.log('🔐 CODEF 암호화 인스턴스 생성됨');
  }
  return encryptionInstance;
}

/**
 * 기존 암호화 인스턴스 반환
 */
export function getCodefEncryption(): CodefEncryption | null {
  return encryptionInstance;
}

/**
 * 암호화 인스턴스 초기화
 */
export function resetCodefEncryption(): void {
  encryptionInstance = null;
  console.log('🔄 CODEF 암호화 인스턴스 초기화됨');
} 