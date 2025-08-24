import { frontendAxiosInstance } from './axiosInstance';

export interface BrokerCopyData {
  id: number;
  userAddressId: number;
  brokerData: string;
  updatedAt: string;
}

export interface ExistsData {
  exists: boolean;
  updatedAt?: Date;
}

export interface BrokerApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: BrokerCopyData | ExistsData;
}

export interface BrokerSearchParams {
  userAddressNickname: string;
  brkrNm: string;
  bsnmCmpnm?: string;
  numOfRows?: number;
  pageNo?: number;
}

export interface CreateBrokerCopyParams {
  userAddressId: number;
  brokerJson: string;
}

class BrokerApi {
  private static instance: BrokerApi;
  private constructor() {}

  public static getInstance(): BrokerApi {
    if (!BrokerApi.instance) {
      BrokerApi.instance = new BrokerApi();
    }
    return BrokerApi.instance;
  }

  // 중개사 복사본 존재 여부 확인
  public async checkExists(
    userAddressNickname: string
  ): Promise<BrokerApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.get<BrokerApiResponse>(
      `/api/brokers/exists?userAddressNickname=${encodeURIComponent(
        userAddressNickname
      )}`
    );
    return response.data;
  }

  // 중개사 정보 조회 (API에서)
  public async searchBrokers(
    params: BrokerSearchParams
  ): Promise<BrokerApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const searchParams = new URLSearchParams({
      userAddressNickname: params.userAddressNickname,
      brkrNm: params.brkrNm,
    });

    if (params.bsnmCmpnm) {
      searchParams.append('bsnmCmpnm', params.bsnmCmpnm);
    }

    if (params.numOfRows) {
      searchParams.append('numOfRows', params.numOfRows.toString());
    }

    if (params.pageNo) {
      searchParams.append('pageNo', params.pageNo.toString());
    }

    const response = await axiosInstance.get<BrokerApiResponse>(
      `/api/brokers?${searchParams.toString()}`
    );
    return response.data;
  }

  // 중개사 복사본 DB 조회
  public async getBrokerCopy(
    userAddressNickname: string
  ): Promise<BrokerApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.get<BrokerApiResponse>(
      `/api/copies/broker?userAddressNickname=${encodeURIComponent(
        userAddressNickname
      )}`
    );
    return response.data;
  }

  // 중개사 복사본 생성/수정
  public async createBrokerCopy(
    params: CreateBrokerCopyParams
  ): Promise<BrokerApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.post<BrokerApiResponse>(
      '/api/copies/broker',
      params
    );
    return response.data;
  }
}

export const brokerApi = BrokerApi.getInstance();
export default brokerApi;
