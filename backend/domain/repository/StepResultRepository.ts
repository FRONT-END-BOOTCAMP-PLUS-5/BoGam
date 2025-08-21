import { StepResultEntity } from '@be/domain/entities/StepResult';

export interface StepResultRepository {
  findByParams(params: Record<string, unknown>): Promise<StepResultEntity[]>;
  upsert(stepResult: StepResultEntity): Promise<StepResultEntity>;
  findStepIdByMainSub(stepNumber: number, detail: number): Promise<number | null>;
}
