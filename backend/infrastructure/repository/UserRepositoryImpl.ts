import { prisma } from '@utils/prisma';
import { UserRepository } from '@be/domain/repository/UserRepository';
import { UserEntity } from '@be/domain/entities/User';

export class UserRepositoryImpl implements UserRepository {
  async findByNickname(nickname: string): Promise<UserEntity | null> {
    const user = await prisma.user.findFirst({
      where: { nickname },
      select: {
        id: true,
        name: true,
        nickname: true,
        username: true,
        password: true,
        pinNumber: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return null;

    return new UserEntity(
      user.id,
      user.name,
      user.nickname,
      user.username,
      user.password,
      user.pinNumber,
      user.phoneNumber,
      user.createdAt,
      user.updatedAt
    );
  }

  async findByUserId(userId: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        nickname: true,
        username: true,
        password: true,
        pinNumber: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return null;

    return new UserEntity(
      user.id,
      user.name,
      user.nickname,
      user.username,
      user.password,
      user.pinNumber,
      user.phoneNumber,
      user.createdAt,
      user.updatedAt
    );
  }

  async create(userData: {
    name: string;
    nickname: string;
    username: string;
    password: string;
    pinNumber: string;
    phoneNumber: string;
  }): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: userData,
    });

    return new UserEntity(
      user.id,
      user.name,
      user.nickname,
      user.username,
      user.password,
      user.pinNumber,
      user.phoneNumber,
      user.createdAt,
      user.updatedAt
    );
  }

  async update(
    id: string,
    userData: Partial<UserEntity>
  ): Promise<UserEntity | null> {
    const user = await prisma.user.update({
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

    if (!user) return null;

    return new UserEntity(
      user.id,
      user.name,
      user.nickname,
      user.username,
      user.password,
      user.pinNumber,
      user.phoneNumber,
      user.createdAt,
      user.updatedAt
    );
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteByNickname(nickname: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { nickname },
      });
      return true;
    } catch {
      return false;
    }
  }

  async isNicknameTaken(nickname: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { nickname },
    });
    return !!user;
  }
}
