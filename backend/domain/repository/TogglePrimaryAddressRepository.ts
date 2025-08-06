export interface TogglePrimaryAddressRepository {
  updatePrimaryAddress(
    userId: string,
    userAddressId: number
  ): Promise<{ userAddressId: number; isPrimary: boolean }>;
}
