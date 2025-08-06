import { User } from '@be/domain/entities/User';
import { UserRepository } from '@be/domain/repository/UserRepository';
import { UserMapper } from '@be/infrastructure/mappers/UserMapper';
import { prisma } from '@utils/prisma';

export class UserRepositoryImpl implements UserRepository {
  private prisma: typeof prisma;

  constructor(prismaInstance: typeof prisma) {
    this.prisma = prismaInstance;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { username },
    });
    return user ? UserMapper.toEntity(user) : null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { phoneNumber },
    });
    return user ? UserMapper.toEntity(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? UserMapper.toEntity(user) : null;
  }

  async create(userData: {
    name: string;
    nickname: string;
    username: string;
    password: string;
    pinNumber: string;
    phoneNumber: string;
  }): Promise<User> {
    const user = await this.prisma.user.create({
      data: UserMapper.toCreateData(userData),
    });
    return UserMapper.toEntity(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: userData.name,
        nickname: userData.nickname,
        username: userData.username,
        password: userData.password,
        pinNumber: userData.pinNumber,
        phoneNumber: userData.phoneNumber,
      },
    });
    return user ? UserMapper.toEntity(user) : null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error: unknown) {
      console.error('User delete error:', error);
      return false;
    }
  }
}
