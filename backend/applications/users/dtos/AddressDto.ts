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

export interface AddressLocationParams {
  latitude: number;
  longitude: number;
  legalDistrictCode: string;
  dong: string;
  ho: string;
  lotAddress: string;
  roadAddress?: string;
}
