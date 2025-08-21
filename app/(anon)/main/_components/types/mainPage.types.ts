import { Location as MapLocation } from './map.types';

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
  nickname: string; // 자동 생성된 닉네임
  x: number; // longitude
  y: number; // latitude
  isPrimary: boolean; // 즐겨찾기
  legalDistrictCode?: string;

  // 주소 정보들
  lotAddress: string; // 지번 주소
  roadAddress: string; // 도로명 주소
  completeAddress: string; // 완전한 주소 (동/호 포함)

  // 동/호 정보 (별도 필드)
  dong?: string; // 동
  ho?: string; // 호

  // 휘발성 플래그 (새 주소 검색 시 임시 저장용)
  isVolatile?: boolean;
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
  location: MapLocation | null;
}

export interface BuildingType {
  category: 'residential' | 'commercial' | '';
  type: 'apartment' | 'villa' | 'officetel' | 'detached' | 'multi' | '';
}

export interface MainPageState {
  userAddresses: UserAddress[];
  selectedAddress: UserAddress | null;
  searchQuery: string;
  roadAddress: string;
  dong: string;
  ho: string;
  savedLawdCode: string;
  buildingType: BuildingType;
  transactionData: TransactionData[];
  selectedYear: string;
  selectedMonth: string;
  showPostcode: boolean;
}
