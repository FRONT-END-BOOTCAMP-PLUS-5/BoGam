import { Location } from './map.types';

export interface DaumPostcodeData {
  zonecode: string;
  address: string;
  roadAddress: string;
  jibunAddress: string;
  userSelectedType: 'R' | 'J';
  bname: string;
  buildingName: string;
  apartment: string;
  sigunguCode: string;
  bcode: string;
}

export interface DaumPostcodeSize {
  height: number;
  width: number;
}

export interface DaumPostcode {
  new (options: {
    oncomplete: (data: DaumPostcodeData) => void;
    onresize: (size: DaumPostcodeSize) => void;
    width: string;
    height: string;
  }): {
    embed: (element: HTMLDivElement | null) => void;
  };
}

export interface UserAddress {
  id: number;
  address: string;
  nickname: string;
  x: number;
  y: number;
  isPrimary: boolean;
}

export interface TransactionData {
  id: string;
  아파트: string;
  거래금액: string;
  전용면적: string;
  층: string;
  건축년도: string;
  년: string;
  월: string;
  일: string;
  법정동: string;
  지번: string;
  location: Location;
}

export interface BuildingType {
  category: 'residential' | 'commercial' | '';
  type: 'apartment' | 'villa' | 'officetel' | 'detached' | 'multi' | '';
}

export interface MainPageState {
  userAddresses: UserAddress[];
  selectedAddress: UserAddress | null;
  searchQuery: string;
  detailAddress: string;
  dong: string;
  ho: string;
  fullAddress: string;
  savedLawdCode: string;
  buildingType: BuildingType;
  mapCenter: Location;
  transactionData: TransactionData[];
  searchLocationMarker: Location | null;
  selectedYear: string;
  selectedMonth: string;
  isLoading: boolean;
  showPostcode: boolean;
}
