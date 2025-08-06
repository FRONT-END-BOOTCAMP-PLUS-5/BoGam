import { StepResult } from '@be/domain/entities/StepResult';

export class CreateStepResultDto {
  constructor(
    public userAddressId: number,
    public stepId: number,
    public mismatch?: number,
    public match?: number,
    public unchecked?: number
  ) {}
}

export class UpdateStepResultDto {
  constructor(
    public mismatch?: number,
    public match?: number,
    public unchecked?: number
  ) {}
}

export class StepResultResponseDto {
  constructor(
    public success: boolean,
    public data?: StepResult | StepResult[],
    public error?: string,
    public message?: string
  ) {}
}

export class GetStepResultQueryDto {
  constructor(
    public userAddressId: number
  ) {}
} 