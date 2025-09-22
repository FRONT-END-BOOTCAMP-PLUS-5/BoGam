export class GuaranteeLimitCopyEntity {
  constructor(
    public id: number,
    public userAddressId: number,
    public guaranteeLimitData: string,
    public updatedAt: Date
  ) {}
}
