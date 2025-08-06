import { StepResultRepository } from '@be/domain/repository/StepResultRepository';
import { StepResult } from '@be/domain/entities/StepResult';
import { prisma } from '@utils/prisma';

export class StepResultRepositoryImpl implements StepResultRepository {

  async findByParams(params: Record<string, unknown>): Promise<StepResult[]> {
    try {
      // WHERE 조건 구성
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
      
      // step 테이블과의 JOIN 조건
      if (params.mainNum || params.subNum) {
        where.step = {};
        if (params.mainNum) {
          (where.step as Record<string, unknown>).mainNum = params.mainNum;
        }
        if (params.subNum) {
          (where.step as Record<string, unknown>).subNum = params.subNum;
        }
      }

      // ORDER BY 조건 구성
      const orderBy: Record<string, unknown> = {};
      if (params.mainNum && params.subNum) {
        // 특정 스탭 조회 시
        orderBy.stepId = 'asc';
      } else if (params.mainNum) {
        // mainNum으로 조회 시 subNum 순으로 정렬
        orderBy.step = {
          subNum: 'asc'
        };
      } else {
        // 기본 정렬
        orderBy.stepId = 'asc';
      }

      const stepResults = await prisma.stepResult.findMany({
        where,
        include: {
          step: true
        },
        orderBy,
        take: params.limit as number,
        skip: params.offset as number
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

  async upsert(stepResult: StepResult): Promise<StepResult> {
    try {
      // 먼저 기존 데이터가 있는지 확인
      const existingStepResult = await prisma.stepResult.findFirst({
        where: {
          userAddressId: stepResult.userAddressId!,
          stepId: stepResult.stepId!
        }
      });

      let upsertedStepResult;

      if (existingStepResult) {
        // 기존 데이터가 있으면 UPDATE
        upsertedStepResult = await prisma.stepResult.update({
          where: { id: existingStepResult.id },
          data: {
            mismatch: stepResult.mismatch,
            match: stepResult.match,
            unchecked: stepResult.unchecked
          },
          include: {
            step: true
          }
        });
      } else {
        // 기존 데이터가 없으면 CREATE
        upsertedStepResult = await prisma.stepResult.create({
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
      }

      return new StepResult(
        upsertedStepResult.id,
        upsertedStepResult.userAddressId,
        upsertedStepResult.stepId,
        upsertedStepResult.mismatch,
        upsertedStepResult.match,
        upsertedStepResult.unchecked,
        upsertedStepResult.createdAt
      );
    } catch (error) {
      console.error('❌ StepResult upsert 오류:', error);
      throw new Error('스탭 결과 upsert 중 오류가 발생했습니다.');
    }
  }
} 