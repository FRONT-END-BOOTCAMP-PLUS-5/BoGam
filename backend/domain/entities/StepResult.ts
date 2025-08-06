export class StepResult {
  constructor(
    public id?: number,
    public userAddressId?: number,
    public stepId?: number,
    public mismatch?: number | null,
    public match?: number | null,
    public unchecked?: number | null,
    public createdAt?: Date
  ) {}
} 