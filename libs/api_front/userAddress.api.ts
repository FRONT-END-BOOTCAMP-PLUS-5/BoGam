import { frontendAxiosInstance } from './axiosInstance';

// 사용자 주소 타입 정의
export interface UserAddress {
  id: number;
  address: string;
  nickname: string;
  x: number;
  y: number;
  isPrimary: boolean;
}

// 백엔드 API 응답 타입 정의
export interface AddressInfo {
  id: number;
  latitude?: number;
  longitude?: number;
  legalDistrictCode?: string;
  dong?: string;
  ho?: string;
  lotAddress: string;
  roadAddress?: string;
}

export interface UserAddressWithAddressInfo {
  id: number;
  userId: string;
  addressId: number;
  nickname: string;
  createdAt: Date;
  isPrimary: boolean;
  address: AddressInfo;
}

/**
 * 사용자 주소 API 클래스
 */
class UserAddressApi {
  private static instance: UserAddressApi;

  private constructor() {}

  public static getInstance(): UserAddressApi {
    if (!UserAddressApi.instance) {
      UserAddressApi.instance = new UserAddressApi();
    }
    return UserAddressApi.instance;
  }

  /**
   * 사용자 주소 목록 조회
   */
  public async getMyAddressList(): Promise<{
    success: boolean;
    message: string;
    data?: UserAddressWithAddressInfo[];
  }> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.get(
      '/api/user-address/my-address-list'
    );

    return response.data as {
      success: boolean;
      message: string;
      data?: UserAddressWithAddressInfo[];
    };
  }

  /**
   * 주소 추가
   */
  public async addAddress(addressData: {
    addressNickname?: string;
    latitude: number;
    longitude: number;
    legalDistrictCode: string;
    dong: string;
    ho?: string;
    lotAddress: string;
    roadAddress: string;
  }): Promise<{ success: boolean; message: string; data?: unknown }> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.post('/api/user-address', addressData);

    return response.data as {
      success: boolean;
      message: string;
      data?: unknown;
    };
  }

  /**
   * 주소 수정
   */
  public async updateAddress(
    id: number,
    addressData: {
      address?: string;
      nickname?: string;
      x?: number;
      y?: number;
      isPrimary?: boolean;
    }
  ): Promise<UserAddress> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.put<UserAddress>(
      `/api/user-address/${id}`,
      addressData
    );

    return response.data;
  }

  /**
   * 주소 삭제
   */
  public async deleteAddress(id: number): Promise<void> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    await axiosInstance.delete(`/api/user-address?userAddressId=${id}`);
  }

  /**
   * 기본 주소 설정
   */
  public async setPrimaryAddress(id: number): Promise<UserAddress> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.patch<UserAddress>(
      `/api/user-address/${id}/toggle-primary`
    );

    return response.data;
  }
}

export const userAddressApi = UserAddressApi.getInstance();
export default userAddressApi;
