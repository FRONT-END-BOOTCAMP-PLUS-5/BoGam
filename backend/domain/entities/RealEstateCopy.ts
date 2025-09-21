export class RealEstateCopyEntity {
  constructor(
    public readonly id: number,
    public readonly userAddressId: number,
    public readonly realEstateData: string,
    public readonly updatedAt?: Date
  ) {}
}
