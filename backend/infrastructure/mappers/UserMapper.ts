import { User } from '@be/domain/entities/User';

export class UserMapper {
  /**
   * Prisma 데이터를 User 엔티티로 변환합니다.
   */
  static toEntity(data: {
    id: string;
    name?: string | null;
    nickname?: string | null;
    username?: string | null;
    password?: string | null;
    pinNumber?: string | null;
    phoneNumber?: string | null;
  }): User {
    return new User(
      data.id,
      data.name || undefined,
      data.nickname || undefined,
      data.username || undefined,
      data.password || undefined,
      data.pinNumber || undefined,
      data.phoneNumber || undefined
    );
  }

  /**
   * User 엔티티를 Prisma 데이터로 변환합니다.
   */
  static toPrisma(user: User) {
    return {
      id: user.id,
      name: user.name,
      nickname: user.nickname,
      username: user.username,
      password: user.password,
      pinNumber: user.pinNumber,
      phoneNumber: user.phoneNumber,
    };
  }

  /**
   * User 엔티티를 생성용 데이터로 변환합니다 (id 제외).
   */
  static toCreateData(userData: {
    name?: string;
    nickname?: string;
    username?: string;
    password?: string;
    pinNumber?: string;
    phoneNumber?: string;
  }) {
    return {
      name: userData.name,
      nickname: userData.nickname,
      username: userData.username,
      password: userData.password,
      pinNumber: userData.pinNumber,
      phoneNumber: userData.phoneNumber,
    };
  }
}
