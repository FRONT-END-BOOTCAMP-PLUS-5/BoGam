import { StepResultRepository } from '@be/domain/repository/StepResultRepository';
import { StepResultEntity } from '@be/domain/entities/StepResult';
import { prisma } from '@utils/prisma';

export class StepResultRepositoryImpl implements StepResultRepository {
  async findByParams(
    params: Record<string, unknown>
  ): Promise<StepResultEntity[]> {
    try {
      const where: Record<string, unknown> = {};
      if (params.userAddressId) {
        where.userAddressId = params.userAddressId;
      }
      if (params.id) {
        where.id = params.id;
      }
      if (params.stepId) {
        where.stepId = params.stepId;
      }

      if (params.stepNumber || params.detail) {
        where.step = {};
        if (params.stepNumber) {
          (where.step as Record<string, unknown>).mainNum = params.stepNumber; // Prisma에서는 'mainNum' 필드 사용
        }
        if (params.detail) {
          (where.step as Record<string, unknown>).subNum = params.detail; // Prisma에서는 'subNum' 필드 사용
        }
      }

      const orderBy: Record<string, unknown> = {};
      if (params.stepNumber && params.detail) {
        orderBy.stepId = 'asc';
      } else if (params.stepNumber) {
        orderBy.step = { subNum: 'asc' }; // Prisma에서는 'subNum' 필드 사용
      } else {
        orderBy.stepId = 'asc';
      }

      const stepResults = await prisma.stepResult.findMany({
        where,
        include: { step: true },
        orderBy,
        take: params.limit as number,
        skip: params.offset as number,
      });

              return stepResults.map(
          (result) =>
            new StepResultEntity(
              result.id,
              result.userAddressId,
              result.stepId,
              result.mismatch,
              result.match,
              result.unchecked,
              result.details, // Prisma에서는 여전히 'details' 필드 사용
              result.createdAt,
              result.updatedAt,
              result.step?.mainNum, // Prisma에서는 여전히 'mainNum' 필드 사용
              result.step?.subNum   // Prisma에서는 여전히 'subNum' 필드 사용
            )
        );
    } catch (error) {
      console.error('❌ StepResult 조회 오류:', error);
      throw new Error('스탭 결과 조회 중 오류가 발생했습니다.');
    }
  }

  async upsert(stepResult: StepResultEntity): Promise<StepResultEntity> {
    try {
      const upsertedStepResult = await prisma.stepResult.upsert({
        where: {
          userAddressId_stepId: {
            userAddressId: stepResult.userAddressId!,
            stepId: stepResult.stepId!,
          },
        },
        create: {
          userAddressId: stepResult.userAddressId!,
          stepId: stepResult.stepId!,
          details: stepResult.jsonDetails as never, // Prisma에서는 'details' 필드 사용
        },
        update: {
          details: stepResult.jsonDetails as never, // Prisma에서는 'details' 필드 사용
        },
        include: { step: true },
      });

      const result = upsertedStepResult as unknown as {
        id: number;
        userAddressId: number;
        stepId: number;
        mismatch: number | null;
        match: number | null;
        unchecked: number | null;
        details: unknown;
        createdAt: Date;
        updatedAt: Date;
        step?: { mainNum: number; subNum: number };
      };
      return new StepResultEntity(
        result.id,
        result.userAddressId,
        result.stepId,
        result.mismatch,
        result.match,
        result.unchecked,
        result.details, // Prisma에서는 'details' 필드 사용
        result.createdAt,
        result.updatedAt,
        result.step?.mainNum, // Prisma에서는 'mainNum' 필드 사용
        result.step?.subNum   // Prisma에서는 'subNum' 필드 사용
      );
    } catch (error) {
      console.error('❌ StepResult upsert 오류:', error);
      throw new Error('스탭 결과 upsert 중 오류가 발생했습니다.');
    }
  }

  async findStepIdByMainSub(
    stepNumber: number,
    detail: number
  ): Promise<number | null> {
    try {
      const step = await prisma.step.findFirst({
        where: { mainNum: stepNumber, subNum: detail }, // Prisma에서는 'mainNum', 'subNum' 필드 사용
      });
      return step?.id || null;
    } catch (error) {
      console.error('❌ Step 조회 오류:', error);
      throw new Error('스탭 조회 중 오류가 발생했습니다.');
    }
  }
}
