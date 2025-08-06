import { StepResultRepository } from '@be/domain/repository/StepResultRepository';
import { StepResult } from '@be/domain/entities/StepResult';
import { CreateStepResultDto, UpdateStepResultDto, StepResultResponseDto, GetStepResultQueryDto } from '@be/applications/stepResult/dtos/StepResultDto';

export class StepResultUseCase {
  constructor(private stepResultRepository: StepResultRepository) {}

  async getStepResultsByUserAddress(query: GetStepResultQueryDto): Promise<StepResultResponseDto> {
    try {
      const stepResults = await this.stepResultRepository.findByUserAddressId(query.userAddressId);
      
      return new StepResultResponseDto(
        true,
        stepResults,
        undefined,
        '스탭 결과 조회 성공'
      );
    } catch (error) {
      console.error('❌ 스탭 결과 조회 오류:', error);
      return new StepResultResponseDto(
        false,
        undefined,
        error instanceof Error ? error.message : '스탭 결과 조회 중 오류가 발생했습니다.'
      );
    }
  }

  async getStepResultById(id: number): Promise<StepResultResponseDto> {
    try {
      const stepResult = await this.stepResultRepository.findById(id);
      
      if (!stepResult) {
        return new StepResultResponseDto(
          false,
          undefined,
          '해당 스탭 결과를 찾을 수 없습니다.'
        );
      }

      return new StepResultResponseDto(
        true,
        stepResult,
        undefined,
        '스탭 결과 조회 성공'
      );
    } catch (error) {
      console.error('❌ 스탭 결과 조회 오류:', error);
      return new StepResultResponseDto(
        false,
        undefined,
        error instanceof Error ? error.message : '스탭 결과 조회 중 오류가 발생했습니다.'
      );
    }
  }

  async createStepResult(dto: CreateStepResultDto): Promise<StepResultResponseDto> {
    try {
      const stepResult = new StepResult(
        undefined,
        dto.userAddressId,
        dto.stepId,
        dto.mismatch,
        dto.match,
        dto.unchecked,
        new Date()
      );

      const createdStepResult = await this.stepResultRepository.save(stepResult);

      return new StepResultResponseDto(
        true,
        createdStepResult,
        undefined,
        '스탭 결과 생성 성공'
      );
    } catch (error) {
      console.error('❌ 스탭 결과 생성 오류:', error);
      return new StepResultResponseDto(
        false,
        undefined,
        error instanceof Error ? error.message : '스탭 결과 생성 중 오류가 발생했습니다.'
      );
    }
  }

  async updateStepResult(id: number, dto: UpdateStepResultDto): Promise<StepResultResponseDto> {
    try {
      const updatedStepResult = await this.stepResultRepository.update(id, dto);

      return new StepResultResponseDto(
        true,
        updatedStepResult,
        undefined,
        '스탭 결과 수정 성공'
      );
    } catch (error) {
      console.error('❌ 스탭 결과 수정 오류:', error);
      return new StepResultResponseDto(
        false,
        undefined,
        error instanceof Error ? error.message : '스탭 결과 수정 중 오류가 발생했습니다.'
      );
    }
  }

  async deleteStepResult(id: number): Promise<StepResultResponseDto> {
    try {
      await this.stepResultRepository.delete(id);

      return new StepResultResponseDto(
        true,
        undefined,
        undefined,
        '스탭 결과 삭제 성공'
      );
    } catch (error) {
      console.error('❌ 스탭 결과 삭제 오류:', error);
      return new StepResultResponseDto(
        false,
        undefined,
        error instanceof Error ? error.message : '스탭 결과 삭제 중 오류가 발생했습니다.'
      );
    }
  }
} 