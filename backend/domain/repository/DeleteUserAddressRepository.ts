export interface DeleteUserAddressRepository {
  /**
   * 사용자 주소를 삭제합니다.
   * @param userAddressId 삭제할 사용자 주소 ID
   * @returns 삭제 성공 여부
   */
  deleteUserAddress(userAddressId: number): Promise<boolean>;
}
