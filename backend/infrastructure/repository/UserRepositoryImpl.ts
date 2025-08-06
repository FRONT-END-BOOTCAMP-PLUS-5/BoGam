import { prisma } from '@utils/prisma';
import { UserRepository } from '@be/domain/repository/UserRepository';
import { UserEntity } from '@be/domain/entities/UserEntity';
import { UserInfo } from '@be/applications/user/dtos/UserDto';

export class UserRepositoryImpl implements UserRepository {
  async findByNickname(nickname: string): Promise<UserInfo | null> {
    const user = await prisma.user.findFirst({
      where: { nickname },
      select: { id: true, nickname: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      nickname: user.nickname,
    };
  }

  async findByUserId(userId: string): Promise<UserInfo | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, nickname: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      nickname: user.nickname,
    };
  }

  async create(userData: {
    name?: string;
    nickname?: string;
    username?: string;
    password?: string;
    pinNumber?: string;
    phoneNumber?: string;
  }): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: {
        name: userData.name!,
        nickname: userData.nickname!,
        username: userData.username!,
        password: userData.password!,
        pinNumber: userData.pinNumber!,
        phoneNumber: userData.phoneNumber!,
      },
    });

    return new UserEntity(
      user.id,
      user.name,
      user.nickname,
      user.username,
      user.password,
      user.pinNumber,
      user.phoneNumber
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
      user.phoneNumber
    );
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
