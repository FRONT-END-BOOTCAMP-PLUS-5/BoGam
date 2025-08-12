import { StepResultRepository } from '@be/domain/repository/StepResultRepository';
import { StepResultEntity } from '@be/domain/entities/StepResult';
import {
  CreateStepResultDto,
  StepResultResponseDto,
  StepResultSummaryDto,
} from '@be/applications/stepResults/dtos/StepResultDto';

export class StepResultUsecase {
  constructor(private stepResultRepository: StepResultRepository) {}

  async getStepResults(
    userAddressId: number,
    mainNum?: number,
    subNum?: number
  ): Promise<StepResultResponseDto> {
    try {
      const params: Record<string, unknown> = { userAddressId };

      if (mainNum) {
        params.mainNum = mainNum;
      }

      if (subNum) {
        params.subNum = subNum;
      }

      const stepResults = await this.stepResultRepository.findByParams(params);

      // mainNum만 있는 경우 요약 정보 계산
      if (mainNum && !subNum) {
        const summary = this.calculateSummary(stepResults, mainNum);
        return {
          success: true,
          data: {
            results: stepResults,
            summary: summary,
          },
          message: '스탭 결과 조회 성공',
        };
      }

      // subNum도 있는 경우 단일 결과 반환
      if (mainNum && subNum) {
        if (stepResults.length === 0) {
          return {
            success: false,
            error: '해당 스탭 결과를 찾을 수 없습니다.',
          };
        }
        return {
          success: true,
          data: stepResults[0],
          message: '스탭 결과 조회 성공',
        };
      }

      // 기본 조회 (userAddressId만)
      return {
        success: true,
        data: stepResults,
        message: '스탭 결과 조회 성공',
      };
    } catch (error) {
      console.error('❌ 스탭 결과 조회 오류:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '스탭 결과 조회 중 오류가 발생했습니다.',
      };
    }
  }

  private calculateSummary(
    stepResults: StepResultEntity[],
    mainNum: number
  ): StepResultSummaryDto {
    const summary = stepResults.reduce(
      (acc: StepResultSummaryDto, result: StepResultEntity) => ({
        totalMismatch: acc.totalMismatch + (result.mismatch || 0),
        totalMatch: acc.totalMatch + (result.match || 0),
        totalUnchecked: acc.totalUnchecked + (result.unchecked || 0),
        stepCount: acc.stepCount + 1,
        mainNum: mainNum,
      }),
      {
        totalMismatch: 0,
        totalMatch: 0,
        totalUnchecked: 0,
        stepCount: 0,
        mainNum: mainNum,
      }
    );

    return summary;
  }

  async upsertStepResult(
    dto: CreateStepResultDto
  ): Promise<StepResultResponseDto> {
    try {
      let stepId = dto.stepId;

      // mainNum과 subNum이 제공된 경우 stepId 찾기
      if (dto.mainNum && dto.subNum && !stepId) {
        const foundStepId = await this.stepResultRepository.findStepIdByMainSub(
          dto.mainNum,
          dto.subNum
        );
        if (!foundStepId) {
          return {
            success: false,
            error: '해당 mainNum과 subNum에 맞는 스탭을 찾을 수 없습니다.',
          };
        }
        stepId = foundStepId;
      }

      // stepId가 없으면 오류
      if (!stepId) {
        return {
          success: false,
          error: 'stepId 또는 mainNum+subNum이 필요합니다.',
        };
      }

      const stepResult = new StepResultEntity(
        undefined,
        dto.userAddressId,
        stepId,
        undefined, // mismatch - DB 트리거가 계산
        undefined, // match - DB 트리거가 계산
        undefined, // unchecked - DB 트리거가 계산
        dto.details,
        new Date()
      );

      const upsertedStepResult = await this.stepResultRepository.upsert(
        stepResult
      );

      return {
        success: true,
        data: upsertedStepResult,
        message: '스탭 결과 생성/수정 성공',
      };
    } catch (error) {
      console.error('❌ 스탭 결과 upsert 오류:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '스탭 결과 생성/수정 중 오류가 발생했습니다.',
      };
    }
  }
}
