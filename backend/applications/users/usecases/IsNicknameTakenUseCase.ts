import { UserRepository } from '@be/domain/repository/UserRepository';
import { IsNicknameTakenResponseDto } from '@be/applications/users/dtos/IsNicknameTakenResponseDto';

export class IsNicknameTakenUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(nickname: string): Promise<IsNicknameTakenResponseDto> {
    const isTaken = await this.userRepository.isNicknameTaken(nickname);
    return {
      available: !isTaken, // 사용가능여부 매핑
    };
  }
}
