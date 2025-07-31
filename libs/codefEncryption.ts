import { loadCodefConfig, validateCodefConfig } from './codefEnvironment';

export async function encryptWithRSA(text: string, publicKey: string): Promise<string> {
  try {
    const NodeRSA = (await import('node-rsa')).default;
    
    const key = new NodeRSA();
    key.importKey(publicKey, 'public');
    key.setOptions({ encryptionScheme: 'pkcs1' });
    
    const encrypted = key.encrypt(text, 'base64');
    console.log('✅ RSA 암호화 성공');
    return encrypted;
  } catch (error) {
    console.error('❌ RSA 암호화 실패:', error);
    throw new Error(`RSA 암호화 실패: ${error}`);
  }
}

/**
 * CODEF 암호화 서비스 클래스
 */
export class CodefEncryption {
  private publicKey: string;

  constructor(publicKey: string) {
    this.publicKey = publicKey || process.env.CODEF_PUBLIC_KEY_JO || '';
  }

  /**
   * 비밀번호 암호화
   * RSA 암호화를 시도하고, 실패 시 Base64 인코딩으로 fallback
   */
  async encryptPassword(password: string): Promise<string> {
    if (!this.publicKey) {
      throw new Error('공개키가 설정되지 않았습니다.');
    }

    try {
      return await encryptWithRSA(password, this.publicKey);
    } catch (error) {
      console.warn('⚠️ RSA 암호화 실패, Base64 fallback 사용');
      return Buffer.from(password).toString('base64');
    }
  }
}

// 싱글톤 인스턴스
let codefEncryptionInstance: CodefEncryption | null = null;

/**
 * codefEnvironment에서 CODEF 공개키를 로드
 */
function loadCodefPublicKey(): string {
  const config = loadCodefConfig();
  const validation = validateCodefConfig(config);
  
  if (!validation.isValid) {
    throw new Error(`CODEF 설정 검증 실패: ${validation.errors.join(', ')}`);
  }
  
  return config.encryption.publicKey;
}

/**
 * CODEF 암호화 인스턴스 생성 또는 반환 (환경변수 자동 로드)
 */
export function createCodefEncryption(): CodefEncryption {
  if (!codefEncryptionInstance) {
    const publicKey = loadCodefPublicKey();
    codefEncryptionInstance = new CodefEncryption(publicKey);
    console.log('🔐 CODEF 암호화 싱글톤 인스턴스 생성됨');
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
  console.log('🔄 CODEF 암호화 싱글톤 인스턴스 초기화됨');
}

/**
 * 환경 변수에서 공개키를 로드하여 비밀번호 암호화
 * @param password 암호화할 비밀번호
 * @returns 암호화된 비밀번호
 */
export async function encryptPassword(password: string): Promise<string> {
  const encryption = createCodefEncryption();
  return await encryption.encryptPassword(password);
}