import { UserRepository } from '@be/domain/repository/UserRepository';
import { IsUsernameTakenResponseDto } from '@be/applications/users/dtos/IsUsernameTakenResponseDto';

export class IsUsernameTakenUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(username: string): Promise<IsUsernameTakenResponseDto> {
    const isTaken = await this.userRepository.isUsernameTaken(username);
    return {
      available: !isTaken, // 사용가능여부 매핑
    };
  }
}
