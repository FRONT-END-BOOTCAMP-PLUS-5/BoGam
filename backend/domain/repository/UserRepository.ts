import { UserEntity } from '@be/domain/entities/User';

export interface UserRepository {
  findByNickname(nickname: string): Promise<UserEntity | null>;
  findByUserId(userId: string): Promise<UserEntity | null>;
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
  deleteByNickname(nickname: string): Promise<boolean>;
  isNicknameTaken(nickname: string): Promise<boolean>;
}
