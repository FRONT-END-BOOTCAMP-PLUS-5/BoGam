import * as bcrypt from 'bcrypt';

export class PasswordService {
  /**
   * 비밀번호를 해싱합니다.
   * @param password 평문 비밀번호
   * @returns 해싱된 비밀번호
   */
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  /**
   * 비밀번호를 검증합니다.
   * @param password 평문 비밀번호
   * @param hashedPassword 해싱된 비밀번호
   * @returns 검증 결과
   */
  static async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
