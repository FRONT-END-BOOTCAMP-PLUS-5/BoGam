export interface AddressInfo {
  id: number;
  latitude?: number;
  longitude?: number;
  legalDistrictCode?: string;
  dong?: string;
  ho?: string;
<<<<<<< HEAD:backend/applications/place/dtos/AddressDto.ts
  lotAddress?: string;
=======
  lotAddress: string;
  roadAddress?: string;
>>>>>>> develop:backend/applications/users/dtos/AddressDto.ts
}

export interface AddressLocationParams {
  latitude: number;
  longitude: number;
  legalDistrictCode: string;
  dong: string;
  ho: string;
  lotAddress: string;
<<<<<<< HEAD:backend/applications/place/dtos/AddressDto.ts
=======
  roadAddress?: string;
>>>>>>> develop:backend/applications/users/dtos/AddressDto.ts
}
