import { UserEntity } from '@be/domain/entities/User';
import { UserInfo } from '@be/applications/users/dtos/UserDto';

export interface UserRepository {
  findByNickname(nickname: string): Promise<UserInfo | null>;
  findByUserId(userId: string): Promise<UserInfo | null>;
  create(userData: {
    name?: string;
    nickname?: string;
    username?: string;
    password?: string;
    pinNumber?: string;
    phoneNumber?: string;
  }): Promise<UserEntity>;
  update(id: string, userData: Partial<UserEntity>): Promise<UserEntity | null>;
  delete(id: string): Promise<boolean>;
}
