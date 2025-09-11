import { frontendAxiosInstance } from './axiosInstance';

export interface UpdateSelectedAddressRequest {
  userNickname: string;
  addressId: number;
}

export interface UpdateSelectedAddressResponse {
  success: boolean;
  message: string;
}

export const selectedAddressApi = {
  /**
   * 선택된 주소 상태 업데이트
   */
  updateSelectedAddress: async (
    request: UpdateSelectedAddressRequest
  ): Promise<UpdateSelectedAddressResponse> => {
    const response = await frontendAxiosInstance
      .getAxiosInstance()
      .post('/api/user-address/selected/update', request);

    return response.data as UpdateSelectedAddressResponse;
  },
};
