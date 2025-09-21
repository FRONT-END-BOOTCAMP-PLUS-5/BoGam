export class TaxCertCopyEntity {
  constructor(
    public readonly id: number,
    public readonly userAddressId: number,
    public readonly taxCertData: string,
    public readonly updatedAt?: Date
  ) {}
}
