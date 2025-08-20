export class BrokerCopyEntity {
  constructor(
    public readonly id: number,
    public readonly userAddressId: number,
    public readonly brokerData: string,
    public readonly updatedAt?: Date
  ) {}
}
