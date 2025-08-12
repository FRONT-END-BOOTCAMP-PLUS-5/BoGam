import { StepResultEntity } from '@be/domain/entities/StepResult';

export interface CreateStepResultDto {
  userAddressId: number;
  stepId?: number;
  mainNum?: number;
  subNum?: number;
  details: unknown;
}

export interface StepResultResponseDto {
  success: boolean;
  data?:
    | StepResultEntity
    | StepResultEntity[]
    | { results: StepResultEntity[]; summary: StepResultSummaryDto };
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
