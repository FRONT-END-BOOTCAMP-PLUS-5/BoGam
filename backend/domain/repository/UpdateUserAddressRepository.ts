export interface UpdateUserAddressRepository {
  updateUserAddress(
    userId: string,
    userAddressId: number,
    updateData: {
      address?: string;
      nickname?: string;
      x?: number;
      y?: number;
      isPrimary?: boolean;
      dong?: string;
      ho?: string;
      completeAddress?: string;
    }
  ): Promise<{ userAddressId: number; updatedFields: string[] }>;
}
