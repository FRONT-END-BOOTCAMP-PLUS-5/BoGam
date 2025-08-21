export class StepResultEntity {
  constructor(
    public id?: number,
    public userAddressId?: number,
    public stepId?: number,
    public mismatch?: number | null,
    public match?: number | null,
    public unchecked?: number | null,
    public jsonDetails?: unknown,
    public createdAt?: Date,
    public updatedAt?: Date,
    public stepNumber?: number,
    public detail?: number
  ) {}
}
