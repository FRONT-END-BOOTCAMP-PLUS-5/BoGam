import { StepResult } from '@be/domain/entities/StepResult';

export interface StepResultRepository {
  findByParams(params: Record<string, unknown>): Promise<StepResult[]>;
  upsert(stepResult: StepResult): Promise<StepResult>;
  findStepIdByMainSub(mainNum: number, subNum: number): Promise<number | null>;
} 