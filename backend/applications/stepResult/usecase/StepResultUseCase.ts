import { StepResultRepository } from '@be/domain/repository/StepResultRepository';
import { StepResult } from '@be/domain/entities/StepResult';
import { CreateStepResultDto, UpdateStepResultDto, StepResultResponseDto, GetStepResultQueryDto, StepResultSummaryDto } from '@be/applications/stepResult/dtos/StepResultDto';

export class StepResultUseCase {
  constructor(private stepResultRepository: StepResultRepository) {}

  async getStepResultsByUserAddress(query: GetStepResultQueryDto): Promise<StepResultResponseDto> {
    try {
      const params: Record<string, unknown> = {
        userAddressId: query.userAddressId
      };
      
      const stepResults = await this.stepResultRepository.findByParams(params);
      
      return {
        success: true,
        data: stepResults,
        message: '스탭 결과 조회 성공'
      };
    } catch (error) {
      console.error('❌ 스탭 결과 조회 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '스탭 결과 조회 중 오류가 발생했습니다.'
      };
    }
  }

  async getStepResultsByUserAddressAndMainNum(userAddressId: number, mainNum: number): Promise<StepResultResponseDto> {
    try {
      const params: Record<string, unknown> = {
        userAddressId,
        mainNum
      };
      
      const stepResults = await this.stepResultRepository.findByParams(params);
      
      // 요약 정보 계산
      const summary = this.calculateSummary(stepResults, mainNum);
      
      return {
        success: true,
        data: {
          results: stepResults,
          summary: summary
        },
        message: '스탭 결과 조회 성공'
      };
    } catch (error) {
      console.error('❌ 스탭 결과 조회 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '스탭 결과 조회 중 오류가 발생했습니다.'
      };
    }
  }

  async getStepResultByUserAddressAndMainSubNum(userAddressId: number, mainNum: number, subNum: number): Promise<StepResultResponseDto> {
    try {
      const params: Record<string, unknown> = {
        userAddressId,
        mainNum,
        subNum
      };
      
      const stepResults = await this.stepResultRepository.findByParams(params);
      
      if (stepResults.length === 0) {
        return {
          success: false,
          error: '해당 스탭 결과를 찾을 수 없습니다.'
        };
      }

      return {
        success: true,
        data: stepResults[0], // 단일 결과 반환
        message: '스탭 결과 조회 성공'
      };
    } catch (error) {
      console.error('❌ 스탭 결과 조회 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '스탭 결과 조회 중 오류가 발생했습니다.'
      };
    }
  }

  private calculateSummary(stepResults: StepResult[], mainNum: number): StepResultSummaryDto {
    const summary = stepResults.reduce((acc, result) => ({
      totalMismatch: acc.totalMismatch + (result.mismatch || 0),
      totalMatch: acc.totalMatch + (result.match || 0),
      totalUnchecked: acc.totalUnchecked + (result.unchecked || 0),
      stepCount: acc.stepCount + 1,
      mainNum: mainNum
    }), {
      totalMismatch: 0,
      totalMatch: 0,
      totalUnchecked: 0,
      stepCount: 0,
      mainNum: mainNum
    });

    return summary;
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

      return {
        success: true,
        data: createdStepResult,
        message: '스탭 결과 생성 성공'
      };
    } catch (error) {
      console.error('❌ 스탭 결과 생성 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '스탭 결과 생성 중 오류가 발생했습니다.'
      };
    }
  }

  async updateStepResult(id: number, dto: UpdateStepResultDto): Promise<StepResultResponseDto> {
    try {
      const updatedStepResult = await this.stepResultRepository.update(id, dto);

      return {
        success: true,
        data: updatedStepResult,
        message: '스탭 결과 수정 성공'
      };
    } catch (error) {
      console.error('❌ 스탭 결과 수정 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '스탭 결과 수정 중 오류가 발생했습니다.'
      };
    }
  }

  async upsertStepResult(dto: CreateStepResultDto): Promise<StepResultResponseDto> {
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

      const upsertedStepResult = await this.stepResultRepository.upsert(stepResult);

      return {
        success: true,
        data: upsertedStepResult,
        message: '스탭 결과 생성/수정 성공'
      };
    } catch (error) {
      console.error('❌ 스탭 결과 upsert 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '스탭 결과 생성/수정 중 오류가 발생했습니다.'
      };
    }
  }

  async deleteStepResult(id: number): Promise<StepResultResponseDto> {
    try {
      await this.stepResultRepository.delete(id);

      return {
        success: true,
        message: '스탭 결과 삭제 성공'
      };
    } catch (error) {
      console.error('❌ 스탭 결과 삭제 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '스탭 결과 삭제 중 오류가 발생했습니다.'
      };
    }
  }
} 