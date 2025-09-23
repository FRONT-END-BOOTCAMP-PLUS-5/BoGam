export interface TransactionSearchData {
  commBuildingCode: string;
  resBuildingName: string;
  commAddrLotNumber: string;
  resBunji: string;
  commAddrRoadName: string;
}

import { TransactionData } from '@/(anon)/main/_components/types/mainPage.types';

export interface TransactionSearchApiResponse {
  success: boolean;
  message: string;
  data?: TransactionData[];
  error?: string;
  userAddressNickname: string;
}

export interface TransactionSearchFormData {
  selectedYear: string;
  selectedType: string;
  complexName: string;
  danjiName: string;
  targetArea: string;
  targetPrice: number;
  parsedAddress: {
    addrSido: string;
    addrSigungu: string;
    addrDong: string;
  };
}

export interface TransactionSearchInputProps {
  formData: TransactionSearchFormData;
  onSubmit: (data: TransactionSearchFormData) => void;
  loading: boolean;
  onSuccess?: () => void;
}

export interface TransactionSearchOutputProps {
  response: TransactionSearchApiResponse | null;
  loading: boolean;
  existsData?: unknown;
}
