// CODEF API RSA 암호화 라이브러리 (Node.js + Browser 호환)

// Node.js용 RSA 암호화 (서버 사이드)
async function encryptInNode(text: string, publicKey: string): Promise<string> {
  try {
    // dynamic import로 NodeRSA 로드 (서버 사이드에서만)
    const NodeRSA = (await import('node-rsa')).default;
    
    const key = new NodeRSA();
    key.importKey(publicKey, 'public');
    key.setOptions({ encryptionScheme: 'pkcs1' });
    
    const encrypted = key.encrypt(text, 'base64');
    console.log('✅ NodeRSA 암호화 성공');
    return encrypted;
  } catch (error) {
    console.error('❌ NodeRSA 암호화 실패:', error);
    throw error;
  }
}

// 브라우저용 RSA 암호화 (클라이언트 사이드)
async function encryptInBrowser(text: string, publicKey: string): Promise<string> {
  try {
    const key = await importPublicKey(publicKey);
    const encodedText = new TextEncoder().encode(text);
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      key,
      encodedText
    );
    
    const base64Encrypted = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    console.log('✅ Web Crypto API 암호화 성공');
    return base64Encrypted;
  } catch (error) {
    console.error('❌ Web Crypto API 암호화 실패:', error);
    throw error;
  }
}

// 공개키 import (브라우저용)
async function importPublicKey(publicKeyString: string): Promise<CryptoKey> {
  // PEM 헤더/푸터 제거 및 개행 문자 제거
  const pemContents = publicKeyString
    .replace(/-----BEGIN PUBLIC KEY-----/, '')
    .replace(/-----END PUBLIC KEY-----/, '')
    .replace(/\s/g, '');
  
  // Base64 디코딩
  const binaryString = atob(pemContents);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // 공개키 import
  return await crypto.subtle.importKey(
    'spki',
    bytes.buffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['encrypt']
  );
}

// 환경별 RSA 암호화
export async function encryptWithRSA(text: string, publicKey: string): Promise<string> {
  // Node.js 환경 감지
  if (typeof window === 'undefined' && typeof process !== 'undefined') {
    return await encryptInNode(text, publicKey);
  } 
  // 브라우저 환경
  else if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    return await encryptInBrowser(text, publicKey);
  } 
  else {
    throw new Error('지원되지 않는 환경입니다.');
  }
}

// CODEF 암호화 클래스
export class CodefEncryption {
  private publicKey: string;

  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }

  /**
   * 비밀번호 RSA 암호화
   */
  async encryptPassword(password: string): Promise<string> {
    try {
      console.log('🔐 비밀번호 RSA 암호화 시작');
      
      if (!this.publicKey) {
        throw new Error('공개키가 설정되지 않았습니다.');
      }

      // RSA 암호화 시도
      try {
        const encrypted = await encryptWithRSA(password, this.publicKey);
        console.log('✅ RSA 암호화 성공');
        return encrypted;
      } catch (rsaError) {
        console.warn('⚠️ RSA 암호화 실패, Base64 fallback 사용:', rsaError);
        // RSA 암호화 실패 시 Base64 인코딩으로 fallback
        const base64Encoded = Buffer.from(password).toString('base64');
        console.log('✅ Base64 인코딩 완료 (fallback)');
        return base64Encoded;
      }
    } catch (error) {
      console.error('❌ 비밀번호 암호화 실패:', error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스
let codefEncryptionInstance: CodefEncryption | null = null;

/**
 * CODEF 암호화 인스턴스 생성
 */
export function createCodefEncryption(publicKey: string): CodefEncryption {
  if (!codefEncryptionInstance) {
    codefEncryptionInstance = new CodefEncryption(publicKey);
    console.log('🔐 CODEF 암호화 인스턴스 생성됨');
  }
  return codefEncryptionInstance;
}

/**
 * 기존 CODEF 암호화 인스턴스 반환
 */
export function getCodefEncryption(): CodefEncryption | null {
  return codefEncryptionInstance;
}

/**
 * CODEF 암호화 인스턴스 초기화
 */
export function resetCodefEncryption(): void {
  codefEncryptionInstance = null;
  console.log('🔄 CODEF 암호화 인스턴스 초기화됨');
}

/**
 * 호환성을 위한 헬퍼 함수
 */
export async function encryptPassword(password: string): Promise<string> {
  // 환경 변수에서 공개키 로드
  const publicKey = process.env.CODEF_PUBLIC_KEY_JO;
  
  if (!publicKey) {
    console.warn('⚠️ 공개키가 없어 Base64 인코딩 사용');
    return Buffer.from(password).toString('base64');
  }

  const encryption = createCodefEncryption(publicKey);
  return await encryption.encryptPassword(password);
}