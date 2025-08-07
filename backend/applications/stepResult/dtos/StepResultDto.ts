import { StepResult } from '@be/domain/entities/StepResult';

export interface CreateStepResultDto {
  userAddressId: number;
  stepId?: number;
  mainNum?: number;
  subNum?: number;
  mismatch?: number;
  match?: number;
  unchecked?: number;
}

export interface StepResultResponseDto {
  success: boolean;
  data?: StepResult | StepResult[] | { results: StepResult[]; summary: StepResultSummaryDto };
  error?: string;
  message?: string;
}

export interface StepResultSummaryDto {
  totalMismatch: number;
  totalMatch: number;
  totalUnchecked: number;
  stepCount: number;
  mainNum: number;
} 