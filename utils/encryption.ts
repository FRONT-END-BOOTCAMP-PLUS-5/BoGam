import crypto from 'crypto';

// 환경변수에서 암호화 키 가져오기 (없으면 기본값 사용)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here!'; // 32바이트 키
const ALGORITHM = 'aes-256-cbc';

/**
 * 텍스트를 AES-256-CBC로 암호화
 * @param text 암호화할 텍스트
 * @returns 암호화된 텍스트 (IV:암호화된데이터 형태)
 */
export function encrypt(text: string): string {
  try {
    // 32바이트 키 생성 (해시 사용)
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
    
    // 16바이트 IV 생성
    const iv = crypto.randomBytes(16);
    
    // 암호화
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // IV와 암호화된 데이터를 결합 (IV:암호화된데이터)
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('암호화 오류:', error);
    throw new Error('데이터 암호화에 실패했습니다.');
  }
}

/**
 * AES-256-CBC로 암호화된 텍스트를 복호화
 * @param encryptedText 암호화된 텍스트 (IV:암호화된데이터 형태)
 * @returns 복호화된 원본 텍스트
 */
export function decrypt(encryptedText: string): string {
  try {
    // 32바이트 키 생성 (해시 사용)
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
    
    // IV와 암호화된 데이터 분리
    const textParts = encryptedText.split(':');
    if (textParts.length !== 2) {
      throw new Error('잘못된 암호화 데이터 형식입니다.');
    }
    
    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedData = textParts[1];
    
    // 복호화
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('복호화 오류:', error);
    throw new Error('데이터 복호화에 실패했습니다.');
  }
}

/**
 * JSON 객체를 암호화
 * @param obj 암호화할 JSON 객체
 * @returns 암호화된 문자열
 */
export function encryptJson(obj: Record<string, unknown>): string {
  try {
    const jsonString = JSON.stringify(obj);
    return encrypt(jsonString);
  } catch (error) {
    console.error('JSON 암호화 오류:', error);
    throw new Error('JSON 데이터 암호화에 실패했습니다.');
  }
}

/**
 * 암호화된 문자열을 JSON 객체로 복호화
 * @param encryptedText 암호화된 문자열
 * @returns 복호화된 JSON 객체
 */
export function decryptJson(encryptedText: string): Record<string, unknown> {
  try {
    const decryptedString = decrypt(encryptedText);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('JSON 복호화 오류:', error);
    throw new Error('JSON 데이터 복호화에 실패했습니다.');
  }
}

/**
 * 암호화 키 검증 (개발/테스트용)
 */
export function validateEncryption(): boolean {
  try {
    const testData = { test: 'encryption test', number: 123, bool: true };
    const encrypted = encryptJson(testData);
    const decrypted = decryptJson(encrypted);
    
    return JSON.stringify(testData) === JSON.stringify(decrypted);
  } catch (error) {
    console.error('암호화 검증 실패:', error);
    return false;
  }
}