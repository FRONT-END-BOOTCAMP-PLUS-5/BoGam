import { StepResultRepository } from '@be/domain/repository/StepResultRepository';
import { StepResult } from '@be/domain/entities/StepResult';
import { prisma } from '@utils/prisma';

export class StepResultRepositoryImpl implements StepResultRepository {

  async findByUserAddressId(userAddressId: number): Promise<StepResult[]> {
    try {
      const stepResults = await prisma.stepResult.findMany({
        where: { userAddressId },
        include: {
          step: true
        },
        orderBy: {
          stepId: 'asc'
        }
      });

      return stepResults.map((result) => new StepResult(
        result.id,
        result.userAddressId,
        result.stepId,
        result.mismatch,
        result.match,
        result.unchecked,
        result.createdAt
      ));
    } catch (error) {
      console.error('❌ StepResult 조회 오류:', error);
      throw new Error('스탭 결과 조회 중 오류가 발생했습니다.');
    }
  }

  async findById(id: number): Promise<StepResult | null> {
    try {
      const stepResult = await prisma.stepResult.findUnique({
        where: { id },
        include: {
          step: true
        }
      });

      if (!stepResult) {
        return null;
      }

      return new StepResult(
        stepResult.id,
        stepResult.userAddressId,
        stepResult.stepId,
        stepResult.mismatch,
        stepResult.match,
        stepResult.unchecked,
        stepResult.createdAt
      );
    } catch (error) {
      console.error('❌ StepResult 조회 오류:', error);
      throw new Error('스탭 결과 조회 중 오류가 발생했습니다.');
    }
  }

  async findByUserAddressAndStep(userAddressId: number, stepId: number): Promise<StepResult | null> {
    try {
      const stepResult = await prisma.stepResult.findFirst({
        where: {
          userAddressId,
          stepId
        },
        include: {
          step: true
        }
      });

      if (!stepResult) {
        return null;
      }

      return new StepResult(
        stepResult.id,
        stepResult.userAddressId,
        stepResult.stepId,
        stepResult.mismatch,
        stepResult.match,
        stepResult.unchecked,
        stepResult.createdAt
      );
    } catch (error) {
      console.error('❌ StepResult 조회 오류:', error);
      throw new Error('스탭 결과 조회 중 오류가 발생했습니다.');
    }
  }

  async save(stepResult: StepResult): Promise<StepResult> {
    try {
      const createdStepResult = await prisma.stepResult.create({
        data: {
          userAddressId: stepResult.userAddressId!,
          stepId: stepResult.stepId!,
          mismatch: stepResult.mismatch,
          match: stepResult.match,
          unchecked: stepResult.unchecked
        },
        include: {
          step: true
        }
      });

      return new StepResult(
        createdStepResult.id,
        createdStepResult.userAddressId,
        createdStepResult.stepId,
        createdStepResult.mismatch,
        createdStepResult.match,
        createdStepResult.unchecked,
        createdStepResult.createdAt
      );
    } catch (error) {
      console.error('❌ StepResult 생성 오류:', error);
      throw new Error('스탭 결과 생성 중 오류가 발생했습니다.');
    }
  }

  async update(id: number, stepResult: Partial<StepResult>): Promise<StepResult> {
    try {
      const updatedStepResult = await prisma.stepResult.update({
        where: { id },
        data: {
          mismatch: stepResult.mismatch,
          match: stepResult.match,
          unchecked: stepResult.unchecked
        },
        include: {
          step: true
        }
      });

      return new StepResult(
        updatedStepResult.id,
        updatedStepResult.userAddressId,
        updatedStepResult.stepId,
        updatedStepResult.mismatch,
        updatedStepResult.match,
        updatedStepResult.unchecked,
        updatedStepResult.createdAt
      );
    } catch (error) {
      console.error('❌ StepResult 수정 오류:', error);
      throw new Error('스탭 결과 수정 중 오류가 발생했습니다.');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await prisma.stepResult.delete({
        where: { id }
      });
    } catch (error) {
      console.error('❌ StepResult 삭제 오류:', error);
      throw new Error('스탭 결과 삭제 중 오류가 발생했습니다.');
    }
  }

  async findSummaryByMainStep(userAddressId: number, mainNum: number): Promise<StepResult[]> {
    try {
      const stepResults = await prisma.stepResult.findMany({
        where: {
          userAddressId,
          step: {
            mainNum
          }
        },
        include: {
          step: true
        },
        orderBy: {
          step: {
            subNum: 'asc'
          }
        }
      });

      return stepResults.map((result) => new StepResult(
        result.id,
        result.userAddressId,
        result.stepId,
        result.mismatch,
        result.match,
        result.unchecked,
        result.createdAt
      ));
    } catch (error) {
      console.error('❌ StepResult 요약 조회 오류:', error);
      throw new Error('스탭 결과 요약 조회 중 오류가 발생했습니다.');
    }
  }
} 