import { UserRepository } from '@be/domain/repository/UserRepository';

export class IsNicknameTakenUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(nickname: string): Promise<{ isTaken: boolean }> {
    const isTaken = await this.userRepository.isNicknameTaken(nickname);
    return { isTaken };
  }
}
