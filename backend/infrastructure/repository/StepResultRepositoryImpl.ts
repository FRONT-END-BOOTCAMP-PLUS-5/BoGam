import { StepResultRepository } from '@be/domain/repository/StepResultRepository';
import { StepResult } from '@be/domain/entities/StepResult';
import { prisma } from '@utils/prisma';

export class StepResultRepositoryImpl implements StepResultRepository {
  async findByParams(params: Record<string, unknown>): Promise<StepResult[]> {
    try {
      const where: Record<string, unknown> = {};
      if (params.userAddressId) { where.userAddressId = params.userAddressId; }
      if (params.id) { where.id = params.id; }
      if (params.stepId) { where.stepId = params.stepId; }

      if (params.mainNum || params.subNum) {
        where.step = {};
        if (params.mainNum) { (where.step as Record<string, unknown>).mainNum = params.mainNum; }
        if (params.subNum) { (where.step as Record<string, unknown>).subNum = params.subNum; }
      }

      const orderBy: Record<string, unknown> = {};
      if (params.mainNum && params.subNum) {
        orderBy.stepId = 'asc';
      } else if (params.mainNum) {
        orderBy.step = { subNum: 'asc' };
      } else {
        orderBy.stepId = 'asc';
      }

      const stepResults = await prisma.stepResult.findMany({
        where,
        include: { step: true },
        orderBy,
        take: params.limit as number,
        skip: params.offset as number
      });

      return stepResults.map((result) => new StepResult(
        result.id, result.userAddressId, result.stepId,
        result.mismatch, result.match, result.unchecked, result.createdAt,
        result.step?.mainNum, result.step?.subNum
      ));
    } catch (error) {
      console.error('❌ StepResult 조회 오류:', error);
      throw new Error('스탭 결과 조회 중 오류가 발생했습니다.');
    }
  }

  async upsert(stepResult: StepResult): Promise<StepResult> {
    try {
      const upsertedStepResult = await prisma.stepResult.upsert({
        where: {
          userAddressId_stepId: {
            userAddressId: stepResult.userAddressId!,
            stepId: stepResult.stepId!
          }
        },
        create: {
          userAddressId: stepResult.userAddressId!,
          stepId: stepResult.stepId!,
          mismatch: stepResult.mismatch,
          match: stepResult.match,
          unchecked: stepResult.unchecked
        },
        update: {
          mismatch: stepResult.mismatch,
          match: stepResult.match,
          unchecked: stepResult.unchecked
        },
        include: { step: true }
      });

      return new StepResult(
        upsertedStepResult.id, upsertedStepResult.userAddressId, upsertedStepResult.stepId,
        upsertedStepResult.mismatch, upsertedStepResult.match, upsertedStepResult.unchecked, upsertedStepResult.createdAt,
        upsertedStepResult.step?.mainNum, upsertedStepResult.step?.subNum
      );
    } catch (error) {
      console.error('❌ StepResult upsert 오류:', error);
      throw new Error('스탭 결과 upsert 중 오류가 발생했습니다.');
    }
  }

  async findStepIdByMainSub(mainNum: number, subNum: number): Promise<number | null> {
    try {
      const step = await prisma.step.findFirst({
        where: { mainNum, subNum }
      });
      return step?.id || null;
    } catch (error) {
      console.error('❌ Step 조회 오류:', error);
      throw new Error('스탭 조회 중 오류가 발생했습니다.');
    }
  }
} 