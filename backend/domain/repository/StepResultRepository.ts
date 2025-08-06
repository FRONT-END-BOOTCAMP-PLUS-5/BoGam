import { StepResult } from '@be/domain/entities/StepResult';

export interface StepResultRepository {
  findByUserAddressId(userAddressId: number): Promise<StepResult[]>;
  findByUserAddressAndMainNum(userAddressId: number, mainNum: number): Promise<StepResult[]>;
  findByUserAddressAndMainSubNum(userAddressId: number, mainNum: number, subNum: number): Promise<StepResult | null>;
  findById(id: number): Promise<StepResult | null>;
  findByUserAddressAndStep(userAddressId: number, stepId: number): Promise<StepResult | null>;
  save(stepResult: StepResult): Promise<StepResult>;
  update(id: number, stepResult: Partial<StepResult>): Promise<StepResult>;
  delete(id: number): Promise<void>;
  findSummaryByMainStep(userAddressId: number, mainNum: number): Promise<StepResult[]>;
} 