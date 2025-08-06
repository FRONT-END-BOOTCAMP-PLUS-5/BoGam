import { StepResult } from '@be/domain/entities/StepResult';

export interface StepResultRepository {
  findByParams(params: Record<string, unknown>): Promise<StepResult[]>;
  save(stepResult: StepResult): Promise<StepResult>;
  update(id: number, stepResult: Partial<StepResult>): Promise<StepResult>;
  upsert(stepResult: StepResult): Promise<StepResult>;
  delete(id: number): Promise<void>;
} 