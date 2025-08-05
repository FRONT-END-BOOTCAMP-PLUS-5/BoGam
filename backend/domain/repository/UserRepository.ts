import { User } from '@be/domain/entities/User';

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(userData: {
    name?: string;
    nickname?: string;
    username?: string;
    password?: string;
    pinNumber?: string;
    phoneNumber?: string;
  }): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
