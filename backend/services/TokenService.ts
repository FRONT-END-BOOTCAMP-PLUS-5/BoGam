import * as jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  username?: string;
  name?: string;
}

export class TokenService {
  private static readonly secret = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly expiresIn = '24h';

  /**
   * JWT 토큰을 생성합니다.
   * @param payload 토큰에 포함할 데이터
   * @returns JWT 토큰
   */
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  /**
   * JWT 토큰을 검증하고 디코딩합니다.
   * @param token JWT 토큰
   * @returns 디코딩된 토큰 데이터 또는 null
   */
  static verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
