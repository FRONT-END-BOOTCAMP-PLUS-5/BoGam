export interface AddressInfo {
  id: number;
  latitude?: number;
  longitude?: number;
  legalDistrictCode?: string;
  dong?: string;
  ho?: string;
}

export interface AddressLocationParams {
  latitude: number;
  longitude: number;
  legalDistrictCode: string;
  dong: string;
  ho: string;
}
